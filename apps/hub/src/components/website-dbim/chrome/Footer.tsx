import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";

import { getContentSyncedDate } from "@/lib/website/content";
import { DBIM_BRAND } from "@/lib/website-dbim/assets";
import { DBIM_FOOTER_LINKS, dbimHref } from "@/lib/website-dbim/nav";
import { dbimDate } from "@/lib/website-dbim/date";
import { DbimIcon } from "../ui/icons";
import "./footer.css";


/**
 * The DBIM footer: Useful Links, Follow Us (the Department's four social accounts —
 * headed "Subscribe for Updates" in the reference; renamed on the instruction of
 * 8 Oct 2026, because the icons follow an account, they subscribe to nothing), the MyGov and india.gov.in badges, the ownership line and the date the
 * content was last updated — the date of the estate's last content ingest.
 *
 * "This Website belong to…" is the reference's sentence, verbatim, including its
 * grammar: the DBIM template prints it, and this design reproduces the template.
 */
export function DbimFooter() {
  const updated = dbimDate(getContentSyncedDate());
  return (
    <footer className="db-footer">
      <div className="db-footer__row">
        <div className="db-footer__links">
          <h2 className="db-footer__heading">Useful Links</h2>
          <ul className="db-footer__list">
            {DBIM_FOOTER_LINKS.map((l) => (
              <li key={l.path}>
                <Icon name="chevron_right" size={24} className="db-footer__chev" />
                <Link href={dbimHref(l.path)}>{l.label}</Link>
              </li>
            ))}
          </ul>
          {/* DBIM 3.0 §5.6 ii, a Central Government Department's lineage, word for word. */}
          <p className="db-footer__owner">
            The website belongs to Department of Social Justice and Empowerment, Ministry of Social Justice and
            Empowerment, Government of India
          </p>
        </div>

        <div className="db-footer__aside">
          <div>
            <h2 className="db-footer__subscribe">Follow Us</h2>
            <ul className="db-footer__social">
              {DBIM_BRAND.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`}>
                    <DbimIcon name={s.icon} size={24} className="db-footer__glyph" />
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
