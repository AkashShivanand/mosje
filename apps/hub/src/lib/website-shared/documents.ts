/**
 * RECENT DOCUMENTS — the four documents the live home page puts forward, shared
 * by all three designs of the website. Rule: home.ts.
 *
 * SOURCE: the "Recent Documents" section of https://dosje.gov.in/, read on
 * RECENT_DOCUMENTS_AS_ON. The live section is a selection — four annual
 * reports, while the document register holds newer circulars and results — so
 * it is mirrored as published, not rebuilt from the register. When the live
 * section changes, change it here.
 */

export const RECENT_DOCUMENTS_AS_ON = "2026-09-28";

export const RECENT_DOCUMENTS_SECTION = { title: "Recent Documents" } as const;

export interface RecentDocument {
  title: string;
  /** As printed, and machine-readable. */
  date: string;
  dateTime: string;
  /** The live card's "Type:". */
  type: string;
  /** The live card's "File:". */
  format: string;
  size: string;
  /** The live file its "View Online" opens. */
  file: string;
  /** The same document's page in the estate's register (`/website/documents/<slug>`). */
  slug: string;
}

export const RECENT_DOCUMENTS: readonly RecentDocument[] = [
  {
    title: "Annual Report 2025-26 (English)",
    date: "22 Apr 2026",
    dateTime: "2026-04-22",
    type: "Annual Reports",
    format: "PDF",
    size: "6.6 MB",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/04/71441776233188.pdf",
    slug: "annual-report-2025-26-english",
  },
  {
    title: "Annual Report 2025-26 (Hindi)",
    date: "22 Apr 2026",
    dateTime: "2026-04-22",
    type: "Annual Reports",
    format: "PDF",
    size: "89.2 MB",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/04/93691776234871.pdf",
    slug: "annual-report-2025-26-hindi",
  },
  {
    title: "Annual Report 2024-25",
    date: "23 Dec 2025",
    dateTime: "2025-12-23",
    type: "Annual Reports",
    format: "PDF",
    size: "195.4 MB",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/86481744793621.pdf",
    slug: "annual-report-2024-25",
  },
  {
    title: "Annual Report 2023-24",
    date: "22 Dec 2025",
    dateTime: "2025-12-22",
    type: "Annual Reports",
    format: "PDF",
    size: "6.5 MB",
    file: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/32691723633555.pdf",
    slug: "annual-report-2023-24",
  },
];
