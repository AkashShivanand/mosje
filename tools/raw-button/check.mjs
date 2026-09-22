/**
 * Every button in the estate is a design-system button.
 *
 * A native `<button>` written in app code is a hand-rolled component: it carries its
 * own padding, its own colour, its own focus ring (or none), its own disabled look,
 * and none of the fixes the design system ships. On 2026-09-22 the estate had 301 of
 * them in app code — roughly three in four plain actions, the rest tabs, toggles and
 * menu or disclosure triggers — plus 107 inside the design-system components
 * themselves. The icon-side padding rule the Button gained on 2026-09-03 reached none
 * of the 301.
 *
 * DECIDED 2026-09-22, and it supersedes the deferral written into
 * tools/shadow-ui/check.mjs for this one case: buttons are migrated now, area by
 * area, rather than waiting for each portal's redesign. This gate lands first so the
 * count cannot grow while the waves clear it.
 *
 * WHAT TO USE INSTEAD, from @mosje/design-system:
 *   an action                        Button · IconButton · SplitButton · ButtonGroup
 *   a link that looks like a button  Button href=… (renders an <a>) · buttonClasses()
 *   a tab strip                      Tabs
 *   a pressed/unpressed choice       Toggle · Chip (selectable) · SegmentedControl
 *   a menu trigger                   Menu
 *   a show/hide section              Accordion
 *   a list the reader picks from     Select · Combobox
 * If none fits, the component is missing: add it to the design system first
 * (CLAUDE.md, "Design-system-first"), then use it.
 *
 * TWO LEGITIMATE RAW BUTTONS, each declared on the tag's own line or the line above:
 *
 *   {/* raw-button-ok(primitive): the tab IS this component *\/}
 *       Only under packages/design-system/components/. Inside the design system a
 *       native <button> can be the component itself — Button's own root, a Tabs tab,
 *       a Combobox option. Everywhere else it is a copy.
 *   {/* raw-button-ok(specimen): anatomy drawn bare to label its parts *\/}
 *       Only under apps/hub/src/app/design-system/. A documentation page that has to
 *       show an unstyled element to explain one.
 *
 * An unknown category, or a category used outside its folder, fails.
 *
 * A RATCHET, as everywhere else in the estate:
 *   - a file with more raw buttons than its baseline fails
 *   - a file not in the baseline that has any fails
 *   - a file with FEWER than its baseline also fails until the baseline is
 *     re-captured in the same change — so one area's migration is banked where it
 *     happened and cannot be spent silently on another area's growth
 * The baseline only ever shrinks. Never add an entry to make a build green.
 *
 *   npm run check:raw-button            the gate
 *   npm run check:raw-button:baseline   re-capture after migrating
 *   npm run check:raw-button -- --list  every remaining raw button, file:line
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const BASELINE = join(ROOT, "tools/raw-button/baseline.json");
const SCOPES = ["apps/hub/src", "packages/design-system/components"];
const SKIP_DIRS = new Set(["node_modules", ".next"]);
const SKIP_FILE = /\.(stories|test|spec)\.tsx$/;
const CATEGORIES = {
  primitive: "packages/design-system/components/",
  specimen: "apps/hub/src/app/design-system/",
};
const args = new Set(process.argv.slice(2));

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP_DIRS.has(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.tsx$/.test(e) && !SKIP_FILE.test(e)) yield p;
  }
}

/* Blank out comments but keep every newline, so line numbers stay true. A
   `<button` inside a comment is prose, not a use site. The exemption marker lives
   in a comment, so markers are read from the ORIGINAL source. */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, (m, p) => p + " ".repeat(m.length - p.length));
}

const MARKER = /raw-button-ok\((\w+)\)\s*:\s*\S/;
const found = new Map(); // file -> [{line, exempt}]
const misuse = [];
for (const scope of SCOPES) {
  for (const f of walk(join(ROOT, scope))) {
    const rel = relative(ROOT, f);
    const raw = readFileSync(f, "utf8");
    const lines = raw.split("\n");
    const code = stripComments(raw);
    const re = /<button(?=[\s>])/g;
    let m;
    while ((m = re.exec(code))) {
      const line = code.slice(0, m.index).split("\n").length;
      const here = (lines[line - 1] ?? "") + "\n" + (lines[line - 2] ?? "");
      const mk = here.match(MARKER);
      let exempt = false;
      if (mk) {
        const folder = CATEGORIES[mk[1]];
        if (!folder) misuse.push(`${rel}:${line} — unknown category "${mk[1]}" (primitive or specimen)`);
        else if (!rel.startsWith(folder)) misuse.push(`${rel}:${line} — "${mk[1]}" is only allowed under ${folder}`);
        else exempt = true;
      }
      if (!found.has(rel)) found.set(rel, []);
      found.get(rel).push({ line, exempt });
    }
  }
}

const counts = {};
for (const [f, hits] of found) {
  const n = hits.filter((h) => !h.exempt).length;
  if (n) counts[f] = n;
}
const total = Object.values(counts).reduce((a, b) => a + b, 0);
const exempted = [...found.values()].flat().filter((h) => h.exempt).length;
const bySide = (pre) => Object.entries(counts).filter(([f]) => f.startsWith(pre)).reduce((a, [, n]) => a + n, 0);

if (args.has("--list")) {
  for (const [f, hits] of [...found].sort()) for (const h of hits) if (!h.exempt) console.log(`${f}:${h.line}`);
  process.exit(0);
}

if (misuse.length) {
  console.error(`✖ raw-button: ${misuse.length} exemption(s) are not allowed where they are:`);
  for (const m of misuse) console.error(`  · ${m}`);
  process.exit(1);
}

if (args.has("--baseline")) {
  const sorted = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(BASELINE, JSON.stringify({
    $comment: "Raw <button> elements per file that are known debt. It may only shrink. Re-capture with check:raw-button:baseline in the SAME change that migrates them. Never add an entry to make a build green.",
    capturedOn: new Date().toISOString().slice(0, 10),
    total,
    files: sorted,
  }, null, 2) + "\n");
  console.log(`raw-button: baseline written — ${total} raw button(s) in ${Object.keys(sorted).length} file(s), ${exempted} declared legitimate.`);
  process.exit(0);
}

if (!existsSync(BASELINE)) { console.error("✖ raw-button: baseline missing — run check:raw-button:baseline"); process.exit(2); }
const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const grew = [], fresh = [], shrank = [];
for (const [f, n] of Object.entries(counts)) {
  const b = base.files[f];
  if (b === undefined) fresh.push(`${f} — ${n}`);
  else if (n > b) grew.push(`${f} — ${b} → ${n}`);
  else if (n < b) shrank.push(`${f} — ${b} → ${n}`);
}
for (const [f, b] of Object.entries(base.files)) if (!(f in counts)) shrank.push(`${f} — ${b} → 0`);

console.log(`raw-button: ${total} raw <button> in ${Object.keys(counts).length} file(s) — app ${bySide("apps/")}, design system ${bySide("packages/")}; ${exempted} declared legitimate. Baseline ${base.total}, captured ${base.capturedOn}.`);
if (fresh.length || grew.length) {
  console.error(`✖ raw-button: ${fresh.length + grew.length} file(s) add a hand-rolled button:`);
  for (const x of [...fresh, ...grew]) console.error(`  · ${x}`);
  console.error("  Use the design system: Button, IconButton, Tabs, Toggle, Chip, Menu, Accordion, Select… — the list is at the top of tools/raw-button/check.mjs.");
  process.exit(1);
}
if (shrank.length) {
  console.error(`✖ raw-button: ${shrank.length} file(s) now have FEWER raw buttons than the baseline — good. Bank it in this change:`);
  for (const x of shrank) console.error(`  · ${x}`);
  console.error("  npm run check:raw-button:baseline");
  process.exit(1);
}
console.log("✔ raw-button: no file gained a hand-rolled button.");
