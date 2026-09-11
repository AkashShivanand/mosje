# eUtthan — Design QC (Login · Admin · Ministry) - Design QC Report

**Generated:** 2026-06-12    
**Status:** ready for review - a human still owes the keyboard and screen-reader pass.

**Also published as:** the PDF beside this file, the `eUtthan Admin` sheet in `docs/qc/MoSJE-Portal-QC-Tracker.xlsx`, a [Figma review sheet](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=164-2).

---
## Summary

| | |
|---|---|
| Boards in the report | 13 |
| Findings | **42** - 3 Blocker, 20 Major, 18 Minor, 1 Nit |

**Where to start.** The findings with the widest reach or the highest severity:

1. **Government accessibility bar** - `UTH-LOGIN-001` · Blocker
2. **Left brand panel** - `UTH-LOGIN-003` · Blocker
3. **Ministry / Schemes segmented tabs** - `UTH-MAP-MINISTRY-001` · Blocker
4. **Masthead — Ministry/Department text** - `UTH-GLOBAL-002` · Major
5. **Masthead — Digital India + SAMAVESH logos** - `UTH-GLOBAL-003` · Major

---

## Findings

## Admin · Map Ministry / Schemes

### Ministry / Schemes segmented tabs

`UTH-MAP-MINISTRY-001` · **Blocker** · Components & States · Scope: Admin · Map Ministry / Schemes

| | |
|---|---|
| **Design says** | A two-option segmented control sits beside the heading — active 'Ministry' in white on navy #003366, inactive 'Schemes' in grey. |
| **Build does** | No tabs at all — the 'Mapped Ministry List' heading sits alone above the table. |
| **Fix** | Add the Ministry/Schemes segmented tabs beside the heading, as shown in the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-41073) · [Live page](https://eutthan-admin-uat.mosje.in/map-ministry)

### Body cell colour

`UTH-MAP-MINISTRY-002` · **Major** · Color & Token · Scope: Admin · Map Ministry / Schemes

| | |
|---|---|
| **Design says** | Body cells use neutral dark #374151. |
| **Build does** | Ministry-name cells render in navy #003366 with a link treatment that isn't in the design. |
| **Fix** | Set the body cells to #374151; remove the navy link treatment. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-41073) · [Live page](https://eutthan-admin-uat.mosje.in/map-ministry)

### 'Unmap' row action colour

`UTH-MAP-MINISTRY-003` · **Major** · Color & Token · Scope: Admin · Map Ministry / Schemes

| | |
|---|---|
| **Design says** | 'Unmap' is a quiet text button in navy #003366 (text + icon). |
| **Build does** | 'Unmap' renders in red (~#ef4444) — a danger treatment the design doesn't use. |
| **Fix** | Recolour the Unmap text and icon to navy #003366. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-41073) · [Live page](https://eutthan-admin-uat.mosje.in/map-ministry)

## Login

### Government accessibility bar

`UTH-LOGIN-001` · **Blocker** · Components & States · Scope: Login

| | |
|---|---|
| **Design says** | Navy government bar at the very top — flag + 'Government of India', 'Skip to Main Content', A−/A/A+ text resize, contrast toggle and language selector. |
| **Build does** | The login page has no government bar at all (the signed-in pages do have it). |
| **Fix** | Add the same government accessibility bar to the top of the login page. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9018-36746) · [Live page](https://eutthan-admin-uat.mosje.in/login)

### Left brand panel

`UTH-LOGIN-003` · **Blocker** · Color & Token · Scope: Login

| | |
|---|---|
| **Design says** | A solid navy #003366 brand panel (~60% of the page): SAMAVESH logo + समावेश wordmark, orange divider, 'Justice. Equality. Dignity.' headline, a short description, and a bottom 'SIGNING INTO E-Utthaan' strip with a Change button. |
| **Build does** | A pale-blue illustration fills the left side (~44%) — no navy panel, no SAMAVESH branding, no tagline and no 'SIGNING INTO' strip. |
| **Fix** | Replace the illustration with the navy SAMAVESH brand panel, restore the ~60/40 split and the 'SIGNING INTO E-Utthaan' strip. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9018-36746) · [Live page](https://eutthan-admin-uat.mosje.in/login)

### Masthead branding

`UTH-LOGIN-002` · **Major** · Content & Iconography · Scope: Login

| | |
|---|---|
| **Design says** | Emblem + BETA tag + the full three-line lockup ending in the bold 'Department of Social Justice & Empowerment', plus the Digital India and SAMAVESH logos. |
| **Build does** | Only the emblem with two lines; the BETA tag, Department line and both partner logos are missing. |
| **Fix** | Show the complete masthead: BETA tag, full department lockup, and the Digital India + SAMAVESH logos. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9018-36746) · [Live page](https://eutthan-admin-uat.mosje.in/login)

### Form heading

`UTH-LOGIN-004` · **Major** · Content & Iconography · Scope: Login

| | |
|---|---|
| **Design says** | 'Log in to your account' — left-aligned at the top of the form. |
| **Build does** | 'Log In' — centred, with the national emblem repeated above it. |
| **Fix** | Use the heading 'Log in to your account', left-aligned, and remove the duplicate emblem above the form. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9018-36746) · [Live page](https://eutthan-admin-uat.mosje.in/login)

### Field labels & input style

`UTH-LOGIN-005` · **Major** · Components & States · Scope: Login

| | |
|---|---|
| **Design says** | 'User ID or Email' and 'Password' labels sit above their fields; inputs are 48px tall with a navy #003366 focus outline. |
| **Build does** | No labels — only placeholder text inside the fields; inputs are 46px tall with no visible focus style. |
| **Fix** | Add the two field labels above the inputs; input height 48px with a 2px navy #003366 focus outline. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9018-36746) · [Live page](https://eutthan-admin-uat.mosje.in/login)

### Password visibility toggle

`UTH-LOGIN-006` · **Minor** · Components & States · Scope: Login

| | |
|---|---|
| **Design says** | Eye icon inside the password field — 24×24, grey #6b7280. |
| **Build does** | The eye icon is smaller (~16px) and tight against the field edge with a small tap area. |
| **Fix** | Use the 24px eye icon in grey #6b7280 with a comfortable tap area. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9018-36746) · [Live page](https://eutthan-admin-uat.mosje.in/login)

### Primary button

`UTH-LOGIN-007` · **Minor** · Color & Token · Scope: Login

| | |
|---|---|
| **Design says** | Label 'Log In' · 48px tall · 8px corner radius · full form width. |
| **Build does** | Label 'Sign In' · ~41px tall · ~6px radius. |
| **Fix** | Change the label to 'Log In'; set height 48px and corner radius 8px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9018-36746) · [Live page](https://eutthan-admin-uat.mosje.in/login)

### Forgot Password link

`UTH-LOGIN-008` · **Nit** · Content & Iconography · Scope: Login

| | |
|---|---|
| **Design says** | 'Forgot Password?' — with the question mark — right-aligned on the Password label row, in navy. |
| **Build does** | 'Forgot Password' without the question mark. |
| **Fix** | Add the question mark: 'Forgot Password?'. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9018-36746) · [Live page](https://eutthan-admin-uat.mosje.in/login)

## Admin · Dashboard

### Financial-Year filter — placement

`UTH-DASHBOARD-002` · **Major** · Layout & Spacing · Scope: Admin · Dashboard

| | |
|---|---|
| **Design says** | The State and Financial-Year filters sit at the top of the page, next to the 'Dashboard' heading — they control everything below. |
| **Build does** | The Financial-Year filter sits inside the 'Progress Report' panel header, although changing it also updates the four KPI cards above it. |
| **Fix** | Move the Financial-Year filter to the top of the page next to the heading, as it affects the whole page. Applies to the Ministry dashboard as well. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685) · [Live page](https://eutthan-admin-uat.mosje.in/dashboard)

### KPI & progress card text

`UTH-DASHBOARD-004` · **Major** · Typography · Scope: Admin · Dashboard

| | |
|---|---|
| **Design says** | Card label in regular weight (400) dark slate #374151; the value below in semibold dark slate #374151. |
| **Build does** | Card labels render in bold, and all values render in bold navy (#003366 family) — heavier and bluer than the design. |
| **Fix** | Card labels → regular 400 #374151; values → semibold #374151 (not navy, not extra bold). Applies to both dashboards. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685) · [Live page](https://eutthan-admin-uat.mosje.in/dashboard)

### Page heading 'Dashboard'

`UTH-DASHBOARD-001` · **Minor** · Typography · Scope: Admin · Dashboard

| | |
|---|---|
| **Design says** | Noto Sans 28px / 500 / line-height 36 / letter-spacing −0.28 / colour #374151. |
| **Build does** | 30px / 600 / colour #1E3A5F (larger, bolder and a different colour). |
| **Fix** | Set the page heading to 28px / 500 / #374151 / letter-spacing −0.28. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685) · [Live page](https://eutthan-admin-uat.mosje.in/dashboard)

### State filter

`UTH-DASHBOARD-003` · **Minor** · Components & States · Scope: Admin · Dashboard

| | |
|---|---|
| **Design says** | Two filters at the top: a State dropdown ('All States') and the Financial-Year dropdown. |
| **Build does** | Only the Financial-Year filter exists; there is no State filter. |
| **Fix** | Show all the relevant filters. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685) · [Live page](https://eutthan-admin-uat.mosje.in/dashboard)

### Progress section container

`UTH-DASHBOARD-005` · **Minor** · Layout & Spacing · Scope: Admin · Dashboard

| | |
|---|---|
| **Design says** | 'Progress Report of Financial Year …' is a plain section title on the page, with the white stat cards directly below it. |
| **Build does** | The whole progress section is wrapped in a grey panel with a header strip, so the cards sit inside a box that isn't in the design. |
| **Fix** | Remove the grey wrapper panel; show the section title directly on the page with the cards below. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685) · [Live page](https://eutthan-admin-uat.mosje.in/dashboard)

## Admin · Manage Documents

### Year filter — control style

`UTH-DOCUMENTS-001` · **Major** · Components & States · Scope: Admin · Manage Documents

| | |
|---|---|
| **Design says** | A compact filter chip (about 99×36, 6px radius, 1px #e5e7eb border, leading arrow-down icon). |
| **Build does** | A wide clearable select with a trailing × button and chevron — a different control style. |
| **Fix** | Use the compact filter-chip style from the design; keep the × clear only for an applied-filter state. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-42902) · [Live page](https://eutthan-admin-uat.mosje.in/document-management)

## Admin · Manage Financial Year

### Body cell colour

`UTH-FINANCIAL-YEAR-001` · **Major** · Color & Token · Scope: Admin · Manage Financial Year

| | |
|---|---|
| **Design says** | Financial-year body cells use navy #003366 (this screen highlights the value in primary). |
| **Build does** | Body cells render in #374151 — the navy treatment is missing. |
| **Fix** | Set the body cell text to navy #003366 on this screen. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-40009) · [Live page](https://eutthan-admin-uat.mosje.in/admin/financial-year-management)

### 'Action' column header

`UTH-FINANCIAL-YEAR-002` · **Major** · Components & States · Scope: Admin · Manage Financial Year

| | |
|---|---|
| **Design says** | The right-most column has an 'Action' header above the row controls. |
| **Build does** | No 'Action' header above the edit/delete controls. |
| **Fix** | Add the 'Action' column header to the table header row. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-40009) · [Live page](https://eutthan-admin-uat.mosje.in/admin/financial-year-management)

### Row action controls

`UTH-FINANCIAL-YEAR-003` · **Major** · Components & States · Scope: Admin · Manage Financial Year

| | |
|---|---|
| **Design says** | Two icon-only buttons per row: a pencil (edit) in a light box and a red trash (delete) in a light-red box. |
| **Build does** | An 'Edit' text link with a pencil, plus a bare trash icon — not the boxed icon-only buttons. |
| **Fix** | Use the boxed icon-only pencil and red trash buttons from the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-40009) · [Live page](https://eutthan-admin-uat.mosje.in/admin/financial-year-management)

### Highlighted row background

`UTH-FINANCIAL-YEAR-004` · **Minor** · Color & Token · Scope: Admin · Manage Financial Year

| | |
|---|---|
| **Design says** | Highlighted/selected row background #e5eff9. |
| **Build does** | Highlighted row background #eaf2fb — visually close but not the token. |
| **Fix** | Use #e5eff9 for the highlighted row background. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-40009) · [Live page](https://eutthan-admin-uat.mosje.in/admin/financial-year-management)

### Search field background

`UTH-FINANCIAL-YEAR-005` · **Minor** · Color & Token · Scope: Admin · Manage Financial Year

| | |
|---|---|
| **Design says** | Search field has a white background (border #e5e7eb). |
| **Build does** | Search field background is grey #f9fafb (border #e5e7eb is the same in both). |
| **Fix** | Set the search field background to white. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-40009) · [Live page](https://eutthan-admin-uat.mosje.in/admin/financial-year-management)

## Admin · Manage Ministry

### Row text colour & hover behaviour

`UTH-MANAGE-MINISTRY-001` · **Major** · Color & Token · Scope: Admin · Manage Ministry

| | |
|---|---|
| **Design says** | Default rows in neutral dark #374151; a row turns primary navy #003366 (on the #e5eff9 highlight) only on hover/selection. |
| **Build does** | Ministry names always render in a lighter blue link style, regardless of state. |
| **Fix** | Default rows → #374151; apply the navy #003366 treatment only to the hovered/selected row. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-40288) · [Live page](https://eutthan-admin-uat.mosje.in/ministry-management)

### Row action buttons

`UTH-MANAGE-MINISTRY-002` · **Major** · Components & States · Scope: Admin · Manage Ministry

| | |
|---|---|
| **Design says** | On the hovered row: 'Edit' (navy on a light fill, 8px radius) and 'Delete' (red text + icon), comfortably sized with a 12px gap. |
| **Build does** | Edit and Delete appear but are compressed by the tight row padding and can't render at their designed size. |
| **Fix** | Match the Edit/Delete buttons' size, fill and spacing to the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-40288) · [Live page](https://eutthan-admin-uat.mosje.in/ministry-management)

## Global — Common Elements

### Masthead — Ministry/Department text

`UTH-GLOBAL-002` · **Major** · Content & Iconography · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | Two lines: 'Ministry of SJE' (14px/500/#1f2937) above the bold 'Department of SJE' headline (20px/700/#374151). |
| **Build does** | Single line 'Ministry of SJE' at 20px/700/#374151 — the Department headline is absent. |
| **Fix** | Add 'Department of Social Justice & Empowerment' (20px/700/#374151) as the main masthead headline; show the Ministry line above it at 14px/500/#1f2937. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### Masthead — Digital India + SAMAVESH logos

`UTH-GLOBAL-003` · **Major** · Content & Iconography · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | Centre-right of the masthead: Digital India logo + SAMAVESH lockup, with a 24px gap between them. |
| **Build does** | No co-branding — the centre of the header is empty. |
| **Fix** | Add the Digital India logo and the SAMAVESH lockup to the header centre, before the user profile. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### Sidebar — active nav item

`UTH-GLOBAL-005` · **Major** · Color & Token · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | Active item: text #003366 · weight 400 · corner radius 16px · background #e5eff9. |
| **Build does** | Active item: text #374151 · weight 700 · radius 8px (background correct; three properties deviate). |
| **Fix** | Active sidebar item: text colour → #003366 · weight → 400 · corner radius → 16px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### Search & form input typeface

`UTH-GLOBAL-007` · **Major** · Typography · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | All inputs and search fields use Noto Sans, like the rest of the portal. |
| **Build does** | Search and text inputs render in Poppins on Login and across the Admin and Ministry screens. |
| **Fix** | Set every input, select and search field to Noto Sans. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### Data-table column header

`UTH-GLOBAL-009` · **Major** · Typography · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | 14px / 600 / colour #6b7280; cell padding 24px on the sides · 16px top & bottom; header sits on a #f9fafb band. |
| **Build does** | Header text renders in #4b5563 with only 14px top/bottom padding (colour and vertical padding deviate; font-size 14px is correct). |
| **Fix** | On every table header: text colour → #6b7280; cell padding 24px sides · 16px top/bottom. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### Data-table body cell

`UTH-GLOBAL-010` · **Major** · Color & Token · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | 14px / 400 / colour #374151; cell padding 24px on the sides · 16px top & bottom. |
| **Build does** | Body cells render with a different colour (#4b5563, or pure #000 on some screens) and less top/bottom padding (16–20px). |
| **Fix** | On every table body cell: text colour → #374151; cell padding 24px sides · 16px top/bottom. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### Accessibility bar

`UTH-GLOBAL-001` · **Minor** · Layout & Spacing · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | Height 40px, navy #003366 background. |
| **Build does** | Height 38px (colour is correct). |
| **Fix** | Increase the accessibility bar height from 38px to 40px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### Sidebar collapse toggle

`UTH-GLOBAL-004` · **Minor** · Components & States · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | A hamburger/collapse control sits at the top-left of the header. |
| **Build does** | No collapse control is shown in the header. |
| **Fix** | Add the sidebar collapse (hamburger) control at the header's left edge. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### Profile — name, role & avatar

`UTH-GLOBAL-006` · **Minor** · Content & Iconography · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | Name with the role below it as plain text ('Admin', no punctuation); the avatar sits AFTER the text, at the far right. |
| **Build does** | Avatar comes first, then the name; the role is wrapped in parentheses — '(Super Admin)'. |
| **Fix** | Put the name and role first with the avatar to their right, and show the role as plain text without parentheses. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### 'Add' buttons — icon, weight & padding

`UTH-GLOBAL-008` · **Minor** · Components & States · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | Plus icon to the LEFT of the label; label 14px / 500 / line-height 20; padding 24-left / 16-right / 8 top & bottom; the plus is a separate 16×16 icon. |
| **Build does** | Plus icon to the RIGHT; label 14px / 600 with a tight line-height; padding 18 / 12 / 0; the '+' is baked into the label text. |
| **Fix** | On every Add button: plus icon on the left, label weight 500 / line-height 20, padding 24/16/8, and a real plus-icon element. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

### Card wrapper around search & table

`UTH-GLOBAL-011` · **Minor** · Color & Token · Scope: Global — Common Elements

| | |
|---|---|
| **Design says** | The search bar and table sit directly on the page with a soft shadow — there is NO bordered card around them. |
| **Build does** | The search and table are wrapped in a 1px hairline-bordered card. |
| **Fix** | Remove the hairline card border around the search + table; use the soft shadow from the design. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-39685)

## Ministry · Dashboard

### KPI & progress card text

`UTH-MIN-DASHBOARD-002` · **Major** · Typography · Scope: Ministry · Dashboard

| | |
|---|---|
| **Design says** | Card label regular 400 #374151; value semibold #374151. |
| **Build does** | Labels bold, values bold navy — same deviation as the Admin dashboard. |
| **Fix** | Card labels → regular 400 #374151; values → semibold #374151. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-37114) · [Live page](https://eutthan-admin-uat.mosje.in/dashboard)

### Financial-Year filter control

`UTH-MIN-DASHBOARD-001` · **Minor** · Components & States · Scope: Ministry · Dashboard

| | |
|---|---|
| **Design says** | The filter control uses an 8px corner radius and sits at the top of the page. |
| **Build does** | The Financial-Year selector uses a 6px radius and sits inside the progress panel header (placement covered under Admin · Dashboard). |
| **Fix** | Set the filter control radius to 8px. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-37114) · [Live page](https://eutthan-admin-uat.mosje.in/dashboard)

## Admin · Manage Outcome

### Filter dropdowns

`UTH-MANAGE-OUTCOME-001` · **Minor** · Components & States · Scope: Admin · Manage Outcome

| | |
|---|---|
| **Design says** | Three filter chips beside the search: Financial Year, 'All Schemes' and 'All Department'. |
| **Build does** | Only the Financial-Year dropdown is present. |
| **Fix** | Show all the relevant filters. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-40657) · [Live page](https://eutthan-admin-uat.mosje.in/manage-outcome)

## Admin · User Management

### Filter dropdowns

`UTH-MANAGE-USER-001` · **Minor** · Components & States · Scope: Admin · User Management

| | |
|---|---|
| **Design says** | Three filter dropdowns beside the search field. |
| **Build does** | A single 'All Years' select only. |
| **Fix** | Show all the relevant filters. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-40865) · [Live page](https://eutthan-admin-uat.mosje.in/user-management)

## Ministry · Manage Outcome

### Filter dropdowns

`UTH-MIN-MANAGE-OUTCOME-001` · **Minor** · Components & States · Scope: Ministry · Manage Outcome

| | |
|---|---|
| **Design says** | 'All Schemes' and 'All Department' dropdowns sit beside the Financial-Year filter. |
| **Build does** | Only the Financial-Year dropdown is present. |
| **Fix** | Show all the relevant filters. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-38577) · [Live page](https://eutthan-admin-uat.mosje.in/manage-outcome)

## Ministry · Manage Scheme

### Filter dropdowns

`UTH-MIN-SCHEME-MANAGEMENT-001` · **Minor** · Components & States · Scope: Ministry · Manage Scheme

| | |
|---|---|
| **Design says** | An 'All Department' dropdown sits beside the Financial-Year filter. |
| **Build does** | Only the Financial-Year filter is present. |
| **Fix** | Show all the relevant filters. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-37360) · [Live page](https://eutthan-admin-uat.mosje.in/scheme-management)

## Ministry · Physical Progress Data

### Header action buttons

`UTH-MIN-MINISTRY-PHYSICAL-PROGRESS-DATA-001` · **Minor** · Components & States · Scope: Ministry · Physical Progress Data

| | |
|---|---|
| **Design says** | Two actions: 'Import Achievements Data' (outline) and 'Add Progress' (filled navy). |
| **Build does** | A third button — 'Download Sample Template' — appears to the left of Import. |
| **Fix** | Confirm whether the extra 'Download Sample Template' action is intended; the design shows two actions. |

[Figma frame](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-38368) · [Live page](https://eutthan-admin-uat.mosje.in/ministry/physical-progress-data)
