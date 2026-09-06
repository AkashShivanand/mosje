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
// data-brand is NOT set here any more. Navy came from a hand-written wrapper on
// this one portal; since 2026-09-06 it comes from the route default in
// `defaultColorModeForPath` — every path under /portals/ opens navy. Pinning it
// here as well would make this the one portal the estate's Colour tab cannot
// reach, which is the "control that looks usable and isn't" pattern.
//
// data-portal="nmba" binds this subtree to nmba's Tailwind palette. The hub runs
// a single Tailwind build, so the utility names are global but the values are
// per-portal custom properties scoped by this attribute — see nmba.css.
export default function NmbaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal="nmba" data-surface="portal">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
