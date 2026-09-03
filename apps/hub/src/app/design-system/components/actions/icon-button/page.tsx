import type { Metadata } from "next";
import * as React from "react";

import { Callout, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";
import { IconButtonExtras } from "./extras";

export const metadata: Metadata = {
  title: "Icon Button — Design System",
  description: "A Button whose whole label is its icon.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "It renders a real `Button`, so it inherits the same naming contract. An icon carries no accessible name of its own, which is why an `aria-label` is required rather than optional here.",
    description: "An icon-only control with no label is silent to a screen reader.",
  },
];

export default function Page(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Icon Button"
      status="Stable"
      summary="A Button whose whole label is its icon. It renders a real Button, so variant, appearance, tone, size, disabled, loading and the link form all behave identically — there is one button in this system, and this is a shape of it rather than a second implementation."
      figma={{ node: "iconButton" }}
      specimen={<Specimen />}
      propsFrom="IconButtonProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A toolbar or table row where a text label would not fit and the icon is unambiguous.",
          "A close, edit or overflow control whose meaning is conventional.",
        ],
        avoid: [
          "An action whose icon is not conventional — if it needs a tooltip to be understood, it needs a label.",
          "Rendering it without an accessible name.",
        ],
      }}
      related={[
        { label: "Button", href: "/design-system/components/actions/button", reason: "the component it is a shape of" },
        { label: "Icon", href: "/design-system/components/utilities/icon", reason: "the glyph inside it" },
      ]}
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-why">
          <h2 id="cdp-why" className="cdp__h2">Why a Component and Not an <code>iconOnly</code> Prop</h2>
          <p>
            UX4G models icon-only as a property of the button, which is a fair reading. This estate
            makes it a separate component for one reason: a boolean prop cannot make the accessible
            name <em>required</em>. As its own component, the label has nowhere to hide.
          </p>
        </section>
      }
    design={
      <>
        <section className="cdp__section" aria-labelledby="cdp-ib-name">
          <h2 id="cdp-ib-name" className="cdp__h2">
            It Has Exactly One Name
          </h2>
          <p>
            <code>aria-label</code> is required by the type system, and it names what the
            control <strong>does</strong> &mdash; &ldquo;Close dialog&rdquo;, not
            &ldquo;Cross&rdquo;. The glyph is marked decorative, because a Material Symbols
            ligature is real text: unhidden, a screen reader would announce
            &ldquo;arrow_back Close dialog&rdquo;.
          </p>
          <Callout type="warning" title="The tooltip serves the people aria-label does not">
            A screen-reader user already has the name. The person who can SEE the glyph and
            does not recognise it gets nothing &mdash; and that is most people, on most icons
            that are not a cross or a magnifier. Pass <code>tooltip</code> and it reuses the{" "}
            <code>aria-label</code>; pass a string to say something else. Where the bubble
            repeats the accessible name it is marked <code>duplicatesTriggerName</code>, so
            the label is announced once rather than twice.
          </Callout>
        </section>

        <IconButtonExtras />

        <section className="cdp__section" aria-labelledby="cdp-ib-omitted">
          <h2 id="cdp-ib-omitted" className="cdp__h2">
            What It Deliberately Cannot Do
          </h2>
          <MatrixTable
            caption="Props removed from the inherited Button API"
            columns={["Prop", "Why it is omitted"]}
            rows={[
              ["fullWidth", "This control is square (aspect-ratio: 1). Stretching it into a rectangle breaks the one geometric promise it makes."],
              ["nowrap", "It governs a label, and this control does not have one."],
              ["iconLeft / iconRight", "The icon is the label. It arrives as `icon`, and there is only one."],
              ["children", "Same reason — an icon button with children is an ordinary Button."],
            ]}
          />
          <p>
            Both were reachable through <code>ButtonProps</code> until 2026-09-03. A prop that
            cannot do anything useful is a prop somebody will eventually try, so the type
            removes them rather than the documentation asking nicely.
          </p>
        </section>
      </>
    }

    />
  );
}
