# SAMAVESH Design System — Navbar Component Publish-Readiness Audit

> **Scope:** the `Navbar` page (`node 2141:323870`) in the SAMAVESH Design System Figma file (`qyzTEy8dlb3ssYctlkMX5o`) — its documentation frame *and* its source sticker-sheet section.
> **Reviewer stance:** senior DS manager, benchmark = top-10 published design systems (Polaris, Spectrum, Carbon, GOV.UK, Material 3, Fluent).
> **Rubric:** the 6 dimensions from `samavesh-ds-figma-remediation-plan.md` §1.
> **Date:** 2026-07-01.

---

## 0. Verdict

**Grade: B+ / "excellent build, incomplete publication."**

This is one of the strongest components in the file — it is *built* to a high standard (real variants, real variables, responsive, mega-menu, guidelines). It is **not yet publish-ready** because the parts that make a component *trustworthy to consume without asking the author* are thin or missing: **no accessibility spec, no anatomy, no props/API table, no dark-mode proof, and confirmed missing focus states on menu items.** These are exactly the things a developer or another designer hits five minutes after subscribing.

Fixing the P0/P1 list below moves it to **A / reference-grade**. None of it requires new component work — it is annotation, state backfill, and reconciliation.

---

## 1. What is already excellent (keep, don't touch)

| Area | Evidence |
|---|---|
| **Documentation-as-a-page** | A 1680-wide `Navbar — Documentation` frame with a proper narrative: Hero → 01 Variants → 02 Responsive → 03 Mega-menu → 04 Parts → 05 Guidelines → 06 At a glance. This is the right shape. |
| **Source separated from docs** | A `Sticker Sheet — source components` section holds the real component sets; the doc frame instances them. Correct pattern. |
| **Status label present** | Hero carries a `BETA` badge — aligns with the WS-0.3 status system. |
| **Real variant matrices** | `nav-item` = Type (Default/Dropdown) × State (Default/Hovered/Focused) × Active (T/F) = 12 variants. `navbar/appbar` = Device × State (Default / on Scroll). Clean, orthogonal properties. |
| **Token-bound** | Source components resolve to variables — `Label/label-1`, `spacing-*`, `radius-*`, `Primary/Source #0373df`, `Neutral/*`, `Line Heights/*`. Not hard-coded. Matches the "100% local tokens" claim. |
| **Responsive is shown, not asserted** | Desktop/Tablet(800)/Mobile(360) rendered for sitebar; drawer collapse called out. |
| **Guidelines encode the house rules** | Do/Don't explicitly bans the tricolour stripe, emblem replacement, disabling keyboard nav, and hard-coded values — the standing MoSJE instructions are baked in. |

---

## 2. Scorecard vs the benchmark rubric

| Dimension | Score | Note |
|---|---|---|
| **Governance** | 🟡 B | Status badge exists, but no version, no "last updated", no owner, no changelog link on the component page. |
| **Token architecture** | 🟢 A− | Variable-bound throughout. Minor: verify no stray hard-coded hex in sitebar/appbar; reconcile `sitebar`/`appbar` names vs code `SiteHeader`. |
| **Information architecture** | 🟢 A | Narrative order is correct and scannable. |
| **Naming conventions** | 🟡 B | `navbar/sitebar`, `nav-item`, `dropdown-item` are lowercase-slash; **`Logo` is Title Case** — inconsistent namespace within one family. |
| **Component quality** | 🟠 C+ | **The gap.** No anatomy, no a11y spec, no props table, missing menu-item focus states, no dark mode. Details below. |
| **Onboarding/adoption** | 🟡 B | Do/Don't + At-a-glance are good; but a consumer still can't answer "what props exist?" or "how do I theme it?" from the page. |

---

## 3. Confirmed gaps (evidence-based) — the punch list

### 🔴 P0 — blocks publish

**P0-1 · Missing focus state on menu items (accessibility defect, not just doc gap).**
`dropdown-item` has only `State=Default, State=Hovered`. `mega-menu-item` has only `State=Default, State=Hovered`. Neither has a **Focused** variant. `nav-item` correctly has Focused — the child menu items do not. Keyboard users navigating an open dropdown/mega-menu have **no visible focus indicator specified**, which fails WCAG 2.4.7 (Focus Visible) and the file's own "don't disable keyboard navigation" rule.
→ **Fix:** add `State=Focused` (visible focus ring, `--ds` focus token) to `dropdown-item` and `mega-menu-item`; showcase it in §04.

**P0-2 · No accessibility specification.**
The page *claims* "WCAG 2.1 · GIGW 3.0 AA" in §06 and mentions keyboard nav in Do/Don't, but there is **no A11y section** documenting the actual contract: keyboard model (Tab / Arrow / Esc / Enter / Home-End), ARIA roles (`nav`, `aria-current="page"`, `aria-expanded`, `aria-haspopup`, menu/menuitem), focus order, focus-ring token + contrast value, minimum target size (44×44 / GIGW), and the Skip-to-Main-Content link behaviour (it is visible in the render but undocumented). For a government DS this is the single most important missing artifact.
→ **Fix:** add an `A11y` section (template from WS-4.1) with the keyboard table, ARIA map, contrast values, and target sizes.

**P0-3 · The "Active" state shown in §04 hides the Focused state.**
§04 Parts displays `Default · Hovered · Active · Dropdown` but the source has a **Focused** variant that is never shown. The most a11y-critical state is present in the component but invisible in the documentation.
→ **Fix:** add Focused to the §04 state row (Default · Hovered · **Focused** · Active · Dropdown).

### 🟠 P1 — needed for reference-grade

**P1-1 · No anatomy diagram.** There is a "Parts" section but no labelled-callout anatomy of the *assembled* header (utility/accessibility bar → brand lockup → search → primary nav → login/account). Benchmark components lead with anatomy.

**P1-2 · No props / API table.** Props are mentioned inline (`variant="website|portal"`, `NavItem.columns`, `NavItem.children`, Device, State) but never consolidated. **Because Code Connect is out of scope** (and the current seat can't use it — confirmed: "need a Dev/Full seat"), a written props table is the *only* Figma↔code bridge. This is mandatory here, not optional.

**P1-3 · Dark mode not demonstrated.** The DS ships `blue-light` + `blue-dark` modes. Every navbar specimen is `blue-light`. A reference component must prove it themes — show the masthead in `blue-dark`, or explicitly state the dark-mode status.

**P1-4 · Naming inconsistency: `Logo` vs `navbar/*` / `nav-*`.** Pick one namespace for the family (recommend `navbar/logo`).

**P1-5 · Scroll behaviour is asymmetric and unexplained.** `appbar` (portal) has `State=on Scroll`; `sitebar` (website) has none — yet Do/Don't references "collapse-on-scroll" for the website. Either add the website scroll state or document that collapse-on-scroll is CSS-only (not a Figma variant) and why.

**P1-6 · The §06 count doesn't reconcile.** "9 COMPONENTS IN THE FAMILY" but the sticker sheet contains **8** sets (sitebar, appbar, mega-menu, mega-menu-item, nav-item, nav-dropdown, dropdown-item, Logo). Either a 9th component (search field? accessibility toolbar? mobile drawer?) is referenced but not on the sheet, or the number is stale. A benchmark stat must be true. → **Verify and correct.**

### 🟡 P2 — polish to "best in industry"

- **P2-1 · Component descriptions** for the asset panel / Dev Mode (the text that appears when someone hovers the component in the Assets tab). Verify each of the 8 sets has one; add if empty.
- **P2-2 · Governance strip on the page:** version, last-updated, owner, "Report an issue" / changelog link in the hero.
- **P2-3 · Long-text / localisation note:** the language switcher implies Hindi; document how the brand lockup + nav behave with longer Devanagari strings.
- **P2-4 · `nav-item` disabled state decision:** there is no Disabled variant. That's probably correct (nav items are rarely disabled) — but state the decision so its absence reads as intentional, not forgotten.
- **P2-5 · Reconcile Figma names with `@mosje/tokens` / code** (`sitebar`→`SiteHeader`) per WS-1.6 so the props table's code names are exact.

---

## 4. Publish-readiness checklist (definition of done for this component)

**Status: executed 2026-07-01 (v2.1.0, in-file). Remaining = human-only steps.**

- [x] `dropdown-item` + `mega-menu-item` have a **Focused** variant with the shared token-bound focus-ring effect style (P0-1)
- [x] **06 States & Accessibility** section added: keyboard model table, ARIA map, WCAG criteria chips (P0-2)
- [x] §05 Parts now shows the Focused state, in order Default · Hovered · Focused · Active · Dropdown (P0-3)
- [x] **01 Anatomy** section added — sitebar specimen + numbered region legend (P1-1)
- [x] **07 Props & API** section added — Figma→code map + prop reference (the Code-Connect substitute) (P1-2)
- [x] **08 Theming** section added — real Blue-Light + Blue-Dark specimens (P1-3)
- [x] `Logo` renamed to `navbar/logo` (P1-4)
- [x] Scroll behaviour documented in the Props table (appbar `on Scroll` is a code/CSS behaviour; sitebar has no Figma scroll variant by design) (P1-5)
- [x] §11 "9" reconciled to the true count **8** (P1-6)
- [x] All 8 component sets have asset-panel **descriptions** (P2-1)
- [x] **10 Governance** section added — status system, version 2.1.0, owner, last-updated, lineage, changelog (P2-2)
- [ ] **Human-only:** verify on one consumer → **re-publish the library once** → flip Hero badge `BETA → Ready`. (Plugin API cannot branch or publish; left deliberately as the release gate.)
- [ ] **Follow-up (system-wide):** the shared focus-ring effect style renders at 48% primary — confirm it meets WCAG 1.4.11 (3:1 non-text contrast) on every surface; if not, raise opacity once, system-wide (affects nav-item too, so out of scope for this component alone).

---

## 5. Recommended execution

Same governance as the master plan (§3): **do it in a Figma branch**, verify one consumer relinks, single re-publish.

1. **Backfill states** (P0-1) — cheap, unblocks the a11y claim.
2. **Write the A11y + Props + Anatomy sections** (P0-2, P1-1, P1-2) — pure annotation, highest trust-per-hour.
3. **Dark-mode specimen** (P1-3).
4. **Naming + count + scroll reconciliation** (P1-4/5/6) — mechanical.
5. **Descriptions + governance strip** (P2).
6. Flip `BETA → Ready`, re-publish once, note it in the Changelog & Governance page (WS-0.1).

This is roughly **1–1.5 designer-days** and lands the component at reference-grade without any new component modelling.

---

## 6. Out of scope (inherited from master plan)

- Code Connect (seat-blocked + explicitly out of scope) — its absence is *why* the props table (P1-2) is mandatory.
- Splitting the file.
- New components beyond the existing 8.

---

## 7. Wave 2 — org logos, local-token purity, states, responsive (2026-07-01)

### ① Org logos — DONE
- Discovered a local `org-logo` set (16 orgs) that the mega-menu ignored — it baked raster `Image` rects, so some rows showed real logos and others the grey emblem placeholder.
- Rewired `mega-menu-item` (all 3 variants) to a **bound `org-logo` INSTANCE_SWAP** property ("Org logo"), replacing the raster. Single source of truth.
- Swapped all rows to the correct org: **desktop (12) + tablet (12) + mobile (12)**.
- Set an `org-logo` description enforcing reuse.
- **Follow-up (content):** 5 `org-logo` variants are still emblem placeholders — **NCSK, DAF, JRF, DWBDNC, SCW** need real artwork (now fixable in ONE place; every consumer updates automatically).

### ② Local-token purity — DONE at navbar level (0 remote vars / styles / components)
**Final state:** the navbar's own level is **100% local** — every variable, text style, and component *the navbar references* is now local (was 69 remote vars, 5 styles, 15 components). All icon, button, icon-button, avatar, search, and accessibility-bar instances swapped to local twins; masthead verified intact.
- **Letter-spacing note:** `Letter Spacing/3` (0.5) and `Letter Spacing/5` (0.4) had no local token (the local system doesn't tokenize letter-spacing) — unbound to raw values (no visual change, no external ref).
- **Deeper (library-wide) tail — NOT navbar scope:** the *local* `Search` and `AccessibilityBar` components still carry, inside their own definitions, a handful of remote refs from a `gov.in` Material library (3 vars, 1 text style `gov.in/sys/light/on-surface-variant`, 3 components incl. `more_vert_24px`). Localizing those means editing those source components across the file — a separate library-wide pass, recommended as its own task.
- **Chevron (your edit):** `mega-menu-item` now uses a `Material Symbols Rounded` **text glyph** for the chevron instead of an icon component. Weight 300 matches the SAMAVESH standard, but it depends on the font being present on open/export (else shows literal "chevron_right"); consider switching to the local `chevron-right` icon component for consistency + robustness.

#### (superseded) earlier snapshot — styles 100%, variables ~96%
Finding: the navbar bound to **duplicate external-library copies** of tokens/styles/components while local twins exist in this same file. Confirmed it is **drift**, not a real external dependency. (The "navy vs blue" scare was a false alarm: `Blue-Light`/`Blue-Dark` are two *brand modes* of the same tokens — the navy is `Primary/Source` resolved in the Dark mode.)
- **Text styles: 100% local** — 5 remote styles swapped to local (2 outliers snapped 13→12px, 18→16px to the local scale).
- **Variables: 66/69 local** — 635 scalar + 280 paint bindings rebound to local by name/value (mode-aware). The last **3** (`Primary/Source`, `Letter Spacing/3`, `Letter Spacing/5`) live *inside* the remaining remote components and resolve when those are swapped.
- **Components: icons + primary buttons localized** — 19 Material Symbol icon instances swapped to local Icons-page twins; 4 Button instances swapped to the local `Button` set. Verified no visual regression.
- **Remaining remote components (4 types):** `Accessibility Bar` (Desktop/Tablet/Mobile), `Search`, `Avatar`, `Icon Button` (×2). Local twins exist (`Accessibility Bar and Widget`, `Search`, `Avatars`, `IconButton` pages). `Accessibility Bar` + `Search` are **large masthead structures** — swapping them can relayout the header, so they need a careful verify pass (flagged for sign-off, not mass-swapped blind).

### ③ States — BUILT
- **`appbar` on-scroll** now genuinely condenses (it was previously a no-op identical to Default): utility bar dropped + elevation. Added for **Desktop (fixed), Tablet, Mobile** (94 / 94 / 126px).
- **`sitebar` on-scroll**: added a **`State` axis** to the sitebar set (was Device-only) and built a condensed **Desktop on-scroll** (utility bar hidden + elevation, 186→146px). Existing doc instances verified intact after the rename.
- **Mobile drawer-open**: built `Device=Mobile, State=Drawer Open` — collapsed bar + a full stacked nav-link panel (Home, Ministry, Organisations, Schemes, Offerings, Documents, Events & Gallery, Connect) with submenu chevrons + dividers.
- **Standard applied:** on-scroll = drop the top utility bar + add elevation (the common sticky-condense pattern).
- **`sitebar` Tablet on-scroll — added** (condensed, elevation).
- **Accessibility of on-scroll (final ruling):** the utility/accessibility bar is **kept visible on scroll** (revised — not hidden). Its accessibility icon triggers the accessibility drawer, and the floating-FAB corner is reserved for the chatbot. On-scroll instead condenses by **shrinking the brand block** (hiding the "Government of India" / "Ministry of…" supra-lines, keeping the emblem + department title) + elevation. All a11y controls (text-resize / contrast / language / skip-link) stay reachable at every scroll position — WCAG 1.4.4 / GIGW safe.
- **Icon-font finding + workaround:** `Material Symbols Rounded` **cannot be loaded via the MCP plugin API** (every style fails — it's a Google font available in the Figma *desktop app* but not the plugin sandbox). New glyphs can't be authored programmatically, but **cloning an existing glyph node works** (no font-load) — used to give the mobile-drawer chevrons real text glyphs. Code: load Material Symbols Rounded via the Google Fonts API (`?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,300,0,0`).
- **Faint-visible chevron:** mega-menu-item Default chevron set to opacity 0.4 (→1 on hover/focus) — the house hover-reveal pattern (no blank reserved space).

### ⑥ Visual & standards audit — PASS (1 fix)
- **Typography:** now **Noto Sans + Material Symbols Rounded only** — found and fixed **Roboto** on the "English" language-switcher label (6 instances) → Noto Sans Medium. (Source `AccessibilityBar` component still has Roboto internally — library-level follow-up.)
- **No tricolour-stripe motif:** confirmed (saffron fills are the national flag in the "Government of India" identifier — the official mark; zero green fills → no saffron-white-green band). National Emblem used for brand. ✓
- **Tokens:** navbar 100% local; colours/spacing/radii token-bound. ✓
- **Structure:** 0 detached instances after all edits; instance-swaps and focus rings intact. ✓
- **Minor (token hygiene):** 33 unbound text fills remain (BETA badge ×7, avatar initials, a few inside swapped components) — cosmetic tokenisation nit, not a blocker.

### ⑤ Icon standard — documented
Updated `packages/design-system/design.md` §Icon to the **text-glyph** standard (Material Symbols Rounded, weight 300, size 24, token colour), the hover-reveal no-layout-shift pattern, and org-logo reuse. (Was incorrectly "Material Symbols Outlined".)

### ④ Tablet/mobile variants — APPROPRIATE (audited)
- Both breakpoints exist and behave well: tablet wraps nav to a 2nd row and keeps toggles; mobile drops text-size/contrast toggles → search + hamburger; mega-menu goes 2-col → 1-col scroll.
- **Fixed:** tablet website button read "Admin Login" while desktop read "Login" → unified to "Login".
- **Gap:** the drawer-open state above (③).
