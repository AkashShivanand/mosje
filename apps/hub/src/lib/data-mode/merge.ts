import type {
  DataMode,
  Descriptor,
  Invariant,
  MergeResult,
  Provenance,
  Reading,
} from "./types";

/**
 * Merge a live reading with a mirrored snapshot, without ever producing figures
 * that contradict each other.
 *
 * THE CENTRAL IDEA: THE MERGE UNIT IS A GROUP, NOT A FIELD.
 *
 * Field-by-field fallback is what produces `138%` — a snapshot numerator over a
 * live denominator, where neither number was wrong and the pairing was. So the
 * descriptor declares what must hold true, fields are partitioned into groups by
 * those invariants, and a group is resolved as a whole. Within a group the order
 * is always:
 *
 *   1. TAKE what the feed gave, once zeros have been judged (`resolveZeros`).
 *   2. DERIVE what the invariants determine. A missing part of a known sum is
 *      arithmetic; mocking it would be inventing a number the data already
 *      knows.
 *   3. ANCHOR-SCALE the rest. What is left takes the snapshot's SHAPE, scaled to
 *      whatever live figure anchors the group, with the rounding remainder
 *      absorbed so the invariant still holds exactly.
 *   4. Fall back to the snapshot outright only when nothing anchors the group.
 *
 * Steps 2 and 3 are why "total 100, parts 70, mock says 50" cannot happen: with
 * a sum invariant the third part is derived as 30; without one, the fields were
 * never a group and 50 was never incoherent.
 */

/** Union-find over invariant membership. Fields in no invariant are singletons. */
function groupsOf<K extends string>(d: Descriptor<K>): K[][] {
  const keys = Object.keys(d.fields) as K[];
  const parent = new Map<K, K>(keys.map((k) => [k, k]));
  const find = (k: K): K => {
    let r = k;
    while (parent.get(r) !== r) r = parent.get(r)!;
    return r;
  };
  const union = (a: K, b: K) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };
  for (const inv of d.invariants) {
    const members = membersOf(inv);
    for (let i = 1; i < members.length; i += 1) union(members[0]!, members[i]!);
  }
  const buckets = new Map<K, K[]>();
  for (const k of keys) {
    const r = find(k);
    const list = buckets.get(r) ?? [];
    list.push(k);
    buckets.set(r, list);
  }
  return [...buckets.values()];
}

function membersOf<K extends string>(inv: Invariant<K>): K[] {
  if (inv.kind === "sum") return [inv.total, ...inv.parts];
  if (inv.kind === "subset") return [inv.part, inv.of];
  return inv.series;
}

/**
 * Decide, for each field in one group, whether the feed actually answered.
 *
 * The `corroborated` case is resolved here rather than per field because it can
 * only be answered by the group: a zero surrounded by figures is a reading, and
 * a zero surrounded by zeros is an unpopulated column. Doing this per field
 * would need an opinion about every counter in the estate; doing it per group
 * needs none.
 */
function resolveZeros<K extends string>(
  d: Descriptor<K>,
  group: K[],
  live: Reading<K>,
): Map<K, number> {
  const known = new Map<K, number>();
  const reported = (k: K) => {
    const v = live[k];
    return typeof v === "number" && Number.isFinite(v) && v !== 0;
  };

  /**
   * ONLY A SUM SIBLING CAN CORROBORATE A ZERO — not any non-zero in the group.
   *
   * A total genuinely AGGREGATES its parts, so a non-zero total proves the
   * collection ran and at least one part was populated; a zero part beside it is
   * therefore a reading. A container does NOT aggregate its subset. "3,79,392
   * works identified" says nothing whatever about whether the "completed" column
   * was ever filled in.
   *
   * Read as any-non-zero-will-do, this accepted `works_completed: 0` against
   * 3.79 lakh identified and `gap_filling_utilized: 0` against ₹73,711 lakh
   * released — on a scheme that has already DECLARED 17,990 villages Adarsh
   * Gram, which requires a score of 70 out of 100. Both are unpopulated columns,
   * and the page published 0% for each.
   */
  const sumSiblings = new Set<K>();
  for (const inv of d.invariants) {
    if (inv.kind !== "sum") continue;
    if (!membersOf(inv).every((m) => group.includes(m))) continue;
    for (const m of membersOf(inv)) sumSiblings.add(m);
  }
  const corroborated = [...sumSiblings].some(reported);

  for (const k of group) {
    const v = live[k];
    if (typeof v !== "number" || !Number.isFinite(v)) continue;
    if (v !== 0) {
      known.set(k, v);
      continue;
    }
    const zero = d.fields[k].zero;
    if (zero === "real") known.set(k, 0);
    else if (zero === "corroborated" && corroborated && sumSiblings.has(k)) {
      known.set(k, 0);
    }
    // "missing", an uncorroborated zero, or a zero in a group with no sum to
    // vouch for it: the feed did not answer.
  }

  // AN INVARIANT CAN VETO A ZERO, and corroboration is not the last word.
  //
  // The Adarsh Gram feed reports 0 assessments initiated and 0 completed
  // alongside 25,189 village plans drawn. Corroboration accepts those zeros —
  // the group plainly has figures — but the funnel says a plan cannot exist for
  // a village whose assessment never started, so the invariant PROVES they are
  // unpopulated columns. A rule that can be contradicted by the data is
  // stronger evidence than a rule about the data's shape, so it wins.
  for (const inv of d.invariants) {
    if (inv.kind !== "monotone") continue;
    if (!inv.series.every((k) => group.includes(k))) continue;
    for (let i = 0; i < inv.series.length; i += 1) {
      const here = inv.series[i]!;
      if (known.get(here) !== 0) continue;
      const laterHasFigure = inv.series
        .slice(i + 1)
        .some((k) => (known.get(k) ?? 0) > 0);
      if (laterHasFigure) known.delete(here);
    }
  }
  return known;
}

/** Derive what the invariants determine from what is known. Runs to a fixpoint. */
function derive<K extends string>(
  d: Descriptor<K>,
  group: K[],
  known: Map<K, number>,
  derived: Set<K>,
): void {
  const inGroup = new Set(group);
  let changed = true;
  let guard = 0;
  while (changed && guard < 16) {
    changed = false;
    guard += 1;
    for (const inv of d.invariants) {
      if (!membersOf(inv).every((m) => inGroup.has(m))) continue;

      if (inv.kind === "sum") {
        const unknownParts = inv.parts.filter((p) => !known.has(p));
        // total = Σ parts
        if (!known.has(inv.total) && unknownParts.length === 0) {
          const t = inv.parts.reduce((s, p) => s + known.get(p)!, 0);
          known.set(inv.total, t);
          derived.add(inv.total);
          changed = true;
        }
        // one missing part = total − Σ(the rest)
        if (known.has(inv.total) && unknownParts.length === 1) {
          const rest = inv.parts
            .filter((p) => p !== unknownParts[0])
            .reduce((s, p) => s + known.get(p)!, 0);
          known.set(unknownParts[0]!, Math.max(0, known.get(inv.total)! - rest));
          derived.add(unknownParts[0]!);
          changed = true;
        }
      }
      // `subset` and `monotone` constrain but do not determine, so neither can
      // derive a value. They are enforced in `clamp` instead.
    }
  }
}

/**
 * Fill what is left from the snapshot, scaled to whatever anchors the group.
 *
 * For a sum group with a live total, the unknown parts share the remainder in
 * the snapshot's own proportions — so the group sums EXACTLY by construction
 * rather than by luck, and the shape a reader is actually looking at survives.
 * The last unknown absorbs the rounding, which is the same technique the states
 * bar chart uses to stop three independently-rounded shares reaching 100.1.
 */
function anchorScale<K extends string>(
  d: Descriptor<K>,
  group: K[],
  known: Map<K, number>,
  mock: Record<K, number>,
  provenance: Map<K, Provenance>,
): void {
  const inGroup = new Set(group);

  for (const inv of d.invariants) {
    if (inv.kind !== "sum") continue;
    if (!membersOf(inv).every((m) => inGroup.has(m))) continue;
    if (!known.has(inv.total)) continue;

    const unknown = inv.parts.filter((p) => !known.has(p));
    if (unknown.length === 0) continue;

    const knownSum = inv.parts
      .filter((p) => known.has(p))
      .reduce((s, p) => s + known.get(p)!, 0);
    const remainder = Math.max(0, known.get(inv.total)! - knownSum);
    const mockSum = unknown.reduce((s, p) => s + Math.max(0, mock[p]), 0);

    let spent = 0;
    unknown.forEach((p, i) => {
      const last = i === unknown.length - 1;
      const share = last
        ? remainder - spent // absorbs the rounding; the group sums exactly
        : mockSum > 0
          ? Math.round((Math.max(0, mock[p]) / mockSum) * remainder)
          : Math.round(remainder / unknown.length);
      spent += share;
      known.set(p, Math.max(0, share));
      provenance.set(p, "mock");
    });
  }

  // A `subset` whose container is live: take the snapshot's ratio, not its
  // absolute value, or a mocked part can exceed a live whole.
  for (const inv of d.invariants) {
    if (inv.kind !== "subset") continue;
    if (!membersOf(inv).every((m) => inGroup.has(m))) continue;
    if (known.has(inv.part) || !known.has(inv.of)) continue;
    const whole = known.get(inv.of)!;
    const ratio = mock[inv.of] > 0 ? mock[inv.part] / mock[inv.of] : 0;
    known.set(inv.part, Math.min(whole, Math.round(whole * ratio)));
    provenance.set(inv.part, "mock");
  }

  // Anything still unknown has nothing to anchor to. Take the snapshot as-is.
  for (const k of group) {
    if (known.has(k)) continue;
    known.set(k, mock[k]);
    provenance.set(k, "mock");
  }
}

/**
 * Last line of defence: no invariant may be violated BY A FIGURE WE INVENTED.
 *
 * The qualifier is the whole rule. Clamping everything looks safer and is not:
 * with the live funnel reporting 0 assessments against 17,990 declared villages,
 * a blanket monotone clamp propagated the source's zero forward and rendered the
 * page's headline number as 0. Our job is to keep OUR illustrative figures
 * coherent, not to silently correct the department's data — and certainly not to
 * delete its outcome while doing so. A live figure that breaks an invariant is a
 * problem to raise with the feed's owner; it is not this function's to hide.
 */
function clamp<K extends string>(
  d: Descriptor<K>,
  values: Record<K, number>,
  prov: Map<K, Provenance>,
): void {
  const editable = (k: K) => prov.get(k) === "mock";
  for (const inv of d.invariants) {
    if (inv.kind === "subset") {
      if (editable(inv.part)) {
        values[inv.part] = Math.min(values[inv.part], values[inv.of]);
      }
    } else if (inv.kind === "monotone") {
      for (let i = 1; i < inv.series.length; i += 1) {
        const prev = inv.series[i - 1]!;
        const cur = inv.series[i]!;
        if (editable(cur)) values[cur] = Math.min(values[cur], values[prev]);
      }
    }
  }
}

export function mergeData<K extends string>(
  descriptor: Descriptor<K>,
  live: Reading<K>,
  mock: Record<K, number>,
  mode: DataMode,
): MergeResult<K> {
  const keys = Object.keys(descriptor.fields) as K[];
  const values = {} as Record<K, number>;
  const prov = new Map<K, Provenance>();

  if (mode === "mock") {
    for (const k of keys) {
      values[k] = mock[k];
      prov.set(k, "mock");
    }
    clamp(descriptor, values, prov);
    return finish(keys, values, prov);
  }

  for (const group of groupsOf(descriptor)) {
    const known = resolveZeros(descriptor, group, live);
    for (const k of known.keys()) prov.set(k, "live");

    const derived = new Set<K>();
    derive(descriptor, group, known, derived);
    for (const k of derived) prov.set(k, "derived");

    if (mode === "live") {
      // Nothing is invented. A field the feed did not answer stays 0 and is
      // reported as mock-free absence, so the card can show a real empty state.
      for (const k of group) {
        if (!known.has(k)) {
          known.set(k, 0);
          prov.set(k, "live");
        }
      }
    } else {
      anchorScale(descriptor, group, known, mock, prov);
    }

    for (const k of group) values[k] = known.get(k) ?? 0;
  }

  clamp(descriptor, values, prov);
  return finish(keys, values, prov);
}

function finish<K extends string>(
  keys: K[],
  values: Record<K, number>,
  prov: Map<K, Provenance>,
): MergeResult<K> {
  const provenance = {} as Record<K, Provenance>;
  for (const k of keys) provenance[k] = prov.get(k) ?? "mock";
  return {
    values,
    provenance,
    allLive: keys.every((k) => provenance[k] !== "mock"),
    allMock: keys.every((k) => provenance[k] === "mock"),
  };
}

/**
 * The provenance of a CARD — the strongest claim it can honestly make about the
 * set of figures it draws.
 *
 * A card is the unit a reader judges, so this is deliberately pessimistic: one
 * mocked figure among six makes the card "mixed", never "live".
 */
export function provenanceOf<K extends string>(
  result: MergeResult<K>,
  keys: readonly K[],
): "live" | "mock" | "mixed" {
  const set = new Set(keys.map((k) => result.provenance[k]));
  if (set.size === 0) return "live";
  if (!set.has("mock")) return "live";
  if (set.has("live") || set.has("derived")) return "mixed";
  return "mock";
}
