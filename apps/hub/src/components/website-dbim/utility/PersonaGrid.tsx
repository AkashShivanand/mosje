import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { DBIM_PERSONA_ICONS } from "@/lib/website-dbim/assets";
import { dbimHref } from "@/lib/website-dbim/nav";
import type { DbimPersona, DbimPersonaTile } from "@/lib/website-dbim/utility";

function Sentence({ tile }: { tile: DbimPersonaTile }) {
  const [before = "", after = ""] = tile.sentence.split("{}");
  return (
    <>
      {before}
      <strong>{tile.strong}</strong>
      {after}
    </>
  );
}

/**
 * The persona page's 2×2 grid of the reference's `.seekerbox` tiles. The whole tile is
 * the link (the reference links only its arrow square); the arrow stays as the visual
 * affordance. A tile that leaves this website says so to a screen reader.
 */
export function DbimPersonaGrid({ persona }: { persona: DbimPersona }) {
  return (
    <ul className="db-u-persona" aria-label={persona.title}>
      {persona.tiles.map((tile) => {
        const body = (
          <>
            <Image src={DBIM_PERSONA_ICONS[tile.icon]} alt="" width={48} height={48} className="db-u-persona__icon" />
            <span className="db-u-persona__text">
              <Sentence tile={tile} />
              {tile.href && <span className="sr-only"> (opens in a new tab)</span>}
            </span>
            <span className="db-u-persona__arrow" aria-hidden="true">
              <Icon name="arrow_forward" size={24} weight={400} />
            </span>
          </>
        );
        return (
          <li key={tile.strong}>
            {tile.href ? (
              <a className="db-u-persona__tile" href={tile.href} target="_blank" rel="noopener noreferrer">
                {body}
              </a>
            ) : (
              <Link className="db-u-persona__tile" href={dbimHref(tile.path ?? "/")}>
                {body}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
