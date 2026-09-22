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
  { key: "schemes", title: "Scheme Portals" },
];

/**
 * Organisations & Scheme Portals (14 Sep menu option M1b's label).
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
        title={<T>Organisations & Scheme Portals</T>}
        description={
          <T>
            The commissions, corporations and bodies that work with the
            Department, and the portals of its national schemes.
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
