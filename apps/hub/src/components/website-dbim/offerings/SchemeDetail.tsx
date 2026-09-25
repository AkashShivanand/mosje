import { Icon } from "@mosje/design-system";
import type { DbimSchemeDetail as Detail } from "@/lib/website-dbim/offerings";
import { DbimPdfIcon } from "./PdfIcon";
import { DbimRegisterTable } from "./RegisterTable";

const NEW_TAB = " (opens in a new tab)";

/** The left rail: the name card, the VISIT bar and the How to Apply box (sticky from 992). */
function Rail({ d }: { d: Detail }) {
  return (
    <aside className="db-sd__rail" aria-label="About this scheme">
      <div className="db-sd__name">
        <h2>{d.name}</h2>
      </div>
      {d.visit ? (
        <a className="db-sd__visit" href={d.visit.href} target="_blank" rel="noopener noreferrer">
          <span>Visit</span>
          <span className="sr-only">
            {" "}
            {d.visit.label}
            {NEW_TAB}
          </span>
          <Icon name="open_in_new" size={24} weight={400} />
        </a>
      ) : null}
      {d.apply.length ? (
        <div className="db-sd__links">
          <p className="db-sd__links-title">How to Apply</p>
          <div className="db-sd__links-list">
            {d.apply.map((a) =>
              a.href ? (
                <a key={a.label} className="db-sd__link" href={a.href} target="_blank" rel="noopener noreferrer">
                  <Icon name="open_in_new" size={24} weight={400} />
                  <span>
                    {a.label}
                    <span className="sr-only">{NEW_TAB}</span>
                  </span>
                </a>
              ) : (
                <p key={a.label} className="db-sd__link db-sd__link--plain">
                  {a.label}
                </p>
              ),
            )}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

/** Without an ingested page: the scheme master's own facts, in the same typography.
 *  How to apply is not repeated here — the rail already lists it. */
function MasterFacts({ d }: { d: Detail }) {
  const s = d.scheme;
  return (
    <>
      <h2 className="db-sd__h">Introduction</h2>
      <div className="db-sd__prose">
        <p>{s.provides}</p>
        {s.note ? <p>{s.note}</p> : null}
      </div>
      <h2 className="db-sd__h">Who It Is For</h2>
      <div className="db-sd__prose">
        <p>{s.named}</p>
      </div>
      {d.administeredBy ? (
        <>
          <h2 className="db-sd__h">Administered By</h2>
          <div className="db-sd__prose">
            <p>{d.administeredBy}</p>
          </div>
        </>
      ) : null}
      <h2 className="db-sd__h">Sources</h2>
      <div className="db-sd__prose">
        <ol>
          {d.sources.map((src) => (
            <li key={src.text}>
              {src.href ? (
                <a href={src.href} target="_blank" rel="noopener noreferrer">
                  {src.text}
                  <span className="sr-only">{NEW_TAB}</span>
                </a>
              ) : (
                src.text
              )}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

/** The ingested page's sections; the first takes the reference's "Introduction". */
function Ingested({ d }: { d: Detail }) {
  return (
    <>
      {d.sections!.map((s, i) => (
        <section key={i} className="db-sd__section">
          {i === 0 || s.heading ? <h2 className="db-sd__h">{s.heading ?? "Introduction"}</h2> : null}
          {s.parts.map((p, j) =>
            p.kind === "register" ? (
              <DbimRegisterTable key={j} register={p.register} label={s.heading ?? d.name} />
            ) : (
              /* Ingested HTML, already through withAssetBasePath() in legacySections(). */
              <div key={j} className="db-sd__prose" dangerouslySetInnerHTML={{ __html: p.html }} />
            ),
          )}
        </section>
      ))}
    </>
  );
}

function Documents({ d }: { d: Detail }) {
  if (!d.documents.length) return null;
  return (
    <section className="db-sd__docs" aria-labelledby="db-sd-docs">
      <h2 className="db-sd__h" id="db-sd-docs">
        Documents
      </h2>
      <ul>
        {d.documents.map((doc) => (
          <li key={doc.href + doc.title} className="db-sd__doc">
            <p>{doc.title}</p>
            <span className="db-tender__type">
              <DbimPdfIcon />
              <small>{doc.size ?? doc.type ?? "File"}</small>
            </span>
            <a className="db-off-view" href={doc.href} target="_blank" rel="noopener noreferrer">
              <Icon name="visibility" size={24} weight={400} />
              View
              <span className="sr-only">
                {" "}
                {doc.title}
                {NEW_TAB}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** A scheme's page: rail on the left, the scheme's text and documents on the right. */
export function DbimSchemeDetail({ detail }: { detail: Detail }) {
  return (
    <div className="db-sd">
      <Rail d={detail} />
      <div className="db-sd__main">
        {detail.sections ? <Ingested d={detail} /> : <MasterFacts d={detail} />}
        <Documents d={detail} />
      </div>
    </div>
  );
}
