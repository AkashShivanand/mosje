/**
 * Persona / Service Discovery decision deck — Department of Social Justice & Empowerment.
 * Eight slides. Noto Sans throughout. Every colour is a resolved SAMAVESH design token
 * (packages/tokens/dist/tokens.css), not an approximation of one.
 * Source of every figure: docs/research/website-ia-persona-discoverability-2026-08.md
 */
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.defineLayout({ name: "MOSJE", width: 13.333, height: 7.5 });
pres.layout = "MOSJE";
pres.author = "MoSJE Design Research";
pres.title = "Finding What You're Entitled To";

// ── SAMAVESH tokens ────────────────────────────────────────────────────────
const BLUE      = "0373DF"; // --sa-color-primaryScale-500  · the brand
const BLUE_TXT  = "005EB9"; // --sa-color-primaryScale-600  · 6.36:1 on white
const BLUE_DEEP = "004B96"; // --sa-color-primaryScale-700  · cards on the dark ground
const DARK      = "003975"; // --sa-color-primaryScale-800  · the dark ground
const BLUE_100  = "C0DBFF"; // --sa-color-primaryScale-100  · body on dark, 8.04:1
const BLUE_200  = "92C2FF"; // --sa-color-primaryScale-200  · numerals on dark, 6.18:1
const BLUE_50   = "ECF4FF"; // --sa-color-primaryScale-50
const SAFF_TXT  = "A43A00"; // --sa-color-brand-saffronDark · 6.60:1 on white
const CAT1      = "0373DF"; // --sa-chart-cat-1
const CAT2      = "E7173A"; // --sa-chart-cat-2             · 4.58:1 on white
const INK       = "1E2124"; // --sa-color-text-default
const INK_MUTE  = "3A3D41"; // --sa-color-text-muted
const MUTE      = "54585E"; // --sa-ref-color-neutral-600   · 7.16:1 white, 6.27:1 on surface
const MUTE_HAIR = "6F757D"; // --sa-ref-color-neutral-500   · white grounds only
const SURF      = "EEF0F3"; // --sa-ref-color-neutral-50
const HAIR      = "DCDEE1"; // --sa-ref-color-neutral-100
const WHITE     = "FFFFFF";

const F = "Noto Sans"; // the estate typeface — one family, hierarchy by weight and size

const W = 13.333, PH = 7.5, M = 0.72, CW = W - M * 2;
const A = (f) => `assets/${f}`;

function slide(dark) {
  const s = pres.addSlide();
  s.background = { color: dark ? DARK : WHITE };
  return s;
}

/** Compact header. Returns the y content may start at. */
function header(s, eyebrow, title, standfirst) {
  s.addText(eyebrow.toUpperCase(), {
    x: M, y: 0.44, w: CW, h: 0.22, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10, bold: true, charSpacing: 1.2, color: MUTE,
  });
  s.addText(title, {
    x: M, y: 0.68, w: CW, h: 0.48, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 28, bold: true, color: DARK,
  });
  if (!standfirst) return 1.3;
  s.addText(standfirst, {
    x: M, y: 1.2, w: CW * 0.9, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 12.5, color: INK_MUTE,
  });
  return 1.66;
}

function shot(s, file, x, y, w, ratio) {
  const h = w / ratio;
  s.addShape(pres.ShapeType.rect, {
    x: x - 0.03, y: y - 0.03, w: w + 0.06, h: h + 0.06,
    fill: { color: WHITE }, line: { color: HAIR, width: 0.75 },
  });
  s.addImage({ path: A(file), x, y, w, h });
  return y + h + 0.06;
}

function chip(s, x, y, label) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w: 1.42, h: 0.26, rectRadius: 0.13,
    fill: { color: BLUE_TXT }, line: { color: BLUE_TXT, width: 0 },
  });
  s.addText(label, {
    x, y, w: 1.42, h: 0.26, isTextBox: true, margin: 0, align: "center", valign: "middle",
    fontFace: F, fontSize: 8.5, bold: true, charSpacing: 0.9, color: WHITE,
  });
}

function sourceLine(s, text) {
  s.addText(text, {
    x: M, y: PH - 0.5, w: CW, h: 0.26, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 9, color: MUTE,
  });
}

/** Strengths and limitations as one compact block. */
function tradeoff(s, x, y, w, h, strengths, limits) {
  s.addText([
    { text: "Strengths", options: { bold: true, color: BLUE_TXT } },
    { text: "\n" + strengths + "\n", options: { color: INK } },
    { text: "Limitations", options: { bold: true, color: SAFF_TXT } },
    { text: "\n" + limits, options: { color: INK } },
  ], {
    x, y, w, h, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10.5, lineSpacingMultiple: 1.2,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 1 · Title
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(true);
  s.addImage({ path: A("emblem-white.png"), x: M, y: 0.72, w: 0.6, h: 0.84 });
  s.addText("Government of India\nMinistry of Social Justice & Empowerment\nDepartment of Social Justice & Empowerment", {
    x: M + 0.8, y: 0.78, w: 6.6, h: 0.78, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11.5, color: BLUE_100, lineSpacingMultiple: 1.2,
  });

  s.addText("Finding What You're\nEntitled To", {
    x: M, y: 2.5, w: 7.4, h: 1.6, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 42, bold: true, color: WHITE, lineSpacingMultiple: 1.06,
  });
  s.addText("Persona-Based Scheme Discovery — Three Decisions for the Department", {
    x: M, y: 4.24, w: 9.3, h: 0.4, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 16, color: BLUE_100,
  });

  s.addText("141", {
    x: 10.2, y: 2.62, w: 2.4, h: 1.1, isTextBox: true, margin: 0, align: "right",
    fontFace: F, fontSize: 58, bold: true, color: BLUE_200,
  });
  s.addText("schemes published\nby the Department", {
    x: 10.2, y: 3.78, w: 2.4, h: 0.58, isTextBox: true, margin: 0, align: "right",
    fontFace: F, fontSize: 11.5, color: BLUE_100, lineSpacingMultiple: 1.18,
  });

  s.addShape(pres.ShapeType.line, { x: M, y: 5.4, w: CW, h: 0, line: { color: BLUE_DEEP, width: 1 } });
  s.addText("An information-architecture and discoverability review of dosje.gov.in and socialjustice.gov.in", {
    x: M, y: 5.66, w: 8.8, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 12.5, color: WHITE,
  });
  s.addText("Live analysis 20 August 2026 · Content export 13 June 2026 · MoSJE Design Research", {
    x: M, y: 5.98, w: 8.8, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11, color: BLUE_100,
  });
  s.addText("Accompanies the design file\nMoSJE (WIP) — Service Discovery", {
    x: 9.6, y: 5.66, w: 3.0, h: 0.6, isTextBox: true, margin: 0, align: "right",
    fontFace: F, fontSize: 11, color: BLUE_100, lineSpacingMultiple: 1.18,
  });
  s.addNotes("Sent ahead of the meeting, so it must read without a presenter. Three decisions are asked for: the homepage, the schemes page, and whether the chatbot carries the same five questions.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 2 · The finding, with the evidence
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "The Finding", "The Filter Works. The Data Behind It Does Not.",
    "For each group the Department serves: how many of the 141 schemes address them, against how many are tagged so the site's own Target Group filter can find them.");

  const rows = [
    ["Safai Karamcharis / Sanitation Workers", 19, 18],
    ["Transgender Persons", 2, 0],
    ["Senior Citizens", 11, 9],
    ["Persons Affected by Substance Use", 3, 0],
    ["Victims of Atrocities", 3, 0],
    ["Persons with Disabilities", 10, 0],
    ["NGOs / Voluntary Organisations", 12, 0],
    ["Students / Learners", 64, 51],
    ["Entrepreneurs / Self-Employed", 23, 5],
    ["OBC / EBC", 24, 6],
    ["Women and Girls", 23, 0],
    ["Scheduled Castes", 32, 5],
    ["DNT / VJNT / NT-SNT", 43, 14],
  ];
  const labels = rows.map((r) => r[0]);
  const chartW = 8.0;
  s.addChart(pres.ChartType.bar, [
    { name: "Schemes addressing them", labels, values: rows.map((r) => r[1]) },
    { name: "Tagged so the filter finds them", labels, values: rows.map((r) => r[2]) },
  ], {
    x: M, y: y0, w: chartW, h: 4.66,
    barDir: "bar", barGrouping: "clustered", barGapWidthPct: 20,
    chartColors: [CAT1, CAT2],
    showLegend: true, legendPos: "t", legendFontFace: F, legendFontSize: 10, legendColor: INK,
    showValue: true, dataLabelFontFace: F, dataLabelFontSize: 8, dataLabelColor: INK_MUTE,
    catAxisLabelFontFace: F, catAxisLabelFontSize: 9.5, catAxisLabelColor: INK,
    valAxisLabelFontFace: F, valAxisLabelFontSize: 9, valAxisLabelColor: MUTE,
    valGridLine: { color: HAIR, style: "solid", size: 0.5 },
    catGridLine: { style: "none" },
    valAxisMaxVal: 70, valAxisMajorUnit: 10,
    catAxisLineShow: false, valAxisLineShow: false,
  });

  const bx = M + chartW + 0.45, bw = CW - chartW - 0.45;
  const stats = [
    ["32", "5", "Scheduled Castes", "The largest constituency. Not one of the five is a scholarship."],
    ["23", "0", "Women and Girls", "Twenty-three schemes serve them. The filter reaches none."],
  ];
  stats.forEach((st, i) => {
    const y = y0 + i * 1.56;
    s.addShape(pres.ShapeType.rect, {
      x: bx, y, w: bw, h: 1.4, fill: { color: SURF }, line: { color: HAIR, width: 0.75 },
    });
    s.addText([
      { text: st[0], options: { fontSize: 30, color: BLUE_TXT } },
      { text: "   to   ", options: { fontSize: 12, color: MUTE } },
      { text: st[1], options: { fontSize: 30, color: SAFF_TXT } },
    ], {
      x: bx + 0.24, y: y + 0.16, w: bw - 0.48, h: 0.56, isTextBox: true, margin: 0,
      fontFace: F, bold: true,
    });
    s.addText(st[2], {
      x: bx + 0.24, y: y + 0.72, w: bw - 0.48, h: 0.24, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 12, bold: true, color: DARK,
    });
    s.addText(st[3], {
      x: bx + 0.24, y: y + 0.98, w: bw - 0.48, h: 0.38, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9.5, color: INK_MUTE, lineSpacingMultiple: 1.14,
    });
  });

  s.addShape(pres.ShapeType.rect, {
    x: bx, y: y0 + 3.12, w: bw, h: 1.54, fill: { color: DARK }, line: { color: DARK, width: 0 },
  });
  s.addText("The filter is not broken. The data behind it was never populated.", {
    x: bx + 0.24, y: y0 + 3.28, w: bw - 0.48, h: 0.82, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 14.5, bold: true, color: WHITE, lineSpacingMultiple: 1.14,
  });
  s.addText("Only 2 of the 141 records carry more than one target group; 27 carry none at all.", {
    x: bx + 0.24, y: y0 + 4.14, w: bw - 0.48, h: 0.4, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10, color: BLUE_100, lineSpacingMultiple: 1.16,
  });

  sourceLine(s, "Source: §1.3 of the review. Content export 13 June 2026; live behaviour re-verified 20 August 2026. Keyword classification over-counts, so these gaps are understated.");
  s.addNotes("Point at the two red bars that reach zero. Everything after this slide is a consequence of that one fact.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 3 · Decision 01 — the homepage, three options
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Decision 01 · The Homepage", "Three Ways for a Citizen to Begin",
    "All three are drawn as finished screens. Option A is what the site carries today.");

  const cols = [
    { tag: "OPTION A", name: "Explore User Personas", sub: "Live on the site today",
      img: "home-optA.png", ratio: 1440 / 632, rec: false,
      str: "Already on the page · illustrations help people who read slowly · recognising yourself beats describing yourself.",
      lim: "One persona at a time, behind arrows · narrows by group alone, not by stage or need." },
    { tag: "OPTION B", name: "Find Schemes for You", sub: "Five short questions, all skippable",
      img: "home-optB-question.png", ratio: 1440 / 804, rec: true,
      str: "Turns 141 schemes into the six that fit · the only option reading stage, need and State · no sign-in, no Aadhaar · ends on Apply.",
      lim: "Content must be remapped first · needs space unless it replaces Our Offerings · caste wording needs Ministry approval." },
    { tag: "OPTION C", name: "Find Offerings for You", sub: "One tap, no questions",
      img: "home-optC.png", ratio: 1440 / 818, rec: false,
      str: "One tap · returns portals, schemes and grievance routes · ends on Apply Now · puts the SAMAVESH promise on page one.",
      lim: "Content must be remapped first · less precise than five questions, so pair it with B." },
  ];
  const colW = (CW - 0.6) / 3;
  const imgTop = y0 + 0.34;
  const imgBottom = imgTop + colW / (1440 / 818) + 0.06;

  cols.forEach((c, i) => {
    const x = M + i * (colW + 0.3);
    if (c.rec) {
      s.addShape(pres.ShapeType.rect, {
        x: x - 0.14, y: y0 - 0.16, w: colW + 0.28, h: 5.04,
        fill: { color: BLUE_50 }, line: { color: BLUE, width: 1.25 },
      });
    }
    s.addText(c.tag, {
      x, y: y0 - 0.02, w: colW - 1.5, h: 0.22, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.1, color: MUTE,
    });
    if (c.rec) chip(s, x + colW - 1.42, y0 - 0.06, "RECOMMENDED");
    shot(s, c.img, x, imgTop, colW, c.ratio);

    s.addText(c.name, {
      x, y: imgBottom + 0.12, w: colW, h: 0.28, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 14.5, bold: true, color: DARK,
    });
    s.addText(c.sub, {
      x, y: imgBottom + 0.42, w: colW, h: 0.24, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 10.5, bold: true, color: BLUE_TXT,
    });
    tradeoff(s, x, imgBottom + 0.72, colW, 1.5, c.str, c.lim);
  });

  s.addText("Recommended: Option B — the only option that reads life stage, need and State as well as community, and the only one that ends on Apply.", {
    x: M, y: 6.62, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11.5, bold: true, color: DARK,
  });
  sourceLine(s, "Design file: MoSJE (WIP) — Service Discovery, Mode 1 Website / Homepage. Option B delivers R3 of the review, Option C delivers R4.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 4 · Decision 02 — the schemes page, two options
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  header(s, "Decision 02 · The Schemes Page", "Welcome, or Compare", null);
  const y0 = 1.66;   // as if the header carried a standfirst — the custom one below occupies that band
  s.addText([
    { text: "The same data, two ways. ", options: { color: INK_MUTE } },
    { text: "Option B is recommended", options: { color: DARK, bold: true } },
    { text: " — this is where a decision gets made, and where officers, NGOs and helpline staff work.", options: { color: INK_MUTE } },
  ], {
    x: M, y: 1.2, w: CW, h: 0.3, isTextBox: true, margin: 0, fontFace: F, fontSize: 12.5,
  });

  const colW = (CW - 0.5) / 2;
  const opts = [
    { tag: "OPTION A · ILLUSTRATED PERSONA CARDS", img: "scheme-optA-crop3.png", ratio: 1160 / 745, rec: false,
      str: "All nine groups visible at once · illustrations cross languages and literacy · cards feel welcoming, not administrative.",
      lim: "Far fewer schemes fit on a screen · no room for who runs it, or central versus State · two schemes cannot be compared." },
    { tag: "OPTION B · FILTER PANEL AND COMPARISON TABLE", img: "scheme-optB-crop.png", ratio: 1268 / 865, rec: true,
      str: "Filters combine group, stage and need · shows jurisdiction · many more schemes visible and comparable · a count per filter warns of an empty result.",
      lim: "A table reads as a record, not an invitation · uses the site's vocabulary · needs care on a small screen." },
  ];
  const imgW = 4.8;
  const imgTop = y0 + 0.34;
  const imgBottom = imgTop + imgW / (1268 / 865) + 0.06;

  opts.forEach((o, i) => {
    const x = M + i * (colW + 0.5);
    s.addText(o.tag, {
      x, y: y0 - 0.02, w: colW - 1.5, h: 0.22, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.05, color: o.rec ? BLUE_TXT : MUTE,
    });
    if (o.rec) chip(s, x + colW - 1.42, y0 - 0.06, "RECOMMENDED");
    shot(s, o.img, x, imgTop, imgW, o.ratio);
    tradeoff(s, x, imgBottom + 0.18, colW, 1.4, o.str, o.lim);
  });

  sourceLine(s, "Both screens cropped below the masthead and hero. Option A's illustrations can sit above Option B's panel if the Department wishes to keep them. Design file: Mode 1 Website / Scheme; Option B delivers R5.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 5 · Decision 03 — the chatbot
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Decision 03 · The Chatbot", "Samajik Sahayak — the Same Five Questions, in Chat",
    "Already built and reachable from every page. The decision is whether it carries the scheme branch, so the same five questions work in conversation.");

  const iw = 7.2;
  const yEnd = shot(s, "chatbot-3up.png", M, y0 + 0.14, iw, 1395 / 720);
  s.addText("Three of the six states drawn: the opening, the branch for an organisation, and the answer with schemes to open. It states plainly that it cannot decide or change an application.", {
    x: M, y: yEnd + 0.14, w: iw, h: 0.34, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 9.5, color: MUTE, lineSpacingMultiple: 1.1,
  });

  const tx = M + iw + 0.5, tw = CW - iw - 0.5;
  chip(s, tx, y0 + 0.14, "RECOMMENDED");
  s.addText("Yes — carry the scheme branch", {
    x: tx, y: y0 + 0.54, w: tw, h: 0.34, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 15, bold: true, color: DARK,
  });
  tradeoff(s, tx, y0 + 1.0, tw, 2.4,
    "Reachable from every page, including the dead ends · one question per screen suits a mobile phone · works in Hindi without a second layout · already built, only the scheme branch is new.",
    "A corner button is found only by those looking for it · covers the page on a small screen · harder to review with a screen reader.");

  s.addText("The chatbot is a companion, not a substitute. It reaches the citizen already lost on a page; it does not replace a route from the homepage.", {
    x: M, y: 6.62, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11.5, bold: true, color: DARK,
  });
  sourceLine(s, "Design file: Mode 2 Chatbot / Option A.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 6 · What it depends on
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Sequencing", "Phase 1 Is the Constraint",
    "The finder, the landings, the facets and the search are all views over one eligibility model. Building any surface before that model is populated reproduces the present failure exactly.");

  const phases = [
    ["Phase 0", "Stop the Bleeding", "2–3 weeks", "Low effort · medium impact",
      "Fix the footer placeholder and the two typos, return real 404 codes, restore the accessibility page, de-list the 24 empty scheme pages.", false],
    ["Phase 1", "Populate the Model", "4–8 weeks", "High effort · very high impact",
      "Define the eligibility schema and backfill all 141 records. Reconcile the seven flagship schemes missing from dosje. Rewrite the category and target-group vocabularies.", true],
    ["Phase 2", "Surfaces", "6–10 weeks", "Medium-high · very high impact",
      "Server-rendered faceted catalogue with linkable filters. Audience landings and the DEPwD signpost. Four verb calls to action. Navigation restructure.", false],
    ["Phase 3", "Finder and Search", "6–8 weeks", "Medium effort · very high impact",
      "Find support for you, audited to WCAG 2.2 AA and tested with at least eight people from the actual constituencies, in Hindi and one other language.", false],
    ["Phase 4", "Consolidation", "Ongoing", "Medium effort · high impact",
      "Publish the scheme API and register with myScheme. Redirect socialjustice.gov.in and retire the legacy site. Publishing template with mandatory fields.", false],
  ];
  const cW = (CW - 4 * 0.22) / 5;
  phases.forEach((p, i) => {
    const x = M + i * (cW + 0.22);
    const on = p[5];
    s.addShape(pres.ShapeType.rect, {
      x, y: y0, w: cW, h: 4.1,
      fill: { color: on ? DARK : SURF }, line: { color: on ? DARK : HAIR, width: 0.75 },
    });
    s.addText(p[0].toUpperCase(), {
      x: x + 0.22, y: y0 + 0.24, w: cW - 0.44, h: 0.22, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.1, color: on ? BLUE_200 : MUTE,
    });
    s.addText(p[1], {
      x: x + 0.22, y: y0 + 0.5, w: cW - 0.44, h: 0.6, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 14.5, bold: true, color: on ? WHITE : DARK, lineSpacingMultiple: 1.08,
    });
    s.addText(p[2], {
      x: x + 0.22, y: y0 + 1.16, w: cW - 0.44, h: 0.24, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11.5, bold: true, color: on ? BLUE_200 : BLUE_TXT,
    });
    s.addText(p[3], {
      x: x + 0.22, y: y0 + 1.44, w: cW - 0.44, h: 0.34, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9.5, color: on ? BLUE_100 : MUTE, lineSpacingMultiple: 1.12,
    });
    s.addText(p[4], {
      x: x + 0.22, y: y0 + 1.88, w: cW - 0.44, h: 1.98, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 10, color: on ? BLUE_100 : INK, lineSpacingMultiple: 1.2,
    });
  });

  s.addText("Phase 1 is the one-time content work. The schemes page, the finder, the landings and the chatbot all wait on it — and it is the piece only the Department can do.", {
    x: M, y: y0 + 4.32, w: CW, h: 0.32, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11.5, bold: true, color: DARK,
  });
  sourceLine(s, "Source: §5, implementation roadmap. Durations are estimates from the review, not commitments.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 7 · The decisions
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(true);
  s.addText("WHAT WE ARE ASKING YOU TO DECIDE", {
    x: M, y: 0.72, w: CW, h: 0.24, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10, bold: true, charSpacing: 1.3, color: BLUE_100,
  });
  s.addText("The Decisions, and Who Takes Them", {
    x: M, y: 1.02, w: CW, h: 0.6, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: WHITE,
  });

  const rows = [
    ["01", "The homepage surface", "Option B — the five-question finder", "Department of Social Justice & Empowerment"],
    ["02", "The schemes page surface", "Option B — the filter panel and table", "Department of Social Justice & Empowerment"],
    ["03", "Whether the chatbot carries the scheme branch", "Yes — it reuses the same five questions", "Department, with the existing chatbot vendor"],
  ];
  const rowY = 2.14, rowH = 0.9;
  [["DECISION", M + 0.8, 4.3], ["OUR RECOMMENDATION", M + 5.2, 4.2], ["WHO DECIDES", M + 9.5, 2.4]].forEach((c) => {
    s.addText(c[0], { x: c[1], y: rowY - 0.32, w: c[2], h: 0.22, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9, bold: true, charSpacing: 1.1, color: BLUE_200 });
  });
  rows.forEach((r, i) => {
    const y = rowY + i * rowH;
    s.addShape(pres.ShapeType.line, { x: M, y: y - 0.08, w: CW, h: 0, line: { color: BLUE_DEEP, width: 1 } });
    s.addText(r[0], { x: M, y: y + 0.12, w: 0.7, h: 0.4, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 21, bold: true, color: BLUE_200 });
    s.addText(r[1], { x: M + 0.8, y: y + 0.14, w: 4.3, h: 0.56, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 13, color: BLUE_100, lineSpacingMultiple: 1.12 });
    s.addText(r[2], { x: M + 5.2, y: y + 0.14, w: 4.2, h: 0.56, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 13, bold: true, color: WHITE, lineSpacingMultiple: 1.12 });
    s.addText(r[3], { x: M + 9.5, y: y + 0.14, w: 2.4, h: 0.56, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11, color: BLUE_100, lineSpacingMultiple: 1.12 });
  });
  s.addShape(pres.ShapeType.line, { x: M, y: rowY + 3 * rowH - 0.08, w: CW, h: 0, line: { color: BLUE_DEEP, width: 1 } });

  s.addShape(pres.ShapeType.rect, {
    x: M, y: 5.14, w: CW, h: 1.24, fill: { color: BLUE_DEEP }, line: { color: BLUE_DEEP, width: 0 },
  });
  s.addText("And one instruction: authorise Phase 1.", {
    x: M + 0.34, y: 5.3, w: CW - 0.68, h: 0.38, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 19, bold: true, color: WHITE,
  });
  s.addText("Populating the eligibility model across all 141 scheme records is the one-time content work every option above depends on. Whichever surfaces are chosen, this has to start first — and only the Department can do it.", {
    x: M + 0.34, y: 5.74, w: CW - 0.68, h: 0.46, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11.5, color: BLUE_100, lineSpacingMultiple: 1.16,
  });
  s.addText("Decisions are sought before the Department's next review meeting.", {
    x: M, y: 6.56, w: CW, h: 0.28, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10.5, color: BLUE_100,
  });
  s.addNotes("If only one decision can be taken today, take the Phase 1 instruction. The three surface choices can follow; nothing can be built without the model.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 8 · Limits and sources
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Stated Limits and Sources", "What This Review Does and Does Not Establish", null);

  const limits = [
    ["No user research was conducted.",
      "Findings are grounded in analysis of the two live sites and in benchmarks against myScheme, DEPwD, the National Scholarship Portal and GOV.UK. The personas are derived from the constituencies named in the Department's own statutes, schemes and organisations — not from interviews. The recommendations should be validated with those constituencies before Phase 3 ships."],
    ["The content export is dated, and the coverage figures are an order of magnitude.",
      "Quantitative claims about the 141 records come from an export generated 13 June 2026; every claim about navigation, facets and search was re-verified live on 20 August 2026. Coverage was measured by keyword classification, which over-counts — so the gaps shown are, if anything, understated."],
  ];
  let y = y0 + 0.2;
  limits.forEach((l, i) => {
    s.addText(String(i + 1).padStart(2, "0"), {
      x: M, y: y + 0.02, w: 0.7, h: 0.4, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 21, bold: true, color: SAFF_TXT,
    });
    s.addText(l[0], {
      x: M + 0.82, y, w: CW - 0.82, h: 0.3, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 14, bold: true, color: DARK,
    });
    s.addText(l[1], {
      x: M + 0.82, y: y + 0.32, w: CW - 0.82, h: 0.84, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11.5, color: INK, lineSpacingMultiple: 1.24,
    });
    y += 1.42;
    s.addShape(pres.ShapeType.line, { x: M, y: y - 0.2, w: CW, h: 0, line: { color: HAIR, width: 0.75 } });
  });

  s.addText("SOURCES", {
    x: M, y: y + 0.04, w: CW, h: 0.22, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.2, color: MUTE,
  });
  const srcs = [
    ["The two Ministry sites", "dosje.gov.in (SAMAVESH, marked BETA) and socialjustice.gov.in — fetched and parsed 20 August 2026."],
    ["The Department's content export", "141 scheme records, 175 organisation pages, 1,624 documents, 305 tenders, 137 vacancies. Manifest 13 June 2026."],
    ["Benchmarks and standards", "myscheme.gov.in · depwd.gov.in · scholarships.gov.in · GOV.UK. GIGW 3.0, DBIM 3.0, WCAG 2.2 AA."],
    ["The design file", "MoSJE (WIP) — Service Discovery. Every screen here is taken from it unaltered, cropped only where noted."],
  ];
  let sy = y + 0.32;
  srcs.forEach((r) => {
    s.addText(r[0], { x: M, y: sy, w: 3.3, h: 0.28, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11, bold: true, color: BLUE_TXT });
    s.addText(r[1], { x: M + 3.5, y: sy, w: CW - 3.5, h: 0.28, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11, color: INK });
    sy += 0.4;
  });

  sourceLine(s, "Finding What You're Entitled To — an information-architecture and discoverability review. MoSJE Design Research, 20 August 2026.");
}

pres.writeFile({ fileName: "MoSJE-Persona-Scheme-Discovery.pptx" })
  .then((f) => console.log("wrote", f));
