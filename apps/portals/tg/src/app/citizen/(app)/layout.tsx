import { CitizenShell } from "@/components/citizen-shell";

export default function CitizenAppLayout({ children }: { children: React.ReactNode }) {
  return <CitizenShell>{children}</CitizenShell>;
}
