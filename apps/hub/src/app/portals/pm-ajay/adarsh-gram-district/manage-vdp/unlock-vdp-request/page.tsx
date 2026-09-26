"use client";

/* Adarsh Gram — District: Unlock VDP Request.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/manage-vdp/unlock-vdp-request.

   DS Audit: WorklistScreen ✅ (owns all seven states, paging, the phone cards)
   · Modal ✅ · FormField ✅ · Select ✅ · Textarea ✅ · ErrorSummary ✅ · Badge ✅
   · Alert ✅ · Search ✅ · Button ✅ · Icon ✅. Nothing added.

   The live "Add Unlock VDP Request" only ever asks for two things — which
   village, and why — so it is a `Modal` over the register rather than a
   second page: a whole route for two fields would be the "twelve-field form
   that loses work" `FormScreen`'s own docstring warns against, in reverse. */

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  ErrorSummary,
  FormField,
  Icon,
  Modal,
  Search,
  Select,
  Textarea,
  WorklistScreen,
  screenCopy,
  type ErrorSummaryItem,
  type WorklistColumn,
} from "@mosje/design-system";
import {
  DISTRICT_SCOPE,
  VDP_UNLOCK_REQUESTS,
  VILLAGES,
  type VdpUnlockRequest,
} from "@/lib/pm-ajay/district/registers";

const STATUS_TONE: Record<VdpUnlockRequest["status"], "warning" | "success" | "danger"> = {
  "Pending with State": "warning",
  Unlocked: "success",
  Rejected: "danger",
};

const COLUMNS: WorklistColumn<VdpUnlockRequest>[] = [
  { key: "village", header: "Village", priority: 1 },
  { key: "requestedOn", header: "Requested On", priority: 2 },
  { key: "reason", header: "Reason", priority: 2 },
  {
    key: "status",
    header: "Status",
    priority: 1,
    render: (row) => <Badge status={STATUS_TONE[row.status]}>{row.status}</Badge>,
  },
];

export default function UnlockVdpRequestPage() {
  const [requests, setRequests] = React.useState<VdpUnlockRequest[]>(() =>
    VDP_UNLOCK_REQUESTS.map((r) => ({ ...r })),
  );
  const [query, setQuery] = React.useState("");
  const [notice, setNotice] = React.useState<string | null>(null);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [draftVillage, setDraftVillage] = React.useState("");
  const [draftReason, setDraftReason] = React.useState("");
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  /* Only a village that already has a VDP can have it unlocked, and one
     already awaiting the state's decision cannot be asked twice. */
  const eligibleVillages = React.useMemo(
    () =>
      VILLAGES.filter(
        (v) =>
          v.stage !== "VDP Not Generated" &&
          !requests.some((r) => r.village === v.village && r.status === "Pending with State"),
      ),
    [requests],
  );

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter((r) =>
      `${r.village} ${r.reason} ${r.status}`.toLowerCase().includes(q),
    );
  }, [requests, query]);

  const activeFilterCount = query.trim() ? 1 : 0;

  const dirty = draftVillage.trim().length > 0 || draftReason.trim().length > 0;

  const openModal = () => {
    setDraftVillage("");
    setDraftReason("");
    setErrors([]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrors([]);
  };

  const onRaiseRequest = () => {
    const found: ErrorSummaryItem[] = [];
    if (!draftVillage) found.push({ fieldId: "unlock-village", message: "Choose the village." });
    if (draftReason.trim().length < 10)
      found.push({
        fieldId: "unlock-reason",
        message: "Explain why the VDP must be unlocked, in at least a few words.",
      });
    setErrors(found);
    if (found.length > 0) return;

    setSubmitting(true);
    window.setTimeout(() => {
      setRequests((prev) => [
        {
          id: `u-${Date.now()}`,
          village: draftVillage,
          requestedOn: DISTRICT_SCOPE.asOf,
          reason: draftReason.trim(),
          status: "Pending with State",
        },
        ...prev,
      ]);
      setSubmitting(false);
      setModalOpen(false);
      setNotice(`Unlock request raised for ${draftVillage}.`);
    }, 500);
  };

  return (
    <>
      <WorklistScreen
        eyebrow="Adarsh Gram — District"
        title="Unlock VDP Request"
        meta={`Requests to reopen a finalised Village Development Plan, raised to the state, for ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}.`}
        actions={
          <Button iconLeft={<Icon name="add" size={20} />} onClick={openModal}>
            Add Unlock VDP Request
          </Button>
        }
        summary={
          notice ? (
            <Alert status="success" dismissible onDismiss={() => setNotice(null)}>
              {notice}
            </Alert>
          ) : null
        }
        filters={
          <Search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Village or reason"
            aria-label="Search unlock requests"
          />
        }
        activeFilterCount={activeFilterCount}
        onClearFilters={() => setQuery("")}
        columns={COLUMNS}
        rows={rows}
        registerTotal={requests.length}
        getRowId={(row) => row.id}
        noun="unlock request"
        pluralNoun="unlock requests"
        copy={screenCopy({
          emptyTitle: "No unlock request has been raised for this district",
          emptyDescription:
            "Raise a request when a village's VDP must be reopened after it has been finalised or DLCC-approved.",
          filteredTitle: "No unlock request matches that search",
          filteredDescription: "Clear the search to see the whole register.",
        })}
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        dirty={dirty}
        title="Add Unlock VDP Request"
        footer={
          <>
            <Button appearance="outlined" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={onRaiseRequest} disabled={submitting}>
              {submitting ? "Raising…" : "Raise Request"}
            </Button>
          </>
        }
      >
        {errors.length > 0 ? <ErrorSummary errors={errors} /> : null}
        <FormField
          label="Village"
          id="unlock-village"
          required
          error={errors.find((e) => e.fieldId === "unlock-village")?.message}
        >
          {(control) => (
            <Select
              {...control}
              value={draftVillage}
              onChange={(event) => setDraftVillage(event.target.value)}
              placeholder="Select Village"
            >
              {eligibleVillages.map((v) => (
                <option key={v.id} value={v.village}>
                  {v.village}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField
          label="Reason for Unlocking"
          id="unlock-reason"
          required
          hint="Explain what must be corrected once the VDP is reopened."
          error={errors.find((e) => e.fieldId === "unlock-reason")?.message}
        >
          {(control) => (
            <Textarea
              {...control}
              value={draftReason}
              onChange={(event) => setDraftReason(event.target.value)}
              rows={4}
            />
          )}
        </FormField>
      </Modal>
    </>
  );
}
