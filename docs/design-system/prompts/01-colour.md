# 01 — Document SAMAVESH Colour (Figma library first, then the docs site)

> **This is the reference implementation of the suite.** `00-MASTER-documentation-law.md` was
> extracted from it — so where the two overlap they agree, and the master is the shorter statement
> of the same law. A reader coming to this file first loses nothing; a reader coming from the
> master will find the shared sections restated here in full, deliberately.
>
> Paste everything below the line into a fresh session. It is written to be executed by an
> agent with repo + Figma MCP access, and to be read by a human reviewer as the spec it is
> being held to. Companion to `02-typography.md`; the two pages must read as one document.
>
> **Status: executed** on branch `ds/colour-documentation`. Re-running it is a re-audit, not a
> first build — read the current `foundations/color/page.tsx` before assuming anything is missing.

---

## ROLE

You are the **Senior Design System Manager** for SAMAVESH — the shared design system behind the
Ministry of Social Justice & Empowerment's unified website and its 20+ workflow portals. You own
colour end to end: the ramps, the semantic slots, the Figma library, the documentation, and the
answer to *"which colour do I use here, and will it pass?"* for every designer and engineer in the
estate.

Colour is the hardest foundation to document well, because it is the only one where a wrong
choice is simultaneously an **aesthetic** failure, an **accessibility** failure, and a
**compliance** failure — GIGW 3.0 binds this estate to WCAG 2.1 AA, and a 4.3:1 button is a legal
defect, not a taste disagreement.

You are not writing a colour-theory essay. You are shipping the **reference that stops people
from guessing** — the one a new designer opens on day one, and the one a senior engineer opens at
2am when a status chip is unreadable in production.

Write like someone accountable for the outcome: decisive, specific, plain-spoken. Every claim
carries its evidence — a token name, a measured ratio, a file path, a test that enforces it.
**No adjective doing a number's job.** "Sufficient contrast" is not documentation; "6.68:1,
measured at build, gated by `on-pair-contrast.test.mjs`" is.

---

## MISSION

Deliver colour documentation in **two sequenced phases**, with a reconciliation before and a
pressure test after:

0. **Phase 0 — Reconcile.** Five-way agreement across source, build, live Figma, docs page and
   the generated audit. Findings reported, not silently harmonised.
1. **Phase 1 — Figma library** (`SAMAVESH Design System`, file `3FF5l0SMNIwdpZrKkeyPTm`,
   **Color Styles** page `2140:295913`). Variables and descriptions made correct, then a genuine
   documentation surface built *inside Figma* for designers who never leave it.
2. **Phase 2 — Documentation website**
   (`apps/hub/src/app/design-system/foundations/color/`, served at
   `/design-system/foundations/color`). The canonical, linkable, interactive, live-rendered version.
3. **Phase 3 — Pressure test.** Five adversarial passes, findings written up, scores stated.

Figma **first**, because the website documents what the library actually contains. Documenting an
unaudited library just publishes its bugs at higher resolution.

---

## GROUND TRUTH — READ THESE BEFORE WRITING ANYTHING

Do not start from memory or from general design-system knowledge. Read, in this order:

| # | File | What it gives you |
|---|------|-------------------|
| 1 | `docs/design-system/colour-system.md` | **Start here.** GENERATED from the built tokens by `build/generate-colour-audit.mjs` — ramp inventory with ΔL\*/hue drift, the accessibility table per mode, the hue-separation ledger. It cannot describe a system that does not exist. **Never hand-edit it.** |
| 2 | `packages/tokens/src/primitive.json` → `color.*` | Tier 1. The eight ramps, `transparent.*` alpha families, `text/border/status/a11y/brand` primitives |
| 3 | `packages/tokens/src/semantic.json` | Tier 2. The slot grammar: `bg/*`, `text/*`, `border/*`, `icon/*`, `on/bg/*` (46 pairs), `overlay/*`, `layer/*`, `focus/*`, `chart/*` |
| 4 | `packages/tokens/src/component.generated.json`, `component-matrix.json` | Tier 3 `cmp/*` — 296 of the Figma `Color` collection's 472 variables |
| 5 | `packages/tokens/build/brand-ramps.mjs`, `ramp.mjs` | How every ramp is *generated* from anchors — the shape rule, `anchorStep`, the dead zone |
| 6 | `packages/tokens/build/formats/figma-variables.mjs` | How code projects into Figma: the `Palette` / `Color` / `Static` collections, the hardcoded `["Blue","Navy"]` mode list, the measured-contrast sentence written into every description |
| 7 | `packages/tokens/reference/figma-live.json` → `Palette`, `Color`, `$orphans`, `$ghostAudit`, `$valueChecksums`, `$incidents`, `$note` | What is *actually* in the published library right now, and the fourteen-pass history of how it got there. Read `$note` in full — it is the most useful colour document in the repo |
| 8 | `packages/tokens/reference/dbim-palette.json` | DBIM's complete published palette: six primary groups × five shades + the functional palette. The source for the conformance previews |
| 9 | `packages/tokens/reference/ux4g-3.0.tokens.json` | UX4G 3.0's own 755-token contract, 167 of them colour. The parity target |
| 10 | `packages/design-system/design.md` §A, §B, §C, §5, §6 | The AI-facing contract: theming axes, the usage contract, the contrast-pairs table (**hand-maintained — not the authority**), the three tiers, the full `--ds-*` vocabulary |
| 11 | `apps/hub/src/app/design-system/foundations/color/page.tsx` | The current docs page — **1,310 lines / 49 KB in a single file, ten sections, no data module.** You are improving this, not starting fresh |
| 12 | `apps/hub/src/components/design-system/docs-kit/` | `ColorSwatch`, `TokenTable`, `DoDont`, `Callout`, `A11yChecklist`, `StatusBadge`, `TerminalCode` — reuse these; add to them rather than to the page |
| 13 | `packages/tokens/test/` | The guardrails you must not break — see the test map below |
| 14 | `apps/hub/src/lib/design-system/figma.ts` | Canonical Figma file URL + node IDs. Deep-link with `figmaUrl(FIGMA_NODES.color)`; **never paste a raw URL** |
| 15 | `docs/design-system/HANDOFF-colour-ramps-and-dbim.md` | How the ramps were rebuilt on 2026-08-11 and why. The reasoning you must not contradict |

### The test map — name these in the docs, because they are the reason the claims are trustworthy

| Test | What it enforces |
|---|---|
| `on-pair-contrast.test.mjs` | Every `on/*` foreground vs the fill it names, in every mode. `KNOWN_BELOW_AA` **may only shrink** |
| `prominence-contract.test.mjs` | A token's published contrast class is true. Carries the shortfall ledger |
| `hue-separation.test.mjs` | Families that mean different things look different. Discovers brands from the stylesheet |
| `brand-contrast.test.mjs` | Rebuilds `dist/` as `BRAND=_starter` — **never run concurrently with a build** |
| `mode-contrast.test.mjs`, `action-contrast.test.mjs` | Per-mode and interactive-state contrast |
| `slot-disjointness.test.mjs`, `tier-discipline.test.mjs`, `naming-grammar.test.mjs` | The grammar: a slot means one thing, a tier is in the name, names are reversible |
| `figma-value-parity.test.mjs`, `figma-roundtrip.test.mjs`, `figma-ghost-bindings.test.mjs` | Code ↔ Figma value identity, name reversibility, no dead bindings |
| `visual-contract.test.mjs`, `ux4g-contract.test.mjs`, `ux4g-parity.test.mjs` | Frozen baselines. **Re-baseline deliberately, never to make a test pass** |

### Facts you are expected to already know by the time you author anything

Verify each against the files. **If any is wrong, that discrepancy is itself a finding to report.**

- **Brand is the only colour axis.** `data-brand` ∈ `{blue (default), navy}`. `data-surface`
  (website/portal) is a **type axis only** and touches no colour. `data-theme` was **removed on
  2026-08-10** — dark and high-contrast belong entirely to the UX4G accessibility widget, which
  applies its own `.dark-mode` class and never read `data-theme`.
- **A brand swap repaints exactly two things: the primary ramp and the neutral greys.**
  Secondary (India Saffron `#FF671F`) and accent (India Green `#046A38`) are **SAMAVESH logo
  colours — brand-INVARIANT**, constants of the identity rather than variants of it. Navy used to
  swap secondary to green and landed 1.00:1 from success: audit finding C-02.
- **Eight ramps.** Seven chromatic at 11 steps (50–950, matching UX4G 3.0): `primaryScale`,
  `secondaryScale`, `accentScale`, `successScale`, `dangerScale`, `warningScale`, `infoScale`.
  One neutral at **13** steps (0–1000) — because `0` is pure `#ffffff` and `1000` pure `#000000`,
  which are achromatic **by definition** and therefore live only here.
- **The shape rule:** every step 4–16 L\* from the last, monotonic, hue held within ~6°, chroma on
  a single arc peaking at the anchor. All eight ramps satisfy it. The last four
  (danger/warning/info/neutral) were rebuilt on 2026-08-11.
- **`anchorStep` is chosen by the anchor's LIGHTNESS, not by convention.** `#162F6A` is L\* 32 →
  rung 600. `#FF671F` is L\* 70 → rung 400. Forcing an anchor to 500 pushes a rung into the
  **dead zone (~L\* 59–66)** where a fill is too dark for dark ink and too light for white and
  *neither* reaches 4.5:1. This lesson was learned twice, expensively. Document the dead zone.
- **The neutral ramp is deliberately tinted**, hue-locked to the brand's own primary (255° blue,
  264° navy), chroma on one arc peaking ~0.016 in the mid-tones and falling to zero at both ends.
  The old defect was an *inconsistent* tint (22° of hue wander), not the tint itself.
- **The prominence ladder is UX4G's vocabulary:** `subtler · subtle · base · bold · bolder ·
  boldest`, plus `disabled` and `inverse` on neutral. It is a **ladder of prominence, not of
  contrast** — see the next point.
- **A rung name is not a guarantee.** Nineteen tokens measure below the class their rung implies,
  mostly `bg/*` tonal chips where the fill ladder's ≥3:1 is the wrong requirement rather than the
  colour being wrong. They are on the ledger in `prominence-contract.test.mjs` and stated plainly
  in each Figma description. **Choose a token by its measured number, never by how loud its name
  sounds.** Making this impossible to miss is a primary objective of this work.
- **Contrast is MEASURED AT BUILD, not asserted.** Every `--sa-*` colour token carries a class
  measured against its own surface across every brand, published to
  `dist/figma.variables.json` (`contrast.measured` / `contrast.shortfall`) **and into the Figma
  variable's own description.** The table in `design.md` §C is hand-maintained and is **not** the
  authority; when the two disagree, the measurement wins and the table gets fixed.
- **46 `on/*` pairs**, each pairing a fill with the ink chosen for it **by measurement in the
  worst brand**, not by assumption. As of 2026-08-11 the estate's own brands have **zero** AA
  shortfalls. The last two closed when danger and warning were re-anchored at 400 and 300.
- **`dbim-*` is six CONFORMANCE PREVIEWS, not brands, and is CODE-ONLY.** Each transcribes one of
  DBIM's six published groups verbatim (five shades pinned at 100/200/400/600/800, the rest
  interpolated) **and** applies DBIM's whole functional palette — Liberty Green, Mustard Yellow,
  Coral Red, DBIM Blue, DBIM's **pure** greys, Deep Earthy Brown `#150202` body ink. A mode
  repainting only the primary ramp would not be conformance. They live only in the DemoDock's
  Colour tab. **The Figma Palette collection stays exactly `["Blue","Navy"]`** — enforced by
  construction in the exporter, and asserted by the push script before it writes.
- **The shape rule does not apply to the DBIM six**, by construction: an exhaustive search proved
  reproducing DBIM's exact hexes and holding a 4–16 L\* ladder are mutually exclusive for five of
  six groups. The accessibility gates are what still bind — and `dbim-green`'s
  `brand-primary-bolder` measures **4.32:1**, which is DBIM's own published shade 2. It is
  reported, not smoothed over. Say so plainly: it is a finding about DBIM's palette and a reason
  to pick a different group.
- **Two more opt-in modes: `ux4g` and `ux4gdeep`** carry UX4G 3.0's own violet literally, so
  conformance can be *demonstrated* by flipping an attribute. They ship in
  `@mosje/design-system/ux4g.css` and are deliberately **not** merged into `COLOR_MODES` — offering
  a mode in an app that has not loaded that stylesheet is a switch that does nothing.
- **Hue separation is a ledger, not a pass/fail.** A pair passes on hue **or** perceptual distance.
  `accent · success` at Δhue 0° is a **deliberate union** (they are the same green).
  `primary · info` at 1° is deliberate. `error · secondary` is a **known defect on the ledger**.
  Every row whose worst case is a `dbim-*` mode is a finding about DBIM's palette. Documenting
  *which* is which — decision vs defect — is the whole point.
- **Alpha families** (`transparent.<family>.<8|16|24|32|40|48>`) are consumed via the canonical
  `--sa-color-transparent-*` names and have **no `--ds-*` alias**.
- **The chart palette is colour too, and it is where colour-blindness bites hardest.** 12
  categorical, `seq/50–900`, seven `div/*`, three `trend/*`, six structural. `chart/cat/2` was
  repointed off the bright logo saffron because it measured **2.91:1** — the only one of twelve
  under WCAG 1.4.11's 3:1. The seven `div/*` were literals and had already drifted; they are now
  aliases onto Palette.
- **Shadow ink is colour.** Six `elevation/*` effect styles exist (`flat` carries no shadow); the
  five that do are tinted toward the body ink
  (`rgba(30,33,36)`), retinted on 2026-08-11 when neutral moved. Six pre-existing
  `Shadows/shadow-*` styles on flat `#212121` have **never** matched the token source and are
  annotated rather than corrected, because their consumers cannot be enumerated from inside a
  published library.
- **The Figma library has no colour PAINT STYLES, and that is correct** — colour is variables, so
  it can be mode-aware and bound. Verify with `getLocalPaintStylesAsync` and document the absence
  as a decision, not an omission. (Contrast with typography, where text styles exist as a
  Styles-panel convenience.)
- **24 orphan colour variables sit in the live Palette collection** —
  `border/neutral/inverse`, `focus/ring`, and 22 `ref/color/*` legacy names. They are the only
  variables without `codeSyntax`, and `border/neutral/inverse` still publishes the dead name
  `var(--color-border-neutral-inverse)`. Left in place **deliberately**: a published library
  cannot enumerate its consumers, so a delete is unverifiable. Retire only by **rename to
  `deprecated/*`**, never by deletion.
- **Never delete-and-recreate to rename.** A rename preserves the variable id and every binding
  follows it; a recreated variable takes a new id and every old binding becomes a ghost. And a
  **missing NAME does not mean a missing VARIABLE** — look the id up with `getVariableByIdAsync`
  before concluding anything was destroyed. A concurrent session filed a false incident on exactly
  this.

---

## COVERAGE CONTRACT — what "everything about colour" means

The finished documentation, across both surfaces, must answer every one of these. Treat it as a
checklist and state explicitly, in your report, which ones you covered and where.

1. **Why the palette is what it is** — DBIM's requirement for a ministry key colour, the SAMAVESH
   logo colours, and why the estate is blue rather than UX4G violet.
2. **The three tiers** — `ref` → system → `cmp`, which one you may type, and why the one you type
   90% of the time is the shortest.
3. **The ramps** — all eight, every step, with L\*, ΔL\*, hue and chroma; the shape rule; how
   `brand-ramps.mjs` generates them from anchors; and what a "50" and a "950" are *for*.
4. **The slot grammar** — `<slot>/<family>/<prominence>[/<state>]`. How to read a token name and
   how to construct the one you need without looking it up.
5. **The prominence ladder** — what each rung means, what it is safe for, and the hard warning
   that a rung name is a prominence claim, not a contrast guarantee.
6. **The `on/*` contract** — the single most useful idea in the system: never choose an ink,
   use the one measured for that fill. All 46 pairs with their ratios.
7. **Status colours** — success/error/warning/info: the semantics, why warning is amber and not
   yellow, why info is not primary, and the non-colour-alone rule (WCAG 1.4.1).
8. **Interactive states** — default/hover/active/visited/disabled/focus, and the focus ring
   (`--sa-focus-ring/width/offset`) as a colour contract with a 3:1 non-text requirement.
9. **Surfaces, layers and elevation** — `layer/0–3` + `layer/border/0–3`, when to raise a layer vs
   draw a border, and the shadow ink.
10. **Borders and icons** — why they have their own slots and their own 3:1 floor.
11. **Neutrals** — the tinted grey, why it is tinted, why `0`/`1000` are not, and how to pick a
    grey without reaching for a one-off hex.
12. **Alpha / transparency** — the six steps, what they are for (scrims, focus rings, hovers),
    and the trap that a translucent fill's contrast depends on what is behind it.
13. **Data visualisation** — categorical (and its 12-series ceiling), sequential, diverging,
    trend, structural. Colour-blind safety, the 3:1 adjacency rule, and **never colour alone**.
14. **Brand modes** — blue vs navy side by side; brand islands and the `colorModeInitScript()`
    flash-prevention; what a swap does and does not change.
15. **DBIM conformance previews** — all six, what they prove, the `dbim-green` shortfall, and the
    standing rule that they never reach Figma.
16. **UX4G 3.0 parity** — the crosswalk, the `--ux4g-*` layer, the two mapping rules
    (structure = exact values, colour = by role), and why we conform to the specification and not
    the distribution.
17. **Accessibility** — WCAG 2.1 AA (1.4.1, 1.4.3, 1.4.6, 1.4.11), GIGW 3.0, the UX4G widget's
    dark and high-contrast modes, colour-vision deficiency, Windows High Contrast / forced-colours,
    `prefers-contrast`, and how to verify rather than assume.
18. **Do / Don't** — at least eight pairs on real MoSJE UI, every one of them a mistake that has
    actually been made in this estate.
19. **Legacy and migration** — the `--ds-*` aliases, the traps, the neutral renumbering, the
    orphan variables, and what replaces each.
20. **Governance** — where to propose a colour, what gates it must pass, how it reaches Figma,
    and who signs off.

---

## QUALITY BAR

The target: *if this page were published publicly, it would be cited alongside the systems below —
not compared unfavourably to them.* Study what each does better than everyone else and take it
deliberately.

| System | Take this |
|---|---|
| **Material 3** | Colour **roles** and the `on-` pairing convention; tonal palettes; dynamic colour and tonal elevation as a mental model |
| **Radix Colors** | The best answer in the industry to *"what is each step FOR?"* — every rung has a stated job (app background, subtle bg, borders, solid, hover, text). Steal the rigour, not the numbering |
| **Adobe Spectrum 2** | Background-layer-aware colour and per-token contrast targets stated as design intent, not as an afterthought |
| **IBM Carbon** | The layering model (`layer-01/02/03`) and theme matrices; contrast pairs shown as a grid |
| **Atlassian** | The prominence ladder (`subtlest → bolder`), a real deprecation lifecycle, and codemod-grade migration tables |
| **Shopify Polaris** | Ruthless "use for / never use for" per token, on real product UI |
| **GitHub Primer** | Honest colour-mode matrices and deprecation tables that name what replaces what |
| **USWDS** | Accessible-by-construction: colour families × grades where the *grade number predicts the contrast*, and a magic-number pairing table a civil servant can use without a contrast checker |
| **GOV.UK** | Plain-language guidance and a deliberately small palette for a civic audience |
| **Apple HIG** | System colours, vibrancy, and honouring the user's own Increase Contrast / Reduce Transparency settings |
| **Salesforce Lightning** | Accessibility-driven naming and the discipline of documenting *why* a token exists |

### UX4G 3.0 specifically — mine it, then say what you took

UX4G is the Government of India's own design system and this estate holds a **parity contract**
with it. A designer moving between the two libraries must not find a different grammar.

**Take:** the `bg` / `text` / `border` / `icon` slot families and the prominence ladder (already
adopted — now *document the crosswalk* so a UX4G-trained designer transfers instantly); the 11-step
50–950 ramp shape; **Theme Craft**, UX4G's own theming tool, which is the sanction for substituting
a ministry key colour — cite it as the reason MoSJE blue is *conformant*, not a deviation; the
token-count discipline (167 colour tokens, all named).

**Do not take:** UX4G's violet as a default (DBIM requires the ministry's key colour); the
distribution — `ux4g-web-components` is a 7.6 MB stylesheet plus a 286 KB runtime that rewrites
the DOM React owns and breaks hydration in Next 16. **We conform to the specification, not the
distribution.** Say that on the page, with the numbers.

**Prove it, don't claim it:** the `ux4g` / `ux4gdeep` modes let a reviewer flip the estate into
UX4G's literal palette. Wire that into the docs page as a live control. The conformance number is
**calculated, never estimated** — `node tools/ux4g-conformance/measure.mjs`; the position and
rationale are in `docs/ux4g/UX4G-Code-Readiness-Audit.md`. Re-run it and quote the fresh figure
rather than the one written here.

### Where SAMAVESH must BEAT all of them, because they don't have the problem

1. **Measured, not asserted.** Nobody in the list above ships a library whose every colour
   variable carries its own build-measured contrast class *in its Figma description*, gated by a
   test that fails the build when the sentence stops being true. This is the system's single
   strongest idea and it is currently undocumented as an idea. Lead with it.
2. **Brand-invariant identity colours.** Two brands where the swap is provably scoped to primary +
   neutral, with the audit finding (C-02) that taught it.
3. **Conformance previews as a first-class artefact** — DBIM's six groups, evaluable live,
   including the one that fails. Documenting a standard's own shortfall, with the measurement,
   is something no commercial system has to do.
4. **A parity layer to another government system** that resolves 755 foreign tokens onto ours.

Those four sections should be the best writing on the page.

---

## TOOLING — USE WHAT THIS REPO ALREADY HAS

Do not hand-roll workflows the estate has already solved.

| Tool | Use it for |
|---|---|
| **`/sync-figma`** | Phase 0 reconciliation of Figma ↔ `@mosje/tokens`. Do not invent a comparison script |
| **`figma-use`** | **Mandatory before *every* `use_figma` call. No exceptions.** |
| **`figma-generate-library`** | Authoring variables, collections, descriptions, library structure |
| **`gov-compliance`** | DBIM + GIGW 3.0 + UX4G checks — run on the finished docs page |
| **`dataviz`** | **Before writing a single line of the chart-colour section.** It owns the categorical/sequential/diverging colour formula and its validator |
| **`design-consultation`** | Pressure-test the information architecture of both surfaces before you build them |
| **`accessibility-auditor`** agent | Before declaring the website page done |
| **`design-system-guardian`** agent | To catch hardcoded values and DS drift in your own markup |
| **`superpowers:verification-before-completion`** | Evidence before assertions. Every "passes" claim needs pasted output |
| **Preview tools** | `preview_start` → `/design-system/foundations/color`. `npm run dev` at repo root, port 3007. **Verify in the browser yourself; never ask the user to check manually** |
| **`find-skills`** | If you believe a skill exists for something here that isn't listed, find and install it rather than improvising |

**If the Figma MCP server is not authorised in this session, STOP and say so.** It needs
authorising via `claude mcp` or `/mcp` in an interactive session. Do not fake Phase 1, do not
document the library from `figma-live.json` alone as though you had inspected it, and do not
silently reorder the phases to do the website first. Report the block, then ask whether to proceed
with Phase 0 + Phase 2 only.

**Check for concurrent sessions.** Two agents worked this repo simultaneously on 2026-08-11 and it
produced a false incident report and a mid-task branch switch. `git status` and
`git branch --show-current` before and after anything consequential.

---

## PHASE 0 — RECONCILE BEFORE YOU DOCUMENT

Produce a **five-way reconciliation** across every place colour is currently defined:

1. `src/primitive.json` + `src/semantic.json` + `src/component.generated.json` (DTCG source)
2. `dist/tokens.css` → `--sa-*` and the `--ds-*` legacy aliases (generated output)
3. `reference/figma-live.json` → `Palette` (164) + `Color` (472) + `Static` (46) — the library
4. `apps/hub/.../foundations/color/page.tsx` — what the docs page currently *claims*
5. `docs/design-system/colour-system.md` — the generated audit

Output a table: **token × the five values × verdict (match / drift / missing / orphan)**.

Then answer these specific questions, each with evidence:

- Does `dist/figma.variables.json` `contrast.measured` agree with every published Figma
  description? (`figma-value-parity` + `prominence-contract` should already say yes — confirm,
  don't assume.)
- Are the **24 Palette orphans** still orphaned, and does `border/neutral/inverse` still publish
  the dead `var(--color-border-neutral-inverse)`? Propose the `deprecated/*` rename path. **Do not
  delete anything.**
- Is `$valueChecksums.knownDifference` still empty?
- Does `page.tsx` hardcode any hex, ratio or token list that the build could generate? **Every
  hardcoded value in the docs page is a future drift incident** — the typography work found
  exactly this and the fix was `typography-data.ts`. Here, go one better: propose generating
  `color-data.ts` from `@mosje/tokens` rather than hand-maintaining a sixth source of truth.
- Do `npm run build -w @mosje/tokens` and `npm test -w @mosje/tokens` pass **before** you touch
  anything? Run them **sequentially** — `brand-contrast.test.mjs` rebuilds `dist/` as
  `BRAND=_starter`, so a concurrent build produces spurious failures. **If red, stop and report.
  Do not document on top of a red build.**

Rules for what you find:

- **Every drift is a finding with a named owner file.** Never silently harmonise the docs to hide
  a library bug — that converts a visible defect into an invisible one.
- **Report Phase 0 and wait for a decision before changing any token value.** Documenting is in
  scope. Re-authoring the palette is not, unless explicitly approved.

---

## PHASE 1 — FIGMA LIBRARY

Invoke `figma-use` before any `use_figma` call, and `figma-generate-library` for library-shaped
work. Read them; do not improvise the Plugin API.

### 1.1 — Variables hygiene

- Confirm `Palette` holds all eight ramps at full length, resolving correctly in **both** `Blue`
  and `Navy`, and that the mode list is still **exactly `["Blue","Navy"]`**.
- Confirm `Color` holds the semantic slots as **aliases onto Palette**, never literals. The
  `chart/div/*` incident (seven literals that silently drifted) is the pattern to check for
  everywhere: **any colour variable holding a raw value that a Palette rung already expresses is a
  future drift**. Enumerate them.
- Every colour variable carries a **description** that a designer can act on: what it is for, when
  to reach for it, its code token, **and its measured contrast sentence**. An undescribed variable
  is an undocumented one; a variable whose description states a measurement of a colour the file
  no longer holds is worse than undescribed.
- Verify `codeSyntax` on everything the source owns.
- Confirm no colour **paint styles** exist (`getLocalPaintStylesAsync`); if any are found, report
  them rather than deleting — they may be bound in consumer files.
- Audit the effect styles that carry colour: six `elevation/*` (tinted ink, generated), six
  `Focus States/*` (variable-bound — the healthy ones), six `Shadows/shadow-*` (flat `#212121`,
  never matched the source, **annotated deliberately, do not "fix"**).

### 1.2 — The Figma documentation page

Build a real documentation page on the **Color Styles** page (`2140:295913`) — not a swatch dump.
Auto-layout throughout, on the SAMAVESH spacing scale, using SAMAVESH colour and type variables.
**The colour documentation must itself pass a design-system audit**, and every swatch must be
variable-**bound** so the page breaks visibly if the library drifts. A documentation page painted
with hex fills is a lie waiting to happen.

Frames, in this order (the website's section order must match):

1. **At a glance** — the whole system in one frame: 2 brands, 8 ramps, 6 prominence rungs, 46
   measured ink pairs, 0 AA shortfalls. A designer who reads only this frame should still choose
   correctly 80% of the time.
2. **Anatomy of a colour token** — one diagram decoding
   `bg/status/error/bolder` → `--sa-bg-status-error-bolder` → the Palette rung it aliases → the
   `on/*` ink measured for it. This single frame is what makes the vocabulary self-service.
3. **The three tiers** — `ref` / system / `cmp`, with the rule about which one you may type.
4. **The ramps** — all eight, every rung, each annotated with hex, L\*, ΔL\* from the previous
   rung, and its contrast on white and on the darkest surface. Show the shape rule as a curve,
   not as a sentence.
5. **The prominence ladder** — the six rungs on one family, side by side, each labelled with what
   it is for **and its measured class**. Include the warning about rung names in this frame, not
   in a footnote.
6. **`on/*` — never choose an ink** — the 46 pairs as filled chips with their ink and ratio
   rendered on them. The best frame on the page if you do it well.
7. **Slots** — `bg` / `text` / `border` / `icon` / `overlay` / `layer` / `focus`, each shown on
   real UI, with what distinguishes them.
8. **Status** — the four families with real components (alert, chip, inline validation, toast),
   plus the non-colour-alone rule shown as a do/don't pair.
9. **Interactive states & focus** — default → hover → active → disabled → focus for the primary,
   secondary, destructive and tonal action families.
10. **Surfaces, layers & elevation** — `layer/0–3` stacked, with the shadow ink and when to raise
    a layer instead of drawing a border.
11. **Neutrals & alpha** — the 13-step grey with its tint explained, and the six alpha steps with
    the "contrast depends on what's behind it" trap.
12. **Two brands, side by side** — the same screen in Blue and Navy. State plainly what changes
    (primary + neutral) and what cannot (secondary, accent).
13. **Data visualisation** — the categorical 12, sequential, diverging and trend sets, with
    colour-blind simulation and the 3:1 adjacency rule.
14. **Do / Don't** — at least eight pairs on real MoSJE UI.
15. **Accessibility** — the AA floors, the measured-not-asserted principle, the UX4G widget's dark
    and high-contrast modes, and how to verify.
16. **Handoff** — token → CSS variable → React prop, with a copyable snippet per family.
17. **Deprecated & legacy** — the 24 orphans, the `--ds-*` alias traps, the neutral renumbering,
    with a migration column and the `deprecated/*` rename path.
18. **Provenance** — where every value comes from: which are DBIM's, which are UX4G's, which are
    SAMAVESH decisions, and which are generated. Mirror what the typography page did.

**Not in Figma, by standing instruction:** the six `dbim-*` conformance previews. Document that
they exist, that they are code-only, and where to find them (DemoDock → Colour). Do **not** create
a Dbim mode or a Dbim frame. Adding one is a deliberate act that needs asking first.

### 1.3 — Figma craft rules

- No detached fills, no local styles, no hardcoded hex anywhere on the page.
- Every frame named and reachable; section order matches the website's.
- Descriptions on variables and effect styles, because that is what Dev Mode surfaces.
- **Rename, never delete-and-recreate.** Verify `idsPreserved` after any rename.
- Publish the library, then **verify from a consumer file** that variables and descriptions
  actually arrived. Publishing is not the same as having published successfully.
- Afterwards refresh `packages/tokens/reference/figma-live.json` and append to its `$note` in the
  established voice — what changed, what did not, and why.

---

## PHASE 2 — DOCUMENTATION WEBSITE

Location: `apps/hub/src/app/design-system/foundations/color/`.

You are **upgrading** `page.tsx`, not replacing it. Read all 1,310 lines first and keep what
already works (the ten-section spine, the callouts, the token reference tables).

**Design-system-first is mandatory.** Before writing UI, run the DS audit from `CLAUDE.md`: list
every element the page needs, check `packages/design-system/index.ts` + `design.md`, import what
exists, and **add to the DS first** anything that doesn't. Document the audit inline as a comment
block. A swatch grid, a contrast-pair row or a ramp strip that other foundation pages could use
belongs in `docs-kit`, not in this page's file.

**Split the file.** 49 KB in one component is the same failure mode the typography page had, and
the fix is the same shape but better: extract a `color-data.ts` that is **generated from
`@mosje/tokens`**, not hand-copied. A hand-maintained table is the sixth source of truth and the
next drift incident.

### What only the web can do — build these

- **Live-rendered everything.** Never a screenshot of a colour. The page must break visibly if the
  tokens drift.
- **Brand switcher wired into the page** — flip blue / navy / the six DBIM previews / UX4G violet
  and watch every swatch, ratio and example repaint **in place**. This is the single most
  persuasive thing the web version can offer and Figma cannot.
- **A live contrast readout on every pair** — computed in the browser from the resolved custom
  property, not printed from a table. If a token drifts, the number moves.
- **Copy-to-clipboard on every token name**, with the CSS variable, the Tailwind/utility form
  where one exists, and the React usage.
- **A "which token do I use?" decision path** — a short interactive flow: what are you colouring
  (text / fill / border / icon / chart) → what does it mean (neutral / brand / status) → how loud
  → here is your token, its ink, and its measured ratio.
- **A colour-vision-deficiency simulator** on the chart and status palettes (protanopia,
  deuteranopia, tritanopia, achromatopsia).
- **The rung-name warning as a first-class section**, not a buried callout: a table of the 19
  ledger tokens — token → the class its rung implies → what it actually measures → what to use
  instead when you need the guarantee.
- **The legacy alias table**, transcribed from the generated `tokens.css`: `--ds-danger` (5.8:1,
  safe for text) vs `--ds-danger-500` (3.8:1, **fills and borders only**); `--ds-yellow` (1.4:1,
  **never text**); the neutral renumbering where `--ds-neutral-1100` sits one rung off the
  canonical `--sa-color-neutralScale-*` spelling. State exactly which aliases mislead and which are
  safe — that precision is what made the typography version useful.
- **Deep links to Figma** via `figmaUrl(FIGMA_NODES.color)`.
- **Plain-English framing throughout.** Every technical section gets an "In plain terms" line, in
  the voice the page already uses. The audience includes government stakeholders who are not
  designers and will be asked to sign this off.

### Accessibility of the documentation page itself

WCAG 2.1 AA + GIGW 3.0, non-negotiable. Semantic headings in order, real `<table>` markup for spec
tables, `lang="hi"` on any Devanagari, visible focus, keyboard-operable controls, AA contrast, and
the whole page usable at 200% zoom. **Every swatch needs a non-colour label** — a colour page that
communicates by colour alone fails 1.4.1 while explaining 1.4.1. Test under the UX4G widget's dark
and high-contrast modes and under `forced-colors: active`. Run the `accessibility-auditor` agent
before declaring done.

### Keep the estate in sync

- `packages/design-system/design.md` §A/§B/§C/§6 — update, **fix the hand-maintained contrast
  table against the measured numbers**, and bump `Last reviewed`.
- `packages/design-system/AGENTS.md` and `/design-system/llms.txt` — the design-system rule
  requires lockstep.
- Regenerate `docs/design-system/colour-system.md` via its generator. **Never hand-edit it.**
- The changelog (`apps/hub/src/app/design-system/resources/changelog/page.tsx`) — append an entry.
  **Read `CLAUDE.md` on changelog conflicts first:** parallel branches collide on version numbers;
  entries must stay strictly descending with exactly one `current: true`.
- Navigation: the page must be reachable from foundations nav and appear in `llms.txt`.

---

## PHASE 3 — PRESSURE TEST (mandatory; iterate until clean)

Do **not** report completion after one pass. Run all six reviews below against your own output,
write down what each found, fix it, re-run. **A pressure test with no findings is evidence the
test was too soft, not that the work was perfect.**

1. **The new designer.** Joined today, opens the page cold. Can they colour a portal status chip
   correctly — fill, ink, border — without asking anyone? Time-to-first-correct-decision is the
   metric. If any section needs prior SAMAVESH knowledge to parse, rewrite it.
2. **The engineer at 2am.** A destructive button's label is unreadable in production. Does the page
   get them from symptom → `on/bg/status/error/*` → the right token in under 60 seconds? If not,
   that section is buried.
3. **The adversarial reviewer.** Hunt for: any hex that disagrees with `dist/tokens.css`; any ratio
   that disagrees with `contrast.measured`; tokens documented but absent from the library (or the
   reverse); a "brand swap changes X" claim that is not true of both brands; any screenshot that
   could go stale; any rule stated without a reason; any hardcoded colour in the docs page's own
   markup; any place the page implies a rung name guarantees contrast.
4. **The accessibility auditor.** 1.4.1 (colour alone) on every status, chart and swatch; 1.4.3 on
   every text pair; 1.4.11 on every border, icon, focus ring and chart series; 200% zoom;
   `forced-colors: active`; the UX4G widget's dark and high-contrast modes; CVD simulation on the
   categorical 12. Then: **does the page's own markup pass everything it preaches?**
5. **The compliance officer (DBIM + GIGW + UX4G).** Is the ministry key colour used as DBIM
   requires? Is the UX4G parity claim stated with its measurement rather than asserted? Is the
   `dbim-green` shortfall disclosed rather than buried? Is there any tricolour stripe motif
   anywhere (there must not be)?
6. **The peer design-system manager** from Carbon / Polaris / Material. Their question is
   *"what's missing that your users will hit in month two?"* Check honestly for: colour on
   images and video overlays; print styles; email/PDF colour; charts at small sizes; colour in
   maps and choropleths; selection and highlight colours; scrollbars and native controls;
   `color-scheme`; long-term theming for a future 21st portal; and the deprecation timeline.

**Scoring.** Before finishing, score the output 1–5 on each of: *findability, correctness,
completeness, plain-language clarity, visual craft, accessibility, code↔Figma parity, and
resistance to drift.* **Any dimension below 4 must be fixed, not explained.** State the scores.

**No self-certification.** You may state that a check ran and what it output. You may **not**
declare WCAG or GIGW compliance on your own authority — that needs human sign-off. Say which
claims are verified by a command, which by inspection, and which are still open.

---

## DEFINITION OF DONE

- [ ] Phase 0 five-way reconciliation produced; every drift reported with its owner file
- [ ] `npm run build -w @mosje/tokens` and `npm test -w @mosje/tokens` pass (run sequentially); output pasted
- [ ] Figma: variables and descriptions verified, aliases confirmed (no stray literals), 18-frame
      documentation page built, library published **and verified from a consumer file**
- [ ] `Palette` modes still exactly `["Blue","Navy"]`; no `dbim` anything in Figma
- [ ] `figma-live.json` refreshed and its `$note` appended
- [ ] Website: page upgraded, `color-data.ts` generated from tokens, DS audit documented inline,
      anything reusable pushed into `docs-kit`
- [ ] The rung-name warning and the `--ds-*` alias traps are impossible to miss on both surfaces
- [ ] All 20 coverage-contract items addressed, and stated where
- [ ] `design.md` (with its contrast table corrected), `AGENTS.md`, `llms.txt`, changelog, nav updated
- [ ] `colour-system.md` regenerated, not edited
- [ ] `accessibility-auditor` and `gov-compliance` run; output pasted; issues fixed
- [ ] `npm run lint` + `npm run typecheck` pass in `apps/hub`
- [ ] Page verified in the browser at 360 / 768 / 1280px, in both brands, all six DBIM previews,
      the UX4G modes, and under the widget's dark + high-contrast modes
- [ ] All six pressure-test passes run; findings, fixes and the eight scores written up

---

## HARD RULES (from `CLAUDE.md` — these override anything above)

- Work on a branch: `git switch main && git pull && git switch -c ds/colour-documentation`.
  **Never commit to `main`** (a husky hook blocks it). Sync `origin/main` at session start and
  before the PR; **merge, do not rebase**. Land the unit of work when it is done, not when the
  whole initiative is.
- **No AI co-author or "Generated with" trailers** in commits or the PR body.
- **`dbim` is code-only.** It must never reach Figma unless explicitly asked. The `Palette`
  collection stays `["Blue","Navy"]`.
- **No Indian tricolour band/stripe motif** anywhere in the documentation UI.
- **Design tokens only** — no hardcoded colour in the docs page you are building.
- **Do not hand-edit generated files:** `packages/tokens/dist/`,
  `packages/design-system/tokens.css`, `packages/design-system/tokens.ts`,
  `packages/config/tailwind-preset.cjs`, `docs/design-system/colour-system.md`. Edit the source
  and rebuild.
- **Do not change token values without approval.** Documenting ≠ redesigning the palette.
- **Do not re-baseline a fixture to make a test pass.** Re-baseline only after confirming the
  drift is exactly what you intended, and audit the diff against both parents.
- **`KNOWN_BELOW_AA` may only shrink.** Never widen a threshold to accommodate a colour.
- Ask before renaming any published variable or retiring an orphan. Never delete — rename to
  `deprecated/*`.
- Never `rm -rf` project content (the guard hook blocks it). Never touch `Incoming/`. Never read
  or commit `.env*`.

---

## OUTPUT FORMAT

Report back in this order:

1. **Phase 0 reconciliation** — the drift table and what it means
2. **What changed in Figma** — variables, descriptions, the documentation page, publish status,
   and the `figma-live.json` note you appended
3. **What changed on the website** — files touched, DS additions made, screenshots at each
   breakpoint and in each brand
4. **Coverage-contract checklist** — all 20 items, where each is covered
5. **Pressure-test log** — the six passes, findings, fixes, and the eight scores
6. **Open items** — anything needing human sign-off, and anything you deliberately left out
7. **Task Summary** — the mandatory plain-English block:
   *What I did / What's working / What's next & recommendations*
