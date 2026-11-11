import { Resend } from "resend";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebaseAdmin.js";
import { fetchQr, fetchQrPayments, razorpayMode, type RzpPayment } from "./razorpay.js";
import { buildReceiptHtml, type ReceiptData } from "../../shared/receipt.js";

/**
 * Payment state machine (Firestore collection `payments/{orderId}`):
 *
 *   created ──► pending ──► paid        (terminal, set exactly once)
 *                  │  ▲
 *                  ▼  │ (a late successful payment can still rescue these)
 *               failed / expired
 *
 * `markPaid` is the ONLY place a payment becomes "paid". It is called from both
 * the webhook and the status poller, is idempotent (Firestore transaction), and
 * is the only place the receipt + confirmation emails are produced — so
 * webhook + poll racing each other can never send two emails.
 */

export const PAYMENTS = "payments";

export type PaymentStatus = "created" | "pending" | "paid" | "failed" | "expired";

export interface PaymentDoc {
  orderId: string;
  status: PaymentStatus;
  mode: "test" | "live";
  productId: string;
  productName: string;
  listPrice: number;
  discountType: string;
  discountLabel: string | null;
  discountAmount: number;
  amount: number; // rupees actually charged
  amountPaise: number;
  customer: { name: string; email: string; phone: string };
  details: { label: string; value: string }[];
  qrId?: string;
  qrImageUrl?: string;
  expiresAt?: number; // ms epoch
  receiptNo?: string;
  paymentId?: string;
  method?: string;
  paidAt?: string;
  failureReason?: string;
  emailStatus?: "pending" | "sent" | "failed";
  lastCheckedAt?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

const ref = (orderId: string) => adminDb().collection(PAYMENTS).doc(orderId);

export const getPayment = async (orderId: string): Promise<PaymentDoc | null> => {
  const snap = await ref(orderId).get();
  return snap.exists ? (snap.data() as PaymentDoc) : null;
};

export const findByQrId = async (qrId: string): Promise<PaymentDoc | null> => {
  const q = await adminDb().collection(PAYMENTS).where("qrId", "==", qrId).limit(1).get();
  return q.empty ? null : (q.docs[0].data() as PaymentDoc);
};

export const toReceipt = (p: PaymentDoc): ReceiptData => ({
  receiptNo: p.receiptNo!,
  orderId: p.orderId,
  paymentId: p.paymentId,
  paidAt: p.paidAt!,
  customerName: p.customer.name,
  customerEmail: p.customer.email,
  customerPhone: p.customer.phone,
  productName: p.productName,
  listPrice: p.listPrice,
  discountLabel: p.discountLabel,
  discountAmount: p.discountAmount,
  amountPaid: p.amount,
  method: p.method,
  testMode: p.mode === "test",
  details: p.details,
});

/* ------------------------------------------------------------------ */

const sendEmails = async (p: PaymentDoc): Promise<"sent" | "failed"> => {
  if (!process.env.RESEND_API_KEY) return "failed";
  const resend = new Resend(process.env.RESEND_API_KEY);
  // NOTE: onboarding@resend.dev can only deliver to the Resend account owner.
  // Verify a domain in Resend and set EMAIL_FROM to email real customers.
  const from = process.env.EMAIL_FROM || "The Consistent Academy <onboarding@resend.dev>";
  const academy = process.env.PAYMENT_NOTIFY_EMAIL || "theconsistentacademy@gmail.com";
  const receipt = buildReceiptHtml(toReceipt(p));
  let ok = true;

  try {
    await resend.emails.send({
      from,
      to: [p.customer.email],
      subject: `Payment received – ${p.productName} (Receipt ${p.receiptNo})`,
      html: `<p>Hello ${escapeHtml(p.customer.name)},</p><p><b>Payment Received and Confirmed.</b> Thank you for enrolling in <b>${escapeHtml(p.productName)}</b> with The Consistent Academy. Your receipt is below; our team will contact you shortly with next steps.</p>${receipt}`,
    });
  } catch (e) {
    console.error("Customer confirmation email failed:", e);
    ok = false;
  }

  try {
    await resend.emails.send({
      from,
      to: [academy],
      subject: `New payment: ${p.productName} – ₹${p.amount.toLocaleString("en-IN")} (${p.mode})`,
      html: `<p>New ${p.mode}-mode payment received.</p>${receipt}`,
    });
  } catch (e) {
    console.error("Academy notification email failed:", e);
  }
  return ok ? "sent" : "failed";
};

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

/* ------------------------------------------------------------------ */

/**
 * Idempotently mark an order as paid. Returns the final doc.
 * The captured amount MUST equal the amount we asked for (defends against a
 * wrong-amount payment ever unlocking a programme).
 */
export const markPaid = async (orderId: string, payment: RzpPayment): Promise<PaymentDoc | null> => {
  const r = ref(orderId);
  let firstTime = false;

  await adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(r);
    if (!snap.exists) return;
    const p = snap.data() as PaymentDoc;
    if (p.status === "paid") return; // already settled — idempotent
    if (payment.amount !== p.amountPaise || payment.currency !== "INR") {
      console.error(`Amount mismatch for ${orderId}: expected ${p.amountPaise}, got ${payment.amount} ${payment.currency}`);
      return;
    }
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    tx.update(r, {
      status: "paid",
      paymentId: payment.id,
      method: payment.method || "upi",
      paidAt: new Date().toISOString(),
      receiptNo: `TCA-${day}-${orderId.slice(-6).toUpperCase()}`,
      failureReason: FieldValue.delete(),
      emailStatus: "pending",
      updatedAt: FieldValue.serverTimestamp(),
    });
    firstTime = true;
  });

  let doc = await getPayment(orderId);
  if (firstTime && doc) {
    const emailStatus = await sendEmails(doc);
    await r.update({ emailStatus });
    doc = { ...doc, emailStatus };
  }
  return doc;
};

export const markFailed = async (orderId: string, status: "failed" | "expired", reason: string) => {
  await adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref(orderId));
    if (!snap.exists) return;
    const p = snap.data() as PaymentDoc;
    if (p.status === "paid") return; // never downgrade a paid order
    tx.update(ref(orderId), { status, failureReason: reason, updatedAt: FieldValue.serverTimestamp() });
  });
};

/**
 * Poll-side reconciliation: ask Razorpay what happened to this order's QR.
 * This makes test-mode work end-to-end WITHOUT webhooks, and stays on as a
 * safety net in live mode if a webhook is ever delayed or missed.
 */
export const reconcile = async (orderId: string): Promise<PaymentDoc | null> => {
  const p = await getPayment(orderId);
  if (!p || p.status === "paid" || !p.qrId) return p;
  if (razorpayMode() !== p.mode) return p; // keys changed mid-flight; don't mix modes

  // Throttle Razorpay calls to ~1 per 2.5 s per order.
  if (p.lastCheckedAt && Date.now() - p.lastCheckedAt < 2500) return p;
  await ref(orderId).update({ lastCheckedAt: Date.now() });

  const payments = await fetchQrPayments(p.qrId);
  const captured = payments.find((x) => x.status === "captured" || (x.status === "authorized" && x.captured));
  if (captured) return markPaid(orderId, captured);

  const failed = payments.find((x) => x.status === "failed");
  const expired = p.expiresAt ? Date.now() > p.expiresAt : false;

  if (expired) {
    const qr = await fetchQr(p.qrId).catch(() => null);
    // Re-check once more in case a payment landed at the buzzer.
    const late = (await fetchQrPayments(p.qrId)).find((x) => x.status === "captured");
    if (late) return markPaid(orderId, late);
    await markFailed(orderId, "expired", failed?.error_description || (qr?.status === "closed" ? "QR closed without payment" : "QR expired"));
  } else if (failed && p.status !== "failed") {
    await markFailed(orderId, "failed", failed.error_description || "Payment failed");
  }
  return getPayment(orderId);
};
