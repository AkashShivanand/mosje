"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useToast } from "@/components/toast";
import { STATES, STATE_DISTRICTS } from "@/lib/states";
import { ACTIVITY_TYPES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface AddEventModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddEventModal({ open, onClose }: AddEventModalProps) {
  const { toast } = useToast();
  const [state, setState] = React.useState("");
  const [district, setDistrict] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const districts = state ? (STATE_DISTRICTS[state] ?? []) : [];

  React.useEffect(() => {
    if (!open) { setState(""); setDistrict(""); }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast("Event added successfully.", "success");
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-pop">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-bold text-ink">Add Event</h2>
          <button onClick={onClose} aria-label="Close modal" className="rounded-lg p-1.5 text-ink-hint hover:bg-black/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <ModalField label="State" required>
            <select
              required
              value={state}
              onChange={(e) => { setState(e.target.value); setDistrict(""); }}
              className={selectCls}
            >
              <option value="">Select State</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </ModalField>
          <ModalField label="District" required>
            <select
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
              className={cn(selectCls, !state && "opacity-50")}
            >
              <option value="">Select District</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </ModalField>
          <ModalField label="Activity Type" required>
            <select required className={selectCls}>
              <option value="">Select Activity</option>
              {ACTIVITY_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </ModalField>
          <ModalField label="Activity Date" required>
            <input type="date" required className={inputCls} />
          </ModalField>
          <ModalField label="Male Participants" required>
            <input type="number" min={0} required placeholder="0" className={inputCls} />
          </ModalField>
          <ModalField label="Female Participants" required>
            <input type="number" min={0} required placeholder="0" className={inputCls} />
          </ModalField>
          <ModalField label="Coordinating Department" required>
            <input type="text" required placeholder="Department name" className={inputCls} />
          </ModalField>
          <ModalField label="No. of Educational Institutions">
            <input type="number" min={0} placeholder="0" className={inputCls} />
          </ModalField>
          <ModalField label="Location" className="sm:col-span-2">
            <input type="text" required placeholder="City / Location" className={inputCls} />
          </ModalField>

          <div className="flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink-muted hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ModalField({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-red-500" aria-hidden>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15";
const selectCls =
  "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15";
