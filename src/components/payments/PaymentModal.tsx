import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2, XCircle, Loader2, Download, Printer, ShieldCheck, FlaskConical, QrCode,
  Clock, Zap, Mail, Smartphone, ScanLine, KeyRound, Check, Sparkles,
} from "lucide-react";
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
  /** Optional presentation extras shown in the header / "What's included". */
  image?: string;
  duration?: string;
  highlights?: string[];
}

/** Header image used when the caller doesn't pass one. */
const FALLBACK_IMAGE: Record<string, string> = {
  package: "/leadership/llf-hero2.jpg",
  kids_course: "/courses/2SMS08520.jpg",
  course: "/courses/img1.png",
};

const KIND_LABEL: Record<string, string> = {
  package: "Leadership Programme",
  kids_course: "Kids Course · Online",
  course: "Professional Course",
};

/**
 * Razorpay's QR image is a 674×1644 "ticket" whose top ~16% is blank.
 * We crop only that blank band so the QR, UPI logos and account name all show.
 */
const QR_W = 674;
const QR_H = 1644;
const QR_TOP_CROP = 270;

/** Must match QR_TTL_MINUTES in api/create-payment.ts (drives the progress bar only). */
const QR_TTL_SECONDS = 15 * 60;

const STEPS = ["Details", "Scan & Pay", "Receipt"] as const;

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

export const PaymentModal = ({ open, onOpenChange, productId, defaultMode, defaultDate, defaultDiscount, image, duration, highlights }: Props) => {
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

  const heroImage = image || FALLBACK_IMAGE[product.kind];
  const included = (highlights || [])
    .map((h) => h.split(":")[0].trim())
    .filter((h) => h && !h.includes("₹"))
    .slice(0, 4);
  const stepIndex = step === "paid" ? 2 : step === "qr" ? 1 : 0;
  const timeLeftPct = Math.min(100, (secondsLeft / QR_TTL_SECONDS) * 100);
  const payable = quote?.ok ? quote.quote.payable : product.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[94vh] overflow-y-auto overscroll-contain p-0 gap-0 shadow-[0_20px_50px_rgba(26,31,46,0.35)]">
        {/* ───────────── HERO ───────────── */}
        <div className="relative h-40 sm:h-48 shrink-0 overflow-hidden rounded-t-neo-card bg-gradient-to-br from-[#3C096C] via-[#5A189A] to-[#9C37FC]">
          {heroImage && (
            <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1033]/95 via-[#1a1033]/55 to-[#1a1033]/10" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-2.5 py-0.5">
                <Sparkles size={10} /> {KIND_LABEL[product.kind]}
              </span>
              {duration && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-2.5 py-0.5">
                  <Clock size={10} /> {duration}
                </span>
              )}
            </div>
            <DialogTitle className="text-white font-bold text-xl sm:text-2xl leading-tight pr-10 drop-shadow">{product.name}</DialogTitle>
            <DialogDescription className="text-white/80 text-sm mt-0.5">{product.tagline}</DialogDescription>
          </div>
        </div>

        <div className="p-5 sm:p-7">
        {/* ───────────── STEPPER ───────────── */}
        {step !== "failed" && (
          <ol className="flex items-center gap-2 mb-5">
            {STEPS.map((label, i) => {
              const done = i < stepIndex || step === "paid";
              const active = i === stepIndex && step !== "paid";
              return (
                <li key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                  <span
                    className={cn(
                      "w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold transition-all",
                      done ? "bg-neo-success text-white" : active ? "neo-inset text-neo-accent" : "neo-surface-sm text-neo-muted"
                    )}
                  >
                    {done ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </span>
                  <span className={cn("text-xs font-semibold whitespace-nowrap", active || done ? "text-neo-fg" : "text-neo-muted")}>{label}</span>
                  {i < STEPS.length - 1 && <span className={cn("h-px flex-1 min-w-3", done ? "bg-neo-success/60" : "bg-neo-muted/25")} />}
                </li>
              );
            })}
          </ol>
        )}

        <AnimatePresence mode="wait">
          {/* ───────────── FORM ───────────── */}
          {(step === "form" || step === "starting") && (
            <motion.form key="form" onSubmit={start} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {included.length > 0 && (
                <div className="neo-inset rounded-neo-btn px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neo-muted mb-2">What's included</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                    {included.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-neo-fg">
                        <CheckCircle2 size={14} className="text-neo-success shrink-0 mt-px" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={needsParent ? "Parent / Guardian name" : "Your name"}>
                  <input required className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                </Field>
                {needsParent && (
                  <Field label="Student name">
                    <input required className={inputClass} value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Child's full name" />
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
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-[11px] text-neo-muted">
                  <span className="inline-flex items-center gap-1"><ShieldCheck size={12} className="text-neo-success" /> Secured by Razorpay</span>
                  <span className="inline-flex items-center gap-1"><Zap size={12} className="text-neo-accent" /> Instant confirmation</span>
                  <span className="inline-flex items-center gap-1"><Mail size={12} className="text-neo-accent" /> Receipt on email</span>
                </div>
              </div>
            </motion.form>
          )}

          {/* ───────────── QR ───────────── */}
          {step === "qr" && (
            <motion.div key="qr" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
              {testMode && (
                <div className="flex justify-center mb-3">
                  <span className="inline-flex items-center gap-1.5 neo-inset rounded-full px-3 py-1 text-xs font-semibold text-amber-600">
                    <FlaskConical size={12} /> TEST MODE — no real money is charged
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,260px)_1fr] gap-5 sm:gap-6 items-start">
                {/* Razorpay ticket at its natural shape (only the blank top band is cropped) */}
                <div className="neo-inset rounded-neo-card p-2.5 mx-auto w-full max-w-[260px]">
                  {qrImgFailed ? (
                    <a href={qrUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center aspect-square text-neo-accent text-sm underline">
                      Open QR code
                    </a>
                  ) : (
                    <div className="overflow-hidden rounded-neo-inner bg-white" style={{ aspectRatio: `${QR_W} / ${QR_H - QR_TOP_CROP}` }}>
                      <img
                        src={qrUrl}
                        alt="UPI payment QR code"
                        className="block w-full h-auto max-w-none"
                        style={{ marginTop: `-${(QR_TOP_CROP / QR_W) * 100}%` }}
                        onError={() => setQrImgFailed(true)}
                      />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="neo-inset rounded-neo-btn px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neo-muted">Amount to pay</p>
                    <p className="text-neo-accent font-bold text-3xl leading-tight">{formatINR(payable)}</p>
                    <p className="text-xs text-neo-muted mt-0.5 truncate">{product.name}</p>
                    {quote?.ok && quote.quote.discountLabel && (
                      <p className="text-[11px] text-neo-success mt-0.5">{quote.quote.discountLabel} applied · you save {formatINR(quote.quote.discountAmount)}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-neo-muted">
                        <Loader2 size={13} className="animate-spin text-neo-accent" /> Waiting for payment…
                      </span>
                      <span className={cn("font-mono font-bold", secondsLeft < 120 ? "text-red-500" : "text-neo-fg")}>{mmss}</span>
                    </div>
                    <div className="h-1.5 rounded-full neo-inset overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-[width] duration-1000 ease-linear", secondsLeft < 120 ? "bg-red-500" : "bg-neo-accent")}
                        style={{ width: `${timeLeftPct}%` }}
                      />
                    </div>
                  </div>

                  <ol className="space-y-2.5">
                    {[
                      { icon: Smartphone, text: "Open GPay, PhonePe, Paytm or any UPI app" },
                      { icon: ScanLine, text: "Scan the QR code. The amount fills in automatically" },
                      { icon: KeyRound, text: "Enter your UPI PIN to confirm" },
                    ].map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-3">
                        <span className="neo-surface-sm rounded-full w-8 h-8 shrink-0 flex items-center justify-center">
                          <Icon size={15} className="text-neo-accent" />
                        </span>
                        <span className="text-sm text-neo-fg">{text}</span>
                      </li>
                    ))}
                  </ol>

                  <p className="text-[11px] text-neo-muted leading-relaxed">
                    Keep this window open. It updates by itself once your payment is confirmed, and your receipt appears here and in your inbox.
                  </p>
                </div>
              </div>

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
            <motion.div key="paid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="neo-inset rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={34} className="text-neo-success" />
              </div>
              <h3 className="text-neo-success font-bold text-xl">Payment Received and Confirmed.</h3>
              <p className="text-neo-muted text-sm mt-2">
                {formatINR(receipt.amountPaid)} paid for <strong className="text-neo-fg">{receipt.productName}</strong>.
              </p>
              <div className="neo-inset rounded-neo-btn px-4 py-3 mt-4 text-left max-w-sm mx-auto space-y-1.5">
                {[
                  ["Receipt no.", receipt.receiptNo],
                  ["Programme", receipt.productName],
                  ["Amount paid", formatINR(receipt.amountPaid)],
                  ["Paid on", new Date(receipt.paidAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })],
                  ...(receipt.paymentId ? [["Payment ID", receipt.paymentId]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 text-xs">
                    <span className="text-neo-muted">{k}</span>
                    <span className="text-neo-fg font-semibold text-right break-all">{v}</span>
                  </div>
                ))}
              </div>
              <p className="text-neo-muted text-xs mt-3">
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
            <motion.div key="failed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
