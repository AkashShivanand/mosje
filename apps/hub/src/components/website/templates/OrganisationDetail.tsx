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
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { trimRedundantOpening } from "@/lib/website/organisation-prose";
import { OrganisationIndex } from "./OrganisationIndex";
import { OrganisationDocumentTabs } from "../OrganisationDocumentTabs";
import { OrganisationMessages } from "../OrganisationMessages";
import { OrganisationUpdates } from "../OrganisationUpdates";
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
 * NEAR-DUPLICATES OUT OF THE NOTICE STRIP.
 *
 * The ingest carries several notices whose titles differ only in a trailing
 * clause — three separate "Portal is open for seeking applications from eligible
 * NGOs for release of 1st instalment of GIA for running of…" rows, all dated
 * 01 Apr 2026. In a document SHELF that is fine: a reader scanning a grid can
 * see the difference and pick. In a strip that shows one headline at a time it
 * reads as the same notice cycling past three times, and the reader concludes
 * the strip is broken.
 *
 * Compared on the first eighty characters, case- and punctuation-insensitively.
 * The first eighty is enough to separate genuinely different notices — the
 * shortest real title here is 42 — and short enough to catch the ones that
 * diverge only at the end. The FIRST of a set survives, and the list is already
 * sorted newest-first, so what survives is the most recent of the duplicates.
 *
 * It over-matches the day two real notices share an eighty-character opening.
 * The strip is a route into the document index, not the index itself, so losing
 * one of a pair there costs a reader a click; showing the same headline three
 * times costs them their trust in the strip.
 */
function dedupeByTitle(docs: FileRecord[]): FileRecord[] {
  const seen = new Set<string>();
  return docs.filter((d) => {
    const key = d.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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

/**
 * The source site's "at a glance" strip, lifted out of the ingested prose.
 *
 * EVERY organisation page on dosje.gov.in opens with one, and the ingest
 * captures it as `<h4>value</h4><div>label</div>` repeated — the same shape on
 * all seventeen pages that have one. Rendered as prose that is a blue number, a
 * paragraph, a blue number, a paragraph, running down the page: NMBA's eight
 * counters took 750px doing the work of one strip, and thirteen other pages
 * printed their founding year and headquarters a second time in prose, directly
 * below the hero strip already showing them.
 *
 * So it is extracted here and rendered through `FactStrip`, which is what a
 * value with a label is for.
 *
 * THE VALUE AND THE LABEL SWAP ROUND ON SOME PAGES. Most write
 * `<h4>2020</h4><div>Established</div>`; SMILE writes
 * `<h4>Launched On</h4><div>12 February 2022</div>` and the national helpline
 * writes `<h4>Helpline</h4><div>14566</div>`. Taking the h4 as the value
 * regardless would have published "Launched On" as a figure captioned
 * "12 February 2022". Where only one of the pair contains a digit, that one is
 * the value.
 */
const GLANCE_ICONS: [RegExp, string][] = [
  [/establish|launch|since|inception/i, "event"],
  [/headquarter|location|address/i, "location_on"],
  [/regional office|across india|branch/i, "hub"],
  [/report/i, "description"],
  [/publication|book/i, "menu_book"],
  [/helpline|phone|contact/i, "call"],
  [/certificate|identity|card/i, "badge"],
  [/district/i, "location_city"],
  [/state/i, "map"],
  [/beneficiar|reached|people|survey|identified/i, "groups"],
  [/rehabilit|treated/i, "volunteer_activism"],
  [/centre|center|facility|facilities/i, "local_hospital"],
  [/pledge/i, "front_hand"],
];

function glanceIcon(label: string): string {
  for (const [re, icon] of GLANCE_ICONS) if (re.test(label)) return icon;
  return "info";
}

const stripTags = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export function extractGlanceStrip(html: string): {
  html: string;
  facts: { icon: string; value: string; label: string }[];
} {
  const facts: { icon: string; value: string; label: string }[] = [];
  const cleaned = html.replace(
    /<h4[^>]*>([\s\S]*?)<\/h4>\s*<div[^>]*>([\s\S]*?)<\/div>/gi,
    (match, rawA: string, rawB: string) => {
      let value = stripTags(rawA);
      let label = stripTags(rawB);
      // A label is a short caption. Anything longer is a paragraph that happens
      // to follow a heading, and lifting it into a strip would destroy it.
      if (!value || !label || label.length > 60 || value.length > 60) return match;
      if (/\d/.test(label) && !/\d/.test(value)) [value, label] = [label, value];
      facts.push({ icon: glanceIcon(label), value, label });
      return "";
    },
  );
  return { html: cleaned, facts };
}

/** Compares two fact labels for "the page already says this". */
const sameFact = (a: string, b: string) =>
  a.toLowerCase().replace(/[^a-z0-9]/g, "") === b.toLowerCase().replace(/[^a-z0-9]/g, "");

export function formatOrgHtml(rawHtml: string, innerHeadingLevel: 3 | 4 = 4): string {
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
  /*
   * AN ANCHOR WITH NOTHING INSIDE IT IS NOT A LINK EITHER.
   *
   * Where the source embeds a tweet, the ingest keeps the anchor and loses the
   * card it wrapped, leaving `<a href="twitter.com/…"></a>` — zero-sized, so
   * invisible to a sighted reader, and announced to a screen reader as a link
   * with no name. axe reports it as `link-name`; it is on the transgender
   * portal today and arrives on any page whose source embeds a post.
   *
   * Anchors holding an image are left alone: the image carries the name.
   */
  html = html.replace(
    /<a\b[^>]*>((?:(?!<img)[\s\S])*?)<\/a>/gi,
    (match, inner: string) => (stripTags(inner) === "" ? "" : match),
  );
  /*
   * INNER HEADINGS SIT ONE LEVEL UNDER THE SECTION THEY ARE IN.
   *
   * The source marks card titles inside a section as `h5` or `h6` — DAIC's
   * VISION and MISSION are h5, its gallery captions h6 — and the ingest keeps
   * them. The section heading around them renders as `h3`, so the outline ran
   * h3 → h5 and h3 → h6: a skipped level on nine organisation pages, which
   * WCAG 2.2 and GIGW both take seriously on a government site.
   *
   * They are flattened rather than mapped level-for-level because within one
   * ingested section they are siblings, not a hierarchy — a set of card titles,
   * or a pair of headings like VISION and MISSION. Preserving a nesting the
   * source does not actually express would invent structure.
   *
   * THE TARGET LEVEL DEPENDS ON WHETHER THE SECTION HAS A HEADING. With one,
   * the section renders an h3 and its contents are h4. Without one — DAIC's
   * opening section is untitled — the contents sit directly under the band's
   * own h2, and h4 there is the same skipped level in a new place.
   */
  html = html
    .replace(/<h[56]([^>]*)>/gi, `<h${innerHeadingLevel}$1>`)
    .replace(/<\/h[56]>/gi, `</h${innerHeadingLevel}>`);
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

/**
 * The contact band — address, support details and the officer tables.
 *
 * EXTRACTED SO TWO SURFACES CAN SHARE IT. The organisation page renders it as
 * one of its bands; an organisation's `/contact-us` child page, when the ingest
 * returned that page empty, renders the same block from the same record. Before
 * this it lived inline in the band list, so the only way to put contact details
 * on the child page would have been a second copy of this markup — which is how
 * two renderings of the same thing drift a card's padding apart.
 */
export function OrganisationContactBand({
  contact,
  orgSlug,
}: {
  contact: NonNullable<OrgDetail["contact"]>;
  orgSlug: string;
}) {
  const contactAction = contact.action ?? {
    label: "View Directory",
    href: `/website/directory?org=${orgSlug}`,
  };
  return (
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
                {/* The Department's own label for the block. NMBA's source
                    calls it "Postal Address"; most call it Headquarters. */}
                <span>{contact.addressLabel ?? "Headquarters"}</span>
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
              {/* A link, like the telephone in the card beside it. This was the
                  one published address on the page a reader had to select and
                  copy by hand. */}
              <p className="text-body-2 text-ink m-0">
                <a href={`mailto:${contact.supportEmail}`} className="text-link hover:underline">
                  {contact.supportEmail}
                </a>
              </p>
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
  );
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
  /*
   * The organisation's own notice board, matched the same way the two document
   * bands are — see `whatsNew` in `organisation-details.ts`. It resolves from
   * the ingest, so a re-crawl refreshes the strip and nobody re-types a notice.
   */
  const whatsNew = dedupeByTitle(
    matchDocuments(documents, detail?.whatsNew, (detail?.whatsNew?.limit ?? 6) * 3),
  ).slice(0, detail?.whatsNew?.limit ?? 6);

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
  const keptSections = org.sections.filter(
    (s) => s.heading == null || !hidden.has(slugify(s.heading)),
  );

  /*
   * The source's "at a glance" pairs come OUT of the prose before it renders,
   * and the prose renders without them — see `extractGlanceStrip`.
   */
  const glanceFacts: { icon: string; value: string; label: string }[] = [];
  const visibleSections = keptSections.map((s) => {
    const { html, facts } = extractGlanceStrip(s.html);
    glanceFacts.push(...facts);
    return { ...s, html };
  });

  /*
   * Only the ones the hero strip is not already showing. On thirteen of the
   * seventeen pages that carry this strip the ingested pairs ARE the curated
   * facts — "1994 / Established", "New Delhi / Headquarters" — so publishing
   * both puts the same two facts on the page twice, a hundred pixels apart.
   * What is left is what the curator did not have room for: NCSC's report
   * count, the transgender portal's certificates issued, SMILE's survey
   * figures.
   */
  const curatedLabels = (detail?.facts ?? []).map((f) => f.label);
  const newGlanceFacts = glanceFacts.filter(
    (g) => !curatedLabels.some((c) => sameFact(c, g.label)),
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

  /*
   * THE FIGURES COME BEFORE THE PROSE, because that is where the source puts
   * them: the counters sit directly under the page title, above "About the
   * Abhiyaan". They were rendering after the whole about band — the prose and
   * the six institution cards — which put the campaign's headline numbers a
   * screen and a half further down than the page they are cloned from.
   */
  /*
   * The organisation's own published figures, as one strip.
   *
   * `FactStrip` without `overlap` — the overlapping treatment belongs to the
   * card that straddles the hero, and a second one mid-page would look like a
   * second hero. The `asOf` line sits under the heading because a counter with
   * no date on a government page reads as today's number.
   */
  if (detail?.impact != null && detail.impact.items.length > 0) {
    const im = detail.impact;
    bands.push({
      id: "impact",
      body: (
        <>
          <SectionTitle
            as={2}
            title={im.heading}
            description={`As published by the Department on ${im.asOf}.`}
            headingId="impact-heading"
          />
          <FactStrip ariaLabel={`${org.title} in numbers`} items={im.items} />
        </>
      ),
    });
  }

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
                    __html: formatOrgHtml(s.html, showHeading ? 4 : 3),
                  }}
                />
              </section>
            );
          })
        )}
        {detail?.aboutHighlights != null && detail.aboutHighlights.length > 0 && (
          <>
            {detail.aboutHighlightsHeading != null && (
              <h3
                id={slugify(detail.aboutHighlightsHeading)}
                className="orgd__ingested-heading orgd__highlights-heading"
              >
                {detail.aboutHighlightsHeading}
              </h3>
            )}
          <ul className="orgd__highlights">
            {detail.aboutHighlights.map((h) => (
              <li key={h.title} className="orgd__highlight-card">
                <span className="orgd__card-icon">
                  <Icon name={h.icon ?? "verified"} size={32} />
                </span>
                {/*
                  * h4 when the set has its own h3 heading above it, h3 when it
                  * does not — the cards are CHILDREN of that heading, and two
                  * h3s where one contains the others describes a flat page that
                  * isn't flat.
                  */}
                {detail.aboutHighlightsHeading != null ? (
                  <h4 className="orgd__card-title">{h.title}</h4>
                ) : (
                  <h3 className="orgd__card-title">{h.title}</h3>
                )}
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
          </>
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
  /*
   * What the ingested strip had that the hero strip does not.
   *
   * Suppressed entirely when the record declares its own `impact` — NMBA
   * authors those eight counters deliberately, with the date they were read,
   * and a second automatic strip of the same figures beside it would be the
   * duplication this extraction exists to remove.
   */
  if (detail?.impact == null && newGlanceFacts.length > 0) {
    bands.push({
      id: "at-a-glance",
      body: (
        <>
          <SectionTitle as={2} title="At a Glance" headingId="at-a-glance-heading" />
          <FactStrip ariaLabel={`${org.title} at a glance`} items={newGlanceFacts} />
        </>
      ),
    });
  }


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
      g.items.map((f) => {
        const href = localiseDocumentUrl(f.href, f.label, g.heading);
        return {
          id: `download-${f.href}-${f.label}`,
          group: f.group ?? "Formats",
          meta: f.meta ?? DOWNLOAD_KIND[f.kind].meta,
          title: f.label,
          officialName: f.officialName,
          href,
          actionLabel: DOWNLOAD_KIND[f.kind].action,
          external: isHttp(href),
        };
      }),
    ),
  ];

  /*
   * ONE DOCUMENTS SECTION, ALWAYS — AND WHY THE SECOND LAYOUT IS GONE.
   *
   * A `layout: "sections"` mode used to exist for records whose source publishes
   * several separately titled document sections. NMBA was its only user, and it
   * pushed SIX top-level headings onto the page — IEC Materials, Publications,
   * Newsletter, Downloads, Circulars, Citizen Corner — each its own band with its
   * own "View All".
   *
   * It was removed because it broke the contract the side rail depends on. The
   * rail is a list of the page's sections; NMBA's rail offered one entry,
   * "Documents & Downloads", pointing at `#documents-downloads` — an id that this
   * branch never rendered, because in that mode there is no such section. So the
   * one link in the rail that covered a third of the page went nowhere, and the
   * six sections it stood for appeared in the rail not at all.
   *
   * The shelf keeps the publisher's arrangement as CHIPS rather than as headings,
   * which is this component's whole argument (see `DocumentLibrary`): the
   * categories survive, the six consecutive grids of identical cards do not. What
   * the sections mode had over it — a per-category "View All" — is now kept by
   * `groupViewAll`, which is strictly better than what it replaced: the link
   * follows the selected chip instead of being fixed to one category.
   */
  if (detail?.downloads?.layout === "tabs") {
    /*
     * ONE BAND, THE DEPARTMENT'S OWN SHELVES AS ITS TABS.
     *
     * It carries `documents-downloads` — the id the page index has always linked
     * to and which `layout: "sections"` never produced, so that entry in the
     * NMBA rail had been scrolling nowhere. See `OrganisationDocumentTabs`.
     */
    const lib = detail.downloads;
    const shelves = lib.groups
      .filter((g) => g.items.length > 0)
      .map((g) => ({
        id: g.id,
        heading: g.heading,
        viewAllHref: g.viewAllHref,
        items: g.items.map((f) => {
          /*
           * A DOCUMENT RESOLVES TO A LOCAL SAMPLE; AN IMAGE DOES NOT.
           *
           * The record's four campaign assets — the mark, the mascot and the two
           * QR codes — are real files this estate already serves, and they were
           * never the problem. Its eleven PDFs pointed at the Department's CDN.
           * `localiseDocumentUrl` tells the two apart by the URL, and `external`
           * is recomputed from the RESULT rather than the input: a localised
           * file must not keep opening in a new tab and announcing itself as
           * leaving the site, because it no longer does.
           */
          const href = localiseDocumentUrl(f.href, f.label, g.heading);
          return {
            id: `download-${f.href}-${f.label}`,
            group: g.heading,
            meta: f.meta ?? DOWNLOAD_KIND[f.kind].meta,
            title: f.label,
            officialName: f.officialName,
            href,
            actionLabel: DOWNLOAD_KIND[f.kind].action,
            external: isHttp(href),
          };
        }),
      }));

    if (shelves.length > 0) {
      bands.push({
        id: "documents-downloads",
        body: (
          <>
            <SectionTitle
              as={2}
              title={lib.heading}
              description={lib.description}
              headingId="documents-downloads-heading"
            />
            <OrganisationDocumentTabs
              groups={shelves}
              ariaLabel={`${org.title} document types`}
            />
          </>
        ),
      });
    }
  } else if (libraryItems.length > 0) {
    const lib = detail?.downloads;

    /*
     * Each group's own listing on the Department's site, keyed by the group name
     * so it lines up with the chip. Built from the same `groups` the items came
     * from, so a group that gains a listing gains the link with no further
     * wiring.
     */
    const groupViewAll: Record<string, React.ReactNode> = {};
    for (const g of lib?.groups ?? []) {
      if (g.viewAllHref == null) continue;
      const label = g.items[0]?.group ?? g.heading;
      groupViewAll[label] = (
        <a
          href={g.viewAllHref}
          target={isHttp(g.viewAllHref) ? "_blank" : undefined}
          rel={isHttp(g.viewAllHref) ? "noreferrer" : undefined}
          className={buttonClasses("primary", "outlined", "sm")}
        >
          {/* The heading's OWN case. Lower-casing it turned "IEC Materials" into
              "iec materials", and the estate sets titles in Title Case anyway. */}
          {`View all ${g.heading}`}
          {isHttp(g.viewAllHref) && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      );
    }

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
            /* The record's own order where it has one — a publisher that leads
               with IEC material should not have its chips reordered to put
               Circulars first because that is the estate's default. */
            groupOrder={lib?.groupOrder ?? LIBRARY_GROUP_ORDER}
            groupViewAll={groupViewAll}
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
          {/*
            * THE THREE MEDIA TABS ARE GONE, and they were never tabs.
            *
            * They were three `<button>`s with no handler, no `role="tab"`, no
            * panel and no `aria-selected` — drawn from Figma 5326:27984 and
            * never wired. Two of them named content this estate does not hold:
            * `gallery` carries photographs only, so pressing "Videos" or
            * "Events" did nothing at all, on every organisation page with a
            * gallery. A control that points at a panel that is not there is the
            * defect `.claude/rules/data-state-completeness.md` and the tab
            * purity audit both name; the honest form of "we publish photographs"
            * is a heading that says Gallery and photographs under it.
            *
            * They come back the day the record can hold a video or an event —
            * as real `Tabs`, with panels.
            */}
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
          {/*
            * FOUR OR MORE STATEMENTS BECOME A CAROUSEL; three or fewer stay a
            * grid, because three cards are already one row and a carousel would
            * hide two of them behind an interaction to save nothing.
            */}
          {ms.items.length > 3 ? (
            <OrganisationMessages items={ms.items} label={`Messages about ${org.title}`} />
          ) : (
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
          )}
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
                  {post.href != null && (
                    <p className="mt-auto pt-3">
                      <Link href={post.href} external variant="standalone">
                        {post.linkLabel ?? "View post"}
                      </Link>
                    </p>
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
    bands.push({
      id: "contact",
      body: <OrganisationContactBand contact={detail.contact} orgSlug={org.slug} />,
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

      {/*
       * TWO STRIPS BETWEEN THE HEADER AND THE PAGE'S DATA, in that order, and
       * the order is the argument.
       *
       * The notice board is PERMANENT and the occasion is TEMPORARY, so the
       * board sits first: a reader who learns where this page keeps its notices
       * finds them in the same place in six weeks' time, when the anniversary
       * strip has been taken down. The same reasoning
       * `floating-element-placement.md` uses for the corner stack — what moves
       * least anchors the position.
       *
       * NEITHER GOES INSIDE THE HEADER. The 07 Sep review's other finding was
       * that this page's first fold already carries a campaign band, a hero and
       * a fact strip; adding to it would have answered one request by worsening
       * another. Below the fact strip they are the first thing a reader meets
       * on the page's own ground, which is where the review asked for the
       * ribbon — "between the blue section and the data section".
       */}
      {whatsNew.length > 0 && (
        <div className="orgd__updates">
          <div className="sa-container">
            <OrganisationUpdates
              items={whatsNew.map((d) => ({
                id: d.slug,
                title: d.title,
                description: d.category,
                date: formatDate(d.date),
                dateTime: d.date,
                href: d.fileUrl ?? d.sourceUrl,
              }))}
              label={detail?.whatsNew?.label ?? "What's New"}
              viewAllHref={detail?.whatsNew?.viewAllHref ?? "/website/notices"}
            />
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
