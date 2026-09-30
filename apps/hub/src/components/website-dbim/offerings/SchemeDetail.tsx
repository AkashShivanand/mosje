import type * as React from "react";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import type { DbimSchemeBlock, DbimSchemeDetail as Detail, DbimSchemeFact, DbimSchemePart } from "@/lib/website-dbim/offerings";
import { dbimHref } from "@/lib/website-dbim/nav";
import { DbimPdfIcon } from "./PdfIcon";
import { DbimRegisterTable } from "./RegisterTable";
import { DbimSideColumn } from "@/components/website-dbim/layout/SideColumn";
import "@/components/website-dbim/ministry/ministry.css"; // the DBIM detail layout: db-min-detail, db-min-rich

const NEW_TAB = " (opens in a new tab)";

interface PageSection {
  id: string;
  title: string;
  body: React.ReactNode;
  className?: string;
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

const filled = (block: DbimSchemeBlock | null): block is DbimSchemeBlock => Boolean(block && (block.facts.length || block.parts.length));

function BlockBody({ block, label }: { block: DbimSchemeBlock; label: string }) {
  return (
    <>
      <Parts parts={block.parts} label={label} />
      <Facts facts={block.facts} />
    </>
  );
}

/** Where to apply, then how: the routes are alternatives, so they are not numbered. */
function ProcessBody({ d }: { d: Detail }) {
  const more = d.process.length > 0;
  return (
    <>
      {d.routes.length ? (
        <div className="db-sd__prose">
          {more ? <h3>Where to Apply</h3> : null}
          <ul>
            {d.routes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <Parts parts={d.process} label="Application Process" />
    </>
  );
}

function DocumentsBody({ d }: { d: Detail }) {
  return (
    <>
      <Parts parts={d.documentParts} label="Documents" />
      {d.documents.length ? (
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
      ) : null}
    </>
  );
}

/** The sections this scheme fills, in the Scheme Details template's order (MoSJE
 *  [Handoff] 3363:13864). The rail's list and the page are built from this one list,
 *  so the one cannot name a section the other does not show. */
function sectionsOf(d: Detail): PageSection[] {
  const out: PageSection[] = d.about.map((s, i) => ({
    id: i === 0 ? "about" : `about-${i}`,
    title: s.heading ?? "About the Scheme",
    body: <Parts parts={s.parts} label={s.heading ?? d.name} />,
  }));
  if (filled(d.eligibility)) out.push({ id: "eligibility", title: "Eligibility", body: <BlockBody block={d.eligibility} label="Eligibility" /> });
  if (filled(d.benefits))
    out.push({ id: "benefits", title: "Benefits & Financial Assistance", body: <BlockBody block={d.benefits} label="Benefits" /> });
  if (d.routes.length || d.process.length) out.push({ id: "application-process", title: "Application Process", body: <ProcessBody d={d} /> });
  if (d.documents.length || d.documentParts.length) out.push({ id: "documents", title: "Documents", body: <DocumentsBody d={d} />, className: "db-sd__docs" });
  if (d.faqs.length)
    out.push({
      id: "faqs",
      title: "FAQs",
      body: (
        <div className="db-sd__prose">
          {d.faqs.map((f) => (
            <div key={f.label}>
              <h3>{f.label}</h3>
              {f.text ? <p>{f.text}</p> : null}
            </div>
          ))}
        </div>
      ),
    });
  if (d.contact.length)
    out.push({
      id: "contact",
      title: "Contact & Support",
      body: (
        <>
          <Facts facts={d.contact} />
          <div className="db-sd__prose">
            <p>
              <Link href={dbimHref("/connect")}>Contact Us</Link>
            </p>
          </div>
        </>
      ),
    });
  return out;
}

/**
 * A scheme's page: DBIM's detail layout — the side column (DBIM 3.0 Figure 71: the
 * scheme's name in the key colour, its standing, the one Apply Now, then the page's
 * index), then the template's sections in the reference's rich text. The reference's
 * VISIT bar and "Scheme Versions" box are gone — the box's button is the one way to
 * apply, and its label is just that.
 */
export function DbimSchemeDetail({ detail }: { detail: Detail }) {
  const sections = sectionsOf(detail);
  return (
    <div className="db-min-detail db-sd">
      <DbimSideColumn
        name={detail.name}
        showName
        standing={detail.standing}
        actions={detail.applyAt ? [{ href: detail.applyAt.href, label: "Apply Now", external: true, detail: detail.applyAt.label }] : []}
        index={sections.map((s) => ({ id: s.id, label: s.title }))}
      />
      <div className="db-min-rich db-sd__main">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className={`db-sd__section${s.className ? ` ${s.className}` : ""}`} aria-labelledby={`${s.id}-h`}>
            <h2 id={`${s.id}-h`}>{s.title}</h2>
            {s.body}
          </section>
        ))}
      </div>
    </div>
  );
}
