# 08 — Document SAMAVESH Iconography

> **Read `00-MASTER-documentation-law.md` in full before anything else.**

---

## WHAT THIS FOUNDATION OWNS

The icon system, the emblem and logo marks, and the rules that keep them apart.

| Thing | Where | Count |
|---|---|---|
| Icon font | Material Symbols Rounded, loaded via `@mosje/design-system/icons.css` | — |
| `<Icon>` component | `packages/design-system/components/icon/` | 1 |
| `icon.size.*` tokens | `semantic.json` (owned by `07-sizing-and-density.md`) | 5 |
| `icon.*` colour slots | `semantic.json` (owned by `01-colour.md`) | — |
| Figma icon components | page **Icons** `2316:246` (`figmaUrl(FIGMA_NODES.iconography)`) | **98 published** |
| Figma logo components | page **Logos and Misc Icons** `67:12464` | **44 published** |

Docs page: 168 lines (`the icon system` · `most-used icons` · `usage rules` · `size guidance`).

**The standard, from CLAUDE.md:** Material Symbols **Rounded**, weight **300**, size **24**, stroke
variant. Load the font once per app. For brand/social/emblem marks use **inline SVG**, never the
icon font. The logo is the **National Emblem** — never an invented or abstract mark.

---

## THE HEADLINE TENSION — TWO ICON SYSTEMS THAT MUST NOT MERGE

An icon font and a component library are different things with different rules, and this estate has
both:

- **Material Symbols Rounded** — a variable font. Any of ~3,700 glyph names works by string. Nothing
  enumerates them, nothing validates them, and a typo renders as a blank box or the literal ligature
  text. **There is no build-time guarantee that an icon name is real.**
- **98 published Figma icon components** — a fixed, curated set a designer picks from a panel.

So a designer picks from 98 and an engineer types from 3,700. **They will not agree**, and nothing
currently detects the divergence. Quantifying that gap and proposing a mechanism to close it is the
single most valuable output of this prompt.

Establish, with evidence:

- The full list of icon names actually used across `packages/design-system` and `apps/hub`
  (`grep` every `<Icon name="…">`).
- Which of those exist as Figma components, and which do not.
- Which of the 98 Figma components are used by nothing.
- Whether any used name is **invalid** in Material Symbols — a rendering defect hiding in plain
  sight. Check every one; a blank box in a government portal is not cosmetic.

Then **propose** the closing mechanism: a generated union type for `Icon`'s `name` prop, or a test
that fails when a used name is absent from the curated set, or both. Propose; do not execute.

---

## PHASE 0 — the questions

Run the master's standard reconciliation, then:

1. **The icon census above**, in full, with the four lists produced.
2. **Is the font actually loaded with the documented axes?** CLAUDE.md specifies weight 300, grade,
   optical size 24, and the **stroke** (outlined) variant. Verify what `icons.css` requests and what
   the browser resolves. A variable font requested at the wrong `wght` renders visibly heavier and
   nobody notices until it is everywhere.
3. **What happens before the font loads?** Material Symbols renders **ligature text** — the literal
   word `search` — until the font arrives. On a slow connection that is a visible defect on every
   page. Establish whether `font-display` and any `.material-symbols` visibility guard are set, and
   test it under throttling. **Screenshot the pre-load state.**
4. **Are icons accessible?** Every icon is either meaningful (needs an accessible name) or
   decorative (needs `aria-hidden`). Audit `Icon`'s API: does it force the choice, or does it let a
   developer ship an unlabelled meaningful icon? If it permits the mistake, that is a finding and a
   proposal.
5. **Icon-only buttons** — the most common a11y failure in the estate's class of app. Census every
   icon-only control and confirm each has an accessible name and meets `target.comfortable`.
6. **The emblem rule** — confirm no page uses an invented mark, and that the National Emblem assets
   (`National-Emblem-logo.svg` / `National_Emblem_logo_white.svg`) are the only ones in logo
   positions. This is a **compliance** check, not a style check.
7. **The 44 logo components** — state emblems, org logos, misc marks. Establish what they are, their
   licence/usage constraints, and whether any are used in code. Government emblems have legal usage
   rules; the page must say what they are or say that they need legal sign-off.
8. **Icon colour** — icons have their own 3:1 floor under WCAG 1.4.11. Confirm `icon.*` colour slots
   are used rather than `text.*`, and that the distinction is documented (cross-link `01-colour.md`).
9. **The standard checks** — no hardcoded glyphs or inline SVG icons in the docs page where `<Icon>`
   would do; build + tests green, run sequentially.

---

## COVERAGE CONTRACT

1. **The icon system** — Material Symbols Rounded, why it, what DBIM requires, in plain terms.
2. **The axes** — weight 300, optical size 24, fill/stroke; what each does, rendered live at each
   setting, and the rule that only the documented combination ships.
3. **The curated set** — the 98, browsable and searchable, each with its code name copyable.
4. **The gap** — the census from Phase 0.1, stated honestly, with the proposed mechanism.
5. **Sizing** — the five steps, the 24px grid, optical alignment with text, and the rule that an
   icon's *box* and its *glyph* are different sizes.
6. **Colour** — the `icon.*` slots, the 3:1 floor, and why icons are not text.
7. **Meaningful vs decorative** — the single most important rule; how to mark each; what a screen
   reader announces in both cases, quoted from an actual test.
8. **Icon-only controls** — accessible name, tooltip, target size, and why a tooltip is not an
   accessible name.
9. **Icons with labels** — spacing, alignment, and the rule that the label is the accessible name.
10. **Loading behaviour** — the ligature-flash problem and its mitigation.
11. **Logos, emblems and state marks** — the National Emblem rule, the 44 marks, usage constraints,
    and the standing prohibition on the tricolour stripe motif.
12. **When NOT to use an icon** — icons that mean nothing without a label; culturally ambiguous
    metaphors; and the fact that this estate serves users who may not read English.
13. **Do / Don't** — six pairs minimum on real MoSJE UI.
14. **Handoff** — `<Icon name size />` → the CSS → the Figma component.
15. **Provenance** — Google's Material Symbols licence, the emblem's source, UX4G alignment.

---

## PHASE 1 — Figma (`Icons` `2316:246`, `Logos and Misc Icons` `67:12464`)

Standard hygiene, plus:

- Confirm all 98 icon components are on the documented axes, and that none is a detached vector that
  has drifted from the font.
- Every icon component's name **matches the Material Symbols ligature exactly** — that is what makes
  a designer's pick and an engineer's string the same thing. Any mismatch is a finding.
- Confirm icons are published as components with a size property bound to `icon.size.*`, not as
  fixed-size vectors.

### Frames

1. At a glance · 2. Anatomy of an icon (box vs glyph, the 24 grid) · 3. The axes rendered ·
4. The curated 98, categorised · 5. Sizes on the grid with text alignment · 6. Colour and the 3:1
floor · 7. Meaningful vs decorative · 8. Icon-only controls with target sizes drawn · 9. Logos and
emblems with usage rules · 10. Do / Don't · 11. Handoff · 12. Provenance.

---

## PHASE 2 — Website (`apps/hub/src/app/design-system/foundations/iconography/`)

### What only the web can do

- **A searchable icon browser** over the curated set — type "download", get the icon, its name, and
  a copy button. This is the highest-traffic feature the page will ever have; build it properly,
  with keyboard navigation and a live result count.
- **An axis playground** — weight, fill, optical size sliders on a live glyph.
- **A screen-reader preview** — toggle between meaningful and decorative and show the announced
  string.
- **A pre-load simulator** showing the ligature flash.
- **A contrast checker** on icon colour against each layer.
- **Copy-to-clipboard** everywhere; **deep links** via `figmaUrl(FIGMA_NODES.iconography)` and
  `figmaUrl(FIGMA_NODES.logosIcons)`.

---

## PHASE 3 — pressure test

The master's six passes, plus:

- Is every icon on the documentation page itself correctly marked meaningful or decorative? Verify
  with an actual screen reader or the accessibility tree, and paste the output.
- Does the icon browser work with the keyboard alone?
- Under `forced-colors: active`, do icons remain visible?
- Does the page use `<Icon>` for its own icons, or does it hardcode SVG?
- Does any invented mark appear anywhere?

**Score 1–5** on the master's eight dimensions.

---

## DEFINITION OF DONE

- [ ] Phase 0's nine questions answered; the four census lists produced and pasted
- [ ] Every used icon name validated against Material Symbols; invalid names reported
- [ ] The design↔code icon-gap mechanism proposed with evidence
- [ ] Pre-load ligature behaviour tested under throttling and screenshotted
- [ ] Figma: 98 icon components verified on-axis and name-matched; 44 logo marks documented with
      usage constraints; 12 frames built, published **and verified from a consumer file**
- [ ] `figma-live.json` refreshed and `$note` appended
- [ ] Website: page upgraded, searchable browser built and keyboard-operable, DS audit inline,
      reusables in `docs-kit`
- [ ] All 15 coverage-contract items addressed, and stated where
- [ ] `design.md` updated; `AGENTS.md`, `llms.txt`, changelog, nav updated
- [ ] `accessibility-auditor` and `gov-compliance` run; output pasted; issues fixed
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Verified in browser at 360 / 768 / 1280, both brands, under `forced-colors: active`
- [ ] Six pressure-test passes run; findings, fixes and the eight scores written up
