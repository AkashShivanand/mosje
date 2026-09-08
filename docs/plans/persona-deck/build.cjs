/**
 * Service Discovery — options placed before the Department.
 * One page per option, each carrying the screen as drawn in the design file.
 * Noto Sans throughout. Every colour is a resolved SAMAVESH token.
 *
 * Figures: scheme counts and Target Group filter counts were measured on the live
 * site, dosje.gov.in, on 8 September 2026. The 141 previously quoted came from a
 * content export dated 13 June 2026 and is superseded.
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
   tell a label from a body line at a glance instead of reading it first. The
   previous scale ran label 8.5 / body 9.5 — a single point apart, which is why
   the four blocks in an option record read as one grey wall.
   Tracking is in points, so 1.0 on 8.5pt type is ~12% of the em and shatters a
   word: "O U R  R E C O M M E N D AT I O N". Labels track 0.6, pills 0.5. */
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
  /* the marker carries the block's colour so a list reads as a list at a glance,
     while the sentence itself stays in the body colour */
  const runs = [];
  body.forEach((t,i)=>{
    if (body.length>1) runs.push({ text:"\u00B7  ", options:{ color:labelColor||MUTE, bold:true } });
    runs.push({ text:t, options:{ breakLine:i<body.length-1 } });
  });
  s.addText(runs, { x, y:y+0.21, w, h, isTextBox:true, margin:0, fontFace:F,
    fontSize:T.body, color:INK, lineSpacingMultiple:1.2 });
  return y+0.21+h+0.17;
}

/* ═══ 1 · Title ═══════════════════════════════════════════════════════════ */
{
  const s = slide(true);
  s.addImage({ path:A("emblem-white.png"), x:M, y:0.72, w:0.6, h:0.84 });
  s.addText("Government of India\nMinistry of Social Justice & Empowerment\nDepartment of Social Justice & Empowerment", {
    x:M+0.8, y:0.78, w:6.6, h:0.78, isTextBox:true, margin:0, fontFace:F, fontSize:11.5, color:BLUE_100, lineSpacingMultiple:1.2 });

  s.addText("How Citizens Find Schemes", { x:M, y:2.5, w:8.6, h:1.6, isTextBox:true, margin:0,
    fontFace:F, fontSize:40, bold:true, color:WHITE, lineSpacingMultiple:1.06 });
  s.addText("Six options placed before the Department, on three parts of the website", {
    x:M, y:4.16, w:9.3, h:0.36, isTextBox:true, margin:0, fontFace:F, fontSize:15, color:BLUE_100 });

  s.addText("134", { x:10.2, y:2.5, w:2.4, h:1.05, isTextBox:true, margin:0, align:"right",
    fontFace:F, fontSize:54, bold:true, color:BLUE_200 });
  s.addText("schemes published\non dosje.gov.in", { x:10.2, y:3.6, w:2.4, h:0.56, isTextBox:true, margin:0,
    align:"right", fontFace:F, fontSize:11, color:BLUE_100, lineSpacingMultiple:1.18 });

  s.addShape(pres.ShapeType.line, { x:M, y:5.4, w:CW, h:0, line:{color:BLUE_DEEP, width:1} });
  s.addText("Each option is shown as the screen drawn for it, with what it does, what favours it and what counts against it. The assistant also carries a recorded walkthrough.", {
    x:M, y:5.66, w:8.8, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:12.5, color:WHITE });
  s.addText("Counts taken from dosje.gov.in on 8 September 2026 · MoSJE Design Research", {
    x:M, y:5.98, w:8.8, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:11, color:BLUE_100 });
  s.addNotes("Sent ahead of the meeting, so it reads without a presenter. Six options, one to a page, each with the screen drawn for it. Approval is sought on three parts of the site, and for the preparatory work.");
}

/* ═══ 2 · The map ════════════════════════════════════════════════════════ */
{
  const s = slide(true);
  s.addText("WHAT IS PLACED BEFORE YOU", { x:M, y:0.78, w:CW, h:0.24, isTextBox:true, margin:0,
    fontFace:F, fontSize:10, bold:true, charSpacing:1.3, color:BLUE_100 });
  s.addText("Three Parts of the Site. Six Options.", { x:M, y:1.08, w:CW, h:0.6, isTextBox:true, margin:0,
    fontFace:F, fontSize:32, bold:true, color:WHITE });
  s.addText("The site publishes 134 schemes. Its Target Group filter offers no value for women and girls, transgender persons, persons with disabilities, victims of atrocities or voluntary organisations — and 23 schemes carry no group at all. These options address that. Each part is settled on its own.", {
    x:M, y:1.8, w:10.6, h:0.66, isTextBox:true, margin:0, fontFace:F, fontSize:13, color:BLUE_100, lineSpacingMultiple:1.22 });

  const cards = [
    ["1","The Home Page","Three options","Where most people arrive for the first time.",
      ["A · Explore User Personas — already on the site","B · Find support for you — five questions","C · Find offerings for you — one tap"]],
    ["2","The Schemes Page","Two options","Where a person compares, and where officers and voluntary organisations work.",
      ["A · Pictures of the nine groups, with cards","B · Filter panel with a table of schemes"]],
    ["3","The Assistant","One option","Reachable from every page, including pages that lead nowhere else.",
      ["A · Samajik Sahayak — the same five questions, in chat"]],
  ];
  const cw = (CW-0.64)/3;
  cards.forEach((c,i)=>{
    const x = M + i*(cw+0.32);
    s.addShape(pres.ShapeType.rect, { x, y:2.78, w:cw, h:3.44, fill:{color:BLUE_DEEP}, line:{color:BLUE_DEEP,width:0} });
    s.addText(c[0], { x:x+0.32, y:2.98, w:cw-0.64, h:0.66, isTextBox:true, margin:0, fontFace:F, fontSize:40, bold:true, color:BLUE_200 });
    s.addText(c[1], { x:x+0.32, y:3.7, w:cw-0.64, h:0.32, isTextBox:true, margin:0, fontFace:F, fontSize:18, bold:true, color:WHITE });
    s.addText(c[2].toUpperCase(), { x:x+0.32, y:4.06, w:cw-0.64, h:0.22, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, bold:true, charSpacing:1.1, color:BLUE_200 });
    s.addText(c[3], { x:x+0.32, y:4.34, w:cw-0.64, h:0.6, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:BLUE_100, lineSpacingMultiple:1.18 });
    s.addText(c[4].map((t,k)=>({text:t, options:{breakLine:k<c[4].length-1}})), {
      x:x+0.32, y:4.98, w:cw-0.64, h:1.1, isTextBox:true, margin:0, fontFace:F, fontSize:10, color:WHITE, lineSpacingMultiple:1.2 });
  });
  s.addText("Whichever options are approved, the scheme records must be tagged first. That work is set out under “What Has to Be Done First”.", {
    x:M, y:6.44, w:CW, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:11, color:BLUE_100 });
}

/* ═══ 3–8 · One option, one page, with the screen as drawn ════════════ */
const OPTIONS = [
  { surface:"The Home Page · Option A of 3", title:"Explore User Personas",
    img:"home-a", live:true, rec:false,
    caption:"The panel as drawn: one group at a time, moved with the arrows beneath it.",
    what:"A picture of one group at a time, with arrows to move between them. It is on the home page today.",
    does:"Looks at the pictures, sees one that matches, and taps through to the Schemes page.",
    pros:["Already built and already on the page — the cheapest of all six",
          "Pictures help people who read slowly, or read another language",
          "Recognising yourself is easier than describing yourself",
          "Adds no height to a home page that already runs long"],
    cons:["One group at a time, behind arrows — you cannot see whether you are represented without clicking",
          "Sorts by group alone, not by stage of life, need or State",
          "Today, choosing a group does not filter the Schemes page; the panel's own promise goes unmet"],
    view:"Repair it, but do not rely on it alone. It serves the visitor who recognises a picture." },

  { surface:"The Home Page · Option B of 3", title:"Find support for you",
    img:"home-b", live:false, rec:true,
    caption:"Question two of five, and the count at the top right — 45 here, and 6 once all five are answered.",
    what:"Five short questions, any of which may be skipped. Skipping widens the answer rather than ending it.",
    does:"Answers up to five questions — group, stage of life, kind of help, State — and is shown the schemes that list them, each with a place to apply.",
    pros:["Reads stage of life, need and State, not group alone — which is how entitlement actually works",
          "No sign-in, no Aadhaar; nothing answered is stored",
          "The falling count is honest feedback — the visitor watches the answer narrow",
          "Directs a person with a disability to DEPwD, rather than showing an empty page",
          "Ends at a place to apply, not at a page of text"],
    cons:["Every scheme must be tagged on four axes before it works at all",
          "Adds roughly 150 pixels to the home page, unless it replaces Our Offerings",
          "Asks about caste at the second question — the wording needs the Department's approval"],
    view:"Recommended for the home page. It answers the question a citizen actually arrives with." },

  { surface:"The Home Page · Option C of 3", title:"Find offerings for you",
    img:"home-c", live:false, rec:false,
    caption:"The nine groups as a single row. Choosing one opens the portal, the scheme and the complaint route beneath it.",
    what:"A row of groups. Tapping one shows the portal, the scheme and the complaint route for that group.",
    does:"Taps the group that describes them and sees three things they can act on, without answering anything.",
    pros:["One tap, with no questions to answer",
          "Shows portals, schemes and complaint routes together, which no other option does",
          "Each row ends at a real place to apply",
          "Puts the single-window promise on the home page itself",
          "Compact — one strip and three rows"],
    cons:["Every scheme must be tagged before it works",
          "Reads group alone, so it is less exact than the five questions",
          "Needs space on the home page, unless it replaces Our Offerings"],
    view:"A good companion to Option B for the visitor who will not answer questions. Not a replacement for it." },

  { surface:"The Schemes Page · Option A of 2", title:"Pictures of the Nine Groups, with Cards",
    img:"scheme-a", live:false, rec:false,
    caption:"All nine groups shown at once, above a card for each scheme.",
    what:"A row of pictures for the nine groups, above cards for each scheme.",
    does:"Picks their group from the pictures, then reads the scheme cards below.",
    pros:["All nine groups visible at once — no arrows, no scrolling to find yourself",
          "Pictures work across languages and reading levels",
          "Cards feel welcoming rather than administrative",
          "Consistent with how the home page presents groups, so the idea is met twice"],
    cons:["Far fewer schemes fit on one screen",
          "A card has no room for who runs the scheme, or whether it is Central or State",
          "Two schemes cannot be compared side by side",
          "Nine illustrations to commission and to keep up to date"],
    view:"Not recommended for this page. The pictures are welcoming, but this is the page where people compare." },

  { surface:"The Schemes Page · Option B of 2", title:"Filter Panel with a Table of Schemes",
    img:"scheme-b", live:false, rec:true,
    caption:"Two filters ticked together — Scheduled Caste and OBC — and the table beside them, showing who runs each scheme.",
    what:"Filters down the left; a table on the right showing what a person gets, who runs it, and whether it is Central or State.",
    does:"Ticks the filters that apply and reads the schemes side by side to see which to apply for.",
    pros:["Filters combine — group and stage of life and kind of help can be asked for together",
          "Shows who runs each scheme, and whether it is Central or State",
          "Many more schemes visible, and comparable",
          "A count beside each filter warns before an empty result, rather than after it"],
    cons:["A table reads as a record rather than an invitation",
          "Asks the citizen to use the site's own words",
          "Needs more care on a small screen"],
    view:"Recommended for the Schemes page. Option A's pictures can sit above this panel if the Department wishes to keep them." },

  { surface:"The Assistant · Option A of 1", title:"Samajik Sahayak — the Same Five Questions, in Chat",
    vid:"chatbot", live:true, rec:true,
    caption:"Recorded walkthrough of the assistant the design system ships, opened from an ordinary page and answered one question at a time.",
    what:"The same five questions, asked one at a time in a chat window that is already built and reachable from every page. What is shown is the design system's own assistant, not a copy of it.",
    does:"Opens the assistant from whichever page they are on, answers on their phone, and is given schemes to open.",
    pros:["Reachable from every page, including pages that lead nowhere else",
          "One question per screen suits a mobile phone",
          "Works in Hindi without a second design",
          "Already built — only the scheme branch is new",
          "States plainly that it cannot decide or change an application"],
    cons:["A button in the corner is found only by those looking for it",
          "It covers the page on a small screen",
          "Harder to use with a screen reader"],
    view:"Recommended, alongside whichever home page option is approved. It reaches the person already lost on a page." },
];

OPTIONS.forEach(o => {
  const s = slide(false);
  /* Which part of the site, and which option of how many, is what a reader needs
     first — so it is the heading. The option's own name is the subheading beneath
     it. It used to be the other way round, with the part in small caps above, and
     a reader could not tell at a glance which page an option belonged to. */
  s.addText(o.surface, { x:M, y:0.44, w:CW, h:0.5, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.h1, bold:true, color:DARK });
  s.addText(o.title, { x:M, y:1.0, w:CW, h:0.34, isTextBox:true, margin:0,
    fontFace:F, fontSize:T.lead+2.5, color:BLUE_TXT });
  let px = M;
  px += pill(s, px, 1.46, o.live?"ALREADY ON THE SITE":"TO BE BUILT",
             o.live?SURF:BLUE_50, o.live?MUTE:BLUE_TXT) + 0.14;
  if (o.rec) pill(s, px, 1.46, "RECOMMENDED", BLUE_TXT, WHITE);

  /* The frames come off the design file at their own proportions — a 2.3:1 strip
     for the persona panel, a 1.35:1 page for the schemes grid. Fit each inside one
     box rather than forcing a shape on it, so nothing is stretched or cropped twice. */
  const y0 = 1.92, boxW = 5.9, boxH = 4.2;
  const src = o.vid ? A(`video/${o.vid}.png`) : A(`figma/${o.img}.png`);
  const im = imageSize(src);
  const sc = Math.min(boxW/im.w, boxH/im.h);
  const iw = im.w*sc, ih = im.h*sc;
  /* top-aligned, so a wide short frame does not float in the middle of the column
     with the caption stranded far beneath it */
  const ix = M + (boxW-iw)/2, iy = y0;
  s.addShape(pres.ShapeType.rect, { x:ix-0.03, y:iy-0.03, w:iw+0.06, h:ih+0.06,
    fill:{color:WHITE}, line:{color:HAIR, width:0.75} });
  if (o.vid) {
    s.addMedia({ type:"video", path:A(`video/${o.vid}.mp4`), cover:b64(src),
      x:ix, y:iy, w:iw, h:ih });
  } else {
    s.addImage({ path:src, x:ix, y:iy, w:iw, h:ih });
  }
  s.addText((o.vid ? "\u25B6  " : "") + o.caption, { x:M, y:iy+ih+0.14, w:boxW, h:0.34,
    isTextBox:true, margin:0, fontFace:F, fontSize:T.caption, color:MUTE, lineSpacingMultiple:1.15 });

  const rx = M+boxW+0.5, rw = CW-boxW-0.5;
  let y = y0;
  y = field(s, rx, y, rw, "What it is", [o.what]);
  y = field(s, rx, y, rw, "What a citizen does", [o.does]);
  y = field(s, rx, y, rw, "In its favour", o.pros, BLUE_TXT);
  y = field(s, rx, y, rw, "Against it", o.cons, SAFF_TXT);

  const bottom = PH - 0.78;
  if (y > bottom) throw new Error(`record overflows the page on "${o.title}" (${y.toFixed(2)} > ${bottom})`);

  /* No verdict and no note on the page. The RECOMMENDED pill beside the title is
     the single highlight and it says enough; a sentence repeating it under the
     screen was the same claim twice on one page. Everything else here is
     evidence, and the reader decides. */


  s.addNotes(o.vid
    ? `${o.title}. Press play — it is a real page being used, not an animation.`
    : `${o.title}. A working prototype of this option can be shown live on request.`);
});

/* ═══ 9 · How the options combine ═══════════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "Taken Together", "How the Options Combine",
    "The three parts are settled separately, so this is a set of courses open to the Department — not a single either-or.");
  const rows = [
    ["Minimum credible","Repair Option A","Option B","Later",
     "The persona panel finally delivers what it promises, and the Schemes page becomes usable. The cheapest route to a real improvement."],
    ["Recommended","Option B, with A repaired","Option B","Yes",
     "Two ways in for two kinds of visitor, one page that can genuinely be filtered, and a conversational route for the person already lost on a page."],
    ["Fullest","Option B, with A repaired","Option B, keeping A's pictures above the panel","Yes",
     "As above, and the Schemes page keeps the warmth of the pictures without losing the facts of the table."],
  ];
  const cols = [1.9, 2.3, 2.7, 0.95, 4.043];   // sums to CW exactly
  console.assert(Math.abs(cols.reduce((a,b)=>a+b,0) - CW) < 0.01, 'combine table columns must sum to the content width');
  const heads = ["Course","Home page","Schemes page","Assistant","What it means for the citizen"];
  let x = M;
  heads.forEach((h,i)=>{ s.addText(h.toUpperCase(), { x, y:y0, w:cols[i], h:0.2, isTextBox:true, margin:0,
    fontFace:F, fontSize:8.5, bold:true, charSpacing:1, color:MUTE }); x += cols[i]; });
  let ry = y0+0.3;
  rows.forEach((r,i)=>{
    const rec = r[0]==="Recommended";
    const h = 1.14;
    s.addShape(pres.ShapeType.rect, { x:M, y:ry, w:CW, h,
      fill:{color: rec?BLUE_50:(i%2?SURF:WHITE)}, line:{color: rec?BLUE:HAIR, width: rec?1.25:0.75} });
    let cx = M+0.16;
    r.forEach((cell,k)=>{
      s.addText(cell, { x:cx, y:ry+0.14, w:cols[k]-0.24, h:h-0.28, isTextBox:true, margin:0,
        fontFace:F, fontSize: k===4?9.5:10.5, bold: k===0,
        color: k===0 ? (rec?DARK:INK) : (k===4?INK_MUTE:INK), lineSpacingMultiple:1.14 });
      cx += cols[k];
    });
    ry += h + 0.1;
  });
  sourceLine(s, "The three parts are independent: a choice on one does not settle the others.");
}

/* ═══ 10 · Safeguards ══════════════════════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "Safeguards", "Five Commitments That Hold Whichever Options Are Approved", null);
  const items = [
    ["Nothing here decides a case",
     "No screen and no message states that a person is eligible. The wording throughout is that a scheme lists the person as its target group, and that the sanctioning authority decides. A citizen who acts on a wrong assurance from a government website bears a real cost, and the Department bears the complaint."],
    ["The boundary of the Department is stated, not hidden",
     "Persons with disabilities are served by the Department of Empowerment of Persons with Disabilities, in this same Ministry. Anyone who indicates a disability is told so plainly and directed to depwd.gov.in, rather than being shown an empty result."],
    ["No personal information is collected",
     "No sign-in, no Aadhaar, no telephone number, no name and no income figure. Group and stage of life are chosen from fixed options, never typed, and nothing is stored."],
    ["Nobody is left at a dead end",
     "Every question can be skipped, and skipping widens the answer instead of ending it. Where nothing matches, the screen says so plainly and offers the way back."],
    ["No number is published from a design file",
     "Only Elderline 14567 is treated as confirmed. Every other helpline and office contact must be verified by the division that owns it before it appears."],
  ];
  let y = y0 + 0.14;
  items.forEach((it,i)=>{
    s.addText(String(i+1), { x:M, y:y+0.02, w:0.42, h:0.32, isTextBox:true, margin:0,
      fontFace:F, fontSize:17, bold:true, color:BLUE_TXT });
    s.addText(it[0], { x:M+0.5, y, w:CW-0.5, h:0.26, isTextBox:true, margin:0,
      fontFace:F, fontSize:13.5, bold:true, color:DARK });
    s.addText(it[1], { x:M+0.5, y:y+0.28, w:CW-0.5, h:0.56, isTextBox:true, margin:0,
      fontFace:F, fontSize:10.5, color:INK, lineSpacingMultiple:1.2 });
    y += 1.02;
    if (i < items.length-1) s.addShape(pres.ShapeType.line, { x:M, y:y-0.14, w:CW, h:0, line:{color:HAIR, width:0.75} });
  });
  sourceLine(s, "These hold across all six options and are not traded against for speed.");
}

/* ═══ 11 · What is proposed ════════════════════════════════════════════════ */
{
  const s = slide(true);
  s.addText("IN SUMMARY", { x:M, y:0.7, w:CW, h:0.24, isTextBox:true, margin:0,
    fontFace:F, fontSize:10, bold:true, charSpacing:1.3, color:BLUE_100 });
  s.addText("What the Design Team Recommends", { x:M, y:1.0, w:CW, h:0.6, isTextBox:true, margin:0,
    fontFace:F, fontSize:32, bold:true, color:WHITE });

  const rows = [
    ["1","The home page","Option B, with Option A repaired","It answers the question a citizen arrives with; A still serves the visitor who recognises a picture"],
    ["2","The Schemes page","Option B — filter panel with a table","This is the page where people compare, and a table can carry who runs it and where it applies"],
    ["3","The assistant","Yes — the same five questions, in chat","It reaches the person already lost on a page, and is largely built"],
  ];
  const rowY = 2.0, rowH = 0.82;
  [["THE PART OF THE SITE", M+0.7, 4.4],["OUR RECOMMENDATION", M+5.2, 4.2],["WHY", M+9.5, 2.4]]
    .forEach(c => s.addText(c[0], { x:c[1], y:rowY-0.3, w:c[2], h:0.22, isTextBox:true, margin:0,
      fontFace:F, fontSize:9, bold:true, charSpacing:1.1, color:BLUE_200 }));
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
  s.addText("Page 9 sets out how they combine, and what each combination means for a citizen.", {
    x:M+0.34, y:5.42, w:CW-0.68, h:0.32, isTextBox:true, margin:0, fontFace:F, fontSize:11.5, color:BLUE_100 });

  s.addNotes("The three parts are decided separately. If only one is settled today, the Schemes page is the one that changes most for the most people.");
}

pres.writeFile({ fileName: "MoSJE-Service-Discovery-Options.pptx" }).then(f => console.log("wrote", f));
