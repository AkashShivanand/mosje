import type { Metadata } from "next";
import "./nmba.css";
import { ToastProvider } from "@/components/nmba/toast";

export const metadata: Metadata = {
  title: "Nasha Mukt Bharat Abhiyaan | Ministry of Social Justice & Empowerment",
  description:
    "Nasha Mukt Bharat Abhiyaan (NMBA) — de-addiction awareness campaign by the Ministry of Social Justice & Empowerment, Government of India.",
  icons: { icon: "/portals/nmba/brand/national-emblem.svg" },
};

// data-surface="portal" applies the DS portal type scale (tokens.css). It sat on
// <html> when nmba was its own zone; a nested layout can't set <html> attributes,
// so it moves to a wrapper — the selector is attribute-based and the custom
// properties inherit, so the cascade is identical.
//
// data-brand="navy" was nmba's own fixed brand ramp (the deep-navy
// #003366 SAMAVESH identity). Its standalone layout set PORTAL_DEFAULT_MODE =
// "navy" on <html> and primed the cookie in an init script; nmba renders no
// ColorModeSwitcher, so it was never user-togglable — a fixed identity, exactly
// like smile-admin. The estate default is blue-light, so without this attribute
// nmba silently renders in the wrong brand ramp. Setting it on this closer
// wrapper overrides the hub's html-level mode for nmba's subtree only.
//
// data-portal="nmba" binds this subtree to nmba's Tailwind palette. The hub runs
// a single Tailwind build, so the utility names are global but the values are
// per-portal custom properties scoped by this attribute — see nmba.css.
export default function NmbaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal="nmba" data-brand="navy" data-surface="portal">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
