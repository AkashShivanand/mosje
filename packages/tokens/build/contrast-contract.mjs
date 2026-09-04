/**
 * The prominence contrast contract (spec §6.3), as something that can be TRUE OR FALSE.
 *
 * Before this module the contract was published by a substring scan:
 *
 *   const rung = path.find((seg) => PROMINENCE_CONTRACT[seg]);
 *
 * That has no idea what slot the word occupies, what role owns it, or what the token is
 * worth. It shipped 322 claims into the live Figma library, of which:
 *
 *   - 192 sat on Tier-3 `Action/*` variables, which have no prominence slot at all;
 *   - `Background/Brand/Primary/Base` — a FILL — read "Guarantees >=4.5:1, body and
 *     heading text", because `primary` is a brand VARIANT that happens to spell an ink rung;
 *   - `motion/duration-base` — a NUMBER — read "No contrast guarantee, decorative fills only";
 *   - `Text/Link/Brand/Default`, the one token that must be AA, carried no contract at all;
 *   - and 23 of the 41 that were measurable were simply false.
 *
 * A design library that asserts a WCAG class it has not measured is worse than one that
 * says nothing, because a designer has no way to tell the two apart. So this module does
 * two things the scan could not:
 *
 *   1. `contractFor()` decides whether the contract APPLIES, using the real parser and the
 *      role's own ladder — never a substring.
 *   2. `auditPayload()` MEASURES every applicable token against its own surface, across
 *      every brand, and reports what it found.
 *
 * The exporter then publishes the measurement, and adds the permission sentence only where
 * the threshold is actually met. Nothing is asserted that has not been computed.
 */

import { parse, PROMINENCE, INK_PROMINENCE, PROMINENCE_CONTRACT } from "./grammar.mjs";
import { contrast } from "./wcag.mjs";

/** Rungs that mean something on a fill or a boundary, and what each guarantees. */
const FILL_LADDER = new Set(PROMINENCE);
/** Rungs that mean something on ink. Same WORDS as the fill ladder since 2026-08-10 — the
 *  thresholds differ, which is exactly why PROMINENCE_CONTRACT is keyed by ladder. */
const INK_LADDER = new Set(INK_PROMINENCE);

/**
 * Which ladder a role reads its prominence on.
 *
 * This is the rule that dissolves the `primary`/`secondary`/`tertiary` overload the spec
 * pins in §5.1c as "harmless, resolved by greedy order". It is not harmless: on `bg` those
 * words are brand VARIANTS, and reading them as ink rungs is what put "body and heading
 * text" on sixteen background fills. On `bg` they are never rungs, so the collision cannot
 * be reached — the same fix §6.4 wanted, applied where it actually bites.
 */
const LADDER_FOR_ROLE = {
  text: "ink",
  icon: "ink",
  bg: "fill",
  border: "fill",
  outline: "fill",
  // `overlay` is deliberately ABSENT. A scrim is neither ink nor a boundary: it is a
  // translucent wash whose job is to suppress what is under it, and it carries no
  // text-contrast obligation. Adding it made `overlay/neutral/boldest` claim ≥7:1 and
  // report a 3.13:1 "shortfall" that is not a defect in anything.
};
const LADDER_WORDS = { ink: INK_LADDER, fill: FILL_LADDER };

/** The surface a role's contrast is judged against. */
const PAGE_SURFACE = "bg/neutral/base";
const INVERSE_SURFACE = "bg/neutral/inverse";
/**
 * THE ESTATE'S PAGES ARE NOT WHITE, and judging them as though they were is how a real
 * failure passed this gate for months.
 *
 * `bg/neutral/base` is the surface of a card. The `<body>` carries `bg-surface-muted`,
 * which is `bg/neutral/subtler` (#eef0f3) — so ordinary body text sits on the muted ground
 * far more often than on white. Measured against white alone,
 * `text/link/brand/default` scored 4.64:1 and passed; on the ground it actually occupies it
 * was 4.07:1, under the 4.5:1 of SC 1.4.3, on most pages of a Government of India property.
 *
 * A text token must therefore clear its bar on BOTH grounds, and the audit takes the worse
 * of the two — the same way it already takes the worst brand rather than the kindest.
 * Widening it caught exactly two more tokens, both fixed in the same change as this.
 */
const BODY_SURFACE = "bg/neutral/subtler";

/**
 * Tokens whose ground is a WHITE FILL, not the page — judged on `bg/neutral/base` alone.
 *
 * This is not an escape hatch, and it is deliberately two entries long. Widening the audit
 * to the muted ground flagged exactly two more tokens, and neither is a defect: both are
 * deliberate designs this repository had already written down, and failing them would have
 * pushed someone to "fix" a token that is correct.
 *
 * A token earns a place here only when it sits on a white FILL rather than on the page, and
 * the reason is recorded beside it. If a token is used on the muted ground, it does not
 * belong here — it belongs at a darker rung, which is what happened to
 * `text/link/brand/default` on 2026-09-04.
 */
const WHITE_GROUND_ONLY = new Map([
  [
    "text/neutral/subtler",
    "The placeholder in an unfilled input or select. It sits INSIDE the control, whose fill " +
      "is bg/neutral/base, so the page behind the control is never behind the text. Its own " +
      "description names that surface and that use.",
  ],
  [
    "text/brand/primary/base",
    "The brand key colour as ink. A key colour is chosen to be recognisable, not readable, " +
      "and generate-system-tokens.mjs says so where it is defined — which is why " +
      "text/brand/primary/bolder exists at the 600 rung (6.36 / 5.57) and is the one to " +
      "reach for whenever brand text lands on anything but plain white.",
  ],
]);

/**
 * What WCAG requires of a role when the LADDER has nothing to say.
 *
 * The ink ladder has no rung for the canonical value — `base` is a fill-ladder word — so
 * `text/brand/primary/base` and `text/link/brand/default` fell through it entirely. Those
 * are brand body text and the text link: the two tokens on the estate that most obviously
 * must be AA. Leaving them silent while a decorative fill got a paragraph was the exact
 * inversion this module exists to remove.
 *
 * This is NOT a new ladder rung invented here. It is WCAG applied to the role the token
 * already declares — 1.4.3 for text, 1.4.11 for icons — which is why the note attributes it
 * to WCAG rather than to a rung. Borders and fills are deliberately absent: 1.4.11 covers
 * boundaries needed to identify a control, not hairline dividers or tonal chips, so
 * asserting 3:1 across every one of them would manufacture failures WCAG does not require.
 */
const ROLE_BASELINE = {
  text: { minContrast: 4.5, use: "text (WCAG 1.4.3 AA)" },
  icon: { minContrast: 3.0, use: "meaningful icons (WCAG 1.4.11)" },
};

/**
 * Does the contract apply to this token, and against what?
 *
 * Returns `null` — meaning "say nothing" — far more often than the old scan did, and that
 * is the point. Silence is the correct output for a token whose accessibility behaviour
 * this ladder does not describe.
 *
 * @param {string[]} path
 * @param {"ref"|"sys"|"cmp"} tier
 * @param {string} figmaType  the variable's Figma type; only COLOR can carry a contrast class
 */
export function contractFor(path, tier, figmaType) {
  // A contrast class is a property of a colour. `motion/duration/base` is a number, and the
  // only reason it ever carried one is that `base` is also a rung word.
  if (figmaType !== "COLOR") return null;

  // Tier 3 has no prominence slot — its shape is component/intent/variant/state/property.
  // Its contract is the label-on-fill pairing, which action-contrast.test.mjs already owns.
  // Tier 1 is raw palette: a ramp step has no surface to be judged against.
  if (tier !== "sys") return null;

  const r = parse(path, tier);
  if (!r.ok || !r.slots?.role) return null;

  const { role, prominence, state } = r.slots;

  // A disabled control is exempt from WCAG 1.4.3, and asserting a class it need not meet
  // would push a designer to "fix" a token that is correct as it is.
  if (state === "disabled" || path.includes("disabled")) return null;

  // `surface` stays a single string because callers read it; `surfaces` is what the audit
  // measures, and for anything on a light page that is BOTH grounds the estate ships.
  const inverse = path.includes("inverse");
  const surface = inverse ? INVERSE_SURFACE : PAGE_SURFACE;
  const self = path.join("/");

  // ONLY `text` reads both grounds, and the restraint is the point.
  //
  // The defect this widening exists to catch is READING TEXT on the muted page. Re-grounding
  // the other roles would change every number without adding safety:
  //
  //   · `bg/*` — a fill measured against another fill is a ladder-definition argument, not a
  //     WCAG one, and the ledger below already records that "for quiet fills the LADDER is the
  //     thing that is wrong, not the colours". Re-grounding them rewrites sixteen recorded
  //     measurements to say the same thing slightly worse.
  //   · `icon` — the ink ladder asks 4.5:1 of a `base` rung, which is stricter than the 3:1
  //     SC 1.4.11 actually requires of a meaningful icon. `icon/brand/primary/base` measures
  //     4.07:1 on the muted ground: clear of WCAG, short of the rung. That is the same
  //     ladder-definition argument, and manufacturing a shortfall out of it would push someone
  //     to "fix" a colour that meets the criterion it is judged by.
  //
  // So the widening is deliberately confined to the role whose bar comes from WCAG itself.
  const bothGrounds = role === "text" && !inverse && !WHITE_GROUND_ONLY.has(self);
  const grounds = inverse
    ? [INVERSE_SURFACE]
    : bothGrounds
      ? [PAGE_SURFACE, BODY_SURFACE]
      : [PAGE_SURFACE];
  // A surface cannot be measured against itself.
  const surfaces = grounds.filter((s) => s !== self);
  if (!surfaces.length) return null;

  const ladder = LADDER_FOR_ROLE[role];
  const rung = prominence && LADDER_WORDS[ladder]?.has(prominence) ? prominence : null;

  if (rung) {
    // Keyed by LADDER, not by word: `subtle` is a quiet tonal chip on a fill (≥3:1, WCAG
    // 1.4.11) and a caption on ink (≥4.5:1, 1.4.3). One flat table could only be right
    // about one of them.
    const c = PROMINENCE_CONTRACT[ladder]?.[rung];
    if (c) return { source: "ladder", ladder, rung, role, minContrast: c.minContrast, use: c.use, surface, surfaces };
  }

  // No rung the role can read — fall back to what WCAG requires of the role itself, if
  // anything. Fills and boundaries fall through to `null` and stay silent.
  const baseline = ROLE_BASELINE[role];
  if (!baseline) return null;
  return { source: "wcag", rung: null, role, ...baseline, surface, surfaces };
}

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Parse a CSS colour the payload can actually contain. Returns [r,g,b,a] or null. */
function parseColor(value) {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (HEX.test(v)) {
    let h = v.slice(1);
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
  }
  const m = /^rgba?\(([^)]+)\)$/i.exec(v);
  if (!m) return null;
  const parts = m[1].split(/[,/]/).map((s) => s.trim());
  if (parts.length < 3) return null;
  const [r, g, b] = parts.slice(0, 3).map((s) => (s.endsWith("%") ? Math.round(parseFloat(s) * 2.55) : parseFloat(s)));
  const a = parts[3] === undefined ? 1 : parts[3].endsWith("%") ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
  if ([r, g, b, a].some((n) => !Number.isFinite(n))) return null;
  return [r, g, b, a];
}

const toHex = ([r, g, b]) => "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");

/**
 * Composite a translucent colour over its surface.
 *
 * Disabled ink is `rgba(31,36,40,.48)`. Measuring the raw rgba would compare an alpha value
 * to an opaque one, which is not what a reader sees — what they see is the blend.
 */
function over([r, g, b, a], [sr, sg, sb]) {
  if (a >= 1) return [r, g, b];
  return [r * a + sr * (1 - a), g * a + sg * (1 - a), b * a + sb * (1 - a)];
}

/**
 * Resolve one variable to a literal colour for a given brand.
 *
 * Colour is split across two collections: `Color` carries the brand axis, `Theme` is the
 * semantic layer that aliases into it. So a Theme variable's value is followed through its
 * alias into Color, and Color is read at the requested brand mode.
 */
function resolveColor(index, collection, name, brand, depth = 0) {
  if (depth > 12) return null;
  const v = index.get(`${collection}::${name}`);
  if (!v) return null;
  const modes = Object.keys(v.valuesByMode);
  const mode = modes.includes(brand) ? brand : modes[0];
  const entry = v.valuesByMode[mode];
  if (!entry) return null;
  if (entry.type === "ALIAS") {
    const base = resolveColor(index, entry.collection, entry.name, brand, depth + 1);
    if (!base || !entry.opacity) return base;
    // Alias-with-opacity: the alias carries its own alpha, bound to a number variable that
    // Figma reads as a PERCENTAGE (see FIGMA_OPACITY_SCALE in the exporter). Composite it in,
    // or border/neutral/inverse/subtle — white at 40% — measures as opaque white, 18.94:1
    // instead of 3.81:1, and the published figure is a lie.
    const step = index.get(`${entry.opacity.collection}::${entry.opacity.name}`);
    const alphaEntry = step && resolveFloat(index, entry.opacity.collection, entry.opacity.name, brand);
    if (typeof alphaEntry !== "number") return null;
    return [base[0], base[1], base[2], base[3] * (alphaEntry / 100)];
  }
  return parseColor(entry.value);
}

/** Resolve a FLOAT variable through its alias chain. */
function resolveFloat(index, collection, name, brand, depth = 0) {
  if (depth > 12) return null;
  const v = index.get(`${collection}::${name}`);
  if (!v) return null;
  const modes = Object.keys(v.valuesByMode);
  const mode = modes.includes(brand) ? brand : modes[0];
  const entry = v.valuesByMode[mode];
  if (!entry) return null;
  if (entry.type === "ALIAS") return resolveFloat(index, entry.collection, entry.name, brand, depth + 1);
  return entry.type === "FLOAT" ? Number(entry.value) : null;
}

/** Every brand the payload can be read in. */
export function brandsOf(payload) {
  const color = payload.collections.find((c) => c.name === "Color");
  return color?.modes ?? ["Blue"];
}

/**
 * Measure every variable that carries an applicable contract.
 *
 * Measured across ALL brands and reported as the WORST case, because a token is only as
 * accessible as its least accessible brand — averaging or sampling one brand is how a
 * re-skin ships an inaccessible estate that CI called green.
 *
 * @returns {Array<{collection,name,path,rung,minContrast,use,surface,measured,meets}>}
 */
export function auditPayload(payload) {
  const index = new Map();
  for (const c of payload.collections) for (const v of c.variables) index.set(`${c.name}::${v.name}`, v);

  // path → the variable that holds it, so a contract's surface can be found by PATH while
  // the payload is keyed by Figma NAME.
  const byPath = new Map();
  for (const c of payload.collections) {
    for (const v of c.variables) if (!byPath.has(v.path)) byPath.set(v.path, { collection: c.name, name: v.name });
  }

  const brands = brandsOf(payload);
  const out = [];

  for (const c of payload.collections) {
    for (const v of c.variables) {
      const tier = v.$extensions?.["in.gov.mosje.tier"];
      const contract = contractFor(v.path.split("/"), tier, v.type);
      if (!contract) continue;

      const surfaceRefs = (contract.surfaces ?? [contract.surface])
        .map((s) => byPath.get(s))
        .filter(Boolean);
      if (!surfaceRefs.length) continue;

      // Worst of every brand AND every ground the token can sit on. Taking the kindest
      // surface is how a 4.07:1 link reported 4.64:1 and passed.
      let worst = Infinity;
      let ok = true;
      for (const brand of brands) {
        for (const surfaceRef of surfaceRefs) {
          const fg = resolveColor(index, c.name, v.name, brand);
          const bgc = resolveColor(index, surfaceRef.collection, surfaceRef.name, brand);
          if (!fg || !bgc) {
            ok = false;
            break;
          }
          const bgHex = toHex(over(bgc, [255, 255, 255]));
          const ratio = contrast(toHex(over(fg, parseColor(bgHex))), bgHex);
          if (ratio < worst) worst = ratio;
        }
        if (!ok) break;
      }
      // Unresolvable is NOT "passing". A token whose value cannot be reached is a token
      // whose claim cannot be checked, and an unverifiable claim must not be published.
      if (!ok || worst === Infinity) continue;

      const measured = Math.round(worst * 100) / 100;
      out.push({
        collection: c.name,
        name: v.name,
        path: v.path,
        ...contract,
        measured,
        // The +0.005 absorbs the rounding used for display, so a token that measures
        // exactly its threshold is not failed by the second decimal place.
        meets: measured + 0.005 >= contract.minContrast,
      });
    }
  }
  return out;
}

/**
 * The description a measured token publishes.
 *
 * The measurement is always stated; the permission sentence is added ONLY where the
 * threshold is met. That ordering is deliberate — it makes the true half unconditional and
 * the claim conditional, so the library cannot assert a class it does not have.
 */
export function contractNote(record, surfaceLabel) {
  const { measured, minContrast, use, rung, source } = record;
  const scope = `${measured}:1 vs ${surfaceLabel}`;
  if (minContrast === 0) {
    // "decorative fills only" is the fill ladder's phrasing and reads wrong on a boundary.
    const noun = record.surface && String(record.rung) && record.role === "border" ? "boundary" : "fill";
    return `Contrast ${scope} — no guaranteed contrast class; treat as a ${noun}, not as text.`;
  }
  if (record.meets) return `Contrast ${scope} — meets ≥${minContrast}:1: ${use}.`;
  // Name the authority the shortfall is measured against, because the two have different
  // remedies: a ladder shortfall can be fixed by renaming the rung, a WCAG one cannot.
  const authority = source === "ladder" ? `the ≥${minContrast}:1 implied by the “${rung}” rung` : `≥${minContrast}:1 for ${use}`;
  return `Contrast ${scope} — BELOW ${authority}.`;
}
