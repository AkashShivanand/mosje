"use client";

// DS Audit — all existing DS unless noted:
//   Card ✅ · Button ✅ · Alert ✅ · Badge ✅ · Modal ✅ · Textarea ✅ · FormField ✅
//   Input ✅ · Lightbox ✅ · EmptyState ✅ · GeoPhotoInput ✅ (added this session)
//   ApprovalTimeline ✅ (added this session)

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Alert, ApprovalTimeline, Button, Card, EmptyState, FormField, GeoPhotoInput, Icon, Input, Lightbox, Modal, Textarea, formatCoordinates, type GeoPhoto } from "@mosje/design-system";
import { AdminShell } from "@/components/nmba/admin-shell";
import { StatusBadge, VerificationBadge } from "@/components/nmba/mass-pledge/status-badge";
import { useToast } from "@/components/nmba/toast";
import { usePortalSession } from "@/lib/nmba/committee/session-context";
import { roleLabel } from "@/lib/nmba/committee/session";
import { useMassPledgeStore, StorageBudgetError } from "@/lib/nmba/mass-pledge/store";
import {
  COUNT_HINTS,
  EVENT_DATE_LABEL,
  MAX_PHOTOS,
  MAX_PHOTO_MB,
  MIN_PHOTOS,
} from "@/lib/nmba/mass-pledge/masters";
import { canApprove, canEdit, isVisibleTo, pendingLabel } from "@/lib/nmba/mass-pledge/workflow";
import {
  computeTotal,
  REPORTER_LABEL,
  submissionScopeLabel,
} from "@/lib/nmba/mass-pledge/types";

const BASE = "/portals/nmba/admin/mass-pledge";

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line py-2.5 last:border-0 sm:flex-row sm:gap-4">
      <dt className="w-full text-sm text-ink-muted sm:w-64 sm:shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export default function MassPledgeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const session = usePortalSession();
  const { toast } = useToast();
  const { submissions, approveSubmission, returnSubmission, resubmitSubmission, updateSubmission } =
    useMassPledgeStore();

  const submission = submissions.find((s) => s.id === params.id);

  const [returnOpen, setReturnOpen] = React.useState(false);
  const [remarks, setRemarks] = React.useState("");
  const [remarksError, setRemarksError] = React.useState("");
  const [lightbox, setLightbox] = React.useState<number | null>(null);

  const [editing, setEditing] = React.useState(false);
  const [editCounts, setEditCounts] = React.useState({ youth: "", women: "", others: "" });
  const [editPhotos, setEditPhotos] = React.useState<GeoPhoto[]>([]);

  if (!submission || !isVisibleTo(submission, session)) {
    return (
      <AdminShell>
        <EmptyState
          title="Submission not found"
          description="It may have been removed, or it falls outside your jurisdiction."
          action={<Button onClick={() => router.push(BASE)}>Back to submissions</Button>}
        />
      </AdminShell>
    );
  }

  const total = computeTotal(submission.counts);
  const mayApprove = canApprove(submission, session);
  const mayEdit = canEdit(submission, session);
  const lastReturn = [...submission.history].reverse().find((e) => e.action === "RETURNED");

  const startEditing = () => {
    setEditCounts({
      youth: String(submission.counts.youth),
      women: String(submission.counts.women),
      others: String(submission.counts.others),
    });
    setEditPhotos(submission.photos);
    setEditing(true);
  };

  const handleApprove = () => {
    approveSubmission(submission.id, session);
    toast("Submission approved.", "success");
  };

  const handleReturn = () => {
    if (!remarks.trim()) {
      setRemarksError("Explain what needs correcting so the officer can act on it.");
      return;
    }
    returnSubmission(submission.id, session, remarks);
    setReturnOpen(false);
    setRemarks("");
    setRemarksError("");
    toast("Submission returned for correction.", "success");
  };

  // Deliberately not gated on the reporting window: a report that an approver
  // returned late in the window must still be correctable, otherwise the
  // approver's own timing could strand a legitimate figure.
  const handleResubmit = () => {
    const counts = {
      youth: Number(editCounts.youth || 0),
      women: Number(editCounts.women || 0),
      others: Number(editCounts.others || 0),
    };
    if (computeTotal(counts) <= 0) {
      toast("Enter the participation figures before resubmitting.", "error");
      return;
    }
    if (editPhotos.length < MIN_PHOTOS) {
      toast(`Attach at least ${MIN_PHOTOS} photograph before resubmitting.`, "error");
      return;
    }
    // Replacement photos can push the persisted payload over the storage
    // budget, exactly as they can on the main form — surface it the same way
    // instead of letting the write throw out of the click handler.
    try {
      updateSubmission(submission.id, {
        counts,
        photos: editPhotos,
        locationUnavailable: editPhotos.every((p) => p.lat === null),
      });
      resubmitSubmission(submission.id, session);
    } catch (error) {
      toast(
        error instanceof StorageBudgetError
          ? error.message
          : "Something went wrong while saving. Please try again.",
        "error",
      );
      return;
    }
    setEditing(false);
    toast("Corrected report resubmitted for approval.", "success");
  };

  return (
    <AdminShell>
      <header className="mb-8">
        <Link
          href={BASE}
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-navy"
        >
          <Icon name="arrow_back" size={16} aria-hidden="true" />
          All reports
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div>
            {/* The reporter kind is context, so it sits above the name at a
                lower weight rather than competing with it on the same line. */}
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-hint">
              {REPORTER_LABEL[submission.reporterKind]}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">
              {submissionScopeLabel(submission) || REPORTER_LABEL[submission.reporterKind]}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">{EVENT_DATE_LABEL}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge status={submission.status} />
            <VerificationBadge verification={submission.verification} />
          </div>
        </div>
      </header>

      {lastReturn && submission.status === "RETURNED" && (
        <Alert status="warning" title="Returned for correction" className="mb-5">
          <p>{lastReturn.remarks}</p>
          <p className="mt-1 text-xs">
            Returned by {lastReturn.actorDisplayName}, {roleLabel(lastReturn.actorRole)}
          </p>
        </Alert>
      )}

      {submission.locationUnavailable && (
        <Alert status="warning" title="No location on the photographs" className="mb-5">
          None of the attached photographs carry coordinates. This is common when photographs are
          forwarded through messaging apps, which strip that data. Treat it as something to weigh,
          not proof of a problem.
        </Alert>
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-5">
          <Card>
            <div className="p-4">
              <h2 className="mb-2 text-base font-semibold text-ink">Participation</h2>

              {editing ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(["youth", "women", "others"] as const).map((field) => (
                      <FormField
                        key={field}
                        label={field === "youth" ? "Youth" : field === "women" ? "Women" : "Others"}
                        id={`edit-${field}`}
                        hint={COUNT_HINTS[field]}
                      >
                        {(control) => (
                          <Input
                            {...control}
                            inputMode="numeric"
                            value={editCounts[field]}
                            onChange={(e) =>
                              setEditCounts((c) => ({
                                ...c,
                                [field]: e.target.value.replace(/[^\d]/g, ""),
                              }))
                            }
                          />
                        )}
                      </FormField>
                    ))}
                  </div>
                  <div className="mt-4">
                    <FormField label="Photographs" id="edit-photos">
                      {(control) => (
                        <GeoPhotoInput
                          {...control}
                          value={editPhotos}
                          onChange={setEditPhotos}
                          minItems={MIN_PHOTOS}
                          maxItems={MAX_PHOTOS}
                          maxSizeMb={MAX_PHOTO_MB}
                        />
                      )}
                    </FormField>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button appearance="outlined" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleResubmit}>Resubmit for approval</Button>
                  </div>
                </>
              ) : (
                <dl>
                  <Row
                    label="Youth (under 30, any gender)"
                    value={submission.counts.youth.toLocaleString("en-IN")}
                  />
                  <Row
                    label="Women (30 and above)"
                    value={submission.counts.women.toLocaleString("en-IN")}
                  />
                  <Row label="Others" value={submission.counts.others.toLocaleString("en-IN")} />
                  <Row
                    label="Total participants"
                    value={
                      <strong className="text-base text-navy">{total.toLocaleString("en-IN")}</strong>
                    }
                  />
                </dl>
              )}
            </div>
          </Card>

          {!editing && (
            <Card>
              <div className="p-4">
                <h2 className="mb-3 text-base font-semibold text-ink">
                  Photographs ({submission.photos.length})
                </h2>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {submission.photos.map((photo, i) => {
                    const located = photo.lat !== null && photo.lng !== null;
                    return (
                      <li key={photo.id}>
                        <button
                          type="button"
                          onClick={() => setLightbox(i)}
                          className="group w-full overflow-hidden rounded-lg border border-line text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.thumbDataUrl}
                            alt={photo.originalName}
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <span className="flex items-center gap-1 px-2 py-1.5 text-[11px] text-ink-muted">
                            {located ? (
                              <>
                                <Icon name="location_on" size={12} className="shrink-0" aria-hidden="true" />
                                <span className="truncate">
                                  {formatCoordinates(photo.lat!, photo.lng!)}
                                </span>
                              </>
                            ) : (
                              <>
                                <Icon name="location_off" size={12} className="shrink-0 text-await-fg" aria-hidden="true" />
                                <span className="text-await-fg">No location</span>
                              </>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Card>
          )}

          <Card>
            <div className="p-4">
              <h2 className="mb-2 text-base font-semibold text-ink">Report details</h2>
              <dl>
                {submission.coordinatingMinistry && (
                  <Row
                    label="Coordinating ministry"
                    value={submission.coordinatingMinistry}
                  />
                )}
                <Row label="Date of event" value={EVENT_DATE_LABEL} />
                <Row label="Reporting officer" value={submission.reportingOfficerName} />
                <Row label="Designation" value={submission.reportingOfficerDesignation} />
                <Row
                  label="Contact number"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      {submission.contactNo}
                      {submission.contactVerified && (
                        <Icon name="check_circle" size={16} className="text-approve" aria-label="Verified" />
                      )}
                    </span>
                  }
                />
                <Row label="Declaration" value={submission.declarationAccepted ? "Accepted" : "Not accepted"} />
              </dl>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          {mayApprove && (
            <Card>
              <div className="flex flex-col gap-3 p-4">
                <h2 className="text-base font-semibold text-ink">Your decision</h2>
                <p className="text-sm text-ink-muted">
                  Approving moves this report to the next tier. Returning it sends it back to the
                  submitting officer with your remarks.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleApprove} iconLeft={<Icon name="check_circle" size={16} />}>
                    Approve
                  </Button>
                  <Button
                    appearance="outlined"
                    onClick={() => setReturnOpen(true)}
                    iconLeft={<Icon name="undo" size={16} />}
                  >
                    Return with remarks
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {mayEdit && !editing && (
            <Card>
              <div className="flex flex-col gap-3 p-4">
                <h2 className="text-base font-semibold text-ink">Correction needed</h2>
                <p className="text-sm text-ink-muted">
                  This report was returned to you. Correct the figures or photographs and resubmit.
                </p>
                <Button onClick={startEditing} iconLeft={<Icon name="edit" size={16} />}>
                  Correct and resubmit
                </Button>
              </div>
            </Card>
          )}

          <Card>
            <div className="p-4">
              <h2 className="mb-3 text-base font-semibold text-ink">Approval history</h2>
              <ApprovalTimeline
                events={submission.history.map((e) => ({
                  at: e.at,
                  actorDisplayName: e.actorDisplayName,
                  actorRoleLabel: roleLabel(e.actorRole),
                  action: e.action,
                  remarks: e.remarks,
                }))}
                pendingLabel={pendingLabel(submission)}
              />
            </div>
          </Card>
        </div>
      </div>

      <Lightbox
        open={lightbox !== null}
        index={lightbox ?? 0}
        onClose={() => setLightbox(null)}
        items={submission.photos.map((photo) => ({
          type: "image" as const,
          src: photo.viewDataUrl,
          alt: photo.originalName,
          caption:
            photo.lat !== null && photo.lng !== null
              ? `${photo.originalName} · ${formatCoordinates(photo.lat, photo.lng)}`
              : `${photo.originalName} · no location recorded`,
        }))}
      />

      <Modal
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
        title="Return for correction"
        footer={
          <>
            <Button appearance="outlined" onClick={() => setReturnOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReturn}>Return submission</Button>
          </>
        }
      >
        <FormField
          label="Remarks"
          id="return-remarks"
          required
          error={remarksError}
          hint="The submitting officer sees this, so be specific about what to fix."
        >
          {(control) => (
            <Textarea
              {...control}
              rows={4}
              value={remarks}
              placeholder="e.g. The photograph has no location and the youth figure looks high for a single block."
              onChange={(e) => {
                setRemarks(e.target.value);
                setRemarksError("");
              }}
            />
          )}
        </FormField>
      </Modal>
    </AdminShell>
  );
}
