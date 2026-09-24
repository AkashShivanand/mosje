"use client";

/* Adarsh Gram — District: Submit Progress — Format V (Beneficiary Initiatives).
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/submit-progress/format-5.

   DS Audit: WorklistScreen ✅ · Modal ✅ · FormField ✅ · Select ✅ · NumberInput ✅ ·
   Textarea ✅ · Badge ✅ · Button ✅ · IconButton ✅ · Icon ✅. Nothing added.

   Five cascading selects on the live screen — Block, Gram Panchayat, Village, Domain,
   Monitorable Indicator — each disabled until its parent is chosen, exactly reproduced.
   State and District are dropped to the meta line, per the `agency/add` precedent
   (`.claude/rules/ui-restraint-and-copy.md` §1). `BENEFICIARY_PROGRESS` (in
   `lib/pm-ajay/district/submit-progress.ts`) widens the district's own `BENEFICIARIES`
   register with the Domain and Monitorable Indicator this screen filters by — a field
   the base register has no reason to carry, since only this screen asks for it. */

import * as React from "react";
import {
  Badge,
  Button,
  FormField,
  Icon,
  IconButton,
  Modal,
  NumberInput,
  Select,
  Textarea,
  WorklistScreen,
  screenCopy,
  type WorklistColumn,
} from "@mosje/design-system";
import {
  BLOCKS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  INDICATOR_DOMAINS,
  PROVENANCE_LINE,
  VILLAGES,
  lakh,
} from "@/lib/pm-ajay/district/registers";
import {
  BENEFICIARY_PROGRESS,
  MONITORABLE_INDICATORS,
  type BeneficiaryProgress,
} from "@/lib/pm-ajay/district/submit-progress";

const STATUS_OPTIONS: BeneficiaryProgress["status"][] = ["Pending", "Sanctioned", "Disbursed"];

const STATUS_TONE: Record<BeneficiaryProgress["status"], "neutral" | "info" | "success"> = {
  Pending: "neutral",
  Sanctioned: "info",
  Disbursed: "success",
};

const COLUMNS: WorklistColumn<BeneficiaryProgress>[] = [
  { key: "beneficiary", header: "Beneficiary", priority: 1 },
  { key: "initiative", header: "Initiative", priority: 2 },
  { key: "scheme", header: "Scheme", priority: 2 },
  {
    key: "sanctionedAmount",
    align: "end",
    header: "Sanctioned Amount",
    priority: 3,
    render: (row) => lakh(row.sanctionedAmount),
    sortValue: (row) => row.sanctionedAmount,
  },
  {
    key: "physicalProgress",
    align: "end",
    header: "Progress",
    priority: 2,
    render: (row) => `${row.physicalProgress}%`,
    sortValue: (row) => row.physicalProgress,
  },
  {
    key: "status",
    header: "Status",
    priority: 2,
    render: (row) => <Badge status={STATUS_TONE[row.status]}>{row.status}</Badge>,
  },
];

interface ProgressDraft {
  status: BeneficiaryProgress["status"];
  physicalProgress: number | null;
  remarks: string;
}

function ReportProgressModal({
  beneficiary,
  onClose,
  onSave,
}: {
  beneficiary: BeneficiaryProgress;
  onClose: () => void;
  onSave: (id: string, patch: Pick<BeneficiaryProgress, "status" | "physicalProgress">) => void;
}) {
  /* Seeded from the row at MOUNT, and the call site gives the element a `key` of the
     beneficiary's id — React's own way to reset state for a different record. An effect
     that copied props into state here was a cascading render, and `react-hooks/
     set-state-in-effect` fails the build for it. */
  const [draft, setDraft] = React.useState<ProgressDraft>(() => ({
    status: beneficiary.status,
    physicalProgress: beneficiary.physicalProgress,
    remarks: "",
  }));
  const [error, setError] = React.useState<string | undefined>(undefined);

  const dirty =
    draft.status !== beneficiary.status ||
    draft.physicalProgress !== beneficiary.physicalProgress ||
    draft.remarks.trim() !== "";

  const handleSave = () => {
    if (draft.physicalProgress == null) {
      setError("Enter the physical progress reported so far.");
      return;
    }
    onSave(beneficiary.id, { status: draft.status, physicalProgress: draft.physicalProgress });
  };

  return (
    <Modal
      open={beneficiary != null}
      onClose={onClose}
      dirty={dirty}
      title={`Report Progress — ${beneficiary.beneficiary}`}
      size="sm"
      footer={
        <>
          <Button appearance="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Progress</Button>
        </>
      }
    >
      <p>
        {beneficiary.village} · {beneficiary.initiative} · {beneficiary.scheme} · Need identified{" "}
        {beneficiary.needIdentifiedOn}
      </p>

      <FormField label="Status" id="progress-status" required>
        {(control) => (
          <Select
            {...control}
            value={draft.status}
            onChange={(event) =>
              setDraft((d) => (d ? { ...d, status: event.target.value as BeneficiaryProgress["status"] } : d))
            }
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <NumberInput
        label="Physical Progress"
        value={draft.physicalProgress}
        onValueChange={(value) => setDraft((d) => (d ? { ...d, physicalProgress: value } : d))}
        min={0}
        max={100}
        suffix="%"
        hint={`Against ${lakh(beneficiary.sanctionedAmount)} sanctioned.`}
        error={error}
      />

      <FormField label="Remarks" id="progress-remarks" hint="Optional. What changed since the last report.">
        {(control) => (
          <Textarea
            {...control}
            value={draft.remarks}
            onChange={(event) => setDraft((d) => (d ? { ...d, remarks: event.target.value } : d))}
            rows={3}
          />
        )}
      </FormField>
    </Modal>
  );
}

export default function SubmitProgressFormat5Page() {
  const [beneficiaries, setBeneficiaries] = React.useState<BeneficiaryProgress[]>(BENEFICIARY_PROGRESS);
  const [block, setBlock] = React.useState("");
  const [gramPanchayat, setGramPanchayat] = React.useState("");
  const [villageId, setVillageId] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [indicator, setIndicator] = React.useState("");
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const gpOptions = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villageOptions = React.useMemo(
    () => (block && gramPanchayat ? VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat) : []),
    [block, gramPanchayat],
  );
  const selectedVillage = VILLAGES.find((v) => v.id === villageId) ?? null;
  const indicatorOptions = domain ? (MONITORABLE_INDICATORS[domain] ?? []) : [];
  const asked = selectedVillage != null && domain !== "" && indicator !== "";

  const rows = React.useMemo(
    () =>
      selectedVillage
        ? beneficiaries.filter(
            (b) => b.village === selectedVillage.village && b.domain === domain && b.indicator === indicator,
          )
        : [],
    [beneficiaries, selectedVillage, domain, indicator],
  );
  const active = beneficiaries.find((b) => b.id === activeId) ?? null;

  return (
    <>
      <WorklistScreen
        eyebrow="Adarsh Gram — District · Submit Progress"
        title="Format – V: Action Plan and Progress Report for Beneficiary Oriented Initiatives"
        meta={`Details of households and beneficiaries where need has been identified, ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} — FY ${DISTRICT_SCOPE.financialYear}. ${PROVENANCE_LINE}`}
        asked={asked}
        filters={
          <>
            <FormField label="Block" id="f5-block" required>
              {(control) => (
                <Select
                  {...control}
                  placeholder="Select Block"
                  value={block}
                  onChange={(event) => {
                    setBlock(event.target.value);
                    setGramPanchayat("");
                    setVillageId("");
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
            <FormField label="Gram Panchayat" id="f5-gp" required disabled={!block}>
              {(control) => (
                <Select
                  {...control}
                  placeholder="Select Gram Panchayat"
                  value={gramPanchayat}
                  onChange={(event) => {
                    setGramPanchayat(event.target.value);
                    setVillageId("");
                  }}
                >
                  {gpOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Village" id="f5-village" required disabled={!gramPanchayat}>
              {(control) => (
                <Select
                  {...control}
                  placeholder="Select Village"
                  value={villageId}
                  onChange={(event) => setVillageId(event.target.value)}
                >
                  {villageOptions.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.village}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Domain" id="f5-domain" required disabled={!villageId}>
              {(control) => (
                <Select
                  {...control}
                  placeholder="Select Domain"
                  value={domain}
                  onChange={(event) => {
                    setDomain(event.target.value);
                    setIndicator("");
                  }}
                >
                  {INDICATOR_DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Monitorable Indicator" id="f5-indicator" required disabled={!domain}>
              {(control) => (
                <Select
                  {...control}
                  placeholder="Select Monitorable Indicator"
                  value={indicator}
                  onChange={(event) => setIndicator(event.target.value)}
                >
                  {indicatorOptions.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </>
        }
        columns={COLUMNS}
        rows={rows}
        getRowId={(row) => row.id}
        noun="beneficiary"
        pluralNoun="beneficiaries"
        rowActions={(row) => (
          <IconButton
            icon={<Icon name="edit" size={20} />}
            aria-label={`Report progress for ${row.beneficiary}`}
            variant="neutral"
            appearance="text"
            size="sm"
            tooltip
            onClick={() => setActiveId(row.id)}
          />
        )}
        copy={screenCopy({
          idleTitle: "Select a Village, Domain and Indicator to View Records",
          idleDescription:
            "Choose the block, gram panchayat, village, domain and monitorable indicator to see the beneficiaries recorded there.",
          emptyTitle: "No Need Has Been Identified Here Yet",
          emptyDescription: "Households and beneficiaries are recorded against this indicator under Format – III(B).",
        })}
      />
      {active ? (
      <ReportProgressModal
        key={active.id}
        beneficiary={active}
        onClose={() => setActiveId(null)}
        onSave={(id, patch) => {
          setBeneficiaries((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
          setActiveId(null);
        }}
      />
      ) : null}
    </>
  );
}
