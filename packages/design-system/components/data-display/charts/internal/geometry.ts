/* Shared SVG arc geometry for pie / donut / gauge segments. */

/**
 * Coordinates are quantised before they reach a path string, and that is not a
 * tidiness measure — it is what makes these charts survive server rendering.
 *
 * ECMAScript does not require `Math.cos`/`Math.sin` to be correctly rounded, so
 * Node and the browser may disagree in the last bit. That difference reaches
 * the DOM as a different `d` attribute — `…60.500836139208566…` server-side
 * against `…60.50083613920856…` in the client — and React reports a hydration
 * mismatch it explicitly will not patch up. It surfaced the first time a
 * PieChart was rendered on a server-rendered page.
 *
 * Three decimals on a 200-unit viewBox is a thousandth of a unit: far below any
 * visual threshold, and deterministic across runtimes.
 */
const PRECISION = 1000;
const q = (n: number): number => Math.round(n * PRECISION) / PRECISION;

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: q(cx + r * Math.cos(a)), y: q(cy + r * Math.sin(a)) };
}

/** Filled pie slice (wedge to centre). Angles in degrees, clockwise from top. */
export function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  if (endAngle - startAngle >= 359.999) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`;
  }
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

/** Donut ring segment between inner radius r0 and outer radius r1. */
export function ringPath(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle;
  const largeArc = sweep <= 180 ? 0 : 1;
  const oStart = polarToCartesian(cx, cy, r1, endAngle);
  const oEnd = polarToCartesian(cx, cy, r1, startAngle);
  const iStart = polarToCartesian(cx, cy, r0, startAngle);
  const iEnd = polarToCartesian(cx, cy, r0, endAngle);
  if (sweep >= 359.999) {
    // Full ring — draw as two halves to avoid a degenerate arc.
    const oMid = polarToCartesian(cx, cy, r1, startAngle + 180);
    const iMid = polarToCartesian(cx, cy, r0, startAngle + 180);
    return [
      `M ${oEnd.x} ${oEnd.y}`,
      `A ${r1} ${r1} 0 0 0 ${oMid.x} ${oMid.y}`,
      `A ${r1} ${r1} 0 0 0 ${oEnd.x} ${oEnd.y}`,
      `M ${iEnd.x} ${iEnd.y}`,
      `A ${r0} ${r0} 0 0 1 ${iMid.x} ${iMid.y}`,
      `A ${r0} ${r0} 0 0 1 ${iEnd.x} ${iEnd.y}`,
      "Z",
    ].join(" ");
  }
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${r1} ${r1} 0 ${largeArc} 0 ${oEnd.x} ${oEnd.y}`,
    `L ${iStart.x} ${iStart.y}`,
    `A ${r0} ${r0} 0 ${largeArc} 1 ${iEnd.x} ${iEnd.y}`,
    "Z",
  ].join(" ");
}
