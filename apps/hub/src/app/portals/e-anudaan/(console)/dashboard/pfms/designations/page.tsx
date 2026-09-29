"use client";

/**
 * Maker & Checker — who prepares and who signs payment advices for each DDO (PFMS BRD BR-DSC-001,
 * §4, §10).
 *
 * DS Audit: WorklistScreen ✅ existing · Badge ✅ · Modal ✅ · FormField ✅ · Select ✅ · Input ✅ ·
 * DatePicker ✅ · ErrorSummary ✅ · DescriptionList ✅ · Alert ✅ · Button ✅ · Icon ✅ · screenCopy ✅ ·
 * useToast ✅ — composed, nothing new.
 *
 * The Under Secretary designates the Maker and the Checker (§4); the Bureau keeps the record, so
 * both seats reach this page (`designateOfficers`). Only the designated Checker's certificate can
 * sign a DDO's advices, and an expired one refuses to (certificateCheck → "expired"), so expiry is
 * a column with its consequence in the badge, and a certificate inside 30 days is flagged before it
 * stops a payment. The Maker and the Checker must be different officers (§10) — refused inline.
 */

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  DatePicker,
  DescriptionList,
  ErrorSummary,
  FormField,
  Icon,
  Input,
  Modal,
  Select,
  WorklistScreen,
  screenCopy,
  useToast,
  type WorklistColumn,
} from "@mosje/design-system";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { formatDate, formatDateTime } from "@/lib/e-anudaan/format";
import type { Designation } from "@/lib/e-anudaan/pfms/types";
import type { RoleId } from "@/lib/e-anudaan/types";

const DAY = 86_400_000;
const CERT_WARN_DAYS = 30;

/**
 * Who may be designated: the Maker and Checker seats, and any officer of the Programme Division's
 * approval chain — the BRD places both duties "within the Programme Division" and leaves open
 * whether they are seats of their own or duties added to an existing grade (open question 2).
 */
const OFFICERS: RoleId[] = (Object.keys(ROLES) as RoleId[]).filter((id) => id === "pd-maker" || id === "pd-checker" || ROLES[id].division === "pd");

const officer = (id: RoleId) => `${ROLES[id].personName}, ${ROLES[id].label}`;

type Row = Designation & { ddoName: string };

function certificateState(expires: string, today: string): { label: string; status: "danger" | "warning" | "success"; days: number } {
  const days = Math.round((Date.parse(expires) - Date.parse(today)) / DAY);
  if (days < 0) return { label: "Expired", status: "danger", days };
  if (days === 0) return { label: "Expires Today", status: "warning", days };
  if (days <= CERT_WARN_DAYS) return { label: `Expires in ${days} Day${days === 1 ? "" : "s"}`, status: "warning", days };
  return { label: "Valid", status: "success", days };
}

function Person({ id }: { id: RoleId }) {
  const r = ROLES[id];
  return (
    <span className="block min-w-[10rem]">
      <span className="block text-ink">{r.personName}</span>
      <span className="block text-body-3 text-ink-muted">{r.label}</span>
    </span>
  );
}

export default function DesignationsPage() {
  const { pfms, hydrated, now } = usePfms();
  const [editing, setEditing] = React.useState<Row | null>(null);
  const today = now().slice(0, 10);

  const rows: Row[] = pfms.designations.map((d) => ({ ...d, ddoName: pfms.masters.ddos.find((x) => x.code === d.ddoCode)?.name ?? d.ddoCode }));
  const due = rows.filter((r) => certificateState(r.certificateExpires, today).status !== "success").length;

  const columns: WorklistColumn<Row>[] = [
    {
      key: "ddo",
      header: "DDO",
      priority: 1,
      sortable: true,
      sortValue: (r) => r.ddoCode,
      exportValue: (r) => `${r.ddoCode} ${r.ddoName}`,
      render: (r) => (
        <span className="block min-w-[12rem]">
          <span className="block font-semibold text-ink">{r.ddoName}</span>
          <span className="block font-mono text-body-3 text-ink-muted">{r.ddoCode}</span>
        </span>
      ),
    },
    { key: "maker", header: "Maker", priority: 2, exportValue: (r) => officer(r.maker), render: (r) => <Person id={r.maker} /> },
    { key: "checker", header: "Checker", priority: 2, exportValue: (r) => officer(r.checker), render: (r) => <Person id={r.checker} /> },
    { key: "serial", header: "Certificate Serial", priority: 3, exportValue: (r) => r.certificateSerial, render: (r) => <span className="font-mono text-body-2">{r.certificateSerial}</span> },
    {
      key: "expires",
      header: "Certificate Expiry",
      priority: 2,
      sortable: true,
      sortValue: (r) => r.certificateExpires,
      exportValue: (r) => `${formatDate(r.certificateExpires)} ${certificateState(r.certificateExpires, today).label}`,
      render: (r) => {
        const s = certificateState(r.certificateExpires, today);
        return (
          <span className="block whitespace-nowrap">
            <span className="block">{formatDate(r.certificateExpires)}</span>
            <Badge status={s.status} size="sm" className="mt-1">
              {s.label}
            </Badge>
          </span>
        );
      },
    },
    {
      key: "designated",
      header: "Designated",
      priority: 3,
      exportValue: (r) => `${formatDate(r.designatedAt)} ${ROLES[r.designatedBy].personName}`,
      render: (r) => (
        <span className="block whitespace-nowrap">
          <span className="block">{formatDate(r.designatedAt)}</span>
          <span className="block text-body-3 text-ink-muted">{ROLES[r.designatedBy].personName}</span>
        </span>
      ),
    },
  ];

  return (
    <>
      <WorklistScreen<Row>
        title="Maker & Checker"
        meta="The officers designated to prepare and to sign payment advices for each DDO, and the Checker's signing certificate."
        loading={!hydrated}
        summary={
          hydrated && due > 0 ? (
            <Alert status="warning" title="Certificates Needing Renewal">
              {due} Checker certificate{due === 1 ? " has" : "s have"} expired or will expire within {CERT_WARN_DAYS} days. An expired certificate cannot sign a payment advice.
            </Alert>
          ) : undefined
        }
        columns={columns}
        rowActions={(r) => (
          <Button size="sm" appearance="outlined" nowrap iconLeft={<Icon name="edit" size={16} aria-hidden />} onClick={() => setEditing(r)} aria-label={`Edit the designation for ${r.ddoName}`}>
            Edit
          </Button>
        )}
        rows={rows}
        getRowId={(r) => r.ddoCode}
        noun="DDO"
        copy={screenCopy({
          loadingLabel: "Loading designations",
          emptyTitle: "No DDO to Designate",
          emptyDescription: "No DDO is in the PFMS master data. Refresh the master data.",
        })}
      />
      {editing && <EditDesignationDialog key={editing.ddoCode} row={editing} onClose={() => setEditing(null)} />}
    </>
  );
}

function EditDesignationDialog({ row, onClose }: { row: Row; onClose: () => void }) {
  const { setDesignation } = usePfms();
  const { toast } = useToast();
  const [maker, setMaker] = React.useState<RoleId>(row.maker);
  const [checker, setChecker] = React.useState<RoleId>(row.checker);
  const [serial, setSerial] = React.useState(row.certificateSerial);
  const [expires, setExpires] = React.useState(row.certificateExpires);
  const [tried, setTried] = React.useState(false);

  // The Maker/Checker clash is shown the moment it happens, not only on save: it is the one rule
  // the officer choosing names needs to see while choosing.
  const errors: Record<string, string> = {};
  if (maker === checker) errors["dg-checker"] = "The Checker must be a different officer from the Maker.";
  if (tried && !serial.trim()) errors["dg-serial"] = "Enter the serial number of the Checker's certificate.";
  if (tried && !expires) errors["dg-expires"] = "Enter the date the certificate expires.";
  const summary = tried ? Object.entries(errors).map(([fieldId, message]) => ({ fieldId, message })) : [];
  const dirty = maker !== row.maker || checker !== row.checker || serial !== row.certificateSerial || expires !== row.certificateExpires;
  const options = OFFICERS.map((id) => ({ value: id, label: officer(id) }));

  const save = () => {
    setTried(true);
    if (maker === checker || !serial.trim() || !expires) return;
    const res = setDesignation(row.ddoCode, { maker, checker, certificateSerial: serial.trim().toUpperCase(), certificateExpires: expires });
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast(`Designation saved for ${row.ddoName}.`, "success");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit Maker & Checker"
      size="md"
      dirty={dirty}
      footer={
        <>
          <Button appearance="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Save Designation</Button>
        </>
      }
    >
      <div className="space-y-4">
        <DescriptionList
          size="sm"
          columns={2}
          items={[
            { term: "DDO", value: `${row.ddoName} (${row.ddoCode})` },
            { term: "Last Designated", value: `${formatDateTime(row.designatedAt)} by ${ROLES[row.designatedBy].personName}` },
          ]}
        />
        {summary.length > 0 && <ErrorSummary errors={summary} headingLevel={3} />}
        <FormField label="Maker" id="dg-maker" required hint="Prepares the payment advice.">
          {(f) => <Select {...f} value={maker} onChange={(e) => setMaker(e.target.value as RoleId)} options={options} />}
        </FormField>
        <FormField label="Checker" id="dg-checker" required error={errors["dg-checker"]} hint="Authorises and digitally signs the payment advice.">
          {(f) => <Select {...f} value={checker} onChange={(e) => setChecker(e.target.value as RoleId)} options={options} />}
        </FormField>
        <FormField label="Certificate Serial Number" id="dg-serial" required error={errors["dg-serial"]} hint="The serial number of the Checker's signing certificate.">
          {(f) => <Input {...f} autoComplete="off" className="font-mono" value={serial} onChange={(e) => setSerial(e.target.value)} />}
        </FormField>
        <DatePicker id="dg-expires" label="Certificate Expiry Date" required value={expires} onChange={setExpires} error={errors["dg-expires"]} invalid={!!errors["dg-expires"]} />
      </div>
    </Modal>
  );
}
