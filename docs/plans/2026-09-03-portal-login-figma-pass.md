# Portal Login Template — the Figma pass

**Branch:** `ds/login-figma-pass`, cut from `main` after PR #259 merged ·
**Decided 2026-09-03** · Figma first, code after.

Companion audits, both 2026-09-02 and both still the reference for anything not
restated here: `docs/audit/portal-login-template-audit.md` (the component as
built) and `docs/audit/login-pattern-and-library-gap.md` (the pattern against its
source material, gaps G1–G11).

---

## 0. What PR #259 closed

| Gap | State |
|---|---|
| §B — the template hand-rolled every control | ✅ rebuilt as an assembly of DS components; off the type-linkage baseline entirely |
| §C3 — captcha was a cognitive function test with no alternative | ✅ replaced by `BotCheck`; and on this branch `BotCheck` lost its own `challenge` mode, so nothing on the recommended path presents one |
| **G1** — the master's `Step` axis conflated auth methods with recovery steps | ✅ rebuilt as `Device × Auth Method`, 8 variants, Mobile→Desktop × Password→OTP→PIN→DARPAN |
| G4 (structure half) — `Portal Hero` was a 4-variant set keyed by portal | ✅ one component, image swapped per instance, SCALE on both axes; the old set kept as `Portal Hero — source photography` |
| §F — DARPAN removed on 2026-08-17 from faulty evidence | ✅ reinstated; the removal reasoned from E-Anudaan, which has no login screen at all. Aadhaar stays out |
| G8 — `check:figma-docs` blind to this component | ◐ 10 claims pinned across `55399`–`55403`; at least one is stale (§3) |

---

## 1. Decisions taken 2026-09-03

These were open questions in `login-pattern-and-library-gap.md` §5 items 1–3.
They are settled, and the divergences they create are recorded here rather than
left to be rediscovered.

| # | Question | Decision |
|---|---|---|
| 1 | Mobile geometry — the master draws **375×1138**, which matches nothing in the handoff | **375×812.** The majority frame: every portal page in the handoff uses it. Content hugs and scrolls below the fold. The 375×1122 (master flow) and 390×1040 (Transgender) frames are single-source outliers and are not followed. |
| 2 | Desktop geometry — 952 vs 960 in the handoff | **1440×960**, unchanged. Already what the master draws and what `02 Properties` claims. |
| 3 | How Figma represents `BotCheck`, which draws nothing unless the check fails | **Failed state only.** The captcha comes out of the default variants; a `BotCheck` part carries the visible-on-failure state and is documented as absent otherwise. Figma draws what a citizen sees. |
| 4 | Seven primary-action labels for three actions | **Three labels, estate-wide:** `Log In` for a credential submit · `Send OTP` for a request · `Verify and Log In` for an OTP submit. Every other handoff label is superseded. |
| 5 | Scope of this pass | **Phases 1–4.** The library-part fixes are in, because without them the rest of the auth suite cannot be composed. |

---

## Step 0 — unblock the code · DONE

`check:a11y-evidence` was failing at 410 against a baseline of 408. It was closed
twice, in two different places, by two sessions running at once:

- **`19583b35` (merged in #259)** verified two criteria on `portal-login-template`
  — 3.3.1 and 2.4.7 — reading the code for each rather than trusting the
  description beside it. 410 → 408.
- **`baeef9b9` (this branch)** removed `BotCheck`'s `challenge` mode, which was
  the reason two rows were `partial` in the first place. 408 → 406, re-baselined.

Also on this branch: **`c1cf5f17`**, a lint blocker nobody had hit yet. The Next
bump in #261 added `@next/next/no-location-assign-relative-destination`, and
`--max-warnings 0` in `.lintstagedrc` meant it blocked every commit touching
`apps/hub`. The rule found a real defect — SMILE admin's mobile Sign out did a
full document load to a route Next already held.

---

## Phase 1 — the master back in step with the code

The code moved and Figma has not followed it all the way. In order:

1. **`AuthFormCard` still instances `Captcha Field`.** The code renders
   `BotCheck`, which as of `baeef9b9` has no characters test at all. Per decision
   3: remove the captcha from the default variants, add a `BotCheck` part in its
   failed state, and say in the record that it is absent otherwise.
2. **The password and PIN reveal belongs to `PasswordInput`**, not a hand-rolled
   Show/Hide. Re-instance so the Figma field is the part the code renders.
3. **Mobile variants to 375×812** per decision 1.
4. **Primary action labels to the three of decision 4** across all 8 variants.
5. Re-screenshot all 8 and assert **no descendant of an instance exceeds its
   instance's bounds** — resizing a set distorts children one level down, which is
   how 24 marks on the SAMAVESH Banner rendered as diagonal smears while every
   instance box measured correct.

## Phase 2 — page structure to `ds-documentation-standard.md` §1

Current top-level order is `1 · Template / Documentation / 4 · Portal hero
photography / 3 · Parts / 2 · Organisms` — sections out of order, the
Documentation frame between them, and no Component record at all. Two loose
recovery sets were filed into numbered sections on 2026-09-03; the ordering was
not touched.

Required: **Documentation → Component record → numbered sections from 1**, with
masters inside a numbered section and never loose at the page root.

**Author `PortalLoginTemplate — Component record`** — the largest component in the
library is one of the few without one. Open items only, forward-looking, with a
SOURCES panel: the seven missing hero photographs, the DigiLocker mark, G2's
four-modelled/five-drawn step mismatch, and the six org marks that cannot meet 3×.

## Phase 3 — documentation content, then re-pin

- `03 Variants` lead (`55401:1489`) still reads **"Six variants ship: two devices
  by three authentication methods."** The master has eight. Three claims were
  updated in #259; this one was missed, so canvas and claim are both wrong.
- `02 Properties › Device` documents mobile as 375×1138 — update to 375×812.
- `08 Accessibility` was rewritten for BotCheck in `claims.json`; the canvas has
  to match, and it now also has to say that no characters test exists.
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
organisations. Also outstanding: the DigiLocker mark (a Material Symbols
`folder_shared` placeholder today), the SAMAVESH roundel, and the SCW /
SMILE-Beggary / E-Utthaan / E-Anudaan logos. These go on the Component record so
they stop being rediscovered.

## Deferred until after the code pass

`PortalPicker`, `OtpVerify`, `Registration` (5 steps) and `CredentialRecovery`
(5 steps). G2 rides with them: the library models four steps for flows the
handoff draws in five, and the handoff shows no step indicator at all where the
library has a full `Stepper` page.

`OrganisationCard`, `PortalList` and `AuthFormCard` exist in Figma and in no code
barrel — that is the code half of G6, and it is what the Figma pass must not get
ahead of.
