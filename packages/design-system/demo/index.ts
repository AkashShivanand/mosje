/**
 * SAMAVESH Design System — Demo Components
 *
 * These components exist solely to support stakeholder review, QA, and
 * development workflows. They are NOT part of the production design system
 * and must never be rendered in a public-facing build.
 *
 * Guard every usage with a `devMode` prop or equivalent env-check so
 * tree-shaking eliminates them from production bundles.
 */

export { DemoFab } from "./demo-fab";
export type { DemoAccount, DemoFabProps, DemoFillDetail } from "./demo-fab";
export { DemoAccountsPanel } from "./demo-accounts-panel";
export type { DemoAccountsPanelProps } from "./demo-accounts-panel";
export { DEMO_ACCOUNTS, findDemoAccounts, isLoginRoute } from "./demo-accounts";
export type { DemoAccountSet } from "./demo-accounts";
export { DemoDock } from "./demo-dock";
export type { DemoDockProps, DemoDockTab } from "./demo-dock";
export { FlaskIcon } from "./flask-icon";
export type { FlaskIconProps } from "./flask-icon";
