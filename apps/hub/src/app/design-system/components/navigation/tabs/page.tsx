import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  DoDont,
  MatrixTable,
  PropsTable,
  TokenTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { TabsContentSpecimen, TabsDemo, TabsSizeSpecimen, TabsSpecimen } from "./tabs-demo";

export const metadata: Metadata = {
  title: "Tabs — Design System",
  description:
    "Accessible tabbed navigation for non-linear sections, implementing the WAI-ARIA Tabs pattern with a roving tabindex and Arrow, Home and End keyboard support.",
};

/* Read off `TabsProps` in packages/design-system/components/navigation/tabs.tsx. */

const PANEL_PROPS: PropDef[] = [
  {
    name: "idBase",
    type: "string",
    required: true,
    description: "Must match the Tabs `idBase` so `aria-controls` and `aria-labelledby` resolve.",
  },
  {
    name: "tabId",
    type: "string",
    required: true,
    description: "The id of the currently active tab — `tabs[active].id`.",
  },
  { name: "children", type: "React.ReactNode", required: true, description: "The active section's content." },
];

const TAB_DEF_PROPS: PropDef[] = [
  {
    name: "id",
    type: "string",
    required: true,
    description:
      "Stable id fragment used to build the tab and panel ids. Do not derive it from the label — an id that tracks the copy breaks every `aria-controls` the moment the wording is edited.",
  },
  { name: "label", type: "string", required: true, description: "Visible, accessible tab label." },
  {
    name: "icon",
    type: "string",
    default: "undefined",
    description:
      "Material Symbols Rounded glyph NAME, placed before the label and sized from the list's `size`. A name rather than an element so the component can drive the optical-size axis.",
  },
  {
    name: "badge",
    type: "boolean",
    default: "false",
    description:
      "The shared status dot after the label. It inherits the tab's own state colour and carries no number — it is a signal, not a count.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
      "Renders the tab as unavailable. It stays in the tablist with `aria-disabled` and is stepped over by the arrow keys.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "Renders `role=tablist` / `tab` / `tabpanel` with `aria-selected`, `aria-controls` paired to `aria-labelledby`, and `aria-orientation` matching the layout.",
    status: "verified",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Roving tabindex: only the active tab is in the tab order. Left/Right AND Up/Down move between tabs with automatic activation, wrapping; Home and End jump to the first and last ENABLED tab. Disabled tabs are stepped over, not removed.",
    status: "verified",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description: "Focus follows selection, then Tab moves into the panel, which carries `tabindex=0`.",
    status: "verified",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description: "A polite live region announces “Section N of M: <label>” on change.",
    status: "verified",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description:
      "A two-layer ring: 2px of the surface colour, then 2px of an OPAQUE focus ring. The previous 48%-alpha ring composited to 1.16:1 on a selected pill.",
    status: "verified",
    evidence: "Measured: 1.16:1 before, against the 3:1 floor.",
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "The indicator, the track border and the focus ring are each judged against 3:1 on the surface they abut, and all clear it.",
    status: "verified",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "All three sizes clear 24×24. `m` and `l` also reach 44×44 — but that is 2.5.5 at Level AAA and UX4G's mobile recommendation, not the AA floor, so `s` is not a failure.",
    status: "verified",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "Heights are hugs of padding plus line-height, so a tab grows with the browser font size instead of clipping its label. Never pin a tab height.",
    status: "verified",
  },
  {
    criterion: "1.4.13 Content on Hover or Focus",
    level: "AA",
    description:
      "A clipped label's tooltip opens on hover AND instantly on keyboard focus, and Escape dismisses it without moving focus. The `title` attribute it replaced never opened on focus at all.",
    status: "verified",
  },
];

export default function TabsPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Tabs"
      status="Beta"
      summary="Accessible tabbed navigation for non-linear sections a reader revisits in any order — a clinical record, a settings panel, a multi-facet detail view. It implements the WAI-ARIA Tabs pattern with automatic activation, a roving tabindex, and a polite live-region announcement."
      figma={{ node: "tabs" }}
      specimen={<TabsDemo />}
      propsFrom="TabsProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Non-linear sections a reader revisits in any order — records, settings, detail facets.",
          "A set of sections whose panels are already loaded, so switching costs nothing.",
          "A section set small enough to name: three to seven tabs, with labels short enough not to truncate in Hindi.",
        ],
        avoid: [
          "An ordered, must-complete-in-sequence flow — use Wizard, which is a linear stepper.",
          "Panels that each trigger a fetch: automatic activation means arrowing across five tabs fires five requests.",
          "Navigation between pages — a tab implies the content is already here. Use the sidebar or the masthead.",
        ],
      }}
      related={[
        {
          label: "Wizard",
          href: "/design-system/components/forms/wizard",
          reason: "when the flow is a linear, ordered sequence",
        },
        {
          label: "Tabs Overflow",
          href: "/design-system/components/navigation/tabs-overflow",
          reason: "the More menu this component renders when the row cannot fit",
        },
        {
          label: "Accordion",
          href: "/design-system/components/data-display/accordion",
          reason: "when several sections may be open at once",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-chrome">
            <h2 id="cdp-chrome" className="cdp__h2">
              Indicator and Track — Only Two of Six Combinations Are Correct
            </h2>
            <p>
              <code>indicator</code> and <code>track</code> look like two independent choices and
              are not. <code>track=&quot;enclosed&quot;</code> is a filled, bordered track and takes{" "}
              <code>indicator=&quot;pill&quot;</code>. <code>track=&quot;none&quot;</code> is an
              open list and takes <code>&quot;underline&quot;</code> when horizontal,{" "}
              <code>&quot;rail&quot;</code> when vertical. A pill on an open list has nothing to sit
              in; an underline inside a filled track draws a second edge a few pixels inside the
              first. The remaining four render — nothing stops you — and read as broken.
            </p>
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
            <h3 className="cdp__h2" id="cdp-vertical">
              Vertical Lists
            </h3>
            <p>
              <code>orientation=&quot;vertical&quot;</code> stacks the tabs and sets{" "}
              <code>aria-orientation=&quot;vertical&quot;</code>, so assistive technology announces
              the axis. The <code>rail</code> indicator is the vertical counterpart of{" "}
              <code>underline</code> — the same 2px mark, moved to the leading edge.
            </p>
            <div className="cdp-row">
              <TabsSpecimen orientation="vertical" track="none" indicator="rail" label="Vertical rail" width={220} />
              <TabsSpecimen orientation="vertical" track="enclosed" indicator="pill" label="Vertical pill" width={220} />
            </div>
            <Callout type="info" title="The divider is coplanar with the indicator">
              <code>divider</code> draws the rule the underline or rail sits <em>in</em> — the
              selected segment replaces that stretch of the rule rather than stacking a second line
              against it. It is ignored when <code>track=&quot;enclosed&quot;</code>, which has its
              own border.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-size">
            <h2 id="cdp-size" className="cdp__h2">
              Size
            </h2>
            <p>
              <code>s</code>, <code>m</code> and <code>l</code> resolve to{" "}
              <strong>36 / 44 / 48px</strong> at the 16px browser default. Those numbers are what
              the hug <em>resolves to</em>, not what is set: a tab&apos;s height is padding plus
              line-height, so it grows when a citizen raises their browser font size. Never pin a
              tab height.
            </p>
            <p>
              <code>size</code> applies to the whole list, never to one tab — a list whose tabs
              disagree about size is a defect. It also drives the leading icon (16 / 20 / 24) and
              the unread dot, which steps from 6 to 8 at <code>l</code>, because a dot is sized
              against the type it annotates.
            </p>
            <TabsSizeSpecimen />
            <Callout type="info" title="Target size">
              All three clear WCAG 2.2 SC 2.5.8 Target Size (Minimum), which is{" "}
              <strong>24×24</strong> at Level AA. Only <code>m</code> and <code>l</code> reach
              44×44 — but that is SC 2.5.5 at Level <strong>AAA</strong>, and UX4G&apos;s mobile
              recommendation. <code>s</code> is not an AA failure.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-content">
            <h2 id="cdp-content" className="cdp__h2">
              Icons, Badges and Disabled Tabs
            </h2>
            <p>
              <code>TabDef</code> carries an optional Material Symbols <code>icon</code> name, a{" "}
              <code>badge</code> dot, and <code>disabled</code>. Pass the icon as a{" "}
              <em>name</em>, not an element — the component renders the glyph itself so it can
              drive the optical-size axis from <code>size</code>. A CSS class would set the box but
              not the axis, drawing the glyph for one size and displaying it at another.
            </p>
            <TabsContentSpecimen />
            <Callout type="warning" title="A disabled tab stays in the tablist">
              It keeps <code>role=&quot;tab&quot;</code> and is marked <code>aria-disabled</code>;
              the arrow keys step over it, and Home and End land on the first and last{" "}
              <em>enabled</em> tab. It deliberately does <strong>not</strong> use the native{" "}
              <code>disabled</code> attribute — that drops the button out of the accessibility tree,
              so a screen-reader user loses the fact that the section exists at all. Removing the
              tab entirely has the same effect.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-labels">
            <h2 id="cdp-labels" className="cdp__h2">
              Writing Tab Labels
            </h2>
            <p>
              These govern the <em>content</em>, and they are the rules most often broken. No amount
              of CSS fixes a badly written label.
            </p>
            <ol>
              <li>
                <strong>A tab label names a destination.</strong> It is not a sentence. One or two
                words; aim for 20 characters or fewer in English.
              </li>
              <li>
                <strong>Budget for the longest translation, not the English.</strong> Devanagari
                renders the same phrase 10 to 30% longer. A label that fits in English and truncates
                in Hindi is a defect found in production, not in review.
              </li>
              <li>
                <strong>In an enclosed track every tab is the same width</strong>, so the{" "}
                <em>longest</em> label sets what all of them can show. One long label degrades the
                whole set, not just its own tab.
              </li>
              <li>
                <strong>When a label does not fit, escalate in this order</strong> — truncation is
                last, not first: shorten the label, then move to{" "}
                <code>track=&quot;none&quot;</code> where tabs are content-width and the row
                scrolls, then add the overflow menu when the scrolled tabs would be undiscoverable,
                and only then accept the ellipsis.
              </li>
              <li>
                <strong>Truncation is CSS-only, never JavaScript.</strong> Shortening the string in
                code rewrites the accessible name too, turning a visual compromise into a real loss.
              </li>
              <li>
                <strong>Two tabs must never truncate to the same visible string.</strong>
              </li>
              <li>
                <strong>Never wrap to two lines.</strong> It breaks the height hug and the indicator
                alignment, and makes the row&apos;s height depend on the longest label.
              </li>
            </ol>
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
          </section>

          <section className="cdp__section" aria-labelledby="cdp-guidelines">
            <h2 id="cdp-guidelines" className="cdp__h2">
              Guidelines
            </h2>
            <Callout type="info" title="Do">
              <ul>
                <li>Use Tabs for non-linear sections a reader revisits in any order.</li>
                <li>
                  Run save and validation inside <code>onChange</code> so switching tabs never loses
                  data.
                </li>
                <li>
                  Give the tablist a meaningful <code>ariaLabel</code> describing what the sections
                  are.
                </li>
                <li>
                  Pair <code>indicator</code> and <code>track</code> as above, and keep{" "}
                  <code>size</code> on the list.
                </li>
                <li>Check the Hindi rendering, not only the English.</li>
              </ul>
            </Callout>
            <Callout type="warning" title="Don't">
              <ul>
                <li>
                  Don&apos;t use Tabs for an ordered, must-complete-in-sequence flow — use{" "}
                  <code>Wizard</code>.
                </li>
                <li>
                  Never hand-roll tab buttons — that drops the role and keyboard contract this
                  component guarantees.
                </li>
                <li>
                  Don&apos;t render every panel and hide the inactive ones with CSS — they stay in
                  the accessibility tree and the tab order, so a keyboard user walks through
                  controls they cannot see.
                </li>
                <li>
                  Don&apos;t remove a tab to disable it, and don&apos;t reach for the native{" "}
                  <code>disabled</code> attribute — both hide the fact that the section exists.
                </li>
                <li>Don&apos;t pin a tab height, and don&apos;t let a label wrap to two lines.</li>
              </ul>
            </Callout>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <p>
              The parent owns the active index and renders one <code>TabPanel</code> at a time. Pass
              a stable <code>idBase</code> — use <code>React.useId()</code> — so the tab and panel
              ids stay wired.
            </p>
            <CodeBlock>{`"use client";
import * as React from "react";
import { Tabs, TabPanel, type TabDef } from "@mosje/design-system";

const SECTIONS: TabDef[] = [
  { id: "history", label: "Previous History" },
  { id: "dosage", label: "Medication Dosage" },
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
              <code>onChange</code> fires before the index updates, so it is the right place to
              persist the current tab&apos;s data before moving — the clinical-record wizard saves
              each section on switch.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-panel-props">
            <h2 id="cdp-panel-props" className="cdp__h2">
              TabPanel
            </h2>
            <PropsTable props={PANEL_PROPS} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tabdef">
            <h2 id="cdp-tabdef" className="cdp__h2">
              TabDef
            </h2>
            <PropsTable props={TAB_DEF_PROPS} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-clipping">
            <h2 id="cdp-clipping" className="cdp__h2">
              When a Label Is Clipped Anyway — One Problem, Four Answers
            </h2>
            <p>No single affordance reaches every reader, so the component does not try to find one.</p>
            <MatrixTable
              caption="How a truncated label is recovered, by input"
              columns={["Input", "The rescue", "Why"]}
              rows={[
                [
                  "Mouse or pen",
                  "Tooltip on hover",
                  "The label clips with an ellipsis and a Tooltip shows the full text",
                ],
                [
                  "Keyboard",
                  "Tooltip on focus",
                  "It opens instantly on focus with the pointer nowhere near, and Escape dismisses it without moving focus. The title attribute it replaced never opened on focus at all",
                ],
                [
                  "Screen reader",
                  "Nothing to rescue",
                  "The clipping is CSS, so the full string is already the button's accessible name. The bubble is aria-hidden and carries no aria-describedby — without that the name is announced twice",
                ],
                [
                  "Touch",
                  "Not clipped at all",
                  "Under hover: none, enclosed tabs stop sharing the width equally, size to their content, and the row scrolls. A tooltip is unreachable without hover",
                ],
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
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tokens">
            <h2 id="cdp-tokens" className="cdp__h2">
              Tokens
            </h2>
            <p>
              Every value the component draws resolves through one of these. The two{" "}
              <code>layout/tab</code> tokens and the two accessible brand rungs were added with the
              Figma masters; the dot is shared with <code>Badge</code>.
            </p>
            <TokenTable
              tokens={[
                {
                  token: "--sa-layout-tab-indicator",
                  value: "2px",
                  description:
                    "Thickness of the underline or rail. Deliberately NOT control/border/width — a selection mark that happens to be a line must not move when the form-control hairline is retuned.",
                },
                {
                  token: "--sa-layout-tab-track",
                  value: "4px",
                  description:
                    "Inset between an enclosed track and its pills — the track's padding, and the indicator's cross-axis inset.",
                },
                {
                  token: "--sa-inline-2xs",
                  value: "2px",
                  description:
                    "Gap between segments inside an enclosed track, so they read as one control rather than separate pills.",
                },
                {
                  token: "--sa-text-brand-primary-bolder",
                  value: "#005eb9",
                  description:
                    "The selected tab's label. Never text/brand/primary/base — the brand key colour measures 4.07:1 on the track and fails WCAG 1.4.3 AA.",
                  isColor: true,
                },
                {
                  token: "--sa-icon-brand-primary-bolder",
                  value: "#005eb9",
                  description: "The selected tab's leading glyph, so label and icon never disagree.",
                  isColor: true,
                },
                {
                  token: "--sa-bg-brand-primary-bolder",
                  value: "#005eb9",
                  description: "The selected pill's fill, with on/bg/brand/primary/bolder for the ink on top of it.",
                  isColor: true,
                },
                {
                  token: "--sa-border-brand-primary-base",
                  value: "#0373df",
                  description:
                    "The underline and rail. A 2px mark against a neutral surface, not text — so it is judged against 1.4.11's 3:1, which it clears.",
                  isColor: true,
                },
                {
                  token: "--sa-cmp-badge-dotSize",
                  value: "6px",
                  description:
                    "The unread dot — one definition shared with Badge. 6 and not the on-grid 8 because beside 14px label text an 8px dot reads as a bullet rather than a signal.",
                },
                {
                  token: "--sa-cmp-badge-dotSizeLg",
                  value: "8px",
                  description:
                    'The dot beside 16px body text (size="l"). A dot is sized against the type it annotates, not its container.',
                },
                {
                  token: "--sa-focus-ring",
                  value: "#0373df",
                  description:
                    "OPAQUE on purpose. At 48% alpha it composited to 1.16:1 on a selected pill, far below the 3:1 floor of WCAG 1.4.11 and 2.4.11.",
                  isColor: true,
                },
              ]}
            />
          </section>
        </>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-keys">
            <h2 id="cdp-keys" className="cdp__h2">
              Keyboard Traversal
            </h2>
            <MatrixTable
              caption="Keys the tablist handles, in both orientations"
              columns={["Key", "Action"]}
              rows={[
                ["ArrowRight / ArrowDown", "Move to the next enabled tab, wrapping past the end"],
                ["ArrowLeft / ArrowUp", "Move to the previous enabled tab, wrapping past the start"],
                ["Home", "Jump to the first enabled tab"],
                ["End", "Jump to the last enabled tab"],
                ["Tab", "Leave the tablist and enter the panel, which carries tabindex 0"],
              ]}
            />
            <p>
              Both key pairs stay live in both orientations. WAI-ARIA only requires the pair that
              matches <code>aria-orientation</code>, and honouring the other as well costs a reader
              nothing while rescuing anyone who reached for the axis they could see.
            </p>
            <p>
              Only the active tab is in the tab order — a roving <code>tabindex</code> — so a
              keyboard user reaches the tablist in one press and moves inside it with the arrows,
              rather than tabbing through every section name to get past it.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-pairing">
            <h2 id="cdp-pairing" className="cdp__h2">
              The aria-controls Pairing
            </h2>
            <p>
              Each tab carries <code>aria-controls=&quot;&#123;idBase&#125;-panel-&#123;id&#125;&quot;</code>{" "}
              and each panel carries the matching{" "}
              <code>id</code> plus{" "}
              <code>aria-labelledby=&quot;&#123;idBase&#125;-tab-&#123;id&#125;&quot;</code>. The
              pairing is what lets a screen-reader user move from a tab to the region it controls
              and hear that region named by the tab they came from.
            </p>
            <Callout type="warning" title="Two tablists must not share an idBase">
              Both would emit the same ids. The duplicate wins in the DOM, so one tablist&apos;s{" "}
              <code>aria-controls</code> silently resolves to the other&apos;s panel — a mislink
              that looks correct in the markup and is only visible with a screen reader. Pass{" "}
              <code>React.useId()</code>.
            </Callout>
            <p>
              <code>TabPanel</code> must be rendered for the active tab only. Rendering all of them
              and hiding the inactive ones with CSS leaves their controls in the accessibility tree
              and the tab order.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-activation">
            <h2 id="cdp-activation" className="cdp__h2">
              Automatic Activation, and Its Cost
            </h2>
            <p>
              An arrow key both moves <em>and</em> selects, and a polite live region announces
              &ldquo;Section N of M&rdquo; so the change is not silent. That is right when switching
              is cheap — rendering a panel you already have.
            </p>
            <Callout type="warning" title="It is wrong when each tab triggers a fetch">
              Arrowing across five tabs fires five requests. If your panels are expensive, this is
              not the component to reach for.
            </Callout>
          </section>
        </>
      }
    />
  );
}
