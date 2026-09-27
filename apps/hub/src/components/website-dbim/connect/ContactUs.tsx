import { Icon } from "@mosje/design-system";
import { getDbimContact } from "@/lib/website-dbim/connect";
import "./connect.css";

/**
 * Connect › Contact Us: the Department's address beside one map (the reference's
 * `.addressbox` and `.mapbox`). The map is a lazy, titled iframe — nothing loads
 * from Google until the reader scrolls it into view.
 */
export function DbimContactUs() {
  const c = getDbimContact();
  return (
    <div className="db-contact">
      <div className="db-contact__address">
        <Icon name="location_on" size={24} aria-hidden />
        <div>
          <h2>{c.heading}</h2>
          <p>
            {c.lines.map((l, i) => (
              <span key={l}>
                {i > 0 && <br />}
                {l}
              </span>
            ))}
          </p>
          {(c.phone || c.email) && (
            <p className="db-contact__reach">
              {c.phone && (
                <span>
                  <span className="sr-only">Telephone: </span>
                  {c.phone}
                </span>
              )}
              {c.email && (
                <span>
                  <span className="sr-only">Email: </span>
                  {c.email}
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="db-contact__map">
        <iframe title="Map showing the Department's office at GPOA-3, Netaji Nagar, New Delhi" src={c.mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    </div>
  );
}
