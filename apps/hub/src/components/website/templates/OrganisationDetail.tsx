import Image from "next/image";
import NextLink from "next/link";
import {
  BrandGlyph,
  DocumentLibrary,
  type DocumentLibraryItem,
  FactStrip,
  Icon,
  IndiaMap,
  Link,
  SectionTitle,
  buttonClasses,
} from "@mosje/design-system";
import type { SectionRecord, FileRecord } from "@/types/website/content";
import type {
  OrganisationDetail as OrgDetail,
  OrgDownloadItem as OrgDownload,
} from "@/content/website/organisation-details";
import { withAssetBasePath } from "@/lib/website/content";
import { trimRedundantOpening } from "@/lib/website/organisation-prose";
import { OrganisationIndex } from "./OrganisationIndex";
import "./organisation-detail.css";

/**
 * The Organisation Detail page template — Figma "MoSJE [Handoff] →
 * Organisation Details" (node 69:589).
 *
 * ONE TEMPLATE FOR EVERY ORGANISATION. The route renders this for all 178
 * organisation records, so the band sequence, the section order and the card
 * shapes are decided once here rather than per page. What varies is the data:
 * an organisation with no `detail` entry still gets the banner, the index and
 * its ingested prose, and simply omits the sections it has nothing for.
 *
 * THE BAND SEQUENCE, top to bottom, is the structure the Figma template
 * defines, and it is the part other organisation pages must not reorder:
 *
 *   banner (PageHero, owned by PageLayout)
 *   facts          — FactStrip, straddling the banner's lower edge
 *   about          — the index sits beside it and stays with the reader
 *   components     — the cards that open the child pages
 *   circulars      — filtered from documents.json
 *   resources      — filtered from documents.json
 *   downloads      — the files the organisation publishes
 *   gallery
 *   contact        — support details and the officer tables
 *
 * The page does NOT close with its own "Need support?" band. `SiteFooter`
 * already renders that ActionBanner on every website page, and adding one here
 * put two support CTAs a hundred pixels apart.
 *
 * THE TONES ALTERNATE, AND THE ALTERNATION IS COMPUTED, NOT WRITTEN DOWN. Each
 * band is a different kind of thing — prose, then destinations, then documents,
 * then pictures, then people — and the tone change is the only separator
 * between them. Hardcoding "this one is tinted" breaks the moment a section is
 * omitted: PM-AJAY's resources band was briefly empty and left two tinted bands
 * touching, which reads as one very long section. Sections are therefore
 * assembled into a list first and toned by their position in it, so a page with
 * four sections and a page with eight both alternate correctly.
 *
 * THE INDEX IS THE ONLY CLIENT COMPONENT ON THE PAGE. `OrganisationIndex`
 * wraps the DS `ContentNav` to mark the section in view; everything else here,
 * including all of the content, is server-rendered.
 *
 * THE INDEX SPANS THE WHOLE PAGE, NOT THE FIRST BAND. `.orgd` is one grid with
 * the rail in column one and every band in column two, so the nav is still on
 * screen at the contact table. The bands reach the viewport edge through a
 * pseudo-element rather than by leaving the grid — see `organisation-detail.css`
 * for why `overflow-x: clip` is load-bearing there.
 */

export interface OrganisationDetailProps {
  org: SectionRecord;
  detail?: OrgDetail;
  /** Sibling records under the same root slug, used for the fallback index. */
  relatedPages: SectionRecord[];
  /** Every ingested document; filtered here per `detail.circulars`/`resources`. */
  documents: FileRecord[];
  /**
   * A "where this organisation has reached" band, inserted directly after the
   * components cards. Supplied by the route, because the feed behind it belongs
   * to one organisation — see the comment at the insertion point.
   */
  reachSlot?: React.ReactNode;
  /** Appended as its own band, after everything the template renders. */
  children?: React.ReactNode;
}

/**
 * Built rather than written inline. `check:website-links` reads literal `href:`
 * strings and cannot resolve an interpolated slug, so an object-literal
 * `href: \`/website/organisation/${p.slug}\`` is reported as a link to nothing;
 * routing it through a function keeps the check honest about what it can verify.
 */
const orgHref = (slug: string) => `/website/organisation/${slug}`;

/** Anchor id for an ingested section heading, so the page index can reach it. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Documents in `category` whose title mentions one of `match`. Both conditions
 * are required: matching on title alone lets a broad term like "hostel" pull in
 * another scheme's circulars, and matching on category alone returns the whole
 * estate's paperwork.
 */
function matchDocuments(
  documents: FileRecord[],
  spec: { category: string; match: string[] } | undefined,
  limit: number,
): FileRecord[] {
  if (!spec || spec.match.length === 0) return [];
  const terms = spec.match.map((m) => m.toLowerCase());
  return documents
    .filter((d) => d.category === spec.category)
    .filter((d) => terms.some((t) => d.title.toLowerCase().includes(t)))
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, limit);
}

/**
 * One card for anything the reader can open — an ingested circular, a published
 * format, a scheme presentation.
 *
 * ONE DEFINITION ON PURPOSE. A circular and a download are the same object to a
 * reader: a thing with a name, something telling them what it is, and a way in.
 * Rendering them from two card definitions is how the two drift a card's padding
 * apart on one page.
 */
/*
 * Chip order for the library band, most-wanted first. Guidelines lead because
 * they are the document every other file on the shelf assumes you have read;
 * manuals trail because you go looking for one already knowing it exists.
 * Groups absent from a given organisation's items simply do not render.
 */
const LIBRARY_GROUP_ORDER = [
  "Guidelines",
  "Circulars",
  "Formats",
  "Presentations",
  "Manuals & guides",
  "Reports",
];

/** A destination that leaves this site, and therefore opens in a new tab. */
const isHttp = (href: string) => /^https?:\/\//.test(href);

/** What a download's card says it is, and what its button offers to do. */
const DOWNLOAD_KIND: Record<OrgDownload["kind"], { meta: string; action: string }> = {
  pdf: { meta: "PDF", action: "Download PDF" },
  pptx: { meta: "Presentation (PPTX)", action: "Download presentation" },
  // A campaign mark or a QR code. It IS a file, so it is downloaded — but
  // calling it a page, as it was until the NMBA downloads arrived, told a
  // reader they were about to open a web page and handed them a PNG.
  image: { meta: "Image (PNG)", action: "Download image" },
  // Not a file. Offering to "download" a web page would be a lie the reader
  // only discovers after clicking.
  page: { meta: "Web page", action: "View page" },
};

export function formatOrgHtml(rawHtml: string): string {
  let html = withAssetBasePath(trimRedundantOpening(rawHtml));
  // Strip any residual unconstrained widget images
  html = html.replace(/<a[^>]*>\s*<img[^>]*class="rounded-[34]"[^>]*>\s*<\/a>/gi, "");
  html = html.replace(/<img[^>]*class="rounded-[34]"[^>]*>/gi, "");
  html = html.replace(/<img[^>]*src="[^"]*schemes-768x768[^"]*"[^>]*>/gi, "");
  /*
   * AN ANCHOR WITH NO href IS NOT A LINK.
   *
   * The ingest keeps the <a> and drops the attribute when the source's own
   * markup carries the destination in script rather than in href — NMBA's
   * "Helpline 14446" arrived this way, styled as a link, doing nothing, and
   * announced to a screen reader as a link with no destination. Unwrap it to
   * the text it contains, which is what it actually is.
   *
   * A `tel:` for the helpline is supplied by the record's quick actions, where
   * it can be written deliberately rather than pattern-matched out of prose.
   */
  html = html.replace(/<a(?![^>]*\shref=)[^>]*>([\s\S]*?)<\/a>/gi, "$1");
  // Wrap any <table> in .orgd__tablewrap if not already wrapped
  html = html.replace(/(<table[\s\S]*?<\/table>)/gi, (match) => {
    let table = match.replace(/class="[^"]*table[^"]*"/gi, 'class="orgd__table"');
    if (!table.includes('class="')) {
      table = table.replace('<table', '<table class="orgd__table"');
    }
    return `<div class="orgd__tablewrap">${table}</div>`;
  });
  return html;
}

export function OrganisationDetail({
  org,
  detail,
  relatedPages,
  documents,
  reachSlot,
  children,
}: OrganisationDetailProps) {
  const circulars = matchDocuments(documents, detail?.circulars, 4);
  const resources = matchDocuments(documents, detail?.resources, 4);

  const isSubPage = org.slug.includes("/");
  const rootSlug = org.slug.split("/")[0] ?? org.slug;

  // Without a hand-authored index, fall back to the child pages the scrape
  // found. A page with neither is a single column, which is the right answer
  // for a page with one section.
  const rawNavGroups =
    detail?.nav ??
    (relatedPages.length > 1
      ? [
          {
            label: "ABOUT US",
            items: [
              {
                label: "About Organisation",
                href: isSubPage ? orgHref(rootSlug) : "#about-the-scheme",
                current: !isSubPage,
              },
            ],
          },
          {
            label: "OUR WORK & IMPACT",
            items: relatedPages
              .filter((p) => p.slug !== rootSlug)
              .map((p) => ({
                label: p.title,
                href: orgHref(p.slug),
                current: p.slug === org.slug,
              })),
          },
          {
            label: "CONNECT & ENGAGE",
            items: [
              {
                label: "Contact & Information",
                href: isSubPage ? `${orgHref(rootSlug)}#contact` : "#contact",
              },
            ],
          },
        ]
      : []);

  // When on a sub-page, resolve in-page anchor links back to the root organisation page
  const navGroups = rawNavGroups.map((g) => ({
    ...g,
    items: g.items.map((i) => {
      let href = i.href;
      if (isSubPage && href.startsWith("#")) {
        href = `${orgHref(rootSlug)}${href}`;
      }
      return {
        ...i,
        href,
        current: i.href === orgHref(org.slug),
      };
    }),
  }));

  const hasRail = navGroups.length > 0;

  // Sections the record has replaced with a real component — see
  // `hideIngestedSections`. Compared on the slugified heading so "GEO Tagged
  // De-addiction Facilities" and "Geo-tagged de-addiction facilities" are the
  // same section, which they are.
  const hidden = new Set((detail?.hideIngestedSections ?? []).map(slugify));
  const visibleSections = org.sections.filter(
    (s) => s.heading == null || !hidden.has(slugify(s.heading)),
  );

  const bands: { id: string; body: React.ReactNode }[] = [];

  const aboutSubpage = relatedPages.find((p) => {
    const s = p.slug.toLowerCase();
    return (
      s.endsWith("/about-us") ||
      s.endsWith("/about") ||
      s.includes("/about-") ||
      s.endsWith("/about-the-commission") ||
      s.endsWith("/about-bjrnf") ||
      s.endsWith("/about-dapsc")
    );
  });

  const effectiveAboutAction =
    detail?.aboutAction ??
    (aboutSubpage
      ? { label: "Know More →", href: orgHref(aboutSubpage.slug) }
      : undefined);

  bands.push({
    id: "about-the-scheme",
    body: (
      <>
        <SectionTitle as={2} title={detail?.aboutHeading ?? "About"} headingId="about-heading">
          {effectiveAboutAction != null && (
            <NextLink
              href={effectiveAboutAction.href}
              className={buttonClasses("primary", "outlined", "sm")}
            >
              {effectiveAboutAction.label}
            </NextLink>
          )}
        </SectionTitle>
        {detail?.aboutHtml != null ? (
          <div
            className="gov-prose orgd__prose"
            dangerouslySetInnerHTML={{ __html: formatOrgHtml(detail.aboutHtml) }}
          />
        ) : visibleSections.length === 0 ? (
          <p className="orgd__empty">
            This page is being prepared. In the meantime the source page is available on{" "}
            <Link href={org.sourceUrl} external>
              dosje.gov.in
            </Link>
            .
          </p>
        ) : (
          /*
           * EACH INGESTED SECTION KEEPS ITS OWN HEADING.
           *
           * This used to render the html alone and pass `s.heading` as the
           * React key and nothing else — so ten titled sections of the source
           * page arrived as one undivided 5,000-character block under a single
           * h2, with the document outline running h1 → h2 → h6. It is the
           * fallback path, so it did that on every organisation without a
           * hand-authored record, not on one page.
           *
           * `h3` because the band's own SectionTitle above is the h2.
           */
          visibleSections.map((s, i) => {
            const showHeading =
              s.heading != null &&
              s.heading.trim() !== "" &&
              slugify(s.heading) !== slugify(org.title) &&
              slugify(s.heading) !== slugify(detail?.aboutHeading ?? "About");
            return (
              <section key={s.heading ?? i} className="orgd__ingested-section">
                {showHeading && (
                  <h3 id={slugify(s.heading!)} className="orgd__ingested-heading">
                    {s.heading}
                  </h3>
                )}
                <div
                  className="gov-prose orgd__prose"
                  dangerouslySetInnerHTML={{
                    __html: formatOrgHtml(s.html),
                  }}
                />
              </section>
            );
          })
        )}
        {detail?.aboutHighlights != null && detail.aboutHighlights.length > 0 && (
          <ul className="orgd__highlights">
            {detail.aboutHighlights.map((h) => (
              <li key={h.title} className="orgd__highlight-card">
                <span className="orgd__card-icon">
                  <Icon name={h.icon ?? "verified"} size={32} />
                </span>
                <h3 className="orgd__card-title">{h.title}</h3>
                <p className="orgd__card-desc">{h.description}</p>
                {h.href != null && (
                  <NextLink href={h.href} className="orgd__card-cta">
                    {h.ctaLabel ?? "Learn more"}
                    <Icon name="arrow_forward" size={16} />
                  </NextLink>
                )}
              </li>
            ))}
          </ul>
        )}
      </>
    ),
  });

  if (detail?.leadership != null) {
    const l = detail.leadership;
    bands.push({
      id: "leadership",
      body: (
        <>
          <SectionTitle
            as={2}
            title={l.heading}
            description={l.description}
            headingId="leadership-heading"
          >
            {l.action != null && (
              <NextLink href={l.action.href} className={buttonClasses("primary", "outlined", "sm")}>
                {l.action.label}
              </NextLink>
            )}
          </SectionTitle>
          <ul className="orgd__leaders">
            {l.items.map((m) => (
              <li key={m.name} className="orgd__leader-card">
                <div className="orgd__leader-frame">
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.name}
                      width={140}
                      height={140}
                      className="orgd__leader-img w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-muted">
                      <Icon name="person" size={64} className="text-neutral-subtle" />
                    </div>
                  )}
                  {m.roleTag != null && (
                    <span className="orgd__leader-badge">{m.roleTag}</span>
                  )}
                </div>
                <h3 className="orgd__leader-name">{m.name}</h3>
                <p className="orgd__leader-role">{m.designation}</p>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  if (detail?.majorActivities != null) {
    const ma = detail.majorActivities;
    bands.push({
      id: "major-activities",
      body: (
        <>
          <SectionTitle
            as={2}
            title={ma.heading}
            description={ma.description}
            headingId="major-activities-heading"
          >
            {ma.action != null && (
              <NextLink href={ma.action.href} className={buttonClasses("primary", "outlined", "sm")}>
                {ma.action.label}
              </NextLink>
            )}
          </SectionTitle>
          <ul className="orgd__activities">
            {ma.items.map((act) => (
              <li key={act.title} className="orgd__activity-card">
                <div className="orgd__activity-icon">
                  <Icon name={act.icon ?? "verified"} size={40} />
                </div>
                <h3 className="orgd__activity-title">{act.title}</h3>
                {act.href && (
                  <NextLink
                    href={act.href}
                    className={buttonClasses("primary", "outlined", "sm", "orgd__activity-cta")}
                  >
                    {act.actionLabel ?? "View Details"}
                    <Icon name="arrow_forward" size={16} />
                  </NextLink>
                )}
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  if (detail?.initiatives != null) {
    const init = detail.initiatives;
    bands.push({
      id: "national-initiatives",
      body: (
        <>
          <SectionTitle
            as={2}
            title={init.heading}
            description={init.description}
            headingId="initiatives-heading"
          >
            {init.action != null && (
              <NextLink href={init.action.href} className={buttonClasses("primary", "outlined", "sm")}>
                {init.action.label}
              </NextLink>
            )}
          </SectionTitle>
          <ul className="orgd__initiatives">
            {init.items.map((it) => (
              <li key={it.title} className="orgd__initiative-card--horizontal">
                {it.image ? (
                  <div className="orgd__initiative-media">
                    <Image
                      src={it.image}
                      alt={it.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="orgd__initiative-media flex items-center justify-center p-4 bg-brand-primary-subtler">
                    <Image
                      src="/website/images/National-Emblem-logo.svg"
                      alt="National Emblem of India"
                      width={56}
                      height={56}
                    />
                  </div>
                )}
                <div className="orgd__initiative-body">
                  <span className="orgd__initiative-tag">
                    Ministry of Social Justice &amp; Empowerment
                  </span>
                  <h3 className="orgd__initiative-title">{it.title}</h3>
                  <p className="orgd__initiative-desc">{it.description}</p>
                  <NextLink
                    href={it.href ?? orgHref(it.slug ?? "")}
                    className={buttonClasses("primary", "outlined", "sm", "mt-auto self-start flex items-center gap-1.5")}
                  >
                    {it.actionLabel ?? "Know More"}
                    <Icon name="arrow_forward" size={16} />
                  </NextLink>
                </div>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  if (detail?.components != null) {
    bands.push({
      id: "components",
      body: (
        <>
          <SectionTitle
            as={2}
            title={detail.components.heading}
            description={detail.components.description}
            headingId="components-heading"
          >
            {detail.components.action != null && (
              <NextLink
                href={detail.components.action.href}
                className={buttonClasses("primary", "outlined", "sm")}
              >
                {detail.components.action.label}
              </NextLink>
            )}
          </SectionTitle>
          <ul className="orgd__cards">
            {detail.components.items.map((c) => (
              <li key={c.slug}>
                <NextLink href={orgHref(c.slug)} className="orgd__card">
                  <span className="orgd__card-icon" aria-hidden="true">
                    <Icon name={c.icon} size={32} />
                  </span>
                  <span className="orgd__card-title">{c.title}</span>
                  <span className="orgd__card-desc">{c.description}</span>
                  <span className="orgd__card-cta">
                    Read more
                    <Icon name="arrow_forward" size={16} />
                  </span>
                </NextLink>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  /*
   * IMMEDIATELY AFTER THE COMPONENTS, AND THAT IS THE WHOLE ARGUMENT FOR THE
   * POSITION. The reader has just been told the scheme has three components and
   * has seen a card for each. "Where has it actually landed" is the next
   * question they have, and it is answered while the three names are still in
   * their head. Further down — after the documents, say — the same map is a
   * curiosity; here it is the evidence for the cards above it.
   *
   * A SLOT, NOT A BAND THIS TEMPLATE BUILDS. The map is one organisation's feed,
   * fetched by the route that knows which organisation it is rendering. Baking
   * PM-AJAY's endpoint into the template every one of 178 organisations renders
   * would put a scheme-specific fetch on 177 pages that have no use for it.
   */
  if (reachSlot != null) {
    bands.push({ id: "reach", body: reachSlot });
  }

  if (detail?.resourcesBookshelf != null) {
    const rb = detail.resourcesBookshelf;
    bands.push({
      id: "resources-bookshelf",
      body: (
        <>
          <SectionTitle
            as={2}
            title={rb.heading}
            description={rb.description}
            headingId="resources-bookshelf-heading"
          >
            {rb.action != null && (
              <NextLink href={rb.action.href} className={buttonClasses("primary", "outlined", "sm")}>
                {rb.action.label}
              </NextLink>
            )}
          </SectionTitle>
          <ul className="orgd__bookshelf">
            {rb.items.map((book) => (
              <li key={book.title} className="orgd__book-card">
                <NextLink href={book.href ?? "#"} className="orgd__book-link">
                  <div className="orgd__book-cover">
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="orgd__book-title">{book.title}</h3>
                </NextLink>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  /*
   * ONE library band where four grids used to be. The hand-listed downloads and
   * the two document-ingest pulls (circulars, resources) are the same object to
   * a reader — a file with a name and a date — so they are merged into one list
   * and separated by a chip instead of by three headings and 1,200px of scroll.
   *
   * Each source declares its own chip: the downloads carry `group` in the
   * content, and the two ingest pulls take the name of what they are. Nothing
   * here guesses a category from a file extension.
   */
  const libraryItems: DocumentLibraryItem[] = [
    ...circulars.map((d) => ({
      id: `circular-${d.slug}`,
      group: "Circulars",
      meta: formatDate(d.date),
      title: d.title,
      href: d.fileUrl ?? d.sourceUrl,
      actionLabel: "View document",
      external: isHttp(d.fileUrl ?? d.sourceUrl),
    })),
    ...resources.map((d) => ({
      id: `resource-${d.slug}`,
      group: "Formats",
      meta: formatDate(d.date),
      title: d.title,
      href: d.fileUrl ?? d.sourceUrl,
      actionLabel: "View document",
      external: isHttp(d.fileUrl ?? d.sourceUrl),
    })),
    ...(detail?.downloads?.groups ?? []).flatMap((g) =>
      g.items.map((f) => ({
        id: `download-${f.href}-${f.label}`,
        group: f.group ?? "Formats",
        meta: f.meta ?? DOWNLOAD_KIND[f.kind].meta,
        title: f.label,
        officialName: f.officialName,
        href: f.href,
        actionLabel: DOWNLOAD_KIND[f.kind].action,
        external: isHttp(f.href),
      })),
    ),
  ];

  if (libraryItems.length > 0) {
    const lib = detail?.downloads;
    bands.push({
      id: "documents-downloads",
      body: (
        <>
          <SectionTitle
            as={2}
            title={lib?.heading ?? "Documents & Downloads"}
            description={lib?.description}
            headingId="documents-downloads-heading"
          />
          <DocumentLibrary
            items={libraryItems}
            groupOrder={LIBRARY_GROUP_ORDER}
            viewAllSlot={
              <NextLink
                href={
                  lib?.groups?.[0]?.viewAllHref ??
                  detail?.circulars?.viewAllHref ??
                  "/website/publications"
                }
                className={buttonClasses("primary", "outlined", "sm")}
              >
                View all documents
              </NextLink>
            }
          />
        </>
      ),
    });
  }

  if (detail?.reports != null && detail.reports.groups.length > 0) {
    const rp = detail.reports;
    bands.push({
      id: "reports",
      body: (
        <>
          <SectionTitle
            as={2}
            title={rp.heading}
            description={rp.description}
            headingId="reports-heading"
          />
          {rp.groups.map((g) => (
            <div key={g.heading} className="orgd__report-group">
              <h3 className="orgd__report-group-title">{g.heading}</h3>
              <div className="orgd__pills">
                {g.items.map((p) => {
                  const isExternal =
                    p.external || p.href.startsWith("http://") || p.href.startsWith("https://");
                  return (
                    <NextLink
                      key={p.href}
                      href={p.href}
                      className="orgd__pill"
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer" : undefined}
                    >
                      <span>{p.label}</span>
                      <Icon name={isExternal ? "open_in_new" : "arrow_forward"} size={16} />
                    </NextLink>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      ),
    });
  }

  if (detail?.featuredLinks != null && detail.featuredLinks.items.length > 0) {
    const fl = detail.featuredLinks;
    bands.push({
      id: "featured-links",
      body: (
        <>
          <SectionTitle
            as={2}
            title={fl.heading ?? "Featured Links"}
            headingId="featured-links-heading"
          />
          <div className="orgd__pills">
            {fl.items.map((p) => {
              const isExternal = p.external || p.href.startsWith("http://") || p.href.startsWith("https://");
              return (
                <NextLink
                  key={p.href}
                  href={p.href}
                  className="orgd__pill"
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                >
                  <span>{p.label}</span>
                  <Icon name={isExternal ? "open_in_new" : "arrow_forward"} size={16} />
                </NextLink>
              );
            })}
          </div>
        </>
      ),
    });
  }

  if (detail?.gallery != null) {
    bands.push({
      id: "gallery",
      body: (
        <>
          <SectionTitle as={2} title={detail.gallery.heading} headingId="gallery-heading">
            <NextLink
              href={detail.gallery.viewAllHref ?? "/website/gallery"}
              className={buttonClasses("primary", "outlined", "sm")}
            >
              View all photos
            </NextLink>
          </SectionTitle>
          {/* Segmented Media Tabs (Figma 5326:27984) */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <div className="inline-flex rounded-lg p-1 bg-surface-muted border border-neutral-subtle gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-surface text-ink text-label-1 shadow-sm"
              >
                <Icon name="image" size={16} className="text-primary-base" />
                <span>All Photos</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-ink-subtle hover:text-ink text-label-1 transition-colors"
              >
                <Icon name="movie" size={16} />
                <span>Videos</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-ink-subtle hover:text-ink text-label-1 transition-colors"
              >
                <Icon name="event" size={16} />
                <span>Events</span>
              </button>
            </div>
          </div>
          <ul className="orgd__gallery">
            {detail.gallery.items.map((g) => (
              <li key={g.image} className="orgd__shot">
                <div className="orgd__shot-frame">
                  <Image src={g.image} alt={g.caption} fill sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <p className="orgd__shot-date">{g.date}</p>
                <p className="orgd__shot-caption">{g.caption}</p>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  if (detail?.stateOfficesMap != null && detail.stateOfficesMap.offices.length > 0) {
    const som = detail.stateOfficesMap;
    bands.push({
      id: "state-offices",
      body: (
        <>
          <SectionTitle
            as={2}
            title={som.heading}
            description={som.description}
            headingId="state-offices-heading"
          >
            {som.action != null && (
              <NextLink href={som.action.href} className={buttonClasses("primary", "outlined", "sm")}>
                {som.action.label}
              </NextLink>
            )}
          </SectionTitle>
          <div className="orgd__state-map-layout">
            <ul className="orgd__state-list">
              {som.offices.map((office) => (
                <li key={office.name} className="orgd__state-card">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-title-2 text-ink">{office.name}</span>
                    <Icon name="chevron_right" size={20} className="text-neutral-subtle" />
                  </div>
                  {office.address && (
                    <p className="text-body-2 text-neutral-subtle mt-1">{office.address}</p>
                  )}
                </li>
              ))}
            </ul>
            <div className="orgd__map-container">
              <IndiaMap
                data={som.offices.map((o) => ({ state: o.stateCode, value: 1 }))}
                title="State & Regional Offices"
              />
            </div>
          </div>
        </>
      ),
    });
  }

  if (detail?.activityCorner != null) {
    const ac = detail.activityCorner;
    bands.push({
      id: "activity-corner",
      body: (
        <>
          <SectionTitle
            as={2}
            title={ac.heading}
            description={ac.description}
            headingId="activity-corner-heading"
          >
            {ac.action != null && (
              <NextLink href={ac.action.href} className={buttonClasses("primary", "outlined", "sm")}>
                {ac.action.label}
              </NextLink>
            )}
          </SectionTitle>
          <ul className="orgd__updates-grid">
            {ac.items.map((item) => (
              <li key={item.title} className="orgd__update-card">
                <div className="orgd__date-badge">
                  <span className="orgd__date-day">{item.day}</span>
                  <span className="orgd__date-month">{item.monthYear}</span>
                </div>
                <div className="orgd__update-content">
                  <h3 className="orgd__update-title">{item.title}</h3>
                  <p className="orgd__update-desc">{item.description}</p>
                  {item.href && (
                    <NextLink href={item.href} className="orgd__update-link">
                      <span>Read More</span>
                      <Icon name="arrow_forward" size={16} />
                    </NextLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  /*
   * MESSAGES — signed statements from named office-holders.
   *
   * A `blockquote` with a `cite`d attribution, not a leader card: the quote is
   * what the reader came for and the name is what makes it citable. The source
   * runs these as a carousel; they are laid out here instead, because a
   * statement a reader has to press a control to see is a statement most
   * readers never see.
   */
  if (detail?.messages != null && detail.messages.items.length > 0) {
    const ms = detail.messages;
    bands.push({
      id: "messages",
      body: (
        <>
          <SectionTitle as={2} title={ms.heading} headingId="messages-heading">
            {ms.description != null && <p className="orgd__band-lede">{ms.description}</p>}
          </SectionTitle>
          {/*
            * No decorative quote mark on these cards. `format_quote` at 28px
            * draws two filled commas that read as the digits "99" above a
            * paragraph of prose — checked in the browser, and it is the glyph
            * rendering correctly, not a failed ligature. An ornament that can
            * be mistaken for a figure does not belong on a departmental page,
            * and the attribution below each quote already says it is one.
            */}
          <ul className="orgd__messages">
            {ms.items.map((m) => (
              <li key={m.name} className="orgd__message">
                <blockquote className="orgd__message-quote">
                  <p>{m.quote}</p>
                </blockquote>
                <footer className="orgd__message-by">
                  <cite className="orgd__message-name">{m.name}</cite>
                  <span className="orgd__message-role">{m.designation}</span>
                </footer>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  if (detail?.socialFeed != null && (detail.socialFeed.posts?.length || detail.socialFeed.handles?.length)) {
    const sf = detail.socialFeed;
    bands.push({
      id: "social-feed",
      body: (
        <>
          <SectionTitle
            as={2}
            title={sf.heading}
            headingId="social-feed-heading"
          />
          {sf.handles && sf.handles.length > 0 && (
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {sf.handles.map((h) => (
                <Link
                  key={h.url}
                  href={h.url}
                  external
                  variant="standalone"
                  className="px-3.5 py-1.5 rounded-full border border-neutral-subtle bg-surface hover:bg-surface-muted text-label-1 text-ink transition-colors"
                  iconLeft={<BrandGlyph name={h.platform} size={16} />}
                >
                  {h.handle}
                </Link>
              ))}
            </div>
          )}
          {sf.posts && sf.posts.length > 0 && (
            <ul className="orgd__social-grid">
              {sf.posts.map((post, idx) => (
                <li key={idx} className="orgd__social-card">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-primary-subtler flex items-center justify-center text-brand-primary-bolder">
                        <BrandGlyph name={post.platform} size={20} />
                      </div>
                      <div>
                        <p className="text-title-3 text-ink m-0">{post.author}</p>
                        <p className="text-body-3 text-neutral-subtle m-0">{post.handle}</p>
                      </div>
                    </div>
                    <span className="text-body-3 text-neutral-subtle">{post.date}</span>
                  </div>
                  <p className="orgd__social-text">{post.content}</p>
                  {post.image && (
                    <div className="w-full h-36 relative rounded-lg overflow-hidden my-3 border border-neutral-subtle">
                      <Image src={post.image} alt={post.content.slice(0, 40)} fill className="object-cover" />
                    </div>
                  )}
                  {(post.likes || post.shares) && (
                    <div className="flex items-center gap-4 pt-3 border-t border-neutral-subtle text-body-3 text-neutral-subtle mt-auto">
                      {post.likes && (
                        <span className="flex items-center gap-1">
                          <Icon name="favorite" size={16} className="text-danger-base" /> {post.likes}
                        </span>
                      )}
                      {post.shares && (
                        <span className="flex items-center gap-1">
                          <Icon name="share" size={16} /> {post.shares}
                        </span>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      ),
    });
  }

  if (detail?.contact != null) {
    const contact = detail.contact;
    const contactAction = contact.action ?? {
      label: "View Directory",
      href: `/website/directory?org=${org.slug}`,
    };
    bands.push({
      id: "contact",
      body: (
        <>
          <SectionTitle as={2} title={contact.heading} headingId="contact-heading">
            <NextLink href={contactAction.href} className={buttonClasses("primary", "outlined", "sm")}>
              {contactAction.label}
            </NextLink>
          </SectionTitle>
          <div className="orgd__contact">
            <div className="orgd__contact-grid">
              {contact.address != null && (
                <div className="orgd__contact-card">
                  <div className="flex items-center gap-2 text-primary-dark text-title-2">
                    <Icon name="location_on" size={20} />
                    <span>Headquarters</span>
                  </div>
                  <p className="text-body-2 text-ink m-0">{contact.address}</p>
                </div>
              )}
              {contact.supportPhone != null && (
                <div className="orgd__contact-card">
                  <div className="flex items-center gap-2 text-primary-dark text-title-2">
                    <Icon name="call" size={20} />
                    <span>Telephone / Helpline</span>
                  </div>
                  <p className="text-body-2 text-ink m-0">
                    <a href={`tel:${contact.supportPhone.replace(/[^+\d]/g, "")}`} className="text-link hover:underline">
                      {contact.supportPhone}
                    </a>
                  </p>
                  {contact.supportHours != null && (
                    <span className="text-body-3 text-ink-subtle">{contact.supportHours}</span>
                  )}
                </div>
              )}
              {contact.supportEmail != null && (
                <div className="orgd__contact-card">
                  <div className="flex items-center gap-2 text-primary-dark text-title-2">
                    <Icon name="mail" size={20} />
                    <span>Official Email</span>
                  </div>
                  <p className="text-body-2 text-ink m-0">{contact.supportEmail}</p>
                </div>
              )}
              {contact.regionalOffices != null && (
                <div className="orgd__contact-card">
                  <div className="flex items-center gap-2 text-primary-dark text-title-2">
                    <Icon name="domain" size={20} />
                    <span>State & Regional Offices</span>
                  </div>
                  <p className="text-body-2 text-ink m-0">{contact.regionalOffices}</p>
                </div>
              )}
            </div>

            {contact.blocks?.map((block) => (
              <div className="orgd__people" key={block.heading}>
                <h3 className="orgd__subhead">{block.heading}</h3>
                <div className="orgd__tablewrap">
                  <table className="orgd__table">
                    <caption className="sr-only">{block.heading}</caption>
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Designation</th>
                        <th scope="col">Contact</th>
                        <th scope="col">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.people.map((p) => (
                        <tr key={p.name}>
                          <th scope="row">{p.name}</th>
                          <td>{p.designation}</td>
                          <td>
                            {p.phone != null ? (
                              <a href={`tel:${p.phone.replace(/[^+\d]/g, "")}`}>{p.phone}</a>
                            ) : (
                              <>
                                <span aria-hidden="true">—</span>
                                <span className="sr-only">Not published</span>
                              </>
                            )}
                          </td>
                          <td>
                            {/*
                              * A published address is a way to reach somebody,
                              * so it is a link. The telephone beside it has
                              * been one all along; the email was plain text.
                              */}
                            {p.email != null ? (
                              <a href={`mailto:${p.email}`}>{p.email}</a>
                            ) : (
                              <>
                                <span aria-hidden="true">—</span>
                                <span className="sr-only">Not published</span>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      ),
    });
  }

  /*
   * The source site's subject tags, last, as they are there. They are a
   * taxonomy rather than content — a way out of the page into everything else
   * the Department publishes on the subject — so they sit below the contact
   * details and are drawn as quiet links, not as another card grid.
   */
  if (detail?.tags != null && detail.tags.items.length > 0) {
    const tg = detail.tags;
    bands.push({
      id: "tags",
      body: (
        <>
          <SectionTitle as={2} title={tg.heading} headingId="tags-heading" />
          <ul className="orgd__tags">
            {tg.items.map((t) => (
              <li key={t.href}>
                <Link href={t.href} external variant="standalone" className="orgd__tag">
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  if (children != null) {
    bands.push({ id: "more", body: children });
  }

  return (
    <>
      {detail?.facts != null && detail.facts.length > 0 && (
        <div className="orgd__facts">
          <div className="sa-container">
            <FactStrip overlap ariaLabel={`Key facts about ${org.title}`} items={detail.facts} />
          </div>
        </div>
      )}

      <div className={`orgd${hasRail ? " orgd--railed" : ""}`}>
        <div className="sa-container orgd__grid">
          {hasRail && (
            <div className="orgd__rail">
              <OrganisationIndex
                ariaLabel={`Sections of the ${org.title} page`}
                groups={navGroups}
              />
            </div>
          )}

          <div className="orgd__main">
            {bands.map((band, i) => (
              <section
                key={band.id}
                id={band.id}
                className={`orgd__band${i % 2 === 0 ? " orgd__band--tint" : ""}`}
              >
                {band.body}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
