import { GRIEVANCE } from "@/lib/website-dbim/connect";
import "./connect.css";

/** Connect › Grievance Redressal: the lead sentence in a grey box, the CPGRAMS text, the link out. */
export function DbimGrievance() {
  return (
    <div className="db-split">
      <aside className="db-split__side">
        <div className="db-lead-box">
          <h2>{GRIEVANCE.lead}</h2>
        </div>
      </aside>
      <div className="db-split__main">
        <div className="db-prose db-prose--justify">
          {GRIEVANCE.paragraphs.map((p, i) =>
            p.heading ? (
              <p key={i}>
                <strong>{p.heading}</strong>
              </p>
            ) : (
              <p key={i}>{p.text}</p>
            ),
          )}
        </div>
        <a className="db-soft-btn" href={GRIEVANCE.link.href} target="_blank" rel="noopener noreferrer">
          {GRIEVANCE.link.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
