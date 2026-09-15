"use client";

/**
 * All Applications — the Application Explorer.
 *
 * DS Audit: WorklistScreen ✅ existing (gained a `summary` slot for the tiles) · MetricCard ✅ ·
 * FilterSelect ✅ · Search ✅ · Icon ✅ · screenCopy ✅.
 *
 * Live (`/pd/us/all-applications`) filters by Status — defaulting to "Needs my action" — Financial
 * Year, State and Instalment, over Total / In Review / Sanctioned / Returned tiles and a State
 * column. Ours had a search box (inventory §16). The review call asked for district as well (B15).
 * Drafts the NGO has not submitted are never listed (verify bug 11).
 *
 * The tiles count what the Year, State, District, Instalment and search filters let through, and
 * not the Status filter, so each tile is the number the Status filter would show if chosen.
 */

import * as React from "react";
import { FilterSelect, Icon, MetricCard, Search, WorklistScreen, screenCopy } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import {
  EXPLORER_STATUS,
  explorerTiles,
  instalmentKey,
  matchesExplorerStatus,
  officerApplications,
  placeOf,
  type ExplorerStatus,
} from "@/lib/e-anudaan/registers";
import type { GrantApplication } from "@/lib/e-anudaan/types";
import { TYPE_FILTERS, useWorklistOptions, worklistColumns, splitRowActions } from "./worklist-table";

const byFy = (a: string, b: string) => b.localeCompare(a);

export function ApplicationExplorer() {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const key = role ? reviewKeyOf(role) : null;

  const [status, setStatus] = React.useState<ExplorerStatus>("mine");
  const [fy, setFy] = React.useState("");
  const [st, setSt] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [instalment, setInstalment] = React.useState("");
  const [q, setQ] = React.useState("");

  const opts = useWorklistOptions(key ? `/portals/e-anudaan/dashboard/sm2/${key}/review` : undefined, undefined, {
    withPlace: true,
    withNgoLink: true,
  });
  const columns = React.useMemo(() => worklistColumns("explorer", opts), [opts]);

  const register = React.useMemo(() => officerApplications(state), [state]);
  const places = React.useMemo(() => new Map(register.map((a) => [a.id, placeOf(state, a)])), [register, state]);

  const fyOptions = React.useMemo(() => [...new Set(register.map((a) => a.financialYear))].sort(byFy), [register]);
  const stateOptions = React.useMemo(
    () => [...new Set(register.map((a) => places.get(a.id)?.state).filter((x): x is string => !!x))].sort(),
    [register, places],
  );
  const districtOptions = React.useMemo(
    () =>
      st
        ? [...new Set(register.filter((a) => places.get(a.id)?.state === st).map((a) => places.get(a.id)!.district))].sort()
        : [],
    [register, places, st],
  );

  // Everything but Status: what the tiles count.
  const scoped = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return register.filter((a: GrantApplication) => {
      const p = places.get(a.id);
      return (
        (!fy || a.financialYear === fy) &&
        (!st || p?.state === st) &&
        (!district || p?.district === district) &&
        (!instalment || instalmentKey(a) === instalment) &&
        (!needle ||
          a.id.toLowerCase().includes(needle) ||
          a.institutionId.toLowerCase().includes(needle) ||
          (opts.ngoName?.(a.ngoId) ?? "").toLowerCase().includes(needle))
      );
    });
  }, [register, places, fy, st, district, instalment, q, opts]);

  const rows = React.useMemo(() => scoped.filter((a) => matchesExplorerStatus(a, status, role?.id ?? null)), [scoped, status, role]);
  const tiles = explorerTiles(scoped);

  // "Needs My Action" is the screen's resting state, not a filter the reader set.
  const active = (status !== "mine" ? 1 : 0) + (fy ? 1 : 0) + (st ? 1 : 0) + (district ? 1 : 0) + (instalment ? 1 : 0) + (q.trim() ? 1 : 0);
  const clear = () => {
    setStatus("mine");
    setFy("");
    setSt("");
    setDistrict("");
    setInstalment("");
    setQ("");
  };

  return (
    <WorklistScreen<GrantApplication>
      title="All Applications"
      meta="Every application submitted under the Department's grant-in-aid schemes, at whatever stage it has reached."
      summary={
        <>
          <MetricCard label="Total" value={tiles.total.toLocaleString("en-IN")} icon={<Icon name="folder_open" size={20} aria-hidden />} />
          <MetricCard label="In Review" value={tiles.progress.toLocaleString("en-IN")} icon={<Icon name="pending" size={20} aria-hidden />} />
          <MetricCard label="Sanctioned" value={tiles.sanctioned.toLocaleString("en-IN")} icon={<Icon name="verified" size={20} aria-hidden />} />
          <MetricCard label="Returned or Queried" value={tiles.returned.toLocaleString("en-IN")} icon={<Icon name="undo" size={20} aria-hidden />} />
        </>
      }
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={register.length}
      getRowId={(a) => a.id}
      noun="application"
      /* An empty "Needs My Action" is answered as a filtered state, so the reader is offered the rest
         of the register rather than told the register is empty. */
      activeFilterCount={active || (rows.length === 0 && register.length > 0 ? 1 : 0)}
      onClearFilters={active === 0 ? () => setStatus("all") : clear}
      filters={
        <>
          <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Search applications" aria-label="Search by Project ID, application or NGO" />
          <FilterSelect label="Status" options={EXPLORER_STATUS} value={status} onChange={(v) => setStatus(v as ExplorerStatus)} />
          <FilterSelect
            label="Financial Year"
            options={[{ value: "", label: "All Years" }, ...fyOptions.map((y) => ({ value: y, label: `FY ${y}` }))]}
            value={fy}
            onChange={setFy}
          />
          <FilterSelect
            label="State"
            options={[{ value: "", label: "All States" }, ...stateOptions.map((s) => ({ value: s, label: s }))]}
            value={st}
            onChange={(v) => {
              setSt(v);
              setDistrict("");
            }}
          />
          <FilterSelect
            label="District"
            options={[{ value: "", label: st ? "All Districts" : "Choose a State First" }, ...districtOptions.map((d) => ({ value: d, label: d }))]}
            value={district}
            onChange={setDistrict}
            disabled={!st}
          />
          <FilterSelect
            label="Instalment"
            options={[{ value: "", label: "All Instalments" }, ...TYPE_FILTERS.slice(1).map((t) => ({ value: t.value, label: t.label }))]}
            value={instalment}
            onChange={setInstalment}
          />
        </>
      }
      copy={screenCopy({
        loadingLabel: "Loading applications",
        emptyTitle: "No Applications in This List",
        filteredTitle: status === "mine" && active === 0 ? "No Application Needs Your Action" : "No Application Matches These Filters",
        filteredDescription:
          status === "mine" && active === 0
            ? "Nothing is waiting with you. Choose another status to see the rest of the register."
            : "Clear the filters to see the full register.",
        clearFiltersLabel: status === "mine" && active === 0 ? "Show All Statuses" : "Clear Filters",
      })}
    />
  );
}
