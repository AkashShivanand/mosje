"use client";

import { COLOR_MODES, ColorModeProvider, SegmentedControl, useColorMode } from "@mosje/design-system";
import * as React from "react";

/** The provider renders nothing of its own; this reads back what it supplied. */
function Readout(): React.JSX.Element {
  const { mode, setMode } = useColorMode();
  return (
    <div style={{ display: "flex", gap: "var(--sa-inline-8)", alignItems: "center" }}>
      <span>
        Current mode: <strong>{mode}</strong>
      </span>
      <SegmentedControl
        ariaLabel="Colour mode"
        options={COLOR_MODES.map((m) => ({ value: m.id, label: m.label }))}
        value={mode}
        onChange={setMode}
      />
    </div>
  );
}

export function Specimen(): React.JSX.Element {
  return (
    <ColorModeProvider>
      <Readout />
    </ColorModeProvider>
  );
}
