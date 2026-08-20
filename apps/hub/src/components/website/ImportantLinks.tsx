"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@mosje/design-system";

interface LinkGroup {
  category: string;
  items: { label: string; href: string }[];
}

const CATEGORIZED_LINKS: LinkGroup[] = [
  {
    category: "Scheduled Caste Welfare",
    items: [
      { label: "About the Division: Scheduled Caste Welfare", href: "/website/about-the-division" },
      { label: "List of Scheduled Castes", href: "/website/list-of-scheduled-castes" },
      { label: "Policies / Acts / Rules / Circular", href: "/website/policies-acts-rules-circular" },
    ],
  },
  {
    category: "Welfare Of The Other Backward Classes",
    items: [
      { label: "About the Division: Welfare Of The Other Backward Classes", href: "/website/about-the-division-welfare-of-the-other-backward-classes" },
      { label: "Policies / Acts / Rules / Codes / Circular", href: "/website/policies-acts-rules-codes-circular" },
      { label: "Welfare Of The Other Backward Classes FAQs", href: "/website/welfare-of-the-other-backward-classes" },
    ],
  },
  {
    category: "Grants-In-Aid To NGOs",
    items: [
      { label: "Prioritization Guidelines for funding Projects by Voluntary Organisations", href: "/website/prioritization-guidelines-for-funding-projects-by-vuluntary-organisations" },
      { label: "Procedure for processing Grant-in-Aid Cases for Voluntary Organisations", href: "/website/procedure-for-processing-grant-in-aid-cases-in-respect-of-voluntary-organisations" },
      { label: "Inspection and Monitoring Procedure", href: "/website/inspection-and-monitoring-procedure" },
      { label: "Guidelines for Assisting NGOs / Voluntary Organisations", href: "/website/guidelines-for-assisting-ngos-voluntary-organisations" },
      { label: "Online Portal for Grant in Aid Schemes (e-Anudaan)", href: "https://grants-msje.gov.in/ngo-login" },
    ],
  },
  {
    category: "Budget And Account",
    items: [
      { label: "Detailed Demand For Grant", href: "/website/detailed-demand-for-grant" },
      { label: "Contact Person", href: "/website/contact-person" },
    ],
  },
  {
    category: "Social Defence",
    items: [
      { label: "Rashtriya Vayoshri Yojana", href: "https://alimco.in/" },
      { label: "About the Division: Social Defence", href: "/website/about-the-division-social-defence" },
      { label: "Drug Division", href: "/website/drug-division" },
      { label: "Social Defence FAQs", href: "/website/social-defence-faqs" },
    ],
  },
  {
    category: "Public Grievance",
    items: [
      { label: "Public Grievance Redressal Mechanism (CPGRAMS)", href: "https://pgportal.gov.in/" },
    ],
  },
  {
    category: "Statistics Division",
    items: [
      { label: "SECC 2011", href: "https://secc.dord.gov.in/" },
      { label: "About the Division: Statistics Division", href: "/website/about-the-division-statistics-division" },
      { label: "Handbook on Social Welfare Statistics", href: "/website/handbook-on-social-welfare-statistics" },
    ],
  },
  {
    category: "Official Language",
    items: [
      { label: "Official Language: Background", href: "/website/official-language-background" },
      { label: "Official Language Act", href: "/website/official-language-act" },
      { label: "Activities of the Ministry: Official Language", href: "/website/activities-of-the-ministry-official-language" },
    ],
  },
  {
    category: "Parliamentary Matters",
    items: [
      { label: "Assurances", href: "/website/assurances" },
      { label: "Special Mention / Matters Raised Under Rule 377", href: "/website/special-mention-matters-raised-under-377" },
    ],
  },
  {
    category: "Plan Division",
    items: [
      { label: "About the Division: Plan Division", href: "/website/about-the-division-2" },
    ],
  },
];

export function ImportantLinks() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-label="Open Important Links"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        data-sa-wall-occupant
        // 175px with the label, ~52 without. Declared rather than measured so
        // that going compact cannot change the input to the decision that
        // made it compact — see WALL_NATURAL_ATTR in foundations/wall-rail.ts.
        data-sa-wall-natural="175"
        className="fixed right-0 top-[42%] z-[1002] flex flex-col items-center gap-2 rounded-l-lg bg-primary px-2 py-4 text-white shadow-md transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        <Icon name="link" size={20} aria-hidden="true" />
        {/* Dropped when the right wall runs out of room, leaving the icon
            and the full hit area. The button keeps its `aria-label`, so the
            accessible name survives the label going — a screen reader is
            unaffected by a space problem it cannot see. */}
        <span
          data-sa-wall-label
          className="text-[14px] font-semibold tracking-wide"
          style={{ writingMode: "vertical-rl" }}
        >
          Important Links
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[1055] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="important-links-title"
        >
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 bg-primary px-5 py-4">
              <h2
                id="important-links-title"
                className="text-[18px] font-semibold text-white"
              >
                Important Links Directory
              </h2>
              <button
                type="button"
                aria-label="Close Important Links"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Image
                  src="/website/images/close-icon-white.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="max-h-[70vh] divide-y divide-gray-100 overflow-y-auto p-5">
              {CATEGORIZED_LINKS.map((group) => (
                <div key={group.category} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="mb-2 text-[14px] font-bold uppercase tracking-wider text-primary-dark">
                    {group.category}
                  </h3>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                          className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[14px] font-medium text-ink transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <span className="min-w-0 flex-1">{item.label}</span>
                          <Icon name={item.href.startsWith("http") ? "open_in_new" : "chevron_right"} size={16} className="shrink-0 text-primary-dark/60" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
