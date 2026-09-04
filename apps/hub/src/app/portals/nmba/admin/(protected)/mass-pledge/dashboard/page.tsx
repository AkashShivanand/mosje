"use client";

// DS Audit — every element imported, none re-implemented:
//   MetricCard ✅ · DashboardGrid ✅ · ChartCard ✅ · BarChart ✅ · DataTable ✅
//   Alert ✅ · Card ✅ · Badge ✅ — all @mosje/design-system.

import { Alert, BarChart, Card, DashboardGrid, DataTable, Icon, MetricCard } from "@mosje/design-system";
import { AdminShell } from "@/components/nmba/admin-shell";
import { VerificationBadge } from "@/components/nmba/mass-pledge/status-badge";
import { usePortalSession } from "@/lib/nmba/committee/session-context";
import { useMassPledgeStore } from "@/lib/nmba/mass-pledge/store";
import { EVENT_DATE_LABEL } from "@/lib/nmba/mass-pledge/masters";
import { visibleSubmissions } from "@/lib/nmba/mass-pledge/workflow";
import {
  computeTotal,
  REPORTER_LABEL,
  sumTotals,
  type MassPledgeSubmission,
} from "@/lib/nmba/mass-pledge/types";

// Pure rollups, kept at module scope so React Compiler can memoise the
// component without hand-written useMemo fighting it.
function rollupByState(submissions: MassPledgeSubmission[]): StateRow[] {
  const map = new Map<string, StateRow>();
  for (const s of submissions) {
    if (!s.state) continue;
    const row = map.get(s.state) ?? { state: s.state, reports: 0, participants: 0 };
    row.reports += 1;
    row.participants += computeTotal(s.counts);
    map.set(s.state, row);
  }
  return [...map.values()].sort((a, b) => b.participants - a.participants);
}

function rollupByMinistry(submissions: MassPledgeSubmission[]): MinistryRow[] {
  const map = new Map<string, MinistryRow>();
  for (const s of submissions) {
    const ministry = s.coordinatingMinistry;
    if (!ministry) continue;
    const row = map.get(ministry) ?? { ministry, events: 0, participants: 0 };
    row.events += 1;
    row.participants += computeTotal(s.counts);
    map.set(ministry, row);
  }
  return [...map.values()].sort((a, b) => b.participants - a.participants);
}

function sumBuckets(submissions: MassPledgeSubmission[]) {
  return submissions.reduce(
    (acc, s) => ({
      youth: acc.youth + s.counts.youth,
      women: acc.women + s.counts.women,
      others: acc.others + s.counts.others,
    }),
    { youth: 0, women: 0, others: 0 },
  );
}

// Type aliases, not interfaces: DataTable constrains its row to
// `Record<string, unknown>`, and only type aliases get an implicit index signature.
type StateRow = {
  state: string;
  reports: number;
  participants: number;
};

type MinistryRow = {
  ministry: string;
  events: number;
  participants: number;
};

export default function MassPledgeDashboardPage() {
  const session = usePortalSession();
  const { submissions } = useMassPledgeStore();

  const scoped = visibleSubmissions(submissions, session);
  const approved = scoped.filter((s) => s.status === "APPROVED");
  const pending = scoped.filter((s) => s.status === "PENDING_DISTRICT" || s.status === "PENDING_STATE");
  const returned = scoped.filter((s) => s.status === "RETURNED");

  const verified = approved.filter((s) => s.verification === "VERIFIED");
  const selfDeclared = approved.filter((s) => s.verification === "SELF_DECLARED");

  const nationalTotal = sumTotals(approved);
  const pendingTotal = sumTotals(pending);

  // Per-state rollup (assumption A3: tiers are additive) and ministry
  // attribution (assumption A2: attribution, never a total of its own).
  const byState = rollupByState(verified);
  const byMinistry = rollupByMinistry(verified);
  const bucketTotals = sumBuckets(approved);

  const fmt = (n: number) => n.toLocaleString("en-IN");

  return (
    <AdminShell>
      <header className="mb-8">
        <p className="text-label-3 uppercase text-ink-hint">
          Nasha Mukt Bharat Abhiyaan
        </p>
        <h1 className="mt-1 text-headline-1 text-ink">Mass Pledge dashboard</h1>
        <p className="mt-1 text-body-2 text-ink-muted">
          National Pledge Against Drug Abuse · {EVENT_DATE_LABEL}
        </p>
      </header>

      <Alert status="info" className="mb-6">
        Only approved figures are counted below. Reports still moving through the approval chain are
        shown separately and are not part of the total.
      </Alert>

      <DashboardGrid className="mb-8">
        <MetricCard
          label="Total participants (approved)"
          value={fmt(nationalTotal)}
          icon={<Icon name="group" size={20} />}
        />
        <MetricCard
          label="Approved reports"
          value={fmt(approved.length)}
          icon={<Icon name="volunteer_activism" size={20} />}
        />
        {/* `changeLabel` is not used here: it renders a direction prefix
            ("No change:") that reads as nonsense for a static footnote. */}
        <MetricCard
          label={`Awaiting approval · ${fmt(pendingTotal)} participants not yet counted`}
          value={fmt(pending.length)}
          icon={<Icon name="hourglass_empty" size={20} />}
        />
        <MetricCard
          label="Returned for correction"
          value={fmt(returned.length)}
          icon={<Icon name="account_balance" size={20} />}
        />
      </DashboardGrid>

      {/* Assumption A8 made structural: the two provenances never merge. */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-title-2 text-ink">Verified through approval chain</h2>
              <VerificationBadge verification="VERIFIED" />
            </div>
            <p className="text-headline-2 tabular-nums text-navy">{fmt(sumTotals(verified))}</p>
            <p className="mt-1 text-body-3 text-ink-muted">
              {verified.length} report{verified.length === 1 ? "" : "s"} from States, Districts and
              Blocks
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-title-2 text-ink">Self-declared</h2>
              <VerificationBadge verification="SELF_DECLARED" />
            </div>
            <p className="text-headline-2 tabular-nums text-ink">{fmt(sumTotals(selfDeclared))}</p>
            <p className="mt-1 text-body-3 text-ink-muted">
              {selfDeclared.length} report{selfDeclared.length === 1 ? "" : "s"} from Ministries,
              Spiritual Organisations, Institutions and GIAs
            </p>
          </div>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <BarChart
          title="Participation by category"
          caption="The three categories do not overlap, so they sum to the total."
          data={[
            { label: "Youth (under 30)", value: bucketTotals.youth },
            { label: "Women (30+)", value: bucketTotals.women },
            { label: "Others", value: bucketTotals.others },
          ]}
        />

        {byState.length > 0 && (
          <BarChart
            title="Top States/UTs"
            caption="Approved, chain-verified figures only."
            orientation="horizontal"
            data={byState.slice(0, 6).map((r) => ({ label: r.state, value: r.participants }))}
          />
        )}
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-headline-3 text-ink">State / UT rollup</h2>
        <DataTable<StateRow>
          data={byState}
          total={byState.length}
          emptyLabel="No approved State/UT figures yet."
          caption="Approved Mass Pledge participation by State/UT"
          columns={[
            { key: "state", header: "State / UT" },
            { key: "reports", header: "Reports" },
            {
              key: "participants",
              header: "Participants",
              render: (row) => fmt(row.participants),
            },
          ]}
        />
      </div>

      <div>
        <h2 className="mb-1 flex items-center gap-2 text-headline-3 text-ink">
          Coordinating ministry attribution
        </h2>
        <p className="mb-3 text-body-2 text-ink-muted">
          Events organised by States, Districts and Blocks, grouped by the ministry that coordinated
          them. These figures are already counted in the State rollup above and are shown here for
          attribution only. They are not added to any ministry&rsquo;s own self-declared total.
        </p>
        <DataTable<MinistryRow>
          data={byMinistry}
          total={byMinistry.length}
          emptyLabel="No approved events with a coordinating ministry yet."
          caption="Events attributed to coordinating ministries"
          columns={[
            { key: "ministry", header: "Coordinating ministry" },
            { key: "events", header: "Events" },
            {
              key: "participants",
              header: "Participants (already counted above)",
              render: (row) => fmt(row.participants),
            },
          ]}
        />
      </div>

      <p className="mt-8 text-body-3 text-ink-hint">
        Reporter categories in this rollup:{" "}
        {Object.values(REPORTER_LABEL).join(" · ")}
      </p>
    </AdminShell>
  );
}
