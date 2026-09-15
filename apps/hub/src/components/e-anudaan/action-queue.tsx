"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Alert, ChartCard, FilterSelect, Icon, ListGroup, ListRow, OverviewScreen, Progress } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { officerDashboard } from "@/lib/e-anudaan/officer";
import { WorklistTable } from "./worklist-table";

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

  const dash = role ? officerDashboard(state, role.id, fy) : null;
  const isPd = variant === "pd";
  const reviewKey = (role && reviewKeyOf(role)) ?? "";

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
              changeLabel: "pending with you",
              icon: <Icon name={c.key === "New" ? "note_add" : "event_repeat"} size={20} aria-hidden />,
            }))
          : undefined
      }
      kpisLoading={hydrated ? undefined : 4}
      panels={
        dash
          ? [
              <ChartCard key="movement" title="Deficiencies and Returns" subtitle={fy ? `FY ${fy}` : "All years"}>
                <ListGroup size="sm" aria-label="Deficiencies and returns">
                  {dash.movement.map((m) => (
                    <ListRow
                      key={m.key}
                      title={m.label}
                      description={m.hint}
                      trailing={<span className="text-title-2 font-semibold tabular-nums text-ink">{m.count}</span>}
                    />
                  ))}
                </ListGroup>
              </ChartCard>,
              <ChartCard
                key="ageing"
                title="Pending — Ageing"
                empty={dash.queue.length === 0}
                emptyTitle="Nothing Pending"
                emptyLabel="No application is waiting with you."
                footer={
                  dash.overdue > 0 ? (
                    <Alert status="error">
                      {dash.overdue} application{dash.overdue === 1 ? "" : "s"} pending beyond 7 days
                    </Alert>
                  ) : undefined
                }
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
            rows={dash.queue}
            variant="queue"
            reviewBase={`/portals/e-anudaan/dashboard/sm2/${reviewKey}/review`}
            caption="Applications awaiting your action"
          />
        ) : undefined
      }
    />
  );
}
