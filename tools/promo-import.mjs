#!/usr/bin/env node
/* AURA PRINT & PROMO - PromoBrands catalogue -> public site data
   Reads ../pricing-engine/data/promobrands/catalogue.json (supplier COSTS)
   and writes data/promo-catalogue.json containing SELL prices only.

   Pricing mirrors the pricing engine's global rule: 50% markup.
   The site's calculator computes: total = unit(qty) x qty + imprint x qty + setup,
   then rounds to the nearest dollar (engine's 'nearest_dollar' rounding).
   All prices ex GST - GST is added for display client-side.

   NEVER commit or publish the pricing-engine catalogue.json itself - it holds
   wholesale costs. This transform is the only bridge to the public site.

   Run: node tools/promo-import.mjs                                        */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, '..', '..', 'pricing-engine', 'data', 'promobrands', 'catalogue.json');
const OUT = join(HERE, '..', 'data', 'promo-catalogue.json');

const MARKUP = 1.5; // keep in sync with the global rule in pricing-engine/seed.sql
const sell = c => c == null ? null : Math.round(c * MARKUP * 100) / 100;
const stripHtml = s => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const catalogue = JSON.parse(readFileSync(SRC, 'utf8'));
const out = [];

for (const p of catalogue) {
  if (!p.priceTables.length) continue; // quote-only products stay off the instant-price catalogue

  const tables = p.priceTables.map(t => ({
    name: t.name,
    breaks: t.breaks.map(b => ({ q: b.qty, u: sell(b.unitPrice) })), // u = SELL per unit ex GST
  })).filter(t => t.breaks.length);
  if (!tables.length) continue;

  const imprints = p.imprintMethods.map(m => ({
    name: m.name,
    u: sell(m.cost) ?? 0,          // SELL per unit ex GST
    size: m.size || null,
  }));

  const onHandTotal = p.inventory.reduce((s, i) => s + (i.onHand || 0), 0);
  const colours = p.inventory
    .filter(i => i.colour && i.colour !== 'MISC')
    .map(i => ({ c: i.colour, n: i.onHand }));

  const img = p.images.unbranded[0]?.url || p.images.branded[0] || null;
  const fromUnit = Math.min(...tables.flatMap(t => t.breaks.map(b => b.u)));

  out.push({
    code: p.sku,
    name: p.name,
    desc: stripHtml(p.description).slice(0, 180),
    cat: p.categories[0]?.Category_Name || 'Other',
    cats: p.categories.map(c => c.Category_Name),
    appa: p.appaCategories,
    eco: p.flags.eco ? 1 : 0,
    isNew: p.flags.isNew ? 1 : 0,
    trending: p.flags.trending ? 1 : 0,
    img,
    imgColours: p.images.unbranded.filter(i => i.colour).map(i => ({ c: i.colour, url: i.url })),
    onHand: onHandTotal,
    colours: colours.slice(0, 24),
    stockAsAt: p.inventory[0]?.lastUpdated || null,
    setup: sell(p.setup.new) ?? 0,   // SELL ex GST, applied once per decoration
    tables,
    imprints,
    from: fromUnit,
    details: p.details,
    highlights: p.highlights,
  });
}

out.sort((a, b) => (b.trending - a.trending) || (b.onHand - a.onHand));
writeFileSync(OUT, JSON.stringify(out));
const cats = {};
for (const p of out) cats[p.cat] = (cats[p.cat] || 0) + 1;
console.log(`Wrote ${out.length} products to data/promo-catalogue.json (${(JSON.stringify(out).length / 1024).toFixed(0)} KB)`);
console.log('Top categories:', Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `${k} (${v})`).join(', '));
