"use client";

import * as React from "react";
import { AccessibilityBar } from "@mosje/design-system";

/**
 * The specimens showed NO FLAG until 2026-08-19, because `flagSrc` is optional and none
 * of them passed it — so the documentation demonstrated a bar the estate never ships.
 * Every real consumer (the website masthead, pm-ajay) passes the emblem chip.
 *
 * The asset is referenced rather than copied: one national emblem, one file. The hub
 * serves `public/` at the root, so this resolves from the /design-system routes too.
 */
const GOV_LINK = {
  href: "#",
  label: "Government of India",
  flagSrc: "/website/images/Indian-Flag.svg",
} as const;

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
        govLink={GOV_LINK}
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
          govLink={GOV_LINK}
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
        govLink={GOV_LINK}
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

/**
 * Arrangements the master grid does not show: the bar forced to the mobile breakpoint
 * (icons only), a narrow layout, and the controls switched off one at a time — the
 * single-language portal, and the portal whose widget is mounted elsewhere.
 */
export function AccessibilityBarArrangementsPreview(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
      <div style={{ maxWidth: 412 }}>
        <Frame>
          <AccessibilityBar device="mobile" layout="fluid" govLink={GOV_LINK} accessibilityHref="#" language={{ label: "English" }} />
        </Frame>
      </div>
      <Frame>
        <AccessibilityBar layout="narrow" govLink={GOV_LINK} accessibilityHref="#" language={false} fontSize={false} />
      </Frame>
      <Frame>
        <AccessibilityBar layout="fluid" govLink={GOV_LINK} accessibilityHref="#" showSkip={false} language={{ label: "हिंदी", lang: "hi" }} />
      </Frame>
    </div>
  );
}

