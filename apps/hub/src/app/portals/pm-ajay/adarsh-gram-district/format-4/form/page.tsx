"use client";

/* Adarsh Gram — District: Format – IV, one work's own return.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-4/form.

   Chose WizardScreen over FormScreen, and said why: the live screen carries FOUR
   numbered, labelled stage tabs across the top — "1 Estimation", "2 Release",
   "3 Utilization", "4 Work Progress" — a genuine multi-step return, not one long
   form. `docs/design-system/screen-templates.md` §2a draws the boundary at "more
   than eight fields, or a statutory stage boundary" for WizardScreen; this form has
   both — 13 fields across the two live sections in Estimation alone, and four
   stages the live portal itself names and gates behind Back/Continue.

   The live capture (ADARSH-GRAM-DISTRICT-FORMAT-4-FORM.png) only reached step 1,
   "Estimation" — the other three tabs were not expanded during the capture, so
   Release, Utilization and Work Progress are built to collect exactly the fields
   the WORKS register itself needs to hold a complete record (`released`,
   `utilised`, `status`, `targetDate`), worded the way the register already words
   them, rather than guessed pixel-for-pixel.

   DS Audit: WizardScreen ✅ · FormSection ✅ · FormField ✅ · Input ✅ · Select ✅ ·
   Textarea ✅ · DescriptionList ✅ (the computed "Total Funds Allocated" line, read
   only — there is no read-only Input in the system, and a disabled one removes
   itself from the tab order and the form's accessible name). Nothing added.

   State and District are fixed for this officer and are named in the page
   description instead of drawn as two disabled fields, following the Agency
   Master precedent (`agency/add`) and `.claude/rules/ui-restraint-and-copy.md` §1.
   The live screen's "+" affordance for a second Central/State scheme line is
   simplified to one scheme each: `WorkRecord` (and the register beneath it)
   carries no second-scheme field, so a second row would collect data nothing
   downstream reads. */

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DescriptionList,
  FormField,
  FormSection,
  Input,
  Select,
  Textarea,
  WizardScreen,
  type ErrorSummaryItem,
} from "@mosje/design-system";
import type { StepperStep } from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  AGENCIES,
  BLOCKS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  INDICATOR_DOMAINS,
  VILLAGES,
  WORKS,
  lakh,
} from "@/lib/pm-ajay/district/registers";
import { MONITORABLE_INDICATORS } from "@/lib/pm-ajay/district/format-3b";
import {
  CENTRAL_FUNDING_SCHEMES,
  EMPTY_WORK_DRAFT,
  STATE_FUNDING_SCHEMES,
  WORK_STATUSES,
  totalFundsAllocated,
  type WorkDraft,
} from "@/lib/pm-ajay/district/format-4";

const STEPS: StepperStep[] = [
  { label: "Estimation" },
  { label: "Release" },
  { label: "Utilization" },
  { label: "Work Progress" },
];

/** Every `WorkDraft` field except `status` is a plain string, so one setter covers them. */
type StringField = Exclude<keyof WorkDraft, "status">;

function set<K extends StringField>(
  setDraft: React.Dispatch<React.SetStateAction<WorkDraft>>,
  key: K,
) {
  return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setDraft((d) => ({ ...d, [key]: event.target.value }) as WorkDraft);
  };
}

function validateStep(step: number, draft: WorkDraft): ErrorSummaryItem[] {
  const found: ErrorSummaryItem[] = [];
  if (step === 0) {
    if (!draft.block) found.push({ fieldId: "w4-block", message: "Choose the block." });
    if (!draft.gramPanchayat) found.push({ fieldId: "w4-gp", message: "Choose the gram panchayat." });
    if (!draft.village) found.push({ fieldId: "w4-village", message: "Choose the village." });
    if (!draft.domain) found.push({ fieldId: "w4-domain", message: "Choose the monitorable-indicator domain." });
    if (!draft.indicator) found.push({ fieldId: "w4-indicator", message: "Choose the monitorable indicator." });
    if (!draft.work.trim()) found.push({ fieldId: "w4-work", message: "Describe the work or activity identified." });
    if (!draft.estimatedCost.trim() || Number(draft.estimatedCost) <= 0)
      found.push({ fieldId: "w4-estimated-cost", message: "Enter the estimated cost, as provided by the concerned authority." });
    if (!draft.stateShareUnderPmagy.trim())
      found.push({ fieldId: "w4-pmagy-share", message: "Enter the State Government's share under PMAGY (0 if none)." });
    if (!draft.agency) found.push({ fieldId: "w4-agency", message: "Choose the agency or department for implementation." });
  } else if (step === 1) {
    if (!draft.releaseOrderNumber.trim())
      found.push({ fieldId: "w4-release-order", message: "Enter the release order number." });
    if (!draft.releaseDate.trim()) found.push({ fieldId: "w4-release-date", message: "Enter the release date." });
    if (!draft.amountReleased.trim() || Number(draft.amountReleased) < 0)
      found.push({ fieldId: "w4-amount-released", message: "Enter the amount released, in ₹ lakh." });
  } else if (step === 2) {
    if (!draft.amountUtilised.trim() || Number(draft.amountUtilised) < 0)
      found.push({ fieldId: "w4-amount-utilised", message: "Enter the amount utilised, in ₹ lakh." });
    if (!draft.utilisationDate.trim())
      found.push({ fieldId: "w4-utilisation-date", message: "Enter the date the funds were utilised." });
  } else if (step === 3) {
    if (!draft.status) found.push({ fieldId: "w4-status", message: "Choose the work's current status." });
    if (!draft.targetDate.trim()) found.push({ fieldId: "w4-target-date", message: "Enter the target completion date." });
  }
  return found;
}

function Format4FormInner() {
  const router = useRouter();
  const params = useSearchParams();

  const editingId = params.get("work");
  const existing = editingId ? WORKS.find((w) => w.id === editingId) : undefined;

  const [draft, setDraft] = React.useState<WorkDraft>(() => {
    if (existing) {
      const village = VILLAGES.find((v) => v.village === existing.village);
      return {
        ...EMPTY_WORK_DRAFT,
        block: village?.block ?? "",
        gramPanchayat: village?.gramPanchayat ?? "",
        village: existing.village,
        domain: existing.domain,
        work: existing.work,
        estimatedCost: String(existing.sanctioned),
        agency: existing.agency,
        amountReleased: String(existing.released),
        amountUtilised: String(existing.utilised),
        status: existing.status,
        targetDate: existing.targetDate,
      };
    }
    return {
      ...EMPTY_WORK_DRAFT,
      block: params.get("block") ?? "",
      gramPanchayat: params.get("gramPanchayat") ?? "",
      village: params.get("village") ?? "",
    };
  });
  const [current, setCurrent] = React.useState(0);
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const errorRef = React.useRef<HTMLDivElement>(null);

  const errorFor = (id: string) => errors.find((e) => e.fieldId === id)?.message;

  const gramPanchayats = draft.block ? (GRAM_PANCHAYATS[draft.block] ?? []) : [];
  const villagesInGp = React.useMemo(
    () => VILLAGES.filter((v) => v.block === draft.block && v.gramPanchayat === draft.gramPanchayat),
    [draft.block, draft.gramPanchayat],
  );
  const indicators = draft.domain ? (MONITORABLE_INDICATORS[draft.domain] ?? []) : [];
  const total = totalFundsAllocated(draft);

  const goToRegister = () => {
    const qs = new URLSearchParams();
    if (draft.block) qs.set("block", draft.block);
    if (draft.gramPanchayat) qs.set("gramPanchayat", draft.gramPanchayat);
    if (draft.village) qs.set("village", draft.village);
    router.push(`${DISTRICT_BASE}/format-4${qs.toString() ? `?${qs}` : ""}`);
  };

  const advance = () => {
    const found = validateStep(current, draft);
    setErrors(found);
    if (found.length > 0) {
      window.setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    setCurrent((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => {
    setErrors([]);
    setCurrent((s) => Math.max(0, s - 1));
  };

  const onSubmit = () => {
    const found = validateStep(current, draft);
    setErrors(found);
    if (found.length > 0) {
      window.setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    setSubmitting(true);
    /* No API yet: the register is illustrative, so the save is acknowledged and the
       officer is returned to the works register rather than pretending a record was
       written to it — the same position `agency/add` takes for the same reason. */
    window.setTimeout(() => {
      setSubmitting(false);
      goToRegister();
    }, 600);
  };

  const summaryError =
    errors.length > 0
      ? errors.length === 1
        ? "1 field needs your attention before you continue."
        : `${errors.length} fields need your attention before you continue.`
      : undefined;

  return (
    <WizardScreen
      eyebrow={`Format – IV${existing ? " · Editing" : " · New Entry"}`}
      title="Action Plan and Progress Report of Infrastructure Works"
      description={`${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}. Fields marked * are mandatory.`}
      steps={STEPS}
      current={current}
      onBack={back}
      onNext={advance}
      onSubmit={onSubmit}
      onCancel={goToRegister}
      nextLabel="Save and Continue"
      submitLabel={submitting ? "Saving…" : "Submit"}
      error={summaryError}
      errorRef={errorRef}
    >
      {current === 0 ? (
        <>
          <FormSection title="Location & Work Identification" columns={3}>
            <FormField label="Block" id="w4-block" required error={errorFor("w4-block")}>
              {(control) => (
                <Select
                  {...control}
                  value={draft.block}
                  placeholder="Select Block"
                  onChange={(event) => {
                    setDraft((d) => ({ ...d, block: event.target.value, gramPanchayat: "", village: "" }));
                  }}
                >
                  {BLOCKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Gram Panchayat" id="w4-gp" required error={errorFor("w4-gp")}>
              {(control) => (
                <Select
                  {...control}
                  value={draft.gramPanchayat}
                  placeholder="Select Gram Panchayat"
                  disabled={!draft.block}
                  onChange={(event) => {
                    setDraft((d) => ({ ...d, gramPanchayat: event.target.value, village: "" }));
                  }}
                >
                  {gramPanchayats.map((gp) => (
                    <option key={gp} value={gp}>
                      {gp}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Village" id="w4-village" required error={errorFor("w4-village")}>
              {(control) => (
                <Select
                  {...control}
                  value={draft.village}
                  placeholder="Select Village"
                  disabled={!draft.gramPanchayat}
                  onChange={set(setDraft, "village")}
                >
                  {villagesInGp.map((v) => (
                    <option key={v.id} value={v.village}>
                      {v.village}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Domain" id="w4-domain" required error={errorFor("w4-domain")}>
              {(control) => (
                <Select
                  {...control}
                  value={draft.domain}
                  placeholder="Select Domain"
                  onChange={(event) => setDraft((d) => ({ ...d, domain: event.target.value, indicator: "" }))}
                >
                  {INDICATOR_DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Monitorable Indicator" id="w4-indicator" required error={errorFor("w4-indicator")}>
              {(control) => (
                <Select
                  {...control}
                  value={draft.indicator}
                  placeholder="Select Monitorable Indicator"
                  disabled={!draft.domain}
                  onChange={set(setDraft, "indicator")}
                >
                  {indicators.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField
              label="Name / Detail of the Work or Activity Identified"
              id="w4-work"
              required
              error={errorFor("w4-work")}
              className="ds-form-span-full"
            >
              {(control) => (
                <Textarea
                  {...control}
                  rows={2}
                  value={draft.work}
                  onChange={set(setDraft, "work")}
                  placeholder="e.g. Internal CC road, 1.2 km"
                />
              )}
            </FormField>
          </FormSection>

          <FormSection title="Details of Scheme Funding" columns={2}>
            <FormField
              label="Estimated Cost, in ₹ Lakh (as Provided by the Concerned Authority)"
              id="w4-estimated-cost"
              required
              error={errorFor("w4-estimated-cost")}
            >
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={draft.estimatedCost}
                  onChange={set(setDraft, "estimatedCost")}
                  placeholder="Estimated cost in ₹ lakh"
                />
              )}
            </FormField>
            <FormField label="Agency / Department for Implementation" id="w4-agency" required error={errorFor("w4-agency")}>
              {(control) => (
                <Select
                  {...control}
                  value={draft.agency}
                  placeholder="Select Agency"
                  onChange={set(setDraft, "agency")}
                >
                  {AGENCIES.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Central Government Scheme (Other Than PMAGY)" id="w4-central-scheme" hint='Leave as "Select Scheme" and 0 allocated if no other central scheme is availed.'>
              {(control) => (
                <Select
                  {...control}
                  value={draft.centralScheme}
                  placeholder="Select Scheme"
                  onChange={set(setDraft, "centralScheme")}
                >
                  {CENTRAL_FUNDING_SCHEMES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Funds Allocated Under That Scheme, in ₹ Lakh" id="w4-central-amount">
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  disabled={!draft.centralScheme}
                  value={draft.centralSchemeAmount}
                  onChange={set(setDraft, "centralSchemeAmount")}
                  placeholder="Amount in ₹ lakh"
                />
              )}
            </FormField>
            <FormField label="State Government Scheme" id="w4-state-scheme">
              {(control) => (
                <Select
                  {...control}
                  value={draft.stateScheme}
                  placeholder="Select Scheme"
                  onChange={set(setDraft, "stateScheme")}
                >
                  {STATE_FUNDING_SCHEMES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Funds Allocated Under That Scheme, in ₹ Lakh" id="w4-state-amount">
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  disabled={!draft.stateScheme}
                  value={draft.stateSchemeAmount}
                  onChange={set(setDraft, "stateSchemeAmount")}
                  placeholder="Amount in ₹ lakh"
                />
              )}
            </FormField>
            <FormField
              label="State Government Share Under PMAGY, in ₹ Lakh"
              id="w4-pmagy-share"
              required
              error={errorFor("w4-pmagy-share")}
            >
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={draft.stateShareUnderPmagy}
                  onChange={set(setDraft, "stateShareUnderPmagy")}
                  placeholder="0"
                />
              )}
            </FormField>
            <FormField
              label="Gap-Filling Funds Under PMAGY, in ₹ Lakh"
              id="w4-gap-filling"
              hint="Funding for indicator 5.2 is not allowed. Refer letter."
            >
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={draft.gapFillingFunds}
                  onChange={set(setDraft, "gapFillingFunds")}
                  placeholder="Amount in ₹ lakh"
                />
              )}
            </FormField>
            <div className="ds-form-span-full">
              <DescriptionList
                columns={1}
                items={[
                  {
                    term: "Total Funds Allocated",
                    value: lakh(total),
                    hint: "Computed from the funding sources above.",
                  },
                ]}
              />
            </div>
          </FormSection>
        </>
      ) : null}

      {current === 1 ? (
        <FormSection title="Release Details" columns={2}>
          <FormField label="Release Order Number" id="w4-release-order" required error={errorFor("w4-release-order")}>
            {(control) => (
              <Input
                {...control}
                value={draft.releaseOrderNumber}
                onChange={set(setDraft, "releaseOrderNumber")}
                placeholder="e.g. DRDA/GAYA/2026-27/0142"
              />
            )}
          </FormField>
          <FormField
            label="Release Date"
            id="w4-release-date"
            required
            error={errorFor("w4-release-date")}
            hint="As the register dates it — e.g. 12 Apr 2026."
          >
            {(control) => (
              <Input {...control} value={draft.releaseDate} onChange={set(setDraft, "releaseDate")} placeholder="DD Mon YYYY" />
            )}
          </FormField>
          <FormField
            label="Amount Released, in ₹ Lakh"
            id="w4-amount-released"
            required
            error={errorFor("w4-amount-released")}
            hint={`Sanctioned: ${draft.estimatedCost ? lakh(Number(draft.estimatedCost)) : "not yet entered"}.`}
          >
            {(control) => (
              <Input
                {...control}
                type="number"
                inputMode="decimal"
                min={0}
                value={draft.amountReleased}
                onChange={set(setDraft, "amountReleased")}
                placeholder="Amount in ₹ lakh"
              />
            )}
          </FormField>
        </FormSection>
      ) : null}

      {current === 2 ? (
        <FormSection title="Utilisation Details" columns={2}>
          <FormField label="Utilisation Certificate Number" id="w4-uc-number" hint="Leave blank where a UC has not yet been filed.">
            {(control) => (
              <Input
                {...control}
                value={draft.utilisationCertificateNumber}
                onChange={set(setDraft, "utilisationCertificateNumber")}
                placeholder="e.g. UC/GAYA/2026-27/0142"
              />
            )}
          </FormField>
          <FormField
            label="Amount Utilised, in ₹ Lakh"
            id="w4-amount-utilised"
            required
            error={errorFor("w4-amount-utilised")}
            hint={`Released: ${draft.amountReleased ? lakh(Number(draft.amountReleased)) : "not yet entered"}.`}
          >
            {(control) => (
              <Input
                {...control}
                type="number"
                inputMode="decimal"
                min={0}
                value={draft.amountUtilised}
                onChange={set(setDraft, "amountUtilised")}
                placeholder="Amount in ₹ lakh"
              />
            )}
          </FormField>
          <FormField
            label="Utilisation Date"
            id="w4-utilisation-date"
            required
            error={errorFor("w4-utilisation-date")}
            hint="As the register dates it — e.g. 12 Apr 2026."
          >
            {(control) => (
              <Input
                {...control}
                value={draft.utilisationDate}
                onChange={set(setDraft, "utilisationDate")}
                placeholder="DD Mon YYYY"
              />
            )}
          </FormField>
        </FormSection>
      ) : null}

      {current === 3 ? (
        <FormSection title="Work Progress" columns={2}>
          <FormField label="Status" id="w4-status" required error={errorFor("w4-status")}>
            {(control) => (
              <Select
                {...control}
                value={draft.status}
                placeholder="Select Status"
                onChange={(event) =>
                  setDraft((d) => ({ ...d, status: event.target.value as WorkDraft["status"] }))
                }
              >
                {WORK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField
            label="Target Completion Date"
            id="w4-target-date"
            required
            error={errorFor("w4-target-date")}
            hint="As the register dates it — e.g. 31 Dec 2026."
          >
            {(control) => (
              <Input {...control} value={draft.targetDate} onChange={set(setDraft, "targetDate")} placeholder="DD Mon YYYY" />
            )}
          </FormField>
          <FormField
            label="Progress Remarks"
            id="w4-progress-remarks"
            hint="Optional. What the district has observed since the last update."
            className="ds-form-span-full"
          >
            {(control) => (
              <Textarea {...control} rows={2} value={draft.progressRemarks} onChange={set(setDraft, "progressRemarks")} />
            )}
          </FormField>
        </FormSection>
      ) : null}
    </WizardScreen>
  );
}

export default function Format4FormPage() {
  return (
    <React.Suspense fallback={null}>
      <Format4FormInner />
    </React.Suspense>
  );
}
