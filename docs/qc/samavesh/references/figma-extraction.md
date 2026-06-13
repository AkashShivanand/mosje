# SAMAVESH Login — Figma design truth

Source: MoSJE Portal (Handoff) · file `gH2vQ62cfg4677YKWuOpLc` · node `9364:82537`
Frame used: leftmost desktop artboard ("Citizen / Beneficiary" default login state).
(The same board also holds a "Choose a portal to login" state and a mobile column — out of scope; the build screenshot maps to the default desktop login.)

## Tokens in play (from get_variable_defs)
- Primary/Source `#003366`, Primary/50 `#e5eff9`, Text/Primary `#003366`
- Neutral: White `#ffffff`, Text/Dark `#374151`, Text/Hint `#6b7280`, Stroke/200 `#e5e7eb`, Stroke/300 `#d1d5db`
- Secondary/50 `#ffedd5` (orange tint); accent divider on hero is saffron/orange
- Type: Noto Sans throughout. Headline-4 20/28 SemiBold; Title-1 20/28 Medium; Body-1 16/24; Label-1 14/20 Medium; Body-2 14/20
- Radius: button-corner 8, radius-sm 6, radius-md 8; Shadow-xs / Shadow-lg defined

## Top utility bar (navy #003366)
Left: tricolour flag + "Government of India ↗".
Right: "Skip to Main Content" | A⁻ A A⁺ (font size) | contrast toggle (◐) | **accessibility/person icon** | 🌐 English ▾.

## Masthead (white)
- Ashoka emblem + yellow **BETA** badge.
- "Government of India / Ministry of Social Justice & Empowerment / **Department of Social Justice & Empowerment**".
- Right: **two** partner logos — Digital India (Power To Empower) + SAMAVESH (Single Access Mechanism…). No Garima Greh logo here.

## Left hero panel
- Background: **contextual photograph** (Garima Greh — women, "GARIMA GREH" signage) under a navy overlay/gradient.
- SAMAVESH circular logo + "SAMAVESH" (bold, white) + "समावेश".
- Saffron/orange divider rule.
- "Justice. Equality. Dignity." (white, bold).
- Description: "Single Access Mechanism for All Verticals of Empowerment & Social Harmony - one unified gateway for every social justice service in India."
- Footer: thin divider, small Garima Greh logo + "SIGNING INTO / Garima Greh" + outlined "↻ Change" pill (right).

## Right login panel (THE form)
- Account-type segmented toggle: **"Citizen / Beneficiary"** (active, navy) | **"Officer / Admin"** (inactive).
- Heading: **"Log in to your account"**.
- Primary CTA card: **"Continue with Digilocker"** + Digilocker icon + arrow, subtitle "Secured Government Login" (bordered card).
- Divider: **"or sign in with credentials"**.
- Field: **"Mobile Number"** — placeholder "Enter your registered mobile".
- Field: **"Password"** + **"Forgot Password?"** (orange link) — placeholder "Enter Password".
- Button: **"Sign In"** (full width; shown in disabled/empty state).
- Microcopy: "By continuing, you agree to the **Terms of Use** and **Privacy Policy**".
- Divider, then "Don't have an account?" + **"Create Account"** link.

## BUILD (attached screenshot) — what's actually there
- Top bar: contrast toggle + **info (ⓘ)** icon (not the accessibility/person icon).
- Masthead: **three** logos on the right — गरिमा गृह (Garima Greh) + Digital India + SAMAVESH.
- Hero: **flat navy gradient**, no photograph. Same lockup/tagline/description/footer.
- Right panel: **"Log in to your account"** → **"Registered email ID *"** (placeholder name@example.gov.in) → **"Security Check *"** captcha (image + refresh + "Enter the characters") → **"Send OTP"** button. No tabs, no Digilocker, no password, no consent line, no Create Account.
