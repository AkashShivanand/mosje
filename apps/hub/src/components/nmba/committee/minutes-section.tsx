"use client";

// Minutes of Meeting — the record of meeting-minutes PDFs for a committee.
// Layout: the list of uploaded minutes comes first (what's on record); adding a
// new one is a deliberate, revealed action so the section stays calm when the
// officer is only reviewing.

import * as React from "react";
import { Plus, CalendarDays, FileText, X } from "lucide-react";
import { Button, Input, FormField } from "@mosje/design-system";
import { PdfUploadField } from "./pdf-upload-field";
import { tierLabel } from "@/lib/nmba/committee/session";
import type { CommitteeRecord, UploadedFile } from "@/lib/nmba/committee/types";
import type { NewMinuteInput } from "@/lib/nmba/committee/store";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

interface MinutesSectionProps {
  record: CommitteeRecord;
  onAdd: (input: NewMinuteInput) => void;
  /** When false, the record is view-only: show the minutes list, hide the form. */
  canManage?: boolean;
}

export function MinutesSection({ record, onAdd, canManage = true }: MinutesSectionProps) {
  const committeeName = tierLabel(record.tier);
  const count = record.minutes.length;
  const [adding, setAdding] = React.useState(false);
  const [meetingDate, setMeetingDate] = React.useState("");
  const [file, setFile] = React.useState<UploadedFile | null>(null);
  const [errors, setErrors] = React.useState<{ date?: string; file?: string }>({});

  const resetForm = () => {
    setMeetingDate("");
    setFile(null);
    setErrors({});
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const next: { date?: string; file?: string } = {};
    if (!meetingDate) next.date = "Select the meeting date.";
    if (!file) next.file = "Upload the minutes (PDF).";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onAdd({ committeeId: record.id, committeeName, meetingDate, file: file! });
    resetForm();
    setAdding(false);
  };

  return (
    <section className="mt-6 rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
            Minutes of Meeting
            {count > 0 && (
              <span className="rounded-full bg-brandwash px-2 py-0.5 text-xs font-semibold text-navy">
                {count}
              </span>
            )}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            {canManage
              ? "Meeting minutes uploaded for this committee."
              : "Minutes uploaded for this committee (read-only)."}
          </p>
        </div>
        {canManage && !adding && (
          <Button appearance="outlined" iconLeft={<Plus className="h-4 w-4" />} onClick={() => setAdding(true)}>
            Add meeting minutes
          </Button>
        )}
      </div>

      {/* List of uploaded minutes */}
      {count > 0 ? (
        <ul className="mt-4 space-y-2">
          {record.minutes.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-line px-3.5 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brandwash text-navy">
                <CalendarDays className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">
                  Meeting on {formatDate(m.meetingDate)}
                </span>
                <span className="flex items-center gap-1 text-xs text-ink-hint">
                  <FileText className="h-3.5 w-3.5" />
                  <span className="truncate">{m.file.name}</span>
                </span>
              </span>
              <span className="ml-auto shrink-0">
                {m.file.blobUrl ? (
                  <a
                    href={m.file.blobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md px-2.5 py-1 text-sm font-semibold text-navy hover:bg-brandwash"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-xs text-ink-hint">On file</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-line bg-surface-muted px-4 py-6 text-center">
          <p className="text-sm text-ink-muted">No meeting minutes uploaded yet.</p>
          {canManage && !adding && (
            <p className="mt-0.5 text-xs text-ink-hint">
              Use “Add meeting minutes” to upload the minutes of a meeting.
            </p>
          )}
        </div>
      )}

      {/* Add-minutes form (revealed) */}
      {canManage && adding && (
        <form
          onSubmit={handleAdd}
          className="mt-4 rounded-xl border border-line bg-surface-muted p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-ink">Add minutes for a meeting</h4>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setAdding(false);
              }}
              aria-label="Close"
              className="flex h-7 w-7 items-center justify-center rounded-full text-ink-muted hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Date of the Committee Meeting" id="minute-date" required error={errors.date}>
              {(control) => (
                <Input
                  {...control}
                  type="date"
                  value={meetingDate}
                  onChange={(e) => {
                    setMeetingDate(e.target.value);
                    setErrors((x) => ({ ...x, date: undefined }));
                  }}
                />
              )}
            </FormField>
            <div className="sm:col-span-2">
              <label htmlFor="minute-file" className="mb-2 block text-sm font-medium text-ink">
                Minutes of the Meeting <span className="text-danger">*</span>
              </label>
              <PdfUploadField
                id="minute-file"
                value={file}
                hint="Upload the meeting minutes (max 10 MB)."
                onChange={(f) => {
                  setFile(f);
                  setErrors((x) => ({ ...x, file: undefined }));
                }}
              />
              {errors.file && (
                <p role="alert" className="mt-1.5 text-xs text-danger">
                  {errors.file}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <Button
              type="button"
              appearance="text"
              onClick={() => {
                resetForm();
                setAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" iconLeft={<Plus className="h-4 w-4" />}>
              Add minutes
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
