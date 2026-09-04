"use client";

import * as React from "react";
import { Badge, Button, FormField, Icon, Input, Modal, Select } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { WHATS_NEW } from "@/lib/nmba/treatment-centre/masters-extra";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { IconAction, RowActions } from "@/components/nmba/treatment-centre/row-actions";
import type { ColumnDef } from "@/components/nmba/data-table";

type MasterItem = {
  sno: number;
  id: string;
  title: string;
  link: string;
  pdf: string;
  size: string;
  createdDate: string;
  isActive: boolean;
};

export default function USWhatsNewMasterPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<MasterItem[]>(
    WHATS_NEW.map((d, i) => ({
      sno: i + 1,
      id: d.id,
      title: d.title,
      link: d.link ?? "",
      pdf: d.pdf ?? "",
      size: d.size ?? "",
      createdDate: d.createdDate,
      isActive: d.isActive,
    }))
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MasterItem | null>(null);
  const [title, setTitle] = React.useState("");
  const [link, setLink] = React.useState("");
  const [pdf, setPdf] = React.useState("");
  const [size, setSize] = React.useState("");
  const [createdDate, setCreatedDate] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setLink("");
    setPdf("");
    setSize("");
    setCreatedDate("");
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: MasterItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setLink(item.link);
    setPdf(item.pdf);
    setSize(item.size);
    setCreatedDate(item.createdDate);
    setIsActive(item.isActive);
    setModalOpen(true);
  };

  const handleDelete = (item: MasterItem) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      setItems((prev) => prev.filter((i) => i.id !== item.id).map((i, idx) => ({ ...i, sno: idx + 1 })));
      toast("What's New item deleted successfully.", "warning");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, title, link, pdf, size, createdDate, isActive } : i))
      );
      toast("What's New item updated successfully.", "success");
    } else {
      const id = `wn-${Date.now()}`;
      setItems((prev) => [...prev, { sno: prev.length + 1, id, title, link, pdf, size, createdDate, isActive }]);
      toast("What's New item added successfully.", "success");
    }
    setModalOpen(false);
  };

  const columns: ColumnDef<MasterItem>[] = [
    { key: "sno", header: "S.No" },
    { key: "title", header: "Title" },
    { key: "link", header: "Link", render: (r) => r.link || "—", exportValue: (r) => r.link || "—" },
    { key: "pdf", header: "Pdf", render: (r) => r.pdf || "—", exportValue: (r) => r.pdf || "—" },
    { key: "size", header: "Size", render: (r) => r.size || "—", exportValue: (r) => r.size || "—" },
    { key: "createdDate", header: "Created Date" },
    {
      key: "isActive",
      header: "Is Active",
      render: (r) => (
        <Badge status={r.isActive ? "success" : "neutral"}>{r.isActive ? "Active" : "Inactive"}</Badge>
      ),
      exportValue: (r) => (r.isActive ? "Active" : "Inactive"),
    },
    {
      key: "actions",
      header: "Action",
      render: (r) => (
        <RowActions>
          <IconAction icon="edit" tone="warning" label={`Edit ${r.title}`} onClick={() => handleOpenEdit(r)} />
          <IconAction icon="delete" tone="danger" label={`Delete ${r.title}`} onClick={() => handleDelete(r)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <TCListPage
        title="What's New"
        columns={columns}
        data={items}
        searchKeys={["title", "link", "pdf", "createdDate"]}
        fileName="whats-new"
        action={
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-label-1 font-semibold text-navy transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Icon name="add" size={16} aria-hidden /> Add New What&apos;s New
          </button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit What's New details" : "Add New What's New"}
        footer={
          <>
            <Button type="button" appearance="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="whats-new-form">Save</Button>
          </>
        }
      >
        <form id="whats-new-form" onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Title" required>
            {(c) => <Input {...c} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. NAPDDR Action Plan" />}
          </FormField>
          <FormField label="Link">
            {(c) => <Input {...c} value={link} onChange={(e) => setLink(e.target.value)} placeholder="e.g. https://nmba.dosje.gov.in/" />}
          </FormField>
          <FormField label="Pdf">
            {(c) => <Input {...c} value={pdf} onChange={(e) => setPdf(e.target.value)} placeholder="e.g. document.pdf" />}
          </FormField>
          <FormField label="Size">
            {(c) => <Input {...c} value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 1.46 MB" />}
          </FormField>
          <FormField label="Created Date">
            {(c) => <Input {...c} type="date" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} />}
          </FormField>
          <FormField label="Is Active" required>
            {(c) => (
              <Select
                {...c}
                value={isActive ? "Active" : "Inactive"}
                onChange={(e) => setIsActive(e.target.value === "Active")}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Inactive", value: "Inactive" },
                ]}
              />
            )}
          </FormField>
        </form>
      </Modal>
    </>
  );
}
