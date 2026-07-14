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
      <h2 className="text-[32px] font-semibold leading-tight text-gov-blue-dark">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-3xl text-[16px] text-ink-muted">{subtitle}</p>
    </div>
  );
}

export function NashaMuktBharat({ variant = "full" }: NashaMuktBharatProps) {
  if (variant === "band") {
    return (
      <section className="bg-[#f9fafb]" aria-labelledby="nmba-band-heading">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
          <div id="nmba-band-heading">
            <SectionHeading
              title="Nasha Mukt Bharat Abhiyaan"
              subtitle="Join the national movement for a drug-free India — take the pledge or volunteer as a Nasha Mukti Mitr."
            />
          </div>
          <div className="mt-10">
            <DualPledge />
          </div>
          <div className="mt-6">
            <NashaMuktiMitr />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "map") {
    return (
      <section className="bg-white" aria-labelledby="nmba-map-heading">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
          <div id="nmba-map-heading">
            <SectionHeading
              title="Find a De-addiction Centre near you"
              subtitle="Locate Nasha Mukti Kendras (De-addiction Centres) across India. No login required — search by state and district."
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
    <section className="bg-[#f9fafb]" aria-labelledby="nmba-heading">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
        <div id="nmba-heading">
          <SectionHeading
            title="Nasha Mukt Bharat Abhiyaan"
            subtitle="A national movement towards a drug-free India. Take the pledge, volunteer as a Nasha Mukti Mitr, or find a De-addiction Centre near you."
          />
        </div>

        <div className="mt-10">
          <DualPledge />
        </div>
        <div className="mt-6">
          <NashaMuktiMitr />
        </div>

        <div className="mt-14 border-t border-gray-200 pt-12">
          <h3 className="text-[24px] font-semibold leading-tight text-gov-blue-dark">
            Find a De-addiction Centre near you
          </h3>
          <p className="mt-2 text-[15px] text-ink-muted">
            Locate Nasha Mukti Kendras across India — no login required.
          </p>
          <div className="mt-8">
            <DeAddictionMap />
          </div>
        </div>
      </div>
    </section>
  );
}
