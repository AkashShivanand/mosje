#!/usr/bin/env node
/**
 * check:chart-palette — the estate's categorical chart ramp, MEASURED.
 *
 * WHY THIS EXISTS. Colour is the only thing distinguishing one series from
 * another on a chart, and whether two colours are actually distinguishable is
 * computable — so it must be computed, not judged by eye on a designer's
 * calibrated monitor. The estate had twenty-odd gates pointed at token drift
 * and none at this. The first run found `#930121` and `#594d00` sitting at
 * **OKLab ΔE 1.5 under deuteranopia**: the same colour, to roughly one man in
 * twelve, on a Government of India dashboard.
 *
 * WHAT IT CHECKS, and what each failure costs a reader:
 *
 *   lightness band   a slot too dark or too light for the ramp reads as
 *                    emphasis rather than as another category
 *   chroma floor     a slot below the floor reads as grey, which every chart
 *                    in this estate already uses to mean "no data"
 *   CVD separation   the pair a colour-blind reader cannot separate
 *   normal-vision    the pair NOBODY can separate — the hard failure, and the
 *                    one secondary encoding does not excuse
 *   contrast         a mark that does not clear 3:1 on the chart surface is
 *                    not visible as a mark at all (WCAG 1.4.11)
 *
 * ADJACENT vs ALL PAIRS. Slots are assigned in fixed order, so a two-series
 * chart uses 1 and 2 and an adjacent-pair test is the honest one for it. But a
 * FILTERED chart draws whatever survived the filter — slots 4 and 10 with
 * nothing between them — so `--pairs all` is the test that matches what this
 * estate's dashboards actually render. Both are reported; the baseline pins
 * both.
 *
 * A RATCHET, not a sweep. Re-deriving twelve slots that satisfy all five checks
 * AND the estate's own six token contract tests was attempted and reverted: the
 * candidates that cleared this file failed `on-pair-contrast.test.mjs`. So the
 * debt is frozen and may only shrink. A worst-case that DROPS fails as a
 * regression; one that IMPROVES also fails, telling you to re-baseline in the
 * same change — so one chart's cleanup cannot be spent silently on another's.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CVD_KINDS, chroma, contrast, deltaE, lightness, simulate } from "./colour.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const TOKENS = path.join(ROOT, "packages/design-system/tokens.css");
const BASELINE = path.join(HERE, "baseline.json");

/** Inferred from the reference validator's own flags — see the audit doc. */
const LIGHTNESS_BAND = [0.45, 0.75];
const CHROMA_FLOOR = 0.1;
const CVD_FLOOR = 8;
const NORMAL_FLOOR = 15;
const CONTRAST_FLOOR = 3;

/**
 * Read the ramp from the GENERATED token file, never from a second copy.
 *
 * Only the first `:root` block is read: `tokens.css` re-declares many tokens
 * under `[data-theme]`, and taking the last match would silently measure the
 * dark ramp against the light surface.
 */
function readPalette() {
  const css = fs.readFileSync(TOKENS, "utf8");
  const head = css.slice(0, css.search(/\[data-theme|@media/) >>> 0 || css.length);
  const slots = [];
  for (let i = 1; ; i += 1) {
    const m = head.match(new RegExp(`--sa-chart-cat-${i}:\\s*(#[0-9a-fA-F]{3,6})`));
    if (!m) break;
    slots.push({ token: `--sa-chart-cat-${i}`, hex: m[1].toLowerCase() });
  }
  const surface = head.match(/--sa-bg-neutral-base:\s*(#[0-9a-fA-F]{3,6})/);
  if (!slots.length) throw new Error(`no --sa-chart-cat-* tokens found in ${TOKENS}`);
  if (!surface) throw new Error(`--sa-bg-neutral-base not found in ${TOKENS}`);
  return { slots, surface: surface[1].toLowerCase() };
}

function worstPair(slots, everyPair, transform) {
  let worst = null;
  for (let i = 0; i < slots.length; i += 1) {
    const upto = everyPair ? slots.length : Math.min(i + 2, slots.length);
    for (let j = i + 1; j < upto; j += 1) {
      const d = deltaE(transform(slots[i].hex), transform(slots[j].hex));
      if (!worst || d < worst.deltaE) {
        worst = { a: slots[i].token, b: slots[j].token, deltaE: +d.toFixed(2) };
      }
    }
  }
  return worst;
}

function measure() {
  const { slots, surface } = readPalette();
  const id = (h) => h;

  const outOfBand = slots
    .filter((s) => lightness(s.hex) < LIGHTNESS_BAND[0] || lightness(s.hex) > LIGHTNESS_BAND[1])
    .map((s) => s.token);
  const belowChroma = slots.filter((s) => chroma(s.hex) < CHROMA_FLOOR).map((s) => s.token);
  const belowContrast = slots.filter((s) => contrast(s.hex, surface) < CONTRAST_FLOOR).map((s) => s.token);

  const pairs = {};
  for (const scope of ["adjacent", "all"]) {
    const every = scope === "all";
    pairs[scope] = { normal: worstPair(slots, every, id) };
    for (const kind of CVD_KINDS) {
      pairs[scope][kind] = worstPair(slots, every, (h) => simulate(h, kind));
    }
  }

  return { slotCount: slots.length, surface, outOfBand, belowChroma, belowContrast, pairs };
}

/** How many leading slots satisfy every floor under all-pairs — the safe cap. */
function safeCap(m) {
  const { slots } = readPalette();
  for (let n = slots.length; n >= 2; n -= 1) {
    const head = slots.slice(0, n);
    const ok =
      worstPair(head, true, (h) => h).deltaE >= NORMAL_FLOOR &&
      CVD_KINDS.every((k) => worstPair(head, true, (h) => simulate(h, k)).deltaE >= CVD_FLOOR);
    if (ok) return n;
  }
  return 1;
}

const args = new Set(process.argv.slice(2));
const measured = measure();
measured.safeCap = safeCap(measured);

if (args.has("--report")) {
  const { pairs } = measured;
  console.log(`Chart categorical ramp — ${measured.slotCount} slots on ${measured.surface}\n`);
  for (const scope of ["adjacent", "all"]) {
    console.log(`  ${scope} pairs:`);
    for (const [kind, w] of Object.entries(pairs[scope])) {
      const floor = kind === "normal" ? NORMAL_FLOOR : CVD_FLOOR;
      const mark = w.deltaE >= floor ? "ok  " : "FAIL";
      console.log(`    ${mark} ${kind.padEnd(7)} ΔE ${String(w.deltaE).padStart(5)}  ${w.a} ↔ ${w.b}`);
    }
  }
  console.log(`\n  outside lightness band [${LIGHTNESS_BAND}]: ${measured.outOfBand.join(", ") || "none"}`);
  console.log(`  below chroma floor ${CHROMA_FLOOR}: ${measured.belowChroma.join(", ") || "none"}`);
  console.log(`  below ${CONTRAST_FLOOR}:1 on surface: ${measured.belowContrast.join(", ") || "none"}`);
  console.log(`\n  SAFE CAP: ${measured.safeCap} slots clear every floor under all-pairs.`);
  process.exit(0);
}

if (args.has("--baseline")) {
  fs.writeFileSync(BASELINE, JSON.stringify(measured, null, 2) + "\n");
  console.log(`✔ chart-palette: baseline written — ${measured.slotCount} slots, safe cap ${measured.safeCap}.`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.error("✖ chart-palette: no baseline. Run `npm run check:chart-palette:baseline`.");
  process.exit(1);
}
const base = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
const problems = [];
const EPS = 0.05;

for (const scope of ["adjacent", "all"]) {
  for (const kind of ["normal", ...CVD_KINDS]) {
    const now = measured.pairs[scope][kind];
    const was = base.pairs?.[scope]?.[kind];
    if (!was) { problems.push(`${scope}/${kind} is not in the baseline — re-baseline.`); continue; }
    if (now.deltaE < was.deltaE - EPS) {
      problems.push(
        `${scope}/${kind} separation FELL to ΔE ${now.deltaE} (${now.a} ↔ ${now.b}), from ${was.deltaE}. ` +
          `Two series just became harder to tell apart.`,
      );
    } else if (now.deltaE > was.deltaE + EPS) {
      problems.push(
        `${scope}/${kind} separation IMPROVED to ΔE ${now.deltaE}, from ${was.deltaE}. ` +
          `Re-baseline in this change so the gain cannot be given back later.`,
      );
    }
  }
}
for (const [key, label] of [
  ["outOfBand", "outside the lightness band"],
  ["belowChroma", "below the chroma floor"],
  ["belowContrast", `below ${CONTRAST_FLOOR}:1 on the chart surface`],
]) {
  const now = new Set(measured[key]);
  const was = new Set(base[key] ?? []);
  for (const t of now) if (!was.has(t)) problems.push(`${t} is now ${label}.`);
  for (const t of was) if (!now.has(t)) problems.push(`${t} is no longer ${label} — re-baseline.`);
}
if (measured.safeCap !== base.safeCap) {
  problems.push(
    `the safe cap moved ${base.safeCap} → ${measured.safeCap}. ` +
      `\`CHART_CATEGORICAL_SAFE_CAP\` in charts/types.ts must match, and re-baseline.`,
  );
}

if (problems.length) {
  console.error(`✖ chart-palette: ${problems.length} problem(s).`);
  for (const p of problems) console.error(`    ${p}`);
  process.exitCode = 1;
} else {
  const a = measured.pairs.all;
  const worstCvd = CVD_KINDS.map((k) => a[k]).sort((x, y) => x.deltaE - y.deltaE)[0];
  console.log(
    `✔ chart-palette: ${measured.slotCount} slots, safe cap ${measured.safeCap} — ` +
      `worst all-pairs ΔE ${a.normal.deltaE} normal, ${worstCvd.deltaE} CVD; all declared in the baseline.`,
  );
}
