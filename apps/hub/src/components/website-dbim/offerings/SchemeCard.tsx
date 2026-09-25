import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimSchemeCard as Card } from "@/lib/website-dbim/offerings";

/**
 * One scheme on Schemes and Services — the reference's `.scheme-card`: the
 * photograph, the name, an optional portal logo top-right, what the scheme
 * provides, and the arrow to its page. Server-safe; rendered by the client grid.
 */
export function DbimSchemeCard({ card, priority = false }: { card: Card; priority?: boolean }) {
  const href = dbimHref(`/offerings/schemes-and-services/${card.id}`);
  return (
    <article className="db-scheme-card">
      <Image
        className="db-scheme-card__img"
        src={card.art}
        alt=""
        width={643}
        height={216}
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={priority}
      />
      <div className="db-scheme-card__body">
        <div className="db-scheme-card__head">
          <h2 className="db-scheme-card__title">{card.name}</h2>
          {card.logo ? (
            <Image className="db-scheme-card__logo" src={card.logo.src} alt={card.logo.alt} width={168} height={84} />
          ) : null}
        </div>
        <p className="db-scheme-card__line">{card.line}</p>
      </div>
      <div className="db-scheme-card__foot">
        <Link href={href} className="db-scheme-card__go" aria-label={`View details of ${card.name}`}>
          <Icon name="arrow_right_alt" size={24} weight={400} />
        </Link>
      </div>
    </article>
  );
}
