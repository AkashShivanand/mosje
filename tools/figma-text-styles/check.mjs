/**
 * Figma library — every text layer in a published component is linked to a text style.
 *
 * WHY. The Ticker's masters carried text that was set by hand rather than linked to a
 * SAMAVESH text style. A hand-set layer can match a style today and drift from it
 * tomorrow, and it tells the developer reading Dev Mode nothing about which style it
 * means — so the code was built from the numbers, and built wrong: the plinth name at
 * title-2 / 500 and the notices at title-3 / 500, where the library's styles are 600.
 * Once the layers were linked, `Title/title-2` and `Body/body-2-semibold` said what the
 * code should have been all along.
 *
 * The code half of the same rule is the composition check in `check:type-linkage`:
 * every CSS rule that sizes text from a role must take its leading, tracking and weight
 * from that same text style. This gate keeps the Figma half from regressing.
 *
 * WHAT IS COUNTED. Every TEXT node inside a COMPONENT or COMPONENT_SET on a component
 * page whose `styles.text` is empty. Text inside an INSTANCE is skipped: it belongs to
 * another master, which is scanned on its own page, and counting it again would charge
 * one unlinked layer to every place its part is used. Icon glyphs are text too and are
 * counted — the library publishes `Icon/*` text styles for them.
 *
 * WHICH PAGES. The same selection `check:figma-arrangements` uses: a content page whose
 * Index card sits outside `Start Here` and `Foundations`, read from the committed Index
 * snapshot. Masters are found at the depth the library files them — inside a numbered
 * section, per `ds-documentation-standard.md` — and a master loose at the page root is
 * still found.
 *
 * THE RATCHET.
 *   • `tools/figma-text-styles/baseline.json` lists each component page that still has
 *     unlinked text in its masters, with the count. A page not listed must have none.
 *   • `--verify-figma`, guarded on FIGMA_ACCESS_TOKEN, reads the live file. A count above
 *     the baseline fails — a regression, or a new page shipped with hand-set text. A count
 *     BELOW it also fails until `--sync` records it, so one page's cleanup cannot be spent
 *     on another's regression.
 *
 * Exit 1 is drift (the rule's business); exit 2 is the tool or the network. Without a
 * token the live half skips with a notice and the offline half still ran.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const BASELINE = join(ROOT, "tools/figma-text-styles/baseline.json");
const INDEX = join(ROOT, "tools/figma-index-parity/index.json");
const API = "https://api.figma.com/v1";
const NOT_COMPONENT_GROUPS = new Set(["Start Here", "Foundations"]);
const BATCH = 8;

const args = new Set(process.argv.slice(2));
const VERIFY = args.has("--verify-figma");
const SYNC = args.has("--sync");

if (!existsSync(INDEX)) { console.error(`✖ figma-text-styles: Index snapshot missing: ${relative(ROOT, INDEX)}`); process.exit(2); }
const index = JSON.parse(readFileSync(INDEX, "utf8"));
const carded = new Map(index.groups.flatMap((g) => g.cards.map((c) => [c.name, g.name])));

// ── Offline: the baseline is well-formed and says when it was counted ─────────
if (!existsSync(BASELINE) && !SYNC) { console.error(`✖ figma-text-styles: baseline missing: ${relative(ROOT, BASELINE)} — run check:figma-text-styles:sync`); process.exit(2); }
const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : { pages: {} };
if (existsSync(BASELINE)) {
  const offline = [];
  if (!baseline.pages || typeof baseline.pages !== "object" || Array.isArray(baseline.pages)) offline.push("`pages` must be an object of page name → unlinked text count");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(baseline.capturedOn ?? "")) offline.push("`capturedOn` must be a YYYY-MM-DD date — the reader needs to know how much to trust the counts");
  if (baseline.file !== index.file) offline.push(`baseline names file ${baseline.file}, the Index snapshot names ${index.file}`);
  for (const [page, n] of Object.entries(baseline.pages ?? {})) {
    if (!Number.isInteger(n) || n <= 0) offline.push(`"${page}" has count ${JSON.stringify(n)} — list only pages with at least one unlinked layer`);
    if (!carded.has(page)) offline.push(`"${page}" is in the baseline but has no Index card — it was renamed or retired; drop it`);
  }
  if (offline.length) { console.error("✖ figma-text-styles: the baseline is not coherent"); for (const o of offline) console.error(`  • ${o}`); process.exit(1); }
  const listed = Object.entries(baseline.pages);
  console.log(`figma-text-styles: ${listed.length} component page(s) with unlinked text in their masters (${listed.reduce((n, [, c]) => n + c, 0)} layers), counted ${baseline.capturedOn}.`);
}

if (!VERIFY) { console.log("✔ the baseline is coherent. Run check:figma-text-styles:live to compare it with the file."); process.exit(0); }

// ── Live ────────────────────────────────────────────────────────────────────
const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) { console.log("  · --verify-figma skipped: FIGMA_ACCESS_TOKEN not set. The offline half still ran."); process.exit(0); }

async function figma(path) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${API}${path}`, { headers: { "X-Figma-Token": token } });
    if (res.status === 429 && attempt < 4) { await new Promise((r) => setTimeout(r, 2000 * (attempt + 1))); continue; }
    if (!res.ok) throw new Error(`Figma API ${res.status} on ${path.slice(0, 80)}`);
    return res.json();
  }
}

/** Unlinked TEXT layers a master owns — never the ones inside an instance of another master. */
function unlinkedIn(node, trail, out) {
  const path = [...trail, node.name];
  if (node.type === "INSTANCE") return;
  if (node.type === "TEXT" && !node.styles?.text) out.push(path.slice(-3).join(" › "));
  for (const child of node.children ?? []) unlinkedIn(child, path, out);
}

const now = {};
const samples = {};
let pagesChecked = 0;
let mastersChecked = 0;
try {
  const file = await figma(`/files/${index.file}?depth=3`);
  const masters = [];
  for (const page of file.document.children) {
    if (page.type !== "CANVAS") continue;
    const group = carded.get(page.name);
    if (!group || NOT_COMPONENT_GROUPS.has(group)) continue;
    let found = 0;
    for (const top of page.children ?? []) {
      const candidates = top.type === "COMPONENT" || top.type === "COMPONENT_SET" ? [top] : (top.children ?? []);
      for (const n of candidates) {
        if (n.type === "COMPONENT" || n.type === "COMPONENT_SET") { masters.push({ page: page.name, id: n.id }); found++; }
      }
    }
    if (found) pagesChecked++;
  }
  if (masters.length === 0) throw new Error("no component masters found — the file shape has changed");
  mastersChecked = masters.length;

  for (let i = 0; i < masters.length; i += BATCH) {
    const batch = masters.slice(i, i + BATCH);
    const res = await figma(`/files/${index.file}/nodes?ids=${batch.map((m) => m.id).join(",")}`);
    for (const m of batch) {
      const doc = res.nodes[m.id]?.document;
      if (!doc) throw new Error(`master ${m.id} (${m.page}) did not come back`);
      const found = [];
      unlinkedIn(doc, [], found);
      if (found.length) {
        now[m.page] = (now[m.page] ?? 0) + found.length;
        (samples[m.page] ??= []).push(...found);
      }
    }
  }
} catch (e) {
  console.error(`✖ figma-text-styles: could not read the live file — ${e.message}`);
  process.exit(2);
}

const sorted = Object.fromEntries(Object.entries(now).sort(([a], [b]) => a.localeCompare(b)));

if (SYNC) {
  const next = {
    note: baseline.note ?? [
      "Component pages whose MASTERS still carry text layers not linked to a SAMAVESH text style,",
      "with the count. A page not listed has none. Written by `check:figma-text-styles:sync`.",
      "A ratchet: a count may only go down, and going down fails until this file is re-synced.",
    ],
    file: index.file,
    capturedOn: new Date().toISOString().slice(0, 10),
    pages: sorted,
  };
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + "\n");
  const total = Object.values(sorted).reduce((n, c) => n + c, 0);
  console.log(`  · --sync rewrote ${relative(ROOT, BASELINE)}: ${Object.keys(sorted).length} of ${pagesChecked} component page(s) carry ${total} unlinked text layer(s) across ${mastersChecked} master(s).`);
  for (const [page, list] of Object.entries(samples)) console.log(`      ${page}: ${list.slice(0, 3).join("; ")}${list.length > 3 ? ` …+${list.length - 3}` : ""}`);
  process.exit(0);
}

const base = baseline.pages ?? {};
const regressions = Object.entries(sorted).filter(([p, n]) => n > (base[p] ?? 0));
const improved = Object.entries(base).filter(([p, n]) => (sorted[p] ?? 0) < n);
console.log(`  · live: ${mastersChecked} master(s) on ${pagesChecked} component page(s); ${Object.keys(sorted).length} page(s) with unlinked text.`);
for (const [p, n] of regressions) {
  console.error(`  ✖ "${p}": ${n} text layer(s) in its masters are not linked to a text style (baseline ${base[p] ?? 0}). Link each to the SAMAVESH style it means — e.g.`);
  for (const s of samples[p].slice(0, 5)) console.error(`      ${s}`);
}
for (const [p, n] of improved) console.error(`  ✖ "${p}" is down to ${sorted[p] ?? 0} unlinked layer(s) from ${n} — run check:figma-text-styles:sync and commit the smaller baseline.`);
if (regressions.length || improved.length) process.exit(1);
console.log("✔ no component master has text outside a SAMAVESH text style beyond the baseline, and the baseline is current.");
