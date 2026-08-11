import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { auditPayload, contractFor, contractNote } from "../build/contrast-contract.mjs";

/**
 * Spec §9.2 — the prominence contrast contract, enforced instead of asserted.
 *
 * This file exists because the contract was, until now, the most confident and least
 * checked thing in the system. 322 variables in the live Figma library carried a WCAG
 * class; the only test on the subject asserted that the THRESHOLD TABLE was sorted. Nothing
 * ever compared a claim to a colour, so 23 of the 41 measurable claims were false, and
 * 192 more sat on Tier-3 variables that have no prominence slot at all.
 *
 * The rule this file enforces is narrow and absolute: **the library may not state a
 * contrast class it does not have.** Everything else — which rungs exist, whether the
 * ladder's thresholds are the right ones — is a design question. This is a truth question.
 */

const root = new URL("..", import.meta.url).pathname;
const payload = JSON.parse(readFileSync(root + "dist/figma.variables.json", "utf8"));

const everyVariable = () => payload.collections.flatMap((c) => c.variables.map((v) => ({ collection: c.name, ...v })));

/** Any "≥4.5:1"-shaped claim, wherever it appears in a description. */
const CLAIM_RE = /≥\s*([\d.]+)\s*:\s*1/g;

test("every contrast sentence the library publishes is one this build measured", () => {
  const measured = new Map(auditPayload(payload).map((r) => [`${r.collection}::${r.name}`, r]));
  const unbacked = [];

  for (const v of everyVariable()) {
    if (!/Contrast \d/.test(v.description ?? "")) continue;
    const key = `${v.collection}::${v.name}`;
    if (!measured.has(key)) unbacked.push(key);
  }

  assert.deepEqual(unbacked, [], `${unbacked.length} variable(s) publish a contrast sentence with no measurement behind it`);
});

test("the published number matches the measurement, to the digit", () => {
  // The description and the machine-readable extension are written from one record, so a
  // mismatch means someone has started hand-editing generated prose — the failure mode that
  // let `--ds-radius-pill: 9999px` sit in design.md for a token that never existed.
  const drift = [];
  for (const r of auditPayload(payload)) {
    const v = payload.collections
      .find((c) => c.name === r.collection)
      ?.variables.find((x) => x.name === r.name);
    const ext = v?.$extensions?.["in.gov.mosje.contrast"];
    if (!ext) {
      drift.push(`${r.collection}::${r.name} — measured but carries no contrast extension`);
      continue;
    }
    if (ext.measured !== r.measured || ext.meets !== r.meets) {
      drift.push(`${r.collection}::${r.name} — extension says ${ext.measured}:1/${ext.meets}, audit says ${r.measured}:1/${r.meets}`);
    }
    if (!v.description?.includes(`${r.measured}:1`)) {
      drift.push(`${r.collection}::${r.name} — description does not state the measured ${r.measured}:1`);
    }
  }
  assert.deepEqual(drift.slice(0, 10), [], `${drift.length} variable(s) disagree with their own measurement`);
});

test("no variable claims to MEET a threshold it does not meet", () => {
  // The one assertion that would have caught every original defect at once.
  const liars = [];
  for (const v of everyVariable()) {
    const d = v.description ?? "";
    if (!/meets ≥/.test(d)) continue;
    const ext = v.$extensions?.["in.gov.mosje.contrast"];
    if (!ext) {
      liars.push(`${v.collection}::${v.name} — says "meets" with no measurement`);
      continue;
    }
    if (!ext.meets || ext.measured + 0.005 < ext.min) {
      liars.push(`${v.collection}::${v.name} — says "meets ≥${ext.min}:1" but measures ${ext.measured}:1`);
    }
  }
  assert.deepEqual(liars, [], `${liars.length} variable(s) claim a contrast class they do not have`);
});

test("every ≥N:1 in an AUTHORED description is true as well", () => {
  // Generated prose is not the only way a false claim reaches a designer: `Text/Link/Brand/
  // Default` carried "(≥4.5:1 as text)" written by hand in the token source. A gate that
  // only checked its own output would never look at it.
  const wrong = [];
  for (const v of everyVariable()) {
    const authored = (v.description ?? "").split("Contrast ")[0];
    const ext = v.$extensions?.["in.gov.mosje.contrast"];
    for (const m of authored.matchAll(CLAIM_RE)) {
      const claimed = parseFloat(m[1]);
      if (!ext) {
        wrong.push(`${v.collection}::${v.name} — authored "≥${claimed}:1" on a token nothing measures`);
      } else if (ext.measured + 0.005 < claimed) {
        wrong.push(`${v.collection}::${v.name} — authored "≥${claimed}:1", measures ${ext.measured}:1`);
      }
    }
  }
  assert.deepEqual(wrong, [], `${wrong.length} hand-written contrast claim(s) are not true`);
});

test("the contract is never attached where it has no meaning", () => {
  // The four classes of nonsense the old substring scan produced, each now impossible.
  const bad = [];
  for (const v of everyVariable()) {
    if (!/Contrast \d/.test(v.description ?? "")) continue;
    const tier = v.$extensions?.["in.gov.mosje.tier"];
    if (v.type !== "COLOR") bad.push(`${v.name} — ${v.type} carries a contrast class (was: motion/duration-base)`);
    if (tier !== "sys") bad.push(`${v.name} — tier "${tier}" carries a contrast class (was: 192 Action/* variables)`);
    if (/\/Disabled(\/|$)/i.test(v.name)) bad.push(`${v.name} — disabled state is exempt from 1.4.3`);
  }
  assert.deepEqual(bad.slice(0, 10), [], `${bad.length} variable(s) carry a contract that does not apply to them`);
});

test("a brand VARIANT is never read as an ink rung", () => {
  // `bg/brand/primary/base` put "body and heading text (WCAG 1.4.3 AA)" on a background,
  // because `primary` spells an ink rung as well as a brand variant. §5.1c pins that
  // ambiguity as harmless; on this path it was not. The fix is that `bg` reads the FILL
  // ladder only, so the ink reading is unreachable there — asserted rather than trusted.
  const c = contractFor(["bg", "brand", "primary", "base"], "sys", "COLOR");
  assert.equal(c?.rung, "base", "bg/brand/primary/base must read `base` as its rung, not `primary`");
  assert.equal(c?.minContrast, 0, "a decorative brand fill must not inherit the ink ladder's 4.5:1");

  for (const variant of ["primary", "secondary", "tertiary"]) {
    const fill = contractFor(["bg", "brand", variant], "sys", "COLOR");
    assert.equal(fill, null, `bg/brand/${variant} has no rung and must therefore carry no class`);
  }
});

test("a non-colour token can never acquire a contrast class", () => {
  assert.equal(contractFor(["motion", "duration", "base"], "ref", "FLOAT"), null);
  assert.equal(contractFor(["motion", "duration", "base"], "sys", "FLOAT"), null);
  assert.equal(contractFor(["spacing", "base"], "ref", "FLOAT"), null);
});

test("ink roles are never left silent — text and icons always carry a measured class", () => {
  // The inversion that made the original defect worst: a decorative fill got a paragraph
  // while the text link, which must be AA, got nothing.
  const silent = [];
  for (const v of everyVariable()) {
    if (v.$extensions?.["in.gov.mosje.tier"] !== "sys" || v.type !== "COLOR") continue;
    const [role] = v.path.split("/");
    if (role !== "text" && role !== "icon") continue;
    if (/disabled/i.test(v.path)) continue;
    if (!v.$extensions?.["in.gov.mosje.contrast"]) silent.push(`${v.collection}::${v.name} (${v.path})`);
  }
  assert.deepEqual(silent.slice(0, 10), [], `${silent.length} ink token(s) carry no measured contrast class`);
});

// ---------------------------------------------------------------------------
// The shortfall ledger
// ---------------------------------------------------------------------------

/**
 * Tokens whose RUNG NAME promises more than the token delivers.
 *
 * These are not bugs this change introduced — they are what the library was silently
 * claiming to be true all along, now measured and written down. They are pinned rather than
 * fixed because fixing them means either repainting shipped colours or renaming shipped
 * rungs, each its own change with its own visual-contract review.
 *
 * Every entry is one of two things, and the distinction is the decision this ledger exists
 * to force:
 *
 *   - `Background/*` — a tonal chip measured against the page. The fill ladder's ≥3:1 is
 *     the wrong requirement for these: WCAG 1.4.11 governs boundaries that identify a
 *     control, not quiet fills. The likely fix is the LADDER, not the colours.
 *   - `Border/Neutral/*` — a boundary, where ≥3:1 genuinely is the bar and `Strong`
 *     claiming text-safety is a category error in the table.
 *
 * THIS LIST MAY ONLY SHRINK. Adding to it means shipping a token that contradicts its own
 * name; the stale-entry test below makes a fixed token fail until its line is deleted.
 */
const SHORTFALL_LEDGER = new Set([
  "Color::bg/brand/accent/subtle — 2.18:1 vs ≥3:1 (\"subtle\")",
  "Color::bg/brand/primary/bold — 2.46:1 vs ≥3:1 (\"bold\")",
  "Color::bg/brand/primary/subtle — 1.84:1 vs ≥3:1 (\"subtle\")",
  "Color::bg/brand/secondary/bold — 2.21:1 vs ≥3:1 (\"bold\")",
  "Color::bg/brand/secondary/subtle — 1.72:1 vs ≥3:1 (\"subtle\")",
  "Color::bg/neutral/bold — 1.25:1 vs ≥3:1 (\"bold\")",
  "Color::bg/neutral/subtle — 1.11:1 vs ≥3:1 (\"subtle\")",
  "Color::bg/status/error/bold — 2.64:1 vs ≥3:1 (\"bold\")",
  "Color::bg/status/error/bolder — 4.4:1 vs ≥4.5:1 (\"bolder\")",
  "Color::bg/status/error/subtle — 1.91:1 vs ≥3:1 (\"subtle\")",
  "Color::bg/status/info/bold — 2.25:1 vs ≥3:1 (\"bold\")",
  "Color::bg/status/info/subtle — 1.71:1 vs ≥3:1 (\"subtle\")",
  "Color::bg/status/success/subtle — 2.18:1 vs ≥3:1 (\"subtle\")",
  "Color::bg/status/warning/bold — 1.84:1 vs ≥3:1 (\"bold\")",
  "Color::bg/status/warning/bolder — 4.46:1 vs ≥4.5:1 (\"bolder\")",
  "Color::bg/status/warning/subtle — 1.51:1 vs ≥3:1 (\"subtle\")",
  "Color::border/neutral/bolder/default — 2.55:1 vs ≥4.5:1 (\"bolder\")",
  "Color::border/neutral/subtle — 1.11:1 vs ≥3:1 (\"subtle\")",
]);

test("no token falls short of its own rung except the ones already on the ledger", () => {
  const current = new Set(payload.contrast.shortfall);
  const added = [...current].filter((s) => !SHORTFALL_LEDGER.has(s));
  assert.deepEqual(
    added,
    [],
    `${added.length} token(s) now contradict the contrast class their name implies. Fix the ` +
      `value or the rung — do NOT add them to SHORTFALL_LEDGER, which may only shrink.`,
  );
});

test("the ledger has no stale entries — a fixed token must be removed from it", () => {
  const current = new Set(payload.contrast.shortfall);
  const stale = [...SHORTFALL_LEDGER].filter((s) => !current.has(s));
  assert.deepEqual(
    stale,
    [],
    `${stale.length} ledger entry(s) no longer reproduce. Delete them — a ledger nobody prunes ` +
      `stops describing the system and starts excusing it.`,
  );
});

test("the ledger is the whole story — counts reconcile", () => {
  const audit = auditPayload(payload);
  assert.equal(payload.contrast.measured, audit.length);
  assert.equal(payload.contrast.meets, audit.filter((r) => r.meets).length);
  assert.equal(payload.contrast.shortfall.length, audit.filter((r) => !r.meets).length);
  assert.equal(payload.contrast.meets + payload.contrast.shortfall.length, payload.contrast.measured);
});

test("contractNote never phrases a shortfall as a guarantee", () => {
  const fail = contractNote({ measured: 1.1, minContrast: 3, use: "x", rung: "subtle", source: "ladder", meets: false }, "Surface");
  assert.match(fail, /BELOW/);
  assert.doesNotMatch(fail, /meets ≥/);

  const pass = contractNote({ measured: 9.9, minContrast: 4.5, use: "text", rung: "strong", source: "ladder", meets: true }, "Surface");
  assert.match(pass, /meets ≥4\.5:1/);
});
