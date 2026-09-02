# Portal Login Template — issues and gaps, code and Figma

**Audited 2026-09-02.** Read-only stocktake of the login system as it stands in
`@mosje/design-system` and in the SAMAVESH Figma library. Nothing was changed.

Scope: `packages/design-system/components/auth/**` (13 files, 3,185 lines), the ten
portal login routes under `apps/hub/src/app/portals/`, the docs page and specimen, the
Figma master `55397:1364` and its documentation frame `55399:1354`, and the five gates
that could bear on any of it.

**Headline: the template is finished, documented, gated and unused. The shell it sits
on is used by four live routes and carries an accessibility defect that no gate in the
estate is watching.**

---

## 0. What exists

| Tier | Thing | Lines | Consumers |
|---|---|---|---|
| 4 | `PortalLoginTemplate` — whole page from one config object | 565 | **0** |
| 3 | `PortalLoginShell` — chrome, two columns, form slot | 302 | **4** |
| 2 | `auth-parts.tsx` — 7 parts (`AuthDivider`, `ConsentLine`, `ResendTimer`, `MaskedContactRow`, `SSOButton`, `AccountPrompt`, `SigningIntoBar`) | 359 | **0** |
| — | `portal-login-url.ts` + tests | 110 | template only |
| — | `types.ts` | 136 | — |

Supporting records: `README.md` (212), `FIGMA-SPEC.md` (218),
`LOGIN-SYSTEM-ANALYSIS.md` (823).

---

## A. Adoption — the gap that makes every other gap cheap

`PortalLoginTemplate` is imported by **zero** of the ten portal login routes.

| Route | Lines | What it uses |
|---|---|---|
| `e-anudaan/login` | 104 | `PortalLoginShell` + DS form parts |
| `e-anudaan/sign-in` | 228 | `PortalLoginShell` + DS form parts |
| `nmba/admin/login` | 169 | `PortalLoginShell` + DS form parts |
| `nmba/treatment-centre/login-otp` | 186 | `PortalLoginShell` + DS form parts |
| `nhapoa/login` | 137 | bespoke — `@/components/nhapoa/ui` fork |
| `scw/login` | 221 | bespoke — `@/components/scw/ui` fork |
| `tg/admin/login` | 146 | bespoke — `@/components/tg/ui` fork |
| `tg/citizen/sign-in` | 134 | bespoke — `@/components/tg/ui` fork |
| `pm-ajay/login` | 287 | bespoke — own `Navbar` |
| `smile-admin/(auth)/login` | 264 | bespoke — DS primitives, own layout |

**Template 0/10 · Shell 4/10 · Bespoke 6/10.** 1,189 lines of hand-maintained login
code across six routes that the template was built to delete.

Three portals (`nhapoa`, `scw`, `tg`) each maintain a private `Button` / `Field` /
`TextInput` fork under `@/components/<portal>/ui` — a direct breach of "one component,
one definition, no per-app forks", and the reason those four routes cannot adopt the
shell without a visual-regression pass first.

**The seven `auth-parts` have no product consumer either.** `AuthDivider` (the "or sign
in with credentials" rule), `SSOButton` (DigiLocker), `ResendTimer` (the OTP countdown),
`ConsentLine`, `AccountPrompt` (Create Account) were all built specifically to close the
handoff-parity gap in §G — and the template hand-rolls every one of them instead of
importing them. Their only references are a Storybook story, the changelog page, the
generated props file and the barrel.

---

## B. Design-system-first breach, inside the design system

`portal-login-template.tsx` imports exactly one DS component: `PortalLoginShell`. Every
control below it is hand-rolled, while an equivalent sits exported in the barrel:

| Hand-rolled in the template | Exists at |
|---|---|
| raw `<input type="text">` | `index.ts:76` `Input`, `:111` `FormField` |
| text Show/Hide password reveal | `index.ts:78` `PasswordInput` |
| raw OTP `<input>` | `index.ts:83` `OtpInput` |
| raw `<select>` | `index.ts:101` `Select` |
| raw radio inputs | `index.ts:116` `Radio` |
| `<div role="alert">` with an emoji | `index.ts:137` `Alert` |
| submit `<button>` | `index.ts:62` `Button` |
| segmented pill selector | `index.ts:339` `SegmentedControl` |
| role tablist (in the shell) | `index.ts:175` `Tabs` |

This is the direct cause of §C and §E: the DS components already carry the
`autocomplete` attributes, the 24×24 target sizes, the focus rings and the token
bindings that the hand-rolled copies are missing. `smile-admin` and the two `e-anudaan`
routes — which *do* use `Input` and `PasswordInput` — got the 24px touch-target fix on
2026-09-02 for free. The template did not.

---

## C. Accessibility defects

### C1 — `aria-hidden` region containing a focusable link · **P0, live on 4 routes**

`portal-login-shell.tsx:144–212`. The whole left hero column carries
`aria-hidden="true"`, and the "Signing Into" strip inside it (lines 174–211) contains a
real `<a href={changeHref}>` at line 199.

Consequences, in order of severity:

1. A keyboard user can Tab to a link that a screen reader will not announce — the
   `aria-hidden-focus` axe rule, a definite WCAG 4.1.2 failure. Desktop only: the column
   is `hidden lg:flex`, so below 1024px it is `display: none` and correctly unreachable.
2. **A screen-reader user is never told which portal they are signing into.** The portal
   name is rendered at line 194–196, inside the hidden subtree. That is a content loss,
   not just a technical violation.

The `aria-hidden` was presumably meant to suppress the decorative SAMAVESH lockup. It
should scope to the decorative hero content (lines 153–171) and leave the strip exposed.

### C2 — the a11y suite watches no login route at all · **P0, process**

`e2e/a11y/axe.spec.ts:104–133` covers 15 routes: eight portal landings, the website home
and six design-system pages. **Not one login page.** The 2026-09-02 remediation pass that
took nine violations to zero across "all eight portals" never loaded a login screen, so
C1 has been live and green throughout. The docs page rendering the template's specimen
is not in the list either.

### C3 — captcha is a cognitive function test with no alternative · WCAG 2.2 AA 3.3.8

`portal-login-template.tsx:140–149, 411–412`. A 5-character code generated in React state
and rendered with `line-through decoration-gray-400`. No audio alternative, no
object-recognition alternative, no bypass.

The docs page is honest about this — it marks 3.3.8 `status: "partial"` and names the
mitigation: *"where it is enabled, the OTP mode is the alternative"*. That reasoning
holds **only if the role also offers OTP**, and nothing in the code enforces it. A role
configured `authModes: ["password"]` with `showCaptcha` produces a conformance failure
that the type system permits and no gate catches.

Secondary: `maxLength={6}` on a 5-character code; the code is readable from the DOM, so
it is decorative rather than protective.

### C4 — incomplete ARIA tabs · WCAG 4.1.2

`portal-login-shell.tsx:218–245`. `role="tablist"` with `role="tab"` and `aria-selected`
on anchors — but **no `role="tabpanel"`, no `aria-controls`, and no arrow-key roving
tabindex**. A screen reader announces "tab 1 of 3, selected"; the user presses the arrow
keys the announcement promises and nothing happens. Either implement the APG pattern or
drop the roles and let them be what they are — links in a `<nav>`.

`aria-label="Portal login type"` is also wrong: the tabs select a **role**, not a login
type. The login type is the selector below.

### C5 — no `autocomplete`, anywhere

Zero `autoComplete` attributes across the whole template — no `username`,
`current-password`, `tel`, or `one-time-code`. WCAG 1.3.5 Identify Input Purpose (AA),
and the reason password managers and OTP autofill do not work on any login page built
from it. `inputMode` is absent too, so the mobile field raises a full keyboard.

### C6 — emoji as interface

`⚠️` (error), `🔒` (DigiLocker), `↻` (captcha refresh), `→` (submit), `⇄` (Change).
CLAUDE.md mandates `<Icon>` — Material Symbols Rounded, weight 300. The `🔒` carries no
`aria-hidden`, so a screen reader reads "locked emoji" mid-label. Emoji also render in
the system emoji font, not Noto Sans.

### C7 — hardcoded element IDs

`login-username`, `login-password`, `login-captcha`, `login-mobile`, `login-otp`
(template) and `login-form` (shell). Two instances on one page produce duplicate IDs and
broken `<label for>` associations — which is exactly what the docs page does, rendering
a specimen beside prose. `React.useId()` is the fix.

### C8 — unverified contrast on the hero

Six `color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) N%, transparent)` values
at 80/90/55/70/25/10/20% over a three-stop gradient. The 55% body paragraph
(`portal-login-shell.tsx:167`) is the one most likely to fail. Never measured. Currently
moot because the region is `aria-hidden` and decorative, but it becomes live the moment
C1 is fixed.

### C9 — no client-side validation

`<form noValidate>` (line 241) with `required` on the inputs — so native validation is
switched off and nothing replaces it. Submitting empty calls `onSubmit` with empty
credentials. No `aria-invalid`, no `aria-describedby`, no field-level error. The only
error surface is the caller-supplied `error` prop, which arrives after a round trip.

---

## D. Correctness defects

### D1 — auth-mode selector resets on every render when `config` is inline · latent

`portal-login-template.tsx:163–168`:

```tsx
React.useEffect(() => {
  if (activeRole) setActiveAuthMode(activeRole.defaultMode || authOptions[0]?.mode || "password");
}, [activeRoleId, authOptions]);
```

`authOptions` is memoised on `[activeRole]`, and `activeRole` is a bare `.find()`
recomputed each render. With a **stable** `config` — a module-level const, which is what
the README, the specimen and the Storybook story all use — identity holds and the effect
is quiet.

Pass an **inline object literal** (`config={{ … }}`), the natural way to write it, and
`config.roles` is a fresh array each render → `activeRole` a fresh object → `authOptions`
a fresh array → the effect fires every render. The user clicks "Mobile OTP", state
updates, the effect resets it to the default, and **the auth mode cannot be changed at
all**. A trap, not a live bug — but the first adopter who inlines their config will hit
it and it will look like a mystery.

Fix: memoise `activeRole` on `[config.roles, activeRoleId]`, and drive the reset off
`activeRoleId` alone.

### D2 — hydration mismatch on the tab hrefs

`portal-login-template.tsx:213–222` computes `window.location.pathname` **during
render**, guarded by `typeof window === "undefined" ? ""`. The server emits
`href="?role=citizen"`; the client emits `href="/portals/scw/login?role=citizen"`.

The comment at lines 87–96 explains at length why this exact pattern was avoided for the
role state — and then the component does it four lines later for the hrefs. Same defect,
same file, opposite conclusion.

### D3 — `onSubmit` result is dropped

`handleSubmit` (195–210) calls `onSubmit(...)` without `await` or `.catch()`, although
the type is `void | Promise<void>`. A rejected promise becomes an unhandled rejection,
and the caller must drive `loading` externally with no signal from the component.

### D4 — OTP send has no failure path

`handleSendOtp` (189–193) sets `otpSent` and starts the timer unconditionally. There is
no pending state, no error state, and `Resend` restarts the timer whether or not
anything was sent.

---

## E. Token and copy violations

**~40 raw Tailwind colour utilities** in the template — `text-neutral-*`,
`border-neutral-*`, `bg-neutral-*`, `bg-white`, `text-white`, `hover:text-black`,
`decoration-gray-400` — against `design-system-architecture.md` §2, "never use raw hex,
`rgb()`, or arbitrary colors… always use semantic tokens". These are Tailwind's default
slate ramp, not the SAMAVESH neutral ramp, so **the login form does not follow the brand
switch**: toggling `blue` → `navy` → `dbim` leaves every label, border and field
background where it was. `lint:css` does not see them because they are class names in
TSX, not CSS declarations.

`lg:w-[58%]` and `max-w-sm` (shell) are arbitrary-value layout against the handoff's
922/518 split — see §G.

Copy: `"Verifying..."` uses three periods rather than an ellipsis; `"Sign In →"` puts a
glyph in a button label; `"Fast-track DigiLocker SSO"` is product-marketing voice on a
government page (`ui-restraint-and-copy.md` §2).

---

## F. Figma ↔ code divergence

`types.ts` retired two invented auth modes on **2026-08-17**, with the rationale in the
file: a full read of the handoff — 69 auth screens across 10 pages — found **no DARPAN
and no Aadhaar screen anywhere, in any portal**. They were written from a brief before
the design file was available.

Three surfaces still carry them:

| Surface | State |
|---|---|
| `types.ts` | ✅ corrected — `PortalAuthMode = "password" \| "otp" \| "digilocker"` |
| `FIGMA-SPEC.md` §2 | ❌ still lists `Aadhaar OTP` and `NGO DARPAN ID` as `Auth Method` values |
| Figma master `55397:1364` | ❌ still publishes both as variant values |
| `.agents/rules/portal-login-template.md` | ❌ still instructs agents to configure `"darpan"` and `"aadhaar"` |

The agents rule is the damaging one: it is loaded by Codex, Cursor and Antigravity, and
it tells them to write configs the type system rejects. It also points at
`apps/portals/*`, a path that stopped existing when portals became route groups.

**`check:figma-docs` does not cover this component.** `tools/figma-doc-parity/claims.json`
contains zero `PortalLogin` pins, so nothing re-derives the Figma page's claims from the
code. Every drift in this section is invisible to CI by construction.

---

## G. Handoff parity gap

From `FIGMA-SPEC.md` §9 — our build against `MoSJE Portal Handoff` (`evmNmlK8g4VYwJVu2FwSGV`):

| | Handoff | What we built |
|---|---|---|
| Frame | 1440 × 960 | 1440 × 947 |
| Navbar | 134 (bar 40 + masthead 94) | 46 + 112 |
| Split | hero **922** / form **518**, content 390 | 700 / 420 (`58%` / `max-w-sm`) |
| Hero | full-bleed portal **photograph** + navy scrim | flat gradient panel |
| Role tabs | **2** — Citizen/Beneficiary, Officer/Admin | 3 |
| DigiLocker | primary CTA **above** an "or sign in with credentials" divider | one pill inside the selector |
| Auth method | **underline tabs** — Password / OTP | segmented pills, 5 methods |
| Absent from our build | "Your role" select · consent line · Create Account · Change button | — |

Note the shape of that last row: `AuthDivider`, `SSOButton`, `ConsentLine` and
`AccountPrompt` were **built for exactly these four gaps**, exported, and never wired in.
The parity work is largely assembly, not authoring.

---

## H. Defects inherited from the handoff

From `LOGIN-SYSTEM-ANALYSIS.md` §6. Carried forward from that audit, not re-verified here.

**Ours to fix (8):**

1. `Forgot Password?` is node `8774:24797` — a `Link` instance at 102×86, a navigational
   card with a 48×48 icon container and a 1px-wide text node, sitting on the password field
2. The SAMAVESH wordmark is **~100 individual TEXT nodes per screen**, across ~69 frames
3. Token vocabulary mismatch — the handoff binds MoSJE Portal DS
   (`Color Styles/Primary/Source`, `Spacing/spacing-md`, `Border Radius/radius-lg`,
   `Typography/font-size/title-2`), not SAMAVESH
4. **59% of fills unbound — 317 of 537** on the canonical desktop screen
5. Two competing recovery designs — master 5-step vs SCW 4-step
6. The portal picker list differs between portals (NHAPOA lists SAMBAL and NHAA where
   master lists E-Anudaan and NHAPOA)
7. Beggary's Choose Portal shows `SIGNING INTO / SCW` — copy-paste error
8. NHAPOA has three byte-identical `Login / Sign In / Desktop` frames

**Flagged by the designer, needs a human (7):**

1. E-Anudaan tagline reads `Description Text`
2. Recovery Step 5 heading reads `PIN Updated!` — should be `Password Updated!`
3. `Hero — SMILE-Beggary` is named `TG`
4. **Registration and Recovery have no mobile design at all** — citizens register on phones
5. No tablet breakpoint designed
6. NISD logo is not in the portal registry
7. Orange portal names `#F97316` on white = **3.09:1, fails WCAG AA** — should bind to
   `bg/brand/secondary/bolder` `#c34700`

---

## I. Missing assets and Figma library gaps

**Assets not obtained:** NOS hero photograph (image node `8774:24872` exports 149 bytes —
empty; needs a designer, not a better export), SAMAVESH roundel, DigiLocker mark, and the
SCW / SMILE-Beggary / E-Utthaan / E-Anudaan logos.

**Figma library defects blocking a clean build (5):**

1. `Input Field`'s `Size=Default, State=Empty` variant does not expose `Label Text`
2. `Link` has no text property
3. `Chip` has no label property
4. `Input Field` binds primitives, not semantic roles
5. The Figma `Button` has no `Inverse` tone, though the code `Button` does

There is no Figma `Select` at all, which is why the "Your role" dropdown in §G has no
library part to instance.

**Not built:** `PortalPicker`, `OtpVerify`, `Registration` (5 steps), `CredentialRecovery`
(5 steps) — the rest of the "full auth suite" scope.

---

## J. What the gates catch, and what they cannot

Run 2026-09-02:

| Gate | Result | Bears on this component? |
|---|---|---|
| `check:props` | ✔ 145 interfaces, 1,026 props current | Yes — `PortalLoginTemplateProps` is generated, table is accurate |
| `check:ds-pages` | ✔ 102/102 conformant | Yes — the docs page carries all six elements |
| `check:storybook` | ✔ 127/127 (100%) | Yes — story exists |
| `check:figma-docs` | passes vacuously | **No — zero claims pinned for this component** |
| `lint:css` | n/a | **No — the ~40 raw colours are TSX class names** |
| `e2e/a11y/axe.spec.ts` | ✔ 15/15 routes | **No — not one login route is in the list** |

**Every finding in §C, §D, §E and §F is invisible to CI.** The documentation gates are
green because they check the *shape* of the page, and the shape is correct; nothing
checks whether the component behind it works, is reachable, or matches Figma.

The docs page deserves specific credit: it uses `ComponentDocPage`, generates its props
table from the type checker, and marks 3.3.8 `partial` with named evidence rather than
claiming a tick. Of the six a11y rows, one is honestly downgraded — which is the standard
`ds-documentation-standard.md` asks for and rarely gets.

Code Connect **is** a dependency (`@figma/code-connect ^2.0.0`,
`packages/design-system/package.json:45`), and both `.figma.ts` templates exist. Only
publishing is outstanding, and that needs a token no agent session may hold.

---

## Priority

**P0 — live defect on shipped routes**
- C1 `aria-hidden` over a focusable link and the portal name — four live routes
- C2 add every login route to `e2e/a11y/axe.spec.ts`, then re-run

**P1 — blocks adoption**
- B rebuild the template on DS components (fixes C5, C6, C7, most of E in one pass)
- D1 memoise `activeRole`; D2 move href computation into an effect
- C3 make OTP-or-equivalent a *type-level* requirement wherever captcha is enabled
- C4 finish or remove the tabs pattern

**P2 — divergence and parity**
- F correct `FIGMA-SPEC.md` §2, the Figma master's `Auth Method` axis, and
  `.agents/rules/portal-login-template.md` (also fix its dead `apps/portals/*` path)
- F pin the documentation page's claims in `claims.json`
- G wire in the four `auth-parts` that already exist; re-cut the split to 922/518

**P3 — needs a human or a designer**
- H's seven designer-flagged items, including the missing mobile designs
- I's missing artwork and the five Figma library defects
- Retiring the three per-portal `Button`/`Field`/`TextInput` forks (visual-regression risk
  on live portals)
