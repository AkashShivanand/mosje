import { fetchHtml, postForm } from "./wp-client.mjs";
import { cached, cacheKey } from "./html-cache.mjs";
import { mapPool } from "./utils.mjs";

const BASE = "https://www.dosje.gov.in";
const CONCURRENCY = Number(process.env.INGEST_CONCURRENCY || 2);
const DAY_MS = 24 * 60 * 60 * 1000;

// One record's public page, cached by URL + last-modified.
export function fetchRecordPage(raw, opts = {}) {
  return cached(cacheKey(raw.link, raw.modified_gmt ?? ""), () => fetchHtml(raw.link, opts));
}

// Every record's page for a list of REST rows, `concurrency` at a time.
// Returns Map(link -> html); a page that fails is logged and left out.
export async function fetchRecordPages(raws, { label = "", concurrency = CONCURRENCY } = {}) {
  const pages = new Map();
  let done = 0;
  await mapPool(raws, concurrency, async (raw) => {
    try {
      pages.set(raw.link, await fetchRecordPage(raw));
    } catch (err) {
      console.warn(`  ! page failed (${raw.link}): ${err.message}`);
    }
    done++;
    if (done % 250 === 0) console.log(`  ${label} pages ${done}/${raws.length}`);
  });
  return pages;
}

// Highest `data-page` in the listing's pagination block.
export function lastListingPage(html) {
  const pages = [...html.matchAll(/data-page="(\d+)"/g)].map((m) => Number(m[1]));
  return pages.length ? Math.max(...pages) : 1;
}

// The documents library's own listing (admin-ajax `filter_document_list`), which
// renders the same row markup as a document page, ten rows per request — one
// request per ten documents instead of one per document. Cached for a day because
// page N's contents shift whenever a document is published.
export async function fetchDocumentListing({ concurrency = CONCURRENCY } = {}) {
  const shell = await fetchHtml(`${BASE}/annual-reports/`);
  const nonce = shell.match(/docListNonce\s*=\s*["']([^"']+)["']/)?.[1];
  if (!nonce) throw new Error("documents listing nonce not found on /annual-reports/");
  const day = new Date().toISOString().slice(0, 10);
  const page = (n) =>
    cached(cacheKey("filter_document_list", n, day), () =>
      postForm(`${BASE}/wp-admin/admin-ajax.php`, {
        action: "filter_document_list", nonce, seldocType: "", organisation: "", year: "", sort: "", paged: n, search: "",
      }), { maxAgeMs: DAY_MS });
  const first = await page(1);
  const last = lastListingPage(first);
  console.log(`  documents listing: ${last} pages`);
  const rest = await mapPool(Array.from({ length: last - 1 }, (_, i) => i + 2), concurrency, async (n) => {
    const html = await page(n);
    if (n % 100 === 0) console.log(`  listing page ${n}/${last}`);
    return html;
  });
  return [first, ...rest];
}
