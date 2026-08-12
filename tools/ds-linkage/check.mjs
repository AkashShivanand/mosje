#!/usr/bin/env node
/**
 * DS linkage gate — enforces `.claude/rules/documentation-ds-linkage.md` on the code side.
 *
 * The rule says every element must be BOUND to the design system, and that an
 * exemption must be DECLARED rather than merely present. The Figma half of that
 * rule has an audit; the code half had only a grep in the rule text, which is why
 * the docs drifted back to raw hexes twice.
 *
 * What it does:
 *   1. Extracts the regions of a .tsx file that actually STYLE something —
 *      `style={{ … }}` objects, CSS template literals, and Tailwind arbitrary
 *      values. Prose that merely mentions "8px grid" or "#0373DF" is content,
 *      not styling, and is never flagged.
 *   2. Inside those regions, flags raw colours and raw lengths.
 *   3. Lets a line opt out ONLY with a declared, categorised reason:
 *          // ds-exempt(specimen): the deliberate "don't" example
 *      or a block:
 *          /* ds-exempt-start(code-sample): terminal chrome *​/ … /* ds-exempt-end *​/
 *
 * Run: node tools/ds-linkage/check.mjs [--json] [--all]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
const CONFIG = JSON.parse(readFileSync(join(ROOT, "tools/ds-linkage/config.json"), "utf8"));

const VALID_CATEGORIES = new Set(CONFIG.exemptionCategories);

/* ── file discovery ─────────────────────────────────────────────────────── */

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (CONFIG.skipDirs.includes(entry)) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(entry) && !/\.(test|spec)\./.test(entry)) out.push(p);
  }
  return out;
}

/* ── region extraction ──────────────────────────────────────────────────── */

/** Pull out `style={{ … }}` bodies with balanced braces. Returns [start,end) offsets. */
function styleObjectRegions(src) {
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
function cssTemplateRegions(src) {
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
function arbitraryClassRegions(src) {
  const regions = [];
  const re = /className=(?:"[^"]*"|\{`[^`]*`\}|\{"[^"]*"\})/g;
  let m;
  while ((m = re.exec(src))) regions.push([m.index, m.index + m[0].length]);
  return regions;
}

/* ── violation detection ────────────────────────────────────────────────── */

const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(\s*\d[^)]*\)/g;
const RAW_LENGTH = /(?<![\w.-])(\d+(?:\.\d+)?)(px|rem)\b/g;

/**
 * React turns a bare number into px, so `fontSize: 13` is a 13px literal wearing a
 * disguise — and it is the form a grep for "px" can never find. Only length-valued
 * properties count: `fontWeight: 600`, `lineHeight: 1.6`, `flex: 1`, `zIndex: 10`
 * and `opacity: 0.5` are unitless by definition and are not lengths.
 */
const BARE_NUMERIC = /\b(fontSize|width|height|minWidth|maxWidth|minHeight|maxHeight|padding|paddingTop|paddingRight|paddingBottom|paddingLeft|margin|marginTop|marginRight|marginBottom|marginLeft|gap|rowGap|columnGap|top|right|bottom|left|borderRadius|letterSpacing|translateX|translateY)\s*:\s*(-?\d+(?:\.\d+)?)\s*[,}]/g;

/** Properties the linkage rule's own table covers: padding, gaps, radii.
 *  (Fills and strokes are colours and are always gated, whatever the property.) */
const GATED_PROPERTY =
  /^(padding|margin|gap|rowGap|columnGap|row-gap|column-gap|borderRadius|border-radius|paddingTop|paddingRight|paddingBottom|paddingLeft|padding-top|padding-right|padding-bottom|padding-left|marginTop|marginRight|marginBottom|marginLeft|margin-top|margin-right|margin-bottom|margin-left|padding-inline|padding-block|margin-inline|margin-block)$/;

function lineAt(src, offset) {
  return src.slice(0, offset).split("\n").length;
}

/** Declared exemptions: same line, the line above, or an open block. */
function exemptionMap(src) {
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
function blankComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (c, p) => p + " ".repeat(c.length - p.length));
}

function checkFile(path) {
  const raw = readFileSync(path, "utf8");
  const src = blankComments(raw);
  const rel = relative(ROOT, path);
  const { perLine, bad } = exemptionMap(raw);
  const findings = bad.map((b) => ({ file: rel, line: b.line, kind: "bad-exemption", severity: "gated", text: b.msg }));

  // A stylesheet is styling from end to end — there is no prose to protect, so the
  // whole file is one region. This is where most of the estate's raw values live, and
  // scanning only .tsx is how they stayed invisible.
  const isCss = /\.css$/.test(path);
  const regions = isCss
    ? [[0, src.length, "stylesheet"]]
    : [
        ...styleObjectRegions(src).map((r) => [...r, "style-object"]),
        ...cssTemplateRegions(src).map((r) => [...r, "css-template"]),
        ...arbitraryClassRegions(src).map((r) => [...r, "class-arbitrary"]),
      ];

  const seen = new Set();
  for (const [start, end, where] of regions) {
    const body = src.slice(start, end);

    const matchers = [[RAW_COLOUR, "raw-colour"], [RAW_LENGTH, "raw-length"]];
    if (!isCss) matchers.push([BARE_NUMERIC, "bare-numeric-px"]);

    for (const [re, kind] of matchers) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(body))) {
        const value = kind === "bare-numeric-px" ? `${m[1]}:${m[2]}` : m[0];
        if (kind === "raw-length" && CONFIG.allowedLengths.includes(value)) continue;
        // `margin: 0` is the ABSENCE of a value, not an unbound one. Same for any zero.
        if (kind === "bare-numeric-px" && Number(m[2]) === 0) continue;
        const offset = start + m.index;
        const line = lineAt(src, offset);
        const lineText = raw.split("\n")[line - 1] ?? "";
        // a raw value that is a var() FALLBACK is still a defect, but name it as such
        const isFallback = new RegExp(`var\\(\\s*--[\\w-]+\\s*,\\s*[^)]*${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(lineText);
        // border-width literals are outside the rule's property table — see config.note
        if (kind === "raw-length" && CONFIG.borderWidthLiterals.some((w) => lineText.includes(`${value} solid`) || lineText.includes(`${value} dashed`)) && CONFIG.borderWidthLiterals.includes(value)) continue;

        // Which PROPERTY is this literal the value of? The rule's table covers fills,
        // strokes, padding, gaps and radii — those are GATED. A width, a grid track, a
        // media-query breakpoint or a blur radius is geometry the token scales do not
        // model, so it is reported as ADVISORY rather than failing the build. Inventing a
        // one-use token for each would inflate the palette, which the rule warns against.
        const decl = body.slice(Math.max(0, m.index - 60), m.index);
        const prop = (decl.match(/([a-zA-Z-]+)\s*:\s*[^;:{}]*$/) || [])[1] || "";
        const gatedProp = GATED_PROPERTY.test(prop);
        const severity = kind.startsWith("raw-colour") || gatedProp ? "gated" : "advisory";

        const key = `${line}:${value}:${kind}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const ex = perLine.get(line);
        if (ex) continue;
        findings.push({
          file: rel,
          line,
          kind: isFallback ? `${kind}-fallback` : kind,
          value,
          where,
          severity,
          prop,
          text: lineText.trim().slice(0, 150),
        });
      }
    }
  }
  return findings;
}

/* ── main ───────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const scope = args.includes("--all") ? CONFIG.scopes : CONFIG.scopes.filter((s) => s.gated);

let all = [];
for (const s of scope) {
  const dir = join(ROOT, s.path);
  // A configured scope that cannot be walked is a CONFIG BUG, and swallowing it makes
  // the gate report a clean scope it never looked at. Fail loudly instead.
  let files;
  try {
    files = walk(dir);
  } catch (err) {
    console.error(`\n\u2716 ds-linkage: scope "${s.name}" points at ${s.path}, which cannot be read.`);
    console.error(`  ${err.message}`);
    console.error("  Fix tools/ds-linkage/config.json — a scope that cannot fail is worse than no scope.\n");
    process.exit(2);
  }
  for (const f of files) all.push(...checkFile(f).map((v) => ({ ...v, scope: s.name })));
}

if (asJson) {
  console.log(JSON.stringify({ total: all.length, findings: all }, null, 2));
  process.exit(all.some((f) => f.severity === "gated") ? 1 : 0);
}

const gated = all.filter((f) => f.severity === "gated");
const advisory = all.filter((f) => f.severity !== "gated");

const group = (rows) => {
  const m = new Map();
  for (const r of rows) {
    if (!m.has(r.file)) m.set(r.file, []);
    m.get(r.file).push(r);
  }
  return [...m].sort((a, b) => b[1].length - a[1].length);
};

if (gated.length) {
  console.log(`\n\u2716 ds-linkage: ${gated.length} unbound value${gated.length === 1 ? "" : "s"} on a property the rule covers.\n`);
  console.log("   The rule's table covers fills, strokes, padding, gaps and radii.");
  console.log("   Each of these is either a value that should resolve through a token,");
  console.log("   or a deliberate specimen that must DECLARE itself and say why:\n");
  console.log("       // ds-exempt(specimen): why this value is deliberately off-system\n");
  for (const [file, rows] of group(gated)) {
    console.log(`   ${file}  (${rows.length})`);
    for (const r of rows) {
      console.log(`     ${String(r.line).padStart(5)}  ${(r.value ?? "").padEnd(12)} ${(r.prop ?? "").padEnd(16)} ${r.text}`);
    }
    console.log();
  }
} else {
  console.log("\u2714 ds-linkage: every fill, stroke, padding, gap and radius resolves through the");
  console.log("  design system, and every exemption is declared with a reason.");
}

if (advisory.length) {
  console.log(`\n\u2139 ${advisory.length} advisory (not gated): geometry the token scales do not model —`);
  console.log("  widths, heights, grid tracks, breakpoints, blur radii, shadow offsets.");
  console.log("  Reported so it stays visible; minting a one-use token for each would inflate");
  console.log("  the palette, which the rule warns against. Run with --json for the full list.");
  const top = group(advisory).slice(0, 5);
  for (const [file, rows] of top) console.log(`     ${String(rows.length).padStart(4)}  ${file}`);
  const rest = group(advisory).length - top.length;
  if (rest > 0) console.log(`     …and ${rest} more file${rest === 1 ? "" : "s"}`);
}

process.exit(gated.length ? 1 : 0);
