"use client";

import Link from "next/link";
import { statusTone } from "@/lib/smile-admin/status-tone";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { ExportMenu } from "@/components/smile-admin/data/export-menu";
import { NOTIFICATIONS, type Notification } from "@/lib/smile-admin/mock-data";
import { Badge, DataTable, Icon, buttonClasses, type DataTableColumn } from "@mosje/design-system";

const COLUMNS: DataTableColumn<Notification & Record<string, unknown>>[] = [
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (n) => (
      <div className="flex items-start gap-md">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary">
          <Icon name="notifications" size={16} />
        </div>
        <div>
          <div className="font-semibold text-ink">{n.title}</div>
          <div className="text-label-2 text-ink-muted">{n.body}</div>
        </div>
      </div>
    ),
    exportValue: (n) => n.title,
  },
  { key: "audience", header: "Audience", sortable: true },
  {
    key: "channel",
    header: "Channel",
    render: (n) => (
      <div className="flex flex-wrap gap-xs">
        {n.channel.map((c) => (
          <Badge key={c} status="info">
            {c}
          </Badge>
        ))}
      </div>
    ),
    exportValue: (n) => n.channel.join(", "),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (n) => <Badge status={statusTone(n.status)}>{n.status}</Badge>,
    exportValue: (n) => n.status,
  },
  { key: "sentAt", header: "Sent at", sortable: true, className: "text-ink-muted" },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Communications" }, { label: "Notifications" }]}
        eyebrow="Communications"
        title="Notifications"
        subtitle="Broadcast and scheduled messages sent to portal users across states, districts, and field roles."
        actions={
          <div className="flex items-center gap-sm">
            <ExportMenu
              filename="smile-notifications"
              title="Notifications"
              subtitle="System and broadcast notifications sent to stakeholders."
              columns={[
                { header: "S.No.", accessor: (r: Notification & { sno: number }) => r.sno },
                { header: "Notification Title", accessor: "title" },
                { header: "Channel", accessor: (r) => r.channel.join(", ") },
                { header: "Target Audience", accessor: "audience" },
                { header: "Sent On", accessor: "sentAt" },
                { header: "Status", accessor: "status" },
              ]}
              rows={NOTIFICATIONS.map((n, i) => ({ ...n, sno: i + 1 }))}
            />
            <Link href="/portals/smile-admin/notifications/compose" className={buttonClasses("primary", "filled", "sm")}>
                <Icon name="edit_square" size={14} /> Compose
              </Link>
          </div>
        }
      />
      {/* Mobile cards */}
      <ul className="space-y-sm md:hidden">
        {NOTIFICATIONS.map((n) => (
          <li
            key={n.id}
            className="rounded-lg border border-stroke-200 bg-white p-md shadow-xs"
          >
            <div className="flex items-start gap-md">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary ring-1 ring-inset ring-primary-100">
                <Icon name="notifications" size={16} />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-sm">
                  <div className="min-w-0 truncate font-semibold text-ink">
                    {n.title}
                  </div>
                  <Badge status={statusTone(n.status)} dot>
                    {n.status}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-label-2 text-ink-muted">{n.body}</p>
                <div className="flex flex-wrap items-center gap-xs pt-1">
                  {n.channel.map((c) => (
                    <Badge key={c} status="info">
                      {c}
                    </Badge>
                  ))}
                  <span className="ml-auto text-body-3 text-ink-hint">{n.sentAt}</span>
                </div>
                <div className="text-body-3 text-ink-hint">{n.audience}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden rounded-lg border border-stroke-200 bg-white p-md shadow-xs md:block">
        <DataTable
          columns={COLUMNS}
          data={NOTIFICATIONS as Array<Notification & Record<string, unknown>>}
          total={NOTIFICATIONS.length}
          showPageSizes={false}
          caption="Notifications by audience, channel and status"
          emptyLabel="No notification has been sent yet."
        />
      </div>
    </div>
  );
}
