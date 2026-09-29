import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimSchemeCard as Card } from "@/lib/website-dbim/offerings";

/**
 * One scheme on Schemes and Services — the reference's `.scheme-card`: the live
 * listing's image, the name, "Who It Is For", and the arrow to its page.
 * Server-safe; rendered by the client grid.
 */
export function DbimSchemeCard({ card, priority = false }: { card: Card; priority?: boolean }) {
  const href = dbimHref(`/offerings/schemes-and-services/${card.id}`);
  return (
    <article className="db-scheme-card">
      <div className="db-scheme-card__media">
        <Image
          className="db-scheme-card__img"
          src={card.art.src}
          alt=""
          fill
          style={{ objectPosition: card.art.position }}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={priority}
        />
      </div>
      <div className="db-scheme-card__body">
        <div className="db-scheme-card__head">
          <h2 className="db-scheme-card__title">{card.name}</h2>
        </div>
        {card.line ? <p className="db-scheme-card__line">{card.line}</p> : null}
      </div>
      <div className="db-scheme-card__foot">
        <Link href={href} className="db-scheme-card__go" aria-label={`View details of ${card.name}`}>
          <Icon name="arrow_right_alt" size={24} weight={400} />
        </Link>
      </div>
    </article>
  );
}
