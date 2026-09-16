# Templatised Portal Login System (`@mosje/design-system/auth`)

The **Templatised Portal Login System** provides a standardized, configuration-driven authentication page template (`PortalLoginTemplate`) for all Ministry of Social Justice & Empowerment (MoSJE) portals.

It enforces **100% static compliance with Government of India Web Standards** (DBIM 3.0, GIGW 3.0, UX4G 3.0, WCAG 2.1 AA) while offering a clean, declarative configuration interface for portal-specific branding, roles, and authentication sub-selections.

---

## 1. Static vs. Configurable Anatomy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [STATIC] Utility Bar (Gov of India, Text Size A-/A/A+, Contrast ◑, A11y ♿, Language 🌐)  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [STATIC] Brand Header (National Emblem, Beta, MoSJE Dept Name, Digital India, SAMAVESH) │
├──────────────────────────────────────────────────────┬─────────────────────────────────┤
│                                                      │ [CONFIGURABLE] Role Tabs        │
│                                                      │ (Citizen / NGO / Officer)       │
│ [STATIC] Left Hero Panel                             ├─────────────────────────────────┤
│ - SAMAVESH Identity Logo                             │ [CONFIGURABLE] Sub-Selection    │
│ - Hindi Typography: समावेश                            │ [ Password | OTP | DARPAN ID ]  │
│ - Tagline: "Justice. Equality. Dignity."             ├─────────────────────────────────┤
│ - Platform Description                               │                                 │
│ ───────────────────────────────────────────────────  │ [CONFIGURABLE] Auth Form Card   │
│ [CONFIGURABLE] "SIGNING INTO: <Portal Name>"         │ - Active Mode Inputs & Submit   │
├──────────────────────────────────────────────────────┴─────────────────────────────────┤
│ [STATIC] Footer (Privacy Policy · Contact Us · About Us · NeGD Credit)                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Static Elements (Must NEVER be modified or overridden)
- **Top Utility Bar:** Government of India attribution, font resizer (`A-`/`A`/`A+`), high-contrast toggle (`◑`), accessibility widget modal (`♿`), language dropdown (`🌐`), and `#login-form` skip-to-content link.
- **Brand Header:** National Emblem of India, Beta stage badge, Ministry of Social Justice & Empowerment text, Department of Social Justice & Empowerment wordmark, Digital India logo, SAMAVESH branding.
- **Left Hero Panel:** SAMAVESH identity mark, Hindi emblem text, slogan *"Justice. Equality. Dignity."*, description body.
- **Design Token Contract:** Brand primary scale (`#0373DF`), secondary accent scale (`#F97316`), Noto Sans typeface, OKLCH high-contrast mode tokens.
- **Footer Strip:** Policy navigation links and copyright attributions.

### Configurable Elements (Set via `PortalLoginConfig`)
- `portalId`: Unique slug (e.g. `"smile-admin"`, `"pm-ajay"`, `"nos"`, `"e-utthan"`, `"scw"`, `"garima-greh"`, `"nmba"`).
- `portalName`: Title string displayed in the hero "Signing Into" bar (e.g. *"Nasha Mukt Bharat Abhiyaan"*).
- `portalTagline` *(optional)*: A line under the portal name in the "Signing Into" bar — usually the scheme's expanded name (e.g. *"Support For Marginalized Individuals For Livelihood & Enterprise"* under *"SMILE Beggary"*). Large screens only.
- `portalDescription` *(optional)*: A muted line under the tagline saying what the portal is for (e.g. *"Comprehensive Rehabilitation of Persons Engaged in Begging"*). Large screens only.
- `roles`: Role switcher tabs (`id`, `label`, `authModes`, `authModeOptions`, `authSelectorType`, `defaultMode`, `description`).
- `authSelectorType`: Sub-selection layout style (`"segmented"` pills, `"radio"` group with descriptions, or `"dropdown"`).
- `brandAssets`: Optional custom asset path overrides for emblem or portal seals.
- `links`: Custom URLs for `forgotPasswordHref`, `registerHref`, and `helpFaqHref`.

---

## 2. Configurable Sub-Selection (Login Method Selector)

Below the main Role Tabs, portals can configure a **Sub-Selection Switcher** allowing users to choose how they want to log in for that specific role (e.g. *"Login with Password"*, *"Login with OTP"*, *"Login with DARPAN ID"*).

### Sub-Selection UI Presentation Styles (`authSelectorType`)
1. **Segmented Pills (`"segmented"`):** Horizontal pill switchers, ideal for 2–3 compact choices (e.g., `[ Password Login | Mobile OTP ]`).
2. **Radio List (`"radio"`):** Radio cards with custom titles and subtext descriptions (e.g. `(o) Login with Official Credentials`, `( ) Login with NGO DARPAN ID`).
3. **Dropdown Menu (`"dropdown"`):** Compact select box for multi-option roles.

---

## 3. API Specification (`PortalLoginConfig`)

`types.ts` is the source of truth and its docstrings carry the reasons; the
generated props table on `/design-system/components/auth/portal-login-template`
is the reference. The shape, in brief:

```typescript
interface PortalLoginConfig {
  portalId: string;
  portalName: string;
  portalTagline?: string;
  portalDescription?: string;
  changeHref?: string;
  roles: PortalRoleTab[];
  defaultRoleId?: string;
  captcha?: boolean;              // per role wins; off by default (WCAG 2.2 3.3.8)
  consent?: boolean;
  brandAssets?: PortalBrandAssets; // emblem, Digital India, SAMAVESH, hero, DigiLocker mark
  extraFields?: React.ReactNode;
  extraContent?: React.ReactNode;
  links?: {
    forgotPasswordHref?; registerHref?;
    registerOptions?: { label: string; href: string }[]; // two routes, e.g. SCW
    helpFaqHref?; digilockerHref?; termsHref?; privacyHref?;
  };
  botCheck?: { mode?: "invisible" | "checkbox"; helpHref: string };
}

interface PortalRoleTab {
  id: string; label: string; audience?: "citizen" | "officer" | "organisation";
  authModes?: ("password" | "otp" | "pin" | "darpan")[];
  authModeOptions?: { mode; label; description? }[];
  authSelectorType?: "segmented" | "radio" | "dropdown";
  defaultMode?; description?; digilocker?: boolean; captcha?: boolean;
  identifierLabel?; identifierPlaceholder?;
  identifierKind?: "text" | "mobile" | "email";     // password + PIN routes
  otpIdentifierKind?: "text" | "mobile" | "email";  // where a code goes
  otpIdentifierLabel?; otpIdentifierPlaceholder?;
  subRoles?: { id: string; label: string }[];      // "Your role" select
  subRoleLabel?; defaultSubRoleId?;
}
```

Template props beyond `config`: `onSubmit(payload)` (`roleId`, `subRoleId`,
`authMode`, `credentials`, `botCheck`), `loading`, `error`, `fieldErrors`
(`identifier` · `secret` · `otp` · `subRole`, each hidden once its field is
edited), `onRequestOtp(request)` returning `{ ok: false, error }` or
`{ ok: true, maskedDestination? }`, `roleId`, `onRoleChange`, `deepLinkRole`,
`portalPicker`, `headingLevel`.

**Demo fill.** The template listens for `demo:fill` itself. `extra.tab`,
`extra.mode` and `extra.subRole` select a role, mode and sub-role; on the OTP
route it sends the code through `onRequestOtp` and fills it in.

### Password recovery — `PortalRecoveryTemplate`

Same chrome, three flows: `otp` (identifier → code → new password → done),
`link` (identifier → "Reset Link Sent"; the reset page is `startAt="reset"`) and
`contact` (a notice naming who resets passwords). `onRequest`, `onVerify` and
`onReset` each return `{ ok: false, error }` to hold the step. The `link` flow
never discloses whether an account exists.

---

## 4. Guide for AI Agents: Creating a New Portal Login Page

When instructed to create or scaffold a login page for a new portal (e.g. `apps/portals/<portal-name>/app/login/page.tsx`), follow this standard procedure:

### Step 1: Define the Portal Configuration with Sub-Selections
Create a dedicated config file `login-config.ts` inside your portal's route folder:

```typescript
// apps/portals/<portal-name>/app/login/login-config.ts
import { PortalLoginConfig } from "@mosje/design-system";

export const portalLoginConfig: PortalLoginConfig = {
  portalId: "my-new-portal",
  portalName: "My New Welfare Portal",
  portalTagline: "Socio-Economic Development Initiative",
  changeHref: "/",
  roles: [
    {
      id: "applicant",
      label: "Beneficiary / Applicant",
      authModeOptions: [
        { mode: "otp", label: "Login with OTP", description: "Receive 6-digit OTP on your registered phone number." },
        { mode: "password", label: "Login with Password", description: "Use your user ID and portal password." },
      ],
      authSelectorType: "radio",
      defaultMode: "otp",
      description: "Select your preferred login method below.",
    },
    {
      id: "ngo",
      label: "NGO / Implementing Agency",
      authModeOptions: [
        { mode: "darpan", label: "Login with NGO DARPAN ID" },
        { mode: "password", label: "Login with Credentials" },
      ],
      authSelectorType: "segmented",
      defaultMode: "darpan",
      description: "Sign in using your NITI Aayog NGO DARPAN ID (DL/YYYY/xxxxxxx).",
    },
    {
      id: "officer",
      label: "Department Officer",
      authModes: ["password"],
      defaultMode: "password",
      description: "Sign in with your official @gov.in / @nic.in credentials.",
    },
  ],
  links: {
    forgotPasswordHref: "/login/forgot-password",
    registerHref: "/register",
    helpFaqHref: "/help",
  },
};
```

### Step 2: Render `PortalLoginTemplate` in Next.js Page
```tsx
// apps/portals/<portal-name>/app/login/page.tsx
"use client";

import * as React from "react";
import { PortalLoginTemplate, LoginSubmitPayload } from "@mosje/design-system";
import { portalLoginConfig } from "./login-config";

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLoginSubmit = async (payload: LoginSubmitPayload) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Submitting login payload:", payload);
      // Example API call:
      // const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
      // if (!res.ok) throw new Error("Invalid credentials or security captcha.");
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLoginTemplate
      config={portalLoginConfig}
      onSubmit={handleLoginSubmit}
      loading={loading}
      error={error}
    />
  );
}
```

---

## 5. Government Compliance Guardrails

Every portal login page rendered using `PortalLoginTemplate` automatically passes the following compliance checks:

1. **[DBIM 3.0] Brand & Color Tokens:**
   - Palette strictly bound to `@mosje/tokens` CSS variables (`--sa-color-primaryScale-800`, `--sa-bg-brand-primary-boldest`, `--sa-bg-neutral-base`).
   - Font family enforced to **Noto Sans**.
2. **[GIGW 3.0] Accessibility & Keyboard Nav:**
   - Hidden skip-link (`#login-form`) available on keyboard Tab focus.
   - Text resizer controls (`A-` 90%, `A` 100%, `A+` 115%) modify font scale cleanly without layout breaks.
   - Form inputs have explicit `<label>` tags with matching `htmlFor` and required markers.
   - Captcha refresher has `aria-label="Refresh Captcha Security Code"`.
3. **[UX4G 3.0] India Identity Formats:**
   - Mobile numbers restricted to 10 digits prefixed with `+91`.
   - NGO DARPAN ID auto-formatted to uppercase (e.g. `MH/2016/0100000`).
   - Aadhaar numbers formatted as 12-digit numeric sequences.
