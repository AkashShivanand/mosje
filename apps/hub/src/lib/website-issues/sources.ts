/**
 * Where each issue came from.
 *
 * The register began as one audit — our own sweep of 21 September 2026 — and a
 * row therefore carried no provenance. Five separate reports now feed it, two of
 * them from outside bodies, and a reader who cannot tell NIC's observation from
 * our own cannot answer the only question that matters when a reply is being
 * drafted: has this been raised before, and by whom.
 *
 * A row carries a LIST of sources, not one. Reports overlap heavily — the
 * SAMAVESH banner's contrast is a point in our design audit, a DBIM colour
 * clause and a GIGW failure — and the alternative to a list is the same defect
 * entered three times under three ids, which is how a tracker stops being
 * believed. One row, every report that raised it.
 *
 * The documents themselves are in docs/audit-reports/, one folder per report,
 * named by the `report` key below.
 */

export interface SourceRef {
  /** Folder key under docs/audit-reports/. */
  report: string;
  /** The item's own identifier in that report, where it has one. */
  ref: string | null;
}

export interface ReportInfo {
  key: string;
  /** Shown in the filter and on the issue page. */
  label: string;
  /** Who produced it — an outside body, or us. */
  by: string;
  external: boolean;
  dated: string;
  folder: string;
}

export const REPORTS: ReportInfo[] = [
  {
    key: "internal-sweep",
    label: "Internal sweep",
    by: "MoSJE design team",
    external: false,
    dated: "2026-09-21",
    folder: "docs/audit-reports/",
  },
  {
    key: "nic-dbim-2026-05",
    label: "NIC DBIM Compliance Audit",
    by: "National Informatics Centre",
    external: true,
    dated: "2026-05-09",
    folder: "docs/audit-reports/2026-05-09-nic-dbim-compliance-audit/",
  },
  {
    key: "ux4g-manual-2026-09",
    label: "UX4G Manual UX Audit",
    by: "UX4G / NeGD",
    external: true,
    dated: "2026-09-18",
    folder: "docs/audit-reports/2026-09-18-ux4g-manual-ux-audit/",
  },
  {
    key: "dbim-observations-2026-09",
    label: "DBIM Non-Compliance Observations",
    by: "DBIM reviewer",
    external: true,
    dated: "2026-09-23",
    folder: "docs/audit-reports/2026-09-23-dbim-non-compliance-observations/",
  },
  {
    key: "ux4g-audit360-2026-09",
    label: "UX4G Audit 360",
    by: "UX4G / NeGD",
    external: true,
    dated: "2026-09-25",
    folder: "docs/audit-reports/2026-09-25-ux4g-audit-360/",
  },
  {
    key: "design-audit-v1",
    label: "Website Design Audit v1",
    by: "MoSJE design team",
    external: false,
    dated: "2026-09-25",
    folder: "docs/audit-reports/2026-09-25-dosje-website-design-audit/",
  },
];

const BY_KEY = new Map(REPORTS.map((r) => [r.key, r]));

export function reportInfo(key: string): ReportInfo | undefined {
  return BY_KEY.get(key);
}

/** Label for a source, with the report's own item id where it has one. */
export function sourceLabel(s: SourceRef): string {
  const info = BY_KEY.get(s.report);
  const name = info?.label ?? s.report;
  return s.ref ? `${name} · ${s.ref}` : name;
}
