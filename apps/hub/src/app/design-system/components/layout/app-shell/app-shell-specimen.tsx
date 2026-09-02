import * as React from "react";
import { Card, CardBody, Grid, GridItem } from "@mosje/design-system";

/**
 * SCHEMATIC (declared specimen) — the shell's four regions, at rest.
 *
 * `AppShell` renders the page's single `<main>` and stands `100dvh` tall. A live
 * instance inside a documentation page would therefore nest a second `<main>`
 * inside `docs-layout`'s own, which is invalid HTML and leaves a screen-reader
 * user with two candidate main landmarks on a page that has one. The live
 * article is the portal itself; this is the arrangement, drawn from design-system
 * components so nothing here is an unbound literal.
 */
export function AppShellSpecimen(): React.JSX.Element {
  return (
    <Grid rowGap="var(--sa-stack-8)">
      <GridItem span={{ base: 12 }}>
        <Card>
          <CardBody>Header — the portal masthead, sticky, row height auto</CardBody>
        </Card>
      </GridItem>
      <GridItem span={{ base: 12, md: 4 }}>
        <Card>
          <CardBody>Sidebar — a column above the tablet anchor, a drawer below it</CardBody>
        </Card>
      </GridItem>
      <GridItem span={{ base: 12, md: 8 }}>
        <Card>
          <CardBody>Main — the page content, in the shell&rsquo;s single landmark, row height 1fr</CardBody>
        </Card>
      </GridItem>
      <GridItem span={{ base: 12 }}>
        <Card>
          <CardBody>Footer — optional, row height auto</CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
}
