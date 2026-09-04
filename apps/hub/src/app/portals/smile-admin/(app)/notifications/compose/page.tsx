"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { Button, Card, CardBody, CardHeader, CardTitle, Checkbox, Icon, Input, Label, buttonClasses } from "@mosje/design-system";

export default function ComposePage() {
  const [form, setForm] = useState({ title: "", body: "", audience: "All states", channels: { sms: true, email: true, app: true } });
  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Communications" }, { label: "Notifications", href: "/portals/smile-admin/notifications" }, { label: "Compose" }]}
        title="Compose notification"
        subtitle="Reach surveyors, IAs, nodal officers or all portal users in a single broadcast."
        actions={<Link href="/portals/smile-admin/notifications" className={buttonClasses("primary", "outlined", "sm")}><Icon name="arrow_back" size={14} /> Back</Link>}
      />
      <form className="grid gap-lg lg:grid-cols-[2fr_1fr]" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader><CardTitle>Message</CardTitle></CardHeader>
          <CardBody className="space-y-md">
            <div className="space-y-xs">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Quarterly fund release" />
            </div>
            <div className="space-y-xs">
              <Label htmlFor="body">Body</Label>
              <textarea
                id="body"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Use plain language. Avoid acronyms when possible."
                className="min-h-[160px] w-full rounded-md border border-stroke-300 bg-white p-md text-body-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Audience &amp; channels</CardTitle></CardHeader>
          <CardBody className="space-y-md">
            <div className="space-y-xs">
              <Label htmlFor="audience">Audience</Label>
              <select id="audience" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} className="h-10 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary">
                <option>All portal users</option>
                <option>All states</option>
                <option>State Nodal Officers</option>
                <option>District Nodal Officers</option>
                <option>Implementing Agencies</option>
                <option>Surveyors</option>
                <option>Shelter Managers</option>
              </select>
            </div>
            <div className="space-y-sm">
              <Label>Channels</Label>
              {([
                ["sms",   "SMS"],
                ["email", "Email"],
                ["app",   "In-app push"],
              ] as [string, string][]).map(([k, label]) => (
                <label key={k} className="flex items-center gap-sm text-body-2">
                  <Checkbox
                    checked={form.channels[k as "sms" | "email" | "app"]}
                    onChange={(e) => setForm({ ...form, channels: { ...form.channels, [k]: e.target.checked === true } })}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="rounded-md bg-info-50 p-md text-body-2 text-info-600">
              <Icon name="notifications" size={14} className="mr-xs inline" /> Estimated reach: ~12,420 recipients
            </div>
            <Button type="submit" className="w-full"><Icon name="send" size={16} /> Send broadcast</Button>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
