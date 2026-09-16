#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Re-check every finding that asserts an ABSENCE against the LIVE DOM.

A capture is evidence of what a screen looks like. It is not evidence that something is missing -
NMB-SCREEN-016 said the pledge banner had lost its call to action when the button was there all
along, pushed outside a 1440-wide export by an accessibility panel that happened to be open when
the shot was taken. Four claim gates, a PDF, a Figma report and a tracker all carried it.

So: every "absent", "missing", "not rendered", "not built", "lost" claim is asked of the running
page, with the viewport locked to the width the audit uses and the document width checked so a
contaminated page is caught rather than measured.

    python3 projects/nmba/verify_absences.py            # all roles
    python3 projects/nmba/verify_absences.py --only G02 # one claim

Credentials come from the gitignored secrets.json via the engine's own login. Nothing is printed
but the verdicts.

THE DESIGN SIDE IS READ, NOT SAMPLED. This file probes the BUILD. The other half of a finding -
what the design says - has three sources, in descending order of trust:

  1. `inputs/design-elements.json` for any TEXT node: it carries `fs`, `st` (the real font style)
     and `c` (the real fill) straight from the API. Authoritative. Use it first.
  2. The Figma Plugin API for anything that is not text - an icon button's stroke and radius, a
     tile's fill, a pill's corner radius. `figma.getNodeByIdAsync(<frame>)` then `findAll`, reading
     `fills` / `strokes` / `cornerRadius` off the node. Also authoritative.
  3. Sampling a pixel out of the exported PNG. ONLY safe on a large flat fill, and never on a
     glyph: an icon sampled this way returns the anti-aliased average of the glyph and its ground.
     That is how #ED8525 was published as #E08020, and how a #003366 edit glyph reads as #7F99B2.

Errors found by doing this properly on 2026-09-11: the sidebar ground is #F9FAFB and not white on
EITHER side, so both contrast ratios in NMB-GLOBAL-001 were computed against the wrong background;
and the design's row-action Icon Button is radius 8, not the 6 that had been published.
"""
import argparse, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.abspath(os.path.join(HERE, "..", "..", "engine"))
sys.path.insert(0, ENGINE)
import capture as C                                                  # noqa: E402
import config as CFG                                                # noqa: E402

ADMIN = "https://nmba-admin-dev.mosje.in"
PUBLIC = "https://nmba-user-dev.mosje.in"
BASE = {"admin": ADMIN, "state-nodal-officer": ADMIN, "district-nodal-officer": ADMIN,
        "public": PUBLIC}

# Each probe returns {"absent": bool, "detail": str} and every probe PRINTS THE SUBJECT IT
# MEASURED. `absent` is what the FINDING claims; the verdict compares it against what the page
# says. A probe never decides - it measures. `absent: null` means the probe could not see its
# subject and is not evidence of anything: the row-action probe once selected `button, a, svg` on
# a screen whose actions are <img> files, found nothing, and scored a CONFIRMED absence off a
# selector that was looking at nothing. The capitals probe did worse - it graded the TYPE CHIP
# instead of the name and reported a true finding false - which is why the subject is always
# quoted back.
#
# `kind` says what is being asked. "absence": is the thing really not there? "measure": is the
# NUMBER the finding quotes the number the browser computes? The second family exists because
# #E08020 turned out to be #ED8525 - a colour sampled off an anti-aliased screenshot rather than
# read out of the DOM, and a value no developer could have grepped for.
PROBES = {

 "G02": dict(
   claim="The GIGW text-size (A- / A / A+) and contrast controls are absent from the masthead",
   role="admin", route="/user-management",
   js=r"""
   // Anything inside the third-party UX4G widget does NOT count: the finding is about the
   // masthead's own inline controls, which is what GIGW asks for.
   const inWidget = el => !!el.closest('[id^=uw], [class^=uw-], [class*=" uw-"], .uwy');
   const all = [...document.querySelectorAll('button,a,span,div')].filter(e => !inWidget(e));
   const sizeCtl = all.filter(e => e.children.length === 0 &&
        /^\s*A[-+−]?\s*$/.test(e.textContent || ''));
   const contrast = all.filter(e => /contrast/i.test(
        (e.getAttribute('aria-label') || '') + ' ' + (e.getAttribute('title') || '')));
   return {absent: sizeCtl.length === 0 && contrast.length === 0,
           detail: `inline A-/A/A+ found: ${sizeCtl.length}; contrast controls: ${contrast.length}`};
   """),

 "G03": dict(
   claim="No admin sidebar navigation item carries an icon",
   role="admin", route="/user-management",
   js=r"""
   const nav = document.querySelector('aside, nav[class*=side], [class*=sidebar]');
   if (!nav) return {absent:null, detail:'no sidebar element found'};
   const items = [...nav.querySelectorAll('a, li > div, [role=button]')]
       .filter(e => (e.textContent||'').trim().length > 2);
   let withIcon = 0;
   for (const it of items) if (it.querySelector('svg, img, i[class*=icon], [class*=material]')) withIcon++;
   return {absent: withIcon === 0,
           detail: `${items.length} nav items, ${withIcon} carry an icon`};
   """),

 "G04": dict(
   claim="The 'Department of Social Justice & Empowerment' line is not rendered in the lockup",
   role="admin", route="/user-management",
   js=r"""
   const hdr = document.querySelector('header') || document.body;
   const t = (hdr.innerText || '').replace(/\s+/g,' ');
   return {absent: !/Department of Social Justice/i.test(t),
           detail: 'header text: ' + t.slice(0, 140)};
   """),

 "G05": dict(
   claim="Row action controls have no button around them",
   role="admin", route="/user-management",
   js=r"""
   const row = document.querySelector('tbody tr');
   if (!row) return {absent:null, detail:'no table row'};
   const cell = row.lastElementChild;
   const ctl = [...cell.querySelectorAll('button,a,svg,img')];
   const out = ctl.slice(0,4).map(e => {
     const cs = getComputedStyle(e.tagName === 'svg' ? (e.closest('button,a') || e) : e);
     return `${e.tagName.toLowerCase()} border=${cs.borderStyle}/${cs.borderWidth} ` +
            `radius=${cs.borderRadius} color=${cs.color}`;
   });
   const boxed = ctl.some(e => {
     const b = e.closest('button,a') || e;
     const cs = getComputedStyle(b);
     return cs.borderStyle !== 'none' && parseFloat(cs.borderWidth) > 0;
   });
   // "No controls found at all" is not evidence of anything — say so rather than scoring it as a
   // confirmed absence, which is how a broken selector passes itself off as a finding.
   if (!ctl.length) return {absent:null, detail:'no controls found in the action cell — probe is blind here'};
   return {absent: !boxed, detail: out.join(' | ')};
   """),

 "G06": dict(
   claim="The step controls are '-' and '+' (the ellipsis/last-page half was WRONG and is gone)",
   role="admin", route="/user-management",
   js=r"""
   const inWidget = el => !!el.closest('[id^=uw], [class^=uw-], .uwy');
   const leaves = [...document.querySelectorAll('button,span,a,li,div')]
        .filter(e => e.children.length === 0 && !inWidget(e));
   const txt = leaves.map(e => (e.textContent||'').trim());
   const hasEllipsis = txt.some(t => t === '...' || t === '…');
   const nums = txt.filter(t => /^[\d,]{1,8}$/.test(t) && t.replace(/,/g,'').length >= 2);
   const stepMinus = txt.some(t => t === '-' || t === '−');
   const stepPlus  = txt.some(t => t === '+');
   // The claim under test is now the GLYPHS, so that is what `absent` reports: a pager whose
   // steps are a minus and a plus has no chevrons. The ellipsis and last page are reported
   // alongside because an earlier wording denied them and was wrong.
   return {absent: stepMinus && stepPlus,
           detail: `ellipsis=${hasEllipsis} pageNumbersSeen=${JSON.stringify(nums.slice(0,6))} ` +
                   `minusStep=${stepMinus} plusStep=${stepPlus}`};
   """),

 "G08": dict(
   claim="The search field carries no magnifier (User Management)",
   role="admin", route="/user-management",
   js=r"""
   const inp = [...document.querySelectorAll('input')].find(i =>
        /search/i.test((i.placeholder||'') + ' ' + (i.getAttribute('aria-label')||'')));
   if (!inp) return {absent:null, detail:'no search input found'};
   const wrap = inp.closest('div') || inp.parentElement;
   const svgs = [...wrap.querySelectorAll('svg,img,i[class*=icon]')];
   const r = inp.getBoundingClientRect();
   const side = svgs.map(s => {
     const b = s.getBoundingClientRect();
     return b.left < r.left + r.width/2 ? 'left' : 'right';
   });
   return {absent: svgs.length === 0,
           detail: `${svgs.length} glyph(s) in the field wrapper, sides=${JSON.stringify(side)}`};
   """),

 "G08b": dict(
   claim="On Important Documents the magnifier sits inside the RIGHT edge",
   role="admin", route="/important-documents",
   js=r"""
   const inp = [...document.querySelectorAll('input')].find(i =>
        /search/i.test((i.placeholder||'') + ' ' + (i.getAttribute('aria-label')||'')));
   if (!inp) return {absent:null, detail:'no search input found'};
   const wrap = inp.closest('div') || inp.parentElement;
   const svgs = [...wrap.querySelectorAll('svg,img')];
   const r = inp.getBoundingClientRect();
   const side = svgs.map(s => {
     const b = s.getBoundingClientRect();
     return b.left < r.left + r.width/2 ? 'left' : 'right';
   });
   // The claim here is "it is on the RIGHT", not "it is missing" — so that is what is tested.
   return {absent: svgs.length > 0 && side.every(s => s === 'right'),
           detail: `${svgs.length} glyph(s), sides=${JSON.stringify(side)}`};
   """),

 "S06": dict(
   claim="The breadcrumb is not rendered on the NAPDDR committee screens",
   role="admin", route="/napddr/state-committee",
   js=r"""
   const bc = document.querySelector('nav[aria-label*=readcrumb], [class*=readcrumb], ol[class*=crumb]');
   const txt = (document.body.innerText||'').replace(/\s+/g,' ');
   const slashy = /(Home|Dashboard)\s*[\/>›»]\s*\w/.test(txt);
   return {absent: !bc && !slashy,
           detail: `breadcrumb element=${!!bc}; "X / Y" trail in text=${slashy}`};
   """),

 "S07": dict(
   claim="The whole 'My Submissions' section is not built on the officer dashboard",
   role="state-nodal-officer", route="/dashboard",
   js=r"""
   const t = (document.body.innerText||'').replace(/\s+/g,' ');
   const named = /my submissions/i.test(t);
   const tables = document.querySelectorAll('table').length;
   const addEvent = /add event/i.test(t);
   const exportBtn = /export/i.test(t);
   return {absent: !named && tables === 0,
           detail: `"My Submissions" in text=${named}; tables=${tables}; ` +
                   `"Add Event"=${addEvent}; "Export"=${exportBtn}`};
   """),

 "S12": dict(
   claim="Row actions run edit, download, delete (design: download, edit, delete)",
   role="admin", route="/important-documents",
   js=r"""
   const row = document.querySelector('tbody tr');
   if (!row) return {absent:null, detail:'no table row'};
   const cell = row.lastElementChild;
   const ctl = [...cell.querySelectorAll('button,a,img')];
   const name = e => (e.getAttribute('alt') || e.getAttribute('aria-label') ||
                      (e.querySelector('svg') && e.querySelector('svg').getAttribute('class')) ||
                      e.getAttribute('title') ||
                      e.className.toString() || e.tagName).slice(0, 40);
   return {absent:null, detail: ctl.map(name).join('  |  ')};
   """),
 # ---- the citizen site. No login, and no accessibility panel unless something opens it. ------

 "S02": dict(
   claim="The 'Number of Programmes' section is not built on the citizen home page",
   role="public", route="/",
   js=r"""
   const t = (document.body.innerText || '').replace(/\s+/g,' ');
   const named = /number of programmes/i.test(t);
   const headings = [...document.querySelectorAll('h1,h2,h3')]
        .map(h => (h.textContent||'').trim()).filter(Boolean);
   return {absent: !named,
           detail: `"Number of Programmes" in text=${named}; headings=${JSON.stringify(headings.slice(0,8))}`};
   """),

 "S03": dict(
   claim="The activity card renders no title and no description",
   role="public", route="/activities",
   js=r"""
   // A card is the smallest element that holds both a chip and a date-ish string.
   const cards = [...document.querySelectorAll('div,article,li')].filter(e => {
      const t = (e.innerText||''); 
      return e.children.length && t.length > 20 && t.length < 400 &&
             /\d{2}[-\/]\d{2}[-\/]\d{4}|\d{4}-\d{2}-\d{2}/.test(t);
   });
   if (!cards.length) return {absent:null, detail:'no activity card matched'};
   // the deepest such element is the card itself rather than the grid around it
   const card = cards.reduce((a,b) => (b.innerText.length < a.innerText.length ? b : a));
   const lines = card.innerText.split('\n').map(x=>x.trim()).filter(Boolean);
   const heads = [...card.querySelectorAll('h1,h2,h3,h4,h5')].map(h=>(h.textContent||'').trim());
   const longest = lines.reduce((a,b)=> b.length>a.length?b:a, '');
   return {absent: heads.length === 0,
           detail: `lines=${JSON.stringify(lines.slice(0,6))}; headings=${JSON.stringify(heads)}; ` +
                   `longestLine=${longest.length}ch`};
   """),

 "S04": dict(
   claim="The facility card has one button, not two, and no service tags",
   role="public", route="/facilities",
   js=r"""
   const tel = document.querySelector('a[href^=tel]');
   if (!tel) return {absent:null, detail:'no facility card found'};
   let card = tel.parentElement;
   for (let i=0;i<6 && card;i++) {
     if (/get directions/i.test(card.innerText||'')) break;
     card = card.parentElement;
   }
   if (!card) return {absent:null, detail:'no card wrapper with a Get Directions button'};
   const btns = [...card.querySelectorAll('button, a[role=button]')]
        .filter(b => (b.textContent||'').trim().length > 2);
   const dirs = btns.filter(b => /get directions/i.test(b.textContent||''));
   const w = dirs.length ? Math.round(dirs[0].getBoundingClientRect().width) : null;
   const cw = Math.round(card.getBoundingClientRect().width);
   // service tags: several short sibling pills with a background fill
   const pills = [...card.querySelectorAll('span,div')].filter(e => {
      if (e.children.length) return false;
      const t=(e.textContent||'').trim();
      if (!(t.length>3 && t.length<34)) return false;
      const cs=getComputedStyle(e.parentElement);
      return cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(cs.borderRadius) > 4;
   }).map(e => (e.textContent||'').trim());
   return {absent: btns.length <= 1 && pills.length < 2,
           detail: `buttons=${btns.length} ${JSON.stringify(btns.map(b=>b.textContent.trim().slice(0,18)))}; ` +
                   `GetDirections ${w}px of ${cw}px card; pill-like=${JSON.stringify(pills.slice(0,6))}`};
   """),

 "S14": dict(
   claim="The citizen masthead has no user block; it carries a helpline badge and a login button",
   role="public", route="/",
   js=r"""
   const hdr = document.querySelector('header') || document.body;
   const t = (hdr.innerText||'').replace(/\s+/g,' ');
   const login = /nasha mukti mitr login/i.test(t);
   const helpline = /14446/.test(t);
   const avatar = !!hdr.querySelector('[class*=avatar], [class*=initial]');
   return {absent: login && helpline && !avatar,
           detail: `login button=${login}; 14446 badge=${helpline}; avatar/user block=${avatar}`};
   """),

 "S16": dict(
   claim="/about-us answers HTTP 200 and renders a not-found page",
   role="public", route="/about-us",
   js=r"""
   // The card is a single <img alt="404 Not Found">, so innerText cannot see the message and the
   // first version of this probe declared the finding wrong. Test the picture, not the prose.
   const t = (document.body.innerText||'').replace(/\s+/g,' ');
   const inText = /(something went wrong|vanished|404)/i.test(t);
   const img = [...document.querySelectorAll('img')].find(i =>
        /404|not found/i.test(i.getAttribute('alt')||''));
   const r = img && img.getBoundingClientRect();
   return {absent: !!img || inText,
           detail: `404 as an image=${!!img}${r ? ` (${Math.round(r.width)}x${Math.round(r.height)}, ` +
                   `alt=${JSON.stringify(img.getAttribute('alt'))})` : ''}; ` +
                   `404 wording in any TEXT node=${inText}; "Go Back" present=${/go back/i.test(t)}`};
   """),

 # Not an absence, but it was measured the same wrong way the amber glyph was — off a
 # screenshot rather than out of the DOM. Checked here while the page is open.
 "S13": dict(
   claim="The type chips are colour-coded, and three of the four fills are in no NMBA token",
   role="public", route="/facilities",
   js=r"""
   const tel = document.querySelector('a[href^=tel]');
   let card = tel && tel.parentElement;
   for (let i=0;i<6 && card;i++) { if (/get directions/i.test(card.innerText||'')) break; card = card.parentElement; }
   if (!card) return {absent:null, detail:'no card'};
   const chips = [...card.querySelectorAll('span,div')].filter(e=>{
      const cs=getComputedStyle(e);
      return e.children.length===0 && cs.backgroundColor!=='rgba(0, 0, 0, 0)' &&
             (e.textContent||'').trim().length>3;
   });
   const seen = chips.map(e=>{const cs=getComputedStyle(e);
      return `${(e.textContent||'').trim().slice(0,26)} bg=${cs.backgroundColor} fg=${cs.color}`;});
   // and across the whole page, to test "the same fill for every type"
   const all = [...document.querySelectorAll('span,div')].filter(e=>e.children.length===0 &&
        /centre|center|ircA|IRCA|DDAC|ODIC|CPLI|USDP/i.test(e.textContent||''))
        .map(e=>getComputedStyle(e).backgroundColor);
   const uniq = [...new Set(all)].slice(0,6);
   // TOKENS are passed in so the probe reports a verdict rather than a list somebody has to grade.
   const TOK = ['rgb(200, 230, 201)', 'rgb(210, 227, 252)'];
   const offToken = uniq.filter(c => c !== 'rgba(0, 0, 0, 0)' && !TOK.includes(c));
   return {absent: uniq.filter(c=>c!=='rgba(0, 0, 0, 0)').length > 1 && offToken.length >= 3,
           detail: `chip(s): ${JSON.stringify(seen.slice(0,3))} | distinct fills: ${JSON.stringify(uniq)} ` +
                   `| off-token: ${JSON.stringify(offToken)}`};
   """),
 # =========================================================================================
 # MEASURES - the number the finding quotes, against the number the browser computes.
 # =========================================================================================

 "M-G01": dict(kind="measure",
   claim="Unselected sidebar label is #9CA3AF on #FFFFFF (2.54:1)",
   role="admin", route="/user-management",
   js=r"""
   const nav=document.querySelector('aside, nav[class*=side], [class*=sidebar]');
   const items=[...nav.querySelectorAll('a, li > div, [role=button]')]
        .filter(e=>(e.textContent||'').trim().length>2);
   const lum=c=>{const [r,g,b]=c.match(/\d+/g).map(Number).map(v=>{v/=255;
        return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4);});
        return 0.2126*r+0.7152*g+0.0722*b;};
   const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05);};
   const seen={};
   for(const it of items){const cs=getComputedStyle(it);
     let bg='rgb(255, 255, 255)', p=it;
     while(p && p!==document.body){const b=getComputedStyle(p).backgroundColor;
       if(b!=='rgba(0, 0, 0, 0)'){bg=b;break;} p=p.parentElement;}
     const k=cs.color+' on '+bg; seen[k]=(seen[k]||0)+1;}
   const rows=Object.entries(seen).map(([k,n])=>{const [fg,bg]=k.split(' on ');
     return `${k}  x${n}  ${ratio(fg,bg).toFixed(2)}:1`;});
   return {absent:null, detail: rows.join('   |   ')};
   """),

 "M-G04": dict(kind="measure",
   claim="Lockup: 'Government of India' 12px, 'Ministry of...' 20px Bold, both #374151",
   role="admin", route="/user-management",
   js=r"""
   const hdr=document.querySelector('header')||document.body;
   const want=['Government of India','Ministry of Social Justice'];
   const out=[];
   for(const w of want){
     const el=[...hdr.querySelectorAll('*')].find(e=>e.children.length===0 &&
          (e.textContent||'').trim().startsWith(w));
     if(!el){out.push(`${w}: NOT FOUND`); continue;}
     const cs=getComputedStyle(el);
     out.push(`"${(el.textContent||'').trim().slice(0,34)}" ${cs.fontSize}/${cs.fontWeight} ${cs.color}`);
   }
   return {absent:null, detail: out.join('  |  ')};
   """),

 "M-G10": dict(kind="measure",
   claim="Table cell text is #4B5563",
   role="admin", route="/user-management",
   js=r"""
   const td=document.querySelector('tbody tr td');
   if(!td) return {absent:null, detail:'no cell'};
   const cs=getComputedStyle(td);
   const th=document.querySelector('thead th');
   return {absent:null, detail:`cell ${cs.fontSize}/${cs.fontWeight} ${cs.color}` +
     (th?`   |   header ${getComputedStyle(th).fontSize}/${getComputedStyle(th).fontWeight} ${getComputedStyle(th).color}`:'')};
   """),

 "M-G11": dict(kind="measure",
   claim="Page title is 24px weight 600 #374151",
   role="admin", route="/user-management",
   js=r"""
   // The title is not a heading element on this build, so an h1/h2 selector was blind to it.
   // Take the largest text in the content column instead, and quote it back.
   const main=document.querySelector('main')||document.body;
   const cands=[...main.querySelectorAll('*')].filter(e=>e.children.length===0 &&
        (e.textContent||'').trim().length>3 && e.getBoundingClientRect().top < 300);
   const h=cands.reduce((a,b)=> parseFloat(getComputedStyle(b).fontSize) >
        parseFloat(getComputedStyle(a).fontSize) ? b : a, cands[0]);
   if(!h) return {absent:null, detail:'no page title found'};
   const cs=getComputedStyle(h);
   return {absent:null, detail:`"${h.textContent.trim()}" ${cs.fontSize}/${cs.fontWeight} ${cs.color}`};
   """),

 "M-G12": dict(kind="measure",
   claim="A KPI icon tile is filled #FDE8EF (a pink in no token)",
   role="state-nodal-officer", route="/dashboard",
   js=r"""
   const tiles=[...document.querySelectorAll('div,span')].filter(e=>{
     const cs=getComputedStyle(e); const r=e.getBoundingClientRect();
     return r.width>20 && r.width<64 && Math.abs(r.width-r.height)<10 &&
            cs.backgroundColor!=='rgba(0, 0, 0, 0)' && e.querySelector('svg,img');});
   const fills=[...new Set(tiles.map(t=>getComputedStyle(t).backgroundColor))];
   return {absent:null, detail:`${tiles.length} icon tile(s); fills=${JSON.stringify(fills)}`};
   """),

 "M-G13": dict(kind="measure",
   claim="The KPI value is 30px (the scale runs 24/28/32)",
   role="state-nodal-officer", route="/dashboard",
   js=r"""
   const nums=[...document.querySelectorAll('*')].filter(e=>e.children.length===0 &&
        /^[\d,]{1,12}$/.test((e.textContent||'').trim()) &&
        parseFloat(getComputedStyle(e).fontSize) >= 20);
   const seen=[...new Set(nums.map(e=>{const cs=getComputedStyle(e);
        return `${cs.fontSize}/${cs.fontWeight}/${cs.color}`;}))];
   return {absent:null, detail:`${nums.length} big number(s): ${JSON.stringify(seen)}`};
   """),

 "M-G14": dict(kind="measure",
   claim="The KPI label is 14px weight 600 #6B7280",
   role="state-nodal-officer", route="/dashboard",
   js=r"""
   const num=[...document.querySelectorAll('*')].find(e=>e.children.length===0 &&
        /^[\d,]{1,12}$/.test((e.textContent||'').trim()) &&
        parseFloat(getComputedStyle(e).fontSize) >= 20);
   if(!num) return {absent:null, detail:'no KPI value to anchor on'};
   const card=num.closest('div').parentElement;
   const label=[...card.querySelectorAll('*')].find(e=>e.children.length===0 &&
        (e.textContent||'').trim().length>4 && e!==num);
   if(!label) return {absent:null, detail:'no label beside the value'};
   const cs=getComputedStyle(label);
   return {absent:null, detail:`"${label.textContent.trim().slice(0,30)}" ${cs.fontSize}/${cs.fontWeight} ${cs.color}`};
   """),

 "M-G15": dict(kind="measure",
   claim="The selected nav pill is 36px tall, radius 10, label Bold",
   role="admin", route="/user-management",
   js=r"""
   const nav=document.querySelector('aside, nav[class*=side], [class*=sidebar]');
   const items=[...nav.querySelectorAll('a, li > div, [role=button]')]
        .filter(e=>(e.textContent||'').trim().length>2);
   const sel=items.find(e=>{const cs=getComputedStyle(e);
        return cs.backgroundColor!=='rgba(0, 0, 0, 0)';});
   if(!sel) return {absent:null, detail:'no filled (selected) nav item'};
   const cs=getComputedStyle(sel); const r=sel.getBoundingClientRect();
   const leaf=[...sel.querySelectorAll('*')].find(e=>e.children.length===0) || sel;
   return {absent:null, detail:`"${sel.textContent.trim().slice(0,24)}" ${Math.round(r.height)}px tall, ` +
     `radius ${cs.borderRadius}, fill ${cs.backgroundColor}, label ${getComputedStyle(leaf).fontWeight}`};
   """),

 "M-G17": dict(kind="measure",
   claim="Export Excel 115x38 + Export PDF 108x38, the pair 231px wide",
   role="admin", route="/user-management",
   js=r"""
   const b=[...document.querySelectorAll('button,a')]
        .filter(e=>/^export/i.test((e.textContent||'').trim()));
   if(!b.length) return {absent:null, detail:'no Export control'};
   const rs=b.map(e=>e.getBoundingClientRect());
   const span=Math.round(Math.max(...rs.map(r=>r.right)) - Math.min(...rs.map(r=>r.left)));
   return {absent:null, detail: b.map((e,i)=>`"${e.textContent.trim()}" ${Math.round(rs[i].width)}x${Math.round(rs[i].height)}`).join(' + ') +
     `  =  ${span}px together`};
   """),

 "M-G19": dict(kind="measure",
   claim="A white panel wraps the toolbar and table; the page ground is #F9FAFB in the design",
   role="admin", route="/user-management",
   js=r"""
   const tbl=document.querySelector('table'); if(!tbl) return {absent:null, detail:'no table'};
   const chain=[]; let p=tbl.parentElement;
   for(let i=0;i<5 && p && p!==document.body;i++){
     const cs=getComputedStyle(p); const r=p.getBoundingClientRect();
     chain.push(`${p.tagName.toLowerCase()} ${Math.round(r.width)}px x${Math.round(r.left)} bg=${cs.backgroundColor} r=${cs.borderRadius} b=${cs.borderStyle}`);
     p=p.parentElement;}
   return {absent:null, detail: chain.join('  <  ')};
   """),

 "M-G20": dict(kind="measure",
   claim="The 'Formed on' column is 94px wide and its rows are 65px tall",
   role="admin", route="/napddr/committee-reports",
   js=r"""
   const ths=[...document.querySelectorAll('thead th')];
   const cells=[...document.querySelectorAll('tbody tr:first-child td')];
   const row=document.querySelector('tbody tr');
   const cols=ths.map((t,i)=>`${(t.textContent||'').trim().slice(0,16)}=${Math.round(t.getBoundingClientRect().width)}px`);
   return {absent:null, detail:`row ${row?Math.round(row.getBoundingClientRect().height):'?'}px tall  |  ` + cols.join(' ')};
   """),

 "M-G22": dict(kind="measure",
   claim="Admin sidebar items repeat every 40px (design: 60px)",
   role="admin", route="/user-management",
   js=r"""
   const nav=document.querySelector('aside, nav[class*=side], [class*=sidebar]');
   const items=[...nav.querySelectorAll('a, li > div, [role=button]')]
        .filter(e=>(e.textContent||'').trim().length>2);
   const tops=items.map(e=>Math.round(e.getBoundingClientRect().top)).sort((a,b)=>a-b);
   const gaps=tops.slice(1).map((t,i)=>t-tops[i]).filter(g=>g>0);
   const mode={}; for(const g of gaps) mode[g]=(mode[g]||0)+1;
   return {absent:null, detail:`${items.length} items; gaps ${JSON.stringify(gaps.slice(0,10))}; ` +
     `commonest ${JSON.stringify(Object.entries(mode).sort((a,b)=>b[1]-a[1]).slice(0,3))}`};
   """),

 "M-G09": dict(kind="measure",
   claim="Table row heights vary: 41 / 53 / 57 / 65 / 85 / 153px across screens",
   role="admin", route="/user-management",
   js=r"""
   const rows=[...document.querySelectorAll('tbody tr')].slice(0,6)
        .map(r=>Math.round(r.getBoundingClientRect().height));
   const th=document.querySelector('thead tr');
   return {absent:null, detail:`data rows ${JSON.stringify(rows)}; header ${th?Math.round(th.getBoundingClientRect().height):'?'}px`};
   """),

 "S05": dict(
   claim="The facility name is rendered in capitals",
   role="public", route="/facilities",
   js=r"""
   const tel = document.querySelector('a[href^=tel]');
   let card = tel && tel.parentElement;
   for (let i=0;i<6 && card;i++) { if (/get directions/i.test(card.innerText||'')) break; card = card.parentElement; }
   if (!card) return {absent:null, detail:'no card'};
   // lines[0] is the TYPE CHIP, not the name — the first version of this probe graded the wrong
   // string and reported the finding false. The name is the card's heaviest/largest leaf.
   const leaves = [...card.querySelectorAll('*')].filter(e => e.children.length === 0 &&
        (e.textContent||'').trim().length > 8);
   const el = leaves.reduce((a,b) => {
      const sa = parseFloat(getComputedStyle(a).fontSize) * parseInt(getComputedStyle(a).fontWeight);
      const sb = parseFloat(getComputedStyle(b).fontSize) * parseInt(getComputedStyle(b).fontWeight);
      return sb > sa ? b : a;
   }, leaves[0]);
   const name = el ? (el.textContent||'').trim() : '';
   const tt = el ? getComputedStyle(el).textTransform : 'n/a';
   const allCaps = !!name && name === name.toUpperCase() && /[A-Z]{4}/.test(name);
   return {absent: allCaps,
           detail: `name=${JSON.stringify(name.slice(0,48))}; allCaps=${allCaps}; text-transform=${tt}`};
   """),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*")
    a = ap.parse_args()
    # config.load() merges the gitignored secrets into each role, so no password is handled here.
    cfg, _paths = CFG.load("nmba")
    roles = {r["name"]: r for r in cfg["live"]["roles"]}
    auth = cfg["live"]["auth"]
    todo = {k: v for k, v in PROBES.items() if not a.only or k in a.only}
    by_role = {}
    for k, p in todo.items():
        by_role.setdefault(p["role"], []).append((k, p))

    from playwright.sync_api import sync_playwright
    results = []
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        for role, probes in by_role.items():
            ctx = br.new_context(viewport={"width": cfg["capture"]["width"], "height": 1000})
            pg = ctx.new_page()
            base = BASE.get(role, ADMIN)
            if roles[role].get("auth") != "none":
                if not C.do_login(pg, roles[role], auth):
                    print(f"[{role}] SKIP — no credentials in secrets.json", flush=True)
                    ctx.close(); continue
                if auth.get("loginMarker", "/login") in pg.url:
                    print(f"[{role}] LOGIN FAILED -> still on the login page", flush=True)
                    ctx.close(); continue
            for key, p in probes:
                pg.goto(base + p["route"], wait_until="domcontentloaded", timeout=60000)
                pg.wait_for_timeout(cfg["capture"].get("waitMs", 1800))
                # The contaminant that caused this script to exist: a wider document than the
                # export means right-hand elements can look "off the page" when they are not.
                docw = pg.evaluate("document.documentElement.scrollWidth")
                try:
                    r = pg.evaluate("() => {%s}" % p["js"])
                except Exception as e:                                # noqa: BLE001
                    r = {"absent": None, "detail": "probe error: %s" % e}
                results.append({"key": key, "claim": p["claim"], "role": role,
                                "kind": p.get("kind", "absence"),
                                "route": p["route"], "docWidth": docw, **r})
            ctx.close()
        br.close()

    w = cfg["capture"]["width"]
    print(f"\nviewport {w}px · a document wider than that is flagged, because that is what hid "
          f"the pledge button\n")
    for r in results:
        kind = r.get("kind", "absence")
        if kind == "measure":
            v = "MEASURED — compare with the finding"
        elif r["absent"] is True:
            v = "CONFIRMED absent"
        elif r["absent"] is False:
            v = "!! PRESENT — the claim is wrong"
        else:
            v = "-- BLIND: the probe could not see its subject"
        flag = "  [doc %dpx WIDER THAN VIEWPORT]" % r["docWidth"] if r["docWidth"] > w else ""
        print(f"{r['key']:5s} {v:34s} {r['claim']}")
        print(f"      {r['role']}{r['route']}{flag}")
        print(f"      {r['detail']}\n")
    json.dump(results, open(os.path.join(HERE, "out", "absence-check.json"), "w"), indent=1)
    bad = [r for r in results if r.get("kind","absence") == "absence" and r["absent"] is False]
    print(f"{len(results)} checked · {len(bad)} claim(s) contradicted by the live page")
    return 2 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
