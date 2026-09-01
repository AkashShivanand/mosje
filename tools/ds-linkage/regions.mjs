#!/usr/bin/env node
/**
 * Shared source-scanning machinery for the linkage gates.
 *
 * `ds-linkage` (fills, strokes, padding, gaps, radii) and `type-linkage` (font size,
 * leading, tracking, family) ask DIFFERENT questions of the SAME regions of the SAME
 * files. Both need to know which slices of a `.tsx` are actually styling something,
 * both need comments blanked so prose is never mistaken for a value, and both need to
 * honour the identical `ds-exempt(...)` vocabulary.
 *
 * That machinery lived once, inside ds-linkage/check.mjs, and the second gate would
 * have had to copy it. This estate has a long record of what a hand-maintained second
 * copy does — the colour docs page, the changelog, the 168 hand-typed type numbers —
 * so it is extracted here instead and imported by both. One parser, one exemption
 * vocabulary, one definition of "this line is styling".
 *
 * Nothing here decides what a VIOLATION is. Each gate brings its own matchers and its
 * own property table; this module only says WHERE to look and WHAT is excused.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
export const CONFIG = JSON.parse(readFileSync(join(ROOT, "tools/ds-linkage/config.json"), "utf8"));
const VALID_CATEGORIES = new Set(CONFIG.exemptionCategories);

/* ── file discovery ────────────────────────────────────────────────── */

export function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (CONFIG.skipDirs.includes(entry)) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(entry) && !/\.(test|spec)\./.test(entry)) out.push(p);
  }
  return out;
}

/* ── region extraction ───────────────────────────────────────────── */

/** Pull out `style={{ … }}` bodies with balanced braces. Returns [start,end) offsets. */
export function styleObjectRegions(src) {
  const regions = [];
  const re = /style=\{\{/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 2; // we already consumed `{{`
    let i = m.index + m[0].length;
    while (i < src.length && depth > 0) {
      const c = src[i];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      i++;
    }
    regions.push([m.index, i]);
  }
  return regions;
}

/** Template literals that look like CSS (contain `prop: value;`). */
export function cssTemplateRegions(src) {
  const regions = [];
  for (let i = 0; i < src.length; i++) {
    if (src[i] !== "`") continue;
    let j = i + 1;
    while (j < src.length && !(src[j] === "`" && src[j - 1] !== "\\")) j++;
    const body = src.slice(i + 1, j);
    // CSS-ish: at least two `prop: value;` declarations
    if ((body.match(/[a-z-]+\s*:\s*[^;{}]+;/g) || []).length >= 2) regions.push([i, j + 1]);
    i = j;
  }
  return regions;
}

/** Tailwind arbitrary values: className="… p-[13px] text-[#fff] …" */
export function arbitraryClassRegions(src) {
  const regions = [];
  const re = /className=(?:"[^"]*"|\{`[^`]*`\}|\{"[^"]*"\})/g;
  let m;
  while ((m = re.exec(src))) regions.push([m.index, m.index + m[0].length]);
  return regions;
}

/* ── exemptions ────────────────────────────────────────────────────── */

export function lineAt(src, offset) {
  return src.slice(0, offset).split("\n").length;
}

/** Declared exemptions: same line, the line above, or an open block. */
export function exemptionMap(src) {
  const lines = src.split("\n");
  const perLine = new Map();
  let block = null;
  const bad = [];

  lines.forEach((text, idx) => {
    const ln = idx + 1;

    const start = text.match(/ds-exempt-start\(([a-z-]+)\)\s*:?\s*(.*?)(?:\*\/|$)/);
    if (start) {
      const cat = start[1];
      const reason = start[2].replace(/\*\/\s*$/, "").trim();
      if (!VALID_CATEGORIES.has(cat)) bad.push({ line: ln, msg: `unknown exemption category "${cat}"` });
      else if (reason.length < CONFIG.minReasonChars) bad.push({ line: ln, msg: `exemption reason too short (needs ${CONFIG.minReasonChars}+ chars saying WHY)` });
      block = { cat, reason };
    }
    if (/ds-exempt-end/.test(text)) block = null;

    if (block) perLine.set(ln, block);

    const inline = text.match(/ds-exempt\(([a-z-]+)\)\s*:?\s*(.*?)(?:\*\/|$)/);
    if (inline) {
      const cat = inline[1];
      const reason = inline[2].replace(/\*\/\s*$/, "").trim();
      if (!VALID_CATEGORIES.has(cat)) bad.push({ line: ln, msg: `unknown exemption category "${cat}"` });
      else if (reason.length < CONFIG.minReasonChars) bad.push({ line: ln, msg: `exemption reason too short (needs ${CONFIG.minReasonChars}+ chars saying WHY)` });
      // Applies to this line and to the next line that actually CONTAINS CODE. The
      // comment carrying the reason is usually several lines long and sits above the
      // declaration it excuses, so "the next line" is nearly always still the comment.
      perLine.set(ln, { cat, reason });
      // The reason is usually a multi-line block comment, so walk to wherever that
      // comment ENDS and exempt the first line of real code after it. Keying off "does
      // this line look like a comment" fails on continuation lines, which look like prose.
      let open = /\/\*/.test(text) && !/\*\//.test(text.slice(text.indexOf("/*") + 2));
      for (let k = idx + 1; k < lines.length; k++) {
        const s = (lines[k] ?? "").trim();
        perLine.set(k + 1, { cat, reason });
        if (open) { if (s.includes("*/")) open = false; continue; }
        // Consecutive `//` lines are the same comment continued.
        if (s === "" || s.startsWith("//")) continue;
        // So is a BLOCK comment. The walk skipped `//` and not `/* */`, so putting
        // any block comment between the note and the line it excuses silently voided
        // the exemption — and CSS has no `//`, which is exactly where these notes
        // live. Found by adding a `stylelint-disable` beside one: two linters each
        // need their own marker, and asking for them in a fixed order to keep a
        // parser happy is a trap rather than a rule.
        if (s.startsWith("/*")) {
          if (!s.includes("*/")) open = true;
          continue;
        }
        // A structural opener (`preview: (`, `return (`, `{`) carries no value of its
        // own, so it is not the line the reason was written for — keep walking.
        if (/[([{]$/.test(s)) continue;
        break;
      }
    }
  });

  return { perLine, bad };
}

/** Blank out comment bodies, keeping offsets and newlines so line numbers stay true.
 *  A value discussed in a comment is prose, not styling — and `ds-exempt` markers are
 *  read from the ORIGINAL source, so blanking here cannot swallow them. */
export function blankComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (c, p) => p + " ".repeat(c.length - p.length));
}
