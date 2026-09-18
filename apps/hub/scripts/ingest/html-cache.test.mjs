import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cached, cacheKey } from "./html-cache.mjs";

test("cached produces once, then serves from disk; a new key re-produces", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ingest-cache-"));
  let n = 0;
  const produce = async () => `body-${++n}`;
  assert.equal(await cached(cacheKey("u", "m1"), produce, { dir }), "body-1");
  assert.equal(await cached(cacheKey("u", "m1"), produce, { dir }), "body-1");
  assert.equal(await cached(cacheKey("u", "m2"), produce, { dir }), "body-2");
  assert.equal(await cached(cacheKey("u", "m2"), produce, { dir, maxAgeMs: -1 }), "body-3");
});
