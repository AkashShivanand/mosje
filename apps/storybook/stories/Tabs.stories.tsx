import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TabPanel, Tabs } from "@mosje/design-system";

/**
 * **Tabs** — the WAI-ARIA tabs pattern with **automatic activation**.
 *
 * Automatic activation means an arrow key both moves *and* selects. That is the
 * right choice when switching is cheap — rendering a panel you already have.
 * It is the wrong choice when each tab triggers a fetch, because arrowing
 * across five tabs fires five requests. If your panels are expensive, this is
 * not the component to reach for.
 *
 * The parent owns the active index and renders **one panel at a time**. Do not
 * render all panels and hide the inactive ones with CSS: they stay in the
 * accessibility tree and in the tab order, so a keyboard user walks through
 * controls they cannot see.
 *
 * `idBase` namespaces the generated tab and panel ids so `aria-controls` and
 * `aria-labelledby` line up. Pass `React.useId()`. Two tab sets on one page
 * sharing an `idBase` produce duplicate ids and silently mislink.
 *
 * Tabs are for **peer views of the same subject**. A sequence the user must
 * complete in order is a `Wizard`; navigation between different pages is
 * `SidebarNav` or `SiteHeader`.
 *
 * `TabPanel`, the matching panel wrapper, is documented here rather than in a
 * story of its own.
 *
 * Lifecycle: **Stable**.
 */
const TABS = [
  { id: "details", label: "Application details" },
  { id: "documents", label: "Documents" },
  { id: "history", label: "Approval history" },
  { id: "remarks", label: "Remarks" },
];

const meta = {
  title: "Components/Navigation/Tabs",
  component: Tabs,
  args: {
    tabs: TABS,
    active: 0,
    onChange: () => {},
    idBase: "sb-tabs",
    ariaLabel: "Application sections",
  },
  argTypes: {
    active: { control: { type: "range", min: 0, max: 3, step: 1 } },
    ariaLabel: { control: "text" },
    idBase: { control: "text" },
    tabs: { control: false },
    onChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const PANEL_CONTENT: Record<string, React.ReactNode> = {
  details: (
    <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 24px" }}>
      <dt style={{ color: "var(--ds-ink-muted)" }}>Application ID</dt>
      <dd style={{ margin: 0 }}>MH/PUN/2026/004182</dd>
      <dt style={{ color: "var(--ds-ink-muted)" }}>Applicant</dt>
      <dd style={{ margin: 0 }}>Sunita Deshmukh</dd>
      <dt style={{ color: "var(--ds-ink-muted)" }}>Scheme</dt>
      <dd style={{ margin: 0 }}>Pre-Matric Scholarship (SC), 2026–27</dd>
    </dl>
  ),
  documents: (
    <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
      <li>Aadhaar — received 04 August 2026</li>
      <li>Caste certificate MH/CC/2019/88214 — received 04 August 2026</li>
      <li>Income certificate — pending</li>
    </ul>
  ),
  history: (
    <p style={{ margin: 0 }}>
      Submitted by the Haveli block officer on 18 August, returned for correction on 19 August,
      resubmitted on 20 August, approved by the district on 20 August.
    </p>
  ),
  remarks: (
    <p style={{ margin: 0 }}>
      “Participant count corrected to 3,860 and the venue address completed.” — Imran Qureshi,
      Block Nodal Officer, Haveli.
    </p>
  ),
};

/** Fully driven — arrow keys move and select, Home/End jump to the ends. */
export const Playground: Story = {
  render: function Render(args) {
    const idBase = React.useId();
    const [active, setActive] = React.useState(0);
    const tab = TABS[active];
    return (
      <div>
        <Tabs {...args} idBase={idBase} tabs={TABS} active={active} onChange={setActive} />
        {/* One panel at a time — hiding the others with CSS would leave them
            in the accessibility tree and the tab order. */}
        <TabPanel idBase={idBase} tabId={tab?.id ?? TABS[0]!.id}>
          <div style={{ paddingTop: 16, color: "var(--ds-ink)" }}>
            {tab ? PANEL_CONTENT[tab.id] : null}
          </div>
        </TabPanel>
      </div>
    );
  },
};

/** Two tabs — the sensible floor. One tab is not a choice. */
export const TwoTabs: Story = {
  render: function Render(args) {
    const idBase = React.useId();
    const [active, setActive] = React.useState(0);
    return (
      <div>
        <Tabs
          {...args}
          idBase={idBase}
          ariaLabel="View"
          tabs={[
            { id: "chart", label: "Chart" },
            { id: "table", label: "Table" },
          ]}
          active={active}
          onChange={setActive}
        />
        <TabPanel idBase={idBase} tabId={active === 0 ? "chart" : "table"}>
          <p style={{ paddingTop: 16, margin: 0, color: "var(--ds-ink)" }}>
            {active === 0
              ? "The district roll-up, drawn as a chart."
              : "The same roll-up as a table of figures."}
          </p>
        </TabPanel>
      </div>
    );
  },
};

/** A later tab active on mount, as a deep link would leave it. */
export const StartingOnALaterTab: Story = {
  render: function Render(args) {
    const idBase = React.useId();
    const [active, setActive] = React.useState(2);
    const tab = TABS[active];
    return (
      <div>
        <Tabs {...args} idBase={idBase} tabs={TABS} active={active} onChange={setActive} />
        <TabPanel idBase={idBase} tabId={tab?.id ?? TABS[0]!.id}>
          <div style={{ paddingTop: 16, color: "var(--ds-ink)" }}>
            {tab ? PANEL_CONTENT[tab.id] : null}
          </div>
        </TabPanel>
      </div>
    );
  },
};

/** Many tabs with long labels — the row wraps rather than scrolling off. */
export const ManyTabs: Story = {
  render: function Render(args) {
    const idBase = React.useId();
    const [active, setActive] = React.useState(0);
    const many = [
      { id: "overview", label: "Overview" },
      { id: "adarsh", label: "Adarsh Gram" },
      { id: "gia", label: "Grants-in-Aid" },
      { id: "hostels", label: "Hostels" },
      { id: "skills", label: "Skill development" },
      { id: "grievances", label: "Grievance redressal" },
    ];
    return (
      <div>
        <Tabs {...args} idBase={idBase} ariaLabel="Components" tabs={many} active={active} onChange={setActive} />
        <TabPanel idBase={idBase} tabId={many[active]!.id}>
          <p style={{ paddingTop: 16, margin: 0, color: "var(--ds-ink)" }}>
            {many[active]?.label} — PM-AJAY, financial year 2026–27.
          </p>
        </TabPanel>
      </div>
    );
  },
};
