import { courses, kidsCourses } from "@/data/courses";
import { KIDS_COURSE_PRICE, KIDS_COURSE_PRICE_OVERRIDES, getProduct } from "../../shared/pricing";

export { SITE_URL, SITE_NAME, ORGANIZATION } from "./org";
import { SITE_URL, SITE_NAME } from "./org";

/** One course, normalised across the professional and kids catalogues. */
export interface CourseEntry {
  slug: string;
  audience: "professional" | "kids";
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  productId: string;
}

export const courseEntries = (): CourseEntry[] => [
  ...courses
    .filter((c) => c.slug && c.productId)
    .map((c) => ({
      slug: c.slug!,
      audience: "professional" as const,
      title: c.title,
      subtitle: c.subtitle,
      description: c.description,
      image: c.image,
      duration: c.hours,
      price: getProduct(c.productId!)?.price ?? 0,
      productId: c.productId!,
    })),
  ...kidsCourses.map((k) => ({
    slug: k.slug,
    audience: "kids" as const,
    title: k.title,
    description: k.description,
    image: k.image,
    duration: k.duration,
    price: KIDS_COURSE_PRICE_OVERRIDES[k.id] ?? KIDS_COURSE_PRICE,
    productId: k.id,
  })),
];

export const courseJsonLd = (c: CourseEntry) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name: c.title,
  description: c.description,
  url: `${SITE_URL}/courses/${c.slug}`,
  image: `${SITE_URL}${c.image}`,
  provider: { "@type": "EducationalOrganization", name: SITE_NAME, sameAs: `${SITE_URL}/` },
  offers: {
    "@type": "Offer",
    price: String(c.price),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/courses/${c.slug}`,
  },
});

export const courseListJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: courseEntries().map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/courses/${c.slug}`,
    name: c.title,
  })),
});

export const faqJsonLd = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});
