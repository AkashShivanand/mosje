"use client";
import * as React from "react";
import { Button, Icon, IconButton, Menu, type MenuEntry } from "@mosje/design-system";

const ROW_ACTIONS: MenuEntry[] = [
  { id: "view", label: "View application", icon: "visibility" },
  { id: "assign", label: "Assign to an officer", icon: "person_add" },
  { id: "download", label: "Download as PDF", icon: "download" },
  { kind: "separator" },
  {
    id: "return",
    label: "Return for correction",
    icon: "undo",
    tone: "warning",
    description: "The applicant is told what to change and can resubmit.",
  },
  {
    id: "reject",
    label: "Reject application",
    icon: "block",
    tone: "danger",
    description: "This cannot be undone.",
  },
];

const WITH_DISABLED: MenuEntry[] = [
  { id: "view", label: "View application", icon: "visibility" },
  {
    id: "approve",
    label: "Approve",
    icon: "check_circle",
    disabled: true,
    description: "Available once the district officer has verified the documents.",
  },
  { id: "download", label: "Download as PDF", icon: "download" },
];

const PANEL: React.CSSProperties = {
  padding: "var(--sa-padding-40)",
  background: "var(--sa-bg-neutral-subtle)",
  borderRadius: "var(--sa-shape-8)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--sa-stack-24)",
};

const ROW: React.CSSProperties = {
  display: "flex",
  gap: "var(--sa-inline-16)",
  flexWrap: "wrap",
  alignItems: "center",
};

const CHOSEN: React.CSSProperties = {
  color: "var(--sa-text-neutral-subtle)",
  fontSize: "var(--sa-type-label-2-size)",
  lineHeight: "var(--sa-type-label-2-lh)",
};

/** Every arrangement: a button trigger, the dense-table icon trigger, single choice, and a disabled item. */
export function MenuPlayground(): React.JSX.Element {
  const [chosen, setChosen] = React.useState<string | null>(null);
  const [sort, setSort] = React.useState("recent");

  return (
    <div style={PANEL}>
      <div style={ROW}>
        <Menu label="Actions for this application" items={ROW_ACTIONS} onSelect={setChosen}>
          <Button appearance="outlined">Actions</Button>
        </Menu>

        <Menu label="Actions for this row" items={ROW_ACTIONS} onSelect={setChosen}>
          <IconButton aria-label="Actions for this row" icon={<Icon name="more_vert" />} />
        </Menu>

        <Menu
          label="Sort applications"
          onSelect={setSort}
          items={[
            { kind: "separator", label: "Sort by" },
            { id: "recent", label: "Most recent first", kind: "radio", checked: sort === "recent" },
            { id: "oldest", label: "Oldest first", kind: "radio", checked: sort === "oldest" },
            { id: "district", label: "District, A to Z", kind: "radio", checked: sort === "district" },
          ]}
        >
          <Button appearance="outlined">Sort</Button>
        </Menu>

        <Menu label="Actions, one unavailable" items={WITH_DISABLED} onSelect={setChosen}>
          <Button appearance="outlined">With a disabled item</Button>
        </Menu>
      </div>

      <p style={CHOSEN}>
        {chosen ? `Last chosen: ${chosen}` : "Nothing chosen yet."} · Sorting by {sort}.
      </p>
    </div>
  );
}
