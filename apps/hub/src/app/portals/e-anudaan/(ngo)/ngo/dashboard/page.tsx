"use client";

import * as React from "react";
import NextLink from "next/link";
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
import { NGO_STATUS_FILTERS, formatDate, formatGrant, ngoApplications, ngoStatusLabel, statusTone } from "@/lib/e-anudaan/selectors";
import type { AppStatus } from "@/lib/e-anudaan/types";
import { openDeficiencies, projectTitleFor } from "@/lib/e-anudaan/applicant";
import { upcomingInstalments, type NextInstalmentNotice } from "@/lib/e-anudaan/instalments";
import { formatMoney } from "@/lib/e-anudaan/format";
import { APPLICANT_STATUS, instalmentLabel } from "@/lib/e-anudaan/glossary";
import { NGO_SCHEMES, ngoScheme } from "@/components/e-anudaan/ngo-schemes";
import { ngoActionApplications, notificationItems } from "@/lib/e-anudaan/notifications";
import { usePreviousVisit } from "@/lib/e-anudaan/last-visit";
import { PendingActions } from "@/components/e-anudaan/pending-actions";
import { routeOnClick } from "@/components/e-anudaan/ngo-shell";

/**
 * One colour per status, used by BOTH the donut and its legend. The donut picked categorical
 * colours (In Review red, Action Required green) while the legend asked for classes that do not
 * exist, so the chart said one thing and its key said nothing (screen audit, 14 Sep 2026).
 */
/*
 * Keyed by the glossary's seven applicant states, so a state the selector can return always has a
 * colour. The map used to carry the retired "Query / Returned" and "Closed / Rejected" and had no
 * "Grant Released" or "Rejected", so those slices drew in the chart's fallback colour with no key
 * (B2 hand-over, 16 Sep 2026).
 */
const STATUS_TONE: Record<string, string> = {
  [APPLICANT_STATUS.draft]: "var(--sa-icon-neutral-subtler)",
  [APPLICANT_STATUS.actionRequired]: "var(--sa-bg-status-warning-bolder)",
  [APPLICANT_STATUS.submitted]: "var(--sa-bg-status-info-bold)",
  [APPLICANT_STATUS.inReview]: "var(--sa-bg-status-info-bolder)",
  [APPLICANT_STATUS.sanctioned]: "var(--sa-bg-status-success-bold)",
  [APPLICANT_STATUS.released]: "var(--sa-bg-status-success-bolder)",
  [APPLICANT_STATUS.rejected]: "var(--sa-bg-status-error-bolder)",
};

/**
 * How many claimable instalments the dashboard lists by name. Above this the block collapses to
 * its two figures and a link to the filtered register (audit N-01).
 */
const CLAIM_ROWS = 3;

/** Where "View All" on the claims block lands: My Applications, filtered to what can be claimed. */
const CLAIMABLE_HREF = "/portals/e-anudaan/ngo/my-applications?claim=ready";

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
    // Every state the selector can return, in the order the My Applications chips list them.
    const buckets = new Map<string, number>(NGO_STATUS_FILTERS.filter((f) => f !== "All").map((f) => [f, 0]));
    for (const a of apps) {
      const label = ngoStatusLabel(a);
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
  /*
   * Only what can be claimed TODAY (audit N-01). The block listed all fourteen projects with a
   * next instalment, twelve of them behind a filled "Claim" button and two that could not be
   * claimed at all, and pushed the organisation's own figures to y≈1,500 (y≈3,300 on a phone).
   * An instalment still waiting on a release is shown where it belongs — on its row in My
   * Applications — not as a to-do on the dashboard. Oldest financial year first: the nearest thing
   * the store holds to a due date.
   */
  const claimable = React.useMemo(
    () =>
      (ngo ? upcomingInstalments(state, ngo.id) : [])
        .filter((n): n is NextInstalmentNotice & { href: string } => !!n.href)
        .sort((a, b) => (a.plan.financialYear ?? "").localeCompare(b.plan.financialYear ?? "") || a.plan.projectId.localeCompare(b.plan.projectId)),
    [state, ngo],
  );
  const claimableAmount = claimable.reduce((n, c) => n + (c.plan.amount ?? 0), 0);
  const pendingItems = pending.reduce((n, d) => n + d.items.length - d.corrected, 0);

  const totalRequested = submitted.reduce((a, x) => a + x.total, 0);
  const totalSanctioned = sanctioned.reduce((a, x) => a + (x.sanction?.total ?? 0), 0);
  const withMinistryAmount = withMinistry.reduce((a, x) => a + x.total, 0);
  const avgSanction = sanctioned.length ? totalSanctioned / sanctioned.length : 0;
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
        title: ngoScheme(code).title,
        subtitle: ngoScheme(code).subtitle,
        count: v.count,
        requested: v.requested,
        sanctioned: v.sanctioned,
        percent: v.requested ? Math.round((v.sanctioned / v.requested) * 100) : 0,
      }));
  }, [apps]);

  const idleSchemes = Object.entries(NGO_SCHEMES)
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
            <span className="flex items-center gap-1 font-semibold tabular-nums text-ink">
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

      {totalAppsCount === 0 ? (
        <FirstApplication />
      ) : (
        <>
      {/* Directly under the header, because it is the only part of this page that asks the
          applicant to do something the Ministry is WAITING on: until a correction is sent, the
          file is held. Several applications, several items each (T43–54). */}
      <PendingActions items={pending} />

      {/* The organisation's own figures come next, not at the foot of a claims list (N-01).
          Captions ride in `detail`, not `changeLabel`. A change label draws a trend mark — a dash
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
          detail={`${formatMoney(totalSanctioned)} sanctioned`}
          icon={<Icon name="verified" size={20} aria-hidden />}
        />
      </div>

      {claimable.length > 0 && <ClaimableInstalments state={state} items={claimable} amount={claimableAmount} router={router} />}

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

      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <Card variant="outlined" aria-labelledby="app-status-title">
          <CardBody className="gap-4 p-6">
            <SectionTitle headingId="app-status-title" title="Application Status Breakdown" />

            {/* The chart and its own legend only. A list beside it repeated the legend, and a
                "Highest Allocation" line repeated the list's first row (removed on confirmation,
                15 Sep 2026); the per-status counts remain in the chart's "View as Table". */}
            <div className="flex justify-center py-2">
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

        <Card variant="outlined" aria-labelledby="financial-summary-title">
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
                { term: "Total Requested", value: <Amount>{formatMoney(totalRequested)}</Amount>, hint: `${submitted.length} submitted applications` },
                { term: "Total Sanctioned", value: <Amount tone="success">{formatMoney(totalSanctioned)}</Amount>, hint: `${sanctioned.length} sanctioned grants` },
                { term: "With the Ministry", value: <Amount>{formatMoney(withMinistryAmount)}</Amount>, hint: `${withMinistry.length} applications submitted or in review` },
                { term: "Average Grant Size", value: <Amount>{formatMoney(avgSanction)}</Amount>, hint: "Per sanctioned grant" },
              ]}
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-body-2">
                <span className="font-semibold text-ink-muted">Sanctioned Against Requested</span>
                <span className="font-bold text-[var(--sa-text-status-success-base)]">{sanctionedPercent}%</span>
              </div>
              <Progress label="Sanctioned against requested" value={sanctionedPercent} tone="success" compact />
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
              stack down the right edge; `linkAs` makes each row a client-side route. */}
          <ListGroup divided aria-label="Recent applications">
              {recent.map((appRow) => {
                const scheme = ngoScheme(appRow.schemeCode).short;
                return (
                  <ListRow
                    linkAs={NextLink}
                    key={appRow.id}
                    // The reference carries slashes, so it is encoded — the unencoded link opened
                    // a route that does not exist.
                    href={`/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(appRow.id)}`}
                    title={appRow.projectLabel || "Project"}
                    description={
                      <>
                        {scheme} · <span className="tabular-nums">{appRow.institutionId || appRow.id}</span>
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
        </CardBody>
      </Card>

        </>
      )}

      {/* A new organisation has only its profile here, so it takes the full width. */}
      <div className={`grid items-stretch gap-6 ${totalAppsCount > 0 ? "lg:grid-cols-2" : ""}`}>
        {totalAppsCount > 0 && (
        <Card variant="outlined" aria-labelledby="apps-by-scheme-title">
          <CardBody className="gap-4 p-6">
            <SectionTitle headingId="apps-by-scheme-title" title="Applications by Scheme">
              <Badge status="neutral">{activeSchemes.length} Schemes</Badge>
            </SectionTitle>

            {/* A divided list inside the card, not a bordered box inside it (T93). */}
            <ListGroup divided aria-label="Schemes applied under">
              {activeSchemes.map((s) => (
                <ListRow
                  key={s.code}
                  title={s.title}
                  trailing={
                    <Badge status="neutral">
                      {s.count} {s.count === 1 ? "application" : "applications"}
                    </Badge>
                  }
                  /* No scheme badge: it printed the stored code ("SHRESHTA_M2") under the scheme's
                     own name, saying the same thing twice and the second time in code. */
                  description={
                    <span className="block space-y-2">
                      <span className="block">{s.subtitle}</span>
                      <span className="block">
                        Requested: <strong className="text-ink">{formatMoney(s.requested)}</strong> · Sanctioned:{" "}
                        <strong className="text-[var(--sa-text-status-success-base)]">{formatMoney(s.sanctioned)}</strong>
                      </span>
                      <Progress label={`${s.title}: sanctioned against requested`} value={s.percent} tone="success" compact />
                    </span>
                  }
                />
              ))}
            </ListGroup>

            {idleSchemes.length > 0 && (
              <>
                <SectionTitle as={3} eyebrow="Not Yet Applied Under" />
                <ListGroup divided size="sm" aria-label="Schemes not yet applied under">
                  {idleSchemes.map((s) => (
                    <ListRow key={s.code} title={s.title} description={s.subtitle} />
                  ))}
                </ListGroup>
              </>
            )}
          </CardBody>
        </Card>
        )}

        <Card variant="outlined" aria-labelledby="org-profile-title">
          <CardBody className="gap-4 p-6">
            {/* No "DARPAN Synced" badge: the header already says "DARPAN Verified". */}
            <SectionTitle headingId="org-profile-title" title="Organisation Profile" />

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
      </div>
    </div>
  );
}

type Router = ReturnType<typeof useRouter>;

/** A draft of this claim, once instalments.ts carries one (batch B4). Read defensively until then. */
function draftOf(notice: NextInstalmentNotice): { id: string } | undefined {
  return "draft" in notice ? (notice as { draft?: { id: string } }).draft : undefined;
}

/**
 * Instalments Ready to Claim (audit N-01).
 *
 * The block used to list every project with a next instalment — fourteen rows, twelve filled
 * "Claim" buttons — so the page carried seventeen filled buttons and the applicant could not tell
 * which action mattered. Three decisions:
 *
 *  1. **Only what can be claimed now.** A claim is an opportunity, not a blocker: nothing is held
 *     until the NGO acts, which is why Pending Actions (the Ministry is WAITING) stays above the
 *     figures and this block sits under them.
 *  2. **The figures lead.** How many instalments, and how much money, in the dashboard's own
 *     summary pattern — the same `DescriptionList` the Financial Summary uses.
 *  3. **A short list, or none.** Up to three claims are named, each row a link like Recent
 *     Applications' rows, with no button at all: the page keeps ONE filled button, "Apply for
 *     Grant". Above three, naming them rebuilds the wall this replaced, so the block collapses to
 *     its figures and "View All", which opens My Applications filtered to claimable rows — where
 *     every row already carries its own Claim link.
 */
function ClaimableInstalments({
  state,
  items,
  amount,
  router,
}: {
  state: ReturnType<typeof useEAnudaan>["state"];
  items: (NextInstalmentNotice & { href: string })[];
  amount: number;
  router: Router;
}) {
  const n = items.length;
  const collapsed = n > CLAIM_ROWS;
  const drafts = items.filter((i) => draftOf(i)).length;
  return (
    <Card variant="outlined" aria-labelledby="claims-title">
      <CardBody className="gap-4 p-6">
        <SectionTitle headingId="claims-title" title="Instalments Ready to Claim">
          <Link
            variant="standalone"
            size="sm"
            href={CLAIMABLE_HREF}
            onClick={routeOnClick(router, CLAIMABLE_HREF)}
            iconRight={<Icon name="arrow_forward" size={16} aria-hidden />}
          >
            {collapsed ? `View All ${n}` : "View in My Applications"}
          </Link>
        </SectionTitle>

        <DescriptionList
          columns={2}
          divided
          items={[
            {
              term: "Ready to Claim",
              value: <Amount>{n}</Amount>,
              hint: `${n === 1 ? "instalment" : "instalments"}, one per project${drafts ? ` · ${drafts} with a saved draft` : ""}`,
            },
            { term: "Instalment Amount", value: <Amount>{formatMoney(amount)}</Amount>, hint: `across the ${n === 1 ? "claim" : `${n} claims`}` },
          ]}
        />

        {!collapsed && (
          <ListGroup divided aria-label="Instalments ready to claim">
              {items.map((c) => {
                const label = instalmentLabel(c.plan.instalment ?? 1);
                const draft = draftOf(c);
                return (
                  <ListRow
                    linkAs={NextLink}
                    key={c.plan.projectId}
                    href={c.href}
                    title={c.plan.lastSanctioned ? projectTitleFor(state, c.plan.lastSanctioned) : c.plan.projectId}
                    description={
                      <span className="tabular-nums">
                        {label} · FY {c.plan.financialYear} · Project {c.plan.projectId}
                      </span>
                    }
                    trailing={
                      <span className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-body-2">
                        <span className="tabular-nums text-ink">{formatMoney(c.plan.amount ?? 0)}</span>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-primary">
                          {draft ? "Continue Draft" : `Claim ${label}`}
                          <Icon name="chevron_right" size={20} aria-hidden />
                        </span>
                      </span>
                    }
                  />
                );
              })}
          </ListGroup>
        )}
      </CardBody>
    </Card>
  );
}

/**
 * A new organisation's dashboard (audit N-15). Four ₹0.00 figures, a 0% bar and a chart saying
 * "There are no figures for this selection" told a first-time clerk nothing about how to begin.
 * With no application at all, the figures, charts and lists give way to the one thing to do.
 */
function FirstApplication() {
  return (
    <Card variant="outlined" aria-labelledby="first-application-title">
      <CardBody className="gap-4 p-6">
        <SectionTitle
          headingId="first-application-title"
          title="Start Your First Application"
          description="Choose the scheme your project is funded under. Each has its own application form and document checklist."
        />
        <ListGroup divided aria-label="Schemes open for application">
            {Object.entries(NGO_SCHEMES).map(([code, s]) => (
              <ListRow
                linkAs={NextLink}
                key={code}
                href={`/portals/e-anudaan/apply-grant/scheme/${code}/step-1`}
                title={s.title}
                description={s.subtitle}
                trailing={<Icon name="chevron_right" size={20} aria-hidden />}
              />
            ))}
        </ListGroup>
      </CardBody>
    </Card>
  );
}
