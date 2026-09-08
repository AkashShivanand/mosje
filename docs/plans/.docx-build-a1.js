const fs=require('fs'), D=require('docx');
const {Document,Packer,Paragraph,TextRun,AlignmentType,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,Header,Footer,PageNumber}=D;
const NAVY="162F6A",INK="1B2130",BODY="333A48",MUTE="5F6779",RULE="C9CFDC",HEADBG="EDF0F7",ALT="F7F8FC",CRIT="8C2B2B",OK="1F5E3A";
const SANS="Calibri",SERIF="Georgia",MONO="Consolas",CW=9638;
const none={style:BorderStyle.NONE,size:0,color:"FFFFFF"};
const t=(x,o={})=>new TextRun({text:x,font:o.f||SANS,size:o.s||21,bold:!!o.b,italics:!!o.i,color:o.c||BODY,allCaps:!!o.caps,characterSpacing:o.ls});
const p=(r,o={})=>new Paragraph({children:Array.isArray(r)?r:[r],spacing:{before:o.before??0,after:o.after??140,line:o.line??276},alignment:o.align,border:o.border,keepNext:o.keepNext,pageBreakBefore:o.pb});
const body=(x,o={})=>p(Array.isArray(x)?x:t(x,o),{after:o.after??140,before:o.before??0});
const h1=(s,o={})=>p(t(s,{f:SERIF,s:30,b:true,c:NAVY}),{before:340,after:110,keepNext:true,pb:o.pb});
const h2=s=>p(t(s,{f:SERIF,s:23,b:true,c:INK}),{before:260,after:90,keepNext:true});
const bul=r=>new Paragraph({children:Array.isArray(r)?r:[r],bullet:{level:0},spacing:{after:80,line:270},indent:{left:290,hanging:200}});
const cell=(k,o={})=>new TableCell({width:{size:o.w,type:WidthType.DXA},shading:o.bg?{type:ShadingType.CLEAR,fill:o.bg,color:"auto"}:undefined,margins:{top:75,bottom:75,left:125,right:125},verticalAlign:D.VerticalAlign.TOP,borders:{top:{style:BorderStyle.SINGLE,size:2,color:RULE},bottom:{style:BorderStyle.SINGLE,size:2,color:RULE},left:none,right:none},children:k});
const th=(s,w,a)=>cell([p(t(s,{s:16,b:true,c:NAVY,caps:true,ls:16}),{after:0,line:235,align:a})],{w,bg:HEADBG});
const td=(r,w,o={})=>cell([p(r,{after:0,line:248,align:o.align})],{w,bg:o.bg});
const tbl=(ws,head,rows)=>new Table({width:{size:CW,type:WidthType.DXA},columnWidths:ws,layout:D.TableLayoutType.FIXED,rows:[new TableRow({tableHeader:true,children:head}),...rows]});
const cap=s=>p(t(s,{s:16,c:MUTE,i:true}),{before:70,after:210});
const F=(n,s)=>p([t(n+"  ",{f:MONO,s:16,b:true,c:CRIT}),t(s,{f:SERIF,s:21,b:true,c:INK})],{before:230,after:80,keepNext:true});
const K=[];

K.push(p(t("Department of Social Justice & Empowerment  ·  Website Content Governance",{s:16,b:true,c:NAVY,caps:true,ls:18}),{after:190}));
K.push(p(t("Repeated Content and Design Inconsistencies Across the Website",{f:SERIF,s:38,b:true,c:INK}),{after:110,line:296}));
K.push(p(t("Document A, Section 01 — revised. A measured audit of www.dosje.gov.in covering content that exists in more than one place, and the visual rules the site applies differently from page to page.",{s:22,c:MUTE}),{after:190,line:288}));
K.push(new Paragraph({spacing:{before:40,after:60},border:{bottom:{style:BorderStyle.SINGLE,size:12,color:NAVY}},children:[t("")]}));
K.push(p([t("Audited 7 September 2026",{s:17,c:MUTE}),t("     ·     ",{s:17,c:RULE}),t("74 live pages examined",{s:17,c:MUTE}),t("     ·     ",{s:17,c:RULE}),t("Every figure measured, none estimated",{s:17,c:MUTE})],{after:300}));

K.push(h1("How This Was Measured"));
K.push(body("Nothing in this section is an impression. Fifty-two organisation pages of the four repeated types were downloaded and compared word by word; twenty-two pages covering every page type on the site were examined for headings, colours, type sizes and date formats; and the browser’s own rendered values were read directly from four representative pages, so the figures are what a visitor’s screen actually shows rather than what the stylesheet intends."));
K.push(body("Where a finding corrects something stated elsewhere in this governance review, that is said plainly. One such correction appears at the end, and it matters."));

/* ============ PART ONE ============ */
K.push(h1("Part One — Content That Exists in More Than One Place"));

K.push(F("1.1","The Same Page Exists Once Per Organisation — but Its Content Is Not the Same"));
K.push(body("Four page types are repeated across the organisations. The structure repeats; the writing does not. The final column is the average word-for-word similarity between every pair of pages in that family."));
K.push(tbl([1950,880,2450,1420,2938],
 [th("Page type",1950),th("Copies",880,AlignmentType.RIGHT),th("Web addresses used",2450),th("Similarity",1420,AlignmentType.RIGHT),th("What follows from it",2938)],
 [["About Us","16","about-us (15), about-bjrnf (1)","2%","Each is a distinct history, 1,585 to 15,240 characters long"],
  ["Contact","18","contact-us (13), contact (5)","14–19%","Short and structured. The one genuine candidate for a single template"],
  ["FAQ","11","faq (7), faqs (4)","2%","Entirely different questions, 8,138 to 82,692 characters"],
  ["RTI","7","rti","6%","Mixed; three carry almost nothing"]
 ].map(([a,b,c,d,e],i)=>new TableRow({children:[
   td(t(a,{b:true,c:INK}),1950,{bg:i%2?ALT:undefined}),
   td(t(b,{f:MONO}),880,{align:AlignmentType.RIGHT,bg:i%2?ALT:undefined}),
   td(t(c,{s:18,f:MONO,c:MUTE}),2450,{bg:i%2?ALT:undefined}),
   td(t(d,{f:MONO,b:true,c:a==="Contact"?OK:CRIT}),1420,{align:AlignmentType.RIGHT,bg:i%2?ALT:undefined}),
   td(t(e,{s:19}),2938,{bg:i%2?ALT:undefined})]}))));
K.push(cap("Fifty-two pages in total. Similarity measured on the main content area only, headers and menus excluded."));

K.push(F("1.2","One Page Type, Three Different Web Addresses"));
K.push(body("The same kind of page is filed under different addresses depending on who created it — About Us and About BJRNF; Contact Us and Contact; FAQ and FAQs. Nothing on the site can therefore gather them into one list, which is the reason the central Contact Us page had to be typed out by hand rather than assembled from the organisations’ own pages."));

K.push(F("1.3","Four Published Pages Are Effectively Blank"));
K.push(body("Three organisation Contact pages hold fewer than 120 characters of content, and one RTI page holds 104. They are live and reachable from the menus. A visitor who follows the link is shown an empty page rather than told the information is not yet published."));

K.push(F("1.4","The Same Page Reached by Several Names"));
K.push(body("These are not copies of content. They are one page wearing different labels, which leaves a visitor unable to tell whether they have already seen it."));
K.push(tbl([3400,3200,3038],
 [th("The page",3400),th("Names it is given",3200),th("Where",3038)],
 [["Ministry directory","“Directory” — twice — and “Ministers & Officials”","Listed under Department AND under Connect in the same menu; footer"],
  ["About Us","“About Ministry” and “Vision & Mission”","Both footer links open the same page"],
  ["Who’s Who","“Who’s Who” and “Organisational Chart”","Main menu; footer"],
  ["Statistics dashboard","“Statistics”","Footer, while the page itself is titled otherwise"],
  ["Sitemap","Two separate sitemap pages exist","Main menu and footer point to different ones"],
  ["Four Statistics Division links","All four are labelled “SECC 2011”","Important Links panel and footer"]
 ].map(([a,b,c],i)=>new TableRow({children:[
   td(t(a,{b:true,c:INK}),3400,{bg:i%2?ALT:undefined}),
   td(t(b,{s:19}),3200,{bg:i%2?ALT:undefined}),
   td(t(c,{s:19,c:MUTE}),3038,{bg:i%2?ALT:undefined})]}))));
K.push(body("The last row is the plainest error of the six. Four consecutive links in the Statistics Division panel carry the label “SECC 2011” while pointing at four different destinations — the SECC website, About the Division, the List of Research Evaluation Studies, and the Handbook on Social Welfare Statistics. Three of the four labels are wrong."));

K.push(F("1.5","The Same Navigation Written Out Four Times"));
K.push(body("The main menu, the footer’s four columns, the left-hand rails on organisation pages and the Important Links panel each name the same set of pages, in their own words and their own order. A page added to one does not appear in the others, and the four have already drifted apart — which is what rows two and three of the table above are."));

K.push(F("1.6","Leftovers From Renaming"));
K.push(body("Two pages carry a “-2” suffix left behind when an earlier page of the same name was renamed or removed: the Minutes of Screening Committees, and the NCBC Gazette Notifications. Separately, Success Stories is published under both NSFDC and NBCFDC, with nothing to say which is current."));

/* ============ PART TWO ============ */
K.push(h1("Part Two — Rules the Site Applies Differently From Page to Page",{pb:true}));
K.push(body("Every figure below was read from the rendered page, not from the stylesheet."));

K.push(F("2.1","Section Headings — One Job, Three Specifications"));
K.push(body("These four headings all do the same thing: they open a section. They are set three different ways."));
K.push(tbl([3500,1250,1150,1150,2588],
 [th("Heading",3500),th("Tag",1250,AlignmentType.CENTER),th("Size",1150,AlignmentType.RIGHT),th("Weight",1150,AlignmentType.RIGHT),th("Colour",2588)],
 [["“Our Offerings” — home page","H3","20px","600","#014B92"],
  ["“Explore our Social Media Platforms” — home page","H2","20px","600","#014B92"],
  ["“About us”, “Contact” and eight more — DAF page","H3","20px","500","#014B92"],
  ["“Union Cabinet Minister…” and 21 more — Directory","H4","20px","600","#0373DF"]
 ].map(([a,b,c,d,e],i)=>new TableRow({children:[
   td(t(a,{s:19}),3500,{bg:i%2?ALT:undefined}),
   td(t(b,{f:MONO,b:true}),1250,{align:AlignmentType.CENTER,bg:i%2?ALT:undefined}),
   td(t(c,{f:MONO}),1150,{align:AlignmentType.RIGHT,bg:i%2?ALT:undefined}),
   td(t(d,{f:MONO,b:true,c:CRIT}),1150,{align:AlignmentType.RIGHT,bg:i%2?ALT:undefined}),
   td(t(e,{f:MONO,c:CRIT}),2588,{bg:i%2?ALT:undefined})]}))));
K.push(body("Two weights and two blues for a single role. Page titles differ as well: the organisation page prints its title at 28px, the Directory at 22px."));

K.push(F("2.2","Heading Level No Longer Follows Heading Size"));
K.push(body("On the home page an H2 and an H3 render identically, at 20px and the same weight. On the Directory the page title is an H1 at 22px while the headings beneath it are H4 at 20px — two pixels apart, four levels of structure between them. Screen readers and search engines read the level; a sighted visitor reads the size; the two now tell different stories, which is both a visual problem and an accessibility one."));

K.push(F("2.3","Three Capitalisation Rules for Headings"));
K.push(body("Ninety-four headings were read across eighteen pages."));
K.push(tbl([2900,1100,5638],
 [th("Style",2900),th("Headings",1100,AlignmentType.RIGHT),th("Where",5638)],
 [["Title Case","66","The site’s prevailing rule — Annual Reports, Contact Us, Schemes & Services"],
  ["ALL CAPITALS","22","Every one of them on the Ministry Directory"],
  ["Sentence case","6","Who’s Who, the privacy policy, and “About us” on the DAF page"]
 ].map(([a,b,c],i)=>new TableRow({children:[
   td(t(a,{b:true,c:INK}),2900,{bg:i%2?ALT:undefined}),
   td(t(b,{f:MONO}),1100,{align:AlignmentType.RIGHT,bg:i%2?ALT:undefined}),
   td(t(c,{s:19}),5638,{bg:i%2?ALT:undefined})]}))));
K.push(body("Five pages use more than one style within themselves. The Ministry page is headed “About Us” and the Dr. Ambedkar Foundation page “About us”."));

K.push(F("2.4","Eight Button Styles on a Single Page"));
K.push(body("Measured on the home page: four different corner roundings (0, 4, 5 and 8 pixels), five padding schemes, two text sizes and two weights. “Admin Login” appears twice on that page — once as blue text on white with a 4-pixel corner, once as white text on blue with an 8-pixel corner. The same instruction, drawn two ways, within one screen."));

K.push(F("2.5","No Settled Palette"));
K.push(body("Colours in live use, collected from the rendered pages:"));
K.push(tbl([2000,7638],
 [th("Family",2000),th("Values found in use",7638)],
 [["Blue","#0373DF · #014B92 · #0A4D8F · #004AAD · #1E6FD9 · #0067AF · #2980B9  — seven"],
  ["Body grey","#1F2937 · #374151 · #515962 · #54595F · #555555 · #1F2124 · #212121 · #000000  — eight"],
  ["Green","#2E7D32 · #198754 · #0D5537 · #0F6B2C  — four"],
  ["Off-brand","#613AF5 (violet) and #FF0055 (magenta), neither of which belongs to the Department’s identity"]
 ].map(([a,b],i)=>new TableRow({children:[
   td(t(a,{b:true,c:INK}),2000,{bg:i%2?ALT:undefined}),
   td(t(b,{f:MONO,s:18,c:a==="Off-brand"?CRIT:BODY}),7638,{bg:i%2?ALT:undefined})]}))));
K.push(body("Eight greys for body text is the one that shows most. It is why some pages read a little heavier or lighter than others without a visitor being able to say why."));

K.push(F("2.6","Seventeen Text Sizes, in Three Different Units"));
K.push(body("Declared sizes found: 10.5, 11, 11.5, 12, 12.5, 13, 14, 15, 16, 18, 20, 22, 28 and 32 pixels, together with 0.75rem, 0.9375rem and 1.5em. Five of those sit inside a two-pixel band — 11, 11.5, 12, 12.5 and 13 — which no reader can distinguish and no editor can apply consistently. Mixing pixels with rem and em also means some text resizes when a visitor enlarges the page and some does not."));

K.push(F("2.7","Five Date Formats"));
K.push(tbl([2900,1500,5238],
 [th("Format",2900),th("Pages",1500,AlignmentType.RIGHT),th("As it appears",5238)],
 [["1 January 2026","22 of 22","01 Jan 2021"],
  ["1.1.2026","5","03.08.2026"],
  ["01-01-2026","2","01-03-2023"],
  ["January 1, 2026","1","January 3, 2012"],
  ["01/01/2026","1","23/02/2026"]
 ].map(([a,b,c],i)=>new TableRow({children:[
   td(t(a,{b:true,c:INK,f:MONO}),2900,{bg:i%2?ALT:undefined}),
   td(t(b,{f:MONO}),1500,{align:AlignmentType.RIGHT,bg:i%2?ALT:undefined}),
   td(t(c,{f:MONO,s:18,c:MUTE}),5238,{bg:i%2?ALT:undefined})]}))));
K.push(body("The first is the site’s working standard and needs only to be applied to the rest. The American form — January 3, 2012 — should go in any case."));

K.push(F("2.8","Forty-Six of Fifty-Two Picture Links Have No Name"));
K.push(body("On the home page, fifty-two links are made of a picture alone. Six carry a text description; forty-six do not, so a visitor using a screen reader hears the file address instead of the destination. Among them are every organisation logo in the strip above the footer, the SAMAVESH banner, and the four audience cards."));
K.push(body([t("This is a requirement, not a preference. ",{b:true,c:INK}),t("GIGW 3.0 obliges Government of India websites to meet WCAG 2.1 Level AA, which requires every link to have a name that says where it goes. Six links on the page already do it correctly, so the fix is to apply an existing practice to the rest.")]));

K.push(F("2.9","The Organisation Logo Strip"));
K.push(body("The marks in the strip above the footer are supplied at different sizes and on different backgrounds — some on a white plate, some transparent — so the row reads as uneven from top to bottom, and e-Anudaan appears as plain text where the others appear as marks. This was raised at the review of 3 September and is carried here so that it sits with the other consistency items rather than on its own."));

K.push(F("2.10","The Nine Scheme Report Pages"));
K.push(body("The variations already recorded in this review — differing download controls, two behaviours for the same “PDF” button, technical wording in some error messages and plain English in others, and inconsistent filter panels — were established by the web team from the admin panel and are not re-examined here. They are consistent with everything above and should be corrected as part of the same exercise."));

/* ============ CORRECTION ============ */
K.push(h1("A Correction to the Internal Document"));
K.push(body([t("The internal document’s first recommendation is to replace the 47 About Us, Contact Us, RTI and FAQ pages with one template per type, drawing each organisation’s particulars from its record. ",{}),t("For Contact pages that is right and should proceed.",{b:true,c:INK}),t(" For the other three it would cause loss.")]));
K.push(body("The measurement in section 1.1 shows why. The sixteen About Us pages have an average similarity of two per cent and run from 1,585 to 15,240 characters — each is that body’s own history, written for it. The eleven FAQ pages average two per cent and run to 82,692 characters. There is no shared boilerplate in them to remove; a template would either discard the writing or leave it exactly where it is."));
K.push(body([t("Revised recommendation: ",{b:true,c:INK}),t("template the Contact pages only, where the content is short, structured and genuinely repeated. Leave About Us, FAQ and RTI as individual pages, and instead settle the address they are filed under — one of About Us, one of Contact Us, one of FAQ — so that the site can list them together.")]));

/* ============ WHAT TO FIX ============ */
K.push(h1("What to Fix, in Order"));
K.push(body("The first three are corrections to what is published; the rest are decisions to take once and then apply."));
const fixes=[
 ["1","Correct the four links labelled “SECC 2011”","Three of four labels point somewhere other than what they say. A visitor cannot reach two of those pages by any other route.","Immediate"],
 ["2","Give the 46 picture links a name","A legal requirement under GIGW, and six links on the same page already show the pattern to follow.","Immediate"],
 ["3","Publish or withdraw the four blank pages","Three Contact pages and one RTI page are live with nothing on them.","Immediate"],
 ["4","Remove the Directory’s second entry in the menu","One page listed twice in one menu, plus a third name in the footer. Choose one name and use it everywhere.","This month"],
 ["5","Settle one date format","The site already prefers 01 Jan 2026 on every page; four other formats need to follow it.","This month"],
 ["6","Agree one heading rule","One size, one weight, one colour, Title Case, and the heading level matching the size. Then apply it to the Directory’s 22 headings first, since they diverge most.","This month"],
 ["7","Agree one button","One corner radius, one padding, one size — and one appearance for “Admin Login”.","This month"],
 ["8","Reduce the palette to a stated set","Seven blues to one, eight body greys to two, four greens to one, and remove the violet and magenta.","Next quarter"],
 ["9","Replace the seventeen text sizes with a scale","Six or seven sizes in one unit will cover every page on the site.","Next quarter"],
 ["10","Even out the organisation logo strip","One background treatment, one optical size, and a proper mark for e-Anudaan.","Next quarter"],
];
K.push(tbl([620,3100,4600,1318],
 [th("",620),th("Action",3100),th("Why",4600),th("When",1318)],
 fixes.map(([n,a,b,c],i)=>new TableRow({children:[
   td(t(n,{f:MONO,b:true,c:NAVY}),620,{align:AlignmentType.CENTER,bg:i%2?ALT:undefined}),
   td(t(a,{b:true,c:INK}),3100,{bg:i%2?ALT:undefined}),
   td(t(b,{s:19,c:MUTE}),4600,{bg:i%2?ALT:undefined}),
   td(t(c,{s:18,b:i<3,c:i<3?CRIT:MUTE}),1318,{bg:i%2?ALT:undefined})]}))));
K.push(body("Items 6 to 10 are one decision each. Once taken, they are written down as the site’s standard and every new page follows them without further discussion — which is the only way a site with twenty-one editors stays consistent."));

K.push(h1("Basis of This Audit"));
K.push(body("Fifty-two organisation pages of the About Us, Contact, FAQ and RTI families, downloaded in full and compared with one another. Twenty-two further pages covering every page type on the site — the home page, About Us, Who’s Who, the Directory, Contact Us, Schemes & Services, Annual Reports, Tenders, Vacancies, Notices, Publications, Events, Gallery, RTI, CPIO, the statistics dashboard, the sitemap, the privacy policy, a telephone directory, two organisation pages and a division page. Rendered values read directly from the browser on the home page, the Dr. Ambedkar Foundation page and the Ministry Directory. All on 7 September 2026."));

const doc=new Document({creator:"Department of Social Justice & Empowerment",title:"Repeated Content and Design Inconsistencies Across the Website",
 styles:{default:{document:{run:{font:SANS,size:21,color:BODY},paragraph:{spacing:{line:276}}}}},
 sections:[{properties:{page:{margin:{top:1300,bottom:1200,left:1134,right:1134},size:{width:11906,height:16838}}},
  headers:{default:new Header({children:[p([t("Repeated Content and Design Inconsistencies  ·  www.dosje.gov.in",{s:15,c:MUTE})],{after:40,border:{bottom:{style:BorderStyle.SINGLE,size:4,color:RULE}}})]})},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:80},children:[new TextRun({children:["Page ",PageNumber.CURRENT," of ",PageNumber.TOTAL_PAGES],font:SANS,size:15,color:MUTE})]})]})},
  children:K}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(process.argv[2],b);console.log("written",b.length);});
