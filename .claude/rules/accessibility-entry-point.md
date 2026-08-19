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
5. **Government chrome uses the shared `AccessibilityBar`.** A hand-rolled top bar never
   sets the flag, so it produces two doors while looking correct in review. If a portal
   needs a government utility bar, it imports the DS component — as scw, tg, nhapoa, nmba
   and smile-admin all do.
6. **Never open the widget with `[data-uw-trigger="true"]`.** It is the vendor's own
   documented hook and it does not work: v3.28 binds an opener that honours it and a
   closer that does not, so the same click opens the panel and immediately closes it —
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
- [ ] The bar's accessibility icon still opens the panel (`right: -530px → 0px`)
- [ ] On a page with no bar, the floating button is visible and opens the panel
- [ ] On a page rendering several bars, unmounting one does not un-hide the button
- [ ] Nothing removes `#uw-widget-custom-trigger` from the DOM
