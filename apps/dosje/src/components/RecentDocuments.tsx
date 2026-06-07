import Image from "next/image";
import { ArrowRight, FileText } from "lucide-react";
import { Button, Card } from "@mosje/design-system";

interface DocumentItem {
  title: string;
  date: string;
}

interface Persona {
  img: string;
  label: string;
  href: string;
}

const documents: DocumentItem[] = [
  { title: "Annual Report 2025-26 (English)", date: "22 Apr 2026" },
  { title: "Annual Report 2025-26 (Hindi)", date: "22 Apr 2026" },
  {
    title:
      "Result of National Overseas Scholarship (NOS) for SC candidates 2025-26 (2nd Round)",
    date: "18 Apr 2026",
  },
  {
    title:
      "Acceptance of Transgender Identity Certificate/Card in EPFO Records",
    date: "15 Apr 2026",
  },
  {
    title:
      "Fighting Against The Stigma & Stereotype Attached To Recovered Drug Dependents",
    date: "10 Apr 2026",
  },
];

const personas: Persona[] = [
  {
    img: "/images/Beneficiary.png",
    label: "Beneficiary",
    href: "/for-beneficiary",
  },
  {
    img: "/images/Government-Official.png",
    label: "Government Official",
    href: "/for-government-official",
  },
];

export function RecentDocuments() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          {/* PART A — Recent Documents */}
          <div className="lg:col-span-3">
            <h2 className="text-[30px] font-semibold leading-tight text-gov-blue-dark">
              Recent Documents
            </h2>

            <ul className="mt-6">
              {documents.map((doc) => (
                <li
                  key={doc.title}
                  className="flex items-start gap-4 border-b border-gray-200 py-4 first:pt-0"
                >
                  <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gov-blue/10 text-gov-blue">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium leading-snug text-ink">
                      {doc.title}
                    </p>
                    <p className="mt-1 text-[13px] text-ink-muted">{doc.date}</p>
                  </div>
                  <Button
                    href="/annual-reports"
                    appearance="text"
                    size="sm"
                    className="mt-0.5 flex-shrink-0"
                  >
                    View Online
                  </Button>
                </li>
              ))}
            </ul>

            <Button
              href="/annual-reports"
              appearance="text"
              size="sm"
              iconRight={<ArrowRight className="h-4 w-4" />}
              className="mt-6"
            >
              View All Documents
            </Button>
          </div>

          {/* PART B — Explore User Personas */}
          <div className="lg:col-span-2">
            <h2 className="text-[30px] font-semibold leading-tight text-gov-blue-dark">
              Explore User Personas
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              Choose your role to discover services made for you.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {personas.map((persona) => (
                <Card
                  key={persona.label}
                  variant="outlined"
                  className="group shadow-sm transition hover:shadow-md"
                >
                  <Image
                    src={persona.img}
                    alt={persona.label}
                    width={400}
                    height={250}
                    className="h-[200px] w-full rounded-lg object-cover"
                  />
                  <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-[17px] font-medium text-ink">
                      {persona.label}
                    </span>
                    <Button
                      href={persona.href}
                      appearance="text"
                      size="sm"
                      aria-label={`Explore services for ${persona.label}`}
                      iconRight={
                        <ArrowRight className="h-5 w-5 text-gov-blue transition-transform group-hover:translate-x-1" />
                      }
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
