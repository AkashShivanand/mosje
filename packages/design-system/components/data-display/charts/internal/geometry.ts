/* Shared SVG arc geometry for pie / donut / gauge segments. */

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
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
