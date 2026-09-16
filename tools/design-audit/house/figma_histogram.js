// The canonical HOUSE read. Copy into `use_figma`, one call per page, fanned out in parallel.
//
// WHY THIS FILE EXISTS. A portal with no design frames of its own still has a standard to be
// audited against: the one the rest of the estate demonstrably follows. That standard was
// previously re-guessed per run from whichever page someone happened to open, which is how a
// baseline ends up asserting a value no page actually uses. This script measures what the
// handoff file ACTUALLY draws — frequencies, not impressions — so the baseline is evidence.
//
// It returns compact histograms only. Element-level dumps of a 6,000-frame page overflow the MCP
// response and fail as an SSE parse error rather than a useful message (see engine/figma_dump.js
// for the same lesson). Top-N per axis covers every value that could be a standard; the long tail
// is by definition not one.
//
// ONE PAGE PER CALL. `setCurrentPageAsync` is called exactly once — looping pages inside one
// script reloads the file per iteration and is slower than N parallel calls.
//
// Output goes to house/evidence/figma-page-histograms.json, keyed by page name. house/derive.py
// turns that plus packages/tokens into house/samavesh-house-standard.json.

const PAGE = "0:1";                    // the page id — REQUIRED, one per call

const page = await figma.getNodeByIdAsync(PAGE);
await figma.setCurrentPageAsync(page);

const H = () => ({});
const bump = (h, k) => { if (k === undefined || k === null) return; h[k] = (h[k] || 0) + 1; };
const top = (h, n = 12) => Object.entries(h).sort((a, b) => b[1] - a[1]).slice(0, n)
  .map(([k, v]) => k + ":" + v);
const hex = f => (f && f.type === "SOLID")
  ? "#" + [f.color.r, f.color.g, f.color.b]
      .map(v => ("0" + Math.round(v * 255).toString(16)).slice(-2)).join("")
  : null;
const V = v => (typeof v === "symbol" ? "mixed" : v);
const asc = s => String(s || "").replace(/[^\x20-\x7e]/g, "");   // keep the SSE channel happy

const fs = H(), fw = H(), tc = H(), rad = H(), ff = H(), st = H(),
      pad = H(), gap = H(), lib = H(), fam = H();
let bound = 0, unbound = 0, texts = 0, frames = 0;

// findAllWithCriteria uses an indexed type lookup — far faster than findAll with a predicate.
for (const n of page.findAllWithCriteria({ types: ["TEXT"] }).slice(0, 4000)) {
  texts++;
  bump(fs, V(n.fontSize));
  const f = n.fontName;
  bump(fw, typeof f === "symbol" ? "mixed" : f.style);
  bump(fam, typeof f === "symbol" ? "mixed" : f.family);
  bump(tc, hex(n.fills && n.fills[0]));
  // A fill bound to a variable is the design system; a literal that merely EQUALS a token is not
  // bound to it (documentation-ds-linkage.md). The ratio is the file's own adoption figure.
  const bv = n.boundVariables || {};
  (bv.fills && bv.fills.length) ? bound++ : unbound++;
}

for (const n of page.findAllWithCriteria({ types: ["FRAME", "RECTANGLE", "COMPONENT", "INSTANCE"] })
                   .slice(0, 6000)) {
  frames++;
  if ("cornerRadius" in n) bump(rad, V(n.cornerRadius));
  if (n.fills && n.fills.length) bump(ff, hex(n.fills[0]));
  if (n.strokes && n.strokes.length) bump(st, hex(n.strokes[0]));
  if ("paddingLeft" in n && n.layoutMode && n.layoutMode !== "NONE") {
    bump(pad, n.paddingLeft); bump(pad, n.paddingTop); bump(gap, n.itemSpacing);
  }
  const bv = n.boundVariables || {};
  (bv.fills && bv.fills.length) ? bound++ : unbound++;
  if (n.type === "INSTANCE") {
    // Which LIBRARY a page consumes is a governance fact: SAMAVESH is the only library we build
    // from, and a near-miss library is the failure mode CLAUDE.md names by value.
    try {
      const m = await n.getMainComponentAsync();
      if (m) bump(lib, (m.remote ? "R:" : "local:") +
        asc(m.parent && m.parent.type === "COMPONENT_SET" ? m.parent.name : m.name).slice(0, 30));
    } catch (e) { /* a detached or unresolvable main component is not a measurement */ }
  }
}

// Canvas width: the frame width the page designs AT. Sections hold the screens, so descend one.
const wide = H();
for (const c of page.children) {
  if (c.type === "SECTION") for (const g of (c.children || [])) bump(wide, Math.round(g.width));
  else bump(wide, Math.round(c.width));
}

return {
  page: asc(page.name), texts, frames, boundFills: bound, unboundFills: unbound,
  fontSizes: top(fs, 18), weights: top(fw), families: top(fam, 6), textColors: top(tc, 18),
  radii: top(rad, 14), frameFills: top(ff, 18), strokes: top(st, 14),
  padding: top(pad, 14), gaps: top(gap, 12), canvasWidths: top(wide, 12), libraries: top(lib, 18)
};
