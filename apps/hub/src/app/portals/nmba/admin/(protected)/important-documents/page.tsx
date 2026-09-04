"use client";

import * as React from "react";
import { AdminShell } from "@/components/nmba/admin-shell";
import { IMPORTANT_DOCUMENTS } from "@/lib/nmba/mock-data";
import { useToast } from "@/components/nmba/toast";
import { Badge, Button, FormField, Icon, Input } from "@mosje/design-system";

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
          <h2 id="add-doc-title" className="text-title-2 text-ink">Add Document</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-ink-hint hover:bg-black/5"><Icon name="close" size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <FormField label="Document Name" id="doc-name" required>
            {(control) => (
              <Input {...control} required placeholder="Enter document name" value={name} onChange={e => setName(e.target.value)} />
            )}
          </FormField>
          <div>
            <label htmlFor="doc-file" className="mb-1 block text-label-1 text-ink">File Upload</label>
            <input
              id="doc-file"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="block w-full text-body-2 text-ink-muted file:mr-4 file:rounded-lg file:border-0 file:bg-brandwash file:px-3 file:py-1.5 file:text-label-2 file:font-semibold file:text-navy hover:file:bg-navy/10"
              aria-label="Upload document file"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" appearance="outlined" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
            <Button type="submit" iconLeft={<Icon name="upload" size={16} />} style={{ flex: 1 }}>Upload</Button>
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
    toast(docs[i]?.published ? "Document unpublished." : "Document published.", "success");
  };

  return (
    <AdminShell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-1 text-ink">Important Documents</h1>
          <p className="mt-1 text-body-2 text-ink-muted">{docs.length} documents</p>
        </div>
        <Button onClick={() => setModalOpen(true)} iconLeft={<Icon name="add" size={16} />}>
          Add Document
        </Button>
      </div>

      <div className="rounded-xl border border-line bg-white shadow-card overflow-hidden">
        <table className="min-w-full text-body-2" aria-label="Important documents">
          <thead className="bg-surface-muted text-left text-label-3 uppercase text-ink-muted">
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
                    <Icon name="description" size={16} className="shrink-0 text-navy/60" />
                    <span className="font-medium text-ink">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{doc.uploadedOn}</td>
                <td className="px-4 py-3 text-ink-muted">{doc.uploadedBy}</td>
                <td className="px-4 py-3">
                  <Badge status={doc.published ? "success" : "neutral"}>
                    {doc.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    appearance="outlined"
                    onClick={() => togglePublish(i)}
                    aria-label={doc.published ? "Unpublish document" : "Publish document"}
                    iconLeft={doc.published ? <Icon name="visibility_off" size={14} /> : <Icon name="visibility" size={14} />}
                  >
                    {doc.published ? "Unpublish" : "Publish"}
                  </Button>
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
