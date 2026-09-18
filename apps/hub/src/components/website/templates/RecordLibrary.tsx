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
import type { DocumentRecord } from "@/types/website/content";
import "./record-library.css";

/**
 * The department's document register, in our design language.
 *
 * ── WHY THIS IS NOT `DocumentCatalog` ────────────────────────────────────────
 * `DocumentCatalog` renders a card per row with a category chip and two buttons.
 * That reads well for a shelf of twenty policy papers; it does not read at all
 * for the register this page is — 972 Advices, 2,667 entries of the Central List
 * of OBCs — where the reader is scanning for an organisation, a year and a file
 * size, which is exactly the table the department itself publishes. So this is
 * the design system's `DataTable`, with the department's own column set.
 *
 * ── THE STATES, AND WHICH OF THEM CAN EXIST HERE ─────────────────────────────
 * `data-state-completeness.md` names seven. Four of them are decided by where
 * the data comes from, and it is worth saying which, because a reader of this
 * file will otherwise look for the missing three:
 *
 *   populated / empty / filtered-to-nothing / too-much — all rendered below.
 *     Empty and filtered-to-nothing are worded DIFFERENTLY and are the reason
 *     `hasRecords` is separate from `filtered.length`: "the department publishes
 *     nothing under this heading" and "your own filter excluded all 55 of them"
 *     are different sentences with different remedies.
 *   too-much — `DataTable` pages at ten rows. The region is never scrolled
 *     inside a card.
 *
 *   loading / error — CANNOT occur. Every row is imported JSON, resolved on the
 *     server at render time; there is no request to be waiting on and none to
 *     fail. A skeleton here would be a picture of a wait that never happens.
 *     If this page ever moves behind a fetch, both states have to be designed
 *     before that lands.
 *
 * ── ONE REQUEST, ONE ANSWER ──────────────────────────────────────────────────
 * The count above the table, the table itself and the empty state all read
 * `filtered`. There is no second derivation anywhere in this file.
 */

export interface RecordLibraryProps {
  title: string;
  description?: string;
  breadcrumb: Crumb[];
  lastUpdated?: string;
  /** The register, already narrowed to this page's heading. */
  records: DocumentRecord[];
  /** Where a record's own page lives, e.g. "/website/documents". */
  detailBase: string;
  /** What one row is called, for the counts and the empty state. @default "documents" */
  noun?: string;
  /** Plural-safe singular. @default noun without its trailing "s" */
  nounSingular?: string;
  /**
   * Allow the Year column. @default true
   *
   * Each of these is a CEILING, not an instruction: a column no record on the
   * page publishes is dropped whatever the prop says. Newsletter records carry
   * no year and no publish window, so the department's seven-column table drew
   * three columns of dashes across all 55 rows — width spent saying nothing.
   */
  showYear?: boolean;
  /** Allow the Start/End publish columns. @default true */
  showPublishWindow?: boolean;
  /** Allow the Organisation column and its filter. @default true */
  showOrganisation?: boolean;
  /** Show a Category column and its filter — for a page holding several types. */
  showCategory?: boolean;
  /**
   * Sentence shown when the DEPARTMENT publishes nothing under this heading —
   * not when the reader's filter excluded everything.
   */
  emptyMessage?: string;
}

/** A destination that leaves this site, and therefore opens in a new tab. */
const isHttp = (href: string | undefined) => /^https?:\/\//.test(href ?? "");

/** The site prints dd/mm/yyyy; the ingest normalised to yyyy-mm-dd where it parsed. */
function humanDate(value: string | undefined): string {
  if (!value) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
  });
}

/** Distinct, sorted values of one field, for a filter that is derived not listed. */
function optionsFor(records: DocumentRecord[], pick: (r: DocumentRecord) => string | undefined) {
  const seen = new Set<string>();
  for (const r of records) {
    const v = pick(r);
    if (v) seen.add(v);
  }
  return [...seen].sort((a, b) => a.localeCompare(b, "en-IN", { numeric: true }));
}

type Row = DocumentRecord & Record<string, unknown>;

export function RecordLibrary({
  title,
  description,
  breadcrumb,
  lastUpdated,
  records,
  detailBase,
  noun = "documents",
  nounSingular,
  showYear = true,
  showPublishWindow = true,
  showOrganisation = true,
  showCategory = false,
  emptyMessage,
}: RecordLibraryProps) {
  const [query, setQuery] = useState("");
  const [organisation, setOrganisation] = useState("All");
  const [year, setYear] = useState("All");
  const [category, setCategory] = useState("All");

  const singular = nounSingular ?? noun.replace(/s$/, "");

  const organisations = useMemo(() => optionsFor(records, (r) => r.organisation), [records]);
  const years = useMemo(
    () => optionsFor(records, (r) => r.year).reverse(),
    [records],
  );
  const categories = useMemo(() => optionsFor(records, (r) => r.category), [records]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((r) => {
      if (organisation !== "All" && r.organisation !== organisation) return false;
      if (year !== "All" && r.year !== year) return false;
      if (category !== "All" && r.category !== category) return false;
      if (q && !r.title.toLowerCase().includes(q)) return false;
      return true;
    }) as Row[];
  }, [records, query, organisation, year, category]);

  const hasRecords = records.length > 0;

  /*
   * A COLUMN EXISTS ONLY WHERE THE REGISTER FILLS IT.
   *
   * Measured against the whole page's records, never against the filtered set:
   * a column that vanished when a reader narrowed the list and came back when
   * they widened it would move every other column sideways as they typed.
   */
  const anyYear = useMemo(() => records.some((r) => r.year), [records]);
  const anySize = useMemo(() => records.some((r) => r.fileSize), [records]);
  const anyWindow = useMemo(
    () => records.some((r) => r.publishStart ?? r.publishEnd),
    [records],
  );
  const anyOrganisation = useMemo(() => records.some((r) => r.organisation), [records]);
  const anyDate = useMemo(() => records.some((r) => r.date), [records]);

  const yearColumn = showYear && anyYear;
  const windowColumns = showPublishWindow && anyWindow;
  const organisationColumn = showOrganisation && anyOrganisation;
  const filterActive =
    query.trim() !== "" || organisation !== "All" || year !== "All" || category !== "All";

  const reset = () => {
    setQuery("");
    setOrganisation("All");
    setYear("All");
    setCategory("All");
  };

  const columns = useMemo<DataTableColumn<Row>[]>(() => {
    const cols: DataTableColumn<Row>[] = [
      {
        key: "title",
        header: "Title",
        sortable: true,
        sortValue: (r) => r.title,
        className: "ds-table__cell--title",
        render: (r) => (
          <Link href={`${detailBase}/${r.slug}`} className="sa-record-link">
            {r.title}
          </Link>
        ),
      },
    ];
    if (organisationColumn) {
      cols.push({
        key: "organisation",
        header: "Organisation",
        sortable: true,
        sortValue: (r) => r.organisation ?? "",
        render: (r) => r.organisation ?? "—",
      });
    }
    if (showCategory) {
      cols.push({
        key: "category",
        header: "Type",
        sortable: true,
        sortValue: (r) => r.category ?? "",
        render: (r) => r.category ?? "—",
      });
    }
    if (yearColumn) {
      cols.push({
        key: "year",
        header: "Year",
        sortable: true,
        sortValue: (r) => r.year ?? "",
        render: (r) => r.year ?? "—",
      });
    }
    if (anySize) {
      cols.push({
        key: "fileSize",
        header: "Size",
        render: (r) => r.fileSize ?? "—",
        noExport: true,
      });
    }
    if (windowColumns) {
      cols.push(
        {
          key: "publishStart",
          header: "Start Publish Date",
          sortable: true,
          sortValue: (r) => r.publishStart ?? "",
          render: (r) => humanDate(r.publishStart),
        },
        {
          key: "publishEnd",
          header: "End Publish Date",
          render: (r) => humanDate(r.publishEnd),
        },
      );
    } else if (anyDate) {
      /* No publish window anywhere: the record's own date is what the reader has. */
      cols.push({
        key: "date",
        header: "Published",
        sortable: true,
        sortValue: (r) => r.date ?? "",
        render: (r) => humanDate(r.date),
      });
    }
    cols.push({
      key: "action",
      header: "Action",
      noExport: true,
      render: (r) => {
        const file = r.fileUrl ?? r.externalUrl;
        /*
         * A RECORD WITH NO FILE IS NOT GIVEN A BUTTON THAT GOES NOWHERE.
         * 77 documents in the register carry no upload at all. The row still
         * exists — it is what the department published — and its own page
         * carries the metadata, so the reader is sent there instead of to a
         * "Download" that would 404.
         */
        if (!file) {
          return (
            <Link href={`${detailBase}/${r.slug}`} className="sa-record-link">
              Details
            </Link>
          );
        }
        return (
          <span className="sa-record-actions">
            <Button
              href={file}
              external={isHttp(file)}
              variant="primary"
              appearance="outlined"
              size="sm"
            >
              View
            </Button>
            <Button
              href={file}
              target={isHttp(file) ? "_blank" : undefined}
              download
              variant="primary"
              appearance="filled"
              size="sm"
            >
              Download
            </Button>
          </span>
        );
      },
    });
    return cols;
  }, [detailBase, organisationColumn, showCategory, yearColumn, windowColumns, anySize, anyDate]);

  return (
    <PageLayout
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      lastUpdated={lastUpdated}
    >
      <section className="sa-record-library">
        <div className="sa-container">
          {hasRecords && (
            <>
              <div className="sa-record-library__filters">
                <div className="sa-record-library__search">
                  <Search
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClear={() => setQuery("")}
                    size="sm"
                    placeholder={`Search ${noun} by title`}
                    aria-label={`Search ${noun} by title`}
                  />
                </div>

                {organisationColumn && organisations.length > 1 && (
                  <label className="sa-record-library__filter">
                    <span className="sa-record-library__filter-label">Organisation</span>
                    <Select
                      appearance="filter"
                      value={organisation}
                      onChange={(e) => setOrganisation(e.target.value)}
                      options={[
                        { label: "All organisations", value: "All" },
                        ...organisations.map((o) => ({ label: o, value: o })),
                      ]}
                    />
                  </label>
                )}

                {showCategory && categories.length > 1 && (
                  <label className="sa-record-library__filter">
                    <span className="sa-record-library__filter-label">Type</span>
                    <Select
                      appearance="filter"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      options={[
                        { label: "All types", value: "All" },
                        ...categories.map((c) => ({ label: c, value: c })),
                      ]}
                    />
                  </label>
                )}

                {yearColumn && years.length > 1 && (
                  <label className="sa-record-library__filter">
                    <span className="sa-record-library__filter-label">Year</span>
                    <Select
                      appearance="filter"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      options={[
                        { label: "All years", value: "All" },
                        ...years.map((y) => ({ label: y, value: y })),
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
                {filtered.length === 1 ? singular : noun}
                {filterActive && ` of ${records.length.toLocaleString("en-IN")}`}
              </p>
            </>
          )}

          {!hasRecords ? (
            <EmptyState
              icon={<Icon name="folder_off" size={40} />}
              title={`No ${noun} published`}
              description={
                emptyMessage ??
                `The Department has not published any ${noun} under this heading.`
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Icon name="search_off" size={40} />}
              title={`No ${noun} match these filters`}
              description={`All ${records.length.toLocaleString("en-IN")} ${noun} on this page were excluded by the search and filters above. Clear them to see the full register.`}
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
              pageSizes={[10]}
              /* Sort on the date column the page actually shows. Naming a
                 column that was dropped leaves the table unsorted AND announces
                 an order it is not in. */
              defaultSort={
                windowColumns
                  ? { key: "publishStart", direction: "desc" }
                  : anyDate
                    ? { key: "date", direction: "desc" }
                    : null
              }
              scrollLabel={`${title} table`}
            />
          )}
        </div>
      </section>
    </PageLayout>
  );
}
