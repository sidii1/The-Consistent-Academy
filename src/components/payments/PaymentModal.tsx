import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Download, Printer, ShieldCheck, FlaskConical, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { cn } from "@/lib/utils";
import {
  getProduct,
  quotePrice,
  formatINR,
  isEarlyBirdOpen,
  SCHOOL_GROUP_MIN_STUDENTS,
  WORKSHOP_DATES,
  type DiscountType,
  type DeliveryMode,
} from "../../../shared/pricing";
import { buildReceiptHtml, type ReceiptData } from "../../../shared/receipt";

/* ------------------------------------------------------------------ */

type Step = "form" | "starting" | "qr" | "paid" | "failed";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  /** Optional pre-selections (e.g. from the LBFP workshop details). */
  defaultMode?: DeliveryMode;
  defaultDate?: string;
  defaultDiscount?: DiscountType;
}

const inputClass =
  "w-full px-4 py-2.5 rounded-neo-btn bg-neo-base shadow-neo-inset text-neo-fg text-sm placeholder:text-neo-placeholder focus:outline-none focus:shadow-neo-focus transition-shadow duration-200";

const Field = ({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) => (
  <label className="block">
    <span className="block text-neo-fg text-xs font-semibold mb-1.5">
      {label} {optional ? <span className="text-neo-muted font-normal">(optional)</span> : <span className="text-neo-accent">*</span>}
    </span>
    {children}
  </label>
);

const POLL_MS = 3000;

export const PaymentModal = ({ open, onOpenChange, productId, defaultMode, defaultDate, defaultDiscount }: Props) => {
  const product = getProduct(productId);

  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");

  // form
  const [name, setName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<DeliveryMode>(defaultMode ?? "Online");
  const [date, setDate] = useState(defaultDate ?? "");
  const [discount, setDiscount] = useState<DiscountType>(defaultDiscount ?? "none");
  const [siblingName, setSiblingName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [groupSize, setGroupSize] = useState("");

  // payment session
  const [orderId, setOrderId] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [qrImgFailed, setQrImgFailed] = useState(false);
  const [expiresAt, setExpiresAt] = useState(0);
  const [testMode, setTestMode] = useState(false);
  const [canSimulate, setCanSimulate] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [failReason, setFailReason] = useState("");
  const [now, setNow] = useState(Date.now());

  const pollRef = useRef<number | null>(null);
  const stopPolling = () => {
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = null;
  };

  // Reset every time the modal is (re)opened.
  useEffect(() => {
    if (open) {
      setStep("form");
      setError("");
      setOrderId("");
      setReceipt(null);
      setMode(defaultMode ?? "Online");
      setDate(defaultDate ?? "");
      setDiscount(defaultDiscount ?? "none");
    } else {
      stopPolling();
    }
    return stopPolling;
  }, [open, productId, defaultMode, defaultDate, defaultDiscount]);

  const quote = useMemo(() => {
    if (!product) return null;
    return quotePrice(product.id, discount, { groupSize: Number(groupSize) || 0 });
  }, [product, discount, groupSize]);

  /* ---------- polling ---------- */
  const check = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/payment-status?orderId=${encodeURIComponent(id)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "paid") {
        stopPolling();
        setReceipt(data.receipt);
        setEmailStatus(data.emailStatus);
        setStep("paid"); // QR is unmounted as soon as the step changes
      } else if (data.status === "failed" || data.status === "expired") {
        stopPolling();
        setFailReason(data.failureReason || "");
        setStep("failed");
      }
    } catch {
      /* transient network error — next tick retries */
    }
  }, []);

  useEffect(() => {
    if (step !== "qr" || !orderId) return;
    pollRef.current = window.setInterval(() => check(orderId), POLL_MS);
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      stopPolling();
      window.clearInterval(tick);
    };
  }, [step, orderId, check]);

  /* ---------- actions ---------- */
  const start = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !quote?.ok) {
      setError(quote && !quote.ok ? quote.error : "Please complete the form.");
      return;
    }
    setError("");
    setStep("starting");
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          discountType: discount,
          customer: { name, email, phone },
          meta: { studentName: product.kind === "kids_course" || product.id === "pkg-llf" ? studentName : "", mode, date, siblingName, schoolName, groupSize: Number(groupSize) || 0 },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not start the payment.");
      setOrderId(data.orderId);
      setQrUrl(data.qr.imageUrl);
      setQrImgFailed(false);
      setExpiresAt(data.qr.expiresAt);
      setTestMode(data.mode === "test");
      setCanSimulate(Boolean(data.simulationEnabled));
      setNow(Date.now());
      setStep("qr");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the payment.");
      setStep("form");
    }
  };

  const simulate = async (outcome: "success" | "failure") => {
    await fetch("/api/simulate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, outcome }),
    });
    check(orderId);
  };

  const receiptHtml = () => (receipt ? buildReceiptHtml(receipt) : "");
  const downloadReceipt = () => {
    const blob = new Blob([receiptHtml()], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `TCA-Receipt-${receipt?.receiptNo}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const printReceipt = () => {
    const w = window.open("", "_blank", "width=720,height=900");
    if (!w) return;
    w.document.write(receiptHtml());
    w.document.close();
    w.focus();
    w.print();
  };

  if (!product) return null;

  const secondsLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));
  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  const earlyOpen = isEarlyBirdOpen();
  // Only kids' courses and Leadership Lab Forward are bought by a parent for a child.
  const needsParent = product.kind === "kids_course" || product.id === "pkg-llf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto overscroll-contain p-6 sm:p-8 shadow-[0_20px_50px_rgba(26,31,46,0.35)]">
        <DialogTitle className="text-neo-fg font-bold text-xl pr-8">{product.name}</DialogTitle>
        <DialogDescription className="text-neo-muted text-sm -mt-1">{product.tagline}</DialogDescription>

        <AnimatePresence mode="wait">
          {/* ───────────── FORM ───────────── */}
          {(step === "form" || step === "starting") && (
            <motion.form key="form" onSubmit={start} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={needsParent ? "Parent / Guardian name" : "Your name"}>
                  <input required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                </Field>
                {needsParent && (
                  <Field label="Student name" optional>
                    <input className={inputClass} value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="If different" />
                  </Field>
                )}
                <Field label="Email">
                  <input required type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </Field>
                <Field label="Phone">
                  <input required type="tel" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                </Field>
              </div>

              {product.needsSchedule && (
                <div className="space-y-3">
                  <div>
                    <span className="block text-neo-fg text-xs font-semibold mb-1.5">Mode</span>
                    <div className="flex gap-2">
                      {(["Online", "Offline"] as DeliveryMode[]).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMode(m)}
                          className={cn(
                            "flex-1 py-2 rounded-neo-btn text-sm font-semibold transition-all",
                            mode === m ? "neo-inset text-neo-accent" : "neo-surface-sm text-neo-muted hover:text-neo-fg"
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  {product.id === "pkg-llf" && (
                    <Field label="Preferred dates">
                      <select required className={inputClass} value={date} onChange={(e) => setDate(e.target.value)}>
                        <option value="">Select a date</option>
                        {WORKSHOP_DATES.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </Field>
                  )}
                </div>
              )}

              {product.discounts.length > 0 && (
                <div>
                  <span className="block text-neo-fg text-xs font-semibold mb-1.5">
                    Discount <span className="text-neo-muted font-normal">(only one can be applied)</span>
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {[{ type: "none" as DiscountType, label: "No discount", condition: "" }, ...product.discounts].map((d) => {
                      const disabled = d.type === "early_bird" && !earlyOpen;
                      const q = quotePrice(product.id, d.type as DiscountType, { groupSize: 999 });
                      return (
                        <button
                          key={d.type}
                          type="button"
                          disabled={disabled}
                          onClick={() => setDiscount(d.type as DiscountType)}
                          className={cn(
                            "text-left px-4 py-2.5 rounded-neo-btn transition-all disabled:opacity-40 disabled:cursor-not-allowed",
                            discount === d.type ? "neo-inset" : "neo-surface-sm"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={cn("text-sm font-semibold", discount === d.type ? "text-neo-accent" : "text-neo-fg")}>{d.label}</span>
                            {q.ok && <span className="text-sm font-bold text-neo-fg">{formatINR(q.quote.payable)}</span>}
                          </div>
                          {d.condition && <p className="text-[11px] text-neo-muted mt-0.5">{disabled ? "Early-bird offer has closed." : d.condition}</p>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {discount === "sibling" && (
                <Field label="Sibling's name (must enrol in the same programme)">
                  <input required className={inputClass} value={siblingName} onChange={(e) => setSiblingName(e.target.value)} />
                </Field>
              )}
              {discount === "school_group" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="School name">
                    <input required className={inputClass} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                  </Field>
                  <Field label={`Students enrolling (min ${SCHOOL_GROUP_MIN_STUDENTS})`}>
                    <input required type="number" min={SCHOOL_GROUP_MIN_STUDENTS} className={inputClass} value={groupSize} onChange={(e) => setGroupSize(e.target.value)} />
                  </Field>
                </div>
              )}

              {/* Price summary */}
              <div className="neo-inset rounded-neo-btn px-4 py-3 space-y-1">
                <div className="flex justify-between text-sm text-neo-muted">
                  <span>List price</span>
                  <span>{formatINR(product.price)}</span>
                </div>
                {quote?.ok && quote.quote.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-neo-success">
                    <span>{quote.quote.discountLabel}</span>
                    <span>− {formatINR(quote.quote.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-neo-fg font-bold">Payable now</span>
                  <span className="text-neo-accent font-bold text-xl">{quote?.ok ? formatINR(quote.quote.payable) : "—"}</span>
                </div>
                <p className="text-[11px] text-neo-muted">Taxes, if applicable, are communicated separately.</p>
              </div>

              {(error || (quote && !quote.ok)) && (
                <div className="neo-inset rounded-neo-btn px-4 py-2.5 text-sm text-red-500">{error || (quote && !quote.ok && quote.error)}</div>
              )}

              <div className="text-center pt-1">
                <NeumorphicButton type="submit" size="lg" disabled={step === "starting" || !quote?.ok} className="w-full sm:w-auto">
                  {step === "starting" ? (
                    <span className="inline-flex items-center gap-2"><Loader2 className="animate-spin" size={16} /> Generating QR…</span>
                  ) : (
                    <span className="inline-flex items-center gap-2"><QrCode size={16} /> Pay {quote?.ok ? formatINR(quote.quote.payable) : ""} via UPI QR</span>
                  )}
                </NeumorphicButton>
                <p className="text-[11px] text-neo-muted mt-3 inline-flex items-center gap-1"><ShieldCheck size={12} /> Secure payment powered by Razorpay</p>
              </div>
            </motion.form>
          )}

          {/* ───────────── QR ───────────── */}
          {step === "qr" && (
            <motion.div key="qr" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className="text-center mt-2">
              {testMode && (
                <div className="inline-flex items-center gap-1.5 neo-inset rounded-full px-3 py-1 text-xs font-semibold text-amber-600 mb-3">
                  <FlaskConical size={12} /> TEST MODE — no real money is charged
                </div>
              )}
              <p className="text-neo-muted text-sm mb-3">Scan with any UPI app to pay</p>
              <div className="neo-inset rounded-neo-card p-4 inline-block">
                {qrImgFailed ? (
                  <a href={qrUrl} target="_blank" rel="noreferrer" className="block w-56 h-56 flex items-center justify-center text-neo-accent text-sm underline">
                    Open QR code
                  </a>
                ) : (
                  <img src={qrUrl} alt="UPI payment QR code" className="w-56 h-56 object-contain rounded-neo-inner bg-white" onError={() => setQrImgFailed(true)} />
                )}
              </div>
              <p className="text-neo-fg font-bold text-2xl mt-3">{quote?.ok ? formatINR(quote.quote.payable) : ""}</p>
              <p className="text-neo-muted text-sm mt-1 inline-flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Waiting for payment… expires in {mmss}
              </p>
              <p className="text-[11px] text-neo-muted mt-1">Keep this window open. It updates automatically once your payment is confirmed.</p>

              {canSimulate && (
                <div className="neo-inset rounded-neo-btn p-3 mt-4 text-left">
                  <p className="text-[11px] font-semibold text-amber-600 mb-2">DEV: simulate the outcome (test mode only)</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => simulate("success")} className="flex-1 neo-surface-sm rounded-neo-btn py-1.5 text-xs font-semibold text-neo-success">Simulate success</button>
                    <button type="button" onClick={() => simulate("failure")} className="flex-1 neo-surface-sm rounded-neo-btn py-1.5 text-xs font-semibold text-red-500">Simulate failure</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ───────────── SUCCESS ───────────── */}
          {step === "paid" && receipt && (
            <motion.div key="paid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mt-2">
              <div className="neo-inset rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={34} className="text-neo-success" />
              </div>
              <h3 className="text-neo-success font-bold text-xl">Payment Received and Confirmed.</h3>
              <p className="text-neo-muted text-sm mt-2">
                {formatINR(receipt.amountPaid)} paid for <strong className="text-neo-fg">{receipt.productName}</strong>.
              </p>
              <p className="text-neo-muted text-xs mt-1">Receipt no. {receipt.receiptNo}</p>
              <p className="text-neo-muted text-xs mt-1">
                {emailStatus === "failed" ? "We couldn't email your confirmation — please download your receipt below." : `A confirmation email is on its way to ${receipt.customerEmail}.`}
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-5">
                <NeumorphicButton variant="secondary" onClick={downloadReceipt}><Download size={15} /> Download receipt</NeumorphicButton>
                <NeumorphicButton variant="secondary" onClick={printReceipt}><Printer size={15} /> Print / Save PDF</NeumorphicButton>
              </div>
              <div className="mt-4">
                <NeumorphicButton onClick={() => onOpenChange(false)}>Done</NeumorphicButton>
              </div>
            </motion.div>
          )}

          {/* ───────────── FAILED ───────────── */}
          {step === "failed" && (
            <motion.div key="failed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mt-2">
              <div className="neo-inset rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <XCircle size={34} className="text-red-500" />
              </div>
              <h3 className="text-red-500 font-bold text-xl">Payment Failed.</h3>
              {failReason && <p className="text-neo-muted text-xs mt-2">{failReason}</p>}
              <p className="text-neo-muted text-sm mt-2">No amount has been confirmed. If money was debited it will be refunded by your bank automatically.</p>
              <div className="mt-5">
                <NeumorphicButton onClick={() => { setStep("form"); setError(""); }}>Try again</NeumorphicButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
