/**
 * Figma library — every component page draws its arrangements.
 *
 * The rule is `.claude/rules/figma-documentation-style.md` § "The arrangements
 * section": a component's documentation frame ends in an `NN / ARRANGEMENTS` section
 * that draws every non-variant property switched on, every group arrangement, and
 * every code-only state. It exists because a property that can only be discovered by
 * toggling it in the properties panel does not exist for anyone browsing the library —
 * the Selection Card page shipped saying "twenty variants", drawing eight, and never
 * showing the Detailed layout it had just gained.
 *
 * This estate has measured what a rule without a gate is worth (three of a hundred
 * pages carried the documentation shape three weeks after it was written down), so
 * the rule ships with this ratchet:
 *
 *   • `tools/figma-arrangements/baseline.json` lists the component pages that do NOT
 *     yet carry the section. It may only shrink.
 *   • `--verify-figma`, guarded on FIGMA_ACCESS_TOKEN, reads the live file and derives
 *     the same list. A page missing the section that is not in the baseline fails
 *     (a regression, or a new page shipped without it). A page in the baseline that
 *     now carries the section also fails until `--sync` re-captures the baseline, so
 *     one page's progress cannot be spent silently on another's regression.
 *
 * WHICH PAGES. A component page is a content page carrying a `<Topic> — Documentation`
 * frame whose Index card sits outside the `Start Here` and `Foundations` groups (a
 * foundation has tokens, not properties). Group membership comes from the committed
 * Index snapshot, page and frame existence from the live file — two requests, then one
 * batched `nodes` call at depth 3 to read each section's header eyebrow.
 *
 * Exit 1 is drift (the rule's business); exit 2 is the tool or the network. Without a
 * token the live half skips with a notice and the offline half — a well-formed,
 * non-vacuous baseline — still ran.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const BASELINE = join(ROOT, "tools/figma-arrangements/baseline.json");
const INDEX = join(ROOT, "tools/figma-index-parity/index.json");
const API = "https://api.figma.com/v1";
const EYEBROW = /^\d\d\s*\/\s*ARRANGEMENTS$/i;
const NOT_COMPONENT_GROUPS = new Set(["Start Here", "Foundations"]);

const args = new Set(process.argv.slice(2));
const VERIFY = args.has("--verify-figma");
const SYNC = args.has("--sync");

if (!existsSync(BASELINE)) { console.error(`✖ figma-arrangements: baseline missing: ${relative(ROOT, BASELINE)}`); process.exit(2); }
if (!existsSync(INDEX)) { console.error(`✖ figma-arrangements: Index snapshot missing: ${relative(ROOT, INDEX)}`); process.exit(2); }
const baseline = JSON.parse(readFileSync(BASELINE, "utf8"));
const index = JSON.parse(readFileSync(INDEX, "utf8"));

// ── Offline: the baseline is well-formed and says when it was counted ─────────
const offline = [];
if (!Array.isArray(baseline.missing)) offline.push("`missing` must be an array of page names");
if (!/^\d{4}-\d{2}-\d{2}$/.test(baseline.capturedOn ?? "")) offline.push("`capturedOn` must be a YYYY-MM-DD date — the reader needs to know how much to trust the list");
if (baseline.file !== index.file) offline.push(`baseline names file ${baseline.file}, the Index snapshot names ${index.file}`);
const carded = new Map(index.groups.flatMap((g) => g.cards.map((c) => [c.name, g.name])));
for (const p of baseline.missing ?? []) if (!carded.has(p)) offline.push(`"${p}" is in the baseline but has no Index card — it was renamed or retired; drop it`);
if (offline.length) { console.error("✖ figma-arrangements: the baseline is not coherent"); for (const o of offline) console.error(`  • ${o}`); process.exit(1); }
console.log(`figma-arrangements: ${baseline.missing.length} component page(s) still without an arrangements section, counted ${baseline.capturedOn}.`);

if (!VERIFY) { console.log("✔ the baseline is coherent. Run check:figma-arrangements:live to compare it with the file."); process.exit(0); }

// ── Live ────────────────────────────────────────────────────────────────────
const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) { console.log("  · --verify-figma skipped: FIGMA_ACCESS_TOKEN not set. The offline half still ran."); process.exit(0); }

async function figma(path) {
  const res = await fetch(`${API}${path}`, { headers: { "X-Figma-Token": token } });
  if (!res.ok) throw new Error(`Figma API ${res.status} on ${path}`);
  return res.json();
}

let missingNow, pagesChecked;
try {
  const file = await figma(`/files/${index.file}?depth=2`);
  const docFrames = [];
  for (const page of file.document.children) {
    if (page.type !== "CANVAS") continue;
    const group = carded.get(page.name);
    if (group && NOT_COMPONENT_GROUPS.has(group)) continue;
    // Modal and Tables suffix theirs "(DS template)"; the suffix is not a different kind of frame.
    const frame = (page.children ?? []).find((n) => n.type === "FRAME" && /— Documentation( \(.*\))?$/.test(n.name));
    if (frame) docFrames.push({ page: page.name, id: frame.id });
  }
  if (docFrames.length === 0) throw new Error("no documentation frames found — the file shape has changed");
  const nodes = await figma(`/files/${index.file}/nodes?ids=${docFrames.map((f) => f.id).join(",")}&depth=3`);
  missingNow = [];
  pagesChecked = docFrames.length;
  for (const f of docFrames) {
    const doc = nodes.nodes[f.id]?.document;
    if (!doc) throw new Error(`documentation frame ${f.id} (${f.page}) did not come back`);
    const has = (doc.children ?? []).some((section) => (section.children ?? []).some((h) => (h.children ?? []).some((t) => t.type === "TEXT" && EYEBROW.test(String(t.characters ?? "").trim()))));
    if (!has) missingNow.push(f.page);
  }
  missingNow.sort((a, b) => a.localeCompare(b));
} catch (e) {
  console.error(`✖ figma-arrangements: could not read the live file — ${e.message}`);
  process.exit(2);
}

if (SYNC) {
  const next = { ...baseline, file: index.file, capturedOn: new Date().toISOString().slice(0, 10), missing: missingNow };
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + "\n");
  console.log(`  · --sync rewrote ${relative(ROOT, BASELINE)}: ${missingNow.length} of ${pagesChecked} component page(s) still without the section.`);
  process.exit(0);
}

const base = new Set(baseline.missing);
const regressions = missingNow.filter((p) => !base.has(p));
const improved = baseline.missing.filter((p) => !missingNow.includes(p));
console.log(`  · live: ${pagesChecked} component page(s) with a documentation frame, ${missingNow.length} without an arrangements section.`);
for (const p of regressions) console.error(`  ✖ "${p}" has a documentation frame but no \`NN / ARRANGEMENTS\` section, and is not in the baseline — a new page must ship with it; an existing one lost it.`);
for (const p of improved) console.error(`  ✖ "${p}" now carries the section but the baseline still lists it — run check:figma-arrangements:sync and commit the smaller baseline.`);
if (regressions.length || improved.length) process.exit(1);
console.log("✔ every component page outside the baseline draws its arrangements, and the baseline is current.");
