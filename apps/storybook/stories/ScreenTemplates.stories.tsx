import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  DescriptionList,
  Icon,
  OverviewScreen,
  PortalPage,
  RecordScreen,
  ScreenBody,
  Select,
  WizardScreen,
  WorklistScreen,
  type WorklistColumn,
  type WorklistScreenProps,
} from "@mosje/design-system";

/**
 * **Screen templates** — the layer above components. Lifecycle: **Beta**.
 *
 * @covers PortalPage, ScreenBody, WorklistScreen, RecordScreen, WizardScreen, OverviewScreen
 *
 * The estate had 132 components and no template layer. Measured 6 September
 * 2026: **265 portal pages, `PageHeader` used in zero of them, `AppShell` in
 * zero, sixteen hand-rolled shells, and 236 of the 265 pages handling none of
 * loading, empty or error** — 89% in breach of a mandatory rule, because obeying
 * it by hand costs four extra branches on every page. These templates are those
 * branches, written once.
 *
 * **Pick a template from the data you have, not from a picture.** One record
 * read-only is `RecordScreen`; editable and over eight fields is `WizardScreen`;
 * many records the reader acts on is `WorklistScreen`; many records aggregated
 * into figures is `OverviewScreen`. The full decision table, including the eight
 * pairs that are easy to confuse, is in `docs/design-system/screen-templates.md`.
 *
 * **`PortalPage`** is the chrome — the only chrome. It composes `AppShell` and
 * adds the four things the sixteen shells each wired by hand and each wired
 * differently: `data-portal` for the palette re-bind, the rail's two widths
 * (300 expanded, 88 collapsed — the handoff draws five, and three of them are
 * drift), role-filtered navigation, and the mobile drawer.
 *
 * **`ScreenBody`** is why the states are structural rather than remembered.
 * Every template routes its content through it, so there is no code path that
 * skips the empty state. It branches the RENDER, never the hooks: the status is
 * resolved above by `resolveScreenState`, every `useMemo` runs unconditionally,
 * and only the return is conditional.
 *
 * **`WorklistScreen`** is the largest gap in the estate — 43 pages use
 * `DataTable` and the handoff draws no list screen at all. Its `priority` on a
 * column is what lets a twelve-column table survive a phone: priority 1 becomes
 * the card's title, 2 becomes a label/value pair, 3 is dropped. The handoff
 * draws no mobile version of any application screen, so this is the estate's
 * answer rather than a transcription.
 *
 * **`WizardScreen`** covers 22 of the handoff's 44 screens across three schemes
 * with 3, 6 and 7 steps. It ships one stepper treatment where the handoff draws
 * two: a citizen applying to two schemes should not meet two different progress
 * bars for the same act.
 *
 * **`OverviewScreen`** cannot enforce its own two most important rules, so they
 * are stated here. A ratio takes numerator and denominator from the **same
 * source** — mixing them published a `138%` on this estate. And a figure the
 * register does not publish is left **off** the design, not shown as "Not yet
 * reported".
 *
 * ---
 *
 * **The props these stories deliberately do not stage, and what to do with them.**
 *
 * `children` on `PortalPage`, `WizardScreen` and `ScreenBody` is the screen, the
 * step body and the populated result respectively — every story passes one, so
 * there is nothing a separate story would add.
 *
 * `copy` is on all five and is the bilingual seam: every sentence a template
 * shows is a prop, because GIGW requires the estate to be bilingual and a
 * sentence baked into markup cannot be translated. Override with `screenCopy()`,
 * which merges your two or three over the estate's ten rather than making you
 * restate them. It is not staged because a story showing translated copy would
 * document the translation, not the template.
 *
 * On `PortalPage`: `identity` is the organisation block at the top of the rail —
 * pass it for a portal with a mark, omit it and the rail's accessible name falls
 * back to "Portal navigation". `footer` takes the slim portal `Footer`.
 * `defaultCollapsed` starts the rail at its 88px icon width; do not reach for it
 * to fit a wide table, because a reader who collapses the rail should be the one
 * who decides. `pending` renders a skeleton instead of `children` while the
 * session resolves — use it rather than returning `null` from an auth guard,
 * which flashes a blank page. `mainId` must agree with the masthead's `skipTo`,
 * or the skip link points at nothing.
 *
 * On `WorklistScreen`: `rowActions` renders in the last column and again on the
 * mobile card — anything you pass is yours to make keyboard-operable and to meet
 * the 24×24 target minimum. `pluralNoun` is only needed where the plural is not
 * the noun plus "s" ("beneficiary" / "beneficiaries").
 *
 * On `RecordScreen`: `activeTab` and `onTabChange` are how a tab becomes
 * linkable. **Drive them from the URL.** They are optional so a screen that has
 * not wired its router yet still works, but an uncontrolled tab is a tab nobody
 * can send anyone to, and the estate's 265 existing pages prove people otherwise
 * reach for `useState`.
 *
 * `headingLevel` is on all four screen templates and defaults to 1, because a
 * portal screen has exactly one `<h1>` and the template's title is it. Drop it
 * to 2 only where the template is rendered inside a page that already has one —
 * a documentation specimen, or a screen embedded in another screen. It exists
 * because measuring a documentation page found **two `<h1>`s**: the specimen is
 * a live template, not a picture of one. Same contract as
 * `PortalLoginTemplate.headingLevel`.
 *
 * On `WizardScreen`: `notices` holds anything the step must say before its
 * fields — the handoff's "Organisation details auto-populated from DARPAN" is
 * one. `errorRef` is how the parent moves focus to the error summary after a
 * failed validation, and omitting it means a keyboard user is told nothing went
 * wrong. `nextLabel` and `submitLabel` override "Continue" and "Submit" where
 * the register words the act differently ("Save and Continue", "Submit
 * Application"). `onCancel` renders a text button below the wizard; omit it
 * where there is nothing to cancel back to.
 */

interface Application extends Record<string, unknown> {
  id: string;
  project: string;
  scheme: string;
  state: string;
  requested: string;
  status: string;
  updated: string;
}

const APPLICATIONS: Application[] = [
  {
    id: "DL/2016/0104728",
    project: "Hostel — North West Delhi",
    scheme: "SHRESHTA Mode 2",
    state: "Delhi",
    requested: "₹45.20 Lakh",
    status: "In Review",
    updated: "14 Aug 2026",
  },
  {
    id: "DL/2016/0104728/01",
    project: "IPSrC Senior Citizen Home — Krishna",
    scheme: "AVYAY",
    state: "Delhi",
    requested: "₹1.24 Cr",
    status: "In Review",
    updated: "12 Aug 2026",
  },
  {
    id: "DL/2016/0104728/02",
    project: "SHRESHTA Class 9 School Support",
    scheme: "SHRESHTA Mode 2",
    state: "Delhi",
    requested: "₹12.50 Lakh",
    status: "Sanctioned",
    updated: "10 Aug 2026",
  },
  {
    id: "DL/2016/0104728/03",
    project: "Garima Greh Transgender Shelter",
    scheme: "SMILE",
    state: "Delhi",
    requested: "₹38.00 Lakh",
    status: "Needs Action",
    updated: "08 Aug 2026",
  },
  {
    id: "DL/2016/0104728/04",
    project: "De-Addiction Centre Rehabilitation",
    scheme: "NAPDDR",
    state: "Delhi",
    requested: "₹24.00 Lakh",
    status: "In Review",
    updated: "06 Aug 2026",
  },
];

const STATUS_TONE: Record<string, "info" | "success" | "warning"> = {
  "In Review": "info",
  Sanctioned: "success",
  "Needs Action": "warning",
};

const COLUMNS: WorklistColumn<Application>[] = [
  { key: "project", header: "Project Details", priority: 1, sortable: true },
  { key: "id", header: "LSGY ID", priority: 3 },
  {
    key: "status",
    header: "Status",
    priority: 2,
    render: (row) => <Badge status={STATUS_TONE[row.status] ?? "info"}>{row.status}</Badge>,
  },
  { key: "requested", header: "Requested", priority: 2, sortable: true },
  { key: "updated", header: "Last Updated", priority: 3, sortable: true },
];

/* Annotated with the PROPS type, not `typeof WorklistScreen`: inferring through
   a generic component erases the type parameter to its constraint, so the rows
   would type as `Record<string, unknown>` and every column's `render` would lose
   `Application`. Same reason `DataTable`'s own stories do it. */
const meta: Meta<WorklistScreenProps<Application>> = {
  title: "Templates/Screen templates",
  component: WorklistScreen,
  parameters: { layout: "padded" },
};
export default meta;

type WorklistStory = StoryObj<WorklistScreenProps<Application>>;

const baseWorklist: WorklistScreenProps<Application> = {
  eyebrow: "E-ANUDAAN",
  title: "My Applications",
  meta: "Grant-in-aid applications submitted by Harijan Sevak Sangh.",
  columns: COLUMNS,
  rows: APPLICATIONS,
  getRowId: (row) => row.id,
  noun: "application",
  actions: (
    <Button iconLeft={<Icon name="add" size={20} />}>New Application</Button>
  ),
  filters: (
    <>
      <Select aria-label="Filter by scheme" defaultValue="">
        <option value="">All schemes</option>
        <option value="avyay">AVYAY</option>
        <option value="shreshta">SHRESHTA Mode 2</option>
      </Select>
      <Select aria-label="Filter by status" defaultValue="">
        <option value="">All statuses</option>
        <option value="review">In Review</option>
      </Select>
    </>
  ),
};

/** The happy path — figures, filters, a pager the caller never wrote. */
export const Worklist: WorklistStory = { args: baseWorklist };

/**
 * Loading. A skeleton **in the shape of the result**, at the density scale's own
 * row height, so the table lands exactly where the skeleton stood. `role="status"`
 * tells a screen reader the wait is deliberate.
 */
export const WorklistLoading: WorklistStory = {
  args: { ...baseWorklist, loading: true, rows: [] },
};

/** Empty — the register holds nothing. The citizen's answer, not the pipeline's excuse. */
export const WorklistEmpty: WorklistStory = {
  args: {
    ...baseWorklist,
    rows: [],
    emptyAction: <Button>Start an application</Button>,
  },
};

/**
 * Filtered to nothing — worded **differently** from empty, and it names the way
 * out. "No village named Bankura is in the register" and "the feed published
 * nothing" are different facts; a screen that renders one for both is lying
 * about one of them.
 */
export const WorklistFilteredToNothing: WorklistStory = {
  args: {
    ...baseWorklist,
    rows: [],
    registerTotal: 68,
    activeFilterCount: 2,
    onClearFilters: () => undefined,
  },
};

/** Error — one sentence and a retry. No status codes, no endpoints on a citizen's page. */
export const WorklistError: WorklistStory = {
  args: {
    ...baseWorklist,
    rows: [],
    error: new Error("upstream timeout"),
    onRetry: () => undefined,
  },
};

/** Selection, with the count spanning every page rather than the visible one. */
export const WorklistWithSelection: WorklistStory = {
  render: function Render(args) {
    const [selected, setSelected] = React.useState<string[]>([
      APPLICATIONS[0]!.id,
      APPLICATIONS[2]!.id,
    ]);
    return (
      <WorklistScreen
        {...args}
        selectedIds={selected}
        onSelectionChange={setSelected}
        bulkActions={[
          { id: "export", label: "Export", icon: "download" },
          { id: "withdraw", label: "Withdraw", tone: "danger" },
        ]}
        onBulkAction={() => undefined}
      />
    );
  },
  args: baseWorklist,
};

/** One record, read-only. A tab with nothing in it keeps its tab and shows its empty state. */
export const Record: StoryObj = {
  render: () => (
    <RecordScreen
      breadcrumb={[
        { label: "My Applications", href: "#" },
        { label: "DL/2016/0104728" },
      ]}
      eyebrow="SHRESHTA MODE 2"
      title="Hostel — North West Delhi"
      meta="Application DL/2016/0104728 · submitted 14 August 2026"
      status={<Badge status="info">In Review</Badge>}
      actions={<Button appearance="outlined">Download Summary</Button>}
      facts={[
        { label: "Grant Requested", value: "₹45.20 Lakh" },
        { label: "Financial Year", value: "2026–27" },
        { label: "Beneficiaries", value: "50" },
        { label: "State", value: "Delhi" },
      ]}
      tabs={[
        {
          id: "details",
          label: "Details",
          render: () => (
            <Card>
              <CardBody>
                <DescriptionList
                  columns={2}
                  items={[
                    { term: "Organisation", value: "Harijan Sevak Sangh" },
                    { term: "NGO-Darpan ID", value: "LGN/2016/0104728" },
                    { term: "Registration Act", value: "Societies Registration Act XXI of 1860" },
                    { term: "Registered Office", value: "Kingsway Camp, Delhi 110009" },
                  ]}
                />
              </CardBody>
            </Card>
          ),
        },
        { id: "documents", label: "Documents", render: () => <Card><CardBody>17 documents on file.</CardBody></Card> },
        { id: "history", label: "History", render: () => <Card><CardBody>Submitted 14 August 2026.</CardBody></Card> },
      ]}
    />
  ),
};

/** A wizard step, with the draft banner the handoff draws on every scheme. */
export const Wizard: StoryObj = {
  render: () => (
    <WizardScreen
      eyebrow="E-ANUDAAN"
      title="AVYAY — Atal Vayo Abhyuday Yojana"
      description="Provide all necessary information below and complete each section to register for AVYAY."
      steps={[
        { label: "Application Type" },
        { label: "Organisation Details" },
        { label: "Project Details" },
        { label: "Infrastructure, Beneficiaries & Bank" },
        { label: "Grant Sought & Declaration" },
        { label: "Upload Documents" },
        { label: "Review & Submit" },
      ]}
      current={1}
      draft={{ savedAt: "18 Aug 2026", onResume: () => undefined, onStartFresh: () => undefined }}
      onBack={() => undefined}
      onNext={() => undefined}
      onSubmit={() => undefined}
    >
      <Card>
        <CardBody>The current step&rsquo;s fields go here, as FormSections.</CardBody>
      </Card>
    </WizardScreen>
  ),
};

/** The dashboard. `KpiRow`'s `loading` is a COUNT, so the row holds its shape. */
export const Overview: StoryObj = {
  render: () => (
    <OverviewScreen
      title="Good afternoon, Harijan"
      meta="Last updated 14 August 2026 at 1:34 pm"
      actions={<Button iconLeft={<Icon name="add" size={20} />}>New Application</Button>}
      kpis={[
        { label: "Total Applications", value: "68" },
        { label: "In Review", value: "31" },
        { label: "Needs Action", value: "0" },
        { label: "Sanctioned", value: "36" },
      ]}
      panels={[
        <Card key="a"><CardBody>Application status — donut.</CardBody></Card>,
        <Card key="b"><CardBody>Financial summary — ₹24.37 Cr requested, ₹13.70 Cr sanctioned.</CardBody></Card>,
      ]}
      recent={<Card><CardBody>Recent applications table.</CardBody></Card>}
    />
  ),
};

/** The figures still arriving. Nothing below them moves when they land. */
export const OverviewLoading: StoryObj = {
  render: () => (
    <OverviewScreen
      title="Good afternoon, Harijan"
      meta="Last updated 14 August 2026 at 1:34 pm"
      kpisLoading={4}
      panels={[<Card key="a"><CardBody>Application status — donut.</CardBody></Card>]}
    />
  ),
};

/**
 * `ScreenBody` on its own, for a screen the eighteen templates do not cover.
 * Resolve the status once with `resolveScreenState`, then hand it here.
 */
export const StateBranch: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <ScreenBody status="empty" skeleton="table">
        <div />
      </ScreenBody>
      <ScreenBody status="error" onRetry={() => undefined} skeleton="table">
        <div />
      </ScreenBody>
    </div>
  ),
};

/** The chrome. One `PortalPage`, one `<h1>`, the rail at its 300px width. */
export const Chrome: StoryObj = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <PortalPage
      portal="e-anudaan"
      role="organisation"
      pathname="/portals/e-anudaan/applications"
      header={<div style={{ padding: "1rem" }}>Masthead — pass SiteHeader variant=&quot;portal&quot;</div>}
      nav={[
        {
          items: [
            { label: "Dashboard", href: "/portals/e-anudaan", icon: "dashboard" },
            {
              label: "My Applications",
              href: "/portals/e-anudaan/applications",
              icon: "description",
            },
            { label: "Deficiencies", href: "/portals/e-anudaan/deficiencies", icon: "warning" },
            {
              label: "Master Settings",
              href: "/portals/e-anudaan/settings",
              icon: "settings",
              roles: ["admin"],
            },
          ],
        },
      ]}
    >
      <WorklistScreen {...baseWorklist} />
    </PortalPage>
  ),
};
