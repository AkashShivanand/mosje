/**
 * WCAG 2.1 relative-luminance and contrast maths.
 *
 * Lives in `build/` rather than `test/lib/` because the BUILD now needs it: the Figma
 * exporter measures a token before it will publish a contrast class for it, and a build
 * step must not import from the test tree. `test/lib/contrast.mjs` re-exports these, so
 * the gates and the exporter agree by construction rather than by two copies staying
 * accidentally identical.
 */

export function hexToRgb(h) {
  h = h.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function relLum([r, g, b]) {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const [R, G, B] = [f(r), f(g), f(b)];
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrast(a, b) {
  const l1 = relLum(hexToRgb(a));
  const l2 = relLum(hexToRgb(b));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
