# Navbar — component specification

The SAMAVESH masthead. Eight Figma components backing one code component, `SiteHeader`, in
two variants: `website` (public, content-led) and `portal` (signed-in dashboards), plus one
shared dependency (`SAMAVESH`, which lives on the Iconography page).

- **Figma library**: `3FF5l0SMNIwdpZrKkeyPTm`, page **Navbar**
- **Documentation frame**: [`4317:1922`](https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4317-1922)
- **Code**: `packages/design-system/components/navigation/header/`
- **Status**: Beta · **Version 2.3.0** · last updated 12 August 2026

## Code component

```tsx
import { SiteHeader } from "@mosje/design-system";

<SiteHeader variant="website" emblemSrc={emblem} brandLines={lines} nav={items} />
<SiteHeader variant="portal" sticky emblemSrc={emblem} brandLines={lines} account={user} />
```

## Anatomy

Three tiers, top to bottom:

1. **AccessibilityBar** — Government of India link (left); skip-to-content, font size,
   accessibility options and language (right). `Font size` is **ON** (changed 2026-08-18;
   this line said "off" until then). Text size is the bar's own mechanism now that its
   stepper actually scales the root font size; the UX4G widget keeps contrast, spacing
   and dark mode, and its floating button is hidden wherever the bar offers the entry.
   All 21 nested AccessibilityBar instances on this page already had `Font size` ON —
   the code was the outlier, not the library. See
   `docs/design-system/components/accessibility-bar.md`.
2. **Brand row** — National Emblem lockup + government wordmark, optional BETA badge,
   search, and the primary action (Login on the website, account menu on portals).
3. **Navigation row** — nav items with simple dropdowns and the mega-menu. Rendered only
   at `min-width: 1024px`; below that the burger opens a drawer.

## The family — Figma ↔ code

Named to match the code contract. Ordered as the Props & API table orders them:
assembled mastheads, then menus, then navigation parts, then brand.

| Figma component | Code |
| --- | --- |
| `Navbar/Website` | `<SiteHeader variant="website" />` |
| `Navbar/Portal` | `<SiteHeader variant="portal" />` |
| `Navbar/MegaMenu` | `NavItem.columns` → mega-menu grid |
| `Navbar/MegaMenuItem` | `NavColumn.items[]` → emblem + name row |
| `Navbar/NavItem` | `<NavItem label href active />` |
| `Navbar/NavDropdown` | `NavItem.children` → simple menu |
| `Navbar/DropdownItem` | `NavItem.children[]` → menu row |
| `Navbar/BrandLockup` | `<BrandLockup />` |
| `SAMAVESH` *(shared — Iconography page)* | `cobranding[]` → SAMAVESH seal |

## Properties

**Variants encode structure; everything else is a property** (rule §4).

| Set | Axis | Values (in set order) |
| --- | --- | --- |
| `Navbar/Website` | `Device` | Mobile · Tablet · Desktop |
| | `State` | Default · On Scroll · Drawer Open |
| | *properties* | `Search`, `Login Signup` (BOOLEAN) |
| `Navbar/Portal` | `Device` | Mobile · Tablet · Desktop |
| | `State` | Default · On Scroll |
| | *properties* | `Search`, `Login Signup`, `Show Navbar` (BOOLEAN) |
| `Navbar/NavItem` | `Type` | Default · Dropdown |
| | `State` | Default · Hovered · Focused |
| | `Active` | False · True |
| | *properties* | `Label` (TEXT) |
| `Navbar/MegaMenu`, `NavDropdown`, `BrandLockup` | `Device` | Mobile · Tablet · Desktop |
| `Navbar/MegaMenuItem`, `DropdownItem` | `State` | Default · Hovered · Focused |
| `Navbar/MegaMenuItem` | *properties* | `Org logo` (INSTANCE_SWAP) |
| `Navbar/BrandLockup` | *properties* | `Show beta` (BOOLEAN) |

**Ordering principles** (rule §10), stated so they are predictable:

- `Device` ascends by viewport: **Mobile → Tablet → Desktop**. Variants are laid out in
  that order too, one row per device.
- `State` is **Default first, then by increasing divergence from rest** — so
  `Default → Hovered → Focused` for interaction states, `Default → On Scroll → Drawer Open`
  for layout states.

## Token map

| Property | Bound to |
| --- | --- |
| Bar height | `layout/bar/height` |
| Flag width | `layout/flag/width` |
| Content container | `layout/container/wide` / `layout/container/narrow` |
| Frame widths | `ref/viewport/mobile` · `ref/viewport/tablet` · `ref/viewport/desktop` |
| Surfaces | `bg/neutral/*`, `bg/brand/primary/*` |
| Ink | `text/neutral/*`, `on/*` on filled surfaces |
| Icons | `Icon/16/Outline` · `Icon/20/Outline` · `Icon/24/Outline` (Material Symbols Rounded, Light) |
| Type | the 21-role ramp — `Display/*`, `Headline/*`, `Title/*`, `Body/*`, `Label/*` |
| Radius | `shape/*` |
| Spacing | `padding/*`, `stack/*`, `inline/*`, `section/*` |
| SAMAVESH seal | `ref/brand/samavesh/*` (Static — never re-themes) |

### Library-locality audit (12 August 2026)

| Check | Before | After |
| --- | --- | --- |
| Remote component instances | 2 | **0** |
| Bindings to foreign collections | 250 | **0** |
| Remote styles | 0 | **0** |
| Spacing bound to typography variables | 55 | **0** |
| Documentation frame binding (fills/strokes/padding/gap/radius/text) | 81/100/11/5/94/33 % | **100 % on all six** |

The 47 residual bindings the audit reports are `Type` collection variables (`Font Size/*`),
which are **local** — they are hidden from publishing, so `getLocalVariablesAsync()` omits
them and a naive locality check false-positives on them.

## Accessibility

Target **WCAG 2.1 AA + GIGW 3.0**:

- **2.4.1 Bypass Blocks** — "Skip to Main Content" is the first focusable element.
- **2.1.1 Keyboard** — every control keyboard-operable; `Esc` closes a menu and returns
  focus to its trigger; `Home`/`End` jump within a menu.
- **2.4.7 Focus Visible** — `Focused` state on `NavItem`, `DropdownItem`, `MegaMenuItem`.
- **1.4.3 Contrast** — AA on the real surface.
- **2.5.8 Target Size** — controls meet `target/min`.

Semantics: `nav[aria-label]` landmark · `aria-current="page"` on the active item ·
`aria-expanded` + `aria-haspopup="menu"` on triggers · `role="menu"`/`menuitem` on rows.

## Changed in 2.3.0

- **Renamed the family to code-aligned `Navbar/*` PascalCase.** `sitebar`/`appbar` were
  invented jargon; the code has one `SiteHeader` with `variant="website"|"portal"`. All
  eight sets edited in place, so component keys and every instance link survive (rule §11).
- **Repaired the shared SAMAVESH seal in place** (`4033:1920`, Iconography page →
  `Common Gov Icons`). It carried **74 bindings to a foreign `Color Styles` collection** —
  the only external dependency in the family. All 94 fills are now bound to a fixed
  **`ref/brand/samavesh/*`** palette (7 tokens) added to `Static`, so the logo cannot
  re-theme when the Palette or Density mode changes. Because the fix landed on the
  original rather than a copy, **every consumer across the estate benefits**, not just
  the Navbar.

  > **Process note.** This was first "fixed" by creating a duplicate,
  > `Navbar/SamaveshMark`. `search_design_system` and `importComponentByKeyAsync` return
  > the *published* handle for a component even when its master is local, so the import
  > reported `remote: true`; a search of the Navbar page alone found no local master and
  > the wrong conclusion followed. The master was on the Iconography page all along, with
  > the same key. **Scan every page (`page.loadAsync()` in a loop) before concluding a
  > component does not exist locally** — it costs one call. The duplicate has been deleted
  > and both instances re-pointed at the original.
- **Rebound 55 padding/gap fields** that pointed at `Font Size/3` and `Font Size/6`.
  They passed a naive "is it bound?" audit while meaning the wrong thing.
- **`Font size` set off on all 13 nested AccessibilityBar instances**, matching
  `site-header.tsx`. It had silently reverted to the component default.
- Props & API table rewritten to 9 code-aligned rows; family count corrected to 9.

## Changed in 2.2.0

- Re-pointed all 13 nested AccessibilityBar instances off the deprecated
  `AccessibilityBar — v1 (legacy · Device only)` set onto the rebuilt `AccessibilityBar`
  (Desktop → `Layout=Wide`; Mobile/Tablet → `Layout=Fluid`). Stale overrides from the old
  set were resetting — one was painting the "Government of India" link white on white.
- Reordered every `Device` axis mobile-first and regridded each set to match.
- Title-cased `State=on Scroll` → `State=On Scroll`.
- Bound 118 component text nodes and 129 documentation text nodes to published styles.
- Moved the "at a glance" stats into the Hero; renamed 42 generic `Frame` layers.
- Rewrote Theming as **Brand & density** — it showed a Navy specimen labelled
  `data-color-mode="blue-dark"`, documenting a dark mode the library does not have.

## Decisions flagged for the human

1. **The Figma Tablet variant contradicts the code.** `header.css` renders `.ds-hdr-nav`
   only at `min-width: 1024px` and hides the burger at that width — so at 800px the code
   shows a burger and **no nav row**, while `Navbar/Website` `Device=Tablet, State=Default`
   carries a full nav row. Either the Tablet variant loses its nav row and gains a
   `Drawer Open` state, or the breakpoint moves. `Device=Tablet, State=Drawer Open` is
   deliberately **not** added until this is settled.
2. **The wordmark uses Noto Sans Bold, and the ramp has no Bold role.** 35 nodes at
   8/10/14/20px Bold across `Website`, `Portal` and `BrandLockup`. Either move them to
   SemiBold roles (a visible weight change to the government wordmark) or add Bold roles.
   The 29 `lineHeight`/`paragraphSpacing` bindings still on `Font Size/*` are the same nodes.
3. **Wordmark text below the 11px floor** — the mobile lockup sets government lines at
   **7px and 8px**. A real legibility issue, not a specimen.
4. **12px icons are off the sanctioned scale.** 13 Material Symbols nodes at 12px, but
   `icon/size/*` publishes only 16/20/24/32/40/48/64 after the DBIM 3.0 reconciliation.
5. **The shared `SAMAVESH` seal's ring lettering is live text at ~2.7px.** Correct at the
   seal's 40px display size, and it is artwork rather than typography — but it is 83 live
   text nodes, so a font substitution would break the mark. `outlineText()` is not exposed
   in the plugin sandbox, so vectorising needs a manual pass in the Figma editor
   (select the text → Outline). Worth doing on the original, once.
6. **The legacy AccessibilityBar v1 set could not be labelled deprecated** — it is not
   reachable from the Navbar or Accessibility Bar pages, so its home page is unknown. Zero
   Navbar instances reference it.

## Scroll behaviour — added 27 August 2026

**`sticky` defaults ON for every variant**, not just portals. The public masthead used
to scroll away entirely: 200px of chrome, then no navigation, no search and no identity
for the length of a scheme page. Search is the fallback for navigation and GIGW 5.2 wants
it in a consistent position on every page; neither survives a masthead that leaves.

**The accessibility bar is not pinned with it.** The header sticks at
`top: calc(-1 * var(--sa-hdr-abar-h))`, so tier 1 scrolls away and tiers 2–3 stay. It
carries page-level preferences, not per-scroll chrome.

**`collapseOnScroll` swaps the three tiers for one bar** (`.ds-hdr-cond`), 200 → 65 on
desktop and 258 → 57 on a phone. This REPLACED the old Figma `State=On Scroll`, which
dropped the lockup's ministry line to take the brand row 100 → 88 — measured 146 → 134
on the live portal, twelve pixels, for a class, a listener, a media-query set and a
variant.

| | Resting | Condensed |
| --- | --- | --- |
| Accessibility bar | 46px | scrolled away |
| Brand row | 100px, emblem 64 + 3 lines + BETA | emblem 32, no text |
| Nav | own 54px tier | same items, inline on the bar |
| Search | 320px field | 40px icon, expands in place |
| **Total** | **200px** | **65px** |

**The emblem holds the same left edge in both states.** It is also the go-home control,
and an identity mark that crosses the screen on scroll reads as a different site. The
department NAME is the sacrifice — one scroll back up, and still in the page title, the
h1 and the footer. Printing restores the full masthead (`beforeprint`), because on paper
the name is gone for good.

**Threshold 120px down, 40px back**, not one value. A single threshold on a state that
changes document height is a latch waiting to oscillate.

### Capacity

At 1280px the content column is 1200; after its padding, the emblem, the search button
and the CTA, the nav has **880px**. Seven entries measure **837** — 43px of slack against
the ~96px an eighth needs. `SiteHeader` measures itself and hands the nav to `NavSheet`
rather than letting items overlap, so a 1280px laptop trades the inline row for the sheet
trigger; 1440 and up still fit eight. The note lives beside the nav array in
`apps/hub/src/components/website/Header.tsx`, where the eighth entry gets added.

### Mobile accessibility controls

Below `breakpoint/tablet` the accessibility bar sheds font size, accessibility options and
language — the Figma master's own call. `NavSheet` renders them as a labelled section
(`AccessibilityControls`, `variant="sheet"`), and the UX4G floating button returns on
mobile as a second route, suppressed only while the sheet is open. Until 27 August 2026
nothing picked them up at all: measured at 375px, all three had `offsetParent: null` and
the sheet held no replacement.

### Container

Every tier takes `--sa-container-page` — the 1200 / 1320 / 1440 ladder — on website and
compact, and full-bleed on portal. Tier 1 used `--sa-container-wide`, a flat 1200, so on
a 1440 screen the accessibility bar sat 60px narrower than the masthead below it and
120px at 1920. `AccessibilityBar` gained `layout="page"` for this.

## Adoption — complete

`SiteHeader` is the masthead on every surface in the estate: the website, all portal
shells (`e-anudaan`, `eutthan`, `nhapoa`, `nmba` × 3, `pm-ajay`, `scw`, `smile-admin`,
`tg`) and the hub's own index, admin and reports pages. `npm run check:chrome` enforces
it across 855 files and passes — no surface hand-rolls a masthead or an accessibility bar.

The four conversions this document previously listed as outstanding — `tg/gov-chrome`,
`nmba/public-shell`, `scw/gov-chrome` and `nhapoa/gov-chrome` — have all landed, and the
`right` slot question resolved as the document proposed: each portal's `UserMenu` maps
onto `account` + `accountMenu`, with no arbitrary trailing slot added.

**`BrandLines` still has no `tagline`.** NHAPOA ships the inversion this document warned
about: `ministry: "National Helpline Against Atrocities"` above `department: "SAMBAL संबल"`,
so the tagline reads above the bold line rather than beneath it. That is a live
compromise, not a solved problem — reopen it if a second portal needs the same shape.
