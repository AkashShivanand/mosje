import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { collectionValueChecksums, normValue } from "../build/figma-value-parity.mjs";

/**
 * Spec §8.5, the half that was missing — do the LIBRARY and the CODE agree on VALUES?
 *
 * Everything else about the Figma sync compares names. `reference/figma-live.json` lists names,
 * `figma-roundtrip.test.mjs` checks names, and the per-collection checksums this repo has relied
 * on all session are over names. On 2026-08-11 that turned out to be blind to:
 *
 *   - 13 component tokens bound to the WRONG palette rung, one set stale since v0.13.0;
 *   - a font family the code had deliberately reverted, still live in the library;
 *   - 54 fluid-type variables whose TABLET samples were the previous curve.
 *
 * Every one had the correct NAME. Nothing failed. The drift surfaced only because someone asked
 * "are these actually pushed?" — which is not a control.
 */

const root = new URL("..", import.meta.url).pathname;
const payload = JSON.parse(readFileSync(root + "dist/figma.variables.json", "utf8"));
const live = JSON.parse(readFileSync(root + "reference/figma-live.json", "utf8"));

test("no token VALUE changes without the Figma record being refreshed", () => {
  const record = live.$valueChecksums;
  assert.ok(record, "reference/figma-live.json has no $valueChecksums block — re-record it");

  const now = collectionValueChecksums(payload);
  const drift = [];
  for (const [collection, sum] of Object.entries(now)) {
    const was = record.payload?.[collection];
    if (was === undefined) { drift.push(`${collection} — not in the record`); continue; }
    if (was !== sum) drift.push(`${collection}\n      recorded: ${was}\n      now     : ${sum}`);
  }
  for (const collection of Object.keys(record.payload ?? {})) {
    if (!(collection in now)) drift.push(`${collection} — recorded but no longer built`);
  }

  assert.deepEqual(
    drift,
    [],
    `${drift.length} collection(s) changed value since the library was last reconciled:\n    ` +
      `${drift.join("\n    ")}\n\n` +
      `A token's VALUE moved. That does not reach designers on its own — push the change to ` +
      `Figma, read the library back, and re-record $valueChecksums. Do NOT just update the ` +
      `record: that asserts a state the library is not in, which is the failure this gate exists ` +
      `to catch.`,
  );
});

test("the library is recorded as matching the payload, except where documented", () => {
  const { payload: want, figmaObserved: have, knownDifference = {} } = live.$valueChecksums;
  const unexplained = [];
  for (const collection of Object.keys(want)) {
    if (want[collection] === have[collection]) continue;
    if (knownDifference[collection]) continue;
    unexplained.push(`${collection} — payload ${want[collection]} vs library ${have[collection]}`);
  }
  assert.deepEqual(
    unexplained,
    [],
    `${unexplained.length} collection(s) differ from the library with no recorded reason. Either ` +
      `push them, or add an entry to $valueChecksums.knownDifference saying WHY the difference ` +
      `is correct — an undocumented difference is indistinguishable from drift.`,
  );
});

test("every knownDifference is a real difference, not a stale excuse", () => {
  // Symmetrical with the RENAMES and REMOVED ratchets: an exemption that no longer applies is
  // worse than none, because the next real difference hides behind it.
  const { payload: want, figmaObserved: have, knownDifference = {} } = live.$valueChecksums;
  const stale = Object.keys(knownDifference).filter((c) => want[c] === have[c]);
  assert.deepEqual(
    stale,
    [],
    `${stale.length} knownDifference entry(s) now agree with the library — delete them`,
  );
});

test("normValue converts the units Figma actually stores", () => {
  // rem is the trap: `ref/size/24` is 1.5rem in the payload and 24 in the library, so comparing
  // raw would report every rem token as drifted and bury a real one in the noise.
  assert.equal(normValue({ type: "FLOAT", value: 1.5, unit: "rem" }), "24");
  assert.equal(normValue({ type: "FLOAT", value: 24, unit: "px" }), "24");
  assert.equal(normValue({ type: "FLOAT", value: 700, unit: null }), "700");
  assert.equal(normValue({ type: "ALIAS", collection: "Palette", name: "color/primaryScale/600" }),
    "->color/primaryScale/600");
  assert.equal(normValue({ type: "COLOR", value: "#0373DF" }), "#0373df");
  assert.equal(normValue({ type: "COLOR", value: "rgba(3, 115, 223, 0.48)" }), "#0373df@0.4800");
  assert.equal(normValue({ type: "STRING", value: "Noto Sans" }), "Noto Sans");
});
