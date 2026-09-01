/**
 * THE SAMAVESH ILLUSTRATION LANGUAGE — stated before a line is drawn.
 *
 * The estate had no illustration system. What it had was one good instinct,
 * inside `dashboard/card-state.tsx`: six drawings built from the marks the
 * charts themselves draw — an axis, a baseline, a series of bars, a ring —
 * arranged to depict what had happened. That instinct is right, and this
 * generalises it rather than replacing it with a second, competing style.
 *
 * ── 1. ONE GEOMETRY, THREE TIERS ────────────────────────────────────────────
 *
 * Every drawing is authored ONCE, in a 64 × 48 coordinate space, and rendered
 * at one of three tiers. The viewBox never changes; only the rendered box does,
 * so strokes, corners and gaps scale together and a drawing is correct at every
 * size without a second file.
 *
 *   spot   32 × 24    beside a line of text, in a chip, in a dense table
 *   scene  192 × 144  an empty state, a card that cannot draw, a step in a flow
 *   hero   384 × 288  a page-level statement, responsive down to `scene`
 *
 * 4:3 at every tier. A drawing that needs a different aspect is a different
 * drawing, not a special case.
 *
 * ── 2. THE FLOOR ────────────────────────────────────────────────────────────
 *
 * Every scene is drawn against the same baseline, at y = 40, running x = 8 → 56.
 * The charts are all grounded, so the illustrations are, and the family reads as
 * one family from across a room.
 *
 * **An object that stands, MEETS it** — bars, seats and sheets terminate exactly
 * on y = 40, with a butt cap, because a round cap would hang the mark two units
 * below the line it stands on. **A mark that is not an object does not** — a
 * ring is a proportion and a lens is an instrument, and standing either on the
 * ground would be a drawing about furniture.
 *
 * That distinction is the rule. An earlier version of this section said "every
 * scene stands on the same baseline… a drawing that floats belongs to a
 * different system", which was simply false of nine of the fourteen scenes and
 * made the floor look like a decorative underline beneath unrelated objects.
 * State the rule the drawings obey, or change the drawings.
 *
 * ── 3. FOUR INK LAYERS, ALL TOKENISED ───────────────────────────────────────
 *
 * A raw hex in an illustration is the same defect as a raw hex in a component,
 * and worse: an illustration that does not follow `data-brand` is the one asset
 * on the page that still says the old brand.
 *
 *   ground   the floor and any structural rule       --sa-border-neutral-base
 *   ghost    what is absent, inactive, or not yet    --sa-border-neutral-subtle
 *   ink      what is present and true                --sa-text-neutral-subtle
 *   accent   the ONE element carrying the meaning    --sa-bg-brand-primary-bolder
 *
 * At most one accent per drawing. Two accents means the drawing has not decided
 * what it is about.
 *
 * ── 4. STROKE ───────────────────────────────────────────────────────────────
 *
 * Round joins, always. Round caps EXCEPT where a mark meets the floor — see §2:
 * a round cap adds half the stroke width past the endpoint, so a grounded mark
 * uses a butt cap or it hangs below the line it stands on. Three weights and no
 * others:
 *
 *   hairline 2   the floor, a rule, a guide
 *   ink      3   a line that is the subject
 *   mass     4   a bar, a block, a body
 *
 * ── 5. WHAT THIS LANGUAGE REFUSES TO DEPICT ─────────────────────────────────
 *
 * This estate serves Scheduled Castes, Scheduled Tribes, Other Backward
 * Classes, senior citizens, persons with disabilities, transgender persons and
 * people in situations of destitution. An illustration system for it cannot
 * depict a person, because any depicted person has a gender, an age, an
 * apparent caste and an apparent ability, and every citizen who is not that
 * person is told the page is not for them.
 *
 * So: NO faces. NO hair. NO skin. NO clothing that reads as a community. NO
 * gendered silhouettes. Where a drawing needs a human presence it uses the
 * evidence of one — a seat, a form, a hand's worth of scale, a queue's rhythm —
 * never a figure with attributes. This is a constraint on the artwork, not a
 * limitation to work around: the department's subject is a process and an
 * entitlement, and those are what the drawings show.
 *
 * The National Emblem is never illustration. It is the estate's mark, it has
 * its own rules, and it does not appear inside a scene.
 *
 * ── 6. MODULAR BY CONSTRUCTION ──────────────────────────────────────────────
 *
 * A new scene is ASSEMBLED from `primitives.tsx`, not drawn. If a scene needs a
 * shape no primitive provides, the primitive is added first and the scene is
 * built from it — the same rule the design system applies to components, for
 * the same reason. A scene that reaches for a bespoke `<path>` is a primitive
 * that has not been written yet.
 */

/** The authored coordinate space. Every drawing uses it; nothing overrides it. */
export const ILLUSTRATION_VIEWBOX = "0 0 64 48";

/** The floor every scene stands on. */
export const GROUND = { y: 40, x1: 8, x2: 56 } as const;

/** The three rendered sizes. See §1 — the viewBox does not change with them. */
export const ILLUSTRATION_TIERS = {
  spot: { width: 32, height: 24 },
  scene: { width: 192, height: 144 },
  hero: { width: 384, height: 288 },
} as const;

export type IllustrationTier = keyof typeof ILLUSTRATION_TIERS;

/** The only stroke weights in the system. See §4. */
export const STROKE = { hairline: 2, ink: 3, mass: 4 } as const;

/** The four ink layers. Each maps to one CSS class bound to one token. See §3. */
export const INK_LAYERS = ["ground", "ghost", "ink", "accent"] as const;
export type InkLayer = (typeof INK_LAYERS)[number];
