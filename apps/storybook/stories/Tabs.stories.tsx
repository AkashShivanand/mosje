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
 * ### Choosing the chrome
 *
 * `indicator` and `track` are two halves of one decision, and only two of the six
 * combinations are correct. `track="enclosed"` is a filled, bordered track and takes
 * `indicator="pill"`. `track="none"` is an open list and takes `indicator="underline"`
 * when `orientation="horizontal"`, or `indicator="rail"` when it is `"vertical"`. A
 * pill on an open list has nothing to sit in; an underline inside a filled track
 * competes with the track's own edge. Both are shown below, side by side, because the
 * wrong pairing is easier to recognise than to describe.
 *
 * `size` (`s` / `m` / `l` → 36 / 44 / 48 px) applies to the whole list, never to one
 * tab. `divider` draws the rule the underline or rail sits in, and is ignored when the
 * track is enclosed.
 *
 * Per-tab, `TabDef` also carries `icon` (a Material Symbols name), `badge` (the shared
 * status dot, bound to `cmp/badge/dotSize`) and `disabled`. A disabled tab **stays in
 * the tablist** with `aria-disabled` — arrow keys step over it, but a screen-reader user
 * still hears that the section is there. Removing it instead would hide that fact.
 *
 * ### Writing the labels
 *
 * These govern the content, and they are the rules most often broken.
 *
 * 1. **A tab label names a destination.** Not a sentence. One or two words; aim for
 *    20 characters or fewer in English.
 * 2. **Budget for the longest translation, not the English.** Devanagari renders the
 *    same phrase 10–30% longer. A label that fits in English and truncates in Hindi is
 *    a defect found in production, not in review.
 * 3. **In `track="enclosed"` every tab is the same width**, so the *longest* label sets
 *    what all of them can show. One long label degrades the whole set.
 * 4. **When a label does not fit, escalate in this order — truncation is last:**
 *    shorten it → move to `track="none"` and let the row scroll → add the overflow menu
 *    → only then accept the ellipsis.
 * 5. **Truncation is CSS-only, never JavaScript.** Shortening the string in code
 *    rewrites the accessible name too. A clipped tab keeps its full name in the
 *    accessibility tree and pairs with a `Tooltip` that opens on hover AND on
 *    keyboard focus. Where no hover exists the label is not clipped at all —
 *    see `LongLabelsEveryInput`.
 * 6. **Two tabs must never truncate to the same visible string.** "Application details"
 *    and "Application status" both become "Application…". Front-load the distinguishing
 *    word — "Details" / "Status" — rather than trusting truncation to stay readable.
 * 7. **Never wrap to two lines in a ROW.** It makes the row's height depend on the
 *    longest label. A vertical list is the exception and wraps deliberately —
 *    its items size independently and the rail is measured at runtime.
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
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55489-870"
    }
  },
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
    indicator: { control: "inline-radio", options: ["underline", "rail", "pill"] },
    size: { control: "inline-radio", options: ["s", "m", "l"] },
    track: { control: "inline-radio", options: ["none", "enclosed"] },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    divider: { control: "boolean" },
    overflow: { control: "boolean" },
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
      <dt style={{ color: "var(--sa-text-neutral-subtle)" }}>Application ID</dt>
      <dd style={{ margin: 0 }}>MH/PUN/2026/004182</dd>
      <dt style={{ color: "var(--sa-text-neutral-subtle)" }}>Applicant</dt>
      <dd style={{ margin: 0 }}>Sunita Deshmukh</dd>
      <dt style={{ color: "var(--sa-text-neutral-subtle)" }}>Scheme</dt>
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
          <div style={{ paddingTop: 16, color: "var(--sa-color-text-default)" }}>
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
          <p style={{ paddingTop: 16, margin: 0, color: "var(--sa-color-text-default)" }}>
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
          <div style={{ paddingTop: 16, color: "var(--sa-color-text-default)" }}>
            {tab ? PANEL_CONTENT[tab.id] : null}
          </div>
        </TabPanel>
      </div>
    );
  },
};

/** Many tabs with long labels — the row scrolls horizontally rather than wrapping. */
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
          <p style={{ paddingTop: 16, margin: 0, color: "var(--sa-color-text-default)" }}>
            {many[active]?.label} — PM-AJAY, financial year 2026–27.
          </p>
        </TabPanel>
      </div>
    );
  },
};

/** A minimal controlled harness, so the axis stories below stay about the axis. */
function Demo({
  tabs = TABS,
  label = "Application sections",
  start = 0,
  ...rest
}: Partial<React.ComponentProps<typeof Tabs>> & { label?: string; start?: number }) {
  const idBase = React.useId();
  const [active, setActive] = React.useState(start);
  const list = tabs;
  const tab = list[active] ?? list[0]!;
  return (
    <div>
      <Tabs
        {...rest}
        idBase={idBase}
        ariaLabel={label}
        tabs={list}
        active={active}
        onChange={setActive}
      />
      <TabPanel idBase={idBase} tabId={tab.id}>
        <div style={{ paddingTop: 16, color: "var(--sa-color-text-default)" }}>
          {PANEL_CONTENT[tab.id] ?? <p style={{ margin: 0 }}>{tab.label}</p>}
        </div>
      </TabPanel>
    </div>
  );
}

/**
 * The two correct pairings, and the two wrong ones beneath them.
 *
 * The wrong row is rendered on purpose: a pill floating on an open list reads as a
 * button that has lost its toolbar, and an underline inside a filled track draws a
 * second edge a few pixels inside the first. Neither is a bug you would find by
 * reading a prop table.
 */
export const IndicatorAndTrack: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 40 }}>
      <section>
        <h3 style={{ margin: "0 0 12px", fontSize: "var(--sa-type-title-2-size)", lineHeight: "var(--sa-type-title-2-lh)" }}>Correct</h3>
        <div style={{ display: "grid", gap: 28 }}>
          <Demo track="enclosed" indicator="pill" label="Enclosed pill" />
          <Demo track="none" indicator="underline" label="Open underline" />
        </div>
      </section>
      <section>
        <h3 style={{ margin: "0 0 12px", fontSize: "var(--sa-type-title-2-size)", lineHeight: "var(--sa-type-title-2-lh)" }}>
          Wrong — do not ship these
        </h3>
        <div style={{ display: "grid", gap: 28, opacity: 0.85 }}>
          <Demo track="none" indicator="pill" label="Pill with no track" />
          <Demo track="enclosed" indicator="underline" label="Underline in a track" />
        </div>
      </section>
    </div>
  ),
};

/** `s` / `m` / `l` resolve to 36 / 44 / 48 px — a hug of padding plus line-height. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 28 }}>
      <Demo size="s" label="Small" />
      <Demo size="m" label="Medium" />
      <Demo size="l" label="Large" />
    </div>
  ),
};

/**
 * Vertical lists. `rail` is the vertical counterpart of `underline` — the same 2px
 * mark on the leading edge — and Up/Down arrows drive it, with
 * `aria-orientation="vertical"` telling assistive technology so.
 */
export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
      <div style={{ width: 260 }}>
        <Demo orientation="vertical" track="none" indicator="rail" label="Open rail" />
      </div>
      <div style={{ width: 260 }}>
        <Demo orientation="vertical" track="enclosed" indicator="pill" label="Enclosed pill" />
      </div>
    </div>
  ),
};

/**
 * Icons, unread dots, and an unavailable section.
 *
 * Arrow from "Documents" and you land on "Approval history" — "Remarks" is skipped.
 * It is still announced as a tab, and still reads as disabled, which is the point:
 * an officer needs to know the remarks section exists before they can ask why it is
 * shut.
 */
export const IconsBadgesAndDisabled: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 28 }}>
      <Demo
        label="Application sections"
        tabs={[
          { id: "details", label: "Application details", icon: "description" },
          { id: "documents", label: "Documents", icon: "folder_open", badge: true },
          { id: "history", label: "Approval history", icon: "history" },
          { id: "remarks", label: "Remarks", icon: "chat", disabled: true },
        ]}
      />
      <Demo
        track="none"
        indicator="underline"
        label="Application sections, open list"
        tabs={[
          { id: "details", label: "Application details", icon: "description" },
          { id: "documents", label: "Documents", icon: "folder_open", badge: true },
          { id: "history", label: "Approval history", icon: "history" },
          { id: "remarks", label: "Remarks", icon: "chat", disabled: true },
        ]}
      />
    </div>
  ),
};

/**
 * `divider` draws the rule the indicator sits **in** — the selected segment replaces
 * that stretch of the rule rather than stacking a second line above it. Turn it off
 * where the tabs already sit on a hard edge, such as the top of a card.
 */
export const WithoutDivider: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 28 }}>
      <Demo track="none" indicator="underline" label="With the rule" divider />
      <Demo track="none" indicator="underline" label="Without the rule" divider={false} />
    </div>
  ),
};

/**
 * **Label rule 6, rendered.** Both sets hold the same four sections in the same width.
 *
 * The first labels them by their shared subject, so three of the four truncate to
 * "Application…" and the tab row stops being navigation — hover each to see the `title`
 * that is now the only way to tell them apart. The second front-loads the word that
 * distinguishes them, and nothing truncates at all.
 *
 * Nothing here is a component bug. It is the same component, twice, with the labels
 * written differently — which is the point: this failure is fixed in the copy, not in
 * the CSS.
 */
export const LabelsThatCollide: Story = {
  render: () => (
    // Pinned to 420px rather than left to the decorator: whether a label truncates is a
    // function of the available width, so a story that relies on the reader's viewport
    // demonstrates the failure on some screens and nothing at all on others. This is the
    // width a tab row gets in a narrow panel or on a phone.
    <div style={{ display: "grid", gap: 40, width: 420 }}>
      <section>
        <h3 style={{ margin: "0 0 12px", fontSize: "var(--sa-type-title-2-size)", lineHeight: "var(--sa-type-title-2-lh)" }}>
          Don&rsquo;t — a shared prefix truncates to the same string
        </h3>
        <Demo
          label="Application, by shared prefix"
          tabs={[
            { id: "details", label: "Application details" },
            { id: "status", label: "Application status" },
            { id: "history", label: "Application history" },
            { id: "remarks", label: "Remarks" },
          ]}
        />
      </section>
      <section>
        <h3 style={{ margin: "0 0 12px", fontSize: "var(--sa-type-title-2-size)", lineHeight: "var(--sa-type-title-2-lh)" }}>
          Do — the distinguishing word comes first
        </h3>
        <Demo
          label="Application, front-loaded"
          tabs={[
            { id: "details", label: "Details" },
            { id: "status", label: "Status" },
            { id: "history", label: "History" },
            { id: "remarks", label: "Remarks" },
          ]}
        />
      </section>
    </div>
  ),
};

/**
 * **The clipped label, solved for every input.** One problem, three different
 * answers, because no single affordance reaches every user.
 *
 * - **Mouse** — hover a clipped tab: a `Tooltip` shows the full label.
 * - **Keyboard** — Tab or Arrow onto one: the same tooltip opens *instantly*,
 *   with the pointer nowhere near. `title` never did this, which is why it is
 *   gone. Escape dismisses it without moving focus (WCAG 1.4.13).
 * - **Screen reader** — nothing to rescue. The clipping is CSS, so the full
 *   label is already the button's accessible name; the bubble is `aria-hidden`
 *   and carries no `aria-describedby`, so it is never announced twice.
 * - **Touch** — a tooltip is unreachable, so the label is **not clipped at
 *   all**: under `@media (hover: none)` enclosed tabs stop sharing the width
 *   equally, size to their content, and the row scrolls. Check this in a mobile
 *   viewport, or on a real device.
 * - **Vertical** — a column's items size independently and the rail is measured
 *   at runtime, so the label **wraps** rather than truncating. Nothing is
 *   hidden and no affordance is needed. Narrow the frame to see it.
 *
 * A clipped label is still a failure of the copy. This is the safety net for
 * when a viewport, a translation or a font makes one unavoidable.
 */
export const LongLabelsEveryInput: Story = {
  render: () => {
    const long = [
      { id: "details", label: "Application details" },
      { id: "documents", label: "Supporting documents" },
      { id: "history", label: "Approval history" },
    ];
    return (
      <div style={{ display: "grid", gap: 40 }}>
        <section>
          <h3 style={{ margin: "0 0 12px", fontSize: "var(--sa-type-title-2-size)", lineHeight: "var(--sa-type-title-2-lh)" }}>
            Horizontal, pointer — clipped, and recoverable on hover or focus
          </h3>
          <div style={{ width: 320 }}>
            <Demo tabs={long} label="Clipped, with tooltip" />
          </div>
        </section>
        <section>
          <h3 style={{ margin: "0 0 12px", fontSize: "var(--sa-type-title-2-size)", lineHeight: "var(--sa-type-title-2-lh)" }}>
            Vertical — wraps instead, so nothing is hidden on any input
          </h3>
          <div style={{ width: 170 }}>
            <Demo tabs={long} orientation="vertical" track="none" indicator="rail" label="Wrapping" />
          </div>
        </section>
      </div>
    );
  },
};

/**
 * **The overflow menu.** Set `overflow` when a row may hold more tabs than it
 * can show. The `Tabs / More` trigger appears **only when the row actually
 * overflows** — never as permanent chrome. Narrow the frame to make more tabs
 * disappear.
 *
 * It is a **menu button, not a tab**: `role="button"`, `aria-haspopup="menu"`,
 * `aria-expanded`. Giving it `role="tab"` would promise a panel that does not
 * exist and tell a screen-reader user there are more sections than there are.
 * That is also why it renders *outside* the `role="tablist"` — and being
 * outside is what keeps it pinned while the tabs scroll past it.
 *
 * **It lists every tab, not just the hidden ones**, and marks the current one with
 * `role="menuitemradio"` + `aria-checked`. An earlier build listed only what was
 * out of view, which meant opening the same menu at two scroll positions gave two
 * different lists. It reads as a jump-to-section list now.
 *
 * **It does not remove tabs from the tablist.** Every tab stays rendered,
 * focusable and arrow-reachable; this is a pointer shortcut, not a relocation.
 * The alternative model — moving tabs into the menu — costs them their
 * `role="tab"`, their `aria-controls` and their place in the roving tabindex.
 *
 * The row itself is polished for the scrolling case: the native scrollbar is
 * hidden (only here, where the menu is an alternative affordance), and tabs
 * scroll-snap so none is ever sliced mid-word.
 *
 * **The edge fade belongs to `track="none"` only** — both rows below, so the
 * difference is visible rather than described. An open row has nothing to
 * explain a cut, so a measured per-direction fade says "more this way". An
 * enclosed row already has a bordered, rounded container, and content clipped by
 * a container reads as clipped — the same call Material and Carbon make. It also
 * *cannot* be faded cleanly: the border, fill and radius are painted by the
 * scrolling element, so a mask dissolves the container itself, which at 200%
 * zoom cost the track its corner. `scroll-padding` keeps a keyboard-focused tab
 * off both the fade and the clip edge (WCAG 2.4.11).
 *
 * Keyboard: Enter, Space or Down opens and focuses the first item; Up/Down and
 * Home/End move; Escape closes and returns focus to the trigger; Tab leaves.
 * Choosing an item selects that tab and scrolls it into view — without that it
 * would select something still off-screen and appear to do nothing.
 *
 * `overflow` is **off by default**, because switching it on wraps the tablist in
 * a positioning element. Nobody who has not asked for it sees a DOM change.
 */
export const OverflowMenu: Story = {
  render: () => {
    const many = [
      { id: "overview", label: "Overview" },
      { id: "adarsh", label: "Adarsh Gram" },
      { id: "gia", label: "Grants-in-Aid" },
      { id: "hostels", label: "Hostels" },
      { id: "skills", label: "Skill development" },
      { id: "grievances", label: "Grievance redressal", badge: true },
      { id: "audit", label: "Audit trail", disabled: true },
    ];
    return (
      // A plain block box, not a grid/flex item. A grid or flex child defaults
      // to `min-width: auto`, so it refuses to shrink below its content, the
      // tablist never becomes narrower than its tabs, and nothing ever
      // overflows — the trigger would correctly never appear. Consumers placing
      // `overflow` tabs inside a flex or grid item need `min-width: 0` on it.
      <div style={{ display: "grid", gap: 32, width: 460 }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: "0 0 8px", fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)", color: "var(--sa-text-neutral-subtle)" }}>
            track=&quot;enclosed&quot; — clips against its own border
          </p>
          <Demo tabs={many} overflow label="PM-AJAY components" />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: "0 0 8px", fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)", color: "var(--sa-text-neutral-subtle)" }}>
            track=&quot;none&quot; — fades, because nothing else explains the cut
          </p>
          <Demo tabs={many} overflow track="none" indicator="underline" label="PM-AJAY components, open track" />
        </div>
      </div>
    );
  },
};
