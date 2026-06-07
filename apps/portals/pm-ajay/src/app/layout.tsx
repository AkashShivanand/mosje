import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM-AJAY · MoSJE Dashboard",
  description:
    "PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) management information system — financial, scheme and governance dashboards for the Ministry of Social Justice & Empowerment, Government of India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
