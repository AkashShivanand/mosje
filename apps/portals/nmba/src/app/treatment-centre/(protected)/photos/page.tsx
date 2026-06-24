"use client";

import * as React from "react";
import { ImageIcon, Plus, Upload, X } from "lucide-react";
import { Button, Input, FormField, MediaUpload } from "@mosje/design-system";
import { useTCSession } from "@/lib/treatment-centre/session-context";
import { useToast } from "@/components/toast";

const INITIAL_PHOTOS = [
  { caption: "Centre entrance" },
  { caption: "Counselling room" },
  { caption: "Group therapy session" },
  { caption: "Awareness rally" },
  { caption: "Yoga & wellness" },
  { caption: "Recreation area" },
];

export default function CenterPhotosPage() {
  const session = useTCSession();
  const { toast } = useToast();
  
  const [photos, setPhotos] = React.useState(INITIAL_PHOTOS);
  const [showUpload, setShowUpload] = React.useState(false);
  const [caption, setCaption] = React.useState("");
  const [file, setFile] = React.useState("");
  const [filePreview, setFilePreview] = React.useState("");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      toast("Please enter a caption.", "error");
      return;
    }
    
    setPhotos((prev) => [...prev, { caption }]);
    setCaption("");
    setFile("");
    setFilePreview("");
    setShowUpload(false);
    toast("Photo uploaded successfully.", "success");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-navy px-5 py-3.5 text-white">
        <div>
          <h1 className="text-lg font-bold">Center Photos</h1>
          <p className="text-xs text-white/70">{session.centerName}</p>
        </div>
        <Button
          appearance="outlined"
          onClick={() => setShowUpload(!showUpload)}
          className="inline-flex items-center gap-2 bg-white text-navy hover:bg-slate-100 font-semibold text-sm"
        >
          {showUpload ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Upload Photo
            </>
          )}
        </Button>
      </div>

      {showUpload && (
        <form onSubmit={handleUpload} className="rounded-xl border border-line bg-white p-5 flex flex-col gap-4 max-w-md">
          <h2 className="text-sm font-semibold text-navy flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload New Photo
          </h2>
          
          <FormField label="Photo Caption" required>
            {(c) => (
              <Input
                {...c}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Recreation Room, Front Entrance"
              />
            )}
          </FormField>

          <FormField label="Choose Image File" required>
            {(c) => (
              <MediaUpload
                {...c}
                value={filePreview || undefined}
                fileName={file || undefined}
                onChange={(dataUrl, name) => {
                  setFilePreview(dataUrl);
                  setFile(name);
                }}
                onClear={() => {
                  setFilePreview("");
                  setFile("");
                }}
              />
            )}
          </FormField>

          <div className="flex justify-end gap-2 mt-2">
            <Button type="submit" variant="primary" disabled={!caption || !file}>
              Submit Photo
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, idx) => (
          <figure key={idx} className="overflow-hidden rounded-xl border border-line bg-white shadow-xs">
            <div className="flex aspect-[4/3] items-center justify-center bg-brandwash text-navy/40">
              <ImageIcon className="h-10 w-10" aria-hidden />
            </div>
            <figcaption className="px-3 py-2 text-sm text-ink-muted">{p.caption}</figcaption>
          </figure>
        ))}
      </div>
      <p className="text-xs text-ink-hint">Demo gallery — photos uploaded are saved in current session memory.</p>
    </div>
  );
}
