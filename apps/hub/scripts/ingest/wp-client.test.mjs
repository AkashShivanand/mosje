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
