# MoSJE Website — dosje.gov.in — Design-side Recommendations

**Generated:** 2026-09-18 · For the design team · Separate from the developers' QC report (`../DESIGN-QA-REPORT.md`).

Every figure is measured: design contrast on the exported Figma frame pixels using the designer's own text colour; live findings on the captured page. The PDF beside this file shows each item marked on the element.


## A — Program-level decisions · 10

### DES-A-01 · The design draws #0373DF text on #EBF3FB — 4.15:1, below AA

**Type:** Decide

**Observed.** Measured on the exported frame: the text colour the design sets (#0373DF) against the ground it is drawn on (#EBF3FB) is 4.15:1 at 16px, where WCAG 2.2 AA needs 4.5:1. The pair occurs in 157 distinct text styles across 55 frame(s), including About Us, Annual Reports, Annual Reports-Filter Applied, Back to top. The build copies the design, so the live site fails in the same place.


**Recommendation.** Choose a text colour from the SAMAVESH palette that reaches the ratio on this ground, change it in the design's style rather than frame by frame, and re-export. The build then fixes itself by following the design.


[Open in Figma](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=I3751-10888;3369-4733)

### DES-A-02 · The design draws #E2E6EA text on #0373DF — 3.7:1, below AA

**Type:** Decide

**Observed.** Measured on the exported frame: the text colour the design sets (#E2E6EA) against the ground it is drawn on (#0373DF) is 3.7:1 at 11px, where WCAG 2.2 AA needs 4.5:1. The pair occurs in 68 distinct text styles across 15 frame(s), including CPIO, Contact Us/MoSJE, Contact Us/NCSC, Documents/Annual Reports. The build copies the design, so the live site fails in the same place.


**Recommendation.** Choose a text colour from the SAMAVESH palette that reaches the ratio on this ground, change it in the design's style rather than frame by frame, and re-export. The build then fixes itself by following the design.


[Open in Figma](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=5527-135040)

### DES-A-03 · The design draws #0373DF text on #F8F9FA — 4.41:1, below AA

**Type:** Decide

**Observed.** Measured on the exported frame: the text colour the design sets (#0373DF) against the ground it is drawn on (#F8F9FA) is 4.41:1 at 14px, where WCAG 2.2 AA needs 4.5:1. The pair occurs in 38 distinct text styles across 13 frame(s), including Annual Reports, CPIO, Contact Us/NCSC, Documents/Annual Reports. The build copies the design, so the live site fails in the same place.


**Recommendation.** Choose a text colour from the SAMAVESH palette that reaches the ratio on this ground, change it in the design's style rather than frame by frame, and re-export. The build then fixes itself by following the design.


[Open in Figma](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=I3751-10183;3356-28160)

### DES-A-04 · The design draws #FFFFFF text on #207BD3 — 4.34:1, below AA

**Type:** Decide

**Observed.** Measured on the exported frame: the text colour the design sets (#FFFFFF) against the ground it is drawn on (#207BD3) is 4.34:1 at 12px, where WCAG 2.2 AA needs 4.5:1. The pair occurs in 14 distinct text styles across 5 frame(s), including FAQs, No Result Found, Policies, Search Result. The build copies the design, so the live site fails in the same place.


**Recommendation.** Choose a text colour from the SAMAVESH palette that reaches the ratio on this ground, change it in the design's style rather than frame by frame, and re-export. The build then fixes itself by following the design.


[Open in Figma](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=5243-114910)

### DES-A-05 · The design draws #FFFFFF text on #FF671F — 2.91:1, below AA

**Type:** Decide

**Observed.** Measured on the exported frame: the text colour the design sets (#FFFFFF) against the ground it is drawn on (#FF671F) is 2.91:1 at 28px, where WCAG 2.2 AA needs 3.0:1. The pair occurs in 12 distinct text styles across 4 frame(s), including Home, Home -> SAMAVESH Explore, Home -> SAMAVESH Login (Citizen), Organisation Details. The build copies the design, so the live site fails in the same place.


**Recommendation.** Choose a text colour from the SAMAVESH palette that reaches the ratio on this ground, change it in the design's style rather than frame by frame, and re-export. The build then fixes itself by following the design.


[Open in Figma](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=7639-39781)

### DES-A-06 · The design draws #FFFFFF text on #EC5042 — 3.63:1, below AA

**Type:** Decide

**Observed.** Measured on the exported frame: the text colour the design sets (#FFFFFF) against the ground it is drawn on (#EC5042) is 3.63:1 at 12px, where WCAG 2.2 AA needs 4.5:1. The pair occurs in 10 distinct text styles across 5 frame(s), including Events, Events & Gallery/Gallery -> Photo and Video, Events List, Home. The build copies the design, so the live site fails in the same place.


**Recommendation.** Choose a text colour from the SAMAVESH palette that reaches the ratio on this ground, change it in the design's style rather than frame by frame, and re-export. The build then fixes itself by following the design.


[Open in Figma](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3438-52630)

### DES-A-10 · 516 text layers use a typeface other than Noto Sans

**Type:** Decide

**Observed.** Across the 251 exported handoff frames, 410 layers are set in Roboto, 87 layers are set in Inter, 12 layers are set in Poppins, 7 layers are set in Druk Wide Trial. Noto Sans is the standard across Government of India properties and the estate's only typeface.


**Recommendation.** Reset these layers to the matching Noto Sans text style from the SAMAVESH library.

### DES-A-11 · 1325 text layers are smaller than 12px

**Type:** Decide

**Observed.** UX4G 3.0 names 12px (Body/XS) as the minimum usable size. 1325 text layers in the handoff frames are below it — for example “BETA” at 10px in Events; “Government of India” at 11px in Events; “BETA” at 10px in Who’s Who -> MoSJE; “Government of India” at 11px in Who’s Who -> MoSJE. 79 frames are affected.


**Recommendation.** Raise these to Body/XS (12px) at least; masthead lineage text and badges are the most common cases.

### DES-A-12 · Font sizes outside the UX4G type scale

**Type:** Decide

**Observed.** The UX4G scale is 12/14/16/18/20/24/28/32/36/40/52/60. The design also uses 11px (842×), 10px (342×), 48px (168×), 22px (129×), 8px (125×), 13px (32×), 17px (18×), 56px (16×).


**Recommendation.** Map each to its nearest scale step through the SAMAVESH text styles, so the values the developers read are always on the scale.

### DES-A-13 · Two Home designs, and two Schemes & Services designs — which is current?

**Type:** Decide

**Observed.** The ✅ UI Flow page carries a Home frame (3453:7805) and the Home page carries a newer, taller one (51821:33657); they differ. The Offerings page carries a 'Scheme Discovery — Finalised for Handoff (Review of 14 September)' section whose read-me says it replaces Schemes & Services, while the ✅ flow still shows the older one. This audit compared the build against the newer Home and against Scheme Discovery.


**Recommendation.** Mark one frame of each as current (move the other into Archive), so developers and QC compare against the same design.


## B — Updates to existing Figma frames · 3

### DES-B-01 · Interaction and data states are almost entirely undrawn

**Type:** Design

**Observed.** Of the handoff frames, the number whose name shows each state: focus 0, hover 0, disabled 0, empty 0, error 2, loading 0, skeleton 0, validation 0, 404 0, no result 3. No frame shows focus, hover, disabled, empty, loading, skeleton, validation, 404. On the live site, of 1640 keyboard stops measured on 20 pages, 26 change nothing at all when focused and 16 change only a digit's colour — the pagination and the hero banner, the controls the design never drew a focus state for.


**Recommendation.** Add, as components on the SAMAVESH library rather than per page: the focus ring for every interactive element, hover and disabled for buttons and links, the empty, loading, error and filtered-to-nothing states for every listing (documents, tenders, gallery, events, directories), form validation, and a 404 page.

### DES-B-02 · The DBIM-compliant screens exist at desktop width only (8 frames, 0 phone)

**Type:** Design

**Observed.** Every section of the ✅ UI Flow pages carries phone frames. The DBIM page does not: it holds the newest, DBIM-compliant versions of these screens, and none has a 375px version, so the phone build still follows the earlier, non-compliant design.

- Gallery -> News
- Gallery -> Photo and Video
- Home
- Home -> for Researcher
- Ministry/About Us
- Ministry/Directory
- Ministry/Directory -> MoSJE, Joint Secretary
- Ministry/Who’s Who


**Recommendation.** Draw the 375px version of each DBIM frame from the same components, then retire the superseded phone frames in the ✅ flow.

### DES-B-03 · The DBIM-compliant footer exists on the DBIM page only

**Type:** Design

**Observed.** Only 5 of 251 frames carry a footer with Related Links and Website Policy — all on the DBIM page. Every ✅ UI Flow frame still uses the earlier footer, which lacks the four sections DBIM 5.6 mandates (Archives, Website Policy, Related Links, Feedback). The live footer follows the ✅ flow, and fails DBIM 5.6 on every page.


**Recommendation.** Promote the DBIM page's footer into the SAMAVESH footer component and swap it into every flow frame, so there is one footer in the file.


## C — Views built live with no design · 2

### DES-C-01 · 24 live pages were built with no design frame

**Type:** Propose

**Observed.** These pages are published on dosje.gov.in and have no frame in the handoff file; developers built them without a design to follow, and QC has nothing to check them against.

- /footer-carousel/ — nearest: Carousel 
- /miscellaneous/
- /meta-data/
- /guidelines-for-assisting-ngos-voluntary-organisations/
- /visitor-analytics/
- /official-language-act/
- /updates/ — nearest: Latest Updates Side Sheet Container
- /about-the-division-social-defence/
- /chairpersons-office/
- /about-the-division-statistics-division/
- /about-the-division-2/
- /activities-of-the-ministry-official-language/
- /official-language-background/
- /organisation-under-division-social-division/
- /drug-division/
- /welfare-of-the-other-backward-classes/
- /cessation-of-voluntary-organisation-activities/
- /penalties-in-case-of-misutilization-of-grands/
- /inspection-and-monitoring-procedure/
- /contact-person/
- /procedure-for-processing-grant-in-aid-cases-in-respect-of-voluntary-organisations/
- /prioritization-guidelines-for-funding-projects-by-vuluntary-organisations/
- /about-the-division-welfare-of-the-other-backward-classes/
- /about-the-division/


**Recommendation.** Most are document or policy pages: design one 'content page' template (heading, standfirst, body, attached documents, last-updated) and one 'document register' template (filters, table, paging, empty state), then list which live page uses which. That covers the majority in two frames.

### DES-C-02 · 10 record detail templates have no design

**Type:** Propose

**Observed.** The live site publishes a detail page for each record of these types, with no frame.

- cpio — e.g. /cpio/shri-sumit-kumar/
- cpio — e.g. /cpio/shri-vinesh-pachnanda/
- suo-moto-disclosure — e.g. /suo-moto-disclosure/list-of-schemes-projects-programme-underway-in-nisd/
- suo-moto-disclosure — e.g. /suo-moto-disclosure/security-audit-certificate/
- tender — e.g. /tender/investment-of-an-amount-of-rs-10-00-crore-in-fixed-reg-2/
- tender — e.g. /tender/investment-of-an-amount-of-rs-174-00-crore-in-fixed-reg/
- updates — e.g. /updates/3rd-national-lok-adalat-awareness-material-2026/
- updates — e.g. /updates/pre-bid-meeting-tender-id-gem-2026-b-7743923/
- vacancies — e.g. /vacancies/short-term-internship-programme-at-daic-september-2026/
- vacancies — e.g. /vacancies/short-term-internship-programme-at-dr-ambedkar-international-centre-15-janpath-new-delhi-110001-3/


**Recommendation.** Design one record-detail template (title, meta row, body, attachments, related records) and its variants per type.


## D — UI/UX changes to make in the design · 6

### DES-D-01 · Specify a visible focus indicator

**Type:** Design

**Observed.** Pagination page numbers: screenshotted focused and then blurred, no pixel changes, so a keyboard user cannot see where focus is. Measured on 9 pages. (Dev report WEB-GLOBAL-086.)


**Recommendation.** Give the control a visible focus style — the estate's 4px ring — and make sure it is not removed by an `outline: none` elsewhere in the stylesheet. Draw it into the design first, so every page built from it inherits the fix and QC has something to check against.

### DES-D-02 · Specify the heading hierarchy

**Type:** Design

**Observed.** “Need Support?” is an <h6> directly after an <h1>, skipping h2. The outline cannot be navigated reliably by a screen reader. Measured on 138 pages. (Dev report WEB-GLOBAL-025.)


**Recommendation.** Re-tag the heading so levels descend in order, or promote the heading above it. Where the markup is only for size, use CSS instead. Draw it into the design first, so every page built from it inherits the fix and QC has something to check against.

### DES-D-03 · Carry the DBIM 5.6 footer sections

**Type:** Design

**Observed.** DBIM 5.6 mandates four footer sections. This footer publishes 0 of them; missing: Archives, Website Policy, Related Links, Feedback. Measured on 146 pages. (Dev report WEB-GLOBAL-045.)


**Recommendation.** Add the missing sections to the footer. Archives and Website Policy need a page each; Related Links and Feedback can carry the existing ones. Draw it into the design first, so every page built from it inherits the fix and QC has something to check against.

### DES-D-04 · Keep live type on the UX4G scale

**Type:** Design

**Observed.** 1 element(s) render at 10px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). It is also below Body/XS, the stated minimum usable size. Measured on 130 pages. (Dev report WEB-GLOBAL-063.)


**Recommendation.** Move the size to the nearest step on the UX4G scale, and never below 12px. Draw it into the design first, so every page built from it inherits the fix and QC has something to check against.

### DES-D-05 · Specify 44×44px touch targets

**Type:** Design

**Observed.** “Home” is 41×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 41×21 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 144 pages. (Dev report WEB-GLOBAL-032.)


**Recommendation.** Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. Draw it into the design first, so every page built from it inherits the fix and QC has something to check against.

### DES-D-06 · Link gallery cards to their gallery pages

**Type:** Design

**Observed.** <svg> elements with an img role must have an alternative text — <svg viewBox="0 0 24 24" role="img" tabindex="-1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7"></circle><path d="M16 16 L21 21"></path></svg (svg-img-alt, wcag2a, wcag111). Measured on 2 pages. (Dev report WEB-SCREEN-315.)


**Recommendation.** Correct the markup the rule names; the rule's help page states the accepted fixes. Draw it into the design first, so every page built from it inherits the fix and QC has something to check against.
