"use client";
import * as React from "react";
import { Card, CardBody, FormField, FormPanel, FormSection, Input } from "@mosje/design-system";

/* The Do and Don't previews on the Form Section page. Client-side because FormField takes a
   render function, which a server component cannot pass across the boundary. */

export function FormSectionDoPreview(): React.JSX.Element {
  return (
    /* data-no-toc: the preview's headings belong to the specimen, not to the page's contents list. */
    <div data-no-toc>
      <FormPanel as={3} title="Basic Details">
        <FormSection title="Personal Details" as={4} columns={2}>
          <FormField label="Full Name">{(c) => <Input {...c} defaultValue="Ravi Kumar" />}</FormField>
          <FormField label="Mobile Number">{(c) => <Input {...c} defaultValue="9890001234" />}</FormField>
        </FormSection>
        <FormSection title="Address" as={4} columns={2}>
          <FormField label="District">{(c) => <Input {...c} defaultValue="Pune" />}</FormField>
          <FormField label="PIN Code">{(c) => <Input {...c} defaultValue="411038" />}</FormField>
        </FormSection>
      </FormPanel>
    </div>
  );
}

export function FormSectionDontPreview(): React.JSX.Element {
  return (
    <div className="fsp-dont" data-no-toc>
      <Card>
        <CardBody>
          <FormSection title="Personal Details" as={4} columns={1}>
            <FormField label="Full Name">{(c) => <Input {...c} defaultValue="Sunita Deshmukh" />}</FormField>
          </FormSection>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <FormSection title="Address" as={4} columns={1}>
            <FormField label="District">{(c) => <Input {...c} defaultValue="Pune" />}</FormField>
          </FormSection>
        </CardBody>
      </Card>
      <style>{`.fsp-dont { display: flex; flex-direction: column; gap: var(--sa-stack-16); }`}</style>
    </div>
  );
}
