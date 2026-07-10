#!/usr/bin/env node
/* Deploy an arbitrary list of files to the live GitHub Pages repo in ONE commit.
 *
 * Why this exists: tools/deploy.mjs uses the Contents API, which creates a
 * SEPARATE COMMIT PER FILE. Pushing 3 files fires 3 concurrent GitHub Pages
 * builds that race each other, and builds fail with "Page build failed".
 * That was the cause of repeated "deployed but the site still shows the old
 * version" problems. Always deploy through a single commit.
 *
 * Usage:
 *   node tools/deploy-files.mjs assets/bc-configurator.js business-cards.html ...
 *   node tools/deploy-files.mjs --message "Wire live pricing" <files...>
 *
 * Paths are relative to prototype/ and map 1:1 to the repo root.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());               // prototype/
const ENV = path.resolve(ROOT, '..', '.env.github');
const env = Object.fromEntries(
  fs.readFileSync(ENV, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; })
);
const { GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN } = env;
const API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`;
const H = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'User-Agent': 'aura-deploy',
  Accept: 'application/vnd.github+json',
  'Content-Type': 'application/json',
};

async function gh(url, opts = {}) {
  const r = await fetch(url, { headers: H, ...opts });
  if (!r.ok) throw new Error(`${opts.method || 'GET'} ${url} -> ${r.status} ${await r.text()}`);
  return r.json();
}

let args = process.argv.slice(2);
let message = 'Deploy site update';
const mi = args.indexOf('--message');
if (mi !== -1) { message = args[mi + 1]; args = args.filter((_, i) => i !== mi && i !== mi + 1); }

const files = args;
if (!files.length) { console.error('No files given.'); process.exit(1); }
for (const f of files) {
  if (!fs.existsSync(path.resolve(ROOT, f))) { console.error(`Missing file: ${f}`); process.exit(1); }
}

console.log(`Deploying ${files.length} file(s) to ${GITHUB_USER}/${GITHUB_REPO} in one commit:`);
files.forEach(f => console.log(`  - ${f}`));

const repo = await gh(API);
const branch = repo.default_branch;
const ref = await gh(`${API}/git/ref/heads/${branch}`);
const baseCommitSha = ref.object.sha;
const baseCommit = await gh(`${API}/git/commits/${baseCommitSha}`);

const tree = [];
for (const f of files) {
  const content = fs.readFileSync(path.resolve(ROOT, f)).toString('base64');
  const blob = await gh(`${API}/git/blobs`, { method: 'POST', body: JSON.stringify({ content, encoding: 'base64' }) });
  tree.push({ path: f, mode: '100644', type: 'blob', sha: blob.sha });
}

const newTree = await gh(`${API}/git/trees`, { method: 'POST', body: JSON.stringify({ base_tree: baseCommit.tree.sha, tree }) });
const commit = await gh(`${API}/git/commits`, {
  method: 'POST',
  body: JSON.stringify({ message, tree: newTree.sha, parents: [baseCommitSha] }),
});
await gh(`${API}/git/refs/heads/${branch}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha }) });

console.log(`Done. Single commit ${commit.sha.slice(0, 7)} on ${branch}. One Pages build will run.`);
