import { Icon } from "@mosje/design-system";

/**
 * National helplines, tap to call (issue MAN-07). Each number is taken from the
 * Department's scheme master, which cites its source: 14446 AR §3.15; 14567
 * AR §3.14; 14566 PIB 1780979 and the NHAA organisation page.
 */
const HELPLINES = [
  { number: "14446", name: "Nasha Mukt Bharat Abhiyaan", sub: "Drug de-addiction counselling and referral", icon: "self_improvement" },
  { number: "14567", name: "Elderline", sub: "National helpline for senior citizens", icon: "elderly" },
  { number: "14566", name: "National Helpline Against Atrocities", sub: "For Scheduled Castes and Scheduled Tribes", icon: "shield_person" },
];

export function Helplines() {
  return (
    <section id="helplines" className="wn-helplines" aria-labelledby="helplines-title">
      <div className="sa-container">
        <h2 id="helplines-title" className="wn-helplines__title">
          National Helplines
        </h2>
        <p className="wn-helplines__lead">Toll-free from any phone in India.</p>
        <ul className="wn-helplines__list">
          {HELPLINES.map((h) => (
            <li key={h.number}>
              <a href={`tel:${h.number}`} className="wn-helpline">
                <Icon name={h.icon} size={24} aria-hidden className="wn-helpline__icon" />
                <span className="wn-helpline__number">{h.number}</span>
                <span className="wn-helpline__name">{h.name}</span>
                <span className="wn-helpline__sub">{h.sub}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
