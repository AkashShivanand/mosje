"use client";
import * as React from "react";
import { Button, Checkbox, Popover, Select } from "@mosje/design-system";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

const PANEL: React.CSSProperties = {
  padding: "var(--sa-padding-40)",
  background: "var(--sa-bg-neutral-subtle)",
  borderRadius: "var(--sa-shape-8)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--sa-stack-32)",
};

const CONTROL_ROW: React.CSSProperties = {
  display: "flex",
  gap: "var(--sa-inline-16)",
  flexWrap: "wrap",
  alignItems: "center",
  fontSize: "var(--sa-type-label-1-size)",
  lineHeight: "var(--sa-type-label-1-lh)",
};

const FIELD: React.CSSProperties = {
  padding: "var(--sa-padding-4) var(--sa-padding-8)",
  borderRadius: "var(--sa-shape-4)",
  border: "var(--sa-cmp-divider-width) solid var(--sa-border-neutral-subtle)",
};

/**
 * Every arrangement the component publishes, on one surface: the two content
 * shapes (a passage, and controls), the three alignments, the four sides, the
 * matched width, and the disabled trigger.
 */
export function PopoverPlayground(): React.JSX.Element {
  const [side, setSide] = React.useState<Side>("bottom");
  const [align, setAlign] = React.useState<Align>("start");
  const [matchTriggerWidth, setMatchTriggerWidth] = React.useState(false);

  return (
    <div style={PANEL}>
      <div style={CONTROL_ROW}>
        <label style={{ display: "flex", gap: "var(--sa-inline-8)", alignItems: "center" }}>
          <strong>Side:</strong>
          <select
            value={side}
            onChange={(e) => setSide(e.target.value as Side)}
            style={FIELD}
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </label>
        <label style={{ display: "flex", gap: "var(--sa-inline-8)", alignItems: "center" }}>
          <strong>Align:</strong>
          <select
            value={align}
            onChange={(e) => setAlign(e.target.value as Align)}
            style={FIELD}
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
          </select>
        </label>
        <Checkbox
          label="Match trigger width"
          size="sm"
          checked={matchTriggerWidth}
          onCheckedChange={setMatchTriggerWidth}
        />
      </div>

      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap" }}>
        <Popover
          label="Processing time"
          side={side}
          align={align}
          matchTriggerWidth={matchTriggerWidth}
          content="Applications are processed in the order they are received. The stated period counts working days and excludes gazetted holidays."
        >
          <Button appearance="outlined">Guidance</Button>
        </Popover>

        <Popover
          title="Filter applications"
          side={side}
          align={align}
          matchTriggerWidth={matchTriggerWidth}
          content={({ close }) => (
            <div style={{ display: "grid", gap: "var(--sa-stack-12)" }}>
              <Select
                aria-label="Status"
                options={[
                  { value: "all", label: "All statuses" },
                  { value: "pending", label: "Pending verification" },
                  { value: "approved", label: "Approved" },
                  { value: "returned", label: "Returned for correction" },
                ]}
              />
              <Checkbox label="Only applications assigned to me" />
              <div
                style={{
                  display: "flex",
                  gap: "var(--sa-inline-8)",
                  justifyContent: "flex-end",
                }}
              >
                <Button appearance="text" onClick={close}>
                  Cancel
                </Button>
                <Button onClick={close}>Apply</Button>
              </div>
            </div>
          )}
        >
          <Button appearance="outlined">Filter</Button>
        </Popover>

        <Popover label="Unavailable" disabled content="This never opens.">
          <Button appearance="outlined" disabled>
            Disabled
          </Button>
        </Popover>
      </div>
    </div>
  );
}
