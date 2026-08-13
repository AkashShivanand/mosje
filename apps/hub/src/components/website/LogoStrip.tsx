import Image from "next/image";

interface EcosystemLogo {
  src: string;
  alt: string;
  href: string;
  width: number;
  height: number;
}

const logos: EcosystemLogo[] = [
  {
    src: "/website/images/data-gov.png",
    alt: "Open Government Data (OGD) Platform India",
    href: "https://data.gov.in/",
    width: 130,
    height: 48,
  },
  {
    src: "/website/images/india-gov.png",
    alt: "National Portal of India",
    href: "https://www.india.gov.in/",
    width: 130,
    height: 48,
  },
  {
    src: "/website/images/make-in-india.png",
    alt: "Make in India",
    href: "https://www.makeinindia.com/",
    width: 90,
    height: 48,
  },
  {
    src: "/website/images/my-gov.png",
    alt: "MyGov India",
    href: "https://www.mygov.in/",
    width: 130,
    height: 48,
  },
  {
    src: "/website/images/NeGD-Logo.svg",
    alt: "National e-Governance Division (NeGD)",
    href: "https://negd.gov.in/",
    width: 120,
    height: 48,
  },
  {
    src: "/website/images/DAIC-LOGO-.png",
    alt: "Dr. Ambedkar International Centre (DAIC)",
    href: "#",
    width: 120,
    height: 48,
  },
  {
    src: "/website/images/nsfdc-1.png",
    alt: "National Scheduled Castes Finance and Development Corporation (NSFDC)",
    href: "#",
    width: 120,
    height: 48,
  },
  {
    src: "/website/images/Logo-NSKFDC.png",
    alt: "National Safai Karamcharis Finance and Development Corporation (NSKFDC)",
    href: "#",
    width: 120,
    height: 48,
  },
  {
    src: "/website/images/NBCFDC.png",
    alt: "National Backward Classes Finance and Development Corporation (NBCFDC)",
    href: "#",
    width: 120,
    height: 48,
  },
  {
    src: "/website/images/NISD-.png",
    alt: "National Institute of Social Defence (NISD)",
    href: "#",
    width: 120,
    height: 48,
  },
  {
    src: "/website/images/PM-AJAY-logo.png",
    alt: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna (PM-AJAY)",
    href: "#",
    width: 120,
    height: 48,
  },
  {
    src: "/website/images/Logo-Transgender-Portal-1.png",
    alt: "National Portal for Transgender Persons (SMILE)",
    href: "#",
    width: 120,
    height: 48,
  },
  {
    src: "/website/images/NOS-Logo.png",
    alt: "National Overseas Scholarship (NOS)",
    href: "#",
    width: 120,
    height: 48,
  },
  {
    src: "/website/images/NMBA-1.png",
    alt: "Nasha Mukt Bharat Abhiyaan (NMBA)",
    href: "#",
    width: 120,
    height: 48,
  },
];

export function LogoStrip() {
  return (
    <section className="bg-surface-muted">
      <div className="sa-container py-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((logo) => (
            <li key={logo.src}>
              <a
                href={logo.href}
                className="block opacity-80 transition-opacity hover:opacity-100"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-12 w-auto object-contain"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
