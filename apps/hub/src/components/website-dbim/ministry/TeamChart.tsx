import Image from "next/image";
import { Icon } from "@mosje/design-system";
import { getDepartmentSecretary } from "@/data/website";
import { ABOUT_US } from "@/lib/website-shared/home";

interface ChartPerson {
  name: string;
  role: string;
  photo?: string;
}

/**
 * The reference's organisation chart (`.card-wrapper` + react-family-tree): white cards,
 * each with the round portrait sitting on its top edge, joined by lines. Spec §2.
 *
 * DRAWN AS THE HIERARCHY IT IS (DBIM 3.0 §A.5.1.2 ii, checklist 13). The chart was one
 * vertical chain — Union Minister, then Shri Ramdas Athawale, then Shri B. L. Verma —
 * which put one Minister of State above the other. It is three levels now: the Union
 * Minister; the two Ministers of State side by side; and the Secretary, who heads the
 * Department under them and whose office opens the tables below.
 *
 * The Ministers are the ones every design shows (lib/website-shared/home.ts): the live
 * site's names and designations, and the DBIM handoff file's photographs. The Secretary
 * is `getDepartmentSecretary()`, the estate's one record of the post; the live register
 * publishes no photograph of him, so his card carries the portrait placeholder rather
 * than a borrowed image.
 */
export function DbimTeamChart() {
  const ministers = ABOUT_US.ministers.map((m) => ({ name: m.name, role: m.designation, photo: m.photo, primary: "primary" in m && m.primary }));
  const secretary = getDepartmentSecretary();
  const levels: { label: string; people: ChartPerson[] }[] = [
    { label: "Union Minister", people: ministers.filter((m) => m.primary) },
    { label: "Ministers of State", people: ministers.filter((m) => !m.primary) },
    {
      label: "Secretary",
      people: [{ name: secretary.name, role: "Secretary, Department of Social Justice and Empowerment" }],
    },
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
                    {p.photo ? (
                      <Image className="db-min-profile__img" src={p.photo} alt="" width={120} height={120} sizes="120px" />
                    ) : (
                      <span className="db-min-profile__img db-min-profile__img--none" aria-hidden="true">
                        <Icon name="person" size={48} weight={300} />
                      </span>
                    )}
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
