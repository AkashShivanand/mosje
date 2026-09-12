# The SAMAVESH house standard — what the estate actually does

> **What this is.** The visual standard a MoSJE portal is held to **when it has no design frames
> of its own**. It exists because PM-AJAY needed auditing and had no usable design: the handoff
> file's PM-AJAY page is a draft, so there was nothing to put in a side-by-side report's left
> panel. Without a written standard, that audit would have been opinion.
>
> **Generated, not written.** The machine-readable form is
> [`tools/design-audit/house/samavesh-house-standard.json`](../../tools/design-audit/house/samavesh-house-standard.json),
> produced by `python3 tools/design-audit/house/derive.py`. This page is the prose reading of it.
> Re-derive after a token release; `derive.py --check` fails when it is stale.

## 1. Two sources, and only one of them is an authority

| | Source | What it is for |
|---|---|---|
| **Contract** | `packages/tokens/dist/tokens.css` — the generated Tier-2 `--sa-*` layer | **Convicts.** Versioned, generated from DTCG source, already gated by `npm test -w @mosje/tokens`. A finding cites this or it cites nothing. |
| **Evidence** | All 12 pages of the Figma handoff file, measured as frequency histograms | **Corroborates and ranks.** Never creates authority. |

The rule the whole thing turns on:

> A build value is a **portal defect** only when it is absent from the **contract**.
> A value absent from the contract but **widespread in the Figma file** is a **house-standard gap** —
> raised against the design system, never against the portal.

**Why that split is not bureaucracy.** §4 is what happens without it.

Evidence base: the histogram script is `house/figma_histogram.js`, one call per page, and the raw
result is `house/evidence/figma-page-histograms.json`. Ten pages count. **The PM-AJAY page is
excluded** — it is the page under audit *and* a draft, and letting it vote on the standard it is
judged by is circular. It is also the least token-bound page in the file, which corroborates the
draft label:

| | Variable-bound fills |
|---|---|
| The other ten pages | **47.4%** |
| The PM-AJAY draft page | **30.1%** |

Across the whole file, **a little over half of all sampled fills are literals, not variables.** A
literal that merely *equals* a token is not bound to it — that is the defect
[`documentation-ds-linkage.md`](../../.claude/rules/documentation-ds-linkage.md) names — so this
is the design file's own adoption figure, and it is not a statement about any build.

## 2. Type

**One family: Noto Sans.** Icons are **Material Symbols Rounded**, weight 300, size = line-height.

The published ramp splits in two, and the split matters more than the numbers:

- **Fixed tiers** — body, label, title, `headline-6`. `body-2` is **14/20 Regular** and is the
  estate's workhorse: the single most-used size on nine of ten pages.
- **Fluid tiers** — every `display-*` and `headline-1`…`headline-5` is a `clamp()` **range**, e.g.
  `headline-5` is `clamp(1.125rem, calc(1.0761rem + 0.217vw), 1.25rem)` — **18px to 20px**
  depending on viewport.

> ⚠️ **A fluid tier has no single correct value.** An auditor who stores one end of the interval
> flags every fluid heading in every MoSJE build as off-ramp. The first version of `derive.py` did
> exactly that, and it would have been the largest single source of false findings in the report.
> `analyze.Allowed` therefore tests membership **or** range containment.

Sizes the file actually draws, integer values only: **9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24,
28, 32, 40** — with 11/12/13/14/16 carrying the overwhelming majority of all text.

Weights in use: Regular 400, Medium 500, SemiBold 600, Bold 700, Light 300 (icons only).

**Non-integer sizes are not decisions.** `2.667px`, `4.841px`, `3.227px`, `11.429px` appear in
their thousands and are all **scaled instances** — an icon or component rendered off its natural
size inside a resized group. `derive.py` drops them. They are, separately, evidence of the
distortion [`ds-documentation-standard.md` §4](../../.claude/rules/ds-documentation-standard.md)
warns about, and a radius of `713.57` on nine pages is the same artifact.

## 3. Colour, radius, spacing, canvas

**Radius:** `0, 2, 4, 6, 8, 12, 16, 20, 24, 999`. A card is **12** (`--sa-cmp-card-radius`).
Strays in the file: 3, 5, 7, 10, 14, 23, 100.

**Spacing:** padding and gap both run `0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48`. The grid gutter is
**24**. Strays: 6, 7, 9, 13, 22, and a `134` that appears on six pages.

**Canvas: 1440.** Every current page designs at 1440; `1600` survives on three older pages
(SAMBAL, SCW, Garima Greh). Component studies sit at their own widths (420, 820, 960, 1152, 1280)
and are not screens.

**Colour** resolves across six declaration blocks — `:root`, `[data-brand="navy"]`,
`[data-brand="dbim*"]`, `[data-color-mode="blue-dark"]`, `[data-surface="portal"]`,
`[data-density="compact"]`. The baseline is the **union** across all of them, which makes it
deliberately permissive: a build running in one brand mode is never convicted for a value another
mode publishes. A superset costs sensitivity and buys the thing that matters — no false
convictions.

Brand values the contract and the file agree on: `#003366` navy, `#0373df` gov-blue, `#ffd323`
gov-yellow, `#ff671f` saffron, `#ffffff`, `#000000`.

## 4. The neutral divergence — the most consequential finding in this document

**The Figma handoff file's greys are Tailwind's default grey ramp. The token contract's are not.
Neither knows about the other.**

| The file draws | On | Sampled uses | Contract's nearest | Apart | In `tokens.css`? |
|---|---|---|---|---|---|
| `#1f2937` | all 10 pages | **23,853** | `#242a35` | 5 | **never** |
| `#374151` | all 10 pages | 4,396 | `#343b48` | 9 | **never** |
| `#e5e7eb` | all 10 pages | 3,428 | `#e2e8f0` | 5 | **never** |
| `#f9fafb` | all 10 pages | 1,421 | `#f7faff` | 4 | **never** |
| `#d1d5db` | all 10 pages | 1,067 | `#dcdee1` | 11 | **never** |
| `#e5eff9` | all 10 pages | 902 | `#e8efff` | 6 | **never** |
| `#6b7280` | 7 pages | 269 | `#6f757d` | 4 | **never** |

The contract publishes its own ramp instead — `#1e2124` (47 declarations), `#3a3d41` (5),
`#dcdee1` (18), `#6f757d` (11) — and the two sit **4 to 11 points apart per channel**. That gap is
invisible on a screen and fatal to a token audit.

**What follows from it:**

1. **No MoSJE build can be token-conformant on neutrals.** Every portal follows the design file;
   the design file follows Tailwind; the contract publishes something else. A naive house audit
   reports every neutral in the estate as off-token — thousands of findings, all of them useless,
   and a report a developer stops reading.
2. **It is the design system's to resolve, not any portal's.** Either the contract adopts the ramp
   the estate has been drawing for a year, or the Figma library rebinds to the contract's. Both
   are decisions; neither is a portal ticket.
3. **It is why `HOUSE-GAP` exists** as a citation class, why such findings carry
   `scope: "Design System"`, and why `gate_house_gap_routing` refuses to let one be filed as a
   Blocker against a portal team.

This is the same shape as the near-miss greys the audit ledger keeps recording (`#E5EAF2` beside
`#E5E7EB`), one level up: not one card's border, but the ramp itself.

## 5. Fonts and fills in the file that are nobody's standard

Raised against the **design file**, not against any build:

| What | Where | Why it is a defect |
|---|---|---|
| **`#d9d9d9`** on ~3,841 shapes, all 10 pages | every page | Figma's *default rectangle fill* — an unstyled placeholder shape that was never given a token. |
| **`#000000`** text on ~3,900 nodes, all 10 pages | every page | Pure black is not the ink token. `--sa-text-neutral-base` is `#1e2124`. |
| **Inter** on 318 nodes | Login/Signup, NMBA, Smile Beggary, E-Anudaan, PM-AJAY | Not a MoSJE font. `CLAUDE.md`: Noto Sans across all gov properties. |
| **Roboto, Poppins, Open Sans, Helvetica Neue** | 5 pages | Same. |
| **Material Icons Round** (17 nodes, E-Anudaan) | E-Anudaan | Wrong icon font — the standard is Material Symbols **Rounded**. |
| **`#e2e6ea`** borders (Login/Signup) | Login/Signup | `MoSJE + UX4G DS`'s `Neutral/200`. That library is **read-only reference**; binding to it is the exact failure `CLAUDE.md` names by value. |
| **`"Semi Bold"` vs `"SemiBold"`, `"Display SemiBold"`** | E-Anudaan | Inconsistent style naming; breaks font loading in scripted edits. |

## 6. The chrome every page composes

Every component instance in the file is **remote** — the file composes a published library rather
than local copies, which is right. In frequency order:

- **Every page:** `navbar`, `Accessibility Bar`, `Logo`, `Avatars`
- **Every admin page:** `sidebar/type-1` + `sidebar/type-1/main-item` — the most-used component in
  the estate (65–288 instances per page)
- **Common:** `Button`, `Icon Button`, `input-field/text`, `Badge`, `drop-down`, `Default Chips`,
  `Tab` / `.tab/primary` / `.tab/secondary` / `nav-item`, `Checkbox`, `radio-buttons`, `Toggle`,
  `step` / `step/type-2` / `step-count/type-2` (wizards), `progress-indicator`,
  `file-uploader/small`, `Input Area`, `OTP-input-container`, `Link-Card`, `card/kpi`,
  `Footer - Bottom Strip`, `icon-font`, `.Toast Status`, `.page`
- **Icons:** the Material Symbols Rounded set — `open_in_new`, `accessibility_new`, `language`,
  `arrow_drop_down`, `menu/open`, `check`, `edit`, `delete`, `more_vert`, `chevron_*`,
  `keyboard_arrow_down`, `trending` / `trending-up`, `info/default`, `person/default`,
  `group/default`, `document/default`, `warning/default`, `check-circle/filled`, `home/default`

**A portal missing one of these is missing estate chrome**, and that is a finding no token diff can
see. The masthead accessibility toolset in particular is GIGW-mandated: removing it portal-wide is
a Blocker, not a Minor.

## 7. Using this as an audit baseline

```jsonc
// tools/design-audit/projects/<name>/audit.config.json
"baseline": { "mode": "house", "source": "../../house/samavesh-house-standard.json" }
```

`mode: "house"` turns on two gates that a side-by-side audit does not need, because there the
design frame is the authority:

- **`standard citation`** — every finding carries `_cites` naming a `--sa-*` token, a
  `WCAG 2.2 x.y.z` criterion, a `GIGW 3.0` / `DBIM` clause, a design-system component, or
  `HOUSE-GAP`. A bare `1.4.3` is rejected: it is ambiguous between standards and versions, and the
  reader must be able to look it up. A genuine judgment call declares `_judgment` with its reason
  and is stamped 👤 rather than 🤖.
- **`house-gap routing`** — a `HOUSE-GAP` finding must carry `scope: "Design System"` and must not
  be a Blocker on the portal.

And `--phase fixpreview` renders each finding's declared `_fix` on the live screen, so the report's
left panel is a **PROPOSED** rendering rather than a paragraph of advice. It gates two ways a
preview lies: a **no-op** patch (before and after byte-identical — the selector misses, the cascade
overrides, or the value already applies) and **collateral** reflow (elements outside the patch
target moved). A patch that fails either must not ship as advice, because it reads exactly like one
that works.

## 8. What this standard does NOT settle

- **Which ramp wins in §4.** That is a design-system decision and is recorded, not resolved, here.
- **Whether a component is the *right* component.** The contract knows values, not intent. Right
  component, hierarchy, icon metaphor and empty-state wording stay 👤 judgment.
- **Anything about Hindi, Devanagari or RTL.** `--sa-ref-font-family-devanagari` and
  `--sa-leading-devanagari` exist; no page in the file exercises them (one Devanagari node in the
  whole file, on SCW), so the evidence half of this standard is silent on them and an audit must
  not infer a standard from that silence.
- **Motion, elevation and focus-ring behaviour** — published as tokens, not measured here.
