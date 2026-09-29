"use client";

/**
 * Error Messages — the lookup that turns a PFMS error code into the sentence the Maker reads
 * (PFMS BRD FR-STS-006).
 *
 * DS Audit: WorklistScreen ✅ existing · Search ✅ · FilterSelect ✅ · Badge ✅ · Modal ✅ · FormField ✅ ·
 * Textarea ✅ · DescriptionList ✅ · Button ✅ · Icon ✅ · screenCopy ✅ · useToast ✅ — composed, nothing new.
 *
 * FR-STS-006 forbids showing a raw PFMS code to the officer who has to act on it; this is the one
 * screen where codes are the subject, so they are shown. The Bureau may reword a message; the code,
 * the step and the field it points to are fixed, because they are what lets the Maker's error
 * summary jump to the right input. A code the BRD does not name is shape only, and is marked so
 * until it is checked against the PFMS Claim WebAPI specification.
 */

import * as React from "react";
import {
  Badge,
  Button,
  DescriptionList,
  FilterSelect,
  FormField,
  Icon,
  Modal,
  Search,
  Textarea,
  WorklistScreen,
  screenCopy,
  useToast,
  type WorklistColumn,
} from "@mosje/design-system";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { PFMS_ERRORS, type PfmsErrorEntry } from "@/lib/e-anudaan/pfms/errors";
import { STEP_LABEL } from "@/lib/e-anudaan/pfms/advice";

const MESSAGE_MAX = 300;

export default function ErrorMessagesPage() {
  const { pfms, hydrated } = usePfms();
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [editing, setEditing] = React.useState<PfmsErrorEntry | null>(null);
  const overrides = pfms.errorOverrides;

  const categories = [...new Set(PFMS_ERRORS.map((e) => e.category))].sort();
  const needle = q.trim().toLowerCase();
  const rows = PFMS_ERRORS.filter(
    (e) => (!category || e.category === category) && (!needle || `${e.code} ${e.message} ${overrides[e.code] ?? ""}`.toLowerCase().includes(needle)),
  );

  const columns: WorklistColumn<PfmsErrorEntry>[] = [
    {
      key: "code",
      header: "Code",
      priority: 1,
      sortable: true,
      sortValue: (e) => e.code,
      exportValue: (e) => e.code,
      render: (e) => (
        <span className="block">
          <span className="block font-mono font-semibold text-ink">{e.code}</span>
          {e.provenance === "illustrative" && (
            <Badge status="neutral" size="sm" className="mt-1 h-auto whitespace-normal font-normal">
              Illustrative Code — Confirm Against the PFMS Specification
            </Badge>
          )}
        </span>
      ),
    },
    { key: "category", header: "Category", priority: 2, sortable: true, sortValue: (e) => e.category, render: (e) => e.category },
    {
      key: "step",
      header: "Points To",
      priority: 3,
      exportValue: (e) => STEP_LABEL[e.step],
      render: (e) => <span className="whitespace-nowrap">{STEP_LABEL[e.step]}</span>,
    },
    {
      key: "message",
      header: "Message Shown to the Maker",
      priority: 2,
      exportValue: (e) => overrides[e.code] ?? e.message,
      render: (e) => (
        <span className="block min-w-[16rem] max-w-prose">
          <span className="block text-ink">{overrides[e.code] ?? e.message}</span>
          {overrides[e.code] && (
            <Badge status="info" size="sm" className="mt-1">
              Reworded by the Bureau
            </Badge>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <WorklistScreen<PfmsErrorEntry>
        title="Error Messages"
        meta="The plain-language message shown for each error PFMS can return, and the step of the payment advice it points to."
        loading={!hydrated}
        columns={columns}
        rowActions={(e) => (
          <Button size="sm" appearance="outlined" nowrap iconLeft={<Icon name="edit" size={16} aria-hidden />} onClick={() => setEditing(e)} aria-label={`Edit the message for ${e.code}`}>
            Edit
          </Button>
        )}
        rows={rows}
        registerTotal={PFMS_ERRORS.length}
        getRowId={(e) => e.code}
        noun="message"
        activeFilterCount={(needle ? 1 : 0) + (category ? 1 : 0)}
        onClearFilters={() => {
          setQ("");
          setCategory("");
        }}
        filters={
          <>
            <Search value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Code or message" aria-label="Search by code or message" />
            <FilterSelect label="Category" value={category} onChange={setCategory} options={[{ value: "", label: "All Categories" }, ...categories.map((c) => ({ value: c, label: c }))]} />
          </>
        }
        copy={screenCopy({
          loadingLabel: "Loading the error message library",
          emptyTitle: "No Error Messages",
          emptyDescription: "The error message library is empty.",
          filteredTitle: "No Message Matches",
          filteredDescription: "Check the code or the words searched for, or clear the filters to see every message.",
          clearFiltersLabel: "Clear Filters",
        })}
      />
      {editing && <EditMessageDialog key={editing.code} entry={editing} current={overrides[editing.code]} onClose={() => setEditing(null)} />}
    </>
  );
}

function EditMessageDialog({ entry, current, onClose }: { entry: PfmsErrorEntry; current: string | undefined; onClose: () => void }) {
  const { setErrorMessage } = usePfms();
  const { toast } = useToast();
  const [text, setText] = React.useState(current ?? entry.message);
  const [tried, setTried] = React.useState(false);
  const error = tried && !text.trim() ? "Enter the message the Maker should read. To use the default wording, choose Restore Default." : undefined;
  const dirty = text !== (current ?? entry.message);

  const save = () => {
    setTried(true);
    if (!text.trim()) return;
    // Saving the default wording verbatim clears the override rather than storing a copy of it.
    setErrorMessage(entry.code, text.trim() === entry.message ? null : text);
    toast(`Message for ${entry.code} saved.`, "success");
    onClose();
  };
  const restore = () => {
    setErrorMessage(entry.code, null);
    toast(`Default message restored for ${entry.code}.`, "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Edit Message: ${entry.code}`}
      size="md"
      dirty={dirty}
      footer={
        <>
          {current && (
            <Button appearance="text" onClick={restore} className="mr-auto">
              Restore Default
            </Button>
          )}
          <Button appearance="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save Message</Button>
        </>
      }
    >
      <div className="space-y-4">
        <DescriptionList
          size="sm"
          columns={2}
          items={[
            { term: "Category", value: entry.category },
            { term: "Points To", value: STEP_LABEL[entry.step] },
            { term: "Default Message", value: entry.message },
          ]}
        />
        <FormField
          label="Message Shown to the Maker"
          id="em-message"
          required
          error={error}
          hint="Plain language: what went wrong and what to do next, in one or two sentences."
          characterCount={{ value: text, maxLength: MESSAGE_MAX }}
        >
          {(f) => <Textarea {...f} rows={4} maxLength={MESSAGE_MAX} value={text} onChange={(e) => setText(e.target.value)} />}
        </FormField>
      </div>
    </Modal>
  );
}
