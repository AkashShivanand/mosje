import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Card State — Design System",
  description: "What a card shows when it has no figures to show.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    evidence: "The illustration is decorative and the state's meaning is carried by its title and description, which are real text.",
    description: "The drawing supports the sentence; it never replaces it.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "verified",
    evidence:
      "`no-results` and `empty` are separate kinds with different wording, so “your filter matched nothing” is never rendered as “there is nothing”.",
    description: "They are different sentences with different remedies, and the reader can only act on one of them.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Card State"
      status="Stable"
      summary="What a card shows when it has no figures to show. The three kinds are deliberately distinct: a valid selection that genuinely holds nothing, a filter that matched nothing, and a figure the source does not publish yet."
      figma={{ node: "chartsChartCard" }}
      specimen={<Specimen />}
      propsFrom="CardStateProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "`empty` — the selection is valid and holds nothing. There is nothing for the reader to do.",
          "`no-results` — a filter excluded everything. The reader caused it and can undo it, so the action says how.",
          "`not-published` — the source does not publish this figure. Not a failure, and not the reader's to fix.",
        ],
        avoid: [
          "Using one kind for all three. They read identically as a blank panel if nobody distinguishes them, which is the whole defect this prevents.",
        ],
      }}
      related={[
        { label: "Card Skeleton", href: "/design-system/components/dashboard/card-skeleton", reason: "before the answer arrives" },
        { label: "Illustration", href: "/design-system/foundations/illustration", reason: "the drawings it uses" },
      ]}
    />
  );
}
