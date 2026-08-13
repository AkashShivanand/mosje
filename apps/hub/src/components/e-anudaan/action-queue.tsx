"use client";

import * as React from "react";
import { Alert, Icon, MetricCard } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { formatGrant, kpisFor, worklistFor } from "@/lib/e-anudaan/selectors";
import { WorklistTable } from "./worklist-table";

/**
 * "My Action Queue" — the officer landing screen, and the most-seen page in the portal.
 *
 * Headings, KPI labels, captions, the >7-day threshold and the footer tip are transcribed from
 * the live capture (INVENTORY §1). The IFD variant reuses the same anatomy under its own title,
 * matching the live "Finance / IFD Dashboard".
 */
export function ActionQueue({ variant = "pd" }: { variant?: "pd" | "finance" }) {
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  if (!role) return null;

  const kpis = kpisFor(state, role.id);
  const rows = worklistFor(state, role.id);
  const isPd = variant === "pd";
  const reviewKey = role.division === "finance" ? `ifd${role.grade}` : role.grade === "js" ? "jspd" : role.grade;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">
          {isPd ? "My Action Queue" : "Finance / IFD Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Every application awaiting your action — across all your schemes and both workflows ·
          Role: <span className="font-semibold text-navy">{role.label}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Awaiting My Action"
          value={kpis.awaiting.toLocaleString("en-IN")}
          changeLabel="Files in your queue now"
          icon={<Icon name="inbox" size={20} aria-hidden />}
        />
        <MetricCard
          label="Grant Value Sought"
          value={formatGrant(kpis.grantSought)}
          changeLabel="Total requested in queue"
          icon={<Icon name="currency_rupee" size={20} aria-hidden />}
        />
        <MetricCard
          label="Schemes"
          value={String(kpis.schemes)}
          changeLabel={`${state.ngos.length} NGOs · ${new Set(state.ngos.map((n) => n.state)).size} states`}
          icon={<Icon name="grid_view" size={20} aria-hidden />}
        />
        <MetricCard
          label="Pending > 7 days"
          value={kpis.overdue.toLocaleString("en-IN")}
          changeLabel="Oldest — clear these first"
          icon={<Icon name="warning" size={20} aria-hidden />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <Icon name="bar_chart" size={20} aria-hidden /> Queue by Scheme
          </h2>
          <ul className="mt-4 space-y-3">
            {kpis.byScheme.length === 0 && <li className="text-sm text-ink-muted">Nothing in your queue.</li>}
            {kpis.byScheme.map((s) => (
              <li key={s.scheme}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-ink">{s.scheme}</span>
                  <span className="font-semibold text-ink">{s.count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-surface-muted">
                  <div
                    className="h-1.5 rounded-full bg-navy"
                    style={{ width: `${Math.round((s.count / Math.max(kpis.awaiting, 1)) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <Icon name="schedule" size={20} aria-hidden /> Pending — Ageing
          </h2>
          <ul className="mt-4 space-y-3">
            {kpis.ageing.map((b) => (
              <li key={b.band}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-ink">{b.band}</span>
                  <span className="font-semibold text-ink">{b.count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-surface-muted">
                  <div
                    className={`h-1.5 rounded-full ${b.band === "Over 7 days" ? "bg-danger" : "bg-navy"}`}
                    style={{ width: `${Math.round((b.count / Math.max(kpis.awaiting, 1)) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          {kpis.overdue > 0 && (
            <Alert status="error" className="mt-4">
              {kpis.overdue} application{kpis.overdue === 1 ? "" : "s"} pending beyond 7 days
            </Alert>
          )}
        </section>
      </div>

      <WorklistTable
        rows={rows}
        variant="queue"
        reviewBase={`/portals/e-anudaan/dashboard/sm2/${reviewKey}/review`}
        caption="Applications awaiting action"
      />

      <p className="text-xs text-ink-muted">
        Tip: use the scheme sections in the sidebar to browse a single scheme, or Sanctioned /
        Rejected / Forwarded for those outcomes.
      </p>
    </div>
  );
}
