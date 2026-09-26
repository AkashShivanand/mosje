# DBIM Compliance Audit Report — NIC, May 2026

**From:** National Informatics Centre (NIC) / GOV.in
**Subject:** dosje.gov.in measured against DBIM 3.0
**Dated:** May 2026 (file version 09.05.2026) · 30 pages

## The document

**The PDF is at `docs/source-brd/MoSJE DBIM Audit.pdf`**, not in this folder. It is
cited by that exact path in six places, including `CLAUDE.md` and the provenance
note in `packages/tokens/reference/dbim-palette.json`, so it was left there
rather than moved. See the "deliberately not here" section of the parent README.

## What it covers

Two checklists, scored checkpoint by checkpoint:

- **Generic** (all government websites) — colours, iconography, typography,
  header and footer, logo, imagery, content, search, performance. Pass rate at
  audit: **56.52%**.
- **Ministry/Department** — information architecture, personas, homepage
  components, PM quote, content sections. Pass rate at audit: **55.88%**.

Section 4 carries the non-compliance observations, pages 15–30.

## Why it matters beyond compliance

This report is a **source of record for DBIM's own values**. The Blue primary
group on p.14 and the Linen background rule on p.15 were used to cross-check the
palette transcribed into `packages/tokens/reference/dbim-palette.json`, because
the DBIM Toolkit itself is a JS-rendered SPA behind a login and cannot be fetched.
Treat the file as evidence, not just correspondence.

## Our response

`docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md` — our September 2026
follow-up, which describes itself as a follow-up to this audit and scores DBIM,
GIGW and UX4G separately.
