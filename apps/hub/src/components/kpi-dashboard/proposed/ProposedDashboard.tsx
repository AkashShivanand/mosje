"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterSelect } from "@mosje/design-system";
import { useDataMode } from "@/lib/data-mode/context";
import { STATE_NAMES } from "@/lib/kpi/geography";
import type { PortalFeed } from "@/lib/kpi/live";
import { isPortalId } from "@/lib/kpi/register";
import type { AreaScope, PortalId } from "@/lib/kpi/types";
import { useDashboardViewer } from "@/lib/kpi/viewer";
import { ViewerNotice } from "../DashboardViewer";
import { AboutProvider } from "./KpiBlocks";
import { ProgrammeStory } from "./ProgrammeStory";
import { Pulse } from "./Pulse";
import { SHORT_NAME, readAll, viewingFor } from "./model";
import "../kpi-dashboard.css";
import "./proposed.css";

/**
 * THE PROPOSED DASHBOARD — the website's Dashboard designed from the KPI proforma up, shown
 * beside the current one by the demo rail's Version switch (`?version=proposed`).
 *
 * Two places, both in the address so either can be shared:
 *  - the PULSE (`Pulse.tsx`): one page, told as a story — the answer, the programmes, where,
 *    the money, and for the Ministry the data behind it;
 *  - a PROGRAMME (`?programme=`, `ProgrammeStory.tsx`): one programme on its own.
 *
 * One area filter rules both (`?state=`). Every figure resolves from ONE set of readings
 * (`readAll`), and every figure can open About This Figure.
 *
 * DS Audit: FilterSelect ✅ · ViewerNotice (app) ✅ · Pulse / ProgrammeStory (this folder) ✅.
 */

export interface ProposedDashboardProps {
  /** Live feeds read on the server (NMBA today). */
  feeds: Partial<Record<PortalId, PortalFeed>>;
  sectionLevel?: 2 | 3;
}

const ALL_INDIA = "";

export function ProposedDashboard({ feeds, sectionLevel = 2 }: ProposedDashboardProps) {
  const router = useRouter();
  const params = useSearchParams();
  const demo = useDataMode();
  const role = useDashboardViewer();
  const viewing = React.useMemo(() => viewingFor(role), [role]);
  const readinessAllowed = role?.level === "ministry" || role?.level === "division";

  const programmeParam = params.get("programme");
  const programme =
    programmeParam && isPortalId(programmeParam) ? viewing.programmes.find((p) => p.id === programmeParam) : undefined;
  const wantedState = params.get("state") ?? undefined;
  const scope: AreaScope = {
    state: role?.area.state ?? (wantedState && STATE_NAMES.includes(wantedState) ? wantedState : undefined),
    district: role?.area.district,
  };

  const readings = React.useMemo(
    () => readAll(viewing.programmes, scope, demo.mode, feeds),
    [viewing, scope.state, scope.district, demo.mode, feeds], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const national = React.useMemo(
    () => (scope.state ? readAll(viewing.programmes, {}, demo.mode, feeds) : readings),
    [viewing, scope.state, demo.mode, feeds, readings],
  );

  const hrefTo = React.useCallback(
    (to: Partial<Record<"programme" | "state", string | null>>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(to)) {
        if (v === null || v === undefined || v === "") next.delete(k);
        else next.set(k, v);
      }
      // Query-only and relative: the same on the server and in the browser, and right in
      // every design, whose pages the proxy serves from different paths.
      return `?${next.toString()}`;
    },
    [params],
  );

  /*
   * FOCUS FOLLOWS THE READER. Any move to another place — a tile's Explore link, "Show
   * All India", Back — sends focus to the new place's first heading, so a keyboard or
   * screen-reader user does not restart from the top of the page. A control that survives
   * the move (the area filter) keeps it.
   */
  const panelRef = React.useRef<HTMLDivElement>(null);
  const keepFocus = React.useRef(false);
  const firstView = React.useRef(true);
  const go = React.useCallback(
    (to: Partial<Record<"programme" | "state", string | null>>, opts?: { keepFocus?: boolean }) => {
      keepFocus.current = Boolean(opts?.keepFocus);
      router.push(hrefTo(to), { scroll: false });
    },
    [router, hrefTo],
  );
  const viewKey = params.toString();
  React.useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    if (keepFocus.current) {
      keepFocus.current = false;
      return;
    }
    const target = panelRef.current?.querySelector<HTMLElement>("h2, h3") ?? panelRef.current;
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start" });
  }, [viewKey]);

  const origins = new Set(viewing.programmes.flatMap((p) => Object.values(readings[p.id] ?? {}).map((r) => r?.origin)));

  return (
    <div className="pd">
      {role ? <ViewerNotice role={role} /> : null}

      <div className="pd-bar">
        <p className="pd-bar__where" role="status">
          <span className="pd-bar__label">Figures for</span>
          {programme ? `${SHORT_NAME[programme.id]} · ` : ""}
          {scope.district ? `${scope.district}, ` : ""}
          {scope.state ?? "All India"}
        </p>
        {role?.area.state ? null : (
          <FilterSelect
            label="State / UT"
            value={scope.state ?? ALL_INDIA}
            onChange={(v) => go({ state: v || null }, { keepFocus: true })}
            options={[{ value: ALL_INDIA, label: "All India" }, ...STATE_NAMES.map((s) => ({ value: s, label: s }))]}
          />
        )}
      </div>

      {origins.has("modelled") ? (
        // Said once, before the reader starts, and not behind the marks toggle: most of the
        // programmes are not yet connected, and a screenshot must carry its own disclosure.
        <p className="dm-banner kd-banner">
          {origins.has("live") || origins.has("snapshot") ? (
            <>
              <b>Part illustrative.</b>&nbsp;Figures marked Live come from the programme&apos;s own feed. The rest are illustrative and are not departmental figures.
            </>
          ) : (
            <>
              <b>Illustrative figures.</b>&nbsp;No programme on this view is connected yet. The figures show how the dashboard will read and are not departmental figures.
            </>
          )}
        </p>
      ) : null}

      <AboutProvider officer={viewing.audience === "officer"}>
        <div ref={panelRef} className="pd-panel">
          {programme ? (
            <ProgrammeStory
              programme={programme}
              viewing={viewing}
              readings={readings}
              scope={scope}
              sectionLevel={sectionLevel}
              backHref={hrefTo({ programme: null })}
              go={go}
            />
          ) : (
            <Pulse
              viewing={viewing}
              readings={readings}
              national={national}
              scope={scope}
              sectionLevel={sectionLevel}
              readinessAllowed={readinessAllowed}
              hrefTo={hrefTo}
              go={go}
            />
          )}
        </div>
      </AboutProvider>
    </div>
  );
}
