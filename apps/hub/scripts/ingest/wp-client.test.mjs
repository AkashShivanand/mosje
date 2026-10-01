import { test } from "node:test";
import assert from "node:assert/strict";
import { buildRestUrl, fetchSitemapUrls, parseSitemapLocs, totalPagesFromHeaders } from "./wp-client.mjs";

test("buildRestUrl composes base, fields, paging", () => {
  const u = buildRestUrl("organisation", { page: 2, perPage: 100, fields: ["id", "slug"] });
  assert.equal(
    u,
    "https://www.dosje.gov.in/wp-json/wp/v2/organisation?per_page=100&page=2&_fields=id%2Cslug"
  );
});

test("buildRestUrl appends extra query", () => {
  const u = buildRestUrl("documents", { page: 1, perPage: 100, fields: ["id"], query: "documents-type=28,29" });
  assert.match(u, /[?&]documents-type=28%2C29|[?&]documents-type=28,29/);
  assert.match(u, /per_page=100/);
});

test("parseSitemapLocs extracts <loc> urls", () => {
  const xml = `<urlset><url><loc>https://x/a/</loc></url><url><loc>https://x/b/</loc></url></urlset>`;
  assert.deepEqual(parseSitemapLocs(xml), ["https://x/a/", "https://x/b/"]);
});

test("totalPagesFromHeaders reads X-WP-TotalPages, defaults to 1", () => {
  assert.equal(totalPagesFromHeaders(new Headers({ "x-wp-totalpages": "6" })), 6);
  assert.equal(totalPagesFromHeaders(new Headers({})), 1);
});

import { sitemapFilesForType, backoffMs } from "./wp-client.mjs";

test("sitemapFilesForType picks only that type's Rank Math files", () => {
  const xml = `<sitemapindex><sitemap><loc>https://x/documents-sitemap1.xml</loc></sitemap><sitemap><loc>https://x/documents-sitemap12.xml</loc></sitemap>
    <sitemap><loc>https://x/scheme-documents-sitemap.xml</loc></sitemap><sitemap><loc>https://x/booking-sitemap.xml</loc></sitemap></sitemapindex>`;
  assert.deepEqual(sitemapFilesForType(xml, "documents"), ["https://x/documents-sitemap1.xml", "https://x/documents-sitemap12.xml"]);
  assert.deepEqual(sitemapFilesForType(xml, "booking"), ["https://x/booking-sitemap.xml"]);
});

test("backoffMs honours Retry-After on 429, else grows with the attempt", () => {
  assert.equal(backoffMs({ status: 429, retryAfter: "7" }, 0), 7000);
  assert.equal(backoffMs({ status: 429 }, 1), 60000);
  assert.equal(backoffMs({ status: 500 }, 2, 100), 600);
});

/*
 * The origin answers a page number it does not have with page 1 and HTTP 200,
 * never a 404. Measured 1 Oct 2026: five byte-identical vacancy sitemap files.
 * Concatenating them claimed 825 vacancies where the REST API publishes 165.
 */
test("fetchSitemapUrls de-duplicates pages the origin repeats", async () => {
  const page1 = `<urlset><url><loc>https://x/a/</loc></url><url><loc>https://x/b/</loc></url></urlset>`;
  const fetchImpl = async () => ({ ok: true, status: 200, text: async () => page1 });
  const urls = await fetchSitemapUrls("vacancies", { fetchImpl });
  assert.deepEqual(urls, ["https://x/a/", "https://x/b/"]);
});

/*
 * The duplicate is not a stop signal: `…-tender-2.xml` repeats page 1 while page 3
 * holds 112 records that exist nowhere else. Breaking at the first repeat lost them,
 * and the ingest then wrote a register of 200 tenders where the API publishes 312.
 */
test("fetchSitemapUrls reads past a repeated page to the real one behind it", async () => {
  const pages = {
    1: `<urlset><url><loc>https://x/a/</loc></url></urlset>`,
    2: `<urlset><url><loc>https://x/a/</loc></url></urlset>`,
    3: `<urlset><url><loc>https://x/c/</loc></url></urlset>`,
  };
  const fetchImpl = async (url) => {
    const n = Number(url.match(/-(\d+)\.xml$/)[1]);
    if (!pages[n]) return { ok: false, status: 404, text: async () => "" };
    return { ok: true, status: 200, text: async () => pages[n] };
  };
  assert.deepEqual(await fetchSitemapUrls("tender", { fetchImpl }), ["https://x/a/", "https://x/c/"]);
});

test("fetchSitemapUrls keeps reading while pages add records", async () => {
  const pages = {
    1: `<urlset><url><loc>https://x/a/</loc></url></urlset>`,
    2: `<urlset><url><loc>https://x/b/</loc></url></urlset>`,
  };
  const fetchImpl = async (url) => {
    const n = Number(url.match(/-(\d+)\.xml$/)[1]);
    if (!pages[n]) return { ok: false, status: 404, text: async () => "" };
    return { ok: true, status: 200, text: async () => pages[n] };
  };
  assert.deepEqual(await fetchSitemapUrls("tender", { fetchImpl }), ["https://x/a/", "https://x/b/"]);
});
