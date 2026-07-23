#!/usr/bin/env node
/*
 * fix-product-icons.mjs
 * ---------------------------------------------------------------------------
 * Replaces emoji placeholder images on AuraPrint product pages and cards with
 * real product photos, then optionally deploys the changed files to GitHub
 * Pages (same GitHub Contents API + .env.github token as tools/deploy*.mjs).
 *
 * Photo sources:
 *   - EasySigns product gallery (the source of the existing 66 photos), for
 *     items EasySigns stocks. Slugs confirmed against easysigns-harvest.json.
 *   - Pexels (Free / commercial use, no attribution required - pexels.com/license)
 *     for the 7 print items EasySigns does not carry. These are tasteful
 *     interim stock photos; swap any assets/img/<slug>.jpg later and it stays.
 *
 * Run from the repo root (the prototype/ folder with assets/ and the .html files):
 *     node fix-product-icons.mjs            # download + wire in, no deploy
 *     node fix-product-icons.mjs --deploy   # also push changed files live
 *
 * Finds .env.github by walking up from here. Override: ENV_GITHUB=/path/.env.github
 * ---------------------------------------------------------------------------
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, 'assets', 'img');
const ES = 'https://www.easysigns.com.au/uploads/content/products/gallery/';
const px = id => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
const DEPLOY = process.argv.includes('--deploy');

// page slug -> { alt, urls:[candidate image URLs, first valid wins], local }
const PRODUCTS = {
  'aluminium-signs':     { alt: 'Aluminium Composite Signs', local: true, urls: [] },

  // EasySigns
  'booklets':            { alt: 'Saddle Stitched Booklets', urls: [ES + 'booklets.jpg'] },
  'vehicle-magnets':     { alt: 'Vehicle Magnets',          urls: [ES + 'car-magnets.jpg'] },
  'teardrop-flags':      { alt: 'Teardrop Flags',           urls: [ES + 'teardrop-banners.jpg'] },
  'marquees':            { alt: 'Marquees',                 urls: [ES + 'pop-up-gazebo.jpg'] },
  'media-walls':         { alt: 'Media Walls',              urls: [ES + 'media-wall.jpg', ES + 'stretch-fabric-media-wall.jpg'] },
  'exhibition-displays': { alt: 'Exhibition Displays',      urls: [ES + 'exhibition-shell-scheme-fabric-graphics.jpg', ES + 'modular-seg-lightbox-display.jpg'] },
  'tablecloths':         { alt: 'Printed Tablecloths',      urls: [ES + 'table-throw.jpg', ES + 'round-table-throws.jpg'] },

  // Pexels stock (interim) for print items EasySigns does not carry
  'perfect-bound-books': { alt: 'Perfect Bound Books',    urls: [px(31567151), px(36519211), px(46274)] }, // stacked books
  'calendars':           { alt: 'Calendars',              urls: [px(6353835)] },  // wall calendar
  'envelopes':           { alt: 'Envelopes',              urls: [px(190295)] },   // white envelope
  'invoice-books':       { alt: 'Invoice Books',          urls: [px(34568328)] }, // bound paper stacks
  'notepads':            { alt: 'Notepads',               urls: [px(733857)] },   // blank notepad
  'with-compliments':    { alt: 'With Compliments Slips', urls: [px(7718804)] },  // stationery
  'safety-signs':        { alt: 'Safety Signs',           urls: [px(4515086)] },  // caution sign
};

const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const report = { wired: [], downloaded: [], missing: [], filesChanged: new Set() };

async function tryDownload(urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url);
      const ct = r.headers.get('content-type') || '';
      if (r.ok && ct.startsWith('image/')) {
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length > 3000) return { url, buf };
      }
    } catch { /* try next */ }
  }
  return null;
}

function wireProduct(pageSlug, alt) {
  const imgRel = `assets/img/${pageSlug}.jpg`;
  const heroNew = `<div class="main photo"><img src="${imgRel}" alt="${alt}"></div>`;
  const thumbImg = `<div class="thumb photo"><img src="${imgRel}" alt="${alt}" loading="lazy"></div>`;

  const heroFile = path.join(ROOT, `${pageSlug}.html`);
  if (fs.existsSync(heroFile)) {
    let s = fs.readFileSync(heroFile, 'utf8'); const o = s;
    s = s.replace(/<div class="main">[^<]*<\/div>/, heroNew);
    if (s !== o) { fs.writeFileSync(heroFile, s); report.filesChanged.add(`${pageSlug}.html`); }
  }

  const cardRe = new RegExp(
    `(href="${pageSlug}\\.html">(?:<span class="badge">[^<]*</span>)?)<div class="thumb">[^<]*</div>`, 'g');
  for (const f of htmlFiles) {
    const fp = path.join(ROOT, f);
    let s = fs.readFileSync(fp, 'utf8'); const o = s;
    s = s.replace(cardRe, `$1${thumbImg}`);
    if (s !== o) { fs.writeFileSync(fp, s); report.filesChanged.add(f); }
  }
}

function findEnv() {
  if (process.env.ENV_GITHUB) return process.env.ENV_GITHUB;
  let dir = ROOT;
  for (let i = 0; i < 5; i++) {
    const cand = path.join(dir, '.env.github');
    if (fs.existsSync(cand)) return cand;
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return null;
}

async function deploy(files) {
  const ENV = findEnv();
  if (!ENV) {
    console.log('\n[deploy] Could not find .env.github (searched up from the repo root).');
    console.log('[deploy] Re-run with ENV_GITHUB=/path/to/.env.github, or use tools/deploy-files.mjs.');
    return;
  }
  const env = Object.fromEntries(fs.readFileSync(ENV, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; }));
  const { GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN } = env;
  const API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents`;
  const H = { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'aura-fix-icons', Accept: 'application/vnd.github+json' };
  console.log(`\n[deploy] Pushing ${files.length} file(s) to ${GITHUB_USER}/${GITHUB_REPO} ...`);
  for (const rel of files) {
    const r0 = await fetch(`${API}/${rel}`, { headers: H });
    const sha = r0.status === 404 ? undefined : (await r0.json()).sha;
    const body = {
      message: `Replace emoji placeholder with real product photo: ${rel}`,
      content: fs.readFileSync(path.join(ROOT, rel)).toString('base64'),
      ...(sha ? { sha } : {}),
    };
    const r = await fetch(`${API}/${rel}`, { method: 'PUT', headers: H, body: JSON.stringify(body) });
    console.log(`[deploy] ${rel} -> ${r.status}`);
  }
  console.log('[deploy] Done. GitHub Pages will rebuild auraprint.com.au within a minute or two.');
}

(async () => {
  if (!fs.existsSync(IMG_DIR)) {
    console.error(`Could not find ${IMG_DIR}. Run this from the repo root (the prototype/ folder).`);
    process.exit(1);
  }
  console.log(`Fixing product icons across ${htmlFiles.length} pages...\n`);

  for (const [slug, cfg] of Object.entries(PRODUCTS)) {
    const target = path.join(IMG_DIR, `${slug}.jpg`);
    if (cfg.local || fs.existsSync(target)) {
      wireProduct(slug, cfg.alt); report.wired.push(slug);
      console.log(`OK   ${slug} (image present, wired in)`);
      continue;
    }
    const dl = cfg.urls.length ? await tryDownload(cfg.urls) : null;
    if (dl) {
      fs.writeFileSync(target, dl.buf); wireProduct(slug, cfg.alt);
      report.downloaded.push(slug); report.wired.push(slug);
      console.log(`OK   ${slug} (downloaded ${(dl.buf.length/1024|0)}KB)`);
    } else {
      report.missing.push(slug);
      console.log(`NEED ${slug} - could not fetch; add assets/img/${slug}.jpg and re-run`);
    }
  }

  const changed = [...report.filesChanged].sort();
  console.log(`\nWired ${report.wired.length}, downloaded ${report.downloaded.length}, still need ${report.missing.length}.`);
  if (report.missing.length) console.log(`Need photos: ${report.missing.join(', ')}`);
  console.log(`Files changed (${changed.length}): ${changed.join(', ') || 'none'}`);

  if (DEPLOY && changed.length) {
    await deploy([...changed, ...report.downloaded.map(s => `assets/img/${s}.jpg`)]);
  } else if (changed.length) {
    console.log('\nRun again with --deploy to push these live.');
  }
})();
