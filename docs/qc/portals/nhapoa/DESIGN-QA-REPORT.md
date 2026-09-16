# NHAPOA — National Helpline Against Atrocities - Design QC Report

**Generated:** 2026-07-04  · **Design:** [handoff frames](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5093-18512)  
**Status:** ready for review - a human still owes the keyboard and screen-reader pass.

**Also published as:** the PDF beside this file, the `NHAPOA` sheet in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`, a [Figma review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=379-1035).

---
## Summary

| | |
|---|---|
| Boards in the report | 84 |
| Findings | **151** - 1 Blocker, 9 Major, 130 Minor, 11 Nit |
| Applies to every screen | 14 |
| Specific to one screen | 137 |

**Where to start.** The findings with the widest reach or the highest severity:

1. **Accessibility toolbar missing from the government masthead** - `NHA-GLOBAL-001` · Blocker
2. **Co-branding logos + Digital India wordmark mis-render (font-loading)** - `NHA-GLOBAL-002` · Major
3. **KPI cards: figures above the type scale, alert accents lost** - `NHA-GLOBAL-003` · Major
4. **Chart palette off the status tokens** - `NHA-GLOBAL-005` · Major
5. **Text off the neutral tokens (headings + muted)** - `NHA-GLOBAL-004` · Major

---

## Findings that apply to every screen

Each has its own board in the PDF, showing the design and the build side by side with the marker on the element in question.

### Accessibility toolbar missing from the government masthead

`NHA-GLOBAL-001` · **Blocker** · Responsive & A11y · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The gov masthead carries the full inline accessibility toolset (A−/A/A+, contrast) plus an accessibility icon that opens the UX4G Accessibility Widget — a GIGW/UX4G-mandated control set present on every page. |
| **Build does** | On every screen (citizen + admin) the inline toolset is reduced to a single glyph and the UX4G widget is a detached floating FAB, so the mandated accessibility controls are absent from the masthead. |
| **Fix** | Restore the inline A−/A/A+ + contrast controls in the gov-bar on every page and trigger the UX4G widget from the bar's accessibility icon (not a floating FAB). Applies to every screen (citizen + admin). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-user-dev.mosje.in/)

### Co-branding logos + Digital India wordmark mis-render (font-loading)

`NHA-GLOBAL-002` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Co-branding lockups (National Emblem, Digital India, SAMAVESH) render crisply from correct hi-res assets in the correct typeface. |
| **Build does** | The Digital India logo renders incorrectly and its wordmark falls back to a serif face (webfont not loading); the SAMAVESH login-hero lockup is blurry. Repeats on every masthead. |
| **Fix** | Use correct hi-res/SVG co-branding assets and fix the wordmark font-loading fallback. Applies to the masthead on every screen and the login hero. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-user-dev.mosje.in/)

### KPI cards: figures above the type scale, alert accents lost

`NHA-GLOBAL-003` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | KPI numerals sit on the display scale (tops at 28/32), KPI card label text matches the design, and status/danger KPI cards keep their accent styling. |
| **Build does** | KPI numerals render 48–56px, KPI card text styles differ, and alert cards (e.g. SLA Breaches / SLA Compliance) lose their danger/status accent. Repeats on every dashboard. |
| **Fix** | Bring KPI figures onto the display scale, match KPI card text styles, and restore the status accent on alert KPI cards. Applies to every dashboard. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### Text off the neutral tokens (headings + muted)

`NHA-GLOBAL-004` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Dark text uses Text/Primary #003366 / Text/Dark #1f2937; muted/secondary text uses Text/Hint #374151. |
| **Build does** | Headings render near-black slate (#0f172a / #111827) and muted labels render gray-500/400 (#6b7280 / #9ca3af), flattening the colour hierarchy on every admin screen. |
| **Fix** | Map headings and muted/secondary text to the neutral text tokens. Applies to every admin screen (shown here on the Grievance-Monitoring list). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59480) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/grievances)

### Chart palette off the status tokens

`NHA-GLOBAL-005` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Data-viz uses the DS status tokens (Info / Warning / Success / Danger) with the brand navy for emphasis. |
| **Build does** | Charts use ad-hoc hues (e.g. #a66a26 / #3730a3 / #b7131a) instead of the status tokens, and donut segments lack separating gaps. Repeats on every dashboard/analytics screen. |
| **Fix** | Re-map chart series to the status/brand tokens and add gaps between donut segments. Applies to every dashboard/analytics screen. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### Page-header style

`NHA-GLOBAL-006` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The page header uses the design's text style, spacing, action-button and icon. |
| **Build does** | Page-header text style / spacing / button / icon differ from the design (and some carry an icon the design omits). Repeats on every admin screen. |
| **Fix** | Match the page-header text style, spacing, button and icon to the design. Applies to every admin screen. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59480) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/grievances)

### Sidebar: no fill, thin divider, consistent icons, count badges

`NHA-GLOBAL-007` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The sidebar sits on the surface with only a 1px divider; nav icons share one stroke width + neutral colour with a filled primary-colour icon for the active item; nav items carry trailing count badges; the collapse control reflects the sidebar state. |
| **Build does** | The sidebar has a background fill and no divider; icon stroke/colour vary and the active item isn't a filled primary icon; count badges are missing; the collapse button doesn't reflect state. Repeats on every screen with the sidebar. |
| **Fix** | Remove the sidebar fill and add a 1px divider; normalise icon stroke + neutral colour with a filled primary active icon; add the count-badge component; bind the collapse button to sidebar state. Applies to every screen with the sidebar. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### Notification list items

`NHA-GLOBAL-008` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Notification list-item padding, read/unread styling and icons follow the design; the disabled 'Mark all read' shows only when there are read items. |
| **Build does** | Notification list-item padding, read/unread styling and icons don't match the design. Repeats on every Notifications screen. |
| **Fix** | Match notification list-item padding, read/unread styling and icons to the design. Applies to every Notifications screen. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-61146) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/notifications)

### Section / KPI cards

`NHA-GLOBAL-009` · **Minor** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Section and KPI cards share a consistent header text style, uniform heights within a row (width may flex), a divider between a chart and its legend, and charts that fit within the card. |
| **Build does** | Card header styles differ, row card heights aren't uniform, chart↔legend dividers are missing, and some charts overflow their card. Repeats on every card-based screen. |
| **Fix** | Standardise card header text, keep uniform card heights per row (flex width), add a chart↔legend divider, and fit charts within the card (horizontal scroll if very wide). Applies to every card-based screen. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### Icon system

`NHA-GLOBAL-010` · **Minor** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | All icons come from one Material Symbols family at a consistent size/style; no emoji. |
| **Build does** | Icons mix families/sizes/styles and emoji appear in places (e.g. the citizen track result). Repeats across screens. |
| **Fix** | Standardise all icons to one Material Symbols family + consistent size/style and replace emoji with Material icons. Applies to every screen. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-user-dev.mosje.in/)

### Data tables (header, cells, sticky action, hover)

`NHA-GLOBAL-011` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Table header fill + cell text weight/colour follow the list style; role text is Title Case; on wide tables the Action column stays pinned; row hover uses primary/50. |
| **Build does** | Cell text weight/colour differ, role text is lowercase, the Action column isn't sticky on horizontal scroll, and row hover uses a neutral tint. Repeats on every list/table view. |
| **Fix** | Match table header + cell typography, render roles in Title Case, make the Action column sticky on horizontal scroll, and use primary/50 for row hover. Applies to every list/table view. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59480) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/grievances)

### Status chips / badges

`NHA-GLOBAL-012` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Status/SLA pills use the DS semantic colours and sit in the Status column only. |
| **Build does** | Status/SLA pills don't use the semantic tokens and sometimes appear outside the Status column. Repeats on every list/case view. |
| **Fix** | Use the DS semantic colours for status/SLA pills and keep them in the Status column. Applies to every list/case view. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59480) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/grievances)

### Pagination

`NHA-GLOBAL-013` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Lists use numbered pages + a rows-per-page selector. |
| **Build does** | Lists use Prev / Next + 'Page X of N' only. Repeats on every list view. |
| **Fix** | Adopt numbered pagination + a rows-per-page selector across list views (paginate tables beyond ~10–15 rows; hide it for a single page). Applies to every list view. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59480) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/grievances)

### Emblem–text divider & baseline alignment

`NHA-GLOBAL-014` · **Nit** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The updated design shows the National Emblem beside the ministry text, baseline-aligned, with no divider. |
| **Build does** | The build shows a divider between the emblem and text and the emblem isn't baseline-aligned. Repeats on every masthead. |
| **Fix** | Remove the emblem–text divider and align the emblem to the text baseline. Applies to every masthead. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-user-dev.mosje.in/)

---

## Findings specific to one screen

## Call Centre — FAQ

### Mirrors the citizen Help & FAQs

`NHA-CC-FAQ-001` · **Major** · Components & States · Scope: Call Centre — FAQ

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Mirrors the citizen Help & FAQs — reuse the citizen FAQ accordion styling; ensure the whole question row is the toggle target. |
| **Fix** | Mirrors the citizen Help & FAQs — reuse the citizen FAQ accordion styling; ensure the whole question row is the toggle target. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53669) · [Live page](https://nhapoa-admin-dev.mosje.in/call-center/faq)

## Citizen — Help & FAQs

### Accordion opens only from the tiny chevron; whole row should be clickable

`NHA-CIT-FAQ-001` · **Major** · Responsive & A11y · Scope: Citizen — Help & FAQs

| | |
|---|---|
| **Design says** | Clicking anywhere on the question row expands the answer (a full-width, ≥44px target). |
| **Build does** | The answer opens only from the small chevron; the question row is a dead element (target far below the 44px minimum). |
| **Fix** | Make the entire question row the toggle target (keep the chevron as an affordance). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53669) · [Live page](https://nhapoa-user-dev.mosje.in/help-faqs)

### Accordion style must match the design

`NHA-CIT-FAQ-002` · **Minor** · Components & States · Scope: Citizen — Help & FAQs

| | |
|---|---|
| **Design says** | Accordions use the design's style. |
| **Build does** | Accordion style differs from the design. |
| **Fix** | Match the accordion style to the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53669) · [Live page](https://nhapoa-user-dev.mosje.in/help-faqs)

## Citizen — Register Grievance · Step 1: Grievance Registration

### Collapse sidebar by default; cap form width 800px; avoid chatbot overlap

`NHA-CIT-RG1-001` · **Major** · Layout & Spacing · Scope: Citizen — Register Grievance · Step 1: Grievance Registration

| | |
|---|---|
| **Design says** | On long multi-step forms the sidebar is collapsed by default and the form column is capped at 800px, keeping CTAs clear of the chatbot. |
| **Build does** | Sidebar is expanded and the form is full-width, so the chatbot overlaps the CTAs on narrow screens. |
| **Fix** | Collapse sidebar by default; set form max-width 800px; add bottom spacing equal to the chatbot icon height so it never overlaps CTAs. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51959) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Active step marker is a hollow ring, not a filled disc

`NHA-CIT-RG1-002` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Step 1: Grievance Registration

| | |
|---|---|
| **Design says** | Active step is a solid navy disc with a white numeral. |
| **Build does** | Active step renders as an outlined ring, reading like inactive steps. |
| **Fix** | Give the active step the design's solid navy fill + white numeral. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51959) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Upcoming-step label type style off

`NHA-CIT-RG1-003` · **Minor** · Typography · Scope: Citizen — Register Grievance · Step 1: Grievance Registration

| | |
|---|---|
| **Design says** | Upcoming step labels use the design's muted label token. |
| **Build does** | Upcoming-step labels render in a different style. |
| **Fix** | Match the upcoming-step label type style. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51959) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### OTP helper below field; verified/change-number placement per design

`NHA-CIT-RG1-004` · **Minor** · Layout & Spacing · Scope: Citizen — Register Grievance · Step 1: Grievance Registration

| | |
|---|---|
| **Design says** | 'OTP will be sent…' helper sits below the field; the change-number trigger sits beside the input where 'verified' shows, and the verified hint matches the design position. |
| **Build does** | OTP helper is beside the input; verified/change-number placement differs from design. |
| **Fix** | Move the OTP helper below the input; place change-number beside the field (where verified shows) and match the verified-hint position to design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51959) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Bottom button should be 'Cancel' and always active

`NHA-CIT-RG1-005` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Step 1: Grievance Registration

| | |
|---|---|
| **Design says** | Bottom-left control is 'Cancel', always enabled. |
| **Build does** | Build shows 'Back', not an always-active cancel. |
| **Fix** | Relabel to 'Cancel' and keep it active so users can exit the flow. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51959) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### 'Save & Continue' should enable only when required fields are filled

`NHA-CIT-RG1-006` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Step 1: Grievance Registration

| | |
|---|---|
| **Design says** | Primary action enables only when required fields are complete. |
| **Build does** | 'Save and Continue' is enabled even with empty required fields. |
| **Fix** | Disable it until the step's required fields are valid. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51959) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

## Login & Authentication — Sign In

### The logo of SAMAVESH is blurred, use a Hi-Res image / SVG

`NHA-AUTH-LOGIN-001` · **Major** · Content & Iconography · Scope: Login & Authentication — Sign In

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The logo of SAMAVESH is blurred, use a Hi-Res image / SVG. |
| **Fix** | The logo of SAMAVESH is blurred, use a Hi-Res image / SVG. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=10434-159436) · [Live page](https://nhapoa-admin-dev.mosje.in/login)

### The tone of copy should be kept uniform

`NHA-AUTH-LOGIN-002` · **Minor** · Typography · Scope: Login & Authentication — Sign In

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The tone of copy should be kept uniform — make it 'Log in' instead of 'Sign in'. |
| **Fix** | The tone of copy should be kept uniform — make it 'Log in' instead of 'Sign in'. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=10434-159436) · [Live page](https://nhapoa-admin-dev.mosje.in/login)

### The margin & padding of the header and content area must be uniform all ac…

`NHA-AUTH-LOGIN-003` · **Minor** · Layout & Spacing · Scope: Login & Authentication — Sign In

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The margin & padding of the header and content area must be uniform all across. |
| **Fix** | The margin & padding of the header and content area must be uniform all across. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=10434-159436) · [Live page](https://nhapoa-admin-dev.mosje.in/login)

### The left hero panel is a flat navy fill

`NHA-AUTH-LOGIN-004` · **Minor** · Content & Iconography · Scope: Login & Authentication — Sign In

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The left hero panel is a flat navy fill — the design shows a background photograph (justice / court imagery) behind the SAMAVESH lockup. |
| **Fix** | The left hero panel is a flat navy fill — the design shows a background photograph (justice / court imagery) behind the SAMAVESH lockup. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=10434-159436) · [Live page](https://nhapoa-admin-dev.mosje.in/login)

### Placement of 'Forgot password' must be in line with the label

`NHA-AUTH-LOGIN-005` · **Minor** · Components & States · Scope: Login & Authentication — Sign In

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Placement of 'Forgot password' must be in line with the label. |
| **Fix** | Placement of 'Forgot password' must be in line with the label. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=10434-159436) · [Live page](https://nhapoa-admin-dev.mosje.in/login)

### Primary button state differs

`NHA-AUTH-LOGIN-006` · **Minor** · Components & States · Scope: Login & Authentication — Sign In

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Primary button state differs — the design uses a disabled button until the form is valid; the build shows an active button. |
| **Fix** | Primary button state differs — the design uses a disabled button until the form is valid; the build shows an active button. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=10434-159436) · [Live page](https://nhapoa-admin-dev.mosje.in/login)

## System Admin — Dashboard

### The Monthly-Submission-Trend bar graph overflows outside its container

`NHA-SYSU-DASH-001` · **Major** · Layout & Spacing · Scope: System Admin — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The Monthly-Submission-Trend bar graph overflows outside its container — adjust the card width to fit the chart (horizontal scroll if very wide) and let the chart use the card height properly. |
| **Fix** | The Monthly-Submission-Trend bar graph overflows outside its container — adjust the card width to fit the chart (horizontal scroll if very wide) and let the chart use the card height properly. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### Page header style should match the design (text style, colour, spacing)

`NHA-SYSU-DASH-002` · **Minor** · Content & Iconography · Scope: System Admin — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Page header style should match the design (text style, colour, spacing). The default state of the States filter looks off due to extra space between the label and the arrow icon. |
| **Fix** | Page header style should match the design (text style, colour, spacing). The default state of the States filter looks off due to extra space between the label and the arrow icon. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### The KPI-card text styles must match the design

`NHA-SYSU-DASH-003` · **Minor** · Typography · Scope: System Admin — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The KPI-card text styles must match the design. |
| **Fix** | The KPI-card text styles must match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### There must be a divider between the chart and its legend

`NHA-SYSU-DASH-004` · **Minor** · Layout & Spacing · Scope: System Admin — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | There must be a divider between the chart and its legend. |
| **Fix** | There must be a divider between the chart and its legend. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### For cards like the activity feed with a long scroll, add a 'View all' link…

`NHA-SYSU-DASH-005` · **Minor** · Components & States · Scope: System Admin — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | For cards like the activity feed with a long scroll, add a 'View all' link to the next-level page. |
| **Fix** | For cards like the activity feed with a long scroll, add a 'View all' link to the next-level page. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### The card headers must match the design

`NHA-SYSU-DASH-006` · **Minor** · Typography · Scope: System Admin — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The card headers must match the design. |
| **Fix** | The card headers must match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

### Card heights in a row should be uniform; width can flex to the content

`NHA-SYSU-DASH-007` · **Minor** · Layout & Spacing · Scope: System Admin — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Card heights in a row should be uniform; width can flex to the content. |
| **Fix** | Card heights in a row should be uniform; width can flex to the content. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59234) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/dashboard)

## Call Centre — Caller

### Call-intake screen

`NHA-CC-CALLER-001` · **Minor** · Color & Token · Scope: Call Centre — Caller

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Call-intake screen: form fields, layout and controls should follow the admin design tokens + spacing. |
| **Fix** | Call-intake screen: form fields, layout and controls should follow the admin design tokens + spacing. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53203) · [Live page](https://nhapoa-admin-dev.mosje.in/call-center/caller)

## Call Centre — Dashboard

### Match the Call-Centre dashboard to the referenced design frame

`NHA-CC-DASH-001` · **Minor** · Color & Token · Scope: Call Centre — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Match the Call-Centre dashboard to the referenced design frame — card and chart styling should follow the DS tokens (portal-wide token/masthead items are covered in the Global Findings). |
| **Fix** | Match the Call-Centre dashboard to the referenced design frame — card and chart styling should follow the DS tokens (portal-wide token/masthead items are covered in the Global Findings). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-admin-dev.mosje.in/call-center/dashboard)

## Call Centre — Directory

### Directory/contacts list

`NHA-CC-DIRECTORY-001` · **Minor** · Components & States · Scope: Call Centre — Directory

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Directory/contacts list: table, search and pagination styling should follow the admin design language. |
| **Fix** | Directory/contacts list: table, search and pagination styling should follow the admin design language. |

[Live page](https://nhapoa-admin-dev.mosje.in/call-center/directory)

## Call Centre — Queries

### Queries list: table header, status chips, pagination and row styling shoul…

`NHA-CC-QUERIES-001` · **Minor** · Color & Token · Scope: Call Centre — Queries

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Queries list: table header, status chips, pagination and row styling should match the other admin list views + tokens. |
| **Fix** | Queries list: table header, status chips, pagination and row styling should match the other admin list views + tokens. |

[Live page](https://nhapoa-admin-dev.mosje.in/call-center/queries)

## Call Centre — Query

### Query detail: layout, labels and controls should follow the admin design t…

`NHA-CC-QUERY-001` · **Minor** · Color & Token · Scope: Call Centre — Query

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Query detail: layout, labels and controls should follow the admin design tokens. |
| **Fix** | Query detail: layout, labels and controls should follow the admin design tokens. |

[Live page](https://nhapoa-admin-dev.mosje.in/call-center/query)

## Call Centre — Register Grievance

### Mirrors the citizen Register-Grievance flow

`NHA-CC-RG-001` · **Minor** · Layout & Spacing · Scope: Call Centre — Register Grievance

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Mirrors the citizen Register-Grievance flow — reuse the citizen grievance design's step layout, field and OTP styling within the admin shell. |
| **Fix** | Mirrors the citizen Register-Grievance flow — reuse the citizen grievance design's step layout, field and OTP styling within the admin shell. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51959) · [Live page](https://nhapoa-admin-dev.mosje.in/call-center/register-grievance)

## Call Centre — Track

### Mirrors the citizen Track-Status flow

`NHA-CC-TRACK-001` · **Minor** · Components & States · Scope: Call Centre — Track

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Mirrors the citizen Track-Status flow — reuse the citizen track design's result/timeline styling within the admin shell. |
| **Fix** | Mirrors the citizen Track-Status flow — reuse the citizen track design's result/timeline styling within the admin shell. |

[Live page](https://nhapoa-admin-dev.mosje.in/call-center/track)

## Central Authority — Dashboard

### Dashboard charts (Monthly Submission Trend, Top-5 States) should use the d…

`NHA-CA-DASH-001` · **Minor** · Color & Token · Scope: Central Authority — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Dashboard charts (Monthly Submission Trend, Top-5 States) should use the design's chart palette (the design highlights the peak bar in the primary navy). |
| **Fix** | Dashboard charts (Monthly Submission Trend, Top-5 States) should use the design's chart palette (the design highlights the peak bar in the primary navy). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-62103) · [Live page](https://nhapoa-admin-dev.mosje.in/central-authority/dashboard)

### KPI figures + progress meters should sit on the design's type scale and st…

`NHA-CA-DASH-002` · **Minor** · Color & Token · Scope: Central Authority — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | KPI figures + progress meters should sit on the design's type scale and status tokens. |
| **Fix** | KPI figures + progress meters should sit on the design's type scale and status tokens. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-62103) · [Live page](https://nhapoa-admin-dev.mosje.in/central-authority/dashboard)

## Central Authority — Fund Allocation

### Fund-allocation KPI cards, the disbursement donut and the state-wise table…

`NHA-CA-FUND-001` · **Minor** · Color & Token · Scope: Central Authority — Fund Allocation

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Fund-allocation KPI cards, the disbursement donut and the state-wise table/status chips should match the design's status-token palette and spacing. |
| **Fix** | Fund-allocation KPI cards, the disbursement donut and the state-wise table/status chips should match the design's status-token palette and spacing. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-62832) · [Live page](https://nhapoa-admin-dev.mosje.in/central-authority/fund-allocation)

## Central Authority — Grievances

### Match the Central-Authority grievances list to the referenced My-Cases des…

`NHA-CA-GRIEVANCES-001` · **Minor** · Color & Token · Scope: Central Authority — Grievances

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Match the Central-Authority grievances list to the referenced My-Cases design frame — list rows, filters, status chips, pagination and table should follow the DS tokens. |
| **Fix** | Match the Central-Authority grievances list to the referenced My-Cases design frame — list rows, filters, status chips, pagination and table should follow the DS tokens. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53857) · [Live page](https://nhapoa-admin-dev.mosje.in/central-authority/grievances)

## Central Authority — Reports & Export

### Generate-Report form, Recent-Reports list and Quick-Export cards should ma…

`NHA-CA-REPORTS-001` · **Minor** · Color & Token · Scope: Central Authority — Reports & Export

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Generate-Report form, Recent-Reports list and Quick-Export cards should match the design's card spacing, tokens and control styling. |
| **Fix** | Generate-Report form, Recent-Reports list and Quick-Export cards should match the design's card spacing, tokens and control styling. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-63083) · [Live page](https://nhapoa-admin-dev.mosje.in/central-authority/reports)

## Central Authority — Scheme Performance

### Scheme-performance charts + KPI cards should use the design's status-token…

`NHA-CA-SCHEME-001` · **Minor** · Color & Token · Scope: Central Authority — Scheme Performance

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Scheme-performance charts + KPI cards should use the design's status-token palette; KPI figures on the type scale. |
| **Fix** | Scheme-performance charts + KPI cards should use the design's status-token palette; KPI figures on the type scale. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-62639) · [Live page](https://nhapoa-admin-dev.mosje.in/central-authority/scheme-performance)

## Central Authority — State Comparison

### State-comparison charts/tables should use the design's status-token palett…

`NHA-CA-STATECOMP-001` · **Minor** · Color & Token · Scope: Central Authority — State Comparison

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | State-comparison charts/tables should use the design's status-token palette (not ad-hoc hues); axis + legend typography per the design. |
| **Fix** | State-comparison charts/tables should use the design's status-token palette (not ad-hoc hues); axis + legend typography per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-62275) · [Live page](https://nhapoa-admin-dev.mosje.in/central-authority/state-comparison)

## Citizen — Home / Dashboard

### Page-title type style doesn't match the design

`NHA-CIT-HOME-001` · **Minor** · Typography · Scope: Citizen — Home / Dashboard

| | |
|---|---|
| **Design says** | Page title uses the design's display type token. |
| **Build does** | Page title renders in a different type style. |
| **Fix** | Apply the design's title type token. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-user-dev.mosje.in/)

### Hero/action cards style & icons don't match the design

`NHA-CIT-HOME-002` · **Minor** · Components & States · Scope: Citizen — Home / Dashboard

| | |
|---|---|
| **Design says** | Hero/action cards use the design's icon set, text styles and spacing. |
| **Build does** | Hero cards render with different icons and typography. |
| **Fix** | Match the hero-card icon set, text styles and spacing to the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-user-dev.mosje.in/)

### Grievance-Closure step subtitle colour off

`NHA-CIT-HOME-003` · **Minor** · Color & Token · Scope: Citizen — Home / Dashboard

| | |
|---|---|
| **Design says** | Step subtitles use the design's muted-text token. |
| **Build does** | Subtitle colour under the closure steps doesn't match. |
| **Fix** | Set the closure-step subtitle colour to the design's muted-text token. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-user-dev.mosje.in/)

### Masthead 'Admin Login' entry point (good-to-have)

`NHA-CIT-HOME-004` · **Nit** · Components & States · Scope: Citizen — Home / Dashboard

| | |
|---|---|
| **Design says** | A navy 'Admin Login' button sits top-right for quick admin access. |
| **Build does** | No Admin Login button in the citizen masthead. |
| **Fix** | Add the 'Admin Login' button (good-to-have). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-user-dev.mosje.in/)

### Footer uses placeholder text

`NHA-CIT-HOME-005` · **Nit** · Content & Iconography · Scope: Citizen — Home / Dashboard

| | |
|---|---|
| **Design says** | Footer should carry the real ministry footer text. |
| **Build does** | Footer reuses the design's placeholder text. |
| **Fix** | Replace with the real production footer text. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-51876) · [Live page](https://nhapoa-user-dev.mosje.in/)

## Citizen — Register Grievance · Confirm Submission (modal)

### Confirmation dialog must match the design; drop the Close button

`NHA-CIT-RG6-001` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Confirm Submission (modal)

| | |
|---|---|
| **Design says** | The confirm dialog matches the design; there is no Close (×) — 'Review again' returns to the previous screen. |
| **Build does** | The build's confirm dialog differs and includes a Close button. |
| **Fix** | Match the confirm dialog to the design; remove the Close button ('Review again' handles going back). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52830) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

## Citizen — Register Grievance · Step 2: Informer Details

### Read-only input styling (incl. icon & text) must match

`NHA-CIT-RG2-001` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Step 2: Informer Details

| | |
|---|---|
| **Design says** | Read-only fields use the design's read-only input style incl. icon + text style. |
| **Build does** | Read-only inputs render differently. |
| **Fix** | Apply the design's read-only input style (icon + text) to read-only fields. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52133) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Button padding: 16px icon side / 24px other side

`NHA-CIT-RG2-002` · **Minor** · Layout & Spacing · Scope: Citizen — Register Grievance · Step 2: Informer Details

| | |
|---|---|
| **Design says** | Buttons use 16px padding on the icon side, 24px on the other. |
| **Build does** | Button padding doesn't match 16 / 24px. |
| **Fix** | Set button padding to 16px (icon side) / 24px (other side). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52133) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### 'Use my location' should be a plain text button

`NHA-CIT-RG2-003` · **Nit** · Components & States · Scope: Citizen — Register Grievance · Step 2: Informer Details

| | |
|---|---|
| **Design says** | 'Use my location' is a simple text button. |
| **Build does** | Rendered as an outlined/box button. |
| **Fix** | Use the simple text-button style. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52133) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

## Citizen — Register Grievance · Step 3: Victim Details

### Section-header text colour off

`NHA-CIT-RG3-001` · **Minor** · Color & Token · Scope: Citizen — Register Grievance · Step 3: Victim Details

| | |
|---|---|
| **Design says** | Section headers use the design's header token. |
| **Build does** | Section-header colour doesn't match. |
| **Fix** | Set the section-header colour to the design token. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52231) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Aadhaar validation uses a native browser tooltip

`NHA-CIT-RG3-002` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Step 3: Victim Details

| | |
|---|---|
| **Design says** | Validation uses the app's inline red error, per design. |
| **Build does** | Wrong Aadhaar shows the browser's native tooltip, inconsistent with the app's inline errors. |
| **Fix** | Replace native validation with the app's inline red-error styling. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52231) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Show the connector line for the ID input section

`NHA-CIT-RG3-003` · **Nit** · Layout & Spacing · Scope: Citizen — Register Grievance · Step 3: Victim Details

| | |
|---|---|
| **Design says** | Design shows a connector line grouping the ID section. |
| **Build does** | Connector line not shown. |
| **Fix** | Render the ID-section connector line. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52231) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

## Citizen — Register Grievance · Step 4: Grievance Details

### Textarea character count should be right-aligned

`NHA-CIT-RG4-001` · **Minor** · Layout & Spacing · Scope: Citizen — Register Grievance · Step 4: Grievance Details

| | |
|---|---|
| **Design says** | Character counter sits bottom-right. |
| **Build does** | Character count is on the left. |
| **Fix** | Move the counter to the right. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52298) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Mark the document upload as mandatory if it blocks submit

`NHA-CIT-RG4-002` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Step 4: Grievance Details

| | |
|---|---|
| **Design says** | Required inputs are marked required per design. |
| **Build does** | Upload blocks submission but isn't marked mandatory. |
| **Fix** | If mandatory, mark it required (asterisk + validation copy). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52298) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Attached-file card + remove button style must match

`NHA-CIT-RG4-003` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Step 4: Grievance Details

| | |
|---|---|
| **Design says** | Attached-file card and remove button use the design's styling. |
| **Build does** | They don't match the design. |
| **Fix** | Match the attached-file card + remove-button style to design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52298) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

## Citizen — Register Grievance · Step 5: Review & Submit

### 'Edit details' button style must match the design

`NHA-CIT-RG5-001` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Step 5: Review & Submit

| | |
|---|---|
| **Design says** | The Edit-details button uses the design's button style. |
| **Build does** | Build's Edit-details button differs. |
| **Fix** | Match the Edit-details button style to the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52429) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Add a 'View' button for attached documents

`NHA-CIT-RG5-002` · **Minor** · Components & States · Scope: Citizen — Register Grievance · Step 5: Review & Submit

| | |
|---|---|
| **Design says** | The design provides a View action for attached documents. |
| **Build does** | No View button for the attached document. |
| **Fix** | Add a 'View' action for the uploaded document. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52429) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

### Consent check stroke too light — looks disabled

`NHA-CIT-RG5-003` · **Minor** · Color & Token · Scope: Citizen — Register Grievance · Step 5: Review & Submit

| | |
|---|---|
| **Design says** | The consent checkbox matches the design component (visible check). |
| **Build does** | The check stroke is so light it looks disabled. |
| **Fix** | Match the checkbox to the design component so the check reads as active. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52429) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

## Citizen — Register Grievance · Success

### Check icon used appropriately

`NHA-CIT-RG7-001` · **Minor** · Content & Iconography · Scope: Citizen — Register Grievance · Success

| | |
|---|---|
| **Design says** | Success uses the correct check icon from the icon family. |
| **Build does** | The success check icon isn't the right one. |
| **Fix** | Use the correct check icon. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-52526) · [Live page](https://nhapoa-user-dev.mosje.in/register-grievance)

## Citizen — Register Rescue

### Page-title style; no icon in the page title

`NHA-CIT-RES-001` · **Minor** · Typography · Scope: Citizen — Register Rescue

| | |
|---|---|
| **Design says** | Title follows the established design language, with no icon. |
| **Build does** | Title style differs and includes an icon. |
| **Fix** | Match the page-title style; remove the title icon. |

[Live page](https://nhapoa-user-dev.mosje.in/register-rescue)

### Name / Gender / Mobile in a row; Gender as dropdown

`NHA-CIT-RES-002` · **Minor** · Layout & Spacing · Scope: Citizen — Register Rescue

| | |
|---|---|
| **Design says** | These fields sit in a row; Gender is a dropdown. |
| **Build does** | Each field is on its own line; Gender isn't a dropdown. |
| **Fix** | Put Name/Gender/Mobile in a row; make Gender a dropdown. |

[Live page](https://nhapoa-user-dev.mosje.in/register-rescue)

### OTP modal colours must use the design primary

`NHA-CIT-RES-003` · **Minor** · Color & Token · Scope: Citizen — Register Rescue

| | |
|---|---|
| **Design says** | OTP modal layout/colours use the design's primary colour. |
| **Build does** | OTP modal uses a random/non-token colour. |
| **Fix** | Use the design primary colour in the OTP modal (refer to Figma). |

[Live page](https://nhapoa-user-dev.mosje.in/register-rescue)

### Location section should follow the established design language

`NHA-CIT-RES-004` · **Minor** · Layout & Spacing · Scope: Citizen — Register Rescue

| | |
|---|---|
| **Design says** | Location title + current-location button follow the established language (no separate divider between sections). |
| **Build does** | A separate line divider is used between sections. |
| **Fix** | Follow the established section pattern; drop the extra divider. |

[Live page](https://nhapoa-user-dev.mosje.in/register-rescue)

## Citizen — Track Status · Lookup (Reference ID / Mobile)

### Page title must follow the established design language

`NHA-CIT-TRK1-001` · **Minor** · Typography · Scope: Citizen — Track Status · Lookup (Reference ID / Mobile)

| | |
|---|---|
| **Design says** | Title follows the established language. |
| **Build does** | Title differs. |
| **Fix** | Match the page-title style to the design language. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53203) · [Live page](https://nhapoa-user-dev.mosje.in/track-status)

### Card rounded-corner radius must match the design

`NHA-CIT-TRK1-002` · **Minor** · Components & States · Scope: Citizen — Track Status · Lookup (Reference ID / Mobile)

| | |
|---|---|
| **Design says** | The lookup card uses the design's corner radius. |
| **Build does** | Card radius differs from the design. |
| **Fix** | Match the card corner radius to the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53203) · [Live page](https://nhapoa-user-dev.mosje.in/track-status)

### Use the appropriate primary colour from design

`NHA-CIT-TRK1-003` · **Minor** · Color & Token · Scope: Citizen — Track Status · Lookup (Reference ID / Mobile)

| | |
|---|---|
| **Design says** | Primary elements use the design's primary colour token. |
| **Build does** | A non-token/random primary colour is used. |
| **Fix** | Use the design's primary colour token. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53203) · [Live page](https://nhapoa-user-dev.mosje.in/track-status)

## Citizen — Track Status · Result (View Details)

### Use the appropriate primary colour from design

`NHA-CIT-TRK3-001` · **Minor** · Color & Token · Scope: Citizen — Track Status · Result (View Details)

| | |
|---|---|
| **Design says** | Elements use the design's primary colour token. |
| **Build does** | A non-token/random colour is used. |
| **Fix** | Use the design's primary colour token. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53285) · [Live page](https://nhapoa-user-dev.mosje.in/track-status)

### Result layout must match the design

`NHA-CIT-TRK3-002` · **Minor** · Layout & Spacing · Scope: Citizen — Track Status · Result (View Details)

| | |
|---|---|
| **Design says** | The status/result view layout matches the design (View-Details). |
| **Build does** | The result layout differs from the design. |
| **Fix** | Match the result-view layout to the design (ref Figma). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53285) · [Live page](https://nhapoa-user-dev.mosje.in/track-status)

## District Officer — Case Detail · Audit Log

### Audit Log tab: verify the timeline/log-row styling, icons and timestamps m…

`NHA-DO-AUDITLOG-001` · **Minor** · Content & Iconography · Scope: District Officer — Case Detail · Audit Log

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Audit Log tab: verify the timeline/log-row styling, icons and timestamps match the design. |
| **Fix** | Audit Log tab: verify the timeline/log-row styling, icons and timestamps match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-54704) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

## District Officer — Case Detail · Documents

### Documents tab (empty on this case)

`NHA-DO-DOCUMENTS-001` · **Minor** · Components & States · Scope: District Officer — Case Detail · Documents

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Documents tab (empty on this case): verify the empty-state, upload control and document-row styling match the design. |
| **Fix** | Documents tab (empty on this case): verify the empty-state, upload control and document-row styling match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-54232) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

## District Officer — Case Detail · Investigation

### Investigation tab

`NHA-DO-INVESTIGATION-001` · **Minor** · Color & Token · Scope: District Officer — Case Detail · Investigation

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Investigation tab: verify section layout, evidence/notes styling and status chips match the design's tokens. |
| **Fix** | Investigation tab: verify section layout, evidence/notes styling and status chips match the design's tokens. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-54340) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

## District Officer — Case Detail · Overview

### Verify the detail header, tab bar, Case-Timeline sidebar and SLA-tracker s…

`NHA-DO-OVERVIEW-001` · **Minor** · Color & Token · Scope: District Officer — Case Detail · Overview

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Verify the detail header, tab bar, Case-Timeline sidebar and SLA-tracker styling match the design's tokens + spacing. |
| **Fix** | Verify the detail header, tab bar, Case-Timeline sidebar and SLA-tracker styling match the design's tokens + spacing. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-54121) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

## District Officer — Dashboard

### Text styles of the KPI cards must match the design

`NHA-DO-DASH-001` · **Minor** · Typography · Scope: District Officer — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Text styles of the KPI cards must match the design. |
| **Fix** | Text styles of the KPI cards must match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53726) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/dashboard)

### Section-card header text style must match the design

`NHA-DO-DASH-002` · **Minor** · Typography · Scope: District Officer — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Section-card header text style must match the design. |
| **Fix** | Section-card header text style must match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53726) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/dashboard)

### Priority-action status chips don't match the design's chip styles

`NHA-DO-DASH-003` · **Minor** · Components & States · Scope: District Officer — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Priority-action status chips don't match the design's chip styles. |
| **Fix** | Priority-action status chips don't match the design's chip styles. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53726) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/dashboard)

### The extra dot on the priority-action item isn't required

`NHA-DO-DASH-004` · **Nit** · Components & States · Scope: District Officer — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The extra dot on the priority-action item isn't required. |
| **Fix** | The extra dot on the priority-action item isn't required. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53726) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/dashboard)

## District Officer — Investigation Queue

### Investigation-queue list, status chips, table header and action-button sty…

`NHA-DO-INV-001` · **Minor** · Components & States · Scope: District Officer — Investigation Queue

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Investigation-queue list, status chips, table header and action-button styling should match the design. |
| **Fix** | Investigation-queue list, status chips, table header and action-button styling should match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-55831) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/investigation)

## District Officer — My Cases

### SLA and Status pills don't fully match the design's status-token colours

`NHA-DO-CASES-001` · **Minor** · Color & Token · Scope: District Officer — My Cases

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | SLA and Status pills don't fully match the design's status-token colours. |
| **Fix** | SLA and Status pills don't fully match the design's status-token colours. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53857) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

### 'URGENT' / 'ESCALATED' badges should sit in the Status column with the ID,…

`NHA-DO-CASES-002` · **Minor** · Components & States · Scope: District Officer — My Cases

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | 'URGENT' / 'ESCALATED' badges should sit in the Status column with the ID, per the design. |
| **Fix** | 'URGENT' / 'ESCALATED' badges should sit in the Status column with the ID, per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53857) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

### Table header + row typography/spacing should match the design's list style

`NHA-DO-CASES-003` · **Minor** · Typography · Scope: District Officer — My Cases

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Table header + row typography/spacing should match the design's list style. |
| **Fix** | Table header + row typography/spacing should match the design's list style. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53857) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

### Pagination style must match the design (and isn't needed for a single page…

`NHA-DO-CASES-004` · **Nit** · Components & States · Scope: District Officer — My Cases

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Pagination style must match the design (and isn't needed for a single page). |
| **Fix** | Pagination style must match the design (and isn't needed for a single page). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53857) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

## District Officer — My Reports

### Report cards, filter/generate controls and the export button should match…

`NHA-DO-REP-001` · **Minor** · Color & Token · Scope: District Officer — My Reports

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Report cards, filter/generate controls and the export button should match the design's spacing and tokens. |
| **Fix** | Report cards, filter/generate controls and the export button should match the design's spacing and tokens. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-55911) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/reports)

## District Officer — Request Clarification (modal)

### 'Request Clarification from Citizen' modal

`NHA-DO-CLARMODAL-001` · **Minor** · Components & States · Scope: District Officer — Request Clarification (modal)

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | 'Request Clarification from Citizen' modal: verify field styling, the deadline/notification-method controls and the primary-button style match the design. |
| **Fix** | 'Request Clarification from Citizen' modal: verify field styling, the deadline/notification-method controls and the primary-button style match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-54812) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

## Finance Officer — Approved Cases Queue

### Status pills (Ready / On Hold) should match the design's status-token colo…

`NHA-FO-QUEUE-001` · **Minor** · Color & Token · Scope: Finance Officer — Approved Cases Queue

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Status pills (Ready / On Hold) should match the design's status-token colours; the 'Why On Hold?' action styling should match. |
| **Fix** | Status pills (Ready / On Hold) should match the design's status-token colours; the 'Why On Hold?' action styling should match. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-58179) · [Live page](https://nhapoa-admin-dev.mosje.in/finance-officer/queue)

### Sanction-Amount column formatting + table header/row typography should mat…

`NHA-FO-QUEUE-002` · **Minor** · Typography · Scope: Finance Officer — Approved Cases Queue

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Sanction-Amount column formatting + table header/row typography should match the design. |
| **Fix** | Sanction-Amount column formatting + table header/row typography should match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-58179) · [Live page](https://nhapoa-admin-dev.mosje.in/finance-officer/queue)

### 'Process' action-button style should match the design

`NHA-FO-QUEUE-003` · **Minor** · Components & States · Scope: Finance Officer — Approved Cases Queue

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | 'Process' action-button style should match the design. |
| **Fix** | 'Process' action-button style should match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-58179) · [Live page](https://nhapoa-admin-dev.mosje.in/finance-officer/queue)

### Filter tabs (All / Ready / On Hold) with counts + numbered pagination + ro…

`NHA-FO-QUEUE-004` · **Minor** · Components & States · Scope: Finance Officer — Approved Cases Queue

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Filter tabs (All / Ready / On Hold) with counts + numbered pagination + rows-per-page selector per the design. |
| **Fix** | Filter tabs (All / Ready / On Hold) with counts + numbered pagination + rows-per-page selector per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-58179) · [Live page](https://nhapoa-admin-dev.mosje.in/finance-officer/queue)

## Finance Officer — Dashboard

### KPI / summary cards and their status accents should match the design's tok…

`NHA-FO-DASH-001` · **Minor** · Color & Token · Scope: Finance Officer — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | KPI / summary cards and their status accents should match the design's tokens. |
| **Fix** | KPI / summary cards and their status accents should match the design's tokens. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-58064) · [Live page](https://nhapoa-admin-dev.mosje.in/finance-officer/dashboard)

### Charts should use the design's status-token palette

`NHA-FO-DASH-002` · **Minor** · Color & Token · Scope: Finance Officer — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Charts should use the design's status-token palette; KPI figures on the type scale. |
| **Fix** | Charts should use the design's status-token palette; KPI figures on the type scale. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-58064) · [Live page](https://nhapoa-admin-dev.mosje.in/finance-officer/dashboard)

## Finance Officer — Fund Utilisation

### Fund-utilisation charts should use the design's status-token palette (not…

`NHA-FO-UTILISATION-001` · **Minor** · Color & Token · Scope: Finance Officer — Fund Utilisation

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Fund-utilisation charts should use the design's status-token palette (not ad-hoc hues); KPI figures on the type scale; card spacing per the design. |
| **Fix** | Fund-utilisation charts should use the design's status-token palette (not ad-hoc hues); KPI figures on the type scale; card spacing per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-58996) · [Live page](https://nhapoa-admin-dev.mosje.in/finance-officer/utilisation)

## Finance Officer — Sanction Order Review

### Sanction Order Review (step 1 of the disbursement flow)

`NHA-FO-SANCTION-001` · **Minor** · Color & Token · Scope: Finance Officer — Sanction Order Review

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Sanction Order Review (step 1 of the disbursement flow): verify the stepper, sanction-details form, beneficiary-bank block and the primary-button style match the design's tokens + spacing. |
| **Fix** | Sanction Order Review (step 1 of the disbursement flow): verify the stepper, sanction-details form, beneficiary-bank block and the primary-button style match the design's tokens + spacing. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-58351) · [Live page](https://nhapoa-admin-dev.mosje.in/finance-officer/queue)

## Finance Officer — Transaction Log

### Transaction-log list, status/amount styling and table header should match…

`NHA-FO-TRANSACTIONS-001` · **Minor** · Components & States · Scope: Finance Officer — Transaction Log

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Transaction-log list, status/amount styling and table header should match the design. |
| **Fix** | Transaction-log list, status/amount styling and table header should match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-58801) · [Live page](https://nhapoa-admin-dev.mosje.in/finance-officer/transactions)

## Login & Authentication — Choose Portal

### The UI of the portal-picker must match the Figma design

`NHA-AUTH-CHOOSE-001` · **Minor** · Components & States · Scope: Login & Authentication — Choose Portal

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The UI of the portal-picker must match the Figma design. |
| **Fix** | The UI of the portal-picker must match the Figma design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=10434-159687) · [Live page](https://nhapoa-admin-dev.mosje.in/login)

### The current portal (NHAA) isn't marked as selected

`NHA-AUTH-CHOOSE-002` · **Minor** · Components & States · Scope: Login & Authentication — Choose Portal

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The current portal (NHAA) isn't marked as selected — the design shows a green check on the active portal. |
| **Fix** | The current portal (NHAA) isn't marked as selected — the design shows a green check on the active portal. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=10434-159687) · [Live page](https://nhapoa-admin-dev.mosje.in/login)

## Register Rescue · Filled

### Use the already established visual pattern

`NHA-RES2-001` · **Minor** · Components & States · Scope: Register Rescue · Filled

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Use the already established visual pattern. |
| **Fix** | Use the already established visual pattern. |

[Live page](https://nhapoa-user-dev.mosje.in/register-rescue)

## Register Rescue · Mobile verified

### The mobile-verified state should match the already established visual lang…

`NHA-RES4-001` · **Minor** · Components & States · Scope: Register Rescue · Mobile verified

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | The mobile-verified state should match the already established visual language. |
| **Fix** | The mobile-verified state should match the already established visual language. |

[Live page](https://nhapoa-user-dev.mosje.in/register-rescue)

## Register Rescue · OTP verification

### The layout and colours in the OTP modal must match the design

`NHA-RES3-001` · **Minor** · Color & Token · Scope: Register Rescue · OTP verification

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | The layout and colours in the OTP modal must match the design. Use the correct primary colour from the design instead of anything random. Refer to Figma. |
| **Fix** | The layout and colours in the OTP modal must match the design. Use the correct primary colour from the design instead of anything random. Refer to Figma. |

[Live page](https://nhapoa-user-dev.mosje.in/register-rescue)

## Register Rescue · Success

### Feedback already given above

`NHA-RES5-001` · **Minor** · Components & States · Scope: Register Rescue · Success

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Feedback already given above — the same applies to all similar screens. |
| **Fix** | Feedback already given above — the same applies to all similar screens. |

[Live page](https://nhapoa-user-dev.mosje.in/register-rescue)

## SHO — Dashboard

### SHO here shows live data incl. SLA-breach counts

`NHA-SHO-DASH-001` · **Minor** · Color & Token · Scope: SHO — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | SHO here shows live data incl. SLA-breach counts — audit style/tokens, not the data. |
| **Fix** | SHO here shows live data incl. SLA-breach counts — audit style/tokens, not the data. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53726) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/dashboard)

## SHO — My Cases

### Verify any SHO-specific case actions/permissions vs the DO frame

`NHA-SHO-CASES-001` · **Minor** · Components & States · Scope: SHO — My Cases

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Verify any SHO-specific case actions/permissions vs the DO frame. |
| **Fix** | Verify any SHO-specific case actions/permissions vs the DO frame. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-53857) · [Live page](https://nhapoa-admin-dev.mosje.in/district-officer/cases)

## State Authority — Approved Cases

### Approved-case list + status/badge styling and the case-detail link should…

`NHA-SA-APPROVED-001` · **Minor** · Components & States · Scope: State Authority — Approved Cases

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Approved-case list + status/badge styling and the case-detail link should match the design. |
| **Fix** | Approved-case list + status/badge styling and the case-detail link should match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-57102) · [Live page](https://nhapoa-admin-dev.mosje.in/state-authority/approved-cases)

## State Authority — Dashboard

### KPI cards ('SLA Compliance Rate', 'Sent Back') lose their accent/status st…

`NHA-SA-DASH-001` · **Minor** · Typography · Scope: State Authority — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | KPI cards ('SLA Compliance Rate', 'Sent Back') lose their accent/status styling. |
| **Fix** | KPI cards ('SLA Compliance Rate', 'Sent Back') lose their accent/status styling. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-56262) · [Live page](https://nhapoa-admin-dev.mosje.in/state-authority/dashboard)

### Decision-Trend and Case-Status charts use ad-hoc/muted colours instead of…

`NHA-SA-DASH-002` · **Minor** · Color & Token · Scope: State Authority — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Decision-Trend and Case-Status charts use ad-hoc/muted colours instead of the design's status tokens. |
| **Fix** | Decision-Trend and Case-Status charts use ad-hoc/muted colours instead of the design's status tokens. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-56262) · [Live page](https://nhapoa-admin-dev.mosje.in/state-authority/dashboard)

### Priority-Pending status chips (SLA Breached / days-left) don't match the d…

`NHA-SA-DASH-003` · **Minor** · Components & States · Scope: State Authority — Dashboard

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Priority-Pending status chips (SLA Breached / days-left) don't match the design. |
| **Fix** | Priority-Pending status chips (SLA Breached / days-left) don't match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-56262) · [Live page](https://nhapoa-admin-dev.mosje.in/state-authority/dashboard)

## State Authority — Pending Approvals

### Filter tabs (All / Urgent / New) + SLA pills should match the design's chi…

`NHA-SA-PENDING-001` · **Minor** · Color & Token · Scope: State Authority — Pending Approvals

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Filter tabs (All / Urgent / New) + SLA pills should match the design's chip/token styles. |
| **Fix** | Filter tabs (All / Urgent / New) + SLA pills should match the design's chip/token styles. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-56392) · [Live page](https://nhapoa-admin-dev.mosje.in/state-authority/pending-approvals)

### Table header + row typography/spacing should match the design's list style

`NHA-SA-PENDING-002` · **Minor** · Typography · Scope: State Authority — Pending Approvals

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Table header + row typography/spacing should match the design's list style. |
| **Fix** | Table header + row typography/spacing should match the design's list style. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-56392) · [Live page](https://nhapoa-admin-dev.mosje.in/state-authority/pending-approvals)

### 'Review' action-button style should match the design

`NHA-SA-PENDING-003` · **Minor** · Components & States · Scope: State Authority — Pending Approvals

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | 'Review' action-button style should match the design. |
| **Fix** | 'Review' action-button style should match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-56392) · [Live page](https://nhapoa-admin-dev.mosje.in/state-authority/pending-approvals)

## State Authority — Sent Back Cases

### Sent-back list + reason/return styling and status chips should match the d…

`NHA-SA-SENTBACK-001` · **Minor** · Components & States · Scope: State Authority — Sent Back Cases

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Sent-back list + reason/return styling and status chips should match the design. |
| **Fix** | Sent-back list + reason/return styling and status chips should match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-57396) · [Live page](https://nhapoa-admin-dev.mosje.in/state-authority/sent-back)

## State Authority — State Reports

### Report cards, filters and the export button should match the design's spac…

`NHA-SA-REPORTS-001` · **Minor** · Color & Token · Scope: State Authority — State Reports

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Report cards, filters and the export button should match the design's spacing + tokens. |
| **Fix** | Report cards, filters and the export button should match the design's spacing + tokens. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-57731) · [Live page](https://nhapoa-admin-dev.mosje.in/state-authority/reports)

## System Admin — Create New User (modal)

### 'Create New User' modal

`NHA-SYS-CREATEUSER-001` · **Minor** · Components & States · Scope: System Admin — Create New User (modal)

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | 'Create New User' modal: verify the field grid, role/state/district selects and the primary-button style match the design. The User-Management list uses numbered pagination here — matches the design. |
| **Fix** | 'Create New User' modal: verify the field grid, role/state/district selects and the primary-button style match the design. The User-Management list uses numbered pagination here — matches the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-61792) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/users)

## System Admin — Geographic View

### Page header, section-card headers and table elements should follow the est…

`NHA-SYSU-GEO-001` · **Minor** · Typography · Scope: System Admin — Geographic View

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Page header, section-card headers and table elements should follow the established visual language. |
| **Fix** | Page header, section-card headers and table elements should follow the established visual language. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60490) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/geographic)

### The map / chart colours must match the design tokens

`NHA-SYSU-GEO-002` · **Minor** · Color & Token · Scope: System Admin — Geographic View

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The map / chart colours must match the design tokens. |
| **Fix** | The map / chart colours must match the design tokens. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60490) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/geographic)

## System Admin — Grievance Analytics

### Chart spacing should match the design

`NHA-SYSU-ANL-001` · **Minor** · Layout & Spacing · Scope: System Admin — Grievance Analytics

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Chart spacing should match the design. |
| **Fix** | Chart spacing should match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60319) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/analytics)

### Donut-chart segments need a gap between them so that even with close colou…

`NHA-SYSU-ANL-002` · **Minor** · Color & Token · Scope: System Admin — Grievance Analytics

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Donut-chart segments need a gap between them so that even with close colour tones the data stays readable. |
| **Fix** | Donut-chart segments need a gap between them so that even with close colour tones the data stays readable. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60319) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/analytics)

## System Admin — Grievance Categories

### Search and table design should follow the established design language (app…

`NHA-SYSU-CAT-001` · **Minor** · Components & States · Scope: System Admin — Grievance Categories

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Search and table design should follow the established design language (applies to all such screens). |
| **Fix** | Search and table design should follow the established design language (applies to all such screens). |

[Live page](https://nhapoa-admin-dev.mosje.in/admin/categories)

## System Admin — Grievance Monitoring

### Sticky Action column on horizontal scroll

`NHA-SYS-GRV-001` · **Minor** · Layout & Spacing · Scope: System Admin — Grievance Monitoring

| | |
|---|---|
| **Design says** | On wide tables the Action column stays pinned to the table edge. |
| **Build does** | The Action column isn't sticky when the table scrolls horizontally. |
| **Fix** | Make the Action column sticky to the table's edge on horizontal scroll. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59480) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/grievances)

### Status badges belong in the Status column with a semantic colour

`NHA-SYS-GRV-002` · **Minor** · Components & States · Scope: System Admin — Grievance Monitoring

| | |
|---|---|
| **Design says** | Status badges sit only in the Status column using the DS semantic colours. |
| **Build does** | Status badge placement / colour don't use the semantic tokens. |
| **Fix** | Place status badges in the Status column only and use the appropriate DS semantic colour. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59480) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/grievances)

## System Admin — Officer Performance

### Section headers must follow the design language set in Figma

`NHA-SYSU-PERF-001` · **Minor** · Components & States · Scope: System Admin — Officer Performance

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Section headers must follow the design language set in Figma. |
| **Fix** | Section headers must follow the design language set in Figma. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60012) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/officer-performance)

### Elements in the table must follow the visual language set in Figma

`NHA-SYSU-PERF-002` · **Minor** · Components & States · Scope: System Admin — Officer Performance

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Elements in the table must follow the visual language set in Figma. |
| **Fix** | Elements in the table must follow the visual language set in Figma. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60012) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/officer-performance)

## System Admin — Portal Feedback

### Search and table design should follow the established design language

`NHA-SYSU-FB-001` · **Minor** · Components & States · Scope: System Admin — Portal Feedback

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Search and table design should follow the established design language. |
| **Fix** | Search and table design should follow the established design language. |

[Live page](https://nhapoa-admin-dev.mosje.in/admin/feedbacks)

### The icon in the page header isn't required

`NHA-SYSU-FB-002` · **Nit** · Content & Iconography · Scope: System Admin — Portal Feedback

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | The icon in the page header isn't required. |
| **Fix** | The icon in the page header isn't required. |

[Live page](https://nhapoa-admin-dev.mosje.in/admin/feedbacks)

## System Admin — Reports & Export

### Card header must follow the design in terms of text colour and spacing

`NHA-SYS-REP-001` · **Minor** · Color & Token · Scope: System Admin — Reports & Export

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Card header must follow the design in terms of text colour and spacing. |
| **Fix** | Card header must follow the design in terms of text colour and spacing. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60711) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/reports)

### The icons for the Quick-Export options must match the design

`NHA-SYS-REP-002` · **Minor** · Content & Iconography · Scope: System Admin — Reports & Export

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The icons for the Quick-Export options must match the design. |
| **Fix** | The icons for the Quick-Export options must match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60711) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/reports)

### Recent reports is a good-to-have section for easy access to the last repor…

`NHA-SYS-REP-003` · **Nit** · Components & States · Scope: System Admin — Reports & Export

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Recent reports is a good-to-have section for easy access to the last reports. |
| **Fix** | Recent reports is a good-to-have section for easy access to the last reports. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60711) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/reports)

### A full-width block button is not required for Generate and Export

`NHA-SYS-REP-004` · **Nit** · Layout & Spacing · Scope: System Admin — Reports & Export

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | A full-width block button is not required for Generate and Export — keep it hug-content. |
| **Fix** | A full-width block button is not required for Generate and Export — keep it hug-content. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60711) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/reports)

## System Admin — Role Management

### The least-privilege-principle message is information, not a warning

`NHA-SYS-ROL-001` · **Minor** · Color & Token · Scope: System Admin — Role Management

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The least-privilege-principle message is information, not a warning — use the info colour palette from the DS. |
| **Fix** | The least-privilege-principle message is information, not a warning — use the info colour palette from the DS. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60823) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/roles)

### The icons must match the Figma design

`NHA-SYS-ROL-002` · **Minor** · Content & Iconography · Scope: System Admin — Role Management

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The icons must match the Figma design. |
| **Fix** | The icons must match the Figma design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60823) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/roles)

### The permissions table, Summary and Changes cards must all follow the visua…

`NHA-SYS-ROL-003` · **Minor** · Components & States · Scope: System Admin — Role Management

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The permissions table, Summary and Changes cards must all follow the visual language from Figma. |
| **Fix** | The permissions table, Summary and Changes cards must all follow the visual language from Figma. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60823) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/roles)

### Why can the System Admin not update the permissions

`NHA-SYS-ROL-004` · **Minor** · Components & States · Scope: System Admin — Role Management

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Why can the System Admin not update the permissions — who will have this access? |
| **Fix** | Why can the System Admin not update the permissions — who will have this access? |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-60823) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/roles)

## System Admin — SLA Monitor

### Export button style should match the design

`NHA-SYSU-SLA-001` · **Minor** · Components & States · Scope: System Admin — SLA Monitor

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Export button style should match the design. |
| **Fix** | Export button style should match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59826) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/sla-monitor)

### KPI-card text styles must match the design

`NHA-SYSU-SLA-002` · **Minor** · Typography · Scope: System Admin — SLA Monitor

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | KPI-card text styles must match the design. |
| **Fix** | KPI-card text styles must match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59826) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/sla-monitor)

### The width of the Breached-Cases card must be adjusted to fit the table pro…

`NHA-SYSU-SLA-003` · **Minor** · Layout & Spacing · Scope: System Admin — SLA Monitor

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | The width of the Breached-Cases card must be adjusted to fit the table properly. |
| **Fix** | The width of the Breached-Cases card must be adjusted to fit the table properly. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59826) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/sla-monitor)

### Section-card header text must match the design

`NHA-SYSU-SLA-004` · **Minor** · Typography · Scope: System Admin — SLA Monitor

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Section-card header text must match the design. |
| **Fix** | Section-card header text must match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59826) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/sla-monitor)

### Text styles and badge styles in the table must match the design

`NHA-SYSU-SLA-005` · **Minor** · Typography · Scope: System Admin — SLA Monitor

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Text styles and badge styles in the table must match the design. |
| **Fix** | Text styles and badge styles in the table must match the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59826) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/sla-monitor)

### Tables with more than 10–15 rows must paginate for easy access instead of…

`NHA-SYSU-SLA-006` · **Minor** · Components & States · Scope: System Admin — SLA Monitor

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | Tables with more than 10–15 rows must paginate for easy access instead of a long scroll. |
| **Fix** | Tables with more than 10–15 rows must paginate for easy access instead of a long scroll. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-59826) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/sla-monitor)

## System Admin — User Management

### Keep filters on one row when they fit

`NHA-SYS-USR-001` · **Minor** · Layout & Spacing · Scope: System Admin — User Management

| | |
|---|---|
| **Design says** | Filters sit on one row when they fit. |
| **Build does** | Filter controls wrap to a second row unnecessarily. |
| **Fix** | Keep the filter controls on one row when they fit; only wrap when needed. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-61256) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/users)

### Consistent 'Clear Filters' button

`NHA-SYS-USR-002` · **Minor** · Components & States · Scope: System Admin — User Management

| | |
|---|---|
| **Design says** | The clear-filters button is consistent in language, style + position. |
| **Build does** | Clear-filters button language / style / position is inconsistent. |
| **Fix** | Use a consistent language, style and position for the clear-filters button. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-61256) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/users)

## Track Status · Reference entered (pre-OTP)

### Page title must follow the already established visual language

`NHA-TRK2-001` · **Minor** · Components & States · Scope: Track Status · Reference entered (pre-OTP)

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Page title must follow the already established visual language. |
| **Fix** | Page title must follow the already established visual language. |

[Live page](https://nhapoa-user-dev.mosje.in/track-status)

### Use the appropriate primary colour from the design

`NHA-TRK2-002` · **Minor** · Color & Token · Scope: Track Status · Reference entered (pre-OTP)

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Use the appropriate primary colour from the design. |
| **Fix** | Use the appropriate primary colour from the design. |

[Live page](https://nhapoa-user-dev.mosje.in/track-status)

### Rounded corner of the card must match the design visually

`NHA-TRK2-003` · **Minor** · Layout & Spacing · Scope: Track Status · Reference entered (pre-OTP)

| | |
|---|---|
| **Design says** | Match the established admin design language. |
| **Build does** | Rounded corner of the card must match the design visually. |
| **Fix** | Rounded corner of the card must match the design visually. |

[Live page](https://nhapoa-user-dev.mosje.in/track-status)

## System Admin — Notifications

### In the empty state the disabled 'Mark all read' button isn't needed

`NHA-SYS-NTF-001` · **Nit** · Components & States · Scope: System Admin — Notifications

| | |
|---|---|
| **Design says** | See the Figma design frame ↗ (linked on the board) for the intended design. |
| **Build does** | In the empty state the disabled 'Mark all read' button isn't needed — it can appear (disabled) only when there are items and all are read. |
| **Fix** | In the empty state the disabled 'Mark all read' button isn't needed — it can appear (disabled) only when there are items and all are read. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5986-61146) · [Live page](https://nhapoa-admin-dev.mosje.in/admin/notifications)
