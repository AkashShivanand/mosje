"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, Send } from "lucide-react";
import { Button } from "@/components/smile-admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/smile-admin/ui/card";
import { Checkbox } from "@/components/smile-admin/ui/checkbox";
import { Input } from "@/components/smile-admin/ui/input";
import { Label } from "@/components/smile-admin/ui/label";
import { PageHeader } from "@/components/smile-admin/shell/page-header";

export default function ComposePage() {
  const [form, setForm] = useState({ title: "", body: "", audience: "All states", channels: { sms: true, email: true, app: true } });
  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Communications" }, { label: "Notifications", href: "/portals/smile-admin/notifications" }, { label: "Compose" }]}
        title="Compose notification"
        subtitle="Reach surveyors, IAs, nodal officers or all portal users in a single broadcast."
        actions={<Button variant="outline" size="sm" asChild><Link href="/portals/smile-admin/notifications"><ArrowLeft className="h-3.5 w-3.5" /> Back</Link></Button>}
      />
      <form className="grid gap-lg lg:grid-cols-[2fr_1fr]" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader><CardTitle>Message</CardTitle></CardHeader>
          <CardContent className="space-y-md">
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Audience &amp; channels</CardTitle></CardHeader>
          <CardContent className="space-y-md">
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
                <label key={k} className="flex items-center gap-sm text-body-3">
                  <Checkbox
                    checked={form.channels[k as "sms" | "email" | "app"]}
                    onCheckedChange={(c) => setForm({ ...form, channels: { ...form.channels, [k]: c === true } })}
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="rounded-md bg-info-50 p-md text-body-3 text-info-600">
              <Bell className="mr-xs inline h-3.5 w-3.5" /> Estimated reach: ~12,420 recipients
            </div>
            <Button type="submit" className="w-full"><Send className="h-4 w-4" /> Send broadcast</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
