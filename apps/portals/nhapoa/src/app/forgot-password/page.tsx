"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button, Field, TextInput } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = React.useState(false);
  const [username, setUsername] = React.useState("");

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-card">
        {submitted ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-approve" />
            <h1 className="mt-4 text-xl font-bold text-ink">Reset link sent</h1>
            <p className="mt-2 text-sm text-ink-muted">
              If <span className="font-semibold text-ink">{username || "that account"}</span> exists, a
              password-reset link has been sent to the registered contact.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-ink">Forgot Password</h1>
            <p className="mt-1 mb-6 text-sm text-ink-muted">
              Enter your username and we&apos;ll send a reset link.
            </p>
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <Field label="Username" required>
                <TextInput
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </Field>
              <Button type="submit" className="w-full">
                Send reset link
              </Button>
            </form>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
