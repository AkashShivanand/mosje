"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shell/page-header";
import { STATES } from "@/lib/states";

export default function NewLocationPage() {
  const [form, setForm] = useState({ name: "", state: "", district: "", pincode: "", type: "Traffic Signal", lat: "", lng: "" });
  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Field Operations" }, { label: "Survey Locations", href: "/survey-locations" }, { label: "New" }]}
        title="Add survey location"
        subtitle="Register a new outreach hotspot for surveyor mapping."
        actions={<Button variant="outline" size="sm" asChild><Link href="/survey-locations"><ArrowLeft className="h-3.5 w-3.5" /> Back</Link></Button>}
      />
      <form onSubmit={(e) => e.preventDefault()} className="grid gap-lg lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Location</CardTitle></CardHeader>
          <CardContent className="space-y-md">
            <div className="space-y-xs">
              <Label htmlFor="name">Location name</Label>
              <Input id="name" leftIcon={<MapPin className="h-4 w-4" />} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-md sm:grid-cols-2">
              <div className="space-y-xs">
                <Label htmlFor="state">State</Label>
                <select id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="h-10 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary">
                  <option value="">— Select state —</option>
                  {STATES.map((s) => <option key={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-xs">
                <Label htmlFor="district">District</Label>
                <Input id="district" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              </div>
              <div className="space-y-xs">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
              </div>
              <div className="space-y-xs">
                <Label htmlFor="type">Type</Label>
                <select id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="h-10 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary">
                  {["Traffic Signal", "Religious Place", "Market", "Railway Station", "Bus Stop", "Slum"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Geolocation</CardTitle></CardHeader>
          <CardContent className="space-y-md">
            <div className="grid gap-md sm:grid-cols-2">
              <div className="space-y-xs">
                <Label htmlFor="lat">Latitude</Label>
                <Input id="lat" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} placeholder="19.0760" />
              </div>
              <div className="space-y-xs">
                <Label htmlFor="lng">Longitude</Label>
                <Input id="lng" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} placeholder="72.8777" />
              </div>
            </div>
            <div className="grid h-44 place-items-center rounded-md border border-dashed border-stroke-300 bg-neutral-50 text-foreground-muted">
              Map preview (drag the marker to set precise coordinates)
            </div>
            <Button type="submit" className="w-full"><Save className="h-4 w-4" /> Save location</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
