"use client";
import { usePathname } from "next/navigation";
import { AppSwitcher } from "@mosje/design-system";

export function ConditionalAppSwitcher() {
  const pathname = usePathname();
  // Hidden on the hub root (it *is* the portals index) and on the site gate,
  // where every destination it offers is still locked.
  if (pathname === "/" || pathname === "/gate") return null;
  return <AppSwitcher devMode={process.env.NODE_ENV === "development"} />;
}
