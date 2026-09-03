# Input Fields — Plan, Tracker and Success Criteria

**Branch:** `ds/input-fields-world-class` (worktree, from `origin/main` @ 95b72bf6)
**Goal:** the text-entry field stack matches every good thing in the UX4G 3.0 Figma
library and the best systems in the industry, and beats all of them on eight named
points.
**Evidence base:** `docs/audit/input-fields-audit-2026-09-03.md`.

---

## 1. Scope

**In scope — the text-entry field stack.**
`Input` · `Textarea` · `Select` · `FormField` · `Label`, plus the new supporting parts
they need: character count, the required/optional policy, the field-status model, and
the typed autocomplete contract.

**Out of scope, deliberately, and why.**

| Deferred | Why |
|---|---|
| `FormSection` collapsible header, form footer action bar, form-level status banner | These are UX4G's *Form Field Group*, not its *Input – Text Field*. They are real gaps (audit M6, M7) but they are container work, and doing them here would leave the field stack half-finished. Tracked as Phase 2. |
| `Combobox`, `DatePicker`, `RadioGroup`, `CheckboxGroup`, `Search` | Separate components with their own audits. They get one change only: an `invalid` alias so a `FormField` render-prop spread degrades instead of breaking (audit H4). |
| Our own Figma library | Code first. The Figma pass is a separate branch, and it needs a human at the keyboard. |

---

## 2. Benchmark set

What "best in the industry" is measured against, per feature:

| System | What it is best at, for a text field |
|---|---|
| **GOV.UK Design System** | error summary + focus management; character count thresholds; hint copy; "mark the optional, not the required" |
| **IBM Carbon** | the `helperText` / `invalidText` / `warnText` triple; size scale; read-only; skeleton |
| **Adobe Spectrum** | `necessityIndicator`, contextual help, the most rigorous label model |
| **Shopify Polaris** | connected prefix/suffix, character count, `monospaced` |
| **Material 3** | supporting text, prefix/suffix text, leading/trailing icons |
| **US Web Design System** | input masks, memorable date, validation |
| **UX4G 3.0** | the 4×8 size/state matrix, caption statuses, the required-fields legend |

---

## 3. Success criteria

The goal is met when **every row below is true and evidenced**. "Evidenced" means a
command's output or a screenshot, not an assertion.

### A · Parity with UX4G's Figma library

| # | Criterion | Target | Evidence |
|---|---|---|---|
| A1 | Field states | **8** — default, hover, focused, error, **success**, **warning**, disabled, **read-only** — on Input, Textarea and Select | rendered state matrix screenshot |
| A2 | Caption statuses | **4** — default, error, success, warning | same |
| A3 | Size scale | **4** — sm / md / lg / xl | same |
| A4 | Composition slots | **6/6** — leading icon, prefix, suffix, trailing items, label icon, caption icon | same |
| A5 | Required-fields legend | ships as a component | rendered |
| A6 | Radius / padding / border | 8 / 12 / 1px — already matching, must not regress | CSS diff |

### B · Parity with the best of the industry

| # | Criterion | Benchmark it matches |
|---|---|---|
| B1 | Character count with threshold announcement | GOV.UK |
| B2 | Read-only distinct from disabled | Carbon |
| B3 | Warning state that does not block | Carbon |
| B4 | Prefix / suffix text affixes | Polaris, Material 3 |
| B5 | Contextual help beside the label | Spectrum |
| B6 | Necessity indicator (required *or* optional) | Spectrum |
| B7 | Pending / validating state | Polaris |
| B8 | Error summary with focus management | GOV.UK (already shipped — must keep working) |

### C · Better than the best — the eight claims

Each names a system that does **not** do it. If a claim turns out to be false, it is
struck from this list rather than quietly kept.

| # | Claim | Who doesn't do it |
|---|---|---|
| C1 | `aria-describedby` **merges** hint + status + count + consumer-supplied ids, never replaces | Carbon and MUI both clobber a consumer's `aria-describedby` |
| C2 | `autocomplete` is a **typed union** of the WCAG 1.3.5 tokens — a wrong token is a compile error | no major design system types this |
| C3 | Necessity is a **form-level policy** with an auto-rendered legend, not a per-field boolean | Spectrum does per-field; GOV.UK leaves the legend to the author |
| C4 | The error is announced **correctly on both server-render and client-validate** — no `role="alert"` firing on first paint | most React systems ship the first-paint bug |
| C5 | The character count **escalates politeness** — polite under the limit, assertive over it | GOV.UK has the threshold, not the escalation |
| C6 | Read-only is a real `readonly` — focusable, copyable, announced as read-only | most systems style `disabled` and call it read-only |
| C7 | A prefix is `aria-hidden` **and mirrored into the accessible description**, so "₹" is not read as part of the value but its purpose still reaches a screen reader | Polaris and Material both leak or drop it |
| C8 | Devanagari leading and the iOS zoom floor are in the component, not the consumer | no western system handles either |

### D · Gates and craft

| # | Criterion |
|---|---|
| D1 | `npm run lint:css` clean — zero raw colour, spacing or radius values |
| D2 | `npm run typecheck` clean, no `any` |
| D3 | `npm run check:props` clean — the generated props table matches the interfaces |
| D4 | `npm run check:ds-pages` clean — no page drops below its baseline |
| D5 | `npm run check:docs-coverage` clean — every new export has a page |
| D6 | Every a11y row on a touched page carries a real `status` and `evidence` — no silent `untested` |
| D7 | **Visual audit performed** — the state × size matrix seen in a browser before completion, per CLAUDE.md's mandatory rule |
| D8 | No public signature broken; `invalid` keeps working everywhere it is used today |

---

## 4. Work packages and tracker

Status: ☐ not started · ◐ in progress · ☑ done · ⊘ deferred

| ID | Work package | Delivers | Status | Evidence |
|---|---|---|---|---|
| **W1** | Status + size model — `FieldStatus`, `status` with `invalid` kept as an alias, `size` sm/md/lg/xl, real `readOnly` | A1, A3, B2, B3, C6, D8 | ☑ | measured in a browser: 40 / 44 / 48 / 56 exactly; `readOnly` reports `readOnly:true, disabled:false, tabIndex:0` |
| **W2** | Affixes and slots — `prefix`, `suffix`, icons, status tinting, one bordered flex row | A4, B4, C7 | ☑ | all four affixes render; every one `aria-hidden="true"`; meanings resolve through `aria-describedby` |
| **W3** | FormField rewrite — status message, describedby merge, `labelHelp`, `labelHidden`, mount-aware announcement | A2, A4, B5, B8, C1, C4 | ☑ | `aria-describedby` resolved to hint + message + a caller-supplied id, all three intact; live regions empty on first paint with 8 messages rendered |
| **W4** | Necessity policy — `FieldPolicyProvider`, `RequiredFieldsLegend` | A5, B6, C3 | ☑ | both legends render per policy; only the non-required field is marked under `optional` |
| **W5** | Character count — graphemes, threshold, debounce, politeness escalation | B1, C5 | ☑ | `"नमस्ते"` counts 3 against `String.length` 6; `"👍🏽"` counts 1 against 4 |
| **W6** | Pending state — `aria-busy`, spinner, still editable | B7 | ☑ | renders; field is not disabled |
| **W7** | Typed autocomplete — `AutocompleteToken` | C2 | ☑ | `autoComplete="firstname"` fails the build; `"given-name"` compiles |
| **W8** | Typography + focus + Devanagari | C8, audit M1/M2 | ☑ | label 16px/24px/500, hint 14px/20px; focus `3px solid rgb(3,115,223)` at `2px` offset; leading re-bound through tokens so `check:type-linkage` stays clean |
| **W9** | Family-B `invalid` alias | audit H4 | ☑ | Combobox, DatePicker, RadioGroup, CheckboxGroup, DeclarationCheckbox |
| **W10** | Docs, stories, barrels, gates | D1–D6, D8 | ☑ | `npm run check` exits 0, zero failures; a11y verified criteria 196 → 232 |
| **W11** | Visual audit | D7, A1–A4 | ☑ | rendered matrix reviewed twice; it is what found the size and announcement defects |
| **W12** | Composable parts — `useFieldIds`, `FieldLabel`/`Hint`/`Message`/`Help`/`HelpToggle`; `FormField` rebuilt on them | reusability | ☑ | ids derived from one `useId`, correct on the server's first paint |
| **W13** | Customisation — `classNames` per part, `data-part`/`data-status`/`data-size`, `orientation="inline"`, `footer`, `messageIcon` | reusability | ☑ | all 8 `data-part` hooks present in the DOM |
| **W14** | Localisation — `FieldCopy`, `FieldPolicyProvider copy`, inherited and partial | reusability, GIGW | ☑ | one provider rendered the legend, the optional suffix and the count in Hindi |
| **P2** | Form Field Group — collapsible header, footer actions, form status banner | audit M6, M7 | ⊘ deferred | container work, not field work; recorded so it is not lost |

### Defects found along the way, and fixed

| Found by | Defect |
|---|---|
| measuring the rendered matrix | `md` and `lg` both rendered at 50px — padding, not `min-height`, decided the height |
| computing the contrast | the focus ring was **2.01:1**, failing SC 1.4.11 on every field in the estate, and a box-shadow, so invisible in forced colours |
| reading the live regions | the mount guard was defeated by React's double-invoked effects; seven errors were announced on load |
| `grep` for the class definition | `.ds-sr-only` was used by DatePicker, Combobox and Chip and defined by none of their stylesheets — their visually-hidden text was on screen |
| checking my own claim | the docs page said `"नमस्ते"` is 6 graphemes. It is 3. |

## 5. Order of execution

W7 → W1 → W2 → W8 → W3 → W4 → W5 → W6 → W9 → W10 → W11.

Types first so everything downstream compiles against them; CSS decisions (W8) before
the FormField rewrite so the new markup is styled as it lands; the visual audit last,
because it is the check on all of it.
