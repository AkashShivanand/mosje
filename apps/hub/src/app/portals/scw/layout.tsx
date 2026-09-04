import type { Metadata } from "next";
import "./scw.css";

export const metadata: Metadata = {
  title: "SCW · Senior Citizens Welfare | SAMAVESH · MoSJE",
  description:
    "Senior Citizens Welfare portal — SAMAVESH (Single Access Mechanism for All Verticals of Empowerment & Social Harmony), Ministry of Social Justice & Empowerment, Government of India.",
  applicationName: "SCW · Samavesh",
  icons: [
    {
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%2313366b'/><text x='16' y='21' text-anchor='middle' font-family='sans-serif' font-size='13' font-weight='800' fill='%23ffffff' lang="hi">स</text></svg>`
        ),
    },
  ],
};

// data-surface="portal" applies the DS portal type scale (tokens.css). It sat on
// <html> when scw was its own zone; a nested layout can't set <html> attributes,
// so it moves to a wrapper — the selector is attribute-based and the custom
// properties inherit, so the cascade is identical.
//
// data-portal="scw" binds this subtree to SCW's Tailwind palette. The hub runs a
// single Tailwind build, so the utility names are global but the values are
// per-portal custom properties scoped by this attribute — see scw.css.
export default function ScwLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal="scw" data-surface="portal">
      {children}
    </div>
  );
}
