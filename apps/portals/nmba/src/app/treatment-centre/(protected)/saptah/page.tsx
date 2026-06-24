"use client";

import * as React from "react";
import { useTCStore } from "@/lib/treatment-centre/store";
import { TCListPage } from "@/components/treatment-centre/tc-list";
import type { ColumnDef } from "@/components/data-table";
import type { SaptahEvent } from "@/lib/treatment-centre/types";

import { Button } from "@mosje/design-system";
import Link from "next/link";

type Row = SaptahEvent & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "eventName", header: "Event Name" },
  { key: "date", header: "Date" },
  { key: "location", header: "Location" },
  { key: "participants", header: "Participants" },
];

export default function SaptahPage() {
  const store = useTCStore();
  const rows: Row[] = store.saptahEvents.map((s, i) => ({ ...s, sno: i + 1 }));
  return (
    <TCListPage
      title="Nasha Mukt Bharat Saptah 2026"
      columns={columns}
      data={rows}
      searchKeys={["eventName", "location"]}
      fileName="nmb-saptah-2026"
      action={
        <Link href="/treatment-centre/saptah/new" passHref legacyBehavior>
          <Button appearance="outlined" className="bg-white text-navy hover:bg-slate-100 font-semibold text-sm">
            Add Activity
          </Button>
        </Link>
      }
    />
  );
}
