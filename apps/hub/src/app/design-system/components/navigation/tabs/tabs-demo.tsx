"use client";

import * as React from "react";
import {
  Tabs,
  TabPanel,
  type TabDef,
  type TabIndicator,
  type TabOrientation,
  type TabSize,
  type TabTrack,
} from "@mosje/design-system";

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

const panelStyle: React.CSSProperties = {
  marginTop: "var(--sa-stack-16)",
  padding: "var(--sa-padding-20)",
  border: "1px solid var(--sa-border-neutral-subtle)",
  borderRadius: "var(--sa-shape-12)",
  background: "var(--sa-bg-neutral-base)",
  color: "var(--sa-text-neutral-base)",
  fontSize: "var(--sa-type-body-1-size)",
  lineHeight: "var(--sa-type-body-1-lh)",
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
        <div style={panelStyle}>{PANEL_TEXT[tab.id]}</div>
      </TabPanel>
    </div>
  );
}

/**
 * A tablist on its own, with no panel — for specimens where the point is the
 * chrome rather than the wiring. It is still a real, keyboard-operable `Tabs`,
 * so a reader can tab into it and feel the behaviour the prose describes.
 */
export function TabsSpecimen({
  tabs = DEMO_TABS,
  label,
  start = 0,
  width,
  ...rest
}: {
  tabs?: TabDef[];
  label: string;
  start?: number;
  width?: number;
  indicator?: TabIndicator;
  size?: TabSize;
  track?: TabTrack;
  orientation?: TabOrientation;
  divider?: boolean;
}): React.JSX.Element {
  const [active, setActive] = React.useState(start);
  const idBase = React.useId();
  return (
    <div style={width ? { width } : undefined}>
      <Tabs
        {...rest}
        tabs={tabs}
        active={active}
        onChange={setActive}
        idBase={idBase}
        ariaLabel={label}
      />
    </div>
  );
}

/** The three sizes, stacked, so the 36 / 44 / 48 ladder is visible at once. */
export function TabsSizeSpecimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
      <TabsSpecimen size="s" label="Small tabs" />
      <TabsSpecimen size="m" label="Medium tabs" />
      <TabsSpecimen size="l" label="Large tabs" />
    </div>
  );
}

/** Icons, the unread dot, and a disabled section that arrow keys step over. */
export function TabsContentSpecimen(): React.JSX.Element {
  return (
    <TabsSpecimen
      label="Application sections"
      tabs={[
        { id: "details", label: "Details", icon: "description" },
        { id: "documents", label: "Documents", icon: "folder_open", badge: true },
        { id: "history", label: "History", icon: "history" },
        { id: "remarks", label: "Remarks", icon: "chat", disabled: true },
      ]}
    />
  );
}
