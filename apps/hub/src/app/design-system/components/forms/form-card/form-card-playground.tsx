"use client";
import * as React from "react";
import {
  Badge,
  Button,
  Checkbox,
  DocumentTile,
  DocumentTiles,
  FormCard,
  FormPanel,
} from "@mosje/design-system";

/**
 * Specimen: a sub-section whose body is not a field grid — here, document tiles — inside
 * the one panel of a step. The head's optional parts are switchable.
 */
export function FormCardPlayground(): React.JSX.Element {
  const [hasDescription, setHasDescription] = React.useState(false);
  const [isRequired, setIsRequired] = React.useState(true);
  const [hasActions, setHasActions] = React.useState(true);
  const [hasBadge, setHasBadge] = React.useState(false);

  return (
    <div className="fcp">
      <div className="fcp__controls">
        <Checkbox
          label="Lead Sentence"
          size="sm"
          checked={hasDescription}
          onCheckedChange={setHasDescription}
        />
        <Checkbox label="Required Marker" size="sm" checked={isRequired} onCheckedChange={setIsRequired} />
        <Checkbox label="Head Action" size="sm" checked={hasActions} onCheckedChange={setHasActions} />
        <Checkbox label="Badge" size="sm" checked={hasBadge} onCheckedChange={setHasBadge} />
      </div>

      <FormPanel as={3} title="Upload Documents" description="Attach each document as a PDF, JPG or PNG.">
        <FormCard
          as={4}
          title="Identity Documents"
          required={isRequired}
          badge={hasBadge ? <Badge status="success">DigiLocker</Badge> : undefined}
          description={
            hasDescription
              ? "Provide income certificates only for the members declared in Step 4."
              : undefined
          }
          actions={
            hasActions ? (
              <Button type="button" appearance="text" size="sm">
                Edit
              </Button>
            ) : undefined
          }
        >
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
              meta="PDF, JPG or PNG · up to 2 MB"
              actions={
                <Button type="button" appearance="outlined" size="sm">
                  Browse File
                </Button>
              }
            />
          </DocumentTiles>
        </FormCard>
      </FormPanel>

      <style>{`
        .fcp {
          display: flex;
          flex-direction: column;
          gap: var(--sa-stack-24);
          padding: var(--sa-padding-24);
          background: var(--sa-bg-neutral-subtle);
          border-radius: var(--sa-shape-8);
        }
        .fcp__controls {
          display: flex;
          flex-wrap: wrap;
          gap: var(--sa-inline-16);
        }
        @media (max-width: 767px) {
          .fcp { padding: var(--sa-padding-12); }
        }
      `}</style>
    </div>
  );
}
