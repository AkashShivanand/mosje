"use client";

/**
 * The demo dock's "Errors" tab: make the NEXT request at one place fail with one catalogued error,
 * so every failure state can be seen in a browser without breaking anything
 * (`data-state-completeness.md` §7).
 *
 * DS Audit: Accordion ✅ · AccordionItem ✅ · Badge ✅ · Button ✅ · ListGroup / ListRow ✅ — nothing new.
 *
 * The flag lives in sessionStorage (`error-catalogue.ts` `armFailure`) and is honoured once by the
 * screen's simulated request layer (`takeFailure`), so "Try Again" on the failure succeeds.
 * Grouped by where the failure occurs — the question a reviewer arrives with is "what can go wrong
 * on THIS screen", not "what is error nine".
 */

import * as React from "react";
import { Accordion, AccordionItem, Badge, Button, ListGroup, ListRow } from "@mosje/design-system";
import {
  DEMO_FAIL_EVENT,
  ERROR_OCCASIONS,
  armFailure,
  catalogueEntry,
  entriesAt,
  readArmedFailure,
  type ArmedFailure,
  type RenderTarget,
} from "@/lib/e-anudaan/error-catalogue";

const TARGET_WORDS: Record<RenderTarget, string> = {
  inline: "Inline message",
  summary: "Error summary",
  banner: "Banner",
  toast: "Toast",
  page: "Full page",
};

export function DemoErrorsPanel() {
  const [armed, setArmed] = React.useState<ArmedFailure | null>(null);

  React.useEffect(() => {
    const sync = () => setArmed(readArmedFailure());
    sync();
    window.addEventListener(DEMO_FAIL_EVENT, sync);
    return () => window.removeEventListener(DEMO_FAIL_EVENT, sync);
  }, []);

  const armedEntry = armed ? catalogueEntry(armed.id) : undefined;
  const armedPlace = armed ? ERROR_OCCASIONS.find((o) => o.id === armed.occasion) : undefined;

  return (
    <div className="space-y-3">
      <p className="text-body-2 text-ink-muted">
        Makes the next request at one place fail with the chosen error, once. Then do the action named
        under the group.
      </p>

      {armedEntry && armedPlace ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-body-2">
            <Badge status="warning">Armed</Badge> {armedEntry.title} · {armedPlace.label}
          </span>
          <Button appearance="text" size="sm" onClick={() => armFailure(null)}>
            Clear
          </Button>
        </div>
      ) : (
        <p className="text-body-3 text-ink-muted">Nothing armed. Requests succeed.</p>
      )}

      <Accordion>
        {ERROR_OCCASIONS.map((o) => (
          <AccordionItem
            key={o.id}
            title={
              <span className="flex w-full flex-wrap items-center justify-between gap-2 pr-2">
                <span className="text-body-2 font-semibold">{o.label}</span>
                <span className="text-body-3 text-ink-muted">{entriesAt(o.id).length} errors</span>
              </span>
            }
          >
            <p className="mb-2 text-body-3 text-ink-muted">Trigger: {o.where}.</p>
            <ListGroup bordered size="sm" aria-label={`Errors at ${o.label}`}>
              {entriesAt(o.id).map((e) => {
                const isArmed = armed?.id === e.id && armed.occasion === o.id;
                return (
                  <ListRow
                    key={e.id}
                    title={e.title}
                    description={TARGET_WORDS[e.renderIn[o.id]!]}
                    trailing={
                      isArmed ? (
                        <Badge status="warning">Armed</Badge>
                      ) : (
                        <Button appearance="outlined" size="sm" nowrap onClick={() => armFailure({ id: e.id, occasion: o.id })} aria-label={`Fail next ${o.label} with: ${e.title}`}>
                          Fail Next
                        </Button>
                      )
                    }
                  />
                );
              })}
            </ListGroup>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
