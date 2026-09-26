"use client";

import { DataTable, type DataTableColumn } from "@mosje/design-system";

export type Rate = { label?: string; rate?: string };

/*
 * THE RATE CARD IS A TABLE BECAUSE IT IS ONE.
 *
 * Three rates against three classes of hirer is exactly what the Centre
 * publishes, and a reader's question is "which line applies to me". `DataTable`
 * gives it the estate's own table treatment; the pager never appears, because
 * three rows fit the smallest page size and `hidePagerWhenFits` defaults true.
 *
 * It lives in its own client module because `DataTable` holds page state and
 * its columns carry `render` functions, neither of which can be rendered from
 * the server page — prerendering /website/booking/<venue> failed on exactly
 * that until the table moved here.
 */
const rateColumns: DataTableColumn<Rate>[] = [
  { key: "label", header: "Hirer", render: (r) => r.label ?? "—" },
  { key: "rate", header: "Rate per Day (₹)", render: (r) => r.rate ?? "—" },
];

export function RateCard({ venue, rates }: { venue: string; rates: Rate[] }) {
  return (
    <DataTable
      columns={rateColumns}
      data={rates}
      total={rates.length}
      caption={`${venue} rate card`}
      showPageSizes={false}
    />
  );
}
