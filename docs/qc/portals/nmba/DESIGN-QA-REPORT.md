# NMBA — Nasha Mukt Bharat Abhiyaan (DEV) - Design QC Report

**Generated:** 2026-09-11  · **Design:** [handoff frames](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=2136-20193)  
**Status:** ready for review - a human still owes the keyboard and screen-reader pass.

**Also published as:** the PDF beside this file, the `NMBA` sheet in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`, a [Figma review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50891-4319), a [pinned Figma report](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50916-5084).

---
## Summary

| | |
|---|---|
| Boards in the report | 37 |
| Findings | **45** - 3 Blocker, 21 Major, 16 Minor, 5 Nit |
| Applies to every screen | 27 |
| Specific to one screen | 18 |
| Withdrawn, not raised, or noted about the design file | 13 |

The NMBA design page (‘NMBA — Dev Synced — August’) compared against the live dev build at a locked 1440 viewport, screen by screen, for the citizen site, the sign-in surface and three admin roles — Admin, State Nodal Officer and District Nodal Officer. 50 screens were captured and 35 design frames paired one to one. Only differences between the design and the build are raised. Copy, wording, naming and policy are out of scope for this report, and the filter sets are covered by a single global note rather than screen by screen. Every finding carries a design box and a build box, and was checked against a 1:1 crop of both sides before publication. This report carries only what has something to say. Of the 51 screens captured, 10 carry a finding of their own and appear here as a board; the remaining 41 were checked against their design frames and carry no screen-specific finding, so they are named one by one in the ‘Coverage — NMBA’ tab of the QC tracker rather than repeated here as a page of picture each. The portal-wide findings still apply to all 51: the 27 global boards below each draw one such finding on a screen that shows it clearly.

**Where to start.** The findings with the widest reach or the highest severity:

1. **Sidebar navigation labels fail AA contrast** - `NMB-GLOBAL-001` · Blocker
2. **The GIGW accessibility toolset is missing from the masthead** - `NMB-GLOBAL-002` · Blocker
3. **The whole 'My Submissions' section is not built** - `NMB-SCREEN-023` · Blocker
4. **Admin sidebar navigation icons are absent** - `NMB-GLOBAL-003` · Major
5. **The ministry lockup drops its third line and changes colour** - `NMB-GLOBAL-004` · Major

---

## Findings that apply to every screen

Each has its own board in the PDF, showing the design and the build side by side with the marker on the element in question.

### Sidebar navigation labels fail AA contrast

`NMB-GLOBAL-001` · **Blocker** · Color & Token · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Every navigation label is #1F2937 on the panel's #F9FAFB ground - 14.05:1 - and the selected item is #003366 on an #E5EFF9 pill, 10.84:1. Sampled off the design frame beside five nav rows. |
| **Build does** | Every unselected navigation label is #9CA3AF. That is 2.43:1, where WCAG 2.2 AA requires 4.5:1 for text this size. It reads as a disabled control, and it is the same in the citizen shell and in all three admin roles. (Re-measured in the DOM on the live build, 2026-09-11. An earlier wording put this at 2.54:1 by assuming a white ground; the sidebar has no background of its own - the <aside> computes to transparent and the body behind it is #F9FAFB, which the rendered pixel behind a label confirms. The real ratio is slightly WORSE than published, not better.) |
| **Fix** | Set the unselected label to the design's #1F2937. If a quieter resting state is wanted, #4B5563 clears comfortably at 7.23:1 on this ground and #6B7280 is the lightest neutral that still passes, at 4.63:1; #9CA3AF cannot be used for text on #F9FAFB at any size. |

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
| **Design says** | Row actions are the library's own Icon Button (Size=Small, Type=Outlined, Color=Neutral): 32x32, a 1px #E5E7EB outline at radius 8, the edit glyph #003366 and the delete glyph #EC5042. Read off the component's own nodes in the design file, not sampled - an earlier wording said radius 6. |
| **Build does** | The actions are bare glyphs with no button around them - two 24px SVG images on User Management - and the edit glyph is filled #ED8525 (read from the served file, not sampled off a screenshot), an amber that appears nowhere in the NMBA token set. On three of the NAPDDR screens - State, District and Block Committee - the same actions become three outlined TEXT buttons instead (View / Edit / Delete, 1px border, radius 6), and on Important Documents they are a third thing again: real buttons wrapping tabler icons with no border at all. Verified on the live build, 2026-09-11. Committee Reports carries no row actions. |
| **Fix** | Restore the library's Icon Button - 32x32, 1px #E5E7EB, radius 8 - and set the edit glyph to #003366. One icon treatment has to hold across every screen - the same glyph set, the same button, the same two colours - rather than icon-buttons on some screens, amber glyphs on others and text buttons on three of the NAPDDR screens.  (Anchor: The row-action controls are icon-only buttons with no text node, so the extraction does not record them. The box is measured off the capture at the Actions column, x1305-1425 on the first data row, where the two glyphs are drawn.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### Previous and next are a hyphen and a plus sign

`NMB-GLOBAL-006` · **Major** · Content & Iconography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The pager runs a left chevron, the page numbers with the current one in a rounded outlined chip, an ellipsis, the last page, and a right chevron. |
| **Build does** | The two step controls render as '-' and '+'. A minus and a plus read as decrease and increase, not as previous and next page. (The pager DOES carry an ellipsis and a last-page number - checked on the live build 2026-09-11, which shows '- 1 2 3 ... 1,393 +'. An earlier wording of this finding said it did not; that was read off a capture and was wrong.) |
| **Fix** | Use the chevrons the design specifies for the step controls, and show the ellipsis and last page so a reader can tell how long the list is. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52092-136433) · [Live page](https://nmba-admin-dev.mosje.in/napddr/state-committee)

### Table row height is inconsistent across the portal

`NMB-GLOBAL-009` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Every data cell in the design is 56px tall - all 50 of them, exactly, on this frame - and every header cell is 52px. Counted off the frame's own nodes, not estimated; an earlier wording said 'a steady 45-55px', which understated how uniform the design actually is. |
| **Build does** | Measured row heights run 41px on User Management, 53px on most lists, 57px on Important Documents, 65px on the NAPDDR screens, 85px on Best Practices and 153px on the Ministries dashboard - the same component at more than three times the height from one screen to the next. Header rows vary too, from 38px to 85px. |
| **Fix** | Set one row height for the table component and let it apply everywhere; where a cell wraps to two lines, let the row grow from that one value rather than redefining it per screen. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52051-161871) · [Live page](https://nmba-admin-dev.mosje.in/ministries-dashboard)

### The sidebar panel and every row in it are built to different metrics

`NMB-GLOBAL-039` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The panel is 300px wide with 16px of padding all round and a 1px #E5E7EB edge, and it holds rows that are 268x48 at radius 16, each padded 12px top and bottom and 16px left and right, with an 8px gap between a row's icon and its label. |
| **Build does** | The panel is 288px with no padding of its own and a 1px #D1D5DB edge, and its rows are 245x36 at radius 10, padded 8px and 12px. Every row is affected, not only the selected one: a row is a quarter shorter than designed, 23px narrower, on a smaller radius, and indented to x30 instead of the design's x16. Read from the DOM on the live build and from the design frame's own nodes, 2026-09-11. |
| **Fix** | Build the sidebar to the design's metrics: a 300px panel padded 16, rows 268x48 at radius 16 padded 12/16. This is the fifth finding on this one component and the one that makes the others land - NMB-GLOBAL-001 (label colour), NMB-GLOBAL-003 (missing icons and the connector line the design does not draw), NMB-GLOBAL-015 (the selected row's weight and shape) and NMB-GLOBAL-038 (the 60px item rhythm). Treat them as one piece of work against one component rather than five separate tickets; the sidebar does not match the design until all five land. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### The table's header band, cell padding and dividers are all different from the design

`NMB-GLOBAL-040` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The table sits in a #FFFFFF container with a 1px #E5E7EB edge at radius 12. Its header is a band: 52px tall, filled #F9FAFB, each cell padded 16px top and bottom and 24px left and right. Data cells are 56px tall, padded 12/24, and separated by a 1px #F3F4F6 rule. |
| **Build does** | The header has no fill at all - it is transparent, so there is no band, just text above rows - and it is 38px instead of 52. Every cell, header and data alike, is padded 8/16 where the design says 16/24 and 12/24, which is what makes the rows 41px instead of 56. The row rule is #E5E7EB rather than #F3F4F6, a heavier line than the design draws, and the container is radius 6 against the design's 12. Read from the DOM on the live build, 2026-09-11. |
| **Fix** | Build the table to the design's own component: a radius-12 container, a 52px #F9FAFB header band padded 16/24, 56px data cells padded 12/24, and a #F3F4F6 row rule. This is the finding the other table findings hang off - NMB-GLOBAL-009 (row heights), NMB-GLOBAL-010 (cell colour), NMB-GLOBAL-005 (row actions), NMB-GLOBAL-019 (the extra wrapper), NMB-GLOBAL-036 (a column too narrow for its date) and NMB-SCREEN-030 (action order). The cell padding alone accounts for most of the height difference, so fixing it fixes -009 across the portal.  (Anchor: GATE 3 flagged this one, correctly and usefully: the finding is about a header BAND, and the anchor resolves to an element with no background. That is not the resolver landing beside the band - it is the finding. The build's header has no fill at all, which is why there is no band to anchor to; the anchor is the header cell itself, and its transparency is the evidence.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### The masthead's marks are the wrong size, and the co-branding is one flattened image

`NMB-GLOBAL-041` · **Major** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The National Emblem is 32x52, sitting 30px below the band's top edge. The co-branding is two separate marks, each 40px tall - Digital India at x917, 102 wide, and the SAMAVESH lockup at x1043, 188 wide - together spanning 314px and ending at x1231. The band's lower edge is 1px #F3F4F6. |
| **Build does** | In the ADMIN shell the National Emblem is 49x80 - about 53% larger on both axes - and sits 24px higher, at y46. The co-branding is not two marks but ONE raster image, 440x56 at x792: 40% wider, 16px taller and starting 125px further left than the design places it, with Digital India and SAMAVESH baked into a single file whose alt text is one 83-character string. The band's lower edge is 1px #D1D5DB against the design's #F3F4F6 - the same substitution the sidebar makes. The CITIZEN shell is worse on the same band: the emblem is 39x64 against the same designed 32x52, the band is 106px tall against 94, and the MINISTRY NAME ITSELF is a 496x56 raster image where the design sets it as three lines of live text. A portal that carries a language control cannot translate a picture of its own name. Read from the DOM on the live build, 2026-09-11. |
| **Fix** | Draw the National Emblem at the design's 32x52 in its designed position, and compose the co-branding from the two marks the design uses rather than one flattened picture - a single image cannot be scaled per breakpoint, cannot be themed, and gives a screen reader one long string where the design has two named marks. On the citizen shell the ministry name has to come back as text for the same reason, and more urgently: it is the department's own name, on a bilingual portal. Set the band's lower edge to #F3F4F6. Note that the emblem is the National Emblem of India: its proportions are not ours to adjust, and the estate's own rule is that it ships at 3x the largest surface that renders it rather than being scaled up from a smaller file.  (Anchor: The finding is about two MARKS - the National Emblem and the co-branding block - which are images with no text node, sitting 700px apart in the same band. The box is the band itself on both sides, measured off the captures, so the crop shows both marks and the reader can see the size difference rather than being told it.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### The search field is the only thing in the portal not set in Noto Sans

`NMB-GLOBAL-044` · **Major** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The field is 938x40 at radius 8 with a 1px #E5E7EB edge, and its placeholder is 14px Noto Sans Regular #374151 - the same face, size and grey as every other field in the design. |
| **Build does** | The field renders in POPPINS at 16px #000000, in a box 768x43 at radius 6. Counted in the DOM on 2026-09-11: of 147 rendered elements on User Management exactly ONE is not Noto Sans, and it is this input; the same is true on Important Documents. So a single control in the portal is set in a different typeface, a size larger than the design, and in pure black rather than the #374151 the design uses for placeholder text. |
| **Fix** | Remove the Poppins declaration - it is one rule and it is the only thing importing that family - and let the field inherit Noto Sans at 14px #374151. The estate's standing instruction is Noto Sans across all government properties and no other family introduced. While the rule is being changed, the box wants the design's 40px height and radius 8 rather than 43 and 6.  (Anchor: The field's placeholder text is already NMB-GLOBAL-008's anchor, and two findings must not share one box. The anchor here is the field's own measured rect on both sides - 938x40 in the design, 768x43 in the build - which is also the geometry half of the finding.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### Primary and secondary buttons are built to different metrics

`NMB-GLOBAL-045` · **Major** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Buttons are 40px tall at radius 8, padded 8-10px vertically and 16/24 horizontally, with the label at 14px Medium: the primary filled #003366 with a #FFFFFF label, the secondary a 1px #003366 outline with a #003366 label. |
| **Build does** | The primary 'Add User' is 36px tall at radius 4 - half the design's radius - padded 0/18 with its label at weight 600 rather than Medium. The secondary export buttons are 38px at radius 8. So no button in the toolbar is the height the design draws, and the primary and secondary disagree with each other on radius as well as with the design. |
| **Fix** | Use one button component at the design's 40px height and radius 8, with the label at Medium. The primary's radius 4 is the outlier - every other rounded thing on the screen is 6, 8, 10 or 16, so this is a fifth radius nobody chose. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

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
| **Build does** | Checked screen by screen on the live build, 2026-09-11: the magnifier is absent on User Management, the Ministries dashboard, all four NAPDDR screens and Facilities, and on Important Documents, Pledge Reports, List of SNO and the Nasha Mukti Mitr Report it is drawn inside the RIGHT edge instead. So the same control takes three different forms across the portal as well as differing from the design. |
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
| **Design says** | Every KPI icon sits on a 32x32 tile filled #E5EFF9 - Primary/50 - at radius 10, so the row of cards reads as one set. The card around it is 353x138, #FFFFFF, 1px #E5E7EB, radius 16, padded 24 - which the build matches almost exactly, at 355x134. It is only the tile that differs. |
| **Build does** | The tile is 44x44 at radius 12 - a third larger than the design's 32x32 at radius 10 - and it is tinted per card. Read from the DOM on the live officer dashboard, 2026-09-11, the four tiles in one row are #FDE8EF (pink, on 'Important Documents'), #E6F7FB (cyan), #FFF6E5 (cream) and #EEF1F4 (grey). NONE of the four is in the NMBA token set, against the design's single #E5EFF9, which is. So a row of metrics that carry no status meaning is colour-coded as though they did, in four colours the design never published - on a tile that is also the wrong size. The card itself is right, which is worth saying: this is the tile, not the component. |
| **Fix** | Draw the tile at 32x32, radius 10, filled #E5EFF9. Reserve a coloured tint for a metric that genuinely signals a state, and take the tint from the token set when you do.  (Anchor: The icon tile is an SVG on a filled div with no text, so the extraction records neither. The tile's fill was sampled from the capture at x590-650 y240-290 and measures #FDE8EF against the design's #E5EFF9.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=2309-14405) · [Live page](https://nmba-admin-dev.mosje.in/dashboard)

### The KPI value is 30px, which is not on the type scale

`NMB-GLOBAL-013` · **Minor** · Typography · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The KPI value is 32px SemiBold #003366 - the top step of the published scale. |
| **Build does** | The KPI value is 30px. The scale runs 24, 28, 32; 30 is not a step on it, so this number is the only type size in the portal that no token can express. |
| **Fix** | Set the KPI value to 32px. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=2309-14405) · [Live page](https://nmba-admin-dev.mosje.in/dashboard)

### Export is two buttons where the design has one

`NMB-GLOBAL-033` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | One 'Export' button with a chevron, 110x38 at the right of the page header. Where a choice of format is offered the design opens it as a menu beneath - the NAPDDR Committee Reports frame draws that menu, with 'Export as XLS' and 'Export as PDF' as its two items. |
| **Build does** | Two permanent side-by-side buttons, 'Export Excel' (115x38) and 'Export PDF' (108x38), on 29 of the 42 captured screens. Both formats occupy the header on every screen whether or not either is wanted, and the pair is 231px wide against the design's 110px. |
| **Fix** | Collapse the two into the design's single 'Export' button and put the formats in the menu the design already draws for them. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### Every page number is boxed, so the current page has no mark

`NMB-GLOBAL-034` · **Minor** · Components & States · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Only the current page is boxed - a single outlined square around '1' - and the rest are bare numerals. Six pages are offered before the ellipsis, then the last page: 1 2 3 4 5 6 ... 125. |
| **Build does** | Every page number carries its own outlined box, so the box no longer says which page you are on and the strip reads as seven identical buttons. Three pages are offered before the ellipsis instead of six. |
| **Fix** | Box the current page only, leave the other numbers bare, and show the design's six pages before the ellipsis. This is the same pagination the hyphen and plus sign belong to (NMB-GLOBAL-006); fixing the glyphs without fixing the boxing leaves the reader still unable to see which page they are on.  (Anchor: The page-number boxes are buttons whose only text is the numeral, so a text anchor would bind to one numeral rather than to the strip the finding is about. The box is measured off the capture across the whole pager, x323-553 y758-798, which holds the hyphen, the four numbered boxes, the ellipsis and the plus.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### The table sits inside an extra white container

`NMB-GLOBAL-035` · **Minor** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The search row and the table are two separate white cards sitting directly on the page's #F9FAFB ground - sampled at x312, y250, between the sidebar and the table's left edge. |
| **Build does** | A third white panel wraps both of them - measured in the DOM on the live build 2026-09-11 as a 1112px div at x308, #FFFFFF, radius 6, with its own border - so the same pixel measures #FFFFFF and the table's own card is drawn inside a second border. The page ground disappears from the whole content column. |
| **Fix** | Drop the outer panel and let the search row and the table sit on the page ground as the design does. Nothing else needs to move: both inner cards already carry their own border and radius.  (Anchor: The finding is about a container with no text of its own, and on the design side about the ABSENCE of one. Both boxes are measured off the captures over the same region - the search row and the top of the table. The claim itself was checked by sampling one pixel in the left gutter at x312 y250: #F9FAFB in the design, #FFFFFF in the build.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### A date breaks across two lines in a narrow table column

`NMB-GLOBAL-036` · **Minor** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Every column in the design is wide enough for what it holds: the widest header, 'Chariperson/Chief Secretary', is given 209px and its values sit on one line. |
| **Build does** | The 'Formed on' column is 94px wide, so the ten-character date 2012-12-12 breaks after the second hyphen and renders as '2012-12-' above '12'. A date split across two lines cannot be read or compared down the column, and the break is what pushes these rows to 65px. |
| **Fix** | Give the date column enough width for its longest value - 10 characters at 14px needs about 105px inside its padding - or stop the value wrapping. The same applies to the header above it, which breaks as 'Formed' / 'on'. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52095-142880) · [Live page](https://nmba-admin-dev.mosje.in/napddr/committee-reports)

### The account identity reverses its layout

`NMB-GLOBAL-037` · **Minor** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | The name leads at 16px, the role sits under it right-aligned and quieter, and the square initials tile closes the group on the right - text first, tile last, the group ending flush with the page's right margin. |
| **Build does** | The initials tile leads on the left and the text follows it, the role is wrapped in brackets under the name as '(Admin)' rather than set as a quieter second line, and the block is left-aligned against the tile instead of ranged right. |
| **Fix** | Put the tile back on the right of the name and role, range the two text lines right, and set the role as the design does - no brackets, the quieter of the two weights.  (Anchor: The account name, role and initials are the signed-in user's own data, so the extraction masks them and records no text node. The box is measured off the capture at the right of the masthead, x1252-1432 y58-130, where the tile and the two lines are drawn.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

### The admin sidebar sits on a 40px rhythm where the design uses 60px

`NMB-GLOBAL-038` · **Minor** · Layout & Spacing · Scope: every screen with this element

| | |
|---|---|
| **Design says** | Sidebar items repeat every 60px - measured across thirteen items, the gaps run 57 to 61px - which is what gives each item its own space beside a 24px icon. |
| **Build does** | Items repeat every 40px, a third tighter, and the labels are 20px tall inside that, so the list reads as one dense block rather than as separate destinations. |
| **Fix** | Restore the design's 60px item rhythm. This is the third thing the admin sidebar changes from the design - see also NMB-GLOBAL-001 for the label colour and NMB-GLOBAL-003 for the missing icons; all three need to land together for the sidebar to match. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

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
| **Build does** | The selected item's label is set Bold, where the design changes only the fill. Its 36px height and radius 10 are not particular to the selected row - EVERY row in the panel is built that way, which is NMB-GLOBAL-039. What belongs to this finding is the WEIGHT: the design marks the current page with a fill alone and the build marks it twice. |
| **Fix** | Keep the selected label at the same weight as the rest and let the fill do the work. The pill's height and radius come right with NMB-GLOBAL-039, which fixes them for every row at once. |

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

## Admin - Add User side sheet

### The side sheet fills the window edge to edge instead of floating inside it

`NMB-SCREEN-042` · **Major** · Layout & Spacing · Scope: Admin - Add User side sheet

| | |
|---|---|
| **Design says** | The sheet is a 520x978 panel inset 16px from the top, right and bottom of the window, at radius 16, with a 1px #E5EFF9 edge and two drop shadows - so it reads as a card lifted above the page. Behind it the scrim is #0A0D13 at 50%. The title is 'Add User' at 20px SemiBold #1F2937, and each field label is 14px Medium #1F2937 over a 488x44 input at radius 8 with a 1px #D1D5DB edge. |
| **Build does** | The sheet is 620x1000 flush to the top, right and bottom edges, with no radius, no border and no shadow - a full-height slab rather than a floating panel, 100px wider than designed. The scrim is #000000 at 60%, darker than the design's. The title is 22px/600 #003366, blue where the design is near-black and two points larger. Inputs are 588x36 - 8px shorter than designed - with a 1px #CED4DA edge, which is a fourth near-miss grey against the design's #D1D5DB. Labels are 16px/400 #000000 where the design says 14px Medium #1F2937, and they are not even consistent with each other: 'Mobile Number' renders 14px/600 #374151 while 'First Name', 'Last Name', 'Email ID' and 'Select Role' render 16px/400 #000000, in the same form. |
| **Fix** | Build the sheet as the design draws it: 520 wide, inset 16 from the window edges, radius 16, the #E5EFF9 edge and the two shadows, over a 50% #0A0D13 scrim. Set the title to 20px SemiBold #1F2937 and every label to 14px Medium #1F2937 - one label style for the whole form - over 44px inputs bound to #D1D5DB. The same sheet is used by Add Document, Add Best Practice, Add Event and Add Feedback, so this lands on eight designed flows at once.  (Anchor: The finding is about the SHEET - its size, its inset, its radius and the scrim behind it - and a sheet has no text node. The box is the sheet's top 300px on both sides, measured off the captures, so the crop shows the edge treatment and the title together rather than describing them.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52066-127999)

### Required fields carry no marker

`NMB-SCREEN-043` · **Major** · Components & States · Scope: Admin - Add User side sheet

| | |
|---|---|
| **Design says** | Seven of the sheet's fields are marked required with a red asterisk after the label, #EC5042, so a user can see what must be filled before they start: First Name, Last Name, Email ID, Mobile Number, Select Role, Select State and Select District. |
| **Build does** | There is not one asterisk in the built sheet - counted in the DOM on 2026-09-11, the design frame carries 7 and the build carries 0. Nothing on the form distinguishes a required field from an optional one, so the first time a user learns which fields are mandatory is when submitting fails. |
| **Fix** | Restore the required marker the design draws - the red asterisk after the label - on all seven fields. Pair it with `required` on the input so the marker is not the only signal: a mark that exists only in colour and only in a glyph is not announced to a screen reader, and WCAG 2.2 asks that an instruction not depend on a sensory characteristic alone. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52066-127999)

## Admin, State and District shells

### Two footer links land on the dashboard instead of their own page

`NMB-SCREEN-026` · **Major** · Components & States · Scope: Admin, State and District shells

| | |
|---|---|
| **Design says** | The design has no 'About Us' or 'Contact Us' page inside the authenticated shell; these are citizen-site destinations. |
| **Build does** | In the admin shell /about-us and /contact-us both render a page that is byte-for-byte identical to the dashboard - verified by checksum on all three admin roles. A reader who follows either link is silently returned to the dashboard with no indication that the page they asked for does not exist. |
| **Fix** | Point these links at the citizen site's pages, or give the shell a not-found state. A route with no page should say so rather than substituting the landing screen.  (Anchor: This finding is about which page a route serves, so there is no single control to anchor to; the anchor is the page title that proves it - /about-us renders the heading 'Dashboard'.) |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52061-126900) · [Live page](https://nmba-admin-dev.mosje.in/user-management)

## Citizen - About Us

### The 'About Us' link on the citizen home page leads to a not-found page

`NMB-SCREEN-032` · **Major** · Components & States · Scope: Citizen - About Us

| | |
|---|---|
| **Design says** | The citizen design draws no About Us link and no About Us page, and it has no not-found state at all - every link it draws resolves to a screen it also draws. |
| **Build does** | The home page carries an 'About Us' link in its body. It goes to /about-us, which answers HTTP 200 and then renders a not-found page: a near-black card, a cartoon robot, and the words 'Something went wrong... The page you're looking for has vanished.' Re-checked on the live build 2026-09-11, where a third thing turned up: that whole card is a single 299x187 <img> with alt='404 Not Found'. The heading, the apology and the explanation are pixels - no text node on the page carries any of them - so they cannot be translated by the portal's own language control, cannot reflow, and reach a screen reader as four words. So: a public link on a Government of India landing page that leads nowhere, a 200 response that says 404 (which is what a search engine indexes), and the message itself locked inside a picture. |
| **Fix** | Either build the About Us page or take the link off the home page. Whichever is chosen, the not-found page needs to answer with a 404 status and be redrawn in the portal's own language - white card on #F9FAFB, navy heading, the design system's button, and the message as real text rather than baked into an image - rather than a dark panel and a cartoon. Note that the ADMIN shell answers the same missing route differently again, by silently rendering the dashboard (NMB-SCREEN-026): the estate needs one not-found behaviour, not two wrong ones. |

[Live page](https://nmba-user-dev.mosje.in/about-us)

## Citizen - Activity Snapshots

### The activity card has no title and no description

`NMB-SCREEN-018` · **Major** · Components & States · Scope: Citizen - Activity Snapshots

| | |
|---|---|
| **Design says** | Each card carries five things: the type chip at 11px, the activity title at 16px Medium #1F2937, a two-to-three line description at 12px, then the location and the date. |
| **Build does** | Each card carries three: the type as a chip, the location and the date. The activity's own title and its description are not rendered, so the card's only heading is the category it belongs to. |
| **Fix** | Render the activity title and its description between the chip and the location line, at the sizes the design specifies. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-58966) · [Live page](https://nmba-user-dev.mosje.in/activities)

### The activity card is built to different metrics, and its type chip loses its colour

`NMB-SCREEN-046` · **Major** · Layout & Spacing · Scope: Citizen - Activity Snapshots

| | |
|---|---|
| **Design says** | The card is 348x409 at radius 12 with a 1px #E5E7EB edge. Its type chip is 11px Medium #1558B0 - a blue that says 'category' - and the location and date under it are 11px Medium #374151. |
| **Build does** | The card is 329x351 at radius 8 with a 1px #E5EAF2 edge - a sixth near-miss grey. The type chip is 14px/500 #374151: three points larger than designed and drained of its blue, so the one element that tells a reader what KIND of activity this is now looks like ordinary body text. The location drops to 12px #6B7280 and the date to 11px #6B7280, both lighter than the design's #374151. |
| **Fix** | Build the card at 348x409, radius 12, edge #E5E7EB, and put the chip back to 11px Medium #1558B0. The chip is the card's only classification; at 14px in the same grey as everything else it stops doing that job. Note this is the same card that has lost its title and its description (NMB-SCREEN-018) - with those two restored and the chip recoloured, the card reads as the design intends. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-58966) · [Live page](https://nmba-user-dev.mosje.in/activities)

## Citizen - Help Centres & Facilities

### The facility card drops its second button and its service tags

`NMB-SCREEN-019` · **Major** · Components & States · Scope: Citizen - Help Centres & Facilities

| | |
|---|---|
| **Design says** | Each facility card ends with two buttons side by side - 'Get Directions' filled #003366 and 'Call Now' white with a #003366 outline - above which sit the service tags as small pills (Inpatient Treatment, Outpatient Counseling, Detoxification, Rehabilitation). |
| **Build does** | There is one button, not two: 'Get Directions' stretches 494px across the full width of the card, where the design gives it 218x32 beside an equal 'Call Now'. It is also filled #0A2C53, not the design's #003366 - a seventh near-miss colour, this one on the primary action of the citizen's most-used card. The card can still be phoned - the number above the button is a tel: link with a green handset glyph - but it is a bare line of text where the design gives it a button beside the first, so the two things a reader does with a centre no longer look like the same kind of thing. The service tag pills are not rendered at all, so a reader cannot see what a centre offers without opening it. |
| **Fix** | Give the phone number back its button beside 'Get Directions', outlined #003366 as the design draws it, and restore the service tag pills above the pair. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-58585) · [Live page](https://nmba-user-dev.mosje.in/facilities)

### Facility names are set in capitals

`NMB-SCREEN-020` · **Minor** · Typography · Scope: Citizen - Help Centres & Facilities

| | |
|---|---|
| **Design says** | The facility name is Title Case at 16px SemiBold #1F2937. |
| **Build does** | The name renders in capitals - 'SOCIETY FOR EDUCATION AND ENVIRONMENT DEVELOPMENT' at 16px/600, and the address under it the same way. At this length a name in capitals is measurably slower to read, and no other name in the portal is set this way. Checked in the DOM on the live build 2026-09-11: computed text-transform is `none`, so the capitals are in the REGISTER DATA, not in the styling - which is why an earlier reading of this as an uppercase transform was wrong, and why the fix is not a CSS change. |
| **Fix** | Normalise the name for display rather than printing the register verbatim - the build already owns this string on the way to the card. If the department would rather the register itself were corrected, that is a data task and this finding should be routed there instead; it is flagged as a presentation defect because the citizen-facing page is where it shows. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=9081-58585) · [Live page](https://nmba-user-dev.mosje.in/facilities)

### The facility-type chip is filled with a colour that is not a token

`NMB-SCREEN-021` · **Minor** · Color & Token · Scope: Citizen - Help Centres & Facilities

| | |
|---|---|
| **Design says** | The chip encodes the facility type by colour, and both colours are published tokens: a de-addiction centre is #C8E6C9 with an #81C784 border and its label #27682A, a hospital is #D2E3FC. Sampled off the design frame at the two chips it draws. |
| **Build does** | The build DOES colour-code by type - an earlier wording of this finding said it used one fill for everything, which was wrong and is withdrawn. Read from the DOM on the live build 2026-09-11, the four chips are: CPLI #C8E6C9 / label #27682A, DDAC #EDE7F6 / #6A1B9A, IRCA #DBEAFE / #1E3A8A, ODIC #FFE0B2 / #E65100. Three of those four fills are in no NMBA token, and the one that IS - the design's green - has been put on Community-based Peer-Led Intervention, while the District De-addiction Centre, which the design draws in that green, gets the lavender. IRCA's #DBEAFE is also a near-miss of the design's hospital blue #D2E3FC: close enough to look right and different enough to drift. |
| **Fix** | Bind every type chip to a published token, and put the design's green back on the de-addiction centre where the design has it. Where a type the design never drew needs its own colour, add it to the token set rather than picking a hex - three of these four came from nowhere. |

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

### The pledge banner is narrower than the page and loses its edge

`NMB-SCREEN-047` · **Minor** · Layout & Spacing · Scope: Citizen - Home

| | |
|---|---|
| **Design says** | The banner is 1092x136 at radius 20, a linear gradient inside a 1px #E5E7EB edge, padded 32/56/32/32, and it spans the full content column from x324 to x1416. Its call to action is a 170x40 white button at radius 8, its label 14px Medium #003366. |
| **Build does** | The banner is 1020x136 at radius 20 with the gradient but NO edge, starting at x360 - so it is 72px narrower than the content column it sits in and does not line up with the cards below it. The button is 176x36 at radius 6 with its label at weight 400: 4px shorter than designed, on a radius the design does not use here, in the regular weight rather than Medium. |
| **Fix** | Span the banner across the content column as the design does, restore the 1px #E5E7EB edge, and build the button at 170x40 radius 8 with a Medium label. The button metrics are the same ones NMB-GLOBAL-045 raises on the admin toolbar, so one button component fixes both. |

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

### The row actions are in a different order, and in a different style

`NMB-SCREEN-030` · **Nit** · Layout & Spacing · Scope: Important Documents (all roles)

| | |
|---|---|
| **Design says** | The row actions run download, then edit, then delete, each as a bordered icon-button - a light 1px outline at radius 6, the glyphs at #003366 and #EC5042. |
| **Build does** | They run edit, then download, then delete. The download control is the one a reader uses most on this screen and the design puts it first. The treatment is wrong too, and it is a THIRD treatment: these are real <button> elements wrapping 20px tabler icons at #003366 and #374151 with no border, no radius and no background, where the design draws a bordered icon-button - and where User Management draws two 24px SVG images with no button at all. Same action, three different things, none of them the design's. |
| **Fix** | Order the row actions download, edit, delete as the design does, AND draw them in the design's style: the bordered icon-button, the glyphs at #003366 and #EC5042. The style half is the same fix as NMB-GLOBAL-005 and lands with it - one row-action component, used everywhere; the order is particular to this screen. |

[Figma frame](https://www.figma.com/design/evmNmlK8g4VYwJVu2FwSGV/MoSJE-Portal--Handoff-?node-id=52070-443098) · [Live page](https://nmba-admin-dev.mosje.in/important-documents)

---
## Withdrawn on re-checking, not raised, and notes on the design file

Nothing here is a finding. Each was either raised in an earlier round and did not survive re-checking, ruled out of scope, or is a defect in the handoff file rather than the build. They stay visible, with the reason, so a reviewer who saw one learns the outcome rather than wondering where it went.

- **Status chips are not set in capitals** - Dropped on the reviewer's instruction, 2026-09-11. The measurement stands - the design sets the status chip uppercase at 11px and the build renders 'Draft' and 'Published' in sentence case - but the reviewer has decided it is not worth raising. Recorded rather than deleted so the id resolves for anyone who saw it.
- **The pledge banner has lost its call to action** - WRONG, and withdrawn on the reviewer's challenge. The button IS built. Checked on the live page at a 1440 viewport on 2026-09-11: a <button> reading 'Take the Pledge', 176x36 at x1171 y230, white fill, label #003366, radius 6 - which is what the design draws. It was missed because the capture was taken with the UX4G accessibility panel open, which widened the document and pushed the button to x1841, outside the 1440-wide export. 'Not in the picture' was read as 'not built'. The capture is the evidence for what a screen LOOKS like; it is not evidence that something is absent. An absence is now confirmed against the live DOM before it is written up.
- **KPI grid reflows to unequal card widths** - Measured on the capture: the three cards on the officer dashboard span 308-662, 688-1040 and 1066-1418 - 354, 352 and 352px with even 26px gaps, and the second row starts at the same two x positions. The grid is even. Withdrawn.
- **Sidebar navigation icons absent PORTAL-WIDE** - The citizen shell does carry its navigation icons; only the admin shell has none. The finding is kept but narrowed to the admin shell - see G03.
- **Page title is off the type scale** - The build's page title measures 24px at weight 600, which is exactly what the design specifies. Only the colour differs. Narrowed to a colour finding - see G11.
- **Admin screens are missing the footer strip** - Checked on both sides: NO admin, State Nodal Officer or District Nodal Officer DESIGN frame carries a footer either - 0 footer elements across all 31 of them, against 3 on every citizen frame. The build matches the design exactly. Not a discrepancy.
- **The sidebar expand/collapse icon does not match the design** - Cropped both sides at 1:1: the control is the same collapse glyph in the same place at the same size. Any difference is in how it behaves, which a static design QC cannot evidence - it belongs in a functional pass.
- **The facility filter is too wide** - Width and height vary with content and viewport, so they are not audited as defects here.
- **The side navigation lists different items from the design** - Which items a menu carries is information architecture and content, which this run was scoped to leave out. Recorded for the content pass.
- **The filter label reads 'All Facilities' where the design says 'All Facility Types'** - Wording. Out of scope for this run by instruction.
- **Design file — Seven frames draw content outside their own canvas** - Measured during the Phase-0 read: 44 text nodes sit outside the frame bounds on each of the Admin State/UT-District Events, State Nodal Officer Dashboard and District Nodal Officer Dashboard frames, 66 on Admin General Feedback, 9 on District Nodal Officer Important Documents, and 4 on each of the three NAPDDR committee frames. Content outside the frame renders nowhere - not in an export, not in Dev Mode - so it is invisible to anyone reading the handoff.
- **Design file — Twelve loose artboards sit at the section root** - Frames named 'Table', 'Table Container', 'Contianer', 'CardHeader', 'Body' and 'arrow-wrapper' sit beside the screen frames at 1090-3067px wide. They are the wide tables and fragments the screens reference, but at the root they read as screens.
- **Design file — The admin sign-in form has no design** - Both login frames draw the Patient Monitoring tab - one showing the Project Id field, one showing the OTP step. The Admin tab, which is what the build shows by default and what every officer in this audit signs in through, is drawn only as an inactive tab. Its form is undesigned.
