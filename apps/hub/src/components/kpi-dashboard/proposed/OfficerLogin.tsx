"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Card, CardBody, FormField, Icon, Input, PasswordInput, SectionTitle, Select } from "@mosje/design-system";
import { OFFICER_ROLES } from "@/lib/kpi/access";
import { setViewer } from "@/lib/kpi/viewer";

/**
 * OFFICER LOGIN — the dashboard's own sign-in (`?view=login`), opened from the Officer Login
 * button at the top of the dashboard. The dashboard has a separate login of its own, decided
 * 6 Oct 2026: a citizen sees only the Pre-Login KPIs and never signs in; an officer signs in
 * to see the Post-Login KPIs for their office as well.
 *
 * A PROTOTYPE OF THE SCREEN, NOT AUTHENTICATION. Nothing is sent anywhere and no credential
 * is checked: signing in sets the dashboard's viewer (`setViewer`), the same state the demo
 * rail's View As tab sets. The Office field stands in for what a real login would read from
 * the officer's account, so the prototype can show every office's view.
 *
 * DS Audit: SectionTitle ✅ · Card / CardBody ✅ · FormField ✅ · Select ✅ · Input ✅ ·
 * PasswordInput ✅ · Button ✅ · Icon ✅.
 */

interface FieldErrors {
  office?: string;
  userId?: string;
  password?: string;
}

export function OfficerLogin({ backHref, sectionLevel, onSignedIn }: { backHref: string; sectionLevel: 2 | 3; onSignedIn: () => void }) {
  const [office, setOffice] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {
      office: office ? undefined : "Select your office.",
      userId: userId.trim() ? undefined : "Enter your User ID.",
      password: password ? undefined : "Enter your password.",
    };
    setErrors(next);
    if (next.office || next.userId || next.password) return;
    setViewer(office);
    onSignedIn();
  };

  return (
    <div className="pd-story">
      <Button appearance="text" size="sm" href={backHref} linkAs={Link} iconLeft={<Icon name="arrow_back" size={16} />} className="pd-back">
        Beneficiary Dashboard
      </Button>
      <section className="pd-section pd-login" aria-labelledby="pd-login">
        <SectionTitle
          as={sectionLevel}
          headingId="pd-login"
          size="display"
          title="Officer Login"
          description="For officers of the Department, its Divisions and the scheme portals. The dashboard's public figures need no sign-in."
        />
        <Card className="pd-login__card">
          <CardBody>
            <form className="pd-login__form" noValidate onSubmit={submit}>
              <FormField label="Office" id="pd-login-office" required error={errors.office}>
                {(control) => (
                  <Select
                    {...control}
                    name="office"
                    value={office}
                    onChange={(e) => setOffice(e.target.value)}
                    placeholder="Select your office"
                    options={OFFICER_ROLES.map((r) => ({ value: r.id, label: r.label }))}
                  />
                )}
              </FormField>
              <FormField label="User ID" id="pd-login-user" required error={errors.userId}>
                {(control) => (
                  <Input {...control} name="username" autoComplete="username" value={userId} onChange={(e) => setUserId(e.target.value)} leftIcon={<Icon name="person" size={16} />} />
                )}
              </FormField>
              <FormField label="Password" id="pd-login-password" required error={errors.password}>
                {(control) => (
                  <PasswordInput {...control} name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} leftIcon={<Icon name="lock" size={16} />} />
                )}
              </FormField>
              <Button type="submit" appearance="filled" size="md">
                Sign In
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
