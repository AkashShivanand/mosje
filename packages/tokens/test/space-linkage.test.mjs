import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readCensus, readBaseline, diff, ghostIds, DEBT_KEYS } from "../build/figma-space-audit.mjs";

/**
 * The space gate. Two halves, and they fail for different reasons.
 *
 * HALF ONE — the Figma ratchet. Reads the spacing census of the live library and refuses any
 * page that gets worse. See `build/figma-space-audit.mjs` for why a ratchet, why per page, and
 * for the one-page-per-invocation constraint that makes the census trustworthy.
 *
 * HALF TWO — the source invariants. These need no Figma access and assert what must be true of
 * `src/primitive.json` + `src/semantic.json` regardless of what the canvas currently looks
 * like: families alias space and only space, rungs ascend, and no primitive rung is left with
 * nothing pointing at it.
 *
 * The halves are deliberately in one file. The census answers "is the library bound correctly
 * today"; the invariants answer "could it be". A regression in either is the same defect.
 */

const root = new URL("..", import.meta.url).pathname;
const primitive = JSON.parse(readFileSync(root + "src/primitive.json", "utf8"));
const semantic = JSON.parse(readFileSync(root + "src/semantic.json", "utf8"));

const FAMILIES = ["inline", "stack", "padding", "section"];

/**
 * Rungs are VALUE-NAMED as of 2026-08-18: the label IS the pixel value. That single change is
 * what makes the two tests below possible — under the old T-shirt labels neither could exist,
 * because `l` legitimately meant 16, 24, 20 and 56 in the four families.
 */
const isRung = (k) => /^\d+$/.test(k);

const px = (v) => Number(String(v).replace("px", ""));
const refOf = (v) => (typeof v === "string" && v.startsWith("{") ? v.slice(1, -1) : null);

// ---------------------------------------------------------------------------
// Half one — the Figma ratchet
// ---------------------------------------------------------------------------

test("the census exists and records how it was swept", () => {
  // Without this the gate goes green on a census that was never taken, or — worse — on one
  // taken by batching pages, which silently under-reports. See the $method note.
  const census = readCensus();
  assert.ok(census.$sweptAt, "reference/figma-space-bindings.json has no $sweptAt");
  assert.match(
    census.$method ?? "",
    /ONE PAGE PER use_figma INVOCATION/,
    "the census does not declare the one-page-per-invocation method — a batched sweep under-reports and must not be committed",
  );
  assert.equal(census.$totals.pagesSwept, census.pages.length + census.$emptyPages.length,
    "pagesSwept disagrees with the pages actually recorded — the sweep is incomplete");
});

test("no page's spacing debt grows — the baseline may only shrink", () => {
  const { grown } = diff(readCensus(), readBaseline());
  assert.deepEqual(
    grown.slice(0, 12),
    [],
    `${grown.length} page(s) gained spacing debt. Something was bound to a radius/type variable, ` +
      `to a hidden ref/* primitive, to a deleted variable, to another library, or left raw. ` +
      `Rebind to the semantic family (inline|stack|padding|section); do not extend the baseline.`,
  );
});

test("an improved page must be re-baselined in the same change", () => {
  const { shrunk } = diff(readCensus(), readBaseline());
  assert.deepEqual(
    shrunk.slice(0, 12),
    [],
    `${shrunk.length} page(s) improved without the baseline being refreshed. Run ` +
      `\`node build/figma-space-audit.mjs --update-baseline\` and commit it, so the gain is ` +
      `locked in rather than left available to be spent on a regression elsewhere.`,
  );
});

test("no stale baseline entry", () => {
  const { stale } = diff(readCensus(), readBaseline());
  assert.deepEqual(stale.slice(0, 12), [], `${stale.length} baseline entr(ies) no longer exist — delete them`);
});

test("no NEW ghost variable id appears on a spacing property", () => {
  const known = new Set(readBaseline().$knownGhostIds);
  const added = [...ghostIds(readCensus()).entries()]
    .filter(([id]) => !known.has(id))
    .map(([id, n]) => `${id} (${n}×)`);
  assert.deepEqual(
    added,
    [],
    `spacing is bound to ${added.length} variable id(s) no collection owns and the baseline has ` +
      `never seen. @mosje/tokens can never update those. Rebind to the canonical token.`,
  );
});

test("the share of spacing on a correct semantic token never falls", () => {
  const census = readCensus();
  const baseline = readBaseline();
  assert.ok(
    census.$totals.correctPct >= baseline.$totals.correctPct,
    `correct semantic spacing fell from ${baseline.$totals.correctPct}% to ${census.$totals.correctPct}%`,
  );
});

test("every bound spacing property is classified", () => {
  // `other` is the classifier's escape hatch. A non-zero count means a new naming family
  // reached the library and the audit is silently mis-bucketing it.
  const unclassified = readCensus().pages.filter((p) => p.other > 0).map((p) => `${p.name}: ${p.other}`);
  assert.deepEqual(unclassified, [], "unclassified spacing bindings — teach the classifier the new family");
});

// ---------------------------------------------------------------------------
// Half two — the source invariants
// ---------------------------------------------------------------------------

test("every semantic space token aliases a space primitive, never another family", () => {
  const wrong = [];
  for (const family of FAMILIES) {
    for (const [rung, token] of Object.entries(semantic[family] ?? {})) {
      if (rung.startsWith("$")) continue;
      const ref = refOf(token.$value);
      assert.ok(ref, `${family}/${rung} is a literal — every semantic space token must alias a primitive`);
      if (!ref.startsWith("space.")) wrong.push(`${family}/${rung} → {${ref}}`);
    }
  }
  assert.deepEqual(
    wrong,
    [],
    "a spacing token aliases outside the space scale. This is the source-side twin of the " +
      "cross-family bindings the census counts on canvas (38,799 of them, mostly ref/radius/none " +
      "bound to padding) — it must never become possible from the token side too.",
  );
});

test("a rung's NAME is its pixel value — in every family", () => {
  // The invariant the value-naming exists to create. While it holds, `padding/16` and
  // `inline/16` cannot drift apart, and no lookup table is needed to read a token.
  const wrong = [];
  for (const family of FAMILIES) {
    for (const [rung, token] of Object.entries(semantic[family] ?? {})) {
      if (rung.startsWith("$")) continue;
      assert.ok(isRung(rung), `${family}/${rung} is not value-named`);
      const ref = refOf(token.$value);
      const actual = px(primitive.space[ref.split(".")[1]].$value);
      if (actual !== Number(rung)) wrong.push(`${family}/${rung} resolves to ${actual}px`);
    }
  }
  assert.deepEqual(wrong, [], "a rung label disagrees with the value it resolves to");
});

test("no label means two different things across families", () => {
  // The defect this replaced: 7 of 11 T-shirt labels collided, `l` meaning 16/24/20/56.
  const byLabel = {};
  for (const family of FAMILIES) {
    for (const [rung, token] of Object.entries(semantic[family] ?? {})) {
      if (rung.startsWith("$")) continue;
      (byLabel[rung] ??= new Set()).add(px(primitive.space[refOf(token.$value).split(".")[1]].$value));
    }
  }
  const collided = Object.entries(byLabel)
    .filter(([, vals]) => vals.size > 1)
    .map(([l, vals]) => `${l} → ${[...vals].join(", ")}`);
  assert.deepEqual(collided, [], "a label carries more than one value across the families");
});

test("no space primitive is left without a semantic consumer", () => {
  // A Tier-1 rung nothing aliases is a rung designers can only reach by breaking tier discipline.
  // The list is EMPTY as of 2026-08-18: giving every family the full ladder gave 72px its
  // first consumer and closed the last gap. An addition here is a regression, not a fact.
  const KNOWN_ORPHANS = [];  // was ["8xl"] (72px); every rung now has a consumer in all four families

  const consumed = new Set();
  for (const family of FAMILIES) {
    for (const [rung, token] of Object.entries(semantic[family] ?? {})) {
      if (rung.startsWith("$")) continue;
      consumed.add(refOf(token.$value).split(".")[1]);
    }
  }
  // `grid/*`, `focus/*` and friends also consume primitives; count them so they are not orphans.
  for (const group of ["grid", "focus", "layout", "target", "container"]) {
    for (const token of Object.values(semantic[group] ?? {})) {
      const ref = typeof token?.$value === "string" ? refOf(token.$value) : null;
      if (ref?.startsWith("space.")) consumed.add(ref.split(".")[1]);
    }
  }

  const orphans = Object.keys(primitive.space)
    .filter((k) => !k.startsWith("$"))
    .filter((k) => !consumed.has(k));

  assert.deepEqual(
    orphans.sort(),
    [...KNOWN_ORPHANS].sort(),
    "a space primitive has no semantic consumer. Give it a rung in inline|stack|padding|section, " +
      "or retire it — do not leave it reachable only by binding Tier-1 directly.",
  );
});

test("the debt keys the baseline freezes are the ones the census reports", () => {
  const page = readCensus().pages[0];
  for (const k of DEBT_KEYS) assert.ok(k in page, `census pages do not carry "${k}" — the gate would silently pass`);
});
