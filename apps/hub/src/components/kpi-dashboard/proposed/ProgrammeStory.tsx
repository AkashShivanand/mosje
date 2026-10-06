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
  HeadlineFigure,
  Icon,
  OrgLogo,
  SectionTitle,
} from "@mosje/design-system";
import { OriginChip } from "@/components/website/ProvenanceChip";
import { useDataMode } from "@/lib/data-mode/context";
import { KPI_CATEGORIES } from "@/lib/kpi/categories";
import { covers } from "@/lib/kpi/model";
import { kpisFor } from "@/lib/kpi/register";
import type { AreaScope, PortalDashboard } from "@/lib/kpi/types";
import { isTile } from "../KpiCard";
import { KpiBlocks } from "./KpiBlocks";
import { SHORT_NAME, fundsRows, headlineOf, kpiLabel, shownKpis, type Readings, type Viewing } from "./model";
import { PROGRAMME_TONE, compact } from "./story";

/**
 * One programme, told on its own: a hero panel in the programme's colour with its leading
 * figures, then its indicators by theme (or by component, for Senior Citizens), each with
 * its source and calculation while the demo rail shows them. Reached from the programme's tile; `?programme=` holds it.
 *
 * DS Audit: Card (`accent="fill"`) ✅ · HeadlineFigure ✅ · OrgLogo ✅ · SectionTitle ✅ ·
 * Chip ✅ · DotPlot ✅ · Button ✅ · CardState ✅ · KpiBlocks (app) ✅.
 */

export interface ProgrammeStoryProps {
  programme: PortalDashboard;
  viewing: Viewing;
  readings: Readings;
  scope: AreaScope;
  sectionLevel: 2 | 3;
  backHref: string;
  go: (to: Partial<Record<"programme" | "state", string | null>>) => void;
}

const LEAD = 4;

export function ProgrammeStory({ programme: p, viewing, readings, scope, sectionLevel, backHref, go }: ProgrammeStoryProps) {
  const demo = useDataMode();
  const [category, setCategory] = React.useState("all");
  const reading = readings[p.id] ?? {};
  const kpis = shownKpis(p, viewing, readings, scope);
  const all = kpisFor(p, viewing.audience);
  const components = p.kpis.some((k) => k.component);
  const sub = (sectionLevel === 2 ? 3 : 4) as 3 | 4;

  // The hero's figures: the programme's first tile-shaped public figures, in register order.
  const lead = kpis.filter((k) => isTile(reading[k.id]!) && k.audience === "public" && !k.id.endsWith(".progress")).slice(0, LEAD);
  const pace = components ? fundsRows({ ...viewing, programmes: [p] }, readings) : [];
  const cats = KPI_CATEGORIES.filter((c) => kpis.some((k) => k.category === c.id));
  const inView = kpis.filter((k) => category === "all" || k.category === category);

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
    body = [...new Set(inView.map((k) => k.component!))].map((c, i) => (
      <section key={c} className="pd-section" aria-labelledby={`pd-c${i}`}>
        <SectionTitle as={sub} headingId={`pd-c${i}`} title={c} />
        <KpiBlocks kpis={inView.filter((k) => k.component === c)} reading={reading} areasAreStates={!scope.state} headingLevel={4} showComponent={false} />
      </section>
    ));
  } else {
    body = cats
      .filter((c) => category === "all" || c.id === category)
      .map((c) => (
        <section key={c.id} className="pd-section" aria-labelledby={`pd-${c.id}`}>
          <SectionTitle as={sub} headingId={`pd-${c.id}`} title={c.title} />
          <KpiBlocks kpis={inView.filter((k) => k.category === c.id)} reading={reading} areasAreStates={!scope.state} headingLevel={4} />
        </section>
      ));
  }

  const officeCount = all.filter((k) => k.audience === "officer").length;

  return (
    <div className="pd-story">
      <Button appearance="text" size="sm" href={backHref} linkAs={Link} iconLeft={<Icon name="arrow_back" size={16} />} className="pd-back">
        All Programmes
      </Button>
      <Card tone={PROGRAMME_TONE[p.id]} accent="fill" className="pd-hero">
        <CardBody className="pd-hero__body pd-hero__body--programme">
          <div className="pd-hero__intro">
            <div className="pd-hero__brand">
              <span className="pd-hero__mark">
                <OrgLogo path={p.logoPath} size="md" name="" />
              </span>
              <SectionTitle as={sectionLevel} headingId="pd-programme" tone="inverse" eyebrow={SHORT_NAME[p.id]} title={p.name} description={p.owner} />
            </div>
            <p className="pd-hero__summary">{p.summary}</p>
            <p className="pd-hero__meta">
              {p.period} · {all.length - officeCount} public{viewing.audience === "officer" && officeCount ? ` · ${officeCount} office` : ""} indicators · {p.portal}
            </p>
            <Button appearance="outlined" tone="inverse" size="sm" href={p.portalHref} linkAs={Link} iconRight={<Icon name="arrow_outward" size={16} />}>
              Open {p.portal}
            </Button>
          </div>
          {lead.length ? (
            <ul className="pd-hero__side" aria-label={`${SHORT_NAME[p.id]} at a glance`}>
              {lead.map((k) => {
                const r = reading[k.id]!;
                const h = headlineOf(k, r);
                return h ? (
                  <li key={k.id}>
                    <HeadlineFigure
                      size="md"
                      tone="inverse"
                      value={compact(h.value, h.unit)}
                      label={kpiLabel(k)}
                      mark={r.origin === "snapshot" ? undefined : <OriginChip origin={r.origin} />}
                    />
                  </li>
                ) : null;
              })}
            </ul>
          ) : null}
        </CardBody>
      </Card>

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
