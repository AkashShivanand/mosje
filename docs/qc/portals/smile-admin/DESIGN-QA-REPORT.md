# SMILE — Beggary (Admin) · Design QA Report

**Build:** smile-admin-dev.mosje.in, captured 10 September 2026 · **Design:** MoSJE Portal Handoff → *Smile Beggary (Synced)*
**Status:** draft — not signed off. A human still owes the keyboard and screen-reader pass.

**Review in Figma:** [review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50817-25) (numbered markers, editable) · [pinned report](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50826-25)

---

## Summary

| | |
|---|---|
| Screens compared design ↔ build | 19 |
| Findings | **25** — 8 Major, 14 Minor, 3 Nit |
| Applies to every screen | 10 |
| Specific to one screen | 15 |

Every finding is a difference between what the design frame specifies and what the build renders.
Engineering defects with no design counterpart are not raised here.

**The three that matter most**

1. **The sidebar is the wrong typeface and size on every screen** — the system font at 15px, where the design says Noto Sans at 14px.
2. **The same table header is three different sizes** depending on which list you are on — 12px on fourteen screens, 14px on two, 11px on one.
3. **Pagination is mirrored** — page numbers and record count have swapped sides, on every list screen.

---

## Findings that apply to every screen

### The active page number is saffron, not the primary navy

`G02` · **Major** · Color & Token · marker 3 on Users

| | |
|---|---|
| **Design says** | Pagination's current page is a navy chip on white — Primary/500 #003366, the palette the rest of the interface is built from. |
| **Build does** | The current page is an orange chip. Orange is the estate's accent, not its primary, and it is not among the colours the SMILE Figma variables publish for an active control. |
| **Fix** | Bind the active page chip to Primary/500 #003366 with white text, matching every other selected control on the screen. |

### The two halves of the pagination row are swapped

`G03` · **Major** · Layout & Spacing · marker 4 on Users

| | |
|---|---|
| **Design says** | Page numbers sit on the left, the record count and per-page selector on the right. |
| **Build does** | The record count is on the left and the page numbers plus per-page selector are on the right — the mirror image, on every list screen. |
| **Fix** | Return to the design's order: page numbers left, count and per-page right, so the control a reader reaches for is in the same place on every list in the estate. |

### The same table header is three different sizes depending on the screen

`G04` · **Major** · Typography · marker 2 on Users

| | |
|---|---|
| **Design says** | One column-header style: Title Case at the body size in the primary navy, semibold. |
| **Build does** | Measured across all 17 list screens: the header cell renders at 12px on fourteen of them, 14px on Users and City Profiling, and 11px on Performance Statistics. All of them are uppercased by text-transform and letterspaced, so the DOM says 'Name' and the screen says 'NAME'. On Notifications the twelve headers wrap onto two lines to fit. |
| **Fix** | Pick one column-header style and bind every table to it — label-1 (14/20 Medium) is the closest published match. Three sizes for one element is what makes a set of list screens read as three different products; the uppercase is a separate decision to make deliberately, since it costs legibility and is what forces the two-line wrap. |

### No accessibility statement is published

`G10` · **Major** · Responsive & A11y · marker 5 on Users

| | |
|---|---|
| **Design says** | The footer carries Terms & Conditions and Privacy Policy. There is no accessibility statement in the design either. |
| **Build does** | Same — the footer publishes copyright, Terms & Conditions and Privacy Policy on all 22 screens checked, and no accessibility statement anywhere. |
| **Fix** | Add an Accessibility Statement link to the footer and write the page behind it. GIGW 3.0 requires it on a Government of India property. This one is owed by the design as much as the build. |

### The sidebar is a different typeface and size from the design

`G11` · **Major** · Typography · marker 1 on Users

| | |
|---|---|
| **Design says** | Every navigation label is Noto Sans at 14px — measured off the design frame's own text nodes (Dashboard, City Profiling, Performance Statistics, Users, Roles all report 14). |
| **Build does** | The build renders the sidebar in the system stack (-apple-system) at 15px. Measured on Users, 48 of the 181 on-canvas elements are in that stack and every one of them is a navigation item; across all 51 captures it is 2,128 elements. |
| **Fix** | Set the sidebar to Noto Sans at 14px to match the design. The likely cause is a navigation component left on the framework's default sans stack rather than the app's. |

### KPI card labels are uppercase, and some are truncated

`G05` · **Minor** · Typography · marker 1 on Notifications

| | |
|---|---|
| **Design says** | Card labels are Title Case at the label size, sitting above the figure — 'Total Users', 'Identified/Surveyed', 'Total Notification'. |
| **Build does** | Labels are uppercase and smaller, and where the label is long it is cut off with an ellipsis: the Notifications page reads 'TOTAL NOTIFIC…'. |
| **Fix** | Set the label to Title Case at label-1 (14/20 Medium) and let the card grow to its content. A truncated label is a label the reader cannot use. |

### KPI icons lost their tinted chip

`G06` · **Minor** · Color & Token · marker 2 on Persons

| | |
|---|---|
| **Design says** | Each KPI icon sits in a rounded square filled with a light tint of that metric's colour, which is what makes the row of cards scannable. |
| **Build does** | The icons are drawn bare on the card, in a flat colour, with no ground behind them. |
| **Fix** | Restore the tinted rounded chip behind each KPI icon, using the same tint the design assigns to that metric. |

### The page-level export moved out of the header and became two buttons

`G07` · **Minor** · Components & States · marker 7 on Users

| | |
|---|---|
| **Design says** | One 'Export' button sits on the header row, aligned with the page title. |
| **Build does** | Two buttons, 'CSV' and 'PDF', sit above the title row at the top-right of the content area, out of line with the heading. On the Beneficiary List there are three export controls. |
| **Fix** | Return a single Export control to the header row aligned with the H1, and put the format choice inside it, so the header's action slot reads the same on every screen. |

### The masthead's contrast control is now a light/dark toggle

`G09` · **Minor** · Components & States · marker 6 on Users

| | |
|---|---|
| **Design says** | The accessibility bar carries a contrast control (the half-filled circle) beside the accessibility icon. |
| **Build does** | That slot is a crescent moon labelled 'Light-Dark'; the neighbouring control is labelled 'Invert Colors'. A theme switch and a contrast control are different affordances. |
| **Fix** | Confirm the intent. GIGW expects a contrast affordance in the masthead; if light/dark replaces it, the contrast requirement needs to be met somewhere the reader can find it, and the design should be updated to match. |

### The text-size controls gained plus and minus signs

`G08` · **Nit** · Content & Iconography · marker 10 on Users

| | |
|---|---|
| **Design says** | Three plain A glyphs at graduated sizes; size alone carries the meaning. |
| **Build does** | The A glyphs carry superscript minus and plus signs. |
| **Fix** | Confirm which is intended. If the signs stay, they belong in both the design and the build so the masthead is one specification. |

---

## Findings specific to one screen


## Dashboard

### The Beneficiary Profile section was rebuilt with different charts

`S01` · **Major** · Components & States · marker 1 on Dashboard

| | |
|---|---|
| **Design says** | Three cards across: Gender Distribution as a donut, Age Distribution as horizontal bars, and Beggar Type as a horizontal stacked bar, each with its own Export link and a one-line reading beneath it. |
| **Build does** | Two wider cards: gender is drawn as a vertical bar chart behind Identification / Rehabilitation / Mobilisation tabs, and the second card is a Swashraya donut. Age Distribution and Beggar Type are not on this row. |
| **Fix** | Confirm the restructure is intended. If it is, the design frame needs to be brought up to it; if it is not, the three designed cards and their chart types should be restored. |

### The six KPI cards became five, with two metrics merged

`S02` · **Minor** · Components & States · marker 3 on Dashboard

| | |
|---|---|
| **Design says** | Six equal cards: Identified/Surveyed, Mobilised, Shelter Assigned, Rehabilitated, Fund Disbursed, Fund Utilised. |
| **Build does** | Five cards, one of which ('Shelter & Rehabilitation') holds two figures side by side, and 'Rehabilitated' is presented as 'Combined Total Rehab'. |
| **Fix** | Confirm the merge is intended and update the design frame to match, so the dashboard has one specification. A card holding two figures needs its own treatment in the design, not an improvised split. |

### The KPI row lost its shared container

`S03` · **Minor** · Layout & Spacing · marker 2 on Dashboard

| | |
|---|---|
| **Design says** | The six cards sit inside one white panel under a PROGRAMME OVERVIEW rule, separated by hairline dividers, reading as a single block. |
| **Build does** | The cards are separate surfaces with gaps between them. |
| **Fix** | Restore the single panel with hairline dividers so the overview reads as one figure set rather than five unrelated tiles. |

### The System Users panel's rows gained their own fills

`S04` · **Minor** · Components & States · marker 4 on Dashboard

| | |
|---|---|
| **Design says** | Rows sit flat on the navy panel; only the small leading icon has a lighter ground. |
| **Build does** | Each row is a filled lighter-blue bar, and the longest label wraps onto two lines. |
| **Fix** | Return the rows to flat-on-navy with the icon chip only, and keep the label on one line. |

## Consent Forms

### The breadcrumb puts Consent Forms under Access Control

`S08` · **Major** · Content & Iconography · marker 1 on Consent

| | |
|---|---|
| **Design says** | 'Others › Consent Form' — the section the item actually belongs to. |
| **Build does** | 'Access Control / Consent Forms'. Consent Forms is not an access-control screen, and the sidebar files it elsewhere, so the breadcrumb contradicts the navigation. |
| **Fix** | Point the breadcrumb's parent at the section the sidebar puts the screen in. |

### The date-range filter is not in the build

`S09` · **Minor** · Components & States · marker 2 on Consent

| | |
|---|---|
| **Design says** | A date-range field sits beside the search box, so submissions can be narrowed by when they arrived. |
| **Build does** | There is no date filter; the row carries State, District and search instead. |
| **Fix** | Add the date-range filter back. It is the only way to answer 'what came in this month' on a list that is paginated to 1,248 items. |

### The Submitted On column is not in the build

`S10` · **Minor** · Components & States · marker 3 on Consent

| | |
|---|---|
| **Design says** | Columns end with Document and Submitted On. |
| **Build does** | The table ends at Document; the submission date is not shown. |
| **Fix** | Restore the Submitted On column — a consent record without its date cannot be reconciled. |

### Agency names are drawn as orange links

`S11` · **Minor** · Color & Token · marker 4 on Consent

| | |
|---|---|
| **Design says** | The Implementing Agency / NGO value is plain body text. |
| **Build does** | The value is an orange link. Orange is the estate's accent colour, not its link colour, and it reads as a warning state in a column that also carries Awaited chips. |
| **Fix** | If the value should be a link, use the primary navy; if it should not, set it as body text. |

## Beneficiary List

### The screen has no loading state in the design, and the build needs one

`S14` · **Major** · Components & States · marker 1 on Persons

| | |
|---|---|
| **Design says** | The Figma section draws only the populated list — five KPI cards with figures and rows with colour-coded status pills. There is no frame for what the screen looks like while the data is on its way. |
| **Build does** | On the live build the KPI figures and every table row are grey placeholder bars for a noticeable stretch before the data arrives (timed at up to 25 seconds on a fast connection). Shelter Occupants behaves the same way. So the state a reader actually sees on arrival is one nobody designed. |
| **Fix** | Design the loading state — a skeleton in the shape of the result, so the layout does not jump when the data lands — and add it to the Figma section for this screen and Shelter Occupants. How long the wait itself should be is an engineering question, recorded separately, not raised here. |

### The footer year differs between design and build

`S15` · **Nit** · Content & Iconography · marker 3 on Persons

| | |
|---|---|
| **Design says** | The footer reads © 2025. |
| **Build does** | The footer reads © 2026. |
| **Fix** | Not a defect — the build is current and the design frame is a year behind. Update the Figma footer so the two stop disagreeing at every review. |

## Users

### View Catalog sits on a different screen from the one the design puts it on

`S05` · **Minor** · Components & States · marker 8 on Users

| | |
|---|---|
| **Design says** | Users carries two header actions: a secondary 'View Catalog' and the primary 'Onboard New User'. |
| **Build does** | On Users that slot holds CSV and PDF instead. View Catalog is NOT missing from the build — it is on the ROLES screen, in the same header position (x=1154, y=158), on both super-admin and central-authority. The Roles design frame does not show it there. |
| **Fix** | Confirm which screen owns View Catalog. If Users is right per the design, move it back and add it to the Roles frame's removal; if Roles is right, update both design frames to match. (Corrected 2026-09-10: an earlier draft of this finding said the action was absent from the build. It is not — it is on another screen.) |

### The Name column lost its emphasis

`S06` · **Minor** · Typography · marker 9 on Users

| | |
|---|---|
| **Design says** | The person's name is set semibold, which is what lets a reader scan the column. |
| **Build does** | The name is set at the same weight as every other cell. |
| **Fix** | Set the Name cell to weight 600, matching the design and the body-2-semibold style the variables publish. |

### The build carries two filters the design does not

`S07` · **Nit** · Layout & Spacing · marker 11 on Users

| | |
|---|---|
| **Design says** | Search, All Roles, All Status. |
| **Build does** | Search, All roles, All statuses, All States / UTs, All Districts. |
| **Fix** | Confirm the extra filters are intended; if so, add them to the design frame. Showing all the relevant filters is the right instinct — this is a note, not a defect. |

## Notifications

### The empty state sits under a full twelve-column table header

`S12` · **Minor** · Components & States · marker 3 on Notifications

| | |
|---|---|
| **Design says** | The empty card stands alone under the filters, with no header row above it. |
| **Build does** | The full header row is drawn above the empty card, and its twelve labels wrap onto two lines. |
| **Fix** | Hide the column header when there are no rows, as the design does, so the empty state reads as an answer rather than a broken table. |

### The filters are not the ones the design specifies

`S13` · **Minor** · Components & States · marker 2 on Notifications

| | |
|---|---|
| **Design says** | All States/UT and All Districts — the geography the rest of the estate filters by. |
| **Build does** | All Types and All Channels. |
| **Fix** | Confirm which set is right. Whichever it is, the design frame and the build should carry the same filters. |
---

## Coverage

**Compared:** 19 screens, super-admin. That role is the only one that reaches every screen; the
other roles render the same screens, so a finding on one is a finding on all.

**Roles reached:** super-admin (23 of 23 routes) · central-authority (23 of 23) · US/SO (4 of 4) ·
NISD (4 of 4). US/SO and NISD were checked live — four sidebar entries each is genuinely their
whole portal, not an incomplete crawl.

**Roles NOT reached — these need someone to act:**

| Role | Why |
|---|---|
| State Nodal Officer | No credentials in the shared access sheet |
| Nodal Officer | No credentials in the shared access sheet |
| Implementing Agency | No credentials, **and** it is a separate sign-in (the login page offers "Implementing Agency? Sign in with OTP"). The design has three Implementing Agency auth frames. This is an unaudited surface, not just an unaudited role. |

**Not yet compared:** the add / edit / view / detail states that sit behind buttons, and the
Master Settings tabs. Their design frames exist; the capture of them is in progress and they are
not in this count.

**Four routes found no design frame** on *Smile Beggary (Synced)*: `/hotspot-approvals` and the
three Fund Monitoring create forms. If the recent design-and-dev sync produced frames for them,
they are on a page this audit was not pointed at — worth confirming.

---

## Raised elsewhere, not here

Two things were found that are real but are not design bugs, so they are recorded in
`docs/audit/smile-beggary-capture-and-session.md` rather than in this report:

- A page refresh signs the officer out on 15 of 20 routes, including the landing dashboard.
- The Beneficiary List and Shelter Occupants take up to 25 seconds to show their first row.
  (The *design* consequence — that no loading state was ever drawn — **is** in this report.)
