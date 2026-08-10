import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DemoFab, type DemoFillDetail } from "@mosje/design-system";

/**
 * **DemoFab** — the review-only credentials panel. **Never ships to
 * production.**
 *
 * It exists because every MoSJE portal has to be testable by people who have no
 * account: reviewers, stakeholders, BAs. Without it, "log in and check" means
 * asking someone for a password. See `.claude/rules/portal-login-demos.md` for
 * the accounts each portal carries.
 *
 * **`devMode` is the whole safety mechanism.** It defaults to `false` and the
 * component returns `null` when it is false. Wire it to
 * `process.env.NODE_ENV === "development"` or a staging flag — **never
 * hard-code `true`**, which is the one way this leaks a credentials list into a
 * public government build.
 *
 * The **Use** button has two modes, and the odd-looking default is the useful
 * one: with no `onFill`, it dispatches a global `demo:fill` CustomEvent. That
 * lets the FAB live in the root layout while the login page — a different tree
 * entirely — prefills itself, with no prop-drilling and no shared store. Pass
 * `onFill` only when the FAB is co-located with the form.
 *
 * `idLabel` names the identifier column, because portals differ: NMBA and SCW
 * sign in by mobile number, PM-AJAY by employee ID.
 *
 * Lifecycle: **Stable** (demo tooling — not part of the production surface).
 */
const ACCOUNTS = [
  { role: "Admin", id: "9999999999", password: "Demo@123" },
  { role: "State Nodal Officer (Maharashtra)", id: "9890123456", password: "Demo@123" },
  { role: "District Nodal Officer (Pune)", id: "9890001234", password: "Demo@123" },
  { role: "Block Nodal Officer (Haveli, Pune)", id: "9890005678", password: "Demo@123" },
  { role: "Line Ministry (Education)", id: "9810007001", password: "Demo@123" },
];

const meta = {
  title: "Components/DemoFab",
  component: DemoFab,
  args: {
    accounts: ACCOUNTS,
    devMode: true,
    idLabel: "Mobile / ID",
  },
  argTypes: {
    devMode: { control: "boolean" },
    idLabel: { control: "text" },
    accounts: { control: false },
    onFill: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 520, position: "relative" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DemoFab>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The NMBA account list. `devMode` is forced on here so it is visible. */
export const Playground: Story = {};

/**
 * `devMode={false}` — the production behaviour. It renders **nothing at all**,
 * which is the point: the credentials never reach the DOM.
 */
export const DevModeOffRendersNothing: Story = {
  args: { devMode: false },
  render: (args) => (
    <div style={{ color: "var(--ds-ink-muted)" }}>
      <p style={{ marginTop: 0 }}>
        Nothing is rendered below — with <code>devMode</code> false the component returns
        <code> null</code> before any account reaches the DOM. This is the production path.
      </p>
      <DemoFab {...args} />
    </div>
  ),
};

/** PM-AJAY signs in by employee ID, so the column is renamed. */
export const EmployeeIdPortal: Story = {
  args: {
    idLabel: "Employee ID",
    accounts: [
      { role: "Joint Secretary", id: "JS001", password: "Password@123" },
      { role: "State Officer", id: "SO003", password: "Password@123" },
      { role: "District Officer", id: "DO005", password: "Password@123" },
    ],
  },
};

/**
 * The default event path. The FAB dispatches `demo:fill`; a login page in a
 * completely different tree listens and prefills. Press **Use** to watch it
 * arrive.
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
      <div style={{ display: "grid", gap: 12, color: "var(--ds-ink)" }}>
        <p style={{ margin: 0 }}>
          A stand-in login form, listening for <code>demo:fill</code>:
        </p>
        <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px" }}>
          <dt style={{ color: "var(--ds-ink-muted)" }}>Mobile / ID</dt>
          <dd style={{ margin: 0 }}>
            <code>{filled?.id ?? "—"}</code>
          </dd>
          <dt style={{ color: "var(--ds-ink-muted)" }}>Password</dt>
          <dd style={{ margin: 0 }}>
            <code>{filled?.password ?? "—"}</code>
          </dd>
        </dl>
        <DemoFab {...args} />
      </div>
    );
  },
};

/** `onFill` instead — for when the FAB sits beside the form it fills. */
export const CoLocatedOnFill: Story = {
  render: function Render(args) {
    const [filled, setFilled] = React.useState<string>("—");
    return (
      <div style={{ display: "grid", gap: 12, color: "var(--ds-ink)" }}>
        <p style={{ margin: 0 }}>
          Filled directly, with no event: <code>{filled}</code>
        </p>
        <DemoFab {...args} onFill={(id, password) => setFilled(`${id} · ${password}`)} />
      </div>
    );
  },
};
