"use client";

/* Adarsh Gram — District: Removal of Selected Village.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/remove-village.

   DS Audit: WorklistScreen ✅ (owns all seven states, the pager and the phone cards) ·
   Modal ✅ · FormField ✅ · Textarea ✅ · Alert ✅ · Badge ✅ · Select ✅ · Search ✅ ·
   Button ✅ · Icon ✅. Nothing added.

   The live table lists villages ALREADY submitted for removal (S.No., District, Block,
   Gram Panchayat, Village, Status, remarks, requested date) and a single top-of-page
   "+ Submit Removal Request" button that opens a chooser for which village to remove.
   This screen is WorklistScreen over the district's whole VILLAGES register instead,
   with the removal request as a PER-ROW action — an officer can see every selected
   village and, from its own row, ask that it be removed, rather than choosing a village
   from a second picker with no context about it. The top-of-page button is dropped as
   redundant with the per-row action; the live District column is dropped too, for the
   same reason `agency/add` drops the State/District fields — every row in a district
   officer's own register is that one district, so the fact is said once, in the page's
   meta line, rather than repeated down a column (`.claude/rules/ui-restraint-and-copy.md`
   §1). Both divergences are deliberate. */

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  FormField,
  Modal,
  Search,
  Select,
  Textarea,
  WorklistScreen,
  screenCopy,
  type BadgeStatus,
  type ErrorSummaryItem,
  type WorklistColumn,
} from "@mosje/design-system";
import { BLOCKS, DISTRICT_SCOPE, PROVENANCE_LINE, VILLAGES, type VillageRecord } from "@/lib/pm-ajay/district/registers";
import { REMOVAL_REQUESTS, type RemovalStatus } from "@/lib/pm-ajay/district/removals";

const ALL_BLOCKS = "All Blocks";
const ALL_STATUSES = "All Statuses";

interface RemovalRow extends VillageRecord {
  removalStatus: RemovalStatus;
  reason: string | null;
  requestedOn: string | null;
  stateRemarks: string | null;
}

const STATUS_TONE: Record<RemovalStatus, BadgeStatus> = {
  "Not Requested": "neutral",
  "Pending with State": "warning",
  "Returned for Correction": "danger",
  Approved: "success",
};

function today(): string {
  return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function RemoveVillagePage() {
  const [requests, setRequests] = React.useState(REMOVAL_REQUESTS);
  const [query, setQuery] = React.useState("");
  const [block, setBlock] = React.useState(ALL_BLOCKS);
  const [status, setStatus] = React.useState<string>(ALL_STATUSES);
  const [openVillageId, setOpenVillageId] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState("");
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);

  const rows: RemovalRow[] = React.useMemo(
    () =>
      VILLAGES.map((village) => {
        const request = requests.find((r) => r.villageId === village.id);
        return {
          ...village,
          removalStatus: request?.status ?? "Not Requested",
          reason: request?.reason ?? null,
          requestedOn: request?.requestedOn ?? null,
          stateRemarks: request?.stateRemarks ?? null,
        };
      }),
    [requests],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (block !== ALL_BLOCKS && row.block !== block) return false;
      if (status !== ALL_STATUSES && row.removalStatus !== status) return false;
      if (q && !row.village.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, query, block, status]);

  const activeFilterCount =
    (query.trim() ? 1 : 0) + (block !== ALL_BLOCKS ? 1 : 0) + (status !== ALL_STATUSES ? 1 : 0);

  const openRow = rows.find((r) => r.id === openVillageId) ?? null;

  const openModal = (row: RemovalRow) => {
    setOpenVillageId(row.id);
    setReason("");
    setErrors([]);
  };

  const closeModal = () => {
    setOpenVillageId(null);
    setReason("");
    setErrors([]);
  };

  const onSubmit = () => {
    if (!reason.trim()) {
      setErrors([{ fieldId: "removal-reason", message: "State the reason this village should be removed." }]);
      return;
    }
    if (!openRow) return;
    setRequests((prev) => [
      ...prev,
      {
        villageId: openRow.id,
        status: "Pending with State",
        reason: reason.trim(),
        requestedOn: today(),
        stateRemarks: null,
      },
    ]);
    closeModal();
  };

  const columns: WorklistColumn<RemovalRow>[] = [
    { key: "village", header: "Village", priority: 1 },
    { key: "block", header: "Block", priority: 2 },
    { key: "gramPanchayat", header: "Gram Panchayat", priority: 2 },
    {
      key: "removalStatus",
      header: "Status",
      priority: 1,
      render: (row) => <Badge status={STATUS_TONE[row.removalStatus]}>{row.removalStatus}</Badge>,
    },
    { key: "requestedOn", header: "Requested Date", priority: 3, render: (row) => row.requestedOn ?? "—" },
  ];

  return (
    <>
      <WorklistScreen
        eyebrow="Manage Adarsh Gram"
        title="Removal of Selected Village"
        meta={`Villages selected for Adarsh Gram in ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}, and any request to remove one from the scheme. On approval, the Adarsh Gram and VDP details recorded for that village are also removed from the portal. ${PROVENANCE_LINE}`}
        filters={
          <>
            <Search
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={() => setQuery("")}
              placeholder="Search village"
              aria-label="Search villages"
            />
            <FormField label="Block" id="removal-block-filter">
              {(control) => (
                <Select {...control} value={block} onChange={(event) => setBlock(event.target.value)}>
                  <option value={ALL_BLOCKS}>{ALL_BLOCKS}</option>
                  {BLOCKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Removal Status" id="removal-status-filter">
              {(control) => (
                <Select {...control} value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value={ALL_STATUSES}>{ALL_STATUSES}</option>
                  <option value="Not Requested">Not Requested</option>
                  <option value="Pending with State">Pending with State</option>
                  <option value="Returned for Correction">Returned for Correction</option>
                  <option value="Approved">Approved</option>
                </Select>
              )}
            </FormField>
          </>
        }
        activeFilterCount={activeFilterCount}
        onClearFilters={() => {
          setQuery("");
          setBlock(ALL_BLOCKS);
          setStatus(ALL_STATUSES);
        }}
        columns={columns}
        rows={filtered}
        registerTotal={VILLAGES.length}
        getRowId={(row) => row.id}
        noun="village"
        pluralNoun="villages"
        rowActions={(row) =>
          row.removalStatus === "Not Requested" ? (
            <Button size="sm" variant="danger" appearance="outlined" onClick={() => openModal(row)}>
              Request Removal
            </Button>
          ) : null
        }
        copy={screenCopy({
          filteredTitle: "No village matches those filters",
          filteredDescription: "Clear the search, block or status to see the whole register.",
        })}
      />

      {openRow ? (
        <Modal
          open={Boolean(openRow)}
          onClose={closeModal}
          dirty={reason.trim().length > 0}
          title={`Request Removal — ${openRow.village}`}
          size="md"
          footer={
            <>
              <Button appearance="text" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={onSubmit}>
                Submit Removal Request
              </Button>
            </>
          }
        >
          <Alert status="warning" title="This cannot be undone">
            On the approval of this request, the Adarsh Gram and VDP details recorded for{" "}
            {openRow.village} will also be removed from the portal.
          </Alert>

          <FormField
            label="Reason for Removal"
            id="removal-reason"
            required
            error={errors.find((e) => e.fieldId === "removal-reason")?.message}
          >
            {(control) => (
              <Textarea
                {...control}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="State why this village should no longer be in the scheme"
                rows={4}
              />
            )}
          </FormField>
        </Modal>
      ) : null}
    </>
  );
}
