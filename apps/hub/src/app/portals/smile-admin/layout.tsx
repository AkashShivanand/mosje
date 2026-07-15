import type { Metadata } from "next";
import "./smile-admin.css";
import { AppProvider } from "@/store/smile-admin/app-context";

export const metadata: Metadata = {
  title: "SMILE Beggary Rehabilitation Portal | MoSJE",
  description:
    "Single Access Mechanism for Identification, Mobilisation, Shelter & Rehabilitation of Persons Engaged in the Act of Beggary — Ministry of Social Justice & Empowerment, Government of India.",
  applicationName: "SMILE Admin · Samavesh",
  authors: [{ name: "Ministry of Social Justice & Empowerment" }],
  icons: [
    {
      url:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23003366'/><text x='16' y='21' text-anchor='middle' font-family='Inter,sans-serif' font-size='12' font-weight='800' fill='%23ffffff'>स</text></svg>`
        ),
    },
  ],
};

// data-surface="portal" applies the DS portal type scale (tokens.css); it sat on
// <html> when smile-admin was its own zone. A nested layout can't set <html>
// attributes, so both move to a wrapper — the selectors are attribute-based and
// the custom properties inherit, so the cascade is identical.
//
// data-color-mode="blue-dark" was smile-admin's own fixed brand ramp (its GoI
// navy identity), set via its own standalone ColorModeProvider initialMode — it
// was never user-togglable inside smile-admin (no switcher was rendered there).
// The hub's estate-wide ColorModeProvider now owns the html-level, user-switchable
// mode; setting the same attribute again on this closer wrapper overrides it for
// smile-admin's subtree only, preserving its permanent navy identity without
// affecting the estate-wide toggle elsewhere.
//
// data-portal="smile-admin" binds this subtree to smile-admin's Tailwind palette.
// The hub runs a single Tailwind build, so the utility names are global but the
// values are per-portal custom properties scoped by this attribute — see
// smile-admin.css.
export default function SmileAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal="smile-admin" data-color-mode="blue-dark" data-surface="portal">
      <AppProvider>{children}</AppProvider>
    </div>
  );
}
