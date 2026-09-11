"use client";

import { useMemo, useState } from "react";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { DATA_VERSIONS, REPORT_STATES, type MisReport } from "@/lib/smile-admin/mis-reports";
import { ReportScreen, type ReportColumn } from "@mosje/design-system";

/*
 * The date the FIGURES were drawn, not the date the page was opened.
 *
 * `new Date()` during render is also a hydration hazard — the server stamps one
 * time and the browser another — but the substantive reason is that these
 * figures are a fixed extract. Stamping a report "drawn today" every time it is
 * opened would let two copies of the same statement, printed a month apart,
 * claim to be different draws of the register.
 */
const DRAWN_ON = "31 August 2026";

type Row = Record<string, string | number>;

const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

/**
 * One MIS report screen, rendered eight times from `MIS_REPORTS`.
 *
 * `ReportScreen` and not `WorklistScreen`, by the decision table in
 * docs/design-system/screen-templates.md §2: nobody acts on these rows. They are
 * a tabular statement, exported to CSV or PDF and filed — which is also why the
 * template prints the criteria in force beside the figures. A report of "2,137
 * beneficiaries" filed without the filters that produced it is a number nobody
 * can reproduce.
 *
 * The live portal draws all eight as one page with a different column set, and
 * that is how they are built here: the counters, the filters, the export pair
 * and the register are written once.
 */
export function MisReportPage({ report }: { report: MisReport }) {
  const [version, setVersion] = useState(DATA_VERSIONS[0]!);
  const [state, setState] = useState(REPORT_STATES[0]!);
  const [district, setDistrict] = useState("All Districts");
  const [year, setYear] = useState("All years");

  const districts = useMemo(() => {
    const inState = report.rows.filter((r) => state === REPORT_STATES[0] || r.state === state);
    return ["All Districts", ...Array.from(new Set(inState.map((r) => String(r.district ?? "")).filter(Boolean)))];
  }, [report.rows, state]);

  const years = useMemo(
    () => ["All years", ...Array.from(new Set(report.rows.map((r) => String(r.year ?? "")).filter(Boolean)))],
    [report.rows],
  );

  const rows = useMemo(
    () =>
      report.rows.filter(
        (r) =>
          (state === REPORT_STATES[0] || r.state === state) &&
          (district === "All Districts" || r.district === district) &&
          (!report.hasYear || year === "All years" || String(r.year) === year),
      ),
    [report, state, district, year],
  );

  const activeFilterCount =
    (state === REPORT_STATES[0] ? 0 : 1) +
    (district === "All Districts" ? 0 : 1) +
    (report.hasYear && year !== "All years" ? 1 : 0);

  function clearFilters() {
    setState(REPORT_STATES[0]!);
    setDistrict("All Districts");
    setYear("All years");
  }

  const columns: ReportColumn<Row>[] = [
    {
      key: "sno",
      header: "#",
      render: (r) => rows.indexOf(r) + 1,
    },
    ...report.columns.map<ReportColumn<Row>>((c) => ({
      key: c.key,
      header: c.header,
      numeric: c.numeric,
      render: (r: Row) => {
        const v = r[c.key];
        return v === "" || v === null || v === undefined ? "—" : String(v);
      },
    })),
  ];

  return (
    <ReportScreen
      breadcrumb={[
        { label: "Dashboard", href: "/portals/smile-admin/dashboard" },
        { label: "MIS Reports" },
        { label: report.title },
      ]}
      eyebrow="Reports & Analytics"
      title={report.title}
      meta={report.subtitle}
      issuer="Ministry of Social Justice & Empowerment, Government of India"
      generatedAt={DRAWN_ON}
      // Printed with the figures, because the on-screen selects do not survive
      // the printer and a statement has to say what produced it.
      criteria={[
        { label: "Data version", value: version },
        { label: "State / UT", value: state },
        { label: "District", value: district },
        ...(report.hasYear ? [{ label: "Year", value: year }] : []),
        { label: "Records", value: rows.length.toLocaleString("en-IN") },
      ]}
      exportActions={
        <ExportMenu
          filename={`smile-${report.slug}-report`}
          title={report.title}
          subtitle={report.subtitle}
          columns={report.columns.map((c) => ({ header: c.header, accessor: c.key }))}
          rows={rows}
        />
      }
      filters={
        <>
          <label className="flex items-center gap-xs text-label-2 text-ink-muted">
            Data
            <select aria-label="Data version" value={version} onChange={(e) => setVersion(e.target.value)} className={SELECT}>
              {DATA_VERSIONS.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <select
            aria-label="State or Union Territory"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setDistrict("All Districts");
            }}
            className={SELECT}
          >
            {REPORT_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select aria-label="District" value={district} onChange={(e) => setDistrict(e.target.value)} className={SELECT}>
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          {report.hasYear ? (
            <select aria-label="Year" value={year} onChange={(e) => setYear(e.target.value)} className={SELECT}>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          ) : null}
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      columns={columns}
      rows={rows}
      count={rows.length}
      filtered={activeFilterCount > 0}
      getRowId={(r) => String(r._id)}
      copy={{
        // The register loads with the page, so `idle` never renders — but the
        // type asks for it rather than letting a screen ship with a state that
        // has no words.
        idleTitle: "Choose a State to Draw This Report",
        loadingLabel: `Loading the ${report.title.toLowerCase()}`,
        errorTitle: "This Report Could Not Be Drawn",
        errorDescription: "The figures did not load. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "No Records Reported",
        emptyDescription: "Nothing has been reported under this heading yet.",
        filteredTitle: "No Records Match These Filters",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
