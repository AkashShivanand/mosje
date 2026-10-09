import Image from "next/image";
import { ABOUT_US } from "@/lib/website-shared/home";

interface ChartPerson {
  name: string;
  role: string;
  photo: string;
}

/**
 * The reference's organisation chart (`.card-wrapper` + react-family-tree): white cards,
 * each with the round headshot sitting on its top edge, joined by lines. Spec §2.
 *
 * THE TREE THE DEPARTMENT'S REFERENCE DRAWS (29 Sep 2026): the Union Minister above,
 * and the two Ministers of State side by side beneath, joined by a bar that runs just
 * above their headshots. Until 28 Sep 2026 this was one vertical chain, which put one
 * Minister of State above the other; for a day it also carried the Secretary as a third
 * level, which the reference does not draw. The Secretary heads the first office table
 * below the chart.
 *
 * Headshots sit on white, round (DBIM 3.0 §6.1.4 i). The Ministers are the ones every
 * design shows (lib/website-shared/home.ts): the live site's names and designations,
 * and the DBIM handoff file's photographs.
 */
export function DbimTeamChart() {
  const people = ABOUT_US.ministers.map((m) => ({ name: m.name, role: m.designation, photo: m.photo, primary: "primary" in m && m.primary }));
  const levels: { label: string; people: ChartPerson[] }[] = [
    { label: "Union Minister", people: people.filter((m) => m.primary) },
    { label: "Ministers of State", people: people.filter((m) => !m.primary) },
  ].filter((l) => l.people.length > 0);

  return (
    <section className="db-min-chart" aria-labelledby="team-chart">
      <h2 id="team-chart" className="sr-only">
        Organisation Chart
      </h2>
      <ol className="db-min-chart__levels">
        {levels.map((level) => (
          <li key={level.label} className={`db-min-chart__level${level.people.length > 1 ? " db-min-chart__level--peers" : ""}`}>
            <ul className="db-min-chart__row" aria-label={level.label}>
              {level.people.map((p) => (
                <li key={p.name} className="db-min-chart__node">
                  <div className="db-min-profile">
                    <Image className="db-min-profile__img" src={p.photo} alt="" width={120} height={120} sizes="120px" />
                    <small className="db-min-profile__role">{p.role}</small>
                    <p className="db-min-profile__name">{p.name}</p>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <hr className="db-min-chart__rule" />
    </section>
  );
}
