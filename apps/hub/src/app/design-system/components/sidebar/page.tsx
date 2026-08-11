import type { Metadata } from "next";
import {
  PropsTable,
  Callout,
  A11yChecklist,
  StatusBadge,
} from "@/components/design-system/docs-kit/index";
import { buttonClasses } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Sidebar Nav",
  description:
    "The SAMAVESH SidebarNav — portal left-hand navigation. Supports two-level hierarchy with expandable groups, a curved connector visual, and expanded/collapsed modes.",
};

/* ------------------------------------------------------------------ *
 * Layout primitives
 * ------------------------------------------------------------------ */

const sectionStyle: React.CSSProperties = {
  marginTop: "var(--ds-spacing-5xl)",
  scrollMarginTop: "var(--ds-spacing-5xl)",
};

const h2Style: React.CSSProperties = {
  fontSize: "var(--ds-text-headline)", lineHeight: "var(--ds-leading-headline)",
  fontWeight: 700,
  color: "var(--ds-ink)",
  marginBottom: "var(--ds-spacing-lg)",
  paddingBottom: "var(--ds-spacing-sm)",
  borderBottom: "1px solid var(--ds-border)",
};

const h3Style: React.CSSProperties = {
  fontSize: "var(--ds-text-title-1)",
  fontWeight: 600,
  color: "var(--ds-ink)",
  marginTop: "var(--ds-spacing-2xl)",
  marginBottom: "var(--ds-spacing-sm)",
};

const proseStyle: React.CSSProperties = {
  color: "var(--ds-ink-muted)",
  fontSize: "var(--ds-text-body-1)",
  lineHeight: 1.7,
  maxWidth: "68ch",
};

function CodeBlock({ children }: { children: string }): React.JSX.Element {
  return (
    <pre
      style={{
        background: "var(--ds-surface-muted)",
        border: "1px solid var(--ds-border)",
        borderRadius: "var(--ds-radius-md, 8px)",
        padding: "var(--ds-spacing-lg)",
        overflowX: "auto",
        fontSize: "var(--ds-text-body-2)",
        lineHeight: 1.6,
        color: "var(--ds-ink)",
        marginTop: "var(--ds-spacing-sm)",
      }}
    >
      <code style={{ fontFamily: "var(--ds-font-mono, monospace)" }}>
        {children}
      </code>
    </pre>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

const PORTAL_DS_SIDEBAR_URL =
  "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=4208-740";

export default function SidebarPage(): React.JSX.Element {
  return (
    <main
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "var(--ds-spacing-3xl) var(--ds-spacing-2xl) var(--ds-spacing-6xl)",
      }}
    >
      {/* ── Title ── */}
      <header style={{ marginBottom: "var(--ds-spacing-3xl)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--ds-spacing-md)",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontSize: "var(--ds-text-display)",
              fontWeight: 800,
              color: "var(--ds-ink)",
              margin: 0,
            }}
          >
            Sidebar Nav
          </h1>
          <StatusBadge status="Beta" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--ds-spacing-md)" }}>
          The portal app-shell left navigation. Renders a two-level hierarchy —
          top-level items with optional expandable groups and children linked
          by a curved connector — in either an expanded (300 px) or icon-only
          collapsed (64 px) mode. Fully token-driven; active states auto-adapt
          to the portal&apos;s colour mode.
        </p>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <a
            className={buttonClasses("primary", "outlined", "md")}
            href={PORTAL_DS_SIDEBAR_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in Figma (SAMAVESH DS) <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* ============ 1. IMPORT ============ */}
      <section style={sectionStyle}>
        <h2 id="import" style={h2Style}>
          1. Import
        </h2>
        <CodeBlock>{`import { SidebarNav } from "@mosje/design-system";
import type { SidebarNavGroup } from "@mosje/design-system";`}</CodeBlock>
      </section>

      {/* ============ 2. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>
          2. Usage
        </h2>

        <h3 style={h3Style}>Basic (flat nav, no groups)</h3>
        <CodeBlock>{`import { SidebarNav } from "@mosje/design-system";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "grid_view" },
  { label: "Users",     href: "/users",     icon: "group" },
  { label: "Reports",   href: "/reports",   icon: "description" },
];

<SidebarNav
  groups={[{ items: NAV }]}
  pathname={usePathname()}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
  showCollapseControl
/>`}</CodeBlock>

        <h3 style={h3Style}>Grouped with children</h3>
        <CodeBlock>{`const NAV_GROUPS = [
  {
    items: [{ label: "Dashboard", href: "/dashboard", icon: "grid_view" }],
  },
  {
    label: "Beneficiaries",
    items: [
      {
        label: "Transgender",
        href: "/transgender",
        icon: UserIcon,
        children: [
          { label: "Dashboard", href: "/transgender/dashboard" },
          { label: "Certificate/ID", href: "/transgender/certificate" },
          { label: "Scholarships", href: "/transgender/scholarships" },
        ],
      },
      { label: "NMBA", href: "/nmba", icon: NmbaIcon },
    ],
  },
];

<SidebarNav
  groups={NAV_GROUPS}
  pathname={usePathname()}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
  showCollapseControl
  footer={<StatusFooter />}
/>`}</CodeBlock>

        <h3 style={h3Style}>With context-controlled collapse (smile-admin pattern)</h3>
        <CodeBlock>{`// Collapse state lives in global AppContext (persisted to localStorage).
const { sidebarCollapsed, setSidebarCollapsed } = useApp();

<SidebarNav
  groups={navForRole(account.role)}
  pathname={usePathname()}
  collapsed={sidebarCollapsed}
  onCollapsedChange={setSidebarCollapsed}
  footer={<StatusFooter />}
/>`}</CodeBlock>
      </section>

      {/* ============ 3. PROPS ============ */}
      <section style={sectionStyle}>
        <h2 id="props" style={h2Style}>
          3. Props
        </h2>

        <h3 style={h3Style}>SidebarNav</h3>
        <PropsTable
          props={[
            {
              name: "groups",
              type: "SidebarNavGroup[]",
              required: true,
              description:
                "Navigation groups. Each group has an optional label and an array of top-level items. Use a single group with no label for flat navigation.",
            },
            {
              name: "pathname",
              type: "string",
              required: true,
              description:
                "Current route path — used to derive active states for items and children. Pass usePathname() from next/navigation.",
            },
            {
              name: "collapsed",
              type: "boolean",
              default: "false",
              description:
                "When true, the sidebar renders in icon-only mode (64 px wide). Labels, badges, chevrons, children, and group labels are hidden. Icons include a title tooltip for accessibility.",
            },
            {
              name: "onCollapsedChange",
              type: "(collapsed: boolean) => void",
              description:
                "Callback fired when the user clicks the collapse-control handle. Required when showCollapseControl is true.",
            },
            {
              name: "showCollapseControl",
              type: "boolean",
              default: "false",
              description:
                "Renders a drag-handle button on the right edge of the sidebar (visible on hover) that toggles the collapsed state. Mirrors the Figma showControl prop.",
            },
            {
              name: "footer",
              type: "React.ReactNode",
              description:
                "Optional content pinned below the nav list (e.g. build version, system status). Rendered above a border-top separator.",
            },
            {
              name: "className",
              type: "string",
              description:
                "Additional classes applied to the <aside> element. Use to set sticky positioning, height, and border-r in the portal layout.",
            },
          ]}
        />

        <h3 style={h3Style}>SidebarNavGroup</h3>
        <PropsTable
          props={[
            {
              name: "label",
              type: "string",
              description:
                "Optional section heading shown above the group's items. Hidden in collapsed mode. Groups with no label render without a separator heading.",
            },
            {
              name: "items",
              type: "SidebarNavItem[]",
              required: true,
              description: "Top-level navigation items in this group.",
            },
          ]}
        />

        <h3 style={h3Style}>SidebarNavItem</h3>
        <PropsTable
          props={[
            {
              name: "label",
              type: "string",
              required: true,
              description: "Display label. Also used as the aria-label and title in collapsed mode.",
            },
            {
              name: "href",
              type: "string",
              required: true,
              description:
                "Destination URL. Rendered as an <a> tag. For group-toggle items (with children), clicking expands/collapses the children instead of navigating.",
            },
            {
              name: "icon",
              type: "React.ComponentType<{ className?: string }>",
              required: true,
              description:
                "Icon component. Lucide icons satisfy this signature. Rendered at 24 × 24 px.",
            },
            {
              name: "badge",
              type: "number | string",
              description:
                "Optional badge rendered next to the label (e.g. unread count). Hidden in collapsed mode.",
            },
            {
              name: "children",
              type: "SidebarNavChild[]",
              description:
                "When set, the item becomes a collapsible group with these children. A chevron is shown. The item acts as a toggle button, not a link. The group auto-expands when any child is active.",
            },
          ]}
        />

        <h3 style={h3Style}>SidebarNavChild</h3>
        <PropsTable
          props={[
            {
              name: "label",
              type: "string",
              required: true,
              description: "Display label for the child nav item.",
            },
            {
              name: "href",
              type: "string",
              required: true,
              description: "Destination URL. Rendered as an <a> tag.",
            },
          ]}
        />
      </section>

      {/* ============ 4. TOKENS ============ */}
      <section style={sectionStyle}>
        <h2 id="tokens" style={h2Style}>
          4. Design tokens
        </h2>
        <p style={proseStyle}>
          All values are resolved from the <code>--ds-*</code> contract.
          In the portal <code>blue-dark</code> colour mode these resolve to the
          navy ramp.
        </p>
        <div style={{ overflowX: "auto", marginTop: "var(--ds-spacing-lg)" }}>
          <table className="props-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Used for</th>
                <th scope="col">Figma source</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["--ds-primary-50", "Active item background", "--primary/50"],
                ["--ds-primary", "Active item text / icon", "--text/primary"],
                ["--ds-ink", "Default item text", "--text/dark"],
                ["--ds-ink-muted", "Group label, muted text", "--text/secondary"],
                ["--ds-surface-muted", "Hover background", "--neutral/100"],
                ["--ds-border", "Group separator, resize handle line", "--neutral/200"],
                ["--ds-radius-xl (16 px)", "Main item row border-radius", "--radius-xl"],
                ["--ds-radius-md (8 px)", "Child item label border-radius", "--radius-md"],
                ["--ds-primary-ring", "Focus outline", "--focus/ring"],
                ["--ds-duration-fast", "Hover/active transition", "--duration/fast"],
              ].map(([token, use, figma]) => (
                <tr key={token}>
                  <td>
                    <code style={{ fontFamily: "var(--ds-font-mono)" }}>{token}</code>
                  </td>
                  <td style={{ color: "var(--ds-ink-muted)" }}>{use}</td>
                  <td>
                    <code style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.85em", color: "var(--ds-ink-muted)" }}>
                      {figma}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ 5. BEHAVIOUR ============ */}
      <section style={sectionStyle}>
        <h2 id="behaviour" style={h2Style}>
          5. Behaviour
        </h2>

        <h3 style={h3Style}>Active detection</h3>
        <p style={proseStyle}>
          An item is active when <code>pathname === item.href</code> or{" "}
          <code>pathname.startsWith(item.href + &quot;/&quot;)</code>. A parent group is
          highlighted when any of its children is active; the group also
          auto-expands in that case.
        </p>

        <h3 style={h3Style}>Collapsed mode</h3>
        <p style={proseStyle}>
          Labels, badges, chevrons, children, and group labels are hidden. Each
          icon-only button carries a <code>title</code> and{" "}
          <code>aria-label</code> equal to the item label, satisfying WCAG 1.1.1
          for non-text content.
        </p>

        <h3 style={h3Style}>Connector visual</h3>
        <p style={proseStyle}>
          Child items within an expanded group are connected by a curved
          border-bottom-left-radius elbow drawn via CSS <code>::before</code>{" "}
          and <code>::after</code> pseudo-elements. The colour is{" "}
          <code>--ds-primary-50</code> so it automatically stays in sync with
          the portal brand colour mode. The connector is decorative and is not
          announced by screen readers.
        </p>

        <Callout type="info" title="No children in collapsed mode">
          Child items are always hidden in collapsed mode. The parent icon
          still reflects the active state when a child route is current.
        </Callout>
      </section>

      {/* ============ 6. PORTALS ============ */}
      <section style={sectionStyle}>
        <h2 id="portals" style={h2Style}>
          6. Portal usage
        </h2>
        <p style={proseStyle}>
          All MoSJE portals use <strong>SidebarNav</strong> — do not build
          custom sidebars in individual apps. The two key portals are:
        </p>
        <div style={{ overflowX: "auto", marginTop: "var(--ds-spacing-lg)" }}>
          <table className="props-table">
            <thead>
              <tr>
                <th scope="col">Portal</th>
                <th scope="col">Collapse state</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "SMILE Admin",
                  "AppContext (persisted to localStorage)",
                  "Role-filtered groups via navForRole(). Status footer. Header provides the toggle; showCollapseControl omitted.",
                ],
                [
                  "SCW",
                  "Local useState",
                  "Flat ADMIN_NAV / USER_NAV arrays wrapped in a single group. showCollapseControl enabled.",
                ],
                [
                  "NMBA",
                  "Local useState",
                  "Treatment-Centre uses a role-switched sidebar pattern; evaluate for migration separately.",
                ],
                [
                  "PM-AJAY",
                  "—",
                  "MIS dashboard — no persistent sidebar required; uses a top-nav pattern.",
                ],
              ].map(([portal, state, notes]) => (
                <tr key={portal}>
                  <td style={{ fontWeight: 600, color: "var(--ds-ink)" }}>{portal}</td>
                  <td style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.9em", color: "var(--ds-ink-muted)" }}>
                    {state}
                  </td>
                  <td style={{ color: "var(--ds-ink-muted)", fontSize: "0.9em" }}>{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============ 7. A11Y ============ */}
      <section style={sectionStyle}>
        <h2 id="a11y" style={h2Style}>
          7. Accessibility
        </h2>
        <A11yChecklist
          items={[
            {
              criterion: "1.1.1 Non-text content",
              level: "A",
              description:
                "Icon-only collapsed items carry aria-label and title equal to the item label.",
            },
            {
              criterion: "1.3.1 Info and relationships",
              level: "A",
              description:
                "Navigation wrapped in <aside aria-label> + <nav aria-label>. Groups use <ul role=list> and <li>.",
            },
            {
              criterion: "2.1.1 Keyboard",
              level: "A",
              description:
                "All interactive elements are reachable via Tab. Expandable groups use <button> with aria-expanded + aria-controls.",
            },
            {
              criterion: "2.4.3 Focus order",
              level: "A",
              description:
                "Focus follows DOM order: header → sidebar → main. No focus traps.",
            },
            {
              criterion: "2.4.6 Headings and labels",
              level: "AA",
              description:
                "aria-current='page' set on the active leaf item. Group toggle buttons name their controlled region via aria-controls.",
            },
            {
              criterion: "3.2.3 Consistent navigation",
              level: "AA",
              description:
                "Sidebar position and order is consistent across all portal pages.",
            },
            {
              criterion: "Skip navigation",
              level: "GIGW",
              description:
                "Portal layouts must provide a skip-to-main-content link before the sidebar (implemented in each portal's layout).",
            },
          ]}
        />
      </section>
    </main>
  );
}
