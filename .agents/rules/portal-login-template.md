# Templatised Portal Login Rule for AI Agents

> **Scope:** Applies whenever creating, modifying, or reverse-engineering a Login UI for any MoSJE portal in `apps/portals/*`.

## Core Directive

Every portal login page **MUST** use the canonical `PortalLoginTemplate` from `@mosje/design-system`.
Do **NOT** write custom full-page login HTML/JSX layouts from scratch.

```tsx
import { PortalLoginTemplate } from "@mosje/design-system";
```

## Mandatory Architecture & Configuration Rules

1. **Keep Static Parts Static:**
   - Do NOT modify or omit the Utility Bar (Govt of India, text scaling `A-`/`A`/`A+`, contrast `◑`, accessibility `♿`, language `🌐`).
   - Do NOT remove or modify the National Emblem, Beta badge, Department/Ministry titles, Digital India logo, or SAMAVESH logo.
   - Do NOT hardcode colors or raw hex values. Use `@mosje/tokens` CSS variables (`--sa-color-primaryScale-800`, etc.).

2. **Configure Dynamic Role Tabs & Auth Method Sub-Selections:**
   - Define a `portalLoginConfig` object specifying:
     - `portalId` (e.g. `"smile-admin"`, `"pm-ajay"`, `"nos"`, `"e-utthan"`, `"scw"`, `"garima-greh"`, `"nmba"`).
     - `portalName` (e.g. `"Nasha Mukt Bharat Abhiyaan"`).
     - `roles` array with role tabs and **Auth Method Sub-Selections**:
       - `authModes`: Supported modes (`"password"`, `"otp"`, `"digilocker"`, `"darpan"`, `"aadhaar"`).
       - `authModeOptions`: Custom display titles and descriptions per login method (e.g., `"Login via Password"`, `"Login via Mobile OTP"`, `"Login with DARPAN ID"`).
       - `authSelectorType`: Visual style for sub-selection below role tabs (`"segmented"` pills, `"radio"` list cards, or `"dropdown"`).
     - `links` object for forgot password, register, and help routes.

3. **Compliance & Accessibility Checklist:**
   - Ensure the login route has `skip to content` target (`#login-form`).
   - Verify all input fields have explicit labels and accessibility hints.
   - Form submission handlers must handle loading (`loading={true}`) and error alerts (`error={errMessage}`).
