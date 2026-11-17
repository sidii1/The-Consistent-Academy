import React, { useCallback, useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download, RefreshCw, IndianRupee, FileSearch, Search } from "lucide-react";
import { buildReceiptHtml } from "../../../shared/receipt";

export interface AdminPayment {
  orderId: string;
  status: "created" | "pending" | "paid" | "failed" | "expired";
  mode: "test" | "live";
  productId: string;
  productName: string;
  listPrice: number;
  discountLabel: string | null;
  discountAmount: number;
  amount: number;
  customer: { name: string; email: string; phone: string };
  details: { label: string; value: string }[];
  receiptNo: string | null;
  paymentId: string | null;
  method: string | null;
  paidAt: string | null;
  failureReason: string | null;
  emailStatus: "pending" | "sent" | "failed" | null;
  createdAt: number | null;
}

type StatusFilter = "paid" | "all" | "unpaid";

const STATUS_STYLE: Record<AdminPayment["status"], string> = {
  paid: "bg-green-500/10 text-green-600 border-green-500/30",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  created: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  failed: "bg-red-500/10 text-red-600 border-red-500/30",
  expired: "bg-secondary/50 text-muted-foreground border-border",
};

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const when = (p: AdminPayment) => {
  const t = p.paidAt ? new Date(p.paidAt).getTime() : p.createdAt;
  return t ? new Date(t).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
};

export const AdminPaymentsPanel: React.FC = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusFilter>("paid");
  const [programme, setProgramme] = useState("All");
  const [showTest, setShowTest] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<AdminPayment | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin-payments", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load payments.");
      setPayments(data.payments || []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load payments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const programmes = useMemo(
    () => ["All", ...Array.from(new Set(payments.map((p) => p.productName))).sort()],
    [payments]
  );

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return payments.filter((p) => {
      if (!showTest && p.mode === "test") return false;
      if (status === "paid" && p.status !== "paid") return false;
      if (status === "unpaid" && p.status === "paid") return false;
      if (programme !== "All" && p.productName !== programme) return false;
      if (needle) {
        const hay = [p.customer.name, p.customer.email, p.customer.phone, p.orderId, p.receiptNo, p.paymentId]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [payments, status, programme, showTest, q]);

  const totals = useMemo(() => {
    const paid = rows.filter((p) => p.status === "paid");
    return { count: paid.length, sum: paid.reduce((s, p) => s + p.amount, 0) };
  }, [rows]);

  const exportXLSX = () => {
    if (rows.length === 0) { toast.error("Nothing to export."); return; }
    const sheet = rows.map((p) => ({
      Date: when(p),
      Status: p.status,
      Mode: p.mode,
      Name: p.customer.name,
      Email: p.customer.email,
      Phone: p.customer.phone,
      Programme: p.productName,
      "List price": p.listPrice,
      Discount: p.discountLabel || "",
      "Discount amount": p.discountAmount,
      "Amount paid": p.status === "paid" ? p.amount : 0,
      "Receipt no": p.receiptNo || "",
      "Razorpay payment id": p.paymentId || "",
      "Order id": p.orderId,
      Details: p.details.map((d) => `${d.label}: ${d.value}`).join("; "),
      "Email sent": p.emailStatus || "",
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheet), "Payments");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `TCA_Payments_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const viewReceipt = (p: AdminPayment) => {
    if (!p.receiptNo || !p.paidAt) return;
    const html = buildReceiptHtml({
      receiptNo: p.receiptNo,
      orderId: p.orderId,
      paymentId: p.paymentId || undefined,
      paidAt: p.paidAt,
      customerName: p.customer.name,
      customerEmail: p.customer.email,
      customerPhone: p.customer.phone,
      productName: p.productName,
      listPrice: p.listPrice,
      discountLabel: p.discountLabel,
      discountAmount: p.discountAmount,
      amountPaid: p.amount,
      method: p.method || undefined,
      testMode: p.mode === "test",
      details: p.details,
    });
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
    else toast.error("Popup blocked. Please allow popups for this site.");
  };

  const selectCls =
    "px-3 py-2 rounded-xl border border-border bg-card text-sm font-medium cursor-pointer hover:border-primary/50 focus:border-primary outline-none transition-all";

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <IndianRupee size={20} className="text-primary" />
          <h2 className="text-xl font-semibold">Payments &amp; Registrations</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={load} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-secondary/50 hover:border-primary/40 transition-all text-sm font-medium">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <button onClick={exportXLSX} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm font-medium shadow-sm">
            <Download size={14} /> Export XLSX
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, phone, receipt…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className={selectCls}>
          <option value="paid">Paid only</option>
          <option value="unpaid">Unpaid / failed</option>
          <option value="all">All attempts</option>
        </select>
        <select value={programme} onChange={(e) => setProgramme(e.target.value)} className={`${selectCls} max-w-[260px]`}>
          {programmes.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-muted-foreground px-2 cursor-pointer select-none">
          <input type="checkbox" checked={showTest} onChange={(e) => setShowTest(e.target.checked)} />
          Include test payments
        </label>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-secondary/10 border border-border">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Paid registrations</div>
          <div className="text-2xl font-bold mt-1">{totals.count}</div>
        </div>
        <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/30">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Collected (filtered)</div>
          <div className="text-2xl font-bold mt-1 text-green-600">{inr(totals.sum)}</div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>Loading payments…</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-border rounded-2xl">
          <FileSearch className="w-12 h-12 mb-3 opacity-20" />
          <p>No payments match these filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/20 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Programme</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.orderId}
                  onClick={() => setOpen(open?.orderId === p.orderId ? null : p)}
                  className="border-t border-border hover:bg-secondary/10 cursor-pointer align-top"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{when(p)}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{p.customer.name}</div>
                    <div className="text-xs text-muted-foreground">{p.customer.email} · {p.customer.phone}</div>
                    {open?.orderId === p.orderId && (
                      <div className="mt-3 space-y-1 text-xs text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                        {p.details.map((d) => <div key={d.label}><b>{d.label}:</b> {d.value}</div>)}
                        <div><b>Order:</b> <span className="font-mono">{p.orderId}</span></div>
                        {p.paymentId && <div><b>Razorpay ID:</b> <span className="font-mono">{p.paymentId}</span></div>}
                        {p.receiptNo && <div><b>Receipt:</b> {p.receiptNo}</div>}
                        {p.method && <div><b>Method:</b> {p.method}</div>}
                        {p.emailStatus && <div><b>Receipt email:</b> {p.emailStatus}</div>}
                        {p.failureReason && <div className="text-red-500"><b>Reason:</b> {p.failureReason}</div>}
                        {p.status === "paid" && (
                          <button onClick={() => viewReceipt(p)} className="mt-2 text-primary font-semibold hover:underline">
                            View receipt →
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>{p.productName}</div>
                    {p.discountLabel && (
                      <div className="text-xs text-muted-foreground">{p.discountLabel} (−{inr(p.discountAmount)})</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{inr(p.amount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border capitalize ${STATUS_STYLE[p.status]}`}>
                        {p.status}
                      </span>
                      {p.mode === "test" && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold border bg-blue-500/10 text-blue-600 border-blue-500/30">
                          TEST
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPanel;
