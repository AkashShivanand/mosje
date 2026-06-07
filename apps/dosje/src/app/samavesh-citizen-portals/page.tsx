import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "SAMAVESH — Citizen Portals — DoSJE",
  description: "Single access to all citizen-facing portals and schemes under MoSJE.",
};

interface CitizenPortal {
  name: string;
  description: string;
  logo: string;
  href: string;
}

const PORTALS: CitizenPortal[] = [
  {
    name: "PM-AJAY",
    description: "Adarsh Gram, GIA and Hostel components for SC welfare and development.",
    logo: "/images/PM-AJAY-logo.png",
    href: "https://pmajay.dosje.gov.in",
  },
  {
    name: "National Overseas Scholarship",
    description: "Financial assistance for SC students pursuing higher studies abroad.",
    logo: "/images/NOS-Logo.png",
    href: "https://nosmsje.gov.in",
  },
  {
    name: "Nasha Mukt Bharat Abhiyaan",
    description: "Community outreach and de-addiction support for a drug-free India.",
    logo: "/images/NMBA-1.png",
    href: "https://nmba.dosje.gov.in",
  },
  {
    name: "Transgender Portal / SMILE",
    description: "National portal for transgender persons — identity certificates and welfare.",
    logo: "/images/Logo-Transgender-Portal-1.png",
    href: "https://transgender.dosje.gov.in",
  },
  {
    name: "NSFDC",
    description: "Concessional credit and skilling for Scheduled Caste entrepreneurs.",
    logo: "/images/nsfdc-1.png",
    href: "https://nsfdc.nic.in",
  },
  {
    name: "NSKFDC",
    description: "Finance and rehabilitation support for safai karamcharis and dependents.",
    logo: "/images/Logo-NSKFDC.png",
    href: "https://nskfdc.nic.in",
  },
  {
    name: "NBCFDC",
    description: "Loans and skill development for Other Backward Classes communities.",
    logo: "/images/NBCFDC.png",
    href: "https://nbcfdc.gov.in",
  },
  {
    name: "NISD",
    description: "Training and research in social defence, de-addiction and senior care.",
    logo: "/images/NISD-.png",
    href: "https://nisd.gov.in",
  },
  {
    name: "DAIC",
    description: "Dr. Ambedkar International Centre for social transformation and research.",
    logo: "/images/DAIC-LOGO-.png",
    href: "https://daic.dosje.gov.in",
  },
];

export default function CitizenPortalsPage() {
  return (
    <PageLayout
      title="SAMAVESH — Citizen Portals"
      breadcrumb={[{ label: "SAMAVESH" }, { label: "Citizen Portals" }]}
      description="Single access to all citizen-facing portals and schemes under MoSJE."
    >
      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PORTALS.map((portal) => (
              <div
                key={portal.name}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-surface-muted p-2">
                  <Image
                    src={portal.logo}
                    alt={`${portal.name} logo`}
                    width={56}
                    height={56}
                    className="h-full w-full object-contain"
                  />
                </div>
                <h2 className="mt-4 text-base font-semibold text-gov-blue-dark">
                  {portal.name}
                </h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">
                  {portal.description}
                </p>
                <a
                  href={portal.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gov-blue hover:text-gov-blue-dark"
                >
                  Visit Portal
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
