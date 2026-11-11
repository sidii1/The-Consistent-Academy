/**
 * SINGLE SOURCE OF TRUTH for programme prices & discount rules.
 *
 * Imported by BOTH the frontend (display) and the serverless API (amount
 * calculation). The server NEVER trusts an amount sent by the browser: it
 * receives only { productId, discountType } and recomputes the payable amount
 * from this file. Change prices here and nowhere else.
 *
 * This file must stay dependency-free (no imports) so it runs in Vite + Node.
 */

export type DiscountType = "none" | "early_bird" | "sibling" | "school_group";

export type ProductKind = "package" | "kids_course";

export interface DiscountRule {
  type: Exclude<DiscountType, "none">;
  label: string;
  /** Discount in basis points (1500 = 15%). Integer maths only. */
  bps: number;
  /** Human-readable eligibility condition shown to the parent. */
  condition: string;
}

export interface Product {
  id: string;
  kind: ProductKind;
  name: string;
  tagline: string;
  /** Listed price in whole rupees. */
  price: number;
  /** Which discounts this product allows (kids courses: none). */
  discounts: DiscountRule[];
  /** Does the buyer need to pick Online/Offline + a date? */
  needsSchedule?: boolean;
}

/* ------------------------------------------------------------------ */
/* Early-bird window                                                   */
/* ------------------------------------------------------------------ */

/**
 * PLACEHOLDER — the commercial rules say Early Bird needs a fixed closing
 * date. Replace with the real announced deadline (inclusive, IST).
 */
export const EARLY_BIRD_DEADLINE_ISO = "2026-12-31T23:59:59+05:30";

export const isEarlyBirdOpen = (now: Date = new Date()): boolean =>
  now.getTime() <= new Date(EARLY_BIRD_DEADLINE_ISO).getTime();

/** School discount needs at least this many students from one school. */
export const SCHOOL_GROUP_MIN_STUDENTS = 10;

/* ------------------------------------------------------------------ */
/* Catalogue                                                           */
/* ------------------------------------------------------------------ */

export const PACKAGES: Product[] = [
  {
    id: "pkg-llf",
    kind: "package",
    name: "Leadership Lab Forward",
    tagline: "2-Day Experiential Leadership Workshop",
    price: 9999,
    needsSchedule: true,
    discounts: [
      { type: "early_bird", label: "Early Bird", bps: 1500, condition: "Register & pay before the early-bird deadline." },
      { type: "sibling", label: "Twins / Siblings", bps: 1000, condition: "Both children enrol in the same programme (10% each)." },
      { type: "school_group", label: "School Group (10+)", bps: 1500, condition: "Minimum 10 students from one school." },
    ],
  },
  {
    id: "pkg-passion",
    kind: "package",
    name: "Passion Projects Programme",
    tagline: "Six Categories of Real-World Experiential Learning",
    price: 85000,
    discounts: [
      { type: "early_bird", label: "Early Bird", bps: 1000, condition: "Register & pay before the early-bird deadline." },
      { type: "sibling", label: "Twins / Siblings", bps: 750, condition: "Both children enrol in the same programme (7.5% each)." },
      { type: "school_group", label: "School Group (10+)", bps: 1500, condition: "Minimum 10 students from one school." },
    ],
  },
  {
    id: "pkg-annual",
    kind: "package",
    name: "TCA Future Leaders Annual Programme",
    tagline: "The Complete Student-Development Ecosystem",
    price: 150000,
    needsSchedule: true,
    discounts: [
      { type: "early_bird", label: "Early Bird", bps: 1000, condition: "Register & pay before the early-bird deadline." },
      { type: "sibling", label: "Twins / Siblings", bps: 750, condition: "Both children enrol in the same programme (7.5% each)." },
      { type: "school_group", label: "School Group (10+)", bps: 1500, condition: "Minimum 10 students from one school." },
    ],
  },
];

export const KIDS_COURSE_PRICE = 1999;

export const KIDS_COURSES: Product[] = [
  ["kid-mun", "Model United Nations (MUN) Course"],
  ["kid-tedx", "TedX & Toastmaster Training"],
  ["kid-grammar", "Grammar Foundations"],
  ["kid-creative", "Creative Writing"],
  ["kid-story", "TCA – Craft Your Own Story"],
  ["kid-case-study", "TCA – Case Study & Critical Thinking Workshop"],
  ["kid-essay", "TCA – International Essay Writing Competition Preparation"],
].map(([id, name]) => ({
  id,
  kind: "kids_course" as const,
  name,
  tagline: "Online course for kids",
  price: KIDS_COURSE_PRICE,
  discounts: [],
}));

export const PRODUCTS: Product[] = [...PACKAGES, ...KIDS_COURSES];

export const getProduct = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

/* ------------------------------------------------------------------ */
/* Price calculation                                                   */
/* ------------------------------------------------------------------ */

/**
 * Payable = floor(price × (1 − discount)). Floors to whole rupees, which
 * reproduces the approved price sheet (e.g. 9,999 − 15% = ₹8,499, not 8,499.15).
 */
export const applyDiscount = (price: number, bps: number): number =>
  Math.floor((price * (10000 - bps)) / 10000);

export interface PriceQuote {
  productId: string;
  listPrice: number;
  discountType: DiscountType;
  discountLabel: string | null;
  discountAmount: number;
  /** Final payable amount in whole rupees. */
  payable: number;
  /** Final payable amount in paise (what Razorpay expects). */
  payablePaise: number;
}

export type QuoteResult =
  | { ok: true; quote: PriceQuote; error?: undefined }
  | { ok: false; error: string; quote?: undefined };

export interface QuoteContext {
  /** Only needed for `school_group`. */
  groupSize?: number;
  now?: Date;
}

/** Validates eligibility and returns the final price. Used on client AND server. */
export const quotePrice = (
  productId: string,
  discountType: DiscountType = "none",
  ctx: QuoteContext = {}
): QuoteResult => {
  const product = getProduct(productId);
  if (!product) return { ok: false, error: "Unknown product." };

  let payable = product.price;
  let label: string | null = null;

  if (discountType !== "none") {
    const rule = product.discounts.find((d) => d.type === discountType);
    if (!rule) return { ok: false, error: "This discount is not available for the selected programme." };

    if (rule.type === "early_bird" && !isEarlyBirdOpen(ctx.now)) {
      return { ok: false, error: "The early-bird offer has closed." };
    }
    if (rule.type === "school_group" && (ctx.groupSize ?? 0) < SCHOOL_GROUP_MIN_STUDENTS) {
      return { ok: false, error: `School discount needs at least ${SCHOOL_GROUP_MIN_STUDENTS} students.` };
    }
    payable = applyDiscount(product.price, rule.bps);
    label = rule.label;
  }

  return {
    ok: true,
    quote: {
      productId,
      listPrice: product.price,
      discountType,
      discountLabel: label,
      discountAmount: product.price - payable,
      payable,
      payablePaise: payable * 100,
    },
  };
};

export const formatINR = (rupees: number): string =>
  "₹" + rupees.toLocaleString("en-IN");

/* ------------------------------------------------------------------ */
/* Workshop schedule options (LLF)                                     */
/* ------------------------------------------------------------------ */

export type DeliveryMode = "Online" | "Offline";

/**
 * PLACEHOLDER fixed dates — replace with the real cohort dates. `value` is
 * what is stored with the order; `label` is what the parent sees.
 */
export const WORKSHOP_DATES: { value: string; label: string }[] = [
  { value: "2026-12-12/13", label: "12 – 13 December 2026" },
  { value: "2027-01-09/10", label: "9 – 10 January 2027" },
  { value: "2027-01-23/24", label: "23 – 24 January 2027" },
  { value: "2027-02-13/14", label: "13 – 14 February 2027" },
];

/* ------------------------------------------------------------------ */
/* Instalments (annual package) — NOT YET ACTIVE                       */
/* ------------------------------------------------------------------ */

/**
 * The pricing brief ends at "Annual Programme Payment Options: ₹1,50,000
 * Standard annual programme fee" — the instalment schedule itself was not
 * supplied. Add plans here once finalised; checkout then only needs to
 * charge `amountsPaise[n]` per instalment (see docs in the final report).
 */
export const INSTALMENT_PLANS: Record<string, { id: string; label: string; amounts: number[] }[]> = {
  "pkg-annual": [],
};
