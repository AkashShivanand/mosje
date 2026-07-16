"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Lock, User, ArrowLeft } from "lucide-react";
import { Button, Alert } from "@mosje/design-system";

/**
 * Admin Login — UI clone only. This is a placeholder screen; it performs no real
 * authentication and transmits no credentials. Real auth is out of scope for the clone.
 */
export function AdminLogin() {
  const [notice, setNotice] = useState(false);

  return (
    <main className="flex min-h-screen flex-col bg-surface-muted">
      <div className="bg-gov-blue py-3 text-center text-[13px] text-white">
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
            <div>
              <label htmlFor="username" className="mb-1 block text-[14px] font-medium text-ink">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-[14px] outline-none focus:border-gov-blue focus:ring-2 focus:ring-gov-blue/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-[14px] font-medium text-ink">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-[14px] outline-none focus:border-gov-blue focus:ring-2 focus:ring-gov-blue/20"
                />
              </div>
            </div>
            <Button type="submit" size="md" className="w-full">
              Sign In
            </Button>
          </form>

          <Link href="/website" className="mt-6 flex items-center justify-center gap-1.5 text-[14px] text-gov-blue hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>
        </div>
      </div>
    </main>
  );
}
