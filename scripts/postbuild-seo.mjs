// After `vite build`: writes one static HTML file per public route (dist/<route>/index.html) with
// that route's <title>, description, canonical, Open Graph/Twitter tags, JSON-LD and a plain-HTML body.
// Crawlers, AI assistants and WhatsApp/Facebook link previews read this without running JavaScript.
// React still mounts normally on top (createRoot replaces the fallback body).
import fs from "node:fs";
import path from "node:path";
import { loadRoutes, SITE_URL } from "./load-routes.mjs";

const DIST = "dist";
const template = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// JSON inside <script>: neutralise "</script" and "<!--" sequences.
const safeJson = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

/** Remove tags the route will re-declare (they may span several lines in index.html). */
const strip = (html) =>
  html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/i, "")
    .replace(/<link\s+rel="canonical"[\s\S]*?\/>\s*/i, "")
    .replace(/<meta\s+property="og:[a-z_:]+"[\s\S]*?\/>\s*/gi, "")
    .replace(/<meta\s+name="twitter:[a-z_:]+"[\s\S]*?\/>\s*/gi, "");

const headFor = (r) => {
  const url = r.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${r.path}`;
  const image = r.image || `${SITE_URL}/og-image.jpg`;
  const t = esc(r.title);
  const d = esc(r.description);
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" data-rh="true" />`,
    `<link rel="canonical" href="${url}" data-rh="true" />`,
    `<meta property="og:type" content="website" data-rh="true" />`,
    `<meta property="og:site_name" content="The Consistent Academy" data-rh="true" />`,
    `<meta property="og:url" content="${url}" data-rh="true" />`,
    `<meta property="og:title" content="${t}" data-rh="true" />`,
    `<meta property="og:description" content="${d}" data-rh="true" />`,
    `<meta property="og:image" content="${esc(image)}" data-rh="true" />`,
    `<meta name="twitter:card" content="summary_large_image" data-rh="true" />`,
    `<meta name="twitter:title" content="${t}" data-rh="true" />`,
    `<meta name="twitter:description" content="${d}" data-rh="true" />`,
    `<meta name="twitter:image" content="${esc(image)}" data-rh="true" />`,
    ...r.jsonLd.map((o) => `<script type="application/ld+json" data-rh="true">${safeJson(o)}</script>`),
  ].join("\n    ");
};

const routes = await loadRoutes();
const base = strip(template);
let written = 0;

for (const r of routes) {
  let html = base.replace("</head>", `    ${headFor(r)}\n  </head>`);
  const root = '<div id="root"></div>';
  if (!html.includes(root)) throw new Error("index.html has no empty #root to fill");
  html = html.replace(root, `<div id="root"><div class="seo-fallback">${r.bodyHtml}</div></div>`);

  const file = r.path === "/" ? path.join(DIST, "index.html") : path.join(DIST, r.path, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written++;
}
console.log(`SEO pages written: ${written}`);
