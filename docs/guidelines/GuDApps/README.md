# GuDApps — Guidelines for Development of e-Governance Applications

Where GIGW covers **websites**, GuDApps covers **applications** — the architecture, data design,
validations and screen mechanics behind an authenticated workflow. It explicitly complements
GIGW rather than competing with it, which makes it the most relevant of the four documents to
`apps/hub/src/app/portals/*`.

| | |
| --- | --- |
| Publisher | National Informatics Centre (NIC) / MeitY |
| Document number | NIC-GDL-DA-1.1 |
| Version | 1.1, 29 August 2017 · ISBN 978-81-909457-1-4 · ~172 pages |
| Binding? | **Best practice — not mandatory.** Follow it where it costs nothing; it is not a gate. |
| Source | guidelines.india.gov.in |

## Files

| File | What it is |
| --- | --- |
| `GuDApps.md` | Plain-language summary — the document's identity, objectives, guideline areas and key facts. Specific facts (identifier structures, version numbers, ISBN) are taken directly from the source. |
| `GuDApps.pdf` | The original, with the full text and figures. |

Note this transcription is a **summary**, not a full reproduction — unlike the DBIM and GIGW
files in neighbouring folders. Go to the PDF for anything load-bearing.

## What it covers

| Chapter | Subject |
| --- | --- |
| 2 | Data quality — identifiers, master data, validation at source |
| 3 | Authentication |
| 4 | Forms |
| 5 | Reports |
| 6 | Application development frameworks |
| Appendices | Compliance matrix and a worked case study |

## Where it earns its keep here

The portals in this estate are exactly what GuDApps was written about: identity, forms,
document upload, approval chains, MIS reporting. Its forms and reports chapters are worth
reading alongside `../UX4G-3.0/UX4G_3.0_Design_System.md` §7 (content design) and §10 (patterns
P-03 Application and Submission, P-04 Status and Tracking) — GuDApps gives the data and
validation view, UX4G gives the interaction and copy view, and a portal flow needs both.
