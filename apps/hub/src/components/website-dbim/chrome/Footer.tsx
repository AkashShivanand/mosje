import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";

import { getContentSyncedDate } from "@/lib/website/content";
import { DBIM_BRAND } from "@/lib/website-dbim/assets";
import { DBIM_FOOTER_LINKS, dbimHref } from "@/lib/website-dbim/nav";
import "./footer.css";

/** "13 Jun 2026" → "13.06.2026", the reference's form. Empty when there is no ingest date. */
function dottedDate(human: string): string {
  const d = new Date(human);
  if (!human || Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/**
 * The DBIM footer: Useful Links, Subscribe for Updates (the Department's four social
 * accounts), the MyGov and india.gov.in badges, the ownership line and the date the
 * content was last updated — the date of the estate's last content ingest.
 *
 * "This Website belong to…" is the reference's sentence, verbatim, including its
 * grammar: the DBIM template prints it, and this design reproduces the template.
 */
export function DbimFooter() {
  const updated = dottedDate(getContentSyncedDate());
  return (
    <footer className="db-footer">
      <div className="db-footer__row">
        <div className="db-footer__links">
          <h2 className="db-footer__heading">Useful Links</h2>
          <ul className="db-footer__list">
            {DBIM_FOOTER_LINKS.map((l) => (
              <li key={l.path}>
                <Icon name="chevron_right" size={20} className="db-footer__chev" />
                <Link href={dbimHref(l.path)}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <p className="db-footer__owner">This Website belong to Department of Social Justice and Empowerment</p>
        </div>

        <div className="db-footer__aside">
          <div>
            <h2 className="db-footer__subscribe">Subscribe for Updates</h2>
            <ul className="db-footer__social">
              {DBIM_BRAND.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`}>
                    {s.src ? <Image src={s.src} alt="" width={24} height={24} /> : <WhatsAppOutline />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="db-footer__badges">
            <a href={DBIM_BRAND.myGov.href} target="_blank" rel="noopener noreferrer" className="db-footer__badge" aria-label="MyGov (opens in a new tab)">
              <Image src={DBIM_BRAND.myGov.src} alt="" width={100} height={40} />
            </a>
            <a href={DBIM_BRAND.indiaGovIn.href} target="_blank" rel="noopener noreferrer" className="db-footer__badge" aria-label="National Portal of India (opens in a new tab)">
              <Image src={DBIM_BRAND.indiaGovIn.src} alt="" width={100} height={40} unoptimized />
            </a>
          </div>
          {updated && <p className="db-footer__updated">Last Updated On: {updated}</p>}
        </div>
      </div>
    </footer>
  );
}

/**
 * WhatsApp as an OUTLINE glyph in one colour (`currentColor`, the footer's white), so it
 * sits with the reference's four line icons — never the filled green mark.
 */
function WhatsAppOutline() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className="db-footer__glyph"
    >
      <path d="M6.55 19.28A9.5 9.5 0 1 0 3.77 16.25L2.6 21.2Z" />
      <path transform="translate(12 11.5) scale(1.2) translate(-12 -11.5)" vectorEffect="non-scaling-stroke" d="M9.1 8.3c.25-.55.6-.7.95-.7h.35c.25 0 .45.15.55.4l.6 1.45c.1.25.05.5-.1.7l-.5.6c.45.95 1.35 1.85 2.3 2.3l.6-.5c.2-.15.45-.2.7-.1l1.45.6c.25.1.4.3.4.55v.35c0 .35-.15.7-.7.95-.6.3-1.35.35-2.05.15-2.1-.6-3.9-2.4-4.5-4.5-.2-.7-.15-1.45.15-2.05Z" />
    </svg>
  );
}
