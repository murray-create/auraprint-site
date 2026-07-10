#!/usr/bin/env node
// Deploy changed files from prototype/ to the live GitHub Pages repo (murray-create/auraprint-site)
// via the GitHub Contents API. Reads credentials from ../../.env.github.
// Usage: node tools/deploy.mjs <repoPath> <localFile> [<repoPath> <localFile> ...]
//    or: node tools/deploy.mjs   (deploys the default form-wiring file set)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());                 // prototype/
const ENV = path.resolve(ROOT, '..', '.env.github');
const env = Object.fromEntries(
  fs.readFileSync(ENV, 'utf8').split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; })
);
const { GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN } = env;
const API = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents`;
const H = { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'aura-deploy', Accept: 'application/vnd.github+json' };

// default set: the form-wiring change
let pairs = process.argv.slice(2);
if (pairs.length === 0) {
  pairs = [
    'assets/config.js', 'assets/config.js',
    'assets/aura.js',   'assets/aura.js',
    'quote.html',       'quote.html',
    'contact.html',     'contact.html',
  ];
}

async function getSha(repoPath) {
  const r = await fetch(`${API}/${repoPath}`, { headers: H });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GET ${repoPath} -> ${r.status}`);
  return (await r.json()).sha;
}

async function put(repoPath, localFile) {
  const content = fs.readFileSync(path.resolve(ROOT, localFile));
  const sha = await getSha(repoPath);
  const body = {
    message: `Wire enquiry + quote forms to Web3Forms (${repoPath})`,
    content: content.toString('base64'),
    ...(sha ? { sha } : {}),
  };
  const r = await fetch(`${API}/${repoPath}`, { method: 'PUT', headers: H, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`PUT ${repoPath} -> ${r.status} ${await r.text()}`);
  console.log(`  ✓ ${repoPath} ${sha ? 'updated' : 'created'}`);
}

console.log(`Deploying to ${GITHUB_USER}/${GITHUB_REPO}:`);
for (let i = 0; i < pairs.length; i += 2) {
  await put(pairs[i], pairs[i + 1]);
}
console.log('Done. GitHub Pages rebuilds in ~30-60s.');
