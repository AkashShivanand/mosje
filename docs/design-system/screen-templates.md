# Screen templates — the closed set, and how to pick one

> **Who this is for.** Anyone — person or agent — about to build a portal screen.
> You should not have to decide what a screen looks like. You should have to decide
> **what data you are showing**, and this document turns that into a template.
>
> Companion rule: `.claude/rules/screen-templates.md` (binding).
> Evidence behind every number: `docs/audit/figma-handoff-defects-2026-09-06.md`.

---

## 0. Why this layer exists

Measured on 2026-09-06, before any of this was built:

| Measure | Figure |
|---|---|
| Portal pages built | 265 (29,087 lines) |
| Barrel exports available to them | 290 names / 132 components |
| Pages using the design system's `PageHeader` | **0** |
| Pages using the design system's `AppShell` | **0** |
| Hand-rolled portal shells | **16**, across 8 portals, none importing `AppShell` |
| Pages handling **none** of loading / empty / error | **236 of 265 — 89%** |

The leaf components are adopted heavily (`FormField` 532 uses, `Card` 354, `Badge` 212).
The **page skeleton is re-invented 265 times**, and with it the seven states that
`.claude/rules/data-state-completeness.md` makes mandatory.

That rule is not being ignored out of carelessness. It is being ignored because
obeying it costs a developer four extra branches on every page, and nothing in the
system offers those branches ready-made. **A template supplies them by construction**,
which turns a rule people must remember into a shape they cannot avoid.

The estate has already proved the mechanism once. `SidebarNav` is at **100% adoption
across 407 files** because `check:sidebar-adoption` ratchets it. `AppShell` has no
gate and sits at zero. Templates ship with a gate for that reason.

---

## 1. The three tiers

```
  Tier A   PortalPage          chrome: masthead · sidebar · content column · footer
             │                 resolved from the portal registry + the viewer's role
             ▼
  Tier B   <Something>Screen   one of eighteen. Owns the seven states.
             │                 Takes a descriptor, renders the screen.
             ▼
  Tier C   the descriptor      a typed object. THIS is what you write.
```

You write Tier C. Tiers A and B are already written.

**The load-bearing claim:** a screen is a *function of its data*, not of its designer.
Two portals showing "a filterable list of applications an officer can act on" should
produce the same screen, because it is the same screen. Where they genuinely differ —
the columns, the actions, the words — that difference belongs in the descriptor, where
it is reviewable, translatable and diffable. Where they differ in padding, that is drift.

---

## 2. The decision table — keyed on the data, not the design

Answer one question: **what have you got?**

| What you have | Template | The screen it produces |
|---|---|---|
| One record, read-only | `RecordScreen` | Summary header, tabbed detail, related lists |
| One record, editable, fits one screen | `FormScreen` | Sectioned form, one submit |
| One record, editable, >8 fields or legally staged | `WizardScreen` | Stepper, one step at a time, review last |
| One record + a decision to record against it | `DecisionScreen` | Record on the left, decision panel on the right |
| Many records, homogeneous, the reader acts on them | `WorklistScreen` | Filters, table, bulk actions, pagination |
| Many records, homogeneous, the reader browses them | `CatalogueScreen` | Filter chips, cards or file rows, pagination |
| Many records, aggregated into figures | `OverviewScreen` | KPI row, charts, context panels, recent list |
| Many records, ranked by a query the reader typed | `SearchScreen` | Query field, facets, result rows |
| Many records, each a dated attributed event | `InboxScreen` | Grouped event list, read/unread, filters |
| A finite set of mutually exclusive options | `ChooserScreen` | Radio cards, one continue |
| A required set of artefacts, each with its own state | `ChecklistScreen` | Batch upload, grouped checklist, per-item status |
| Everything entered, nothing yet committed | `ReviewScreen` | Numbered summary sections, edit links, declaration |
| Committed, with a reference number | `ConfirmationScreen` | Reference, what happens next, receipt |
| Credentials, before there is a session | `AuthScreen` | Hero, role tabs, credential card |
| Configuration the reader administers | `SettingsScreen` | Section index, inline-editable rows |
| Media a reader manages | `GalleryScreen` | Toolbar, grid/list toggle, lightbox |
| A tabular statement meant to be printed or exported | `ReportScreen` | Print-first table, export actions |
| No record, because something failed | `StatusScreen` | 404 / 403 / 500 / maintenance / offline |

**Eighteen. The set is closed.** A screen that appears to need a nineteenth is almost
always one of these with a different descriptor — check that first, and if it truly is
new, it is added here by a change to this document, not invented in a portal folder.

### 2a. When two look plausible

| Confusion | The distinguishing question |
|---|---|
| `WorklistScreen` vs `CatalogueScreen` | Does the reader **do something to** the rows, or **read** them? Actions ⇒ worklist. |
| `WorklistScreen` vs `SearchScreen` | Is the set defined by **filters over a known register**, or by a **query the reader composed**? |
| `CatalogueScreen` vs `SearchScreen` | Is there a result *ranking*? Ranking ⇒ search. |
| `FormScreen` vs `WizardScreen` | Count the fields. **>8, or a statutory stage boundary, ⇒ wizard.** |
| `RecordScreen` vs `ReviewScreen` | Is the record **committed**? Committed ⇒ record. Pending submit ⇒ review. |
| `RecordScreen` vs `DecisionScreen` | Does this reader **change the record's state**? Yes ⇒ decision. |
| `InboxScreen` vs `WorklistScreen` | Is the unit an **event** (dated, attributed) or an **object**? |
| `OverviewScreen` vs `ReportScreen` | Is it read **on screen** or **printed and filed**? |

### 2b. Composition, not a nineteenth template

A screen may host another template's body in a panel. `DecisionScreen` embeds a
`RecordScreen` body; `WizardScreen`'s final step embeds a `ReviewScreen` body;
`ChecklistScreen` is a legal `WizardScreen` step. **Bodies compose; chrome does not.**
There is exactly one `PortalPage` on a page and exactly one `<h1>`.

---

## 3. What every template owns, without being asked

This is the whole point. A descriptor never contains a spinner.

### 3a. The seven states

Resolved **once**, from one expression, and every part of the screen reads that one
resolution — the rule in `data-state-completeness.md` §2, which exists because a key
once printed `villages 0` above a map drawing 19,768 of them.

| State | What the reader sees | Why it is not the next one |
|---|---|---|
| **Idle** | The prompt to act | Nothing has been asked yet — a search field before its first query |
| **Loading** | A skeleton **in the shape of the result**, `role="status"` | Something was asked; the answer has not arrived |
| **Error** | One sentence, and a **Try again** | The request failed. No status codes, no endpoints |
| **Empty** | The citizen's answer, in the department's register | The register holds nothing |
| **Filtered to nothing** | **Names the filter**, and how to clear it | The reader caused this and can undo it |
| **Partial** | Populated, with a provenance chip per `prototype-data-modes.md` | Some fields answered |
| **Populated** | The screen | — |

Plus **too much**, which is not a branch but a constraint: a template that can receive
more rows than it can hold **requires** a pager. It is a type error to omit it.

### 3b. And the rest

| Owned by the template | So a descriptor never says |
|---|---|
| Exactly one `<h1>`, correct heading order across slots | `<h1>` |
| Skip-link target, landmark roles, focus on step/route change | `tabIndex={-1}` |
| Filter, page, tab and sort in the **URL** | `useState` for a filter |
| Mobile form of every archetype — tables become cards, steppers compact | a breakpoint |
| `prefers-reduced-motion`, and every reduced path ends visible | a media query |
| en-IN number and date formatting, lakh/crore | `toLocaleString` |
| Provenance chips in every data mode | a chip |
| Unsaved-changes and session-expiry guards | a beforeunload |
| Permission-absent variants that **explain** rather than disable | a `disabled` |
| Print stylesheet on `ReportScreen` | `@media print` |

---

## 4. The templates

Each entry: what it is for, the descriptor's shape, the states it can be in beyond the
seven, and the edge cases it is required to handle. Figma evidence is cited where the
handoff draws it; where it does not, the code evidence is cited instead, because
**neither source is complete** — the handoff has the citizen intake journey in depth and
almost none of the officer half, and the 265 built pages are the reverse.

---

### 4.1 `PortalPage` — Tier A, the only chrome

Replaces the sixteen hand-rolled shells (`admin-shell` ×4, `citizen-shell` ×2,
`public-shell`, `user-shell`, `ngo-shell`, `review-shell`, `console-shell`, `tc-shell`,
`eutthan-shell`, `pm-ajay/shell`, `smile-admin/shell`).

```
masthead                              (AccessibilityBar + SiteHeader variant="portal")
├── sidebar 300 expanded / 88 rail    (SidebarNav — from the registry, filtered by role)
└── content column                    1140 @ 300 · 1352 @ 88 — TWO measures, not ten
footer 52                             (Footer, slim)
```

**The geometry is corrected, not copied.** The handoff draws this one page type with
sidebars at 300, 88, 268, 260 and 280, and inner measures at 1352, 1140, 1132, 1124,
1108, 1096, 1092, 1076, 1068 and 800. Only 300 and 88 are decisions; the rest is drift,
all of it inside SHRESHTA. See the defect report.

Edge cases: a portal with **no** sidebar (public surfaces); a role whose nav has one
item (render it, do not collapse to nothing); a two-line scheme name in the brand row
(the shell hugs — **never** `calc(100vh - constant)`); sidebar as drawer below the
tablet anchor; the corner and wall rails per `floating-element-placement.md`.

---

### 4.2 `WorklistScreen` — many records the reader acts on

The single highest-value template: **43 built pages use `DataTable` and the handoff
draws none of them.** `Pagination`, `Breadcrumb` and `Search` return **zero hits across
all 5,138 nodes** of the E-Anudaan page, and `Pagination` appears in exactly **1 of 265**
built pages. This template is where the estate's largest gap is.

```
PageHeader  eyebrow · title · meta · primary action
FilterBar   controls, and a live count of what they excluded
[BulkActionsBar]                       appears only while rows are selected
DataTable   priority columns · sort · row actions · selection
Pagination  ALWAYS. Never a scroll region inside a card.
```

Descriptor: `columns` (with `priority` for responsive collapse), `rows`, `filters`,
`rowActions`, `bulkActions`, `page`, `sort`, `selection`.

Edge cases it must handle: **twelve-column tables** (`nmba/activities` has twelve) —
priority columns collapse to a card list on mobile, never a horizontal scrollbar inside
a card; **selection spanning pages** (say how many are selected and where); a row action
the viewer's role may not perform (omit it and say why on the row, never a dead
`disabled`); a filter that excludes everything (**"filtered" is worded differently from
"empty"**); sort on a column the server cannot sort; an optimistic row action that the
server later rejects.

---

### 4.3 `RecordScreen` — one record, read-only

```
Breadcrumb
PageHeader  title · status Badge · meta · actions
[SlaProgressIndicator | ApprovalTimeline]
Tabs        Details · Documents · History · Remarks
  Details   DescriptionList — label/value pairs
  Documents FileList
  History   EventList
  Remarks   CommentThread
```

Edge cases: a record whose status is unknown; a tab with nothing in it (**keep the tab,
show its empty state** — removing it moves the others and breaks a bookmarked URL); a
value the register does not publish (omit the row; **never "Not yet reported"** — the
`live-data-fallback.md` rule); a record the viewer may see but not act on; deep-linking
to a tab; a 51-pair detail grid (the handoff's review screen has exactly that) — group it.

---

### 4.4 `WizardScreen` — one record, staged

Covers **22 of the handoff's 44 screens.** Step counts drawn: **3 (NAPDDR), 6 (SHRESHTA),
7 (AVYAY)** — so the stepper must survive 3 to 7 without redrawing.

```
PageHeader  scheme title · "Step 2 of 7 · Organisation Details. Fields marked * are mandatory."
Stepper     ONE treatment. The handoff draws two; that is a defect, not an option.
[draft banner]  two flavours, both drawn: "You have a saved draft" (Resume | Start fresh)
                and "You are continuing a saved draft for FY 2026-27" (Start a fresh application)
ErrorSummary    focusable, above the fields, on failed validation
FormSection[]   the step body
CTA bar         Cancel · Back · Save and Continue / Submit
```

Edge cases: **conditional field reveal inside a step** (the handoff's "Case Type:
New / Ongoing" reveals three selects); a step that is legally optional; back-navigation
that must not lose entered values; **session expiry mid-wizard**; browser back between
steps; a step taller than the viewport (the handoff's `step-3-bank-beneficiaries-filled`
is 1730px of form in a 1024 artboard); the final step embedding `ReviewScreen`'s body;
resuming into a step whose earlier answers have since become invalid.

---

### 4.5 `OverviewScreen` — many records, aggregated

Drawn once (`e-anudaan-dashboard`), and the shape is unambiguous:

```
PageHeader  "Good afternoon, harijan" · "Last updated 14 August 2026 at 1:34 pm" · New Application
KpiRow      4 MetricCards with delta chips
DashboardGrid
  ChartCard "Application Status"  donut + legend with counts
  ChartCard "Financial Summary"   requested vs sanctioned, with a ratio bar
  Card      "Organisation Profile"  DescriptionList, "Auto-populated from DARPAN"
  Card      "Applications by Scheme" list with share bars
Card        "Recent Applications" — table + View All
```

Edge cases: **a ratio whose numerator and denominator come from different sources** —
banned; that published a `138%` once; a KPI with no figure at all (the row holds its
shape — `KpiRow`'s `loading` is a **count**, not a boolean, for exactly this reason); a
chart with one series; a chart with more categories than the palette distinguishes
(`CHART_CATEGORICAL_SAFE_CAP`); "Recent" when there is no recent.

---

### 4.6–4.18 The remaining templates

Specified in full in `.claude/rules/screen-templates.md` §4. In brief:

| Template | Body | Chief edge case |
|---|---|---|
| `AuthScreen` | `PortalLoginTemplate` — already built and already consistent across all 18 drawn screens | A role with no SSO; captcha and WCAG 2.2 §3.3.8 |
| `FormScreen` | `FormCard` + `FormSection[]` + one submit | Autosave semantics — optimistic or confirmed, and the department decides |
| `ChecklistScreen` | Batch dropzone + grouped rows + per-item status | Three per-item verdicts (uploaded / needs review / not valid) with expandable findings |
| `ReviewScreen` | Numbered `ReviewSection`s, `ReviewItem` pairs, edit links, declaration | An edit link must return the reader **to the step and back** |
| `ChooserScreen` | `radio-card` list + one CTA | The handoff draws this **three different ways under one name** — one design only |
| `DecisionScreen` | Record body + decision panel | A decision that cannot be unmade must say so before it is made |
| `CatalogueScreen` | Filter chips + `FileList` / cards | A download card states its **kind**, taken from the destination |
| `GalleryScreen` | Toolbar + grid/list + `Lightbox` | Grid and list share the same action set — the toggle changes density, not capability |
| `SearchScreen` | Query + facets + result rows | **`idle` renders differently from `empty`** |
| `InboxScreen` | Grouped `EventList` | A notification, a comment and an audit entry are one object — one primitive, three views |
| `SettingsScreen` | Section index + `InlineEdit` rows | Blocked on the optimistic-save decision; until then, confirmed saves |
| `ReportScreen` | Print-first table + export | Print pagination and repeated headers |
| `ConfirmationScreen` | Reference number + what happens next | **Absent from every source.** A citizen who submits and sees the dashboard cannot prove they submitted |
| `StatusScreen` | `ErrorView` | 404 / 403 / 500 / maintenance / offline are five different sentences |

---

## 5. Deliberate divergences from the handoff

Recorded here because `.claude/rules/standards-precedence.md` requires a documented
reason whenever the drawing is not followed.

| Handoff draws | We ship | Why |
|---|---|---|
| Sidebar at 300, 88, 268, 260, 280 | **300 and 88** | Three are drift, all inside SHRESHTA |
| Inner measure at ten values | **1140 @ 300, 1352 @ 88** | One page type has one measure per sidebar state |
| `navbar` 134 on 25 screens, `Navbar/Portal` 146 on one | **One masthead** | A single screen is not a variant |
| Two stepper treatments | **One** | A reader crossing schemes must not meet two progress bars |
| Three `select-scheme` designs under one name | **One `ChooserScreen`** | AVYAY/NAPDDR use `radio-card` instances; SHRESHTA hand-builds four frames with no component |
| No mobile application screen at all | **Every template has a mobile form** | 9 of 9 mobile frames are auth; a citizen applying on a phone is the common case, not the exception |
| No confirmation screen after submit | **`ConfirmationScreen`** | The journey ends with no receipt |
| No empty, error or filtered state anywhere | **All seven, in every template** | Mandatory under `data-state-completeness.md` |

---

## 6. How a new screen gets built

1. Say what data you have. Read §2. Pick the template.
2. Write the descriptor. TypeScript will tell you what is missing.
3. Render `<PortalPage>` + the template. There is no step 4.

```tsx
export default function WithdrawnApplications() {
  return (
    <PortalPage portal="e-anudaan" role="officer">
      <WorklistScreen {...withdrawnApplications} />
    </PortalPage>
  );
}
```

Everything else — the seven states, the mobile form, the URL state, the heading order,
the focus management, the number formatting — is already decided.

---

## 7. Governance

| Gate | Asserts |
|---|---|
| **`check:template-adoption`** | **Live.** A shrink-only ratchet over every portal page and shell |
| `check:ds-pages` | Each template's documentation page carries all six elements |
| `check:docs-coverage` | Every exported template has a page |
| `check:props` | Descriptor types are generated, never hand-written |

The adoption ratchet is the one that matters. It is the difference between `SidebarNav`
at 100% and `AppShell` at 0%.

**Where it stands, 6 September 2026:** `67 / 279` portal files composed from a template,
**212 declared in the baseline**. The baseline may only shrink — a new page that assembles
a screen by hand fails, and a baselined file that starts using a template also fails until
the baseline is re-recorded in the same change, so one page's migration cannot be spent
silently on another page's regression.

Both failure modes were exercised by breaking them deliberately before the gate was
trusted, per the estate's standing rule that a check nobody has watched fail is not a
check.
