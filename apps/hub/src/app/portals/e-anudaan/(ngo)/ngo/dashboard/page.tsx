"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardBody,
  DescriptionList,
  DonutChart,
  Icon,
  Link,
  ListGroup,
  ListRow,
  MetricCard,
  PageHeader,
  Progress,
  SectionTitle,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatGrant, ngoApplications, ngoStatusLabel, statusTone } from "@/lib/e-anudaan/selectors";
import type { AppStatus } from "@/lib/e-anudaan/types";
import { openDeficiencies } from "@/lib/e-anudaan/applicant";
import { formatTime } from "@/lib/e-anudaan/format";
import { PendingActions } from "@/components/e-anudaan/pending-actions";
import { routeOnClick } from "@/components/e-anudaan/ngo-shell";

/**
 * One colour per status, used by BOTH the donut and its legend. The donut picked categorical
 * colours (In Review red, Action Required green) while the legend asked for classes that do not
 * exist, so the chart said one thing and its key said nothing (screen audit, 14 Sep 2026).
 */
const STATUS_TONE: Record<string, string> = {
  Sanctioned: "var(--sa-bg-status-success-bolder)",
  "Action Required": "var(--sa-bg-status-warning-bolder)",
  "In Review": "var(--sa-bg-status-info-bolder)",
  Submitted: "var(--sa-bg-status-info-bold)",
  Draft: "var(--sa-icon-neutral-subtler)",
  "Query / Returned": "var(--sa-bg-status-warning-bold)",
  "Closed / Rejected": "var(--sa-bg-status-error-bolder)",
};

/** Display names for the four schemes the NGO portal offers. */
const SCHEME_TITLES: Record<string, { title: string; subtitle: string }> = {
  SHRESHTA_M2: { title: "SHRESHTA Mode 2", subtitle: "Grant-in-Aid for SC Residential Schools" },
  AVYAY: { title: "AVYAY (Atal Vayo Abhyuday Yojana)", subtitle: "Integrated Programme for Senior Citizens" },
  NAPDDR: { title: "NAPDDR", subtitle: "Drug Demand Reduction & Social Re-integration" },
  SMILE: { title: "SMILE (Garima Greh)", subtitle: "Shelter Homes for Transgender Persons" },
};


export default function NgoDashboardPage() {
  const { state } = useEAnudaan();
  const router = useRouter();
  const ngo = state.ngos[0];
  // Memoised so the aggregations below keep a stable dependency across renders.
  const apps = React.useMemo(() => (ngo ? ngoApplications(state, ngo.id) : []), [state, ngo]);

  // No greeting. The account is an organisation, and "Good evening, Sankalp Seva Sansthan"
  // greets a registered society as if it were a person — the page is titled by what it is,
  // and the organisation is named beside its DARPAN record (decided 14 Sep 2026).
  const ngoName = ngo?.name ?? "Sankalp Seva Sansthan";

  // Everything below is DERIVED, never hardcoded. Submitting an application on the live portal
  // moves the KPI row, the donut and the money at once (verified 2026-08-22: 71 → 72 total,
  // Submitted 4 → 5), so the clone recomputes from the store rather than printing fixed figures.
  const totalAppsCount = apps.length;
  // Counted with the same label the breakdown below uses, so the card and the breakdown agree
  // (the panel of 13 Sep 2026 found "In Review 23" beside a breakdown reading 19).
  const inReviewCount = apps.filter((a) => {
    const l = ngoStatusLabel(a);
    return l === "In Review" || l === "Submitted";
  }).length;
  const needsActionCount = apps.filter((a) => a.status === "DeficiencyRaised").length;
  const sanctionedCount = apps.filter((a) => a.sanction).length;

  const donutChartData = React.useMemo(() => {
    const buckets = new Map<string, number>([
      ["Sanctioned", 0],
      ["Action Required", 0],
      ["In Review", 0],
      ["Draft", 0],
      ["Submitted", 0],
      ["Query / Returned", 0],
      ["Closed / Rejected", 0],
    ]);
    for (const a of apps) {
      const label = ngoStatusLabel(a) === "Approved" ? "Sanctioned" : ngoStatusLabel(a);
      buckets.set(label, (buckets.get(label) ?? 0) + 1);
    }
    return [...buckets.entries()].filter(([, v]) => v > 0).map(([label, value]) => ({ label, value, color: STATUS_TONE[label] }));
  }, [apps]);

  /** Applications submitted in the current calendar month — the KPI row's delta. */
  const submittedThisMonth = React.useMemo(() => {
    const now = new Date();
    return apps.filter((a) => {
      if (!a.submittedAt) return false;
      const d = new Date(a.submittedAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }, [apps]);

  const topBucket = [...donutChartData].sort((a, b) => b.value - a.value)[0];

  /** Every correction the Ministry is waiting on — drives the Pending Actions panel. */
  const pending = React.useMemo(() => (ngo ? openDeficiencies(state, ngo.id) : []), [state, ngo]);
  const pendingItems = pending.reduce((n, d) => n + d.items.length, 0);

  const CRORE = 1_00_00_000;
  const LAKH = 1_00_000;
  const totalRequested = apps.reduce((a, x) => a + x.total, 0);
  const totalSanctioned = apps.reduce((a, x) => a + (x.sanction?.total ?? 0), 0);
  const inReviewAmount = apps
    .filter((a) => a.holder.kind === "chain" || a.holder.kind === "pd")
    .reduce((a, x) => a + x.total, 0);

  const totalRequestedCr = (totalRequested / CRORE).toFixed(2);
  const totalSanctionedCr = (totalSanctioned / CRORE).toFixed(2);
  const inReviewAmountCr = (inReviewAmount / CRORE).toFixed(2);
  const avgSanctionLakhs = sanctionedCount ? (totalSanctioned / sanctionedCount / LAKH).toFixed(2) : "0.00";
  const sanctionedPercent = totalRequested ? Math.round((totalSanctioned / totalRequested) * 100) : 0;

  // One card per scheme the applicant has actually applied under, in descending volume.
  const activeSchemes = React.useMemo(() => {
    const byScheme = new Map<string, { count: number; requested: number; sanctioned: number }>();
    for (const a of apps) {
      const cur = byScheme.get(a.schemeCode) ?? { count: 0, requested: 0, sanctioned: 0 };
      cur.count += 1;
      cur.requested += a.total;
      cur.sanctioned += a.sanction?.total ?? 0;
      byScheme.set(a.schemeCode, cur);
    }
    return [...byScheme.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([code, v]) => ({
        code,
        title: SCHEME_TITLES[code]?.title ?? code,
        subtitle: SCHEME_TITLES[code]?.subtitle ?? "",
        count: v.count,
        requestedCr: (v.requested / CRORE).toFixed(2),
        sanctionedCr: (v.sanctioned / CRORE).toFixed(2),
        percent: v.requested ? Math.round((v.sanctioned / v.requested) * 100) : 0,
      }));
  }, [apps]);

  const idleSchemes = Object.entries(SCHEME_TITLES)
    .filter(([code]) => !activeSchemes.some((s) => s.code === code))
    .map(([code, v]) => ({ code, title: v.title, subtitle: v.subtitle }));

  return (
    <div className="space-y-6 pb-8">
      {/* ── 1. DASHBOARD HEADER & CONTEXT COMMAND BAR ────────────────────── */}
      <PageHeader
        title="Dashboard"
        meta={
          <span className="flex flex-wrap items-center gap-3 text-body-3 text-ink-muted">
            <span className="text-body-2 font-semibold text-ink">{ngoName}</span>
            <Badge status="success">DARPAN Verified</Badge>
            <span className="text-line" aria-hidden>•</span>
            <span className="flex items-center gap-1 font-mono font-semibold text-ink">
              <Icon name="verified_user" size={16} className="text-primary shrink-0" aria-hidden />
              DARPAN ID: {ngo?.darpanId ?? "MH/2016/100000"}
            </span>
            <span className="text-line" aria-hidden>•</span>
            <span className="flex items-center gap-1">
              <Icon name="schedule" size={16} className="text-ink-muted shrink-0" aria-hidden />
              Last updated{" "}
              {formatDate(new Date())} at {formatTime(new Date())}
            </span>
          </span>
        }
        actions={
          <>
            <Button appearance="outlined" size="md" onClick={() => router.push("/portals/e-anudaan/ngo/my-applications")}>
              <Icon name="folder_open" size={16} aria-hidden /> My Applications
            </Button>
            <Button appearance="filled" size="md" onClick={() => router.push("/portals/e-anudaan/apply-grant")}>
              <Icon name="add" size={16} aria-hidden /> Apply for Grant
            </Button>
          </>
        }
      />

      {/* ── 2. PENDING ACTIONS ───────────────────────────────────────────── */}
      {/* Directly under the greeting, because it is the only part of this page that asks the
          applicant to do something. Several applications, several items each (T43–54). */}
      <PendingActions items={pending} />

      {/* ── 3. KPI METRIC CARDS ROW (100% UNIFIED SAMAVESH COMPONENTS) ────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Applications"
          value={String(totalAppsCount)}
          // No change badge when nothing changed: a green "+0" reads as growth.
          changeValue={submittedThisMonth > 0 ? `+${submittedThisMonth}` : undefined}
          changeLabel={submittedThisMonth > 0 ? "this month" : "none submitted this month"}
          changeDirection={submittedThisMonth > 0 ? "up" : undefined}
          icon={<Icon name="description" size={20} aria-hidden />}
        />
        <MetricCard
          label="With the Ministry"
          value={String(inReviewCount)}
          changeLabel="submitted or in review"
          icon={<Icon name="schedule" size={20} aria-hidden />}
        />
        <MetricCard
          label="Action Required"
          value={String(needsActionCount)}
          changeValue={`${pendingItems} item${pendingItems === 1 ? "" : "s"}`}
          changeLabel="to correct"
          changeDirection="flat"
          icon={<Icon name="error" size={20} aria-hidden />}
        />
        <MetricCard
          label="Sanctioned Grants"
          value={String(sanctionedCount)}
          changeValue={`₹${totalSanctionedCr} Cr`}
          changeLabel="approved"
          changeDirection="up"
          icon={<Icon name="verified" size={20} aria-hidden />}
        />
      </div>

      {/* ── 4. MIDDLE ROW: APPLICATION STATUS & FINANCIAL SUMMARY ──────────── */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        {/* Application Status Card — Compact Donut Chart */}
        <Card variant="outlined" aria-labelledby="app-status-title">
          <CardBody className="justify-between gap-4 p-6">
            <SectionTitle headingId="app-status-title" title="Application Status Breakdown" />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-2">
              {/* Compact Donut Canvas */}
              <div className="sm:col-span-6 flex justify-center">
                <div className="w-[180px] max-w-full">
                  <DonutChart
                    title="Application Status Distribution"
                    data={donutChartData}
                    center={String(totalAppsCount)}
                    centerSub="Applications"
                  />
                </div>
              </div>

              {/* Detailed Status Breakdown Matrix — the colour key is the chart's own legend. */}
              <div className="sm:col-span-6">
                <DescriptionList
                  aria-label="Status Breakdown"
                  columns={1}
                  layout="inline"
                  size="sm"
                  divided
                  items={[...donutChartData]
                    .sort((a, b) => b.value - a.value)
                    .map((item) => ({
                      term: item.label,
                      value: `${item.value} (${((item.value / Math.max(totalAppsCount, 1)) * 100).toFixed(1)}%)`,
                    }))}
                />
              </div>
            </div>

            <DescriptionList
              columns={1}
              layout="inline"
              size="sm"
              items={[
                {
                  term: "Highest Allocation",
                  value: topBucket ? `${topBucket.label} (${Math.round((topBucket.value / Math.max(totalAppsCount, 1)) * 1000) / 10}%)` : "—",
                },
              ]}
            />
          </CardBody>
        </Card>

        {/* Financial Summary Card */}
        <Card variant="outlined" aria-labelledby="financial-summary-title">
          <CardBody className="justify-between gap-4 p-6">
            <SectionTitle headingId="financial-summary-title" title="Financial Summary">
              <Badge status="info">FY 2026-27</Badge>
            </SectionTitle>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Total Requested" value={`₹${totalRequestedCr} Cr`} detail={`${totalAppsCount} applications total`} />
              <MetricCard label="Total Sanctioned" value={`₹${totalSanctionedCr} Cr`} detail={`${sanctionedCount} approved grants`} />
              <MetricCard label="Pending Review" value={`₹${inReviewAmountCr} Cr`} detail={`${inReviewCount} active files in chain`} />
              <MetricCard label="Avg. Grant Size" value={`₹${avgSanctionLakhs} L`} detail="per approved project" />
            </div>

            {/* Progress Bar: Sanctioned vs Requested */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-body-2">
                <span className="font-semibold text-ink-muted">Sanctioned vs Requested Budget</span>
                <span className="font-bold text-[var(--sa-text-status-success-base)]">{sanctionedPercent}% Sanction Ratio</span>
              </div>
              <Progress label="Sanctioned vs Requested Budget" value={sanctionedPercent} tone="success" compact />
            </div>

            <p className="text-body-3 text-ink-muted">
              Sanctioned amount reflects approved grants across all active applications under Ministry of Social Justice &amp; Empowerment schemes.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* ── 5. THIRD ROW: ORGANISATION PROFILE & APPLICATIONS BY SCHEME ─────── */}
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        {/* Organisation Profile Box */}
        <Card variant="outlined" aria-labelledby="org-profile-title">
          <CardBody className="gap-4 p-6">
            <SectionTitle headingId="org-profile-title" title="Organisation Profile">
              <Badge status="neutral">DARPAN Synced</Badge>
            </SectionTitle>

            {/* Thirteen separate rows, exactly as the live DARPAN read-back lists them — State and
                District, Registration No. and Date, and Secretary and Treasurer are each their own
                row on the live portal rather than being paired up. */}
            <DescriptionList
              columns={2}
              size="sm"
              divided
              items={([
                ["Organisation", ngoName],
                ["DARPAN ID", ngo?.darpanId ?? "MH/2016/100000"],
                ["State", ngo?.state ?? "Maharashtra"],
                ["District", ngo?.district ?? "Pune"],
                ["Registration No.", ngo?.registrationNo ?? "51-54"],
                ["Registration Date", ngo?.registrationDate ?? "12 Mar 1978"],
                ["Registered Under", ngo?.registeredUnder ?? "Registrar of Societies"],
                ["Chairman", ngo?.chairman ?? "—"],
                ["Secretary", ngo?.secretary ?? "—"],
                ["Treasurer", ngo?.treasurer ?? "—"],
                ["Authorised User", ngo?.authorisedUser ?? ngoName],
                ["Email", ngo?.email ?? "—"],
                ["Mobile", ngo?.mobile ?? "—"],
              ] as const).map(([term, value]) => ({ term, value }))}
            />
          </CardBody>
        </Card>

        {/* Applications by Scheme Box */}
        <Card variant="outlined" aria-labelledby="apps-by-scheme-title">
          <CardBody className="gap-4 p-6">
            <SectionTitle headingId="apps-by-scheme-title" title="Applications by Scheme">
              <Badge status="neutral">{activeSchemes.length} Schemes</Badge>
            </SectionTitle>

            <SectionTitle as={3} eyebrow="Active Grant Schemes" />
            <ListGroup bordered aria-label="Active Grant Schemes">
              {activeSchemes.map((s) => (
                <ListRow
                  key={s.code}
                  title={s.title}
                  trailing={
                    <Badge status="neutral">
                      {s.count} {s.count === 1 ? "app" : "apps"}
                    </Badge>
                  }
                  /* No scheme badge: it printed the stored code ("SHRESHTA_M2") under the scheme's
                     own name, saying the same thing twice and the second time in code. */
                  description={
                    <span className="block space-y-2">
                      <span className="block">{s.subtitle}</span>
                      <span className="block">
                        Requested: <strong className="text-ink">₹{s.requestedCr} Cr</strong> · Sanctioned: <strong className="text-[var(--sa-text-status-success-base)]">₹{s.sanctionedCr} Cr</strong>
                      </span>
                      <Progress label={`${s.title}: sanctioned against requested`} value={s.percent} tone="success" compact />
                    </span>
                  }
                />
              ))}
            </ListGroup>

            {idleSchemes.length > 0 && (
              <>
                <SectionTitle as={3} eyebrow="Other Available Schemes (0 Applications)" />
                <ListGroup bordered size="sm" aria-label="Other Available Schemes (0 Applications)">
                  {idleSchemes.map((s) => (
                    <ListRow key={s.code} title={s.title} description={s.subtitle} />
                  ))}
                </ListGroup>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      {/* ── 6. BOTTOM SECTION: RECENT APPLICATIONS LEDGER ──────────────────── */}
      <Card variant="outlined" aria-labelledby="recent-apps-title">
        <CardBody className="gap-5 p-6">
          <SectionTitle headingId="recent-apps-title" title="Recent Applications Ledger">
            <Link
              variant="standalone"
              size="sm"
              href="/portals/e-anudaan/ngo/my-applications"
              onClick={routeOnClick(router, "/portals/e-anudaan/ngo/my-applications")}
              iconRight={<Icon name="arrow_forward" size={16} aria-hidden />}
            >
              View All Applications
            </Link>
          </SectionTitle>

          <ListGroup bordered aria-label="Recent applications">
            {apps.slice(0, 5).map((appRow) => {
              const title = `${appRow.projectLabel || "Project"} — ${SCHEME_TITLES[appRow.schemeCode]?.title ?? appRow.schemeCode}`;
              const ref = appRow.institutionId || appRow.id;
              const statusLabel = ngoStatusLabel(appRow);
              const statusKey = appRow.status;
              const requested = formatGrant(appRow.total);
              const updated = formatDate(appRow.submittedAt || new Date().toISOString());

              return (
                <ListRow
                  key={appRow.id}
                  title={title}
                  description={<span className="font-mono">{ref}</span>}
                  trailing={
                    <span className="flex flex-wrap items-center gap-5 text-body-2">
                      <Badge status={statusTone(statusKey as AppStatus)}>{statusLabel}</Badge>
                      <DescriptionList
                        columns={2}
                        size="sm"
                        className="text-right"
                        items={[
                          { term: "Requested", value: requested },
                          { term: "Updated", value: updated },
                        ]}
                      />
                      {/* The reference carries slashes, so it is encoded — the unencoded link opened
                          a route that does not exist. A button, not a button inside a link. */}
                      <Button
                        appearance="outlined"
                        size="sm"
                        aria-label={`Details of ${appRow.id}`}
                        onClick={() => router.push(`/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(appRow.id)}`)}
                      >
                        Details <Icon name="chevron_right" size={16} aria-hidden />
                      </Button>
                    </span>
                  }
                />
              );
            })}
          </ListGroup>
        </CardBody>
      </Card>
    </div>
  );
}


