"use client";

import { ChevronDown, LogOut, Menu, ShieldCheck, User } from "lucide-react";
import { useApp } from "@/store/app-context";
import { initials } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/roles";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

function SamaveshLogo() {
  return (
    <Link href="/dashboard" className="flex min-w-0 items-center gap-md">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary text-white md:h-12 md:w-12">
        <span className="text-label-3 font-bold tracking-[0.16em] md:text-label-2">
          MoSJE
        </span>
      </div>
      {/* Compact mobile lockup */}
      <div className="flex min-w-0 flex-col leading-tight md:hidden">
        <span className="truncate text-body-2 font-semibold text-foreground">
          SMILE Admin
        </span>
        <span className="truncate text-label-3 text-foreground-muted">
          Ministry of Social Justice
        </span>
      </div>
      {/* Full desktop lockup — matches Figma */}
      <div className="hidden leading-tight md:block">
        <div className="flex items-center gap-sm">
          <span className="beta-chip">BETA</span>
          <span className="text-label-3 text-foreground-muted">Government of India</span>
        </div>
        <div className="text-label-2 text-foreground-muted">
          Ministry of Social Justice &amp; Empowerment
        </div>
        <div className="text-body-2 font-semibold text-foreground">
          Department of Social Justice &amp; Empowerment
        </div>
      </div>
    </Link>
  );
}

export function Header() {
  const {
    account,
    signOut,
    sidebarCollapsed,
    setSidebarCollapsed,
    setMobileNavOpen,
  } = useApp();
  const router = useRouter();

  function onMenuClick() {
    // Mobile: open drawer. Desktop: toggle sidebar collapse.
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setMobileNavOpen(true);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stroke-200 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-md px-md py-sm md:gap-lg md:px-lg md:py-md">
        <button
          aria-label="Toggle navigation"
          onClick={onMenuClick}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-foreground-muted hover:bg-neutral-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <SamaveshLogo />
        <div className="ml-auto flex items-center gap-md md:gap-lg">
          <div className="hidden items-center gap-sm md:flex">
            <div className="grid h-9 w-14 place-items-center rounded-xs bg-[#ff9933] text-label-3 font-bold text-primary">
              Digital
            </div>
            <div className="text-label-3 leading-tight text-foreground-muted">
              <div className="font-bold text-primary">Digital India</div>
              <div>Power To Empower</div>
            </div>
          </div>
          <div
            className="hidden h-10 w-10 rounded-md bg-primary text-white sm:grid sm:place-items-center"
            aria-hidden
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          {account ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-sm rounded-md p-xs hover:bg-neutral-50 md:gap-md">
                  <div className="hidden text-right leading-tight md:block">
                    <div className="text-body-2 font-semibold text-foreground">
                      {account.name}
                    </div>
                    <div className="text-label-3 text-foreground-muted">{account.email}</div>
                  </div>
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-50 text-primary text-label-1 font-bold md:h-10 md:w-10">
                    {initials(account.name)}
                  </div>
                  <ChevronDown className="hidden h-4 w-4 text-foreground-muted sm:block" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  className="z-50 min-w-[240px] rounded-md border border-stroke-200 bg-white p-xs shadow-md"
                  sideOffset={8}
                >
                  <div className="px-md py-sm">
                    <div className="text-body-2 font-semibold text-foreground">
                      {account.name}
                    </div>
                    <div className="text-label-3 text-foreground-muted">
                      {ROLE_LABELS[account.role]}
                    </div>
                  </div>
                  <div className="my-xs h-px bg-stroke-100" />
                  <DropdownMenu.Item
                    onSelect={() => router.push("/users/onboard")}
                    className="flex items-center gap-sm rounded-sm px-md py-sm text-body-3 text-foreground outline-none focus:bg-primary-50 focus:text-primary"
                  >
                    <User className="h-4 w-4" /> Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => {
                      signOut();
                      router.push("/login");
                    }}
                    className="flex items-center gap-sm rounded-sm px-md py-sm text-body-3 text-danger outline-none focus:bg-danger-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          ) : null}
        </div>
      </div>
    </header>
  );
}
