import { AdminShell } from "@/components/nhapoa/admin-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminShell roleId="state-authority">{children}</AdminShell>;
}
