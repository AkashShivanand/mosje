/**
 * Persona / Service Discovery decision deck — Department of Social Justice & Empowerment.
 * One slide per option, each fully documented, so a decision can be taken from the slide alone.
 * Noto Sans throughout. Every colour is a resolved SAMAVESH token (packages/tokens/dist/tokens.css).
 * Source of every figure: docs/research/website-ia-persona-discoverability-2026-08.md
 */
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.defineLayout({ name: "MOSJE", width: 13.333, height: 7.5 });
pres.layout = "MOSJE";
pres.author = "MoSJE Design Research";
pres.title = "Finding What You Are Entitled To";

// ── SAMAVESH tokens ────────────────────────────────────────────────────────
const BLUE      = "0373DF"; // --sa-color-primaryScale-500
const BLUE_TXT  = "005EB9"; // --sa-color-primaryScale-600  · 6.36:1 on white
const BLUE_DEEP = "004B96"; // --sa-color-primaryScale-700
const DARK      = "003975"; // --sa-color-primaryScale-800  · the dark ground
const BLUE_100  = "C0DBFF"; // --sa-color-primaryScale-100  · 8.04:1 on dark
const BLUE_200  = "92C2FF"; // --sa-color-primaryScale-200  · 6.18:1 on dark
const BLUE_50   = "ECF4FF"; // --sa-color-primaryScale-50
const SAFF_TXT  = "A43A00"; // --sa-color-brand-saffronDark · 6.60:1 on white
const CAT1      = "0373DF"; // --sa-chart-cat-1
const CAT2      = "E7173A"; // --sa-chart-cat-2
const INK       = "1E2124"; // --sa-color-text-default
const INK_MUTE  = "3A3D41"; // --sa-color-text-muted
const MUTE      = "54585E"; // --sa-ref-color-neutral-600   · clears AA on tinted grounds
const SURF      = "EEF0F3"; // --sa-ref-color-neutral-50
const HAIR      = "DCDEE1"; // --sa-ref-color-neutral-100
const WHITE     = "FFFFFF";

const F = "Noto Sans";
const W = 13.333, PH = 7.5, M = 0.72, CW = W - M * 2;
const A = (f) => `assets/${f}`;

function slide(dark) {
  const s = pres.addSlide();
  s.background = { color: dark ? DARK : WHITE };
  return s;
}

function header(s, eyebrow, title, standfirst) {
  s.addText(eyebrow.toUpperCase(), {
    x: M, y: 0.44, w: CW, h: 0.22, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10, bold: true, charSpacing: 1.2, color: MUTE,
  });
  s.addText(title, {
    x: M, y: 0.68, w: CW, h: 0.46, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 26, bold: true, color: DARK,
  });
  if (!standfirst) return 1.26;
  s.addText(standfirst, {
    x: M, y: 1.18, w: CW * 0.92, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 12, color: INK_MUTE,
  });
  return 1.62;
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

function pill(s, x, y, label, fill, textColor) {
  const w = 0.076 * label.length + 0.3;
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h: 0.26, rectRadius: 0.13, fill: { color: fill }, line: { color: fill, width: 0 },
  });
  s.addText(label, {
    x, y, w, h: 0.26, isTextBox: true, margin: 0, align: "center", valign: "middle",
    fontFace: F, fontSize: 8.5, bold: true, charSpacing: 0.8, color: textColor,
  });
  return w;
}

function sourceLine(s, text) {
  s.addText(text, {
    x: M, y: PH - 0.48, w: CW, h: 0.24, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 9, color: MUTE,
  });
}

/** A labelled block in the option record. Returns the y the next block starts at. */
function field(s, x, y, w, label, body, labelColor) {
  s.addText(label.toUpperCase(), {
    x, y, w, h: 0.18, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 8.5, bold: true, charSpacing: 1, color: labelColor || MUTE,
  });
  const lines = body.reduce((n, t) => n + Math.max(1, Math.ceil(t.length / Math.floor((w * 72) / (9.5 * 0.5)))), 0);
  const h = lines * 0.166 + body.length * 0.03 + 0.04;
  s.addText(body.map((t, i) => ({
    text: (body.length > 1 ? "·  " : "") + t,
    options: { breakLine: i < body.length - 1 },
  })), {
    x, y: y + 0.18, w, h, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 9.5, color: INK, lineSpacingMultiple: 1.16,
  });
  return y + 0.18 + h + 0.1;
}

/**
 * One option, one slide, fully documented — so the reader never has to hold
 * two slides in their head to compare.
 */
function optionSlide(o) {
  const s = slide(false);
  header(s, `Decision ${o.decision} of 3 · ${o.surface}`, o.title, null);

  // status and recommendation, side by side under the title
  let px = M;
  px += pill(s, px, 1.2, o.live ? "ON THE SITE TODAY" : "TO BE BUILT",
             o.live ? SURF : BLUE_50, o.live ? MUTE : BLUE_TXT) + 0.14;
  if (o.recommended) pill(s, px, 1.2, "RECOMMENDED", BLUE_TXT, WHITE);

  const y0 = 1.66;
  const imgW = 6.6;
  shot(s, o.img, M, y0, imgW, o.ratio);
  s.addText(o.caption, {
    x: M, y: y0 + imgW / o.ratio + 0.14, w: imgW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 9, color: MUTE, lineSpacingMultiple: 1.1,
  });

  const rx = M + imgW + 0.5, rw = CW - imgW - 0.5;
  let y = y0;
  y = field(s, rx, y, rw, "What it is", [o.what]);
  y = field(s, rx, y, rw, "What a citizen does", [o.does]);
  y = field(s, rx, y, rw, "Advantages", o.pros, BLUE_TXT);
  y = field(s, rx, y, rw, "Limitations", o.cons, SAFF_TXT);
  y = field(s, rx, y, rw, "What the Department must do first", [o.needs]);

  const vy = 6.22;                       // fixed: the verdict always sits on the same line
  if (y > vy) throw new Error(`option record overflows the verdict box on "${o.title}" (${y.toFixed(2)} > ${vy})`);
  s.addShape(pres.ShapeType.rect, {
    x: rx, y: vy, w: rw, h: 0.72,
    fill: { color: o.recommended ? BLUE_50 : SURF },
    line: { color: o.recommended ? BLUE : HAIR, width: o.recommended ? 1.25 : 0.75 },
  });
  s.addText("OUR VIEW", {
    x: rx + 0.16, y: vy + 0.1, w: rw - 0.32, h: 0.18, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 8.5, bold: true, charSpacing: 1, color: MUTE,
  });
  s.addText(o.view, {
    x: rx + 0.16, y: vy + 0.3, w: rw - 0.32, h: 0.38, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10, bold: true, color: DARK, lineSpacingMultiple: 1.14,
  });

  sourceLine(s, o.source);
  return s;
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

  s.addText("Helping a Citizen Find\nWhat They Are Entitled To", {
    x: M, y: 2.4, w: 8.4, h: 1.7, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 38, bold: true, color: WHITE, lineSpacingMultiple: 1.08,
  });
  s.addText("Six options for the Department to consider, on three parts of the website", {
    x: M, y: 4.22, w: 9.3, h: 0.36, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 15, color: BLUE_100,
  });

  s.addText("141", {
    x: 10.2, y: 2.5, w: 2.4, h: 1.05, isTextBox: true, margin: 0, align: "right",
    fontFace: F, fontSize: 54, bold: true, color: BLUE_200,
  });
  s.addText("schemes published\nby the Department", {
    x: 10.2, y: 3.6, w: 2.4, h: 0.56, isTextBox: true, margin: 0, align: "right",
    fontFace: F, fontSize: 11, color: BLUE_100, lineSpacingMultiple: 1.18,
  });

  s.addShape(pres.ShapeType.line, { x: M, y: 5.4, w: CW, h: 0, line: { color: BLUE_DEEP, width: 1 } });
  s.addText("A review of how people find schemes on dosje.gov.in and socialjustice.gov.in", {
    x: M, y: 5.66, w: 8.8, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 12.5, color: WHITE,
  });
  s.addText("Site checked on 20 August 2026 · Scheme records as on 13 June 2026 · MoSJE Design Research", {
    x: M, y: 5.98, w: 8.8, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11, color: BLUE_100,
  });
  s.addText("Sent with the design file\nMoSJE (WIP) — Service Discovery", {
    x: 9.6, y: 5.66, w: 3.0, h: 0.6, isTextBox: true, margin: 0, align: "right",
    fontFace: F, fontSize: 11, color: BLUE_100, lineSpacingMultiple: 1.18,
  });
  s.addNotes("This is sent before the meeting, so it has to be readable on its own. Three decisions are sought. Six options are placed, one to a page.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 2 · Why this is being looked at
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "The Reason for This Review", "Why a Citizen Cannot Find a Scheme Today",
    "The Schemes page has a Target Group filter. For each group the Department serves, this shows how many schemes are meant for them, and how many the filter can actually find.");

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
    { name: "Schemes meant for them", labels, values: rows.map((r) => r[1]) },
    { name: "Schemes the filter can find", labels, values: rows.map((r) => r[2]) },
  ], {
    x: M, y: y0, w: chartW, h: 4.68,
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
    ["32", "5", "Scheduled Castes", "The Department's largest group. None of the five results is a scholarship."],
    ["23", "0", "Women and Girls", "Twenty-three schemes are meant for them. The filter finds none of them."],
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
    x: bx, y: y0 + 3.12, w: bw, h: 1.56, fill: { color: DARK }, line: { color: DARK, width: 0 },
  });
  s.addText("The filter works. The information behind it was never filled in.", {
    x: bx + 0.24, y: y0 + 3.3, w: bw - 0.48, h: 0.84, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 14.5, bold: true, color: WHITE, lineSpacingMultiple: 1.14,
  });
  s.addText("Only 2 of the 141 scheme records name more than one group; 27 name none at all.", {
    x: bx + 0.24, y: y0 + 4.18, w: bw - 0.48, h: 0.4, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10, color: BLUE_100, lineSpacingMultiple: 1.16,
  });

  sourceLine(s, "Source: §1.3 of the review. Scheme records as on 13 June 2026; site behaviour checked on 20 August 2026. The counting method is generous, so the shortfall is at least this large.");
  s.addNotes("The two red bars that reach zero are the point. Everything after this page follows from it.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 3 · What is being asked
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(true);
  s.addText("WHAT IS BEING PLACED BEFORE YOU", {
    x: M, y: 0.8, w: CW, h: 0.24, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10, bold: true, charSpacing: 1.3, color: BLUE_100,
  });
  s.addText("Three Decisions. Six Options.", {
    x: M, y: 1.1, w: CW, h: 0.6, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: WHITE,
  });
  s.addText("Each option is placed on a page of its own, with what it is, what a citizen does, what is in its favour, what is against it, and what the Department would have to do first. The three parts are decided separately.", {
    x: M, y: 1.82, w: 10.4, h: 0.6, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 13, color: BLUE_100, lineSpacingMultiple: 1.2,
  });

  const cards = [
    ["1", "The Home Page", "Three options", "Where most people arrive for the first time.",
      ["A · Explore User Personas — on the site today", "B · Find Schemes for You — five questions", "C · Find Offerings for You — one tap"]],
    ["2", "The Schemes Page", "Two options", "Where a person decides, and where officers and voluntary organisations work.",
      ["A · Pictures of the nine groups, with cards", "B · Filter panel with a table of schemes"]],
    ["3", "The Chatbot", "One option", "Reachable from every page, including pages that lead nowhere else.",
      ["A · Samajik Sahayak — the same five questions, in chat"]],
  ];
  const cardW = (CW - 0.64) / 3;
  cards.forEach((c, i) => {
    const x = M + i * (cardW + 0.32);
    s.addShape(pres.ShapeType.rect, {
      x, y: 2.72, w: cardW, h: 3.5, fill: { color: BLUE_DEEP }, line: { color: BLUE_DEEP, width: 0 },
    });
    s.addText(c[0], {
      x: x + 0.32, y: 2.94, w: cardW - 0.64, h: 0.66, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 40, bold: true, color: BLUE_200,
    });
    s.addText(c[1], {
      x: x + 0.32, y: 3.66, w: cardW - 0.64, h: 0.32, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 18, bold: true, color: WHITE,
    });
    s.addText(c[2].toUpperCase(), {
      x: x + 0.32, y: 4.02, w: cardW - 0.64, h: 0.22, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9, bold: true, charSpacing: 1.1, color: BLUE_200,
    });
    s.addText(c[3], {
      x: x + 0.32, y: 4.3, w: cardW - 0.64, h: 0.6, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 10.5, color: BLUE_100, lineSpacingMultiple: 1.18,
    });
    s.addText(c[4].map((t, k) => ({ text: t, options: { breakLine: k < c[4].length - 1 } })), {
      x: x + 0.32, y: 4.96, w: cardW - 0.64, h: 1.1, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 10, color: WHITE, lineSpacingMultiple: 1.2,
    });
  });

  s.addText("Whichever options are chosen, the scheme records have to be tagged first. That work is set out on the page headed “What Has to Be Done First”.", {
    x: M, y: 6.46, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11, color: BLUE_100,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// 4–9 · One option, one page
// ═══════════════════════════════════════════════════════════════════════════
const OPTIONS = [
  {
    decision: 1, surface: "The Home Page · Option A of 3",
    title: "Explore User Personas",
    img: "home-optA.png", ratio: 1440 / 632, live: true, recommended: false,
    caption: "The persona panel as it appears on the home page today, beside Recent Documents.",
    what: "A picture of one kind of person at a time, with arrows to move between them.",
    does: "Looks at the pictures, sees one that matches them, and taps through to the Schemes page.",
    pros: [
      "Already on the page, so no extra space is needed",
      "Pictures help people who read slowly, or read another language",
      "Recognising yourself is easier than describing yourself",
    ],
    cons: [
      "Only one group is shown at a time, behind arrows",
      "Sorts by group alone — not by age, need or State",
      "Today, choosing a group does not filter the Schemes page",
    ],
    needs: "Make the choice actually open the Schemes page already filtered. Until that is done, the panel leads nowhere useful.",
    view: "Not recommended on its own. Keep it only if it is made to filter.",
    source: "Design file: MoSJE (WIP) — Service Discovery, Mode 1 Website / Home page / Option A.",
  },
  {
    decision: 1, surface: "The Home Page · Option B of 3",
    title: "Find Schemes for You",
    img: "home-optB-question.png", ratio: 1440 / 804, live: false, recommended: true,
    caption: "Question 2 of 5. The number of schemes still matching is shown in the corner throughout.",
    what: "Five short questions, any of which may be skipped. Skipping widens the answer instead of stopping it.",
    does: "Answers up to five questions — who it is for, community, stage of life, kind of help and State — and is shown the schemes that fit, each with a place to apply.",
    pros: [
      "Narrows 141 schemes down to the few that fit",
      "Reads stage of life, need and State, not only community",
      "No sign-in and no Aadhaar; nothing is stored",
      "A running count shows the citizen it is working as they answer",
      "Ends at a place to apply, not at a page of text",
    ],
    cons: [
      "The scheme records must be tagged before it can work",
      "Needs space on the home page, unless it replaces Our Offerings",
      "The wording for caste categories needs Ministry approval",
    ],
    needs: "Tag all 141 scheme records — the same work every other option needs. Agree the wording for the community question.",
    view: "Recommended for the home page. It answers the question a citizen actually has.",
    source: "Design file: Mode 1 Website / Home page / Option B. This is recommendation R3 of the review.",
  },
  {
    decision: 1, surface: "The Home Page · Option C of 3",
    title: "Find Offerings for You",
    img: "home-optC.png", ratio: 1440 / 818, live: false, recommended: false,
    caption: "Home page, Option C — Transgender Person selected, showing the three rows returned.",
    what: "A row of groups. Tapping one shows the portal, the scheme and the complaint route for that group.",
    does: "Taps the group that describes them and sees three things they can act on at once, without answering anything.",
    pros: [
      "One tap, with no questions to answer",
      "Shows portals, schemes and complaint routes together",
      "Each row ends at Apply Now, on the card itself",
      "Puts the single-window promise on the home page itself",
      "Compact — one strip and three rows",
    ],
    cons: [
      "The scheme records must be tagged before it can work",
      "Needs space on the home page, unless it replaces Our Offerings",
      "Less exact than five questions, because it reads group alone",
    ],
    needs: "Tag all 141 scheme records, and decide the three items shown for each group.",
    view: "A good companion to Option B for people who will not answer questions. Not a replacement for it.",
    source: "Design file: Mode 1 Website / Home page / Option C. This is recommendation R4 of the review.",
  },
  {
    decision: 2, surface: "The Schemes Page · Option A of 2",
    title: "Pictures of the Nine Groups, with Cards",
    img: "scheme-optA-crop3.png", ratio: 1160 / 745, live: false, recommended: false,
    caption: "Cropped below the masthead and hero, and below the second row of cards.",
    what: "A row of pictures for the nine groups, above cards for each scheme.",
    does: "Picks their group from the pictures, then reads the scheme cards below.",
    pros: [
      "All nine groups are visible at once, without arrows",
      "Pictures work across languages and reading levels",
      "Cards feel welcoming rather than administrative",
    ],
    cons: [
      "Far fewer schemes fit on one screen",
      "No room to show who runs the scheme, or whether it is Central or State",
      "Two schemes cannot be compared side by side",
      "Nine illustrations to draw and to keep up to date",
    ],
    needs: "Tag all 141 scheme records, and commission nine illustrations.",
    view: "Not recommended for this page. The pictures are welcoming, but this is the page where people compare.",
    source: "Design file: Mode 1 Website / Scheme / Option A.",
  },
  {
    decision: 2, surface: "The Schemes Page · Option B of 2",
    title: "Filter Panel with a Table of Schemes",
    img: "scheme-optB-crop.png", ratio: 1268 / 865, live: false, recommended: true,
    caption: "Cropped below the masthead and hero. Two groups ticked, showing 19 schemes.",
    what: "Filters on the left; a table on the right showing what a person gets, who runs it, and whether it is Central or State.",
    does: "Ticks the groups that apply to them, and reads the schemes side by side to see which one to apply for.",
    pros: [
      "Filters combine — group, stage of life and need can be ticked together",
      "Shows who runs each scheme, and whether it is Central or State",
      "Many more schemes are visible, and can be compared",
      "A count beside each filter warns before an empty result",
    ],
    cons: [
      "A table reads as a record rather than an invitation",
      "Asks the citizen to use the site's own words",
      "Needs more care on a small screen",
    ],
    needs: "Tag all 141 scheme records, including who runs each one and whether it is Central or State.",
    view: "Recommended for the Schemes page. Option A's pictures can sit above this panel if the Department wishes to keep them.",
    source: "Design file: Mode 1 Website / Scheme / Option B. This is recommendation R5 of the review.",
  },
  {
    decision: 3, surface: "The Chatbot · Option A of 1",
    title: "Samajik Sahayak — the Same Five Questions, in Chat",
    img: "chatbot-3up.png", ratio: 1395 / 720, live: true, recommended: true,
    caption: "Three of the six states drawn: the opening, the branch for an organisation, and the answer with schemes to open.",
    what: "The same five questions, asked one at a time in a chat window that is already built and reachable from every page.",
    does: "Opens the chat from whichever page they are on, answers the questions on their phone, and is given schemes to open.",
    pros: [
      "Reachable from every page, including pages that lead nowhere else",
      "One question per screen suits a mobile phone",
      "Works in Hindi without a second design",
      "Already built — only the scheme branch is new",
      "States plainly that it cannot decide or change an application",
    ],
    cons: [
      "A button in the corner is found only by those looking for it",
      "It covers the page on a small screen",
      "Harder to use with a screen reader",
    ],
    needs: "Tag all 141 scheme records, and ask the existing chatbot vendor to add the scheme branch.",
    view: "Recommended, alongside whichever home page option is chosen. It reaches the person who is already lost on a page.",
    source: "Design file: Mode 2 Chatbot / Option A.",
  },
];
OPTIONS.forEach(optionSlide);

// ═══════════════════════════════════════════════════════════════════════════
// 10 · What has to be done first
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "Sequencing", "What Has to Be Done First",
    "Every option above reads the same information about each scheme. Until that information is filled in, none of them can work — which is why the tagging comes before the design.");

  const phases = [
    ["Stage 0", "Correcting What Is Wrong", "2–3 weeks", "Small effort · useful",
      "Remove the leftover control in the footer, correct the two spelling errors, make missing pages return a proper error, restore the accessibility page, and take down the 24 empty scheme pages.", false],
    ["Stage 1", "Filling In the Information", "4–8 weeks", "Large effort · essential",
      "Decide what is recorded about each scheme, and fill it in for all 141. Add the seven major schemes that are missing from dosje.gov.in. Rewrite the list of categories and groups.", true],
    ["Stage 2", "Rebuilding the Pages", "6–10 weeks", "Sizeable effort · large gain",
      "The Schemes page with working filters and shareable links. Pages for each group. Four plain actions on the home page. A simpler main menu.", false],
    ["Stage 3", "The Questions and the Search", "6–8 weeks", "Moderate effort · large gain",
      "Build Find Schemes for You, check it against accessibility standards, and test it with at least eight people from the groups it serves, in Hindi and one other language.", false],
    ["Stage 4", "Bringing the Two Sites Together", "Ongoing", "Moderate effort · steady gain",
      "Publish the scheme information for myScheme. Move socialjustice.gov.in on to dosje.gov.in and close the older site. Make the fields compulsory when a scheme is added.", false],
  ];
  const cW = (CW - 4 * 0.22) / 5;
  phases.forEach((p, i) => {
    const x = M + i * (cW + 0.22);
    const on = p[5];
    s.addShape(pres.ShapeType.rect, {
      x, y: y0, w: cW, h: 4.12,
      fill: { color: on ? DARK : SURF }, line: { color: on ? DARK : HAIR, width: 0.75 },
    });
    s.addText(p[0].toUpperCase(), {
      x: x + 0.22, y: y0 + 0.24, w: cW - 0.44, h: 0.22, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.1, color: on ? BLUE_200 : MUTE,
    });
    s.addText(p[1], {
      x: x + 0.22, y: y0 + 0.5, w: cW - 0.44, h: 0.64, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 14, bold: true, color: on ? WHITE : DARK, lineSpacingMultiple: 1.08,
    });
    s.addText(p[2], {
      x: x + 0.22, y: y0 + 1.2, w: cW - 0.44, h: 0.24, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11.5, bold: true, color: on ? BLUE_200 : BLUE_TXT,
    });
    s.addText(p[3], {
      x: x + 0.22, y: y0 + 1.48, w: cW - 0.44, h: 0.34, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9.5, color: on ? BLUE_100 : MUTE, lineSpacingMultiple: 1.12,
    });
    s.addText(p[4], {
      x: x + 0.22, y: y0 + 1.9, w: cW - 0.44, h: 2.0, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 10, color: on ? BLUE_100 : INK, lineSpacingMultiple: 1.2,
    });
  });

  s.addText("Stage 1 is the one piece only the Department can do. The Schemes page, the questions, the group pages and the chatbot all wait on it.", {
    x: M, y: y0 + 4.34, w: CW, h: 0.3, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11.5, bold: true, color: DARK,
  });
  sourceLine(s, "Source: §5 of the review. The times shown are estimates, not commitments.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 11 · Decisions required
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(true);
  s.addText("FOR YOUR DECISION", {
    x: M, y: 0.72, w: CW, h: 0.24, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10, bold: true, charSpacing: 1.3, color: BLUE_100,
  });
  s.addText("Decisions Required", {
    x: M, y: 1.02, w: CW, h: 0.6, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 32, bold: true, color: WHITE,
  });

  const rows = [
    ["1", "Which option for the home page", "Option B — Find Schemes for You", "Department of Social Justice & Empowerment"],
    ["2", "Which option for the Schemes page", "Option B — filter panel with a table", "Department of Social Justice & Empowerment"],
    ["3", "Whether the chatbot asks the same questions", "Yes — it is already built", "Department, with the existing chatbot vendor"],
  ];
  const rowY = 2.14, rowH = 0.9;
  [["THE DECISION", M + 0.7, 4.4], ["WHAT WE SUGGEST", M + 5.2, 4.2], ["WHO DECIDES", M + 9.5, 2.4]].forEach((c) => {
    s.addText(c[0], { x: c[1], y: rowY - 0.32, w: c[2], h: 0.22, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 9, bold: true, charSpacing: 1.1, color: BLUE_200 });
  });
  rows.forEach((r, i) => {
    const y = rowY + i * rowH;
    s.addShape(pres.ShapeType.line, { x: M, y: y - 0.08, w: CW, h: 0, line: { color: BLUE_DEEP, width: 1 } });
    s.addText(r[0], { x: M, y: y + 0.12, w: 0.6, h: 0.4, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 21, bold: true, color: BLUE_200 });
    s.addText(r[1], { x: M + 0.7, y: y + 0.14, w: 4.4, h: 0.56, isTextBox: true, margin: 0,
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
  s.addText("And one approval sought: to begin Stage 1.", {
    x: M + 0.34, y: 5.3, w: CW - 0.68, h: 0.38, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 19, bold: true, color: WHITE,
  });
  s.addText("Filling in the information for all 141 schemes is the one piece of work every option above depends on. Whichever options are chosen, this has to begin first, and only the Department can do it.", {
    x: M + 0.34, y: 5.74, w: CW - 0.68, h: 0.46, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 11.5, color: BLUE_100, lineSpacingMultiple: 1.16,
  });
  s.addText("Orders are sought before the Department's next review meeting.", {
    x: M, y: 6.56, w: CW, h: 0.28, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 10.5, color: BLUE_100,
  });
  s.addNotes("If only one thing can be decided today, let it be Stage 1. The three choices can follow; nothing can be built before the information is filled in.");
}

// ═══════════════════════════════════════════════════════════════════════════
// 12 · Limits and sources
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = slide(false);
  const y0 = header(s, "For the Record", "What This Review Does Not Establish", null);

  const limits = [
    ["No citizens were interviewed.",
      "The findings come from examining the two websites and comparing them with myScheme, the disability department's site, the National Scholarship Portal and GOV.UK. The groups described are taken from the Department's own Acts, schemes and organisations, not from interviews. Before Stage 3 is built, the questions should be tested with people from those groups."],
    ["The scheme records are dated, and the counts are approximate.",
      "The counts of 141 schemes come from records as on 13 June 2026. Everything said about the menus, the filters and the search was checked on the live sites on 20 August 2026. Schemes were matched to groups by looking for words in the title and text, which counts generously — so the shortfall shown is at least as large as stated, and probably larger."],
  ];
  let y = y0 + 0.18;
  limits.forEach((l, i) => {
    s.addText(String(i + 1), {
      x: M, y: y + 0.02, w: 0.5, h: 0.4, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 21, bold: true, color: SAFF_TXT,
    });
    s.addText(l[0], {
      x: M + 0.6, y, w: CW - 0.6, h: 0.3, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 14, bold: true, color: DARK,
    });
    s.addText(l[1], {
      x: M + 0.6, y: y + 0.32, w: CW - 0.6, h: 0.9, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 11.5, color: INK, lineSpacingMultiple: 1.24,
    });
    y += 1.5;
    s.addShape(pres.ShapeType.line, { x: M, y: y - 0.2, w: CW, h: 0, line: { color: HAIR, width: 0.75 } });
  });

  s.addText("WHAT WAS EXAMINED", {
    x: M, y: y + 0.04, w: CW, h: 0.22, isTextBox: true, margin: 0,
    fontFace: F, fontSize: 9.5, bold: true, charSpacing: 1.2, color: MUTE,
  });
  const srcs = [
    ["The two Ministry websites", "dosje.gov.in, marked BETA, and socialjustice.gov.in — read on 20 August 2026."],
    ["The Department's scheme records", "141 schemes, 175 organisation pages, 1,624 documents, 305 tenders, 137 vacancies, as on 13 June 2026."],
    ["Other government websites", "myscheme.gov.in · depwd.gov.in · scholarships.gov.in · GOV.UK, for comparison."],
    ["Standards applied", "GIGW 3.0, DBIM 3.0 and WCAG 2.2 AA."],
    ["The design file", "MoSJE (WIP) — Service Discovery. Every screen shown here is taken from it, cropped only where noted."],
  ];
  let sy = y + 0.3;
  srcs.forEach((r) => {
    s.addText(r[0], { x: M, y: sy, w: 3.4, h: 0.26, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 10.5, bold: true, color: BLUE_TXT });
    s.addText(r[1], { x: M + 3.6, y: sy, w: CW - 3.6, h: 0.26, isTextBox: true, margin: 0,
      fontFace: F, fontSize: 10.5, color: INK });
    sy += 0.36;
  });

  sourceLine(s, "Finding What You Are Entitled To — a review of how people find schemes on the Department's websites. MoSJE Design Research, 20 August 2026.");
}

pres.writeFile({ fileName: "MoSJE-Persona-Scheme-Discovery.pptx" })
  .then((f) => console.log("wrote", f));
