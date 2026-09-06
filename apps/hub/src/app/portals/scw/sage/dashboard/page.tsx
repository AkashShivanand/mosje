import Link from "next/link";
import { UserShell } from "@/components/scw/user-shell";
import { Icon, Card, Button } from "@mosje/design-system";

export default function SageDashboardPage() {
  return (
    <UserShell user={{ name: "vikram", email: "vikrammallu123@gmail.com", initials: "V" }}>
      <div className="space-y-6">
        <h1 className="text-headline-1 text-ink">My SAGE Applications</h1>

        <Card className="bg-approve-bg/40 p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-title-2 text-ink">iuutrt</div>
              <div className="mt-1 text-body-2 text-ink-muted">
                ID: SCW/2026/HSAGE976152 · 08 Jun 2026
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-approve-bg px-3 py-1 text-label-2 text-approve-fg">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-approve" />
              Approved
            </span>
          </div>

          {/* Progress stepper inside the card */}
          <div className="mt-8 flex items-start">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-approve text-white">
                <Icon name="check" size={20} />
              </div>
              <span className="mt-2 text-label-2 text-ink">Submitted</span>
              <span className="text-body-3 text-ink-hint">08 Jun 2026</span>
            </div>
            <div className="mt-4 h-0.5 flex-1 bg-approve" />
            <div className="flex flex-col items-center text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-approve text-white">
                <Icon name="check" size={20} />
              </div>
              <span className="mt-2 text-label-2 text-ink">Approved</span>
              <span className="text-body-3 text-ink-hint">08 Jun 2026</span>
            </div>
          </div>

          {/* Footer action */}
          <div className="mt-8 flex justify-end">
            <Link href="/portals/scw/sage-registration/form">
              <Button appearance="outlined">View Details</Button>
            </Link>
          </div>
        </Card>
      </div>
    </UserShell>
  );
}
