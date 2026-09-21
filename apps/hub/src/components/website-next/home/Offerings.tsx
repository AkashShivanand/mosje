import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { OFFERINGS, OFFERING_ICON } from "@/lib/website-next/schemes";

/**
 * What the Department offers — the ten kinds of support (11 Sep decision),
 * each opening the scheme finder filtered to it. Category · title · link only
 * (issue NAV-12: the classic Offerings cards carried a paragraph each).
 */
export function Offerings() {
  return (
    <section className="wn-section wn-section--muted" aria-labelledby="offerings-title">
      <div className="sa-container">
        <SectionTitle
          headingId="offerings-title"
          title="What the Department Offers"
        />
        <ul className="wn-offerings">
          {OFFERINGS.map((o) => (
            <li key={o.id}>
              <Link href={`/website/schemes-services?offer=${o.id}`} className="wn-offering">
                <span className="wn-offering__icon" aria-hidden>
                  <Icon name={OFFERING_ICON[o.id]} size={24} />
                </span>
                <span className="wn-offering__text">
                  <span className="wn-offering__label">{o.label}</span>
                  <span className="wn-offering__sub">{o.sub}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
