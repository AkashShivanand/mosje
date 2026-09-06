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

import { DBIM_GROUPS, DBIM_INK, generateDbim } from "./brand-ramps.mjs";
import { contrast } from "./wcag.mjs";

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

/* ───────────────────────────────────────────────────────────────────────────────────────────
 * §2.1.iv — "colour usage should ensure the accessibility of digital platform"
 *
 * DBIM publishes SWATCHES and that one obligation. It publishes no pairing table: nothing in
 * the chapter says which shade carries a button or which ink sits on it, and the rungs between
 * its five published shades are this estate's interpolation, not DBIM's. So conformance to the
 * palette cannot on its own produce conformant CONTRAST, and everything below is measured
 * rather than assumed.
 *
 * Two different repairs, because two different things are free to move.
 *
 * INK MOVES where a token names exactly one fill. Every `on/bg/<path>` is the foreground for
 * `bg/<path>` and for nothing else, so its ink can be chosen against that fill. It was not
 * being chosen at all: `on/bg/brand/primary/bolder` is `{text.neutral.inverse}` — white —
 * declared once at `:root`, and NO brand block re-declares an `on/*` token, navy included.
 * That is safe exactly while every brand's fills sit in one lightness band, which DBIM's
 * lighter groups do not.
 *
 * THE FILL MOVES where one ink serves several fills. `color.text.onPrimary` is the label for
 * BOTH `action.primary.default` and `action.primary.hover`, and hover is deliberately darker
 * — so darkening the ink to suit a light default would fail on the dark hover. `action.primary`
 * says so in its own description: "MUST stay dark enough to carry white label text at AA in
 * EVERY theme … hover goes DARKER rather than lighter." The fill is what gives.
 * ─────────────────────────────────────────────────────────────────────────────────────────── */

const AA = 4.5;

/** The resolved DBIM ramps, built once — the same values the palette itself emits. */
const DBIM = generateDbim();

/** `{color.dbimPrimary.green.600}` and friends → a hex, or null if it is not a DBIM ramp ref. */
function resolveDbimRef(ref) {
  let m = /^color\.dbimPrimary\.([A-Za-z]+)\.(\d+)$/.exec(ref);
  if (m) return DBIM.primary[`dbim${m[1][0].toUpperCase()}${m[1].slice(1)}`]?.[m[2]] ?? null;
  m = /^color\.(neutralDbim|greenDbim|redDbim|amberDbim|infoDbim)\.(\d+)$/.exec(ref);
  if (m) return (m[1] === "neutralDbim" ? DBIM.neutral : DBIM.functional[m[1]])?.[m[2]] ?? null;
  if (ref === "color.dbimInk") return DBIM_INK;
  return null;
}

/**
 * The primary rung a DBIM group's BUTTON FILL must use so white clears AA on it.
 *
 * The lightest rung that passes, never darker than it has to be — a conformance preview that
 * quietly darkens every group would misrepresent the palette as much as an unreadable one
 * does. Four of the six are unchanged at 500; only Green (3.01:1) and Chrome Yellow (3.34:1)
 * move, and Green moves two rungs because its 600 is still 4.32:1.
 *
 * `hover` follows one rung behind `default` so the two never collapse into the same colour,
 * and never lighter than the 700 the default brand already uses.
 */
const PRIMARY_RUNGS = [500, 600, 700, 800];

function accessibleActionRungs(groupPath) {
  const group = DBIM_GROUPS[groupPath].group;
  const ramp = DBIM.primary[groupPath];
  const fallback = PRIMARY_RUNGS[PRIMARY_RUNGS.length - 1];
  const def =
    PRIMARY_RUNGS.find((r) => contrast("#ffffff", ramp[r]) >= AA) ?? fallback;
  const hover = Math.min(Math.max(def + 100, 700), 800);
  if (contrast("#ffffff", ramp[hover]) < AA) {
    throw new Error(`DBIM ${group}: no rung carries white on hover — the ramp is broken`);
  }
  return { group, default: def, hover };
}

/** `on.bg.brand.primary.bolder` → `bg.brand.primary.bolder`, else null. */
const fillPathFor = (path) => (path.startsWith("on.bg.") ? path.slice(3) : null);

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

  // The button fill each group needs, measured once. Read by the walk below.
  const actionRungs = Object.fromEntries(
    Object.keys(DBIM_GROUPS).map((g) => [g, accessibleActionRungs(g)]),
  );

  /*
   * Pass 1 records every token's DBIM value so pass 2 can pick an ink against the thing that
   * ink actually sits on. Keyed by `<brand>::<token path>`.
   */
  const fills = new Map();

  const walk = (node, path) => {
    if (!node || typeof node !== "object") return;

    if ("$value" in node) {
      const ext = (node.$extensions ??= {});
      const mosje = (ext.mosje ??= {});
      const modes = (mosje.colorModes ??= {});

      for (const [groupPath, { brand }] of Object.entries(DBIM_GROUPS)) {
        let value = dbimValueFor(path, node.$value, groupPath);

        /*
         * THE FILL MOVES. `action/primary/default` and `hover` are the two fills one ink has
         * to serve, so the rung is chosen for them rather than the ink being chosen for it.
         * `dbimValueFor` has already mapped these to `{color.dbimPrimary.<group>.<rung>}`;
         * this re-points the rung to the measured one, which for four of the six groups is
         * the rung it already had.
         */
        const action = /^color\.action\.primary\.(default|hover)$/.exec(path);
        if (action && value !== null) {
          const { group, ...rungs } = actionRungs[groupPath];
          value = `{color.dbimPrimary.${group}.${rungs[action[1]]}}`;
        }

        if (value === null) continue;
        modes[brand] = value;
        fills.set(`${brand}::${path}`, value);
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

  /*
   * PASS 2 — THE INK MOVES. Every `on/bg/<path>` is the foreground for `bg/<path>` and for
   * nothing else, so its ink is chosen by measuring that fill: white where white clears AA,
   * DBIM's own Deep Earthy Brown where it does not. Deliberately NOT symmetrical — dark ink is
   * only reached for when white has failed, because white on a brand fill is what the rest of
   * the estate does and a preview that flipped ink wherever dark merely scored higher would
   * read as a different design rather than the same one made legible.
   *
   * It has to be a second pass: an `on/*` token can appear in the tree before the `bg/*` it
   * names, and choosing an ink against a fill that has not been mapped yet is how this would
   * silently go back to inheriting white.
   */
  const inked = [];

  /** The node at a dotted token path, or null. */
  const nodeAt = (tokenPath) =>
    tokenPath.split(".").reduce((n, k) => (n && typeof n === "object" ? n[k] : null), tree);

  /**
   * A token's resolved HEX in one DBIM brand, following the alias chain.
   *
   * A lookup would not do. `bg/brand/primary/bolder` is `{color.primaryScale.600}` — an alias
   * layer — so the brand never re-declares it and it has no DBIM value of its own; what makes
   * it green is that `primaryScale` is re-pointed underneath it. Reading only what pass 1
   * recorded therefore finds nothing for exactly the fills this repair exists for.
   */
  const resolveForBrand = (tokenPath, brand, depth = 0) => {
    if (depth > 12) return null;
    const node = nodeAt(tokenPath);
    if (!node || typeof node !== "object" || !("$value" in node)) return null;
    const raw = String(fills.get(`${brand}::${tokenPath}`) ?? node.$value).trim();
    const m = /^\{([^}]+)\}$/.exec(raw);
    if (!m) return /^#[0-9a-f]{3,8}$/i.test(raw) ? raw : null;
    return resolveDbimRef(m[1]) ?? resolveForBrand(m[1], brand, depth + 1);
  };

  /**
   * The lightest rung of this brand's PRIMARY ramp, darker than `fill`, that carries `ink` at
   * AA — or null when `fill` is not on that ramp, or nothing darker is dark enough.
   */
  const darkerPrimaryRungFor = (fill, ink, brand) => {
    const groupPath = Object.keys(DBIM_GROUPS).find((g) => DBIM_GROUPS[g].brand === brand);
    const ramp = DBIM.primary[groupPath];
    const at = PRIMARY_RUNGS.concat([900]).find((r) => ramp[r] === fill);
    if (at === undefined) return null;
    for (const r of PRIMARY_RUNGS.concat([900]).filter((x) => x > at)) {
      const ratio = contrast(ink, ramp[r]);
      if (ratio >= AA) return { ref: `{color.dbimPrimary.${DBIM_GROUPS[groupPath].group}.${r}}`, ratio };
    }
    return null;
  };

  /** Set a brand's value for a node, recording it for the audit line. */
  const setInk = (node, brand, ref, why) => {
    const ext = (node.$extensions ??= {});
    const mosje = (ext.mosje ??= {});
    (mosje.colorModes ??= {})[brand] = ref;
    inked.push(`${brand} ${why}`);
    touched++;
  };

  const inkWalk = (node, path) => {
    if (!node || typeof node !== "object") return;

    if ("$value" in node) {
      /*
       * A STATUS BADGE'S INK SITS ON ITS OWN TONAL GROUND, and DBIM publishes one colour per
       * status — Liberty Green #198754 and the other three — pinned at rung 500. The badge ink
       * (600) and the tonal ground (100) are both DERIVED from it, and for success the pair
       * lands at 4.42:1: eight hundredths short, in all six groups at once, because the status
       * palette is group-independent. The ink steps to the lightest darker rung that clears AA
       * on the same ground; the ground does not move, because lightening it would change what
       * a badge looks like rather than what it measures.
       */
      const status = /^color\.status\.([a-z]+)$/.exec(path);
      if (status) {
        for (const { brand } of Object.values(DBIM_GROUPS)) {
          const ground = resolveForBrand(`color.status.${status[1]}Tonal`, brand);
          const ink = resolveForBrand(path, brand);
          if (!ground || !ink || contrast(ink, ground) >= AA) continue;
          const ref = /^\{color\.([A-Za-z]+)\.(\d+)\}$/.exec(String(fills.get(`${brand}::${path}`) ?? ""));
          if (!ref) continue;
          const fixed = [600, 700, 800, 900]
            .filter((r) => r > Number(ref[2]))
            .find((r) => {
              const hex = resolveDbimRef(`color.${ref[1]}.${r}`);
              return hex && contrast(hex, ground) >= AA;
            });
          if (!fixed) continue;
          setInk(node, brand, `{color.${ref[1]}.${fixed}}`, `${path} → ${ref[1]}.${fixed} on ${ground}`);

          /*
           * KEEP THE PROMINENCE STEP. `status/<x>` and `status/<x>Strong` are two rungs of one
           * idea, and success sat on 600 with Strong on 700 — so moving success to 700 to clear
           * AA would have landed both on the same colour and quietly deleted the distinction
           * the pair exists to draw. Strong follows one rung further down.
           */
          const strongNode = nodeAt(`color.status.${status[1]}Strong`);
          const strongRef = /^\{color\.([A-Za-z]+)\.(\d+)\}$/.exec(
            String(fills.get(`${brand}::color.status.${status[1]}Strong`) ?? ""),
          );
          if (strongNode && strongRef && Number(strongRef[2]) <= fixed) {
            const next = [700, 800, 900].find((r) => r > fixed);
            if (next && resolveDbimRef(`color.${strongRef[1]}.${next}`)) {
              setInk(strongNode, brand, `{color.${strongRef[1]}.${next}}`,
                `color.status.${status[1]}Strong → ${strongRef[1]}.${next} (kept a rung below ${fixed})`);
            }
          }
        }
        return;
      }

      /*
       * INK ON ITS ONE FILL. `on/bg/<path>` is the foreground for `bg/<path>` and for nothing
       * else, so it can be chosen by measuring that fill.
       *
       * THE TEST IS THE TOKEN'S OWN CURRENT INK, not white. An earlier version asked "does
       * white fail here?", which is a different question and got a different answer: on
       * `bg/neutral/base` white fails trivially — the surface is white — so it rewrote the ink
       * of every light surface in all six brands, for no defect.
       *
       * THIS IS ONLY SAFE BECAUSE EVERY BRAND NOW DECLARES EVERY BRAND-VARYING TOKEN. The
       * first attempt at this put Deep Earthy Brown on the NMBA login button at 1.6:1, and
       * the reason was not the ink: the portal login renders inside a `data-brand="navy"`
       * island, navy did not declare this token, and so the DBIM ink leaked in from the
       * ambient page while the fill stayed navy. `legacy-ds-css.mjs` now emits every
       * brand-varying token in every brand block, so an island cannot inherit a foreground
       * whose background it has replaced.
       */
      const fillPath = path.startsWith("on.bg.") ? path.slice(3) : null;
      if (!fillPath) return;
      for (const { brand } of Object.values(DBIM_GROUPS)) {
        const fill = resolveForBrand(fillPath, brand);
        const ink = resolveForBrand(path, brand);
        if (!fill || !ink || contrast(ink, fill) >= AA) continue;
        const better = [
          { ref: "{text.neutral.inverse}", hex: "#ffffff" },
          { ref: "{color.dbimInk}", hex: DBIM_INK },
        ]
          .map((c) => ({ ...c, ratio: contrast(c.hex, fill) }))
          .filter((c) => c.ratio >= AA)
          .sort((a, b) => b.ratio - a.ratio)[0];
        // Neither ink clears AA — leave it, so the gate reports a fill no foreground can sit
        // on rather than silently picking the least bad one.
        if (!better) continue;
        setInk(node, brand, better.ref, `${path} → ${better.ref} on ${fill} (${better.ratio.toFixed(2)}:1)`);
      }
      return;
    }

    for (const key of Object.keys(node)) {
      if (key.startsWith("$")) continue;
      inkWalk(node[key], path ? `${path}.${key}` : key);
    }
  };

  inkWalk(tree, "");


  return touched;
}
