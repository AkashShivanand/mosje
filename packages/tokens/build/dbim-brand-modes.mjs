/**
 * The six DBIM conformance brands, synthesised at build time rather than written into the
 * source JSON.
 *
 * WHY THIS IS A PREPROCESSOR AND NOT 900 LINES OF JSON
 * ---------------------------------------------------
 * A brand block reaches `tokens.css` because `legacy-ds-css.mjs` walks every token's
 * `$extensions.mosje.colorModes` and emits one `[data-brand="<id>"]` block per key it finds —
 * including the alias re-assertion closure, which is the genuinely hard part and is already
 * solved there. So a new brand needs nothing but colorModes entries.
 *
 * Writing them by hand would mean about 150 colour tokens times six groups: roughly nine
 * hundred JSON entries, none of them decisions. Every one would be a mechanical restatement of
 * the same rule — "wherever this token reads the estate's primary/status/neutral family, read
 * DBIM's instead" — and the file would be unreviewable, unmaintainable, and certain to drift
 * the moment a token was added. The rule is small; the expansion is large. So the rule is what
 * lives in the repository, and the expansion happens here.
 *
 * WHAT MAKES A MODE "DBIM-CONFORMANT" RATHER THAN "DBIM-COLOURED"
 * --------------------------------------------------------------
 * All of it moves, not just the primary ramp:
 *
 *   primary  -> the selected DBIM group's five published shades
 *   success  -> Liberty Green   #198754   (ours is India Green #046A38)
 *   warning  -> Mustard Yellow  #FFC107   (ours is an amber)
 *   error    -> Coral Red       #DC3545   (ours is #ec5042's ramp)
 *   info     -> DBIM Blue       #0D6EFD   (ours is #1a73e8's ramp)
 *   neutral  -> DBIM's PURE greys, untinted
 *   body ink -> Deep Earthy Brown #150202, which is not a neutral step at all
 *
 * WHAT DOES NOT MOVE, AND WHY
 * ---------------------------
 * `secondaryRamp` (India Saffron) and `accentRamp` (India Green) are SAMAVESH logo colours and
 * DBIM publishes no counterpart to either — DBIM's model is one primary group plus a fixed
 * functional table, with no secondary or accent concept. Repointing them would mean inventing
 * a DBIM value that DBIM never issued, which is the one thing a conformance palette must not
 * do. They stay, and the UI says the modes are a conformance PREVIEW rather than a shipping
 * brand.
 *
 * CODE-ONLY. Nothing here can reach the Figma library: `formats/figma-variables.mjs` declares
 * its Palette modes as a hardcoded ["Blue", "Navy"] pair and reads only `colorModes.navy`, so
 * a DBIM brand is unreachable from the exporter by construction rather than by discipline.
 */

import { DBIM_GROUPS } from "./brand-ramps.mjs";

/**
 * `{color.<family>.<step>}` -> the DBIM family that replaces it, for every brand.
 *
 * `neutralDark` maps to the same place as `neutral`: a DBIM mode has ONE grey ramp, DBIM's,
 * and the blue/navy split is an artefact of this estate's own two-brand history.
 */
const FAMILY_MAP = {
  green: "greenDbim",
  red: "redDbim",
  amber: "amberDbim",
  info: "infoDbim",
  neutral: "neutralDbim",
  neutralDark: "neutralDbim",
};

/** Token paths whose DBIM value is not a family swap but a single published colour. */
const LITERAL_OVERRIDES = {
  // DBIM 4.4 / Table 1: body text on a light background is Deep Earthy Brown, not a grey.
  "color.text.default": "{color.dbimInk}",
  "color.text.muted": "{color.neutralDbim.700}",
};

const REF = /^\{([^}]+)\}$/;

/**
 * The DBIM value for one token in one group, or null if the token does not vary by brand.
 *
 * The input is the token's DEFAULT (blue-brand) value — either a `{ref}` or a literal. Only
 * refs are remapped: a literal is a colour somebody chose outright, and guessing a DBIM
 * counterpart for it would be inventing one.
 */
function dbimValueFor(path, defaultValue, groupPath) {
  if (LITERAL_OVERRIDES[path]) return LITERAL_OVERRIDES[path];

  const m = REF.exec(String(defaultValue).trim());
  if (!m) return null;
  const ref = m[1];

  // The primary ramp is the one thing that differs BETWEEN the six groups. It resolves to the
  // PRIMITIVE layer's `color.dbimPrimary.*`, not to the active brand pack's `primaryRamp`:
  // DBIM's palette does not change because the estate was re-skinned, and reading it from a
  // brand pack would break every re-skin that has never heard of DBIM.
  const primary = /^color\.primaryRamp\.(blue|navy)\.(\d+)$/.exec(ref);
  if (primary) {
    return `{color.dbimPrimary.${DBIM_GROUPS[groupPath].group}.${primary[2]}}`;
  }

  const family = /^color\.([A-Za-z]+)\.(\d+)$/.exec(ref);
  if (family && FAMILY_MAP[family[1]]) {
    return `{color.${FAMILY_MAP[family[1]]}.${family[2]}}`;
  }

  return null;
}

/**
 * Walk a parsed token tree and add a `colorModes` entry per DBIM brand wherever the token has
 * a DBIM equivalent. Mutates in place; safe to run more than once.
 *
 * Also renames the pre-existing `dbim` brand key to `dbim-blue`. That brand shipped before the
 * other five existed, when there was only one DBIM group to show; leaving it as the odd id out
 * would mean a switcher listing `dbim`, `dbim-burgundy`, `dbim-purple`… `LEGACY_BRAND_ID` in
 * `brand-modes.mjs` keeps `[data-brand="dbim"]` working as a selector alias, and
 * `LEGACY_COLOR_MODE_IDS` migrates a persisted cookie, so nothing that already said `dbim`
 * breaks.
 */
export function addDbimBrandModes(tree) {
  let touched = 0;

  const walk = (node, path) => {
    if (!node || typeof node !== "object") return;

    if ("$value" in node) {
      const ext = (node.$extensions ??= {});
      const mosje = (ext.mosje ??= {});
      const modes = (mosje.colorModes ??= {});

      for (const [groupPath, { brand }] of Object.entries(DBIM_GROUPS)) {
        const value = dbimValueFor(path, node.$value, groupPath);
        if (value === null) continue;
        modes[brand] = value;
        touched++;
      }

      // The original single-group brand's key is dropped: `dbim-blue` above already carries
      // its value, derived by the same rule as the other five rather than inherited from the
      // hand-wired entries in semantic.json. Leaving it would emit a duplicate block under the
      // old id; the selector alias in `brand-modes.mjs` covers backwards compatibility.
      delete modes.dbim;
      if (Object.keys(modes).length === 0) delete mosje.colorModes;
      return;
    }

    for (const key of Object.keys(node)) {
      if (key.startsWith("$")) continue;
      walk(node[key], path ? `${path}.${key}` : key);
    }
  };

  walk(tree, "");
  return touched;
}
