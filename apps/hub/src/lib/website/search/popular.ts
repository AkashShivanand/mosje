/**
 * What the search page offers a reader who has typed nothing yet.
 *
 * `/website/search` with no query must never be an empty page — a reader who
 * lands there by clicking the magnifier has told you they are looking for
 * something and know they can search, which is the best moment the site gets to
 * show what it holds.
 *
 * These are HAND-CHOSEN and that is correct for now: they are the things the
 * Department most wants a citizen to reach, and there is no query log yet to
 * derive them from. Once the log in `analytics.ts` has run for a few weeks,
 * replace this list with the real top queries — and expect to be surprised by it.
 */
export const POPULAR_SEARCHES: string[] = [
  "scholarship",
  "loan",
  "hostel",
  "senior citizens",
  "de-addiction centre",
  "annual report",
  "RTI",
  "tender",
  "vacancy",
  "NGO grant",
  "contact",
  "PM-AJAY",
];
