// Writes public/sitemap.xml from the single route list in src/seo (static routes + one URL per course).
// Runs as part of `npm run build`. To add a public page, add it to STATIC_ROUTES in src/seo/routes.ts.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadRoutes, SITE_URL } from './scripts/load-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateSitemap() {
  const routes = await loadRoutes();
  const today = new Date().toISOString().split('T')[0];
  const urls = routes
    .map(
      (r) => `
  <url>
    <loc>${SITE_URL}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>
`;
  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml);

  // llms.txt: a plain-text summary for AI assistants, generated from the same data (fees stay in sync).
  const inr = (n) => '₹' + n.toLocaleString('en-IN');
  const courseLines = (aud) =>
    routes
      .filter((r) => r.course && r.course.audience === aud)
      .map((r) => `- [${r.title.replace(' | The Consistent Academy', '')}](${SITE_URL}${r.path}): ${r.course.summary} ${r.course.duration}, ${inr(r.course.price)}.`)
      .join('\n');
  const llms = `# The Consistent Academy

> IELTS preparation, business communication, corporate training, interview coaching, leadership programmes and public speaking courses for kids, taught from Pune, Maharashtra, India, and online. Founded by author and coach Vidya Wankhade.

Contact: +91 77091 09830 · theconsistentacademy@gmail.com · ${SITE_URL}/contact

## Courses for professionals and adults
${courseLines('professional')}

## Online courses for kids
${courseLines('kids')}

## Other pages
- [Leadership Bento Forward Program (LBFP)](${SITE_URL}/lbfp): leadership workshop and passion-project programme.
- [Webinars](${SITE_URL}/webinars): live sessions on public speaking, IELTS and business English.
- [Free tests](${SITE_URL}/tests): English grammar and leadership-style assessments.
- [Blog](${SITE_URL}/blog)
- [Refund policy](${SITE_URL}/refund-policy) · [Privacy policy](${SITE_URL}/privacy-policy) · [Terms](${SITE_URL}/terms)
`;
  fs.writeFileSync(path.join(__dirname, 'public', 'llms.txt'), llms);
  console.log(`Sitemap generated with ${routes.length} URLs`);
}

generateSitemap().catch((e) => {
  console.error('Sitemap generation failed:', e);
  process.exit(1);
});
