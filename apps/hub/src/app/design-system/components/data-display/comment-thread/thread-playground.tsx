"use client";
import * as React from "react";
import { CommentThread, type ThreadComment } from "@mosje/design-system";

const REMARKS: ThreadComment[] = [
  { id: "1", at: "2026-09-01T10:12:00+05:30", author: "R. Krishnan", authorRole: "District Nodal Officer",
    body: "The income certificate attached is issued by the block office. Scheme guidelines require one issued by the tehsildar." },
  { id: "2", at: "2026-09-02T16:40:00+05:30", author: "Meena Kumari", authorRole: "Applicant",
    body: "The tehsildar's office has issued the certificate today. I have uploaded it in place of the earlier one." },
];

const CELL: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" };
const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

/** Every arrangement: open, closed, empty, and a short cap so the counter shows. */
export function ThreadPlayground(): React.JSX.Element {
  const [remarks, setRemarks] = React.useState(REMARKS);
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={CELL}>
        <CommentThread
          comments={remarks}
          label="Remarks on this application"
          onSubmit={(text) =>
            setRemarks((all) => [
              ...all,
              { id: String(all.length + 1), at: new Date().toISOString(), author: "You", authorRole: "Scrutiny Officer", body: text },
            ])
          }
        />
        <p style={CAPTION}>Oldest first — a thread is a conversation and is read downward.</p>
      </div>
      <div style={CELL}>
        <CommentThread
          comments={remarks}
          label="Remarks on this application"
          closedReason="This application was approved on 4 September 2026. Remarks are closed."
        />
        <p style={CAPTION}>A closed thread states its reason where the box used to be, rather than hiding it silently.</p>
      </div>
      <div style={CELL}>
        <CommentThread comments={[]} label="Remarks on this application" onSubmit={() => {}} maxLength={120}
          composerLabel="Add a scrutiny remark" submitLabel="Record remark" />
        <p style={CAPTION}>Empty, with a short cap so the remaining count appears in the last fifth rather than from the first keystroke.</p>
      </div>
    </div>
  );
}
