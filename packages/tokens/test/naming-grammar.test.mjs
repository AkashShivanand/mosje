import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import {
  parse,
  toCssName,
  fromCssName,
  auditReference,
  auditStructure,
  PROMINENCE,
  INK_PROMINENCE,
  PROMINENCE_CONTRACT,
  RESERVED_FIRST_SEGMENT,
} from "../build/grammar.mjs";

const root = new URL("..", import.meta.url).pathname;

/**
 * The v3 grammar gate.
 *
 * Spec: docs/superpowers/specs/2026-08-07-samavesh-token-architecture-v2-design.md §5, §9.1
 *
 * Why this test exists at all: spec v1 proposed adopting UX4G's naming wholesale on the
 * belief that it was more regular than ours. Nobody had checked. The `--audit-reference`
 * case below is that check, and its result reversed the spec's core decision. It lives in
 * CI so the number stays reproducible rather than sitting in a shell transcript.
 */

// ---------------------------------------------------------------------------
// 1. The grammar parses its own documented examples (§5.5).
// ---------------------------------------------------------------------------

const VALID = [
  [["bg", "brand", "primary"], "sys", "--sa-bg-brand-primary"],
  [["bg", "brand", "primary", "bolder"], "sys", "--sa-bg-brand-primary-bolder"],
  [["bg", "brand", "primary", "bolder", "hover"], "sys", "--sa-bg-brand-primary-bolder-hover"],
  [["bg", "neutral", "inverse", "subtle"], "sys", "--sa-bg-neutral-inverse-subtle"],
  [["bg", "neutral", "disabled"], "sys", "--sa-bg-neutral-disabled"],
  [["text", "neutral", "base"], "sys", "--sa-text-neutral-base"],
  [["text", "neutral", "subtle"], "sys", "--sa-text-neutral-subtle"],
  [["text", "link", "visited", "hover"], "sys", "--sa-text-link-visited-hover"],
  [["icon", "status", "error"], "sys", "--sa-icon-status-error"],
  [["border", "width", "md"], "sys", "--sa-border-width-md"],
  [["z", "modal", "backdrop"], "sys", "--sa-z-modal-backdrop"],
  [["chart", "tooltip", "bg"], "sys", "--sa-chart-tooltip-bg"],
  [["chart", "region", "empty"], "sys", "--sa-chart-region-empty"],
  [["color", "blue", "500"], "ref", "--sa-ref-color-blue-500"],
  [["space", "16"], "ref", "--sa-ref-space-16"],
  [["action", "brand", "primary", "hover", "bg"], "cmp", "--sa-cmp-action-brand-primary-hover-bg"],
];

test("every documented example parses, and projects to the documented CSS name", () => {
  for (const [path, tier, css] of VALID) {
    const r = parse(path, tier);
    assert.equal(r.ok, true, `${path.join("/")} (${tier}) failed: ${r.error}`);
    assert.equal(toCssName(path, tier), css);
  }
});

// ---------------------------------------------------------------------------
// 2. The rules actually reject things (a grammar that only accepts is not a gate).
// ---------------------------------------------------------------------------

test("RULE 1 — a hyphen inside a path segment is rejected", () => {
  // This is the exact shape of UX4G's `border-color` — 21 of its 23 structural
  // violations (§2.1). If this assertion ever stops holding, we have reintroduced it.
  const r = parse(["border-color", "neutral", "hover"], "sys");
  assert.equal(r.ok, false);
  assert.match(r.error, /RULE 1/);
});

test("reserved first segments are rejected on Tier 2, keeping the projection bijective", () => {
  for (const word of RESERVED_FIRST_SEGMENT) {
    const r = parse([word, "brand", "primary"], "sys");
    assert.equal(r.ok, false, `${word} should be reserved`);
    assert.match(r.error, /reserved/);
  }
});

test("slot order is enforced — a variant may not follow a prominence", () => {
  assert.equal(parse(["bg", "brand", "primary", "bolder"], "sys").ok, true);
  const r = parse(["bg", "brand", "bolder", "primary"], "sys");
  assert.equal(r.ok, false);
  assert.match(r.error, /unconsumed/);
});

test("unknown roles, families and tails are rejected", () => {
  assert.equal(parse(["backdrop", "neutral"], "sys").ok, false);
  assert.equal(parse(["bg", "chartreuse"], "sys").ok, false);
  assert.equal(parse(["bg", "brand", "primary", "loud"], "sys").ok, false);
});

// ---------------------------------------------------------------------------
// 3. The projection is bijective. This is what the Figma round-trip rests on (§8.4).
// ---------------------------------------------------------------------------

test("path → CSS name → path round-trips for every example", () => {
  for (const [path, tier] of VALID) {
    const back = fromCssName(toCssName(path, tier));
    assert.equal(back.tier, tier);
    assert.deepEqual(back.path, path);
  }
});

// ---------------------------------------------------------------------------
// 4. The prominence ladder is a contract, not an adjective (§6.3).
// ---------------------------------------------------------------------------

test("every prominence rung declares a contrast contract, monotonically non-decreasing", () => {
  // Checked PER LADDER since 2026-08-10. Fill and ink now share one vocabulary — `subtle`,
  // `bolder` — but not one set of thresholds, because a quiet tonal chip owes 3:1 (WCAG
  // 1.4.11) while a caption is still text and owes 4.5:1 (1.4.3). Walking a single flat
  // table would have compared rungs that are not on the same scale.
  for (const [ladder, order] of [["fill", PROMINENCE], ["ink", INK_PROMINENCE]]) {
    let previous = -1;
    for (const rung of order) {
      const contract = PROMINENCE_CONTRACT[ladder][rung];
      assert.ok(contract, `${ladder} ladder: ${rung} has no contrast contract`);
      assert.ok(typeof contract.use === "string" && contract.use.length > 0);
      assert.ok(
        contract.minContrast >= previous,
        `${ladder}: ${rung} (${contract.minContrast}) weakens the rung below it`,
      );
      previous = contract.minContrast;
    }
    // Each ladder must reach text-safe, or it cannot express body copy at all.
    assert.ok(Math.max(...order.map((r) => PROMINENCE_CONTRACT[ladder][r].minContrast)) >= 4.5);
  }
});

test("the two ladders share a vocabulary but never a threshold by accident", () => {
  // The reason PROMINENCE_CONTRACT is keyed by ladder. If these ever coincide for every
  // shared word, the split has stopped earning its keep and should be collapsed back.
  const shared = PROMINENCE.filter((r) => INK_PROMINENCE.includes(r));
  assert.ok(shared.length > 0, "the ladders are supposed to share words");
  const differs = shared.some(
    (r) => PROMINENCE_CONTRACT.fill[r].minContrast !== PROMINENCE_CONTRACT.ink[r].minContrast,
  );
  assert.ok(differs, "no shared rung differs between ladders — collapse the per-ladder split");
});

test("primary/secondary/tertiary are variants ONLY — the ink overload is gone", () => {
  // §6.4 promised the ordinal ladder would dissolve this and then recorded that it had not:
  // those three words sat in the brand `variant` slot AND the ink prominence slot, resolved
  // by the parser's greedy order rather than by the grammar. They are now variants and
  // nothing else, so the collision cannot be spelled.
  for (const word of ["primary", "secondary", "tertiary"]) {
    assert.ok(!PROMINENCE.includes(word), `${word} is still a fill rung`);
    assert.ok(!INK_PROMINENCE.includes(word), `${word} is still an ink rung`);
  }
});

// ---------------------------------------------------------------------------
// 5. The reference audit — reproduces the finding that reversed spec v1 (§2.1).
// ---------------------------------------------------------------------------

test("--audit-reference: UX4G's published contract carries structural inconsistencies", () => {
  const ref = JSON.parse(readFileSync(root + "reference/ux4g-3.0.tokens.json", "utf8"));
  const s = auditStructure(Object.keys(ref.tokens));

  assert.ok(s.scope > 100, `expected a meaningful sample, got ${s.scope}`);

  // These counts are dictionary-INDEPENDENT — they are about the shape of the name, not
  // its vocabulary, so they cannot be tuned by changing what words we accept. That matters:
  // an earlier parse-based version of this audit reported 41%, 52% or 62% depending purely
  // on which prominence words the parser happened to know, which measured our choices as
  // much as UX4G's consistency.
  assert.ok(
    s.byKind.roleHyphenated > 0,
    "expected `border-color-*` alongside `border-*` — the same role spelled two ways, one " +
      "with a hyphen inside the slot. This is the defect RULE 1 makes structurally impossible.",
  );
  assert.ok(
    s.byKind.rawHueFamily > 0,
    "expected at least one raw hue in the family slot (e.g. `bg-yellow-strong`) — a Tier-1 " +
      "primitive leaking into the semantic tier.",
  );
  assert.ok(
    s.byKind.roleAsFamily > 0,
    "expected at least one role used as a family (e.g. `bg-overlay`, where `overlay` is " +
      "elsewhere a role in its own right).",
  );

  // And the total must be material, or the spec's premise is wrong and needs revisiting
  // rather than this threshold being lowered.
  assert.ok(
    s.violations >= 20,
    `only ${s.violations} structural violations found — if UX4G has regularised its naming, ` +
      `spec §2.1's premise needs revisiting, not this threshold.`,
  );
});

// ---------------------------------------------------------------------------
// 6. Every authored path parses — with the un-migrated legacy tier explicitly listed.
// ---------------------------------------------------------------------------

/**
 * Tier-2 paths authored BEFORE the grammar existed. They still ship and are mirrored by the
 * canonical namespace in src/system.generated.json — see test/tier2-parity.test.mjs, which
 * proves the two agree in every axis block.
 *
 * ITEMISED, not rooted. Until 2026-08-10 this was `new Set(["color","type","spacing","density"])`
 * — four ROOTS — and the check below skipped every path beginning with one. That exempted 188
 * existing tokens AND every token anyone might write under those roots in future, so a brand-new
 * ungrammatical `color/…` landed green and the spec's freeze criterion ("the allowlist reaches
 * zero") could never be met in any meaningful sense. Three of the four roots turned out not to
 * need exempting at all once `spacing` became `space` and `color/chart/*` moved to `chart/*`:
 * `space`, `type`, `density` and `chart` are all in the grammar's own GROUP dictionary and parse.
 *
 * This list may only ever SHRINK, and the stale-entry test below enforces that.
 */
const LEGACY_TIER2_PATHS = new Set(
  JSON.parse(readFileSync(root + "test/legacy-tier2-paths.json", "utf8")).paths,
);

test("every authored token path parses, except the explicitly-listed legacy tier", async () => {
  const { index } = await import("../build/token-index.mjs");
  const { tierOfFile } = await import("../build/grammar.mjs");

  const violations = [];
  let checked = 0;
  for (const { path, filePath } of index()) {
    const tier = tierOfFile(filePath);
    // Tier 1 is a free namespace (palette/scale shapes vary); only RULE 1 applies there.
    if (tier === "ref") continue;
    if (tier === "sys" && LEGACY_TIER2_PATHS.has(path.join("/"))) continue;
    checked++;
    const r = parse(path, tier);
    if (!r.ok) violations.push(`${filePath} :: ${path.join("/")} — ${r.error}`);
  }

  assert.ok(checked > 300, `expected the Tier-2 + Tier-3 surface, only checked ${checked}`);
  assert.deepEqual(
    violations.slice(0, 15),
    [],
    `${violations.length} path(s) violate the grammar. Do NOT add them to ` +
      `test/legacy-tier2-paths.json — that list is closed and may only shrink.`,
  );
});

test("the legacy allowlist has no stale entries — a migrated path must leave the list", async () => {
  // Without this, the list stops describing the system and starts excusing it: entries for
  // tokens that no longer exist make the remaining debt look larger than it is, and hide the
  // fact that the freeze criterion (§9.9) has moved.
  const { index } = await import("../build/token-index.mjs");
  const { tierOfFile } = await import("../build/grammar.mjs");

  const authored = new Set();
  for (const { path, filePath } of index()) {
    if (tierOfFile(filePath) === "sys") authored.add(path.join("/"));
  }
  const stale = [...LEGACY_TIER2_PATHS].filter((p) => !authored.has(p)).sort();
  assert.deepEqual(
    stale.slice(0, 15),
    [],
    `${stale.length} allowlisted path(s) no longer exist — delete them from ` +
      `test/legacy-tier2-paths.json`,
  );
});

test("the legacy allowlist covers only paths that genuinely fail the grammar", async () => {
  // An entry for a path that now PARSES is a free pass nobody needs, and it keeps the debt
  // count wrong. This is what turns the list from a static exemption into a ratchet.
  const { index } = await import("../build/token-index.mjs");
  const { tierOfFile } = await import("../build/grammar.mjs");

  const needless = [];
  for (const { path, filePath } of index()) {
    if (tierOfFile(filePath) !== "sys") continue;
    const key = path.join("/");
    if (LEGACY_TIER2_PATHS.has(key) && parse(path, "sys").ok) needless.push(key);
  }
  assert.deepEqual(
    needless.slice(0, 15),
    [],
    `${needless.length} allowlisted path(s) now parse — remove them from ` +
      `test/legacy-tier2-paths.json and let the grammar check them`,
  );
});

test("no path segment anywhere contains a hyphen — RULE 1 holds across every tier", async () => {
  const { index } = await import("../build/token-index.mjs");
  const { checkSegments } = await import("../build/grammar.mjs");
  const bad = [];
  for (const { path, filePath } of index()) {
    const err = checkSegments(path);
    if (err) bad.push(`${filePath} :: ${path.join("/")} — ${err}`);
  }
  assert.deepEqual(bad.slice(0, 10), [], `${bad.length} segment(s) break RULE 1`);
});

test("the generated namespaces are authored all-lowercase (house style)", async () => {
  // Applies only to what we generate. The legacy camelCase segments are RULE 1-clean and
  // are deliberately left alone — see the note on SEGMENT_RE.
  const { index } = await import("../build/token-index.mjs");
  const { LOWERCASE_SEGMENT_RE } = await import("../build/grammar.mjs");
  const bad = [];
  for (const { path, filePath } of index()) {
    if (!/\.generated\.json$/.test(filePath)) continue;
    for (const seg of path) {
      if (!LOWERCASE_SEGMENT_RE.test(seg)) bad.push(`${filePath} :: ${path.join("/")} → ${seg}`);
    }
  }
  assert.deepEqual(bad.slice(0, 10), [], `${bad.length} non-lowercase segment(s) in generated tokens`);
});

test("no token is also a group — a leaf may never have children", async () => {
  // DTCG and Figma are both TREES: a node with $value is a token and Style Dictionary does
  // not descend into it, so any children are silently DROPPED. This has now bitten three
  // times (`text/neutral`, `bg/neutral`, `border/neutral/strong`), each time losing tokens
  // with no error. Documenting the rule was not enough; this enforces it.
  const { SOURCES } = await import("../build/token-index.mjs");
  const { readFileSync } = await import("node:fs");
  const offenders = [];

  const walk = (node, path, file) => {
    if (!node || typeof node !== "object") return;
    const children = Object.keys(node).filter((k) => !k.startsWith("$"));
    const isToken = node.$value !== undefined || node.value !== undefined;
    if (isToken && children.length) {
      offenders.push(`${file} :: ${path.join("/")} has $value AND children [${children}]`);
    }
    if (isToken) return;
    for (const key of children) walk(node[key], [...path, key], file);
  };

  // Walk the MERGED tree, not each file separately. The collision that motivated this test
  // was ACROSS files: semantic.json held `border/neutral/strong` as a leaf while
  // system.generated.json held `border/neutral/strong/hover`. Style Dictionary merges them,
  // the leaf wins, and the child vanishes — invisible to any per-file check.
  const merged = {};
  const deepMerge = (into, from) => {
    for (const [k, v] of Object.entries(from)) {
      if (k.startsWith("$")) continue;
      if (v && typeof v === "object" && !Array.isArray(v) && v.$value === undefined) {
        deepMerge((into[k] ??= {}), v);
      } else {
        into[k] = v;
      }
    }
  };
  for (const rel of SOURCES) {
    deepMerge(merged, JSON.parse(readFileSync(new URL(`../${rel}`, import.meta.url), "utf8")));
  }
  walk(merged, [], "merged token tree");
  assert.deepEqual(offenders.slice(0, 10), [], `${offenders.length} token(s) that are also groups`);
});

// ---------------------------------------------------------------------------
// The generators must actually run, and agree with what they generated.
// ---------------------------------------------------------------------------

/**
 * `src/system.generated.json` says "GENERATED — do not edit". It had not been generatable for
 * some time: the ordinal-ladder rename updated the OUTPUT (by hand) and left the generator on
 * the retired rung names, so every path it built failed the grammar check and the script
 * exited before writing. The file and its generator had silently become two different things,
 * and the only symptom was a message nobody ran.
 *
 * Running each generator and diffing its output is the check that makes "generated" true.
 */
import { execFileSync } from "node:child_process";

for (const [script, output] of [
  ["build/generate-system-tokens.mjs", "src/system.generated.json"],
  ["build/generate-component-tokens.mjs", "src/component.generated.json"],
]) {
  test(`${script} runs, and its output matches the file in the repo`, () => {
    const before = readFileSync(root + output, "utf8");
    try {
      execFileSync(process.execPath, [root + script], { cwd: root, stdio: "pipe" });
    } catch (err) {
      const detail = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
      assert.fail(`${script} exited non-zero — it cannot regenerate its own output:\n${detail}`);
    }
    const after = readFileSync(root + output, "utf8");
    if (before !== after) {
      writeFileSync(root + output, before); // leave the tree as we found it
      assert.fail(
        `${output} is not what ${script} produces. Either the generator has drifted from the ` +
          `file, or the file was hand-edited — regenerate and commit the result.`,
      );
    }
  });
}
