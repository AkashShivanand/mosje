"use client";

import * as React from "react";
import { Accordion, AccordionItem } from "@mosje/design-system";

export function AccordionSpecimen(): React.JSX.Element {
  return (
    <Accordion>
      <AccordionItem title="Who is eligible for the PM-AJAY scholarship?" defaultOpen>
        <p>
          Students belonging to Scheduled Caste communities whose annual family income is below
          ₹2.5 lakh.
        </p>
      </AccordionItem>
      <AccordionItem title="What documents are required?">
        <p>Aadhaar card, income certificate, caste certificate and the latest academic marksheet.</p>
      </AccordionItem>
      <AccordionItem title="When are applications assessed?">
        <p>
          Applications are assessed by the district office within thirty days of submission. The
          status is shown on the application&apos;s own page.
        </p>
      </AccordionItem>
    </Accordion>
  );
}
