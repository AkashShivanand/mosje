/* ============================================================================
   Dependency-free scales + tick math. Replaces d3-scale for our needs.
   ============================================================================ */

export interface LinearScale {
  (value: number): number;
  invert(pixel: number): number;
}

/** Map a numeric domain onto a pixel range linearly. */
export function linearScale(domain: [number, number], range: [number, number]): LinearScale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  const fn = ((v: number) => r0 + ((v - d0) / span) * (r1 - r0)) as LinearScale;
  fn.invert = (p: number) => d0 + ((p - r0) / (r1 - r0 || 1)) * span;
  return fn;
}

export interface BandScale {
  (key: string): number;
  bandwidth(): number;
  step(): number;
}

/** Map discrete categories onto evenly-spaced bands with inner padding. */
export function bandScale(domain: string[], range: [number, number], padding = 0.2): BandScale {
  const [r0, r1] = range;
  const n = Math.max(1, domain.length);
  const step = (r1 - r0) / n;
  const band = step * (1 - padding);
  const offset = (step - band) / 2;
  const map = new Map(domain.map((d, i) => [d, r0 + i * step + offset]));
  const fn = ((key: string) => map.get(key) ?? r0) as BandScale;
  fn.bandwidth = () => band;
  fn.step = () => step;
  return fn;
}

function niceNum(range: number, round: boolean): number {
  const exp = Math.floor(Math.log10(range || 1));
  const frac = (range || 1) / Math.pow(10, exp);
  let nice: number;
  if (round) nice = frac < 1.5 ? 1 : frac < 3 ? 2 : frac < 7 ? 5 : 10;
  else nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  return nice * Math.pow(10, exp);
}

/**
 * Human-friendly tick values spanning [min, max] (e.g. 0, 25, 50, 75, 100).
 *
 * `tight` rounds the STEP from the raw range rather than from a rounded-up range, so the axis
 * ends at the first step past the highest figure: 0–70 for a top value of 61, where the
 * default reaches 100. Charts that take a `tickCount` use it; the default is unchanged.
 */
export function niceTicks(min: number, max: number, count = 4, tight = false): number[] {
  if (max <= min) max = min + 1;
  const range = tight ? max - min : niceNum(max - min, false);
  const step = niceNum(range / Math.max(1, count - 1), true) || 1;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step / 2; v += step) ticks.push(Number(v.toFixed(6)));
  return ticks;
}

/** Rounded upper bound for an axis given a raw max. */
export function niceMax(max: number, count = 4): number {
  const ticks = niceTicks(0, max, count);
  return ticks[ticks.length - 1] ?? Math.max(1, max);
}

/**
 * An SVG path through `points` (sorted by x) as a monotone cubic — the curve passes through
 * every point and never overshoots between two of them, so a smoothed line cannot invent a
 * peak or a dip the figures do not have (Fritsch–Carlson; the same curve as d3's
 * `curveMonotoneX`). Fewer than three points draw straight.
 */
export function monotonePath(points: ReadonlyArray<readonly [number, number]>): string {
  const n = points.length;
  const f = (v: number) => v.toFixed(2);
  if (n < 3) return points.map(([px, py], i) => `${i === 0 ? "M" : "L"} ${f(px)} ${f(py)}`).join(" ");
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i]!;
    const [x1, y1] = points[i + 1]!;
    dx.push(x1 - x0 || 1);
    slope.push((y1 - y0) / (x1 - x0 || 1));
  }
  const m: number[] = [slope[0]!];
  for (let i = 1; i < n - 1; i++) {
    const a = slope[i - 1]!;
    const b = slope[i]!;
    m.push(a * b <= 0 ? 0 : (3 * (dx[i - 1]! + dx[i]!)) / ((2 * dx[i]! + dx[i - 1]!) / a + (dx[i]! + 2 * dx[i - 1]!) / b));
  }
  m.push(slope[n - 2]!);
  let d = `M ${f(points[0]![0])} ${f(points[0]![1])}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i]!;
    const [x1, y1] = points[i + 1]!;
    const h = dx[i]! / 3;
    d += ` C ${f(x0 + h)} ${f(y0 + m[i]! * h)} ${f(x1 - h)} ${f(y1 - m[i + 1]! * h)} ${f(x1)} ${f(y1)}`;
  }
  return d;
}
