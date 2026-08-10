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
 */
const meta = {
  title: "Components/Card",
  component: Card,
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
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card>
        <CardBody>
          19,810 beneficiaries identified across 36 states and union territories.
        </CardBody>
      </Card>
    </div>
  ),
};
