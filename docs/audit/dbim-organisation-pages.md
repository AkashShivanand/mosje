# DBIM organisation pages — what the live pages carry that was not republished

Read 29 Sep 2026 from `https://www.dosje.gov.in/organisation/<id>/` by
`scripts/build-organisation-profiles.mjs`. Rendering: `lib/website-dbim/organisation.ts`,
links: `lib/website-dbim/live-links.ts`. Kept here, not on the page, per
`.claude/rules/ui-restraint-and-copy.md`.

## Reference page

The Dr. Ambedkar Foundation page carries the widest mix of any body's page: headline
figures, About with Vision and Mission, leadership with photographs, categorised scheme
cards, projects, annual reports, publications, four Latest Updates tabs (two of them
empty, in the live page's own words), gallery, social accounts and a contact block with
eight purpose-specific telephone lines. NCSC is the second check: tenure dates, activity
tiles, twelve state offices, dated events, travel directions.

## Left out, with the reason

| Body | What | Why |
|---|---|---|
| Babu Jagjivan Ram National Foundation | its whole page | No page on the live site (404 on 29 Sep 2026); the DBIM page falls back to the older scrape's prose. |
| DAIC | Vacancies tab, four rows | Each is titled only "Dr. Ambedkar International Centre (DAIC)" and links back to DAIC's own page. A defect of the live page. |
| DAIC | Tenders tab, four rows | Blank titles, type "Department", target `#`. A defect of the live page. |
| DAIC, NISD | Gmail addresses in Contact | Free-mail addresses are not published (CON-09), as on every people page of the estate. |
| NCSC | Instagram account | The live card links `instagram.com/p/` with no post id, which opens nothing. |
| DAF | Facebook handle | The live card prints `@profile.php` — a URL fragment, not a handle. The account link is kept. |
| DAF scheme cards | full titles | The live cards publish titles already cut with "…"; they are shown as published. |

## Links that still leave the estate, on purpose

Other bodies' own sites (ncsk.nic.in, ncbc.nic.in, nbcfdc.gov.in), government services
(jeevanpramaan.gov.in, pensionersportal.gov.in, …), social media, and the Department's
portals the estate has not built: DWBDNC's SEED (`dwbdnc.dosje.gov.in`), NISD's TAPAS,
PM-SURAJ, PM-DAKSH, NAMASTE and the coaching portal. Nasha Mukt and PM-AJAY links open
the estate's own portals.

## Outside this change, found by the crawl

- Ministry › Our Performance links the live Beneficiary Dashboard (deliberate, per the
  comment on `DBIM_DASHBOARDS`).
- Offerings › Vacancies rows open vacancy pages on the live site; the vacancies register
  carries no file for them. Same fix pattern applies.
