"use client";
import { usePathname } from "next/navigation";
import { AppSwitcher } from "@mosje/design-system";

export function ConditionalAppSwitcher() {
  const pathname = usePathname();
  // Hidden on the hub root (it *is* the portals index), on the site gate, and
  // across the admin surface, where it offers nothing relevant.
  if (pathname === "/" || pathname === "/gate" || pathname.startsWith("/admin")) return null;
  return <AppSwitcher />;
}
