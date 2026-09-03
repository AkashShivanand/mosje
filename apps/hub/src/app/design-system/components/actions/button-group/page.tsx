import type { Metadata } from "next";
import * as React from "react";

import { Callout, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";
import { SegmentedDemo } from "./segmented-demo";

export const metadata: Metadata = {
  title: "Button Group — Design System",
  description: "Related actions, kept together and kept apart.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "The group applies the estate's 8px gap between adjacent buttons. WCAG 2.2 lets a target under 24×24 be satisfied by SPACING instead of size, and a group is exactly where adjacency happens — a row of `sm` buttons touching each other is the case that fails.",
    description: "The spacing is the accessible half of this component, not decoration.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "`aria-label` is a REQUIRED prop — TypeScript refuses a group without one — so four loose buttons always become one named group rather than four unexplained controls.",
    description: "The name is not optional, because a group nobody can name is not a group to a screen reader.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Button Group"
      status="Stable"
      summary="Related actions, kept together and kept apart. The second half is the one that gets forgotten: UX4G asks for 8px between adjacent targets, and WCAG 2.2 allows a target under 24×24 to be met by SPACING instead of size — so a row of adjacent small buttons with no gap is exactly the case that fails."
      figma={{ node: "buttonGroup" }}
      specimen={<Specimen />}
      propsFrom="ButtonGroupProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Two or more related actions on one row — Save and Cancel, Approve and Return.",
          "A vertical stack of the same, with `vertical`.",
          "A segmented, joined appearance with `attached`.",
        ],
        avoid: [
          "A bare flex div, which is what produces the touching-targets defect this component exists to prevent.",
          "Unrelated actions that merely sit near each other — grouping implies a relationship.",
        ],
      }}
      related={[
        { label: "Button", href: "/design-system/components/actions/button", reason: "the control it groups" },
        { label: "Icon Button", href: "/design-system/components/actions/icon-button", reason: "when the label is the icon" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-spacing">
            <h2 id="cdp-spacing" className="cdp__h2">
              Two Jobs, and the Second One Gets Forgotten
            </h2>
            <p>
              The group names its actions &mdash; <code>role=&quot;group&quot;</code> plus a
              required label, so a screen reader announces &ldquo;Record actions, group&rdquo;
              rather than reading four loose buttons &mdash; and it holds them 8px apart.
            </p>
            <p>
              The 8px is not a taste decision. UX4G 3.0 asks for 8px between adjacent
              targets, and WCAG 2.2 &sect;2.5.8 allows a target under 24&times;24 to be met
              by <strong>spacing</strong> instead of size. A row of adjacent{" "}
              <code>sm</code> buttons with no gap is exactly the case that fails, and a
              group is precisely where adjacency happens. Reaching for a bare flex{" "}
              <code>div</code> is what produces those rows.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-segmented">
            <h2 id="cdp-segmented" className="cdp__h2">
              The Segmented Control
            </h2>
            <p>
              <code>attached</code> is for buttons that are <strong>alternatives</strong> to
              one another &mdash; a view switcher, a date range. That makes it a segmented
              control, and a segmented control has to be able to say which alternative is
              current.
            </p>
            <SegmentedDemo />
            <p>
              Mark the current segment with <code>aria-pressed</code>. It already
              typechecked on <code>Button</code>; until 2026-09-03 nothing in the estate
              drew it, so the accessible half existed and the visible half did not &mdash;
              the same shape of defect <code>loading</code> shipped with in August.
            </p>
            <MatrixTable
              caption="What a selected segment does, and why"
              columns={["Where", "Treatment", "Why that one"]}
              rows={[
                ["Outlined or text", "Takes the filled treatment.", "Selection reads as weight rather than as a hue the reader has to learn — and it inherits the fill and ink pairing the contrast gate already measures, so a selected segment cannot be a contrast failure a resting one is not."],
                ["Filled", "Deepens.", "A filled button is already the loudest thing available, so selection cannot add weight. Deepening matches the pressed feedback the reader already associates with “engaged”."],
                ["Hover, while selected", "Keeps the fill and darkens.", "Without this the outlined hover tint paints over the fill and the current segment briefly looks unselected — at the moment the reader is most likely looking at it."],
                ["Windows High Contrast", "The system Highlight pair.", "A fill carries nothing once the OS replaces the palette. Highlight is what the platform itself uses to mean “this one is chosen”."],
              ]}
            />
            <Callout type="info" title="Toggle buttons, not a radio group">
              Each segment is a button that is or is not pressed, so Tab reaches every
              option and Enter or Space commits it. A radio group would put the options
              behind arrow keys and a roving tabindex &mdash; the right model for a form
              field, the wrong one for a view switcher sitting beside other controls. Use a
              radio group when the choice is part of a form and gets submitted.
            </Callout>
            <Callout type="warning" title="Do not attach unrelated actions">
              Attaching Save to Delete tells the reader they are the same kind of thing,
              and puts the destructive one a pixel from the safe one. <code>attached</code>{" "}
              is for alternatives; everything else takes the spaced form.
            </Callout>
          </section>
        </>
      }
    />
  );
}
