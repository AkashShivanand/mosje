const fs=require('fs');
const D=require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel,AlignmentType,Table,TableRow,TableCell,WidthType,ShadingType,BorderStyle,Header,Footer,PageNumber,convertInchesToTwip}=D;

const NAVY="162F6A", INK="1B2130", BODY="333A48", MUTE="5F6779", RULE="C9CFDC", HEADBG="EDF0F7", ALTBG="F7F8FC", CRIT="8C2B2B";
const SANS="Calibri", SERIF="Georgia";
const CW=9638;                                  // content width, A4 with 2cm side margins
const none={style:BorderStyle.NONE,size:0,color:"FFFFFF"};

const t=(text,o={})=>new TextRun({text,font:o.f||SANS,size:o.s||21,bold:o.b||false,italics:o.i||false,color:o.c||BODY,allCaps:o.caps||false,characterSpacing:o.ls});
const p=(runs,o={})=>new Paragraph({children:Array.isArray(runs)?runs:[runs],spacing:{before:o.before??0,after:o.after??140,line:o.line??276},alignment:o.align,border:o.border,indent:o.indent,keepNext:o.keepNext,pageBreakBefore:o.pb});
const body=(s,o={})=>p(Array.isArray(s)?s:t(s,o),{after:o.after??140,before:o.before??0});

/* headings */
const h1=s=>p(t(s,{f:SERIF,s:30,b:true,c:NAVY}),{before:340,after:120,keepNext:true});
const h2=s=>p(t(s,{f:SERIF,s:24,b:true,c:INK}),{before:280,after:100,keepNext:true});
const eyebrow=s=>p(t(s,{s:15,b:true,c:NAVY,caps:true,ls:22}),{after:90});
const rule=()=>new Paragraph({spacing:{before:60,after:180},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:RULE}},children:[t("")]});

/* bullets */
const bullet=(runs)=>new Paragraph({children:Array.isArray(runs)?runs:[runs],bullet:{level:0},spacing:{after:90,line:276},indent:{left:290,hanging:200}});

/* table helpers */
const cell=(kids,o={})=>new TableCell({
  width:{size:o.w,type:WidthType.DXA},
  shading:o.bg?{type:ShadingType.CLEAR,fill:o.bg,color:"auto"}:undefined,
  margins:{top:80,bottom:80,left:130,right:130},
  verticalAlign:D.VerticalAlign.TOP,
  borders:{top:{style:BorderStyle.SINGLE,size:2,color:RULE},bottom:{style:BorderStyle.SINGLE,size:2,color:RULE},left:none,right:none},
  children:kids,
});
const th=(s,w,align)=>cell([p(t(s,{s:16,b:true,c:NAVY,caps:true,ls:16}),{after:0,line:240,align})],{w,bg:HEADBG});
const td=(runs,w,o={})=>cell([p(runs,{after:0,line:250,align:o.align})],{w,bg:o.bg});
const tbl=(widths,head,rows)=>new Table({
  width:{size:CW,type:WidthType.DXA}, columnWidths:widths, layout:D.TableLayoutType.FIXED,
  rows:[new TableRow({tableHeader:true,children:head}),...rows],
});
const caption=s=>p(t(s,{s:16,c:MUTE,i:true}),{before:80,after:220});

/* ─────────────────────────── content ─────────────────────────── */
const kids=[];

/* masthead */
kids.push(p(t("Department of Social Justice & Empowerment · Ministry of Social Justice & Empowerment",{s:16,b:true,c:NAVY,caps:true,ls:20}),{after:200}));
kids.push(p(t("Content Maintenance Responsibilities for the Departmental Website",{f:SERIF,s:40,b:true,c:INK}),{after:120,line:300}));
kids.push(p(t("A proposed role structure for www.dosje.gov.in (SAMAVESH), prepared as a basis for the Content Contribution, Moderation and Approval policy required under GIGW 3.0.",{s:22,c:MUTE}),{after:200,line:290}));
kids.push(new Paragraph({spacing:{before:40,after:60},border:{bottom:{style:BorderStyle.SINGLE,size:12,color:NAVY}},children:[t("")]}));
kids.push(p([t("Prepared following the website review of 3 September 2026",{s:17,c:MUTE}),t("     ·     ",{s:17,c:RULE}),t("Website traversed on 3 September 2026",{s:17,c:MUTE}),t("     ·     ",{s:17,c:RULE}),t("For the kind consideration of the Department",{s:17,c:MUTE})],{after:320}));

/* 1 purpose */
kids.push(h1("1.  Purpose of this Note"));
kids.push(body("During the review of the departmental website held on 3 September 2026, a question was raised that the Department will need a written answer to: once the website is handed over for day-to-day maintenance, who inside the Ministry will look after which part of it?"));
kids.push(body("This note answers that question. It sets out what the website presently consists of, proposes how responsibility for it may be divided, and identifies the parts for which no officer has yet been named. It is offered as a working basis, not as a settled scheme; the Department is best placed to decide which officer or division should hold each responsibility."));
kids.push(body([t("The proposal is framed around the requirements of "),t("Guidelines for Indian Government Websites (GIGW) 3.0",{i:true}),t(", which the Department is obliged to meet. GIGW requires that a "),t("Web Information Manager",{b:true}),t(" be nominated from among the Department’s senior officers, and that a "),t("Content Contribution, Moderation and Approval (CMAP) policy",{b:true}),t(" be approved, naming who may create, moderate and publish each kind of content. The structure below is intended to be adopted directly into that policy.")]));

/* 2 what it consists of */
kids.push(h1("2.  What the Website Presently Consists Of"));
kids.push(body("The figures below were taken from the Department’s own published sitemap on 3 September 2026, which lists 8,702 addresses in all."));
kids.push(tbl([3300,1200,5138],
  [th("Part of the website",3300),th("Count",1200,AlignmentType.RIGHT),th("Remarks",5138)],
  [
    ["Pages","90","Including the divisional pages, the policy pages and the telephone directories"],
    ["Organisation page-trees","21","18 appear in the Associated Organisations menu; 3 do not"],
    ["Divisions","10","Published as groups of links in the Important Links panel"],
    ["Telephone directories","14","One for the Ministry, one for a division, and twelve for organisations"],
    ["Home page components","19","Banner, announcements ticker, statistics, tabbed panels, logo strip and others"],
    ["Documents","5,960","In ten categories, the largest being Advices (981)"],
    ["Officer records","448","Each already carrying the name of the organisation the officer belongs to"],
    ["Events and photographs","1,204","615 events and 589 gallery items"],
    ["Tenders","312","121 of these do not presently carry a category"],
    ["Vacancies","165",""],
    ["Schemes and services","140","22 of these have little or no descriptive text"],
    ["Other records","150","Scheme documents, suo motu disclosures, CPIO entries, bookings and updates"],
  ].map(([a,b,c],i)=>new TableRow({children:[
    td(t(a,{b:true,c:INK}),3300,{bg:i%2?ALTBG:undefined}),
    td(t(b,{f:"Consolas"}),1200,{align:AlignmentType.RIGHT,bg:i%2?ALTBG:undefined}),
    td(t(c,{s:19,c:MUTE}),5138,{bg:i%2?ALTBG:undefined}),
  ]}))));
kids.push(caption("A complete list, one row for every page and component, is enclosed as Annexure A."));

/* 3 how responsibility falls */
kids.push(h1("3.  How Responsibility Naturally Falls"));
kids.push(body("Read as a whole, the website divides into three parts, and the difficulty lies entirely in the third."));
kids.push(body([t("The organisations.  ",{b:true,c:INK}),t("Each attached body — the Commissions, the Corporations, the Foundations and Autonomous Bodies, and the scheme portals — has its own page-tree, its own directory, and its own documents, tenders and contact particulars. That an officer of that body should maintain it was agreed at the review and needs no further discussion.")]));
kids.push(body([t("The divisions.  ",{b:true,c:INK}),t("Ten divisions of the Department publish content, largely through the Important Links panel. Five of them have an “About the Division” page; the remaining five have material to keep current but no page of their own to hold it.")]));
kids.push(body([t("The common pages.  ",{b:true,c:INK}),t("The home page, the navigation and footer, the Directory, Contact Us, the consolidated lists of documents, tenders and vacancies, and the statutory policy pages belong to no single organisation or division. At present they belong to no one at all, and it is here that every matter raised in section 6 arises.")]));
kids.push(body("The working rule suggested at the review — that whoever owns the page should maintain it — is sound, and it holds for the common pages too, provided they are assembled from what the organisations already publish rather than typed a second time. Section 6 explains why that is achievable with what is already built."));

/* 4 role structure */
kids.push(h1("4.  Proposed Role Structure"));
kids.push(body("Fifteen responsibilities, forty holders in all. An officer may of course hold more than one. The last column records the position as it stands today."));
const roles=[
 ["Web Information Manager","1","Required by GIGW 3.0. A senior officer of the Department who approves the content policies, is answerable for the quality of what the website publishes, and whose contact particulars must appear on the website itself.","To be nominated",true],
 ["Website Administrator","1","Creation of logins and roles, plugins, theme, and the technical team’s point of contact within the Department.","In place",false],
 ["Home Page and Announcements","1","Banner, hero photographs, Latest Updates, the three statistics figures, the tabbed panels, the logo strip, the audience pages and the statistics dashboard.","Not assigned",true],
 ["Navigation and Site Structure","1","The main menu, the footer, the Important Links panel, the sitemap — and every change to a page address. See section 6.1.","Not assigned",true],
 ["Directory and Officer Particulars","1","The 448 officer records, the Ministry directory, Who’s Who, Contact Us and the Chairperson’s Office page.","Not assigned",true],
 ["Organisation Nodal Officer","11","One officer for each institutional body: its entire page-tree, directory, documents, tenders, RTI page and contact particulars.","Twelve stated at the review",false],
 ["Scheme Portal Nodal Officer","7","One officer for each thematic portal — Senior Citizens Welfare, PM-AJAY, SMILE (two portals), National Overseas Scholarship, NMBA and NHAA.","Not assigned",true],
 ["Divisional Content Coordinator","10","One officer for each division: its pages, and its group of links in the Important Links panel.","Not assigned",true],
 ["Documents and Publications","1","The 5,960 documents and 100 scheme documents, their categories, and the consolidated lists such as Annual Reports and Circulars.","Not assigned",true],
 ["Recruitment Notices","1","The 165 vacancies and the Vacancies page.","Not assigned",true],
 ["Tenders and Procurement Notices","1","The 312 tenders and the Tenders page.","Not assigned",true],
 ["Events and Photo Gallery","1","615 events and 589 photographs.","Not assigned",true],
 ["RTI, CPIO and Suo Motu Disclosure","1","The RTI page, the 14 CPIO entries and the 15 suo motu disclosures.","Not assigned",true],
 ["Website Policies","1","Copyright, Hyperlinking, Privacy, Terms and Conditions, Help and Visitor Analytics — and the Accessibility Statement, which is not presently published. See section 6.2.","Not assigned",true],
 ["Schemes and Services Catalogue","1","The 140 scheme records and the Schemes and Services page.","Not assigned",true],
];
kids.push(tbl([2500,700,4900,1538],
  [th("Responsibility",2500),th("Officers",700,AlignmentType.CENTER),th("What it covers",4900),th("Position today",1538)],
  roles.map(([a,b,c,d,gap],i)=>new TableRow({children:[
    td(t(a,{b:true,c:INK}),2500,{bg:i%2?ALTBG:undefined}),
    td(t(b,{f:"Consolas"}),700,{align:AlignmentType.CENTER,bg:i%2?ALTBG:undefined}),
    td(t(c,{s:19}),4900,{bg:i%2?ALTBG:undefined}),
    td(t(d,{s:18,b:gap,c:gap?CRIT:MUTE}),1538,{bg:i%2?ALTBG:undefined}),
  ]}))));
kids.push(caption("Forty holders in all. Thirteen are presently identified — the Administrator, and the twelve organisation nodal officers named at the review."));

kids.push(h2("Two rules that are best written into the policy"));
kids.push(bullet([t("Only the officer holding Navigation and Site Structure should change a page address.",{b:true,c:INK}),t(" The reason is set out in section 6.1.")]));
kids.push(bullet([t("Organisations publish; the consolidators curate.",{b:true,c:INK}),t(" A document, tender or vacancy should be published by the organisation it belongs to and appear in the consolidated list automatically. This was the sense of the review. It cannot be enforced at present, because these records carry no field naming their owner — see section 6.3.")]));

/* 5 gap */
kids.push(h1("5.  What Is Not Presently Assigned"));
kids.push(body("Of the fifteen responsibilities, two are held today: the Website Administrator, and the organisation nodal officers named at the review. The remaining thirteen — including the Web Information Manager that GIGW requires — have not been given to anyone."));
kids.push(body("Two consequences follow, and both are visible on the website now. The home page, the menus, the Directory and the statutory pages have no officer to keep them current; and the seven scheme portals, together with three page-trees that do not appear in the Associated Organisations menu at all — e-Anudaan, e-Utthaan and the List of Channelizing Agencies — have no nodal officer named."));

/* 6 matters */
kids.push(h1("6.  Three Matters Requiring Early Attention"));
kids.push(body("These are set out here because each is a consequence of responsibility not being settled, and each can be closed once it is."));

kids.push(h2("6.1  Renaming a page can send a visitor to a different organisation"));
kids.push(body("When a page is renamed or removed, the website resolves the old address by matching only the last part of it, and opens whichever page happens to share that word. In the instances tested on 3 September 2026, a visitor following an older link to the Babu Jagjivan Ram National Foundation’s contact page was taken instead to the contact particulars of the Development and Welfare Board for De-notified, Nomadic and Semi-Nomadic Communities; and a link to the National Backward Classes Finance and Development Corporation’s About Us page opened the Dr. Ambedkar International Centre’s. The redirection is recorded as permanent, so browsers and search engines retain it."));
kids.push(body("The importance of this lies in what triggers it: the ordinary act of renaming a page, which is precisely the power about to be given to a dozen editors. It is therefore recommended that this be corrected, and that changes to page addresses be reserved to a single officer, before further logins are issued."));

kids.push(h2("6.2  The Accessibility Statement is not presently published"));
kids.push(body("GIGW 3.0 requires an accessibility statement on every Government of India website. The address does not presently resolve and the footer does not link to one. This falls to the officer holding Website Policies."));

kids.push(h2("6.3  Documents, tenders and vacancies do not record who they belong to"));
kids.push(body("A document record carries a title, a date and a category, the category being a type of document — Advices, Annual Reports, Circulars and so on — rather than the name of the office that issued it. The same is true of tenders and vacancies. Until a field naming the owner is added, an editor’s access cannot be limited to their own organisation’s records: they must be given all 5,960 or none. Adding that field is therefore a prerequisite to role-based editing rather than a later improvement."));

/* 7 encouraging finding */
kids.push(h1("7.  A Point in the Department’s Favour"));
kids.push(body("The difficulty raised at the review — that the same contact particulars have to be entered in more than one place — is real, but it does not arise from any limitation of the software. The website already holds each officer as a record in its own right, with fields for designation, organisation, telephone, email and address; and in every one of the forty records examined, the organisation the officer belongs to was correctly recorded."));
kids.push(body("What is missing is the particulars themselves. In that sample the office telephone was absent in about a third of records and the address in about half, while the fields for tenure and residence telephone were empty throughout. The duplicate entries on the Contact Us page and on the organisation pages exist because the central record was left blank, not because the website cannot hold it."));
kids.push(body([t("The remedy is accordingly a modest one: each organisation completes its own officers’ records, and the Directory and Contact Us pages are then drawn from those records rather than typed afresh. This is what was suggested at the review, and it can be done with what is already built.",{b:true,c:INK})]));

/* 8 decisions */
kids.push(h1("8.  Matters for the Department’s Decision"));
kids.push(body("Three decisions are requested, and the rest of this note is the material on which they may be taken."));
const dec=[
 ["Nomination of the Web Information Manager and the thirteen unassigned responsibilities","One officer may hold several of them. What is important is that they do not remain unassigned, since every matter in section 6 arises from that class of pages."],
 ["Whether the Directory and Contact Us are to be maintained centrally or by each organisation","It is respectfully suggested that each organisation maintain its own officers’ records, and that the Directory and Contact Us pages be generated from them. Section 7 sets out why this is achievable."],
 ["Nodal officers for the seven scheme portals and the three unlisted page-trees","e-Anudaan, e-Utthaan and the List of Channelizing Agencies are filed as organisations but do not appear in the menu, and no officer has been named for any of them."],
];
kids.push(tbl([700,4600,4338],
  [th("",700),th("Decision",4600),th("Observation",4338)],
  dec.map(([a,b],i)=>new TableRow({children:[
    td(t(String(i+1)+".",{b:true,c:NAVY,f:"Consolas"}),700,{align:AlignmentType.CENTER,bg:i%2?ALTBG:undefined}),
    td(t(a,{b:true,c:INK}),4600,{bg:i%2?ALTBG:undefined}),
    td(t(b,{s:19,c:MUTE}),4338,{bg:i%2?ALTBG:undefined}),
  ]}))));

/* annexure */
kids.push(h1("Annexure A  —  Page-wise Ownership Inventory"));
kids.push(body("A separate schedule accompanies this note, listing 146 rows — one for every page, home page component, organisation page-tree, division, directory and record collection — and showing for each the class of owner, the responsibility proposed above, whether it is assigned today, and where the same content also appears."));
kids.push(body([t("Basis.  ",{b:true,c:INK}),t("The Department’s published sitemap of 3 September 2026 (52 sitemaps, 8,702 addresses); the main menu, footer and Important Links panel as published on that date; a sample of forty of the 448 officer records; and the testing of thirteen page addresses. Requirements cited are from GIGW 3.0, sections 5.4.2 and 5.4.4, and Annexure IV.")]));

const doc=new Document({
  creator:"Department of Social Justice & Empowerment",
  title:"Content Maintenance Responsibilities for the Departmental Website",
  description:"Proposed role structure for www.dosje.gov.in (SAMAVESH)",
  styles:{default:{document:{run:{font:SANS,size:21,color:BODY},paragraph:{spacing:{line:276}}}}},
  sections:[{
    properties:{page:{margin:{top:1300,bottom:1200,left:1134,right:1134},size:{width:11906,height:16838}}},
    headers:{default:new Header({children:[
      p([t("Content Maintenance Responsibilities  ·  www.dosje.gov.in",{s:15,c:MUTE})],{after:40,border:{bottom:{style:BorderStyle.SINGLE,size:4,color:RULE}}})
    ]})},
    footers:{default:new Footer({children:[
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:80},children:[
        new TextRun({children:["Page ",PageNumber.CURRENT," of ",PageNumber.TOTAL_PAGES],font:SANS,size:15,color:MUTE})
      ]})
    ]})},
    children:kids,
  }],
});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync(process.argv[2],b);console.log("written",process.argv[2],b.length);});
