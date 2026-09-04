/**
 * Focus rings built from `box-shadow` — the gate for a ring that vanishes in High Contrast.
 *
 * THE DEFECT THIS EXISTS FOR
 * --------------------------
 * A focus ring in this estate is drawn one of two ways. Most components draw a real
 * `outline` (112 rules), which is correct. Thirty-six draw it with `box-shadow` and turn
 * the outline off — usually because the design wants a flush ring, or a two-layer ring
 * with a transparent-reading gap, which an outline cannot express.
 *
 * `box-shadow` IS NOT PAINTED IN FORCED-COLORS MODE. Windows High Contrast discards
 * shadows entirely. So `outline: none` takes effect, the shadow never arrives, and a
 * keyboard user in High Contrast gets no visible focus indicator at all — a WCAG 2.2
 * failure on 2.4.7 Focus Visible, and on 2.4.11 Focus Appearance with it.
 *
 * It is invisible in normal review by construction: the ring looks perfect in every
 * browser anybody tests in. It only disappears for the readers least able to work around
 * it, and only in a mode most designers never switch on.
 *
 * WHY A FILE-LEVEL CHECK IS NOT ENOUGH
 * ------------------------------------
 * The first version of this asked only whether a file CONTAINED a forced-colors block.
 * `dashboard.css` passed it while still being broken: the block covered
 * `.ds-card-state__retry`, which draws an outline and never needed rescuing, and said
 * nothing about the three box-shadow rings in the same file. So the check is per
 * SELECTOR — every selector that draws its ring with a shadow has to be named inside a
 * forced-colors block in its own file. Watched failing on exactly that case before it was
 * trusted.
 *
 * WHAT IS GATED: `:focus-visible` and `:focus-within` rules under packages/design-system
 * and apps/hub/src whose body sets a non-`none` `box-shadow`.
 *
 * WHAT IS NOT GATED: rules that draw a real `outline`. Forced-colors paints outlines, so
 * they survive — although their author COLOUR does not, which is why the house fix names
 * `Highlight` explicitly rather than a token.
 *
 * SECOND CHECK, ADDED 2026-09-04: THE OUTLINE HAS TO BE VALID. The exemption above
 * assumed an `outline` declaration paints something. Three did not. The shadow → outline
 * conversion of PR #276 carried the old box-shadow SPREAD into the shorthand and shipped
 *
 *     outline: var(--sa-focus-width) solid calc(...) var(--sa-focus-ring);
 *
 * — four values in a shorthand that takes three. CSS drops the whole declaration in
 * silence, so `.ds-tabs__tab`, `.ds-tabs__more` and `.ds-tabs__menu-item` had NO focus
 * ring outside forced-colors at all. Every gate stayed green: stylelint accepts it, the
 * forced-colors rescue below it was correct and separate, and the shadow check above
 * skipped the rule for drawing "a real outline".
 *
 * Found by rendering the components under Playwright's `forcedColors: 'active'` and
 * reading the COMPUTED outline back — the malformed rule computed to
 * `outline-style: none`. Reasoning about the source would not have found it; the source
 * looks reasonable.
 *
 * THE FIX, WHEN THIS FIRES: add a block beside the ring. `Highlight` is the system's own
 * focus colour, so the ring follows the theme the reader chose:
 *
 *     @media (forced-colors: active) {
 *       .your-selector:focus-visible {
 *         outline: var(--sa-focus-width) solid Highlight;
 *         outline-offset: var(--sa-focus-offset);
 *       }
 *     }
 *
 * KNOWN LIMITATION. Selectors are compared as normalised text, so a forced-colors block
 * that rescues a ring through a DIFFERENT but equivalent selector (a shorter ancestor
 * chain, say) reads as a miss. That is deliberate: the false positive costs one explicit
 * line, and the false negative costs a citizen their focus ring.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const SCOPES = ["packages/design-system", "apps/hub/src"];
const SKIP = new Set(["node_modules", ".next", "dist", "storybook-static", "coverage"]);

/** Every .css file under the scanned scopes. */
function cssFiles(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) cssFiles(full, out);
    else if (entry.endsWith(".css")) out.push(full);
  }
  return out;
}

/**
 * Blank a comment out but KEEP its newlines, so every line number this tool reports is
 * the line number in the file. Collapsing comments to a space shifted them — a defect
 * found on 2026-09-04 when the tabs.css findings printed :259 for a rule on line 341,
 * which is a report nobody can act on.
 */
const stripComments = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, (c) => " ".repeat(1) + "\n".repeat((c.match(/\n/g) || []).length));
const normalise = (s) => s.replace(/\s+/g, " ").trim();

/**
 * Split a selector list on TOP-LEVEL commas only. `:where(button, a, input)` is one
 * selector, not three — the first version of this split inside the parens and reported
 * `:where(button` and `[tabindex]):focus-visible` as separate broken selectors.
 */
function splitSelectors(list) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of list) {
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map(normalise).filter(Boolean);
}

/** Bodies of every `@media (forced-colors: active)` block, brace-matched. */
function forcedColorsBlocks(src) {
  const blocks = [];
  const re = /@media[^{]*forced-colors\s*:\s*active[^{]*\{/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < src.length && depth > 0; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") depth--;
    }
    blocks.push(src.slice(m.index + m[0].length, i - 1));
  }
  return blocks;
}

/** Selectors of every focus rule whose body draws the ring with a shadow. */
function shadowRingSelectors(src) {
  const found = [];
  const re = /([^{}]*?:focus-(?:visible|within)[^{}]*?)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const body = m[2];
    if (!/box-shadow\s*:/.test(body)) continue;
    if (/box-shadow\s*:\s*none/.test(body)) continue;
    const line = src.slice(0, m.index).split("\n").length;
    for (const sel of splitSelectors(m[1])) found.push({ selector: sel, line });
  }
  return found;
}

/**
 * `outline` is `<width> || <style> || <color>` — at most three top-level values. A fourth
 * makes the declaration invalid and CSS discards it entirely, painting nothing.
 */
function malformedOutlines(src) {
  const out = [];
  const re = /outline\s*:\s*([^;{}]+);/g;
  let m;
  while ((m = re.exec(src))) {
    const parts = [];
    let depth = 0, cur = "";
    for (const ch of m[1]) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      if (/\s/.test(ch) && depth === 0) { if (cur) { parts.push(cur); cur = ""; } }
      else cur += ch;
    }
    if (cur) parts.push(cur);
    if (parts.length > 3) {
      out.push({ line: src.slice(0, m.index).split("\n").length, value: `outline: ${m[1].replace(/\s+/g, " ").trim()};`, count: parts.length });
    }
  }
  return out;
}

const failures = [];
const invalid = [];
let scanned = 0;
let rings = 0;

for (const scope of SCOPES) {
  let files;
  try { files = cssFiles(join(ROOT, scope)); } catch { continue; }
  for (const file of files) {
    scanned++;
    const src = stripComments(readFileSync(file, "utf8"));
    for (const bad of malformedOutlines(src)) invalid.push({ file: relative(ROOT, file), ...bad });
    const ring = shadowRingSelectors(src);
    if (!ring.length) continue;
    rings += ring.length;
    const rescued = new Set();
    for (const block of forcedColorsBlocks(src)) {
      const re = /([^{}]+)\{[^{}]*\}/g;
      let m;
      while ((m = re.exec(block))) {
        for (const sel of splitSelectors(m[1])) rescued.add(sel);
      }
    }
    for (const r of ring) {
      if (!rescued.has(r.selector)) failures.push({ file: relative(ROOT, file), ...r });
    }
  }
}

if (invalid.length) {
  console.error(
    `\n✖ ${invalid.length} \`outline\` shorthand(s) carry more than three values.\n` +
      `   CSS discards an invalid shorthand in SILENCE, so these rules paint no ring at all\n` +
      `   (WCAG 2.2 · 2.4.7 Focus Visible). \`outline\` takes <width> <style> <color> — a\n` +
      `   fourth value is usually a box-shadow spread that survived a conversion; the gap\n` +
      `   belongs in \`outline-offset\`.\n`,
  );
  for (const i of invalid) console.error(`   ${i.file}:${i.line}  [${i.count} values]\n     ${i.value}`);
  console.error("");
}

if (!failures.length && !invalid.length) {
  console.log(
    `✓ focus rings: ${rings} shadow-drawn ring(s) across ${scanned} stylesheet(s), ` +
      `every one rescued for forced-colors; every outline shorthand valid.`,
  );
  process.exit(0);
}
if (!failures.length) process.exit(1);

console.error(
  `\n✖ ${failures.length} focus ring(s) drawn with box-shadow and NOT rescued for forced-colors.\n` +
    `   In Windows High Contrast the shadow is discarded and \`outline: none\` stands, so these\n` +
    `   have no visible focus indicator at all (WCAG 2.2 · 2.4.7 Focus Visible).\n`,
);
const byFile = new Map();
for (const f of failures) {
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}
for (const [file, list] of byFile) {
  console.error(`   ${file}`);
  for (const f of list) console.error(`     :${f.line}  ${f.selector}`);
}
console.error(
  `\n   Add this beside the ring, naming the same selector(s). \`Highlight\` is the system's\n` +
    `   own focus colour, so the ring follows the theme the reader chose:\n\n` +
    `     @media (forced-colors: active) {\n` +
    `       <selector> {\n` +
    `         outline: var(--sa-focus-width) solid Highlight;\n` +
    `         outline-offset: var(--sa-focus-offset);\n` +
    `       }\n` +
    `     }\n`,
);
process.exit(1);
