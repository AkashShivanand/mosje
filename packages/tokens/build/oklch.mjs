/**
 * OKLab / OKLCH conversions and sRGB gamut mapping.
 *
 * WHY THIS EXISTS
 * ---------------
 * Ramps used to be hand-picked, and the 2026-08-11 colour audit measured what that cost:
 * `danger/400` and `danger/500` were 1.8 L* apart (one colour wearing two names), the Navy
 * primary ramp dropped 27.4 L* in a single step and then crammed five rungs into fifteen
 * points, and the 400 -> 500 transition behaved seven different ways across seven ramps.
 *
 * None of that is visible in sRGB hex, which is why it survived years of review. It is
 * obvious in OKLCH, where lightness is perceptually uniform: a ramp is good when its L*
 * steps are even, its hue holds, and its chroma follows one arc.
 *
 * OKLab is used rather than CIELAB because its hue lines stay straight through the blues —
 * CIELAB famously bends blue toward purple as it darkens, which would have made the navy
 * ramp drift exactly where this system needs it not to.
 */

/* ------------------------------------------------------------------ sRGB <-> linear */

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toGamma = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

/** `#rgb` or `#rrggbb` -> [r, g, b] in 0..1 (gamma-encoded sRGB). */
export function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

/** [r, g, b] in 0..1 -> `#rrggbb`. Values outside 0..1 are clamped, not wrapped. */
export function rgbToHex([r, g, b]) {
  const to = (v) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/* ------------------------------------------------------------------ sRGB <-> OKLab */

/** Gamma-encoded sRGB -> OKLab. L is returned 0..100 to match the L* everyone quotes. */
export function rgbToOklab([r0, g0, b0]) {
  const r = toLinear(r0);
  const g = toLinear(g0);
  const b = toLinear(b0);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return {
    L: (0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s) * 100,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

/** OKLab (L in 0..100) -> gamma-encoded sRGB. May return values outside 0..1 (out of gamut). */
export function oklabToRgb({ L, a, b }) {
  const L0 = L / 100;
  const l = (L0 + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L0 - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L0 - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/* ------------------------------------------------------------------ OKLCH */

/** `#rrggbb` -> { L (0..100), C, H (degrees 0..360) }. */
export function hexToOklch(hex) {
  const { L, a, b } = rgbToOklab(hexToRgb(hex));
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C: Math.hypot(a, b), H };
}

/** { L, C, H } -> gamma-encoded sRGB, possibly out of gamut. */
export function oklchToRgb({ L, C, H }) {
  const rad = (H * Math.PI) / 180;
  return oklabToRgb({ L, a: C * Math.cos(rad), b: C * Math.sin(rad) });
}

const EPS = 1e-7;
const inGamut = ([r, g, b]) =>
  r >= -EPS && r <= 1 + EPS && g >= -EPS && g <= 1 + EPS && b >= -EPS && b <= 1 + EPS;

/**
 * { L, C, H } -> the nearest in-gamut `#rrggbb`, holding L and H and reducing C.
 *
 * Chroma-reduction is the right gamut strategy for a token ramp: lightness carries the
 * contrast guarantee and hue carries the identity, so neither may be traded away. A colour
 * that cannot be reached at full chroma becomes a slightly duller version of itself, never
 * a lighter or differently-hued one.
 */
export function oklchToHex({ L, C, H }) {
  if (inGamut(oklchToRgb({ L, C, H }))) return rgbToHex(oklchToRgb({ L, C, H }));
  let lo = 0;
  let hi = C;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToRgb({ L, C: mid, H }))) lo = mid;
    else hi = mid;
  }
  return rgbToHex(oklchToRgb({ L, C: lo, H }));
}

/* ------------------------------------------------------------------ perceptual distance */

/** Signed shortest angular distance between two hues, in degrees (-180..180]. */
export function hueDelta(h1, h2) {
  return ((h2 - h1 + 540) % 360) - 180;
}

/**
 * Perceptual distance in OKLab, scaled so it reads on the same order as CIEDE2000.
 *
 * Used by the hue-separation gate. Plain hue distance is not enough on its own: red and
 * orange are adjacent hues and can never be pulled far apart in H, but a dark red and a
 * bright saffron are still unmistakable because they differ in lightness. Distance has to
 * account for all three axes or the gate would demand something the hue circle cannot give.
 */
export function deltaE(hexA, hexB) {
  const a = rgbToOklab(hexToRgb(hexA));
  const b = rgbToOklab(hexToRgb(hexB));
  // a/b channels are ~0..0.4 while L is 0..100, so scale chroma to comparable units.
  const dL = a.L - b.L;
  const da = (a.a - b.a) * 100;
  const db = (a.b - b.b) * 100;
  return Math.hypot(dL, da, db);
}
