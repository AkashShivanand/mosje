"use client";

/* Adarsh Gram — District: Format – IV (Works Register).
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-4.

   DS Audit: WorklistScreen ✅ (owns all seven states, paging, phone cards, the count
   line) · FormField ✅ · Select ✅ · Badge ✅ · Button ✅ · IconButton ✅ · Icon ✅.
   Nothing added.

   The live screen asks Block, then Gram Panchayat, then Village, and shows "Select
   Block, Gram Panchayat and Village to view records." until all three are chosen —
   the register is not loaded until then, so this is the `idle` state
   (`.claude/rules/data-state-completeness.md` §1), not `empty`. State and District are
   fixed for this officer and shown as disabled fields on the live screen; following the
   Agency Master precedent (`agency/list`), they are stated in the meta line instead of
   drawn as two dead controls (`.claude/rules/ui-restraint-and-copy.md` §1). */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  FormField,
  Icon,
  IconButton,
  Select,
  WorklistScreen,
  screenCopy,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
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
import { WORK_STATUS_TONE } from "@/lib/pm-ajay/district/format-4";

const COLUMNS: WorklistColumn<WorkRecord>[] = [
  { key: "work", header: "Work / Activity", priority: 1 },
  { key: "domain", header: "Domain", priority: 2 },
  { key: "agency", header: "Agency", priority: 3 },
  {
    key: "sanctioned",
    align: "end",
    header: "Sanctioned",
    priority: 2,
    render: (row) => lakh(row.sanctioned),
  },
  {
    key: "released",
    align: "end",
    header: "Released",
    priority: 2,
    render: (row) => lakh(row.released),
  },
  {
    key: "utilised",
    align: "end",
    header: "Utilised",
    priority: 3,
    render: (row) => lakh(row.utilised),
  },
  {
    key: "status",
    header: "Status",
    priority: 1,
    render: (row) => <Badge status={WORK_STATUS_TONE[row.status]}>{row.status}</Badge>,
  },
  { key: "targetDate", header: "Target Date", priority: 3 },
];

export default function Format4Page() {
  const [block, setBlock] = React.useState("");
  const [gramPanchayat, setGramPanchayat] = React.useState("");
  const [village, setVillage] = React.useState("");

  const gramPanchayats = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villages = React.useMemo(
    () => VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat),
    [block, gramPanchayat],
  );

  const villageChosen = block !== "" && gramPanchayat !== "" && village !== "";

  const rows = React.useMemo(
    () => (villageChosen ? WORKS.filter((w) => w.village === village) : []),
    [villageChosen, village],
  );

  const addHref = villageChosen
    ? `${DISTRICT_BASE}/format-4/form?block=${encodeURIComponent(block)}&gramPanchayat=${encodeURIComponent(gramPanchayat)}&village=${encodeURIComponent(village)}`
    : `${DISTRICT_BASE}/format-4/form`;

  return (
    <WorklistScreen
      asked={villageChosen}
      eyebrow="Village Format — Adarsh Gram, District"
      title="Format – IV: Action Plan and Progress Report of Infrastructure Works"
      meta={`Infrastructure works sanctioned for the chosen village, ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}. ${PROVENANCE_LINE}`}
      actions={
        villageChosen ? (
          <Button href={addHref} linkAs={Link} iconLeft={<Icon name="add" size={20} />}>
            Add Work
          </Button>
        ) : undefined
      }
      filters={
        <>
          <FormField label="Block" id="f4-block" required>
            {(control) => (
              <Select
                {...control}
                value={block}
                placeholder="Select Block"
                onChange={(event) => {
                  setBlock(event.target.value);
                  setGramPanchayat("");
                  setVillage("");
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
          <FormField label="Gram Panchayat" id="f4-gram-panchayat" required>
            {(control) => (
              <Select
                {...control}
                value={gramPanchayat}
                placeholder="Select Gram Panchayat"
                disabled={!block}
                onChange={(event) => {
                  setGramPanchayat(event.target.value);
                  setVillage("");
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
          <FormField label="Village" id="f4-village" required>
            {(control) => (
              <Select
                {...control}
                value={village}
                placeholder="Select Village"
                disabled={!gramPanchayat}
                onChange={(event) => setVillage(event.target.value)}
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.village}>
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
          aria-label={`Edit ${row.work}`}
          variant="neutral"
          appearance="text"
          size="sm"
          tooltip
          href={`${DISTRICT_BASE}/format-4/form?block=${encodeURIComponent(block)}&gramPanchayat=${encodeURIComponent(gramPanchayat)}&village=${encodeURIComponent(village)}&work=${row.id}`}
          linkAs={Link}
        />
      )}
      emptyAction={
        <Button href={addHref} linkAs={Link}>
          Add the First Work
        </Button>
      }
      copy={screenCopy({
        idleTitle: "Select a Block, Gram Panchayat and Village",
        idleDescription:
          "Choose the village to see the infrastructure works recorded for it under Format – IV.",
        emptyTitle: "No Work Is Recorded for This Village",
        emptyDescription:
          "Add the first infrastructure work identified for this village under Adarsh Gram.",
      })}
    />
  );
}
