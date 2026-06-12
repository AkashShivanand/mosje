export default function NotFound() {
  return (
    <main style={{ padding: "var(--ds-space-12)", textAlign: "center" }}>
      <h1 style={{ fontSize: "var(--ds-text-display)", color: "var(--ds-ink)" }}>
        404
      </h1>
      <p style={{ color: "var(--ds-ink-muted)", marginTop: "var(--ds-space-4)" }}>
        This page doesn&apos;t exist in the design system docs yet.
      </p>
      <a
        href="/design-system"
        style={{
          display: "inline-block",
          marginTop: "var(--ds-space-6)",
          color: "var(--ds-primary)",
        }}
      >
        ← Back to SAMAVESH
      </a>
    </main>
  );
}
