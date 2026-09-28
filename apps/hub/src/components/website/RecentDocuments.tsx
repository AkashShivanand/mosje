"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Divider, Icon, IconButton, buttonClasses } from "@mosje/design-system";
import { CarouselIndicators } from "./CarouselIndicators";
import { RECENT_DOCUMENTS, RECENT_DOCUMENTS_SECTION } from "@/lib/website-shared/documents";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";

interface Persona {
  img: string;
  label: string;
  href: string;
}

/* The four documents are shared with every design (lib/website-shared/documents.ts):
   the live section's own, with its type, format and size. Until 28 Sep 2026 this
   file kept a list of its own — two of its four were not the live site's — and
   printed no file size because the register it was written from carries none. */
const documents = RECENT_DOCUMENTS.map((d) => ({ ...d, href: localiseDocumentUrl(d.file, d.title) }));

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
                  {RECENT_DOCUMENTS_SECTION.title}
                </h2>
                {/* Outlined button, not a text link [WEB-G-05]. */}
                <Button linkAs={Link}
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
                    <p className="mt-1 text-body-3 text-ink-muted">
                      <time dateTime={doc.dateTime}>{doc.date}</time>
                    </p>
                    <p className="mt-3 text-body-3 text-ink-muted">
                      Type: <span className="font-medium text-ink">{doc.type}</span>
                      {" • "}File: <span className="font-medium text-ink">{doc.format} ({doc.size})</span>
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
                        <span className="sr-only">: {doc.title}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PART B — Explore Specific Benefits (Blue Card) */}
          <div className="lg:col-span-4">
            <div className="flex h-full flex-col justify-between rounded-2xl bg-primary-dark p-6 text-white shadow-md">
              <div>
                <h2 className="text-title-1 text-white">
                  Explore Specific Benefits
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
                  <IconButton
                    icon={<Icon name="arrow_back" size={24} />}
                    aria-label="Previous persona"
                    variant="neutral"
                    appearance="text"
                    tone="inverse"
                    onClick={() =>
                      setPersonaIndex(
                        (i) => (i - 1 + personas.length) % personas.length
                      )
                    }
                  />

                  <CarouselIndicators
                    count={personas.length}
                    activeIndex={personaIndex}
                    onSelect={setPersonaIndex}
                    label="Persona"
                    itemNoun="persona"
                  />

                  <IconButton
                    icon={<Icon name="arrow_forward" size={24} />}
                    aria-label="Next persona"
                    variant="neutral"
                    appearance="text"
                    tone="inverse"
                    onClick={() =>
                      setPersonaIndex((i) => (i + 1) % personas.length)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
