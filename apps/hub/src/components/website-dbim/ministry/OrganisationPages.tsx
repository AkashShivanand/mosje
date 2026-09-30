import type * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { DbimDetailLayout } from "@/components/website-dbim/ministry/DetailLayout";
import { DbimDocRowView } from "@/components/website-dbim/ministry/DocRow";
import { DbimTeamOffice } from "@/components/website-dbim/ministry/TeamOffice";
import { DbimOrgUrlPager } from "@/components/website-dbim/ministry/OrgUrlPager";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimDocRow, DbimTeamOffice as Office } from "@/lib/website-dbim/ministry";
import type { DbimEventDetail, DbimOfficialProfile, DbimOrgEventRow, DbimOrgSubPage } from "@/lib/website-dbim/organisation-pages";
import "./ministry.css";
import "./organisation.css";

/**
 * The pages behind an organisation's page (lib/website-dbim/organisation-pages.ts),
 * each in the Ministry's detail layout and built from the parts the organisation page
 * already uses: rich text, document rows, the office table, the profile card.
 *
 * DS Audit: Icon ✅ · DbimDetailLayout / DbimDocRowView / DbimTeamOffice ✅ (Ministry) ·
 * DbimEmptyState ✅ · DbimPager ✅ (Connect, via OrgUrlPager) · `.db-min-profile` ✅.
 */

/** "Back to <body>" — on an event, whose breadcrumb is Connect › Events and does not name its body. */
function BackTo({ id, name }: { id?: string; name?: string }) {
  if (!id || !name) return null;
  return (
    <p className="db-orgp__back">
      <Link href={dbimHref(`/ministry/our-organisation/${id}`)} className="db-org__more">
        <Icon name="arrow_back" size={20} weight={400} aria-hidden="true" />
        {name}
      </Link>
    </p>
  );
}

/** A body's own page: its sections as the Department wrote them. */
export function DbimOrgSubPageView({ page }: { page: DbimOrgSubPage }) {
  return (
    <DbimDetailLayout>
      {page.sections.map((s, i) => (
        <section key={i} aria-label={s.heading ?? page.title}>
          {s.heading ? <h2>{s.heading}</h2> : null}
          {/* Ingested prose from dosje.gov.in, cleaned by cleanHtml(); its links resolved by localiseLiveLinks(). */}
          <div dangerouslySetInnerHTML={{ __html: s.html }} />
        </section>
      ))}
    </DbimDetailLayout>
  );
}

/** One page of a register: document rows, ten at a time. */
export function DbimOrgDocumentsView({ rows, page, pageCount, total, empty }: { rows: DbimDocRow[]; page: number; pageCount: number; total: number; empty: string }) {
  return (
    <div className="db-min-detail db-min-detail--single db-orgp">
      {total === 0 ? (
        <DbimEmptyState>{empty}</DbimEmptyState>
      ) : (
        <DbimOrgUrlPager page={page} pageCount={pageCount}>
          <p className="db-orgp__count" role="status">
            {total} {total === 1 ? "Document" : "Documents"}
          </p>
          {rows.map((d) => (
            <DbimDocRowView key={d.href + d.title} doc={d} />
          ))}
        </DbimOrgUrlPager>
      )}
    </div>
  );
}

/** One page of a body's events: the date, the title, the event's page. */
export function DbimOrgEventsView({ rows, page, pageCount, total }: { rows: DbimOrgEventRow[]; page: number; pageCount: number; total: number }) {
  return (
    <div className="db-min-detail db-min-detail--single db-org db-orgp">
      {total === 0 ? (
        <DbimEmptyState>No events have been published.</DbimEmptyState>
      ) : (
        <DbimOrgUrlPager page={page} pageCount={pageCount}>
          <ul className="db-org-events">
            {rows.map((e) => (
              <li key={e.href} className="db-min-docrow db-org-event">
                {e.date ? <small className="db-min-ptype db-org-event__date">{e.date}</small> : <span />}
                <p className="db-min-docrow__title">{e.title}</p>
                <Link href={dbimHref(e.href)} className="db-min-arrow">
                  <Icon name="arrow_right_alt" size={24} weight={400} aria-hidden="true" />
                  <span className="sr-only">{e.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </DbimOrgUrlPager>
      )}
    </div>
  );
}

/** A body's officers, office by office, in Our Team's table. */
export function DbimOrgDirectoryView({ offices }: { offices: Office[] }) {
  return (
    <div className="db-min-team db-orgp">
      {offices.length === 0 ? <DbimEmptyState>No officers are listed.</DbimEmptyState> : offices.map((o) => <DbimTeamOffice key={o.id} office={o} />)}
    </div>
  );
}

function ContactLine({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="db-org-contact__item">
      <span className="db-org-contact__icon" aria-hidden="true">
        <Icon name={icon} size={24} weight={400} />
      </span>
      <div>
        <dt>{label}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  );
}

/** One officer: the profile card beside their contact details. */
export function DbimOfficialProfileView({ p }: { p: DbimOfficialProfile }) {
  return (
    <div className="db-min-detail db-org db-orgp">
      <aside className="db-orgp__person" aria-label={p.name}>
        <div className="db-min-profile">
          {p.photo ? <Image className="db-min-profile__img" src={p.photo} alt="" width={120} height={120} sizes="120px" /> : null}
          {p.designation ? <small className="db-min-profile__role">{p.designation}</small> : null}
          <p className="db-min-profile__name">{p.name}</p>
          {p.tenure ? <p className="db-org-people__tenure">{p.tenure}</p> : null}
        </div>
      </aside>
      <div className="db-min-rich">
        <h2>Contact</h2>
        {p.phones.length || p.emails.length || p.address || p.intercom || p.faxes.length ? (
          <dl className="db-org-contact">
            {p.phones.length ? (
              <ContactLine icon="call" label="Telephone">
                {p.phones.map((n, i) => (
                  <span key={`${n.text}-${i}`}>
                    {i ? ", " : ""}
                    {n.tel ? <a href={`tel:${n.tel}`}>{n.text}</a> : n.text}
                  </span>
                ))}
              </ContactLine>
            ) : null}
            {p.intercom ? <ContactLine icon="deskphone" label="Intercom">{p.intercom}</ContactLine> : null}
            {p.faxes.length ? <ContactLine icon="fax" label="Fax">{p.faxes.join(", ")}</ContactLine> : null}
            {p.emails.length ? <ContactLine icon="mail" label="Email">{p.emails.join(", ")}</ContactLine> : null}
            {p.address ? <ContactLine icon="location_on" label="Address">{p.address}</ContactLine> : null}
          </dl>
        ) : (
          <DbimEmptyState>No contact details are published for this officer.</DbimEmptyState>
        )}
      </div>
    </div>
  );
}

/** One event: when, how, where, what, and its document. */
export function DbimEventDetailView({ e, organisation }: { e: DbimEventDetail; organisation?: string }) {
  const facts = [
    e.when && { label: "Date", value: e.when },
    e.mode && { label: "Mode", value: e.mode },
    e.location && { label: "Venue", value: e.location },
    e.organiser && { label: "Organised By", value: e.organiser },
  ].filter(Boolean) as { label: string; value: string }[];
  return (
    <div className="db-min-detail db-min-detail--single db-org db-orgp">
      <div className="db-min-rich">
        {facts.length ? (
          <dl className="db-org__facts db-orgp__facts">
            {facts.map((f) => (
              <div key={f.label} className="db-org__fact">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {/* Ingested description from dosje.gov.in, cleaned by cleanHtml(). */}
        {e.descriptionHtml ? <div dangerouslySetInnerHTML={{ __html: e.descriptionHtml }} /> : null}
        {e.document ? <DbimDocRowView doc={e.document} /> : null}
        <BackTo id={e.organisationId} name={organisation} />
      </div>
    </div>
  );
}
