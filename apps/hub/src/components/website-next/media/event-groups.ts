import type { EventRecord } from "@/types/website/content";
import { eventDate } from "./EventCard";

/**
 * Repeat posts of one programme, drawn as one card (issue CON-15).
 *
 * THE GROUPING RULE. Two events are one entry when all three match:
 *   1. the same title, normalised — case, punctuation and runs of spaces
 *      ignored, so "Ek Ped Maa Ke Naam" and "EK PED MAA KE NAAM." agree;
 *   2. the same organisation code;
 *   3. the same calendar month of the date the event was HELD (`startDate`,
 *      else the posting date).
 * Nothing else is inferred: a different month, a reworded title or another
 * organisation is a separate entry. An event with no date is never grouped.
 * The register carries no programme identifier, so this is the narrowest rule
 * that joins the sixteen "Ek Ped Maa Ke Naam" posts without joining unrelated
 * events that happen to share a generic title in another month.
 */
export interface EventEntry {
  key: string;
  /** Newest first. One member means a single event. */
  events: EventRecord[];
  /** The latest date in the entry, for ordering the list. */
  latest?: string;
}

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export function groupEvents(events: EventRecord[]): EventEntry[] {
  const byKey = new Map<string, EventRecord[]>();
  for (const e of events) {
    const when = eventDate(e);
    const key = when ? `${normalise(e.title)}|${e.organisation ?? ""}|${when.slice(0, 7)}` : `single|${e.slug}`;
    const list = byKey.get(key);
    if (list) list.push(e);
    else byKey.set(key, [e]);
  }
  return [...byKey.entries()]
    .map(([key, list]) => {
      const sorted = [...list].sort((a, b) => (eventDate(b) ?? "").localeCompare(eventDate(a) ?? ""));
      return { key, events: sorted, latest: eventDate(sorted[0]!) };
    })
    .sort((a, b) => (b.latest ?? "").localeCompare(a.latest ?? ""));
}
