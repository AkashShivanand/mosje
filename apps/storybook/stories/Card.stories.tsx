import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardSubtitle,
  CardTitle,
} from "@mosje/design-system";

/**
 * **Card** — a surface that groups one coherent thing. Composed of
 * `CardHeader` / `CardBody` / `CardFooter`, with `CardTitle` and
 * `CardSubtitle` inside the header. Those sub-parts are documented here rather
 * than in stories of their own.
 *
 * Do not nest cards, and do not reach for one just to draw a border — a card
 * says "this belongs together", so an interface where everything is a card
 * says nothing at all. Lifecycle: **Stable**.
 *
 * `variant` sets the surface: `outlined` (a 1px border) is the default and the
 * right answer on a page of cards, because a grid of shadows reads as visual
 * noise. Use `elevated` for a card that genuinely floats above the page — one
 * lifted out of a list, a summary over a background.
 *
 * `orientation="horizontal"` places media beside the content instead of above
 * it. Reach for it in a list, where a row of tall vertical cards forces the
 * reader to scroll past each one.
 */
const meta = {
  title: "Components/Card",
  component: Card,
  args: { variant: "outlined", orientation: "vertical" },
  argTypes: {
    variant: { control: "inline-radio", options: ["outlined", "elevated"] },
    orientation: { control: "inline-radio", options: ["vertical", "horizontal"] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card>
        <CardHeader>
          <CardTitle>Pre-Matric Scholarship</CardTitle>
          <CardSubtitle>Scheduled Castes · 2026–27</CardSubtitle>
        </CardHeader>
        <CardBody>
          Applications are verified by the district officer before the state
          nodal officer releases funds.
        </CardBody>
        <CardFooter>
          <Button appearance="outlined" size="sm">View guidelines</Button>
          <Button size="sm">Apply</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

/** Header and footer are optional — content alone is a legitimate card. */
export const BodyOnly: Story = {
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <Card {...args}>
        <CardBody>
          19,810 beneficiaries identified across 36 states and union territories.
        </CardBody>
      </Card>
    </div>
  ),
};

/**
 * `outlined` is the default and the right answer on a page of cards — a grid of
 * shadows reads as noise. `elevated` is for a card that genuinely floats.
 */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Card {...args} variant="outlined">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
          <CardSubtitle>The default — a 1px border</CardSubtitle>
        </CardHeader>
        <CardBody>Use this on a page where several cards sit together.</CardBody>
      </Card>
      <Card {...args} variant="elevated">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardSubtitle>A shadow, no border</CardSubtitle>
        </CardHeader>
        <CardBody>Use this for a card lifted out of the page, not a grid of them.</CardBody>
      </Card>
    </div>
  ),
};

/**
 * `horizontal` places media beside the content. Better in a list, where tall
 * vertical cards make the reader scroll past each one.
 */
export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <Card {...args}>
        <CardBody>
          <CardTitle>Nasha Mukt Bharat Abhiyaan</CardTitle>
          <CardSubtitle>Mass Pledge · 18 August 2026</CardSubtitle>
          <p style={{ margin: "8px 0 0" }}>
            Blocks, line ministries and higher education institutions file a single
            report each. Reports are approved by the district, then the state.
          </p>
        </CardBody>
        <CardFooter>
          <Button appearance="outlined" size="sm">
            View reports
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
