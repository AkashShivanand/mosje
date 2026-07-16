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
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const body = await res.json();
      await sleep(delayMs);
      return { body, headers: res.headers };
    } catch (err) {
      lastErr = err;
      await sleep(delayMs * (attempt + 1) * 2);
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
