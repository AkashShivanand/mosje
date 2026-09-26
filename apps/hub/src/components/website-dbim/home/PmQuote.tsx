import Image from "next/image";
import { Icon } from "@mosje/design-system";

import { DBIM_PEOPLE } from "@/lib/website-dbim/assets";
import { DBIM_PM_QUOTE as Q } from "@/lib/website-dbim/home-top";
import "./home-top.css";

/**
 * The Prime Minister's quote band (DBIM 3.0 §7.3(iv)) — the reference's layout, the
 * Department's quotation: round portrait left, the quote in the darkest shade of the
 * colour group, a rule, then the event and date and a link to where it was delivered.
 */
export function DbimPmQuote() {
  const pm = DBIM_PEOPLE.primeMinister;
  return (
    <section className="db-pmq" aria-labelledby="db-pmq-title">
      <h2 id="db-pmq-title" className="db-hometop-sr">
        Quote from the Prime Minister
      </h2>
      <div className="db-pmq__in">
        <div className="db-pmq__figure">
          <Image src={pm.src} alt={pm.alt} width={260} height={260} sizes="260px" className="db-pmq__portrait" />
        </div>
        <figure className="db-pmq__body">
          {/* Decorative: the quotation is marked up as a blockquote. Material's closing
              quote turned half a circle is the reference's heavy opening “. */}
          <div className="db-pmq__mark" aria-hidden="true">
            <Icon name="format_quote" fill size={32} />
          </div>
          <blockquote className="db-pmq__quote" cite={Q.href}>
            <p>{Q.quote}</p>
          </blockquote>
          <div className="db-pmq__rule" />
          <figcaption className="db-pmq__foot">
            <div>
              <p className="db-pmq__meta">
                <span className="db-hometop-sr">{Q.attribution}, </span>
                {Q.event}
              </p>
              <p className="db-pmq__meta">
                <time dateTime={Q.dateTime}>{Q.date}</time>
              </p>
            </div>
            <a href={Q.href} target="_blank" rel="noopener noreferrer" className="db-pmq__action">
              <Icon name="open_in_new" size={24} />
              View Event
              <span className="db-hometop-sr">: {Q.event} (opens in a new tab)</span>
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
