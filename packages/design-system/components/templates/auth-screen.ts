/**
 * AuthScreen — credentials, before there is a session.
 *
 * **This is `PortalLoginTemplate` under the name the decision table uses.** It
 * is an alias, not a wrapper: there is no second component here, no extra
 * render layer and no props of its own.
 *
 * The alias exists because the catalogue in
 * `docs/design-system/screen-templates.md` §2 promises eighteen templates named
 * for the data they show, and someone reading that table for "credentials,
 * before there is a session" should find the thing it names in the barrel. The
 * alternative — an entry that says "actually, import something else" — is how a
 * closed set stops being one.
 *
 * It is also the one archetype the handoff got right. The auth geometry is
 * consistent across all 18 drawn screens (hero 922 / form column 518 / card 390
 * with 64px gutters on desktop; 375 / card 343 / 16px gutters on mobile) and it
 * already matches this component
 * (`docs/audit/figma-handoff-defects-2026-09-06.md` §3). Nothing needed
 * rebuilding, so nothing was rebuilt.
 */
export {
  PortalLoginTemplate as AuthScreen,
  type PortalLoginTemplateProps as AuthScreenProps,
} from "../auth/portal-login-template";
