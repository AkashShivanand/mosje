import { DeAddictionMap } from "@/components/website/nmba/DeAddictionMap";
import { PUBLISHED_TOTAL } from "@/content/website/deaddiction-centres";

/**
 * The home-page de-addiction centre locator.
 *
 * This section used to render a mockup: a dotted placeholder panel with three
 * floating label pills standing in for the map, a single hard-coded centre card
 * standing in for the results list, and two dropdowns with no free-text search
 * and no geolocation. Meanwhile the real locator — 487 geo-tagged centres from
 * the Nasha Mukt Bharat Abhiyaan endpoint, on a Leaflet map, with search,
 * filters and "use my location" — was already shipping one route away at
 * /website/de-addiction-centres.
 *
 * So this is not a new build; it is the home page finally using the component
 * that already existed. Rebuilding a second locator here would have left the
 * estate with two of them, drifting apart on their own data.
 *
 * `mapSide="left"` is the only difference from the dedicated page: the Figma
 * frame leads with the map and puts the results rail on the right.
 */
export function DeaddictionMapSection() {
  return (
    <section
      className="bg-surface-muted border-y border-border py-12 md:py-16"
      aria-labelledby="map-section-heading"
    >
      <div className="sa-container">
        <div className="text-center">
          <h2
            id="map-section-heading"
            className="text-headline-2 text-primary-dark"
          >
            Find a De-addiction Centre Near You
          </h2>
          <p className="mt-2 text-body-1 text-ink-muted">
            {PUBLISHED_TOTAL} Nasha Mukti Kendras across India.
          </p>
        </div>

        <div className="mt-8">
          <DeAddictionMap mapSide="left" compact />
        </div>
      </div>
    </section>
  );
}
