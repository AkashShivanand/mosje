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

Status: ☐ todo · ◐ in progress · ☑ done · ⊘ blocked (reason given)

### Phase 0 — Foundations
- ☑ Consolidate every issue, recommendation and decision (`issue-register-consolidated.md`)
- ☑ Design read, principles, archive mechanism (this file)
- ☐ Skills applied: design-taste-frontend (direction), frontend-design, ui-ux-pro-max,
  refactoring-ui, emil-design-eng, apple-design (motion restraint), impeccable (polish),
  web-accessibility + gov-compliance + accessibility-auditor (audit), Vercel Web Interface
  Guidelines (read as reference; install was blocked by the permission classifier)

### Phase 1 — Archive & toggle
- ☐ Move current site to `website-classic`, noindex it
- ☐ Proxy rewrite on `sa-website-design=classic`
- ☐ Demo rail "Website" tab with the toggle (reloads on change)
- ☐ Gates/baselines updated for the moved tree (search index, links, ratchets)

### Phase 2 — Shell (every page)
- ☐ Masthead: DS `SiteHeader`, National Emblem lockup, task-and-audience nav (≤ 7 entries,
  one line at 1280), search that works, language, accessibility entry (one door), Login
- ☐ Page header: breadcrumb · `h1` = tab title · one-line standfirst · last-updated · no 340px band
- ☐ Footer: DBIM 5.6 four sections (Archives · Website Policy · Related Links · Feedback),
  lineage, real last-updated, visitor counter, "Report a problem with this page", agency credit
- ☐ Cookie consent that blocks non-essential scripts until accepted
- ☐ Print stylesheet; `lang="en-IN"`; skip link lands on `main#content`

### Phase 3 — Home page
- ☐ Hero: one message, search-first, task row (Find a Scheme · Apply · Track · Grievance · Helplines)
- ☐ Who is it for (persona entry, 11-group vocabulary, opens on Students)
- ☐ What the Department offers (10 kinds of support) → schemes
- ☐ Latest updates (paged, dated, newest first, not scrolling inside a card)
- ☐ Organisations & scheme portals (whole logos, uniform box, full names first)
- ☐ Campaign (NMBA / CCPS) band, PM Quote slot (awaiting authorised content)
- ☐ Helplines & support band; social cards (static, no empty embeds)

### Phase 4 — Templates (all ~116 routes)
- ☐ Content page (T1) · ☐ Listing/documents (T2) · ☐ Record library · ☐ Record detail (T7)
- ☐ Directory / Who's Who (T3) · ☐ Persona landing (T4) · ☐ Policy pages (T5)
- ☐ Contact (T6: Call · Write · Visit) · ☐ Schemes catalogue (facets) · ☐ Organisation detail
- ☐ Gallery (albums) · ☐ Search results · ☐ 404 with search + popular links
- ☐ Missing GIGW pages: Accessibility Statement · Screen Reader Access · Disclaimer ·
  Website Policy hub · Feedback · Archives

### Phase 5 — Audit (creative director · senior QA · Secretary · citizen)
- ☐ axe + keyboard + 200% zoom + 320px reflow on every template
- ☐ Contrast, focus, target size, reduced motion, headings outline
- ☐ Copy pass: Title Case, government register, no em-dash flourishes, no AI tells
- ☐ Performance: LCP, CLS, payload; images sized
- ☐ DBIM / GIGW / UX4G checklist re-scored against the redesign
- ☐ `npm run ci` green

### Phase 6 — Figma handoff
- ☐ New file in the same project as `MoSJE [Handoff]` (`Ds5qx61QsI0ZkYSrLKxo0A`)
- ☐ Pages: START HERE · Home · templates · states · mobile · OLD SCREENS — DO NOT USE
- ☐ Bound to SAMAVESH `3FF5l0SMNIwdpZrKkeyPTm` only (instances, variables, text styles)
- ☐ Handoff-structure gate + screenshot audit

## Decisions taken here (flag if wrong)

| # | Decision | Why |
|---|---|---|
| D1 | Primary nav is task-and-audience shaped: About · Schemes & Services · Organisations & Scheme Portals · Documents · Media · Connect | Menu option pending with the Ministry (M1b/M2/M2b); this adopts M1b's label and gives Schemes its own entry (M2b), the two the review leaned towards |
| D2 | No counts on discovery screens, except the grouped Schemes page headings (computed) | 8 & 14 Sep decisions |
| D3 | Personas use the 11-group vocabulary and open on Students | 8 Sep decision |
| D4 | No hero carousel; one static hero, campaigns as their own band | WCAG 2.2.2, CA P0 #8/#10, NAV-05 |
| D5 | PM Quote slot built, content left for the Ministry to authorise | BRD-11; no unauthorised quote is invented |
