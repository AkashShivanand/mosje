# SMILE — Beggary (Admin) · Design QA Report

**Build:** smile-admin-dev.mosje.in, captured 10 September 2026 · **Design:** MoSJE Portal Handoff → *Smile Beggary (Synced)*
**Status:** draft — not signed off. A human still owes the keyboard and screen-reader pass.

**Review in Figma:** [review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50817-25) (numbered markers) · [pinned report](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50826-25)

---

## Summary

| | |
|---|---|
| Screens compared design ↔ build | 19 + the sign-in surface |
| Findings | **35** — 12 Major, 20 Minor, 3 Nit |
| Applies to every screen | 10 |
| Specific to one screen | 15 |
| Sign-in surface | 10 |

Every finding is a difference between what the design specifies and what the build renders.
Engineering defects with no design counterpart are not raised here.

**The five that matter most**

1. **The sign-in screen is set in two typefaces** — six elements render in Plus Jakarta Sans where the design is Noto Sans throughout.
2. **Choose Portal is a different pattern entirely** — a nine-portal drawer in the build against a four-portal inline list with a role selector in the design. The role selector has no equivalent in the build.
3. **The sidebar is the wrong typeface and size on every screen** — the system font at 15px, against Noto Sans at 14px.
4. **The same table header is three different sizes** depending on the list — 12px on fourteen screens, 14px on two, 11px on one.
5. **Pagination is mirrored** — page numbers and record count have swapped sides, on every list screen.

---

## Sign-in surface


## Sign In

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

## Choose Portal

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

> **Not audited:** the two later Implementing Agency states (OTP sent, and resend) are designed
> but need a real OTP to reach. They were not captured and carry no findings either way.

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

**Compared:** 19 screens plus the sign-in surface, as super-admin. That role is the only one that
reaches every screen; the other roles render the same screens, so a finding on one holds for all.

**Roles reached:** super-admin (23 of 23 routes) · central-authority (23 of 23) · US/SO (4 of 4) ·
NISD (4 of 4). US/SO and NISD were checked live — four sidebar entries each is genuinely their
whole portal, not an incomplete crawl.

**Roles NOT reached — these need someone to act:**

| Role | Why |
|---|---|
| State Nodal Officer | No credentials in the shared access sheet |
| Nodal Officer | No credentials in the shared access sheet |
| Implementing Agency | No credentials, **and** it signs in by OTP. Its three designed states cannot be reached without a test number whose OTP can be read. |

**Not yet compared:** the add / edit / view / detail states behind buttons, and the Master Settings
tabs. Their design frames exist and the capture is in progress; they are not in this count.

**Four routes found no design frame** on *Smile Beggary (Synced)*: `/hotspot-approvals` and the
three Fund Monitoring create forms. If the recent design-and-dev sync produced frames for them,
they are on a page this audit was not pointed at.

---

## Raised elsewhere, not here

Two real problems that are not design bugs, recorded in
`docs/audit/smile-beggary-capture-and-session.md`:

- A page refresh signs the officer out on 15 of 20 routes, including the landing dashboard.
- The Beneficiary List and Shelter Occupants take up to 25 seconds to show their first row.
  (The design consequence — that no loading state was ever drawn — **is** in this report.)
