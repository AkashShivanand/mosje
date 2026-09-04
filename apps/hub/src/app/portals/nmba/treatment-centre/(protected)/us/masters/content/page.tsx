"use client";

import * as React from "react";
import { Badge, Button, FormField, Icon, Input, Modal, Select, Textarea } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { CONTENT_PAGES } from "@/lib/nmba/treatment-centre/masters-extra";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { IconAction, RowActions } from "@/components/nmba/treatment-centre/row-actions";
import type { ColumnDef } from "@/components/nmba/data-table";

type MasterItem = {
  sno: number;
  id: string;
  title: string;
  type: "Policy" | "Content";
  description: string;
  isActive: boolean;
};

const truncate = (s: string, max = 80) => (s.length > max ? `${s.slice(0, max)}…` : s);

export default function USContentMasterPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<MasterItem[]>(
    CONTENT_PAGES.map((d, i) => ({
      sno: i + 1,
      id: d.id,
      title: d.title,
      type: d.type,
      description: d.description,
      isActive: d.isActive,
    }))
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MasterItem | null>(null);
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<"Policy" | "Content">("Content");
  const [description, setDescription] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setType("Content");
    setDescription("");
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: MasterItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setType(item.type);
    setDescription(item.description);
    setIsActive(item.isActive);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...i, title, type, description, isActive } : i))
      );
      toast("Content updated successfully.", "success");
    } else {
      const id = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (items.some((i) => i.id === id)) {
        toast("Content id must be unique.", "error");
        return;
      }
      setItems((prev) => [...prev, { sno: prev.length + 1, id, title, type, description, isActive }]);
      toast("Content added successfully.", "success");
    }
    setModalOpen(false);
  };

  const columns: ColumnDef<MasterItem>[] = [
    { key: "sno", header: "S.No" },
    { key: "title", header: "Title" },
    { key: "type", header: "Type" },
    {
      key: "description",
      header: "Description",
      render: (r) => truncate(r.description),
      exportValue: (r) => r.description,
    },
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
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <TCListPage
        title="Content Management"
        columns={columns}
        data={items}
        searchKeys={["title", "type", "description"]}
        fileName="content-management"
        action={
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-label-1 font-semibold text-navy transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Icon name="add" size={16} aria-hidden /> Add New Content
          </button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Content details" : "Add New Content"}
        footer={
          <>
            <Button type="button" appearance="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="content-form">Save</Button>
          </>
        }
      >
        <form id="content-form" onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Title" required>
            {(c) => <Input {...c} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Copyright Policy" />}
          </FormField>
          <FormField label="Type" required>
            {(c) => (
              <Select
                {...c}
                value={type}
                onChange={(e) => setType(e.target.value as "Policy" | "Content")}
                options={[
                  { label: "Policy", value: "Policy" },
                  { label: "Content", value: "Content" },
                ]}
              />
            )}
          </FormField>
          <FormField label="Description">
            {(c) => (
              <Textarea
                {...c}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter the content body…"
              />
            )}
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
