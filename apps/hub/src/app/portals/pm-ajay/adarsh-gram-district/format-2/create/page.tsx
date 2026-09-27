"use client";

/* Adarsh Gram — District: Create — Format II.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-2/create.

   DS Audit: FormScreen ✅ (owns the required note, the error summary, the sticky
   actions and the submitting/saved states) · FormSection ✅ · Select ✅ · Input ✅ ·
   DatePicker ✅. Nothing added.

   The live form shows State and District as two disabled text fields reading
   "BIHAR - 10" / "GAYA - 196". Per the Agency form's own precedent on this estate
   (`agency/add/page.tsx`) and `.claude/rules/ui-restraint-and-copy.md` §1, a field
   the officer can never change is not drawn as a dead control — it is stated once,
   in the section description.

   The remaining controls match the live capture exactly: Block, Gram Panchayat
   and Village cascade to select where the work sits; Domain and Monitorable
   Indicator cascade to select which scheme indicator it is raised against (the live
   screen disables both until their upstream is chosen, reproduced here); Work,
   Executing Agency, Estimated Cost, Funding Source and Target Date describe the
   work itself. Funding Source has no live equivalent captured but is asked for by
   the brief and is a standard Format II field on the scheme's own form; its options
   are illustrative, in `lib/pm-ajay/district/infrastructure-plan.ts`. */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DatePicker,
  FormField,
  FormScreen,
  FormSection,
  Input,
  Select,
  type ErrorSummaryItem,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import { useVillageCascade } from "@/lib/pm-ajay/district/village-cascade";
import {
  FUNDING_SOURCES,
  INFRASTRUCTURE_DOMAINS,
  MONITORABLE_INDICATORS,
  type InfrastructureDomain,
} from "@/lib/pm-ajay/district/infrastructure-plan";
import { AGENCIES, BLOCKS, DISTRICT_SCOPE } from "@/lib/pm-ajay/district/registers";

interface Draft {
  domain: InfrastructureDomain | "";
  indicator: string;
  work: string;
  agency: string;
  estimatedCost: string;
  fundingSource: string;
  targetDate: string;
}

const EMPTY: Draft = {
  domain: "",
  indicator: "",
  work: "",
  agency: "",
  estimatedCost: "",
  fundingSource: "",
  targetDate: "",
};

export default function Format2CreatePage() {
  const router = useRouter();
  const cascade = useVillageCascade();
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | undefined>(undefined);

  const indicatorOptions = draft.domain ? MONITORABLE_INDICATORS[draft.domain] : [];

  const setField =
    (key: keyof Draft) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setDraft((d) => ({ ...d, [key]: event.target.value }));
    };

  const setDomain = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const domain = event.target.value as InfrastructureDomain | "";
    setDraft((d) => ({ ...d, domain, indicator: "" }));
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(EMPTY) || cascade.complete;

  /* DatePicker's `error` is a string, while an ErrorSummaryItem's message is a node.
     Every message on this screen is authored here as a string, so it is read back as one. */
  const errorText = (fieldId: string): string | undefined => {
    const found = errors.find((e) => e.fieldId === fieldId)?.message;
    return typeof found === "string" ? found : undefined;
  };

  const onSubmit = () => {
    const found: ErrorSummaryItem[] = [];
    if (!cascade.block) found.push({ fieldId: "f2c-block", message: "Choose the block." });
    if (!cascade.gramPanchayat) found.push({ fieldId: "f2c-gp", message: "Choose the Gram Panchayat." });
    if (!cascade.village) found.push({ fieldId: "f2c-village", message: "Choose the village." });
    if (!draft.domain) found.push({ fieldId: "f2c-domain", message: "Choose the indicator domain." });
    if (!draft.indicator)
      found.push({ fieldId: "f2c-indicator", message: "Choose the Monitorable Indicator." });
    if (!draft.work.trim()) found.push({ fieldId: "f2c-work", message: "Describe the work." });
    if (!draft.agency) found.push({ fieldId: "f2c-agency", message: "Choose the executing agency." });
    if (!draft.estimatedCost.trim() || Number.isNaN(Number(draft.estimatedCost)))
      found.push({ fieldId: "f2c-cost", message: "Enter the estimated cost, in ₹ lakh." });
    if (!draft.fundingSource) found.push({ fieldId: "f2c-funding", message: "Choose the funding source." });
    if (!draft.targetDate) found.push({ fieldId: "f2c-date", message: "Choose the target date." });
    setErrors(found);
    if (found.length > 0) return;

    setSubmitting(true);
    /* No API yet: the register is illustrative, so the save is acknowledged and the
       officer is returned to the register rather than pretending a record was written. */
    window.setTimeout(() => {
      setSubmitting(false);
      setSavedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      router.push(`${DISTRICT_BASE}/format-2`);
    }, 600);
  };

  return (
    <FormScreen
      breadcrumb={[
        { label: "Dashboard", href: `${DISTRICT_BASE}/dashboard` },
        { label: "Format – II: Infrastructure Development & Action Plan", href: `${DISTRICT_BASE}/format-2` },
        { label: "Create – Format II" },
      ]}
      eyebrow="Adarsh Gram — District"
      title="Create – Format II"
      meta="Raise a new infrastructure work under Format II, against one of the scheme's Monitorable Indicators."
      errors={errors}
      onSubmit={onSubmit}
      submitLabel="Save Record"
      onCancel={() => router.push(`${DISTRICT_BASE}/format-2`)}
      cancelLabel="Back to List"
      submitting={submitting}
      dirty={dirty}
      savedAt={savedAt}
    >
      <FormSection
        title="Village Identification"
        description={`Recorded against ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} — the district you are posted to.`}
        columns={3}
      >
        <FormField
          label="Block"
          id="f2c-block"
          required
          error={errors.find((e) => e.fieldId === "f2c-block")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={cascade.block}
              onChange={(e) => cascade.setBlock(e.target.value)}
              placeholder="Select Block"
            >
              {BLOCKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Gram Panchayat"
          id="f2c-gp"
          required
          error={errors.find((e) => e.fieldId === "f2c-gp")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={cascade.gramPanchayat}
              onChange={(e) => cascade.setGramPanchayat(e.target.value)}
              placeholder="Select Gram Panchayat"
              disabled={!cascade.block}
            >
              {cascade.gramPanchayatOptions.map((gp) => (
                <option key={gp} value={gp}>
                  {gp}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Village"
          id="f2c-village"
          required
          error={errors.find((e) => e.fieldId === "f2c-village")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={cascade.village}
              onChange={(e) => cascade.setVillage(e.target.value)}
              placeholder="Select Village Name"
              disabled={!cascade.gramPanchayat}
            >
              {cascade.villageOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      </FormSection>

      <FormSection title="Work Details" columns={3}>
        <FormField
          label="Domain"
          id="f2c-domain"
          required
          error={errors.find((e) => e.fieldId === "f2c-domain")?.message}
        >
          {(control) => (
            <Select {...control} value={draft.domain} onChange={setDomain} placeholder="Select Domain" disabled={!cascade.complete}>
              {INFRASTRUCTURE_DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Monitorable Indicator"
          id="f2c-indicator"
          required
          error={errors.find((e) => e.fieldId === "f2c-indicator")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={draft.indicator}
              onChange={setField("indicator")}
              placeholder="Select Monitorable Indicator"
              disabled={!draft.domain}
            >
              {indicatorOptions.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Work"
          id="f2c-work"
          required
          hint="What is being built or provided."
          error={errors.find((e) => e.fieldId === "f2c-work")?.message}
        >
          {(control) => (
            <Input {...control} value={draft.work} onChange={setField("work")} placeholder="e.g. Overhead tank, 40 KL" />
          )}
        </FormField>
        <FormField
          label="Executing Agency"
          id="f2c-agency"
          required
          error={errors.find((e) => e.fieldId === "f2c-agency")?.message}
        >
          {(control) => (
            <Select {...control} value={draft.agency} onChange={setField("agency")} placeholder="Select the executing agency">
              {AGENCIES.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Estimated Cost"
          id="f2c-cost"
          required
          hint="In ₹ lakh."
          error={errors.find((e) => e.fieldId === "f2c-cost")?.message}
        >
          {(control) => (
            <Input
              {...control}
              inputMode="decimal"
              value={draft.estimatedCost}
              onChange={setField("estimatedCost")}
              placeholder="e.g. 42.50"
            />
          )}
        </FormField>
        <FormField
          label="Funding Source"
          id="f2c-funding"
          required
          error={errors.find((e) => e.fieldId === "f2c-funding")?.message}
        >
          {(control) => (
            <Select {...control} value={draft.fundingSource} onChange={setField("fundingSource")} placeholder="Select funding source">
              {FUNDING_SOURCES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <DatePicker
          label="Target Date"
          id="f2c-date"
          required
          value={draft.targetDate}
          onChange={(iso) => setDraft((d) => ({ ...d, targetDate: iso }))}
          error={errorText("f2c-date")}
        />
      </FormSection>
    </FormScreen>
  );
}
