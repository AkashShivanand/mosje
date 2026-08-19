"use client";

import * as React from "react";
import { AccessibilityBar } from "@mosje/design-system";

/** Bordered "viewport" so a full-width bar reads as a contained specimen. */
function Frame({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div
      style={{
        border: "1px solid var(--sa-border-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        overflow: "hidden",
        background: "var(--sa-bg-neutral-base)",
      }}
    >
      {children}
    </div>
  );
}

/** Live AccessibilityBar — the default blue masthead bar, all four controls. */
export function AccessibilityBarPreview(): React.JSX.Element {
  return (
    <Frame>
      <AccessibilityBar
        layout="fluid"
        accessibilityHref="#"
        language={{ label: "English" }}
      />
    </Frame>
  );
}

/** Navy — via the brand axis (`data-brand="navy"`), not a prop. */
export function AccessibilityBarNavyPreview(): React.JSX.Element {
  return (
    <Frame>
      <div data-brand="navy">
        <AccessibilityBar
          layout="fluid"
          accessibilityHref="#"
          language={{ label: "English" }}
        />
      </div>
    </Frame>
  );
}

/**
 * Live font-size demo — the A−/A/A+ stepper drives a `--sa-font-scale` variable;
 * the paragraph below reflows with the reader's chosen size.
 */
export function AccessibilityBarFontSizePreview(): React.JSX.Element {
  const [scale, setScale] = React.useState(1);
  return (
    <Frame>
      <AccessibilityBar
        layout="fluid"
        showSkip={false}
        accessibility={false}
        language={false}
        onFontScaleChange={setScale}
      />
      <p
        style={{
          margin: 0,
          padding: "var(--sa-padding-20)",
          fontSize: `calc(var(--sa-type-body-1-size) * ${scale})`,
          lineHeight: "var(--sa-type-body-1-lh)",
          color: "var(--sa-text-neutral-base)",
        }}
      >
        This paragraph scales with the reader&apos;s chosen text size (current
        scale: {scale.toFixed(2)}×). Use the A− / A / A+ buttons in the bar above.
      </p>
    </Frame>
  );
}
