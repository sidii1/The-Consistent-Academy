import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPayment, reconcile, toReceipt } from "./_lib/payments.js";

/**
 * GET /api/payment-status?orderId=...
 * Polled by the checkout modal every ~3 s. The unguessable orderId acts as the
 * access token. While the order is unsettled this asks Razorpay directly, so the
 * flow works with or without webhooks.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });
  const orderId = String(req.query.orderId || "");
  if (!/^TCA[A-Z0-9]{8,40}$/.test(orderId)) return res.status(400).json({ error: "Invalid order." });

  try {
    let p = await getPayment(orderId);
    if (!p) return res.status(404).json({ error: "Order not found." });
    if (p.status !== "paid") p = (await reconcile(orderId)) || p;

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      orderId,
      status: p.status,
      mode: p.mode,
      amount: p.amount,
      failureReason: p.status === "failed" || p.status === "expired" ? p.failureReason || null : null,
      receipt: p.status === "paid" ? toReceipt(p) : null,
      emailStatus: p.emailStatus || null,
    });
  } catch (err) {
    console.error("payment-status error:", err);
    return res.status(500).json({ error: "Could not check payment status." });
  }
}
