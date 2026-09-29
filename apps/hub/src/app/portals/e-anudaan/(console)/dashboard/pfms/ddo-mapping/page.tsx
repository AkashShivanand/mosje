"use client";

/**
 * DDO & Division Codes — the DDOs PFMS knows, and which of them pays each scheme (PFMS BRD
 * FR-MDM-001, FR-MDM-003, FR-MDM-004, §3.1 B).
 *
 * DS Audit: PageHeader ✅ existing · Card ✅ · SectionTitle ✅ · DataTable ✅ · Badge ✅ ·
 * CheckboxGroup ✅ · Button ✅ · Skeleton ✅ · useToast ✅ — composed, nothing new.
 *
 * The DDO list is read-only: it is PFMS master data (GetDDO, GetPAO, GetPDCode,
 * GetDDOeBillActivationStatus) and changes only when the masters are refreshed. What the Bureau
 * decides is the mapping underneath — which DDOs pay which scheme — and that is the only control on
 * the page. A DDO whose e-Bill is not active is still offered, marked, because the Bureau may be
 * mapping it ahead of activation; the Maker's form refuses it until it is active (FR-MDM-004).
 */

import * as React from "react";
import { Badge, Button, Card, CardBody, CheckboxGroup, DataTable, PageHeader, SectionTitle, Skeleton, useToast, type DataTableColumn } from "@mosje/design-system";
import { usePfms } from "@/lib/e-anudaan/pfms/store";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { formatDateTime } from "@/lib/e-anudaan/format";
import { LANDING_LABEL } from "@/lib/e-anudaan/pfms/advice";
import type { Masters, SchemePfmsConfig } from "@/lib/e-anudaan/pfms/types";

type DdoRow = {
  code: string;
  name: string;
  paoCode: string;
  paoName: string;
  eBillActive: boolean;
  landing: string;
  pdCodes: { code: string; label: string }[];
  schemes: string[];
};

export default function DdoMappingPage() {
  const { pfms, hydrated } = usePfms();

  if (!hydrated) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading DDO and division codes">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const m = pfms.masters;
  const rows: DdoRow[] = m.ddos.map((d) => ({
    code: d.code,
    name: d.name,
    paoCode: d.paoCode,
    paoName: m.paos.find((p) => p.code === d.paoCode)?.name ?? "",
    eBillActive: d.eBillActive,
    landing: LANDING_LABEL[d.landing],
    pdCodes: m.pdCodes.filter((p) => p.ddoCode === d.code).map((p) => ({ code: p.code, label: p.label })),
    schemes: pfms.configs.filter((c) => c.ddoCodes.includes(d.code)).map((c) => schemeLabel(c.schemeCode)),
  }));
  const columns: DataTableColumn<DdoRow>[] = [
    {
      key: "name",
      header: "DDO",
      sortable: true,
      sortValue: (r) => r.code,
      exportValue: (r) => `${r.code} ${r.name}`,
      render: (r) => (
        <span className="block min-w-[12rem]">
          <span className="block font-semibold text-ink">{r.name}</span>
          <span className="block font-mono text-body-3 text-ink-muted">{r.code}</span>
        </span>
      ),
    },
    {
      key: "pao",
      header: "PAO",
      exportValue: (r) => `${r.paoCode} ${r.paoName}`,
      render: (r) => (
        <span className="block min-w-[10rem]">
          <span className="block">{r.paoName}</span>
          <span className="block font-mono text-body-3 text-ink-muted">{r.paoCode}</span>
        </span>
      ),
    },
    {
      key: "eBill",
      header: "e-Bill",
      exportValue: (r) => (r.eBillActive ? "Active" : "Not Active"),
      render: (r) => (
        <Badge status={r.eBillActive ? "success" : "warning"} size="sm">
          {r.eBillActive ? "Active" : "Not Active"}
        </Badge>
      ),
    },
    { key: "landing", header: "Sanction Lands", render: (r) => r.landing },
    {
      key: "pd",
      header: "PD Codes",
      exportValue: (r) => r.pdCodes.map((p) => p.code).join(", "),
      render: (r) =>
        r.pdCodes.length === 0 ? (
          <span className="text-ink-muted">None mapped</span>
        ) : (
          <span className="block">
            {r.pdCodes.map((p) => (
              <span key={p.code} className="block">
                <span className="font-mono">{p.code}</span> <span className="text-body-3 text-ink-muted">{p.label}</span>
              </span>
            ))}
          </span>
        ),
    },
    { key: "schemes", header: "Schemes Paid", exportValue: (r) => r.schemes.join(", "), render: (r) => (r.schemes.length ? r.schemes.join(", ") : <span className="text-ink-muted">None</span>) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="DDO & Division Codes" meta={`As published by PFMS, last synchronised ${formatDateTime(m.syncedAt)}.`} />

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle as={2} title="Drawing & Disbursing Officers" description="With their Pay & Accounts Office, e-Bill status and division codes." count={rows.length} />
          <DataTable<DdoRow> caption="Drawing and Disbursing Officers from PFMS master data" columns={columns} data={rows} total={rows.length} emptyLabel="No DDO is in the PFMS master data. Refresh the master data." />
        </CardBody>
      </Card>

      <section aria-labelledby="scheme-ddos" className="space-y-4">
        <SectionTitle as={2} headingId="scheme-ddos" title="DDOs by Scheme" description="The DDOs a Maker may choose on a payment advice for each scheme." />
        {pfms.configs.length === 0 ? (
          <p className="text-body-2 text-ink-muted">No scheme is set up for payment through PFMS.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {pfms.configs.map((cfg) => (
              <SchemeDdos key={cfg.schemeCode} cfg={cfg} masters={m} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SchemeDdos({ cfg, masters }: { cfg: SchemePfmsConfig; masters: Masters }) {
  const { setSchemeDdos } = usePfms();
  const { toast } = useToast();
  const [value, setValue] = React.useState<string[]>(cfg.ddoCodes);
  const [error, setError] = React.useState<string | undefined>();
  const name = schemeLabel(cfg.schemeCode);
  const changed = value.length !== cfg.ddoCodes.length || value.some((v) => !cfg.ddoCodes.includes(v));

  const save = () => {
    const res = setSchemeDdos(cfg.schemeCode, value);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setError(undefined);
    toast(`DDOs saved for ${name}.`, "success");
  };

  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <CheckboxGroup
          id={`ddos-${cfg.schemeCode}`}
          name={`ddos-${cfg.schemeCode}`}
          legend={name}
          hint={cfg.pfmsSchemeCode ? `PFMS scheme code ${cfg.pfmsSchemeCode}` : "PFMS scheme code awaited"}
          options={masters.ddos.map((d) => ({
            value: d.code,
            label: `${d.code} — ${d.name}`,
            description: d.eBillActive ? undefined : "e-Bill not active: the Maker cannot choose this DDO until it is.",
          }))}
          value={value}
          onChange={(v) => {
            setValue(v);
            setError(undefined);
          }}
          error={error}
          invalid={!!error}
          required
        />
        <div className="flex flex-wrap gap-3">
          <Button size="sm" onClick={save} disabled={!changed}>
            Save
          </Button>
          {changed && (
            <Button
              size="sm"
              appearance="text"
              onClick={() => {
                setValue(cfg.ddoCodes);
                setError(undefined);
              }}
            >
              Undo Changes
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
