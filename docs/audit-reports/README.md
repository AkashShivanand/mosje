# Audit Reports

**Every audit or review of this estate, in one place** — whether an outside body
sent it to us or we wrote it ourselves. One folder per report, named
`YYYY-MM-DD-<who>-<what>`, holding the document as it stands plus a `README.md`
saying what it covers, its headline numbers, and where our response lives.

Related, and deliberately separate: `docs/audit/` holds our own working audit
notes; `docs/qc/` holds the QC deliverables and portal tracker; `docs/guidelines/`
holds the standards themselves.

It exists because until 2026-09-25 these reports had no home. The May 2026 NIC
DBIM audit sat in `docs/source-brd/` under a different name, two UX4G audits had
never entered the repository, and the September DBIM observations were in a
Downloads folder. Our own follow-up
(`docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md`) cites "the NIC DBIM
Compliance Audit of May 2026" as though anyone could find it.

## The register

| Dated | Produced by | Report | Subject | Items | Our response | Status |
|---|---|---|---|---|---|---|
| 2026-05-09 | NIC / GOV.in | [DBIM Compliance Audit](2026-05-09-nic-dbim-compliance-audit/) | dosje.gov.in against DBIM 3.0 | Generic **56.52%**, Ministry **55.88%** pass | `docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md` and `docs/compliance/COMPLIANCE-CHECKLIST.md` | Followed up Sept 2026 |
| 2026-09-18 | UX4G / NeGD | [Manual UX Audit](2026-09-18-ux4g-manual-ux-audit/) | Heuristic review of dosje.gov.in | 4 challenge themes across 7 areas | **None yet** | Open |
| 2026-09-23 | DBIM reviewer | [DBIM Non-Compliance Observations](2026-09-23-dbim-non-compliance-observations/) | dosje.gov.in homepage | 20 observations | Verification and reply drafted | Reply pending despatch |
| 2026-09-25 | UX4G / NeGD | [UX Audit 360](2026-09-25-ux4g-audit-360/) | Automated audit of dosje.gov.in | Overall **82%**, 6 parameters | **None yet** | Open |
| 2026-09-25 | **Ours** — Geetika Aniwal Das | [Website Design Audit v1](2026-09-25-dosje-website-design-audit/) | dosje.gov.in page by page | **45 points** across 8 pages | Is itself a response | Open |

## Where these items are tracked

The consolidated tracker is the **website issue register** at
`/reports/dosje-website`, backed by `apps/hub/src/data/website-issues/issues.json`
with statuses in Supabase.

**As of 2026-09-25 the register holds only our own sweep of 21 September 2026** —
2,015 rows, none of them carrying the source they came from. The five reports
above are **not** yet rows in it. Folding them in, with a `source` on every row,
is tracked separately.

The May 2026 DBIM audit additionally has its own checklist at
`docs/compliance/COMPLIANCE-CHECKLIST.md` — 84 checkpoints, 25 marked failing.
It is a markdown checklist, not in the register's format, and its state is not
synced anywhere.

## Filing a new report

1. `mkdir docs/audit-reports/YYYY-MM-DD-<who>-<what>`
2. Put the document in **unchanged**, renamed only so a human can read the
   filename. Record the original name in the folder README if it carried an id.
3. Write the folder `README.md`: who produced it, what it covers, the headline
   numbers, and where our response lives once there is one.
4. Add a row to the register above. A report with no row is a report nobody finds.
5. Fold its items into the issue register with `source` set to that report.

## One file that is deliberately elsewhere

The May 2026 NIC DBIM audit's PDF stays at `docs/source-brd/MoSJE DBIM Audit.pdf`
because six files cite that exact path, including `CLAUDE.md` and
`packages/tokens/reference/dbim-palette.json`, whose provenance note records that
the DBIM Blue group was cross-checked against it. Moving it would rewrite a
provenance record to tidy a folder. Its folder here carries the summary and points
at it.

Two references are already stale and name `Documents/MoSJE DBIM Audit.pdf`, a path
that does not exist — `MOSJE-ARCHITECTURE.md:124` and
`docs/compliance/COMPLIANCE-CHECKLIST.md:139`.

## Not kept here

Audits of other organisations. Two UPSC reports NeGD shared as worked examples
(a UX4G Audit 360 scoring 34% and a NeGD DBIM audit) were removed on 2026-09-25:
this folder is about this estate, and a stray 34% is a number waiting to be
misquoted as ours.
