import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveTermNames } from "./taxonomy.mjs";

test("resolveTermNames maps ids to names via injected fetcher", async () => {
  const fakeFetch = async () => ({
    ok: true,
    headers: new Headers(),
    json: async () => [{ id: 168, name: "Education" }, { id: 9, name: "Health" }],
  });
  const names = await resolveTermNames("scheme-category", [168, 9], { fetchImpl: fakeFetch });
  assert.deepEqual(names, ["Education", "Health"]);
});

test("empty id list returns empty array without fetching", async () => {
  const names = await resolveTermNames("scheme-category", [], {
    fetchImpl: () => { throw new Error("should not fetch"); },
  });
  assert.deepEqual(names, []);
});

test("caches results so identical lookups do not refetch", async () => {
  let calls = 0;
  const fakeFetch = async () => { calls++; return { ok: true, headers: new Headers(), json: async () => [{ id: 7, name: "Cached" }] }; };
  const a = await resolveTermNames("cache-test-tax", [7], { fetchImpl: fakeFetch });
  const b = await resolveTermNames("cache-test-tax", [7], { fetchImpl: fakeFetch });
  assert.deepEqual(a, ["Cached"]);
  assert.deepEqual(b, ["Cached"]);
  assert.equal(calls, 1);
});

test("decodes HTML entities in resolved term names", async () => {
  const fakeFetch = async () => ({ ok: true, headers: new Headers(), json: async () => [{ id: 5, name: "Notices &amp; Tenders" }] });
  const names = await resolveTermNames("decode-tax", [5], { fetchImpl: fakeFetch });
  assert.deepEqual(names, ["Notices & Tenders"]);
});
