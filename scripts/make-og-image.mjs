// Generates public/og-image.jpg (1200x630) used for link previews.
import sharp from "sharp";
const W = 1200, H = 630;
const logo = await sharp("assets-src/logo2.png").resize({ height: 300 }).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#EFEFF7"/><stop offset="1" stop-color="#DCD3F5"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="520" y="270" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="#221A36">The Consistent</text>
  <text x="520" y="350" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="700" fill="#221A36">Academy</text>
  <text x="520" y="420" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#7C3AED">IELTS · Business Communication · Leadership</text>
  <text x="520" y="465" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#6B637A">Pune &amp; Online · theconsistentacademy.in</text>
</svg>`;
await sharp(Buffer.from(svg)).composite([{ input: logo, left: 150, top: 165 }])
  .jpeg({ quality: 85 }).toFile("public/og-image.jpg");
console.log("ok");
