import type { Metadata } from "next";
import "./eutthan.css";

export const metadata: Metadata = {
  title: "E-Utthan Portal",
  description: "E-Utthan admin portal for the Ministry of Social Justice & Empowerment.",
  applicationName: "E-Utthan Portal",
  icons: [{ rel: "icon", url: "/images/emblem.svg" }],
};

export default function EutthanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
