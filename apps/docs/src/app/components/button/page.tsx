import type { Metadata } from "next";
import {
  PropsTable,
  DoDont,
  Callout,
  TokenTable,
  A11yChecklist,
  StatusBadge,
} from "@/components/docs-kit/index";
import { ButtonPlayground } from "./button-playground";
import { Button } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Button",
  description:
    "A Button triggers an action within the system — submitting a form, confirming a dialog, or running a command. The most-used interactive atom in the SAMAVESH design system.",
};

/* ------------------------------------------------------------------ *
 * Shared layout primitives (inline styles, --ds-* tokens only)
 * ------------------------------------------------------------------ */

const sectionStyle: React.CSSProperties = {
  marginTop: "var(--ds-space-12)",
  scrollMarginTop: "var(--ds-space-12)",
};

const h2Style: React.CSSProperties = {
  fontSize: "var(--ds-text-headline)",
  fontWeight: 700,
  color: "var(--ds-ink)",
  marginBottom: "var(--ds-space-4)",
  paddingBottom: "var(--ds-space-2)",
  borderBottom: "1px solid var(--ds-border)",
};

const h3Style: React.CSSProperties = {
  fontSize: "var(--ds-text-title-1)",
  fontWeight: 600,
  color: "var(--ds-ink)",
  marginTop: "var(--ds-space-6)",
  marginBottom: "var(--ds-space-2)",
};

const proseStyle: React.CSSProperties = {
  color: "var(--ds-ink-muted)",
  fontSize: "var(--ds-text-body-1)",
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
        gap: "var(--ds-space-4)",
        alignItems: "center",
        padding: "var(--ds-space-3) 0",
        borderBottom: "1px solid var(--ds-border)",
      }}
    >
      <strong style={{ color: "var(--ds-ink)", fontSize: "var(--ds-text-body-2)" }}>
        {state}
      </strong>
      <div>{children}</div>
      <span style={{ color: "var(--ds-ink-muted)", fontSize: "var(--ds-text-body-2)" }}>
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
                    fontFamily: "var(--ds-font-mono, monospace)",
                    fontSize: "var(--ds-text-body-2)",
                    background: "var(--ds-surface-muted)",
                    border: "1px solid var(--ds-border)",
                    borderRadius: "var(--ds-radius-sm, 4px)",
                    padding: "2px 6px",
                    color: "var(--ds-ink)",
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
        padding: "var(--ds-space-8) var(--ds-space-6) var(--ds-space-14)",
      }}
    >
      {/* ---------------- Header ---------------- */}
      <header style={{ marginBottom: "var(--ds-space-8)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--ds-space-3)",
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
            Button
          </h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ ...proseStyle, marginTop: "var(--ds-space-3)" }}>
          A Button triggers an action within the system — submitting a form,
          confirming a dialog, or running a command. It is the most-used
          interactive atom in SAMAVESH and the reference implementation for every
          other component page.
        </p>
      </header>

      {/* ============ 1. PURPOSE ============ */}
      <section style={sectionStyle}>
        <h2 id="purpose" style={h2Style}>
          1. Purpose
        </h2>
        <p style={proseStyle}>
          A Button triggers an action within the system. Reach for it whenever a
          user needs to <em>do</em> something — submit an application, save a
          draft, confirm a choice, or run a command. A button always performs an
          action on the current page or in the current flow.
        </p>
        <p style={{ ...proseStyle, marginTop: "var(--ds-space-3)" }}>
          If the control takes the user to a different page or resource, it is a{" "}
          <strong>link</strong>, not a button. Getting this distinction right is
          the single most important accessibility decision for an interactive
          element.
        </p>
      </section>

      {/* ============ 2. ANATOMY ============ */}
      <section style={sectionStyle}>
        <h2 id="anatomy" style={h2Style}>
          2. Anatomy
        </h2>
        <p style={proseStyle}>
          A button is intentionally simple: a labelled, focusable container with a
          clearly visible focus state.
        </p>
        <div
          style={{
            display: "flex",
            gap: "var(--ds-space-8)",
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: "var(--ds-space-6)",
            padding: "var(--ds-space-8)",
            background: "var(--ds-surface-muted)",
            borderRadius: "var(--ds-radius-md, 8px)",
            border: "1px solid var(--ds-border)",
          }}
        >
          {/* Annotated specimen */}
          <div style={{ position: "relative", padding: "var(--ds-space-6)" }}>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "calc(-1 * var(--ds-space-1))",
                outline: "3px solid var(--ds-primary-ring, var(--ds-primary))",
                outlineOffset: "2px",
                borderRadius: "var(--ds-radius-md, 8px)",
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
              paddingLeft: "var(--ds-space-5)",
              color: "var(--ds-ink-muted)",
              fontSize: "var(--ds-text-body-2)",
              lineHeight: 1.9,
            }}
          >
            <li>
              <strong style={{ color: "var(--ds-ink)" }}>Label text</strong> —
              clear and verb-first (&ldquo;Submit application&rdquo;).
            </li>
            <li>
              <strong style={{ color: "var(--ds-ink)" }}>Container</strong> — a
              real <code>&lt;button&gt;</code> with a 44px minimum height.
            </li>
            <li>
              <strong style={{ color: "var(--ds-ink)" }}>Focus ring</strong> — a
              3px ring drawn with <code>--ds-primary-ring</code>.
            </li>
          </ol>
        </div>
      </section>

      {/* ============ 3. WHEN TO USE / NOT ============ */}
      <section style={sectionStyle}>
        <h2 id="when-to-use" style={h2Style}>
          3. When to use / not
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--ds-space-4)",
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

      {/* ============ 4. VARIANTS ============ */}
      <section style={sectionStyle}>
        <h2 id="variants" style={h2Style}>
          4. Variants
        </h2>
        <p style={proseStyle}>
          Variants encode intent and visual weight. Use weight to guide the eye to
          the single most important action on a view.
        </p>
        <ul
          style={{
            ...proseStyle,
            marginTop: "var(--ds-space-3)",
            paddingLeft: "var(--ds-space-5)",
            lineHeight: 1.9,
          }}
        >
          <li>
            <strong style={{ color: "var(--ds-ink)" }}>Primary</strong> — the
            main call to action. One per view, maximum.
          </li>
          <li>
            <strong style={{ color: "var(--ds-ink)" }}>Secondary</strong> —
            secondary actions that sit beside the primary CTA.
          </li>
          <li>
            <strong style={{ color: "var(--ds-ink)" }}>Ghost</strong> — tertiary,
            low-emphasis actions such as table-row actions.
          </li>
          <li>
            <strong style={{ color: "var(--ds-ink)" }}>Danger</strong> —
            destructive actions; always pair with a confirmation step.
          </li>
        </ul>
        <Callout type="info" title="How variants map to the component API">
          The shared <code>Button</code> exposes a <code>variant</code> axis
          (primary · success · danger) and an <code>appearance</code> axis (filled
          · outlined · text · tonal). The intents above map onto that API:{" "}
          <strong>secondary</strong> = <code>appearance=&quot;outlined&quot;</code>,{" "}
          <strong>ghost</strong> = <code>appearance=&quot;text&quot;</code>. The
          playground below emits the exact code.
        </Callout>
        <div style={{ marginTop: "var(--ds-space-6)" }}>
          <ButtonPlayground />
        </div>
      </section>

      {/* ============ 5. STATES ============ */}
      <section style={sectionStyle}>
        <h2 id="states" style={h2Style}>
          5. States
        </h2>
        <p style={proseStyle}>
          Every interactive state is visually distinct and meets AA contrast.
        </p>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
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
          <StateRow state="Focus" note="3px --ds-primary-ring, visible for keyboard users.">
            <span
              style={{
                display: "inline-block",
                outline: "3px solid var(--ds-primary-ring, var(--ds-primary))",
                outlineOffset: "2px",
                borderRadius: "var(--ds-radius-md, 8px)",
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

      {/* ============ 6. BEHAVIOR & KEYBOARD ============ */}
      <section style={sectionStyle}>
        <h2 id="behavior" style={h2Style}>
          6. Behavior &amp; Keyboard
        </h2>
        <p style={proseStyle}>
          Because <code>Button</code> renders a native <code>&lt;button&gt;</code>,
          all standard keyboard semantics work for free.
        </p>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
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

      {/* ============ 7. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>
          7. Accessibility
        </h2>
        <p style={proseStyle}>
          Buttons are government-grade controls — they must satisfy WCAG 2.1 AA and
          GIGW. The checklist below is verified for every release.
        </p>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
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

      {/* ============ 8. CONTENT & VOICE ============ */}
      <section style={sectionStyle}>
        <h2 id="content" style={h2Style}>
          8. Content &amp; Voice
        </h2>
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

        <div style={{ marginTop: "var(--ds-space-6)" }}>
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

      {/* ============ 9. CODE ============ */}
      <section style={sectionStyle}>
        <h2 id="code" style={h2Style}>
          9. Code
        </h2>

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
              type: '"filled" | "outlined" | "text" | "tonal"',
              default: '"filled"',
              description:
                "Visual weight. outlined = secondary, text = ghost (tertiary).",
            },
            {
              name: "size",
              type: '"sm" | "md" | "lg"',
              default: '"md"',
              description: "Control size. All sizes keep a ≥44px touch target.",
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
      <div style={{ display: "flex", gap: "var(--ds-space-3)" }}>
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
              token: "--ds-primary",
              value: "#0373DF",
              description: "Fill colour for the primary variant.",
              isColor: true,
            },
            {
              token: "--ds-primary-ring",
              value: "#0373DF",
              description: "3px focus ring colour.",
              isColor: true,
            },
            {
              token: "--ds-danger",
              value: "#DC2626",
              description: "Fill colour for the danger variant.",
              isColor: true,
            },
            {
              token: "--ds-radius-md",
              value: "8px",
              description: "Corner radius of the button container.",
            },
            {
              token: "--ds-space-3",
              value: "12px",
              description: "Horizontal padding inside the button.",
            },
          ]}
        />
      </section>

      {/* ============ 10. RESPONSIVE ============ */}
      <section style={sectionStyle}>
        <h2 id="responsive" style={h2Style}>
          10. Responsive
        </h2>
        <ul
          style={{
            ...proseStyle,
            paddingLeft: "var(--ds-space-5)",
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
      </section>

      {/* ============ 11. EVIDENCE ============ */}
      <section style={sectionStyle}>
        <h2 id="evidence" style={h2Style}>
          11. Evidence
        </h2>
        <ul
          style={{
            ...proseStyle,
            paddingLeft: "var(--ds-space-5)",
            lineHeight: 1.9,
          }}
        >
          <li>
            <strong style={{ color: "var(--ds-ink)" }}>GOV.UK Button research</strong>{" "}
            — verb-first, action-naming labels measurably increase form completion
            versus generic labels.
          </li>
          <li>
            <strong style={{ color: "var(--ds-ink)" }}>WCAG 2.5.8 (Target Size)</strong>{" "}
            — a 44×44px minimum touch target is required from WCAG 2.2.
          </li>
          <li>
            <strong style={{ color: "var(--ds-ink)" }}>GOI GIGW 3.5</strong> — all
            interactive elements must be fully keyboard operable.
          </li>
        </ul>
      </section>

      {/* ============ 12. RELATED ============ */}
      <section style={sectionStyle}>
        <h2 id="related" style={h2Style}>
          12. Related
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--ds-space-4)",
            marginTop: "var(--ds-space-4)",
          }}
        >
          <RelatedCard
            href="/design-system/components/input#form-field"
            title="Form Field"
            blurb="Buttons submit the forms that form fields build."
          />
          <RelatedCard
            href="/design-system/components/badge"
            title="Badge"
            blurb="For status and counts — never use a button to display state."
          />
          <RelatedCard
            href="/design-system/components/card"
            title="Card"
            blurb="Cards often end with one primary button as their action."
          />
        </div>
      </section>

      {/* ============ 13. CHANGELOG ============ */}
      <section style={sectionStyle}>
        <h2 id="changelog" style={h2Style}>
          13. Changelog
        </h2>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr",
              gap: "var(--ds-space-4)",
              padding: "var(--ds-space-3) 0",
              borderTop: "1px solid var(--ds-border)",
            }}
          >
            <code
              style={{
                color: "var(--ds-primary)",
                fontWeight: 700,
                fontSize: "var(--ds-text-body-2)",
              }}
            >
              v0.5.0
            </code>
            <div>
              <div style={{ color: "var(--ds-ink)", fontWeight: 600 }}>
                Initial release{" "}
                <span style={{ marginLeft: "var(--ds-space-2)" }}>
                  <StatusBadge status="Stable" />
                </span>
              </div>
              <p
                style={{
                  ...proseStyle,
                  marginTop: "var(--ds-space-1)",
                  fontSize: "var(--ds-text-body-2)",
                }}
              >
                Primary, secondary (outlined), ghost (text), and danger variants.
                SM / MD / LG sizes. Icon slots and link mode.
              </p>
            </div>
          </div>
        </div>
      </section>
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
        background: "var(--ds-primary)",
        color: "var(--ds-on-primary, #fff)",
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
  const accent = tone === "do" ? "var(--ds-success, #16A34A)" : "var(--ds-danger, #DC2626)";
  return (
    <div
      style={{
        border: "1px solid var(--ds-border)",
        borderTop: `3px solid ${accent}`,
        borderRadius: "var(--ds-radius-md, 8px)",
        padding: "var(--ds-space-5)",
        background: "var(--ds-surface)",
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: "var(--ds-space-3)",
          fontSize: "var(--ds-text-title-1)",
          fontWeight: 600,
          color: "var(--ds-ink)",
        }}
      >
        {title}
      </h3>
      <ul
        style={{
          margin: 0,
          paddingLeft: "var(--ds-space-5)",
          color: "var(--ds-ink-muted)",
          fontSize: "var(--ds-text-body-2)",
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
        border: "1px solid var(--ds-border)",
        borderRadius: "var(--ds-radius-md, 8px)",
        padding: "var(--ds-space-4)",
        background: "var(--ds-surface)",
      }}
    >
      <span
        style={{
          display: "block",
          color: "var(--ds-primary)",
          fontWeight: 600,
          fontSize: "var(--ds-text-body-1)",
        }}
      >
        {title} →
      </span>
      <span
        style={{
          display: "block",
          marginTop: "var(--ds-space-1)",
          color: "var(--ds-ink-muted)",
          fontSize: "var(--ds-text-body-2)",
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
        background: "var(--ds-surface-muted)",
        border: "1px solid var(--ds-border)",
        borderRadius: "var(--ds-radius-md, 8px)",
        padding: "var(--ds-space-4)",
        overflowX: "auto",
        fontSize: "var(--ds-text-body-2)",
        lineHeight: 1.6,
        color: "var(--ds-ink)",
        marginTop: "var(--ds-space-2)",
      }}
    >
      <code style={{ fontFamily: "var(--ds-font-mono, monospace)" }}>
        {children}
      </code>
    </pre>
  );
}
