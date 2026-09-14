/**
 * Figma library — nothing on a component page is a hand-drawn copy of a library component.
 *
 * WHY. The Ticker's pause, previous and next were a local `Ticker / Control` part and its
 * "View All" route a local `Ticker / Action` — a frame with a stroke and a label — while
 * the library published `IconButton` and `Button` with the same shape and an inverse tone.
 * A drawn copy looks right on the day it is made and then drifts: the library's inverse
 * hover moved and the copy did not, Dev Mode named a part no developer could import, and
 * the code grew a button of its own to match the drawing. Both parts are gone; this gate
 * keeps the next one from arriving unnoticed.
 *
 * WHAT IS COUNTED, per component page, in its masters AND its `— Documentation` and
 * `— Component record` frames — never inside an INSTANCE, which belongs to its own master:
 *   button   a FRAME drawn like a button: auto-layout, a visible fill or stroke, rounded
 *            corners short of a pill, 28–56px tall, holding one text layer and nothing
 *            but icon instances beside it, and SET like a button — its content centred, or
 *            the frame hugging it with even side padding. That last clause is what leaves a
 *            text field out: a field fills its column and starts its text at the edge.
 *            The library has `Button` and `IconButton`.
 *   pill     a FRAME drawn like a badge: a visible fill or stroke, corners at least half
 *            its height, at most 32px tall, holding exactly one text layer. The library
 *            has `Badge`.
 *   glyph    a TEXT layer set in Material Symbols outside an instance. The library has
 *            `Icon`. Not counted on the Icon page, which is where the master lives.
 *   divider  a RECTANGLE or LINE one pixel thick and at least 12 long, stretched across
 *            the auto-layout stack it sits in — a rule separating siblings. A chart's
 *            gridline, a stepper's rail or a tree's connector is drawing, not division,
 *            and is not counted. The library has `Divider`. Not counted on its own page.
 * Hidden layers and their subtrees are skipped: a hidden layer draws nothing.
 *
 * TWO THINGS LOOK LIKE COPIES AND ARE NOT, and they are skipped by name:
 *   • a subtree named `wireframe` or `schematic` — a diagram of a screen draws labelled
 *     boxes ("PageHeader", "KPI", "Export CSV") to show where components go; putting
 *     real components in it would turn a map into a mock-up.
 *   • a frame named `field`, `input` or `textbox` — a text field is set like a button
 *     (padded, stroked, one text layer) and is not one.
 * Each was found by reading every match on the first sweep, not assumed.
 *
 * WHICH PAGES. The selection `check:figma-text-styles` and `check:figma-arrangements`
 * use: a content page whose Index card sits outside `Start Here` and `Foundations`.
 *
 * THE RATCHET — the same shape as the text-style gate.
 *   • `tools/figma-hand-rolled/baseline.json` lists each page that still carries hand-drawn
 *     copies, by kind. A page not listed must have none.
 *   • `--verify-figma`, guarded on FIGMA_ACCESS_TOKEN, reads the live file. A count above
 *     the baseline fails; a count BELOW it fails until `--sync` records it, so one page's
 *     cleanup cannot be spent on another's regression.
 *
 * Exit 1 is drift; exit 2 is the tool or the network. Without a token the live half skips
 * with a notice and the offline half still ran.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const BASELINE = join(ROOT, "tools/figma-hand-rolled/baseline.json");
const INDEX = join(ROOT, "tools/figma-index-parity/index.json");
const API = "https://api.figma.com/v1";
const NOT_COMPONENT_GROUPS = new Set(["Start Here", "Foundations"]);
const KINDS = ["button", "pill", "glyph", "divider"];
const OWNER_PAGE = { glyph: new Set(["Icon"]), divider: new Set(["Divider"]) };
const BATCH = 8;

const args = new Set(process.argv.slice(2));
const VERIFY = args.has("--verify-figma");
const SYNC = args.has("--sync");
const LIST = args.has("--list");

if (!existsSync(INDEX)) { console.error(`✖ figma-hand-rolled: Index snapshot missing: ${relative(ROOT, INDEX)}`); process.exit(2); }
const index = JSON.parse(readFileSync(INDEX, "utf8"));
const carded = new Map(index.groups.flatMap((g) => g.cards.map((c) => [c.name, g.name])));

// ── Offline: the baseline is well-formed ───────────────────────────────────
if (!existsSync(BASELINE) && !SYNC) { console.error(`✖ figma-hand-rolled: baseline missing: ${relative(ROOT, BASELINE)} — run check:figma-hand-rolled:sync`); process.exit(2); }
const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : { pages: {} };
if (existsSync(BASELINE)) {
  const offline = [];
  if (!baseline.pages || typeof baseline.pages !== "object" || Array.isArray(baseline.pages)) offline.push("`pages` must be an object of page name → { kind: count }");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(baseline.capturedOn ?? "")) offline.push("`capturedOn` must be a YYYY-MM-DD date");
  if (baseline.file !== index.file) offline.push(`baseline names file ${baseline.file}, the Index snapshot names ${index.file}`);
  for (const [page, kinds] of Object.entries(baseline.pages ?? {})) {
    if (!carded.has(page)) offline.push(`"${page}" is in the baseline but has no Index card — renamed or retired; drop it`);
    for (const [k, n] of Object.entries(kinds ?? {})) {
      if (!KINDS.includes(k)) offline.push(`"${page}" lists an unknown kind "${k}"`);
      if (!Number.isInteger(n) || n <= 0) offline.push(`"${page}" ${k} has count ${JSON.stringify(n)} — list only kinds with at least one`);
    }
  }
  if (offline.length) { console.error("✖ figma-hand-rolled: the baseline is not coherent"); for (const o of offline) console.error(`  • ${o}`); process.exit(1); }
  const totals = Object.fromEntries(KINDS.map((k) => [k, Object.values(baseline.pages).reduce((n, p) => n + (p[k] ?? 0), 0)]));
  console.log(`figma-hand-rolled: ${Object.keys(baseline.pages).length} component page(s) still carry hand-drawn copies — ${KINDS.map((k) => `${totals[k]} ${k}`).join(" · ")} — counted ${baseline.capturedOn}.`);
}

if (!VERIFY) { console.log("✔ the baseline is coherent. Run check:figma-hand-rolled:live to compare it with the file."); process.exit(0); }

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) { console.log("  · --verify-figma skipped: FIGMA_ACCESS_TOKEN not set. The offline half still ran."); process.exit(0); }

async function figma(path) {
  for (let attempt = 0; ; attempt++) {
    // A dropped connection is the network's business, not the rule's: retry it like a 5xx.
    let res;
    try {
      res = await fetch(`${API}${path}`, { headers: { "X-Figma-Token": token } });
      if ((res.status === 429 || res.status >= 500) && attempt < 5) { await new Promise((r) => setTimeout(r, 2500 * (attempt + 1))); continue; }
      if (!res.ok) throw new Error(`Figma API ${res.status} on ${path.slice(0, 80)}`);
      return await res.json();
    } catch (e) {
      if (attempt < 5 && !/^Figma API/.test(e.message)) { await new Promise((r) => setTimeout(r, 2500 * (attempt + 1))); continue; }
      throw e;
    }
  }
}

const visiblePaint = (paints) => (paints ?? []).some((p) => p.visible !== false && (p.opacity ?? 1) > 0 && (p.type !== "SOLID" || (p.color?.a ?? 1) > 0));
const box = (n) => n.absoluteBoundingBox ?? { width: 0, height: 0 };

/** Classify one node, or return null. `page` exempts a library component's own page. */
function kindOf(n, page, parent) {
  const { width: w, height: h } = box(n);
  if (n.type === "TEXT") {
    return /Material Symbols/i.test(n.style?.fontFamily ?? "") && !OWNER_PAGE.glyph.has(page) ? "glyph" : null;
  }
  if ((n.type === "RECTANGLE" || n.type === "LINE") && !OWNER_PAGE.divider.has(page)) {
    const thin = Math.min(w, h), long = Math.max(w, h);
    const painted = visiblePaint(n.fills) || (visiblePaint(n.strokes) && (n.strokeWeight ?? 0) > 0);
    if (!painted || thin > 1 || long < 12) return null;
    const pm = parent?.layoutMode;
    const stretched = n.layoutAlign === "STRETCH";
    const across = (pm === "VERTICAL" && h <= 1 && (stretched || n.layoutSizingHorizontal === "FILL")) || (pm === "HORIZONTAL" && w <= 1 && (stretched || n.layoutSizingVertical === "FILL"));
    return across ? "divider" : null;
  }
  if (n.type !== "FRAME") return null;
  if (/\b(field|input|textbox)\b/i.test(n.name)) return null;
  const kids = (n.children ?? []).filter((c) => c.visible !== false);
  const texts = kids.filter((c) => c.type === "TEXT");
  const painted = visiblePaint(n.fills) || (visiblePaint(n.strokes) && (n.strokeWeight ?? 0) > 0);
  if (!painted || texts.length !== 1) return null;
  const radius = n.cornerRadius ?? Math.max(...(n.rectangleCornerRadii ?? [0]));
  if (kids.length === 1 && h <= 32 && radius >= h / 2 - 0.5) return "pill";
  const others = kids.filter((c) => c.type !== "TEXT");
  const setLikeButton = n.primaryAxisAlignItems === "CENTER" || (n.layoutSizingHorizontal === "HUG" && (n.paddingLeft ?? 0) === (n.paddingRight ?? 0) && (n.paddingLeft ?? 0) > 0);
  if (n.layoutMode && setLikeButton && radius > 0 && radius < h / 2 - 0.5 && h >= 28 && h <= 56 && w >= h && others.every((c) => c.type === "INSTANCE")) return "button";
  return null;
}

function scan(node, page, trail, out, parent = null) {
  if (node.visible === false || node.type === "INSTANCE") return;
  if (/\b(wireframe|schematic)\b/i.test(node.name)) return;
  const path = [...trail, node.name];
  const k = kindOf(node, page, parent);
  if (k) out.push({ kind: k, where: path.slice(-3).join(" › ") });
  for (const c of node.children ?? []) scan(c, page, path, out, node);
}

const now = {}, samples = {};
let pagesChecked = 0, rootsChecked = 0;
try {
  const file = await figma(`/files/${index.file}?depth=3`);
  const roots = [];
  for (const page of file.document.children) {
    if (page.type !== "CANVAS") continue;
    const group = carded.get(page.name);
    if (!group || NOT_COMPONENT_GROUPS.has(group)) continue;
    let found = 0;
    for (const top of page.children ?? []) {
      if (top.type === "FRAME" && /— (Documentation|Component record)$/.test(top.name)) { roots.push({ page: page.name, id: top.id, doc: true }); found++; continue; }
      const candidates = top.type === "COMPONENT" || top.type === "COMPONENT_SET" ? [top] : (top.children ?? []);
      for (const n of candidates) if (n.type === "COMPONENT" || n.type === "COMPONENT_SET") { roots.push({ page: page.name, id: n.id }); found++; }
    }
    if (found) pagesChecked++;
  }
  if (roots.length === 0) throw new Error("nothing to read — the file shape has changed");
  rootsChecked = roots.length;
  // Documentation frames are read one per request — they are the large responses, and a
  // batch of them is what dropped connections. Masters are small and go in batches.
  const batches = roots.filter((r) => r.doc).map((r) => [r]);
  const masters = roots.filter((r) => !r.doc);
  for (let i = 0; i < masters.length; i += BATCH) batches.push(masters.slice(i, i + BATCH));
  const fetched = [];
  // One at a time. Documentation frames are large responses, and reading them in
  // parallel dropped connections faster than the retries could recover them.
  for (const batch of batches) fetched.push([batch, await figma(`/files/${index.file}/nodes?ids=${batch.map((r) => r.id).join(",")}`)]);
  for (const [batch, res] of fetched) {
    for (const r of batch) {
      const doc = res.nodes[r.id]?.document;
      if (!doc) throw new Error(`node ${r.id} (${r.page}) did not come back`);
      const found = [];
      scan(doc, r.page, [], found);
      for (const f of found) {
        ((now[r.page] ??= {})[f.kind] = (now[r.page][f.kind] ?? 0) + 1);
        ((samples[r.page] ??= {})[f.kind] ??= []).push(f.where);
      }
    }
  }
} catch (e) {
  console.error(`✖ figma-hand-rolled: could not read the live file — ${e.message}`);
  process.exit(2);
}

const sorted = Object.fromEntries(Object.entries(now).sort(([a], [b]) => a.localeCompare(b)).map(([p, ks]) => [p, Object.fromEntries(KINDS.filter((k) => ks[k]).map((k) => [k, ks[k]]))]));

if (SYNC) {
  const next = {
    note: baseline.note ?? [
      "Component pages whose masters, documentation or component record still carry a hand-drawn copy of a",
      "library component, by kind. A page not listed has none. Written by `check:figma-hand-rolled:sync`.",
      "A ratchet: a count may only go down, and going down fails until this file is re-synced.",
    ],
    file: index.file,
    capturedOn: new Date().toISOString().slice(0, 10),
    pages: sorted,
  };
  writeFileSync(BASELINE, JSON.stringify(next, null, 2) + "\n");
  if (LIST) for (const [page, ks] of Object.entries(samples)) for (const [k, list] of Object.entries(ks)) console.log(`      ${page} · ${k}: ${list.slice(0, 4).join("  |  ")}${list.length > 4 ? `  …+${list.length - 4}` : ""}`);
  const totals = KINDS.map((k) => `${Object.values(sorted).reduce((n, p) => n + (p[k] ?? 0), 0)} ${k}`).join(" · ");
  console.log(`  · --sync rewrote ${relative(ROOT, BASELINE)}: ${Object.keys(sorted).length} of ${pagesChecked} component page(s) carry hand-drawn copies (${totals}) across ${rootsChecked} master(s) and frame(s).`);
  process.exit(0);
}

const base = baseline.pages ?? {};
const regressions = [], improved = [];
for (const page of new Set([...Object.keys(sorted), ...Object.keys(base)])) {
  for (const k of KINDS) {
    const live = sorted[page]?.[k] ?? 0, was = base[page]?.[k] ?? 0;
    if (live > was) regressions.push([page, k, live, was]);
    else if (live < was) improved.push([page, k, live, was]);
  }
}
console.log(`  · live: ${rootsChecked} master(s) and frame(s) on ${pagesChecked} component page(s); ${Object.keys(sorted).length} page(s) carry hand-drawn copies.`);
const LIBRARY = { button: "Button or IconButton", pill: "Badge", glyph: "Icon", divider: "Divider" };
for (const [p, k, live, was] of regressions) {
  console.error(`  ✖ "${p}": ${live} hand-drawn ${k}(s) (baseline ${was}). Place the library ${LIBRARY[k]} instead — e.g.`);
  for (const s of samples[p][k].slice(0, 5)) console.error(`      ${s}`);
}
for (const [p, k, live, was] of improved) console.error(`  ✖ "${p}" is down to ${live} hand-drawn ${k}(s) from ${was} — run check:figma-hand-rolled:sync and commit the smaller baseline.`);
if (regressions.length || improved.length) process.exit(1);
console.log("✔ no component page carries a hand-drawn copy of a library component beyond the baseline, and the baseline is current.");
