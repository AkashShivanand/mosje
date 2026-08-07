/**
 * Figma Variables payload, targeted at the LIVE SAMAVESH library (spec §8.4).
 *
 * An earlier version of this invented five collections of its own. That was wrong: the
 * library already has seven, with 266 variables, their own modes and their own naming
 * (`Primary/500`, `Text/Dark`). Importing an invented structure alongside would have left
 * ~1,164 variables across twelve collections — two parallel token systems in one file, which
 * is the exact drift this pipeline exists to remove.
 *
 * So the payload maps ONTO what is there:
 *
 *   Spacing        Mode 1                                  spacing-<step>
 *   Color          Blue | Navy                             Title/Cased/Paths
 *   Typography     Website|Portal × Desktop|Tablet|Mobile  font-size/<role>, line-height/…
 *   Border Radius  Mode 1                                  radius-<step>
 *   Motion         Mode 1                                  duration-*, easing-*
 *   Density        Comfortable | Compact                   control-height
 *   Component Options — left untouched (a Figma-only boolean, not a token tier)
 *
 * Every variable carries `status: "new" | "existing"` against a snapshot of the live library,
 * so an import is reviewable as a DELTA instead of applied as a bulk overwrite.
 */

import { readFileSync } from "node:fs";
import { tierOfFile, toCssName, PROMINENCE_CONTRACT } from "../grammar.mjs";

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
  Spacing: { axis: null, modes: ["Mode 1"] },
  Color: { axis: "brand", modes: ["Blue", "Navy"] },
  Typography: {
    axis: "surface × breakpoint",
    modes: [
      "Website · Desktop", "Website · Tablet", "Website · Mobile",
      "Portal · Desktop", "Portal · Tablet", "Portal · Mobile",
    ],
  },
  "Border Radius": { axis: null, modes: ["Mode 1"] },
  Motion: { axis: null, modes: ["Mode 1"] },
  Density: { axis: "density", modes: ["Comfortable", "Compact"] },
};

/**
 * The viewport each Typography mode samples.
 *
 * Code sizes type as `clamp(min@360px, fluid, max@1280px)` — linear between the anchors. So
 * Desktop and Mobile ARE the anchors and Tablet is the same curve evaluated at 768px. Figma's
 * discrete modes are samples of the fluid scale, not a competing one, which is why this
 * needed no decision about which is authoritative.
 */
const BREAKPOINT_PX = { Desktop: 1280, Tablet: 768, Mobile: 360 };
const CLAMP_MIN_VW = 360;
const CLAMP_MAX_VW = 1280;

function fluidAt(min, max, viewport) {
  if (min === max) return min;
  const t = (viewport - CLAMP_MIN_VW) / (CLAMP_MAX_VW - CLAMP_MIN_VW);
  return Math.round((min + (max - min) * Math.min(1, Math.max(0, t))) * 100) / 100;
}

const TITLE_EXCEPTIONS = { bg: "Background", hc: "HC", ux4g: "UX4G" };
const titleCase = (seg) =>
  TITLE_EXCEPTIONS[seg] ?? (/^\d/.test(seg) ? seg : seg.charAt(0).toUpperCase() + seg.slice(1));

/** Ramp path segment → the folder the library already uses. */
const RAMP_FOLDER = {
  primaryScale: "Primary",
  secondaryScale: "Secondary",
  neutralScale: "Neutral",
  successScale: "Success",
  dangerScale: "Danger",
  warningScale: "Warning",
  infoScale: "Info",
};

/**
 * The canonical grammar and the Action matrix are all colour and all vary on brand — and the
 * Color collection already groups by folder (`Text/`, `Primary/`, `Background/`, `Icon/`).
 * So `Action/` becomes another folder there rather than an eighth collection. That is what
 * "reconcile to the existing seven" means concretely.
 */
const COLOUR_ROOTS = new Set([
  "bg", "text", "icon", "border", "outline", "overlay", "focus",
  "action", "control", "spinner", "button", "card", "badge", "chart", "on", "layer",
]);

const SPACING_ROOTS = new Set(["inline", "stack", "padding", "section", "space"]);

/**
 * Project a code path onto the variable name the library uses.
 * Returns null when a token has no home in the live structure — those are REPORTED in
 * `unmapped`, never silently dropped.
 */
export function figmaNameFor(path, tier = "sys") {
  const [head, ...rest] = path;

  /**
   * Colour PRIMITIVES have no home in the live library, and must not get one.
   *
   * Figma's `Neutral/50` is mode-aware (#f8f9fa on Blue, #f9fafb on Navy) — it is the Tier-2
   * `color.neutralScale.50`, not the Tier-1 `color.neutral.50` raw ramp, which is fixed. Both
   * projected onto the same name and collided. Designers bind to the mode-aware layer; the
   * raw hue ramps are private, exactly as `--sa-ref-*` is banned in app code.
   *
   * Non-colour Tier-1 scales (spacing, radius, motion, type) DO have a home — those
   * collections are the scales themselves — so the exclusion is colour-only.
   */
  if (tier === "ref" && head === "color") return null;

  /**
   * The legacy nested spacing roles (`spacing.inline.m`) are mirrored by the canonical
   * top-level groups (`inline/m`). Exporting both would put `spacing-inline-m` beside
   * `inline-m` in one collection — two names for one value, which is the drift this is
   * meant to remove.
   */
  if (head === "spacing" && SPACING_ROOTS.has(rest[0])) return null;

  if (head === "spacing") return { collection: "Spacing", name: `spacing-${rest.join("-")}` };
  if (head === "radius") return { collection: "Border Radius", name: `radius-${rest.join("-")}` };
  if (head === "motion") {
    const [kind, step] = rest;
    return { collection: "Motion", name: `${kind === "duration" ? "duration" : "easing"}-${step}` };
  }
  if (head === "density") return { collection: "Density", name: rest.join("-") };

  if (head === "font") {
    const [kind, ...tail] = rest;
    if (kind === "family") return { collection: "Typography", name: `font-family/${tail.join("-")}` };
    if (kind === "weight") return { collection: "Typography", name: `font-weight/${tail.join("-")}` };
    if (kind === "role") {
      // font/role/display/1/size → font-size/display-1
      const prop = tail.at(-1);
      const role = tail.slice(0, -1).join("-");
      const map = { size: "font-size", lh: "line-height", para: "paragraph-spacing" };
      return map[prop] ? { collection: "Typography", name: `${map[prop]}/${role}` } : null;
    }
    if (kind === "tracking") return { collection: "Typography", name: `letter-spacing/${tail.join("-")}` };
    return { collection: "Typography", name: `font-family/${rest.join("-")}` };
  }
  if (head === "leading") return { collection: "Typography", name: `line-height/${rest.join("-")}` };
  if (head === "type") return { collection: "Typography", name: `type/${rest.join("-")}` };

  if (head === "color") {
    const [group, ...tail] = rest;
    if (RAMP_FOLDER[group]) {
      const step = tail.join("-");
      // The library spells the white end "Neutral/0 - White".
      if (group === "neutralScale" && step === "0") return { collection: "Color", name: "Neutral/0 - White" };
      return { collection: "Color", name: `${RAMP_FOLDER[group]}/${step}` };
    }
    if (group === "transparent") {
      const [family, pct] = tail;
      const folder = family === "white" ? "White Transparent" : `${titleCase(family)} Transparent`;
      return { collection: "Color", name: `${folder}/${pct}%` };
    }
    /**
     * The legacy code semantic tier (`color.text.default`, `color.bg.surface`,
     * `color.border.subtle`, …) is NOT exported.
     *
     * It is mirrored exactly by the canonical grammar namespace — `tier2-parity.test.mjs`
     * proves the two agree in every axis block — so exporting both would put THREE names on
     * one value in the library: `Text/Dark` (Figma's own), `Text/Default` (this path) and
     * `Text/Neutral/Default` (canonical). Only the canonical one is the target naming.
     *
     * Figma's existing legacy names are left untouched; they retire the same way `--ds-*`
     * does in code, as call sites migrate.
     */
    return null;
  }

  if (COLOUR_ROOTS.has(head)) {
    return { collection: "Color", name: [head, ...rest].map(titleCase).join("/") };
  }
  if (SPACING_ROOTS.has(head)) {
    return { collection: "Spacing", name: `${head}-${rest.join("-")}` };
  }
  return null;
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
  if (t.type === "FLOAT") return { type: "FLOAT", value: t.number, unit: t.unit };
  return { type: t.type, value: String(raw) };
}

function contractNote(path) {
  const rung = path.find((seg) => PROMINENCE_CONTRACT[seg]);
  if (!rung) return null;
  const c = PROMINENCE_CONTRACT[rung];
  return c.minContrast > 0
    ? `Guarantees ≥${c.minContrast}:1 — ${c.use}.`
    : `No contrast guarantee — ${c.use}.`;
}

/** The custom property this token actually ships as (font/role feeds --ds-type-*). */
function emittedCssName(token, tier) {
  const [head, kind, ...rest] = token.path;
  if (head === "font" && kind === "role") return `--ds-type-${rest.join("-")}`;
  if (head === "font" && kind === "tracking") return `--ds-type-${rest.join("-")}-tracking`;
  return toCssName(token.path, tier);
}

export function buildPayload(dictionary) {
  const tokens = dictionary.allTokens;
  const live = liveSnapshot();

  // Path → fully-resolved value, for references whose target is not exported.
  const resolvedByPath = new Map(tokens.map((t) => [t.path.join("."), val(t)]));

  const nameByPath = new Map();
  for (const t of tokens) {
    const target = figmaNameFor(t.path, tierOfFile(t.filePath));
    if (target) nameByPath.set(t.path.join("."), target);
  }

  const collections = Object.fromEntries(
    Object.entries(COLLECTIONS).map(([name, meta]) => [name, { name, ...meta, variables: [] }]),
  );
  const unmapped = [];
  const seen = new Set();

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
    const target = figmaNameFor(token.path, tier);
    if (!target) {
      unmapped.push(token.path.join("/"));
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
      if (target.collection === "Color") {
        raw = brandValue(token, mode);
      } else if (target.collection === "Typography" && fluid) {
        const [surface, breakpoint] = mode.split(" · ");
        const bounds = fluid[surface.toLowerCase()];
        raw = bounds
          ? fluidAt(parseFloat(bounds.min), parseFloat(bounds.max), BREAKPOINT_PX[breakpoint])
          : (token.original?.$value ?? val(token));
      } else if (target.collection === "Density" && mode === "Compact") {
        raw = token.original?.$extensions?.mosje?.themes?.compact ?? token.original?.$value ?? val(token);
      } else {
        raw = token.original?.$value ?? token.original?.value ?? val(token);
      }
      valuesByMode[mode] = encodeValue(raw, token, nameByPath, resolvedByPath, target);
    }

    const description = [token.$description ?? token.original?.$description, contractNote(token.path)]
      .filter(Boolean)
      .join(" ");

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

  return {
    $schema: "samavesh-figma-variables/2",
    $description:
      "GENERATED by @mosje/tokens, targeted at the live SAMAVESH library's seven collections. " +
      "Variables are keyed by the name the library already uses; `status` says whether an " +
      "import adds or updates. Theme (light/dark/hc) is intentionally absent — the live Color " +
      "collection carries only the brand axis. See spec §8.4.",
    counts,
    unmapped,
    collections: Object.values(collections).filter((c) => c.variables.length),
  };
}

export const figmaVariables = {
  name: "json/figma-variables",
  format: ({ dictionary }) => JSON.stringify(buildPayload(dictionary), null, 2) + "\n",
};
