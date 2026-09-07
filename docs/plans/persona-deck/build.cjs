/**
 * Persona / Service Discovery decision deck — Department of Social Justice & Empowerment.
 * Built to docs/plans/2026-09-07-persona-deck-execution-prompt.md
 * Source of every figure: docs/research/website-ia-persona-discoverability-2026-08.md
 */
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.defineLayout({ name: "MOSJE", width: 13.333, height: 7.5 });
pres.layout = "MOSJE";
pres.author = "MoSJE Design Research";
pres.title = "Finding What You're Entitled To";

// ── palette ────────────────────────────────────────────────────────────────
const NAVY = "003366";
const BLUE = "0373DF";
const SAFF = "F97316";
const INK = "1A1A1A";
const MUTE = "5A6472";
const HAIR = "D8DEE7";
const SURF = "F5F7FA";
const WHITE = "FFFFFF";
const NAVY_MUTE = "9DB4CC";
const NAVY_CARD = "0A4179";
// Accessible rungs of the same two hues. WCAG 2.2 AA, measured against the ground each is used on:
const SAFF_TEXT = "9A3412";   // saffron TEXT on white/surface — 7.31:1 / 6.81:1
const SAFF_BAR  = "EA580C";   // saffron GRAPHIC (chart bar) on white — 3.56:1
const SAFF_DK   = "FDBA74";   // saffron text on navy — 7.48:1 / 6.09:1
const BLUE_TEXT = "0257A8";   // blue TEXT on white/surface — 7.16:1 / 6.68:1
const BLUE_DK   = "8CC6FB";   // blue text on navy — 6.96:1 / 5.67:1

const H = "Cambria";   // headings
const B = "Calibri";   // body

// ── grid ───────────────────────────────────────────────────────────────────
const W = 13.333, PH = 7.5, M = 0.72, CW = W - M * 2;

const A = (f) => `assets/${f}`;

// ── helpers ────────────────────────────────────────────────────────────────
function slide(dark) {
  const s = pres.addSlide();
  s.background = { color: dark ? NAVY : WHITE };
  return s;
}

/** Standard light-slide header. Returns the y at which content may begin. */
function header(s, eyebrow, title, standfirst) {
  s.addText(eyebrow.toUpperCase(), {
    x: M, y: 0.48, w: CW, h: 0.22, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 10, bold: true, charSpacing: 1.2, color: MUTE,
  });
  s.addText(title, {
    x: M, y: 0.74, w: CW, h: 0.5, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 30, bold: true, color: NAVY,
  });
  if (!standfirst) return 1.36;
  s.addText(standfirst, {
    x: M, y: 1.3, w: CW * 0.82, h: 0.42, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 13, color: MUTE, lineSpacingMultiple: 1.15,
  });
  return 1.92;
}

/** Muted caption under an image or block. */
function caption(s, text, x, y, w) {
  s.addText(text, {
    x, y, w, h: 0.3, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 10, color: MUTE, lineSpacingMultiple: 1.05,
  });
}

/** Framed screenshot: hairline border, no stretch. */
function shot(s, file, x, y, w, ratio) {
  const h = w / ratio;
  s.addShape(pres.ShapeType.rect, {
    x: x - 0.03, y: y - 0.03, w: w + 0.06, h: h + 0.06,
    fill: { color: WHITE }, line: { color: HAIR, width: 0.75 },
  });
  s.addImage({ path: A(file), x, y, w, h });
  return y + h + 0.06;
}

/** Estimated rendered height of a bullet block, in inches. */
function bulletH(items, w, pt) {
  const cpl = Math.max(8, Math.floor((w * 72) / (pt * 0.47)));
  const lines = items.reduce((n, t) => n + Math.max(1, Math.ceil(t.length / cpl)), 0);
  return lines * (pt * 1.22) / 72 + items.length * 0.05 + 0.06;
}

function bulletBlock(s, label, labelColor, items, x, y, w) {
  s.addText(label, {
    x, y, w, h: 0.2, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 10, bold: true, charSpacing: 1.1, color: labelColor,
  });
  const h = bulletH(items, w - 0.2, 12);
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } })), {
    x, y: y + 0.24, w, h, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 12, color: INK, lineSpacingMultiple: 1.14, paraSpaceAfter: 3,
  });
  return y + 0.24 + h;
}

/** Strengths above Limitations, in one column. */
function tradeoffs(s, x, y, w, strengths, limits) {
  const y2 = bulletBlock(s, "STRENGTHS", BLUE_TEXT, strengths, x, y, w) + 0.18;
  return bulletBlock(s, "LIMITATIONS", SAFF_TEXT, limits, x, y2, w);
}

/** Strengths and Limitations side by side. */
function tradeoffsRow(s, x, y, w, strengths, limits) {
  const half = (w - 0.5) / 2;
  const a = bulletBlock(s, "STRENGTHS", BLUE_TEXT, strengths, x, y, half);
  const b = bulletBlock(s, "LIMITATIONS", SAFF_TEXT, limits, x + half + 0.5, y, half);
  return Math.max(a, b);
}

/** The recommended tag — saffron, used nowhere else but the gap encoding. */
function recommendedTag(s, x, y) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w: 1.5, h: 0.28, rectRadius: 0.14, fill: { color: BLUE_TEXT }, line: { color: BLUE_TEXT, width: 0 },
  });
  s.addText("RECOMMENDED", {
    x, y, w: 1.5, h: 0.28, isTextBox: true, margin: 0, align: "center", valign: "middle",
    fontFace: B, fontSize: 9, bold: true, charSpacing: 1, color: WHITE,
  });
}

function sourceLine(s, text) {
  s.addText(text, {
    x: M, y: PH - 0.52, w: CW, h: 0.26, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 9.5, color: MUTE,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 1 · Title
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(true);
  s.addImage({ path: A("emblem-white.png"), x: M, y: 0.72, w: 0.62, h: 0.86 });
  s.addText("Government of India\nMinistry of Social Justice & Empowerment\nDepartment of Social Justice & Empowerment", {
    x: M + 0.82, y: 0.78, w: 6.4, h: 0.78, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 12, color: NAVY_MUTE, lineSpacingMultiple: 1.18,
  });

  s.addText("Finding What You're\nEntitled To", {
    x: M, y: 2.4, w: 9.4, h: 1.9, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 52, bold: true, color: WHITE, lineSpacingMultiple: 1.02,
  });
  s.addText("Persona-Based Scheme Discovery — Three Decisions for the Department", {
    x: M, y: 4.42, w: 9.4, h: 0.4, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 17, color: NAVY_MUTE,
  });

  s.addText("141", {
    x: 10.2, y: 2.3, w: 2.4, h: 1.42, isTextBox: true, margin: 0, align: "right",
    fontFace: H, fontSize: 76, bold: true, color: BLUE_DK,
  });
  s.addText("schemes published\nby the Department", {
    x: 10.2, y: 3.78, w: 2.4, h: 0.6, isTextBox: true, margin: 0, align: "right",
    fontFace: B, fontSize: 12, color: NAVY_MUTE, lineSpacingMultiple: 1.15,
  });

  s.addShape(pres.ShapeType.line, {
    x: M, y: 5.5, w: CW, h: 0, line: { color: NAVY_CARD, width: 1 },
  });
  s.addText([
    { text: "An information-architecture and discoverability review of ", options: { color: NAVY_MUTE } },
    { text: "dosje.gov.in", options: { color: WHITE, bold: true } },
    { text: " and ", options: { color: NAVY_MUTE } },
    { text: "socialjustice.gov.in", options: { color: WHITE, bold: true } },
  ], {
    x: M, y: 5.74, w: 8.6, h: 0.3, isTextBox: true, margin: 0, fontFace: B, fontSize: 13,
  });
  s.addText("Live analysis 20 August 2026 · Content export 13 June 2026 · MoSJE Design Research", {
    x: M, y: 6.08, w: 8.6, h: 0.3, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 11.5, color: NAVY_MUTE,
  });
  s.addText("Accompanies the design file\nMoSJE (WIP) — Service Discovery", {
    x: 9.4, y: 5.74, w: 3.2, h: 0.62, isTextBox: true, margin: 0, align: "right",
    fontFace: B, fontSize: 11.5, color: NAVY_MUTE, lineSpacingMultiple: 1.18,
  });
  s.addNotes("The deck is sent ahead of the meeting and must read without a presenter. Three decisions are asked for: the homepage surface, the schemes page surface, and whether the chatbot carries the same five questions.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 2 · The question
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(true);
  s.addText("THE QUESTION THIS REVIEW ASKS", {
    x: M, y: 1.9, w: CW, h: 0.24, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 10.5, bold: true, charSpacing: 1.3, color: NAVY_MUTE,
  });
  s.addText("Can a citizen find what\nthey are entitled to?", {
    x: M, y: 2.3, w: 10.6, h: 2, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 46, bold: true, color: WHITE, lineSpacingMultiple: 1.06,
  });
  s.addText("The Department publishes 141 schemes across 18 organisations and thematic portals. This review tested whether the people those schemes exist for can reach them — by browsing, by filtering, and by searching.", {
    x: M, y: 4.66, w: 8.9, h: 0.9, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 15, color: NAVY_MUTE, lineSpacingMultiple: 1.28,
  });
  sourceLine(s, "");
  s.addNotes("Framing slide. The answer, on the next slide, is no — and the reason is not the interface.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 3 · The headline finding
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "The Finding", "The Filter Works. The Data Behind It Does Not.",
    "For each group the Department serves, how many of the 141 schemes actually address them — against how many are tagged so the site's own Target Group filter can find them.");

  const stats = [
    { n: "32", d: "5", label: "Scheduled Castes", note: "The Department's largest constituency. Not one of the five results is a scholarship." },
    { n: "23", d: "0", label: "Women and Girls", note: "Twenty-three schemes serve them. The filter offers no way to reach any of them." },
    { n: "27", d: null, label: "Records Carry No Target Group", note: "Thirteen carry neither a target group nor a category, and are reachable only by URL." },
  ];
  const cardW = (CW - 0.64) / 3;
  stats.forEach((st, i) => {
    const x = M + i * (cardW + 0.32);
    s.addShape(pres.ShapeType.rect, {
      x, y: y0, w: cardW, h: 2.66, fill: { color: SURF }, line: { color: HAIR, width: 0.75 },
    });
    if (st.d !== null) {
      s.addText([
        { text: st.n, options: { fontSize: 56, color: BLUE } },
        { text: "  \u2192  ", options: { fontSize: 28, color: MUTE, fontFace: B } },
        { text: st.d, options: { fontSize: 56, color: SAFF_TEXT } },
      ], {
        x: x + 0.34, y: y0 + 0.24, w: cardW - 0.68, h: 1.06, isTextBox: true, margin: 0,
        fontFace: H, bold: true,
      });
    } else {
      s.addText(st.n, {
        x: x + 0.34, y: y0 + 0.24, w: cardW - 0.68, h: 1.06, isTextBox: true, margin: 0,
        fontFace: H, fontSize: 56, bold: true, color: SAFF_TEXT,
      });
    }
    s.addText(st.label, {
      x: x + 0.34, y: y0 + 1.38, w: cardW - 0.68, h: 0.32, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 14.5, bold: true, color: NAVY,
    });
    s.addText(st.note, {
      x: x + 0.34, y: y0 + 1.76, w: cardW - 0.68, h: 0.74, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12, color: MUTE, lineSpacingMultiple: 1.2,
    });
  });

  s.addShape(pres.ShapeType.rect, {
    x: M, y: y0 + 2.82, w: CW, h: 1.18, fill: { color: NAVY }, line: { color: NAVY, width: 0 },
  });
  s.addText("The filter is not broken. The data behind it was never populated.", {
    x: M + 0.42, y: y0 + 2.94, w: CW - 0.84, h: 0.44, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 24, bold: true, color: WHITE,
  });
  s.addText("Only 2 of the 141 records carry more than one target group. The taxonomy is single-valued where the world is multi-dimensional — so an SC student must choose between filtering by caste and filtering by education, and cannot do both.", {
    x: M + 0.42, y: y0 + 3.42, w: CW - 0.84, h: 0.44, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 12.5, color: NAVY_MUTE, lineSpacingMultiple: 1.15,
  });

  sourceLine(s, "Source: content export generated 13 June 2026, 141 scheme records. Live behaviour re-verified 20 August 2026.");
  s.addNotes("The one line the deck opens on. Every recommendation that follows is a consequence of this single fact.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 4 · The ask, up front (the deck is read without a presenter)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "What We Are Asking For", "Three Decisions, and One Instruction",
    "Stated here so it is not missed, and set out in full at the end with who decides. The slides between the two make the case for each.");

  const asks = [
    ["01", "The Homepage", "Option B — the five-question finder", "See Decision 01"],
    ["02", "The Schemes Page", "Option B — the filter panel and table", "See Decision 02"],
    ["03", "The Chatbot", "Carry the same five questions", "See Decision 03"],
  ];
  const cardW = (CW - 0.64) / 3;
  asks.forEach((a, i) => {
    const x = M + i * (cardW + 0.32);
    s.addShape(pres.ShapeType.rect, {
      x, y: y0, w: cardW, h: 2.1, fill: { color: WHITE }, line: { color: HAIR, width: 0.75 },
    });
    s.addText(a[0], {
      x: x + 0.34, y: y0 + 0.26, w: cardW - 0.68, h: 0.5, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 30, bold: true, color: BLUE_TEXT,
    });
    s.addText(a[1], {
      x: x + 0.34, y: y0 + 0.8, w: cardW - 0.68, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 19, bold: true, color: NAVY,
    });
    s.addText(a[2], {
      x: x + 0.34, y: y0 + 1.2, w: cardW - 0.68, h: 0.5, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 13, bold: true, color: BLUE_TEXT, lineSpacingMultiple: 1.14,
    });
    s.addText(a[3].toUpperCase(), {
      x: x + 0.34, y: y0 + 1.72, w: cardW - 0.68, h: 0.24, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 9.5, bold: true, charSpacing: 1.1, color: MUTE,
    });
  });

  s.addShape(pres.ShapeType.rect, {
    x: M, y: y0 + 2.42, w: CW, h: 1.5, fill: { color: NAVY }, line: { color: NAVY, width: 0 },
  });
  s.addText("And one instruction: authorise Phase 1.", {
    x: M + 0.42, y: y0 + 2.6, w: CW - 0.84, h: 0.44, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 24, bold: true, color: WHITE,
  });
  s.addText("Populating the eligibility model across all 141 scheme records is the one-time content work that every option above depends on. Whichever surfaces are chosen, this has to start first — and it is the piece only the Department can do.", {
    x: M + 0.42, y: y0 + 3.08, w: CW - 0.84, h: 0.62, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 13, color: NAVY_MUTE, lineSpacingMultiple: 1.2,
  });

  s.addText("Each recommendation is set out with the alternatives, their strengths and their limitations, on the slides that follow.", {
    x: M, y: y0 + 4.14, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 12, color: MUTE,
  });
  s.addNotes("Placed here because the deck is sent ahead of the meeting. A reader who stops after four slides still knows what is being asked for.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 4 · The evidence — coverage matrix as a native chart
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  header(s, "The Evidence", "Coverage Against Tagging, by Group",
    "Ordered by the size of the gap. Together, 55 schemes serve Scheduled Castes and women and girls; the filter reaches five of them.");

  // Ordered smallest gap first — horizontal bars render bottom-to-top.
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
  s.addChart(pres.ChartType.bar, [
    { name: "Schemes addressing them", labels, values: rows.map((r) => r[1]) },
    { name: "Tagged so the filter finds them", labels, values: rows.map((r) => r[2]) },
  ], {
    x: M, y: 1.9, w: CW, h: 4.86,
    barDir: "bar", barGrouping: "clustered", barGapWidthPct: 20,
    chartColors: [BLUE, SAFF_BAR],
    showLegend: true, legendPos: "t", legendFontFace: B, legendFontSize: 11, legendColor: INK,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontFace: B,
    dataLabelFontSize: 8, dataLabelColor: MUTE,
    catAxisLabelFontFace: B, catAxisLabelFontSize: 10, catAxisLabelColor: INK,
    valAxisLabelFontFace: B, valAxisLabelFontSize: 10, valAxisLabelColor: MUTE,
    valGridLine: { color: HAIR, style: "solid", size: 0.5 },
    catGridLine: { style: "none" },
    valAxisMaxVal: 70, valAxisMajorUnit: 10,
    catAxisLineShow: false, valAxisLineShow: false,
  });

  sourceLine(s, "Source: §1.3, coverage matrix. Keyword classification over each record's title and body — an order-of-magnitude measure that over-counts, so these gaps are, if anything, understated.");
  s.addNotes("Do not read the chart aloud row by row. Point at the two saffron bars that reach zero.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 5 · Why it happens
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Diagnosis", "Five Reasons a Citizen Does Not Get Through",
    "Each is drawn from the numbered diagnoses in the review. All five are live today.");

  const items = [
    ["D1", "Two Live Ministry Websites, with Different Taxonomies",
      "socialjustice.gov.in lists PM-SURAJ among its major schemes. A search for SURAJ on dosje.gov.in returns ten results and none of them is PM-SURAJ."],
    ["D3", "The Filters Are Real; the Data Behind Them Is Not",
      "The category vocabulary carries MICRO FINANCE and TERM LOAN in capitals, leaked from two scheme titles, and Homeowners as a target group."],
    ["D4", "Everything Is Named the Way the File Is Named Inside the Ministry",
      "Eighteen organisations shown as acronyms. The longest scheme title runs to 168 characters. A senior citizen does not know she is a Social Defence matter."],
    ["D6", "There Is an Entry Point for Every Artefact and None for Any Need",
      "Six of the seven top-level menus name things the Department has. Nothing answers am I eligible, how do I apply, or where is my application."],
    ["D7", "Search Retrieves by Tag Substring, and the Tags Are Noise",
      "A search for disability returns 19 results, one of which is a scheme — and it is an elderly-persons scheme. Nothing points to the sibling department."],
  ];
  const rowH = 0.94;
  items.forEach((it, i) => {
    const y = y0 + i * rowH;
    s.addShape(pres.ShapeType.roundRect, {
      x: M, y: y + 0.06, w: 0.62, h: 0.42, rectRadius: 0.08,
      fill: { color: NAVY }, line: { color: NAVY, width: 0 },
    });
    s.addText(it[0], {
      x: M, y: y + 0.06, w: 0.62, h: 0.42, isTextBox: true, margin: 0, align: "center", valign: "middle",
      fontFace: B, fontSize: 12.5, bold: true, color: WHITE,
    });
    s.addText(it[1], {
      x: M + 0.86, y: y + 0.02, w: CW - 0.86, h: 0.3, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 14.5, bold: true, color: NAVY,
    });
    s.addText(it[2], {
      x: M + 0.86, y: y + 0.34, w: CW - 0.86, h: 0.42, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12, color: MUTE, lineSpacingMultiple: 1.16,
    });
    if (i < items.length - 1) {
      s.addShape(pres.ShapeType.line, {
        x: M, y: y + rowH - 0.12, w: CW, h: 0, line: { color: HAIR, width: 0.75 },
      });
    }
  });

  sourceLine(s, "Source: §3, diagnoses D1–D9. Four further diagnoses — D2, D5, D8, D9 — are set out in the full review.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 6 & 14 · Journeys, before and after
// ═══════════════════════════════════════════════════════════════════════════
const JOURNEYS = [
  {
    name: "Meena, 17", who: "Scheduled Caste, class 12, small town",
    before: { fig: "8", figLabel: "steps, and two dead ends", outcome: "Abandons; asks the cyber-café operator",
      text: "Filters Target Group = Scheduled Castes and gets five results, none of them a scholarship. Filters Students instead and gets 51, central and state mixed, unsorted. Opens Post-Matric Scholarship and finds administrative prose with no apply button." },
    after: { fig: "4", figLabel: "steps, and no dead ends", outcome: "Application started",
      text: "Answers five questions — myself, Scheduled Caste, in school, education and fees, Bihar — and gets four matched schemes with Post-Matric first, each stating what you get, who can apply and what you will need, ending on Apply on National Scholarship Portal." },
  },
  {
    name: "Ramesh, 42", who: "Sewer worker seeking rehabilitation finance",
    before: { fig: "0", figLabel: "facets describe him", outcome: "The loan route is unreachable",
      text: "Sanitation Workers is the closest facet and returns 18 results, including a status page frozen at 30 April 2018 and three duplicate NAMASTE guideline records. The NSKFDC loan route is described inside an organisation page reachable only from the organisations menu." },
    after: { fig: "3", figLabel: "schemes, then a phone number", outcome: "Sent to his State agency",
      text: "The safai karamcharis and sanitation workers landing opens on NAMASTE, SRMS through NSKFDC and Swachhta Udyami Yojana, then Where to apply near you gives him his State Channelising Agency, with a telephone number." },
  },
  {
    name: "Lata, 34", who: "Caring for her mother, aged 71",
    before: { fig: "0", figLabel: "mentions of senior in the navigation", outcome: "Never reaches Elderline",
      text: "Her mother's schemes sit under Social Defence in the footer and under the acronym SCW in the organisations menu. Elderline is a scheme record, not a telephone number on any page she will reach." },
    after: { fig: "14567", figLabel: "Elderline, in the page header", outcome: "Reaches the helpline first",
      text: "The senior citizens and carers landing carries Elderline 14567 in the page header, then AVYAY, Rashtriya Vayoshri Yojana, IPSrC and geriatric caregiver training — with the finder's someone in my family path preserved throughout." },
  },
];

function journeySlide(mode) {
  const s = slide(false);
  const isAfter = mode === "after";
  const y0 = header(s,
    isAfter ? "The Same Three Journeys" : "Three Journeys",
    isAfter ? "The Same Three People, After the Change" : "Three People, on the Site as It Stands Today",
    isAfter
      ? "Same three people, same order, same layout as the earlier slide. Every one now ends somewhere they can act."
      : "Traced against the live site on 20 August 2026. Each figure is the one the review recorded for that person.");

  const colW = (CW - 0.64) / 3;
  JOURNEYS.forEach((j, i) => {
    const x = M + i * (colW + 0.32);
    const d = isAfter ? j.after : j.before;
    s.addShape(pres.ShapeType.rect, {
      x, y: y0, w: colW, h: 4.74,
      fill: { color: isAfter ? SURF : WHITE }, line: { color: isAfter ? HAIR : HAIR, width: 0.75 },
    });
    s.addText(j.name, {
      x: x + 0.3, y: y0 + 0.26, w: colW - 0.6, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 20, bold: true, color: NAVY,
    });
    s.addText(j.who, {
      x: x + 0.3, y: y0 + 0.62, w: colW - 0.6, h: 0.32, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 11.5, color: MUTE, lineSpacingMultiple: 1.1,
    });
    s.addShape(pres.ShapeType.line, {
      x: x + 0.3, y: y0 + 1.02, w: colW - 0.6, h: 0, line: { color: HAIR, width: 0.75 },
    });

    const nCol = isAfter ? BLUE_TEXT : SAFF_TEXT;
    s.addText(d.fig, {
      x: x + 0.3, y: y0 + 1.12, w: colW - 0.6, h: 0.66, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 38, bold: true, color: nCol,
    });
    s.addText(d.figLabel, {
      x: x + 0.3, y: y0 + 1.76, w: colW - 0.6, h: 0.3, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12, color: MUTE,
    });

    s.addText(d.text, {
      x: x + 0.3, y: y0 + 2.14, w: colW - 0.6, h: 1.66, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 11.5, color: INK, lineSpacingMultiple: 1.22,
    });
    s.addShape(pres.ShapeType.line, {
      x: x + 0.3, y: y0 + 3.86, w: colW - 0.6, h: 0, line: { color: HAIR, width: 0.75 },
    });
    s.addText("OUTCOME", {
      x: x + 0.3, y: y0 + 3.94, w: colW - 0.6, h: 0.2, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 9, bold: true, charSpacing: 1.1, color: MUTE,
    });
    s.addText(d.outcome, {
      x: x + 0.3, y: y0 + 4.14, w: colW - 0.6, h: 0.38, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12.5, bold: true, color: nCol, lineSpacingMultiple: 1.1,
    });
  });
  sourceLine(s, isAfter
    ? "Source: §4.1, redesigned journeys. Step counts describe the designed flow, not a measured session."
    : "Source: §4.1 and §3. Step counts are recorded in the review for Meena only; the other two figures are the ones §4.1 and D4 state for them.");
  return s;
}

journeySlide("before");   // slide 6

// ═══════════════════════════════════════════════════════════════════════════
// 7 · What is being decided (dark section break)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(true);
  s.addText("WHAT IS BEING DECIDED", {
    x: M, y: 0.9, w: CW, h: 0.26, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 10.5, bold: true, charSpacing: 1.3, color: NAVY_MUTE,
  });
  s.addText("Three Surfaces. Three Decisions.", {
    x: M, y: 1.24, w: CW, h: 0.72, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 40, bold: true, color: WHITE,
  });
  s.addText("The design work has been taken to finished screens on each of the three places a citizen begins. Each surface is decided on its own; a choice on one does not settle the others.", {
    x: M, y: 2.06, w: 9.6, h: 0.5, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 14, color: NAVY_MUTE, lineSpacingMultiple: 1.2,
  });

  const cards = [
    ["01", "The Homepage", "Three options", "Where most first-time visitors arrive. The choice is between recognising yourself, answering five questions, or one tap."],
    ["02", "The Schemes Page", "Two options", "Where a decision gets made and where officers, NGOs and helpline staff work. The choice is between welcome and comparison."],
    ["03", "The Chatbot", "One option", "Reachable from every page, including the dead ends. The choice is whether it carries the same five questions."],
  ];
  const cardW = (CW - 0.64) / 3;
  cards.forEach((c, i) => {
    const x = M + i * (cardW + 0.32);
    s.addShape(pres.ShapeType.rect, {
      x, y: 3.06, w: cardW, h: 3.06, fill: { color: NAVY_CARD }, line: { color: NAVY_CARD, width: 0 },
    });
    s.addText(c[0], {
      x: x + 0.36, y: 3.3, w: cardW - 0.72, h: 0.74, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 46, bold: true, color: BLUE_DK,
    });
    s.addText(c[1], {
      x: x + 0.36, y: 4.12, w: cardW - 0.72, h: 0.36, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 21, bold: true, color: WHITE,
    });
    s.addText(c[2].toUpperCase(), {
      x: x + 0.36, y: 4.52, w: cardW - 0.72, h: 0.24, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 10, bold: true, charSpacing: 1.1, color: BLUE_DK,
    });
    s.addText(c[3], {
      x: x + 0.36, y: 4.86, w: cardW - 0.72, h: 1.02, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12, color: NAVY_MUTE, lineSpacingMultiple: 1.2,
    });
  });
  s.addText("Each option below is mapped to the recommendation it delivers: the finder is R3, the audience landings are R4, the faceted catalogue is R5. All four depend on R1, the eligibility model.", {
    x: M, y: 6.44, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 11, color: NAVY_MUTE,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 8 · Homepage — the three options at a glance
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Decision 01 · The Homepage", "Three Ways to Begin",
    "All three have been drawn as finished screens. Option A is what the site carries today.");

  const cols = [
    { tag: "OPTION A", title: "Explore User Personas", sub: "Live on the site today",
      body: "An illustrated card cycles through the groups behind arrows. Choosing one takes the reader to the schemes page.",
      best: "Returning visitors who already identify with one group.", rec: false },
    { tag: "OPTION B", title: "Find Schemes for You", sub: "Five short questions, all skippable",
      body: "Narrows 141 schemes to the handful that fit, reading community, life stage, need and State together, with a live count as the reader answers.",
      best: "First-time visitors, who are most visitors.", rec: true },
    { tag: "OPTION C", title: "Find Offerings for You", sub: "One tap, no questions",
      body: "A row of groups. Tapping one returns the portal, the scheme and the grievance route for that situation, each ending on Apply Now.",
      best: "The visitor who will not answer questions.", rec: false },
  ];
  const colW = (CW - 0.64) / 3;
  cols.forEach((c, i) => {
    const x = M + i * (colW + 0.32);
    s.addShape(pres.ShapeType.rect, {
      x, y: y0, w: colW, h: 4.4,
      fill: { color: c.rec ? SURF : WHITE }, line: { color: c.rec ? BLUE : HAIR, width: c.rec ? 1.5 : 0.75 },
    });
    s.addText(c.tag, {
      x: x + 0.32, y: y0 + 0.3, w: colW - 0.64, h: 0.24, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 10, bold: true, charSpacing: 1.2, color: MUTE,
    });
    s.addText(c.title, {
      x: x + 0.32, y: y0 + 0.58, w: colW - 0.64, h: 0.62, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 20, bold: true, color: NAVY, lineSpacingMultiple: 1.04,
    });
    s.addText(c.sub, {
      x: x + 0.32, y: y0 + 1.26, w: colW - 0.64, h: 0.28, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 11.5, bold: true, color: BLUE_TEXT,
    });
    s.addShape(pres.ShapeType.line, {
      x: x + 0.32, y: y0 + 1.62, w: colW - 0.64, h: 0, line: { color: HAIR, width: 0.75 },
    });
    s.addText(c.body, {
      x: x + 0.32, y: y0 + 1.78, w: colW - 0.64, h: 1.42, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12, color: INK, lineSpacingMultiple: 1.22,
    });
    s.addText([
      { text: "BEST SUITED TO\n", options: { fontSize: 10, bold: true, charSpacing: 1, color: MUTE } },
      { text: c.best, options: { fontSize: 12, color: INK } },
    ], {
      x: x + 0.32, y: y0 + 3.28, w: colW - 0.64, h: 0.72, isTextBox: true, margin: 0,
      fontFace: B, lineSpacingMultiple: 1.2,
    });
    if (c.rec) recommendedTag(s, x + 0.32, y0 + 3.94);
  });

  s.addText("Recommended: Option B. It is the only one of the three that reads life stage, need and State as well as community — which is the arithmetic problem on slide 3 — and it ends on Apply rather than on a page of prose.", {
    x: M, y: y0 + 4.52, w: CW, h: 0.5, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 12.5, bold: true, color: NAVY, lineSpacingMultiple: 1.16,
  });
  sourceLine(s, "");
}

// ═══════════════════════════════════════════════════════════════════════════
// 9 · Homepage Option A
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Decision 01 · Option A", "Explore User Personas — What the Site Carries Today",
    "An illustrated persona card sits beside Recent Documents. The reader moves through the groups with arrows.");
  const imgW = 7.5;
  const yEnd = shot(s, "home-optA.png", M, y0, imgW, 1440 / 632);
  caption(s, "Homepage, Option A — the persona panel as it renders today, beside Recent Documents.", M, yEnd + 0.14, imgW);

  tradeoffs(s, M + imgW + 0.5, y0, CW - imgW - 0.5,
    ["Already on the page, so it costs no extra height", "Illustrations help people who read slowly", "Recognising yourself beats describing yourself"],
    ["Shows one persona at a time, behind arrows", "Narrows by group alone, not stage or need", "Choosing a persona must open the schemes page already filtered — today it does not"]);

  sourceLine(s, "Design file: MoSJE (WIP) — Service Discovery, Mode 1 Website / Homepage / Option A.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 10 · Homepage Option B — recommended
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Decision 01 · Option B", "Find Schemes for You — Five Short Questions",
    "Every question is skippable, and skipping widens the answer instead of stopping it. No sign-in, no Aadhaar, nothing stored.");
  recommendedTag(s, W - M - 1.5, 0.72);

  const iw = 5.3;
  const y1 = shot(s, "home-optB-question.png", M, y0, iw, 1440 / 804);
  caption(s, "Question 2 of 5. The count of schemes still matching is held in the corner throughout.", M, y1 + 0.1, iw);
  shot(s, "home-optB-results-crop.png", M + iw + 0.5, y0, iw, 1440 / 812);
  caption(s, "The answer: six schemes, each ending in a real place to apply. Cropped below the third card.", M + iw + 0.5, y1 + 0.1, iw);

  tradeoffsRow(s, M, y1 + 0.46, CW,
    ["Turns 141 schemes into the six that fit", "The only option reading stage, need and State as well as community", "No sign-in, no Aadhaar, nothing stored", "A live count proves it is working as they answer", "Ends on Apply, not on a page of prose"],
    ["Content must be remapped first — one-time work", "Needs space, unless it replaces Our Offerings", "Caste wording needs Ministry approval"]);

  sourceLine(s, "Design file: Mode 1 Website / Homepage / Option B. Delivers recommendation R3 of the review.");
  s.addNotes("The tagging this needs is the one-time content work that every other option here depends on anyway. It can take the space Our Offerings occupies today rather than adding any.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 11 · Homepage Option C
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Decision 01 · Option C", "Find Offerings for You — One Tap, No Questions",
    "A row of groups. Tapping one returns a portal, a scheme and a grievance route for that situation, on the homepage itself.");
  const imgW = 7.5;
  const yEnd = shot(s, "home-optC.png", M, y0, imgW, 1440 / 818);
  caption(s, "Homepage, Option C — Transgender Person selected, showing the three rows returned.", M, yEnd + 0.14, imgW);

  tradeoffs(s, M + imgW + 0.5, y0, CW - imgW - 0.5,
    ["One tap, no questions asked", "Returns portals, schemes and grievance routes", "Ends on Apply Now, on the card itself", "Puts the SAMAVESH promise on page one", "Compact: one strip and three rows"],
    ["Content must be remapped first — one-time work", "Needs space, unless it replaces Our Offerings", "Less precise than five questions, so pair with B"]);

  sourceLine(s, "Design file: Mode 1 Website / Homepage / Option C. Delivers recommendation R4 of the review.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 12 · Schemes page — A and B
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Decision 02 · The Schemes Page", "Welcome, or Compare", null);
  s.addText([
    { text: "The same data, two ways. ", options: { color: MUTE } },
    { text: "Option B is recommended", options: { color: NAVY, bold: true } },
    { text: ": this is where a decision gets made, and where officers and NGOs work.", options: { color: MUTE } },
  ], {
    x: M, y: 1.28, w: CW, h: 0.3, isTextBox: true, margin: 0, fontFace: B, fontSize: 13,
  });

  const colW = (CW - 0.5) / 2;
  const yImg = 1.96;
  const imgW = 5.4;
  // Option A
  s.addText("OPTION A · ILLUSTRATED PERSONA CARDS", {
    x: M, y: yImg - 0.3, w: colW, h: 0.24, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 10, bold: true, charSpacing: 1.1, color: MUTE,
  });
  const yA = shot(s, "scheme-optA-crop3.png", M, yImg, imgW, 1160 / 745);
  // Option B
  s.addText("OPTION B · FILTER PANEL AND COMPARISON TABLE", {
    x: M + colW + 0.5, y: yImg - 0.3, w: colW - 1.7, h: 0.24, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 10, bold: true, charSpacing: 1.1, color: BLUE_TEXT,
  });
  recommendedTag(s, M + CW - 1.5, yImg - 0.34);
  const yB = shot(s, "scheme-optB-crop.png", M + colW + 0.5, yImg, imgW, 1268 / 865);

  const yb = Math.max(yA, yB) + 0.16;
  s.addText([
    { text: "Strengths  ", options: { bold: true, color: BLUE_TEXT } },
    { text: "All nine groups visible at once · illustrations cross languages and literacy · cards feel welcoming, not administrative.\n", options: { color: INK } },
    { text: "Limitations  ", options: { bold: true, color: SAFF_TEXT } },
    { text: "Far fewer schemes fit on a screen · no room for who runs it, or central versus State · two schemes cannot be compared.", options: { color: INK } },
  ], {
    x: M, y: yb, w: colW, h: 1.0, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 11.5, lineSpacingMultiple: 1.18,
  });
  s.addText([
    { text: "Strengths  ", options: { bold: true, color: BLUE_TEXT } },
    { text: "Filters combine group, stage and need · shows jurisdiction · many more schemes visible and comparable · a count per filter warns of an empty result.\n", options: { color: INK } },
    { text: "Limitations  ", options: { bold: true, color: SAFF_TEXT } },
    { text: "A table reads as a record, not an invitation · uses the site's vocabulary · needs care on a small screen.", options: { color: INK } },
  ], {
    x: M + colW + 0.5, y: yb, w: colW, h: 1.0, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 11.5, lineSpacingMultiple: 1.18,
  });

  sourceLine(s, "Both screens cropped below the masthead and hero. Option A's illustrations can sit above Option B's panel if the Department wishes to keep them. Design file: Mode 1 Website / Scheme.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 13 · The chatbot
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Decision 03 · The Chatbot", "Samajik Sahayak — the Same Five Questions, in Chat",
    "Already built and reachable from every page. The decision is whether it carries the scheme branch, so the same five questions work in conversation.");

  const iw = 7.5;
  const yEnd = shot(s, "chatbot-3up.png", M, y0, iw, 1395 / 720);
  caption(s, "Three of the six states drawn: the opening, the branch for an organisation, and the answer with schemes to open. It states plainly that it cannot decide or change an application.", M, yEnd + 0.14, iw);

  tradeoffs(s, M + iw + 0.5, y0, CW - iw - 0.5,
    ["Reachable from every page, including dead ends", "One question per screen suits a mobile phone", "Works in Hindi without a second layout", "Already built; only the scheme branch is new"],
    ["A corner button is found only by those looking", "Covers the page on a small screen", "Harder to review with a screen reader"]);

  s.addText("The chatbot is a companion, not a substitute. It reaches the citizen who is already lost on a page; it does not replace a route from the homepage.", {
    x: M, y: PH - 1.0, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 12.5, bold: true, color: NAVY,
  });
  sourceLine(s, "Design file: Mode 2 Chatbot / Option A.");
}

journeySlide("after");   // slide 14

// ═══════════════════════════════════════════════════════════════════════════
// 15 · What this depends on
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Sequencing", "Phase 1 Is the Constraint",
    "The finder, the landings, the facets and the search are all views over one eligibility model. Building any surface before that model is populated reproduces the present failure exactly.");

  const phases = [
    ["Phase 0", "Stop the Bleeding", "2–3 weeks", "Low effort · medium impact", "Remove the Bootstrap placeholder from the footer, fix the two typos, return real 404 codes, restore the accessibility page, de-list the 24 empty scheme pages.", false],
    ["Phase 1", "Populate the Model", "4–8 weeks", "High effort · very high impact", "Define the eligibility schema and backfill all 141 records. Reconcile the seven flagship schemes missing from dosje. Rewrite the category and target-group vocabularies.", true],
    ["Phase 2", "Surfaces", "6–10 weeks", "Medium-high · very high impact", "Server-rendered faceted catalogue with linkable filters. Audience landings and the DEPwD signpost. Four verb calls to action on the homepage. Navigation restructure.", false],
    ["Phase 3", "Finder and Search", "6–8 weeks", "Medium effort · very high impact", "Find support for you, audited to WCAG 2.2 AA and tested with at least eight people from the actual constituencies, in Hindi and one other language. Search rebuilt on the model.", false],
    ["Phase 4", "Consolidation", "Ongoing", "Medium effort · high impact", "Publish the scheme API and register with myScheme. Redirect socialjustice.gov.in and retire the legacy site. Publishing template with mandatory fields, plus a quarterly sweep.", false],
  ];
  const cW = (CW - 4 * 0.22) / 5;
  phases.forEach((p, i) => {
    const x = M + i * (cW + 0.22);
    const on = p[5];
    s.addShape(pres.ShapeType.rect, {
      x, y: y0, w: cW, h: 3.66,
      fill: { color: on ? NAVY : SURF }, line: { color: on ? NAVY : HAIR, width: 0.75 },
    });
    s.addText(p[0].toUpperCase(), {
      x: x + 0.24, y: y0 + 0.26, w: cW - 0.48, h: 0.24, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 10, bold: true, charSpacing: 1.2, color: on ? SAFF_DK : MUTE,
    });
    s.addText(p[1], {
      x: x + 0.24, y: y0 + 0.54, w: cW - 0.48, h: 0.6, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 17, bold: true, color: on ? WHITE : NAVY,
    });
    s.addText(p[2], {
      x: x + 0.24, y: y0 + 1.16, w: cW - 0.48, h: 0.26, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12.5, bold: true, color: on ? BLUE_DK : NAVY,
    });
    s.addText(p[3], {
      x: x + 0.24, y: y0 + 1.44, w: cW - 0.48, h: 0.36, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 10.5, color: on ? NAVY_MUTE : MUTE, lineSpacingMultiple: 1.12,
    });
    s.addText(p[4], {
      x: x + 0.24, y: y0 + 1.9, w: cW - 0.48, h: 1.6, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 11, color: on ? NAVY_MUTE : INK, lineSpacingMultiple: 1.2,
    });
  });

  s.addText("Phase 1 is the one-time content work. It is what the schemes page, the finder, the landings and the chatbot all wait on — and it is the piece only the Department can do.", {
    x: M, y: y0 + 3.9, w: CW, h: 0.5, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 12.5, bold: true, color: NAVY, lineSpacingMultiple: 1.16,
  });
  sourceLine(s, "Source: §5, implementation roadmap. Durations are estimates from the review, not commitments.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 16 · What we are asking you to decide (dark)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(true);
  s.addText("WHAT WE ARE ASKING YOU TO DECIDE", {
    x: M, y: 0.82, w: CW, h: 0.26, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 10.5, bold: true, charSpacing: 1.3, color: NAVY_MUTE,
  });
  s.addText("The Decisions, and Who Takes Them", {
    x: M, y: 1.16, w: CW, h: 0.66, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 38, bold: true, color: WHITE,
  });

  const rows = [
    ["01", "The homepage surface", "Option B, the five-question finder", "Department of Social Justice & Empowerment"],
    ["02", "The schemes page surface", "Option B, the filter panel and table", "Department of Social Justice & Empowerment"],
    ["03", "Whether the chatbot carries the scheme branch", "Yes — it reuses the same five questions", "Department, with the existing chatbot vendor"],
  ];
  const rowY = 2.16, rowH = 0.94;
  s.addText([
    { text: "DECISION", options: { color: NAVY_MUTE } },
  ], { x: M + 0.86, y: rowY - 0.34, w: 4.2, h: 0.24, isTextBox: true, margin: 0, fontFace: B, fontSize: 9.5, bold: true, charSpacing: 1.1 });
  s.addText("OUR RECOMMENDATION", { x: M + 5.2, y: rowY - 0.34, w: 4.2, h: 0.24, isTextBox: true, margin: 0, fontFace: B, fontSize: 9.5, bold: true, charSpacing: 1.1, color: NAVY_MUTE });
  s.addText("WHO DECIDES", { x: M + 9.5, y: rowY - 0.34, w: 2.4, h: 0.24, isTextBox: true, margin: 0, fontFace: B, fontSize: 9.5, bold: true, charSpacing: 1.1, color: NAVY_MUTE });

  rows.forEach((r, i) => {
    const y = rowY + i * rowH;
    s.addShape(pres.ShapeType.line, { x: M, y: y - 0.08, w: CW, h: 0, line: { color: NAVY_CARD, width: 1 } });
    s.addText(r[0], {
      x: M, y: y + 0.12, w: 0.7, h: 0.44, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 26, bold: true, color: BLUE_DK,
    });
    s.addText(r[1], {
      x: M + 0.86, y: y + 0.16, w: 4.2, h: 0.56, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 14, color: NAVY_MUTE, lineSpacingMultiple: 1.12,
    });
    s.addText(r[2], {
      x: M + 5.2, y: y + 0.16, w: 4.2, h: 0.56, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 14, bold: true, color: BLUE_DK, lineSpacingMultiple: 1.12,
    });
    s.addText(r[3], {
      x: M + 9.5, y: y + 0.16, w: 2.4, h: 0.56, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12, color: NAVY_MUTE, lineSpacingMultiple: 1.12,
    });
  });
  s.addShape(pres.ShapeType.line, { x: M, y: rowY + 3 * rowH - 0.08, w: CW, h: 0, line: { color: NAVY_CARD, width: 1 } });

  s.addShape(pres.ShapeType.rect, {
    x: M, y: 5.24, w: CW, h: 1.3, fill: { color: NAVY_CARD }, line: { color: NAVY_CARD, width: 0 },
  });
  s.addText("And one instruction: authorise Phase 1.", {
    x: M + 0.42, y: 5.42, w: CW - 0.84, h: 0.4, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 22, bold: true, color: WHITE,
  });
  s.addText("Populating the eligibility model across all 141 records is the one-time content work every option above depends on. Whichever surfaces are chosen, this is the piece that has to start first, and only the Department can do it.", {
    x: M + 0.42, y: 5.86, w: CW - 0.84, h: 0.48, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 12.5, color: NAVY_MUTE, lineSpacingMultiple: 1.16,
  });
  s.addText("Decisions are sought before the Department's next review meeting.", {
    x: M, y: 6.72, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 11.5, color: NAVY_MUTE,
  });
  s.addNotes("If only one decision can be taken today, take the Phase 1 instruction. The three surface choices can follow; nothing can be built without the model.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 17 · Limits of this review
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Stated Limits", "What This Review Does Not Establish",
    "Set out so that the findings above are read for exactly what they are.");

  const limits = [
    ["No user research was conducted.",
      "The findings are grounded in analysis of the two live sites and in benchmarks against myScheme, DEPwD, the National Scholarship Portal and GOV.UK. The personas are derived from the constituencies named in the Department's own statutes, schemes and organisations — not from interviews. The recommendations should be validated with those constituencies before Phase 3 ships."],
    ["The content export is dated.",
      "The quantitative claims about the 141 scheme records come from an export generated 13 June 2026. Every claim about navigation, facets, persona pages and search behaviour was re-verified against the live sites on 20 August 2026."],
    ["The coverage figures are an order of magnitude, not a census.",
      "Persona coverage was measured by keyword classification over each record's title and body. This over-counts — a scheme that merely mentions a group is counted — which means the gaps shown on slides 3 and 4 are, if anything, understated."],
  ];
  let y = y0;
  limits.forEach((l, i) => {
    s.addText(String(i + 1).padStart(2, "0"), {
      x: M, y: y + 0.02, w: 0.7, h: 0.44, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 26, bold: true, color: SAFF_TEXT,
    });
    s.addText(l[0], {
      x: M + 0.86, y: y, w: CW - 0.86, h: 0.32, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 15, bold: true, color: NAVY,
    });
    s.addText(l[1], {
      x: M + 0.86, y: y + 0.36, w: CW - 0.86, h: 0.92, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12.5, color: INK, lineSpacingMultiple: 1.24,
    });
    y += 1.56;
    if (i < limits.length - 1) {
      s.addShape(pres.ShapeType.line, { x: M, y: y - 0.24, w: CW, h: 0, line: { color: HAIR, width: 0.75 } });
    }
  });

  sourceLine(s, "Source: §0, scope, method and limits.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 18 · Sources
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Sources", "What Was Read, and When", null);

  const srcs = [
    ["The two Ministry sites", "dosje.gov.in (SAMAVESH, marked BETA) and socialjustice.gov.in — homepages, schemes catalogue, a persona page, and two site searches, fetched and parsed 20 August 2026."],
    ["The Department's own content export", "apps/hub/src/content/website — 141 scheme records, 175 organisation pages, 1,624 documents, 305 tenders, 137 vacancies. Manifest generated 13 June 2026."],
    ["Benchmarks", "myscheme.gov.in · depwd.gov.in · scholarships.gov.in · GOV.UK, cited as a design standard rather than a peer institution."],
    ["Standards", "GIGW 3.0, DBIM 3.0 and WCAG 2.2 AA. GIGW 3.0 mandatory checkpoint 21 requires API integration with MyScheme; there is no evidence of it today."],
    ["The design file", "MoSJE (WIP) — Service Discovery. Every screen in this deck is taken from it unaltered, cropped only where noted."],
  ];
  let y = y0 + 0.2;
  srcs.forEach((r, i) => {
    s.addText(r[0], {
      x: M, y, w: 3.5, h: 0.5, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 13.5, bold: true, color: NAVY, lineSpacingMultiple: 1.1,
    });
    s.addText(r[1], {
      x: M + 3.7, y, w: CW - 3.7, h: 0.66, isTextBox: true, margin: 0,
      fontFace: B, fontSize: 12.5, color: INK, lineSpacingMultiple: 1.22,
    });
    y += 0.94;
    if (i < srcs.length - 1) {
      s.addShape(pres.ShapeType.line, { x: M, y: y - 0.2, w: CW, h: 0, line: { color: HAIR, width: 0.75 } });
    }
  });

  s.addText("Finding What You're Entitled To — an information-architecture and discoverability review. MoSJE Design Research, 20 August 2026.", {
    x: M, y: PH - 0.86, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: B, fontSize: 11, color: MUTE,
  });
}

pres.writeFile({ fileName: "MoSJE-Persona-Scheme-Discovery.pptx" })
  .then((f) => console.log("wrote", f));
