import type { Metadata } from "next";
import "./eutthan.css";

export const metadata: Metadata = {
  title: "E-Utthan Portal",
  description: "E-Utthan admin portal for the Ministry of Social Justice & Empowerment.",
  applicationName: "E-Utthan Portal",
  icons: [{ rel: "icon", url: "/images/emblem.svg" }],
};

// data-surface="portal" applies the DS portal type scale (tokens.css), as every portal does.
// Without it the --sa-type-* roles eutthan.css binds resolve to the website ramp, so a page
// title would render at 32px here against 28px on every other portal.
export default function EutthanLayout({ children }: { children: React.ReactNode }) {
  return <div data-surface="portal">{children}</div>;
}
