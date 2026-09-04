"use client";

// DS Audit (design-system-first):
//   Button · Input · FormField · Alert · Modal · SideSheet · Badge → ✅ @mosje/design-system
//   TCListPage · DataTable · RowActions/IconAction → ✅ shared treatment-centre components
//   PeerEducatorFormSheet · UploadVolunteersSheet · DeleteConfirmModal → page-local (CPLI-specific)

import * as React from "react";
import { useRouter } from "next/navigation";
import { Alert, Badge, Button, FormField, Icon, Input, Modal, SideSheet } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { IconAction, RowActions, RowActionDivider } from "@/components/nmba/treatment-centre/row-actions";
import { RowActionMenu } from "@/components/nmba/treatment-centre/row-action-menu";
import { rosterFor } from "@/lib/nmba/treatment-centre/cpli";
import type { ColumnDef } from "@/components/nmba/data-table";
import type { PeerEducator, Volunteer } from "@/lib/nmba/treatment-centre/types";

type Row = PeerEducator & { sno: number };

// ---------------------------------------------------------------------------
// Add / Edit peer educator — SideSheet (3 fields + textarea-style address)
// ---------------------------------------------------------------------------

function PeerEducatorFormSheet({
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
  const isEdit = !!educator;
  // Parent passes a `key` tied to educator.id (or "add"), so this component
  // remounts and re-seeds its fields via lazy useState whenever target changes.
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
      store.updatePeerEducator(educator.id, { name: name.trim(), numberOfVolunteers: count, address: address.trim() });
      toast("Peer educator details updated.", "success");
    } else {
      store.addPeerEducator({ name: name.trim(), numberOfVolunteers: count, address: address.trim() });
      toast("Peer educator added successfully.", "success");
    }
    setSubmitted(false);
    onClose();
  };

  return (
    <SideSheet
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
      <p className="mb-4 text-body-3 text-ink-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>
      <form id={formId} onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <FormField label="Name of Peer Educator" required error={nameError}>
          {(c) => <Input {...c} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" autoFocus />}
        </FormField>
        <FormField
          label="Number of Peer Volunteers"
          hint='Managed via "View Volunteers". Use "Upload Volunteers" to import names from a CSV.'
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
    </SideSheet>
  );
}

// ---------------------------------------------------------------------------
// Delete — accessible confirmation modal (blocking by design → keep as Modal)
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
    toast(`Peer educator "${educator.name}" removed.`, "warning");
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
          <Button type="button" variant="danger" iconLeft={<Icon name="delete" size={16} />} onClick={confirmDelete}>
            Remove Educator
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
// Upload volunteers — SideSheet (file upload + preview → correct UX)
// ---------------------------------------------------------------------------

function parsePreview(fileName: string): Volunteer[] {
  let h = 0;
  for (let i = 0; i < fileName.length; i++) h = (h * 31 + fileName.charCodeAt(i)) >>> 0;
  const pool = ["Ravi Thakur", "Sneha Joshi", "Karan Mehta", "Divya Rao", "Faisal Ahmed", "Anita Kumari"];
  const count = 3 + (h % 3);
  return Array.from({ length: count }, (_, i) => ({
    name: pool[(h + i) % pool.length] ?? "Unknown",
    age: 18 + ((h + i * 3) % 25),
    phone: `9${String(70 + ((h + i) % 29))}${String(1000000 + ((h + i * 7) % 8999999)).slice(0, 7)}`.slice(0, 10),
    status: "Active" as const,
    joinedOn: "2026-06-20",
  }));
}

function UploadVolunteersSheet({
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
  const [fileSelected, setFileSelected] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [previewRows, setPreviewRows] = React.useState<Volunteer[]>([]);
  const formId = React.useId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.split("\\").pop() || "";
    setFileSelected(val);
    setPreviewRows(val ? parsePreview(val) : []);
  };

  const reset = () => { setFileSelected(""); setPreviewRows([]); setUploading(false); };

  void fileSelected;

  const downloadSample = () => {
    const csv = ["Name,Mobile,Status", "Ravi Thakur,9876543210,Active", "Sneha Joshi,9876543211,Active", "Karan Mehta,9876543212,Inactive"].join("\n");
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
      store.updatePeerEducator(educator.id, { volunteers: merged, numberOfVolunteers: merged.length });
      toast(`Added ${previewRows.length} volunteer${previewRows.length === 1 ? "" : "s"} to ${educator.name}.`, "success");
      reset();
      onClose();
    }, 1000);
  };

  return (
    <SideSheet
      open={open}
      onClose={() => { reset(); onClose(); }}
      size="lg"
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
          {(c) => <Input {...c} type="file" accept=".csv" onChange={handleFileChange} disabled={uploading} />}
        </FormField>

        <div className="-mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
          <p className="flex items-center gap-1.5 text-body-3 text-ink-muted">
            <Icon name="table_chart" size={14} className="shrink-0 text-ink-hint" aria-hidden />
            Expected columns: <span className="font-mono text-ink">Name, Mobile, Status</span>
          </p>
          <button
            type="button"
            onClick={downloadSample}
            className="inline-flex items-center gap-1.5 rounded text-label-2 font-semibold text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-1"
          >
            <Icon name="download" size={14} aria-hidden /> Download sample CSV
          </button>
        </div>

        {previewRows.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-line bg-surface-muted">
            <div className="flex items-center justify-between border-b border-line bg-white px-4 py-2">
              <span className="text-label-3 uppercase text-ink-muted">Preview — to be added</span>
              <Badge status="info">{previewRows.length} rows</Badge>
            </div>
            <ul className="divide-y divide-line">
              {previewRows.map((v, i) => (
                <li key={i} className="flex items-center justify-between gap-2 px-4 py-2 text-body-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon name="check_circle" size={16} className="shrink-0 text-green-600" aria-hidden />
                    <span className="truncate font-medium text-ink">{v.name}</span>
                    <span className="font-mono text-body-3 text-ink-muted">{v.phone}</span>
                  </span>
                  <Badge status="success">New</Badge>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </SideSheet>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CpliPeerEducatorsPage() {
  const store = useTCStore();
  const router = useRouter();

  const [selectedEducator, setSelectedEducator] = React.useState<PeerEducator | null>(null);

  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);
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
          <Icon name="group" size={14} className="text-ink-hint" aria-hidden />
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
          <IconAction icon="edit" tone="warning" label={`Edit ${r.name}`}
            onClick={() => { setSelectedEducator(r); setEditOpen(true); }} />
          <IconAction icon="delete" tone="danger" label={`Delete ${r.name}`}
            onClick={() => { setSelectedEducator(r); setDeleteOpen(true); }} />
          <RowActionDivider />
          <RowActionMenu
            label={`More actions for ${r.name}`}
            items={[
              { icon: "group", label: "View volunteers", onClick: () => router.push(`/portals/nmba/treatment-centre/cpli/peer-educators/${r.id}/volunteers`) },
              { icon: "upload", label: "Upload volunteers", onClick: () => { setSelectedEducator(r); setUploadOpen(true); } },
              { icon: "school", label: "View training records", onClick: () => router.push(`/portals/nmba/treatment-centre/cpli/peer-educators/${r.id}/training`) },
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
            No peer educators yet. Use <span className="font-semibold text-navy">&quot;Add New Peer Educator&quot;</span> to register the first one.
          </span>
        }
        action={
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => { setSelectedEducator(null); setAddOpen(true); }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-label-1 font-semibold text-navy transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Icon name="add" size={16} aria-hidden /> Add New Peer Educator
          </button>
        }
      />

      <PeerEducatorFormSheet key="add" open={addOpen} onClose={() => setAddOpen(false)} educator={null} />
      <PeerEducatorFormSheet
        key={`edit-${selectedEducator?.id ?? "none"}`}
        open={editOpen}
        onClose={() => { setEditOpen(false); setSelectedEducator(null); }}
        educator={editOpen ? selectedEducator : null}
      />
      <UploadVolunteersSheet open={uploadOpen} onClose={() => { setUploadOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
      <DeleteConfirmModal open={deleteOpen} onClose={() => { setDeleteOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
    </>
  );
}
