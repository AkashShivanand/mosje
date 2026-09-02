# Master Prompt — SAMAVESH Design System: From Documented to Definitive

> Authored 2026-09-01 on `ds/docs-world-class`. This is the controlling brief for the
> audit → remediation → re-audit programme. Every agent, session and PR in this
> programme reads this file first and treats it as the contract.

---

## 0. The one sentence

**Make the SAMAVESH design system the reference implementation a Government of India
department would be judged against — starting with the documentation, because the
documentation is the only part of a design system most people ever touch.**

---

## 1. Ground truth, measured before the work started

These are counts from the repository on 2026-09-01, not impressions. They are the
baseline every claim of improvement is measured against.

| Measure | Value | Source |
|---|---|---|
| Component documentation pages | 100 | `apps/hub/src/app/design-system/components/**/page.tsx` |
| …fully conformant to the house shape | **3** | `npm run check:ds-pages` |
| …baselined as known-bad | **97** | `tools/ds-page-standard/baseline.json` |
| Total design-system pages | 121 | `find … -name page.tsx` |
| Components exported from the package | 90 | `scripts/lib/ds-exports.mjs` |
| Figma node ids available to link to | **34** | `apps/hub/src/lib/design-system/figma.ts` |
| Pages hand-rolling their own `h2Style` object | **99** | `grep -rl "const h2Style"` |
| Unbound `lineHeight` numeric literals | **161** | 1.5 · 1.6 · 1.7 · 1.8 · 1.9 · 1.1 |
| Unbound `maxWidth` px literals | **107**, across **9 distinct values** | 1024 · 800 · 1000 · 960 · 600 · 500 · 480 · 400 · 320 |
| Chart components in the package | 17 | `components/data-display/charts/` |
| Illustration system | **does not exist** | no match for `*illustr*` anywhere |

### The headline defect, stated plainly

`.claude/rules/documentation-ds-linkage.md` opens with *"Documentation is the strictest
case of the design system"* and forbids a literal that merely equals a token. The
documentation site is, by its own repository's gates, **the least conformant surface in
the estate**: 3% conformance, 268 unbound literals, and 99 copies of the same six style
objects pasted page to page. A design system whose own documentation is copy-paste is
not a design system; it is a folder of components with a website next to it.

---

## 2. The eight lenses, and what each is entitled to fail the work for

The audit runs eight adversarial roles. Each is **hostile by construction** — the job is
to find the reason to reject, not the reason to approve. A role that returns "looks good"
has not done its job.

| Role | The question it is allowed to kill the work with |
|---|---|
| **Design Director** | Does this look like it was designed, or assembled? Is there a visual idea, or only tokens applied correctly? Would this survive next to Carbon, Polaris, Material 3 or GOV.UK without embarrassment? |
| **Senior Design System Manager** | Can a team adopt this without asking us a question? Where is the contribution path, the deprecation policy, the versioning contract, the migration guide, the adoption metric? |
| **Technical Architect** | What breaks at scale? Where is the coupling, the duplication, the bundle weight, the tree-shaking failure, the circular import, the CSS-in-JS that should be a class? |
| **CTO** | What does this cost to maintain per year, and what does it save? Where is the risk — legal, accessibility, security, vendor, key-person? What is the number I report upward? |
| **Senior Developer** | Can I use this component in ten minutes from the page alone? Are the types honest? Are the examples runnable? Does the props table match the implementation? |
| **Business Analyst** | Which requirement does each component satisfy? Where is the traceability from a scheme's workflow to a component? What is unbuilt that 20 portals will need? |
| **Product Manager** | Who is the user of this documentation, what job are they hiring it for, and where does it fail them? What is the roadmap, and what is the evidence behind it? |
| **UI/UX Designer** | Every state, every breakpoint, every locale, every input modality. Where is the empty state, the error, the loading, the RTL, the 200% zoom, the touch target, the focus order? |

Each role produces findings in this shape, and nothing else:

```
SEVERITY  P0 blocks release · P1 ships broken · P2 real defect · P3 polish
WHERE     file:line, or the page route
WHAT      the defect, in one sentence, falsifiable
WHY       what it costs the reader / the department / the estate
FIX       the concrete change, not a direction
```

**A finding with no file path is not a finding.** A finding phrased as "consider
improving consistency" is deleted unreviewed.

---

## 3. The five workstreams

### WS-1 · Documentation conformance — clear the 97

Not by adding six imports to ninety-seven files. **By building the template those
ninety-seven files should always have imported.**

- Author `ComponentDocPage` in `docs-kit` — a single page template that takes
  `{ title, status, summary, figmaNode, specimen, props, a11y, tabs }` and renders the
  entire house shape, correctly bound, once.
- Every one of the 100 pages is rewritten onto it. The 268 unbound literals die with the
  inline style objects that hold them.
- The prose measure becomes **one** value, bound to a token, not nine px literals.
- `tools/ds-page-standard/baseline.json` ends the programme **empty**. The gate reports
  100/100. Never by weakening the gate — the gate gets *stricter* (see WS-5).

### WS-2 · The Figma registry gap

66 of 100 components have no Figma node id, which is why "a link to the component in
Figma" is the most-missing element. This is a **registry** problem, not a page problem.

- Extend `FIGMA_NODES` to cover every documented component.
- Where a Figma component genuinely does not exist yet, the page must say so in the
  department's register — *"Not yet published in the Figma library"* — rather than link
  to nothing. An honest absence is documentation; a missing link is a defect.
- `npm run check:figma-docs` gains a parity check: a documented component with no node
  and no declared absence fails.

### WS-3 · The data-visualisation system

The estate has 17 chart components and no visualisation *system*. The difference is that
a system answers questions a component cannot:

- **A colour formula, not a palette.** Categorical, sequential, diverging and status
  ramps derived from the brand tokens, each validated for contrast against both surfaces
  and for the three common colour-vision deficiencies. Never "pick a nice blue".
- **A form heuristic.** Which mark for which question — part-to-whole, change over time,
  distribution, correlation, geography, flow, rank. Written as a decision table on the
  data-visualisation page, so a portal team does not invent a donut for a time series.
- **Every state, per `.claude/rules/data-state-completeness.md`** — loading skeleton in
  the shape of the result, empty, error with retry, filtered-to-nothing worded
  differently from empty, too-much paged not scrolled. For **every** chart, not just the
  ones someone remembered.
- **One request, one answer.** A key, a chart and a table reading the same feed resolve
  it through one expression. This estate has already shipped the contradiction this
  prevents.
- **Accessibility as a first-class output**, not an afterthought: every chart ships a
  table equivalent, an `aria-label` describing the finding rather than the mark type,
  keyboard traversal of data points, and a `prefers-reduced-motion` path that does not
  animate.
- **Motion that means something.** Enter, update and exit transitions that carry the
  reader's eye from one state to the next, at the estate's motion tokens — never
  decoration, never longer than the reader's patience.
- The gap list — what a 20-portal government estate will need and does not have — is
  produced by the Business Analyst lens and built, not filed.

### WS-4 · The illustration system

Nothing exists. Build it as a system, not a folder of SVGs.

- **A drawn language, stated before a line is drawn**: geometry, stroke weight, corner
  treatment, palette (bound to brand tokens, never raw), figure style, and what it
  refuses to depict. A government estate serving Scheduled Castes, Scheduled Tribes,
  senior citizens, persons with disabilities and transgender persons cannot ship
  illustration that depicts one kind of person.
- **Three tiers**: spot (24–48px, in-line with text), scene (empty states, 240–400px),
  and hero (page-level, responsive). Each with its own construction rules.
- **Modular by construction**: a shared primitive layer (ground, figure, object, motif)
  composed into scenes, so a new scene is assembled rather than drawn.
- **Themeable**: every fill bound to a token so an illustration is correct in `blue`,
  `navy` and dark surfaces without a second file.
- **Delivered as React components** with `title`/`desc`, `role="img"`, decorative mode,
  and a size contract — never as `<img src>` into a folder of untracked SVGs.
- **Documented**: a foundations page with the language, the tiers, the do/don't, the
  contribution path, and every illustration on one specimen sheet.

### WS-5 · Governance — make it impossible to regress

Every improvement in this programme that is not gated will be gone in three weeks. That
is not a prediction; `.claude/rules/ds-documentation-standard.md` records it happening.

- `check:ds-pages` ratchets to zero and then **tightens**: the shape gains the elements
  the audit proves are missing (a runnable example, a version/since line, a related-
  components block, a "when not to use it" section).
- A new gate for unbound literals **on documentation pages specifically** — the estate
  gates type, space, radius and icon scale in the package; it does not gate the docs.
- A gate for the Figma-node parity in WS-2.
- A gate for chart-state completeness: a chart component with no empty/error/loading
  path fails.
- Every gate is a **ratchet**: new work must be perfect, baselined work may only improve,
  and an improvement must be re-baselined in the same change so one page's cleanup cannot
  silently pay for another's regression.

---

## 4. Standing constraints — these outrank anything above

1. **Standards precedence**: current design craft incl. WCAG 2.2 AA first, then DBIM,
   GIGW 3.0, UX4G. A standard's list is a floor, never a ceiling. Accessibility is never
   traded.
2. **Design-system-first**: before writing UI, list the elements, check the barrel, add
   to the DS if missing, then import. Document the audit inline.
3. **Tokens only.** No raw hex, no raw px, no arbitrary rem. `--sa-*` is the contract;
   `--sa-ref-*` primitives are forbidden from component code.
4. **Copy in a government register**, Title Case titles, `SectionTitle` for headings,
   nothing on screen that narrates the system's own construction.
5. **Every data-driven surface designs all seven states.**
6. **Noto Sans. National Emblem. No tricolour motif. Material Symbols Rounded.**
7. **Mandatory visual audit**: nothing is complete until it has been screenshotted and
   examined. Lint and typecheck passing is not verification.
8. **Never commit to `main`.** Branch, PR, merge — never rebase a long branch here.
9. **No AI co-author trailer** on any commit or PR.

---

## 5. Definition of done

The programme is done when **all** of these are true, each verified by a command whose
output is pasted into the PR:

- [ ] `npm run check:ds-pages` reports **100/100**, baseline file empty
- [ ] `npm run verify` passes clean
- [ ] The new docs-literal gate reports zero unbound values on `design-system/**`
- [ ] Every documented component either links to Figma or declares its absence
- [ ] Every chart component renders loading, empty, error and filtered-to-nothing, seen
      in a browser
- [ ] Every chart has a table equivalent and passes keyboard traversal
- [ ] The illustration system exists, is documented, is tokenised, and is used by at
      least the empty states that previously had none
- [ ] `accessibility-auditor` returns no P0 or P1 on the design-system routes
- [ ] The eight lenses re-audit the finished work and return no P0 or P1
- [ ] Every finding from the first audit is either fixed or recorded, with a reason, in
      `docs/audit/ds-world-class-audit.md`

**Anything deferred is written down where it can be acted on.** A finding that is not in
the audit document did not happen.

---

## 6. How the work is sequenced

```
  AUDIT            8 hostile lenses, in parallel, over the real files
    ↓
  CONSOLIDATE      dedupe, rank by severity, resolve contradictions between lenses
    ↓
  FOUNDATION       ComponentDocPage template · Figma registry · viz colour formula
    ↓              · illustration primitives · the new gates (failing, at first)
  SWEEP            the 100 pages onto the template · the charts onto the system
    ↓              · the illustrations drawn · the baselines emptied
  VERIFY           gates green · browser-seen · accessibility-auditor clean
    ↓
  RE-AUDIT         the same 8 lenses, on the finished work
    ↓
  CLOSE            fix what the re-audit finds; record what is deliberately deferred
```

Foundation before sweep, always. Ninety-seven pages fixed by hand is ninety-seven pages
that will drift; ninety-seven pages moved onto one template is one page to maintain.

---

## 7. What "best in the world" is being measured against

Not a feeling. These, specifically, and the estate must be able to say what it does
better or as well as each:

- **GOV.UK Design System** — the standard for public-sector clarity, evidence and
  contribution governance
- **IBM Carbon** — the standard for token architecture and data visualisation
- **Material 3** — the standard for theming, density and motion specification
- **Shopify Polaris** — the standard for writing and content guidelines
- **Atlassian Design System** — the standard for component API documentation
- **US Web Design System** — the standard for accessibility evidence in government

Where SAMAVESH is behind one of these on a dimension, the audit says so by name.
