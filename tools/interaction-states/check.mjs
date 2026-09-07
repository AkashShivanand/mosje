#!/usr/bin/env node
/**
 * Interaction-states completeness — does every control that answers a HOVER
 * also answer a PRESS?
 *
 * `/design-system/foundations/states` publishes seven states, names `active`
 * among them, gives it a colour rung and a motion pair, and says the reason for
 * naming them is "so every component answers a press the same way". The
 * `--sa-cmp-action-*-active-*` tokens have existed all along. On 2026-09-07,
 * 109 selectors across 59 of 113 design-system stylesheets bound `:hover` and
 * never bound `:active` — including both pagers, which is how the gap was
 * found: a tap on a page number produced no acknowledgement at all, and a touch
 * screen has no hover to fall back on.
 *
 * WHAT IT MEASURES, AND WHY THAT AND NOT SOMETHING CLEVERER.
 * A base selector counts as interactive when the stylesheet itself styles it on
 * `:hover`. That is the component author's own declaration that the thing
 * responds to a pointer, so it needs no list of known components, no guess from
 * the markup, and it cannot drift: a component that gains a hover tomorrow is
 * measured tomorrow. The cost is that a control styled only through a parent's
 * hover is not seen — an under-count, never a false alarm.
 *
 *   node tools/interaction-states/check.mjs              report
 *   node tools/interaction-states/check.mjs --gate       fail on anything NEW
 *   node tools/interaction-states/check.mjs --baseline   re-record the backlog
 *
 * The baseline is a ratchet in the estate's usual shape: it may only shrink. A
 * stylesheet that improves must be re-baselined, so one component's cleanup
 * cannot be spent silently on another's regression.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "packages/design-system/components";
const BASELINE = "tools/interaction-states/baseline.json";

const args = new Set(process.argv.slice(2));
const gate = args.has("--gate");
const writeBaseline = args.has("--baseline");

function stylesheets(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) stylesheets(p, out);
    else if (entry.name.endsWith(".css")) out.push(p);
  }
  return out;
}

/**
 * Base selectors this stylesheet styles on :hover but never on :active.
 *
 * A BEM MODIFIER IS CREDITED BY ITS BLOCK, and that is not a convenience — it is
 * the difference between a gate and a nuisance. `.ds-carousel__dot--current`
 * overrides only the hover colour; the press is answered by
 * `.ds-carousel__dot:active`, which applies to the same element because it
 * carries both classes. Flagging the modifier reported a defect that was already
 * fixed one rule above it. Caught by running this against main after the
 * carousel landed, which is the only reason it is not in the baseline as a
 * permanent false alarm.
 */
function gaps(src) {
  const seen = new Map();
  const re = /(\.[A-Za-z0-9_-]+)((?::[a-z-]+(?:\([^)]*\))?)+)/g;
  let m;
  while ((m = re.exec(src))) {
    const rec = seen.get(m[1]) ?? { hover: false, active: false };
    if (/:hover/.test(m[2])) rec.hover = true;
    if (/:active/.test(m[2])) rec.active = true;
    seen.set(m[1], rec);
  }
  const activeOn = new Set([...seen].filter(([, r]) => r.active).map(([base]) => base));
  const answered = (base) => {
    if (activeOn.has(base)) return true;
    const cut = base.indexOf("--");
    return cut > 0 && activeOn.has(base.slice(0, cut));
  };
  return [...seen]
    .filter(([base, r]) => r.hover && !answered(base))
    .map(([base]) => base)
    .sort();
}

const files = stylesheets(ROOT).sort();
const found = {};
for (const file of files) {
  const missing = gaps(fs.readFileSync(file, "utf8"));
  if (missing.length) found[file.slice(ROOT.length + 1)] = missing;
}

const total = Object.values(found).reduce((n, xs) => n + xs.length, 0);

if (writeBaseline) {
  fs.writeFileSync(
    BASELINE,
    JSON.stringify(
      { note: "Selectors that style :hover and never :active. May only shrink.", generated: new Date().toISOString().slice(0, 10), total, files: found },
      null,
      2,
    ) + "\n",
  );
  console.log(`✔ interaction-states: baseline recorded — ${total} selector(s) in ${Object.keys(found).length} stylesheet(s).`);
  process.exit(0);
}

if (!gate) {
  console.log(`interaction-states: ${files.length} stylesheet(s) scanned.`);
  console.log(`${total} selector(s) in ${Object.keys(found).length} stylesheet(s) style :hover and never :active.\n`);
  for (const [file, list] of Object.entries(found)) {
    console.log(file);
    for (const base of list) console.log(`   ${base}`);
  }
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.error("✖ interaction-states: no baseline. Run with --baseline first.");
  process.exit(1);
}
const base = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
const problems = [];
for (const [file, list] of Object.entries(found)) {
  const known = new Set(base.files[file] ?? []);
  const added = list.filter((b) => !known.has(b));
  if (added.length) problems.push(`  ${file}: ${added.join(", ")} — bind the pressed state, or add it to the baseline with a reason`);
}
for (const [file, list] of Object.entries(base.files)) {
  const now = new Set(found[file] ?? []);
  const fixed = list.filter((b) => !now.has(b));
  if (fixed.length) problems.push(`  ${file}: ${fixed.join(", ")} now bind :active — re-record the baseline (npm run check:interaction-states:baseline)`);
}

if (problems.length) {
  console.error("✖ interaction-states:\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`✔ interaction-states: no new pressed-state gaps — ${total} known, declared in the baseline.`);
