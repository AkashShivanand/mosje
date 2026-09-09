/**
 * Service Discovery — the options placed before the Department, as a deck that
 * is PRESENTED, not read. One idea per slide, the screen large, a few words
 * beside it, and everything a presenter needs to say in the speaker notes.
 *
 * Revised 9 September 2026 after the 8 September review: no scheme count
 * anywhere, one thought behind every option (who you are × what you need), two
 * questions instead of five, and the order the review asked for — the idea,
 * the home page, the Schemes page, the assistant, then what comes first.
 *
 * Noto Sans throughout. Every colour is a resolved SAMAVESH token. Nothing on a
 * slide is a figure the Department's own Annual Report 2025-26 or its Demand
 * for Grants 2026-27 does not state.
 */
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const b64 = f => "image/png;base64," + fs.readFileSync(f).toString("base64");

const pres = new pptxgen();
pres.defineLayout({ name: "MOSJE", width: 13.333, height: 7.5 });
pres.layout = "MOSJE";
pres.author = "MoSJE Design Research";
pres.title = "How Citizens Find Schemes";

const BLUE_TXT="005EB9", BLUE_DEEP="004B96", DARK="003975";
const BLUE_100="C0DBFF", BLUE_200="92C2FF", BLUE_50="ECF4FF";
const SAFF_TXT="A43A00", INK="1E2124", INK_MUTE="3A3D41", MUTE="54585E";
const SURF="EEF0F3", HAIR="DCDEE1", WHITE="FFFFFF";
const F = "Noto Sans";
const W=13.333, PH=7.5, M=0.8, CW=W-M*2;
const A = f => `assets/${f}`;

/** Width and height of a PNG, read from its IHDR chunk. */
function imageSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

/* One type scale. Fewer steps than a document needs, and each one a real jump,
   because a slide is read from across a room. */
const T = { display:44, h1:30, h2:19, lead:14, body:12, label:9.5, micro:8.5 };
const TRACK = { eyebrow:1.0, pill:0.5 };

const slide = dark => { const s = pres.addSlide(); s.background = { color: dark?DARK:WHITE }; return s; };

function header(s, eyebrow, title, lede) {
  s.addText(eyebrow.toUpperCase(), { x:M, y:0.48, w:CW, h:0.24, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.eyebrow, color:MUTE });
  s.addText(title, { x:M, y:0.76, w:CW, h:0.56, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.h1, bold:true, color:DARK });
  if (!lede) return 1.5;
  s.addText(lede, { x:M, y:1.36, w:CW*0.9, h:0.34, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.lead, color:INK_MUTE });
  return 1.9;
}
function pill(s, x, y, label, fill, txt) {
  const w = 0.075*label.length + 0.34;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h:0.27, rectRadius:0.135,
    fill:{color:fill}, line:{color:fill, width:0} });
  s.addText(label, { x, y, w, h:0.27, isTextBox:true, margin:0, align:"center", valign:"middle",
    fontFace:F, fontSize:T.micro, bold:true, charSpacing:TRACK.pill, color:txt });
  return w;
}
const footLine = (s, t, dark) => s.addText(t, { x:M, y:PH-0.5, w:CW, h:0.26, isTextBox:true, margin:0,
  fontFace:F, fontSize:T.micro, color:dark?BLUE_200:MUTE });

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

/** A short list under a small label. Returns the y the next block starts at. */
function list(s, x, y, w, label, items, labelColor) {
  s.addText(label.toUpperCase(), { x, y, w, h:0.22, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.eyebrow, color:labelColor });
  const cpl = Math.floor((w*72)/(T.body*0.6));
  let yy = y + 0.3;
  items.forEach(t => {
    const lines = Math.max(1, Math.ceil(t.length/cpl));
    const h = lines*0.21 + 0.04;
    s.addShape(pres.ShapeType.rect, { x, y:yy+0.07, w:0.06, h:0.06, fill:{color:labelColor}, line:{color:labelColor, width:0} });
    s.addText(t, { x:x+0.2, y:yy, w:w-0.2, h, isTextBox:true, margin:0, fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.15 });
    yy += h + 0.08;
  });
  return yy + 0.22;
}

const PERSONAS = ["Scheduled Castes","Other Backward Classes","Senior Citizens","Persons Affected by Substance Use","Transgender Persons","Persons Engaged in Begging","De-notified, Nomadic and Semi-Nomadic Tribes","Safai Karamcharis","Students","Victims of Atrocities","Voluntary Organisations"];
const OFFERINGS = ["Scholarships and Fellowships","Residential Schools, Hostels and Coaching","Loans and Credit","Skill Training and Livelihood","Care, Shelter and Health","De-addiction and Counselling","Protection, Relief and Grievance","Grants to Voluntary Organisations"];

/* ═══ 1 · Title ═══════════════════════════════════════════════════════════ */
{
  const s = slide(true);
  s.addImage({ path:A("emblem-white.png"), x:M, y:0.8, w:0.6, h:0.84 });
  s.addText("Government of India\nMinistry of Social Justice & Empowerment\nDepartment of Social Justice & Empowerment", {
    x:M+0.8, y:0.86, w:6.6, h:0.78, isTextBox:true, margin:0, fontFace:F, fontSize:11.5, color:BLUE_100, lineSpacingMultiple:1.2 });
  s.addText("How Citizens Find Schemes", { x:M, y:2.7, w:10, h:1.1, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.display, bold:true, color:WHITE });
  s.addText("Six options for the website. One idea behind all of them.", {
    x:M, y:3.9, w:10.4, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:18, color:BLUE_100 });
  footLine(s, "MoSJE Design Research · September 2026", true);
  s.addNotes("Presented live. The order is the one asked for on 8 September: the idea behind every option first, then the home page, then the Schemes page, then the assistant, then what has to come first. No scheme count appears anywhere in the deck — a number nobody can defend invites a challenge.");
}

/* ═══ 2 · The idea — who you are, what you need ══════════════════════════ */
{
  const s = slide(false);
  s.addText("ONE IDEA BEHIND EVERY OPTION", { x:M, y:0.48, w:CW, h:0.24, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.eyebrow, color:MUTE });
  s.addText("Who You Are. What You Need.", { x:M, y:0.76, w:CW, h:0.7, isTextBox:true, margin:0,
    fontFace:F, fontSize:36, bold:true, color:DARK });
  s.addText("Every option asks these two things, and nothing else.", { x:M, y:1.5, w:CW, h:0.34, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.lead, color:INK_MUTE });

  const colW = 5.5, y0 = 2.2, rowH = 0.345;
  const col = (x, title, items) => {
    s.addText(title, { x, y:y0, w:colW, h:0.32, isTextBox:true, margin:0, fontFace:F, fontSize:T.h2, bold:true, color:BLUE_TXT });
    s.addShape(pres.ShapeType.line, { x, y:y0+0.42, w:colW, h:0, line:{color:HAIR, width:0.75} });
    items.forEach((it,i) => s.addText(it, { x, y:y0+0.56+i*rowH, w:colW, h:rowH, isTextBox:true, margin:0, valign:"middle",
      fontFace:F, fontSize:13, color:INK }));
  };
  col(M, "Who Is Looking for Support", PERSONAS);
  s.addShape(pres.ShapeType.line, { x:W/2, y:y0, w:0, h:0.56+PERSONAS.length*rowH, line:{color:HAIR, width:0.75} });
  col(W-M-colW, "What the Department Provides", OFFERINGS);
  footLine(s, "The first eight are the groups the Department's mandate names (Annual Report 2025-26, §1.2); the last three are groups its schemes name. Every scheme is a record in the Annual Report 2025-26 or the Demand for Grants 2026-27, tagged on both.");
  s.addNotes("The one idea. On the left, the person: the groups the Department's own mandate names, plus the three its schemes name — students, victims of atrocities, and the voluntary organisations it funds. On the right, what the Department gives, in its own words. A scheme is findable under every group it names and every kind of support it provides, at once. Everything that follows is a view over these two lists. Not stage of life, not State: the review cut those, and a scheme record is tagged on these two axes only.");
}

/* ═══ 3 · The home page — three options ═════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "The Home Page", "Three Options",
    "A is on the page today. B or C takes the section beneath the hero, where Our Offerings sits.");
  const items = [
    ["A","Explore User Personas","home-a","One persona at a time. Kept, in the mandate's order.","ON THE SITE TODAY"],
    ["B","Two Questions","home-b","Who is looking for support, then what kind. Ends at the place to apply.","RECOMMENDED"],
    ["C","One Tap","home-c","A row of the groups. One tap lists what the Department provides for that group.","COMPANION TO B"],
  ];
  const cw = (CW-0.6)/3;
  items.forEach((it,i)=>{
    const x = M + i*(cw+0.3);
    s.addText(it[0], { x, y:y0, w:0.55, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:28, bold:true, color:BLUE_TXT });
    s.addText(it[1], { x:x+0.55, y:y0+0.08, w:cw-0.55, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:T.lead, bold:true, color:DARK });
    const m = media(s, { img:it[2] }, x, y0+0.62, cw, cw*0.625);
    pill(s, x, m.iy+m.ih+0.16, it[4], it[4]==="RECOMMENDED"?BLUE_TXT:SURF, it[4]==="RECOMMENDED"?WHITE:MUTE);
    s.addText(it[3], { x, y:m.iy+m.ih+0.54, w:cw, h:0.7, isTextBox:true, margin:0, fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.2 });
  });
  footLine(s, "B and C replace Our Offerings rather than lengthening the page. Either can be approved.");
  s.addNotes("Three options for the home page. A stays where it is. B or C takes the section beneath the hero. C serves the visitor who will not answer questions. The next three pages show each one being used.");
}

/* ═══ 4–6 · Home page options ════════════════════════════════════════════ */
const OPTIONS = [
  { part:"The Home Page · Option A of 3", title:"Explore User Personas",
    img:"home-a", live:true, rec:false,
    caption:"The panel as it stands on the site today, in the mandate's order.",
    pros:["Already on the site, so no extra height","The pictures cross language","Choosing a persona now filters the Schemes page"],
    cons:["One persona at a time; a visitor cannot see whether they are represented without clicking","Asks who, never what"],
    notes:"The panel already on the home page: one persona at a time, moved with arrows. The persona list is the same eleven the other options use, in the same order. A citizen looks at the pictures, sees one that matches, and taps through to the Schemes page filtered to that persona. Today choosing a persona filters nothing — that is fixed in every option." },
  { part:"The Home Page · Option B of 3", title:"Two Questions",
    vid:"home-b", live:false, rec:true,
    caption:"Recorded: Scheduled Castes, then Scholarships. Then Senior Citizens with the second question skipped.",
    pros:["Both questions change the list; nothing is asked for its own sake","Ends at the place to apply, with the scheme's page beside it","Built from the design system, over the validated list"],
    cons:["Every scheme must be tagged on both axes before it works","Takes the Our Offerings slot"],
    notes:"Two short questions — who is looking for support, and what kind of support — over the Department's own list of schemes. The second may be skipped, which widens the list. A citizen answers and is shown the schemes that name them, each with what it provides, whom it names and the place to apply. The tagging is done for the Department's own schemes and is to be confirmed by each division." },
  { part:"The Home Page · Option C of 3", title:"One Tap",
    vid:"home-c", live:false, rec:false,
    caption:"Recorded: Scheduled Castes, Senior Citizens, Transgender Persons, Voluntary Organisations — one tap each.",
    pros:["One tap, no questions","The same two axes as B, with the second unasked","The place to apply beside every scheme"],
    cons:["Long lists for the larger groups","Takes the Our Offerings slot"],
    notes:"A row of the groups. Tapping one lists the schemes that name that group, headed by what they provide, with the place to apply beside each and a link to the scheme's page. Nobody answers anything. The cost is length for the larger groups." },
];
const SCHEMES_PAGE = [
  { part:"The Schemes Page · Option A of 2", title:"Pictures of the Groups, with Cards",
    vid:"scheme-a", live:false, rec:false,
    caption:"Recorded: Safai Karamcharis, then Loans and Credit, then Senior Citizens.",
    pros:["Every group visible at once","The same two filters as the home page","Cards carry the scheme's type and what it provides"],
    cons:["No room on a card for whom the scheme names","Two schemes cannot be compared side by side"],
    notes:"Every persona visible at once as a row of marks, then what it provides as a row of chips, above a card for each scheme. Two filters and no third; cards are paged so the page keeps its height. This is browsing." },
  { part:"The Schemes Page · Option B of 2", title:"Filter Panel with a Table",
    vid:"scheme-b", live:false, rec:true,
    caption:"Recorded: Other Backward Classes with Scholarships, then Loans added, then one filter removed.",
    pros:["Filters combine: who it is for and what it provides, together","The table carries whom each scheme names","A filter that would leave nothing is greyed, not counted"],
    cons:["A table reads as a record rather than an invitation"],
    notes:"Filters down the left on the same two axes; a table on the right showing what each scheme provides, whom it names and its type. Ten rows a page. This is deciding — the page where people compare, and a table can carry what a card cannot." },
];
const ASSISTANT = [
  { part:"The Assistant · The Same Two Questions, in Chat", title:"Samajik Sahayak",
    vid:"assistant", live:true, rec:true,
    caption:"Recorded: the assistant the design system ships, opened from an ordinary page. Scheduled Castes, then Loans and Credit.",
    pros:["Reachable from every page","One question per screen, which suits a phone","Already built; only the scheme branch is new"],
    cons:["A button in the corner is found only by those looking for it"],
    notes:"The same two questions, asked one at a time in the chat window that is already built and reachable from every page. It reads the same list as the home page, so it can never name different schemes for the same person. It states plainly that it cannot decide or change an application." },
];

function optionPage(o) {
  const s = slide(false);
  s.addText(o.part.toUpperCase(), { x:M, y:0.48, w:CW, h:0.24, isTextBox:true, margin:0, fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.eyebrow, color:MUTE });
  s.addText(o.title, { x:M, y:0.76, w:CW-2.6, h:0.56, isTextBox:true, margin:0, fontFace:F, fontSize:T.h1, bold:true, color:DARK });
  let px = M;
  px += pill(s, px, 1.42, o.live?"ON THE SITE TODAY":"TO BE BUILT", o.live?SURF:BLUE_50, o.live?MUTE:BLUE_TXT) + 0.14;
  if (o.rec) pill(s, px, 1.42, "RECOMMENDED", BLUE_TXT, WHITE);
  const y0 = 1.95, boxW = 7.1, boxH = 4.45;
  const m = media(s, o, M, y0, boxW, boxH);
  s.addText((o.vid ? "▶  " : "") + o.caption, { x:M, y:m.iy+m.ih+0.14, w:boxW, h:0.42, isTextBox:true, margin:0, fontFace:F, fontSize:T.micro, color:MUTE, lineSpacingMultiple:1.15 });
  const rx = M+boxW+0.5, rw = W-M-rx;
  let y = y0;
  y = list(s, rx, y, rw, "In its favour", o.pros, BLUE_TXT);
  y = list(s, rx, y, rw, "Against it", o.cons, SAFF_TXT);
  const bottom = PH - 0.55;
  if (y > bottom) throw new Error(`overflows the page on "${o.title}" (${y.toFixed(2)} > ${bottom})`);
  s.addNotes(o.notes + (o.vid ? " Press play — it is a real page being used, not an animation." : ""));
}
OPTIONS.forEach(optionPage);

/* ═══ 7 · The Schemes page — two options ════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "The Schemes Page", "Two Options",
    "Where a person lands from the home page, and where officers and voluntary organisations work. Both filter on the same two lists.");
  const items = [
    ["A","Pictures of the Groups, with Cards","scheme-a","Every group on screen at once, then cards. Browsing.","OPTION A"],
    ["B","Filter Panel with a Table","scheme-b","Filters that combine; a table that carries whom each scheme names. Deciding.","RECOMMENDED"],
  ];
  const cw = (CW-0.6)/2;
  items.forEach((it,i)=>{
    const x = M + i*(cw+0.6);
    s.addText(it[0], { x, y:y0, w:0.55, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:28, bold:true, color:BLUE_TXT });
    s.addText(it[1], { x:x+0.55, y:y0+0.08, w:cw-0.55, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:T.lead, bold:true, color:DARK });
    const m = media(s, { img:it[2] }, x, y0+0.62, cw, cw*0.625);
    pill(s, x, m.iy+m.ih+0.16, it[4], it[4]==="RECOMMENDED"?BLUE_TXT:SURF, it[4]==="RECOMMENDED"?WHITE:MUTE);
    s.addText(it[3], { x, y:m.iy+m.ih+0.54, w:cw, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.2 });
  });
  footLine(s, "No count is printed on either. A filter that would leave nothing is greyed.");
  s.addNotes("The internal page. Two arrangements of the same two filters. The next two pages show each being used.");
}
SCHEMES_PAGE.forEach(optionPage);

/* ═══ 10 · The assistant ════════════════════════════════════════════════ */
ASSISTANT.forEach(optionPage);

/* ═══ 11 · Before anything is built ═════════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "First", "Before Anything Is Built", "Whichever options are approved, three things come first.");
  const items = [
    ["Confirm the two lists", "The eleven groups and the eight kinds of support, by the divisions that own them — including whether every group is to be named on a public page."],
    ["Tag every scheme on both", "Each record carries whom it names, what it provides and where it is applied for, with a source on every row. The divisions confirm their rows."],
    ["Estimate the re-tagging", "The website's catalogue is tagged on one axis, one value a scheme. Two axes, many values, is the development work every option needs."],
  ];
  let y = y0 + 0.2;
  items.forEach((it,i)=>{
    s.addText(String(i+1), { x:M, y, w:0.6, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:26, bold:true, color:BLUE_TXT });
    s.addText(it[0], { x:M+0.7, y:y+0.02, w:CW-0.7, h:0.36, isTextBox:true, margin:0, fontFace:F, fontSize:T.h2, bold:true, color:DARK });
    s.addText(it[1], { x:M+0.7, y:y+0.42, w:CW-0.7, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.2 });
    y += 1.34;
    if (i < items.length-1) s.addShape(pres.ShapeType.line, { x:M, y:y-0.22, w:CW, h:0, line:{color:HAIR, width:0.75} });
  });
  footLine(s, "The design team supplies the lists and the tagged records; the divisions confirm them; the development team estimates the re-tagging.");
  s.addNotes("The page the review asked for. The two lists and the tagged records exist and are with the divisions to confirm. The estimate for re-tagging the catalogue is asked of the development team before any option is scheduled. Two questions are open and recorded: whether Victims of Atrocities and Persons Engaged in Begging are acceptable public wording, and NSFDC's income ceiling, which two of the Department's own pages state differently.");
}

/* ═══ 12 · Three rules ══════════════════════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "Whichever Options Are Approved", "Three Rules", null);
  const items = [
    ["It names the group. It never decides the case.", "No screen and no message says a person is eligible. The sanctioning authority decides every application."],
    ["It asks two things. It stores nothing.", "No sign-in, no Aadhaar, no telephone number, no income. The answers are chosen from fixed options, never typed."],
    ["It prints no number.", "No count of schemes on any screen. The only figures are the helplines the Department publishes and the amounts its Annual Report states."],
  ];
  let y = y0 + 0.3;
  items.forEach((it,i)=>{
    s.addText(it[0], { x:M, y, w:CW, h:0.46, isTextBox:true, margin:0, fontFace:F, fontSize:22, bold:true, color:DARK });
    s.addText(it[1], { x:M, y:y+0.5, w:CW, h:0.36, isTextBox:true, margin:0, fontFace:F, fontSize:T.body, color:INK_MUTE, lineSpacingMultiple:1.2 });
    y += 1.5;
    if (i < items.length-1) s.addShape(pres.ShapeType.line, { x:M, y:y-0.3, w:CW, h:0, line:{color:HAIR, width:0.75} });
  });
  footLine(s, "These hold across all six options and are not traded against for speed.");
  s.addNotes("Three commitments that hold whatever is chosen. A citizen who acts on a wrong assurance from a government website bears a real cost, and the Department bears the complaint — so nothing here decides a case, nothing is collected, and no number leaves a design file.");
}

/* ═══ 13 · The recommendation ═══════════════════════════════════════════ */
{
  const s = slide(true);
  s.addText("IN SUMMARY", { x:M, y:0.7, w:CW, h:0.24, isTextBox:true, margin:0, fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.eyebrow, color:BLUE_100 });
  s.addText("What the Design Team Recommends", { x:M, y:1.0, w:CW, h:0.7, isTextBox:true, margin:0, fontFace:F, fontSize:34, bold:true, color:WHITE });
  const rows = [
    ["The home page","Option B, with A kept","It answers the question a citizen arrives with"],
    ["The Schemes page","Option B — filters with a table","It is where people compare"],
    ["The assistant","Yes — the same two questions","It reaches the person already lost on a page"],
  ];
  const rowY = 2.3, rowH = 0.9;
  rows.forEach((r,i)=>{
    const y = rowY + i*rowH;
    s.addShape(pres.ShapeType.line, { x:M, y:y-0.1, w:CW, h:0, line:{color:BLUE_DEEP, width:1} });
    s.addText(r[0], { x:M, y:y+0.12, w:3.6, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:15, color:BLUE_100 });
    s.addText(r[1], { x:M+3.7, y:y+0.12, w:4.6, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:17, bold:true, color:WHITE });
    s.addText(r[2], { x:M+8.4, y:y+0.14, w:CW-8.4, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:12, color:BLUE_100, lineSpacingMultiple:1.15 });
  });
  s.addShape(pres.ShapeType.line, { x:M, y:rowY+3*rowH-0.1, w:CW, h:0, line:{color:BLUE_DEEP, width:1} });
  s.addText("The three parts are decided separately. Whichever is chosen, the two lists and the tagging come first.", {
    x:M, y:5.5, w:CW, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:16, bold:true, color:WHITE });
  s.addNotes("The three parts are decided separately. If only one is settled today, the Schemes page is the one that changes most for the most people.");
}

pres.writeFile({ fileName: "MoSJE-Service-Discovery-Options.pptx" }).then(f => console.log("wrote", f));
