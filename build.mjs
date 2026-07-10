#!/usr/bin/env node
/* AURA PRINT & PROMO - static site generator
   Reads data/products.json + data/categories.json and generates:
   - one product page per product ({slug}.html)
   - category hub pages (print.html, signage.html)
   - refreshes homepage category panels between GEN markers
   - sitemap.xml + robots.txt + 404.html
   Run: node build.mjs

   PRICING: there are no prices in this builder or in products.json option
   data. Products with `live` render the shared aura-pricing.js configurator
   (Supabase public.product_prices); products with `liveBc` render the
   business-card configurator (public.bc_prices). Everything else is
   From-price + Get a Quote. The old multiplier "prototype pricing"
   calculators are gone and cannot be regenerated.                     */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const V = '20260710a';                       // cache-bust for css/js assets
const CANON = 'https://auraprint.com.au';    // canonical domain (post-cutover)

const products = JSON.parse(readFileSync('data/products.json', 'utf8'));
const cats = JSON.parse(readFileSync('data/categories.json', 'utf8'));
const bySlug = Object.fromEntries(products.map(p => [p.slug, p]));

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const attr = s => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const money = n => '$' + n.toLocaleString();

/* Titles: strip any pre-existing brand suffix before appending it once. */
const BRAND = 'Aura Print & Promo';
function pageTitle(t) {
  return t.replace(/\s*\|\s*Aura Print (&|&amp;) Promo\s*$/i, '') + ' | ' + BRAND;
}

const HEAD = (title, desc, file, ogImg) => `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(pageTitle(title))}</title>
<meta name="description" content="${attr(desc)}">
<link rel="canonical" href="${CANON}/${file}">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:title" content="${attr(pageTitle(title))}">
<meta property="og:description" content="${attr(desc)}">
<meta property="og:url" content="${CANON}/${file}">
<meta property="og:image" content="${CANON}/${ogImg || 'assets/aura-logo.png'}">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/aura.css?v=${V}">
</head>
<body>`;

const FOOT = `<script src="assets/config.js?v=${V}"></script>\n<script src="assets/aura.js?v=${V}"></script>\n</body>\n</html>`;

/* ---------- product card (photo-first design) ---------- */
function card(p) {
  const thumb = p.img
    ? `<div class="thumb photo"><img src="${p.img}" alt="${attr(p.name)}" loading="lazy"></div>`
    : `<div class="thumb">${p.icon}</div>`;
  const isLive = p.live || p.liveBc;
  const price = p.from ? `from <em>${money(p.from)}</em>` : (isLive ? 'price online' : 'fast quote');
  const tag = isLive ? 'Price online' : 'Get a quote';
  return `<a class="card" href="${p.slug}.html">${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}${thumb}
  <div class="body"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
  <div class="cardfoot"><div class="from">${price}</div><span class="cardtag">${tag} →</span></div></div></a>`;
}

/* ---------- live configurator blocks ---------- */
function liveSection(p) {
  const l = p.live;
  return `
      <div id="aura-config" data-product="${p.slug}"
           data-axes='${JSON.stringify(l.axes).replace(/'/g,'&#39;')}'
           data-default='${JSON.stringify(l.default).replace(/'/g,'&#39;')}'
           data-qty="${l.qty}"></div>
      ${p.liveNote ? `<p style="font-size:13px;color:#6f6961;margin-top:14px">${p.liveNote}</p>` : ''}`;
}
function liveBcSection(p) {
  const b = p.liveBc;
  return `
      <div id="bc-config" data-tier="${b.tier}"${b.stock ? ` data-stock="${attr(b.stock)}"` : ''}></div>
      ${p.liveNote ? `<p style="font-size:13px;color:#6f6961;margin-top:14px">${p.liveNote}</p>` : ''}`;
}

/* ---------- artwork spec line: no orphaned "label:" bullets ---------- */
function specLine(s) {
  const i = s.indexOf(':');
  const label = i > 0 ? s.slice(0, i).trim() : '';
  const rest = i > 0 ? s.slice(i + 1).trim() : '';
  if (label && rest) return `<li>▸ <b style="color:#fff">${esc(label)}:</b> ${esc(rest)}</li>`;
  return `<li>▸ <b style="color:#fff">${esc(label || s.replace(/:\s*$/,''))}</b></li>`;
}

/* ---------- product page ---------- */
function productPage(p) {
  const catName = cats[p.cat].name;
  const gallery = p.img
    ? `<div class="main photo"><img src="${p.img}" alt="${attr(p.name)}"></div>`
    : `<div class="main">${p.icon}</div>`;
  const templatePath = `templates/${p.template}.pdf`;
  const hasTemplate = p.template && existsSync(templatePath);
  const quoteCta = `<a class="btn btn-aura" href="quote.html?product=${p.slug}" style="flex:1;text-align:center">Get a fast quote →</a>`;

  const priceSection = p.live ? liveSection(p)
    : p.liveBc ? liveBcSection(p)
    : `
      ${p.from ? `<div class="price-box" style="margin-top:24px">
        <div><div class="from">From</div><div class="gst">guide price - we quote exactly to your spec</div></div>
        <div class="amount grad-text">${money(p.from)}</div>
      </div>` : ''}
      <div class="panel" style="margin-top:20px;background:var(--paper)">
        <h3 style="font-size:17px;margin-bottom:8px">Priced per job - quotes back within the hour</h3>
        <p style="font-size:14.5px;color:#555">Produced through our national trade production network. Tell us size, quantity and deadline and we'll price it fast (Mon-Fri 8:30-5).</p>
      </div>
      <div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">${quoteCta}</div>`;

  return `${HEAD(p.seo, p.desc, `${p.slug}.html`, p.img && !/^https?:/.test(p.img) ? p.img : null)}

<div class="page-hero" style="padding:40px 0 36px">
  <div class="wrap"><div class="crumbs"><a href="index.html">Home</a> / <a href="${p.cat}.html">${esc(catName)}</a> / <b style="color:#fff">${esc(p.name)}</b></div></div>
</div>

<section>
  <div class="wrap config">
    <div class="gallery">
      ${gallery}
      <div class="trust">
        <span>📍 <b>Baringa, Sunshine Coast</b></span>
        <span>✅ <b>Proof before print</b></span>
        <span>🇦🇺 <b>100% Australian owned</b></span>
      </div>
      ${hasTemplate ? `<a class="btn btn-ghost" href="${templatePath}" download style="margin-top:18px;width:100%;text-align:center">⬇ Download artwork template (PDF)</a>` : ''}
    </div>
    <div>
      <h1 class="prod">${esc(p.name).toUpperCase()}</h1>
      <p style="color:#6b6560;margin-bottom:6px">${esc(p.desc)}</p>
      ${priceSection}
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap split">
    <div>
      <h2 style="font-size:clamp(24px,3vw,36px);margin-bottom:16px">Artwork <span class="grad-text">setup specs</span></h2>
      <ul style="list-style:none;color:#b8b2ab;font-size:15px;line-height:2.1">
        ${(p.specs || []).map(specLine).join('\n        ')}
      </ul>
      ${hasTemplate ? `<a class="btn btn-aura" href="${templatePath}" download style="margin-top:20px">Download template</a>` : `<p style="color:#8a847d;font-size:13px;margin-top:16px">Need an artwork template? Ask via chat or the quote form and we'll send one.</p>`}
    </div>
    <div>
      <h2 style="font-size:clamp(24px,3vw,36px);margin-bottom:16px">Why print with <span class="grad-text">Aura?</span></h2>
      <p style="color:#b8b2ab">Every job is preflight-checked by a human, and you approve a digital proof before anything prints. Pick up in Baringa or have it delivered anywhere in Australia.</p>
    </div>
  </div>
</section>

${p.faqs && p.faqs.length ? `<section class="pad faq">
  <div class="wrap" style="max-width:860px">
    <h2 style="font-size:clamp(26px,3.4vw,40px);margin-bottom:30px">Frequently asked <span class="grad-text">questions</span></h2>
    ${p.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n    ')}
  </div>
</section>` : ''}

${p.related && p.related.length ? `<section class="pad" style="padding-top:0">
  <div class="wrap">
    <div class="sec-head"><h2>You might also <span class="grad-text">need</span></h2></div>
    <div class="grid">
      ${p.related.filter(r => bySlug[r]).map(r => card(bySlug[r])).join('\n      ')}
    </div>
  </div>
</section>` : ''}

<script src="assets/config.js?v=${V}"></script>
<script src="assets/aura.js?v=${V}"></script>
${p.live ? `<script src="assets/aura-pricing.js?v=${V}"></script>` : ''}${p.liveBc ? `<script src="assets/bc-configurator.js?v=${V}"></script>` : ''}
</body>
</html>`;
}

/* ---------- category hub page ---------- */
function categoryPage(key) {
  const c = cats[key];
  const heroParts = c.hero.split(c.heroAccent);
  const sections = c.subcats.map(sub => {
    const items = products.filter(p => p.cat === key && p.sub === sub);
    if (!items.length) return '';
    const [a, ...rest] = sub.split(' & ');
    return `<section class="pad" style="padding-bottom:20px">
  <div class="wrap">
    <div class="sec-head"><h2>${esc(a)} ${rest.length ? `&amp; <span class="grad-text">${esc(rest.join(' & '))}</span>` : ''}</h2></div>
    <div class="grid">
      ${items.map(card).join('\n      ')}
    </div>
  </div>
</section>`;
  }).join('\n');

  return `${HEAD(`${c.name} Sunshine Coast`, c.intro, `${key}.html`)}

<div class="page-hero">
  <div class="wrap">
    <div class="crumbs"><a href="index.html">Home</a> / <b style="color:#fff">${esc(c.name)}</b></div>
    <h1>${esc(heroParts[0])}<span class="grad-text">${esc(c.heroAccent)}</span>${esc(heroParts[1] || '')}</h1>
    <p>${esc(c.intro)}</p>
  </div>
</div>

${sections}

<section class="band" style="margin-top:60px">
  <div class="wrap" style="text-align:center">
    <h2 style="font-size:clamp(26px,3.4vw,42px);margin-bottom:14px">Can't see what you need?</h2>
    <p style="color:#b8b2ab;max-width:560px;margin:0 auto 26px">If it can be printed, we can do it. Tell us about the job and we'll price it within the hour.</p>
    <a class="btn btn-aura" href="quote.html">Get a custom quote</a>
  </div>
</section>

${FOOT}`;
}

/* ---------- generate ---------- */
let count = 0;
for (const p of products) { writeFileSync(`${p.slug}.html`, productPage(p)); count++; }
for (const key of Object.keys(cats)) { writeFileSync(`${key}.html`, categoryPage(key)); count++; }

/* refresh homepage panels between GEN markers */
if (existsSync('index.html')) {
  let idx = readFileSync('index.html', 'utf8');
  for (const key of Object.keys(cats)) {
    const featured = products.filter(p => p.cat === key).slice(0, 6);
    const html = `<!--GEN:${key}-->\n      <div class="grid">\n      ${featured.map(card).join('\n      ')}\n      </div>\n      <!--/GEN:${key}-->`;
    const re = new RegExp(`<!--GEN:${key}-->[\\s\\S]*?<!--/GEN:${key}-->`);
    if (re.test(idx)) { idx = idx.replace(re, html); }
  }
  writeFileSync('index.html', idx);
}

/* ---------- sitemap.xml + robots.txt ---------- */
const staticPages = ['index.html','quote.html','contact.html','about.html','promo.html',
  'blog.html','blog-what-is-bleed.html','blog-cmyk-vs-rgb.html','blog-paper-sizes-australia.html',
  'blog-print-ready-canva.html','art-setup.html','trade-terms.html','privacy-policy.html',
  'refund-policy.html','business-cards.html','budget-business-cards.html'];
const urls = [...new Set([
  ...staticPages,
  ...products.map(p => `${p.slug}.html`),
  ...Object.keys(cats).map(k => `${k}.html`),
])];
const today = new Date().toISOString().slice(0, 10);
writeFileSync('sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${CANON}/${u === 'index.html' ? '' : u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`);
writeFileSync('robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /admin-pricing.html\nSitemap: ${CANON}/sitemap.xml\n`);

/* ---------- 404 ---------- */
writeFileSync('404.html', `${HEAD('Page not found', "That page has moved or never existed. Head back to the catalogue - if it can be printed, we can do it.", '404.html')}
<div class="page-hero"><div class="wrap">
  <h1>LOST IN THE <span class="grad-text">PRESS?</span></h1>
  <p>That page doesn't exist. The catalogue does.</p>
  <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap">
    <a class="btn btn-aura" href="index.html">Back to the homepage</a>
    <a class="btn btn-ghost" style="border-color:#fff;color:#fff" href="quote.html">Get a quote</a>
  </div>
</div></div>
${FOOT}`);

console.log(`Generated ${count} pages (${products.length} products, ${Object.keys(cats).length} categories) + sitemap (${urls.length} urls) + robots + 404.`);
