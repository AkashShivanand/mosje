"use client";

import * as React from "react";
import { Tabs, TabPanel, type TabDef } from "@mosje/design-system";

const DEMO_TABS: TabDef[] = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Details" },
  { id: "history", label: "History" },
];

const PANEL_TEXT: Record<string, string> = {
  overview: "Overview panel. Focus a tab and press the Arrow keys to move between sections — focus follows selection.",
  details: "Details panel. Only the active tab is in the tab order (roving tabindex); the others are reachable with Arrow keys.",
  history: "History panel. Press Home or End to jump to the first or last tab.",
};

/** Live, interactive demo of the design-system Tabs / TabPanel. */
export function TabsDemo(): React.JSX.Element {
  const [active, setActive] = React.useState(0);
  const idBase = React.useId();
  const tab = DEMO_TABS[active]!;
  return (
    <div>
      <Tabs tabs={DEMO_TABS} active={active} onChange={setActive} idBase={idBase} ariaLabel="Demo sections" />
      <TabPanel idBase={idBase} tabId={tab.id}>
        <div
          style={{
            marginTop: "var(--ds-spacing-lg)",
            padding: "var(--ds-spacing-xl)",
            border: "1px solid var(--ds-border)",
            borderRadius: "var(--ds-radius-lg, 10px)",
            background: "var(--ds-surface)",
            color: "var(--ds-ink)",
            fontSize: "var(--ds-text-body-1)",
            lineHeight: 1.6,
          }}
        >
          {PANEL_TEXT[tab.id]}
        </div>
      </TabPanel>
    </div>
  );
}
