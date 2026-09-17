/**
 * Handoff page layout engine — paste into a `use_figma` script (Plugin API, top-level await).
 *
 * The code that organised the E-Anudaan page on 17 Sep 2026, kept so the next portal is a run,
 * not a project. It implements `.claude/rules/figma-handoff-page-structure.md`:
 *
 *   rows(section)             sorts a flow's (or branch's) screens into Desktop · 1440,
 *                             Mobile · 375 (name ends " · Mobile") and Dialogs & Overlays
 *                             (name ends dialog / confirmation / menu).
 *   buildLane(zone, lane)     creates a role column and re-parents existing sections into it as
 *                             flows or branches — re-parenting keeps node ids, so links survive.
 *   layoutSection(zone, 1)    fills by depth (red ramp under " · Pending Discussion"), orders by
 *                             flow ID / row / branch, lays role columns left→right and flows down,
 *                             puts phone frames under their desktop frame, places a pending note
 *                             at the top, hugs every section, and re-inserts children so the
 *                             layers panel reads in reading order.
 *
 * Budget (figma-call-budget.md): one call per 2–3 lanes for the moves, ONE call for the layout of
 * the whole page (132 sections, 300 frames took one call), one for zone A. Writes are atomic.
 *
 * Not available through the Plugin API, so a person does them in Figma: a named version
 * (`saveVersionHistoryAsync`), and Dev Mode "Ready for dev" (`devStatus`).
 *
 * Set per portal: ORDER (role column and group order), BR (branch order).
 */
const RAMP = [234, 227, 220, 213, 206, 199, 192];
const PENDING = " · Pending Discussion";
const ROWS = ["Desktop · 1440", "Tablet · 768", "Mobile · 375", "Dialogs & Overlays"];
const MOB = / · Mobile$/;
const DLG = /(dialog|confirmation|menu)$/i;
const GUT = 96;

const grey = (d, red) => {
  const v = RAMP[Math.min(d, 6)];
  const c = red ? { r: Math.min(255, v + 16) / 255, g: (v - 10) / 255, b: (v - 10) / 255 } : { r: v / 255, g: v / 255, b: v / 255 };
  return [{ type: "SOLID", color: c }];
};
const pad = (d) => (d <= 2 ? { t: 240, s: 160 } : d === 3 ? { t: 160, s: 80 } : { t: 120, s: 80 });
const reorder = (parent, reading) => { for (const c of reading) parent.insertChild(0, c); };
const isNote = (c) => c.name === ".note / Pending Discussion";
const byId = async (id) => { const n = await figma.getNodeByIdAsync(id); if (!n) throw new Error("missing " + id); return n; };
function ensure(parent, name) {
  let s = parent.children.find((c) => c.type === "SECTION" && c.name === name);
  if (!s) { s = figma.createSection(); s.name = name; parent.appendChild(s); }
  return s;
}

async function rows(sec, extraIds = []) {
  const own = sec.children.filter((c) => c.type !== "SECTION" && !isNote(c))
    .sort((a, b) => Math.floor(a.y / 1000) - Math.floor(b.y / 1000) || a.x - b.x);
  const extra = []; for (const id of extraIds) extra.push(await byId(id));
  const g = { "Desktop · 1440": [], "Mobile · 375": [], "Dialogs & Overlays": [] };
  for (const f of [...own, ...extra]) (MOB.test(f.name) ? g["Mobile · 375"] : DLG.test(f.name) ? g["Dialogs & Overlays"] : g["Desktop · 1440"]).push(f);
  for (const [rn, fs] of Object.entries(g)) { if (!fs.length) continue; const r = ensure(sec, rn); for (const f of fs) r.appendChild(f); }
}

/** lane = { name, flows: [{ name, reuse?: sectionId, also?: [frameId], branches?: [{ name, reuse }] }] } */
async function buildLane(zone, lane) {
  const L = ensure(zone, lane.name);
  for (const fl of lane.flows) {
    if (fl.reuse) { const F = await byId(fl.reuse); F.name = fl.name; L.appendChild(F); await rows(F, fl.also || []); }
    else { const F = ensure(L, fl.name); for (const b of fl.branches) { const B = await byId(b.reuse); B.name = b.name; F.appendChild(B); await rows(B); } }
  }
  return L.id;
}

function subKey(ORDER, BR, parentName, s) {
  const o = ORDER[parentName]; if (o) { const i = o.indexOf(s.name); return i < 0 ? 999 : i; }
  const m = s.name.match(/^[A-Z]+ (\d+) · /); if (m) return +m[1];
  const r = ROWS.indexOf(s.name); if (r >= 0) return r;
  const b = BR.findIndex((p) => s.name.startsWith(p)); return b >= 0 ? b : 999;
}

function layoutFrames(sec, d, deskMap, red) {
  sec.fills = grey(d, red); const p = pad(d);
  const fr = sec.children.filter((c) => c.type !== "SECTION" && !isNote(c))
    .sort((a, b) => Math.floor(a.y / 1000) - Math.floor(b.y / 1000) || a.x - b.x);
  let right = p.s, maxH = 0; const map = {};
  if (sec.name === "Mobile · 375" && deskMap) {
    let next = deskMap.__end;
    const placed = fr.map((f) => { let fx = deskMap[f.name.replace(MOB, "")]; if (fx === undefined) { fx = next; next += f.width + GUT; } return [f, fx]; }).sort((a, b) => a[1] - b[1]);
    for (const [f, fx] of placed) { f.x = fx; f.y = p.t; right = Math.max(right, fx + f.width); maxH = Math.max(maxH, f.height); }
    reorder(sec, placed.map((q) => q[0]));
  } else {
    let x = p.s;
    for (const f of fr) { f.x = x; f.y = p.t; map[f.name] = x; x += f.width + GUT; maxH = Math.max(maxH, f.height); right = x - GUT; }
    map.__end = x; reorder(sec, fr);
  }
  sec.resizeWithoutConstraints(Math.max(right + p.s, 480), Math.max(maxH, 80) + p.t + p.s);
  return map;
}

/** Call per zone: layoutSection(zone, 1, false, ORDER, BR, "B · SCREENS BY USER ROLE") */
function layoutSection(sec, d, red, ORDER, BR, COLUMNS_ZONE) {
  const pend = red || sec.name.endsWith(PENDING);
  const subs = sec.children.filter((c) => c.type === "SECTION");
  const note = sec.children.find(isNote);
  if (!subs.length) return layoutFrames(sec, d, null, pend);
  sec.fills = grey(d, pend);
  subs.sort((a, b) => subKey(ORDER, BR, sec.name, a) - subKey(ORDER, BR, sec.name, b));
  const p = pad(d), cols = sec.name === COLUMNS_ZONE, allRows = subs.every((s) => ROWS.includes(s.name));
  const gap = cols ? 800 : allRows ? 120 : 240;
  let x = p.s, y = p.t, W = 0, H = 0, deskMap = null;
  if (note) { note.x = p.s; note.y = p.t; y = p.t + note.height + 120; W = note.width; }
  for (const s of subs) {
    if (s.name === "Mobile · 375") layoutFrames(s, d + 1, deskMap, pend);
    else { const r = layoutSection(s, d + 1, pend, ORDER, BR, COLUMNS_ZONE); if (s.name === "Desktop · 1440") deskMap = r; }
    s.x = x; s.y = y;
    if (cols) { x += s.width + gap; H = Math.max(H, s.height); } else { y += s.height + gap; W = Math.max(W, s.width); }
  }
  if (cols) sec.resizeWithoutConstraints(x - gap + p.s, H + p.t + p.s); else sec.resizeWithoutConstraints(W + 2 * p.s, y - gap + p.s);
  reorder(sec, note ? [note, ...subs] : subs);
  return null;
}
// Page: A at (0,0); B at (0, A.height + 1600); C at B.width + 1600; D after C; reorder(page, [A, B, C, D]).
