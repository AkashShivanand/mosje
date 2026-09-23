import { T } from "@/components/i18n/translation-provider";
import Image from "next/image";
import Link from "next/link";
import {
  Band,
  FactStrip,
  Icon,
  SectionTitle,
  buttonClasses,
} from "@mosje/design-system";
import { ORGANISATIONS } from "@/data/website/organisations";
import { GLANCE } from "./facts";

/**
 * Scheme Portals, and the Department's standing figures beneath them.
 *
 * Figma "Home — Secretary Review", the section between About Us and Take a
 * Pledge: six portal cards over a statistics bar. Both halves were on this page
 * already and neither was where the design puts it — the portals were the
 * fourth group inside Organisations, where a citizen looking for somewhere to
 * apply had to scroll past three groups of commissions and corporations to
 * reach them, and the figures were a strip at the foot of About the Department.
 *
 * The card leads with the abbreviation because that is what the portal is
 * called — a citizen is sent to "PM-AJAY", not to "Pradhan Mantri Anusuchit
 * Jaati Abhyuday Yojana" — with the full name under it (ACC-25). Read from the
 * organisation registry, never retyped; the registry's own order is kept.
 *
 * The figures and their sources are `facts.ts`. They are the three the
 * Department publishes, and nothing here derives a fourth.
 */
/*
 * The design's own order, which is not the registry's: the two schemes that
 * reach the most people first, then the four addressed to one group each. The
 * registry orders by when each portal joined the estate, which is a fact about
 * us rather than about the citizen reading the row.
 */
const ORDER = ["PM-AJAY", "NMBA", "SCW", "SMILE", "NOS", "NHAA"];

export function SchemePortals() {
  const portals = ORGANISATIONS.filter((o) => o.category === "schemes").sort(
    (a, b) => ORDER.indexOf(a.abbr) - ORDER.indexOf(b.abbr),
  );

  return (
    <Band
      as="section"
      tone="default"
      spacing="xl"
      aria-labelledby="scheme-portals-title"
    >
      <SectionTitle
        size="display"
        headingId="scheme-portals-title"
        title={<T>Scheme Portals</T>}
        description={
          <T>
            Apply for, track and manage the Department&rsquo;s schemes on their
            own portals.
          </T>
        }
      >
        <Link href="/portals" className="wn-home-more">
          <T>View All Portals</T>
          <Icon name="arrow_forward" size={20} aria-hidden />
        </Link>
      </SectionTitle>

      <ul className="wn-home-portals">
        {portals.map((o) => (
          <li key={o.id}>
            <Link href={o.profileHref} className="wn-home-portal">
              <span className="wn-home-portal__mark">
                <Image src={o.logoSrc} alt="" width={56} height={56} />
              </span>
              <span className="wn-home-portal__abbr">{o.abbr}</span>
              <span className="wn-home-portal__name">{o.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="wn-home-glance">
        <FactStrip
          ariaLabel="The Department at a Glance"
          items={GLANCE.map((g) => ({
            icon: g.icon,
            value: g.value,
            label: g.label,
            note: g.note,
          }))}
        />
        <Link
          href="/website/dashboard"
          className={buttonClasses(
            "primary",
            "outlined",
            "md",
            "wn-home-glance__cta",
          )}
        >
          <T>View Dashboard</T>
          <Icon name="arrow_forward" size={20} aria-hidden />
        </Link>
      </div>
    </Band>
  );
}
