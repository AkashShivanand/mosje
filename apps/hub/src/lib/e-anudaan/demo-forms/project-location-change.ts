/**
 * Project Location Change (`/ngo/project-location-change`). Its rules, from the page:
 * a project, a new address and a reason are required; a project with a request already pending
 * cannot raise another; a captured position outside the project's district is shown to the
 * applicant and to the Ministry.
 *
 * Values: `project` — "free" (no request pending) or "pending"; `position` — "within" the
 * district, "far" from it, or "" for none; `address` (with `{district}` and `{state}` to fill), `reason`,
 * `document`.
 */

import type { DemoFormDef } from "./index.ts";

/** `{district}` and `{state}` are the chosen project's: a project moves within its own district. */
const ADDRESS = "Plot 31, Sector 12, near the Community Health Centre, {district}, {state}";
const REASON = "The present building has been declared unsafe by the municipal engineer. The Society has leased larger premises in the same district to keep the home running without a break.";

const valid = { project: "free", position: "within", address: ADDRESS, reason: REASON, document: "municipal-engineer-notice.pdf" };

export const PROJECT_LOCATION_CHANGE: DemoFormDef = {
  id: "project-location-change",
  title: "Project Location Change",
  path: /^\/ngo\/project-location-change\/?$/,
  presets: [
    { id: "valid", label: "Correct Request", valid: true, values: valid },
    { id: "no-project", label: "Project Not Chosen", values: { ...valid, project: "" } },
    { id: "no-address", label: "New Address Left Out", values: { ...valid, address: "" } },
    { id: "no-reason", label: "Reason Left Out", values: { ...valid, reason: "" } },
    { id: "pending", label: "Request Already Pending", values: { ...valid, project: "pending" } },
    { id: "far", label: "Position Outside the District", values: { ...valid, position: "far" } },
  ],
};
