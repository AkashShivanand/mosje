"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { useNhapoa } from "@/lib/nhapoa/store/store";

/** Compact user chip + logout for the admin shell topbar. */
export function UserMenu({ name, roleLabel }: { name: string; roleLabel: string }) {
  const router = useRouter();
  const { logout } = useNhapoa();
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
          {initials || <UserRound className="h-4 w-4" />}
        </span>
        <div className="hidden leading-tight sm:block">
          <div className="text-sm font-semibold text-ink">{name}</div>
          <div className="text-[11px] text-ink-muted">{roleLabel}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          logout();
          router.push("/portals/nhapoa/login");
        }}
        className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-black/5"
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}
