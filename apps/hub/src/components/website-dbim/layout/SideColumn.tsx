import type * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@mosje/design-system";
import "@/components/website-dbim/ministry/ministry.css"; // the grey box: db-min-vision
import "./side-column.css";

/** A link the side column draws: a page here opens in place; one on another site opens in a new tab, and the reader is told so. */
export interface DbimSideLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface DbimSideAction extends DbimSideLink {
  /** Heard after the label, not seen: where the button goes ("Apply on the NOS Portal"). */
  detail?: string;
}

export interface DbimSideColumnProps {
  /** Names the landmark: "About <name>". */
  name: string;
  /** The body's mark, drawn 84 high as MeitY's organisation card draws it. Organisations only. */
  mark?: string;
  /** Show the name in the box, in the key colour (DBIM 3.0 Figure 71). A page whose mark names it leaves it out. */
  showName?: boolean;
  /** One line on what the page's subject is: "Central Sector Scheme, under …", "Constitutional Body". */
  standing?: string;
  /** The body's own statement, in the key colour at body size. */
  statement?: string;
  /** Headline figures, the figure above its label. */
  facts?: { label: string; value: string }[];
  actions?: DbimSideAction[];
  /** The page's sections, in page order. Shown when there are two or more. */
  index?: { id: string; label: string }[];
  /** Pages elsewhere, grouped under the index. */
  related?: { label: string; links: DbimSideLink[] }[];
}

const NEW_TAB = " (opens in a new tab)";

function SideAnchor({ link, className, detail, children }: { link: DbimSideLink; className?: string; detail?: string; children: React.ReactNode }) {
  const heard = `${detail ? ` — ${detail}` : ""}${link.external ? NEW_TAB : ""}`;
  const sr = heard ? <span className="sr-only">{heard}</span> : null;
  return link.external ? (
    <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">
      {children}
      {sr}
    </a>
  ) : (
    <Link className={className} href={link.href}>
      {children}
      {sr}
    </Link>
  );
}

/**
 * The side column of a DBIM detail page — the Figma library's Side Column (Inner
 * Page), one component for a scheme and an organisation. The grey box carries who
 * or what the page is about and its one or two actions; the page's index sits under
 * it and, from 992, stays in view beside the sections. Below 992 the index becomes
 * a wrap of buttons above the sections.
 *
 * Every part renders only when the page supplies it, so a scheme draws its name,
 * standing and Apply Now, and an organisation its mark, standing, statement, figures
 * and links, from the same markup.
 *
 * Goes in the first cell of `db-min-detail` (ministry.css).
 */
export function DbimSideColumn({ name, mark, showName, standing, statement, facts = [], actions = [], index = [], related = [] }: DbimSideColumnProps) {
  return (
    <aside className="db-side" aria-label={`About ${name}`}>
      <div className="db-min-vision db-side__id">
        {mark ? <Image className="db-side__mark" src={mark} alt="" width={168} height={84} sizes="168px" /> : null}
        {showName ? <p className="db-side__name">{name}</p> : null}
        {standing ? <p className="db-side__standing">{standing}</p> : null}
        {statement ? <p className="db-side__statement">{statement}</p> : null}
        {facts.length ? <DbimSideFacts facts={facts} /> : null}
        {actions.map((a) => (
          <SideAnchor key={a.href} link={a} detail={a.detail} className="db-side__action">
            {a.label}
            <Icon name={a.external ? "open_in_new" : "arrow_right_alt"} size={20} weight={400} aria-hidden="true" />
          </SideAnchor>
        ))}
      </div>

      {index.length > 1 || related.length ? (
        <nav className="db-side__index" aria-labelledby="db-side-index">
          <p className="db-side__index-title" id="db-side-index">
            On This Page
          </p>
          <ul>
            {index.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
          {related.map((g) => (
            <div key={g.label} className="db-side__related">
              <p className="db-side__index-title">{g.label}</p>
              <ul>
                {g.links.map((l) => (
                  <li key={l.href}>
                    <SideAnchor link={l}>
                      {l.label}
                      {l.external ? <Icon name="open_in_new" size={16} weight={400} aria-hidden="true" /> : null}
                    </SideAnchor>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      ) : null}
    </aside>
  );
}

/** The side column's figures — the figure reads first, the label names it. An event's page sets its facts the same way. */
export function DbimSideFacts({ facts, className }: { facts: { label: string; value: string }[]; className?: string }) {
  return (
    <dl className={`db-side__facts${className ? ` ${className}` : ""}`}>
      {facts.map((f) => (
        <div key={f.label} className="db-side__fact">
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
