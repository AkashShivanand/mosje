/**
 * Figma Variables payload, targeted at the LIVE SAMAVESH library (spec §8.4 / §8.5).
 *
 * A variable's NAME is its canonical DTCG path — `bg/neutral/subtle`, `ref/space/md`,
 * `cmp/action/brand/primary/hover/bg`. There is no mapping table any more: this file used to
 * invent a display name per collection, and 435 of 669 names ended up differing from the path
 * they came from, with a hyphen inside 179 Figma segments. The library was renamed to the
 * paths on 2026-08-10, so the projection is now derived rather than chosen, and the Figma tree
 * and the source tree are literally the same tree.
 *
 *   Palette   Blue | Navy                             brand-varying ramps + alpha tiers
 *   Color     Default                                 semantic roles + `cmp/*` component tier
 *   Space     Mode 1                                  ref/space/* + inline|stack|padding|section
 *   Type      Website|Portal × Desktop|Tablet|Mobile   ref/font/* + type/*
 *   Radius · Motion   Mode 1
 *   Density   Comfortable | Compact
 *   Component Options — left untouched (a Figma-only boolean, not a token tier)
 *
 * TIER LIVES IN THE NAME, not the collection, and that is forced rather than preferred:
 * `Variable.variableCollectionId` is get-only, so a variable cannot move between collections.
 * Splitting tiers into their own collections would mean delete-and-recreate, which detaches
 * every binding in every consuming file — and since this library is published, a plugin
 * running inside it cannot even enumerate those consumers to check. See spec §8.5.
 *
 * Every variable carries `status: "new" | "existing"` against a snapshot of the live library,
 * so an import is reviewable as a DELTA instead of applied as a bulk overwrite.
 */

import { readFileSync } from "node:fs";
import { tierOfFile, toCssName } from "../grammar.mjs";
import { auditPayload, contractNote } from "../contrast-contract.mjs";
import { guidanceFor, primitivePointer } from "../usage-guidance.mjs";
import { parse } from "../grammar.mjs";

const val = (t) => (t.$value !== undefined ? t.$value : t.value);

/** Snapshot of the live library. Refresh by re-reading the file via use_figma. */
function liveSnapshot() {
  try {
    return JSON.parse(readFileSync(new URL("../../reference/figma-live.json", import.meta.url), "utf8"));
  } catch {
    return null;
  }
}

/**
 * Collections exactly as they exist in the file. The importer matches modes by NAME, so a
 * mode renamed in Figma has to be renamed here too — `figma-roundtrip.test.mjs` is what
 * catches the two drifting apart.
 */
export const COLLECTIONS = {
  "Space": { axis: null, modes: ["Mode 1"] },
  /** Ramps and brand-varying primitives. Private-ish: designers bind to Color. */
  "Palette": { axis: "brand", modes: ["Blue", "Navy"] },
  /**
   * Semantic roles and the component tier — the layer designers actually bind to.
   *
   * Single-mode since the appearance axis was removed (`4f34f21`): the UX4G accessibility
   * widget is the estate's canonical dark and high-contrast mechanism and drives its own
   * class, so `data-theme` was a second mechanism nothing consumed. Brand still flows through
   * every token here, because their values alias into Palette, which carries that axis.
   */
  "Color": { axis: null, modes: ["Default"] },
  "Type": {
    axis: "surface × breakpoint",
    modes: [
      "Website · Desktop", "Website · Tablet", "Website · Mobile",
      "Portal · Desktop", "Portal · Tablet", "Portal · Mobile",
    ],
  },
  "Radius": { axis: null, modes: ["Mode 1"] },
  "Motion": { axis: null, modes: ["Mode 1"] },
  "Density": { axis: "density", modes: ["Comfortable", "Compact"] },
  /**
   * Unitless, mode-less scales: opacity, the z ladder, border widths.
   *
   * This is the one collection §8.4's design ("2 · Static") was actually buildable as, and
   * only because these tokens are NEW. Figma forbids MOVING a variable between collections,
   * so the existing scales could not be gathered here — but nothing is bound to these yet,
   * so creating them in the right home costs nothing.
   */
  "Static": { axis: null, modes: ["Mode 1"] },
  /**
   * The two layout values that genuinely VARY WITH WINDOW WIDTH, and nothing else.
   *
   * Every other container and grid token is a fixed rung — 1200 is 1200 at every size. These
   * two are the RESOLVED value: which rung is in force right now. In CSS that is a media
   * query, and a Figma variable cannot express a media query, so until this collection existed
   * the page cap was the one layout value the library could not represent at all — a designer
   * opening a 1600-wide frame had no way to see that the cap is 1320 there.
   *
   * The ANCHORS deliberately stay out. `ref/breakpoint/laptop` is 1024 in every mode; giving a
   * breakpoint a per-viewport value is circular. Modes are for what the anchors SELECT.
   *
   * New variables rather than modes added to Space and Static, because Figma forbids moving a
   * variable between collections — `grid/margin/*` and `container/*` cannot relocate, and
   * adding six modes to Space would force all 142 of its rungs to carry six identical values.
   */
  "Viewport": {
    axis: "viewport",
    modes: ["Mobile", "Tablet", "Laptop", "Desktop", "Desktop XL", "Desktop Wide"],
  },
};

/**
 * The viewport each Typography mode samples.
 *
 * Code sizes type as `clamp(min@360px, fluid, max@1280px)` — linear between the anchors. So
 * Desktop and Mobile ARE the anchors and Tablet is the same curve evaluated at 768px. Figma's
 * discrete modes are samples of the fluid scale, not a competing one, which is why this
 * needed no decision about which is authoritative.
 */
/**
 * The viewport each Type mode samples — read from `breakpoint/*`, not restated. These were
 * literals here AND in legacy-ds-css.mjs, so 360/768/1280 lived in three places with nothing
 * to catch a drift between them.
 */
function breakpoints(tokens) {
  const px = (step) => {
    const t = tokens.find((x) => x.path.join(".") === `breakpoint.${step}`);
    if (!t) throw new Error(`figma-variables: breakpoint/${step} is missing — the Type modes ` +
      `sample the fluid curve at these viewports and cannot be placed without them.`);
    return parseFloat(t.$value ?? t.value);
  };
  return { Desktop: px("desktop"), Tablet: px("tablet"), Mobile: px("mobile") };
}

function fluidAt(min, max, viewport, wmin, wmax) {
  if (min === max) return min;
  const t = (viewport - wmin) / (wmax - wmin);
  const sampled = min + (max - min) * Math.min(1, Math.max(0, t));
  // A Tablet sample is a DESIGN value, not a measurement: it lands in a text style a
  // designer lays out with. Until 2026-09-04 it was kept to two decimals — display-1 at
  // 57.74px, its leading 63.51 — which is a size no one would ever author and which put
  // the Tablet mode off the grid the documentation promises. Whole pixels; tracking
  // (sub-pixel by nature) keeps one decimal.
  return Math.abs(sampled) < 4 ? Math.round(sampled * 10) / 10 : Math.round(sampled);
}


/** Ramp path segment → the folder the library already uses. */
const RAMP_FOLDER = {
  primaryScale: "Primary",
  secondaryScale: "Secondary",
  // `accent` joined 2026-08-11. Without an entry here the ramp still reached Palette, but
  // only at the six rungs the prominence ladder happens to alias — so a designer opening the
  // library found 11 steps of every other ramp and 6 of this one, with 400/500/700/900/950
  // simply absent. A ramp is a ramp; it is exported whole or it is not a ramp.
  accentScale: "Accent",
  neutralScale: "Neutral",
  successScale: "Success",
  dangerScale: "Danger",
  warningScale: "Warning",
  infoScale: "Info",
};

/**
 * Roots that live in the Color collection. The Tier-3 component matrix is here too, under a
 * `cmp/` prefix, because Figma will not let a variable move to a collection of its own —
 * the prefix is what makes the tier navigable in the picker instead.
 */
const COLOUR_ROOTS = new Set([
  "bg", "text", "icon", "border", "outline", "overlay", "focus",
  "action", "control", "spinner", "button", "card", "badge", "chart", "on", "layer",
]);

const SPACING_ROOTS = new Set(["inline", "stack", "padding", "section"]);

/**
 * Which collection a path belongs to. ROUTING ONLY — the NAME is the canonical path.
 *
 * Until 2026-08-10 this function also invented a display name per collection (`spacing-md`,
 * `Background/Neutral/Subtle`, `Neutral/0 - White`), and 435 of 669 names ended up differing
 * from the path they came from. That made the round-trip depend on a hand-written mapping
 * table instead of on the grammar, and put a hyphen inside 179 Figma segments — the exact
 * defect RULE 1 exists to remove. The library has since been renamed to the canonical paths,
 * so the table is gone and `name` is now derived, not chosen.
 */
function collectionFor(path, tier, type) {
  const [head, ...rest] = path;

  // Colour PRIMITIVES stay private: Figma's mode-aware ramp is the Tier-2 `color.*Scale.*`,
  // not the fixed Tier-1 hue, and both projected onto one name until this exclusion existed.
  if (tier === "ref" && head === "color") return null;

  // The legacy nested spacing roles are mirrored by the canonical top-level groups.
  if (head === "space" && SPACING_ROOTS.has(rest[0])) return null;

  if (head === "space" || SPACING_ROOTS.has(head)) return "Space";
  // `size` is the dimensional primitive under BOTH spacing and type, so it belongs with the
  // dimensional scales. The name tree keeps it distinct from `space` without a new collection.
  if (head === "size") return "Space";
  // Effect and viewport constants: mode-less, and neither is a spacing or a colour.
  if (head === "blur" || head === "breakpoint") return "Static";
  // Mark colours. Static because a logo's palette must NOT move: it is mode-less on purpose,
  // and putting it in Color — a collection whose job is to vary — would invite exactly the
  // brand-follows-the-mark bug these tokens exist to prevent.
  if (head === "brand") return "Static";
  // `radius` is the Tier-1 scale; `shape` is the Tier-2 group that aliases it and is what a
  // designer should bind to. Both belong in the Radius collection — the tier stays legible in
  // the variable name (`ref/radius/md` vs `shape/md`), exactly as it does in CSS.
  if (head === "radius" || head === "shape") return "Radius";
  if (head === "opacity") return "Static";
  // `z/*` is code-only — Figma has no z-axis property, so a variable for it is noise in the
  // panel. Routed to null so it lands in `unmapped` with the reason below (exclusionReason).
  if (head === "z") return null;
  // Tier-2 opacity. Sits with the Tier-1 `ref/opacity/*` it aliases, so a designer binding a
  // colour variable's opacity finds `alpha/8` and `ref/opacity/8` in one collection and picks
  // the Tier-2 one — the same pairing as `shape`/`ref/radius` and `stroke`/`ref/border/width`.
  if (head === "alpha") return "Static";
  if (head === "border" && rest[0] === "width") return "Static";
  // Tier-2 border width. Sits with the Tier-1 `border/width/*` it aliases and with
  // `control/border/width`, so every edge-weight token is findable in one collection.
  if (head === "stroke") return "Static";
  if (head === "motion") return "Motion";
  if (head === "density") return "Density";
  if (head === "font" || head === "leading" || head === "type") return "Type";

  if (head === "color") {
    const [group] = rest;
    if (RAMP_FOLDER[group] || group === "transparent") return "Palette";
    /**
     * The legacy code semantic tier (`color.text.default`, `color.border.subtle`, …) is NOT
     * exported. It is mirrored exactly by the canonical grammar namespace — tier2-parity
     * proves they agree in every axis block — so exporting both would put two names on one
     * value. It retires as call sites migrate, the way `--ds-*` did on 2026-08-12.
     */
    return null;
  }

  /**
   * Geometry that lives under a COLOUR root.
   *
   * `focus`, `icon` and `control` each own both a colour and a measurement — `focus/ring` is
   * a colour, `focus/width` is a number — so routing by the root alone put five FLOATs in the
   * colour collection. Route the measurement by what it IS, not by whose namespace it sits in.
   */
  // The layout grid and the pointer-target floors are DIMENSIONS, so they sit with the other
  // dimensional scales rather than with `container/*` in Static. That keeps each family whole
  // in one collection, and it is what gives them Space's WIDTH_HEIGHT + GAP scopes — the two
  // properties a designer actually binds a gutter, a page margin or a hit area to.
  // `layout/*` joins them for the same reason: a bar height, a sidebar width and a chrome
  // offset are dimensions a designer binds to WIDTH_HEIGHT. Without this case they emitted to
  // CSS but fell out of the Figma payload entirely, so the library could only ever have carried
  // them by hand — which is how `layout/bar/height` and `layout/flag/width` came to exist in
  // the library with nothing in the build defining them.
  // The resolved-per-viewport pair. Checked BEFORE the general `grid`/`container` rules
  // below, which would otherwise file them with the fixed rungs they select between.
  if (head === "container" && rest[0] === "page") return "Viewport";
  if (head === "grid" && rest[0] === "margin" && rest[1] === "page") return "Viewport";
  if (head === "grid" || head === "target" || head === "layout") return "Space";
  if (head === "container") return "Static";
  if (head === "focus" && (rest[0] === "width" || rest[0] === "offset")) return "Static";
  if (head === "icon" && rest[0] === "size") return "Space";
  // `control/radius` and `control/selection/radius` are corners; everything else under
  // `control` — border weights, the selection box, glyph, dot and gap — is a Static measurement.
  if (head === "control") return path[path.length - 1] === "radius" ? "Radius" : "Static";
  // Same class as the two above: `badge` is a COLOUR root, so the status dot's DIAMETER —
  // a measurement, bound to WIDTH_HEIGHT — went to the Color collection purely because of
  // whose namespace it sits in. Caught on the run that added it (2026-08-17), which is the
  // only reason it did not become another silently mis-filed FLOAT.
  if (head === "badge" && String(rest[0] ?? "").startsWith("dotSize")) return "Space";

  // `cmp/accessibilityBar/*` is the THIRD instance of this same trap, and the worst so far:
  // `accessibilityBar` is in none of the root sets, so collectionFor returned null and all
  // TWELVE of its tokens fell out of the Figma payload entirely — exactly the failure the
  // `layout/*` comment above describes. That is why the library carries `layout/bar/height`
  // and `layout/flag/width` by hand and has no `cmp/accessibilityBar/*` at all, and why the
  // master and the code describe the same 46px bar under two different names.
  //
  // It is also MIXED, so a single root rule cannot route it: three tokens are inverse state
  // layers (colours) and nine are measurements. Route by what each token IS, not by whose
  // namespace it sits in.
  if (head === "accessibilityBar") {
    const ABAR_DIMENSIONS = new Set([
      "height", "flagWidth", "flagHeight", "dividerWidth", "dividerHeight",
      "pillSize", "stepSize", "launchIconSize", "iconButtonSize",
    ]);
    return ABAR_DIMENSIONS.has(String(rest[0] ?? "")) ? "Space" : "Color";
  }

  // TIER 3 IS ROUTED BY TYPE, and this runs BEFORE the COLOUR_ROOTS check below because a
  // component's ROOT does not tell you what kind of token it is: `badge` is in COLOUR_ROOTS,
  // but `cmp/badge/dotSize` is a dimension and belongs with the other geometry in Space —
  // which is where the library already has it. Routing by root would send it to Color, and
  // Figma refuses to move a variable between collections, so the export would fork into a
  // second variable rather than update the existing one.
  //
  // Until 2026-08-18 the fall-through below was `return null`, meaning "silently omit from the
  // Figma export". cmp/accessibilityBar/* — eleven tokens defined in code and emitting
  // --sa-cmp-accessibilityBar-* into tokens.css — never reached the library at all, and a
  // designer hand-made ten variables to fill the gap because there was nothing to bind.
  if (tier === "cmp") {
    // A component radius is a radius. `cmp/button/radius` and `cmp/card/radius` sat in the
    // Color collection until 2026-09-04 because "Figma cannot move them" — it cannot, but a
    // page sweep can rebind their 52 consumers, and did, so they now live with every other
    // corner radius. A number in a colour collection is exactly the disorganisation a
    // designer notices first.
    if (rest[0] === "radius") return "Radius";
    if (type === "color") return "Color";
    if (type === "dimension" || type === "number") return "Space";
    throw new Error(
      `figma-variables: cannot route component token "cmp/${path.join("/")}" (type ${type ?? "unknown"}).\n` +
        `  A Tier-3 token the exporter cannot place is a BUG, not a filter — it would be dropped\n` +
        `  from the library silently, and the only recourse left to a designer is to hand-make a\n` +
        `  variable that code can never consume. Give it a $type, or extend collectionFor.`,
    );
  }

  if (COLOUR_ROOTS.has(head)) return "Color";

  // TIER 3 MUST NOT FALL THROUGH. Until 2026-08-18 it did, and the `return null` below meant
  // "silently omit from the Figma export" — no warning, no count, no failure. Component tokens
  // were routed by COMPONENT NAME against COLOUR_ROOTS, so a component reached designers only
  // if someone had remembered to add its name to that set. `cmp/accessibilityBar/*` never was:
  // eleven tokens defined in code, emitting --sa-cmp-accessibilityBar-* into tokens.css, absent
  // from the library. A designer hand-made ten variables to fill the gap, correctly, and they
  // could carry no codeSyntax because there was no way to know the generated name.
  //
  // Route by what the token IS rather than by a list someone has to maintain: a colour goes to
  // Color, a dimension to Space (alongside `layout/*` and `size/*`, which is what a component's
  // geometry aliases). The COLOUR_ROOTS branch above still runs first, so `cmp/button/radius`
  // and `cmp/card/radius` stay in the Color collection they already live in — Figma refuses to
  // move a variable between collections, so re-routing an existing one would orphan it.
  return null;
}

/**
 * Project a code path onto its Figma variable name.
 *
 * The name IS the path, with the tier as the first segment for Tier 1 and Tier 3. Figma
 * refuses to move a variable between collections (`variableCollectionId` is get-only), so
 * the collection cannot carry the tier — the name tree does, and Figma's variable picker
 * navigates it exactly like a collection.
 */
export function figmaNameFor(path, tier = "sys", type) {
  const collection = collectionFor(path, tier, type);
  if (!collection) return null;
  return { collection, name: canonicalFigmaName(path, tier) };
}

/**
 * The two type families whose Figma name must follow their CSS name, not their file.
 *
 * `font.role.*` and `font.tracking.*` are authored in primitive.json, so `tierOfFile` calls
 * them Tier 1 — but `buildResponsiveType()` ships them as the FLAT `--sa-type-*` scale, with
 * no `ref` marker, and that is the name apps consume and documentation quotes. So one token
 * carried two tiers: `--sa-type-display-1-size` in code (Tier 2) and `ref/font/role/display/1/size`
 * in Figma (Tier 1). A designer binding a text style had nothing else to bind, which is how
 * all 24 Noto Sans styles came to sit on `ref/*` — not carelessness, but the only name the
 * library offered.
 *
 * Project them onto the name the stylesheet already uses. `font/role/display/1/size` becomes
 * `type/display/1/size` and `font/tracking/heading` becomes `type/heading/tracking`, which is
 * exactly what `fromCssName("--sa-type-display-1-size")` parses back to — so the library and
 * the stylesheet finally agree, and binding one is no longer a tier violation.
 */
function typeScaleName(path) {
  if (path[0] !== "font") return null;
  if (path[1] === "role") return ["type", ...path.slice(2)];
  if (path[1] === "tracking") return ["type", ...path.slice(2), "tracking"];
  return null;
}

/** The tier marker is the first segment for Tier 1 and Tier 3; Tier 2 is unmarked (§4.1). */
export function canonicalFigmaName(path, tier) {
  const typeScale = typeScaleName(path);
  if (typeScale) return typeScale.join("/");
  return (tier === "sys" ? path : [tier, ...path]).join("/");
}

const COLOR_RE = /^(#|rgba?\(|hsla?\()/i;
const DIMENSION_RE = /^(-?\d*\.?\d+)(px|rem|em|ms|s|%)?$/;

/** Infer the Figma type. 517 tokens carry no DTCG `$type`, so this cannot depend on it. */
/** Parse a DTCG cubicBezier — the authored [x1, y1, x2, y2] or the projected CSS string. */
export function bezierOf(raw) {
  if (Array.isArray(raw) && raw.length === 4 && raw.every((n) => typeof n === "number")) return raw;
  const m = /cubic-bezier\(([^)]+)\)/.exec(String(raw));
  if (!m) return null;
  const pts = m[1].split(",").map((s) => Number(s.trim()));
  return pts.length === 4 && pts.every((n) => Number.isFinite(n)) ? pts : null;
}

export function figmaTypeOf(token) {
  const declared = token.$type ?? token.original?.$type;
  if (declared === "color") return { type: "COLOR" };
  if (declared === "fontFamily") return { type: "STRING" };
  // Figma's NATIVE motion types (Plugin API resolvedType TIMING | EASING, probed live on
  // 2026-09-04 — the bundled typings that listed only four types were stale). A duration is
  // a TIMING in milliseconds; a curve is an EASING carrying its cubic-bezier control points.
  // Figma Motion binds them directly, so a designer animates with the token, not a copy.
  if (declared === "duration") {
    const m = /^(-?\d*\.?\d+)(ms|s)?$/.exec(String(val(token) ?? "").trim());
    if (m) return { type: "TIMING", number: m[2] === "s" ? parseFloat(m[1]) * 1000 : parseFloat(m[1]) };
  }
  if (declared === "cubicBezier") {
    const b = bezierOf(val(token));
    if (b) return { type: "EASING", bezier: b };
  }
  const v = String(val(token) ?? "");
  if (COLOR_RE.test(v)) return { type: "COLOR" };
  const m = DIMENSION_RE.exec(v.trim());
  if (m) return { type: "FLOAT", number: parseFloat(m[1]), unit: m[2] ?? null };
  return { type: "STRING" };
}

/**
 * Brand value.
 *
 * Theme (light/dark/hc) has NO representation here: the live Color collection carries only
 * the two brand modes. Adding four more modes to a collection designers use daily is a
 * restructure, not a sync, so it stays an explicit open decision rather than something this
 * exporter does silently.
 */
function brandValue(token, brand) {
  const ext = token.original?.$extensions?.mosje ?? {};
  if (brand === "Navy" && ext.colorModes?.navy !== undefined) return ext.colorModes.navy;
  const raw = token.original?.$value ?? token.original?.value ?? val(token);
  // DTCG cubicBezier is authored as [x1, y1, x2, y2]; Figma holds the CSS string (a STRING
  // variable), which is also what the value-parity checksum was recorded against.
  if (Array.isArray(raw) && raw.length === 4 && raw.every((n) => typeof n === "number")) {
    return `cubic-bezier(${raw.join(", ")})`;
  }
  return raw;
}

/**
 * The theme override for a token, following the alias chain.
 *
 * The canonical namespace is pure aliases (`bg/neutral/base` -> `{color.bg.surface}`) and
 * it is the LEGACY token that carries `$extensions.mosje.themes`. Reading the override off
 * the canonical token alone would find nothing and silently emit the light value in every
 * mode — the accessibility themes would import as three identical copies.
 */
function themeOverride(token, theme, tokenByPath, depth = 0) {
  if (depth > 8) return undefined;
  const ext = token.original?.$extensions?.mosje ?? {};
  if (ext.themes?.[theme] !== undefined) return ext.themes[theme];
  const raw = token.original?.$value ?? token.original?.value;
  if (typeof raw === "string" && /^\{[^}]+\}$/.test(raw.trim())) {
    const next = tokenByPath.get(raw.trim().slice(1, -1));
    if (next) return themeOverride(next, theme, tokenByPath, depth + 1);
  }
  return undefined;
}

/**
 * Re-attach a Theme token's Light value to the brand-aware Color variable underneath it.
 *
 * Without this the whole split is broken. `bg/neutral/base` aliases `color.bg.surface`,
 * which aliases `color.neutral.0` — a private Tier-1 ramp with no Figma home — so the chain
 * bottoms out in a LITERAL #ffffff and the Navy brand is silently discarded for every one of
 * the 15 tokens that vary on both axes.
 *
 * The fix walks the chain looking for a path that some Color variable exposes. `Neutral/0 -
 * White` is `color.neutralScale.0`, which itself aliases `color.neutral.0` — so the *underlying*
 * path is the join, not the exported one. Hence the inverted index.
 */
function brandAwareAlias(token, tokenByPath, colorByUnderlying, nameByPath, depth = 0) {
  if (depth > 8) return null;
  const key = token.path.join(".");
  const direct = nameByPath.get(key);
  if (direct && direct.collection === "Palette") return direct;
  const viaUnderlying = colorByUnderlying.get(key);
  if (viaUnderlying) return viaUnderlying;

  const raw = token.original?.$value ?? token.original?.value;
  if (typeof raw === "string" && /^\{[^}]+\}$/.test(raw.trim())) {
    const next = tokenByPath.get(raw.trim().slice(1, -1));
    if (next) return brandAwareAlias(next, tokenByPath, colorByUnderlying, nameByPath, depth + 1);
  }
  return null;
}

/**
 * The token in this alias chain that OWNS the brand override, or null.
 *
 * Returning the owning TOKEN rather than a boolean matters: the companion emitted for it has
 * to carry a real authored path (`color/text/disabled`), not a synthetic one. A made-up path
 * fails "nothing vanishes", the codeSyntax round-trip and the literal-leak guard at once —
 * which is exactly what happened on the first attempt.
 */
function brandOwner(token, tokenByPath, depth = 0) {
  if (depth > 8) return null;
  // `navy` SPECIFICALLY, not "has any colorModes". The Palette collection models exactly one
  // brand axis — [Blue, Navy] — so that is the only variation Figma can express. A token whose
  // only overrides are the code-only `dbim-*` conformance modes has nothing brand-varying to
  // say HERE, and claiming it anyway promotes it out of the single-mode Color collection into
  // Palette as a new variable whose two modes are identical. That is a structural change to a
  // shared library in exchange for nothing, and it is what `overlay/neutral/boldest` did the
  // moment it was given DBIM inks: +1 Palette variable, and the Color entry demoted to an
  // alias, for a Blue-vs-Navy difference measured at dE 0.00.
  if (token.original?.$extensions?.mosje?.colorModes?.navy !== undefined) return token;
  const raw = token.original?.$value ?? token.original?.value;
  if (typeof raw === "string" && /^\{[^}]+\}$/.test(raw.trim())) {
    const next = tokenByPath.get(raw.trim().slice(1, -1));
    if (next) return brandOwner(next, tokenByPath, depth + 1);
  }
  return null;
}

/**
 * Figma interprets a number variable bound to an opacity — a layer's, or a colour variable's —
 * as a PERCENTAGE: 50 is 50%, 0.5 is half a percent. Verified 2026-09-04 by binding a probe
 * variable worth 50 to a rectangle and reading `node.opacity` back as 0.5. The CSS convention
 * is 0–1, so the `opacity/*` and `alpha/*` scales are authored 0–1 and projected ×100 here.
 */
const FIGMA_OPACITY_SCALE = 100;

/**
 * Alias-with-opacity. Figma variables can alias a colour "while maintaining a separate
 * opacity", and that opacity can itself be a number variable
 * (help.figma.com/hc/en-us/articles/14506821864087#colorvar). The payload states exactly that:
 *
 *   { type: "ALIAS", collection: "Palette", name: "color/accentScale/600",
 *     opacity: { type: "ALIAS", collection: "Static", name: "alpha/8" },
 *     fallback: { type: "COLOR", value: "rgba(4, 106, 56, 0.08)" } }
 *
 * HOW FIGMA STORES IT, learned 2026-09-04 from a read-back after the bindings were made in
 * the UI: not as an alias with an opacity field but as a VARIABLE EXPRESSION —
 *
 *   { type: "VARIABLE_EXPRESSION", expressionFunction: "COMPOSE_COLOR",
 *     expressionArguments: [ { type: "VARIABLE_ALIAS", id: <base> }, { type: "VARIABLE_ALIAS", id: <alpha> } ] }
 *
 * — and `setValueForMode` ACCEPTS that shape (probed on a temporary variable), so a push can
 * write the binding itself; the 32 alpha/0 resting fills were written that way. Every earlier
 * attempt had put the opacity ON the alias object, which is what the help page implies and
 * what the API rejects. A read-back normalises an expression as `->base@->alpha/N`, which is
 * exactly what normValue produces for this payload shape, so the two halves of
 * figma-value-parity agree once the library holds the expressions.
 *
 * `fallback` is the composited literal, kept for any writer that cannot express the binding.
 */
function applyAlpha(valuesByMode, alphaRef, nameByPath, resolvedByPath, tokenByPath) {
  const alphaKey = alphaRef.trim().slice(1, -1);
  const alphaTarget = nameByPath.get(alphaKey);
  const alphaValue = Number(resolvedByPath.get(alphaKey));
  if (!alphaTarget || !Number.isFinite(alphaValue)) {
    throw new Error(`alpha reference ${alphaRef} has no Figma home or no resolved value`);
  }
  for (const mode of Object.keys(valuesByMode)) {
    const v = valuesByMode[mode];
    if (v.type === "ALIAS") {
      // Resolve the aliased colour to a literal for the fallback. The alias target is a
      // Figma NAME; walk back to a path through the same map.
      const basePath = [...nameByPath.entries()].find(([, t]) => t.collection === v.collection && t.name === v.name)?.[0];
      // The fallback is written INTO a mode, so it has to be that mode's colour: the Navy
      // fallback of color/transparent/primary/8 is navy's primaryScale/500, not blue's.
      const baseHex = basePath !== undefined ? brandLiteral(basePath, mode, tokenByPath, resolvedByPath) : undefined;
      valuesByMode[mode] = {
        ...v,
        opacity: { type: "ALIAS", collection: alphaTarget.collection, name: alphaTarget.name },
        ...(typeof baseHex === "string" ? { fallback: { type: "COLOR", value: withAlpha(baseHex, alphaValue) } } : {}),
      };
    } else if (v.type === "COLOR") {
      valuesByMode[mode] = { type: "COLOR", value: withAlpha(v.value, alphaValue) };
    }
  }
}

/**
 * The literal a token path resolves to IN A BRAND MODE, following the alias chain and taking
 * each token's `colorModes` override where the mode has one. Falls back to the build's
 * (Blue) resolution when nothing on the chain varies.
 */
function brandLiteral(path, mode, tokenByPath, resolvedByPath, depth = 0) {
  const token = tokenByPath.get(path);
  if (!token || depth > 12) return resolvedByPath.get(path);
  const raw = brandValue(token, mode);
  if (typeof raw === "string" && /^\{[^}]+\}$/.test(raw.trim())) {
    return brandLiteral(raw.trim().slice(1, -1), mode, tokenByPath, resolvedByPath, depth + 1);
  }
  return typeof raw === "string" ? raw : resolvedByPath.get(path);
}

/** `#rrggbb` (or rgb()/rgba()) at a given alpha, as an rgba() string. */
function withAlpha(colour, alpha) {
  const s = String(colour).trim();
  let r, g, b;
  const hex = /^#([0-9a-f]{6})$/i.exec(s);
  const fn = /^rgba?\(([^)]+)\)$/i.exec(s);
  if (hex) {
    r = parseInt(hex[1].slice(0, 2), 16); g = parseInt(hex[1].slice(2, 4), 16); b = parseInt(hex[1].slice(4, 6), 16);
  } else if (fn) {
    [r, g, b] = fn[1].split(",").map((x) => parseFloat(x));
  } else {
    throw new Error(`withAlpha: cannot parse colour ${s}`);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

function encodeValue(raw, token, nameByPath, resolvedByPath, selfTarget) {
  if (typeof raw === "string" && /^\{[^}]+\}$/.test(raw.trim())) {
    const key = raw.trim().slice(1, -1);
    const target = nameByPath.get(key);
    // A canonical Tier-2 token is a pure alias of the legacy token it replaces, and BOTH
    // project onto the same library name (`focus/ring` and `color/focus/ring` are both
    // `Focus/Ring`). Aliasing there would make the variable point at itself — a cycle Figma
    // cannot resolve. Fall through to the literal instead.
    const isSelf =
      target && selfTarget && target.collection === selfTarget.collection && target.name === selfTarget.name;
    if (target && !isSelf) return { type: "ALIAS", collection: target.collection, name: target.name };
    // The referent is a private Tier-1 primitive with no Figma home. Resolve it to its
    // LITERAL value — emitting the reference string produced `{color.primaryRamp.light.500}`
    // as a COLOR, which would have imported as a broken swatch on every brand ramp.
    const resolved = resolvedByPath.get(key);
    if (resolved !== undefined) raw = resolved;
  }
  // DTCG cubicBezier is authored as [x1, y1, x2, y2]; Figma holds the CSS string as a STRING
  // variable — the form the value-parity record was made against.
  if (Array.isArray(raw) && raw.length === 4 && raw.every((n) => typeof n === "number")) {
    raw = `cubic-bezier(${raw.join(", ")})`;
  }
  const t = figmaTypeOf({ ...token, $value: raw, original: { $value: raw, $type: token.original?.$type } });
  // WEIGHT IS CHECKED BEFORE FLOAT, because a CSS weight IS a number and would otherwise be
  // projected as one. Figma has no numeric weight: a text style selects a cut by STYLE NAME,
  // so the variable must be a STRING scoped FONT_STYLE. See figmaFontStyle.
  if (token.path?.[0] === "font" && token.path?.[1] === "weight") {
    return { type: "STRING", value: figmaFontStyle(raw, token.path?.[2]) };
  }
  if (t.type === "FLOAT") return { type: "FLOAT", value: t.number, unit: t.unit };
  if (t.type === "TIMING") return { type: "TIMING", value: t.number };
  if (t.type === "EASING") {
    const [x1, y1, x2, y2] = t.bezier;
    return { type: "EASING", value: { x1, y1, x2, y2 } };
  }
  if (token.path?.[0] === "font" && token.path?.[1] === "family") {
    return { type: t.type, value: primaryFontFamily(raw) };
  }
  return { type: t.type, value: String(raw) };
}

/**
 * CSS numeric weight -> the STYLE NAME Figma addresses that cut by.
 *
 * The same shape of mismatch as `primaryFontFamily`, one axis over. A stylesheet says
 * `font-weight: 700`; Figma has no numeric weight at all — a text style names `fontName.style`,
 * and the picker offers `Regular` / `Medium` / `SemiBold` / `Bold`. Projecting the number gave
 * the payload a FLOAT for a variable the library correctly holds as a STRING, so the two
 * disagreed on all four weights and could not be reconciled from the Figma side: a variable's
 * `resolvedType` is fixed at creation, so pushing 700 into a STRING was impossible — and would
 * have broken every text style bound to it if it were not.
 *
 * That is why this is fixed HERE and not by a push. The library was already right; the payload
 * was wrong, and it was the payload claiming a difference that made the two look out of sync.
 *
 * The full 100-900 ladder is mapped, not just the four in use, so adding `light` or `black` to
 * the source does not silently reintroduce a FLOAT. An unmapped value falls back to its own
 * string rather than a guess — a wrong style name binds to nothing, and a visible
 * `"350"` in the picker is easier to diagnose than a plausible-but-absent `"Book"`.
 */
const FIGMA_FONT_STYLES = new Map([
  [100, "Thin"], [200, "ExtraLight"], [300, "Light"], [400, "Regular"], [500, "Medium"],
  [600, "SemiBold"], [700, "Bold"], [800, "ExtraBold"], [900, "Black"],
]);

/**
 * Cuts Figma addresses by a compound style name, which no number can reach.
 *
 * `displayMedium` is 500 on the Display cut. Figma models that cut as a STYLE of Noto Sans
 * ("Display Medium"), not as a family, so projecting its 500 would give "Medium" — a real
 * style, on the wrong drawing, silently. Keyed by the token's own name for that reason.
 */
const FIGMA_STYLE_BY_NAME = new Map([["displayMedium", "Display Medium"]]);

function figmaFontStyle(weight, name) {
  if (name && FIGMA_STYLE_BY_NAME.has(name)) return FIGMA_STYLE_BY_NAME.get(name);
  const n = Number(weight);
  if (Number.isFinite(n) && FIGMA_FONT_STYLES.has(n)) return FIGMA_FONT_STYLES.get(n);
  return String(weight);
}

/**
 * CSS generics name no font — they are instructions to the browser's font matcher.
 * Figma has no equivalent, so they can never be a FONT_FAMILY variable's value.
 */
const CSS_GENERIC_FAMILIES = new Set([
  "ui-sans-serif", "ui-serif", "ui-monospace", "ui-rounded", "system-ui",
  "sans-serif", "serif", "monospace", "cursive", "fantasy", "emoji", "math", "fangsong",
]);

/**
 * Families the web serves standalone that Figma models as a STYLE of another family.
 *
 * Noto Sans ships its optical Display cut two ways for two font models: Google Fonts serves it
 * as its own family (`Noto Sans Display`), while Figma exposes it as nine styles of Noto Sans
 * — `Display Regular`, `Display Medium`, `Display SemiBold`, and so on. Same drawing, different
 * addressing.
 *
 * So the CSS stack must name `Noto Sans Display` (that is the family a browser loads) and the
 * Figma VARIABLE must say `Noto Sans` (that is the family a designer picks), with the cut
 * selected by the text style's STYLE. Projecting the CSS name verbatim gave Figma a family it
 * does not have, which is why `ref/font/family/display` was unresolvable and bound to nothing.
 */
const FIGMA_FAMILY_ALIASES = new Map([["Noto Sans Display", "Noto Sans"]]);

/**
 * Project a CSS font stack down to the one family Figma can actually resolve.
 *
 * A Figma FONT_FAMILY variable is a FONT PICKER VALUE, not a CSS declaration — it must name a
 * single family that exists. The source authors these as stacks because that is what the
 * stylesheet needs, and projecting the stack verbatim shipped four variables Figma could not
 * resolve at all:
 *
 *   ref/font/family/latin       "Noto Sans", ui-sans-serif, system-ui, sans-serif
 *   ref/font/family/devanagari  "Noto Sans Devanagari", "Noto Sans", ui-sans-serif, …
 *   ref/font/family/display     "Noto Sans Display", "Noto Sans", ui-sans-serif, …
 *   ref/font/family/mono        ui-monospace, "Cascadia Code", "Source Code Pro", …
 *
 * All four were published and scoped FONT_FAMILY, so they appeared in the picker and bound to
 * nothing — which is exactly why the 2026-08-11 audit found `latin`, `display` and `mono`
 * orphaned. They were not neglected; they were unusable.
 *
 * Only `heading` and `body` worked, because those happen to be authored as a bare family name.
 *
 * The first non-generic entry is the right projection: it is the family the browser will
 * actually reach for first, so Figma and the build agree on what the reader sees.
 */
function primaryFontFamily(stack) {
  const unquote = (s) => s.trim().replace(/^["']|["']$/g, "").trim();
  for (const part of String(stack).split(",")) {
    const name = unquote(part);
    if (name && !CSS_GENERIC_FAMILIES.has(name)) return FIGMA_FAMILY_ALIASES.get(name) ?? name;
  }
  return unquote(String(stack));
}

/**
 * Attach the contrast contract, as a MEASUREMENT rather than an assertion.
 *
 * This runs as a second pass over the finished payload because a token's contrast cannot be
 * known while the payload is still being built: the value is reached through an alias into
 * the brand-aware Color collection, which does not exist yet mid-loop. Measuring after the
 * fact is what lets the note state a number instead of a hope.
 *
 * Anything the audit does not return gets NO contrast sentence at all — Tier-3 actions,
 * numbers, disabled states, ramp steps, and every token whose value could not be resolved.
 * See build/contrast-contract.mjs for why silence is the right output there.
 */
function applyContractNotes(payload) {
  const records = auditPayload(payload);
  const byKey = new Map(records.map((r) => [`${r.collection}::${r.name}`, r]));

  // The human name of each surface, so the note reads as prose rather than as a path.
  const labelByPath = new Map();
  for (const c of payload.collections) for (const v of c.variables) if (!labelByPath.has(v.path)) labelByPath.set(v.path, v.name);

  for (const c of payload.collections) {
    for (const v of c.variables) {
      const record = byKey.get(`${c.name}::${v.name}`);
      if (!record) continue;
      // Name EVERY ground the number was taken against. `measured` is the worst of them, so
      // naming only the first would attribute a muted-ground figure to the white one — the
      // precise kind of false claim this module exists to prevent.
      const label = (record.surfaces ?? [record.surface])
        .map((s) => labelByPath.get(s) ?? s)
        .join(" and ");
      const note = contractNote(record, label);
      v.description = [v.description, note].filter(Boolean).join(" ");
      v.$extensions = {
        ...v.$extensions,
        // Published so the gate can check the claim against the same number the library
        // shows, instead of recomputing it from a second, drifting implementation.
        "in.gov.mosje.contrast": { rung: record.rung, min: record.minContrast, measured: record.measured, meets: record.meets },
      };
    }
  }
  return records;
}

/** The custom property this token actually ships as (font/role feeds --sa-type-*). */
/**
 * WHICH PICKERS OFFER A VARIABLE. The agreed rule: a designer is offered the Tier-2 alias and
 * only the alias. Every Tier-1 `ref/*` primitive is therefore unscoped — it stays in the
 * variables panel for maintainers and appears in no property picker — and each alias is
 * scoped to the one or two properties it is FOR, never ALL_SCOPES. The library had drifted
 * from this in 109 places (ref/space/* offered as gaps, ref/radius/* as radii, ref/color/*
 * orphans as fills, twelve motion tokens in every picker); the payload now states the scope
 * and the push writes it.
 *
 * `alpha/*` carries COLOR_OPACITY — Figma's "Color variable opacity" scope, the one that
 * lets a number drive a colour alias's opacity. The Plugin API this estate pushes through
 * (apiVersion 1.0.0) can READ that value but rejects it on write, so the push keeps whatever
 * the UI set on those thirteen variables and reports the skip.
 */
/** Published visibility follows the name a designer sees, not the file the token came from. */
export function isHiddenName(figmaName, collection) {
  return figmaName.startsWith("ref/") || collection === "Palette";
}

export function scopesFor(path, tier, type, figmaName) {
  // Keyed on the LIBRARY name, not the source path: `font/role/display/1/size` is Tier-1 in
  // the source but publishes as the Tier-2 `type/display/1/size`, and a component token's
  // path has no `cmp/` head while its name does. The name is what the designer sees.
  const seg = figmaName.split("/");
  const [head, ...rest] = seg;
  const tail = seg[seg.length - 1];
  if (head === "ref") return [];
  if (/^_?deprecated$/.test(head)) return [];
  if (type === "COLOR") {
    if (head === "text") return ["TEXT_FILL"];
    if (head === "icon" || head === "on") return ["SHAPE_FILL", "TEXT_FILL"];
    if (head === "border") return ["STROKE_COLOR", "SHAPE_FILL"];
    if (head === "focus") return ["STROKE_COLOR", "EFFECT_COLOR"];
    if (head === "chart") return ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR"];
    if (head === "brand") return ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"];
    if (head === "color") {
      // The Tier-2 scales and overlay tiers are the bindable palette; a Palette-collection
      // companion of a role token (color/text/disabled) keeps its role's scope.
      if (rest[0] === "text") return ["TEXT_FILL"];
      // Every colour scope named, never `ALL_FILLS` — the wildcard the standard says not to
      // ship. A palette rung may legitimately be any of the five; it is still five, not "all".
      return ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR", "EFFECT_COLOR"];
    }
    if (head === "cmp") {
      if (/text|label|ink/i.test(tail)) return ["TEXT_FILL"];
      if (/border|stroke|outline/i.test(tail)) return ["STROKE_COLOR"];
      return ["FRAME_FILL", "SHAPE_FILL"];
    }
    return ["FRAME_FILL", "SHAPE_FILL"]; // bg, layer, overlay
  }
  if (head === "font") {
    if (rest[0] === "weight") return type === "STRING" ? ["FONT_STYLE"] : ["FONT_WEIGHT"];
    return ["FONT_FAMILY"];
  }
  if (type === "STRING") return [];
  // Timing and Easing are bound by Figma Motion by TYPE; they take no property scope.
  if (type === "TIMING" || type === "EASING") return [];
  // FLOAT
  if (head === "alpha") return ["OPACITY", "COLOR_OPACITY"];
  if (head === "shape" || tail === "radius") return ["CORNER_RADIUS"];
  if (head === "stroke" || (head === "control" && rest.includes("border")) || head === "focus") return ["STROKE_FLOAT"];
  // `control/selection/gap` is the box-to-label gap — a GAP, like the spacing ladder.
  if (head === "control" && tail === "gap") return ["GAP"];
  if (head === "blur") return ["EFFECT_FLOAT"];
  if (head === "type" || head === "leading") {
    if (tail === "size") return ["FONT_SIZE"];
    // `lhDevanagari` is the Hindi block's line height at the same size — a pixel value like
    // `lh`, so it binds. (The OFFSET it is derived from is a ratio and lives under ref/font,
    // scoped to nothing, precisely so it cannot be bound as 0.2px.)
    if (tail === "lh" || tail === "lhDevanagari" || head === "leading") return ["LINE_HEIGHT"];
    if (tail === "tracking") return ["LETTER_SPACING"];
    if (tail === "para") return ["PARAGRAPH_SPACING"];
    return [];
  }
  if (["inline", "stack", "padding", "section"].includes(head)) return ["GAP"];
  if (head === "target") return rest[0] === "spacing" ? ["GAP"] : ["WIDTH_HEIGHT"];
  if (head === "grid") return rest[0] === "columns" ? [] : ["GAP", "WIDTH_HEIGHT"];
  if (["size", "icon", "container", "layout", "control"].includes(head)) return ["WIDTH_HEIGHT"];
  if (head === "density") return ["GAP", "WIDTH_HEIGHT"];
  if (head === "cmp") {
    if (/gap|padding|spacing/i.test(tail)) return ["GAP"];
    if (/stroke|border/i.test(tail)) return ["STROKE_FLOAT"];
    return ["WIDTH_HEIGHT"];
  }
  // motion, z, breakpoint: nothing in Figma binds these — visible in the panel, offered nowhere.
  return [];
}

function emittedCssName(token, tier) {
  const [head, kind, ...rest] = token.path;
  if (head === "font" && kind === "role") return `--sa-type-${rest.join("-")}`;
  if (head === "font" && kind === "tracking") return `--sa-type-${rest.join("-")}-tracking`;
  return toCssName(token.path, tier);
}

/**
 * Why a token has no Figma home. Every exclusion must be explainable — an unexplained one is
 * indistinguishable from a bug, and 231 of them were shipping with no reason attached.
 */
export function exclusionReason(path, tier) {
  const [head, ...rest] = path;
  if (tier === "ref" && head === "color") {
    return "private Tier-1 colour ramp — designers bind to the mode-aware Color/Theme layer";
  }
  if (head === "shadow" || head === "elevation") {
    return "Figma models shadows as EFFECT STYLES, not variables — exported separately";
  }
  if (head === "z") {
    return "code-only — Figma has no z-axis property, so layering cannot be bound on a canvas";
  }
  if (head === "code") {
    // Deliberate, not an oversight. code/* is the chrome around a CODE SPECIMEN in the web
    // documentation — a terminal window and its syntax parts. Figma's own documentation
    // pages show code as text and images, so a designer never binds to these; publishing
    // them would add thirteen variables to the Palette picker that no frame can use.
    // Revisit only if the library starts rendering live code blocks.
    return "web documentation chrome — Figma shows code as text, so there is nothing to bind";
  }
  if (head === "space" && rest.length > 1) {
    return "legacy nested spacing role, mirrored by the canonical top-level group";
  }
  if (head === "color") return "legacy semantic path, mirrored by the canonical grammar namespace";
  if (head === "font") return "no Figma variable equivalent for this font property";
  return "no mapping defined for this path";
}

export function buildPayload(dictionary) {
  const tokens = dictionary.allTokens;
  const BP = breakpoints(tokens);
  const live = liveSnapshot();

  // Path → fully-resolved value, for references whose target is not exported.
  const resolvedByPath = new Map(tokens.map((t) => [t.path.join("."), val(t)]));
  // Path → token, so a theme override can be found through an alias chain.
  const tokenByPath = new Map(tokens.map((t) => [t.path.join("."), t]));

  const nameByPath = new Map();
  for (const t of tokens) {
    const target = figmaNameFor(t.path, tierOfFile(t.filePath), t.$type ?? t.type);
    if (target) nameByPath.set(t.path.join("."), target);
  }

  // Inverted index: the Tier-1 path a Color variable exposes → that Color variable.
  // `Neutral/0 - White` comes from `color.neutralScale.0`, which aliases `color.neutral.0`;
  // a Theme token's chain reaches the latter, so that is what has to be searchable.
  const colorByUnderlying = new Map();
  for (const t of tokens) {
    const target = figmaNameFor(t.path, tierOfFile(t.filePath), t.$type ?? t.type);
    if (!target || target.collection !== "Palette") continue;
    const raw = t.original?.$value ?? t.original?.value;
    if (typeof raw === "string" && /^\{[^}]+\}$/.test(raw.trim())) {
      colorByUnderlying.set(raw.trim().slice(1, -1), target);
    }
  }

  const collections = Object.fromEntries(
    Object.entries(COLLECTIONS).map(([name, meta]) => [name, { name, ...meta, variables: [] }]),
  );
  const unmapped = [];
  const seen = new Set();
  /** Theme tokens needing a brand-aware companion in Color (see the emit pass below). */
  const companions = new Map();

  // Canonical (generated) tokens are processed FIRST so they win a name collision over the
  // legacy path that mirrors them — `focus/ring` should own `Focus/Ring`, not
  // `color/focus/ring`. Without this the winner was whichever file happened to load first.
  const ordered = [...tokens].sort(
    (a, b) =>
      (/\.generated\.json$/.test(b.filePath ?? "") ? 1 : 0) -
      (/\.generated\.json$/.test(a.filePath ?? "") ? 1 : 0),
  );

  for (const token of ordered) {
    const tier = tierOfFile(token.filePath);
    const target = figmaNameFor(token.path, tier, token.$type ?? token.type);
    if (!target) {
      unmapped.push(`${token.path.join("/")} (${exclusionReason(token.path, tier)})`);
      continue;
    }
    // Two code paths can legitimately project onto one library name (a canonical Tier-2
    // alias and the legacy token it points at). First writer wins; the duplicate is reported.
    const key = `${target.collection}::${target.name}`;
    if (seen.has(key)) {
      unmapped.push(`${token.path.join("/")} (collides with an earlier token on ${key})`);
      continue;
    }
    seen.add(key);

    const collection = collections[target.collection];
    // A weight is a STRING in Figma (a cut is addressed by style name — see figmaFontStyle), so
    // the row's type must say so too. The value encoder already did; the row did not, and the
    // payload shipped `type: "FLOAT"` over "SemiBold" for six variables until 2026-09-05.
    const { type } = token.path?.[0] === "font" && token.path?.[1] === "weight"
      ? { type: "STRING" }
      : figmaTypeOf(token);
    const fluid = token.original?.$extensions?.mosje?.type;

    const valuesByMode = {};
    for (const mode of collection.modes) {
      let raw;
      if (target.collection === "Palette") {
        raw = brandValue(token, mode);
      } else if (target.collection === "Color") {
        // Light is the base value — which aliases into Color and therefore stays brand-aware.
        // Dark/HC take the override where one exists, else fall back to Light so a token that
        // does not vary on theme reads identically in all three modes.
        const key = mode === "Dark" ? "dark" : mode === "HC" ? "hc" : null;
        const override = key ? themeOverride(token, key, tokenByPath) : undefined;
        if (override !== undefined) {
          raw = override;
        } else {
          // A Tier-2 colour that references ANOTHER Tier-2 colour carrying its own alpha
          // (`cmp/accessibilityBar/hoverBg` -> `overlay/brand/hover`, which is neutral/0 at
          // alpha/8) aliases THAT variable, not the rung beneath it. Following the chain to the
          // Palette dropped the alpha: the payload said `->color/neutralScale/0` — opaque white —
          // for a wash the library correctly holds as `->overlay/brand/hover`. Found 2026-09-05
          // as the one remaining Color value difference between payload and library.
          const rawRef = token.original?.$value ?? token.original?.value;
          const refKey = typeof rawRef === "string" && /^\{[^}]+\}$/.test(rawRef.trim()) ? rawRef.trim().slice(1, -1) : null;
          const refTarget = refKey ? nameByPath.get(refKey) : null;
          const refToken = refKey ? tokenByPath.get(refKey) : null;
          if (refTarget?.collection === "Color" && refToken?.original?.$extensions?.mosje?.alpha && !token.original?.$extensions?.mosje?.alpha) {
            valuesByMode[mode] = { type: "ALIAS", collection: "Color", name: refTarget.name };
            continue;
          }
          // Light (and any theme with no override): alias the brand-aware Color variable so
          // Blue/Navy still flows through. Falling back to a literal would drop the brand.
          const brandAware = brandAwareAlias(token, tokenByPath, colorByUnderlying, nameByPath);
          if (brandAware) {
            valuesByMode[mode] = { type: "ALIAS", collection: brandAware.collection, name: brandAware.name };
            continue;
          }
          // No alias target, yet the chain still varies on brand — e.g. `text/neutral/disabled`,
          // a literal rgba(31,36,40,.48) on Blue with a DIFFERENT literal on Navy. Emitting the
          // literal would silently drop the Navy brand, so a brand-aware companion is generated
          // in Color and aliased instead.
          const owner = brandOwner(token, tokenByPath);
          // Keyed by the OWNER, not the target: `color.text.disabled` is the brand source for
          // 18 different Theme tokens (every disabled label across the Action matrix), and
          // keying by target created 18 copies of one authored path. One source, many aliases.
          //
          // The owner may BE this token — `focus/ring` carries its own brand override and
          // lives in Theme, which has no brand axis. It still needs a Color companion, so the
          // test is "does the owner already sit in a brand-capable collection", not "is the
          // owner mapped at all".
          const ownerTarget = owner && nameByPath.get(owner.path.join("."));
          if (owner && ownerTarget?.collection !== "Palette") {
            // The companion is a SECOND presence for one authored token, so it takes that
            // token's canonical path verbatim. It used to be Title-Cased and stripped of its
            // `color` head (`color.text.disabled` -> `Text/Disabled`), which made it the one
            // family of variables whose Figma name could not be derived from its path.
            const companionName = canonicalFigmaName(owner.path, tierOfFile(owner.filePath));
            companions.set(owner.path.join("."), { owner, name: companionName });
            valuesByMode[mode] = { type: "ALIAS", collection: "Palette", name: companionName };
            continue;
          }
          raw = token.original?.$value ?? token.original?.value ?? val(token);
        }
      } else if (target.collection === "Type" && fluid) {
        const [surface, breakpoint] = mode.split(" · ");
        const bounds = fluid[surface.toLowerCase()];
        raw = bounds
          ? fluidAt(parseFloat(bounds.min), parseFloat(bounds.max), BP[breakpoint], BP.Mobile, BP.Desktop)
          : (token.original?.$value ?? val(token));
      } else if (target.collection === "Viewport") {
        // Authored per mode in the token source, exactly as Density authors `compact`, so the
        // ladder lives with the tokens rather than hardcoded here. Falls back to $value, which
        // is the mobile-first base.
        raw = token.original?.$extensions?.mosje?.viewport?.[mode]
          ?? token.original?.$value ?? val(token);
      } else if (target.collection === "Density" && mode === "Compact") {
        raw = token.original?.$extensions?.mosje?.themes?.compact ?? token.original?.$value ?? val(token);
      } else {
        raw = token.original?.$value ?? token.original?.value ?? val(token);
      }
      valuesByMode[mode] = encodeValue(raw, token, nameByPath, resolvedByPath, target);
    }
    // A translucent token: the base resolved above, now attach its opacity.
    const alphaRef = token.original?.$extensions?.mosje?.alpha;
    if (alphaRef) applyAlpha(valuesByMode, alphaRef, nameByPath, resolvedByPath, tokenByPath);
    // Figma reads a number bound to an opacity as a PERCENTAGE. See FIGMA_OPACITY_SCALE.
    if (type === "FLOAT" && (token.path[0] === "opacity" || token.path[0] === "alpha")) {
      for (const mode of Object.keys(valuesByMode)) {
        const v = valuesByMode[mode];
        if (v.type === "FLOAT") valuesByMode[mode] = { ...v, value: Math.round(v.value * FIGMA_OPACITY_SCALE * 1e6) / 1e6 };
      }
    }

    /**
     * Description = what it is FOR, then what it is WORTH.
     *
     * Authored prose wins where it exists — someone wrote it about this token specifically.
     * Otherwise the guidance vocabulary supplies a "use when…" sentence derived from the path,
     * so no semantic token reaches a designer with nothing to go on. The measured contrast is
     * appended afterwards by applyContractNotes(), once the value can actually be resolved.
     */
    const authored = token.$description ?? token.original?.$description ?? "";
    const guidance = tier === "ref"
      ? primitivePointer(token.path)
      : guidanceFor(token.path, tier, parse);
    const description = tier === "ref"
      ? [authored, guidance].filter(Boolean).join(" ")
      : authored || guidance || "";

    collection.variables.push({
      name: target.name,
      path: token.path.join("/"),
      type,
      valuesByMode,
      ...(description ? { description } : {}),
      codeSyntax: { WEB: `var(${emittedCssName(token, tier)})` },
      scopes: scopesFor(token.path, tier, type, target.name),
      // .claude/rules/figma-variables-standard.md §4: a Tier-1 primitive exists only to be
      // aliased, so consumers never see it; the semantic and component tiers publish. Keyed on
      // the LIBRARY name, like scopesFor: `font/role/*` is Tier-1 in the source but publishes
      // as the Tier-2 `type/*` a text style binds, and a designer may bind it too. Palette is
      // Tier 1 by role — the brand ramps every Color role aliases — and hides whole, so a
      // consuming file sees the semantic layer and nothing beneath it.
      hiddenFromPublishing: isHiddenName(target.name, target.collection),
      status: live?.[target.collection]?.includes(target.name) ? "existing" : "new",
      $extensions: { "in.gov.mosje.tier": tier, "in.gov.mosje.source": token.filePath },
    });
  }

  const counts = Object.fromEntries(
    Object.values(collections).map((c) => [
      c.name,
      {
        total: c.variables.length,
        new: c.variables.filter((v) => v.status === "new").length,
        existing: c.variables.filter((v) => v.status === "existing").length,
      },
    ]),
  );

  for (const { owner: token, name } of companions.values()) {
    if (seen.has(`Palette::${name}`)) continue;
    seen.add(`Palette::${name}`);
    collections["Palette"].variables.push({
      name,
      path: token.path.join("/"),
      // A companion is a SECOND presence for one authored token: the brand source in Color,
      // consumed by the appearance layer in Theme. `focus/ring` is both. Flagged so the
      // duplicate-export check can tell a deliberate pair from an accidental one.
      role: "brand-source",
      type: "COLOR",
      status: live?.["Palette"]?.includes(name) ? "existing" : "new",
      valuesByMode: Object.fromEntries(
        COLLECTIONS["Palette"].modes.map((m) => {
          const raw = brandValue(token, m);
          const lit = typeof raw === "string" && raw.trim().startsWith("{")
            ? resolvedByPath.get(raw.trim().slice(1, -1)) ?? raw
            : raw;
          return [m, { type: "COLOR", value: String(lit) }];
        }),
      ),
      description:
        `Brand-aware source for Theme::${name}. Generated because that token’s light value is ` +
        `a literal that differs between Blue and Navy; without it the Navy brand is lost.`,
      codeSyntax: { WEB: `var(${toCssName(token.path, tierOfFile(token.filePath))})` },
      scopes: scopesFor(token.path, tierOfFile(token.filePath), "COLOR", name),
      hiddenFromPublishing: isHiddenName(name, "Palette"),
    });
  }

  for (const { owner: token } of companions.values()) {
    const prefix = token.path.join("/") + " (";
    const i = unmapped.findIndex((u) => u.startsWith(prefix));
    if (i !== -1) unmapped.splice(i, 1);
  }

  const payload = {
    $schema: "samavesh-figma-variables/2",
    $description:
      "GENERATED by @mosje/tokens, targeted at the live SAMAVESH library's nine collections " +
      "(Space, Palette, Color, Type, Radius, Motion, Density, Static, Viewport). Variables are " +
      "keyed by the name the library already uses; `status` says whether an import adds or " +
      "updates. Colour is split across two collections: Palette carries the BRAND axis " +
      "(Blue|Navy) and Color is the single-mode semantic layer that aliases into it. Every " +
      "variable carries the five fields .claude/rules/figma-variables-standard.md requires: " +
      "name = DTCG path, description, narrowest true scopes, codeSyntax.WEB, and " +
      "hiddenFromPublishing by the tier of the LIBRARY name (ref/* and all of Palette hide). See spec §8.4.",
    counts,
    unmapped,
    collections: Object.values(collections).filter((c) => c.variables.length),
  };

  // Every contrast sentence in this payload is a measurement taken here, on these values.
  // `contrast.shortfall` is the honest count of tokens whose RUNG NAME promises more than
  // the token delivers — published rather than suppressed, because a designer choosing
  // `Background/Status/Error/Strong` for a white label deserves to know it lands at 4.40:1.
  const measured = applyContractNotes(payload);
  payload.contrast = {
    $description:
      "Contrast classes are MEASURED against each token's own surface, across every brand, " +
      "and the worst case is what the description states. A token absent from this summary " +
      "carries no contrast sentence because the prominence ladder does not describe it — " +
      "see build/contrast-contract.mjs.",
    measured: measured.length,
    meets: measured.filter((r) => r.meets).length,
    shortfall: measured
      .filter((r) => !r.meets)
      .map((r) => `${r.collection}::${r.name} — ${r.measured}:1 vs ≥${r.minContrast}:1 ("${r.rung}")`)
      .sort(),
  };
  return payload;
}

export const figmaVariables = {
  name: "json/figma-variables",
  format: ({ dictionary }) => JSON.stringify(buildPayload(dictionary), null, 2) + "\n",
};
