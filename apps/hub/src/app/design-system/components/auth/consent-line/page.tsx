import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Consent Line — Design System",
  description: "The standing consent sentence under every authentication form.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "GIGW 3.0 — Disclosure",
    level: "GIGW",
    status: "verified",
    evidence: "The disclosure is rendered on every authentication surface in the estate; only the two hrefs vary.",
    description: "GIGW requires it, so it is never dropped to save vertical space.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Consent Line"
      status="Stable"
      summary="The standing consent sentence under every authentication form. The wording is fixed estate-wide and is deliberately NOT a prop — it is legal copy, so changing it is a legal decision rather than a design one. Only the two hrefs vary."
      figma={{ absent: "Part of the auth-parts set; no separate Figma node." }}
      specimen={<Specimen />}
      propsFrom="ConsentLineProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Under every authentication form, without exception."],
        avoid: [
          "Rewording it. If the wording is wrong, that is a conversation with legal, not a prop.",
          "Dropping it to save vertical space — GIGW requires the disclosure.",
          "Turning it into a checkbox unless legal asks for one: it is a statement of consequence, not a thing to tick.",
        ],
      }}
      related={[
        { label: "Declaration Checkbox", href: "/design-system/components/forms/declaration-checkbox", reason: "when a statutory declaration IS meant to be ticked" },
        { label: "Portal Login Template", href: "/design-system/components/auth/portal-login-template", reason: "the screen it belongs to" },
      ]}
    />
  );
}
