import Link from "next/link";
import { Check } from "lucide-react";
import { UserShell } from "@/components/scw/user-shell";
import { Button, Card } from "@/components/scw/ui";

export default function SageDashboardPage() {
  return (
    <UserShell user={{ name: "vikram", email: "vikrammallu123@gmail.com", initials: "V" }}>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-ink">My SAGE Applications</h2>

        <Card className="bg-approve-bg/40 p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-base font-bold text-ink">iuutrt</div>
              <div className="mt-1 text-sm text-ink-muted">
                ID: SCW/2026/HSAGE976152 · 08 Jun 2026
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-approve-bg px-3 py-1 text-xs font-semibold text-approve-fg">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-approve" />
              Approved
            </span>
          </div>

          {/* Progress stepper inside the card */}
          <div className="mt-8 flex items-start">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-approve text-white">
                <Check className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-semibold text-ink">Submitted</span>
              <span className="text-xs text-ink-hint">08 Jun 2026</span>
            </div>
            <div className="mt-4 h-0.5 flex-1 bg-approve" />
            <div className="flex flex-col items-center text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-approve text-white">
                <Check className="h-5 w-5" />
              </div>
              <span className="mt-2 text-xs font-semibold text-ink">Approved</span>
              <span className="text-xs text-ink-hint">08 Jun 2026</span>
            </div>
          </div>

          {/* Footer action */}
          <div className="mt-8 flex justify-end">
            <Link href="/portals/scw/sage-registration/form">
              <Button variant="outline">View Details</Button>
            </Link>
          </div>
        </Card>
      </div>
    </UserShell>
  );
}
