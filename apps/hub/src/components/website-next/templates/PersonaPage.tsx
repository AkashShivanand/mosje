import Image from "next/image";
import Link from "next/link";
import { Icon, SectionTitle, buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import type { PageHeaderProps } from "@/components/website-next/layout/PageHeader";
import { PERSONAS, PERSONA_ART, PERSONA_ICON, type PersonaId, type Scheme } from "@/lib/website-next/schemes";
import { SchemeCard } from "./SchemeCard";
import "./schemes.css";

export interface PersonaLink {
  title: string;
  /** One line saying what is behind the link, in the destination page's own words. */
  description?: string;
  href: string;
  icon: string;
  /** A site outside dosje.gov.in: opens in a new window and says so (ACC-17). */
  external?: boolean;
}

export type PersonaSection =
  | { kind: "links"; id: string; title: string; description?: string; links: PersonaLink[] }
  | {
      kind: "schemes";
      id: string;
      title: string;
      description?: string;
      schemes: Scheme[];
      who?: PersonaId;
      viewAll?: { label: string; href: string };
    }
  | { kind: "groups"; id: string; title: string; description?: string };

interface PersonaPageProps extends PageHeaderProps {
  sections: PersonaSection[];
}

/**
 * T4 — Persona landing (X-IA-07, NAV-05). The classic landings were four cards
 * linking to unfiltered lists. Here each section is real: a student sees the
 * schemes the master tags for students, a beneficiary sees all eleven groups,
 * and researchers and officials get the document shelves that exist for them.
 * No counts (decision 1: counts appear only on the grouped Schemes page).
 */
export function PersonaPage({ sections, ...header }: PersonaPageProps) {
  return (
    <PageLayout {...header}>
      {sections.map((sec, i) => (
        <section
          key={sec.id}
          id={sec.id}
          className={`wn-section${i % 2 ? " wn-section--muted" : ""}`}
          aria-labelledby={`${sec.id}-title`}
        >
          <div className="sa-container">
            <SectionTitle headingId={`${sec.id}-title`} title={sec.title} description={sec.description} />
            {sec.kind === "links" && <LinkGrid links={sec.links} />}
            {sec.kind === "schemes" && (
              <>
                <ul className="wn-scheme-grid" style={{ marginTop: "var(--sa-stack-24)" }}>
                  {sec.schemes.map((s) => (
                    <li key={s.id}>
                      <SchemeCard scheme={s} who={sec.who} />
                    </li>
                  ))}
                </ul>
                {sec.viewAll && (
                  <p className="wn-view-all">
                    <Link href={sec.viewAll.href} className={buttonClasses("primary", "outlined", "md")}>
                      {sec.viewAll.label}
                    </Link>
                  </p>
                )}
              </>
            )}
            {sec.kind === "groups" && <GroupGrid />}
          </div>
        </section>
      ))}
    </PageLayout>
  );
}

function LinkGrid({ links }: { links: PersonaLink[] }) {
  return (
    <ul className="wn-persona-links">
      {links.map((l) => (
        <li key={l.href}>
          <div className="wn-plink">
            <span className="wn-plink__icon" aria-hidden>
              <Icon name={l.icon} size={24} />
            </span>
            <span className="wn-plink__text">
              <span className="wn-plink__title">
                {l.external ? (
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.title}
                    <span className="wn-plink__ext" aria-hidden>
                      <Icon name="open_in_new" size={16} />
                    </span>
                    <span className="sr-only"> (opens in a new window)</span>
                  </a>
                ) : (
                  <Link href={l.href}>{l.title}</Link>
                )}
              </span>
              {l.description && <span className="wn-plink__sub">{l.description}</span>}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The eleven groups, each opening the finder filtered to it — the home page's pattern. */
function GroupGrid() {
  return (
    <ul className="wn-audiences">
      {PERSONAS.map((p) => {
        const art = PERSONA_ART[p.id];
        return (
          <li key={p.id}>
            <Link href={`/website/schemes-services?who=${p.id}`} className="wn-audience">
              <span className="wn-audience__mark" aria-hidden>
                {art ? (
                  <Image src={art} alt="" width={64} height={64} />
                ) : (
                  <Icon name={PERSONA_ICON[p.id] ?? "groups"} size={32} />
                )}
              </span>
              <span className="wn-audience__label">{p.label}</span>
              <span className="wn-audience__go" aria-hidden>
                <Icon name="chevron_right" size={20} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
