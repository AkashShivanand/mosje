/**
 * Shadows are the one part of the system Figma cannot hold as a VARIABLE.
 *
 * Figma variables carry COLOR, FLOAT, STRING and BOOLEAN. A shadow is none of those — it is a
 * composite of offset, blur, spread and colour, and `shadow.sm`/`md`/`lg` are each TWO of those
 * stacked. So `--ds-shadow-*` and `--sa-elevation-*` shipped in CSS while the Figma library had
 * no shadow tokens at all, and a designer reaching for elevation had nothing to reach for.
 *
 * The Figma primitive that DOES fit is an **effect style**, which holds an ordered list of
 * drop shadows. This module is the translation, and it lives in `build/` rather than inside the
 * sync script for one reason: the sync WRITES the styles and a test has to CHECK them, and if
 * those two parsed the same CSS separately they would eventually disagree — which is exactly
 * the class of drift the contrast contract and the codeSyntax audit both turned out to be.
 *
 * WHAT THIS DOES NOT DO: bind the shadow colour to a variable. `setBoundVariableForEffect`
 * exists, but the colour here (`rgba(31, 36, 40, α)`) is a fixed tint at six different alphas,
 * not a themed value, and there is no single palette variable that is any of them. Binding only
 * the colour would make the style half-generated and half-literal, which is harder to reason
 * about than a literal that a gate compares against its source. The gate is the answer to drift,
 * not a partial binding.
 */

/** `rgba(31, 36, 40, 0.12)` / `#rrggbb` -> Figma's 0..1 RGBA. */
function parseColor(raw) {
  const s = raw.trim();
  if (s[0] === "#") {
    const hex = s.length === 4
      ? s.slice(1).split("").map((c) => c + c).join("")
      : s.slice(1);
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }
  const m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)$/.exec(s);
  if (!m) throw new Error(`shadow: unparseable colour ${JSON.stringify(raw)}`);
  return {
    r: +m[1] / 255,
    g: +m[2] / 255,
    b: +m[3] / 255,
    a: m[4] === undefined ? 1 : +m[4],
  };
}

/** Split on commas that are NOT inside `rgba(...)`. */
function splitLayers(css) {
  const out = [];
  let depth = 0, current = "";
  for (const ch of css) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(current); current = ""; continue; }
    current += ch;
  }
  if (current.trim()) out.push(current);
  return out.map((l) => l.trim()).filter(Boolean);
}

const px = (v) => {
  const n = parseFloat(v);
  if (Number.isNaN(n)) throw new Error(`shadow: expected a length, got ${JSON.stringify(v)}`);
  return n;
};

/**
 * A CSS `box-shadow` value -> the effects array Figma wants.
 *
 * `none` yields `[]`, which is a real and useful state: an effect style with no effects is how a
 * designer says "deliberately flat" and resets an inherited elevation.
 */
export function parseShadow(css) {
  const value = String(css).trim();
  if (!value || value === "none") return [];

  return splitLayers(value).map((layer) => {
    // Pull the colour off first — it is the only part containing spaces inside brackets.
    const cm = /(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8})/.exec(layer);
    if (!cm) throw new Error(`shadow: layer has no colour: ${JSON.stringify(layer)}`);
    const color = parseColor(cm[1]);
    const lengths = layer.replace(cm[1], "").trim().split(/\s+/).filter(Boolean);
    if (lengths.length < 3) {
      throw new Error(`shadow: layer needs x, y and blur — got ${JSON.stringify(layer)}`);
    }
    const [x, y, blur, spread] = lengths;
    return {
      type: "DROP_SHADOW",
      color,
      offset: { x: px(x), y: px(y) },
      radius: px(blur),
      spread: spread === undefined ? 0 : px(spread),
      visible: true,
      blendMode: "NORMAL",
    };
  });
}

/**
 * Which effect style each elevation gets, and what it is FOR.
 *
 * Mirrors `elevation.*` in `src/semantic.json`. Kept beside the parser so the sync and the gate
 * read one list; `elevation-parity.test.mjs` fails if this and the token source disagree.
 */
export const ELEVATION = [
  ["flat", "none", "Use when a surface sits FLAT on the page — and use it deliberately, to reset an elevation something else applied. It carries no effects on purpose."],
  ["card", "xs", "Use for a card or panel resting on the page. The quietest real elevation: enough to separate the surface from its background, not enough to read as floating."],
  ["raised", "sm", "Use for a surface lifted on interaction — a hovered card, a sticky bar that has parted from the content behind it."],
  ["dropdown", "md", "Use for a menu, select or popover opened from a control. It must read as above the page without competing with a modal."],
  ["modal", "lg", "Use for a dialog or side sheet that owns the screen. Pair it with the scrim (`overlay/neutral/boldest`) — the shadow separates, the scrim suppresses."],
  ["toast", "xl", "Use for a toast or notification that floats above everything. The heaviest step, because it appears unannounced and has to be found."],
];
