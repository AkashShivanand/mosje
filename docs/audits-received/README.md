# Audits Received

**Every audit, review or observation note this estate has been sent by someone
outside the project team lives here.** One folder per report, named
`YYYY-MM-DD-<who>-<what>`, holding the document exactly as it arrived plus a
`README.md` saying what it is and what we did about it.

This folder is for what we were **sent**. Audits **we** produced are
`docs/audit/`; our QC deliverables are `docs/qc/`; the standards themselves are
`docs/guidelines/`.

It exists because until 2026-09-25 received reports had no home. The May 2026
NIC DBIM audit sat in `docs/source-brd/` under a different name, two UX4G audits
had never entered the repository at all, and the September DBIM observations were
in someone's Downloads folder. Our own follow-up
(`docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md`) cites "the NIC DBIM
Compliance Audit of May 2026" as though anyone could find it.

## The register

| Received | From | Report | Subject | Our response | Status |
|---|---|---|---|---|---|
| 2026-05-09 | NIC / GOV.in | [DBIM Compliance Audit Report](2026-05-09-nic-dbim-compliance-audit/) | dosje.gov.in against DBIM 3.0. Generic pass **56.52%**, Ministry pass **55.88%** | `docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md` | Followed up Sept 2026 |
| 2026-05-18 | NeGD | [UX4G Audit 360 — UPSC](reference-other-organisations/) | Sample report for upsc-uat.negd.in, overall **34%** | — | Reference only, not about us |
| — | NeGD | [NeGD DBIM Audit — UPSC](reference-other-organisations/) | Another organisation's DBIM audit | — | Reference only, not about us |
| 2026-09-18 | UX4G / NeGD | [Manual UX Audit](2026-09-18-ux4g-manual-ux-audit/) | Heuristic review of dosje.gov.in — navigation, accessibility, content clarity, mobile | **None yet** | Open |
| 2026-09-23 | DBIM reviewer | [DBIM Non-Compliance Observations](2026-09-23-dbim-non-compliance-observations/) | 20 observations on the dosje.gov.in homepage | Verification + reply drafted, see folder README | Reply pending despatch |
| 2026-09-25 | UX4G / NeGD | [UX4G Audit 360](2026-09-25-ux4g-audit-360/) | Automated audit of dosje.gov.in, overall **82%** | **None yet** | Open |

## Filing a new report

1. `mkdir docs/audits-received/YYYY-MM-DD-<who>-<what>`
2. Put the document in **unchanged**, renamed only so a human can read the
   filename. Keep the original name in the folder README if it carried an id.
3. Write the folder `README.md`: who sent it, what it covers, the headline
   numbers, and where our response lives once there is one.
4. Add a row to the register above. A report with no row is a report nobody will
   find.

## One report that is deliberately not here

The May 2026 NIC DBIM audit's PDF stays at `docs/source-brd/MoSJE DBIM Audit.pdf`
because six files cite that exact path, including `CLAUDE.md` and
`packages/tokens/reference/dbim-palette.json`, whose provenance note records that
the DBIM Blue group was cross-checked against it. Moving the file would rewrite a
provenance record to make a folder tidier. Its folder here carries the summary and
points at it. Consolidating the path is a separate chore.

Two references are already stale and point at `Documents/MoSJE DBIM Audit.pdf`,
a path that does not exist — `MOSJE-ARCHITECTURE.md:124` and
`docs/compliance/COMPLIANCE-CHECKLIST.md:139`. Left alone here to keep this
change to one subject.
