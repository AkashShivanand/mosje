"use client";
import * as React from "react";
import { Badge, Button, DocumentTile, DocumentTiles, FormCard, Icon, IconButton } from "@mosje/design-system";

/**
 * Specimen: the four states on an upload step, then the review form. The first tile is
 * live — Browse File attaches a file and Remove takes it off again — so the move from
 * Upcoming to Uploaded can be seen rather than read about. Nothing here can move a tile
 * to Verified: only an officer or DigiLocker does that.
 */
export function DocumentTilePlayground(): React.JSX.Element {
  const [attached, setAttached] = React.useState(false);
  const browseRef = React.useRef<HTMLButtonElement>(null);
  const changeRef = React.useRef<HTMLButtonElement>(null);
  const moved = React.useRef(false);

  /* The tile swaps its controls, so focus follows to the control that replaced the one pressed. */
  React.useEffect(() => {
    if (!moved.current) return;
    (attached ? changeRef : browseRef).current?.focus();
  }, [attached]);

  const toggle = (next: boolean) => {
    moved.current = true;
    setAttached(next);
  };

  return (
    <div className="dtp">
      <FormCard title="Upload Documents" as={3}>
        <DocumentTiles>
          {attached ? (
            <DocumentTile
              title="Income Certificate"
              required
              state="uploaded"
              meta="income-certificate-2026.pdf · 184 KB"
              actions={
                <>
                  <Button ref={changeRef} type="button" appearance="outlined" size="sm">
                    Change
                  </Button>
                  <IconButton
                    type="button"
                    appearance="text"
                    size="sm"
                    icon={<Icon name="delete" size={20} />}
                    aria-label="Remove Income Certificate"
                    onClick={() => toggle(false)}
                  />
                </>
              }
            />
          ) : (
            <DocumentTile
              title="Income Certificate"
              required
              state="upcoming"
              meta="PDF, JPG or PNG · up to 2 MB"
              actions={
                <Button
                  ref={browseRef}
                  type="button"
                  appearance="outlined"
                  size="sm"
                  onClick={() => toggle(true)}
                >
                  Browse File
                </Button>
              }
            />
          )}
          <DocumentTile
            title="Bank Passbook"
            state="uploaded"
            meta="passbook-front-page.jpg · 612 KB"
            actions={
              <>
                <Button type="button" appearance="outlined" size="sm">
                  Change
                </Button>
                <IconButton
                  type="button"
                  appearance="text"
                  size="sm"
                  icon={<Icon name="delete" size={20} />}
                  aria-label="Remove Bank Passbook"
                />
              </>
            }
          />
          <DocumentTile
            title="Aadhaar Card"
            required
            state="verified"
            meta="Linked via DigiLocker"
            actions={<Badge status="success">Verified</Badge>}
          />
          <DocumentTile
            title="Caste Certificate"
            required
            state="invalid"
            meta="The certificate number does not match the issuing authority's register."
            actions={
              <Button type="button" appearance="outlined" size="sm">
                Replace File
              </Button>
            }
          />
        </DocumentTiles>
      </FormCard>

      <FormCard title="Documents" as={3} description="The same tiles on a review step.">
        <DocumentTiles>
          <DocumentTile
            title="Income Certificate"
            state="uploaded"
            icon={<Icon name="description" size={24} />}
            meta="income-certificate-2026.pdf"
            actions={
              <Button type="button" appearance="text" size="sm" aria-label="View Income Certificate">
                View
              </Button>
            }
          />
          <DocumentTile
            title="Aadhaar Card"
            state="verified"
            icon={<Icon name="description" size={24} />}
            meta="Linked via DigiLocker"
            actions={
              <Button type="button" appearance="text" size="sm" aria-label="View Aadhaar Card">
                View
              </Button>
            }
          />
        </DocumentTiles>
      </FormCard>

      <style>{`
        .dtp {
          display: flex;
          flex-direction: column;
          gap: var(--sa-stack-32);
          padding: var(--sa-padding-24);
          background: var(--sa-bg-neutral-base);
          border: 1px solid var(--sa-border-neutral-subtle);
          border-radius: var(--sa-shape-8);
        }
        @media (max-width: 767px) {
          .dtp { padding: var(--sa-padding-12); }
        }
      `}</style>
    </div>
  );
}
