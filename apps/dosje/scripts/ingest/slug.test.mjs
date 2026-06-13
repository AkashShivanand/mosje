import { test } from "node:test";
import assert from "node:assert/strict";
import { deriveCollectionSlug } from "./slug.mjs";

test("top-level path → single segment", () => {
  assert.equal(
    deriveCollectionSlug("https://www.dosje.gov.in/organisation/ncsk/", "organisation"),
    "ncsk"
  );
});

test("nested path → multi-segment slug", () => {
  assert.equal(
    deriveCollectionSlug("https://www.dosje.gov.in/organisation/dr-ambedkar-foundation/about-us/", "organisation"),
    "dr-ambedkar-foundation/about-us"
  );
});

test("returns null when base segment absent", () => {
  assert.equal(deriveCollectionSlug("https://www.dosje.gov.in/something-else/x/", "organisation"), null);
});
