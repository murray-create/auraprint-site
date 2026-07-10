#!/usr/bin/env node
// Full-site deploy: push all prototype/*.html, data files, shared assets,
// sitemap + robots to the live GitHub Pages repo in ONE commit (one Pages
// build), and DELETE any repo-root .html that no longer exists locally
// (e.g. retired -p.html duplicates). Git Data API, blobs in concurrent
// batches to stay under shell timeouts.
// Usage: node tools/deploy-site.mjs --message "why"
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());            // prototype/
const ENV = path.resolve(ROOT, '..', '.env.github');
const env = Object.fromEntries(
  fs.readFileSync(ENV, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; })
);
const { GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN } = env;
const API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`;
const H = { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'aura-deploy', Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' };

const msgIdx = process.argv.indexOf('--message');
const MESSAGE = msgIdx > -1 ? process.argv[msgIdx + 1] : 'Site deploy';

async function gh(url, opts = {}) {
  const r = await fetch(url, { headers: H, ...opts });
  if (!r.ok) throw new Error(`${opts.method || 'GET'} ${url} -> ${r.status} ${await r.text()}`);
  return r.json();
}

// ---- files to push -------------------------------------------------------
const files = [];
for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) files.push(f);
for (const d of ['data/products.json', 'data/categories.json', 'data/promo-catalogue.json',
                 'sitemap.xml', 'robots.txt', '.nojekyll'])
  if (fs.existsSync(path.resolve(ROOT, d))) files.push(d);
for (const a of fs.readdirSync(path.resolve(ROOT, 'assets')))
  if (/\.(js|css|svg)$/.test(a)) files.push(`assets/${a}`);

console.log(`Deploying ${files.length} files to ${GITHUB_USER}/${GITHUB_REPO} ...`);

// ---- base commit ----------------------------------------------------------
const repo = await gh(API);
const branch = repo.default_branch;
const ref = await gh(`${API}/git/ref/heads/${branch}`);
const baseCommitSha = ref.object.sha;
const baseCommit = await gh(`${API}/git/commits/${baseCommitSha}`);
const baseTreeSha = baseCommit.tree.sha;

// ---- deletions: repo-root .html files that no longer exist locally --------
const baseTree = await gh(`${API}/git/trees/${baseTreeSha}`);
const localHtml = new Set(files.filter(f => f.endsWith('.html')));
const deletions = (baseTree.tree || [])
  .filter(e => e.type === 'blob' && /^[^/]+\.html$/.test(e.path) && !localHtml.has(e.path))
  .map(e => ({ path: e.path, mode: '100644', type: 'blob', sha: null }));
if (deletions.length) console.log(`Removing ${deletions.length} retired pages: ${deletions.slice(0,5).map(d=>d.path).join(', ')}${deletions.length>5?' …':''}`);

// ---- blobs -----------------------------------------------------------------
const tree = [...deletions];
const CONC = 16;
for (let i = 0; i < files.length; i += CONC) {
  const batch = files.slice(i, i + CONC);
  const results = await Promise.all(batch.map(async f => {
    const content = fs.readFileSync(path.resolve(ROOT, f)).toString('base64');
    const blob = await gh(`${API}/git/blobs`, { method: 'POST', body: JSON.stringify({ content, encoding: 'base64' }) });
    return { path: f, mode: '100644', type: 'blob', sha: blob.sha };
  }));
  tree.push(...results);
  console.log(`  blobs ${Math.min(i + CONC, files.length)}/${files.length}`);
}

// ---- tree, commit, ref -----------------------------------------------------
const newTree = await gh(`${API}/git/trees`, { method: 'POST', body: JSON.stringify({ base_tree: baseTreeSha, tree }) });
const commit = await gh(`${API}/git/commits`, { method: 'POST', body: JSON.stringify({
  message: MESSAGE, tree: newTree.sha, parents: [baseCommitSha],
}) });
await gh(`${API}/git/refs/heads/${branch}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha }) });

console.log(`Done. Commit ${commit.sha.slice(0, 7)} on ${branch}. Pages rebuilds in ~30-60s.`);
