# MoSJE Website — dosje.gov.in - Design QC Report

**Generated:** 2026-09-18  · **Design:** [handoff frames](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-)  
**Status:** ready for review - a human still owes the keyboard and screen-reader pass.

**Also published as:** the PDF beside this file, the `MoSJE Website` sheet in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`.

---
## Summary

| | |
|---|---|
| Boards in the report | 145 |
| Findings | **261** - 15 Blocker, 225 Major, 20 Minor, 1 Nit |
| Applies to every screen | 75 |
| Specific to one screen | 186 |
| Withdrawn, not raised, or noted about the design file | 9 |

Every page in dosje.gov.in's sitemap (94 standalone pages), one sample of every record template (documents, events, gallery, officials, tenders, organisations, vacancies, schemes, scheme documents, suo-moto disclosures, CPIO, bookings, updates) and 25 global states were captured at 1440×900 and 375×812 — 266 captures in all — with the computed CSS, accessibility tree, axe-core results, focus behaviour, target sizes and DBIM element inventory of every element recorded. Findings are measured, never eyeballed: each carries the element's real box and its measured value. Captures the server refused (HTTP 429) were rejected and re-taken. The design side is the MoSJE [Handoff] Figma file: 175 design↔build pairs were compared by specification — type size, weight, family and colour on text matched between the two sides — never by pixel diff, and never on width, height or dynamic data. Where one design frame serves many pages (an organisation template against 172 organisation pages), only shared-template properties are compared, not its sample copy. A breach measured on three or more pages is published once, as a Global finding. Out of scope for this report: the screen-reader walkthrough, Hindi content quality, and the 34 live views for which no design frame exists — those are in the separate design report.

**Where to start.** The findings with the widest reach or the highest severity:

1. **aria-valid-attr-value** - `WEB-GLOBAL-001` · Blocker
2. **Single Access Mechanism for All Verticals o…** - `WEB-GLOBAL-007` · Blocker
3. **Pagination page numbers** - `WEB-GLOBAL-086` · Blocker
4. **Pagination previous / next arrows** - `WEB-GLOBAL-085` · Blocker
5. **Previous slide** - `WEB-GLOBAL-079` · Blocker

---

## Findings that apply to every screen

Each has its own board in the PDF, showing the design and the build side by side with the marker on the element in question.

### aria-valid-attr-value

`WEB-GLOBAL-001` · **Blocker** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | ARIA attributes must conform to valid values — <th class="sorting sorting_asc" tabindex="0" aria-controls="dataTable1" rowspan="1" colspan="1" aria-sort="ascending" aria-label="#: activate to sort column des (aria-valid-attr-value, wcag2a, wcag412). Measured on 15 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/about-the-division-social-defence/)

### Single Access Mechanism for All Verticals o…

`WEB-GLOBAL-007` · **Blocker** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Single Access Mechanism for All Verticals of Empowerment & Social Har…” (p.elementor-heading-title) renders #FFFFFF on #F97316 at 16px/400 — #FFFFFF on #F97316 as painted on the capture: 2.8:1 against the 4.5:1 minimum. Measured on 10 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/)

### Previous slide

`WEB-GLOBAL-079` · **Blocker** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.11): the visible part of a control — its icon, its outline, its indicator — needs 3:1 against what is behind it. |
| **Build does** | Text “Previous slide” (div.ccps-nav-btn) renders #EEEEEE on #FFFFFF at 16px/400 — #F0EFED on #FCF9EA as painted on the capture: 1.09:1 against the 3.0:1 minimum. |
| **Fix** | Darken the icon or its ground until the pair reaches 3:1. The control's accessible name is already correct; only what is drawn needs changing. |

[Live page](https://www.dosje.gov.in/)

### Pagination previous / next arrows

`WEB-GLOBAL-085` · **Blocker** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (2.4.7): every keyboard-focusable control shows a visible focus indicator. DBIM and UX4G both draw a 4px ring. |
| **Build does** | Pagination previous / next arrows: screenshotted focused and then blurred, no pixel changes, so a keyboard user cannot see where focus is. Measured on 9 pages. |
| **Fix** | Give the control a visible focus style — the estate's 4px ring — and make sure it is not removed by an `outline: none` elsewhere in the stylesheet. |

[Live page](https://www.dosje.gov.in/annual-reports/)

### Pagination page numbers

`WEB-GLOBAL-086` · **Blocker** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (2.4.7): every keyboard-focusable control shows a visible focus indicator. DBIM and UX4G both draw a 4px ring. |
| **Build does** | Pagination page numbers: screenshotted focused and then blurred, no pixel changes, so a keyboard user cannot see where focus is. Measured on 9 pages. |
| **Fix** | Give the control a visible focus style — the estate's 4px ring — and make sure it is not removed by an `outline: none` elsewhere in the stylesheet. |

[Live page](https://www.dosje.gov.in/annual-reports/)

### g8203_6a017643c9e5a_5jbzbySbWZr2OwiYXBianYQzkv1kI7tVXaWbwldA.jpg

`WEB-GLOBAL-009` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 A (1.1.1): every image carries an alt attribute — descriptive where it conveys meaning, empty where it is decorative. |
| **Build does** | “g8203_6a017643c9e5a_5jbzbySbWZr2OwiYXBianYQzkv1kI7tVXaWbwldA.jpg” renders at 411px wide with no alt attribute. A screen reader announces the file name instead of the content. Measured on 6 pages. |
| **Fix** | Add an alt attribute: a description where the image carries meaning, alt="" where it is decorative. |

[Live page](https://www.dosje.gov.in/gallery/)

### aria-command-name

`WEB-GLOBAL-010` · **Major** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | ARIA commands must have an accessible name — <a class="elementor-button elementor-size-sm" role="button" id="accessibilityButton"> (aria-command-name, wcag2a, wcag412). Measured on 146 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### link-name

`WEB-GLOBAL-011` · **Major** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Links must have discernible text — <a href="https://www.digitalindia.gov.in/" target="_blank">
							<img loading="lazy" width="105" height="41" src="https://www.dosje.gov.in/wp-content/uploads/ (link-name, wcag2a, wcag244, wcag412). Measured on 146 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### link-in-text-block

`WEB-GLOBAL-014` · **Major** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Links must be distinguishable without relying on color — <a href="https://www.dosje.gov.in/organisation/national-portal-for-transgender-persons/" target="_blank" rel="noopener">https://www.dosje.gov.in/organisation/na (link-in-text-block, wcag2a, wcag141). Measured on 3 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/about-the-division-social-defence/)

### frame-title

`WEB-GLOBAL-015` · **Major** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Frames must have an accessible name — <iframe width="100%" height="300" style="border:0;" loading="lazy" allowfullscreen="" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/ma (frame-title, wcag2a, wcag412). Measured on 19 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-6/)

### Get in Touch

`WEB-GLOBAL-016` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Get in Touch” (a.btn) renders #0373DF on #E5EFF9 at 14px/500 — #0373DF on #E5EFF9 as painted on the capture: 3.99:1 against the 4.5:1 minimum. Measured on 116 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Get in Touch

`WEB-GLOBAL-017` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Get in Touch” (a.btn) renders #0373DF on #E5EFF9 at 16px/500 — #0373DF on #E5EFF9 as painted on the capture: 3.99:1 against the 4.5:1 minimum. Measured on 126 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### About Ministry

`WEB-GLOBAL-019` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “About Ministry” (span.elementor-icon-list-text) renders #E2E6EA on #0373DF at 14px/400 — #E2E6EA on #0373DF as painted on the capture: 3.7:1 against the 4.5:1 minimum. Measured on 124 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Dr. Ambedkar Foundation Official

`WEB-GLOBAL-020` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Dr. Ambedkar Foundation Official” (h4.text-center) renders #0373DF on #F9FAFB at 20px/600 — #0373DF on #F9FAFB as painted on the capture: 4.44:1 against the 4.5:1 minimum. Measured on 14 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/daf-directory/)

### View All Documents from MoSJE

`WEB-GLOBAL-021` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “View All Documents from MoSJE” (a.btn) renders #0373DF on #F9FAFB at 14px/500 — #0373DF on #F9FAFB as painted on the capture: 4.44:1 against the 4.5:1 minimum. Measured on 13 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/documents/corrigendum-to-pm-daksh-scheme-guidelines/)

### Dr. Ambedkar International Centre (DAIC)

`WEB-GLOBAL-022` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Dr. Ambedkar International Centre (DAIC)” (a.text-primary) renders #0373DF on #F9FAFB at 16px/400 — #0373DF on #F9FAFB as painted on the capture: 4.44:1 against the 4.5:1 minimum. Measured on 4 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/official/dr-swati-s-mishra/)

### Dr. Swati S. Mishra

`WEB-GLOBAL-023` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Dr. Swati S. Mishra” (h1.h3) renders #0373DF on #F9FAFB at 22px/500 — #0373DF on #F9FAFB as painted on the capture: 4.44:1 against the 4.5:1 minimum. Measured on 3 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/official/dr-swati-s-mishra/)

### page title

`WEB-GLOBAL-024` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 A (1.3.1) and GIGW 3.0: one <h1> per page, naming the page. |
| **Build does** | The page renders no <h1>. The first visible heading is <h6> “Need Support?”. Measured on 42 pages. |
| **Fix** | Render exactly one <h1> carrying the page's own title, above the content. |

[Live page](https://www.dosje.gov.in/advertisement/)

### Need Support?

`WEB-GLOBAL-025` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 A (1.3.1): heading levels descend without skipping, so the outline can be navigated. |
| **Build does** | “Need Support?” is an <h6> directly after an <h1>, skipping h2. The outline cannot be navigated reliably by a screen reader. Measured on 138 pages. |
| **Fix** | Re-tag the heading so levels descend in order, or promote the heading above it. Where the markup is only for size, use CSS instead. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Open Department

`WEB-GLOBAL-026` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Open Department” is 14×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 14×21 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 144 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### About Ministry

`WEB-GLOBAL-027` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “About Ministry” is 151×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 151×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 110 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Ministers & Officials

`WEB-GLOBAL-028` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Ministers & Officials” is 151×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 151×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 94 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Organisational Chart

`WEB-GLOBAL-029` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Organisational Chart” is 151×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 151×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 106 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Vision & Mission

`WEB-GLOBAL-030` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Vision & Mission” is 151×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 151×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 108 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Associated Organisations

`WEB-GLOBAL-031` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Associated Organisations” is 172×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 172×21 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 144 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Home

`WEB-GLOBAL-032` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Home” is 41×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 41×21 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 144 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### Department

`WEB-GLOBAL-033` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Department” is 83×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 83×21 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 144 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### NCBC

`WEB-GLOBAL-034` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NCBC” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 3 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/acts-rules/)

### Transgender

`WEB-GLOBAL-035` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Transgender” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 4 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/acts-rules/)

### DAF

`WEB-GLOBAL-036` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “DAF” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 3 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/advertisement/)

### DAIC

`WEB-GLOBAL-037` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “DAIC” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 3 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/advertisement/)

### MoSJE

`WEB-GLOBAL-038` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “MoSJE” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 6 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/annual-reports/)

### NSFDC

`WEB-GLOBAL-039` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NSFDC” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 3 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/annual-reports/)

### NMBA

`WEB-GLOBAL-040` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NMBA” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 3 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/circulars-notifications/)

### NBCFDC

`WEB-GLOBAL-041` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NBCFDC” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 4 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/forms-templates/)

### NSKFDC

`WEB-GLOBAL-042` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NSKFDC” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 3 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/mou/)

### SCW

`WEB-GLOBAL-043` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “SCW” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 3 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/mou/)

### DAIC

`WEB-GLOBAL-044` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “DAIC” is 35×19px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 35×19 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 3 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/tender/investment-of-an-amount-of-rs-10-00-crore-in-fixed-reg-2/)

### footer

`WEB-GLOBAL-045` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | DBIM 3.0 §5.6: the footer carries Archives, Website Policy, Related Links and Feedback. |
| **Build does** | DBIM 5.6 mandates four footer sections. This footer publishes 0 of them; missing: Archives, Website Policy, Related Links, Feedback. Measured on 146 pages. |
| **Fix** | Add the missing sections to the footer. Archives and Website Policy need a page each; Related Links and Feedback can carry the existing ones. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### a

`WEB-GLOBAL-046` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | DBIM 3.0 §2.1: one colour group from the primary palette. UX4G's violet is its own brand layer, not the Department's. |
| **Build does** | 9 element(s) render UX4G's violet primary rather than the Department's key colour. DBIM 2.1 allows one colour group from the primary palette. Measured on 145 pages. |
| **Fix** | Override the inherited UX4G variables so the Department's key colour applies everywhere, including the skip link and the accessibility widget. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### last updated on

`WEB-GLOBAL-047` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “last updated on” · absent from the build |
| **Build does** | The design frame carries “last updated on” (12px). Nothing with that text renders on the live page. Measured on 9 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### of 1500 items

`WEB-GLOBAL-048` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “of 1500 items” · absent from the build |
| **Build does** | The design frame carries “of 1500 items” (12px). Nothing with that text renders on the live page. Measured on 4 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### search by title, keyword, or document number

`WEB-GLOBAL-049` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by title, keyword, or document nu” · absent from the build |
| **Build does** | The design frame carries “search by title, keyword, or document number” (16px). Nothing with that text renders on the live page. Measured on 3 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### sort by recently added

`WEB-GLOBAL-050` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “sort by recently added” · absent from the build |
| **Build does** | The design frame carries “sort by recently added” (14px). Nothing with that text renders on the live page. Measured on 3 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### empowering citizens with the right to information access gov

`WEB-GLOBAL-051` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “empowering citizens with the right to in” · absent from the build |
| **Build does** | The design frame carries “empowering citizens with the right to information access government data, decisi” (16px). Nothing with that text renders on the live page. Measured on 3 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14221)

### search by name, designation, or organization

`WEB-GLOBAL-052` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by name, designation, or organiza” · absent from the build |
| **Build does** | The design frame carries “search by name, designation, or organization” (16px). Nothing with that text renders on the live page. Measured on 3 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### target group

`WEB-GLOBAL-053` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “target group” · absent from the build |
| **Build does** | The design frame carries “target group” (14px). Nothing with that text renders on the live page. Measured on 3 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12250)

### login

`WEB-GLOBAL-054` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #FFFFFF · design #0373DF |
| **Build does** | “login” — colour #0373DF → #FFFFFF. Measured on 82 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### title

`WEB-GLOBAL-055` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #1F2937 · design #1F2428 |
| **Build does** | “title” — colour #1F2428 → #1F2937. Measured on 42 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### gov. of india

`WEB-GLOBAL-056` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 12px · design 14px · Built 400 weight · design 500 |
| **Build does** | “gov. of india” — size 14 → 12; weight 500 → 400. Measured on 72 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-109359)

### dr. virendra kumar

`WEB-GLOBAL-057` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #0373DF · design #1F2428 |
| **Build does** | “dr. virendra kumar” — colour #1F2428 → #0373DF. Measured on 5 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### name

`WEB-GLOBAL-058` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built 500 weight · design 400 · Built #1F2937 · design #1F2428 |
| **Build does** | “name” — size 12 → 14; weight 400 → 500; colour #1F2428 → #1F2937. Measured on 7 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### dr. virendra kumar

`WEB-GLOBAL-059` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #0373DF · design #1F2428 |
| **Build does** | “dr. virendra kumar” — weight 500 → 400; colour #1F2428 → #0373DF. Measured on 6 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### union minister of social justice and empowerment

`WEB-GLOBAL-060` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built #1F2937 · design #343A40 |
| **Build does** | “union minister of social justice and empowerment” — size 12 → 14; colour #343A40 → #1F2937. Measured on 3 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### mos3-msje[at]gov[dot]in

`WEB-GLOBAL-061` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built 400 weight · design 500 · Built #1F2937 · design #1F2428 |
| **Build does** | “mos3-msje[at]gov[dot]in” — size 12 → 14; weight 500 → 400; colour #1F2428 → #1F2937. Measured on 3 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### here's how the ministry empowers citizens like you

`WEB-GLOBAL-062` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 28px · design 22px · Built #1F2937 · design #1F2428 |
| **Build does** | “here's how the ministry empowers citizens like you” — size 22 → 28; colour #1F2428 → #1F2937. Measured on 4 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8477)

### 10px text

`WEB-GLOBAL-063` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 1 element(s) render at 10px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). It is also below Body/XS, the stated minimum usable size. Measured on 130 pages. |
| **Fix** | Move the size to the nearest step on the UX4G scale, and never below 12px. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### 8px text

`WEB-GLOBAL-064` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 2 element(s) render at 8px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). It is also below Body/XS, the stated minimum usable size. Measured on 117 pages. |
| **Fix** | Move the size to the nearest step on the UX4G scale, and never below 12px. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### 11px text

`WEB-GLOBAL-065` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 9 element(s) render at 11px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). It is also below Body/XS, the stated minimum usable size. Measured on 6 pages. |
| **Fix** | Move the size to the nearest step on the UX4G scale, and never below 12px. |

[Live page](https://www.dosje.gov.in/dashboard/)

### heading-order

`WEB-GLOBAL-066` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Heading levels should only increase by one — <h6 class="elementor-heading-title elementor-size-default">Need Support?</h6> (heading-order, ). Measured on 138 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### landmark-contentinfo-is-top-level

`WEB-GLOBAL-067` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Contentinfo landmark should not be contained in another landmark — <div class="mosje-visitor-counter mosje-visitor-counter-total" role="contentinfo" aria-label="Total site visits">
					<span class="mvc-item mvc-total">
			<spa (landmark-contentinfo-is-top-level, ). Measured on 145 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### landmark-no-duplicate-contentinfo

`WEB-GLOBAL-068` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Document should not have more than one contentinfo landmark — <footer data-elementor-type="footer" data-elementor-id="370" class="elementor elementor-370 elementor-location-footer" data-elementor-post-type="elementor_libra (landmark-no-duplicate-contentinfo, ). Measured on 144 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### html lang

`WEB-GLOBAL-069` · **Minor** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 and WCAG 3.1.1: the page declares its language; en-IN on a Government of India property. |
| **Build does** | The document declares lang="en-US" on a Government of India property; en-IN is the correct locale. Measured on 146 pages. |
| **Fix** | Set lang="en-IN" on <html>, and lang on any block in another language. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### console

`WEB-GLOBAL-070` · **Minor** · Functional · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 quality: a page loads without scripting errors. |
| **Build does** | The page logs 21 JavaScript errors on load. First: Loading the font 'https://fonts.gstatic.com/s/notosans/v42/o-0ZIpQlx3QUlC5A4PNr4C5OaxRsfNNlKbCePevttHOmHS91ixg0.woff2' violates the following Content Security Policy directive: "fo Measured on 146 pages. |
| **Fix** | Fix the scripting errors, starting with the first — later ones are often consequences. |

[Live page](https://www.dosje.gov.in/about-the-division/)

### meta description

`WEB-GLOBAL-071` · **Minor** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0: every page publishes a descriptive title and meta description. |
| **Build does** | The page publishes no meta description. Measured on 56 pages. |
| **Fix** | Publish a page-specific title and meta description. |

[Live page](https://www.dosje.gov.in/advertisement/)

### Icon-Container.svg

`WEB-GLOBAL-072` · **Minor** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | DBIM 3.0 §3.7: icons are drawn at 24, 32, 48 or 64px, in proportion. |
| **Build does** | 6 icon(s) render at sizes outside DBIM 3.7's set (24/32/48/64 px) — the first is Icon-Container.svg at 35×35px. Measured on 20 pages. |
| **Fix** | Redraw or re-export the icon at 24, 32, 48 or 64px, keeping its proportion. |

[Live page](https://www.dosje.gov.in/home-page/for-beneficiary/)

### choose a portal to visit

`WEB-GLOBAL-073` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 500 weight · design 600 |
| **Build does** | “choose a portal to visit” — weight 600 → 500. Measured on 3 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=7298-28616)

### Helvetica

`WEB-GLOBAL-074` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.2 and the Government standard: Noto Sans across the estate. |
| **Build does** | 3 element(s) render in Helvetica. Noto Sans is the mandated typeface across Government of India properties. Measured on 3 pages. |
| **Fix** | Set the element to Noto Sans. |

[Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-6/)

### 15px text

`WEB-GLOBAL-076` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 19 element(s) render at 15px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). Measured on 19 pages. |
| **Fix** | Move the size to the nearest step on the UX4G scale, and never below 12px. |

[Live page](https://www.dosje.gov.in/contact-us/)

### 22px text

`WEB-GLOBAL-077` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 5 element(s) render at 22px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). Measured on 19 pages. |
| **Fix** | Move the size to the nearest step on the UX4G scale, and never below 12px. |

[Live page](https://www.dosje.gov.in/)

### region

`WEB-GLOBAL-081` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | All page content should be contained by landmarks — <a class="skip-link screen-reader-text" href="#content">Skip to content</a> (region, ). Measured on 70 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/acts-rules/)

### skip-link

`WEB-GLOBAL-082` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | The skip-link target should exist and be focusable — <a class="skip-link screen-reader-text" href="#content">Skip to content</a> (skip-link, ). Measured on 7 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/advertisement/)

### landmark-unique

`WEB-GLOBAL-083` · **Minor** · Accessibility · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Landmarks should have a unique role or role/label/title (i.e. accessible name) combination — <nav class="e-n-menu" data-widget-number="240" aria-label="Menu" data-touch-mode="false" data-layout="horizontal"> (landmark-unique, ). Measured on 3 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/cpio/)

### Pagination page numbers

`WEB-GLOBAL-087` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (2.4.7): every keyboard-focusable control shows a visible focus indicator. DBIM and UX4G both draw a 4px ring. |
| **Build does** | Pagination page numbers: screenshotted focused and then blurred, only 1.3% of the region changes — the digit turns from grey to black, with no ring or fill, which is hard to find on a page. Measured on 8 pages. |
| **Fix** | Give the control a visible focus style — the estate's 4px ring — and make sure it is not removed by an `outline: none` elsewhere in the stylesheet. |

[Live page](https://www.dosje.gov.in/annual-reports/)

### Audience page standfirst

`WEB-GLOBAL-084` · **Nit** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | GIGW 3.0: page content is accurate, specific to the page, and in the Department's own register. |
| **Build does** | All four audience pages open with “Here's how the Ministry empowers citizens like you.” A reader who arrives on the page for their own group is told nothing specific to it. |
| **Fix** | Give each audience page a sentence about what that audience will find on it. |

[Live page](https://www.dosje.gov.in/home-page/for-student/)

---

## Findings specific to one screen

## About The Division Social Defence · mobile

### a

`WEB-SCREEN-012` · **Blocker** · Layout & Spacing · Scope: About The Division Social Defence · mobile

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.10): content reflows to 320 CSS px with no horizontal scrolling. |
| **Build does** | The page scrolls horizontally at 375px: content reaches 446px. WCAG 1.4.10 requires reflow without a horizontal scrollbar down to 320 CSS px. Measured on 2 pages. |
| **Fix** | Find the element wider than the viewport and let it wrap or scroll inside itself; the page itself must not scroll sideways. |

[Live page](https://www.dosje.gov.in/about-the-division-social-defence/)

## About Us · desktop

### aria-required-children

`WEB-SCREEN-001` · **Blocker** · Accessibility · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Certain ARIA roles must contain particular children — <div class="elementor-loop-container elementor-grid" role="list"> (aria-required-children, wcag2a, wcag131). Also measured on the 375px capture of the same page. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/about-us/)

### discover the initiatives that drive national efforts to adva

`WEB-SCREEN-061` · **Major** · Content & Iconography · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “discover the initiatives that drive nati” · absent from the build |
| **Build does** | The design frame carries “discover the initiatives that drive national efforts to advance equality, protec” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

### the department of social justice & empowerment is entrusted 

`WEB-SCREEN-072` · **Major** · Content & Iconography · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “the department of social justice & empow” · absent from the build |
| **Build does** | The design frame carries “the department of social justice & empowerment is entrusted with the empowerment” (16px). Nothing with that text renders on the live page. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

### the ministry has been implementing various programmes/scheme

`WEB-SCREEN-074` · **Major** · Content & Iconography · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “the ministry has been implementing vario” · absent from the build |
| **Build does** | The design frame carries “the ministry has been implementing various programmes/schemes for social, educat” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

### in the year 1985-86, the erstwhile ministry of welfare was b

`WEB-SCREEN-063` · **Major** · Content & Iconography · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “in the year 1985-86, the erstwhile minis” · absent from the build |
| **Build does** | The design frame carries “in the year 1985-86, the erstwhile ministry of welfare was bifurcated into the d” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

### in january, 2007, the minorities division along with wakf un

`WEB-SCREEN-062` · **Major** · Content & Iconography · Scope: About Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “in january, 2007, the minorities divisio” · absent from the build |
| **Build does** | The design frame carries “in january, 2007, the minorities division along with wakf unit have been moved o” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

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
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/contact-us/)

## Cookies · desktop

### Session Cookies always active

`WEB-SCREEN-285` · **Blocker** · Color & Token · Scope: Cookies · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.11): the visible part of a control — its icon, its outline, its indicator — needs 3:1 against what is behind it. |
| **Build does** | Text “Session Cookies always active” (input.form-check-input) renders #545454 on #0373DF at 16px/400 — #FFFFFF on #90BFEC as painted on the capture: 1.94:1 against the 3.0:1 minimum. Also measured on the 375px capture of the same page. |
| **Fix** | Darken the icon or its ground until the pair reaches 3:1. The control's accessible name is already correct; only what is drawn needs changing. |

[Live page](https://www.dosje.gov.in/cookies/)

### Ensures user session persistence, allowing …

`WEB-SCREEN-018` · **Major** · Color & Token · Scope: Cookies · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Ensures user session persistence, allowing seamless navigation on the…” (p.small) renders #938BB6 on #FFFFFF at 12px/400 — #938BB6 on #FFFFFF as painted on the capture: 3.18:1 against the 4.5:1 minimum. Also measured on the 375px capture of the same page. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/cookies/)

## Dashboard · mobile

### 29,015

`WEB-SCREEN-004` · **Blocker** · Color & Token · Scope: Dashboard · mobile

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “29,015” (div.mosje-hostel-num) renders #2BA84A on #FFFFFF at 20px/600 — #2BA84A on #FFFFFF as painted on the capture: 3.09:1 against the 4.5:1 minimum. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/dashboard/)

## Home · desktop

### Home hero banner (an unlabelled link)

`WEB-SCREEN-326` · **Blocker** · Components & States · Scope: Home · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (2.4.7): every keyboard-focusable control shows a visible focus indicator. DBIM and UX4G both draw a 4px ring. |
| **Build does** | Home hero banner (an unlabelled link): screenshotted focused and then blurred, no pixel changes, so a keyboard user cannot see where focus is. |
| **Fix** | Give the control a visible focus style — the estate's 4px ring — and make sure it is not removed by an `outline: none` elsewhere in the stylesheet. |

[Live page](https://www.dosje.gov.in/)

### empowering india, every day

`WEB-SCREEN-152` · **Major** · Content & Iconography · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “empowering india, every day” · absent from the build |
| **Build does** | The design frame carries “empowering india, every day” (56px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/)

### bringing social justice to every doorstep through digital ac

`WEB-SCREEN-150` · **Major** · Content & Iconography · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “bringing social justice to every doorste” · absent from the build |
| **Build does** | The design frame carries “bringing social justice to every doorstep through digital access” (22px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/)

### explore opportunities

`WEB-SCREEN-153` · **Major** · Content & Iconography · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “explore opportunities” · absent from the build |
| **Build does** | The design frame carries “explore opportunities” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/)

### view schemes

`WEB-SCREEN-169` · **Major** · Content & Iconography · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “view schemes” · absent from the build |
| **Build does** | The design frame carries “view schemes” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/)

### latest updates

`WEB-SCREEN-157` · **Major** · Content & Iconography · Scope: Home · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “latest updates” · absent from the build |
| **Build does** | The design frame carries “latest updates” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/)

## Minutes Of Screening Committees 2 · mobile

### table

`WEB-SCREEN-013` · **Blocker** · Layout & Spacing · Scope: Minutes Of Screening Committees 2 · mobile

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.10): content reflows to 320 CSS px with no horizontal scrolling. |
| **Build does** | The page scrolls horizontally at 375px: content reaches 582px. WCAG 1.4.10 requires reflow without a horizontal scrollbar down to 320 CSS px. Measured on 2 pages. |
| **Fix** | Find the element wider than the viewport and let it wrap or scroll inside itself; the page itself must not scroll sideways. |

[Live page](https://www.dosje.gov.in/minutes-of-screening-committees-2/)

## Scheme Documents  Dr Ambedkar National Merit Award Scheme  · desktop

### Scheme: Dr. Ambedkar National Merit Award S…

`WEB-SCREEN-009` · **Blocker** · Color & Token · Scope: Scheme Documents  Dr Ambedkar National Merit Award Scheme  · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Scheme: Dr. Ambedkar National Merit Award Scheme for meritorious stud…” (p.mb-0) renders #938BB6 on #F9FAFB at 16px/400 — #938BB6 on #F9FAFB as painted on the capture: 3.04:1 against the 4.5:1 minimum. Measured on 2 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/scheme-documents/dr-ambedkar-national-merit-award-scheme-for-scs-students-for-class-12th-level/)

## Scheme Documents  Merger Order · desktop

### Scheme: Dr. Ambedkar Scheme for Social Inte…

`WEB-SCREEN-010` · **Blocker** · Color & Token · Scope: Scheme Documents  Merger Order · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Scheme: Dr. Ambedkar Scheme for Social Integration through Inter-Cast…” (p.mb-0) renders #938BB6 on #F9FAFB at 16px/400 — #938BB6 on #F9FAFB as painted on the capture: 3.04:1 against the 4.5:1 minimum. Measured on 2 pages. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/scheme-documents/merger-order/)

## About Us · mobile

### scrollable-region-focusable

`WEB-SCREEN-014` · **Major** · Accessibility · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Scrollable region must have keyboard access — <div class="table-responsive w-100"> (scrollable-region-focusable, wcag2a, wcag211, wcag213). Measured on 2 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/about-us/)

### mrs. caralyn khongwar deshmukh, as

`WEB-SCREEN-065` · **Major** · Content & Iconography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “mrs. caralyn khongwar deshmukh, as” · absent from the build |
| **Build does** | The design frame carries “mrs. caralyn khongwar deshmukh, as” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

### matters related to the national scheduled castes finance and

`WEB-SCREEN-064` · **Major** · Content & Iconography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “matters related to the national schedule” · absent from the build |
| **Build does** | The design frame carries “matters related to the national scheduled castes finance and development corpora” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

### shri biswaranjan sasmal, as

`WEB-SCREEN-070` · **Major** · Content & Iconography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “shri biswaranjan sasmal, as” · absent from the build |
| **Build does** | The design frame carries “shri biswaranjan sasmal, as” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

### mrs. yogita swaroop, sr. ea

`WEB-SCREEN-066` · **Major** · Content & Iconography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “mrs. yogita swaroop, sr. ea” · absent from the build |
| **Build does** | The design frame carries “mrs. yogita swaroop, sr. ea” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

### ms. latha ganapathy, js

`WEB-SCREEN-067` · **Major** · Content & Iconography · Scope: About Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “ms. latha ganapathy, js” · absent from the build |
| **Build does** | The design frame carries “ms. latha ganapathy, js” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/about-us/)

## Acts Rules · mobile

### NHAA

`WEB-SCREEN-025` · **Major** · Layout & Spacing · Scope: Acts Rules · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NHAA” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/acts-rules/)

## Annual Reports · desktop

### access official reports released by the commission and its a

`WEB-SCREEN-079` · **Major** · Content & Iconography · Scope: Annual Reports · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “access official reports released by the ” · absent from the build |
| **Build does** | The design frame carries “access official reports released by the commission and its associated organisati” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

### download all reports

`WEB-SCREEN-080` · **Major** · Content & Iconography · Scope: Annual Reports · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “download all reports” · absent from the build |
| **Build does** | The design frame carries “download all reports” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12795)

## Annual Reports · mobile

### NISD

`WEB-SCREEN-027` · **Major** · Layout & Spacing · Scope: Annual Reports · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NISD” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/annual-reports/)

### BJRNF

`WEB-SCREEN-026` · **Major** · Layout & Spacing · Scope: Annual Reports · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “BJRNF” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/annual-reports/)

## Booking  Conference 3 · desktop

### government

`WEB-SCREEN-254` · **Major** · Typography · Scope: Booking  Conference 3 · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #212121 · design #1F2428 |
| **Build does** | “government” — weight 500 → 400; colour #1F2428 → #212121. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4743-129775)

## Booking  Vaishali · desktop

### government

`WEB-SCREEN-255` · **Major** · Typography · Scope: Booking  Vaishali · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #212121 · design #1F2428 |
| **Build does** | “government” — weight 500 → 400; colour #1F2428 → #212121. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4743-129775)

## Circulars Notifications · mobile

### PMAJAY

`WEB-SCREEN-028` · **Major** · Layout & Spacing · Scope: Circulars Notifications · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “PMAJAY” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/circulars-notifications/)

### Smile Beggary

`WEB-SCREEN-029` · **Major** · Layout & Spacing · Scope: Circulars Notifications · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Smile Beggary” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/circulars-notifications/)

## Contact Person · mobile

### scrollable-region-focusable

`WEB-SCREEN-015` · **Major** · Accessibility · Scope: Contact Person · mobile

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Scrollable region must have keyboard access — <div class="table-responsive w-100"> (scrollable-region-focusable, wcag2a, wcag211, wcag213). Measured on 2 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/contact-person/)

## Contact Us · desktop

### contact details

`WEB-SCREEN-083` · **Major** · Content & Iconography · Scope: Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “contact details” · absent from the build |
| **Build does** | The design frame carries “contact details” (40px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14626)

### connect directly with the ministry, reach the concerned depa

`WEB-SCREEN-082` · **Major** · Content & Iconography · Scope: Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “connect directly with the ministry, reac” · absent from the build |
| **Build does** | The design frame carries “connect directly with the ministry, reach the concerned department, office, or o” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14626)

### ministry of social justice and empowerment (mosje) contact d

`WEB-SCREEN-087` · **Major** · Content & Iconography · Scope: Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “ministry of social justice and empowerme” · absent from the build |
| **Build does** | The design frame carries “ministry of social justice and empowerment (mosje) contact details” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14626)

### room no. 631, a-wing, shastri bhawan, new delhi - 110001

`WEB-SCREEN-090` · **Major** · Content & Iconography · Scope: Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “room no. 631, a-wing, shastri bhawan, ne” · absent from the build |
| **Build does** | The design frame carries “room no. 631, a-wing, shastri bhawan, new delhi - 110001” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14626)

### complaint[at]ncsc[dot]gov[dot]in

`WEB-SCREEN-081` · **Major** · Content & Iconography · Scope: Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “complaint[at]ncsc[dot]gov[dot]in” · absent from the build |
| **Build does** | The design frame carries “complaint[at]ncsc[dot]gov[dot]in” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14626)

### national commission for safai karamchari (ncsk)

`WEB-SCREEN-088` · **Major** · Content & Iconography · Scope: Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “national commission for safai karamchari” · absent from the build |
| **Build does** | The design frame carries “national commission for safai karamchari (ncsk)” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14626)

## Cpio · desktop

### the designated authority responsible for providing timely an

`WEB-SCREEN-104` · **Major** · Content & Iconography · Scope: Cpio · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “the designated authority responsible for” · absent from the build |
| **Build does** | The design frame carries “the designated authority responsible for providing timely and transparent inform” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14262)

### sort by recently updated

`WEB-SCREEN-103` · **Major** · Content & Iconography · Scope: Cpio · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “sort by recently updated” · absent from the build |
| **Build does** | The design frame carries “sort by recently updated” (14px). Nothing with that text renders on the live page. Measured on 2 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14262)

### designantion

`WEB-SCREEN-091` · **Major** · Content & Iconography · Scope: Cpio · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “designantion” · absent from the build |
| **Build does** | The design frame carries “designantion” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14262)

### shri gulshan kumar pahadia, ad

`WEB-SCREEN-099` · **Major** · Content & Iconography · Scope: Cpio · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “shri gulshan kumar pahadia, ad” · absent from the build |
| **Build does** | The design frame carries “shri gulshan kumar pahadia, ad” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14262)

### ms. sanmeet kaur, dig(p)

`WEB-SCREEN-097` · **Major** · Content & Iconography · Scope: Cpio · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “ms. sanmeet kaur, dig(p)” · absent from the build |
| **Build does** | The design frame carries “ms. sanmeet kaur, dig(p)” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14262)

### sanmeet[dot]kaur[at]ips[dot]gov[dot]in

`WEB-SCREEN-098` · **Major** · Content & Iconography · Scope: Cpio · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “sanmeet[dot]kaur[at]ips[dot]gov[dot]in” · absent from the build |
| **Build does** | The design frame carries “sanmeet[dot]kaur[at]ips[dot]gov[dot]in” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14262)

## Cpio · mobile

### gk[dot]pahadia[at]gov[dot]in

`WEB-SCREEN-093` · **Major** · Content & Iconography · Scope: Cpio · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “gk[dot]pahadia[at]gov[dot]in” · absent from the build |
| **Build does** | The design frame carries “gk[dot]pahadia[at]gov[dot]in” (12px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4626-80865)

### list of cpios/aas

`WEB-SCREEN-257` · **Major** · Typography · Scope: Cpio · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 22px · design 20px · Built #1F2937 · design #014B92 |
| **Build does** | “list of cpios/aas” — size 20 → 22; colour #014B92 → #1F2937. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4626-80865)

## Dashboard · desktop

### Pre-Matric (SCs & Others)

`WEB-SCREEN-019` · **Major** · Color & Token · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Pre-Matric (SCs & Others)” (span.mosje-cat-metric-label) renders #6B6F78 on #EAF2FB at 12px/500 — #6B6F78 on #EAF2FB as painted on the capture: 4.46:1 against the 4.5:1 minimum. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/dashboard/)

### total sc/st beneficiary count

`WEB-SCREEN-117` · **Major** · Content & Iconography · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “total sc/st beneficiary count” · absent from the build |
| **Build does** | The design frame carries “total sc/st beneficiary count” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/dashboard/)

### sc/st coverage rate

`WEB-SCREEN-109` · **Major** · Content & Iconography · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “sc/st coverage rate” · absent from the build |
| **Build does** | The design frame carries “sc/st coverage rate” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/dashboard/)

### dapsc budget utilization rate

`WEB-SCREEN-107` · **Major** · Content & Iconography · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “dapsc budget utilization rate” · absent from the build |
| **Build does** | The design frame carries “dapsc budget utilization rate” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/dashboard/)

### sc/st women beneficiary percentage

`WEB-SCREEN-112` · **Major** · Content & Iconography · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “sc/st women beneficiary percentage” · absent from the build |
| **Build does** | The design frame carries “sc/st women beneficiary percentage” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/dashboard/)

### sc/st scholarship beneficiaries

`WEB-SCREEN-111` · **Major** · Content & Iconography · Scope: Dashboard · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “sc/st scholarship beneficiaries” · absent from the build |
| **Build does** | The design frame carries “sc/st scholarship beneficiaries” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/dashboard/)

## Events  Ek Ped Maa Ke Naam 6 · desktop

### Declared

`WEB-SCREEN-020` · **Major** · Color & Token · Scope: Events  Ek Ped Maa Ke Naam 6 · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Declared” (span.badge) renders #FFFFFF on #3C9718 at 12px/500 — #FFFFFF on #3C9718 as painted on the capture: 3.73:1 against the 4.5:1 minimum. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-6/)

### description

`WEB-SCREEN-260` · **Major** · Typography · Scope: Events  Ek Ped Maa Ke Naam 6 · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 20px · design 28px · Built #0373DF · design #014B92 |
| **Build does** | “description” — size 28 → 20; colour #014B92 → #0373DF. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-6/)

## Events  Ek Ped Maa Ke Naam 6 · mobile

### description

`WEB-SCREEN-258` · **Major** · Color & Token · Scope: Events  Ek Ped Maa Ke Naam 6 · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #0373DF · design #014B92 |
| **Build does** | “description” — colour #014B92 → #0373DF. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-115254)

### email

`WEB-SCREEN-259` · **Major** · Typography · Scope: Events  Ek Ped Maa Ke Naam 6 · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 12px · design 14px · Built #343A40 · design #1F2937 |
| **Build does** | “email” — size 14 → 12; colour #1F2937 → #343A40. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-115254)

## Events  Ek Ped Maa Ke Naam 7 · desktop

### Declared

`WEB-SCREEN-021` · **Major** · Color & Token · Scope: Events  Ek Ped Maa Ke Naam 7 · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Declared” (span.badge) renders #FFFFFF on #3C9718 at 12px/500 — #FFFFFF on #3C9718 as painted on the capture: 3.73:1 against the 4.5:1 minimum. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-7/)

### description

`WEB-SCREEN-263` · **Major** · Typography · Scope: Events  Ek Ped Maa Ke Naam 7 · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 20px · design 28px · Built #0373DF · design #014B92 |
| **Build does** | “description” — size 28 → 20; colour #014B92 → #0373DF. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Live page](https://www.dosje.gov.in/events/ek-ped-maa-ke-naam-7/)

## Events  Ek Ped Maa Ke Naam 7 · mobile

### description

`WEB-SCREEN-261` · **Major** · Color & Token · Scope: Events  Ek Ped Maa Ke Naam 7 · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #0373DF · design #014B92 |
| **Build does** | “description” — colour #014B92 → #0373DF. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-115254)

### email

`WEB-SCREEN-262` · **Major** · Typography · Scope: Events  Ek Ped Maa Ke Naam 7 · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 12px · design 14px · Built #343A40 · design #1F2937 |
| **Build does** | “email” — size 14 → 12; colour #1F2937 → #343A40. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-115254)

## Events · desktop

### discover initiatives, workshops, and awareness programs that

`WEB-SCREEN-122` · **Major** · Content & Iconography · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “discover initiatives, workshops, and awa” · absent from the build |
| **Build does** | The design frame carries “discover initiatives, workshops, and awareness programs that highlight the minis” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

### view all

`WEB-SCREEN-132` · **Major** · Content & Iconography · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “view all” · absent from the build |
| **Build does** | The design frame carries “view all” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

### hard to reach population-smile (beggary)

`WEB-SCREEN-124` · **Major** · Content & Iconography · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “hard to reach population-smile (beggary)” · absent from the build |
| **Build does** | The design frame carries “hard to reach population-smile (beggary)” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

### nov 10th, 2025 • 05:00 pm onwards

`WEB-SCREEN-126` · **Major** · Content & Iconography · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “nov 10th, 2025 • 05:00 pm onwards” · absent from the build |
| **Build does** | The design frame carries “nov 10th, 2025 • 05:00 pm onwards” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

### dr. ambedkar international centre

`WEB-SCREEN-123` · **Major** · Content & Iconography · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “dr. ambedkar international centre” · absent from the build |
| **Build does** | The design frame carries “dr. ambedkar international centre” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

### "chandalika" - musical dance drama

`WEB-SCREEN-120` · **Major** · Content & Iconography · Scope: Events · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “"chandalika" - musical dance drama” · absent from the build |
| **Build does** | The design frame carries “"chandalika" - musical dance drama” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13841)

## Events · mobile

### painting exhibition and yamuna sustaibablity run

`WEB-SCREEN-130` · **Major** · Content & Iconography · Scope: Events · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “painting exhibition and yamuna sustaibab” · absent from the build |
| **Build does** | The design frame carries “painting exhibition and yamuna sustaibablity run” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-114418)

## For Researchers · desktop

### discover all welfare initiatives, social justice schemes, an

`WEB-SCREEN-134` · **Major** · Content & Iconography · Scope: For Researchers · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “discover all welfare initiatives, social” · absent from the build |
| **Build does** | The design frame carries “discover all welfare initiatives, social justice schemes, and citizen services o” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8477)

### browse the key legislations, policy frameworks, and governme

`WEB-SCREEN-133` · **Major** · Content & Iconography · Scope: For Researchers · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “browse the key legislations, policy fram” · absent from the build |
| **Build does** | The design frame carries “browse the key legislations, policy frameworks, and government guidelines that p” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8477)

## Forms Templates · mobile

### PMAJAY

`WEB-SCREEN-031` · **Major** · Layout & Spacing · Scope: Forms Templates · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “PMAJAY” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/forms-templates/)

### NOS

`WEB-SCREEN-030` · **Major** · Layout & Spacing · Scope: Forms Templates · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NOS” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/forms-templates/)

### access official reports released by the commission and its a

`WEB-SCREEN-280` · **Minor** · Typography · Scope: Forms Templates · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 14px |
| **Build does** | “access official reports released by the commission and its associated ” — size 14 → 16. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Live page](https://www.dosje.gov.in/forms-templates/)

## Gallery · desktop

### explore photos, videos and news from the ministry of social 

`WEB-SCREEN-139` · **Major** · Content & Iconography · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “explore photos, videos and news from the” · absent from the build |
| **Build does** | The design frame carries “explore photos, videos and news from the ministry of social justice & empowermen” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

### search by keyword or event

`WEB-SCREEN-145` · **Major** · Content & Iconography · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by keyword or event” · absent from the build |
| **Build does** | The design frame carries “search by keyword or event” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

### ambedkar jayanti celebration 2025

`WEB-SCREEN-135` · **Major** · Content & Iconography · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “ambedkar jayanti celebration 2025” · absent from the build |
| **Build does** | The design frame carries “ambedkar jayanti celebration 2025” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

### glimpses from the national celebration

`WEB-SCREEN-140` · **Major** · Content & Iconography · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “glimpses from the national celebration” · absent from the build |
| **Build does** | The design frame carries “glimpses from the national celebration” (12px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

### elder care workshop

`WEB-SCREEN-138` · **Major** · Content & Iconography · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “elder care workshop” · absent from the build |
| **Build does** | The design frame carries “elder care workshop” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

### training for caregivers and elder care professionals

`WEB-SCREEN-147` · **Major** · Content & Iconography · Scope: Gallery · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “training for caregivers and elder care p” · absent from the build |
| **Build does** | The design frame carries “training for caregivers and elder care professionals” (12px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-13281)

## Gallery · mobile

### “Ek Ped Maa Ke Naam”

`WEB-SCREEN-032` · **Major** · Layout & Spacing · Scope: Gallery · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | ““Ek Ped Maa Ke Naam”” is 177×22px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 177×22 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/gallery/)

### scholars present research on ambedkar studies

`WEB-SCREEN-144` · **Major** · Content & Iconography · Scope: Gallery · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “scholars present research on ambedkar st” · absent from the build |
| **Build does** | The design frame carries “scholars present research on ambedkar studies” (12px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/gallery/)

## Home · mobile

### Go to slide 1

`WEB-SCREEN-317` · **Major** · Layout & Spacing · Scope: Home · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Go to slide 1” is 40×12px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 40×12 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

### Go to slide 2

`WEB-SCREEN-316` · **Major** · Layout & Spacing · Scope: Home · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Go to slide 2” is 12×12px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 12×12 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

### Go to slide 3

`WEB-SCREEN-034` · **Major** · Layout & Spacing · Scope: Home · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Go to slide 3” is 12×12px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 12×12 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

### Go to slide 4

`WEB-SCREEN-035` · **Major** · Layout & Spacing · Scope: Home · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Go to slide 4” is 12×12px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 12×12 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

### smile - support for marginalised individuals for livelihood 

`WEB-SCREEN-163` · **Major** · Content & Iconography · Scope: Home · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “smile - support for marginalised individ” · absent from the build |
| **Build does** | The design frame carries “smile - support for marginalised individuals for livelihood & enterprise” (16px). Nothing with that text renders on the live page. Measured on 2 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/)

### integrated rehabilitation, skills training and livelihood su

`WEB-SCREEN-156` · **Major** · Content & Iconography · Scope: Home · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “integrated rehabilitation, skills traini” · absent from the build |
| **Build does** | The design frame carries “integrated rehabilitation, skills training and livelihood support for marginalis” (14px). Nothing with that text renders on the live page. Measured on 2 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/)

## Lok Sabha Question Answer · mobile

### NCSK

`WEB-SCREEN-037` · **Major** · Layout & Spacing · Scope: Lok Sabha Question Answer · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NCSK” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/lok-sabha-question-answer/)

## Mosje Directory · desktop

### discover the commissions, corporations, institutes and found

`WEB-SCREEN-179` · **Major** · Content & Iconography · Scope: Mosje Directory · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “discover the commissions, corporations, ” · absent from the build |
| **Build does** | The design frame carries “discover the commissions, corporations, institutes and foundations that work col” (16px). Nothing with that text renders on the live page. Measured on 2 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### reset filters

`WEB-SCREEN-189` · **Major** · Content & Iconography · Scope: Mosje Directory · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “reset filters” · absent from the build |
| **Build does** | The design frame carries “reset filters” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### organization

`WEB-SCREEN-187` · **Major** · Content & Iconography · Scope: Mosje Directory · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “organization” · absent from the build |
| **Build does** | The design frame carries “organization” (12px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### ashutosh niranjan

`WEB-SCREEN-172` · **Major** · Content & Iconography · Scope: Mosje Directory · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “ashutosh niranjan” · absent from the build |
| **Build does** | The design frame carries “ashutosh niranjan” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### ms. priya sharma

`WEB-SCREEN-186` · **Major** · Content & Iconography · Scope: Mosje Directory · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “ms. priya sharma” · absent from the build |
| **Build does** | The design frame carries “ms. priya sharma” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

### private secretary to the minister

`WEB-SCREEN-188` · **Major** · Content & Iconography · Scope: Mosje Directory · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “private secretary to the minister” · absent from the build |
| **Build does** | The design frame carries “private secretary to the minister” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9324)

## Mosje Directory · mobile

### browse our directory for key contact information of commissi

`WEB-SCREEN-175` · **Major** · Content & Iconography · Scope: Mosje Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “browse our directory for key contact inf” · absent from the build |
| **Build does** | The design frame carries “browse our directory for key contact information of commissions, corporations, i” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### download directory

`WEB-SCREEN-180` · **Major** · Content & Iconography · Scope: Mosje Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “download directory” · absent from the build |
| **Build does** | The design frame carries “download directory” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### telephone(res./mobile)

`WEB-SCREEN-190` · **Major** · Content & Iconography · Scope: Mosje Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “telephone(res./mobile)” · absent from the build |
| **Build does** | The design frame carries “telephone(res./mobile)” (12px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### ashutosh niranjan, ias

`WEB-SCREEN-173` · **Major** · Content & Iconography · Scope: Mosje Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “ashutosh niranjan, ias” · absent from the build |
| **Build does** | The design frame carries “ashutosh niranjan, ias” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### devansh wathrey

`WEB-SCREEN-177` · **Major** · Content & Iconography · Scope: Mosje Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “devansh wathrey” · absent from the build |
| **Build does** | The design frame carries “devansh wathrey” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

### tripathi[dot]yogesh[at]nic[dot]in

`WEB-SCREEN-191` · **Major** · Content & Iconography · Scope: Mosje Directory · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “tripathi[dot]yogesh[at]nic[dot]in” · absent from the build |
| **Build does** | The design frame carries “tripathi[dot]yogesh[at]nic[dot]in” (12px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-89516)

## Notices · mobile

### BJRNF

`WEB-SCREEN-038` · **Major** · Layout & Spacing · Scope: Notices · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “BJRNF” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/notices/)

### E-Anudaan

`WEB-SCREEN-039` · **Major** · Layout & Spacing · Scope: Notices · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “E-Anudaan” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/notices/)

## Official  Dr Swati S Mishra · desktop

### address

`WEB-SCREEN-265` · **Major** · Typography · Scope: Official  Dr Swati S Mishra · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 12px · Built 700 weight · design 400 · Built #1F2937 · design #1F2428 |
| **Build does** | “address” — size 12 → 16; weight 400 → 700; colour #1F2428 → #1F2937. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9455)

## Official  Shri Shailendra Kumar · desktop

### address

`WEB-SCREEN-266` · **Major** · Typography · Scope: Official  Shri Shailendra Kumar · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 12px · Built 700 weight · design 400 · Built #1F2937 · design #1F2428 |
| **Build does** | “address” — size 12 → 16; weight 400 → 700; colour #1F2428 → #1F2937. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-9455)

## Organisation  Contact Us · desktop

### indira gandhi international airport

`WEB-SCREEN-267` · **Major** · Color & Token · Scope: Organisation  Contact Us · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #5E5E5E · design #343A40 |
| **Build does** | “indira gandhi international airport” — colour #343A40 → #5E5E5E. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14723)

## Organisation  Contact Us · mobile

### nearest airport

`WEB-SCREEN-269` · **Major** · Typography · Scope: Organisation  Contact Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 14px · Built #1F2937 · design #1F2428 |
| **Build does** | “nearest airport” — size 14 → 16; colour #1F2428 → #1F2937. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4626-81838)

### indira gandhi international airport

`WEB-SCREEN-268` · **Major** · Typography · Scope: Organisation  Contact Us · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built #5E5E5E · design #343A40 |
| **Build does** | “indira gandhi international airport” — size 12 → 14; colour #343A40 → #5E5E5E. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4626-81838)

## Policies · desktop

### 1. information collection we do not automatically gather any

`WEB-SCREEN-192` · **Major** · Content & Iconography · Scope: Policies · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “1. information collection we do not auto” · absent from the build |
| **Build does** | The design frame carries “1. information collection we do not automatically gather any personally identifi” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=5243-126087)

## Resources · mobile

### DWBDNC

`WEB-SCREEN-043` · **Major** · Layout & Spacing · Scope: Resources · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “DWBDNC” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/resources/)

## Rti · desktop

### suo-moto disclosure

`WEB-SCREEN-194` · **Major** · Content & Iconography · Scope: Rti · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “suo-moto disclosure” · absent from the build |
| **Build does** | The design frame carries “suo-moto disclosure” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14221)

### right to information act 2005

`WEB-SCREEN-193` · **Major** · Content & Iconography · Scope: Rti · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “right to information act 2005” · absent from the build |
| **Build does** | The design frame carries “right to information act 2005” (28px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14221)

### the national commission for scheduled castes (ncsc) is a con

`WEB-SCREEN-195` · **Major** · Content & Iconography · Scope: Rti · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “the national commission for scheduled ca” · absent from the build |
| **Build does** | The design frame carries “the national commission for scheduled castes (ncsc) is a constitutional body est” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14221)

## Samavesh Admin Portals · desktop

### smile - transgender

`WEB-SCREEN-270` · **Major** · Typography · Scope: Samavesh Admin Portals · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 700 weight · design 500 · Built #FF671F · design #1F2428 |
| **Build does** | “smile - transgender” — weight 500 → 700; colour #1F2428 → #FF671F. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=7298-28616)

## Samavesh Citizen Portals · desktop

### smile - transgender

`WEB-SCREEN-271` · **Major** · Typography · Scope: Samavesh Citizen Portals · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 700 weight · design 500 · Built #FF671F · design #1F2428 |
| **Build does** | “smile - transgender” — weight 500 → 700; colour #1F2428 → #FF671F. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=7116-34665)

## Schemes And Services  Geriatric Caregivers Training · mobile

### Senior Citizens Welfare(SCW)

`WEB-SCREEN-044` · **Major** · Layout & Spacing · Scope: Schemes And Services  Geriatric Caregivers Training · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Senior Citizens Welfare(SCW)” is 203×19px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 203×19 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/schemes-and-services/geriatric-caregivers-training/)

### about the scheme

`WEB-SCREEN-272` · **Major** · Typography · Scope: Schemes And Services  Geriatric Caregivers Training · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 28px · design 20px · Built 500 weight · design 600 |
| **Build does** | “about the scheme” — size 20 → 28; weight 600 → 500. |
| **Fix** | Set the built value to the design's. |

[Live page](https://www.dosje.gov.in/schemes-and-services/geriatric-caregivers-training/)

## Schemes And Services  Top Class Education In Colllege For Obc  · desktop

### active

`WEB-SCREEN-275` · **Major** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #FFFFFF · design #1F2937 |
| **Build does** | “active” — weight 500 → 400; colour #1F2937 → #FFFFFF. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-11885)

### scheme

`WEB-SCREEN-281` · **Minor** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 |
| **Build does** | “scheme” — weight 500 → 400. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-11885)

## Schemes And Services  Top Class Education In Colllege For Obc  · mobile

### active

`WEB-SCREEN-274` · **Major** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #FFFFFF · design #1F2428 |
| **Build does** | “active” — weight 500 → 400; colour #1F2428 → #FFFFFF. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105399)

### archived

`WEB-SCREEN-276` · **Major** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 400 weight · design 500 · Built #374151 · design #343A40 |
| **Build does** | “archived” — weight 500 → 400; colour #343A40 → #374151. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105399)

### start publish date

`WEB-SCREEN-273` · **Major** · Typography · Scope: Schemes And Services  Top Class Education In Colllege For Obc  · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 12px · Built 500 weight · design 400 · Built #1F2937 · design #343A40 |
| **Build does** | “start publish date” — size 12 → 14; weight 400 → 500; colour #343A40 → #1F2937. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105399)

## Schemes Services · desktop

### schemes and services

`WEB-SCREEN-204` · **Major** · Content & Iconography · Scope: Schemes Services · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “schemes and services” · absent from the build |
| **Build does** | The design frame carries “schemes and services” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12250)

### explore welfare schemes, social empowerment programs, and ci

`WEB-SCREEN-199` · **Major** · Content & Iconography · Scope: Schemes Services · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “explore welfare schemes, social empowerm” · absent from the build |
| **Build does** | The design frame carries “explore welfare schemes, social empowerment programs, and citizen services offer” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12250)

### search by scheme name or keyword

`WEB-SCREEN-205` · **Major** · Content & Iconography · Scope: Schemes Services · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by scheme name or keyword” · absent from the build |
| **Build does** | The design frame carries “search by scheme name or keyword” (16px). Nothing with that text renders on the live page. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12250)

### smile - support for marginalised individuals for livelihood 

`WEB-SCREEN-207` · **Major** · Content & Iconography · Scope: Schemes Services · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “smile - support for marginalised individ” · absent from the build |
| **Build does** | The design frame carries “smile - support for marginalised individuals for livelihood & enterprise” (16px). Nothing with that text renders on the live page. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12250)

### integrated rehabilitation, skills training and livelihood su

`WEB-SCREEN-200` · **Major** · Content & Iconography · Scope: Schemes Services · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “integrated rehabilitation, skills traini” · absent from the build |
| **Build does** | The design frame carries “integrated rehabilitation, skills training and livelihood support for marginalis” (14px). Nothing with that text renders on the live page. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12250)

### scheme for economic empowerment of dnts (seed)

`WEB-SCREEN-203` · **Major** · Content & Iconography · Scope: Schemes Services · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “scheme for economic empowerment of dnts ” · absent from the build |
| **Build does** | The design frame carries “scheme for economic empowerment of dnts (seed)” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12250)

## Schemes Services · mobile

### venture capital fund for scs & obcs

`WEB-SCREEN-209` · **Major** · Content & Iconography · Scope: Schemes Services · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “venture capital fund for scs & obcs” · absent from the build |
| **Build does** | The design frame carries “venture capital fund for scs & obcs” (16px). Nothing with that text renders on the live page. Measured on 2 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105022)

## Sitemap · desktop

### dashboard

`WEB-SCREEN-277` · **Major** · Typography · Scope: Sitemap · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 14px · design 16px · Built #0373DF · design #014B92 |
| **Build does** | “dashboard” — size 16 → 14; colour #014B92 → #0373DF. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=5243-134590)

## State · Accessibility Panel Open · desktop

### nested-interactive

`WEB-SCREEN-286` · **Major** · Accessibility · Scope: State · Accessibility Panel Open · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Interactive controls must not be nested — <button aria-label="Light Dark Theme" aria-pressed="false" tabindex="9" id="dark-btn" class="uwaw-features__item__i"> (nested-interactive, wcag2a, wcag412). |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/)

### tabindex

`WEB-SCREEN-287` · **Major** · Accessibility · Scope: State · Accessibility Panel Open · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | Elements should not have tabindex greater than zero — <button type="button" aria-label="Close main navigation panel" class="uwaw-close" tabindex="1"></button> (tabindex, ). |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/)

### 13px text

`WEB-SCREEN-291` · **Minor** · Typography · Scope: State · Accessibility Panel Open · desktop

| | |
|---|---|
| **Design says** | UX4G 3.0 §2.3: font sizes come from the published type scale (12/14/16/18/20/24/28/32/36/40/52/60), and Body/XS 12px is the minimum. |
| **Build does** | 14 element(s) render at 13px, which is not on the UX4G type scale (12/14/16/18/20/24/28/32/36/40/52/60). Measured on 2 pages. |
| **Fix** | Move the size to the nearest step on the UX4G scale, and never below 12px. |

[Live page](https://www.dosje.gov.in/)

## State · Gallery Card Opens · desktop

### svg-img-alt

`WEB-SCREEN-315` · **Major** · Accessibility · Scope: State · Gallery Card Opens · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | <svg> elements with an img role must have an alternative text — <svg viewBox="0 0 24 24" role="img" tabindex="-1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7"></circle><path d="M16 16 L21 21"></path></svg (svg-img-alt, wcag2a, wcag111). Measured on 2 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/gallery/)

## State · Gallery Lightbox · desktop

### svg-img-alt

`WEB-SCREEN-016` · **Major** · Accessibility · Scope: State · Gallery Lightbox · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | <svg> elements with an img role must have an alternative text — <svg viewBox="0 0 24 24" role="img" tabindex="-1" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7"></circle><path d="M16 16 L21 21"></path></svg (svg-img-alt, wcag2a, wcag111). Measured on 2 pages. |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/gallery/)

## State · Home 320 · mobile320

### Go to slide 1

`WEB-SCREEN-048` · **Major** · Layout & Spacing · Scope: State · Home 320 · mobile320

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Go to slide 1” is 40×12px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 40×12 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

### Go to slide 2

`WEB-SCREEN-045` · **Major** · Layout & Spacing · Scope: State · Home 320 · mobile320

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Go to slide 2” is 12×12px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 12×12 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

### Go to slide 3

`WEB-SCREEN-046` · **Major** · Layout & Spacing · Scope: State · Home 320 · mobile320

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Go to slide 3” is 12×12px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 12×12 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

### Go to slide 4

`WEB-SCREEN-047` · **Major** · Layout & Spacing · Scope: State · Home 320 · mobile320

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Go to slide 4” is 12×12px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 12×12 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

## State · Home Hindi · desktop

### घर

`WEB-SCREEN-049` · **Major** · Layout & Spacing · Scope: State · Home Hindi · desktop

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “घर” is 15×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 15×21 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

### विभाग

`WEB-SCREEN-050` · **Major** · Layout & Spacing · Scope: State · Home Hindi · desktop

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “विभाग” is 34×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 34×21 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

### संबद्ध संगठन

`WEB-SCREEN-051` · **Major** · Layout & Spacing · Scope: State · Home Hindi · desktop

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “संबद्ध संगठन” is 68×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 68×21 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

## State · Important Links Modal · desktop

### aria-dialog-name

`WEB-SCREEN-017` · **Major** · Accessibility · Scope: State · Important Links Modal · desktop

| | |
|---|---|
| **Design says** | GIGW 3.0 mandates WCAG 2.2 AA conformance; axe-core tests a subset of it programmatically. |
| **Build does** | ARIA dialog and alertdialog nodes should have an accessible name — <div class="modal fade modal-links show" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style="display: blo (aria-dialog-name, ). |
| **Fix** | Correct the markup the rule names; the rule's help page states the accepted fixes. |

[Live page](https://www.dosje.gov.in/)

## State · Mega Menu Department · desktop

### Close Department

`WEB-SCREEN-052` · **Major** · Layout & Spacing · Scope: State · Mega Menu Department · desktop

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Close Department” is 14×21px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 14×21 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/)

## State · Search Scholarship · desktop

### Scholarship

`WEB-SCREEN-022` · **Major** · Color & Token · Scope: State · Search Scholarship · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Scholarship” (mark) renders #0373DF on #FFF3CD at 16px/600 — #0373DF on #FFF3CD as painted on the capture: 4.19:1 against the 4.5:1 minimum. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/?s=scholarship)

### …

`WEB-SCREEN-023` · **Major** · Color & Token · Scope: State · Search Scholarship · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “…” (span.page-link) renders #938BB6 on #FFFFFF at 14px/400 — #938BB6 on #FFFFFF as painted on the capture: 3.18:1 against the 4.5:1 minimum. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/?s=scholarship)

## Suo Moto Disclosure · desktop

### government's proactive release of key information to ensure 

`WEB-SCREEN-212` · **Major** · Content & Iconography · Scope: Suo Moto Disclosure · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “government's proactive release of key in” · absent from the build |
| **Build does** | The design frame carries “government's proactive release of key information to ensure transparency without” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14426)

### sort by recently updated

`WEB-SCREEN-221` · **Major** · Content & Iconography · Scope: Suo Moto Disclosure · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “sort by recently updated” · absent from the build |
| **Build does** | The design frame carries “sort by recently updated” (14px). Nothing with that text renders on the live page. Measured on 2 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14426)

### list of faa

`WEB-SCREEN-218` · **Major** · Content & Iconography · Scope: Suo Moto Disclosure · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “list of faa” · absent from the build |
| **Build does** | The design frame carries “list of faa” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14426)

### list of cpio

`WEB-SCREEN-215` · **Major** · Content & Iconography · Scope: Suo Moto Disclosure · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “list of cpio” · absent from the build |
| **Build does** | The design frame carries “list of cpio” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14426)

### list of cpio and faa

`WEB-SCREEN-216` · **Major** · Content & Iconography · Scope: Suo Moto Disclosure · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “list of cpio and faa” · absent from the build |
| **Build does** | The design frame carries “list of cpio and faa” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14426)

### list of cpios and faas

`WEB-SCREEN-217` · **Major** · Content & Iconography · Scope: Suo Moto Disclosure · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “list of cpios and faas” · absent from the build |
| **Build does** | The design frame carries “list of cpios and faas” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-14426)

## Supreme Court Judgement · mobile

### NCSK

`WEB-SCREEN-053` · **Major** · Layout & Spacing · Scope: Supreme Court Judgement · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NCSK” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/supreme-court-judgement/)

## Tenders · desktop

### search by tender name or keyword

`WEB-SCREEN-222` · **Major** · Content & Iconography · Scope: Tenders · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by tender name or keyword” · absent from the build |
| **Build does** | The design frame carries “search by tender name or keyword” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12568)

### archived

`WEB-SCREEN-278` · **Major** · Color & Token · Scope: Tenders · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built #374151 · design #343A40 |
| **Build does** | “archived” — colour #343A40 → #374151. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Set the built value to the design's. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12568)

## Tenders · mobile

### NSFDC

`WEB-SCREEN-054` · **Major** · Layout & Spacing · Scope: Tenders · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NSFDC” is 47×19px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 47×19 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/tenders/)

### explore current tender notices, eligibility details, and sub

`WEB-SCREEN-282` · **Minor** · Typography · Scope: Tenders · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 16px · design 14px |
| **Build does** | “explore current tender notices, eligibility details, and submission gu” — size 14 → 16. Measured on 2 pages. |
| **Fix** | Set the built value to the design's. |

[Live page](https://www.dosje.gov.in/tenders/)

### active tenders

`WEB-SCREEN-283` · **Minor** · Typography · Scope: Tenders · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Built 22px · design 20px |
| **Build does** | “active tenders” — size 20 → 22. |
| **Fix** | Set the built value to the design's. |

[Live page](https://www.dosje.gov.in/tenders/)

## Updates · mobile

### NOS

`WEB-SCREEN-055` · **Major** · Layout & Spacing · Scope: Updates · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “NOS” is 147×20px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 147×20 it is also below the WCAG 2.5.8 AA floor of 24×24. Measured on 2 pages. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/updates/)

## Vacancies · desktop

### search by vacancy name or keyword

`WEB-SCREEN-230` · **Major** · Content & Iconography · Scope: Vacancies · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by vacancy name or keyword” · absent from the build |
| **Build does** | The design frame carries “search by vacancy name or keyword” (16px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12427)

### engagement of supervisor/consultant (contract)

`WEB-SCREEN-225` · **Major** · Content & Iconography · Scope: Vacancies · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “engagement of supervisor/consultant (con” · absent from the build |
| **Build does** | The design frame carries “engagement of supervisor/consultant (contract)” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12427)

### new delhi · contract · apply by 30 nov 2025

`WEB-SCREEN-227` · **Major** · Content & Iconography · Scope: Vacancies · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “new delhi · contract · apply by 30 nov 2” · absent from the build |
| **Build does** | The design frame carries “new delhi · contract · apply by 30 nov 2025” (12px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12427)

### supervisory and consultant roles for project implementation 

`WEB-SCREEN-233` · **Major** · Content & Iconography · Scope: Vacancies · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “supervisory and consultant roles for pro” · absent from the build |
| **Build does** | The design frame carries “supervisory and consultant roles for project implementation and monitoring” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12427)

### temporary / short-term consultants

`WEB-SCREEN-234` · **Major** · Content & Iconography · Scope: Vacancies · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “temporary / short-term consultants” · absent from the build |
| **Build does** | The design frame carries “temporary / short-term consultants” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12427)

### multiple locations · contract · ongoing

`WEB-SCREEN-226` · **Major** · Content & Iconography · Scope: Vacancies · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “multiple locations · contract · ongoing” · absent from the build |
| **Build does** | The design frame carries “multiple locations · contract · ongoing” (12px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-12427)

## Vacancies · mobile

### search by scheme name or keyword

`WEB-SCREEN-229` · **Major** · Content & Iconography · Scope: Vacancies · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “search by scheme name or keyword” · absent from the build |
| **Build does** | The design frame carries “search by scheme name or keyword” (14px). Nothing with that text renders on the live page. Measured on 2 pages. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105929)

### contact & support

`WEB-SCREEN-224` · **Major** · Content & Iconography · Scope: Vacancies · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “contact & support” · absent from the build |
| **Build does** | The design frame carries “contact & support” (20px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105929)

### nodal ministry

`WEB-SCREEN-228` · **Major** · Content & Iconography · Scope: Vacancies · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “nodal ministry” · absent from the build |
| **Build does** | The design frame carries “nodal ministry” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105929)

### shreshta@dosje.gov.in

`WEB-SCREEN-232` · **Major** · Content & Iconography · Scope: Vacancies · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “shreshta@dosje.gov.in” · absent from the build |
| **Build does** | The design frame carries “shreshta@dosje.gov.in” (12px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105929)

### 5th floor, lok nayak bhawan, khan market, new delhi - 110003

`WEB-SCREEN-223` · **Major** · Content & Iconography · Scope: Vacancies · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “5th floor, lok nayak bhawan, khan market” · absent from the build |
| **Build does** | The design frame carries “5th floor, lok nayak bhawan, khan market, new delhi - 110003” (12px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=4571-105929)

## Visitor Analytics · desktop

### Previous

`WEB-SCREEN-024` · **Major** · Color & Token · Scope: Visitor Analytics · desktop

| | |
|---|---|
| **Design says** | WCAG 2.2 AA (1.4.3), carried into GIGW 3.0: text needs 4.5:1 against its background, or 3:1 at 24px+ / 18.66px+ bold. |
| **Build does** | Text “Previous” (a.page-link) renders #938BB6 on #FFFFFF at 16px/400 — #938BB6 on #FFFFFF as painted on the capture: 3.18:1 against the 4.5:1 minimum. Also measured on the 375px capture of the same page. |
| **Fix** | Darken the text or lighten its ground until the pair measures at least the required ratio, then re-check every place the pair is used. |

[Live page](https://www.dosje.gov.in/visitor-analytics/)

## Whos Who · desktop

### discover the commissions, corporations, institutes and found

`WEB-SCREEN-240` · **Major** · Content & Iconography · Scope: Whos Who · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “discover the commissions, corporations, ” · absent from the build |
| **Build does** | The design frame carries “discover the commissions, corporations, institutes and foundations that work col” (16px). Nothing with that text renders on the live page. Measured on 2 pages. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8801)

### mosje officials

`WEB-SCREEN-245` · **Major** · Content & Iconography · Scope: Whos Who · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “mosje officials” · absent from the build |
| **Build does** | The design frame carries “mosje officials” (28px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8801)

### min-sje@nic.in

`WEB-SCREEN-243` · **Major** · Content & Iconography · Scope: Whos Who · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “min-sje@nic.in” · absent from the build |
| **Build does** | The design frame carries “min-sje@nic.in” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8801)

### 201 c-wing, shastri bhawan, new delhi

`WEB-SCREEN-236` · **Major** · Content & Iconography · Scope: Whos Who · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “201 c-wing, shastri bhawan, new delhi” · absent from the build |
| **Build does** | The design frame carries “201 c-wing, shastri bhawan, new delhi” (14px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8801)

### mosathawale@gmail.com

`WEB-SCREEN-244` · **Major** · Content & Iconography · Scope: Whos Who · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “mosathawale@gmail.com” · absent from the build |
| **Build does** | The design frame carries “mosathawale@gmail.com” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8801)

### shri b l verma

`WEB-SCREEN-250` · **Major** · Content & Iconography · Scope: Whos Who · desktop

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “shri b l verma” · absent from the build |
| **Build does** | The design frame carries “shri b l verma” (16px). Nothing with that text renders on the live page. Also measured on the 375px capture of the same page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Figma frame](https://www.figma.com/design/Ds5qx61QsI0ZkYSrLKxo0A/MoSJE--Handoff-?node-id=3453-8801)

## Whos Who · mobile

### Dr. Virendra Kumar

`WEB-SCREEN-057` · **Major** · Layout & Spacing · Scope: Whos Who · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Dr. Virendra Kumar” is 130×19px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 130×19 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/whos-who/)

### Shri Kishor Makwana

`WEB-SCREEN-058` · **Major** · Layout & Spacing · Scope: Whos Who · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Shri Kishor Makwana” is 144×19px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 144×19 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/whos-who/)

### Shri Kaishab Bihari

`WEB-SCREEN-288` · **Major** · Layout & Spacing · Scope: Whos Who · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Shri Kaishab Bihari” is 129×19px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 129×19 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/whos-who/)

### Sadhvi Niranjan Jyoti

`WEB-SCREEN-289` · **Major** · Layout & Spacing · Scope: Whos Who · mobile

| | |
|---|---|
| **Design says** | UX4G 3.0 §6: interactive targets are at least 44×44px with 8px between them. WCAG 2.5.8 AA sets an absolute floor of 24×24. |
| **Build does** | “Sadhvi Niranjan Jyoti” is 142×19px. UX4G 3.0 §6 sets 44×44px as the minimum interactive size; at 142×19 it is also below the WCAG 2.5.8 AA floor of 24×24. |
| **Fix** | Grow the control, or add transparent padding around it, until it measures 44×44px with 8px clear of its neighbours. |

[Live page](https://www.dosje.gov.in/whos-who/)

### 101c-wing, shastri bhawan, new delhi

`WEB-SCREEN-235` · **Major** · Content & Iconography · Scope: Whos Who · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “101c-wing, shastri bhawan, new delhi” · absent from the build |
| **Build does** | The design frame carries “101c-wing, shastri bhawan, new delhi” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/whos-who/)

### room no. 623, a-wing, shastri bhawan

`WEB-SCREEN-249` · **Major** · Content & Iconography · Scope: Whos Who · mobile

| | |
|---|---|
| **Design says** | The approved Figma handoff frame for this screen. Design: “room no. 623, a-wing, shastri bhawan” · absent from the build |
| **Build does** | The design frame carries “room no. 623, a-wing, shastri bhawan” (14px). Nothing with that text renders on the live page. |
| **Fix** | Add the content the design carries, or confirm with the design team that it was dropped deliberately. |

[Live page](https://www.dosje.gov.in/whos-who/)

---
## Withdrawn on re-checking, not raised, and notes on the design file

Nothing here is a finding. Each was either raised in an earlier round and did not survive re-checking, ruled out of scope, or is a defect in the handoff file rather than the build. They stay visible, with the reason, so a reviewer who saw one learns the outcome rather than wondering where it went.

- **Global · No visible focus indicator — Open the accessibility option — Open the accessibility option** - Re-measured on pixels: the control is invisible until focused and then shows a visible ring. The first version compared styles, not what a keyboard user sees.
- **Global · Non-text control below 3:1 — Language Translator — Language Translator** - Re-measured on pixels with the element's own CSS colour: the pair passes on screen. The first version read an anti-aliased edge pixel as the text colour.
- **Global · Non-text control below 3:1 — Go to slide 1 — Go to slide 1** - Re-measured on pixels with the element's own CSS colour: the pair passes on screen. The first version read an anti-aliased edge pixel as the text colour.
- **Home · desktop — new funding alert!** - Not reproduced on the re-capture of 18 September 2026.
- **Home · mobile — Go to slide 1** - Not reproduced on the re-capture of 18 September 2026.
- **Home · mobile — Go to slide 2** - Not reproduced on the re-capture of 18 September 2026.
- **Procedure For Processing Grant In Aid Cases In Respect Of Voluntary Organisations · desktop — Home** - Not reproduced on the re-capture of 18 September 2026.
- **Procedure For Processing Grant In Aid Cases In Respect Of Voluntary Organisations · desktop — Department** - Not reproduced on the re-capture of 18 September 2026.
- **Procedure For Processing Grant In Aid Cases In Respect Of Voluntary Organisations · desktop — Associated Organisations** - Not reproduced on the re-capture of 18 September 2026.
