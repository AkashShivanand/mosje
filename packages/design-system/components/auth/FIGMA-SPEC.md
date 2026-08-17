# `PortalLoginTemplate` — SAMAVESH Figma library record

What was built in the SAMAVESH Design System file (`3FF5l0SMNIwdpZrKkeyPTm`), on the
new **`Portal Login Template`** page (`55384:695`), and the decisions taken along the way.

Authored to `.claude/rules/component-authoring.md`, `.claude/rules/figma-documentation-style.md`
and `.claude/rules/documentation-ds-linkage.md`. The house grammar is copied from the
`AccessibilityBar / Documentation` page (`55094:1287`), which is the reference implementation.

---

## 1. Node map

| Artefact | Node | Size |
|---|---|---|
| Page — `Portal Login Template` | `55384:695` | — |
| Section — `01 · PortalLoginTemplate` | `55398:1359` | 2244 × 7756 |
| Frame — `Component board` | `55398:1354` | 2044 × 7556 |
| **Component set — `❖ PortalLoginTemplate`** | **`55397:1364`** | 2044 × 7436 |
| Component set — `❖ RoleTabs` | `55384:718` | — |
| Component set — `❖ AuthSelector` | `55386:725` | — |
| Frame — `PortalLoginTemplate / Documentation` | `55399:1354` | 1680 × 11349 |

Code Connect template: `portal-login-template.figma.ts`, pointing at `<SAMAVESH>?node-id=55397-1364`.

---

## 2. Property model — 10 variants, not 90

| Property | Type | Values |
|---|---|---|
| `Device` | VARIANT | `Mobile` · `Desktop` |
| `Auth Method` | VARIANT | `Aadhaar OTP` · `DigiLocker SSO` · `Mobile OTP` · `NGO DARPAN ID` · `Password + Captcha` |
| `Signing into` | TEXT | → `config.portalName` |
| `Role tabs` | INSTANCE_SWAP | → `❖ RoleTabs` (Active = Citizen / NGO / Officer) |
| `Auth selector` | INSTANCE_SWAP | → `❖ AuthSelector` (Style = Segmented Pills / Dropdown / Radio Cards) |

**Why Role and Selector Style are not variant axes.** The original brief specified four
variant axes — Device (2) × Role (3) × Auth Method (5) × Selector Style (3) — which is
**90 variants**, while the same brief's master header and hero stat card both claimed
"12 variants". 90 breaks the ~30 cap in `component-authoring.md` §4, and roughly 40 of the
90 are combinations that can never ship (a Department Officer cannot hold an NGO DARPAN
ID). Role and Selector Style moved to nested component sets reached by instance swap.
Confirmed with the human before anything was created.

**Ordering** (`component-authoring.md` §10): rows run alphabetically by `Auth Method`;
within a row `Device` ascends `Mobile → Desktop`. `AuthSelector`'s own variants are
ordered by vertical footprint at rest — Segmented Pills (36) → Dropdown (44) → Radio
Cards (232).

---

## 3. Anatomy — 8 regions, 4 of them library instances

| Pin | Region | Source |
|---|---|---|
| 1 | Top utility bar | instance of `AccessibilityBar` (`55065:33766`) |
| 2 | Brand header | instance of `Navbar/BrandLockup` (`4235:3652`) + `Divider` |
| 3 | Left hero panel | authored here |
| 4 | Signing-into bar | authored here — carries the `Signing into` text property |
| 5 | Role tabs | instance of `❖ RoleTabs` |
| 6 | Auth sub-selector | instance of `❖ AuthSelector` |
| 7 | Active form card | `Input Field` (`85:837`) + `Button` (`609:283111`) instances |
| 8 | Footer strip | instance of `Footer - Bottom Strip` (`2500:297936`, Type1) |

Nine component sets are instanced in total — seven that already existed
(`AccessibilityBar`, `Navbar/BrandLockup`, `Divider`, `Input Field`, `Button`, `Radio`,
`Footer - Bottom Strip`) plus the two authored here. Nothing was redrawn.

---

## 4. Corrections to the original spec

Every value below was in the brief and does **not** survive contact with the shipping
token contract. The corrected binding is what shipped; the brief's value is recorded so
the divergence is a decision, not a defect.

| Brief said | Reality | Shipped |
|---|---|---|
| `--sa-bg-neutral-subtler` = `#F8FAFC` | that token resolves to **`#eef0f3`**; `#F8FAFC` is in no SAMAVESH collection | bound to the token |
| `--sa-bg-brand-primary-boldest` = `#021B33` | resolves to **`#003975`** | — |
| `--sa-color-secondaryScale-400` = `#F97316` saffron | no such name in the Color collection; `#F97316` is no step of the SAMAVESH secondary ramp. The AA-safe ink step is `bg/brand/secondary/bolder` = `#c34700` | — |
| `--sa-color-primaryScale-800` = `#0373DF` | no such name in the Color collection; the gov-blue ink is `text/brand/primary/base` | bound to the token |
| Doc canvas is a flat `#F8FAFC` | the house page is `bg/neutral/base` sections under a `bg/brand/primary/base` (`#ecf4ff`) hero | house grammar |
| Title Bold 48px, pill `#E0F2FE`/`#0369A1` | those are Tailwind sky values, in no collection | `Display/display-3` (64) and the house pill `bg/brand/primary/bolder` + white |
| WCAG **2.1** AA | this estate targets **2.2 AA** (`.claude/rules/standards-precedence.md`, 2026-08-13); 2.2 is a strict superset, so it satisfies GIGW and exceeds it | 2.2 AA |
| Mobile = 375px | this library's mobile breakpoint token `ref/viewport/mobile` is **412** | 412 |
| 12 variants | see §2 | 10 |
| Component board 1816 × 830 | a 10-variant full-page set cannot fit 830px tall; the reference board is that size because an `AccessibilityBar` variant is 46px | 2044 × 7556 |
| Doc canvas ~5800px | the anatomy specimen (947) and three full-page variant specimens (~3200) are real content | 11349 |

### Contrast finding worth keeping

`text/brand/primary/base` (`#0373df`) on `bg/brand/primary/base` (`#ecf4ff`) measures
**4.19:1** — below AA for 14px body text. The selected auth pill and selected radio card
therefore use the system's own pairing, `on/bg/brand/primary/base` (`#1e2124`) at
**14.6:1**. This is the `documentation-ds-linkage.md` "bind by resolved value" rule
biting in a real component; the name reads correct and the measurement does not.

---

## 5. Added to the library

One token, per `component-authoring.md` §3:

- **`layout/login/panel/width`** = `420` (Space collection, `WIDTH_HEIGHT` scope,
  `var(--sa-layout-login-panel-width)`) — the auth column on Desktop.
  1200 content − 80 gap − 700 hero = 420.

---

## 6. Documentation canvas — 10 sections

`Hero · 01 Anatomy · 02 Properties · 03 Variants · 04 States · 05 Tokens · 06 Behaviour ·
07 Usage · 08 Accessibility · 09 Do & Don't · 10 Resources`, built to the house grammar:
1680 frame, 1440 content, sections padded `[80,120,80,120]` with gap 40, section headers
`NN / KEYWORD → Headline/headline-2 → 1080-wide Body/body-1`, panels `bg/neutral/subtler`
at `shape/lg`.

## 7. Linkage audit (`documentation-ds-linkage.md`)

Run across the documentation frame, the variant set and both nested sets — 848 nodes.
Instance subtrees owned by other pages are excluded; their geometry is audited there.

| Property | Bound | Raw |
|---|---|---|
| Fills | 649 | **0** |
| Strokes | 65 | **0** |
| Padding / gaps | 994 | **0** |
| Corner radii | 692 | **0** |
| Text on a published style | 396 | — |
| Declared specimens | 10 | — |
| `UNACCOUNTED` text | — | **0** |
| Nodes below 11px | — | **0** |

The 10 specimens are the Devanagari wordmark `समावेश`, named
`specimen (Devanagari, no role style) — समावेश` in each variant. Devanagari is an
explicitly permitted exemption: the published text styles are bound to Noto Sans, which
has no Devanagari coverage, so the wordmark uses Noto Sans Devanagari SemiBold.

---

## 8. Open items

- **Code Connect cannot be published.** It needs a Figma Developer seat on an
  Organization/Enterprise plan and `@figma/code-connect` is still not a dependency. The
  template is authored in anticipation — see `.claude/rules/design-system.md`. Its
  presence must not be read as a working integration.
- **The `Input Field` trailing icon on the password field renders a clear (✕) glyph**,
  not a visibility toggle. `Input Field` has no eye-icon option; adding one is a change
  to that component, not to this one.
- **No `Digital India` or `SAMAVESH` logo asset exists in the library**, so the masthead
  co-brand cluster is set as text bound to `Title/title-3` and `Title/title-1`. If those
  marks are added as components, swap them in.

---

## 9. Handoff reconciliation (in progress)

Source analysed: **MoSJE Portal — Handoff** (`evmNmlK8g4VYwJVu2FwSGV`), single page `Login/Signup`,
8 flows. The approved design differs materially from §1–§8 above, which were built from the written
brief before this file was available. Parity work is underway; §1–§8 describe the pre-parity build.

### What the handoff actually specifies

| | Handoff | Pre-parity build |
|---|---|---|
| Frame | 1440 × 960 | 1440 × 947 |
| Navbar | 134 (bar 40 + masthead 94) | 46 + 112 |
| Split | hero **922** / form **518** (content 390) | 700 / 420 |
| Hero | full-bleed portal **photograph** + navy scrim | flat panel on a grey page |
| Role tabs | **2** — Citizen / Beneficiary, Officer / Admin | 3 |
| DigiLocker | primary CTA above an "or sign in with credentials" divider | one pill in the selector |
| Auth method | **underline tabs** — Login with Password / Login with OTP | segmented pills, 5 methods |
| Also present | "Your role" select, consent line, Create Account, Change button | none of these |

**The five-method Auth Method axis was invented.** The handoff has exactly two credential modes
(Password, OTP); DigiLocker is a CTA, not a form mode, and there is no DARPAN or Aadhaar screen.
The axis re-cuts to Device (2) × Auth Method (Password | OTP) = **4 variants**.

### Adjacent screens in the file, not yet built

Portal Picker modal (8 portals, green check on the selected row) · OTP verify step ("Verify your
Phone Number", 6 boxes, resend, back) · Registration (5 steps) · Credential Recovery (5 steps) ·
Incorrect-PIN error state.

### Done so far

- **10 assets transferred** into the library (`00 · Assets — portal heroes & logos`, `55410:1825`):
  hero photography for SCW, NMBA, PM-AJAY, NHAPOA and logos for NBCFDC, NOS, NMBA, SMILE, PM-AJAY,
  NISD. Cross-file copy is not supported by the plugin API, so each was exported via
  `download_assets` and re-uploaded via `upload_assets`.
- **`layout/login/panel/width` retuned 420 → 518**; **`layout/login/hero/width` = 922** added.
- **`RoleTabs` rebuilt in place** (key preserved, per §11) as the handoff's two full-width
  segmented tabs.
- **`AuthSelector` gained a `Style=Underline Tabs` variant**, now the default.
- **Desktop parity shell built** — `55412:1799`, labelled WIP on the Portal Login Template page.
  Photographic hero with a 0.62 scrim, branding, signing-into bar with the Change button, and the
  full form column.

### Still to do

1. Mobile parity shell (412), then fold both into `❖ PortalLoginTemplate` **in place** and re-cut
   the variant axes to Device × Auth Method (Password | OTP).
2. `PortalPicker` and `OtpVerify` component sets.
3. `Registration` and `CredentialRecovery` step sets.
4. Rewrite the documentation canvas against the rebuilt anatomy, and document the new components.
5. Re-run the linkage audit, refresh descriptions, update the Code Connect templates.

### Assets still missing

- **NOS hero photograph** — its image node exports empty and its subtree returns other portals'
  photos, so it was not guessed. A designer should nominate the correct source.
- **SAMAVESH roundel**, **DigiLocker brand mark** and the **SCW / SMILE-Beggary / E-Utthaan /
  E-Anudaan logos**. The shell currently uses the SAMAVESH wordmark as text and a Material Symbols
  `folder_shared` glyph in place of the DigiLocker mark — both flagged in the file.
- **No `Select` component exists in the library**, so the "Your role" control is hand-built. It
  belongs in the design system before another portal needs it.
