import * as React from "react";
import { ScwHeader } from "./gov-chrome";
import { Sidebar, ADMIN_NAV } from "./sidebar";
import { UserMenu } from "./user-menu";

/** Layout shell for the SCW Admin portal (scw-admin-uat). */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <ScwHeader
        actions={
          <UserMenu
            user={{ name: "Rajesh Pilli", role: "(Admin)", initials: "RP" }}
            showProfile
          />
        }
      />
      <div className="flex">
        <Sidebar items={ADMIN_NAV} home="/portals/scw/admin/dashboard" />
        <main id="main" className="min-w-0 flex-1 px-6 py-7 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
