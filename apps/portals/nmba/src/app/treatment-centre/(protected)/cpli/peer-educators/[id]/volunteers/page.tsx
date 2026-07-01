"use client";

// DS Audit:
//   Button · Input · FormField · Alert · Modal · Badge · Search → ✅ @mosje/design-system
//   DataTable → ✅ @/components/data-table
//   IconAction · RowActions → ✅ shared treatment-centre row-actions

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight, Plus, Pencil, Trash2, AlertTriangle,
  Copy, FileSpreadsheet, FileText, ChevronDown, Check,
} from "lucide-react";
import { Button, Input, FormField, Alert, Modal, SideSheet, Search } from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { DataTable, type ColumnDef } from "@/components/data-table";
import { IconAction, RowActions } from "@/components/treatment-centre/row-actions";
import { rosterFor } from "@/lib/treatment-centre/cpli";
import type { Volunteer } from "@/lib/treatment-centre/types";

type Row = Volunteer & { sno: number; _idx: number };

// ---------------------------------------------------------------------------
// Export helpers
// ---------------------------------------------------------------------------

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toCsv(rows: Row[]) {
  const header = `"S.No","Name","Age","Mobile"`;
  const body = rows.map((r) => `"${r.sno}","${r.name}","${r.age}","${r.phone}"`).join("\n");
  return `${header}\n${body}`;
}

function toXls(rows: Row[]) {
  const head = `<tr><th>S.No</th><th>Name</th><th>Age</th><th>Mobile</th></tr>`;
  const body = rows
    .map((r) => `<tr><td>${r.sno}</td><td>${escHtml(r.name)}</td><td>${r.age}</td><td>${r.phone}</td></tr>`)
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
// Split-button export control
// Left half → Copy (executes immediately)   Right half (▼) → Excel / CSV dropdown
// ---------------------------------------------------------------------------

function ExportMenu({ rows, educatorId }: { rows: Row[]; educatorId: string }) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

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
    setOpen(false);
    if (fmt === "csv") {
      downloadBlob(toCsv(rows), "text/csv;charset=utf-8;", `volunteers-${educatorId}.csv`);
    } else {
      downloadBlob(toXls(rows), "application/vnd.ms-excel;charset=utf-8;", `volunteers-${educatorId}.xls`);
    }
    toast(`Exported ${rows.length} rows.`, "success");
  };

  return (
    <div ref={ref} className="relative">
      {/* Split button container */}
      <div className="flex overflow-hidden rounded-lg border border-line bg-white">
        {/* Left: Copy (primary action — executes immediately) */}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-[7px] text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-600" aria-hidden />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>

        {/* Divider */}
        <div className="w-px self-stretch bg-line" aria-hidden />

        {/* Right: dropdown trigger (Excel / CSV only) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Export options"
          className="inline-flex items-center px-2 py-[7px] transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 text-ink-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </div>

      {open && (
        <div
          role="menu"
          aria-label="Export options"
          className="absolute right-0 top-[calc(100%+4px)] z-20 min-w-44 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-lg"
        >
          <button
            role="menuitem"
            type="button"
            onClick={() => handleDownload("xls")}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:bg-surface-muted"
          >
            <FileSpreadsheet className="h-4 w-4 text-ink-muted" aria-hidden /> Export as Excel
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => handleDownload("csv")}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:bg-surface-muted"
          >
            <FileText className="h-4 w-4 text-ink-muted" aria-hidden /> Export as CSV
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add / Edit volunteer — SideSheet (no Status field — matches legacy)
// ---------------------------------------------------------------------------

function VolunteerFormSheet({
  open,
  onClose,
  volunteer,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  volunteer: Volunteer | null;
  onSave: (v: Volunteer) => void;
}) {
  const isEdit = !!volunteer;
  // Parent passes key={`edit-${idx}`} (or key="add"), so this component
  // remounts and re-seeds its fields via lazy useState whenever target changes.
  const [name, setName] = React.useState(volunteer?.name ?? "");
  const [age, setAge] = React.useState(volunteer ? String(volunteer.age) : "");
  const [phone, setPhone] = React.useState(volunteer?.phone ?? "");
  const [submitted, setSubmitted] = React.useState(false);
  const formId = React.useId();

  const nameErr = submitted && !name.trim() ? "Name is required." : undefined;
  const ageErr = submitted && (!age.trim() || isNaN(Number(age)) || Number(age) < 1) ? "Enter a valid age." : undefined;
  const phoneErr = submitted && !phone.trim() ? "Mobile number is required." : undefined;
  const hasErr = !!(nameErr || ageErr || phoneErr);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!name.trim() || !age.trim() || isNaN(Number(age)) || Number(age) < 1 || !phone.trim()) return;
    onSave({
      name: name.trim(),
      age: Math.max(1, Number(age)),
      phone: phone.trim(),
      status: volunteer?.status ?? "Active",
      joinedOn: volunteer?.joinedOn ?? new Date().toISOString().slice(0, 10),
    });
    onClose();
  };

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Volunteer" : "Add New Peer Volunteer"}
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="submit" form={formId}>{isEdit ? "Save Changes" : "Add Volunteer"}</Button>
        </>
      }
    >
      <p className="mb-4 text-xs text-ink-muted">
        Fields marked <span aria-hidden>*</span><span className="sr-only">with an asterisk</span> are required.
      </p>
      <form id={formId} onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <FormField label="Full Name" required error={nameErr}>
          {(c) => (
            <Input {...c} value={name} onChange={(e) => setName(e.target.value)} placeholder="Volunteer's full name" autoFocus />
          )}
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Age" required error={ageErr}>
            {(c) => (
              <Input {...c} type="number" min={1} max={100} value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 24" />
            )}
          </FormField>
          <FormField label="Mobile Number" required error={phoneErr}>
            {(c) => (
              <Input {...c} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" />
            )}
          </FormField>
        </div>
        <div role="alert" aria-live="assertive" aria-atomic>
          {hasErr && <Alert status="error">Please fill in the highlighted fields above.</Alert>}
        </div>
      </form>
    </SideSheet>
  );
}

// ---------------------------------------------------------------------------
// Delete confirm
// ---------------------------------------------------------------------------

function DeleteConfirmModal({
  open,
  onClose,
  volunteer,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  volunteer: Volunteer | null;
  onConfirm: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Remove volunteer?"
      footer={
        <>
          <Button type="button" appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button type="button" variant="danger" iconLeft={<Trash2 className="h-4 w-4" />} onClick={onConfirm}>
            Remove
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
            You are about to remove <span className="font-semibold">{volunteer?.name}</span> from the volunteer roster.
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

export default function VolunteersPage() {
  const { id } = useParams<{ id: string }>();
  const { peerEducators, updatePeerEducator } = useTCStore();
  const { toast } = useToast();

  const educator = peerEducators.find((e) => e.id === id) ?? null;
  const roster = educator ? rosterFor(educator) : [];

  const [query, setQuery] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<{ volunteer: Volunteer; idx: number } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<{ volunteer: Volunteer; idx: number } | null>(null);

  const filtered = query.trim()
    ? roster.filter((v) => v.name.toLowerCase().includes(query.toLowerCase()) || v.phone.includes(query))
    : roster;

  const rows: Row[] = filtered.map((v, i) => ({ ...v, sno: i + 1, _idx: roster.indexOf(v) }));

  const saveVolunteer = (updated: Volunteer, idx?: number) => {
    if (!educator) return;
    const newRoster =
      idx !== undefined
        ? roster.map((v, i) => (i === idx ? updated : v))
        : [...roster, updated];
    updatePeerEducator(educator.id, { volunteers: newRoster, numberOfVolunteers: newRoster.length });
  };

  const deleteVolunteer = (idx: number) => {
    if (!educator) return;
    const newRoster = roster.filter((_, i) => i !== idx);
    updatePeerEducator(educator.id, { volunteers: newRoster, numberOfVolunteers: newRoster.length });
    toast("Volunteer removed.", "warning");
    setDeleteTarget(null);
  };

  const columns: ColumnDef<Row>[] = [
    { key: "sno", header: "Sl. No." },
    {
      key: "name",
      header: "Name",
      render: (r) => <span className="font-medium text-ink">{r.name}</span>,
    },
    {
      key: "age",
      header: "Age",
      render: (r) => <span className="tabular-nums">{r.age}</span>,
    },
    {
      key: "phone",
      header: "Mobile",
      render: (r) => <span className="font-mono">{r.phone}</span>,
    },
    {
      key: "actions" as keyof Row,
      header: "Action",
      noExport: true,
      render: (r) => (
        <RowActions>
          <IconAction
            icon={Pencil}
            tone="warning"
            label={`Edit ${r.name}`}
            onClick={() => setEditTarget({ volunteer: r, idx: r._idx })}
          />
          <IconAction
            icon={Trash2}
            tone="danger"
            label={`Remove ${r.name}`}
            onClick={() => setDeleteTarget({ volunteer: r, idx: r._idx })}
          />
        </RowActions>
      ),
    },
  ];

  if (!educator) {
    return (
      <div className="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-ink-muted">
          <Link href="/treatment-centre/dashboard" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <Link href="/treatment-centre/cpli/peer-educators" className="hover:text-navy transition-colors">Peer Educators</Link>
        </nav>
        <div className="rounded-lg border border-dashed border-line bg-surface-muted p-10 text-center text-sm text-ink-muted">
          Peer educator not found.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">

        {/* ── Breadcrumb (Home > Peer Educators > Educator Name) ── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-muted">
          <Link href="/treatment-centre/dashboard" className="hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <Link href="/treatment-centre/cpli/peer-educators" className="hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded">
            Peer Educators
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="max-w-[200px] truncate font-medium text-ink" aria-current="page">{educator.name}</span>
        </nav>

        {/* ── Page header: title + count + CTA ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-ink">Peer Volunteers</h1>
            <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-sm font-medium text-ink-muted">
              {roster.length}
            </span>
          </div>
          <Button
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={() => setAddOpen(true)}
            aria-haspopup="dialog"
          >
            Add New Peer Volunteer
          </Button>
        </div>

        {/* ── Toolbar: search (flex-1) + compact export ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or mobile"
              aria-label="Search volunteers"
            />
          </div>
          <ExportMenu rows={rows} educatorId={id} />
        </div>

        {/* ── Data table ── */}
        <DataTable
          columns={columns}
          data={rows}
          total={rows.length}
          caption="Peer Volunteers"
          emptyLabel={
            query
              ? `No volunteers match "${query}".`
              : 'No volunteers registered yet. Use "Add New Peer Volunteer" to add the first one.'
          }
        />
      </div>

      {/* ── Modals ── */}
      <VolunteerFormSheet
        key="add"
        open={addOpen}
        onClose={() => setAddOpen(false)}
        volunteer={null}
        onSave={(v) => {
          saveVolunteer(v);
          toast(`Volunteer "${v.name}" added.`, "success");
        }}
      />
      {editTarget && (
        <VolunteerFormSheet
          key={`edit-${editTarget.idx}`}
          open
          onClose={() => setEditTarget(null)}
          volunteer={editTarget.volunteer}
          onSave={(v) => {
            saveVolunteer(v, editTarget.idx);
            toast(`Volunteer "${v.name}" updated.`, "success");
            setEditTarget(null);
          }}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          open
          onClose={() => setDeleteTarget(null)}
          volunteer={deleteTarget.volunteer}
          onConfirm={() => deleteVolunteer(deleteTarget.idx)}
        />
      )}
    </>
  );
}
