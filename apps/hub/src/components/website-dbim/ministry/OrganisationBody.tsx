import { DbimDetailLayout } from "@/components/website-dbim/ministry/DetailLayout";
import { DbimLinkRow } from "@/components/website-dbim/ministry/DocRow";
import type { organisationDetail } from "@/lib/website-dbim/ministry";
import { withAssetBasePath } from "@/lib/website/content";

type Detail = NonNullable<ReturnType<typeof organisationDetail>>;

/**
 * One body's page, under Our Organisation or Our Scheme Portals: the summary box,
 * its own "About…" text onward, then the portal where a citizen applies (or the
 * body's own site). Spec §1 layout, §4 content.
 */
export function DbimOrganisationBody({ o, portalHeading = "Portal" }: { o: Detail; portalHeading?: string }) {
  return (
    <DbimDetailLayout summary={o.summary}>
      {o.sections.map((s, i) => (
        <section key={i} aria-label={s.heading ?? o.title}>
          {s.heading ? <h2>{s.heading}</h2> : null}
          {/* Ingested prose from dosje.gov.in, cleaned by cleanHtml() (asset paths, links, headings, tables). */}
          <div dangerouslySetInnerHTML={{ __html: withAssetBasePath(s.html) }} />
        </section>
      ))}
      {o.portal ? (
        <section aria-labelledby="org-portal">
          <h2 id="org-portal">{portalHeading}</h2>
          <DbimLinkRow label={o.title} href={o.portal} external={/^https?:\/\//.test(o.portal)} />
        </section>
      ) : null}
    </DbimDetailLayout>
  );
}
