# SMILE — Beggary (Admin) · Design QA Report

**Build:** smile-admin-dev.mosje.in, captured 10 September 2026 · **Design:** MoSJE Portal Handoff → *Smile Beggary (Synced)*  
**Status:** draft — not signed off. A human still owes the keyboard and screen-reader pass.

**Review in Figma:** [review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50817-25) · [pinned report](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50826-25) — every finding below has a numbered marker on a DESIGN | BUILD board there.

---

## Summary

| | |
|---|---|
| Screens compared design ↔ build | 19 + the sign-in surface |
| Findings | **45** — 16 Major, 25 Minor, 4 Nit |
| Applies to every screen | 18 |
| Specific to one screen | 17 |
| Sign-in surface | 10 |

Every finding is a difference between what the design specifies and what the build renders. Engineering defects with no design counterpart are not raised here; they are in `docs/audit/smile-beggary-capture-and-session.md`.

**Where to start.** The five with the widest reach:

1. **The filters the design specifies are not in the build** — `G19`, Major.
2. **The same table header is three different sizes depending on the screen** — `G04`, Major.
3. **The sidebar is a different typeface and size from the design** — `G11`, Major.
4. **The two halves of the pagination row are swapped** — `G03`, Major.
5. **The breadcrumb names a different section from the design on nearly every screen** — `G17`, Major.

---

## Findings that apply to every screen

These are listed first because each one repeats across the portal, so fixing one fixes many. Each has its own board in Figma showing the design and the build side by side, with the marker on the element in question.

### The current page is a solid gold chip; the design outlines it in navy

`G02` · **Major** · Color & Token · Scope: every screen · shown on **Users** ([board 1 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50854-553))

| | |
|---|---|
| **Design says** | The active page is a white chip with a 1px navy #003366 outline and radius 8, its number in #1F2937. Every other page number is plain text on no fill. (Measured on the Users frame's own .page instances.) |
| **Build does** | The active page is a solid gold #F5BE14 chip with black text. Gold appears nowhere else in the interface as a selected state, and it is not among the colours the SMILE Figma variables publish for an active control. |
| **Fix** | Draw the active page as the design does — white fill, 1px #003366 outline, radius 8 — or, if a filled active state is wanted, fill it with the primary navy and set the number in white. Gold reads as a warning beside the Awaited and Pending chips these same tables carry. (Corrected 2026-09-10: an earlier draft of this finding called the build chip saffron/orange and the design chip navy-filled; measured, the build is #F5BE14 and the design is white with a navy outline.) |

### The two halves of the pagination row are swapped

`G03` · **Major** · Layout & Spacing · Scope: every screen · shown on **Users** ([board 2 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50854-607))

| | |
|---|---|
| **Design says** | Page numbers sit on the left, the record count and per-page selector on the right. |
| **Build does** | The record count is on the left and the page numbers plus per-page selector are on the right — the mirror image, on every list screen. |
| **Fix** | Return to the design's order: page numbers left, count and per-page right, so the control a reader reaches for is in the same place on every list in the estate. |

### The same table header is three different sizes depending on the screen

`G04` · **Major** · Typography · Scope: every screen · shown on **Users** ([board 3 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50854-661))

| | |
|---|---|
| **Design says** | One column-header style: Title Case at the body size in the primary navy, semibold. |
| **Build does** | Measured across all 17 list screens: the header cell renders at 12px on fourteen of them, 14px on Users and City Profiling, and 11px on Performance Statistics. All of them are uppercased by text-transform and letterspaced, so the DOM says 'Name' and the screen says 'NAME'. On Notifications the twelve headers wrap onto two lines to fit. |
| **Fix** | Pick one column-header style and bind every table to it — label-1 (14/20 Medium) is the closest published match. Three sizes for one element is what makes a set of list screens read as three different products; the uppercase is a separate decision to make deliberately, since it costs legibility and is what forces the two-line wrap. |

### No accessibility statement is published

`G10` · **Major** · Responsive & A11y · Scope: every screen · shown on **Users** ([board 4 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50854-715))

| | |
|---|---|
| **Design says** | The footer carries Terms & Conditions and Privacy Policy. There is no accessibility statement in the design either. |
| **Build does** | Same — the footer publishes copyright, Terms & Conditions and Privacy Policy on all 22 screens checked, and no accessibility statement anywhere. |
| **Fix** | Add an Accessibility Statement link to the footer and write the page behind it. GIGW 3.0 requires it on a Government of India property. This one is owed by the design as much as the build. |

### The sidebar is a different typeface and size from the design

`G11` · **Major** · Typography · Scope: every screen · shown on **Users** ([board 5 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50854-769))

| | |
|---|---|
| **Design says** | Every navigation label is Noto Sans at 14px — measured off the design frame's own text nodes (Dashboard, City Profiling, Performance Statistics, Users, Roles all report 14). |
| **Build does** | The build renders the sidebar in the system stack (-apple-system) at 15px. Measured on Users, 48 of the 181 on-canvas elements are in that stack and every one of them is a navigation item; across all 51 captures it is 2,128 elements. |
| **Fix** | Set the sidebar to Noto Sans at 14px to match the design. The likely cause is a navigation component left on the framework's default sans stack rather than the app's. |

### Every page title is smaller, heavier and a different colour than the design

`G12` · **Major** · Typography · Scope: every screen · shown on **Users** ([board 6 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50855-553))

| | |
|---|---|
| **Design says** | The page heading is 28px Medium in the ink colour #1f2937. |
| **Build does** | 24px Bold in #111827 — measured identically on Users, Roles, Permissions, Notifications, Fund Monitoring, Consent Forms, Audit Log, Swashraya and IA List. Bold at a smaller size reads as a different level in the hierarchy from the one the design set. |
| **Fix** | Set the page heading to 28px Medium #1f2937 in the shared page-header component, which fixes it everywhere at once. |

### The breadcrumb names a different section from the design on nearly every screen

`G17` · **Major** · Content & Iconography · Scope: every screen · shown on **Consent Forms** ([board 7 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50855-607))

| | |
|---|---|
| **Design says** | The breadcrumb's first step names the section the design files the screen under: Home (Users, Roles, Permissions), Others (Consent Forms), System (Audit Log), Field Operations (IA List, Survey Locations, Surveyor Mappings), Reports & Analytics (Fund Monitoring). |
| **Build does** | Nine of the ten disagree. Users says 'Access Control'; Roles and Permissions say 'RBAC'; Consent Forms says 'Access Control'; Audit Log says 'Compliance'; IA List says 'IA Lifecycle'; Survey Locations and Surveyor Mappings say 'Survey Operations'; Fund Monitoring says 'Fund Monitoring'. Several also disagree with the build's OWN sidebar headings — the sidebar files Consent Forms under Others, and the breadcrumb says Access Control. |
| **Fix** | Agree one section vocabulary and use it in the sidebar, the breadcrumb and the design. 'RBAC' is developer shorthand and should not be on a citizen-facing government screen at all. |

### The filters the design specifies are not in the build

`G19` · **Major** · Components & States · Scope: every screen · shown on **Surveyor Mappings** ([board 8 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50855-661))

| | |
|---|---|
| **Design says** | Each list screen carries a named filter row: All States/UT, All Districts, All IAs/NGOs, All Statuses, and where relevant All Genders and All Ages. |
| **Build does** | Measured on IA List, Beneficiary List, Survey Locations and Surveyor Mappings: the designed filters are absent. The build offers a search box and, on some screens, one or two unlabelled dropdowns instead — so a reader cannot narrow a 1,248-row list by state or by status at all. |
| **Fix** | Add the designed filter set. This is the largest functional gap between the design and the build on the list screens, and it is the same gap on all four. |

### KPI card labels are uppercase, and some are truncated

`G05` · **Minor** · Typography · Scope: every screen · shown on **Notifications** ([board 9 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50855-715))

| | |
|---|---|
| **Design says** | Card labels are Title Case at the label size, sitting above the figure — 'Total Users', 'Identified/Surveyed', 'Total Notification'. |
| **Build does** | Labels are uppercase and smaller, and where the label is long it is cut off with an ellipsis: the Notifications page reads 'TOTAL NOTIFIC…'. |
| **Fix** | Set the label to Title Case at label-1 (14/20 Medium) and let the card grow to its content. A truncated label is a label the reader cannot use. |

### KPI icons lost their tinted chip

`G06` · **Minor** · Color & Token · Scope: every screen · shown on **Beneficiary List** ([board 10 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50855-769))

| | |
|---|---|
| **Design says** | Each KPI icon sits in a rounded square filled with a light tint of that metric's colour, which is what makes the row of cards scannable. |
| **Build does** | The icons are drawn bare on the card, in a flat colour, with no ground behind them. |
| **Fix** | Restore the tinted rounded chip behind each KPI icon, using the same tint the design assigns to that metric. |

### The page-level export moved out of the header and became two buttons

`G07` · **Minor** · Components & States · Scope: every screen · shown on **Beneficiary List** ([board 11 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50857-793))

| | |
|---|---|
| **Design says** | One 'Export' control sits on the header row at x=1349, level with the page title — on Beneficiary List, Consent Forms, Notifications, Survey Locations, Surveyor Mappings and the Dashboard. Users and Roles carry no export in the design at all. |
| **Build does** | Two buttons, 'CSV' and 'PDF', sit above the title row at the top-right of the content area, out of line with the heading — including on Users and Roles, where the design draws none. The Beneficiary List has three: Download All (CSV), CSV and PDF. |
| **Fix** | Return a single Export control to the header row aligned with the H1, and put the format choice inside it, so the header's action slot reads the same on every screen. Where the design has no export and the build does (Users, Roles), decide which is right and make both say so. |

### The masthead's contrast control is now a light/dark toggle

`G09` · **Minor** · Components & States · Scope: every screen · shown on **Users** ([board 12 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50857-847))

| | |
|---|---|
| **Design says** | The accessibility bar carries a contrast control (the half-filled circle) beside the accessibility icon. |
| **Build does** | That slot is a crescent moon labelled 'Light-Dark'; the neighbouring control is labelled 'Invert Colors'. A theme switch and a contrast control are different affordances. |
| **Fix** | Confirm the intent. GIGW expects a contrast affordance in the masthead; if light/dark replaces it, the contrast requirement needs to be met somewhere the reader can find it, and the design should be updated to match. |

### The line under every page title is a size down and a lighter grey

`G13` · **Minor** · Typography · Scope: every screen · shown on **Users** ([board 13 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50856-781))

| | |
|---|---|
| **Design says** | The description under the heading is 16px Regular in #374151. |
| **Build does** | 14px Regular in #6b7280, on every screen measured. |
| **Fix** | Set it to 16px #374151 in the same page-header component. |

### Breadcrumbs are 12px where the design says 14px

`G14` · **Minor** · Typography · Scope: every screen · shown on **Users** ([board 14 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50856-835))

| | |
|---|---|
| **Design says** | The breadcrumb is 14px — its trail in #374151, the current page in #1f2937. |
| **Build does** | 12px, with the trail in #6b7280 and the current page in #374151. Two steps lighter and a size down, on every screen that has a breadcrumb. |
| **Fix** | Set the breadcrumb to 14px and restore the two colours. |

### Footer links are smaller and lighter than drawn

`G15` · **Minor** · Typography · Scope: every screen · shown on **Users** ([board 15 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50856-889))

| | |
|---|---|
| **Design says** | Terms & Conditions and Privacy Policy are 14px Medium. |
| **Build does** | 12px Regular, on every screen. |
| **Fix** | Set the footer links to 14px Medium. |

### Status chips are a size up, a weight heavier, and different colours

`G16` · **Minor** · Color & Token · Scope: every screen · shown on **Consent Forms** ([board 16 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50857-901))

| | |
|---|---|
| **Design says** | A status chip is 11px Medium — green #27682a for a positive state, amber #8c571f for a waiting one. |
| **Build does** | 12px SemiBold in #047857 and #b45309. Measured on Consent Forms (Uploaded / Awaited), Swashraya (Active) and the Audit Log's action chips. |
| **Fix** | Set chips to 11px Medium and bind the two states to the greens and ambers the design uses, so a chip means the same thing and looks the same on every screen. |

### The data-version selector lost its label

`G18` · **Minor** · Components & States · Scope: every screen · shown on **Beneficiary List** ([board 17 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50857-955))

| | |
|---|---|
| **Design says** | A labelled control reading 'Data: Consolidate (All)' at 14px Medium in the primary navy, on the header row of IA List, Beneficiary List, Survey Locations, Surveyor Mappings and Notifications. |
| **Build does** | A bare 'Data:' at 12px SemiBold in grey with an unlabelled dropdown beside it. The reader is told the word 'Data' and left to open the menu to find out what it does. |
| **Fix** | Restore the full label at 14px Medium in the primary navy. |

### The text-size controls gained plus and minus signs

`G08` · **Nit** · Content & Iconography · Scope: every screen · shown on **Users** ([board 18 ↗](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50857-1009))

| | |
|---|---|
| **Design says** | Three plain A glyphs at graduated sizes; size alone carries the meaning. |
| **Build does** | The A glyphs carry superscript minus and plus signs. |
| **Fix** | Confirm which is intended. If the signs stay, they belong in both the design and the build so the masthead is one specification. |

---

## Findings on one screen

## Dashboard

### The Beneficiary Profile section was rebuilt with different charts

`S01` · **Major** · Components & States

| | |
|---|---|
| **Design says** | Three cards across: Gender Distribution as a donut, Age Distribution as horizontal bars, and Beggar Type as a horizontal stacked bar, each with its own Export link and a one-line reading beneath it. |
| **Build does** | Two wider cards: gender is drawn as a vertical bar chart behind Identification / Rehabilitation / Mobilisation tabs, and the second card is a Swashraya donut. Age Distribution and Beggar Type are not on this row. |
| **Fix** | Confirm the restructure is intended. If it is, the design frame needs to be brought up to it; if it is not, the three designed cards and their chart types should be restored. |

### The six KPI cards became five, with two metrics merged

`S02` · **Minor** · Components & States

| | |
|---|---|
| **Design says** | Six equal cards: Identified/Surveyed, Mobilised, Shelter Assigned, Rehabilitated, Fund Disbursed, Fund Utilised. |
| **Build does** | Five cards, one of which ('Shelter & Rehabilitation') holds two figures side by side, and 'Rehabilitated' is presented as 'Combined Total Rehab'. |
| **Fix** | Confirm the merge is intended and update the design frame to match, so the dashboard has one specification. A card holding two figures needs its own treatment in the design, not an improvised split. |

### The KPI row lost its shared container

`S03` · **Minor** · Layout & Spacing

| | |
|---|---|
| **Design says** | The six cards sit inside one white panel under a PROGRAMME OVERVIEW rule, separated by hairline dividers, reading as a single block. |
| **Build does** | The cards are separate surfaces with gaps between them. |
| **Fix** | Restore the single panel with hairline dividers so the overview reads as one figure set rather than five unrelated tiles. |

### The System Users panel's rows gained their own fills

`S04` · **Minor** · Components & States

| | |
|---|---|
| **Design says** | Rows sit flat on the navy panel; only the small leading icon has a lighter ground. |
| **Build does** | Each row is a filled lighter-blue bar, and the longest label wraps onto two lines. |
| **Fix** | Return the rows to flat-on-navy with the icon chip only, and keep the label on one line. |

## Users

### View Catalog sits on a different screen from the one the design puts it on

`S05` · **Minor** · Components & States

| | |
|---|---|
| **Design says** | Users carries two header actions: a secondary 'View Catalog' and the primary 'Onboard New User'. |
| **Build does** | On Users that slot holds CSV and PDF instead. View Catalog is NOT missing from the build — it is on the ROLES screen, in the same header position (x=1154, y=158), on both super-admin and central-authority. The Roles design frame does not show it there. |
| **Fix** | Confirm which screen owns View Catalog. If Users is right per the design, move it back and add it to the Roles frame's removal; if Roles is right, update both design frames to match. (Corrected 2026-09-10: an earlier draft of this finding said the action was absent from the build. It is not — it is on another screen.) |

### The Name column lost its emphasis

`S06` · **Minor** · Typography

| | |
|---|---|
| **Design says** | The person's name is set semibold, which is what lets a reader scan the column. |
| **Build does** | The name is set at the same weight as every other cell. |
| **Fix** | Set the Name cell to weight 600, matching the design and the body-2-semibold style the variables publish. |

### The build carries two filters the design does not

`S07` · **Nit** · Layout & Spacing

| | |
|---|---|
| **Design says** | Search, All Roles, All Status. |
| **Build does** | Search, All roles, All statuses, All States / UTs, All Districts. |
| **Fix** | Confirm the extra filters are intended; if so, add them to the design frame. Showing all the relevant filters is the right instinct — this is a note, not a defect. |

## Consent Forms

### The breadcrumb puts Consent Forms under Access Control

`S08` · **Major** · Content & Iconography

| | |
|---|---|
| **Design says** | 'Others › Consent Form' — the section the item actually belongs to. |
| **Build does** | 'Access Control / Consent Forms'. Consent Forms is not an access-control screen, and the sidebar files it elsewhere, so the breadcrumb contradicts the navigation. |
| **Fix** | Point the breadcrumb's parent at the section the sidebar puts the screen in. |

### The date-range filter is not in the build

`S09` · **Minor** · Components & States

| | |
|---|---|
| **Design says** | A date-range field sits beside the search box, so submissions can be narrowed by when they arrived. |
| **Build does** | There is no date filter; the row carries State, District and search instead. |
| **Fix** | Add the date-range filter back. It is the only way to answer 'what came in this month' on a list that is paginated to 1,248 items. |

### The Submitted On column is not in the build

`S10` · **Minor** · Components & States

| | |
|---|---|
| **Design says** | Columns end with Document and Submitted On. |
| **Build does** | The table ends at Document; the submission date is not shown. |
| **Fix** | Restore the Submitted On column — a consent record without its date cannot be reconciled. |

### Agency names are drawn as orange links

`S11` · **Minor** · Color & Token

| | |
|---|---|
| **Design says** | The Implementing Agency / NGO value is plain body text. |
| **Build does** | The value is an orange link. Orange is the estate's accent colour, not its link colour, and it reads as a warning state in a column that also carries Awaited chips. |
| **Fix** | If the value should be a link, use the primary navy; if it should not, set it as body text. |

## Notifications

### The empty state sits under a full twelve-column table header

`S12` · **Minor** · Components & States

| | |
|---|---|
| **Design says** | The empty card stands alone under the filters, with no header row above it. |
| **Build does** | The full header row is drawn above the empty card, and its twelve labels wrap onto two lines. |
| **Fix** | Hide the column header when there are no rows, as the design does, so the empty state reads as an answer rather than a broken table. |

### The filters are not the ones the design specifies

`S13` · **Minor** · Components & States

| | |
|---|---|
| **Design says** | All States/UT and All Districts — the geography the rest of the estate filters by. |
| **Build does** | All Types and All Channels. |
| **Fix** | Confirm which set is right. Whichever it is, the design frame and the build should carry the same filters. |

## Beneficiary List

### The screen has no loading state in the design, and the build needs one

`S14` · **Major** · Components & States

| | |
|---|---|
| **Design says** | The Figma section draws only the populated list — five KPI cards with figures and rows with colour-coded status pills. There is no frame for what the screen looks like while the data is on its way. |
| **Build does** | On the live build the KPI figures and every table row are grey placeholder bars for a noticeable stretch before the data arrives (timed at up to 25 seconds on a fast connection). Shelter Occupants behaves the same way. So the state a reader actually sees on arrival is one nobody designed. |
| **Fix** | Design the loading state — a skeleton in the shape of the result, so the layout does not jump when the data lands — and add it to the Figma section for this screen and Shelter Occupants. How long the wait itself should be is an engineering question, recorded separately, not raised here. |

### The footer year differs between design and build

`S15` · **Nit** · Content & Iconography

| | |
|---|---|
| **Design says** | The footer reads © 2025. |
| **Build does** | The footer reads © 2026. |
| **Fix** | Not a defect — the build is current and the design frame is a year behind. Update the Figma footer so the two stop disagreeing at every review. |

### Every status chip is the same blue, where the design colour-codes them

`S16` · **Major** · Color & Token

| | |
|---|---|
| **Design says** | Status is colour-coded so the column can be scanned: Identified, Submitted, Rehabilitation, Under Mobilization and Mobilized each carry their own colour. |
| **Build does** | Every chip renders in the same blue #1d4ed8 — IDENTIFIED, APPROVED_BY_IA, MOBILIZED and REHABILITATED are visually identical. The chips are also uppercase and carry raw status codes (APPROVED_BY_IA) rather than the readable labels the design uses. |
| **Fix** | Colour-code the statuses as the design does, and show the readable label rather than the database value. |

## Surveyor Mappings

### Two KPI labels are cut off in the DESIGN, not the build

`S17` · **Nit** · Content & Iconography

| | |
|---|---|
| **Design says** | The design frame reads 'Total Mapping' and 'Distinct Survey'. |
| **Build does** | The build reads 'Total Mappings' and 'Distinct Surveyors' — the complete words. |
| **Fix** | The build is right and the design frame is truncated. Fix the Figma labels so this does not get reported as a build defect at the next review. |

---

## Sign-in surface

### A third typeface appears on the sign-in screen

`L01` · **Major** · Typography

| | |
|---|---|
| **Design says** | Every string on the designed sign-in frames is Noto Sans. |
| **Build does** | Six elements render in Plus Jakarta Sans: the 'Log in to your account' heading, the Log In button, 'Implementing Agency?' and 'Sign in with OTP', the 'Forgot Password' heading on that screen, 'Implementing Agency sign-in', and 'Send OTP'. Everything around them is Noto Sans, so the panel is set in two typefaces at once. |
| **Fix** | Set all six to Noto Sans. The estate mandates it on every government property, and this is the first screen anyone sees. |

### The SAMAVESH wordmark is little over half the size the design draws

`L02` · **Major** · Typography

| | |
|---|---|
| **Design says** | 56px Bold. |
| **Build does** | 30px. The lock-up is the largest thing on the designed screen and is no longer. |
| **Fix** | Set the wordmark to 56px Bold. |

### Forgot Password is a third smaller and a different colour

`L03` · **Major** · Typography

| | |
|---|---|
| **Design says** | 18px Medium in the ink colour #1f2937. |
| **Build does** | 13px Medium in the primary navy #003366. |
| **Fix** | Set it to 18px. If it should read as a link rather than as text, that is a design decision to make in the frame — the build should not decide it alone. |

### The hero tagline and strapline are both a size down

`L04` · **Minor** · Typography

| | |
|---|---|
| **Design says** | 'Justice. Equality. Dignity.' 28px Medium; the strapline beneath it 16px Regular. |
| **Build does** | 24px Bold and 14px Regular. |
| **Fix** | Restore 28px Medium and 16px Regular. |

### Every line of the Signing into block is smaller than drawn

`L05` · **Minor** · Typography

| | |
|---|---|
| **Design says** | SIGNING INTO 12px Medium, 'SMILE Beggary' 20px Bold, the description 14px Regular. |
| **Build does** | 10px, 16px and 11px. The label also reads 'Signing into' rather than the design's uppercase SIGNING INTO. |
| **Fix** | Restore 12 / 20 / 14 and settle the capitalisation in the frame. |

### Both field labels are smaller, heavier and a different grey

`L06` · **Minor** · Typography

| | |
|---|---|
| **Design says** | 'Email or Mobile Number' and 'Password' are 14px Medium in #1f2937. |
| **Build does** | 13px SemiBold in #334155. |
| **Fix** | Set both to 14px Medium #1f2937. |

### The password placeholder is worded differently

`L07` · **Minor** · Content & Iconography

| | |
|---|---|
| **Design says** | 'Enter your password'. |
| **Build does** | 'Enter password'. The field above it matches the design exactly, so this one reads as an oversight rather than a decision. |
| **Fix** | Use 'Enter your password', or change both in the frame. |

### Two controls are in the build that the design does not draw

`L08` · **Minor** · Components & States

| | |
|---|---|
| **Design says** | The form is: two fields, Forgot Password, Log In, then the Implementing Agency link. |
| **Build does** | The build adds a 'Remember me' checkbox and an 'OR' divider above the Implementing Agency link, plus a version and build stamp in the bottom corner. |
| **Fix** | Confirm all three are intended. If they are, add them to the frame — a checkbox that stores a sign-in preference is a design decision, not an implementation detail. |

### Choose Portal is a different pattern from the one designed

`L09` · **Major** · Components & States

| | |
|---|---|
| **Design says** | The design keeps the reader on the sign-in panel: a 'Your role' selector set to Super Admin, and four portals listed inline — SCW, SMILE-Transgender, NOS, NMBA. |
| **Build does** | The build opens a right-hand slide-over drawer listing nine portals as cards (the four above plus SMILE-Beggary, E-Utthaan, E-Anudaan, PM-AJAY, NHAPOA), with a green tick on the current one. There is no role selector at all. |
| **Fix** | Decide which pattern is right and make both match. The missing role selector is the part to settle first — the design uses it to choose what you sign in AS, and the build has no equivalent. |

### Portal names in the drawer are orange

`L10` · **Minor** · Color & Token

| | |
|---|---|
| **Design says** | Portal names are ink-coloured text, #1f2428. |
| **Build does** | Each portal name is orange. Orange is the estate's accent, and here it is doing the job of a heading on nine cards at once. |
| **Fix** | Set the portal names to the ink colour and let the logo and the tick carry the colour. |
