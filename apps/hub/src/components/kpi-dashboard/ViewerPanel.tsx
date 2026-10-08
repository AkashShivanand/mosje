"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, RadioGroup } from "@mosje/design-system";
import { OFFICER_ROLES, type OfficerRole } from "@/lib/kpi/access";
import { setViewer, useDashboardViewer } from "@/lib/kpi/viewer";
import { PORTAL_DASHBOARD_CRUMBS } from "@/lib/website-shared/dashboard-links";
import { DASHBOARD_VERSION_PARAM, dashboardVersion, type DashboardVersion } from "@/lib/website-shared/dashboard-version";
import "@/components/website/data-mode.css";

/**
 * The demo rail's Dashboard tab, on the Dashboard's pages only: which version is drawn, and
 * the prototype's officer accounts.
 *
 * TWO AUDIENCES, CHOSEN BY SIGNING IN (instruction, 7 Oct 2026). The KPI sheet has Public and
 * Officer only, and an officer's scope is their account's, so the rail no longer switches
 * roles: it lists the demo User IDs a reviewer can type at the dashboard's Officer Login,
 * with what each account sees (`lib/kpi/access.ts`), and signs out.
 */

function explain(role: OfficerRole): string {
  const portals = role.portals === "all" ? "every portal" : role.portals.map((p) => PORTAL_DASHBOARD_CRUMBS[p]).join(" and ");
  const area = role.area.district ? `${role.area.district} only` : role.area.state ? `${role.area.state}, and its districts` : "All India, down to districts";
  return `Every indicator, public and office, for ${portals}. ${area}.`;
}

const VERSION_EXPLAIN: Record<DashboardVersion, string> = {
  current: "The live site's Beneficiary Dashboard, then a dashboard per scheme portal.",
  proposed: "One dashboard across programmes: Overview, Programmes, Themes and States/UTs.",
};

/** The dashboard root, `/website/dashboard`, whichever page of it is open. */
const dashboardRoot = (path: string) => path.replace(/(\/dashboard)(\/.*)?$/, "$1");

export function ViewerPanel() {
  const role = useDashboardViewer();
  const versionName = React.useId();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  // A portal's own page belongs to the current version, whatever its address carries.
  const portal = pathname.match(/\/dashboard\/([^/]+)$/)?.[1];
  const version: DashboardVersion = portal ? "current" : dashboardVersion({ [DASHBOARD_VERSION_PARAM]: params.get(DASHBOARD_VERSION_PARAM) ?? undefined });

  const setVersion = (v: string) => {
    // The proposed version is the default and needs no parameter; a portal's own page opens
    // it on that programme.
    const next = new URLSearchParams();
    if (v === "current") next.set(DASHBOARD_VERSION_PARAM, "current");
    else if (portal) {
      next.set("lens", "programmes");
      next.set("programme", portal);
    }
    const query = next.toString();
    router.push(`${dashboardRoot(pathname)}${query ? `?${query}` : ""}`);
  };

  return (
    <div className="dm-panel">
      <section className="dm-panel__group">
        <RadioGroup
          className="dm-panel__opts"
          legend="Dashboard Version"
          name={versionName}
          size="sm"
          options={[
            { value: "proposed", label: "Proposed" },
            { value: "current", label: "Current" },
          ]}
          value={version}
          onChange={setVersion}
        />
        <p key={version} className="dm-panel__explain">
          {VERSION_EXPLAIN[version]}
        </p>
      </section>
      <section className="dm-panel__group" aria-labelledby="dm-accounts">
        <h3 id="dm-accounts" className="dm-panel__legend">
          Officer Accounts
        </h3>
        {role ? (
          <>
            <p className="dm-panel__explain">
              Signed in as <b>{role.label}</b>. {explain(role)}
            </p>
            <Button appearance="outlined" size="sm" onClick={() => setViewer(null)}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <p className="dm-panel__explain">
              Sign in at the dashboard&apos;s Officer Login with one of these User IDs. The password is not checked in this prototype.
            </p>
            <dl className="dm-accounts">
              {OFFICER_ROLES.map((r) => (
                <div key={r.id} className="dm-accounts__row">
                  <dt>
                    <code>{r.userId}</code>
                  </dt>
                  <dd>
                    {r.label}. {explain(r)}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </section>
    </div>
  );
}
