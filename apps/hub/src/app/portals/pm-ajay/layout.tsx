import type { Metadata } from "next";
import { AuthProvider } from "@/store/pm-ajay/auth-context";
import "./pm-ajay.css";

export const metadata: Metadata = {
  title: "PM-AJAY · MoSJE Dashboard",
  description:
    "PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) management information system — financial, scheme and governance dashboards for the Ministry of Social Justice & Empowerment, Government of India.",
};

export default function PmAjayLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-surface="portal">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
