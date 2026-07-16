"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useToast } from "@/components/nmba/toast";
import { STATES, STATE_DISTRICTS } from "@/lib/nmba/states";
import { ACTIVITY_TYPES } from "@/lib/nmba/mock-data";
import { Button, Input, Select, FormField } from "@mosje/design-system";

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

  // Reset the form when the modal closes — render-time sync on `open`.
  const [wasOpen, setWasOpen] = React.useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) { setState(""); setDistrict(""); }
  }

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
          <FormField label="State" id="ev-state" required>
            {(control) => (
              <Select
                {...control}
                required
                value={state}
                onChange={(e) => { setState(e.target.value); setDistrict(""); }}
              >
                <option value="">Select State</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            )}
          </FormField>

          <FormField label="District" id="ev-district" required>
            {(control) => (
              <Select
                {...control}
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={!state}
              >
                <option value="">Select District</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            )}
          </FormField>

          <FormField label="Activity Type" id="ev-type" required>
            {(control) => (
              <Select {...control} required>
                <option value="">Select Activity</option>
                {ACTIVITY_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
              </Select>
            )}
          </FormField>

          <FormField label="Activity Date" id="ev-date" required>
            {(control) => <Input {...control} type="date" required />}
          </FormField>

          <FormField label="Male Participants" id="ev-male" required>
            {(control) => <Input {...control} type="number" min={0} required placeholder="0" />}
          </FormField>

          <FormField label="Female Participants" id="ev-female" required>
            {(control) => <Input {...control} type="number" min={0} required placeholder="0" />}
          </FormField>

          <FormField label="Coordinating Department" id="ev-dept" required>
            {(control) => <Input {...control} type="text" required placeholder="Department name" />}
          </FormField>

          <FormField label="No. of Educational Institutions" id="ev-edu">
            {(control) => <Input {...control} type="number" min={0} placeholder="0" />}
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Location" id="ev-loc" required>
              {(control) => <Input {...control} type="text" required placeholder="City / Location" />}
            </FormField>
          </div>

          <div className="flex justify-end gap-3 sm:col-span-2">
            <Button type="button" appearance="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Add Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
