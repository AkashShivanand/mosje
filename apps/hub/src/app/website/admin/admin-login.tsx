"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Alert, Button, FormField, Icon, Input, PasswordInput } from "@mosje/design-system";

/**
 * Admin Login — UI clone only. This is a placeholder screen; it performs no real
 * authentication and transmits no credentials. Real auth is out of scope for the clone.
 */
export function AdminLogin() {
  const [notice, setNotice] = useState(false);

  return (
    <main className="flex min-h-screen flex-col bg-surface-muted">
      <div className="bg-primary py-3 text-center text-[13px] text-white">
        Government of India · Ministry of Social Justice &amp; Empowerment
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <Image src="/website/images/National-Emblem-logo.svg" alt="National Emblem of India" width={48} height={62} className="h-16 w-auto" />
            <h1 className="mt-4 text-[22px] font-bold text-ink">Admin Login</h1>
            <p className="mt-1 text-[14px] text-ink-muted">
              Department of Social Justice &amp; Empowerment
            </p>
          </div>

          {notice && (
            <div className="mt-6">
              <Alert status="warning" title="Demo screen">
                Authentication is not enabled in this clone.
              </Alert>
            </div>
          )}

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setNotice(true);
            }}
          >
            <FormField label="Username" id="username" required>
              {(control) => (
                <Input
                  {...control}
                  name="username"
                  type="text"
                  autoComplete="username"
                  leftIcon={<Icon name="person" size={16} />}
                />
              )}
            </FormField>
            <FormField label="Password" id="password" required>
              {(control) => (
                <PasswordInput
                  {...control}
                  name="password"
                  autoComplete="current-password"
                  leftIcon={<Icon name="lock" size={16} />}
                />
              )}
            </FormField>
            <Button type="submit" size="md" className="w-full">
              Sign In
            </Button>
          </form>

          <Link href="/website" className="mt-6 flex items-center justify-center gap-1.5 text-[14px] text-primary hover:underline">
            <Icon name="arrow_back" size={16} />
            Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
