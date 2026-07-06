"use client";

import * as React from "react";
import { Modal } from "@mosje/design-system";
import { Button } from "@/components/ui";
import { RENAME, RENAME_KEYS, campaignActive } from "@/lib/rename-campaign";

/**
 * Login pop-up — the second artefact the OM (06.07.2026) explicitly requests
 * ("a pop-up notification on login"). Announces the NHAA → SAMBAL rename on the
 * login screen, once per browser, for the campaign window. Composes the shared
 * accessible DS <Modal> (focus trap, Escape, aria-modal) — no bespoke dialog.
 */
export function RenameNotice() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!campaignActive()) return;
    if (localStorage.getItem(RENAME_KEYS.noticeAck) === "1") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(true);
  }, []);

  function acknowledge() {
    localStorage.setItem(RENAME_KEYS.noticeAck, "1");
    setOpen(false);
  }

  return (
    <Modal
      open={open}
      onClose={acknowledge}
      size="sm"
      title={
        <span className="flex items-baseline gap-2">
          <span>We&rsquo;ve been renamed</span>
        </span>
      }
      footer={
        <Button onClick={acknowledge} className="w-full sm:w-auto">
          Understood
        </Button>
      }
    >
      <div className="space-y-4 text-sm text-ink-muted">
        <div className="rounded-xl bg-surface-muted p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-hint">
            {RENAME.oldName}
          </p>
          <p className="mt-1 text-xs text-ink-hint">is now</p>
          <p className="mt-1 text-2xl font-bold text-navy">
            {RENAME.newNameHi} <span className="tracking-tight">{RENAME.newName}</span>
          </p>
        </div>
        <p>
          The helpline is the same — <span className="font-semibold text-ink">same team,
          same number</span>. Only the name has changed, to <span className="font-semibold text-ink">
          {RENAME.newNameHi} ({RENAME.newName})</span>, meaning <em>support</em>.
        </p>
        <p className="rounded-lg border border-line bg-white px-3 py-2 text-ink">
          24&times;7 Helpline:{" "}
          <span className="font-bold text-navy">{RENAME.helpline}</span>{" "}
          <span className="text-ink-hint">·</span>{" "}
          <span className="font-bold text-navy">{RENAME.shortCode}</span>
        </p>
      </div>
    </Modal>
  );
}
