"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
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
import { ngoActionApplications, notificationItems } from "@/lib/e-anudaan/notifications";
import { usePreviousVisit } from "@/lib/e-anudaan/last-visit";
import { PendingActions } from "@/components/e-anudaan/pending-actions";
import { routeLinksWithin, routeOnClick } from "@/components/e-anudaan/ngo-shell";

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

const CRORE = 1_00_00_000;
const LAKH = 1_00_000;
const crore = (n: number) => `₹${(n / CRORE).toFixed(2)} Cr`;

/** A figure inside a summary list — large enough to read as the answer, without a box around it. */
function Amount({ children, tone }: { children: React.ReactNode; tone?: "success" }) {
  return (
    <span className={`text-headline-4 font-semibold tabular-nums ${tone === "success" ? "text-[var(--sa-text-status-success-base)]" : "text-ink"}`}>
      {children}
    </span>
  );
}

/** "Application moved forward (3), Application sanctioned (1)" — one phrase per kind, never a list of repeats. */
function summariseUpdates(actions: string[]): string {
  const counts = new Map<string, number>();
  for (const a of actions) counts.set(a, (counts.get(a) ?? 0) + 1);
  return [...counts.entries()].map(([a, n]) => `${a} (${n})`).join(", ");
}

/**
 * NGO Dashboard — one consolidated page for an organisation that runs several projects.
 *
 * Design review of 15 Sep 2026, against the call of 11 Sep (T38–93):
 *  • Pending Actions stays first: it is the only part of the page that asks the applicant to act.
 *  • "Very boxy" (T93) — tiles inside cards inside cards. The Financial Summary and the scheme
 *    list are now lists inside ONE card each; only the KPI row is tiles.
 *  • Every money figure counts SUBMITTED applications. A draft has asked the Ministry for
 *    nothing, and counting 13 of them put ₹ they never requested into "Total Requested" and
 *    halved the sanction ratio.
 *  • The summary was badged "FY 2026-27" while summing every year. It says what it sums now.
 *  • Recent Applications are the most recently UPDATED, newest first — the list was the first
 *    five in store order, under a heading that said "recent".
 */
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

  /* ONE set per question, and every figure that answers it reads that set — the count on the
     tile and the amount in the summary cannot describe two different groups of files. */
  const submitted = apps.filter((a) => a.status !== "Draft");
  const draftCount = totalAppsCount - submitted.length;
  // Counted with the same label the breakdown below uses, so the card and the breakdown agree
  // (the panel of 13 Sep 2026 found "In Review 23" beside a breakdown reading 19).
  const withMinistry = apps.filter((a) => {
    const l = ngoStatusLabel(a);
    return l === "In Review" || l === "Submitted";
  });
  const sanctioned = apps.filter((a) => a.sanction);
  // The bell's "Action Needed" reads the same selector, so this card and the bell cannot disagree.
  const needsActionCount = React.useMemo(() => ngoActionApplications(state), [state]).length;
  // Since Your Last Visit — updates newer than the previous sign-in. Action items are not
  // repeated here: Pending Actions already carries them.
  const previousVisit = usePreviousVisit("ngo");
  const updatesSinceVisit = React.useMemo(
    () =>
      previousVisit
        ? notificationItems(state, "ngo").filter((n) => !n.actionRequired && Date.parse(n.at) > Date.parse(previousVisit))
        : [],
    [state, previousVisit],
  );

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

  /** Every correction the Ministry is waiting on — drives the Pending Actions panel. */
  const pending = React.useMemo(() => (ngo ? openDeficiencies(state, ngo.id) : []), [state, ngo]);
  const pendingItems = pending.reduce((n, d) => n + d.items.length - d.corrected, 0);

  const totalRequested = submitted.reduce((a, x) => a + x.total, 0);
  const totalSanctioned = sanctioned.reduce((a, x) => a + (x.sanction?.total ?? 0), 0);
  const withMinistryAmount = withMinistry.reduce((a, x) => a + x.total, 0);
  const avgSanctionLakhs = sanctioned.length ? (totalSanctioned / sanctioned.length / LAKH).toFixed(2) : "0.00";
  const sanctionedPercent = totalRequested ? Math.round((totalSanctioned / totalRequested) * 100) : 0;

  // One row per scheme the applicant has actually applied under, in descending volume.
  const activeSchemes = React.useMemo(() => {
    const byScheme = new Map<string, { count: number; requested: number; sanctioned: number }>();
    for (const a of apps) {
      const cur = byScheme.get(a.schemeCode) ?? { count: 0, requested: 0, sanctioned: 0 };
      cur.count += 1;
      // Drafts count as applications under the scheme, but not as money requested from it.
      if (a.status !== "Draft") cur.requested += a.total;
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
        requested: v.requested,
        sanctioned: v.sanctioned,
        percent: v.requested ? Math.round((v.sanctioned / v.requested) * 100) : 0,
      }));
  }, [apps]);

  const idleSchemes = Object.entries(SCHEME_TITLES)
    .filter(([code]) => !activeSchemes.some((s) => s.code === code))
    .map(([code, v]) => ({ code, title: v.title, subtitle: v.subtitle }));

  const recent = React.useMemo(
    () => [...apps].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 5),
    [apps],
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Dashboard"
        meta={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-3 text-ink-muted">
            <span className="text-body-2 font-semibold text-ink">{ngoName}</span>
            <Badge status="success">DARPAN Verified</Badge>
            <span className="text-line" aria-hidden>•</span>
            <span className="flex items-center gap-1 text-ink">
              <Icon name="verified_user" size={16} className="text-primary shrink-0" aria-hidden />
              DARPAN ID: {ngo?.darpanId ?? "MH/2016/100000"}
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

      {/* Directly under the header, because it is the only part of this page that asks the
          applicant to do something. Several applications, several items each (T43–54). */}
      <PendingActions items={pending} />

      {/* An applicant signs in a few times a year and was not here when these arrived; the bell
          only reaches a reader already on the page. Shown only when something did change. */}
      {previousVisit && updatesSinceVisit.length > 0 && (
        <Alert
          status="info"
          title={`Since Your Last Visit on ${formatDate(previousVisit)}`}
          action={
            <Link href="/portals/e-anudaan/ngo/notifications" onClick={routeOnClick(router, "/portals/e-anudaan/ngo/notifications")}>
              View Notifications
            </Link>
          }
        >
          <p className="text-body-2 text-ink">
            {updatesSinceVisit.length} update{updatesSinceVisit.length === 1 ? "" : "s"} to your applications:{" "}
            {summariseUpdates(updatesSinceVisit.map((n) => n.action))}.
          </p>
        </Alert>
      )}

      {/* Captions ride in `detail`, not `changeLabel`. A change label draws a trend mark — a dash
          announced as "No change" — and dropped the "7 items" figure it was given; an arrow on a
          running total read as growth. None of these four is a change over time. */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Applications"
          value={String(totalAppsCount)}
          detail={`${submitted.length} submitted · ${draftCount} draft${draftCount === 1 ? "" : "s"}`}
          icon={<Icon name="description" size={20} aria-hidden />}
          {...(submittedThisMonth > 0
            ? { changeValue: `+${submittedThisMonth}`, changeLabel: "this month", changeDirection: "up" as const }
            : {})}
        />
        <MetricCard
          label="With the Ministry"
          value={String(withMinistry.length)}
          detail="Submitted or in review"
          icon={<Icon name="schedule" size={20} aria-hidden />}
        />
        <MetricCard
          label="Action Required"
          value={String(needsActionCount)}
          detail={`${pendingItems} correction${pendingItems === 1 ? "" : "s"} to make`}
          /* No warning fill. Pending Actions, directly above, is where the applicant acts; an amber
             tile beside three white ones became the loudest thing on the page and pulled the eye
             away from the list that holds the Resolve buttons (design review, 16 Sep 2026). */
          icon={<Icon name="error" size={20} aria-hidden />}
        />
        <MetricCard
          label="Sanctioned Grants"
          value={String(sanctioned.length)}
          detail={`${crore(totalSanctioned)} sanctioned`}
          icon={<Icon name="verified" size={20} aria-hidden />}
        />
      </div>

      {/* THE SUMMARY ROW, 5 : 7. The donut and its legend are a fixed height; the money column
          holds the totals AND the per-scheme split, which is money too — so the two cards end
          level instead of each leaving a band of empty card (design review, 16 Sep 2026). */}
      <div className="grid items-stretch gap-6 lg:grid-cols-12">
        <Card variant="outlined" aria-labelledby="app-status-title" className="lg:col-span-5">
          <CardBody className="gap-4 p-6">
            <SectionTitle headingId="app-status-title" title="Application Status Breakdown" />

            {/* The chart and its own legend only. A list beside it repeated the legend, and a
                "Highest Allocation" line repeated the list's first row (removed on confirmation,
                15 Sep 2026); the per-status counts remain in the chart's "View as Table". */}
            <div className="flex flex-1 items-center justify-center py-2">
              <div className="w-[260px] max-w-full">
                <DonutChart
                  title="Application Status Distribution"
                  data={donutChartData}
                  center={String(totalAppsCount)}
                  centerSub="Applications"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined" aria-labelledby="financial-summary-title" className="lg:col-span-7">
          <CardBody className="gap-5 p-6">
            {/* Every financial year: the store holds files from 2024-25 to 2026-27, and all of
                them are summed. A single-year badge here was a false label. */}
            <SectionTitle headingId="financial-summary-title" title="Financial Summary">
              <Badge status="neutral">All Financial Years</Badge>
            </SectionTitle>

            <DescriptionList
              columns={2}
              divided
              items={[
                { term: "Total Requested", value: <Amount>{crore(totalRequested)}</Amount>, hint: `${submitted.length} submitted applications` },
                { term: "Total Sanctioned", value: <Amount tone="success">{crore(totalSanctioned)}</Amount>, hint: `${sanctioned.length} sanctioned grants` },
                { term: "With the Ministry", value: <Amount>{crore(withMinistryAmount)}</Amount>, hint: `${withMinistry.length} applications submitted or in review` },
                { term: "Average Grant Size", value: <Amount>{`₹${avgSanctionLakhs} L`}</Amount>, hint: "Per sanctioned grant" },
              ]}
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-body-2">
                <span className="font-semibold text-ink-muted">Sanctioned Against Requested</span>
                <span className="font-bold text-[var(--sa-text-status-success-base)]">{sanctionedPercent}%</span>
              </div>
              <Progress label="Sanctioned against requested" value={sanctionedPercent} tone="success" compact />
            </div>

            <div className="space-y-1">
              <SectionTitle as={3} eyebrow="By Scheme" />
              <ListGroup divided size="sm" aria-label="Money by scheme">
                {activeSchemes.map((s) => (
                  <ListRow
                    key={s.code}
                    title={s.title}
                    trailing={
                      s.requested > 0 ? (
                        <span className="tabular-nums font-semibold text-[var(--sa-text-status-success-base)]">{s.percent}%</span>
                      ) : undefined
                    }
                    /* No scheme badge: it printed the stored code ("SHRESHTA_M2") under the scheme's
                       own name, saying the same thing twice and the second time in code. */
                    description={
                      <span className="block space-y-1.5">
                        <span className="block">{s.subtitle}</span>
                        {s.requested > 0 ? (
                          <>
                            <span className="block tabular-nums">
                              {s.count} {s.count === 1 ? "application" : "applications"} · Requested{" "}
                              <strong className="text-ink">{crore(s.requested)}</strong> · Sanctioned{" "}
                              <strong className="text-[var(--sa-text-status-success-base)]">{crore(s.sanctioned)}</strong>
                            </span>
                            <Progress label={`${s.title}: sanctioned against requested`} value={s.percent} tone="success" compact />
                          </>
                        ) : (
                          /* Every file under the scheme is a draft: an empty bar beside "₹0.00 Cr"
                             said "nothing sanctioned" when nothing has been asked for. */
                          <span className="block">
                            {s.count} {s.count === 1 ? "draft" : "drafts"}, none submitted yet
                          </span>
                        )}
                      </span>
                    }
                  />
                ))}
                {idleSchemes.map((s) => (
                  <ListRow key={s.code} title={s.title} description={`${s.subtitle} · No applications yet`} />
                ))}
              </ListGroup>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Above the reference panels: these rows open the applicant's own files, which is the
          next thing an applicant does after Pending Actions. */}
      <Card variant="outlined" aria-labelledby="recent-apps-title">
        <CardBody className="gap-4 p-6">
          <SectionTitle headingId="recent-apps-title" title="Recent Applications">
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

          {/* The whole row is the link (ListRow `href`), so five outlined "Details" buttons no longer
              stack down the right edge. The wrapper hands the click to the router. */}
          <div onClick={routeLinksWithin(router)}>
            <ListGroup divided aria-label="Recent applications">
              {recent.map((appRow) => {
                const scheme = SCHEME_TITLES[appRow.schemeCode]?.title ?? appRow.schemeCode;
                return (
                  <ListRow
                    key={appRow.id}
                    // The reference carries slashes, so it is encoded — the unencoded link opened
                    // a route that does not exist.
                    href={`/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(appRow.id)}`}
                    title={appRow.projectLabel || "Project"}
                    description={
                      <>
                        {scheme} · <span className="font-mono">{appRow.institutionId || appRow.id}</span>
                      </>
                    }
                    trailing={
                      <span className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-body-2">
                        <Badge status={statusTone(appRow.status as AppStatus)}>{ngoStatusLabel(appRow)}</Badge>
                        <span className="tabular-nums text-ink">{formatGrant(appRow.total)}</span>
                        <span className="text-ink-muted">Updated {formatDate(appRow.updatedAt)}</span>
                        <Icon name="chevron_right" size={20} aria-hidden />
                      </span>
                    }
                  />
                );
              })}
            </ListGroup>
          </div>
        </CardBody>
      </Card>

      {/* Reference, not work: last on the page, full width in three columns so its thirteen
          fields take five rows instead of seven. */}
      <Card variant="outlined" aria-labelledby="org-profile-title">
        <CardBody className="gap-4 p-6">
          {/* No "DARPAN Synced" badge: the header already says "DARPAN Verified". */}
          <SectionTitle headingId="org-profile-title" title="Organisation Profile" />

          {/* Thirteen separate rows, exactly as the live DARPAN read-back lists them — State and
              District, Registration No. and Date, and Secretary and Treasurer are each their own
              row on the live portal rather than being paired up. */}
          <DescriptionList
            columns={3}
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
    </div>
  );
}
