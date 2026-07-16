import { CitizenShell } from "@/components/tg/citizen-shell";

export default function CitizenAppLayout({ children }: { children: React.ReactNode }) {
  return <CitizenShell>{children}</CitizenShell>;
}
