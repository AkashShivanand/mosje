import Image from "next/image";
import Link from "next/link";

import { ABOUT_US } from "@/lib/website-shared/home";
import { DBIM_ABOUT_TILES } from "@/lib/website-dbim/home-top";
import { dbimHref } from "@/lib/website-dbim/nav";
import { DbimSectionHeading } from "@/components/website-dbim/ui/SectionHeading";
import { DbimIcon } from "@/components/website-dbim/ui/icons";
import "./home-top.css";

/**
 * About Us: the Department's introduction and three tile links on the left, the three
 * Ministers in one row on the right, most senior first. The tiles follow the DBIM review
 * team's ruling of 25 Sep 2026 (Our Team · Our Organisation · Our Performance), not the
 * reference build's Our Division — see docs/research/dbim-reference/components/home-top.spec.md.
 *
 * The words and the Ministers are the live site's, shared with every design
 * (lib/website-shared/home.ts). The reference's "Sector overview at a glance" sub-line
 * and its one-sentence introduction are gone: the live site carries neither. The
 * photographs are the live site's too (the Department's instruction, 28 Sep 2026),
 * although at 96–160px they are drawn up to twice their size in this 200px frame;
 * larger originals have to come from the Department.
 */
export function DbimAboutUs() {
  return (
    <section className="db-about" aria-labelledby="db-about-title">
      <div className="db-about__heading">
        <DbimSectionHeading icon="about" title={ABOUT_US.title} id="db-about-title" />
      </div>
      <div className="db-about__left">
        <div className="db-about__copy">
          <p>{ABOUT_US.intro}</p>
          <p>{ABOUT_US.quote}</p>
        </div>
        <ul className="db-about__tiles">
          {DBIM_ABOUT_TILES.map((t) => (
            <li key={t.path}>
              <Link href={dbimHref(t.path)} className="db-about__tile">
                <DbimIcon name={t.icon} size={32} className="db-about__tile-icon" />
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ul className="db-about__ministers" aria-label="Ministers">
        {ABOUT_US.ministers.map((m) => (
          <li key={m.name} className="db-about__minister">
            <Image src={m.photo} alt={m.name} width={m.size} height={m.size} className="db-about__portrait" />
            <p className="db-about__name">{m.name}</p>
            <p className="db-about__role">{m.designation}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
