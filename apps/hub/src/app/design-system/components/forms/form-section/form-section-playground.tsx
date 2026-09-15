"use client";
import * as React from "react";
import {
  Badge,
  Button,
  Checkbox,
  FormField,
  FormPanel,
  FormSection,
  Input,
  Textarea,
} from "@mosje/design-system";

const COLUMNS = [1, 2, 3, 4] as const;
type Columns = (typeof COLUMNS)[number];

/**
 * Specimen: two sub-sections inside the one panel of a step, as the handoff draws every
 * form — the column count, the badge, the head action and the lead sentence switchable.
 */
export function FormSectionPlayground(): React.JSX.Element {
  const [columns, setColumns] = React.useState<Columns>(3);
  const [hasDescription, setHasDescription] = React.useState(false);
  const [hasBadge, setHasBadge] = React.useState(true);
  const [hasActions, setHasActions] = React.useState(false);

  return (
    <div className="fsp">
      <div className="fsp__controls">
        <fieldset className="fsp__group">
          <legend className="fsp__legend">Columns</legend>
          {COLUMNS.map((n) => (
            <Button
              key={n}
              type="button"
              size="sm"
              appearance={columns === n ? "filled" : "outlined"}
              aria-pressed={columns === n}
              onClick={() => setColumns(n)}
            >
              {String(n)}
            </Button>
          ))}
        </fieldset>
        <Checkbox label="Badge" size="sm" checked={hasBadge} onCheckedChange={setHasBadge} />
        <Checkbox label="Head Action" size="sm" checked={hasActions} onCheckedChange={setHasActions} />
        <Checkbox
          label="Lead Sentence"
          size="sm"
          checked={hasDescription}
          onCheckedChange={setHasDescription}
        />
      </div>

      <FormPanel
        as={3}
        title="Basic Identity Details"
        description="Enter the details as they appear on the Aadhaar card."
      >
        <FormSection
          as={4}
          title="Verified Identity"
          columns={columns}
          badge={hasBadge ? <Badge status="success">DigiLocker</Badge> : undefined}
          actions={
            hasActions ? (
              <Button type="button" appearance="text" size="sm">
                Edit
              </Button>
            ) : undefined
          }
          description={
            hasDescription ? "Fields fetched from DigiLocker cannot be changed on this form." : undefined
          }
        >
          <FormField label="Full Name" required>
            {(p) => <Input {...p} defaultValue="Sunita Deshmukh" readOnly />}
          </FormField>
          <FormField label="Date of Birth" required>
            {(p) => <Input {...p} defaultValue="14/03/1991" readOnly />}
          </FormField>
          <FormField label="Gender" required>
            {(p) => <Input {...p} defaultValue="Female" readOnly />}
          </FormField>
          <FormField label="Aadhaar Number" required>
            {(p) => <Input {...p} defaultValue="XXXX XXXX 4821" readOnly />}
          </FormField>
        </FormSection>

        <FormSection as={4} title="Contact Details" columns={columns}>
          <FormField label="Mobile Number" required>
            {(p) => <Input {...p} defaultValue="9890001234" inputMode="numeric" />}
          </FormField>
          <FormField label="Email Address">
            {(p) => <Input {...p} type="email" placeholder="name@example.in" />}
          </FormField>
          <FormField label="Correspondence Address" required className="ds-form-span-full">
            {(p) => (
              <Textarea {...p} rows={2} defaultValue="Flat 3, Shivneri Apartments, Kothrud, Pune 411038" />
            )}
          </FormField>
        </FormSection>
      </FormPanel>

      <style>{`
        .fsp {
          display: flex;
          flex-direction: column;
          gap: var(--sa-stack-24);
          padding: var(--sa-padding-24);
          background: var(--sa-bg-neutral-subtle);
          border-radius: var(--sa-shape-8);
        }
        .fsp__controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--sa-inline-16);
        }
        .fsp__group {
          display: flex;
          flex-wrap: wrap;
          min-width: 0;
          align-items: center;
          gap: var(--sa-inline-8);
          margin: 0;
          padding: 0;
          border: 0;
        }
        .fsp__legend {
          float: left;
          margin-right: var(--sa-inline-8);
          font-size: var(--sa-type-label-1-size);
          line-height: var(--sa-type-label-1-lh);
          font-weight: var(--sa-font-weight-semibold);
          color: var(--sa-text-neutral-base);
        }
        @media (max-width: 767px) {
          .fsp { padding: var(--sa-padding-12); }
        }
      `}</style>
    </div>
  );
}
