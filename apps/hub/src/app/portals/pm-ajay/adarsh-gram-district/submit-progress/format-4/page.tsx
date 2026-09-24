"use client";

/* Adarsh Gram — District: Submit Progress — Format IV (Works).
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/submit-progress/format-4.

   DS Audit: WorklistScreen ✅ (owns all seven states, the pager, the phone cards and the
   count line) · Modal ✅ · FormField ✅ · Select ✅ · NumberInput ✅ · Textarea ✅ ·
   Badge ✅ · Button ✅ · IconButton ✅ · Icon ✅. Nothing added.

   The live screen asks for State and District and then disables both — a district
   officer has only one of each. Following the `agency/add` precedent, they are stated
   in the page's meta line instead of two dead fields (`.claude/rules/ui-restraint-and-copy.md`
   §1). Block, Gram Panchayat and Village stay as the live screen has them: three
   cascading selects, each disabled until its parent is chosen, and the register stays
   `idle` — not `empty` — until all three are set. That is the live screen's own
   "Select Block, Gram Panchayat and Village to view records." sentence, reproduced as
   the template's idle state rather than as a paragraph under an empty table. */

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
  PROVENANCE_LINE,
  VILLAGES,
  WORKS,
  lakh,
  type WorkRecord,
} from "@/lib/pm-ajay/district/registers";

const STATUS_OPTIONS: WorkRecord["status"][] = ["Identified", "In Progress", "Completed", "Withheld"];

const STATUS_TONE: Record<WorkRecord["status"], "neutral" | "info" | "success" | "danger"> = {
  Identified: "neutral",
  "In Progress": "info",
  Completed: "success",
  Withheld: "danger",
};

const COLUMNS: WorklistColumn<WorkRecord>[] = [
  { key: "work", header: "Work", priority: 1 },
  { key: "domain", header: "Domain", priority: 2 },
  { key: "agency", header: "Agency", priority: 3 },
  {
    key: "sanctioned",
    align: "end",
    header: "Sanctioned",
    priority: 3,
    render: (row) => lakh(row.sanctioned),
    sortValue: (row) => row.sanctioned,
  },
  {
    key: "utilised",
    align: "end",
    header: "Utilised",
    priority: 2,
    render: (row) => lakh(row.utilised),
    sortValue: (row) => row.utilised,
  },
  {
    key: "status",
    header: "Status",
    priority: 2,
    render: (row) => <Badge status={STATUS_TONE[row.status]}>{row.status}</Badge>,
  },
  { key: "targetDate", header: "Target Date", priority: 3 },
];

interface ProgressDraft {
  status: WorkRecord["status"];
  utilised: number | null;
  remarks: string;
}

function ReportProgressModal({
  work,
  onClose,
  onSave,
}: {
  work: WorkRecord;
  onClose: () => void;
  onSave: (id: string, patch: Pick<WorkRecord, "status" | "utilised">) => void;
}) {
  /* Seeded from the row at MOUNT, and the call site gives the element a `key` of the
     work's id — React's own way to reset state for a different record. An effect that
     copied props into state here was a cascading render, and `react-hooks/
     set-state-in-effect` fails the build for it. */
  const [draft, setDraft] = React.useState<ProgressDraft>(() => ({
    status: work.status,
    utilised: work.utilised,
    remarks: "",
  }));
  const [error, setError] = React.useState<string | undefined>(undefined);

  const dirty = draft.status !== work.status || draft.utilised !== work.utilised || draft.remarks.trim() !== "";

  const handleSave = () => {
    if (draft.utilised == null) {
      setError("Enter the amount utilised so far.");
      return;
    }
    if (draft.utilised > work.sanctioned) {
      setError(`Utilised amount cannot exceed the ${lakh(work.sanctioned)} sanctioned.`);
      return;
    }
    onSave(work.id, { status: draft.status, utilised: draft.utilised });
  };

  return (
    <Modal
      open={work != null}
      onClose={onClose}
      dirty={dirty}
      title={`Report Progress — ${work.work}`}
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
        {work.village} · {work.agency} · Target {work.targetDate} · Sanctioned {lakh(work.sanctioned)}
      </p>

      <FormField label="Status" id="progress-status" required>
        {(control) => (
          <Select
            {...control}
            value={draft.status}
            onChange={(event) =>
              setDraft((d) => (d ? { ...d, status: event.target.value as WorkRecord["status"] } : d))
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
        label="Amount Utilised"
        value={draft.utilised}
        onValueChange={(value) => setDraft((d) => (d ? { ...d, utilised: value } : d))}
        min={0}
        max={work.sanctioned}
        precision={1}
        prefix="₹"
        suffix="lakh"
        hint={`Against ${lakh(work.sanctioned)} sanctioned and ${lakh(work.released)} released.`}
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

export default function SubmitProgressFormat4Page() {
  const [works, setWorks] = React.useState<WorkRecord[]>(WORKS);
  const [block, setBlock] = React.useState("");
  const [gramPanchayat, setGramPanchayat] = React.useState("");
  const [villageId, setVillageId] = React.useState("");
  const [activeWorkId, setActiveWorkId] = React.useState<string | null>(null);

  const gpOptions = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villageOptions = React.useMemo(
    () => (block && gramPanchayat ? VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat) : []),
    [block, gramPanchayat],
  );
  const selectedVillage = VILLAGES.find((v) => v.id === villageId) ?? null;
  const asked = selectedVillage != null;

  const rows = React.useMemo(
    () => (selectedVillage ? works.filter((w) => w.village === selectedVillage.village) : []),
    [works, selectedVillage],
  );
  const activeWork = works.find((w) => w.id === activeWorkId) ?? null;

  return (
    <>
      <WorklistScreen
        eyebrow="Adarsh Gram — District · Submit Progress"
        title="Format – IV: Action Plan and Progress Report of Infrastructure Works"
        meta={`Report progress against each work sanctioned for the chosen village, ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} — FY ${DISTRICT_SCOPE.financialYear}. ${PROVENANCE_LINE}`}
        asked={asked}
        filters={
          <>
            <FormField label="Block" id="f4-block" required>
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
            <FormField label="Gram Panchayat" id="f4-gp" required disabled={!block}>
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
            <FormField label="Village" id="f4-village" required disabled={!gramPanchayat}>
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
          </>
        }
        columns={COLUMNS}
        rows={rows}
        getRowId={(row) => row.id}
        noun="work"
        pluralNoun="works"
        rowActions={(row) => (
          <IconButton
            icon={<Icon name="edit" size={20} />}
            aria-label={`Report progress for ${row.work}`}
            variant="neutral"
            appearance="text"
            size="sm"
            tooltip
            onClick={() => setActiveWorkId(row.id)}
          />
        )}
        copy={screenCopy({
          idleTitle: "Select a Village to View Its Works",
          idleDescription: "Choose the block, gram panchayat and village to see the works sanctioned there.",
          emptyTitle: "No Works Are Sanctioned for This Village Yet",
          emptyDescription: "Works are added against a village under Format – II before they appear here.",
        })}
      />
      {activeWork ? (
      <ReportProgressModal
        key={activeWork.id}
        work={activeWork}
        onClose={() => setActiveWorkId(null)}
        onSave={(id, patch) => {
          setWorks((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
          setActiveWorkId(null);
        }}
      />
      ) : null}
    </>
  );
}
