"use client";
import { usePathname } from "next/navigation";
import { AppSwitcher } from "@mosje/design-system";

export function ConditionalAppSwitcher() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <AppSwitcher devMode={process.env.NODE_ENV === "development"} />;
}
