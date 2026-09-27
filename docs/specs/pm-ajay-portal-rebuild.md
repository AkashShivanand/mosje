# PM-AJAY — rebuilding the portal on SAMAVESH

**Decided 2026-09-24.** The hub's PM-AJAY build stops being a dashboard prototype and
becomes the whole portal: every screen, every state, every role the live MIS
(`pmajay-dev.mosje.in`) publishes — rebuilt from the design system rather than copied.

## 1. What is there, and what we have

The live portal serves **224 screens across twelve signed-in roles**, plus the sign-in
surface. Ours has eleven.

| | Live | Ours today |
|---|---|---|
| Ministry | 48 | 7 |
| GIA — district and state, maker and checker | 73 | 0 |
| Hostel — district and state, maker and checker | 40 | 0 |
| Adarsh Gram — village, district, state | 63 | 0 |
| Sign-in and recovery | 1 | 2 |
| Screens only ours has | — | 2 (Unified Dashboard, All Indicators) |

The inventory is `apps/hub/src/lib/pm-ajay/portal-map.ts`, generated from the
design-audit capture of 2026-09-12 — what the portal actually serves, not a wish list.
`status` on each screen is the measure of progress, and the only field a build changes.

## 2. What is kept and what is scrapped

**Kept.**
- The **six dashboards and the Unified Dashboard** — they answer the same questions as
  the live `/admin/*` dashboards and are already on the design system. They become the
  Ministry section's Overview, re-pointed at real routes instead of hash views.
- The **sign-in and recovery screens**, which run on `PortalLoginTemplate` /
  `PortalRecoveryTemplate` and need only the role set widening.
- The **fluid page frame** (PR #599): no cap, `--sa-grid-margin-page`, the rail a column
  from 768px and the masthead's drawer below it.

**Scrapped.**
- The portal's **own colour ramps** in `pm-ajay.css` (PMH-005). The rebuild binds
  `--sa-*`; a literal survives only with a written reason.
- The **44 hand-written icon spans** (PMH-007) — `<Icon>` everywhere.
- The **hand-rolled table, chart chrome and filter bar**, replaced by `DataTable`,
  `ChartCard` and the design system's `Select` / `Chip` filter set (PMH-009).
- Anything the live portal does not have and no role asked for.

## 3. The architecture

- **One shell.** `PortalPage` (which wraps `AppShell`) with `portal="pm-ajay"`,
  `role=<the signed-in role>`, `nav` filtered by role, `linkAs={Link}`. Nothing
  hand-rolls chrome again.
- **Routes mirror the live portal's own paths** under `/portals/pm-ajay`, so a screen
  can always be checked against its original.
- **One session, twelve roles.** The demo auth context gains the twelve roles from the
  live portal, each with the nav and the screens that role can reach. Hiding a link is
  not authorisation — it is so a district officer is not shown a rail full of
  destinations that will refuse them.
- **Data is one mock dataset** with declared provenance, per `prototype-data-modes.md`.
  A figure that no source publishes is left off the screen, never invented.

## 4. The six screen types, and what each owes

| Type | Count | Template | States it must carry |
|---|---|---|---|
| **dashboard** | 14 | KPI row + `ChartCard` grid + `DataTable` | loading, empty, error, filtered-to-nothing, populated |
| **report** | 83 | filter bar + `DataTable` + export | the five above, plus **too much** — paged, never scrolled inside a card |
| **worklist** | 11 | `DataTable` with row actions + status chips | the five, plus "nothing awaiting you", which is not the same as empty |
| **form** | 19 | `FormLayout` with fieldsets, inline validation, sticky actions | idle, invalid, submitting, saved, server-refused |
| **search** | 4 | search field + results | **idle** (not asked yet) rendered differently from **empty** |
| **manage** | 10 | list + create/edit dialog | the list's five, plus the dialog's five |
| **page** | 87 | whatever the live screen is; classified as it is built | — |

`data-state-completeness.md` binds every one of them: one request, one answer; the render
branches once; long results are paged.

## 5. The order of work

Waves, each one landing as its own PR, each screen built with its live capture beside it.

1. **Foundations** — the twelve roles in the auth context, the role-filtered rail, the
   route table, the six type templates, the mock dataset.
2. **Ministry (48)** — the largest role and the one the department demonstrates.
3. **GIA (73)** — district and state, maker and checker. The checker screens differ from
   the maker's by their actions, not their layout.
4. **Hostel (40)**.
5. **Adarsh Gram (63)** — the village role first; it is the only one a citizen-facing
   officer uses.
6. **Parity pass** — every screen checked against its live original, `status` moved to
   `verified`, and the differences we chose recorded here.

## 6. Where the built screens live in Figma

The district's twenty-seven screens are on the **PM-AJAY page of `MoSJE Portal [Handoff]`**
(`evmNmlK8g4VYwJVu2FwSGV`), in a section of their own to the right of the designers' work:
**Adarsh Gram — District · Built Screens (24 Sep 2026)**. One sub-section per journey, in the
order the work happens, and a read-me card saying what they are.

Nothing that was already on that page was moved, renamed or archived — the rule
(`figma-handoff-page-structure.md` §3) forbids it, and these are **built** screens, not designs:
they record what the code renders, beside what was drawn.

**Two Figma files are named `MoSJE Portal [Handoff]`.** The live one is
`evmNmlK8g4VYwJVu2FwSGV` — twelve pages, the September dev syncs, and the file the audit config
already used. `gH2vQ62cfg4677YKWuOpLc` is an older duplicate whose PM-AJAY page holds two sections
against the live one's six. `tools/figma-handoff-structure/pages.json` registered PM-AJAY against
the duplicate and now points at the live file; **E-Utthan, SCW and NHAPOA still point at the
duplicate** and want the same check by someone who knows which is current.

## 7. What blocks the rebuild today

**The dev logins in the "Roles and Access" sheet are rejected.** Tested 2026-09-24 on
`https://pmajay-dev.mosje.in/auth/sign-in` with the Ministry, GIA District Maker, Hostel
State Maker and Adarsh Gram State accounts: every one returns **400** from
`/api/v1/auth/admin/login` and the page shows *"Invalid User Name or Password"*. The same
accounts worked on 2026-09-12, so they have been rotated or the dev database has been
reset.

Until they work:
- no screen can be captured, so no screen can be rebuilt faithfully;
- the 2026-09-12 captures are gone with the scratch worktree that held them, and the
  copies embedded in the Design QC Figma sheet render at 520px wide — legible as a
  reminder, not as a reference.

**What is needed:** working dev accounts for the twelve roles, in the same sheet.

**Resolved for two roles, 24 Sep 2026.** Production accounts for the Ministry and the Adarsh Gram
district officer were supplied (`pm-ajay.dosje.gov.in`), and the district's twenty-seven screens
were captured read-only and rebuilt. The dev accounts are still needed for the other ten roles.

Because the capture is from **production**, two rules held throughout: nothing that could write was
ever clicked — navigation and tabs only, never submit, approve, reject, delete or upload — and no
captured screen is published anywhere outside this repository's ignored scratch space. The screens
pushed to Figma are of OUR rebuild, which carries illustrative data, not of the live registers.
