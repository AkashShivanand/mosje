import { T } from "@/components/i18n/translation-provider";
import Image from "next/image";
import Link from "next/link";
import { Band, SectionTitle } from "@mosje/design-system";
import {
  ORGANISATIONS,
  type OrganisationCategory,
} from "@/data/website/organisations";

const GROUPS: { key: OrganisationCategory; title: string }[] = [
  { key: "commissions", title: "Commissions" },
  { key: "corporations", title: "Finance and Development Corporations" },
  { key: "foundations", title: "Foundations and Autonomous Bodies" },
];

/**
 * Our Organisations.
 *
 * The scheme portals left this section on 24 Sep 2026 for one of their own,
 * where the design puts them — above the statistics and below About Us. A
 * citizen looking for somewhere to apply was scrolling past three groups of
 * commissions and corporations to reach them.
 *
 * Every mark whole, in one fixed box on one ground (the lead's instruction,
 * issues BRD-15 and BRD-16); the full name first and the abbreviation after it
 * (ACC-25); one link per card, the whole card clickable (LAY-07). Read from the
 * organisation registry, never retyped.
 */
export function Organisations() {
  return (
    <Band as="section" tone="default" spacing="xl" aria-labelledby="orgs-title">
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
      <div className="wn-orgs">
        {GROUPS.map((g) => {
          const orgs = ORGANISATIONS.filter((o) => o.category === g.key);
          if (orgs.length === 0) return null;
          return (
            <div key={g.key} className="wn-orgs__group">
              <h3 className="wn-orgs__heading">{g.title}</h3>
              <ul className="wn-orgs__list">
                {orgs.map((o) => (
                  <li key={o.id}>
                    <Link href={o.profileHref} className="wn-org">
                      <span className="wn-org__mark">
                        <Image src={o.logoSrc} alt="" width={48} height={48} />
                      </span>
                      <span className="wn-org__name">
                        {o.name}{" "}
                        <span className="wn-org__abbr">({o.abbr})</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Band>
  );
}
