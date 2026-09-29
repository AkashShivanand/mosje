import { ABOUT_TABLES } from "@/app/website/about-us/reference-tables";
import { DBIM_ABOUT as A, aboutDocuments } from "@/lib/website-dbim/ministry";
import { DbimDocRowView, DbimExpandRow } from "./DocRow";
import { DbimRefTable } from "./RefTable";

const table = (id: string) => ABOUT_TABLES.find((t) => t.id === id);
const SECTOR_GROUPS = [...new Set(ABOUT_TABLES.map((t) => t.group).filter((g): g is string => !!g))];

/*
 * PENDING — what the Department has not published and DBIM 3.0 §A.5.1.1 asks About Us
 * to state (checklist item 11: "Objectives and functions … displayed as List"): the
 * vision, the mission and the objectives. dosje.gov.in carries none of them — its
 * footer's "Vision & Mission" link opens About Us. Each gap renders as a marked
 * placeholder (`data-pending`), never as invented text, until the Department supplies
 * it. The same three gaps are flagged in the DBIM Figma file (About Us, 29 Sep 2026).
 */
const PENDING = {
  vision: "Vision statement to be provided by the Department.",
  mission: "Mission statement to be provided by the Department.",
  objective: "Objective to be provided by the Department.",
} as const;

/** The side box: the Department's vision, as MeitY's About Us sets it. */
export function DbimAboutVision() {
  return (
    <div className="db-min-vision">
      <p className="db-min-pending" data-pending="vision">
        {PENDING.vision}
      </p>
      <p className="db-min-vision__label">Vision Statement</p>
    </div>
  );
}

/**
 * The Department's About Us, in MeitY's order (meity.gov.in/ministry, the DBIM
 * benchmark): introduction, Mission, Objectives, Functions, then the set-up, the
 * documents, and the longer records opening in place. Mirrors the DBIM Figma file's
 * About Us frame (29 Sep 2026). The words are the Department's (DBIM_ABOUT).
 */
export function DbimAboutBody() {
  const docs = aboutDocuments();
  const bureau = table("bureau-allocation");
  const former = table("former-secretaries");

  return (
    <>
      <section aria-label="Introduction">
        <p>{A.overview.intro}</p>
        <p>{A.overview.groupsLead}</p>
        <ul>
          {A.overview.groups.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-mission">
        <h2 id="about-mission">Mission</h2>
        <p className="db-min-pending" data-pending="mission">
          {PENDING.mission}
        </p>
      </section>

      <section aria-labelledby="about-objectives">
        <h2 id="about-objectives">Objectives</h2>
        <ol className="db-min-objectives" data-pending="objectives">
          {[1, 2, 3].map((n) => (
            <li key={n} className="db-min-objective">
              <span className="db-min-objective__n" aria-hidden="true">
                {n}
              </span>
              <p className="db-min-pending">{PENDING.objective}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="about-functions">
        <h2 id="about-functions">Functions</h2>
        <p>
          Subjects allocated to the {A.subjects.department} under the {A.subjects.rules}:
        </p>
        <ol>
          <li>{A.subjects.first}</li>
          <li>
            {A.subjects.nodalLead}
            <ol type="i">
              {A.subjects.nodal.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ol>
          </li>
          {A.subjects.rest.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="db-min-note">{A.subjects.note}</p>
      </section>

      <section aria-labelledby="about-setup">
        <h2 id="about-setup">Organisational Set-Up</h2>
        {A.setUp.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
        <p>
          {A.headedBy.before}
          <strong>{A.headedBy.bold}</strong>
        </p>
        <p>
          {A.twoDepartments} <strong>{A.secretary}</strong> is the Secretary of Department of Social Justice &amp;
          Empowerment.
        </p>
      </section>

      <section aria-label="Documents">
        {docs.citizenCharter ? <DbimDocRowView doc={docs.citizenCharter} /> : null}
        <DbimDocRowView doc={docs.organisationChart} />
      </section>

      <section aria-label="More About the Department">
        <DbimExpandRow label="Brief History">
          {A.history.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
          {A.instruments.map((i) => (
            <p key={i.n}>
              {i.n} <strong>{i.name}</strong>
              {i.rest}
            </p>
          ))}
          <p>
            {A.disability.before}
            <strong>{A.disability.quote}</strong>
            {A.disability.after}
          </p>
          <p>{A.departmentsLead}</p>
          <ol>
            {A.departments.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ol>
        </DbimExpandRow>
        {bureau ? (
          <DbimExpandRow label="Bureau Head-Wise Allocation of Work">
            <p>{A.bureauLead}</p>
            <DbimRefTable table={bureau} />
          </DbimExpandRow>
        ) : null}
        {former ? (
          <DbimExpandRow label="Former Secretaries">
            <DbimRefTable table={former} />
          </DbimExpandRow>
        ) : null}
        {SECTOR_GROUPS.length > 0 ? (
          <DbimExpandRow label="Sector-Wise Detailed Information">
            {SECTOR_GROUPS.map((group) => (
              <div key={group}>
                <h3>{group}</h3>
                {ABOUT_TABLES.filter((t) => t.group === group).map((t) => (
                  <div key={t.id}>
                    <p>
                      <strong>{t.title}</strong>
                    </p>
                    <DbimRefTable table={t} />
                  </div>
                ))}
              </div>
            ))}
          </DbimExpandRow>
        ) : null}
      </section>
    </>
  );
}
