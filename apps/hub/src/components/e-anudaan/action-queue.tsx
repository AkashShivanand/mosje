"use client";

import * as React from "react";
import { Alert, ChartCard, Icon, OverviewScreen } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { formatGrant, kpisFor, worklistFor } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "./worklist-table";

/** One ranked row: a label, a count, and a bar showing its share of the queue. */
function QueueBar({
  label,
  count,
  of,
  tone = "neutral",
}: {
  label: string;
  count: number;
  of: number;
  tone?: "neutral" | "danger";
}) {
  return (
    <li>
      <div className="flex items-baseline justify-between text-body-2">
        <span className="text-ink">{label}</span>
        <span className="font-semibold text-ink">{count}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-surface-muted">
        <div
          className={`h-1.5 rounded-full ${tone === "danger" ? "bg-danger" : "bg-navy"}`}
          /* The bar IS the number, so it is drawn from the number rather than
             from a class — the width is data, not styling. */
          style={{ width: `${Math.round((count / Math.max(of, 1)) * 100)}%` }}
        />
      </div>
    </li>
  );
}

/**
 * "My Action Queue" — the officer landing screen, and the most-seen page in the
 * portal. Composed from `OverviewScreen`.
 *
 * Headings, KPI labels, captions, the >7-day threshold and the footer tip are
 * transcribed from the live capture (INVENTORY §1). The IFD variant reuses the
 * same anatomy under its own title, matching the live "Finance / IFD Dashboard".
 *
 * It was already an overview screen in every respect except that it said so: a
 * heading block, four `MetricCard`s in a hand-written grid, two hand-rolled
 * panels and a table. What moving it onto the template changed is that the
 * panels are now `ChartCard`s — so each owns its own empty state rather than the
 * page carrying one inline for the first and nothing for the second — and the
 * screen gained the states it had none of.
 */
export function ActionQueue({ variant = "pd" }: { variant?: "pd" | "finance" }) {
  const { state, hydrated } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;

  /* Derived unconditionally against a null-safe role, so the hooks below never
     change order with the session. The RENDER branches, through the template. */
  const kpis = role ? kpisFor(state, role.id) : null;
  const rows = role ? worklistFor(state, role.id) : [];
  const isPd = variant === "pd";
  const reviewKey = role
    ? role.division === "finance"
      ? `ifd${role.grade}`
      : role.grade === "js"
        ? "jspd"
        : role.grade
    : "";

  return (
    <OverviewScreen
      title={isPd ? "My Action Queue" : "Finance / IFD Dashboard"}
      meta={
        role ? (
          <>
            Every application awaiting your action — across all your schemes and both workflows ·
            Role: <span className="font-semibold text-navy">{role.label}</span>
          </>
        ) : undefined
      }
      loading={!hydrated}
      /* `asked` is false until there is a session: an officer whose store has
         hydrated with no role has not been refused a queue, they have not
         signed in — and those are different screens. */
      asked={role != null}
      kpis={
        kpis
          ? [
              {
                label: "Awaiting My Action",
                value: kpis.awaiting.toLocaleString("en-IN"),
                changeLabel: "Files in your queue now",
                icon: <Icon name="inbox" size={20} aria-hidden />,
              },
              {
                label: "Grant Value Sought",
                value: formatGrant(kpis.grantSought),
                changeLabel: "Total requested in queue",
                icon: <Icon name="currency_rupee" size={20} aria-hidden />,
              },
              {
                label: "Schemes",
                value: String(kpis.schemes),
                changeLabel: `${state.ngos.length} NGOs · ${new Set(state.ngos.map((n) => n.state)).size} states`,
                icon: <Icon name="grid_view" size={20} aria-hidden />,
              },
              {
                label: "Pending > 7 days",
                value: kpis.overdue.toLocaleString("en-IN"),
                changeLabel: "Oldest — clear these first",
                icon: <Icon name="warning" size={20} aria-hidden />,
              },
            ]
          : undefined
      }
      kpisLoading={hydrated ? undefined : 4}
      panels={
        kpis
          ? [
              <ChartCard
                key="by-scheme"
                title="Queue by Scheme"
                empty={kpis.byScheme.length === 0}
                emptyTitle="Nothing in Your Queue"
                emptyLabel="No application is awaiting your action."
              >
                <ul className="space-y-3">
                  {kpis.byScheme.map((s) => (
                    <QueueBar key={s.scheme} label={s.scheme} count={s.count} of={kpis.awaiting} />
                  ))}
                </ul>
              </ChartCard>,
              <ChartCard
                key="ageing"
                title="Pending — Ageing"
                empty={kpis.ageing.length === 0}
                emptyTitle="Nothing Pending"
                emptyLabel="No application has been waiting long enough to age."
                footer={
                  kpis.overdue > 0 ? (
                    <Alert status="error">
                      {kpis.overdue} application{kpis.overdue === 1 ? "" : "s"} pending beyond 7 days
                    </Alert>
                  ) : undefined
                }
              >
                <ul className="space-y-3">
                  {kpis.ageing.map((b) => (
                    <QueueBar
                      key={b.band}
                      label={b.band}
                      count={b.count}
                      of={kpis.awaiting}
                      tone={b.band === "Over 7 days" ? "danger" : "neutral"}
                    />
                  ))}
                </ul>
              </ChartCard>,
            ]
          : undefined
      }
      recent={
        role ? (
          <>
            <WorklistTable
              rows={rows}
              variant="queue"
              reviewBase={`/portals/e-anudaan/dashboard/sm2/${reviewKey}/review`}
              caption="Applications awaiting action"
            />
            <p className="mt-4 text-body-3 text-ink-muted">
              Tip: use the scheme sections in the sidebar to browse a single scheme, or Sanctioned /
              Rejected / Forwarded for those outcomes.
            </p>
          </>
        ) : undefined
      }
    />
  );
}
