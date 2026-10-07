"use client";

import * as React from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardState,
  Chip,
  DotPlot,
  Icon,
  OrgLogo,
  SectionTitle,
} from "@mosje/design-system";
import { useDataMode } from "@/lib/data-mode/context";
import { KPI_CATEGORIES } from "@/lib/kpi/categories";
import { covers } from "@/lib/kpi/model";
import type { AreaScope, PortalDashboard } from "@/lib/kpi/types";
import { isTile } from "../KpiCard";
import { KpiBlocks } from "./KpiBlocks";
import { COMPONENT_SHORT, fundsRows, shownKpis, type Readings, type StateMeasure, type Viewing } from "./model";
import { StateBreakdown } from "./StateBreakdown";
import { StoryHeader } from "./StoryHeader";
import { PROGRAMME_TONE, compact } from "./story";

/**
 * One portal's dashboard, told on its own: its head in the programme's colour (`StoryHeader`),
 * then its indicators by theme (or by component, for Senior Citizens), each with
 * its source and calculation while the demo rail shows them. Reached from the programme's tile; `?programme=` holds it.
 *
 * DS Audit: StoryHeader (Card `accent="fill"`) ✅ · OrgLogo ✅ · SectionTitle ✅ ·
 * Chip ✅ · DotPlot ✅ · Button ✅ · CardState ✅ · KpiBlocks (app) ✅.
 */

export interface ProgrammeStoryProps {
  programme: PortalDashboard;
  viewing: Viewing;
  readings: Readings;
  scope: AreaScope;
  sectionLevel: 2 | 3;
  go: (to: Partial<Record<"programme" | "state", string | null>>) => void;
  /** The programme's mapped KPIs, State/UT by State/UT (`stateMeasures`); All India only. */
  states?: StateMeasure[];
}

const DEPARTMENT = "Department of Social Justice and Empowerment";

/**
 * SECTIONS OF ONE CARD SHARE A ROW (design review, 7 Oct 2026). A section holding one card drew
 * it across the whole page — SHRESHTA's two rings each a full row, half of it empty. Two
 * single-CHART sections sit side by side; single-FIGURE sections gather, up to three a row, at
 * the place of the first of them. A figure is never paired with a chart: the figure's card
 * would stretch to the chart's height and stand mostly empty. Any other section keeps its row.
 */
type Placed = { key: string; single: "figure" | "chart" | null; node: React.ReactNode };
function pairSections(sections: Placed[]): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const used = new Set<string>();
  const figures = sections.filter((x) => x.single === "figure");
  const row = (group: Placed[], cls: string) => (
    <div key={group.map((g) => g.key).join("+")} className={cls}>
      {group.map((g) => g.node)}
    </div>
  );
  for (let i = 0; i < sections.length; i++) {
    const a = sections[i]!;
    if (used.has(a.key)) continue;
    if (a.single === "figure" && figures.length > 1) {
      // Every single-figure section, in order, from here: rows of three (two where four).
      const rest = figures.filter((x) => !used.has(x.key));
      const per = rest.length === 4 ? 2 : 3;
      for (let j = 0; j < rest.length; j += per) out.push(row(rest.slice(j, j + per), `pd-section-pair pd-section-pair--${Math.min(per, rest.length - j)}`));
      rest.forEach((x) => used.add(x.key));
      continue;
    }
    const b = sections[i + 1];
    if (a.single === "chart" && b?.single === "chart") {
      out.push(row([a, b], "pd-section-pair pd-section-pair--2"));
      used.add(a.key).add(b.key);
      i++;
      continue;
    }
    out.push(a.node);
    used.add(a.key);
  }
  return out;
}

export function ProgrammeStory({ programme: p, viewing, readings, scope, sectionLevel, go, states = [] }: ProgrammeStoryProps) {
  const demo = useDataMode();
  const [category, setCategory] = React.useState("all");
  // A programme made of components (Senior Citizens Welfare) is filtered by component, as the
  // landing page is by Department and portal (instruction, 6 Oct 2026).
  const [component, setComponent] = React.useState("all");
  const reading = readings[p.id] ?? {};
  const kpis = shownKpis(p, viewing, readings, scope);
  const components = p.kpis.some((k) => k.component);
  const sub = (sectionLevel === 2 ? 3 : 4) as 3 | 4;

  const pace = components ? fundsRows({ ...viewing, programmes: [p] }, readings) : [];
  const cats = KPI_CATEGORIES.filter((c) => kpis.some((k) => k.category === c.id));
  const inView = kpis.filter((k) => (category === "all" || k.category === category) && (component === "all" || k.component === component));
  const componentList = [...new Set(kpis.flatMap((k) => (k.component ? [k.component] : [])))];
  const componentShort = (c: string) => {
    const id = p.kpis.find((k) => k.component === c)?.id.split(".")[1] ?? "";
    return COMPONENT_SHORT[id] ?? c;
  };

  let body: React.ReactNode;
  if (!covers(p.id, scope)) {
    body = (
      <CardState
        kind="no-results"
        title={`No Figures for ${scope.state}`}
        description={`${p.name.split(" – ")[0]} is not implemented in ${scope.state}, or publishes All-India figures only.`}
        action={
          <Button appearance="outlined" size="sm" onClick={() => go({ state: null })}>
            Show All India
          </Button>
        }
      />
    );
  } else if (kpis.length === 0 && demo.mode === "live") {
    body = <CardState kind="not-published" title="Live Figures Not Yet Available" description={`${p.portal} has not yet connected its indicators to this dashboard.`} />;
  } else if (components) {
    body = pairSections(
      [...new Set(inView.map((k) => k.component!))].map((c, i) => {
        const these = inView.filter((k) => k.component === c);
        return {
          key: c,
          single: these.length === 1 ? (isTile(reading[these[0]!.id]!) ? "figure" : "chart") : null,
          node: (
            <section key={c} className="pd-section" aria-labelledby={`pd-c${i}`}>
              <SectionTitle as={sub} headingId={`pd-c${i}`} title={c} />
              <KpiBlocks kpis={these} reading={reading} areasAreStates={!scope.state} headingLevel={4} showComponent={false} />
            </section>
          ),
        };
      }),
    );
  } else {
    body = pairSections(
      cats
        .filter((c) => category === "all" || c.id === category)
        .map((c) => {
          const these = inView.filter((k) => k.category === c.id);
          const map = c.id === "geography" && states.length > 0 && !scope.state;
          return {
            key: c.id,
            single: these.length === 1 && !map ? (isTile(reading[these[0]!.id]!) ? "figure" : "chart") : null,
            node: (
              <section key={c.id} className="pd-section" aria-labelledby={`pd-${c.id}`}>
                <SectionTitle as={sub} headingId={`pd-${c.id}`} title={c.title} />
                <KpiBlocks kpis={these} reading={reading} areasAreStates={!scope.state} headingLevel={4} />
                {/* Where the scheme works, State/UT by State/UT: All India only — a State/UT's page
                    is already that State's figures. */}
                {map ? <StateBreakdown measures={states} headingLevel={4} onSelectState={(state) => go({ state })} /> : null}
              </section>
            ),
          };
        }),
    );
  }

  return (
    <div className="pd-story">
      <StoryHeader
        tone={PROGRAMME_TONE[p.id]}
        mark={<OrgLogo path={p.logoPath} size="md" name="" />}
        // The portal's name leads, the scheme's under it, as on its card (instruction, 7 Oct 2026).
        title={p.portal}
        subtitle={p.name}
        summary={p.summary}
        // The body that runs the portal, where it is not the Department itself.
        meta={p.owner === DEPARTMENT ? p.period : `${p.period} · ${p.owner}`}
        action={
          <Button appearance="outlined" tone="inverse" size="sm" href={p.portalHref} linkAs={Link} iconRight={<Icon name="arrow_outward" size={16} />}>
            Open Portal
          </Button>
        }
        sectionLevel={sectionLevel}
      />

      {pace.length ? (
        <section className="pd-section" aria-labelledby="pd-pace">
          <SectionTitle as={sub} headingId="pd-pace" title="Expenditure Against Budget Estimate" description="Expenditure as a share of the Budget Estimate, by component, up to 30.09.2026." />
          <Card variant="outlined">
            <CardBody>
              <DotPlot
                title={`${p.name}: spent as a share of the Budget Estimate, by component`}
                rows={pace.map((r) => ({ label: r.label.replace("Senior Citizens · ", ""), value: Math.round((r.spent / r.provided) * 1000) / 10, detail: `${compact(r.spent, "crore")} of ${compact(r.provided, "crore")}` }))}
                reference={{ value: 50, label: "Year elapsed" }}
              />
            </CardBody>
          </Card>
        </section>
      ) : null}

      {components && componentList.length > 1 ? (
        <div className="pd-chips" role="group" aria-label="Component">
          <Chip selected={component === "all"} onSelectedChange={() => setComponent("all")} count={kpis.length}>
            All Components
          </Chip>
          {componentList.map((c) => (
            <Chip key={c} selected={component === c} onSelectedChange={() => setComponent(c)} count={kpis.filter((k) => k.component === c).length}>
              {componentShort(c)}
            </Chip>
          ))}
        </div>
      ) : null}
      {cats.length > 1 && !components ? (
        <div className="pd-chips" role="group" aria-label="Theme">
          <Chip selected={category === "all"} onSelectedChange={() => setCategory("all")} count={kpis.length}>
            All Themes
          </Chip>
          {cats.map((c) => (
            <Chip key={c.id} selected={category === c.id} onSelectedChange={() => setCategory(c.id)} count={kpis.filter((k) => k.category === c.id).length}>
              {c.title}
            </Chip>
          ))}
        </div>
      ) : null}
      {body}
    </div>
  );
}
