# SAMAVESH — Accessibility / High-Contrast Consolidation

> **Decision (2026‑07‑01, updated):** The **official Government of India (MeitY / UX4G) Accessibility Widget** is the **single, canonical accessibility mechanism** for the entire MoSJE estate (all 20+ portals + website). High-contrast, text-size, spacing, link-highlight, dark mode and the rest are delivered by this ONE official widget — **not** by a bespoke reimplementation, not by per-app toggles, not by a raw token theme mode.
>
> This is the correct government answer: the official widget is **WCAG + GIGW + IS 17802** compliant and centrally maintained by MeitY. It must be **documented in Figma, in the code-side DS, and in the DS portal**, and **adopted across every app**.
>
> **Why this doc exists:** an audit found **three parallel/bespoke High-Contrast implementations** plus dead a11y controls — and we were maintaining our own widget when an official one exists. This is the reconciliation plan.

---

## 1. The canonical mechanism (source of truth)

**The official UX4G Accessibility Widget.** Docs: https://doc.ux4g.gov.in/ux4g-accessibility/accessibility-widgets.php

**Embed (authoritative):**
```html
<script src="https://cdn.ux4g.gov.in/accessibility-beta-v1.15/accessibility-widget.js" defer></script>
```
Place before `</body>`. Officially supports HTML, PHP, JS, TS, Angular, **React.js, Next.js**, Ionic, Drupal, WordPress, AngularJS. Compliance: **WCAG, GIGW, IS 17802**.

**In this codebase — use the shared wrapper (do NOT hand-embed the script):**
```tsx
import { UX4GAccessibilityWidget } from "@mosje/design-system";
// …render once near the end of the root layout, like AppSwitcher:
<UX4GAccessibilityWidget />
```
- Component: `packages/design-system/components/a11y/ux4g-accessibility-widget.tsx`
- Framework-agnostic (injects a plain `<script data-ux4g-a11y="true" defer>`; no `next/script` dependency), idempotent (loads once per document), version-pinnable via the `src` prop.
- Reference integration: **`apps/dosje/src/app/layout.tsx`** (live).

**DOM note:** the official widget applies the class **`.dark-mode`** to `<html>` for its dark theme. This is **distinct** from the design system's own `data-theme` / `data-color-mode` token theming — see §3 (integration caveat).

---

## 2. Inventory — what to keep vs retire

| # | Implementation | Location | Verdict |
|---|---|---|---|
| **★** | **Official UX4G widget** via `UX4GAccessibilityWidget` | `packages/design-system/.../ux4g-accessibility-widget.tsx` | ✅ **CANONICAL — adopt everywhere** |
| A | Bespoke `AccessibilityWidget` (React reimplementation) | *(removed)* | ✅ **DELETED** — replaced by the official widget everywhere; component and CSS removed from `packages/design-system/components/a11y/` |
| B | `useA11yToolbar()` + `data-theme="hc"` token overlay | `packages/design-system/.../header/a11y-controls.ts` + `packages/tokens` | ⚠️ **DEPRECATED** — orphaned; retire the hook (keep the `hc` token values only if still referenced) |
| C | App-context HC toggle `data-highcontrast` + local CSS | `apps/portals/smile-admin` | ⚠️ **DEPRECATED** — remove; replace with the official widget |
| — | Dead contrast buttons | `apps/portals/scw/.../gov-chrome.tsx` | ❌ **Non-functional** — remove; the widget provides contrast |

---

## 3. Integration caveat to resolve (theming)

The official widget owns **accessibility contrast + its own `.dark-mode`**. The design system separately ships **design dark mode** via `data-theme="dark"` and **brand** via `data-color-mode="blue-dark"` (token-driven). These are two different notions of "dark":

- **Accessibility dark/contrast** → owned by the official widget (`.dark-mode`, user-driven a11y preference).
- **Design/brand theming** → owned by tokens (`data-theme` / `data-color-mode`, product-driven).

**Recommended stance:** let them coexist with clear ownership — the widget is the *citizen-facing accessibility* control; token theming stays for *product/brand* rendering. If a page should visually react to the widget's `.dark-mode`, add explicit `.dark-mode …` CSS overrides. **Do not** wire the widget to toggle `data-theme` automatically without a deliberate decision + QA (risk of double-dark or fighting states). The orphaned `[data-theme="hc"]` token overlay (Mechanism B) is now redundant with the widget's contrast — keep the `--sa-color-a11y-hc-*` values only if something still references them.

---

## 4. Migration plan ("use it across the project")

1. ✅ **Shared component created** — `UX4GAccessibilityWidget` in `@mosje/design-system`.
2. ✅ **Reference integration** — wired into `apps/dosje` (replaced the bespoke widget). Verified live (11 controls render).
3. ✅ **Rolled out to every app** — `<UX4GAccessibilityWidget />` added to the root layout of hub, docs, smile-admin, pm-ajay, scw, nmba. Verified live on nmba (11 icons) + dosje; docs / pm-ajay / smile-admin typecheck clean; hub / scw use the identical edit.
4. ✅ **Removed Mechanism C** from smile-admin — deleted `fontScale`/`highContrast` state, `data-fontscale`/`data-highcontrast` attributes, the CSS overlay, and the AccessBar's font-size/contrast/accessibility buttons (`apps/portals/smile-admin/src/store/app-context.tsx`, `.../components/shell/access-bar.tsx`, `.../app/globals.css`).
5. ✅ **Removed SCW's dead controls** — the font-size group, contrast button, and "Accessibility" icon button in `GovTopBar`, plus the entirely separate (also non-functional) `AccessibilityFab` component, all deleted from `apps/portals/scw/src/components/gov-chrome.tsx` and their call sites.
6. ✅ **Retired Mechanism B** — `useA11yToolbar`/`FONT_LEVELS`/`FontLevel`/`a11y-controls.ts` deleted; `SiteHeader`'s accessibility bar now renders only the accessibility-statement control + language selector (`packages/design-system/components/navigation/header/`). The orphaned `hc` token values are left in place for now (harmless — nothing sets `data-theme="hc"` anymore); flagged for the next token cleanup pass rather than touched here.
7. ✅ **Removed the bespoke `AccessibilityWidget`** — `accessibility-widget.tsx` + `a11y.css` deleted, barrel export removed. It had zero remaining consumers once every app migrated. Its Figma twin ("AccessibilityWidget / FAB") still documents the visual spec the brand skin (§8) matches — that lives in Figma, not in code.
8. ✅ **QA'd live** — clicking the FAB and every control inside was verified with real (trusted) mouse events in Chrome against `apps/hub` (see §7 for what QA actually found: a real functional bug, now fixed).

---

## 5. Documentation checklist (all three surfaces — the explicit ask)

- [x] **Figma** — note on the "Accessibility Bar and Widget" page: the official UX4G widget is the single a11y/HC mechanism; embed URL + `.dark-mode` DOM note. *(updated)*
- [x] **Code DS** — `packages/design-system/design.md` `AccessibilityWidget` section rewritten around the official widget; bespoke widget marked deprecated. *(updated)*
- [x] **DS portal** — `apps/docs/src/app/foundations/accessibility/page.tsx` "one mechanism, everywhere" section documents the official widget + embed. *(updated)*
- [x] **AGENTS.md / component inventory** — `UX4GAccessibilityWidget` added, `AccessibilityWidget` marked deprecated / Figma-reference-only.
- [x] Cross-link all surfaces to this decision doc.

## 6. Relationship to tokens
- The official widget provides its own contrast/dark styling; it does **not** consume our tokens.
- The `[data-theme="hc"]` overlay and `--sa-color-a11y-hc-*` tokens in `@mosje/tokens` are now **redundant** with the widget (no code sets `data-theme="hc"` anymore after §4.6) — flagged for removal at the next token cleanup rather than touched here.
- `font.family.devanagari` remains authored-but-unused — apply where Indic text renders (separate multilingual task).

## 7. Critical bug found + fixed: the widget rendered but didn't work

**Symptom (reported):** the FAB is visible on every app, opens on click, but every control
inside — Bigger Text, Text Spacing, Line Height, Highlight Links, Dyslexia Friendly, Hide
Images, Cursor, Light-Dark, Invert Colors, even the panel's own close (×) button — did
nothing. Clicking "Bigger Text" highlighted the tile but never resized anything.

**Root cause:** the CDN script (`accessibility-widget.js`) wires almost every interactive
control inside `document.addEventListener("DOMContentLoaded", function () { ... })` — only
the FAB's own open/close toggle is bound synchronously at top-level script execution.
`UX4GAccessibilityWidget` injects the script from a React `useEffect`, which necessarily
runs well after the page's real `DOMContentLoaded` has already fired. Listeners registered
for an event *after* it already fired never run — so the FAB opened (top-level binding),
but every control and the close button (DOMContentLoaded-gated) were permanently dead in
every app, despite the panel rendering and looking correct.

**Fix:** once the script's `load` event fires, dispatch a synthetic
`document.dispatchEvent(new Event("DOMContentLoaded", ...))`. This replays the exact
init path the widget expects from a static `<script defer>` placed before `</body>`,
without changing the widget's own code. Verified live in Chrome: Bigger Text now actually
zooms the page and shows its step indicator + checkmark; the panel's × button now closes it.

**Where:** `packages/design-system/components/a11y/ux4g-accessibility-widget.tsx`.

## 8. Brand skin (look matches DS, functionality stays official)

Per the Figma "AccessibilityWidget / FAB" spec, the widget's look should match the SAMAVESH
brand rather than the CDN default. Rather than rebuilding the widget's UI (which would mean
reimplementing its functionality ourselves — exactly what this whole consolidation moved
away from), the widget's CSS exposes one theme hook it already uses everywhere (trigger
background, panel header, active states, scrollbar thumb): the `--color-dark-blue-1` custom
property. `ux4g-accessibility-widget.css` overrides it to `--sa-color-action-primary-default`
(`#0373df`, the same "Primary/source" colour the Figma FAB is specced in) and fixes the one
hardcoded non-Noto font on the trigger label. Zero functional risk — it's a CSS variable the
widget itself defines for exactly this purpose — and the panel's existing `font-family: "Noto
Sans"` and 8–16px border-radius scale already matched our system, so no further overrides
were needed.
