import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { contrastSentences } from "../build/figma-contrast-parity.mjs";

/**
 * Do the library and the code agree on what the colours MEASURE?
 *
 * `figma-value-parity.test.mjs` owns the half above this one — whether they agree on the
 * values themselves. Nothing owned this half, and on 2026-09-04 a live read found 31 of 94
 * published contrast notes wrong or missing. The detail is in
 * `build/figma-contrast-parity.mjs`; the shape of the failure is what matters here.
 *
 * A CONTRAST NOTE IS NOT A VALUE, AND THAT IS WHY IT ROTTED.
 * ---------------------------------------------------------
 * Every other Figma check compares names or values. A published measurement is a claim
 * ABOUT a value, so it can go stale while the colour behind it never moves — the success
 * ramp was rebuilt, the colours changed, the checksums were re-recorded, and eight
 * sentences kept describing the old ramp. Nothing was wrong with the tokens. Everything was
 * wrong with what the library said about them.
 *
 * The direction of the error is the reason this is worth a gate. `bg/brand/secondary/bolder`
 * published 3.94:1 against its own 4.5:1 threshold when it measures 4.97:1 — the library was
 * telling designers a token FAILED that passes. A false warning does not merely misinform;
 * it steers work away from a colour that was correct, and it does it silently.
 *
 * WHY THE RECORD IS WHAT THE LIBRARY HOLDS, NOT WHAT THE CODE BUILDS.
 * ------------------------------------------------------------------
 * A test cannot read Figma. So `figmaObserved` is a snapshot of the sentences as last read
 * from the live library, and this file asserts the BUILT payload still matches it. Change a
 * measurement in code and this fails — and it stays failing until the change has actually
 * reached designers and the read has been repeated. That ordering is the whole point:
 * re-recording without pushing asserts a state the library is not in, which is the failure
 * the gate exists to catch.
 */

const root = new URL("..", import.meta.url).pathname;
const payload = JSON.parse(readFileSync(root + "dist/figma.variables.json", "utf8"));
const live = JSON.parse(readFileSync(root + "reference/figma-live.json", "utf8"));

test("no published contrast figure changes without the Figma record being refreshed", () => {
  const record = live.$contrastNotes;
  assert.ok(record, "reference/figma-live.json has no $contrastNotes block — re-record it");

  const observed = record.figmaObserved ?? {};
  const known = record.knownDifference ?? {};
  const now = contrastSentences(payload);
  const drift = [];

  for (const [name, sentence] of Object.entries(now)) {
    if (known[name]) continue;
    const was = observed[name];
    if (was === undefined) {
      drift.push(`${name} — the code publishes a figure the library has never been told`);
      continue;
    }
    if (was !== sentence) {
      drift.push(`${name}\n      library: ${was}\n      code   : ${sentence}`);
    }
  }
  for (const name of Object.keys(observed)) {
    if (known[name]) continue;
    if (!(name in now)) drift.push(`${name} — recorded in the library but the code publishes nothing`);
  }

  assert.deepEqual(
    drift,
    [],
    `${drift.length} contrast figure(s) disagree between the code and the library:\n    ` +
      `${drift.join("\n    ")}\n\n` +
      `A published measurement went stale. It does not reach designers on its own: push the ` +
      `descriptions to Figma, read the library back, and re-record ` +
      `$contrastNotes.figmaObserved. Do NOT just update the record — that asserts a state ` +
      `the library is not in, and a designer reading a figure the colour does not have is ` +
      `exactly what this gate exists to prevent.`,
  );
});

test("every knownDifference is a real difference, not a stale excuse", () => {
  const record = live.$contrastNotes ?? {};
  const observed = record.figmaObserved ?? {};
  const now = contrastSentences(payload);
  const stale = [];

  for (const [name, why] of Object.entries(record.knownDifference ?? {})) {
    if (name.startsWith("$")) continue;
    assert.ok(
      typeof why === "string" && why.trim().length > 20,
      `knownDifference["${name}"] must say WHY the difference is correct, in a sentence`,
    );
    if (observed[name] === now[name]) stale.push(name);
  }

  assert.deepEqual(
    stale,
    [],
    `${stale.length} knownDifference entry(s) no longer describe a difference — the code and ` +
      `the library now agree. Delete them: a list of excuses nobody prunes stops describing ` +
      `the system and starts hiding it.`,
  );
});

test("the record covers every figure the code publishes", () => {
  const record = live.$contrastNotes ?? {};
  const observed = Object.keys(record.figmaObserved ?? {});
  const now = Object.keys(contrastSentences(payload));
  assert.ok(now.length > 0, "the payload publishes no contrast figures at all — that is itself a defect");
  assert.equal(
    observed.length,
    now.length,
    `the record holds ${observed.length} figure(s) and the code publishes ${now.length}. ` +
      `A partial record is worse than none: it passes for the tokens it covers and says ` +
      `nothing about the rest, which is how twelve variables carried no figure at all ` +
      `without anything noticing.`,
  );
});
