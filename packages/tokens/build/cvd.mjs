/**
 * Colour-vision-deficiency simulation.
 *
 * Charts are the one place in the estate where colour carries DATA rather than
 * decoration. Everywhere else a hue that is hard to distinguish is a nuisance;
 * on a twelve-series chart it means two different schemes are the same line.
 * Around 1 in 12 men has some form of red-green deficiency, so on a national
 * citizen portal this is a population in the millions, not an edge case.
 *
 * The matrices are Machado, Oliveira and Fernandes (2009), "A Physiologically-
 * based Model for Simulation of Color Vision Deficiency", at severity 1.0 —
 * the same set Chrome DevTools and Figma use. They are defined over LINEAR RGB,
 * so the sRGB transfer function has to come off before they are applied and go
 * back on afterwards. Applying them to gamma-encoded values (an easy mistake,
 * because it still produces plausible-looking colours) overstates separation and
 * would make this gate too permissive.
 *
 * Deficiency is simulated, never "corrected". The output is what a viewer with
 * that deficiency perceives, which is what the separation rules must hold for.
 */

const MATRICES = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

/** The three dichromacies this estate checks. */
export const CVD_TYPES = Object.keys(MATRICES);

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp01 = (n) => Math.min(1, Math.max(0, n));

function parseHex(hex) {
  const h = hex.trim().replace(/^#/, "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
}

const toHex = (rgb) =>
  "#" +
  rgb
    .map((c) => Math.round(clamp01(c) * 255).toString(16).padStart(2, "0"))
    .join("");

/**
 * How `hex` appears to a viewer with the given dichromacy.
 * @param {string} hex  `#rrggbb` or `#rgb`
 * @param {"protanopia"|"deuteranopia"|"tritanopia"} type
 * @returns {string} `#rrggbb`
 */
export function simulateCvd(hex, type) {
  const m = MATRICES[type];
  if (!m) throw new Error(`unknown CVD type: ${type}`);
  const lin = parseHex(hex).map(srgbToLinear);
  const out = m.map((row) => row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]);
  return toHex(out.map((c) => linearToSrgb(clamp01(c))));
}
