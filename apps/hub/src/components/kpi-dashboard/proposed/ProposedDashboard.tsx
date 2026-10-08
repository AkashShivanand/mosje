"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, FilterSelect, Icon } from "@mosje/design-system";
import { useDataMode } from "@/lib/data-mode/context";
import { SMILE_AREAS, STATE_NAMES } from "@/lib/kpi/geography";
import type { PortalFeed } from "@/lib/kpi/live";
import { isPortalId } from "@/lib/kpi/register";
import type { AreaScope, KpiUnit, PortalId } from "@/lib/kpi/types";
import { useDashboardViewer } from "@/lib/kpi/viewer";
import { FigureSourceProvider } from "@/components/website/FigureSource";
import { ViewerNotice } from "../DashboardViewer";
import { OfficerLogin } from "./OfficerLogin";
import { ProgrammeStory } from "./ProgrammeStory";
import { DEPARTMENT_PAGE, DepartmentStory } from "./DepartmentStory";
import { DataBehind, Pulse } from "./Pulse";
import { SHORT_NAME, YEAR_FILTER, readAll, readingForYear, stateMeasures, viewingFor, yearOption } from "./model";
import { PROGRAMME_AUDIENCE, shows, type Audience } from "./audience";
import "../kpi-dashboard.css";
import "./proposed.css";

/**
 * THE PROPOSED DASHBOARD — the website's Dashboard designed from the KPI proforma up, shown
 * beside the current one by the demo rail's Version switch; it is the default, and `?version=current` opens the other.
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
 * FILTERS, ONLY WHERE THE FIGURES CAN ANSWER THEM (approved 8 Oct 2026): State / UT on every
 * page; District on a programme that publishes by district (SMILE-Beggary), once a State is
 * chosen; Financial Year where a programme counts by year (`YEAR_FILTER`). Type of Applicant is
 * gone, and Officer Login has moved to the page banner (`OfficerAccess`).
 *
 * DS Audit: FilterSelect ✅ · ViewerNotice (app) ✅ · Pulse / ProgrammeStory (this folder) ✅.
 */

export interface ProposedDashboardProps {
  /** Live feeds read on the server (NMBA today). */
  feeds: Partial<Record<PortalId, PortalFeed>>;
  sectionLevel?: 2 | 3;
}

const ALL_INDIA = "";
const ALL = "";
/** Type of Applicant is gone (8 Oct 2026): every reader sees every group's figures. */
const EVERYONE: Set<Audience> = new Set();

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
  // The Department's own dashboard (`?programme=department`): its Beneficiary Dashboard.
  const department = programmeParam === DEPARTMENT_PAGE;
  const wantedState = params.get("state") ?? undefined;
  // The officer-only page (`?view=data-sources`); anyone else asking for it gets the dashboard.
  const dataSources = params.get("view") === "data-sources" && readinessAllowed;
  // The officer sign-in (`?view=login`); a viewer already signed in gets the dashboard.
  const login = params.get("view") === "login" && !role;
  const page = dataSources || login;
  const audiences = EVERYONE;
  const state = role?.area.state ?? (wantedState && STATE_NAMES.includes(wantedState) ? wantedState : undefined);
  // What the open programme can be filtered by — computed in one place, from the programme.
  const filterable = React.useMemo(() => {
    const districtLevel = Boolean(programme?.levels.includes("district"));
    return {
      // District: only on a programme that publishes by district, and only inside a chosen State.
      districtLevel,
      districts: districtLevel && state ? (SMILE_AREAS.find((n) => n.name === state)?.children ?? []).map((d) => d.name) : [],
      // Financial Year: only on a programme counted by year.
      yearSpec: programme ? YEAR_FILTER[programme.id] : undefined,
      units: Object.fromEntries((programme?.kpis ?? []).map((k) => [k.id, k.unit])) as Record<string, KpiUnit>,
    };
  }, [programme, state]);
  const { districts, yearSpec, units } = filterable;
  const wantedDistrict = params.get("district") ?? undefined;
  const scope: AreaScope = {
    state,
    district: role?.area.district ?? (wantedDistrict && districts.includes(wantedDistrict) ? wantedDistrict : undefined),
  };
  const wantedYear = params.get("year");
  const year = yearSpec ? (wantedYear && yearSpec.years.includes(wantedYear) ? wantedYear : yearSpec.current) : undefined;

  const baseReadings = React.useMemo(
    () => readAll(viewing.programmes, scope, demo.mode, feeds, viewing.audience),
    [viewing, scope.state, scope.district, demo.mode, feeds], // eslint-disable-line react-hooks/exhaustive-deps
  );
  // An earlier financial year, on the open programme only (`readingForYear`).
  const programmeId = programme?.id;
  const readings = React.useMemo(
    () =>
      programmeId && yearSpec && year && year !== yearSpec.current
        ? { ...baseReadings, [programmeId]: readingForYear(baseReadings[programmeId] ?? {}, units, yearSpec, year) }
        : baseReadings,
    [baseReadings, programmeId, units, yearSpec, year],
  );
  // The programme as its head describes it: an earlier year is that whole financial year.
  const shown = React.useMemo(
    () => (programme && yearSpec && year && year !== yearSpec.current ? { ...programme, period: `Financial Year ${year}` } : programme),
    [programme, yearSpec, year],
  );
  const national = React.useMemo(
    () => (scope.state ? readAll(viewing.programmes, {}, demo.mode, feeds, viewing.audience) : readings),
    [viewing, scope.state, demo.mode, feeds, readings],
  );
  // The open programme's mapped KPIs, State/UT by State/UT, on its All-India page only.
  const states = React.useMemo(
    () => (programme && !scope.state ? stateMeasures(programme, demo.mode, feeds, viewing.audience) : []),
    [programme, scope.state, demo.mode, feeds, viewing.audience],
  );

  const hrefTo = React.useCallback(
    (to: Partial<Record<"programme" | "state" | "district" | "year" | "view", string | null>>) => {
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
    (to: Partial<Record<"programme" | "state" | "district" | "year" | "view", string | null>>, opts?: { keepFocus?: boolean }) => {
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

      {/*
        ONE TOOLBAR (design audit, 6 Oct 2026; filters revised 8 Oct 2026). What the page is
        showing on the left; the filters that change it on the right, on one baseline — only the
        ones its figures can answer. Signing in is not a filter: Officer Login is in the banner.
      */}
      {/* THE WAY BACK FIRST (design review, 7 Oct 2026): above the area bar, where it reads as
          the way out of this dashboard, not as a link beneath its heading. */}
      {(programme || department) && !page ? (
        <Button appearance="text" size="sm" href={hrefTo({ programme: null, district: null, year: null })} linkAs={Link} iconLeft={<Icon name="arrow_back" size={16} />} className="pd-back">
          All Dashboards
        </Button>
      ) : null}
      {page ? null : (
        <div className="pd-bar">
          <p className="pd-bar__where" role="status">
            <span className="pd-bar__label">Figures for</span>
            {/* The area only: the dashboard's own head names whose figures they are. */}
            {scope.district ? `${scope.district}, ` : ""}
            {scope.state ?? "All India"}
          </p>
          <div className="pd-bar__controls">
            {role?.area.state ? null : (
              <FilterSelect
                label="State / UT"
                value={scope.state ?? ALL_INDIA}
                onChange={(v) => go({ state: v || null, district: null }, { keepFocus: true })}
                options={[{ value: ALL_INDIA, label: "All India" }, ...STATE_NAMES.map((s) => ({ value: s, label: s }))]}
              />
            )}
            {filterable.districtLevel && !role?.area.district ? (
              <FilterSelect
                label="District"
                value={scope.district ?? ALL}
                disabled={districts.length === 0}
                onChange={(v) => go({ district: v || null }, { keepFocus: true })}
                options={[{ value: ALL, label: "All Districts" }, ...districts.map((d) => ({ value: d, label: d }))]}
              />
            ) : null}
            {yearSpec && year ? (
              <FilterSelect
                label="Financial Year"
                value={year}
                onChange={(v) => go({ year: v === yearSpec.current ? null : v }, { keepFocus: true })}
                options={yearSpec.years.map((y) => ({ value: y, label: yearOption(yearSpec, y) }))}
              />
            ) : null}
          </div>
        </div>
      )}
      {scope.state && !programme && !page ? (
        <p className="pd-note">
          {stateWise.length
            ? `Figures for ${scope.state} are published for ${listed(stateWise)}. Other sections show All-India figures.`
            : `No figures are published for ${scope.state}. The sections below show All-India figures.`}
        </p>
      ) : null}

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
          ) : department ? (
            <DepartmentStory sectionLevel={sectionLevel} state={scope.state} audiences={audiences} />
          ) : programme ? (
            <ProgrammeStory
              programme={shown ?? programme}
              viewing={viewing}
              readings={readings}
              scope={scope}
              sectionLevel={sectionLevel}
              go={go}
              states={states}
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
