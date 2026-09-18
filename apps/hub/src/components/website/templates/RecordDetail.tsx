import Link from "next/link";
import { Button, DescriptionList, Icon, SectionTitle, type DescriptionItem } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import type { Crumb } from "@/components/website/layout/page-trail";
import type { LabelledFile } from "@/types/website/content";
import "./record-detail.css";

/**
 * One record's own page — the shape every record detail on this estate takes.
 *
 * ── WHY ONE TEMPLATE FOR TEN COLLECTIONS ─────────────────────────────────────
 * A document, a tender, a vacancy, an official, a CPIO, a venue, an update, a
 * gallery item and a scheme document are all the same page to a reader: a title,
 * the register's own fields, whatever files the department attached, and a way
 * back to the listing. Writing ten of those by hand is how nine of them end up
 * with a different heading size and one of them with no source link.
 *
 * What a collection supplies is `facts` (its own fields), `files` (its own
 * attachments) and, where it has one, `children` — the prose, the photographs,
 * the rate card. Everything else is the same by construction.
 *
 * ── SOURCE ───────────────────────────────────────────────────────────────────
 * Every record links back to its page on dosje.gov.in. That is not decoration:
 * this estate is a prototype rendering the department's register, and the
 * department's own page is where the authoritative version lives.
 */

export interface RecordDetailProps {
  title: string;
  /** The band's eyebrow — the collection this record belongs to. */
  badge?: string;
  description?: string;
  breadcrumb: Crumb[];
  lastUpdated?: string;
  /** Back to the listing this record came from. */
  backHref: string;
  backLabel: string;
  /** The register's own fields. Anything the record does not publish is omitted. */
  facts?: DescriptionItem[];
  /** Files the record attaches — the document itself, a form, a rate list. */
  files?: LabelledFile[];
  /** The record's page on dosje.gov.in. */
  sourceUrl?: string;
  children?: React.ReactNode;
}

const isHttp = (href: string | undefined) => /^https?:\/\//.test(href ?? "");

export function RecordDetail({
  title,
  badge,
  description,
  breadcrumb,
  lastUpdated,
  backHref,
  backLabel,
  facts = [],
  files = [],
  sourceUrl,
  children,
}: RecordDetailProps) {
  return (
    <PageLayout
      title={title}
      badge={badge}
      backHref={backHref}
      description={description}
      breadcrumb={breadcrumb}
      lastUpdated={lastUpdated}
      level="inner"
    >
      <section className="sa-record-detail">
        <div className="sa-container sa-record-detail__grid">
          <div className="sa-record-detail__main">
            {children}

            {facts.length > 0 && (
              <div className="sa-record-detail__facts">
                <SectionTitle title="Record Details" />
                <DescriptionList items={facts} columns={2} divided />
              </div>
            )}
          </div>

          <aside className="sa-record-detail__aside">
            {files.length > 0 && (
              <div className="sa-record-detail__files">
                <h2 className="sa-record-detail__aside-title">
                  {files.length === 1 ? "Document" : "Documents"}
                </h2>
                <ul className="sa-record-detail__file-list">
                  {files.map((f) => (
                    <li key={f.url}>
                      <Button
                        href={f.url}
                        external={isHttp(f.url)}
                        variant="primary"
                        appearance="outlined"
                        size="sm"
                        iconLeft={<Icon name="picture_as_pdf" size={18} />}
                      >
                        {f.label ?? "Open Document"}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="sa-record-detail__nav">
              <Link href={backHref} className="sa-record-detail__back">
                <Icon name="arrow_left_alt" size={18} aria-hidden />
                {backLabel}
              </Link>
              {sourceUrl && (
                <a
                  className="sa-record-detail__source"
                  href={sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on dosje.gov.in
                  <Icon name="open_in_new" size={16} aria-hidden />
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>
    </PageLayout>
  );
}
