import type * as React from "react";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import type { DbimSchemeBlock, DbimSchemeDetail as Detail, DbimSchemeFact, DbimSchemePart } from "@/lib/website-dbim/offerings";
import { dbimHref } from "@/lib/website-dbim/nav";
import { DbimPdfIcon } from "./PdfIcon";
import { DbimRegisterTable } from "./RegisterTable";

const NEW_TAB = " (opens in a new tab)";

/**
 * The left rail: the name card, the VISIT bar and the How to Apply box (sticky from 992).
 * The bar names where it goes — the reference's bare "VISIT" did not say — and the box
 * lists only the routes the bar does not already open.
 */
function Rail({ d }: { d: Detail }) {
  return (
    <aside className="db-sd__rail" aria-label="About this scheme">
      <div className="db-sd__name">
        <h2>{d.name}</h2>
      </div>
      {d.visit ? (
        <a className="db-sd__visit" href={d.visit.href} target="_blank" rel="noopener noreferrer">
          <span>
            {d.visit.label}
            <span className="sr-only">{NEW_TAB}</span>
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

/** Ingested HTML, already through withAssetBasePath() in legacySections(). */
function Parts({ parts, label }: { parts: DbimSchemePart[]; label: string }) {
  return (
    <>
      {parts.map((p, j) =>
        p.kind === "register" ? (
          <DbimRegisterTable key={j} register={p.register} label={label} />
        ) : (
          <div key={j} className="db-sd__prose" dangerouslySetInnerHTML={{ __html: p.html }} />
        ),
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="db-sd__section">
      <h2 className="db-sd__h">{title}</h2>
      {children}
    </section>
  );
}

/** Labelled facts in the reference's body text: "Label: text", or the label alone. */
function Facts({ facts }: { facts: DbimSchemeFact[] }) {
  if (!facts.length) return null;
  return (
    <div className="db-sd__prose">
      <ul>
        {facts.map((f) => (
          <li key={f.label + (f.text ?? "")}>
            {f.text ? (
              <>
                <strong>{f.label}:</strong> {f.href ? <a href={f.href}>{f.text}</a> : f.text}
              </>
            ) : (
              f.label
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Block({ title, block, label }: { title: string; block: DbimSchemeBlock | null; label: string }) {
  if (!block || (!block.facts.length && !block.parts.length)) return null;
  return (
    <Section title={title}>
      <Parts parts={block.parts} label={label} />
      <Facts facts={block.facts} />
    </Section>
  );
}

function Faqs({ d }: { d: Detail }) {
  if (!d.faqs.length) return null;
  return (
    <Section title="FAQs">
      <div className="db-sd__prose">
        {d.faqs.map((f) => (
          <div key={f.label}>
            <h3>{f.label}</h3>
            {f.text ? <p>{f.text}</p> : null}
          </div>
        ))}
      </div>
    </Section>
  );
}

function Contact({ d }: { d: Detail }) {
  if (!d.contact.length) return null;
  return (
    <Section title="Contact & Support">
      <Facts facts={d.contact} />
      <div className="db-sd__prose">
        <p>
          <Link href={dbimHref("/connect")}>Contact Us</Link>
        </p>
      </div>
    </Section>
  );
}

function Sources({ d }: { d: Detail }) {
  if (!d.scheme || !d.sources.length) return null;
  return (
    <Section title="Sources">
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
    </Section>
  );
}

function Documents({ d }: { d: Detail }) {
  if (!d.documents.length && !d.documentParts.length) return null;
  return (
    <section className="db-sd__docs" aria-labelledby="db-sd-docs">
      <h2 className="db-sd__h" id="db-sd-docs">
        Documents
      </h2>
      <Parts parts={d.documentParts} label="Documents" />
      <ul>
        {d.documents.map((doc) => (
          <li key={doc.href + doc.title} className="db-sd__doc">
            <p>{doc.title}</p>
            {/* DBIM 3.0 A.5.3 ii: the date of release, day before month (A.5.6 viii). */}
            <span className="db-sd__doc-date">{doc.date ? <small>{doc.date}</small> : null}</span>
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

/**
 * A scheme's page: rail on the left; on the right, the Scheme Details template's
 * sections (MoSJE [Handoff] 3363:13864) in the reference's typography.
 */
export function DbimSchemeDetail({ detail }: { detail: Detail }) {
  return (
    <div className="db-sd">
      <Rail d={detail} />
      <div className="db-sd__main">
        {detail.about.map((s, i) => (
          <Section key={i} title={s.heading ?? "About the Scheme"}>
            <Parts parts={s.parts} label={s.heading ?? detail.name} />
          </Section>
        ))}
        <Block title="Eligibility" block={detail.eligibility} label="Eligibility" />
        <Block title="Benefits & Financial Assistance" block={detail.benefits} label="Benefits" />
        {detail.steps.length || detail.process.length ? (
          <Section title="Application Process">
            {detail.steps.length ? (
              <div className="db-sd__prose">
                <ol>
                  {detail.steps.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              </div>
            ) : null}
            <Parts parts={detail.process} label="Application Process" />
          </Section>
        ) : null}
        <Documents d={detail} />
        <Faqs d={detail} />
        <Contact d={detail} />
        <Sources d={detail} />
      </div>
    </div>
  );
}
