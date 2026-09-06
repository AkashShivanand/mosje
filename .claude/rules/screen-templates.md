---
paths:
  - "apps/hub/src/app/portals/**"
  - "packages/design-system/components/templates/**"
---

# A portal screen is composed from a template, not assembled by hand (MANDATORY)

**Before writing a portal screen, name the data you have and read the decision
table in `docs/design-system/screen-templates.md` §2. That names your template.
Then write the descriptor. There is no third step.**

This rule exists because the estate proved, at scale, that a design system of
components alone does not produce consistent screens.

## 1. What the components-only estate actually looked like

Measured 6 September 2026, on 265 built portal pages:

| | |
|---|---|
| Barrel exports available | 290 names / 132 components |
| `FormField` uses | 532 |
| `Card` uses | 354 |
| **`PageHeader` uses** | **0** |
| **`AppShell` uses** | **0** — it appears only in docs and Storybook |
| Hand-rolled portal shells | **16**, across 8 portals, none importing `AppShell` |
| **Pages handling none of loading / empty / error** | **236 of 265 — 89%** |

The leaf components were adopted heavily. The page skeleton was re-invented 265
times, and with it the seven states `data-state-completeness.md` makes mandatory.

**That 89% is not carelessness.** Obeying the state rule by hand costs four extra
branches on every page, and nothing in the system offered them ready-made. A rule
people must remember is a rule most pages break; a shape they cannot avoid is not.

**The estate has already proved the mechanism.** `SidebarNav` is at 100% adoption
across 407 files because `check:sidebar-adoption` ratchets it. `AppShell` had no
gate and sat at zero. Templates ship with a gate for that reason:

```bash
npm run check:template-adoption            # in `npm run check`, so CI runs it
npm run check:template-adoption:baseline   # after migrating, in the same change
```

At 6 September 2026 it stands at **8 / 278 composed, 270 in the baseline**, and
the list may only shrink.

**That number was 67 for an hour, and the correction is the instructive part.**
The gate's first version treated a short page that renders one component as
conformant, on the reasoning that its screen lives in that component. It does —
but nothing was then checking that component, so 59 pages across e-anudaan and
nhapoa passed while their screens were hand-assembled one file sideways, and the
gate could have been satisfied by moving code rather than composing it. It now
resolves the delegate through its import and judges that instead. **A jump in
this baseline means the scope widened; every other move must be downward.**

## 2. The rule

1. **Every signed-in portal page renders `PortalPage`.** Not `AppShell` directly,
   and never a portal-local shell. The sixteen that exist are migration debt, not
   precedent.
2. **The screen inside it is one of the eighteen templates**, chosen from the
   decision table by the *data*, not by a picture of a screen you liked.
3. **A descriptor never contains a spinner, an empty state, a breakpoint or a
   heading level.** If you are writing one of those, you have reached past the
   template, and that is the defect.
4. **A nineteenth template is added to the catalogue by changing
   `docs/design-system/screen-templates.md`** — never invented in a portal folder.
   A screen that seems to need one is almost always one of the eighteen with a
   different descriptor. Check that first.
5. **Every string a template shows is a prop.** GIGW requires the estate to be
   bilingual, and a sentence baked into a template cannot be translated. Override
   with `screenCopy()`, which merges your two or three over the estate's ten.
6. **Resolve the reading ONCE, with `resolveScreenState`.** Every part of a
   surface that depends on a request resolves it from one expression. Two
   separate tests is the defect that printed `villages 0` above a map drawing
   19,768 of them.
7. **Never `?? mockData` in a fallback.** That is the defect, not the fix.

## 3. What a template owns, so a descriptor never states it

| Owned | Consequence |
|---|---|
| All seven states | You cannot ship a page with no empty state |
| Exactly one `<h1>`, correct heading order | You cannot nest two page titles |
| Skip-link target, landmarks, focus on step and route change | Keyboard behaviour is not per-page |
| The mobile form of every archetype | Tables become cards; the handoff drew none of this |
| Paging | "Too much" cannot be forgotten |
| en-IN formatting, provenance chips | Figures are read the same way estate-wide |

## 4. What the template CANNOT own, and you must

These are the ones to check in review, because no gate can see them.

- **A ratio takes numerator and denominator from the same source.** Mixing them
  published a `138%`. Only the person composing the figure can prevent it.
- **A figure the register does not publish is left OFF**, not rendered as "Not
  yet reported" (`live-data-fallback.md`).
- **An action this role may not perform is omitted, not disabled.** A dead control
  announces as present-but-unavailable and explains nothing.
- **Filter, page, tab and sort belong in the URL.** A tab that cannot be linked to
  is a tab nobody can send anyone to.
- **`activeFilterCount` takes the real predicate.** A default-valued select is not
  a filter, and counting it turns every empty register into "try clearing your
  filters" — advice the reader cannot act on.
- **Unsaved-changes and session-expiry guards** in a wizard. The template does not
  own the router.
- **Anything passed into `rowActions` or `actions`** is yours to make operable and
  to meet WCAG 2.2 §2.5.8's 24×24 minimum.

## 5. Divergences from the handoff are deliberate

Recorded in `docs/audit/figma-handoff-defects-2026-09-06.md`, per
`standards-precedence.md`, which requires a documented reason whenever the drawing
is not followed.

| Handoff draws | Templates ship | Why |
|---|---|---|
| Rails at 300, 88, 268, 260, 280 | **300 and 88** | Three are drift, all inside SHRESHTA |
| Ten inner content measures | **1140 @ 300, 1352 @ 88** | One page type has one measure per rail state |
| Two stepper treatments | **One** | A citizen in two schemes must not meet two progress bars |
| Three chooser designs under one name | **One** | Two use `radio-card`; the third hand-builds four frames |
| No mobile application screen at all | **A mobile form for every archetype** | 9 of 9 mobile frames are auth; a citizen applying on a phone is the common case |
| No confirmation screen after submit | **`ConfirmationScreen`** | The journey ended with no receipt |
| No empty, error or filtered state anywhere | **All seven, everywhere** | Mandatory |

## 6. Checklist before calling a portal screen done

- [ ] The template was chosen from the decision table, by the data
- [ ] `PortalPage` is the chrome — no portal-local shell
- [ ] The descriptor contains no spinner, no empty state, no breakpoint, no `<h1>`
- [ ] The reading is resolved once, by `resolveScreenState`
- [ ] `activeFilterCount` reflects the real predicate
- [ ] Filter, page and tab state are in the URL
- [ ] Actions the role may not perform are omitted, not disabled
- [ ] Every ratio's halves come from one source
- [ ] Every state was **seen in a browser** — force the feed to fail, force the
      filter to match nothing, throttle the connection
- [ ] Seen at 375px as well as 1440px
