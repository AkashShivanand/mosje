# Website Redesign 2026 — Plan & Tracker

Branch `feat/website-redesign`. Owner: design director / UI-UX lead (this session).
Inputs: `issue-register-consolidated.md` (220 site-wide issues, 17 stakeholder decisions,
page inventory) · `apps/hub/src/data/website-issues/issues.json` (2,016 issues) ·
`docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md` · `docs/guidelines/` (GIGW 3.0, DBIM 3.0, UX4G 3.0).

## Design read

Full visual overhaul of a public-sector ministry information site, for citizens, students,
NGOs, officials and researchers. The language is trust-first, editorial and calm, and it is
built on SAMAVESH. Dials: variance 4 · motion 2 · density 5.
Authority order: WCAG 2.2 AA → DBIM 3.0 → GIGW 3.0 → UX4G 3.0 (`standards-precedence.md`).

### Principles (every page is judged against these)

1. **Task before institution.** The first screen answers "what can I do here": find a scheme,
   apply, track, complain, call a helpline. Divisions and file types come second.
2. **One of everything.** One masthead, one page header, one listing row, one document row,
   one card, one table, one focus ring, one set of action words (View Details · View Document ·
   View All · Apply Now · Track Application).
3. **Accessible by construction.** Landmarks, one `h1`, skip link to `#content`, focus visible
   on everything, 24px minimum targets (44 on touch), no autoplay, reflow at 320px, every
   state designed (loading · empty · error · filtered-to-nothing · too-much).
4. **Nothing the page does not need.** No diagnostics, no instructions for reading the UI,
   no restatement. Government register, Title Case titles, the department's own words.
5. **Honest data.** Every figure has one source and a date; every page shows its real
   last-updated date. Nothing typed that could be derived.

## Archive mechanism (classic design stays reachable)

- The current site moves to `app/website-classic/` (noindex, unchanged content).
- The new design is built at `app/website/`, in `components/website-next/`.
- Demo rail → **Website** tab → *New design / Classic design*. It writes the cookie
  `sa-website-design`; `proxy.ts` rewrites `/website/*` to `/website-classic/*` while it says
  `classic`. The URL is unchanged, both trees stay static, and nothing flashes or ships twice.

## Checklist

Status: ☑ done · ◐ partly done (what remains is named) · ⊘ blocked (who unblocks it)

### Phase 0 — Foundations
- ☑ Every issue, recommendation and decision consolidated (`issue-register-consolidated.md`)
- ☑ Design read, principles, archive mechanism; build spec (`DESIGN-SPEC.md`)
- ◐ Skills: design-taste-frontend, frontend-design, figma-use, figma-generate-design,
  figma-create-new-file and find-skills were used; the auditors ran as the estate's
  accessibility-auditor and a creative-director/Secretary/citizen critic. Vercel's Web
  Interface Guidelines were read as a reference. `npx skills add` was blocked by the
  permission classifier, so no new skill was installed.

### Phase 1 — Archive & toggle
- ☑ Classic site archived at `app/website-classic` (noindex), reachable at the same addresses
- ☑ Proxy rewrite on `sa-website-design=classic`; demo rail **Website** tab
- ☑ Gates re-keyed for the moved tree (type, icon, org-logo baselines; link and search gates)

### Phase 2 — Shell
- ☑ Masthead (SAMAVESH `SiteHeader`, task-and-audience menu, one line at 1024, no BETA)
- ☑ One page header (breadcrumb · h1 · standfirst · stored last-updated date)
- ☑ Footer with DBIM 5.6's four sections, real date, "Report a problem with this page"
- ☑ Cookie consent on the first page landed on; print stylesheet; skip link lands on `#content`
- ☑ Closed UX4G panel made inert (it had taken the first Tab presses — ACC-01)

### Phase 3 — Home
- ☑ Hero with working search and five tasks · eleven groups · ten kinds of support ·
  latest updates · campaign · organisations · the Department · helplines
- ⊘ PM Quote (DBIM): waits for an authorised quote and image from the Ministry

### Phase 4 — Templates (all routes)
- ☑ Content · Listing/Record library · Record detail · Directory/Who's Who · Persona ·
  Policy · Contact · Find a Scheme + scheme pages · Organisation · Events · Gallery albums ·
  Search · 404/error · Dashboard · portal directories · List of Scheduled Castes
- ☑ New pages: Accessibility Statement · Screen Reader Access · Disclaimer · Website
  Policies · Feedback · Archives
- ◐ Maps and PM-AJAY dashboards still use the classic data-viz components inside the new
  layout (de-addiction locator rebuilt on the SAMAVESH India outline)

### Phase 5 — Audit
- ☑ axe-core, WCAG 2.2 AA: 52 route×viewport scans, 0 serious or critical findings after
  fixes (one declared false positive: gallery pager "obscured" by its ellipsis) —
  `tools/website-redesign/axe-scan.mjs`
- ☑ Keyboard, 200% zoom, 320px reflow, headings, landmarks, forms (accessibility auditor)
- ☑ Creative-director / Secretary / citizen review; all P0 findings fixed (search, legacy
  scheme pages, Secretary, India map, floating widgets)
- ☑ Every website gate green (links, search index, typography, icons, org logos, chrome,
  link-as, shadow-ui, breakpoints, lint, stylelint, typecheck, 684 unit tests)
- ☑ `npm run ci:clean` (fresh lockfile install, production build, CI's axe step): 42 passed,
  0 failed, 4 skipped (GitHub-event-only steps)

### Phase 6 — Figma handoff
- ☑ New file **MoSJE Website 2026 [Handoff]** (`yXEE9EHO8PYXLDEJeoHmWG`) in the UX4G –
  Digital India Corporation project 587332315
- ☑ START HERE · SCREENS BY JOURNEY (8 sections, 15 screens: 12 desktop, 3 phone) · SHARED
  PARTS (12 local components + image library) · STATES · OLD SCREENS — DO NOT USE
- ☑ Bound to SAMAVESH only; library gaps recorded on START HERE
- ◐ Phone frames drawn for Home, Find a Scheme and Annual Reports; the other journeys have
  desktop frames, and the code's phone layouts are the reference for them

## Content the Department must supply or correct

Recorded by the build and audit agents (details in commit messages): 53 tender titles cut
at 12 characters in the source; Annual Report 2021-22 dated 2021; BJRNF 2024-25 report
dated May 2024; NCSC Member email; Secretary portrait; switchboard, mailbox and office
hours; official websites for seven corporations and foundations; one portrait set to one
specification; missing NMBA gallery photographs; privacy policy lawful basis and grievance
officer; the conflicting "Netaji Subhash Place, 110034" address on the classic Contact page.

## Decisions taken here (flag if wrong)

| # | Decision | Why |
|---|---|---|
| D1 | Primary nav is task-and-audience shaped: About · Schemes & Services · Organisations & Scheme Portals · Documents · Media · Connect | Menu option pending with the Ministry (M1b/M2/M2b); this adopts M1b's label and gives Schemes its own entry (M2b), the two the review leaned towards |
| D2 | No counts on discovery screens, except the grouped Schemes page headings (computed) | 8 & 14 Sep decisions |
| D3 | Personas use the 11-group vocabulary and open on Students | 8 Sep decision |
| D4 | No hero carousel; one static hero, campaigns as their own band | WCAG 2.2.2, CA P0 #8/#10, NAV-05 |
| D5 | PM Quote slot built, content left for the Ministry to authorise | BRD-11; no unauthorised quote is invented |
