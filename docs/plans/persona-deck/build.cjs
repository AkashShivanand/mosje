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
    s.addShape(pres.ShapeType.rect, { x, y:yy+0.06, w:0.06, h:0.06, fill:{color:labelColor}, line:{color:labelColor, width:0} });
    s.addText(t, { x:x+0.2, y:yy, w:w-0.2, h, isTextBox:true, margin:0, valign:'top', fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.15 });
    yy += h + 0.08;
  });
  return yy + 0.22;
}

const PERSONAS = ["Students","Scheduled Castes","Other Backward Classes","De-notified, Nomadic and Semi-Nomadic Tribes","Safai Karamcharis","Senior Citizens","Transgender Persons","Persons Affected by Substance Use","Persons Engaged in Begging","Victims of Atrocities","Voluntary Organisations"];
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
  s.addText("Every option is built on these two lists.", { x:M, y:1.5, w:CW, h:0.34, isTextBox:true, margin:0,
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
  s.addNotes("The one idea. On the left, the person: the groups the Department's own mandate names, plus the three its schemes name — students, victims of atrocities, and the voluntary organisations it funds. On the right, what the Department gives, in its own words. A scheme is findable under every group it names and every kind of support it provides, at once. Everything that follows is a view over these two lists. Not stage of life, not State: the review cut those, and a scheme record is tagged on these two axes only.");
}

/* ═══ 3 · The home page — three options ═════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "The Home Page", "Three Options",
    "A is on the site today. B or C would take the section below the banner, where Our Offerings sits now.");
  const items = [
    ["A","Explore User Personas","home-a","One group at a time. Kept as it is.","ON THE SITE TODAY"],
    ["B","Two Questions","home-b","Who you are, then what you need. Ends with the schemes and a link to see them all.","OPTION B"],
    ["C","One Tap","home-c","Pick your group. First the portal for that group, then its schemes.","OPTION C"],
  ];
  const cw = (CW-0.6)/3;
  items.forEach((it,i)=>{
    const x = M + i*(cw+0.3);
    s.addText(it[0], { x, y:y0, w:0.55, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:28, bold:true, color:BLUE_TXT });
    s.addText(it[1], { x:x+0.55, y:y0+0.08, w:cw-0.55, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:T.lead, bold:true, color:DARK });
    const m = media(s, { img:it[2] }, x, y0+0.62, cw, cw*0.625);
    pill(s, x, m.iy+m.ih+0.16, it[4], SURF, MUTE);
    s.addText(it[3], { x, y:m.iy+m.ih+0.54, w:cw, h:0.7, isTextBox:true, margin:0, fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.2 });
  });
  footLine(s, "B and C take the place of Our Offerings, so the page does not get longer.");
  s.addNotes("Three options for the home page. A stays where it is. B or C takes the section below the banner. C is for the visitor who will not answer questions. The next three pages show each one being used.");
}

/* ═══ 4–6 · Home page options ════════════════════════════════════════════ */
const OPTIONS = [
  { part:"The Home Page · Option A of 3", title:"Explore User Personas",
    img:"home-a", live:true, rec:false,
    caption:"The panel as it is on the site today.",
    what:"The panel already on the home page. It shows one group at a time, and you move between them with the arrows.",
    how:["Tap the arrows to move between the groups","Tap a group to open the Schemes page for that group"],
    why:["The smallest change: only the link behind each picture is new","The pictures work in any language"],
    notes:"The panel already on the home page: one group at a time, moved with arrows. The list of groups is the same eleven the other options use, in the same order. Today, choosing a group filters nothing on the Schemes page; every option fixes that." },
  { part:"The Home Page · Option B of 3", title:"Two Questions",
    vid:"home-b", live:false, rec:true,
    caption:"Recorded: Scheduled Castes, then Scholarships. Then Senior Citizens with the second question skipped.",
    what:"Two short questions on the home page: who you are, and what kind of support you need.",
    how:["Question 2 can be skipped, which shows everything for the group","The answer shows three schemes, each with a link to its own page","One more link opens the Schemes page, already filtered to the same two answers"],
    why:["Both questions change what you see; nothing is asked for its own sake","A visitor gets an answer without leaving the home page"],
    notes:"Two short questions over the Department's own list of schemes. The second may be skipped, which widens the list. The answer shows both choices, three schemes, and a link to the Schemes page filtered to the same choices. There is no apply button here: the scheme's own page says where to apply. Before this can be built, every scheme has to be tagged on both lists; that is on the page near the end." },
  { part:"The Home Page · Option C of 3", title:"One Tap",
    vid:"home-c", live:false, rec:false,
    caption:"Recorded: Scheduled Castes, Senior Citizens, Transgender Persons, Voluntary Organisations. One tap each.",
    what:"A row of the groups. Pick yours and the schemes appear. No questions asked.",
    how:["The first band is the portal or helpline the Department runs for that group","Below it, the schemes for the group, sorted by what they give","Each scheme links to its page, and one link opens the full list"],
    why:["One tap and nothing to answer","The portal a group already uses comes first"],
    notes:"A row of the groups. Tapping one shows the portal or helpline for that group first, where the Department has one, then the schemes that name the group, sorted by what they give. Each links to its own page. The larger groups get long lists, which is why the list is cut at three per kind of support with a link to the rest." },
];
const SCHEMES_PAGE = [
  { part:"The Schemes Page · Option A of 2", title:"Pictures of the Groups, with Cards",
    vid:"scheme-a", live:false, rec:false,
    caption:"Recorded: Safai Karamcharis, Transgender Persons, then Senior Citizens.",
    what:"Every group as a picture in one row. Pick one and its schemes appear as cards.",
    how:["Pick a group from the row; it scrolls sideways","Category and Organisation narrow the list further","Cards show what a scheme gives; nine to a page"],
    why:["A picture for every group, so you spot yours at a glance","The same groups as the home page, so the same idea is met twice"],
    notes:"The layout from before the review, with the review's changes: one filter, the group, no counts, and paged cards so the page keeps its height. This is for browsing." },
  { part:"The Schemes Page · Option B of 2", title:"Filter Panel with a Table",
    vid:"scheme-b", live:false, rec:true,
    caption:"Recorded: Other Backward Classes ticked, then Students added, then one removed, then Reset.",
    what:"A panel of the groups on the left, where more than one can be ticked, and a table on the right.",
    how:["Tick one or more groups; the chosen ones show above the table","Category and Organisation narrow the list further","The table says what each scheme gives and who it is for"],
    why:["Two groups can be compared in one list","A group that would leave nothing is greyed, never counted"],
    notes:"The reference layout with the filter panel: tick one or more groups, and the table on the right says what each scheme gives and who it is for, ten rows a page, no counts. This is for comparing and deciding." },
];
const ASSISTANT = [
  { part:"The Assistant · Samajik Sahayak", title:"The Same Two Questions, in Chat",
    vid:"assistant", live:true, rec:true, pill:"THE CHAT IS ON THE SITE · THE TWO QUESTIONS ARE NEW",
    caption:"Recorded: the assistant opened from an ordinary page. Scheduled Castes, then Loans and Credit.",
    what:"The chat button in the corner of every page asks the same two questions, one at a time.",
    how:["Pick your group, then the kind of support","The reply names the schemes and offers to open each one","It reads the same list as the home page, so the answers always match"],
    why:["Reachable from every page, even one that leads nowhere else","One question per screen suits a phone"],
    notes:"The same two questions, asked one at a time in the chat window that is already built and reachable from every page. It reads the same list as the home page, so it can never name different schemes for the same person. It says plainly that it cannot decide or change an application." },
];

function optionPage(o) {
  const s = slide(false);
  s.addText(o.title.toUpperCase(), { x:M, y:0.48, w:CW, h:0.24, isTextBox:true, margin:0, fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.eyebrow, color:MUTE });
  s.addText(o.part, { x:M, y:0.76, w:CW-2.6, h:0.56, isTextBox:true, margin:0, fontFace:F, fontSize:T.h1, bold:true, color:DARK });
  let px = M;
  px += pill(s, px, 1.42, o.pill || (o.live?"ON THE SITE TODAY":"TO BE BUILT"), o.live?SURF:BLUE_50, o.live?MUTE:BLUE_TXT) + 0.14;
  const y0 = 1.95, boxW = 7.1, boxH = 4.45;
  const m = media(s, o, M, y0, boxW, boxH);
  s.addText((o.vid ? "▶  " : "") + o.caption, { x:M, y:m.iy+m.ih+0.14, w:boxW, h:0.42, isTextBox:true, margin:0, fontFace:F, fontSize:T.micro, color:MUTE, lineSpacingMultiple:1.15 });
  const rx = M+boxW+0.5, rw = W-M-rx;
  let y = y0;
  s.addText("WHAT IT IS", { x:rx, y, w:rw, h:0.22, isTextBox:true, margin:0, fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.eyebrow, color:DARK });
  const cpl = Math.floor((rw*72)/(T.body*0.6));
  const wh = Math.max(1, Math.ceil(o.what.length/cpl))*0.21 + 0.06;
  s.addText(o.what, { x:rx, y:y+0.3, w:rw, h:wh, isTextBox:true, margin:0, valign:'top', fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.15 });
  y += 0.3 + wh + 0.22;
  y = list(s, rx, y, rw, "How it works", o.how, BLUE_TXT);
  y = list(s, rx, y, rw, "Why it helps", o.why, BLUE_TXT);
  const bottom = PH - 0.45;
  if (y > bottom) throw new Error(`overflows the page on "${o.title}" (${y.toFixed(2)} > ${bottom})`);
  s.addNotes(o.notes + (o.vid ? " Press play: it is a real page being used, not an animation." : ""));
}
OPTIONS.forEach(optionPage);

/* ═══ 7 · The Schemes page — two options ════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "The Schemes Page", "Two Options",
    "Where a person lands from the home page, and where officers and voluntary organisations work.");
  const items = [
    ["A","Pictures of the Groups, with Cards","scheme-a","A picture for every group in one row, then cards. For browsing.","OPTION A"],
    ["B","Filter Panel with a Table","scheme-b","Tick one or more groups on the left; the table says who each scheme is for. For comparing.","OPTION B"],
  ];
  const cw = (CW-0.6)/2;
  items.forEach((it,i)=>{
    const x = M + i*(cw+0.6);
    s.addText(it[0], { x, y:y0, w:0.55, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:28, bold:true, color:BLUE_TXT });
    s.addText(it[1], { x:x+0.55, y:y0+0.08, w:cw-0.55, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:T.lead, bold:true, color:DARK });
    const m = media(s, { img:it[2] }, x, y0+0.62, cw, cw*0.625);
    pill(s, x, m.iy+m.ih+0.16, it[4], SURF, MUTE);
    s.addText(it[3], { x, y:m.iy+m.ih+0.54, w:cw, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:T.body, color:INK, lineSpacingMultiple:1.2 });
  });
  s.addNotes("The internal page. Two arrangements of the same two filters. The next two pages show each being used.");
}
SCHEMES_PAGE.forEach(optionPage);

/* ═══ 10 · The assistant ════════════════════════════════════════════════ */
ASSISTANT.forEach(optionPage);

/* ═══ 11 · In summary ══════════════════════════════════════════════════ */
{
  const s = slide(true);
  s.addText("IN SUMMARY", { x:M, y:0.7, w:CW, h:0.24, isTextBox:true, margin:0, fontFace:F, fontSize:T.label, bold:true, charSpacing:TRACK.eyebrow, color:BLUE_100 });
  s.addText("Six Options, Three Parts of the Site", { x:M, y:1.0, w:CW, h:0.7, isTextBox:true, margin:0, fontFace:F, fontSize:34, bold:true, color:WHITE });
  s.addText("Every option starts from who you are. Each part is decided on its own.", {
    x:M, y:1.75, w:CW, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:T.lead, color:BLUE_100, lineSpacingMultiple:1.2 });
  const rows = [
    ["The home page","A · Explore User Personas","On the site today. One group at a time."],
    ["","B · Two Questions","Who you are, then what you need. Three schemes and a link to all of them."],
    ["","C · One Tap","Pick your group. Its portal first, then its schemes."],
    ["The Schemes page","A · Pictures of the Groups, with Cards","Every group in one row, then cards. For browsing."],
    ["","B · Filter Panel with a Table","Tick groups on the left, table on the right. For comparing."],
    ["The assistant","Samajik Sahayak","The same two questions, in the chat window on every page."],
  ];
  const rowY = 2.95, rowH = 0.62;
  rows.forEach((r,i)=>{
    const y = rowY + i*rowH;
    if (r[0]) s.addShape(pres.ShapeType.line, { x:M, y:y-0.08, w:CW, h:0, line:{color:BLUE_DEEP, width:1} });
    s.addText(r[0], { x:M, y:y+0.04, w:3.0, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:14, color:BLUE_100 });
    s.addText(r[1], { x:M+3.1, y:y+0.04, w:3.6, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:15, bold:true, color:WHITE });
    s.addText(r[2], { x:M+6.8, y:y+0.06, w:CW-6.8, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:13, color:WHITE, transparency:15 });
  });
  s.addShape(pres.ShapeType.line, { x:M, y:rowY+rows.length*rowH-0.08, w:CW, h:0, line:{color:BLUE_DEEP, width:1} });
  s.addText("Before any of them is built: the two lists are confirmed by the divisions, every scheme is tagged on both, and the development team estimates the re-tagging.", {
    x:M, y:2.28, w:CW, h:0.5, isTextBox:true, margin:0, fontFace:F, fontSize:13, color:WHITE, lineSpacingMultiple:1.2 });
  s.addText("Options that share a mechanism: Home B with Schemes B, the two lists; Home C with Schemes A, the picture row.", {
    x:M, y:rowY+rows.length*rowH+0.1, w:CW, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:12.5, color:BLUE_100 });
  s.addNotes("The six options, in one place. Each part of the site is decided on its own; any combination can be taken. Whatever is chosen, the two lists have to be confirmed, every scheme tagged on both, and the re-tagging estimated before the build starts.");
}

pres.writeFile({ fileName: "MoSJE-Service-Discovery-Options.pptx" }).then(f => console.log("wrote", f));
