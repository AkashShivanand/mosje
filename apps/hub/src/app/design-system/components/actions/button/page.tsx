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
import { Button, Icon } from "@mosje/design-system";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

import { ButtonPlayground } from "./button-playground";
import { PreserveFocusDemo } from "./preserve-focus-demo";

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
    description:
      "An `outline` bound to `--sa-focus-width` and `--sa-focus-ring`, held clear of the control by `--sa-focus-offset` and following its border radius. It was a hardcoded 3px `box-shadow` flush against the fill until 2026-09-03, while this page claimed it was offset. UX4G 3.0 asks for a 2px offset matching the radius, which this now meets; UX4G's 4px width is not adopted, because one component running thicker than every other focusable control in the estate is worse than the 2px.",
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
        fontWeight: "var(--sa-font-weight-bold)",
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
                <strong>Focus ring</strong> &mdash; <code>--sa-focus-width</code> thick in{" "}
                <code>--sa-focus-ring</code>, offset by <code>--sa-focus-offset</code>, and never
                removed.
              </li>
            </ol>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-variants">
            <h2 id="cdp-variants" className="cdp__h2">
              Variants
            </h2>
            <p>
              A button is two independent choices. <strong>Intent</strong> is what the action
              means; <strong>prominence</strong> is how loudly it says it. Keeping them apart is
              why a destructive action can be quiet and a housekeeping one can be loud without
              either needing a new word &mdash; and it is why this component has no variant called
              &ldquo;secondary&rdquo;. Secondary is a prominence, and it is spelled{" "}
              <code>appearance=&quot;outlined&quot;</code>.
            </p>

            <h3 className="cdp__h3">Intent &mdash; the <code>variant</code> axis</h3>
            <p>
              <Button variant="primary">Submit application</Button>{" "}
              <Button variant="success">Approve</Button>{" "}
              <Button variant="danger">Delete application</Button>{" "}
              <Button variant="neutral">Start over</Button>
            </p>
            <MatrixTable
              caption="The four intents, and the action each one is for"
              columns={["variant", "Use for", "Never use for"]}
              rows={[
                ["primary", "The main call to action on the view. One per view, at most.", "Three buttons of equal weight in a row — then none of them is primary."],
                ["success", "Confirming a positive outcome the department is recording — an approval, a sanction.", "An ordinary save. A form that saves is primary; green is for the outcome, not the mechanism."],
                ["danger", "A step that destroys something the citizen cannot get back. Always paired with a confirmation.", "Anything recoverable. On a portal where red means “your application was rejected”, spending it elsewhere devalues the signal."],
                ["neutral", "An action carrying no semantic charge — dismiss, reset, “start over”.", "Nothing. This is the one to reach for the moment you want a control to look different from the paragraph beside it."],
              ]}
            />
            <Callout type="warning" title="Neutral exists so nothing has to borrow a signal colour">
              Before <code>neutral</code> there was no way to say &ldquo;quiet&rdquo; without
              taking a colour that means something. The chatbot&rsquo;s end-chat control duly
              shipped in <code>danger</code> &mdash; the estate&rsquo;s rejection red, spent on
              housekeeping, which made the least-used control the loudest thing in its panel. If
              you are choosing a variant because of how it <em>looks</em>, the answer is{" "}
              <code>neutral</code> with an <code>appearance</code>.
            </Callout>

            <h3 className="cdp__h3">With an Icon</h3>
            <p>
              A glyph takes <code>iconLeft</code> or <code>iconRight</code> and is marked
              decorative &mdash; the label already names the action. It inherits the
              button&rsquo;s own ink rather than carrying a colour, so it is white on a
              filled button and the intent&rsquo;s colour on an outlined one, in every
              state, without anything to keep in sync.
            </p>
            <p>
              <Button variant="primary" iconLeft={<Icon name="add" size={16} />} data-testid="icon-filled">
                Add beneficiary
              </Button>{" "}
              <Button
                variant="primary"
                appearance="outlined"
                iconRight={<Icon name="arrow_forward" size={16} />}
                data-testid="icon-outlined"
              >
                Continue
              </Button>{" "}
              <Button variant="danger" iconLeft={<Icon name="delete" size={16} />}>
                Delete application
              </Button>
            </p>

            <h3 className="cdp__h3">Prominence &mdash; the <code>appearance</code> axis</h3>
            <p>
              <Button variant="primary" appearance="filled">Filled</Button>{" "}
              <Button variant="primary" appearance="outlined">Outlined</Button>{" "}
              <Button variant="primary" appearance="text">Text</Button>
            </p>
            <MatrixTable
              caption="The three prominences. They cross every intent."
              columns={["appearance", "Reads as", "Use for"]}
              rows={[
                ["filled", "The loudest.", "The one action the view exists for."],
                ["outlined", "The middle weight — what other systems call “secondary”.", "The actions standing beside the primary one."],
                ["text", "The quietest — what other systems call “ghost”.", "Tertiary actions: a table-row control, a cancel beside a submit."],
              ]}
            />
            <Callout type="info" title="Tonal was retired, and not replaced">
              A fourth prominence, <code>tonal</code>, was removed on 2026-08-27. Its fill and its
              border were the same pale wash, so the control had no findable edge against the page
              &mdash; between 1.21:1 and 1.52:1 where WCAG 2.2 §1.4.11 asks 3:1 &mdash; and
              darkening the border to fix it would simply have produced <code>outlined</code>.
              UX4G 3.0 still publishes a tonal button; theirs measures 1.41:1 on a white page. This
              is a measured divergence from the standard, not an oversight.
            </Callout>

            <h3 className="cdp__h3">Ground &mdash; the <code>tone</code> axis</h3>
            <p>
              <code>tone</code> says which surface the button sits on, and it{" "}
              <strong>crosses</strong> <code>appearance</code> rather than replacing it &mdash;
              which is the whole point. Modelled as two extra appearance words, an inverse button
              could only have one look, so all four intents painted the same white-alpha border and{" "}
              <code>danger</code> silently lost its signal. Crossed, each intent keeps its own edge
              on a brand ground.
            </p>
            {/* ds-exempt(demo-geometry): the specimen needs the brand ground it is FOR.
                Every value here is token-bound; only the fact of the stage is literal. */}
            <div
              data-testid="inverse-strip"
              style={{
                background: "var(--sa-bg-brand-primary-bolder)",
                padding: "var(--sa-padding-24)",
                borderRadius: "var(--sa-shape-8)",
                display: "flex",
                gap: "var(--sa-stack-8)",
                flexWrap: "wrap",
              }}
            >
              <Button tone="inverse" appearance="filled">Filled</Button>
              <Button tone="inverse" appearance="text">Text</Button>
              <Button tone="inverse" appearance="outlined" variant="primary" data-testid="inv-primary">
                Primary
              </Button>
              <Button tone="inverse" appearance="outlined" variant="success" data-testid="inv-success">
                Success
              </Button>
              <Button tone="inverse" appearance="outlined" variant="danger" data-testid="inv-danger">
                Danger
              </Button>
              <Button tone="inverse" appearance="outlined" variant="neutral" data-testid="inv-neutral">
                Neutral
              </Button>
            </div>
            <p>
              Reach for <code>tone=&quot;inverse&quot;</code> rather than overriding{" "}
              <code>className</code>. It is in use in the portal login shell&rsquo;s
              &ldquo;Signing Into&rdquo; strip; the Ticker&rsquo;s documented route-out strips the
              border in <code>ticker.css</code> and renders as a text link.
            </p>
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
                ["Focus", "A --sa-focus-width ring in --sa-focus-ring, held --sa-focus-offset clear of the control and following its radius.", "Never removed. It is the only signal a keyboard user has. The offset is what makes it findable on a filled button, where a translucent ring flush against the fill is hardest to see."],
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

          <section className="cdp__section" aria-labelledby="cdp-layout">
            <h2 id="cdp-layout" className="cdp__h2">
              Width and Wrapping
            </h2>
            <p>
              A label <strong>wraps</strong>. Until 2026-09-03 it did not, and a button
              that refuses to wrap does not shrink &mdash; it overflows its container and
              takes the page&rsquo;s horizontal scrollbar with it. On a 320px screen, with
              a departmental label in either language, that is the common case rather than
              the edge.
            </p>
            {/* ds-exempt(demo-geometry): the container is deliberately narrow so the
                wrapping it demonstrates actually happens. Its width is the specimen. */}
            <div style={{ width: "180px", padding: "var(--sa-padding-8)", border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: "var(--sa-shape-8)" }}>
              <Button variant="primary" data-testid="btn-wrap">
                Submit application for review
              </Button>
            </div>
            <p>
              Pass <code>nowrap</code> only where one line is structural &mdash; a
              segmented control, a toolbar &mdash; and accept that the label must then be
              short enough to fit every viewport it will appear on.
            </p>
            <p>
              <code>fullWidth</code> stretches the control to its container. It is the
              supported spelling of what consumers were already doing with{" "}
              <code>className</code>.
            </p>
            <div style={{ maxWidth: "320px" }}>
              <Button variant="primary" fullWidth data-testid="btn-full">
                Continue
              </Button>
            </div>
            <p>
              A one-word action keeps the same weight as the actions beside it, because the
              width has a floor:{" "}
              <Button variant="primary" appearance="outlined" size="sm" data-testid="btn-short">
                OK
              </Button>{" "}
              <Button variant="primary" appearance="outlined" size="sm">
                Cancel
              </Button>
            </p>
            <MatrixTable
              caption="What holds a button's shape"
              columns={["Rule", "Value", "Why"]}
              rows={[
                ["Minimum width", "64px", "A one-word action next to a two-word one drew two visibly different weights. It is a floor, so nothing already wider moves; icon-only and full-width buttons are excluded, where a floor is wrong by definition."],
                ["Minimum height", "32 / 40 / 48px", "A minimum, not a fixed height, so the box grows with the text instead of clipping it at 200%."],
                ["Pointer target", "44 × 44 on touch", "sm and md are drawn smaller than that. On a coarse pointer an invisible centred area brings the target up to 44 without moving the drawn button, the layout or the focus ring — which is what UX4G asks for when it says to add transparent padding around small controls. Not applied on a mouse, where it would enlarge a dense table's row controls into their neighbours, nor inside an attached group, where buttons touch by design and the overlap would resolve by paint order rather than intent."],
              ]}
            />
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
            {/*
              READ OFF THE STYLESHEET, NOT REMEMBERED. Three of the five rows here named
              tokens the component does not consume: `--sa-color-action-primary-default`
              and `--sa-stack-12` appear nowhere in `button.css`, and
              `--sa-color-status-danger` is the focus ring's mix, not the danger fill.
              The primary fill moved to `bolder` on 2026-08-12 and this table was never
              followed. Every row below is grepped from `button.css`.
            */}
            <TokenTable
              tokens={[
                { token: "--sa-bg-brand-primary-bolder", value: "#005eb9", description: "Fill for the primary variant. A rung deeper than the ink of the same family, so white on it clears AA with headroom (6.36:1) rather than by 0.14.", isColor: true },
                { token: "--sa-text-brand-primary-bolder", value: "#005eb9", description: "Ink for the outlined and text appearances of primary — measured against the page, not against the fill.", isColor: true },
                { token: "--sa-bg-status-error-bolder", value: "#aa2f25", description: "Fill for the danger variant.", isColor: true },
                { token: "--sa-focus-ring", value: "rgba(3, 115, 223, 0.48)", description: "Colour of the focus ring.", isColor: true },
                { token: "--sa-focus-width", value: "2px", description: "Thickness of the focus ring." },
                { token: "--sa-focus-offset", value: "2px", description: "Gap held between the control and its focus ring." },
                { token: "--sa-shape-8", value: "8px", description: "Corner radius of the container. The focus outline follows it." },
                { token: "--sa-padding-16", value: "16px", description: "Horizontal padding, size sm." },
                { token: "--sa-padding-24", value: "24px", description: "Horizontal padding, sizes md and lg." },
                { token: "--sa-stack-8", value: "8px", description: "Gap between the label and either icon." },
              ]}
            />
            <p>
              The non-text contrast of every action boundary is measured on each build by{" "}
              <code>packages/tokens/test/action-nontext-contrast.test.mjs</code>, so a fill or a
              border that stops clearing 3:1 fails the build rather than being found in an audit.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-theming">
            <h2 id="cdp-theming" className="cdp__h2">
              Retheming Without Forking
            </h2>
            <p>
              A component is reusable to the extent that the next portal can bend it
              without changing it for everyone else. Four custom properties are the
              supported way in. They default to the variant&rsquo;s own values, so setting
              nothing changes nothing.
            </p>
            <TokenTable
              tokens={[
                { token: "--sa-btn-fill", value: "the variant's fill", description: "Solid background of the filled appearance." },
                { token: "--sa-btn-ink", value: "the variant's on-fill ink", description: "Label colour on that fill." },
                { token: "--sa-btn-edge", value: "the variant's edge ink", description: "Ink and border of the outlined and text appearances." },
                { token: "--sa-btn-ring", value: "--sa-focus-ring", description: "Focus ring colour, on every variant." },
              ]}
            />
            <CodeBlock>{`/* A portal stylesheet. Every state follows — hover, active,
   disabled, the focus ring and the inverse ladder all read
   these same four values. */
[data-portal="nmba"] .ds-btn--primary {
  --sa-btn-fill: var(--sa-color-accentScale-600);
  --sa-btn-ink: var(--sa-on-bg-brand-primary-bolder);
}`}</CodeBlock>
            <Callout type="warning" title="This replaces overriding background-color">
              Overriding <code>background-color</code> from outside the component wins the
              resting fill and silently loses hover, active, disabled, the focus ring and
              the whole inverse ladder &mdash; those are separate declarations reading
              separate values. A hook is read by every state, so setting one is complete
              by construction.
            </Callout>
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

          <section className="cdp__section" aria-labelledby="cdp-discoverable">
            <h2 id="cdp-discoverable" className="cdp__h2">
              Keeping a Disabled Control Findable
            </h2>
            <p>
              A natively <code>disabled</code> button leaves the tab order, so a reader
              navigating by keyboard never learns it is there. The form does not appear to
              have a submit they may not press yet &mdash; it appears to have no submit.
            </p>
            <p>
              <code>preserveFocus</code> renders the same state as{" "}
              <code>aria-disabled</code> instead, so the control stays reachable and is
              announced as dimmed. Reachable is not pressable: click and Enter/Space are
              both suppressed, and <code>type</code> is forced to{" "}
              <code>&quot;button&quot;</code> so the browser&rsquo;s own implicit form
              submission cannot fire either &mdash; the leak this pattern usually ships
              with.
            </p>
            <PreserveFocusDemo />
            <p>
              Because it replaces the native attribute with handlers,{" "}
              <code>preserveFocus</code> only works inside a client component &mdash;
              which is where an interactive control lives anyway. This specimen is one.
            </p>
            <Callout type="info" title="It is opt-in, and that is deliberate">
              Switching every disabled button in the estate into the tab order would
              change tab order on pages nobody has re-tested. Reach for{" "}
              <code>preserveFocus</code> where the control is the point of the screen
              &mdash; a form&rsquo;s submit, a wizard&rsquo;s next step &mdash; and leave
              the default alone for a row of table actions.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-hcm">
            <h2 id="cdp-hcm" className="cdp__h2">
              Windows High Contrast Mode
            </h2>
            <p>
              In forced-colors mode the operating system replaces every colour this
              component sets. That is the point of the mode &mdash; but it means the
              things a button uses to say it is a button stop existing. Filled and text
              buttons both draw a transparent border, and{" "}
              <code>transparent</code> is preserved, so both were left with no boundary at
              all; a text button became an unmarked run of text with nothing to say it
              could be pressed.
            </p>
            <MatrixTable
              caption="What the component names once the OS takes over its palette"
              columns={["Element", "System colour", "Why that one"]}
              rows={[
                ["Every boundary", "ButtonText", "WCAG 2.2 §1.4.11 asks for a 3:1 non-text boundary. A boundary the OS has erased does not meet it."],
                ["Filled and inverse", "ButtonText on ButtonFace, inverted", "Colour can no longer separate filled from outlined, so the pair the OS reserves for this control is inverted instead — the same convention the platform uses for its own default button."],
                ["Disabled", "GrayText", "Opacity is not forced, so the 50% wash stops reading as disabled. GrayText is the one keyword the mode guarantees for it."],
                ["Focus ring", "Highlight", "The system's own focus colour, held clear by the same offset as everywhere else. It is the one thing that must never be lost."],
                ["The spinner", "GrayText track, ButtonText head", "Its track is a 25% color-mix, which resolves to a system colour often identical to its own leading edge — leaving a ring that does not visibly turn."],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-links">
            <h2 id="cdp-links" className="cdp__h2">
              The Link Form
            </h2>
            <p>
              Pass <code>href</code> and the component renders a real anchor. A link that
              opens in a new tab carries <code>rel=&quot;noopener noreferrer&quot;</code>{" "}
              whether or not the caller remembered: <code>target=&quot;_blank&quot;</code>{" "}
              hands the opened page a reference back to this one, which lets it navigate
              the original tab elsewhere. Browsers imply <code>noopener</code> now, but
              that word is doing real work on an estate that must serve older Android
              WebViews, and <code>noreferrer</code> is implied nowhere.
            </p>
            <p>
              An explicit <code>rel</code> from the caller wins &mdash; someone who wrote
              one meant it.
            </p>
            <p>
              <Button
                variant="primary"
                appearance="outlined"
                href="https://www.india.gov.in"
                target="_blank"
                data-testid="btn-external"
              >
                Open the National Portal
              </Button>
            </p>
            <p>
              <code>external</code> is the shorthand, and it does more than set the target.
              GIGW 3.0 requires telling the reader when a link opens a new window, so it
              draws the open-in-new glyph for the people who can see it{" "}
              <em>and</em> appends a visually hidden &ldquo;(opens in a new tab)&rdquo; to
              the accessible name for the people who cannot. Shipping one without the other
              serves half the audience. It is ignored without <code>href</code> &mdash; a{" "}
              <code>&lt;button&gt;</code> does not navigate, so it cannot open a tab.
            </p>
            <p>
              <Button
                variant="primary"
                appearance="filled"
                href="https://www.india.gov.in"
                external
                data-testid="btn-external-shorthand"
              >
                Open the National Portal
              </Button>
            </p>
            <p>
              A trailing icon you pass yourself wins over the glyph: choosing one is a
              deliberate statement about what the control means, and the component has no
              business overruling it. The hidden warning is added either way.
            </p>
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
