"use client";

import { PortalPageHeader } from "@/components/nhapoa/ui";
import { FAQS } from "@/lib/nhapoa/citizen-data";
import { Accordion, AccordionItem } from "@mosje/design-system";

export default function CallCenterFaqPage() {
  return (
    <div>
      <PortalPageHeader title="Help & FAQs" meta="Answer common caller questions about the SAMBAL grievance process." />
      <Accordion className="max-w-3xl">
        {FAQS.map((f, i) => (
          <AccordionItem key={f.q} title={f.q} defaultOpen={i === 0}>
            {f.a}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
