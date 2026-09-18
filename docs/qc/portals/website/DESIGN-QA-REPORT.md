# MoSJE Website — dosje.gov.in - Design QC Report

**Generated:** 2026-09-18  · **Design:** [handoff frames](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-)  
**Status:** ready for review - a human still owes the keyboard and screen-reader pass.

**Also published as:** the PDF beside this file, the `MoSJE Website` sheet in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`.

---
## Summary

| | |
|---|---|
| Boards in the report | 105 |
| Findings | **147** - 14 Blocker, 110 Major, 21 Minor, 2 Nit |
| Applies to every screen | 50 |
| Specific to one screen | 97 |
| Withdrawn, not raised, or noted about the design file | 196 |

Every page in dosje.gov.in's sitemap (94 standalone pages), one sample of every record template (documents, events, gallery, officials, tenders, organisations, vacancies, schemes, scheme documents, suo-moto disclosures, CPIO, bookings, updates) and 25 global states were captured at 1440×900 and 375×812 — 266 captures in all — with the computed CSS, accessibility tree, axe-core results, focus behaviour, target sizes and DBIM element inventory of every element recorded. Findings are measured, never eyeballed: each carries the element's real box and its measured value. Captures the server refused (HTTP 429) were rejected and re-taken. The design side is the MoSJE [Handoff] Figma file: 175 design↔build pairs were compared by specification — type size, weight, family and colour on text matched between the two sides — never by pixel diff, and never on width, height or dynamic data. Where one design frame serves many pages (an organisation template against 172 organisation pages), only shared-template properties are compared, not its sample copy. A breach measured on three or more pages is published once, as a Global finding. Out of scope for this report: the screen-reader walkthrough, Hindi content quality, and the 34 live views for which no design frame exists — those are in the separate design report.

**Where to start.** The findings with the widest reach or the highest severity:

1. **aria-valid-attr-value** - `WEB-GLOBAL-001` · Blocker
2. **Single Access Mechanism for All Verticals o…** - `WEB-GLOBAL-088` · Blocker
3. **Pagination page numbers** - `WEB-GLOBAL-086` · Blocker
4. **Pagination previous / next arrows** - `WEB-GLOBAL-085` · Blocker
5. **Page scrolls sideways at 375px** - `WEB-SCREEN-012` · Blocker

---

## Findings that apply to every screen

Each has its own board in the PDF, showing the design and the build side by side with the marker on the element in question.

### aria-valid-attr-value

`WEB-GLOBAL-001` · **Blocker** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | ARIA attributes must conform to valid values — <th class="sorting sorting_asc" tabindex="0" aria-controls="dataTable1" rowspan="1" colspan="1" aria-sort="ascending" aria-label="#: activate to sort column des (aria-valid-attr-value, wcag2a, wcag412). Measured on 15 pages. |
| **Fix** | The sortable column headers carry `aria-controls="dataTable1"`, but the `<table>` has no id (verified 18 Sep). Add `id="dataTable1"` to the `<table>` that DataTables initialises. |

[Live page](https://www.dosje.gov.in/about-the-division-social-defence/)

### Pagination previous / next arrows

`WEB-GLOBAL-085` · **Blocker** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (2.4.7): every keyboard-focusable control shows a visible focus indicator. DBIM and UX4G both draw a 4px ring. |
| **Build does** | Pagination previous / next arrows: screenshotted focused and then blurred, no pixel changes, so a keyboard user cannot see where focus is. Measured on 9 pages. |
| **Fix** | Add a visible focus style to the pagination links (`.pagination a`, `.page-link`): `:focus-visible { outline: 2px solid #0373DF; outline-offset: 2px; }` — and remove any `outline: none` that overrides it; the current page needs a different style from the focused one, so a keyboard user can tell them apart. |

[Live page](https://www.dosje.gov.in/annual-reports/)

### Pagination page numbers

`WEB-GLOBAL-086` · **Blocker** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (2.4.7): every keyboard-focusable control shows a visible focus indicator. DBIM and UX4G both draw a 4px ring. |
| **Build does** | Pagination page numbers: screenshotted focused and then blurred, no pixel changes, so a keyboard user cannot see where focus is. Measured on 9 pages. |
| **Fix** | Add a visible focus style to the pagination links (`.pagination a`, `.page-link`): `:focus-visible { outline: 2px solid #0373DF; outline-offset: 2px; }` — and remove any `outline: none` that overrides it; the current page needs a different style from the focused one, so a keyboard user can tell them apart. |

[Live page](https://www.dosje.gov.in/annual-reports/)

### Single Access Mechanism for All Verticals o…

`WEB-GLOBAL-088` · **Blocker** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Single Access Mechanism for All Verticals of Empowerment & Social Har…” (p.elementor-heading-title) renders #FFFFFF on #F97316 at 16px/400 — #FFFFFF on #F97316 as painted on the capture: 2.8:1 against the 4.5:1 minimum. Measured on 10 pages. |
| **Fix** | Change the text colour of “Single Access Mechanism for All Verticals o…” from #FFFFFF to #1F2937 (the site's body text colour) — 5.24:1 on #F97316, which passes the 4.5:1 minimum. Or keep #FFFFFF and darken the background from #F97316 to #C05911 (4.51:1). Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Live page](https://www.dosje.gov.in/)

### g8203_6a017643c9e5a_5jbzbySbWZr2OwiYXBianYQzkv1kI7tVXaWbwldA.jpg

`WEB-GLOBAL-009` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 A (1.1.1): every image carries an alt attribute — descriptive where it conveys meaning, empty where it is decorative. |
| **Build does** | “g8203_6a017643c9e5a_5jbzbySbWZr2OwiYXBianYQzkv1kI7tVXaWbwldA.jpg” renders at 411px wide with no alt attribute. A screen reader announces the file name instead of the content. Measured on 6 pages. |
| **Fix** | Add an `alt` to “g8203_6a017643c9e5a_5jbzbySbWZr2OwiYXBianYQzkv1kI7tVXaWbwldA.jpg”: describe it if it carries meaning, `alt=""` if it is decoration. |

[Live page](https://www.dosje.gov.in/gallery/)

### aria-command-name

`WEB-GLOBAL-010` · **Major** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | ARIA commands must have an accessible name — <a class="elementor-button elementor-size-sm" role="button" id="accessibilityButton"> (aria-command-name, wcag2a, wcag412). Measured on 146 pages. |
| **Fix** | Give the accessibility button a name: on `<a id="accessibilityButton" role="button">` add `aria-label="Accessibility options"`. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### link-name

`WEB-GLOBAL-011` · **Major** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Links must have discernible text — <a href="https://www.digitalindia.gov.in/" target="_blank">
							<img loading="lazy" width="105" height="41" src="https://www.dosje.gov.in/wp-content/uploads/ (link-name, wcag2a, wcag244, wcag412). Measured on 146 pages. |
| **Fix** | Give every image-only link a name: on each `<a>` that wraps only an `<img>` (the Digital India, India.gov.in and partner logos in the footer and logo row), set the image's `alt` to the destination — e.g. `alt="Digital India (opens in a new tab)"`. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### link-in-text-block

`WEB-GLOBAL-014` · **Major** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Links must be distinguishable without relying on color — <a href="https://www.dosje.gov.in/organisation/national-portal-for-transgender-persons/" target="_blank" rel="noopener">https://www.dosje.gov.in/organisation/na (link-in-text-block, wcag2a, wcag141). Measured on 3 pages. |
| **Fix** | Underline links inside running text (`text-decoration: underline`), so they are not told apart from the sentence by colour alone. |

[Live page](https://www.dosje.gov.in/about-the-division-social-defence/)

### frame-title

`WEB-GLOBAL-015` · **Major** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Frames must have an accessible name — <iframe data-mcc-blocked="social" data-mcc-src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fgoimsje&amp;tabs=timeline&amp;wi (frame-title, wcag2a, wcag412). Measured on 19 pages. |
| **Fix** | Give the embedded frame from facebook.com a title that says what it shows: `<iframe title="Facebook feed" …>`. |

[Live page](https://www.dosje.gov.in/)

### Contact

`WEB-GLOBAL-024` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 A (1.3.1) and GIGW 3.0: one <h1> per page, naming the page. |
| **Build does** | The page renders no <h1>. Its visible title, “Contact” (h3, 28px), is the element that should be it. Measured on 42 pages. |
| **Fix** | Make “Contact” the page's `<h1>` (Elementor: select the heading → HTML Tag → H1). Keep its current look; only the tag changes. |

[Live page](https://www.dosje.gov.in/contact-us-2/)

### Need Support?

`WEB-GLOBAL-025` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 A (1.3.1): heading levels descend without skipping, so the outline can be navigated. |
| **Build does** | “Need Support?” is an <h6> directly after an <h1>, skipping h2. The outline cannot be navigated reliably by a screen reader. Measured on 138 pages. |
| **Fix** | Change “Need Support?” from `<h6>` to `<h2>` and keep its size with CSS, so the outline steps down one level at a time. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### footer

`WEB-GLOBAL-045` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | DBIM 3.0 §5.6: the footer carries Archives, Website Policy, Related Links and Feedback. |
| **Build does** | DBIM 5.6 mandates four footer sections. This footer publishes 0 of them; missing: Archives, Website Policy, Related Links, Feedback. Measured on 146 pages. |
| **Fix** | Add to the footer: Archives, Website Policy, Related Links, Feedback. Website Policy → one page linking the Copyright, Hyperlinking, Privacy and Terms policies; Related Links → the Important Links list; Feedback → the existing contact form; Archives → a page listing superseded documents. This needs the Ministry's decision on T10 / T32 first. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### UX4G violet in place of the Department's blue

`WEB-GLOBAL-046` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | DBIM 3.0 §2.1: one colour group from the primary palette. UX4G's violet is its own brand layer, not the Department's. |
| **Build does** | 3 element(s) on this page carry UX4G's violet primary (#613AF5) — here “https://www.dosje.gov.in/organisation/national-po…”. DBIM 2.1 allows one colour group from the primary palette. Measured on 3 pages. |
| **Fix** | Override the UX4G variables after `ux4g-min.css` loads: `:root { --bs-primary: #0373DF; --bs-link-color: #0373DF; --bs-blue: #0373DF; }`, and restyle the accessibility widget's controls to the same blue. |

[Live page](https://www.dosje.gov.in/about-the-division-social-defence/)

### of 1500 items

`WEB-GLOBAL-048` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “of 1500 items” · absent from the build |
| **Build does** | The design frame carries “of 1500 items” (12px). Nothing with that text renders on the live page. Measured on 9 pages. |
| **Fix** | Add the text “of 1500 items” where the Figma frame places it (open the frame from the link on this board) — or, if it was dropped on purpose, tell the design team so the frame is updated. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### Search by title, keyword, or document number

`WEB-GLOBAL-049` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by title, keyword, or document nu” · absent from the build |
| **Build does** | The design frame carries “Search by title, keyword, or document number” (16px). Nothing with that text renders on the live page. Measured on 3 pages. |
| **Fix** | Add the text “Search by title, keyword, or document number” where the Figma frame places it (open the frame from the link on this board) — or, if it was dropped on purpose, tell the design team so the frame is updated. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### Empowering citizens with the right to information access gov

`WEB-GLOBAL-051` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “empowering citizens with the right to in” · absent from the build |
| **Build does** | The design frame carries “Empowering citizens with the right to information access government data, decisi” (16px). Nothing with that text renders on the live page. Measured on 3 pages. |
| **Fix** | Add the text “Empowering citizens with the right to information access government data, decisi” where the Figma frame places it (open the frame from the link on this board) — or, if it was dropped on purpose, tell the design team so the frame is updated. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14221)

### Search by name, designation, or organization

`WEB-GLOBAL-052` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by name, designation, or organiza” · absent from the build |
| **Build does** | The design frame carries “Search by name, designation, or organization” (16px). Nothing with that text renders on the live page. Measured on 3 pages. |
| **Fix** | Add the text “Search by name, designation, or organization” where the Figma frame places it (open the frame from the link on this board) — or, if it was dropped on purpose, tell the design team so the frame is updated. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### Login

`WEB-GLOBAL-054` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #FFFFFF · design #0373DF |
| **Build does** | “Login” — colour #0373DF → #FFFFFF. Measured on 92 pages. |
| **Fix** | On “Login”, change #FFFFFF to #0373DF — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### Formation of the Ministry of Welfare

`WEB-GLOBAL-055` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #1F2937 · design #1F2428 |
| **Build does** | “Formation of the Ministry of Welfare” — colour #1F2428 → #1F2937. Measured on 49 pages. |
| **Fix** | On “Formation of the Ministry of Welfare”, change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8567)

### Gov. of India

`WEB-GLOBAL-056` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 12px · design 14px · Built 400 weight · design 500 |
| **Build does** | “Gov. of India” — size 14 → 12; weight 500 → 400. Measured on 79 pages. |
| **Fix** | On “Gov. of India”, change 12px to 14px; change 400 weight to 500 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-109359)

### Name

`WEB-GLOBAL-058` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built 500 weight · design 400 · Built #1F2937 · design #1F2428 |
| **Build does** | “Name” — size 12 → 14; weight 400 → 500; colour #1F2428 → #1F2937. Measured on 7 pages. |
| **Fix** | On “Name”, change 14px to 12px; change 500 weight to 400; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### Union Minister of Social Justice and Empowerment

`WEB-GLOBAL-060` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built #1F2937 · design #343A40 |
| **Build does** | “Union Minister of Social Justice and Empowerment” — size 12 → 14; colour #343A40 → #1F2937. Measured on 4 pages. |
| **Fix** | On “Union Minister of Social Justice and Empowerment”, change 14px to 12px; change #1F2937 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### Here’s how the Ministry empowers citizens like you.

`WEB-GLOBAL-062` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 28px · design 22px · Built #1F2937 · design #1F2428 |
| **Build does** | “Here’s how the Ministry empowers citizens like you.” — size 22 → 28; colour #1F2428 → #1F2937. Measured on 4 pages. |
| **Fix** | On “Here’s how the Ministry empowers citizens like you.”, change 28px to 22px; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8477)

### 10px text

`WEB-GLOBAL-063` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 1 element(s) render at 10px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). It is also below Body/XS, the stated minimum usable size. Measured on 130 pages. |
| **Fix** | Change the 10px text to 12px (Body/XS on the UX4G scale); nothing on a page may be smaller than 12px. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### 8px text

`WEB-GLOBAL-064` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 2 element(s) render at 8px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). It is also below Body/XS, the stated minimum usable size. Measured on 117 pages. |
| **Fix** | Change the 8px text to 12px (Body/XS on the UX4G scale); nothing on a page may be smaller than 12px. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### 11px text

`WEB-GLOBAL-065` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 12 element(s) render at 11px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). It is also below Body/XS, the stated minimum usable size. Measured on 6 pages. |
| **Fix** | Change the 11px text to 12px (Body/XS on the UX4G scale); nothing on a page may be smaller than 12px. |

[Live page](https://www.dosje.gov.in/gallery/)

### Get in Touch

`WEB-GLOBAL-090` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Get in Touch” (a.btn) renders #0373DF on #E5EFF9 at 16px/500 — #0373DF on #E5EFF9 as painted on the capture: 3.99:1 against the 4.5:1 minimum. Measured on 127 pages. |
| **Fix** | Change the text colour of “Get in Touch” from #0373DF to #014B92 (the site's dark blue (footer strip)) — 7.45:1 on #E5EFF9, which passes the 4.5:1 minimum. Or keep #0373DF and lighten the background from #E5EFF9 to #FAFCFE (4.5:1). Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### About Ministry

`WEB-GLOBAL-091` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “About Ministry” (span.elementor-icon-list-text) renders #E2E6EA on #0373DF at 14px/400 — #E2E6EA on #0373DF as painted on the capture: 3.7:1 against the 4.5:1 minimum. Measured on 124 pages. |
| **Fix** | Change the text colour of “About Ministry” from #E2E6EA to #FFFFFF (the site's white) — 4.64:1 on #0373DF, which passes the 4.5:1 minimum. Or keep #E2E6EA and darken the background from #0373DF to #0365C4 (4.56:1). Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Dr. Ambedkar Foundation Official

`WEB-GLOBAL-092` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Dr. Ambedkar Foundation Official” (h4.text-center) renders #0373DF on #F9FAFB at 20px/600 — #0373DF on #F9FAFB as painted on the capture: 4.44:1 against the 4.5:1 minimum. Measured on 30 pages. |
| **Fix** | Change the text colour of “Dr. Ambedkar Foundation Official” from #0373DF to #014B92 (the site's dark blue (footer strip)) — 8.29:1 on #F9FAFB, which passes the 4.5:1 minimum. Or keep #0373DF and lighten the background from #F9FAFB to #FBFBFC (4.5:1). Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Live page](https://www.dosje.gov.in/daf-directory/)

### Ensures user session persistence, allowing …

`WEB-GLOBAL-093` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Ensures user session persistence, allowing seamless navigation on the…” (p.small) renders #938BB6 on #FFFFFF at 12px/400 — #938BB6 on #FFFFFF as painted on the capture: 3.18:1 against the 4.5:1 minimum. Measured on 3 pages. |
| **Fix** | Change the text colour of “Ensures user session persistence, allowing …” from #938BB6 to #0373DF (the site's primary blue) — 4.64:1 on #FFFFFF, which passes the 4.5:1 minimum. Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Live page](https://www.dosje.gov.in/cookies/)

### About Ministry

`WEB-GLOBAL-110` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “About Ministry” is 123×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 123×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 145 pages. |
| **Fix** | Make “About Ministry” at least 44×44px: it is 123×20px. Add 12px padding top and bottom (or set `min-height: 44px; min-width: 44px`), keeping 8px clear of the next control. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Home

`WEB-GLOBAL-111` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Home” is 41×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 41×21 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 146 pages. |
| **Fix** | Make “Home” at least 44×44px: it is 41×21px. Add 12px padding top and bottom and 2px left and right (or set `min-height: 44px; min-width: 44px`), keeping 8px clear of the next control. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Suo-moto Disclosure

`WEB-GLOBAL-113` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #374151 · design #343A40 |
| **Build does** | “Suo-moto Disclosure” — colour #343A40 → #374151. Measured on 7 pages. |
| **Fix** | On “Suo-moto Disclosure”, change #374151 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14262)

### landmark-contentinfo-is-top-level

`WEB-GLOBAL-067` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Contentinfo landmark should not be contained in another landmark — <div class="mosje-visitor-counter mosje-visitor-counter-total" role="contentinfo" aria-label="Total site visits">
					<span class="mvc-item mvc-total">
			<spa (landmark-contentinfo-is-top-level, ). Measured on 146 pages. |
| **Fix** | Remove `role="contentinfo"` from the visitor counter (`<div class="mosje-visitor-counter">`); the page footer is already the contentinfo landmark. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### landmark-no-duplicate-contentinfo

`WEB-GLOBAL-068` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Document should not have more than one contentinfo landmark — <footer data-elementor-type="footer" data-elementor-id="370" class="elementor elementor-370 elementor-location-footer" data-elementor-post-type="elementor_libra (landmark-no-duplicate-contentinfo, ). Measured on 145 pages. |
| **Fix** | Keep exactly one contentinfo landmark: the same fix — drop `role="contentinfo"` from the visitor counter inside the footer. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### html lang

`WEB-GLOBAL-069` · **Minor** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 and WCAG 3.1.1: the page declares its language; en-IN on a Government of India property. |
| **Build does** | The document declares lang="en-US" on a Government of India property; en-IN is the correct locale. Measured on 146 pages. |
| **Fix** | Set the site language to English (India): WordPress → Settings → General → Site Language → English (India), which renders `<html lang="en-IN">`. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### console

`WEB-GLOBAL-070` · **Minor** · Functional · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 quality: a page loads without scripting errors. |
| **Build does** | The page logs 21 JavaScript errors on load. First: Loading the font 'https://fonts.gstatic.com/s/notosans/v42/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevttHOmHS91ixg0.woff2' violates the following Content Security Policy directive: "fo Measured on 146 pages. |
| **Fix** | Fix the first error on load: Loading the font 'https://fonts.gstatic.com/s/notosans/v42/… — later errors often follow from it. Check again with the browser console open. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### meta description

`WEB-GLOBAL-071` · **Minor** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0: every page publishes a descriptive title and meta description. |
| **Build does** | The page publishes no meta description. Measured on 56 pages. |
| **Fix** | Add a meta description of 120–160 characters saying what the page offers (Yoast/Rank Math → the page's SEO box). |

[Live page](https://www.dosje.gov.in/advertisement/)

### Icon-Container.svg

`WEB-GLOBAL-072` · **Minor** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | DBIM 3.0 §3.7: icons are drawn at 24, 32, 48 or 64px, in proportion. |
| **Build does** | 6 icon(s) render at sizes outside DBIM 3.7's set (24/32/48/64 px) — the first is Icon-Container.svg at 35×35px. Measured on 20 pages. |
| **Fix** | Export “Icon-Container.svg” at 24px (or 32 / 48 / 64) and render it at that size, keeping its proportion. |

[Live page](https://www.dosje.gov.in/home-page/for-beneficiary/)

### Choose a portal to visit

`WEB-GLOBAL-073` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 500 weight · design 600 |
| **Build does** | “Choose a portal to visit” — weight 600 → 500. Measured on 4 pages. |
| **Fix** | On “Choose a portal to visit”, change 500 weight to 600 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=7116-34665)

### Helvetica

`WEB-GLOBAL-074` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.2 and the Government standard: Noto Sans across the estate. |
| **Build does** | 3 element(s) render in Helvetica. Noto Sans is the mandated typeface across Government of India properties. Measured on 3 pages. |
| **Fix** | Set “Helvetica” to Noto Sans (`font-family: "Noto Sans", sans-serif`). |

[Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-6/)

### 15px text

`WEB-GLOBAL-076` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 19 element(s) render at 15px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). Measured on 19 pages. |
| **Fix** | Change the 15px text to 16px (Body/M on the UX4G scale). |

[Live page](https://www.dosje.gov.in/contact-us/)

### 22px text

`WEB-GLOBAL-077` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 5 element(s) render at 22px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). Measured on 19 pages. |
| **Fix** | Change the 22px text to 24px (Heading/M on the UX4G scale). |

[Live page](https://www.dosje.gov.in/)

### region

`WEB-GLOBAL-081` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | All page content should be contained by landmarks — <a class="skip-link screen-reader-text" href="#content">Skip to content</a> (region, ). Measured on 78 pages. |
| **Fix** | Move the skip link and the floating widgets inside a landmark, or give their wrapper `role="region"` with an `aria-label`; all visible content must sit in header/nav/main/footer. |

[Live page](https://www.dosje.gov.in/acts-rules/)

### skip-link

`WEB-GLOBAL-082` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | The skip-link target should exist and be focusable — <a class="skip-link screen-reader-text" href="#content">Skip to content</a> (skip-link, ). Measured on 70 pages. |
| **Fix** | This page template has no `<main>` element, so “Skip to content” points at `#content`, which does not exist. Wrap the page content in `<main id="content">` — as the About Us template already does (verified on /policies/ and /newsletter/, 18 Sep). |

[Live page](https://www.dosje.gov.in/acts-rules/)

### landmark-unique

`WEB-GLOBAL-083` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Landmarks should have a unique role or role/label/title (i.e. accessible name) combination — <nav class="e-n-menu" data-widget-number="240" aria-label="Menu" data-touch-mode="false" data-layout="horizontal"> (landmark-unique, ). Measured on 17 pages. |
| **Fix** | Give each navigation a different name: e.g. `aria-label="Main menu"` on the header nav and `aria-label="Footer menu"` on the footer nav. |

[Live page](https://www.dosje.gov.in/cpio/)

### Pagination page numbers

`WEB-GLOBAL-087` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (2.4.7): every keyboard-focusable control shows a visible focus indicator. DBIM and UX4G both draw a 4px ring. |
| **Build does** | Pagination page numbers: screenshotted focused and then blurred, only 1.3% of the region changes — the digit turns from grey to black, with no ring or fill, which is hard to find on a page. Measured on 8 pages. |
| **Fix** | Add a visible focus style to the pagination links (`.pagination a`, `.page-link`): `:focus-visible { outline: 2px solid #0373DF; outline-offset: 2px; }` — and remove any `outline: none` that overrides it; the current page needs a different style from the focused one, so a keyboard user can tell them apart. |

[Live page](https://www.dosje.gov.in/annual-reports/)

### View

`WEB-GLOBAL-112` · **Minor** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “View” is 67×40px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; WCAG 2.5.8's 24×24 floor is met. Measured on 143 pages. |
| **Fix** | Make “View” at least 44×44px: it is 67×40px. Add 2px padding top and bottom (or set `min-height: 44px; min-width: 44px`), keeping 8px clear of the next control. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Access official reports released by the Commission and its a

`WEB-GLOBAL-114` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 14px |
| **Build does** | “Access official reports released by the Commission and its associated ” — size 14 → 16. Measured on 3 pages. |
| **Fix** | On “Access official reports released by the Commission and its a”, change 16px to 14px — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-109359)

### Current Events

`WEB-GLOBAL-115` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 22px · design 20px |
| **Build does** | “Current Events” — size 20 → 22. Measured on 4 pages. |
| **Fix** | On “Current Events”, change 22px to 20px — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-114418)

---

## Findings specific to one screen

## About The Division Social Defence · mobile

### Page scrolls sideways at 375px

`WEB-SCREEN-012` · **Blocker** · Layout & Spacing · Scope: About The Division Social Defence · mobile

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.10): content reflows to 320 CSS px with no horizontal scrolling. |
| **Build does** | The widest element is the link “https://www.dosje.gov.in/organisation/national-po…”. The page scrolls horizontally at 375px: content reaches 446px. WCAG 1.4.10 requires reflow without a horizontal scrollbar down to 320 CSS px. Measured on 2 pages. |
| **Fix** | At 375px the page is 446px wide; the cause is the link “https://www.dosje.gov.in/organisation/national-po…”. For a long link or word add `overflow-wrap: anywhere` to its paragraph; for a table, wrap it in a container with `overflow-x: auto`. The page itself must never scroll sideways. |

[Live page](https://www.dosje.gov.in/about-the-division-social-defence/)

## About Us · desktop

### aria-required-children

`WEB-SCREEN-001` · **Blocker** · Accessibility · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Certain ARIA roles must contain particular children — <div class="elementor-loop-container elementor-grid" role="list"> (aria-required-children, wcag2a, wcag131). Also measured on the 375px capture of the same page. |
| **Fix** | The card grid has `role="list"` but its cards are not `role="listitem"`. Either add `role="listitem"` to each card or remove `role="list"`. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8567) · [Live page](https://www.dosje.gov.in/about-us/)

### 2 pieces of design copy missing

`WEB-SCREEN-357` · **Major** · Content & Iconography · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “matters related to the national schedule” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Matters related to the National Schedule”; “Discover the initiatives that drive nati”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Matters related to the National Schedule”; “Discover the initiatives that drive nati”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8567) · [Live page](https://www.dosje.gov.in/about-us/)

### Evolution of the Department Over Time

`WEB-SCREEN-406` · **Major** · Typography · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #1F2937 · design #343A40 |
| **Build does** | “Evolution of the Department Over Time” — weight 500 → 400; colour #343A40 → #1F2937. Measured on 2 pages. |
| **Fix** | On “Evolution of the Department Over Time”, change 400 weight to 500; change #1F2937 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8567) · [Live page](https://www.dosje.gov.in/about-us/)

### Union Minister of Social Justice and Empowerment

`WEB-SCREEN-405` · **Major** · Typography · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 12px · design 14px · Built #5E5E5E · design #374151 |
| **Build does** | “Union Minister of Social Justice and Empowerment” — size 14 → 12; colour #374151 → #5E5E5E. |
| **Fix** | On “Union Minister of Social Justice and Empowerment”, change 12px to 14px; change #5E5E5E to #374151 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8567) · [Live page](https://www.dosje.gov.in/about-us/)

### Arial

`WEB-SCREEN-284` · **Minor** · Typography · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.2 and the Government standard: Noto Sans across the estate. |
| **Build does** | 80 element(s) render in Arial. Noto Sans is the mandated typeface across Government of India properties. Also measured on the 375px capture of the same page. |
| **Fix** | Set “Arial” to Noto Sans (`font-family: "Noto Sans", sans-serif`). |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8567) · [Live page](https://www.dosje.gov.in/about-us/)

## Circulars Notifications · desktop

### Download buttons, rows 1–2

`WEB-SCREEN-292` · **Blocker** · Functional · Scope: Circulars Notifications · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0: every published link resolves; a document a page offers is downloadable. |
| **Build does** | Every internal link on the site was checked (1,248 unique URLs). Two are dead, both on this page: /wp-content/uploads/2026/04/DoPTOM08.06.2018.pdf and /wp-content/uploads/2026/04/dopteng.pdf, each returning HTTP 404 from the Download button on the reservation-for-OBC rows. |
| **Fix** | Re-upload the two circulars, or point the rows at the current files. A citizen following a published circular reaches a dead end. |

[Live page](https://www.dosje.gov.in/circulars-notifications/)

## Contact Us · mobile

### select-name

`WEB-SCREEN-002` · **Blocker** · Accessibility · Scope: Contact Us · mobile

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Select element must have an accessible name — <select class="form-select mobile-tab-select d-block d-lg-none mb-3" id="mobileTabSelect"> (select-name, wcag2a, wcag412). |
| **Fix** | Label the mobile tab selector: add `aria-label="Choose a section"` to `<select id="mobileTabSelect">`. |

[Live page](https://www.dosje.gov.in/contact-us/)

## Dashboard · mobile

### 29,015

`WEB-SCREEN-328` · **Blocker** · Color & Token · Scope: Dashboard · mobile

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “29,015” (div.mosje-hostel-num) renders #2BA84A on #FFFFFF at 20px/600 — #2BA84A on #FFFFFF as painted on the capture: 3.09:1 against the 4.5:1 minimum. |
| **Fix** | Change the text colour of “29,015” from #2BA84A to #0373DF (the site's primary blue) — 4.64:1 on #FFFFFF, which passes the 4.5:1 minimum. Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Live page](https://www.dosje.gov.in/dashboard/)

## Home · desktop

### Home hero banner (an unlabelled link)

`WEB-SCREEN-326` · **Blocker** · Components & States · Scope: Home · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (2.4.7): every keyboard-focusable control shows a visible focus indicator. DBIM and UX4G both draw a 4px ring. |
| **Build does** | Home hero banner (an unlabelled link): screenshotted focused and then blurred, no pixel changes, so a keyboard user cannot see where focus is. |
| **Fix** | Add a visible focus style to the hero banner link (`.swiper-slide a`): `:focus-visible { outline: 2px solid #0373DF; outline-offset: 2px; }` — and remove any `outline: none` that overrides it. Give the banner link a name too: `aria-label` with the slide's message. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-7805) · [Live page](https://www.dosje.gov.in/)

### BETA

`WEB-SCREEN-413` · **Major** · Color & Token · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #1F2937 · design #000000 |
| **Build does** | “BETA” — colour #000000 → #1F2937. Also measured on the 375px capture of the same page. |
| **Fix** | On “BETA”, change #1F2937 to #000000 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-7805) · [Live page](https://www.dosje.gov.in/)

### The Ministry of Social Justice & Empowerment works to uplift (area 2 of 3)

`WEB-SCREEN-375` · **Major** · Content & Iconography · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “the ministry of social justice & empower” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “The Ministry of Social Justice & Empower”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “The Ministry of Social Justice & Empower”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-7805) · [Live page](https://www.dosje.gov.in/)

### Our Team

`WEB-SCREEN-419` · **Major** · Typography · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 16px · Built #0373DF · design #003366 |
| **Build does** | “Our Team” — size 16 → 14; colour #003366 → #0373DF. Also measured on the 375px capture of the same page. |
| **Fix** | On “Our Team”, change 14px to 16px; change #0373DF to #003366 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-7805) · [Live page](https://www.dosje.gov.in/)

### Promotes equality and social participation for all communiti (area 3 of 3)

`WEB-SCREEN-376` · **Major** · Content & Iconography · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “promotes equality and social participati” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Promotes equality and social participati”. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Promotes equality and social participati”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-7805) · [Live page](https://www.dosje.gov.in/)

### Empowering India, Every Day. (area 1 of 3)

`WEB-SCREEN-374` · **Major** · Content & Iconography · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “empowering india, every day” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Empowering India, Every Day.”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Empowering India, Every Day.”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-7805) · [Live page](https://www.dosje.gov.in/)

## Home · mobile

### Previous slide

`WEB-SCREEN-355` · **Blocker** · Color & Token · Scope: Home · mobile

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.11): the visible part of a control — its icon, its outline, its indicator — needs 3:1 against what is behind it. |
| **Build does** | Text “Previous slide” (div.ccps-nav-btn) renders #EEEEEE on #FFFFFF at 16px/400 — #F0EFED on #FCF9EA as painted on the capture: 1.09:1 against the 3.0:1 minimum. |
| **Fix** | Change the icon of “Previous slide” from #F0EFED to #0373DF (the site's primary blue) — 4.4:1 on #FCF9EA, which passes the 3.0:1 minimum. Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4285-223026) · [Live page](https://www.dosje.gov.in/)

### Discover our schemes, careers, and partnerships.

`WEB-SCREEN-418` · **Major** · Typography · Scope: Home · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 14px · Built 400 weight · design 500 · Built #1F2937 · design #343A40 |
| **Build does** | “Discover our schemes, careers, and partnerships.” — size 14 → 16; weight 500 → 400; colour #343A40 → #1F2937. |
| **Fix** | On “Discover our schemes, careers, and partnerships.”, change 16px to 14px; change 400 weight to 500; change #1F2937 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4285-223026) · [Live page](https://www.dosje.gov.in/)

### Explore our schemes, career opportunities, and business part

`WEB-SCREEN-415` · **Major** · Typography · Scope: Home · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 12px · Built #1F2937 · design #343A40 |
| **Build does** | “Explore our schemes, career opportunities, and business partnerships” — size 12 → 16; colour #343A40 → #1F2937. Measured on 2 pages. |
| **Fix** | On “Explore our schemes, career opportunities, and business part”, change 16px to 12px; change #1F2937 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4285-223026) · [Live page](https://www.dosje.gov.in/)

### Need Support?

`WEB-SCREEN-424` · **Major** · Typography · Scope: Home · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 500 weight · design 600 · Built #1F2937 · design #1F2428 |
| **Build does** | “Need Support?” — weight 600 → 500; colour #1F2428 → #1F2937. |
| **Fix** | On “Need Support?”, change 500 weight to 600; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4285-223026) · [Live page](https://www.dosje.gov.in/)

## Minutes Of Screening Committees 2 · mobile

### Page scrolls sideways at 375px

`WEB-SCREEN-013` · **Blocker** · Layout & Spacing · Scope: Minutes Of Screening Committees 2 · mobile

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.10): content reflows to 320 CSS px with no horizontal scrolling. |
| **Build does** | The widest element is the th “#”. The page scrolls horizontally at 375px: content reaches 582px. WCAG 1.4.10 requires reflow without a horizontal scrollbar down to 320 CSS px. Measured on 2 pages. |
| **Fix** | At 375px the page is 582px wide; the cause is the th “#”. For a long link or word add `overflow-wrap: anywhere` to its paragraph; for a table, wrap it in a container with `overflow-x: auto`. The page itself must never scroll sideways. |

[Live page](https://www.dosje.gov.in/minutes-of-screening-committees-2/)

## Scheme Documents  Dr Ambedkar National Merit Award Scheme  · desktop

### Scheme: Dr. Ambedkar National Merit Award S…

`WEB-SCREEN-329` · **Blocker** · Color & Token · Scope: Scheme Documents  Dr Ambedkar National Merit Award Scheme  · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Scheme: Dr. Ambedkar National Merit Award Scheme for meritorious stud…” (p.mb-0) renders #938BB6 on #F9FAFB at 16px/400 — #938BB6 on #F9FAFB as painted on the capture: 3.04:1 against the 4.5:1 minimum. Measured on 2 pages. |
| **Fix** | Change the text colour of “Scheme: Dr. Ambedkar National Merit Award S…” from #938BB6 to #014B92 (the site's dark blue (footer strip)) — 8.29:1 on #F9FAFB, which passes the 4.5:1 minimum. Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Live page](https://www.dosje.gov.in/scheme-documents/dr-ambedkar-national-merit-award-scheme-for-scs-students-for-class-12th-level/)

## Scheme Documents  Merger Order · desktop

### Scheme: Dr. Ambedkar Scheme for Social Inte…

`WEB-SCREEN-330` · **Blocker** · Color & Token · Scope: Scheme Documents  Merger Order · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Scheme: Dr. Ambedkar Scheme for Social Integration through Inter-Cast…” (p.mb-0) renders #938BB6 on #F9FAFB at 16px/400 — #938BB6 on #F9FAFB as painted on the capture: 3.04:1 against the 4.5:1 minimum. Measured on 2 pages. |
| **Fix** | Change the text colour of “Scheme: Dr. Ambedkar Scheme for Social Inte…” from #938BB6 to #014B92 (the site's dark blue (footer strip)) — 8.29:1 on #F9FAFB, which passes the 4.5:1 minimum. Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Live page](https://www.dosje.gov.in/scheme-documents/merger-order/)

## About Us · mobile

### Overview

`WEB-SCREEN-396` · **Major** · Typography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 28px · design 20px · Built 500 weight · design 600 |
| **Build does** | “Overview” — size 20 → 28; weight 600 → 500. Measured on 2 pages. |
| **Fix** | On “Overview”, change 28px to 20px; change 500 weight to 600 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-88901) · [Live page](https://www.dosje.gov.in/about-us/)

### Evolution of the Department Over Time

`WEB-SCREEN-394` · **Major** · Typography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 12px · Built #1F2937 · design #343A40 |
| **Build does** | “Evolution of the Department Over Time” — size 12 → 16; colour #343A40 → #1F2937. Measured on 2 pages. |
| **Fix** | On “Evolution of the Department Over Time”, change 16px to 12px; change #1F2937 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-88901) · [Live page](https://www.dosje.gov.in/about-us/)

### Formation of the Ministry of Welfare

`WEB-SCREEN-395` · **Major** · Typography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 20px · design 16px · Built 600 weight · design 500 · Built #1F2937 · design #1F2428 |
| **Build does** | “Formation of the Ministry of Welfare” — size 16 → 20; weight 500 → 600; colour #1F2428 → #1F2937. |
| **Fix** | On “Formation of the Ministry of Welfare”, change 20px to 16px; change 600 weight to 500; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-88901) · [Live page](https://www.dosje.gov.in/about-us/)

### There are two departments viz. Department of Social Justice  (area 2 of 2)

`WEB-SCREEN-358` · **Major** · Content & Iconography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “there are two departments viz. departmen” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “There are two departments viz. Departmen”. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “There are two departments viz. Departmen”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-88901) · [Live page](https://www.dosje.gov.in/about-us/)

### scrollable-region-focusable

`WEB-SCREEN-014` · **Major** · Accessibility · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Scrollable region must have keyboard access — <div class="table-responsive w-100"> (scrollable-region-focusable, wcag2a, wcag211, wcag213). Measured on 2 pages. |
| **Fix** | Make the scrolling table wrapper reachable by keyboard: add `tabindex="0"`, `role="region"` and `aria-label="<table name>"` to `<div class="table-responsive">`. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-88901) · [Live page](https://www.dosje.gov.in/about-us/)

### May 1998

`WEB-SCREEN-404` · **Major** · Typography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 20px · design 11px · Built 600 weight · design 500 |
| **Build does** | “May 1998” — size 11 → 20; weight 500 → 600. |
| **Fix** | On “May 1998”, change 20px to 11px; change 600 weight to 500 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-88901) · [Live page](https://www.dosje.gov.in/about-us/)

## Annual Reports · desktop

### Access official reports released by the Commission and its a

`WEB-SCREEN-362` · **Major** · Content & Iconography · Scope: Annual Reports · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “access official reports released by the ” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Access official reports released by the ”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Access official reports released by the ”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

## Annual Reports · mobile

### NSFDC

`WEB-SCREEN-397` · **Major** · Color & Token · Scope: Annual Reports · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #0373DF · design #1F2428 |
| **Build does** | “NSFDC” — colour #1F2428 → #0373DF. |
| **Fix** | On “NSFDC”, change #0373DF to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-109359)

## Booking  Conference 3 · desktop

### Government

`WEB-SCREEN-254` · **Major** · Typography · Scope: Booking  Conference 3 · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #212121 · design #1F2428 |
| **Build does** | “Government” — weight 500 → 400; colour #1F2428 → #212121. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | On “Government”, change 400 weight to 500; change #212121 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4743-129775)

## Booking  Vaishali · desktop

### Government

`WEB-SCREEN-255` · **Major** · Typography · Scope: Booking  Vaishali · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #212121 · design #1F2428 |
| **Build does** | “Government” — weight 500 → 400; colour #1F2428 → #212121. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | On “Government”, change 400 weight to 500; change #212121 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4743-129775)

## Contact Person · mobile

### scrollable-region-focusable

`WEB-SCREEN-015` · **Major** · Accessibility · Scope: Contact Person · mobile

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Scrollable region must have keyboard access — <div class="table-responsive w-100"> (scrollable-region-focusable, wcag2a, wcag211, wcag213). Measured on 2 pages. |
| **Fix** | Make the scrolling table wrapper reachable by keyboard: add `tabindex="0"`, `role="region"` and `aria-label="<table name>"` to `<div class="table-responsive">`. |

[Live page](https://www.dosje.gov.in/contact-person/)

## Contact Us · desktop

### 3 pieces of design copy missing

`WEB-SCREEN-363` · **Major** · Content & Iconography · Scope: Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “contact details” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Contact Details”; “Connect directly with the Ministry, reac”; “Ministry of Social Justice and Empowerme”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Contact Details”; “Connect directly with the Ministry, reac”; “Ministry of Social Justice and Empowerme”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14626)

### National Commission for Scheduled Castes (NCSC)

`WEB-SCREEN-256` · **Major** · Typography · Scope: Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 15px · design 16px · Built #333333 · design #1F2428 |
| **Build does** | “National Commission for Scheduled Castes (NCSC)” — size 16 → 15; colour #1F2428 → #333333. |
| **Fix** | On “National Commission for Scheduled Castes (NCSC)”, change 15px to 16px; change #333333 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14626)

## Cpio · desktop

### The designated authority responsible for providing timely an

`WEB-SCREEN-365` · **Major** · Content & Iconography · Scope: Cpio · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “the designated authority responsible for” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “The designated authority responsible for”. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “The designated authority responsible for”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14262)

### List of CPIOs/AAs

`WEB-SCREEN-398` · **Major** · Color & Token · Scope: Cpio · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #1F2937 · design #014B92 |
| **Build does** | “List of CPIOs/AAs” — colour #014B92 → #1F2937. |
| **Fix** | On “List of CPIOs/AAs”, change #1F2937 to #014B92 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14262)

## Cpio · mobile

### List of CPIOs/AAs

`WEB-SCREEN-257` · **Major** · Typography · Scope: Cpio · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 22px · design 20px · Built #1F2937 · design #014B92 |
| **Build does** | “List of CPIOs/AAs” — size 20 → 22; colour #014B92 → #1F2937. |
| **Fix** | On “List of CPIOs/AAs”, change 22px to 20px; change #1F2937 to #014B92 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4626-80865)

## Dashboard · desktop

### Dashboard

`WEB-SCREEN-407` · **Major** · Typography · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 40px · Built 500 weight · design 600 · Built #1F2937 · design #FFFFFF |
| **Build does** | “Dashboard” — size 40 → 14; weight 600 → 500; colour #FFFFFF → #1F2937. |
| **Fix** | On “Dashboard”, change 14px to 40px; change 500 weight to 600; change #1F2937 to #FFFFFF — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4743-128714) · [Live page](https://www.dosje.gov.in/dashboard/)

### 2 pieces of design copy missing

`WEB-SCREEN-366` · **Major** · Content & Iconography · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “sc/st women beneficiary percentage” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “SC/ST Women Beneficiary Percentage”; “Total SC/ST Beneficiary Count”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “SC/ST Women Beneficiary Percentage”; “Total SC/ST Beneficiary Count”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4743-128714) · [Live page](https://www.dosje.gov.in/dashboard/)

### Pre-Matric (SCs & Others)

`WEB-SCREEN-331` · **Major** · Color & Token · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Pre-Matric (SCs & Others)” (span.mosje-cat-metric-label) renders #6B6F78 on #EAF2FB at 12px/500 — #6B6F78 on #EAF2FB as painted on the capture: 4.46:1 against the 4.5:1 minimum. |
| **Fix** | Change the text colour of “Pre-Matric (SCs & Others)” from #6B6F78 to #014B92 (the site's dark blue (footer strip)) — 7.67:1 on #EAF2FB, which passes the 4.5:1 minimum. Or keep #6B6F78 and lighten the background from #EAF2FB to #EBF3FB (4.5:1). Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4743-128714) · [Live page](https://www.dosje.gov.in/dashboard/)

### 13px text

`WEB-SCREEN-290` · **Minor** · Typography · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 41 element(s) render at 13px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Change the 13px text to 14px (Body/S on the UX4G scale). |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4743-128714) · [Live page](https://www.dosje.gov.in/dashboard/)

## Events  Ek Ped Maa Ke Naam 6 · desktop

### Description

`WEB-SCREEN-260` · **Major** · Typography · Scope: Events  Ek Ped Maa Ke Naam 6 · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 20px · design 28px · Built #0373DF · design #014B92 |
| **Build does** | “Description” — size 28 → 20; colour #014B92 → #0373DF. Measured on 2 pages. |
| **Fix** | On “Description”, change 20px to 28px; change #0373DF to #014B92 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14110) · [Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-6/)

### Declared

`WEB-SCREEN-332` · **Major** · Color & Token · Scope: Events  Ek Ped Maa Ke Naam 6 · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Declared” (span.badge) renders #FFFFFF on #3C9718 at 12px/500 — #FFFFFF on #3C9718 as painted on the capture: 3.73:1 against the 4.5:1 minimum. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Change the text colour of “Declared” from #FFFFFF to #1C1C1C — 4.57:1 on #3C9718, which passes the 4.5:1 minimum. Or keep #FFFFFF and darken the background from #3C9718 to #358615 (4.57:1). Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14110) · [Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-6/)

## Events  Ek Ped Maa Ke Naam 6 · mobile

### Description

`WEB-SCREEN-258` · **Major** · Color & Token · Scope: Events  Ek Ped Maa Ke Naam 6 · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #0373DF · design #014B92 |
| **Build does** | “Description” — colour #014B92 → #0373DF. Measured on 2 pages. |
| **Fix** | On “Description”, change #0373DF to #014B92 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-115254)

### Email

`WEB-SCREEN-259` · **Major** · Typography · Scope: Events  Ek Ped Maa Ke Naam 6 · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 12px · design 14px · Built #343A40 · design #1F2937 |
| **Build does** | “Email” — size 14 → 12; colour #1F2937 → #343A40. Measured on 2 pages. |
| **Fix** | On “Email”, change 12px to 14px; change #343A40 to #1F2937 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-115254)

## Events  Ek Ped Maa Ke Naam 7 · desktop

### Description

`WEB-SCREEN-263` · **Major** · Typography · Scope: Events  Ek Ped Maa Ke Naam 7 · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 20px · design 28px · Built #0373DF · design #014B92 |
| **Build does** | “Description” — size 28 → 20; colour #014B92 → #0373DF. Measured on 2 pages. |
| **Fix** | On “Description”, change 20px to 28px; change #0373DF to #014B92 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14110) · [Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-7/)

### Declared

`WEB-SCREEN-333` · **Major** · Color & Token · Scope: Events  Ek Ped Maa Ke Naam 7 · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Declared” (span.badge) renders #FFFFFF on #3C9718 at 12px/500 — #FFFFFF on #3C9718 as painted on the capture: 3.73:1 against the 4.5:1 minimum. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Change the text colour of “Declared” from #FFFFFF to #1C1C1C — 4.57:1 on #3C9718, which passes the 4.5:1 minimum. Or keep #FFFFFF and darken the background from #3C9718 to #358615 (4.57:1). Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14110) · [Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-7/)

## Events  Ek Ped Maa Ke Naam 7 · mobile

### Description

`WEB-SCREEN-261` · **Major** · Color & Token · Scope: Events  Ek Ped Maa Ke Naam 7 · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #0373DF · design #014B92 |
| **Build does** | “Description” — colour #014B92 → #0373DF. Measured on 2 pages. |
| **Fix** | On “Description”, change #0373DF to #014B92 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-115254)

### Email

`WEB-SCREEN-262` · **Major** · Typography · Scope: Events  Ek Ped Maa Ke Naam 7 · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 12px · design 14px · Built #343A40 · design #1F2937 |
| **Build does** | “Email” — size 14 → 12; colour #1F2937 → #343A40. Measured on 2 pages. |
| **Fix** | On “Email”, change 12px to 14px; change #343A40 to #1F2937 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-115254)

## Events · desktop

### 2 pieces of design copy missing

`WEB-SCREEN-368` · **Major** · Content & Iconography · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “discover initiatives, workshops, and awa” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Discover initiatives, workshops, and awa”; “View All”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Discover initiatives, workshops, and awa”; “View All”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

### Other Events

`WEB-SCREEN-412` · **Major** · Typography · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 24px · design 28px · Built 500 weight · design 600 · Built #1F2937 · design #1F2428 |
| **Build does** | “Other Events” — size 28 → 24; weight 600 → 500; colour #1F2428 → #1F2937. |
| **Fix** | On “Other Events”, change 24px to 28px; change 500 weight to 600; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

### Upcoming Events

`WEB-SCREEN-408` · **Major** · Color & Token · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #374151 · design #1F2428 |
| **Build does** | “Upcoming Events” — colour #1F2428 → #374151. Also measured on the 375px capture of the same page. |
| **Fix** | On “Upcoming Events”, change #374151 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

### Past Events

`WEB-SCREEN-409` · **Major** · Color & Token · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #1F2937 · design #343A40 |
| **Build does** | “Past Events” — colour #343A40 → #1F2937. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | On “Past Events”, change #1F2937 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

## Events · mobile

### Stay updated on the Ministry’s recent events and campaigns f

`WEB-SCREEN-410` · **Major** · Typography · Scope: Events · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 12px · Built 500 weight · design 400 · Built #374151 · design #343A40 |
| **Build does** | “Stay updated on the Ministry’s recent events and campaigns for equalit” — size 12 → 16; weight 400 → 500; colour #343A40 → #374151. |
| **Fix** | On “Stay updated on the Ministry’s recent events and campaigns f”, change 16px to 12px; change 500 weight to 400; change #374151 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-114418)

### Other Events

`WEB-SCREEN-411` · **Major** · Typography · Scope: Events · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 24px · design 20px · Built 500 weight · design 600 · Built #1F2937 · design #1F2428 |
| **Build does** | “Other Events” — size 20 → 24; weight 600 → 500; colour #1F2428 → #1F2937. |
| **Fix** | On “Other Events”, change 24px to 20px; change 500 weight to 600; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-114418)

## Gallery · desktop

### Gallery standfirst

`WEB-SCREEN-293` · **Major** · Content & Iconography · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0: page content is accurate, specific to the page, and in the Department's own register. |
| **Build does** | Under the Gallery page's <h1>, the standfirst reads “Review comprehensive annual reports released by the Commission and its associated organisations.” That is the Annual Reports page's description, and it also says “the Commission” on a Department page. It is the first sentence a citizen reads on the page. |
| **Fix** | Replace with a description of the gallery — what it holds and who publishes it — in the Department's own words, and use “the Department”. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

### 2 pieces of design copy missing

`WEB-SCREEN-371` · **Major** · Content & Iconography · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “explore photos, videos and news from the” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Explore photos, videos and news from the”; “Search by keyword or event”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Explore photos, videos and news from the”; “Search by keyword or event”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

### Gallery card

`WEB-SCREEN-295` · **Major** · Functional · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0: published content is reachable by navigating the site, not only by search. |
| **Build does** | The gallery cards link straight to an image file on the CDN (dxrs6j9umb85v.cloudfront.net). A citizen who opens one in a new tab, or whose lightbox script fails, lands on a bare JPEG with no masthead, no context and no way back — and a search engine indexes the file rather than the page. |
| **Fix** | Point the card at its gallery page and open the lightbox from there, so the image is always reachable inside the site. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

### Gallery listing

`WEB-SCREEN-294` · **Major** · Functional · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0: published content is reachable by navigating the site, not only by search. |
| **Build does** | The sitemap publishes 590 gallery pages at /gallery/<name>/, and each one loads. The Gallery listing links to CDN image files instead, so those 590 pages can be found only through a search engine. |
| **Fix** | Link each card to its /gallery/<name>/ page. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

## Mosje Directory · desktop

### Discover the Commissions, Corporations, Institutes and Found

`WEB-SCREEN-377` · **Major** · Content & Iconography · Scope: Mosje Directory · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “discover the commissions, corporations, ” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Discover the Commissions, Corporations, ”. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Discover the Commissions, Corporations, ”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

## Mosje Directory · mobile

### Union Cabinet Minister of Social Justice & Empowerment

`WEB-SCREEN-264` · **Major** · Typography · Scope: Mosje Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 20px · design 12px · Built 600 weight · design 500 · Built #0373DF · design #1F2428 |
| **Build does** | “Union Cabinet Minister of Social Justice & Empowerment” — size 12 → 20; weight 500 → 600; colour #1F2428 → #0373DF. |
| **Fix** | On “Union Cabinet Minister of Social Justice & Empowerment”, change 20px to 12px; change 600 weight to 500; change #0373DF to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### Prabhat Kumar Tripathy

`WEB-SCREEN-400` · **Major** · Typography · Scope: Mosje Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #0373DF · design #1F2428 |
| **Build does** | “Prabhat Kumar Tripathy” — weight 500 → 400; colour #1F2428 → #0373DF. |
| **Fix** | On “Prabhat Kumar Tripathy”, change 400 weight to 500; change #0373DF to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### 011-23381656, 011-23381657, 011-23381669(Fax), 011-23018975,

`WEB-SCREEN-399` · **Major** · Typography · Scope: Mosje Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built 400 weight · design 500 · Built #1F2937 · design #1F2428 |
| **Build does** | “011-23381656, 011-23381657, 011-23381669(Fax), 011-23018975, 011-23018” — size 12 → 14; weight 500 → 400; colour #1F2428 → #1F2937. Measured on 2 pages. |
| **Fix** | On “011-23381656, 011-23381657, 011-23381669(Fax), 011-23018975,”, change 14px to 12px; change 400 weight to 500; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

## Official  Dr Swati S Mishra · desktop

### Address

`WEB-SCREEN-265` · **Major** · Typography · Scope: Official  Dr Swati S Mishra · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 12px · Built 700 weight · design 400 · Built #1F2937 · design #1F2428 |
| **Build does** | “Address” — size 12 → 16; weight 400 → 700; colour #1F2428 → #1F2937. Measured on 2 pages. |
| **Fix** | On “Address”, change 16px to 12px; change 700 weight to 400; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9455)

## Official  Shri Shailendra Kumar · desktop

### Address

`WEB-SCREEN-266` · **Major** · Typography · Scope: Official  Shri Shailendra Kumar · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 12px · Built 700 weight · design 400 · Built #1F2937 · design #1F2428 |
| **Build does** | “Address” — size 12 → 16; weight 400 → 700; colour #1F2428 → #1F2937. Measured on 2 pages. |
| **Fix** | On “Address”, change 16px to 12px; change 700 weight to 400; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9455)

## Organisation  Contact Us · desktop

### Indira Gandhi International Airport

`WEB-SCREEN-267` · **Major** · Color & Token · Scope: Organisation  Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #5E5E5E · design #343A40 |
| **Build does** | “Indira Gandhi International Airport” — colour #343A40 → #5E5E5E. |
| **Fix** | On “Indira Gandhi International Airport”, change #5E5E5E to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14723)

## Organisation  Contact Us · mobile

### Nearest Airport

`WEB-SCREEN-269` · **Major** · Typography · Scope: Organisation  Contact Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 14px · Built #1F2937 · design #1F2428 |
| **Build does** | “Nearest Airport” — size 14 → 16; colour #1F2428 → #1F2937. |
| **Fix** | On “Nearest Airport”, change 16px to 14px; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4626-81838)

### Indira Gandhi International Airport

`WEB-SCREEN-268` · **Major** · Typography · Scope: Organisation  Contact Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built #5E5E5E · design #343A40 |
| **Build does** | “Indira Gandhi International Airport” — size 12 → 14; colour #343A40 → #5E5E5E. |
| **Fix** | On “Indira Gandhi International Airport”, change 14px to 12px; change #5E5E5E to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4626-81838)

## Policies · mobile

### 1. Information Collection We do not automatically gather any

`WEB-SCREEN-379` · **Major** · Content & Iconography · Scope: Policies · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “1. information collection we do not auto” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “1. Information Collection We do not auto”. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “1. Information Collection We do not auto”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4330-66694)

## Rti · desktop

### 2 pieces of design copy missing

`WEB-SCREEN-380` · **Major** · Content & Iconography · Scope: Rti · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “right to information act 2005” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Right to Information Act 2005”; “The National Commission for Scheduled Ca”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Right to Information Act 2005”; “The National Commission for Scheduled Ca”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14221)

## Samavesh Admin Portals · desktop

### SMILE - Transgender

`WEB-SCREEN-270` · **Major** · Typography · Scope: Samavesh Admin Portals · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 700 weight · design 500 · Built #FF671F · design #1F2428 |
| **Build does** | “SMILE - Transgender” — weight 500 → 700; colour #1F2428 → #FF671F. Measured on 2 pages. |
| **Fix** | On “SMILE - Transgender”, change 700 weight to 500; change #FF671F to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=7298-28616)

## Samavesh Citizen Portals · desktop

### SMILE - Transgender

`WEB-SCREEN-271` · **Major** · Typography · Scope: Samavesh Citizen Portals · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 700 weight · design 500 · Built #FF671F · design #1F2428 |
| **Build does** | “SMILE - Transgender” — weight 500 → 700; colour #1F2428 → #FF671F. Measured on 2 pages. |
| **Fix** | On “SMILE - Transgender”, change 700 weight to 500; change #FF671F to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=7116-34665)

## Schemes And Services  Geriatric Caregivers Training · mobile

### About the Scheme

`WEB-SCREEN-272` · **Major** · Typography · Scope: Schemes And Services  Geriatric Caregivers Training · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 28px · design 20px · Built 500 weight · design 600 |
| **Build does** | “About the Scheme” — size 20 → 28; weight 600 → 500. Measured on 2 pages. |
| **Fix** | On “About the Scheme”, change 28px to 20px; change 500 weight to 600 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105399)

## Schemes And Services  Top Class Education In Colllege For Obc  · desktop

### Active

`WEB-SCREEN-275` · **Major** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #FFFFFF · design #1F2937 |
| **Build does** | “Active” — weight 500 → 400; colour #1F2937 → #FFFFFF. |
| **Fix** | On “Active”, change 400 weight to 500; change #FFFFFF to #1F2937 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-11885)

### Scheme

`WEB-SCREEN-281` · **Minor** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 |
| **Build does** | “Scheme” — weight 500 → 400. |
| **Fix** | On “Scheme”, change 400 weight to 500 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-11885)

## Schemes And Services  Top Class Education In Colllege For Obc  · mobile

### Active

`WEB-SCREEN-274` · **Major** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #FFFFFF · design #1F2428 |
| **Build does** | “Active” — weight 500 → 400; colour #1F2428 → #FFFFFF. |
| **Fix** | On “Active”, change 400 weight to 500; change #FFFFFF to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105399)

### Archived

`WEB-SCREEN-276` · **Major** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #374151 · design #343A40 |
| **Build does** | “Archived” — weight 500 → 400; colour #343A40 → #374151. |
| **Fix** | On “Archived”, change 400 weight to 500; change #374151 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105399)

### Start Publish Date

`WEB-SCREEN-273` · **Major** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built 500 weight · design 400 · Built #1F2937 · design #343A40 |
| **Build does** | “Start Publish Date” — size 12 → 14; weight 400 → 500; colour #343A40 → #1F2937. |
| **Fix** | On “Start Publish Date”, change 14px to 12px; change 500 weight to 400; change #1F2937 to #343A40 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105399)

## Schemes Services · desktop

### 2 pieces of design copy missing

`WEB-SCREEN-381` · **Major** · Content & Iconography · Scope: Schemes Services · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “explore welfare schemes, social empowerm” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Explore welfare schemes, social empowerm”; “Search by scheme name or keyword”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Explore welfare schemes, social empowerm”; “Search by scheme name or keyword”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12250)

## Scw Directory · mobile

### 011-23381656, 011-23381657, 011-23381669(Fax), 011-23018975,

`WEB-SCREEN-401` · **Major** · Typography · Scope: Scw Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built 400 weight · design 500 · Built #1F2937 · design #1F2428 |
| **Build does** | “011-23381656, 011-23381657, 011-23381669(Fax), 011-23018975, 011-23018” — size 12 → 14; weight 500 → 400; colour #1F2428 → #1F2937. Measured on 2 pages. |
| **Fix** | On “011-23381656, 011-23381657, 011-23381669(Fax), 011-23018975,”, change 14px to 12px; change 400 weight to 500; change #1F2937 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

## Sitemap · desktop

### Dashboard

`WEB-SCREEN-277` · **Major** · Typography · Scope: Sitemap · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 16px · Built #0373DF · design #014B92 |
| **Build does** | “Dashboard” — size 16 → 14; colour #014B92 → #0373DF. |
| **Fix** | On “Dashboard”, change 14px to 16px; change #0373DF to #014B92 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=5243-134590)

## State · Accessibility Panel Open · desktop

### tabindex

`WEB-SCREEN-287` · **Major** · Accessibility · Scope: State · Accessibility Panel Open · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Elements should not have tabindex greater than zero — <button type="button" aria-label="Close main navigation panel" class="uwaw-close" tabindex="1"></button> (tabindex, ). |
| **Fix** | Remove `tabindex="1"` from the widget's Close button (use `tabindex="0"` or none) so Tab order follows the page. |

[Live page](https://www.dosje.gov.in/)

### nested-interactive

`WEB-SCREEN-286` · **Major** · Accessibility · Scope: State · Accessibility Panel Open · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Interactive controls must not be nested — <button aria-label="Light Dark Theme" aria-pressed="false" tabindex="9" id="dark-btn" class="uwaw-features__item__i"> (nested-interactive, wcag2a, wcag412). |
| **Fix** | In the accessibility widget, the Light/Dark button sits inside another control. Make the outer element a plain container (no role/tabindex). |

[Live page](https://www.dosje.gov.in/)

### 13px text

`WEB-SCREEN-291` · **Minor** · Typography · Scope: State · Accessibility Panel Open · desktop

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 14 element(s) render at 13px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). Measured on 2 pages. |
| **Fix** | Change the 13px text to 14px (Body/S on the UX4G scale). |

[Live page](https://www.dosje.gov.in/)

## State · Gallery Card Opens · desktop

### svg-img-alt

`WEB-SCREEN-315` · **Major** · Accessibility · Scope: State · Gallery Card Opens · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | <svg> elements with an img role must have an alternative text — <svg viewBox="0 0 24 24" role="img" tabindex="-1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7"></circle><path d="M16 16 L21 21"></path></svg (svg-img-alt, wcag2a, wcag111). Measured on 2 pages. |
| **Fix** | Name the search icon: on `<svg role="img">` add `<title>Search</title>` as its first child, or set `aria-hidden="true"` if the button already has a label. |

[Live page](https://www.dosje.gov.in/gallery/)

## State · Gallery Lightbox · desktop

### svg-img-alt

`WEB-SCREEN-016` · **Major** · Accessibility · Scope: State · Gallery Lightbox · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | <svg> elements with an img role must have an alternative text — <svg viewBox="0 0 24 24" role="img" tabindex="-1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7"></circle><path d="M16 16 L21 21"></path></svg (svg-img-alt, wcag2a, wcag111). Measured on 2 pages. |
| **Fix** | Name the search icon: on `<svg role="img">` add `<title>Search</title>` as its first child, or set `aria-hidden="true"` if the button already has a label. |

[Live page](https://www.dosje.gov.in/gallery/)

## State · Important Links Modal · desktop

### aria-dialog-name

`WEB-SCREEN-017` · **Major** · Accessibility · Scope: State · Important Links Modal · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | ARIA dialog and alertdialog nodes should have an accessible name — <div class="modal fade modal-links show" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display: blo (aria-dialog-name, ). |
| **Fix** | On the Important Links dialog `<div id="exampleModal">`, change `aria-labelledby="exampleModalLabel"` to `aria-labelledby="exampleModalPopoversLabel"` — the id its “Important Links” heading actually has. |

[Live page](https://www.dosje.gov.in/)

## State · Search Scholarship · desktop

### Scholarship

`WEB-SCREEN-334` · **Major** · Color & Token · Scope: State · Search Scholarship · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Scholarship” (mark) renders #0373DF on #FFF3CD at 16px/600 — #0373DF on #FFF3CD as painted on the capture: 4.19:1 against the 4.5:1 minimum. |
| **Fix** | Change the text colour of “Scholarship” from #0373DF to #014B92 (the site's dark blue (footer strip)) — 7.82:1 on #FFF3CD, which passes the 4.5:1 minimum. Or keep #0373DF and lighten the background from #FFF3CD to #FFFBF0 (4.5:1). Change it where the colour is set (the shared class or theme setting), so every page using this pair is fixed at once. |

[Live page](https://www.dosje.gov.in/?s=scholarship)

## Suo Moto Disclosure · desktop

### Government’s proactive release of key information to ensure 

`WEB-SCREEN-385` · **Major** · Content & Iconography · Scope: Suo Moto Disclosure · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “government's proactive release of key in” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Government’s proactive release of key in”. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Government’s proactive release of key in”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14426)

## Tenders · desktop

### Search by tender name or keyword

`WEB-SCREEN-387` · **Major** · Content & Iconography · Scope: Tenders · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by tender name or keyword” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Search by tender name or keyword”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Search by tender name or keyword”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12568)

## Vacancies · desktop

### Search by vacancy name or keyword

`WEB-SCREEN-388` · **Major** · Content & Iconography · Scope: Vacancies · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by vacancy name or keyword” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Search by vacancy name or keyword”. Also measured on the 375px capture of the same page. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Search by vacancy name or keyword”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12427)

## Vacancies · mobile

### Contact & Support (area 2 of 2)

`WEB-SCREEN-389` · **Major** · Content & Iconography · Scope: Vacancies · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “contact & support” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Contact & Support”. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Contact & Support”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105929)

## Whos Who · desktop

### Discover the Commissions, Corporations, Institutes and Found

`WEB-SCREEN-391` · **Major** · Content & Iconography · Scope: Whos Who · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “discover the commissions, corporations, ” · absent from the build |
| **Build does** | The design frame carries this copy and nothing with the same text renders on the live page: “Discover the Commissions, Corporations, ”. |
| **Fix** | Add this copy where the Figma frame places it (each piece is outlined on the design panel): “Discover the Commissions, Corporations, ”. Where a piece was dropped on purpose, tell the design team so the frame is updated instead. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8801)

### Designation

`WEB-SCREEN-425` · **Major** · Color & Token · Scope: Whos Who · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #212121 · design #1F2428 |
| **Build does** | “Designation” — colour #1F2428 → #212121. |
| **Fix** | On “Designation”, change #212121 to #1F2428 — as in the Figma frame (link on this board). Make the change in the shared style for this element, so every page using it follows. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8801)

## For Student · desktop

### Audience page standfirst

`WEB-SCREEN-356` · **Nit** · Content & Iconography · Scope: For Student · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0: page content is accurate, specific to the page, and in the Department's own register. |
| **Build does** | All four audience pages open with “Here's how the Ministry empowers citizens like you.” A reader who arrives on the page for their own group is told nothing specific to it. |
| **Fix** | Give each audience page a sentence about what that audience will find on it. |

[Live page](https://www.dosje.gov.in/home-page/for-student/)

## Policies Acts Rules Codes Circular · desktop

### empty-table-header

`WEB-SCREEN-327` · **Nit** · Accessibility · Scope: Policies Acts Rules Codes Circular · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Table header text should not be empty — <th class="sorting sorting_asc" tabindex="0" colspan="1" rowspan="1" aria-controls="dataTable1" aria-sort="ascending" aria-label="#: activate to sort column des (empty-table-header, ). Also measured on the 375px capture of the same page. |
| **Fix** | Correct the markup named in the finding. |

[Live page](https://www.dosje.gov.in/policies-acts-rules-codes-circular/)

---
## Withdrawn on re-checking, not raised, and notes on the design file

Nothing here is a finding. Each was either raised in an earlier round and did not survive re-checking, ruled out of scope, or is a defect in the handoff file rather than the build. They stay visible, with the reason, so a reviewer who saw one learns the outcome rather than wondering where it went.

- **Global · No visible focus indicator — Open the accessibility option — Open the accessibility option** - Re-measured on pixels: the control is invisible until focused and then shows a visible ring. The first version compared styles, not what a keyboard user sees.
- **Global · Non-text control below 3:1 — Language Translator — Language Translator** - Re-measured on pixels with the element's own CSS colour: the pair passes on screen. The first version read an anti-aliased edge pixel as the text colour.
- **Global · Text contrast below AA — Single Access Mechanism for All Verticals o… — Single Access Mechanism for All Verticals o…** - Merged into WEB-GLOBAL-088, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Non-text control below 3:1 — Previous slide — Previous slide** - Merged into WEB-SCREEN-355, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Non-text control below 3:1 — Go to slide 1 — Go to slide 1** - Re-measured on pixels with the element's own CSS colour: the pair passes on screen. The first version read an anti-aliased edge pixel as the text colour.
- **Global · Text contrast below AA — About Ministry — About Ministry** - Merged into WEB-GLOBAL-091, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — Open Department — Open Department** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — Home — Home** - Merged into WEB-GLOBAL-111, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — Department — Department** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — Associated Organisations — Associated Organisations** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Text contrast below AA — Get in Touch — Get in Touch** - Merged into WEB-GLOBAL-090, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Text contrast below AA — Get in Touch — Get in Touch** - Merged into WEB-GLOBAL-090, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — About Ministry — About Ministry** - Merged into WEB-GLOBAL-110, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — Vision & Mission — Vision & Mission** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — Organisational Chart — Organisational Chart** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — Ministers & Officials — Ministers & Officials** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Text contrast below AA — View All Documents from MoSJE — View All Documents from MoSJE** - Merged into WEB-GLOBAL-092, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Text contrast below AA — Chairperson's office — Chairperson's office** - Merged into WEB-GLOBAL-092, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Content in the design is not in the build — last updated on — last updated on** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Global · Touch target below the minimum — MoSJE — MoSJE** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Built value differs from the design — dr. virendra kumar — dr. virendra kumar** - Withdrawn: on the re-capture the design and build values could not both be proven on screen (the element was covered by the sticky header or not painted where the page says it is), so the comparison is not published.
- **Global · Text contrast below AA — Dr. Ambedkar International Centre (DAIC) — Dr. Ambedkar International Centre (DAIC)** - Merged into WEB-GLOBAL-092, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Built value differs from the design — dr. virendra kumar — dr. virendra kumar** - Withdrawn: on the re-capture the design and build values could not both be proven on screen (the element was covered by the sticky header or not painted where the page says it is), so the comparison is not published.
- **Global · Touch target below the minimum — Transgender — Transgender** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — NBCFDC — NBCFDC** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — NCBC — NCBC** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — DAF — DAF** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — DAIC — DAIC** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — NSFDC — NSFDC** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — NMBA — NMBA** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — SCW — SCW** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — NSKFDC — NSKFDC** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Text contrast below AA — Dr. Swati S. Mishra — Dr. Swati S. Mishra** - Merged into WEB-GLOBAL-092, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Touch target below the minimum — DAIC — DAIC** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Global · Built value differs from the design — mos3-msje[at]gov[dot]in — mos3-msje[at]gov[dot]in** - Withdrawn: on the re-capture the design and build values could not both be proven on screen (the element was covered by the sticky header or not painted where the page says it is), so the comparison is not published.
- **Global · Content in the design is not in the build — target group — target group** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Global · Content in the design is not in the build — sort by recently added — sort by recently added** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Global · Automated accessibility violation — heading-order — heading-order** - Not reproduced on the re-capture of 18 September 2026.
- **Global · The four audience pages share one description — Audience page standfirst — Audience page standfirst** - Merged into WEB-SCREEN-356, which now carries this defect together with the others of the same kind — one fix, one row.
- **About Us · desktop — discover the initiatives that drive national efforts to adva** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **About Us · desktop — the department of social justice & empowerment is entrusted ** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **About Us · desktop — the ministry has been implementing various programmes/scheme** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **About Us · desktop — in the year 1985-86, the erstwhile ministry of welfare was b** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **About Us · desktop — in january, 2007, the minorities division along with wakf un** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **About Us · mobile — mrs. caralyn khongwar deshmukh, as** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **About Us · mobile — matters related to the national scheduled castes finance and** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **About Us · mobile — shri biswaranjan sasmal, as** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **About Us · mobile — mrs. yogita swaroop, sr. ea** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **About Us · mobile — ms. latha ganapathy, js** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Acts Rules · mobile — NHAA** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Annual Reports · desktop — access official reports released by the commission and its a** - Merged into WEB-GLOBAL-114, which now carries this defect together with the others of the same kind — one fix, one row.
- **Annual Reports · desktop — download all reports** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Annual Reports · mobile — NISD** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Annual Reports · mobile — BJRNF** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Circulars Notifications · mobile — PMAJAY** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Circulars Notifications · mobile — Smile Beggary** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Contact Us · desktop — contact details** - Merged into WEB-SCREEN-363, which now carries this defect together with the others of the same kind — one fix, one row.
- **Contact Us · desktop — connect directly with the ministry, reach the concerned depa** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Contact Us · desktop — ministry of social justice and empowerment (mosje) contact d** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Contact Us · desktop — room no. 631, a-wing, shastri bhawan, new delhi - 110001** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Contact Us · desktop — complaint[at]ncsc[dot]gov[dot]in** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Contact Us · desktop — national commission for safai karamchari (ncsk)** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Cookies · desktop — Session Cookies always active** - Re-measured on pixels with the element's own CSS colour: the pair passes on screen. The first version read an anti-aliased edge pixel as the text colour.
- **Cookies · desktop — Ensures user session persistence, allowing …** - Merged into WEB-GLOBAL-093, which now carries this defect together with the others of the same kind — one fix, one row.
- **Cpio · desktop — the designated authority responsible for providing timely an** - Merged into WEB-SCREEN-365, which now carries this defect together with the others of the same kind — one fix, one row.
- **Cpio · desktop — sort by recently updated** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Cpio · desktop — designantion** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Cpio · desktop — shri gulshan kumar pahadia, ad** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Cpio · desktop — ms. sanmeet kaur, dig(p)** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Cpio · desktop — sanmeet[dot]kaur[at]ips[dot]gov[dot]in** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Cpio · mobile — gk[dot]pahadia[at]gov[dot]in** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Dashboard · desktop — Pre-Matric (SCs & Others)** - Merged into WEB-SCREEN-331, which now carries this defect together with the others of the same kind — one fix, one row.
- **Dashboard · desktop — total sc/st beneficiary count** - Merged into WEB-SCREEN-366, which now carries this defect together with the others of the same kind — one fix, one row.
- **Dashboard · desktop — sc/st coverage rate** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Dashboard · desktop — dapsc budget utilization rate** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Dashboard · desktop — sc/st women beneficiary percentage** - Merged into WEB-SCREEN-366, which now carries this defect together with the others of the same kind — one fix, one row.
- **Dashboard · desktop — sc/st scholarship beneficiaries** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Dashboard · mobile — 29,015** - Merged into WEB-SCREEN-328, which now carries this defect together with the others of the same kind — one fix, one row.
- **Events · desktop — discover initiatives, workshops, and awareness programs that** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Events · desktop — view all** - Merged into WEB-SCREEN-368, which now carries this defect together with the others of the same kind — one fix, one row.
- **Events · desktop — hard to reach population-smile (beggary)** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Events · desktop — nov 10th, 2025 • 05:00 pm onwards** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Events · desktop — dr. ambedkar international centre** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Events · desktop — "chandalika" - musical dance drama** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Events · mobile — painting exhibition and yamuna sustaibablity run** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Events  Ek Ped Maa Ke Naam 6 · desktop — Declared** - Merged into WEB-SCREEN-332, which now carries this defect together with the others of the same kind — one fix, one row.
- **Events  Ek Ped Maa Ke Naam 7 · desktop — Declared** - Merged into WEB-SCREEN-332, which now carries this defect together with the others of the same kind — one fix, one row.
- **For Researchers · desktop — discover all welfare initiatives, social justice schemes, an** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **For Researchers · desktop — browse the key legislations, policy frameworks, and governme** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Forms Templates · mobile — PMAJAY** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Forms Templates · mobile — NOS** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Forms Templates · mobile — access official reports released by the commission and its a** - Merged into WEB-GLOBAL-114, which now carries this defect together with the others of the same kind — one fix, one row.
- **Gallery · desktop — explore photos, videos and news from the ministry of social ** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Gallery · desktop — search by keyword or event** - Merged into WEB-SCREEN-371, which now carries this defect together with the others of the same kind — one fix, one row.
- **Gallery · desktop — ambedkar jayanti celebration 2025** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Gallery · desktop — glimpses from the national celebration** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Gallery · desktop — elder care workshop** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Gallery · desktop — training for caregivers and elder care professionals** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Gallery · mobile — “Ek Ped Maa Ke Naam”** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Gallery · mobile — scholars present research on ambedkar studies** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Home · desktop — empowering india, every day** - Merged into WEB-SCREEN-374, which now carries this defect together with the others of the same kind — one fix, one row.
- **Home · desktop — bringing social justice to every doorstep through digital ac** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Home · desktop — explore opportunities** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Home · desktop — view schemes** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Home · desktop — latest updates** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Home · desktop — new funding alert!** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Home · mobile — Go to slide 1** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Home · mobile — Go to slide 2** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Home · mobile — Go to slide 3** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Home · mobile — Go to slide 4** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Home · mobile — smile - support for marginalised individuals for livelihood ** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Home · mobile — integrated rehabilitation, skills training and livelihood su** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Lok Sabha Question Answer · mobile — NCSK** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Mosje Directory · desktop — discover the commissions, corporations, institutes and found** - Merged into WEB-SCREEN-377, which now carries this defect together with the others of the same kind — one fix, one row.
- **Mosje Directory · desktop — reset filters** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Mosje Directory · desktop — organization** - Merged into WEB-GLOBAL-052, which now carries this defect together with the others of the same kind — one fix, one row.
- **Mosje Directory · desktop — ashutosh niranjan** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Mosje Directory · desktop — ms. priya sharma** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Mosje Directory · desktop — private secretary to the minister** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Mosje Directory · mobile — browse our directory for key contact information of commissi** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Mosje Directory · mobile — download directory** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Mosje Directory · mobile — telephone(res./mobile)** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Mosje Directory · mobile — ashutosh niranjan, ias** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Mosje Directory · mobile — devansh wathrey** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Mosje Directory · mobile — tripathi[dot]yogesh[at]nic[dot]in** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Notices · mobile — BJRNF** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Notices · mobile — E-Anudaan** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Policies · desktop — 1. information collection we do not automatically gather any** - Merged into WEB-SCREEN-379, which now carries this defect together with the others of the same kind — one fix, one row.
- **Procedure For Processing Grant In Aid Cases In Respect Of Voluntary Organisations · desktop — Home** - Merged into WEB-GLOBAL-111, which now carries this defect together with the others of the same kind — one fix, one row.
- **Procedure For Processing Grant In Aid Cases In Respect Of Voluntary Organisations · desktop — Department** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Procedure For Processing Grant In Aid Cases In Respect Of Voluntary Organisations · desktop — Associated Organisations** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Resources · mobile — DWBDNC** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Rti · desktop — suo-moto disclosure** - Merged into WEB-GLOBAL-113, which now carries this defect together with the others of the same kind — one fix, one row.
- **Rti · desktop — right to information act 2005** - Merged into WEB-SCREEN-380, which now carries this defect together with the others of the same kind — one fix, one row.
- **Rti · desktop — the national commission for scheduled castes (ncsc) is a con** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Scheme Documents  Dr Ambedkar National Merit Award Scheme  · desktop — Scheme: Dr. Ambedkar National Merit Award S…** - Merged into WEB-SCREEN-329, which now carries this defect together with the others of the same kind — one fix, one row.
- **Scheme Documents  Merger Order · desktop — Scheme: Dr. Ambedkar Scheme for Social Inte…** - Merged into WEB-SCREEN-330, which now carries this defect together with the others of the same kind — one fix, one row.
- **Schemes And Services  Geriatric Caregivers Training · mobile — Senior Citizens Welfare(SCW)** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Schemes Services · desktop — schemes and services** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Schemes Services · desktop — explore welfare schemes, social empowerment programs, and ci** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Schemes Services · desktop — search by scheme name or keyword** - Merged into WEB-SCREEN-381, which now carries this defect together with the others of the same kind — one fix, one row.
- **Schemes Services · desktop — smile - support for marginalised individuals for livelihood ** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Schemes Services · desktop — integrated rehabilitation, skills training and livelihood su** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Schemes Services · desktop — scheme for economic empowerment of dnts (seed)** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Schemes Services · mobile — venture capital fund for scs & obcs** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **State · Home 320 · mobile320 — Go to slide 1** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **State · Home 320 · mobile320 — Go to slide 2** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **State · Home 320 · mobile320 — Go to slide 3** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **State · Home 320 · mobile320 — Go to slide 4** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **State · Home Hindi · desktop — घर** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **State · Home Hindi · desktop — विभाग** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **State · Home Hindi · desktop — संबद्ध संगठन** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **State · Mega Menu Department · desktop — Close Department** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **State · Search Scholarship · desktop — Scholarship** - Merged into WEB-SCREEN-334, which now carries this defect together with the others of the same kind — one fix, one row.
- **State · Search Scholarship · desktop — …** - Merged into WEB-GLOBAL-093, which now carries this defect together with the others of the same kind — one fix, one row.
- **Suo Moto Disclosure · desktop — government's proactive release of key information to ensure ** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Suo Moto Disclosure · desktop — sort by recently updated** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Suo Moto Disclosure · desktop — list of faa** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Suo Moto Disclosure · desktop — list of cpio** - Merged into WEB-SCREEN-398, which now carries this defect together with the others of the same kind — one fix, one row.
- **Suo Moto Disclosure · desktop — list of cpio and faa** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Suo Moto Disclosure · desktop — list of cpios and faas** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Supreme Court Judgement · mobile — NCSK** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Tenders · desktop — search by tender name or keyword** - Merged into WEB-SCREEN-387, which now carries this defect together with the others of the same kind — one fix, one row.
- **Tenders · desktop — archived** - Merged into WEB-SCREEN-276, which now carries this defect together with the others of the same kind — one fix, one row.
- **Tenders · mobile — NSFDC** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Tenders · mobile — explore current tender notices, eligibility details, and sub** - Withdrawn: on the re-capture the design and build values could not both be proven on screen (the element was covered by the sticky header or not painted where the page says it is), so the comparison is not published.
- **Tenders · mobile — active tenders** - Withdrawn: on the re-capture the design and build values could not both be proven on screen (the element was covered by the sticky header or not painted where the page says it is), so the comparison is not published.
- **Updates · mobile — NOS** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Vacancies · desktop — search by vacancy name or keyword** - Merged into WEB-SCREEN-388, which now carries this defect together with the others of the same kind — one fix, one row.
- **Vacancies · desktop — engagement of supervisor/consultant (contract)** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Vacancies · desktop — new delhi · contract · apply by 30 nov 2025** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Vacancies · desktop — supervisory and consultant roles for project implementation ** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Vacancies · desktop — temporary / short-term consultants** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Vacancies · desktop — multiple locations · contract · ongoing** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Vacancies · mobile — search by scheme name or keyword** - Merged into WEB-SCREEN-381, which now carries this defect together with the others of the same kind — one fix, one row.
- **Vacancies · mobile — contact & support** - Merged into WEB-SCREEN-389, which now carries this defect together with the others of the same kind — one fix, one row.
- **Vacancies · mobile — nodal ministry** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Vacancies · mobile — shreshta@dosje.gov.in** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Vacancies · mobile — 5th floor, lok nayak bhawan, khan market, new delhi - 110003** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Visitor Analytics · desktop — Previous** - Merged into WEB-GLOBAL-085, which now carries this defect together with the others of the same kind — one fix, one row.
- **Whos Who · desktop — discover the commissions, corporations, institutes and found** - Merged into WEB-SCREEN-377, which now carries this defect together with the others of the same kind — one fix, one row.
- **Whos Who · desktop — mosje officials** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Whos Who · desktop — min-sje@nic.in** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Whos Who · desktop — 201 c-wing, shastri bhawan, new delhi** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Whos Who · desktop — mosathawale@gmail.com** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Whos Who · desktop — shri b l verma** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Whos Who · mobile — Dr. Virendra Kumar** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Whos Who · mobile — Shri Kishor Makwana** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Whos Who · mobile — Shri Kaishab Bihari** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Whos Who · mobile — Sadhvi Niranjan Jyoti** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Whos Who · mobile — 101c-wing, shastri bhawan, new delhi** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Whos Who · mobile — room no. 623, a-wing, shastri bhawan** - Withdrawn: the design text is sample content in a repeated list or data field — names, e-mail addresses, dates, figures, event or album titles — which the live page fills with real entries. It is different data, not missing interface copy.
- **Home · mobile — Go to slide 1** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Home · mobile — Go to slide 2** - Merged into WEB-GLOBAL-111 / WEB-GLOBAL-110 / WEB-GLOBAL-112, which now carries this defect together with the others of the same kind — one fix, one row.
- **Non-text control below 3:1 — Session Cookies always active** - The two 'always active' cookie switches are disabled checkboxes (<input type=checkbox disabled checked>, verified on the live page 18 Sep). WCAG 1.4.11 exempts inactive components.
- **Content in the design is not in the build — Hemant Kumar Srivastava** - A sample officer's name in the design's directory card — data the live page fills with the real officer, not interface copy.
