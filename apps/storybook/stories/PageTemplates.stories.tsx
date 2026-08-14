import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AppShell,
  SiteLayout,
  PageHeader,
  Band,
  Button,
  Card,
  CardBody,
  SidebarNav,
} from "@mosje/design-system";

/**
 * **Page templates** — `AppShell`, `SiteLayout` and `PageHeader`: the skeletons
 * a page is assembled into. Lifecycle: **Beta**.
 *
 * @covers AppShell, SiteLayout, PageHeader
 *
 * **AppShell** is the signed-in portal page. Its chrome rows are `auto` and its
 * body row is `1fr`, so nothing subtracts a chrome height from the viewport —
 * which matters because the brand row hugs its content, making any
 * `calc(100vh - <constant>)` wrong by construction. Slots: `header`, `sidebar`,
 * `children`, `footer`. `pending` renders a skeleton instead of `children`,
 * replacing the `return null` that flashes a blank page while an app hydrates.
 * Below the tablet anchor the sidebar becomes a drawer — drive it with
 * `sidebarOpen` / `onSidebarOpenChange`, name it with `sidebarLabel`, and set
 * `mainId` if your skip link points somewhere other than `#main`. It is
 * presentational: it holds no session and performs no redirect, so keep an auth
 * guard as a thin wrapper around it.
 *
 * **SiteLayout** is the public website page: `header`, then `banner`, `hero`
 * and a stack of `<Band>`s in `children`, then `footer`, with `overlays` for
 * floating chrome. Its main region grows so a short page still pins the footer
 * to the bottom. `mainId` and `className` behave as on AppShell.
 *
 * **PageHeader** is the row a portal page opens with: `title`, an optional
 * `meta` line and `actions`. It hugs — a two-line scheme name and a one-word
 * dashboard title are both correct. `as` drops it to an `h2` where the page
 * already has an `h1`; `headingId` lets a region point `aria-labelledby` at it.
 * Use `SectionTitle` instead when the heading labels a section rather than the
 * page.
 */
const meta = {
  title: "Layout/Page templates",
  component: PageHeader,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Dashboard",
    meta: "Last updated: 27 Jan 2026, 03:05 pm",
    as: 1,
  },
  argTypes: {
    as: { control: "inline-radio", options: [1, 2] },
    actions: { control: false },
    headingId: { control: "text" },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const NAV = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "home" },
      { label: "District Activity", href: "/activity", icon: "campaign" },
      { label: "Important Documents", href: "/documents", icon: "description" },
      { label: "Feedback / Grievances", href: "/feedback", icon: "feedback" },
    ],
  },
];

const Masthead = () => (
  <div
    style={{
      background: "var(--sa-bg-neutral-base)",
      borderBottom: "1px solid var(--sa-border-neutral-subtle)",
      padding: "var(--sa-padding-m) var(--sa-padding-xl)",
      fontWeight: 600,
    }}
  >
    Department of Social Justice &amp; Empowerment
  </div>
);

export const PageHeaderRow: Story = {
  render: (args) => (
    <div style={{ padding: "var(--sa-padding-xl)" }}>
      <PageHeader {...args} actions={<Button>Submit Activity</Button>} />
    </div>
  ),
};

export const PortalShell: Story = {
  render: () => (
    <AppShell header={<Masthead />} sidebar={<SidebarNav groups={NAV} pathname="/dashboard" />}>
      <PageHeader
        title="Dashboard"
        meta="Last updated: 27 Jan 2026, 03:05 pm"
        actions={<Button>Submit Activity</Button>}
      />
      <Card>
        <CardBody>
          Content fills whatever the sidebar leaves — there is no centred container on a portal
          page. Resize the canvas below 768px and the sidebar column is withdrawn.
        </CardBody>
      </Card>
    </AppShell>
  ),
};

/**
 * `pending` renders the shell's own skeleton. The chrome and sidebar stay put,
 * so the page does not jump when the content lands.
 */
export const PortalShellPending: Story = {
  render: () => (
    <AppShell header={<Masthead />} sidebar={<SidebarNav groups={NAV} pathname="/dashboard" />} pending>
      <div />
    </AppShell>
  ),
};

export const WebsitePage: Story = {
  render: () => (
    <SiteLayout
      header={<Masthead />}
      hero={
        <Band tone="brand" spacing="s">
          <h1 style={{ margin: 0 }}>Schemes</h1>
        </Band>
      }
      footer={
        <Band tone="inverse" spacing="s" as="footer">
          Ministry of Social Justice &amp; Empowerment
        </Band>
      }
    >
      <Band spacing="m">
        <Card>
          <CardBody>Every child of SiteLayout is a Band, so each tone runs edge to edge.</CardBody>
        </Card>
      </Band>
      <Band tone="muted" spacing="m">
        <Card>
          <CardBody>The alternating tone is the band, not the container.</CardBody>
        </Card>
      </Band>
    </SiteLayout>
  ),
};
