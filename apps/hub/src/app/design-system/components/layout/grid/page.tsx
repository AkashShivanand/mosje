import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Card, Grid, GridItem } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Grid — Design System",
  description:
    "The twelve-column layout grid, as a component. Twelve tracks at every breakpoint; a child spans more of them on a small screen.",
};


const A11Y: A11yItem[] = [
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    description:
      "The grid never reorders its children; the DOM order is the reading order at every width. Do not reach for `order` or `grid-row` to move a cell visually — that separates the reading order from the visual one, which is precisely what this criterion forbids.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "Spans are clamped to 1…columns by the grid, so an over-wide span wraps to the next row rather than overflowing and forcing a horizontal scrollbar.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "Tracks are fractional, not fixed, so raising the browser font size grows the content inside a cell instead of clipping it against a pixel width.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The grid is presentational: it adds no roles and no landmarks. Where the cells are a list of like things, wrap them in a real `<ul>`/`<li>` rather than relying on the visual arrangement to say so.",
  },
];

export default function GridPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Grid"
      status="Stable"
      summary="The twelve-column layout grid, as a component. Twelve tracks at every breakpoint: a child spans more of them on a small screen rather than the track count changing."
      figma={{
        absent:
          "The grid is published as the Layout Grid foundation page in the SAMAVESH library, not as a component master.",
      }}
      specimen={
        <Grid columns={12}>
          <GridItem span={{ base: 12, lg: 8 }}>
            <Card>Main column — 8 of 12 from the desktop anchor, full width below it.</Card>
          </GridItem>
          <GridItem span={{ base: 12, lg: 4 }}>
            <Card>Rail — 4 of 12.</Card>
          </GridItem>
        </Grid>
      }
      propsFrom="GridProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page-level column layout — an article with a rail, a dashboard split, a two-column form.",
          "A layout whose proportions must change at a breakpoint rather than simply wrapping.",
          "Anywhere the estate's twelve-column rhythm has to be honoured across several sections.",
        ],
        avoid: [
          "A row of equal cards that simply wraps — a flex row is simpler and needs no column arithmetic.",
          "Positioning two elements beside each other inside a card — that is flexbox.",
          "A data table — use Data Table, which carries the row and column semantics a grid does not.",
        ],
      }}
      related={[
        {
          label: "Container",
          href: "/design-system/components/layout/container",
          reason: "the column the grid is laid out inside",
        },
        {
          label: "Band",
          href: "/design-system/components/layout/band",
          reason: "the full-bleed section a grid usually sits in",
        },
        {
          label: "Dashboard Grid",
          href: "/design-system/components/dashboard/dashboard-grid",
          reason: "for a dashboard's card matrix, which carries its own span rules",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-twelve">
            <h2 id="cdp-twelve" className="cdp__h2">
              Twelve Tracks at Every Width
            </h2>
            <p>
              The track count never changes. A child spans more of the twelve on a small screen —
              which is UX4G&apos;s model, and Bootstrap&apos;s — so there is no four-column
              mobile grid here, and a span written for one breakpoint stays arithmetically valid
              at the others.
            </p>
            <MatrixTable
              caption="How a span resolves across the breakpoints"
              columns={["span", "Below tablet", "Tablet", "Desktop"]}
              rows={[
                ["{ base: 12, lg: 4 }", "12 of 12", "12 of 12", "4 of 12"],
                ["{ base: 12, md: 6, lg: 4 }", "12 of 12", "6 of 12", "4 of 12"],
                ["{ base: 6 }", "6 of 12", "6 of 12", "6 of 12"],
                ["omitted", "12 of 12", "12 of 12", "12 of 12"],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-gutters">
            <h2 id="cdp-gutters" className="cdp__h2">
              Gutters Are the Grid&apos;s, Not the Cell&apos;s
            </h2>
            <p>
              The gutter is set by the grid and the row gap defaults to match it, which is what
              keeps a wrapped card grid square. Simulating a gutter with a margin on the cell
              double-counts it at every wrap and leaves the last column short by one gutter
              against the container edge.
            </p>
            <Callout type="info" title="Row gap is the one that legitimately differs">
              A grid of cards with long titles often wants more air between rows than between
              columns, because the vertical gap has to separate two blocks of text rather than
              two card edges. That is what <code>rowGap</code> is for — pass a token reference,
              never a number.
            </Callout>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-griditem">
            <h2 id="cdp-griditem" className="cdp__h2">
              GridItem
            </h2>
            <p>
              One cell of a Grid, and only meaningful as its direct child. <code>span</code> takes
              a <code>GridSpan</code> — <code>&#123; base?, md?, lg? &#125;</code> — where an
              omitted step inherits the one below it.
            </p>
            <PropsTable from="GridItemProps" />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Grid, GridItem } from "@mosje/design-system";

// An article with a rail: one column below desktop, eight and four above it.
<Grid>
  <GridItem span={{ base: 12, lg: 8 }}>
    <SchemeArticle />
  </GridItem>
  <GridItem span={{ base: 12, lg: 4 }}>
    <RelatedLinks />
  </GridItem>
</Grid>`}</CodeBlock>
          <p>
            A three-up card row that becomes two-up on a tablet and one-up on a phone is three
            spans and no media query.
          </p>
          <CodeBlock>{`<Grid rowGap="var(--sa-stack-24)">
  {schemes.map((scheme) => (
    <GridItem key={scheme.id} span={{ base: 12, md: 6, lg: 4 }}>
      <SchemeCard scheme={scheme} />
    </GridItem>
  ))}
</Grid>`}</CodeBlock>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-order">
          <h2 id="cdp-order" className="cdp__h2">
            Reading Order
          </h2>
          <p>
            The grid places cells in DOM order at every width, so the order a sighted reader sees
            is the order a screen reader announces and the order the Tab key follows. Keep it
            that way: CSS <code>order</code>, an explicit <code>grid-row</code>, or a{" "}
            <code>direction</code> flip will move a cell visually while leaving it where it was
            in the accessibility tree, and the two orders then disagree.
          </p>
          <p>
            Where the desired visual order genuinely differs from the reading order — a rail that
            should appear above the article on a phone — change the DOM order and let both follow
            it, rather than moving the cell with CSS.
          </p>
        </section>
      }
    />
  );
}
