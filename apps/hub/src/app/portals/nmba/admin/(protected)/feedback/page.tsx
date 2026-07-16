"use client";

import { AdminShell } from "@/components/nmba/admin-shell";
import { FEEDBACK_LIST } from "@/lib/nmba/mock-data";
import { useToast } from "@/components/nmba/toast";
import { MoreHorizontal } from "lucide-react";
import { Badge, Button } from "@mosje/design-system";

export default function FeedbackPage() {
  const { toast } = useToast();

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink">Feedback / Grievances</h1>
        <p className="mt-1 text-sm text-ink-muted">{FEEDBACK_LIST.length} entries</p>
      </div>

      <div className="rounded-xl border border-line bg-white shadow-card overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
            <tr>
              <th scope="col" className="px-4 py-3">S.No</th>
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Role</th>
              <th scope="col" className="px-4 py-3">Mobile</th>
              <th scope="col" className="px-4 py-3">Email</th>
              <th scope="col" className="px-4 py-3">Feedback</th>
              <th scope="col" className="px-4 py-3">Posted On</th>
              <th scope="col" className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {FEEDBACK_LIST.map((fb) => (
              <tr key={fb.sno} className="hover:bg-surface-muted/50 transition-colors align-top">
                <td className="px-4 py-3 text-ink-muted">{fb.sno}</td>
                <td className="px-4 py-3 font-medium text-ink">{fb.name}</td>
                <td className="px-4 py-3">
                  <Badge status="info">{fb.role}</Badge>
                </td>
                <td className="px-4 py-3 text-ink-muted">{fb.mobile}</td>
                <td className="px-4 py-3 text-ink-muted">{fb.email}</td>
                <td className="px-4 py-3 max-w-xs text-ink-muted">
                  <p className="line-clamp-3">{fb.feedback}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted whitespace-nowrap">{fb.postedOn}</td>
                <td className="px-4 py-3">
                  <Button
                    appearance="text"
                    size="sm"
                    onClick={() => toast("Action coming soon.", "info")}
                    aria-label="Row actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
