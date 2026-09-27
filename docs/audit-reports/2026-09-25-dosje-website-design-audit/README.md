# DoSJE Website Design Audit v1 — September 2026

**Produced by:** Geetika Aniwal Das — **our own team**, not an external body.
**Subject:** dosje.gov.in, reviewed page by page
**Version 1, September 2026** · 35 pages · screenshots captured 18 September 2026 at 1440px

## What it is

A page-by-page review of the live website. Every point carries a screenshot from
the live site with the problem marked in red, and a suggestion. Organisation
Details was reviewed on the NCSC page.

## 45 points across eight pages

| Page | High | Medium | Low | Total |
|---|---|---|---|---|
| Homepage | 1 | 11 | 5 | **17** |
| About Us | – | 1 | 2 | **3** |
| Who's Who | – | 1 | 1 | **2** |
| Organisation Details | – | 4 | 3 | **7** |
| Offerings | 1 | 4 | – | **5** |
| Documents | – | 1 | 1 | **2** |
| Events & Gallery | – | 2 | 2 | **4** |
| Contact Us | 1 | 4 | – | **5** |
| **All pages** | **3** | **28** | **14** | **45** |

Severity means: **High** breaks an accessibility rule or stops the main task,
fix before the next release. **Medium** looks or works differently from the rest
of the site, fix this cycle. **Low** is polish.

## The five themes

1. Some text is hard to read — the SAMAVESH banner is white on orange, failing contrast.
2. The same content looks different everywhere — schemes, tenders, vacancies,
   documents and events each have their own card design.
3. Pages carry more than people need — long paragraphs, tall banners, "NA" values,
   filters that do not apply.
4. Lists are hard to compare — tenders and vacancies as cards, not tables.
5. Some parts do not work as expected — empty social feeds, floating buttons
   covering controls, Contact missing officers GIGW requires.

## Fix these first

| # | Action | Point ids |
|---|---|---|
| 1 | Make the SAMAVESH banner text black | HP-06 |
| 2 | Show Tenders, Vacancies, Documents and Notices as tables | OF-04 |
| 3 | Agree one card for listings and one for documents, use them everywhere | HP-11, HP-13, OF-01, OD-04 |
| 4 | Stop showing "NA" and filters that do not apply | OF-02, OF-03, DO-01 |
| 5 | Replace the social media feeds with simple profile cards | HP-17, OD-06 |

## Note

Its points already carry ids (`HP-`, `OF-`, `OD-`, `DO-` and so on by page), which
makes it the easiest of the five reports to fold into the issue register.

Version 1.1 circulated on 21 September was folded back into this v1 file, which
was regenerated on 25 September. There is one current version.
