import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

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
    />
  );
}
