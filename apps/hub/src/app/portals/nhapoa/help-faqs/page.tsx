"use client";

import * as React from "react";
import Link from "next/link";
import { CitizenShell } from "@/components/nhapoa/citizen-shell";
import { FAQS, FAQ_CATEGORIES } from "@/lib/nhapoa/citizen-data";
import { Accordion, AccordionItem, Card, Chip, Icon } from "@mosje/design-system";

export default function HelpFaqsPage() {
  const [cat, setCat] = React.useState<(typeof FAQ_CATEGORIES)[number]>("All");
  const [query, setQuery] = React.useState("");

  const filtered = FAQS.filter(
    (f) =>
      (cat === "All" || f.cat === cat) &&
      (query === "" || f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <CitizenShell>
      <div className="mb-6">
        <h1 className="text-headline-1 text-ink">Help &amp; FAQs</h1>
        <p className="mt-1 text-body-2 text-ink-muted">Find answers to common questions about the SAMBAL grievance process.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          {/* Search + tabs */}
          <div className="relative mb-4">
            <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-hint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs"
              className="w-full rounded-lg border border-line bg-white py-2.5 pl-10 pr-3 text-body-2 text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
            />
          </div>
          <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="FAQ category">
            {FAQ_CATEGORIES.map((c) => (
              <Chip key={c} emphasis="solid" selected={cat === c} onSelectedChange={() => setCat(c)}>
                {c}
              </Chip>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            <Accordion>
              {filtered.map((f, i) => (
                <AccordionItem key={f.q} title={f.q} defaultOpen={i === 0}>
                  {f.a}
                </AccordionItem>
              ))}
            </Accordion>
            {filtered.length === 0 && <p className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-body-2 text-ink-hint">No FAQs match your search.</p>}
          </div>
        </div>

        {/* Sidebar helpdesk + quick links */}
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-title-3 text-ink">Contact Helpdesk</p>
            <p className="mt-1 text-body-3 text-ink-hint">Mon–Sat, 9 AM – 6 PM</p>
            <a href="tel:14566" className="mt-4 flex items-center gap-2 text-label-1 font-semibold text-navy"><Icon name="call" size={16} className="text-saffron" /> 14566 (Toll Free)</a>
            <a href="mailto:helpdesk@sambal.gov.in" className="mt-2 flex items-center gap-2 text-label-1 font-semibold text-navy"><Icon name="mail" size={16} className="text-saffron" /> Email Helpdesk</a>
          </Card>
          <Card className="p-5">
            <p className="text-label-3 uppercase text-ink-hint">Quick Links</p>
            <Link href="/portals/nhapoa/register-grievance" className="mt-3 flex items-center gap-2 text-label-1 font-semibold text-navy hover:underline"><Icon name="note_add" size={16} /> Submit New Grievance</Link>
            <Link href="/portals/nhapoa/track-status" className="mt-2 flex items-center gap-2 text-label-1 font-semibold text-navy hover:underline"><Icon name="find_in_page" size={16} /> Track Existing Case</Link>
          </Card>
        </div>
      </div>
    </CitizenShell>
  );
}
