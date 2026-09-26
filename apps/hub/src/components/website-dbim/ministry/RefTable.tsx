import type { RefTable } from "@/app/website/about-us/reference-tables";

/**
 * One of the Department's About Us tables, drawn as the reference draws its rich-text
 * tables (bootstrap `table-bordered table-striped`), inside a labelled, focusable
 * scroll region so a wide table never widens the page on a phone.
 */
export function DbimRefTable({ table, caption }: { table: RefTable; caption?: string }) {
  return (
    <div className="db-min-tablewrap" role="region" tabIndex={0} aria-label={caption ?? table.title}>
      <table className="db-min-table">
        <caption className="sr-only">{caption ?? table.title}</caption>
        <thead>
          {table.head.map((row, r) => (
            <tr key={r}>
              {row.map((c, i) => (
                <th key={i} scope={c.c ? "colgroup" : "col"} rowSpan={c.r} colSpan={c.c}>
                  {c.t}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.body.map((row, r) => (
            <tr key={r}>
              {row.map((c, i) => (
                <td key={i} rowSpan={c.r} colSpan={c.c}>
                  {c.t || "–"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
