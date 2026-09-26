"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button, Icon, Pagination, Search, Select } from "@mosje/design-system";
import { EmailLinks, PhoneNumbers, officialEmails } from "./people-format";

/** One officer, reduced to what the directory prints. */
export interface DirectoryRow {
  slug: string;
  name: string;
  designation?: string;
  section: string;
  organisation?: string;
  organisationName?: string;
  intercom?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface DirectoryBrowserProps {
  title: string;
  rows: DirectoryRow[];
  emptyMessage?: string;
  showOrganisation: boolean;
  initialOrganisation?: string;
}

const PAGE_SIZE = 25;
const ALL = "All";

/**
 * The search, filters, results and pager of a telephone directory.
 *
 * Filter state lives in the URL (`?q=`, `?org=`, `?section=`, `?page=`) so a
 * narrowed directory can be shared and survives the back button. It is read once
 * after hydration rather than through `useSearchParams`, which would need a
 * Suspense boundary and send a static page out with no rows in its HTML.
 */
export function DirectoryBrowser({ title, rows, emptyMessage, showOrganisation, initialOrganisation }: DirectoryBrowserProps) {
  const [query, setQuery] = useState("");
  const [organisation, setOrganisation] = useState(initialOrganisation ?? ALL);
  const [section, setSection] = useState(ALL);
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Read the address once, after hydration.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const q = p.get("q");
    const org = p.get("org");
    const sec = p.get("section");
    const pg = Number(p.get("page"));
    /* eslint-disable react-hooks/set-state-in-effect -- one-off read of the URL after hydration */
    if (q) setQuery(q);
    if (org && showOrganisation && rows.some((r) => r.organisation === org)) setOrganisation(org);
    if (sec) setSection(sec);
    if (Number.isInteger(pg) && pg > 1) setPage(pg);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [rows, showOrganisation]);

  // Write it back whenever the reader changes something.
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams(window.location.search);
    const set = (k: string, v: string | undefined) => (v ? p.set(k, v) : p.delete(k));
    set("q", query.trim() || undefined);
    // `?org=` on the estate-wide directory is the organisation's page slug; once the
    // reader chooses, the register's own abbreviation is written instead.
    if (showOrganisation) set("org", organisation === ALL ? undefined : organisation);
    set("section", section === ALL ? undefined : section);
    set("page", page > 1 ? String(page) : undefined);
    const qs = p.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [ready, query, organisation, section, page, showOrganisation]);

  const organisations = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of rows) if (r.organisation) seen.set(r.organisation, r.organisationName ?? r.organisation);
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1], "en-IN"));
  }, [rows]);

  const inOrganisation = useMemo(
    () => (organisation === ALL ? rows : rows.filter((r) => r.organisation === organisation)),
    [rows, organisation],
  );

  /* The section list follows the organisation filter, so it never offers a heading that resolves to nothing. */
  const sections = useMemo(() => {
    const seen: string[] = [];
    for (const r of inOrganisation) if (!seen.includes(r.section)) seen.push(r.section);
    return seen;
  }, [inOrganisation]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inOrganisation.filter((r) => {
      if (section !== ALL && r.section !== section) return false;
      if (!q) return true;
      // The post is in the designation ("US-(Senior Citizen)") or only in the section
      // heading ("Under Secretary"), so both are searched.
      return (
        r.name.toLowerCase().includes(q) ||
        (r.designation ?? "").toLowerCase().includes(q) ||
        r.section.toLowerCase().includes(q)
      );
    });
  }, [inOrganisation, query, section]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  /* Group by organisation on the estate-wide directory before a body is chosen, else by section. */
  const byOrganisation = showOrganisation && organisation === ALL && organisations.length > 1;
  const groupOf = (r: DirectoryRow) => (byOrganisation ? (r.organisationName ?? r.organisation ?? "") : r.section);
  const groups: { label: string; rows: DirectoryRow[] }[] = [];
  for (const r of pageRows) {
    const label = groupOf(r);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.rows.push(r);
    else groups.push({ label, rows: [r] });
  }
  const showGroups = byOrganisation || sections.length > 1;

  const hasIntercom = inOrganisation.some((r) => r.intercom);
  const hasEmail = inOrganisation.some((r) => officialEmails(r.email).length > 0);
  const hasAddress = inOrganisation.some((r) => r.address);
  const hasPhone = inOrganisation.some((r) => r.phone);
  const columnCount = 1 + Number(hasIntercom) + Number(hasPhone) + Number(hasEmail) + Number(hasAddress);

  const filterActive = query.trim() !== "" || section !== ALL || (showOrganisation && organisation !== ALL);
  const reset = () => {
    setQuery("");
    setSection(ALL);
    setOrganisation(ALL);
    setPage(1);
  };

  const goTo = (n: number) => {
    setPage(n);
    resultsRef.current?.scrollIntoView({ block: "start" });
    resultsRef.current?.focus({ preventScroll: true });
  };

  if (rows.length === 0) {
    return (
      <div className="wn-people-empty">
        <span className="wn-people-empty__icon" aria-hidden="true">
          <Icon name="badge" size={32} />
        </span>
        <h2 className="wn-people-empty__title">No Directory Published</h2>
        <p className="wn-people-empty__text">{emptyMessage ?? "This body does not publish a telephone directory."}</p>
      </div>
    );
  }

  /* What the reader narrowed by, named in the filtered-to-nothing message. */
  const activeFilters = [
    query.trim() && `“${query.trim()}”`,
    showOrganisation && organisation !== ALL && organisations.find(([k]) => k === organisation)?.[1],
    section !== ALL && section,
  ].filter(Boolean) as string[];

  return (
    <div className="wn-dir">
      <form className="wn-dir__filters" role="search" aria-label={`Search ${title}`} onSubmit={(e) => e.preventDefault()}>
        <div className="wn-dir__field wn-dir__field--search">
          <label htmlFor="dir-q" className="wn-dir__label">
            Name or Designation
          </label>
          <Search
            id="dir-q"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            onClear={() => {
              setQuery("");
              setPage(1);
            }}
            size="md"
            placeholder="For example, Director or Section Officer"
          />
        </div>

        {showOrganisation && organisations.length > 1 && (
          <div className="wn-dir__field">
            <label htmlFor="dir-org" className="wn-dir__label">
              Organisation
            </label>
            <Select
              id="dir-org"
              value={organisation}
              onChange={(e) => {
                setOrganisation(e.target.value);
                setSection(ALL);
                setPage(1);
              }}
              options={[{ label: "All Organisations", value: ALL }, ...organisations.map(([value, label]) => ({ label, value }))]}
            />
          </div>
        )}

        {sections.length > 1 && (
          <div className="wn-dir__field">
            <label htmlFor="dir-section" className="wn-dir__label">
              Section
            </label>
            <Select
              id="dir-section"
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
                setPage(1);
              }}
              options={[{ label: "All Sections", value: ALL }, ...sections.map((s) => ({ label: s, value: s }))]}
            />
          </div>
        )}
      </form>

      <div className="wn-dir__bar">
        <p className="wn-dir__count" role="status">
          {filtered.length === 0
            ? "No officers found"
            : `${filtered.length.toLocaleString("en-IN")} ${filtered.length === 1 ? "officer" : "officers"}${
                filterActive ? ` of ${rows.length.toLocaleString("en-IN")}` : ""
              }${totalPages > 1 ? `, page ${current} of ${totalPages}` : ""}`}
        </p>
        {filterActive && (
          <Button variant="neutral" appearance="text" size="sm" onClick={reset}>
            Clear Filters
          </Button>
        )}
      </div>

      <div ref={resultsRef} tabIndex={-1} className="wn-dir__results" aria-label={`${title}, results`}>
        {filtered.length === 0 ? (
          <div className="wn-people-empty">
            <span className="wn-people-empty__icon" aria-hidden="true">
              <Icon name="search_off" size={32} />
            </span>
            <h2 className="wn-people-empty__title">No Officers Match</h2>
            <p className="wn-people-empty__text">
              No officer in this directory matches {activeFilters.join(" in ")}. Clear the filters to see all{" "}
              {rows.length.toLocaleString("en-IN")} officers.
            </p>
            <Button variant="primary" appearance="outlined" size="md" onClick={reset}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Wide screens: one table, grouped by section. */}
            <div className="wn-dir__table-wrap" role="region" aria-label={`${title} table`} tabIndex={0}>
              <table className="wn-dir__table">
                <caption className="sr-only">
                  {title}
                  {totalPages > 1 ? `, page ${current} of ${totalPages}` : ""}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Name and Designation</th>
                    {hasIntercom && <th scope="col" className="wn-dir__num">Intercom</th>}
                    {hasPhone && <th scope="col">Telephone</th>}
                    {hasEmail && <th scope="col">Email</th>}
                    {hasAddress && <th scope="col">Address</th>}
                  </tr>
                </thead>
                {groups.map((g, gi) => (
                  <tbody key={`${g.label}-${gi}`}>
                    {showGroups && (
                      <tr className="wn-dir__group">
                        <th scope="colgroup" colSpan={columnCount}>
                          {g.label}
                        </th>
                      </tr>
                    )}
                    {g.rows.map((r) => (
                      <tr key={`${r.slug}-${r.organisation}`}>
                        <td>
                          <Link href={`/website/official/${r.slug}`} className="wn-dir__name">
                            {r.name}
                          </Link>
                          {r.designation && <span className="wn-dir__role">{r.designation}</span>}
                        </td>
                        {hasIntercom && <td className="wn-dir__num">{r.intercom ?? "–"}</td>}
                        {hasPhone && <td>{r.phone ? <PhoneNumbers value={r.phone} /> : "–"}</td>}
                        {hasEmail && <td>{officialEmails(r.email).length > 0 ? <EmailLinks value={r.email} /> : "–"}</td>}
                        {hasAddress && <td className="wn-dir__address">{r.address ?? "–"}</td>}
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>

            {/* Phones: one entry per officer, label above value (LAY-06). */}
            <div className="wn-dir__cards">
              {groups.map((g, gi) => (
                <Fragment key={`${g.label}-${gi}`}>
                  {showGroups && <h2 className="wn-dir__cards-group">{g.label}</h2>}
                  <ul className="wn-dir__list">
                    {g.rows.map((r) => (
                      <li key={`${r.slug}-${r.organisation}`} className="wn-dir__entry">
                        <Link href={`/website/official/${r.slug}`} className="wn-dir__name">
                          {r.name}
                        </Link>
                        {r.designation && <span className="wn-dir__role">{r.designation}</span>}
                        <dl className="wn-people-facts">
                          {r.intercom && (
                            <div>
                              <dt>Intercom</dt>
                              <dd>{r.intercom}</dd>
                            </div>
                          )}
                          {r.phone && (
                            <div>
                              <dt>Telephone</dt>
                              <dd>
                                <PhoneNumbers value={r.phone} />
                              </dd>
                            </div>
                          )}
                          {officialEmails(r.email).length > 0 && (
                            <div>
                              <dt>Email</dt>
                              <dd>
                                <EmailLinks value={r.email} />
                              </dd>
                            </div>
                          )}
                          {r.address && (
                            <div>
                              <dt>Address</dt>
                              <dd>{r.address}</dd>
                            </div>
                          )}
                        </dl>
                      </li>
                    ))}
                  </ul>
                </Fragment>
              ))}
            </div>
          </>
        )}
      </div>

      {totalPages > 1 && filtered.length > 0 && (
        <div className="wn-dir__pager">
          <Pagination page={current} totalPages={totalPages} onPageChange={goTo} label={`${title} pages`} />
        </div>
      )}
    </div>
  );
}
