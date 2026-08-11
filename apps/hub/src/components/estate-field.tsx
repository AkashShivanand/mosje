/**
 * The estate's signature surface: a fine measured grid under a soft radial
 * glow, masked so it fades out rather than ending at an edge.
 *
 * Extracted from the hub hero so the gate can render the *same* surface rather
 * than an imitation of it. That shared field is what makes the sign-in wall and
 * the landing page read as two rooms in one building instead of two products.
 *
 * The grid is 44px — the same measure as the minimum control target used
 * throughout the design system, so the background is on the same rhythm as the
 * things sitting on top of it.
 */

export type EstateFieldTone = "light" | "dark";

export interface EstateFieldProps {
  /** `light` tints toward the page surface; `dark` sits on navy. */
  tone?: EstateFieldTone;
  /** Where the glow originates, as a CSS position. @default "72% 0%" */
  origin?: string;
}

export function EstateField({ tone = "light", origin = "72% 0%" }: EstateFieldProps) {
  const gridColor =
    tone === "dark" ? "color-mix(in srgb, #ffffff 12%, transparent)" : "var(--sa-border-neutral-subtle)";

  const glow =
    tone === "dark"
      ? `radial-gradient(64rem 36rem at ${origin}, color-mix(in srgb, var(--sa-color-action-primary-default) 42%, transparent), transparent 68%)`
      : `radial-gradient(64rem 36rem at 82% -12%, color-mix(in srgb, var(--sa-color-action-primary-default) 16%, transparent), transparent 70%), radial-gradient(40rem 28rem at 4% 116%, color-mix(in srgb, var(--sa-color-brand-navy) 10%, transparent), transparent 68%)`;

  const mask = `radial-gradient(72rem 42rem at ${origin}, black, transparent 76%)`;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: glow }}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${tone === "dark" ? "opacity-70" : "opacity-50"}`}
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </>
  );
}
