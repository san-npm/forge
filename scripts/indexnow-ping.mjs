#!/usr/bin/env node
/**
 * IndexNow ping — notifies Bing, Yandex, Seznam and other IndexNow-compatible
 * search engines whenever the OpenLetz sitemap is updated.
 *
 * The IndexNow key is hosted at /<KEY>.txt in /public. We currently use
 * `bdc7fbebeb30295aa4a9f9dc3ba9b80f` (verified via the matching file in /public).
 *
 * Usage:
 *   node scripts/indexnow-ping.mjs                # ping every URL in sitemap.xml
 *   node scripts/indexnow-ping.mjs https://...    # ping specific URLs
 *
 * Wire it into Vercel via a deployment hook or call manually after a content push.
 */

const KEY = process.env.INDEXNOW_KEY || 'bdc7fbebeb30295aa4a9f9dc3ba9b80f';
const HOST = process.env.INDEXNOW_HOST || 'www.openletz.com';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
}

async function pingIndexNow(urls) {
  if (urls.length === 0) {
    console.log('No URLs to submit.');
    return;
  }
  // IndexNow accepts up to 10,000 URLs per request.
  const batches = [];
  for (let i = 0; i < urls.length; i += 9000) {
    batches.push(urls.slice(i, i + 9000));
  }
  for (const batch of batches) {
    const body = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch,
    };
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    console.log(`IndexNow → ${batch.length} URLs → HTTP ${res.status}`);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(text.slice(0, 500));
    }
  }
}

const cliUrls = process.argv.slice(2).filter((a) => a.startsWith('http'));
const urls = cliUrls.length > 0 ? cliUrls : await fetchSitemapUrls();
console.log(`Submitting ${urls.length} URL(s) to IndexNow…`);
await pingIndexNow(urls);
