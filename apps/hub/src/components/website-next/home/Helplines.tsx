import { T } from "@/components/i18n/translation-provider";
import Link from "next/link";
import {
  ActionTile,
  Band,
  Icon,
  SectionTitle,
  buttonClasses,
} from "@mosje/design-system";
import { HELPLINES } from "./facts";

/**
 * National helplines, tap to call (MAN-07), then the live home page's "Need
 * Support?" — the three numbers that most need to be found, on the key
 * colour's darkest shade, so they read as the most important thing on the page.
 */
export function Helplines() {
  return (
    <Band
      as="section"
      tone="brandBold"
      spacing="xl"
      id="helplines"
      aria-labelledby="helplines-title"
    >
      <SectionTitle
        size="display"
        tone="inverse"
        headingId="helplines-title"
        title={<T>National Helplines</T>}
        description={<T>Toll-free from any phone in India.</T>}
      />
      <ul className="wn-home-help__list">
        {HELPLINES.map((h) => (
          <li key={h.number}>
            {/* linkAs-exempt(external-only): tel: numbers, never a route */}
            <ActionTile
              href={`tel:${h.number}`}
              layout="block"
              tone="inverse"
              value={h.number}
              title={<T>{h.name}</T>}
              description={<T>{h.sub}</T>}
              media={<Icon name={h.icon} size={24} />}
              action={
                <>
                  <Icon name="call" size={20} aria-hidden /> Call
                </>
              }
            />
          </li>
        ))}
      </ul>
      <div className="wn-home-support">
        <div>
          <h3 className="wn-home-support__title">Need Support?</h3>
          <p className="wn-home-support__lead">
            <T>Write to the Department, or lodge a grievance on CPGRAMS.</T>
          </p>
        </div>
        <div className="wn-home-support__actions">
          <Link
            href="/website/contact-us"
            className={buttonClasses(
              "primary",
              "filled",
              "md",
              undefined,
              "inverse",
            )}
          >
            <T>Contact Us</T>
          </Link>
          <a
            href="https://pgportal.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses(
              "primary",
              "outlined",
              "md",
              undefined,
              "inverse",
            )}
          >
            <T>File a Grievance</T>
            <Icon name="open_in_new" size={20} aria-hidden />
            <span className="sr-only"> (opens in a new window)</span>
          </a>
        </div>
      </div>
    </Band>
  );
}
