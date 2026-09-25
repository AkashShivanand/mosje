import Image from "next/image";
import Link from "next/link";

import { DBIM_PEOPLE } from "@/lib/website-dbim/assets";
import { DBIM_ABOUT, DBIM_ABOUT_TILES } from "@/lib/website-dbim/home-top";
import { dbimHref } from "@/lib/website-dbim/nav";
import { DbimSectionHeading } from "@/components/website-dbim/ui/SectionHeading";
import { DbimIcon } from "@/components/website-dbim/ui/icons";
import "./home-top.css";

/**
 * About Us: the Department's introduction and three tile links on the left, the three
 * Ministers in one row on the right, most senior first. The tiles follow the DBIM review
 * team's ruling of 25 Sep 2026 (Our Team · Our Organisation · Our Performance), not the
 * reference build's Our Division — see docs/research/dbim-reference/components/home-top.spec.md.
 */
export function DbimAboutUs() {
  return (
    <section className="db-about" aria-labelledby="db-about-title">
      <div className="db-about__heading">
        <DbimSectionHeading icon="about" title="About Us" id="db-about-title" />
      </div>
      <div className="db-about__left">
        <div className="db-about__copy">
          <p>
            <strong>{DBIM_ABOUT.subline}</strong>
          </p>
          <p>{DBIM_ABOUT.intro}</p>
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
        {DBIM_PEOPLE.ministers.map((m) => (
          <li key={m.name} className="db-about__minister">
            <Image src={m.src} alt={m.name} width={227} height={244} sizes="215px" className="db-about__portrait" />
            <p className="db-about__name">{m.name}</p>
            <p className="db-about__role">{m.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
