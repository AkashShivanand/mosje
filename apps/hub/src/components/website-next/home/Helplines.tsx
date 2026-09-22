import Link from "next/link";
import { Icon, SectionTitle, buttonClasses } from "@mosje/design-system";
import { HELPLINES } from "./facts";

/**
 * National helplines, tap to call (MAN-07), then the live home page's "Need
 * Support?" — the three numbers that most need to be found, on the page's
 * deepest ground, so they read as the most important thing on it.
 */
export function Helplines() {
  return (
    <section id="helplines" className="wn-home-help" aria-labelledby="helplines-title">
      <div className="sa-container">
        <div className="wn-home-help__head">
          <SectionTitle size="display" tone="inverse" headingId="helplines-title" title="National Helplines" description="Toll-free from any phone in India." />
        </div>
        <ul className="wn-home-help__list">
          {HELPLINES.map((h) => (
            <li key={h.number}>
              <a href={`tel:${h.number}`} className="wn-home-helpline">
                <span className="wn-home-helpline__icon" aria-hidden>
                  <Icon name={h.icon} size={24} />
                </span>
                <span className="wn-home-helpline__number">{h.number}</span>
                <span className="wn-home-helpline__name">{h.name}</span>
                <span className="wn-home-helpline__sub">{h.sub}</span>
                <span className="wn-home-helpline__call">
                  <Icon name="call" size={20} aria-hidden />
                  Call
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="wn-home-support">
          <div>
            <h3 className="wn-home-support__title">Need Support?</h3>
            <p className="wn-home-support__lead">Write to the Department, or lodge a grievance on CPGRAMS.</p>
          </div>
          <div className="wn-home-support__actions">
            <Link href="/website/contact-us" className={buttonClasses("primary", "filled", "md", undefined, "inverse")}>
              Contact Us
            </Link>
            <a
              href="https://pgportal.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("primary", "outlined", "md", undefined, "inverse")}
            >
              File a Grievance
              <Icon name="open_in_new" size={20} aria-hidden />
              <span className="sr-only"> (opens in a new window)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
