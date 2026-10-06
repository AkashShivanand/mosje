"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Chip, Combobox, FilterSelect, Icon } from "@mosje/design-system";
import { useDataMode } from "@/lib/data-mode/context";
import { STATE_NAMES } from "@/lib/kpi/geography";
import type { PortalFeed } from "@/lib/kpi/live";
import { isPortalId } from "@/lib/kpi/register";
import type { AreaScope, PortalId } from "@/lib/kpi/types";
import { useDashboardViewer } from "@/lib/kpi/viewer";
import { FigureSourceProvider } from "@/components/website/FigureSource";
import { ViewerNotice } from "../DashboardViewer";
import { OfficerLogin } from "./OfficerLogin";
import { ProgrammeStory } from "./ProgrammeStory";
import { DataBehind, Pulse } from "./Pulse";
import { SHORT_NAME, readAll, viewingFor } from "./model";
import { AUDIENCES, AUDIENCE_LABEL, PROGRAMME_AUDIENCE, parseAudiences, serialiseAudiences, shows, type Audience } from "./audience";
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
 * (`readAll`), and every figure can show its source and calculation (`FigureSource`) while
 * the demo rail asks for them.
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
  // The officer-only page (`?view=data-sources`); anyone else asking for it gets the dashboard.
  const dataSources = params.get("view") === "data-sources" && readinessAllowed;
  // The officer sign-in (`?view=login`); a viewer already signed in gets the dashboard.
  const login = params.get("view") === "login" && !role;
  const page = dataSources || login;
  const audiences = React.useMemo(() => parseAudiences(params.get("for")), [params]);
  const scope: AreaScope = {
    state: role?.area.state ?? (wantedState && STATE_NAMES.includes(wantedState) ? wantedState : undefined),
    district: role?.area.district,
  };

  const readings = React.useMemo(
    () => readAll(viewing.programmes, scope, demo.mode, feeds, viewing.audience),
    [viewing, scope.state, scope.district, demo.mode, feeds], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const national = React.useMemo(
    () => (scope.state ? readAll(viewing.programmes, {}, demo.mode, feeds, viewing.audience) : readings),
    [viewing, scope.state, demo.mode, feeds, readings],
  );

  const hrefTo = React.useCallback(
    (to: Partial<Record<"programme" | "state" | "for" | "view", string | null>>) => {
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
    (to: Partial<Record<"programme" | "state" | "for" | "view", string | null>>, opts?: { keepFocus?: boolean }) => {
      keepFocus.current = Boolean(opts?.keepFocus);
      router.push(hrefTo(to), { scroll: false });
    },
    [router, hrefTo],
  );
  const toggleAudience = (id: Audience | "all") => {
    const next = new Set(audiences);
    if (id === "all") next.clear();
    else if (next.has(id)) next.delete(id);
    else next.add(id);
    go({ for: serialiseAudiences(next) || null }, { keepFocus: true });
  };
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

  /*
   * WHAT A STATE/UT CHOICE ACTUALLY CHANGES, said once, beside the picker. Most of the page is
   * published for All India only; choosing Kerala and finding five of seven sections unchanged,
   * with the reason printed under one of them, read as a picker that did not work (design
   * audit, 6 Oct 2026). Derived from the readings, so it names only programmes that have a
   * figure for the State/UT chosen. Each All-India section also carries a badge.
   */
  const stateWise = scope.state
    ? viewing.programmes
        .filter((p) => p.levels.includes("state") && shows(audiences, PROGRAMME_AUDIENCE[p.id]) && Object.keys(readings[p.id] ?? {}).length > 0)
        .map((p) => SHORT_NAME[p.id])
    : [];
  const listed = (names: string[]) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`);

  /*
   * NO PAGE-WIDE BANNER. Every figure carries its own mark — Live, Received or
   * Illustrative — from the one gate in `ProvenanceChip`, so a sentence across the top
   * saying the same thing again was the page narrating itself (instruction, 6 Oct 2026).
   */

  return (
    <div className="pd">
      {role ? <ViewerNotice role={role} /> : null}

      {/* OFFICER LOGIN, AT THE TOP (decided 6 Oct 2026: the dashboard has its own login). A
          citizen reads the page without signing in; an officer signs in for the Post-Login
          KPIs. Signed in, the Officer View notice above takes its place. */}
      {role || login ? null : (
        <div className="pd-access">
          <Button appearance="outlined" size="sm" href={hrefTo({ view: "login" })} linkAs={Link} iconLeft={<Icon name="login" size={16} />}>
            Officer Login
          </Button>
        </div>
      )}

      {page ? null : (
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
      )}
      {scope.state && !programme && !page ? (
        <p className="pd-note">
          {stateWise.length
            ? `Figures for ${scope.state} are published for ${listed(stateWise)}. Other sections show All-India figures.`
            : `No figures are published for ${scope.state}. The sections below show All-India figures.`}
        </p>
      ) : null}

      {programme || page ? null : (
        <>
          {/* TYPE OF APPLICANT — the Additional Secretary's approved label and groups
              (`audience.ts`). Multi-select, nothing chosen = everyone. On a wide screen,
              chips: every group visible and one tap away, with "All" saying plainly that the
              page is unfiltered. On a phone the nine chips would stack ~330px above the first
              figure, so the same choice is the DS multi-select Combobox. One state, two
              controls; CSS shows one. */}
          <div className="pd-filter pd-filter--wide" role="group" aria-labelledby="pd-filter-label">
            <span id="pd-filter-label" className="pd-filter__label">
              {AUDIENCE_LABEL}
            </span>
            <Chip selected={audiences.size === 0} onSelectedChange={() => toggleAudience("all")}>
              All
            </Chip>
            {AUDIENCES.map((a) => (
              <Chip key={a.id} selected={audiences.has(a.id)} onSelectedChange={() => toggleAudience(a.id)}>
                {a.label}
              </Chip>
            ))}
          </div>
          <div className="pd-filter--narrow">
            <Combobox
              multiple
              label={AUDIENCE_LABEL}
              placeholder="All"
              options={AUDIENCES.map((a) => ({ value: a.id, label: a.label }))}
              value={AUDIENCES.filter((a) => audiences.has(a.id)).map((a) => a.id)}
              onChange={(v) => go({ for: serialiseAudiences(parseAudiences(v.join(","))) || null }, { keepFocus: true })}
            />
          </div>
        </>
      )}

      <FigureSourceProvider>
        <div ref={panelRef} className="pd-panel">
          {login ? (
            <OfficerLogin backHref={hrefTo({ view: null })} sectionLevel={sectionLevel} onSignedIn={() => go({ view: null })} />
          ) : dataSources ? (
            <div className="pd-story">
              <Button appearance="text" size="sm" href={hrefTo({ view: null })} linkAs={Link} iconLeft={<Icon name="arrow_back" size={16} />} className="pd-back">
                Beneficiary Dashboard
              </Button>
              <DataBehind viewing={viewing} readings={readings} sectionLevel={sectionLevel} />
            </div>
          ) : programme ? (
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
              audiences={audiences}
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
      </FigureSourceProvider>
    </div>
  );
}
