# Checkbox and Radio — audit and gap analysis

Audited 2026-09-04 against the code in `packages/design-system/components/forms/`, the Figma
library `3FF5l0SMNIwdpZrKkeyPTm`, the estate's call sites, ten industry design systems, and the
four government standards in `docs/guidelines/`. The remediation brief is
`docs/plans/2026-09-04-checkbox-radio-world-class.md`.

## Why this audit exists

The Checkbox and Radio atoms are the June-13 originals. The rest of the field stack was rebuilt on
2026-09-03 (`docs/audit/input-fields-audit-2026-09-03.md`) with a 40/44/48/56 size ladder, eight
states, Figma documentation frames and Code Connect templates. Checkbox and Radio were left out of
that pass, and the estate routes around them: 15 design-system call sites against 14 raw
`<input type=checkbox|radio>` in portals, two private duplicate kits, 8 bare Yes/No Radio pairs with
no fieldset, and 58 raw checkboxes inside the design system's own docs playgrounds. Both Figma pages
are "Published", not "Ready".

**Decisions taken 2026-09-04:** box scale sm 16 / md 20 / lg 24 with md default; one
`Selection Card` set plus `Checkbox Group` and `Radio Group` sets in Figma; component + Figma + docs
in one effort, estate migrations as a listed follow-up PR.

## 1. Findings


### Code (`packages/design-system/components/forms/`)

| File | State |
|---|---|
| `checkbox.tsx` (112 LOC) | `checked` + `onChange` required (controlled-only), `indeterminate`, `label`. forwardRef. Sets `aria-checked` on a native input (ARIA-in-HTML says not to; it exists only to drive a CSS selector). |
| `radio.tsx` (120 LOC) | `checked`, `name`, `value` required, `label`, `variant: default\|card`, `description` (card only, and it lands inside the `<label>` so it becomes part of the accessible NAME, not a description). |
| `control-group.tsx` (249 LOC) | The mature half: real fieldset/legend, `legend` required, group `aria-describedby`, `role="alert"` error after options, option-order emission. But: `CheckboxGroup` accepts `variant` and ignores it, drops `description`, passes no `name` (a native form submits nothing), `.is-invalid` has no CSS rule anywhere, no forwardRef, `aria-invalid`/`aria-required` on a plain `<fieldset>` (role `group`) are not permitted attributes — axe `aria-allowed-attr` fires the first time an error renders. |
| `controls.css` (363 LOC, shared with Toggle) | Box 18×18 hardcoded (8 places), border `1.5px` raw, glyph 14px, dot 8px, 12 raw transition durations, **zero `prefers-reduced-motion`**, no invalid/error rule, no read-only, no size scale, forced-colors covers the focus ring only (checked fill vanishes in Windows High Contrast), disabled is `opacity: .5` not a token. |
| Code Connect | **No `checkbox.figma.ts`, no `radio.figma.ts`** — 27 templates exist elsewhere; `component-authoring.md` §12a makes it mandatory. |
| Tests | **None.** `packages/design-system` runs `node --test "components/**/*.test.ts"`; only two test files exist, neither for forms. |
| Docs pages | `forms/checkbox/page.tsx`, `forms/radio/page.tsx` — both `status="Stable"`, all 12 A11yChecklist rows render "Not yet verified", `FIGMA_NODES.checkbox/radio` point at PAGE ids (`2141:296710` / `2141:323876`) not set ids (`15:664` / `18:791`). The Checkbox page claims the DOM `indeterminate` property "is not exposed to AT" — false in every current engine. |
| `design.md` | 3-line entry, no prop list, stale "always wrap in FormField" advice contradicting RadioGroup. |
| Barrel | `CheckboxProps` / `RadioProps` not re-exported as types. |
| Live defects | `smile-admin/permissions/page.tsx:51` renders a Checkbox with no accessible name (4.1.2). `portal-login-template.tsx:440` passes `hint:` where the option type has `description` — text silently dropped. Dead `aadhaar-playground.tsx:45` passes `children` to a void input. |

### Figma (`3FF5l0SMNIwdpZrKkeyPTm`)

| Set | Today | Violations |
|---|---|---|
| `Checkbox` `15:664` | `Type=Selected\|Intermediate\|Unselected` (default **Selected**), `State=Enabled\|Disabled\|Hover\|Focused\|Pressed`. 15 variants. | No Size, no Label text prop, no Description, no Invalid, no Required. "Intermediate" is a misspelling of indeterminate. Default variant is pre-checked (UX4G §7 prohibits pre-checked consent; §6 of `ds-documentation-standard.md` says the default is the one that passes). State order differs from Radio and Toggle. |
| `Radio` `18:791` | `Selected=False\|True` (default **True**), same State axis in a different order. 10 variants. | Same gaps. |
| `radio-card` `55530:2932` | kebab-case name, depends on an **external** `radio-buttons` asset from another file, default text is live TG-portal copy, `Caption`/`Show Caption` have no code counterpart. | Not Title Case, not a local instance, not placeholder. |
| Pages | Both "Published": master exists, **no `— Documentation` frame, no `— Component record`, masters loose at page root**. | Fails `ds-documentation-standard.md` §1. |
| Groups | `RadioGroup`, `CheckboxGroup`, `DeclarationCheckbox` are `code-only` in the parity ledger. | Never designed. |

### Estate usage

| | Count | Where |
|---|---|---|
| `Checkbox` | 5 | smile-admin permissions (no label), users/onboard ×2, nmba irca/register, odic-form |
| `Radio` (bare) | 8 | nmba irca/register ×4, odic-form ×2, outreach-patient-form ×2 — all Yes/No pairs, none in a `RadioGroup` |
| `RadioGroup` | 1 | `portal-login-template.tsx` (inside the DS) |
| `CheckboxGroup` | 0 | nowhere |
| Raw `<input type=checkbox\|radio>` | 14 | scw volunteer ×3, scw sage-registration, scw admin/events/add (a declaration — should be `DeclarationCheckbox`), e-anudaan attendance, nmba photos ×2, website `DataModePanel.tsx` (hand-rolled radiogroup + a checkbox styled as a switch), nhapoa/ui.tsx ×2, tg/ui.tsx ×2 |
| Private duplicate kits | 2 | `apps/hub/src/components/nhapoa/ui.tsx:337–382`, `apps/hub/src/components/tg/ui.tsx:375–420` — byte-identical Tailwind checkbox/radio |
| Raw checkboxes in DS docs playgrounds | 58 | 27 `*-playground.tsx` files + `playground-controls.tsx` |

---

## 2. What the best systems have that we lack


Legend: ✅ have · ⚠️ partial · ❌ missing

| Capability | Material 3 | Carbon | Polaris | Atlassian | GOV.UK | USWDS | Spectrum | Fluent | Radix | Primer | **SAMAVESH** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Size scale | ✓ | ✓ | – | – | ✓ small | – | S/M/L/XL | M/L | – | – | ❌ 18px fixed |
| Uncontrolled (`defaultChecked`) | ✓ | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ❌ |
| Indeterminate | ✓ | ✓ | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | ✅ single only; ❌ group select-all |
| Error / invalid state | ✓ | ✓ warn+invalid | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ | ❌ no prop, no CSS |
| Per-item description / hint | – | ✓ helperText | ✓ | – | ✓ hint | ✓ | – | – | – | ✓ caption | ⚠️ card-only, wrong ARIA |
| `aria-describedby` wiring | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | – | ✓ | ⚠️ group only |
| Read-only | – | ✓ | – | – | – | – | ✓ | – | – | – | ❌ |
| Required (+ marker) | ✓ | ✓ | – | ✓ | – | ✓ | ✓ | ✓ | ✓ | ✓ | ⚠️ group asterisk only, no `required` on input |
| Label placement start/end | ✓ | – | – | ✓ | – | – | – | ✓ | – | – | ❌ |
| Hidden label (`hideLabel` / `aria-label`) | ✓ | ✓ | ✓ | – | – | – | ✓ | – | – | ✓ | ❌ |
| Card / tile variant | – | – | – | – | – | ✓ tile | – | – | – | – | ⚠️ Radio only |
| Group with legend + hint + error | ✓ | ✓ | ✓ ChoiceList | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ |
| Horizontal orientation | – | ✓ | – | – | ✓ inline | – | ✓ | – | ✓ | – | ✅ |
| Conditional reveal per option | – | – | ✓ renderChildren | – | ✓ | – | – | – | – | – | ❌ |
| Exclusive "none of the above" | – | – | – | – | ✓ "or" divider | – | – | – | – | – | ❌ |
| Group-level disabled | ✓ | – | ✓ | – | – | – | ✓ | – | ✓ | ✓ | ❌ |
| Group `name` for native forms | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ❌ CheckboxGroup |
| `onCheckedChange` value callback | – | – | – | – | – | – | ✓ | – | ✓ | – | ❌ |
| Reduced motion | ✓ | ✓ | ✓ | ✓ | – | – | ✓ | ✓ | – | ✓ | ❌ |
| Forced-colors / HCM checked state | ✓ | ✓ | – | – | ✓ | ✓ | ✓ | ✓ | – | ✓ | ⚠️ focus only |
| Touch target ≥ 44 without growing box | ✓ 48 state layer | – | – | – | ✓ | ✓ | – | – | – | – | ❌ (label is the only extra target) |
| Skeleton / loading | – | ✓ | – | – | – | – | – | – | – | – | ❌ (defer) |
| Code Connect / design-token parity | ✓ | ✓ | ✓ | ✓ | – | – | ✓ | ✓ | – | ✓ | ❌ no template |
| Unit tests | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ❌ none |

### What UX4G 3.0 / DBIM / GIGW / GuDApps have that we don't honour

The UX4G 3.0 capture in `docs/guidelines/UX4G-3.0/` is **foundations-only** — it has no checkbox or radio component page (zero matches), no PDF, and only two `--ux4g-control-*` tokens. Everything below is a generic rule that binds selection controls, plus the Figma proxy in `docs/research/figma-ux4g-ds.md`.

| Source · clause | Requirement | Today |
|---|---|---|
| UX4G §7 Content design | **Pre-checked consent boxes prohibited** | Figma Checkbox master defaults to `Selected`; Radio to `True` |
| UX4G §6 Forms | helper text via `aria-describedby`; errors via `aria-invalid` | Single controls have neither |
| UX4G §7 | Error copy `[Problem] + [Solution]` | Group error is free text; docs never show one |
| UX4G §3, §5 | 44×44 touch on mobile, 8px between targets | 18px box, label is the only extra hit area |
| UX4G §6 | 4px focus ring, 2px offset, 3:1 vs adjacent | ✅ met via `focus/*` tokens |
| UX4G §6 | 3:1 for UI components; never colour alone | 1.5px border anti-aliases lighter at 1× DPR; checked/indeterminate share one fill and rely on glyph only in HCM (fill not painted) |
| Figma proxy (`figma-ux4g-ds.md:125,163`) | 24px hit area, 18px box, `radius-xs` 4px (but line 105 says 8px — unresolved) | code 18px box, 18px hit area |
| DBIM Annexure B.xi | Radios: pre-selected default *in the form*, vertical, ≤6 options as radios not dropdown | Not documented on the page; no do/don't |
| DBIM B.xii | Checkbox = square with check/X when selected | ✅ |
| DBIM B.iv, B.ix | Required marked with asterisk; labels clickable | ⚠️ asterisk on group legend only; single control has no `required` |
| GIGW 5.2.45 / WCAG 3.3.2 | every option labelled | smile-admin permissions Checkbox has no name |
| GIGW / WCAG 1.4.11 | 3:1 non-text contrast for states | Border token passes (7.16:1); the 1.5px weight is the risk |
| GIGW / WCAG 3.3.1 | Error identified in text | Group ✅; single ❌ |
| GIGW / WCAG 4.1.2 | states programmatically set | `aria-checked` on native input is discouraged; group `aria-invalid` on role=group is invalid |
| GuDApps §4.3.2.2 | vertical lists, clickable labels, "None" option, no nested radios, alphabetical ordering discouraged | No "None"/exclusive support; nothing documented |
| GuDApps §4.3.2.3 | Active wording for checkbox labels; Yes/No → single checkbox only when cleared meaning is clear | Not in do/don't |
| WCAG 2.2 2.5.8 (estate baseline) | 24×24 target | 18×18 box fails on its own; docs admit it in prose |

---
