"use client";

import { AccessibilityBar } from "@mosje/design-system";

/** Government utility bar — the shared DS AccessibilityBar. smile-admin's --primary
    is DS navy (#003366), so tone="navy" matches the portal's brand. Font size /
    contrast live in the official UX4GAccessibilityWidget (root layout). */
export function AccessBar() {
  return (
    <AccessibilityBar
      tone="navy"
      layout="fluid"
      govLink={{ href: "https://www.india.gov.in", label: "Government of India" }}
      skipTo="#main-content"
      showSkip
      fontSize={false}
      accessibility={false}
      language={{ label: "English" }}
    />
  );
}
