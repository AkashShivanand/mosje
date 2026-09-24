"use client";

/* Adarsh Gram — District: Manage MoM.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/manage-mom.

   DS Audit: WorklistScreen ✅ (owns all seven states, the pager and the phone "cards" —
   the live screen's own word for a meeting row) · Modal ✅ · MediaUpload ✅ · DocumentTile ✅
   · DocumentTiles ✅ · FormField ✅ · Badge ✅ · Alert ✅ · Button ✅ · IconButton ✅ ·
   Icon ✅. Nothing added.

   The live capture shows one meeting's upload panel (Meeting PDF, required; Meeting
   Images, optional) with no visible list — but the district holds three standing
   committees (DLCC, Gram Sabha, Block Convergence per the MOMS register), each with its
   own meeting, chair and minutes. WorklistScreen's register-plus-per-row-action shape
   reproduces what the screen DOES — browse the district's meetings, see which is
   awaiting minutes, upload for the one that is — better than one upload panel with no
   way to say which meeting it belongs to. Recorded as a deliberate translation, not a
   guess: `.claude/rules/data-state-completeness.md` requires a meeting awaiting minutes
   to read differently from one whose minutes are uploaded, which a single anonymous
   panel cannot do at all. */

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  DocumentTile,
  DocumentTiles,
  FormField,
  IconButton,
  Icon,
  MediaUpload,
  Modal,
  WorklistScreen,
  screenCopy,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_SCOPE, MOMS, PROVENANCE_LINE, type MomRecord } from "@/lib/pm-ajay/district/registers";

const MAX_IMAGES = 10;

interface ImageDraft {
  dataUrl: string;
  name: string;
}

const COLUMNS: WorklistColumn<MomRecord>[] = [
  { key: "committee", header: "Committee", priority: 1 },
  {
    key: "status",
    header: "Status",
    priority: 1,
    render: (row) => (
      <Badge status={row.status === "Uploaded" ? "success" : "warning"}>{row.status}</Badge>
    ),
  },
  { key: "heldOn", header: "Held On", priority: 2 },
  { key: "chairedBy", header: "Chaired By", priority: 2 },
  {
    key: "agendaItems",
    align: "end",
    header: "Agenda Items",
    priority: 3,
    render: (row) => `${row.agendaItems} items`,
  },
];

export default function ManageMomPage() {
  const [moms, setMoms] = React.useState<MomRecord[]>(MOMS);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [pdfDraft, setPdfDraft] = React.useState<ImageDraft | null>(null);
  const [images, setImages] = React.useState<ImageDraft[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const openRow = moms.find((m) => m.id === openId) ?? null;

  const openModal = (row: MomRecord) => {
    setOpenId(row.id);
    setPdfDraft(null);
    setImages([]);
    setError(null);
  };

  const closeModal = () => {
    setOpenId(null);
    setPdfDraft(null);
    setImages([]);
    setError(null);
  };

  const hasPdf = Boolean(pdfDraft || openRow?.minutesFile);

  const onSubmit = () => {
    if (!openRow) return;
    if (!hasPdf) {
      setError("Add the meeting PDF before submitting.");
      return;
    }
    const fileName = pdfDraft?.name ?? openRow.minutesFile ?? "minutes.pdf";
    setMoms((prev) =>
      prev.map((m) => (m.id === openRow.id ? { ...m, status: "Uploaded", minutesFile: fileName } : m)),
    );
    closeModal();
  };

  return (
    <>
      <WorklistScreen
        eyebrow="Adarsh Gram — District"
        title="Manage MoM"
        meta={`Minutes of the DLCC, Gram Sabha and block convergence meetings held for ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}. ${PROVENANCE_LINE}`}
        columns={COLUMNS}
        rows={moms}
        registerTotal={moms.length}
        getRowId={(row) => row.id}
        noun="meeting"
        pluralNoun="meetings"
        rowActions={(row) => (
          <Button
            size="sm"
            appearance={row.status === "Uploaded" ? "outlined" : "filled"}
            iconLeft={<Icon name={row.status === "Uploaded" ? "sync" : "upload"} size={18} />}
            onClick={() => openModal(row)}
          >
            {row.status === "Uploaded" ? "Replace Minutes" : "Upload Minutes"}
          </Button>
        )}
        copy={screenCopy({
          emptyTitle: "No meeting is on the district's MoM register yet",
          emptyDescription: "DLCC, Gram Sabha and block convergence meetings will appear here once scheduled.",
        })}
      />

      {openRow ? (
        <Modal
          open={Boolean(openRow)}
          onClose={closeModal}
          dirty={Boolean(pdfDraft || images.length > 0)}
          title={`Upload Minutes — ${openRow.committee}, ${openRow.heldOn}`}
          size="md"
          footer={
            <>
              <Button appearance="text" onClick={closeModal}>
                Cancel
              </Button>
              <Button onClick={onSubmit}>Submit</Button>
            </>
          }
        >
          {error ? (
            <Alert status="error" title="Minutes required">
              {error}
            </Alert>
          ) : null}

          <FormField
            label="Meeting PDF"
            id="mom-pdf"
            required
            hint="PDF only, up to 10 MB."
          >
            {(control) => (
              <MediaUpload
                {...control}
                accept="application/pdf"
                maxSizeMb={10}
                value={pdfDraft?.dataUrl ?? (openRow.minutesFile ?? undefined)}
                fileName={pdfDraft?.name ?? openRow.minutesFile ?? undefined}
                onChange={(dataUrl, name) => {
                  setPdfDraft({ dataUrl, name });
                  setError(null);
                }}
                onClear={() => setPdfDraft(null)}
                promptLabel="Click or drag the meeting PDF to upload"
              />
            )}
          </FormField>

          <FormField
            label={`Meeting Images (${images.length}/${MAX_IMAGES})`}
            id="mom-images"
            hint={
              images.length >= MAX_IMAGES
                ? "The image limit for this meeting has been reached."
                : "Optional. JPG or PNG, up to 5 MB each."
            }
          >
            {(control) => (
              <MediaUpload
                {...control}
                accept="image/*"
                maxSizeMb={5}
                disabled={images.length >= MAX_IMAGES}
                onChange={(dataUrl, name) => setImages((prev) => [...prev, { dataUrl, name }])}
                onClear={() => {}}
                promptLabel="Click or drag an image to add"
              />
            )}
          </FormField>

          {images.length > 0 ? (
            <DocumentTiles>
              {images.map((image, index) => (
                <DocumentTile
                  key={`${image.name}-${index}`}
                  title={image.name}
                  state="uploaded"
                  meta="Image attached"
                  actions={
                    <IconButton
                      icon={<Icon name="close" size={18} />}
                      aria-label={`Remove ${image.name}`}
                      variant="danger"
                      appearance="text"
                      size="sm"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                    />
                  }
                />
              ))}
            </DocumentTiles>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
}
