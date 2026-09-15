/**
 * The sign-in route group's layout — a pass-through.
 *
 * It used to wrap every page here in its own full-page shell: the AccessBar, a
 * gradient brand panel with unsourced programme figures, and a 1600px two-column
 * grid. The login and recovery pages now render `PortalLoginTemplate` and
 * `PortalRecoveryTemplate`, which bring the estate's masthead, hero and Signing
 * Into strip themselves, so the old shell would draw a second page around them.
 *
 * The file stays so the `(auth)` group keeps resolving; `AppProvider` still comes
 * from the portal layout above.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
