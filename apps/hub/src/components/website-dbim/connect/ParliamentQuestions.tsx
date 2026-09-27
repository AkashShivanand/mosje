import Image from "next/image";
import { Icon } from "@mosje/design-system";
import { DBIM_PARLIAMENT } from "@/lib/website-dbim/assets";
import "./connect.css";

const HOUSES = [
  { title: "Lok Sabha Questions", ...DBIM_PARLIAMENT.lokSabha },
  { title: "Rajya Sabha Questions", ...DBIM_PARLIAMENT.rajyaSabha },
];

/** Connect › Parliament Questions: one card per House, each linking to its questions archive on sansad.in. */
export function DbimParliamentQuestions() {
  return (
    <ul className="db-pq">
      {HOUSES.map((h) => (
        <li key={h.title} className="db-pq__card">
          <Image src={h.src} alt={h.alt} width={1440} height={260} sizes="(min-width: 768px) 40vw, 100vw" className="db-pq__img" />
          <div className="db-pq__body">
            <h2 className="db-pq__title">{h.title}</h2>
            <div className="db-pq__row">
              <a href={h.href} target="_blank" rel="noopener noreferrer" className="db-pq__url">
                {h.href}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={h.href} target="_blank" rel="noopener noreferrer" className="db-pq__go" aria-label={`${h.title} on sansad.in (opens in a new tab)`}>
                <Icon name="open_in_new" size={24} aria-hidden />
              </a>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
