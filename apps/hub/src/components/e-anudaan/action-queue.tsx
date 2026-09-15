"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChartCard, FilterSelect, Icon, ListGroup, ListRow, OverviewScreen, Progress, SectionTitle } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { officerDashboard } from "@/lib/e-anudaan/officer";
import { WorklistTable } from "./worklist-table";
import { routeLinksWithin } from "./ngo-shell";

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
 * Design review of 16 Sep 2026:
 *  • The year filter is a page control, so it sits in the header's action slot rather than on a
 *    row of its own above the tiles.
 *  • Each tile's second line is information — how many of its files are over 7 days — instead of
 *    "Pending with you" printed four times under a header that already says so.
 *  • Deficiencies and Returns groups its rows by what they count (this officer's queue, or every
 *    application in the year) instead of repeating the scope at the start of each hint.
 *  • Only the overdue band is red — the one stated rule, 7 days. The panel then names the files
 *    waiting longest, each a link to its review; the space under three bars was empty.
 */
const OVERDUE_DAYS = 7;
const LONGEST = 3;
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

  const dash = role ? officerDashboard(state, role.id, fy) : null;
  const isPd = variant === "pd";
  const reviewKey = (role && reviewKeyOf(role)) ?? "";
  const reviewBase = `/portals/e-anudaan/dashboard/sm2/${reviewKey}/review`;
  const ngoName = (id: string) => state.ngos.find((n) => n.id === id)?.name ?? "—";

  const setFy = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("fy", value);
    else next.delete("fy");
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  return (
    <OverviewScreen
      // The Finance title matches its menu item, "Finance Dashboard".
      title={isPd ? "My Action Queue" : "Finance Dashboard"}
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
      actions={
        dash ? (
          <div className="w-full sm:w-56">
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
              detail:
                c.count === 0
                  ? "None with you"
                  : c.overdue === 0
                    ? "None over 7 days"
                    : `${c.overdue} over 7 days`,
              icon: <Icon name={c.key === "New" ? "note_add" : "event_repeat"} size={20} aria-hidden />,
            }))
          : undefined
      }
      kpisLoading={hydrated ? undefined : 4}
      panels={
        dash
          ? [
              <ChartCard key="movement" title="Deficiencies and Returns" subtitle={fy ? `FY ${fy}` : "All years"}>
                <div className="space-y-5">
                  {(
                    [
                      ["queue", "In Your Queue"],
                      ["all", "Across All Applications"],
                    ] as const
                  ).map(([scope, heading]) => (
                    <div key={scope} className="space-y-1">
                      <SectionTitle as={3} eyebrow={heading} />
                      <ListGroup size="sm" aria-label={heading}>
                        {dash.movement
                          .filter((m) => m.scope === scope)
                          .map((m) => (
                            <ListRow
                              key={m.key}
                              title={m.label}
                              description={m.hint}
                              /* A zero is muted so the counts that ask for attention are the ones read first. */
                              trailing={
                                <span className={`text-title-2 font-semibold tabular-nums ${m.count === 0 ? "text-ink-muted" : "text-ink"}`}>
                                  {m.count.toLocaleString("en-IN")}
                                </span>
                              }
                            />
                          ))}
                      </ListGroup>
                    </div>
                  ))}
                </div>
              </ChartCard>,
              <ChartCard
                key="ageing"
                title="Pending — Ageing"
                empty={dash.queue.length === 0}
                emptyTitle="Nothing Pending"
                emptyLabel="No application is waiting with you."
                /* No "pending beyond 7 days" alert under the bars: it restated the "Over 7 days"
                   bar directly above it (removed on confirmation, 15 Sep 2026). */
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    {/* The count rides in the label: Progress prints the share of the queue, and an
                        officer plans by how many files, not by what fraction of them. */}
                    {dash.ageing.map((b, i) => (
                      <Progress
                        key={b.band}
                        label={`${b.band} (${b.count})`}
                        value={b.count}
                        max={Math.max(dash.queue.length, 1)}
                        tone={i === 2 ? "danger" : undefined}
                      />
                    ))}
                  </div>
                  {dash.queue.length > 0 && (
                    <div className="space-y-1">
                      <SectionTitle as={3} eyebrow="Waiting Longest" />
                      {/* The queue is sorted oldest first, so its head is the answer. */}
                      <div onClick={routeLinksWithin(router)}>
                        <ListGroup size="sm" aria-label="Applications waiting longest">
                          {dash.queue.slice(0, LONGEST).map((a) => (
                            <ListRow
                              key={a.id}
                              href={`${reviewBase}/${encodeURIComponent(a.id)}`}
                              title={<span className="font-mono">{a.institutionId}</span>}
                              description={ngoName(a.ngoId)}
                              trailing={
                                <span
                                  className={`tabular-nums font-semibold ${
                                    a.ageingDays > OVERDUE_DAYS ? "text-[var(--sa-text-status-error-base)]" : "text-ink"
                                  }`}
                                >
                                  {a.ageingDays} days
                                  <Icon name="chevron_right" size={20} className="ml-2 align-middle text-ink-muted" aria-hidden />
                                </span>
                              }
                            />
                          ))}
                        </ListGroup>
                      </div>
                    </div>
                  )}
                </div>
              </ChartCard>,
            ]
          : undefined
      }
      recent={
        role && dash ? (
          <WorklistTable
            rows={dash.queue}
            variant="queue"
            reviewBase={reviewBase}
            caption="Applications awaiting your action"
          />
        ) : undefined
      }
    />
  );
}
