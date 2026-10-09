"use client";

import * as React from "react";
import {
  AreaBreakdown,
  AreaExplorer,
  Button,
  DescriptionList,
  Icon,
  compactCount,
  shownDate,
  type AreaMeasure,
} from "@mosje/design-system";
import { NMBA_STATES_SNAPSHOT } from "@/lib/kpi/feeds/nmba-states-snapshot";

/*
 * NMBA's Total Outreach by State/UT — the mirrored snapshot of the NMBA public API the
 * Beneficiary Dashboard falls back to (read 7 Oct 2026). NMBA publishes one State-wise
 * measure, so the measure switch, which appears from two measures up, is not drawn here.
 */
const ROWS = NMBA_STATES_SNAPSHOT.rows.map((r) => ({ area: r.area, value: r.value }));
const MEASURES: AreaMeasure[] = [{ id: "nmba.outreach", name: "Total Outreach", label: "Outreach", rows: ROWS }];

/** Both components, sharing one choice: picking a State/UT on either map opens it in the explorer. */
export function AreaPlayground(): React.JSX.Element {
  const [selected, setSelected] = React.useState<string | undefined>();
  const row = ROWS.find((r) => r.area === selected);
  return (
    <div className="cdp-stack">
      <p className="cdp-states__label">Area Breakdown — the map and the same figures ranked</p>
      <AreaBreakdown
        measures={MEASURES}
        title="State/UT-wise Figures"
        headingLevel={3}
        valueFormat={compactCount}
        onSelectArea={setSelected}
      />
      <p className="cdp-states__label">Area Explorer — the extremes until a State/UT is picked</p>
      <AreaExplorer
        measureName="Total Outreach"
        rows={ROWS}
        valueFormat={compactCount}
        selected={selected}
        onSelect={setSelected}
        selectedContent={
          row ? (
            <DescriptionList
              size="md"
              columns={2}
              items={[
                { term: "Total Outreach", value: compactCount(row.value) },
                { term: "As On", value: shownDate(NMBA_STATES_SNAPSHOT.asOn) },
              ]}
            />
          ) : null
        }
        selectedActions={
          <Button appearance="text" size="sm" onClick={() => setSelected(undefined)} iconLeft={<Icon name="arrow_back" size={16} />}>
            Show Highest and Lowest
          </Button>
        }
      />
    </div>
  );
}
