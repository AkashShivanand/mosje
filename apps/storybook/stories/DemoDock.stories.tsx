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
 * by a citizen or an officer using a real portal. In the hub it is mounted
 * once, above every page, by `ConditionalDemoDock`, and is hidden entirely
 * when `NEXT_PUBLIC_DEMO_TOOLS === "false"`.
 *
 * `pathname` drives three things:
 * - the "Currently in" label (via `apps`/`DEFAULT_APPS`);
 * - which demo accounts *exist* for the current portal (via
 *   `findDemoAccounts`, a path-prefix match — a dashboard three levels under
 *   a portal still has a set);
 * - whether **Sign in** actually renders (via `isLoginRoute` — a *narrower*
 *   check than the above: only a path literally ending in `/login`,
 *   `/login-otp` or `/sign-in` counts). A path with a set but that isn't a
 *   login route itself — a dashboard, a report — gets no Sign in tab at all,
 *   not shown empty. `SignInHiddenOffLoginRoute` below proves that case;
 *   `NoAccountsForThisPath` proves the "no set at all" case.
 *
 * When Sign in does apply it is the **first** tab, and the one selected on
 * open — it's the reason a reviewer opens the dock on a login page. Apps and
 * Colour follow behind it in their usual order. Where the current path is
 * not a login route, the dock opens on Apps as before.
 *
 * Requires a **`ColorModeProvider`** ancestor: the Colour tab calls
 * `useColorMode()` directly (there's no separate switcher component to
 * render) and throws outside one — every story here is wrapped for that
 * reason.
 *
 * `label` names both the FAB and the panel's header title, in case a
 * consumer wants something other than the default "Demo tools". `apps`
 * overrides the destination registry the Apps tab searches, and matters only
 * to a consumer building a scoped or test registry — production code leaves
 * it at its default (`DEFAULT_APPS`).
 *
 * Escape and an outside click both close it; focus returns to the FAB. Open
 * and close are both animated (respecting `prefers-reduced-motion`), which
 * doesn't show up in a static screenshot but is worth knowing about when
 * reviewing this component live.
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
 * Opens the dock (and, if given, a tab by index) once the story mounts, so
 * the reviewer sees the expanded state immediately rather than a folded rail.
 * DemoDock keeps its open/tab state internal — there is no controlled prop
 * for it, by design, since the shell is meant to always open fresh on its
 * first tab — so driving it from outside means simulating the clicks a
 * presenter would make.
 *
 * **It takes TWO clicks, and that is the component behaving correctly.** The
 * lead's rule is: if the rail is not expanded, expand it; otherwise open the
 * panel. A real pointer user never notices, because hovering the rail has
 * already expanded it before they click. A synthetic `click()` dispatches no
 * hover, so it lands in exactly the state a touch user is in — first click
 * unfolds, second opens. Clicking once here would leave the panel shut and
 * look like a broken story.
 */
function ExpandOnMount({ tabIndex }: { tabIndex?: number }) {
  React.useEffect(() => {
    const frames: number[] = [];
    const lead = () =>
      document.querySelector<HTMLButtonElement>(".ds-demodock__lead");

    frames.push(
      window.requestAnimationFrame(() => {
        lead()?.click(); // unfolds the rail
        frames.push(
          window.requestAnimationFrame(() => {
            lead()?.click(); // opens the panel
            if (tabIndex !== undefined) {
              frames.push(
                window.requestAnimationFrame(() => {
                  const tabs = document.querySelectorAll<HTMLButtonElement>(
                    '.ds-tabs [role="tab"]',
                  );
                  tabs[tabIndex]?.click();
                }),
              );
            }
          }),
        );
      }),
    );

    return () => frames.forEach((f) => window.cancelAnimationFrame(f));
  }, [tabIndex]);
  return null;
}

/**
 * Folded — the resting tab on the right wall: a 26px flask in a tinted cell,
 * and nothing else. Hover it (or tab to it) to unfold the two extra doors and
 * to see the flask wobble; click the flask to open the panel, at which point
 * it becomes a cross. The label is a tooltip, not a wordmark.
 */
export const Playground: Story = {};

/**
 * Expanded on **Sign in** — the tab order when `pathname` is itself a login
 * route (here, NMBA's admin login: Admin, State/District/Block Nodal
 * Officers, and the NAPDDR reporting roles). It's first, and it's what the
 * dock opens on — no click needed beyond the FAB. Each row's **Use** button
 * dispatches the global `demo:fill` CustomEvent; a real NMBA login page
 * listens for it and prefills.
 */
export const ExpandedOnSignIn: Story = {
  render: (args) => (
    <>
      <DemoDock {...args} />
      <ExpandOnMount />
    </>
  ),
};

/**
 * Expanded on **Apps** — one click over from Sign in on a login page. Search
 * (with the `/` shortcut) over the grouped, ~26-entry estate registry:
 * Website, Portals, Reports, Resources.
 */
export const ExpandedOnApps: Story = {
  render: (args) => (
    <>
      <DemoDock {...args} />
      <ExpandOnMount tabIndex={1} />
    </>
  ),
};

/**
 * Expanded on **Colour** — a plain row of brand-palette swatches. Click one
 * to apply it immediately; the active swatch carries a ring and a check
 * mark. No label, no track — the swatches ARE the control.
 */
export const ExpandedOnColour: Story = {
  render: (args) => (
    <>
      <DemoDock {...args} />
      <ExpandOnMount tabIndex={2} />
    </>
  ),
};

/**
 * `pathname` is a real page *under* NMBA (`.../admin/dashboard`), which has
 * a demo account set — but is not itself a login route. Open the dock: it
 * has only **two** tabs, Apps and Colour. `findDemoAccounts` would happily
 * return NMBA's accounts here; `isLoginRoute` is what keeps Sign in off a
 * page where there's no login form to fill.
 */
export const SignInHiddenOffLoginRoute: Story = {
  args: {
    pathname: "/portals/nmba/admin/dashboard",
  },
  render: (args) => (
    <>
      <DemoDock {...args} />
      <ExpandOnMount />
    </>
  ),
};

/**
 * `pathname` is `/website` — nowhere in the demo-accounts registry either.
 * Same two-tab result as `SignInHiddenOffLoginRoute`, for the simpler reason
 * that there's no account set to begin with.
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

/**
 * **`extraTabs`** — teach the dock about a surface it does not ship knowledge of.
 *
 * The dock's three built-in tabs (`signin`, `apps`, `colour`) cover the estate as
 * it stands. A demo that needs its own controls — seeding a dashboard, toggling
 * between live and mock data, jumping to a specific record — appends them here
 * rather than forking the component or mounting a second floating widget beside
 * it, which is the thing the dock exists to have stopped.
 *
 * Ids must not collide with `signin`, `apps` or `colour`. Keep the count low:
 * the dock is a floating panel on someone's screen during a live demo, not a
 * settings page.
 */
export const WithExtraTabs: Story = {
  args: {
    pathname: "/portals/pm-ajay/dashboard",
    extraTabs: [
      {
        id: "data",
        label: "Data",
        content: (
          <p style={{ margin: 0, fontSize: "var(--sa-type-body-2-size)", lineHeight: "var(--sa-type-body-2-lh)" }}>
            Switch this dashboard between live figures and the seeded prototype set.
          </p>
        ),
      },
    ],
  },
};
