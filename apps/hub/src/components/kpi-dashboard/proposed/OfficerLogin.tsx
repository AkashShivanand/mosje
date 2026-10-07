"use client";

import * as React from "react";
import Link from "next/link";
import { AuthFormCard, Button, Card, CardBody, Icon, OrgLogo, PasswordFields } from "@mosje/design-system";
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
 * FORGOT PASSWORD IS LEFT OFF until the accounts are real: a link with no recovery page behind
 * it is a dead end. The DS's PortalRecoveryTemplate is the page to add when it is wanted.
 * No consent line: officers only, as E-Anudaan's login decided (7 Sep 2026).
 *
 * DS Audit: Card / CardBody ✅ · OrgLogo (the emblem) ✅ · AuthFormCard ✅ · PasswordFields ✅ ·
 * Button ✅ · Icon ✅.
 */

interface FieldErrors {
  userId?: string;
  password?: string;
}

export function OfficerLogin({ backHref, sectionLevel, onSignedIn }: { backHref: string; sectionLevel: 2 | 3; onSignedIn: () => void }) {
  const [userId, setUserId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  // A refused sign-in is the FORM's error, not the User ID's: the reader cannot tell which of
  // the two was wrong, and naming one would tell a stranger which User IDs exist.
  const [refused, setRefused] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: FieldErrors = {
      userId: userId.trim() ? undefined : "Enter your User ID.",
      password: password ? undefined : "Enter your password.",
    };
    setErrors(next);
    if (next.userId || next.password) return setRefused(false);
    const account = accountByUserId(userId);
    setRefused(!account);
    if (!account) return;
    setViewer(account.id);
    onSignedIn();
  };

  return (
    <div className="pd-story">
      <Button appearance="text" size="sm" href={backHref} linkAs={Link} iconLeft={<Icon name="arrow_back" size={16} />} className="pd-back">
        Beneficiary Dashboard
      </Button>
      {/* One centred card on a quiet ground (Option A, approved 7 Oct 2026): the emblem, the
          title and what it signs into — no paragraph about scope; the account decides that. */}
      <section className="pd-login" aria-label="Officer Login">
        <Card className="pd-login__card">
          <CardBody className="pd-login__body">
            <OrgLogo path={null} size="lg" name="" className="pd-login__mark" />
            <AuthFormCard
              heading="Officer Login"
              headingLevel={sectionLevel}
              description="Beneficiary Dashboard"
              error={refused ? "The User ID or password is incorrect. Check both and try again." : undefined}
              onSubmit={submit}
              credentialFields={
                <PasswordFields
                  identifier={userId}
                  onIdentifierChange={setUserId}
                  password={password}
                  onPasswordChange={setPassword}
                  identifierLabel="User ID"
                  identifierPlaceholder="Enter your User ID"
                  identifierError={errors.userId}
                  passwordError={errors.password}
                />
              }
              primaryAction={
                <Button type="submit" appearance="filled" fullWidth>
                  Sign In
                </Button>
              }
            />
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
