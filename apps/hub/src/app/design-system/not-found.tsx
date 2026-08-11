export default function NotFound() {
  return (
    <main style={{ padding: "var(--sa-section-m)", textAlign: "center" }}>
      <h1 style={{ fontSize: "var(--sa-type-display-1-size)", color: "var(--sa-color-text-default)" }}>
        404
      </h1>
      <p style={{ color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-m)" }}>
        This page doesn&apos;t exist in the design system docs yet.
      </p>
      <a
        href="/design-system"
        style={{
          display: "inline-block",
          marginTop: "var(--sa-stack-l)",
          color: "var(--sa-color-action-primary-default)",
        }}
      >
        ← Back to SAMAVESH
      </a>
    </main>
  );
}
