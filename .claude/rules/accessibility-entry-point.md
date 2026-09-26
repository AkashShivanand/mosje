---
paths:
  - "packages/design-system/components/**"
  - "apps/hub/src/app/layout.tsx"
  - "apps/hub/src/app/portals/**"
  - "apps/hub/src/app/website/**"
---

# One accessibility entry point per page (MANDATORY)

**A page offers exactly one door to the accessibility panel.** Where the estate's
`AccessibilityBar` is on the page, that door is **the bar's accessibility icon**, and
the UX4G widget's own floating button is **hidden**. Where there is no bar, the floating
button is the door and must be visible. A page must never show both, and must never
show neither.

This rule governs the *entry point*. Which mechanism owns which capability is governed
by `docs/specs/samavesh-accessibility-consolidation.md`, and both apply at once.

## Who owns what

| Capability | Owner |
|---|---|
| Text size | **The bar's A−/A/A+ stepper** — root `font-size`, persisted in `localStorage`, on by default. The widget's own "Bigger Text" also remains, untouched (rule 7) |
| Contrast, saturation, invert | The UX4G widget |
| Spacing, link highlight, dyslexia font, cursor, dark mode | The UX4G widget |
| **Entry point to all of the above** | **The bar's accessibility icon** where a bar exists; the widget's floating button where one does not |

## The rule

1. **The widget is always mounted.** `<UX4GAccessibilityWidget />` renders once, in the
   hub's root layout, on every page. Never mount it conditionally, never per-portal, and
   never unmount it to "clean up" a screen. Hiding chrome is a CSS decision; unmounting
   the widget removes the panel itself.
2. **The floating button is HIDDEN, NEVER UNMOUNTED — this is load-bearing.** The bar's
   icon opens the panel by dispatching a click on `#uw-widget-custom-trigger`, which *is*
   the floating button. Remove that element from the DOM and the bar's icon silently
   stops working — it clicks a thing that no longer exists. `display: none` keeps the
   element and the vendor's listeners alive, and a dispatched click still reaches a
   hidden element, because that is programmatic dispatch and not hit-testing.

   ```css
   :root[data-sa-abar-a11y="1"] #uw-widget-custom-trigger { display: none !important; }
   ```

   `!important` is required: the vendor's stylesheet is injected by its own script, so it
   loads after ours and would otherwise win on source order.
3. **The flag is set by the component, and it is refcounted.** `AccessibilityBar` sets
   `data-sa-abar-a11y="1"` on the root only while a bar with `accessibility` is mounted.
   The count matters — a page can render several bars (the documentation previews render
   three), and a naive delete-on-unmount lets the first one out un-hide the floating
   button underneath the others. Never set or clear this attribute by hand from an app.
4. **With no bar, the floating button comes back, and that is correct.** If the bar
   unmounts, or renders `accessibility={false}`, the flag goes and the widget is reachable
   again. The widget must never be unreachable — a page with neither door is a WCAG
   regression, not a tidy screen.
4a. **On a phone, "on the page" means ON SCREEN. DECIDED 2026-09-13.** Below
   `breakpoint/tablet` the masthead condenses on scroll and takes the bar with it, so a
   bar that is mounted is not necessarily a door the citizen can see. The floating
   button is therefore hidden only while the bar's own icon is on screen —
   `AccessibilityControls` keeps `data-sa-abar-a11y-onscreen` with an
   IntersectionObserver, refcounted like the entry flag. From tablet up the entry flag
   alone decides, as before.

   This replaces a phone exemption that had broken the rule quietly. On 2026-08-26 the
   floating button was brought back on every phone as "a second route", because the bar
   scrolls away — while the bar kept its 44×44 icon at the top of the page. Result: two
   doors on every phone's first screen, the floating one sitting on content (the NMBA
   announcement band at 320–375px). Measured after the change, scrolled 0–1500px in 75px
   steps at 320, 360, 375, 390, 412 and 430 wide: exactly one door visible at every step.
4b. **On ANY phone masthead that runs the gesture, the bar is the ONLY door, and it
   comes back on intent. DECIDED 2026-09-19; extended to the website 2026-09-23.**
   A masthead runs the gesture when it is sticky and carries `data-gesture`: a portal
   that passes `service` (the phone layers — see `SiteHeader`), and the website, whose
   pinned row is its condensed bar. It hides the floating button below
   `breakpoint/tablet` at every scroll position, and keeps the bar's icon reachable
   instead:

   - at the top of the page the bar is where the page puts it;
   - scrolling DOWN takes the whole masthead away, so the page has the screen;
   - ANY upward scroll of 12px or more brings the bar back with the working bar,
     stacked at the top of the viewport;
   - focus entering the header brings it back at once and holds it while focus is
     inside, as does any open disclosure (account menu, drawer);
   - it is only ever moved visually (a transform) — it stays in the DOM, in the tab
     order and in the accessibility tree the whole time.

   This supersedes 4a's "never neither" for these pages, deliberately: the door is
   one flick away rather than always painted, and in exchange nothing floats over the
   citizen's content and the language control (which never had a floating copy)
   becomes reachable from anywhere on the page as well. Verified 2026-09-19 at 375×667
   on E-Anudaan: hidden at 500px down, bar at y=0 after a 60px and a 30px flick, a 5px
   jitter ignored, the icon opening the panel (`right: 0px`) from the revealed bar, and
   the floating button `display: none` in every state. Re-verified on the website at
   375×812 on 2026-09-23: the masthead gone at 900px down, the bar back at y=0 after a
   120px flick, and the floating button `display: none` at rest, hidden and revealed alike.

   **The website ran 4a until 2026-09-23, and it cost more than a second door.** The
   floating button sat at 285,718 on a 375px screen — on top of the assistant's launcher
   at 275,696 — so the assistant read as missing from the page. A door that must be
   painted permanently will take the corner from whatever else the page needs there.
   A masthead with neither `service` nor a condensed bar to pin keeps 4a.

5. **Government chrome uses the shared `AccessibilityBar`.** A hand-rolled top bar never
   sets the flag, so it produces two doors while looking correct in review. If a portal
   needs a government utility bar, it imports the DS component — as scw, tg, nhapoa, nmba
   and smile-admin all do.
6. **Never open the widget with `[data-uw-trigger="true"]`.** It is the vendor's own
   documented hook and it does not work: v3.28 binds an opener that honours it and a
   closer that does not — still true of v3.36, re-read in its source on 25 Sep 2026 — so the same click opens the panel and immediately closes it —
   a bug that presents exactly as "the button does nothing". Replay the click on the
   vendor's trigger element instead, which satisfies both listeners. Defer it to the next
   task (`setTimeout(…, 0)`); opening inline loses the race against the closer every time.
7. **Never suppress any part of the widget's panel. DECIDED 2026-08-19.** The panel
   carries its own "Bigger Text" row under Content Adjustment, which overlaps the bar's
   stepper — two text-size mechanisms, independent and unaware of each other. **Both
   stay.** The bar's A−/A/A+ is present by default and does its job; the widget's panel
   does its job exactly as MeitY ships it. Hiding a row inside an official government
   widget is not a change this estate makes.

   Note what this rule does and does not touch: **the FAB is chrome, the panel is the
   product.** Hiding the redundant floating *button* (rules 2–4) is a decision about
   which door a page offers. Reaching inside the *panel* to remove a control the citizen
   is entitled to is a different act entirely, and it is out of bounds.

## Why this rule exists

The behaviour was designed, built and verified in the browser on **2026-08-18** — and
then existed nowhere that would bind anyone. It was written up only as an amendment
inside `docs/specs/samavesh-accessibility-consolidation.md`, on a branch that was never
merged and never pushed. `main` had the bar's icon opening the widget but nothing hiding
the floating button, so **six surfaces shipped two doors to the same panel**: the website
masthead via `SiteHeader`, plus scw, tg, nhapoa, nmba's public shell and smile-admin's
access bar. Nothing in `.claude/rules/` mentioned any of it, so the next session to touch
the bar had no way to know the second door was a defect rather than the design.

Audited and codified **2026-08-19**. The lesson is the one `documentation-ds-linkage.md`
already records in its own words: **a rule with no gate is a rule with a half-life**, and
a rule that lives only on an unmerged branch does not exist at all.

## Checklist when touching the bar, the widget, or a portal's chrome

- [ ] `<UX4GAccessibilityWidget />` is mounted exactly once, in the hub root layout, and
      unconditionally
- [ ] The portal's top bar is the shared `AccessibilityBar`, not a hand-rolled copy
- [ ] With the bar on screen, the vendor's floating button computes `display: none` and a
      0×0 rect — check it, do not assume it
- [ ] On a phone with a gesture masthead, the floating button computes `display: none`
      at every scroll position, and an upward flick brings the bar back
- [ ] Nothing else the page puts in the bottom-right corner is covered by it —
      compare the rects, do not look
- [ ] The bar's accessibility icon still opens the panel (`right: -530px → 0px`)
- [ ] On a page with no bar, the floating button is visible and opens the panel
- [ ] On a page rendering several bars, unmounting one does not un-hide the button
- [ ] Nothing removes `#uw-widget-custom-trigger` from the DOM
