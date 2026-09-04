/**
 * Figma may only carry an effect the stylesheet actually renders.
 *
 * NINETY-SIX SHADOWS SURVIVED EVERY GATE IN THIS REPO. Drop shadows on `Filled/Hover` and
 * resting shadows on outlined and text buttons, inherited from the UX4G set the estate
 * descends from and then multiplied by a 45 -> 180 -> 360 variant rebuild, because a clone
 * brings its parent's effects with it. Nothing noticed, because nothing compared Figma's
 * effects to the code's `box-shadow` — `check:code-connect` verifies PROPERTIES, and
 * `check:ds-pages` verifies documentation. A designer building from the library would have
 * drawn an elevation the estate has never rendered.
 *
 * A test cannot call Figma, so `effects.json` is the recorded design side, captured through
 * the Plugin API. This gate asserts two things about it:
 *
 *   1. Every effect recorded is on a state the CSS draws one for. Today that is `Focused`
 *      and nothing else — the focus ring. Hover is `filter: brightness()`, and every other
 *      state paints with colour alone.
 *   2. The stylesheet still says so. If someone adds a `box-shadow` to button.css, the
 *      fixture stops describing the code and this gate says which side moved.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const FIXTURE = join(ROOT, "tools/figma-effects/effects.json");
const CSS = join(ROOT, "packages/design-system/components/actions/button.css");

const raw = JSON.parse(readFileSync(FIXTURE, "utf8"));
const components = Object.fromEntries(Object.entries(raw).filter(([k]) => !k.startsWith("$")));
const css = readFileSync(CSS, "utf8");
const code = css.replace(/\/\*[\s\S]*?\*\//g, "");

const findings = [];

/*
 * Which states may carry an effect at all. `Focused` is the only one: the ring is drawn in
 * Figma as a 4px spread of #0373df at 48%, which is exactly --sa-focus-ring. Everything
 * else in this component paints with colour, a filter, or an outline.
 */
const ALLOWED_STATES = new Set(["Focused"]);

for (const [name, spec] of Object.entries(components)) {
  const byState = spec.effectsByState ?? {};
  for (const [state, count] of Object.entries(byState)) {
    if (!ALLOWED_STATES.has(state)) {
      findings.push(
        `${name}: ${count} variant(s) carry an effect on State=${state}, and the stylesheet ` +
        `renders no shadow there. Either remove it in Figma or add the rule to the CSS.`,
      );
    }
  }
}

/*
 * The other direction. A `box-shadow` in the component's own rules would mean the fixture
 * has stopped describing the code. `forced-colors` is exempt: it sets `box-shadow: none`,
 * which is a removal rather than an elevation.
 */
const shadowDecls = [...code.matchAll(/box-shadow:\s*([^;]+);/g)]
  .map((m) => m[1].trim())
  .filter((v) => v !== "none");
if (shadowDecls.length) {
  findings.push(
    `button.css declares ${shadowDecls.length} non-none box-shadow(s) — ${shadowDecls.join(" · ")}. ` +
    `The Figma fixture records effects only on Focused, so one side has moved.`,
  );
}

if (findings.length) {
  console.error(`\n✖ figma effects: ${findings.length} mismatch(es) between the library and the stylesheet:\n`);
  for (const f of findings) console.error(`   ${f}`);
  console.error(
    `\n   Re-capture the fixture with the Plugin API after changing a master's effects.\n` +
    `   A component with no entry is reported, never silently passed.\n`,
  );
  process.exit(1);
}

const missing = ["Button", "IconButton", "ButtonGroup", "Link"].filter((n) => !components[n]);
for (const n of missing) console.log(`  • no effects fixture for \`${n}\` — its Figma effects are NOT verified`);
console.log(
  `✔ figma effects: ${Object.keys(components).length} set(s) recorded, effects only where the stylesheet draws them.`,
);
