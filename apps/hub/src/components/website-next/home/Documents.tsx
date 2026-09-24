import { T } from "@/components/i18n/translation-provider";
import Link from "next/link";
import { Band, Icon, SectionTitle, buttonClasses } from "@mosje/design-system";
import { RoleExplorer } from "./RoleExplorer";
import { getAllDocuments, routeSlug } from "@/lib/website/content";
import { formatDate } from "@/components/website-next/ui/format";
import {
  dateValue,
  fileMeta,
  latestOfEachSeries,
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
 *
 * TWO COLUMNS, as the design draws them: the documents, and beside them the
 * four roles DBIM asks the page to address. They were two full-width sections
 * with four other sections between them.
 *
 * NO DESCRIPTION ON A CARD. The design shows one under each title; the
 * register publishes none, and a sentence we wrote about a document we have not
 * read is not something a government page may carry. What the register does
 * publish — the kind, the date, the file's type and size — is what the card
 * shows (live-data-fallback.md: a field neither source publishes is left OFF
 * the design, not filled in).
 *
 * ONE EDITION PER SERIES (`latestOfEachSeries`). The NCSK's standing returns are
 * published monthly under one name with the period in a trailing bracket, and
 * the whole month's batch is uploaded on one day — so two of these four slots
 * went to the same return for July and for August, and the July one is
 * superseded. Every edition stays in the collections linked below.
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
  const docs = latestOfEachSeries(
    getAllDocuments()
      .filter((d) => d.category && !CASE_REGISTERS.has(d.category) && d.title)
      .sort((a, b) => dateValue(b.date) - dateValue(a.date)),
  ).slice(0, 4);

  return (
    <Band as="section" tone="default" spacing="xl" aria-labelledby="docs-title">
      <div className="wn-home-docgrid">
        <div className="wn-home-docgrid__main">
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
                const href = `/website/documents/${routeSlug(d.slug)}`;
                return (
                  <li key={d.slug} className="wn-home-doc">
                    <h3 className="wn-home-doc__title">
                      <Link
                        href={href}
                        className="wn-home-doc__link"
                        lang={/[ऀ-ॿ]/.test(d.title) ? "hi" : "en"}
                      >
                        {tidyTitle(d.title)}
                      </Link>
                    </h3>
                    <p className="wn-home-doc__meta">
                      {[d.category, formatDate(d.date), meta]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    <div className="wn-home-doc__actions">
                      {/* The page first, the file second. "View Online" is this
                      site's own record of the document — its title, its date,
                      its source link; "Download" is the register's file, which
                      is served from the Department's CDN and therefore leaves
                      this site, so it is marked as leaving it. */}
                      <Link
                        href={href}
                        className={buttonClasses("primary", "outlined", "sm")}
                      >
                        <T>View Online</T>
                      </Link>
                      {d.fileUrl && (
                        <a
                          href={d.fileUrl}
                          className={buttonClasses("primary", "filled", "sm")}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <T>Download</T>
                          <Icon name="download" size={16} aria-hidden />
                        </a>
                      )}
                    </div>
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
        </div>
        <RoleExplorer />
      </div>
    </Band>
  );
}
