import { Accordion, AccordionItem } from "@mosje/design-system";
import {
  RTI_ADDRESS,
  RTI_CPIO_LIST_URL,
  RTI_HANDBOOK_URL,
  RTI_INTRO,
  RTI_SUBMISSION,
  getRtiOfficers,
  type RtiOfficer,
} from "@/lib/website-dbim/connect";
import { DbimEmptyState } from "@/components/website-dbim/ui/EmptyState";
import "./connect.css";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

/**
 * Connect › RTI: the "RTI Details" side menu, the Act's introduction and where to
 * apply, then the CPIO and FAA registers as the reference's two accordions.
 */
export function DbimRti() {
  const { cpio, faa } = getRtiOfficers();
  return (
    <div className="db-split">
      <aside className="db-split__side" aria-label="RTI Details">
        <Accordion className="db-rti-nav">
          <AccordionItem title="RTI Details" defaultOpen>
            <ul>
              <li>
                <a href={RTI_HANDBOOK_URL} target="_blank" rel="noopener noreferrer">
                  Detailed RTI
                  {NEW_TAB}
                </a>
              </li>
            </ul>
          </AccordionItem>
        </Accordion>
      </aside>

      <div className="db-split__main">
        <h2 className="db-heading">RTI</h2>
        <div className="db-prose db-prose--rti">
          <p>
            <strong>Introduction</strong>
          </p>
          <p>{RTI_INTRO}</p>
          <p>
            <strong>{RTI_ADDRESS[0]}</strong>
            {RTI_ADDRESS.slice(1).map((l) => (
              <span key={l}>
                <br />
                {l}
              </span>
            ))}
          </p>
          <p>
            <strong>Submission of application under RTI Act</strong>
          </p>
          <p>{RTI_SUBMISSION}</p>
        </div>

        <Accordion className="db-rti-acc">
          <AccordionItem title="1. List of CPIO">
            <OfficerTable officers={cpio} caption="Central Public Information Officers" />
            <p className="db-rti-more">
              <a href={RTI_CPIO_LIST_URL} target="_blank" rel="noopener noreferrer">
                List of CPIOs and FAAs of the Department (PDF)
                {NEW_TAB}
              </a>
            </p>
          </AccordionItem>
          <AccordionItem title="2. List of FAA">
            <OfficerTable officers={faa} caption="First Appellate Authorities" />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function OfficerTable({ officers, caption }: { officers: RtiOfficer[]; caption: string }) {
  if (officers.length === 0) return <DbimEmptyState />;
  return (
    <div className="db-table-wrap">
      <table className="db-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">S.No.</th>
            <th scope="col">Name</th>
            <th scope="col">Designation</th>
            <th scope="col">Office</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {officers.map((o, i) => (
            <tr key={o.key}>
              <td>{i + 1}</td>
              <td>{o.name}</td>
              <td>{o.designation}</td>
              <td>{o.office}</td>
              <td>{o.email && <a href={`mailto:${o.email}`}>{o.email}</a>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
