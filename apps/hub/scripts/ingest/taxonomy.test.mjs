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

import { loadTermMap, namesFromMap } from "./taxonomy.mjs";

test("loadTermMap reads a whole taxonomy once; namesFromMap keeps id order and drops unknown ids", async () => {
  let calls = 0;
  const fetchAll = async (tax, opts) => { calls++; assert.deepEqual(opts.fields, ["id", "name"]); return [{ id: 28, name: "Annual Reports" }, { id: 29, name: "Acts &amp; Rules" }]; };
  const map = await loadTermMap("documents-type-test", { fetchAll });
  await loadTermMap("documents-type-test", { fetchAll });
  assert.equal(calls, 1);
  assert.deepEqual(namesFromMap(map, [29, 999, 28]), ["Acts & Rules", "Annual Reports"]);
  assert.deepEqual(namesFromMap(map, undefined), []);
});
