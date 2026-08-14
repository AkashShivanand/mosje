# DBIM 3.0 — Digital Brand Identity Manual

The **Digital Brand Identity Manual** is MeitY's brand standard for Government of India digital
properties. It governs the *look*: colour groups, iconography, typography, header and footer
treatment, logo usage, imagery and content presentation.

| | |
| --- | --- |
| Publisher | Ministry of Electronics and Information Technology (MeitY) |
| Version | 3, January 2025 |
| Binding? | **Mandatory** for brand. It is what a DBIM audit scores you against. |
| Source | guidelines.india.gov.in |

## Files

| File | What it is |
| --- | --- |
| `DBIM_3.0.md` | Faithful transcription of the guideline text. Front matter, minister's messages, dotted contents and page artefacts removed; hard line-wraps reflowed. Wording preserved. |
| `DBIM_3.0.pdf` | The original. Go here when the transcription is ambiguous — a few DBIM values (primary palette, type-scale tables) exist **only as images** in the PDF and are reproduced in the markdown as tables marked accordingly. |

## Why this one matters more than its page count suggests

MoSJE has already been audited against DBIM (`docs/source-brd/MoSJE DBIM Audit.pdf`), and the
audit found specific failures. Those failures are marked ⚠️ in
`docs/compliance/COMPLIANCE-CHECKLIST.md`, and our build exists partly to **fix** them. The
checkpoints most often missed:

| Clause | Requirement |
| --- | --- |
| §2.1 | One primary colour group = one key colour plus its variants, used consistently across all pages |
| §2.2 | Background, card and surface colours come from the functional palette |
| §3.7 | Icons use the key colour (darkest shade) or inclusive white only |
| §4.4 | Text uses shade 1 or 2 of the primary group |
| §5.6 | Footer background = the darkest shade of the key colour group |

## DBIM in the code

The estate carries a `dbim` brand mode on the `data-brand` axis — DBIM's own published Blue
primary palette transcribed verbatim (`1 #162F6A · 2 #214AAB · 3 #5279D7 · 4 #A3BBF3 ·
5 #D2DFFF`, source: DBIM §2.1 Figure 1), with intervening rungs interpolated. It exists so the
published palette can be evaluated in the running app.

**`dbim` is code-only and is never pushed to Figma** — standing instruction, 2026-08-11. The
Figma library's Palette collection stays `[Blue, Navy]`, enforced by construction in
`build/formats/figma-variables.mjs`. See `CLAUDE.md` → "Brand modes".
