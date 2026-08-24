# `docs/guidelines/` — the standards library

**This folder is the reference shelf for every Government of India standard MoSJE builds against.**
Before designing, building, or reviewing any page, component, or portal, consult it.
The rule that makes that mandatory is `.claude/rules/guidelines.md`.

Each standard lives in its own folder with the **original PDF** (where one exists), a
**faithful markdown transcription** you can grep and quote, and a **README** stating what
the document is, what it governs, and whether it binds us.

---

## What's here

| Folder | Standard | Publisher · Version | Binding? | Governs |
| --- | --- | --- | --- | --- |
| [`GIGW-3.0/`](GIGW-3.0/) | Guidelines for Indian Government Websites and Apps | NIC / MeitY · 3.0 | **Mandatory** | Quality, accessibility (WCAG 2.1 AA), cybersecurity, lifecycle, mandatory pages, STQC certification |
| [`DBIM-3.0/`](DBIM-3.0/) | Digital Brand Identity Manual | MeitY · v3, Jan 2025 | **Mandatory (brand)** | Colour, icons, typography, header/footer, logo, imagery, content presentation |
| [`UX4G-3.0/`](UX4G-3.0/) | UX4G Design System 3.0 | NIC / MeitY (Digital India) | **Recommended** | Design tokens, type scale, spacing, elevation, iconography, components, UX patterns, content design |
| [`GuDApps/`](GuDApps/) | Guidelines for Development of e-Governance Applications | NIC / MeitY · v1.1, Aug 2017 | **Best practice** | Data quality, authentication, forms, reports, application frameworks |

Sizes: ~350 KB of markdown, ~29 MB of source PDFs. The markdown is what you read and cite; the
PDF is the authority you fall back to when a transcription is ambiguous.

---

## How to use this folder

**Building.** Read the relevant section *before* you write UI, not after. Fastest routes:

| I'm about to… | Read |
| --- | --- |
| Pick a colour or check contrast | `UX4G-3.0/…#1-colour-system` · `DBIM_3.0.md` §2 |
| Choose a type style or heading level | `UX4G-3.0/…#2-typography` · `DBIM_3.0.md` §4 |
| Set spacing, radius, or a grid | `UX4G-3.0/…#3-spacing-and-layout` |
| Add an icon | `UX4G-3.0/…#5-iconography` · `DBIM_3.0.md` §3 |
| Ship anything public-facing | `GIGW_3.0.md` §5.2 + `UX4G-3.0/…#6-accessibility-guidelines` |
| Write a form, error, or consent screen | `UX4G-3.0/…#7-content-design-system` · `GuDApps.md` §7 |
| Scope a new portal journey | `UX4G-3.0/…#10-ux-patterns` (P-01…P-09) |
| Add a footer, header, or mandatory page | `GIGW_3.0.md` · `DBIM_3.0.md` §5 |

**Auditing.** Use the `/gov-compliance` skill — it operates
`docs/compliance/COMPLIANCE-CHECKLIST.md`, which is the *enforceable* merge of these
documents. This folder is the source; that checklist is the gate.

**Citing.** Tag every finding with its source and clause: `[GIGW 5.2]`, `[DBIM 3.7]`,
`[UX4G Typography §2.7]`, `[GuDApps 4]`. A finding without a clause is an opinion.

---

## Precedence — what to do when they disagree

They *do* disagree. Read this before resolving a conflict yourself.

1. **Accessibility and law win, always.** WCAG 2.1 AA, GIGW 3.0 and the RPwD Act 2016 are
   non-negotiable. No brand preference, no design-system convention and no visual argument
   outranks them. If our build is prettier and less accessible, our build is wrong.
2. **GIGW 3.0 outranks everything else** on quality, security, lifecycle and mandatory pages.
3. **DBIM 3.0 governs brand** — colour groups, footer treatment, icon colour, type scale.
4. **UX4G 3.0 is adopted at the specification level, not the package level.** We conform to
   its tokens, scales, accessibility rules and patterns; we do **not** install
   `ux4g-web-components` (7.6 MB stylesheet plus a MutationObserver runtime that rewrites the
   DOM React owns — see `docs/ux4g/UX4G-Code-Readiness-Audit.md` §1).
5. **GuDApps is advisory.** Follow it where it costs nothing; it is not a gate.
6. **Where a guideline would regress the shipping design system, don't silently regress it —
   record the deviation.** See below.

### The deviation rule

The instruction this folder exists to serve is: *follow whatever can be followed **without
impacting the latest design standards***. In practice that means a three-way split, and you
must classify every conflict into one of the three:

| Class | Example | What to do |
| --- | --- | --- |
| **Accessibility / legal** | Contrast below 4.5:1; missing `lang`; no skip link; body text under 16px | **Adopt. No exceptions.** Fix the design system if it conflicts. |
| **Structural** | Base-4 spacing, 44×44px targets, one `<h1>`, heading order, rem sizing, error-message formula, P-01…P-09 journeys | **Adopt**, unless the DS already satisfies it by another route. Prefer the DS's own token names over `--ux4g-*`. |
| **Brand / aesthetic** | UX4G's violet primary, its exact shadow values, its icon variant default | **Do not adopt blindly.** MoSJE's brand is set by DBIM and the SAMAVESH design system. Record the divergence here rather than pretending it doesn't exist. |

**Never weaken a requirement to make something pass.** If we deviate, the deviation is
written down, with a reason, in the table below.

---

## Known, deliberate divergences

Recorded so nobody "fixes" them by accident, and so an auditor sees a decision rather than a defect.

| # | Guideline says | MoSJE does | Why |
| --- | --- | --- | --- |
| 1 | UX4G primary is violet — `#6a4eff` / `#4a2bc2` | Primary is **gov-blue `#0373DF`** (with `navy` and `dbim` brand modes) | UX4G's palette is UX4G's brand, not a mandate. DBIM governs MoSJE's brand, and the estate's key colour is fixed. UX4G's *structure* (50→950 ramps, semantic token roles) is adopted; its hexes are not. |
| 2 | UX4G icons default to **Material Symbols Outlined**, weight 400 | **Material Symbols Rounded**, weight 300, size 24, stroke variant | UX4G itself names Rounded as the recommended variant for "citizen portals, onboarding, help" — which is what the estate is. Weight 300 is the SAMAVESH standard; it stays consistent across every property. Documented in `CLAUDE.md`. |
| 3 | UX4G ships `ux4g-web-components` | Conformance measured against a token contract, package not installed | 7.6 MB stylesheet + DOM-rewriting runtime, incompatible with React ownership. See `docs/ux4g/UX4G-Code-Readiness-Audit.md`. |
| 4 | UX4G tokens are prefixed `--ux4g-*` | Canonical tokens are `--sa-*` (SAMAVESH) | One namespace per estate. A `--ux4g-*` parity layer is generated for conformance measurement, not for authoring. |
| 5 | DBIM's own brand mode exists in code | `dbim` brand mode is **code-only** and never pushed to Figma | Standing instruction, 2026-08-11. See `CLAUDE.md` → "Brand modes". |
| 6 | UX4G gives two content widths — 1200px desktop, 1320px desktop-XL — and publishes **no breakpoints** | A **three-step** container — 1200 / 1320 / **1440** — on a six-rung viewport ladder that adds `laptop` (1024) and `desktopWide` (1920) | Quality wins over UX4G per `.claude/rules/standards-precedence.md`, and this is additive: 1200 at desktop is unchanged. With one widen at 1768px, a 1728-wide viewport carried 264px of margin each side against 1768's 224px — margins narrowing as the screen grew — and a 2560 monitor rendered a 1320 column between 620px margins. Anchors follow Material 3's window size classes (large 1200–1599, extra-large ≥1600), which are derived from measured device distribution. The 1024 rung filled a 512px void between `tablet` and `desktop`. 2026-08-24. |
| 7 | — (not a UX4G divergence: a **design-file** divergence, recorded here because this is where width questions get answered) | The **Figma Handoff's Home frame draws a 1320 container on a 1440 artboard**; the code renders 1200 there. **The code is the authority — do not re-derive the container width from that frame.** | 1320 is the desktop-XL cap, correct at ≥1600 and not at 1440, so the frame shows the XL presentation on a desktop board. Every `Container` node in it is 1320 wide at x=60, where a 1200 column would be x=120. Left as-is deliberately: all 19 of those containers are `FILL`, so the edit is padding 60→120 rather than a resize, but **7 sit inside component instances** whose masters (Accessibility Bar, Navbar, Slide 2/Desktop, our-offerings, Footer/Desktop, Footer - Bottom Strip) are shared with every other page in the file — so narrowing this one frame would reflow all of them, and a partial fix would leave the masthead and footer at 1320 against a 1200 body, which is the exact misalignment the 2026-08-13 container work removed. Pressure-tested before deciding: widening the code to 1272 to match the frame fixes ONE wrapped heading of 13 on the densest section, while the real constraint there was the grid's column count. 2026-08-24. |

Adding a row is cheap. Leaving a conflict undocumented is not.

---

## Related material elsewhere in the repo

This folder holds **source standards**. Our own work products about them live apart:

| Path | What it is |
| --- | --- |
| `docs/compliance/COMPLIANCE-CHECKLIST.md` | The enforceable, merged checklist — the gate |
| `docs/ux4g/` | Our UX4G adoption plan, code-readiness audit, conformance report, trackers |
| `tools/ux4g-conformance/` | Token extractor + conformance measurement |
| `packages/tokens/reference/ux4g-3.0.tokens.json` | Machine-readable UX4G token contract |
| `packages/design-system/design.md` | The AI-facing brief for the SAMAVESH design system |
| `.claude/skills/gov-compliance/SKILL.md` | The build/audit skill that operates all of the above |

---

## Adding a standard

Keep the shape identical so the folder stays greppable:

```
docs/guidelines/<STANDARD>-<VERSION>/
├── README.md                    # what it is, who publishes it, does it bind us, how we use it
├── <STANDARD>_<VERSION>.md      # faithful transcription, with a fidelity note at the top
├── <STANDARD>_<VERSION>.pdf     # the original, if one exists
└── supplementary/               # handbooks, annexes, companions
```

Rules for a new entry:

1. **Underscores, not spaces**, in filenames.
2. **Every transcription opens with a fidelity note** — what was removed, what was reflowed,
   what is reproduced verbatim, and the capture date for web-published standards.
3. **Add a row to the table at the top of this file**, and state whether it binds us.
4. **If it conflicts with the design system, add a row to "Known, deliberate divergences"** in
   the same commit. A conflict discovered and not recorded will be rediscovered as a bug.
5. **Cross-link it** from `.claude/rules/guidelines.md` and the `gov-compliance` skill.

Web-published standards (UX4G) have no stable PDF — re-capture them and diff. The date in the
fidelity note is what tells the next reader whether the file is stale.
