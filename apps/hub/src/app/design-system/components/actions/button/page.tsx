import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  DoDont,
  MatrixTable,
  TokenTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Button } from "@mosje/design-system";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

import { ButtonPlayground } from "./button-playground";

export const metadata: Metadata = {
  title: "Button",
  description:
    "A Button triggers an action within the system — submitting a form, confirming a dialog, or running a command. The most-used interactive atom in the SAMAVESH design system.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The label names the action rather than the gesture. “Click here” and a bare “Submit” both fail readers who navigate a page by its control names.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence: "e2e/design-system/button.spec.ts",
    description:
      "All three sizes (32 / 40 / 48px) clear the 24×24 Level AA minimum. 44×44 is 2.5.5 Target Size (Enhanced), Level AAA, which only `lg` reaches; UX4G recommends it for touch.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    status: "verified",
    evidence: "e2e/design-system/button.spec.ts, pinned at the criterion's own 200% threshold",
    description:
      "Each size sets a min-height plus vertical padding, so the box grows with the text rather than clipping it. A fixed height clipped the label until 2026-08-27 — an `md` button held 40px while its content needed 41.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description: "A 3px focus ring, drawn with `--sa-focus-ring` and never removed by the stylesheet.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description: "It renders a real `<button>`, so Enter and Space activate it and Tab reaches it. Nothing is re-implemented.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence: "e2e/design-system/button.spec.ts",
    description:
      "A disabled `<button>` uses the native attribute. With `href` the component drops the href, sets `aria-disabled=\"true\"` and `role=\"link\"`, so the link path is genuinely inert. Until 2026-08-27 it emitted `<a disabled>`, which the browser ignores entirely — measured as focusable, clickable and fully opaque while looking disabled.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "`loading` sets `aria-busy` on the control and draws a spinner. A busy button keeps full opacity with `cursor: progress` rather than the disabled wash, because “working” and “forbidden” must not look the same.",
  },
  {
    criterion: "GIGW 3.0 — Keyboard operation",
    level: "GIGW",
    description: "Every interactive element is fully keyboard operable [GIGW 3.5].",
  },
];

/*
 * ds-exempt(demo-geometry): the anatomy overlay is a POSITIONED ANNOTATION over a
 * running specimen. Its offsets are measured against that one button and mean nothing
 * anywhere else, so there is no token they could bind to. Every colour and type value
 * below is bound; only the placement is literal.
 */
function Marker({
  n,
  top,
  bottom,
  left,
  right,
}: {
  n: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        transform: left ? "translateX(-50%)" : undefined,
        width: "var(--sa-icon-size-20)",
        height: "var(--sa-icon-size-20)",
        borderRadius: "var(--sa-shape-full)",
        background: "var(--sa-bg-brand-primary-bolder)",
        color: "var(--sa-on-bg-brand-primary-bolder)",
        fontSize: "var(--sa-type-label-3-size)",
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {n}
    </span>
  );
}

export default function ButtonPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Button"
      status="Stable"
      summary="A Button triggers an action within the system — submitting a form, confirming a dialog, running a command. It is the most-used interactive atom in SAMAVESH, and the reference implementation every other component page is measured against."
      figma={{ node: "buttonDoc" }}
      since="0.5.0"
      specimen={<ButtonPlayground />}
      propsFrom="ButtonProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form is submitted or a draft is saved.",
          "An action runs on the current page — an export, a print, a recalculation.",
          "A choice is confirmed or cancelled in a dialog.",
          "A menu, a modal or a side sheet is opened.",
        ],
        avoid: [
          "The control takes the reader to another page or resource — that is a link, and a screen-reader user who activates a “button” and finds the page has navigated was given the wrong control.",
          "The thing shows a status or a count rather than doing something — use Badge.",
          "A single setting is turned on or off — use Toggle, or Checkbox inside a form.",
          "Several related actions sit together — wrap them in Button Group, which keeps the 8px between adjacent targets that WCAG 2.2 §2.5.8 and UX4G both ask for.",
        ],
      }}
      related={[
        { label: "Form Field", href: "/design-system/components/forms/form-field", reason: "buttons submit the forms that form fields build" },
        { label: "Badge", href: "/design-system/components/feedback/badge", reason: "for a status or a count — never a button to display state" },
        { label: "Card", href: "/design-system/components/data-display/card", reason: "cards often end with one primary button as their action" },
        { label: "Icon", href: "/design-system/components/utilities/icon", reason: "the glyph iconLeft and iconRight take, already marked decorative" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-purpose">
            <h2 id="cdp-purpose" className="cdp__h2">
              Purpose
            </h2>
            <p>
              A button triggers an action within the system. Reach for it whenever a reader needs
              to <em>do</em> something &mdash; submit an application, save a draft, confirm a
              choice, run a command. A button always acts on the current page or the current flow.
            </p>
            <p>
              If the control takes the reader to a different page or resource, it is a{" "}
              <strong>link</strong>, not a button. Getting this distinction right is the single
              most consequential accessibility decision for an interactive element.
            </p>
            <Callout type="warning" title="Buttons are not links">
              A button performs an action; a link changes location. If a screen-reader user
              activates your &ldquo;button&rdquo; and the page navigates away, the control was
              wrong. Where a link must look like a call to action, use <code>buttonClasses()</code>{" "}
              on an <code>&lt;a&gt;</code> or a <code>next/link</code>, or pass <code>href</code> to
              this component &mdash; which renders a real anchor rather than a button that
              navigates.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <p>
              A button is intentionally simple: a labelled, focusable container with a clearly
              visible focus state.
            </p>
            {/* ds-exempt(demo-geometry): a positioned annotation over a running specimen —
                see the note on Marker above. */}
            <div style={{ position: "relative", display: "inline-block", padding: "var(--sa-padding-32)" }}>
              <Button variant="primary" appearance="filled" size="md">
                Submit application
              </Button>
              <Marker n={1} top="4px" left="50%" />
              <Marker n={2} bottom="4px" left="50%" />
              <Marker n={3} top="4px" right="4px" />
            </div>
            <ol>
              <li>
                <strong>Label text</strong> &mdash; clear and verb-first (&ldquo;Submit
                application&rdquo;).
              </li>
              <li>
                <strong>Container</strong> &mdash; a real <code>&lt;button&gt;</code>, with a
                min-height of 32 / 40 / 48px by size.
              </li>
              <li>
                <strong>Focus ring</strong> &mdash; 3px, drawn with <code>--sa-focus-ring</code>{" "}
                and never removed.
              </li>
            </ol>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-variants">
            <h2 id="cdp-variants" className="cdp__h2">
              Variants
            </h2>
            <p>
              Variants encode intent and visual weight. Use weight to guide the eye to the single
              most important action on a view.
            </p>
            <ul>
              <li>
                <strong>Primary</strong> &mdash; the main call to action. One per view, at most.
              </li>
              <li>
                <strong>Secondary</strong> &mdash; the actions beside the primary one.
              </li>
              <li>
                <strong>Ghost</strong> &mdash; tertiary, low-emphasis actions such as a table-row
                control.
              </li>
              <li>
                <strong>Danger</strong> &mdash; destructive actions; always paired with a
                confirmation step.
              </li>
            </ul>
            <Callout type="info" title="How those four intents map onto the component's API">
              The component exposes a <code>variant</code> axis (primary · success · danger ·
              neutral) and an <code>appearance</code> axis (filled · outlined · text), plus a{" "}
              <code>tone</code> axis (default · inverse). So <strong>secondary</strong> is{" "}
              <code>appearance=&quot;outlined&quot;</code> and <strong>ghost</strong> is{" "}
              <code>appearance=&quot;text&quot;</code>. The playground above emits the exact code
              for a button on a white or light surface. For a button placed on a solid
              brand-colour surface &mdash; a navy header, a hero band &mdash; use{" "}
              <code>tone=&quot;inverse&quot;</code> rather than overriding{" "}
              <code>className</code>. It crosses <code>appearance</code>, so{" "}
              <code>tone=&quot;inverse&quot; appearance=&quot;outlined&quot;</code> is the
              secondary form and keeps the variant&rsquo;s own intent.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              States
            </h2>
            <p>
              Every interactive state is visually distinct and meets AA contrast. Hover, focus and
              active are pointer and keyboard states, so they are shown here as the live control
              rather than as a still: hover the button below, then Tab to it, then hold the mouse
              down on it.
            </p>
            <p>
              <Button variant="primary" appearance="filled">
                Submit application
              </Button>{" "}
              <Button variant="primary" appearance="filled" disabled data-testid="btn-disabled">
                Disabled
              </Button>{" "}
              <Button
                variant="primary"
                appearance="filled"
                href="/design-system/components/actions/button"
                disabled
                data-testid="btn-disabled-link"
              >
                Disabled link
              </Button>{" "}
              <Button variant="primary" appearance="filled" loading data-testid="btn-loading">
                Submitting…
              </Button>
            </p>
            <MatrixTable
              caption="What each state means, and what it must not be confused with"
              columns={["State", "What it looks like", "Why it is that way"]}
              rows={[
                ["Default", "Full colour, no overlay.", "The resting state."],
                ["Hover", "A subtle darkening; the cursor becomes a pointer.", "Declared before :active at equal specificity, or the pressed state is unreachable."],
                ["Focus", "A 3px --sa-focus-ring, offset from the control.", "Never removed. It is the only signal a keyboard user has."],
                ["Active", "A momentary deeper tone.", "Pressed. It is a pointer state and does not persist."],
                [
                  "Disabled",
                  "Reduced opacity; not in the tab order.",
                  "The native disabled attribute does the work. No aria-disabled is set on a <button>, and none is needed.",
                ],
                [
                  "Disabled link",
                  "The same treatment, and genuinely inert.",
                  "An <a> cannot take the native attribute, so the component drops href and sets aria-disabled. Without href an anchor is not focusable and not activatable, so no click-swallowing is needed and none is done.",
                ],
                [
                  "Loading",
                  "Full opacity, a spinner in the leading icon's place, cursor: progress.",
                  "Busy is not forbidden, and must not look like it. It implies disabled so a form cannot be submitted twice, but the label stays — a control that loses its name mid-action is unusable with a screen reader.",
                ],
              ]}
            />
            <Callout type="info" title="Inverse tone keeps each variant's intent">
              <code>tone=&quot;inverse&quot;</code> crosses <code>appearance</code>, so all four
              variants keep their own signal on a brand surface. Until 2026-08-27 the outlined form
              painted the same white-alpha border for every variant &mdash; and at 2.25:1 it was
              not a findable edge either. It paints in the portal login shell&rsquo;s
              &ldquo;Signing Into&rdquo; strip and in Storybook; the Ticker&rsquo;s route-out strips
              its border in <code>ticker.css</code> and renders as a text link.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-responsive">
            <h2 id="cdp-responsive" className="cdp__h2">
              Sizes and Touch
            </h2>
            <p>
              <Button variant="primary" appearance="filled" size="sm">
                Small &mdash; 32px
              </Button>{" "}
              <Button variant="primary" appearance="filled" size="md">
                Medium &mdash; 40px
              </Button>{" "}
              <Button variant="primary" appearance="filled" size="lg">
                Large &mdash; 48px
              </Button>
            </p>
            <ul>
              <li>
                Heights are <strong>minimums</strong> of <strong>32 / 40 / 48px</strong>, not fixed
                heights &mdash; the box grows with the text rather than clipping it. All three clear
                the <strong>24×24</strong> WCAG 2.2 §2.5.8 Level AA minimum; only <code>lg</code>{" "}
                reaches the <strong>44×44</strong> UX4G recommends for touch. On a touch surface,
                prefer <code>lg</code> or add spacing &mdash; UX4G also asks for 8px between
                adjacent targets, which is what Button Group provides.
              </li>
              <li>
                Size <code>sm</code> is <strong>32px</strong> and does <em>not</em> reach 44px. That
                is a deliberate density choice for dense admin tables, not an oversight &mdash; but
                it does make <code>sm</code> a pointer-surface size.
              </li>
              <li>
                For a full-width mobile button, place it in a full-width container rather than
                giving the button a width of its own.
              </li>
            </ul>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-voice">
            <h2 id="cdp-voice" className="cdp__h2">
              Content and Voice
            </h2>
            <p>
              Labels are imperative verbs naming the action. This holds in every supported
              language: in English, &ldquo;Submit&rdquo;, &ldquo;Save&rdquo;,
              &ldquo;Cancel&rdquo; &mdash; never &ldquo;Click here&rdquo;, &ldquo;OK&rdquo; or a
              lone &ldquo;Yes&rdquo;. In Hindi the same rule applies:{" "}
              <span lang="hi">&ldquo;जमा करें&rdquo;</span>,{" "}
              <span lang="hi">&ldquo;सहेजें&rdquo;</span>,{" "}
              <span lang="hi">&ldquo;रद्द करें&rdquo;</span>.
            </p>
            <DoDont
              cards={[
                {
                  type: "do",
                  label: "Name the action with a verb. The reader knows exactly what will happen.",
                  preview: (
                    <Button variant="primary" appearance="filled">
                      Submit application
                    </Button>
                  ),
                },
                {
                  type: "dont",
                  label:
                    "“Click here” describes the gesture, not the outcome — and it fails screen-reader users, who navigate a page by its control names.",
                  preview: (
                    <Button variant="primary" appearance="filled">
                      Click here
                    </Button>
                  ),
                },
              ]}
            />
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-deprecated">
            <h2 id="cdp-deprecated" className="cdp__h2">
              Two Deprecated Appearances, and One That Is Gone
            </h2>
            <p>
              <code>appearance=&quot;inverse&quot;</code> and{" "}
              <code>appearance=&quot;inverseOutlined&quot;</code> are <strong>deprecated</strong>.
              They are a tone, not a style, and modelling them as appearances is what made them
              ignore <code>variant</code>. Use <code>tone=&quot;inverse&quot;</code> with{" "}
              <code>appearance=&quot;filled&quot;</code> or <code>&quot;outlined&quot;</code>{" "}
              instead. They keep working &mdash; the Ticker&rsquo;s documented route-out, the login
              shell and two Code Connect templates all name them, and breaking those to rename a
              prop would be a poor trade.
            </p>
            <p>
              <code>tonal</code> is <strong>gone</strong>. Its fill and its border were the same
              pale wash, so the control had no edge against the page &mdash; 1.21:1 to 1.52:1
              against a 3:1 requirement &mdash; and it could not be darkened without becoming{" "}
              <code>outlined</code>. It had two consumers in 494 buttons; both are now{" "}
              <code>outlined</code>.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-install">
            <h2 id="cdp-install" className="cdp__h2">
              Installation and Import
            </h2>
            <CodeBlock>{`npm install @mosje/design-system

// once, in your root layout or entry file:
import "@mosje/design-system/tokens.css";`}</CodeBlock>
            <CodeBlock>{`import { Button, buttonClasses } from "@mosje/design-system";`}</CodeBlock>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`export function ApplicationForm() {
  return (
    <form onSubmit={handleSubmit}>
      {/* …fields… */}
      <ButtonGroup aria-label="Application actions">
        {/* Primary call to action — one per view */}
        <Button variant="primary" appearance="filled" type="submit" loading={submitting}>
          Submit application
        </Button>

        {/* Secondary action */}
        <Button variant="primary" appearance="outlined" type="button">
          Save draft
        </Button>

        {/* Tertiary / ghost action */}
        <Button variant="primary" appearance="text" type="button">
          Cancel
        </Button>

        {/* Destructive action — confirm before it runs */}
        <Button variant="danger" appearance="filled" onClick={confirmDelete}>
          Delete application
        </Button>
      </ButtonGroup>
    </form>
  );
}`}</CodeBlock>
            <p>
              Where an element that is not a button must carry the button&rsquo;s appearance, take
              the classes rather than the component:
            </p>
            <CodeBlock>{`import Link from "next/link";
import { buttonClasses } from "@mosje/design-system";

<Link href="/schemes" className={buttonClasses("primary", "outlined", "md")}>
  Browse schemes
</Link>`}</CodeBlock>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-tokens">
            <h2 id="cdp-tokens" className="cdp__h2">
              Tokens Consumed
            </h2>
            <TokenTable
              tokens={[
                { token: "--sa-color-action-primary-default", value: "#0373df", description: "Fill for the primary variant.", isColor: true },
                { token: "--sa-color-status-danger", value: "#DC2626", description: "Fill for the danger variant.", isColor: true },
                { token: "--sa-focus-ring", value: "rgba(3,115,223,0.48)", description: "The 3px focus ring." },
                { token: "--sa-shape-8", value: "8px", description: "Corner radius of the container." },
                { token: "--sa-stack-12", value: "12px", description: "Horizontal padding inside the control." },
              ]}
            />
            <p>
              The non-text contrast of every action boundary is measured on each build by{" "}
              <code>packages/tokens/test/action-nontext-contrast.test.mjs</code>, so a fill or a
              border that stops clearing 3:1 fails the build rather than being found in an audit.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-figma">
            <h2 id="cdp-figma" className="cdp__h2">
              In Figma
            </h2>
            <ul>
              <li>
                <a href={figmaUrl(FIGMA_NODES.buttons)} target="_blank" rel="noopener noreferrer">
                  The master
                </a>{" "}
                &mdash; the published component set, on Type × Sub-type axes.
              </li>
              <li>
                <a href={figmaUrl(FIGMA_NODES.buttonRecord)} target="_blank" rel="noopener noreferrer">
                  Component record
                </a>{" "}
                &mdash; the maintainer frame, carrying the open items and where each number came
                from.
              </li>
            </ul>
          </section>
        </>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-keys">
            <h2 id="cdp-keys" className="cdp__h2">
              Keyboard
            </h2>
            <p>
              Because the component renders a native <code>&lt;button&gt;</code>, all standard
              keyboard semantics work without being re-implemented.
            </p>
            <MatrixTable
              caption="Keyboard behaviour"
              columns={["Key", "Action"]}
              rows={[
                ["Enter", "Activates the button and fires onClick."],
                ["Space", "Activates the button and fires onClick."],
                ["Tab", "Moves focus to the next focusable element."],
                ["Shift + Tab", "Moves focus to the previous focusable element."],
              ]}
            />
            <Callout type="info" title="While loading">
              <code>loading</code> sets <code>aria-busy=&quot;true&quot;</code> and disables the
              control, so the keyboard path is closed for as long as the submission is in flight.
              Keep the label meaningful &mdash; &ldquo;Submitting&hellip;&rdquo; &mdash; rather than
              removing it or replacing it with a bare spinner.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-evidence">
            <h2 id="cdp-evidence" className="cdp__h2">
              Evidence
            </h2>
            <ul>
              <li>
                <strong>GOV.UK button research</strong> &mdash; verb-first, action-naming labels
                measurably increase form completion against generic ones.
              </li>
              <li>
                <strong>WCAG 2.5.8 Target Size (Minimum)</strong> &mdash; Level AA requires 24×24,
                which every size clears. The 44×44 figure belongs to 2.5.5 Target Size (Enhanced),
                Level AAA.
              </li>
              <li>
                <strong>GIGW 3.5</strong> &mdash; all interactive elements must be fully keyboard
                operable.
              </li>
              <li>
                <strong>e2e/design-system/button.spec.ts</strong> &mdash; pins the disabled-link
                semantics and the 200% text-resize behaviour at the criterion&rsquo;s own
                threshold.
              </li>
            </ul>
          </section>
        </>
      }
    />
  );
}
