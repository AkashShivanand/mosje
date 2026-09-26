"use client";

/* Adarsh Gram — District: Add Agency.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/agency/add.

   DS Audit: FormScreen ✅ (owns the required note, the error summary, the sticky
   actions and the saved/submitting states) · FormSection ✅ · Input ✅ · Select ✅.
   Nothing added.

   The live form asks for State and District and then disables both, because a district
   officer has only one. They are stated in the section description instead of being
   drawn as two dead fields — `.claude/rules/ui-restraint-and-copy.md` §1. */

import * as React from "react";
import { useRouter } from "next/navigation";
import { FormField, FormScreen, FormSection, Input, Select, type ErrorSummaryItem } from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import { AGENCY_TYPES, DISTRICT_SCOPE } from "@/lib/pm-ajay/district/registers";

interface Draft {
  name: string;
  type: string;
  contactPerson: string;
  mobile: string;
}

const EMPTY: Draft = { name: "", type: "", contactPerson: "", mobile: "" };

export default function AgencyAddPage() {
  const router = useRouter();
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | undefined>(undefined);

  const set = (key: keyof Draft) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDraft((d) => ({ ...d, [key]: event.target.value }));
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(EMPTY);

  const onSubmit = () => {
    const found: ErrorSummaryItem[] = [];
    if (!draft.name.trim()) found.push({ fieldId: "agency-name", message: "Enter the agency's name." });
    if (!draft.type) found.push({ fieldId: "agency-type", message: "Choose the kind of agency this is." });
    if (!draft.contactPerson.trim())
      found.push({ fieldId: "agency-contact", message: "Enter the officer who answers for this agency." });
    if (!/^[0-9 ]{10,13}$/.test(draft.mobile.trim()))
      found.push({ fieldId: "agency-mobile", message: "Enter a ten-digit mobile number." });
    setErrors(found);
    if (found.length > 0) return;

    setSubmitting(true);
    /* No API yet: the register is illustrative, so the save is acknowledged and the
       officer is returned to the list rather than pretending a record was written. */
    window.setTimeout(() => {
      setSubmitting(false);
      setSavedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      router.push(`${DISTRICT_BASE}/agency/list`);
    }, 600);
  };

  return (
    <FormScreen
      breadcrumb={[
        { label: "Dashboard", href: `${DISTRICT_BASE}/dashboard` },
        { label: "Agency Master", href: `${DISTRICT_BASE}/agency/list` },
        { label: "Add Agency" },
      ]}
      eyebrow="Adarsh Gram — District"
      title="Add Agency"
      meta="An agency must be on this register before it can be named on Format II or Format IV."
      errors={errors}
      onSubmit={onSubmit}
      submitLabel="Save Agency"
      onCancel={() => router.push(`${DISTRICT_BASE}/agency/list`)}
      submitting={submitting}
      dirty={dirty}
      savedAt={savedAt}
    >
      <FormSection
        title="Agency Details"
        description={`Registered against ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} — the district you are posted to.`}
        columns={2}
      >
        <FormField
          label="Agency Name"
          id="agency-name"
          required
          error={errors.find((e) => e.fieldId === "agency-name")?.message}
        >
          {(control) => (
            <Input
              {...control}
              value={draft.name}
              onChange={set("name")}
              placeholder="e.g. Panchayat Raj Engineering Division"
            />
          )}
        </FormField>
        <FormField
          label="Agency Type"
          id="agency-type"
          required
          error={errors.find((e) => e.fieldId === "agency-type")?.message}
        >
          {(control) => (
            <Select {...control} value={draft.type} onChange={set("type")} placeholder="Select the agency type">
              {AGENCY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Contact Person"
          id="agency-contact"
          required
          error={errors.find((e) => e.fieldId === "agency-contact")?.message}
        >
          {(control) => (
            <Input {...control} value={draft.contactPerson} onChange={set("contactPerson")} placeholder="Officer responsible" />
          )}
        </FormField>
        <FormField
          label="Mobile Number"
          id="agency-mobile"
          required
          hint="Ten digits, as the officer's own number."
          error={errors.find((e) => e.fieldId === "agency-mobile")?.message}
        >
          {(control) => (
            <Input
              {...control}
              inputMode="numeric"
              autoComplete="tel"
              value={draft.mobile}
              onChange={set("mobile")}
              placeholder="10-digit mobile"
            />
          )}
        </FormField>
      </FormSection>
    </FormScreen>
  );
}
