// The canonical design read. Copy this into `use_figma` — do not hand-roll a traversal.
//
// WHY THIS FILE EXISTS. `use_figma` returns a TRUNCATED node tree when the frame you traverse is
// not on the current page, and reports nothing about it. Measured on one Master Settings frame in
// the SMILE Beggary run: 45 text nodes without the page set, 201 with it. Four findings were wrong
// because of it and one reached the reviewer — "the design has no tab rail", about a frame whose
// tab rail is plainly visible. The two lines that prevent it are the first two below.
//
// It returns `_meta.pageLoaded` and `_meta.totalText` for every frame. engine/claims.py's
// gate_design_read REFUSES a dump without them, and refuses a screen frame whose count is
// implausibly low — so a truncated read fails the run instead of quietly producing findings.
//
// Fill in PAGE and FRAMES; everything else is fixed.

const PAGE = "0:0";                    // the design page id — REQUIRED
const FRAMES = { /* "SLUG": "1234:5678" */ };
// Elements are OFF by default. A full portal frame is 150-400 text nodes and two frames of them
// overflow the MCP response, which fails as an SSE parse error rather than a useful message. Meta
// alone is what the integrity gate needs, and it covers every frame in one call. Turn elements on
// for ONE OR TWO frames at a time when you want the values themselves.
const WITH_ELEMENTS = false;

const page = await figma.getNodeByIdAsync(PAGE);
await figma.setCurrentPageAsync(page);          // <- the whole point of this file

const V = v => (typeof v === "symbol" ? "mixed" : v);
const hex = f => (f && f.type === "SOLID"
  ? "#" + [f.color.r, f.color.g, f.color.b].map(v => ("0" + Math.round(v * 255).toString(16)).slice(-2)).join("")
  : null);
const asc = s => String(s || "").replace(/[^\x20-\x7e]/g, "");   // keep the SSE channel happy

const out = {};
for (const slug of Object.keys(FRAMES)) {
  const fr = await figma.getNodeByIdAsync(FRAMES[slug]);
  if (!fr) { out[slug] = { _meta: { pageLoaded: true, missing: true } }; continue; }
  const F = fr.absoluteBoundingBox;
  const all = fr.findAll(n => n.type === "TEXT");
  let offCanvas = 0, noRender = 0;
  const els = [];
  for (const n of all) {
    const rb = n.absoluteRenderBounds, bb = n.absoluteBoundingBox;
    if (!rb) noRender++;
    const b = rb || bb; if (!b) continue;
    const x = Math.round(b.x - F.x), y = Math.round(b.y - F.y);
    // Content drawn OUTSIDE the frame renders nowhere — not in the export, not in Dev Mode.
    // That is a design-file defect worth reporting, so count it rather than dropping it.
    if (x < 0 || x > Math.round(F.width) || y < 0 || y > Math.round(F.height)) offCanvas++;
    if (!WITH_ELEMENTS) continue;
    const fn = n.fontName;
    els.push({
      text: asc(n.characters).slice(0, 90),
      x, y, w: Math.round(b.width), h: Math.round(b.height),
      fontSize: V(n.fontSize),
      fontFamily: typeof fn === "symbol" ? "mixed" : fn.family,
      fontStyle: typeof fn === "symbol" ? "mixed" : fn.style,
      color: hex(n.fills && n.fills[0]),
      renders: !!rb
    });
  }
  out[slug] = {
    _meta: {
      pageLoaded: true, node: FRAMES[slug],
      frame: [Math.round(F.width), Math.round(F.height)],
      totalText: all.length, offCanvas, noRender
    },
    elements: WITH_ELEMENTS ? els : []
  };
}
return out;
