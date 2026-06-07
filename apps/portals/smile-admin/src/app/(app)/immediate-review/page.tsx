"use client";

import { AlertOctagon, Check, ClockAlert, Filter } from "lucide-react";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shell/page-header";
import { REVIEW_QUEUE } from "@/lib/mock-data";

export default function ImmediateReviewPage() {
  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "System" }, { label: "Immediate Review" }]}
        title="Immediate Review"
        subtitle="Items the system has flagged for human judgement — sorted by severity and age."
        actions={<Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" /> Filter</Button>}
      />
      <div className="space-y-md">
        {REVIEW_QUEUE.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-md p-lg">
              <div className="flex flex-1 items-start gap-md">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${item.severity === "High" ? "bg-danger-50 text-danger-600" : item.severity === "Medium" ? "bg-warning-50 text-warning-600" : "bg-info-50 text-info-600"}`}>
                  <AlertOctagon className="h-5 w-5" />
                </div>
                <div className="space-y-xs">
                  <div className="flex flex-wrap items-center gap-sm">
                    <span className="text-title-2 font-semibold text-foreground">{item.type}</span>
                    <Badge tone={statusTone(item.severity)}>{item.severity} severity</Badge>
                  </div>
                  <p className="text-body-2 text-foreground">{item.description}</p>
                  <div className="flex items-center gap-md text-label-2 text-foreground-muted">
                    <span>Raised by {item.raisedBy}</span>
                    <span className="inline-flex items-center gap-xs"><ClockAlert className="h-3 w-3" /> {item.ageHours}h ago</span>
                    <span className="font-mono">{item.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <Button variant="outline" size="sm">Snooze</Button>
                <Button size="sm"><Check className="h-3.5 w-3.5" /> Resolve</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
