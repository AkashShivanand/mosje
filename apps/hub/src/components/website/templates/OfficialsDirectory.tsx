"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Button,
  DataTable,
  EmptyState,
  Icon,
  Search,
  Select,
  type DataTableColumn,
} from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import type { Crumb } from "@/components/website/layout/page-trail";
import type { OfficialRecord } from "@/types/website/content";
import "./record-library.css";

/**
 * A body's telephone directory — the department's own seven columns.
 *
 * ── THE LIVE PAGE'S IIA, AND WHERE THIS DIVERGES ─────────────────────────────
 * dosje.gov.in groups a directory under `<h4>` section headings — "UNION CABINET
 * MINISTER", "SECTION OFFICERS", "UNDER SECRETARY" — and prints every row under
 * every heading on one page. For the Ministry that is 162 rows and a page
 * 17,813px tall.
 *
 * The grouping is real information architecture and is kept: the Section filter
 * is the same list of headings, and choosing one narrows the register to it. The
 * 17,813px scroll is not kept — `data-state-completeness.md` says a long result
 * is paged. So "All sections" renders the flat register, paged at twenty-five,
 * with the section as its own column; choosing a section renders that section
 * alone. Nothing is hidden either way, and no view scrolls inside a card.
 *
 * ── STATES ───────────────────────────────────────────────────────────────────
 * Populated, empty (the body publishes no directory), filtered-to-nothing
 * (worded differently, and offering the reset), and too-much (paged). Loading
 * and error cannot occur — the register is imported JSON resolved on the server.
 */

export interface OfficialsDirectoryProps {
  title: string;
  description?: string;
  breadcrumb: Crumb[];
  lastUpdated?: string;
  officials: OfficialRecord[];
  /**
   * Said on screen when the body publishes no directory at all. Give the reason
   * only where it changes what the reader should do next.
   */
  emptyMessage?: string;
  /**
   * Offer an Organisation filter and column. For the estate-wide directory,
   * which holds every body's officers; a single body's directory has one
   * organisation and a filter with one option is a control that does nothing.
   */
  showOrganisation?: boolean;
  /**
   * The organisation the page opens on, as the register abbreviates it. The
   * estate-wide directory is linked from an organisation's own page with
   * `?org=<slug>`, and that link is meaningless if it lands on every body at
   * once.
   */
  initialOrganisation?: string;
}

type Row = OfficialRecord & Record<string, unknown>;

const UNGROUPED = "Other Officers";

export function OfficialsDirectory({
  title,
  description,
  breadcrumb,
  lastUpdated,
  officials,
  emptyMessage,
  showOrganisation = false,
  initialOrganisation,
}: OfficialsDirectoryProps) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("All");
  const [organisation, setOrganisation] = useState(initialOrganisation ?? "All");

  /* Menu order is the department's own protocol order; name is the tie-break. */
  const ordered = useMemo(
    () =>
      [...officials].sort(
        (a, b) =>
          (a.menuOrder ?? 0) - (b.menuOrder ?? 0) ||
          a.title.localeCompare(b.title, "en-IN"),
      ) as Row[],
    [officials],
  );

  const organisations = useMemo(() => {
    const seen = new Set<string>();
    for (const o of ordered) if (o.organisation) seen.add(o.organisation);
    return [...seen].sort((a, b) => a.localeCompare(b, "en-IN"));
  }, [ordered]);

  /*
   * THE SECTION LIST FOLLOWS THE ORGANISATION FILTER, not the whole register.
   * Otherwise the estate-wide directory offers a reader who has narrowed to
   * NCSK a list of the Ministry's own section headings, every one of which
   * resolves to nothing.
   */
  const inOrganisation = useMemo(
    () => (organisation === "All" ? ordered : ordered.filter((o) => o.organisation === organisation)),
    [ordered, organisation],
  );

  const sections = useMemo(() => {
    const seen: string[] = [];
    for (const o of inOrganisation) {
      const g = o.group ?? UNGROUPED;
      if (!seen.includes(g)) seen.push(g);
    }
    return seen;
  }, [inOrganisation]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inOrganisation.filter((o) => {
      if (section !== "All" && (o.group ?? UNGROUPED) !== section) return false;
      if (!q) return true;
      return (
        o.title.toLowerCase().includes(q) ||
        (o.designation ?? "").toLowerCase().includes(q) ||
        (o.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [inOrganisation, query, section]);

  const filterActive =
    query.trim() !== "" || section !== "All" || organisation !== "All";
  const reset = () => {
    setQuery("");
    setSection("All");
    setOrganisation("All");
  };
  const showSectionColumn = section === "All" && sections.length > 1;

  const columns = useMemo<DataTableColumn<Row>[]>(() => {
    const cols: DataTableColumn<Row>[] = [
      {
        key: "sno",
        header: "S.No.",
        render: (r) => String(filtered.indexOf(r) + 1),
        noExport: true,
      },
      {
        key: "title",
        header: "Name",
        sortable: true,
        sortValue: (r) => r.title,
        render: (r) => (
          <Link href={`/website/official/${r.slug}`} className="sa-record-link">
            {r.title}
          </Link>
        ),
      },
      {
        key: "designation",
        header: "Designation",
        sortable: true,
        sortValue: (r) => r.designation ?? "",
        render: (r) => r.designation ?? "—",
      },
    ];
    if (showOrganisation && organisation === "All" && organisations.length > 1) {
      cols.push({
        key: "organisation",
        header: "Organisation",
        sortable: true,
        sortValue: (r) => r.organisation ?? "",
        render: (r) => r.organisation ?? "—",
      });
    }
    if (showSectionColumn) {
      cols.push({
        key: "group",
        header: "Section",
        sortable: true,
        sortValue: (r) => r.group ?? UNGROUPED,
        render: (r) => r.group ?? UNGROUPED,
      });
    }
    cols.push(
      { key: "intercom", header: "Intercom", render: (r) => r.intercom ?? "—" },
      {
        key: "phoneOffice",
        header: "Contact Details",
        render: (r) => r.phoneOffice ?? r.phoneResidence ?? "—",
      },
      /*
       * THE EMAIL IS PRINTED AS THE DEPARTMENT PRINTS IT — several rows carry
       * the obfuscated `[at]` / `[dot]` form and several carry a plain address.
       * Un-obfuscating here would publish what an officer's own department
       * chose to obscure.
       */
      { key: "email", header: "Email", render: (r) => r.email ?? "—" },
      { key: "address", header: "Address", render: (r) => r.address ?? "—" },
    );
    return cols;
  }, [filtered, showSectionColumn, showOrganisation, organisation, organisations.length]);

  return (
    <PageLayout
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      lastUpdated={lastUpdated}
    >
      <section className="sa-record-library">
        <div className="sa-container">
          {officials.length > 0 && (
            <>
              <div className="sa-record-library__filters">
                <div className="sa-record-library__search">
                  <Search
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClear={() => setQuery("")}
                    size="sm"
                    placeholder="Search by name or designation"
                    aria-label="Search the directory by name or designation"
                  />
                </div>

                {showOrganisation && organisations.length > 1 && (
                  <label className="sa-record-library__filter">
                    <span className="sa-record-library__filter-label">Organisation</span>
                    <Select
                      appearance="filter"
                      value={organisation}
                      onChange={(e) => {
                        setOrganisation(e.target.value);
                        setSection("All");
                      }}
                      options={[
                        { label: "All organisations", value: "All" },
                        ...organisations.map((o) => ({ label: o, value: o })),
                      ]}
                    />
                  </label>
                )}

                {sections.length > 1 && (
                  <label className="sa-record-library__filter">
                    <span className="sa-record-library__filter-label">Section</span>
                    <Select
                      appearance="filter"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      options={[
                        { label: "All sections", value: "All" },
                        ...sections.map((s) => ({ label: s, value: s })),
                      ]}
                    />
                  </label>
                )}

                {filterActive && (
                  <Button variant="neutral" appearance="text" size="sm" onClick={reset}>
                    Reset Filters
                  </Button>
                )}
              </div>

              <p className="sa-record-library__count" role="status">
                {filtered.length.toLocaleString("en-IN")}{" "}
                {filtered.length === 1 ? "officer" : "officers"}
                {filterActive && ` of ${officials.length.toLocaleString("en-IN")}`}
              </p>
            </>
          )}

          {officials.length === 0 ? (
            <EmptyState
              icon={<Icon name="badge" size={40} />}
              title="No Directory Published"
              description={emptyMessage ?? "This body does not publish a telephone directory."}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Icon name="search_off" size={40} />}
              title="No Officers Match These Filters"
              description={`All ${officials.length.toLocaleString("en-IN")} officers in this directory were excluded by the filters above. Clear them to see the full directory.`}
              action={
                <Button variant="primary" appearance="outlined" size="sm" onClick={reset}>
                  Reset Filters
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={columns}
              data={filtered}
              total={filtered.length}
              caption={title}
              showPageSizes={false}
              pageSizes={[25]}
              scrollLabel={`${title} table`}
            />
          )}
        </div>
      </section>
    </PageLayout>
  );
}
