"use client";

import { Button, ButtonGroup } from "@mosje/design-system";
import * as React from "react";

const VIEWS = ["Week", "Month", "Quarter"] as const;

/**
 * A WORKING SEGMENTED CONTROL, BECAUSE A STILL ONE PROVES NOTHING.
 *
 * `attached` was always documented for buttons that are ALTERNATIVES to one another —
 * a view switcher, a date range — and until 2026-09-03 there was no way to say which
 * alternative was current. `aria-pressed` already typechecked on Button; what was
 * missing was the visible half and anyone knowing to reach for it.
 *
 * Toggle semantics rather than a radiogroup: each segment is a button that is or is not
 * pressed, so Tab reaches every option and Enter/Space commits it. A radiogroup would
 * put the options behind arrow keys and a roving tabindex, which is the right model for
 * a form field and the wrong one for a view switcher sitting beside other controls.
 */
export function SegmentedDemo(): React.JSX.Element {
  const [view, setView] = React.useState<(typeof VIEWS)[number]>("Month");
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-12)" }}>
      <ButtonGroup aria-label="Reporting period" attached>
        {VIEWS.map((v) => (
          <Button
            key={v}
            appearance="outlined"
            aria-pressed={view === v}
            onClick={() => setView(v)}
            data-testid={`seg-${v.toLowerCase()}`}
          >
            {v}
          </Button>
        ))}
      </ButtonGroup>
      <p style={{ margin: 0, color: "var(--sa-text-neutral-subtle)" }}>
        Showing the <strong>{view.toLowerCase()}</strong> figures.
      </p>
    </div>
  );
}
