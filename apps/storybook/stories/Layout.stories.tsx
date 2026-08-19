import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Container, Grid, GridItem, Band, Card, CardBody } from "@mosje/design-system";

/**
 * **Layout primitives** — `Container`, `Grid`, `GridItem` and `Band`: the three
 * pieces every page column is built from. Lifecycle: **Beta**.
 *
 * @covers Container, Grid, GridItem, Band
 *
 * **Container** applies the content cap *and* the responsive side margin
 * together, because they are one rule: the effective width is
 * `min(cap, viewport − 2 × margin)`. `size` picks the cap — `page` (the estate
 * default), `narrow` (960, a single-column form), `prose` (75ch, long-form
 * reading) or `full` (no cap). `as` changes the element where `section` or
 * `main` is the honest role. Never give a Container its own horizontal padding:
 * the margin is already there, and adding more narrows the column off-grid.
 *
 * **Grid** is twelve tracks at every breakpoint — a child spans more of them on
 * a small screen rather than the track count changing. That is UX4G's model, so
 * there is deliberately no "4-column mobile grid". `columns` exists for a
 * genuinely different system; `rowGap` separates row rhythm from the gutter
 * when a wrapped card grid needs it. **GridItem** takes `span` per breakpoint,
 * and omitted steps inherit the one below.
 *
 * **Band** is the website's repeating unit: a full-bleed section that paints
 * its `tone` edge to edge while the Container inside holds the column.
 * `spacing` sets the vertical rhythm; `container` picks the inner cap, or
 * `false` for content that must truly span the viewport. The common mistake is
 * a bare Container where a Band belongs — that gives a tint that stops short of
 * the viewport edge.
 */
const meta = {
  title: "Layout/Primitives",
  component: Container,
  parameters: { layout: "fullscreen" },
  args: { size: "page", as: "div", children: null },
  argTypes: {
    size: { control: "inline-radio", options: ["page", "narrow", "prose", "full"] },
    as: { control: "select", options: ["div", "section", "main", "article"] },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

const Swatch = ({ label }: { label: string }) => (
  <Card>
    <CardBody>{label}</CardBody>
  </Card>
);

export const ContainerSizes: Story = {
  render: (args) => (
    <div style={{ background: "var(--sa-bg-neutral-subtler)", paddingBlock: "var(--sa-section-32)" }}>
      <Container {...args}>
        <Card>
          <CardBody>
            The column above sits at the <strong>{args.size}</strong> cap, centred, with the
            responsive side margin already applied. Resize the canvas: below the cap the margin
            takes over and the column narrows with the viewport.
          </CardBody>
        </Card>
      </Container>
    </div>
  ),
};

export const TwelveColumnGrid: Story = {
  render: () => (
    <Container>
      <Grid>
        {Array.from({ length: 12 }, (_, i) => (
          <GridItem key={i} span={{ base: 12, md: 6, lg: 1 }}>
            <Swatch label={String(i + 1)} />
          </GridItem>
        ))}
      </Grid>
    </Container>
  ),
};

export const ResponsiveSpans: Story = {
  render: () => (
    <Container>
      <Grid rowGap="var(--sa-stack-24)">
        <GridItem span={{ base: 12, md: 6, lg: 4 }}>
          <Swatch label="Scholarships for Scheduled Castes" />
        </GridItem>
        <GridItem span={{ base: 12, md: 6, lg: 4 }}>
          <Swatch label="SMILE — Support for Marginalised Individuals" />
        </GridItem>
        <GridItem span={{ base: 12, md: 12, lg: 4 }}>
          <Swatch label="Nasha Mukt Bharat Abhiyaan" />
        </GridItem>
      </Grid>
    </Container>
  ),
};

export const BandTones: Story = {
  render: () => (
    <>
      <Band tone="default" spacing="s">
        <strong>default</strong> — the page ground.
      </Band>
      <Band tone="muted" spacing="s">
        <strong>muted</strong> — alternating website sections.
      </Band>
      <Band tone="brand" spacing="s">
        <strong>brand</strong> — a section that should carry brand presence.
      </Band>
      <Band tone="inverse" spacing="s">
        <strong>inverse</strong> — footers and high-contrast strips.
      </Band>
    </>
  ),
};

/**
 * A Band with `container={false}` spans the viewport — for a hero image or a
 * map, not for text. Shown beside the default so the difference is visible
 * rather than described.
 */
export const BandFullBleed: Story = {
  render: () => (
    <>
      <Band tone="muted" spacing="s">
        container=&quot;page&quot; — the column is capped and centred.
      </Band>
      <Band tone="brand" spacing="s" container={false}>
        <div style={{ paddingInline: "var(--sa-padding-16)" }}>
          container={"{false}"} — content runs to the viewport edge.
        </div>
      </Band>
    </>
  ),
};
