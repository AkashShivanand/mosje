# SAMAVESH login system — handoff analysis & templatisation plan

Source: **MoSJE Portal — Handoff** (`evmNmlK8g4VYwJVu2FwSGV`), read in full on 2026-08-16.
Target: **SAMAVESH Design System** (`3FF5l0SMNIwdpZrKkeyPTm`).

This supersedes the "single page `Login/Signup`, 8 flows" reading recorded in `FIGMA-SPEC.md` §9.
The file has **12 pages**, and **10 of them carry login UI** — 69 auth screens in total, not 25.
The designer's own index frame counts only the 25 on the master page.

---

## 1. Where the login UI actually lives

| # | Page | Auth surfaces | Screens |
|---|---|---|---|
| 0 | `Login/Signup` (master) | 01 Sign In (D+M, form + picker) · 02 OTP Flow · 03 Registration · 04 Credential Recovery · SMILE-Transgender ×3 audiences | **26** |
| 1 | `Transgender Portal` | `03 — LOGIN & AUTHENTICATION`: Citizen / Admin / Garima Greh × 2 states, + a 390×968 mobile `login-screen` | **7** |
| 2 | `NOS` | `Sign in`: 2 × `Sign In Pin` (each embedding a 375 mobile landing screen) | **2** |
| 3 | `E-Utthan` | Sign In D/M · Choose Portal D/M | **4** |
| 4 | `NMBA` | Sign In D · Officer Tab D · Choose Portal D · Sign In M · Choose Portal M | **5** |
| 5 | `SCW` | Sign In D · Officer Tab D · Choose Portal D · **Forgot Password ×4** · Sign In M · Choose Portal M | **9** |
| 6 | `NHAPOA` | Sign In D · Choose Portal D ×2 (each embedding a Sign In) | **3** |
| 7 | `PM-AJAY` | — (hero photo only) | 0 |
| 8 | `E-Anudaan` | — (no auth designed; the portal's login exists in code only) | 0 |
| 9 | `Smile Beggary` | `Sign In [Updated]`: Implementing Agency ×3 · Super Admin · Choose Portal · Mobile ×2 | **7** |
| 10 | `Garima Greh` | Choose Portal D · Sign In M · Choose Portal M | **3** |
| 11 | `Grievence Portal` | Admin login entry · OTP Verification ×2 | **3** |

Plus, on the master page: **5 portal hero photographs**, **6 portal logos**, and a
`Portal List — Reference Component` (the picker's 9 organisation cards).

**Two portals have no designed login** (PM-AJAY, E-Anudaan) and **two carry an identity in
flux** (NHAPOA signs into "SAMBAL (NHAA 2.0)"; its own picker lists both `SAMBAL` and `NHAA`).

---

## 2. The invariant shell — identical on every one of the 69 screens

Desktop **1440 × 960**:

```
AccessibilityBar (Device=Desktop)                             40
Navbar / masthead — BETA badge · GoI · Ministry · Department
                  · Digital India · SAMAVESH                  94   } 134
Row 1440 × 826
├── Hero            922      full-bleed photo + navy scrim
│   ├── Branding    500×606  roundel · SAMAVESH wordmark · देवनागरी
│   │                        saffron rule 500×4 · "Justice. Equality. Dignity."
│   │                        · 500-wide description + arrow-right
│   └── Signing-into bar     logo 44 · "SIGNING INTO" · <portal name> · [Change ⇄] 99×32
└── Form column     518      content 390, gutters 64
```

Mobile **375 × 1138**: navbar 150, Row 988, **no photograph** — a SAMAVESH brand strip
replaces the hero. Form content stays 375-wide.

The 390-wide form column is the only thing that changes between portals. Its slot order is
fixed even when items are absent:

1. Role tabs · 2. `Log in to your account` + rule · 3. DigiLocker CTA (76px) ·
4. `or sign in with credentials` divider · 5. Auth-method tabs (390×36) ·
6. Field stack · 7. Primary button (390×40) · 8. `or continue with` + captcha strip ·
9. Consent line · 10. `Don't have an account?` + Create Account

---

## 3. The conditions — 15 axes of variation

This is the analytical core. Everything the 69 screens do is a point in this space.

### Portal-context axes (set once per portal)

| # | Axis | Observed values |
|---|---|---|
| 1 | **Portal identity** | hero photo · logo · name · tagline · `SIGNING INTO` copy — 11 portals |
| 2 | **Device** | Desktop 1440 · Mobile 375. **Tablet 768–1024 is not designed** (designer's own issue; default to mobile below 1024) |

### Audience axes

| # | Axis | Observed values |
|---|---|---|
| 3 | **Role tab count** | **0** (E-Utthan, NHAPOA, NOS, Grievance) · **2** (master `Citizen / Beneficiary` + `Officer / Admin`; SCW `Citizen` + `Admin`; NMBA `Admin` + `Patient Monitoring`) · **3** (SMILE-T `Citizen` + `Admin` + `Garima Greh`) |
| 4 | **Secondary role select** | `Your role` select present (master, SCW citizen, Beggary admin) · absent |

### Credential axes

| # | Axis | Observed values |
|---|---|---|
| 5 | **DigiLocker CTA** | shown · hidden. **Rule from the designer: hide when the Admin/Officer tab is selected.** Absent entirely on NHAPOA, E-Utthan, NMBA |
| 6 | **Auth-method selector** | none · underline tabs `Login with Password` \| `Login with OTP` |
| 7 | **Identifier label** | **8 distinct**: `Mobile Number` · `Email` · `Email/Username` · `User ID or Email` · `Username` · `Project Id` (e.g. IRCA001) · `Email or Mobile Number` · `Registered Email or Phone Number` |
| 8 | **Security check** | none · SMILE-T Garima Greh's `Security check / Enter the characters` · master's image `or continue with` strip |
| 9 | **Primary action label** | `Log In` · `Sign In` · `Send OTP` · `Verify and Log In` · `Verify OTP` · `Continue` · `Complete Profile` · `Reset Password` |

### Affordance axes

| # | Axis | Observed values |
|---|---|---|
| 10 | **Recovery link** | `Forgot Password?` — password mode only |
| 11 | **Registration prompt** | none · `Don't have an account? Create Account` · **SCW's dual** `Register as Volunteer \| SAGE Organisation` · Beggary's cross-link `Implementing Agency? Sign in with OTP` |

### State axes

| # | Axis | Observed values |
|---|---|---|
| 12 | **Form state** | Empty · Partial · Ready (button enabled) · **Error** (`Incorrect Password`) · Success |
| 13 | **OTP target masking** | phone `+91 98••••1234`, `99••••40`, `+91 •••••• 7899` · email `a•••••••s@gmail.com` |
| 14 | **Resend state** | cooldown (`Resend OTP in: 00:23` / `0:30` / `45`) · active (`Resend OTP` / `Didn't receive it? Resend OTP`). **On the error state the resend link is immediately active — it bypasses the 60s cooldown.** |
| 15 | **Portal picker** | closed · open (Desktop side sheet 432 with a 1440 scrim · Mobile bottom sheet 375) |

**Motion spec carried in the file:** OTP boxes shake on error — 400ms ease, ±4px translate.

---

## 4. The five journeys

| | Journey | Steps | Where |
|---|---|---|---|
| **A** | Returning user sign-in | password \| OTP \| DigiLocker | every portal |
| **B** | Portal selection | `Change` → picker → context updates → back | 8 portals |
| **C** | Registration | Create Account → Send OTP → Enter OTP → Create Password → Complete Profile | master only, **desktop only** |
| **D** | Credential recovery | **two competing designs** — master's 5 steps vs SCW's 4-step `Forgot Password` | master + SCW |
| **E** | OTP verification | masked target → 6 boxes → resend → verify | **shared sub-flow of A, C and D** |

Journey **E** is the single highest-value component in the whole file: it appears in
A, C and D, in three different portals, with four different copy treatments.

---

## 5. Reusable, missing, and unique

### 5a. Already in SAMAVESH — reuse, do not rebuild

`AccessibilityBar` · `Navbar` / `BrandLockup` · `Divider` · `Input Field` · `Button` ·
`Link` · `Tabs` / `.tab/primary` · `Default Chips` · `Modal / Backdrop` ·
`Footer — Bottom Strip` · `close-button` · Material Symbols icon set ·
Radius / Space / Colour / Type tokens · `elevation/dropdown` · `elevation/modal`

Also already built for this problem, in the library's `Portal Login Template` page:
`❖ PortalLoginTemplate` (`55397:1364`), `❖ RoleTabs` (`55384:718`),
`❖ AuthSelector` (`55386:725`), and the WIP parity shell `55412:1799`.

### 5b. In the handoff but **missing from SAMAVESH** — the build list

| | Component | Why it is needed |
|---|---|---|
| 1 | **OTP Input** (6 boxes) | journey E — used 12+ times. Exists only in *MoSJE Portal DS* as `OTP-input-container` |
| 2 | **Select** | the `Your role` field. No true Select in SAMAVESH — currently hand-built |
| 3 | **SideSheet** | the portal picker (432 desktop / bottom sheet mobile). Only `Modal / Backdrop` exists |
| 4 | **Captcha / Security check field** | SMILE-T Garima Greh |
| 5 | **PasswordStrengthMeter** | SCW `Medium Strength`; spec says zxcvbn 0–4 → Weak/Fair/Good/Strong |
| 6 | **SSO Button** (DigiLocker) | 76px CTA with sub-label `Secured Government Login` |
| 7 | **OrganisationCard** | the picker's 9 rows, 1-line and 2-line heights |
| 8 | **MaskedContactRow** | `OTP sent to +91 98••••1234 · Edit` |
| 9 | **ResendTimer** | cooldown vs active |
| 10 | **Stepper** | Registration and Recovery are 5 steps with **no step indicator at all** — a design gap, not just a component gap |
| 11 | **SigningIntoBar** | logo · label · portal name · `Change` |
| 12 | **Brand assets as components** | SAMAVESH roundel, wordmark, DigiLocker mark |

### 5c. Genuinely unique — must **not** be templatised

Portal hero photographs · portal logos · portal names and taglines · SCW's dual-registration
split · NMBA's `Project Id` + `Patient Monitoring` tab · Beggary's `Implementing Agency`
cross-link. These become **text properties, instance swaps, or asset choices** — never variants.

---

## 6. Defects found — flagged for human decision

**Ours to fix in the library:**

1. **The `Forgot Password?` link is broken in the master template.** Node `8774:24797` is a
   `Link` instance at 102×86 — a *navigational card* with a 48×48 icon container and a text
   node 1px wide — sitting on top of the Password field. It is visible in the render. It
   should be a plain text link, not `Link`.
2. **The SAMAVESH wordmark is ~100 individual TEXT nodes per screen** (`"S"`, `"i"`, `"n"`,
   `"g"`, `"l"`, `"e"` …) — a traced logo pasted as letters, repeated across ~69 frames.
3. **Token vocabulary mismatch.** The handoff binds to **MoSJE Portal DS**
   (`Color Styles/Primary/Source`, `Spacing/spacing-md`, `Border Radius/radius-lg`,
   `Typography/font-size/title-2`), **not** SAMAVESH (`bg/*`, `ref/space/*`, `shape/*`,
   `Body/body-1`). Both libraries are subscribed to the file. A translation table is required
   before anything is rebuilt — see §8.
4. **59% of fills are unbound.** On the canonical desktop screen, 317 of 537 fill-bearing
   nodes carry raw values. 93 distinct variables cover 757 bindings across 636 nodes.
5. **Two competing recovery designs** (master 5-step vs SCW 4-step). They must converge before
   either is templatised.
6. **The portal picker list differs between portals.** NHAPOA's lists `SAMBAL` and `NHAA`
   where the master lists `E-Anudaan` and `NHAPOA`.
7. **Beggary's Choose Portal screen shows `SIGNING INTO / SCW`** — a copy-paste error.
8. **NHAPOA has three byte-identical `Login / Sign In / Desktop` frames.**

**The designer's own open issues, transcribed from the index frame:**

- 🔴 E-Anudaan tagline reads `Description Text` — real copy needed before launch.
- 🔴 Recovery Step 5 heading reads `PIN Updated!` — must be `Password Updated!`.
- 🟠 `Hero — SMILE-Beggary` is named `TG`, same as SMILE-Transgender — verify the photo.
- 🟠 Registration + Recovery have **no mobile design** — citizens register on phones.
- 🟠 NOS, NHAPOA, PM-AJAY, E-Utthaan hero frames sit outside section 05.
- 🟡 Tablet breakpoint not designed.
- 🟡 NISD logo is not in the portal registry.
- 🟡 **Orange portal names `#F97316` on white measure 3.09:1 — fails WCAG AA.** Darken to
  `#C2410C`. (Note: SAMAVESH's own AA-safe saffron ink is `bg/brand/secondary/bolder`
  = `#c34700`; bind to that rather than minting `#C2410C`.)

---

## 7. The templatisation architecture

The governing decision: **one page shell + a slot-based form composer**, not a mega variant
set. A naïve cut of the 15 axes is tens of thousands of variants; §4 of
`component-authoring.md` caps a set at ~30.

```
Tier 4  PortalLoginTemplate         assembled examples — the 6 canonical journeys
Tier 3  PortalAuthShell  ·  AuthFormCard  ·  PortalPicker
Tier 2  auth molecules — 8 new sets
Tier 1  atoms — 6 new sets  +  11 existing SAMAVESH sets
Tier 0  assets — hero photos, portal logos, brand marks
```

### Tier 4 — `PortalLoginTemplate`

**Update `55397:1364` in place. Never fork the key** (`component-authoring.md` §11) — the
repo's `portal-login-template.figma.ts` and every downstream instance are linked to it.

Re-cut the axes from the invented `Device × Auth Method (5)` = 10 to:

| Property | Type | Values |
|---|---|---|
| `Device` | VARIANT | `Mobile` · `Desktop` |
| `Step` | VARIANT | `Credentials` · `OTP` · `Success` |
| `Portal name` / `Portal tagline` | TEXT | → per-portal config |
| `Hero image` / `Portal logo` | INSTANCE_SWAP | → Tier 0 assets |
| `Role tabs` | INSTANCE_SWAP | → `RoleTabs` (incl. a `None` variant) |
| `Show DigiLocker` | BOOLEAN | hide on Officer/Admin |
| `Auth method tabs` | INSTANCE_SWAP | → `AuthSelector` (incl. `None`) |
| `Fields` | INSTANCE_SWAP | → field-stack sets |
| `Primary action` | TEXT | 8 observed labels |
| `Account prompt` | INSTANCE_SWAP | `None` · `Single` · `Dual` |

**6 variants.** Ordering per §10: `Device` ascends `Mobile → Desktop`; `Step` follows the
journey `Credentials → OTP → Success`.

### Tier 3

- **`PortalAuthShell`** — `Device` (2). Chrome + hero + signing-into bar + an empty form slot.
  Mobile swaps the photograph for the brand strip.
- **`AuthFormCard`** — the 390-wide composer, `Step` (4): `Credentials` · `OTP` · `Reset` ·
  `Success`. Every §3 axis above is a property on this, not a variant.
- **`PortalPicker`** — `Device` (2): desktop side sheet 432 + scrim, mobile bottom sheet.
  Holds filter chips, the card list, and the paging indicators.

### Tier 2 — new auth molecules

`Auth / SSOButton` · `Auth / OrDivider` · `Auth / MaskedContactRow` · `Auth / ResendTimer` ·
`Auth / ConsentLine` · `Auth / AccountPrompt` · `Auth / OrganisationCard` ·
`Auth / SigningIntoBar`

Plus re-cut the two that exist: `RoleTabs` gains a `None` variant and a 3-tab variant
(SMILE-T); `AuthSelector` keeps `Underline Tabs` as default and gains `None`.

### Tier 1 — new atoms

`Select` · `OTP Input` · `Captcha Field` · `PasswordStrengthMeter` · `SideSheet` · `Stepper`

These are **general-purpose** and belong in the main library, not the auth namespace — the
estate needs a `Select` regardless of login.

### Tier 0 — assets

`Portal Hero / <slug>` (8) · `Portal Logo / <slug>` (11) · `Brand / SAMAVESH Roundel` ·
`Brand / SAMAVESH Wordmark` · `Brand / DigiLocker`. Ten were already transferred into
`00 · Assets — portal heroes & logos` (`55410:1825`); the rest are listed as missing in
`FIGMA-SPEC.md` §9.

---

## 8. Token translation — MoSJE Portal DS → SAMAVESH

Nothing is rebuilt until this table is agreed. Bind **by resolved value, not by name**
(`documentation-ds-linkage.md`) — a name that reads right can resolve wrong.

| Handoff collection | Example | SAMAVESH target |
|---|---|---|
| `Color Styles` | `Primary/Source`, `Primary/50`, `Neutral/0 - White`, `Stroke/200`, `Text/Dark`, `Text/Light` | `bg|text|border/*` roles — resolve each hex first |
| `Spacing` | `spacing-xxs … spacing-7xl` | `ref/space/*`, then the semantic `padding/*`, `stack/*`, `inline/*` |
| `Border Radius` | `radius-none … radius-3xl` | `shape/*`, `control/radius` |
| `Typography` | `font-size/title-2`, `line-height/label-1` | the 21 published text styles (`Body/*`, `Title/*`, `Label/*`, `Headline/*`) |
| `Text Styles` | `Font Family/Headings`, `Font Weights/noto-sans-0` | published styles — never hand-set |

New tokens this work needs (add and flag, `component-authoring.md` §3):
`layout/login/hero/width` = 922 and `layout/login/panel/width` = 518 **already exist**;
add `layout/login/content/width` = 390 and `layout/otp/box/size`.

---

## 9. The two deliverables that make this reusable

### 9a. For designers — the Portal Configuration table

One row per portal, naming exactly which properties to set. This is what turns "a template"
into "a designer can build a new portal's login in ten minutes".

| Portal | Role tabs | DigiLocker | Method tabs | Identifier | Role select | Primary | Account prompt |
|---|---|---|---|---|---|---|---|
| *Master / default* | Citizen / Beneficiary · Officer / Admin | ✓ (citizen only) | — | Mobile Number | ✓ | Log In | Single |
| SCW | Citizen · Admin | ✓ (citizen only) | — | Mobile Number | ✓ (citizen) | Log In | **Dual** |
| SMILE-Transgender | Citizen · Admin · Garima Greh | ✓ (citizen only) | — | Email | — | Send OTP | Single |
| SMILE-Beggary | — | — | — | Email or Mobile / Mobile (IA) | ✓ (admin) | Log In / Send OTP | Cross-link |
| NMBA | Admin · Patient Monitoring | — | — | **Project Id** | — | Send OTP | — |
| E-Utthaan | — | — | — | User ID or Email | — | Log In | Single |
| NHAPOA / SAMBAL | — | — | Password \| OTP | Username | — | Log In | Single |
| NOS | — | ✓ | Password \| OTP | Email/Username | — | Sign In | Single |
| Garima Greh | (inherits SMILE-T) | ✓ | — | Email | — | Send OTP | Single |
| Grievance | — | — | — | — | — | — | — |
| PM-AJAY · E-Anudaan | **not designed** | | | | | | |

### 9b. For agents — the MCP contract (`component-authoring.md` §12)

Every component above ships with:

- a **`<name>.figma.ts` Code Connect template** beside the code component, mapping **every**
  Figma property exhaustively;
- a **rules-bearing component description** — numbered prohibitions, not a tagline. The four
  that must be written down because they are not inferable from geometry:
  1. *Hide DigiLocker when the Officer/Admin tab is active.* Admins never use DigiLocker.
  2. *The resend link is active immediately on the error state* — it bypasses the 60s cooldown.
  3. *The identifier field's label is a property, not a variant* — there are 8 values.
  4. *Never remove the consent line or the skip link* — GIGW/WCAG affordances.

---

## 10. Phasing

**Phase 0 — decisions (blocking).** Converge the two recovery designs · fix the role-tab
taxonomy · settle NHAPOA vs SAMBAL vs NHAA · agree one canonical portal-picker list ·
rule on the tablet breakpoint · agree the §8 token map.

**Phase 1 — foundations.** Tier 0 assets (incl. the wordmark as one component) + the six
Tier 1 atoms. Each authored to `component-authoring.md`: zero raw values, AA-verified.

**Phase 2 — auth molecules.** The eight Tier 2 sets + the re-cut of `RoleTabs` and
`AuthSelector`.

**Phase 3 — organisms.** `PortalAuthShell`, `AuthFormCard`, `PortalPicker`; fold the WIP
parity shell `55412:1799` in and retire it.

**Phase 4 — the template.** Update `55397:1364` **in place** to `Device × Step` = 6.
Build the mobile shell (412) that is still outstanding.

**Phase 5 — contract & proof.** Documentation canvas in the house style
(`figma-documentation-style.md`) · component descriptions · `.figma.ts` templates ·
the Portal Configuration table as a Figma page · re-run the linkage audit to zero unbound ·
`npm run check:ds-linkage`, `check:storybook`, `check:design-context`.

**Phase 6 — code mirror.** `packages/design-system/components/auth/` gains the same
inventory, Storybook stories, and `design.md` entries, per `.claude/rules/design-system.md`.

---

## 11. What is deliberately not in scope

Building any of it. This document is the analysis and the plan; nothing has been created in
either Figma file. Phase 0's decisions are genuinely the human's to make — three of them
(the recovery convergence, the portal naming, the tab taxonomy) change what gets built, not
just how.
