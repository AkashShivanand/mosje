import * as React from "react";
import Link from "next/link";
import { GovTopBar, GovMasthead, Ux4gFooter } from "./gov-chrome";
import { Sidebar, USER_NAV } from "./sidebar";
import { UserMenu, type AccountUser } from "./user-menu";

/** Layout shell for the SCW citizen/beneficiary portal (scw-user-uat). */
export function UserShell({
  children,
  user,
}: {
  children: React.ReactNode;
  /** When present, the masthead shows the account menu; otherwise a Login button. */
  user?: AccountUser;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <GovTopBar variant="user" />
      <GovMasthead
        right={
          user ? (
            <UserMenu user={user} />
          ) : (
            <Link
              href="/portals/scw/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-black/5"
            >
              Login
            </Link>
          )
        }
      />
      <div className="flex flex-1">
        <Sidebar items={USER_NAV} />
        <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
      <Ux4gFooter />
    </div>
  );
}
