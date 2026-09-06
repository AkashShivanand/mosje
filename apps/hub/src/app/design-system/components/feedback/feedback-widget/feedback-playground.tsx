"use client";
import * as React from "react";
import { FeedbackWidget } from "@mosje/design-system";

/** Both arrangements: the ordinary widget, and one whose acknowledgement is honest about what does not happen. */
export function FeedbackPlayground(): React.JSX.Element {
  const [last, setLast] = React.useState<string | null>(null);

  return (
    <div
      style={{
        padding: "var(--sa-padding-32)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
      }}
    >
      <FeedbackWidget
        onSubmit={({ verdict, comment }) =>
          setLast(`${verdict}${comment ? ` — “${comment}”` : ""}`)
        }
        helpHref="/website/contact"
      />
      <FeedbackWidget
        question="Did this page answer your question?"
        onSubmit={() => new Promise((r) => setTimeout(r, 1200))}
        thanks="Thank you. Responses are counted but not read individually, and the department cannot reply here."
        helpHref="/website/contact"
      />
      <p
        style={{
          margin: 0,
          color: "var(--sa-text-neutral-subtle)",
          fontSize: "var(--sa-type-label-2-size)",
          lineHeight: "var(--sa-type-label-2-lh)",
        }}
      >
        {last ? `Last response on this page: ${last}` : "Nothing sent yet."}
      </p>
    </div>
  );
}
