"use client";

/**
 * The demo dock's document states, beside the Fill scenarios: force one document — or every
 * document — on the Upload Documents step into any state the Document Centre draws, so each can be
 * shown and reviewed without staging files (spec §3.2; data-state-completeness.md §7, "each state
 * seen in a browser").
 *
 * DS Audit: Select ✅ · Button ✅ · FormField ✅ — nothing new.
 */

import * as React from "react";
import { Button, FormField, Select } from "@mosje/design-system";
import {
  DEMO_DOC_STATE_EVENT,
  DOC_LIST_EVENT,
  DOC_STATE_META,
  type DemoDocStateDetail,
  type DocListDetail,
  type DocState,
} from "@/lib/e-anudaan/document-centre";

const STATES: { state: DocState; label: string }[] = [
  { state: "missing", label: "Not uploaded" },
  { state: "uploading", label: "Uploading" },
  { state: "failed", label: "Upload failed" },
  { state: "rejected-type", label: "Refused — wrong type" },
  { state: "rejected-size", label: "Refused — too large" },
  { state: "checking", label: "Checking" },
  { state: "verified", label: DOC_STATE_META.verified.words },
  { state: "review", label: DOC_STATE_META.review.words },
  { state: "invalid", label: DOC_STATE_META.invalid.words },
  { state: "unavailable", label: "Check unavailable" },
];

export function DemoDocumentStates() {
  const [list, setList] = React.useState<DocListDetail | null>(() =>
    typeof window === "undefined" ? null : ((window as unknown as { __eAnudaanDocList?: DocListDetail }).__eAnudaanDocList ?? null),
  );
  const [target, setTarget] = React.useState<string>("all");

  React.useEffect(() => {
    const on = (e: Event) => setList((e as CustomEvent<DocListDetail>).detail);
    window.addEventListener(DOC_LIST_EVENT, on);
    return () => window.removeEventListener(DOC_LIST_EVENT, on);
  }, []);

  if (!list) {
    return <p className="text-body-2 text-ink-muted">Open the Upload Documents step to force a document into a state.</p>;
  }

  const force = (state: DocState) =>
    window.dispatchEvent(
      new CustomEvent<DemoDocStateDetail>(DEMO_DOC_STATE_EVENT, { detail: { n: target === "all" ? "all" : Number(target), state } }),
    );

  return (
    <div className="space-y-3">
      <FormField id="demo-doc-target" label="Document">
        {(c) => (
          <Select {...c} size="sm" value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="all">Every document</option>
            {list.documents.map((d, i) => (
              <option key={d.n} value={String(d.n)}>
                {i + 1}. {d.title}
              </option>
            ))}
          </Select>
        )}
      </FormField>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Force a state">
        {STATES.map((s) => (
          <Button key={s.state} appearance="outlined" size="sm" onClick={() => force(s.state)}>
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
