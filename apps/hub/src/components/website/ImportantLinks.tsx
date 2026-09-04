"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@mosje/design-system";
import { DIVISIONS } from "@/data/website";

/**
 * The rail's contents now come from `DIVISIONS` in the data layer, not from a list kept
 * here. The list that used to live in this file was an incomplete transcription of the
 * Department's own rail — nine entries short, six of them from Grants-in-Aid alone — and
 * five of those pointed at pages this estate had already built and never linked.
 *
 * Four entries deliberately point at dosje.gov.in rather than a `/website/…` route. Their
 * slugs are correct; the content ingest never captured them, so the routes do not exist.
 * They are linked out rather than hand-authored because the content is statutory and
 * volatile — the SC list alone is ~60 documents including the Constitutional Orders and 23
 * amendment Acts — and because the upstream budget index is already internally
 * inconsistent (2019-20, 2021-22 and 2023-24 resolve to one PDF), so transcribing it would
 * ship links we know to be wrong. The Department's own Hyperlinking Policy provides for
 * this. Restore an internal route by ingesting the content, then flipping the href in
 * divisions.ts. Do not "fix" them back into 404s.
 *
 * Any href starting with "http" gets target, rel and the open_in_new affordance below
 * without being listed anywhere as external.
 */

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
          className="text-label-1"
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
                className="text-title-1 text-white"
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
              {DIVISIONS.map((group) => (
                <div key={group.id} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="mb-2 text-label-3 uppercase text-primary-dark">
                    {group.name}
                  </h3>
                  <ul className="space-y-1.5">
                    {group.links.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                          className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-label-1 text-ink transition-colors hover:bg-surface-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
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
