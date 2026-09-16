"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChartCard, FilterSelect, Icon, ListGroup, ListRow, OverviewScreen, Progress } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES, reviewKeyOf, type RoleDef } from "@/lib/e-anudaan/roles";
import { officerDashboard, type OfficerDashboard } from "@/lib/e-anudaan/officer";
import { officerStatus } from "@/lib/e-anudaan/applicant";
import { returnedBy } from "@/lib/e-anudaan/registers";
import { DEFICIENCY, RETURN } from "@/lib/e-anudaan/glossary";
import type { EAnudaanState } from "@/lib/e-anudaan/types";
import { INSPECTION_READY_FILTER, WorklistTable } from "./worklist-table";

/**
 * "My Action Queue" — the officer landing screen, composed from `OverviewScreen`.
 *
 * Re-cut after the review call of 11 Sep 2026 (T698–737, T839–933):
 *
 *  • The NIC portal the department is used to showed four cards — New, 1st, 2nd and 3rd
 *    Instalment — each with its pending count. That is what an officer plans a day by, so the
 *    KPI row is those four, not "Awaiting / Grant Value / Schemes / Overdue".
 *  • A Financial Year filter sits above everything. With it, a "Pending by Financial Year"
 *    chart says nothing, so there is none.
 *  • What moved — resubmitted after deficiency, returned for rework, inspection reports in,
 *    deficiencies still with NGOs, files forwarded — is one panel, because the department
 *    said deficiencies and their resolution were invisible to them.
 *  • Pending work stays the first thing on the page; nothing decorative sits above it.
 *
 * The year lives in the URL, so a link to "my 2026-27 queue" works.
 *
 * Design-director audit, 16 Sep 2026 (B5):
 *
 *  • One queue per seat (O-04). The IFD's "My Worklist" and the unlisted `sm2/<grade>` page drew
 *    this same queue a second time; they now redirect here, and the sidebar item and this page's
 *    heading are one name, "My Queue", in both divisions.
 *  • Every figure in "Deficiencies and Returns" opens the rows it counts (O-03). A figure about
 *    this queue sets the queue's Status filter below; a figure about another register links to
 *    that register with the same filter, the year included. A figure that is zero opens nothing.
 *  • "Returned for Rework" was two sets under one word — returned to you, and returned by you —
 *    and the Returned register that holds the second read empty beside it (O-09). They are two rows.
 *  • The Integrated Finance Division is shown only what it acts on (O-02). Deficiencies are the
 *    Programme Division's (only its Section Officer sends one), and the IFD has no Forwarded
 *    register, so "Forwarded by You" had no list to open.
 */
export function ActionQueue({ variant = "pd" }: { variant?: "pd" | "finance" }) {
  return (
    <React.Suspense fallback={null}>
      <Queue variant={variant} />
    </React.Suspense>
  );
}

function Queue({ variant }: { variant: "pd" | "finance" }) {
  const { state, hydrated } = useEAnudaan();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const role = state.session ? ROLES[state.session] : null;
  const fy = params.get("fy") ?? "";
  const queueStatus = params.get("status") ?? "";

  const dash = role ? officerDashboard(state, role.id, fy) : null;
  const isPd = variant === "pd";
  const reviewKey = (role && reviewKeyOf(role)) ?? "";

  const setFy = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("fy", value);
    else next.delete("fy");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const setQueueStatus = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("status", value);
    else next.delete("status");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  /* A figure about this queue filters the table below and takes the reader there. */
  const openInQueue = (status: string) => {
    setQueueStatus(status);
    const table = document.getElementById(QUEUE_ID);
    table?.scrollIntoView({ behavior: "smooth", block: "start" });
    table?.focus({ preventScroll: true });
  };

  const groups = role && dash ? movementGroups(state, role, dash, fy, isPd) : [];

  return (
    <OverviewScreen
      // The sidebar item and this heading are one name, in both divisions (audit O-04).
      title="My Queue"
      meta={
        role && dash ? (
          <>
            {dash.queue.length.toLocaleString("en-IN")} application{dash.queue.length === 1 ? "" : "s"} awaiting your action
            {fy ? ` in FY ${fy}` : ""} · <span className="font-semibold text-navy">{role.label}</span>
          </>
        ) : undefined
      }
      loading={!hydrated}
      /* `asked` is false until there is a session: an officer whose store has
         hydrated with no role has not been refused a queue, they have not
         signed in — and those are different screens. */
      asked={role != null}
      filters={
        dash ? (
          <div className="w-full max-w-xs">
            <FilterSelect
              label="Financial Year"
              value={fy}
              onChange={setFy}
              options={[{ value: "", label: "All years" }, ...dash.years.map((y) => ({ value: y, label: `FY ${y}` }))]}
            />
          </div>
        ) : undefined
      }
      kpis={
        dash
          ? dash.byCase.map((c) => ({
              key: c.key,
              label: c.label,
              value: c.count.toLocaleString("en-IN"),
              detail: "Pending with you",
              icon: <Icon name={c.key === "New" ? "note_add" : "event_repeat"} size={20} aria-hidden />,
            }))
          : undefined
      }
      kpisLoading={hydrated ? undefined : 4}
      panels={
        dash
          ? [
              <ChartCard key="movement" headingLevel={2} title={isPd ? "Deficiencies and Returns" : "Returns and Inspection Reports"} subtitle={fy ? `FY ${fy}` : "All years"}>
                <div className="space-y-4">
                  {groups.map((g) => (
                    <div key={g.label}>
                      {/* The group's name, read once: visible here, and as the list's label. */}
                      <p className="mb-1 px-3 text-label-2 font-semibold text-ink-muted" aria-hidden>
                        {g.label}
                      </p>
                      <ListGroup size="sm" aria-label={g.label}>
                        {g.rows.map((m) => {
                          const opens = m.count > 0;
                          return (
                            <ListRow
                              key={m.key}
                              title={m.label}
                              href={opens && m.open.kind === "href" ? m.open.href : undefined}
                              linkAs={Link}
                              onClick={opens && m.open.kind === "queue" ? () => openInQueue((m.open as { status: string }).status) : undefined}
                              selected={m.open.kind === "queue" && queueStatus === m.open.status}
                              trailing={
                                <span className="inline-flex items-center gap-1">
                                  <span className="text-title-2 font-semibold tabular-nums text-ink">{m.count.toLocaleString("en-IN")}</span>
                                  {/* A fixed-width slot either way, so the figures line up down the card
                                      whether or not a row opens anything. */}
                                  {opens ? <Icon name="chevron_right" size={20} aria-hidden /> : <span className="inline-block w-5" aria-hidden />}
                                </span>
                              }
                            />
                          );
                        })}
                      </ListGroup>
                    </div>
                  ))}
                </div>
              </ChartCard>,
              <ChartCard
                key="ageing"
                /* Directly under the page's h1: an h3 here skipped a level (audit X-12). */
                headingLevel={2}
                title="Pending — Ageing"
                empty={dash.queue.length === 0}
                emptyTitle="Nothing Pending"
                emptyLabel="No application is waiting with you."
                /* No "pending beyond 7 days" alert under the bars: it restated the "Over 7 days"
                   bar directly above it (removed on confirmation, 15 Sep 2026). */
              >
                <div className="space-y-4">
                  {/* The count rides in the label: Progress prints the share of the queue, and an
                      officer plans by how many files, not by what fraction of them. */}
                  {dash.ageing.map((b) => (
                    <Progress
                      key={b.band}
                      label={`${b.band} (${b.count})`}
                      value={b.count}
                      max={Math.max(dash.queue.length, 1)}
                      tone={b.band === "Over 7 days" ? "danger" : undefined}
                    />
                  ))}
                </div>
              </ChartCard>,
            ]
          : undefined
      }
      recent={
        role && dash ? (
          <WorklistTable
            id={QUEUE_ID}
            rows={dash.queue}
            status={queueStatus}
            onStatusChange={setQueueStatus}
            variant="queue"
            reviewBase={`/portals/e-anudaan/dashboard/sm2/${reviewKey}/review`}
            caption="Applications awaiting your action"
          />
        ) : undefined
      }
    />
  );
}

const QUEUE_ID = "my-queue";

type MovementRow = {
  key: string;
  label: string;
  count: number;
  /** What the figure opens: this page's queue on a Status filter, or another register. */
  open: { kind: "queue"; status: string } | { kind: "href"; href: string };
};

/**
 * The "Deficiencies and Returns" card, in three groups by where its rows live.
 *
 * Every count here is the length of the list its row opens, computed by the same test that list
 * applies — the queue's Status filter reads `officerStatus`, the Returned register `returnedBy`,
 * All Applications `matchesExplorerStatus` — so a figure and the rows it opens cannot disagree.
 */
function movementGroups(
  state: EAnudaanState,
  role: RoleDef,
  dash: OfficerDashboard,
  fy: string,
  isPd: boolean,
): { label: string; rows: MovementRow[] }[] {
  const BASE = "/portals/e-anudaan/dashboard";
  const withFy = (href: string, extra: Record<string, string> = {}) => {
    const q = new URLSearchParams({ ...extra, ...(fy ? { fy } : {}) });
    return q.size ? `${href}?${q}` : href;
  };
  const figure = (key: string) => dash.movement.find((m) => m.key === key)?.count ?? 0;
  const byStatus = (label: string) => dash.queue.filter((a) => officerStatus(a).label === label).length;
  const inYear = (financialYear: string) => !fy || financialYear === fy;

  const returnedToYou: MovementRow = { key: "returned-to-you", label: "Returned to You", count: byStatus(RETURN.status), open: { kind: "queue", status: RETURN.status } };
  const inspection: MovementRow = { key: "inspection", label: "Inspection Report Available", count: figure("inspection"), open: { kind: "queue", status: INSPECTION_READY_FILTER } };
  const returnedByYou: MovementRow = {
    key: "returned-by-you",
    label: "Returned by You, Awaiting Response",
    count: returnedBy(state, role.id).filter((r) => !r.responded && inYear(r.app.financialYear)).length,
    open: { kind: "href", href: withFy(`${BASE}/${isPd ? "pd" : "finance"}/${role.grade}/returned`, { response: "open" }) },
  };

  if (!isPd) {
    return [
      { label: "In Your Queue", rows: [returnedToYou, inspection] },
      { label: "Your Actions", rows: [returnedByYou] },
    ];
  }

  return [
    {
      label: "In Your Queue",
      rows: [
        { key: "to-send", label: `${DEFICIENCY.plural} to Send`, count: figure("to-send"), open: { kind: "queue", status: DEFICIENCY.toSend } },
        { key: "resubmitted", label: DEFICIENCY.resubmitted, count: figure("resubmitted"), open: { kind: "queue", status: DEFICIENCY.resubmitted } },
        returnedToYou,
        inspection,
      ],
    },
    {
      label: "Your Actions",
      rows: [
        returnedByYou,
        { key: "forwarded", label: "Forwarded by You", count: figure("forwarded"), open: { kind: "href", href: withFy(`${BASE}/pd/forwarded`) } },
      ],
    },
    {
      label: "All Applications",
      rows: [
        { key: "deficiency", label: `${DEFICIENCY.plural} Raised`, count: figure("deficiency"), open: { kind: "href", href: withFy(`${BASE}/pd/${role.grade}/all-applications`, { status: "deficiency" }) } },
        { key: "resolved", label: "Deficiencies Resolved", count: figure("resolved"), open: { kind: "href", href: withFy(`${BASE}/pd/${role.grade}/all-applications`, { status: "corrected" }) } },
      ],
    },
  ];
}
