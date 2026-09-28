"use client";

import * as React from "react";
import { Button, useColorMode } from "@mosje/design-system";
import { captureFileName, type CaptureScope } from "@/lib/demo-tools/capture-name";
import { WEBSITE_DESIGNS, type WebsiteDesign } from "@/lib/website-design/constants";
import {
  previousWebsiteDesign,
  readWebsiteDesign,
  restoreSectionAfterSwitch,
  switchWebsiteDesign,
} from "@/lib/website-design/switch";
import "@/components/website/data-mode.css";

/**
 * The demo rail's screenshot tool and the estate's demo keyboard shortcuts.
 *
 * Shortcuts share the colour-mode shortcut's chord (⌘⌥ / Ctrl+Alt), so there is one thing to
 * remember, and like it they work with the dock closed and are ignored while typing:
 *
 * | Chord        | Does                                         | Where           |
 * |--------------|----------------------------------------------|-----------------|
 * | ⌘⌥S          | save the visible area                        | everywhere      |
 * | ⌘⌥⇧S         | save the full page                           | everywhere      |
 * | ⌘⌥1 / 2 / 3  | New / Classic / DBIM design                  | the website     |
 * | ⌘⌥0          | back to the design shown before the last one | the website     |
 *
 * Not ⌘⌥D for "design": macOS takes it for showing and hiding the Dock before the browser
 * ever sees it. Digits match the order the Website tab lists the designs in.
 */

const NOTICE_MS = 2200;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return target.isContentEditable;
}

const designLabel = (d: WebsiteDesign) => WEBSITE_DESIGNS.find((x) => x.value === d)?.label ?? d;

export type CaptureState =
  | { status: "idle" }
  | { status: "busy"; scope: CaptureScope }
  | { status: "saved"; fileName: string }
  | { status: "failed" };

export interface DemoShortcuts {
  capture: (scope: CaptureScope) => void;
  captureState: CaptureState;
  /** Shown beside the rail; see `DemoDock`'s `notice`. */
  notice: string | null;
}

export function useDemoShortcuts({
  pathname,
  onWebsite,
  enabled = true,
}: {
  pathname: string;
  onWebsite: boolean;
  enabled?: boolean;
}): DemoShortcuts {
  const [captureState, setCaptureState] = React.useState<CaptureState>({ status: "idle" });
  const [notice, setNotice] = React.useState<string | null>(null);
  const noticeTimer = React.useRef<number | null>(null);
  const busy = React.useRef(false);
  const { mode, modes } = useColorMode();

  /** `hold` keeps the notice up until the next one replaces it — for work still under way. */
  const say = React.useCallback((text: string, hold = false) => {
    setNotice(text);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = hold ? null : window.setTimeout(() => setNotice(null), NOTICE_MS);
  }, []);
  React.useEffect(
    () => () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    },
    [],
  );

  const capture = React.useCallback(
    (scope: CaptureScope) => {
      if (busy.current) return;
      busy.current = true;
      setCaptureState({ status: "busy", scope });
      say(scope === "page" ? "Capturing the full page…" : "Capturing the visible area…", true);
      // The default mode goes unnamed; any other is part of what the shot shows.
      const colour = mode === modes[0]?.id ? null : (modes.find((m) => m.id === mode)?.label ?? mode);
      const fileName = captureFileName({
        pathname,
        scope,
        design: onWebsite ? designLabel(readWebsiteDesign()) : null,
        colour,
        date: new Date(),
      });
      // Loaded on first use: most visits to a demo never take a screenshot.
      import("@/lib/demo-tools/capture")
        .then(async ({ capturePage, downloadBlob }) => downloadBlob(await capturePage(scope), fileName))
        .then(() => {
          setCaptureState({ status: "saved", fileName });
          say("Screenshot saved");
        })
        .catch(() => {
          setCaptureState({ status: "failed" });
          say("The screenshot could not be taken");
        })
        .finally(() => {
          busy.current = false;
        });
    },
    [mode, modes, onWebsite, pathname, say],
  );

  // After a design switch: back to the same section, and name the design now showing.
  React.useEffect(() => {
    if (!enabled || !onWebsite) return;
    const stop = restoreSectionAfterSwitch();
    if (!stop) return;
    // Deferred a frame: the notice is the answer to the switch, not part of this render.
    const raf = window.requestAnimationFrame(() => say(designLabel(readWebsiteDesign())));
    return () => {
      window.cancelAnimationFrame(raf);
      stop();
    };
  }, [enabled, onWebsite, say]);

  React.useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || !(event.metaKey || event.ctrlKey)) return;
      if (event.repeat || isTypingTarget(event.target)) return;
      if (event.code === "KeyS") {
        event.preventDefault();
        capture(event.shiftKey ? "page" : "viewport");
        return;
      }
      if (!onWebsite) return;
      const digit = /^(?:Digit|Numpad)([0-3])$/.exec(event.code)?.[1];
      if (digit === undefined) return;
      event.preventDefault();
      const current = readWebsiteDesign();
      const next = digit === "0" ? previousWebsiteDesign() : WEBSITE_DESIGNS[Number(digit) - 1]?.value;
      if (!next || next === current) {
        say(`Already showing the ${designLabel(current)}`);
        return;
      }
      say(`Opening the ${designLabel(next)}…`, true);
      switchWebsiteDesign(next);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [capture, enabled, onWebsite, say]);

  return { capture, captureState, notice };
}

/** One chord, in the macOS notation the dock already uses for ⌘⌥C. */
function Chord({ keys }: { keys: string }) {
  return (
    <kbd className="dm-panel__kbd">
      ⌘⌥{keys}
    </kbd>
  );
}

/** The demo rail's Capture tab. */
export function DemoCapturePanel({
  capture,
  captureState,
  onWebsite,
}: Pick<DemoShortcuts, "capture" | "captureState"> & { onWebsite: boolean }) {
  const busyScope = captureState.status === "busy" ? captureState.scope : null;
  const id = React.useId();
  return (
    <div className="dm-panel">
      <section className="dm-panel__group" aria-labelledby={`${id}-capture`}>
        <h3 id={`${id}-capture`} className="dm-panel__legend">
          Screenshot
        </h3>
        <div className="dm-panel__actions">
          <Button
            size="sm"
            variant="neutral"
            appearance="outlined"
            loading={busyScope === "viewport"}
            disabled={busyScope !== null}
            onClick={() => capture("viewport")}
          >
            Visible Area
          </Button>
          <Button
            size="sm"
            variant="neutral"
            appearance="outlined"
            loading={busyScope === "page"}
            disabled={busyScope !== null}
            onClick={() => capture("page")}
          >
            Full Page
          </Button>
        </div>
        <p className="dm-panel__explain" role="status">
          {captureState.status === "saved" ? (
            <>
              Saved as <span className="dm-panel__file">{captureState.fileName}</span>
            </>
          ) : captureState.status === "failed" ? (
            "The page could not be captured. Try again."
          ) : captureState.status === "busy" ? (
            "Capturing…"
          ) : (
            "Saves a PNG of the page as shown, without the demo tools."
          )}
        </p>
      </section>
      <section className="dm-panel__group" aria-labelledby={`${id}-keys`}>
        <h3 id={`${id}-keys`} className="dm-panel__legend">
          Shortcuts
        </h3>
        <dl className="dm-panel__keys">
          <dt>Visible Area</dt>
          <dd>
            <Chord keys="S" />
          </dd>
          <dt>Full Page</dt>
          <dd>
            <Chord keys="⇧S" />
          </dd>
          {onWebsite && (
            <>
              <dt>New, Classic, DBIM Design</dt>
              <dd>
                <Chord keys="1" /> <Chord keys="2" /> <Chord keys="3" />
              </dd>
              <dt>Previous Design</dt>
              <dd>
                <Chord keys="0" />
              </dd>
            </>
          )}
          <dt>Next Colour Mode</dt>
          <dd>
            <Chord keys="C" />
          </dd>
        </dl>
        <p className="dm-panel__hint">On Windows, Ctrl+Alt in place of ⌘⌥.</p>
      </section>
    </div>
  );
}
