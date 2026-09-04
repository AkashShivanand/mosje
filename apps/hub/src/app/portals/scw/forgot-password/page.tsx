"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Field, TextInput } from "@/components/scw/ui";
import { Icon } from "@mosje/design-system";

/**
 * The destination of the "Forgot Password?" link on the SCW login form, which
 * pointed here while nothing was mounted at the path — so the one recovery route
 * out of a failed sign-in answered with a 404.
 *
 * Modelled on the nhapoa and pm-ajay pages of the same name, down to the shared
 * link styling, and keyed on Mobile Number because that is the credential the SCW
 * login form actually asks for. The confirmation is deliberately worded so that it
 * does not disclose whether the number is registered.
 */
export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [mobile, setMobile] = React.useState("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-card">
        {submitted ? (
          <div className="text-center">
            <Icon name="check_circle" size={48} className="mx-auto text-approve" />
            <h1 className="mt-4 text-headline-3 text-ink">Reset link sent</h1>
            <p className="mt-2 text-body-2 text-ink-muted">
              If{" "}
              <span className="font-semibold text-ink">
                {mobile || "that mobile number"}
              </span>{" "}
              is registered, a password-reset link has been sent to it.
            </p>
            <Link
              href="/portals/scw/login"
              className="mt-6 inline-flex items-center gap-2 text-label-1 text-navy hover:underline"
            >
              <Icon name="arrow_back" size={16} /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-headline-3 text-ink">Forgot Password</h1>
            <p className="mt-1 mb-6 text-body-2 text-ink-muted">
              Enter your registered mobile number and we&apos;ll send a reset link.
            </p>
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <Field label="Mobile Number" required>
                <TextInput
                  type="tel"
                  value={mobile}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMobile(e.target.value)
                  }
                  placeholder="Enter your registered mobile number"
                />
              </Field>
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
            <Link
              href="/portals/scw/login"
              className="mt-6 inline-flex items-center gap-2 text-label-1 text-navy hover:underline"
            >
              <Icon name="arrow_back" size={16} /> Back to login
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
