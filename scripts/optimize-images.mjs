// One-off image optimiser. Converts large photos in public/ to resized WebP and
// moves the untouched originals to assets-src/ (not deployed). Safe to re-run:
// originals already in assets-src/ are used as the source.
//
//   node scripts/optimize-images.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const PUBLIC = "public";
const SRC = "assets-src";
const SKIP_DIRS = new Set(["payment"]); // tiny payment-method logos, left alone
const KEEP_NAME_PNG = { "logo.png": 160, "logo2.png": 256 }; // referenced externally; resize in place

// [path prefix, max width, webp quality]
const RULES = [
  ["developers.png", 288, 80],
  ["gallery/", 1200, 76],
  ["courses/", 1200, 80],
  ["leadership/", 1200, 80],
  ["team/", 600, 82],
  ["books/", 600, 82],
  ["consistent communicator's path.png", 1400, 80],
];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? (SKIP_DIRS.has(e.name) ? [] : walk(p)) : [p];
  });

const rel = (p) => path.relative(PUBLIC, p).split(path.sep).join("/");
const isImg = (p) => /\.(png|jpe?g)$/i.test(p);
let before = 0, after = 0;

for (const file of walk(PUBLIC).filter(isImg)) {
  const r = rel(file);
  const name = path.basename(r);
  const keep = KEEP_NAME_PNG[name] && !r.includes("/");
  const rule = RULES.find(([prefix]) => r.startsWith(prefix));
  if (!keep && !rule) continue;

  const backup = path.join(SRC, r);
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  if (!fs.existsSync(backup)) fs.copyFileSync(file, backup);
  const input = backup;
  before += fs.statSync(input).size;

  if (keep) {
    const buf = await sharp(input).rotate().resize({ width: KEEP_NAME_PNG[name], withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
    fs.writeFileSync(file, buf);
    after += buf.length;
  } else {
    const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
    await sharp(input).rotate().resize({ width: rule[1], withoutEnlargement: true })
      .webp({ quality: rule[2], effort: 5 }).toFile(out);
    after += fs.statSync(out).size;
    fs.unlinkSync(file);
  }
}
console.log(`Done: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB`);
