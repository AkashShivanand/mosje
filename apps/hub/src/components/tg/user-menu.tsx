"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTg } from "@/lib/tg/store/store";
import { Icon } from "@mosje/design-system";

/** Compact user chip + logout for the admin shell topbar. */
export function UserMenu({ name, roleLabel, loginHref }: { name: string; roleLabel: string; loginHref: string }) {
  const router = useRouter();
  const { logout } = useTg();
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-label-2 font-bold text-white">
          {initials || <Icon name="person" size={16} />}
        </span>
        <div className="hidden sm:block">
          <div className="text-body-2 font-semibold text-ink">{name}</div>
          <div className="text-body-3 text-ink-muted">{roleLabel}</div>
        </div>
      </div>
      <button
        type="button"
        aria-label="Log out"
        onClick={() => {
          logout();
          router.push(loginHref);
        }}
        className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-label-2 font-semibold text-ink-muted transition-colors hover:bg-black/5"
      >
        <Icon name="logout" size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}
