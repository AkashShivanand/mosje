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
                    <Image src={s.src} alt="" width={24} height={24} />
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
