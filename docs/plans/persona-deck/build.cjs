/**
 * Service Discovery — options placed before the Department.
 * One page per option, each carrying a recorded walkthrough of a working prototype.
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

const slide = dark => { const s = pres.addSlide(); s.background = { color: dark?DARK:WHITE }; return s; };

function header(s, eyebrow, title, lede) {
  s.addText(eyebrow.toUpperCase(), { x:M, y:0.42, w:CW, h:0.22, isTextBox:true, margin:0,
    fontFace:F, fontSize:10, bold:true, charSpacing:1.2, color:MUTE });
  s.addText(title, { x:M, y:0.66, w:CW, h:0.46, isTextBox:true, margin:0,
    fontFace:F, fontSize:26, bold:true, color:DARK });
  if (!lede) return 1.24;
  s.addText(lede, { x:M, y:1.16, w:CW*0.92, h:0.3, isTextBox:true, margin:0,
    fontFace:F, fontSize:12, color:INK_MUTE });
  return 1.6;
}
function pill(s, x, y, label, fill, txt) {
  const w = 0.076*label.length + 0.3;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h:0.26, rectRadius:0.13,
    fill:{color:fill}, line:{color:fill, width:0} });
  s.addText(label, { x, y, w, h:0.26, isTextBox:true, margin:0, align:"center", valign:"middle",
    fontFace:F, fontSize:8.5, bold:true, charSpacing:0.9, color:txt });
  return w;
}
const sourceLine = (s, t) => s.addText(t, { x:M, y:PH-0.48, w:CW, h:0.24, isTextBox:true, margin:0,
  fontFace:F, fontSize:9, color:MUTE });

/** A labelled block in the option record. Returns the y the next block starts at. */
function field(s, x, y, w, label, body, labelColor) {
  s.addText(label.toUpperCase(), { x, y, w, h:0.18, isTextBox:true, margin:0,
    fontFace:F, fontSize:8.5, bold:true, charSpacing:1, color:labelColor||MUTE });
  const cpl = Math.floor((w*72)/(9.5*0.5));
  const lines = body.reduce((n,t)=>n+Math.max(1,Math.ceil(t.length/cpl)),0);
  const h = lines*0.166 + body.length*0.03 + 0.04;
  s.addText(body.map((t,i)=>({ text:(body.length>1?"·  ":"")+t, options:{ breakLine:i<body.length-1 } })), {
    x, y:y+0.18, w, h, isTextBox:true, margin:0, fontFace:F, fontSize:9.5, color:INK, lineSpacingMultiple:1.16 });
  return y+0.18+h+0.08;
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
  s.addText("Each option is shown as a recorded walkthrough of a working prototype, not a picture.", {
    x:M, y:5.66, w:8.8, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:12.5, color:WHITE });
  s.addText("Counts taken from dosje.gov.in on 8 September 2026 · MoSJE Design Research", {
    x:M, y:5.98, w:8.8, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:11, color:BLUE_100 });
  s.addText("Accompanies the design file\nMoSJE (WIP) — Service Discovery", { x:9.6, y:5.66, w:3.0, h:0.6,
    isTextBox:true, margin:0, align:"right", fontFace:F, fontSize:11, color:BLUE_100, lineSpacingMultiple:1.18 });
  s.addNotes("Sent ahead of the meeting, so it reads without a presenter. Six options, one to a page, each with a recorded walkthrough. Approval is sought on three parts of the site, and for the preparatory work.");
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

/* ═══ 3–8 · One option, one page, with its recorded walkthrough ═════════ */
const OPTIONS = [
  { surface:"The Home Page · Option A of 3", title:"Explore User Personas",
    vid:"home-a", live:true, rec:false,
    caption:"Recorded walkthrough. Moving between groups with the arrows; each shows how many schemes list it.",
    what:"A picture of one group at a time, with arrows to move between them. It is on the home page today.",
    does:"Looks at the pictures, sees one that matches, and taps through to the Schemes page.",
    pros:["Already built and already on the page — the cheapest of all six",
          "Pictures help people who read slowly, or read another language",
          "Recognising yourself is easier than describing yourself",
          "Adds no height to a home page that already runs long"],
    cons:["One group at a time, behind arrows — you cannot see whether you are represented without clicking",
          "Sorts by group alone, not by stage of life, need or State",
          "Today, choosing a group does not filter the Schemes page; the panel's own promise goes unmet"],
    needs:"Make the choice actually open the Schemes page already filtered. This repair is needed in any case — a panel that promises to show services made for you, and then does not, is worse than no panel.",
    view:"Repair it, but do not rely on it alone. It serves the visitor who recognises a picture." },

  { surface:"The Home Page · Option B of 3", title:"Find support for you",
    vid:"home-b", live:false, rec:true,
    caption:"Recorded walkthrough. Five questions answered; the count falls from 26 to 3, then the schemes are listed.",
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
    needs:"Tag all 134 scheme records — the same work every other option needs. Approve the wording of the group question and the reason shown for asking it.",
    view:"Recommended for the home page. It answers the question a citizen actually arrives with." },

  { surface:"The Home Page · Option C of 3", title:"Find offerings for you",
    vid:"home-c", live:false, rec:false,
    caption:"Recorded walkthrough. Three groups tapped in turn; the last is routed to the sibling department.",
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
    needs:"Tag all 134 scheme records, and settle which three items are shown for each group.",
    view:"A good companion to Option B for the visitor who will not answer questions. Not a replacement for it." },

  { surface:"The Schemes Page · Option A of 2", title:"Pictures of the Nine Groups, with Cards",
    vid:"scheme-a", live:false, rec:false,
    caption:"Recorded walkthrough. Choosing a group from the pictures; the cards below change with it.",
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
    needs:"Tag all 134 scheme records, and commission nine illustrations.",
    view:"Not recommended for this page. The pictures are welcoming, but this is the page where people compare." },

  { surface:"The Schemes Page · Option B of 2", title:"Filter Panel with a Table of Schemes",
    vid:"scheme-b", live:false, rec:true,
    caption:"Recorded walkthrough. Group, stage of life and kind of help ticked together — the filters combine.",
    what:"Filters down the left; a table on the right showing what a person gets, who runs it, and whether it is Central or State.",
    does:"Ticks the filters that apply and reads the schemes side by side to see which to apply for.",
    pros:["Filters combine — group and stage of life and kind of help can be asked for together",
          "Shows who runs each scheme, and whether it is Central or State",
          "Many more schemes visible, and comparable",
          "A count beside each filter warns before an empty result, rather than after it"],
    cons:["A table reads as a record rather than an invitation",
          "Asks the citizen to use the site's own words",
          "Needs more care on a small screen"],
    needs:"Tag all 134 scheme records, including who runs each one and whether it is Central or State.",
    view:"Recommended for the Schemes page. Option A's pictures can sit above this panel if the Department wishes to keep them." },

  { surface:"The Assistant · Option A of 1", title:"Samajik Sahayak — the Same Five Questions, in Chat",
    vid:"chatbot", live:true, rec:true,
    caption:"Recorded walkthrough. Opened from an ordinary page, then answered one question at a time.",
    what:"The same five questions, asked one at a time in a chat window that is already built and reachable from every page.",
    does:"Opens the assistant from whichever page they are on, answers on their phone, and is given schemes to open.",
    pros:["Reachable from every page, including pages that lead nowhere else",
          "One question per screen suits a mobile phone",
          "Works in Hindi without a second design",
          "Already built — only the scheme branch is new",
          "States plainly that it cannot decide or change an application"],
    cons:["A button in the corner is found only by those looking for it",
          "It covers the page on a small screen",
          "Harder to use with a screen reader"],
    needs:"Tag all 134 scheme records, and ask the existing vendor to add the scheme branch.",
    view:"Recommended, alongside whichever home page option is approved. It reaches the person already lost on a page." },
];

OPTIONS.forEach(o => {
  const s = slide(false);
  header(s, o.surface, o.title, null);
  let px = M;
  px += pill(s, px, 1.18, o.live?"ALREADY ON THE SITE":"TO BE BUILT",
             o.live?SURF:BLUE_50, o.live?MUTE:BLUE_TXT) + 0.14;
  if (o.rec) pill(s, px, 1.18, "RECOMMENDED", BLUE_TXT, WHITE);

  const y0 = 1.64, vw = 5.9, vh = vw/1.6;
  s.addShape(pres.ShapeType.rect, { x:M-0.03, y:y0-0.03, w:vw+0.06, h:vh+0.06,
    fill:{color:WHITE}, line:{color:HAIR, width:0.75} });
  s.addMedia({ type:"video", path:A(`video/${o.vid}.mp4`), cover:b64(A(`video/${o.vid}.png`)),
    x:M, y:y0, w:vw, h:vh });
  s.addText("▶  " + o.caption, { x:M, y:y0+vh+0.12, w:vw, h:0.34, isTextBox:true, margin:0,
    fontFace:F, fontSize:9, color:MUTE, lineSpacingMultiple:1.1 });

  const rx = M+vw+0.5, rw = CW-vw-0.5;
  let y = y0;
  y = field(s, rx, y, rw, "What it is", [o.what]);
  y = field(s, rx, y, rw, "What a citizen does", [o.does]);
  y = field(s, rx, y, rw, "In its favour", o.pros, BLUE_TXT);
  y = field(s, rx, y, rw, "Against it", o.cons, SAFF_TXT);
  y = field(s, rx, y, rw, "What the Department must do first", [o.needs]);

  const vy = 6.22;
  if (y > vy) throw new Error(`record overflows the view box on "${o.title}" (${y.toFixed(2)} > ${vy})`);
  s.addShape(pres.ShapeType.rect, { x:rx, y:vy, w:rw, h:0.72,
    fill:{color:o.rec?BLUE_50:SURF}, line:{color:o.rec?BLUE:HAIR, width:o.rec?1.25:0.75} });
  s.addText("OUR RECOMMENDATION", { x:rx+0.16, y:vy+0.1, w:rw-0.32, h:0.18, isTextBox:true, margin:0,
    fontFace:F, fontSize:8.5, bold:true, charSpacing:1, color:MUTE });
  s.addText(o.view, { x:rx+0.16, y:vy+0.3, w:rw-0.32, h:0.38, isTextBox:true, margin:0,
    fontFace:F, fontSize:10, bold:true, color:DARK, lineSpacingMultiple:1.14 });

  sourceLine(s, "Walkthrough recorded from a working prototype built to this design. Schemes shown are the Department's own, tagged as they would be after the preparatory work.");
  s.addNotes("Press play on the video. It is a real page being used, not an animation.");
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
    ["Not advised","Option B only","Option A only","Yes",
     "Three separate pieces of work building three copies of the same scheme information, with nothing to keep them in step."],
  ];
  const cols = [1.9, 2.3, 2.7, 0.95, 4.043];   // sums to CW exactly
  console.assert(Math.abs(cols.reduce((a,b)=>a+b,0) - CW) < 0.01, 'combine table columns must sum to the content width');
  const heads = ["Course","Home page","Schemes page","Assistant","What it means for the citizen"];
  let x = M;
  heads.forEach((h,i)=>{ s.addText(h.toUpperCase(), { x, y:y0, w:cols[i], h:0.2, isTextBox:true, margin:0,
    fontFace:F, fontSize:8.5, bold:true, charSpacing:1, color:MUTE }); x += cols[i]; });
  let ry = y0+0.3;
  rows.forEach((r,i)=>{
    const rec = r[0]==="Recommended", bad = r[0]==="Not advised";
    const h = 1.14;
    s.addShape(pres.ShapeType.rect, { x:M, y:ry, w:CW, h,
      fill:{color: rec?BLUE_50:(i%2?SURF:WHITE)}, line:{color: rec?BLUE:HAIR, width: rec?1.25:0.75} });
    let cx = M+0.16;
    r.forEach((cell,k)=>{
      s.addText(cell, { x:cx, y:ry+0.14, w:cols[k]-0.24, h:h-0.28, isTextBox:true, margin:0,
        fontFace:F, fontSize: k===4?9.5:10.5, bold: k===0,
        color: k===0 ? (rec?DARK:(bad?SAFF_TXT:INK)) : (k===4?INK_MUTE:INK), lineSpacingMultiple:1.14 });
      cx += cols[k];
    });
    ry += h + 0.1;
  });
  sourceLine(s, "The three parts are independent: a choice on one does not settle the others.");
}

/* ═══ 10 · What has to be done first ═══════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "Sequencing", "What Has to Be Done First",
    "Every option above reads the same information about each scheme. Until it is filled in, none of them can work — which is why the tagging comes before the design.");
  const stages = [
    ["Stage 0","Correcting What Is Wrong","2–3 weeks","Small effort · useful",
     "Remove the leftover control in the footer, correct the two spelling errors, make missing pages return a proper error, restore the accessibility page, and take down the empty scheme pages.",false],
    ["Stage 1","Filling In the Information","4–8 weeks","Large effort · essential",
     "Decide what is recorded about each scheme, and fill it in for all 134. Add the major schemes missing from dosje.gov.in. Rewrite the list of categories and groups.",true],
    ["Stage 2","Rebuilding the Pages","6–10 weeks","Sizeable effort · large gain",
     "The Schemes page with working filters and shareable links. Pages for each group. Plain actions on the home page. A simpler main menu.",false],
    ["Stage 3","The Questions and the Assistant","6–8 weeks","Moderate effort · large gain",
     "Build Find support for you, check it against accessibility standards, and test it with at least eight people from the groups it serves, in Hindi and one other language.",false],
    ["Stage 4","Bringing the Two Sites Together","Ongoing","Moderate effort · steady gain",
     "Publish the scheme information for myScheme. Move socialjustice.gov.in on to dosje.gov.in and close the older site. Make the fields compulsory when a scheme is added.",false],
  ];
  const cw = (CW - 4*0.22)/5;
  stages.forEach((p,i)=>{
    const x = M + i*(cw+0.22), on = p[5];
    s.addShape(pres.ShapeType.rect, { x, y:y0, w:cw, h:4.14, fill:{color:on?DARK:SURF}, line:{color:on?DARK:HAIR, width:0.75} });
    s.addText(p[0].toUpperCase(), { x:x+0.22, y:y0+0.24, w:cw-0.44, h:0.22, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, bold:true, charSpacing:1.1, color:on?BLUE_200:MUTE });
    s.addText(p[1], { x:x+0.22, y:y0+0.5, w:cw-0.44, h:0.64, isTextBox:true, margin:0,
      fontFace:F, fontSize:14, bold:true, color:on?WHITE:DARK, lineSpacingMultiple:1.08 });
    s.addText(p[2], { x:x+0.22, y:y0+1.2, w:cw-0.44, h:0.24, isTextBox:true, margin:0,
      fontFace:F, fontSize:11.5, bold:true, color:on?BLUE_200:BLUE_TXT });
    s.addText(p[3], { x:x+0.22, y:y0+1.48, w:cw-0.44, h:0.34, isTextBox:true, margin:0,
      fontFace:F, fontSize:9.5, color:on?BLUE_100:MUTE, lineSpacingMultiple:1.12 });
    s.addText(p[4], { x:x+0.22, y:y0+1.9, w:cw-0.44, h:2.0, isTextBox:true, margin:0,
      fontFace:F, fontSize:10, color:on?BLUE_100:INK, lineSpacingMultiple:1.2 });
  });
  s.addText("Stage 1 is the one piece only the Department can do. The Schemes page, the questions, the group pages and the assistant all wait on it.", {
    x:M, y:y0+4.36, w:CW, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:11.5, bold:true, color:DARK });
  sourceLine(s, "Times shown are estimates, not commitments.");
}

/* ═══ 11 · Safeguards ══════════════════════════════════════════════════ */
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

/* ═══ 12 · For approval ════════════════════════════════════════════════ */
{
  const s = slide(true);
  s.addText("SUBMITTED FOR APPROVAL", { x:M, y:0.7, w:CW, h:0.24, isTextBox:true, margin:0,
    fontFace:F, fontSize:10, bold:true, charSpacing:1.3, color:BLUE_100 });
  s.addText("What Is Proposed", { x:M, y:1.0, w:CW, h:0.6, isTextBox:true, margin:0,
    fontFace:F, fontSize:32, bold:true, color:WHITE });

  const rows = [
    ["1","The home page","Option B, with Option A repaired","Department of Social Justice & Empowerment"],
    ["2","The Schemes page","Option B — filter panel with a table","Department of Social Justice & Empowerment"],
    ["3","The assistant","Yes — it carries the same five questions","Department, with the existing vendor"],
  ];
  const rowY = 2.0, rowH = 0.82;
  [["THE PART OF THE SITE", M+0.7, 4.4],["WHAT IS PROPOSED", M+5.2, 4.2],["WHO APPROVES", M+9.5, 2.4]]
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

  s.addShape(pres.ShapeType.rect, { x:M, y:4.62, w:CW, h:1.16, fill:{color:BLUE_DEEP}, line:{color:BLUE_DEEP, width:0} });
  s.addText("And approval to begin Stage 1 — filling in the information for all 134 schemes.", {
    x:M+0.34, y:4.76, w:CW-0.68, h:0.36, isTextBox:true, margin:0, fontFace:F, fontSize:17, bold:true, color:WHITE });
  s.addText("This is the one piece of work every option above depends on. Whichever options are approved, it has to begin first, and only the Department can do it.", {
    x:M+0.34, y:5.18, w:CW-0.68, h:0.44, isTextBox:true, margin:0, fontFace:F, fontSize:11.5, color:BLUE_100, lineSpacingMultiple:1.16 });

  s.addText("ALSO REQUIRED FROM THE DEPARTMENT", { x:M, y:5.94, w:CW, h:0.2, isTextBox:true, margin:0,
    fontFace:F, fontSize:8.5, bold:true, charSpacing:1, color:BLUE_200 });
  const need = [
    ["Confirmation of the group tags on each scheme","Only the division that administers a scheme can confirm who it is for"],
    ["Approval of the wording of the group question","It asks a citizen to state their category — the wording should be the Department's, not a designer's"],
    ["A ruling on scope: this Department only, or both","The Schemes page shows DEPwD schemes while the questions route disability away to DEPwD; one of the two must change"],
    ["Verified helpline numbers and office contacts","Only Elderline 14567 is treated as confirmed today"],
  ];
  let ny = 6.2;
  need.forEach(n=>{
    s.addText(n[0], { x:M, y:ny, w:5.2, h:0.24, isTextBox:true, margin:0, fontFace:F, fontSize:10, bold:true, color:WHITE });
    s.addText(n[1], { x:M+5.4, y:ny, w:CW-5.4, h:0.24, isTextBox:true, margin:0, fontFace:F, fontSize:10, color:BLUE_100 });
    ny += 0.28;
  });
  s.addNotes("If only one thing is settled today, let it be Stage 1. The three choices can follow; nothing can be built before the information is filled in.");
}

/* ═══ 13 · Limits and sources ══════════════════════════════════════════ */
{
  const s = slide(false);
  const y0 = header(s, "For the Record", "What This Review Does and Does Not Establish", null);
  const limits = [
    ["The counts are current; the earlier figure of 141 is superseded.",
     "The 134 schemes, and the count against every value of the Target Group filter, were read directly from dosje.gov.in on 8 September 2026. An earlier figure of 141 came from a content export dated 13 June 2026 and no longer matches the site. Where this deck gives a number, it is the live one."],
    ["No citizens were interviewed.",
     "The findings come from examining the two Ministry websites and comparing them with myScheme, the disability department's site, the National Scholarship Portal and GOV.UK. The groups described are taken from the Department's own Acts, schemes and organisations, not from interviews. Before Stage 3 is built, the questions should be tested with people from those groups."],
  ];
  let y = y0 + 0.16;
  limits.forEach((l,i)=>{
    s.addText(String(i+1), { x:M, y:y+0.02, w:0.5, h:0.4, isTextBox:true, margin:0,
      fontFace:F, fontSize:21, bold:true, color:SAFF_TXT });
    s.addText(l[0], { x:M+0.6, y, w:CW-0.6, h:0.3, isTextBox:true, margin:0, fontFace:F, fontSize:14, bold:true, color:DARK });
    s.addText(l[1], { x:M+0.6, y:y+0.32, w:CW-0.6, h:0.9, isTextBox:true, margin:0,
      fontFace:F, fontSize:11.5, color:INK, lineSpacingMultiple:1.24 });
    y += 1.52;
    s.addShape(pres.ShapeType.line, { x:M, y:y-0.2, w:CW, h:0, line:{color:HAIR, width:0.75} });
  });
  s.addText("WHAT WAS EXAMINED", { x:M, y:y+0.04, w:CW, h:0.22, isTextBox:true, margin:0,
    fontFace:F, fontSize:9.5, bold:true, charSpacing:1.2, color:MUTE });
  const srcs = [
    ["The Ministry's own websites","dosje.gov.in, marked BETA, and socialjustice.gov.in — read on 8 September 2026."],
    ["The Target Group filter","All 11 values counted on the live site: Students 50 · Sanitation Workers 16 · DNT 14 · Senior Citizens 9 · OBC 6 · Scheduled Castes 5 · Business 4 · Small business 4 · BPL, Homeowners, Medium business 1 each. 23 schemes carry no group."],
    ["Other government websites","myscheme.gov.in · depwd.gov.in · scholarships.gov.in · GOV.UK, for comparison."],
    ["Standards applied","GIGW 3.0, DBIM 3.0 and WCAG 2.2 AA."],
    ["The design file and prototypes","MoSJE (WIP) — Service Discovery. Each walkthrough was recorded from a working prototype built to that design."],
  ];
  let sy = y + 0.3;
  srcs.forEach(r=>{
    s.addText(r[0], { x:M, y:sy, w:3.1, h:0.26, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, bold:true, color:BLUE_TXT });
    s.addText(r[1], { x:M+3.3, y:sy, w:CW-3.3, h:0.4, isTextBox:true, margin:0, fontFace:F, fontSize:10.5, color:INK, lineSpacingMultiple:1.16 });
    sy += r[1].length > 120 ? 0.52 : 0.34;
  });
  sourceLine(s, "How Citizens Find Schemes — options for service discovery on the Department's website. MoSJE Design Research, 8 September 2026.");
}

pres.writeFile({ fileName: "MoSJE-Service-Discovery-Options.pptx" }).then(f => console.log("wrote", f));
