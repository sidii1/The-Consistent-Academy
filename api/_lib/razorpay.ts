import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Thin Razorpay REST client (no SDK dependency).
 * All secrets come from server env vars — never from `VITE_*` and never sent to the browser.
 *
 *   RAZORPAY_KEY_ID          rzp_test_xxx  (later rzp_live_xxx)
 *   RAZORPAY_KEY_SECRET
 *   RAZORPAY_WEBHOOK_SECRET  the secret typed into Dashboard → Webhooks
 *
 * Going live = replacing these three values. No code change.
 */

const BASE = "https://api.razorpay.com/v1";

export class RazorpayError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const isConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

/** "test" while the key id starts with rzp_test_, "live" once rzp_live_ keys are installed. */
export const razorpayMode = (): "test" | "live" =>
  (process.env.RAZORPAY_KEY_ID || "").startsWith("rzp_live_") ? "live" : "test";

const authHeader = () => {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new RazorpayError("Razorpay keys are not configured on the server.", 503, "NOT_CONFIGURED");
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
};

const call = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const res = await fetch(BASE + path, {
    ...init,
    headers: { Authorization: authHeader(), "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const text = await res.text();
  let data: { error?: { description?: string; code?: string } } = {};
  try { data = text ? JSON.parse(text) : {}; } catch { /* non-JSON error body */ }
  if (!res.ok) {
    throw new RazorpayError(data?.error?.description || `Razorpay request failed (${res.status})`, res.status, data?.error?.code);
  }
  return data as T;
};

export interface RzpQr {
  id: string;
  image_url: string;
  status: "active" | "closed";
  close_by?: number;
  close_reason?: string | null;
  payments_amount_received?: number;
}

export interface RzpPayment {
  id: string;
  amount: number; // paise
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  method?: string;
  captured?: boolean;
  error_description?: string | null;
  created_at: number;
}

/** Single-use, fixed-amount UPI QR. `closeBy` is a unix timestamp (2 min – 2 h ahead). */
export const createUpiQr = (p: {
  name: string; description: string; amountPaise: number; closeBy: number; notes: Record<string, string>;
}) =>
  call<RzpQr>("/payments/qr_codes", {
    method: "POST",
    body: JSON.stringify({
      type: "upi_qr",
      name: p.name,
      usage: "single_use",
      fixed_amount: true,
      payment_amount: p.amountPaise,
      description: p.description,
      close_by: p.closeBy,
      notes: p.notes,
    }),
  });

export const fetchQr = (qrId: string) => call<RzpQr>(`/payments/qr_codes/${qrId}`);

export const fetchQrPayments = async (qrId: string): Promise<RzpPayment[]> =>
  (await call<{ items: RzpPayment[] }>(`/payments/qr_codes/${qrId}/payments?count=20`)).items || [];

export const closeQr = (qrId: string) =>
  call<RzpQr>(`/payments/qr_codes/${qrId}/close`, { method: "POST" });

/** HMAC-SHA256(rawBody, webhookSecret) compared with X-Razorpay-Signature in constant time. */
export const verifyWebhookSignature = (rawBody: string | Buffer, signature: string | undefined, secret: string | undefined) => {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
};
