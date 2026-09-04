import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { parse, fromCssName, tierOfFile, toCssName } from "../build/grammar.mjs";

/**
 * Tier discipline — the rules from spec §3, §4.1 and §9.1, enforced rather than documented.
 *
 * A convention nobody can violate is a system; one you can is a style guide. Before this
 * file the tier rule existed only as a sentence in design.md, and design.md was itself
 * wrong about which prefix the component tier used.
 */

const root = new URL("..", import.meta.url).pathname;
const repo = new URL("../../../", import.meta.url).pathname;
const css = readFileSync(root + "dist/tokens.css", "utf8");
const ux4g = readFileSync(root + "dist/ux4g.css", "utf8");

const declared = new Set([...`${css}\n${ux4g}`.matchAll(/^\s*(--[A-Za-z0-9-]+)\s*:/gm)].map((m) => m[1]));

test("no var() in the generated CSS points at a name nothing declares", () => {
  // The tier rename broke 44 references the first time it ran. This is the guard that
  // turns that from a silent visual regression into a failing build.
  const used = new Set([...`${css}\n${ux4g}`.matchAll(/var\((--sa-[A-Za-z0-9-]+)/g)].map((m) => m[1]));
  const dangling = [...used].filter((n) => !declared.has(n)).sort();
  assert.deepEqual(dangling, [], `dangling --sa-* references:\n  ${dangling.join("\n  ")}`);
});

test("every emitted --sa-* name carries the tier marker its source file implies", () => {
  const src = JSON.parse(
    execSync("node -e \"import('./build/token-index.mjs').then(m=>console.log(JSON.stringify(m.index())))\"", {
      cwd: root,
    }).toString(),
  );
  const wrong = [];
  for (const { path, filePath } of src) {
    const tier = tierOfFile(filePath);
    const expected = toCssName(path, tier);
    // font.role/tracking feed --ds-type-* instead of emitting directly.
    if (path[0] === "font" && (path[1] === "role" || path[1] === "tracking")) continue;
    if (!declared.has(expected)) wrong.push(`${path.join(".")} (${tier}) → expected ${expected}`);
  }
  assert.deepEqual(wrong.slice(0, 10), [], `${wrong.length} token(s) not emitted under their tier marker`);
});

test("the Tier-2 namespace never starts with a reserved tier marker", () => {
  // If a Tier-2 path began `ref/…` it would flatten to `--sa-ref-…` and be indistinguishable
  // from Tier 1 — the projection would stop being reversible and the Figma round-trip
  // would silently pair the wrong variables.
  for (const name of declared) {
    if (!name.startsWith("--sa-")) continue;
    const { tier, path } = fromCssName(name);
    if (tier !== "sys") continue;
    const r = parse(path, "sys");
    if (!r.ok && /reserved/.test(r.error)) assert.fail(`${name} collides with a tier marker`);
  }
});

test("app code never references a Tier-1 reference token", () => {
  // Spec §9 lint: `--sa-ref-*` outside packages/tokens and the generated CSS is an error.
  // Referencing a primitive directly couples a component to one brand ramp and breaks
  // both the dark/HC themes and the brand-pack white-labelling.
  const files = execSync("git ls-files '*.css' '*.tsx' '*.ts'", { cwd: repo })
    .toString()
    .split("\n")
    .filter(Boolean)
    .filter(
      (f) =>
        !f.startsWith("packages/tokens/") &&
        f !== "packages/design-system/tokens.css" &&
        f !== "packages/design-system/ux4g.css",
    );

  const offenders = [];
  for (const f of files) {
    let text;
    try {
      text = readFileSync(repo + f, "utf8");
    } catch {
      continue;
    }
    if (/var\(--sa-ref-/.test(text)) offenders.push(f);
  }
  assert.deepEqual(
    offenders,
    [],
    `Tier-1 reference tokens used in app code:\n  ${offenders.join("\n  ")}\n` +
      `Use a Tier-2 (--sa-*) or --ds-* token instead, or add one if none fits.`,
  );
});

// ---------------------------------------------------------------------------
// The component tier must FOLLOW the brand, not freeze against it.
// ---------------------------------------------------------------------------

/**
 * Until 2026-08-10 every one of the 296 `--sa-cmp-*` shipped as a resolved hex, because the
 * CSS format handed var() chains only to `system.generated.json`. The consequence was silent
 * and total: the whole component layer ignored `data-brand`, so the primary button was
 * `#025fb8` under Blue and `#025fb8` under Navy. Figma held the same tokens as ALIASES, where
 * 85 of them did repaint — so the two sides disagreed about the layer that describes buttons,
 * and nothing looked.
 *
 * The source was never at fault: Tier 3 is 196 references and zero literals. Only the emit
 * flattened it. These two tests are what stop it flattening again.
 */
test("no --sa-cmp-* is emitted as a resolved literal when its source is a reference", async () => {
  // Compared against the SOURCE, not against a blanket expectation. 92 of the 288 Tier-3
  // values are legitimately literal — `rgba(255,255,255,.92)` for the inverse variants that
  // sit on a solid brand surface, and `rgba(0,0,0,0)` for transparent fills. White at 92 %
  // is white in every brand, so freezing those is correct. Only a token whose source is a
  // {reference} and whose output is a hex has lost its chain.
  const { readFileSync } = await import("node:fs");
  const { toCssName } = await import("../build/grammar.mjs");

  const referenced = new Set();
  for (const file of ["src/component.generated.json", "src/component.json"]) {
    const walk = (node, path) => {
      if (!node || typeof node !== "object") return;
      if (node.$value !== undefined) {
        if (typeof node.$value === "string" && node.$value.trim().startsWith("{")) {
          referenced.add(toCssName(path, "cmp"));
        }
        return;
      }
      for (const k of Object.keys(node)) if (!k.startsWith("$")) walk(node[k], [...path, k]);
    };
    walk(JSON.parse(readFileSync(root + file, "utf8")), []);
  }

  const rootBlock = css.slice(css.indexOf(":root"), css.indexOf("}", css.indexOf(":root")));
  const frozen = [];
  for (const m of rootBlock.matchAll(/(--sa-cmp-[A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) {
    const value = m[2].trim();
    // A chain is `var(...)`, or — for a translucent token — a color-mix() whose colour AND
    // opacity are both var() chains. Either follows data-brand; a hex or an rgba() does not.
    const isChain = value.startsWith("var(") || (value.startsWith("color-mix(") && /var\(--sa-[A-Za-z0-9-]+\) calc\(var\(--sa-alpha-/.test(value));
    if (referenced.has(m[1]) && !isChain) frozen.push(m[1]);
  }
  assert.deepEqual(
    frozen.slice(0, 10),
    [],
    `${frozen.length} component token(s) whose source is a reference are emitted as frozen ` +
      `literals — they will not follow data-brand. The CSS format has stopped emitting the chain.`,
  );
});

test("the component tier actually repaints when the brand changes", () => {
  // A weaker version of this — "cmp tokens are var() chains" — would pass on a chain that
  // bottoms out in something brand-invariant. This resolves the chain in both brands and
  // insists the layer genuinely moves, which is the property anyone binding to it needs.
  const blocks = [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{([^}]*)\}/g)]
    .map((m) => ({ sel: m[1].trim(), body: m[2] }));
  const ctx = (match) => {
    const map = new Map();
    for (const b of blocks) {
      if (b.sel === ":root" || (match && b.sel.includes(match))) {
        for (const m of b.body.matchAll(/(--[A-Za-z0-9-]+)\s*:\s*([^;]+);/g)) map.set(m[1], m[2].trim());
      }
    }
    const res = (v, d = 0) => {
      if (d > 20) return v;
      const m = /^var\((--[A-Za-z0-9-]+)(?:\s*,\s*([^)]*))?\)$/.exec(String(v).trim());
      if (!m) return String(v).trim();
      const t = map.get(m[1]);
      return t !== undefined ? res(t, d + 1) : m[2] ? res(m[2], d + 1) : v;
    };
    return { map, res };
  };
  const blue = ctx(null);
  const navy = ctx('data-brand="navy"');
  let moved = 0;
  for (const [name] of blue.map) {
    if (!name.startsWith("--sa-cmp-")) continue;
    if (blue.res(blue.map.get(name)) !== navy.res(navy.map.get(name))) moved++;
  }
  assert.ok(
    moved >= 100,
    `only ${moved} component tokens change between Blue and Navy — the brand axis has stopped ` +
      `reaching Tier 3 (it was 101 when this gate was written, and 0 before the fix)`,
  );
});

// ---------------------------------------------------------------------------
// Adopted-from-UX4G scales: the value must have exactly ONE definition.
// ---------------------------------------------------------------------------

test("the breakpoint anchors are read from the token, never restated as literals", async () => {
  // The point of adding `breakpoint/*` was not to have the numbers written down — it was to
  // stop having them written down THREE times. 360/768/1280 were literals in legacy-ds-css.mjs
  // and figma-variables.mjs, with nothing to catch a drift between them. If a literal comes
  // back, this fails and the token is decorative again.
  const { readFileSync } = await import("node:fs");
  const offenders = [];
  for (const file of ["build/formats/legacy-ds-css.mjs", "build/formats/figma-variables.mjs"]) {
    const src = readFileSync(root + file, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")      // block comments explain the numbers; that is fine
      .replace(/\/\/.*$/gm, "");
    for (const n of ["360", "768", "1280"]) {
      if (new RegExp(`(?<![\\d.])${n}(?![\\d.])`).test(src)) offenders.push(`${file} still hardcodes ${n}`);
    }
  }
  assert.deepEqual(offenders, [], offenders.join("\n  "));
});

test("a font size step resolves to the size scale, not to its own literal", async () => {
  // UX4G's `fs-16 -> size-16` relationship, adopted. Without it the same px value has two
  // definitions and they drift — which is exactly how `--sa-type-display-size` (fixed) ended
  // up shadowing `--sa-type-display-1-size` (fluid).
  const { index } = await import("../build/token-index.mjs");
  const { readFileSync } = await import("node:fs");
  const src = JSON.parse(readFileSync(root + "src/primitive.json", "utf8"));
  const bad = [];
  for (const [step, node] of Object.entries(src.font.size)) {
    if (step.startsWith("$")) continue;
    const v = node.$value;
    if (typeof v !== "string" || !v.startsWith("{size.")) bad.push(`font/size/${step} = ${v}`);
  }
  assert.deepEqual(
    bad,
    [],
    `${bad.length} font size step(s) carry their own literal instead of aliasing size/*:\n  ${bad.join("\n  ")}`,
  );
  assert.ok(index, "token index import kept for parity with the rest of this file");
});

// ---------------------------------------------------------------------------
// The six gaps closed on 2026-08-10 stay closed.
// ---------------------------------------------------------------------------

/**
 * Each of these existed as a hardcoded literal somewhere before it was a token, which is the
 * failure mode a token system is supposed to remove. A test is cheaper than rediscovering it.
 */
test("the semantic layers that replaced hardcoded values are all present", () => {
  const required = [
    // Every component needed an icon size and none had a token, so each hardcoded its own.
    // Renamed 2026-08-12 to the pixel value, and narrowed to the four sizes DBIM 3.4 sanctions.
    "--sa-icon-size-24", "--sa-icon-size-32", "--sa-icon-size-48", "--sa-icon-size-64",
    // The focus ring's COLOUR was tokenised long before its geometry (WCAG 2.4.7).
    "--sa-focus-ring", "--sa-focus-width", "--sa-focus-offset",
    // CLAUDE.md mandates a 1280px content width; it lived only as a literal.
    "--sa-container-content",
    // The raw shadow ramp had no semantic layer, so depth was chosen by eye per component.
    "--sa-elevation-card", "--sa-elevation-dropdown", "--sa-elevation-modal",
    // A duration alone is not a decision — the pairing with its easing is.
    "--sa-motion-enter-duration", "--sa-motion-enter-easing",
    "--sa-motion-exit-duration", "--sa-motion-exit-easing",
    // Density moved a control's SIZE; its SHAPE was still hardcoded.
    "--sa-control-radius", "--sa-control-border-width",
  ];
  const missing = required.filter((n) => !declared.has(n));
  assert.deepEqual(missing, [], `${missing.length} semantic token(s) are gone:\n  ${missing.join("\n  ")}`);
});

test("motion intents keep their duration and easing paired", () => {
  // The whole point of the intent layer. A duration without its easing is the bare primitive
  // wearing a semantic name, which is worse than not having the layer.
  for (const intent of ["enter", "exit", "emphasis"]) {
    assert.ok(declared.has(`--sa-motion-${intent}-duration`), `motion/${intent} has no duration`);
    assert.ok(declared.has(`--sa-motion-${intent}-easing`), `motion/${intent} has no easing`);
  }
});

test("elevation is CSS-only, and the exporter says why", async () => {
  // Figma models shadows as EFFECT STYLES, not variables, so `elevation/*` cannot become a
  // Figma variable. That is a modelling fact, not an oversight — assert the exclusion is
  // REPORTED rather than silent, because an unexplained omission reads as a bug.
  const { readFileSync } = await import("node:fs");
  const payload = JSON.parse(readFileSync(root + "dist/figma.variables.json", "utf8"));
  const excluded = payload.unmapped.filter((u) => u.startsWith("elevation/"));
  assert.ok(excluded.length >= 6, `expected elevation/* to be reported as unmapped, found ${excluded.length}`);
  for (const e of excluded) {
    assert.match(e, /EFFECT STYLES/, `elevation exclusion must state the reason: ${e}`);
  }
});
