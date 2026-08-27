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
        <div style={{ marginTop: "var(--sa-stack-16)", display: "flex", gap: "var(--sa-inline-12)", flexWrap: "wrap" }}>
          <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.buttonDoc)} target="_blank" rel="noopener noreferrer">
            Button — Documentation <span aria-hidden="true">↗</span>
          </a>
          <a className={buttonClasses("neutral", "text", "md")} href={figmaUrl(FIGMA_NODES.buttons)} target="_blank" rel="noopener noreferrer">
            The master <span aria-hidden="true">↗</span>
          </a>
          <a className={buttonClasses("neutral", "text", "md")} href={figmaUrl(FIGMA_NODES.buttonRecord)} target="_blank" rel="noopener noreferrer">
            Component record <span aria-hidden="true">↗</span>
          </a>
        </div>
        <Callout type="warning" title="One open defect remains, and it is listed here rather than hidden">
          The 2026-08-25 audit found three defects shipping. All three are now closed:{" "}
          <code>disabled</code> on a link-button is genuinely inert, and the size ladder is a{" "}
          <code>min-height</code> that grows with the text instead of clipping it at 200%.
          <code>tonal</code> has been <strong>retired</strong> — all four of its variants sat
          between 1.21:1 and 1.52:1 against a white page where WCAG 1.4.11 asks for 3:1, and
          darkening the border would simply have made it <code>outlined</code>. Its two
          consumers are now <code>outlined</code>.
          <br />
          <br />
          The audit also reported a fifth failure, &ldquo;neutral outlined, 2.15:1&rdquo;. That
          one does not exist: it measured{" "}
          <code>cmp/action/neutral/secondary/default/border</code>, a token this component does
          not bind. The border it actually paints measures <strong>16.18:1</strong>. Evidence in{" "}
          <code>docs/design-system/components/button-audit.md</code>; the boundaries are now
          measured on every build by{" "}
          <code>packages/tokens/test/action-nontext-contrast.test.mjs</code>.
        </Callout>
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
          · outlined · text) plus a <code>tone</code> axis (default · inverse). The intents above
          map onto that API:{" "}
          <strong>secondary</strong> = <code>appearance=&quot;outlined&quot;</code>,{" "}
          <strong>ghost</strong> = <code>appearance=&quot;text&quot;</code>. The
          playground below emits the exact code for a button on a white/light
          surface — for a button placed directly on a solid brand-colour surface
          (a navy header, hero band), use{" "}
          <code>appearance=&quot;inverse&quot;</code> (emphasized) or{" "}
          <code>tone=&quot;inverse&quot;</code> instead of overriding{" "}
          <code>className</code>. It crosses <code>appearance</code>, so{" "}
          <code>tone=&quot;inverse&quot; appearance=&quot;outlined&quot;</code> is the
          secondary form — and unlike the old <code>inverseOutlined</code> it keeps the
          variant&rsquo;s intent.
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
            Heights are <strong>minimums</strong> of <strong>32 / 40 / 48px</strong>, not
            fixed heights — the box grows with the text rather than clipping it. All three clear the{" "}
            <strong>24×24px</strong> WCAG 2.2 §2.5.8 Level AA minimum; only{" "}
            <code>lg</code> reaches the <strong>44×44px</strong> UX4G recommends for
            touch. On a touch surface, prefer <code>lg</code> or add spacing —
            UX4G also asks for 8px between adjacent targets.
          </li>
          <li>
            For full-width mobile buttons, wrap with{" "}
            <code>style={`{{ width: "100%" }}`}</code> or place inside a
            full-width container.
          </li>
          <li>
            Size <code>sm</code> is <strong>32px</strong> and does <em>not</em> reach
            44px. That is a deliberate density choice for dense admin tables, not an
            oversight — but it means <code>sm</code> is a pointer-surface size. This
            page claimed the opposite in three places until 2026-08-25.
          </li>
        </ul>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sa-stack-16)",
            flexWrap: "wrap",
            marginTop: "var(--sa-stack-24)",
            padding: "var(--sa-padding-24)",
            background: "var(--sa-bg-neutral-subtler)",
            borderRadius: "var(--sa-shape-12)",
          }}
        >
          <Button variant="primary" appearance="filled" size="sm">
            Small &mdash; 32px
          </Button>
          <Button variant="primary" appearance="filled" size="md">
            Medium &mdash; 40px
          </Button>
          <Button variant="primary" appearance="filled" size="lg">
            Large &mdash; 48px
          </Button>
        </div>
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
              type: '"primary" | "success" | "danger" | "neutral"',
              default: '"primary"',
              description: "Semantic colour role / intent of the action.",
            },
            {
              name: "appearance",
              type: '"filled" | "outlined" | "text"',
              default: '"filled"',
              description:
                "Visual weight. outlined = secondary, text = ghost (tertiary). tonal was retired on 2026-08-27 (no perceivable edge — 1.21:1 to 1.52:1 against a 3:1 requirement). For a solid brand-colour surface use tone, not an appearance.",
            },
            {
              name: "tone",
              type: '"default" | "inverse"',
              default: '"default"',
              description:
                "Which ground the button sits on. inverse is for a solid brand-colour surface — a navy header, the ticker bar. It CROSSES appearance, which is the point: as two appearance words (inverse/inverseOutlined) it could only have one look, so all four variants painted the same white-alpha border and danger silently lost its signal. Those two words still work as deprecated aliases.",
            },
            {
              name: "loading",
              type: "boolean",
              default: "false",
              description:
                "Sets aria-busy, disables the control so a form cannot be submitted twice, and shows a spinner in the LEADING ICON’S place so the button does not change width mid-press. It does NOT swap the label — pass “Submitting…” yourself, because a control that loses its name mid-action is unusable with a screen reader. A busy button keeps full opacity with cursor: progress rather than the disabled wash: “working” and “forbidden” must not look the same.",
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
          Buttons are government-grade controls — they must satisfy{" "}
          <strong>WCAG 2.2 AA</strong> and GIGW. Where an entry below records a gap,
          it is a gap: this checklist is a statement of what is true, not of what
          was intended.
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
                criterion: "24×24px minimum target size",
                level: "AA",
                description:
                  "All three sizes (32 / 40 / 48px) clear the 24×24px Level AA minimum. 44×44 is 2.5.5 Target Size (Enhanced), Level AAA, which only lg reaches — UX4G recommends it for touch. (WCAG 2.2 §2.5.8)",
              },
              {
                criterion: "Text resizes to 200% without clipping",
                level: "AA",
                description:
                  "Each size sets min-height plus vertical padding, so the box grows with the text. A fixed height clipped the label until 2026-08-27 — an md button held 40px while its content needed 41. Pinned at the criterion's own 200% threshold in e2e/design-system/button.spec.ts. (WCAG 1.4.4)",
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
                  "A disabled <button> uses the native disabled attribute, which removes it from the tab order. With href the component renders an <a> and DROPS the href, setting aria-disabled=\"true\" and role=\"link\" — an anchor without href is not focusable and not activatable, so the two paths carry the same semantics. Until 2026-08-27 it emitted <a disabled>, which the browser ignores entirely. (WCAG 4.1.2)",
              },
              {
                criterion: "Loading state — NOT IMPLEMENTED",
                level: "AA",
                description:
                  "NOT IMPLEMENTED. The component has no loading state and sets no aria-busy; a consumer must pass aria-busy itself. This checklist claimed otherwise until 2026-08-25.",
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
          <StateRow state="Disabled" note="Reduced opacity; the native disabled attribute takes it out of the tab order. No aria-disabled is set — and none is needed on a <button>.">
            <Button variant="primary" appearance="filled" disabled data-testid="btn-disabled">
              Submit application
            </Button>
          </StateRow>
          <StateRow state="Disabled link" note="A link-button carries the SAME disabled semantics as a button, which is the whole point: an <a> cannot use the native disabled attribute, so the component drops href entirely and sets aria-disabled. Without href an anchor is not focusable and not activatable, so no click-swallowing is needed and none is done.">
            <Button
              variant="primary"
              appearance="filled"
              href="/design-system/components/actions/button"
              disabled
              data-testid="btn-disabled-link"
            >
              Continue to eligibility
            </Button>
          </StateRow>
          <StateRow state="Loading" note="loading sets aria-busy and disables the control, so a form cannot be submitted twice while the first submission is in flight. It deliberately does NOT swap the label — a control that loses its name mid-action is unusable with a screen reader, so pass “Submitting…” yourself.">
            <Button variant="primary" appearance="filled" loading data-testid="btn-loading">
              Submitting…
            </Button>
          </StateRow>
          <StateRow state="Inverse tone" note="tone=&quot;inverse&quot; crosses appearance, so each variant keeps its own intent on a brand surface. Until 2026-08-27 the outlined form painted the same white-alpha border for all four — and at 2.25:1 on this background it was not a findable edge either. It paints in the portal login shell’s “Signing Into” bar, here, and in Storybook; the Ticker’s route-out strips its border in ticker.css and renders as a text link.">
            <div
              data-testid="inverse-strip"
              style={{
                display: "flex",
                gap: "var(--sa-inline-8)",
                padding: "var(--sa-padding-16)",
                background: "var(--sa-color-primaryScale-600)",
                borderRadius: "var(--sa-shape-8)",
                flexWrap: "wrap",
              }}
            >
              {(["primary", "success", "danger", "neutral"] as const).map((v) => (
                <Button key={v} variant={v} tone="inverse" appearance="outlined" data-testid={`inv-${v}`}>
                  {v}
                </Button>
              ))}
            </div>
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
