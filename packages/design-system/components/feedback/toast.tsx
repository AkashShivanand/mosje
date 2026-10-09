"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { IconButton } from "../actions/icon-button";
import "./toast.css";

export type ToastVariant = "success" | "info" | "warning" | "error";

interface ToastEntry {
  id: string;
  message: React.ReactNode;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: React.ReactNode, variant?: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M8 12.5l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M12 4l9 15H3l9-15z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v6M12 16h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
};

const IcClose = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
);

/**
 * Variants that PERSIST until the reader dismisses them (WCAG 2.2.1 Timing
 * Adjustable). An error or a warning is something the reader has to act on; a
 * three-second timer removed "Upload failed — the file is over 5 MB" before a
 * screen-reader user had heard the end of it, or a sighted one had finished
 * reading it. Success and info are confirmations, and those may time out.
 */
const PERSISTENT: ReadonlySet<ToastVariant> = new Set<ToastVariant>(["error", "warning"]);

/**
 * One toast, owning its own timer so it can be PAUSED. The timer stops while
 * the pointer is over the toast or focus is inside it, and restarts with the
 * time that was left — a reader who moves onto a toast to read it, or tabs to
 * its dismiss button, never has it removed from under them.
 */
function ToastItem({
  entry,
  durationMs,
  onDismiss,
}: {
  entry: ToastEntry;
  durationMs: number;
  onDismiss: (id: string) => void;
}) {
  const persistent = PERSISTENT.has(entry.variant);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const remaining = React.useRef(durationMs);
  const startedAt = React.useRef(0);
  const hovered = React.useRef(false);
  const focused = React.useRef(false);

  const pause = React.useCallback(() => {
    if (timer.current === undefined) return;
    clearTimeout(timer.current);
    timer.current = undefined;
    remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt.current));
  }, []);

  const resume = React.useCallback(() => {
    if (persistent || timer.current !== undefined) return;
    if (hovered.current || focused.current) return;
    startedAt.current = Date.now();
    timer.current = setTimeout(() => onDismiss(entry.id), remaining.current);
  }, [persistent, onDismiss, entry.id]);

  React.useEffect(() => {
    resume();
    return () => {
      clearTimeout(timer.current);
      timer.current = undefined;
    };
  }, [resume]);

  return (
    <div
      className={cn("ds-toast", `ds-toast--${entry.variant}`)}
      role={entry.variant === "error" ? "alert" : "status"}
      onMouseEnter={() => {
        hovered.current = true;
        pause();
      }}
      onMouseLeave={() => {
        hovered.current = false;
        resume();
      }}
      onFocus={() => {
        focused.current = true;
        pause();
      }}
      onBlur={(e) => {
        // focus-within: moving between controls inside the toast is not leaving it.
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        focused.current = false;
        resume();
      }}
    >
      <span className="ds-toast__icon">{ICONS[entry.variant]}</span>
      <p className="ds-toast__msg">{entry.message}</p>
      {/* The library's IconButton — it was a native <button> re-deriving
          the transparent icon control the estate already ships. */}
      <IconButton
        className="ds-toast__close"
        variant="neutral"
        appearance="text"
        size="sm"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(entry.id)}
        icon={<IcClose />}
      />
    </div>
  );
}

/**
 * MoSJE / SAMAVESH ToastProvider — shared transient notifications.
 *
 * One toast system for every portal. `error` toasts use `role="alert"`
 * (assertive); others use `role="status"` (polite).
 *
 * `success` and `info` dismiss themselves after `durationMs` (3s); the timer
 * pauses while the toast is hovered or holds focus. `error` and `warning`
 * persist until the reader dismisses them (WCAG 2.2.1).
 */
export function ToastProvider({ children, durationMs = 3000 }: { children: React.ReactNode; durationMs?: number }) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const seq = React.useRef(0);

  const toast = React.useCallback((message: React.ReactNode, variant: ToastVariant = "success") => {
    const id = `t${(seq.current += 1)}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = React.useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="ds-toast__viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <ToastItem key={t.id} entry={t} durationMs={durationMs} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
