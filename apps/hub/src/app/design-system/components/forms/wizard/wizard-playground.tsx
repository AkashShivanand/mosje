"use client";
import * as React from "react";
import { Wizard, FormSection, FormField, Input } from "@mosje/design-system";

export function WizardPlayground() {
  const [current, setCurrent] = React.useState(0);
  const [hasError, setHasError] = React.useState(false);
  const steps = [
    { label: "Personal Details" },
    { label: "Contact Info" },
    { label: "Review" }
  ];

  const handleNext = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
      setHasError(false);
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setHasError(false);
    }
  };

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
      }}
    >
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap", marginBottom: "var(--sa-stack-16)" }}>
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasError} 
            onChange={(e) => setHasError(e.target.checked)} 
          />
          <strong>Simulate Error on current step</strong>
        </label>
      </div>

      <div style={{ width: "100%", border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: "var(--sa-shape-8)", overflow: "hidden" }}>
        <Wizard
          steps={steps}
          current={current}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={() => alert("Wizard submitted!")}
          error={hasError ? "Please fix the validation errors before continuing." : undefined}
        >
          <div style={{ padding: "var(--sa-padding-32)" }}>
            {current === 0 && (
              <FormSection title="Personal Details" columns={1}>
                <FormField label="Full Name">
                  {(props) => <Input {...props} placeholder="Enter name" />}
                </FormField>
              </FormSection>
            )}
            
            {current === 1 && (
              <FormSection title="Contact Info" columns={1}>
                <FormField label="Email Address">
                  {(props) => <Input {...props} placeholder="Enter email" />}
                </FormField>
              </FormSection>
            )}
            
            {current === 2 && (
              <FormSection title="Review" columns={1}>
                <p style={{ color: "var(--sa-text-neutral-subtle)" }}>Please review your details before submitting.</p>
              </FormSection>
            )}
          </div>
        </Wizard>
      </div>
    </div>
  );
}
