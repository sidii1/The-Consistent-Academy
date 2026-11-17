import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getAuth } from "firebase-admin/auth";
import { adminDb } from "./_lib/firebaseAdmin.js";
import { PAYMENTS, type PaymentDoc } from "./_lib/payments.js";

/**
 * GET /api/admin-payments
 * Header: Authorization: Bearer <Firebase ID token>
 *
 * Lists orders for the admin panel. Read through the Admin SDK so the
 * `payments` collection never has to be opened up in Firestore rules.
 * Access requires the same `admin: true` custom claim AdminDashboard checks.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Not signed in." });

  try {
    adminDb(); // initialises the Admin app
    const decoded = await getAuth().verifyIdToken(token);
    if (decoded.admin !== true) return res.status(403).json({ error: "Access denied." });
  } catch {
    return res.status(401).json({ error: "Session expired. Please sign in again." });
  }

  try {
    const snap = await adminDb().collection(PAYMENTS).orderBy("createdAt", "desc").limit(1000).get();
    const toMs = (v: unknown) =>
      v && typeof (v as { toMillis?: () => number }).toMillis === "function"
        ? (v as { toMillis: () => number }).toMillis()
        : null;

    const payments = snap.docs.map((d) => {
      const p = d.data() as PaymentDoc;
      return {
        orderId: p.orderId,
        status: p.status,
        mode: p.mode,
        productId: p.productId,
        productName: p.productName,
        listPrice: p.listPrice,
        discountLabel: p.discountLabel,
        discountAmount: p.discountAmount,
        amount: p.amount,
        customer: p.customer,
        details: p.details || [],
        receiptNo: p.receiptNo || null,
        paymentId: p.paymentId || null,
        method: p.method || null,
        paidAt: p.paidAt || null,
        failureReason: p.failureReason || null,
        emailStatus: p.emailStatus || null,
        createdAt: toMs(p.createdAt),
      };
    });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ payments });
  } catch (err) {
    console.error("admin-payments error:", err);
    return res.status(500).json({ error: "Could not load payments." });
  }
}
