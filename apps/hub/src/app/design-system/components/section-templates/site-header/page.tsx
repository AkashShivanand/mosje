import type { Metadata } from "next";
import {
  DocsTabs, PropsTable,
  Callout,
  A11yChecklist,
  StatusBadge,
} from "@/components/design-system/docs-kit/index";
import { buttonClasses } from "@mosje/design-system";
import { figmaUrl } from "@/lib/design-system/figma";
import {
  SiteHeaderPreview,
  SiteHeaderNavyPreview,
  SiteHeaderCompactPreview,
} from "./header-preview";

export const metadata: Metadata = {
  title: "Navbar (Header)",
  description:
    "The SAMAVESH Navbar (SiteHeader) — one component, two variants. Website: accessibility bar + brand row (search + Login) + nav row with mega-menus. Portal: collapse toggle + emblem divider + cobranding + account, with optional scroll-collapse.",
};

/* ------------------------------------------------------------------ *
 * Shared layout primitives (inline styles, --sa-* tokens only)
 * ------------------------------------------------------------------ */


const sectionStyle: React.CSSProperties = {
  marginTop: "var(--sa-section-48)",
  scrollMarginTop: "var(--sa-section-48)",
};

const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)",
  fontWeight: 700,
  color: "var(--sa-text-neutral-base)",
  marginBottom: "var(--sa-stack-16)",
  paddingBottom: "var(--sa-padding-8)",
  borderBottom: "1px solid var(--sa-border-neutral-subtle)",
};

const h3Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-2-size)",
  fontWeight: 600,
  color: "var(--sa-text-neutral-base)",
  marginTop: "var(--sa-stack-24)",
  marginBottom: "var(--sa-stack-8)",
};

const proseStyle: React.CSSProperties = {
  color: "var(--sa-text-neutral-subtle)",
  fontSize: "var(--sa-type-body-1-size)",
  lineHeight: 1.7,
  maxWidth: "68ch",
};

const captionStyle: React.CSSProperties = {
  marginTop: "var(--sa-stack-8)",
  marginBottom: "var(--sa-stack-24)",
  color: "var(--sa-text-neutral-subtle)",
  fontSize: "var(--sa-type-body-2-size)",
};

const listStyle: React.CSSProperties = {
  ...proseStyle,
  marginTop: "var(--sa-stack-12)",
  paddingLeft: "var(--sa-padding-20)",
  lineHeight: 1.9,
};

function CodeBlock({ children }: { children: string }): React.JSX.Element {
  return (
    <pre
      style={{
        background: "var(--sa-bg-neutral-subtler)",
        border: "1px solid var(--sa-border-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        padding: "var(--sa-padding-16)",
        overflowX: "auto",
        fontSize: "var(--sa-type-body-2-size)",
        lineHeight: 1.6,
        color: "var(--sa-text-neutral-base)",
        marginTop: "var(--sa-stack-8)",
      }}
    >
      <code style={{ fontFamily: "var(--sa-font-mono)" }}>
        {children}
      </code>
    </pre>
  );
}

/** Annotated anatomy row — a labelled band in the stacked diagram. */
function AnatomyBand({
  n,
  title,
  desc,
  bg,
  fg,
}: {
  n: number;
  title: string;
  desc: string;
  bg: string;
  fg: string;
}): React.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--sa-stack-12)",
        padding: "var(--sa-padding-12) var(--sa-padding-16)",
        background: bg,
        color: fg,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "grid",
          placeItems: "center",
          width: 22,
          height: 22,
          flex: "0 0 auto",
          borderRadius: "var(--sa-shape-full)",
          border: `1px solid ${fg}`,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {n}
      </span>
      <span style={{ fontWeight: 600 }}>{title}</span>
      <span style={{ opacity: 0.85, fontSize: "var(--sa-type-body-2-size)" }}>{desc}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function HeaderPage(): React.JSX.Element {
  return (
    <main
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "var(--sa-padding-32) var(--sa-padding-24) var(--sa-section-56)",
      }}
    >
      {/* ---------------- Page header / Purpose ---------------- */}
      <header style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sa-stack-12)",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontSize: "var(--sa-type-display-1-size)",
              fontWeight: 800,
              color: "var(--sa-text-neutral-base)",
              margin: 0,
            }}
          >
            Navbar (Header)
          </h1>
          <StatusBadge status="Beta" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          The masthead of every SAMAVESH property is one component —{" "}
          <strong>SiteHeader</strong>, the SAMAVESH Navbar — matching the two Figma
          &quot;Navbar&quot; components pixel-for-pixel. Three tiers (accessibility bar ·
          brand row · nav row) with two variants chosen by a single{" "}
          <code>variant</code> prop:
        </p>
        <ul style={listStyle}>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Website</strong> — public
            Government-of-India chrome: emblem lockup, a search field, mega-menu
            navigation, and a Login CTA.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Portal</strong> — signed-in
            chrome: a sidebar collapse toggle, emblem divider, Digital India /
            SAMAVESH cobranding, an account block (with optional dropdown), and an
            opt-in scroll-collapse of the accessibility bar.
          </li>
        </ul>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <a
            className={buttonClasses("primary", "outlined", "md")}
            href={figmaUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            View in Figma <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* ============ 1. ANATOMY ============ */}
      
      <DocsTabs tabs={[
        { id: "design", label: "Design", content: (<><section style={sectionStyle}>
        <h2 id="anatomy" style={h2Style}>Anatomy</h2>
        <p style={proseStyle}>
          Every SiteHeader stacks three tiers in the same order. The brand row is
          always present; the accessibility bar and nav row are configurable.
        </p>
        <div
          style={{
            marginTop: "var(--sa-stack-16)",
            border: "1px solid var(--sa-border-neutral-subtle)",
            borderRadius: "var(--sa-shape-8)",
            overflow: "hidden",
          }}
        >
          <AnatomyBand
            n={1}
            title="Accessibility bar"
            desc="GoI link · accessibility statement · language"
            bg="var(--sa-color-action-primary-default)"
            fg="var(--sa-color-text-onPrimary)"
          />
          <AnatomyBand
            n={2}
            title="Brand row"
            desc="[collapse] · National Emblem + lockup · {search + CTA | cobranding + account}"
            bg="var(--sa-bg-neutral-base)"
            fg="var(--sa-color-text-default)"
          />
          <AnatomyBand
            n={3}
            title="Navigation row"
            desc="Primary nav — simple dropdowns or multi-column mega-menus; drawer < 1024px"
            bg="var(--sa-bg-neutral-subtler)"
            fg="var(--sa-color-text-default)"
          />
        </div>
        <p style={captionStyle}>
          Tier 1 and Tier 3 are optional (<code>accessibilityToolbar</code>,{" "}
          <code>nav</code>); Tier 2 is the constant masthead.
        </p>
      </section>
<section style={sectionStyle}>
        <h2 id="variants" style={h2Style}>When to use — choosing a variant</h2>
        <p style={proseStyle}>
          Set <code>variant</code> at the call site so intent is explicit and the
          right behavioural defaults apply. Public, content-led pages use{" "}
          <code>variant=&quot;website&quot;</code> + <code>search</code> +{" "}
          <code>actions</code>; signed-in portals use{" "}
          <code>variant=&quot;portal&quot;</code> + <code>onToggleNav</code> +{" "}
          <code>brandDivider</code> + <code>cobranding</code> + <code>account</code>.
          The <code>variant</code> prop also defaults <code>sticky</code> on for
          portals.
        </p>
        <div style={{ overflowX: "auto", marginTop: "var(--sa-stack-16)" }}>
          <table className="props-table">
            <thead>
              <tr>
                <th scope="col">Aspect</th>
                <th scope="col">variant=&quot;website&quot;</th>
                <th scope="col">variant=&quot;portal&quot;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Audience</td>
                <td>Anonymous public</td>
                <td>Authenticated officers</td>
              </tr>
              <tr>
                <td>Brand-row trailing</td>
                <td>Search field + Login CTA</td>
                <td>Collapse toggle + cobranding + account</td>
              </tr>
              <tr>
                <td>Nav row</td>
                <td>Horizontal nav + mega-menus</td>
                <td>Optional — usually a left sidebar instead</td>
              </tr>
              <tr>
                <td>Sticky default</td>
                <td>Off (static masthead)</td>
                <td>On (pinned app-shell chrome)</td>
              </tr>
              <tr>
                <td>Scroll-collapse</td>
                <td>—</td>
                <td>Opt-in via <code>collapseOnScroll</code></td>
              </tr>
              <tr>
                <td>Used by</td>
                <td>dosje website</td>
                <td>PM-AJAY · SMILE Admin · NMBA</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout type="tip" title="BETA badge is a usage choice">
          The <code>beta</code> badge is opt-in per property. Show it while a
          surface is genuinely pre-release; drop it on production citizen portals so
          it doesn&apos;t read as &quot;this service is unfinished.&quot;
        </Callout>
      </section>
<section style={sectionStyle}>
        <h2 id="responsive" style={h2Style}>Responsive</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", lineHeight: 1.9 }}>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>≥1024px</strong> — the
            horizontal nav row (with dropdowns / mega-menus) is shown.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>&lt;1024px</strong> — the nav
            row collapses; a hamburger in the brand row opens the drawer, where
            mega-menu columns flatten into a single sub-list.
          </li>
          <li>
            The search field hides below <code>900px</code>; cobranding marks hide
            below <code>768px</code>; the account name/email hides below{" "}
            <code>768px</code>, leaving the avatar.
          </li>
          <li>
            Content is centred to <code>maxWidth</code> (default 1320px); app-shell
            portals pass a larger value to run full-bleed above a sidebar.
          </li>
        </ul>
      </section></>) },
        { id: "develop", label: "Develop", content: (<><section style={sectionStyle}>
        <h2 id="props" style={h2Style}>Props</h2>
        <PropsTable
          props={[
            { name: "variant", type: '"website" | "portal" | "compact"', description: "Estate surface. Sets defaults (portal/compact ⇒ sticky on; compact drops the accessibility bar and moves nav inline) and documents intent. Explicit props always win." },
            { name: "homeHref", type: "string", description: 'Where the brand lockup links. ALWAYS pass it — the default "/" is the hub root, so a website page that omits it sends the emblem to the estate index instead of the site the reader is on.' },
            { name: "navExpanded", type: "boolean", description: "Portal: state of the sidebar the toggle drives. true ⇒ menu_open glyph, false ⇒ menu. Also drives aria-expanded. Only meaningful for MenuToggle — SheetToggle opens an overlay and has no second state." },
            { name: "navControlsId", type: "string", description: "Portal: id of the sidebar the toggle controls (aria-controls). Pass the same id to SidebarNav." },
            { name: "emblemSrc", type: "string", required: true, description: "National Emblem URL (basePath-aware; the DS renders a plain <img>)." },
            { name: "brandLines", type: "{ org?, ministry?, department }", required: true, description: "Government text lockup — GoI, Ministry, Department (+ optional BETA badge)." },
            { name: "nav", type: "NavItem[]", description: "Navigation row. Each item: children (simple dropdown) OR columns (mega-menu). Drawer below 1024px." },
            { name: "search", type: "{ placeholder?, onSearch? }", description: "Website: renders a search field (button) that calls onSearch." },
            { name: "actions", type: "React.ReactNode", description: "Trailing CTA in the brand row (e.g. a Login / Apply Online button)." },
            { name: "onToggleNav", type: "() => void", description: "Portal: renders a collapse/menu toggle on the far left of the brand row." },
            { name: "brandDivider", type: "boolean", default: "false", description: "Portal: blue gradient divider between the emblem and the text." },
            { name: "cobranding", type: "BrandMark[]", description: "Cobranding marks in the trailing zone (Digital India, SAMAVESH …)." },
            { name: "account / accountMenu", type: "HeaderAccount / AccountMenuItem[]", description: "Portal account block; pass accountMenu to make it a dropdown trigger." },
            { name: "sticky", type: "boolean", default: "false (true when variant=portal)", description: "Pin the whole navbar to the top of the viewport." },
            { name: "collapseOnScroll", type: "boolean", default: "false", description: "Opt-in: collapse the accessibility bar on scroll (Figma 'Appbar / on Scroll'). Mind sidebar offsets." },
            { name: "tone", type: '"blue" | "navy"', default: '"blue"', description: "Accessibility-bar background. Blue = website, navy = portal chrome." },
            { name: "beta", type: "boolean", default: "false", description: "Show the BETA badge above the text stack." },
            { name: "accessibilityToolbar", type: "boolean", default: "true", description: "Render the accessibility-statement control. Font-size / contrast controls live in the official UX4GAccessibilityWidget instead — see the Accessibility foundation page." },
            { name: "onAccessibility / accessibilityHref", type: "() => void / string", default: '"/accessibility-statement"', description: "Accessibility control: a handler, else a link to the statement page." },
            { name: "language", type: "{ label?, onClick? }", default: '{ label: "English" }', description: "Language selector in the accessibility bar." },
            { name: "govLink", type: "{ href, label, flagSrc? }", description: "Top-left Government-of-India link. Defaults to india.gov.in." },
            { name: "maxWidth / skipTo", type: "number / string", default: '1320 / "#main-content"', description: "Content max-width and the skip-to-content target id." },
          ]}
        />
      </section>
<section style={sectionStyle}>
        <h2 id="behavior" style={h2Style}>Behavior &amp; Keyboard</h2>
        <p style={proseStyle}>
          Every control is reachable and operable by keyboard, and announces its
          state.
        </p>
        <div style={{ overflowX: "auto", marginTop: "var(--sa-stack-16)" }}>
          <table className="props-table">
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>Tab</code> / <code>Shift+Tab</code></td><td>Move through the accessibility bar, brand-row controls, and nav items in DOM order.</td></tr>
              <tr><td><code>Enter</code> / <code>Space</code></td><td>Activate a control; on a nav parent, open its dropdown or mega-menu.</td></tr>
              <tr><td><code>Escape</code></td><td>Close an open nav menu, the account menu, or the mobile drawer.</td></tr>
              <tr><td>Click outside / blur</td><td>Closes any open menu — focus leaving the nav dismisses it.</td></tr>
            </tbody>
          </table>
        </div>
        <Callout type="info" title="Persistence">
          Text-size, contrast, and every other accessibility preference are owned by
          the official <code>UX4GAccessibilityWidget</code> (not the header) and
          persist across navigation for every SAMAVESH property.
        </Callout>
      </section>
<section style={sectionStyle}>
        <h2 id="code" style={h2Style}>Code</h2>
        <CodeBlock>{`import { SiteHeader } from "@mosje/design-system";

// Website — search field + Login + mega-menu nav
<SiteHeader
  variant="website"
  homeHref="/website"            // ← the zone root, NOT the hub root
  emblemSrc={\`\${basePath}/images/National-Emblem-logo.svg\`}
  brandLines={{ org: "Government of India", ministry: "…", department: "…" }}
  beta
  search={{ placeholder: "Search Schemes…", onSearch: () => router.push("/search") }}
  cobranding={[{ src: digitalIndia, alt: "Digital India", href: "https://www.digitalindia.gov.in/", height: 40 }]}
  nav={NAV}
  actions={<a href="/admin">Login</a>}
/>;

// Portal — collapse toggle + divider + cobranding + account (sticky by default)
<SiteHeader
  variant="portal"
  homeHref="/portals/<slug>"
  emblemSrc={emblem}
  brandLines={{ org: "Government of India", ministry: "…", department: "…" }}
  brandDivider
  onToggleNav={toggleSidebar}
  navExpanded={!sidebarCollapsed}   // menu_open when expanded, menu when collapsed
  navControlsId="portal-sidebar"
  cobranding={[
    { src: digitalIndia, alt: "Digital India", href: "https://www.digitalindia.gov.in/", height: 40 },
    { src: samavesh, alt: "SAMAVESH", height: 44 },
  ]}
  account={{ name: "Sachin Malhotra", email: "sachin.malhotra@email.com" }}
  accountMenu={[
    { label: "Profile", onSelect: openProfile },
    { label: "Sign out", danger: true, onSelect: signOut },
  ]}
/>;

// Compact — hub index surfaces. One tier, nav inline, no accessibility bar.
<SiteHeader
  variant="compact"
  homeHref="/"
  emblemSrc="/images/National-Emblem-logo.svg"
  brandLines={{ ministry: "Ministry of Social Justice & Empowerment", department: "Digital Estate" }}
  nav={[{ label: "Website", href: "/website" }, { label: "Portals", href: "/portals" }]}
/>;`}</CodeBlock>
      </section>
<section style={sectionStyle}>
        <h2 id="reuse" style={h2Style}>Reuse across the estate</h2>
        <p style={proseStyle}>
          One definition, imported everywhere — no per-app header forks. Each app
          supplies its own data and basePath-aware asset URLs.
        </p>
        <div style={{ overflowX: "auto", marginTop: "var(--sa-stack-16)" }}>
          <table className="props-table">
            <thead>
              <tr>
                <th scope="col">Surface</th>
                <th scope="col">variant</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>dosje website</td><td>website</td><td>Search field, Digital India, Admin Login, mega-menu nav</td></tr>
              <tr><td>PM-AJAY</td><td>portal</td><td>Brand chrome — divider + Digital India / SAMAVESH</td></tr>
              <tr><td>SMILE Admin</td><td>portal</td><td>Sticky · sidebar toggle + account dropdown</td></tr>
              <tr><td>NMBA — Patient Data Monitoring</td><td>portal</td><td>Sticky · sidebar toggle + account dropdown + Last-login</td></tr>
            </tbody>
          </table>
        </div>
        <Callout type="info" title="Shared parts">
          Need only a piece? <strong>BrandLockup</strong> (emblem + government
          stack, with a <code>compact</code> mode) and <strong>AccountMenu</strong>{" "}
          (avatar + dropdown) are exported directly, so a surface never
          re-implements them. The lockup always renders the National Emblem —
          never an invented mark.
        </Callout>
      </section></>) },
        { id: "accessibility", label: "Accessibility", content: (<><section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>Accessibility</h2>
        <p style={proseStyle}>
          The masthead is the first landmark on every page, so it must satisfy WCAG
          2.1 AA and GIGW. The accessibility toolbar is{" "}
          <strong>functional by default</strong> — the design system owns the
          behaviour so no property can ship a dead control.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <A11yChecklist
            items={[
              { criterion: "Text resize & contrast", level: "AA", description: "Font-size, spacing, and contrast are handled by the official UX4GAccessibilityWidget (one canonical mechanism, everywhere) — the header no longer duplicates them. (WCAG 1.4.4)" },
              { criterion: "Icon controls are labelled", level: "A", description: "Accessibility-statement and language icon buttons carry aria-label + a title tooltip so their purpose is never a guessing game. (WCAG 1.1.1)" },
              { criterion: "Visible keyboard focus", level: "AA", description: "Every interactive element — nav links, dropdown / mega-menu links, search, toggles — shows a 2px focus ring. (WCAG 2.4.7)" },
              { criterion: "Keyboard-operable menus", level: "AA", description: "Nav dropdowns and mega-menus open on Enter and close on Escape, outside-click, or focus leaving the nav. (WCAG 2.1.1)" },
              { criterion: "Disclosure, not fake dialog", level: "AA", description: "The mobile menu is a labelled <nav> region controlled by an aria-expanded / aria-controls button; Escape closes it and focus moves to the first item. (WCAG 4.1.2)" },
              { criterion: "Reduced motion", level: "AA", description: "The scroll-collapse transition is disabled under prefers-reduced-motion. (WCAG 2.3.3)" },
              { criterion: "Skip to content", level: "A", description: "A skip link becomes visible on focus and targets the main content. (WCAG 2.4.1)" },
              { criterion: "Accessibility statement", level: "AA", description: "The accessibility control links to a /accessibility-statement page (GIGW-mandated) unless an app overrides it. (GIGW)" },
            ]}
          />
        </div>
        <Callout type="tip" title="One accessibility mechanism, everywhere">
          Text-size, spacing, contrast and dark mode live in the official{" "}
          <code>UX4GAccessibilityWidget</code> (from <code>@mosje/design-system</code>),
          rendered once in the root layout — not in the header. The header used to carry
          its own font-size / contrast controls; they were retired because they duplicated
          the widget. See the{" "}
          <a href="/design-system/foundations/accessibility">Accessibility foundation page</a>.
        </Callout>
      </section></>) },
        { id: "meta", label: "Meta", content: (<><section style={sectionStyle}>
        <h2 id="site-header" style={h2Style}>Variants</h2>
        <p style={proseStyle}>
          Matches the UX4G <strong>Navbar Website</strong> (Figma{" "}
          <code>2210-11837</code>) — three tiers: (1) the Government-of-India
          accessibility bar; (2) the brand row — National Emblem lockup, a search
          field, and a Login CTA; (3) the navigation row, which here includes an{" "}
          <strong>&quot;Associated Organisations&quot;</strong> mega-menu. Open a
          dropdown, open the mega-menu, and resize below 1024px to see the drawer.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <SiteHeaderPreview />
          <p style={captionStyle}>
            Website variant — <code>search</code> + <code>actions</code> (Login) +{" "}
            <code>nav</code> with a 3-column mega-menu.
          </p>
        </div>

        <h3 id="portal" style={{ ...h3Style, scrollMarginTop: "var(--sa-section-48)" }}>Portal variant</h3>
        <p style={proseStyle}>
          Matches the <strong>Navbar Portal / Appbar</strong> (Figma{" "}
          <code>4235-3170</code>): a collapse toggle (<code>onToggleNav</code>), a
          gradient divider beside the emblem (<code>brandDivider</code>), cobranding
          marks, and an account block (<code>account</code>) in place of the search
          field + Login.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <SiteHeaderNavyPreview />
          <p style={captionStyle}>
            Portal variant — <code>onToggleNav</code> + <code>navExpanded</code> +{" "}
            <code>brandDivider</code> + <code>account</code> + <code>nav</code>. The
            toggle above is live: click it and the glyph swaps between{" "}
            <code>menu_open</code> and <code>menu</code>, mirroring the sidebar it
            drives (Figma <strong>Navbar/MenuToggle</strong>, variant{" "}
            <code>Sidebar</code>).
          </p>
        </div>

        <h3 id="parts" style={{ ...h3Style, scrollMarginTop: "var(--sa-section-48)" }}>The parts, on their own</h3>
        <p style={proseStyle}>
          Every piece the Figma Navbar page names is an export:{" "}
          <code>MenuToggle</code>, <code>SheetToggle</code>, <code>NavItemLink</code>,{" "}
          <code>NavDropdown</code>, <code>DropdownItem</code>, <code>MegaMenu</code>,{" "}
          <code>MegaMenuItem</code>, <code>NavSheet</code>. Import one when a surface
          needs that piece <em>without</em> the masthead — until v0.31.0 they were
          inline markup, so the only way to reuse a mega-menu was to rebuild it.
        </p>
        <p style={proseStyle}>
          <strong>The two triggers are not interchangeable.</strong>{" "}
          <code>MenuToggle</code> drives a <em>persistent sidebar</em>: the sidebar is
          on screen either way, so the control shows which way it will go and takes{" "}
          <code>navExpanded</code>. <code>SheetToggle</code> opens <code>NavSheet</code>,
          an <em>overlay</em> dismissed by its own close button — one glyph, no state.
          A sidebar-shaped property on the overlay trigger describes something that
          does not exist.
        </p>

        <h3 id="compact" style={{ ...h3Style, scrollMarginTop: "var(--sa-section-48)" }}>Compact variant</h3>
        <p style={proseStyle}>
          For internal index / wayfinding surfaces that are <em>not</em> public
          government pages — the hub landing, <code>/portals</code>,{" "}
          <code>/reports</code>. One 64px tier: compact lockup, primary nav inline
          in the brand row, and <strong>no accessibility bar</strong>, because there
          is no government masthead to qualify. Everything else — dropdowns, the
          mobile drawer, focus treatment — is the same component.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <SiteHeaderCompactPreview />
          <p style={captionStyle}>
            Compact variant — <code>nav</code> inline, <code>homeHref</code>, no
            accessibility bar. The page must supply its own skip link.
          </p>
        </div>
      </section>
<section style={sectionStyle}>
        <h2 id="menus" style={h2Style}>Menus — dropdowns &amp; mega-menus</h2>
        <p style={proseStyle}>
          A nav item opens a menu when it carries either <code>children</code>{" "}
          (a single column) or <code>columns</code> (a titled multi-column
          mega-menu). Use a mega-menu for org-heavy groupings — e.g. the
          department&apos;s associated Commissions, Corporations, and Councils —
          where a single column would scroll awkwardly. If both are supplied,{" "}
          <code>columns</code> wins. On mobile, a mega-menu&apos;s columns flatten
          into the drawer&apos;s sub-list.
        </p>
        <CodeBlock>{`const NAV: NavItem[] = [
  { label: "Home", href: "/", active: true },
  // Simple dropdown
  { label: "Department", href: "/dept", children: [
    { label: "About Us", href: "/about" },
    { label: "Who’s Who", href: "/whos-who" },
  ]},
  // Mega-menu — titled columns
  { label: "Associated Organisations", href: "/orgs", columns: [
    { heading: "Commissions",  links: [{ label: "NCSC", href: "/ncsc" }, …] },
    { heading: "Corporations", links: [{ label: "NSFDC", href: "/nsfdc" }, …] },
    { heading: "Councils & Institutes", links: [{ label: "NISD", href: "/nisd" }, …] },
  ]},
];`}</CodeBlock>
        <h3 style={h3Style}>Scroll-collapse (portal)</h3>
        <p style={proseStyle}>
          Sticky portals can pass <code>collapseOnScroll</code> to tuck the
          accessibility bar away once the page scrolls (Figma &quot;Appbar / on
          Scroll&quot;), reclaiming vertical space. It is opt-in because the chrome
          gets shorter — any app-shell sidebar offset must account for the scrolled
          height (or make the sidebar sticky beneath the brand row). It also honours{" "}
          <code>prefers-reduced-motion</code>.
        </p>
      </section>
<section style={sectionStyle}>
        <h2 id="content" style={h2Style}>Content &amp; Voice</h2>
        <ul style={listStyle}>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Department line</strong> —
            use the full official name (&quot;Department of Social Justice &amp;
            Empowerment&quot;). Don&apos;t abbreviate to an acronym in the masthead.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Nav labels</strong> — short
            noun phrases in Title Case (&quot;Schemes &amp; Services&quot;, not
            &quot;Click here for schemes&quot;). Keep them to 1–2 words where
            possible so the row doesn&apos;t wrap.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Mega-menu headings</strong> —
            name the grouping, not the action (&quot;Commissions&quot;,
            &quot;Corporations&quot;).
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Search placeholder</strong> —
            hint at scope (&quot;Search schemes, services, documents&quot;) rather
            than a bare &quot;Search&quot;.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>CTA</strong> — one primary
            action only (&quot;Login&quot; / &quot;Apply Online&quot;). The masthead
            is wayfinding, not a place to stack buttons.
          </li>
        </ul>
      </section>
<section style={sectionStyle}>
        <h2 id="related" style={h2Style}>Related</h2>
        <ul style={listStyle}>
          <li>
            <a href="/design-system/components/section-templates/sidebar" style={{ color: "var(--sa-text-brand-primary-base)" }}>Sidebar Nav</a>{" "}
            — the portal app-shell left navigation that pairs with the Portal variant.
          </li>
          <li>
            <a href="/design-system/components/utilities/accessibility-bar" style={{ color: "var(--sa-text-brand-primary-base)" }}>Accessibility Bar</a>{" "}
            — the government utility strip that sits directly above the Website variant.
          </li>
          <li>
            <a href="/design-system/components/actions/button" style={{ color: "var(--sa-text-brand-primary-base)" }}>Button</a>{" "}
            — used for the brand-row CTA (<code>actions</code>).
          </li>
          <li>
            <a href="/design-system/foundations/color" style={{ color: "var(--sa-text-brand-primary-base)" }}>Color &amp; theming</a>{" "}
            — the brand axis (<code>data-brand</code>) and appearance
            (<code>data-theme</code>), distinct from the accessibility widget&apos;s
            own contrast/dark mode.
          </li>
        </ul>
      </section>
<section style={sectionStyle}>
        <h2 id="changelog" style={h2Style}>Changelog</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", lineHeight: 1.9 }}>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Accessibility consolidation</strong>{" "}
            — retired the header&apos;s own text-size (A−/A/A+) and contrast controls
            from the &quot;Accessibility hardening&quot; update below; they duplicated
            the official <code>UX4GAccessibilityWidget</code>, now the single
            mechanism everywhere. See{" "}
            <code>docs/specs/samavesh-accessibility-consolidation.md</code>.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Variants &amp; menus</strong>{" "}
            — added an explicit <code>variant</code> prop, multi-column{" "}
            <code>columns</code> mega-menus, an opt-in <code>collapseOnScroll</code>{" "}
            state, and tooltips on the icon controls.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Accessibility hardening</strong>{" "}
            — the text-size and contrast controls are functional by default
            (root font-size + <code>data-theme=&quot;hc&quot;</code>, persisted);
            added <code>aria-pressed</code>; visible keyboard focus on every
            control (WCAG 2.4.7); nav menus close on Escape / outside-click /
            blur; the mobile menu is a proper disclosure region (no fake dialog).
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Consolidation</strong> — one{" "}
            <code>SiteHeader</code> (Website + Portal variants) replaces the retired{" "}
            <code>AppHeader</code>; account block gains an optional dropdown.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Figma parity</strong> — rebuilt
            to the UX4G Navbar Website (<code>2210-11837</code>) + Portal Appbar
            (<code>4235-3170</code>) components.
          </li>
        </ul>
      </section></>) }
      ]} />
</main>
  );
}
