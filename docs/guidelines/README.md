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
| 6 | UX4G gives two content widths — 1200px desktop, 1320px desktop-XL — and publishes **no breakpoints** | A **three-step** container — 1200 / 1320 / **1440** — engaging at **1280 / 1440 / 1920**, on a six-rung viewport ladder that adds `laptop` (1024) and `desktopWide` (1920) | Quality wins over UX4G per `.claude/rules/standards-precedence.md`. UX4G fixes neither the breakpoints (it publishes none) nor a third step, so both are ours. Each anchor was set by measuring the page: 1768 made margins *narrow* as the screen grew (1728 carried 264px a side against 1768's 224px); 1600 left the ladder's weakest point on its most common viewport — 1536, which is 1920 at 125% Windows scaling, held only 75% of the screen against 90% at 1280; 1440 reads 88 / 84 / 82% across 1440-1536 and changes nothing above 1600. The third step exists because a 2560 monitor otherwise rendered a 1320 column between 620px margins. The 1024 rung filled a 512px void between `tablet` and `desktop`. 2026-08-24. |
| 7 | ~~Handoff frame draws 1320 at 1440 while the code renders 1200~~ — **WITHDRAWN 2026-08-24, same day it was recorded** | No divergence: the code renders a **1320 container with 1272 of content at 1440**, which is exactly what the frame draws | Recorded, then withdrawn within hours, and the reason is worth keeping. The row assumed the frame was wrong because UX4G's "1200px desktop" put 1440 on the 1200 cap. Pressure-testing the container for UX rather than for conformance reversed it: 1200 at 1440 left the most common desktop widths at 75-80% screen use, and the frame's 1320 was the better answer all along. The anchor moved to 1440 and the two agree. The lesson is the order — measure the interface first, then check the standard, not the reverse. |
| 8 | GIGW 3.0 / WCAG 2.1-2.2 AA require **4.5:1** for body text and **3:1** for large text | The SAMAVESH banner's **default `tone="light"` renders white on India Saffron at 2.91:1 — it FAILS both thresholds.** `tone="dark"` (6.50:1) and `tone="tint"` (17.29:1) are shipped alongside it and either satisfies the standard | **The most consequential row in this table — read it before changing the banner.** India Saffron `#ff671f` is a saturated mid-tone, the one thing no ink sits on: a scan of ~700,000 colours found **ZERO** that clear WCAG 2's 4.5:1 *and* APCA's Lc 75 for 14px text on it (relaxed to Lc 60, still zero). So the ground, not the ink, is the constraint. WCAG 2 measures relative luminance only, and the Helmholtz-Kohlrausch effect means saturated colours read far brighter than their luminance — which is why this is a named field problem ("the orange button problem") and why APCA ranks the inks in the OPPOSITE order: white Lc 59.8 beats black 48.9 and the deep green 43.9. User testing agrees with APCA — 61% of ~20 colour-blind participants preferred white, 71% among protanopia (Bounteous/Seastrand) — while the monochrome participant preferred black, so no single answer serves everyone. **APCA is NOT a defence:** it was removed from WCAG 3 consideration in 2023, was only ever exploratory, and WCAG 2.1/2.2 AA remains the enforceable standard. This row therefore records a KNOWN NON-CONFORMANCE that was chosen for design-reference fidelity and perceptual legibility, not a conformance argument. **If an audit challenges it, `tone="tint"` is the one-word remedy and needs no redesign.** Full evidence in the header of `packages/design-system/components/navigation/samavesh-banner.css`. 2026-08-30. |
| 9 | Every fill and stroke resolves through a `--sa-*` token | **Seven portals and the NMBA campaign keep their OWN palette**, declared with `ds-exempt(portal-palette)` in each stylesheet | `CLAUDE.md` already sanctions this — "palettes genuinely conflict" — and 2026-09-01 measured how far apart they are: of pm-ajay's **58** palette entries, exactly **TWO** resolve to a `--sa-*` value (both `#003366`, both now bound); the other 56 are a Gov-India-navy ramp over Tailwind's gray scale with no estate equivalent. Binding them to the nearest token would **recolour the portal**, which is a redesign, not a linkage fix. e-Utthan is the counter-example worth copying: most of its palette IS bound to `--sa-*`, and each remaining literal carries its own one-line reason. **The exemption covers DEFINITIONS only.** Every rule in every one of those files now resolves through a palette name — 60 loose literals in pm-ajay alone were lifted into named entries — so a repeated hex inside a rule is still a defect and still fails `npm run check:ds-linkage`. NMBA's campaign reds are separate and for a different reason: `--sa-color-status-danger` is a STATUS colour, and using it would say "error" where the design says "Nasha Mukt Bharat". 2026-09-01. |
| 10 | DBIM 3.0 §4 mandates desktop headings H1 36 / H2 24 / H3 20 and mobile 24 / 20 / 16 | SAMAVESH headline-1/2/3 are **40 / 32 / 28** on the website (28 / 24 / 22 at 360px) and **32 / 28 / 24** in portals | DBIM's three sizes are an illustrated minimum hierarchy, not an exclusive list; a six-level government page needs the intermediate steps. All three DBIM sizes stay on the ramp. Full reasoning: `docs/audit/typography-deviation-register.md` T1–T2. |
| 11 | DBIM 3.0 §4 iii — line height 1.2 to 1.5 × the type size | Headline, Title, Body and Label sit inside the band (asserted by `type-scale.test.mjs`); the **Display tier runs 1.10–1.20** on the website | At 40–80px on the optical Display cut, 1.2 leading opens a two-line hero into separate lines; every mature scale sets large display type tighter. Register T3. |
| 12 | UX4G 3.0 §2 — Body/L, an 18px long-form reading size | **No 18px body role**; long-form reading is body-1 at 16/24 with the measure capped at 36rem | A second reading size inside a 16px system gets mixed freely (40 `text-lg` leads beside 16px bodies at the audit). Reading comfort comes from measure and leading. Register T5. |

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
