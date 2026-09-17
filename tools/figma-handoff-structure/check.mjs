#!/usr/bin/env node
/**
 * Portal handoff page ↔ `.claude/rules/figma-handoff-page-structure.md`.
 *
 * The rule sets one shape for every portal page in a handoff file: zones A–D, role lanes,
 * tens-numbered flows, device rows, fills by depth, and a layers panel in reading order.
 * The estate has measured what a rule without a gate is worth (`ds-documentation-standard.md`:
 * 3 of 100 pages three weeks later), so the rule shipped with this.
 *
 * REST only — it never spends the per-seat MCP allowance (`figma-call-budget.md`). It walks
 * SECTION nodes one level at a time (`depth=1`), so screen frames are read as leaves and
 * their thousands of descendants are never downloaded. Responses cache in
 * `.cache/figma/handoff-structure/` for six hours.
 *
 * USAGE
 *   npm run check:figma-handoff                      # every page in pages.json, report only
 *   npm run check:figma-handoff -- --portal E-Anudaan
 *   npm run check:figma-handoff -- --strict          # exit 1 on any violation
 *   npm run check:figma-handoff -- --fresh --verbose # ignore cache, list every violation
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const CACHE = join(ROOT, ".cache", "figma", "handoff-structure");
const SIX_HOURS = 6 * 60 * 60 * 1000;

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

/** Depth → fill. Rule §5. Index 0 is the multi-portal product wrapper. */
const RAMP = ["#EAEAEA", "#E3E3E3", "#DCDCDC", "#D5D5D5", "#CECECE", "#C7C7C7", "#C0C0C0"];
const ARCHIVE_OPACITY = 0.4;

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
  console.log("check:figma-handoff — FIGMA_ACCESS_TOKEN not set; skipped (this gate is live-only).");
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

const hex = (node) => {
  const f = (node.fills ?? []).find((p) => p.visible !== false && p.type === "SOLID");
  if (!f) return null;
  return "#" + ["r", "g", "b"].map((k) => Math.round(f.color[k] * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
};
const box = (n) => n.absoluteBoundingBox ?? { x: 0, y: 0, width: 0, height: 0 };
const overlaps = (a, b) => {
  const p = box(a), q = box(b);
  return p.x < q.x + q.width && q.x < p.x + p.width && p.y < q.y + q.height && q.y < p.y + p.height;
};

const ZONE = /^([A-Z]) · [A-Z0-9 &()—'-]+$/;
const LANE = /^([A-Z])(\d+) · \S/;
const FLOW = /^([A-Z])(\d+)\.(\d{2}) · \S/;
const FRAME = /^[^/]+ \/ [^/]+( \/ .+)?$/;

function audit(page, rootDepth) {
  const v = [];
  const add = (check, node, detail) => v.push({ check, name: node.name, id: node.id, detail });

  /** Children sorted in reading order must sit at DESCENDING child index (Figma lists last child first). */
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
  const byPos = (a, b) => box(a).y - box(b).y || box(a).x - box(b).x;

  const loose = page.children.filter((c) => c.type !== "SECTION");
  for (const c of loose) add("loose-at-root", c, "every node on the page lives inside a zone");

  function walk(sec, depth, zoneLetter, parentFill, laneNo) {
    const fill = hex(sec);
    const want = RAMP[Math.min(depth, RAMP.length - 1)];
    if (fill === "#FFFFFF") add("white-section", sec, "a white section hides its screens");
    else if (fill !== want) add("fill-off-ramp", sec, `depth ${depth} wants ${want}, has ${fill ?? "no fill"}`);
    if (parentFill && fill && fill !== "#FFFFFF" && parseInt(fill.slice(1, 3), 16) > parseInt(parentFill.slice(1, 3), 16)) {
      add("lighter-than-parent", sec, `${fill} inside ${parentFill}`);
    }

    const level = depth - rootDepth; // 0 zone, 1 lane, 2 flow
    let letter = zoneLetter, lane = laneNo;
    if (level === 0) {
      const m = sec.name.match(ZONE);
      if (!m) add("zone-name", sec, "want `<Letter> · <NAME IN CAPS>`");
      letter = m?.[1];
    } else if (level === 1) {
      const m = sec.name.match(LANE);
      if (!m || m[1] !== zoneLetter) add("lane-name", sec, `want \`${zoneLetter ?? "?"}<n> · <Name>\``);
      lane = m?.[2];
    } else if (level === 2 && zoneLetter === "B") {
      const m = sec.name.match(FLOW);
      if (!m || m[2] !== lane) add("flow-name", sec, `want \`B${lane ?? "?"}.<nn> · <Flow Name>\` (tens IDs)`);
    }

    const kids = sec.children ?? [];
    if (kids.length === 0) add("empty-section", sec, "remove it, or fill it");
    const subs = kids.filter((c) => c.type === "SECTION");
    const frames = kids.filter((c) => c.type !== "SECTION");

    if (level === 0 && frames.length) add("frames-in-zone", sec, `${frames.length} frame(s) directly in a zone`);
    for (const f of frames) {
      if (!f.name.startsWith(".") && !FRAME.test(f.name)) add("frame-name", f, "want `Role / Screen / State`");
      if (letter === "D" && Math.abs((f.opacity ?? 1) - ARCHIVE_OPACITY) > 0.05) add("archive-opacity", f, "archived frames sit at 40%");
    }
    for (let i = 0; i < subs.length; i++)
      for (let j = i + 1; j < subs.length; j++) if (overlaps(subs[i], subs[j])) add("overlap", subs[i], `overlaps "${subs[j].name}"`);

    const num = (n) => {
      const m = n.name.match(FLOW) ?? n.name.match(LANE) ?? n.name.match(ZONE);
      return m ? m.slice(1).map((s) => (/^\d+$/.test(s) ? s.padStart(3, "0") : s)).join(".") : null;
    };
    const idSorted = subs.every(num);
    layerOrder(sec, subs, idSorted ? (a, b) => num(a).localeCompare(num(b)) : byPos);
    layerOrder(sec, frames, byPos);
    if (idSorted && subs.length > 1) {
      const read = [...subs].sort((a, b) => num(a).localeCompare(num(b)));
      const axis = level === 0 ? "x" : "y"; // lanes are columns; flows stack down
      for (let i = 1; i < read.length; i++)
        if (box(read[i])[axis] < box(read[i - 1])[axis]) {
          add("canvas-order", sec, `"${read[i].name}" is placed before "${read[i - 1].name}"`);
          break;
        }
    }
    for (const s of subs) walk(s, depth + 1, letter, fill, lane);
  }

  const zones = page.children.filter((c) => c.type === "SECTION");
  layerOrder(page, zones, (a, b) => a.name.localeCompare(b.name));
  if (!zones.some((z) => /^A · START HERE/.test(z.name))) v.push({ check: "no-start-here", name: page.name, id: page.id, detail: "zone A · START HERE is missing" });
  for (const z of zones) walk(z, rootDepth, null, null, null);
  return v;
}

const registry = JSON.parse(readFileSync(join(HERE, "pages.json"), "utf8")).pages;
const only = flag("portal");
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
  const counts = v.reduce((m, x) => ((m[x.check] = (m[x.check] ?? 0) + 1), m), {});
  if (!v.length) {
    console.log(`✔ ${entry.portal} — conformant`);
    continue;
  }
  failing++;
  console.log(`✖ ${entry.portal} — ${v.length} violation(s): ${Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(" · ")}`);
  for (const x of has("verbose") ? v : v.slice(0, 5)) console.log(`    ${x.check.padEnd(20)} ${x.name} — ${x.detail}`);
  if (!has("verbose") && v.length > 5) console.log(`    … ${v.length - 5} more (--verbose)`);
}
console.log(`\n${failing} of ${registry.length} registered page(s) not yet conformant to figma-handoff-page-structure.md`);
process.exit(has("strict") && failing ? 1 : 0);
