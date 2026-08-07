"use client";

import { statusTone } from "@/lib/smile-admin/status-tone";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { REVIEW_QUEUE } from "@/lib/smile-admin/mock-data";
import { Badge, Button, Card, CardBody, Icon } from "@mosje/design-system";

export default function ImmediateReviewPage() {
  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "System" }, { label: "Immediate Review" }]}
        title="Immediate Review"
        subtitle="Items the system has flagged for human judgement — sorted by severity and age."
        actions={<Button appearance="outlined" size="sm"><Icon name="filter_alt" size={14} /> Filter</Button>}
      />
      <div className="space-y-md">
        {REVIEW_QUEUE.map((item) => (
          <Card key={item.id}>
            <CardBody className="flex flex-wrap items-start justify-between gap-md p-lg">
              <div className="flex flex-1 items-start gap-md">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${item.severity === "High" ? "bg-danger-50 text-danger-600" : item.severity === "Medium" ? "bg-warning-50 text-warning-600" : "bg-info-50 text-info-600"}`}>
                  <Icon name="report" size={20} />
                </div>
                <div className="space-y-xs">
                  <div className="flex flex-wrap items-center gap-sm">
                    <span className="text-title-2 font-semibold text-ink">{item.type}</span>
                    <Badge status={statusTone(item.severity)}>{item.severity} severity</Badge>
                  </div>
                  <p className="text-body-2 text-ink">{item.description}</p>
                  <div className="flex items-center gap-md text-label-2 text-ink-muted">
                    <span>Raised by {item.raisedBy}</span>
                    <span className="inline-flex items-center gap-xs"><Icon name="alarm" size={12} /> {item.ageHours}h ago</span>
                    <span className="font-mono">{item.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <Button appearance="outlined" size="sm">Snooze</Button>
                <Button size="sm"><Icon name="check" size={14} /> Resolve</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
