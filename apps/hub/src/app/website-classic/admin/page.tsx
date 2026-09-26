import type { Metadata } from "next";
import { AdminLogin } from "./admin-login";

export const metadata: Metadata = {
  title: "Admin Login — Department of Social Justice & Empowerment",
  description: "Authorised administrator access for the DoSJE content management system.",
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
