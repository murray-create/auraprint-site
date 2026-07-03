#!/usr/bin/env node
/* AURA template branding pipeline
   Stamps the Aura Print logo + contact strip onto supplier artwork templates
   (Easy Signs, PromoBrands, CMYKhub) so every downloadable template is branded.

   Usage:
     1. Drop supplier template PDFs into  templates/source/
        Name each file to match the product's "template" key in data/products.json
        e.g. corflute-easysigns.pdf, pullup-easysigns.pdf, business-cards.pdf
     2. Put the logo at  assets/aura-logo.png  (white version recommended)
     3. npm install pdf-lib   (once)
     4. node tools/brand-templates.mjs
     5. Branded PDFs land in  templates/  and product pages link them automatically
        on the next  node build.mjs

   The stamp: dark footer bar with logo, URL and phone on every page.        */
import { PDFDocument, rgb } from 'pdf-lib';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';

const SRC = 'templates/source';
const OUT = 'templates';
const LOGO = 'assets/aura-logo.png';

if (!existsSync(SRC)) { mkdirSync(SRC, { recursive: true }); console.log('Created ' + SRC + ' - drop supplier template PDFs in there and re-run.'); process.exit(0); }

const files = readdirSync(SRC).filter(f => f.toLowerCase().endsWith('.pdf'));
if (!files.length) { console.log('No PDFs in ' + SRC + ' yet.'); process.exit(0); }

const logoBytes = existsSync(LOGO) ? readFileSync(LOGO) : null;
if (!logoBytes) console.warn('No logo at ' + LOGO + ' - stamping text only.');

for (const f of files) {
  const doc = await PDFDocument.load(readFileSync(`${SRC}/${f}`), { ignoreEncryption: true });
  const logo = logoBytes ? await doc.embedPng(logoBytes) : null;

  for (const page of doc.getPages()) {
    const { width } = page.getSize();
    const barH = 34;
    // footer bar
    page.drawRectangle({ x: 0, y: 0, width, height: barH, color: rgb(0.059, 0.059, 0.063) });
    if (logo) {
      const lh = barH - 12;
      const lw = (logo.width / logo.height) * lh;
      page.drawImage(logo, { x: 12, y: 6, width: lw, height: lh });
    }
    page.drawText('auraprint.com.au   |   1300 291 277   |   Artwork template - keep all text inside the safe zone', {
      x: logo ? 24 + (logo.width / logo.height) * (barH - 12) : 14,
      y: 12, size: 9, color: rgb(1, 1, 1),
    });
  }
  const out = `${OUT}/${f}`;
  writeFileSync(out, await doc.save());
  console.log('Branded:', out);
}
console.log(`Done - ${files.length} template(s) branded. Run "node build.mjs" to link them on product pages.`);
