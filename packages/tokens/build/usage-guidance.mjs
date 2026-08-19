/**
 * Usage guidance — the "when would I reach for this?" sentence on every semantic token.
 *
 * WHY THIS EXISTS
 *
 * Our descriptions carried a measured contrast ratio and, at best, a two-word label
 * ("Hovered rows, quiet panels"). That is rigorous and nearly useless to someone choosing a
 * token: it says what the colour IS, never when to pick it over its neighbour. UX4G’s Figma
 * library does the opposite — "Use when the tonal button’s action is not available." — which
 * is worse evidence and much better guidance.
 *
 * They are not alternatives. A description should say what the token is FOR (this file) and
 * what it is WORTH (the measured contrast, appended by the exporter). This closes the half we
 * were missing without giving up the half we had.
 *
 * WHY IT IS ONE MODULE AND NOT 400 STRINGS
 *
 * Guidance written per-token drifts: the same rung ends up described three ways in three
 * namespaces, and nobody notices because no two descriptions sit next to each other. Deriving
 * it from the path means the vocabulary is reviewed in ONE place, a whole rung can be reworded
 * in one edit, and a new token cannot ship with no guidance at all.
 *
 * HOUSE STYLE — matched to UX4G’s so a designer moving between the two libraries reads one voice:
 *   - Start with "Use for" or "Use when".
 *   - Name the SITUATION, not the colour. "Use when a tonal button is pressed", never
 *     "the pressed tonal button colour".
 *   - One sentence. The contrast measurement follows it and does the quantitative work.
 *   - Where a choice is easy to get wrong, say what NOT to use it for — that is the sentence
 *     that actually saves someone.
 */

const FAMILY_NOUN = {
  neutral: "neutral",
  brand: "brand",
  status: "status",
  link: "link",
};

const STATUS_MEANING = {
  success: "a successful or completed state",
  error: "an error or destructive state",
  warning: "a warning or a state needing attention",
  info: "an informational or in-progress state",
};

/** What each fill rung is FOR — the distinction between neighbouring rungs, which is the hard part. */
const FILL_RUNG = {
  base: "the ordinary, quietest fill — page and card surfaces that must not compete with their content",
  subtler: "a barely-there tint, for hovered rows and zebra striping",
  subtle: "a quiet tonal fill — chips, badges and callouts that should read as a block without shouting",
  bold: "a tonal fill with more presence, for selected rows and active filters",
  bolder: "a solid fill that carries white text — primary buttons and filled banners",
  boldest: "the heaviest fill, for maximum emphasis on a light page",
};

/** What each ink rung is FOR. */
const INK_RUNG = {
  base: "body copy and headings — the default reading colour",
  subtle: "captions, hints and secondary labels that sit beside primary text",
  subtler: "non-essential text and quiet icons, never body copy",
  bolder: "max-contrast headings that need to outrank surrounding text",
  boldest: "the highest-contrast text available, for AAA contexts",
};

const ACTION_STATE = {
  default: (v) => `Use for ${v} buttons at rest.`,
  hover: (v) => `Use when the user hovers over a ${v} button.`,
  active: (v) => `Use when a ${v} button is pressed.`,
  disabled: (v) => `Use when a ${v} button’s action is not available.`,
};

const ACTION_INTENT = {
  brand: "primary-brand",
  success: "confirming",
  destructive: "destructive",
  neutral: "neutral",
  light: "light",
};

const PROPERTY_NOUN = { bg: "fill", text: "label", border: "outline", ring: "focus ring" };

/** Tier-3 action matrix: `action/<intent>/<variant>[/inverse]/<state>/<property>`. */
function actionGuidance(path) {
  const [, intent, variant, ...rest] = path;
  const inverse = rest[0] === "inverse";
  const [state, property] = inverse ? rest.slice(1) : rest;
  const phrase = ACTION_STATE[state];
  if (!phrase) return null;
  const label = `${ACTION_INTENT[intent] ?? intent} ${variant}`;
  const noun = PROPERTY_NOUN[property] ?? property;
  const where = inverse ? " placed on a solid brand surface" : "";
  return `${phrase(label).replace(/\.$/, "")}${where} — the ${noun}.`;
}

/** What a component-token's last segment IS, in words a designer uses. */
const CMP_PROPERTY = {
  bg: "fill",
  bgHover: "hovered fill",
  text: "label colour",
  border: "outline",
  radius: "corner radius",
};

/**
 * Tier-3 component tokens outside the action matrix: `cmp/<component>/[<variant>/]<property>`.
 *
 * These say WHERE a value is wired, not WHEN to choose it — which is exactly why the sentence
 * has to point back up at the semantic layer. A designer who binds `cmp/card/bg` to something
 * that is not a card has bound a value that will move when the Card component changes.
 */
function componentGuidance(path) {
  // NOTE the path does NOT carry the `cmp` tier segment — tier arrives separately, and only the
  // action matrix spells its own first segment (`action/…`). Destructuring as if `cmp` were
  // present ate the component name: `button/primary/bg` described "the primary’s fill", and the
  // two-segment `button/radius` fell off the end and returned null.
  const [component, ...rest] = path;
  if (!component || rest.length === 0) return null;
  const prop = rest[rest.length - 1];
  const variant = rest.length > 1 ? rest.slice(0, -1).join(" ") : "";
  const noun = CMP_PROPERTY[prop] ?? prop;
  return (
    `Use for the ${variant ? variant + " " : ""}${component}’s ${noun}. ` +
    `Component-internal: it resolves to a semantic token, so bind that semantic token instead ` +
    `unless you are building the ${component} itself.`
  );
}

/** Tier-2 colour roles: `<role>/<family>[/<variant>][/<rung>][/<state>]`. */
function colourGuidance(slots, path) {
  const { role, family, variant, prominence, state } = slots;
  const subject =
    family === "status" && variant
      ? STATUS_MEANING[variant] ?? variant
      : family === "brand" && variant
        ? `the ${variant} brand colour`
        : FAMILY_NOUN[family] ?? family;

  if (state === "disabled") {
    return `Use when a ${role === "text" || role === "icon" ? "control’s content" : "control"} is disabled — it is deliberately low-contrast and exempt from the text contrast rules.`;
  }
  if (path.includes("inverse")) {
    return `Use for ${role === "bg" ? "an inverted surface such as a tooltip or dark panel" : `${role === "text" ? "text" : role + "s"} placed on an inverted or solid brand surface`}.`;
  }

  if (role === "bg" || role === "overlay") {
    if (role === "overlay") return "Use for the scrim behind a modal or drawer — it suppresses the page beneath rather than carrying content.";
    const rung = FILL_RUNG[prominence];
    if (!rung) return `Use as a ${subject} surface.`;
    return family === "status"
      ? `Use for ${rung}, when the surface signals ${subject}.`
      : `Use for ${rung}${family === "brand" ? `, tinted with the ${variant ?? "brand"} brand colour` : ""}.`;
  }

  if (role === "text" || role === "icon") {
    const noun = role === "text" ? "text" : "icons";
    if (family === "link") {
      const kind = variant === "visited" ? "an already-visited link" : variant === "neutral" ? "a link that must not stand out from surrounding text" : "a standard text link";
      return state && state !== "default"
        ? `Use for ${kind} in its ${state} state.`
        : `Use for ${kind}.`;
    }
    if (family === "status") return `Use for ${noun} that report ${subject}.`;
    if (family === "brand") return `Use for ${noun} in the ${variant ?? "brand"} brand colour — not for long-form reading.`;
    const rung = INK_RUNG[prominence];
    return rung ? `Use for ${rung}.` : `Use for ${noun}.`;
  }

  if (role === "border" || role === "outline") {
    if (family === "status") return `Use for the outline of a control or callout reporting ${subject}.`;
    if (family === "brand") return `Use for the outline of a ${variant ?? "brand"}-brand control, such as a selected card or a focused input.`;
    const strength =
      prominence === "subtle" ? "a hairline that separates without drawing the eye — dividers and card edges"
      : prominence === "bolder" ? "the visible edge of an interactive control, such as an input or a checkbox"
      : "a standard boundary";
    return `Use for ${strength}.`;
  }
  return null;
}

/** Non-colour groups and everything else that earns a sentence. */
function groupGuidance(path) {
  const [head, ...rest] = path;
  const key = rest.join("/");

  if (head === "on") {
    const fill = rest.slice(1).join("/");
    return `Use for text and icons placed on \`bg/${fill}\`. The pairing was chosen by measurement, so it is the safe foreground for that fill in every brand — do not substitute another ink.`;
  }
  // The page margin is one shape repeated per viewport, so it is derived here rather than
  // hand-written three times — which is the difference between one sentence to review and
  // three that drift.
  if (head === "grid" && rest[0] === "margin") {
    const AT = { mobile: "on a phone", tablet: "on a tablet", desktop: "on a desktop" };
    return `Use for the page’s side margin ${AT[rest[1]] ?? `at ${rest[1]}`} — the gap between the layout grid and the viewport edge. Bind it to the frame’s horizontal padding, not to the grid’s gutter, which is \`grid/gutter\`.`;
  }
  if (head === "layer") {
    if (rest[0] === "border") return `Use for the hairline separating a level-${rest[1]} surface from the one beneath it.`;
    return rest[0] === "0"
      ? "Use as the page surface — the bottom of the stack."
      : `Use as the surface for content nested ${rest[0]} level${rest[0] === "1" ? "" : "s"} deep, such as a card${rest[0] === "1" ? "" : "-within-a-card"}. Step one level per nesting rather than picking a grey by eye.`;
  }
  if (head === "icon" && rest[0] === "size")
    return rest[1] === "md"
      ? "Use as the DEFAULT icon size (24px) — what ⟨Icon⟩ ships with. Bind this rather than passing a number."
      : `Use for a ${rest[1]} icon. Bind a step rather than a raw number, so icons stay in proportion when the scale moves.`;
  if (head === "container")
    return rest[0] === "content"
      ? "Use as the max-width of page content (1280px). This is mandated estate-wide — do not set a different content width per page."
      : `Use as the container max-width at the ${rest[0]} breakpoint.`;
  if (head === "elevation")
    return rest[0] === "flat"
      ? "Use when a surface must sit flat on the page — explicitly no shadow, rather than omitting one."
      : `Use for a ${rest[0]}. Pick by WHAT THE SURFACE IS, not by how deep the shadow looks — that is what keeps two dropdowns from disagreeing.`;
  if (head === "control")
    return rest[0] === "radius"
      ? "Use for the corner radius of an interactive control — buttons, inputs, selects. One radius keeps controls a family."
      : "Use for the border width of an interactive control.";
  if (head === "motion" && ["enter", "exit", "emphasis"].includes(rest[0]))
    return rest[0] === "enter" ? `Use for something ARRIVING — the ${rest[1]} half of the pair. Entering decelerates and may take its time.`
      : rest[0] === "exit" ? `Use for something LEAVING — the ${rest[1]} half of the pair. Leaving accelerates and gets out of the way.`
      : `Use for a deliberate, attention-carrying move — the ${rest[1]} half of the pair. Reserve it; everything cannot be emphasis.`;
  if (head === "focus" && (rest[0] === "width" || rest[0] === "offset"))
    return `Use for the focus ring’s ${rest[0]}. The ring’s colour was tokenised long before its geometry, so this was hardcoded — WCAG 2.4.7 governs all three.`;
  if (head === "focus") return "Use for the focus indicator. WCAG 2.4.7 makes this non-optional — never suppress it, and never substitute a colour with less contrast.";
  if (head === "chart") {
    if (rest[0] === "cat") return `Use as series ${rest[1]} in a categorical chart. The twelve values are chosen for mutual distinguishability, so take them in order rather than picking favourites.`;
    if (rest[0] === "seq") return `Use as step ${rest[1]} of a sequential (single-hue) scale, for data that runs low to high.`;
    if (rest[0] === "div") return "Use in a diverging scale, for data with a meaningful midpoint such as change versus a target.";
    if (rest[0] === "trend") return `Use for a ${rest[1]} trend indicator. Pair it with an arrow or a sign — colour alone fails WCAG 1.4.1.`;
    if (rest[0] === "grid" || rest[0] === "axis") return `Use for chart ${rest[0]} lines, which should recede behind the data.`;
    return "Use in data visualisation.";
  }
  if (head === "density") return `Use for ${key.replace(/\//g, " ")} — it changes with the density axis, so bind it rather than hard-coding a value.`;
  // Value-named since 2026-08-18: the rung IS the pixel value, so the description says so rather
  // than naming a T-shirt "step" that no longer exists. The cross-family sentence is the point of
  // the rename — `l` used to mean 16 in inline, 24 in stack, 20 in padding and 56 in section.
  const SPACE_USE = {
    inline: "Horizontal gap between items on one line",
    stack: "Vertical gap between stacked items, and vertical rhythm inside a block",
    padding: "Inset between a container’s edge and its content",
    section: "Vertical rhythm between page-level sections",
  };
  if (SPACE_USE[head]) {
    const px = rest[0];
    return `${SPACE_USE[head]} — ${px}px. The label IS the value: \`inline/${px}\`, \`stack/${px}\`, ` +
      `\`padding/${px}\` and \`section/${px}\` are all ${px}px.`;
  }
  if (head === "blur") return `Use for a ${rest[0]} blur on backdrops and scrims.`;
  if (head === "type") return `Use for the ${rest[0]} type role — it responds to surface and viewport, so bind it rather than copying a px value.`;
  return null;
}

/**
 * The guidance sentence for a token, or null when it does not earn one.
 *
 * Returns null for Tier-1 primitives on purpose: a palette step has no situation to describe,
 * and inventing one ("use for blue things") is noise. They get a pointer instead — see
 * `primitivePointer`.
 */
export function guidanceFor(path, tier, parse) {
  if (tier === "cmp" && path[0] === "action") return actionGuidance(path);
  // Every OTHER cmp token — the legacy button/card set from component.json — used to fall
  // straight through to `null` and ship with an empty description. Only the action matrix was
  // ever covered, because it was the only cmp family that existed when this was written.
  if (tier === "cmp") return componentGuidance(path);
  if (tier !== "sys") return null;

  // Tier-2 corner radius. Added 2026-08-12 with the retirement of `--ds-radius-*`, whose 248
  // usages had no Tier-2 home — every one of them was binding a Tier-1 primitive by proxy.
  if (path[0] === "shape") return SHAPE_GUIDANCE[path[1]] ?? null;

  // The legacy `color/*` Tier-2 layer: brand-aware ramps and alpha tiers. They are a palette,
  // not a decision, so they get the same pointer a primitive does — the semantic roles above
  // them are where the choice belongs.
  if (path[0] === "color") {
    if (path[1] === "transparent") return `Use for a translucent ${path[2]} wash at ${path[3]}% — for overlays and hover states, not as a text colour.`;
    return "Brand-aware palette step. Prefer a semantic token (`bg/*`, `text/*`, `border/*`) — those carry the contrast guarantee.";
  }

  const grouped = groupGuidance(path);
  if (grouped) return grouped;

  const r = parse?.(path, "sys");
  if (r?.ok && r.slots?.role && r.slots?.family) return colourGuidance(r.slots, path);
  return null;
}

/** Display/Headline/Title/Body/Label — the style folder each role ramp lives in, in Figma. */
const TYPE_STYLE_FOLDER = { display: "Display", headline: "Headline", title: "Title", body: "Body", label: "Label" };

/**
 * Type primitives point at the TEXT STYLE, never at `type/*`.
 *
 * `type/*` is the CSS namespace (`--ds-type-display-1-size`). It has never existed as a Figma
 * variable — a search for "type/" in the picker returns nothing — yet this sentence was
 * attached to all 108 variables in the Type collection, sending every designer who read it
 * after something unfindable. The sentence was written for a stylesheet reader and landed on
 * a canvas reader.
 *
 * In Figma the equivalent of a `type/*` role IS a text style: it binds family, weight, size,
 * leading, tracking and paragraph spacing in one place, and it follows the surface x
 * breakpoint modes for free. So a role primitive names its exact style, and the raw ladders
 * (family, weight, size, lineHeight, tracking) name the ramp they are assembled into.
 */
function fontPointer(path) {
  const [, group, role, step] = path;
  const folder = group === "role" ? TYPE_STYLE_FOLDER[role] : null;
  if (folder) {
    return `Raw type step. Prefer the text style \`${folder}/${role}-${step}\` — it binds size, ` +
      `leading, tracking and paragraph spacing together and follows the Type modes.`;
  }
  return "Raw type step. Prefer a text style from the Display / Headline / Title / Body / Label " +
    "ramp — these are the parts those styles are assembled from.";
}

/**
 * Tier-1 primitives get a pointer, not a use case — the semantic layer is where choices are made.
 *
 * Consumed ONLY by `formats/figma-variables.mjs`, as the description on a `ref/*` variable
 * (`guidanceFor` is the one the CSS/TS generators share). The audience is therefore a designer
 * in the Figma variable picker, which is why these name Figma styles and collections rather
 * than CSS custom properties.
 */

/** Tier-2 corner radius. Named `shape` because a Tier-2 group called `radius` would
 * self-reference the Tier-1 scale it aliases; see build/grammar.mjs. */
const SHAPE_GUIDANCE = {
  "0": "Use for a square corner \u2014 tables, full-bleed media, anything that should read as flush.",
  "2": "Use for the smallest softening, on dense controls where a visible curve would read as noise.",
  "4": "Use for small chips, tags and inline badges.",
  "6": "Use for inputs, selects and other text-entry controls.",
  "8": "Use for buttons and standard controls. This is the default shape of the system.",
  "12": "Use for cards and panels \u2014 a surface holding content rather than a control.",
  "16": "Use for large containers and modal surfaces.",
  "20": "Use for hero and feature surfaces, where the curve is part of the composition.",
  "24": "Use for the largest editorial surfaces.",
  "32": "Use for oversized decorative surfaces. Rare; check a smaller step first.",
  "40": "Use for the largest decorative surface in the system. Rare.",
  "full": "Use for pills and circles \u2014 avatars, toggles, status dots. Fully rounded at any size."
};

export function primitivePointer(path) {
  const [head] = path;
  if (head === "color") return "Palette step. Prefer a semantic token (`bg/*`, `text/*`, `border/*`) — those carry the contrast guarantee and follow the brand.";
  if (head === "size") return "Raw size step, value-named. Prefer `space/*`, `padding/*` or a text style unless you genuinely need an arbitrary dimension.";
  if (head === "space") return `${path[1]}px raw spacing step, value-named. TIER 1 — hidden from publishing and banned in app code by tier-discipline.test.mjs. Bind \`inline/${path[1]}\`, \`stack/${path[1]}\`, \`padding/${path[1]}\` or \`section/${path[1]}\` instead; all four resolve here.`;
  if (head === "font") return fontPointer(path);
  if (head === "radius") return `${path[1] === "full" ? "Fully-rounded sentinel" : path[1] + "px raw radius step, value-named"}. TIER 1 — hidden from publishing and banned in app code. Bind \`shape/${path[1]}\` instead, which resolves here.`;
  if (head === "motion" || head === "opacity" || head === "blur") return `Raw ${head} step.`;
  // `border` was the one primitive group with no pointer, so all five ref/border/width/*
  // shipped to Figma with an EMPTY description — the only variables in the library that had
  // none. A missing case here is silent: guidanceFor returns null and the exporter writes "".
  if (head === "border") return "Raw border-width step. Prefer `control/border/width`, which says what the edge is for and follows the control, rather than binding a raw width.";
  if (head === "z") return "Stacking order. Code-only — Figma has no canvas property for z-index.";
  if (head === "breakpoint") return "Viewport anchor. The fluid type curve is built from these; they are not a layout property to bind.";
  return null;
}
