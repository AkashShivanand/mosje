"use client";

import * as React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input, FormField, Modal } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { MARITAL_STATUS as INITIAL_MARITAL_STATUS } from "@/lib/nmba/treatment-centre/master-data";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { IconAction, RowActions } from "@/components/nmba/treatment-centre/row-actions";
import type { ColumnDef } from "@/components/nmba/data-table";

type MasterItem = {
  sno: number;
  label: string;
  value: string;
};

export default function USMaritalStatusMasterPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<MasterItem[]>(
    INITIAL_MARITAL_STATUS.map((d, i) => ({ sno: i + 1, label: d.label, value: d.value }))
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
      toast("Marital status deleted successfully.", "warning");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) return;

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.value === editingItem.value ? { ...i, label, value } : i))
      );
      toast("Marital status updated successfully.", "success");
    } else {
      if (items.some((i) => i.value === value)) {
        toast("Marital status code (value) must be unique.", "error");
        return;
      }
      setItems((prev) => [...prev, { sno: prev.length + 1, label, value }]);
      toast("Marital status added successfully.", "success");
    }
    setModalOpen(false);
  };

  const columns: ColumnDef<MasterItem>[] = [
    { key: "sno", header: "S.No" },
    { key: "label", header: "Marital Status" },
    { key: "value", header: "Status Code (Value)" },
    {
      key: "actions",
      header: "Action",
      render: (r) => (
        <RowActions>
          <IconAction icon={Pencil} tone="warning" label={`Edit ${r.label}`} onClick={() => handleOpenEdit(r)} />
          <IconAction icon={Trash2} tone="danger" label={`Delete ${r.label}`} onClick={() => handleDelete(r)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <TCListPage
        title="Marital Status Master"
        columns={columns}
        data={items}
        searchKeys={["label", "value"]}
        fileName="marital-status-master"
        action={
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add New Marital Status
          </button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Marital Status details" : "Add New Marital Status"}
        footer={
          <>
            <Button type="button" appearance="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="marital-status-form">Save</Button>
          </>
        }
      >
        <form id="marital-status-form" onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Marital Status" required>
            {(c) => <Input {...c} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Married" />}
          </FormField>
          <FormField label="Status Code (Value)" required>
            {(c) => (
              <Input
                {...c}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 1"
                disabled={!!editingItem}
              />
            )}
          </FormField>
        </form>
      </Modal>
    </>
  );
}
