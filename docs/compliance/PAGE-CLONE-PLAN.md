# dosje.gov.in — Full Page Clone Plan

**~85 distinct pages** (from `wp-sitemap-posts-page-1.xml`) + data-driven detail pages. They collapse into **~9 reusable templates**. We build each template once (GIGW/DBIM-compliant by construction), then populate with real content. Built so far: **Homepage** ✅.

Shared scaffolding to build first (used by every template):
- `PageLayout` — Header + main + SiteFooter + ImportantLinks (already built) + **Breadcrumb** + **"Last Updated" stamp** + page `<h1>`/title metadata.
- `Breadcrumb`, `PageHero` (title band), `DataTable` (sortable/filterable + pagination), `FilterBar`, `Pagination`, `Card` variants.

| # | Template | Representative page | Covers (count) | Notes |
|---|----------|--------------------|----------------|-------|
| **T1** | **Content / Inner page** (title + breadcrumb + rich body, optional sidebar TOC) | `/about-us/` | about-us, about-the-division ×6, welfare-of-obc, drug-division, official-language ×3, *-faqs, ngo grant guidelines ×8, handbook, research-studies, assurances, special-mention-377, list-of-scheduled-castes… | **~26 pages** — biggest win |
| **T2** | **Listing / Documents** (filter + sortable table/cards + pagination + download) | `/annual-reports/` | schemes-services, vacancies, tenders, annual-reports, circulars-notifications, publications, acts-rules, forms-templates, notices, mou, advices, policies, miscellaneous, resources, suo-moto-disclosure, updates, minutes ×2, demand-for-grant, blacklisted-ngos ×2, supreme-court-judgement, lok-sabha-qa | **~24 pages** |
| **T3** | **Directory** (people/contacts grid + search/filter) | `/mosje-directory/` | directory, mosje-directory, whos-who, chairpersons-office, contact-person, +11 org directories (ncbc/ncsk/dwbdnc/daf/daic/nbcfdc/nsfdc/nskfdc/nisd/scw/bjrnf/pm-ajay) | **~17 pages** |
| **T4** | **Persona landing** (tailored services per persona) | `/home-page/for-beneficiary/` | for-beneficiary, for-student, for-researchers, for-government-official | **4 pages** — DBIM persona requirement |
| **T5** | **Policy / legal** (GIGW-mandatory simple content) | `/home-page/privacy-policy/` | terms-conditions, privacy-policy, copyright, hyperlinking-policy, accessibility-statement, sitemap, rti | **~7 pages** — required for GIGW |
| **T6** | **Contact** (form + map + CIO/WIM/PIO block) | `/contact-us/` | contact-us, mosje-contact | **2 pages** — keyboard-friendly form |
| **T7** | **Detail views** (data-driven single item) | scheme / document / organisation / event / official / cpio detail | all `/organisation/*`, `/schemes-services/*`, `/documents/*`, `/events/*`, etc. | **6 detail templates** |
| **T8** | **Gallery / Events** (media grid + lightbox) | `/gallery/`, `/events/` | gallery, events | **2 pages** |
| **T9** | **Dashboard / Portals hub** | `/dashboard/`, `/samavesh-*-portals/` | dashboard, samavesh-citizen-portals, samavesh-admin-portals | **3 pages** |

## Build order (value × reuse, compliance-first)
1. **Shared scaffolding** (PageLayout, Breadcrumb, PageHero, DataTable, Pagination, FilterBar)
2. **T5 policy pages** — fast, and they close GIGW-mandatory gaps the original ⚠️ failed
3. **T1 Content** — unlocks ~26 pages
4. **T2 Listing/Documents** — unlocks ~24 pages
5. **T3 Directory** — ~17 pages
6. **T4 Personas** (DBIM requirement) → **T6 Contact** → **T7 details** → **T8 gallery/events** → **T9 dashboard**

## Per-template definition of done
- Real content + assets extracted from the live page (via `clone-website` / browser MCP).
- Passes `gov-compliance` (DBIM + GIGW + UX4G) and `accessibility-auditor`.
- `npm run build` green; `/qa <live-url>` visual diff acceptable at 1440 + 390.
- Fixes the ⚠️ items the original failed (footer lineage, button states, cookie consent, captions, alt text, etc.).

> Routing: Next.js App Router under `dosje/src/app/<route>/page.tsx`, reusing template components from `dosje/src/components/templates/`.
