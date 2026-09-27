/**
 * Figma library — every component master in SAMAVESH binds to SAMAVESH, and nothing else.
 *
 * WHY. SAMAVESH (`3FF5l0SMNIwdpZrKkeyPTm`) is the only library the estate builds from
 * (CLAUDE.md, "Figma libraries"). The look-alike libraries reachable from the same team —
 * `MoSJE + UX4G DS`, `MoSJE Portal DS` — publish near-miss values (`Primary/800 #01376B`
 * against `bg/brand/primary/boldest #003975`), so a master bound to one of them looks right
 * and drifts by a shade nobody can name. It happened to a deck on 2026-09-08 and was caught
 * only by reading the file key. This gate reads the library itself.
 *
 * WHAT IS COUNTED, per content page, inside component masters only (a COMPONENT_SET, or a
 * COMPONENT whose parent is not a set, and everything beneath it — instance sublayers
 * included, so an override is seen; a remote binding inside a nested master is therefore
 * charged to each page that places it, and clears everywhere when that master is fixed):
 *   1. remoteVariableBindings — node × variable pairs where the variable id carries a
 *      library key segment (`VariableID:<hex>/<n>:<n>`). A local variable reads
 *      `VariableID:<n>:<n>`. Found anywhere in the node's own properties — `boundVariables`,
 *      `fills[].boundVariables.color`, `strokes[]`, corner radii, text overrides. Counted
 *      once per node per variable, so a fill reported both as `boundVariables.fills[0]` and
 *      `fills[0].boundVariables.color` — or one radius on four corners — is one binding.
 *   2. remoteInstances — INSTANCE nodes whose component the /nodes response's `components`
 *      map marks `remote: true`, or does not list at all. Counted once and not descended:
 *      the remote master's own nested instances and bindings are not charged again.
 * EXCLUDED: instances named `SAMAVESH seal` (a documented remote component,
 * ds-documentation-standard.md §5) and artwork — an instance, component or component-set
 * name matching /org-?logo|Emblem|Digital India|logo/i — with everything inside them.
 *
 * WHICH PAGES. Every page minus the divider, group labels and special pages named in
 * tools/figma-index-parity/index.json `pageExclusionRules`.
 *
 * THE RATCHET. baseline.json holds both counts for every content page. `--verify-figma`
 * (guarded on FIGMA_ACCESS_TOKEN) fails on any increase, naming the page and sample nodes;
 * a decrease also fails until `--sync` records it, so one page's cleanup cannot pay for
 * another's regression. Exit 1 is drift; exit 2 is the tool or the network.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const BASELINE = join(ROOT, "tools/figma-library-linkage/baseline.json");
const INDEX = join(ROOT, "tools/figma-index-parity/index.json");
const API = "https://api.figma.com/v1";
const BATCH = 2; // pages per /nodes request — a busy page is ~10 MB
const METRICS = ["remoteVariableBindings", "remoteInstances"];
const EXEMPT_NAME = /^SAMAVESH seal$/i;
const ARTWORK = /org-?logo|Emblem|Digital India|logo/i;

const args = new Set(process.argv.slice(2));
const VERIFY = args.has("--verify-figma");
const SYNC = args.has("--sync");

if (!existsSync(INDEX)) { console.error(`✖ figma-library-linkage: Index snapshot missing: ${relative(ROOT, INDEX)}`); process.exit(2); }
const index = JSON.parse(readFileSync(INDEX, "utf8"));
const rules = index.pageExclusionRules ?? {};
const skipPages = new Set([...(rules.groupLabels ?? []), ...(rules.special ?? [])]);
const isContentPage = (name) => name !== rules.divider && !skipPages.has(name);

// ── Offline: the baseline is coherent ─────────────────────────────────────────
if (!existsSync(BASELINE) && !SYNC) { console.error(`✖ figma-library-linkage: baseline missing: ${relative(ROOT, BASELINE)} — run check:figma-linkage:sync`); process.exit(2); }
const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : { pages: {} };
if (existsSync(BASELINE)) {
  const offline = [];
  const pages = baseline.pages;
  if (!Array.isArray(baseline.note) || baseline.note.length === 0) offline.push("`note` must say what is counted and what is excluded");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(baseline.recordedOn ?? "")) offline.push("`recordedOn` must be a YYYY-MM-DD date — the reader needs to know how much to trust the counts");
  if (baseline.file !== index.file) offline.push(`baseline names file ${baseline.file}, the Index snapshot names ${index.file}`);
  if (!pages || typeof pages !== "object" || Array.isArray(pages) || Object.keys(pages).length === 0) offline.push("`pages` must be a non-empty object of page name → { remoteVariableBindings, remoteInstances }");
  for (const [page, c] of Object.entries(pages ?? {})) {
    if (!isContentPage(page)) offline.push(`"${page}" is excluded by pageExclusionRules and should not be listed`);
    for (const m of METRICS) if (!Number.isInteger(c?.[m]) || c[m] < 0) offline.push(`"${page}".${m} is ${JSON.stringify(c?.[m])} — must be a non-negative integer`);
  }
  if (offline.length) { console.error("✖ figma-library-linkage: the baseline is not coherent"); for (const o of offline) console.error(`  • ${o}`); process.exit(1); }
  const rows = Object.entries(pages);
  const sum = (m) => rows.reduce((n, [, c]) => n + c[m], 0);
  const dirty = rows.filter(([, c]) => c.remoteVariableBindings || c.remoteInstances).length;
  console.log(`figma-library-linkage: ${rows.length} content page(s); ${dirty} with masters bound outside SAMAVESH — ${sum("remoteVariableBindings")} remote variable binding(s), ${sum("remoteInstances")} remote instance(s), recorded ${baseline.recordedOn}.`);
}

if (!VERIFY) { console.log("✔ the baseline is coherent. Run check:figma-linkage:live to compare it with the file."); process.exit(0); }

// ── Live ────────────────────────────────────────────────────────────────────
const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) { console.log("  · --verify-figma skipped: FIGMA_ACCESS_TOKEN not set. The offline half still ran."); process.exit(0); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function figma(path) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try { res = await fetch(`${API}${path}`, { headers: { "X-Figma-Token": token } }); }
    catch (e) { if (attempt < 4) { await sleep(3000 * (attempt + 1)); continue; } throw e; }
    if ((res.status === 429 || res.status >= 500) && attempt < 7) {
      // Retry-After alone is too eager here — it says 1–3s and the next call is refused
      // again — so wait for whichever is longer: the header, or an exponential backoff.
      const after = Number(res.headers.get("retry-after"));
      const wait = Math.min(Math.max(Number.isFinite(after) ? after * 1000 : 0, 5000 * 2 ** attempt), 120_000);
      console.log(`  · Figma API ${res.status}; waiting ${Math.round(wait / 1000)}s before retry ${attempt + 1}/7`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`Figma API ${res.status} on ${path.slice(0, 80)}`);
    return res.json();
  }
}

const REMOTE_VAR = /^VariableID:[0-9a-f]+\//i;
/** Remote variable ids anywhere in a node's own properties (never its children). */
function remoteVarsOf(node) {
  const ids = new Set();
  const scan = (o) => {
    if (Array.isArray(o)) { for (const v of o) scan(v); return; }
    if (!o || typeof o !== "object") return;
    if (o.type === "VARIABLE_ALIAS" && typeof o.id === "string" && REMOTE_VAR.test(o.id)) ids.add(o.id);
    for (const [k, v] of Object.entries(o)) if (k !== "children") scan(v);
  };
  scan(node);
  return ids;
}

function exempt(node, comps, sets) {
  if (node.type !== "INSTANCE") return false;
  if (EXEMPT_NAME.test(node.name)) return true;
  const c = comps[node.componentId];
  const setName = c?.componentSetId ? sets[c.componentSetId]?.name : undefined;
  return [node.name, c?.name, setName].some((n) => n && ARTWORK.test(n));
}

function scanPage(pageDoc, comps, sets) {
  const out = { remoteVariableBindings: 0, remoteInstances: 0, samples: [] };
  const walk = (node, inMaster, trail) => {
    const path = [...trail, node.name];
    const startsMaster = node.type === "COMPONENT_SET" || (node.type === "COMPONENT" && !inMaster);
    const inside = inMaster || startsMaster;
    if (inside) {
      if (exempt(node, comps, sets)) return;
      const where = path.slice(-3).join(" › ");
      const vars = remoteVarsOf(node);
      if (vars.size) { out.remoteVariableBindings += vars.size; out.samples.push(`${where} [${node.id}] — ${vars.size} remote variable(s)`); }
      if (node.type === "INSTANCE") {
        const c = comps[node.componentId];
        // Counted once, and not descended: its sublayers are the other library's master,
        // and replacing this one instance clears them all.
        if (!c || c.remote) { out.remoteInstances++; out.samples.push(`${where} [${node.id}] — instance of remote "${c?.name ?? node.componentId}"`); return; }
      }
    }
    for (const child of node.children ?? []) walk(child, inside, path);
  };
  for (const child of pageDoc.children ?? []) walk(child, false, []);
  return out;
}

const now = {};
const samples = {};
try {
  const file = await figma(`/files/${index.file}?depth=1`);
  const pages = file.document.children.filter((p) => p.type === "CANVAS" && isContentPage(p.name));
  if (pages.length === 0) throw new Error("no content pages found — the file shape has changed");
  for (let i = 0; i < pages.length; i += BATCH) {
    const batch = pages.slice(i, i + BATCH);
    if (i) await sleep(1000); // a polite gap between heavy requests
    const res = await figma(`/files/${index.file}/nodes?ids=${batch.map((p) => encodeURIComponent(p.id)).join(",")}`);
    for (const p of batch) {
      const n = res.nodes?.[p.id];
      if (!n?.document) throw new Error(`page "${p.name}" (${p.id}) did not come back`);
      const r = scanPage(n.document, n.components ?? {}, n.componentSets ?? {});
      now[p.name] = { remoteVariableBindings: r.remoteVariableBindings, remoteInstances: r.remoteInstances };
      if (r.samples.length) samples[p.name] = r.samples;
    }
  }
} catch (e) {
  console.error(`✖ figma-library-linkage: could not read the live file — ${e.message}`);
  process.exit(2);
}

const sorted = Object.fromEntries(Object.entries(now).sort(([a], [b]) => a.localeCompare(b)));
const dirty = Object.entries(sorted).filter(([, c]) => c.remoteVariableBindings || c.remoteInstances);

if (SYNC) {
  const next = {
    note: baseline.note ?? [
      "Per content page of the SAMAVESH library: inside component masters (and everything beneath them),",
      "remoteVariableBindings = node × variable pairs bound to a variable from ANOTHER library (id `VariableID:<key>/<n>:<n>`),",
      "remoteInstances = INSTANCE nodes whose component the REST `components` map marks remote (or does not list); counted once, not descended.",
      "Excluded: instances named `SAMAVESH seal` (documented remote, ds-documentation-standard.md §5) and artwork",
      "(instance/component/set names matching /org-?logo|Emblem|Digital India|logo/i), with their contents.",
      "Written by `check:figma-linkage:sync`. A ratchet: counts may only go down, and going down fails until re-synced.",
    ],
    file: index.file,
    recordedOn: new Date().toISOString().slice(0, 10),
    pages: sorted,
  };
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + "\n");
  console.log(`  · --sync rewrote ${relative(ROOT, BASELINE)}: ${Object.keys(sorted).length} content page(s), ${dirty.length} with masters bound outside SAMAVESH.`);
  for (const [page, c] of dirty) {
    console.log(`      ${page}: ${c.remoteVariableBindings} variable binding(s), ${c.remoteInstances} instance(s)`);
    for (const s of samples[page].slice(0, 2)) console.log(`        ${s}`);
  }
  process.exit(0);
}

const base = baseline.pages ?? {};
const zero = { remoteVariableBindings: 0, remoteInstances: 0 };
const regressions = [];
const improved = [];
for (const page of new Set([...Object.keys(sorted), ...Object.keys(base)])) {
  const b = base[page] ?? zero;
  const l = sorted[page] ?? zero;
  for (const m of METRICS) {
    if (l[m] > b[m]) regressions.push([page, m, l[m], b[m]]);
    else if (l[m] < b[m]) improved.push([page, m, l[m], b[m]]);
  }
}
console.log(`  · live: ${Object.keys(sorted).length} content page(s); ${dirty.length} with masters bound outside SAMAVESH.`);
for (const [p, m, l, b] of regressions) {
  console.error(`  ✖ "${p}": ${m} ${l} (baseline ${b}). A master is bound to a library other than SAMAVESH — rebind it to the SAMAVESH variable or component it means. e.g.`);
  for (const s of (samples[p] ?? []).slice(0, 5)) console.error(`      ${s}`);
}
for (const [p, m, l, b] of improved) console.error(`  ✖ "${p}": ${m} is down to ${l} from ${b} — run check:figma-linkage:sync and commit the smaller baseline.`);
if (regressions.length || improved.length) process.exit(1);
console.log("✔ no component master is bound outside SAMAVESH beyond the baseline, and the baseline is current.");
