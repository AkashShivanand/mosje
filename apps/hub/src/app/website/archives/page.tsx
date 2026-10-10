import type { Metadata } from "next";
import Link from "next/link";
import { Icon, SectionTitle, buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { RecordTable, type RecordColumn } from "@/components/website-next/ui/RecordTable";
import { dedupeNotices, displayNoticeTitle, tidyTitle } from "@/components/website-next/ui/records";
import { isArchivedRecord } from "@/lib/website-shared/records";
import { getContentSyncedDate, getTenders, getVacancies } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/records.css";

const TITLE = "Archives";
const DESCRIPTION =
  "Tenders and vacancies the Department has marked as archived.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/archives" }),
};

/*
 * GIGW 3.0 / DBIM 3.0 §5.6 archive (issue MAN-06).
 *
 * THE RULE: the Department's own tag decides. Live tags each tender and vacancy
 * Active or Archived by hand (`component_status`), and that tag wins wherever a
 * record carries one — a 2022 tender can still be open and a month-old one can
 * already be closed, so a date cannot be trusted to say which. The twelve-month
 * rule from the publish date remains ONLY as the fallback for a record ingested
 * before the tag was kept.
 *
 * There is therefore no "Archived" column: when a tag decides, no archive DATE
 * exists to show. The page carried one until 8 Oct 2026, computed as publish
 * date plus twelve months, which was a derived number presented as a record.
 *
 * The same rule (`isArchivedRecord`, lib/website-shared/records.ts — one source
 * for all three designs) removes the item from /tenders and /vacancies, so an
 * item is on exactly one of the two pages.
 */
const columns: RecordColumn[] = [
  { key: "title", label: "Title", type: "record", sortable: true },
  { key: "published", label: "Published", type: "date", sortable: true },
  { key: "document", label: "Document", type: "link", hrefKey: "fileUrl" },
];

type FileRow = { slug: string; title: string; date?: string; fileUrl?: string; status?: "Active" | "Archived" };

/* Tender titles: listed once, and a title cut by the ingest ends in an ellipsis (see /tenders). */
const toRows = (items: FileRow[], base: string, notices = false) =>
  (notices ? dedupeNotices(items) : items)
    .filter(isArchivedRecord)
    .map((i) => ({
      title: notices ? displayNoticeTitle(i.title) : tidyTitle(i.title),
      href: `${base}/${i.slug}`,
      published: i.date,
      fileUrl: i.fileUrl,
      year: i.date?.slice(0, 4),
    }));

export default function ArchivesPage() {
  const tenders = toRows(getTenders(), "/website/tenders", true);
  const vacancies = toRows(getVacancies(), "/website/vacancies");

  return (
    <PageLayout
      title={TITLE}
      description={DESCRIPTION}
      breadcrumb={[{ label: TITLE }]}
      lastUpdated={getContentSyncedDate()}
    >
      <div className="wn-section">
        <div className="sa-container">
          <section className="wn-rec-group" id="archived-tenders" aria-labelledby="archived-tenders-title">
            <SectionTitle headingId="archived-tenders-title" title="Archived Tenders" />
            <RecordTable
              caption="Archived Tenders"
              columns={columns}
              rows={tenders}
              filters={[{ key: "year", label: "Year Published", allLabel: "All Years", order: "desc" }]}
              searchKeys={["title"]}
              searchPlaceholder="Search archived tenders by title"
              noun="tenders"
              nounSingular="tender"
              paramPrefix="t-"
              layout="stack"
              emptyMessage="No tender has been archived."
            />
          </section>

          <section className="wn-rec-group" id="archived-vacancies" aria-labelledby="archived-vacancies-title">
            <SectionTitle headingId="archived-vacancies-title" title="Archived Vacancies" />
            <RecordTable
              caption="Archived Vacancies"
              columns={columns}
              rows={vacancies}
              filters={[{ key: "year", label: "Year Published", allLabel: "All Years", order: "desc" }]}
              searchKeys={["title"]}
              searchPlaceholder="Search archived vacancies by title"
              noun="vacancies"
              nounSingular="vacancy"
              paramPrefix="v-"
              layout="stack"
              emptyMessage="No vacancy has been archived."
            />
          </section>

          <section className="wn-rec-group" id="annual-reports" aria-labelledby="annual-reports-title">
            <SectionTitle
              headingId="annual-reports-title"
              title="Annual Reports"
              description="Annual reports of the Department and of the commissions, corporations and autonomous bodies under it, for every year published."
            >
              <Link href="/website/annual-reports" className={buttonClasses("primary", "outlined", "md")}>
                View All Annual Reports
                <Icon name="arrow_forward" size={20} aria-hidden />
              </Link>
            </SectionTitle>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
