"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Textarea,
  Select,
  FormField,
  Checkbox,
  Alert,
  MediaUpload,
} from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { FormSection } from "@/components/treatment-centre/tc-form";

const COMPLETION_STATUS = [
  { label: "Completed", value: "Completed" },
  { label: "In Progress", value: "In Progress" },
  { label: "Scheduled", value: "Scheduled" },
];

export default function NewSaptahEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useTCStore();

  const [f, setF] = React.useState({
    eventName: "",
    date: "2026-06-26",
    location: "",
    coordinatingDept: "",
    maleParticipants: "0",
    femaleParticipants: "0",
    educationalInstitutions: "",
    completionStatus: "Completed",
    mediaFile: "",
  });

  const [coords, setCoords] = React.useState<{ lat: string; lng: string } | null>(null);
  const [gettingLocation, setGettingLocation] = React.useState(false);
  const [timeGateActive, setTimeGateActive] = React.useState(true);
  const [errors, setErrors] = React.useState<Set<string>>(new Set());
  const [mediaPreview, setMediaPreview] = React.useState("");

  // Date parsing to check if it lies between June 26 and July 2, 2026
  const isWithinSaptahWindow = (dateStr: string) => {
    const d = new Date(dateStr);
    const start = new Date("2026-06-26");
    const end = new Date("2026-07-02");
    return d >= start && d <= end;
  };

  const isTimeGated = timeGateActive && !isWithinSaptahWindow(f.date);

  const getDeviceLocation = () => {
    setGettingLocation(true);
    setTimeout(() => {
      setCoords({ lat: "28.6139", lng: "77.2090" });
      setGettingLocation(false);
      toast("Mock geotag coordinates retrieved successfully.", "success");
    }, 1000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTimeGated) {
      toast("Cannot record activity outside the Nasha Mukt Bharat Saptah time window.", "error");
      return;
    }

    const missing = new Set<string>();
    if (!f.eventName) missing.add("eventName");
    if (!f.date) missing.add("date");
    if (!f.location) missing.add("location");
    if (!f.coordinatingDept) missing.add("coordinatingDept");
    if (!coords) missing.add("geotag");

    if (missing.size > 0) {
      setErrors(missing);
      toast("Please complete all required fields and capture geotag.", "error");
      return;
    }

    const maleNum = Number(f.maleParticipants) || 0;
    const femaleNum = Number(f.femaleParticipants) || 0;
    const total = maleNum + femaleNum;

    if (!coords) return;

    store.addSaptahEvent({
      eventName: f.eventName,
      date: f.date,
      location: f.location,
      participants: total,
      coordinatingDept: f.coordinatingDept,
      maleParticipants: maleNum,
      femaleParticipants: femaleNum,
      educationalInstitutions: f.educationalInstitutions,
      completionStatus: f.completionStatus,
      mediaUrl: f.mediaFile ? `/uploads/${f.mediaFile}` : undefined,
      latitude: coords.lat,
      longitude: coords.lng,
    });

    toast("Saptah activity registered successfully.", "success");
    router.push("/treatment-centre/saptah");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink">New Saptah Activity Form</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Record Nasha Mukt Bharat Saptah awareness event details.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-surface-muted border border-line px-3 py-2 text-sm">
          <Checkbox
            id="time-gate-toggle"
            checked={timeGateActive}
            onChange={(e) => setTimeGateActive(e.target.checked)}
            label="Enforce Nasha Mukt Saptah Window (June 26 - July 2)"
          />
        </div>
      </div>

      {isTimeGated && (
        <Alert status="error">
          <strong>Registration Disabled:</strong> Nasha Mukt Bharat Saptah event entries are restricted to the week of June 26th to July 2nd, 2026. Toggle the sandbox time-gate config in the top-right corner to bypass this rule for testing.
        </Alert>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <FormSection title="Event Details" columns={2}>
          <div className="col-span-2">
            <FormField label="Event Name" required error={errors.has("eventName") ? "Required" : undefined}>
              {(c) => (
                <Input
                  {...c}
                  value={f.eventName}
                  onChange={(e) => setF({ ...f, eventName: e.target.value })}
                  placeholder="e.g. Street Play on Anti-Drug Abuse Awareness"
                  invalid={errors.has("eventName")}
                  disabled={isTimeGated}
                />
              )}
            </FormField>
          </div>

          <FormField label="Event Date" required error={errors.has("date") ? "Required" : undefined}>
            {(c) => (
              <Input
                {...c}
                type="date"
                value={f.date}
                onChange={(e) => setF({ ...f, date: e.target.value })}
                invalid={errors.has("date")}
                disabled={isTimeGated}
              />
            )}
          </FormField>

          <FormField label="Coordinating Department" required error={errors.has("coordinatingDept") ? "Required" : undefined}>
            {(c) => (
              <Input
                {...c}
                value={f.coordinatingDept}
                onChange={(e) => setF({ ...f, coordinatingDept: e.target.value })}
                placeholder="e.g. Social Welfare Department"
                invalid={errors.has("coordinatingDept")}
                disabled={isTimeGated}
              />
            )}
          </FormField>

          <div className="col-span-2">
            <FormField label="Venue Location" required error={errors.has("location") ? "Required" : undefined}>
              {(c) => (
                <Textarea
                  {...c}
                  rows={2}
                  value={f.location}
                  onChange={(e) => setF({ ...f, location: e.target.value })}
                  placeholder="Address or venue name"
                  invalid={errors.has("location")}
                  disabled={isTimeGated}
                />
              )}
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Geotagging & Location Capture" columns={1}>
          <div className="flex flex-wrap items-center gap-4 border border-line rounded-lg p-4 bg-surface-muted">
            <div className="flex-1 min-w-[200px]">
              <span className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">Coordinates</span>
              <span className="text-sm font-mono text-navy">
                {coords ? `Latitude: ${coords.lat}°, Longitude: ${coords.lng}°` : "Not Captured"}
              </span>
            </div>
            <Button
              type="button"
              appearance="outlined"
              onClick={getDeviceLocation}
              disabled={gettingLocation || isTimeGated}
              className="text-sm"
            >
              {gettingLocation ? "Capturing..." : "Get Device Location"}
            </Button>
          </div>
          {errors.has("geotag") && (
            <p className="text-xs text-red-600 font-semibold mt-1">Please capture the device location coordinates before saving.</p>
          )}
        </FormSection>

        <FormSection title="Participants & Target Group" columns={3}>
          <FormField label="Male Participants">
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.maleParticipants}
                onChange={(e) => setF({ ...f, maleParticipants: e.target.value })}
                disabled={isTimeGated}
              />
            )}
          </FormField>

          <FormField label="Female Participants">
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.femaleParticipants}
                onChange={(e) => setF({ ...f, femaleParticipants: e.target.value })}
                disabled={isTimeGated}
              />
            )}
          </FormField>

          <div className="text-sm flex flex-col justify-end pb-3">
            <span className="block font-semibold text-ink-muted">Total Participants</span>
            <span className="text-navy font-bold text-lg">
              {(Number(f.maleParticipants) || 0) + (Number(f.femaleParticipants) || 0)}
            </span>
          </div>

          <div className="col-span-3">
            <FormField label="Educational Institutions Involved">
              {(c) => (
                <Textarea
                  {...c}
                  rows={2}
                  value={f.educationalInstitutions}
                  onChange={(e) => setF({ ...f, educationalInstitutions: e.target.value })}
                  placeholder="Names of schools/colleges participating, comma-separated"
                  disabled={isTimeGated}
                />
              )}
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Status & Media" columns={2}>
          <FormField label="Completion Status">
            {(c) => (
              <Select
                {...c}
                value={f.completionStatus}
                onChange={(e) => setF({ ...f, completionStatus: e.target.value })}
                options={COMPLETION_STATUS}
                disabled={isTimeGated}
              />
            )}
          </FormField>

          <FormField label="Media Upload (Image)">
            {(c) => (
              <MediaUpload
                {...c}
                value={mediaPreview || undefined}
                fileName={f.mediaFile || undefined}
                disabled={isTimeGated}
                onChange={(dataUrl, name) => {
                  setMediaPreview(dataUrl);
                  setF((prev) => ({ ...prev, mediaFile: name }));
                }}
                onClear={() => {
                  setMediaPreview("");
                  setF((prev) => ({ ...prev, mediaFile: "" }));
                }}
              />
            )}
          </FormField>
        </FormSection>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            appearance="outlined"
            onClick={() => router.push("/treatment-centre/saptah")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isTimeGated}>
            Register Activity
          </Button>
        </div>
      </form>
    </div>
  );
}
