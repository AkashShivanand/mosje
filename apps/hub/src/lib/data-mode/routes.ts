/**
 * The pages whose figures come from a report feed, and therefore the only pages
 * where the data-mode switch means anything.
 *
 * It lives here rather than in the demo dock because "which pages have a
 * dashboard" is hub knowledge; the dock takes a tab and asks no questions. Add
 * a slug here in the same change that adds a dashboard, or the switch will be
 * missing on the one page that needs it.
 */
const PMAJAY = "/website/organisation/pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay";

export const DATA_MODE_ROUTES: string[] = [
  // The scheme's own page, for the reach map — the only feed-backed figures on
  // it. Everything else there is stated policy and does not move with the mode.
  PMAJAY,
  `${PMAJAY}/development-of-sc-dominated-villages-into-adarsh-gram`,
  `${PMAJAY}/grants-in-aid-to-state-districts`,
  `${PMAJAY}/construction-repair-of-hostels`,
];

export function hasDataModes(pathname: string | null): boolean {
  if (!pathname) return false;
  const clean = pathname.replace(/\/+$/, "");
  return DATA_MODE_ROUTES.includes(clean);
}
