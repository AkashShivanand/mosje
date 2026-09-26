import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import { TableWrap } from "./TableWrap";

export interface DocumentRow {
  title: string;
  /** The Department's "Start Publish Date", as published. */
  published?: string;
  /** As published, e.g. "1.20 MB". Omitted where the Department gives none. */
  size?: string;
  /** The Department's file address. Resolved to the estate's local sample. */
  href: string;
}

/**
 * The documents a content page publishes, as one table (issues CON-07, CON-21,
 * ACC-27). The live pages set these as "# · Title · Start Publish Date · End
 * Publish Date · FileSize · View". Here the link says "View Document" and its
 * accessible name carries the title, the type and the size; the end-publish date
 * is an archiving instruction for the site, not information for the reader, so
 * it is not shown. Newest first is NOT imposed: the Department's order is kept,
 * because on several pages it is a numbered sequence (Acts, then Rules).
 */
export function DocumentTable({ caption, rows }: { caption: string; rows: DocumentRow[] }) {
  const hasDate = rows.some((r) => r.published);
  const hasSize = rows.some((r) => r.size);
  return (
    <TableWrap label={caption}>
      <table className="wn-doc-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="num">
              S. No.
            </th>
            <th scope="col">Title</th>
            {hasDate && <th scope="col">Published</th>}
            {hasSize && (
              <th scope="col" className="num">
                Size
              </th>
            )}
            <th scope="col">
              <span className="sr-only">Document</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const date = formatDate(r.published);
            const type = /\.(\w+)(?:[?#]|$)/.exec(r.href)?.[1]?.toUpperCase() ?? "PDF";
            const detail = [type, r.size].filter(Boolean).join(", ");
            return (
              <tr key={`${i}-${r.title}`}>
                <td className="num">{i + 1}</td>
                <td className="wn-doc-title">{r.title}</td>
                {hasDate && <td className="wn-nowrap">{date ? <time dateTime={isoDate(r.published)}>{date}</time> : "–"}</td>}
                {hasSize && <td className="num wn-nowrap">{r.size ?? "–"}</td>}
                <td className="wn-nowrap">
                  <a href={localiseDocumentUrl(r.href, r.title)} target="_blank" rel="noopener noreferrer">
                    View Document
                    <span className="sr-only">
                      : {r.title} ({detail}, opens in a new window)
                    </span>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrap>
  );
}
