"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { StatPill } from "@/components/smile-admin/data/stat-pill";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { BottomSheet } from "@/components/smile-admin/bottom-sheet";
import { TH, THead, TR, TD, Table } from "@/components/smile-admin/table";
import { BENEFICIARIES, type Beneficiary } from "@/lib/smile-admin/mock-data";
import { STATES } from "@/lib/smile-admin/states";
import { useApp } from "@/store/smile-admin/app-context";
import { Badge, Button, Icon, Label, buttonClasses } from "@mosje/design-system";

const STATUSES = [
  "All statuses",
  "IDENTIFIED",
  "UNDER_MOBILIZATION",
  "MOBILIZED",
  "SHELTER_ASSIGNED",
  "REHABILITATED",
];
const GENDERS = ["All genders", "Male", "Female", "Transgender"];
const AGES = ["All ages", "0–17", "18–25", "26–40", "41–60", "60+"];

export default function PersonsPage() {
  const { account } = useApp();
  const [search, setSearch] = useState("");
  const [state, setState] = useState<string>("All States / UTs");
  const [status, setStatus] = useState<string>("All statuses");
  const [gender, setGender] = useState<string>("All genders");
  const [age, setAge] = useState<string>("All ages");
  const [filterSheet, setFilterSheet] = useState(false);

  const activeFilterCount = [
    state !== "All States / UTs",
    status !== "All statuses",
    gender !== "All genders",
    age !== "All ages",
  ].filter(Boolean).length;

  const anyFilterActive = activeFilterCount > 0 || search.length > 0;

  function clearAllFilters() {
    setSearch("");
    setState("All States / UTs");
    setStatus("All statuses");
    setGender("All genders");
    setAge("All ages");
  }

  const filtered = useMemo(() => {
    return BENEFICIARIES.filter((b) => {
      if (account?.stateId && b.stateId !== account.stateId) return false;
      if (account?.districtId && b.districtId !== account.districtId) return false;
      if (state !== "All States / UTs" && b.state !== state) return false;
      if (status !== "All statuses" && b.status !== status) return false;
      if (gender !== "All genders" && b.gender !== gender) return false;
      if (age !== "All ages") {
        const [lo = 0, hi = 200] =
          age === "60+" ? [60, 200] : age.split("–").map((n) => parseInt(n, 10));
        if (b.age < lo || b.age > hi) return false;
      }
      if (
        search &&
        !b.name.toLowerCase().includes(search.toLowerCase()) &&
        !b.id.includes(search) &&
        !b.aadhaar.includes(search)
      )
        return false;
      return true;
    });
  }, [account, state, status, gender, age, search]);

  const counts = useMemo(
    () => ({
      total: filtered.length,
      male: filtered.filter((b) => b.gender === "Male").length,
      female: filtered.filter((b) => b.gender === "Female").length,
      trans: filtered.filter((b) => b.gender === "Transgender").length,
    }),
    [filtered],
  );

  const PAGE_SIZE = 25;
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Reset to first page when the filter set changes the result count.
  const filterHash = `${search}-${state}-${status}-${gender}-${age}`;
  const [prevFilterHash, setPrevFilterHash] = useState(filterHash);
  if (prevFilterHash !== filterHash) {
    setPrevFilterHash(filterHash);
    setPage(0);
  }

  const rowsToShow = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min(filtered.length, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Beneficiaries" }, { label: "Beneficiary List" }]}
        eyebrow="Beneficiaries"
        title="Beneficiary list"
        subtitle="Persons surveyed across India. Filter by state, district, status, age, and gender to drill down."
        actions={
          <ExportMenu
            filename="smile-beneficiaries"
            title="Beneficiary List"
            subtitle="Beneficiaries surveyed across India."
            columns={[
              { header: "S.No.", accessor: (b: Beneficiary & { sno: number }) => b.sno },
              { header: "Beneficiary ID", accessor: "id" },
              { header: "Beneficiary Name", accessor: "name" },
              { header: "Age", accessor: "age" },
              { header: "Gender", accessor: "gender" },
              { header: "Status", accessor: (b) => b.status.replace(/_/g, " ") },
              { header: "State", accessor: "state" },
              { header: "District / City", accessor: "district" },
              { header: "IA Name", accessor: (b) => b.ia ?? "—" },
              { header: "Beggar Type", accessor: "type" },
            ]}
            rows={filtered.map((b, i) => ({ ...b, sno: i + 1 }))}
          />
        }
      />

      <div className="grid grid-cols-2 gap-md lg:grid-cols-4">
        <StatPill label="Loaded" value={counts.total} icon="group" tone="primary" />
        <StatPill label="Male" value={counts.male} icon="person" tone="info" />
        <StatPill label="Female" value={counts.female} icon="person" tone="danger" />
        <StatPill
          label="Transgender / Other"
          value={counts.trans}
          icon="account_circle"
          tone="warning"
        />
      </div>

      <DataToolbar>
        <SearchField
          placeholder="Search name, ID, or Aadhaar…"
          value={search}
          onChange={setSearch}
          className="flex-1"
        />
        {/* Mobile: Filters button opens sheet */}
        <Button
          appearance="outlined"
          size="md"
          className="relative md:hidden"
          onClick={() => setFilterSheet(true)}
        >
          <Icon name="tune" size={16} />
          Filters
          {activeFilterCount > 0 ? (
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-label-3 font-bold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>
        {/* Desktop: inline selects */}
        <div className="hidden flex-wrap items-center gap-sm md:flex">
          <select
            aria-label="Filter by state"
            className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary"
            value={state}
            onChange={(e) => setState(e.target.value)}
            disabled={!!account?.stateId}
          >
            <option>All States / UTs</option>
            {STATES.map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            aria-label="Filter by district"
            className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary"
            disabled
          >
            <option>All Districts</option>
          </select>
          <select
            aria-label="Filter by status"
            className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            aria-label="Filter by gender"
            className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            {GENDERS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            aria-label="Filter by age band"
            className="h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            {AGES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </DataToolbar>

      <BottomSheet
        open={filterSheet}
        onClose={() => setFilterSheet(false)}
        title="Filters"
        footer={
          <div className="flex items-center justify-between gap-sm">
            <Button
              appearance="text"
              size="md"
              onClick={() => {
                setState("All States / UTs");
                setStatus("All statuses");
                setGender("All genders");
                setAge("All ages");
              }}
            >
              Clear all
            </Button>
            <Button size="md" onClick={() => setFilterSheet(false)}>
              Apply{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
          </div>
        }
      >
        <div className="space-y-md">
          <div className="space-y-xs">
            <Label htmlFor="m-state">State / UT</Label>
            <select
              id="m-state"
              className="h-11 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs focus:border-primary"
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={!!account?.stateId}
            >
              <option>All States / UTs</option>
              {STATES.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-xs">
            <Label htmlFor="m-status">Status</Label>
            <select
              id="m-status"
              className="h-11 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs focus:border-primary"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <Label htmlFor="m-gender">Gender</Label>
              <select
                id="m-gender"
                className="h-11 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs focus:border-primary"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                {GENDERS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-xs">
              <Label htmlFor="m-age">Age band</Label>
              <select
                id="m-age"
                className="h-11 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs focus:border-primary"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              >
                {AGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* Mobile card list */}
      <div className="space-y-sm md:hidden">
        {rowsToShow.length === 0 ? (
          <div className="flex flex-col items-center gap-sm rounded-lg border border-dashed border-stroke-300 bg-white px-lg py-3xl text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100 text-ink-muted">
              <Icon name="visibility" size={20} aria-hidden />
            </div>
            <div className="space-y-1">
              <h3 className="text-title-2 font-semibold text-ink">
                No beneficiaries found
              </h3>
              <p className="text-body-3 text-ink-muted">
                {anyFilterActive
                  ? "Try widening your search or clear the filters."
                  : "There are no beneficiaries in this scope yet."}
              </p>
            </div>
            {anyFilterActive ? (
              <Button appearance="outlined" size="sm" onClick={clearAllFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>
        ) : (
          rowsToShow.map((b, idx) => (
            <Link
              key={b.id}
              href={`/portals/smile-admin/persons/${b.id}`}
              className="block rounded-lg border border-stroke-200 bg-white p-md shadow-xs transition-all active:scale-[0.99] active:shadow-none"
            >
              <div className="flex items-start justify-between gap-sm">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-xs text-label-3 text-ink-hint">
                    <span className="tabular-nums">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="font-mono">{b.id}</span>
                  </div>
                  <div className="truncate text-body-1 font-semibold text-ink">
                    {b.name}
                  </div>
                  <div className="truncate text-label-2 text-ink-muted">
                    {b.state} · {b.district}
                  </div>
                </div>
                <Badge status={statusTone(b.status)} dot>
                  {b.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="mt-sm grid grid-cols-3 gap-sm border-t border-stroke-100 pt-sm text-label-3">
                <div>
                  <div className="text-ink-hint">Age</div>
                  <div className="font-semibold tabular-nums text-ink">{b.age}</div>
                </div>
                <div>
                  <div className="text-ink-hint">Gender</div>
                  <div className="font-semibold text-ink">{b.gender}</div>
                </div>
                <div>
                  <div className="text-ink-hint">Type</div>
                  <div className="font-semibold text-ink">{b.type}</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs md:block">
        <Table>
          <THead>
            <tr>
              <TH className="w-12">#</TH>
              <TH>Beneficiary ID</TH>
              <TH>Name</TH>
              <TH className="w-16">Age</TH>
              <TH>Gender</TH>
              <TH>Status</TH>
              <TH>State</TH>
              <TH>District / City</TH>
              <TH>IA</TH>
              <TH>Type</TH>
              <TH className="text-right">Action</TH>
            </tr>
          </THead>
          <tbody>
            {rowsToShow.length === 0 ? (
              <TR>
                <TD colSpan={11} className="py-3xl">
                  <div className="mx-auto flex max-w-md flex-col items-center gap-sm text-center">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100 text-ink-muted ring-8 ring-neutral-50">
                      <Icon name="visibility" size={20} aria-hidden />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-title-2 font-semibold text-ink">
                        No beneficiaries found
                      </h3>
                      <p className="text-body-3 text-ink-muted">
                        {anyFilterActive
                          ? "Try widening the search term or clearing one of the active filters."
                          : "There are no beneficiaries available for this scope yet."}
                      </p>
                    </div>
                    {anyFilterActive ? (
                      <Button appearance="outlined" size="sm" onClick={clearAllFilters}>
                        Clear filters
                      </Button>
                    ) : null}
                  </div>
                </TD>
              </TR>
            ) : (
              rowsToShow.map((b, idx) => (
                <TR key={b.id}>
                  <TD className="tabular-nums text-ink-hint">
                    {(idx + 1).toString().padStart(2, "0")}
                  </TD>
                  <TD className="font-mono text-body-3 text-ink-muted">{b.id}</TD>
                  <TD>
                    <Link
                      href={`/portals/smile-admin/persons/${b.id}`}
                      className="font-semibold text-ink hover:text-primary hover:underline"
                    >
                      {b.name}
                    </Link>
                  </TD>
                  <TD className="tabular-nums">{b.age}</TD>
                  <TD>{b.gender}</TD>
                  <TD>
                    <Badge status={statusTone(b.status)} dot>
                      {b.status.replace(/_/g, " ")}
                    </Badge>
                  </TD>
                  <TD>{b.state}</TD>
                  <TD>{b.district}</TD>
                  <TD className="text-ink-muted">{b.ia ?? "—"}</TD>
                  <TD>{b.type}</TD>
                  <TD className="text-right">
                    <Link href={`/portals/smile-admin/persons/${b.id}`} className={buttonClasses("primary", "outlined", "sm")}>
                        <Icon name="visibility" size={14} /> View
                      </Link>
                  </TD>
                </TR>
              ))
            )}
          </tbody>
        </Table>
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between border-t border-stroke-100 bg-neutral-50/40 px-lg py-md text-label-2 text-ink-muted"
        >
          <div>
            {filtered.length === 0 ? (
              <span>0 records</span>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-ink">
                  {rangeStart.toLocaleString("en-IN")}–{rangeEnd.toLocaleString("en-IN")}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-ink">
                  {filtered.length.toLocaleString("en-IN")}
                </span>{" "}
                beneficiaries
              </>
            )}
          </div>
          <div className="flex items-center gap-xs">
            <Button
              appearance="outlined"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <span aria-live="polite" className="px-sm font-medium text-ink">
              Page <span className="tabular-nums">{page + 1}</span> /{" "}
              <span className="tabular-nums">{totalPages}</span>
            </span>
            <Button
              appearance="outlined"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile pagination */}
      <nav
        aria-label="Pagination"
        className="flex items-center justify-between gap-sm rounded-lg border border-stroke-200 bg-white px-md py-sm shadow-xs md:hidden"
      >
        <span className="text-label-3 text-ink-muted">
          {filtered.length === 0 ? (
            "0 records"
          ) : (
            <>
              <span className="font-semibold text-ink">
                {rangeStart}–{rangeEnd}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-ink">{filtered.length}</span>
            </>
          )}
        </span>
        <div className="flex items-center gap-xs">
          <Button
            appearance="outlined"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <Button
            appearance="outlined"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      </nav>
    </div>
  );
}
