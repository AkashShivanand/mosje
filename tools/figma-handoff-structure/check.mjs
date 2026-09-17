#!/usr/bin/env node
/**
 * Portal handoff page ↔ `.claude/rules/figma-handoff-page-structure.md`.
 *
 * The rule sets one shape for every portal page in a handoff file: zones A–D, one column per
 * user role, flows with fixed role-scoped IDs (`NGO 30 · …`), device rows with phone frames
 * under their desktop frame, grey by depth, red for flows pending discussion, and a layers panel
 * in reading order. The estate has measured what a rule without a gate is worth
 * (`ds-documentation-standard.md`: 3 of 100 pages three weeks later), so it ships with this.
 *
 * TWO LAYERS, because a pressure test of the first version (17 Sep 2026) showed a gate that
 * fails ten of ten pages on day one is a gate people route around:
 *   identity — zones, flow IDs (unique, well-formed), row names, frame names, phone alignment,
 *              pending flows carry a note, nothing loose at the root. These decide whether a
 *              screen can be found and cited.
 *   visual   — fills on the ramp, overlaps, layer order, lane size. Defaults, reported the same way.
 * Both are RATCHETED against `baseline.json`: a page may not gain violations, and a page that
 * improves must be re-baselined (`--update-baseline`) so one page's clean-up cannot be spent on
 * another's regression.
 *
 * REST only — it never spends the per-seat MCP allowance (`figma-call-budget.md`). It walks SECTION
 * nodes one level at a time (`depth=1`), so screen frames are leaves and their descendants are never
 * downloaded. Responses cache in `.cache/figma/handoff-structure/` for six hours.
 *
 * USAGE
 *   npm run check:figma-handoff                       # all pages, ratchet against baseline
 *   npm run check:figma-handoff -- --portal E-Anudaan --verbose --fresh
 *   npm run check:figma-handoff -- --strict           # any violation fails
 *   npm run check:figma-handoff -- --update-baseline  # record current counts
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const CACHE = join(ROOT, ".cache", "figma", "handoff-structure");
const BASELINE = join(HERE, "baseline.json");
const SIX_HOURS = 6 * 60 * 60 * 1000;

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

/** Depth → grey. Rule §5. Index 0 is the multi-portal product wrapper. */
const RAMP = [234, 227, 220, 213, 206, 199, 192];
const PENDING = " · Pending Discussion";
const ROWS = ["Desktop · 1440", "Tablet · 768", "Mobile · 375", "Dialogs & Overlays"];
const MAX_FLOWS_PER_LANE = 9;
const IDENTITY = new Set(["loose-at-root", "zone-name", "no-start-here", "flow-id", "duplicate-flow-id", "row-name", "frame-name", "mobile-alignment", "pending-without-note", "frames-in-zone"]);

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
  console.log("check:figma-handoff — SKIPPED: FIGMA_ACCESS_TOKEN is not set, so nothing was measured.");
  process.exit(0);
}

async function rest(fileKey, ids) {
  const key = `${fileKey}-${ids.join(",")}`.replace(/[^A-Za-z0-9._,-]/g, "_").slice(0, 180);
  const path = join(CACHE, `${key}.json`);
  if (!has("fresh") && existsSync(path) && Date.now() - statSync(path).mtimeMs < SIX_HOURS) {
    return JSON.parse(readFileSync(path, "utf8"));
  }
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids.join(","))}&depth=1`;
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  if (res.status === 429) throw new Error("Figma REST answered 429 — wait and retry (REST quota, not the MCP seat).");
  if (!res.ok) throw new Error(`Figma REST ${res.status} for ${fileKey}`);
  const data = await res.json();
  mkdirSync(CACHE, { recursive: true });
  writeFileSync(path, JSON.stringify(data));
  return data;
}

/** Page → tree of SECTIONs with leaf frames, fetched one level per call, batched. */
async function readTree(fileKey, pageId) {
  const nodes = new Map();
  let frontier = [pageId];
  while (frontier.length) {
    const next = [];
    for (let i = 0; i < frontier.length; i += 40) {
      const batch = frontier.slice(i, i + 40);
      const data = await rest(fileKey, batch);
      for (const id of batch) {
        const doc = data.nodes?.[id]?.document;
        if (!doc) continue;
        nodes.set(id, doc);
        for (const child of doc.children ?? []) if (child.type === "SECTION") next.push(child.id);
      }
    }
    frontier = next;
  }
  const hydrate = (doc) => ({
    ...doc,
    children: (doc.children ?? []).map((c) => (c.type === "SECTION" && nodes.has(c.id) ? hydrate(nodes.get(c.id)) : c)),
  });
  return hydrate(nodes.get(pageId));
}

const rgb = (node) => {
  const f = (node.fills ?? []).find((p) => p.visible !== false && p.type === "SOLID");
  return f ? ["r", "g", "b"].map((k) => Math.round(f.color[k] * 255)) : null;
};
const hex = (c) => (c ? "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase() : "none");
const box = (n) => n.absoluteBoundingBox ?? { x: 0, y: 0, width: 0, height: 0 };
const overlaps = (a, b) => {
  const p = box(a), q = box(b);
  return p.x < q.x + q.width && q.x < p.x + p.width && p.y < q.y + q.height && q.y < p.y + p.height;
};

const ZONE = /^([A-Z]) · [A-Z0-9 &()—'-]+$/;
const FLOW = /^([A-Z]+) (\d+) · \S/;
const FRAME = /^[^/]+ \/ [^/]+( \/ .+)?$/;

function audit(page, rootDepth) {
  const v = [];
  const add = (check, node, detail) => v.push({ check, name: node.name, id: node.id, detail });
  const flowIds = new Map();

  /** Siblings in reading order must sit at DESCENDING child index (Figma lists the last child first). */
  const layerOrder = (parent, kids, key) => {
    const idx = new Map(parent.children.map((c, i) => [c.id, i]));
    const read = [...kids].sort(key);
    for (let i = 1; i < read.length; i++) {
      if (idx.get(read[i].id) > idx.get(read[i - 1].id)) {
        add("layer-order", parent, `"${read[i].name}" is listed above "${read[i - 1].name}" in the layers panel`);
        return;
      }
    }
  };
  const byY = (a, b) => box(a).y - box(b).y || box(a).x - box(b).x;
  const byX = (a, b) => box(a).x - box(b).x || box(a).y - box(b).y;

  for (const c of page.children.filter((c) => c.type !== "SECTION")) add("loose-at-root", c, "every node on the page lives inside a zone");

  function walk(sec, depth, zone, red, level) {
    const pending = red || sec.name.endsWith(PENDING);
    const c = rgb(sec);
    const v0 = RAMP[Math.min(depth, RAMP.length - 1)];
    const want = pending ? [Math.min(255, v0 + 16), v0 - 10, v0 - 10] : [v0, v0, v0];
    if (!c || Math.max(...c.map((x, i) => Math.abs(x - want[i]))) > 2) add("fill-off-ramp", sec, `depth ${depth} wants ${hex(want)}${pending ? " (pending)" : ""}, has ${hex(c)}`);

    const kids = sec.children ?? [];
    const subs = kids.filter((k) => k.type === "SECTION");
    const frames = kids.filter((k) => k.type !== "SECTION");
    const note = frames.find((f) => f.name === ".note / Pending Discussion");
    if (sec.name.endsWith(PENDING) && !note) add("pending-without-note", sec, "a pending flow says what is pending, in a note at its top");
    if (kids.length === 0) add("empty-section", sec, "remove it, or fill it");

    if (level === 0) {
      if (!ZONE.test(sec.name)) add("zone-name", sec, "want `<Letter> · <NAME IN CAPS>`");
      if (frames.length) add("frames-in-zone", sec, `${frames.length} node(s) directly in a zone`);
    }
    // zone B: level 1 = role lane, level 2 = flow
    if (zone === "B" && level === 1) {
      const flows = subs.length;
      if (flows > MAX_FLOWS_PER_LANE) add("lane-too-long", sec, `${flows} flows; split the role by phase at ${MAX_FLOWS_PER_LANE}`);
    }
    if (zone === "B" && level === 2) {
      const m = sec.name.replace(PENDING, "").match(FLOW);
      if (!m) add("flow-id", sec, "want `<ROLE> <number> · <Flow Name>`, e.g. `NGO 30 · SHRESHTA Mode 2 Application`");
      else {
        const id = `${m[1]} ${m[2]}`;
        if (flowIds.has(id)) add("duplicate-flow-id", sec, `${id} is also used by "${flowIds.get(id)}"`);
        flowIds.set(id, sec.name);
      }
    }
    // rows: in zone B, any section that holds screens (other than a note) is a row
    const screens = frames.filter((f) => !f.name.startsWith("."));
    if (zone === "B" && level >= 2 && screens.length && !ROWS.includes(sec.name)) add("row-name", sec, `screens sit in a row section: ${ROWS.join(", ")}`);
    for (const f of screens) if (!FRAME.test(f.name)) add("frame-name", f, "want `Role / Screen / State`");
    if (zone === "D") for (const f of screens) if (Math.abs((f.opacity ?? 1) - 0.4) > 0.05) add("archive-opacity", f, "archived frames sit at 40%");

    if (ROWS.includes(sec.name)) {
      const sb = box(sec);
      for (const f of screens) {
        const b = box(f);
        if (b.x < sb.x - 1 || b.y < sb.y - 1 || b.x + b.width > sb.x + sb.width + 1 || b.y + b.height > sb.y + sb.height + 1) add("screen-outside-row", f, `spills out of "${sec.name}"`);
      }
      for (let i = 0; i < screens.length; i++)
        for (let j = i + 1; j < screens.length; j++) if (overlaps(screens[i], screens[j])) add("screen-overlap", screens[i], `overlaps "${screens[j].name}"`);
      if (new Set(screens.map((f) => Math.round(box(f).y))).size > 1) add("row-not-one-line", sec, "screens in a row share one top edge");
      if (sec.name === "Mobile · 375") {
        const desk = subsOf(sec.__parent).find((s) => s.name === "Desktop · 1440");
        const deskX = new Map((desk?.children ?? []).map((f) => [f.name, box(f).x]));
        for (const f of screens) {
          const x = deskX.get(f.name.replace(/ · Mobile$/, ""));
          if (x !== undefined && Math.abs(x - box(f).x) > 1) add("mobile-alignment", f, "sits directly under its desktop frame");
        }
      }
    }

    for (let i = 0; i < subs.length; i++)
      for (let j = i + 1; j < subs.length; j++) if (overlaps(subs[i], subs[j])) add("overlap", subs[i], `overlaps "${subs[j].name}"`);

    const idOf = (n) => {
      const m = n.name.replace(PENDING, "").match(FLOW);
      return m ? +m[2] : null;
    };
    const lanes = zone === "B" && level === 0;
    const withIds = subs.length > 1 && subs.every((s) => idOf(s) !== null);
    layerOrder(sec, [...(note ? [note] : []), ...subs], lanes ? byX : withIds ? (a, b) => (a === note ? -1 : b === note ? 1 : idOf(a) - idOf(b)) : byY);
    layerOrder(sec, screens, byX);
    if (withIds) {
      const read = [...subs].sort((a, b) => idOf(a) - idOf(b));
      for (let i = 1; i < read.length; i++)
        if (box(read[i]).y < box(read[i - 1]).y) {
          add("canvas-order", sec, `"${read[i].name}" is placed above "${read[i - 1].name}"`);
          break;
        }
    }
    for (const s of subs) {
      s.__parent = sec;
      walk(s, depth + 1, zone, pending, level + 1);
    }
  }
  const subsOf = (n) => (n?.children ?? []).filter((k) => k.type === "SECTION");

  const zones = page.children.filter((c) => c.type === "SECTION");
  layerOrder(page, zones, (a, b) => a.name.localeCompare(b.name));
  if (!zones.some((z) => /^A · START HERE/.test(z.name))) v.push({ check: "no-start-here", name: page.name, id: page.id, detail: "zone A · START HERE is missing" });
  for (const z of zones) walk(z, rootDepth, z.name.match(ZONE)?.[1] ?? null, false, 0);
  return v;
}

const registry = JSON.parse(readFileSync(join(HERE, "pages.json"), "utf8")).pages;
const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
const only = flag("portal");
const next = { ...baseline };
let failing = 0;
for (const entry of registry.filter((p) => !only || p.portal.toLowerCase() === only.toLowerCase())) {
  let tree;
  try {
    tree = await readTree(entry.file, entry.page);
  } catch (err) {
    console.log(`✖ ${entry.portal}: could not read — ${err.message}`);
    failing++;
    continue;
  }
  const v = audit(tree, entry.rootDepth ?? 1);
  if (has("selftest")) {
    // Plant one known fault per check in a copy of the live tree and prove each is caught —
    // a gate that stays green because it cannot see anything is worse than no gate.
    const sections = (n, out = []) => ((n.children ?? []).forEach((c) => c.type === "SECTION" && (out.push(c), sections(c, out))), out);
    const plant = (label, want, mutate) => {
      const t = structuredClone(tree);
      mutate(t, sections(t));
      const got = audit(t, entry.rootDepth ?? 1).filter((x) => x.check === want).length;
      const base = v.filter((x) => x.check === want).length;
      console.log(`  ${got > base ? "✔" : "✖"} selftest ${label} → ${want}`);
      if (got <= base) failing++;
    };
    plant("flow renamed without ID", "flow-id", (t, s) => { const f = s.find((x) => FLOW.test(x.name)); f.name = "Some Flow"; });
    plant("two flows share an ID", "duplicate-flow-id", (t, s) => { const f = s.filter((x) => FLOW.test(x.name)); f[1].name = f[0].name; });
    plant("phone frame moved", "mobile-alignment", (t, s) => { const m = s.find((x) => x.name === "Mobile · 375" && x.children.some((f) => f.absoluteBoundingBox)); for (const f of m.children) f.absoluteBoundingBox = { ...f.absoluteBoundingBox, x: f.absoluteBoundingBox.x + 500 }; });
    plant("section painted white", "fill-off-ramp", (t, s) => { s[3].fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]; });
    plant("note deleted from a pending flow", "pending-without-note", (t, s) => { const p = s.find((x) => x.name.endsWith(PENDING)); p.children = p.children.filter((c) => c.name !== ".note / Pending Discussion"); });
    plant("screen left loose in a flow", "row-name", (t, s) => { const f = s.find((x) => FLOW.test(x.name)); const row = f.children.find((c) => c.type === "SECTION"); f.children.push(row.children.find((c) => c.type !== "SECTION")); });
    plant("frame dropped on the page", "loose-at-root", (t) => { t.children.push({ id: "0:0", type: "FRAME", name: "Frame 1", children: [] }); });
    plant("layers panel reversed", "layer-order", (t) => { t.children.reverse(); });
    plant("screen pushed out of its row", "screen-outside-row", (t, s) => { const r = s.find((x) => x.name === "Desktop · 1440"); const f = r.children.find((c) => c.type !== "SECTION"); f.absoluteBoundingBox = { ...f.absoluteBoundingBox, x: f.absoluteBoundingBox.x + 1e6 }; });
  }
  const identity = v.filter((x) => IDENTITY.has(x.check)).length;
  const visual = v.length - identity;
  next[entry.portal] = { identity, visual };
  const was = baseline[entry.portal];
  const counts = v.reduce((m, x) => ((m[x.check] = (m[x.check] ?? 0) + 1), m), {});
  let verdict;
  if (!v.length) verdict = "✔ conformant";
  else if (has("strict")) verdict = "✖ not conformant";
  else if (!was) verdict = "✖ not in baseline — run --update-baseline";
  else if (identity > was.identity || visual > was.visual) verdict = `✖ regressed (was ${was.identity} identity / ${was.visual} visual)`;
  else if (identity < was.identity || visual < was.visual) verdict = `✖ improved — re-baseline with --update-baseline (was ${was.identity} / ${was.visual})`;
  else verdict = "• unchanged against baseline";
  const bad = verdict.startsWith("✖");
  if (bad && !has("update-baseline")) failing++;
  console.log(`${verdict.padEnd(2)}  ${entry.portal} — identity ${identity} · visual ${visual}${v.length ? "  [" + Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(" · ") + "]" : ""}`);
  for (const x of has("verbose") ? v : v.slice(0, 3)) console.log(`      ${x.check.padEnd(22)} ${x.name} — ${x.detail}`);
  if (!has("verbose") && v.length > 3) console.log(`      … ${v.length - 3} more (--verbose)`);
}
if (has("update-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(next, null, 1) + "\n");
  console.log(`\nbaseline.json updated.`);
  process.exit(0);
}
process.exit(failing ? 1 : 0);
