"use client";

import { useState } from "react";
import Link from "next/link";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import { STATES } from "@/lib/smile-admin/states";
import { ROLE_LABELS } from "@/lib/smile-admin/roles";
import { Button, Card, CardBody, CardHeader, CardTitle, Checkbox, Icon, Input, Label, buttonClasses } from "@mosje/design-system";

export default function OnboardPage() {
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", role: "state_nodal_officer", state: "", district: "",
    notifyByEmail: true, notifyBySms: true,
  });

  return (
    <div className="space-y-lg">
      <SmilePageHeader
        breadcrumbs={[{ label: "Access Control" }, { label: "Users", href: "/portals/smile-admin/users" }, { label: "Onboard user" }]}
        title="Onboard user"
        subtitle="Invite a state, district or field-operations user to the SMILE portal."
        actions={<Link href="/portals/smile-admin/users" className={buttonClasses("primary", "outlined", "sm")}><Icon name="arrow_back" size={14} /> Back to users</Link>}
      />

      <form className="grid gap-lg lg:grid-cols-[2fr_1fr]" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader><CardTitle>Identity</CardTitle></CardHeader>
          <CardBody className="grid gap-md md:grid-cols-2">
            <div className="space-y-xs md:col-span-2">
              <Label htmlFor="name" required>Full name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="As recorded in official records"
                required
                aria-required
                autoComplete="name"
              />
            </div>
            <div className="space-y-xs">
              <Label htmlFor="email" required>Email</Label>
              <Input
                id="email"
                type="email"
                leftIcon={<Icon name="mail" size={16} aria-hidden />}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@smile.gov.in"
                required
                aria-required
                autoComplete="email"
              />
            </div>
            <div className="space-y-xs">
              <Label htmlFor="mobile" required>Mobile</Label>
              <Input
                id="mobile"
                leftIcon={<Icon name="call" size={16} aria-hidden />}
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="10-digit mobile number"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                aria-required
                autoComplete="tel-national"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Role &amp; scope</CardTitle></CardHeader>
          <CardBody className="space-y-md">
            <div className="space-y-xs">
              <Label htmlFor="role" required>Role</Label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
                aria-required
                className="h-10 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary"
              >
                {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                <option value="implementing_agency">Implementing Agency</option>
                <option value="surveyor">Surveyor</option>
                <option value="shelter_manager">Shelter Manager</option>
              </select>
            </div>
            <div className="space-y-xs">
              <Label htmlFor="state" required hint="(applies access scope)">State</Label>
              <select
                id="state"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                required
                aria-required
                className="h-10 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary"
              >
                <option value="">— Select state —</option>
                {STATES.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-xs">
              <Label htmlFor="district" hint="(optional)">District</Label>
              <Input
                id="district"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="Required for District Nodal Officer / Field roles"
              />
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Invitation</CardTitle></CardHeader>
          <CardBody className="space-y-md">
            <p className="text-body-2 text-ink-muted">
              We&apos;ll send the user a secure invite link valid for 24 hours. They can complete profile setup, set a password and verify their mobile via OTP before signing in.
            </p>
            <div className="flex flex-wrap items-center gap-lg">
              <label className="flex items-center gap-sm text-body-2">
                <Checkbox checked={form.notifyByEmail} onChange={(e) => setForm({ ...form, notifyByEmail: e.target.checked === true })} /> Email invite
              </label>
              <label className="flex items-center gap-sm text-body-2">
                <Checkbox checked={form.notifyBySms} onChange={(e) => setForm({ ...form, notifyBySms: e.target.checked === true })} /> SMS invite
              </label>
            </div>
            <div className="flex items-center gap-sm">
              <Button type="submit"><Icon name="person_add" size={16} /> Send invite</Button>
              <Button type="button" appearance="outlined">Save as draft</Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
