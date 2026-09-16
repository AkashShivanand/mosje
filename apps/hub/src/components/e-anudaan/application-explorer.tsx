"use client";

/**
 * All Applications — the Application Explorer.
 *
 * DS Audit: WorklistScreen ✅ existing (gained a `summary` slot for the tiles) · MetricCard ✅ ·
 * FilterSelect ✅ · Search ✅ (labelled, via LabelledSearch) · Button ✅ · Icon ✅ · screenCopy ✅.
 *
 * Live (`/pd/us/all-applications`) filters by Status — defaulting to "Needs my action" — Financial
 * Year, State and Instalment, over Total / In Review / Sanctioned / Returned tiles and a State
 * column. Ours had a search box (inventory §16). The review call asked for district as well (B15).
 * Drafts the NGO has not submitted are never listed (verify bug 11).
 *
 * ONE resolution, `explorerView()` (audit O-01). The tiles, the count line and the pager all read
 * the same filtered set, Status included. Before, the tiles ignored Status and followed everything
 * else, so a screen filtered to "Needs My Action" printed Total 133 above ten rows, "Showing 10 of
 * 133" above the table and "of 10 items" below it.
 *
 * `?status=` and `?fy=` open the screen pre-filtered: the officer dashboard's "Deficiencies Raised"
 * and "Deficiencies Resolved" figures link here, and the list they open is the set they count.
 */

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button, FilterSelect, Icon, MetricCard, WorklistScreen, screenCopy } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { EXPLORER_STATUS, placeOf, type ExplorerStatus } from "@/lib/e-anudaan/registers";
import { DEFAULT_EXPLORER_FILTERS, explorerView, type ExplorerFilters } from "@/lib/e-anudaan/officer";
import type { GrantApplication } from "@/lib/e-anudaan/types";
import { LabelledSearch, TYPE_FILTERS, useWorklistOptions, worklistColumns, splitRowActions } from "./worklist-table";

const byFy = (a: string, b: string) => b.localeCompare(a);

function isExplorerStatus(v: string | null): v is ExplorerStatus {
  return !!v && EXPLORER_STATUS.some((s) => s.value === v);
}

export function ApplicationExplorer() {
  return (
    <React.Suspense fallback={null}>
      <Explorer />
    </React.Suspense>
  );
}

function Explorer() {
  const { state } = useEAnudaan();
  const params = useSearchParams();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;

  const [filters, setFilters] = React.useState<ExplorerFilters>(() => {
    const status = params.get("status");
    return {
      ...DEFAULT_EXPLORER_FILTERS,
      status: isExplorerStatus(status) ? status : DEFAULT_EXPLORER_FILTERS.status,
      financialYear: params.get("fy") ?? "",
    };
  });
  const set = <K extends keyof ExplorerFilters>(k: K, v: ExplorerFilters[K]) => setFilters((f) => ({ ...f, [k]: v }));
  // On a phone the five selects sit behind one button (audit X-09); from the tablet anchor they show.
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const opts = useWorklistOptions(key ? `/portals/e-anudaan/dashboard/sm2/${key}/review` : undefined, undefined, {
    withPlace: true,
    withNgoLink: true,
  });
  const columns = React.useMemo(() => worklistColumns("explorer", opts), [opts]);

  const view = React.useMemo(
    () => explorerView(state, role?.id ?? null, filters, (id) => opts.ngoName?.(id) ?? ""),
    [state, role, filters, opts],
  );
  const { register, rows, tiles, activeFilterCount } = view;

  const places = React.useMemo(() => new Map(register.map((a) => [a.id, placeOf(state, a)])), [register, state]);
  const fyOptions = React.useMemo(() => [...new Set(register.map((a) => a.financialYear))].sort(byFy), [register]);
  const stateOptions = React.useMemo(
    () => [...new Set(register.map((a) => places.get(a.id)?.state).filter((x): x is string => !!x))].sort(),
    [register, places],
  );
  const districtOptions = React.useMemo(
    () =>
      filters.state
        ? [...new Set(register.filter((a) => places.get(a.id)?.state === filters.state).map((a) => places.get(a.id)!.district))].sort()
        : [],
    [register, places, filters.state],
  );

  const clear = () => setFilters(DEFAULT_EXPLORER_FILTERS);
  const resting = filters.status === "mine" && activeFilterCount === 0;
  // Selects the reader set, for the phone's "Filters (n)" button. The search stays outside it.
  const selectCount = activeFilterCount - (filters.search.trim() ? 1 : 0);

  return (
    <WorklistScreen<GrantApplication>
      title="All Applications"
      meta="Every application submitted under the Department's grant-in-aid schemes, at whatever stage it has reached."
      summary={
        /* Two across on a phone, four from the laptop anchor: stacked full width, the four figures
           took 420px before the first file (audit X-09). MetricCard drops its icon badge itself in a
           card this narrow, so there is nothing to do here but set the columns. */
        <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
          <MetricCard label="Total" value={tiles.total.toLocaleString("en-IN")} icon={<Icon name="folder_open" size={20} aria-hidden />} />
          <MetricCard label="In Review" value={tiles.progress.toLocaleString("en-IN")} icon={<Icon name="pending" size={20} aria-hidden />} />
          <MetricCard label="Sanctioned" value={tiles.sanctioned.toLocaleString("en-IN")} icon={<Icon name="verified" size={20} aria-hidden />} />
          <MetricCard label="Returned or Queried" value={tiles.returned.toLocaleString("en-IN")} icon={<Icon name="undo" size={20} aria-hidden />} />
        </div>
      }
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={register.length}
      countLine={view.countLine}
      getRowId={(a) => a.id}
      noun="application"
      /* An empty "Needs My Action" is answered as a filtered state, so the reader is offered the rest
         of the register rather than told the register is empty. */
      activeFilterCount={activeFilterCount || (rows.length === 0 && register.length > 0 ? 1 : 0)}
      onClearFilters={activeFilterCount === 0 ? () => set("status", "all") : clear}
      filters={
        /* One grid of equal columns, three across on a laptop: the bar's own auto-fit put five
           controls on the first row and left Instalment alone on the second (audit O-07). */
        <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <LabelledSearch
            label="Search"
            value={filters.search}
            onChange={(v) => set("search", v)}
            placeholder="Project ID, application or NGO"
          />
          <Button
            appearance="outlined"
            className="md:hidden"
            aria-expanded={filtersOpen}
            aria-controls="explorer-filters"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <Icon name="filter_list" size={20} aria-hidden />
            {selectCount > 0 ? `Filters (${selectCount})` : "Filters"}
          </Button>
          <div id="explorer-filters" className={`${filtersOpen ? "contents" : "hidden"} md:contents`}>
            <FilterSelect label="Status" options={EXPLORER_STATUS} value={filters.status} onChange={(v) => set("status", v as ExplorerStatus)} />
            <FilterSelect
              label="Financial Year"
              options={[{ value: "", label: "All Years" }, ...fyOptions.map((y) => ({ value: y, label: `FY ${y}` }))]}
              value={filters.financialYear}
              onChange={(v) => set("financialYear", v)}
            />
            <FilterSelect
              label="State"
              options={[{ value: "", label: "All States" }, ...stateOptions.map((s) => ({ value: s, label: s }))]}
              value={filters.state}
              onChange={(v) => setFilters((f) => ({ ...f, state: v, district: "" }))}
            />
            <FilterSelect
              label="District"
              options={[{ value: "", label: filters.state ? "All Districts" : "Choose a State First" }, ...districtOptions.map((d) => ({ value: d, label: d }))]}
              value={filters.district}
              onChange={(v) => set("district", v)}
              disabled={!filters.state}
            />
            <FilterSelect
              label="Instalment"
              options={[{ value: "", label: "All Instalments" }, ...TYPE_FILTERS.slice(1).map((t) => ({ value: t.value, label: t.label }))]}
              value={filters.instalment}
              onChange={(v) => set("instalment", v)}
            />
          </div>
        </div>
      }
      copy={screenCopy({
        loadingLabel: "Loading applications",
        emptyTitle: "No Applications in This List",
        filteredTitle: resting ? "No Application Needs Your Action" : "No Application Matches These Filters",
        filteredDescription: resting
          ? "Nothing is waiting with you. Choose another status to see the rest of the register."
          : "Clear the filters to see the full register.",
        clearFiltersLabel: resting ? "Show All Statuses" : "Clear Filters",
      })}
    />
  );
}
