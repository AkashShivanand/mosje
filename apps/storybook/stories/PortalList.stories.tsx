import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { PortalList, SideSheet, Button, DEFAULT_APPS } from "@mosje/design-system";

/**
 * **PortalList** — the scrollable list of portals inside the change-portal
 * picker. Mirrors `Auth / PortalList` (`55444:709`), which drops into
 * `SideSheet`'s Content slot.
 *
 * There is deliberately **no `PortalPicker` component**: the picker is
 * `SideSheet` + this, which is the Figma master's own decision. A third name for
 * the composition would add a word without adding a decision.
 *
 * Labels come from `PORTAL_LABELS`, never from the list — that map exists because
 * two surfaces needed the same answer and disagreed, and the banner once showed
 * "PM-AJAY / Pradhan Mantri Anusuchit Jaati Abhyuday Yojana" while `/portals`
 * showed "PM / PM-AJAY".
 */
const meta: Meta<typeof PortalList> = {
  title: "Auth/PortalList",
  component: PortalList,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PortalList>;

/** The live estate, as the picker shows it. */
export const Default: Story = {
  render: () => (
    <div style={{ width: 400, border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: 16 }}>
      <PortalList />
    </div>
  ),
};

/** With the reader's current portal marked — a 2px rule, a check and `aria-current`. */
export const WithCurrentPortal: Story = {
  render: () => (
    <div style={{ width: 400, border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: 16 }}>
      <PortalList activePath="/portals/e-anudaan" />
    </div>
  ),
};

/**
 * `includePlanned` shows the whole estate, with portals that are not open yet
 * drawn as disabled cards. Off by default: this list is usually a way IN, and a
 * way in that mostly cannot be taken is a worse list.
 *
 * With more categories present, the filter row appears — it is hidden when every
 * portal sits in one category, because "All (8)" beside "Scheme Portals (8)" is
 * two controls that do the same thing.
 */
export const IncludingPlanned: Story = {
  render: () => (
    <div style={{ width: 400, border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: 16 }}>
      <PortalList includePlanned activePath="/portals/nmba" />
    </div>
  ),
};

/**
 * FILTERED TO NOTHING is worded differently from EMPTY, and names the way back.
 * "No portal is in this category" and "there are no portals" are different
 * sentences with different remedies.
 */
export const NoPortalsAtAll: Story = {
  render: () => (
    <div style={{ width: 400, border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: 16 }}>
      <PortalList apps={DEFAULT_APPS.filter((a) => a.group !== "Portals")} />
    </div>
  ),
};

/** The picker as a surface actually composes it: `SideSheet` + `PortalList`. */
export const InsideThePicker: Story = {
  render: function PickerStory() {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ minHeight: 420 }}>
        <Button onClick={() => setOpen(true)}>Change portal</Button>
        <SideSheet open={open} onClose={() => setOpen(false)} title="Choose a portal to login">
          <PortalList activePath="/portals/e-anudaan" />
        </SideSheet>
      </div>
    );
  },
};

/**
 * `onSelect` and `filterable` — the two ways a surface bends this list.
 *
 * **`onSelect` is for a picker that must not navigate**: a wizard step that
 * records the choice, say. Omit it and every card stays a real `<a href>`, which
 * is what the login picker wants — middle-click, "copy link address" and a
 * keyboard Enter all work, and it survives JavaScript being off. Reach for
 * `onSelect` only when navigation is genuinely not what should happen.
 *
 * **`filterable={false}`** drops the category row for a surface that is already
 * scoped. The row also hides itself when there is nothing to choose between, so
 * pass this only when you want it gone even where categories differ.
 */
export const InterceptedAndUnfiltered: Story = {
  render: function InterceptedStory() {
    const [chosen, setChosen] = React.useState<string | null>(null);
    return (
      <div style={{ width: 400 }}>
        <p style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
          {chosen ? `Recorded: ${chosen} — nothing navigated.` : "Choose a portal; the click is intercepted."}
        </p>
        <div style={{ border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: 16 }}>
          <PortalList
            filterable={false}
            includePlanned
            onSelect={(entry) => setChosen(entry.name)}
          />
        </div>
      </div>
    );
  },
};
