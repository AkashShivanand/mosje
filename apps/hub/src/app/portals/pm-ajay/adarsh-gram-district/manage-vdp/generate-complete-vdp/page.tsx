"use client";

/* Adarsh Gram — District: Generate Complete VDP.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/manage-vdp/generate-complete-vdp.

   DS Audit: FormScreen ✅ · FormSection ✅ · FormField ✅ · Select ✅ ·
   DescriptionList ✅ · Badge ✅. Nothing added.

   The live screen narrows Block → Gram Panchayat → Village, then — once a
   village is fully chosen — offers the one action its VDP stage allows.
   That is a required-selection form with one submit action and an
   acknowledged save, the same shape as `agency/add`, not a register the
   officer filters and pages through — so `FormScreen` fits, not
   `WorklistScreen`.

   Divergence, recorded: the live nav names this "Generate/Finalise Complete
   VDP" as one screen, so both actions live here, keyed off the selected
   village's stage rather than drawn as two separate buttons. Once a village
   is already DLCC-approved or declared, there is nothing left to generate or
   finalise, so the submit becomes a pointer to the screen that IS next in
   the workflow (Declare Adarsh Gram, or the Requests register) rather than a
   dead button. */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  DescriptionList,
  FormField,
  FormScreen,
  FormSection,
  Select,
  type ErrorSummaryItem,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  BLOCKS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  VILLAGES,
  count,
  type VdpStage,
  type VillageRecord,
} from "@/lib/pm-ajay/district/registers";

const STAGE_BADGE: Record<VdpStage, "neutral" | "info" | "success"> = {
  "VDP Not Generated": "neutral",
  "VDP Drafted": "info",
  "DLCC Approved": "info",
  "Declared Adarsh Gram": "success",
};

/** What this screen lets the officer do next, for the village's current stage. */
const STAGE_ACTION: Record<VdpStage, { label: string; nextStage?: VdpStage }> = {
  "VDP Not Generated": { label: "Generate VDP", nextStage: "VDP Drafted" },
  "VDP Drafted": { label: "Finalise Complete VDP", nextStage: "DLCC Approved" },
  "DLCC Approved": { label: "Continue to Declaration" },
  "Declared Adarsh Gram": { label: "View Declaration Status" },
};

export default function GenerateCompleteVdpPage() {
  const router = useRouter();
  const [villages, setVillages] = React.useState<VillageRecord[]>(() =>
    VILLAGES.map((v) => ({ ...v })),
  );
  const [block, setBlock] = React.useState("");
  const [gp, setGp] = React.useState("");
  const [villageId, setVillageId] = React.useState("");
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | undefined>(undefined);

  const gramPanchayats = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villageOptions = React.useMemo(
    () => villages.filter((v) => v.block === block && v.gramPanchayat === gp),
    [villages, block, gp],
  );
  const selected = villages.find((v) => v.id === villageId) ?? null;
  const action = selected ? STAGE_ACTION[selected.stage] : null;

  const onBlockChange = (value: string) => {
    setBlock(value);
    setGp("");
    setVillageId("");
    setSavedAt(undefined);
  };
  const onGpChange = (value: string) => {
    setGp(value);
    setVillageId("");
    setSavedAt(undefined);
  };
  const onVillageChange = (value: string) => {
    setVillageId(value);
    setSavedAt(undefined);
  };

  const onSubmit = () => {
    const found: ErrorSummaryItem[] = [];
    if (!block) found.push({ fieldId: "vdp-block", message: "Choose a block." });
    else if (!gp) found.push({ fieldId: "vdp-gp", message: "Choose a Gram Panchayat." });
    else if (!villageId) found.push({ fieldId: "vdp-village", message: "Choose a village." });
    setErrors(found);
    if (found.length > 0 || !selected || !action) return;

    if (selected.stage === "DLCC Approved") {
      router.push(`${DISTRICT_BASE}/manage-adarsh-gram/declare`);
      return;
    }
    if (selected.stage === "Declared Adarsh Gram") {
      router.push(`${DISTRICT_BASE}/manage-adarsh-gram/requests`);
      return;
    }

    setSubmitting(true);
    /* No API yet: the register is illustrative, so the stage change is applied
       locally and acknowledged rather than pretending a write reached a server. */
    window.setTimeout(() => {
      setVillages((rows) =>
        rows.map((v) =>
          v.id === selected.id && action.nextStage ? { ...v, stage: action.nextStage } : v,
        ),
      );
      setSubmitting(false);
      setSavedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    }, 500);
  };

  return (
    <FormScreen
      breadcrumb={[
        { label: "Dashboard", href: `${DISTRICT_BASE}/dashboard` },
        { label: "Generate Complete VDP" },
      ]}
      eyebrow="Adarsh Gram — District"
      title="Generate Complete VDP"
      meta={`Generate and finalise the Village Development Plan for a village in ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}.`}
      errors={errors}
      onSubmit={onSubmit}
      submitLabel={action?.label ?? "Generate VDP"}
      submitting={submitting}
      savedAt={savedAt}
    >
      <FormSection title="Select Village" columns={3}>
        <FormField
          label="Block"
          id="vdp-block"
          required
          error={errors.find((e) => e.fieldId === "vdp-block")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={block}
              onChange={(event) => onBlockChange(event.target.value)}
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
          id="vdp-gp"
          required
          error={errors.find((e) => e.fieldId === "vdp-gp")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={gp}
              onChange={(event) => onGpChange(event.target.value)}
              placeholder="Select Gram Panchayat"
              disabled={!block}
            >
              {gramPanchayats.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Village"
          id="vdp-village"
          required
          error={errors.find((e) => e.fieldId === "vdp-village")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={villageId}
              onChange={(event) => onVillageChange(event.target.value)}
              placeholder="Select Village"
              disabled={!gp}
            >
              {villageOptions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.village}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      </FormSection>

      {selected ? (
        <FormSection
          title="Village Development Plan Status"
          description={`${selected.village} Gram Panchayat, ${selected.block} block.`}
        >
          <DescriptionList
            columns={3}
            items={[
              { term: "Population", value: count(selected.population) },
              { term: "Households", value: count(selected.households) },
              { term: "SC Population Share", value: `${selected.scShare}%` },
              { term: "Latest Village Score", value: selected.score },
              {
                term: "VDP Stage",
                value: <Badge status={STAGE_BADGE[selected.stage]}>{selected.stage}</Badge>,
              },
            ]}
          />
        </FormSection>
      ) : null}
    </FormScreen>
  );
}
