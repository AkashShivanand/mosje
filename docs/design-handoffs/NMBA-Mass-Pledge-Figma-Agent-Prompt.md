# Figma Agent prompt — NMBA Mass Pledge Reporting (18 August 2026)

Paste everything below the line into the Figma Agent, in a new file with the design library already attached.

---

## ROLE

You are building a **fully interactive, click-through Figma prototype** for the **NMBA Mass Pledge Reporting** module — a government portal flow for the Ministry of Social Justice & Empowerment, Government of India. It will be reviewed by Ministry leadership, so fidelity and correctness matter more than invention.

Work in this file. Name the page `NMBA — Mass Pledge (18 Aug 2026)`.

---

## NON-NEGOTIABLE RULES

1. **Use the attached design library. Never draw your own.** Every button, input, select, checkbox, card, table, badge, alert, modal, chart, header, sidebar and empty state must be an **instance of the existing published component**. Do not detach instances. Do not build look-alikes. If you believe a component is missing, first search the library under a different name; only if it genuinely does not exist, build it as a proper component with variants and tell me what you added and why.
2. **Bind every colour, radius, spacing and type value to a library variable/style.** Zero raw hex, zero eyeballed spacing. Colour mode = **Blue - Light**. Type mode = **Portal** (the dense ramp: display-1 56, headline-1 32, title-1 20, body-1 16, body-2 14, label-1 14, label-3 11). Spacing comes only from the t-shirt scale: 2 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64.
3. **Typeface: Noto Sans only.** Icons: **Material Symbols Rounded, weight 300, size 24, fill 0** — use the library `Icon` component, never pasted SVGs. Org marks come from the `org-logo` component. The National Emblem is the only mark in the masthead.
4. **No Indian tricolour stripe** anywhere — not in headers, footers, hero bands or dividers. This is a standing client instruction.
5. **Accessibility is a hard requirement (WCAG 2.1 AA + GIGW).** Every interactive element gets a visible focus state (2px primary ring, 2px offset). Text contrast ≥ 4.5:1. Error text uses `danger-strong` (#B8382F), never `danger` on white. Never encode meaning by colour alone — every status colour is paired with a text label.
6. **Motion:** 150ms ease-out on hover, 300ms on panel/overlay open. Smart Animate only where geometry actually persists. **No bouncy springs, no linear easing, no gratuitous transitions.**
7. **Realistic Indian government content only.** Real state/district/block names, real ministry names, plausible officer names and designations, `en-IN` number grouping (e.g. `1,24,860`). No lorem ipsum, no "John Doe", no placeholder greeking.

---

## WHAT THIS MODULE IS

On **18 August 2026** India runs a single-day National Pledge Against Drug Abuse. Five categories of organisation report their participation figures and photographic evidence:

1. **State / UT / District / Block administrations** (goes through an approval chain)
2. **Line Ministries** (self-declared)
3. **Spiritual Organisations** (self-declared)
4. **Higher Education Institutions** (self-declared)
5. **GIAs — grant-in-aid rehabilitation centres** (self-declared)

All five fill in **one identical form body**; only the identity header at the top differs, resolved from who is logged in. Approved figures roll up into a national total shown on a public counter.

**Approval chain (never varies by ministry):**

```
BLOCK    submits → Pending District → Pending State → Approved
DISTRICT submits → Pending State                    → Approved
STATE    submits → Approved
Forms 2–5 submit → Approved, tagged "Self-declared"
```

An approver can **Approve** or **Return with remarks** (remarks mandatory). A returned report becomes editable by its submitter and re-enters at the same tier. Every transition is recorded in an audit timeline. Pending figures never appear in published totals.

**Verified vs Self-declared must be visually distinguishable everywhere and must never be merged into one headline number.**

---

## PAGE ORGANISATION (follow this exactly)

Use Figma **SECTION** nodes with a depth-graded greyscale — each nesting level 7/255 darker:

| Depth | Hex | Used for |
|---|---|---|
| 1 | `#E3E3E3` | Top section (`01 — PUBLIC`, …) |
| 2 | `#DCDCDC` | Sub-section (feature) |
| 3 | `#D5D5D5` | Flow group |
| 4 | `#CECECE` | Step / variant group |

This is a single-portal page, so **start at depth 1** — do not create a `#EAEAEA` superset wrapper.

**Spacing, all on an 8px grid:** frame gutter `96`, helper gap `48`, sub-section gap `160`, top-section gap `400`, padding `120` (top section) / `80` (deeper). Hug every section to its content, deepest-first.

**Frame naming:** `Role / Screen Name / State` with spaces around the slashes. Roles: `Public`, `Login`, `Block`, `District`, `State`, `Entity`, `Admin`. States: `Empty`, `List`, `Filled`, `Errors`, `Detail`, `(Modal)`, `Success`, `Closed`, `Mobile`.

**Every screen lives inside a section** — even a one-screen feature gets its own sub-section. Lay each flow out as a **single left-to-right row** in flow order so a reviewer scans it at a glance; stack sub-sections vertically.

**Section plan:**

```
01 — PUBLIC          → Public counter (desktop + mobile)
02 — AUTHENTICATION  → Portal login incl. demo-credentials panel
03 — REPORTING       → My submissions · New report (all 5 identity headers) · Window states
04 — APPROVALS       → Approvals inbox · Submission detail · Return modal · Correct & resubmit
05 — DASHBOARD       → National rollup, verified vs self-declared, ministry attribution
06 — GOVERNANCE      → Assumptions A1–A11 review page + the "?" hint popover
07 — COMPONENTS      → New/derived components used above, with their variants
```

Frames: desktop **1440 × auto** (content column max 1280); mobile **390 × auto** for the two screens flagged Mobile.

---

## SHELL (present on every authenticated screen)

- `SiteHeader` variant **portal**, sticky: National Emblem, "Ministry of Social Justice & Empowerment" / "National Action Plan for Drug Demand Reduction", NMBA `org-logo` cobranding, account menu showing the logged-in officer.
- `SidebarNav` with the NMBA groups; add **"Mass Pledge (18 Aug 2026)"** as an expandable group containing: My submissions · Report participation · Approvals · Dashboard · Assumptions. Correct item marked `active` on every frame.
- `Footer` (slim navy) and the `AppSwitcher` FAB bottom-left on every authenticated frame.
- Public counter uses the **website** header variant and no sidebar.

---

## SCREENS TO BUILD

### 01 — PUBLIC

**`Public / National Counter / Open`** (desktop) and **`Public / National Counter / Mobile`**

- Dismissible `Alert` status **warning**, pinned top: "Provisional prototype data — figures shown are seeded for demonstration and are not an official Ministry publication."
- H1 "National Pledge Against Drug Abuse", subtitle "18 August 2026".
- Hero counter: total participants **12,48,60** style `en-IN` figure, huge, with a `Badge` success subtle reading **"Verified through approval chain"** and a "Last updated 18 Aug 2026, 6:40 PM" caption.
- A clearly separated, lower-weight line: **"Self-declared reports"** with its own figure and a neutral `Badge` reading "Self-declared". It must read as adjacent, never as part of the headline.
- `MetricCard` row: Reports approved · States/UTs reporting · Districts reporting · Institutions reporting.
- "From the day" — a 4-up grid of event photograph thumbnails. **No coordinates, no personal data, no participant names.**

### 02 — AUTHENTICATION

**`Login / NMBA Portal / Default`** — `PortalLoginShell`, mobile + password fields, and the mandatory **collapsible "Demo credentials" panel** (closed by default, dashed border, `<details>` pattern) listing role · mobile · password · a "Use" action:

| Role | Mobile | Password |
|---|---|---|
| Admin | 9999999999 | Demo@123 |
| State Nodal Officer (Maharashtra) | 9890123456 | Demo@123 |
| District Nodal Officer (Pune) | 9890001234 | Demo@123 |
| **Block Nodal Officer (Haveli, Pune)** | **9890005678** | Demo@123 |
| Line Ministry (Ministry of Education) | 9810007001 | Demo@123 |
| Spiritual Org (Brahma Kumaris) | 9810007002 | Demo@123 |
| HEI (Delhi University) | 9810007003 | Demo@123 |
| GIA (Muktangan Rehabilitation Centre) | 9810007004 | Demo@123 |

**`Login / NMBA Portal / Block filled`** — same frame with the Block credentials populated, for the prototype entry point.

### 03 — REPORTING

**`Block / My Submissions / Empty`** — H1 "Mass Pledge submissions", `EmptyState` (icon + "No submissions yet" + one-line explanation + primary CTA "Report participation").

**`Block / My Submissions / List`** — submission cards showing event date, entity, total participants, `StatusBadge` and `VerificationBadge`, plus the "Report participation" CTA in the page header.

**`Block / New Report / Empty`** — the form. Build it **once as a component** with the identity header as an instance-swap slot, then produce the five variants below. Body, in `FormSection` blocks:

1. **`Reporting as: <role label>`** — description "Your identity is resolved from your login. Only the fields shown can be edited." Contains the identity header slot, then a read-only, disabled `Input` **"Date of event" = "18 August 2026"**, hint "Fixed for this campaign and cannot be changed.", with an **A10** "?" hint chip on the label.
2. **`Participation`** — description "Count each participant once. The three categories below do not overlap." Three number `Input`s in a 3-col grid, each with an **A1** hint chip and this exact helper text:
   - **Youth** — "Participants under 30, any gender."
   - **Women** — "Female participants aged 30 and above."
   - **Others** — "Everyone else — males 30 and above, and any other gender 30 and above."
   Below them a muted bar: label "Total participants", right-aligned bold tabular figure. **Computed, read-only.**
3. **`Photographs of the event`** — description "1 to 4 photographs, JPEG or PNG, up to 10 MB each." Uses **`GeoPhotoInput`**: dashed drop-zone empty state, then a thumbnail grid where each photo carries a **location chip** — `EXIF` (location read from the photo), `Device` (captured at upload) or a warning-toned **"No location"**. Field label carries an **A4** hint chip; hint text "Location is read from the photograph where available, otherwise from this device."
4. **`Reporting officer`** — Name · Designation (placeholder "e.g. Block Development Officer") · Contact number (10 digits, with a "Send code" outlined button beside it, **A9** hint chip) · One-time code field with a "Verify" button and the prototype hint "Prototype: the code is 481902. A real deployment sends this by SMS."
5. **`DeclarationCheckbox`** — bordered panel, title "Declaration", lead "I certify that:", bulleted statement: "The reported figures are correct." / "The photographs pertain to the event conducted on 18 August 2026."
6. Right-aligned primary **"Submit report"** button with a send icon.

**Identity header variants** (five frames, `Block|District|State|Entity / New Report / Form N`):

| Form | Header contents |
|---|---|
| 1 · Admin tier | `Select` "Coordinating Line Ministry" (35 GoI ministries, MoSJE first) + read-only State / District / Block prefilled from session (Maharashtra / Pune / Haveli). Inline `Alert` info: **"Naming a coordinating ministry is attribution only. It never adds this event to that ministry's own total."** (A2) |
| 2 · Line Ministry | `Select` of ministries with "Others (specify)" revealing a text `Input`. Prefilled "Ministry of Education". |
| 3 · Spiritual Organisation | `Select` of 8 orgs, prefilled "Brahma Kumaris", with a **PLACEHOLDER** `Badge` and the note "This roster is a placeholder pending Ministry confirmation." (A11) |
| 4 · HEI | `Select` of institutions with "Others (specify)". Prefilled "Delhi University". |
| 5 · GIA | Read-only organisation name "Muktangan Rehabilitation Centre", resolved from login. |

Additional form states, each its own frame:

- **`Block / New Report / Filled`** — Youth 420, Women 310, Others 275, **Total 1,005**; 3 photographs attached (2 chipped `EXIF`, 1 `Device`); officer "Sunil Kamble", designation "Block Development Officer", contact 9890005678 **verified** (green shield + "Mobile number verified"); declaration ticked; Submit enabled.
- **`Block / New Report / Errors`** — validation run: counts error "Enter the number of participants. At least one figure must be above zero.", photos error "Attach at least 1 photograph of the event.", contact error "Verify the mobile number with the one-time code before submitting.", declaration error "You must accept the declaration to submit." All in `danger-strong` beneath their controls.
- **`Block / New Report / OTP sent`** — the one-time code field revealed with the prototype code visible.
- **`Block / New Report / Photo no location`** — a photo chipped "No location" plus an inline warning explaining it will be flagged to the approver, **not** blocked. (A4)
- **`Block / New Report / Duplicate`** — the form replaced by a warning `Alert` "You have already reported for this event" with a text-button link to the existing report. (AC 14)
- **`Block / New Report / Window before`** — closed-state panel: "Reporting opens on 18 August 2026."
- **`Block / New Report / Window closed`** — "Reporting for this event closed on 25 August 2026." Both with a small dev-only override control visible in the corner. (A10)
- **`Block / New Report / Mobile`** — the full form at 390 wide, single column, sticky submit bar at the bottom.

### 04 — APPROVALS

**`District / Approvals / Inbox`** — H1 "Approvals", cards for submissions awaiting *this* approver only, each showing entity, tier, total, submitted-at and a "Review" action. Include the empty variant **`District / Approvals / Empty`** — "Nothing awaiting your approval".

**`District / Submission Detail / Pending`** — two-column detail:
- Left: **Participation** (Youth / Women / 30+ breakdown / Others / **Total**, with the A1 chip), **Photographs** (thumbnail grid, each with its location chip, opening a `Lightbox`), **Report details** (coordinating ministry with A2 chip, date of event, reporting officer, designation, contact + verified tick, declaration "Accepted").
- Right: `StatusBadge` + `VerificationBadge` at the top; a **"Your decision"** card with a filled **Approve** and an outlined **Return for correction**; below it the **`ApprovalTimeline`** showing every transition with actor, role, timestamp and remarks.
- If any photo lacks location, a warning `Alert` "No location on the photographs" sits above the fold for the approver to judge. (A4)

**`District / Submission Detail / Return (Modal)`** — `Modal` size sm, title "Return for correction", a required `Textarea` "Remarks", and the empty-remarks error state visible: remarks are mandatory and the action is blocked without them. (AC 17)

**`Block / Submission Detail / Returned`** — the submitter's view: warning `Alert` "Returned for correction" carrying the approver's remarks verbatim; the participation figures and photographs now **editable inline**; a primary "Resubmit for approval" button. (AC 18)

**`State / Submission Detail / Approved`** — final state: approved badge, full timeline showing Submitted → Returned → Resubmitted → Approved (District) → Approved (State), each with actor, role and time.

**`State / Approvals / Scope`** — an inbox for a different state, demonstrating that a State officer sees only its own state's submissions. (AC 20)

**`Any / Photo Lightbox / Open`** — `Lightbox` overlay: full-bleed photograph, counter, prev/next, caption bar with the capture time and location source, thumbnail strip.

### 05 — DASHBOARD

**`Admin / Mass Pledge Dashboard / National`**

- H1 "Mass Pledge dashboard".
- `KpiRow` of four `MetricCard`s: **Total participants (approved)** · **Approved reports** · **Awaiting approval** · **Returned for correction**.
- Two side-by-side cards that must never merge: **"Verified through approval chain"** (with the verified badge) and **"Self-declared"** (with its badge), each with its own figure and report count. (A8, AC 25)
- `ChartCard` + `BarChart` "Participation by category" (Youth / Women / Others).
- `ChartCard` + horizontal `BarChart` "Top States/UTs".
- `DataTable` "State / UT rollup" — columns State/UT · Reports · Approved · Pending · Participants (right-aligned, `en-IN`), sortable headers with sort indicators, a visible caption.
- A separate, clearly labelled **"Ministry attribution"** card: Form 1 events grouped by coordinating ministry, with an explicit note "Attribution only — these figures are not added to any ministry's own total." (A2, AC 26)
- Pending figures shown as their own "Pending" line, excluded from all totals. (AC 24)

**`State / Mass Pledge Dashboard / State scope`** — the same layout scoped to Maharashtra, proving role scoping.

### 06 — GOVERNANCE

**`Admin / Assumptions / Review`** — H1 "Assumptions awaiting confirmation". A leading warning `Alert` explaining that the source requirement left eleven questions open and these are the resolutions built to. Then eleven cards, **A1 through A11**, each with: the ID, an "Awaiting Ministry confirmation" `Badge`, and three labelled blocks — **"The open question"**, **"What we built"**, **"Why"**. Content verbatim from the spec (I will paste it if you ask). Close with a "Data coverage in this prototype" note covering the placeholder spiritual-org roster and the representative block subset.

**`.helper / Assumption Hint (Popover)`** — the "?" affordance used beside governed fields: a small circular icon button that opens a popover containing the assumption text and the "Awaiting Ministry confirmation" badge. Build it as a component with variants for each of A1, A2, A4, A9, A10, A11 so it can be instanced across the form.

### 07 — COMPONENTS

Publish, with full variant sets and every state (default / hover / focus / active / error / disabled), any component you had to create:

- **`GeoPhotoInput`** — empty drop-zone · 1–4 thumbnails · per-photo location chip (EXIF / Device / No location) · max-reached notice · size-rejected error · disabled.
- **`ApprovalTimeline`** — submitted / approved / returned / resubmitted markers, actor + role + timestamp + remarks, and a pending step.
- **`DeclarationCheckbox`** — unchecked / checked / error / disabled.
- **`StatusBadge`** — Draft · Pending District · Pending State · Approved · Returned.
- **`VerificationBadge`** — Verified · Self-declared.
- **`SubmissionCard`** — the list/inbox row.

Colour is never the sole carrier of meaning in any of these — every badge and every timeline marker is paired with text.

---

## PROTOTYPE WIRING (this is the deliverable, not a bonus)

Build a **real, clickable prototype**, not a static board. Use Figma **variables + conditional logic**, not just hard-wired frame jumps, wherever a value or a gate is being demonstrated.

**Variables to create** (collection `Mass Pledge Proto`):
- Number: `youth`, `women`, `others`, `total`
- Boolean: `otpVerified`, `declarationAccepted`, `photosAttached`
- String: `role`, `submissionStatus`

**Behaviours to wire:**
- Typing into Youth / Women / Others (use interactive inputs where supported, otherwise stepped click-to-fill) updates `total` via a **Set variable** expression `youth + women + others`, displayed live in the Total bar.
- **"Send code"** reveals the one-time code field; **"Verify"** sets `otpVerified = true` and swaps the field for the green "Mobile number verified" row.
- **"Submit report"** is gated by conditional logic: if `otpVerified` **and** `declarationAccepted` **and** `photosAttached` → navigate to the detail screen; else → navigate to the **Errors** frame. This gate is the single most important interaction to get right.
- **"Return for correction"** opens the modal; the modal's own submit is gated on non-empty remarks.
- Overlays (modal, lightbox, popover) use **Open overlay** with `Escape` and a close button returning to the trigger. Background scroll locked.
- Hover states on every button, input, card, table header and sidebar item — **While hovering**, 150ms ease-out.

**Flows to publish, each with its own named starting point:**

1. **Flow A — Block officer files a report:** Login (block filled) → My Submissions (empty) → New Report (empty) → filled → OTP sent → verified → Submit → Submission Detail (Pending District).
2. **Flow B — District returns it:** Login → Approvals inbox → Submission Detail (Pending) → Return modal → empty-remarks error → remarks entered → Submission Detail (Returned).
3. **Flow C — Block corrects and resubmits:** My Submissions → Detail (Returned) → inline edit → Resubmit → Detail (Pending State).
4. **Flow D — State approves and it publishes:** Approvals → Detail → Approve → Detail (Approved) → Dashboard (National) → Public counter.
5. **Flow E — Self-declared short path:** Login (HEI) → New Report (Form 4) → Submit → Detail (Approved, Self-declared) → Dashboard showing it in the self-declared column, never in the verified figure.
6. **Flow F — Governance review:** any form screen → tap an "?" hint chip → popover → "See all assumptions" → Assumptions page.
7. **Flow G — Window states:** the dev override cycling Before → Open → Closed.

Every flow must be walkable end-to-end in presentation mode with no dead ends. Add a **Back** path from every detail screen.

---

## WHEN YOU ARE DONE

Report back with:

1. The page link and a screenshot of the whole page.
2. A list of every component you **instanced** from the library.
3. A list of anything you had to **create**, with the reason it was not already in the library.
4. Any place where the spec above was ambiguous and you made a judgement call — flag it rather than burying it.
5. A confirmation that: zero detached instances · zero raw hex · Noto Sans throughout · no tricolour motif · all seven flows walkable.

Do not silently substitute your own visual choices for the library's. If something in the library looks wrong for this use, say so and ask — do not fix it by hand on the canvas.
