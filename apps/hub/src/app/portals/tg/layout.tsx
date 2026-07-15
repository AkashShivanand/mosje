import type { Metadata } from "next";
import "./tg.css";
import { ToastProvider } from "@mosje/design-system";
import { TgProvider } from "@/lib/tg/store/store";

export const metadata: Metadata = {
  title: "National Portal for Transgender Persons | SAMAVESH · MoSJE",
  description:
    "National Portal for Transgender Persons — apply for and track your Transgender Identity Certificate and access welfare (scholarships, skill training, Garima Greh, medical support). SAMAVESH (Single Access Mechanism for All Verticals of Empowerment & Social Harmony), Ministry of Social Justice & Empowerment, Government of India.",
  applicationName: "TG · Samavesh",
};

// data-portal="tg" binds this subtree to TG's Tailwind palette. The hub runs a
// single Tailwind build, so the utility names are global but the values are
// per-portal custom properties scoped by this attribute — see tg.css.
// NOTE: no data-surface here — TG's standalone <html> never carried it, and
// adding it would silently apply the DS portal type scale it never had.
export default function TgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal="tg">
      <ToastProvider>
        <TgProvider>{children}</TgProvider>
      </ToastProvider>
    </div>
  );
}
