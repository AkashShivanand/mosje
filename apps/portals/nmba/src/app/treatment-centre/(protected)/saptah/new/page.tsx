"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, FormField, Alert, MediaUpload } from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { FormSection } from "@/components/treatment-centre/tc-form";
import type { SaptahEventType } from "@/lib/treatment-centre/types";

const EVENT_OPTIONS: { label: string; value: SaptahEventType }[] = [
  { label: "International Day Against Drug Abuse and Illicit Trafficking", value: "International Day Against Drug Abuse and Illicit Trafficking" },
  { label: "Nasha Mukt Bharat Saptah 2026",                               value: "Nasha Mukt Bharat Saptah 2026" },
];

const ACTIVITY_OPTIONS = [
  "Slogan Writing Competition",
  "Rangoli Making Competition",
  "Drawing competition",
  "Marathon/ Walkathon/Cyclothon",
  "Training and awareness generation activities with children, adolescents, youth and Nasha Mukti Mitr",
  "Sports and physical activities",
  "Seminars, Webinars or Workshops for awareness generation",
  "Nukkad Natak, Skits and Play",
  "Flash mobs, drives and Rallies",
  "NMBA pledge (including e-pledge) in educational institutions, hotspots and public places",
  "Community mapping of nearby areas and identifying hotspots for qualitative analysis",
  "Wall Paintings/Graffiti and art competitions",
  "Video-making or short film making",
  "Activities with/NSS/NCC/ NYK volunteers and spiritual organizations",
  "Yoga and Meditation Activities",
  "Documentaries/Film Screenings on substance use and discussions",
  "Awareness generation through NMBA vehicles",
  "Sensitizing the general public about the different schemes and programs of the Ministry with regards to existing deaddiction facilities in the state and districts along with awareness generation in high risk areas",
  "Distribution of IEC Material available on the NMBA website",
  "Organising Inter/Intra University Debate/ Essay/ Painting/ Drawing Competitions (online/offline,any)",
  "Formation of Clubs (for substance use prevention) in educational institutions, communities, in collaboration with service organizations (Rotaract, Lion, etc.)",
  "Identifying influential alumnis from the colleges to advertise the Abhiyaan",
  "Focus Group Discussions with various stakeholders in high risk areas (online and offline)",
  "Social Media Campaigns",
  "Identification and involvement of local brand ambassadors, social media influencers, etc",
  "Surveys and preparatory studies",
  "Celebration of international/national days of importance (for ex: celebrating World Aids Day and spreading awareness about AIDS and how Injecting drug users increase the chances of getting AIDS)",
  "Using regional channels, newspapers, radio's and other media outlets,available to discuss the Nasha Mukt Bharat Abhiyaan",
  "Formation of support groups and initiating counselling networks to address the issues related to substance use",
  "A sub-campaign to increase awareness about the ban of licit/ illicit substances near college areas with the help of police/competent authority",
  "Involvement and convergence with various government departments",
  "Networking with the self-help groups/local leaders/ nongovernmental organizations to reach out to high-risk groups in the neighborhood",
  "Activities in vulnerable areas including border and tribal regions",
  "Health Related Activities/Camps",
];

export default function NewSaptahEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useTCStore();

  const [f, setF] = React.useState({
    event: "" as SaptahEventType | "",
    activity: "",
    date: "",
    coordinatingDept: "",
    totalParticipants: "",
    maleParticipants: "",
    femaleParticipants: "",
    numEducationalInstitutions: "",
    isCompleted: "" as "Completed" | "Not Completed" | "",
    mediaFile: "",
  });

  const [coords, setCoords] = React.useState<{ lat: string; lng: string } | null>(null);
  const [gettingLocation, setGettingLocation] = React.useState(false);
  const [errors, setErrors] = React.useState<Set<string>>(new Set());
  const [mediaPreview, setMediaPreview] = React.useState("");

  // Saptah window: June 26 – July 2, 2026
  const isWithinSaptahWindow = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d >= new Date("2026-06-26") && d <= new Date("2026-07-02");
  };

  // Only block submission for Saptah events outside the window
  const isSaptahEvent = f.event === "Nasha Mukt Bharat Saptah 2026";
  const isTimeGated = isSaptahEvent && !!f.date && !isWithinSaptahWindow(f.date);

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
      toast("Cannot record Nasha Mukt Bharat Saptah activity outside June 26 – July 2, 2026.", "error");
      return;
    }

    const missing = new Set<string>();
    if (!f.event) missing.add("event");
    if (!f.activity) missing.add("activity");
    if (!f.date) missing.add("date");
    if (!f.coordinatingDept.trim()) missing.add("coordinatingDept");
    if (!f.totalParticipants) missing.add("totalParticipants");
    if (!f.maleParticipants) missing.add("maleParticipants");
    if (!f.femaleParticipants) missing.add("femaleParticipants");
    if (!f.numEducationalInstitutions) missing.add("numEducationalInstitutions");
    if (!f.isCompleted) missing.add("isCompleted");

    if (missing.size > 0) {
      setErrors(missing);
      toast("Please complete all required fields.", "error");
      return;
    }

    store.addSaptahEvent({
      event: f.event as SaptahEventType,
      activity: f.activity,
      date: f.date,
      coordinatingDept: f.coordinatingDept.trim(),
      totalParticipants: Number(f.totalParticipants) || 0,
      maleParticipants: Number(f.maleParticipants) || 0,
      femaleParticipants: Number(f.femaleParticipants) || 0,
      numEducationalInstitutions: Number(f.numEducationalInstitutions) || 0,
      isCompleted: f.isCompleted as "Completed" | "Not Completed",
      mediaUrl: f.mediaFile ? `/uploads/${f.mediaFile}` : undefined,
      latitude: coords?.lat,
      longitude: coords?.lng,
    });

    toast("Activity registered successfully.", "success");
    router.push("/treatment-centre/saptah");
  };

  const err = (key: string): string | undefined =>
    errors.has(key) ? "This field is required." : undefined;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">
      <div>
        <h1 className="text-xl font-bold text-ink">Add New Activity</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Record activity details for Nasha Mukt Bharat Saptah 2026 or related campaigns.
        </p>
      </div>

      {isTimeGated && (
        <Alert status="error">
          <strong>Date outside window:</strong> Nasha Mukt Bharat Saptah entries are restricted to June 26 – July 2, 2026.
        </Alert>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <FormSection title="Details of Activity" columns={2}>
          <div className="col-span-2">
            <FormField label="Event" required error={err("event")}>
              {(c) => (
                <Select
                  {...c}
                  value={f.event}
                  onChange={(e) => setF({ ...f, event: e.target.value as SaptahEventType | "" })}
                  options={[
                    { label: "Select Event", value: "" },
                    ...EVENT_OPTIONS,
                  ]}
                  invalid={errors.has("event")}
                />
              )}
            </FormField>
          </div>

          <div className="col-span-2">
            <FormField label="Activity" required error={err("activity")}>
              {(c) => (
                <Select
                  {...c}
                  value={f.activity}
                  onChange={(e) => setF({ ...f, activity: e.target.value })}
                  options={[
                    { label: "Select Activity", value: "" },
                    ...ACTIVITY_OPTIONS.map((a) => ({ label: a, value: a })),
                  ]}
                  invalid={errors.has("activity")}
                />
              )}
            </FormField>
          </div>

          <FormField label="Date of Activity" required error={err("date")}>
            {(c) => (
              <Input
                {...c}
                type="date"
                value={f.date}
                onChange={(e) => setF({ ...f, date: e.target.value })}
                invalid={errors.has("date")}
              />
            )}
          </FormField>

          <FormField label="Coordinating Department's Name" required error={err("coordinatingDept")}>
            {(c) => (
              <Input
                {...c}
                value={f.coordinatingDept}
                onChange={(e) => setF({ ...f, coordinatingDept: e.target.value })}
                placeholder="Please fill Coordinating Department's Name"
                invalid={errors.has("coordinatingDept")}
              />
            )}
          </FormField>

          <FormField label="Total No. of People Participating" required error={err("totalParticipants")}>
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.totalParticipants}
                onChange={(e) => setF({ ...f, totalParticipants: e.target.value })}
                placeholder="Please fill Total No. of People Participating"
                invalid={errors.has("totalParticipants")}
              />
            )}
          </FormField>

          <FormField label="No. of Males/Boys" required error={err("maleParticipants")}>
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.maleParticipants}
                onChange={(e) => setF({ ...f, maleParticipants: e.target.value })}
                placeholder="Please fill No. of Males/Boys"
                invalid={errors.has("maleParticipants")}
              />
            )}
          </FormField>

          <FormField label="No. of Females/Girls" required error={err("femaleParticipants")}>
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.femaleParticipants}
                onChange={(e) => setF({ ...f, femaleParticipants: e.target.value })}
                placeholder="Please fill No. of Females/Girls"
                invalid={errors.has("femaleParticipants")}
              />
            )}
          </FormField>

          <FormField label="No. of Educational Institutions" required error={err("numEducationalInstitutions")}>
            {(c) => (
              <Input
                {...c}
                type="number"
                min={0}
                value={f.numEducationalInstitutions}
                onChange={(e) => setF({ ...f, numEducationalInstitutions: e.target.value })}
                placeholder="Please fill No. of Educational Institutions"
                invalid={errors.has("numEducationalInstitutions")}
              />
            )}
          </FormField>

          <FormField label="Upload Images/Videos">
            {(c) => (
              <MediaUpload
                {...c}
                value={mediaPreview || undefined}
                fileName={f.mediaFile || undefined}
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

          <FormField label="Is Completed" required error={err("isCompleted")}>
            {(c) => (
              <Select
                {...c}
                value={f.isCompleted}
                onChange={(e) => setF({ ...f, isCompleted: e.target.value as "Completed" | "Not Completed" | "" })}
                options={[
                  { label: "Select Status", value: "" },
                  { label: "Completed",     value: "Completed" },
                  { label: "Not Completed", value: "Not Completed" },
                ]}
                invalid={errors.has("isCompleted")}
              />
            )}
          </FormField>
        </FormSection>

        <FormSection title="Current Location" columns={1}>
          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-surface-muted p-4">
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
              disabled={gettingLocation}
              className="text-sm"
            >
              {gettingLocation ? "Capturing..." : "Current Location"}
            </Button>
          </div>
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
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
