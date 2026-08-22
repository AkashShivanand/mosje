import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem } from "@mosje/design-system";

/**
 * **Accordion** — a stack of disclosures where each `AccordionItem` hides its
 * body until asked for. `AccordionItem` is documented here rather than in a
 * story of its own, because one on its own is not a pattern.
 *
 * Reach for it when a page carries several sections a reader will want *one*
 * of — an FAQ, a long form's optional detail, a scheme's eligibility rules.
 * Do not use it to hide something every reader needs: a step nobody opens is a
 * step nobody completes, and collapsing required content is how forms get
 * abandoned. Lifecycle: **Stable**.
 *
 * `defaultOpen` starts an item expanded. Open the first one when the reader
 * almost always wants it — it shows the shape of what is inside the rest.
 */
const meta = {
  title: "Components/Data display/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Accordion>
      <AccordionItem title="Who can apply for grant-in-aid?" defaultOpen>
        <p>
          Any NGO or voluntary organisation registered under the Societies Registration Act 1860
          or as a charitable trust, and listed on NITI Aayog&apos;s NGO-Darpan.
        </p>
      </AccordionItem>
      <AccordionItem title="How long does an application take?">
        <p>
          Ministry officers review an application and its documents in seven to fourteen working
          days. The standard end-to-end process is thirty days.
        </p>
      </AccordionItem>
      <AccordionItem title="What happens if a document is rejected?">
        <p>
          The application is returned to you with the reason recorded against the document. You
          can replace that file and resubmit without starting again.
        </p>
      </AccordionItem>
    </Accordion>
  ),
};

/** A single item, closed — the resting state of every row in the stack. */
export const SingleItem: Story = {
  render: () => (
    <Accordion>
      <AccordionItem title="Utilisation Certificate (GFR 12-A)">
        <p>Required for the previous financial year, signed by a chartered accountant.</p>
      </AccordionItem>
    </Accordion>
  ),
};
