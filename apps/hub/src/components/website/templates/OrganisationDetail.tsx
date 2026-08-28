import Image from "next/image";
import Link from "next/link";
import {
  FactStrip,
  Icon,
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
interface FileCardItem {
  key: string;
  /** Small line above the title — a date, or a file type. */
  meta: string;
  title: string;
  href: string;
  actionLabel: string;
}

function FileGrid({ items }: { items: FileCardItem[] }) {
  return (
    <ul className="orgd__doclist">
      {items.map((f) => (
        <li key={f.key} className="orgd__doc">
          <p className="orgd__doc-date">{f.meta}</p>
          <h3 className="orgd__doc-title">{f.title}</h3>
          <a
            className="orgd__doc-action"
            href={f.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {f.actionLabel}
            <Icon name="open_in_new" size={16} />
            {/* Say where it goes rather than letting a new tab open unannounced
                (GIGW 5.2 on external links). */}
            <span className="sr-only"> (opens on dosje.gov.in in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const documentCards = (items: FileRecord[]): FileCardItem[] =>
  items.map((d) => ({
    key: d.slug,
    meta: formatDate(d.date),
    title: d.title,
    href: d.fileUrl ?? d.sourceUrl,
    actionLabel: "View document",
  }));

/** What a download's card says it is, and what its button offers to do. */
const DOWNLOAD_KIND: Record<OrgDownload["kind"], { meta: string; action: string }> = {
  pdf: { meta: "PDF", action: "Download PDF" },
  pptx: { meta: "Presentation (PPTX)", action: "Download presentation" },
  // Not a file. Offering to "download" a web page would be a lie the reader
  // only discovers after clicking.
  page: { meta: "Web page", action: "View page" },
};

const downloadCards = (items: OrgDownload[]): FileCardItem[] =>
  items.map((f) => ({
    key: f.href,
    meta: DOWNLOAD_KIND[f.kind].meta,
    title: f.label,
    href: f.href,
    actionLabel: DOWNLOAD_KIND[f.kind].action,
  }));

export function OrganisationDetail({
  org,
  detail,
  relatedPages,
  documents,
  children,
}: OrganisationDetailProps) {
  const circulars = matchDocuments(documents, detail?.circulars, 4);
  const resources = matchDocuments(documents, detail?.resources, 4);

  // Without a hand-authored index, fall back to the child pages the scrape
  // found. A page with neither is a single column, which is the right answer
  // for a page with one section.
  const navGroups =
    detail?.nav ??
    (relatedPages.length > 1
      ? [
          {
            label: "In this organisation",
            items: relatedPages
              .filter((p) => p.slug !== org.slug)
              .map((p) => ({ label: p.title, href: orgHref(p.slug) })),
          },
        ]
      : []);

  const hasRail = navGroups.length > 0;

  const bands: { id: string; body: React.ReactNode }[] = [];

  bands.push({
    id: "about-the-scheme",
    body: (
      <>
        <SectionTitle as={2} title={detail?.aboutHeading ?? "About"} headingId="about-heading">
          {detail?.aboutAction != null && (
            <Link
              href={detail.aboutAction.href}
              className={buttonClasses("primary", "outlined", "sm")}
            >
              {detail.aboutAction.label}
            </Link>
          )}
        </SectionTitle>
        {detail?.aboutHtml != null ? (
          <div
            className="gov-prose orgd__prose"
            dangerouslySetInnerHTML={{ __html: detail.aboutHtml }}
          />
        ) : org.sections.length === 0 ? (
          <p className="orgd__empty">
            This page is being prepared. In the meantime the source page is available on{" "}
            <a href={org.sourceUrl} target="_blank" rel="noreferrer noopener">
              dosje.gov.in
            </a>
            .
          </p>
        ) : (
          org.sections.map((s, i) => (
            <div
              key={s.heading ?? i}
              className="gov-prose orgd__prose"
              dangerouslySetInnerHTML={{
                __html: withAssetBasePath(trimRedundantOpening(s.html)),
              }}
            />
          ))
        )}
      </>
    ),
  });

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
          />
          <ul className="orgd__cards">
            {detail.components.items.map((c) => (
              <li key={c.slug}>
                {/* The whole card is the link. A card with a "Read more" link
                    inside it gives a pointer user a large target and a keyboard
                    user a small one; this gives both the same target. */}
                <Link href={orgHref(c.slug)} className="orgd__card">
                  <span className="orgd__card-icon" aria-hidden="true">
                    <Icon name={c.icon} size={32} />
                  </span>
                  <span className="orgd__card-title">{c.title}</span>
                  <span className="orgd__card-desc">{c.description}</span>
                  <span className="orgd__card-cta">
                    Read more
                    <Icon name="arrow_forward" size={16} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  if (circulars.length > 0) {
    bands.push({
      id: "circulars-notifications",
      body: (
        <>
          <SectionTitle as={2} title="Circulars & Notifications" headingId="circulars-heading">
            <Link
              href={detail!.circulars!.viewAllHref}
              className={buttonClasses("primary", "outlined", "sm")}
            >
              View all
            </Link>
          </SectionTitle>
          <FileGrid items={documentCards(circulars)} />
        </>
      ),
    });
  }

  if (resources.length > 0) {
    bands.push({
      id: "resources",
      body: (
        <>
          <SectionTitle as={2} title="Resources" headingId="resources-heading">
            <Link
              href={detail!.resources!.viewAllHref}
              className={buttonClasses("primary", "outlined", "sm")}
            >
              View all
            </Link>
          </SectionTitle>
          <FileGrid items={documentCards(resources)} />
        </>
      ),
    });
  }

  if (detail?.downloads != null) {
    const downloads = detail.downloads;
    bands.push({
      id: "downloads",
      body: (
        <>
          <SectionTitle
            as={2}
            title={downloads.heading}
            description={downloads.description}
            headingId="downloads-heading"
          />
          {/* Two labelled groups inside one band rather than two bands: these
              are one kind of thing — files published for the scheme — split by
              which scheme published them. The group ids are what the page index
              links to, which is why they sit on the group and not the band. */}
          {downloads.groups.map((g) => (
            <div className="orgd__dlgroup" key={g.id} id={g.id}>
              <h3 className="orgd__subhead">{g.heading}</h3>
              <FileGrid items={downloadCards(g.items)} />
            </div>
          ))}
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
            <Link href="/website/gallery" className={buttonClasses("primary", "outlined", "sm")}>
              View all photos
            </Link>
          </SectionTitle>
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

  if (detail?.contact != null) {
    const contact = detail.contact;
    bands.push({
      id: "contact",
      body: (
        <>
          <SectionTitle as={2} title={contact.heading} headingId="contact-heading" />
          <div className="orgd__contact">
            <div className="orgd__support">
              <h3 className="orgd__subhead">Technical support</h3>
              {contact.supportPhone != null && (
                <p className="orgd__support-row">
                  <span className="orgd__support-icon" aria-hidden="true">
                    <Icon name="call" size={20} />
                  </span>
                  <span>
                    <a href={`tel:${contact.supportPhone.replace(/[^+\d]/g, "")}`}>
                      {contact.supportPhone}
                    </a>
                    {contact.supportHours != null && (
                      <span className="orgd__support-note">{contact.supportHours}</span>
                    )}
                  </span>
                </p>
              )}
              {contact.supportEmail != null && (
                <p className="orgd__support-row">
                  <span className="orgd__support-icon" aria-hidden="true">
                    <Icon name="mail" size={20} />
                  </span>
                  {/* Addresses are published obfuscated on the source site and
                      stay that way — de-obfuscating them here would publish a
                      harvestable government mailbox. */}
                  <span>{contact.supportEmail}</span>
                </p>
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
                            {p.email ?? (
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
