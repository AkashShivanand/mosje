import { test } from "node:test";
import assert from "node:assert/strict";
import { canonicalizeSlug, dedupeRecords } from "./dedup.mjs";

test("canonicalizeSlug strips home-page prefix and trailing -copy", () => {
  assert.equal(canonicalizeSlug("home-page/terms-conditions"), "terms-conditions");
  assert.equal(canonicalizeSlug("ncsc-summit-copy"), "ncsc-summit");
  assert.equal(canonicalizeSlug("plain-slug"), "plain-slug");
});

test("dedupeRecords drops a -2 sibling only when content is identical", () => {
  const recs = [
    { slug: "a", title: "A", sections: [{ heading: "x", html: "<p>same</p>" }] },
    { slug: "a-2", title: "A", sections: [{ heading: "x", html: "<p>same</p>" }] },
    { slug: "b-2", title: "B", sections: [{ heading: "y", html: "<p>different</p>" }] },
  ];
  const { kept, skipped } = dedupeRecords(recs);
  assert.deepEqual(kept.map((r) => r.slug), ["a", "b-2"]);
  assert.equal(skipped.length, 1);
  assert.equal(skipped[0].slug, "a-2");
  assert.match(skipped[0].reason, /duplicate/i);
});
