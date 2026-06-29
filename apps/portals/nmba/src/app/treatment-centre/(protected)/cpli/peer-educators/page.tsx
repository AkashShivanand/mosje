"use client";

// DS Audit (design-system-first):
//   Button · Input · FormField · Alert · Modal · Badge → ✅ @mosje/design-system
//   TCListPage · DataTable · RowActions/IconAction → ✅ shared treatment-centre components
//   PeerEducatorFormModal · DeleteConfirmModal → page-local (CPLI-specific dialogs)

import * as React from "react";
import { Plus, Upload, GraduationCap, Users, Pencil, Trash2, CheckCircle, AlertTriangle, FileSpreadsheet, Download } from "lucide-react";
import { Button, Input, FormField, Alert, Modal, Badge } from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import { IconAction, RowActions, RowActionDivider } from "@/components/treatment-centre/row-actions";
import { RowActionMenu } from "@/components/treatment-centre/row-action-menu";
import { rosterFor, trainingFor } from "@/lib/treatment-centre/cpli";
import type { ColumnDef } from "@/components/data-table";
import type { PeerEducator, Volunteer } from "@/lib/treatment-centre/types";

type Row = PeerEducator & { sno: number };

// ---------------------------------------------------------------------------
// Add / Edit — one form, two modes (keeps create & update behaviour identical)
// ---------------------------------------------------------------------------

function PeerEducatorFormModal({
  open,
  onClose,
  educator,
}: {
  open: boolean;
  onClose: () => void;
  /** Present → edit mode; null → add mode. */
  educator: PeerEducator | null;
}) {
  const { toast } = useToast();
  const store = useTCStore();
  const isEdit = !!educator;
  // The parent passes a `key` tied to the educator id (or "add"), so this
  // component remounts and re-seeds its fields whenever the target changes.
  const [name, setName] = React.useState(educator?.name ?? "");
  const [volunteers, setVolunteers] = React.useState(educator ? String(educator.numberOfVolunteers) : "");
  const [address, setAddress] = React.useState(educator?.address ?? "");
  const [submitted, setSubmitted] = React.useState(false);
  const formId = React.useId();

  const nameError = submitted && !name.trim() ? "Name is required." : undefined;
  const addressError = submitted && !address.trim() ? "Address is required." : undefined;
  const hasError = !!(nameError || addressError);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!name.trim() || !address.trim()) return;

    const count = Math.max(0, Number(volunteers) || 0);
    if (isEdit && educator) {
      store.updatePeerEducator(educator.id, {
        name: name.trim(),
        numberOfVolunteers: count,
        address: address.trim(),
      });
      toast("Peer educator details updated.", "success");
    } else {
      store.addPeerEducator({ name: name.trim(), numberOfVolunteers: count, address: address.trim() });
      toast("Peer educator added successfully.", "success");
    }
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Peer Educator Details" : "Add New Peer Educator"}
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={formId}>{isEdit ? "Save Changes" : "Add Educator"}</Button>
        </>
      }
    >
      <p className="mb-3 text-xs text-ink-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>
      <form id={formId} onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <FormField label="Name of Peer Educator" required error={nameError}>
          {(c) => <Input {...c} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoFocus />}
        </FormField>
        <FormField
          label="Number of Peer Volunteers"
          hint="Opens from the “View Volunteers” action. Use “Upload Volunteers” to import names from a CSV."
        >
          {(c) => <Input {...c} type="number" min={0} value={volunteers} onChange={(e) => setVolunteers(e.target.value)} placeholder="0" />}
        </FormField>
        <FormField label="Address" required error={addressError}>
          {(c) => <Input {...c} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City / area" />}
        </FormField>
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {hasError && <Alert status="error">Please complete the required fields highlighted above.</Alert>}
        </div>
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Delete — branded, accessible confirmation (replaces window.confirm)
// ---------------------------------------------------------------------------

function DeleteConfirmModal({
  open,
  onClose,
  educator,
}: {
  open: boolean;
  onClose: () => void;
  educator: PeerEducator | null;
}) {
  const { toast } = useToast();
  const store = useTCStore();

  const confirmDelete = () => {
    if (!educator) return;
    store.removePeerEducator(educator.id);
    toast(`Peer educator “${educator.name}” removed.`, "warning");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Remove peer educator?"
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="danger" iconLeft={<Trash2 className="h-4 w-4" />} onClick={confirmDelete}>
            Remove Educator
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-bg text-danger-fg" aria-hidden>
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="text-sm text-ink">
          <p>
            You are about to remove <span className="font-semibold">{educator?.name}</span>
            {educator && educator.numberOfVolunteers > 0 && (
              <> and their roster of <span className="font-semibold">{educator.numberOfVolunteers}</span> peer volunteer{educator.numberOfVolunteers === 1 ? "" : "s"}</>
            )}.
          </p>
          <p className="mt-1.5 text-ink-muted">This action cannot be undone.</p>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Upload volunteers — parses a CSV (mocked) and persists the roster
// ---------------------------------------------------------------------------

/** Deterministic, believable "parsed" rows derived from the chosen file name. */
function parsePreview(fileName: string): Volunteer[] {
  let h = 0;
  for (let i = 0; i < fileName.length; i++) h = (h * 31 + fileName.charCodeAt(i)) >>> 0;
  const pool = [
    "Ravi Thakur", "Sneha Joshi", "Karan Mehta", "Divya Rao", "Faisal Ahmed", "Anita Kumari",
  ];
  const count = 3 + (h % 3); // 3–5 rows
  return Array.from({ length: count }, (_, i) => ({
    name: pool[(h + i) % pool.length],
    phone: `9${String(70 + ((h + i) % 29))}${String(1000000 + ((h + i * 7) % 8999999)).slice(0, 7)}`.slice(0, 10),
    status: "Active" as const,
    joinedOn: "2026-06-20",
  }));
}

function UploadVolunteersModal({ open, onClose, educator }: { open: boolean; onClose: () => void; educator: PeerEducator | null }) {
  const { toast } = useToast();
  const store = useTCStore();
  const [fileSelected, setFileSelected] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [previewRows, setPreviewRows] = React.useState<Volunteer[]>([]);
  const formId = React.useId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.split("\\").pop() || "";
    setFileSelected(val);
    setPreviewRows(val ? parsePreview(val) : []);
  };

  const reset = () => {
    setFileSelected("");
    setPreviewRows([]);
    setUploading(false);
  };

  // Mirrors the legacy portal's "download sample" affordance: hands the user a
  // correctly-formatted template so the import doesn't fail on column order.
  const downloadSample = () => {
    const csv = [
      "Name,Mobile,Status",
      "Ravi Thakur,9876543210,Active",
      "Sneha Joshi,9876543211,Active",
      "Karan Mehta,9876543212,Inactive",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "peer-volunteers-sample.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!educator || !previewRows.length) return;

    setUploading(true);
    setTimeout(() => {
      const merged = [...rosterFor(educator), ...previewRows];
      store.updatePeerEducator(educator.id, {
        volunteers: merged,
        numberOfVolunteers: merged.length,
      });
      toast(`Added ${previewRows.length} volunteer${previewRows.length === 1 ? "" : "s"} to ${educator.name}.`, "success");
      reset();
      onClose();
    }, 1000);
  };

  // Avoid an unused-var lint while keeping the selected file name available.
  void fileSelected;

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose(); }}
      title={`Upload Volunteers — ${educator?.name ?? ""}`}
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={() => { reset(); onClose(); }} disabled={uploading}>Cancel</Button>
          <Button type="submit" form={formId} disabled={!previewRows.length || uploading}>
            {uploading ? "Uploading…" : `Add ${previewRows.length || ""} Volunteer${previewRows.length === 1 ? "" : "s"}`.replace(/\s+/g, " ").trim()}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {uploading ? "Uploading volunteers CSV, please wait." : ""}
        </div>
        <FormField label="Select Volunteers CSV File" required>
          {(c) => (
            <Input {...c} type="file" accept=".csv" onChange={handleFileChange} disabled={uploading} />
          )}
        </FormField>
        <div className="-mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          <p className="flex items-center gap-1.5 text-xs text-ink-muted">
            <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-ink-hint" aria-hidden />
            Expected columns: <span className="font-mono text-ink">Name, Mobile, Status</span>
          </p>
          <button
            type="button"
            onClick={downloadSample}
            className="inline-flex items-center gap-1.5 rounded text-xs font-semibold text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1"
          >
            <Download className="h-3.5 w-3.5" aria-hidden /> Download sample CSV
          </button>
        </div>

        {previewRows.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-line bg-surface-muted">
            <div className="flex items-center justify-between border-b border-line bg-white px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Preview — to be added</span>
              <Badge status="info">{previewRows.length} rows</Badge>
            </div>
            <ul className="divide-y divide-line">
              {previewRows.map((v, i) => (
                <li key={i} className="flex items-center justify-between gap-2 px-4 py-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 text-green-600" aria-hidden />
                    <span className="truncate font-medium text-ink">{v.name}</span>
                    <span className="font-mono text-xs text-ink-muted">{v.phone}</span>
                  </span>
                  <Badge status="success">New</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// View volunteers — real roster (uploaded or stable synthetic)
// ---------------------------------------------------------------------------

function ViewVolunteersModal({ open, onClose, educator }: { open: boolean; onClose: () => void; educator: PeerEducator | null }) {
  const list = educator ? rosterFor(educator) : [];
  const activeCount = list.filter((v) => v.status === "Active").length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Volunteers List — ${educator?.name ?? ""}`}
      footer={<Button type="button" variant="primary" onClick={onClose}>Close</Button>}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-ink-muted">
            Volunteers assigned to <span className="font-semibold text-ink">{educator?.name}</span>
          </p>
          <div className="flex items-center gap-2">
            <Badge status="primary" dot>{activeCount} active</Badge>
            <Badge status="neutral">{list.length} total</Badge>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line bg-surface-muted p-8 text-center">
            <Users className="h-8 w-8 text-ink-hint" aria-hidden />
            <p className="text-sm font-medium text-ink-muted">No volunteers registered under this peer educator yet.</p>
            <p className="text-xs text-ink-hint">Use the “Upload Volunteers” action to import a roster from CSV.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <table className="min-w-full text-sm">
              <caption className="sr-only">Volunteers registered under {educator?.name}</caption>
              <thead>
                <tr className="border-b border-line bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  <th scope="col" className="px-4 py-2.5 text-right tabular-nums">S.No</th>
                  <th scope="col" className="px-4 py-2.5">Name</th>
                  <th scope="col" className="px-4 py-2.5">Contact Number</th>
                  <th scope="col" className="px-4 py-2.5">Registration Date</th>
                  <th scope="col" className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((v, i) => (
                  <tr key={i} className="hover:bg-brandwash">
                    <td className="px-4 py-2.5 text-right tabular-nums text-ink-muted">{i + 1}</td>
                    <td className="px-4 py-2.5 font-medium text-navy">{v.name}</td>
                    <td className="px-4 py-2.5 font-mono text-ink-muted">{v.phone}</td>
                    <td className="px-4 py-2.5 tabular-nums text-ink-muted">{v.joinedOn}</td>
                    <td className="px-4 py-2.5">
                      <Badge status={v.status === "Active" ? "success" : "neutral"} dot>{v.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// View training — stable per-educator history
// ---------------------------------------------------------------------------

function ViewTrainingModal({ open, onClose, educator }: { open: boolean; onClose: () => void; educator: PeerEducator | null }) {
  const trainingData = educator ? trainingFor(educator) : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Training Records — ${educator?.name ?? ""}`}
      footer={<Button type="button" variant="primary" onClick={onClose}>Close</Button>}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-ink-muted">
            Ministry training sessions attended by <span className="font-semibold text-ink">{educator?.name}</span>
          </p>
          <Badge status="info" dot>{trainingData.length} sessions</Badge>
        </div>

        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="min-w-full text-sm">
            <caption className="sr-only">Training sessions attended by {educator?.name}</caption>
            <thead>
              <tr className="border-b border-line bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <th scope="col" className="px-4 py-2.5 text-right tabular-nums">S.No</th>
                <th scope="col" className="px-4 py-2.5">Training Date</th>
                <th scope="col" className="px-4 py-2.5">Topic / Curriculum</th>
                <th scope="col" className="px-4 py-2.5">Duration</th>
                <th scope="col" className="px-4 py-2.5">Facilitator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {trainingData.map((t, i) => (
                <tr key={i} className="hover:bg-brandwash">
                  <td className="px-4 py-2.5 text-right tabular-nums text-ink-muted">{i + 1}</td>
                  <td className="px-4 py-2.5 font-medium text-navy tabular-nums">{t.date}</td>
                  <td className="px-4 py-2.5 text-ink">{t.topic}</td>
                  <td className="px-4 py-2.5"><Badge status="neutral">{t.duration}</Badge></td>
                  <td className="px-4 py-2.5 font-medium text-ink-muted">{t.trainer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CpliPeerEducatorsPage() {
  const store = useTCStore();

  const [selectedEducator, setSelectedEducator] = React.useState<PeerEducator | null>(null);

  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [volunteersOpen, setVolunteersOpen] = React.useState(false);
  const [trainingOpen, setTrainingOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const rows: Row[] = store.peerEducators.map((e, i) => ({ ...e, sno: i + 1 }));

  const columns: ColumnDef<Row>[] = [
    { key: "sno", header: "S.No" },
    { key: "name", header: "Name of Peer Educator", render: (r) => <span className="font-medium text-navy">{r.name}</span> },
    {
      key: "numberOfVolunteers",
      header: "Number of Peer Volunteers",
      exportValue: (r) => String(r.numberOfVolunteers),
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 font-medium tabular-nums text-ink">
          <Users className="h-3.5 w-3.5 text-ink-hint" aria-hidden />
          {r.numberOfVolunteers}
        </span>
      ),
    },
    { key: "address", header: "Address" },
    {
      key: "actions",
      header: "Action",
      render: (r) => (
        <RowActions>
          {/* Universal verbs stay inline as icons; non-universal actions get
              visible text labels inside the accessible "More actions" menu. */}
          <IconAction
            icon={Pencil}
            tone="warning"
            label={`Edit ${r.name}`}
            onClick={() => { setSelectedEducator(r); setEditOpen(true); }}
          />
          <IconAction
            icon={Trash2}
            tone="danger"
            label={`Delete ${r.name}`}
            onClick={() => { setSelectedEducator(r); setDeleteOpen(true); }}
          />
          <RowActionDivider />
          <RowActionMenu
            label={`More actions for ${r.name}`}
            items={[
              { icon: Users, label: "View volunteers", onClick: () => { setSelectedEducator(r); setVolunteersOpen(true); } },
              { icon: Upload, label: "Upload volunteers", onClick: () => { setSelectedEducator(r); setUploadOpen(true); } },
              { icon: GraduationCap, label: "View training records", onClick: () => { setSelectedEducator(r); setTrainingOpen(true); } },
            ]}
          />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <TCListPage
        title="Peer Educators"
        columns={columns}
        data={rows}
        searchKeys={["name", "address"]}
        fileName="cpli-peer-educators"
        emptyLabel={
          <span className="block py-4">
            No peer educators yet. Use <span className="font-semibold text-navy">“Add New Peer Educator”</span> to register the first one.
          </span>
        }
        action={
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => { setSelectedEducator(null); setAddOpen(true); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add New Peer Educator
          </button>
        }
      />
      <PeerEducatorFormModal key="add" open={addOpen} onClose={() => setAddOpen(false)} educator={null} />
      <PeerEducatorFormModal
        key={`edit-${selectedEducator?.id ?? "none"}`}
        open={editOpen}
        onClose={() => { setEditOpen(false); setSelectedEducator(null); }}
        educator={editOpen ? selectedEducator : null}
      />
      <UploadVolunteersModal open={uploadOpen} onClose={() => { setUploadOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
      <ViewVolunteersModal open={volunteersOpen} onClose={() => { setVolunteersOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
      <ViewTrainingModal open={trainingOpen} onClose={() => { setTrainingOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
      <DeleteConfirmModal open={deleteOpen} onClose={() => { setDeleteOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
    </>
  );
}
