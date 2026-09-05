import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "App not running — SAMAVESH",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ zone?: string; cmd?: string; from?: string }>;
}

export default async function ZoneUnavailablePage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const { zone = "This app", cmd = "npm run dev", from } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--sa-padding-24, 24px)",
        background: "var(--sa-bg-neutral-subtler, #f8f9fa)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "32rem",
          background: "var(--sa-bg-neutral-base, #fff)",
          border: "1px solid var(--sa-border-neutral-subtle, #f1f3f5)",
          borderRadius: "var(--sa-shape-8, 8px)",
          padding: "var(--sa-padding-32, 32px)",
          boxShadow: "var(--sa-elevation-modal, 0 12px 16px -4px rgba(31, 36, 40, 0.08), 0 4px 6px -2px rgba(31, 36, 40, 0.03))",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--sa-shape-6, 6px)",
            background: "var(--sa-bg-status-warning-base, #fff4e5)",
            color: "var(--sa-text-status-warning-base, #8c571f)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--sa-type-headline-4-size)",
            lineHeight: "var(--sa-type-headline-4-lh)",
            marginBottom: "var(--sa-padding-20, 20px)",
          }}
        >
          ⚠
        </div>

        <h1
          style={{
            fontSize: "var(--sa-type-headline-2-size)",
            lineHeight: "var(--sa-type-headline-2-lh)",
            fontWeight: "var(--sa-font-weight-semibold)",
            color: "var(--sa-text-neutral-base, #1f2428)",
            marginBottom: "var(--sa-stack-8, 8px)",
          }}
        >
          {zone}{" "}isn&apos;t running
        </h1>

        <p
          style={{
            fontSize: "var(--sa-type-body-1-size)",
            color: "var(--sa-text-neutral-subtle, #343a40)",
            lineHeight: "var(--sa-type-body-1-lh)",
            marginBottom: "var(--sa-padding-20, 20px)",
          }}
        >
          The hub couldn&apos;t reach this app{from ? <> at <code>{from}</code></> : null}. It&apos;s served by
          its own dev server, which isn&apos;t up right now — so there&apos;s nothing to load here yet.
        </p>

        <div
          style={{
            background: "var(--sa-bg-neutral-subtler, #f8f9fa)",
            border: "1px solid var(--sa-border-neutral-subtle, #f1f3f5)",
            borderRadius: "var(--sa-shape-6, 6px)",
            padding: "var(--sa-padding-16, 16px)",
            marginBottom: "var(--sa-padding-20, 20px)",
          }}
        >
          <div
            style={{
              fontSize: "var(--sa-type-label-3-size, 11px)",
              fontWeight: "var(--sa-font-weight-bold)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--sa-text-neutral-subtle, #343a40)",
              marginBottom: "var(--sa-stack-8, 8px)",
            }}
          >
            Start everything (recommended)
          </div>
          <code
            style={{
              display: "block",
              fontFamily: "var(--sa-font-mono, ui-monospace, monospace)",
              fontSize: "var(--sa-type-body-2-size, 14px)",
              color: "var(--sa-text-neutral-base, #1f2428)",
              marginBottom: "var(--sa-stack-16, 16px)",
            }}
          >
            npm run dev
          </code>
          <div
            style={{
              fontSize: "var(--sa-type-label-3-size, 11px)",
              fontWeight: "var(--sa-font-weight-bold)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--sa-text-neutral-subtle, #343a40)",
              marginBottom: "var(--sa-stack-8, 8px)",
            }}
          >
            …or just this app
          </div>
          <code
            style={{
              display: "block",
              fontFamily: "var(--sa-font-mono, ui-monospace, monospace)",
              fontSize: "var(--sa-type-body-2-size, 14px)",
              color: "var(--sa-text-neutral-base, #1f2428)",
            }}
          >
            {cmd}
          </code>
        </div>

        <div style={{ display: "flex", gap: "var(--sa-stack-12, 12px)", flexWrap: "wrap" }}>
          <a
            href={from ?? "/"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px var(--sa-padding-20, 20px)",
              borderRadius: "var(--sa-shape-6, 6px)",
              background: "var(--sa-color-action-primary-default, #0373df)",
              color: "var(--sa-on-bg-brand-primary-bolder, #fff)",
              fontWeight: "var(--sa-font-weight-semibold)",
              fontSize: "var(--sa-type-body-2-size, 14px)",
              textDecoration: "none",
            }}
          >
            Retry
          </a>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px var(--sa-padding-20, 20px)",
              borderRadius: "var(--sa-shape-6, 6px)",
              border: "1px solid var(--sa-border-neutral-base, #e2e6ea)",
              color: "var(--sa-text-neutral-base, #1f2428)",
              fontWeight: "var(--sa-font-weight-semibold)",
              fontSize: "var(--sa-type-body-2-size, 14px)",
              textDecoration: "none",
            }}
          >
            Back to hub
          </Link>
        </div>
      </div>
    </main>
  );
}
