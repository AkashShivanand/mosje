"use client";
import * as React from "react";
import {
  Button,
  Checkbox,
  FormField,
  FormPanel,
  FormSection,
  Icon,
  Input,
  Select,
  Textarea,
} from "@mosje/design-system";

type Position = "first" | "middle" | "last";

const POSITIONS: { value: Position; label: string }[] = [
  { value: "first", label: "First Step" },
  { value: "middle", label: "Later Step" },
  { value: "last", label: "Final Step" },
];

/**
 * Specimen: one wizard step as the handoff draws it — a single panel holding two
 * sub-sections, with the action band that changes by the step's position.
 */
export function FormPanelPlayground(): React.JSX.Element {
  const [position, setPosition] = React.useState<Position>("first");
  const [hasDescription, setHasDescription] = React.useState(true);
  const [hasAction, setHasAction] = React.useState(false);

  const leading =
    position === "first" ? (
      <Button type="button" appearance="outlined">
        Cancel
      </Button>
    ) : (
      <Button type="button" appearance="outlined" iconLeft={<Icon name="arrow_back" size={20} />}>
        Back
      </Button>
    );
  const trailing =
    position === "last" ? (
      <Button type="button">Submit Application</Button>
    ) : (
      <Button type="button" iconRight={<Icon name="arrow_forward" size={20} />}>
        Save and Continue
      </Button>
    );

  return (
    <div className="fpp">
      <div className="fpp__controls">
        <fieldset className="fpp__positions">
          <legend className="fpp__legend">Step Position</legend>
          {POSITIONS.map((p) => (
            <Button
              key={p.value}
              type="button"
              size="sm"
              appearance={position === p.value ? "filled" : "outlined"}
              aria-pressed={position === p.value}
              onClick={() => setPosition(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </fieldset>
        <Checkbox
          label="Description"
          size="sm"
          checked={hasDescription}
          onCheckedChange={setHasDescription}
        />
        <Checkbox label="Head Action" size="sm" checked={hasAction} onCheckedChange={setHasAction} />
      </div>

      <FormPanel
        as={3}
        title="Basic Identity Details"
        description={
          hasDescription ? "Enter the applicant's details as they appear on the Aadhaar card." : undefined
        }
        actions={
          hasAction ? (
            <Button type="button" appearance="text" size="sm">
              Fetch from DigiLocker
            </Button>
          ) : undefined
        }
        footer={
          <>
            {leading}
            {trailing}
          </>
        }
      >
        <FormSection title="Personal Details" as={4}>
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
        <FormSection title="Address" as={4}>
          <FormField label="State" required>
            {(p) => <Input {...p} defaultValue="Maharashtra" />}
          </FormField>
          <FormField label="District" required>
            {(p) => <Input {...p} defaultValue="Pune" />}
          </FormField>
          <FormField label="PIN Code" required>
            {(p) => <Input {...p} defaultValue="411038" inputMode="numeric" />}
          </FormField>
          <FormField label="Address" required className="ds-form-span-full">
            {(p) => <Textarea {...p} rows={2} defaultValue="Flat 3, Shivneri Apartments, Kothrud" />}
          </FormField>
        </FormSection>
      </FormPanel>

      <style>{`
        .fpp {
          display: flex;
          flex-direction: column;
          gap: var(--sa-stack-24);
          padding: var(--sa-padding-24);
          background: var(--sa-bg-neutral-subtle);
          border-radius: var(--sa-shape-8);
        }
        .fpp__controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--sa-inline-16);
        }
        .fpp__positions {
          display: flex;
          min-width: 0;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--sa-inline-8);
          margin: 0;
          padding: 0;
          border: 0;
        }
        .fpp__legend {
          float: left;
          margin-right: var(--sa-inline-8);
          font-size: var(--sa-type-label-1-size);
          line-height: var(--sa-type-label-1-lh);
          font-weight: var(--sa-font-weight-semibold);
          color: var(--sa-text-neutral-base);
        }
        @media (max-width: 767px) {
          .fpp { padding: var(--sa-padding-12); }
        }
      `}</style>
    </div>
  );
}
