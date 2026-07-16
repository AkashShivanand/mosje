import type { Metadata } from "next";
import "./website.css";

export const metadata: Metadata = {
  title: "Ministry of Social Justice and Empowerment",
  description:
    "Department of Social Justice & Empowerment (DoSJE), Ministry of Social Justice & Empowerment, Government of India.",
  icons: {
    icon: "/website/seo/favicon.png",
    apple: "/website/seo/favicon.png",
  },
};

/**
 * The website mounts natively in the hub, so this is a NESTED layout: the hub's
 * root layout owns <html>/<body>, the Noto Sans font, ColorModeProvider, the
 * accessibility widget, the AppSwitcher and icons.css.
 *
 * The original <html> carried only `lang`/`suppressHydrationWarning` and
 * `h-full antialiased` + the font variable (all of which the hub root already
 * sets) — verified against the last commit that held the pre-migration layout.
 * It carried NO design-semantic data-* attributes, and deliberately gets no
 * `data-surface="portal"`: this is the website, not a portal.
 *
 * `data-site="website"` is what binds the website's palette, radius scale and
 * base rules to this subtree — see website.css.
 *
 * The wrapper reproduces the old `<body className="min-h-full flex flex-col">`.
 * `min-h-screen` rather than `min-h-full`: a percentage min-height resolves
 * against the parent's height, and the hub's <body> has `height: auto` (only
 * min-height is set), so `min-h-full` here would collapse to 0 and the footer
 * would ride up on short pages. The background/text colours come from
 * website.css, which the original applied via `body { @apply bg-background
 * text-foreground }`.
 */
export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-site="website" className="flex min-h-screen flex-col">
      {children}
    </div>
  );
}
