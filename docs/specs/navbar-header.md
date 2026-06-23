# Spec: SAMAVESH Header family — pixel-exact Navbar (Website + Portal)

Status: approved · Owner: design-system · Date: 2026-06-22
Figma sources (authoritative):
- Accessibility Bar — `T3bkN5gNKfaNeY6dpT6FwF` node `2063-291641`
- Navbar **Website** — `T3bkN5gNKfaNeY6dpT6FwF` node `2210-11837`
- Navbar **Portal** — `u5eMCdX3a3mMZgnsHNn8XX` node `2210-11837`

---

## 1. Context

Every MoSJE property re-implemented its own masthead. The shared system must own
**one** Navbar that matches the two Figma "Navbar" variants pixel-for-pixel, so
the gov website and the portals render identical chrome from a single definition.

## 2. Component structure (one Navbar)

```
@mosje/design-system › Navigation › Header
├── SiteHeader   ← the SAMAVESH Navbar. ONE component, two variants:
│      • Website variant (Figma "Navbar Website") → search field + Login
│      • Portal variant  (Figma "Navbar Portal")  → toggle + divider + cobranding + account(+dropdown)
└── shared parts: BrandLockup, AccountMenu (account block: static, or dropdown when `accountMenu` set)
```

- `SiteHeader` renders **both** Figma navbar nodes via props (no second component).
- **Update (consolidation):** the earlier single-row `AppHeader` was **retired** —
  its only genuine extra (the account dropdown) folded into SiteHeader's account
  block via `accountMenu`. Sidebar portals (SMILE Admin, NMBA-TC) now render
  SiteHeader (portal variant, nav row omitted) above their sidebar.

## 3. Token map (Figma variable → `--ds-*`)

| Figma | Value | DS token |
|---|---|---|
| primary/source | `#0373df` | `--ds-primary` |
| text/light | `#fff` | `--ds-on-primary` |
| text/dark | `#343a40` / `#1f2428` | `--ds-ink` |
| text/hint | `#6c757d` | `--ds-ink-muted` |
| stroke/100 | `#f1f3f5` | `--ds-border` |
| stroke/50 | `#f8f9fa` | `--ds-border` (nav row) |
| stroke/200 | `#e2e6ea` | `--ds-border-strong` |
| gov-yellow | `#ffd323` | `--ds-gov-yellow` (BETA bg, black text) |
| primary/50 | `#e8f2fd` | font-size selection box (white@18% on blue) |
| primary/100 | `#c6dcf9` | `--ds-primary-100` (avatar bg) |
| primary/800 | `#01376b` | `--ds-primary-800` (avatar text) |
| gov-navy | — | `--ds-gov-navy` (navy `tone`) |

Type: Noto Sans. Sizes are literal px (component-specific), per existing DS authoring.

## 4. Tier-by-tier spec (both variants share Tiers 1 & 3)

### Tier 1 — Accessibility bar (shared)
- Height **40px**, bg `--ds-primary` (navy when `tone="navy"`), inner max-width **1320px**, padding `4px 24px`.
- **Left:** flag **33×22** r2 + "Government of India" (14/20, ls 0.1px, white) + external-link 12px → `india.gov.in`.
- **Right** (gap **24px**, 20px vertical separators between groups):
  - "Skip to Main Content" (14/20 white)
  - `|` font-size group: **A− / A / A+**, middle (`A`) shows a selected box.
  - `|` contrast icon (20px) · `|` accessibility icon (20px)
  - `|` language: globe 20px + "English" (12px) + caret.
- **No theme/colour-mode toggle.** (Confirmed absent in Figma.)

### Tier 2 — Brand row
- White bg, inner max-width 1320px, padding **12px 24px**, gap **24px**, items centered.
- **Brand lockup** (`BrandLockup`): emblem **52px** tall · optional blue gradient **divider** (portal) · text column gap 2px:
  - **BETA** badge on its own row — bg `--ds-gov-yellow`, black, 10/10 bold, ls 0.5px, pad 2/4, r2.
  - "Government of India" — 12/16, 500, ls 0.4px, `--ds-ink`.
  - "Ministry of Social Justice & Empowerment" — 14/16, 500, ls 0.4px, `--ds-ink`.
  - "Department of Social Justice & Empowerment" — 20/20, **700**, `--ds-ink`.
- **Website trailing:** search field (button) **417×56**, r8, border `--ds-border`, magnifier 24px in 8px pad, placeholder 16/24 ls 0.5px `--ds-ink-muted` → then Digital India mark (h40) → **Login** button (outlined primary, pad `10px 24px`, r8, 14/20 primary).
- **Portal trailing:** collapse toggle (menu icon, far left, 32px) → brand lockup **with divider** → Digital India (h40) + SAMAVESH (h44) cobranding → account block: name (16/24, 600, `--ds-ink`) + email (13/20, `--ds-ink-muted`) right-aligned + avatar **48×48** r8 bg `--ds-primary-100` text `--ds-primary-800` 18px.

### Tier 3 — Navigation row (shared)
- Bordered top+bottom (`--ds-border`), white, inner max-width 1320px.
- Items `justify-between`, each: pad **16px 12px**, r4, label 14/20 500 ls 0.1px `--ds-ink`; dropdown items add a 16px caret + `pr 8px`. Hover → `--ds-surface-muted` + primary text. Active → primary, 600.
- Below **1024px**: nav row hidden, a hamburger in Tier 2 opens a drawer.

## 5. Component API (`SiteHeaderProps`)

```ts
// Accessibility bar
govLink?: { href; label; flagSrc? };  skipTo?: string;  tone?: "blue" | "navy";
accessibilityToolbar?: boolean;  onFontSize?, onContrast?, onAccessibility?;  language?: { label?; onClick? };
// Brand row
emblemSrc: string;  emblemAlt?;  brandLines: { org?; ministry?; department };  beta?: boolean;
onToggleNav?: () => void;        // portal collapse toggle
brandDivider?: boolean;          // portal emblem divider
search?: { placeholder?; onSearch? };   // website search field
cobranding?: BrandMark[];        // Digital India / SAMAVESH
account?: { name; email?; role?; avatarSrc? };   // portal account block
actions?: React.ReactNode;       // Login / Apply Online
// Nav row
nav?: NavItem[];  maxWidth?: number /* 1320 */;
```

## 6. Files

| File | Change |
|---|---|
| `packages/design-system/components/navigation/header/site-header.tsx` | 3-tier component, both variants |
| `packages/design-system/components/navigation/header/brand-lockup.tsx` | BETA-on-top, 52px emblem, divider |
| `packages/design-system/components/navigation/header/header.css` | all Tier 1/2/3 rules, token-only |
| `packages/design-system/components/navigation/header/types.ts` | `BrandMark`, `HeaderAccount`, `NavItem`, … |
| `apps/dosje/src/components/Header.tsx` | website variant |
| `apps/portals/pm-ajay/src/components/shell/navbar.tsx` | portal variant |
| `apps/docs/src/app/components/header/{page.tsx,header-preview.tsx}` | both live previews + props |
| `apps/docs/src/lib/nav.ts` | "Navigation" category entries |
| `packages/design-system/design.md` | inventory note + date |

## 7. Acceptance criteria (pass/fail)

1. Website navbar at ≥1024px renders 3 rows: accessibility bar, brand row (emblem+BETA+3 lines · search field · Digital India · Login), nav row — matching Figma `2210-11837` (website).
2. Portal navbar renders: accessibility bar, brand row (collapse toggle · emblem **with divider** · Digital India+SAMAVESH · account name/email/avatar), nav row — matching Figma `2210-11837` (portal).
3. Accessibility bar shows **A− A A+** (middle selected), contrast, accessibility, English — and **no theme toggle**.
4. Emblem is 52px; BETA is a yellow badge on its own row above "Government of India".
5. One `SiteHeader` import drives **all** masthead surfaces: dosje (website), PM-AJAY, SMILE Admin, NMBA-TC (portal). `AppHeader` no longer exists.
6. Sidebar portals (SMILE Admin, NMBA-TC) render the portal variant with the nav row omitted; their sidebar sticky offset matches the ~116px header height.
7. `packages/design-system`, `apps/dosje`, `apps/portals/pm-ajay`, `apps/portals/smile-admin`, `apps/portals/nmba`, `apps/docs` all pass `typecheck` + `lint`.
8. Docs `/design-system/components/header` shows both variants live, under the **Navigation** category, with a 3-tier props table.

## 8. Testing plan

| Layer | What | How |
|---|---|---|
| Type | DS + 3 consumers compile | `npx tsc --noEmit` per package |
| Lint | DS + 3 consumers | `npm run lint` |
| Visual | Website navbar vs Figma | preview screenshot @1440 |
| Visual | Portal navbar vs Figma | preview screenshot @1440 (pm-ajay dashboard or docs portal preview) |
| Interaction | nav dropdown opens; mobile drawer | preview eval |

## 9. Out of scope
- Renaming `SiteHeader` → `Navbar` (the export name stays `SiteHeader`).
- Wiring real font-size/contrast behaviour (handlers are pass-through; controls render to match Figma).
- Code Connect mappings (follow-up).

## 10. Known dev-server gotcha (process note)
Next 16 **Turbopack** serves dev CSS under a **stable chunk URL**; the browser
caches old CSS across edits. After header CSS changes, hard-refresh
(Cmd+Shift+R) or cache-bust the `<link>` — otherwise visual verification shows
stale styles even though source + `.next` are correct.
