import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { PageHeaderProps } from "@/components/website-next/layout/PageHeader";
import { EmailLinks, PhoneFacts, officialEmails, phoneParts } from "./people-format";
import "./people.css";

export interface ContactOfficer {
  role: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  /** The officer's record on this site, `/website/official/<slug>`. */
  slug?: string;
}

/** A national helpline, tap to call. Every number must cite its source where it is declared. */
export interface ContactHelpline {
  number: string;
  name: string;
  sub?: string;
  icon?: string;
}

export interface ContactPageProps extends PageHeaderProps {
  /** The office: its name, postal address, and the telephone and email it publishes. */
  office: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
    /** Who the telephone and email reach, where it is not the office as a whole. */
    phoneLabel?: string;
    /** That person's record on this site, `/website/official/<slug>`. */
    contactSlug?: string;
  };
  /**
   * A link that opens the address in a map application. There is deliberately no
   * embed: a third-party map frame loads before cookie consent, and drew an empty box.
   */
  mapHref?: string;
  /** Further offices or officers, shown after the Department's own contact. */
  officers?: ContactOfficer[];
  /** The heading over `officers`. */
  officersTitle?: string;
  /** National helplines, shown first under Call. */
  helplines?: ContactHelpline[];
  /** Accepted for the classic props; the redesign links the Feedback page instead of embedding a form. */
  showForm?: boolean;
}

/**
 * T6 — Contact (issues MAN-07, CON-08, CON-09).
 *
 * Organised by how a citizen reaches the Department — Call, Write, Visit — with
 * the numbers that can be dialled at the top and every one of them a `tel:` link.
 * The classic page led with a postal address and a map and put an unlabelled
 * feedback form beside them.
 *
 * Nothing on this template is typed in: every number, address and email comes
 * from the page that renders it, which reads them from the register or cites the
 * document it took them from. A block with nothing to say is left out rather than
 * drawn empty — there are no published office hours, so there is no Hours block.
 */
export function ContactPage({
  office,
  mapHref,
  officers = [],
  officersTitle = "Officers to Contact",
  helplines = [],
  showForm = true,
  ...header
}: ContactPageProps) {
  const officeEmails = officialEmails(office.email);
  const hasOfficePhone = phoneParts(office.phone).some((p) => p.tel);

  return (
    <PageLayout {...header}>
      <div className="wn-section wn-section--tight">
        <div className="sa-container wn-contact__lanes">
          {/* ── Call ─────────────────────────────────────────────────────── */}
          {(helplines.length > 0 || hasOfficePhone) && (
            <section id="call" aria-labelledby="call-title">
              <div className="wn-contact__lane-head">
                <span className="wn-contact__lane-icon" aria-hidden="true">
                  <Icon name="call" size={24} />
                </span>
                <SectionTitle headingId="call-title" title="Call" />
              </div>
              <ul className="wn-contact__grid">
                {hasOfficePhone && (
                  <li>
                    <div className="wn-contact__call">
                      <span className="wn-contact__call-name">{office.name}</span>
                      {office.phoneLabel && <span className="wn-contact__call-sub">{office.phoneLabel}</span>}
                      <span className="wn-contact__numbers">
                        {phoneParts(office.phone)
                          .filter((p) => p.tel)
                          .map((p) => (
                            <a key={p.tel} href={`tel:${p.tel}`} className="wn-contact__number">
                              <Icon name="call" size={20} aria-hidden />
                              <span className="wn-contact__u">{p.text.trim()}</span>
                            </a>
                          ))}
                      </span>
                    </div>
                  </li>
                )}
                {helplines.map((h) => (
                  <li key={h.number}>
                    <div className="wn-contact__call">
                      <span className="wn-contact__call-name">{h.name}</span>
                      {h.sub && <span className="wn-contact__call-sub">{h.sub}</span>}
                      <span className="wn-contact__numbers">
                        <a
                          href={`tel:${h.number}`}
                          className="wn-contact__number wn-contact__number--hero"
                          aria-label={`Call ${h.name} on ${h.number.split("").join(" ")}`}
                        >
                          <Icon name={h.icon ?? "call"} size={24} aria-hidden />
                          <span className="wn-contact__u">{h.number}</span>
                        </a>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Write ────────────────────────────────────────────────────── */}
          <section id="write" aria-labelledby="write-title">
            <div className="wn-contact__lane-head">
              <span className="wn-contact__lane-icon" aria-hidden="true">
                <Icon name="mail" size={24} />
              </span>
              <SectionTitle headingId="write-title" title="Write" />
            </div>
            <ul className="wn-contact__grid">
              {officeEmails.length > 0 && (
                <li>
                  <div className="wn-contact__card">
                    <h3 className="wn-contact__card-title">Email</h3>
                    {office.phoneLabel && (
                      <p className="wn-contact__card-text">
                        {office.contactSlug ? (
                          <Link href={`/website/official/${office.contactSlug}`} className="wn-people-link">
                            {office.phoneLabel}
                          </Link>
                        ) : (
                          office.phoneLabel
                        )}
                      </p>
                    )}
                    <EmailLinks value={office.email} />
                  </div>
                </li>
              )}
              <li>
                <div className="wn-contact__card">
                  <h3 className="wn-contact__card-title">By Post</h3>
                  <address className="wn-contact__card-text wn-contact__postal">
                    {office.name}
                    <br />
                    {office.address}
                  </address>
                </div>
              </li>
              {showForm && (
                <li>
                  <div className="wn-contact__card">
                    <h3 className="wn-contact__card-title">Website Feedback</h3>
                    <p className="wn-contact__card-text">Report a problem with this website or suggest an improvement.</p>
                    <Link href="/website/feedback" className="wn-contact__action">
                      <span className="wn-contact__u">Send Feedback</span>
                      <Icon name="arrow_forward" size={20} aria-hidden />
                    </Link>
                  </div>
                </li>
              )}
              <li>
                <div className="wn-contact__card">
                  <h3 className="wn-contact__card-title">Public Grievances</h3>
                  <p className="wn-contact__card-text">
                    Grievances are registered and tracked on the Centralised Public Grievance Redress and Monitoring
                    System (CPGRAMS).
                  </p>
                  <a
                    href="https://pgportal.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wn-contact__action"
                  >
                    <span className="wn-contact__u">File a Grievance on CPGRAMS</span>
                    <Icon name="open_in_new" size={20} aria-hidden />
                    <span className="sr-only">(opens in a new window)</span>
                  </a>
                </div>
              </li>
            </ul>
          </section>

          {/* ── Visit ────────────────────────────────────────────────────── */}
          <section id="visit" aria-labelledby="visit-title">
            <div className="wn-contact__lane-head">
              <span className="wn-contact__lane-icon" aria-hidden="true">
                <Icon name="location_on" size={24} />
              </span>
              <SectionTitle headingId="visit-title" title="Visit" />
            </div>
            <ul className="wn-contact__grid">
              <li>
                <div className="wn-contact__card">
                  <h3 className="wn-contact__card-title">{office.name}</h3>
                  <address className="wn-contact__address">{office.address}</address>
                  {mapHref && (
                    <a href={mapHref} target="_blank" rel="noopener noreferrer" className="wn-contact__action">
                      <span className="wn-contact__u">Open in Google Maps</span>
                      <Icon name="open_in_new" size={20} aria-hidden />
                      <span className="sr-only">(opens in a new window)</span>
                    </a>
                  )}
                </div>
              </li>
            </ul>
          </section>

          {/* ── Officers ─────────────────────────────────────────────────── */}
          {officers.length > 0 && (
            <section id="officers" aria-labelledby="officers-title">
              <SectionTitle headingId="officers-title" title={officersTitle} />
              <ul className="wn-contact__grid">
                {officers.map((o) => (
                  <li key={`${o.role}-${o.name}`}>
                    <div className="wn-contact__card">
                      <h3 className="wn-contact__card-title">
                        {o.slug && o.name ? (
                          <Link href={`/website/official/${o.slug}`} className="wn-people-link">
                            {o.name}
                          </Link>
                        ) : (
                          (o.name ?? o.role)
                        )}
                      </h3>
                      {o.name && <p className="wn-contact__card-text">{o.role}</p>}
                      <dl className="wn-people-facts">
                        <PhoneFacts value={o.phone} />
                        {officialEmails(o.email).length > 0 && (
                          <div>
                            <dt>Email</dt>
                            <dd>
                              <EmailLinks value={o.email} />
                            </dd>
                          </div>
                        )}
                        {o.address && (
                          <div>
                            <dt>Address</dt>
                            <dd>{o.address}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="wn-contact__more">
                <Link href="/website/whos-who" className="wn-contact__action">
                  <span className="wn-contact__u">View All Officers in Who&apos;s Who</span>
                  <Icon name="arrow_forward" size={20} aria-hidden />
                </Link>
              </p>
            </section>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
