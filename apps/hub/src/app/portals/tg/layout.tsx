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

export default function TgLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <TgProvider>{children}</TgProvider>
    </ToastProvider>
  );
}
