"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";

interface DocumentItem {
  title: string;
  date: string;
  href: string;
}

interface Persona {
  img: string;
  label: string;
  href: string;
}

const documents: DocumentItem[] = [
  {
    title: "Annual Report 2025-26 (English)",
    date: "22 Apr 2026",
    href: "/website/annual-reports",
  },
  {
    title: "Annual Report 2025-26 (Hindi)",
    date: "22 Apr 2026",
    href: "/website/annual-reports",
  },
  {
    title: "Result of National Overseas Scholarship (NOS) for SC candidates 2025-26 (2nd Round)",
    date: "18 Apr 2026",
    href: "/website/annual-reports",
  },
  {
    title: "Acceptance of Transgender Identity Certificate/Card in EPFO Records",
    date: "15 Apr 2026",
    href: "/website/notices",
  },
];

const personas: Persona[] = [
  {
    img: "/website/images/Beneficiary.png",
    label: "Beneficiary",
    href: "/website/for-beneficiary",
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
    <section className="bg-white py-12 md:py-16">
      <div className="sa-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
          {/* PART A — Recent Documents (Vertical List of 4 Rows) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-[26px] sm:text-[30px] font-semibold leading-tight text-primary-dark">
                  Recent Documents
                </h2>
                <Link
                  href="/website/annual-reports"
                  className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View All <Icon name="arrow_forward" size={16} />
                </Link>
              </div>

              <div className="mt-2 divide-y divide-gray-150">
                {documents.map((doc) => (
                  <div
                    key={doc.title}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4.5 hover:bg-gray-50/80 px-2 rounded-lg transition"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Icon name="description" size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] font-medium leading-snug text-ink line-clamp-2">
                          {doc.title}
                        </h3>
                        <p className="mt-1 text-xs text-ink-muted">{doc.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Link
                        href={doc.href}
                        className={buttonClasses("primary", "outlined", "sm", "text-xs px-3.5 py-1.5 whitespace-nowrap")}
                      >
                        View Online
                      </Link>
                      <Link
                        href={doc.href}
                        className={buttonClasses("primary", "filled", "sm", "text-xs px-3.5 py-1.5 whitespace-nowrap")}
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
            <div className="h-full rounded-2xl bg-[#0052b4] p-6 text-white flex flex-col justify-between shadow-md">
              <div>
                <h2 className="text-[22px] font-bold text-white">
                  Explore User Personas
                </h2>
                <p className="mt-1.5 text-xs text-white/80">
                  Choose your role to discover services made for you.
                </p>

                <div className="mt-6 flex justify-center">
                  <div className="relative h-44 w-44 overflow-hidden rounded-full border-2 border-white/20 bg-white/10 p-2 shadow-inner">
                    <Image
                      src={currentPersona.img}
                      alt={currentPersona.label}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setPersonaIndex(
                        (i) => (i - 1 + personas.length) % personas.length
                      )
                    }
                    aria-label="Previous persona"
                    className="p-1 hover:bg-white/20 rounded-full transition text-white"
                  >
                    <Icon name="chevron_left" size={20} />
                  </button>
                  <Link
                    href={currentPersona.href}
                    className="text-[15px] font-bold text-white hover:underline flex items-center gap-1.5"
                  >
                    {currentPersona.label}
                    <Icon name="arrow_forward" size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      setPersonaIndex((i) => (i + 1) % personas.length)
                    }
                    aria-label="Next persona"
                    className="p-1 hover:bg-white/20 rounded-full transition text-white"
                  >
                    <Icon name="chevron_right" size={20} />
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
