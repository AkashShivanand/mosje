"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
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
 * MoSJE / SAMAVESH ToastProvider — shared transient notifications.
 *
 * One toast system for every portal. `error` toasts use `role="alert"`
 * (assertive); others use `role="status"` (polite). Auto-dismiss after 3s.
 */
export function ToastProvider({ children, durationMs = 3000 }: { children: React.ReactNode; durationMs?: number }) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const seq = React.useRef(0);

  const toast = React.useCallback(
    (message: React.ReactNode, variant: ToastVariant = "success") => {
      const id = `t${(seq.current += 1)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), durationMs);
    },
    [durationMs],
  );

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="ds-toast__viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={cn("ds-toast", `ds-toast--${t.variant}`)} role={t.variant === "error" ? "alert" : "status"}>
            <span className="ds-toast__icon">{ICONS[t.variant]}</span>
            <p className="ds-toast__msg">{t.message}</p>
            <button type="button" className="ds-toast__close" aria-label="Dismiss notification" onClick={() => dismiss(t.id)}>
              <IcClose />
            </button>
          </div>
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
