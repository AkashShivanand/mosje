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

/** Human-friendly tick values spanning [min, max] (e.g. 0, 25, 50, 75, 100). */
export function niceTicks(min: number, max: number, count = 4): number[] {
  if (max <= min) max = min + 1;
  const range = niceNum(max - min, false);
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
