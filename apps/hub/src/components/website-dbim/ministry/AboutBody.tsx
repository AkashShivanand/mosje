import { ABOUT_TABLES } from "@/app/website/about-us/reference-tables";
import { DBIM_ABOUT as A, aboutDocuments } from "@/lib/website-dbim/ministry";
import { DbimDocRowView, DbimExpandRow } from "./DocRow";
import { DbimRefTable } from "./RefTable";

const table = (id: string) => ABOUT_TABLES.find((t) => t.id === id);
const SECTOR_GROUPS = [...new Set(ABOUT_TABLES.map((t) => t.group).filter((g): g is string => !!g))];

/** The Department's About Us text in the reference's section order (spec §1). */
export function DbimAboutBody() {
  const docs = aboutDocuments();
  const bureau = table("bureau-allocation");
  const former = table("former-secretaries");

  return (
    <>
      <section aria-labelledby="about-overview">
        <h2 id="about-overview">Brief Overview</h2>
        <p>
          <strong>{A.overview.lead}</strong>
        </p>
        <p>{A.overview.intro}</p>
        <p>{A.overview.groupsLead}</p>
        <ul>
          {A.overview.groups.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        <p>{A.overview.after}</p>
      </section>

      <section aria-labelledby="about-history">
        <h2 id="about-history">Brief History</h2>
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
      </section>

      <section aria-labelledby="about-subjects">
        <h2 id="about-subjects">Subjects Allocated</h2>
        <p>
          <strong>{A.subjects.rules}</strong>
        </p>
        <p>
          <strong className="db-min-upper">{A.subjects.department}</strong>
        </p>
        <ul>
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
        </ul>
        <p>{A.subjects.note}</p>
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
          {A.twoDepartments} <strong>{A.secretary}</strong> is the <strong>Secretary</strong> of Department of Social
          Justice &amp; Empowerment.
        </p>
        {bureau ? (
          <>
            <p>{A.bureauLead}</p>
            <DbimRefTable table={bureau} />
          </>
        ) : null}
      </section>

      <section aria-labelledby="about-chart">
        <h2 id="about-chart">Organisation Chart</h2>
        <DbimDocRowView doc={docs.organisationChart} />
      </section>

      {docs.citizenCharter ? (
        <section aria-labelledby="about-charter">
          <h2 id="about-charter">Citizen Charter</h2>
          <DbimDocRowView doc={docs.citizenCharter} />
        </section>
      ) : null}

      {former ? (
        <section aria-labelledby="about-former">
          <h2 id="about-former">Former Secretaries</h2>
          <DbimExpandRow label="Former Secretaries">
            <DbimRefTable table={former} />
          </DbimExpandRow>
        </section>
      ) : null}

      {SECTOR_GROUPS.length > 0 ? (
        <section aria-labelledby="about-sector">
          <h2 id="about-sector">Sector-Wise Detailed Information</h2>
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
        </section>
      ) : null}
    </>
  );
}
