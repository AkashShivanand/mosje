# PM-AJAY hub clone — SAMAVESH design-system check, 2026-09-13

**Scope.** Our own build of PM-AJAY inside the hub — `apps/hub/src/app/portals/pm-ajay/**` and `apps/hub/src/components/pm-ajay/**` — checked against the SAMAVESH design system: the `--sa-*` token contract, the `@mosje/design-system` components, the estate rules in `.claude/rules/`, and WCAG 2.2 AA / GIGW 3.0.

**This is not the live-portal audit.** The live portal at `pmajay-dev.mosje.in` is audited against the Figma handoff file in `docs/audit/pm-ajay-house-standard-audit-2026-09-12.md` (PR #474). The two are separate subjects with separate authorities and share no findings.

Figma review sheet: [Design QC → PM-AJAY Hub Clone — DS Check](https://www.figma.com/design/8LX7sqdDtWIAoCYZueCJq7/Design-QC?node-id=50984-26) — SAMAVESH STANDARD | BUILD | ISSUES.

## How it was measured

| | |
|---|---|
| Build | `origin/main` at `f8bee7a0`, served locally at :3007 |
| Session | demo Joint Secretary (`JS001`, the mock account published in `store/pm-ajay/auth-context.tsx`) |
| Captures | 14 — Sign-In, Sign-In with an error, Reset Password, the six dashboard views, Unified Dashboard, All Indicators, a filtered state; Sign-In, Executive Summary and Unified at 375px |
| Runtime | every visible element's computed colour, background, border, font size, family and radius, judged against the values `packages/tokens/dist/tokens.css` resolves to (all modes, `var()` chains followed) |
| Static | read of all 12 source files by the `design-system-guardian` and `accessibility-auditor` agents; every claim they made that a browser could check was re-checked in Chromium before it was used |

## Conformance, measured

| Axis | Judged | On SAMAVESH | |
|---|---|---|---|
| Text colour | 3,404 | 667 | **19.6%** |
| Background | 1,160 | 743 | **64.1%** |
| Border colour | 416 | 32 | **7.7%** |
| Font size | 3,441 | 2,960 | **86.0%** |
| Font family | 3,441 | 3,441 | **100.0%** |
| Corner radius | 915 | 915 | **100.0%** |

Colour is low because PM-AJAY keeps its own palette under a recorded exemption (`docs/guidelines/README.md` row 9) — see PMH-005. Font size counts icon glyphs and phone-width scaling artefacts; the text-only figures are in PMH-008.

## Findings

**4 Blocker · 9 Major · 4 Minor · 1 Nit.** PMH-005 is a decision for the design-system manager, not a defect to assign.

### PMH-001 · Blocker · The Unified Dashboard link, and any page refresh, lands the user back on the Executive Summary

*Functional — Dashboard, Unified Dashboard*

**Standard:** Router links: a component that takes a link must route client-side (design-system-architecture.md §2b) · SidebarNav — @mosje/design-system (has no linkAs prop today)

- Clicking 'Unified Dashboard' in the side menu goes /unified → /login → back to the Executive Summary. The Unified Dashboard cannot be reached from the menu.
- Refreshing any view (e.g. #financial) does the same, so a bookmarked or shared view never opens.
- Cause 1: the menu item is a plain link, so the whole page reloads. Cause 2: the page checks for a signed-in user before the saved session has been read back, sees nobody, and redirects.

**Fix:** Design system: add linkAs to SidebarNav and pass next/link from the portal. Portal: give the auth context a 'ready' flag and redirect only once the session has been read.

**Evidence:** Verified in Chromium: navigation sequence /unified → /login → / on click, and #financial → /login → / on reload.

### PMH-002 · Blocker · The dashboard is a fixed 1440px picture shrunk to fit — on a phone its text is about 4px tall

*Layout & Spacing — Dashboard (all six views); Unified Dashboard above 880px*

**Standard:** Portals are fluid: no cap, padded with --sa-grid-margin-page (CLAUDE.md, 2026-09-05) · WCAG 2.2 1.4.10 Reflow · 1.4.4 Resize Text · 2.5.8 Target Size

- The Executive Summary at 375px wide: the page is the desktop layout scaled to 26%. 'Total Allocation' renders 27×5px; every button and table row falls below the 24px target minimum.
- The dashboard never reflows. Zooming text to 200% cannot help because the whole canvas is scaled, not laid out.
- 0 uses of --sa-grid-margin-page or .sa-container across the portal.

**Fix:** Remove transform: scale() from dashboard-app.tsx and unified-app.tsx; drop width:1440px from .pm-app. Lay the KPI rows, chart grid and table out on a responsive grid padded with --sa-grid-margin-page — the fluid branch unified-app.tsx already has below 880px is the starting point.

### PMH-003 · Blocker · 'Skip to Main Content' on the sign-in pages goes nowhere

*Accessibility — Sign-In, Reset Password*

**Standard:** WCAG 2.2 2.4.1 Bypass Blocks (Level A) · AccessibilityBar skipTo → the page's <main> id

- The header's skip link points at #pm-main. The sign-in page's main region is #login-main and Reset Password's is #fp-main, so the link does nothing.
- It is the first thing a keyboard user reaches on the portal. The dashboards use #pm-main and work.

**Fix:** Rename both <main> ids to pm-main (login/page.tsx:97, forgot-password/page.tsx:23).

**Evidence:** Verified in Chromium: document.querySelector('#pm-main') is null on /login and /forgot-password.

### PMH-004 · Blocker · Rank numbers, 'Lowest utilisation' and data-source lines are grey text at 2.5:1 contrast

*Accessibility — Unified Dashboard*

**Standard:** WCAG 2.2 1.4.3 Contrast (Minimum) — 4.5:1 for text this size · --sa-text-neutral-subtle (#3B3D41) or --sa-text-neutral-subtler (#6F757D) for secondary text

- 75 text elements on the two Unified Dashboard screens use #9CA3AF on white — about 2.5:1.
- The stylesheet's own comment on that colour (--pm-faint) says 'decorative / non-text only'.

**Fix:** Point .ud-rank-row .rk, .ud-rank-divider, .ud-grouphead .src, .ud-kpi-src and .ud-sec .hint at a text token that clears 4.5:1 (--sa-text-neutral-subtler).

**Evidence:** Measured from computed styles: color rgb(156,163,175), 12px regular.

### PMH-005 · Major · PM-AJAY keeps its own colour palette, so most of what is on screen is not a SAMAVESH colour

*Color & Token — All 14 captured screens*

**Standard:** Every fill and stroke resolves through a --sa-* token (design-system-architecture.md §2) · Recorded divergence: docs/guidelines/README.md row 9 — ds-exempt(portal-palette), 2026-09-01

- Measured on every element: 19.6% of text colours, 64.1% of backgrounds and 7.7% of borders resolve to a SAMAVESH value.
- pm-ajay.css declares its own ramps: --primary-*, --secondary-*, --danger-*, --warning-* and a neutral scale that is Tailwind's grey (#1F2937 text on 990 elements, #E5E7EB borders on 302).
- This is a sanctioned exemption, not a developer slip — which is why it is a decision for the design-system manager, not a defect to assign.

**Fix:** DECIDE: keep the exemption, or migrate. e-Utthan is the model: bind every entry that has a SAMAVESH equivalent (#1F2937→--sa-text-neutral-base, #E5E7EB→--sa-border-neutral-subtle, #6B7280→--sa-text-neutral-subtler) and give each remaining literal a one-line reason. This is the same neutral-ramp question raised on the live PM-AJAY portal (PMA-DS-001) — one decision can close both.

### PMH-006 · Major · The sign-in page is hand-built instead of using the design system's login template

*Components & States — Sign-In, Reset Password*

**Standard:** PortalLoginShell / PortalLoginTemplate · Input · PasswordInput · Button · Alert — all in @mosje/design-system · CLAUDE.md: page-level layout templates belong in the DS and are reused across portals

- login/page.tsx (287 lines) rebuilds the card, the ID and password fields with their show/hide toggle, the submit button and the error banner.
- None of the design-system versions is imported, and unlike ui.tsx the file gives no reason why.
- E-Anudaan and NMBA already sign in through the shared template, so a fix made there reaches them and not PM-AJAY.

**Fix:** Rebuild Sign-In on PortalLoginTemplate with Input, PasswordInput, Button and Alert; keep the demo-account panel as slot content. Reset Password: reuse Button, Alert and AuthHelpLine (CredentialRecovery is still Figma-only).

### PMH-007 · Major · Icons are drawn outside <Icon>, at weight 400 beside design-system icons at 300

*Content & Iconography — All*

**Standard:** <Icon> — Material Symbols Rounded, weight 300, size 24 (CLAUDE.md conventions)

- 53 icons are hand-written <span class='material-symbols-rounded'> with no <Icon>.
- Measured on the Executive Summary: 40 icons render at weight 400 and 14 (inside SidebarNav and other DS parts) at 300 — two weights of the same icon set on one screen.

**Fix:** Replace each span with <Icon name=… size=…/>; delete the 35 per-icon font-size overrides in pm-ajay.css and the wght 400 rule at line 231.

### PMH-008 · Major · Chart labels are set at 13px, and chart axes at 10–11px, off the type scale

*Typography — Executive Summary and 8 other dashboard screens; Financial, GIA, Hostel charts*

**Standard:** --sa-type-body-3-size / --sa-type-label-2-size = 12px is the floor; --sa-type-body-2-size = 14px · --sa-font-weight-* for weight

- 155 chart labels and values (e.g. the Allocation → Utilization bars) are 13px on 9 screens.
- 41 axis labels ('Apr', '806') are 10px and 11px on 3 screens — below the smallest size SAMAVESH publishes.
- Source: 14 inline font shorthands such as font: '600 13px/1.3 …' in charts.tsx, views.tsx, ui.tsx and unified-app.tsx.

**Fix:** Replace each shorthand with --sa-type-label-2-size/-lh (12) or --sa-type-body-2-size/-lh (14) and a --sa-font-weight-* token.

### PMH-009 · Major · Charts, the breadcrumb and two dropdowns are rebuilt instead of using design-system components

*Components & States — Dashboard, Unified Dashboard*

**Standard:** DonutChart · BarChart · LineChart / AreaChart · FunnelChart · Breadcrumb · Select — all in @mosje/design-system

- charts.tsx hand-draws Donut, HBars, VBars, LineArea and Funnel in raw SVG (~430 lines).
- The breadcrumb (dashboard-app.tsx:214) and the Group / Sort dropdowns on All Indicators (unified-app.tsx:503, 509) are hand-rolled too.
- ui.tsx documents why each of its own components is kept; these have no such note.

**Fix:** Adopt the DS component wherever it can draw the same chart; for any that genuinely cannot (e.g. the donut's target tick), write the reason beside it the way ui.tsx does, and raise the gap on the DS.

### PMH-010 · Major · The two dashboards show the same figures in two different visual languages

*Components & States — Executive Summary ↔ Unified Dashboard*

**Standard:** One component per job across the estate (design-system-architecture.md §1) · Left: the Executive Summary rendering of the same data

- Total Allocation, Utilisation 79.0% and the fund-flow bars appear on both pages with different card styles: one has sparklines and target bars, the other trend chips only.
- The same 79.0% utilisation ring is green on the Executive Summary and blue on the Unified Dashboard.
- A reader moving between the two cannot tell whether they are looking at the same number.

**Fix:** Pick one KPI card and one utilisation ring and use them on both pages — ideally DonutChart from the DS, and a KPI card added to the DS (it has none yet), so the choice holds estate-wide.

### PMH-011 · Major · Clickable table rows announce as buttons, so screen readers lose the table

*Accessibility — All six dashboard views*

**Standard:** WCAG 2.2 1.3.1 Info and Relationships · 4.1.2 Name, Role, Value

- Each drillable row is <tr role='button'> (10 per table). The role replaces the row, so 'next row' and column-header reading stop working.
- Keyboard handling on the rows is correct and should stay.

**Fix:** Remove role='button' from the <tr> in SortableTable (ui.tsx:606); keep tabIndex, onClick and onKeyDown, or put a real button in the state-name cell.

### PMH-012 · Major · The Dashboard / All Indicators switch claims to be tabs but does not behave like tabs

*Accessibility — Unified Dashboard*

**Standard:** WCAG 2.2 4.1.2 Name, Role, Value · WAI-ARIA Tabs pattern · Tabs — @mosje/design-system

- role='tablist' with two role='tab' buttons, but no tabpanel, no aria-controls and no arrow-key movement (0 tabpanels measured).

**Fix:** Use the DS Tabs component, or drop the tab roles and make it a role='group' of two toggle buttons with aria-pressed.

### PMH-013 · Major · The × that removes a filter chip is 18×18px

*Accessibility — Unified Dashboard (with a filter applied)*

**Standard:** WCAG 2.2 2.5.8 Target Size (Minimum) — 24×24px · Chip / IconButton sizing in @mosje/design-system

- The × on the 'Scheme: Grant-in-Aid (GIA)' chip (labelled 'Clear Scheme') measures 18×18 and sits flush against the chip label, so the spacing exception does not apply.

**Fix:** Raise .ud-chip button to 24×24 (pm-ajay.css:554), keeping the 14px glyph.

### PMH-014 · Minor · 'Utilisation' and 'Utilization' are both used, often on the same screen

*Content & Iconography — All dashboard screens*

**Standard:** ui-restraint-and-copy.md §2 — one register, the department's own words

- Executive Summary: 'Utilization % (of release)' and 'Overall Utilization' sit beside 'Fund Flow & Utilisation' and 'State-wise Utilisation'.
- Across the dashboards: 'utilization' 53 times, 'utilisation' 24, plus 'utilized' and 'utilised'.

**Fix:** Use one spelling everywhere — the department's own usage decides which — and apply Title Case inside KPI labels ('Utilisation % (Of Release)').

### PMH-015 · Minor · Footer links go nowhere, and the sign-in card claims 'GIGW 3.0 compliant'

*Content & Iconography — Sign-In, Dashboard footer*

**Standard:** GIGW 3.0 — Terms, Privacy and Help pages are mandatory · ui-restraint-and-copy.md — anything we author must be defensible

- Terms & Conditions, Privacy Policy and Help are href='#' on Sign-In, and Terms and Privacy on every dashboard footer.
- 'GIGW 3.0 compliant' is printed on the sign-in card; this audit found WCAG failures on every screen family (PMH-002 to 004, 011 to 013), so the claim cannot be defended today.

**Fix:** Link the footer to real pages or remove the links; remove the compliance claim until it has been certified.

### PMH-016 · Minor · Three small accessibility gaps: error not tied to fields, redirect not announced, headers without scope

*Accessibility — Sign-In, redirect placeholder, all tables*

**Standard:** WCAG 2.2 3.3.1 Error Identification · 4.1.3 Status Messages · 1.3.1 Info and Relationships

- 'Incorrect credentials.' is announced once but neither field carries aria-describedby, so returning to a field does not repeat why.
- 'Redirecting to sign-in…' has no role='status'.
- Table headers carry no scope (0 of 10 on the Executive Summary).

**Fix:** Add id + aria-describedby to the error; wrap the redirect text in role='status'; add scope='col' in SortableTable.

### PMH-017 · Minor · Unused webfonts, 23 dead masthead rules and a raw z-index

*Code hygiene — All (not visible)*

**Standard:** Noto Sans only (CLAUDE.md) · --sa-z-dropdown for popovers (floating-element-placement.md)

- pm-ajay.css:10 imports Roboto (4 weights) and Red Hat Mono (2) alongside Noto Sans; nothing uses either.
- 23 .pm-nav-* rules style a masthead that was replaced by SiteHeader.
- .pm-menu uses z-index: 40 instead of a --sa-z-* rung.

**Fix:** Trim the @import to Noto Sans; delete the .pm-nav-* rules and --font-ui / --font-mono; bind the menu to --sa-z-dropdown.

### PMH-018 · Nit · The demo dock covers the end of the 'Last sync' date

*Layout & Spacing — Dashboard (prototype chrome only)*

**Standard:** floating-element-placement.md — the right wall is for navigators; content keeps clear of it

- At 1440px the demo dock's rail sits over '… Last sync 04 Jun 2026', hiding the year. Demo-only chrome, so low priority.

**Fix:** Pad the drill-down row's right edge by the wall-rail offset, or hide the dock's rail over content.

## Already conforms

- Corner radius — 915 of 915 measured radii are on the SAMAVESH scale; 58 of 63 `border-radius` declarations bind `--sa-shape-*`; the other 5 are `50%` circles.
- Font family — every text element renders Noto Sans (Material Symbols Rounded for icons).
- Spacing in TSX — 0 non-zero padding, margin or gap literals (one `margin: 0`); all bind `--sa-padding-*` / `--sa-stack-*` / `--sa-inline-*`.
- Tier boundary — 0 `--sa-ref-*` and 0 legacy `--ds-*` references.
- The masthead is the DS `SiteHeader` with `linkAs={Link}`; `SidebarNav`, `OrgLogo`, `Badge`, `Legend` and `Sparkline` come from the design system.
- Charts carry real text alternatives (`role="img"` with a label, plus a screen-reader table); `DrillDownSelect` is a correct ARIA listbox; every `outline: none` has a replacement focus style; `prefers-reduced-motion` and forced colours are handled.
- The All Indicators search has a real filtered-to-nothing state, and `SortableTable` a real empty state. Loading and error states do not apply: every figure is synthetic in-memory data.

## Not checked

- Screen-reader and keyboard behaviour in a real assistive technology — the ARIA findings are reasoned from the spec and the DOM, not observed with NVDA or VoiceOver.
- The `navy` and `dbim` brand modes; contrast was resolved for `blue` in light mode.
- Hindi rendering and truncation.
