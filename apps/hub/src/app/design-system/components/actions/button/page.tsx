import type { Metadata } from "next";
import {
  DocsTabs, PropsTable,
  DoDont,
  Callout,
  TokenTable,
  A11yChecklist,
  StatusBadge,
} from "@/components/design-system/docs-kit/index";
import { ButtonPlayground } from "./button-playground";
import { Button, buttonClasses } from "@mosje/design-system";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Button",
  description:
    "A Button triggers an action within the system — submitting a form, confirming a dialog, or running a command. The most-used interactive atom in the SAMAVESH design system.",
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


/* ------------------------------------------------------------------ *
 * State swatch (Section 5)
 * ------------------------------------------------------------------ */

function StateRow({
  state,
  note,
  children,
}: {
  state: string;
  note: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr 1.4fr",
        gap: "var(--sa-stack-16)",
        alignItems: "center",
        padding: "var(--sa-padding-12) 0",
        borderBottom: "1px solid var(--sa-border-neutral-subtle)",
      }}
    >
      <strong style={{ color: "var(--sa-text-neutral-base)", fontSize: "var(--sa-type-body-2-size)" }}>
        {state}
      </strong>
      <div>{children}</div>
      <span style={{ color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-2-size)" }}>
        {note}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Keyboard / behaviour table (Section 6)
 * ------------------------------------------------------------------ */

function KeyTable({
  rows,
}: {
  rows: Array<{ key: string; action: string }>;
}): React.JSX.Element {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="props-table">
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td>
                <kbd
                  style={{
                    fontFamily: "var(--sa-font-mono)",
                    fontSize: "var(--sa-type-body-2-size)",
                    background: "var(--sa-bg-neutral-subtler)",
                    border: "1px solid var(--sa-border-neutral-subtle)",
                    borderRadius: "var(--sa-shape-6)",
                    padding: "var(--sa-padding-2) var(--sa-padding-8)",
                    color: "var(--sa-text-neutral-base)",
                  }}
                >
                  {r.key}
                </kbd>
              </td>
              <td>{r.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function ButtonPage(): React.JSX.Element {
  return (
    <main
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "var(--sa-padding-32) var(--sa-padding-24) var(--sa-section-56)",
      }}
    >
      {/* ---------------- Header ---------------- */}
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
            Button
          </h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          A Button triggers an action within the system — submitting a form,
          confirming a dialog, or running a command. It is the most-used
          interactive atom in SAMAVESH and the reference implementation for every
          other component page.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.buttons)} target="_blank" rel="noopener noreferrer">
            View in Figma <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* ============ 1. PURPOSE ============ */}
      
      <DocsTabs tabs={[
        { id: "design", label: "Design", content: (<><section style={sectionStyle}>
        <h2 id="anatomy" style={h2Style}>Anatomy</h2>
        <p style={proseStyle}>
          A button is intentionally simple: a labelled, focusable container with a
          clearly visible focus state.
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--sa-stack-32)",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "var(--sa-stack-24)",
            padding: "var(--sa-padding-32)",
            background: "var(--sa-bg-neutral-subtler)",
            borderRadius: "var(--sa-shape-8)",
            border: "1px solid var(--sa-border-neutral-subtle)",
          }}
        >
          {/* Annotated specimen */}
          <div style={{ position: "relative", padding: "var(--sa-stack-24)" }}>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "calc(-1 * var(--sa-stack-4))",
                outline: "3px solid var(--sa-focus-ring, var(--sa-border-brand-primary-base))",
                outlineOffset: "var(--sa-focus-offset)",
                borderRadius: "var(--sa-shape-8)",
                opacity: 0.55,
              }}
            />
            <Button variant="primary" appearance="filled" size="md">
              Submit application
            </Button>
            <Marker n={1} top="-26px" left="40%" />
            <Marker n={2} bottom="-26px" left="50%" />
            <Marker n={3} top="-26px" right="-10px" />
          </div>

          <ol
            style={{
              margin: 0,
              paddingLeft: "var(--sa-padding-20)",
              color: "var(--sa-text-neutral-subtle)",
              fontSize: "var(--sa-type-body-2-size)",
              lineHeight: 1.9,
            }}
          >
            <li>
              <strong style={{ color: "var(--sa-text-neutral-base)" }}>Label text</strong> —
              clear and verb-first (&ldquo;Submit application&rdquo;).
            </li>
            <li>
              <strong style={{ color: "var(--sa-text-neutral-base)" }}>Container</strong> — a
              real <code>&lt;button&gt;</code>, 32 / 40 / 48px tall by size.
            </li>
            <li>
              <strong style={{ color: "var(--sa-text-neutral-base)" }}>Focus ring</strong> — a
              3px ring drawn with <code>--sa-focus-ring</code>.
            </li>
          </ol>
        </div>
      </section>
<section style={sectionStyle}>
        <h2 id="variants" style={h2Style}>Variants</h2>
        <p style={proseStyle}>
          Variants encode intent and visual weight. Use weight to guide the eye to
          the single most important action on a view.
        </p>
        <ul
          style={{
            ...proseStyle,
            marginTop: "var(--sa-stack-12)",
            paddingLeft: "var(--sa-padding-20)",
            lineHeight: 1.9,
          }}
        >
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Primary</strong> — the
            main call to action. One per view, maximum.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Secondary</strong> —
            secondary actions that sit beside the primary CTA.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Ghost</strong> — tertiary,
            low-emphasis actions such as table-row actions.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>Danger</strong> —
            destructive actions; always pair with a confirmation step.
          </li>
        </ul>
        <Callout type="info" title="How variants map to the component API">
          The shared <code>Button</code> exposes a <code>variant</code> axis
          (primary · success · danger) and an <code>appearance</code> axis (filled
          · outlined · text · tonal · inverse · inverseOutlined). The intents above
          map onto that API:{" "}
          <strong>secondary</strong> = <code>appearance=&quot;outlined&quot;</code>,{" "}
          <strong>ghost</strong> = <code>appearance=&quot;text&quot;</code>. The
          playground below emits the exact code for a button on a white/light
          surface — for a button placed directly on a solid brand-colour surface
          (a navy header, hero band), use{" "}
          <code>appearance=&quot;inverse&quot;</code> (emphasized) or{" "}
          <code>appearance=&quot;inverseOutlined&quot;</code> (secondary) instead
          of overriding <code>className</code>.
        </Callout>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <ButtonPlayground />
        </div>
      </section>
<section style={sectionStyle}>
        <h2 id="responsive" style={h2Style}>Responsive</h2>
        <ul
          style={{
            ...proseStyle,
            paddingLeft: "var(--sa-padding-20)",
            lineHeight: 1.9,
          }}
        >
          <li>
            Touch targets are always <strong>≥44px</strong>, enforced in CSS, on
            every breakpoint.
          </li>
          <li>
            For full-width mobile buttons, wrap with{" "}
            <code>style={`{{ width: "100%" }}`}</code> or place inside a
            full-width container.
          </li>
          <li>
            Size <code>sm</code> shrinks padding and type, but still meets the 44px
            height requirement.
          </li>
        </ul>
        <CodeBlock>{`{/* Full-width on mobile, auto on larger screens */}
<Button variant="primary" appearance="filled" style={{ width: "100%" }}>
  Submit application
</Button>`}</CodeBlock>
      </section></>) },
        { id: "develop", label: "Develop", content: (<><section style={sectionStyle}>
        <h2 id="behavior" style={h2Style}>Behavior &amp; Keyboard</h2>
        <p style={proseStyle}>
          Because <code>Button</code> renders a native <code>&lt;button&gt;</code>,
          all standard keyboard semantics work for free.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <KeyTable
            rows={[
              { key: "Enter", action: "Activates the button (fires onClick)." },
              { key: "Space", action: "Activates the button (fires onClick)." },
              { key: "Tab", action: "Moves focus to the next focusable element." },
              {
                key: "Shift + Tab",
                action: "Moves focus to the previous focusable element.",
              },
            ]}
          />
        </div>
        <Callout type="info" title="While loading">
          Set <code>aria-busy=&quot;true&quot;</code> so assistive tech announces
          the busy state. Keyboard interaction still works, but the handler should
          guard against duplicate submissions.
        </Callout>
      </section>
<section style={sectionStyle}>
        <h2 id="code" style={h2Style}>Code</h2>

        <h3 style={h3Style}>Installation</h3>
        <CodeBlock>{`npm install @mosje/design-system

// once, in your root layout or entry file:
import "@mosje/design-system/tokens.css";`}</CodeBlock>

        <h3 style={h3Style}>Import</h3>
        <CodeBlock>{`import { Button } from "@mosje/design-system";`}</CodeBlock>

        <h3 style={h3Style}>Props</h3>
        <PropsTable
          props={[
            {
              name: "variant",
              type: '"primary" | "success" | "danger"',
              default: '"primary"',
              description: "Semantic colour role / intent of the action.",
            },
            {
              name: "appearance",
              type: '"filled" | "outlined" | "text" | "tonal" | "inverse" | "inverseOutlined"',
              default: '"filled"',
              description:
                "Visual weight. outlined = secondary, text = ghost (tertiary). inverse/inverseOutlined are for a button placed directly on a solid brand-colour surface (e.g. a navy header) — use instead of overriding className.",
            },
            {
              name: "size",
              type: '"sm" | "md" | "lg"',
              default: '"md"',
              description:
                "Control size — 32 / 40 / 48px tall. Every size clears the 24×24px Level AA minimum; only lg reaches the 44px Level AAA target.",
            },
            {
              name: "iconLeft",
              type: "React.ReactNode",
              description: "Decorative icon rendered before the label.",
            },
            {
              name: "iconRight",
              type: "React.ReactNode",
              description: "Decorative icon rendered after the label.",
            },
            {
              name: "href",
              type: "string",
              description:
                "When set, renders an <a> styled as a button for link CTAs.",
            },
            {
              name: "disabled",
              type: "boolean",
              default: "false",
              description:
                "Native disabled attribute. Removes the button from the tab order.",
            },
            {
              name: "children",
              type: "React.ReactNode",
              required: true,
              description: "The button label — an imperative, verb-first phrase.",
            },
            {
              name: "...rest",
              type: "ButtonHTMLAttributes",
              description:
                "All native button props — onClick, type, aria-busy, form, etc.",
            },
          ]}
        />

        <h3 style={h3Style}>Usage</h3>
        <CodeBlock>{`import { Button } from "@mosje/design-system";

export function ApplicationForm() {
  return (
    <form onSubmit={handleSubmit}>
      {/* …fields… */}
      <div style={{ display: "flex", gap: "var(--sa-stack-12)" }}>
        {/* Primary CTA — one per view */}
        <Button variant="primary" appearance="filled" type="submit">
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

        {/* Destructive action — confirm before running */}
        <Button variant="danger" appearance="filled" onClick={confirmDelete}>
          Delete application
        </Button>
      </div>
    </form>
  );
}`}</CodeBlock>

        <h3 style={h3Style}>Tokens consumed</h3>
        <TokenTable
          tokens={[
            {
              token: "--sa-color-action-primary-default",
              value: "#0373df",
              description: "Fill colour for the primary variant.",
              isColor: true,
            },
            {
              token: "--sa-focus-ring",
              value: "rgba(3,115,223,0.48)",
              description: "3px focus ring colour.",
              isColor: false,
            },
            {
              token: "--sa-color-status-danger",
              value: "#DC2626",
              description: "Fill colour for the danger variant.",
              isColor: true,
            },
            {
              token: "--sa-shape-8",
              value: "8px",
              description: "Corner radius of the button container.",
            },
            {
              token: "--sa-stack-12",
              value: "12px",
              description: "Horizontal padding inside the button.",
            },
          ]}
        />
      </section></>) },
        { id: "accessibility", label: "Accessibility", content: (<><section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>Accessibility</h2>
        <p style={proseStyle}>
          Buttons are government-grade controls — they must satisfy WCAG 2.1 AA and
          GIGW. The checklist below is verified for every release.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <A11yChecklist
            items={[
              {
                criterion: "Descriptive label text",
                level: "AA",
                description:
                  "The label communicates the action, not just “Click here” or a bare “Submit”. (WCAG 2.4.6)",
              },
              {
                criterion: "44×44px minimum touch target",
                level: "AA",
                description:
                  "Every variant — including size sm — meets the minimum target size. (WCAG 2.5.8)",
              },
              {
                criterion: "Visible focus indicator",
                level: "AA",
                description:
                  "A 3px focus ring with AA-contrast against the background. (WCAG 2.4.11)",
              },
              {
                criterion: "Communicates disabled state",
                level: "AA",
                description:
                  "Disabled buttons expose aria-disabled and are not in the tab order. (WCAG 4.1.2)",
              },
              {
                criterion: "Loading state announced",
                level: "AA",
                description:
                  "aria-busy=\"true\" is set during loading so the change is announced. (WCAG 4.1.3)",
              },
            ]}
          />
        </div>
      </section>
<section style={sectionStyle}>
        <h2 id="evidence" style={h2Style}>Evidence</h2>
        <ul
          style={{
            ...proseStyle,
            paddingLeft: "var(--sa-padding-20)",
            lineHeight: 1.9,
          }}
        >
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>GOV.UK Button research</strong>{" "}
            — verb-first, action-naming labels measurably increase form completion
            versus generic labels.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>WCAG 2.5.8 Target Size (Minimum)</strong>{" "}
            — Level AA requires 24×24px, which every size clears. The 44×44px
            figure belongs to 2.5.5 Target Size (Enhanced), Level AAA.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-base)" }}>GOI GIGW 3.5</strong> — all
            interactive elements must be fully keyboard operable.
          </li>
        </ul>
      </section></>) },
        { id: "meta", label: "Meta", content: (<><section style={sectionStyle}>
        <h2 id="purpose" style={h2Style}>Purpose</h2>
        <p style={proseStyle}>
          A Button triggers an action within the system. Reach for it whenever a
          user needs to <em>do</em> something — submit an application, save a
          draft, confirm a choice, or run a command. A button always performs an
          action on the current page or in the current flow.
        </p>
        <p style={{ ...proseStyle, marginTop: "var(--sa-stack-12)" }}>
          If the control takes the user to a different page or resource, it is a{" "}
          <strong>link</strong>, not a button. Getting this distinction right is
          the single most important accessibility decision for an interactive
          element.
        </p>
      </section>
<section style={sectionStyle}>
        <h2 id="when-to-use" style={h2Style}>When to use / not</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--sa-stack-16)",
          }}
        >
          <UseCard tone="do" title="Use a Button when…">
            <li>Submitting or saving a form.</li>
            <li>Triggering an action (export, print, calculate).</li>
            <li>Confirming or cancelling in a dialog.</li>
            <li>Opening a menu, modal, or drawer.</li>
          </UseCard>
          <UseCard tone="dont" title="Don't use a Button when…">
            <li>
              Navigating to another page — use a link (<code>&lt;a&gt;</code>).
            </li>
            <li>
              Displaying a status or count — use a <strong>Badge</strong>.
            </li>
            <li>Toggling a single setting — use a switch or checkbox.</li>
          </UseCard>
        </div>
        <Callout type="warning" title="Buttons are not links">
          A button performs an action; a link changes location. If a screen reader
          user activates your &ldquo;button&rdquo; and the page navigates away, the
          control was wrong. When you need a link styled like a button, use{" "}
          <code>buttonClasses()</code> on an <code>&lt;a&gt;</code> or{" "}
          <code>next/link</code>.
        </Callout>
      </section>
<section style={sectionStyle}>
        <h2 id="states" style={h2Style}>States</h2>
        <p style={proseStyle}>
          Every interactive state is visually distinct and meets AA contrast.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <StateRow state="Default" note="Resting state — full colour, no overlay.">
            <Button variant="primary" appearance="filled">
              Submit application
            </Button>
          </StateRow>
          <StateRow state="Hover" note="Subtle darkening; cursor becomes a pointer.">
            <Button
              variant="primary"
              appearance="filled"
              className="ds-btn--state-hover"
            >
              Submit application
            </Button>
          </StateRow>
          <StateRow state="Focus" note="3px --sa-focus-ring, visible for keyboard users.">
            <span
              style={{
                display: "inline-block",
                outline: "3px solid var(--sa-focus-ring, var(--sa-border-brand-primary-base))",
                outlineOffset: "var(--sa-focus-offset)",
                borderRadius: "var(--sa-shape-8)",
              }}
            >
              <Button variant="primary" appearance="filled">
                Submit application
              </Button>
            </span>
          </StateRow>
          <StateRow state="Active" note="Pressed — momentary deeper tone.">
            <Button
              variant="primary"
              appearance="filled"
              className="ds-btn--state-active"
            >
              Submit application
            </Button>
          </StateRow>
          <StateRow state="Disabled" note="Reduced opacity; not focusable; aria-disabled.">
            <Button variant="primary" appearance="filled" disabled>
              Submit application
            </Button>
          </StateRow>
          <StateRow state="Loading" note="aria-busy=true; label swaps to a progress message.">
            <Button variant="primary" appearance="filled" disabled aria-busy="true">
              Submitting…
            </Button>
          </StateRow>
        </div>
        <Callout type="tip" title="Loading is a busy disabled state">
          A loading button should set <code>aria-busy=&quot;true&quot;</code> and
          prevent re-submission. Keep the label meaningful
          (&ldquo;Submitting…&rdquo;) rather than removing it.
        </Callout>
      </section>
<section style={sectionStyle}>
        <h2 id="content" style={h2Style}>Content &amp; Voice</h2>
        <p style={proseStyle}>
          Labels are written as imperative verbs that name the action. This is true
          in every supported language.
        </p>

        <h3 style={h3Style}>English</h3>
        <p style={proseStyle}>
          Use imperative verbs — &ldquo;Submit&rdquo;, &ldquo;Save&rdquo;,
          &ldquo;Cancel&rdquo;. Avoid vague labels like &ldquo;Click here&rdquo;,
          &ldquo;OK&rdquo;, or a lone &ldquo;Yes&rdquo;.
        </p>

        <h3 style={h3Style}>हिन्दी</h3>
        <p style={proseStyle}>
          वही नियम — क्रिया से शुरू करें: &ldquo;जमा करें&rdquo; (केवल
          &ldquo;हाँ&rdquo; नहीं), &ldquo;सहेजें&rdquo;, &ldquo;रद्द करें&rdquo;.
        </p>

        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <DoDont
            cards={[
              {
                type: "do",
                label:
                  "Name the action with a verb. The user knows exactly what happens.",
                preview: (
                  <Button variant="primary" appearance="filled">
                    Submit application
                  </Button>
                ),
              },
              {
                type: "dont",
                label:
                  "“Click here” describes the gesture, not the outcome — and fails screen-reader users who navigate by label.",
                preview: (
                  <Button variant="primary" appearance="filled">
                    Click here
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </section>
<section style={sectionStyle}>
        <h2 id="related" style={h2Style}>Related</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--sa-stack-16)",
            marginTop: "var(--sa-stack-16)",
          }}
        >
          <RelatedCard
            href="/design-system/components/forms/form-field"
            title="Form Field"
            blurb="Buttons submit the forms that form fields build."
          />
          <RelatedCard
            href="/design-system/components/feedback/badge"
            title="Badge"
            blurb="For status and counts — never use a button to display state."
          />
          <RelatedCard
            href="/design-system/components/data-display/card"
            title="Card"
            blurb="Cards often end with one primary button as their action."
          />
        </div>
      </section>
<section style={sectionStyle}>
        <h2 id="changelog" style={h2Style}>Changelog</h2>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr",
              gap: "var(--sa-stack-16)",
              padding: "var(--sa-padding-12) 0",
              borderTop: "1px solid var(--sa-border-neutral-subtle)",
            }}
          >
            <code
              style={{
                color: "var(--sa-text-brand-primary-base)",
                fontWeight: 700,
                fontSize: "var(--sa-type-body-2-size)",
              }}
            >
              v0.5.0
            </code>
            <div>
              <div style={{ color: "var(--sa-text-neutral-base)", fontWeight: 600 }}>
                Initial release{" "}
                <span style={{ marginLeft: "var(--sa-inline-8)" }}>
                  <StatusBadge status="Stable" />
                </span>
              </div>
              <p
                style={{
                  ...proseStyle,
                  marginTop: "var(--sa-stack-4)",
                  fontSize: "var(--sa-type-body-2-size)",
                }}
              >
                Primary, secondary (outlined), ghost (text), and danger variants.
                SM / MD / LG sizes. Icon slots and link mode.
              </p>
            </div>
          </div>
        </div>
      </section></>) }
      ]} />
</main>
  );
}

/* ------------------------------------------------------------------ *
 * Local helper components
 * ------------------------------------------------------------------ */

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
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "var(--sa-bg-brand-primary-bolder)",
        color: "var(--sa-on-bg-brand-primary-bolder)",
        fontSize: "11px",
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

function UseCard({
  tone,
  title,
  children,
}: {
  tone: "do" | "dont";
  title: string;
  children: React.ReactNode;
}): React.JSX.Element {
  const accent = tone === "do" ? "var(--sa-color-status-success)" : "var(--sa-color-status-danger)";
  return (
    <div
      style={{
        border: "1px solid var(--sa-border-neutral-subtle)",
        borderTop: `3px solid ${accent}`,
        borderRadius: "var(--sa-shape-8)",
        padding: "var(--sa-padding-20)",
        background: "var(--sa-bg-neutral-base)",
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: "var(--sa-stack-12)",
          fontSize: "var(--sa-type-headline-2-size)",
          fontWeight: 600,
          color: "var(--sa-text-neutral-base)",
        }}
      >
        {title}
      </h3>
      <ul
        style={{
          margin: 0,
          paddingLeft: "var(--sa-padding-20)",
          color: "var(--sa-text-neutral-subtle)",
          fontSize: "var(--sa-type-body-2-size)",
          lineHeight: 1.8,
        }}
      >
        {children}
      </ul>
    </div>
  );
}

function RelatedCard({
  href,
  title,
  blurb,
}: {
  href: string;
  title: string;
  blurb: string;
}): React.JSX.Element {
  return (
    <a
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        border: "1px solid var(--sa-border-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        padding: "var(--sa-padding-16)",
        background: "var(--sa-bg-neutral-base)",
      }}
    >
      <span
        style={{
          display: "block",
          color: "var(--sa-text-brand-primary-base)",
          fontWeight: 600,
          fontSize: "var(--sa-type-body-1-size)",
        }}
      >
        {title} →
      </span>
      <span
        style={{
          display: "block",
          marginTop: "var(--sa-stack-4)",
          color: "var(--sa-text-neutral-subtle)",
          fontSize: "var(--sa-type-body-2-size)",
          lineHeight: 1.6,
        }}
      >
        {blurb}
      </span>
    </a>
  );
}

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
