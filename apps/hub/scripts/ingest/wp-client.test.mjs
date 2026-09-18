import { test } from "node:test";
import assert from "node:assert/strict";
import { buildRestUrl, parseSitemapLocs, totalPagesFromHeaders } from "./wp-client.mjs";

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
