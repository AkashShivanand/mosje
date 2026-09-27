"use client";

/* Adarsh Gram — District: Format – III(A), Household Level Data.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-3a/add.

   DS Audit: FormScreen ✅ (owns the required note, the error summary, the sticky
   actions and the submitting/saved states) · FormSection ✅ · Input ✅ · Select ✅ ·
   NumberInput ✅. Nothing added.

   The live form asks for State and District and then disables both, because a district
   officer has only one — the same shape `agency/add` was already built against. They are
   stated in the section description instead of being drawn as two dead fields
   (`.claude/rules/ui-restraint-and-copy.md` §1), which also brings the grid to an exact
   3×3 instead of 3×4 with two rows unusable.

   "Household ID" and "Domain" stay disabled until a Village is chosen, matching the live
   screen; the pool of household numbers a village has not yet been surveyed against, and
   the ten monitorable-indicator domains, come from `format-3a.ts` and `registers.ts`.

   "Save as Draft" is wired to keep the officer on the form rather than left permanently
   disabled as the live capture shows it (empty-form state) — a control with no reachable
   state is not a control the screen needs. */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FormField,
  FormScreen,
  FormSection,
  Input,
  NumberInput,
  Select,
  type ErrorSummaryItem,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  BLOCKS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  INDICATOR_DOMAINS,
  VILLAGES,
} from "@/lib/pm-ajay/district/registers";
import { HOUSEHOLD_CATEGORIES, PENDING_HOUSEHOLD_IDS } from "@/lib/pm-ajay/district/format-3a";

interface Draft {
  block: string;
  gramPanchayat: string;
  village: string;
  category: string;
  householdId: string;
  address: string;
  head: string;
  members: number | null;
  mobile: string;
  domain: string;
}

const EMPTY: Draft = {
  block: "",
  gramPanchayat: "",
  village: "",
  category: "",
  householdId: "",
  address: "",
  head: "",
  members: null,
  mobile: "",
  domain: "",
};

/** Every field but `members`, which is set through `NumberInput`'s own `onValueChange`. */
type StringField = Exclude<keyof Draft, "members">;

export default function HouseholdLevelDataPage() {
  const router = useRouter();
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | undefined>(undefined);

  const set = (key: StringField) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDraft((d) => ({ ...d, [key]: event.target.value }));
  };

  const dirty = JSON.stringify(draft) !== JSON.stringify(EMPTY);

  const gramPanchayats = draft.block ? (GRAM_PANCHAYATS[draft.block] ?? []) : [];
  const villages = React.useMemo(
    () =>
      draft.gramPanchayat
        ? VILLAGES.filter((v) => v.block === draft.block && v.gramPanchayat === draft.gramPanchayat)
        : [],
    [draft.block, draft.gramPanchayat],
  );
  const householdIdOptions = React.useMemo(
    () => PENDING_HOUSEHOLD_IDS.filter((p) => p.village === draft.village),
    [draft.village],
  );

  const validate = (): ErrorSummaryItem[] => {
    const found: ErrorSummaryItem[] = [];
    if (!draft.block) found.push({ fieldId: "hh-block", message: "Choose the block." });
    if (!draft.gramPanchayat) found.push({ fieldId: "hh-gp", message: "Choose the Gram Panchayat." });
    if (!draft.village) found.push({ fieldId: "hh-village", message: "Choose the village." });
    if (!draft.category) found.push({ fieldId: "hh-category", message: "Choose the household's category." });
    if (!draft.householdId) found.push({ fieldId: "hh-id", message: "Choose the household ID from the village's list." });
    if (!draft.address.trim()) found.push({ fieldId: "hh-address", message: "Enter the house number or address." });
    if (!draft.head.trim()) found.push({ fieldId: "hh-head", message: "Enter the name of the head of household." });
    if (draft.members == null || draft.members < 1)
      found.push({ fieldId: "hh-members", message: "Enter the number of persons in the household." });
    if (draft.mobile.trim() && !/^[0-9]{10}$/.test(draft.mobile.trim()))
      found.push({ fieldId: "hh-mobile", message: "Enter a ten-digit mobile number, or leave it blank." });
    if (!draft.domain) found.push({ fieldId: "hh-domain", message: "Choose the domain this survey assessed." });
    return found;
  };

  const onSaveDraft = () => {
    setSavedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
  };

  const onSubmit = () => {
    const found = validate();
    setErrors(found);
    if (found.length > 0) return;

    setSubmitting(true);
    /* No API yet: the register is illustrative, so the save is acknowledged and the
       officer is returned to the household register rather than pretending a record
       was written. */
    window.setTimeout(() => {
      setSubmitting(false);
      setSavedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      router.push(`${DISTRICT_BASE}/format-3a/household`);
    }, 600);
  };

  return (
    <FormScreen
      breadcrumb={[
        { label: "Dashboard", href: `${DISTRICT_BASE}/dashboard` },
        { label: "Manage Household", href: `${DISTRICT_BASE}/format-3a/household` },
        { label: "Household Level Data" },
      ]}
      eyebrow="Adarsh Gram — District"
      title="Format – III(A): Household Level Data"
      meta="Add a household to the Format III(A) register for an Adarsh Gram village. Illustrative figures, shaped like the district register. Not departmental data."
      errors={errors}
      onSubmit={onSubmit}
      submitLabel="Submit"
      onCancel={() => router.push(`${DISTRICT_BASE}/format-3a/household`)}
      secondaryActions={
        <Button type="button" appearance="outlined" variant="neutral" disabled={!dirty || submitting} onClick={onSaveDraft}>
          Save as Draft
        </Button>
      }
      submitting={submitting}
      dirty={dirty}
      savedAt={savedAt}
    >
      <FormSection
        title="Household Details"
        description={`Registered against ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} — the district you are posted to.`}
        columns={3}
      >
        <FormField label="Block" id="hh-block" required error={errors.find((e) => e.fieldId === "hh-block")?.message}>
          {(control) => (
            <Select
              {...control}
              placeholder="Select Block"
              value={draft.block}
              onChange={(event) => setDraft((d) => ({ ...d, block: event.target.value, gramPanchayat: "", village: "" }))}
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
          id="hh-gp"
          required
          disabled={!draft.block}
          error={errors.find((e) => e.fieldId === "hh-gp")?.message}
        >
          {(control) => (
            <Select
              {...control}
              placeholder="Select Gram Panchayat"
              value={draft.gramPanchayat}
              onChange={(event) => setDraft((d) => ({ ...d, gramPanchayat: event.target.value, village: "" }))}
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
          id="hh-village"
          required
          disabled={!draft.gramPanchayat}
          error={errors.find((e) => e.fieldId === "hh-village")?.message}
        >
          {(control) => (
            <Select
              {...control}
              placeholder="Select Village Name"
              value={draft.village}
              onChange={(event) => setDraft((d) => ({ ...d, village: event.target.value, householdId: "" }))}
            >
              {villages.map((v) => (
                <option key={v.id} value={v.village}>
                  {v.village}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField label="Category" id="hh-category" required error={errors.find((e) => e.fieldId === "hh-category")?.message}>
          {(control) => (
            <Select {...control} placeholder="Select Category" value={draft.category} onChange={set("category")}>
              {HOUSEHOLD_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Household ID"
          id="hh-id"
          required
          disabled={!draft.village}
          hint="Pre-listed household numbers awaiting Format III(A) details for this village."
          error={errors.find((e) => e.fieldId === "hh-id")?.message}
        >
          {(control) => (
            <Select {...control} placeholder="Select Household ID" value={draft.householdId} onChange={set("householdId")}>
              {householdIdOptions.map((p) => (
                <option key={p.householdId} value={p.householdId}>
                  {p.householdId}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="House No. / Address"
          id="hh-address"
          required
          error={errors.find((e) => e.fieldId === "hh-address")?.message}
        >
          {(control) => <Input {...control} value={draft.address} onChange={set("address")} placeholder="e.g. Ward 4, near Primary School" />}
        </FormField>

        <FormField
          label="Name of Head of Household"
          id="hh-head"
          required
          error={errors.find((e) => e.fieldId === "hh-head")?.message}
        >
          {(control) => <Input {...control} value={draft.head} onChange={set("head")} placeholder="Full name" />}
        </FormField>
        <NumberInput
          id="hh-members"
          label="Number of Persons"
          required
          value={draft.members}
          onValueChange={(value) => setDraft((d) => ({ ...d, members: value }))}
          min={1}
          error={errors.find((e) => e.fieldId === "hh-members")?.message as string | undefined}
        />
        <FormField
          label="Mobile No. (Optional)"
          id="hh-mobile"
          hint="Ten digits, if the household has one."
          error={errors.find((e) => e.fieldId === "hh-mobile")?.message}
        >
          {(control) => (
            <Input
              {...control}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={draft.mobile}
              onChange={set("mobile")}
              placeholder="10-digit mobile"
            />
          )}
        </FormField>

        <FormField
          label="Domain"
          id="hh-domain"
          required
          disabled={!draft.village}
          hint="The monitorable-indicator domain this Format III(A) survey assessed."
          error={errors.find((e) => e.fieldId === "hh-domain")?.message}
        >
          {(control) => (
            <Select {...control} placeholder="Select Domain" value={draft.domain} onChange={set("domain")}>
              {INDICATOR_DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      </FormSection>
    </FormScreen>
  );
}
