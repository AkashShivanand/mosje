import type * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { DbimDocRowView } from "@/components/website-dbim/ministry/DocRow";
import { OfferingsTabs } from "@/components/website-dbim/home/OfferingsTabs";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { DbimIcon } from "@/components/website-dbim/ui/icons";
import type { DbimOrgBlock, DbimOrgLink, DbimOrgProfile, DbimOrgSection } from "@/lib/website-dbim/organisation";
import "@/components/website-dbim/home/home-mid.css"; // the DBIM tab set (Figure 56), shared with Key Offerings
import "./ministry.css";
import "./organisation.css";

/**
 * One organisation's page, from the body's own page on the live website
 * (lib/website-dbim/organisation.ts). DBIM's detail layout (ministry.spec.md §1):
 * the side column carries who the body is — its mark, standing, statement and
 * figures — then the page's index, which stays in view; the main column carries
 * the live page's sections in the live page's order.
 *
 * Every part renders only where the live page publishes it, so one template serves
 * a commission with state offices and a foundation with a gallery. Spec §4b.
 *
 * DS Audit: Icon ✅ · DbimDocRowView / DbimLinkRow ✅ (Ministry) · OfferingsTabs ✅ (home,
 * label made a prop) · DbimEmptyState ✅ · DbimIcon ✅ · profile card `.db-min-profile` ✅
 * (Our Team) · organisation.css ➕ for the parts no DBIM page had: figures, scheme cards,
 * activity tiles, gallery, account cards, contact list, page index.
 */
export function DbimOrganisationProfile({ o }: { o: DbimOrgProfile }) {
  return (
    <div className="db-min-detail db-org">
      <aside className="db-org__aside" aria-label={`About ${o.title}`}>
        <div className="db-min-vision db-org__id">
          {o.logo ? (
            <Image className="db-org__logo" src={o.logo} alt="" width={168} height={84} sizes="168px" />
          ) : null}
          {o.subtitle ? <p className="db-org__standing">{o.subtitle}</p> : null}
          {o.lead ? <p className="db-org__lead">{o.lead}</p> : null}
          {o.facts.length ? (
            <dl className="db-org__facts">
              {o.facts.map((f) => (
                <div key={f.label} className="db-org__fact">
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {o.actions.map((a) => (
            <OrgAnchor key={a.href} link={a} className="db-org__action">
              {a.label}
              <Icon name={a.external ? "open_in_new" : "arrow_right_alt"} size={20} weight={400} aria-hidden="true" />
            </OrgAnchor>
          ))}
        </div>

        <nav className="db-org__index" aria-label="On This Page">
          <p className="db-org__index-title">On This Page</p>
          <ul>
            {o.sections.map((s) => (
              <li key={s.anchor}>
                <a href={`#${s.anchor}`}>{s.heading}</a>
              </li>
            ))}
          </ul>
          {o.related.map((g) => (
            <div key={g.label} className="db-org__related">
              <p className="db-org__index-title">{g.label}</p>
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <OrgAnchor link={l}>
                      {l.label}
                      {l.external ? <Icon name="open_in_new" size={16} weight={400} aria-hidden="true" /> : null}
                    </OrgAnchor>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="db-min-rich db-org__main">
        {o.banner ? (
          <div className="db-org__banner">
            <Image src={o.banner} alt="" fill sizes="(min-width: 992px) 860px, 100vw" priority />
          </div>
        ) : null}
        {o.sections.map((s) => (
          <OrgSection key={s.anchor} s={s} />
        ))}
      </div>
    </div>
  );
}

/**
 * A resolved link (lib/website-dbim/live-links.ts): a page here opens in place; the
 * few that stay on another site open in a new tab, and the reader is told so.
 */
export function OrgAnchor({ link, className, children }: { link: DbimOrgLink; className?: string; children: React.ReactNode }) {
  return link.external ? (
    <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ) : (
    <Link className={className} href={link.href}>
      {children}
    </Link>
  );
}

/** The Ministry's link row (`DbimLinkRow`), for an href that is already resolved. */
export function OrgLinkRow({ link }: { link: DbimOrgLink }) {
  return (
    <OrgAnchor link={link} className="db-min-docrow db-min-docrow--link">
      <span className="db-min-docrow__title">
        <Icon name="draft" size={24} weight={400} aria-hidden="true" />
        <span>{link.label}</span>
      </span>
      <span className="db-min-arrow" aria-hidden="true">
        <Icon name={link.external ? "open_in_new" : "arrow_right_alt"} size={24} weight={400} />
      </span>
    </OrgAnchor>
  );
}

function OrgSection({ s }: { s: DbimOrgSection }) {
  return (
    <section id={s.anchor} className="db-org__section" aria-labelledby={`${s.anchor}-h`}>
      <div className="db-org__head">
        <h2 id={`${s.anchor}-h`}>{s.heading}</h2>
        {s.more ? (
          <OrgAnchor link={s.more} className="db-org__more">
            {s.more.label}
            <span className="sr-only">: {s.heading}</span>
            <Icon name="arrow_right_alt" size={20} weight={400} aria-hidden="true" />
          </OrgAnchor>
        ) : null}
      </div>
      {/* Ingested prose from dosje.gov.in, cleaned by cleanHtml() (links, headings, tables). */}
      {s.intro ? <div dangerouslySetInnerHTML={{ __html: s.intro }} /> : null}
      {s.blocks.map((b, i) => (
        <OrgBlock key={i} b={b} label={s.heading} />
      ))}
    </section>
  );
}

function OrgBlock({ b, label }: { b: DbimOrgBlock; label: string }) {
  switch (b.kind) {
    case "prose":
      return <div dangerouslySetInnerHTML={{ __html: b.html }} />;

    case "people":
      return (
        <ul className="db-org-people">
          {b.items.map((p) => (
            <li key={p.name}>
              <div className="db-min-profile">
                {p.photo ? <Image className="db-min-profile__img" src={p.photo} alt="" width={120} height={120} sizes="120px" /> : null}
                <small className="db-min-profile__role">{p.designation}</small>
                <p className="db-min-profile__name">{p.name}</p>
                {p.tenure ? <p className="db-org-people__tenure">{p.tenure}</p> : null}
                {p.profile ? (
                  <OrgAnchor link={p.profile} className="db-org-people__link">
                    View Profile<span className="sr-only"> of {p.name}</span>
                  </OrgAnchor>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      );

    case "cards":
      return (
        <ul className="db-org-cards">
          {b.items.map((c) => (
            <li key={c.title} className="db-org-card">
              {c.category ? <small className="db-org-card__cat">{c.category}</small> : null}
              <h3 className="db-org-card__title">{c.title}</h3>
              {c.description ? <p className="db-org-card__desc">{c.description}</p> : null}
              {c.link ? (
                <OrgAnchor link={c.link} className="db-min-arrow db-org-card__arrow">
                  <Icon name="arrow_right_alt" size={24} weight={400} aria-hidden="true" />
                  <span className="sr-only">{c.title}</span>
                </OrgAnchor>
              ) : null}
            </li>
          ))}
        </ul>
      );

    case "documents":
      return (
        <div>
          {b.items.map((d) => (
            <DbimDocRowView key={d.href + d.title} doc={d} />
          ))}
        </div>
      );

    case "events":
      return <OrgEvents items={b.items} />;

    case "links":
      // A long run of short names (NCSC's twelve state offices) reads as a grid of
      // buttons; two or three named pages read as the Ministry's link rows.
      return b.items.length > 4 ? (
        <ul className="db-org-chips">
          {b.items.map((l) => (
            <li key={l.href}>
              <OrgAnchor link={l} className="db-org-chip">
                {l.label}
              </OrgAnchor>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          {b.items.map((l) => (
            <OrgLinkRow key={l.href} link={l} />
          ))}
        </div>
      );

    case "tiles":
      return (
        <ul className="db-org-tiles">
          {b.items.map((t) => (
            <li key={t.title} className="db-org-tile">
              {t.image ? (
                <span className="db-org-tile__img">
                  <Image src={t.image} alt="" fill sizes="(min-width: 992px) 270px, 50vw" />
                </span>
              ) : null}
              <span className="db-org-tile__title">{t.title}</span>
              {t.link ? (
                <OrgAnchor link={t.link} className="db-min-arrow db-org-tile__arrow">
                  <Icon name="arrow_right_alt" size={24} weight={400} aria-hidden="true" />
                  <span className="sr-only">{t.title}</span>
                </OrgAnchor>
              ) : null}
            </li>
          ))}
        </ul>
      );

    case "gallery":
      return (
        <ul className="db-org-gallery">
          {b.items.map((g) => (
            <li key={g.src}>
              <figure>
                <span className="db-org-gallery__frame">
                  <Image src={g.src} alt="" fill sizes="(min-width: 992px) 270px, (min-width: 768px) 45vw, 100vw" />
                </span>
                <figcaption>{g.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      );

    case "social":
      return (
        <ul className="db-org-social">
          {b.items.map((s) => (
            <li key={s.href}>
              <a className="db-org-social__card" href={s.href} target="_blank" rel="noopener noreferrer">
                <DbimIcon name={s.icon} size={32} className="db-org-social__icon" />
                <span className="db-org-social__name">{s.name}</span>
                {s.handle ? <span className="db-org-social__handle">{s.handle}</span> : null}
                <span className="db-org-social__cta">
                  Follow on {s.name}
                  <Icon name="open_in_new" size={16} weight={400} aria-hidden="true" />
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      );

    case "contact":
      return (
        <dl className="db-org-contact">
          {b.items.map((c) => (
            <div key={c.label} className={`db-org-contact__item${c.values.length > 2 ? " db-org-contact__item--wide" : ""}`}>
              <span className="db-org-contact__icon" aria-hidden="true">
                <Icon name={c.icon} size={24} weight={400} />
              </span>
              <div>
                <dt>{c.label}</dt>
                {c.values.map((v) =>
                  v.numbers.length && v.text ? (
                    <dd key={v.text} className="db-org-contact__line">
                      <span>{v.text}</span>
                      <span className="db-org-contact__numbers">
                        {v.numbers.map((n) => (
                          <a key={n.label} href={n.tel}>
                            {n.label}
                          </a>
                        ))}
                      </span>
                    </dd>
                  ) : v.numbers.length ? (
                    <dd key={v.numbers[0]!.label}>
                      {v.numbers.map((n, i) => (
                        <span key={n.label}>
                          {i ? ", " : ""}
                          <a href={n.tel}>{n.label}</a>
                        </span>
                      ))}
                    </dd>
                  ) : (
                    <dd key={v.text}>{v.text}</dd>
                  ),
                )}
              </div>
            </div>
          ))}
        </dl>
      );

    case "tabs":
      return (
        <div className="db-org-tabs">
          <OfferingsTabs
            label={label}
            tabs={b.items.map((t) => ({
              id: t.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
              label: t.label,
              panel: (
                <div className="db-org-tabs__panel">
                  {t.documents.map((d) => (
                    <DbimDocRowView key={d.href + d.title} doc={d} />
                  ))}
                  {t.events.length ? <OrgEvents items={t.events} /> : null}
                  {t.news.length ? (
                    <div>
                      {t.news.map((n) => (
                        <OrgLinkRow key={n.href} link={n} />
                      ))}
                    </div>
                  ) : null}
                  {/* The live tab's own words for a register with nothing in it. */}
                  {!t.documents.length && !t.events.length && !t.news.length ? (
                    <DbimEmptyState>{t.empty ?? "No Data Available."}</DbimEmptyState>
                  ) : null}
                  {t.viewAll && (t.documents.length || t.events.length || t.news.length) ? (
                    <OrgAnchor link={t.viewAll} className="db-org__more db-org-tabs__all">
                      View All<span className="sr-only"> {t.label}</span>
                      <Icon name="arrow_right_alt" size={20} weight={400} aria-hidden="true" />
                    </OrgAnchor>
                  ) : null}
                </div>
              ),
            }))}
          />
        </div>
      );
  }
}

/** Dated entries (NCSC's events): the date in a block, as the live card sets it. */
function OrgEvents({ items }: { items: { title: string; date?: string; link?: DbimOrgLink }[] }) {
  return (
    <ul className="db-org-events">
      {items.map((e) => (
        <li key={e.title} className="db-min-docrow db-org-event">
          {e.date ? <small className="db-min-ptype db-org-event__date">{e.date}</small> : null}
          <p className="db-min-docrow__title">{e.title}</p>
          {e.link ? (
            <OrgAnchor link={e.link} className="db-min-arrow">
              <Icon name={e.link.external ? "open_in_new" : "arrow_right_alt"} size={24} weight={400} aria-hidden="true" />
              <span className="sr-only">{e.title}</span>
            </OrgAnchor>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
