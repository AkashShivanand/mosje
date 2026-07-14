import { AdminShell } from "@/components/tg/admin-shell";

export default function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
