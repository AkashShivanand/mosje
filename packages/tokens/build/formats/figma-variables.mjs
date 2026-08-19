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
  return Math.round((min + (max - min) * Math.min(1, Math.max(0, t))) * 100) / 100;
}

const TITLE_EXCEPTIONS = { bg: "Background", hc: "HC", ux4g: "UX4G" };
const titleCase = (seg) =>
  TITLE_EXCEPTIONS[seg] ?? (/^\d/.test(seg) ? seg : seg.charAt(0).toUpperCase() + seg.slice(1));

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
  // `radius` is the Tier-1 scale; `shape` is the Tier-2 group that aliases it and is what a
  // designer should bind to. Both belong in the Radius collection — the tier stays legible in
  // the variable name (`ref/radius/md` vs `shape/md`), exactly as it does in CSS.
  if (head === "radius" || head === "shape") return "Radius";
  if (head === "opacity" || head === "z") return "Static";
  if (head === "border" && rest[0] === "width") return "Static";
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
  if (head === "grid" || head === "target" || head === "layout") return "Space";
  if (head === "container") return "Static";
  if (head === "focus" && (rest[0] === "width" || rest[0] === "offset")) return "Static";
  if (head === "icon" && rest[0] === "size") return "Space";
  if (head === "control") return rest[0] === "radius" ? "Radius" : "Static";

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
  if (tier === "cmp") {
    if (type === "color") return "Color";
    if (type === "dimension" || type === "number") return "Space";
    throw new Error(
      `figma-variables: cannot route component token "cmp/${path.join("/")}" (type ${type ?? "unknown"}).\n` +
        `  A Tier-3 token the exporter cannot place is a BUG, not a filter — it would be dropped\n` +
        `  from the library silently, and the only recourse left to a designer is to hand-make a\n` +
        `  variable that code can never consume. Give it a $type, or extend collectionFor.`,
    );
  }

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

/** The tier marker is the first segment for Tier 1 and Tier 3; Tier 2 is unmarked (§4.1). */
export function canonicalFigmaName(path, tier) {
  return (tier === "sys" ? path : [tier, ...path]).join("/");
}

const COLOR_RE = /^(#|rgba?\(|hsla?\()/i;
const DIMENSION_RE = /^(-?\d*\.?\d+)(px|rem|em|ms|s|%)?$/;

/** Infer the Figma type. 517 tokens carry no DTCG `$type`, so this cannot depend on it. */
export function figmaTypeOf(token) {
  const declared = token.$type ?? token.original?.$type;
  if (declared === "color") return { type: "COLOR" };
  if (declared === "fontFamily") return { type: "STRING" };
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
  return token.original?.$value ?? token.original?.value ?? val(token);
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
  const t = figmaTypeOf({ ...token, $value: raw, original: { $value: raw, $type: token.original?.$type } });
  // WEIGHT IS CHECKED BEFORE FLOAT, because a CSS weight IS a number and would otherwise be
  // projected as one. Figma has no numeric weight: a text style selects a cut by STYLE NAME,
  // so the variable must be a STRING scoped FONT_STYLE. See figmaFontStyle.
  if (token.path?.[0] === "font" && token.path?.[1] === "weight") {
    return { type: "STRING", value: figmaFontStyle(raw) };
  }
  if (t.type === "FLOAT") return { type: "FLOAT", value: t.number, unit: t.unit };
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

function figmaFontStyle(weight) {
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
      const note = contractNote(record, labelByPath.get(record.surface) ?? record.surface);
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
    const { type } = figmaTypeOf(token);
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
      } else if (target.collection === "Density" && mode === "Compact") {
        raw = token.original?.$extensions?.mosje?.themes?.compact ?? token.original?.$value ?? val(token);
      } else {
        raw = token.original?.$value ?? token.original?.value ?? val(token);
      }
      valuesByMode[mode] = encodeValue(raw, token, nameByPath, resolvedByPath, target);
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
      "GENERATED by @mosje/tokens, targeted at the live SAMAVESH library's seven collections. " +
      "Variables are keyed by the name the library already uses; `status` says whether an " +
      "import adds or updates. Colour is split across two collections: Color carries the BRAND " +
      "axis (Blue|Navy) and Theme is the single-mode semantic layer that aliases into it. " +
      "See spec §8.4.",
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
