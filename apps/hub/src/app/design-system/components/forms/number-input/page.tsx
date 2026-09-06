import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { NumberPlayground } from "./number-playground";

export const metadata: Metadata = {
  title: "Number Input — Design System",
  description:
    "A quantity, amount or count. A text field carrying role=spinbutton rather than input type=number, which silently discards what it cannot parse.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      'Read from the rendered DOM: the input carries role="spinbutton" with aria-valuenow, aria-valuemin and aria-valuemax reflecting the props, aria-describedby to the hint, and aria-invalid when in error. The steppers carry aria-hidden and tabIndex -1, so the arrow-key behaviour the role advertises is not announced a second time as two buttons.',
    description:
      "The field reports its value and its range the way a native number input would.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    status: "verified",
    evidence:
      "`label` is required and rendered as a real <label for>; hint and error are associated by aria-describedby. Read from the accessibility tree on this page.",
    description: "The field always has a visible label, and its units are stated rather than implied.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "ArrowUp and ArrowDown nudge by `step` and clamp to min and max; the value commits on blur. Measured with a real key press on the utilisation field: ArrowUp took 62.5 to 63.0 with aria-valuenow following to 63. Separately measured on the amount field: typing 1,50,000 and tabbing away committed 150000 — the exact entry an input type=number discards in silence. The clamp at the bounds was not exercised in this pass.",
    description: "Everything the steppers do is reachable from the keyboard on the field itself.",
  },
];

export default function NumberInputPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Number Input"
      status="Stable"
      summary="A quantity, an amount, a count. It is a text field carrying role=spinbutton rather than input type=number, because the native control silently discards what it cannot parse — including the way amounts are written in India."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<NumberPlayground />}
      propsFrom="NumberInputProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A figure has to be stored and compared as a number — an amount, a count, a percentage.",
          "The value has a unit that should sit inside the field rather than in the label.",
          "Small adjustments are common enough that steppers earn their space.",
        ],
        avoid: [
          "The value is an identifier that happens to be digits — an Aadhaar number, a PIN code, a reference. Those are text, and arithmetic on them is meaningless.",
          "The reader picks from a range approximately — that is a Slider, ideally beside a field like this one.",
          "There are a handful of valid values — that is a Select.",
        ],
      }}
      related={[
        { label: "Input", href: "/design-system/components/forms/input", reason: "for identifiers that happen to be digits" },
        { label: "Slider", href: "/design-system/components/forms/slider", reason: "for a bounded range chosen approximately" },
        { label: "Aadhaar Input", href: "/design-system/components/forms/aadhaar-input", reason: "for the number that is checked, masked and never arithmetic" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-native">
            <h2 id="cdp-native" className="cdp__h2">Why Not <code>input type=&quot;number&quot;</code></h2>
            <p>
              The native number input <strong>silently discards</strong> what it cannot parse. A
              citizen who types &ldquo;1,50,000&rdquo; — the way an amount is written in India —
              submits an empty field and is told nothing, because the browser reports the value as
              the empty string and the form sees no error to show.
            </p>
            <p>
              It also changes the value on a mouse wheel over a focused field, which has altered
              figures on forms without anybody touching the keyboard. This is a text field carrying{" "}
              <code>role=&quot;spinbutton&quot;</code> with the ARIA value properties, so assistive
              technology gets everything the native control would give it and none of the behaviour
              that harms.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-empty">
            <h2 id="cdp-empty" className="cdp__h2">Empty Is Not Zero</h2>
            <p>
              <code>value</code> is <code>number | null</code>, and a cleared field reports{" "}
              <code>null</code>. A form that stores zero for &ldquo;the applicant did not
              answer&rdquo; has invented a figure, and on a grant application that figure is money.
              The distinction has to survive all the way to the database, which is why it is in the
              type rather than in a convention.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-commit">
            <h2 id="cdp-commit" className="cdp__h2">Committing on Blur, and Forgiving Separators</h2>
            <p>
              &ldquo;1,&rdquo; is not a number, and it is also not empty. Committing on blur rather
              than on keystroke means a half-typed figure is never read as a wrong one. Spaces and
              commas are stripped before parsing, so the way people actually write amounts is
              accepted rather than punished; text that is not a number at all restores the last good
              value rather than leaving characters that will fail on submit.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-steppers">
            <h2 id="cdp-steppers" className="cdp__h2">The Steppers Are Never the Only Route</h2>
            <p>
              <code>hideSteppers</code> removes them and the field still works, because a citizen
              entering ₹4,50,000 is not going to press an arrow four hundred and fifty thousand
              times. Where they are shown they are hidden from assistive technology: the spinbutton
              role already advertises the arrow keys, and announcing both would say the same thing
              twice.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import { NumberInput } from "@mosje/design-system";

const [amount, setAmount] = React.useState<number | null>(null);

<NumberInput
  label="Grant amount sought"
  prefix="₹"
  hint="Whole rupees. Commas and spaces are accepted."
  value={amount}
  onValueChange={setAmount}
  min={0}
  step={50000}
  hideSteppers
/>`}</CodeBlock>
          <p>
            <code>precision</code> governs both the stored value and the way it is shown, so a
            percentage to one decimal place cannot drift into fifteen.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-spin">
          <h2 id="cdp-spin" className="cdp__h2">The Spinbutton Contract</h2>
          <p>
            <code>aria-valuenow</code>, <code>aria-valuemin</code> and <code>aria-valuemax</code>{" "}
            are what let a screen reader say &ldquo;62.5, minimum 0, maximum 100&rdquo; instead of
            reading a bare text field. They are populated from the same props that bound the value,
            so the announcement and the behaviour cannot disagree.
          </p>
          <p>
            <code>aria-valuenow</code> is deliberately <em>absent</em> when the field is empty. A
            spinbutton reporting 0 for &ldquo;nothing entered&rdquo; would tell a screen-reader user
            the opposite of the truth.
          </p>
        </section>
      }
    />
  );
}
