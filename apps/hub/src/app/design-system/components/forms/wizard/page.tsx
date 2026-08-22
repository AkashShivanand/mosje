import * as React from "react";
import type { Metadata } from "next";
import { WizardPlayground } from "./wizard-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Wizard - SAMAVESH Design System",
  description:
    "A shared multi-step form shell with a Stepper, navigation controls, and accessibility wiring.",
};

export default function WizardPage(): React.JSX.Element {
  const sectionStyle: React.CSSProperties = {
    marginTop: "var(--sa-stack-48)",
    paddingTop: "var(--sa-stack-48)",
    borderTop: "1px solid var(--sa-border-neutral-subtle)",
  };
  const h2Style: React.CSSProperties = {
    fontSize: "var(--sa-type-headline-2-size)",
    fontWeight: 600,
    margin: "0 0 var(--sa-stack-24) 0",
    color: "var(--sa-text-neutral-bolder)",
  };
  const proseStyle: React.CSSProperties = {
    color: "var(--sa-text-neutral-base)",
    fontSize: "var(--sa-type-body-1-size)",
    lineHeight: 1.6,
  };
  const leadStyle: React.CSSProperties = {
    ...proseStyle,
    fontSize: "var(--sa-type-headline-3-size)",
    color: "var(--sa-text-neutral-subtle)",
    marginBottom: "var(--sa-stack-24)",
  };

  return (
    <main
      className="ds-prose"
      style={{
        maxWidth: "800px",
        padding: "var(--sa-padding-40) var(--sa-padding-24)",
      }}
    >
      {/* ============ HEADER ============ */}
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1
          style={{
            fontSize: "var(--sa-type-headline-1-size)",
            margin: "0 0 var(--sa-stack-16) 0",
          }}
        >
          Wizard
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A robust multi-step form shell providing a Stepper, step body, navigation controls, and essential focus management. 
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Navigate through the steps to see the focus management in action.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <WizardPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          The Wizard component orchestrates the UI for complex forms broken down into multiple steps. It leaves state management (validation, the current step index) up to you, focusing entirely on layout and accessibility.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--sa-inline-24)",
            marginTop: "var(--sa-stack-24)",
          }}
        >
          <DoDont
            cards={[
              {
                type: "do",
                label: "Use the `error` prop to display a summary alert of validation failures when a user tries to proceed.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't hardcode your own navigation buttons at the bottom of the form. Use the built-in `onNext` and `onBack` handlers.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>

      {/* ============ 2. CODE EXAMPLE ============ */}
      <section style={sectionStyle}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <Playground
          code={`function MultiStepForm() {
  const [step, setStep] = React.useState(0);
  const steps = [{ label: "Details" }, { label: "Documents" }, { label: "Review" }];

  return (
    <Wizard
      steps={steps}
      current={step}
      onNext={() => setStep((s) => s + 1)}
      onBack={() => setStep((s) => s - 1)}
      onSubmit={() => console.log("Form submitted")}
    >
      <div className="step-content">
        {step === 0 && <FormSection title="Details">...</FormSection>}
        {step === 1 && <FormSection title="Uploads">...</FormSection>}
        {step === 2 && <ReviewSection title="Review">...</ReviewSection>}
      </div>
    </Wizard>
  );
}`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Focus Management:</strong> When moving between steps, the Wizard automatically moves keyboard focus to the main step body container. This ensures screen readers announce the new step content instead of getting stuck on the 'Continue' button.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Live Regions:</strong> Uses <code>aria-live="polite"</code> to announce step changes (e.g., "Step 2 of 3: Documents") to screen readers as they occur.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "steps", type: "StepperStep[]", required: true, description: "Step definitions (label + optional description) for the Stepper." },
            { name: "current", type: "number", required: true, description: "0-based index of the active step." },
            { name: "onBack", type: "() => void", required: true, description: "Called when 'Back' is clicked." },
            { name: "onNext", type: "() => void", required: true, description: "Called when 'Continue' is clicked." },
            { name: "onSubmit", type: "() => void", required: true, description: "Called when 'Submit' is clicked on the final step." },
            { name: "error", type: "string", description: "Error summary message shown in an alert above the actions." },
            { name: "errorRef", type: "Ref<HTMLDivElement>", description: "Ref to the error container for focus management." },
            { name: "children", type: "ReactNode", required: true, description: "The current step body." },
          ]}
        />
      </section>
    </main>
  );
}
