"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Eye,
  SlidersHorizontal,
  User,
  UserCircle2,
} from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shell/page-header";
import { DataToolbar, SearchField } from "@/components/data/data-toolbar";
import { StatPill } from "@/components/data/stat-pill";
import { ExportMenu } from "@/components/data/export-menu";
import { BottomSheet } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { TH, THead, TR, TD, Table } from "@/components/ui/table";
import { BENEFICIARIES, type Beneficiary } from "@/lib/mock-data";
import { STATES } from "@/lib/states";
import { useApp } from "@/store/app-context";

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
        <StatPill label="Loaded" value={counts.total} icon={CreditCard} tone="primary" />
        <StatPill label="Male" value={counts.male} icon={User} tone="info" />
        <StatPill label="Female" value={counts.female} icon={User} tone="danger" />
        <StatPill
          label="Transgender / Other"
          value={counts.trans}
          icon={UserCircle2}
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
          variant="outline"
          size="md"
          className="relative md:hidden"
          onClick={() => setFilterSheet(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
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
              variant="ghost"
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
            <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100 text-foreground-muted">
              <Eye aria-hidden className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-title-2 font-semibold text-foreground">
                No beneficiaries found
              </h3>
              <p className="text-body-3 text-foreground-muted">
                {anyFilterActive
                  ? "Try widening your search or clear the filters."
                  : "There are no beneficiaries in this scope yet."}
              </p>
            </div>
            {anyFilterActive ? (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear filters
              </Button>
            ) : null}
          </div>
        ) : (
          rowsToShow.map((b, idx) => (
            <Link
              key={b.id}
              href={`/persons/${b.id}`}
              className="block rounded-lg border border-stroke-200 bg-white p-md shadow-xs transition-all active:scale-[0.99] active:shadow-none"
            >
              <div className="flex items-start justify-between gap-sm">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-xs text-label-3 text-foreground-hint">
                    <span className="tabular-nums">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span aria-hidden>·</span>
                    <span className="font-mono">{b.id}</span>
                  </div>
                  <div className="truncate text-body-1 font-semibold text-foreground">
                    {b.name}
                  </div>
                  <div className="truncate text-label-2 text-foreground-muted">
                    {b.state} · {b.district}
                  </div>
                </div>
                <Badge tone={statusTone(b.status)} withDot>
                  {b.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="mt-sm grid grid-cols-3 gap-sm border-t border-stroke-100 pt-sm text-label-3">
                <div>
                  <div className="text-foreground-hint">Age</div>
                  <div className="font-semibold tabular-nums text-foreground">{b.age}</div>
                </div>
                <div>
                  <div className="text-foreground-hint">Gender</div>
                  <div className="font-semibold text-foreground">{b.gender}</div>
                </div>
                <div>
                  <div className="text-foreground-hint">Type</div>
                  <div className="font-semibold text-foreground">{b.type}</div>
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
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-neutral-100 text-foreground-muted ring-8 ring-neutral-50">
                      <Eye aria-hidden className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-title-2 font-semibold text-foreground">
                        No beneficiaries found
                      </h3>
                      <p className="text-body-3 text-foreground-muted">
                        {anyFilterActive
                          ? "Try widening the search term or clearing one of the active filters."
                          : "There are no beneficiaries available for this scope yet."}
                      </p>
                    </div>
                    {anyFilterActive ? (
                      <Button variant="outline" size="sm" onClick={clearAllFilters}>
                        Clear filters
                      </Button>
                    ) : null}
                  </div>
                </TD>
              </TR>
            ) : (
              rowsToShow.map((b, idx) => (
                <TR key={b.id}>
                  <TD className="tabular-nums text-foreground-hint">
                    {(idx + 1).toString().padStart(2, "0")}
                  </TD>
                  <TD className="font-mono text-body-3 text-foreground-muted">{b.id}</TD>
                  <TD>
                    <Link
                      href={`/persons/${b.id}`}
                      className="font-semibold text-foreground hover:text-primary hover:underline"
                    >
                      {b.name}
                    </Link>
                  </TD>
                  <TD className="tabular-nums">{b.age}</TD>
                  <TD>{b.gender}</TD>
                  <TD>
                    <Badge tone={statusTone(b.status)} withDot>
                      {b.status.replace(/_/g, " ")}
                    </Badge>
                  </TD>
                  <TD>{b.state}</TD>
                  <TD>{b.district}</TD>
                  <TD className="text-foreground-muted">{b.ia ?? "—"}</TD>
                  <TD>{b.type}</TD>
                  <TD className="text-right">
                    <Button variant="outline" size="xs" asChild>
                      <Link href={`/persons/${b.id}`}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Link>
                    </Button>
                  </TD>
                </TR>
              ))
            )}
          </tbody>
        </Table>
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between border-t border-stroke-100 bg-neutral-50/40 px-lg py-md text-label-2 text-foreground-muted"
        >
          <div>
            {filtered.length === 0 ? (
              <span>0 records</span>
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {rangeStart.toLocaleString("en-IN")}–{rangeEnd.toLocaleString("en-IN")}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length.toLocaleString("en-IN")}
                </span>{" "}
                beneficiaries
              </>
            )}
          </div>
          <div className="flex items-center gap-xs">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous page"
            >
              Previous
            </Button>
            <span aria-live="polite" className="px-sm font-medium text-foreground">
              Page <span className="tabular-nums">{page + 1}</span> /{" "}
              <span className="tabular-nums">{totalPages}</span>
            </span>
            <Button
              variant="outline"
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
        <span className="text-label-3 text-foreground-muted">
          {filtered.length === 0 ? (
            "0 records"
          ) : (
            <>
              <span className="font-semibold text-foreground">
                {rangeStart}–{rangeEnd}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">{filtered.length}</span>
            </>
          )}
        </span>
        <div className="flex items-center gap-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <Button
            variant="outline"
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
