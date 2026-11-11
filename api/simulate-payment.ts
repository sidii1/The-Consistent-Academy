import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPayment, markPaid, markFailed } from "./_lib/payments.js";
import { razorpayMode } from "./_lib/razorpay.js";

/**
 * TEST-MODE ONLY helper: lets you exercise the full success/failure UI, receipt
 * and email pipeline without a real UPI app (Razorpay test QR codes cannot be
 * scanned/paid).
 *
 * Triple-guarded — it refuses to run unless ALL of these hold:
 *   1. ALLOW_PAYMENT_SIMULATION=true is set in the server env
 *   2. the Razorpay key is a rzp_test_ key (mode === "test")
 *   3. the order itself was created in test mode
 * Remove ALLOW_PAYMENT_SIMULATION (or just switch to live keys) and it is inert.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  if (process.env.ALLOW_PAYMENT_SIMULATION !== "true" || razorpayMode() !== "test") {
    return res.status(403).json({ error: "Simulation is disabled." });
  }

  const { orderId, outcome = "success" } = req.body || {};
  const p = await getPayment(String(orderId));
  if (!p || p.mode !== "test") return res.status(403).json({ error: "Simulation is only allowed for test-mode orders." });

  if (outcome === "failure") {
    await markFailed(p.orderId, "failed", "Simulated failure (test mode)");
  } else {
    await markPaid(p.orderId, {
      id: "pay_SIMULATED_" + p.orderId.slice(-8),
      amount: p.amountPaise,
      currency: "INR",
      status: "captured",
      captured: true,
      method: "upi",
      created_at: Math.floor(Date.now() / 1000),
    });
  }
  return res.status(200).json({ ok: true });
}
