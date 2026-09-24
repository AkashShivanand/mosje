import Image from "next/image";
import NextLink from "next/link";
import { BrandGlyph, Icon, SectionTitle } from "@mosje/design-system";
import type { SectionRecord, FileRecord } from "@/types/website/content";
import type {
  OrganisationDetail as OrgDetail,
  OrgDownloadItem,
} from "@/content/website/organisation-details";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { PageHeaderProps } from "@/components/website-next/layout/PageHeader";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import {
  OrganisationDocuments,
  type OrgDocument,
  type OrgDocumentGroup,
} from "./OrganisationDocuments";
import {
  actionLabel,
  balancedColumns,
  cleanHtml,
  extractGlance,
  extractImages,
  extractSocial,
  extractUpdates,
  formatFigure,
  isExternal,
  kindOf,
  platformName,
  sameLabel,
  sizeOf,
  slugify,
  stripTags,
  tidyTitle,
  titleCaseLabel,
  typeOfHref,
  withoutNarration,
  type FaqGroup,
  type GlanceFact,
  type SocialProfile,
  type UpdateItem,
} from "./organisation-content";
import "./organisation.css";

/*
 * THE ORGANISATION PAGE OF THE REDESIGN (issues LAY-14, NAV-07, NAV-08, LAY-13,
 * BRD-12, BRD-19, BRD-20).
 *
 * One template for every organisation. The page is the shared chrome and the
 * shared page header (breadcrumb, the whole mark, the full name as the h1, one
 * line, one primary action), then an "On This Page" row, then the sections below
 * in ONE FIXED ORDER. An organisation omits a section it has nothing for; it never
 * reorders them, and the grounds alternate base / subtlest by position, so every
 * organisation reads the same way down the page (BRD-20).
 *
 *   about · coverage (a scheme's own map or dashboard) · leadership · components
 *   · initiatives · major activities · documents (one section, tabs) · updates
 *   · gallery · messages · social media (static cards) · more pages · contact
 */

const orgHref = (slug: string) => `/website/organisation/${slug}`;

/**
 * The column cap for a grid of `n` items, as the CSS custom property the grid
 * reads (organisation.css, "Balanced grids"). Stops a row of six ending 4 + 2.
 */
const cols = (n: number, max: number) => ({ "--og-cols": balancedColumns(n, max) }) as React.CSSProperties;

/* ── Small shared parts ────────────────────────────────────────────────────── */

/** A link that may leave the site; says so when it does (ACC-17). */
function SmartLink({
  href,
  className,
  children,
  srSuffix,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  srSuffix?: string;
}) {
  const ext = isExternal(href);
  const body = (
    <>
      {children}
      {srSuffix && <span className="sr-only">{srSuffix}</span>}
      {ext && (
        <>
          <Icon name="open_in_new" size={16} aria-hidden />
          <span className="sr-only"> (opens in a new window)</span>
        </>
      )}
    </>
  );
  return ext || href.startsWith("tel:") || href.startsWith("mailto:") ? (
    <a href={href} className={className} target={ext ? "_blank" : undefined} rel={ext ? "noopener noreferrer" : undefined}>
      {body}
    </a>
  ) : (
    <NextLink href={href} className={className}>
      {body}
    </NextLink>
  );
}

/** A quiet section action beside a SectionTitle. */
function SectionAction({ href, label, context }: { href: string; label: string; context: string }) {
  return (
    <SmartLink href={href} className="og-link" srSuffix={`: ${context}`}>
      {actionLabel(label)}
      {!isExternal(href) && <Icon name="arrow_forward" size={16} aria-hidden />}
    </SmartLink>
  );
}

const telHref = (phone: string) => `tel:${phone.split(/[,/]/)[0]!.replace(/[^+\d]/g, "")}`;

/** Label / value pairs, as a definition list. */
function Glance({ title, facts, note }: { title: string; facts: GlanceFact[]; note?: string }) {
  if (facts.length === 0) return null;
  return (
    <div className="wn-panel og-glance">
      <h3 className="wn-panel__title">{title}</h3>
      <dl className="og-glance__list">
        {facts.map((f) => (
          <div key={f.label} className="og-glance__row">
            <dt>{f.label}</dt>
            <dd>{formatFigure(f.value)}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="og-glance__note">{note}</p>}
    </div>
  );
}

/* ── Contact ───────────────────────────────────────────────────────────────── */

/**
 * Address, telephone (tap to call), the published role mailbox, and the officer
 * tables. Shared by the organisation page's Contact section and by a child
 * contact page the ingest returned empty, so the two can never drift.
 */
export function OrganisationContact({
  contact,
  directoryHref,
  headingLevel = 2,
}: {
  contact: NonNullable<OrgDetail["contact"]>;
  directoryHref?: string;
  headingLevel?: 2 | 3;
}) {
  const action = contact.action ?? (directoryHref ? { label: "View Directory", href: directoryHref } : undefined);
  const H = headingLevel === 2 ? "h3" : "h4";
  const cards: { icon: string; title: string; body: React.ReactNode }[] = [];
  if (contact.address) {
    cards.push({ icon: "location_on", title: contact.addressLabel ?? "Headquarters", body: <address>{contact.address}</address> });
  }
  if (contact.supportPhone) {
    cards.push({
      icon: "call",
      title: "Telephone",
      body: (
        <>
          <a href={telHref(contact.supportPhone)} className="og-contact__link">
            {contact.supportPhone}
          </a>
          {contact.supportHours && <span className="og-contact__note">{contact.supportHours}</span>}
        </>
      ),
    });
  }
  if (contact.supportEmail) {
    cards.push({
      icon: "mail",
      title: "Email",
      body: (
        <a href={`mailto:${contact.supportEmail}`} className="og-contact__link">
          {contact.supportEmail}
        </a>
      ),
    });
  }
  if (contact.regionalOffices) {
    cards.push({ icon: "domain", title: "State and Regional Offices", body: <p>{contact.regionalOffices}</p> });
  }
  return (
    <>
      <SectionTitle as={headingLevel} title={tidyTitle(contact.heading)} headingId="contact-title">
        {action && <SectionAction href={action.href} label={action.label} context={tidyTitle(contact.heading)} />}
      </SectionTitle>
      {cards.length > 0 && (
        <ul className="og-contact og-grid" style={cols(cards.length, 4)}>
          {cards.map((c) => (
            <li key={c.title} className="og-contact__card">
              <span className="og-contact__icon" aria-hidden="true">
                <Icon name={c.icon} size={24} />
              </span>
              <div>
                <H className="og-contact__title">{c.title}</H>
                <div className="og-contact__body">{c.body}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {contact.blocks?.map((block) => (
        <div key={block.heading} className="og-people">
          <H className="og-subhead">{block.heading}</H>
          <div className="og-tablewrap" role="region" aria-label={block.heading} tabIndex={0}>
            <table className="og-table">
              <caption className="sr-only">{block.heading}</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Telephone</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                {block.people.map((p) => (
                  <tr key={p.name}>
                    <th scope="row">{p.name}</th>
                    <td>{p.designation}</td>
                    <td>{p.phone ? <a href={telHref(p.phone)}>{p.phone}</a> : <span aria-label="Not published">–</span>}</td>
                    <td>{p.email ? <a href={`mailto:${p.email}`}>{p.email}</a> : <span aria-label="Not published">–</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Documents ─────────────────────────────────────────────────────────────── */

const DOWNLOAD_TYPE: Record<OrgDownloadItem["kind"], string> = {
  pdf: "PDF",
  pptx: "Presentation",
  image: "Image",
  page: "Web page",
};

/** Tab order where the record declares none: the document others assume first. */
const SHELF_ORDER = ["Guidelines", "Circulars", "Formats", "Presentations", "Manuals & guides", "Reports"];

function matchDocuments(documents: FileRecord[], spec: { category: string; match: string[] } | undefined, limit: number): FileRecord[] {
  if (!spec || spec.match.length === 0) return [];
  const terms = spec.match.map((m) => m.toLowerCase());
  return documents
    .filter((d) => d.category === spec.category)
    .filter((d) => terms.some((t) => d.title.toLowerCase().includes(t)))
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .slice(0, limit);
}

function fileDoc(d: FileRecord, prefix: string): OrgDocument {
  const href = d.fileUrl ?? d.sourceUrl;
  return {
    id: `${prefix}-${d.slug}`,
    title: tidyTitle(d.title),
    href,
    type: d.fileUrl ? "PDF" : typeOfHref(href),
    meta: formatDate(d.date),
    external: isExternal(href),
  };
}

function documentGroups(detail: OrgDetail | undefined, documents: FileRecord[]): OrgDocumentGroup[] {
  const shelves = new Map<string, OrgDocumentGroup>();
  const shelf = (label: string, viewAllHref?: string) => {
    let g = shelves.get(label);
    if (!g) {
      g = { id: slugify(label) || "documents", label, items: [], viewAllHref };
      shelves.set(label, g);
    }
    if (!g.viewAllHref && viewAllHref) g.viewAllHref = viewAllHref;
    return g;
  };
  for (const d of matchDocuments(documents, detail?.circulars, 4)) shelf("Circulars", detail?.circulars?.viewAllHref).items.push(fileDoc(d, "circular"));
  for (const d of matchDocuments(documents, detail?.resources, 4)) shelf("Formats", detail?.resources?.viewAllHref).items.push(fileDoc(d, "resource"));
  const byHeading = detail?.downloads?.layout === "tabs";
  for (const g of detail?.downloads?.groups ?? []) {
    for (const f of g.items) {
      const href = localiseDocumentUrl(f.href, f.label, g.heading);
      const label = tidyTitle(byHeading ? g.heading : (f.group ?? g.heading));
      shelf(label, g.viewAllHref).items.push({
        id: `download-${f.href}-${f.label}`,
        title: tidyTitle(f.label),
        href,
        type: DOWNLOAD_TYPE[f.kind],
        size: sizeOf(f.meta),
        meta: f.meta?.replace(/\s*·?\s*\d+(?:\.\d+)?\s?(?:KB|MB|GB)\s*$/i, "").replace(/^(PNG|PDF)\s*·\s*/i, "") || undefined,
        external: isExternal(href),
      });
    }
  }
  for (const r of detail?.reports?.groups ?? []) {
    const g = shelf(tidyTitle(r.heading));
    for (const p of r.items) {
      g.items.push({
        id: `report-${p.href}-${p.label}`,
        title: tidyTitle(p.label),
        href: p.href,
        type: typeOfHref(p.href),
        external: p.external ?? isExternal(p.href),
      });
    }
  }
  const order = detail?.downloads?.groupOrder ?? (byHeading ? [] : SHELF_ORDER);
  const rank = (label: string) => {
    const i = order.findIndex((o) => sameLabel(o, label));
    return i === -1 ? order.length : i;
  };
  return [...shelves.values()].filter((g) => g.items.length > 0).sort((a, b) => rank(a.label) - rank(b.label));
}

/* ── Updates ───────────────────────────────────────────────────────────────── */

function UpdateList({ items }: { items: UpdateItem[] }) {
  return (
    <ul className="og-updates">
      {items.map((u) => (
        <li key={`${u.href}-${u.title}`} className="og-update">
          {u.date && (
            <time className="og-update__date" dateTime={isoDate(u.date)}>
              {formatDate(u.date)}
            </time>
          )}
          <SmartLink href={u.href} className="og-update__title">
            {u.title}
          </SmartLink>
          {u.kind && <span className="og-update__kind">{u.kind}</span>}
        </li>
      ))}
    </ul>
  );
}

/* ── Cards ─────────────────────────────────────────────────────────────────── */

interface CardItem {
  title: string;
  description?: string;
  href?: string;
  icon?: string;
  image?: string;
}

/**
 * One card shape for components, initiatives, activities and highlights. The
 * title is the one link and its hit area covers the card (LAY-07). A card whose
 * record has no picture has no picture area at all (BRD-19).
 */
function CardGrid({ items, headingLevel }: { items: CardItem[]; headingLevel: 3 | 4 }) {
  const H = headingLevel === 3 ? "h3" : "h4";
  return (
    <ul className="og-cards og-grid" style={cols(items.length, 4)}>
      {items.map((c) => (
        <li key={c.title} className={`og-card${c.href ? " og-card--link" : ""}`}>
          {c.image ? (
            <span className="og-card__media">
              <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 380px, 100vw" />
            </span>
          ) : c.icon ? (
            <span className="og-card__icon" aria-hidden="true">
              <Icon name={c.icon} size={24} />
            </span>
          ) : null}
          <H className="og-card__title">
            {c.href ? (
              <SmartLink href={c.href} className="og-card__link">
                {tidyTitle(c.title)}
              </SmartLink>
            ) : (
              tidyTitle(c.title)
            )}
          </H>
          {c.description && <p className="og-card__desc">{c.description}</p>}
          {c.href && !isExternal(c.href) && (
            <span className="og-card__go" aria-hidden="true">
              View Details
              <Icon name="arrow_forward" size={16} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ── The page ──────────────────────────────────────────────────────────────── */

export interface OrganisationDetailProps {
  header: PageHeaderProps;
  org: SectionRecord;
  detail?: OrgDetail;
  /** The organisation and every page under it, in ingest order. */
  relatedPages: SectionRecord[];
  documents: FileRecord[];
  /** Short name, "NCSC", where known. */
  abbr?: string;
  /** The organisation's telephone directory on this site, where one exists. */
  directoryHref?: string;
  /**
   * A map or dashboard that belongs to one organisation (PM-AJAY's coverage
   * map, NMBA's facilities map), fetched by the route that knows which it is.
   */
  coverage?: { title: string; body: React.ReactNode };
}

interface Band {
  id: string;
  /** The label in the "On This Page" row. */
  nav: string;
  body: React.ReactNode;
}

export function OrganisationDetail({
  header,
  org,
  detail,
  relatedPages,
  documents,
  abbr,
  directoryHref,
  coverage,
}: OrganisationDetailProps) {
  const name = abbr ?? tidyTitle(org.title);

  /* Sort the ingested sections into prose and the widgets they really are. */
  const hidden = new Set((detail?.hideIngestedSections ?? []).map(slugify));
  const ingestedFacts: GlanceFact[] = [];
  const prose: { heading?: string; html: string }[] = [];
  const ingestedUpdates: UpdateItem[] = [];
  const ingestedViewAll: { label: string; href: string }[] = [];
  let ingestedSocial: SocialProfile[] = [];
  const ingestedImages: { src: string; alt: string }[] = [];
  for (const s of org.sections) {
    if (s.heading && hidden.has(slugify(s.heading))) continue;
    const { html, facts } = extractGlance(s.html);
    ingestedFacts.push(...facts);
    const kind = kindOf({ ...s, html });
    if (kind === "updates") {
      const u = extractUpdates(html);
      ingestedUpdates.push(...u.items);
      ingestedViewAll.push(...u.viewAll);
    } else if (kind === "social") {
      if (ingestedSocial.length === 0) ingestedSocial = extractSocial(html);
    } else if (kind === "gallery") {
      ingestedImages.push(...extractImages(html));
    } else if (kind === "prose" && stripTags(html).length > 0) {
      prose.push({ heading: s.heading ?? undefined, html });
    }
  }

  const aboutTitle = tidyTitle(detail?.aboutHeading ?? "About");
  const bands: Band[] = [];

  /* 1 · About */
  {
    const curated = detail?.impact && detail.impact.items.length > 0
      ? detail.impact.items.map((f) => ({ value: f.value, label: f.label }))
      : (detail?.facts ?? []).map((f) => ({ value: f.value, label: f.label }));
    // A record that publishes its own dated counters owns the panel outright; the
    // ingested strip carries the same counters under slightly different labels.
    const facts = detail?.impact
      ? curated
      : [...curated, ...ingestedFacts.filter((g) => !curated.some((c) => sameLabel(c.label, g.label)))];
    const glanceTitle = detail?.impact ? tidyTitle(detail.impact.heading) : "At a Glance";
    const glanceNote = detail?.impact ? `As on ${formatDate(detail.impact.asOf) ?? detail.impact.asOf}` : undefined;
    const join = detail?.joinBanner;
    const bodies = detail?.aboutHtml
      ? [{ heading: undefined, html: detail.aboutHtml }]
      : prose;
    const hasAside = facts.length > 0 || join != null;
    bands.push({
      id: "about",
      nav: "About",
      body: (
        <>
          <SectionTitle as={2} title={aboutTitle} headingId="about-title" />
          <div className={hasAside ? "wn-split og-about" : "og-about"}>
            <div className="min-w-0">
              {bodies.length === 0 ? (
                <p className="og-empty">
                  The Department has not yet published a description of this organisation on this site. The source page
                  is on{" "}
                  <a href={org.sourceUrl} target="_blank" rel="noopener noreferrer" className="og-inline-link">
                    dosje.gov.in<span className="sr-only"> (opens in a new window)</span>
                  </a>
                  .
                </p>
              ) : (
                <div className="wn-prose og-prose">
                  {bodies.map((b, i) => {
                    const showHeading =
                      b.heading != null && !sameLabel(b.heading, org.title) && !sameLabel(b.heading, aboutTitle);
                    return (
                      <div key={b.heading ?? i} className="og-prose__part">
                        {showHeading && <h3 id={`about-${slugify(b.heading!)}`}>{tidyTitle(b.heading!)}</h3>}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: cleanHtml(b.html, { headingLevel: 3, label: tidyTitle(b.heading ?? aboutTitle) }),
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {detail?.aboutAction && (
                <p className="og-more">
                  <SectionAction href={detail.aboutAction.href} label={detail.aboutAction.label} context={aboutTitle} />
                </p>
              )}
            </div>
            {hasAside && (
              <aside className="wn-aside" aria-label={`${name} at a glance`}>
                <Glance title={glanceTitle} facts={facts} note={glanceNote} />
                {join && (
                  <div className="wn-panel og-join">
                    <h3 className="wn-panel__title">{tidyTitle(join.heading)}</h3>
                    <p className="og-join__text">{join.text}</p>
                    <p>
                      <SmartLink href={join.action.href} className="og-link">
                        {tidyTitle(join.action.shortLabel ?? join.action.label)}
                      </SmartLink>
                    </p>
                    <p className="og-join__helpline">
                      <span>{join.helplineLabel}</span>
                      <a href={telHref(join.helplineNumber)} className="og-join__tel">
                        <Icon name="call" size={20} aria-hidden />
                        {join.helplineNumber}
                      </a>
                    </p>
                  </div>
                )}
              </aside>
            )}
          </div>
          {detail?.aboutHighlights && detail.aboutHighlights.length > 0 && (
            <div className="og-highlights">
              {detail.aboutHighlightsHeading && <h3 className="og-subhead">{tidyTitle(detail.aboutHighlightsHeading)}</h3>}
              <CardGrid
                headingLevel={detail.aboutHighlightsHeading ? 4 : 3}
                items={detail.aboutHighlights.map((h) => ({ title: h.title, description: h.description, icon: h.icon ?? "verified", href: h.href }))}
              />
            </div>
          )}
        </>
      ),
    });
  }

  /* 2 · Coverage (one organisation's own map or dashboard) */
  if (coverage) bands.push({ id: "coverage", nav: coverage.title, body: coverage.body });

  /* 3 · Leadership */
  if (detail?.leadership && detail.leadership.items.length > 0) {
    const l = detail.leadership;
    bands.push({
      id: "leadership",
      nav: "Leadership",
      body: (
        <>
          <SectionTitle as={2} title={tidyTitle(l.heading)} description={withoutNarration(l.description)} headingId="leadership-title">
            {l.action && <SectionAction href={l.action.href} label={l.action.label} context={tidyTitle(l.heading)} />}
          </SectionTitle>
          <ul className="og-leaders">
            {l.items.map((m) => (
              <li key={m.name} className="og-leader">
                <span className="og-leader__photo">
                  {m.image ? (
                    <Image src={m.image} alt={`${m.name}, ${m.designation}`} fill sizes="200px" />
                  ) : (
                    <span className="og-leader__placeholder" aria-hidden="true">
                      <Icon name="person" size={48} />
                    </span>
                  )}
                </span>
                <h3 className="og-leader__name">{m.name}</h3>
                <p className="og-leader__role">{m.designation}</p>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  /* 4–6 · Components, initiatives, major activities: one card shape. */
  const cardBand = (
    id: string,
    s: { heading: string; description?: string; action?: { label: string; href: string } } | undefined,
    items: CardItem[],
  ) => {
    if (!s || items.length === 0) return;
    const title = tidyTitle(s.heading);
    bands.push({
      id,
      nav: title,
      body: (
        <>
          <SectionTitle as={2} title={title} description={withoutNarration(s.description)} headingId={`${id}-title`}>
            {s.action && <SectionAction href={s.action.href} label={s.action.label} context={title} />}
          </SectionTitle>
          <CardGrid headingLevel={3} items={items} />
        </>
      ),
    });
  };
  cardBand(
    "components",
    detail?.components,
    (detail?.components?.items ?? []).map((c) => ({ title: c.title, description: c.description, icon: c.icon, href: orgHref(c.slug) })),
  );
  cardBand(
    "initiatives",
    detail?.initiatives,
    (detail?.initiatives?.items ?? []).map((c) => ({
      title: c.title,
      description: c.description,
      image: c.image,
      icon: c.image ? undefined : c.icon,
      href: c.href ?? (c.slug ? orgHref(c.slug) : undefined),
    })),
  );
  cardBand(
    "activities",
    detail?.majorActivities,
    (detail?.majorActivities?.items ?? []).map((a) => ({ title: a.title, icon: a.icon ?? "task_alt", image: a.image, href: a.href })),
  );

  /* 7 · Documents — one section, its shelves as tabs (LAY-13). */
  {
    const groups = documentGroups(detail, documents);
    if (groups.length > 0) {
      const title = tidyTitle(detail?.downloads?.heading ?? "Documents & Downloads");
      bands.push({
        id: "documents",
        nav: "Documents",
        body: (
          <>
            <SectionTitle as={2} title={title} description={withoutNarration(detail?.downloads?.description)} headingId="documents-title" />
            <OrganisationDocuments groups={groups} label={`${name} document types`} />
          </>
        ),
      });
    }
  }

  /* 8 · Updates */
  {
    const fromDocs: UpdateItem[] = detail?.whatsNew
      ? matchDocuments(documents, detail.whatsNew, 24).map((d) => ({
          title: tidyTitle(d.title),
          href: d.fileUrl ?? d.sourceUrl,
          date: d.date,
          kind: d.category,
        }))
      : [];
    const fromCorner: UpdateItem[] = (detail?.activityCorner?.items ?? []).map((a) => ({
      title: tidyTitle(a.title),
      href: a.href ?? orgHref(org.slug),
      date: `${a.day} ${a.monthYear}`,
    }));
    const seen = new Set<string>();
    const all = [...fromDocs, ...fromCorner, ...ingestedUpdates]
      .filter((u) => {
        const k = u.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").slice(0, 80);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      })
      .sort((a, b) => (isoDate(b.date) ?? "").localeCompare(isoDate(a.date) ?? ""))
      .slice(0, 6);
    const viewAll: { label: string; href: string }[] = [
      ...(detail?.whatsNew ? [{ label: "View All Notices", href: detail.whatsNew.viewAllHref }] : []),
      ...ingestedViewAll.map((v) => ({ label: `View All ${v.label}`, href: v.href })),
    ];
    const ribbon = detail?.eventRibbon;
    if (all.length > 0 || ribbon) {
      const title = tidyTitle(detail?.whatsNew?.label ?? detail?.activityCorner?.heading ?? "Latest Updates");
      bands.push({
        id: "updates",
        nav: "Updates",
        body: (
          <>
            <SectionTitle as={2} title={title === "What's New" ? "What’s New" : title} headingId="updates-title" />
            {ribbon && (
              <div className="og-notice">
                <p className="og-notice__eyebrow">{ribbon.eyebrow}</p>
                <p className="og-notice__title">{ribbon.heading}</p>
                <p className="og-notice__actions">
                  <SmartLink href={ribbon.action.href} className="og-link">
                    {ribbon.action.label}
                  </SmartLink>
                  {ribbon.altAction && (
                    <span className="og-notice__alt">
                      {ribbon.altAction.note}{" "}
                      <SmartLink href={ribbon.altAction.href} className="og-inline-link">
                        {ribbon.altAction.label}
                      </SmartLink>
                    </span>
                  )}
                </p>
              </div>
            )}
            {all.length > 0 && <UpdateList items={all} />}
            {viewAll.length > 0 && (
              <ul className="og-viewall">
                {viewAll.map((v) => (
                  <li key={v.href}>
                    <SmartLink href={v.href} className="og-link">
                      {v.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            )}
          </>
        ),
      });
    }
  }

  /* 9 · Gallery */
  {
    const shots = detail?.gallery
      ? detail.gallery.items.map((g) => ({ src: g.image, caption: g.caption, date: g.date }))
      : ingestedImages.filter((i) => i.alt).map((i) => ({ src: i.src, caption: i.alt, date: undefined as string | undefined }));
    if (shots.length > 0) {
      const title = tidyTitle(detail?.gallery?.heading ?? "Gallery");
      bands.push({
        id: "gallery",
        nav: "Gallery",
        body: (
          <>
            <SectionTitle as={2} title={title} headingId="gallery-title">
              <SectionAction href={detail?.gallery?.viewAllHref ?? "/website/gallery"} label="View All" context={title} />
            </SectionTitle>
            <ul className="og-gallery og-grid" style={cols(shots.length, 4)}>
              {shots.map((g) => (
                <li key={g.src} className="og-shot">
                  <span className="og-shot__frame">
                    <Image src={g.src} alt={g.caption} fill sizes="(min-width: 1024px) 380px, 100vw" />
                  </span>
                  <p className="og-shot__caption">{g.caption}</p>
                  {g.date && <p className="og-shot__date">{formatDate(g.date)}</p>}
                </li>
              ))}
            </ul>
          </>
        ),
      });
    }
  }

  /* 10 · Messages */
  if (detail?.messages && detail.messages.items.length > 0) {
    const ms = detail.messages;
    bands.push({
      id: "messages",
      nav: "Messages",
      body: (
        <>
          <SectionTitle as={2} title={tidyTitle(ms.heading)} description={withoutNarration(ms.description)} headingId="messages-title" />
          <ul className="og-messages og-grid" style={cols(ms.items.length, 3)}>
            {ms.items.map((m) => (
              <li key={m.name} className="og-message">
                <figure>
                  <blockquote className="og-message__quote">
                    <p>{m.quote}</p>
                  </blockquote>
                  <figcaption className="og-message__by">
                    <span className="og-message__name">{m.name}</span>
                    <span className="og-message__role">{m.designation}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  /* 11 · Social media — static cards, never an empty embed (BRD-12). */
  {
    const profiles: SocialProfile[] = detail?.socialFeed?.handles?.length
      ? detail.socialFeed.handles.map((h) => ({ platform: h.platform, name: platformName(h.platform), handle: h.handle, href: h.url }))
      : ingestedSocial;
    if (profiles.length > 0) {
      bands.push({
        id: "social",
        nav: "Social Media",
        body: (
          <>
            <SectionTitle as={2} title="Social Media" headingId="social-title" />
            <ul className="og-social og-grid" style={cols(profiles.length, 5)}>
              {profiles.map((p) => (
                <li key={p.href} className="og-social__card">
                  <span className="og-social__glyph" aria-hidden="true">
                    <BrandGlyph name={p.platform} size={24} />
                  </span>
                  <span className="og-social__text">
                    <a href={p.href} target="_blank" rel="noopener noreferrer" className="og-social__link">
                      {p.name}
                      <span className="sr-only">: {name}{p.handle !== p.name ? ` ${p.handle}` : ""} (opens in a new window)</span>
                    </a>
                    {p.handle !== p.name && <span className="og-social__handle">{p.handle}</span>}
                  </span>
                  <span className="og-social__go" aria-hidden="true">
                    <Icon name="open_in_new" size={16} />
                  </span>
                </li>
              ))}
            </ul>
          </>
        ),
      });
    }
  }

  /* 12 · More pages of this organisation */
  {
    const children = relatedPages.filter((p) => p.slug !== org.slug);
    const listed = new Set<string>();
    const groups: { label: string; items: { label: string; href: string }[] }[] = [];
    for (const g of detail?.nav ?? []) {
      const items = g.items
        .filter((i) => !i.href.startsWith("#"))
        .map((i) => ({ label: tidyTitle(i.label), href: i.href }));
      items.forEach((i) => listed.add(i.href));
      if (items.length > 0) groups.push({ label: titleCaseLabel(g.label), items });
    }
    const rest = children
      .filter((p) => !listed.has(orgHref(p.slug)))
      .map((p) => ({ label: tidyTitle(p.title), href: orgHref(p.slug) }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (rest.length > 0) groups.push({ label: groups.length > 0 ? "Other Pages" : "Pages", items: rest });
    if (detail?.featuredLinks && detail.featuredLinks.items.length > 0) {
      groups.push({
        label: tidyTitle(detail.featuredLinks.heading ?? "Featured Links"),
        items: detail.featuredLinks.items.map((i) => ({ label: tidyTitle(i.label), href: i.href })),
      });
    }
    if (groups.length > 0) {
      const title = abbr ? `More from ${abbr}` : "More Pages";
      bands.push({
        id: "pages",
        nav: "More Pages",
        body: (
          <>
            <SectionTitle as={2} title={title} headingId="pages-title" />
            <div className="og-pages">
              {groups.map((g) => (
                <nav key={g.label} className={`og-pages__group${g.items.length > 8 ? " og-pages__group--wide" : ""}`} aria-labelledby={`pages-${slugify(g.label)}`}>
                  <h3 id={`pages-${slugify(g.label)}`} className="og-subhead">
                    {g.label}
                  </h3>
                  <ul>
                    {g.items.map((i) => (
                      <li key={`${i.href}-${i.label}`}>
                        <SmartLink href={i.href} className="og-pages__link">
                          <span>{i.label}</span>
                          {!isExternal(i.href) && <Icon name="chevron_right" size={20} aria-hidden />}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </>
        ),
      });
    }
  }

  /* 13 · Contact */
  if (detail?.contact) {
    bands.push({
      id: "contact",
      nav: "Contact",
      body: <OrganisationContact contact={detail.contact} directoryHref={directoryHref} />,
    });
  } else if (directoryHref) {
    bands.push({
      id: "contact",
      nav: "Contact",
      body: (
        <>
          <SectionTitle as={2} title="Contact" headingId="contact-title" />
          <ul className="og-contact">
            <li className="og-contact__card">
              <span className="og-contact__icon" aria-hidden="true">
                <Icon name="contact_phone" size={24} />
              </span>
              <div>
                <h3 className="og-contact__title">Telephone Directory</h3>
                <div className="og-contact__body">
                  <NextLink href={directoryHref} className="og-contact__link">
                    View Directory<span className="sr-only">: {name} telephone directory</span>
                  </NextLink>
                </div>
              </div>
            </li>
          </ul>
        </>
      ),
    });
  }

  return (
    <PageLayout {...header}>
      {bands.length > 2 && (
        <nav className="og-onpage" aria-label="On this page">
          <div className="sa-container">
            <ul className="og-onpage__list">
              {bands.map((b) => (
                <li key={b.id}>
                  <a href={`#${b.id}`} className="og-onpage__link">
                    {b.nav}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
      {bands.map((b, i) => (
        <section
          key={b.id}
          id={b.id}
          className={`wn-section og-band${i % 2 === 1 ? " wn-section--muted" : ""}`}
          aria-labelledby={b.id === "coverage" ? undefined : `${b.id}-title`}
        >
          <div className="sa-container">{b.body}</div>
        </section>
      ))}
    </PageLayout>
  );
}

/* ── A page under an organisation ──────────────────────────────────────────── */

export interface OrganisationSubPageProps {
  header: PageHeaderProps;
  org: SectionRecord;
  rootOrg?: SectionRecord;
  /** The organisation's record (the root's, for a child page). */
  detail?: OrgDetail;
  /** A record written for THIS child page, where the ingest returned it empty. */
  authored?: OrgDetail;
  relatedPages: SectionRecord[];
  abbr?: string;
  directoryHref?: string;
  /** Stated policy for a PM-AJAY component page, read off its own prose. */
  glance?: { term: string; detail: React.ReactNode }[];
  /** The other components of the same scheme. */
  siblings?: SectionRecord[];
  /** A full-width dashboard below the article. */
  dashboard?: React.ReactNode;
  isContactPage?: boolean;
  /** The page's questions and answers, where the page is an FAQ page (`faqGroups`). */
  faqs?: FaqGroup[] | null;
}

/**
 * An FAQ page: a contents list, then one section per topic, each question an h3
 * inside a native disclosure. The source printed all 223 answers open, 35,910px
 * of text; closed, the page is a list of questions a reader can scan, and the
 * browser's find-in-page still opens the answer that matches.
 */
function FaqPage({ groups, label }: { groups: FaqGroup[]; label: string }) {
  return (
    <div className="og-faqs">
      <nav className="wn-panel og-faq-toc" aria-labelledby="faq-contents">
        <h2 id="faq-contents" className="wn-panel__title">
          Contents
        </h2>
        <ol>
          {groups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`}>
                <span>{g.title}</span>
                <span className="og-faq-toc__count">
                  {g.items.length}
                  <span className="sr-only"> questions</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {groups.map((g) => (
        <section key={g.id} id={g.id} className="og-faq-group" aria-labelledby={`${g.id}-title`}>
          <SectionTitle as={2} title={g.title} headingId={`${g.id}-title`} />
          <div className="og-faq">
            {g.items.map((f, i) => (
              <details key={`${g.id}-${i}`} className="og-faq__item">
                <summary className="og-faq__summary">
                  <h3 className="og-faq__q">{f.question}</h3>
                  <span className="og-faq__icon" aria-hidden="true">
                    <Icon name="expand_more" size={24} />
                  </span>
                </summary>
                <div
                  className="og-faq__a wn-prose"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(f.answerHtml, { headingLevel: 3, label: `${label}: ${f.question}` }) }}
                />
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function OrganisationSubPage({
  header,
  org,
  rootOrg,
  detail,
  authored,
  relatedPages,
  abbr,
  directoryHref,
  glance,
  siblings = [],
  dashboard,
  isContactPage = false,
  faqs,
}: OrganisationSubPageProps) {
  const pageTitle = tidyTitle(org.title);
  const rootSlug = rootOrg?.slug ?? org.slug.split("/")[0]!;
  const rootName = abbr ?? tidyTitle(rootOrg?.title ?? "Organisation");
  const parts = org.sections
    .filter((s) => kindOf(s) === "prose")
    .map((s) => ({ heading: s.heading ?? undefined, html: extractGlance(s.html).html }))
    .filter((s) => stripTags(s.html).length > 0 || /<img\b/i.test(s.html));

  let body: React.ReactNode;
  if (faqs && faqs.length > 0) {
    body = <FaqPage groups={faqs} label={pageTitle} />;
  } else if (parts.length === 0 && authored?.aboutHtml != null) {
    body = (
      <div className="wn-prose og-prose" dangerouslySetInnerHTML={{ __html: cleanHtml(authored.aboutHtml, { headingLevel: 2, label: pageTitle }) }} />
    );
  } else if (parts.length === 0 && isContactPage && detail?.contact) {
    body = <OrganisationContact contact={detail.contact} directoryHref={directoryHref} />;
  } else if (parts.length === 0) {
    body = (
      <p className="og-empty">
        This page has not yet been published on this site. The source page is on{" "}
        <a href={org.sourceUrl} target="_blank" rel="noopener noreferrer" className="og-inline-link">
          dosje.gov.in<span className="sr-only"> (opens in a new window)</span>
        </a>
        .
      </p>
    );
  } else {
    body = (
      <div className="wn-prose og-prose">
        {parts.map((s, i) => {
          const showHeading = s.heading != null && !sameLabel(s.heading, pageTitle) && !sameLabel(s.heading, rootOrg?.title ?? "");
          return (
            <div key={s.heading ?? i} className="og-prose__part">
              {showHeading && <h2 id={slugify(s.heading!)}>{tidyTitle(s.heading!)}</h2>}
              <div
                dangerouslySetInnerHTML={{
                  __html: cleanHtml(s.html, { headingLevel: showHeading ? 3 : 2, label: tidyTitle(s.heading ?? pageTitle) }),
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  const pages = [
    { label: "Overview", href: orgHref(rootSlug) },
    ...relatedPages
      .filter((p) => p.slug !== rootSlug)
      .map((p) => ({ label: tidyTitle(p.title), href: orgHref(p.slug) }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
  const current = orgHref(org.slug);
  const contact = detail?.contact;

  return (
    <PageLayout {...header}>
      <div className="wn-section">
        <div className="sa-container wn-split">
          <article className="min-w-0" aria-labelledby="page-title">
            {body}
          </article>
          <aside className="wn-aside" aria-label={`More from ${rootName}`}>
            {glance && glance.length > 0 && (
              <div className="wn-panel og-glance">
                <h2 className="wn-panel__title">At a Glance</h2>
                <dl className="og-glance__list">
                  {glance.map((f) => (
                    <div key={f.term} className="og-glance__row">
                      <dt>{f.term}</dt>
                      <dd>{f.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {siblings.length > 0 && (
              <nav className="wn-panel" aria-labelledby="og-siblings">
                <h2 id="og-siblings" className="wn-panel__title">
                  Other {rootName} Components
                </h2>
                <ul>
                  {siblings.map((c) => (
                    <li key={c.slug}>
                      <NextLink href={orgHref(c.slug)}>
                        <span>{tidyTitle(c.title)}</span>
                        <Icon name="arrow_forward" size={16} aria-hidden />
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {pages.length > 1 && (
              <nav className="wn-panel og-pagenav" aria-labelledby="og-pagenav">
                <h2 id="og-pagenav" className="wn-panel__title">
                  Pages of {rootName}
                </h2>
                <ul>
                  {pages.map((p) => (
                    <li key={p.href}>
                      <NextLink href={p.href} aria-current={p.href === current ? "page" : undefined}>
                        <span>{p.label}</span>
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {contact && !(parts.length === 0 && isContactPage) && (contact.supportPhone || contact.supportEmail) && (
              <div className="wn-panel og-mini-contact">
                <h2 className="wn-panel__title">Contact {rootName}</h2>
                <ul>
                  {contact.supportPhone && (
                    <li>
                      <a href={telHref(contact.supportPhone)}>
                        <Icon name="call" size={20} aria-hidden />
                        <span>{contact.supportPhone}</span>
                      </a>
                    </li>
                  )}
                  {contact.supportEmail && (
                    <li>
                      <a href={`mailto:${contact.supportEmail}`}>
                        <Icon name="mail" size={20} aria-hidden />
                        <span>{contact.supportEmail}</span>
                      </a>
                    </li>
                  )}
                  <li>
                    <NextLink href={`${orgHref(rootSlug)}#contact`}>
                      <span>View Details</span>
                      <span className="sr-only">: contact details of {rootName}</span>
                      <Icon name="arrow_forward" size={16} aria-hidden />
                    </NextLink>
                  </li>
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
      {dashboard && (
        <section className="wn-section wn-section--muted og-dashboard" aria-label={`${pageTitle} dashboard`}>
          <div className="sa-container">{dashboard}</div>
        </section>
      )}
    </PageLayout>
  );
}
