import Image from "next/image";
import { ABOUT_US } from "@/lib/website-shared/home";

/**
 * The reference's organisation chart (`.card-wrapper` + react-family-tree): the three
 * Ministers, one above the next, joined by a line, each on a white card with the
 * round portrait sitting on its top edge. Spec §2.
 *
 * The Ministers are the ones every design shows (lib/website-shared/home.ts): the live
 * site's names and designations, and the DBIM handoff file's photographs. Until
 * 28 Sep 2026 this chart kept its own list — the reference build's portraits and
 * its shortened "Hon'ble Minister of State" roles.
 */
export function DbimTeamChart() {
  return (
    <section className="db-min-chart" aria-labelledby="team-ministers">
      <h2 id="team-ministers" className="sr-only">
        Ministers
      </h2>
      <ol className="db-min-chart__list">
        {ABOUT_US.ministers.map((m) => (
          <li key={m.name} className="db-min-chart__node">
            <div className="db-min-profile">
              <Image className="db-min-profile__img" src={m.photo} alt="" width={120} height={120} sizes="120px" />
              <small className="db-min-profile__role">{m.designation}</small>
              <p className="db-min-profile__name">{m.name}</p>
            </div>
          </li>
        ))}
      </ol>
      <hr className="db-min-chart__rule" />
    </section>
  );
}
