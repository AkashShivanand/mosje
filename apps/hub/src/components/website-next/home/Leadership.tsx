import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";

/**
 * About the Department, with its Ministers.
 *
 * The purpose sentence is the Department's own (About Us, "Overview"). One
 * sentence and a link, not the classic 15,000px page in miniature (CON-17).
 * Portrait names and designations are the alt text (ACC-04). Portraits are the
 * largest copies the site holds (392px; 227px for Shri B. L. Verma). One portrait
 * set to one specification is still owed by the Department (issue BRD-07).
 */
const MINISTERS = [
  { img: "/website/content/organisation/Dr.-Virendra-Kumar.png", name: "Dr. Virendra Kumar", role: "Union Minister of Social Justice and Empowerment" },
  { img: "/website/content/organisation/Shri-Ramdas-Athawale.png", name: "Shri Ramdas Athawale", role: "Minister of State for Social Justice and Empowerment" },
  { img: "/website/content/organisation/minister_3.png", name: "Shri B. L. Verma", role: "Minister of State for Social Justice and Empowerment" },
];

export function Leadership() {
  return (
    <section className="wn-section wn-section--muted" aria-labelledby="about-title">
      <div className="sa-container wn-about">
        <div className="wn-about__copy">
          <h2 id="about-title" className="wn-about__title">
            About the Department
          </h2>
          <p className="wn-about__lead">
            The Department of Social Justice &amp; Empowerment is entrusted with the empowerment of the
            disadvantaged and marginalised sections of society.
          </p>
          <ul className="wn-about__links">
            <li><Link href="/website/about-us"><span>About the Department</span><Icon name="chevron_right" size={20} aria-hidden /></Link></li>
            <li><Link href="/website/whos-who"><span>Who’s Who</span><Icon name="chevron_right" size={20} aria-hidden /></Link></li>
            <li><Link href="/website/citizen-charter"><span>Citizen’s Charter</span><Icon name="chevron_right" size={20} aria-hidden /></Link></li>
          </ul>
        </div>
        <ul className="wn-ministers" aria-label="Ministers">
          {MINISTERS.map((m) => (
            <li key={m.name} className="wn-minister">
              <span className="wn-minister__photo">
                <Image src={m.img} alt={`${m.name}, ${m.role}`} width={160} height={160} />
              </span>
              <span className="wn-minister__name">{m.name}</span>
              <span className="wn-minister__role">{m.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
