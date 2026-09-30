"use client";

/**
 * Claim References — the pre-issued Claim Reference Number pools, by PD code and year (PFMS BRD
 * FR-DOC-003, FR-PDM-008; §11 "Claim Reference Pool Utilisation").
 *
 * DS Audit: WorklistScreen ✅ existing · FilterSelect ✅ · Alert ✅ · Badge ✅ · Button ✅ · Icon ✅ · screenCopy ✅ ·
 * useToast ✅ — composed, nothing new.
 *
 * PFMS issues Claim Reference Numbers in batches per PD code and financial year
 * (GetClaimReferenceNumber); each beneficiary payment consumes one when the Maker submits. A pool
 * that runs dry stops submission, so a pool under LOW_POOL is flagged and the Bureau draws another
 * batch of 25 from the row. Only the current and later years can be drawn: a closed year's numbers
 * can no longer be sent.
 *
 * Financial years: the pool stores PFMS's form, the closing year ("2027"); e-Anudaan and this page
 * speak "2026-27", and `drawClaimReferences` takes the e-Anudaan form and converts it itself.
 */

import * as React from "react";
import { Alert, Badge, Button, FilterSelect, Icon, WorklistScreen, screenCopy, useToast, type WorklistColumn } from "@mosje/design-system";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { poolUtilisation, type PoolRow } from "@/lib/e-anudaan/pfms/reports";
import { pfmsFinancialYear } from "@/lib/e-anudaan/pfms/advice";

/** A pool with fewer numbers than this left is flagged. */
const LOW_POOL = 10;
const BATCH = 25;

/** PFMS "2027" → e-Anudaan "2026-27". The inverse of `pfmsFinancialYear`. */
function fromPfmsYear(closing: string): string {
  const n = Number(closing);
  if (!Number.isInteger(n)) return closing;
  return `${n - 1}-${String(n % 100).padStart(2, "0")}`;
}

/** The e-Anudaan financial year a date falls in (April to March). */
function financialYearOf(iso: string): string {
  const y = Number(iso.slice(0, 4));
  const start = Number(iso.slice(5, 7)) >= 4 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

type Row = PoolRow & { fy: string; pdLabel: string; ddoName: string };

export default function ClaimReferencesPage() {
  const { pfms, hydrated, now, drawClaimReferences } = usePfms();
  const { toast } = useToast();
  const [fy, setFy] = React.useState("");

  const current = pfmsFinancialYear(financialYearOf(now()));
  const all = React.useMemo<Row[]>(
    () =>
      poolUtilisation(pfms.pool, pfms.advices)
        .map((r) => {
          const pd = pfms.masters.pdCodes.find((p) => p.code === r.pdCode);
          return {
            ...r,
            fy: fromPfmsYear(r.financialYear),
            pdLabel: pd?.label ?? "",
            ddoName: pfms.masters.ddos.find((d) => d.code === pd?.ddoCode)?.name ?? "",
          };
        })
        .sort((a, b) => b.financialYear.localeCompare(a.financialYear) || a.pdCode.localeCompare(b.pdCode)),
    [pfms],
  );
  const years = [...new Set(all.map((r) => r.fy))].sort().reverse();
  const rows = all.filter((r) => !fy || r.fy === fy);

  const draw = (r: Row) => {
    const res = drawClaimReferences(r.pdCode, r.fy);
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`${BATCH} Claim Reference Numbers drawn for division code ${r.pdCode}, FY ${r.fy}.`, "success");
  };

  const columns: WorklistColumn<Row>[] = [
    {
      key: "pdCode",
      header: "Division Code",
      priority: 1,
      sortable: true,
      sortValue: (r) => r.pdCode,
      exportValue: (r) => `${r.pdCode} ${r.pdLabel}`,
      render: (r) => (
        <span className="block">
          <span className="block font-mono font-semibold text-ink">{r.pdCode}</span>
          <span className="block text-body-3 text-ink-muted">{r.pdLabel}</span>
        </span>
      ),
    },
    { key: "ddoName", header: "DDO", priority: 3, render: (r) => r.ddoName },
    { key: "fy", header: "Financial Year", priority: 2, sortable: true, sortValue: (r) => r.financialYear, render: (r) => <span className="whitespace-nowrap">{r.fy}</span> },
    { key: "drawn", header: "Drawn", priority: 2, align: "end", sortable: true, sortValue: (r) => r.drawn, render: (r) => <span className="tabular-nums">{r.drawn}</span> },
    { key: "consumed", header: "Used", priority: 2, align: "end", sortable: true, sortValue: (r) => r.consumed, render: (r) => <span className="tabular-nums">{r.consumed}</span> },
    { key: "remaining", header: "Remaining", priority: 2, align: "end", sortable: true, sortValue: (r) => r.remaining, render: (r) => <span className="tabular-nums font-semibold">{r.remaining}</span> },
    {
      key: "status",
      header: "Status",
      priority: 2,
      exportValue: (r) => (r.financialYear < current ? "Year Closed" : r.remaining < LOW_POOL ? "Running Low" : "Sufficient"),
      render: (r) =>
        r.financialYear < current ? (
          <Badge status="neutral" size="sm">Year Closed</Badge>
        ) : r.remaining < LOW_POOL ? (
          <Badge status="warning" size="sm">Running Low</Badge>
        ) : (
          <Badge status="success" size="sm">Sufficient</Badge>
        ),
    },
  ];

  const low = all.filter((r) => r.financialYear >= current && r.remaining < LOW_POOL).length;

  return (
    <WorklistScreen<Row>
      title="Claim References"
      meta={`Claim Reference Numbers drawn from PFMS for each division code and year. One is used for each beneficiary payment; a pool under ${LOW_POOL} is flagged.`}
      loading={!hydrated}
      summary={
        hydrated && low > 0 ? (
          <Alert status="warning" title="Pools Running Low">
 pool{low === 1 ? " is" : "s are"} running low for the current year. Draw a batch so the Maker can submit.
          </Alert>
        ) : undefined
      }
      columns={columns}
      rowActions={(r) =>
        r.financialYear >= current ? (
          <Button size="sm" appearance={r.remaining < LOW_POOL ? "filled" : "outlined"} nowrap iconLeft={<Icon name="add" size={16} aria-hidden />} onClick={() => draw(r)}>
            Draw a Batch of {BATCH}
          </Button>
        ) : null
      }
      rows={rows}
      registerTotal={all.length}
      getRowId={(r) => `${r.pdCode}-${r.financialYear}`}
      noun="pool"
      activeFilterCount={fy ? 1 : 0}
      onClearFilters={() => setFy("")}
      filters={<FilterSelect label="Financial Year" value={fy} onChange={setFy} options={[{ value: "", label: "All Years" }, ...years.map((y) => ({ value: y, label: `FY ${y}` }))]} />}
      copy={screenCopy({
        loadingLabel: "Loading Claim Reference pools",
        emptyTitle: "No Claim Reference Numbers Drawn",
        emptyDescription: "No Claim Reference Numbers have been drawn from PFMS for any division code.",
        filteredTitle: "No Pool for This Year",
        filteredDescription: "No Claim Reference Numbers were drawn for the chosen year. Clear the filter to see every year.",
        clearFiltersLabel: "Clear Filter",
      })}
    />
  );
}
