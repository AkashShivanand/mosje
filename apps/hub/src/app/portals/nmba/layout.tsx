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
export default function NmbaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-surface="portal">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
