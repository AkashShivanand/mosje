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

## 11. Build record — Phases 0–4 shipped (2026-08-17)

Phases 0–4 are **built in the SAMAVESH library**. Phase 5 (documentation canvas, Code
Connect, full audit) and Phase 6 (code mirror) are outstanding.

### Phase 0 — the six decisions, taken

| | Decision | Rationale |
|---|---|---|
| **D1** | Recovery and registration converge on **4 steps**, not 5 | The master's Steps 2 and 3 are the *same screen* in two resend states. A state is not a step. Also fixes the `PIN Updated!` defect — the heading is now `Password Reset Successful!`. |
| **D2** | One audience taxonomy: **Citizen · Officer · Organisation** | NMBA's "Patient Monitoring", SMILE-T's "Garima Greh" and SCW's "SAGE Organisation" are all the Organisation tab, renamed via label properties. Five bespoke taxonomies collapse to one. |
| **D3** | `nhapoa` is the slug; **`SAMBAL (NHAA 2.0)` is the display name** | Every other portal shows the scheme name, not the acronym. Reversible — it is a text property. |
| **D4** | The canonical picker is the master's **nine portals**, alphabetical | E-Anudaan's tagline becomes "Grant-in-Aid for Voluntary Organisations". The failing orange (`#F97316`, 3.09:1) is dropped for `text/neutral/base`. |
| **D5** | **Device = Mobile \| Desktop only**; tablet uses Mobile | The handoff never designed tablet, and a 922/518 split does not survive below 1024. Recorded as a deliberate divergence, not an omission. |
| **D6** | Everything binds to SAMAVESH semantics | Zero MoSJE Portal DS references in anything built. |

### What was built

**Corrections to §5b found during discovery:** `Stepper`, `Dropdown` and `ProgressBar`
already existed — `Dropdown` is a *menu*, not a form Select, so Select was still needed.
The build list dropped from 12 components to 11.

| Tier | Component | Node | Variants |
|---|---|---|---|
| 1 | `OTP Input / Box` | `55427:704` | 4 states |
| 1 | `OTP Input` | `55427:34365` | Length 4/6 × 4 states = 8 |
| 1 | `Select` | `55430:34472` | Size 3 × State 5 = 15 |
| 1 | `PasswordStrengthMeter` | `55432:795` | 5 |
| 1 | `Captcha Field` | `55434:889` | 3 |
| 1 | `SideSheet` | `55435:813` | 2 + `Content` slot |
| 2 | `Auth / OrDivider` | `55437:695` | — |
| 2 | `Auth / ConsentLine` | `55437:699` | — |
| 2 | `Auth / ResendTimer` | `55437:707` | 2 |
| 2 | `Auth / MaskedContactRow` | `55437:718` | 2 |
| 2 | `Auth / SSOButton` | `55438:727` | 4 |
| 2 | `Auth / AccountPrompt` | `55438:739` | 2 |
| 2 | `Auth / OrganisationCard` | `55439:730` | 2 |
| 2 | `Auth / SigningIntoBar` | `55439:749` | 2 tones |
| 2 | `Auth / PortalList` | `55444:709` | the canonical 9 |
| 3 | `Auth / AuthFormCard` | `55447:923` | 4 steps |
| 3 | `Auth / PortalAuthShell` | `55450:1134` | 2 devices |
| 4 | **`PortalLoginTemplate`** | **`55397:1364`** | **8 — re-cut IN PLACE, key preserved** |

`RoleTabs` (`55384:718`) was extended in place from 2 variants to 5 (`Tabs` 2/3 ×
`Active` Citizen/Officer/Organisation) with per-tab label properties. `PortalPicker` needed
no component of its own: it is `SideSheet(Content = PortalList)`.

New pages: **Verification** (`55427:695`) and **Portal Login Parts** (`55436:858`).

**Three tokens added** (§3 add-and-flag):
`text/neutral/placeholder` (= `#6f757d`; nothing semantic resolved to it, and
`text/neutral/subtle` is dark enough to read as a real value) ·
`layout/login/content/width` (390) · `layout/login/panel/gutter` (64 — the space scale
jumps 32 → 120).

### The invented axis is retired

`PortalLoginTemplate` went from `Device (2) × Auth Method (5)` = 10 to
`Device (2) × Step (4)` = 8. `Password + Captcha`, `Mobile OTP`, `DigiLocker SSO`,
`NGO DARPAN ID` and `Aadhaar OTP` are gone: the handoff has two credential modes, DigiLocker
is a CTA not a form mode, and no DARPAN or Aadhaar screen exists anywhere in the file. The
four documentation instances that pointed at the old variants were retargeted, not orphaned.

### Library defects found while building — flagged, not silently worked around

1. **`Input Field`'s `Size=Default, State=Empty` variant does not expose its `Label Text`
   property**, though the set declares it. Field labels are direct text overrides until fixed.
2. **`Link` has no text property at all** — only `Size` and `State`. Same workaround.
3. **`Chip` has no label property** — the filter chips set their text node directly.
4. **`Input Field` binds primitives** (`color/neutralScale/*`), not semantic roles. The new
   components bind semantics; the two agree by resolved value today, but they will drift.
5. **`Button` has no Inverse tone**, so the `Change` control inside `SigningIntoBar` is built
   inline rather than instanced. Replace it if an Inverse sub-type ever lands.

### Figma API behaviours worth writing down

- **`setBoundVariableForPaint` keeps the literal colour you passed as the fallback.** Passing
  `{0,0,0}` produces a paint that is *bound and correct* in the inspector but renders **black**
  wherever the binding does not resolve at render time. Always pass the resolved value.
- **Paint opacity is lost when set in the same assignment as the binding**, and it does **not
  propagate from a component to its instances**. The hero scrim needs a second-pass assignment
  on the master *and* on each Desktop variant.
- **`resize()` resets `primaryAxisSizingMode`/`counterAxisSizingMode` to FIXED.** Call it
  before setting sizing modes, never after — otherwise variants collapse to the resize height.
- **Reusing one paint object across many nodes drops the binding.** Build a fresh paint per node.

## 12. Phases 5 and 6 (2026-08-17)

### Phase 5 — audit, descriptions, Code Connect

**Tokenisation audit — zero unbound in everything authored here.**

| Surface | Fills | Strokes | Padding | Gaps | Radii | Unstyled text |
|---|---|---|---|---|---|---|
| Verification | 147 / **0** | 19 / **0** | 92 / **0** | 94 / **0** | 174 / **0** | **0** |
| Portal Login Parts | 59 / **0** | 8 / **0** | 48 / **0** | 34 / **0** | 48 / **0** | **0** |
| Portal Login Template | 360 / 1 | 19 / 2 | 336 / **0** | 130 / **0** | 304 / 8 | **0** |

Two exclusions, both stated rather than assumed: **COMPONENT_SET wrapper frames** and
**Figma SECTIONs** carry their own default fill, stroke and 2px radius, and neither is ever
instanced — they are canvas furniture for laying variants out. Every one of the template
page's 11 remaining raw values is on one of those two SECTIONs. **INSTANCE roots** are
excluded too: their geometry belongs to the component's own page, which is where it is
audited.

The only declared paint-opacity exemptions are the hero scrim at 0.62 and two 0.40 paints on
the older WIP parity shell. Paint opacity is the one property Figma cannot bind, and each
node is named to say so.

**Descriptions.** All 20 component sets carry a rules-bearing description — numbered
prohibitions and their consequences, not a tagline — so an agent reading Dev Mode gets the
things geometry cannot tell it.

**Code Connect.** `portal-login-template.figma.ts` rewritten for `Device × Step` (its old
copy still documented the retired five-method axis), and `auth-parts.figma.ts` added for
`SigningIntoBar`. Both remain **authored in anticipation** — Code Connect still cannot be
published on this plan.

**Not done:** the full house-style documentation canvas for all 17 components, and the portal
configuration table as a Figma page. That is the single largest remaining piece.

### Phase 6 — the code mirror

**The code carried the same fiction, and it is gone.** `PortalAuthMode` was
`password | otp | digilocker | darpan | aadhaar`; it is now `password | otp | digilocker`.
The two invented render blocks, their state, and `LoginSubmitPayload.credentials.darpanId` /
`.aadhaarNo` were removed from `portal-login-template.tsx`. Nothing in the estate consumed it
— only Storybook — so this broke no portal.

**Discovery correction:** `OtpInput`, `Select`, `Chip`, `Stepper` and `SideSheet` **already
existed in code**. Only the genuinely-missing pieces were built.

| Added | Where |
|---|---|
| `PasswordStrengthMeter`, `strengthFromScore` | `components/forms/password-strength-meter.tsx` |
| `CaptchaField` | `components/forms/captcha-field.tsx` |
| `AuthDivider`, `ConsentLine`, `ResendTimer`, `MaskedContactRow`, `SSOButton`, `AccountPrompt`, `SigningIntoBar` | `components/auth/auth-parts.tsx` |
| `PortalAudience`, `PortalRoleTab.audience` | `components/auth/types.ts` |

**Token drift closed.** `layout/login/*` had existed in Figma since 16 August and in code not
at all. All four now live in `semantic.json`, plus `text/neutral/subtler` in the system-token
generator. Both sides were **read back live** before the parity record moved — Space 97
payload / 104 library, Color 473 / 479, both gaps unchanged and fully explained.

Two decisions the guardrails forced, and both were right:

- **The naming grammar rejected `text/neutral/placeholder`.** `placeholder` is neither a
  prominence nor a state, and adding it to `STATE` would have let `bg/*/placeholder` and
  `border/*/placeholder` parse too. The token is `text/neutral/subtler` — named for its rung,
  with its use in the description — and the Figma variable was **renamed in place**, id preserved.
- **A Storybook story needed `meta.args`** because `CaptchaField` has required controlled
  props. Exactly the pattern `.claude/rules/design-system.md` warns about.

**Gates, all green:**

| Gate | Result |
|---|---|
| `@mosje/tokens` tests | 119 / 119 |
| `check:storybook` (coverage) | 88 / 88 |
| `check:storybook:parity` | pass — every prop mentioned |
| `check:storybook:types` | pass |
| `check:storybook:smoke` | **336 stories rendered** |
| `check:design-context` | 92 / 92 documented |
| `check:ds-linkage` | pass |
| `check:changelog` | pass (v0.22.0) |
| `check:hub` typecheck | pass |

## 13. Reuse and organisation pass (2026-08-17, after review)

A review asked three fair questions: why two pages, why the components were not organised like
the `Navbar` page, and how much was genuinely reused versus redefined. The third one found real
defects.

### Two components were redefining the design system's own tabs

`RoleTabs` and `AuthSelector` hand-drew their tabs — **zero reuse**, though `Tabs / Tab` (filled
pill) and `Tabs / Tab (Alt)` (underline) already existed with exactly the API they needed
(`Active` variant, `Label` text, icon swap). Both predate this work, but extending `RoleTabs`
without fixing that was a miss.

Both are now composed of `Tabs / Tab` instances, rebuilt **in place** so their keys survived.
Two consequences worth stating:

- **The active tab is now the DS blue, not the handoff's navy.** That is what adopting the
  system tab means. The handoff was drawn on *MoSJE Portal DS*, not SAMAVESH.
- **Per-tab labels moved to exposed nested instances.** The plugin API cannot map a parent
  property onto a nested instance's property, so the `Tab N label` properties were deleted
  rather than left dead. Designers set the label on the tab itself, which is the standard
  Figma pattern and survives a change in tab count.

`AuthSelector`'s `Segmented Pills`, `Dropdown` and `Radio Cards` styles were retired at the same
time — they existed to switch between five credential modes, three of which have no screen
anywhere in the handoff. It is now `Active = Password | OTP`.

### A defect in `Tabs / Tab (Alt)`, fixed at source

Its `Show Icon` boolean existed but was **never wired to the icon's visibility** — setting it to
false did nothing. Fixed on the component rather than worked around with an instance override.
The change only enables a property that previously had no effect, so existing instances are
untouched; `Tabs / Example` was screenshotted before and after to confirm.

### I had duplicated the OTP field

`Input-container` and `Input Field — Label & Description` on the `Inputs` page **are** an OTP box
and a 6-box OTP field. I built `OTP Input / Box` and `OTP Input` without recognising them — a
discovery failure, not a judgement call.

Resolution, on the evidence: the old field had **0 instances** and the old box was used only
inside its own demo, while the new pair carries 68. The new pair stays; the old two are renamed
`_deprecated/…` with a description saying what superseded them and why (43px boxes fail the
`target/spacious` 48 that WCAG 2.5.8 wants, and there was no Error state). Deprecated, not
deleted — retiring a published component is a separate deliberate act.

**No other duplication.** Checked across all 101 component sets: `Select` vs `Dropdown` (a menu,
not a field), `SideSheet` vs `Modal`, `PasswordStrengthMeter` vs `ProgressBar` (one bar, not four
segments), `OrganisationCard` vs `Card` (a 369×514 media card with image and footer buttons —
forcing an 84px list row through it would mean disabling 7 of its 9 booleans).

### One page, organised like `Navbar`

`Portal Login Parts` existed only because that is how the work happened. It is gone. The estate
now has:

| Page | Holds |
|---|---|
| **Portal Login Template** | `1 · Template` → `2 · Organisms` → `3 · Parts` → `4 · Assets`, each component in a titled wrapper frame with a head and a one-line blurb |
| **Inputs** | `Select`, `OTP Input`, `OTP Input / Box`, `Captcha Field`, `PasswordStrengthMeter` — general-purpose, so they belong with the other inputs |
| **Side Sheet** | `SideSheet`, beside `Modal` in the Overlays block |

The `Verification` page is deleted, and so is the WIP parity shell that `PortalAuthShell`
superseded. Post-consolidation audit: **375 fills, 15 strokes, 324 paddings, 163 gaps and 348
radii bound; zero raw.**

### Reuse scorecard

**Reused from the DS (13):** `AccessibilityBar` · `Navbar/BrandLockup` · `Divider` ·
`Input Field` · `Button` · `Link` · `Icon` · `IconButton` · `CloseButton` · `Chip` ·
**`Tabs / Tab`** · **`Tabs / Tab (Alt)`** · `Modal / Backdrop`

**Genuinely new (15):** `OTP Input` + `/ Box` · `Select` · `Captcha Field` ·
`PasswordStrengthMeter` · `SideSheet` · the eight `Auth / *` parts · `Auth / PortalList` ·
`Auth / AuthFormCard` · `Auth / PortalAuthShell`

**One still flagged:** `Auth / SigningIntoBar` builds its Change control inline because the
**Figma** `Button` has no Inverse tone — the **code** `Button` already has `inverse` and
`inverseOutlined`. Adding it to the Figma Button is the fix; the inline part is the placeholder.

## 14. Structure, standards and visual fidelity (2026-08-17, second review)

Three instructions: organise exactly like `Navbar`, meet the standards for handoff, and match
the reference 100 % using SAMAVESH branding. The third one is what found the remaining defects.

### The wrappers were only approximately like Navbar

A property-by-property read of the `Navbar` page produced the exact spec, and mine diverged on
**seven** counts. Corrected:

| | Navbar (correct) | Mine (was) |
|---|---|---|
| Section fill | `bg/neutral/subtler` | none |
| Wrapper fill | `bg/neutral/base` | `bg/neutral/subtler` — **inverted** |
| Wrapper padding | 28 (`ref/size/28`) | 32 |
| Wrapper gap | 16 (`ref/space/lg`) | 24 |
| Wrapper radius | `ref/radius/lg` | `shape/lg` |
| Head gap | 2 (`ref/space/xxs`) | 4 |
| Head type | `Title/title-2` + `Label/label-3` | `Headline/headline-4` + `Body/body-3` |
| Component-set frame | 32 pad / 40 gap / `ref/radius/xs` | unset |

Wrappers are now stacked in a single column at x=100 with a 24 gap, exactly as `Navbar` does.

**A regression I caused and caught:** applying that spec padded `Auth / OrDivider` and
`Auth / ConsentLine` *themselves* — they are plain components, not sets — inflating them from
16px to 80 and 96, which overflowed the form column. Reverted. Wrapper styling now touches only
`COMPONENT_SET` children.

### Visual fidelity — the reference values, sampled not guessed

| Element | Reference | Was | Now |
|---|---|---|---|
| Saffron rule | **`#ff671f`** | `#c34700` ✗ | `ref/brand/samavesh/orange` |
| Active role tab | **`#003366`** navy | DS blue `#0373df` ✗ | `bg/brand/primary/boldest` |
| Track | `#e5e7eb` / `#d1d5db`, 390×44, 4px inset | 390×44 white | `bg/neutral/subtler` + `border/neutral/base` |
| DigiLocker title | **`#5330e6`** | `text/brand/primary/base` ✗ | `ref/brand/digilocker/purple` |

**There is no `tertiary` brand ramp.** SAMAVESH's three brand colours are `primary` (gov blue),
`secondary` (`#ff671f`, the SAMAVESH orange) and `accent` (`#046a38`, the SAMAVESH green).
`tertiary` is declared in the grammar but has no variables — worth either building or removing.

**`Tabs / Tab` gained a `Tone` axis** rather than being overridden: `Brand` (unchanged, the
default, so every existing tab in the estate is untouched) and `Boldest`
(`bg/brand/primary/boldest`) for a tab sitting in a branded segmented track. That is what lets
`RoleTabs` match the reference navy *and* still be an instance rather than a redraw.

**A new DS token:** `ref/brand/digilocker/purple` = `#5330e6`, in the Static collection beside
`ref/brand/samavesh/*`, described as third-party — another product's identity, so it never
re-themes and never takes a SAMAVESH rung.

### Two more component defects found and fixed at source

- **`Tabs / Tab (Alt)`** never wired its `Show Icon` boolean to the icon's visibility. Setting
  it did nothing. Fixed on the component.
- **`clone()` does not carry `componentPropertyReferences`.** The cloned `Tone=Boldest` variants
  rendered "Label" and an icon regardless of their properties, because their text and icon nodes
  had no wiring at all. Every clone now has `characters`, `visible` and `mainComponent` re-wired
  explicitly. Worth remembering: a cloned variant looks correct and is silently inert.

### Final audit

Across the whole login page, excluding component-set wrappers, sections and instance subtrees:

| Fills | Strokes | Padding | Gaps | Radii | Unstyled text |
|---|---|---|---|---|---|
| 375 / **0** | 15 / **0** | 352 / **0** | 163 / **0** | 356 / **0** | **0** |

### Known remaining gaps to the reference — all assets, all flagged in-file

The SAMAVESH roundel beside the wordmark, the Digital India and SAMAVESH co-brand marks in the
masthead, and the portal logo in the signing-into bar are placeholders. They are asset gaps, not
build gaps; every one is named in the Figma file so an audit can find it.

## 15. Visual audit and redundancy sweep (2026-08-17, third review)

Asked to audit visually and check for redundancy. Both found real things.

### The logos were entirely redundant

`org-logo` on the **Iconography** page is a component set with **17 organisation variants** —
NCSC, NCSK, NCBC, NSFDC, NSKFDC, NBCFDC, DAF, JRF, DAIC, DWBDNC, SCW, SAMBAL, NISD, NOS, NMBA,
SMILE, PM-AJAY. It already covered every logo I had re-imported as a flat image frame, **and two
I had been reporting as missing assets** (SCW, SAMBAL). `SAMAVESH`, `Digital India` and
`National Emblem` exist there as components too.

- The six logo frames are **deleted**; `SigningIntoBar` and `OrganisationCard` now instance
  `org-logo`, and the hero carries the real `SAMAVESH` seal instead of a text stand-in.
- The four hero **photographs** are genuinely not in the library, so they were promoted from
  loose frames to a `Portal Hero` component set with a `Portal` variant — swappable, which a
  flat frame never was. The section is renamed `4 · Portal hero photography`.
- The "missing assets" list in §12 shrinks to the DigiLocker mark alone.

### Layout defects found by measuring, not by looking

| Defect | Cause |
|---|---|
| `1 · Template` overlapped the Documentation frame by **1656×2516** | I never repositioned the doc frame after the sections grew |
| `RoleTabs` overlapped `AuthSelector` by **510×16** in `3 · Parts` | re-tiled with stale heights after restyling |
| Hero rendered **solid navy, no photograph** | see below |

All resolved; a pairwise overlap test across the page and inside every section now returns none.

### Why the hero scrim kept breaking — the actual root cause

**Paint opacity does not inherit from a component to its instances; node opacity does.** Every
earlier attempt set opacity on the *paint*, so each instance needed the value re-applied by hand
and silently reverted whenever the shell was touched. The scrim is now a `Scrim` rectangle with a
100 % bound fill and `opacity = 0.62` on the **node**, which inherits correctly.

A stale `fills` override (`IMAGE, SOLID`) left on each template variant by those earlier attempts
was painting over the photograph; cleared on all four.

### One presentation fix

`SigningIntoBar`'s `Tone=On hero` variant is white-on-transparent, so in a white specimen card it
was invisible. It now sits on a declared `specimen (on hero scrim)` navy stage beneath the set —
the same specimen convention `documentation-ds-linkage.md` already sanctions.

**Final audit: 372 fills, 15 strokes, 356 paddings, 163 gaps, 344 radii bound — zero raw, zero
unstyled text, zero overlaps.**

### Still outstanding

1. **The Figma documentation canvas** in the house style, and the portal configuration table
   as a Figma page.
2. **`AuthFormCard` and `PortalAuthShell` have no code twin.** They were deliberately not
   added: `PortalLoginShell` and `PortalLoginTemplate` already occupy that role in code, and
   shipping a second full-page shell would duplicate rather than reconcile. Reconciling those
   two files against the new Figma anatomy is the right next change, not a parallel pair.
3. **Five library defects** found while building and flagged, not silently patched:
   `Input Field`'s `Size=Default, State=Empty` variant does not expose its `Label Text`
   property; `Link` has no text property; `Chip` has no label property; `Input Field` binds
   primitives rather than semantic roles; and the **Figma** `Button` has no Inverse tone
   though the **code** `Button` does — a real Figma↔code divergence, recorded in
   `auth-parts.figma.ts`.
4. **Assets** unchanged: the NOS hero, the SAMAVESH roundel and wordmark as components, the
   DigiLocker mark, and four portal logos. Every placeholder is named in the file.
5. **Nothing is committed.** All work is in the working tree; per the branching rule this
   needs a branch and a PR.

**Assets still missing** (unchanged): the NOS hero photograph, the SAMAVESH roundel and
wordmark as components (the wordmark is still TEXT), the DigiLocker brand mark, and the
SCW / SMILE-Beggary / E-Utthaan / E-Anudaan logos. Every placeholder is named in the file
so an audit can find it.
