import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { ChipPlayground } from "./chip-playground";

export const metadata: Metadata = {
  title: "Chip — Design System",
  description:
    "A compact pill used as a filter toggle, a removable tag, a dropdown trigger or a static category, with an optional count.",
};

/*
 * Read off `ChipProps` in packages/design-system/components/forms/chip.tsx.
 * The interface extends `HTMLAttributes<HTMLDivElement>` minus `onSelect`, so
 * every other div attribute passes through. The chip is a `<div>` that takes
 * `role="button"` only when `onSelectedChange` is supplied.
 */
const PROPS: PropDef[] = [
  {
    name: "children",
    type: "React.ReactNode",
    default: "undefined",
    description: "The chip label. Keep it to a word or two — a chip is a filter, not a sentence.",
  },
  {
    name: "selected",
    type: "boolean",
    default: "false",
    description: "Controlled selected state. Together with `onSelectedChange` this makes the chip a toggle.",
  },
  {
    name: "onSelectedChange",
    type: "(selected: boolean) => void",
    default: "undefined",
    description:
      "Called with the next selected value. Supplying it is what makes the chip interactive: it gains `role=\"button\"`, a tab stop, `aria-pressed` and Enter/Space handling. Omit it and the chip is a static label.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    default: '"md"',
    description:
      "`sm` is for a dense filter row where `md` would wrap the line. It still clears the 24×24 minimum target; it is not a way to fit chips into a space that is simply too small.",
  },
  {
    name: "tone",
    type: '"brand" | "success" | "neutral"',
    default: '"brand"',
    description:
      "Which family the SELECTED state paints in; an unselected chip is identical in all three. `success` is for a surface with no blue on it. `neutral` is for a filter row sitting beside something louder, such as a chart's own legend.",
  },
  {
    name: "leadingIcon",
    type: "React.ReactNode",
    default: "undefined",
    description: "Icon before the label. It is `aria-hidden`, so it never carries meaning of its own.",
  },
  {
    name: "count",
    type: "number | string",
    default: "undefined",
    description:
      "A trailing count of how many things the chip selects, rendered muted and outside the label. Pass a string where the figure needs the estate's own grouping. Do not write the count into the label instead.",
  },
  {
    name: "countLabel",
    type: "string",
    default: '"items"',
    description:
      "What one unit of `count` is, read only by assistive technology — so a screen reader hears \"Guidelines, 2 items\" rather than \"Guidelines 2\".",
  },
  {
    name: "onDismiss",
    type: "() => void",
    default: "undefined",
    description: "Supplying it renders a trailing dismiss button, which is a real `<button>` with its own accessible name.",
  },
  {
    name: "dismissLabel",
    type: "string",
    default: '"Remove"',
    description: "Accessible name for the dismiss button. Name the thing being removed where the label alone is ambiguous.",
  },
  {
    name: "trailingDropdown",
    type: "boolean",
    default: "false",
    description: "Renders a trailing chevron marking the chip as a dropdown trigger. Purely visual; the menu is yours to wire.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
      "Dims the chip, sets `aria-disabled`, and stops both the toggle and the dismiss. The chip stays in the accessibility tree, so a reader can still find out it exists.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the chip element.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "An interactive chip takes a `tabIndex` and handles Enter and Space. The dismiss button is a real `<button>` with its own tab stop.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description: "Focus is drawn on the pill itself, and separately on the dismiss button inside it.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description: "Both sizes clear the 24×24 minimum. `sm` was measured against it before it shipped.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "An interactive chip carries `role=\"button\"` with `aria-pressed`, so its selected state is announced. A static chip carries no role at all, so it is not announced as a control that does nothing.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "The selected state is carried by `aria-pressed` as well as by the fill, so it survives a monochrome rendering and reaches a screen reader.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "`count` is rendered outside the label with its unit in visually hidden text, so the figure and its meaning are both available without being read as part of the name.",
  },
];

export default function ChipPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Chip"
      status="Stable"
      summary="A compact pill used as a filter toggle, a removable tag, a dropdown trigger or a static category. It becomes interactive only when a change handler is supplied, so a chip that does nothing is never announced as a control."
      figma={{ node: "chips" }}
      specimen={<ChipPlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A row of filters narrows a list, a table or a map, and the reader may switch several on at once.",
          "A selection already made needs to be shown back and removed — a tag on a search, a district already chosen.",
          "A category or status needs a compact static label beside its subject.",
        ],
        avoid: [
          "The control performs a page action — use Button, which is a real button and reads as one.",
          "Exactly one option may be chosen from a set — use a Radio group, which enforces it.",
          "The mark is a status the reader cannot change — use Badge, which is not interactive.",
          "The label is a sentence. A chip that wraps to two lines has stopped being a chip.",
        ],
      }}
      related={[
        {
          label: "Badge",
          href: "/design-system/components/feedback/badge",
          reason: "for a status the reader cannot change",
        },
        {
          label: "Button",
          href: "/design-system/components/actions/button",
          reason: "when the control performs an action",
        },
        {
          label: "Filter Bar",
          href: "/design-system/components/dashboard/filter-bar",
          reason: "the row a set of filter chips belongs in",
        },
        {
          label: "Checkbox",
          href: "/design-system/components/forms/checkbox",
          reason: "when the same choice is part of a form the reader submits",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-tone">
          <h2 id="cdp-tone" className="cdp__h2">
            Tone and Size
          </h2>
          <p>
            <code>tone</code> changes the selected state only. <code>brand</code> is the estate&apos;s
            blue selection colour and is right almost everywhere. <code>success</code> exists for a
            surface with no blue on it, where a blue pill would be a third colour family on a
            two-family panel. <code>neutral</code> is for a filter row sitting beside something
            louder — three brand-blue pills next to a chart&apos;s own legend outshout the keys they
            belong to, and the eye reads the filter before the thing being filtered.
          </p>
          <p>
            <code>size=&quot;sm&quot;</code> is for a dense row that would otherwise wrap. It is a
            layout remedy with a known cost in legibility, so reach for it when a row genuinely
            overflows, not to fit one more chip in.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <p>A filter row. The chip is interactive because it has a change handler.</p>
          <CodeBlock>{`import { Chip } from "@mosje/design-system";

{GROUPS.map((group) => (
  <Chip
    key={group.id}
    selected={active.includes(group.id)}
    onSelectedChange={(next) => toggle(group.id, next)}
    count={group.documents}
    countLabel="documents"
  >
    {group.label}
  </Chip>
))}`}</CodeBlock>
          <p>A removable tag. The dismiss button is rendered because a handler was supplied.</p>
          <CodeBlock>{`{filters.map((filter) => (
  <Chip
    key={filter}
    onDismiss={() => setFilters((prev) => prev.filter((f) => f !== filter))}
    dismissLabel={\`Remove the \${filter} filter\`}
  >
    {filter}
  </Chip>
))}`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-keys">
          <h2 id="cdp-keys" className="cdp__h2">
            Keyboard
          </h2>
          <ul>
            <li>
              <strong>Tab</strong> — move to the chip, where it is interactive. A dismiss button is a
              second tab stop after it.
            </li>
            <li>
              <strong>Enter or Space</strong> — toggle the chip.
            </li>
          </ul>
          <p>
            A chip with no <code>onSelectedChange</code> and no <code>onDismiss</code> takes no role
            and no tab stop. That is deliberate: a static category announced as a button is a control
            a screen-reader user will try to operate and find inert.
          </p>
          <p>
            A row of filter chips needs a name of its own. Wrap the row in a labelled group so a
            screen-reader user hears what the filters apply to before hearing the first one.
          </p>
        </section>
      }
    />
  );
}
