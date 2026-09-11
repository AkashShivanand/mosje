# SMILE — Beggary (Comprehensive Rehabilitation) · Admin - Design QC Report

**Generated:** 2026-09-10  · **Design:** [handoff frames](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=7732-77842)  
**Status:** ready for review - a human still owes the keyboard and screen-reader pass.

**Also published as:** the PDF beside this file, the `SMILE Beggary` sheet in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`, a [Figma review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50817-25), a [pinned Figma report](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50826-25).

---
## Summary

| | |
|---|---|
| Boards in the report | 35 |
| Findings | **60** - 19 Major, 35 Minor, 6 Nit |
| Applies to every screen | 16 |
| Specific to one screen | 44 |
| Withdrawn, not raised, or noted about the design file | 13 |

Design frames on 'Smile Beggary (Synced)' compared against the live dev build at a 1440 viewport, screen by screen, for four roles. Only differences between the design and the build are raised. Copy, wording and policy items are out of scope for this report, and the filter sets are covered by one global note rather than per screen.

**Where to start.** The findings with the widest reach or the highest severity:

1. **The current page is a solid gold chip; the design outlines it in navy** - `SMB-GLOBAL-001` · Major
2. **The two halves of the pagination row are swapped** - `SMB-GLOBAL-002` · Major
3. **The same table header is three different sizes depending on the screen** - `SMB-GLOBAL-003` · Major
4. **The sidebar is a different typeface and size from the design** - `SMB-GLOBAL-004` · Major
5. **Every page title is smaller, heavier and a different colour than the design** - `SMB-GLOBAL-005` · Major

---

## Findings that apply to every screen

Each has its own board in the PDF, showing the design and the build side by side with the marker on the element in question.

### The current page is a solid gold chip; the design outlines it in navy

`SMB-GLOBAL-001` · **Major** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The active page is a white chip with a 1px navy #003366 outline and radius 8, its number in #1F2937. Every other page number is plain text on no fill. (Measured on the Users frame's own .page instances.) |
| **Build does** | The active page is a solid gold #F5BE14 chip with black text. Gold appears nowhere else in the interface as a selected state, and it is not among the colours the SMILE Figma variables publish for an active control. |
| **Fix** | Draw the active page as the design does — white fill, 1px #003366 outline, radius 8 — or, if a filled active state is wanted, fill it with the primary navy and set the number in white. Gold reads as a warning beside the Awaited and Pending chips these same tables carry. (Corrected 2026-09-10: an earlier draft of this finding called the build chip saffron/orange and the design chip navy-filled; measured, the build is #F5BE14 and the design is white with a navy outline.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### The two halves of the pagination row are swapped

`SMB-GLOBAL-002` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Page numbers sit on the left, the record count and per-page selector on the right. |
| **Build does** | The record count is on the left and the page numbers plus per-page selector are on the right — the mirror image, on every list screen. |
| **Fix** | Return to the design's order: page numbers left, count and per-page right, so the control a reader reaches for is in the same place on every list in the estate. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### The same table header is three different sizes depending on the screen

`SMB-GLOBAL-003` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | One column-header style: Title Case at the body size in the primary navy, semibold. |
| **Build does** | Measured across all 17 list screens: the header cell renders at 12px on fourteen of them, 14px on Users and City Profiling, and 11px on Performance Statistics. All of them are uppercased by text-transform and letterspaced, so the DOM says 'Name' and the screen says 'NAME'. On Notifications the twelve headers wrap onto two lines to fit. |
| **Fix** | Pick one column-header style and bind every table to it — label-1 (14/20 Medium) is the closest published match. Three sizes for one element is what makes a set of list screens read as three different products; the uppercase is a separate decision to make deliberately, since it costs legibility and is what forces the two-line wrap. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### The sidebar is a different typeface and size from the design

`SMB-GLOBAL-004` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Every navigation label is Noto Sans at 14px — measured off the design frame's own text nodes (Dashboard, City Profiling, Performance Statistics, Users, Roles all report 14). |
| **Build does** | The build renders the sidebar in the system stack (-apple-system) at 15px. Measured on Users, 48 of the 181 on-canvas elements are in that stack and every one of them is a navigation item; across all 51 captures it is 2,128 elements. |
| **Fix** | Set the sidebar to Noto Sans at 14px to match the design. The likely cause is a navigation component left on the framework's default sans stack rather than the app's. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### Every page title is smaller, heavier and a different colour than the design

`SMB-GLOBAL-005` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The page heading is 28px Medium in the ink colour #1f2937. |
| **Build does** | 24px Bold in #111827 — measured identically on Users, Roles, Permissions, Notifications, Fund Monitoring, Consent Forms, Audit Log, Swashraya and IA List. Bold at a smaller size reads as a different level in the hierarchy from the one the design set. |
| **Fix** | Set the page heading to 28px Medium #1f2937 in the shared page-header component, which fixes it everywhere at once. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### KPI card labels are uppercase, and some are truncated

`SMB-GLOBAL-006` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Card labels are Title Case at the label size, sitting above the figure — 'Total Users', 'Identified/Surveyed', 'Total Notification'. |
| **Build does** | Labels are uppercase and smaller, and where the label is long it is cut off with an ellipsis: the Notifications page reads 'TOTAL NOTIFIC…'. |
| **Fix** | Set the label to Title Case at label-1 (14/20 Medium) and let the card grow to its content. A truncated label is a label the reader cannot use. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51830-237991) · [Live page](https://smile-admin-dev.mosje.in/notifications)

### The KPI icon tile is 36px where the design draws 56px

`SMB-GLOBAL-007` · **Minor** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The icon sits in a rounded tile filled with a light tint of that metric's colour, measured at 56 x 56 on the Beneficiary List frame. |
| **Build does** | The same tinted tile is there, at 36 x 36 — about a third of the drawn area. With the label also dropping to 11px uppercase (G05), the whole card reads a size smaller than designed. |
| **Fix** | Set the icon tile to 56 x 56 with the same tint. (Corrected 2026-09-10: an earlier draft of this finding said the build had no tinted chip at all. It has one; it is smaller. The claim came from a text-only extraction that does not see the icon element — the screenshots do.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-57337) · [Live page](https://smile-admin-dev.mosje.in/persons)

### The page-level export moved out of the header and became two buttons

`SMB-GLOBAL-008` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | One 'Export' control sits on the header row at x=1349, level with the page title — on Beneficiary List, Consent Forms, Notifications, Survey Locations, Surveyor Mappings and the Dashboard. Users and Roles carry no export in the design at all. |
| **Build does** | Two buttons, 'CSV' and 'PDF', sit above the title row at the top-right of the content area, out of line with the heading — including on Users and Roles, where the design draws none. The Beneficiary List has three: Download All (CSV), CSV and PDF. |
| **Fix** | Return a single Export control to the header row aligned with the H1, and put the format choice inside it, so the header's action slot reads the same on every screen. Where the design has no export and the build does (Users, Roles), decide which is right and make both say so. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-57337) · [Live page](https://smile-admin-dev.mosje.in/persons)

### The masthead's contrast control is now a light/dark toggle

`SMB-GLOBAL-009` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The accessibility bar carries a contrast control (the half-filled circle) beside the accessibility icon. |
| **Build does** | That slot is a crescent moon labelled 'Light-Dark'; the neighbouring control is labelled 'Invert Colors'. A theme switch and a contrast control are different affordances. |
| **Fix** | Confirm the intent. GIGW expects a contrast affordance in the masthead; if light/dark replaces it, the contrast requirement needs to be met somewhere the reader can find it, and the design should be updated to match. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### The line under every page title is a size down and a lighter grey

`SMB-GLOBAL-010` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The description under the heading is 16px Regular in #374151. |
| **Build does** | 14px Regular in #6b7280, on every screen measured. |
| **Fix** | Set it to 16px #374151 in the same page-header component. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### Breadcrumbs are 12px where the design says 14px

`SMB-GLOBAL-011` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The breadcrumb is 14px — its trail in #374151, the current page in #1f2937. |
| **Build does** | 12px, with the trail in #6b7280 and the current page in #374151. Two steps lighter and a size down, on every screen that has a breadcrumb. |
| **Fix** | Set the breadcrumb to 14px and restore the two colours. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### Footer links are smaller and lighter than drawn

`SMB-GLOBAL-012` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Terms & Conditions and Privacy Policy are 14px Medium. |
| **Build does** | 12px Regular, on every screen. |
| **Fix** | Set the footer links to 14px Medium. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### Status chips are a size up, a weight heavier, and different colours

`SMB-GLOBAL-013` · **Minor** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | A status chip is 11px Medium — green #27682a for a positive state, amber #8c571f for a waiting one. |
| **Build does** | 12px SemiBold in #047857 and #b45309. Measured on Consent Forms (Uploaded / Awaited), Swashraya (Active) and the Audit Log's action chips. |
| **Fix** | Set chips to 11px Medium and bind the two states to the greens and ambers the design uses, so a chip means the same thing and looks the same on every screen. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51873-194809) · [Live page](https://smile-admin-dev.mosje.in/consent)

### The data-version selector lost its label

`SMB-GLOBAL-014` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | A labelled control reading 'Data: Consolidate (All)' at 14px Medium in the primary navy, on the header row of IA List, Beneficiary List, Survey Locations, Surveyor Mappings and Notifications. |
| **Build does** | A bare 'Data:' at 12px SemiBold in grey with an unlabelled dropdown beside it. The reader is told the word 'Data' and left to open the menu to find out what it does. |
| **Fix** | Restore the full label at 14px Medium in the primary navy. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-57337) · [Live page](https://smile-admin-dev.mosje.in/persons)

### The filter row does not match the design's

`SMB-GLOBAL-015` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Each list screen carries a named filter row — All States/UT, All Districts, All IAs/NGOs, All Statuses, and where relevant All Genders and All Ages. Measured on IA List, Beneficiary List, Survey Locations and Surveyor Mappings. |
| **Build does** | The filter sets differ from screen to screen and from the design: some screens offer a search box and one or two unlabelled dropdowns, Users has two filters the design does not, and Notifications filters by Type and Channel where the design filters by geography. |
| **Fix** | Use the relevant filter options for each screen and follow the design where it applies. This is one note for the whole portal, not a demand that every screen match the designed list exactly — the filter sets are still being settled. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51699-165683) · [Live page](https://smile-admin-dev.mosje.in/surveyor-mapped)

### The text-size controls gained plus and minus signs

`SMB-GLOBAL-016` · **Nit** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Three plain A glyphs at graduated sizes; size alone carries the meaning. |
| **Build does** | The A glyphs carry superscript minus and plus signs. |
| **Fix** | Confirm which is intended. If the signs stay, they belong in both the design and the build so the masthead is one specification. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

---

## Findings specific to one screen

## Add Shelter Home

### Six required markers are missing, and the three section headers with them

`SMB-SA-ADDSHELTER-001` · **Major** · Components & States · Scope: Add Shelter Home

| | |
|---|---|
| **Design says** | Asterisks on Shelter Name, Capacity, Type, Contact Person, Address, Operational Status, Linked Implementing Agency and Skills & Training Programmes. Three small-caps section headers divide the form: SHELTER HOME DETAILS, IMPLEMENTING AGENCY DETAILS, SHELTER HOME LOGIN ACCOUNT. |
| **Build does** | Only Shelter Name and Capacity carry an asterisk. The three section headers are not there; the fields run continuously under one card title. |
| **Fix** | Restore the required markers — a form that does not say which fields are mandatory fails at submit instead of before it — and the three section headers. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51712-166102) · [Live page](https://smile-admin-dev.mosje.in/shelter-homes)

### The DESIGN puts a date-range picker where the Address field should be

`SMB-SA-ADDSHELTER-002` · **Major** · Components & States · Scope: Add Shelter Home

| | |
|---|---|
| **Design says** | The field labelled 'Address' is drawn as a date control with a calendar icon reading 'Select Start and End Date'. 'Contact Person' is drawn as a dropdown. |
| **Build does** | Address is a text input and Contact Person is a text input, which is what both fields are for. |
| **Fix** | The build is right. Fix the Figma frame — this is a design-side defect, and it is the second of its kind on this page after 'Sanction DateDate'. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51712-166102) · [Live page](https://smile-admin-dev.mosje.in/shelter-homes)

### The field grid is two columns where the design draws three

`SMB-SA-ADDSHELTER-003` · **Minor** · Layout & Spacing · Scope: Add Shelter Home

| | |
|---|---|
| **Design says** | Three across: Shelter Name | Capacity | Type, then Contact Person | Address | Operational Status. |
| **Build does** | Two across, in a different order: Shelter Name | Capacity, then Contact Person | Address, then Type | Operational Status. The form is a third longer as a result. |
| **Fix** | Use the designed three-column grid and the designed field order. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51712-166102) · [Live page](https://smile-admin-dev.mosje.in/shelter-homes)

### The build adds a warning banner the design does not have

`SMB-SA-ADDSHELTER-004` · **Minor** · Components & States · Scope: Add Shelter Home

| | |
|---|---|
| **Design says** | No banner. The form opens on its fields. |
| **Build does** | An amber banner reads 'Pick a State and District / City in the filter above (or link an Implementing Agency below) so this shelter lands in the right district.' |
| **Fix** | The banner is doing real work — it explains a dependency the design never resolved. Keep it, and draw it in the design, or design the dependency out. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51712-166102) · [Live page](https://smile-admin-dev.mosje.in/shelter-homes)

## Beneficiary List

### The screen has no loading state in the design, and the build needs one

`SMB-SA-PERSONS-001` · **Major** · Components & States · Scope: Beneficiary List

| | |
|---|---|
| **Design says** | The Figma section draws only the populated list — five KPI cards with figures and rows with colour-coded status pills. There is no frame for what the screen looks like while the data is on its way. |
| **Build does** | On the live build the KPI figures and every table row are grey placeholder bars for a noticeable stretch before the data arrives (timed at up to 25 seconds on a fast connection). Shelter Occupants behaves the same way. So the state a reader actually sees on arrival is one nobody designed. |
| **Fix** | Design the loading state — a skeleton in the shape of the result, so the layout does not jump when the data lands — and add it to the Figma section for this screen and Shelter Occupants. How long the wait itself should be is an engineering question, recorded separately, not raised here. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-57337) · [Live page](https://smile-admin-dev.mosje.in/persons)

### Every status chip is the same blue, where the design colour-codes them

`SMB-SA-PERSONS-002` · **Major** · Color & Token · Scope: Beneficiary List

| | |
|---|---|
| **Design says** | Status is colour-coded so the column can be scanned: IDENTIFIED blue #1558b0 on #d2e3fc, SUBMITTED navy #002b55 on #c8dbf0, REHABILITATION and MOBILIZED green #27682a on #c8e6c9, UNDER MOBILIZATION amber #8c571f on #ffe4bf. |
| **Build does** | Every chip renders in the same blue — #1d4ed8 on #eff6ff — so IDENTIFIED, APPROVED_BY_IA, MOBILIZED and REHABILITATED are visually identical. |
| **Fix** | Colour-code the statuses as the design does. A status column where every value looks the same cannot be scanned, which is the only reason it is a column. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-57337) · [Live page](https://smile-admin-dev.mosje.in/persons)

### The DESIGN gives the same status two different colours

`SMB-SA-PERSONS-003` · **Nit** · Color & Token · Scope: Beneficiary List

| | |
|---|---|
| **Design says** | IDENTIFIED is drawn twice on the frame: blue #1558b0 on #d2e3fc in the first row, and amber #8c571f on #ffe4bf in the sixth. Every other status is consistent — SUBMITTED navy, REHABILITATION and MOBILIZED green, UNDER MOBILIZATION amber. |
| **Build does** | The build gives every status the same blue, so it does not reproduce the inconsistency; it loses the colour-coding instead (S16). |
| **Fix** | Pick one colour for IDENTIFIED in the design frame before the colour-coding is built, or the same ambiguity is built in. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-57337) · [Live page](https://smile-admin-dev.mosje.in/persons)

## Choose Portal

### The role selector on the sign-in panel is not in the build

`SMB-AUTH-004` · **Major** · Components & States · Scope: Choose Portal

| | |
|---|---|
| **Design says** | The Choose Portal frame's login panel reads 'Log in to your account / Select your role to continue', with a 'Your role' field set to Super Admin above the email and password fields. |
| **Build does** | There is no role selector. The panel goes straight from the heading to Email or Mobile Number. (The portal drawer itself matches — both design and build present the portals as a right-hand drawer with orange titles.) |
| **Fix** | Confirm whether the role is chosen at sign-in or derived from the account. If it is derived, remove the selector from the design frame; if it is chosen, build it. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8383-55528) · [Live page](https://smile-admin-dev.mosje.in/login)

## City Profiling

### The last column of the table is off the side of the screen

`SMB-SA-CITY-001` · **Major** · Layout & Spacing · Scope: City Profiling

| | |
|---|---|
| **Design says** | Ten columns fit inside the 1440 frame, the last (Utilized (₹)) ending at about x=1400. |
| **Build does** | The same ten columns run to x=1554, so Fund Utilised sits outside the 1440 viewport and can only be reached by scrolling the table sideways. Measured on the live page at a 1440 viewport. |
| **Fix** | Fit the ten columns inside the viewport — the design does it by using short headers ('Cities', 'Identified', 'Released (₹)') where the build spells them out. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51891-441340) · [Live page](https://smile-admin-dev.mosje.in/city-profiling)

### A fifth KPI card appears, and two of the four designed ones are renamed

`SMB-SA-CITY-002` · **Minor** · Components & States · Scope: City Profiling

| | |
|---|---|
| **Design says** | Four cards: States/UTs Onboarded, Total Cities Selected, Beneficiaries Identified, Funds Released. Each label sits on one line beside a 56px icon tile. |
| **Build does** | Five: States/UTs Onboarded, Total Cities Selected, Beneficiary Identified/Surveyed, Fund Disbursed, Fund Utilised. Three of the five labels wrap onto two or three lines, so the figure sits at a different height on every card and the row no longer reads across. |
| **Fix** | Add the fifth card to the design and agree the two renamed labels. Whatever the wording, size the cards so the label fits on one line — a row of figures a reader cannot compare across is the point of the row lost. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51891-441340) · [Live page](https://smile-admin-dev.mosje.in/city-profiling)

### The four figure columns lose their coloured chips

`SMB-SA-CITY-003` · **Minor** · Color & Token · Scope: City Profiling

| | |
|---|---|
| **Design says** | Identified, Rehabilitated, Released (₹) and Utilized (₹) are drawn as tinted pills — blue, green, amber and red — so a reader can pick a state's performance out of the table at a glance. |
| **Build does** | All four render as plain text in the body colour. |
| **Fix** | Restore the four tinted pills. They are the only thing distinguishing ten numeric columns from each other. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51891-441340) · [Live page](https://smile-admin-dev.mosje.in/city-profiling)

## Dashboard

### The Beneficiary Profile section was rebuilt with different charts

`SMB-SA-DASHBOARD-001` · **Major** · Components & States · Scope: Dashboard

| | |
|---|---|
| **Design says** | Three cards across: Gender Distribution as a donut, Age Distribution as horizontal bars, and Beggar Type as a horizontal stacked bar, each with its own Export link and a one-line reading beneath it. |
| **Build does** | Two wider cards: gender is drawn as a vertical bar chart behind Identification / Rehabilitation / Mobilisation tabs, and the second card is a Swashraya donut. Age Distribution and Beggar Type are not on this row. |
| **Fix** | Confirm the restructure is intended. If it is, the design frame needs to be brought up to it; if it is not, the three designed cards and their chart types should be restored. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-49264) · [Live page](https://smile-admin-dev.mosje.in/dashboard)

### Two of the six metrics are merged into one cell, and a third is renamed

`SMB-SA-DASHBOARD-002` · **Minor** · Components & States · Scope: Dashboard

| | |
|---|---|
| **Design says** | Six cells in a three-by-two grid: Identified/Surveyed, Mobilised, Shelter Assigned, Rehabilitated, Fund Disbursed, Fund Utilised. |
| **Build does** | Six cells too, but the third holds TWO figures under one heading — 'Shelter & Rehabilitation', carrying Shelter Assigned 564 and Child Rehab 306 — and 'Rehabilitated' is renamed 'Combined Total Rehab'. So the build reports seven figures in six cells, and Child Rehab appears in neither the design nor its own cell. (Corrected 2026-09-10: an earlier draft said the row dropped to five cards. It has six.) |
| **Fix** | Confirm the merge is intended and update the design frame to match, so the dashboard has one specification. A card holding two figures needs its own treatment in the design, not an improvised split. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-49264) · [Live page](https://smile-admin-dev.mosje.in/dashboard)

### The System Users panel's rows gained their own fills

`SMB-SA-DASHBOARD-003` · **Minor** · Components & States · Scope: Dashboard

| | |
|---|---|
| **Design says** | Rows sit flat on the navy panel; only the small leading icon has a lighter ground. |
| **Build does** | Each row is a filled lighter-blue bar, and the longest label wraps onto two lines. |
| **Fix** | Return the rows to flat-on-navy with the icon chip only, and keep the label on one line. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-49264) · [Live page](https://smile-admin-dev.mosje.in/dashboard)

## Master Settings

### The build adds a four-figure strip the design does not draw, and shows nine tabs where the design shows five

`SMB-SA-MASTER-001` · **Major** · Components & States · Scope: Master Settings

| | |
|---|---|
| **Design says** | Heading, sub-line, then a rail of five tabs — Geography, Roles & Permission, Survey Questionnaire, Agency, Operational — with an overflow control for the rest, then the table. |
| **Build does** | The same rail carries all nine tabs at once, and above it sits a four-figure strip: Active Tab / Geography Masters, Records / 36, Mode / Read-only, Your Access / Full access. The strip is in no design frame. |
| **Fix** | Decide whether the strip stays; if it does, draw it. Either show five tabs and an overflow as designed or widen the rail deliberately. 'Mode: Read-only' beside 'Your Access: Full access' also needs settling — on the same screen they say opposite things. (Corrected 2026-09-10: an earlier draft said the design had no tab rail. It has one; the query that reported otherwise had read a partly-loaded Figma page.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51836-240081) · [Live page](https://smile-admin-dev.mosje.in/master-setting)

### The Geography table gains a row-number column and an Actions column

`SMB-SA-MASTER-002` · **Minor** · Components & States · Scope: Master Settings

| | |
|---|---|
| **Design says** | Three columns: State Code, State Name, Local Name. |
| **Build does** | Five: #, State Code, State Name, Local Name, Actions. |
| **Fix** | Confirm both additions and add them to the design frame. A row number and an edit action are reasonable on a master list; they simply are not specified anywhere yet. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51836-240081) · [Live page](https://smile-admin-dev.mosje.in/master-setting)

## Rehab Data

### Gender and Age are not in the build, and the build adds a column of its own

`SMB-SA-REHAB-001` · **Major** · Components & States · Scope: Rehab Data

| | |
|---|---|
| **Design says** | Seven columns: Beneficiary Name, Gender, Age, Type, Category/Specify, State/District, Follow-UP Status. |
| **Build does** | Gender and Age are absent. 'Beneficiary Name' is shortened to 'Beneficiary', and a 'Captured On' column is added that the design does not have. |
| **Fix** | Restore Gender and Age — on a rehabilitation register they are the two fields the design put first after the name. Keep the full 'Beneficiary Name' label, and add 'Captured On' to the design if it is staying. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51742-166982) · [Live page](https://smile-admin-dev.mosje.in/comprehensive-rehab/data)

## Shelter Occupants

### The designed Actions column is not built, and the design frame hides seven columns outside itself

`SMB-SA-SHELTEROCC-001` · **Major** · Components & States · Scope: Shelter Occupants

| | |
|---|---|
| **Design says** | Five columns render inside the 1440 frame — Beneficiary Name, Beneficiary ID, Beneficiary Type, Facility Status, Actions — and seven more sit OUTSIDE it at x=1274 to x=2849 (a second Actions, Gender, Age, Survey Location, State, Shelter Home Name, Shelter Home Type), along with a five-figure KPI strip. Nothing outside the frame renders, so a developer opening this frame sees five columns. |
| **Build does** | Twelve columns: S.No., Beneficiary ID, Beneficiary Name, Gender, Age, Survey Location, Survey Date, State, Swashraya (Shelter Home) Type, Beneficiary Type, Swashraya (Shelter Home) Name, Facility Status. Most of them match the design's hidden set. Actions is not among them, so there is no per-row action at all. |
| **Fix** | Two jobs. Bring the seven stray columns and the KPI strip inside the frame so the design says what it means, and build the Actions column or drop it deliberately. (Corrected 2026-09-10: an earlier draft read the frame as specifying five columns. It specifies twelve; seven of them are drawn where they cannot be seen.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51712-164958) · [Live page](https://smile-admin-dev.mosje.in/shelter-homes/beneficiaries)

### Three design frames carry content outside their own canvas, where it cannot be seen

`SMB-SA-SHELTEROCC-002` · **Major** · Layout & Spacing · Scope: Shelter Occupants

| | |
|---|---|
| **Design says** | Shelter Occupants holds seven table columns and a five-figure KPI strip at x=1274–2849; Rehab Data holds Status and District at x=1519 and x=1794; Skill & Training holds Status and District at x=1540 and x=1805. The frames are 1440 wide, so none of it renders — it is invisible in the exported frame, in Dev Mode, and in any screenshot taken from Figma. |
| **Build does** | The build shows most of those columns, which is how they were found: the build was reading a specification the design frame does not display. |
| **Fix** | Move the stray content inside the frame, or delete it if it is superseded. Anything a developer cannot see is not a specification. This is a design-file defect, not a build one. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51712-164958) · [Live page](https://smile-admin-dev.mosje.in/shelter-homes/beneficiaries)

## Sign In

### A second typeface appears on the sign-in screen

`SMB-AUTH-001` · **Major** · Typography · Scope: Sign In

| | |
|---|---|
| **Design says** | Every string on the designed sign-in frames is Noto Sans. |
| **Build does** | Four elements render in Plus Jakarta Sans — the 'Log in to your account' heading, the Log In button, 'Implementing Agency?' and 'Sign in with OTP' — measured on the live page. Everything around them is Noto Sans, so the panel is set in two typefaces at once. |
| **Fix** | Set all four to Noto Sans. The estate mandates it on every government property, and this is the first screen anyone sees. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8383-55268) · [Live page](https://smile-admin-dev.mosje.in/login)

### The SAMAVESH wordmark is little over half the size the design draws

`SMB-AUTH-002` · **Major** · Typography · Scope: Sign In

| | |
|---|---|
| **Design says** | 56px Bold. |
| **Build does** | 30px. The lock-up is the largest thing on the designed screen and is no longer. |
| **Fix** | Set the wordmark to 56px Bold. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8383-55268) · [Live page](https://smile-admin-dev.mosje.in/login)

### Forgot Password is a third smaller and a different colour

`SMB-AUTH-003` · **Major** · Typography · Scope: Sign In

| | |
|---|---|
| **Design says** | 18px Medium in the ink colour #1f2937. |
| **Build does** | 13px Medium in the primary navy #003366. |
| **Fix** | Set it to 18px. If it should read as a link rather than as text, that is a design decision to make in the frame — the build should not decide it alone. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8383-55268) · [Live page](https://smile-admin-dev.mosje.in/login)

### The hero tagline and strapline are both a size down

`SMB-AUTH-005` · **Minor** · Typography · Scope: Sign In

| | |
|---|---|
| **Design says** | 'Justice. Equality. Dignity.' 28px Medium; the strapline beneath it 16px Regular. |
| **Build does** | 24px Bold and 14px Regular. |
| **Fix** | Restore 28px Medium and 16px Regular. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8383-55268) · [Live page](https://smile-admin-dev.mosje.in/login)

### Every line of the Signing into block is smaller than drawn

`SMB-AUTH-006` · **Minor** · Typography · Scope: Sign In

| | |
|---|---|
| **Design says** | SIGNING INTO 12px Medium, 'SMILE Beggary' 20px Bold, the description 14px Regular. |
| **Build does** | 10px, 16px and 11px. The label also reads 'Signing into' rather than the design's uppercase SIGNING INTO. |
| **Fix** | Restore 12 / 20 / 14 and settle the capitalisation in the frame. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8383-55268) · [Live page](https://smile-admin-dev.mosje.in/login)

### Both field labels are smaller, heavier and a different grey

`SMB-AUTH-007` · **Minor** · Typography · Scope: Sign In

| | |
|---|---|
| **Design says** | 'Email or Mobile Number' and 'Password' are 14px Medium in #1f2937. |
| **Build does** | 13px SemiBold in #334155. |
| **Fix** | Set both to 14px Medium #1f2937. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8383-55268) · [Live page](https://smile-admin-dev.mosje.in/login)

### Two controls are in the build that the design does not draw

`SMB-AUTH-008` · **Minor** · Components & States · Scope: Sign In

| | |
|---|---|
| **Design says** | The form is: two fields, Forgot Password, Log In, then the Implementing Agency link. |
| **Build does** | The build adds a 'Remember me' checkbox and an 'OR' divider above the Implementing Agency link, plus a version and build stamp in the bottom corner. |
| **Fix** | Confirm all three are intended. If they are, add them to the frame — a checkbox that stores a sign-in preference is a design decision, not an implementation detail. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8383-55268) · [Live page](https://smile-admin-dev.mosje.in/login)

## City Profiling — district list

### The district list gains the same two fund cards as the state list, and loses its table card

`SMB-SA-CITYL2-001` · **Minor** · Components & States · Scope: City Profiling — district list

| | |
|---|---|
| **Design says** | Three KPI cards (Cities Selected, Total Identified, Total Rehabilitated), and the table sits in a bordered card with a tinted, rounded header band. |
| **Build does** | Five KPI cards — Fund Disbursed and Fund Utilised are added, as on the state list — and the table has no card border and a flat header band. City names are underlined links where the design draws them as plain navy. |
| **Fix** | Same decision as the state list (S25): add the two cards to the design or drop them. Restore the table's card and its header band. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51891-441685) · [Live page](https://smile-admin-dev.mosje.in/city-profiling/1)

## Consent Forms

### Submitted On and Action are off the right-hand edge of the screen

`SMB-SA-CONSENT-001` · **Minor** · Components & States · Scope: Consent Forms

| | |
|---|---|
| **Design says** | Six columns end at Submitted On, the last of them finishing inside the 1440 frame. |
| **Build does** | Eight columns run to x=1630. Document is the last one fully visible; Submitted On starts at x=1418 and Action at x=1548, so both sit outside the 1440 viewport and are reachable only by scrolling the table sideways. (Corrected 2026-09-10: an earlier draft said Submitted On was not built at all. It is built — it is off-screen, which is why it was missed.) |
| **Fix** | Fit the columns inside the viewport. A consent record whose date cannot be seen without a sideways scroll is the same problem as one with no date. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51873-194809) · [Live page](https://smile-admin-dev.mosje.in/consent)

### Agency names are drawn as links where the design has plain text

`SMB-SA-CONSENT-002` · **Minor** · Color & Token · Scope: Consent Forms

| | |
|---|---|
| **Design says** | The Implementing Agency / NGO value is plain body text in #1f2937, like every other cell. |
| **Build does** | The value is a link in the primary navy #003366. Nothing else in the row is a link, and the column gives no indication of where the link goes. (Corrected 2026-09-10: an earlier draft called the link orange. Measured, it is #003366.) |
| **Fix** | Decide whether the agency name opens anything. If it does, keep the navy and give it an affordance a reader can see; if it does not, set it as body text. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51873-194809) · [Live page](https://smile-admin-dev.mosje.in/consent)

## Create New Role

### The dialog's field labels are uppercase 11px grey without their required markers

`SMB-SA-NEWROLE-001` · **Minor** · Typography · Scope: Create New Role

| | |
|---|---|
| **Design says** | 'Role Name *' and 'Description *' in Title Case, dark, with a red asterisk. |
| **Build does** | 'ROLE NAME' and 'DESCRIPTION' in 11px uppercase grey, no asterisk, though both fields are still required. |
| **Fix** | Set the two labels to Title Case at the label size in the body colour and restore the asterisks. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51661-158685) · [Live page](https://smile-admin-dev.mosje.in/roles)

### The dialog has no close control

`SMB-SA-NEWROLE-002` · **Minor** · Components & States · Scope: Create New Role

| | |
|---|---|
| **Design says** | An × sits in the top-right corner of the dialog. |
| **Build does** | There is no ×. The only ways out are Cancel and the Escape key, and Escape is not signposted. |
| **Fix** | Add the × to the dialog header. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51661-158685) · [Live page](https://smile-admin-dev.mosje.in/roles)

### The guidance note loses its panel

`SMB-SA-NEWROLE-003` · **Nit** · Color & Token · Scope: Create New Role

| | |
|---|---|
| **Design says** | 'After creating the role you'll be redirected to the permission picker' sits in a pale amber panel, so it reads as a consequence of pressing the button. |
| **Build does** | The same sentence is plain grey text with a small information icon, level with the field labels around it. |
| **Fix** | Restore the amber panel. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51661-158685) · [Live page](https://smile-admin-dev.mosje.in/roles)

## Notifications

### The empty state sits under a full twelve-column table header

`SMB-SA-NOTIF-001` · **Minor** · Components & States · Scope: Notifications

| | |
|---|---|
| **Design says** | The empty card stands alone under the filters, with no header row above it. |
| **Build does** | The full header row is drawn above the empty card, and its twelve labels wrap onto two lines. |
| **Fix** | Hide the column header when there are no rows, as the design does, so the empty state reads as an answer rather than a broken table. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51830-237991) · [Live page](https://smile-admin-dev.mosje.in/notifications)

## Onboard New User

### Last Name is marked required in the design and not in the build

`SMB-SA-ADDUSER-001` · **Minor** · Components & States · Scope: Onboard New User

| | |
|---|---|
| **Design says** | All five fields carry a red asterisk: Full Name, Last Name, Email Address, Contact Number, Select Role. |
| **Build does** | Four carry one; Last Name does not, so the form does not say whether it is mandatory until submit. (The four labels are also worded differently — Full Name / Email Address / Contact Number against First Name / Email ID / Mobile Number — but wording is content and is not raised in this report.) |
| **Fix** | Mark Last Name required, or make the design agree that it is optional. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-52311) · [Live page](https://smile-admin-dev.mosje.in/users/onboard)

### The form card is two-thirds the designed width and centred

`SMB-SA-ADDUSER-002` · **Minor** · Layout & Spacing · Scope: Onboard New User

| | |
|---|---|
| **Design says** | The card spans the content column, about 1090px wide, with the two field columns at x=349 and x=880. |
| **Build does** | About 730px wide and centred, so the first field starts 190px further right and the card leaves a wide empty margin on both sides. |
| **Fix** | Let the form card fill the content column as the design does. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-52311) · [Live page](https://smile-admin-dev.mosje.in/users/onboard)

### The BASIC DETAILS section header is not in the build

`SMB-SA-ADDUSER-003` · **Minor** · Components & States · Scope: Onboard New User

| | |
|---|---|
| **Design says** | A small-caps 'BASIC DETAILS' label with a hairline rule runs across the top of the card. |
| **Build does** | The card opens straight onto the first field. |
| **Fix** | Restore the section header. It is the only thing naming the group, and the same pattern is used on the shelter-home form. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-52311) · [Live page](https://smile-admin-dev.mosje.in/users/onboard)

## Performance Statistics

### The KPI card lost its tinted header band and its blue outline

`SMB-SA-PERF-001` · **Minor** · Color & Token · Scope: Performance Statistics

| | |
|---|---|
| **Design says** | Each card has a pale blue band across the top carrying 'KPI n' and the KPI's name in navy, with the icon plain in the corner, and the card itself is outlined in blue. |
| **Build does** | The header band is white and the card is outlined in the neutral grey used by every other card on the estate; the icon has gained a filled rounded tile. The name and description are present, as designed. |
| **Fix** | Restore the tinted header band and the blue outline. They are what separate a KPI scorecard from an ordinary content card at a glance. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51563-156833) · [Live page](https://smile-admin-dev.mosje.in/performance-stats)

## Skill & Training

### Three build columns are in no design, and two more are drawn outside the frame

`SMB-SA-SKILL-001` · **Minor** · Components & States · Scope: Skill & Training

| | |
|---|---|
| **Design says** | Seven columns render: Beneficiary ID, Beneficiary Name, Gender, Age, Duration of Skill and Training, Skill and Training Type, Survey Location. Two more — Status and District — sit outside the 1440 frame at x=1540 and x=1805, where they do not render. |
| **Build does** | Twelve: the designed seven, the two strays, plus S.No., Shelter Name and State, which are in no design at all. |
| **Fix** | Bring Status and District inside the frame, and confirm S.No., Shelter Name and State. Twelve columns at 1440 is what pushes this table into horizontal scrolling. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51742-164435) · [Live page](https://smile-admin-dev.mosje.in/comprehensive-rehab/skill-training)

### Two column headers sit ten pixels above the rest of the header row — in the DESIGN

`SMB-SA-SKILL-002` · **Nit** · Layout & Spacing · Scope: Skill & Training

| | |
|---|---|
| **Design says** | 'Duration of Skill and Training' and 'Skill and Training Type' are drawn at y=362 while Beneficiary ID, Beneficiary Name, Gender and Age are at y=372: the two long labels wrap to a second line and are top-aligned where the short ones are not. |
| **Build does** | The build's header cells all share one baseline. |
| **Fix** | The build is right. Align the design's header cells to one baseline so the frame stops disagreeing with itself. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51742-164435) · [Live page](https://smile-admin-dev.mosje.in/comprehensive-rehab/skill-training)

## Users

### View Catalog sits on a different screen from the one the design puts it on

`SMB-SA-USERS-001` · **Minor** · Components & States · Scope: Users

| | |
|---|---|
| **Design says** | Users carries two header actions: a secondary 'View Catalog' and the primary 'Onboard New User'. |
| **Build does** | On Users that slot holds CSV and PDF instead. View Catalog is NOT missing from the build — it is on the ROLES screen, in the same header position (x=1154, y=158), on both super-admin and central-authority. The Roles design frame does not show it there. |
| **Fix** | Confirm which screen owns View Catalog. If Users is right per the design, move it back and add it to the Roles frame's removal; if Roles is right, update both design frames to match. (Corrected 2026-09-10: an earlier draft of this finding said the action was absent from the build. It is not — it is on another screen.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### The Name column lost its emphasis

`SMB-SA-USERS-002` · **Minor** · Typography · Scope: Users

| | |
|---|---|
| **Design says** | The person's name is set semibold, which is what lets a reader scan the column. |
| **Build does** | The name is set at the same weight as every other cell. |
| **Fix** | Set the Name cell to weight 600, matching the design and the body-2-semibold style the variables publish. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

### The Users table has a blue header band that no other table has

`SMB-SA-USERS-003` · **Minor** · Color & Token · Scope: Users

| | |
|---|---|
| **Design says** | The header row sits on #f9fafb, the same near-white as every other list screen. |
| **Build does** | It sits on #b7ccf3, a mid blue. Measured on all six list screens captured: Consent Forms, Beneficiary List, Shelter Occupants, Rehab Data and Master Settings are all #f9fafb; only Users is blue. Its header is also 14px where most are 12px (G04). |
| **Fix** | Set the Users header band to #f9fafb. One list screen styled differently from the other sixteen is the clearest sign a table component was forked. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-51029) · [Live page](https://smile-admin-dev.mosje.in/users)

## Roles

### Role cards gained a tinted header band

`SMB-SA-ROLES-001` · **Nit** · Color & Token · Scope: Roles

| | |
|---|---|
| **Design says** | The card header is white: icon, role name, and an Active chip on the right. |
| **Build does** | The header sits on a tinted band, and the chip reads ACTIVE in uppercase. |
| **Fix** | Confirm the band. If it stays, draw it in the design and keep the chip in Title Case. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=8664-52367) · [Live page](https://smile-admin-dev.mosje.in/roles)

## Surveyor Mappings

### Two KPI labels are cut off in the DESIGN, not the build

`SMB-SA-SURVEYORS-001` · **Nit** · Content & Iconography · Scope: Surveyor Mappings

| | |
|---|---|
| **Design says** | The design frame reads 'Total Mapping' and 'Distinct Survey'. |
| **Build does** | The build reads 'Total Mappings' and 'Distinct Surveyors' — the complete words. |
| **Fix** | The build is right and the design frame is truncated. Fix the Figma labels so this does not get reported as a build defect at the next review. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=51699-165683) · [Live page](https://smile-admin-dev.mosje.in/surveyor-mapped)

---
## Withdrawn on re-checking, not raised, and notes on the design file

Nothing here is a finding. Each was either raised in an earlier round and did not survive re-checking, ruled out of scope, or is a defect in the handoff file rather than the build. They stay visible, with the reason, so a reviewer who saw one learns the outcome rather than wondering where it went.

- **No accessibility statement is published** - Policy, not a design difference — no accessibility statement in EITHER the design or the build. Raised with the GIGW compliance work instead.
- **The build carries two filters the design does not** - Filters — folded into the single global note.
- **The breadcrumb puts Consent Forms under Access Control** - Content — same class as G17: the breadcrumb's parent label.
- **The date-range filter is not in the build** - Filters — folded into the single global note.
- **The filters are not the ones the design specifies** - Filters — folded into the single global note.
- **The footer year differs between design and build** - Content — the footer year (2025 in the design, 2026 in the build).
- **The password placeholder is worded differently** - Content — the password placeholder wording.
- **Portal names in the drawer are orange** - WITHDRAWN — the portal names are orange in the design too, so there is no difference.
- **The breadcrumb names a different section from the design on nearly every screen** - Content — which section name the breadcrumb uses is a vocabulary decision, not a design defect.
- **The screen has one name in the design and a different one in the build** - Content — the screen is called 'Shelter Occupants' in the design and 'Swashraya (Shelter Home) Persons' in the build. A naming decision.
- **Four column headers are worded differently from the design** - Content — four column headers worded differently.
- **The page is called Roles in the design and Role Management in the build** - Content — the page is called Roles in the design and Role Management in the build.
- **The KPI row lost its shared container** - WITHDRAWN — the build has the shared KPI container after all.
