import { Band, SectionTitle } from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";
import {
  OFFERINGS,
  PERSONAS,
  PERSONA_ART,
  ROUTES,
  matchSchemes,
} from "@/lib/website-next/schemes";
import { getTenders, getVacancies } from "@/lib/website/content";
import { newestFirst, whatsNew } from "@/lib/website-next/whats-new";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import {
  dedupeNotices,
  displayNoticeTitle,
  isTruncatedTitle,
  tidyTitle,
} from "@/components/website-next/ui/records";
import { OfferingsExplorer } from "./OfferingsExplorer";
import type { NoticeRow, PersonaBlock } from "./OfferingsExplorer";

/**
 * Our Offerings — the schemes, vacancies and tenders of the Department, in one
 * section, as the design draws it.
 *
 * Figma "Home — Secretary Review", `our-offerings`: three tabs, the eleven
 * groups of the Department's mandate as chips, the chosen group's own line, the
 * portal it applies through, three of its schemes, and What's New in a column
 * beside them. It replaces three sections that were doing the same work apart —
 * a grid of six featured scheme cards, a grid of eleven persona tiles four
 * sections later, and a What's New section after that.
 *
 * THE FILTERED LISTS ARE BUILT HERE, ON THE SERVER, AND PASSED DOWN. The scheme
 * master is 38 records of prose and the tender and vacancy registers are larger
 * still; a client component importing them would put all of it in the bundle
 * for a reader who never touches a tab. What crosses is the eleven blocks the
 * chips switch between and five rows for each of the other two tabs — a few
 * kilobytes of text, and nothing a reader cannot already see.
 *
 * The same rules the lists elsewhere follow apply here, because they are the
 * same registers: an observance filed as a tender is not one, a tender whose
 * name the register lost does not take one of five slots, and the register's
 * duplicates are shown once (`records.ts`).
 */
const NOT_A_TENDER = /pakhwada/i;

/** Three schemes a group; the section is an entry to the finder, not the finder. */
const SCHEMES_PER_PERSONA = 3;

function personaBlocks(): PersonaBlock[] {
  const kindOf = (id: string) =>
    OFFERINGS.find((o) => o.id === id)?.label ?? "Scheme";

  return PERSONAS.map((p) => {
    const route = p.portal ? ROUTES[p.portal.route] : undefined;
    return {
      id: p.id,
      label: p.label,
      sub: p.sub,
      art: PERSONA_ART[p.id],
      portal:
        route && route.href && p.portal
          ? {
              label: route.label,
              href: route.href,
              blurb: p.portal.blurb,
              /* A helpline is called, not applied on — the Senior Citizens
                 route is `tel:14567`, and "Apply Now, opens in a new window"
                 is not what a phone number offers. `applyLabel()` makes the
                 same distinction for the scheme pages. */
              tel: route.href.startsWith("tel:"),
            }
          : undefined,
      schemes: matchSchemes({ who: p.id })
        .slice(0, SCHEMES_PER_PERSONA)
        .map((s) => ({
          id: s.id,
          name: s.name,
          provides: s.provides,
          kind: kindOf(s.offers[0] ?? ""),
          href: `/website/schemes-services/${s.id}`,
        })),
    };
  });
}

export function Offerings() {
  const tenders: NoticeRow[] = newestFirst(
    dedupeNotices(
      getTenders().filter(
        (t) => !NOT_A_TENDER.test(t.title) && !isTruncatedTitle(t.title),
      ),
    ),
  )
    .slice(0, 5)
    .map((t) => ({
      key: t.slug,
      title: displayNoticeTitle(tidyTitle(t.title)),
      href: `/website/tenders/${t.slug}`,
      meta: formatDate(t.date),
      dateTime: isoDate(t.date),
    }));

  const vacancies: NoticeRow[] = newestFirst(getVacancies())
    .slice(0, 5)
    .map((v) => ({
      key: v.slug,
      title: tidyTitle(v.title),
      href: `/website/vacancies/${v.slug}`,
      meta: formatDate(v.date),
      dateTime: isoDate(v.date),
    }));

  const news: NoticeRow[] = whatsNew()
    .slice(0, 6)
    .map((n) => ({
      key: n.key,
      title: n.title,
      href: n.href,
      meta: n.org ? `${n.kind} · ${n.org}` : n.kind,
      date: formatDate(n.date),
      dateTime: isoDate(n.date),
    }));

  return (
    <Band
      as="section"
      tone="default"
      spacing="xl"
      aria-labelledby="offerings-title"
    >
      <SectionTitle
        size="display"
        headingId="offerings-title"
        title={<T>Our Offerings</T>}
        description={
          <T>
            Schemes, vacancies and tenders of the Department of Social Justice
            &amp; Empowerment.
          </T>
        }
      />
      <OfferingsExplorer
        personas={personaBlocks()}
        tenders={tenders}
        vacancies={vacancies}
        news={news}
      />
    </Band>
  );
}
