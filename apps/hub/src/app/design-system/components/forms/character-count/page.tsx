import type { Metadata } from "next";
import * as React from "react";

import { Callout, CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { CharacterCountSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Character Count — Design System",
  description:
    "A live count of how much of a field's limit is left, counted the way the person typing counts it and announced when it starts to matter.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      "Two live regions, one polite and one assertive; only the one that applies holds text. Verified by reading the rendered DOM 2026-09-03 — swapping `aria-live` on a single node is honoured inconsistently, so the component never does it.",
    description:
      "The count changes without the reader moving focus, which is exactly what a status message is for.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The id passed by Form Field is on a static, visually-hidden sentence stating the limit, which joins the field's `aria-describedby`.",
    description:
      "Pointing `aria-describedby` at the running total instead — which is the common implementation — tells a reader with an empty field nothing at all, because the total has not started changing yet.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    status: "partial",
    evidence:
      "Going over the limit is announced assertively and shown in the error colour and in words. It does NOT set `aria-invalid` on the field — that remains the form's decision, because a count over its limit is not always a submission failure.",
    description: "The count reports the overrun; the form decides whether it blocks.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    status: "verified",
    evidence:
      "The over-limit state changes the words (\"5 characters too many\") as well as the colour and the weight.",
    description: "The number itself carries the meaning; the colour only emphasises it.",
  },
  {
    criterion: "GIGW 3.0 — Multilingual content",
    level: "GIGW",
    status: "verified",
    evidence:
      // ds-exempt(code-sample): the Devanagari word is a measured input in an evidence note, quoted as data, not rendered as Hindi copy
      "`countCharacters` walks grapheme clusters with `Intl.Segmenter`. Measured in a browser 2026-09-03: \"नमस्ते\" is 6 to `String.length` and 3 to this, and \"👍🏽\" is 4 to `String.length` and 1 to this.",
    description:
      "A count that uses `String.length` tells a Hindi speaker their word is longer than it is, and cuts a Devanagari cluster in half if it is also used to enforce a limit.",
  },
];

const EXAMPLE = `// Through Form Field — the id, the description and the
// announcements are wired for you.
<FormField
  label="Describe your grievance"
  characterCount={{ value, maxLength: 500 }}
>
  {(control) => (
    <Textarea {...control} value={value} onChange={onChange} />
  )}
</FormField>`;

export default function CharacterCountPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Character Count"
      status="Stable"
      since="0.7.0"
      summary="A live count of how much of a field's limit is left. It counts what a reader would call a character rather than what JavaScript calls one, stays silent until the limit starts to matter, and raises its voice only once the limit is passed."
      figma={{ node: "characterCount" }}
      specimen={<CharacterCountSpecimen />}
      propsFrom="CharacterCountProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A free-text field with a limit the department actually enforces — a grievance, a justification, a remark.",
          "Any field where a reader is likely to prepare their answer elsewhere and paste it in.",
        ],
        avoid: [
          "A field with no limit. A count with nothing to count against is decoration.",
          "A limit so generous that nobody reaches it — a 4,000-character box does not need a running total.",
          "A short field where the limit is a format rather than a length. An Aadhaar number is twelve digits because it is an Aadhaar number; use Aadhaar Input, which knows that.",
        ],
      }}
      related={[
        { label: "Form Field", href: "/design-system/components/forms/form-field", reason: "the wrapper that wires this count into the field's description" },
        { label: "Textarea", href: "/design-system/components/forms/textarea", reason: "the control this most often sits under" },
      ]}
      code={<CodeBlock>{EXAMPLE}</CodeBlock>}
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-cc-notes">
          <h2 id="cdp-cc-notes" className="cdp__h2">
            Notes
          </h2>
          <Callout type="warning" title="Do Not Also Set maxLength">
            A hard <code>maxLength</code> on the control silently swallows keystrokes, and a reader
            pasting a prepared answer loses the end of it without being told. Let them go over the
            limit and let the count say so — that is what its over-limit state is for. The browser
            also counts UTF-16 units rather than characters, so on Devanagari it would cut a word
            mid-cluster.
          </Callout>
          <p>
            The count is silent until three quarters of the limit is used, and then waits for a
            half-second gap in typing before it speaks. Both are deliberate: an announcement per
            keystroke is unusable, and a reader four characters into a five-hundred-character box
            does not need to be told how much room is left.
          </p>
        </section>
      }
    />
  );
}
