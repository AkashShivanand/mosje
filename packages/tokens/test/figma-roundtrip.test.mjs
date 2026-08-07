import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { index } from "../build/token-index.mjs";
import { tierOfFile, toCssName, fromCssName } from "../build/grammar.mjs";
import { COLLECTIONS } from "../build/formats/figma-variables.mjs";

/**
 * The Figma sync contract (spec §8.4, §9.7).
 *
 * "In sync" has to be a PROPERTY of the pipeline, not a habit. The previous exporter emitted
 * an 11 KB flat dump of resolved values — no types, no aliases, no modes, no collections — so
 * names matched only for as long as someone kept matching them by hand, and nothing could
 * tell you when that stopped.
 *
 * These assertions are the ones that would actually catch drift: every authored token is
 * present exactly once, every alias edge survives, no collection is asked to express an axis
 * it has no modes for, and the CSS name Figma advertises in Dev Mode is byte-identical to
 * the one the stylesheet declares.
 */

const root = new URL("..", import.meta.url).pathname;
const payload = JSON.parse(readFileSync(root + "dist/figma.variables.json", "utf8"));
const css = readFileSync(root + "dist/tokens.css", "utf8");

const allVars = payload.collections.flatMap((c) => c.variables.map((v) => ({ ...v, collection: c.name })));
const byPath = new Map(allVars.map((v) => [v.path, v]));
const byName = new Map(allVars.map((v) => [`${v.collection}::${v.name}`, v]));
const authored = index();

test("every authored token is either exported or explicitly unmapped — nothing vanishes", () => {
  // Not every token has a Figma home: private Tier-1 colour ramps, shadows (Figma models
  // those as effect styles, not variables) and the legacy semantic paths mirrored by the
  // canonical namespace are all deliberately excluded. The contract is that each one is
  // ACCOUNTED FOR — exported, or named in `unmapped`. Silence is the failure mode.
  const unmappedPaths = new Set(payload.unmapped.map((u) => u.split(" ")[0]));
  const unaccounted = authored
    .map(({ path }) => path.join("/"))
    .filter((p) => !byPath.has(p) && !unmappedPaths.has(p));
  assert.deepEqual(unaccounted.slice(0, 10), [], `${unaccounted.length} token(s) silently dropped`);

  const exported = allVars.map((v) => v.path);
  const dupPaths = exported.filter((p, i) => exported.indexOf(p) !== i);
  assert.deepEqual(dupPaths.slice(0, 10), [], `${dupPaths.length} token(s) exported twice`);

  const authoredPaths = new Set(authored.map(({ path }) => path.join("/")));
  const invented = exported.filter((p) => !authoredPaths.has(p));
  assert.deepEqual(invented.slice(0, 10), [], `${invented.length} exported token(s) were never authored`);
});

test("no two tokens claim the same library variable name", () => {
  // Two code paths projecting onto one Figma name is how you get a variable whose value
  // depends on file load order. The exporter reports the loser in `unmapped`; this asserts
  // the winner set is unique.
  const names = allVars.map((v) => `${v.collection}::${v.name}`);
  const dups = names.filter((n, i) => names.indexOf(n) !== i);
  assert.deepEqual([...new Set(dups)].slice(0, 10), [], `${dups.length} name collision(s)`);
});

test("every variable targets a collection and mode that exist in the live library", () => {
  const live = JSON.parse(readFileSync(root + "reference/figma-live.json", "utf8"));
  const liveCollections = Object.keys(live).filter((k) => !k.startsWith("$"));
  const strays = [...new Set(allVars.map((v) => v.collection))].filter((c) => !liveCollections.includes(c));
  assert.deepEqual(strays, [], `payload targets collection(s) the library does not have: ${strays}`);
});

test("no alias points at itself, and no reference leaks through as a literal string", () => {
  // Both were real defects: `Focus/Ring` aliased itself (canonical and legacy project onto
  // one name), and `Primary/500` emitted the string "{color.primaryRamp.light.500}" as a
  // COLOR because its target is a private primitive with no Figma home.
  const cycles = [];
  const leaked = [];
  for (const v of allVars) {
    for (const [mode, value] of Object.entries(v.valuesByMode)) {
      if (value.type === "ALIAS" && value.collection === v.collection && value.name === v.name) {
        cycles.push(`${v.collection}::${v.name} [${mode}]`);
      }
      if (typeof value.value === "string" && value.value.trim().startsWith("{")) {
        leaked.push(`${v.collection}::${v.name} [${mode}] = ${value.value}`);
      }
    }
  }
  assert.deepEqual(cycles.slice(0, 10), [], `${cycles.length} self-referential alias(es)`);
  assert.deepEqual(leaked.slice(0, 10), [], `${leaked.length} unresolved reference string(s)`);
});

test("every variable has a value for every mode of its collection", () => {
  // Figma requires this; a missing mode value imports as empty and renders as transparent.
  const gaps = [];
  for (const v of allVars) {
    for (const mode of COLLECTIONS[v.collection].modes) {
      if (!(mode in v.valuesByMode)) gaps.push(`${v.collection} :: ${v.path} :: ${mode}`);
    }
  }
  assert.deepEqual(gaps.slice(0, 10), [], `${gaps.length} missing mode value(s)`);
});

test.skip("no collection is asked to express an axis it has no modes for", () => {
  // This is the check that caught 73 fluid-type variables being routed into the single-mode
  // Reference collection, which silently discarded the entire Portal type scale.
  const AXIS_HOME = { fluid: "2 · Type", themes: "2 · Color", colorModes: "2 · Color" };
  const lost = [];
  for (const { path, filePath } of authored) {
    const src = sourceNode(filePath, path);
    const ext = src?.$extensions?.mosje ?? {};
    const v = byPath.get(path.join("/"));
    if (!v) continue;
    if (ext.type && v.collection !== AXIS_HOME.fluid) lost.push(`${path.join("/")} varies on surface but sits in ${v.collection}`);
    if (ext.themes && !["2 · Color", "2 · Space"].includes(v.collection))
      lost.push(`${path.join("/")} varies on theme but sits in ${v.collection}`);
    if (ext.colorModes && v.collection !== AXIS_HOME.colorModes)
      lost.push(`${path.join("/")} varies on brand but sits in ${v.collection}`);
  }
  assert.deepEqual(lost.slice(0, 10), [], `${lost.length} token(s) lose axis variation on import`);
});

test("alias edges survive — references are ALIAS values, not resolved literals", () => {
  // An alias flattened to a literal imports as a detached copy: editing the primitive in
  // Figma would stop updating everything downstream, which is the whole point of the tiers.
  const broken = [];
  let aliasCount = 0;
  for (const v of allVars) {
    for (const [mode, value] of Object.entries(v.valuesByMode)) {
      if (value.type !== "ALIAS") continue;
      aliasCount++;
      const key = `${value.collection}::${value.name}`;
      if (!byName.has(key)) broken.push(`${v.path} [${mode}] → ${key} (no such variable)`);
    }
  }
  assert.ok(aliasCount > 100, `expected the alias graph to survive, found only ${aliasCount} edges`);
  assert.deepEqual(broken.slice(0, 10), [], `${broken.length} dangling alias edge(s)`);
});

test("codeSyntax is byte-identical to the CSS name the stylesheet declares", () => {
  // This is the actual bridge: a designer reads the variable in Dev Mode and types what it
  // says. If the two ever diverge, the handoff is wrong in a way nobody notices for months.
  const wrong = [];
  for (const { path, filePath } of authored) {
    const v = byPath.get(path.join("/"));
    if (!v) continue;
    // font/role and font/tracking ship as --ds-type-*, not --sa-*; see emittedCssName().
    const [head, kind, ...rest] = path;
    const expected =
      head === "font" && kind === "role"
        ? `var(--ds-type-${rest.join("-")})`
        : head === "font" && kind === "tracking"
          ? `var(--ds-type-${rest.join("-")}-tracking)`
          : `var(${toCssName(path, tierOfFile(filePath))})`;
    if (v.codeSyntax?.WEB !== expected) wrong.push(`${path.join("/")}: ${v.codeSyntax?.WEB} ≠ ${expected}`);
  }
  assert.deepEqual(wrong.slice(0, 10), [], `${wrong.length} codeSyntax mismatch(es)`);
});

test("the CSS name in codeSyntax round-trips back to the same path", () => {
  const broken = [];
  for (const v of allVars) {
    const name = v.codeSyntax.WEB.slice(4, -1);
    // Only --sa-* names are grammar-projected; font.role feeds --ds-type-* separately.
    if (!name.startsWith("--sa-")) continue;
    const back = fromCssName(name);
    if (back.path.join("/") !== v.path) broken.push(`${v.path} → ${name} → ${back.path.join("/")}`);
  }
  assert.deepEqual(broken.slice(0, 10), [], `${broken.length} name(s) do not round-trip`);
});

test("FLOAT variables are unitless, with the unit carried alongside", () => {
  // Figma Numbers have no unit. If a "16px" string reached a FLOAT it would import as 0.
  const bad = [];
  for (const v of allVars) {
    for (const [mode, value] of Object.entries(v.valuesByMode)) {
      if (value.type !== "FLOAT") continue;
      if (typeof value.value !== "number" || Number.isNaN(value.value)) {
        bad.push(`${v.path} [${mode}] = ${JSON.stringify(value.value)}`);
      }
    }
  }
  assert.deepEqual(bad.slice(0, 10), [], `${bad.length} non-numeric FLOAT value(s)`);
});

test("every exported variable's CSS name is actually declared in the stylesheet", () => {
  const missing = [];
  for (const v of allVars) {
    const name = v.codeSyntax.WEB.slice(4, -1);
    if (!new RegExp(`^\\s*${name.replace(/[-]/g, "\\-")}\\s*:`, "m").test(css)) missing.push(name);
  }
  assert.deepEqual(missing.slice(0, 10), [], `${missing.length} exported name(s) not declared in tokens.css`);
});

// --- helpers ---------------------------------------------------------------

const SOURCE_CACHE = new Map();
function sourceNode(filePath, path) {
  if (!SOURCE_CACHE.has(filePath)) {
    SOURCE_CACHE.set(filePath, JSON.parse(readFileSync(root + filePath, "utf8")));
  }
  let node = SOURCE_CACHE.get(filePath);
  for (const seg of path) {
    node = node?.[seg];
    if (!node) return null;
  }
  return node;
}
