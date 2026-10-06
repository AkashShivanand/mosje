import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardBody, HeadlineFigure } from "@mosje/design-system";

/**
 * **HeadlineFigure** — a figure in display type, the phrase it completes, and its `context`
 * on a human scale. `size` is xl, lg or md; `tone="inverse"` sits on a filled Card or a
 * brand Band; `mark` holds a Live or Illustrative chip.
 *
 * Lifecycle: **Beta**.
 */
const meta = {
  title: "Components/Data Display/HeadlineFigure",
  component: HeadlineFigure,
  args: {
    value: "34.82 Cr",
    label: "people reached by Nasha Mukt Bharat Abhiyaan",
    context: "About 29 in every 100 people in India, at the Census 2011 count.",
    size: "xl",
  },
} satisfies Meta<typeof HeadlineFigure>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Lead: Story = {};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <HeadlineFigure size="lg" value="19,810" label="persons engaged in begging identified" />
      <HeadlineFigure size="md" value="₹1.77 lakh Cr" label="DAPSC allocation, B.E. 2026-27" mark={<span>Illustrative</span>} />
    </div>
  ),
};
/** On a filled card: `Card accent="fill"` with `tone="inverse"`. */
export const OnAFilledCard: Story = {
  render: (args) => (
    <Card tone="primary" accent="fill">
      <CardBody>
        <HeadlineFigure {...args} tone="inverse" />
      </CardBody>
    </Card>
  ),
};
