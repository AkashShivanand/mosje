"use client";

import * as React from "react";
import { AdminShell } from "@/components/admin-shell";
import { IMPORTANT_DOCUMENTS } from "@/lib/mock-data";
import { useToast } from "@/components/toast";
import { Upload, FileText, Eye, EyeOff, Plus, X } from "lucide-react";

const inputCls =
  "w-full rounded-lg border border-line px-3 py-2 text-sm text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15";

function AddDocumentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [name, setName] = React.useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Document uploaded for review.", "success");
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="add-doc-title">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="add-doc-title" className="text-base font-bold text-ink">Add Document</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-ink-hint hover:bg-black/5"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div>
            <label htmlFor="doc-name" className="mb-1 block text-sm font-medium text-ink">Document Name</label>
            <input id="doc-name" required placeholder="Enter document name" value={name} onChange={e => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="doc-file" className="mb-1 block text-sm font-medium text-ink">File Upload</label>
            <input
              id="doc-file"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="block w-full text-sm text-ink-muted file:mr-4 file:rounded-lg file:border-0 file:bg-brandwash file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-navy hover:file:bg-navy/10"
              aria-label="Upload document file"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface-muted">Cancel</button>
            <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800">
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ImportantDocumentsPage() {
  const { toast } = useToast();
  const [docs, setDocs] = React.useState(IMPORTANT_DOCUMENTS);
  const [modalOpen, setModalOpen] = React.useState(false);

  const togglePublish = (i: number) => {
    setDocs((prev) =>
      prev.map((d, idx) => idx === i ? { ...d, published: !d.published } : d)
    );
    toast(docs[i].published ? "Document unpublished." : "Document published.", "success");
  };

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">Important Documents</h1>
          <p className="mt-1 text-sm text-ink-muted">{docs.length} documents</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <Plus className="h-4 w-4" />
          Add Document +
        </button>
      </div>

      <div className="rounded-xl border border-line bg-white shadow-card overflow-hidden">
        <table className="min-w-full text-sm" aria-label="Important documents">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
            <tr>
              <th scope="col" className="px-4 py-3">Document Name</th>
              <th scope="col" className="px-4 py-3">Uploaded On</th>
              <th scope="col" className="px-4 py-3">Uploaded By</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {docs.map((doc, i) => (
              <tr key={i} className="hover:bg-surface-muted/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-navy/60" />
                    <span className="font-medium text-ink">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{doc.uploadedOn}</td>
                <td className="px-4 py-3 text-ink-muted">{doc.uploadedBy}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${doc.published ? "bg-approve/10 text-approve" : "bg-ink-hint/10 text-ink-hint"}`}>
                    {doc.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => togglePublish(i)}
                    aria-label={doc.published ? "Unpublish document" : "Publish document"}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted"
                  >
                    {doc.published ? (
                      <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
                    ) : (
                      <><Eye className="h-3.5 w-3.5" /> Publish</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddDocumentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AdminShell>
  );
}
