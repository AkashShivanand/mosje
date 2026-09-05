# Portal Login Template — the Figma pass

**Branch:** `ds/login-desktop-parity` (PR #259) · **Decided 2026-09-03** · Figma first, code
after.

Companion audits, both 2026-09-02 and both still the reference for anything not
restated here: `docs/audit/portal-login-template-audit.md` (the component as built)
and `docs/audit/login-pattern-and-library-gap.md` (the pattern against its source
material, gaps G1–G11).

---

## Status 2026-09-05

Audited against the live file and `main`. Where things stand:

| Phase | State |
|---|---|
| 0 | The BotCheck change reached main by cherry-pick (PR #315); `ds/login-figma-pass` was never opened as a PR and is retired. C1 and C2 from the companion audit are fixed on main (PR #317). |
| 1 | 1.1 done — captcha hidden in every variant, `Auth / BotCheck` part exists · 1.3 done, then corrected on 2026-09-05: the 375-wide variants HUG their content rather than clip at 812 · 1.4 partial — `Log In` and `Verify and Log In` are drawn, `Send OTP` is not, and the method tabs still read "Login with …" beside a button reading "Log In". |
| 2 | Page order restored and the Component record authored on 2026-09-05. The per-portal flow sections a designer composed on the page are kept as a numbered section: they are examples, not sets. |
| 3 | Re-pinned. `claims.json` expects eight and COUNTS the master (`kind: "figma"`, live only), because a pin that only compared three strings certified "six" for two days. |
| 4 | Shell renamed to `PortalLoginShell`. `PortalList` still has no Device axis; the four part defects are unverified since 2026-09-02. |
| new | **`Auth / LoginHero`, 2026-09-05** — the desktop hero column as one component: Photograph swap, exposed Signing Into bar, footer boolean. The shell's desktop variant nests it. Code still draws the column inline in `PortalLoginShell` with different copy and no photograph; on the record. |
| drift | `CredentialRecovery` and `RecoveryFormCard` were built in Figma on 2026-09-04 against this plan's own deferral. Five organisms now have no code. Recorded, and `ds-documentation-standard.md` §1 now requires the record entry in the same session. |

## 0. What this branch already closed

| Gap | State |
|---|---|
| §B — the template hand-rolled every control | ✅ rebuilt as an assembly of DS components; off the type-linkage baseline entirely |
| §C3 — captcha was a cognitive function test with no alternative | ✅ replaced by `BotCheck`; real work, invisible by default, `helpHref` required |
| **G1** — the master's `Step` axis conflated auth methods with recovery steps | ✅ rebuilt as `Device × Auth Method`, 8 variants, Mobile→Desktop × Password→OTP→PIN→DARPAN |
| G4 (structure half) — `Portal Hero` was a 4-variant set keyed by portal | ✅ one component, image swapped per instance, SCALE on both axes; the old set kept as `Portal Hero — source photography` |
| §F — DARPAN removed on 2026-08-17 from faulty evidence | ✅ reinstated; the removal reasoned from E-Anudaan, which has no login screen at all. Aadhaar stays out |
| G8 — `check:figma-docs` blind to this component | ◐ 10 claims pinned across `55399`–`55403`; one is stale (below) |

---

## 1. Decisions taken 2026-09-03

These were open questions in `login-pattern-and-library-gap.md` §5 items 1–3. They are
now settled, and the divergences they create are recorded here rather than left to be
rediscovered.

| # | Question | Decision |
|---|---|---|
| 1 | Mobile geometry — the master drew **375×1138**, which matches nothing in the handoff | **375×812.** The majority frame: every portal page in the handoff uses it. Content hugs and scrolls below the fold. The 375×1122 (master flow) and 390×1040 (Transgender) frames are single-source outliers and are not followed. |
| 2 | Desktop geometry — 952 vs 960 in the handoff | **1440×960**, unchanged. Already what the master draws and what `02 Properties` claims. |
| 3 | How Figma represents `BotCheck`, which draws nothing unless the check fails | **Failed state only.** The captcha comes out of the default variants; a `BotCheck` part carries the visible-on-failure state and is documented as absent unless the check fails. Figma draws what a citizen sees. |
| 4 | Seven primary-action labels for three actions | **Three labels, estate-wide:** `Log In` for a credential submit · `Send OTP` for a request · `Verify and Log In` for an OTP submit. Each names what the button does. Every other handoff label is superseded. |
| 5 | Scope of this pass | **Phases 1–4.** The library-part fixes are in, because without them the rest of the auth suite cannot be composed. |

---

## Step 0 — unblock the code before touching Figma

`check:a11y-evidence` fails on PR #259: **410 unverified criteria, up from a baseline of
408**. The BotCheck docs page added five criteria carrying three pieces of evidence, and
`captcha-field`'s verified count fell to zero in the same pass. Every other check on that
job is green.

Earn the evidence or downgrade the rows honestly — never raise the baseline to make it
pass. A red PR gives the Figma pass nothing to be checked against.

---

## Phase 1 — the master back in step with the code

The code moved on 2026-09-03 and Figma did not follow it all the way. In order:

1. **`AuthFormCard` still instances `Captcha Field`.** The code renders `BotCheck`. Per
   decision 3: remove the captcha from the default variants, add a `BotCheck` part in its
   failed state, and say in the record that it is absent otherwise.
2. **The password and PIN reveal belongs to `PasswordInput`**, not a hand-rolled Show/Hide.
   Re-instance so the Figma field is the part the code actually renders.
3. **Mobile variants to 375×812** per decision 1.
4. **Primary action labels to the three of decision 4** across all 8 variants.
5. Re-screenshot all 8 and assert **no descendant of an instance exceeds its instance's
   bounds** — resizing a set distorts children one level down, which is how 24 marks on
   the SAMAVESH Banner rendered as diagonal smears while every instance box measured
   correct.

## Phase 2 — page structure to `ds-documentation-standard.md` §1

Current top-level order is `1 · Template / Documentation / 4 · Portal hero photography /
3 · Parts / 2 · Organisms` — sections out of order, the Documentation frame between them,
and no Component record at all. Two loose recovery sets were filed into numbered sections
on 2026-09-03; the ordering was not touched.

Required: **Documentation → Component record → numbered sections from 1**, masters inside
a numbered section, never loose at the page root.

**Author `PortalLoginTemplate — Component record`** — the largest component in the library
is one of the few without one. Open items only, forward-looking, with a SOURCES panel:
the seven missing hero photographs, the DigiLocker mark, G2's four-modelled/five-drawn
step mismatch, and the six org marks that cannot meet 3×.

## Phase 3 — documentation content, then re-pin

- `03 Variants` lead (`55401:1489`) still reads **"Six variants ship: two devices by three
  authentication methods."** The master has eight. Three claims were updated on this
  branch; this one was missed, so canvas and claim are both wrong.
- `02 Properties › Device` documents mobile as 375×1138 — update to 375×812.
- `08 Accessibility` was rewritten for BotCheck in `claims.json`; the canvas has to match.
- Re-pin every touched claim in `tools/figma-doc-parity/claims.json` and re-run
  `npm run check:figma-docs`.

## Phase 4 — the library parts

Nothing in the rest of the auth suite can be composed until these land:

| Part | Defect |
|---|---|
| `Auth / PortalAuthShell` | Same organism as the code's `PortalLoginShell` under a second noun. Rename to the code name — that is the one with four live consumers and the one Code Connect maps. |
| `Auth / PortalList` | A loose 352×984 component. The handoff also draws it as a mobile bottom sheet. Needs a `Device` axis. |
| `Input Field` | `Size=Default, State=Empty` does not expose `Label Text`. |
| `Link` | No text property. |
| `Chip` | No label property. |
| `Button` | No `Inverse` tone, though the code `Button` has one. |

## Phase 5 — needs a person, not a script

`Portal Hero` covers 4 portals of 11. Seven photographs have to come from the
organisations. Also outstanding: the DigiLocker mark (a Material Symbols `folder_shared`
placeholder today), the SAMAVESH roundel, and the SCW / SMILE-Beggary / E-Utthaan /
E-Anudaan logos. These go on the Component record so they stop being rediscovered.

## Deferred until after the code pass

`PortalPicker`, `OtpVerify`, `Registration` (5 steps) and `CredentialRecovery` (5 steps).
G2 rides with them: the library models four steps for flows the handoff draws in five, and
the handoff shows no step indicator at all where the library has a full `Stepper` page.

`OrganisationCard`, `PortalList` and `AuthFormCard` exist in Figma and in no code barrel —
that is the code half of G6, and it is what the Figma pass must not get ahead of.

## Status 2026-09-05 — evening pass (seven asks)

| Ask | Done |
|---|---|
| Use the existing Bot Check | The page's local `Auth / BotCheck` (two text nodes) is gone; its four instances are the Forms page's `BotCheck` set, `Mode=Invisible, Status=Failed`. Code already used `BotCheck`. |
| Reuse the Portal Card for organisation rows | `Auth / OrganisationCard` is retired; `Auth / PortalList` composes the library's `Portal Card`. The master was refined first: code and name on the 16px body styles, the mark's inner ring removed. Code's `PortalCard` name moved to the same 16px style. |
| SSOButton logo | Figma corrected by hand. Code now ships the Brand page's `DigiLocker` component exported at 3× as `digilocker-mark.png`, and `SSOButton` draws it by default (`DIGILOCKER_MARK_SRC`). |
| Portal list to the handoff reference (56693:11506) | 400 wide, saffron-tinted ground, six count chips (selected one on `bg/status/success/bold`, which the library Chip lacks as a tone), cards in the reference order. |
| Mobile template to the handoff (56693:9331) | `Auth / SigningIntoBar` and `Auth / LoginHero` are `Device` sets; the shell's Mobile variant nests `Navbar/Portal` Mobile and `LoginHero` Mobile. Code's `PortalLoginShell` renders the same band and strip below `lg`. |
| Clean the page | Duplicate E-Anudaan flows (copies of SMILE with the SMILE photograph) removed; sections refitted; section 5 named as the SMILE handoff. |
| Portal Hero as a blank slot | The master's slot is the hero's own brand ground with a faint image glyph; the SMILE photograph is kept as a reference rectangle in section 5. Code's `heroImageSrc` has no default any more; the docs specimen passes `smile-transgender.jpg`. |

Still open: `PortalList`, `AuthFormCard`, `RecoveryFormCard` and `CredentialRecovery` have no
code; per-portal photographs; the library `Chip` has no Success tone.
