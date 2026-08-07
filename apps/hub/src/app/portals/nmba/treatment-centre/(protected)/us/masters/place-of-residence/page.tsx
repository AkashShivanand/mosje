"use client";

import * as React from "react";
import { Badge, Button, FormField, Icon, Input, Modal, Select } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { PLACE_OF_RESIDENCE_MASTER } from "@/lib/nmba/treatment-centre/masters-extra";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { IconAction, RowActions } from "@/components/nmba/treatment-centre/row-actions";
import type { ColumnDef } from "@/components/nmba/data-table";

type MasterItem = {
  sno: number;
  label: string;
  value: string;
  status: "Active" | "Inactive";
};

export default function USPlaceOfResidenceMasterPage() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<MasterItem[]>(
    PLACE_OF_RESIDENCE_MASTER.map((d, i) => ({ sno: i + 1, label: d.label, value: d.value, status: d.status }))
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<MasterItem | null>(null);
  const [label, setLabel] = React.useState("");
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<"Active" | "Inactive">("Active");

  const handleOpenAdd = () => {
    setEditingItem(null);
    setLabel("");
    setValue("");
    setStatus("Active");
    setModalOpen(true);
  };

  const handleOpenEdit = (item: MasterItem) => {
    setEditingItem(item);
    setLabel(item.label);
    setValue(item.value);
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleDelete = (item: MasterItem) => {
    if (confirm(`Are you sure you want to delete "${item.label}"?`)) {
      setItems((prev) => prev.filter((i) => i.value !== item.value).map((i, idx) => ({ ...i, sno: idx + 1 })));
      toast("Place of residence deleted successfully.", "warning");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) return;

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) => (i.value === editingItem.value ? { ...i, label, value, status } : i))
      );
      toast("Place of residence updated successfully.", "success");
    } else {
      if (items.some((i) => i.value === value)) {
        toast("Place of residence code (value) must be unique.", "error");
        return;
      }
      setItems((prev) => [...prev, { sno: prev.length + 1, label, value, status }]);
      toast("Place of residence added successfully.", "success");
    }
    setModalOpen(false);
  };

  const columns: ColumnDef<MasterItem>[] = [
    { key: "sno", header: "S.No" },
    { key: "label", header: "Place of Residence" },
    { key: "value", header: "Residence Code (Value)" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <Badge status={r.status === "Active" ? "success" : "neutral"}>{r.status}</Badge>
      ),
    },
    {
      key: "actions",
      header: "Action",
      render: (r) => (
        <RowActions>
          <IconAction icon="edit" tone="warning" label={`Edit ${r.label}`} onClick={() => handleOpenEdit(r)} />
          <IconAction icon="delete" tone="danger" label={`Delete ${r.label}`} onClick={() => handleDelete(r)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <TCListPage
        title="Place of Residence Master"
        columns={columns}
        data={items}
        searchKeys={["label", "value", "status"]}
        fileName="place-of-residence-master"
        action={
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Icon name="add" size={16} aria-hidden /> Add New Place of Residence
          </button>
        }
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Place of Residence details" : "Add New Place of Residence"}
        footer={
          <>
            <Button type="button" appearance="outlined" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="place-of-residence-form">Save</Button>
          </>
        }
      >
        <form id="place-of-residence-form" onSubmit={handleSave} className="flex flex-col gap-4">
          <FormField label="Place of Residence" required>
            {(c) => <Input {...c} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Rural" />}
          </FormField>
          <FormField label="Residence Code (Value)" required>
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
          <FormField label="Status" required>
            {(c) => (
              <Select
                {...c}
                value={status}
                onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
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
