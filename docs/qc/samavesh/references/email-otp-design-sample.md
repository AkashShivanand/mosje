# SAMAVESH Login — Email + OTP design sample (approved flow)

For finding SAM-LOGIN-001 (deferred): the build's email→captcha→OTP login is the approved method.
These are the redline specs to update the Figma frame (`9364:82537`) to match, on the existing design system.

## State 1 — Request OTP
- Heading "Log in to your account" — Noto Sans, Title-1 **20/28 Medium**, `Text/Primary #003366`.
- Field "Registered email ID *" — label Label-1 **14/20 Medium** `Text/Dark #374151`; required `*` `#dc2626`.
  - Input: height **44**, 1px border `Stroke/300 #d1d5db`, **radius-sm 6**, placeholder `Text/Hint #6b7280` "name@example.gov.in", padding-x 12.
- Field "Security check *":
  - Captcha chip: width **116**, bg `Neutral/50 #f3f4f6`, border `#d1d5db`, radius 6.
  - Refresh button: **44×44**, white, 1px `#d1d5db`, radius 6, icon `refresh-cw`.
  - Input "Enter the characters": same input spec as above, flex-fill.
  - Row gap **10**.
- Primary button "Send OTP" — full width, height **46**, `Primary/Source #003366`, text white **15 Medium**, **button-corner 8**.
- Consent: Body-3 **13/20** `#6b7280` — "By continuing, you agree to the Terms of Use and Privacy Policy." (links `#003366` Medium).

## State 2 — Verify OTP
- Heading "Enter the OTP" (20/28 Medium `#003366`).
- Subtext (Body-2 14/20 `Neutral/600 #4b5563`): "We sent a 6-digit code to <email> · Edit" (email + Edit `#003366`).
- OTP cells: 6 equal cells, height **48**, radius 6; idle border `#d1d5db`, active/filled border `#003366`.
- Primary button "Verify & sign in" — same spec as Send OTP.
- Footer row: "Didn't get the code?" `#6b7280` (left) · "Resend in 0:28" `#9ca3af` countdown → becomes a `#003366` "Resend OTP" link at 0:00.

## Spacing
- Vertical rhythm between field groups: **16**. Label→input: **6**. Heading→first field: **18**.
- Vertically centre the whole block in the right panel (fixes SAM-LOGIN-005).

## Notes
- Account-type toggle ("Citizen / Beneficiary | Officer / Admin") from the original design can sit above the heading if multi-role login is still wanted — confirm with product.
- Keep masthead/top-bar/hero consistent with findings 002–004 decisions.
