#!/usr/bin/env node
/* AURA PRINT & PROMO - static site generator
   Reads data/products.json + data/categories.json and generates:
   - one configurator/quote page per product ({slug}.html)
   - category hub pages (print.html, signage.html)
   - refreshes homepage category panels between GEN markers
   Run: node build.mjs                                          */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const products = JSON.parse(readFileSync('data/products.json', 'utf8'));
const cats = JSON.parse(readFileSync('data/categories.json', 'utf8'));
const bySlug = Object.fromEntries(products.map(p => [p.slug, p]));

const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const money = n => '$' + n.toLocaleString();

const HEAD = (title, desc) => `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} | Aura Print &amp; Promo</title>
<meta name="description" content="${esc(desc)}">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/aura.css">
</head>
<body>`;

const FOOT = `<script src="assets/config.js"></script>\n<script src="assets/aura.js"></script>\n</body>\n</html>`;

/* ---------- product card (photo-first design) ---------- */
function card(p) {
  const thumb = p.img
    ? `<div class="thumb photo"><img src="${p.img}" alt="${esc(p.name)}" loading="lazy"></div>`
    : `<div class="thumb">${p.icon}</div>`;
  const price = p.from ? `from <em>${money(p.from)}</em>` : (p.portal ? 'order online' : 'fast quote');
  const tag = p.portal ? 'Order online' : 'Get a quote';
  return `<a class="card" href="${p.slug}.html">${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}${thumb}
  <div class="body"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
  <div class="cardfoot"><div class="from">${price}</div><span class="cardtag">${tag} →</span></div></div></a>`;
}

/* ---------- configurator options ---------- */
function optsHtml(p) {
  if (!p.opts) return '';
  return p.opts.map(gr => `
      <div class="optlabel">${esc(gr.label)}</div>
      <div class="opts" data-group="${gr.g}">
        ${gr.choices.map(c => {
          const data = c.b !== undefined ? `data-base="${c.b}"` : c.a !== undefined ? `data-add="${c.a}"` : c.s !== undefined ? `data-mult2="${c.s}"` : `data-mult="${c.m}"`;
          return `<button class="opt${c.on ? ' on' : ''}" ${data}>${esc(c.n)}</button>`;
        }).join('\n        ')}
      </div>`).join('');
}

const CALC_JS = `
function calc(){
  let base=0, mult=1, add=0, speed=1;
  document.querySelectorAll('.opts .on').forEach(o=>{
    if(o.dataset.base!==undefined) base=+o.dataset.base;
    else if(o.dataset.add!==undefined) add+=+o.dataset.add;
    else if(o.dataset.mult2!==undefined) speed=+o.dataset.mult2;
    else if(o.dataset.mult!==undefined) mult*=+o.dataset.mult;
  });
  const total=Math.round((base*mult+add)*speed);
  const el=document.getElementById('price');
  const start=parseFloat(el.dataset.v||0), t0=performance.now();
  function tick(t){const k=Math.min(1,(t-t0)/300);el.textContent='$'+Math.round(start+(total-start)*k).toLocaleString();
    if(k<1)requestAnimationFrame(tick);else el.dataset.v=total;}
  requestAnimationFrame(tick);
}
document.querySelectorAll('.opts').forEach(g=>{
  g.addEventListener('click',e=>{
    if(!e.target.classList.contains('opt'))return;
    g.querySelectorAll('.opt').forEach(o=>o.classList.remove('on'));
    e.target.classList.add('on'); calc();
  });
});
calc();`;

/* ---------- product page ---------- */
function productPage(p) {
  const catName = cats[p.cat].name;
  const gallery = p.img
    ? `<div class="main photo"><img src="${p.img}" alt="${esc(p.name)}"></div>`
    : `<div class="main">${p.icon}</div>`;
  const templatePath = `templates/${p.template}.pdf`;
  const hasTemplate = p.template && existsSync(templatePath);
  const orderCta = p.portal
    ? `<a class="btn btn-aura" href="order.html?product=${p.slug}" style="flex:1;text-align:center">Order &amp; upload artwork →</a>
       <a class="btn btn-ghost" href="quote.html?product=${p.slug}">Custom quote</a>`
    : `<a class="btn btn-aura" href="quote.html?product=${p.slug}" style="flex:1;text-align:center">Get a fast quote →</a>`;

  const priceSection = p.opts ? `
      ${optsHtml(p)}
      <div class="price-box" style="margin-top:28px">
        <div><div class="from">Your price</div><div class="gst">inc. GST, ex. delivery</div></div>
        <div class="amount grad-text" id="price">${p.from ? money(p.from) : ''}</div>
      </div>
      <div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">${orderCta}</div>
      <p style="font-size:12.5px;color:#8a847d;margin-top:12px">Prototype pricing for demonstration. Live prices come from the Aura pricing engine.</p>`
    : `
      <div class="panel" style="margin-top:24px;background:var(--paper)">
        <h3 style="font-size:17px;margin-bottom:8px">Priced per job - quotes back within the hour</h3>
        <p style="font-size:14.5px;color:#555">This product is quoted to your exact spec. Tell us size, quantity and deadline and we'll price it fast (Mon-Fri 8:30-5).</p>
      </div>
      <div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">${orderCta}</div>`;

  return `${HEAD(p.seo, p.desc)}

<div class="page-hero" style="padding:40px 0 36px">
  <div class="wrap"><div class="crumbs"><a href="index.html">Home</a> / <a href="${p.cat}.html">${esc(catName)}</a> / <b style="color:#fff">${esc(p.name)}</b></div></div>
</div>

<section>
  <div class="wrap config">
    <div class="gallery">
      ${gallery}
      <div class="trust">
        <span>★★★★★ <b>Google reviews</b></span>
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
        ${(p.specs || []).map(s => `<li>▸ <b style="color:#fff">${esc(s.split(':')[0])}:</b>${esc(s.includes(':') ? s.split(':').slice(1).join(':') : '')}</li>`).join('\n        ')}
      </ul>
      ${hasTemplate ? `<a class="btn btn-aura" href="${templatePath}" download style="margin-top:20px">Download template</a>` : `<p style="color:#8a847d;font-size:13px;margin-top:16px">Aura-branded artwork template coming soon - ask via chat and we'll send it.</p>`}
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

<script src="assets/config.js"></script>
<script src="assets/aura.js"></script>
${p.opts ? `<script>${CALC_JS}</script>` : ''}
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

  return `${HEAD(`${c.name} Sunshine Coast`, c.intro)}

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
console.log(`Generated ${count} pages (${products.length} products, ${Object.keys(cats).length} categories).`);
