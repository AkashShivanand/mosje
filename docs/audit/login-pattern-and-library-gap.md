# The login pattern, and what SAMAVESH is missing to publish it

**Date:** 2026-09-02 · **Branch:** `ds/docs-world-class` · **Status:** analysis only —
nothing was written to Figma or to code to produce this document.

Sources read directly, not quoted from an earlier pass:

| Source | What was read |
|---|---|
| `evmNmlK8g4VYwJVu2FwSGV` — MoSJE Portal Handoff | **all 12 pages**, enumerated via `figma.root.children` |
| `3FF5l0SMNIwdpZrKkeyPTm` — SAMAVESH library | the `Portal Login Template` page, plus Inputs, Side Sheet, Stepper, Portal Card, Tabs |
| `packages/design-system/components/auth/**` | 12 files |
| `packages/design-system/index.ts` | the export barrel |
| `apps/hub/src/lib/design-system/figma.ts`, `tools/figma-doc-parity/claims.json`, `e2e/a11y/axe.spec.ts` | the gates |

Companion document: `docs/audit/portal-login-template-audit.md` — that one audits the
component **as built**. This one audits the **pattern** against its source material and
names what is still missing to publish it estate-wide.

---

## 1. The handoff census — and three claims it falsifies

`packages/design-system/components/auth/LOGIN-SYSTEM-ANALYSIS.md` §1 was written from a
partial read. Every page has now been opened.

| Page | node | Auth frames | Frame sizes |
|---|---|---|---|
| Login/Signup (master flows) | `0:1` | 26 — Sign In ×4, OTP ×6, Registration ×5, Recovery ×5, SMILE-T ×6 | 1440×960, 1440×952, 375×1122, 375×812 |
| Transgender Portal | `13:401` | **1** — `login-screen`, mobile only | 390×1040 |
| NOS | `2436:15957` | 2 — both `Sign In Pin` | **1440×952** |
| E-Utthan | `4226:36929` | 4 — Sign In D/M, Choose Portal D/M | 1440×960, 375×812 |
| Smile Beggary | `7732:77842` | 2 — Sign In/Mobile, Choose Portal | 375×812 |
| NHAPOA | `5093:18512` | **0** — an embedded OTP modal only | 1440×960 |
| NMBA | `2136:20193` | 5 — Sign In D, Officer Tab D, Picker D, Sign In M, Picker M | 1440×960, 375×812 |
| SCW | `4619:49381` | **0** — 20 SAGE Registration frames | 1440×960…3210 |
| PM-AJAY | `8943:41048` | 0 — hero photography only | — |
| E-Anudaan | `51313:165608` | 0 — application wizards | — |
| Garima Greh | `7394:535` | 3 — Picker D, Sign In M, Picker M | 1440×960, 375×812 |
| Grievance Portal | `50733:44351` | 3 — Admin login entry, OTP Verification ×2 | 1440×1058/1822/1280 |

**Three findings that change the brief.**

1. **SCW has no login screens.** §1 claimed nine, including four Forgot Password frames.
   The page today is a six-step SAGE Registration wizard. The "two competing
   credential-recovery designs" premise in §4 rests on frames that are not there.
2. **NHAPOA has no login screens.** §1 claimed three. There is one embedded OTP
   verification modal inside a grievance flow, and a masthead carrying `Admin Login`
   against the `SAMBAL / संबल` identity.
3. **Transgender Portal has one mobile frame**, not seven, and it is drawn at **390** wide
   — the only 390 in the file.

So **five portals of eleven have no designed desktop login**: SCW, NHAPOA, PM-AJAY,
E-Anudaan, and Garima Greh (which has a mobile Sign In and a picker, but no desktop Sign
In). The template cannot be validated against them; it has to be *specified* for them.

**Two geometry divergences run through the source material and must be resolved before
the master is rebuilt:**

| Axis | Values in the handoff | Where |
|---|---|---|
| Desktop height | **952** vs **960** | 952 on the master's OTP/Registration/Recovery flows and both NOS frames; 960 on every portal page |
| Mobile width×height | **375×812** vs **375×1122** vs **390×1040** | 812 on every portal page; 1122 on the master flow; 390×1040 on Transgender |

The library's master currently draws mobile at **375×1138**, which matches none of them.

---

## 2. The pattern — what is invariant, and what varies

### 2a. The shell (invariant across every portal that has one)

```
┌ AccessibilityBar  40 ────────────────────────────────────────┐
├ Navbar            94 ────────────────────────────────────────┤
│                                                              │
│  ┌ Hero 922 ───────────────────┐  ┌ Form column 518 ──────┐  │
│  │  photograph, full bleed     │  │  gutter 64            │  │
│  │  ┌ Branding 500×606 ─────┐  │  │  content 390          │  │
│  │  │  portal lockup        │  │  │  ← the 10 slots       │  │
│  │  │  ▬ saffron rule 500×4 │  │  │                       │  │
│  │  │  "Justice. Equality.  │  │  │  gutter 64            │  │
│  │  │   Dignity."           │  │  └───────────────────────┘  │
│  └──┴───────────────────────┴──┘                             │
└──────────────────────────────── Row 826, desktop 1440×960 ───┘
```

Mobile drops the photograph entirely, keeps a 150-high navbar, and stacks the form
full-bleed.

### 2b. The form column — ten slots, in this order

1. Role tabs
2. "Log in to your account" + rule
3. DigiLocker CTA (76 high)
4. "or sign in with credentials" divider
5. Auth-method tabs (390×36)
6. Field stack
7. Primary button (390×40)
8. "or continue with" + captcha
9. Consent line
10. Account prompt

Slots 1, 3, 5, 8 and 9 are all optional, and which of them appear is the whole variation
surface. That is the observation the template should be built on: **the order is fixed,
the membership is not.**

### 2c. The axes of variation actually observed

| Axis | Values seen | Where |
|---|---|---|
| Device | Desktop, Mobile | everywhere |
| Role | none · Citizen/Officer · Citizen/Officer/Admin | NMBA has an Officer tab; Grievance has Admin-only |
| Auth method | Password · OTP · PIN · DigiLocker | NOS is PIN-only; Smile Beggary is mobile-OTP-only |
| Method selector | segmented tabs · radio list · none | tabs at ≤2 methods, radio at >2 |
| Portal picker | side sheet (desktop) · bottom sheet (mobile) · absent | NMBA, E-Utthan, Smile Beggary, Garima Greh |
| Hero photograph | present · absent | absent on mobile everywhere |

### 2d. Copy that is inconsistent in the source and needs one decision each

| Thing | Variants in the handoff |
|---|---|
| OTP masking | `+91 98••••2673` (Grievance, master) vs `99******40.` (NMBA) |
| `SIGNING INTO` value | full portal name (E-Utthan desktop) vs truncated (E-Utthan mobile) |
| Primary action label | `Log In` · `Sign In` · `Send OTP` · `Verify and Log In` · `Verify OTP` · `Verify OTP & Submit` · `Get OTP & Track Status` |
| Picker contents | 9 organisations (NMBA, E-Utthan) · 9 with Garima Greh inserted and NHAPOA dropped (Garima Greh) · 4 (Smile Beggary mobile) |
| `E-Anudaan` caption | still "Description Text" on every page |

`ui-restraint-and-copy.md` requires Title Case and a government register; none of these
seven action labels is wrong on those grounds, so the decision is about **which verb the
estate standardises on**, not about compliance. Recommendation: `Log In` for a credential
submit, `Send OTP` for a request, `Verify and Log In` for an OTP submit — three labels,
each naming what the button does.

---

## 3. The SAMAVESH library — where it actually stands

`LOGIN-SYSTEM-ANALYSIS.md` §5b lists twelve components as missing from the library. **Nine
of the twelve now exist in Figma.** That list is stale and should not be used to plan work.

| §5b item | Figma | Code barrel |
|---|---|---|
| OTP Input | ✅ `OTP Input` (8 variants) + `OTP Input / Box` (4), Inputs page | ✅ `OtpInput` |
| Select | ✅ `Select` (15) | ✅ `Select` |
| SideSheet | ✅ `SideSheet` `55435:813` | ✅ `SideSheet` |
| Captcha field | ✅ `Captcha Field` (3) | ✅ `CaptchaField` |
| PasswordStrengthMeter | ✅ (5) | ✅ |
| SSO Button | ✅ `Auth / SSOButton` `55438:727` | ✅ `SSOButton` |
| MaskedContactRow | ✅ `55437:718` | ✅ |
| ResendTimer | ✅ `55437:707` | ✅ |
| Stepper | ✅ 5 sets on the Stepper page | ✅ |
| SigningIntoBar | ✅ `55439:749` | ✅ |
| **OrganisationCard** | ✅ `Auth / OrganisationCard` `55439:730` | ❌ **absent** |
| Brand assets | ⚠️ `Portal Hero` `55481:2601` — **4 of 11 portals** | ❌ absent |

Plus three organisms in Figma with no code counterpart at all:

| Figma | Node | Code |
|---|---|---|
| `Auth / PortalAuthShell` | `55450:1134` | exists as **`PortalLoginShell`** — same organism, two names |
| `Auth / AuthFormCard` | `55447:923` | ❌ absent |
| `Auth / PortalList` | `55444:709` (352×984) | ❌ absent |

`RoleTabs` (`55384:718`) and `AuthSelector` (`55386:725`) no longer exist in the library,
and are absent from the barrel. That is consistent with their recorded retirement; no
action.

---

## 4. The gaps — what stands between here and a publishable pattern

Ordered by what blocks what, not by size.

### G1 — The master's `Step` axis conflates two different things (blocking)

`PortalLoginTemplate` `55397:1364` is `Device × Step`, 8 variants, with `Step` taking
`Credentials · OTP · Reset · Success`.

`Credentials` and `OTP` are **auth methods within sign-in**. `Reset` and `Success` are
**steps of credential recovery**, a separate five-screen flow. Putting them on one axis
means a designer picking "Reset" gets a variant that is not a sign-in screen at all, from
a set called Login Template.

**The handoff's real axes are `Device × Auth Method`**, with recovery, registration and
OTP verification as their own flows. Fixing this is a rebuild of the master, and
everything below depends on it.

### G2 — Four steps modelled, five drawn (blocking G1's fix)

The library models 4 steps for both Registration and Credential Recovery. The handoff
draws **5** for each. And the handoff shows **no step indicator at all** on those flows,
while the library has a full `Stepper` page with five sets. Either the flows gain a
stepper (a design decision, and a good one for a five-step government form) or the
library stops claiming steps it does not render.

### G3 — The page violates `ds-documentation-standard.md` §1

Current top-level order on the `Portal Login Template` page:

```
1 · Template
PortalLoginTemplate — Documentation      ← loose, and in the wrong place
4 · Portal hero photography
3 · Parts
2 · Organisms
```

The rule requires: Documentation frame **first**, Component record **second**, then
numbered sections **in order from 1**. Three violations at once — sections out of order,
the Documentation frame sitting between them, and no Component record frame at all. The
smaller `Portal Card` and `Tabs` pages both have one; the largest component in the library
does not.

### G4 — `Portal Hero` covers 4 portals of 11

`55481:2601` carries SCW, NMBA, PM-AJAY and NHAPOA. Eleven portals have a login, and every
picker lists nine or ten organisations. Seven portals have no hero photograph in the
library, so seven login screens cannot be composed from it.

**This needs artwork, not a script.** It is the one gap on this list a human has to
supply.

### G5 — `Auth / PortalList` has no Device axis

It is a loose COMPONENT at 352×984, which is correct as the inner list of a 432-wide
desktop side sheet. The handoff also draws it as a **mobile bottom sheet**. One component
cannot be both; it needs a `Device` variant axis.

(`Auth / OrDivider` and `Auth / ConsentLine` are also loose components rather than sets.
That is fine — neither has an axis of variation.)

### G6 — Three Figma organisms have no code

`OrganisationCard`, `PortalList` and `AuthFormCard` exist in Figma and nowhere in
`packages/design-system/index.ts`. A designer can compose a portal picker in Figma that no
developer can build from the DS.

### G7 — `PortalAuthShell` vs `PortalLoginShell`

The same organism under two names. `figma-code-sync.md` requires the master, the code and
the documentation to say the same thing; here they cannot, because they do not share a
noun. Rename Figma to `PortalLoginShell` — the code name is the one with consumers
(4 of 10 login routes) and the one Code Connect would map.

### G8 — `check:figma-docs` is green and blind

`tools/figma-doc-parity/claims.json` holds 26 pinned nodes. **None is a `PortalLogin`
node.** So the gate passes vacuously for the biggest component in the library: every
number and behavioural claim on its documentation canvas is unpinned and free to rot.
`figma-code-sync.md` §2 requires those pins.

### G9 — No login route in the accessibility suite

`e2e/a11y/axe.spec.ts` covers 15 routes; not one is a login page. The component whose
`A11yChecklist` honestly marks WCAG 3.3.8 as `partial` has no automated coverage at all.

### G10 — Adoption is zero for the template, 40% for the shell

From the companion audit: `PortalLoginTemplate` is used on **0 of 10** login routes;
`PortalLoginShell` on 4; six routes are bespoke, totalling 1,189 lines. Publishing a
better pattern changes nothing until the routes adopt it.

### G11 — Mobile geometry matches nothing

The master's mobile variants are **375×1138**. The handoff draws 375×812 (portals),
375×1122 (master flow) and 390×1040 (Transgender). Pick one and state it: **375×812** is
the majority and the standard iPhone SE/8 frame, with content hugging below it.

---

## 5. What "cleanly finished" requires

Nine things, in dependency order. Items 1–3 are decisions only you can make; 4–9 are
build work that follows from them.

| # | What | Who | Blocks |
|---|---|---|---|
| 1 | **Confirm the axes**: `Device × Auth Method`, with Recovery / Registration / OTP as separate flows, not steps of login | you | everything |
| 2 | **Settle the geometry**: desktop 1440×960, mobile 375×812 | you | the master rebuild |
| 3 | **Settle the copy**: three action labels, one OTP mask format, one picker roster | you | every screen |
| 4 | Rebuild the master on the confirmed axes; move it inside a numbered section | build | 5–9 |
| 5 | Add `Device` to `PortalList`; build `PortalPicker` and `OtpVerify` sets | build | — |
| 6 | Build `Registration` (5) and `CredentialRecovery` (5) with a `Stepper` | build | — |
| 7 | Rename `PortalAuthShell` → `PortalLoginShell`; add `OrganisationCard`, `PortalList`, `AuthFormCard` to the code barrel with stories and docs pages | build | G6, G7 |
| 8 | Rewrite the page to the §1 order; add the `— Component record` frame; pin its claims in `claims.json` | build | G3, G8 |
| 9 | Add a login route to `e2e/a11y/axe.spec.ts`; adopt the template on at least one live route | build | G9, G10 |

**Seven portal hero photographs (G4) are outside all of this.** No amount of build work
produces them; they have to come from the organisations.

---

## 6. Corrections to earlier records

| Record | Claim | Correction |
|---|---|---|
| `LOGIN-SYSTEM-ANALYSIS.md` §1 | SCW has 9 login screens | It has 0. The page is a SAGE Registration wizard. |
| `LOGIN-SYSTEM-ANALYSIS.md` §1 | NHAPOA has 3 login screens | It has 0. One embedded OTP modal. |
| `LOGIN-SYSTEM-ANALYSIS.md` §1 | Transgender has 7 screens | It has 1, mobile, at 390×1040. |
| `LOGIN-SYSTEM-ANALYSIS.md` §4 | Two competing credential-recovery designs | Unverifiable — the SCW frames it cites are not in the file. |
| `LOGIN-SYSTEM-ANALYSIS.md` §5b | 12 components missing from the library | 9 of the 12 now exist. |
| This session, first pass | `CaptchaField` is not exported from the barrel | It **is** exported. The grep used `\bCaptcha\b`, which cannot match `CaptchaField`. |
| This session, first pass | `Auth / AuthFormCard` has a duplicate boolean property | It does not. The properties are `Show role tabs#55447:5` and `Show method tabs#55447:15` — distinct and correctly named. A truncated first read rendered both as "Show tabs". |
