/**
 * Node-side route builder (bundled by scripts/load-routes.mjs with esbuild).
 * Produces, for every public URL: SEO meta, JSON-LD and a plain-HTML body that is
 * written into the static HTML so crawlers, AI assistants and link-preview bots
 * that do not run JavaScript still see real content.
 *
 * No React or browser APIs in here.
 */
import { STATIC_ROUTES } from "./routes";
import { ORGANIZATION, SITE_URL } from "./org";
import { courseEntries, courseJsonLd, courseListJsonLd, faqJsonLd, type CourseEntry } from "./site";
import { courses, kidsCourses } from "@/data/courses";
import { GENERAL_FAQS, courseFaqs, type FaqItem } from "@/data/faqs";
import { formatINR } from "../../shared/pricing";

export interface BuiltRoute {
  path: string;
  title: string;
  description: string;
  changefreq: string;
  priority: number;
  image?: string;
  jsonLd: object[];
  bodyHtml: string;
  /** Set on per-course routes (used for llms.txt). */
  course?: { audience: "professional" | "kids"; price: number; duration: string; summary: string };
}

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const NAV = [
  ["/", "Home"],
  ["/courses", "Courses"],
  ["/lbfp", "Leadership Bento Forward Program"],
  ["/webinars", "Webinars"],
  ["/blog", "Blog"],
  ["/tests", "Tests"],
  ["/careers", "Careers"],
  ["/contact", "Contact"],
  ["/refund-policy", "Refund policy"],
  ["/privacy-policy", "Privacy policy"],
  ["/terms", "Terms"],
];

const navHtml = () =>
  `<nav aria-label="Site"><ul>${NAV.map(([p, l]) => `<li><a href="${p}">${esc(l)}</a></li>`).join("")}</ul></nav>`;

const contactHtml = () =>
  `<section><h2>Contact</h2><p>The Consistent Academy, Pune, Maharashtra, India. Phone: <a href="tel:+917709109830">+91 77091 09830</a>. Email: <a href="mailto:theconsistentacademy@gmail.com">theconsistentacademy@gmail.com</a>.</p></section>`;

const faqHtml = (items: FaqItem[]) =>
  `<section><h2>Frequently asked questions</h2>${items
    .map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`)
    .join("")}</section>`;

const courseListHtml = (list: CourseEntry[]) =>
  `<ul>${list
    .map(
      (c) =>
        `<li><a href="/courses/${c.slug}">${esc(c.title)}</a>: ${esc(c.description)} ${esc(c.duration)}. Fee ${esc(formatINR(c.price))}.</li>`,
    )
    .join("")}</ul>`;

const coursesSection = () => {
  const all = courseEntries();
  return (
    `<section><h2>Courses for professionals and adults</h2>${courseListHtml(all.filter((c) => c.audience === "professional"))}</section>` +
    `<section><h2>Online courses for kids</h2>${courseListHtml(all.filter((c) => c.audience === "kids"))}</section>`
  );
};

const wrap = (h1: string, intro: string, middle = "") =>
  `<header><p><a href="/">The Consistent Academy</a></p></header><main><h1>${esc(h1)}</h1><p>${esc(intro)}</p>${middle}${contactHtml()}</main><footer>${navHtml()}</footer>`;

const courseBody = (c: CourseEntry): { body: string; faqs: FaqItem[] } => {
  const pro = courses.find((x) => x.slug === c.slug);
  const kid = kidsCourses.find((x) => x.slug === c.slug);
  const audience = pro ? (Array.isArray(pro.targetAudience) ? pro.targetAudience.join(", ") : pro.targetAudience) : undefined;
  const highlights = pro?.highlights ?? kid?.features ?? [];
  const faqs = courseFaqs({ title: c.title, productId: pro?.productId, kidsId: kid?.id, duration: c.duration, audience });
  let mid = `<p>Fee: ${esc(formatINR(c.price))}. Duration: ${esc(c.duration)}.${kid ? " Delivered online." : ""}</p>`;
  if (c.subtitle) mid = `<h2>${esc(c.subtitle)}</h2>` + mid;
  if (pro?.promise) mid += `<p>${esc(pro.promise)}</p>`;
  if (audience) mid += `<h2>Who it is for</h2><p>${esc(audience)}</p>`;
  if (highlights.length) mid += `<h2>${pro ? "Highlights" : "What you will learn"}</h2><ul>${highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`;
  if (pro)
    mid +=
      `<h2>Modules</h2>` +
      pro.moduleDetails
        .map((m) => `<h3>${esc(m.title)}${m.duration ? ` (${esc(m.duration)})` : ""}</h3><ul>${m.topics.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`)
        .join("");
  mid += faqHtml(faqs);
  return { body: wrap(c.title, c.description, mid), faqs };
};

export const buildRoutes = (): BuiltRoute[] => {
  const out: BuiltRoute[] = [];

  for (const r of STATIC_ROUTES) {
    const route: BuiltRoute = { ...r, jsonLd: [], bodyHtml: "" };
    switch (r.path) {
      case "/":
        route.jsonLd = [ORGANIZATION];
        route.bodyHtml = wrap(
          "The Consistent Academy: IELTS, communication and leadership training in Pune and online",
          "The Consistent Academy teaches IELTS, TOEFL, PTE and CELPIP preparation, business communication, corporate training, interview coaching, personality development, leadership programmes and public speaking for children. Founded by author and coach Vidya Wankhade.",
          coursesSection(),
        );
        break;
      case "/courses":
        route.jsonLd = [courseListJsonLd(), faqJsonLd(GENERAL_FAQS)];
        route.bodyHtml = wrap("Courses and fees", r.description, coursesSection() + faqHtml(GENERAL_FAQS));
        break;
      case "/contact":
        route.jsonLd = [faqJsonLd(GENERAL_FAQS)];
        route.bodyHtml = wrap("Contact The Consistent Academy", r.description, faqHtml(GENERAL_FAQS));
        break;
      default:
        route.bodyHtml = wrap(r.title.split("|")[0].trim(), r.description);
    }
    out.push(route);
  }

  for (const c of courseEntries()) {
    const { body, faqs } = courseBody(c);
    out.push({
      path: `/courses/${c.slug}`,
      title: `${c.title} | The Consistent Academy`,
      description: `${c.description} ${formatINR(c.price)}. ${c.duration}. The Consistent Academy, Pune and online.`,
      changefreq: "monthly",
      priority: 0.8,
      jsonLd: [courseJsonLd(c), faqJsonLd(faqs)],
      bodyHtml: body,
      course: { audience: c.audience, price: c.price, duration: c.duration, summary: c.description },
    });
  }
  return out;
};
