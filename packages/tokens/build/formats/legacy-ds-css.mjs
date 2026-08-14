import { cssNameFor, tierOfFile, toCssName } from "../grammar.mjs";
import { makeRetier } from "./retier.mjs";
import { brandSelector, DEFAULT_BRAND } from "../brand-modes.mjs";
// Emits :root { --sa-*: <value>; ... } from the DTCG token tree.
// It used to emit a legacy --ds-* alias block alongside; that vocabulary was retired
// on 2026-08-12 and nothing emits it any more.
//
// Two-surface fluid type: font.role.* tokens carry $extensions.mosje.type.{website,portal}
// with {min,max} bounds. The formatter emits --sa-type-{role}-{size|lh} as clamp(min@360px,
// fluid, max@1280px) — the Website scale in :root (default) and the Portal scale under
// [data-surface="portal"]. No @media breakpoints.

/** Expand a UX4G semantic-spacing family into --sa-<family>-<step>. */
const spacingRole = (family, steps) =>
  // The semantic spacing roles were RENAMED (spacing.inline.m -> inline/m), so the target is
  // now the canonical top-level group, not a nested path under the raw scale.
  Object.fromEntries(steps.map((s) => [`--ds-${family}-${s}`, `--sa-${family}-${s}`]));

// The legacy `--ds-*` vocabulary was RETIRED on 2026-08-12. It used to be declared here
// as a ~200-entry alias table mapping every old name to the canonical token it resolved to,
// re-asserted inside each brand block so islands repainted. All 3,561 references across the
// estate were migrated to the canonical `--sa-*` names by tools/token-migration/migrate.py,
// which followed those same aliases — so the migration was value-preserving by construction.
// The full mapping is preserved at tools/token-migration/mapping.json if it is ever needed
// to read older code. Nothing emits `--ds-*` any more; do not reintroduce it.


const val = (t) => (t.$value !== undefined ? t.$value : t.value);

// Fluid type: clamp() between a min (@360px viewport) and max (@1280px), Utopia-style.
/**
 * The viewport anchors `clamp()` interpolates between. Read from the TOKEN, not restated:
 * these were literals here and in figma-variables.mjs, so the estate had three copies of
 * 360/1280 and no way to notice if one drifted. `breakpoint/*` is now the single source.
 */
const bpPx = (dict, step) => {
  const t = dict.allTokens.find((x) => x.path.join(".") === `breakpoint.${step}`);
  if (!t) throw new Error(`legacy-ds-css: breakpoint/${step} is missing — the fluid type scale ` +
    `cannot be built without its anchors.`);
  return parseFloat(t.$value ?? t.value);
};

// Type is emitted in REM, not px. GIGW 3.0 and WCAG 1.4.4 are satisfied by browser zoom
// either way, but a reader who raises their browser's DEFAULT FONT SIZE without zooming —
// common among low-vision and older users, and the exact audience these services carry —
// gets nothing from a px scale. rem tracks that preference. UX4G 3.0 sizes type in rem for
// this reason and, until this change, was ahead of SAMAVESH on it.
//
// The viewport term stays in vw: that is the fluid half of the scale and is meant to track
// the screen, not the reader. So the expression is
//     clamp(minRem, calc(interceptRem + slopeVw), maxRem)
// which is Utopia's standard form and renders IDENTICALLY to the old px output at the 16px
// default root size — the conversion is value-preserving, and a test asserts it.
//
// Deliberately NOT converted: the hard `font-size: 16px` floor on mobile text-entry controls
// in components/forms/forms.css. iOS Safari's zoom-on-focus threshold is an absolute 16px,
// not a preference-relative one, so that literal is correct as px.
const REM_BASE = 16;
const round = (n, dp = 4) => Math.round(n * 10 ** dp) / 10 ** dp;
const rem = (px) => `${round(px / REM_BASE)}rem`;

/** Return a clamp() string (or a static rem value when min === max). */
function clampExpr(minPx, maxPx, wmin, wmax) {
  const min = parseFloat(minPx);
  const max = parseFloat(maxPx);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return maxPx ?? minPx;
  if (min === max) return min === 0 ? "0px" : rem(min);
  const range = wmax - wmin;
  const slopeVw = ((max - min) / range) * 100; // vw coefficient
  const yInt = min - ((max - min) / range) * wmin; // intercept, in px before conversion
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  const s = round(slopeVw, 3);
  // Avoid "+ -Nvw" (valid but fragile) — emit "- Nvw" for negative slopes.
  const vwTerm = s < 0 ? `- ${Math.abs(s)}vw` : `+ ${s}vw`;
  return `clamp(${rem(lo)}, calc(${rem(yInt)} ${vwTerm}), ${rem(hi)})`;
}

/**
 * Build two-surface responsive --sa-type-* blocks from font.role.* tokens.
 * Website scale → :root (default surface); Portal scale → [data-surface="portal"].
 */
function buildResponsiveType(dictionary) {
  const WMIN = bpPx(dictionary, "mobile");
  const WMAX = bpPx(dictionary, "desktop");
  // font.role.<role>.{size|lh|para}  and  font.tracking.<key>  (letter-spacing)
  const roleTokens = dictionary.allTokens.filter(
    (t) => t.path[0] === "font" && (t.path[1] === "role" || t.path[1] === "tracking")
  );
  if (!roleTokens.length) return { website: [], portal: [] };

  const website = [];
  const portal = [];

  for (const t of roleTokens) {
    // Paths were split on the hyphen (font/role/display/1/size) so no segment carries a
    // delimiter — RULE 1. The role family and its number rejoin here, which is the only
    // place that mapping lives.
    //
    // The canonical name is `--sa-type-*`. Typography was the LAST family still shipping on
    // the deprecated `--ds-` prefix — 201 tokens, the largest single group, invisible because
    // it is generated by this separate code path rather than from the token tree. `--ds-type-*`
    // is still emitted as an alias so the 21 properties consuming it keep working.
    const suffix =
      t.path[1] === "role"
        ? `${t.path.slice(2, -1).join("-")}-${t.path.at(-1)}`
        : `${t.path.slice(2).join("-")}-tracking`;
    const cssVar = `--sa-type-${suffix}`;

    const ty = t.original?.$extensions?.mosje?.type;
    const webExpr = ty?.website ? clampExpr(ty.website.min, ty.website.max, WMIN, WMAX) : val(t);
    const portalExpr = ty?.portal ? clampExpr(ty.portal.min, ty.portal.max, WMIN, WMAX) : webExpr;

    website.push(`  ${cssVar}: ${webExpr};`);
    if (portalExpr !== webExpr) {
      portal.push(`  ${cssVar}: ${portalExpr};`);
    }
  }
  return { website, portal };
}

/**
 * Tier markers (spec §4.1). A token's tier comes from the file it is authored in, so the
 * DTCG path stays identical to the Figma variable path — the tier becomes the collection
 * and the CSS marker. Tier 2 carries no marker, so the most-typed token is the shortest.
 */
export const legacyDsCss = {
  name: "css/legacy-ds",
  format: ({ dictionary }) => {
    // Exclude font.role.* from the generic --sa-* emission; buildResponsiveType handles them.
    const regularTokens = dictionary.allTokens.filter(
      (t) => !(t.path[0] === "font" && (t.path[1] === "role" || t.path[1] === "tracking"))
    );
    // Path → tier, so a {reference} can be resolved to the referent's MARKED name.
    const tierByPath = new Map(
      dictionary.allTokens.map((t) => [t.path.join("."), tierOfFile(t.filePath)])
    );

    /** Resolve a `{a.b.c}` reference to the referent's tier-marked CSS name. */
    const refToVar = (ref) => {
      const path = ref.slice(1, -1).split(".");
      return toCssName(path, tierByPath.get(path.join(".")) ?? "sys");
    };

    /**
     * The canonical Tier-2 AND Tier-3 namespaces are emitted as var() CHAINS, not resolved
     * literals.
     *
     * Style Dictionary resolves `{color.text.default}` to a hex by default. If we emitted
     * that hex, `--sa-text-neutral` would freeze at whatever :root computed and would stop
     * responding to [data-brand] — a custom property substitutes var() at the element where
     * it is DECLARED (design.md §1A). Keeping the chain, and re-asserting it in any block
     * that redeclares the target, is what makes brand islands work.
     *
     * Tier 3 was excluded until 2026-08-10, and the consequence was silent: all 296
     * `--sa-cmp-*` shipped as frozen hexes, so the ENTIRE component layer ignored the brand
     * axis. `--sa-cmp-action-brand-primary-default-bg` was `#025fb8` under Blue and `#025fb8`
     * under Navy — the primary button never changed brand. Figma had the same tokens as
     * ALIASES, where 85 of them did repaint, so the two sides disagreed about the layer that
     * describes buttons and nothing detected it. The source was never the problem: Tier 3 is
     * 196 references and zero literals. Only the emit flattened it.
     */
    const ALIAS_EMIT_FILE = /(system|component)\.generated\.json$|component\.json$/;
    const systemAliasPairs = [];
    const lines = regularTokens.map((t) => {
      const name = cssNameFor(t);
      const orig = t.original?.$value ?? t.original?.value;
      if (ALIAS_EMIT_FILE.test(t.filePath ?? "") && typeof orig === "string" && orig.startsWith("{")) {
        const target = refToVar(orig);
        systemAliasPairs.push([name, target]);
        return `  ${name}: var(${target});`;
      }
      return `  ${name}: ${val(t)};`;
    });

    // Two-surface responsive type variables (website = default, portal = [data-surface])
    const { website: typeRootLines, portal: typePortalLines } = buildResponsiveType(dictionary);

    const retier = makeRetier(dictionary.allTokens, { tierOfFile, toCssName });
    // The legacy `--ds-*` alias block is gone (retired 2026-08-12). Kept as empty arrays
    // rather than threaded out of every call site, because the brand-block re-assertion
    // below still needs `systemAliasPairs` and the two were always concatenated.
    const legacyPairs = [];
    const legacy = [];

    // Resolve a {reference} to a var(--sa-*) chain, honouring the referent's tier marker.
    // Without the lookup a Tier-2 token pointing at a Tier-1 primitive would emit an
    // unmarked name that no longer exists.
    const resolveRef = (v) =>
      typeof v === "string" && v.startsWith("{") ? `var(${refToVar(v)})` : v;

    // Each block records BOTH its declaration lines and the set of custom-property
    // names it declares. The name set drives targeted alias re-assertion below.
    const mkBlock = () => ({ lines: [], vars: new Set() });
    const push = (block, name, value) => {
      block.lines.push(`  ${name}: ${value};`);
      block.vars.add(name);
    };

    const themeMap = { light: mkBlock(), dark: mkBlock(), hc: mkBlock(), compact: mkBlock() };
    const colorModeMap = {};
    for (const t of dictionary.allTokens) {
      const ext = t.original?.$extensions?.mosje;
      const name = cssNameFor(t);
      if (ext?.themes) {
        // `dark` and `hc` are deliberately NOT emitted. The UX4G accessibility widget is the
        // single canonical high-contrast / dark mechanism for the estate — it applies its own
        // `.dark-mode` class to <html> and never reads `data-theme`, so this axis was a second,
        // parallel mechanism nothing consumed. `compact` is the density axis and is unrelated.
        // The source overrides are kept so the axis can be revived deliberately if it is ever
        // wanted; only the emission is switched off. See
        // docs/superpowers/records/2026-08-10-figma-theme-dark-hc-removed.md
        for (const [theme, v] of Object.entries(ext.themes)) {
          if (theme === "dark" || theme === "hc") continue;
          if (themeMap[theme]) push(themeMap[theme], name, resolveRef(v));
        }
      }
      if (ext?.colorModes) {
        for (const [mode, v] of Object.entries(ext.colorModes)) {
          push((colorModeMap[mode] ??= mkBlock()), name, resolveRef(v));
        }
        // Every token that varies by brand also needs an explicit declaration for the
        // DEFAULT brand ("blue") — not just the overrides above. Without this, blue never
        // gets a [data-brand="blue"] block at all (colorModeMap has no "blue" key, because
        // the source JSON encodes blue as the token's base $value rather than a colorModes
        // override), so nothing can nest its way back to blue: an explicit
        // data-brand="blue" island inside an ambient navy/ux4g page silently inherits the
        // ambient brand instead of rendering blue. design.md documents nested brand islands
        // as supported for every brand; this is what makes that true for the default one
        // too. `val(t)` is exactly what :root already emits for this token (see the
        // `lines` computation above) — this is a genuine ADDITION (a new selector), not a
        // change to any existing value.
        push((colorModeMap[DEFAULT_BRAND] ??= mkBlock()), name, val(t));
      }
    }

    // A custom property substitutes var() at the element where it is DECLARED, then
    // descendants inherit the ALREADY-RESOLVED value. So `--ds-primary: var(--sa-…)`
    // declared once at :root resolves against :root's primitives; an island that flips
    // those primitives for its subtree does NOT change --ds-primary unless the alias is
    // re-declared inside the island. Every block that redeclares a token therefore has
    // to re-declare the aliases pointing at it.
    //
    // Re-assertion is TARGETED: only aliases whose target this block actually redeclares.
    // Re-asserting the rest is a provable no-op (the target is inherited unchanged), and
    // blanket re-assertion was emitting the whole ~290-entry alias table into all four
    // theme blocks — mostly spacing/radius/shadow/type aliases that no theme can vary.
    // Re-assertion is TRANSITIVE, and has to be. An alias re-declared inside a block becomes
    // a changed source for anything pointing at IT, so one pass only reaches depth 1. That
    // was invisible while Tier 3 emitted literals: with `--sa-cmp-*` now chaining through
    // Tier 2, `cmp/action/... -> bg/brand/primary/bolder -> color/primaryScale/600` is three
    // deep, and a single pass would re-assert the middle link while leaving the component
    // token resolving against :root — brand-blind in exactly the way this change exists to
    // fix. Iterating to a fixpoint costs one small loop and removes the depth limit entirely.
    const reassert = (block) => {
      const pairs = [...legacyPairs, ...systemAliasPairs];
      const changed = new Set(block.vars);
      const emitted = new Map();
      for (let pass = 0; pass < 16; pass++) {
        let grew = false;
        for (const [name, target] of pairs) {
          if (emitted.has(name) || !changed.has(target)) continue;
          emitted.set(name, target);
          changed.add(name);
          grew = true;
        }
        if (!grew) break;
      }
      const lines = [...emitted].map(([oldName, target]) => `  ${oldName}: var(${target});`);
      return lines.length
        ? `\n\n  /* re-resolve every alias whose source changed in this block */\n${lines.join("\n")}`
        : "";
    };

    const colorModeBlocks = Object.entries(colorModeMap)
      .map(([mode, b]) => `${brandSelector(mode)} {\n${b.lines.join("\n")}${reassert(b)}\n}`)
      .join("\n\n");
    const themeBlocks = [
      colorModeBlocks,
      themeMap.light.lines.length  ? `[data-theme="light"] {\n${themeMap.light.lines.join("\n")}${reassert(themeMap.light)}\n}` : "",
      themeMap.compact.lines.length? `[data-density="compact"] {\n${themeMap.compact.lines.join("\n")}${reassert(themeMap.compact)}\n}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    // Portal surface: override the fluid --ds-type-* scale under [data-surface="portal"].
    // This block needs the same alias re-assertion as the theme blocks — without it the
    // --ds-text-*/--ds-leading-* aliases keep the value they resolved to at :root, i.e.
    // the WEBSITE scale, and every portal that mounts on a wrapper div (all six of them —
    // data-surface sits on a <div>, not <html>) renders website type. Verified in-browser
    // before the fix: --ds-type-display-1-size flipped to the portal clamp (max 56px)
    // while --ds-text-display stayed on the website clamp (max 80px).
    const surfaceVars = new Set(
      typePortalLines.map((l) => l.slice(0, l.indexOf(":")).trim())
    );
    const surfaceBlock = typePortalLines.length
      ? `[data-surface="portal"] {\n${typePortalLines.join("\n")}${reassert({ vars: surfaceVars })}\n}`
      : "";

    return (
      `/* GENERATED by @mosje/tokens — do not edit. Edit packages/tokens/src/*.json. */\n` +
      `:root {\n${lines.join("\n")}\n\n` +
      `  /* ---- fluid type scale (Website surface, default): --sa-type-ROLE-size/lh = clamp(...) ---- */\n${typeRootLines.join("\n")}\n\n` +
      `\n${legacy.join("\n")}\n}\n\n` +
      `${themeBlocks}\n\n` +
      `/* ---- Portal surface type scale override ---- */\n${surfaceBlock}\n`
    );
  },
};
