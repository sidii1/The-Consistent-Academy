/**
 * Single source of truth for per-page SEO of the static public routes.
 * Used by the pages (via routeSeo), the sitemap generator and the build-time
 * HTML generator (scripts/postbuild-seo.mjs). Keep this file free of heavy imports.
 */
export interface StaticRoute {
  path: string;
  title: string;
  description: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
}

export const STATIC_ROUTES: StaticRoute[] = [
  {
    path: "/",
    title: "The Consistent Academy | IELTS, Communication & Leadership Training in Pune",
    description:
      "IELTS preparation, business communication, corporate training, interview coaching, leadership programmes and kids' public speaking courses, in Pune and online. Founded by author and coach Vidya Wankhade.",
    changefreq: "weekly",
    priority: 1.0,
  },
  {
    path: "/courses",
    title: "Courses & Fees: IELTS, Communication, Interview, Kids | The Consistent Academy",
    description:
      "Explore courses with fees for IELTS, TOEFL, PTE, CELPIP, corporate communication, interview preparation, personality development and kids' programmes such as MUN, TEDx and grammar.",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    path: "/lbfp",
    title: "Leadership Bento Forward Program (LBFP) | The Consistent Academy",
    description:
      "The Leadership Bento Forward Program (LBFP): a leadership workshop and passion-project programme for the next generation of leaders, by The Consistent Academy.",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/webinars",
    title: "Webinars on Public Speaking, IELTS & Business English | The Consistent Academy",
    description:
      "Join live webinars on public speaking, IELTS writing, business English and more with expert trainers at The Consistent Academy.",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/tests",
    title: "Free English Grammar & Leadership Style Tests | The Consistent Academy",
    description:
      "Take free English grammar proficiency tests for kids and adults, or discover your leadership style with our assessment.",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    path: "/blog",
    title: "Community Blog | The Consistent Academy",
    description: "Insights, stories and learning experiences from the community at The Consistent Academy.",
    changefreq: "weekly",
    priority: 0.6,
  },
  {
    path: "/careers",
    title: "Careers: Join The Consistent Academy as a Trainer",
    description:
      "Join The Consistent Academy as an IELTS Trainer, Spoken English Mentor or Experiential Learning Expert. Build your career with us.",
    changefreq: "monthly",
    priority: 0.5,
  },
  {
    path: "/contact",
    title: "Contact The Consistent Academy | Pune",
    description:
      "Contact The Consistent Academy in Pune: call, WhatsApp or email us about IELTS, communication, corporate and kids' courses, fees and batches.",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/game",
    title: "Padre's Sliver Search | The Consistent Academy",
    description: "Padre's Sliver Search, a new learning game from The Consistent Academy. Coming soon.",
    changefreq: "monthly",
    priority: 0.3,
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy | The Consistent Academy",
    description: "How The Consistent Academy collects, uses and protects personal information of students, parents and visitors.",
    changefreq: "monthly",
    priority: 0.2,
  },
  {
    path: "/terms",
    title: "Terms of Service | The Consistent Academy",
    description: "Terms for using theconsistentacademy.in and enrolling in courses, programmes and webinars.",
    changefreq: "monthly",
    priority: 0.2,
  },
  {
    path: "/refund-policy",
    title: "Refund & Cancellation Policy | The Consistent Academy",
    description: "How cancellations, refunds and batch changes work for courses and programmes at The Consistent Academy.",
    changefreq: "monthly",
    priority: 0.2,
  },
  {
    path: "/shipping-policy",
    title: "Service Delivery Policy | The Consistent Academy",
    description: "How courses, webinars, receipts and materials from The Consistent Academy are delivered after enrolment.",
    changefreq: "monthly",
    priority: 0.2,
  },
];

/** Props for <SEO /> for a static route, e.g. <SEO {...routeSeo("/courses")} schema={...} />. */
export const routeSeo = (path: string) => {
  const r = STATIC_ROUTES.find((s) => s.path === path);
  if (!r) throw new Error(`No SEO entry for route ${path}`);
  return { title: r.title, description: r.description, canonical: r.path };
};
