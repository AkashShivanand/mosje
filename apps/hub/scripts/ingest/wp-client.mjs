// WordPress REST + sitemap client for dosje.gov.in.
const BASE = "https://www.dosje.gov.in";
const REST = `${BASE}/wp-json/wp/v2`;

export function buildRestUrl(restBase, { page = 1, perPage = 100, fields, query } = {}) {
  const params = new URLSearchParams();
  params.set("per_page", String(perPage));
  params.set("page", String(page));
  if (fields?.length) params.set("_fields", fields.join(","));
  let url = `${REST}/${restBase}?${params.toString()}`;
  // `query` is a raw querystring fragment (e.g. "documents-type=28,29") appended
  // verbatim so callers can use REST taxonomy filters not modelled above.
  if (query) url += `&${query}`;
  return url;
}

export function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
}

export function totalPagesFromHeaders(headers) {
  const v = headers.get("x-wp-totalpages");
  const n = v ? Number(v) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Fetch JSON with retry + polite delay. `fetchImpl` is injectable for tests.
export async function fetchJson(url, { retries = 3, delayMs = 400, fetchImpl = fetch } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchImpl(url, { headers: { "User-Agent": "mosje-ingest/1.0" } });
      if (!res.ok) { const e = new Error(`HTTP ${res.status} for ${url}`); e.status = res.status; e.retryAfter = res.headers.get?.("retry-after"); throw e; }
      const body = await res.json();
      await sleep(delayMs);
      return { body, headers: res.headers };
    } catch (err) {
      lastErr = err;
      await sleep(backoffMs(err, attempt, delayMs));
    }
  }
  throw lastErr;
}

export async function fetchText(url, opts = {}) {
  const { fetchImpl = fetch } = opts;
  const res = await fetchImpl(url, { headers: { "User-Agent": "mosje-ingest/1.0" } });
  if (!res.ok) { const e = new Error(`HTTP ${res.status} for ${url}`); e.status = res.status; throw e; }
  return res.text();
}

// Pull ALL records for a CPT across pages.
export async function fetchAllRecords(restBase, { fields, query, ...opts } = {}) {
  const first = await fetchJson(buildRestUrl(restBase, { page: 1, fields, query }), opts);
  const pages = totalPagesFromHeaders(first.headers);
  const all = [...first.body];
  for (let page = 2; page <= pages; page++) {
    const next = await fetchJson(buildRestUrl(restBase, { page, fields, query }), opts);
    all.push(...next.body);
  }
  return all;
}

// Canonical URL set for a collection, from its sitemap (handles multi-file via index probing).
export async function fetchSitemapUrls(type, { maxFiles = 5, ...opts } = {}) {
  const urls = [];
  for (let i = 1; i <= maxFiles; i++) {
    try {
      const xml = await fetchText(`${BASE}/wp-sitemap-posts-${type}-${i}.xml`, opts);
      urls.push(...parseSitemapLocs(xml));
    } catch (err) {
      if (err && (err.status === 404 || err.status === 410)) break; // end of files
      throw err; // transient failure must not silently truncate the URL set
    }
  }
  return urls;
}

// How long to wait before retrying. The origin rate-limits (HTTP 429) at roughly
// six concurrent requests, so a 429 backs off for Retry-After, else 30s × attempt.
export function backoffMs(err, attempt, delayMs = 400) {
  if (err?.status === 429) {
    const ra = Number(err.retryAfter);
    return Number.isFinite(ra) && ra > 0 ? ra * 1000 : 30_000 * (attempt + 1);
  }
  return delayMs * (attempt + 1) * 2;
}

// ── Record pages & listings ─────────────────────────────────────────────────
// Most of the site's record metadata (file URL, size, year, event venue, gallery
// images) is NOT exposed over REST — the ACF/theme fields are rendered only into
// each record's page. These helpers fetch that HTML politely.

// GET an HTML page with retry + polite delay. Returns the body text.
export async function fetchHtml(url, { retries = 6, delayMs = 400, fetchImpl = fetch } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchImpl(url, { headers: { "User-Agent": "mosje-ingest/1.0" } });
      if (!res.ok) { const e = new Error(`HTTP ${res.status} for ${url}`); e.status = res.status; e.retryAfter = res.headers.get("retry-after"); throw e; }
      const body = await res.text();
      await sleep(delayMs);
      return body;
    } catch (err) {
      lastErr = err;
      if (err?.status === 404 || err?.status === 410) break; // gone: do not retry
      await sleep(backoffMs(err, attempt, delayMs));
    }
  }
  throw lastErr;
}

// POST a form (the theme's admin-ajax listings) with retry + polite delay.
export async function postForm(url, fields, { retries = 6, delayMs = 400, fetchImpl = fetch } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const body = new FormData();
      for (const [k, v] of Object.entries(fields)) body.append(k, String(v ?? ""));
      const res = await fetchImpl(url, { method: "POST", body, headers: { "User-Agent": "mosje-ingest/1.0" } });
      if (!res.ok) { const e = new Error(`HTTP ${res.status} for POST ${url}`); e.status = res.status; e.retryAfter = res.headers.get("retry-after"); throw e; }
      const text = await res.text();
      await sleep(delayMs);
      return text;
    } catch (err) {
      lastErr = err;
      await sleep(backoffMs(err, attempt, delayMs));
    }
  }
  throw lastErr;
}

// Sitemap file URLs for one post type in a Rank Math sitemap index
// ("documents-sitemap1.xml" … or "booking-sitemap.xml").
export function sitemapFilesForType(indexXml, type) {
  const esc = type.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`/${esc}-sitemap\\d*\\.xml$`);
  return parseSitemapLocs(indexXml).filter((u) => re.test(u));
}

// Canonical URL set from the Rank Math index (sitemap_index.xml). The legacy
// wp-sitemap-posts-<type>-N.xml URLs 301 to the same Rank Math file for every N,
// which is why fetchSitemapUrls over-counts; new collections use this instead.
export async function fetchRankMathSitemapUrls(type, opts = {}) {
  const index = await fetchHtml(`${BASE}/sitemap_index.xml`, opts);
  const urls = new Set();
  for (const file of sitemapFilesForType(index, type)) {
    for (const u of parseSitemapLocs(await fetchHtml(file, opts))) urls.add(u);
  }
  return [...urls];
}
