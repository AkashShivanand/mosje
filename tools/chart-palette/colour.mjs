/**
 * The colour maths behind `check:chart-palette`, in the repo rather than in a
 * tool someone has to remember to run.
 *
 * Every function here is pure and takes a hex string, so the gate's numbers can
 * be reproduced by hand from the token file alone.
 */

/** #rgb or #rrggbb → [r, g, b] in 0–1 sRGB. */
export function hexToRgb(hex) {
  const h = hex.trim().replace(/^#/, "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`not a hex colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
}

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

export const linearise = (rgb) => rgb.map(toLinear);

/**
 * Linear sRGB → OKLab. Björn Ottosson's coefficients, unmodified.
 *
 * OKLab and not CIELab because OKLab is perceptually uniform for the saturated
 * mid-tones a categorical ramp is made of, which is exactly where CIELab's
 * hue-linearity breaks down and reports two visibly different blues as close.
 */
export function linearToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export const oklab = (hex) => linearToOklab(linearise(hexToRgb(hex)));

/** OKLab chroma — how far from grey. A near-zero chroma reads as grey. */
export const chroma = (hex) => {
  const [, a, b] = oklab(hex);
  return Math.hypot(a, b);
};

/** OKLab lightness, 0–1. */
export const lightness = (hex) => oklab(hex)[0];

/**
 * Perceptual distance, OKLab euclidean x100.
 *
 * The x100 is the scale every threshold in this file is quoted on, so a "ΔE 8"
 * here is 0.08 in raw OKLab units. Keep the two together or the numbers stop
 * meaning anything.
 */
export const deltaE = (h1, h2) => {
  const [a, b] = [oklab(h1), oklab(h2)];
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) * 100;
};

/**
 * Machado, Oliveira & Fernandes (2009) colour-vision-deficiency simulation, at
 * full severity. Operates on LINEAR rgb — applying it to gamma-encoded values
 * is the usual mistake and it makes every pair look further apart than it is.
 */
const CVD = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

export const CVD_KINDS = Object.keys(CVD);

/** Simulate `kind` and return a hex, so a result can be pasted into a swatch. */
export function simulate(hex, kind) {
  const lin = linearise(hexToRgb(hex));
  const m = CVD[kind];
  const out = m.map((row) => row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]);
  return (
    "#" +
    out
      .map((c) => {
        const v = Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, c))))) * 255);
        return v.toString(16).padStart(2, "0");
      })
      .join("")
  );
}

/** WCAG 2.x relative luminance. */
export function luminance(hex) {
  const [r, g, b] = linearise(hexToRgb(hex));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, 1–21. */
export function contrast(h1, h2) {
  const [a, b] = [luminance(h1), luminance(h2)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
