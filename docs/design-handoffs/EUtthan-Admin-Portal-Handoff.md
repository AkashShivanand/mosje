# eUtthan Admin Portal — Design Handoff

**File:** `MoSJE Portal — Handoff` · Figma page: `E-Utthan`  
**Figma URL:** https://www.figma.com/design/gH2vQ62cfg4677YKWuOpLc/MoSJE-Portal--Handoff-?node-id=4226-36929  
**Portal Route:** `/portals/eutthan-admin`  
**Last Audited:** June 2026  
**Design System:** SAMAVESH · Tailwind v3 + shadcn/Radix  
**Status:** Handoff Ready

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [Page Organisation](#2-page-organisation)
3. [Screen Inventory](#3-screen-inventory)
4. [User Flows](#4-user-flows)
5. [Layout Architecture](#5-layout-architecture)
6. [Design Tokens](#6-design-tokens)
7. [Admin Portal — Screen Specs](#7-admin-portal--screen-specs)
8. [Ministry Portal — Screen Specs](#8-ministry-portal--screen-specs)
9. [Login & Authentication — Screen Specs](#9-login--authentication--screen-specs)
10. [Interaction Specifications](#10-interaction-specifications)
11. [Responsive Behaviour](#11-responsive-behaviour)
12. [Accessibility Notes](#12-accessibility-notes)
13. [Error & Edge Cases](#13-error--edge-cases)
14. [Design Feedback & Issues](#14-design-feedback--issues)
15. [Implementation Notes](#15-implementation-notes)

---

## 1. Executive Overview

The **eUtthan Admin Portal** is a role-based workflow portal for the Ministry of Social Justice & Empowerment (MoSJE). It enables central MoSJE administrators and Ministry-level officers to manage physical progress data, scheme outcomes, financial year configurations, and document compliance — all in one authenticated interface.

### Purpose

| Role | Who | Key Jobs |
|------|-----|----------|
| **Admin** | Central MoSJE staff | Configure financial years, register ministries/schemes/outcomes, upload documents, map entities to PFMS, manage user accounts |
| **Ministry** | Ministry officer (e.g. Ashok S, Ministry Affairs) | Report physical progress data, import bulk data via Excel, track scheme outcomes |

### Scope of this document

This handoff covers **38 screens** across 3 sections:
- `01 — ADMIN PORTAL` — 25 screens
- `02 — MINISTRY PORTAL` — 9 screens
- `03 — LOGIN & AUTHENTICATION` — 4 screens (Desktop + Mobile)

---

## 2. Page Organisation

### Figma File Structure

Section fills use a two-level grey hierarchy: `#EAEAEA` (portal sections) → `#E3E3E3` (sub-sections).

```
E-Utthan  (Figma Page)
│
├── 03 — LOGIN & AUTHENTICATION  [SECTION] (#EAEAEA)
│   ├── Desktop  [sub-section] (#E3E3E3)
│   │   ├── Login / Sign In / Desktop
│   │   └── Login / Choose Portal / Desktop
│   └── Mobile  [sub-section] (#E3E3E3)
│       ├── Login / Sign In / Mobile
│       └── Login / Choose Portal / Mobile
│
├── 01 — ADMIN PORTAL  [SECTION] (#EAEAEA)
│   ├── Admin / Dashboard
│   ├── Financial Year  [sub-section] (#E3E3E3)
│   │   ├── Admin / Manage Financial Year
│   │   ├── Admin / Manage Financial Year / Success State
│   │   ├── Admin / Add Financial Year
│   │   └── Admin / Edit Financial Year
│   ├── Ministry  [sub-section] (#E3E3E3)
│   │   ├── Admin / Manage Ministry
│   │   └── Admin / Add Ministry
│   ├── Scheme  [sub-section] (#E3E3E3)
│   │   ├── Admin / Manage Scheme
│   │   ├── Admin / Manage Scheme / Scrolled
│   │   └── Admin / Add Scheme
│   ├── Outcome  [sub-section] (#E3E3E3)
│   │   ├── Admin / Manage Outcome
│   │   ├── Admin / Manage Outcome / Scrolled
│   │   └── Admin / Add Outcome
│   ├── Documents  [sub-section] (#E3E3E3)
│   │   ├── Admin / Documents
│   │   ├── Admin / Documents / Add Document — Step 1
│   │   └── Admin / Documents / Add Document — Step 2
│   ├── Map Ministry & Schemes  [sub-section] (#E3E3E3)
│   │   ├── Admin / Map Ministry / Mapped
│   │   ├── Admin / Map Ministry / Unmapped
│   │   ├── Admin / Map Ministry / Map
│   │   ├── Admin / Map Schemes / Unmapped
│   │   ├── Admin / Map Schemes / Mapped
│   │   ├── Admin / Map Schemes / Map
│   │   └── Admin / Map Schemes / Unmap
│   └── User Management  [sub-section] (#E3E3E3)
│       ├── Admin / Manage User
│       └── Admin / Manage User / Add User
│
└── 02 — MINISTRY PORTAL  [SECTION] (#EAEAEA)
    ├── Ministry / Dashboard
    ├── Physical Progress  [sub-section] (#E3E3E3)
    │   ├── Ministry / Physical Progress Data
    │   ├── Ministry / Physical Progress Data / Add
    │   ├── Ministry / Physical Progress Data / Import With Excel — Step 1
    │   └── Ministry / Physical Progress Data / Import With Excel — Step 2
    ├── Scheme  [sub-section] (#E3E3E3)
    │   ├── Ministry / Manage Scheme
    │   └── Ministry / Manage Scheme / Add Scheme
    └── Outcome  [sub-section] (#E3E3E3)
        ├── Ministry / Manage Outcome
        └── Ministry / Manage Outcome / Add
```

### Frame Naming Convention

```
Role / Screen Name / State
```

Examples:
- `Admin / Manage Scheme / Scrolled` — Admin role, Manage Scheme screen, scrolled state
- `Ministry / Physical Progress Data / Import With Excel — Step 1` — Ministry role, step 1 of import

---

## 3. Screen Inventory

### 3.1 Login & Authentication (4 screens)

| Frame | Node ID | Viewport | Description |
|-------|---------|----------|-------------|
| Login / Sign In / Desktop | `9009:95752` | 1440px | Two-panel login: Illustration left, form right. Email + password fields, Login button. |
| Login / Choose Portal / Desktop | `9009:96020` | 1440px | Post-login portal selection: Cards for available portals the user has access to. |
| Login / Sign In / Mobile | `9149:27258` | 375px | Single-column login form. Same fields, mobile-optimised layout. |
| Login / Choose Portal / Mobile | `9149:27538` | 375px | Stacked portal cards for mobile selection. |

### 3.2 Admin Portal (25 screens)

| Frame | Node ID | Description |
|-------|---------|-------------|
| Admin / Dashboard | `4226:39685` | Overview stats: scheme count, ministry count, expenditure totals, allocation vs actuals, pie chart of top 5 schemes by expenditure. Logged in as "Vikas S, Admin". |
| Admin / Manage Financial Year | `4226:40009` | Financial Year List table: Financial Year column, Current Financial Year checkbox column, Action column (edit/delete icons). Search bar. "+ Add Financial Year" primary CTA. |
| Admin / Manage Financial Year / Success State | `4226:40148` | Same as above with "Financial Year Added Successfully" green toast notification at bottom-right. Auto-dismisses after 3s. |
| Admin / Add Financial Year | `4226:43777` | Form: "Add Financial Year". Two fields: Financial Year (text input, e.g. 2025-2026) + Current Financial Year (dropdown: Yes/No). Back + Add buttons. |
| Admin / Edit Financial Year | `4226:44550` | Form: "Edit Financial Year". Same two fields pre-filled. Back + Save buttons. Role shown as "Admin" in header. |
| Admin / Manage Ministry | `4226:40288` | Ministry list table: Ministry Name, Grant No. 10A, Grant No. PFMS, Financial Year. Search + filter. "+ Add Ministry" CTA. Paginated (10 per page). |
| Admin / Add Ministry | `4226:43881` | Form: "Add Ministry/Department". Fields: Financial Year (dropdown), Ministry/Department for Previous ID (dropdown), Ministry/Department Name (text), Grant No. 10A (text), Grant No. PFMS (text). Reset + Back + Add buttons. |
| Admin / Manage Scheme | `4226:40449` | Scheme list table: Scheme Code, Scheme Name, Sub Scheme, Allocation, DAPSC, Percent, Revised Estimates. Filterable. "+ Add Scheme" CTA. |
| Admin / Manage Scheme / Scrolled | `4226:43077` | Same table but scrolled down — shows lower rows. Used to demonstrate full data set in handoff. |
| Admin / Add Scheme | `4226:43990` | Form: "Add Scheme". Fields: Financial Year (dropdown), Ministry/Department (dropdown), Scheme Code (text), Scheme Name (text), Sub Scheme Code, Sub Scheme Name, Total Allocation (Cr), DAPSC Allocation (Cr), Allocation Percent (%), Revised Estimates (Cr), Scheme Code PFMS. Reset + Back + Add. |
| Admin / Manage Outcome | `4226:40657` | Outcome list table: Scheme, Ministry/Department, Financial Year, Outcome. Filterable. "+ Add Outcome" CTA. |
| Admin / Manage Outcome / Scrolled | `4226:43305` | Same table scrolled down. |
| Admin / Add Outcome | `4226:44105` | Form: "Add Outcome". Fields: Financial Year (dropdown), Ministry/Department for Previous ID (dropdown), Scheme Type (dropdown), Scheme Name (dropdown), Outcomes section with Outcome 1 + Outcome 2 text areas + "Add Outcome" link. Reset + Back + Add. |
| Admin / Documents | `4226:42902` | Documents list table: Document Type, Date, Subject, File (link), Financial Year, Action. Search + filter. "+ Add Document" CTA. |
| Admin / Documents / Add Document — Step 1 | `4226:44221` | Form: "Add Document". Step 1 (file not yet uploaded). Fields: Document Type (dropdown, default "Letter"), Date (date picker). Subject (textarea). Large upload dropzone: "Click to Upload Letter, PDF Max 10 MB". Reset + Back + Add. |
| Admin / Documents / Add Document — Step 2 | `4226:44329` | Same form but file is attached: "Letter.pdf · 1.8 Mb" with Change + Delete icons. Financial Year dropdown now visible. Document Type changed to "Statement of 10A". Add button enabled. |
| Admin / Map Ministry / Mapped | `4226:41073` | "Mapped Ministry List" — table showing ministries already mapped to PFMS. Tabs: Mapped (active) / Unmapped. Filters: Financial Year. Each row has "Map →" action. |
| Admin / Map Ministry / Unmapped | `4226:41283` | Same table with Unmapped tab active. Rows have N/A in PFMS field. |
| Admin / Map Ministry / Map | `4226:42430` | "Import Achievement Data" modal overlay on Mapped Ministry List background. Maps a Ministry to a PFMS Ministry entity. |
| Admin / Map Schemes / Mapped | `9141:23303` | "Mapped Ministry List" — scheme mapping view. Mapped tab active. |
| Admin / Map Schemes / Unmapped | `4226:41490` | Same with Unmapped tab active. |
| Admin / Map Schemes / Map | `9140:53063` | Map action modal overlay for schemes. |
| Admin / Map Schemes / Unmap | `9142:25252` | Unmap action modal overlay. Confirmation dialog. |
| Admin / Manage User | `4226:40865` | User list table: Name, Email, Role, Status. "+ Add User" CTA. |
| Admin / Manage User / Add User | `4226:44437` | Form: "Add User". Fields for name, email, role assignment, ministry assignment. |

### 3.3 Ministry Portal (9 screens)

| Frame | Node ID | Description |
|-------|---------|-------------|
| Ministry / Dashboard | `4226:37114` | Overview for Ministry role. Stats: schemes count (8), achieving (0), missing (8), no data (4). Financial year progress table with totals: Approved Outlay ₹230.74, Expenditure ₹249.98, BE ₹248.5990. Utilisation %: -1.3821. Pie chart of top 5 schemes by expenditure. |
| Ministry / Physical Progress Data | `4226:38368` | Physical Progress Data table: Scheme, Ministry/Department, Financial Year, Units, Options buttons. Filters: All Ministries / All Financial Years. "+ Import/Add Data" CTA. Paginated. |
| Ministry / Physical Progress Data / Add | `4226:39568` | Form: "Add Physical Progress". Fields: Unattributed Social Development Fund name, Linked Central Scheme, Scheme (dropdown), Ministry/Affairs (dropdown), FY (dropdown), Sanction Target, Revised Target, Compliance Type (dropdown), No. of Beneficiaries, Remarks. Back + Save. |
| Ministry / Physical Progress Data / Import With Excel — Step 1 | `9238:60478` | "Import Achievement Data" modal. Step 1: file drop zone. Title "Import with Excel". Subtitle "Upload your Excel file and import all achievements data." Empty dropzone with spreadsheet icon. "CSV/Excel · Max 5MB". "Do not have a template? Click to Download Template" link. |
| Ministry / Physical Progress Data / Import With Excel — Step 2 | `9239:65630` | Same modal. Step 2: file selected. Shows "Data 2025-26.csv · 1.8 Mb" with Change + Delete icons. "CSV/Excel · Max 5MB". Primary "Import" button now enabled. |
| Ministry / Manage Scheme | `4226:37360` | Scheme List for Ministry user. Table: Scheme Name, Ministry/Department, Financial Year, Options. Filters: All Financial Years / All Statuses. "+ Add Scheme" CTA. Paginated. |
| Ministry / Manage Scheme / Add Scheme | `4226:38254` | Form: "Add Scheme". Fields: Financial Year (dropdown), Scheme Name (text), Scheme Code (text), Sub Scheme Name, Sub Scheme Code, Total Allocation (Cr), DAPSC Allocation (Cr), Allocation Percent (%), Revised Estimates (Cr), Scheme Code PFMS. Reset + Back + Add. Note: Ministry role has different field layout vs Admin role (no Ministry/Department dropdown — pre-scoped to Ministry). |
| Ministry / Manage Outcome | `4226:38577` | Scheme wise Outcome List. Table: Scheme, Ministry/Department, Financial Year, Outcome. Filters available. "+ Add Outcome" CTA. |
| Ministry / Manage Outcome / Add | `4226:39013` | Form: "Add Outcome". Fields: Financial Year (dropdown), Ministry/Department for Previous ID (dropdown), Scheme Type (dropdown), Scheme Name (dropdown), Outcome Type (dropdown), Outcome (text area). Reset + Back + Save. |

---

## 4. User Flows

### Flow 1 — Admin: Configure Financial Year

```
Login (Admin credentials)
  └→ Admin / Dashboard
       └→ Sidebar: "Manage Financial Year"
            └→ Admin / Manage Financial Year
                 ├→ Click "+ Add Financial Year"
                 │    └→ Admin / Add Financial Year
                 │         ├→ Fill: Financial Year (e.g. 2026-2027)
                 │         ├→ Set: Current Financial Year = Yes/No
                 │         └→ Click "Add"
                 │              └→ Admin / Manage Financial Year / Success State
                 │                   (toast: "Financial Year Added Successfully")
                 └→ Click edit (✏) on existing row
                      └→ Admin / Edit Financial Year
                           └→ Modify fields → Click "Save"
                                └→ Admin / Manage Financial Year (refreshed)
```

### Flow 2 — Admin: Register a Ministry and Scheme

```
Admin / Dashboard
  ├→ Sidebar: "Manage Ministry"
  │    └→ Admin / Manage Ministry
  │         └→ Click "+ Add Ministry"
  │              └→ Admin / Add Ministry
  │                   └→ Fill fields → "Add" → back to MANAGE MINISTRY
  │
  └→ Sidebar: "Manage Scheme"
       └→ Admin / Manage Scheme
            └→ Click "+ Add Scheme"
                 └→ Admin / Add Scheme
                      └→ Fill fields (includes scheme code, allocation amounts) → "Add"
```

### Flow 3 — Admin: Upload a Compliance Document

```
Admin / Dashboard
  └→ Sidebar: "Manage Documents"
       └→ Admin / Documents
            └→ Click "+ Add Document"
                 └→ Admin / Documents / Add Document — Step 1
                      ├→ Select Document Type (dropdown)
                      ├→ Pick date
                      ├→ Write subject
                      └→ Upload file (drag or click)
                           └→ Admin / Documents / Add Document — Step 2
                                (file preview shown, Financial Year dropdown appears)
                                └→ Click "Add" → back to Admin / Documents
```

### Flow 4 — Admin: Map a Ministry to PFMS

```
Admin / Dashboard
  └→ Sidebar: "Map Ministry/Schemes"
       └→ Admin / Map Ministry / Unmapped
            (Unmapped tab shows ministries not yet mapped)
            └→ Click "Map →" on a ministry row
                 └→ Admin / Map Ministry / Map
                      (modal: select PFMS Ministry entity)
                      └→ Confirm → back to Admin / Map Ministry / Mapped
                           (ministry now appears in Mapped tab)
```

### Flow 5 — Ministry: Import Physical Progress via Excel

```
Login (Ministry credentials)
  └→ Ministry / Dashboard
       └→ Sidebar: "Physical Progress"
            └→ Ministry / Physical Progress Data
                 └→ Click "+ Import/Add Data" → "Import with Excel"
                      └→ Ministry / Physical Progress Data / Import With Excel — Step 1
                           (modal: empty drop zone)
                           └→ Drop or select Excel/CSV file
                                └→ Ministry / Physical Progress Data / Import With Excel — Step 2
                                     (modal: file preview "Data 2025-26.csv · 1.8 Mb")
                                     └→ Click "Import"
                                          └→ Modal closes → data loads into table
```

### Flow 6 — Ministry: Add a Scheme Outcome

```
Ministry / Dashboard
  └→ Sidebar: "Manage Outcome"
       └→ Ministry / Manage Outcome
            └→ Click "+ Add Outcome"
                 └→ Ministry / Manage Outcome / Add
                      ├→ Select Financial Year
                      ├→ Select Ministry/Department
                      ├→ Select Scheme Type + Scheme Name
                      ├→ Select Outcome Type
                      └→ Enter Outcome text
                           └→ Click "Save" → back to Ministry / Manage Outcome
```

---

## 5. Layout Architecture

### 5.1 Canvas Layout

All frames are 1440 × 960px (desktop). The Figma canvas is organised into 3 Sections:

| Section | Canvas X | Canvas Y | Dimensions |
|---------|----------|----------|------------|
| 01 — ADMIN PORTAL | -10378 | -6828 | 10652 × 12557px |
| 02 — MINISTRY PORTAL | 1049 | -6828 | 6080 × 4459px |
| 03 — LOGIN & AUTHENTICATION | -10378 | -9319 | 4350 × 1360px |

### 5.2 Page Shell

Both Admin and Ministry portals share the same outer shell:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Accessibility Bar (full width, ~40px)                               │
│ Skip to Main Content | Font controls | Contrast | Accessibility | Lang
├──────────────────────────────────────────────────────────────────────┤
│ Site Header (~80px)                                                  │
│ [Gov Logo + Emblem] [Ministry Name]  [Digital India] [SAMAVESH] [User]
├─────────────┬────────────────────────────────────────────────────────┤
│             │                                                         │
│  Sidebar    │  Main Content Area                                      │
│  (~174px)   │  (fluid, 1266px at 1440px)                             │
│             │                                                         │
│  Nav items  │  Page title + primary CTA (top right)                  │
│             │  Content (tables / forms)                               │
│             │                                                         │
└─────────────┴────────────────────────────────────────────────────────┘
```

### 5.3 Sidebar Navigation

**Admin sidebar** (10 items):
1. Dashboard
2. Manage Financial Year
3. Manage Ministry
4. Manage Scheme
5. Manage Outcome
6. Manage Documents
7. Map Ministry/Schemes
8. Reports ▸ (expandable)
9. User Management
10. Role Management
11. PFMS Logs

**Ministry sidebar** (4 items):
1. Dashboard
2. Physical Progress
3. Manage Scheme
4. Manage Outcome
5. Reports ▸ (expandable)

Active sidebar item highlighted with gov-blue background (`#0373DF`).

### 5.4 Table Layout Pattern

All list screens follow a consistent table pattern:

```
[Page Title]                                        [Primary CTA Button]
[Search bar]                                 [Filter 1 ▼] [Filter 2 ▼]
┌─────────────────┬──────────────┬──────────┬───────────────────────────┐
│ Column 1        │ Column 2     │ Column 3 │ Action                    │
├─────────────────┼──────────────┼──────────┼───────────────────────────┤
│ Row data        │              │          │ [Edit ✏] [Delete 🗑]      │
│ (selected/hover)│              │          │                           │
└─────────────────┴──────────────┴──────────┴───────────────────────────┘
                            Pagination: [◀ 1 2 3 ... 125 ▶] Showing 10 ▼ of 1248
```

### 5.5 Form Layout Pattern

All add/edit forms follow this pattern:

```
[Form Title]

[Field Label *]              [Field Label *]
[Input / Dropdown]           [Input / Dropdown]

[Field Label]
[Textarea or Upload Zone]

[Reset]              [Back]  [Primary Action]
```

- Two-column grid for short fields (label + input pairs)
- Full-width for textareas, upload zones, and long-form fields
- Required fields marked with red asterisk `*`
- Action buttons right-aligned

---

## 6. Design Tokens

All tokens are defined in `packages/tokens/` and consumed in `packages/design-system/`. Reference the `@mosje/tokens` package, not hardcoded values.

### Colour Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `gov-blue` | `#0373DF` | Primary CTA buttons, sidebar active state, links |
| `navy` | `#0A1628` | Accessibility bar, site header, section banners |
| `saffron` | `#F97316` | Accent: tags, active indicators, warning states |
| `gov-yellow` | `#FFD323` | Secondary accent (rarely used in this portal) |
| `ink` | `#2D3240` | Primary body text, table data |
| `ink-subtle` | `#6B738A` | Secondary text, placeholder, meta information |
| `surface-muted` | `#F5F6F8` | Page background, table row hover (alternate) |
| `surface` | `#FFFFFF` | Card/modal backgrounds, form backgrounds |
| `divider` | `#D9DDE7` | Table borders, section dividers, card outlines |
| `success` | `#1EA563` | Success states, "Added Successfully" toast |
| `error` | `#DC2626` | Error states, required field markers, delete icons |
| `warning` | `#F97316` | Warning messages (shares saffron value) |

### Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `font-family` | Noto Sans (primary) | All body text, UI labels, form fields |
| `font-heading-xl` | 22px / Bold | Page titles in modals, handoff headers |
| `font-heading-lg` | 18px / Semi Bold | Page titles (e.g. "Financial Year List") |
| `font-heading-md` | 16px / Semi Bold | Section headings, form titles |
| `font-body` | 14px / Regular | Table data, form labels, body text |
| `font-body-sm` | 13px / Regular | Supporting text, filters, pagination |
| `font-caption` | 12px / Regular | Captions, file metadata, badge labels |
| `font-badge` | 11px / Medium | Status badges, count indicators |

### Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-xs` | 4px | Inner badge padding |
| `spacing-sm` | 8px | Tight gaps between related items |
| `spacing-md` | 16px | Standard padding, between form rows |
| `spacing-lg` | 24px | Section padding, card padding |
| `spacing-xl` | 32px | Page section gaps |
| `spacing-2xl` | 40px | Page horizontal padding |

---

## 7. Admin Portal — Screen Specs

### 7.1 Dashboard

**Figma node:** `4226:39685`

The Admin dashboard shows a cross-ministry performance summary for the current financial year.

**Stat cards (top row):**
| Stat | Value shown | Notes |
|------|-------------|-------|
| Schemes | 14 | Total schemes configured |
| Achieving | 22 | Schemes meeting targets |
| Missing | 10 | Below-target schemes |
| No Data | 4 | No progress reported |

**Progress of Financial Year table:**
- Columns: Approved Outlay (₹ Cr), Expenditure (₹ Cr), BE (₹ Cr), Target %, Revised %, Utilisation %
- Values are live from backend; zeros expected until data entry begins

**Pie chart:** Top 5 Schemes by Expenditure (2024-25). Legend shows scheme names.

---

### 7.2 Manage Financial Year

**States:**
1. **Default list** (`4226:40009`) — table of financial years, current year marked with blue checkbox
2. **Success state** (`4226:40148`) — same table with green toast bottom-right

**Table columns:** Financial Year | Current Financial Year (checkbox) | Action (✏ edit / 🗑 delete)

**Behaviour notes:**
- Only one financial year can be "Current" at a time — checking one should uncheck others
- Delete should show confirmation modal (not designed — implement as standard destructive dialog)
- Toast auto-dismisses after 3 seconds

---

### 7.3 Add Financial Year

**Figma node:** `4226:43777`

**Form fields:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Financial Year | Text input | ✓ | Format: YYYY-YYYY (e.g. 2025-2026) |
| Current Financial Year | Dropdown (Yes/No) | ✓ | — |

**Actions:** Back (navigate back to list) · Add (submit)

---

### 7.4 Edit Financial Year

**Figma node:** `4226:44550`

Identical form to Add, pre-filled with existing values. Role shown as "Admin" in header.

**Actions:** Back · Save

---

### 7.5 Manage Ministry

**Figma node:** `4226:40288`

**Table columns:** Ministry Name | Grant No. 10A | Grant No. PFMS | Financial Year | Action

**Behaviours:**
- Search filters by ministry name
- Filter by Financial Year (dropdown)
- Pagination: 10 per page, shows total count
- Edit → navigates to edit form (not separately designed — reuse Add Ministry form with pre-fill)

---

### 7.6 Add Ministry

**Figma node:** `4226:43881`

**Form fields:**
| Field | Type | Required |
|-------|------|----------|
| Financial Year | Dropdown | ✓ |
| Ministry/Department for Previous ID | Dropdown | ✓ |
| Ministry/Department Name | Text input | ✓ |
| Grant No. 10A | Text input | ✓ |
| Grant No. PFMS | Text input | ✓ |

---

### 7.7 Manage Scheme

**Figma nodes:** `4226:40449` (list) · `4226:43077` (scrolled)

**Table columns:** Scheme Code | Scheme Name | Sub Scheme | Total Allocation (Cr) | DAPSC Allocation (Cr) | Allocation Percent (%) | Revised Estimates (Cr) | Action

The scrolled state (`Admin / Manage Scheme / Scrolled`) shows the table with more rows visible — confirm column widths hold at full data.

---

### 7.8 Add Scheme

**Figma node:** `4226:43990`

**Form fields:**
| Field | Type | Required |
|-------|------|----------|
| Financial Year | Dropdown | ✓ |
| Ministry/Department | Dropdown | ✓ |
| Scheme Code | Text input | ✓ |
| Scheme Name | Text input | ✓ |
| Sub Scheme Code | Text input | — |
| Sub Scheme Name | Text input | — |
| Total Allocation (Cr) | Number input | ✓ |
| DAPSC Allocation (Cr) | Number input | ✓ |
| Allocation Percent (%) | Number input (auto-calculated) | — |
| Revised Estimates (Cr) | Number input | — |
| Scheme Code PFMS | Text input | — |

---

### 7.9 Manage Outcome

**Figma nodes:** `4226:40657` (list) · `4226:43305` (scrolled)

**Table columns:** Scheme | Ministry/Department | Financial Year | Outcome | Action

---

### 7.10 Add Outcome

**Figma node:** `4226:44105`

**Form fields:**
| Field | Type | Required |
|-------|------|----------|
| Financial Year | Dropdown | ✓ |
| Ministry/Department for Previous ID | Dropdown | ✓ |
| Scheme Type | Dropdown | ✓ |
| Scheme Name | Dropdown (filtered by Scheme Type) | ✓ |
| Outcome 1 | Textarea | ✓ |
| Outcome 2 | Textarea | — |
| + Add Outcome | Link (adds more outcome fields) | — |

---

### 7.11 Documents

**Figma node:** `4226:42902`

**Table columns:** Document Type | Date | Subject | File (download link) | Financial Year | Action

---

### 7.12 Add Document — Step 1 (Upload)

**Figma node:** `4226:44221`

**Form fields:**
| Field | Type | Required |
|-------|------|----------|
| Document Type | Dropdown | ✓ |
| Date | Date picker | ✓ |
| Subject | Textarea | — |
| File Upload | Dropzone | ✓ |

**Upload zone:** "Click to Upload [Document Type], PDF Max 10 MB"  
Document type shown in upload CTA changes dynamically to match selected type.

**Key behaviour:** The "Financial Year" dropdown is hidden in Step 1 and only appears after a file is successfully attached (Step 2).

---

### 7.13 Add Document — Step 2 (File Selected)

**Figma node:** `4226:44329`

After file upload, the dropzone transforms into a file preview row:
```
[📄 icon]  Letter.pdf · 1.8 Mb    [Change]  [🗑 Delete]
```

**Financial Year dropdown** now appears below the file preview.

---

### 7.14 Map Ministry

Three states showing the mapping workflow between MoSJE Ministries and PFMS Ministries.

| Frame | Node ID | Tab | Content |
|-------|---------|-----|---------|
| MAP MINISTRY / MAPPED | `4226:41073` | Mapped | Ministries linked to PFMS entities; shows PFMS Ministry name in column |
| MAP MINISTRY / UNMAPPED | `4226:41283` | Unmapped | Ministries with N/A PFMS Ministry; each row has "Map →" action |
| MAP MINISTRY / MAP | `4226:42430` | — | "Import Achievement Data" modal overlaid on the list |

**Page header:** "Mapped Ministry List"  
**Filters:** Unmapped ▼ · All Financial Year ▼  
**Pagination:** Shows "Showing 10 ▼ of 1248 items"

---

### 7.15 Map Schemes

Four states for scheme mapping.

| Frame | Node ID | Description |
|-------|---------|-------------|
| MAP SCHEMES / MAPPED | `9141:23303` | Mapped schemes tab |
| MAP SCHEMES / UNMAPPED | `4226:41490` | Unmapped schemes tab |
| MAP SCHEMES / MAP | `9140:53063` | Map action modal |
| MAP SCHEMES / UNMAP | `9142:25252` | Unmap confirmation modal |

---

### 7.16 Manage User

**Figma node:** `4226:40865`

**Table columns:** Name | Email | Role | Ministry | Status | Action  
**CTA:** "+ Add User"

---

### 7.17 Add User

**Figma node:** `4226:44437`

Form for creating a new portal user, including role assignment and ministry linkage.

---

## 8. Ministry Portal — Screen Specs

### 8.1 Dashboard

**Figma node:** `4226:37114`

Ministry dashboard is scoped to the logged-in user's ministry (Ashok S, Ministry Affairs).

**Stat cards:**
| Stat | Value |
|------|-------|
| Schemes | 8 |
| Achieving | 0 |
| Missing | 8 |
| No Data | 4 |

**Progress of Financial Year (2024-25):**
| Metric | Value |
|--------|-------|
| Approved Outlay | ₹230.74 Cr |
| Expenditure | ₹249.98 Cr |
| BE | ₹248.5990 Cr |
| Targets (No. Beneficiaries) | 107.14% |
| Financial Targets | 98.89% |
| Utilisation | ₹-1.3821 Cr |

---

### 8.2 Physical Progress Data

**Figma node:** `4226:38368`

**Table columns:** Scheme | Ministry/Department | Financial Year | Units | Options (Edit)

**Filters:** All Ministries ▼ · All Financial Years ▼  
**Pagination:** Multiple pages

---

### 8.3 Add Physical Progress

**Figma node:** `4226:39568`

Form title: "Add Physical Progress"

**Form fields:**
| Field | Type |
|-------|------|
| Unattributed Social Development Fund Name | Text input |
| Linked Central Scheme | Text input |
| Scheme | Dropdown |
| Ministry/Affairs | Dropdown |
| FY | Dropdown |
| Sanction Target | Number input |
| Revised Target | Number input |
| Compliance Type | Dropdown |
| No. of Beneficiaries | Number input |
| Remarks | Textarea |

**Actions:** Back · Save

---

### 8.4 Import with Excel — Step 1

**Figma node:** `9238:60478`

Modal overlay on Physical Progress Data page.

```
┌────────────────────────────────────────────────┐
│  Import Achievement Data                   [✕] │
│                                                │
│        ┌─────────────────────────┐            │
│        │     [spreadsheet icon]  │            │
│        │                         │            │
│        │  Import with Excel      │            │
│        │  Upload your Excel file │            │
│        │  and import all data.   │            │
│        └─────────────────────────┘            │
│                                                │
│  CSV/Excel · Max 5MB                           │
│                                                │
│  Do not have a template?                       │
│  Click to Download Template                    │
└────────────────────────────────────────────────┘
```

**Note:** Label updated from "PDF Only" to "CSV/Excel · Max 5MB" — correctly reflects accepted file formats.

---

### 8.5 Import with Excel — Step 2

**Figma node:** `9239:65630`

Same modal, file selected state:

```
┌────────────────────────────────────────────────┐
│  Import Achievement Data                   [✕] │
│                                                │
│  [📄] Data 2025-26.csv · 1.8 Mb  [Change] [🗑] │
│                                                │
│  CSV/Excel · Max 5MB                           │
│                                                │
│              [    Import    ]                  │
└────────────────────────────────────────────────┘
```

"Import" button primary (gov-blue). Disabled until file is attached.

---

### 8.6 Manage Scheme (Ministry)

**Figma node:** `4226:37360`

Same structure as Admin Manage Scheme but pre-scoped to the user's ministry. No ministry filter shown.

---

### 8.7 Add Scheme (Ministry)

**Figma node:** `4226:38254`

Functionally identical to Admin Add Scheme but without the Ministry/Department dropdown (pre-scoped to the logged-in ministry). Same field set otherwise.

---

### 8.8 Manage Outcome

**Figma node:** `4226:38577`

"Scheme wise Outcome List" — same pattern as Admin Manage Outcome.

---

### 8.9 Add Outcome (Ministry)

**Figma node:** `4226:39013`

Form: "Add Outcome". Uses Outcome Type dropdown (not in Admin version) and a single Outcome textarea.

---

## 9. Login & Authentication — Screen Specs

Login screens are shared across all portals via the SAMAVESH Login/Signup Figma page.  
See the companion document: [`SAMAVESH-Login-Signup-Handoff.md`](./SAMAVESH-Login-Signup-Handoff.md)

### Quick reference for eUtthan

After successful login:
- Role = `admin` → route to `/portals/eutthan-admin/` (Admin dashboard)
- Role = `ministry` → route to `/portals/eutthan-admin/` (Ministry dashboard)

Role is stored in `localStorage` as key `eutthan_role`.

**Portal selector card for eUtthan** (shown on Choose Portal screen):
- Icon: eUtthan logo / wave icon
- Title: eUtthan Admin Portal
- Description: Physical Progress and Scheme Outcome tracking

---

## 10. Interaction Specifications

### 10.1 Navigation

| Trigger | Behaviour |
|---------|-----------|
| Click sidebar item | Navigate; highlight active item with gov-blue bg, white text |
| Click sidebar sub-item arrow (▸) | Expand/collapse sub-menu with smooth 200ms animation |
| Click breadcrumb | Navigate back |
| Click "Back" button on forms | Navigate to previous list/page |
| Browser back | Navigate back in history stack |

### 10.2 Forms

| Trigger | Behaviour |
|---------|-----------|
| Click "Add" / "Save" | Validate all required fields; show inline errors; submit if valid |
| Failed validation | Red border on field + error message below; focus first error field |
| Click "Reset" | Clear all fields to initial/empty state |
| Successful submit | Navigate to list page; show success toast |
| Success toast | Green, bottom-right, auto-dismisses after 3 seconds |

### 10.3 Tables

| Trigger | Behaviour |
|---------|-----------|
| Hover row | Subtle background highlight (`surface-muted`) |
| Click edit (✏) | Navigate to edit form or open inline edit |
| Click delete (🗑) | Open confirmation modal: "Are you sure you want to delete [item]?" |
| Change page size dropdown | Re-render table with new page size; reset to page 1 |
| Click pagination number | Load that page |
| Type in search | Debounce 300ms; filter results |
| Change filter dropdown | Apply filter immediately; reset to page 1 |

### 10.4 Modals

| Trigger | Behaviour |
|---------|-----------|
| Open modal (Import Excel, Map Ministry) | Backdrop darkens (rgba 0,0,0,0.5); modal centres; focus trapped inside |
| Click ✕ or backdrop | Close modal; restore focus to trigger element |
| Press Escape | Close modal |
| Modal submit | Close modal; update underlying list; show toast if applicable |

### 10.5 File Upload

| State | Behaviour |
|-------|-----------|
| Idle (Step 1) | Dashed border dropzone; cursor: pointer on click zone |
| Drag over | Border changes to gov-blue; background tints blue |
| File selected (Step 2) | Dropzone replaced by file preview row; Financial Year dropdown appears |
| Click "Change" | Opens file picker to replace file |
| Click delete (🗑) | Remove file; revert to Step 1 upload zone |
| Invalid file (wrong type / too large) | Inline error below dropzone; file not attached |

---

## 11. Responsive Behaviour

The portal is designed for **desktop-first** usage. The login screens have mobile variants; the main portal screens are desktop-only.

| Breakpoint | Behaviour |
|------------|-----------|
| ≥1440px | Designs rendered at native size |
| 1280px–1439px | Content area compresses; sidebar remains fixed at ~174px |
| 1024px–1279px | Sidebar may collapse to icon-only; tables scroll horizontally |
| <1024px | Not currently designed — flag for future sprint |

**Login-only mobile breakpoint (375px):**
- Single column layout
- Sidebar collapsed / hidden
- Full-width form fields
- Stacked CTA buttons

---

## 12. Accessibility Notes

### WCAG 2.1 AA Requirements

| Element | Requirement |
|---------|-------------|
| Colour contrast (text on bg) | Minimum 4.5:1 for normal text, 3:1 for large text |
| Keyboard navigation | All interactive elements reachable by Tab; logical tab order |
| Focus indicators | Visible focus ring (min 2px outline in gov-blue or equivalent) |
| Form labels | All inputs have associated `<label>` elements (not just placeholder) |
| Error messages | Announced to screen readers via `role="alert"` or `aria-live` |
| Modal focus trap | Focus stays within modal while open |
| Skip links | "Skip to Main Content" present in top bar |

### GIGW Compliance (Indian Government Websites)

| Requirement | Status in design |
|-------------|-----------------|
| Bilingual support (Hindi/English) | Language toggle in accessibility bar — implement with i18n |
| Text resize (up to 200%) | Layouts must not break at 2× zoom |
| High contrast mode | Contrast toggle visible in accessibility bar |
| Screen reader compatibility | Ensure all SVG icons have `aria-hidden` + adjacent text labels |

### Known Accessibility Gaps (to fix in dev)

1. **Icon-only action buttons** (edit ✏, delete 🗑 in tables): Must have `aria-label="Edit [item name]"` and `aria-label="Delete [item name]"`
2. **Table sort indicators**: If columns are sortable, must have `aria-sort` attribute
3. **Sidebar sub-menu toggle**: Needs `aria-expanded` to communicate state to screen readers
4. **File upload dropzone**: Needs `role="button"` and keyboard-activate support
5. **Pagination**: Must be a `<nav aria-label="Pagination">` landmark
6. **Modal**: Needs `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal title

---

## 13. Error & Edge Cases

### 13.1 Empty States

| Screen | Empty condition | What to show |
|--------|----------------|--------------|
| Any list table | No records in database | Illustration + message "No [items] found" + "+ Add [item]" CTA |
| Search results | No matches | "No results for '[search term]'" + Clear search link |
| Dashboard | No data for FY | Zeros/dashes in stats; pie chart hidden or shows "No data" |

### 13.2 Loading States

| Trigger | Behaviour |
|---------|-----------|
| Page load | Skeleton shimmer on table rows (not designed — implement as standard pattern) |
| Form submit | Disable submit button; show loading spinner inside button |
| File upload (Import Excel) | Progress bar or spinner in modal while importing |

### 13.3 Long Content

| Element | Truncation rule |
|---------|----------------|
| Scheme Name in table | Truncate at ~60 chars; full text in tooltip |
| Ministry Name | Truncate at ~40 chars; full text in tooltip |
| Outcome text in table | Truncate at ~80 chars; expandable row or tooltip |
| Financial Year in badge | Always fits (format: YYYY-YYYY, 9 chars) |

### 13.4 Network Errors

- API failure on form submit: Show error toast bottom-right, keep form data intact
- API failure on page load: Show "Failed to load data" with Retry button
- File upload failure: Revert to Step 1 state, show inline error

---

## 14. Design Feedback & Issues

The following issues were identified during the June 2026 design audit. Prioritised for resolution before dev handoff closure.

### Critical — ✅ All Resolved (June 2026)

| # | Issue | Location | Status |
|---|-------|----------|--------|
| C1 | ~~"PDF Only · Max 5MB" label on Import Excel modal is inaccurate — file shown is a CSV~~ | `Import With Excel — Step 1 & 2` | ✅ Fixed — label updated to "CSV/Excel · Max 5MB" |
| C2 | ~~Edit Financial Year frame shows "Nodal Officer" role in header (should be Admin)~~ | `Admin / Edit Financial Year` | ✅ Fixed — header now correctly shows "Admin" role |

### Important

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| I1 | Financial Year dropdown hidden in Add Document Step 1 and only appears in Step 2 — no designed transition/reveal animation | `Admin / Documents / Add Document — Step 1 & 2` | Dev needs to implement a smooth field reveal |
| I2 | Map Ministry MAP action modal title says "Import Achievement Data" — incorrect for this context (should be "Map Ministry") | `Admin / Map Ministry / Map` | Confusing for users — copy needs correction |
| I3 | Ministry Dashboard shows "Utilisation" as negative value (₹-1.3821 Cr) with no visual differentiation from positive values | `Ministry / Dashboard` | Negative values should be styled red or with indicator |
| I4 | No empty state designs for any list screen | All list screens | Dev needs to implement empty states; request designs |
| I5 | Delete action (🗑 icon) has no confirmation modal designed | All table screens | Destructive action needs confirmation dialog — must be added |
| I6 | Mobile viewport not designed for main portal screens | All portal screens except Login | Coordinate with PM on mobile requirement scope |

### Minor

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| M1 | "Manage Outcome / ADD" in Ministry section uses "Save" button label while Admin version uses "Add" — inconsistent | `Ministry / Manage Outcome / Add` | Minor UX inconsistency; standardise button labels |
| M2 | Add Scheme form in Ministry role has slightly different field layout vs Admin role (field order differs) | `Admin / Add Scheme` vs `Ministry / Manage Scheme / Add Scheme` | Verify intentional role-based differentiation or align layouts |
| M3 | Import Excel modal sizing — appears narrower than other modals; confirm consistent modal width (600px standard) | `IMPORT WITH EXCEL` modals | Visual inconsistency |

---

## 15. Implementation Notes

### 15.1 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v3 + shadcn/Radix primitives |
| Icons | lucide-react |
| Fonts | Noto Sans (primary, GIGW standard) |
| Design tokens | `@mosje/tokens` (CSS custom properties) |
| Auth | localStorage key `eutthan_role` → `"admin"` or `"ministry"` |

### 15.2 File Structure

```
apps/hub/
├── src/
│   ├── app/
│   │   └── portals/
│   │       └── eutthan-admin/
│   │           ├── [[...slug]]/
│   │           │   └── page.tsx        ← catch-all route
│   │           └── eutthan.css         ← portal-specific styles
│   └── components/
│       └── eutthan/
│           └── eutthan-portal.tsx      ← main portal component
```

### 15.3 Routing Pattern

The portal uses a single `[[...slug]]` catch-all route at `/portals/eutthan-admin/`. Internal navigation is handled client-side using a URL prefix helper:

```typescript
const BASE = "/portals/eutthan-admin";
function np(p: string) { return p.startsWith(BASE) ? p.slice(BASE.length) || "/" : p; }
function lk(p: string) { return `${BASE}${p}`; }
```

Active route is determined by comparing the current slug against screen path constants.

### 15.4 Role Gating

```typescript
const role = localStorage.getItem("eutthan_role"); // "admin" | "ministry"
// Render AdminDashboard or MinistryDashboard based on role
```

### 15.5 Key Components to Build

| Component | Description |
|-----------|-------------|
| `PortalShell` | Accessibility bar + site header + sidebar + content area |
| `Sidebar` | Navigation with active state, collapsible sub-menus |
| `DataTable` | Reusable table with search, filters, pagination, action columns |
| `FormShell` | Two-column responsive form layout with Reset/Back/Submit pattern |
| `FileUpload` | Two-state upload zone (Step 1: dropzone, Step 2: file preview) |
| `ImportModal` | Two-step Excel import modal |
| `StatCard` | Dashboard KPI card |
| `SuccessToast` | Auto-dismiss toast (3s) |
| `ConfirmDialog` | Destructive action confirmation modal |
| `MapModal` | Map/Unmap action modal for Ministry/Scheme mapping |

### 15.6 API Endpoints (to confirm with backend)

| Feature | Expected endpoint |
|---------|------------------|
| Financial Years | `GET/POST/PUT/DELETE /api/financial-years` |
| Ministries | `GET/POST/PUT/DELETE /api/ministries` |
| Schemes | `GET/POST/PUT/DELETE /api/schemes` |
| Outcomes | `GET/POST/PUT/DELETE /api/outcomes` |
| Documents | `GET/POST/DELETE /api/documents` (multipart upload) |
| Map Ministry | `POST /api/map/ministry` |
| Map Schemes | `POST/DELETE /api/map/schemes` |
| Users | `GET/POST/PUT/DELETE /api/users` |
| Physical Progress | `GET/POST /api/physical-progress` |
| Physical Progress Import | `POST /api/physical-progress/import` (multipart) |

---

*This document was generated from the Figma file `MoSJE Portal — Handoff` (E-Utthan page) as part of the MoSJE SAMAVESH design system handoff process. For questions, contact the MoSJE Design Team.*
