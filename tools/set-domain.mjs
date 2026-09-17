#!/usr/bin/env node
/* Point the site at its production domain.
 *
 *   node tools/set-domain.mjs 1614hubertstreet.com
 *   node tools/set-domain.mjs --check          (report, change nothing)
 *
 * The domain is written into the canonical link, the og:/twitter: tags, the
 * JSON-LD @id/url/image fields, robots.txt and sitemap.xml. Missing one of
 * those is the classic single-property-site bug: the page goes live, every
 * share card still points at the staging host, and nobody notices until a
 * listing is shared.
 *
 * No dependencies. Netlify does not run this — it is a one-time edit you
 * commit, like any other content change.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['public/index.html', 'public/robots.txt', 'public/sitemap.xml'];
const PLACEHOLDER = '1614-hubert-st.netlify.app';

const arg = process.argv[2];
if (!arg) {
  console.error('usage: node tools/set-domain.mjs <domain>   (or --check)');
  process.exit(1);
}
const check = arg === '--check';

/* Accept "example.com", "https://example.com" or "https://example.com/" and
   store the bare host — every reference builds its own https:// prefix. */
const host = check ? null : arg.replace(/^https?:\/\//, '').replace(/\/+$/, '');
if (host && !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host)) {
  console.error(`"${arg}" does not look like a domain.`);
  process.exit(1);
}

let total = 0;
const stale = [];

for (const rel of FILES) {
  const file = join(ROOT, rel);
  const before = readFileSync(file, 'utf8');
  const hits = (before.match(new RegExp(PLACEHOLDER, 'g')) || []).length;
  total += hits;
  if (hits) stale.push(`${rel}: ${hits}`);
  if (check || !hits) continue;
  writeFileSync(file, before.replaceAll(PLACEHOLDER, host));
  console.log(`  ${rel.padEnd(20)} ${hits} reference(s) -> ${host}`);
}

if (check) {
  console.log(total
    ? `${total} reference(s) still on the placeholder domain:\n  ` + stale.join('\n  ')
    : 'No placeholder references left.');
  process.exit(total ? 1 : 0);
}

if (!total) {
  console.log(`Nothing to change — no "${PLACEHOLDER}" references found.`);
  console.log('If the domain changed again, edit PLACEHOLDER at the top of this file.');
  process.exit(0);
}

console.log(`\n${total} reference(s) updated to ${host}.`);
console.log('Next: commit, redeploy, and re-share any link you had already posted —');
console.log('social platforms cache the old card for a while.');
