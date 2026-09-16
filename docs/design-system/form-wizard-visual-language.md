# Form Wizard Visual Language

The shape every multi-step application form on the estate takes. It is read from the
handoff file (`evmNmlK8g4VYwJVu2FwSGV`), where the same language repeats across five
portals, and it is what `Wizard`, `FormPanel`, `FormSection`, `FormCard`, `ReviewSection`,
`FormInset` and `DocumentTile` render.

## Why this document exists

E-Anudaan's application form was composed from design-system parts, one at a time, and
checked against its own legacy frames. No pass took the other portals' wizards as the
reference, so the form grew its own grammar: a boxed stepper, one card per section,
the actions below the card, and help text under nearly every field. This document is
that reference, written down so the next form does not repeat the drift.

## Sources

| Portal page | Frames read | What they settle |
|---|---|---|
| Transgender Portal | `APP/FORM/01-Identity-Details/FILLED` (3531:35553) | step card, sub-sections, 3-column grid, CTA band, Cancel on step 1 |
| NOS | `04-Employment-Background-Details` (4505:31944) | toggles, repeatable inset groups, "Add More", tabular repeaters |
| NOS | `05-Document-Upload` (4505:32063) | document tiles: upcoming, uploaded, verified |
| NOS | `REVIEW/01-Summary` (4505:32155) | review grids, document tiles on review, declaration panel, Submit |
| NMBA, Garima Greh, SCW, SAMBAL | 60, 12, 22 and 18 frames using `stepper/type-2` | the same structure, repeated |

The handoff binds to the retired `MoSJE Portal DS` variables. The values below are mapped to
SAMAVESH, the only library we build from.

## 1. The page

```
PageHeader (scheme, one instruction sentence, save status)        ← E-Anudaan decision, 14 Sep
Stepper   — on the page ground, no container
FormPanel — ONE card per step
  ├ head band     step title + one-line description (+ optional action)
  ├ body          sub-sections, 32 apart
  └ CTA band      Back / Cancel  ·  Save and Continue → / Submit Application
```

- Stepper and panel share one column; the gap between them is `stack/32`.
- A step is one card. Sections inside it are **not** cards.

## 2. Stepper

- `Stepper / Row`, **Large**: 32px nodes, labels under the node, a continuous track.
- Complete stages show a green tick, the current one is filled brand, and upcoming ones are outlined.
- **No surrounding box, border or fill.**

## 3. FormPanel — the step card

| Part | Handoff | SAMAVESH |
|---|---|---|
| Card | white, 1px `#e5e7eb`, radius 20, clips its bands | `bg/neutral/base`, `border/neutral/subtle`, `shape/20` |
| Head band | fill `#f9fafb`, bottom hairline, padding 24 | `bg/neutral/subtler`, `border/neutral/subtle`, `padding/24` |
| Head title | Body 1 semibold 16, dark | `type/body-1`, `font-weight/semibold`, `text/neutral/bolder` |
| Head description | Body 3 13, hint | `type/body-2`, `text/neutral/subtle` |
| Body | padding 24, sub-sections 32 apart | `padding/24`, `stack/32` |
| CTA band | fill `#f3f4f6`, top hairline, padding 24, space-between | `bg/neutral/subtler`, `border/neutral/subtle`, `padding/24` |
| Back | outlined, arrow left | `Button appearance="outlined" iconLeft` |
| Cancel (first step) | outlined, no icon | `Button appearance="outlined"` |
| Continue | filled primary, arrow right, "Save and Continue" | `Button iconRight` |

SAMAVESH's neutral ramp has no rung between white and `#eef0f3`. Both bands therefore take
`bg/neutral/subtler`, and the handoff's 2% step between the head and the CTA band is not kept.
That is the one value this language does not reproduce, and it is recorded here rather than
approximated with a literal.

## 4. Sub-section — `FormSection` / `FormCard`

- **Head row:** an UPPERCASE label, Label 1 (14/20 medium) in `text/neutral/subtle` with caps
  tracking, then a hairline rule that fills the rest of the row (`border/neutral/subtle`),
  12 apart. An optional badge sits between the label and the rule, as in "VERIFIED IDENTITY · DigiLocker".
- **Spacing:** the head sits `stack/16` above the content.
- **Field grid:** 3 columns on desktop, 2 on tablet and 1 on a phone; column and row gaps of 24.
  Long answers (textarea, address, radio groups) span the row.
- **Lead sentence:** optional. It follows the head in Body 2, only where it changes what the
  applicant enters ("Please provide income certificates only for the members declared in Step 4").

## 5. Fields

- **Label:** Label 1 medium, `text/neutral/base`, with a red `*` when required; 4 above the control.
- **Control:** `FormField` + `Input` / `Select` / `DatePicker` / `Textarea`, 44px high, radius 8.
- **Help text:** only where it changes what is typed. A sentence restating the label, or naming
  the system a value came from, is not help.
- **Yes/No questions:** `Toggle` beside the question label, not a pair of radios.

## 6. Repeatable groups — `FormInset`

- **Each entry:** an inset panel with `bg/neutral/subtler`, `shape/12` and `padding/16`, holding a 2-column grid.
- **Add control:** "+ Add More" as a small outlined `Button` with a leading plus, right-aligned under the last entry.
- **Tabular repeaters** (family members, awards) are a bordered `DataTable` instead. Its add control is a
  text button in the table's last row.

## 7. Documents — `DocumentTile`

- **Layout:** a 2-column grid with 24 gaps, grouped by sub-section.

| State | Surface | Content | Action |
|---|---|---|---|
| Upcoming | `bg/neutral/base`, `border/neutral/base`, `shape/8`, `padding/16` | title Body 1 semibold + `*`; meta Body 3 muted (format, size limit) | "Browse File", small outlined |
| Uploaded | `bg/neutral/subtler`, `border/neutral/base` | title; "file.pdf · 100 KB" | "Change" small outlined + delete icon button |
| Verified by an officer or DigiLocker | `bg/status/success/base`, `border/status/success/*` | title; success meta ("Linked via DigiLocker") | `Badge` "Verified" |
| Needs correction | `bg/status/error/base`, `border/status/error/*` | title; the officer's reason | "Replace File" |

**An upload is "Uploaded", never "Verified".** Only a person or DigiLocker verifies a document.

## 8. Review step

- **Head band:** "Review Application Details" / "Please verify all details before final submission."
- **Sub-sections:** one per step of the form. Each holds a `ReviewSection` grid, 4 columns for short
  values and 2 for long ones. Labels are Label 2 (12 medium) in `text/neutral/subtle`; values are
  Body 2 in `text/neutral/base`. An "Edit" text button sits at the right of each sub-section head.
- **Documents:** 2-column `DocumentTile`s in their review form (icon, title, file name, "View").
- **Declaration:** `DeclarationCheckbox`, a warning-tinted panel with a lead line and a bulleted
  list, then "I have read and accept the declaration above".
- **Submit:** "Submit Application" replaces Save and Continue in the CTA band.
