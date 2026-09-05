import { DeAddictionMap } from "./DeAddictionMap";
import { DualPledge } from "./DualPledge";
import { NashaMuktiMitr } from "./NashaMuktiMitr";

type Variant = "full" | "band" | "map";

interface NashaMuktBharatProps {
  /**
   * - `full` — heading + pledge/Mitr + de-addiction map (Options A & B)
   * - `band` — pledge + Mitr action block, no map (Option C, top)
   * - `map`  — heading + de-addiction map only (Option C, bottom)
   */
  variant?: Variant;
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <h2 className="text-headline-2 text-primary-dark">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-measure text-body-1 text-ink-muted">
        {subtitle}
      </p>
    </div>
  );
}

const MAP_SUBTITLE =
  "Locate a Nasha Mukti Kendra near you — search by name, state, district or centre type. No login required.";

export function NashaMuktBharat({ variant = "full" }: NashaMuktBharatProps) {
  if (variant === "band") {
    return (
      <section className="bg-surface-muted" aria-labelledby="nmba-band-heading">
        <div className="sa-container py-12 md:py-16">
          <div id="nmba-band-heading">
            <SectionHeading
              title="Nasha Mukt Bharat Abhiyaan"
              subtitle="A national movement towards a drug-free India — take the pledge or volunteer as a Nasha Mukti Mitr."
            />
          </div>
          <div className="mx-auto mt-10 max-w-4xl space-y-5">
            <DualPledge />
            <NashaMuktiMitr />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "map") {
    return (
      <section className="bg-white" aria-labelledby="nmba-map-heading">
        <div className="sa-container py-12 md:py-16">
          <div id="nmba-map-heading">
            <SectionHeading
              title="Find a De-addiction Centre near you"
              subtitle={MAP_SUBTITLE}
            />
          </div>
          <div className="mt-10">
            <DeAddictionMap />
          </div>
        </div>
      </section>
    );
  }

  // full
  return (
    <section className="bg-surface-muted" aria-labelledby="nmba-heading">
      <div className="sa-container py-12 md:py-16">
        <div id="nmba-heading">
          <SectionHeading
            title="Nasha Mukt Bharat Abhiyaan"
            subtitle="A national movement towards a drug-free India. Take the pledge, volunteer as a Nasha Mukti Mitr, or locate a De-addiction Centre near you."
          />
        </div>

        <div className="mx-auto mt-10 max-w-4xl space-y-5">
          <DualPledge />
          <NashaMuktiMitr />
        </div>

        <div className="mt-16 border-t border-gray-200 pt-14">
          <div className="mb-8 text-center">
            <h3 className="text-headline-4 text-primary-dark">
              Find a De-addiction Centre near you
            </h3>
            <p className="mx-auto mt-2 max-w-measure text-body-1 text-ink-muted">
              {MAP_SUBTITLE}
            </p>
          </div>
          <DeAddictionMap />
        </div>
      </div>
    </section>
  );
}
