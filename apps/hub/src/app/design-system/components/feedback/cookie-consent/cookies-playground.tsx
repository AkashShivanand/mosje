"use client";
import * as React from "react";
import { CookieConsent, type CookieCategory } from "@mosje/design-system";

const CATEGORIES: CookieCategory[] = [
  { id: "essential", label: "Essential cookies", required: true,
    description: "Keep you signed in and remember the language you chose. The site does not work without them." },
  { id: "analytics", label: "Usage measurement",
    description: "Count how many people reach each page, so the Department can see which pages are hard to find." },
];

const DESCRIPTION =
  "The Department uses cookies to keep this site working and, with your permission, to count how many people use each page. No cookie on this site identifies you.";

const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)", margin: 0,
};

function One(props: Partial<React.ComponentProps<typeof CookieConsent>>) {
  const [accepted, setAccepted] = React.useState<string[]>(["essential"]);
  return (
    <CookieConsent categories={CATEGORIES} accepted={accepted} onDecide={setAccepted}
      description={DESCRIPTION} policyHref="#cookies" placement="inline" {...props} />
  );
}

/** Every arrangement: the first view, and the expanded choices with a third category. */
export function CookiesPlayground(): React.JSX.Element {
  return (
    <div style={{ padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtle)",
      borderRadius: "var(--sa-shape-8)", display: "grid", gap: "var(--sa-stack-24)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
        <One categories={[CATEGORIES[0]!]} acknowledgeLabel="Accept and continue" />
        <p style={CAPTION}>
          Every category required — the form the website&rsquo;s banner takes. One acknowledgement,
          because there is nothing to consent to.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
        <One />
        <p style={CAPTION}>
          One optional category, so it becomes a choice. Rejecting is a button of equal weight
          beside accepting, not two clicks away through a settings panel.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-8)" }}>
        <One
          title="Cookies on the SMILE portal"
          categories={[...CATEGORIES, { id: "video", label: "Embedded video",
            description: "Lets awareness films play in the page. The film's provider sets its own cookies." }]}
        />
        <p style={CAPTION}>
          Press &ldquo;Choose which cookies&rdquo;: optional categories start off, and the essential
          one says it is always on rather than showing a toggle that cannot move.
        </p>
      </div>
    </div>
  );
}
