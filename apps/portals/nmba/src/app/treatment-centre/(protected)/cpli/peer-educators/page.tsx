"use client";

import * as React from "react";
import { Plus, Upload, GraduationCap, Users, Pencil, Trash2 } from "lucide-react";
import { Button, Input, FormField, Alert, Modal } from "@mosje/design-system";
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
    toast("Peer educator added.", "success");
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
          <Button type="submit" form={formId} iconLeft={<Plus className="h-4 w-4" />}>Add</Button>
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
        {/* Pre-mounted live region so genuine errors are reliably announced. */}
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {error && <Alert status="error">{error}</Alert>}
        </div>
      </form>
    </Modal>
  );
}

export default function CpliPeerEducatorsPage() {
  const { toast } = useToast();
  const store = useTCStore();
  const [modalOpen, setModalOpen] = React.useState(false);

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
          <button type="button" aria-label={`Upload volunteers for ${r.name}`} onClick={() => toast("Upload volunteers dialog (demo).", "info")} className="inline-flex items-center gap-1 rounded bg-navy/10 px-2 py-1 text-xs font-semibold text-navy hover:bg-navy/20">
            <Upload className="h-3.5 w-3.5" aria-hidden /> Upload Volunteers
          </button>
          <button type="button" aria-label={`View training for ${r.name}`} onClick={() => toast("Training records (demo).", "info")} className="inline-flex items-center gap-1 rounded bg-navy/10 px-2 py-1 text-xs font-semibold text-navy hover:bg-navy/20">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden /> View Training
          </button>
          <button type="button" aria-label={`View volunteers for ${r.name}`} onClick={() => toast(`${r.numberOfVolunteers} volunteers under ${r.name} (demo).`, "info")} className="inline-flex items-center gap-1 rounded bg-navy/10 px-2 py-1 text-xs font-semibold text-navy hover:bg-navy/20">
            <Users className="h-3.5 w-3.5" aria-hidden /> View Volunteers
          </button>
          <button type="button" aria-label={`Edit ${r.name}`} onClick={() => toast("Edit peer educator (demo).", "info")} className="inline-flex items-center gap-1 rounded bg-await-bg px-2 py-1 text-xs font-semibold text-await-fg hover:opacity-90">
            <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
          </button>
          <button type="button" aria-label={`Delete ${r.name}`} onClick={() => { if (window.confirm(`Remove peer educator "${r.name}"? This cannot be undone.`)) { store.removePeerEducator(r.id); toast("Peer educator removed.", "warning"); } }} className="inline-flex items-center gap-1 rounded bg-danger-bg px-2 py-1 text-xs font-semibold text-danger-fg hover:opacity-90">
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
          <button type="button" aria-haspopup="dialog" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-white/90">
            <Plus className="h-4 w-4" /> Add New Peer Educator
          </button>
        }
      />
      <AddPeerEducatorModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
