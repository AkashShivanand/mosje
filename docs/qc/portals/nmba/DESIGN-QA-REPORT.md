# NMBA — Nasha Mukt Bharat Abhiyaan (DEV) · Design QC Report

**Build:** nmba-user-dev.mosje.in and nmba-admin-dev.mosje.in, captured 11 September 2026 · **Design:** [MoSJE Portal Handoff → *NMBA (Dev Synced — August)*](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=2136-20193)  
**Status:** ready for review — a human still owes the keyboard and screen-reader pass.

**Also published as:** the PDF beside this file, the `NMBA` sheet in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`, and in Figma as a [review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50891-4319).

---

## Summary

| | |
|---|---|
| Screens captured | **50** across the citizen site, the sign-in surface and three admin roles |
| Design frames paired one to one | 35 |
| Findings | **31** — 3 Blocker, 13 Major, 9 Minor, 6 Nit |
| Applies to every screen | 16 |
| Specific to one screen | 15 |
| Withdrawn, not raised, or noted about the design file | 11 |

The NMBA design page (‘NMBA — Dev Synced — August’) compared against the live dev build at a locked 1440 viewport, screen by screen, for the citizen site, the sign-in surface and three admin roles — Admin, State Nodal Officer and District Nodal Officer. 50 screens were captured and 35 design frames paired one to one. Only differences between the design and the build are raised. Copy, wording, naming and policy are out of scope for this report, and the filter sets are covered by a single global note rather than screen by screen. Every finding carries a design box and a build box, and was checked against a 1:1 crop of both sides before publication.

**Where to start.** The findings with the widest reach or the highest severity:

1. **Sidebar navigation labels fail AA contrast** — `NMB-GLOBAL-001` · Blocker
2. **The GIGW accessibility toolset is missing from the masthead** — `NMB-GLOBAL-002` · Blocker
3. **The whole 'My Submissions' section is not built** — `NMB-SCREEN-023` · Blocker
4. **Admin sidebar navigation icons are absent** — `NMB-GLOBAL-003` · Major
5. **The ministry lockup drops its third line and changes colour** — `NMB-GLOBAL-004` · Major

---

## Findings that apply to every screen

Each has its own board in the PDF, showing the design and the build side by side with the marker on the element in question.

### Sidebar navigation labels fail AA contrast

`NMB-GLOBAL-001` · **Blocker** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Every navigation label is #1F2937 on white - about 14.7:1 - and the selected item is #003366 on a #E5EFF9 pill. Measured on the admin sidebar's own text nodes. |
| **Build does** | Every unselected navigation label is #9CA3AF on #FFFFFF. That is 2.54:1, where WCAG 2.2 AA requires 4.5:1 for text this size. It reads as a disabled control, and it is the same in the citizen shell and in all three admin roles. |
| **Fix** | Set the unselected label to the design's #1F2937. If a quieter resting state is wanted, #4B5563 is the lightest neutral in the token set that still clears 4.5:1 on white; #9CA3AF cannot be used for text on white at any size. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### The GIGW accessibility toolset is missing from the masthead

`NMB-GLOBAL-002` · **Blocker** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The blue government bar carries the mandated inline set: A- / A / A+ text-size controls with the current size shown selected, a contrast toggle, an accessibility icon, and a globe with the language named in words ('English'). |
| **Build does** | The bar carries only an accessibility glyph, which opens a third-party panel, and a bare two-script glyph for language. The text-size controls and the contrast toggle are not present anywhere on the page. |
| **Fix** | Restore the inline A- / A / A+ and contrast controls in the government bar, and label the language control with the language name as the design does. GIGW 3.0 treats this set as a masthead requirement, so its absence is a compliance gap on every screen, not a styling preference. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### Admin sidebar navigation icons are absent

`NMB-GLOBAL-003` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Every admin navigation item pairs a 24px Material Symbols icon at #003366 with its label - widgets, event, group_add, article_shortcut, task and so on - and the icon sits 32px from the panel edge. |
| **Build does** | The admin sidebar draws label-only rows with a thin tree-branch connector line in the icon's place. No item has an icon. The citizen shell DOES carry its icons, so the two shells disagree with each other as well as with the design. |
| **Fix** | Add the navigation icon to each admin sidebar item, using the same Material Symbols set and #003366 the citizen shell already uses, and drop the connector line the design does not have. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### The ministry lockup drops its third line and changes colour

`NMB-GLOBAL-004` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Three lines, all #1F2937: 'Government of India' at 12px Medium, 'Ministry of Social Justice & Empowerment' at 14px Medium, and 'Department of Social Justice & Empowerment' at 20px Bold as the emphasised line. |
| **Build does** | Two lines at #374151: 'Government of India' at 12px Medium, and 'Ministry of Social Justice & Empowerment' promoted to 20px Bold. The Department line is not rendered. The sign-in page does draw all three, so the authenticated shell also disagrees with the portal's own login screen. |
| **Fix** | Render the third line and set the lockup to #1F2937, matching the sign-in page and the design. The emphasised line is the Department, not the Ministry. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### Row action controls lose their button and change colour

`NMB-GLOBAL-005` · **Major** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Row actions are bordered icon-buttons - a light 1px outline, radius 6, the edit glyph at #003366 and the delete glyph at #EC5042 - sized as real click targets. |
| **Build does** | The actions are bare glyphs with no button around them, and the edit glyph is drawn at #E08020, an amber that appears nowhere in the NMBA token set. On the four NAPDDR committee screens the same actions become three outlined TEXT buttons instead (View / Edit / Delete). |
| **Fix** | Restore the bordered icon-button and set the edit glyph to #003366. Use one row-action component across the portal rather than icon-buttons on some screens and text buttons on others.  (Anchor: The row-action controls are icon-only buttons with no text node, so the extraction does not record them. The box is measured off the capture at the Actions column, x1305-1425 on the first data row, where the two glyphs are drawn.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### Previous and next are a hyphen and a plus sign

`NMB-GLOBAL-006` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The pager runs a left chevron, the page numbers with the current one in a rounded outlined chip, an ellipsis, the last page, and a right chevron. |
| **Build does** | The two step controls render as '-' and '+'. A minus and a plus read as decrease and increase, not as previous and next page, and there is no ellipsis or last-page number. |
| **Fix** | Use the chevrons the design specifies for the step controls, and show the ellipsis and last page so a reader can tell how long the list is. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52092-136433) · [Live page](https://nmba-admin-dev.mosje.in/napddr/state-committee)

### Table row height is inconsistent across the portal

`NMB-GLOBAL-009` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Table rows are a steady 45-55px throughout, so a list reads the same on every screen. |
| **Build does** | Measured row heights run 41px on User Management, 53px on most lists, 57px on Important Documents, 65px on the NAPDDR screens, 85px on Best Practices and 153px on the Ministries dashboard - the same component at more than three times the height from one screen to the next. Header rows vary too, from 38px to 85px. |
| **Fix** | Set one row height for the table component and let it apply everywhere; where a cell wraps to two lines, let the row grow from that one value rather than redefining it per screen. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52051-161871) · [Live page](https://nmba-admin-dev.mosje.in/ministries-dashboard)

### Dropdowns are the browser's own select, not the design system's

`NMB-GLOBAL-007` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Every dropdown is the design-system select: a rounded bordered field with its own chevron and the label at 14px #1F2937. |
| **Build does** | The rows-per-page control, the facility filter and the three activity filters render as an unstyled native <select> with the operating system's chevron and its own border radius, so they look different on every browser and different from every other control on the page. |
| **Fix** | Skin these with the design-system select so their border, radius, type and chevron match the rest of the interface.  (Anchor: The control IS a native <select> and it carries no text node of its own - its value is rendered by the browser. The box is the select's own measured rect (x1271 y567, 63x31) from the capture.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52092-136433) · [Live page](https://nmba-admin-dev.mosje.in/napddr/state-committee)

### The search magnifier is missing, or sits on the wrong side

`NMB-GLOBAL-008` · **Minor** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Every search field carries a magnifier inside its left edge, ahead of the placeholder. |
| **Build does** | The magnifier is absent on User Management, the Ministries dashboard, all four NAPDDR screens and Facilities, and on Important Documents it is drawn inside the RIGHT edge instead. So the same control differs from screen to screen as well as from the design. |
| **Fix** | Put the magnifier inside the left edge of every search field, as the design does. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52070-443098) · [Live page](https://nmba-admin-dev.mosje.in/important-documents)

### Table cell text is lighter than the design

`NMB-GLOBAL-010` · **Minor** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Cell values are #1F2937, the same near-black the rest of the body copy uses. |
| **Build does** | Cell values are #4B5563. It still clears AA, but it makes the data quieter than its own column headers, which the design does not do. |
| **Fix** | Set cell values to #1F2937 and leave #4B5563 for secondary lines inside a cell. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### The page title is a lighter grey than the design

`NMB-GLOBAL-011` · **Minor** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The page title is 24px SemiBold #1F2937. |
| **Build does** | The page title is 24px 600 #374151 - the right size and weight, a lighter colour. |
| **Fix** | Set the page title to #1F2937. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### KPI icon tiles use a pink tint that is not a token

`NMB-GLOBAL-012` · **Minor** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Every KPI icon sits on a 32px tile filled #E5EFF9 - Primary/50 - at radius 10, so the row of cards reads as one set. |
| **Build does** | The tiles are tinted per card, and the tint used for 'Important Documents' measures #FDE8EF, a pink that is in no NMBA token. On the district dashboard the same row mixes pink, blue and amber tiles for metrics that carry no status meaning. |
| **Fix** | Fill every KPI icon tile with #E5EFF9. Reserve a coloured tint for a metric that genuinely signals a state, and take the tint from the token set when you do.  (Anchor: The icon tile is an SVG on a filled div with no text, so the extraction records neither. The tile's fill was sampled from the capture at x590-650 y240-290 and measures #FDE8EF against the design's #E5EFF9.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=2309-14405) · [Live page](https://nmba-admin-dev.mosje.in/dashboard)

### The KPI value is 30px, which is not on the type scale

`NMB-GLOBAL-013` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The KPI value is 32px SemiBold #003366 - the top step of the published scale. |
| **Build does** | The KPI value is 30px. The scale runs 24, 28, 32; 30 is not a step on it, so this number is the only type size in the portal that no token can express. |
| **Fix** | Set the KPI value to 32px. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=2309-14405) · [Live page](https://nmba-admin-dev.mosje.in/dashboard)

### The KPI label is a lighter grey than the design

`NMB-GLOBAL-014` · **Nit** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The KPI label is 14px SemiBold #374151. |
| **Build does** | The KPI label is 14px 600 #6B7280. |
| **Fix** | Set the KPI label to #374151. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=2309-14405) · [Live page](https://nmba-admin-dev.mosje.in/dashboard)

### The selected navigation item is a tighter pill in a heavier weight

`NMB-GLOBAL-015` · **Nit** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The selected item is a 48px-tall pill at radius 16 filled #E5EFF9, its label at 14px Regular #003366 - the same weight as every other item, distinguished by the fill alone. |
| **Build does** | The selected item is a 36px-tall pill at radius 10, and its label is set Bold. Weight and shape both change where the design changes only the fill. |
| **Fix** | Match the pill to radius 16 and the item height to the design, and keep the selected label at the same weight as the rest. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### Use the relevant filter options and follow the design

`NMB-GLOBAL-031` · **Nit** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Several screens draw more filters than the build offers - the citizen dashboard's State and District selects, the admin list screens' 'All States/UTs', the officer dashboard's four-filter row. |
| **Build does** | This is raised once, as a note: show the filters each screen actually needs and style them as the design does. It is not repeated as a finding on each screen. |
| **Fix** | This is raised once, as a note: show the filters each screen actually needs and style them as the design does. It is not repeated as a finding on each screen. |

---

## Findings specific to one screen

## Officer dashboards (State and District)

### The whole 'My Submissions' section is not built

`NMB-SCREEN-023` · **Blocker** · Layout & Spacing · Scope: Officer dashboards (State and District)

| | |
|---|---|
| **Design says** | Below the metric cards the dashboard carries its main working area: a 'My Submissions' heading, an Export control and an 'Add Event' primary button, a search field, four filters including a date range, a table of submissions with view / edit / delete on every row, and pagination. |
| **Build does** | The page ends after the metric cards. None of the section is present, on either the State Nodal Officer or the District Nodal Officer dashboard, so neither officer can see or add a submission from the screen the design makes their home. |
| **Fix** | Build the section as designed on both dashboards. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=2309-14405) · [Live page](https://nmba-admin-dev.mosje.in/dashboard)

## Admin, State and District shells

### Two footer links land on the dashboard instead of their own page

`NMB-SCREEN-026` · **Major** · Components & States · Scope: Admin, State and District shells

| | |
|---|---|
| **Design says** | The design has no 'About Us' or 'Contact Us' page inside the authenticated shell; these are citizen-site destinations. |
| **Build does** | In the admin shell /about-us and /contact-us both render a page that is byte-for-byte identical to the dashboard - verified by checksum on all three admin roles. A reader who follows either link is silently returned to the dashboard with no indication that the page they asked for does not exist. |
| **Fix** | Point these links at the citizen site's pages, or give the shell a not-found state. A route with no page should say so rather than substituting the landing screen.  (Anchor: This finding is about which page a route serves, so there is no single control to anchor to; the anchor is the page title that proves it - /about-us renders the heading 'Dashboard'.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

## Citizen - Activity Snapshots

### The activity card has no title and no description

`NMB-SCREEN-018` · **Major** · Components & States · Scope: Citizen - Activity Snapshots

| | |
|---|---|
| **Design says** | Each card carries five things: the type chip at 11px, the activity title at 16px Medium #1F2937, a two-to-three line description at 12px, then the location and the date. |
| **Build does** | Each card carries three: the type as a chip, the location and the date. The activity's own title and its description are not rendered, so the card's only heading is the category it belongs to. |
| **Fix** | Render the activity title and its description between the chip and the location line, at the sizes the design specifies. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-58966) · [Live page](https://nmba-user-dev.mosje.in/activities)

## Citizen - Help Centres & Facilities

### The facility card has lost its 'Call Now' action and its service tags

`NMB-SCREEN-019` · **Major** · Components & States · Scope: Citizen - Help Centres & Facilities

| | |
|---|---|
| **Design says** | Each facility card ends with two buttons side by side - 'Get Directions' filled #003366 and 'Call Now' white with a #003366 outline - above which sit the service tags as small pills (Inpatient Treatment, Outpatient Counseling, Detoxification, Rehabilitation). |
| **Build does** | 'Call Now' is not present and 'Get Directions' stretches the full width of the card in its place. The service tag pills are not rendered either, so a reader cannot see what a centre offers without opening it. |
| **Fix** | Restore the second action beside 'Get Directions' and the service tag pills above the buttons. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-58585) · [Live page](https://nmba-user-dev.mosje.in/facilities)

### Facility names are set in capitals

`NMB-SCREEN-020` · **Minor** · Typography · Scope: Citizen - Help Centres & Facilities

| | |
|---|---|
| **Design says** | The facility name is Title Case at 16px SemiBold #1F2937. |
| **Build does** | The facility name is uppercased. At this length a name in capitals is measurably slower to read, and no other name in the portal is set this way. |
| **Fix** | Remove the uppercase transform and set the name Title Case as the design does. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-58585) · [Live page](https://nmba-user-dev.mosje.in/facilities)

### The facility-type chip is filled with a colour that is not a token

`NMB-SCREEN-021` · **Minor** · Color & Token · Scope: Citizen - Help Centres & Facilities

| | |
|---|---|
| **Design says** | The type chip is filled #C8E6C9 with an #81C784 border and its label in #27682A at 11px - the green the token set publishes - and the type is what the colour encodes, so a hospital chip is blue and a de-addiction centre chip is green. |
| **Build does** | Every type chip is filled #EDE7F6, a lavender that appears in no NMBA token, and the same fill is used for every facility type, so the colour no longer tells a reader what kind of centre it is. |
| **Fix** | Fill the chip from the token set and keep one colour per facility type as the design does. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-58585) · [Live page](https://nmba-user-dev.mosje.in/facilities)

### The facility map opens on a whole-subcontinent view

`NMB-SCREEN-028` · **Nit** · Layout & Spacing · Scope: Citizen - Help Centres & Facilities

| | |
|---|---|
| **Design says** | The map opens framed on the area the facilities are in, close enough to read street names, with the three results pinned in view. |
| **Build does** | The map opens zoomed out far enough to show Kabul, Colombo and Chengdu, with 722 pins clustered over India, so a reader has to zoom before the map tells them anything about their own district. |
| **Fix** | Frame the map on the results being listed - the reader's district, or the search area - rather than on the whole set. Raised as a confirm-if-intended: if a national overview is the deliberate default, say so and the design should show it that way.  (Anchor: The map is a canvas with no text node. The box is the map panel's measured rect on both sides.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-58585) · [Live page](https://nmba-user-dev.mosje.in/facilities)

## Citizen - Home

### The pledge banner has lost its call to action

`NMB-SCREEN-016` · **Major** · Components & States · Scope: Citizen - Home

| | |
|---|---|
| **Design says** | The green banner carries a white pill button reading 'Take the Pledge' with a right arrow, its label 14px Medium #003366, sitting at the right end of the banner. |
| **Build does** | The banner has the heading and the supporting line but no button at all, so the landing page's primary action is not on it. |
| **Fix** | Restore the button at the right of the banner, white fill with the label in #003366, as the design draws it.  (Anchor: The banner's own container has no text node. The box is measured off the capture at the right end of the green banner, where the design places the button.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-59117) · [Live page](https://nmba-user-dev.mosje.in/)

### The 'Number of Programmes' section is not built

`NMB-SCREEN-017` · **Major** · Layout & Spacing · Scope: Citizen - Home

| | |
|---|---|
| **Design says** | Below the metric cards the design carries a titled section of four grouped cards - Education & Youth, Community Outreach, Governance & Local Bodies, Targeted Interventions - each with an icon and its figures colour-coded to the group (#1558B0, #2E7D32, #BB772B, #EC5042) at 28px SemiBold. |
| **Build does** | The section is absent. The page goes from the metric cards straight to a state-wise bar chart that the design does not carry. |
| **Fix** | Build the four programme-group cards as designed. If the bar chart is meant to replace them, that is a decision to take back to the design rather than a substitution to leave in place. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-59117) · [Live page](https://nmba-user-dev.mosje.in/)

### The citizen masthead is a different component from the one designed

`NMB-SCREEN-027` · **Minor** · Components & States · Scope: Citizen - Home

| | |
|---|---|
| **Design says** | The right of the citizen masthead holds a signed-in user block: the name at 16px SemiBold #1F2937, the email beneath it at 13px #374151, and a 48px initials avatar filled #C8DBF0. |
| **Build does** | The build shows a green National Deaddiction Helpline badge carrying the 14446 number, and a 'Nasha Mukti Mitr Login' button. There is no user block, because the citizen site has no signed-in state. So the design assumes a citizen session the build does not have. |
| **Fix** | Decide which is right and make both sides agree: either the citizen site gains the signed-in block the design draws, or the design is updated to the helpline-and-login masthead the build ships. Raised because the two disagree, not because the build is necessarily wrong. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-59117) · [Live page](https://nmba-user-dev.mosje.in/)

## NAPDDR committee screens (all four)

### The breadcrumb is not rendered

`NMB-SCREEN-022` · **Major** · Layout & Spacing · Scope: NAPDDR committee screens (all four)

| | |
|---|---|
| **Design says** | Above the page title sits a breadcrumb - 'NAPDDR Three-Tier Committee > State-Level Committee' - at 12px, the trail a reader uses to get back up out of a nested section. |
| **Build does** | There is no breadcrumb on any of the four committee screens. The page title is the first thing under the masthead, so a reader three levels into the section has nothing to climb back with. |
| **Fix** | Render the breadcrumb above the title on all four committee screens. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52092-136433) · [Live page](https://nmba-admin-dev.mosje.in/napddr/state-committee)

## Sign in

### White text sits on an untinted photograph

`NMB-SCREEN-024` · **Major** · Color & Token · Scope: Sign in

| | |
|---|---|
| **Design says** | The left panel's photograph carries a navy tint, and the SAMAVESH lockup, the 'Justice. Equality. Dignity.' line and the paragraph beneath it read as white on that tint. |
| **Build does** | The photograph is drawn at full contrast with no tint, and the same white text sits directly on it. Over the lighter areas of the crowd the paragraph is close to unreadable, and the contrast a reader gets depends on which part of the picture a line happens to fall over. |
| **Fix** | Restore the navy tint over the photograph so the white text has a predictable ground, as the design specifies. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9884-112146) · [Live page](https://nmba-admin-dev.mosje.in/login)

### The sign-in fields have no visible labels

`NMB-SCREEN-025` · **Major** · Components & States · Scope: Sign in

| | |
|---|---|
| **Design says** | Every field in the design's sign-in panel carries a visible label above it - 'Project Id', 'Enter OTP' - with the placeholder used only for an example value. |
| **Build does** | The username and password fields carry no label at all; the only naming is the placeholder, which disappears the moment a reader types. The design has no frame for this tab, so it is audited against the pattern the design uses on every other field. |
| **Fix** | Add a visible label above each field and keep the placeholder for the example. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9884-112146) · [Live page](https://nmba-admin-dev.mosje.in/login)

## Important Documents (all roles)

### Status chips are not set in capitals

`NMB-SCREEN-029` · **Nit** · Typography · Scope: Important Documents (all roles)

| | |
|---|---|
| **Design says** | The status chip is uppercase at 11px - DRAFT, PUBLISHED - which is what separates it from ordinary cell text at a glance. |
| **Build does** | The chips read 'Draft' and 'Published' in sentence case, so they carry the same case as the data around them. |
| **Fix** | Apply the uppercase transform to the status chip. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52070-443098) · [Live page](https://nmba-admin-dev.mosje.in/important-documents)

### The row actions are in a different order

`NMB-SCREEN-030` · **Nit** · Layout & Spacing · Scope: Important Documents (all roles)

| | |
|---|---|
| **Design says** | The row actions run download, then edit, then delete. |
| **Build does** | They run edit, then download, then delete. The download control is the one a reader uses most on this screen and the design puts it first. |
| **Fix** | Order the row actions download, edit, delete as the design does. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52070-443098) · [Live page](https://nmba-admin-dev.mosje.in/important-documents)

---

## Withdrawn on re-checking, and not raised

Nothing here is a finding. Each was either carried in from the July 2026 pass or raised by the reviewer in an earlier round, and did not survive re-checking against the current design and build. They stay visible, with the reason, so a reviewer who saw them learns the outcome rather than wondering where they went.

- **KPI grid reflows to unequal card widths** — Measured on the capture: the three cards on the officer dashboard span 308-662, 688-1040 and 1066-1418 - 354, 352 and 352px with even 26px gaps, and the second row starts at the same two x positions. The grid is even. Withdrawn.
- **Sidebar navigation icons absent PORTAL-WIDE** — The citizen shell does carry its navigation icons; only the admin shell has none. The finding is kept but narrowed to the admin shell - see G03.
- **Page title is off the type scale** — The build's page title measures 24px at weight 600, which is exactly what the design specifies. Only the colour differs. Narrowed to a colour finding - see G11.
- **Admin screens are missing the footer strip** — Checked on both sides: NO admin, State Nodal Officer or District Nodal Officer DESIGN frame carries a footer either - 0 footer elements across all 31 of them, against 3 on every citizen frame. The build matches the design exactly. Not a discrepancy.
- **The sidebar expand/collapse icon does not match the design** — Cropped both sides at 1:1: the control is the same collapse glyph in the same place at the same size. Any difference is in how it behaves, which a static design QC cannot evidence - it belongs in a functional pass.
- **The facility filter is too wide** — Width and height vary with content and viewport, so they are not audited as defects here.
- **The side navigation lists different items from the design** — Which items a menu carries is information architecture and content, which this run was scoped to leave out. Recorded for the content pass.
- **The filter label reads 'All Facilities' where the design says 'All Facility Types'** — Wording. Out of scope for this run by instruction.

---

## Observations about the design file

These are defects in the handoff file itself, not in the build, and no developer can act on them. They are reported here because they affect what a reader of the handoff can see.

- **Seven frames draw content outside their own canvas** — Measured during the Phase-0 read: 44 text nodes sit outside the frame bounds on each of the Admin State/UT-District Events, State Nodal Officer Dashboard and District Nodal Officer Dashboard frames, 66 on Admin General Feedback, 9 on District Nodal Officer Important Documents, and 4 on each of the three NAPDDR committee frames. Content outside the frame renders nowhere - not in an export, not in Dev Mode - so it is invisible to anyone reading the handoff.
- **Twelve loose artboards sit at the section root** — Frames named 'Table', 'Table Container', 'Contianer', 'CardHeader', 'Body' and 'arrow-wrapper' sit beside the screen frames at 1090-3067px wide. They are the wide tables and fragments the screens reference, but at the root they read as screens.
- **The admin sign-in form has no design** — Both login frames draw the Patient Monitoring tab - one showing the Project Id field, one showing the OTP step. The Admin tab, which is what the build shows by default and what every officer in this audit signs in through, is drawn only as an inactive tab. Its form is undesigned.

---

## Coverage

All 50 captured screens appear in the PDF: 8 carry a screen-specific finding, and the rest render as a single reference board marked *audited, no screen-specific finding* — a screen dropped from a report reads as a screen never looked at.

**Declared coverage debt** — designed, not audited, and stated rather than left as a silent gap:

- **67 design frames have no build on dev** — form wizards, edit and detail states, register flows, and the two further sign-in states.
- **Five further roles were deferred by decision** — CPLI, ODIC, DDAC, USDP and Line Ministry. Each has working dev credentials on the shared access sheet and its own section on the design page (roughly 80 frames between them). They are ready to run as they stand.
- **MV / Institutions is not reachable** — 11 design frames, but the access sheet lists no login for the role.
