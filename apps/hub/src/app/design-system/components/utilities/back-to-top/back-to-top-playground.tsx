"use client";
import * as React from "react";
import { BackToTop } from "@mosje/design-system";

const NOTE: React.CSSProperties = {
  margin: 0,
  color: "var(--sa-text-neutral-base)",
  fontSize: "var(--sa-type-body-2-size)",
  lineHeight: "var(--sa-type-body-2-lh)",
};

/**
 * The control is fixed to the viewport's corner, so it cannot be shown inline.
 * This gives it a scrolling region of its own — which is also the case the
 * component's scroll-container lookup exists for: this estate's shells scroll an
 * element rather than the window, and a control watching `window.scrollY` would
 * never appear at all.
 */
export function BackToTopPlayground(): React.JSX.Element {
  return (
    <div
      style={{
        padding: "var(--sa-padding-32)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-16)",
      }}
    >
      <p style={NOTE}>
        Scroll the panel below past 400px. The control appears in the
        bottom-right corner of the window — above the accessibility widget, not
        under it — and is absent from the DOM until then.
      </p>
      <div
        style={{
          height: "18rem",
          overflowY: "auto",
          padding: "var(--sa-padding-16)",
          background: "var(--sa-bg-neutral-base)",
          border: "var(--sa-cmp-divider-width) solid var(--sa-border-neutral-subtle)",
          borderRadius: "var(--sa-shape-8)",
        }}
      >
        <div style={{ height: "60rem" }}>
          <p style={NOTE}>The top of a long region. Keep scrolling.</p>
        </div>
        <p style={NOTE}>The bottom. The control should now be in the corner.</p>
        <BackToTop showAfter={400} />
      </div>
    </div>
  );
}
