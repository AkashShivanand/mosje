"use client";

import * as React from "react";
import { X } from "lucide-react";
import { RENAME, RENAME_KEYS, RENAME_MESSAGE, campaignActive } from "@/lib/nhapoa/rename-campaign";

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

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Portal name change notice"
      className="sticky top-0 z-40 border-b border-white/10 bg-navy-950 text-white"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-xs sm:text-sm">
        <span aria-hidden className="hidden h-2 w-2 shrink-0 rounded-full bg-saffron sm:block" />
        <p className="min-w-0 flex-1 leading-snug">
          <span className="font-semibold">{RENAME.oldName}</span> is now{" "}
          <span className="font-bold">
            {RENAME.newNameHi} {RENAME.newName}
          </span>{" "}
          <span className="text-white/75">
            — same helpline, same number ({RENAME.helpline} · {RENAME.shortCode}).
          </span>
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(RENAME_KEYS.bannerDismissed, "1");
            setShow(false);
          }}
          aria-label="Dismiss name change notice"
          className="grid h-6 w-6 shrink-0 place-items-center rounded hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Announce once to assistive tech without stealing focus. */}
      <span className="sr-only" role="status">
        {RENAME_MESSAGE}
      </span>
    </div>
  );
}
