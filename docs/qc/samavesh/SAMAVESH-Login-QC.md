# SAMAVESH Login — Design QC

**Design:** [Figma frame ↗](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=9364-82537) (node `9364:82537`)
**Build:** screenshot · **Method:** screenshot-based spec comparison
**Active findings:** 1 Major · 6 Minor  ·  **Deferred:** 2

## Deferred (parked, not dropped)
- **SAM-LOGIN-001** — Login uses **email + captcha + OTP** instead of the designed Digilocker / mobile+password multi-method form. *Email-OTP is the approved method; Figma will be updated to match. Design samples for the OTP flow to follow.*
- **SAM-LOGIN-002** — Hero uses a **flat navy gradient** instead of the designed contextual photograph. *Revisit later.*

## Active findings

| ID | Sev | Axis | Finding | Design | Build | Conf. |
|----|-----|------|---------|--------|-------|-------|
| 003 | Minor | Content & Iconography | Extra masthead logo | Digital India + SAMAVESH (2) | Garima Greh + Digital India + SAMAVESH (3) | high |
| 004 | Minor | Content & Iconography | Top-bar utility icon differs | Contrast + accessibility (person) | Contrast + info (ⓘ) | high |
| 005 | Minor | Layout & Spacing | Login panel top-aligned, unbalanced | Form fills the panel | Short form top-aligned, big empty area | high |
| 006 | Minor | Typography | "Log in to your account" heading larger/heavier | ≈20px Medium | Larger/heavier | verify |
| 007 | Minor | Content & Iconography | Required-asterisk convention differs | No `*` on labels | Red `*` on labels | high |
| 008 | **Major** | Color & Token | Primary blue may be off-token | Primary/Source `#003366` | "Send OTP" + top bar look lighter/brighter | verify |
| 009 | Minor | Components & States | Input border/radius may differ | border `#d1d5db`, radius 6 | Lighter border, more rounded | verify |

**verify** = visual estimate; needs the build PNG sampled at pixel level to confirm or drop.

## What matched well
Masthead text + BETA badge, SAMAVESH wordmark, "Justice. Equality. Dignity." tagline, hero description copy, "SIGNING INTO Garima Greh / Change" footer, "Log in to your account" heading text, overall two-pane split layout.

## Pending (need `captures/live/login.png`)
1. Pixel-sample to confirm/kill **006, 008, 009**.
2. Build the side-by-side DESIGN vs BUILD board + numbered pins.
3. Render the PDF report.
4. Deliver design samples for the approved email-OTP flow.
