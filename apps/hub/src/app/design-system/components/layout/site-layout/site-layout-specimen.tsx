import * as React from "react";
import { Card, CardBody, Grid, GridItem } from "@mosje/design-system";

/**
 * SCHEMATIC (declared specimen) — the website page's regions, top to bottom.
 *
 * `SiteLayout` renders the page's single `<main>`. A live instance inside a
 * documentation page would nest a second `<main>` inside `docs-layout`'s own,
 * which is invalid HTML and gives a screen-reader user two candidate main
 * landmarks. The live article is the website itself; this is the arrangement,
 * drawn from design-system components so nothing here is an unbound literal.
 */
export function SiteLayoutSpecimen(): React.JSX.Element {
  return (
    <Grid rowGap="var(--sa-stack-8)">
      {[
        ["Header", "The public masthead — SiteHeader, variant website"],
        ["Banner", "Optional full-bleed strip directly under the header"],
        ["Hero", "Optional page hero or title band"],
        ["Children", "The content stack — every child is a Band"],
        ["Footer", "SiteFooter, variant website"],
        ["Overlays", "Outside the content flow — floating links and widgets"],
      ].map(([region, note]) => (
        <GridItem key={region} span={{ base: 12 }}>
          <Card>
            <CardBody>
              {region} — {note}
            </CardBody>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
}
