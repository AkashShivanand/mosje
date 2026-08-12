# UX4G Design System 3.0

**UX4G — User Experience for Government** is India's open-source design system for digital
public services, published by NIC / MeitY as a Digital India initiative. Version 3.0 ships 77
production-ready components across React, Angular and Web Components at WCAG 2.1 AA, plus 49
UX patterns for citizen service journeys.

| | |
| --- | --- |
| Publisher | NIC / MeitY, Government of India |
| Home | https://www.ux4g.gov.in |
| Developer docs | https://doc.ux4g.gov.in (Webcore `/web` · Fluttercore `/flutter`) |
| Audit tool | https://audit360.ux4g.gov.in |
| Binding? | **Recommended**, not mandatory — but it is the reference design system for GoI services |
| Token prefix | `--ux4g-*` |

## Files

| File | What it is |
| --- | --- |
| `UX4G_3.0_Design_System.md` | Faithful transcription of the foundations, components and patterns documentation — colour, typography, spacing, elevation, iconography, accessibility, content design, and the full token families. **Captured 12 August 2026.** |

There is **no PDF** in this folder, and that is not an omission. UX4G 3.0 has no downloadable
specification — it is published only as a live website. That has two consequences:

1. **The transcription is the artefact**, and it carries a capture date. Treat it the way you'd
   treat a dated snapshot, not a versioned release.
2. **It goes stale silently.** Nothing tells you upstream changed. Re-capture when UX4G
   announces a release or when a foundation page looks different from what's recorded here.

## Refreshing it

Two halves, and only one is automated:

```bash
node tools/ux4g-conformance/extract-ux4g-tokens.mjs
```

That refreshes `packages/tokens/reference/ux4g-3.0.tokens.json` — the machine-readable token
contract the conformance tooling measures against. Its diff is the token upgrade surface.

The narrative half — rules, do/don'ts, scales, patterns — is re-captured by hand from the pages
listed in the **Sources** table at the bottom of `UX4G_3.0_Design_System.md`. Update the capture
date when you do.

## How MoSJE uses it

**We conform to UX4G at the specification level and deliberately do not install
`ux4g-web-components`.** The package is a 7.6 MB stylesheet plus a MutationObserver runtime that
rewrites the DOM React owns — see `docs/ux4g/UX4G-Code-Readiness-Audit.md` §1. Conforming to a
specification still requires having the specification; that is what this folder is for.

Split the document in two when you read it:

- **Adopt the structural layer** — type scale and heading semantics, base-4 spacing, 44×44px
  touch targets, radius and elevation scales, the z-index ladder, accessibility rules, the
  error-message formula, the consent-language standard, and the P-01…P-09 journey patterns.
  These are good, mandate-adjacent, and mostly already reflected in the SAMAVESH design system.
- **Do not adopt the brand layer** — UX4G's violet primary (`#6a4eff` / `#4a2bc2`), its amber
  secondary, its exact shadow values. MoSJE's brand comes from DBIM and is gov-blue `#0373DF`.
  UX4G's palette *structure* (50→950 ramps, semantic token roles like
  `bg-*-soft/subtle/emphasis/strong`) is worth mirroring; its hexes are not.

The full list of deliberate divergences, with reasons, is in `../README.md`.

## The parts most worth reading

| Section | Why it earns the time |
| --- | --- |
| §2 Typography | The most directly usable part — a complete five-category scale with semantic element mapping, plus explicit heading-order and rem rules. Also the Devanagari line-height 1.8 rule, which matters for every Hindi page in the estate. |
| §6 Accessibility | Compact restatement of WCAG 2.1 AA in GoI terms, including the exact focus-ring spec and the ARIA set. |
| §7 Content design | The error-message formula (`[Problem] + [Solution]`) and the ban on pre-checked consent boxes are the two rules most often broken in government forms. |
| §10 Patterns | P-01…P-09 map almost one-to-one onto the MoSJE portal estate. Use them as the checklist when scoping a new portal flow. |
