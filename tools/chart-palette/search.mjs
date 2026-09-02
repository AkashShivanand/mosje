/**
 * How many categorical slots can this estate ACTUALLY have?
 *
 * Not a palette generator — a feasibility measurement. The question "why only
 * four?" deserves an answer better than "the current twelve are bad", so this
 * searches the whole admissible region and reports the largest mutually
 * distinguishable set it can find, under every constraint at once.
 *
 * The binding constraint is colour-vision deficiency. A dichromat's gamut is
 * effectively two-dimensional, so hues that are far apart for full colour
 * vision collapse onto each other — which is why the answer is not twelve and
 * cannot be made twelve by choosing better colours.
 */
import { CVD_KINDS, chroma, contrast, deltaE, lightness, simulate } from "./colour.mjs";

const SURFACES = ["#ffffff", "#eef0f3"];
const SEMANTIC_INKS = ["#046a38", "#cb3f33", "#6f757d"];

const L_BAND = [0.45, 0.75];
const C_FLOOR = 0.1;
const NORMAL_FLOOR = 15;
const CVD_FLOOR = 8;
const SURFACE_CONTRAST = 3;
const INK_SEPARATION = 12;
/** A chroma ceiling keeps the ramp inside a government register — no neon. */
const C_CEIL = Number(process.env.C_CEIL ?? 0.32);

/** OKLCH → sRGB hex, or null when the colour is outside the gamut. */
function oklchToHex(L, C, Hdeg) {
  const h = (Hdeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const [l, m, s] = [l_ ** 3, m_ ** 3, s_ ** 3];
  const lin = [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  if (lin.some((v) => v < -0.001 || v > 1.001)) return null; // out of sRGB
  const g = (v) => {
    const c = Math.min(1, Math.max(0, v));
    return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
  };
  return "#" + lin.map((v) => Math.round(g(v) * 255).toString(16).padStart(2, "0")).join("");
}

/** Every colour that could legally be a categorical slot. */
function admissible() {
  const out = [];
  for (let L = L_BAND[0]; L <= L_BAND[1] + 1e-9; L += 0.025) {
    for (let C = C_FLOOR; C <= 0.32; C += 0.01) {
      for (let H = 0; H < 360; H += 4) {
        const hex = oklchToHex(L, C, H);
        if (!hex) continue;
        const ch = chroma(hex);
        if (ch < C_FLOOR || ch > C_CEIL) continue;
        const l = lightness(hex);
        if (l < L_BAND[0] || l > L_BAND[1]) continue;
        if (SURFACES.some((s) => contrast(hex, s) < SURFACE_CONTRAST)) continue;
        if (SEMANTIC_INKS.some((ink) => deltaE(hex, ink) < INK_SEPARATION)) continue;
        out.push(hex);
      }
    }
  }
  return [...new Set(out)];
}

/** Distinguishable for EVERY vision model we test. */
function ok(a, b) {
  if (deltaE(a, b) < NORMAL_FLOOR) return false;
  for (const k of CVD_KINDS) if (deltaE(simulate(a, k), simulate(b, k)) < CVD_FLOOR) return false;
  return true;
}

const pool = admissible();
console.log(`admissible colours under every constraint: ${pool.length}`);

/**
 * Farthest-point greedy from many seeds. Exact maximum-clique here is
 * intractable, so this is a lower bound — a set it FOUND, not a set it proved
 * optimal. Reported as such.
 */
let best = [];
const seeds = pool.filter((_, i) => i % Math.max(1, Math.floor(pool.length / 400)) === 0);
for (const seed of seeds) {
  const chosen = [seed];
  let pass = true;
  while (pass) {
    pass = false;
    let bestCand = null;
    let bestScore = -1;
    for (const c of pool) {
      if (chosen.includes(c)) continue;
      if (!chosen.every((x) => ok(x, c))) continue;
      // prefer the candidate that keeps the most room for the next one
      const score = Math.min(...chosen.map((x) => deltaE(x, c)));
      if (score > bestScore) { bestScore = score; bestCand = c; }
    }
    if (bestCand) { chosen.push(bestCand); pass = true; }
  }
  if (chosen.length > best.length) best = chosen;
}

console.log(`largest mutually distinguishable set FOUND: ${best.length}`);
console.log(best.join(", "));
const worst = { normal: Infinity };
for (let i = 0; i < best.length; i += 1)
  for (let j = i + 1; j < best.length; j += 1) {
    worst.normal = Math.min(worst.normal, deltaE(best[i], best[j]));
    for (const k of CVD_KINDS)
      worst[k] = Math.min(worst[k] ?? Infinity, deltaE(simulate(best[i], k), simulate(best[j], k)));
  }
console.log("worst all-pairs:", Object.entries(worst).map(([k, v]) => `${k} ${v.toFixed(1)}`).join(" · "));
