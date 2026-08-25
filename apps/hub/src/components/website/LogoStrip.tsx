import Image from "next/image";
import { ORGANISATIONS } from "@/data/website";

/**
 * The homepage logo strip: Government of India platforms, then the Ministry's own bodies.
 *
 * The two halves are kept apart because they are different things. The platforms below are
 * not our organisations and have no entry in the registry; the Ministry's bodies are read
 * from it, so their names cannot drift out of step with the rest of the site — which had
 * already happened here, this file spelling DAIC "Dr. Ambedkar International Centre" while
 * the registry said "Dr Ambedkar".
 *
 * Their links were also all `href: "#"` — every external partner logo was clickable and
 * not one of the Ministry's own was. They resolve to the organisation's profile now.
 */

interface EcosystemLogo {
  src: string;
  alt: string;
  href: string;
  width: number;
}

const GOVERNMENT_PLATFORMS: EcosystemLogo[] = [
  {
    src: "/website/images/data-gov.png",
    alt: "Open Government Data (OGD) Platform India",
    href: "https://data.gov.in/",
    width: 130,
  },
  {
    src: "/website/images/india-gov.png",
    alt: "National Portal of India",
    href: "https://www.india.gov.in/",
    width: 130,
  },
  {
    src: "/website/images/make-in-india.png",
    alt: "Make in India",
    href: "https://www.makeinindia.com/",
    width: 90,
  },
  {
    src: "/website/images/my-gov.png",
    alt: "MyGov India",
    href: "https://www.mygov.in/",
    width: 130,
  },
  {
    src: "/website/images/NeGD-Logo.svg",
    alt: "National e-Governance Division (NeGD)",
    href: "https://negd.gov.in/",
    width: 120,
  },
];

/** Organisations that publish a horizontal wordmark, in registry order. */
const ORGANISATION_LOGOS: EcosystemLogo[] = ORGANISATIONS.filter(
  (org) => org.wordmarkSrc
).map((org) => ({
  src: org.wordmarkSrc!,
  alt: `${org.name} (${org.abbr})`,
  href: org.profileHref,
  width: 120,
}));

const logos: EcosystemLogo[] = [...GOVERNMENT_PLATFORMS, ...ORGANISATION_LOGOS];

export function LogoStrip() {
  return (
    <section className="bg-surface">
      <div className="sa-container py-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((logo) => {
            const isExternal = logo.href.startsWith("http");
            return (
              <li key={logo.src}>
                <a
                  href={logo.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  className="block opacity-80 transition-opacity hover:opacity-100"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={48}
                    className="h-12 w-auto object-contain"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
