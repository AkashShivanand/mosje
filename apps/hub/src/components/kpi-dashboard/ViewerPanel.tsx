"use client";

import * as React from "react";
import { RadioGroup } from "@mosje/design-system";
import { OFFICER_ROLES, type OfficerRole } from "@/lib/kpi/access";
import { setViewer, useDashboardViewer } from "@/lib/kpi/viewer";
import { PORTAL_DASHBOARD_CRUMBS } from "@/lib/website-shared/dashboard-links";
import "@/components/website/data-mode.css";

/**
 * The demo rail's View As tab, on the Dashboard's pages only: who the Dashboard is drawn
 * for. The public sees public KPIs at All India or one State/UT; each officer role sees
 * every KPI of its portals, held to its area (`lib/kpi/access.ts`).
 *
 * In the demo rail rather than on the page because the page is the citizen's: a role
 * switcher is scaffolding for a walkthrough, and the Dashboard is not connected to a
 * portal login (5 Oct 2026). Same shape as the Data tab — the choice, and one line
 * explaining only the selected option.
 */

const PUBLIC = "public";

function explain(role: OfficerRole | undefined): string {
  if (!role) return "Public indicators, for All India or one State/UT. What a citizen sees.";
  const portals = role.portals === "all" ? "every portal" : role.portals.map((p) => PORTAL_DASHBOARD_CRUMBS[p]).join(" and ");
  const area = role.area.district ? `${role.area.district} only` : role.area.state ? `${role.area.state}, and its districts` : "All India, down to districts";
  return `Every indicator, public and office, for ${portals}. ${area}.`;
}

export function ViewerPanel() {
  const role = useDashboardViewer();
  const name = React.useId();
  return (
    <div className="dm-panel">
      <section className="dm-panel__group">
        <RadioGroup
          className="dm-panel__opts"
          legend="View the Dashboard as"
          name={name}
          size="sm"
          options={[{ value: PUBLIC, label: "Public" }, ...OFFICER_ROLES.map((r) => ({ value: r.id, label: r.label }))]}
          value={role?.id ?? PUBLIC}
          onChange={(v) => setViewer(v === PUBLIC ? null : v)}
        />
        <p key={role?.id ?? PUBLIC} className="dm-panel__explain">
          {explain(role)}
        </p>
      </section>
    </div>
  );
}
