"use client";

/* Adarsh Gram — District: Add Beneficiary Record (Format III(B)).
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-3b/add.

   DS Audit: FormScreen ✅ (owns the required note, the error summary, the sticky
   actions and the submitting/saved states) · FormSection ✅ · Input ✅ · Select ✅ ·
   Textarea ✅. Nothing added.

   The live form's two panels — "Record Details" (the village identification pickers,
   cascading Block → Gram Panchayat → Village, and Domain → Monitorable Indicator) and
   "Beneficiary Details" — are the two `FormSection`s inside the one `FormPanel`
   `FormScreen` already provides.

   State and District are stated in the first section's description rather than drawn
   as two dead, disabled fields — the same call the Agency add screen makes
   (`.claude/rules/ui-restraint-and-copy.md` §1).

   Two deliberate divergences from the live screen, both needed to complete a
   `BeneficiaryRecord` the register at `/format-3b/list` can actually hold:
   1. "Details of Initiatives" is optional on the live screen. It is required here —
      a beneficiary record naming no initiative cannot be placed on the register or on
      Format V, so rule 9 ("a form validates and says why") makes it mandatory.
   2. The live screen submits with no Sanctioned Amount or Status field; both are
      added to "Beneficiary Details" because every register row on `/format-3b/list`
      carries them and a record entered with neither could not be shown there. */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  FormField,
  FormScreen,
  FormSection,
  Input,
  Select,
  Textarea,
  type ErrorSummaryItem,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  BLOCKS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  HOUSEHOLDS,
  INDICATOR_DOMAINS,
  VILLAGES,
} from "@/lib/pm-ajay/district/registers";
import {
  BENEFICIARY_STATUSES,
  MONITORABLE_INDICATORS,
  PMAGY_SCHEMES,
} from "@/lib/pm-ajay/district/format-3b";

interface Draft {
  block: string;
  gramPanchayat: string;
  villageId: string;
  domain: string;
  indicator: string;
  householdId: string;
  beneficiaryName: string;
  initiativeDetails: string;
  scheme: string;
  sanctionedAmount: string;
  status: string;
  otherSchemes: string;
  reason: string;
  remarks: string;
}

const EMPTY: Draft = {
  block: "",
  gramPanchayat: "",
  villageId: "",
  domain: "",
  indicator: "",
  householdId: "",
  beneficiaryName: "",
  initiativeDetails: "",
  scheme: "",
  sanctionedAmount: "",
  status: "",
  otherSchemes: "",
  reason: "",
  remarks: "",
};

export default function Format3bAddPage() {
  const router = useRouter();
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | undefined>(undefined);

  const set =
    (key: keyof Draft) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setDraft((d) => ({ ...d, [key]: event.target.value }));
    };

  const gramPanchayats = draft.block ? (GRAM_PANCHAYATS[draft.block] ?? []) : [];
  const villages = React.useMemo(
    () =>
      draft.block && draft.gramPanchayat
        ? VILLAGES.filter((v) => v.block === draft.block && v.gramPanchayat === draft.gramPanchayat)
        : [],
    [draft.block, draft.gramPanchayat],
  );
  const village = villages.find((v) => v.id === draft.villageId);
  const indicators = draft.domain ? (MONITORABLE_INDICATORS[draft.domain] ?? []) : [];
  const households = React.useMemo(
    () => (village ? HOUSEHOLDS.filter((h) => h.village === village.village) : []),
    [village],
  );

  const dirty = JSON.stringify(draft) !== JSON.stringify(EMPTY);

  const onSubmit = () => {
    const found: ErrorSummaryItem[] = [];
    if (!draft.block) found.push({ fieldId: "f3b-add-block", message: "Choose the block." });
    if (!draft.gramPanchayat)
      found.push({ fieldId: "f3b-add-gp", message: "Choose the Gram Panchayat." });
    if (!draft.villageId) found.push({ fieldId: "f3b-add-village", message: "Choose the village." });
    if (!draft.domain) found.push({ fieldId: "f3b-add-domain", message: "Choose the domain." });
    if (!draft.indicator)
      found.push({ fieldId: "f3b-add-indicator", message: "Choose the monitorable indicator." });
    if (!draft.householdId)
      found.push({ fieldId: "f3b-add-household", message: "Choose the household this record is for." });
    if (!draft.beneficiaryName.trim())
      found.push({ fieldId: "f3b-add-name", message: "Enter the name of the beneficiary." });
    if (!draft.initiativeDetails.trim())
      found.push({ fieldId: "f3b-add-initiative", message: "Enter the details of the initiative." });
    if (!draft.scheme) found.push({ fieldId: "f3b-add-scheme", message: "Choose the PMAGY scheme." });
    const amount = Number(draft.sanctionedAmount);
    if (!draft.sanctionedAmount.trim() || Number.isNaN(amount) || amount <= 0)
      found.push({ fieldId: "f3b-add-amount", message: "Enter the sanctioned amount, in ₹ lakh." });
    if (!draft.status) found.push({ fieldId: "f3b-add-status", message: "Choose the status." });
    setErrors(found);
    if (found.length > 0) return;

    setSubmitting(true);
    /* No API yet: the register is illustrative, so the save is acknowledged and the
       officer is returned to the register rather than pretending a record was
       written to it. */
    window.setTimeout(() => {
      setSubmitting(false);
      setSavedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      router.push(`${DISTRICT_BASE}/format-3b/list`);
    }, 600);
  };

  return (
    <FormScreen
      breadcrumb={[
        { label: "Dashboard", href: `${DISTRICT_BASE}/dashboard` },
        { label: "Format III(B) — Beneficiary Data", href: `${DISTRICT_BASE}/format-3b/list` },
        { label: "Add Beneficiary Record" },
      ]}
      eyebrow="Village Format"
      title="Format – III(B): Beneficiary Level Data for Initiatives"
      meta="Record a beneficiary-oriented initiative against a household already surveyed in Format III(A)."
      errors={errors}
      onSubmit={onSubmit}
      submitLabel="Submit"
      onCancel={() => router.push(`${DISTRICT_BASE}/format-3b/list`)}
      submitting={submitting}
      dirty={dirty}
      savedAt={savedAt}
    >
      <FormSection
        title="Record Details"
        description={`Posted to ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} — the district you are posted to.`}
        columns={3}
      >
        <FormField
          label="Block"
          id="f3b-add-block"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-block")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={draft.block}
              onChange={(event) => {
                setDraft((d) => ({ ...d, block: event.target.value, gramPanchayat: "", villageId: "", householdId: "" }));
              }}
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
          id="f3b-add-gp"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-gp")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={draft.gramPanchayat}
              onChange={(event) => {
                setDraft((d) => ({ ...d, gramPanchayat: event.target.value, villageId: "", householdId: "" }));
              }}
              disabled={!draft.block}
              placeholder="Select Gram Panchayat"
            >
              {gramPanchayats.map((gp) => (
                <option key={gp} value={gp}>
                  {gp}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Village"
          id="f3b-add-village"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-village")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={draft.villageId}
              onChange={(event) => setDraft((d) => ({ ...d, villageId: event.target.value, householdId: "" }))}
              disabled={!draft.gramPanchayat}
              placeholder="Select Village"
            >
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.village}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Domain"
          id="f3b-add-domain"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-domain")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={draft.domain}
              onChange={(event) => setDraft((d) => ({ ...d, domain: event.target.value, indicator: "" }))}
              placeholder="Select Domain"
            >
              {INDICATOR_DOMAINS.map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Monitorable Indicator"
          id="f3b-add-indicator"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-indicator")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={draft.indicator}
              onChange={set("indicator")}
              disabled={!draft.domain}
              placeholder="Select Monitorable Indicator"
            >
              {indicators.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      </FormSection>

      <FormSection title="Beneficiary Details" columns={3}>
        <FormField
          label="Household ID (from Format 3A)"
          id="f3b-add-household"
          required
          hint="Only households already surveyed in Format III(A) for this village."
          error={errors.find((e) => e.fieldId === "f3b-add-household")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={draft.householdId}
              onChange={set("householdId")}
              disabled={!village}
              placeholder="Select Household ID"
            >
              {households.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.head}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Name of Beneficiary"
          id="f3b-add-name"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-name")?.message}
        >
          {(control) => (
            <Input
              {...control}
              value={draft.beneficiaryName}
              onChange={set("beneficiaryName")}
              maxLength={100}
              placeholder="Max 100 characters"
            />
          )}
        </FormField>
        <FormField
          label="Details of Initiatives"
          id="f3b-add-initiative"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-initiative")?.message}
        >
          {(control) => (
            <Input
              {...control}
              value={draft.initiativeDetails}
              onChange={set("initiativeDetails")}
              placeholder="e.g. Housing, Pension — old age"
            />
          )}
        </FormField>
        <FormField
          label="Scheme (PMAGY Scheme)"
          id="f3b-add-scheme"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-scheme")?.message}
        >
          {(control) => (
            <Select {...control} value={draft.scheme} onChange={set("scheme")} placeholder="Select Scheme">
              {PMAGY_SCHEMES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Sanctioned Amount (₹ Lakh)"
          id="f3b-add-amount"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-amount")?.message}
        >
          {(control) => (
            <Input
              {...control}
              inputMode="decimal"
              value={draft.sanctionedAmount}
              onChange={set("sanctionedAmount")}
              placeholder="e.g. 0.42"
            />
          )}
        </FormField>
        <FormField
          label="Status"
          id="f3b-add-status"
          required
          error={errors.find((e) => e.fieldId === "f3b-add-status")?.message}
        >
          {(control) => (
            <Select {...control} value={draft.status} onChange={set("status")} placeholder="Select Status">
              {BENEFICIARY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField label="Other Schemes" id="f3b-add-other-schemes" hint="Any other scheme this beneficiary draws on.">
          {(control) => (
            <Input
              {...control}
              value={draft.otherSchemes}
              onChange={set("otherSchemes")}
              maxLength={125}
              placeholder="Max 125 characters"
            />
          )}
        </FormField>
        <FormField label="Reason" id="f3b-add-reason">
          {(control) => (
            <Input {...control} value={draft.reason} onChange={set("reason")} placeholder="Optional" />
          )}
        </FormField>
        <FormField label="Remarks" id="f3b-add-remarks" className="ds-form-span-full">
          {(control) => (
            <Textarea
              {...control}
              value={draft.remarks}
              onChange={set("remarks")}
              maxLength={300}
              placeholder="Max 300 characters"
            />
          )}
        </FormField>
      </FormSection>
    </FormScreen>
  );
}
