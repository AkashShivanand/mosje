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

  // Brand-source companions are a deliberate second presence for one authored token (the
  // brand value in Color, the appearance layer in Theme). Excluded here; the "no two tokens
  // claim the same library NAME" test still guards the real hazard.
  const exported = allVars.filter((v) => v.role !== "brand-source").map((v) => v.path);
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

test("no collection is asked to express an axis it has no modes for", () => {
  // The check that caught 73 fluid-type variables losing the entire Portal scale, and then
  // the whole theme axis having no home at all.
  //
  // It follows the ALIAS CHAIN rather than reading extensions off the token directly. The
  // canonical namespace is pure aliases, so the theme override lives on the legacy token it
  // points at — a direct read finds nothing and the assertion passes while dark mode is
  // silently absent. That is exactly how this went unnoticed once already.
  const AXIS_MODES = { fluid: "surface", themes: "theme", colorModes: "brand" };
  // Keyed by the LIVE collection names, which became tier-ordered on 2026-08-10 when the
  // library was restructured. `Palette` is the brand-bearing ramp layer; `Color` is
  // the semantic + component layer that aliases into it.
  const COLLECTION_AXES = {
    "Palette": ["brand"],
    "Color": ["theme"],
    "Type": ["surface"],
    "Density": ["density"],
    "Space": [],
    "Radius": [],
    "Motion": [],
  };

  const sourceByPath = new Map();
  for (const { path, filePath } of authored) sourceByPath.set(path.join("."), { path, filePath });

  function axesOf(key, depth = 0) {
    if (depth > 8) return new Set();
    const entry = sourceByPath.get(key);
    if (!entry) return new Set();
    const node = sourceNode(entry.filePath, entry.path);
    const ext = node?.$extensions?.mosje ?? {};
    const found = new Set();
    if (ext.type) found.add("fluid");
    if (ext.themes) found.add("themes");
    // `navy` SPECIFICALLY, matching `brandOwner` in formats/figma-variables.mjs — the two
    // encode one rule from opposite sides and must agree on it. Figma's Palette models exactly
    // one brand axis, [Blue, Navy], so that is the only brand variation an import can lose. A
    // token whose only overrides are the code-only `dbim-*` conformance modes loses nothing by
    // living in single-mode Color: those modes never reach the library at all, by standing
    // instruction. Counting any `colorModes` key made this gate demand that such a token be
    // promoted into Palette, which creates a variable whose two modes are identical.
    if (ext.colorModes?.navy !== undefined) found.add("colorModes");
    const raw = node?.$value;
    if (typeof raw === "string" && /^\{[^}]+\}$/.test(raw.trim())) {
      for (const a of axesOf(raw.trim().slice(1, -1), depth + 1)) found.add(a);
    }
    return found;
  }

  const aliasedByTheme = new Set();
  for (const v of allVars) {
    if (v.collection !== "Color") continue;
    for (const value of Object.values(v.valuesByMode)) {
      if (value.type === "ALIAS" && value.collection === "Palette") aliasedByTheme.add(value.name);
    }
  }

  const lost = [];
  for (const v of allVars) {
    const axes = axesOf(v.path.replace(/\//g, "."));
    const supported = COLLECTION_AXES[v.collection] ?? [];
    for (const axis of axes) {
      // `compact` rides on the themes extension but is the density axis, not appearance.
      if (axis === "themes" && supported.includes("density")) continue;
      const needed = AXIS_MODES[axis];
      // Brand delegated through an alias is NOT lost: a Theme token whose Light value
      // aliases into Color resolves per brand mode, because Color carries that axis. Only a
      // literal actually drops it.
      if (needed === "brand" && v.valuesByMode.Default?.type === "ALIAS" && v.valuesByMode.Default.collection === "Palette") {
        continue;
      }
      // A Color variable that some Theme variable ALIASES is a brand source: appearance is
      // expressed by the Theme tokens pointing at it, so the theme axis is not lost here.
      // Matching by name would miss it — `color/text/disabled` lands as `Palette::color/text/disabled`
      // while its consumers are `Color::text/neutral/disabled`, `Color::icon/neutral/disabled`
      // and 16 more.
      if (needed === "theme" && v.collection === "Palette" && aliasedByTheme.has(v.name)) {
        continue;
      }
      if (!supported.includes(needed)) {
        lost.push(`${v.collection}::${v.name} varies on ${needed} but that collection has no ${needed} modes`);
      }
    }
  }
  assert.deepEqual(lost.slice(0, 10), [], `${lost.length} variable(s) lose axis variation on import`);
});

test("the theme axis actually carries different values, not three identical copies", () => {
  // A Theme collection whose three modes are the same value is worse than none: it looks
  // like dark mode is supported and renders light. Assert real variation exists.
  const theme = payload.collections.find((c) => c.name === "Color");
  assert.ok(theme, "no Color collection — the semantic colour layer has no home");
  const varying = theme.variables.filter((v) => {
    const sigs = Object.values(v.valuesByMode).map((x) =>
      x.type === "ALIAS" ? `${x.collection}::${x.name}` : String(x.value),
    );
    return new Set(sigs).size > 1;
  });
  // The Theme collection is SINGLE-MODE since 2026-08-10 (Light only). Dark and HC were removed
  // because the UX4G accessibility widget is the estate's canonical high-contrast mechanism and
  // drives its own `.dark-mode` class, never `data-theme`. With one mode there is nothing to vary,
  // so this asserts the axis is deliberately flat rather than accidentally flat: exactly one mode.
  const modes = new Set(theme.variables.flatMap((v) => Object.keys(v.valuesByMode)));
  assert.deepEqual([...modes], ["Default"], `Color should be single-mode; found ${[...modes]}`);
  assert.equal(varying.length, 0, "single-mode collection cannot have varying values");
});

test("a Theme token's Light value stays brand-aware", () => {
  // The bug this guards: the alias chain bottoms out in a private Tier-1 ramp, so Light
  // resolves to a LITERAL and the Navy brand is silently dropped for every token that
  // varies on both axes. Light must alias into Color, which is itself brand-aware.
  const theme = payload.collections.find((c) => c.name === "Color");
  const mustAlias = ["Background/Neutral/Default", "Text/Neutral/Default", "Border/Neutral/Subtle"];
  for (const name of mustAlias) {
    const v = theme.variables.find((x) => x.name === name);
    if (!v) continue;
    assert.equal(
      v.valuesByMode.Light.type,
      "ALIAS",
      `${name} Light is a literal — the Navy brand will not reach it`,
    );
    assert.equal(v.valuesByMode.Light.collection, "Color");
  }
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
    // font/role and font/tracking ship as --sa-type-*, built by buildResponsiveType().
    const [head, kind, ...rest] = path;
    const expected =
      head === "font" && kind === "role"
        ? `var(--sa-type-${rest.join("-")})`
        : head === "font" && kind === "tracking"
          ? `var(--sa-type-${rest.join("-")}-tracking)`
          : `var(${toCssName(path, tierOfFile(filePath))})`;
    if (v.codeSyntax?.WEB !== expected) wrong.push(`${path.join("/")}: ${v.codeSyntax?.WEB} ≠ ${expected}`);
  }
  assert.deepEqual(wrong.slice(0, 10), [], `${wrong.length} codeSyntax mismatch(es)`);
});

test("the CSS name in codeSyntax round-trips back to the same path", () => {
  const broken = [];
  for (const v of allVars) {
    const name = v.codeSyntax.WEB.slice(4, -1);
    // Only --sa-* names are grammar-projected; font.role feeds --sa-type-* separately.
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
