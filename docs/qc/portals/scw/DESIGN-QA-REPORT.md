# SCW — Senior Citizens Welfare (UAT) · Full Design QC - Design QC Report

**Generated:** 2026-06-18  · **Design:** [handoff frames](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4619-49381)  
**Status:** ready for review - a human still owes the keyboard and screen-reader pass.

**Also published as:** the PDF beside this file, a [Figma review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=343-25).

---
## Summary

| | |
|---|---|
| Boards in the report | 18 |
| Findings | **65** - 3 Blocker, 21 Major, 41 Minor |
| Withdrawn, not raised, or noted about the design file | 1 |

Engine-computed: structured Figma specs vs live-DOM computed CSS, numerically diffed (font-size/weight/colour/width/presence) with pins computed from element bounding boxes; the LLM only ranked, phrased and added the structural/visual findings the text-diff can't see (chrome, icons, dividers, tab-bars, filters, field-casing). Build-only screens (Admin User Management, Volunteer Detail, RVY) are DS-consistent and not listed.

**Where to start.** The findings with the widest reach or the highest severity:

1. **Sidebar expand/collapse trigger placement** - `SCW-GLOBAL-005` · Blocker
2. **National Emblem in 'Signing into' lockup** - `SCW-ADMIN-LOGIN-002` · Blocker
3. **Event status tab bar** - `SCW-ADMIN-EVENTS-001` · Blocker
4. **Masthead cobranding logos (Digital India + SAMAVESH)** - `SCW-GLOBAL-001` · Major
5. **Masthead 'Department…' lockup line** - `SCW-GLOBAL-002` · Major

---

## Findings

## Admin / Events — List

### Event status tab bar

`SCW-ADMIN-EVENTS-001` · **Blocker** · Components & States · Scope: Admin / Events — List

| | |
|---|---|
| **Design says** | A tab bar — My / Pending / Approved / Rejected Events — sits above the table. |
| **Build does** | No tab bar is present; only a search box + the table. |
| **Fix** | Add the events status tab bar above the table, per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-25198) · [Live page](https://scw-admin-uat.mosje.in/events)

### Events

`SCW-ADMIN-EVENTS-002` · **Major** · Typography · Scope: Admin / Events — List

| | |
|---|---|
| **Design says** | Design: font-size 32px, weight 500. |
| **Build does** | Build: font-size 24px, weight 600. |
| **Fix** | Set the “Events” style to font-size 32px, weight 500 — the build currently uses font-size 24px, weight 600. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-25198) · [Live page](https://scw-admin-uat.mosje.in/events)

### Table element styling

`SCW-ADMIN-EVENTS-004` · **Major** · Color & Token · Scope: Admin / Events — List

| | |
|---|---|
| **Design says** | The table header row, row dividers, cell padding and status pills follow the design's table style. |
| **Build does** | The table header style, row dividers, spacing and pills don't match the design. |
| **Fix** | Align the table header, row dividers, cell padding and status pills to the design's table style. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-25198) · [Live page](https://scw-admin-uat.mosje.in/events)

### Events Date & Time

`SCW-ADMIN-EVENTS-003` · **Minor** · Typography · Scope: Admin / Events — List

| | |
|---|---|
| **Design says** | Design: weight 600, colour #6b7280. |
| **Build does** | Build: weight 700, colour #003366. |
| **Fix** | Set the “Events Date & Time” style to weight 600, colour #6b7280 — the build currently uses weight 700, colour #003366. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-25198) · [Live page](https://scw-admin-uat.mosje.in/events)

## Cross-cutting — Shared chrome & patterns recurring across SCW screens

### Sidebar expand/collapse trigger placement

`SCW-GLOBAL-005` · **Blocker** · Components & States · Scope: Cross-cutting — Shared chrome & patterns recurring across SCW screens

| | |
|---|---|
| **Design says** | The expand/collapse trigger sits in the header, above the sidebar column. |
| **Build does** | The collapse arrow (←) sits inside the sidebar column, above the nav items. |
| **Fix** | Move the expand/collapse trigger into the header, above the sidebar. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4855-63968) · [Live page](https://scw-user-uat.mosje.in/)

### Masthead cobranding logos (Digital India + SAMAVESH)

`SCW-GLOBAL-001` · **Major** · Content & Iconography · Scope: Cross-cutting — Shared chrome & patterns recurring across SCW screens

| | |
|---|---|
| **Design says** | The masthead right zone carries the Digital India + SAMAVESH cobranding logos (DBIM). |
| **Build does** | The masthead right zone is empty — both cobranding logos are absent across the public site. |
| **Fix** | Add the Digital India + SAMAVESH cobranding logos to the masthead right zone. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4855-63968) · [Live page](https://scw-user-uat.mosje.in/)

### Masthead 'Department…' lockup line

`SCW-GLOBAL-002` · **Major** · Content & Iconography · Scope: Cross-cutting — Shared chrome & patterns recurring across SCW screens

| | |
|---|---|
| **Design says** | The masthead lockup includes the bold 'Department of Social Justice & Empowerment' line beneath the Ministry line. |
| **Build does** | The masthead stops at 'Ministry of Social Justice & Empowerment' — the Department line is absent. |
| **Fix** | Add the bold 'Department…' line beneath the Ministry line in the masthead lockup. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4855-63968) · [Live page](https://scw-user-uat.mosje.in/)

### Font family not rendering as Noto Sans

`SCW-GLOBAL-003` · **Major** · Typography · Scope: Cross-cutting — Shared chrome & patterns recurring across SCW screens

| | |
|---|---|
| **Design says** | All text is set in Noto Sans (the DBIM standard typeface). |
| **Build does** | Many build text elements render in a fallback face — Noto Sans is requested in CSS but isn't actually loading, so headings/body fall back to a system font. |
| **Fix** | Ensure the Noto Sans webfont actually loads on the build (font files + @font-face) so text doesn't fall back to a system face. Recurs site-wide. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4855-63968) · [Live page](https://scw-user-uat.mosje.in/)

### Primary CTA default (gating) state

`SCW-GLOBAL-006` · **Major** · Components & States · Scope: Cross-cutting — Shared chrome & patterns recurring across SCW screens

| | |
|---|---|
| **Design says** | On gated forms the primary action stays disabled until the confirm checkbox / required fields are valid. |
| **Build does** | The primary action renders enabled by default — recurs across SAGE / Volunteer / ALD. |
| **Fix** | Default the primary action to disabled until the required input is valid. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4855-63968) · [Live page](https://scw-user-uat.mosje.in/)

### Top utility-bar accessibility trigger

`SCW-GLOBAL-004` · **Minor** · Accessibility · Scope: Cross-cutting — Shared chrome & patterns recurring across SCW screens

| | |
|---|---|
| **Design says** | The top utility bar carries an accessibility control (text-size + contrast) beside the language selector. |
| **Build does** | The top bar shows only Skip-to-Main, a translate glyph and Login. |
| **Fix** | Add the accessibility (text-size / contrast) control to the top utility bar. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4855-63968) · [Live page](https://scw-user-uat.mosje.in/)

## Login — Admin (SAMAVESH, Officer/Admin)

### National Emblem in 'Signing into' lockup

`SCW-ADMIN-LOGIN-002` · **Blocker** · Content & Iconography · Scope: Login — Admin (SAMAVESH, Officer/Admin)

| | |
|---|---|
| **Design says** | The bottom-left lockup shows the National Emblem. |
| **Build does** | The emblem is a blank white circle — the image is missing/broken. |
| **Fix** | Restore the National Emblem asset in the bottom-left lockup. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9508-52655) · [Live page](https://scw-admin-uat.mosje.in/login)

### 'Forgot Password' placement & lock icon

`SCW-ADMIN-LOGIN-001` · **Major** · Components & States · Scope: Login — Admin (SAMAVESH, Officer/Admin)

| | |
|---|---|
| **Design says** | 'Forgot Password' is a plain link, right-aligned ABOVE the password field. |
| **Build does** | It carries a lock icon and is not right-aligned above the password field as designed. |
| **Fix** | Right-align 'Forgot Password' above the password field and remove the lock icon. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9508-52655) · [Live page](https://scw-admin-uat.mosje.in/login)

### 'Change' button styling

`SCW-ADMIN-LOGIN-003` · **Minor** · Components & States · Scope: Login — Admin (SAMAVESH, Officer/Admin)

| | |
|---|---|
| **Design says** | 'Change' follows the design's button token. |
| **Build does** | The 'Change' control's styling/placement differs from the design. |
| **Fix** | Align the 'Change' control to the design's button token. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9508-52655) · [Live page](https://scw-admin-uat.mosje.in/login)

## Admin / Events — Add New Event

### Input field & icon styling

`SCW-ADMIN-EVENTS-ADD-002` · **Major** · Components & States · Scope: Admin / Events — Add New Event

| | |
|---|---|
| **Design says** | Form inputs follow the design's field height, border, radius and leading-icon treatment. |
| **Build does** | The input fields and their icons don't match the design's field styling. |
| **Fix** | Match the input field height, border, radius and leading-icon treatment to the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-24326) · [Live page](https://scw-admin-uat.mosje.in/events/add)

### Add New Event

`SCW-ADMIN-EVENTS-ADD-001` · **Minor** · Typography · Scope: Admin / Events — Add New Event

| | |
|---|---|
| **Design says** | Design: weight 500, colour #374151. |
| **Build does** | Build: weight 600, colour #111827. |
| **Fix** | Set the “Add New Event” style to weight 500, colour #374151 — the build currently uses weight 600, colour #111827. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-24326) · [Live page](https://scw-admin-uat.mosje.in/events/add)

## Admin / SAGE Application — Detail

### Field grouping & empty-value handling

`SCW-ADMIN-SAGE-DETAIL-002` · **Major** · Layout & Spacing · Scope: Admin / SAGE Application — Detail

| | |
|---|---|
| **Design says** | Fields are grouped into logical, labelled sections, showing only the relevant populated fields. |
| **Build does** | Most fields are dumped flat under one heading, with many empty values shown as '-'. |
| **Fix** | Group fields into logical sections and hide empty fields rather than rendering them as '-'. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23521) · [Live page](https://scw-admin-uat.mosje.in/sage-applications/sage00763)

### COMPANY DETAILS

`SCW-ADMIN-SAGE-DETAIL-001` · **Minor** · Typography · Scope: Admin / SAGE Application — Detail

| | |
|---|---|
| **Design says** | Design: font-size 16px, colour #374151. |
| **Build does** | Build: font-size 14px, colour #6b7280. |
| **Fix** | Set the “COMPANY DETAILS” style to font-size 16px, colour #374151 — the build currently uses font-size 14px, colour #6b7280. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23521) · [Live page](https://scw-admin-uat.mosje.in/sage-applications/sage00763)

## Admin / SAGE Applications — List

### Organization Name

`SCW-ADMIN-SAGE-APPLICATIONS-002` · **Major** · Content & Iconography · Scope: Admin / SAGE Applications — List

| | |
|---|---|
| **Design says** | Design includes 'Organization Name'. |
| **Build does** | Not present in the build. |
| **Fix** | Add 'Organization Name' per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23407) · [Live page](https://scw-admin-uat.mosje.in/sage-applications)

### Tables & filters wrapped in a card (recurs across all list views)

`SCW-ADMIN-SAGE-APPLICATIONS-003` · **Major** · Layout & Spacing · Scope: Admin / SAGE Applications — List

| | |
|---|---|
| **Design says** | Tables and their toolbars sit directly on the page background. |
| **Build does** | The table + toolbar are wrapped in a bordered card the design doesn't use — this recurs across SAGE, Events, Volunteers and IPSrC Homes lists. |
| **Fix** | Drop the card wrapper around tables and toolbars across all admin list views — they sit on the page background. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23407) · [Live page](https://scw-admin-uat.mosje.in/sage-applications)

### SAGE Applications

`SCW-ADMIN-SAGE-APPLICATIONS-001` · **Minor** · Typography · Scope: Admin / SAGE Applications — List

| | |
|---|---|
| **Design says** | Design: font-size 28px, weight 500. |
| **Build does** | Build: font-size 24px, weight 600. |
| **Fix** | Set the “SAGE Applications” style to font-size 28px, weight 500 — the build currently uses font-size 24px, weight 600. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23407) · [Live page](https://scw-admin-uat.mosje.in/sage-applications)

### Status pill styling

`SCW-ADMIN-SAGE-APPLICATIONS-004` · **Minor** · Color & Token · Scope: Admin / SAGE Applications — List

| | |
|---|---|
| **Design says** | Status pills use the design's bordered/tonal pill style. |
| **Build does** | Both status pills render as flat filled pills. |
| **Fix** | Match the status pills to the design's bordered/tonal pill style. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23407) · [Live page](https://scw-admin-uat.mosje.in/sage-applications)

## Citizen / Public Home

### Senior Citizens Welfare

`SCW-HOME-001` · **Major** · Typography · Scope: Citizen / Public Home

| | |
|---|---|
| **Design says** | Design: font-size 32px. |
| **Build does** | Build: font-size 24px. |
| **Fix** | Set the “Senior Citizens Welfare” style to font-size 32px — the build currently uses font-size 24px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4855-63968) · [Live page](https://scw-user-uat.mosje.in/)

### Need Immediate Help?

`SCW-HOME-002` · **Minor** · Typography · Scope: Citizen / Public Home

| | |
|---|---|
| **Design says** | Design: font-size 16px, colour #d64539. |
| **Build does** | Build: font-size 18px, colour #e65100. |
| **Fix** | Set the “Need Immediate Help?” style to font-size 16px, colour #d64539 — the build currently uses font-size 18px, colour #e65100. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4855-63968) · [Live page](https://scw-user-uat.mosje.in/)

### Service-card icon style

`SCW-HOME-003` · **Minor** · Color & Token · Scope: Citizen / Public Home

| | |
|---|---|
| **Design says** | Service-card icons are outline, single-tone marks. |
| **Build does** | Cards use filled, multi-coloured glyph icons (green leaf, blue document). |
| **Fix** | Restyle the service-card icons to the design's outline, single-tone set. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4855-63968) · [Live page](https://scw-user-uat.mosje.in/)

## Free Assisted Living Devices — Scheme

### Header-area background treatment

`SCW-ALD-SCHEME-001` · **Major** · Color & Token · Scope: Free Assisted Living Devices — Scheme

| | |
|---|---|
| **Design says** | The scheme header band uses the design's background colour/treatment. |
| **Build does** | The header-area background differs from the design (wrong fill/tone behind the title block). |
| **Fix** | Match the scheme header band background colour/treatment to the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23725) · [Live page](https://scw-user-uat.mosje.in/our-services/scheme)

### Divider placement

`SCW-ALD-SCHEME-006` · **Major** · Layout & Spacing · Scope: Free Assisted Living Devices — Scheme

| | |
|---|---|
| **Design says** | A single full-width hairline sits directly above the 'I confirm' checkbox. |
| **Build does** | The divider sits in an unnecessary position, breaking the card rhythm. |
| **Fix** | Keep one full-width hairline above the 'I confirm' checkbox; remove the misplaced divider. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23725) · [Live page](https://scw-user-uat.mosje.in/our-services/scheme)

### Redundant back-arrow control

`SCW-ALD-SCHEME-002` · **Minor** · Components & States · Scope: Free Assisted Living Devices — Scheme

| | |
|---|---|
| **Design says** | No back arrow — Cancel in the action pane serves that purpose. |
| **Build does** | A back-arrow (←) is added above the card, duplicating Cancel. |
| **Fix** | Remove the back arrow; Cancel already covers the back action. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23725) · [Live page](https://scw-user-uat.mosje.in/our-services/scheme)

### Free Assisted Living Devices

`SCW-ALD-SCHEME-003` · **Minor** · Typography · Scope: Free Assisted Living Devices — Scheme

| | |
|---|---|
| **Design says** | Design: font-size 16px, colour #374151. |
| **Build does** | Build: font-size 18px, colour #1f2937. |
| **Fix** | Set the “Free Assisted Living Devices” style to font-size 16px, colour #374151 — the build currently uses font-size 18px, colour #1f2937. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23725) · [Live page](https://scw-user-uat.mosje.in/our-services/scheme)

### Eligibility Criteria

`SCW-ALD-SCHEME-004` · **Minor** · Typography · Scope: Free Assisted Living Devices — Scheme

| | |
|---|---|
| **Design says** | Design: font-size 14px, weight 500, colour #374151. |
| **Build does** | Build: font-size 12px, weight 600, colour #6b7280. |
| **Fix** | Set the “Eligibility Criteria” style to font-size 14px, weight 500, colour #374151 — the build currently uses font-size 12px, weight 600, colour #6b7280. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23725) · [Live page](https://scw-user-uat.mosje.in/our-services/scheme)

### I confirm that I meet the eligibility criteria m

`SCW-ALD-SCHEME-005` · **Minor** · Typography · Scope: Free Assisted Living Devices — Scheme

| | |
|---|---|
| **Design says** | Design: font-size 16px. |
| **Build does** | Build: font-size 14px. |
| **Fix** | Set the “I confirm that I meet the eligibility ” style to font-size 16px — the build currently uses font-size 14px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23725) · [Live page](https://scw-user-uat.mosje.in/our-services/scheme)

## Login — User (SAMAVESH)

### Brand logo container shape

`SCW-LOGIN-001` · **Major** · Components & States · Scope: Login — User (SAMAVESH)

| | |
|---|---|
| **Design says** | The logo sits in a rounded-square container with generous breathing space around it. |
| **Build does** | The logo container is a tight circle, cropping the breathing space. |
| **Fix** | Use a rounded-square logo container with the design's internal padding — not a circle. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9453-255070) · [Live page](https://scw-user-uat.mosje.in/login)

### Input field & control styling

`SCW-LOGIN-003` · **Major** · Components & States · Scope: Login — User (SAMAVESH)

| | |
|---|---|
| **Design says** | Inputs use the design's field height, border colour, radius and focus state. |
| **Build does** | The build's input fields and the primary button differ in height, border and radius from the design. |
| **Fix** | Match the input field height, border colour, radius and focus/disabled states to the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9453-255070) · [Live page](https://scw-user-uat.mosje.in/login)

### SAMAVESH

`SCW-LOGIN-004` · **Major** · Typography · Scope: Login — User (SAMAVESH)

| | |
|---|---|
| **Design says** | Design: font-size 56px. |
| **Build does** | Build: font-size 48px. |
| **Fix** | Set the “SAMAVESH” style to font-size 56px — the build currently uses font-size 48px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9453-255070) · [Live page](https://scw-user-uat.mosje.in/login)

### Role selector — dropdown vs segmented buttons

`SCW-LOGIN-002` · **Minor** · Components & States · Scope: Login — User (SAMAVESH)

| | |
|---|---|
| **Design says** | A single 'role' dropdown. |
| **Build does** | Two segmented buttons ('Volunteer' / 'SAGE Organisation'). |
| **Fix** | Use the design's single role dropdown rather than two segmented buttons. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9453-255070) · [Live page](https://scw-user-uat.mosje.in/login)

### Justice. Equality. Dignity.

`SCW-LOGIN-005` · **Minor** · Typography · Scope: Login — User (SAMAVESH)

| | |
|---|---|
| **Design says** | Design: font-size 28px. |
| **Build does** | Build: font-size 30px. |
| **Fix** | Set the “Justice. Equality. Dignity.” style to font-size 28px — the build currently uses font-size 30px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9453-255070) · [Live page](https://scw-user-uat.mosje.in/login)

### SIGNING INTO

`SCW-LOGIN-006` · **Minor** · Typography · Scope: Login — User (SAMAVESH)

| | |
|---|---|
| **Design says** | Design: weight 500. |
| **Build does** | Build: weight 400. |
| **Fix** | Set the “SIGNING INTO” style to weight 500 — the build currently uses weight 400. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9453-255070) · [Live page](https://scw-user-uat.mosje.in/login)

### Senior Citizens Welfare

`SCW-LOGIN-007` · **Minor** · Typography · Scope: Login — User (SAMAVESH)

| | |
|---|---|
| **Design says** | Design: weight 700. |
| **Build does** | Build: weight 600. |
| **Fix** | Set the “Senior Citizens Welfare” style to weight 700 — the build currently uses weight 600. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9453-255070) · [Live page](https://scw-user-uat.mosje.in/login)

### Change

`SCW-LOGIN-008` · **Minor** · Typography · Scope: Login — User (SAMAVESH)

| | |
|---|---|
| **Design says** | Design: font-size 12px, weight 500. |
| **Build does** | Build: font-size 14px, weight 400. |
| **Fix** | Set the “Change” style to font-size 12px, weight 500 — the build currently uses font-size 14px, weight 400. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9453-255070) · [Live page](https://scw-user-uat.mosje.in/login)

## SAGE Registration — Eligibility Landing

### Redundant inner card around eligibility

`SCW-SAGE-LANDING-004` · **Major** · Layout & Spacing · Scope: SAGE Registration — Eligibility Landing

| | |
|---|---|
| **Design says** | Eligibility content sits directly in the page panel and spans its width. |
| **Build does** | Content is wrapped in an extra bordered inner card that narrows the column. |
| **Fix** | Remove the inner card so the content flows to the panel width — no fixed inner width. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23118) · [Live page](https://scw-user-uat.mosje.in/sage-registration)

### SAGE Initiative

`SCW-SAGE-LANDING-001` · **Minor** · Color & Token · Scope: SAGE Registration — Eligibility Landing

| | |
|---|---|
| **Design says** | Design: colour #374151. |
| **Build does** | Build: colour #003366. |
| **Fix** | Set the “SAGE Initiative” style to colour #374151 — the build currently uses colour #003366. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23118) · [Live page](https://scw-user-uat.mosje.in/sage-registration)

### Eligibility Criteria

`SCW-SAGE-LANDING-002` · **Minor** · Typography · Scope: SAGE Registration — Eligibility Landing

| | |
|---|---|
| **Design says** | Design: font-size 20px, weight 500, colour #374151. |
| **Build does** | Build: font-size 16px, weight 600, colour #003366. |
| **Fix** | Set the “Eligibility Criteria” style to font-size 20px, weight 500, colour #374151 — the build currently uses font-size 16px, weight 600, colour #003366. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23118) · [Live page](https://scw-user-uat.mosje.in/sage-registration)

### I confirm that my organization meets the SAGE el

`SCW-SAGE-LANDING-003` · **Minor** · Typography · Scope: SAGE Registration — Eligibility Landing

| | |
|---|---|
| **Design says** | Design: font-size 16px. |
| **Build does** | Build: font-size 14px. |
| **Fix** | Set the “I confirm that my organization meets t” style to font-size 16px — the build currently uses font-size 14px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23118) · [Live page](https://scw-user-uat.mosje.in/sage-registration)

## Volunteer / Dashboard

### Senior Citizens Welfare

`SCW-USER-VOLUNTEER-DASHBOARD-001` · **Major** · Typography · Scope: Volunteer / Dashboard

| | |
|---|---|
| **Design says** | Design: font-size 32px. |
| **Build does** | Build: font-size 24px. |
| **Fix** | Set the “Senior Citizens Welfare” style to font-size 32px — the build currently uses font-size 24px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-32475) · [Live page](https://scw-user-uat.mosje.in/)

## Volunteer Registration

### Select Volunteer Category

`SCW-VOLUNTEER-REG-003` · **Major** · Content & Iconography · Scope: Volunteer Registration

| | |
|---|---|
| **Design says** | Design includes 'Select Volunteer Category'. |
| **Build does** | Not present in the build. |
| **Fix** | Add 'Select Volunteer Category' per the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-32036) · [Live page](https://scw-user-uat.mosje.in/volunteer)

### Address row order + PIN-code auto-fill

`SCW-VOLUNTEER-REG-004` · **Major** · Components & States · Scope: Volunteer Registration

| | |
|---|---|
| **Design says** | Address row order is Pincode → State → District, and entering the PIN code auto-fills State and District. |
| **Build does** | Order is State → District → Pincode, and the fields are independent (no PIN-driven auto-fill). |
| **Fix** | Reorder to Pincode → State → District, and auto-populate State & District from the entered PIN code. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-32036) · [Live page](https://scw-user-uat.mosje.in/volunteer)

### Join as a Volunteer

`SCW-VOLUNTEER-REG-001` · **Minor** · Color & Token · Scope: Volunteer Registration

| | |
|---|---|
| **Design says** | Design: colour #374151. |
| **Build does** | Build: colour #003366. |
| **Fix** | Set the “Join as a Volunteer” style to colour #374151 — the build currently uses colour #003366. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-32036) · [Live page](https://scw-user-uat.mosje.in/volunteer)

### Individual

`SCW-VOLUNTEER-REG-002` · **Minor** · Typography · Scope: Volunteer Registration

| | |
|---|---|
| **Design says** | Design: font-size 16px, colour #374151. |
| **Build does** | Build: font-size 14px, colour #1f2937. |
| **Fix** | Set the “Individual” style to font-size 16px, colour #374151 — the build currently uses font-size 14px, colour #1f2937. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-32036) · [Live page](https://scw-user-uat.mosje.in/volunteer)

### Areas-of-Interest checkbox grid flow

`SCW-VOLUNTEER-REG-005` · **Minor** · Layout & Spacing · Scope: Volunteer Registration

| | |
|---|---|
| **Design says** | Checkboxes flow column-wise across the grid as designed. |
| **Build does** | The checkbox order/flow differs from the design grid. |
| **Fix** | Match the checkbox grid flow (column order) to the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-32036) · [Live page](https://scw-user-uat.mosje.in/volunteer)

### Radio-button control styling

`SCW-VOLUNTEER-REG-006` · **Minor** · Components & States · Scope: Volunteer Registration

| | |
|---|---|
| **Design says** | The Individual/Organisation radios use the design's control size, fill colour and selected-state ring. |
| **Build does** | The radio buttons differ in size, fill colour and selected-state styling from the design. |
| **Fix** | Match the radio control size, selected fill colour and ring to the design's radio component. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-32036) · [Live page](https://scw-user-uat.mosje.in/volunteer)

## Admin / Dashboard

### Dashboard

`SCW-ADMIN-DASHBOARD-001` · **Minor** · Typography · Scope: Admin / Dashboard

| | |
|---|---|
| **Design says** | Design: font-size 28px, weight 500, colour #374151. |
| **Build does** | Build: font-size 24px, weight 600, colour #111827. |
| **Fix** | Set the “Dashboard” style to font-size 28px, weight 500, colour #374151 — the build currently uses font-size 24px, weight 600, colour #111827. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23259) · [Live page](https://scw-admin-uat.mosje.in/dashboard)

### Recent SAGE Applications

`SCW-ADMIN-DASHBOARD-002` · **Minor** · Color & Token · Scope: Admin / Dashboard

| | |
|---|---|
| **Design says** | Design: colour #374151. |
| **Build does** | Build: colour #111827. |
| **Fix** | Set the “Recent SAGE Applications” style to colour #374151 — the build currently uses colour #111827. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23259) · [Live page](https://scw-admin-uat.mosje.in/dashboard)

### Recent Platform Activity

`SCW-ADMIN-DASHBOARD-003` · **Minor** · Color & Token · Scope: Admin / Dashboard

| | |
|---|---|
| **Design says** | Design: colour #374151. |
| **Build does** | Build: colour #111827. |
| **Fix** | Set the “Recent Platform Activity” style to colour #374151 — the build currently uses colour #111827. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23259) · [Live page](https://scw-admin-uat.mosje.in/dashboard)

### Volunteer Applications

`SCW-ADMIN-DASHBOARD-004` · **Minor** · Color & Token · Scope: Admin / Dashboard

| | |
|---|---|
| **Design says** | Design: colour #374151. |
| **Build does** | Build: colour #111827. |
| **Fix** | Set the “Volunteer Applications” style to colour #374151 — the build currently uses colour #111827. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23259) · [Live page](https://scw-admin-uat.mosje.in/dashboard)

### Stat-card caption hierarchy

`SCW-ADMIN-DASHBOARD-005` · **Minor** · Typography · Scope: Admin / Dashboard

| | |
|---|---|
| **Design says** | Each stat card shows a small, light, muted-grey caption above a large bold number. |
| **Build does** | The caption renders darker and heavier, so it competes with the number and flattens the hierarchy. |
| **Fix** | Make the stat-card caption smaller, lighter and muted-grey so the number stays the dominant value. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23259) · [Live page](https://scw-admin-uat.mosje.in/dashboard)

### Table-header text-case

`SCW-ADMIN-DASHBOARD-006` · **Minor** · Typography · Scope: Admin / Dashboard

| | |
|---|---|
| **Design says** | Column headers (e.g. 'Organization Name') use the design's title-case label style. |
| **Build does** | The same headers are force-uppercased in the build (text-transform), unlike the design's title case. |
| **Fix** | Match the column-header text-case to the design — drop the uppercase text-transform. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23259) · [Live page](https://scw-admin-uat.mosje.in/dashboard)

## Admin / IPSrC Homes — List

### IPSrC Homes

`SCW-ADMIN-IPSRC-HOMES-001` · **Minor** · Typography · Scope: Admin / IPSrC Homes — List

| | |
|---|---|
| **Design says** | Design: font-size 28px, weight 500. |
| **Build does** | Build: font-size 24px, weight 600. |
| **Fix** | Set the “IPSrC Homes” style to font-size 28px, weight 500 — the build currently uses font-size 24px, weight 600. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23806) · [Live page](https://scw-admin-uat.mosje.in/sage-homes)

### Table element styling

`SCW-ADMIN-IPSRC-HOMES-002` · **Minor** · Color & Token · Scope: Admin / IPSrC Homes — List

| | |
|---|---|
| **Design says** | The table header, row dividers and cell padding follow the design. |
| **Build does** | The table header style, dividers and spacing differ from the design. |
| **Fix** | Align the table elements to the design's table style. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23806) · [Live page](https://scw-admin-uat.mosje.in/sage-homes)

## Admin / Volunteers — List

### Toolbar control styling

`SCW-ADMIN-VOLUNTEERS-001` · **Minor** · Components & States · Scope: Admin / Volunteers — List

| | |
|---|---|
| **Design says** | Search and filter controls use the design's input/dropdown height, border and spacing. |
| **Build does** | The toolbar controls' height, border and spacing differ from the design. |
| **Fix** | Match the toolbar search/filter controls to the design's control styling. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23691) · [Live page](https://scw-admin-uat.mosje.in/volunteers)

### Volunteers

`SCW-ADMIN-VOLUNTEERS-002` · **Minor** · Typography · Scope: Admin / Volunteers — List

| | |
|---|---|
| **Design says** | Design: font-size 28px, weight 500. |
| **Build does** | Build: font-size 24px, weight 600. |
| **Fix** | Set the “Volunteers” style to font-size 28px, weight 500 — the build currently uses font-size 24px, weight 600. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23691) · [Live page](https://scw-admin-uat.mosje.in/volunteers)

### Table element styling

`SCW-ADMIN-VOLUNTEERS-003` · **Minor** · Color & Token · Scope: Admin / Volunteers — List

| | |
|---|---|
| **Design says** | The table header, row dividers and cell padding follow the design. |
| **Build does** | The table header style, dividers and spacing differ from the design. |
| **Fix** | Align the table elements to the design's table style. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5779-23691) · [Live page](https://scw-admin-uat.mosje.in/volunteers)

## E-Pledge (Take the Pledge)

### Pledge

`SCW-EPLEDGE-001` · **Minor** · Typography · Scope: E-Pledge (Take the Pledge)

| | |
|---|---|
| **Design says** | Design: weight 600. |
| **Build does** | Build: weight 700. |
| **Fix** | Set the “Pledge” style to weight 600 — the build currently uses weight 700. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23436) · [Live page](https://scw-user-uat.mosje.in/epledge)

## Our Services (Service Directory)

### Our Services

`SCW-OUR-SERVICES-001` · **Minor** · Typography · Scope: Our Services (Service Directory)

| | |
|---|---|
| **Design says** | Design: font-size 28px, weight 500. |
| **Build does** | Build: font-size 32px, weight 600. |
| **Fix** | Set the “Our Services” style to font-size 28px, weight 500 — the build currently uses font-size 32px, weight 600. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23664) · [Live page](https://scw-user-uat.mosje.in/our-services)

### Need Immediate Help?

`SCW-OUR-SERVICES-002` · **Minor** · Color & Token · Scope: Our Services (Service Directory)

| | |
|---|---|
| **Design says** | Design: colour #d64539. |
| **Build does** | Build: colour #b91c1c. |
| **Fix** | Set the “Need Immediate Help?” style to colour #d64539 — the build currently uses colour #b91c1c. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23664) · [Live page](https://scw-user-uat.mosje.in/our-services)

### Facility-type filter missing from toolbar

`SCW-OUR-SERVICES-003` · **Minor** · Components & States · Scope: Our Services (Service Directory)

| | |
|---|---|
| **Design says** | The toolbar carries a facility-type filter beside search and Near Me. |
| **Build does** | The toolbar shows search + Near Me only — the facility-type filter is absent. |
| **Fix** | Add the facility-type filter control to the toolbar. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4819-23664) · [Live page](https://scw-user-uat.mosje.in/our-services)

## SAGE / Dashboard — My Applications

### Approved application card styling

`SCW-USER-SAGE-DASHBOARD-001` · **Minor** · Color & Token · Scope: SAGE / Dashboard — My Applications

| | |
|---|---|
| **Design says** | The approved application card uses the design's surface colour, border and status-badge styling. |
| **Build does** | The approved card's colour, border and badge styling differ from the design. |
| **Fix** | Match the approved application card's surface colour, border and status badge to the Figma design (the card is read-only — no Withdraw action expected here). |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=5687-18689) · [Live page](https://scw-user-uat.mosje.in/)

---
## Withdrawn on re-checking, not raised, and notes on the design file

Nothing here is a finding. Each was either raised in an earlier round and did not survive re-checking, ruled out of scope, or is a defect in the handoff file rather than the build. They stay visible, with the reason, so a reviewer who saw one learns the outcome rather than wondering where it went.

- **SAGE registration wizard (Steps 1–6) — needs a pending-application test account** - The test account's application is Approved (read-only); 'View Details' routes to the eligibility landing, not the editable wizard. Provide a pending-application SAGE account to audit the wizard.
