import type { Metadata } from "next";
import { ListingPage, type ListingColumn } from "@/components/website-next/templates/ListingPage";
import { getContentSyncedDate, getUpdates } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Updates";
const DESCRIPTION =
  "Announcements, results and awareness material published by the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/updates" }),
};

const columns: ListingColumn[] = [
  {
    key: "title",
    label: "Title",
    sortable: true,
    align: "left",
    className: "min-w-[320px] font-medium text-ink",
    type: "record",
    hrefKey: "href",
  },
  { key: "organisation", label: "Organisation", sortable: true },
  { key: "date", label: "Published", type: "date", sortable: true },
];

/**
 * ── WHAT THIS PAGE SHOWS, AND WHAT IT DELIBERATELY DOES NOT ──────────────────
 *
 * The department's own Updates page aggregates several record types behind one
 * Active/Archived pair of tabs and counts 82 items. Only nine of those are
 * `updates` records; the rest are tenders, vacancies and scheme documents shown
 * under a "Type" column. This page renders the nine that are genuinely updates,
 * because the other 73 already have their own pages on this site and listing
 * them twice would be the same record answering to two different headings.
 *
 * There is no Active/Archived control either: every ingested record carries
 * `status: "Active"`, so a tab that can only ever be empty is a promise the
 * register cannot keep. It goes in the moment the register publishes an
 * archived one.
 */
export default function Page() {
  const rows = getUpdates()
    .slice()
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .map((u) => ({
      title: u.title,
      organisation: u.organisation,
      date: u.date,
      href: `/website/updates/${u.slug}`,
    }));

  return (
    <ListingPage
      title={TITLE}
      breadcrumb={[{ label: "Media" }, { label: "Updates" }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
      columns={columns}
      rows={rows}
      searchKeys={["title", "organisation"]}
      searchPlaceholder="Search updates by title"
      filters={[{ key: "organisation", label: "Organisation", allLabel: "All Organisations" }]}
      noun="updates"
      nounSingular="update"
    />
  );
}
