import type * as React from "react";
import { Icon } from "@mosje/design-system";
import type { DbimTeamMember, DbimTeamOffice } from "@/lib/website-dbim/ministry";

function Line({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="db-min-contact">
      <Icon name={icon} size={24} weight={400} aria-hidden="true" />
      <span className="sr-only">{label}: </span>
      <p>{children}</p>
    </div>
  );
}

function Member({ m }: { m: DbimTeamMember }) {
  const hasContact = m.phones.length + m.faxes.length + m.emails.length > 0 || m.intercom;
  return (
    <div role="row" className="db-min-office__row">
      <div role="cell" className="db-min-office__cell">
        <small className="db-min-office__label">
          Name and Designation:
        </small>
        <div className="db-min-office__value">
          <p className="db-min-office__name">{m.name}</p>
          {m.designation}
        </div>
      </div>
      <div role="cell" className="db-min-office__cell">
        <small className="db-min-office__label">
          Contact:
        </small>
        <div className="db-min-office__value">
          {m.phones.length > 0 ? (
            <Line icon="call" label="Telephone">
              {m.phones.map((n, i) => (
                <span key={`${n.text}-${i}`}>
                  {n.tel ? <a href={`tel:${n.tel}`}>{n.text}</a> : n.text}
                  {i < m.phones.length - 1 ? ", " : ""}
                </span>
              ))}
            </Line>
          ) : null}
          {m.faxes.length > 0 ? (
            <Line icon="print" label="Fax">
              {m.faxes.join(", ")}
            </Line>
          ) : null}
          {m.emails.length > 0 ? (
            <Line icon="mail" label="Email">
              {m.emails.join(", ")}
            </Line>
          ) : null}
          {m.intercom ? (
            <Line icon="deskphone" label="Intercom">
              {m.intercom}
            </Line>
          ) : null}
          {hasContact ? null : <p>–</p>}
        </div>
      </div>
      <div role="cell" className="db-min-office__cell">
        <small className="db-min-office__label">
          Address:
        </small>
        <p className="db-min-office__value">{m.address ?? "–"}</p>
      </div>
    </div>
  );
}

/**
 * One office's officers (`.our-team-list-container`): the blue office bar, the pale
 * column-header row, then a row per officer. A `role="table"` of rows and cells, as
 * the reference marks it, so the columns are announced without a layout table.
 */
export function DbimTeamOffice({ office }: { office: DbimTeamOffice }) {
  const captionId = `office-${office.id}`;
  return (
    <section className="db-min-office" aria-labelledby={captionId}>
      <h2 className="db-min-office__bar" id={captionId}>
        <Icon name="apartment" size={24} weight={400} aria-hidden="true" />
        <span>{office.label}</span>
      </h2>
      <div role="table" aria-labelledby={captionId}>
        <div role="rowgroup">
          <div role="row" className="db-min-office__head">
            <div role="columnheader">
              <small>Name and Designation</small>
            </div>
            <div role="columnheader">
              <small>Contact</small>
            </div>
            <div role="columnheader">
              <small>Address</small>
            </div>
          </div>
        </div>
        <div role="rowgroup">
          {office.members.map((m) => (
            <Member key={`${m.name}-${m.designation}`} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
