"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Card, CardBody, FormField, Icon, Input, PasswordInput, SectionTitle } from "@mosje/design-system";
import { accountByUserId } from "@/lib/kpi/access";
import { setViewer } from "@/lib/kpi/viewer";

/**
 * OFFICER LOGIN — the dashboard's own sign-in (`?view=login`), opened from the Officer Login
 * button at the top of the dashboard. The dashboard has a separate login of its own, decided
 * 6 Oct 2026: a citizen sees only the Pre-Login KPIs and never signs in; an officer signs in
 * to see the Post-Login KPIs for their office as well.
 *
 * TWO AUDIENCES, AND THE ACCOUNT DECIDES THE SCOPE (instruction, 7 Oct 2026). The sheet has
 * Public and Officer only. Signing in makes the reader an officer; which portals and which
 * State or District they see is the account's (`accountByUserId`), never a choice on this
 * form. The Office picker that stood here let a reader choose their own scope, which no
 * real login does.
 *
 * A PROTOTYPE OF THE SCREEN, NOT AUTHENTICATION. Nothing is sent anywhere and the password
 * is not checked: a known User ID sets the dashboard's viewer (`setViewer`). The demo rail
 * lists the prototype's User IDs.
 *
 * DS Audit: SectionTitle ✅ · Card / CardBody ✅ · FormField ✅ · Input ✅ ·
 * PasswordInput ✅ · Button ✅ · Icon ✅.
 */

interface FieldErrors {
  userId?: string;
  password?: string;
}

export function OfficerLogin({ backHref, sectionLevel, onSignedIn }: { backHref: string; sectionLevel: 2 | 3; onSignedIn: () => void }) {
  const [userId, setUserId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {
      userId: userId.trim() ? undefined : "Enter your User ID.",
      password: password ? undefined : "Enter your password.",
    };
    const account = next.userId || next.password ? undefined : accountByUserId(userId);
    if (!next.userId && !next.password && !account) next.userId = "The User ID or password is incorrect.";
    setErrors(next);
    if (!account) return;
    setViewer(account.id);
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
          description="For officers of the Department, its Divisions and the scheme portals. Your account decides which programmes and which State or District you see."
        />
        <Card className="pd-login__card">
          <CardBody>
            <form className="pd-login__form" noValidate onSubmit={submit}>
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
