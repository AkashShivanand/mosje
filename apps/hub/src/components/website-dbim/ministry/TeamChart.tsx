import Image from "next/image";
import { DBIM_PEOPLE } from "@/lib/website-dbim/assets";

/**
 * The reference's organisation chart (`.card-wrapper` + react-family-tree): the three
 * Ministers, one above the next, joined by a line, each on a white card with the
 * round portrait sitting on its top edge. Spec §2.
 */
export function DbimTeamChart() {
  return (
    <section className="db-min-chart" aria-labelledby="team-ministers">
      <h2 id="team-ministers" className="sr-only">
        Ministers
      </h2>
      <ol className="db-min-chart__list">
        {DBIM_PEOPLE.ministers.map((m) => (
          <li key={m.name} className="db-min-chart__node">
            <div className="db-min-profile">
              <Image className="db-min-profile__img" src={m.src} alt="" width={120} height={120} />
              <small className="db-min-profile__role">{m.role}</small>
              <p className="db-min-profile__name">{m.name}</p>
            </div>
          </li>
        ))}
      </ol>
      <hr className="db-min-chart__rule" />
    </section>
  );
}
