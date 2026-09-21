import Link from "next/link";
import { DescriptionList, Icon, SectionTitle, buttonClasses, type DescriptionItem } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { Crumb } from "@/components/website-next/layout/PageHeader";
import { fileMeta, fileTypeOf, isExternal, tidyTitle } from "@/components/website-next/ui/records";
import type { LabelledFile } from "@/types/website/content";
import "./records.css";

export interface RecordDetailProps {
  title: string;
  /** The collection this record belongs to, shown above the title. */
  badge?: string;
  /** One sentence. Where the record has none, one is derived from its own fields. */
  description?: string;
  breadcrumb: Crumb[];
  lastUpdated?: string;
  /** Back to the listing this record came from. */
  backHref: string;
  backLabel: string;
  /** The register's own fields. Anything the record does not publish is omitted. */
  facts?: DescriptionItem[];
  /** Files the record attaches. The first becomes the page's one primary action. */
  files?: LabelledFile[];
  /**
   * Accepted for the page files' props and NOT rendered: this site is the
   * Department's site, so a "View on dosje.gov.in" link sent the reader to a
   * copy of the page they were already on.
   */
  sourceUrl?: string;
  children?: React.ReactNode;
}

/* "Open Document (0.11 MB)" → label "View Document", size "0.11 MB" (issues CON-21, DOC-02). */
const GENERIC = /^(open|view|download)(\s+(document|tender document|vacancy circular|file|pdf))?$/i;
const DEVANAGARI = /[ऀ-ॿ]/;

function describeFile(f: LabelledFile) {
  const raw = (f.label ?? "").trim();
  const sized = /^(.*?)\s*\(([^)]*\d[^)]*)\)\s*$/.exec(raw);
  const base = (sized ? (sized[1] ?? "") : raw).trim();
  const label = !base || GENERIC.test(base) ? "View Document" : base;
  return {
    label,
    meta: fileMeta(f.url, f.fileType, sized?.[2]),
    lang: DEVANAGARI.test(label) ? "hi" : undefined,
    external: isExternal(f.url),
  };
}

/* ICU prints "Sept" for en-GB; the site's one format is three letters (CON-16). */
const tidyFact = (item: DescriptionItem): DescriptionItem =>
  typeof item.value === "string" ? { ...item, value: item.value.replace(/\bSept\b/, "Sep") } : item;

/*
 * The register's own housekeeping, not facts about the record: every record is
 * "Status: Active", and "Tags: MoSJE Document" is the CMS's filing label.
 */
const INTERNAL_TERMS = new Set(["Status", "Tags"]);

const factText = (facts: DescriptionItem[], ...terms: string[]) => {
  const hit = facts.find((f) => terms.includes(f.term) && typeof f.value === "string");
  return hit ? (hit.value as string) : undefined;
};

/**
 * One record's own page — a tender, a vacancy, a document, an update, an
 * officer, a venue, a gallery item — in one shape (issue CON-19).
 *
 * The first screen answers the three questions a near-empty record page left
 * open: what this is (the badge and title), who issued it and when (one derived
 * sentence), and where the document is (the one primary action). Then the
 * record's own content, then its fields, and beside them the way back.
 */
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
  children,
}: RecordDetailProps) {
  const items = facts.filter((f) => !INTERNAL_TERMS.has(f.term)).map(tidyFact);
  const heading = tidyTitle(title);

  /* A sentence built only from the record's own fields — never invented. */
  const org = factText(items, "Organisation");
  const date = factText(items, "Published", "Published From", "Record Date");
  const summary =
    description ??
    (org && date ? `Published by ${org} on ${date}.` : org ? `Published by ${org}.` : date ? `Published on ${date}.` : undefined);

  /* Said once: a field the derived sentence already states is not repeated below it. */
  const shown = (description ? items : items.filter((f) => !(summary && typeof f.value === "string" && (f.value === org || f.value === date))))
    /* The document's type and size are on its action; a second copy here is restatement. */
    .filter((f) => !(files.length > 0 && (f.term === "File Size" || f.term === "File Type")));

  const described = files.map((f) => ({ file: f, ...describeFile(f) }));
  const primary = described[0];

  const action = primary ? (
    <a
      href={primary.file.url}
      className={buttonClasses("primary", "filled", "lg")}
      {...(primary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <Icon name={fileTypeOf(primary.file.url, primary.file.fileType) ? "description" : "link"} size={20} aria-hidden />
      <span lang={primary.lang}>{primary.label}</span>
      {primary.meta && <span className="wn-rd__btn-meta"> ({primary.meta})</span>}
      {primary.external && (
        <>
          <Icon name="open_in_new" size={16} aria-hidden />
          <span className="sr-only"> (opens in a new window)</span>
        </>
      )}
    </a>
  ) : undefined;

  return (
    <PageLayout
      title={heading}
      badge={badge}
      description={summary}
      breadcrumb={breadcrumb.map((c, i) => (i === breadcrumb.length - 1 ? { ...c, label: tidyTitle(c.label) } : c))}
      lastUpdated={lastUpdated}
      actions={action}
    >
      <div className="wn-section">
        <div className="sa-container wn-split">
          <div className="wn-rd__main">
            {described.length > 1 && (
              <section aria-labelledby="record-files">
                <SectionTitle headingId="record-files" title="Documents" />
                <ul className="wn-rd__files">
                  {described.map((d) => (
                    <li key={d.file.url} className="wn-rd__file">
                      <span className="wn-rd__file-icon" aria-hidden>
                        <Icon name="description" size={24} />
                      </span>
                      <span className="wn-rd__file-text">
                        <a
                          href={d.file.url}
                          className="wn-rd__file-link"
                          lang={d.lang}
                          {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {d.label}
                          {d.meta && <span className="sr-only"> ({d.meta})</span>}
                          {d.external && <span className="sr-only"> (opens in a new window)</span>}
                        </a>
                        {(d.meta || d.external) && (
                          <span className="wn-rd__file-meta" aria-hidden>
                            {d.meta}
                            {d.external && <Icon name="open_in_new" size={16} />}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {children}

            {shown.length > 0 && (
              <section className="wn-rd__facts" aria-labelledby="record-details">
                <SectionTitle headingId="record-details" title="Record Details" />
                <DescriptionList items={shown} columns={2} divided />
              </section>
            )}
          </div>

          <aside className="wn-aside wn-aside--sticky" aria-label="About this record">
            <nav className="wn-panel" aria-label="Record navigation">
              <div className="wn-rd__nav">
                <Link href={backHref}>
                  <Icon name="arrow_back" size={20} aria-hidden />
                  {backLabel}
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      </div>
    </PageLayout>
  );
}
