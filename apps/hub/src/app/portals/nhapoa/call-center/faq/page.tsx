"use client";

import * as React from "react";
import { PageHeader, Card } from "@/components/nhapoa/ui";
import { cn } from "@/lib/nhapoa/utils";
import { FAQS } from "@/lib/nhapoa/citizen-data";
import { Icon } from "@mosje/design-system";

export default function CallCenterFaqPage() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div>
      <PageHeader title="Help & FAQs" subtitle="Answer common caller questions about the SAMBAL grievance process." />
      <div className="max-w-3xl space-y-3">
        {FAQS.map((f, i) => (
          <Card key={f.q} className="overflow-hidden">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} aria-controls={`cc-faq-${i}`} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
              <span className="text-sm font-semibold text-ink">{f.q}</span>
              <Icon name="keyboard_arrow_down" aria-hidden="true" className={cn("h-4 w-4 shrink-0 text-ink-hint transition-transform", open === i && "rotate-180")} />
            </button>
            {open === i && <p id={`cc-faq-${i}`} className="border-t border-line px-5 py-4 text-sm leading-relaxed text-ink-muted">{f.a}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
