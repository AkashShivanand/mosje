import * as React from "react";
import { Divider } from "@mosje/design-system";

/** Both orientations, at their natural stretched length. */
export function DividerSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-ground">
      <p className="cdp-ground__label">horizontal — fills its container</p>
      <Divider />

      <p className="cdp-ground__label">vertical — stretches to the tallest sibling</p>
      <div className="cdp-row cdp-row--rule">
        <span>Before</span>
        <Divider orientation="vertical" />
        <span>After</span>
      </div>
    </div>
  );
}

/**
 * The three tones, each on the ground it is designed for. The brand ground is a
 * design-system surface token, so the inverse rules are shown against the colour
 * they will actually meet rather than an approximation of it.
 */
export function DividerToneSpecimen(): React.JSX.Element {
  return (
    <div className="cdp-stack">
      <div className="cdp-ground">
        <p className="cdp-ground__label">default — on a light surface</p>
        <Divider tone="default" />
      </div>

      <div className="cdp-ground cdp-ground--brand">
        <p className="cdp-ground__label">inverse — sections on a dark surface</p>
        <Divider tone="inverse" />

        <p className="cdp-ground__label">inverse-subtle — between controls</p>
        <Divider tone="inverse-subtle" />

        <p className="cdp-ground__label">
          an explicit length — what the accessibility bar passes
        </p>
        <div className="cdp-row cdp-row--rule">
          <span>Skip to Main Content</span>
          <Divider orientation="vertical" tone="inverse-subtle" length={20} />
          <span>A− A A+</span>
          <Divider orientation="vertical" tone="inverse-subtle" length={20} />
          <span>English</span>
        </div>
      </div>
    </div>
  );
}
