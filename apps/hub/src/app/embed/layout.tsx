import type { Metadata } from "next";
import { EmbedAutoHeight } from "@/components/embed-auto-height";

/**
 * The shell every `/embed/*` route shares.
 *
 * It adds one thing and removes several. What it removes is in the root
 * layout, gated by `NotInEmbed`: the accessibility widget, the chat launcher
 * and the demo rail, none of which belong inside somebody else's page. What it
 * adds is the height reporter below, which is the only piece of machinery an
 * iframe genuinely needs.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EmbedAutoHeight />
      {children}
    </>
  );
}
