"use client";

import * as React from "react";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { Button, Input, FormField, MediaUpload } from "@mosje/design-system";
import { DataTable } from "@/components/nmba/data-table";
import type { ColumnDef } from "@/components/nmba/data-table";
import type { AwarenessProgramme } from "@/lib/nmba/treatment-centre/types";
import { useToast } from "@/components/nmba/toast";

type Row = AwarenessProgramme & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno",           header: "S.No" },
  { key: "hotspot",       header: "Name of the hotspots Identified" },
  { key: "awarenessDate", header: "Awareness Date" },
  { key: "venueName",     header: "Name of the venue" },
  { key: "peopleAttended",header: "Number of people attended" },
  {
    key: "photoName",
    header: "Photos of awareness generation Program",
    render: (r) =>
      r.photoUrl ? (
        // data:/blob: URI (synthetic or uploaded photo) — not next/image-loadable.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={r.photoUrl} alt={r.photoName ?? "Awareness programme photo"} className="h-10 w-14 rounded object-cover" />
      ) : (
        <span className="text-ink-hint">—</span>
      ),
    exportValue: (r) => r.photoName ?? "",
  },
];

export default function OdicAwarenessPage() {
  const store = useTCStore();
  const { toast } = useToast();

  const [f, setF] = React.useState({
    hotspot: "",
    awarenessDate: "",
    venueName: "",
    peopleAttended: "",
  });
  const [photo, setPhoto] = React.useState<{ url: string; name: string } | null>(null);
  const [errors, setErrors] = React.useState<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = new Set<string>();
    if (!f.hotspot.trim()) missing.add("hotspot");
    if (!f.awarenessDate) missing.add("awarenessDate");
    if (!f.venueName.trim()) missing.add("venueName");
    if (!f.peopleAttended) missing.add("peopleAttended");
    if (!photo) missing.add("photo");
    if (missing.size > 0) { setErrors(missing); return; }

    store.addAwareness({
      hotspot: f.hotspot.trim(),
      awarenessDate: f.awarenessDate,
      venueName: f.venueName.trim(),
      peopleAttended: Number(f.peopleAttended) || 0,
      photoUrl: photo?.url,
      photoName: photo?.name,
    });

    setF({ hotspot: "", awarenessDate: "", venueName: "", peopleAttended: "" });
    setPhoto(null);
    setErrors(new Set());
    toast("Awareness activity recorded successfully.", "success");
  };

  const err = (k: string) => (errors.has(k) ? "This field is required." : undefined);

  const rows: Row[] = store.awareness.map((p, i) => ({ ...p, sno: i + 1 }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 rounded-xl bg-navy px-5 py-3.5 text-white">
        <h1 className="text-lg font-bold">Details of Awareness Generation Program</h1>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-navy">Details of Outreach Activity</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-ink">Awareness Generation Program</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormField label="Name of the hotspots Identified" required error={err("hotspot")}>
              {(c) => (
                <Input
                  {...c}
                  value={f.hotspot}
                  onChange={(e) => setF({ ...f, hotspot: e.target.value })}
                  placeholder="Name of the hotspots Identified"
                  invalid={errors.has("hotspot")}
                />
              )}
            </FormField>

            <FormField label="Awareness Date" required error={err("awarenessDate")}>
              {(c) => (
                <Input
                  {...c}
                  type="date"
                  value={f.awarenessDate}
                  onChange={(e) => setF({ ...f, awarenessDate: e.target.value })}
                  invalid={errors.has("awarenessDate")}
                />
              )}
            </FormField>

            <FormField label="Name of the venue" required error={err("venueName")}>
              {(c) => (
                <Input
                  {...c}
                  value={f.venueName}
                  onChange={(e) => setF({ ...f, venueName: e.target.value })}
                  placeholder="Name of the venue"
                  invalid={errors.has("venueName")}
                />
              )}
            </FormField>

            <FormField label="Number of people attended" required error={err("peopleAttended")}>
              {(c) => (
                <Input
                  {...c}
                  type="number"
                  min={0}
                  value={f.peopleAttended}
                  onChange={(e) => setF({ ...f, peopleAttended: e.target.value })}
                  placeholder="Number of people attended"
                  invalid={errors.has("peopleAttended")}
                />
              )}
            </FormField>
          </div>

          <FormField label="Photos of awareness generation Program" required error={err("photo")}>
            {() => (
              <MediaUpload
                value={photo?.url}
                fileName={photo?.name}
                maxSizeMb={2}
                onChange={(url, name) => setPhoto({ url, name })}
                onClear={() => setPhoto(null)}
              />
            )}
          </FormField>
          <div className="flex justify-end">
            <Button type="submit" variant="primary">Submit</Button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-navy">Details of Awareness Program List</h2>
        <DataTable columns={columns} data={rows} total={rows.length} />
      </div>
    </div>
  );
}
