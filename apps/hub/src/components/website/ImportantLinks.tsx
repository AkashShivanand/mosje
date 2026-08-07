"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@mosje/design-system";

interface ImportantLink {
  label: string;
  href: string;
}

const links: ImportantLink[] = [
  { label: "MyGov", href: "https://www.mygov.in" },
  {
    label: "India.gov.in (National Portal)",
    href: "https://www.india.gov.in",
  },
  { label: "Data.gov.in", href: "https://data.gov.in" },
  { label: "Digital India", href: "https://www.digitalindia.gov.in" },
  { label: "PG Portal (CPGRAMS)", href: "https://pgportal.gov.in" },
  { label: "RTI Online", href: "https://rtionline.gov.in" },
  { label: "Make in India", href: "https://www.makeinindia.com" },
  { label: "PM India", href: "https://www.pmindia.gov.in" },
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
        className="fixed right-0 top-[42%] z-[1002] flex flex-col items-center gap-2 rounded-l-lg bg-gov-blue px-2 py-4 text-white shadow-md transition-colors hover:bg-gov-blue-dark"
      >
        <Icon name="link" size={20} aria-hidden="true" />
        <span
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

          <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-3 bg-gov-blue px-5 py-4">
              <h2
                id="important-links-title"
                className="text-[18px] font-semibold text-white"
              >
                Important Links
              </h2>
              <button
                type="button"
                aria-label="Close Important Links"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/15"
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

            <ul className="max-h-[60vh] divide-y divide-gray-100 overflow-y-auto">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 px-5 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-surface-muted hover:text-gov-blue"
                  >
                    <span>{link.label}</span>
                    <Icon name="open_in_new" size={16} className="shrink-0 text-gov-blue" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
