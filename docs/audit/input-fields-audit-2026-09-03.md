# Input Fields — Design System Audit

**Date:** 2026-09-03 · **Scope:** the 30 form exports of `@mosje/design-system`, with the
ten text-entry / field-shaped controls inspected line by line.

**Measured against:**
1. Current design-craft practice (GOV.UK, USWDS, Carbon, Material 3).
2. The UX4G 3.0 written guidance at `docs/guidelines/UX4G-3.0/UX4G_3.0_Design_System.md`.
3. **The UX4G Design System 3.0 Figma library** (Beta, 4 August 2026),
   file `0v5NnMKFKC3foZ85bxPp6c` — pages `◆ Input - Text Field` (`2141:296720`),
   `◆ Form Field Group` (`13260:4376`), `◆ Focus Ring` (`8473:6130`).

> **The two UX4G sources disagree with each other**, repeatedly and on measurable things —
> label size, helper-text size, focus-ring geometry. Where they do, this audit says so rather
> than picking the one that makes us look better. See §4.

---

## Summary

| | |
|---|---|
| Form components exported | **30** |
| Documented web pages | **28** |
| Text-entry controls closely audited | **10** |
| Findings | **21** — 0 critical, 7 high, 9 medium, 5 low |
| Score | **70 / 100** |

| Dimension | Score | Note |
|---|---|---|
| Token discipline | 9/10 | Two deliberate literals only, both commented |
| Accessibility wiring | 8/10 | Label / describedby / invalid / error-summary all present |
| **State coverage** | **3/10** | UX4G ships 8 states; we ship 5. Success, Warning, Read-only absent |
| **Size coverage** | **2/10** | UX4G ships 4 sizes; we ship none |
| Composition slots | 5/10 | No prefix, no label icon, no caption icon |
| API consistency | 6/10 | Two incompatible field APIs |
| UX4G content system | 3/10 | The field-label / error-message library is not adopted |
| India-specific coverage | 10/10 | Aadhaar, PAN, OTP, CAPTCHA, declaration, geo-photo |
| Documentation | 9/10 | Every component has a page; claims are unverified |

---

## 1. What the UX4G Figma library actually contains

Worth recording, because the published site claims **77 components / 18 Form Elements** and
the Figma library is far smaller — **17 pages total**:

> Get Started · Logos and Misc Icons · Button · Dropdown Menu · **Form Field Group** ·
> **Input - Text Field** · Badge · Avatar · Divider · Table · Tag · Link · NavBar ·
> Accessibility Bar · **Focus Ring** · Slot · Identity and access

So there is **no published Figma master** for checkbox, radio, toggle, date picker, combobox,
file upload, OTP or CAPTCHA. Everything below compares against the three pages that do exist.
The library is Beta and shows it — its documentation template headers still carry a
`Fiori for iOS` placeholder logo.

### `Input - Text Field` — the full property set

| # | Property | Values | Ours |
|---|---|---|---|
| 1 | **Size** | S · M · **L (Mobile Default)** · XL | ✗ none |
| 2 | **State** | Default · Hover · Focused · Error · Disabled · **Success** · **Warning** · **Read-only** | 5 of 8 |
| 3 | Label | on / off | ✓ FormField |
| 4 | Caption (helper text **below** the field) | on / off | ✓ |
| 5 | Leading icon | on / off | ✓ `leftIcon` |
| 6 | **Prefix** — "fixed text before the user input… ₹, $, +91" | on / off | ✗ |
| 7 | Trailing items — "Clear button, password visibility toggle" | on / off | ✓ `rightIcon` |
| 8 | Label size | M · L | ✗ |
| 9 | Required (asterisk) | on / off | ✓ |
| 10 | **Label icon** — tooltip / explanatory popover glyph beside the label | on / off | ✗ |
| 11 | Input type | Text · Password | ✓ (PasswordInput) |
| 12–16 | Filled · Typing · placeholder size · placeholder on/off · placeholder text | | partial |
| 17 | **Caption status** | Default · Error · **Success** · **Warning** | 2 of 4 |
| 18 | Caption size | M · L | ✗ |
| 19 | **Caption icon** | on / off | ✗ (CSS reserves the slot, nothing fills it) |

Block heights, measured: **S 72 · M 80 · L 94 · XL 102**. The arithmetic
(label + 4 + field + 4 + caption) puts the *field* at roughly **32 / 40 / 48 / 56** — derived,
not measured directly.

`Text Area` carries the same eight states across sizes M and L, plus a separate
min-height axis of S / M / L.

Tokens bound on `Size=M, State=Default`: label `Label/M` **12px**/16 Medium · input text
`Body/S` **14px**/20 · caption `Body/XS` **12px**/16 · radius `Medium` **8** · border
`Border/Neutral/Subtle` #e5e5e5 · padding `Padding/S` **12**.

### `Form Field Group`

Ships: form header (**collapsible**, sizes M/L) · field group header ·
**required fields legend** · **status banner (Error / Success / Warning)** ·
**form footer action bar** (1–3 buttons, left/centre/right alignment, Desktop/Mobile).

### `Focus Ring`

Variants are `Border width = 1px | 2px` × `Radius = Rounded | Sharp | Circle`. **Not** the
4px ring at 2px offset the written guidance specifies.

---

## 2. What is already best-in-class

Recorded so a later pass does not "fix" it.

- **Native elements throughout.** `Input`, `Textarea` and `Select` are real `<input>`,
  `<textarea>` and `<select>`; `Select`'s `filter` appearance is a skin on the same element.
- **`FormField` does the whole wiring** — `htmlFor`↔`id`, `aria-describedby` composed from
  hint + error, `aria-invalid`, `required` forwarded.
- **`ErrorSummary` exists**, satisfying UX4G §6's "error summaries with links to affected
  fields" — a requirement most systems skip.
- **44px minimum control height**, past WCAG 2.2 AA's 24px (2.5.8) and meeting AAA's 44px
  (2.5.5). This sits between UX4G's M (~40) and L (~48) and is the better default.
- **The iOS 16px floor** under 768px, with the reason beside it.
- **Error and required-marker colour uses `--sa-color-status-dangerStrong`** (5.8:1), with
  the contrast arithmetic in the comment.
- **The right-adornment slot enforces a 24×24 target on any interactive child.**
- **Radius, padding and border-width match UX4G exactly** — 8 / 12 / 1px.
- **India-specific controls are real components**, not per-portal one-offs: Aadhaar, PAN, OTP
  (`one-time-code`, paste and SMS-autofill spread across boxes), CAPTCHA,
  DeclarationCheckbox, GeoPhotoInput. **UX4G publishes no Figma master for any of these** —
  this is the one axis on which we are ahead of the standard.
- **`PasswordInput` gets the five details hand-rolled versions get wrong**: `type="button"`,
  action-not-state accessible name with `aria-pressed`, DOM order after the field, the
  browser's competing reveal suppressed, autofill preserved.
- **`DeclarationCheckbox` is fully controlled with no default**, so the DS cannot ship a
  pre-checked consent box — UX4G §7 prohibits them.
- **`ControlGroup` uses a real `<fieldset>` + required `<legend>`.**

---

## 3. High findings

### H1 · Three of UX4G's eight field states do not exist here
**Success, Warning and Read-only.** We ship Default, Hover, Focused, Error and Disabled.

- **Read-only** is the one that hurts most: save-and-resume, DigiLocker / Aadhaar pre-fill,
  an application under departmental review. It must read differently from *disabled* —
  disabled says "you got something wrong", read-only says "this came from elsewhere".
- **Success** is what an async-verified field needs — Aadhaar OTP verified, IFSC resolved.
- **Warning** blocks nothing but flags an anomaly; we have no channel for it at all.

The same three are missing from `Textarea`, and the caption/helper text has only two of
UX4G's four statuses.

### H2 · No size scale on text controls
`Input`, `Textarea` and `Select` all `Omit<…, "size">` and offer no `sm | md | lg`. UX4G ships
**four** sizes for Input and two for Textarea. Our only lever is `[data-density="compact"]` on
an ancestor — all-or-nothing for a subtree. `Search`, `Chip` and `Toggle` *do* carry `size`,
so the family disagrees with itself.

Note UX4G names its L size **"Mobile Default"** — its guidance is a bigger target on a phone.
We hold 44px everywhere, which is defensible and arguably better, but it is an undocumented
divergence from a named UX4G behaviour.

### H3 · No prefix affix
UX4G makes this a first-class property: *"Adds fixed text before the user input… Currency
symbols (₹, $), Country codes (+91)."* We have icon slots and nothing else. Every portal that
needs `₹` or `+91` will hand-roll it, and the first one will make it focusable or put it
outside the field's border.

### H4 · Two incompatible field APIs, and neither is documented as a rule

| Family | Members | Shape |
|---|---|---|
| **A — atom + `FormField`** | Input, Textarea, Select, PasswordInput, AadhaarInput, PanInput, OtpInput, CaptchaField | take `invalid: boolean`; label/hint/error come from `FormField` |
| **B — self-contained field** | Combobox, DatePicker, RadioGroup, CheckboxGroup, DeclarationCheckbox, Search | take their own `label`, `hint`, `error`, `required`, `id` |

`<FormField>{(c) => <Combobox {...c} />}</FormField>` does not work — the render-prop hands
over `invalid` (Family B expects `error`) and an `aria-describedby` Family B has no prop for.
**No consumer in the estate does this today** (verified by grep), so it is a latent trap. The
split is defensible; it has to be stated. Give Family B an `invalid` alias and let it accept a
passed `aria-describedby`, so the wrong call degrades instead of breaking.

### H5 · No character counter
Nothing in `forms/` implements one. GOV.UK, USWDS and Carbon all ship it. Grievance, remarks
and justification fields across the estate all want it. It must be `aria-live="polite"`,
throttled rather than per-keystroke, and must warn before the limit rather than only at it.

### H6 · UX4G's content library is not adopted
UX4G §7 publishes 50+ standard field labels ("Full Name", "Mobile Number", "Aadhaar
Number"…), 40+ error patterns, 30+ helper-text examples, 20+ success templates, and the
formula **`[Problem] + [Solution]`** ("Enter a valid 10-digit mobile number", not "Invalid
input"). None of it is in the design system; none of the 28 documentation pages states the
formula. Cheapest large win: a `content/field-copy.ts` constant plus one paragraph on the
FormField page would stop twenty portals retyping twenty labels differently.

### H7 · `role="alert"` fires on a statically rendered error
`FormField` always renders the error paragraph with `role="alert"`. On a server-rendered page
returning validation errors, several screen-reader / browser pairings announce every alert on
load — out of reading order and detached from the field. Apply it only when the error appears
*after* mount; on first paint let `ErrorSummary` take focus and carry the announcement.

---

## 4. Where the two UX4G sources contradict each other

Neither of these is a straightforward compliance failure. Both need a recorded decision.

### M1 · Label and helper-text sizes

| | Written guidance | Figma library (Size=M) | Ours |
|---|---|---|---|
| Field label | **Label/XL 16px**, or Label/L 14px | **`Label/M` 12px** | 14px static · 13→14px fluid on portals |
| Helper / caption | **Body/S 14px** | **`Body/XS` 12px** | 12px static · 12→13px fluid on portals |

The two UX4G sources are 4px apart on both rows. We sit between them: our label matches the
doc's secondary option (Label/L 14px) and is *larger* than the Figma master; our hint matches
the Figma caption exactly and is *smaller* than the doc.

**Recommendation.** `standards-precedence.md` says quality wins and the standard's list is a
floor: take the larger of the two on each row — label to **16px**, hint and error to **14px** —
and record that we followed the written guidance over the Beta Figma master. The label
dropping to 13px on a portal phone is the part with no defence either way.

### M2 · Focus ring geometry

| Written guidance | Figma library | Ours |
|---|---|---|
| 4px ring, **2px offset**, matching radius, 3:1 | `Border width = 1px \| 2px`, no offset | `box-shadow: 0 0 0 3px`, no offset |

Contrast passes; the geometry matches neither source. Pick one and record it. The offset is
the substantive part — without it the ring sits directly on the border colour rather than
clear of it.

---

## 5. Remaining medium findings

- **M3 · No label icon.** UX4G's property 10 — the tooltip / explanatory glyph beside a label.
  Half the fields on a government form need one ("which name is this?").
- **M4 · The caption icon slot is reserved and never filled.** `.ds-field__error` sets
  `display: flex` and `gap: var(--sa-stack-4)` for an icon no component passes. UX4G ships it
  as property 19. Finish it or drop the flex.
- **M5 · No "optional" convention, and no required-fields legend.** We have a required `*` and
  nothing else. UX4G's Form Field Group ships a **`Form/required fields legend`** component
  precisely so a long form can mark the minority instead of asterisking everything.
- **M6 · `ErrorSummary` covers error only.** UX4G's form-level **status banner** carries
  Error / Success / Warning. A submitted-successfully banner has no component today.
- **M7 · `FormSection` is not collapsible and has no footer action bar.** UX4G's form header
  has a `Collapsible=True` variant, and its footer ships as a component with 1–3 buttons,
  three alignments and Desktop/Mobile variants. Long application forms need both.
- **M8 · No pending / validating state.** Async validation (PAN lookup, pincode → district)
  has no spinner slot and no `aria-busy` convention, so every portal invents one.
- **M9 · `FormField`'s JSDoc contradicts its own render.** The `hint` prop is documented as
  *"Helper text rendered below the label"*; the code renders it **below the control**.
  **The code is right** — UX4G defines Caption as *"supportive helper text below the text
  field"* and its anatomy draws it there. Fix the comment, not the component. (This corrects
  an earlier draft of this audit, which suggested moving the hint above the control.)

---

## 6. Low findings

- **L1 · Devanagari leading is not applied to controls.** UX4G §2.8 sets Hindi line-height to
  1.8; form labels and hints render Hindi at Latin leading.
- **L2 · WCAG 1.3.5 (Identify Input Purpose, AA) is claimed but not helped.** `autocomplete`
  passes through and the Input page claims the criterion, but nothing lists the tokens and no
  gate checks that a name/email/phone field carries one.
- **L3 · Accessibility claims are unverified by construction.** The `A11yItem` rows carry no
  `status`, so per `ds-documentation-standard.md` §2a they default to `untested` — including
  1.3.5 and 2.5.8. Correct behaviour by the standard; worth saying out loud that the
  compliance table is a claim list, not evidence.
- **L4 · No `labelHidden` option** on `FormField`, so a toolbar field whose label is carried
  by context has to hand-roll one.
- **L5 · A consumer-supplied `aria-describedby` replaces rather than merges** with
  `FormField`'s, because the render-prop value is spread before consumer props.

---

## 7. Priority actions

1. **Ship the three missing states** — Read-only, Success, Warning — on Input, Textarea,
   Select **and** the caption. This is the single largest gap against UX4G's own library. (H1)
2. **Add the size scale** (S/M/L/XL) and the prefix affix. Both are first-class UX4G
   properties and both will otherwise be hand-rolled per portal. (H2, H3)
3. **Ship the character counter, the optional/required-legend convention, and the label
   icon.** (H5, M3, M5)
4. **Adopt UX4G's field-label and error-message library** as design-system constants, and put
   the `[Problem] + [Solution]` formula on the FormField page. (H6)
5. **Document the two field APIs** and make the wrong call degrade rather than break. (H4)
6. **Decide and record the two contradictions** — label/helper sizes, focus-ring geometry.
   Recommendation: follow the written guidance (16px label, 14px helper) over the Beta Figma
   master, and add the 2px focus offset. (M1, M2)
7. **Fix `role="alert"` on first paint**, and correct the `FormField` hint JSDoc. (H7, M9)

Then: form-level status banner, collapsible section header, footer action bar, pending state.

---

## 8. What this audit did NOT check

- **Visual verification in a browser.** No screenshots of our own components were taken;
  every finding comes from source, token values and the UX4G Figma library.
- **Our own Figma library.** This compares our *code* to UX4G's Figma; it does not check that
  our code and our Figma agree.
- **UX4G's Storybook / NPM package.** Their Resources table lists a Web (HTML, React, Angular)
  Storybook, a Flutter package, an NPM package and a Dart package, all marked Available. A
  third pass could compare against the shipped code rather than the design file.
