import Image from "next/image";
import { Icon } from "@mosje/design-system";

import { PM_QUOTE as Q } from "@/lib/website-shared/home";
import { DbimIcon } from "@/components/website-dbim/ui/icons";
import "./home-top.css";

/**
 * The Prime Minister's quote band (DBIM 3.0 §7.3(iv)) — the reference's layout, the
 * Department's quotation: round portrait left, the quote in the darkest shade of the
 * colour group, a rule, then the event and date and a link to where it was delivered.
 * The quotation and photograph are shared with every design (lib/website-shared/home.ts);
 * only the date's dd.mm.yyyy form is this layout's own, as the reference prints it.
 */
export function DbimPmQuote() {
  // The original photograph, on white in its round frame. The transparent cut-out
  // (DBIM 3.0 A.4.1.2 iv) is a different photograph; the Department chose this one (28 Sep 2026).
  const pm = Q.image.portrait;
  const [y, m, d] = Q.dateTime.split("-");
  return (
    <section className="db-pmq" aria-labelledby="db-pmq-title">
      <h2 id="db-pmq-title" className="db-hometop-sr">
        Quote from the Prime Minister
      </h2>
      <div className="db-pmq__in">
        <div className="db-pmq__figure">
          <Image src={pm.src} alt={Q.image.alt} width={260} height={260} sizes="260px" className="db-pmq__portrait" />
        </div>
        <figure className="db-pmq__body">
          {/* Decorative (DbimIcon is aria-hidden): the quotation is marked up as a
              blockquote. The opening mark only — see home-top.css. */}
          <div className="db-pmq__mark">
            <DbimIcon name="format-quote" size={32} />
          </div>
          <blockquote className="db-pmq__quote" cite={Q.source.href}>
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
                <time dateTime={Q.dateTime}>{`${d}.${m}.${y}`}</time>
              </p>
            </div>
            <a href={Q.source.href} target="_blank" rel="noopener noreferrer" className="db-pmq__action">
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
