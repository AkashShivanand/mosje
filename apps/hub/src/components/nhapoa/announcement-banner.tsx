"use client";

import * as React from "react";
import { RENAME, RENAME_KEYS, RENAME_MESSAGE, campaignActive } from "@/lib/nhapoa/rename-campaign";
import { Icon, IconButton } from "@mosje/design-system";

/**
 * Floating rename ribbon — one of the two artefacts the OM (06.07.2026)
 * explicitly requests ("a floating banner on the portal"). A slim, dismissible,
 * accessible strip pinned to the top of every page for the campaign window.
 *
 * Portal-local for now; a generic <AnnouncementBanner> belongs in
 * @mosje/design-system (tracked follow-up) so future renames across the estate
 * reuse it instead of forking.
 */
export function AnnouncementBanner() {
  // Start hidden so we never flash a banner that was already dismissed; reveal
  // after we can safely read localStorage on the client.
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (!campaignActive()) return;
    if (localStorage.getItem(RENAME_KEYS.bannerDismissed) === "1") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(true);
  }, []);

  // The login shell fills one viewport; tell it how tall this banner is so the two together
  // fit instead of scrolling by the banner's height (see --ds-plogin-offset in the DS).
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!show || !el) return;
    const measure = () => root.style.setProperty("--ds-plogin-offset", `${el.getBoundingClientRect().height}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--ds-plogin-offset");
    };
  }, [show]);
  if (!show) return null;

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Portal name change notice"
      className="sticky top-0 z-40 border-b border-white/10 bg-navy-950 text-white"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-body-2">
        <span aria-hidden className="hidden h-2 w-2 shrink-0 rounded-full bg-saffron sm:block" />
        <p className="min-w-0 flex-1">
          <span className="font-semibold">{RENAME.oldName}</span> is now{" "}
          <span className="font-bold">
            <span lang="hi">{RENAME.newNameHi}</span> {RENAME.newName}
          </span>{" "}
          <span className="text-white/75">
            — same helpline, same number ({RENAME.helpline} · {RENAME.shortCode}).
          </span>
        </p>
        <IconButton
          icon={<Icon name="close" size={16} />}
          aria-label="Dismiss name change notice"
          variant="neutral"
          appearance="text"
          tone="inverse"
          size="sm"
          shape="circle"
          onClick={() => {
            localStorage.setItem(RENAME_KEYS.bannerDismissed, "1");
            setShow(false);
          }}
        />
      </div>
      {/* Announce once to assistive tech without stealing focus. */}
      <span className="sr-only" role="status">
        {RENAME_MESSAGE}
      </span>
    </div>
  );
}
