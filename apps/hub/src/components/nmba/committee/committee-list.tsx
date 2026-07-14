"use client";

// Read-only scoped list of committee records. Columns that are constant for the
// viewer (e.g. their own state/district) can be hidden to cut redundant noise.

import { ChevronRight } from "lucide-react";
import { DataTable, Button, type DataTableColumn } from "@mosje/design-system";
import { tierLabel } from "@/lib/nmba/committee/session";
import type { CommitteeRecord } from "@/lib/nmba/committee/types";

type Row = CommitteeRecord & Record<string, unknown>;

interface CommitteeListProps {
  records: CommitteeRecord[];
  showTier?: boolean;
  caption?: string;
  emptyLabel?: string;
  /** Column keys to omit because they're constant in this scope (e.g. "state"). */
  hideColumns?: string[];
  /** When provided, renders an "Open" action per row. */
  onOpen?: (record: CommitteeRecord) => void;
}

export function CommitteeList({
  records,
  showTier = false,
  caption = "Committee notifications",
  emptyLabel = "No committee notifications on record for this scope yet.",
  hideColumns = [],
  onOpen,
}: CommitteeListProps) {
  const hidden = new Set(hideColumns);

  const base: DataTableColumn<Row>[] = [
    ...(showTier
      ? [{ key: "tier", header: "Committee", render: (r: Row) => tierLabel(r.tier) } as DataTableColumn<Row>]
      : []),
    { key: "state", header: "State" },
    { key: "district", header: "District", render: (r) => r.district ?? "—" },
    { key: "block", header: "Block", render: (r) => r.block ?? "—" },
    {
      key: "head",
      header: "Chairperson / Chief Secretary",
      render: (r) => r.chiefSecretaryName ?? r.chairpersonName ?? "—",
      exportValue: (r) => r.chiefSecretaryName ?? r.chairpersonName ?? "—",
    },
    { key: "formationDate", header: "Formed on" },
    { key: "memberCount", header: "Members", render: (r) => String(r.memberCount) },
    {
      key: "minutes",
      header: "Minutes",
      render: (r) => String(r.minutes.length),
      exportValue: (r) => String(r.minutes.length),
    },
  ];

  const columns = base.filter((c) => !hidden.has(c.key));

  if (onOpen) {
    columns.push({
      key: "actions",
      header: "",
      noExport: true,
      className: "text-right",
      render: (r: Row) => (
        <Button appearance="text" onClick={() => onOpen(r)} iconRight={<ChevronRight className="h-4 w-4" />}>
          Open
        </Button>
      ),
    } as DataTableColumn<Row>);
  }

  return (
    <DataTable<Row>
      columns={columns}
      data={records as Row[]}
      total={records.length}
      caption={caption}
      emptyLabel={emptyLabel}
    />
  );
}
