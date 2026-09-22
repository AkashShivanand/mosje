import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { getDocumentsOfType, routeSlug } from "@/lib/website/content";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import { dateValue, fileMeta, tidyTitle } from "@/components/website-next/ui/records";

/**
 * Recent Documents — the live home page's Annual Reports row: the Department's
 * own reports (organisation MoSJE), newest first. Size and type are in the
 * link's accessible name where the register states them (CON-07: a size of
 * "0 MB" is unknown, not zero, and is left out).
 */
export function Documents() {
  const reports = getDocumentsOfType("Annual Reports")
    .filter((d) => d.organisation === "MoSJE" && /20\d\d/.test(d.title))
    .sort((a, b) => dateValue(b.date) - dateValue(a.date))
    .slice(0, 4);

  return (
    <section className="wn-home-band" aria-labelledby="docs-title">
      <div className="sa-container">
        <SectionTitle size="display" headingId="docs-title" title="Annual Reports" description="The Department’s account of its work each year.">
          <Link href="/website/annual-reports" className="wn-home-more">
            View All Reports
            <Icon name="arrow_forward" size={20} aria-hidden />
          </Link>
        </SectionTitle>
        {reports.length === 0 ? (
          <p className="wn-home-news__empty">No reports have been published yet.</p>
        ) : (
          <ul className="wn-home-docs">
            {reports.map((d) => {
              const size = d.fileSize && !/^0(\.0+)?\s*MB$/i.test(d.fileSize) ? d.fileSize : undefined;
              const meta = fileMeta(d.fileUrl, d.fileType, size);
              const title = tidyTitle(d.title);
              return (
                <li key={d.slug} className="wn-home-doc">
                  <span className="wn-home-doc__icon" aria-hidden>
                    <Icon name="description" size={32} />
                  </span>
                  <h3 className="wn-home-doc__title">
                    <Link href={`/website/documents/${routeSlug(d.slug)}`} className="wn-home-doc__link">
                      {title}
                      {meta && <span className="sr-only"> ({meta})</span>}
                    </Link>
                  </h3>
                  <p className="wn-home-doc__meta">
                    {d.date && <time dateTime={isoDate(d.date)}>{formatDate(d.date)}</time>}
                    {meta && <span aria-hidden> · {meta}</span>}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
