import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { SliderPlayground } from "./slider-playground";

export const metadata: Metadata = {
  title: "Slider — Design System",
  description:
    "A bounded numeric choice built on a real <input type=\"range\">, with a two-thumb range variant made from two real range inputs rather than one track with two dots.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "The control is a native <input type=\"range\">, so the arrow keys, Page Up and Page Down, and Home and End are the browser's own and need no code. Measured with real key presses in the browser: three ArrowRight took the value 0 to 3, End took it to 100, Home took it to 0, and the readout followed each time — so the controlled round-trip works as well as the native handling.",
    description:
      "The whole keyboard model is the native one, which is why this is not a div with a draggable dot.",
  },
  {
    criterion: "2.5.7 Dragging Movements",
    level: "AA",
    status: "verified",
    evidence:
      "Every value reachable by dragging is reachable from the keyboard on the same control, with no drag required. Measured: End alone reached the maximum and Home alone reached the minimum, with no pointer involved.",
    description:
      "There is a single-pointer, no-drag alternative to every drag — the arrow keys on the same control.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'Read from the accessibility tree: role slider with aria-valuenow, aria-valuemin and aria-valuemax from the native element, and aria-valuetext carrying the formatted string when formatValue is given. The range variant renders two inputs whose aria-labels read "Grant amount, minimum" and "Grant amount, maximum".',
    description:
      "Each thumb is a real slider with its own name and its own announced value.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    status: "verified",
    evidence:
      "The ring is drawn on the ::-webkit-slider-thumb and ::-moz-range-thumb pseudo-elements rather than the input box. Confirmed on a full-resolution screenshot of the focused control: the ring encircles the handle at its position on the track, and the row itself carries none.",
    description:
      "The ring marks the handle. A ring around the whole row would say the row is focused, not which thumb.",
  },
];

export default function SliderPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Slider"
      status="Stable"
      summary="A bounded numeric choice for when the reader cares about roughly where rather than exactly what. It is a real range input, so the keyboard model and the announced value are the browser's own."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<SliderPlayground />}
      propsFrom="SliderProps"
      props={[
        {
          name: "RangeSlider",
          type: "component",
            description:
            "The two-thumb variant. `value: [from, to]` · `onValueChange` · `label` (names the pair; each thumb takes label + fromLabel/toLabel) · `fromLabel` · `toLabel`, plus every prop above except `aria-label`.",
        },
      ]}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A filter narrows results by a range the reader chooses approximately — a fund band, a distance, a span of years.",
          "The reader benefits from seeing where their choice sits between the bounds.",
          "The exact number does not have to be typed, or a number field sits beside it.",
        ],
        avoid: [
          "The exact figure is the point — a grant amount on an application, a quantity. Use a number field; a slider makes the applicant guess.",
          "There are only a few choices — that is a Radio group or a Segmented Control, both of which name the options.",
          "The range is enormous and the step small. A slider across ten million rupees in steps of one is a control nobody can land on.",
        ],
      }}
      related={[
        {
          label: "Input",
          href: "/design-system/components/forms/input",
          reason: "when the exact figure has to be typed",
        },
        {
          label: "Segmented Control",
          href: "/design-system/components/dashboard/segmented-control",
          reason: "when there are a few named choices rather than a range",
        },
        {
          label: "Filter Bar",
          href: "/design-system/components/dashboard/filter-bar",
          reason: "for the surface a range filter usually sits in",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-native">
            <h2 id="cdp-native" className="cdp__h2">
              It Is a Real Range Input
            </h2>
            <p>
              The native control already carries the keyboard model, announces its value and its
              bounds, and is the one form control that assistive technology and mobile browsers both
              handle correctly. A <code>&lt;div&gt;</code> with a draggable dot has to reimplement
              all of that, and usually reimplements the visible half only.
            </p>
            <p>
              Only the paint is ours: the track is a gradient driven by one percentage, so the
              filled portion and the thumb cannot disagree about where the value is.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-alone">
            <h2 id="cdp-alone" className="cdp__h2">
              Never the Only Way to Enter a Number That Matters
            </h2>
            <p>
              WCAG 2.5.7 asks for a single-pointer alternative to dragging, and the arrow keys
              provide it. But an applicant who knows the grant they are seeking is ₹4,50,000 should
              be able to type it, not hunt for it. Pair the slider with a number field wherever the
              exact figure is the point, and use it alone only for a coarse filter.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-unit">
            <h2 id="cdp-unit" className="cdp__h2">
              A Number Without Its Unit Is Not the Information
            </h2>
            <p>
              Pass <code>formatValue</code> whenever the value has a unit. It drives the readout{" "}
              <em>and</em> <code>aria-valuetext</code>, so a screen reader says
              &ldquo;₹ 4,50,000&rdquo; rather than &ldquo;450000&rdquo;. Marks are for three or four
              anchors, not for every step: a mark per step turns the track into a ruler nobody
              reads.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-range">
            <h2 id="cdp-range" className="cdp__h2">
              The Range Variant Is Two Real Sliders
            </h2>
            <p>
              <code>RangeSlider</code> overlays two <code>&lt;input type=&quot;range&quot;&gt;</code>{" "}
              elements rather than drawing one track with two dots. Each thumb is therefore a genuine
              slider with its own accessible name, its own keyboard model and its own announced
              value — the only arrangement a screen-reader user can actually operate.
            </p>
            <p>
              The two values are kept in order by clamping rather than swapping. A thumb that jumps
              past its partner and changes identity mid-drag is impossible to follow by eye, and
              impossible to describe to a screen-reader user at all.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Slider } from "@mosje/design-system";

const [amount, setAmount] = React.useState(450000);

<Slider
  aria-labelledby="grant-amount-label"
  value={amount}
  onValueChange={setAmount}
  min={0}
  max={1000000}
  step={50000}
  formatValue={(v) => \`₹ \${v.toLocaleString("en-IN")}\`}
  marks={[
    { value: 0, label: "₹ 0" },
    { value: 500000, label: "₹ 5L" },
    { value: 1000000, label: "₹ 10L" },
  ]}
/>`}</CodeBlock>
          <p>The two-thumb variant takes a tuple and names the pair once.</p>
          <CodeBlock>{`<RangeSlider
  label="Grant amount"
  value={band}
  onValueChange={setBand}
  min={0}
  max={1000000}
  step={50000}
/>`}</CodeBlock>
          <p>
            The rail binds <code>--sa-control-track</code>, a token added with this component. It is
            one value for both sizes: <code>size</code> changes the <em>thumb</em>, which is what the
            reader grabs, and thinning the rail under a smaller thumb makes the target look smaller
            than it is.
          </p>
        </section>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-ring">
            <h2 id="cdp-ring" className="cdp__h2">
              The Ring Goes on the Thumb
            </h2>
            <p>
              The focus ring is drawn on the thumb pseudo-element, not the input box. A ring around
              a 600px-wide row tells the reader that the row is focused; it does not tell them which
              handle they are holding, which on the range variant is the only thing they need to
              know.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-names">
            <h2 id="cdp-names" className="cdp__h2">
              Two Sliders Need Two Names
            </h2>
            <p>
              <code>RangeSlider</code> derives each thumb&apos;s name from <code>label</code> —
              &ldquo;Grant amount, minimum&rdquo; and &ldquo;Grant amount, maximum&rdquo;. Two
              controls both announced as &ldquo;slider&rdquo; are indistinguishable, and a reader
              who cannot tell which end they are moving cannot set a range at all.
            </p>
          </section>
        </>
      }
    />
  );
}
