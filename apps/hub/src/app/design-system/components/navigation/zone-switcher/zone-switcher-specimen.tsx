import * as React from "react";
import { Card, CardBody } from "@mosje/design-system";

/**
 * SCHEMATIC (declared specimen) — the rail's three doors and the panel's tabs.
 *
 * `DemoDock` is `position: fixed` against the right wall, and one is already
 * mounted on this page by the hub's root layout. A second live instance would
 * sit on top of the first, so THE RUNNING SPECIMEN IS THE DOCK ON THIS PAGE'S
 * RIGHT EDGE — open it and every behaviour described below is there. This is the
 * map, drawn from design-system components so nothing here is an unbound
 * literal.
 */
const ROWS: Array<[string, string]> = [
  ["Flask (the lead)", "Opens the panel on its first tab. Lights only where that tab is Sign in"],
  ["Apps", "The searchable cross-zone destination list — AppSwitcherPanel"],
  ["Colour", "The SAMAVESH brand-palette picker — ColorModeSwitcher"],
  ["Sign in", "Demo credentials for the current login route. A panel tab with no door"],
];

export function ZoneSwitcherSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      {ROWS.map(([name, note]) => (
        <Card key={name}>
          <CardBody>
            {name} — {note}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
