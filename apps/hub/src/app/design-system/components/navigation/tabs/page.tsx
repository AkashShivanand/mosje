import { DocsTabs } from "@/components/design-system/docs-kit";
import type { Metadata } from "next";
import {
  PropsTable,
  Callout,
  A11yChecklist,
  StatusBadge,
  DoDont,
  TokenTable,
} from "@/components/design-system/docs-kit/index";
import { TabsContentSpecimen, TabsDemo, TabsSizeSpecimen, TabsSpecimen } from "./tabs-demo";

export const metadata: Metadata = {
  title: "Tabs",
  description:
    "The SAMAVESH Tabs / TabPanel — accessible tabbed navigation for non-linear sections, implementing the WAI-ARIA Tabs pattern with roving tabindex and Arrow/Home/End keyboard support.",
};

/* ------------------------------------------------------------------ *
 * Layout primitives (shared shape with the other component pages)
 * ------------------------------------------------------------------ */


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
      <code style={{ fontFamily: "var(--sa-font-mono)" }}>{children}</code>
    </pre>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function TabsPage(): React.JSX.Element {
  return (
    <article
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "var(--sa-padding-32) var(--sa-padding-24) var(--sa-section-56)",
      }}
    >
      {/* ── Title ── */}
      <header style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 800, color: "var(--sa-color-text-default)", margin: 0 }}>Tabs</h1>
          <StatusBadge status="Beta" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          Accessible tabbed navigation for <strong>non-linear</strong> sections a user revisits in any order — a clinical
          record, a settings panel, a multi-facet detail view. <code>Tabs</code> implements the WAI-ARIA Tabs pattern with
          a roving <code>tabindex</code>, Arrow / Home / End keys, and a polite live-region announce. Use it when the user
          jumps freely between sections; reach for <code>&lt;Wizard&gt;</code> instead when the flow is a linear, ordered
          sequence of steps.
        </p>
      </header>

      {/* ============ Live demo ============ */}
      
      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="demo" style={h2Style}>
          Live demo
        </h2>
        <p style={proseStyle}>
          Focus a tab and use <strong>Arrow</strong> keys to move between sections, or <strong>Home</strong> / <strong>End</strong>{" "}
          to jump to the first / last.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <TabsDemo />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="import" style={h2Style}>
          1. Import
        </h2>
        <CodeBlock>{`import { Tabs, TabPanel } from "@mosje/design-system";
import type { TabDef } from "@mosje/design-system";`}</CodeBlock>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>
          2. Usage
        </h2>
        <p style={proseStyle}>
          The parent owns the active index and renders one <code>&lt;TabPanel&gt;</code> at a time. Pass a stable{" "}
          <code>idBase</code> (use <code>React.useId()</code>) so the tab ↔ panel ids stay wired.
        </p>
        <CodeBlock>{`"use client";
import * as React from "react";
import { DocsTabs } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";
import { Tabs, TabPanel, type TabDef } from "@mosje/design-system";

const SECTIONS: TabDef[] = [
  { id: "history", label: "Previous History" },
  { id: "dosage",  label: "Medication Dosage" },
  { id: "discharge", label: "Diagnosis & Discharge" },
];

function ClinicalRecord() {
  const [active, setActive] = React.useState(0);
  const idBase = React.useId();

  return (
    <>
      <Tabs
        tabs={SECTIONS}
        active={active}
        onChange={setActive}      // auto-save the current tab here, then switch
        idBase={idBase}
        ariaLabel="Clinical record sections"
      />
      <TabPanel idBase={idBase} tabId={SECTIONS[active].id}>
        {/* render the active section's fields */}
      </TabPanel>
    </>
  );
}`}</CodeBlock>

        <Callout type="info" title="Save-gated tabs">
          <code>onChange</code> fires before the index updates, so it&apos;s the right place to persist the current
          tab&apos;s data before moving (the clinical-record wizard saves each section on switch).
        </Callout>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="chrome" style={h2Style}>
          3. Indicator and track pair — only two of six combinations are correct
        </h2>
        <p style={proseStyle}>
          <code>indicator</code> and <code>track</code> look like two independent choices and are not.{" "}
          <code>track=&quot;enclosed&quot;</code> is a filled, bordered track and takes{" "}
          <code>indicator=&quot;pill&quot;</code>. <code>track=&quot;none&quot;</code> is an open list and takes{" "}
          <code>&quot;underline&quot;</code> when horizontal, <code>&quot;rail&quot;</code> when vertical. A pill on an
          open list has nothing to sit in; an underline inside a filled track draws a second edge a few pixels inside
          the first. The remaining four combinations render — nothing stops you — and read as broken.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <DoDont
            cards={[
              {
                type: "do",
                label: "enclosed + pill — a segmented control",
                preview: <TabsSpecimen track="enclosed" indicator="pill" label="Enclosed pill" />,
              },
              {
                type: "dont",
                label: "none + pill — the pill has no track to sit in",
                preview: <TabsSpecimen track="none" indicator="pill" label="Pill, no track" />,
              },
              {
                type: "do",
                label: "none + underline — an open list on a rule",
                preview: <TabsSpecimen track="none" indicator="underline" label="Open underline" />,
              },
              {
                type: "dont",
                label: "enclosed + underline — a second edge inside the first",
                preview: <TabsSpecimen track="enclosed" indicator="underline" label="Underline in a track" />,
              },
            ]}
          />
        </div>

        <h3 style={h3Style}>Vertical lists</h3>
        <p style={proseStyle}>
          <code>orientation=&quot;vertical&quot;</code> stacks the tabs and sets{" "}
          <code>aria-orientation=&quot;vertical&quot;</code>, so assistive technology announces the axis. The{" "}
          <code>rail</code> indicator is the vertical counterpart of <code>underline</code> — the same 2px mark, moved
          to the leading edge.
        </p>
        <div style={{ display: "flex", gap: "var(--sa-stack-32)", marginTop: "var(--sa-stack-16)", flexWrap: "wrap" }}>
          <TabsSpecimen orientation="vertical" track="none" indicator="rail" label="Vertical rail" width={220} />
          <TabsSpecimen orientation="vertical" track="enclosed" indicator="pill" label="Vertical pill" width={220} />
        </div>

        <Callout type="info" title="The divider is coplanar with the indicator">
          <code>divider</code> draws the rule the underline or rail sits <em>in</em> — the selected segment replaces
          that stretch of the rule rather than stacking a second line against it. It is ignored when{" "}
          <code>track=&quot;enclosed&quot;</code>, which has its own border.
        </Callout>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="size" style={h2Style}>
          4. Size
        </h2>
        <p style={proseStyle}>
          <code>s</code> / <code>m</code> / <code>l</code> resolve to <strong>36 / 44 / 48px</strong> at the 16px
          browser default. Those numbers are what the hug <em>resolves to</em>, not what is set: a tab&apos;s height is
          padding plus line-height, so it grows when a citizen raises their browser font size. Never pin a tab height.
        </p>
        <p style={proseStyle}>
          <code>size</code> applies to the whole list, never to one tab — a list whose tabs disagree about size is a
          defect. It also drives the leading icon (16 / 20 / 24) and the unread dot (6, stepping to 8 at{" "}
          <code>l</code>, because a dot is sized against the type it annotates).
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <TabsSizeSpecimen />
        </div>
        <Callout type="info" title="Target size">
          All three clear WCAG 2.2 SC 2.5.8 Target Size (Minimum), which is <strong>24×24</strong> at Level AA. Only{" "}
          <code>m</code> and <code>l</code> reach 44×44 — but that is SC 2.5.5, Level <strong>AAA</strong>, and UX4G&apos;s
          mobile recommendation. <code>s</code> is not an AA failure.
        </Callout>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="content" style={h2Style}>
          5. Icons, badges and disabled tabs
        </h2>
        <p style={proseStyle}>
          <code>TabDef</code> carries an optional Material Symbols <code>icon</code> name, a{" "}
          <code>badge</code> dot, and <code>disabled</code>. Pass the icon as a <em>name</em>, not an element —{" "}
          <code>Tabs</code> renders the glyph itself so it can drive the <code>opsz</code> optical-size axis from{" "}
          <code>size</code>. A CSS class would set the box but not the axis, drawing the glyph for one size and
          displaying it at another.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <TabsContentSpecimen />
        </div>
        <Callout type="warning" title="A disabled tab stays in the tablist">
          It keeps <code>role=&quot;tab&quot;</code> and is marked <code>aria-disabled</code>; the arrow keys step over
          it and Home/End land on the first and last <em>enabled</em> tab. It deliberately does{" "}
          <strong>not</strong> use the native <code>disabled</code> attribute — that drops the button out of the
          accessibility tree, so a screen-reader user loses the fact that the section exists at all. Removing the tab
          entirely has the same effect.
        </Callout>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="guidelines" style={h2Style}>
          10. Guidelines
        </h2>
        <Callout type="info" title="✓ Do">
          <ul style={{ margin: 0, paddingLeft: "1.2em", display: "flex", flexDirection: "column", gap: "var(--sa-stack-4)" }}>
            <li>Use Tabs for non-linear sections a user revisits in any order (records, settings, detail facets).</li>
            <li>Run save / validation inside <code>onChange</code> so switching tabs never loses data.</li>
            <li>Give the tablist a meaningful <code>ariaLabel</code> describing what the sections are.</li>
            <li>Pair <code>indicator</code> and <code>track</code> as §3 sets out, and keep <code>size</code> on the list.</li>
            <li>Write labels short enough that nothing truncates — check the Hindi rendering, not only the English.</li>
          </ul>
        </Callout>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <Callout type="warning" title="✕ Don't">
            <ul style={{ margin: 0, paddingLeft: "1.2em", display: "flex", flexDirection: "column", gap: "var(--sa-stack-4)" }}>
              <li>
                Don&apos;t use Tabs for an ordered, must-complete-in-sequence flow — use <code>&lt;Wizard&gt;</code> (a linear
                stepper) instead.
              </li>
              <li>Never hand-roll tab <code>&lt;button&gt;</code>s — that drops the role / keyboard contract this component guarantees.</li>
              <li>
                Don&apos;t render every <code>TabPanel</code> and hide the inactive ones with CSS — they stay in the
                accessibility tree and the tab order, so a keyboard user walks through controls they cannot see.
              </li>
              <li>
                Don&apos;t remove a tab to disable it, and don&apos;t reach for the native <code>disabled</code>{" "}
                attribute — both hide the fact that the section exists.
              </li>
              <li>Don&apos;t pin a tab height, and don&apos;t let a label wrap to two lines.</li>
            </ul>
          </Callout>
        </div>
      </section>

              </div>
            )
          },
          {
            id: "develop",
            label: "Develop",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="labels" style={h2Style}>
          6. Writing tab labels
        </h2>
        <p style={proseStyle}>
          These govern the <em>content</em>, and they are the rules most often broken. No amount of CSS fixes a badly
          written label.
        </p>
        <ol style={{ ...proseStyle, paddingLeft: "1.3em", display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
          <li>
            <strong>A tab label names a destination.</strong> It is not a sentence. One or two words; aim for 20
            characters or fewer in English.
          </li>
          <li>
            <strong>Budget for the longest translation, not the English.</strong> Devanagari renders the same phrase
            10–30% longer. A label that fits in English and truncates in Hindi is a defect found in production, not in
            review.
          </li>
          <li>
            <strong>In an enclosed track every tab is the same width</strong>, so the <em>longest</em> label sets what
            all of them can show. One long label degrades the whole set, not just its own tab.
          </li>
          <li>
            <strong>When a label does not fit, escalate in this order</strong> — truncation is last, not first: shorten
            the label → move to <code>track=&quot;none&quot;</code>, where tabs are content-width and the row scrolls →
            add the overflow menu when the scrolled tabs would be undiscoverable → only then accept the ellipsis.
          </li>
          <li>
            <strong>Truncation is CSS-only, never JavaScript.</strong> Shortening the string in code rewrites the
            accessible name too, turning a visual compromise into a real loss. A truncated tab keeps its full name in
            the accessibility tree and gains a <code>title</code> so a sighted user can recover it.
          </li>
          <li>
            <strong>Two tabs must never truncate to the same visible string.</strong> See below.
          </li>
          <li>
            <strong>Never wrap to two lines.</strong> It breaks the height hug and the indicator alignment, and makes
            the row&apos;s height depend on the longest label.
          </li>
        </ol>

        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <DoDont
            cards={[
              {
                type: "dont",
                label: "A shared prefix truncates to the same string — the row stops being navigation",
                preview: (
                  <TabsSpecimen
                    label="Application, by shared prefix"
                    width={380}
                    tabs={[
                      { id: "details", label: "Application details" },
                      { id: "status", label: "Application status" },
                      { id: "history", label: "Application history" },
                    ]}
                  />
                ),
              },
              {
                type: "do",
                label: "The distinguishing word comes first, and nothing truncates",
                preview: (
                  <TabsSpecimen
                    label="Application, front-loaded"
                    width={380}
                    tabs={[
                      { id: "details", label: "Details" },
                      { id: "status", label: "Status" },
                      { id: "history", label: "History" },
                    ]}
                  />
                ),
              },
            ]}
          />
        </div>

        <h3 style={h3Style}>When a label is clipped anyway — one problem, four answers</h3>
        <p style={proseStyle}>
          No single affordance reaches every user, so the component does not try to find one.
        </p>
        <PropsTable
          props={[
            { name: "Mouse / pen", type: "Tooltip on hover", description: "The label clips with an ellipsis and a Tooltip shows the full text." },
            { name: "Keyboard", type: "Tooltip on focus", description: "The same tooltip opens instantly on focus, with the pointer nowhere near, and Escape dismisses it without moving focus (WCAG 1.4.13). The old title attribute never opened on focus at all — that was the biggest hole, and why it is gone." },
            { name: "Screen reader", type: "nothing to rescue", description: "The clipping is CSS, so the full string is already the button's accessible name. The bubble is aria-hidden and carries no aria-describedby — without that the name is announced TWICE, which is a regression, not a rescue." },
            { name: "Touch", type: "not clipped at all", description: "Under @media (hover: none) enclosed tabs stop sharing the width equally, size to their content, and the row scrolls. A tooltip is unreachable without hover, so the only honest fix is to remove the truncation rather than annotate it." },
          ]}
        />
        <Callout type="info" title="Why the predicate is hover, not pointer">
          The media query is <code>hover: none</code> and deliberately not{" "}
          <code>pointer: coarse</code>: what decides this is whether the <em>rescue</em> works,
          not how precise the finger is. A stylus reports <code>hover: none</code> with{" "}
          <code>pointer: fine</code> and needs identical treatment. Measurement runs on a{" "}
          <code>ResizeObserver</code> rather than a <code>resize</code> listener, because a
          container can change size without the window moving — a collapsing sidebar, a panel
          opening, a webfont swapping in.
        </Callout>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
        <Callout type="info" title="Overflow — the Tabs / More menu">
          A horizontal list that outgrows its container <strong>scrolls</strong>. Set{" "}
          <code>overflow</code> to add the <code>Tabs / More</code> trigger, which appears{" "}
          <em>only when the row actually overflows</em> and lists <strong>every</strong> tab,
          marking the current one with <code>role=&quot;menuitemradio&quot;</code> +{" "}
          <code>aria-checked</code>. An earlier build listed only the hidden ones, so the same
          menu gave different contents at different scroll positions.
          It is a <strong>menu button, not a tab</strong> — <code>role=&quot;button&quot;</code>,{" "}
          <code>aria-haspopup=&quot;menu&quot;</code>, <code>aria-expanded</code>; giving it{" "}
          <code>role=&quot;tab&quot;</code> would promise a panel that does not exist. It renders{" "}
          <em>outside</em> the tablist, which is what keeps it pinned while the tabs scroll, and
          why enabling it wraps the tablist in a positioning element (so the prop is off by
          default). It never removes tabs from the tablist: they stay focusable and
          arrow-reachable. Enabling it also stops tabs sharing the track equally — equal-width
          tabs never overflow, they truncate harder, so the trigger would never appear. The
          measured edge fade applies to <code>track=&quot;none&quot;</code> only: an open row has
          nothing to explain a cut, while an enclosed row is a bordered, rounded container that
          already does — and cannot be faded cleanly anyway, because its border, fill and radius
          are painted by the scrolling element, so a mask dissolves the container instead of the
          tabs.
        </Callout>
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="props" style={h2Style}>
          7. Props
        </h2>

        <h3 style={h3Style}>Tabs</h3>
        <PropsTable
          props={[
            { name: "tabs", type: "TabDef[]", required: true, description: "Ordered tab definitions." },
            { name: "active", type: "number", required: true, description: "0-based index of the active tab. Owned by the parent." },
            { name: "onChange", type: "(index: number) => void", required: true, description: "Called with the next active index on click or keyboard navigation. Run save-on-switch logic here." },
            { name: "idBase", type: "string", required: true, description: "Namespace for the generated tab/panel ids. Pass React.useId() — two tablists sharing one idBase emit duplicate ids and silently mislink aria-controls." },
            { name: "ariaLabel", type: "string", default: '"Sections"', description: "Accessible name for the tablist (announced by screen readers)." },
            { name: "indicator", type: '"underline" | "rail" | "pill"', default: '"pill"', description: "Selected-tab chrome. Pairs with track — see §3. Rail is vertical-only." },
            { name: "size", type: '"s" | "m" | "l"', default: '"m"', description: "Tab height and type scale (36 / 44 / 48). Applies to the whole list, never to one tab." },
            { name: "track", type: '"none" | "enclosed"', default: '"enclosed"', description: "Open list, or a filled and bordered track. Enclosed tabs share the width evenly; an open list is content-width and scrolls." },
            { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Lays the tabs out in a row or a column, and sets aria-orientation to match." },
            { name: "divider", type: "boolean", default: "true", description: "Draws the rule the underline or rail sits in. Ignored when track=\"enclosed\"." },
            { name: "overflow", type: "boolean", default: "false", description: "Offer the Tabs / More menu when the row cannot show every tab. Horizontal only. Off by default because enabling it wraps the tablist in a positioning element. It also stops tabs sharing the track equally — equal-width tabs never overflow, so the trigger could never appear. A tablist inside a flex or grid item needs min-width: 0 on that item, or it refuses to shrink and nothing ever overflows." },
          ]}
        />

        <h3 style={h3Style}>TabPanel</h3>
        <PropsTable
          props={[
            { name: "idBase", type: "string", required: true, description: "Must match the Tabs idBase so aria-controls / aria-labelledby resolve." },
            { name: "tabId", type: "string", required: true, description: "The id of the currently-active tab (e.g. tabs[active].id)." },
            { name: "children", type: "React.ReactNode", required: true, description: "The active section's content." },
          ]}
        />

        <h3 style={h3Style}>TabDef</h3>
        <PropsTable
          props={[
            { name: "id", type: "string", required: true, description: "Stable id fragment used to build the tab and panel ids. Do not derive it from the label — an id that tracks the copy breaks every aria-controls the moment the wording is edited." },
            { name: "label", type: "string", required: true, description: "Visible, accessible tab label. See §6 for how to write one." },
            { name: "icon", type: "string", description: "Material Symbols Rounded glyph NAME, placed before the label and sized from the list's size prop." },
            { name: "badge", type: "boolean", description: "The shared status dot after the label. It inherits the tab's own state colour, and carries no number — it is a signal, not a count." },
            { name: "disabled", type: "boolean", description: "Renders the tab as unavailable. It stays in the tablist with aria-disabled and is skipped by the arrow keys." },
          ]}
        />
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="tokens" style={h2Style}>
          8. Tokens
        </h2>
        <p style={proseStyle}>
          Every value the component draws resolves through one of these. The two <code>layout/tab</code> tokens and the
          two accessible brand rungs were added with the Figma masters; the dot is shared with <code>Badge</code>.
        </p>
        <TokenTable
          tokens={[
            { token: "--sa-layout-tab-indicator", value: "2px", description: "Thickness of the underline or rail. Deliberately NOT control/border/width — a selection mark that happens to be a line must not move when the form-control hairline is retuned." },
            { token: "--sa-layout-tab-track", value: "4px", description: "Inset between an enclosed track and its pills — the track's padding, and the indicator's cross-axis inset." },
            { token: "--sa-inline-2xs", value: "2px", description: "Gap between segments inside an enclosed track, so they read as one control rather than separate pills." },
            { token: "--sa-text-brand-primary-bolder", value: "#005eb9", description: "The selected tab's label. Never text/brand/primary/base — the brand key colour measures 4.07:1 on the track and fails WCAG 1.4.3 AA." },
            { token: "--sa-icon-brand-primary-bolder", value: "#005eb9", description: "The selected tab's leading glyph, so label and icon never disagree." },
            { token: "--sa-bg-brand-primary-bolder", value: "#005eb9", description: "The selected pill's fill, with on/bg/brand/primary/bolder for the ink on top of it." },
            { token: "--sa-border-brand-primary-base", value: "#0373df", description: "The underline and rail. A 2px mark against a neutral surface, not text — so it is judged against 1.4.11's 3:1, which it clears." },
            { token: "--sa-cmp-badge-dotSize", value: "6px", description: "The unread dot — one definition shared with Badge. 6 and not the on-grid 8 because beside 14px label text an 8px dot reads as a bullet rather than a signal." },
            { token: "--sa-cmp-badge-dotSizeLg", value: "8px", description: "The dot beside 16px body text (size=\"l\"). A dot is sized against the type it annotates, not its container." },
            { token: "--sa-focus-ring", value: "#0373df", description: "OPAQUE on purpose. At 48% alpha it composited to 1.16:1 on a selected pill, far below the 3:1 floor of WCAG 1.4.11 and 2.4.11." },
          ]}
        />
      </section>

              </div>
            )
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="accessibility" style={h2Style}>
          9. Accessibility
        </h2>
        <A11yChecklist
          items={[
            { criterion: "Name, Role, Value", level: "AA", description: "Renders role=tablist / tab / tabpanel with aria-selected and aria-controls ↔ aria-labelledby wiring, and aria-orientation matching the layout." },
            { criterion: "Keyboard", level: "AA", description: "Roving tabindex: only the active tab is in the tab order. Left/Right AND Up/Down move between tabs (automatic activation), wrapping; Home/End jump to the first/last ENABLED tab. Disabled tabs are stepped over, not removed." },
            { criterion: "Focus Order", level: "AA", description: "Focus follows selection, then Tab moves into the panel (tabindex=0)." },
            { criterion: "Status Messages", level: "AA", description: "A polite live region announces 'Section N of M: <label>' on change." },
            { criterion: "Focus Visible", level: "AA", description: "A two-layer ring: 2px of the surface colour, then 2px of an OPAQUE focus/ring. The previous 48%-alpha ring measured 1.16:1 on a selected pill." },
            { criterion: "Non-text Contrast", level: "AA", description: "1.4.11 — the indicator, the track border and the focus ring are all judged against 3:1 on the surface they abut, and all clear it." },
            { criterion: "Target Size (Minimum)", level: "AA", description: "2.5.8 — all three sizes clear 24×24. m and l also reach 44×44, which is 2.5.5 Level AAA, not the AA floor." },
            { criterion: "Reflow / text resize", level: "AA", description: "Heights are hugs of padding plus line-height, so a tab grows with the browser font size instead of clipping its label." },
          ]}
        />
        <Callout type="warning" title="Automatic activation has a cost">
          An arrow key both moves <em>and</em> selects. That is right when switching is cheap — rendering a panel you
          already have. It is wrong when each tab triggers a fetch, because arrowing across five tabs fires five
          requests. If your panels are expensive, this is not the component to reach for.
        </Callout>
      </section>

              </div>
            )
          }
        ]}
      />

    </article>
  );
}
