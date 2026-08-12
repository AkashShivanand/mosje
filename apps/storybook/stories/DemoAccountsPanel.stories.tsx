import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DemoAccountsPanel, type DemoFillDetail } from "@mosje/design-system";

/**
 * **DemoAccountsPanel** — the demo-credentials table shared by `DemoFab` and
 * `DemoDock`'s Sign in tab, so the two never drift apart the way they did
 * before this was extracted. One row per account: the role on its own line
 * (it is the longest field, so it does not fight id/password/actions for
 * space), then the identifier, the password, a copy button for each, and a
 * **Use** button.
 *
 * **DEMO-ONLY.** Every credential rendered here is already public review
 * data — see `.claude/rules/portal-login-demos.md` and the registry it now
 * points at, `packages/design-system/demo/demo-accounts.ts`. Never pass this
 * component a real credential; it exists so reviewers, QAs and stakeholders
 * can sign in without one.
 *
 * **Use it** as the body of any demo-credentials shell (`DemoFab` or
 * `DemoDock`, or a bespoke one). **Do not use it** as, or inside, a real
 * login form — it has no submit handling, no validation, and no loading
 * state, because it is a picker for a *different* form's fields, not a form
 * itself.
 *
 * `idLabel` names the identifier column, because portals differ: NMBA and
 * SCW sign in by mobile number, PM-AJAY by employee ID, TG by email, NHAPOA
 * by username — see `EmployeeIdPortal` and `EmailPortal` below.
 *
 * The **Use** button's default behaviour is the useful, odd-looking one:
 * with no `onFill`, it dispatches a global `demo:fill` CustomEvent carrying
 * `{ id, password, extra }`. That is what lets `DemoDock` live in the hub's
 * root layout — a completely different part of the tree from the login form
 * it is filling — with no prop-drilling and no shared store. Pass `onFill`
 * only when the panel is co-located with the form it fills. `onUse` fires
 * after either path runs, so a containing shell (`DemoFab`, `DemoDock`) can
 * close itself on selection without listening to the global event, which is
 * reserved for "a login page received a credential", not "some picker,
 * somewhere, was used."
 *
 * Lifecycle: **Stable** (demo tooling — not part of the production surface).
 */
const NMBA_ACCOUNTS = [
  { role: "Admin", id: "9999999999", password: "Demo@123" },
  { role: "State Nodal Officer (Maharashtra)", id: "9890123456", password: "Demo@123" },
  { role: "District Nodal Officer (Maharashtra / Pune)", id: "9890001234", password: "Demo@123" },
  { role: "Block Nodal Officer (Haveli, Pune, Maharashtra)", id: "9890005678", password: "Demo@123" },
  { role: "Line Ministry (Ministry of Education)", id: "9810007001", password: "Demo@123" },
  { role: "Spiritual Organisation (Brahma Kumaris)", id: "9810007002", password: "Demo@123" },
  { role: "Higher Education Institution (Delhi University)", id: "9810007003", password: "Demo@123" },
  { role: "GIA (Muktangan Rehabilitation Centre)", id: "9810007004", password: "Demo@123" },
];

const meta = {
  title: "Components/DemoAccountsPanel",
  component: DemoAccountsPanel,
  args: {
    accounts: NMBA_ACCOUNTS,
    idLabel: "Mobile / ID",
  },
  argTypes: {
    idLabel: { control: "text" },
    accounts: { control: false },
    onFill: { control: false },
    onUse: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DemoAccountsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** NMBA's realistic account set — Admin down through the NAPDDR reporting roles. */
export const Playground: Story = {};

/** PM-AJAY signs in by employee ID, so the identifier column is renamed. */
export const EmployeeIdPortal: Story = {
  args: {
    idLabel: "Employee ID",
    accounts: [
      { role: "Joint Secretary", id: "JS001", password: "Password@123" },
      { role: "District Secretary", id: "DS002", password: "Password@123" },
      { role: "State Officer", id: "SO003", password: "Password@123" },
      { role: "District Officer", id: "DO005", password: "Password@123" },
    ],
  },
};

/** TG's admin shell resolves the role from the login email. */
export const EmailPortal: Story = {
  args: {
    idLabel: "Email",
    accounts: [
      { role: "Central Admin", id: "central.admin@mosje.in", password: "123456" },
      { role: "Examining Officer", id: "examining.officer@mosje.in", password: "123456" },
      { role: "Checker", id: "checker@mosje.in", password: "123456" },
      { role: "District Magistrate", id: "district.magistrate@mosje.in", password: "123456" },
    ],
  },
};

/**
 * The default event path. Pressing **Use** dispatches `demo:fill`; a stand-in
 * login form in a completely different subtree — the arrangement `DemoDock`
 * actually relies on — is listening and prefills.
 */
export const GlobalFillEvent: Story = {
  render: function Render(args) {
    const [filled, setFilled] = React.useState<DemoFillDetail | null>(null);
    React.useEffect(() => {
      const handler = (e: Event) => setFilled((e as CustomEvent<DemoFillDetail>).detail);
      window.addEventListener("demo:fill", handler);
      return () => window.removeEventListener("demo:fill", handler);
    }, []);
    return (
      <div style={{ display: "grid", gap: 12, color: "var(--sa-color-text-default)" }}>
        <p style={{ margin: 0 }}>
          A stand-in login form, listening for <code>demo:fill</code>:
        </p>
        <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px" }}>
          <dt style={{ color: "var(--sa-text-neutral-subtle)" }}>Mobile / ID</dt>
          <dd style={{ margin: 0 }}>
            <code>{filled?.id ?? "—"}</code>
          </dd>
          <dt style={{ color: "var(--sa-text-neutral-subtle)" }}>Password</dt>
          <dd style={{ margin: 0 }}>
            <code>{filled?.password ?? "—"}</code>
          </dd>
        </dl>
        <DemoAccountsPanel {...args} />
      </div>
    );
  },
};

/**
 * `onFill` replaces the dispatch — for a panel co-located with the form it
 * fills — and `onUse` fires either way, letting a containing shell close
 * itself on selection.
 */
export const OnFillAndOnUseCallbacks: Story = {
  render: function Render(args) {
    const [filled, setFilled] = React.useState<string>("—");
    const [closed, setClosed] = React.useState(false);
    if (closed) {
      return (
        <p style={{ color: "var(--sa-text-neutral-subtle)" }}>
          <code>onUse</code> fired — the containing shell would close here.
        </p>
      );
    }
    return (
      <div style={{ display: "grid", gap: 12, color: "var(--sa-color-text-default)" }}>
        <p style={{ margin: 0 }}>
          Filled directly, with no event: <code>{filled}</code>
        </p>
        <DemoAccountsPanel
          {...args}
          onFill={(id, password) => setFilled(`${id} · ${password}`)}
          onUse={() => setClosed(true)}
        />
      </div>
    );
  },
};
