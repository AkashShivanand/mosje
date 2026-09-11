"use client";

import { useMemo, useState } from "react";
import { SearchField } from "@/components/smile-admin/data/data-toolbar";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { CONSENT_FORMS, type ConsentForm } from "@/lib/smile-admin/mock-data";
import { Badge, ReportScreen, type ReportColumn } from "@mosje/design-system";

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

const STATES = ["All States / UTs", ...Array.from(new Set(CONSENT_FORMS.map((c) => c.state)))];
const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

/**
 * `ReportScreen`, by the decision table in docs/design-system/screen-templates.md
 * §2: nobody acts on a consent row here — the register is read, exported and
 * filed. It is built to the DESIGN rather than to the live build, and says so
 * at each point the two differ.
 */
export default function ConsentFormsPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState(STATES[0]!);
  const [district, setDistrict] = useState("All Districts");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const districts = useMemo(() => {
    const inState = CONSENT_FORMS.filter((c) => state === STATES[0] || c.state === state);
    return ["All Districts", ...Array.from(new Set(inState.map((c) => c.district)))];
  }, [state]);

  const rows = useMemo(
    () =>
      CONSENT_FORMS.filter((c) => {
        const hay = `${c.state} ${c.district} ${c.authority ?? ""} ${c.agency ?? ""}`.toLowerCase();
        return (
          (!search || hay.includes(search.toLowerCase())) &&
          (state === STATES[0] || c.state === state) &&
          (district === "All Districts" || c.district === district)
        );
      }),
    [search, state, district],
  );

  const activeFilterCount =
    (search ? 1 : 0) + (state === STATES[0] ? 0 : 1) + (district === "All Districts" ? 0 : 1) + (from || to ? 1 : 0);

  function clearFilters() {
    setSearch("");
    setState(STATES[0]!);
    setDistrict("All Districts");
    setFrom("");
    setTo("");
  }

  const columns: ReportColumn<ConsentForm & Record<string, unknown>>[] = [
    { key: "state", header: "State" },
    { key: "district", header: "City/District" },
    { key: "authority", header: "Implementing Authority/ Nodal Officer", render: (r) => r.authority ?? "—" },
    {
      key: "agency",
      header: "Implementing Agency/ NGO",
      // Plain body text, not a link. The live build draws this value in the
      // estate's accent orange, which reads as a warning beside the Awaited
      // chips in the next column (SMB-SUPER-ADMIN-CONSENT-004).
      render: (r) => r.agency ?? "—",
    },
    {
      key: "document",
      header: "Document",
      render: (r) => (
        <Badge status={r.document === "Uploaded" ? "success" : "warning"} dot>
          {r.document}
        </Badge>
      ),
    },
    { key: "submittedOn", header: "Submitted On" },
  ];

  return (
    <ReportScreen
      // "Other", matching the section the sidebar files this screen under. The
      // live build says "Access Control", which contradicts its own navigation
      // (SMB-SUPER-ADMIN-CONSENT-001).
      breadcrumb={[{ label: "Other" }, { label: "Consent Forms" }]}
      title="Consent Forms"
      meta="Implementing Authority consent submissions received from the DoSJE WordPress site."
      issuer="Ministry of Social Justice & Empowerment, Government of India"
      generatedAt={DRAWN_ON}
      criteria={[
        { label: "State / UT", value: state },
        { label: "District", value: district },
        { label: "Submitted between", value: from || to ? `${from || "any"} – ${to || "any"}` : "any date" },
        { label: "Submissions", value: String(rows.length) },
        { label: "Documents uploaded", value: String(rows.filter((r) => r.document === "Uploaded").length) },
      ]}
      exportActions={
        <ExportMenu
          filename="consent-forms"
          title="Consent Forms"
          subtitle="Implementing Authority consent submissions"
          columns={[
            { header: "State", accessor: "state" },
            { header: "City/District", accessor: "district" },
            { header: "Implementing Authority / Nodal Officer", accessor: (r: ConsentForm) => r.authority ?? "—" },
            { header: "Implementing Agency / NGO", accessor: (r: ConsentForm) => r.agency ?? "—" },
            { header: "Document", accessor: "document" },
            { header: "Submitted On", accessor: "submittedOn" },
          ]}
          rows={rows}
        />
      }
      filters={
        <>
          <SearchField
            placeholder="Search state, district, authority, agency"
            label="Search consent submissions"
            value={search}
            onChange={setSearch}
          />
          <select
            aria-label="State or Union Territory"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setDistrict("All Districts");
            }}
            className={SELECT}
          >
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select aria-label="District" value={district} onChange={(e) => setDistrict(e.target.value)} className={SELECT}>
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          {/* The date range the design specifies. A consent register that pages
              to over a thousand rows cannot answer "what arrived this month"
              without it (SMB-SUPER-ADMIN-CONSENT-002). */}
          <label htmlFor="consent-from" className="flex items-center gap-xs text-label-2 text-ink-muted">
            Submitted between
            <input id="consent-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={SELECT} />
          </label>
          <input
            type="date"
            aria-label="Submitted on or before"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={SELECT}
          />
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={clearFilters}
      columns={columns}
      rows={rows as Array<ConsentForm & Record<string, unknown>>}
      count={rows.length}
      filtered={activeFilterCount > 0}
      getRowId={(r) => r.id}
      copy={{
        idleTitle: "Choose a State to See Its Consent Submissions",
        loadingLabel: "Loading consent submissions",
        errorTitle: "Consent Submissions Could Not Be Loaded",
        errorDescription: "The register did not load. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "No Consent Submission Received",
        emptyDescription: "No Implementing Authority has submitted a consent form yet.",
        filteredTitle: "No Consent Submission Matches These Filters",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
