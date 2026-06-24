"use client";

import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input, FormField, Modal } from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { EDUCATION as INITIAL_EDUCATION } from "@/lib/treatment-centre/master-data";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";

type MasterItem = {
  sno: number;
  label: string;
  value: string;
};

export default function USEducationMasterPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<MasterItem[]>(
    INITIAL_EDUCATION.map((e, i) => ({ sno: i + 1, label: e.label, value: e.value }))
  );
  
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MasterItem | null>(null);
  const [label, setLabel] = React.useState("");
  const [value, setValue] = React.useState("");

  const handleOpenAdd = () => {
    setEditingItem(null);
    setLabel("");
    setValue("");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: MasterItem) => {
    setEditingItem(item);
    setLabel(item.label);
    setValue(item.value);
    setModalOpen(true);
  };

  const handleDelete = (item: MasterItem) => {
    if (confirm(`Are you sure you want to delete "${item.label}"?`)) {
      setItems((prev) => prev.filter((i) => i.value !== item.value).map((i, idx) => ({ ...i, sno: idx + 1 })));
      toast("Education status deleted successfully.", "warning");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) return;

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.value === editingItem.value ? { ...i, label, value } : i))
      );
      toast("Education status updated successfully.", "success");
    } else {
      if (items.some((i) => i.value === value)) {
        toast("Education code (value) must be unique.", "error");
        return;
      }
      setItems((prev) => [...prev, { sno: prev.length + 1, label, value }]);
      toast("Education status added successfully.", "success");
    }
    setModalOpen(false);
  };

  const columns: ColumnDef<MasterItem>[] = [
    { key: "sno", header: "S.No" },
    { key: "label", header: "Educational Qualification" },
    { key: "value", header: "Education Code (Value)" },
    {
      key: "actions",
      header: "Action",
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleOpenEdit(r)}
            className="inline-flex items-center gap-1 rounded bg-await-bg px-2 py-1 text-xs font-semibold text-await-fg hover:opacity-90"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(r)}
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
        title="Educational Status Master"
        columns={columns}
        data={items}
        searchKeys={["label", "value"]}
        fileName="education-master"
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-white/90"
          >
            <Plus className="h-4 w-4" /> Add New Qualification
          </button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Qualification details" : "Add New Qualification"}
        footer={
          <>
            <Button type="button" appearance="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="education-form">Save</Button>
          </>
        }
      >
        <form id="education-form" onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Educational Qualification" required>
            {(c) => <Input {...c} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Post Graduate" />}
          </FormField>
          <FormField label="Education Code (Value)" required>
            {(c) => (
              <Input
                {...c}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 8"
                disabled={!!editingItem}
              />
            )}
          </FormField>
        </form>
      </Modal>
    </>
  );
}
