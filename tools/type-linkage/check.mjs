#!/usr/bin/env node
/**
 * Typography linkage gate — the family that had no gate at all.
 *
 * Colour has `scale-unlimited/declaration-strict-value` plus six contract tests.
 * Spacing has `check:space-linkage`. Radius has `check:radius-linkage`. Icons have
 * `check:icon-scale`. Typography — 21 roles, 73 custom properties, the single most
 * visible thing on a government page — had NOTHING, and `check:ds-linkage` says so
 * out loud every time it passes: "every fill, stroke, padding, gap and radius
 * resolves through the design system". Font size is not in that sentence.
 *
 * The audit of 2026-09-01 measured what that cost:
 *
 *   - 562 literal font sizes across the estate, 224 of them OFF the 15-step ramp —
 *     9, 10, 12.5, 13, 15, 17, 18, 19, 21, 26, 30, 34, 36, 38, 42, 44, 50, 62px.
 *     13px alone appears 71 times, in an estate whose own Typography page states
 *     the answer is "body-2 at 14 or body-3 at 12, not a 22nd size".
 *   - `document-library.css` shipping `var(--sa-type-body-4-size)` — a token that
 *     has never existed. CSS drops an undefined var() silently, so that text
 *     rendered at whatever it inherited and nothing said a word.
 *   - 100 raw `letter-spacing` declarations against 10 tracking tokens.
 *
 * ── WHAT IT CHECKS ───────────────────────────────────────────────────────────
 *   size      font-size / text-[…] / fontSize: 13   — and whether the value is even
 *                                                     ON the ramp, which is a
 *                                                     separate and worse defect
 *   leading   line-height / leading-[…] / lineHeight — including UNITLESS ratios,
 *                                                     which no px-grep can see
 *   tracking  letter-spacing / tracking-[…]
 *   family    font-family / fontFamily
 *
 * ── WHAT IT DELIBERATELY DOES NOT CHECK ──────────────────────────────────────
 * `font-size` on a Material Symbols glyph is ICON sizing, and it already has a gate
 * — `check:icon-scale`, with its own seven-step scale and its own baseline. Two
 * gates claiming one declaration means one of them is always wrong. Anything whose
 * selector or line names an icon is left to that gate and counted separately here so
 * the hand-off stays visible rather than looking like an omission.
 *
 * `font-weight` has no token by design (see CLAUDE.md — "write the number, as
 * button.css does"), so a weight literal is correct and is not a finding.
 *
 * ── WHY A RATCHET AND NOT A SWEEP ────────────────────────────────────────────
 * The same reasoning the icon gate records. Snapping 71 sites from 13px to 12 or 14
 * moves text on live government pages — the website's organisation pages, pm-ajay,
 * eutthan — and every one needs a visual audit before it lands. A ratchet costs
 * nothing today, refuses to let the number grow, and fails when a count SHRINKS
 * without the baseline being updated, so the backlog can only go down.
 *
 * The baseline is PER FILE, deliberately. One global count would let a redesign
 * clean five sites off one page while another page added five, and report success
 * for a net change of nothing.
 *
 * ── MODES ────────────────────────────────────────────────────────────────────
 *   node tools/type-linkage/check.mjs                   report (human-readable)
 *   node tools/type-linkage/check.mjs --json            report (machine-readable)
 *   node tools/type-linkage/check.mjs --gate            RATCHET — used by CI
 *   node tools/type-linkage/check.mjs --update-baseline record today's counts
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

import { walk, styleObjectRegions, cssTemplateRegions, arbitraryClassRegions, lineAt, exemptionMap, blankComments } from "../ds-linkage/regions.mjs";

const ROOT = new URL("../..", import.meta.url).pathname.replace(/\/$/, "");
const SCAN = ["apps/hub/src", "packages/design-system", "apps/storybook/stories"];
const BASELINE = join(ROOT, "tools/type-linkage/baseline.json");

/**
 * The ramp, read from the token SOURCE so this file cannot hold a stale copy — the
 * same discipline `icon-audit` applies to the icon scale. `font.role.*.size` is what
 * `--sa-type-*-size` is generated from, so these are the only sizes the system can
 * express.
 */
const RAMP = (() => {
  const prim = JSON.parse(readFileSync(join(ROOT, "packages/tokens/src/primitive.json"), "utf8"));
  const roles = prim.font?.role;
  if (!roles) throw new Error("type-linkage: font.role is missing from primitive.json — the ramp cannot be read, and a gate that cannot read its own scale is worse than no gate.");
  const out = new Set();
  for (const role of Object.values(roles)) {
    for (const step of Object.values(role)) {
      const v = step?.size?.$value;
      if (v) out.add(parseFloat(String(v)));
    }
  }
  if (out.size < 10) throw new Error(`type-linkage: read only ${out.size} sizes from font.role — that is not the 21-role ramp, so the read is wrong.`);
  return out;
})();

/* ── matchers ───────────────────────────────────────────────────────────── */

/** CSS + Tailwind-arbitrary + React-style-object forms of each typographic property. */
const MATCHERS = [
  ["size", /(?:font-size\s*:\s*|fontSize\s*:\s*|\btext-\[)\s*"?(-?\d*\.?\d+)(px|rem|em)?/g],
  ["leading", /(?:line-height\s*:\s*|lineHeight\s*:\s*|\bleading-\[)\s*"?(-?\d*\.?\d+)(px|rem|em)?/g],
  ["tracking", /(?:letter-spacing\s*:\s*|letterSpacing\s*:\s*|\btracking-\[)\s*"?(-?\d*\.?\d+)(px|rem|em)?/g],
  ["family", /(?:font-family\s*:\s*|fontFamily\s*:\s*)\s*("?[^;,\n}]+)/g],
];

/**
 * NOT a line test. The matchers only fire when a NUMBER follows the property, so
 * `font-size: var(--sa-type-body-2-size)` can never match in the first place and no
 * "is this line bound?" guard is needed. One WAS here, and it was worse than useless:
 * these portal sheets pack a whole rule onto one line, so a single bound declaration
 * anywhere on it hid every unbound one beside it. Binding a margin in a Leaflet popup
 * string silently "cleared" that file's three font-size literals.
 */

/**
 * Is this `font-size` sizing a GLYPH rather than text? Material Symbols are sized by
 * font-size, so the two properties are spelled identically and only context separates
 * them. `check:icon-scale` owns those; counting them here would double-gate one
 * declaration and let each gate blame the other.
 */
const ICONISH = /icon|material-symbols|symbol|glyph|emoji/i;

/** The CSS selector a given offset sits under, for the icon test above. */
function selectorAt(src, offset) {
  const before = src.slice(0, offset);
  const open = before.lastIndexOf("{");
  if (open === -1) return "";
  const lineStart = before.lastIndexOf("\n", open) + 1;
  return before.slice(lineStart, open);
}

function checkFile(path) {
  const raw = readFileSync(path, "utf8");
  const src = blankComments(raw);
  const rel = relative(ROOT, path);
  const { perLine } = exemptionMap(raw);
  const isCss = /\.css$/.test(path);

  const regions = isCss
    ? [[0, src.length]]
    : [...styleObjectRegions(src), ...cssTemplateRegions(src), ...arbitraryClassRegions(src)];

  const findings = [];
  const seen = new Set();

  for (const [start, end] of regions) {
    const body = src.slice(start, end);
    for (const [kind, re] of MATCHERS) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(body))) {
        const offset = start + m.index;
        const line = lineAt(src, offset);
        const lineText = (raw.split("\n")[line - 1] ?? "").trim();

        if (perLine.get(line)) continue;
        // `inherit`, `normal`, `currentColor`-style keywords carry no value to bind.
        if (/:\s*(inherit|normal|unset|initial|revert)\b/.test(lineText)) continue;

        // `family` is the one matcher whose value is not numeric, so it can match a value
        // that is ALREADY a variable. Test the declaration's own value — never the line.
        if (kind === "family" && /^\s*["']?\s*var\(/.test(m[1])) continue;

        const unit = m[2];
        const num = kind === "family" ? null : parseFloat(m[1]);
        // 0 is the absence of a value, not a wrong one — the same reading `ds-linkage`
        // gives `0px` and `radius-linkage` gives a raw zero.
        if (num === 0) continue;
        // A relative `em` leading or tracking is a RATIO of the bound size, not a second
        // independent value, so it inherits the binding rather than escaping it.
        if (kind !== "size" && unit === "em") continue;

        // The icon hand-off covers the whole DECLARATION BLOCK, not just font-size:
        // `line-height: 1` on an icon wrapper is glyph centring, and `.ds-x__icon`
        // sizing its own box is the icon gate's business either way. Testing only
        // `size` left 16 `line-height: 1` findings that no --sa-type-*-lh should ever
        // replace, and a gate whose findings a reader disagrees with is a gate that
        // gets silenced.
        const context = `${selectorAt(src, offset)} ${lineText}`;
        if (ICONISH.test(context)) {
          findings.push({ file: rel, line, kind: "icon-sized", value: m[0].trim(), text: lineText.slice(0, 120) });
          continue;
        }

        const px = unit === "rem" ? num * 16 : num;
        const offScale = kind === "size" && unit !== "em" && !RAMP.has(px);

        const key = `${line}:${kind}:${m[1]}`;
        if (seen.has(key)) continue;
        seen.add(key);

        findings.push({
          file: rel,
          line,
          kind: offScale ? "size-off-ramp" : kind,
          value: kind === "family" ? m[1].trim().slice(0, 40) : `${m[1]}${unit ?? ""}`,
          text: lineText.slice(0, 120),
        });
      }
    }
  }
  return findings;
}

/* ── collect ────────────────────────────────────────────────────────────── */

const KINDS = ["size-off-ramp", "size", "leading", "tracking", "family"];

let all = [];
for (const dir of SCAN) {
  let files;
  try {
    files = walk(join(ROOT, dir));
  } catch (err) {
    // A scope that cannot be walked is a config bug. Swallowing it makes the gate
    // report a clean scope it never looked at — the exact failure ds-linkage records.
    console.error(`\n✖ type-linkage: scan path "${dir}" cannot be read.\n  ${err.message}\n`);
    process.exit(2);
  }
  for (const f of files) all.push(...checkFile(f));
}

const gated = all.filter((f) => KINDS.includes(f.kind));
const iconSized = all.filter((f) => f.kind === "icon-sized");

const current = {};
for (const f of gated) {
  current[f.file] ??= Object.fromEntries(KINDS.map((k) => [k, 0]));
  current[f.file][f.kind] += 1;
}
const totals = Object.fromEntries(KINDS.map((k) => [k, gated.filter((f) => f.kind === k).length]));

/* ── --update-baseline ──────────────────────────────────────────────────── */

if (process.argv.includes("--update-baseline")) {
  /*
   * KEEP THE NOTE THAT IS ALREADY THERE.
   *
   * This block used to write the seed note unconditionally, so every re-baseline
   * silently replaced the file's prose with the boilerplate below — and the first
   * real re-baseline ate two paragraphs recording WHY certain counts are what they
   * are (a baseline once generated from a dirty tree, and the fifty-two commits of
   * inherited debt from a merge). A ratchet's note is the only place that reasoning
   * lives; a tool that overwrites its own documentation on every run is worse than
   * one that has none, because the loss is invisible in the diff's noise.
   *
   * The seed note is now exactly that — a SEED, used only when there is no baseline
   * yet. Edit the note in the JSON by hand; this writer will not touch it again.
   */
  const priorNote = existsSync(BASELINE)
    ? JSON.parse(readFileSync(BASELINE, "utf8")).note
    : null;

  writeFileSync(
    BASELINE,
    `${JSON.stringify(
      {
        note: priorNote ?? [
          "Known, pre-existing typography debt, PER FILE. Written by",
          "`node tools/type-linkage/check.mjs --update-baseline`.",
          "",
          "Each entry is a typographic value that does not resolve through --sa-type-*.",
          "`size-off-ramp` is the worse half: a size the 21-role scale cannot express at",
          "all (13px appears 71 times), so it needs a DESIGN decision — snap to 12 or 14 —",
          "not merely a binding. The rest are values that happen to match the scale and",
          "are one edit from being bound.",
          "",
          "The decision (2026-09-01) is to clear these as pages are redesigned, rather",
          "than sweep now: snapping 13px moves text on live government pages and every",
          "one needs a visual audit first.",
          "",
          "This file is a RATCHET, not a permission slip. The gate fails if a count GROWS",
          "or a new file appears, and fails if a count SHRINKS without this file being",
          "updated — so the backlog can only go down. Re-run --update-baseline in the",
          "same change that clears some.",
        ],
        totals,
        files: current,
      },
      null,
      2,
    )}\n`,
  );
  console.log(`• type-linkage: baseline written — ${gated.length} finding(s) across ${Object.keys(current).length} file(s) recorded as known debt.`);
  process.exitCode = 0;
}

/* ── --gate ─────────────────────────────────────────────────────────────── */

else if (process.argv.includes("--gate")) {
  if (!existsSync(BASELINE)) {
    console.error("✖ type-linkage: no baseline. Run `node tools/type-linkage/check.mjs --update-baseline` and commit it.");
    process.exitCode = 1;
  } else {
  const base = JSON.parse(readFileSync(BASELINE, "utf8")).files ?? {};
  const grown = [];
  const appeared = [];
  const shrunk = [];
  const cleared = [];

  for (const [file, now] of Object.entries(current)) {
    const was = base[file];
    if (!was) { appeared.push({ file, now }); continue; }
    for (const kind of KINDS) {
      if (now[kind] > (was[kind] ?? 0)) grown.push({ file, kind, was: was[kind] ?? 0, now: now[kind] });
      else if (now[kind] < (was[kind] ?? 0)) shrunk.push({ file, kind, was: was[kind] ?? 0, now: now[kind] });
    }
  }
  for (const file of Object.keys(base)) if (!current[file]) cleared.push(file);

  if (appeared.length || grown.length) {
    console.error("\n✖ type-linkage: NEW typography that does not resolve through the design system.\n");
    for (const a of appeared) {
      const parts = KINDS.filter((k) => a.now[k]).map((k) => `${k} ${a.now[k]}`).join(", ");
      console.error(`  new file  ${a.file}  (${parts})`);
    }
    for (const g of grown) console.error(`  grew      ${g.file}  ${g.kind} ${g.was} → ${g.now}`);
    console.error(
      `\n  Bind the value: font-size to var(--sa-type-<role>-size) and, in the same rule,\n` +
        `  line-height to its paired var(--sa-type-<role>-lh) — a size without its leading\n` +
        `  is half a binding. Tracking is var(--sa-type-<family>-tracking).\n\n` +
        `  A "size-off-ramp" finding is not a binding problem, it is a DESIGN one: the\n` +
        `  scale cannot express that number. The Typography page states the answer —\n` +
        `  body-2 at 14 or body-3 at 12, never a 22nd size invented for one card. Nothing\n` +
        `  may render below 11px (label-3), which is the estate's stated floor.\n\n` +
        `  A genuine specimen declares itself and says why:\n` +
        `      /* ds-exempt(specimen): the "don't" half of the pair — binding it would\n` +
        `         delete what is being demonstrated */\n`,
    );
    process.exitCode = 1;
  } else if (shrunk.length || cleared.length) {

    console.error("\n✖ type-linkage: debt went DOWN — update the baseline so it cannot grow back.\n");
    for (const s of shrunk) console.error(`  fixed     ${s.file}  ${s.kind} ${s.was} → ${s.now}`);
    for (const c of cleared) console.error(`  cleared   ${c}`);
    console.error("\n  Run `node tools/type-linkage/check.mjs --update-baseline` and commit it\n  in the same change.\n");
    process.exitCode = 1;
  } else {
    console.log(
    `✔ type-linkage: no new unbound typography — ${gated.length} known (${totals["size-off-ramp"]} off-ramp sizes, ` +
      `${totals.size} bindable sizes, ${totals.leading} leadings, ${totals.tracking} trackings, ${totals.family} families), ` +
      `all declared in the baseline.`,
    );
  }
  }
}

/* ── report ─────────────────────────────────────────────────────────────── */

else if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ totals, iconSized: iconSized.length, files: current, findings: gated }, null, 2));
  process.exitCode = 0;
}

else {

const byFile = [...Object.entries(current)].sort((a, b) => {
  const sum = (o) => KINDS.reduce((n, k) => n + o[k], 0);
  return sum(b[1]) - sum(a[1]);
});

console.log(`\ntype-linkage: ${gated.length} typographic value(s) not resolving through --sa-type-*, across ${byFile.length} file(s).\n`);
for (const k of KINDS) console.log(`  ${String(totals[k]).padStart(5)}  ${k}`);
console.log(`\n  ${String(iconSized.length).padStart(5)}  icon-sized font-size — owned by \`npm run check:icon-scale\`, not counted here\n`);
console.log("  worst files:");
for (const [file, counts] of byFile.slice(0, 15)) {
  const parts = KINDS.filter((k) => counts[k]).map((k) => `${k} ${counts[k]}`).join(", ");
  console.log(`     ${String(KINDS.reduce((n, k) => n + counts[k], 0)).padStart(4)}  ${file}  (${parts})`);
}
if (byFile.length > 15) console.log(`     …and ${byFile.length - 15} more file(s)`);
console.log(`\n  \`--gate\` (in CI) refuses to let these grow. \`--update-baseline\` records\n  today's counts after you clear some.\n`);
}
