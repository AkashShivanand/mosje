import { Band, SectionTitle } from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";
import { CentreLocator } from "@/components/website-next/maps/CentreLocator";

/**
 * Find a de-addiction centre — the locator, on the home page.
 *
 * The live home page carries it and so does Figma ("Home — Secretary Review",
 * the "Nasha Mukt Bharat Abhiyaan Map" block: heading, filters, then the centres),
 * which is the same tool the dedicated page at /website/de-addiction-centres
 * renders. It is the one thing on this page a citizen may be looking for at the
 * moment they need it, so it is the tool itself rather than a card leading to it.
 *
 * WEIGHT: `CentreLocator` fetches the register only once the section comes near
 * the viewport (`useNearViewport`), so a reader who never scrolls this far
 * downloads none of it — the rule in live-data-fallback.md and §6 of
 * data-state-completeness.md. Nothing is bundled into the page for it.
 *
 * The centre names are h3 here, under this section's own h2, and h2 on the
 * dedicated page where the locator IS the page.
 */
export function Centres() {
  return (
    <Band as="section" tone="default" spacing="xl" aria-labelledby="centres-title">
      <SectionTitle
        size="display"
        headingId="centres-title"
        title={<T>Find a De-addiction Centre Near You</T>}
        description={
          <T>
            Nasha Mukti Kendras supported by the Department under the Nasha Mukt Bharat
            Abhiyaan, by state, district and type of centre.
          </T>
        }
      />
      {/* Five rows here, ten where the locator is the whole page: this section
          sits in a page that already runs to ten screens. */}
      <CentreLocator headingLevel={3} pageSize={5} />
    </Band>
  );
}
