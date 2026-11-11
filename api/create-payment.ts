import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./_lib/firebaseAdmin.js";
import { createUpiQr, isConfigured, razorpayMode, RazorpayError } from "./_lib/razorpay.js";
import { PAYMENTS, type PaymentDoc } from "./_lib/payments.js";
import { getProduct, quotePrice, WORKSHOP_DATES, type DiscountType } from "../shared/pricing.js";

/** QR validity. Razorpay allows 2 min – 2 h for single-use QR codes. */
const QR_TTL_MINUTES = 15;

const clean = (v: unknown, max = 120) => String(v ?? "").trim().slice(0, max);

/**
 * POST /api/create-payment
 * Body: { productId, discountType?, customer:{name,email,phone}, meta?:{...} }
 * NEVER accepts an amount — the price is recomputed here from shared/pricing.ts.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  if (!isConfigured()) {
    return res.status(503).json({ error: "Payments are not configured yet. Please try again later." });
  }

  try {
    const { productId, discountType = "none", customer = {}, meta = {} } = req.body || {};

    const name = clean(customer.name);
    const email = clean(customer.email, 160).toLowerCase();
    const phone = clean(customer.phone, 20).replace(/[^\d+]/g, "");
    if (name.length < 2) return res.status(400).json({ error: "Please enter the student/parent name." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email." });
    if (phone.replace(/\D/g, "").length < 10) return res.status(400).json({ error: "Please enter a valid phone number." });

    const product = getProduct(String(productId));
    if (!product) return res.status(400).json({ error: "Unknown programme." });

    const groupSize = Number(meta.groupSize) || 0;
    const result = quotePrice(product.id, discountType as DiscountType, { groupSize });
    if (!result.ok) return res.status(400).json({ error: result.error });
    const { quote } = result;

    // Programme-specific details that are stored with the order & printed on the receipt.
    const details: { label: string; value: string }[] = [];
    if (product.needsSchedule) {
      const mode = meta.mode === "Offline" ? "Offline" : "Online";
      details.push({ label: "Mode", value: mode });
      const date = WORKSHOP_DATES.find((d) => d.value === meta.date);
      if (date) details.push({ label: "Preferred dates", value: date.label });
    }
    if (discountType === "sibling") {
      if (!clean(meta.siblingName)) return res.status(400).json({ error: "Please enter your sibling's name." });
      details.push({ label: "Sibling", value: clean(meta.siblingName) });
    }
    if (discountType === "school_group") {
      if (!clean(meta.schoolName)) return res.status(400).json({ error: "Please enter your school's name." });
      details.push({ label: "School", value: clean(meta.schoolName) }, { label: "Group size", value: String(groupSize) });
    }
    if (clean(meta.studentName)) details.unshift({ label: "Student", value: clean(meta.studentName) });

    const orderId = "TCA" + Date.now().toString(36).toUpperCase() + randomBytes(5).toString("hex").toUpperCase();
    const mode = razorpayMode();
    const expiresAt = Date.now() + QR_TTL_MINUTES * 60_000;

    const doc: PaymentDoc = {
      orderId,
      status: "created",
      mode,
      productId: product.id,
      productName: product.name,
      listPrice: quote.listPrice,
      discountType: quote.discountType,
      discountLabel: quote.discountLabel,
      discountAmount: quote.discountAmount,
      amount: quote.payable,
      amountPaise: quote.payablePaise,
      customer: { name, email, phone },
      details,
      expiresAt,
    };
    const ref = adminDb().collection(PAYMENTS).doc(orderId);
    await ref.set({ ...doc, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });

    let qr;
    try {
      qr = await createUpiQr({
        name: `TCA ${orderId}`,
        description: product.name.slice(0, 100),
        amountPaise: quote.payablePaise,
        closeBy: Math.floor(expiresAt / 1000),
        notes: { orderId, productId: product.id },
      });
    } catch (e) {
      await ref.update({ status: "failed", failureReason: e instanceof Error ? e.message : "QR creation failed" });
      throw e;
    }

    await ref.update({ status: "pending", qrId: qr.id, qrImageUrl: qr.image_url, updatedAt: FieldValue.serverTimestamp() });

    return res.status(200).json({
      orderId,
      mode,
      amount: quote.payable,
      productName: product.name,
      simulationEnabled: mode === "test" && process.env.ALLOW_PAYMENT_SIMULATION === "true",
      qr: { imageUrl: qr.image_url, expiresAt },
    });
  } catch (err) {
    console.error("create-payment error:", err);
    if (err instanceof RazorpayError) {
      const hint = /not (enabled|activated)|feature|authori[sz]ation|not allowed/i.test(err.message)
        ? " (UPI QR may need to be activated on the Razorpay account.)"
        : "";
      return res.status(502).json({ error: `Could not start the payment: ${err.message}${hint}` });
    }
    return res.status(500).json({ error: "Could not start the payment. Please try again." });
  }
}
