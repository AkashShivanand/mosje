/**
 * VALUE parity with the Figma library — the half the name checksums never covered.
 *
 * `reference/figma-live.json` records variable NAMES, and every check built on it compares
 * names. That is why, on 2026-08-11, the library could sit with:
 *
 *   - 13 component tokens bound to the WRONG palette rung — `cmp/action/destructive/primary/*`
 *     still on danger 700/800/900 after the code moved to 600/700/800, and
 *     `cmp/action/brand/tonal/*` still on primary 100/200/300 after the code moved to 50/100/200,
 *     which had been stale since v0.13.0;
 *   - `ref/font/family/mono` holding a webfont the code had deliberately reverted;
 *   - 54 fluid-type variables whose TABLET samples were the old curve (`body/1/size` at 15
 *     where the code says 14.89, `body/1/para` at 16 where the code says 13.77).
 *
 * Every one of those has the same name in both places. A name diff is blind to all of it, and
 * nothing else looked, so the drift was found only because someone asked the question directly.
 *
 * This reduces every collection to ONE checksum over `name|mode|value`, so a single changed
 * value moves a single number. It is deliberately not a full value dump: the point is to fail
 * loudly when code and library disagree, not to mirror 1,400 values into the repo where they
 * would themselves rot.
 *
 * WHAT IT DOES NOT CATCH, by construction: a value changed in Figma and ALSO re-recorded here
 * without being changed in code. Recording is a deliberate act after a verified read — the same
 * contract as `$effectStyles.generated`.
 */

/** `#rrggbb` / `rgba(...)` -> {r,g,b,a} in 0-255 + 0-1 alpha. */
function parseColour(raw) {
  const s = String(raw).trim();
  if (s[0] === "#") {
    const h = s.length === 4 ? s.slice(1).split("").map((c) => c + c).join("") : s.slice(1);
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }
  const m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)$/.exec(s);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
}

/**
 * One canonical string per value, matching what a Figma read produces.
 *
 * `rem` becomes px because Figma stores the px equivalent — `ref/size/24` is `1.5rem` in the
 * payload and `24` in the library. Comparing those raw would report every rem token as drifted.
 */
export function normValue(val) {
  // A live read-back normalises Figma's COMPOSE_COLOR expression (base alias, alpha alias)
  // to exactly this string — "->base@->alpha/N" — which is how the checksums can agree.
  // An alias that carries its own opacity is a different value from the bare alias: the
  // checksum has to move when the binding is made in Figma, or the parity gate could not tell
  // "alias at 8%" from "alias at 100%".
  if (val.type === "ALIAS") return "->" + val.name + (val.opacity ? "@->" + val.opacity.name : "");
  if (val.type === "COLOR") {
    const c = parseColour(val.value);
    if (!c) return "COLOR?" + val.value;
    const hx = "#" + [c.r, c.g, c.b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
    return hx + (c.a < 1 ? "@" + c.a.toFixed(4) : "");
  }
  if (val.type === "TIMING") return String(Math.round(val.value * 10000) / 10000);
  if (val.type === "EASING") {
    const r = (n) => Math.round(n * 10000) / 10000;
    const b = val.value;
    return `bezier(${r(b.x1)},${r(b.y1)},${r(b.x2)},${r(b.y2)})`;
  }
  if (val.type === "FLOAT") {
    const n = val.unit === "rem" ? val.value * 16 : val.value;
    return String(Math.round(n * 10000) / 10000);
  }
  return String(val.value);
}

/** djb2 — the same function the name checksums use, so one shape of evidence across the sync. */
export function checksum(entries) {
  const s = entries.slice().sort().join("\n");
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (((h * 33) ^ s.charCodeAt(i)) >>> 0);
  return h.toString(16) + ":" + entries.length;
}

/** Per-collection value checksum for a built `figma.variables.json` payload. */
export function collectionValueChecksums(payload) {
  const out = {};
  for (const c of payload.collections) {
    const entries = [];
    for (const v of c.variables) {
      for (const [mode, val] of Object.entries(v.valuesByMode)) {
        entries.push(`${v.name}|${mode}|${normValue(val)}`);
      }
    }
    out[c.name] = checksum(entries);
  }
  return out;
}

/**
 * The OTHER four fields the standard requires on every variable — and the ones the value
 * checksum was blind to. On 2026-09-05 a live read found 253 descriptions HTML-escaped, five
 * codeSyntax lines naming CSS variables that do not exist, visibility disagreeing on 164
 * variables and the wildcard `ALL_FILLS` on all 138 Palette rungs — with every value checksum
 * equal. One checksum per field per collection, over `name=value` entries, so a drift in any
 * field moves exactly one number and says which field it was.
 *
 * Scopes skip TIMING and EASING: they cannot be set (Figma reports `ALL_SCOPES` on read and
 * the payload emits `[]`), so comparing them would report a difference that is not one.
 * Library-only variables (the `ref/viewport/*` canvas widths) are excluded by the reader,
 * not here — the payload does not carry them, so they never enter the payload side.
 */
export function collectionFieldChecksums(payload) {
  const out = {};
  for (const c of payload.collections) {
    const desc = [], web = [], scopes = [], hidden = [];
    for (const v of c.variables) {
      desc.push(`${v.name}=${v.description ?? ""}`);
      web.push(`${v.name}=${v.codeSyntax?.WEB ?? ""}`);
      if (v.type !== "TIMING" && v.type !== "EASING") scopes.push(`${v.name}=${[...(v.scopes ?? [])].sort().join("+")}`);
      hidden.push(`${v.name}=${v.hiddenFromPublishing ? 1 : 0}`);
    }
    out[c.name] = { description: checksum(desc), codeSyntax: checksum(web), scopes: checksum(scopes), hidden: checksum(hidden) };
  }
  return out;
}
