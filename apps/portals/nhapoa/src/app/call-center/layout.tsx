import { AdminShell } from "@/components/admin-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminShell roleId="call-center">{children}</AdminShell>;
}
