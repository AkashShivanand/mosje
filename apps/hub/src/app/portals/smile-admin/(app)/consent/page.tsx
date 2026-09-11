"use client";

import { useMemo, useState } from "react";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { CONSENT_FORMS, type ConsentForm } from "@/lib/smile-admin/mock-data";
import { Badge, DataTable, type DataTableColumn } from "@mosje/design-system";

const STATES = ["All States / UTs", ...Array.from(new Set(CONSENT_FORMS.map((c) => c.state)))];

export default function ConsentFormsPage() {
  const [search, setSearch] = useState("");
  const [state, setState] = useState(STATES[0]);
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

  const columns: DataTableColumn<ConsentForm & Record<string, unknown>>[] = [
    { key: "state", header: "State", sortable: true },
    { key: "district", header: "City/District", sortable: true },
    {
      key: "authority",
      header: "Implementing Authority/ Nodal Officer",
      render: (r) => r.authority ?? "—",
    },
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
      sortable: true,
      render: (r) => (
        <Badge status={r.document === "Uploaded" ? "success" : "warning"} dot>
          {r.document}
        </Badge>
      ),
      exportValue: (r) => r.document,
    },
    { key: "submittedOn", header: "Submitted On", sortable: true },
  ];

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        // "Other", matching the section the sidebar files this screen under. The
        // live build says "Access Control", which contradicts its own navigation
        // (SMB-SUPER-ADMIN-CONSENT-001).
        breadcrumbs={[{ label: "Other" }, { label: "Consent Forms" }]}
        title="Consent Forms"
        subtitle="Implementing Authority consent submissions received from the DoSJE WordPress site."
        actions={
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
      />

      <DataToolbar>
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
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          aria-label="District"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs"
        >
          {districts.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {/* The date range the design specifies. A consent register that pages to
            over a thousand rows cannot answer "what arrived this month" without
            it (SMB-SUPER-ADMIN-CONSENT-002). */}
        <div className="flex items-center gap-xs">
          <label htmlFor="consent-from" className="text-label-2 text-ink-muted">
            Submitted between
          </label>
          <input
            id="consent-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-10 rounded-md border border-stroke-300 bg-white px-sm text-body-2 text-ink shadow-xs"
          />
          <span aria-hidden className="text-ink-hint">
            –
          </span>
          <input
            id="consent-to"
            type="date"
            aria-label="Submitted on or before"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-10 rounded-md border border-stroke-300 bg-white px-sm text-body-2 text-ink shadow-xs"
          />
        </div>
      </DataToolbar>

      {/* Mobile card list */}
      <ul className="space-y-sm md:hidden">
        {rows.map((c) => (
          <li key={c.id} className="space-y-xs rounded-lg border border-stroke-200 bg-white p-md shadow-xs">
            <div className="flex items-start justify-between gap-sm">
              <div className="min-w-0">
                <div className="truncate text-body-1 font-semibold text-ink">{c.district}</div>
                <div className="truncate text-label-2 text-ink-muted">{c.state}</div>
              </div>
              <Badge status={c.document === "Uploaded" ? "success" : "warning"} dot>
                {c.document}
              </Badge>
            </div>
            <div className="text-label-2 text-ink-muted">{c.authority ?? "No authority recorded"}</div>
            <div className="text-label-2 text-ink-hint">Submitted {c.submittedOn}</div>
          </li>
        ))}
      </ul>

      <div className="hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs md:block">
        <DataTable
          columns={columns}
          data={rows as Array<ConsentForm & Record<string, unknown>>}
          total={rows.length}
          caption="Consent submissions by state, district and implementing authority"
          emptyLabel="No consent submission matches these filters."
        />
      </div>
    </div>
  );
}
