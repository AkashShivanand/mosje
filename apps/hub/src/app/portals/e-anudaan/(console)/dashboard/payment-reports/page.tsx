"use client";

/**
 * Payment Reports — the six dashboards of the PFMS BRD §11, on one page, one tab each.
 *
 * DS Audit: WorklistScreen ✅ existing · Tabs ✅ (href mode, so a report is linkable) ·
 * FilterSelect ✅ · NumberInput ✅ · ChartCard ✅ · MetricCard ✅ · RankedBarList ✅ · BarChart ✅ ·
 * InlineBar ✅ · Badge ✅ · Button ✅ · Icon ✅ · useToast ✅ · screenCopy ✅ — composed, nothing new.
 * Stage badges, the row link and `exact()` come from `components/e-anudaan/pfms/payment-ui`, so a
 * stage reads the same here as in the Maker's and Checker's queues and on the case page.
 *
 * BRD ids: §11 (Sanction Pipeline, Ageing, Disbursement Reconciliation, Failure / Exception Trend,
 * Claim Reference Pool Utilisation, Turnaround) · FR-STS-004 (the release feed) · FR-STS-006 (error
 * messages in plain language, as the Bureau has worded them) · FR-DOC-003 (the claim reference pool).
 *
 * Every figure is computed by `lib/e-anudaan/pfms/reports.ts` from the same advices the queues
 * read, and every stage from `stageOf()`, so a count on a tile is always the number of rows the
 * tile filters the table to (.claude/rules/data-state-completeness.md §2). The figures are the
 * prototype's own illustrative records, and every card says so in its provenance line
 * (.claude/rules/prototype-data-modes.md).
 *
 * One Scheme filter applies to every tab. Each tab is its own `WorklistScreen`, so each owns its
 * loading, empty and filtered-to-nothing states; the summary cards are drawn only once there are
 * rows, because at empty or filtered-to-nothing the body's own message is the answer.
 */

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Badge,
  BarChart,
  Button,
  ChartCard,
  FilterSelect,
  Icon,
  InlineBar,
  MetricCard,
  NumberInput,
  RankedBarList,
  Tabs,
  WorklistScreen,
  screenCopy,
  useToast,
  type DataProvenance,
  type WorklistColumn,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { formatDate, formatDateTime, formatMoney, formatMonthYear } from "@/lib/e-anudaan/format";
import { RefText, splitRowActions } from "@/components/e-anudaan/worklist-table";
import { CaseStatus, RowLink, StageBadge, exact, statusHref } from "@/components/e-anudaan/pfms/payment-ui";
import { BLOCKER_TEXT, paymentCases, type Blocker, type PaymentCase } from "@/lib/e-anudaan/pfms/selectors";
import { EXCEPTIONS, STAGES, STAGE_INFO, type AnyStage } from "@/lib/e-anudaan/pfms/stages";
import { configFor, labelOf } from "@/lib/e-anudaan/pfms/masters";
import { pfmsError } from "@/lib/e-anudaan/pfms/errors";
import {
  RECON_LABEL,
  ageing,
  failureCodes,
  failureTrend,
  pipelineCounts,
  poolUtilisation,
  reconcile,
  sinceLastMove,
  turnaround,
  type AgeingRow,
  type PoolRow,
  type ReconRow,
  type ReconState,
  type TurnaroundRow,
} from "@/lib/e-anudaan/pfms/reports";
import type { EAnudaanState, GrantApplication } from "@/lib/e-anudaan/types";
import type { PfmsState } from "@/lib/e-anudaan/pfms/seed";

const REPORTS = [
  { id: "pipeline", label: "Sanction Pipeline", meta: "Sanctioned files at each stage of payment, from the payment advice to the credit." },
  { id: "ageing", label: "Ageing", meta: "Payment advices in progress, by Drawing and Disbursing Officer, with the days since each last moved." },
  { id: "reconciliation", label: "Disbursement Reconciliation", meta: "Credited payments matched against the PFMS Ministry release and transfer entries." },
  { id: "failures", label: "Failure Trend", meta: "Payment advices PFMS did not accept, by month and by the kind of error." },
  { id: "claim-references", label: "Claim Reference Pool", meta: "Claim reference numbers drawn from PFMS, by division code and financial year, and how many remain." },
  { id: "turnaround", label: "Turnaround", meta: "Days from the sanction to the confirmed credit, by scheme." },
] as const;

type ReportId = (typeof REPORTS)[number]["id"];

/** Fewer claim reference numbers than this left in a pool is flagged (§11). */
const POOL_LOW = 10;

const RECON_TONE: Record<ReconState, "success" | "warning" | "danger"> = {
  matched: "success",
  "not-in-feed": "warning",
  "amount-differs": "danger",
  "utr-differs": "danger",
};

/** Everything a tab needs from the page, so each tab is one `WorklistScreen` and nothing more. */
interface ReportContext {
  /** The report switcher, drawn first in every report. */
  tabs: React.ReactNode;
  state: EAnudaanState;
  pfms: PfmsState;
  scheme: string;
  /** The page's shared chrome: title, the report's one sentence, the tabs, the loading flag. */
  frame: { title: string; meta: string; loading: boolean };
  schemeFilter: React.ReactNode;
  clearScheme: () => void;
  /** When the page read the records; set only once both stores have hydrated. */
  stamp: string;
  ngoName: (ngoId: string) => string;
  appOf: (appId: string) => GrantApplication | undefined;
}

const provenance = (asOf: string, source = "e-Anudaan payment records"): DataProvenance => ({ source, asOf, note: "Illustrative" });

const count = (n: number) => n.toLocaleString("en-IN");
const plural = (n: number, one: string, many = `${one}s`) => `${count(n)} ${n === 1 ? one : many}`;
const summaryMoney = (n: number) => formatMoney(n, "summary");

export default function PaymentReportsPage() {
  // useSearchParams needs a Suspense boundary under the App Router.
  return (
    <React.Suspense fallback={null}>
      <PaymentReports />
    </React.Suspense>
  );
}

function PaymentReports() {
  const { state, hydrated } = useEAnudaan();
  const { pfms, hydrated: pfmsHydrated, now } = usePfms();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [scheme, setScheme] = React.useState("");

  const requested = params.get("tab");
  const report = REPORTS.find((r) => r.id === requested) ?? REPORTS[0];
  const ready = hydrated && pfmsHydrated;
  // Read once the stores are live, so the server render and the first client render agree.
  // `now` changes identity whenever the payment store does, so the stamp follows every change.
  const stamp = React.useMemo(() => (ready ? now() : ""), [ready, now]);

  const schemes = React.useMemo(
    () => [...new Set([...paymentCases(state, pfms).map((c) => c.app.schemeCode), ...pfms.advices.map((a) => a.schemeCode)])].sort(),
    [state, pfms],
  );

  const views = (
    <Tabs
      idBase="payment-reports"
      ariaLabel="Payment reports"
      overflow
      tabs={REPORTS.map((r) => ({ id: r.id, label: r.label, href: `${pathname}?tab=${r.id}` }))}
      active={REPORTS.findIndex((r) => r.id === report.id)}
      onChange={(i, event) => {
        event?.preventDefault();
        router.replace(`${pathname}?tab=${REPORTS[i]!.id}`, { scroll: false });
      }}
    />
  );

  const ctx: ReportContext = {
    state,
    pfms,
    scheme,
    // The report switcher sits directly under the page heading, before any figure: WorklistScreen
    // draws `summary` above `views`, which put six tabs halfway down the page, under the cards of
    // whichever report was open. So the tabs lead the summary slot instead of taking `views`.
    frame: { title: "Payment Reports", meta: report.meta, loading: !ready },
    tabs: views,
    schemeFilter: (
      <FilterSelect label="Scheme" value={scheme} onChange={setScheme} options={[{ value: "", label: "All Schemes" }, ...schemes.map((s) => ({ value: s, label: schemeLabel(s) }))]} />
    ),
    clearScheme: () => setScheme(""),
    stamp,
    ngoName: (id) => state.ngos.find((n) => n.id === id)?.name ?? id,
    appOf: (appId) => state.applications.find((a) => a.id === appId),
  };

  const byId: Record<ReportId, React.ReactNode> = {
    pipeline: <PipelineReport ctx={ctx} />,
    ageing: <AgeingReport ctx={ctx} />,
    reconciliation: <ReconciliationReport ctx={ctx} />,
    failures: <FailureReport ctx={ctx} />,
    "claim-references": <PoolReport ctx={ctx} />,
    turnaround: <TurnaroundReport ctx={ctx} />,
  };
  return <>{byId[report.id]}</>;
}

/** The file cell every table here starts with: the NGO, then the application number. */
function FileCell({ ngo, appId }: { ngo: string; appId: string }) {
  return (
    <span className="block">
      <span className="block font-semibold text-ink">{ngo}</span>
      <RefText value={appId} className="block text-body-3 text-ink-muted" />
    </span>
  );
}

const filteredCopy = (loading: string, emptyTitle: string, emptyDescription: string) =>
  screenCopy({
    loadingLabel: loading,
    emptyTitle,
    emptyDescription,
    filteredTitle: "Nothing Under This Selection",
    filteredDescription: "Clear the filters to see the whole report.",
    clearFiltersLabel: "Clear Filters",
  });

/* ── a. Sanction Pipeline ─────────────────────────────────────────────────── */

type StageFilter = "" | AnyStage | `held:${Blocker}`;

function inStage(c: PaymentCase, f: StageFilter): boolean {
  if (!f) return true;
  if (f.startsWith("held:")) return c.blocker === f.slice(5);
  return c.stage === f;
}

function PipelineReport({ ctx }: { ctx: ReportContext }) {
  const { state, pfms, scheme, frame, stamp, ngoName } = ctx;
  const [stage, setStage] = React.useState<StageFilter>("");

  const cases = React.useMemo(() => paymentCases(state, pfms).filter((c) => !scheme || c.app.schemeCode === scheme), [state, pfms, scheme]);
  // One reading: the tiles count the same cases the table lists, by the same stageOf().
  const counts = React.useMemo(
    () =>
      pipelineCounts(
        cases.flatMap((c) => (c.advice ? [c.advice] : [])),
        // A held file is counted once, under On Hold — not also as awaiting an advice it cannot have yet.
        cases.filter((c) => !c.advice && !c.blocker).length,
      ),
    [cases],
  );
  const held = (Object.keys(BLOCKER_TEXT) as Blocker[]).map((b) => ({ b, n: cases.filter((c) => c.blocker === b).length })).filter((x) => x.n > 0);
  const exceptions = EXCEPTIONS.filter((s) => counts[s] > 0);
  const rows = cases.filter((c) => inStage(c, stage));
  const pick = (f: StageFilter) => setStage((cur) => (cur === f ? "" : f));

  const columns: WorklistColumn<PaymentCase>[] = [
    {
      key: "file",
      header: "Application",
      priority: 1,
      sortable: true,
      sortValue: (c) => c.app.id,
      exportValue: (c) => `${ngoName(c.app.ngoId)} ${c.app.id}`,
      render: (c) => <FileCell ngo={ngoName(c.app.ngoId)} appId={c.app.id} />,
    },
    { key: "scheme", header: "Scheme", priority: 2, sortable: true, sortValue: (c) => schemeLabel(c.app.schemeCode), exportValue: (c) => schemeLabel(c.app.schemeCode), render: (c) => schemeLabel(c.app.schemeCode) },
    {
      key: "stage",
      header: "Stage",
      priority: 2,
      exportValue: (c) => (c.blocker ? BLOCKER_TEXT[c.blocker].label : STAGE_INFO[c.stage].label),
      render: (c) => <CaseStatus c={c} />,
    },
    {
      key: "moved",
      header: "Last Moved",
      priority: 2,
      sortable: true,
      sortValue: (c) => lastMoved(c),
      exportValue: (c) => formatDate(lastMoved(c)),
      render: (c) => <span className="whitespace-nowrap">{formatDate(lastMoved(c))}</span>,
    },
    { key: "action", header: "Action", priority: 3, noExport: true, render: (c) => <RowLink href={statusHref(c.app.id)} label="View" /> },
  ];

  const tile = (f: StageFilter, label: string, n: number, detail?: string, tone?: "warning" | "danger") => (
    <li key={f}>
      <MetricCard size="sm" label={label} value={count(n)} detail={detail} tone={n > 0 ? tone : undefined} onSelect={() => pick(f)} selected={stage === f} />
    </li>
  );

  const summary = (
    <div className="grid gap-4">
      <ChartCard title="Files by Stage" headingLevel={2} provenance={provenance(stamp)}>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" aria-label="Files at each stage, in order">
          {STAGES.map((s) => tile(s, STAGE_INFO[s].label, counts[s], STAGE_INFO[s].holder === "—" ? undefined : STAGE_INFO[s].holder))}
        </ol>
      </ChartCard>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Off the Usual Path"
          headingLevel={2}
          provenance={provenance(stamp)}
          empty={exceptions.length === 0}
          emptyTitle="None"
          emptyLabel="No payment advice has been returned, refused or cancelled."
        >
          <ul className="grid grid-cols-2 gap-3" aria-label="Files off the usual path">
            {exceptions.map((s) => tile(s, STAGE_INFO[s].label, counts[s], STAGE_INFO[s].holder, STAGE_INFO[s].tone === "danger" ? "danger" : "warning"))}
          </ul>
        </ChartCard>
        <ChartCard
          title="On Hold"
          headingLevel={2}
          provenance={provenance(stamp)}
          empty={held.length === 0}
          emptyTitle="None"
          emptyLabel="No sanctioned file is on hold."
        >
          <ul className="grid grid-cols-2 gap-3" aria-label="Files on hold, by reason">
            {held.map(({ b, n }) => tile(`held:${b}`, BLOCKER_TEXT[b].label, n, undefined, "warning"))}
          </ul>
        </ChartCard>
      </div>
    </div>
  );

  const stageOptions = [
    { value: "", label: "All Stages" },
    ...STAGES.map((s) => ({ value: s, label: `${STAGE_INFO[s].label} (${count(counts[s])})` })),
    ...exceptions.map((s) => ({ value: s, label: `${STAGE_INFO[s].label} (${count(counts[s])})` })),
    ...held.map(({ b, n }) => ({ value: `held:${b}`, label: `On Hold: ${BLOCKER_TEXT[b].label} (${count(n)})` })),
  ];

  return (
    <WorklistScreen<PaymentCase>
      {...frame}
      summary={<div className="space-y-5">{ctx.tabs}{!frame.loading && cases.length > 0 ? summary : null}</div>}
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={cases.length}
      getRowId={(c) => c.app.id}
      noun="file"
      activeFilterCount={(scheme ? 1 : 0) + (stage ? 1 : 0)}
      onClearFilters={() => {
        ctx.clearScheme();
        setStage("");
      }}
      filters={
        <>
          {ctx.schemeFilter}
          <FilterSelect label="Stage" value={stage} onChange={(v) => setStage(v as StageFilter)} options={stageOptions} />
        </>
      }
      copy={filteredCopy("Loading the sanction pipeline", "No Sanctioned File", "No file has been sanctioned for payment yet.")}
    />
  );
}

function lastMoved(c: PaymentCase): string {
  return c.advice ? sinceLastMove(c.advice) : (c.app.sanction?.sanctionedAt ?? c.app.updatedAt);
}

/* ── b. Ageing ─────────────────────────────────────────────────────────────── */

function AgeingReport({ ctx }: { ctx: ReportContext }) {
  const { pfms, scheme, frame, stamp, ngoName, appOf } = ctx;
  const { setAgeingThreshold } = usePfms();
  const threshold = pfms.ageingThresholdDays;
  /* The field holds what is typed; the store takes only a whole number of at least one day. An
     undefined draft follows the store, so a change made in another tab shows here too. */
  const [draft, setDraft] = React.useState<number | null | undefined>(undefined);
  const [overOnly, setOverOnly] = React.useState(false);

  const all = React.useMemo(
    () => (stamp ? ageing(pfms.advices.filter((a) => !scheme || a.schemeCode === scheme), pfms.masters, stamp, threshold) : []),
    [pfms, scheme, stamp, threshold],
  );
  const rows = overOnly ? all.filter((r) => r.overThreshold) : all;
  const over = all.filter((r) => r.overThreshold);
  const byDdo = [...new Set(all.map((r) => r.ddoCode))].map((code) => {
    const mine = all.filter((r) => r.ddoCode === code);
    const n = mine.filter((r) => r.overThreshold).length;
    return { label: `${mine[0]!.ddoName} (${code})`, value: n, detail: `of ${count(mine.length)}` };
  });
  const flag = `Over ${plural(threshold, "day")}`;

  const columns: WorklistColumn<AgeingRow>[] = [
    {
      key: "ddo",
      header: "DDO",
      priority: 1,
      sortable: true,
      sortValue: (r) => r.ddoName,
      exportValue: (r) => `${r.ddoName} ${r.ddoCode}`,
      render: (r) => (
        <span className="block">
          <span className="block font-semibold text-ink">{r.ddoName}</span>
          <span className="block text-body-3 tabular-nums text-ink-muted">{r.ddoCode}</span>
        </span>
      ),
    },
    {
      key: "file",
      header: "Application",
      priority: 2,
      sortable: true,
      sortValue: (r) => r.appId,
      exportValue: (r) => r.appId,
      render: (r) => <FileCell ngo={ngoName(appOf(r.appId)?.ngoId ?? "")} appId={r.appId} />,
    },
    { key: "stage", header: "Stage", priority: 2, exportValue: (r) => STAGE_INFO[r.stage].label, render: (r) => <StageBadge stage={r.stage} size="sm" /> },
    { key: "days", header: "Days Since Last Moved", priority: 2, align: "end", sortable: true, sortValue: (r) => r.days, exportValue: (r) => String(r.days), render: (r) => count(r.days) },
    {
      key: "flag",
      header: "Ageing",
      priority: 2,
      exportValue: (r) => (r.overThreshold ? flag : ""),
      render: (r) =>
        r.overThreshold ? (
          <Badge status="warning" size="sm" className="h-auto whitespace-nowrap">
            {flag}
          </Badge>
        ) : (
          <span className="text-ink-muted">Within {plural(threshold, "day")}</span>
        ),
    },
    { key: "action", header: "Action", priority: 3, noExport: true, render: (r) => <RowLink href={statusHref(r.appId)} label="View" /> },
  ];

  const summary = (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <MetricCard label="In Progress" value={count(all.length)} detail="Payment advices not yet paid or closed" provenance={provenance(stamp)} />
        <MetricCard
          label={flag}
          value={count(over.length)}
          tone={over.length > 0 ? "warning" : undefined}
          onSelect={() => setOverOnly((v) => !v)}
          selected={overOnly}
          provenance={provenance(stamp)}
        />
      </div>
      <ChartCard
        title={`${flag}, by DDO`}
        headingLevel={2}
        provenance={provenance(stamp)}
        empty={over.length === 0}
        emptyTitle="None"
        emptyLabel={`Every payment advice in progress has moved within ${plural(threshold, "day")}.`}
      >
        <RankedBarList title={`${flag}, by DDO`} items={byDdo} showRank={false} pageSize={6} valueFormat={count} />
      </ChartCard>
    </div>
  );

  return (
    <WorklistScreen<AgeingRow>
      {...frame}
      summary={<div className="space-y-5">{ctx.tabs}{!frame.loading && all.length > 0 ? summary : null}</div>}
      {...splitRowActions(columns)}
      rows={rows}
      registerTotal={all.length}
      getRowId={(r) => r.adviceId}
      noun="payment advice"
      pluralNoun="payment advices"
      activeFilterCount={(scheme ? 1 : 0) + (overOnly ? 1 : 0)}
      onClearFilters={() => {
        ctx.clearScheme();
        setOverOnly(false);
      }}
      filters={
        <>
          {ctx.schemeFilter}
          <NumberInput
            label="Flag After (Days)"
            className="w-44"
            min={1}
            step={1}
            precision={0}
            value={draft === undefined ? threshold : draft}
            onValueChange={(v) => {
              setDraft(v);
              if (v != null && v >= 1) setAgeingThreshold(v);
            }}
            error={draft != null && draft < 1 ? "Enter at least one day." : undefined}
          />
        </>
      }
      copy={filteredCopy("Loading the ageing report", "No Payment Advice in Progress", "Every payment advice has been paid, closed or returned.")}
    />
  );
}

/* ── c. Disbursement Reconciliation ──────────────────────────────────────── */

function ReconciliationReport({ ctx }: { ctx: ReportContext }) {
  const { pfms, scheme, frame, ngoName, appOf } = ctx;
  const { pullReleaseFeed } = usePfms();
  const { toast } = useToast();

  const all = React.useMemo(() => reconcile(pfms.advices.filter((a) => !scheme || a.schemeCode === scheme), pfms.feed), [pfms, scheme]);
  const mismatches = all.filter((r) => r.state !== "matched");
  const sanctioned = all.reduce((s, r) => s + r.sanctioned, 0);
  const credited = all.reduce((s, r) => s + r.credited, 0);
  const ddoName = (code: string) => pfms.masters.ddos.find((d) => d.code === code)?.name ?? code;
  const group = (key: (r: ReconRow) => string, label: (k: string) => string) =>
    [...new Set(all.map(key))].map((k) => {
      const mine = all.filter((r) => key(r) === k);
      const c = mine.reduce((s, r) => s + r.credited, 0);
      return { label: label(k), value: c, detail: `of ${summaryMoney(mine.reduce((s, r) => s + r.sanctioned, 0))} sanctioned` };
    });
  const prov = provenance(pfms.feedPulledAt, "e-Anudaan payment records and PFMS release feed");

  const columns: WorklistColumn<ReconRow>[] = [
    {
      key: "file",
      header: "Application",
      priority: 1,
      sortable: true,
      sortValue: (r) => r.appId,
      exportValue: (r) => r.appId,
      render: (r) => <FileCell ngo={ngoName(appOf(r.appId)?.ngoId ?? "")} appId={r.appId} />,
    },
    { key: "scheme", header: "Scheme", priority: 2, sortable: true, sortValue: (r) => schemeLabel(r.schemeCode), exportValue: (r) => schemeLabel(r.schemeCode), render: (r) => schemeLabel(r.schemeCode) },
    { key: "ddo", header: "DDO", priority: 3, sortable: true, sortValue: (r) => r.ddoCode, exportValue: (r) => r.ddoCode, render: (r) => <span className="tabular-nums">{r.ddoCode}</span> },
    { key: "sanctioned", header: "Sanctioned", priority: 2, align: "end", sortable: true, sortValue: (r) => r.sanctioned, exportValue: (r) => String(r.sanctioned), render: (r) => <span className="whitespace-nowrap">{exact(r.sanctioned)}</span> },
    { key: "credited", header: "Credited", priority: 2, align: "end", sortable: true, sortValue: (r) => r.credited, exportValue: (r) => String(r.credited), render: (r) => <span className="whitespace-nowrap">{exact(r.credited)}</span> },
    {
      key: "feed",
      header: "In Release Feed",
      priority: 3,
      align: "end",
      exportValue: (r) => (r.feedAmount == null ? "" : String(r.feedAmount)),
      render: (r) => <span className="whitespace-nowrap">{r.feedAmount == null ? "—" : exact(r.feedAmount)}</span>,
    },
    { key: "utr", header: "UTR", priority: 3, exportValue: (r) => r.utr, render: (r) => <span className="break-all font-mono text-body-3">{r.utr}</span> },
    {
      key: "state",
      header: "Reconciliation",
      priority: 2,
      sortable: true,
      sortValue: (r) => RECON_LABEL[r.state],
      exportValue: (r) => RECON_LABEL[r.state],
      render: (r) => (
        <Badge status={RECON_TONE[r.state]} size="sm" className="h-auto whitespace-nowrap">
          {RECON_LABEL[r.state]}
        </Badge>
      ),
    },
    { key: "action", header: "Action", priority: 3, noExport: true, render: (r) => <RowLink href={statusHref(r.appId)} label="View" /> },
  ];

  const summary = (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Not Matched" value={count(mismatches.length)} tone={mismatches.length > 0 ? "danger" : "success"} detail={`of ${plural(all.length, "credited file")}`} provenance={prov} />
        <MetricCard label="Sanctioned" value={summaryMoney(sanctioned)} provenance={prov} />
        <MetricCard label="Credited" value={summaryMoney(credited)} provenance={prov} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Credited by Scheme" headingLevel={2} provenance={prov}>
          <RankedBarList title="Credited by scheme" items={group((r) => r.schemeCode, schemeLabel)} showRank={false} pageSize={6} valueFormat={summaryMoney} />
        </ChartCard>
        <ChartCard title="Credited by DDO" headingLevel={2} provenance={prov}>
          <RankedBarList title="Credited by DDO" items={group((r) => r.ddoCode, (k) => `${ddoName(k)} (${k})`)} showRank={false} pageSize={6} valueFormat={summaryMoney} />
        </ChartCard>
      </div>
    </div>
  );

  return (
    <WorklistScreen<ReconRow>
      {...frame}
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-body-2 text-ink-muted">Release feed pulled {formatDateTime(pfms.feedPulledAt)}</p>
          <Button
            appearance="outlined"
            onClick={() => {
              pullReleaseFeed();
              toast("Release feed pulled from PFMS.", "success");
            }}
          >
            <Icon name="sync" size={20} aria-hidden /> Pull Release Feed
          </Button>
        </div>
      }
      summary={<div className="space-y-5">{ctx.tabs}{!frame.loading && all.length > 0 ? summary : null}</div>}
      {...splitRowActions(columns)}
      rows={all}
      getRowId={(r) => r.adviceId}
      noun="credited file"
      activeFilterCount={scheme ? 1 : 0}
      onClearFilters={ctx.clearScheme}
      filters={ctx.schemeFilter}
      copy={filteredCopy("Loading the reconciliation", "No Credited Payment", "No grant has been credited through PFMS yet, so there is nothing to reconcile.")}
    />
  );
}

/* ── d. Failure Trend ─────────────────────────────────────────────────────── */

type CodeRow = ReturnType<typeof failureCodes>[number];

function FailureReport({ ctx }: { ctx: ReportContext }) {
  const { pfms, scheme, frame, stamp } = ctx;
  const advices = React.useMemo(() => pfms.advices.filter((a) => !scheme || a.schemeCode === scheme), [pfms, scheme]);
  const rows = React.useMemo(() => failureCodes(advices), [advices]);
  const trend = React.useMemo(() => failureTrend(advices), [advices]);
  const months = [...new Set(trend.map((t) => t.month))];
  const categories = [...new Set(trend.map((t) => t.category))].sort();
  const total = rows.reduce((s, r) => s + r.count, 0);
  // The message as the Bureau has worded it (FR-STS-006), not the lookup's default.
  const message = (code: string) => pfmsError(code, pfms.errorOverrides).message;

  const columns: WorklistColumn<CodeRow>[] = [
    { key: "code", header: "PFMS Code", priority: 1, sortable: true, sortValue: (r) => r.code, exportValue: (r) => r.code, render: (r) => <span className="font-mono">{r.code}</span> },
    { key: "category", header: "Category", priority: 2, sortable: true, sortValue: (r) => r.category, exportValue: (r) => r.category, render: (r) => r.category },
    { key: "count", header: "Times Returned", priority: 2, align: "end", sortable: true, sortValue: (r) => r.count, exportValue: (r) => String(r.count), render: (r) => count(r.count) },
    { key: "message", header: "What It Means", priority: 2, exportValue: (r) => message(r.code), render: (r) => <span className="block">{message(r.code)}</span> },
  ];

  const summary = (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
      <MetricCard label="Errors Returned by PFMS" value={count(total)} detail={`Across ${plural(rows.length, "error code")}`} provenance={provenance(stamp)} />
      <ChartCard title="Errors by Month and Category" headingLevel={2} provenance={provenance(stamp)}>
        <BarChart
          title="Errors returned by PFMS, by month and category"
          variant="stacked"
          labels={months.map((m) => formatMonthYear(`${m}-01`))}
          series={categories.map((cat) => ({ name: cat, data: months.map((m) => trend.find((t) => t.month === m && t.category === cat)?.count ?? 0) }))}
          yLabel="Errors"
          valueFormat={count}
        />
      </ChartCard>
    </div>
  );

  return (
    <WorklistScreen<CodeRow>
      {...frame}
      summary={<div className="space-y-5">{ctx.tabs}{!frame.loading && rows.length > 0 ? summary : null}</div>}
      columns={columns}
      rows={rows}
      getRowId={(r) => r.code}
      noun="error code"
      activeFilterCount={scheme ? 1 : 0}
      onClearFilters={ctx.clearScheme}
      filters={ctx.schemeFilter}
      copy={filteredCopy("Loading the failure trend", "No Failures", "PFMS has accepted every payment advice sent to it.")}
    />
  );
}

/* ── e. Claim Reference Pool ──────────────────────────────────────────────── */

function PoolReport({ ctx }: { ctx: ReportContext }) {
  const { pfms, scheme, frame, stamp } = ctx;
  const all = React.useMemo(() => {
    // A pool belongs to a PD code, and a PD code to a DDO; a scheme is paid by its DDOs.
    const ddos = scheme ? new Set(configFor(pfms.configs, scheme)?.ddoCodes ?? []) : null;
    const pds = ddos ? new Set(pfms.masters.pdCodes.filter((p) => ddos.has(p.ddoCode)).map((p) => p.code)) : null;
    return poolUtilisation(pds ? pfms.pool.filter((b) => pds.has(b.pdCode)) : pfms.pool, pfms.advices);
  }, [pfms, scheme]);
  const low = all.filter((r) => r.remaining < POOL_LOW);
  const drawn = all.reduce((s, r) => s + r.drawn, 0);
  const remaining = all.reduce((s, r) => s + r.remaining, 0);
  const lowLabel = `Fewer than ${POOL_LOW} left`;

  const columns: WorklistColumn<PoolRow>[] = [
    {
      key: "pd",
      header: "Division Code",
      priority: 1,
      sortable: true,
      sortValue: (r) => r.pdCode,
      exportValue: (r) => r.pdCode,
      render: (r) => (
        <span className="block">
          <span className="block font-semibold tabular-nums text-ink">{r.pdCode}</span>
          <span className="block text-body-3 text-ink-muted">{labelOf(pfms.masters.pdCodes, r.pdCode)}</span>
        </span>
      ),
    },
    { key: "fy", header: "Financial Year", priority: 2, sortable: true, sortValue: (r) => r.financialYear, exportValue: (r) => r.financialYear, render: (r) => r.financialYear },
    { key: "drawn", header: "Drawn", priority: 2, align: "end", sortable: true, sortValue: (r) => r.drawn, exportValue: (r) => String(r.drawn), render: (r) => count(r.drawn) },
    { key: "consumed", header: "Used", priority: 2, align: "end", sortable: true, sortValue: (r) => r.consumed, exportValue: (r) => String(r.consumed), render: (r) => count(r.consumed) },
    { key: "remaining", header: "Remaining", priority: 2, align: "end", sortable: true, sortValue: (r) => r.remaining, exportValue: (r) => String(r.remaining), render: (r) => count(r.remaining) },
    {
      key: "bar",
      header: "Used of Drawn",
      priority: 3,
      noExport: true,
      render: (r) => (
        <span className="block">
          <InlineBar value={r.consumed} max={Math.max(1, r.drawn)} tone={r.remaining < POOL_LOW ? "warning" : undefined} />
        </span>
      ),
    },
    {
      key: "flag",
      header: "Status",
      priority: 2,
      exportValue: (r) => (r.remaining < POOL_LOW ? lowLabel : ""),
      render: (r) =>
        r.remaining < POOL_LOW ? (
          <Badge status="warning" size="sm" className="h-auto whitespace-nowrap">
            {lowLabel}
          </Badge>
        ) : (
          <span className="text-ink-muted">Sufficient</span>
        ),
    },
  ];

  const summary = (
    <div className="grid gap-4 sm:grid-cols-3">
      <MetricCard label="Drawn from PFMS" value={count(drawn)} provenance={provenance(stamp)} />
      <MetricCard label="Remaining" value={count(remaining)} progress={{ value: drawn - remaining, max: Math.max(1, drawn) }} provenance={provenance(stamp)} />
      <MetricCard label={`Pools With ${lowLabel}`} value={count(low.length)} tone={low.length > 0 ? "warning" : undefined} provenance={provenance(stamp)} />
    </div>
  );

  return (
    <WorklistScreen<PoolRow>
      {...frame}
      summary={<div className="space-y-5">{ctx.tabs}{!frame.loading && all.length > 0 ? summary : null}</div>}
      columns={columns}
      rows={all}
      getRowId={(r) => `${r.pdCode}-${r.financialYear}`}
      noun="pool"
      activeFilterCount={scheme ? 1 : 0}
      onClearFilters={ctx.clearScheme}
      filters={ctx.schemeFilter}
      copy={filteredCopy("Loading the claim reference pool", "No Claim Reference Numbers Drawn", "No claim reference numbers have been drawn from PFMS yet.")}
    />
  );
}

/* ── f. Turnaround ────────────────────────────────────────────────────────── */

function TurnaroundReport({ ctx }: { ctx: ReportContext }) {
  const { pfms, scheme, frame, stamp, ngoName, appOf } = ctx;
  const all = React.useMemo(
    () => turnaround(pfms.advices.filter((a) => !scheme || a.schemeCode === scheme), (appId) => appOf(appId)?.sanction?.sanctionedAt),
    [pfms, scheme, appOf],
  );
  const files = all.reduce((s, r) => s + r.count, 0);

  const columns: WorklistColumn<TurnaroundRow>[] = [
    { key: "scheme", header: "Scheme", priority: 1, sortable: true, sortValue: (r) => schemeLabel(r.schemeCode), exportValue: (r) => schemeLabel(r.schemeCode), render: (r) => <span className="font-semibold text-ink">{schemeLabel(r.schemeCode)}</span> },
    { key: "count", header: "Files Paid", priority: 2, align: "end", sortable: true, sortValue: (r) => r.count, exportValue: (r) => String(r.count), render: (r) => count(r.count) },
    { key: "average", header: "Average Days", priority: 2, align: "end", sortable: true, sortValue: (r) => r.averageDays, exportValue: (r) => String(r.averageDays), render: (r) => count(r.averageDays) },
    {
      key: "longest",
      header: "Longest",
      priority: 2,
      sortable: true,
      sortValue: (r) => r.longestDays,
      exportValue: (r) => `${r.longestDays} ${r.longestAppId}`,
      render: (r) => (
        <span className="block">
          <span className="block tabular-nums text-ink">{plural(r.longestDays, "day")}</span>
          <span className="block text-body-3 text-ink-muted">{ngoName(appOf(r.longestAppId)?.ngoId ?? "")}</span>
          <RowLink href={statusHref(r.longestAppId)} label={r.longestAppId} />
        </span>
      ),
    },
  ];

  const summary = (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
      <MetricCard label="Files Paid" value={count(files)} detail="Sanctioned and credited through PFMS" provenance={provenance(stamp)} />
      <ChartCard title="Average Days from Sanction to Credit" headingLevel={2} provenance={provenance(stamp)}>
        <RankedBarList
          title="Average days from sanction to credit, by scheme"
          items={all.map((r) => ({ label: schemeLabel(r.schemeCode), value: r.averageDays, detail: plural(r.count, "file") }))}
          showRank={false}
          pageSize={6}
          valueFormat={(n) => plural(n, "day")}
        />
      </ChartCard>
    </div>
  );

  return (
    <WorklistScreen<TurnaroundRow>
      {...frame}
      summary={<div className="space-y-5">{ctx.tabs}{!frame.loading && all.length > 0 ? summary : null}</div>}
      columns={columns}
      rows={all}
      getRowId={(r) => r.schemeCode}
      noun="scheme"
      activeFilterCount={scheme ? 1 : 0}
      onClearFilters={ctx.clearScheme}
      filters={ctx.schemeFilter}
      copy={filteredCopy("Loading the turnaround report", "No Grant Credited Yet", "Turnaround is measured once a sanctioned grant has been credited through PFMS.")}
    />
  );
}
