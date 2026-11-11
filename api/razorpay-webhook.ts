import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminDb } from "./_lib/firebaseAdmin.js";
import { verifyWebhookSignature, type RzpPayment } from "./_lib/razorpay.js";
import { findByQrId, markFailed, markPaid } from "./_lib/payments.js";

/** Signature verification needs the EXACT raw bytes, so Vercel's body parser is switched off. */
export const config = { api: { bodyParser: false } };

const readRaw = async (req: VercelRequest): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const c of req as AsyncIterable<Buffer | string>) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  return Buffer.concat(chunks);
};

/**
 * POST /api/razorpay-webhook   <- the URL you register in Razorpay Dashboard > Webhooks
 *
 * Subscribe to: qr_code.credited, qr_code.closed (and optionally qr_code.created).
 * Razorpay requires a 2xx within 5 s, retries on anything else for 24 h, and delivers
 * at-least-once - hence signature check first, idempotent handling second.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set; rejecting webhook.");
    return res.status(503).send("Webhook not configured");
  }

  const raw = await readRaw(req);
  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  if (!verifyWebhookSignature(raw, signature, secret)) {
    return res.status(400).send("Invalid signature");
  }

  const eventId = (req.headers["x-razorpay-event-id"] as string | undefined) || "";
  const event = JSON.parse(raw.toString("utf8"));
  const events = adminDb().collection("payment_webhook_events");

  try {
    // Duplicate delivery? Acknowledge without re-processing.
    if (eventId && (await events.doc(eventId).get()).exists) return res.status(200).send("duplicate");

    let outcome = "ignored";
    const qr = event?.payload?.qr_code?.entity;
    const payment = event?.payload?.payment?.entity as RzpPayment | undefined;

    if (event.event === "qr_code.credited" && qr?.id && payment) {
      const order = await findByQrId(qr.id);
      if (order && (payment.status === "captured" || payment.captured)) {
        await markPaid(order.orderId, payment);
        outcome = `paid:${order.orderId}`;
      }
    } else if (event.event === "qr_code.closed" && qr?.id) {
      const order = await findByQrId(qr.id);
      // Closed with no payment => order is dead. "paid" closes are handled by qr_code.credited.
      if (order && order.status !== "paid" && qr.close_reason !== "paid") {
        await markFailed(order.orderId, "expired", "QR closed without payment");
        outcome = `closed:${order.orderId}`;
      }
    }

    if (eventId) {
      await events.doc(eventId).set({ event: event.event, outcome, receivedAt: new Date().toISOString() });
    }
    return res.status(200).send("ok");
  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).send("error"); // non-2xx => Razorpay retries with backoff
  }
}
