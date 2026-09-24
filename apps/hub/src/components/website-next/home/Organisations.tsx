import { Band, SectionTitle } from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";
import {
  ORGANISATIONS,
  organisationCategoryTabs,
} from "@/data/website/organisations";
import {
  OrganisationPicker,
  type OrgCard,
  type OrgCategory,
} from "./OrganisationPicker";

/**
 * Our Organisations — the bodies the Department works through, in the two
 * columns the design draws: what they are on the left, and on the right the
 * categories as chips with their counts and the cards of whichever is chosen.
 *
 * It was three stacked groups, every body on screen at once, under one
 * heading. The scheme portals left this section on 24 Sep 2026 for one of
 * their own, above the statistics.
 *
 * TWO THINGS THE DESIGN DRAWS AND THIS DOES NOT.
 *
 * The four bullets in its left column ("Promotes equality and social
 * participation for all communities", and three more) are not the
 * Department's words and are not traceable to anything it has published. Four
 * authored claims about what its organisations do is exactly what
 * `ui-restraint-and-copy.md` asks us not to put on a government page, so the
 * column carries the sourced description and stops there.
 *
 * And the chips are this registry's three categories rather than the design's
 * four: Figma splits the foundations into "Training & Capacity Building" (one
 * body) and "Foundation & Autonomous Bodies" (three), where the registry has
 * five foundations in one category. Splitting it is a registry change that
 * every organisation page would inherit, not a home-page decision.
 *
 * Every mark whole, in one fixed box on one ground (issues BRD-15, BRD-16);
 * the full name first and the abbreviation after it (ACC-25); one link per
 * card, the whole card clickable (LAY-07). Read from the registry, never
 * retyped, and the counts are counted rather than written down.
 */
export function Organisations() {
  const categories: OrgCategory[] = organisationCategoryTabs().filter(
    (t) => t.key !== "all" && t.key !== "schemes" && t.count > 0,
  );
  const keys = new Set(categories.map((c) => c.key));
  const orgs: OrgCard[] = ORGANISATIONS.filter((o) => keys.has(o.category)).map(
    (o) => ({
      id: o.id,
      category: o.category,
      name: o.name,
      abbr: o.abbr,
      href: o.profileHref,
      logoSrc: o.logoSrc,
    }),
  );

  return (
    /* MUTED, AND THE SECTIONS EITHER SIDE ARE THE REASON. The page alternates
       its grounds so a reader knows one section ended before reaching the next
       heading. After the reorder of 24 Sep 2026 this sat in 1,444px of unbroken
       white with Our Offerings above it. The ground is the edge. */
    <Band as="section" tone="muted" spacing="xl" aria-labelledby="orgs-title">
      <div className="wn-orgs2">
        <div className="wn-orgs2__copy">
          <SectionTitle
            size="display"
            headingId="orgs-title"
            title={<T>Our Organisations</T>}
            description={
              <T>
                The commissions, corporations and bodies the Department works
                through.
              </T>
            }
          />
        </div>
        <OrganisationPicker categories={categories} orgs={orgs} />
      </div>
    </Band>
  );
}
