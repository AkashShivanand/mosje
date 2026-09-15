"use client";
import * as React from "react";
import {
  Badge,
  Button,
  Checkbox,
  DeclarationCheckbox,
  DocumentTile,
  DocumentTiles,
  FormCard,
  FormField,
  FormSection,
  Input,
  ReviewItem,
  ReviewSection,
  Select,
  Wizard,
} from "@mosje/design-system";

const STEPS = [
  {
    label: "Basic Details",
    description: "Enter the applicant's details as they appear on the Aadhaar card.",
  },
  { label: "Documents", description: "Attach each document as a PDF, JPG or PNG." },
  { label: "Review", description: "Please verify all details before final submission." },
];

/**
 * Specimen: a three-step application in the handoff's grammar — the stepper on the page
 * ground, one panel per step, sub-sections that are not cards, Cancel on the first step
 * and Submit Application on the last.
 */
export function WizardPlayground(): React.JSX.Element {
  const [current, setCurrent] = React.useState(0);
  const [hasError, setHasError] = React.useState(false);
  const [declared, setDeclared] = React.useState(false);
  const errorRef = React.useRef<HTMLDivElement>(null);

  const go = (step: number) => {
    setCurrent(step);
    setHasError(false);
  };

  const edit = (step: number) => (
    <Button type="button" appearance="text" size="sm" onClick={() => go(step)}>
      Edit
    </Button>
  );

  return (
    <div className="wzp">
      <div className="wzp__controls">
        <Checkbox label="Show Error Summary" size="sm" checked={hasError} onCheckedChange={setHasError} />
      </div>

      <Wizard
        steps={STEPS}
        current={current}
        nextLabel="Save and Continue"
        submitLabel="Submit Application"
        onCancel={() => go(0)}
        onBack={() => go(Math.max(0, current - 1))}
        onNext={() => go(Math.min(STEPS.length - 1, current + 1))}
        onSubmit={() => {
          setDeclared(false);
          go(0);
        }}
        nextDisabled={current === STEPS.length - 1 && !declared}
        nextBlockedReason="Accept the declaration to submit the application."
        title={
          current === 0 ? "Basic Identity Details" : current === 2 ? "Review Application Details" : undefined
        }
        headerActions={
          current === 0 ? (
            <Button type="button" appearance="text" size="sm">
              Fetch from DigiLocker
            </Button>
          ) : undefined
        }
        error={hasError ? "Enter the applicant's mobile number before continuing." : undefined}
        errorRef={errorRef}
      >
        {current === 0 && (
          <>
            <FormSection title="Personal Details">
              <FormField label="Full Name" required>
                {(p) => <Input {...p} defaultValue="Sunita Deshmukh" />}
              </FormField>
              <FormField label="Date of Birth" required>
                {(p) => <Input {...p} defaultValue="14/03/1991" inputMode="numeric" />}
              </FormField>
              <FormField label="Gender" required>
                {(p) => (
                  <Select
                    {...p}
                    defaultValue="f"
                    options={[
                      { label: "Female", value: "f" },
                      { label: "Male", value: "m" },
                      { label: "Transgender", value: "t" },
                    ]}
                  />
                )}
              </FormField>
            </FormSection>
            <FormSection title="Contact Details">
              <FormField label="Mobile Number" required>
                {(p) => <Input {...p} inputMode="numeric" />}
              </FormField>
              <FormField label="Email Address">{(p) => <Input {...p} type="email" />}</FormField>
              <FormField label="District" required>
                {(p) => <Input {...p} defaultValue="Pune" />}
              </FormField>
            </FormSection>
          </>
        )}

        {current === 1 && (
          <FormCard title="Identity Documents">
            <DocumentTiles>
              <DocumentTile
                title="Aadhaar Card"
                required
                state="verified"
                meta="Linked via DigiLocker"
                actions={<Badge status="success">Verified</Badge>}
              />
              <DocumentTile
                title="Income Certificate"
                required
                state="uploaded"
                meta="income-certificate-2026.pdf · 184 KB"
                actions={
                  <Button type="button" appearance="outlined" size="sm">
                    Change
                  </Button>
                }
              />
            </DocumentTiles>
          </FormCard>
        )}

        {current === 2 && (
          <>
            <ReviewSection title="Basic Details" columns={4} actions={edit(0)}>
              <ReviewItem label="Full Name" value="Sunita Deshmukh" />
              <ReviewItem label="Date of Birth" value="14/03/1991" />
              <ReviewItem label="Gender" value="Female" />
              <ReviewItem label="Mobile Number" />
            </ReviewSection>
            <ReviewSection title="Documents" columns={2} actions={edit(1)}>
              <ReviewItem label="Aadhaar Card" value="Linked via DigiLocker" />
              <ReviewItem label="Income Certificate" value="income-certificate-2026.pdf" />
            </ReviewSection>
            <DeclarationCheckbox checked={declared} onChange={setDeclared}>
              <ul>
                <li>The information given in this application is true to the best of my knowledge.</li>
                <li>I have not received assistance for the same purpose under any other scheme.</li>
              </ul>
            </DeclarationCheckbox>
          </>
        )}
      </Wizard>

      <style>{`
        .wzp {
          display: flex;
          flex-direction: column;
          gap: var(--sa-stack-24);
          padding: var(--sa-padding-24);
          background: var(--sa-bg-neutral-subtle);
          border-radius: var(--sa-shape-8);
        }
        .wzp__controls {
          display: flex;
          flex-wrap: wrap;
          gap: var(--sa-inline-16);
        }
        @media (max-width: 767px) {
          .wzp { padding: var(--sa-padding-12); }
        }
      `}</style>
    </div>
  );
}
