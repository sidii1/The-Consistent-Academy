/**
 * Payment receipt as a standalone HTML document. Used for (a) the in-page
 * "Download receipt" button and (b) the confirmation email body.
 * Dependency-free; inline styles only (email-client safe).
 */

export interface ReceiptData {
  receiptNo: string;
  orderId: string;
  paymentId?: string | null;
  paidAt: string; // ISO
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  productName: string;
  listPrice: number;
  discountLabel?: string | null;
  discountAmount: number;
  amountPaid: number;
  method?: string | null;
  testMode?: boolean;
  details?: { label: string; value: string }[];
}

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export const buildReceiptHtml = (r: ReceiptData): string => {
  const rows = [
    ["Programme", esc(r.productName)],
    ["List price", inr(r.listPrice)],
    ...(r.discountAmount > 0 ? [[`Discount (${esc(r.discountLabel)})`, "− " + inr(r.discountAmount)]] : []),
    ...(r.details || []).map((d) => [esc(d.label), esc(d.value)]),
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:#6B7280;font-size:14px">${k}</td><td style="padding:8px 0;text-align:right;color:#3D4852;font-size:14px;font-weight:600">${v}</td></tr>`
    )
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${esc(r.receiptNo)}</title></head>
<body style="margin:0;padding:24px;background:#E0E5EC;font-family:Fredoka,Segoe UI,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#E0E5EC;border-radius:28px;padding:32px;box-shadow:9px 9px 16px rgba(163,177,198,.6),-9px -9px 16px rgba(255,255,255,.6)">
  <h1 style="margin:0 0 4px;font-size:22px;color:#391B49">The Consistent Academy</h1>
  <p style="margin:0 0 20px;color:#6B7280;font-size:13px">Payment Receipt${r.testMode ? " — <b style=\"color:#d97706\">TEST MODE (no real money moved)</b>" : ""}</p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
    <tr><td style="color:#6B7280;font-size:13px">Receipt no.</td><td style="text-align:right;font-weight:600;color:#3D4852;font-size:13px">${esc(r.receiptNo)}</td></tr>
    <tr><td style="color:#6B7280;font-size:13px">Date</td><td style="text-align:right;font-weight:600;color:#3D4852;font-size:13px">${esc(new Date(r.paidAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }))} IST</td></tr>
    <tr><td style="color:#6B7280;font-size:13px">Order ID</td><td style="text-align:right;color:#3D4852;font-size:13px">${esc(r.orderId)}</td></tr>
    ${r.paymentId ? `<tr><td style="color:#6B7280;font-size:13px">Payment ID</td><td style="text-align:right;color:#3D4852;font-size:13px">${esc(r.paymentId)}</td></tr>` : ""}
    ${r.method ? `<tr><td style="color:#6B7280;font-size:13px">Method</td><td style="text-align:right;color:#3D4852;font-size:13px">${esc(String(r.method).toUpperCase())}</td></tr>` : ""}
  </table>
  <hr style="border:0;border-top:1px solid #c9d0db;margin:16px 0">
  <p style="margin:0 0 4px;font-size:13px;color:#6B7280">Billed to</p>
  <p style="margin:0 0 16px;font-size:15px;color:#3D4852;font-weight:600">${esc(r.customerName)}<br><span style="font-weight:400;font-size:13px">${esc(r.customerEmail)}${r.customerPhone ? " · " + esc(r.customerPhone) : ""}</span></p>
  <table style="width:100%;border-collapse:collapse">${rows}</table>
  <hr style="border:0;border-top:1px solid #c9d0db;margin:16px 0">
  <table style="width:100%"><tr><td style="font-size:16px;font-weight:700;color:#391B49">Amount paid</td><td style="text-align:right;font-size:22px;font-weight:700;color:#9C37FC">${inr(r.amountPaid)}</td></tr></table>
  <p style="margin:20px 0 0;font-size:11px;color:#6B7280">Taxes, if applicable, are communicated separately. This is a computer-generated receipt. Questions? theconsistentacademy@gmail.com</p>
</div></body></html>`;
};
