import { T } from "@/components/i18n/translation-provider";
import Link from "next/link";
import { ActionTile, Band, Icon, SectionTitle } from "@mosje/design-system";
import { getAllDocuments, routeSlug } from "@/lib/website/content";
import { formatDate } from "@/components/website-next/ui/format";
import {
  dateValue,
  fileMeta,
  tidyTitle,
} from "@/components/website-next/ui/records";

/**
 * Recent Documents (DBIM 3.0 §A.4.1 viii): the documents most recently
 * uploaded, of every kind a citizen reads — reports, circulars, notices,
 * publications, acts and rules. Left out: the case registers (NCSC advices,
 * hearings and proceedings, tour reports) and parliament questions, which are
 * filed in the hundreds and would fill the row with case numbers. Size and
 * type are shown where the register states them; "0 MB" is unknown, not zero
 * (CON-07).
 */
const CASE_REGISTERS = new Set([
  "Advices",
  "Hearing/Proceeding",
  "Tour Reports",
  "Parliament Questions",
  "RTI",
]);

/* There is no single listing of every document; these are the collections. */
const COLLECTIONS = [
  { label: "Annual Reports", href: "/website/annual-reports" },
  {
    label: "Circulars and Notifications",
    href: "/website/circulars-notifications",
  },
  { label: "Notices", href: "/website/notices" },
  { label: "Publications", href: "/website/publications" },
  { label: "Acts and Rules", href: "/website/acts-rules" },
];

export function Documents() {
  const docs = getAllDocuments()
    .filter((d) => d.category && !CASE_REGISTERS.has(d.category) && d.title)
    .sort((a, b) => dateValue(b.date) - dateValue(a.date))
    .slice(0, 4);

  return (
    <Band as="section" tone="default" spacing="xl" aria-labelledby="docs-title">
      <SectionTitle
        size="display"
        headingId="docs-title"
        title={<T>Recent Documents</T>}
        description={
          <T>The documents the Department has most recently published.</T>
        }
      />
      {docs.length === 0 ? (
        <p className="wn-home-news__empty">
          <T>No documents have been published yet.</T>
        </p>
      ) : (
        <ul className="wn-home-docs">
          {docs.map((d) => {
            const size =
              d.fileSize && !/^0(\.0+)?\s*MB$/i.test(d.fileSize)
                ? d.fileSize
                : undefined;
            const meta = fileMeta(d.fileUrl, d.fileType, size);
            return (
              <li key={d.slug}>
                <ActionTile
                  linkAs={Link}
                  href={`/website/documents/${routeSlug(d.slug)}`}
                  layout="block"
                  mediaSize={48}
                  title={
                    <span lang={/[ऀ-ॿ]/.test(d.title) ? "hi" : "en"}>
                      {tidyTitle(d.title)}
                    </span>
                  }
                  description={[d.category, formatDate(d.date), meta]
                    .filter(Boolean)
                    .join(" · ")}
                  media={<Icon name="description" size={24} />}
                />
              </li>
            );
          })}
        </ul>
      )}
      <nav className="wn-home-doclinks" aria-label="Document collections">
        <ul>
          {COLLECTIONS.map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="wn-home-more">
                {c.label}
                <Icon name="arrow_forward" size={20} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Band>
  );
}
