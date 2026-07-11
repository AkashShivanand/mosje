# TG — Login / Auth design↔build mapping (added 2026-07-09)

Design file: **MoSJE Portal — Handoff** (`gH2vQ62cfg4677YKWuOpLc`), single page **"Login/Signup"**.
The original TG audit was scoped to the **admin portal** (dashboards + application detail/documents) and
explicitly deferred login as "coverage debt" — so **none of the login views were linked**. They are all
present in Figma; this file records the full inventory and the design↔build pairings. Frame entries now
live in `inputs/figma-frames.json` (canonical link file, read by `engine/crosscheck.py`).

## Login sections found on the "Login/Signup" page

| Section | Node | Contents |
|---|---|---|
| 01 Sign In — Desktop | `8105:41652` | Login Form (`8056:5669`) · **Portal Picker `8103:39372`** |
| 01 Sign In — Mobile | `8105:41655` | Login Form (`8056:5936`) · Portal Picker (`8106:45542`) |
| 02 Sign In — OTP Flow | `7048:36392` | Enter PIN · Incorrect PIN · Enter Phone · OTP Sent · Form Active · Form Ready |
| 03 Registration | `7048:33600` | Step 1–5 (Create Account → Complete Profile) |
| 04 Credential Recovery | `7048:35014` | Step 1–5 (Enter Contact → Password Updated) |
| SMILE-Transgender | `9387:138773` | **Citizen `9387:140995`** · **Admin `9387:141615`** · **Garima Greh `9387:142327`** (each: default + OTP state) |

## Build ↔ design pairings (captures already on disk in `captures/live/`)

| Build capture | Design frame | Node | Notes |
|---|---|---|---|
| `CITIZEN-LOGIN` | SMILE-Transgender \| Citizen (default) | `9379:115794` | Build drops role tabs + adds Mobile Number & DigiLocker → **fidelity finding**, not a re-map |
| `CITIZEN-LOGIN-CHANGE` | Sign In — Portal Picker / Desktop | `8103:39372` | **The "⇄ Change" footer state** — "Choose a portal to login" chooser. This is the screen that was missing. |
| `ADMIN-LOGIN` | SMILE-Transgender \| Admin (default) | `9387:138143` | Admin tab, Send OTP |
| `ADMIN-LOGIN-TAB-CITIZEN` | SMILE-Transgender \| Citizen (default) | `9379:115794` | (capture URL is tg-user-dev — effectively a duplicate of CITIZEN-LOGIN) |
| `ADMIN-LOGIN-CHANGE` | Sign In — Portal Picker / Desktop | `8103:39372` | Same chooser as CITIZEN-LOGIN-CHANGE |

Design PNGs captured to `captures/figma/`: `design-CITIZEN-LOGIN.png`, `design-ADMIN-LOGIN.png`,
`design-GARIMAGREH-LOGIN.png`, `design-LOGIN-PORTAL-PICKER.png`.

## Coverage debt — design states with no build capture yet

- **Garima Greh login tab** (`9379:116062`) — no live GG account provided, so the build tab was never captured.
- **OTP-entered states** (citizen `9387:140260`, admin `9387:141022`, GG `9387:141734`).
- **Registration flow** (`7048:33601…34731`) — citizen portal is DigiLocker-first; native registration likely not built.
- **Credential Recovery flow** (`7048:35015…36120`).
- **02 Sign In — OTP Flow** design-system state set (`7048:36393…37836`).
- **Mobile** variants of the login form and portal picker.
- Generic **Sign In — Login Form** template (`8056:5669`) is a design-system reference, not a TG-specific screen (`_refFrame`).

## Citizen dashboard — approved states (corrected)

| State | Node | Meaning |
|---|---|---|
| `citizen-dashboard-approved` (certificate-active) | **`3531:36919`** | Steady state: "Certificate Active · Issued 12 Jan 2026 · Valid Lifetime". **User-corrected node.** |
| `citizen-dashboard-just-approved` | `3531:36938` | Immediate recognition banner: "You are officially recognized" (Download Certificate / ID Card). Previously mislabeled as the approved node. |

## Regeneration results (2026-07-10)

Login capture re-run (`capture_login_states.py`, read-only, no OTP) refreshed CITIZEN-LOGIN,
CITIZEN-LOGIN-CHANGE, ADMIN-LOGIN, ADMIN-LOGIN-TAB-CITIZEN, ADMIN-LOGIN-CHANGE. Report regenerated
(`engine/run.py --project tg --phase analyze+report`). Coverage ledger now:

- **gate = WARN** · mapped **14** · unmapped **0** · **design-only 24** (declared debt) · mismap **0** · build-only 31
- DS-adoption **31.5%** over **2,313** elements (login elements now included)
- `out/failures.md` empty (all geometry pins valid)

Engine hardening applied so linking many login states didn't create false gate noise:
1. Coverage ledger skips comment/`_group` markers (entries with no `node_id`).
2. Frames flagged `_designOnly` are recorded as **DESIGN-ONLY** debt (gate WARN), never auto-paired
   (prevents the name-substring fallback from grabbing an unrelated capture and inventing a MISMAP).
3. New cover tile **DESIGN-ONLY (DEBT)** surfaces the 24 designed-but-unbuilt login states.

## Login comparison boards (authored 2026-07-10)

Login screens now render as DESIGN↔BUILD boards in the report, from `inputs/manual-screens.json`
(the engine's `assemble()` now merges human-authored judgment screens — a new, portable capability).
Design frames were re-captured with `contentsOnly:true` to drop a canvas scrim that was greying them.
Findings framed as **real fidelity defects** (per decision):

| Screen | Design node | Findings |
|---|---|---|
| **Citizen · Sign In** | 9379:115794 | **①** Role-tab switcher removed (Major) · **②** Extra Mobile Number field (Major) · **③** Heading casing "Log In" vs "Log in" (Minor) |
| **Admin · Log In** | 9387:138143 | **①** Extra Mobile Number field (Major) · **②** Heading casing (Minor). Role tabs ARE present here (unlike citizen). |
| **Portal Picker (Change)** | 8103:39372 | **Verified faithful — no fidelity defects.** Rendered as a **parity reference board** (design │ build, "✓ faithful" badge, no pins) — the engine now supports findings-free reference boards for screens worth showing even without defects. |

All finding pins pass the geometry assertion gate (`out/failures.md` empty). Boards carry Figma-frame ↗
and Live-page ↗ links. These are 👤 human-authored judgment findings awaiting sign-off before CERTIFIED.
