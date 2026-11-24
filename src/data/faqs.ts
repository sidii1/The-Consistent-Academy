import { formatINR, getProduct, KIDS_COURSE_PRICE, KIDS_COURSE_PRICE_OVERRIDES } from "../../shared/pricing";

export interface FaqItem {
  question: string;
  /** Plain text (also used verbatim in FAQPage JSON-LD). */
  answer: string;
}

/*
 * TODO(owner): review these answers; they are drafted from the site's own data
 * (shared/pricing.ts, the course catalogue) and the policy pages.
 */

/** Questions shown on /courses and /contact. */
export const GENERAL_FAQS: FaqItem[] = [
  {
    question: "How do I enrol in a course?",
    answer:
      "Open the course you like, press Enroll Now and pay securely by UPI QR (processed by Razorpay). Your receipt and joining details are emailed straight away. If you would rather talk first, call us, message us on WhatsApp or use the contact form and we will guide you.",
  },
  {
    question: "What are the fees, and are there discounts?",
    answer:
      "Every course page shows its fee in rupees. Fees are paid in full at enrolment unless an instalment plan is agreed with you. Selected programmes offer early-bird, sibling and school-group discounts, which you can see and apply while enrolling.",
  },
  {
    question: "Are classes online or offline?",
    answer:
      "Our kids' courses are conducted online. Professional and leadership programmes are instructor-led and, for selected programmes, available online or at our Pune centre. The mode available for each batch is shown at enrolment, or ask us and we will confirm.",
  },
  {
    question: "How do batches and timings work?",
    answer:
      "Batch dates and timings are published with each programme and confirmed after you enrol. If a batch does not suit you, tell us before the course starts and we will move you to another batch where seats are available.",
  },
  {
    question: "Which course is right for my child or for me?",
    answer:
      "Tell us your goal (for example an IELTS band score, interview confidence, public speaking or leadership) and, for children, their age and school grade. We will recommend the right course. You can book a free consultation from the contact page.",
  },
  {
    question: "What is the refund and cancellation policy?",
    answer:
      "You can cancel before a course begins and, within the limits set out in our Refund & Cancellation Policy, receive a refund to your original payment method. Please read the policy page for exact timelines.",
  },
  {
    question: "How can I contact The Consistent Academy?",
    answer:
      "Call +91 77091 09830, email theconsistentacademy@gmail.com, or use the contact form. We are based in Pune, Maharashtra, and teach online as well.",
  },
];

/** Questions for one course page, built from the live price and course data. */
export const courseFaqs = (opts: {
  title: string;
  productId?: string;
  kidsId?: string;
  duration: string;
  audience?: string;
}): FaqItem[] => {
  const price = opts.kidsId
    ? KIDS_COURSE_PRICE_OVERRIDES[opts.kidsId] ?? KIDS_COURSE_PRICE
    : opts.productId
      ? getProduct(opts.productId)?.price
      : undefined;

  const items: FaqItem[] = [];
  if (price) {
    items.push({
      question: `How much does the ${opts.title} cost?`,
      answer: `The fee is ${formatINR(price)}, paid in full at enrolment by UPI. Your receipt is emailed immediately after payment.`,
    });
  }
  items.push({
    question: `How long is the ${opts.title}?`,
    answer: `The programme runs for ${opts.duration}. Your batch schedule is confirmed when you enrol.`,
  });
  if (opts.audience) {
    items.push({ question: "Who is this course for?", answer: opts.audience });
  }
  items.push({
    question: "Can I switch batches or get a refund?",
    answer:
      "Yes, within limits. You can ask for a batch change before the course starts, and refunds follow our Refund & Cancellation Policy.",
  });
  return items;
};
