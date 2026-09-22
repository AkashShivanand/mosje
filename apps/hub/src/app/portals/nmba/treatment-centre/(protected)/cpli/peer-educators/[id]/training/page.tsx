"use client";

// DS Audit:
//   Button · Input · FormField · Alert · Modal · SideSheet · Search · Lightbox → ✅ @mosje/design-system
//   DataTable → ✅ @/components/nmba/data-table (is-sticky-right on Action col via DS CSS)
//   PhotoBadge · TrainingFormSheet · DeleteConfirmModal → page-local (CPLI-specific)

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Alert, Button, FormField, Icon, Input, Lightbox, MediaGalleryInput, MediaThumbnail, Modal, Search, SideSheet, SplitButton, type LightboxItem } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { DataTable, type ColumnDef } from "@/components/nmba/data-table";
import { IconAction, RowActions } from "@/components/nmba/treatment-centre/row-actions";
import { trainingFor } from "@/lib/nmba/treatment-centre/cpli";
import type { TrainingRecord } from "@/lib/nmba/treatment-centre/types";

type Row = TrainingRecord & { sno: number; _idx: number };

// ---------------------------------------------------------------------------
// Export helpers
// ---------------------------------------------------------------------------

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toCsv(rows: Row[]) {
  const header = `"S.No","Date","No. of Volunteers Attended","Location","Details & Outcomes","Remarks"`;
  const body = rows
    .map((r) => `"${r.sno}","${r.date}","${r.numberOfVolunteers}","${r.location}","${r.detailsAndOutcomes}","${r.remarks ?? ""}"`)
    .join("\n");
  return `${header}\n${body}`;
}

function toXls(rows: Row[]) {
  const head = `<tr><th>S.No</th><th>Date</th><th>No. of Volunteers Attended</th><th>Location</th><th>Details &amp; Outcomes</th><th>Remarks</th></tr>`;
  const body = rows
    .map(
      (r) =>
        `<tr><td>${r.sno}</td><td>${r.date}</td><td>${r.numberOfVolunteers}</td><td>${escHtml(r.location)}</td><td>${escHtml(r.detailsAndOutcomes)}</td><td>${escHtml(r.remarks ?? "")}</td></tr>`,
    )
    .join("");
  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body><table border="1"><thead>${head}</thead><tbody>${body}</tbody></table></body></html>`;
}

function downloadBlob(content: string, mime: string, name: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------------------------------------------------------------------------
// Split-button export
// ---------------------------------------------------------------------------

function ExportMenu({ rows, educatorId }: { rows: Row[]; educatorId: string }) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toCsv(rows));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast("Copied to clipboard.", "success");
    } catch {
      toast("Copy failed — clipboard unavailable.", "warning");
    }
  };

  const handleDownload = (fmt: "xls" | "csv") => {
    if (fmt === "csv") {
      downloadBlob(toCsv(rows), "text/csv;charset=utf-8;", `training-${educatorId}.csv`);
    } else {
      downloadBlob(toXls(rows), "application/vnd.ms-excel;charset=utf-8;", `training-${educatorId}.xls`);
    }
    toast(`Exported ${rows.length} rows.`, "success");
  };

  return (
    <SplitButton
      label="Export options"
      variant="neutral"
      appearance="outlined"
      size="sm"
      iconLeft={<Icon name={copied ? "check" : "content_copy"} size={16} />}
      onClick={handleCopy}
      items={[
        { id: "xls", label: "Export as Excel", icon: "table_chart" },
        { id: "csv", label: "Export as CSV", icon: "description" },
      ]}
      onSelect={(id) => handleDownload(id === "csv" ? "csv" : "xls")}
    >
      {copied ? "Copied!" : "Copy"}
    </SplitButton>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format an ISO date string to "22 Oct 2026" for display. */
function fmtDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00"); // force local midnight, avoid UTC-offset flip
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ---------------------------------------------------------------------------
// PhotoBadge (table cell) — thumbnail with corner count badge → lightbox
// ---------------------------------------------------------------------------

function PhotoBadge({
  photos,
  onOpen,
}: {
  photos: string[];
  onOpen: (idx: number) => void;
}) {
  return (
    <MediaThumbnail
      src={photos[0]}
      count={photos.length}
      label={`View ${photos.length} training photo${photos.length > 1 ? "s" : ""}`}
      emptyLabel="No photos uploaded"
      onClick={() => onOpen(0)}
    />
  );
}

// ---------------------------------------------------------------------------
// Multi-photo upload field — used inside the form sheet
// ---------------------------------------------------------------------------

/**
 * The training photos field. Until 2026-09-22 this was a hand-built picker — its
 * own dashed drop zone, label, error line and a thumbnail grid whose remove control
 * only appeared on hover. It is the design system's MediaGalleryInput inside a
 * FormField now, so the label, hint, error wiring and the remove controls are the
 * estate's own. The record still stores plain URLs; the field maps them.
 */
function PhotoUploadField({
  photos,
  onChange,
  error,
}: {
  photos: string[];
  onChange: (next: string[]) => void;
  error?: string;
}) {
  return (
    <FormField label="Photos" required hint="JPG or PNG, up to 5 MB each" error={error}>
      {(c) => (
        <MediaGalleryInput
          {...c}
          accept="image/jpeg,image/png,image/webp"
          maxSizeMb={5}
          value={photos.map((url, i) => ({ url, type: "image" as const, name: `Photo ${i + 1}` }))}
          onChange={(items) => onChange(items.map((item) => item.url))}
        />
      )}
    </FormField>
  );
}

// ---------------------------------------------------------------------------
// Add / Edit training — SideSheet
// ---------------------------------------------------------------------------

function TrainingFormSheet({
  open,
  onClose,
  record,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  record: TrainingRecord | null;
  onSave: (r: TrainingRecord) => void;
}) {
  const isEdit = !!record;
  // Parent passes key={`edit-${idx}`} (or key="add"), so this component
  // remounts and re-seeds its fields via lazy useState whenever target changes.
  const [date, setDate] = React.useState(record?.date ?? "");
  const [numVols, setNumVols] = React.useState(record ? String(record.numberOfVolunteers) : "");
  const [location, setLocation] = React.useState(record?.location ?? "");
  const [details, setDetails] = React.useState(record?.detailsAndOutcomes ?? "");
  const [remarks, setRemarks] = React.useState(record?.remarks ?? "");
  const [photos, setPhotos] = React.useState<string[]>(record?.photoUrls ?? []);
  const [submitted, setSubmitted] = React.useState(false);
  const formId = React.useId();

  const dateErr      = submitted && !date              ? "Date of training is required."          : undefined;
  const numVolsErr   = submitted && (numVols.trim() === "" || isNaN(Number(numVols)) || Number(numVols) < 0)
                                                       ? "Enter a valid number."                  : undefined;
  const locationErr  = submitted && !location.trim()   ? "Training location is required."         : undefined;
  const detailsErr   = submitted && !details.trim()    ? "Training details & outcomes are required." : undefined;
  const photosErr    = submitted && photos.length === 0 ? "At least one photo is required."       : undefined;
  const hasErr = !!(dateErr || numVolsErr || locationErr || detailsErr || photosErr);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!date || !location.trim() || !details.trim() || isNaN(Number(numVols)) || Number(numVols) < 0 || photos.length === 0) return;
    onSave({
      id: record?.id ?? `tr-new-${Date.now()}`,
      date,
      numberOfVolunteers: Math.max(0, Number(numVols) || 0),
      location: location.trim(),
      detailsAndOutcomes: details.trim(),
      remarks: remarks.trim() || undefined,
      photoUrls: photos,
    });
    onClose();
  };

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? "Edit Training Record" : "Add Peer Educator Training"}
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={formId}>{isEdit ? "Save Changes" : "Add Training"}</Button>
        </>
      }
    >
      <p className="mb-5 text-body-3 text-ink-muted">
        Fields marked <span aria-hidden>*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>
      <form id={formId} onSubmit={submit} className="flex flex-col gap-5" noValidate>

        {/* Row 1: Date + No. of volunteers */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date of Training" required error={dateErr}>
            {(c) => (
              <Input {...c} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            )}
          </FormField>
          <FormField label="No. of Peer Volunteers Attended" required error={numVolsErr}>
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={numVols}
                onChange={(e) => setNumVols(e.target.value)}
                placeholder="e.g. 12"
              />
            )}
          </FormField>
        </div>

        {/* Photos — required, placed early so users know to have them ready */}
        <PhotoUploadField
          photos={photos}
          onChange={setPhotos}
          error={photosErr}
        />

        {/* Training location */}
        <FormField label="Training Location" required error={locationErr}>
          {(c) => (
            <Input
              {...c}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Community Health Centre, Vasant Kunj"
            />
          )}
        </FormField>

        {/* Training details */}
        <FormField label="Training Details & Outcomes" required error={detailsErr}>
          {(c) => (
            <textarea
              id={c.id}
              aria-describedby={c["aria-describedby"]}
              aria-invalid={c.invalid || undefined}
              required={c.required}
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what was covered and the outcomes achieved…"
              className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-body-2 text-ink placeholder:text-ink-hint focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-1 disabled:opacity-50"
            />
          )}
        </FormField>

        {/* Remarks */}
        <FormField label="Remarks">
          {(c) => (
            <textarea
              id={c.id}
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any additional notes or observations (optional)…"
              className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-body-2 text-ink placeholder:text-ink-hint focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-1"
            />
          )}
        </FormField>

        <div role="alert" aria-live="assertive" aria-atomic>
          {hasErr && <Alert status="error">Please fill in the highlighted fields above.</Alert>}
        </div>
      </form>
    </SideSheet>
  );
}

// ---------------------------------------------------------------------------
// Delete confirm modal
// ---------------------------------------------------------------------------

function DeleteConfirmModal({
  open,
  onClose,
  record,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  record: TrainingRecord | null;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Remove training record?"
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="danger" iconLeft={<Icon name="delete" size={16} />} onClick={onConfirm}>
            Remove
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-bg text-danger-fg" aria-hidden>
          <Icon name="warning" size={20} />
        </span>
        <div className="text-body-2 text-ink">
          <p>
            You are about to remove the training session on{" "}
            <span className="font-semibold">{record ? fmtDate(record.date) : "—"}</span> at{" "}
            <span className="font-semibold">{record?.location}</span>.
          </p>
          <p className="mt-1.5 text-ink-muted">This action cannot be undone.</p>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TrainingPage() {
  const { id } = useParams<{ id: string }>();
  const { peerEducators, updatePeerEducator } = useTCStore();
  const { toast } = useToast();

  const educator = peerEducators.find((e) => e.id === id) ?? null;
  const records  = educator ? trainingFor(educator) : [];

  const [query,        setQuery]        = React.useState("");
  const [addOpen,      setAddOpen]      = React.useState(false);
  const [editTarget,   setEditTarget]   = React.useState<{ record: TrainingRecord; idx: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{ record: TrainingRecord; idx: number } | null>(null);
  const [lightbox,     setLightbox]     = React.useState<{ photos: string[]; idx: number } | null>(null);

  const filtered = query.trim()
    ? records.filter((r) => {
        const q = query.toLowerCase();
        return (
          r.location.toLowerCase().includes(q) ||
          r.detailsAndOutcomes.toLowerCase().includes(q) ||
          r.date.includes(query) ||              // ISO fallback (e.g. "2026")
          fmtDate(r.date).toLowerCase().includes(q) // formatted (e.g. "Nov", "Oct 2026")
        );
      })
    : records;

  const rows: Row[] = filtered.map((r, i) => ({ ...r, sno: i + 1, _idx: records.indexOf(r) }));

  const saveRecord = (updated: TrainingRecord, idx?: number) => {
    if (!educator) return;
    const newRecords =
      idx !== undefined
        ? records.map((r, i) => (i === idx ? updated : r))
        : [...records, updated];
    updatePeerEducator(educator.id, { trainings: newRecords });
  };

  const deleteRecord = (idx: number) => {
    if (!educator) return;
    const newRecords = records.filter((_, i) => i !== idx);
    updatePeerEducator(educator.id, { trainings: newRecords });
    toast("Training record removed.", "warning");
    setDeleteTarget(null);
  };

  const columns: ColumnDef<Row>[] = [
    {
      key: "sno",
      header: "Sl. No.",
    },
    {
      key: "date",
      header: "Date",
      render: (r) => (
        <span className="whitespace-nowrap font-medium text-navy">{fmtDate(r.date)}</span>
      ),
    },
    {
      key: "numberOfVolunteers",
      header: "Volunteers Attended",
      render: (r) => <span className="tabular-nums">{r.numberOfVolunteers}</span>,
    },
    {
      key: "location",
      header: "Location",
      render: (r) => (
        <span className="block max-w-[180px] truncate" title={r.location}>{r.location}</span>
      ),
    },
    {
      key: "detailsAndOutcomes",
      header: "Details & Outcomes",
      render: (r) => (
        <span className="block max-w-[220px] truncate text-ink-muted" title={r.detailsAndOutcomes}>
          {r.detailsAndOutcomes}
        </span>
      ),
    },
    {
      key: "remarks",
      header: "Remarks",
      render: (r) =>
        r.remarks ? (
          <span className="block max-w-[180px] truncate text-ink-muted" title={r.remarks}>
            {r.remarks}
          </span>
        ) : (
          <span className="text-ink-hint">—</span>
        ),
    },
    {
      key: "photoUrls" as keyof Row,
      header: "Photos",
      noExport: true,
      render: (r) => (
        <PhotoBadge
          photos={r.photoUrls ?? []}
          onOpen={(idx) => setLightbox({ photos: r.photoUrls ?? [], idx })}
        />
      ),
    },
    {
      key: "actions" as keyof Row,
      header: "Action",
      noExport: true,
      className: "is-sticky-right",
      render: (r) => (
        <RowActions>
          <IconAction
            icon="edit"
            tone="warning"
            label={`Edit training on ${fmtDate(r.date)}`}
            onClick={() => setEditTarget({ record: r, idx: r._idx })}
          />
          <IconAction
            icon="delete"
            tone="danger"
            label={`Remove training on ${fmtDate(r.date)}`}
            onClick={() => setDeleteTarget({ record: r, idx: r._idx })}
          />
        </RowActions>
      ),
    },
  ];

  if (!educator) {
    return (
      <div className="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-label-1 text-ink-muted">
          <Link href="/portals/nmba/treatment-centre/dashboard" className="hover:text-navy transition-colors">Home</Link>
          <Icon name="keyboard_arrow_right" size={14} className="shrink-0" aria-hidden />
          <Link href="/portals/nmba/treatment-centre/cpli/peer-educators" className="hover:text-navy transition-colors">Peer Educators</Link>
        </nav>
        <div className="rounded-xl border border-dashed border-line bg-surface-muted p-12 text-center text-body-2 text-ink-muted">
          Peer educator not found.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-label-1 text-ink-muted">
          <Link
            href="/portals/nmba/treatment-centre/dashboard"
            className="rounded transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            Home
          </Link>
          <Icon name="keyboard_arrow_right" size={14} className="shrink-0" aria-hidden />
          <Link
            href="/portals/nmba/treatment-centre/cpli/peer-educators"
            className="rounded transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            Peer Educators
          </Link>
          <Icon name="keyboard_arrow_right" size={14} className="shrink-0" aria-hidden />
          <span className="max-w-[200px] truncate font-medium text-ink" aria-current="page">
            {educator.name}
          </span>
        </nav>

        {/* ── Page header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-headline-1 text-ink">Peer Educator Trainings</h1>
              <span
                className="rounded-full bg-navy/10 px-2.5 py-0.5 text-label-1 font-semibold text-navy"
                aria-label={`${records.length} training records`}
              >
                {records.length}
              </span>
            </div>
            <p className="mt-1 text-body-2 text-ink-muted">
              Training sessions conducted for <span className="font-medium text-ink">{educator.name}</span>&apos;s volunteer group.
            </p>
          </div>
          <Button
            iconLeft={<Icon name="add" size={16} />}
            onClick={() => setAddOpen(true)}
            aria-haspopup="dialog"
          >
            Add New Peer Educator Training
          </Button>
        </div>

        {/* ── Table card ── */}
        <div className="overflow-hidden rounded-xl bg-white shadow-md">

          {/* Toolbar */}
          <div className="flex items-center gap-3 border-b border-line bg-white px-4 py-3">
            <div className="flex-1">
              <Search
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by date, location, or details"
                aria-label="Search training records"
              />
            </div>
            <ExportMenu rows={rows} educatorId={id} />
          </div>

          {/* DataTable — card wrapper provides shadow/rounding; ds-table__scroll
              provides the 1px border. No className override needed. */}
          <DataTable
            columns={columns}
            data={rows}
            total={rows.length}
            caption="Peer Educator Training Records"
            emptyLabel={
              query ? (
                `No training records match "${query}".`
              ) : (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <Icon name="photo_camera" size={32} className="text-ink-hint" aria-hidden />
                  <div>
                    <p className="text-title-3 text-ink">No training records yet</p>
                    <p className="mt-0.5 text-body-3 text-ink-muted">Add the first session to track peer educator outreach progress.</p>
                  </div>
                </div>
              )
            }
          />
        </div>
      </div>

      {/* ── Sheets & modals ── */}
      <TrainingFormSheet
        key="add"
        open={addOpen}
        onClose={() => setAddOpen(false)}
        record={null}
        onSave={(r) => {
          saveRecord(r);
          toast("Training record added.", "success");
        }}
      />
      {editTarget && (
        <TrainingFormSheet
          key={`edit-${editTarget.idx}`}
          open
          onClose={() => setEditTarget(null)}
          record={editTarget.record}
          onSave={(r) => {
            saveRecord(r, editTarget.idx);
            toast("Training record updated.", "success");
            setEditTarget(null);
          }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          open
          onClose={() => setDeleteTarget(null)}
          record={deleteTarget.record}
          onConfirm={() => deleteRecord(deleteTarget.idx)}
        />
      )}

      {/* ── Photo lightbox (shared DS viewer) ── */}
      <Lightbox
        open={!!lightbox}
        items={(lightbox?.photos ?? []).map<LightboxItem>((src, i) => ({
          type: "image",
          src,
          caption: `Training photo ${i + 1}`,
        }))}
        index={lightbox?.idx ?? 0}
        onClose={() => setLightbox(null)}
      />
    </>
  );
}
