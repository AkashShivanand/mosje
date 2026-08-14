# 09 — Document SAMAVESH Accessibility

> **Read `00-MASTER-documentation-law.md` in full before anything else.**
>
> **Run this prompt LAST of the foundations** (before `11-CODE-CONNECT.md`). It is cross-cutting: it
> should *cite* the finished foundation pages rather than forward-reference them, and it is the page
> that turns nine separate contracts into one obligation.

---

## WHAT THIS FOUNDATION OWNS

Not a token family — an **obligation**, and the machinery that discharges it.

| Thing | Where |
|---|---|
| `focus.*` tokens | `semantic.json` — `ring` · `width` · `offset` (3) |
| The UX4G accessibility widget | Loaded from `ux4g.gov.in` CDN; dark + high-contrast modes |
| `AccessibilityWidget` component | `packages/design-system/components/a11y/` · Figma `2382:295905` |
| `packages/design-system/ux4g.css` | The `ux4g` / `ux4gdeep` opt-in modes |
| `accessibility-auditor` agent · `gov-compliance` skill · `/a11y` command | The enforcement tooling |
| `docs/ux4g/` · `tools/ux4g-conformance/measure.mjs` | The conformance position and its measurement |

Docs page: 310 lines — the **thickest** foundation page and the best starting point of the set.

---

## THE STANDARD — state it precisely, because precision is the whole value

This estate is bound to **WCAG 2.1 Level AA** and **GIGW 3.0**. Not 2.2. Not AAA. Get this exactly
right everywhere, because half the accessibility advice on the internet cites the wrong version and
this page is what stops that leaking into the estate.

Where the system *exceeds* the requirement — and it does, notably on target size — say so
explicitly: *"WCAG 2.1 AA does not require this; we do it anyway, and here is why."* An honest
statement of where you exceed the floor is more credible than implying everything is mandated.

**No self-certification.** You may state that a check ran and what it output. You may **not** declare
WCAG or GIGW compliance on your own authority. That needs human sign-off, and the page must say so.

---

## PHASE 0 — the questions

Run the master's standard reconciliation, then:

### 0.1 — The focus ring is three tokens and one of them is suspicious

`focus.ring` · `focus.width` (`border.width.md` = 2px) · `focus.offset` (`space.xxs` = 2px).

`focus.ring` is a **raw rgba literal**, not an alias, and the build emits a different literal per
brand:

- default: `rgba(3, 115, 223, 0.48)` — gov-blue `#0373DF`
- `[data-brand="navy"]`: `rgba(0, 51, 102, 0.48)` — `#003366`, which is `primaryRamp-navy-**600**`

But under navy, `action-primary-default` resolves to `primaryRamp-navy-**500**` (`#244c7b`).
**The focus ring is one rung off the brand's own primary, and it is a hardcoded literal rather than
an alias that would follow the ramp.**

Establish whether that is deliberate (a deeper ring for contrast) or drift. Then **measure the ring
against every surface it lands on in both brands** — WCAG 2.4.7 requires it to be visible, and
1.4.11 requires 3:1 against adjacent colours. A translucent ring's contrast depends on what is
behind it, so this must be measured per layer, not asserted once.

`usage-guidance.mjs` already records: *"The ring's colour was tokenised long before its geometry, so
this was hardcoded."* Confirm that is still true and propose aliasing it.

### 0.2 — The UX4G widget is third-party code that has already broken this estate

It is loaded from the `ux4g.gov.in` CDN. On 2026-08-07/08 it threw a null dereference on **every
route change** for any visitor with no prior settings; the fix was a local `seedUx4gSettings()`
workaround, not an upstream change. A second bug — an ID mismatch in the highlight-links handler —
was also found.

Document honestly: what the widget provides, what it costs, what it has broken, what the workaround
is, and **what happens if the CDN is unreachable**. Establish whether the upstream bug was ever
reported. A dependency that has crashed production twice and is loaded from a third party belongs in
the documentation with its scars visible.

Also resolve the **two-mechanism problem**: the widget applies its own `.dark-mode` class and its own
font-size and contrast controls. `data-theme` was removed on 2026-08-10 precisely so there is one
mechanism. Confirm nothing has reintroduced a second one, and that the widget's controls and the
platform's own preferences (`prefers-contrast`, `prefers-reduced-motion`,
`prefers-reduced-transparency`, `forced-colors`) do not fight.

### 0.3 — What does GIGW 3.0 actually require beyond WCAG?

GIGW is not a synonym for WCAG. Establish, from `docs/source-brd/` and the `gov-compliance` skill,
what GIGW 3.0 requires that WCAG does not — bilingual provision, specific page furniture, contact
and grievance affordances, document accessibility, the accessibility statement page itself. **A
GIGW checklist that is just a WCAG checklist is not a GIGW checklist.**

### 0.4 — Is there an accessibility statement?

GIGW requires a published accessibility statement. Establish whether the estate has one, where it
lives, and whether it is current. If it does not exist, that is a finding with a named owner.

### 0.5 — The conformance figure

Run `node tools/ux4g-conformance/measure.mjs` and quote the **fresh** number. Never restate a figure
from a document.

### 0.6 — The audit trail

Which accessibility claims in the estate are verified by a command, which by inspection, and which
are asserted? Produce that three-column table. It is the most useful artefact this page can carry
and no other page in the estate has it.

---

## COVERAGE CONTRACT

1. **The obligation** — WCAG 2.1 AA + GIGW 3.0, what binds this estate and why, in plain terms for a
   stakeholder who will be asked to sign it off.
2. **POUR** — the four principles, each with the SAMAVESH tokens and components that discharge it.
3. **The criteria that this design system actually decides** — a table of every SC the *system*
   (rather than a page author) can satisfy or violate: 1.4.1, 1.4.3, 1.4.4, 1.4.10, 1.4.11, 1.4.12,
   1.4.13, 2.1.1, 2.1.2, 2.4.3, 2.4.7, 2.5.5/2.5.8, 2.3.1, 2.3.3, 3.2.x, 4.1.2 — each linked to the
   foundation page that owns it.
4. **Focus** — the three-token contract, measured per surface per brand, 2.4.7, and the absolute
   rule that it is never suppressed.
5. **Keyboard** — tab order, focus trapping in modals and sheets, escape behaviour, skip links, and
   the components that get it right.
6. **Screen readers** — the accessible-name rules per component, live regions for toasts and
   validation, and **actual tested output** rather than assumed output.
7. **Colour and contrast** — cross-link `01-colour.md`; never colour alone; the measured-at-build
   principle.
8. **Text and zoom** — 200%, reflow at 320px, Text Spacing overrides; cross-link `02-typography.md`.
9. **Targets and motor access** — cross-link `07-sizing-and-density.md`; the 44px rule and why.
10. **Motion and vestibular safety** — cross-link `06-motion.md`.
11. **Forced colours and high contrast** — what survives, what disappears, what must carry meaning
    when shadows and colours are stripped.
12. **The UX4G widget** — features, integration, theming, the incident history, the CDN dependency.
13. **Bilingual accessibility** — `lang` attributes, screen-reader pronunciation of Devanagari,
    mixed-script announcement, and language switching.
14. **Forms** — labels, error identification (3.3.1), suggestions (3.3.3), grouping, and the
    Aadhaar/PAN/OTP inputs which are the estate's highest-stakes form controls.
15. **Data tables and charts** — headers, captions, and the never-colour-alone rule for charts.
16. **How to test** — the exact commands, tools and manual steps, in order, with what each catches
    and what it misses. Automated testing catches roughly a third; say so.
17. **The audit trail** — the verified/inspected/asserted table from Phase 0.6.
18. **Governance** — who signs off, what evidence they need, and the accessibility statement.
19. **Do / Don't** — eight pairs minimum, every one a real defect from this estate's history.

---

## PHASE 1 — Figma (`Accessibility Bar and Widget`, node `2382:295905`)

Figma is a weak surface for accessibility — most of it is behaviour, not appearance. Do not fake
coverage. Build what a static frame genuinely can:

- Focus states drawn on every interactive component, at real dimensions, with the ring's three
  tokens annotated.
- Touch targets drawn at true size with the 24px circles.
- Contrast pairs shown with their measured ratios.
- Forced-colours and high-contrast renditions side by side with the default.
- The widget's own 7 published components documented.

Every frame links to the live page for anything behavioural, and **says** that is why.

---

## PHASE 2 — Website (`apps/hub/src/app/design-system/foundations/accessibility/`)

The 310-line page is the best base in the set. Deepen rather than restructure.

### What only the web can do

- **A live criteria checklist** the reader can run against the current page.
- **Preference toggles** — `prefers-reduced-motion`, `prefers-contrast`,
  `prefers-reduced-transparency`, `forced-colors` — applied to the page so a reviewer sees each
  state without changing OS settings.
- **A keyboard-navigation demo** with a visible focus trail.
- **A screen-reader output preview** per component, showing the announced string.
- **The audit trail table**, live.
- **Deep link** via `figmaUrl(FIGMA_NODES.accessibility)`.

---

## PHASE 3 — pressure test

The master's six passes, plus the only test that matters here:

- **Navigate the entire documentation page with the keyboard alone**, then **with a screen reader
  alone**, and write down every place it fails. Paste the transcript. An accessibility page that has
  not been driven by the tools it documents has not been tested.
- Run `accessibility-auditor` and `gov-compliance`; paste both outputs; fix everything.
- Verify at 320px, at 200% zoom, under Text Spacing overrides, under `forced-colors: active`, and
  in both UX4G widget modes.
- Confirm no compliance claim is made on your own authority.

**Score 1–5** on the master's eight dimensions. **Accessibility must score 5.** Anything else on
this page specifically is a fail.

---

## DEFINITION OF DONE

- [ ] Phase 0's six questions answered with evidence
- [ ] The focus ring measured against every surface in both brands; results pasted; aliasing proposed
- [ ] GIGW-beyond-WCAG requirements established and listed
- [ ] Accessibility statement located, or its absence reported with an owner
- [ ] Fresh conformance figure from `measure.mjs` pasted
- [ ] The verified / inspected / asserted audit trail produced
- [ ] Figma: focus states, targets, contrast pairs and forced-colours renditions built; behavioural
      gaps honestly labelled; published **and verified from a consumer file**
- [ ] Website: page deepened, preference toggles working, DS audit inline, reusables in `docs-kit`
- [ ] Keyboard-only and screen-reader-only walkthroughs completed; transcripts pasted
- [ ] All 19 coverage-contract items addressed, and stated where
- [ ] Every foundation page cross-linked from the criteria table
- [ ] `design.md`, `AGENTS.md`, `llms.txt`, changelog, nav updated
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Six pressure-test passes run; findings, fixes and the eight scores written up; accessibility
      scored 5
