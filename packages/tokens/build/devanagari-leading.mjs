/**
 * Devanagari leading, per role — DERIVED, never authored.
 *
 * Until 2026-09-04 the estate carried ONE Devanagari line height: `leading/devanagari`, a
 * unitless 1.7 applied to every Hindi block whatever its role. Two things were wrong with it.
 *
 *   1. It undid the scale. Latin leading falls as size rises (body 1.50 → headline 1.20 →
 *      display 1.10) so that a heading holds together as a shape. A flat 1.7 gave a 40px Hindi
 *      headline 68px of leading against the Latin 48 — the tightest roles took the biggest
 *      jump, and a Hindi heading read as three loose lines instead of one block.
 *   2. Figma could not use it. A number variable bound to line height is read in PIXELS, so
 *      binding 1.7 set a 1.7px line. It sat in the Type collection with a LINE_HEIGHT scope,
 *      which is an invitation to exactly that mistake, and nothing in the library bound it.
 *
 * The rule is now an OFFSET over the role's own Latin leading, expressed as a fraction of the
 * size — `ref/font/lineHeight/devanagariOffset` (0.2). Devanagari hangs from the शिरोरेखा and
 * stacks vowel signs above and below the base line, so at any size it needs a fixed share of
 * that size in extra vertical room; what it does not need is to abandon the Latin rhythm.
 *
 *     lhDevanagari = ceil4( lh + offset × size )
 *
 * Rounded UP to the 4px grid, never to nearest: the whole point is more room, and 22.8 → 20
 * would have handed body-2 LESS than its Latin leading. The result at every anchor:
 *
 *     body-1      16 / 24  →  28   (1.75)      headline-1 (desktop)  40 / 48  →  56   (1.40)
 *     body-2      14 / 20  →  24   (1.71)      display-1  (desktop)  80 / 88  → 104   (1.30)
 *     body-3      12 / 16  →  20   (1.67)      label-3               12 / 16  →  20   (1.67)
 *
 * Body lands where the old 1.7 was aiming, and the headings keep their shape. Every role gets
 * a `lhDevanagari` leaf beside its `lh`, with the same fluid bounds per surface, so it reaches
 * CSS as `--sa-type-<role>-lhDevanagari` (a clamp() like its Latin sibling), Figma as
 * `type/<tier>/<n>/lhDevanagari` sampled per mode like every other Type variable — and
 * BINDABLE, in pixels — and the docs page as a column read from the same numbers.
 *
 * `leading/devanagari` survives as the body-1 alias, for the one place a block has no role.
 */

const px = (v) => {
  const n = parseFloat(String(v).replace("px", ""));
  if (!Number.isFinite(n)) throw new Error(`devanagari-leading: not a length: ${JSON.stringify(v)}`);
  return n;
};

/** The rule, in one place. Both the build and the tests call this. */
export function devanagariLeading(size, lh, offset) {
  const raw = px(lh) + offset * px(size);
  return Math.ceil(raw / 4) * 4;
}

const OFFSET_PATH = ["font", "lineHeight", "devanagariOffset"];

/**
 * Adds `font.role.<tier>.<n>.lhDevanagari` beside every `lh`, carrying the same
 * `$extensions.mosje.type.{website,portal}.{min,max}` shape so the fluid clamp and the Figma
 * mode sampling treat it exactly as they treat `lh`. Runs as a Style Dictionary preprocessor,
 * so every platform — CSS, Figma, the nested JSON the tests read — sees the same leaves.
 */
export function addDevanagariLeading(tree) {
  const offsetNode = OFFSET_PATH.reduce((n, k) => n?.[k], tree);
  if (offsetNode?.$value === undefined) {
    throw new Error(
      `devanagari-leading: ${OFFSET_PATH.join(".")} is missing from the token source — ` +
        "Devanagari leading is derived from it and cannot be built without it.",
    );
  }
  const offset = Number(offsetNode.$value);
  if (!(offset > 0 && offset < 1)) {
    throw new Error(`devanagari-leading: offset ${offsetNode.$value} is not a fraction of the size`);
  }

  let added = 0;
  const roleTree = tree?.font?.role ?? {};
  for (const [tier, steps] of Object.entries(roleTree)) {
    if (tier.startsWith("$") || typeof steps !== "object") continue;
    for (const [n, props] of Object.entries(steps)) {
      if (n.startsWith("$") || typeof props !== "object") continue;
      const { size, lh } = props;
      if (!size?.$value || !lh?.$value) continue;
      if (props.lhDevanagari) {
        throw new Error(
          `devanagari-leading: font.role.${tier}.${n}.lhDevanagari is authored in the source. ` +
            "It is derived — delete the literal; the rule is the value.",
        );
      }
      const surfaces = {};
      for (const surface of ["website", "portal"]) {
        const s = size.$extensions?.mosje?.type?.[surface];
        const l = lh.$extensions?.mosje?.type?.[surface];
        if (!s || !l) continue;
        surfaces[surface] = {
          min: `${devanagariLeading(s.min, l.min, offset)}px`,
          max: `${devanagariLeading(s.max, l.max, offset)}px`,
        };
      }
      props.lhDevanagari = {
        $type: "dimension",
        $value: `${devanagariLeading(size.$value, lh.$value, offset)}px`,
        $extensions: { mosje: { type: surfaces } },
        $description:
          `Devanagari line height for ${tier}-${n}: the role's Latin leading plus ` +
          `${offset} × its size, rounded up to the 4px grid. Derived by build/devanagari-leading.mjs, ` +
          "never typed. Bind a Hindi block's line height here, at the same size as its Latin role.",
      };
      added += 1;
    }
  }
  if (added !== 21) {
    throw new Error(`devanagari-leading: derived ${added} leaves, expected one per role (21)`);
  }
  return tree;
}
