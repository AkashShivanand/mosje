"use client";

import * as React from "react";
import { Plus, Upload, GraduationCap, Users, Pencil, Trash2, FileText, CheckCircle } from "lucide-react";
import { Button, Input, FormField, Alert, Modal, Select } from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { PeerEducator } from "@/lib/treatment-centre/types";

type Row = PeerEducator & { sno: number };

function AddPeerEducatorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const store = useTCStore();
  const [name, setName] = React.useState("");
  const [volunteers, setVolunteers] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const formId = React.useId();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!name.trim() || !address.trim()) {
      setError("Name and address are required.");
      return;
    }
    setError("");
    store.addPeerEducator({ name: name.trim(), numberOfVolunteers: Number(volunteers) || 0, address: address.trim() });
    toast("Peer educator added successfully.", "success");
    setName("");
    setVolunteers("");
    setAddress("");
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Peer Educator"
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={formId}>Add Educator</Button>
        </>
      }
    >
      <p className="mb-3 text-xs text-ink-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>
      <form id={formId} onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <FormField label="Name of Peer Educator" required error={submitted && !name.trim() ? "Name is required." : undefined}>
          {(c) => <Input {...c} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />}
        </FormField>
        <FormField label="Number of Peer Volunteers">
          {(c) => <Input {...c} type="number" min={0} value={volunteers} onChange={(e) => setVolunteers(e.target.value)} placeholder="0" />}
        </FormField>
        <FormField label="Address" required error={submitted && !address.trim() ? "Address is required." : undefined}>
          {(c) => <Input {...c} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City / area" />}
        </FormField>
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {error && <Alert status="error">{error}</Alert>}
        </div>
      </form>
    </Modal>
  );
}

function EditPeerEducatorModal({ open, onClose, educator }: { open: boolean; onClose: () => void; educator: PeerEducator | null }) {
  const { toast } = useToast();
  const store = useTCStore();
  const [name, setName] = React.useState("");
  const [volunteers, setVolunteers] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const formId = React.useId();

  React.useEffect(() => {
    if (educator) {
      setName(educator.name);
      setVolunteers(String(educator.numberOfVolunteers));
      setAddress(educator.address);
    }
  }, [educator, open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!educator) return;
    setSubmitted(true);
    if (!name.trim() || !address.trim()) {
      setError("Name and address are required.");
      return;
    }
    setError("");
    store.updatePeerEducator(educator.id, {
      name: name.trim(),
      numberOfVolunteers: Number(volunteers) || 0,
      address: address.trim(),
    });
    toast("Peer educator details updated.", "success");
    setSubmitted(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Peer Educator Details"
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={formId}>Save Changes</Button>
        </>
      }
    >
      <p className="mb-3 text-xs text-ink-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>
      <form id={formId} onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <FormField label="Name of Peer Educator" required error={submitted && !name.trim() ? "Name is required." : undefined}>
          {(c) => <Input {...c} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />}
        </FormField>
        <FormField label="Number of Peer Volunteers">
          {(c) => <Input {...c} type="number" min={0} value={volunteers} onChange={(e) => setVolunteers(e.target.value)} placeholder="0" />}
        </FormField>
        <FormField label="Address" required error={submitted && !address.trim() ? "Address is required." : undefined}>
          {(c) => <Input {...c} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City / area" />}
        </FormField>
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {error && <Alert status="error">{error}</Alert>}
        </div>
      </form>
    </Modal>
  );
}

function UploadVolunteersModal({ open, onClose, educator }: { open: boolean; onClose: () => void; educator: PeerEducator | null }) {
  const { toast } = useToast();
  const store = useTCStore();
  const [fileSelected, setFileSelected] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [previewRows, setPreviewRows] = React.useState<string[]>([]);
  const formId = React.useId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.split("\\").pop() || "";
    setFileSelected(val);
    if (val) {
      // Mock CSV parsing
      setPreviewRows([
        "Ramesh Kumar, 9876543210, Active",
        "Sunita Sharma, 9876543211, Active",
        "Amit Patel, 9876543212, Active",
      ]);
    } else {
      setPreviewRows([]);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!educator || !fileSelected) return;

    setUploading(true);
    setTimeout(() => {
      const addedCount = previewRows.length;
      store.updatePeerEducator(educator.id, {
        numberOfVolunteers: educator.numberOfVolunteers + addedCount,
      });
      toast(`Successfully uploaded ${addedCount} volunteers from CSV.`, "success");
      setUploading(false);
      setFileSelected("");
      setPreviewRows([]);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Upload Volunteers for ${educator?.name}`}
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button type="submit" form={formId} disabled={!fileSelected || uploading}>
            {uploading ? "Uploading..." : "Upload & Parse CSV"}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <FormField label="Select Volunteers CSV File" required>
          {(c) => (
            <Input
              {...c}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={uploading}
            />
          )}
        </FormField>

        {previewRows.length > 0 && (
          <div className="rounded-lg border border-line bg-surface-muted p-4">
            <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-2">CSV Rows Preview</span>
            <ul className="text-xs font-mono flex flex-col gap-1 text-ink">
              {previewRows.map((r, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </Modal>
  );
}

function ViewVolunteersModal({ open, onClose, educator }: { open: boolean; onClose: () => void; educator: PeerEducator | null }) {
  // Generate volunteer list based on count
  const count = educator?.numberOfVolunteers || 0;
  const list = Array.from({ length: count }).map((_, i) => ({
    name: `Volunteer ${i + 1}`,
    phone: `9876543${String(100 + i).slice(-3)}`,
    status: "Active",
    registrationDate: "2026-04-12",
  }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Volunteers List — ${educator?.name}`}
      footer={<Button type="button" variant="primary" onClick={onClose}>Close</Button>}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ink-muted">
          Showing {count} active volunteers assigned to peer educator <span className="font-semibold text-ink">{educator?.name}</span>.
        </p>

        {count === 0 ? (
          <div className="p-6 text-center border border-dashed border-line rounded-lg bg-surface-muted">
            <Users className="h-8 w-8 text-ink-muted mx-auto mb-2" />
            <p className="text-sm text-ink-muted font-medium">No volunteers registered under this peer educator.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted border-b border-line">
                  <th className="px-4 py-2">S.No</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Contact Number</th>
                  <th className="px-4 py-2">Registration Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((v, i) => (
                  <tr key={i} className="hover:bg-brandwash">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2 font-medium text-navy">{v.name}</td>
                    <td className="px-4 py-2 font-mono text-ink-muted">{v.phone}</td>
                    <td className="px-4 py-2 text-ink-muted">{v.registrationDate}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                        {v.status}
                      </span>
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

function ViewTrainingModal({ open, onClose, educator }: { open: boolean; onClose: () => void; educator: PeerEducator | null }) {
  const trainingData = [
    { date: "2026-05-10", topic: "Substance Use Identification & Counselling", duration: "1 Day", trainer: "Dr. A. K. Sen" },
    { date: "2026-06-15", topic: "Community Outreach & Nasha Mukt Campaigning", duration: "2 Days", trainer: "Ministry Resource Team" },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Training Records — ${educator?.name}`}
      footer={<Button type="button" variant="primary" onClick={onClose}>Close</Button>}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ink-muted">
          Official ministry training sessions attended by <span className="font-semibold text-ink">{educator?.name}</span>.
        </p>

        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted border-b border-line">
                <th className="px-4 py-2">S.No</th>
                <th className="px-4 py-2">Training Date</th>
                <th className="px-4 py-2">Topic / Curriculum</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Facilitator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {trainingData.map((t, i) => (
                <tr key={i} className="hover:bg-brandwash">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2 font-medium text-navy">{t.date}</td>
                  <td className="px-4 py-2 text-ink">{t.topic}</td>
                  <td className="px-4 py-2 text-ink-muted">{t.duration}</td>
                  <td className="px-4 py-2 text-ink-muted font-medium">{t.trainer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

export default function CpliPeerEducatorsPage() {
  const { toast } = useToast();
  const store = useTCStore();

  // Selection states
  const [selectedEducator, setSelectedEducator] = React.useState<PeerEducator | null>(null);
  
  // Modal toggles
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [volunteersOpen, setVolunteersOpen] = React.useState(false);
  const [trainingOpen, setTrainingOpen] = React.useState(false);

  const rows: Row[] = store.peerEducators.map((e, i) => ({ ...e, sno: i + 1 }));

  const columns: ColumnDef<Row>[] = [
    { key: "sno", header: "S.No" },
    { key: "name", header: "Name of Peer Educator" },
    { key: "numberOfVolunteers", header: "Number of Peer Volunteers" },
    { key: "address", header: "Address" },
    {
      key: "actions",
      header: "Action",
      render: (r) => (
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            aria-label={`Upload volunteers for ${r.name}`}
            onClick={() => { setSelectedEducator(r); setUploadOpen(true); }}
            className="inline-flex items-center gap-1 rounded bg-navy/10 px-2 py-1 text-xs font-semibold text-navy hover:bg-navy/20"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden /> Upload Volunteers
          </button>
          <button
            type="button"
            aria-label={`View training for ${r.name}`}
            onClick={() => { setSelectedEducator(r); setTrainingOpen(true); }}
            className="inline-flex items-center gap-1 rounded bg-navy/10 px-2 py-1 text-xs font-semibold text-navy hover:bg-navy/20"
          >
            <GraduationCap className="h-3.5 w-3.5" aria-hidden /> View Training
          </button>
          <button
            type="button"
            aria-label={`View volunteers for ${r.name}`}
            onClick={() => { setSelectedEducator(r); setVolunteersOpen(true); }}
            className="inline-flex items-center gap-1 rounded bg-navy/10 px-2 py-1 text-xs font-semibold text-navy hover:bg-navy/20"
          >
            <Users className="h-3.5 w-3.5" aria-hidden /> View Volunteers
          </button>
          <button
            type="button"
            aria-label={`Edit ${r.name}`}
            onClick={() => { setSelectedEducator(r); setEditOpen(true); }}
            className="inline-flex items-center gap-1 rounded bg-await-bg px-2 py-1 text-xs font-semibold text-await-fg hover:opacity-90"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
          </button>
          <button
            type="button"
            aria-label={`Delete ${r.name}`}
            onClick={() => {
              if (window.confirm(`Remove peer educator "${r.name}"? This cannot be undone.`)) {
                store.removePeerEducator(r.id);
                toast("Peer educator removed.", "warning");
              }
            }}
            className="inline-flex items-center gap-1 rounded bg-danger-bg px-2 py-1 text-xs font-semibold text-danger-fg hover:opacity-90"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
          </button>
        </div>
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
        action={
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-white/90"
          >
            <Plus className="h-4 w-4" /> Add New Peer Educator
          </button>
        }
      />
      <AddPeerEducatorModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditPeerEducatorModal open={editOpen} onClose={() => { setEditOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
      <UploadVolunteersModal open={uploadOpen} onClose={() => { setUploadOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
      <ViewVolunteersModal open={volunteersOpen} onClose={() => { setVolunteersOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
      <ViewTrainingModal open={trainingOpen} onClose={() => { setTrainingOpen(false); setSelectedEducator(null); }} educator={selectedEducator} />
    </>
  );
}
