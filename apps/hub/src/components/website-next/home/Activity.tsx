import { Band, SectionTitle } from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";
import {
  getAllDocuments,
  getEvents,
  getGalleryItemsByType,
  routeSlug,
} from "@/lib/website/content";
import { groupEvents } from "@/components/website-next/media/event-groups";
import { formatDate, isoDate } from "@/components/website-next/ui/format";
import { dateValue, tidyTitle } from "@/components/website-next/ui/records";
import { ActivityTabs, type ActivityRow } from "./ActivityTabs";

/**
 * Activity Corner — what the Department has done lately, in the three
 * registers the design and the live page both name: Events, Press Releases,
 * Circulars.
 *
 * It was two columns showing events and photographs at once. The design draws
 * tabs, and the three registers it names are not the two we were showing: the
 * photographs are one click away under Events & Gallery, and the circulars —
 * 164 of them, the register a citizen most often comes here for — were not on
 * the home page at all.
 *
 * Events are those already HELD, with repeat posts of one programme drawn as
 * one card (CON-15); an upcoming one belongs on the Events page.
 *
 * Every row is built here and passed down: the event register alone is 635
 * records.
 */
const CIRCULARS = "Circulars & Notifications";
const PER_TAB = 4;

/**
 * "31" and "Jul 2026" — the two halves of the date block the design draws,
 * split out of the site's ONE date format rather than formatted again here.
 * `formatDate` writes the month out because ICU prints "Sept" for en-IN and
 * en-GB, and it reads the IST calendar date; a second Intl call here would
 * have given a different month abbreviation and, near midnight UTC, a
 * different day from every other date on the page. The block drops the day's
 * leading zero, which is the one thing it does differently — a padded "09" set
 * at 32px reads as a code rather than as a date.
 */
function dateParts(value: string | undefined): { day: string; month: string } {
  const shown = formatDate(value);
  const m = shown ? /^(\d{1,2})\s+(.+)$/.exec(shown) : null;
  if (!m) return { day: "—", month: "" };
  return { day: String(Number(m[1])), month: m[2]! };
}

/* A register title in Devanagari is marked as such, so a screen reader reads
   it in Hindi rather than in English (ACC; `check:type-linkage` gates it). */
const DEVANAGARI = /[ऀ-ॿ]/;

export function Activity() {
  const today = new Date().toISOString().slice(0, 10);

  const events: ActivityRow[] = groupEvents(getEvents())
    .filter((e) => e.latest && e.latest.slice(0, 10) <= today)
    .sort((a, b) => (b.latest ?? "").localeCompare(a.latest ?? ""))
    .slice(0, PER_TAB)
    .map((entry) => {
      const e = entry.events[0]!;
      const title = tidyTitle(e.title);
      return {
        key: entry.key,
        title,
        href: `/website/events/${routeSlug(e.slug)}`,
        ...dateParts(entry.latest ?? e.date),
        dateTime: isoDate(entry.latest ?? e.date),
        org: e.organisation,
        lang: DEVANAGARI.test(title) ? "hi" : undefined,
      };
    });

  const press: ActivityRow[] = getGalleryItemsByType("News")
    .slice()
    .sort((a, b) => dateValue(b.date) - dateValue(a.date))
    .slice(0, PER_TAB)
    .map((g) => {
      const title = tidyTitle(g.title);
      return {
        key: g.slug,
        title,
        href: `/website/gallery/${routeSlug(g.slug)}`,
        ...dateParts(g.date),
        dateTime: isoDate(g.date),
        org: g.organisation,
        lang: DEVANAGARI.test(title) ? "hi" : undefined,
      };
    });

  const circulars: ActivityRow[] = getAllDocuments()
    .filter((d) => d.category === CIRCULARS && d.title)
    .sort((a, b) => dateValue(b.date) - dateValue(a.date))
    .slice(0, PER_TAB)
    .map((d) => {
      const title = tidyTitle(d.title);
      return {
        key: d.slug,
        title,
        href: `/website/documents/${routeSlug(d.slug)}`,
        ...dateParts(d.date),
        dateTime: isoDate(d.date),
        org: d.organisation,
        lang: DEVANAGARI.test(title) ? "hi" : undefined,
      };
    });

  return (
    <Band
      as="section"
      tone="muted"
      spacing="xl"
      aria-labelledby="activity-title"
    >
      <SectionTitle
        size="display"
        headingId="activity-title"
        title={<T>Activity Corner</T>}
        description={
          <T>
            Recent events, press coverage and circulars of the Department and
            its organisations.
          </T>
        }
      />
      <ActivityTabs events={events} press={press} circulars={circulars} />
    </Band>
  );
}
