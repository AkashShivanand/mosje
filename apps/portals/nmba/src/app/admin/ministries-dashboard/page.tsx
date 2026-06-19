import { AdminShell } from "@/components/admin-shell";
import { StatsCard } from "@/components/stats-card";
import { HeartHandshake } from "lucide-react";

export default function MinistriesDashboard() {
  return (
    <AdminShell>
      <h1 className="mb-2 text-xl font-bold text-ink">
        Ministries / Departments and Spiritual Organisations
      </h1>
      <p className="mb-6 text-sm text-ink-muted">
        Who have signed MoU with the Ministry of Social Justice
      </p>

      <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
        <StatsCard
          label="Total Pledges"
          value="71"
          icon={<HeartHandshake className="h-5 w-5" />}
        />
        <StatsCard
          label="Total Pledges Taken Today"
          value="0"
          icon={<HeartHandshake className="h-5 w-5" />}
        />
      </div>
    </AdminShell>
  );
}
