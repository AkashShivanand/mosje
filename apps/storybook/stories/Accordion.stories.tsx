import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem } from "@mosje/design-system";

/**
 * **Accordion / AccordionItem** — a stack of disclosures, for reference content
 * that is long, list-shaped, and mostly not what the reader came for.
 *
 * @covers Accordion, AccordionItem
 *
 * **What it is for.** The estate's case is the About Us page's bureau
 * breakdown: nine senior officials, each with four to six responsibilities.
 * Printed flat that is a wall of sixty bullets nobody reads; behind
 * disclosures it is a scannable list of nine names where the reader opens the
 * one they need. That is the test — **the headings must be useful on their
 * own**, because closed is the state the reader will spend most of their time
 * in. If someone has to open every panel to find what they want, the accordion
 * is hiding content rather than organising it, and a plain list is better.
 *
 * **When NOT to reach for it.** Not for content the reader definitely needs —
 * an accordion adds a click to everything it contains. Not for a form: fields
 * hidden behind a disclosure get skipped, and browser validation cannot focus
 * an unmounted control. Not as a substitute for a page: five accordions on one
 * screen is a table of contents that has been made harder to use. And not for
 * one item on its own — a single disclosure is a `<details>` element.
 *
 * **`defaultOpen` should usually stay false.** Opening the first item by habit
 * makes the row heights uneven and quietly says the first one matters most.
 * Set it when one panel genuinely is the common case.
 *
 * **Known gaps, recorded rather than hidden.** The trigger carries
 * `aria-expanded` and an accessible name, so it is operable and its state is
 * announced. It diverges from the WAI-ARIA Authoring Practices accordion
 * pattern in two ways: the trigger is **not wrapped in a heading**, so screen
 * reader users cannot jump between panels by heading, and there is no
 * `aria-controls` / `role="region"` association between trigger and panel.
 * Panel content is also **unmounted** when closed, not hidden, so browser
 * find-in-page will not reach it. All three are fixable without changing the
 * API; none is a WCAG failure on its own.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Data Display/Accordion",
  component: AccordionItem,
  args: {
    title: "Shri Amit Yadav, IAS (Secretary)",
    defaultOpen: false,
    children: "Overall leadership and administration of the Department.",
  },
  argTypes: {
    title: { control: "text" },
    defaultOpen: { control: "boolean" },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof AccordionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One item, so the trigger and its two states are visible on their own. */
export const Item: Story = {
  render: (args) => (
    <Accordion>
      <AccordionItem {...args} />
    </Accordion>
  ),
};

const BUREAUS = [
  {
    title: "Shri Amit Yadav, IAS (Secretary)",
    items: [
      "Overall leadership and administration of the Department of Social Justice and Empowerment",
      "Coordination of national flagship missions: PM-AJAY, SMILE, NAMASTE, SHRESHTA, PM YASASVI",
      "Statutory oversight across 17 autonomous commissions, corporations, and national foundations",
    ],
  },
  {
    title: "Shri Surendra Singh, IAS (Additional Secretary)",
    items: [
      "Supervision of National Scheduled Castes Finance & Development Corporation (NSFDC)",
      "National Backward Classes Finance & Development Corporation (NBCFDC)",
      "Administration of National Action Plan for Drug Demand Reduction (NAPDDR)",
    ],
  },
  {
    title: "Smt. Sumita Dawra, IAS (Joint Secretary)",
    items: [
      "Scholarship schemes for Scheduled Castes and Other Backward Classes",
      "Dr. Ambedkar Foundation and Babu Jagjivan Ram National Foundation",
    ],
  },
];

/**
 * The shape the estate actually uses: a stack whose **closed** state is the
 * useful one. Read the headings without opening anything — if they answer
 * "which of these do I want?", the accordion is doing its job.
 */
export const BureauList: Story = {
  render: () => (
    <Accordion>
      {BUREAUS.map((b) => (
        <AccordionItem key={b.title} title={b.title}>
          <ul style={{ margin: 0, paddingInlineStart: "1.25rem", display: "grid", gap: "0.5rem" }}>
            {b.items.map((item) => (
              <li key={item} style={{ lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ul>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * `defaultOpen` on the first item. Compare with `BureauList` above: the open
 * panel pulls the eye and makes the rest read as secondary, which is right
 * only when that panel really is the common case.
 */
export const FirstItemOpen: Story = {
  render: () => (
    <Accordion>
      {BUREAUS.map((b, i) => (
        <AccordionItem key={b.title} title={b.title} defaultOpen={i === 0}>
          <ul style={{ margin: 0, paddingInlineStart: "1.25rem", display: "grid", gap: "0.5rem" }}>
            {b.items.map((item) => (
              <li key={item} style={{ lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ul>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * Items open independently — this is an accordion, not a radio group, and
 * closing one to open another would lose a comparison the reader is mid-way
 * through. Open two at once to confirm.
 */
export const MultipleOpen: Story = {
  render: () => (
    <Accordion>
      {BUREAUS.map((b) => (
        <AccordionItem key={b.title} title={b.title} defaultOpen>
          <ul style={{ margin: 0, paddingInlineStart: "1.25rem", display: "grid", gap: "0.5rem" }}>
            {b.items.map((item) => (
              <li key={item} style={{ lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ul>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
