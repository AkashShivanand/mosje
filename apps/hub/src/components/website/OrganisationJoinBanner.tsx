import { Icon } from "@mosje/design-system";
import type { OrganisationDetail } from "@/content/website/organisation-details";
import "./organisation-join-banner.css";

/**
 * The call-to-action band a campaign page opens with, above its own title.
 *
 * NMBA's source page leads with a green band carrying the volunteer invitation,
 * a Register Now button and the national de-addiction helpline — the campaign's
 * front door, above the h1. This estate folded it into the hero's quick actions,
 * which lost the invitation and moved the button below the page title.
 *
 * GREEN, AND DELIBERATELY NOT A BRAND COLOUR. The Abhiyaan publishes this band
 * in its own green, which is neither gov-blue nor saffron; it is the one place
 * on the estate where the campaign's identity outranks the department's, and it
 * is bound to the DS success ramp rather than to a literal.
 */
export function OrganisationJoinBanner({
  banner,
}: {
  banner: NonNullable<OrganisationDetail["joinBanner"]>;
}) {
  const external = banner.action.external || banner.action.href.startsWith("http");
  return (
    <section className="orgjb" aria-labelledby="orgjb-heading">
      <div className="sa-container orgjb__inner">
        <div className="orgjb__copy">
          <h2 id="orgjb-heading" className="orgjb__heading">
            {banner.heading}
          </h2>
          <p className="orgjb__text">{banner.text}</p>
        </div>

        <div className="orgjb__actions">
          <a
            className="orgjb__cta"
            href={banner.action.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            <span>{banner.action.label}</span>
            <Icon name={external ? "open_in_new" : "arrow_forward"} size={20} aria-hidden />
            {external && <span className="sr-only">(opens in a new tab)</span>}
          </a>

          {/* The helpline is a telephone number, so it dials. It reached this
              estate as a heading with the digits in a sibling element and no
              link at all. */}
          <a className="orgjb__helpline" href={`tel:${banner.helplineNumber}`}>
            <Icon name="call" size={20} aria-hidden />
            <span className="orgjb__helpline-label">{banner.helplineLabel}</span>
            <span className="orgjb__helpline-number">{banner.helplineNumber}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
