# SAMAVESH — Login & Sign-Up Flows
## Design Handoff Document

| | |
|---|---|
| **Document Version** | 1.0 |
| **Date** | 2026-06-11 |
| **Figma File** | [MoSJE-Portal--Handoff-](https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-36929) |
| **Figma Page** | Login/Signup |
| **Status** | Ready for Development |
| **Prepared by** | Design System — MoSJE Estate |
| **Stack** | Next.js 15 · React 19 · TypeScript · Tailwind v3 |

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [File Organisation Audit & Recommended Renaming](#2-file-organisation-audit--recommended-renaming)
3. [Complete Screen Inventory](#3-complete-screen-inventory)
4. [User Flows](#4-user-flows)
5. [Design System Tokens](#5-design-system-tokens)
6. [Global Layout Architecture](#6-global-layout-architecture)
7. [Screen-by-Screen Specifications](#7-screen-by-screen-specifications)
   - 7.1 [Sign In — Desktop (Current)](#71-sign-in--desktop-current)
   - 7.2 [Portal Picker — Desktop](#72-portal-picker--desktop)
   - 7.3 [Sign In — Mobile](#73-sign-in--mobile)
   - 7.4 [Portal Picker — Mobile](#74-portal-picker--mobile)
   - 7.5 [Sign In with OTP Flow](#75-sign-in-with-otp-flow)
   - 7.6 [Create New Account Flow](#76-create-new-account-flow)
   - 7.7 [Reset Password Flow](#77-reset-password-flow)
   - 7.8 [Portal-Branded Login Backgrounds](#78-portal-branded-login-backgrounds)
8. [Portal Registry](#8-portal-registry)
9. [Responsive Behaviour](#9-responsive-behaviour)
10. [Interaction & Animation Specifications](#10-interaction--animation-specifications)
11. [Accessibility Requirements](#11-accessibility-requirements)
12. [Error & Edge Case States](#12-error--edge-case-states)
13. [Design Feedback & Recommendations](#13-design-feedback--recommendations)
14. [Implementation Notes](#14-implementation-notes)

---

## 1. Executive Overview

SAMAVESH (Single Access Mechanism for All Verticals of Empowerment & Social Harmony) is the unified authentication gateway for the MoSJE digital estate. It serves as the single front door to **9+ government welfare portals** under the Ministry of Social Justice & Empowerment.

### What this file covers

All screens related to the authentication journey: selecting a portal, signing in, creating an account, and resetting credentials. This is the first thing every citizen and admin encounters — it must project credibility, simplify an inherently multi-step process, and be fully accessible.

### User Archetypes

| Archetype | Journey | Primary Device |
|---|---|---|
| **Citizen** | Finds their scheme portal → signs in or creates account | Mobile (60%+) |
| **Admin / Ministry Officer** | Knows their portal → signs in with credentials | Desktop |
| **First-time Citizen** | Creates account → verifies phone → completes profile | Mobile |
| **Returning Citizen (forgotten password)** | Resets password via OTP | Mobile |

### Portal Ecosystem Served

SAMAVESH gates access to: SCW, SMILE-Transgender, SMILE-Beggary, NOS, NMBA, E-Utthaan, E-Anudaan, PM-AJAY, NHAPOA. Each portal has distinct branding that surfaces in the login experience via context-aware hero imagery.

---

## 2. File Organisation Audit & Recommended Renaming

### Current Structure (Figma)

The Figma page "Login/Signup" contains a mix of naming conventions — some PascalCase, some ALL-CAPS, inconsistent use of brackets, duplicate frame names, and orphan frames. Below is the complete audit with recommended industry-standard names.

### Naming Convention Applied

```
[Section/Flow Name] / [Screen Name] / [Variant]
```
- Sections group by user journey (not by visual style)
- Screen names use sentence case
- Variants use slash notation: `/Desktop`, `/Mobile`, `/Error`, `/Loading`

### Renaming Table

| Node ID | Current Name | Recommended Name | Reason |
|---|---|---|---|
| `8056:5668` | Sign In [Updated] | `01 Authentication / Sign In` | Section, not a screen; "[Updated]" is a dev note, not a design name |
| `8105:41652` | Desktop | `01 Authentication / Sign In / Desktop` | Missing parent context |
| `8105:41655` | Mobile | `01 Authentication / Sign In / Mobile` | Missing parent context |
| `8837:24702` | Portals | `01 Authentication / Portal Picker / Mobile` | Ambiguous name; this is the portal list component |
| `7048:36392` | Sign In with OTP | `02 Authentication (OTP) / Sign In with OTP` | Group all OTP screens together |
| `7048:33600` | Create New Account | `03 Registration / Create Account` | "New" is redundant |
| `7048:35014` | Reset PASSWORD | `04 Credential Recovery / Reset Password` | ALL-CAPS is not a name convention |
| `8755:4593` | Sign In images options | `05 Portal Themes / Login Hero Backgrounds` | Descriptive name that communicates purpose |
| `8774:24865` | NOS/NHAPOA | `05 Portal Themes / Hero — NOS & NHAPOA` | Use dash for slash in names |
| `8904:35114` | PM AJAY | `05 Portal Themes / Hero — PM-AJAY` | Consistent hyphenation |
| `9018:36746` | E-Utthaan | `05 Portal Themes / Hero — E-Utthaan` | Consistent |
| `8755:2194` | SCW | `05 Portal Themes / Hero — SCW` | Consistent |
| `8755:2462` | NMBA | `05 Portal Themes / Hero — NMBA` | Consistent |
| `8755:2730` | TG | `05 Portal Themes / Hero — SMILE-Transgender` | "TG" is unexplained shorthand |
| `9178:57187` | TG (duplicate) | `05 Portal Themes / Hero — SMILE-Beggary` | Duplicate name — likely wrong; needs verification |
| `8819:3675` | Logos | `06 Assets / Portal Logos` | Section for all shared assets |
| `8106:47639` | Frame 5 | **[DELETE]** — empty 100×100 orphan frame | No content, no purpose |

### Sections to Create

```
01 Authentication
  ├── Sign In / Desktop
  ├── Sign In / Mobile
  ├── Portal Picker / Desktop
  └── Portal Picker / Mobile

02 Authentication (OTP)
  ├── Enter Phone / Desktop
  ├── OTP Sent / Desktop
  ├── Enter OTP / Desktop
  ├── Sign In (Active) / Desktop
  ├── Success / Desktop
  └── Incorrect OTP / Desktop

03 Registration
  ├── Create Account / Desktop
  ├── Verify Phone — Step 1 / Desktop
  ├── Verify Phone — Step 2 / Desktop
  ├── Create Password / Desktop
  └── Complete Profile / Desktop

04 Credential Recovery
  ├── Reset Password / Desktop
  ├── Verify Phone — Step 1 / Desktop
  ├── Verify Phone — Step 2 / Desktop
  ├── Create Password / Desktop
  └── Password Updated / Desktop

05 Portal Themes
  ├── Hero — SCW
  ├── Hero — NMBA
  ├── Hero — SMILE-Transgender
  ├── Hero — SMILE-Beggary
  ├── Hero — NOS & NHAPOA
  ├── Hero — PM-AJAY
  └── Hero — E-Utthaan

06 Assets
  └── Portal Logos (6 × 100px)
```

---

## 3. Complete Screen Inventory

| # | Flow | Screen | Frame Size | Node ID | Priority |
|---|---|---|---|---|---|
| 1 | Authentication | Sign In / Desktop | 1440×960 | `8105:41652` (A) | P0 |
| 2 | Authentication | Portal Picker / Desktop | 1440×960 | `8105:41652` (B) | P0 |
| 3 | Authentication | Sign In / Mobile | 375×1102 | `8105:41655` (A) | P0 |
| 4 | Authentication | Portal Picker / Mobile | 375×812 | `8105:41655` (B) | P0 |
| 5 | Auth (OTP) | Enter Phone Number | 1440×952 | `7048:36392` (1) | P0 |
| 6 | Auth (OTP) | OTP Sent — Awaiting Input | 1440×952 | `7048:36392` (2) | P0 |
| 7 | Auth (OTP) | Sign In (form active) | 1440×952 | `7048:36392` (3–5) | P0 |
| 8 | Auth (OTP) | Incorrect OTP / PIN | 1440×952 | `7048:36392` (6) | P0 |
| 9 | Registration | Create Account | 1440×952 | `7048:33600` (1) | P1 |
| 10 | Registration | Verify Phone — Step 1 | 1440×952 | `7048:33600` (2) | P1 |
| 11 | Registration | Verify Phone — Step 2 | 1440×952 | `7048:33600` (3) | P1 |
| 12 | Registration | Create Password | 1440×952 | `7048:33600` (4) | P1 |
| 13 | Registration | Complete Your Profile | 1440×952 | `7048:33600` (5) | P1 |
| 14 | Credential Recovery | Reset Password | 1440×952 | `7048:35014` (1) | P1 |
| 15 | Credential Recovery | Verify Phone — Step 1 | 1440×952 | `7048:35014` (2) | P1 |
| 16 | Credential Recovery | Verify Phone — Step 2 | 1440×952 | `7048:35014` (3) | P1 |
| 17 | Credential Recovery | Create New Password | 1440×952 | `7048:35014` (4) | P1 |
| 18 | Credential Recovery | Password Updated! | 1440×952 | `7048:35014` (5) | P1 |
| 19 | Portal Themes | Hero — SCW | 1440×960 | `8755:2194` | P1 |
| 20 | Portal Themes | Hero — NMBA | 1440×960 | `8755:2462` | P1 |
| 21 | Portal Themes | Hero — SMILE-Transgender | 1440×960 | `8755:2730` | P1 |
| 22 | Portal Themes | Hero — SMILE-Beggary | 1440×960 | `9178:57187` | P1 |
| 23 | Portal Themes | Hero — NOS/NHAPOA | 1440×960 | `8774:24865` | P2 |
| 24 | Portal Themes | Hero — PM-AJAY | 1440×960 | `8904:35114` | P2 |
| 25 | Portal Themes | Hero — E-Utthaan | 1440×960 | `9018:36746` | P2 |

**Total: 25 screens** across 5 flows + 7 portal theme variants

---

## 4. User Flows

### Flow A — Sign In with Password (Happy Path)

```
[Entry]
  ↓
Portal Selection (if no portal context in URL)
  ↓
Sign In screen — Login with Password tab active
  ↓
Enter Email/Username + Password
  ↓
[Submit]
  ├──→ Success → Redirect to portal dashboard
  └──→ Error → Inline error message (stay on screen)
```

### Flow B — Sign In with OTP

```
[Entry: "Login with OTP" tab]
  ↓
Enter phone number
  ↓
OTP sent confirmation (same screen, state change)
  ↓
Enter 6-digit OTP
  ↓
[Verify]
  ├──→ Correct → Redirect to portal dashboard
  └──→ Incorrect → Error state ("Incorrect PIN") + Resend option
```

### Flow C — DigiLocker Sign In

```
[Entry: "Continue with DigiLocker" button]
  ↓
Redirect to DigiLocker authentication
  ↓
DigiLocker OAuth callback
  ↓
Redirect to portal dashboard
```
> Note: DigiLocker is an external redirect. No intermediate screens designed in this file.

### Flow D — Create Account

```
Step 1: Create Account
  → Enter: Full Name, Phone Number, Email, Date of Birth, Aadhaar
  → [Create Account] button

Step 2: Verify Phone — OTP sent to phone
  → Display: masked phone number
  → [Resend OTP] link (60s countdown)

Step 3: Verify Phone — Enter OTP
  → 6-digit OTP input (segmented)
  → [Verify] button
  ├──→ Correct → Step 4
  └──→ Incorrect → Error state inline

Step 4: Create Password
  → Password + Confirm Password fields
  → Strength indicator
  → [Create Password] button

Step 5: Complete Your Profile
  → Additional fields (address, category, disability status)
  → [Submit] → Portal dashboard
```

### Flow E — Reset Password

```
Step 1: Reset Password
  → Enter registered phone/email

Step 2: Verify Phone — OTP sent

Step 3: Enter OTP
  ├──→ Correct → Step 4
  └──→ Incorrect → Error state

Step 4: Create New Password
  → Password + Confirm Password
  → [Update Password] button

Step 5: PIN Updated! — Success confirmation
  → Auto-redirect to Sign In (5s) or [Go to Login] button
```

### Flow F — Portal Selection

```
[Entry: from any login screen via "Change" link]
  ↓
Portal Picker modal/panel appears (right side on desktop, modal on mobile)
  ↓
List of portals with logo + name + tagline
  ↓
Select portal → Portal context updates → Dismiss picker
  → Continue login flow for selected portal
```

---

## 5. Design System Tokens

### Colour Tokens

| Token | Hex | Usage |
|---|---|---|
| `color-gov-blue` | `#0A1628` | Global header bar background; SIGNING INTO context bar |
| `color-brand-primary` | `#0373DF` | Primary CTA hover states, links, focus rings |
| `color-brand-navy` | `#152040` | Sign In button background; topbar |
| `color-accent-orange` | `#F97316` | Portal card accent borders; portal name text in picker; BETA badge background |
| `color-accent-saffron` | `#FF6B00` | Alternate orange usage (portal names in picker appear `#F97316` or similar) |
| `color-surface-white` | `#FFFFFF` | Right panel background; card backgrounds |
| `color-surface-grey` | `#F5F5F5` | Page background behind cards |
| `color-border-default` | `#E5E7EB` | Input borders (default state) |
| `color-border-orange` | `#F97316` | Portal card selected state border |
| `color-text-primary` | `#111827` | Body text, form labels |
| `color-text-secondary` | `#6B7280` | Subtext, placeholders |
| `color-text-link` | `#0373DF` | Hyperlinks ("Forgot Password?", "Create Account", "Terms of Use") |
| `color-text-orange` | `#F97316` | Portal names in picker |
| `color-success` | `#22C55E` | Selected portal checkmark |
| `color-error` | `#EF4444` | Error state borders, error messages |
| `color-beta-badge-bg` | `#F97316` | BETA badge background |
| `color-digilocker-bg` | `#EEF2FF` | DigiLocker button background (light indigo) |
| `color-digilocker-text` | `#4F46E5` | DigiLocker button text and icon |

### Typography Tokens

> Note: The design uses **Noto Sans** throughout (DBIM/GIGW standard).

| Token | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| `text-xs` | 10px | 400 | 16px | BETA badge label |
| `text-sm` | 12px | 400 | 18px | Legal disclaimer ("By continuing…") |
| `text-base` | 14px | 400 | 20px | Form labels, input text, body copy |
| `text-base-medium` | 14px | 500 | 20px | Portal taglines in picker |
| `text-base-semibold` | 14px | 600 | 20px | Tab labels ("Login with Password"), "Change" button text |
| `text-lg` | 16px | 400 | 24px | Form field placeholder text |
| `text-lg-semibold` | 16px | 600 | 24px | Portal names in picker |
| `text-xl` | 18px | 400 | 28px | — |
| `text-2xl-semibold` | 20px | 700 | 28px | "Log in to your account" heading; "Choose a portal to login" heading |
| `text-samavesh-title` | ~32px | 800 | 40px | "SAMAVESH" wordmark in hero panel |
| `text-tagline` | ~14px | 400 | 20px | "Justice. Equality. Dignity." tagline |
| `text-portal-tag` | 12px | 500 | 16px | "SIGNING INTO" label above portal context bar |

### Spacing Tokens

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon-to-label gap in small contexts |
| `space-2` | 8px | Inner padding for badges |
| `space-3` | 12px | Gap between header elements |
| `space-4` | 16px | Standard input padding; gap between form rows |
| `space-5` | 20px | Section padding internal |
| `space-6` | 24px | Form section outer padding |
| `space-8` | 32px | Gap between major form sections |
| `space-12` | 48px | Right panel horizontal padding |

### Border Radius Tokens

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Input fields, smaller interactive elements |
| `radius-md` | 8px | Primary CTA buttons, DigiLocker button |
| `radius-lg` | 12px | Portal picker cards; Sign In form card on desktop |
| `radius-full` | 9999px | Role tab switcher (pill shape) |

### Shadow Tokens

| Token | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Input focus shadow |
| `shadow-card` | `0 4px 16px rgba(0,0,0,0.12)` | Form card on desktop |
| `shadow-modal` | `0 8px 32px rgba(0,0,0,0.2)` | Portal picker overlay |

---

## 6. Global Layout Architecture

### Desktop (1440px)

```
┌─────────────────────────────────────────────────────────────┐
│  Global Header (100% width, 48px)                           │
│  [Flag] Gov. of India ↗  |  [A11y]  |  [Globe] English ▼   │
├─────────────────────────────────────────────────────────────┤
│  Ministry Header (100% width, 72px)                         │
│  [Emblem] BETA  Government of India                         │
│           Ministry of Social Justice & Empowerment          │
│           Department of Social Justice & Empowerment        │
├────────────────────────┬────────────────────────────────────┤
│                        │                                    │
│   LEFT HERO PANEL      │   RIGHT FORM PANEL                 │
│   (50vw, min 640px)    │   (50vw, min 440px)                │
│                        │                                    │
│   - Hero photo         │   - SIGNING INTO context bar       │
│     (background fill)  │   - Role switcher tabs             │
│   - SAMAVESH logo      │   - Form heading                   │
│   - Wordmark           │   - DigiLocker CTA                 │
│   - Tagline            │   - Divider                        │
│   - Portal badge       │   - Auth method tabs               │
│   (bottom-left)        │   - Form fields                    │
│                        │   - Primary CTA button             │
│                        │   - Legal + Register links         │
└────────────────────────┴────────────────────────────────────┘
```

### Mobile (375px)

```
┌─────────────────────────┐
│  Global Header (48px)   │
├─────────────────────────┤
│  Ministry Header (80px) │
├─────────────────────────┤
│  SAMAVESH Brand Block   │
│  (Logo + Name + Tagline)│
├─────────────────────────┤
│  SIGNING INTO Bar       │
├─────────────────────────┤
│  Role Switcher (Tabs)   │
├─────────────────────────┤
│  Form Area              │
│  (Scrollable)           │
├─────────────────────────┤
│  Legal + Register       │
└─────────────────────────┘
```

On mobile, there is no hero photo panel. The SAMAVESH brand block replaces it as a compact identity strip.

---

## 7. Screen-by-Screen Specifications

---

### 7.1 Sign In — Desktop (Current)

**Node ID:** `8105:41652` (left screen)
**Dimensions:** 1440×960px
**Purpose:** Primary authenticated entry for returning users on desktop

#### Layout

Two-column split:
- **Left (hero):** ~680px wide. Full-bleed background photo of beneficiary family. Overlaid: SAMAVESH logo + wordmark, tagline "Justice. Equality. Dignity.", "Senior Citizen Welfare" portal badge (bottom-left).
- **Right (form):** ~760px wide. White background. Vertically centred form card (max-width: ~440px, centred within panel).

#### Header — Global Utility Bar
```
Height: 48px
Background: #0A1628 (color-gov-blue)
Content (L → R):
  - India flag icon (24×16px)
  - "Gov. of India ↗" (14px, white, link)
  - Vertical divider
  - Accessibility icon (wheelchair symbol, 20×20px)
  - Vertical divider
  - Globe icon + "English" text + dropdown chevron (14px, white)
```

#### Header — Ministry Identity Bar
```
Height: 72px
Background: white
Border-bottom: 1px solid #E5E7EB
Content:
  - Ashoka Emblem (40×40px)
  - BETA badge (orange pill, 10px, "BETA")
  - "Government of India" (12px, color-text-secondary)
  - "Ministry of Social Justice & Empowerment" (12px, color-text-secondary)
  - "Department of Social Justice & Empowerment" (14px bold, color-text-primary)
  - SAMAVESH logo (right-aligned) — circular emblem ~48px
```

#### Left Hero Panel
```
Background: full-bleed photo (beneficiary family photograph)
Overlay: dark gradient (bottom 40%, rgba(0,0,0,0.5))

Bottom-left badge:
  Background: white, rounded-lg, padding: 8px 16px
  Icon: Ashoka Emblem 24px
  Text: Portal name (bold, 14px)

SAMAVESH Brand (vertically centred, left-aligned within panel):
  Logo: circular emblem ~80px
  Wordmark: "SAMAVESH" (32px, 800 weight, white)
  Full name: "Single Access Mechanism for..." (12px, white, 70% opacity)
  Tagline: "Justice. Equality. Dignity." (14px, white, italic or regular)
```

#### Right Form Panel

**SIGNING INTO Context Bar:**
```
Background: #0A1628 (color-gov-blue)
Border-radius: 8px
Padding: 12px 16px
Margin-bottom: 24px

Content:
  - "SIGNING INTO" label (10px, colour-text-secondary/muted, uppercase, tracking-wider)
  - [Emblem 20px] + portal name (14px, white, semibold)
  - "Change" button → right-aligned (12px, white, underline OR pill button)
```

**Role Tab Switcher:**
```
Container: pill background (#F3F4F6), border-radius: full (pill)
Height: 40px
Tabs: "Citizen" | "Admin"
Active tab: background #0A1628 (dark navy), text white, border-radius: full
Inactive tab: transparent background, text #6B7280
Transition: background 150ms ease
```

**Form Heading:**
```
Text: "Log in to your account"
Font: 20px, 700 weight
Colour: color-text-primary (#111827)
Margin-bottom: 24px
```

**DigiLocker CTA:**
```
Container: full-width button
Background: #EEF2FF (light indigo)
Border: 1px solid #C7D2FE
Border-radius: 8px
Height: 52px
Padding: 0 16px

Left: DigiLocker icon (24×24px, purple)
Middle:
  - "Continue with DigiLocker" (14px, 600, #4F46E5)
  - "Secured Government Login" (12px, #6B7280)
Right: Arrow icon →

Hover:
  Background: #E0E7FF
  Border-color: #6366F1
```

**Divider:**
```
"or sign in with credentials"
Line: 1px, #E5E7EB
Text: 12px, #9CA3AF, centred
```

**Auth Method Tab Bar:**
```
Tab 1: "Login with Password" (default active)
Tab 2: "Login with OTP"

Style: Underline tab (not pill)
Active: bottom border 2px, #0A1628, text #111827, 600 weight
Inactive: no border, text #6B7280, 400 weight
Hover: text #374151
```

**Login with Password Form Fields:**

*Email/Username:*
```
Label: "Email/Username" (14px, #374151, 500)
Input:
  Height: 44px
  Border: 1px solid #D1D5DB
  Border-radius: 6px
  Font: 14px, #111827
  Placeholder: "Enter Email or Username" (14px, #9CA3AF)
  Padding: 0 12px

  Focus:
    Border-color: #0373DF
    Box-shadow: 0 0 0 3px rgba(3,115,223,0.15)

  Error:
    Border-color: #EF4444
    Show error message below (12px, #EF4444)
```

*Password:*
```
Label: "Password" (14px, #374151, 500)
Right-aligned: "Forgot Password?" (12px, #0373DF, link)
Input: same as above
  Right icon: eye toggle (show/hide, 20px, #9CA3AF)
```

**Sign In Button:**
```
Full width
Height: 48px
Background: #152040 (color-brand-navy)
Border-radius: 8px
Text: "Sign In" (16px, 600, white)
Hover: Background darken 10% (#0F1830)
Active: Background darken 20%
Loading: Spinner (white, 20px) + "Signing in..." text, disabled state
Disabled: opacity 0.5, cursor: not-allowed
```

**Legal Text:**
```
"By continuing, you agree to the [Terms of Use] and [Privacy Policy]"
Font: 12px, #6B7280, centred
Links: colour-text-link (#0373DF), underline on hover
Margin-top: 16px
```

**Footer Link:**
```
"Don't have an account? [Create Account]"
Font: 14px, #6B7280, centred
"Create Account": #0373DF, no underline, underline on hover
Margin-top: 16px
```

---

### 7.2 Portal Picker — Desktop

**Node ID:** `8105:41652` (right screen in section)
**Dimensions:** 1440×960px
**Purpose:** Allows user to change which portal they're signing into

The left hero panel remains unchanged. The right panel transforms entirely to show the portal list.

#### Portal Picker Panel

```
Heading: "Choose a portal to login"
Font: 20px, 700, color-text-primary
Right: ✕ close icon (20px, #6B7280) — returns to Sign In screen

Portal list: scrollable, max-height: 600px (overflow-y: auto)
Gap between cards: 12px
```

**Portal Card (each portal):**
```
Container:
  Border: 1.5px solid #F97316 (orange)
  Border-radius: 12px
  Padding: 12px 16px
  Background: white
  Hover: background #FFF7F3
  Selected: border-width 2px + checkmark icon right-aligned (green #22C55E)

Content layout:
  Left: Portal logo (40×40px, circular or square with radius)
  Right of logo (flex column):
    - Portal name (16px, 600, #F97316) — NOTE: orange
    - Portal tagline (14px, 400, #374151)
```

**Portal list (complete — from Portals frame):**
```
1. SCW — Senior Citizens Welfare
2. SMILE - Transgender — National Portal for Transgender Persons
3. NOS — National Overseas Scholarship
4. NMBA — Nasha Mukt Bharat Abhiyaan
5. SMILE - Beggary — National Portal for Persons Engaged in Begging
6. E-Utthaan — Development Action Plan for Scheduled Caste
7. E-Anudaan — [Description Text — PLACEHOLDER, needs real copy]
8. PM-AJAY — Pradhan Mantri Anusuchit Jaati Abhyuday Yojna
9. NHAPOA — National Helpline Against Atrocities
```

> **⚠️ Dev note:** "E-Anudaan" shows "Description Text" as the tagline — this is a placeholder. Real copy must be supplied before go-live.

---

### 7.3 Sign In — Mobile

**Node ID:** `8105:41655` (left screen in section)
**Dimensions:** 375×1102px
**Purpose:** Primary sign-in for mobile users

The mobile layout is **single-column** — no hero photo panel. The identity is conveyed through the SAMAVESH brand block.

#### Scroll behaviour
The page scrolls vertically. The global and ministry headers are **sticky** (fixed to top). Content below scrolls naturally.

#### SAMAVESH Brand Block (replaces hero panel)
```
Background: white
Padding: 16px
Display: row (logo left, text right)

Left: SAMAVESH logo (48×48px)
Right:
  - "SAMAVESH" (18px, 800)
  - "Single Access Mechanism for All Verticals of..." (11px, #6B7280, 2-line truncation)
```

#### Form Card
On mobile, the form is not in a card — it's flush with the page background. Padding: 16px horizontal.

All form elements (SIGNING INTO bar, role switcher, form heading, DigiLocker, divider, tabs, fields, buttons) follow the same spec as desktop, scaled:
- Input height: 44px (same)
- CTA button height: 48px (same)
- Horizontal padding: 16px (reduced from 48px on desktop)

---

### 7.4 Portal Picker — Mobile

**Node ID:** `8105:41655` (right screen in section)
**Dimensions:** 375×812px
**Purpose:** Mobile portal selection — rendered as a modal/bottom sheet

#### Modal behaviour
```
Trigger: User taps "Change" in the SIGNING INTO bar
Animation: slides up from bottom (300ms, ease-out)
Backdrop: rgba(0,0,0,0.5)
```

#### Modal Header
```
Height: 56px
Title: "Choose a portal to login" (18px, 700)
Right: ✕ icon (24px, #374151)
```

#### Portal list
Same card style as desktop. On mobile: full-width cards, slightly reduced padding (12px × 12px).

Scrollable list within modal (max-height: ~60vh). Rubber-band overscroll on iOS.

---

### 7.5 Sign In with OTP Flow

**Node IDs:** within `7048:36392`
**Dimensions:** 1440×952px per screen
**Total screens:** 6

#### Screen 1 — Enter Phone Number

Same overall layout as Sign In / Desktop. Right panel variation:

```
Auth tabs: "Login with OTP" (active)

Form field:
  Label: "Phone Number"
  Input: tel type
    Left adornment: "+91" country code (readonly)
    Placeholder: "Enter 10-digit mobile number"
    Validation: 10-digit numeric only

Primary CTA: "Send OTP"
  → triggers OTP send API → transitions to Screen 2 (in-place state change, no full navigation)
```

#### Screen 2 — OTP Sent (waiting for input)

```
Informational text: "OTP sent to +91-XXXXX XXXXX" (masked)
  Font: 14px, #374151

OTP Input:
  6 segmented boxes (each ~44×52px)
  Border: 1px solid #D1D5DB
  Font: 24px, 600, centred
  Focus: border-color: #0373DF

  Auto-advance: cursor moves to next box on digit entry
  Backspace: clears current, moves to previous

Below input:
  "Didn't receive OTP?" + "[Resend OTP]" link
  Resend timer: "Resend in 58s" (14px, #9CA3AF)
  After 60s: "Resend OTP" becomes active link (#0373DF)

Primary CTA: "Verify OTP"
```

#### Screen 3–5 — Sign In Active states

These appear to be states of the same screen rather than distinct pages (based on the Figma layout showing them in a row). They represent:
- Form partially filled
- Form fully filled (button activates)
- OTP entered (button active, ready to submit)

#### Screen 6 — Incorrect PIN / OTP Error

```
OTP input: all boxes red border (#EF4444)
Error message below: "Incorrect OTP. Please try again." (12px, #EF4444)
  With icon: ⚠ (warning, 14px)

Resend link: immediately active (bypasses timer on error)
```

---

### 7.6 Create New Account Flow

**Node IDs:** within `7048:33600`
**Dimensions:** 1440×952px
**Total screens:** 5

#### Screen 1 — Create Account

```
Heading: "Create New Account"
Sub-heading: "Register to access government welfare portals"

Fields (vertical stack, 16px gap):
  - Full Name (text)
  - Phone Number (tel, +91 prefix)
  - Email Address (email type) — optional label recommended
  - Date of Birth (date picker)
  - Aadhaar Number (12-digit numeric) — with privacy note

Aadhaar privacy note: "Your Aadhaar is encrypted and used only for identity verification."
  Font: 11px, #9CA3AF

Primary CTA: "Create Account"

Footer: "Already have an account? [Sign In]"
```

> **⚠️ Design gap:** No field-level validation rules specified in Figma. Developer should implement:
> Phone: 10-digit numeric
> Aadhaar: 12-digit numeric, Luhn-like check
> DOB: Must be ≥18 years old
> Email: RFC 5321 format

#### Screen 2 — Verify Phone (Send OTP)

```
Heading: "Verify your Phone Number"
Sub-heading (step indicator): "Step 1 of 2"

Display text: "We will send a verification code to:"
  Phone: +91-XXXXX-XXXXX (partially masked)

CTA: "Send Verification Code" (large, full-width)
Link: "Wrong number? [Go Back]"
```

#### Screen 3 — Verify Phone (Enter OTP)

```
Heading: "Verify your Phone Number"
Sub-heading: "Step 2 of 2"

Same 6-digit segmented OTP input as Sign In with OTP
Timer + Resend link (same spec)

CTA: "Verify & Continue"
```

#### Screen 4 — Create Password

```
Heading: "Create Password"
Sub-heading: "Choose a strong password for your account"

Fields:
  - New Password (with show/hide toggle)
  - Confirm Password (with show/hide toggle)

Password strength indicator:
  Visual bar (4 segments): Weak (red) → Fair (orange) → Good (yellow) → Strong (green)
  Text feedback: "Password is too short" / "Add a number" / "Strong password!"

Requirements checklist (shown beneath, updated live):
  ✓ At least 8 characters
  ✓ At least one number
  ✓ At least one special character

CTA: "Create Password"
```

> **⚠️ Design gap:** Password strength indicator is mentioned but not fully designed in the Figma. Implementation should follow NIST SP 800-63B guidelines (min 8 chars; no complexity rules required; check against common password list).

#### Screen 5 — Complete Your Profile

```
Heading: "Complete Your Profile"
Sub-heading: "Help us serve you better"

Fields:
  - State (dropdown, all 28 states + 8 UTs)
  - District (dropdown, dependent on State)
  - Category (SC / ST / OBC / General / Other)
  - PwD Status (Yes / No toggle)
  - If PwD Yes: Disability Type (dropdown)

CTA: "Save & Continue to [Portal Name]"
Skip link: "Skip for now →" (right-aligned, 12px, #6B7280)
```

---

### 7.7 Reset Password Flow

**Node IDs:** within `7048:35014`
**Dimensions:** 1440×952px
**Total screens:** 5

Screens 1–4 mirror the Create Account OTP verification flow, but stripped to credential-reset context.

#### Screen 1 — Reset Password

```
Heading: "Reset Password"
Sub-heading: "Enter your registered phone number or email"

Field: Phone/Email (combined input with radio toggle above: "Phone" | "Email")
CTA: "Send Reset Code"

Footer: "Remember your password? [Sign In]"
```

#### Screens 2 & 3 — OTP Verification

Identical spec to Create Account screens 2 & 3. Heading changes to "Verify your Identity".

#### Screen 4 — Create New Password

Same spec as Create Account Screen 4.

#### Screen 5 — Password Updated!

```
Full-height centred success state (no form):

  Icon: Animated checkmark (circle + tick, green #22C55E, 64×64px)
  Heading: "PIN Updated!" (24px, 700)
  Body: "Your password has been changed successfully." (16px, #374151)

  Primary CTA: "Go to Login" (full-width, nav-blue)
  Auto-redirect note: "Redirecting to login in 5s..."
```

---

### 7.8 Portal-Branded Login Backgrounds

**Node IDs:** within `8755:4593`
**Total variants:** 4 designed (7 portals total — 3 remaining need hero photos)

Each hero variant uses the same layout. Only the background photograph and portal identity badge change.

| Portal | Hero Theme | Status |
|---|---|---|
| SCW — Senior Citizens Welfare | Elderly citizens (warm, dignity-focused) | Designed |
| NMBA — Nasha Mukt Bharat Abhiyaan | Community/youth | Designed |
| SMILE - Transgender | Transgender inclusion imagery | Designed |
| SMILE - Beggary | Social inclusion scene | Designed (node `9178:57187` — verify name) |
| NOS / NHAPOA | Student/community scene | Designed (standalone frame `8774:24865`) |
| PM-AJAY | Rural community | Designed (standalone frame `8904:35114`) |
| E-Utthaan | Empowerment scene | Designed (standalone frame `9018:36746`) |

> **Implementation note:** Hero background should be a CSS `background-image` or `next/image` with `objectFit: cover`, not an `<img>` tag. The portal context is passed as a URL param or cookie to select the correct hero.

---

## 8. Portal Registry

Complete list of portals in the SAMAVESH ecosystem (from the Portals frame `8837:24702`):

| # | ID | Full Name | Logo Status | Tagline Status |
|---|---|---|---|---|
| 1 | SCW | Senior Citizens Welfare | ✅ Designed (100px) | ✅ Ready |
| 2 | SMILE-TG | National Portal for Transgender Persons | ✅ Designed | ✅ Ready |
| 3 | NOS | National Overseas Scholarship | ✅ Designed | ✅ Ready |
| 4 | NMBA | Nasha Mukt Bharat Abhiyaan | ✅ Designed | ✅ Ready |
| 5 | SMILE-BG | National Portal for Persons Engaged in Begging | ✅ Designed | ✅ Ready |
| 6 | E-Utthaan | Development Action Plan for Scheduled Caste | ✅ Designed | ✅ Ready |
| 7 | E-Anudaan | (unknown) | ✅ Designed | ❌ MISSING — "Description Text" placeholder |
| 8 | PM-AJAY | Pradhan Mantri Anusuchit Jaati Abhyuday Yojna | ✅ Designed | ✅ Ready |
| 9 | NHAPOA | National Helpline Against Atrocities | ✅ Designed | ✅ Ready |

> **Action required:** E-Anudaan tagline must be provided by content team before the portal list goes live.

---

## 9. Responsive Behaviour

### Breakpoints

| Breakpoint | Value | Target |
|---|---|---|
| Mobile | < 768px | Phones (primary citizen device) |
| Tablet | 768px – 1024px | iPads, Android tablets |
| Desktop | > 1024px | Laptops, desktops (primary admin device) |

> **Note:** Only Mobile (375px) and Desktop (1440px) are designed in Figma. Tablet behaviour is **not specified** and must be designed/decided. Recommendation: use mobile layout on tablet-portrait, desktop layout on tablet-landscape (1024px+ trigger).

### Element-by-Element Responsive Changes

| Element | Desktop | Mobile |
|---|---|---|
| Layout | Two-column split | Single-column stack |
| Hero photo | Full left panel (50vw) | Hidden |
| SAMAVESH brand block | In hero panel | Compact strip at top of form |
| Form card | Floating card (max-w 440px, shadow) | Full-width, no card chrome |
| Horizontal padding | 48px | 16px |
| Portal picker | Right panel replacement | Bottom sheet modal |
| Role tab switcher | Full width of form column | Full width |
| Ministry header | Single row | Wraps to 2 rows |

---

## 10. Interaction & Animation Specifications

| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Role tab switcher | Click/tap | Active indicator slides | 150ms | `ease-in-out` |
| Auth method tab | Click/tap | Underline slides | 150ms | `ease-in-out` |
| Portal picker (desktop) | Click "Change" | Right panel cross-fades | 200ms | `ease-out` |
| Portal picker (mobile) | Tap "Change" | Bottom sheet slides up | 300ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Portal picker dismissal | Tap ✕ or backdrop | Sheet slides down + backdrop fades | 250ms | `ease-in` |
| Portal card selection | Click | Orange border thickens to 2px + checkmark appears | 100ms | `ease` |
| OTP segmented input | Each digit entry | Auto-advance (instant) | — | — |
| OTP error state | Failed verify | Boxes shake + turn red | 400ms | `ease` — keyframes: 0% 100% → translate(0) 25% 75% → translate(-4px) 50% → translate(4px) |
| Sign In button loading | Form submit | Spinner replaces text | 100ms fade | — |
| Success animation (Reset PW) | On screen mount | Checkmark draw (stroke animation) | 600ms | `ease-out` |
| Password strength bar | On each keystroke | Segments fill left-to-right, colour transition | 200ms | `ease` |
| Form field focus | `:focus` | Blue ring expands | 150ms | `ease-out` |

---

## 11. Accessibility Requirements

These are government portals. WCAG 2.1 AA + GIGW compliance is **mandatory**. The following requirements apply to every screen in this file.

### Focus Management

- Focus must be managed explicitly on modal open (portal picker) — first focusable element inside the modal receives focus
- On modal close, focus returns to the element that triggered the modal ("Change" link)
- OTP input: after last digit, focus shifts to the Verify CTA automatically
- Error announcement: when form is submitted with errors, focus moves to the first error field; error text is linked via `aria-describedby`

### ARIA Requirements

| Component | Required ARIA |
|---|---|
| Role tab switcher | `role="tablist"`, each tab `role="tab"`, `aria-selected`, `aria-controls` |
| Auth method tabs | Same as above |
| OTP segmented input | Each box: `role="textbox"`, `aria-label="Digit 1 of 6"` (etc.), `inputmode="numeric"` |
| Portal picker modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to heading |
| Portal cards | `role="radio"` within `role="radiogroup"`, `aria-checked` on selected |
| Password strength | `role="status"`, `aria-live="polite"` — announces strength change to screen reader |
| Sign In button loading | `aria-busy="true"`, `aria-label="Signing in, please wait"` |
| Error messages | `role="alert"` or `aria-live="assertive"` |
| Forgot Password link | Must be after the Password label, not floating visually away (tab order) |

### Keyboard Navigation

- All interactive elements reachable via Tab
- Role tabs and Auth tabs: Arrow keys navigate within the group (roving tabindex)
- Portal picker: Arrow Up/Down navigate items, Enter selects, Escape closes
- DigiLocker button: Enter/Space activates
- Show/hide password toggle: accessible button with `aria-label="Show password"` / `"Hide password"`

### Colour Contrast

> **⚠️ Potential issue:** "Forgot Password?" link in the form appears to be ~12px. At #0373DF on white, the contrast ratio is approximately 4.5:1 — this barely passes AA for normal text but not for small text below 14px. **Recommend: increase to 14px or increase colour contrast to 7:1 (AAA).**

| Element | Foreground | Background | Ratio | Status |
|---|---|---|---|---|
| Body text (#111827 on white) | #111827 | #FFFFFF | ~19:1 | ✅ AAA |
| Secondary text (#6B7280 on white) | #6B7280 | #FFFFFF | ~4.48:1 | ⚠️ Borderline AA |
| Portal names (#F97316 on white) | #F97316 | #FFFFFF | ~3.09:1 | ❌ Fails AA |
| Global header text (white on #0A1628) | #FFFFFF | #0A1628 | ~17:1 | ✅ AAA |
| DigiLocker text (#4F46E5 on #EEF2FF) | #4F46E5 | #EEF2FF | ~5.22:1 | ✅ AA |
| Sign In button (white on #152040) | #FFFFFF | #152040 | ~15.8:1 | ✅ AAA |

### Touch Targets (Mobile)

All interactive elements on mobile must have minimum 44×44px touch target (WCAG 2.5.5). Current design appears compliant for primary elements; verify the "Forgot Password?" link (text-only, ~12px) meets this requirement by adding padding.

---

## 12. Error & Edge Case States

### Form Validation Errors

| Scenario | Behaviour |
|---|---|
| Submit with empty required field | Red border on field + "This field is required" below |
| Invalid email format | "Please enter a valid email address" |
| Phone number < 10 digits | "Phone number must be 10 digits" |
| Wrong credentials | Toast or inline: "Incorrect email/username or password." No field highlighting (security) |
| Account locked (5 failed attempts) | "Your account is locked. Try again after 30 minutes or reset your password." |
| OTP expired | "OTP has expired. Please request a new one." — Resend becomes immediately active |
| Aadhaar format invalid | "Aadhaar must be 12 digits" |
| Passwords do not match | "Passwords do not match" on Confirm Password field |
| Password too weak | "Password does not meet requirements" + specific checklist item highlighted red |

### Network / Loading States

| Scenario | Behaviour |
|---|---|
| Slow OTP send | Button shows spinner + "Sending OTP..." + disabled |
| OTP verify in flight | Same spinner pattern |
| DigiLocker redirect delay | Button shows "Connecting to DigiLocker..." + spinner |
| Portal list load failure | "Unable to load portals. [Retry]" in picker panel |

### Empty / No-Data States

| Scenario | Behaviour |
|---|---|
| No portal in URL context | Default to showing portal picker on page load |
| Portal logo fails to load | Show initial letter in coloured circle (e.g. "S" for SCW) |
| Long portal names | Truncate to 2 lines with ellipsis in picker cards |

---

## 13. Design Feedback & Recommendations

These observations are provided as a design review, separate from the implementation specs above. Prioritised by severity.

---

### Critical (must fix before launch)

**13.1 Portal name contrast fails accessibility**
Portal names in the picker are rendered in `#F97316` (orange) on a white background — contrast ratio ~3.09:1 against WCAG's required 4.5:1 for normal text. This is a legal compliance failure for a government product.
*Fix:* Darken orange to `#C2410C` (contrast 5.1:1, still warm) or use a text colour of `#92400E` (amber-800) for portal names.

**13.2 E-Anudaan has placeholder copy**
The portal card shows "Description Text" as the tagline. This will ship to production as garbage text if not caught.
*Fix:* Content team to supply real tagline before launch. Gate the portal behind a feature flag until ready.

**13.3 Duplicate frame name in Figma**
Two frames in `8755:4593` are both named "TG". One is SMILE-Transgender, the other is likely SMILE-Beggary. A developer following this file would implement the wrong hero for one portal.
*Fix:* Rename immediately per the renaming table in Section 2.

---

### Important (fix in next design sprint)

**13.4 No tablet breakpoint designed**
The Figma file jumps from 375px (mobile) to 1440px (desktop). ~30% of government portal usage comes from tablets (shared household devices). No design decision has been made on how the two-column layout collapses.
*Recommendation:* At 768px, switch to single-column layout (same as mobile). At 1024px+, enable two-column.

**13.5 DigiLocker button hierarchy confusion**
DigiLocker is promoted as the primary action (positioned first, prominent styling), but it's not the statistically primary login method for admin users (who never use DigiLocker). Admin role + DigiLocker creates a confusing context.
*Recommendation:* When "Admin" tab is selected, hide the DigiLocker button entirely (or de-emphasise to a small text link at the bottom). DigiLocker is a citizen-only auth mechanism.

**13.6 SIGNING INTO bar has no empty/default state**
If a user lands on the login page without a portal context (direct URL, shared link), the "SIGNING INTO" bar has no designed state.
*Recommendation:* Design a "No portal selected" state: "Choose a portal to continue →" in the bar, with the Change link replaced by "Select" in orange. Make it unmistakable.

**13.7 Registration flow has no designed mobile layout**
All 5 registration screens and all 5 reset-password screens are 1440×952px only. Mobile is not designed.
*Recommendation:* Registration and password reset must be mobile-first — citizen users registering for the first time overwhelmingly use phones. Prioritise mobile registration flow in the next design sprint.

**13.8 Complete Profile (Step 5) has no "Skip for now" visual design**
The skip link exists in the content spec but is not visually designed in the Figma frame. Its styling, placement, and interaction state are unknown.
*Recommendation:* Design explicitly — small text link, right-aligned, positioned below the primary CTA. Ensure it's accessible but visually de-prioritised.

---

### Minor (nice to have / polish)

**13.9 Hero photos lack diversity representation balance**
The current hero images predominantly feature certain demographics. For portals serving SC/ST communities, transgender persons, and persons with disabilities, ensure the hero photograph directly represents the beneficiary group.
*Recommendation:* Audit each portal's hero against its target population. Use representation-first photo selection criteria.

**13.10 OTP success state is missing**
After OTP is entered correctly and verified, the user should see a brief success micro-state (green flash on segmented boxes, or a checkmark) before navigating forward. This confirms to the user that their input was accepted.
*Recommendation:* Add 400ms success state to OTP input boxes (green border + tick icon) before transition.

**13.11 "PIN Updated!" heading uses wrong terminology**
The reset-password success screen says "PIN Updated!" — this creates ambiguity. The user set a *password*, not a PIN. PINs are numeric; this flow creates an alphanumeric password.
*Recommendation:* Change to "Password Updated!" or "Password Changed Successfully". Consistent with the heading on screen 4 which says "Create Password".

**13.12 No loading skeleton for portal list**
When the portal picker opens, there is no designed loading state for the portal list (in case it loads from an API). The user will see a blank panel before items appear.
*Recommendation:* Design a skeleton loader — 4–5 rows of shimmer cards matching the portal card height.

**13.13 Hero image has no low-bandwidth fallback**
The hero panels are full-bleed background photos. On slow 2G/3G connections (common in rural areas served by these portals), images will load slowly, leaving a blank or broken left panel.
*Recommendation:* Set a brand-coloured gradient as the CSS background-color fallback (`background: linear-gradient(135deg, #0A1628, #0373DF)`). The SAMAVESH logo + tagline overlaid on this gradient is still a valid, dignified presentation.

---

## 14. Implementation Notes

### Tech Stack Context

```
Framework: Next.js 15 (App Router) with React 19
Language: TypeScript (strict mode)
Styling: Tailwind CSS v3
Icons: lucide-react
Images: next/image (required for all portal hero photos)
Auth: JWT tokens stored in httpOnly cookies (NOT localStorage for auth tokens)
```

### Portal Context Architecture

The portal context (which portal the user is signing into) must be determined before the login page renders. Recommended approach:

```typescript
// URL structure: /login?portal=scw
// OR: /portals/scw/login (path-based — recommended for SSR)

// Component receives portal slug as prop
// Looks up portal config from registry
// Renders appropriate hero + "SIGNING INTO" bar
```

### Portal Registry Type

```typescript
interface Portal {
  slug: string;                    // 'scw' | 'smile-tg' | 'nos' | ...
  name: string;                    // Display name
  fullName: string;                // Long name for tagline
  logo: string;                    // Path to logo (100×100px PNG)
  heroImage: string;               // Path to hero photo
  roles: ('citizen' | 'admin')[];  // Which roles can log in here
  digilockerEnabled: boolean;      // Show DigiLocker button?
}
```

### DigiLocker Integration

DigiLocker auth is an OAuth 2.0 redirect flow managed by the NIC/DigiLocker API. This page only needs to render the button and initiate the redirect. No intermediate screens required in SAMAVESH.

### OTP Input Component

Implement as a controlled component with a single hidden `<input type="tel">` for mobile keyboard compatibility. Display 6 individual `<div>` boxes visually. This approach ensures:
- Mobile number keypad opens automatically
- Paste works correctly (pastes all 6 digits)
- Screen readers read it as a single field

### Password Strength

Use `zxcvbn` (Dropbox open-source library) for password strength scoring — it evaluates real-world password patterns rather than arbitrary complexity rules. Returns a score 0–4 which maps to Weak/Fair/Good/Strong.

### Form Validation

Use `react-hook-form` with `zod` schema validation. Server-side re-validate all inputs — client validation is UX, not security.

### Session Handling

After successful authentication:
- Store JWT in httpOnly, Secure, SameSite=Strict cookie
- Do NOT store in localStorage (XSS risk)
- Redirect to portal dashboard using `router.replace()` (not `push()`) so Back button doesn't return to login

---

*End of Design Handoff — SAMAVESH Login/Signup v1.0*
*For questions: contact the MoSJE design system team.*
