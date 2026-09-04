"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Divider, Icon, buttonClasses } from "@mosje/design-system";
import { CarouselIndicators } from "./CarouselIndicators";

interface DocumentItem {
  title: string;
  date: string;
  href: string;
  /**
   * Document class, shown as "Type: X" [WEB-D-02, partially].
   * The design also shows a one-line description and "File: PDF (2.4 MB)".
   * `content/website/documents.json` carries neither — it holds only slug,
   * title, sourceUrl, date and category — so neither is rendered rather than
   * being fabricated for a government page.
   */
  type: string;
}

interface Persona {
  img: string;
  label: string;
  href: string;
}

const documents: DocumentItem[] = [
  {
    title: "Annual Report 2025-26 (English)",
    type: "Report",
    date: "22 Apr 2026",
    href: "/website/annual-reports",
  },
  {
    title: "Annual Report 2025-26 (Hindi)",
    type: "Report",
    date: "22 Apr 2026",
    href: "/website/annual-reports",
  },
  {
    title: "Result of National Overseas Scholarship (NOS) for SC candidates 2025-26 (2nd Round)",
    type: "Result",
    date: "18 Apr 2026",
    href: "/website/annual-reports",
  },
  {
    title: "Acceptance of Transgender Identity Certificate/Card in EPFO Records",
    type: "Circular",
    date: "15 Apr 2026",
    href: "/website/notices",
  },
];

/**
 * The four audiences the Department publishes a page for.
 *
 * Ordered broadest-public first and internal last: a citizen seeking help, then
 * students, then researchers, then officials.
 *
 * The Figma design (MoSJE WIP, node 2143-9874) names a fifth, "Divyangjan", in place
 * of Beneficiary. It is not built, deliberately. Disability is DEPwD's remit, not this
 * Department's — About Us records the Ministry's split into DoSJE and DEPwD, no scheme
 * in the estate's 141 mentions disability, and dosje.gov.in returns 404 for
 * /for-divyangjan. A persona card leading a disabled citizen into a department that
 * cannot serve them is worse than not offering the card.
 *
 * Researcher and Student artwork is the design's own export. Beneficiary and
 * Government Official keep the illustrations already in the repo: they are the same
 * transparent line-art family and read correctly on the navy panel, so re-exporting
 * them would be churn.
 */
const personas: Persona[] = [
  {
    img: "/website/images/Beneficiary.png",
    label: "Beneficiary",
    href: "/website/for-beneficiary",
  },
  {
    img: "/website/images/Student.png",
    label: "Student",
    href: "/website/for-student",
  },
  {
    img: "/website/images/Researcher.png",
    label: "Researcher",
    href: "/website/for-researcher",
  },
  {
    img: "/website/images/Government-Official.png",
    label: "Government Official",
    href: "/website/for-government-official",
  },
];

export function RecentDocuments() {
  const [personaIndex, setPersonaIndex] = useState(0);
  const currentPersona = personas[personaIndex] ?? personas[0]!;

  return (
    <section className="bg-surface py-12 md:py-16">
      <div className="sa-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
          {/* PART A — Recent Documents (Vertical List of 4 Rows) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-headline-2 text-primary-dark">
                  Recent Documents
                </h2>
                {/* Outlined button, not a text link [WEB-G-05]. */}
                <Button
                  appearance="outlined"
                  size="sm"
                  href="/website/annual-reports"
                  iconRight={<Icon name="arrow_forward" size={16} aria-hidden />}
                >
                  View All
                </Button>
              </div>

              {/* A 2 x 2 grid of cards, which is what the design draws. The
                  build shipped a single-column divided list [WEB-D-01]. */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {documents.map((doc) => (
                  <div
                    key={doc.title}
                    className="flex flex-col rounded-xl border border-gray-200 bg-surface-muted/40 p-4 transition hover:border-primary/40 hover:shadow-sm"
                  >
                    <h3 className="text-title-2 text-ink">
                      {doc.title}
                    </h3>
                    <p className="mt-1 text-body-3 text-ink-muted">{doc.date}</p>

                    {/* The design also carries a description here. It is not in
                        the document data — see DocumentItem.type. */}
                    <p className="mt-3 text-body-3 text-ink-muted">
                      Type: <span className="font-medium text-ink">{doc.type}</span>
                    </p>

                    <div className="mt-4 flex items-center justify-end gap-2 pt-1">
                      <Link
                        href={doc.href}
                        /* gov-blue is 4.4:1 on this card's pale ground — just
                           under AA. Same cause as the Offerings CTA: the DS
                           outlined button is correct on white and short of it on
                           every tint. primary-dark is 7.9:1 here. */
                        className={buttonClasses(
                          "primary",
                          "outlined",
                          "sm",
                          "text-label-2 px-3.5 py-1.5 whitespace-nowrap border-primary-dark text-primary-dark",
                        )}
                      >
                        View Online
                      </Link>
                      <Link
                        href={doc.href}
                        className={buttonClasses("primary", "filled", "sm", "text-label-2 px-3.5 py-1.5 whitespace-nowrap")}
                      >
                        Download
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PART B — Explore User Personas (Blue Card) */}
          <div className="lg:col-span-4">
            <div className="flex h-full flex-col justify-between rounded-2xl bg-primary-dark p-6 text-white shadow-md">
              <div>
                <h2 className="text-title-1 text-white">
                  Explore User Personas
                </h2>
                <p className="mt-1.5 text-body-3 text-white/80">
                  Choose your role to discover services made for you.
                </p>

                {/* Image container — square, navy, per the design. The illustrations
                    are transparent line art, so the panel behind them is what gives
                    them their colour. */}
                <div className="mt-6 overflow-hidden rounded-xl bg-navy">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={currentPersona.img}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 300px, 100vw"
                      className="object-cover object-bottom"
                      priority={false}
                    />
                  </div>
                </div>

                <Link
                  href={currentPersona.href}
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-lg py-1 text-title-1 text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  {currentPersona.label}
                  <Icon name="arrow_forward" size={20} aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-3">
                <Divider className="opacity-40" />
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setPersonaIndex(
                        (i) => (i - 1 + personas.length) % personas.length
                      )
                    }
                    aria-label="Previous persona"
                    className="flex size-10 items-center justify-center rounded-lg text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <Icon name="arrow_back" size={24} aria-hidden="true" />
                  </button>

                  <CarouselIndicators
                    count={personas.length}
                    activeIndex={personaIndex}
                    onSelect={setPersonaIndex}
                    label="Persona"
                    itemNoun="persona"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setPersonaIndex((i) => (i + 1) % personas.length)
                    }
                    aria-label="Next persona"
                    className="flex size-10 items-center justify-center rounded-lg text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <Icon name="arrow_forward" size={24} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
