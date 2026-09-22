"use client";

import * as React from "react";
import { Button, Icon } from "@mosje/design-system";

interface FeedbackBarProps {
  componentName?: string;
  githubIssueUrl?: string;
}

export function FeedbackBar({
  componentName = "SAMAVESH Documentation",
  githubIssueUrl = "https://github.com/AkashShivanand/MoSJE/issues/new",
}: FeedbackBarProps): React.JSX.Element {
  const [feedbackGiven, setFeedbackGiven] = React.useState<"yes" | "no" | null>(null);

  const issueHref = `${githubIssueUrl}?title=[Feedback]:+${encodeURIComponent(
    componentName,
  )}&labels=documentation,design-system`;

  return (
    <div
      className="docs-feedback-bar"
      style={{
        marginTop: "var(--sa-section-48)",
        paddingTop: "var(--sa-padding-24)",
        borderTop: "1px solid var(--sa-border-neutral-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "var(--sa-stack-16)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)" }}>
        <span style={{ fontSize: "var(--sa-type-body-2-size)", fontWeight: "var(--sa-font-weight-semibold)", color: "var(--sa-text-neutral-base)" }}>
          Was this page helpful?
        </span>
        {feedbackGiven ? (
          <span
            style={{
              fontSize: "var(--sa-type-body-2-size)",
              color: "var(--sa-text-status-success-base)",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--sa-stack-4)",
            }}
          >
            <Icon name="check" size={16} /> Thank you for your feedback!
          </span>
        ) : (
          <div style={{ display: "flex", gap: "var(--sa-stack-8)" }}>
            <Button
              variant="neutral"
              appearance="outlined"
              size="sm"
              iconLeft={<Icon name="thumb_up" size={16} />}
              onClick={() => setFeedbackGiven("yes")}
              aria-label="Yes, this page was helpful"
            >
              Yes
            </Button>
            <Button
              variant="neutral"
              appearance="outlined"
              size="sm"
              iconLeft={<Icon name="thumb_down" size={16} />}
              onClick={() => setFeedbackGiven("no")}
              aria-label="No, this page was not helpful"
            >
              No
            </Button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-16)" }}>
        <a
          href={issueHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sa-stack-6)",
            fontSize: "var(--sa-type-body-3-size)",
            color: "var(--sa-text-neutral-subtle)",
            textDecoration: "none",
          }}
        >
          <Icon name="edit" size={16} /> Report an issue with this spec ↗
        </a>
      </div>
    </div>
  );
}
