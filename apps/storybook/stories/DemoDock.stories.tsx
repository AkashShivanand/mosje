import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColorModeProvider, DemoDock } from "@mosje/design-system";

/**
 * **DemoDock** — the single floating console a presenter uses to drive a demo
 * of the estate: switch the SAMAVESH brand-palette colour mode, jump to any
 * portal / the website / the design system / Storybook / the QC reports, and
 * sign in with demo credentials. It replaces three overlapping widgets that
 * used to compete for screen space (the old `AppSwitcher` FAB, its
 * hand-rolled colour swatches, and a `DemoFab` mounted per login page).
 *
 * **This is demo tooling, not product UI.** Nothing here is meant to be seen
 * by a citizen or an officer using a real portal — the footer says so on
 * every render (`Demo tooling — not part of the product`), which is what
 * stops a screenshot of the dock being mistaken for shipped chrome. In the
 * hub it is mounted once, above every page, by `ConditionalDemoDock`, and is
 * hidden entirely when `NEXT_PUBLIC_DEMO_TOOLS === "false"`.
 *
 * `pathname` drives two things: the "Currently in" label on every tab (via
 * `apps`/`DEFAULT_APPS`), and which demo accounts appear on **Sign in**
 * (via `findDemoAccounts`). Where the current path matches nothing in the
 * registry — a dashboard, the marketing site — **the Sign in tab is not
 * rendered at all**, not shown empty. That is the behaviour the
 * `NoAccountsForThisPath` story below exists to prove.
 *
 * Requires a **`ColorModeProvider`** ancestor: the Colour tab renders
 * `ColorModeSwitcher`, which calls `useColorMode()` and throws outside one —
 * every story here is wrapped for that reason.
 *
 * `label` names both the FAB and the panel's header title, in case a
 * consumer wants something other than the default "Demo tools". `apps`
 * overrides the destination registry the Apps tab searches, and matters only
 * to a consumer building a scoped or test registry — production code leaves
 * it at its default (`DEFAULT_APPS`).
 *
 * Opening the dock always starts on **Apps**, regardless of which tab was
 * open when it was last closed — a demo should start from the same place
 * every time. Escape and an outside click both close it; focus returns to
 * the FAB.
 *
 * Lifecycle: **Stable** (demo tooling — never part of the production
 * surface).
 */
const meta = {
  title: "Components/DemoDock",
  component: DemoDock,
  args: {
    pathname: "/portals/nmba/admin/login",
    label: "Demo tools",
  },
  argTypes: {
    pathname: { control: "text" },
    label: { control: "text" },
    apps: { control: false },
  },
  decorators: [
    (Story) => (
      <ColorModeProvider>
        <div style={{ minHeight: 480, position: "relative" }}>
          <Story />
        </div>
      </ColorModeProvider>
    ),
  ],
} satisfies Meta<typeof DemoDock>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Clicks the FAB (and, if given, a tab by index) once the story mounts, so
 * the reviewer sees the expanded state immediately instead of the collapsed
 * FAB. DemoDock keeps its open/tab state internal — there is no controlled
 * prop for it, by design, since the shell is meant to always open fresh on
 * Apps — so driving it from outside means simulating the same click a
 * presenter would make.
 */
function ExpandOnMount({ tabIndex }: { tabIndex?: number }) {
  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const fab = document.querySelector<HTMLButtonElement>(".ds-demodock__fab");
      fab?.click();
      if (tabIndex !== undefined) {
        window.requestAnimationFrame(() => {
          const tabs = document.querySelectorAll<HTMLButtonElement>('.ds-tabs [role="tab"]');
          tabs[tabIndex]?.click();
        });
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [tabIndex]);
  return null;
}

/** Collapsed — just the FAB, bottom-left. Click it to expand the panel. */
export const Playground: Story = {};

/**
 * Expanded on **Apps** — the tab it always opens on. Search (with the `/`
 * shortcut) over the grouped, ~26-entry estate registry: Website, Portals,
 * Reports, Resources.
 */
export const ExpandedOnApps: Story = {
  render: (args) => (
    <>
      <DemoDock {...args} />
      <ExpandOnMount />
    </>
  ),
};

/**
 * Expanded on **Colour** — the SAMAVESH brand-palette picker
 * (`ColorModeSwitcher`) at full size, plus the on-panel note that this is a
 * *brand* axis, not a light/dark theme (that belongs to the official UX4G
 * accessibility widget, not this component).
 */
export const ExpandedOnColour: Story = {
  render: (args) => (
    <>
      <DemoDock {...args} />
      <ExpandOnMount tabIndex={1} />
    </>
  ),
};

/**
 * Expanded on **Sign in** — the demo credentials for whatever login surface
 * `pathname` resolves to (here, NMBA's admin login: Admin, State/District/
 * Block Nodal Officers, and the NAPDDR reporting roles). Each row's **Use**
 * button dispatches the global `demo:fill` CustomEvent; a real NMBA login
 * page listens for it and prefills.
 */
export const ExpandedOnSignIn: Story = {
  args: {
    pathname: "/portals/nmba/admin/login",
  },
  render: (args) => (
    <>
      <DemoDock {...args} />
      <ExpandOnMount tabIndex={2} />
    </>
  ),
};

/**
 * `pathname` is `/website` — nowhere in the demo-accounts registry. Open the
 * dock: it has only **two** tabs, Apps and Colour. "Sign in" is not rendered
 * at all, rather than appearing with an empty table — an empty credentials
 * list would read as a bug, not a deliberate absence.
 */
export const NoAccountsForThisPath: Story = {
  args: {
    pathname: "/website",
  },
  render: (args) => (
    <>
      <DemoDock {...args} />
      <ExpandOnMount />
    </>
  ),
};
