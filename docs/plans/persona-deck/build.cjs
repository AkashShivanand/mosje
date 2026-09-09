/**
 * Service Discovery — options placed before the Department. Revised after the
 * 8 September 2026 review: no scheme count anywhere, one thought behind every
 * option (persona × offering), two questions instead of five, and the deck in
 * the order the review asked for — concept, home page, Schemes page, assistant.
 *
 * Noto Sans throughout. Every colour is a resolved SAMAVESH token. Nothing on a
 * slide is a figure the Department's own Annual Report 2025-26, its Demand for
 * Grants 2026-27 or the PIB Year-End Review 2025 does not state.
 */
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const b64 = f => "image/png;base64," + fs.readFileSync(f).toString("base64");

const pres = new pptxgen();
pres.defineLayout({ name: "MOSJE", width: 13.333, height: 7.5 });
pres.layout = "MOSJE";
pres.author = "MoSJE Design Research";
pres.title = "How Citizens Find Schemes";

const BLUE="0373DF", BLUE_TXT="005EB9", BLUE_DEEP="004B96", DARK="003975";
const BLUE_100="C0DBFF", BLUE_200="92C2FF", BLUE_50="ECF4FF";
const SAFF_TXT="A43A00", INK="1E2124", INK_MUTE="3A3D41", MUTE="54585E";
const SURF="EEF0F3", HAIR="DCDEE1", WHITE="FFFFFF";
const F = "Noto Sans";
const W=13.333, PH=7.5, M=0.72, CW=W-M*2;
const A = f => `assets/${f}`;

/** Width and height of a PNG, read from its IHDR chunk. */
function imageSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

/* One type scale for the whole deck. Every step is a real jump, so a reader can
   tell a label from a body line at a glance. Tracking is in points. */
const T = { display:40, h1:27, h2:17, lead:12.5, body:10, label:9, caption:8.5, micro:8 };
const TRACK = { eyebrow:0.8, label:0.6, pill:0.5 };

const slide = dark => { const s = pres.addSlide(); s.background = { color: dark?DARK:WHITE }; return s; };

function header(s, eyebrow, title, lede) {
  s.addText(eyebrow.toUpperCase(), { x:M, y:0.42, w:CW, h:0.22, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.eyebrow, color:MUTE });
  s.addText(title, { x:M, y:0.68, w:CW, h:0.48, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.h1, bold:true, color:DARK });
  if (!lede) return 1.28;
  s.addText(lede, { x:M, y:1.20, w:CW*0.92, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.lead, color:INK_MUTE });
  return 1.66;
}
function pill(s, x, y, label, fill, txt) {
  const w = 0.072*label.length + 0.32;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h:0.26, rectRadius:0.13,
    fill:{color:fill}, line:{color:fill, width:0} });
  s.addText(label, { x, y, w, h:0.26, isTextBox:true, margin:0, align:"center", valign:"middle",
    fontFace:F, fontSize:T.micro, bold:true, charSpacing:TRACK.pill, color:txt });
  return w;
}
const sourceLine = (s, t) => s.addText(t, { x:M, y:PH-0.46, w:CW, h:0.24, isTextBox:true, margin:0,
  fontFace:F, fontSize:T.micro, color:MUTE });

/** A labelled block in the option record. Returns the y the next block starts at. */
function field(s, x, y, w, label, body, labelColor) {
  s.addText(label.toUpperCase(), { x, y, w, h:0.19, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.label, color:labelColor||MUTE });
  const cpl = Math.floor((w*72)/(T.body*0.5));
  const lines = body.reduce((n,t)=>n+Math.max(1,Math.ceil(t.length/cpl)),0);
  const h = lines*0.175 + body.length*0.035 + 0.04;
  const runs = [];
  body.forEach((t,i)=>{
    if (body.length>1) runs.push({ text:"·  ", options:{ color:labelColor||MUTE, bold:true } });
    runs.push({ text:t, options:{ breakLine:i<body.length-1 } });
  });
  s.addText(runs, { x, y:y+0.21, w, h, isTextBox:true, margin:0, fontFace:F,
    fontSize:T.body, color:INK, lineSpacingMultiple:1.2 });
  return y+0.21+h+0.17;
}

/** A still or a playable recording, fitted inside a box, top-aligned. */
function media(s, o, x, y, boxW, boxH) {
  const src = o.vid ? A(`video/${o.vid}.png`) : A(`still/${o.img}.png`);
  const im = imageSize(src);
  const sc = Math.min(boxW/im.w, boxH/im.h);
  const iw = im.w*sc, ih = im.h*sc;
  const ix = x + (boxW-iw)/2, iy = y;
  s.addShape(pres.ShapeType.rect, { x:ix-0.03, y:iy-0.03, w:iw+0.06, h:ih+0.06, fill:{color:WHITE}, line:{color:HAIR, width:0.75} });
  if (o.vid) s.addMedia({ type:"video", path:A(`video/${o.vid}.mp4`), cover:b64(src), x:ix, y:iy, w:iw, h:ih });
  else s.addImage({ path:src, x:ix, y:iy, w:iw, h:ih });
  return { ix, iy, iw, ih };
}

const PERSONAS = ["Students","Scheduled Castes","Other Backward Classes","De-notified, Nomadic and Semi-Nomadic Tribes","Safai Karamcharis","Senior Citizens","Transgender Persons","Persons Affected by Substance Use","Persons Engaged in Begging","Victims of Atrocities","Voluntary Organisations"];
const OFFERINGS = ["Scholarships and Fellowships","Residential Schools, Hostels and Coaching","Loans and Credit","Skill Training and Livelihood","Care, Shelter and Health","De-addiction and Counselling","Protection, Relief and Grievance","Grants to Voluntary Organisations"];

/* ═══ 1 · Title ═══════════════════════════════════════════════════════════ */
{
  const s = slide(true);
  s.addImage({ path:A("emblem-white.png"), x:M, y:0.72, w:0.6, h:0.84 });
  s.addText("Government of India\nMinistry of Social Justice & Empowerment\nDepartment of Social Justice & Empowerment", {
    x:M+0.8, y:0.78, w:6.6, h:0.78, isTextBox:true, margin:0, fontFace:F, fontSize:11.5, color:BLUE_100, lineSpacingMultiple:1.2 });
  s.addText("How Citizens Find Schemes", { x:M, y:2.5, w:9.4, h:1.6, isTextBox:true, margin:0,
    fontFace:F, fontSize:40, bold:true, color:WHITE, lineSpacingMultiple:1.06 });
  s.addText("Three parts of the website. Six options. One list of the Department's schemes, read the same way by every one of them.", {
    x:M, y:4.16, w:10.4, h:0.7, isTextBox:true, margin:0, fontFace:F, fontSize:15, color:BLUE_100, lineSpacingMultiple:1.2 });
  s.addShape(pres.ShapeType.line, { x:M, y:5.4, w:CW, h:0, line:{color:BLUE_DEEP, width:1} });
  s.addText("Each option is shown as the screen built for it, with a recorded walkthrough, what favours it and what counts against it.", {
    x:M, y:5.62, w:11.2, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:12.5, color:WHITE, lineSpacingMultiple:1.2 });
  s.addText("Schemes from the Department's Annual Report 2025-26 and Demand for Grants 2026-27 · MoSJE Design Research · September 2026", {
    x:M, y:6.22, w:11.2, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:11, color:BLUE_100 });
  s.addNotes("Presented live. The order is the one asked for on 8 September: the thought behind every option first, then the home page, then the Schemes page, then the assistant. No scheme count appears anywhere in the deck.");
}

/* ═══ 2 · The concept — the two masters ══════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "One Thought Behind Every Option", "The Citizen on the Left, the Department on the Right",
    "Every option filters the Department's schemes on these two axes and nothing else.");
  const colW = 5.1, gap = CW - colW*2;
  const col = (x, title, sub, items) => {
    s.addShape(pres.ShapeType.rect, { x, y:y0, w:colW, h:5.05, fill:{color:SURF}, line:{color:HAIR, width:0.75} });
    s.addText(title, { x:x+0.24, y:y0+0.16, w:colW-0.48, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:T.h2, bold:true, color:DARK });
    s.addText(sub, { x:x+0.24, y:y0+0.5, w:colW-0.48, h:0.42, isTextBox:true, margin:0, fontFace:F, fontSize:T.caption, color:MUTE, lineSpacingMultiple:1.18 });
    const rowH = (5.05-1.08)/items.length;
    items.forEach((it,i)=>{
      const y = y0+0.98+i*rowH;
      s.addShape(pres.ShapeType.rect, { x:x+0.24, y, w:colW-0.48, h:rowH-0.06, fill:{color:WHITE}, line:{color:HAIR, width:0.5} });
      s.addText(String(i+1), { x:x+0.34, y, w:0.3, h:rowH-0.06, isTextBox:true, margin:0, valign:"middle", fontFace:F, fontSize:T.label, bold:true, color:BLUE_TXT });
      s.addText(it, { x:x+0.68, y, w:colW-1.0, h:rowH-0.06, isTextBox:true, margin:0, valign:"middle", fontFace:F, fontSize:T.body, color:INK });
    });
  };
  col(M, "Who Is Looking for Support", "The people the Department's mandate names (Annual Report 2025-26, §1.2), as a citizen would choose them. Persons with disabilities are asked for and directed to DEPwD.", PERSONAS);
  s.addText("×", { x:M+colW, y:y0+2.0, w:gap, h:0.7, isTextBox:true, margin:0, align:"center", fontFace:F, fontSize:36, bold:true, color:BLUE_TXT });
  s.addText("filters the\nschemes", { x:M+colW, y:y0+2.7, w:gap, h:0.5, isTextBox:true, margin:0, align:"center", fontFace:F, fontSize:T.label, color:MUTE, lineSpacingMultiple:1.15 });
  col(M+colW+gap, "What the Department Provides", "What the schemes actually give, in the Department's own words — the right-hand side a citizen chooses second, or skips.", OFFERINGS);
  sourceLine(s, "Not stage of life, not State, not gender — none of the Department's schemes divides on them. Every scheme is a record in the Annual Report 2025-26 or the Demand for Grants 2026-27, tagged on both axes.");
  s.addNotes("The one thought. Left: the citizen. Right: what the Department gives. A scheme is findable under every persona it names and every offering it provides, at once. Everything that follows is a view over this.");
}

/* ═══ 3 · The home page — three options, and where each sits ═════════════ */
{
  const s = slide(false);
  const y0 = header(s, "The Home Page", "Three Options, and Where Each Sits",
    "A is already on the page. B and C are alternatives for the section beneath the hero, where Our Offerings sits today.");
  const items = [
    ["A","Explore User Personas","home-a","Where the panel is today, beside Recent Documents. Kept, opening on Students, and choosing a persona now filters the Schemes page.","ALREADY ON THE SITE"],
    ["B","Find Schemes for You — two questions","home-b","A section of its own beneath the hero, in place of Our Offerings. Who is looking for support, then what kind of support.","RECOMMENDED"],
    ["C","Find Schemes for You — one tap","home-c","The same slot as B. A row of the personas; one tap lists what the Department provides for that group, by kind of support.","COMPANION TO B"],
  ];
  const cw = (CW-0.5)/3;
  items.forEach((it,i)=>{
    const x = M + i*(cw+0.25);
    s.addText(it[0], { x, y:y0, w:0.5, h:0.44, isTextBox:true, margin:0, fontFace:F, fontSize:26, bold:true, color:BLUE_TXT });
    s.addText(it[1], { x:x+0.5, y:y0+0.04, w:cw-0.5, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:T.lead, bold:true, color:DARK, valign:"top" });
    const m = media(s, { img:it[2] }, x, y0+0.56, cw, cw*0.625);
    pill(s, x, m.iy+m.ih+0.14, it[4], it[4]==="RECOMMENDED"?BLUE_TXT:SURF, it[4]==="RECOMMENDED"?WHITE:MUTE);
    s.addText(it[3], { x, y:m.iy+m.ih+0.5, w:cw, h:1.2, isTextBox:true, margin:0, fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.2 });
  });
  sourceLine(s, "B and C replace Our Offerings rather than lengthening the page. Either can be approved; C serves the visitor who will not answer questions.");
  s.addNotes("Three options for the home page, and where each sits. A stays where it is. B or C takes the section beneath the hero. The next three pages show each one being used.");
}

/* ═══ 4–6 · Home page options ════════════════════════════════════════════ */
const OPTIONS = [
  { surface:"The Home Page · Option A of 3", title:"Explore User Personas",
    vid:"home-a", live:true, rec:false,
    caption:"Recorded walkthrough of the panel as it stands, opening on Students and moving between the personas.",
    what:"The panel already on the home page: one persona at a time, moved with arrows. The persona list is the same eleven the other options use, and it opens on Students.",
    does:"Looks at the pictures, sees one that matches, and taps through to the Schemes page filtered to that persona.",
    pros:["Already on the site, so no extra height","The illustrations cross language","Kept as one of the three ways in"],
    cons:["One persona at a time: a visitor cannot tell whether they are represented without clicking","It sorts by persona alone; the kind of support is not asked","Today choosing a persona filters nothing — the panel's own promise goes unmet"] },
  { surface:"The Home Page · Option B of 3", title:"Find Schemes for You — two questions",
    vid:"home-b", live:false, rec:true,
    caption:"Recorded walkthrough: Scheduled Castes, then Scholarships and Fellowships; then Senior Citizens with the second question skipped.",
    what:"Two short questions — who is looking for support, and what kind of support — over the Department's own list of schemes. The second may be skipped, which widens the list.",
    does:"Answers two questions and is shown the schemes that name them, each with what it provides, whom it names and the place to apply.",
    pros:["Both questions change the list; nothing is asked for its own sake","Ends at the place to apply, with the scheme's own page beside it","Persons with disabilities are shown DEPwD's four schemes, labelled as DEPwD's, instead of nothing","Built as a website section from the design system, over the validated master"],
    cons:["Every scheme must be tagged on both axes before it works — done for the Department's own schemes, to be confirmed by each division","Replaces Our Offerings, or adds a section to the home page"] },
  { surface:"The Home Page · Option C of 3", title:"Find Schemes for You — one tap",
    vid:"home-c", live:false, rec:false,
    caption:"Recorded walkthrough: Scheduled Castes, Senior Citizens, Transgender Persons and Voluntary Organisations, one tap each.",
    what:"A row of the personas. Tapping one lists the schemes that name that group, headed by what they provide, with the place to apply beside each and a link to the scheme's page.",
    does:"Taps their persona and reads what the Department provides for them, without answering anything.",
    pros:["One tap, no questions","The same two axes as B, without asking the second","The place to apply is named beside every scheme"],
    cons:["Reads the persona alone, so a long list for the larger groups","Needs space on the home page, unless it replaces Our Offerings"] },
];
const SCHEMES_PAGE = [
  { surface:"The Schemes Page · Option A of 2", title:"Pictures of the Groups, with Cards",
    vid:"scheme-a", live:false, rec:false,
    caption:"Recorded walkthrough: Safai Karamcharis, then Loans and Credit, then Senior Citizens.",
    what:"Every persona visible at once as a row of marks, then what it provides as a row of chips, above a card for each scheme. Two filters and no third; cards are paged so the page keeps its height.",
    does:"Picks their persona, narrows by what it provides if they wish, and reads the cards.",
    pros:["Every group visible at once — no arrows, no scrolling to find yourself","The same two filters as the home page, so the idea is met twice","Cards carry the scheme's type and what it provides"],
    cons:["A card has no room for whom the scheme names","Two schemes cannot be compared side by side"] },
  { surface:"The Schemes Page · Option B of 2", title:"Filter Panel with a Table of Schemes",
    vid:"scheme-b", live:false, rec:true,
    caption:"Recorded walkthrough: Other Backward Classes with Scholarships, then Loans added, then one filter removed and the panel reset.",
    what:"Filters down the left on the same two axes; a table on the right showing what each scheme provides, whom it names and its type. A filter that would leave nothing is greyed rather than numbered. Ten rows a page.",
    does:"Ticks the filters that apply and reads the schemes side by side to see which to apply for.",
    pros:["Filters combine — who it is for and what it provides, together","The table carries whom each scheme names, which a card cannot","A greyed filter warns before an empty result without printing a count","Paged, so the page keeps its height"],
    cons:["A table reads as a record rather than an invitation"] },
];
const ASSISTANT = [
  { surface:"The Assistant · Option A of 1", title:"Samajik Sahayak — the same two questions, in chat",
    vid:"assistant", live:true, rec:true,
    caption:"Recorded walkthrough of the assistant the design system ships, opened from an ordinary page: Scheduled Castes, then Loans and Credit.",
    what:"The same two questions, asked one at a time in the chat window that is already built and reachable from every page. It reads the same list as the home page, so it can never name different schemes for the same person.",
    does:"Opens the assistant from whichever page they are on, answers on their phone, and is given schemes to open.",
    pros:["Reachable from every page, including pages that lead nowhere else","One question per screen, which suits a phone","Already built — only the scheme branch is new","States plainly that it cannot decide or change an application"],
    cons:["A button in the corner is found only by those looking for it"] },
];

function optionPage(o) {
  const s = slide(false);
  s.addText(o.surface, { x:M, y:0.44, w:CW, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:T.h1, bold:true, color:DARK });
  s.addText(o.title, { x:M, y:1.0, w:CW, h:0.34, isTextBox:true, margin:0, fontFace:F, fontSize:T.lead+2.5, color:BLUE_TXT });
  let px = M;
  px += pill(s, px, 1.46, o.live?"ALREADY ON THE SITE":"TO BE BUILT", o.live?SURF:BLUE_50, o.live?MUTE:BLUE_TXT) + 0.14;
  if (o.rec) pill(s, px, 1.46, "RECOMMENDED", BLUE_TXT, WHITE);
  const y0 = 1.92, boxW = 5.9, boxH = 4.2;
  const m = media(s, o, M, y0, boxW, boxH);
  s.addText("▶  " + o.caption, { x:M, y:m.iy+m.ih+0.14, w:boxW, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:T.caption, color:MUTE, lineSpacingMultiple:1.15 });
  const rx = M+boxW+0.5, rw = CW-boxW-0.5;
  let y = y0;
  y = field(s, rx, y, rw, "What it is", [o.what]);
  y = field(s, rx, y, rw, "What a citizen does", [o.does]);
  y = field(s, rx, y, rw, "In its favour", o.pros, BLUE_TXT);
  y = field(s, rx, y, rw, "Against it", o.cons, SAFF_TXT);
  const bottom = PH - 0.6;
  if (y > bottom) throw new Error(`record overflows the page on "${o.title}" (${y.toFixed(2)} > ${bottom})`);
  s.addNotes(`${o.title}. Press play — it is a real page being used, not an animation.`);
}
OPTIONS.forEach(optionPage);

/* ═══ 7 · The Schemes page — two options ════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "The Schemes Page", "Two Options, on the Same Two Axes",
    "Where a person lands after choosing a scheme from the home page, and where officers and voluntary organisations work. Both options filter on who it is for and what it provides, and nothing else.");
  const items = [
    ["A","Pictures of the groups, with cards","scheme-a","Every persona on screen at once, then what it provides as chips, then cards. Browsing.","OPTION A"],
    ["B","Filter panel with a table","scheme-b","Filters that combine, a table that carries whom each scheme names and its type. Deciding.","RECOMMENDED"],
  ];
  const cw = (CW-0.5)/2;
  items.forEach((it,i)=>{
    const x = M + i*(cw+0.5);
    s.addText(it[0], { x, y:y0, w:0.5, h:0.44, isTextBox:true, margin:0, fontFace:F, fontSize:26, bold:true, color:BLUE_TXT });
    s.addText(it[1], { x:x+0.5, y:y0+0.06, w:cw-0.5, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:T.lead, bold:true, color:DARK });
    const m = media(s, { img:it[2] }, x, y0+0.56, cw, cw*0.625);
    pill(s, x, m.iy+m.ih+0.14, it[4], it[4]==="RECOMMENDED"?BLUE_TXT:SURF, it[4]==="RECOMMENDED"?WHITE:MUTE);
    s.addText(it[3], { x, y:m.iy+m.ih+0.5, w:cw, h:0.7, isTextBox:true, margin:0, fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.2 });
  });
  sourceLine(s, "The filters on both are the same personas and offerings the home page uses. No count is printed on either; a filter that would leave nothing is greyed.");
  s.addNotes("The internal page. Two arrangements of the same two filters. The next two pages show each being used.");
}
SCHEMES_PAGE.forEach(optionPage);

/* ═══ 10 · The assistant ════════════════════════════════════════════════ */
ASSISTANT.forEach(optionPage);

/* ═══ 11 · What has to be done first ════════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "Preparatory Work", "What Has to Be Done First",
    "Whichever options are approved, the same preparatory work stands behind all of them.");
  const items = [
    ["Confirm the two masters",
     "The eleven personas and the eight offerings on page 2. Both are drawn from the Department's own mandate and its Annual Report; each division confirms the wording for its groups, and whether Students, Victims of Atrocities and Persons Engaged in Begging are to be named on a public page."],
    ["Tag every scheme on both axes",
     "Each scheme record carries the personas it names and the offerings it provides, taken from the Annual Report 2025-26, the Demand for Grants 2026-27 and the PIB Year-End Review 2025, with a source on every row. The divisions confirm their rows; nothing is shown that a source does not state."],
    ["Estimate the development work",
     "The website's catalogue is tagged on one axis with one value per scheme. Re-tagging it on two axes, multi-valued, is the development task every option depends on, and its estimate is asked of the development team before any option is scheduled."],
    ["Confirm the application routes",
     "Where each scheme is applied for — the National Scholarship Portal, a State's own portal, a corporation's channelising agency, a helpline — is stated per scheme and per State, and confirmed by the division that owns it."],
    ["Settle the open questions",
     "NSFDC's income ceiling is stated differently on two of the Department's own pages; PM-DAKSH merges into PM-KVY from 2026-27; the beta site's Schemes list carries guideline documents, status tables and State schemes as the Department's own. Each is recorded, and none is shown until settled."],
  ];
  let y = y0 + 0.08;
  items.forEach((it,i)=>{
    s.addText(String(i+1), { x:M, y:y+0.02, w:0.42, h:0.32, isTextBox:true, margin:0, fontFace:F, fontSize:17, bold:true, color:BLUE_TXT });
    s.addText(it[0], { x:M+0.5, y, w:CW-0.5, h:0.26, isTextBox:true, margin:0, fontFace:F, fontSize:13.5, bold:true, color:DARK });
    s.addText(it[1], { x:M+0.5, y:y+0.28, w:CW-0.5, h:0.62, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:INK, lineSpacingMultiple:1.2 });
    y += 1.04;
    if (i < items.length-1) s.addShape(pres.ShapeType.line, { x:M, y:y-0.12, w:CW, h:0, line:{color:HAIR, width:0.75} });
  });
  sourceLine(s, "The design team supplies the masters and the tagged records; the divisions confirm them; the development team estimates the re-tagging.");
  s.addNotes("This is the page the review asked for: the masters, the tagging, and the estimate from development. Nothing on the options can ship before the second item is done.");
}

/* ═══ 12 · Safeguards ══════════════════════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "Safeguards", "Five Commitments That Hold Whichever Options Are Approved", null);
  const items = [
    ["Nothing here decides a case",
     "No screen and no message states that a person is eligible. The wording throughout is that a scheme names the person as its target group, and that the sanctioning authority decides. A citizen who acts on a wrong assurance from a government website bears a real cost, and the Department bears the complaint."],
    ["The boundary of the Department is stated, not hidden",
     "Persons with disabilities are served by the Department of Empowerment of Persons with Disabilities, in this same Ministry. Anyone who indicates a disability is told so plainly and shown that Department's four schemes, labelled as its own, rather than an empty result."],
    ["No personal information is collected",
     "No sign-in, no Aadhaar, no telephone number, no name and no income figure. The persona and the kind of support are chosen from fixed options, never typed, and nothing is stored."],
    ["Nobody is left at a dead end",
     "The second question can be skipped, and skipping widens the answer instead of ending it. Where nothing matches, the screen says so plainly and offers the way back."],
    ["No number is published from a design file",
     "No count of schemes appears on any screen. Only the helpline numbers the Department itself publishes — 14567, 14446 and 14566 — appear; every other figure on a screen is one the Annual Report or the Demand for Grants states."],
  ];
  let y = y0 + 0.14;
  items.forEach((it,i)=>{
    s.addText(String(i+1), { x:M, y:y+0.02, w:0.42, h:0.32, isTextBox:true, margin:0, fontFace:F, fontSize:17, bold:true, color:BLUE_TXT });
    s.addText(it[0], { x:M+0.5, y, w:CW-0.5, h:0.26, isTextBox:true, margin:0, fontFace:F, fontSize:13.5, bold:true, color:DARK });
    s.addText(it[1], { x:M+0.5, y:y+0.28, w:CW-0.5, h:0.56, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:INK, lineSpacingMultiple:1.2 });
    y += 1.02;
    if (i < items.length-1) s.addShape(pres.ShapeType.line, { x:M, y:y-0.14, w:CW, h:0, line:{color:HAIR, width:0.75} });
  });
  sourceLine(s, "These hold across all six options and are not traded against for speed.");
}

/* ═══ 13 · What is proposed ════════════════════════════════════════════════ */
{
  const s = slide(true);
  s.addText("IN SUMMARY", { x:M, y:0.7, w:CW, h:0.24, isTextBox:true, margin:0, fontFace:F, fontSize:10, bold:true, charSpacing:1.3, color:BLUE_100 });
  s.addText("What the Design Team Recommends", { x:M, y:1.0, w:CW, h:0.6, isTextBox:true, margin:0, fontFace:F, fontSize:32, bold:true, color:WHITE });
  const rows = [
    ["1","The home page","Option B, with Option A kept","It answers the question a citizen arrives with; A still serves the visitor who recognises a picture"],
    ["2","The Schemes page","Option B — filter panel with a table","This is the page where people compare, and a table can carry whom a scheme names"],
    ["3","The assistant","Yes — the same two questions, in chat","It reaches the person already lost on a page, and is largely built"],
  ];
  const rowY = 2.0, rowH = 0.82;
  [["THE PART OF THE SITE", M+0.7, 4.4],["OUR RECOMMENDATION", M+5.2, 4.2],["WHY", M+9.5, 2.4]]
    .forEach(c => s.addText(c[0], { x:c[1], y:rowY-0.3, w:c[2], h:0.22, isTextBox:true, margin:0, fontFace:F, fontSize:9, bold:true, charSpacing:1.1, color:BLUE_200 }));
  rows.forEach((r,i)=>{
    const y = rowY + i*rowH;
    s.addShape(pres.ShapeType.line, { x:M, y:y-0.08, w:CW, h:0, line:{color:BLUE_DEEP, width:1} });
    s.addText(r[0], { x:M, y:y+0.1, w:0.6, h:0.38, isTextBox:true, margin:0, fontFace:F, fontSize:20, bold:true, color:BLUE_200 });
    s.addText(r[1], { x:M+0.7, y:y+0.12, w:4.4, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:13, color:BLUE_100 });
    s.addText(r[2], { x:M+5.2, y:y+0.12, w:4.2, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:13, bold:true, color:WHITE });
    s.addText(r[3], { x:M+9.5, y:y+0.12, w:2.4, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:BLUE_100, lineSpacingMultiple:1.12 });
  });
  s.addShape(pres.ShapeType.line, { x:M, y:rowY+3*rowH-0.08, w:CW, h:0, line:{color:BLUE_DEEP, width:1} });
  s.addShape(pres.ShapeType.rect, { x:M, y:4.9, w:CW, h:1.0, fill:{color:BLUE_DEEP}, line:{color:BLUE_DEEP, width:0} });
  s.addText("The three parts are independent. Any combination of these options can be taken.", {
    x:M+0.34, y:5.06, w:CW-0.68, h:0.32, isTextBox:true, margin:0, fontFace:F, fontSize:16, bold:true, color:WHITE });
  s.addText("Whichever is taken, the preparatory work on page 11 comes first: the two masters, the tagging, and the development estimate.", {
    x:M+0.34, y:5.42, w:CW-0.68, h:0.32, isTextBox:true, margin:0, fontFace:F, fontSize:11.5, color:BLUE_100 });
  s.addNotes("The three parts are decided separately. If only one is settled today, the Schemes page is the one that changes most for the most people.");
}

pres.writeFile({ fileName: "MoSJE-Service-Discovery-Options.pptx" }).then(f => console.log("wrote", f));
