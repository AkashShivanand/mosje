export default function NotFound() {
  return (
    <main style={{ padding: "var(--sa-section-48)", textAlign: "center" }}>
      <h1 style={{ fontSize: "var(--sa-type-display-1-size)", color: "var(--sa-color-text-default)" }}>
        404
      </h1>
      <p style={{ color: "var(--sa-text-neutral-subtle)", marginTop: "var(--sa-stack-16)" }}>
        This page doesn&apos;t exist in the design system docs yet.
      </p>
      <a
        href="/design-system"
        style={{
          display: "inline-block",
          marginTop: "var(--sa-stack-24)",
          color: "var(--sa-text-brand-primary-base)",
        }}
      >
        ← Back to SAMAVESH
      </a>
    </main>
  );
}
