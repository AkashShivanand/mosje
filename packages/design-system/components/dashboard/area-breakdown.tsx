"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Card, CardBody, CardFooter, CardHeader, CardSubtitle, CardTitle } from "../data-display/card";
import { IndiaMap } from "../data-display/charts/india-map";
import { RankedBarList } from "../data-display/charts/ranked-bar-list";
import type { ValueFormat } from "../data-display/charts/internal/format";
import { ChartCard } from "./chart-card";
import { SegmentedControl } from "./filter-bar";
import type { AreaRow } from "./kpi-types";
import "./area-breakdown.css";

export interface AreaMeasure {
  id: string;
  /** What the figure counts, in full — "Persons Engaged in Begging Identified". */
  name: string;
  /** Its word on the switch, where there is more than one measure — "Identified". */
  label: string;
  rows: AreaRow[];
}

/* ══ AreaBreakdown ══════════════════════════════════════════════════════════ */

/**
 * MoSJE / SAMAVESH AreaBreakdown — one programme's figures State/UT by State/UT: the map, a
 * switch between the figures it can show, and the same figures ranked beside it.
 *
 * Built for the website's Beneficiary Dashboard (Oct 2026), after the SMILE – Beggary
 * handoff's State-wise Beneficiary Distribution. The map and the list read ONE measure, so they
 * can never disagree (`data-state-completeness.md` §2). Choosing a State/UT on the map calls
 * `onSelectArea` — on the dashboard that sets the page's area, so the map is a way into a
 * State's figures, not a second picture of them. Each chart keeps its table for screen readers.
 *
 * DS Audit: ChartCard ✅ · SegmentedControl (`buttons`) ✅ · IndiaMap ✅ · RankedBarList ✅.
 */
export interface AreaBreakdownProps {
  measures: AreaMeasure[];
  /** @default "State/UT-wise Figures" */
  title?: string;
  /** @default 3 */
  headingLevel?: 2 | 3 | 4;
  valueFormat?: ValueFormat;
  onSelectArea?: (area: string) => void;
  /** Names the measure switch for a screen reader. @default "Figure shown" */
  switchLabel?: string;
  /** Rows a page of the ranked list holds. @default 10 */
  pageSize?: number;
  className?: string;
}

export function AreaBreakdown({
  measures,
  title = "State/UT-wise Figures",
  headingLevel = 3,
  valueFormat,
  onSelectArea,
  switchLabel = "Figure shown",
  pageSize = 10,
  className,
}: AreaBreakdownProps) {
  const [picked, setPicked] = React.useState(measures[0]?.id ?? "");
  const m = measures.find((x) => x.id === picked) ?? measures[0];
  if (!m) return null;
  const ranked = [...m.rows].sort((a, b) => b.value - a.value);
  return (
    <ChartCard
      variant="outlined"
      headingLevel={headingLevel}
      title={title}
      subtitle={m.name}
      className={className}
      actions={
        measures.length > 1 ? (
          <SegmentedControl variant="buttons" ariaLabel={switchLabel} value={m.id} onChange={setPicked} options={measures.map((x) => ({ value: x.id, label: x.label }))} />
        ) : undefined
      }
    >
      <div className="ds-area-breakdown-frame">
      <div className="ds-area-breakdown ds-area-arrive" key={m.id}>
        <IndiaMap
          title={`${m.name}, by State/UT`}
          data={m.rows.map((r) => ({ state: r.area, value: r.value }))}
          valueFormat={valueFormat}
          legendFormat={valueFormat}
          scale="quantile"
          onSelect={onSelectArea}
          tableView="sr-only"
        />
        <RankedBarList
          title={`${m.name}, States/UTs ranked`}
          items={ranked.map((r) => ({ label: r.area, value: r.value }))}
          max={ranked[0]?.value}
          valueFormat={valueFormat}
          showRank
          size="md"
          sort="none"
          pageSize={pageSize}
        />
      </div>
      </div>
    </ChartCard>
  );
}

/* ══ AreaExplorer ═══════════════════════════════════════════════════════════ */

/**
 * MoSJE / SAMAVESH AreaExplorer — the map of India beside a panel that answers for it: the
 * highest and lowest five States/UTs until the reader picks one, then that State/UT.
 *
 * Built for the website's Beneficiary Dashboard (Oct 2026, Figma Option B). The panel's
 * picked-State content is the caller's (`selectedContent`, `selectedActions`), because what a
 * page knows about one State/UT is the page's; the extremes are drawn here from `rows`.
 *
 * DS Audit: Card ✅ · IndiaMap ✅ · RankedBarList ✅.
 */
export interface AreaExplorerProps {
  /** What the map shades by — "Total Outreach". */
  measureName: string;
  rows: AreaRow[];
  valueFormat?: ValueFormat;
  /** The picked State/UT, if any. */
  selected?: string;
  onSelect: (area: string | undefined) => void;
  /** The panel's body for the picked State/UT. */
  selectedContent?: React.ReactNode;
  /** The panel's footer for the picked State/UT — a way to the State's own figures. */
  selectedActions?: React.ReactNode;
  /** @default { extremes: "Highest and Lowest", highest: "Highest Five", lowest: "Lowest Five" } */
  copy?: { extremes?: string; highest?: string; lowest?: string };
  /** How many States/UTs each end of the extremes lists. @default 5 */
  extremesCount?: number;
  /** The level of the "Highest Five" / "Lowest Five" labels. @default 4 */
  labelLevel?: 3 | 4 | 5;
  className?: string;
}

export function AreaExplorer({
  measureName,
  rows,
  valueFormat,
  selected,
  onSelect,
  selectedContent,
  selectedActions,
  copy,
  extremesCount = 5,
  labelLevel = 4,
  className,
}: AreaExplorerProps) {
  const words = { extremes: "Highest and Lowest", highest: "Highest Five", lowest: "Lowest Five", ...copy };
  const Label = `h${labelLevel}` as "h4";
  const ranked = [...rows].sort((a, b) => b.value - a.value);
  const rank = selected ? ranked.findIndex((r) => r.area === selected) + 1 : 0;
  return (
    <div className={cn("ds-area-explorer-frame", className)}>
    <div className="ds-area-explorer">
      <Card variant="outlined" className="ds-area-explorer__map">
        <CardBody>
          <IndiaMap
            title={measureName}
            data={rows.map((r) => ({ state: r.area, value: r.value }))}
            valueFormat={valueFormat}
            legendFormat={valueFormat}
            scale="quantile"
            selected={selected}
            onSelect={onSelect}
            tableView="sr-only"
          />
        </CardBody>
      </Card>
      <Card variant="outlined" className="ds-area-explorer__panel">
        {selected ? (
          <>
            <CardHeader>
              <div>
                <CardTitle size="sm">{selected}</CardTitle>
                {rank > 0 ? <CardSubtitle>{`${rank} of ${ranked.length} · ${measureName}`}</CardSubtitle> : null}
              </div>
            </CardHeader>
            <CardBody>{selectedContent}</CardBody>
            {selectedActions ? <CardFooter>{selectedActions}</CardFooter> : null}
          </>
        ) : (
          <>
            <CardHeader>
              <div>
                <CardTitle>{words.extremes}</CardTitle>
                <CardSubtitle>{measureName}</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody className="ds-area-explorer__extremes">
              <div className="ds-area-explorer__group">
                <Label className="ds-area-explorer__label">{words.highest}</Label>
                <RankedBarList
                  title={`${measureName}, ${words.highest.toLowerCase()}`}
                  items={ranked.slice(0, extremesCount).map((r) => ({ label: r.area, value: r.value }))}
                  max={ranked[0]?.value}
                  valueFormat={valueFormat}
                  showRank
                  size="md"
                  sort="none"
                />
              </div>
              <div className="ds-area-explorer__group">
                <Label className="ds-area-explorer__label">{words.lowest}</Label>
                <RankedBarList
                  title={`${measureName}, ${words.lowest.toLowerCase()}`}
                  items={ranked.slice(-extremesCount).map((r, i) => ({ label: r.area, value: r.value, detail: `${ranked.length - extremesCount + 1 + i} of ${ranked.length}` }))}
                  max={ranked[0]?.value}
                  valueFormat={valueFormat}
                  showRank={false}
                  showBar={false}
                  size="md"
                  sort="none"
                />
              </div>
            </CardBody>
          </>
        )}
      </Card>
    </div>
    </div>
  );
}
