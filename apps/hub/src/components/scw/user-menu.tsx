"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/scw/utils";

export interface AccountUser {
  name: string;
  email?: string;
  role?: string;
  initials?: string;
}

/** Avatar + dropdown shown in the masthead when "logged in". */
export function UserMenu({
  user,
  showProfile = false,
}: {
  user: AccountUser;
  showProfile?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const initials =
    user.initials ??
    user.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-black/5"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-sm font-bold text-navy">
          {initials}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-sm font-semibold text-ink">{user.name}</span>
          {(user.role || user.email) && (
            <span className="block text-xs text-ink-muted">{user.role ?? user.email}</span>
          )}
        </span>
      </button>
      {open && (
        <div
          className={cn(
            "absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-line bg-white py-1 shadow-pop"
          )}
        >
          {showProfile && (
            <Link
              href="/portals/scw/admin/profile"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-muted hover:bg-black/5"
            >
              <Settings className="h-4 w-4" />
              Profile Settings
            </Link>
          )}
          <Link
            href="/portals/scw/login"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}
