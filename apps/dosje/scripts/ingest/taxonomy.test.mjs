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
