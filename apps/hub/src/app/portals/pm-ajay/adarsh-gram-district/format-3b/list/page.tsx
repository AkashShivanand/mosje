"use client";

/* Adarsh Gram — District: Format III(B) Register.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-3b/list.

   DS Audit: WorklistScreen ✅ (owns all seven states, the pager and the phone cards) ·
   FormField ✅ · Select ✅ · Search ✅ · Button ✅ · IconButton ✅ · Icon ✅ · Badge ✅.
   Nothing added.

   The live screen's "Record Details" panel is the same five cascading pickers as
   `/format-3b` and `/format-3b/add` — Block → Gram Panchayat → Village, and
   Domain → Monitorable Indicator — and the register is not asked for until all five
   are chosen: `idle`, never `empty`
   (`.claude/rules/data-state-completeness.md` §1). `asked={complete}` carries that.

   Once a village is chosen, `BENEFICIARIES` (Domain and Monitorable Indicator are not
   fields the register carries per record, so — like the live screen's own pickers —
   they gate the register open without narrowing which rows appear) is scoped to it,
   and the Search and Status controls beneath narrow it further, which is where
   `filtered` (as against `empty`) is demonstrated.

   State and District are stated in the meta line rather than drawn as two dead,
   disabled fields — the same call the Agency add screen makes
   (`.claude/rules/ui-restraint-and-copy.md` §1). */

import * as React from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  FormField,
  Icon,
  IconButton,
  Search,
  Select,
  WorklistScreen,
  screenCopy,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  BENEFICIARIES,
  BLOCKS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  INDICATOR_DOMAINS,
  PROVENANCE_LINE,
  VILLAGES,
  lakh,
  type BeneficiaryRecord,
} from "@/lib/pm-ajay/district/registers";
import { BENEFICIARY_STATUSES, MONITORABLE_INDICATORS } from "@/lib/pm-ajay/district/format-3b";

const ALL_STATUSES = "All statuses";

const STATUS_TONE: Record<BeneficiaryRecord["status"], "success" | "warning" | "info"> = {
  Disbursed: "success",
  Sanctioned: "info",
  Pending: "warning",
};

const COLUMNS: WorklistColumn<BeneficiaryRecord>[] = [
  { key: "beneficiary", header: "Beneficiary", priority: 1 },
  { key: "initiative", header: "Initiative", priority: 2 },
  { key: "scheme", header: "Scheme", priority: 2 },
  {
    key: "sanctionedAmount",
    align: "end",
    header: "Sanctioned Amount",
    priority: 3,
    render: (row) => lakh(row.sanctionedAmount),
  },
  {
    key: "status",
    header: "Status",
    priority: 2,
    render: (row) => <Badge status={STATUS_TONE[row.status]}>{row.status}</Badge>,
  },
];

export default function Format3bListPage() {
  const [block, setBlock] = React.useState("");
  const [gramPanchayat, setGramPanchayat] = React.useState("");
  const [villageId, setVillageId] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [indicator, setIndicator] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState(ALL_STATUSES);

  const gramPanchayats = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villages = React.useMemo(
    () =>
      block && gramPanchayat
        ? VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat)
        : [],
    [block, gramPanchayat],
  );
  const village = villages.find((v) => v.id === villageId);
  const indicators = domain ? (MONITORABLE_INDICATORS[domain] ?? []) : [];

  const complete = Boolean(block && gramPanchayat && village && domain && indicator);

  const villageBeneficiaries = React.useMemo(
    () => (village ? BENEFICIARIES.filter((b) => b.village === village.village) : []),
    [village],
  );

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return villageBeneficiaries.filter((b) => {
      if (status !== ALL_STATUSES && b.status !== status) return false;
      if (!q) return true;
      return `${b.beneficiary} ${b.initiative} ${b.scheme}`.toLowerCase().includes(q);
    });
  }, [villageBeneficiaries, query, status]);

  const activeFilterCount = (query.trim() ? 1 : 0) + (status !== ALL_STATUSES ? 1 : 0);

  return (
    <WorklistScreen
      eyebrow="Village Format"
      title="Format – III(B): Consolidation of Household Data for Beneficiary Oriented Initiatives and Action Plan for Fulfilling Needs"
      meta={`Beneficiary-level records under Adarsh Gram initiatives in ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}. ${PROVENANCE_LINE}`}
      asked={complete}
      actions={
        <Button
          href={`${DISTRICT_BASE}/format-3b/add`}
          linkAs={Link}
          iconLeft={<Icon name="add" size={20} />}
        >
          Add Beneficiary Record
        </Button>
      }
      filters={
        <>
          <FormField label="Block" id="f3b-list-block" required>
            {(control) => (
              <Select
                {...control}
                value={block}
                onChange={(event) => {
                  setBlock(event.target.value);
                  setGramPanchayat("");
                  setVillageId("");
                }}
                placeholder="Select Block"
              >
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Gram Panchayat" id="f3b-list-gp" required>
            {(control) => (
              <Select
                {...control}
                value={gramPanchayat}
                onChange={(event) => {
                  setGramPanchayat(event.target.value);
                  setVillageId("");
                }}
                disabled={!block}
                placeholder="Select Gram Panchayat"
              >
                {gramPanchayats.map((gp) => (
                  <option key={gp} value={gp}>
                    {gp}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Village" id="f3b-list-village" required>
            {(control) => (
              <Select
                {...control}
                value={villageId}
                onChange={(event) => setVillageId(event.target.value)}
                disabled={!gramPanchayat}
                placeholder="Select Village"
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.village}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Domain" id="f3b-list-domain" required>
            {(control) => (
              <Select
                {...control}
                value={domain}
                onChange={(event) => {
                  setDomain(event.target.value);
                  setIndicator("");
                }}
                placeholder="Select Domain"
              >
                {INDICATOR_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Monitorable Indicator" id="f3b-list-indicator" required>
            {(control) => (
              <Select
                {...control}
                value={indicator}
                onChange={(event) => setIndicator(event.target.value)}
                disabled={!domain}
                placeholder="Select Monitorable Indicator"
              >
                {indicators.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          {complete ? (
            <>
              <Search
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onClear={() => setQuery("")}
                placeholder="Beneficiary, initiative or scheme"
                aria-label="Search this village's beneficiary records"
              />
              <FormField label="Status" id="f3b-list-status">
                {(control) => (
                  <Select {...control} value={status} onChange={(event) => setStatus(event.target.value)}>
                    <option value={ALL_STATUSES}>{ALL_STATUSES}</option>
                    {BENEFICIARY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
            </>
          ) : null}
        </>
      }
      activeFilterCount={activeFilterCount}
      onClearFilters={() => {
        setQuery("");
        setStatus(ALL_STATUSES);
      }}
      columns={COLUMNS}
      rows={rows}
      registerTotal={villageBeneficiaries.length}
      getRowId={(row) => row.id}
      noun="beneficiary record"
      pluralNoun="beneficiary records"
      rowActions={(row) => (
        <IconButton
          icon={<Icon name="edit" size={20} />}
          aria-label={`Edit the record for ${row.beneficiary}`}
          variant="neutral"
          appearance="text"
          size="sm"
          tooltip
          href={`${DISTRICT_BASE}/format-3b/add?beneficiary=${row.id}`}
          linkAs={Link}
        />
      )}
      emptyAction={
        <Button href={`${DISTRICT_BASE}/format-3b/add`} linkAs={Link}>
          Add the first beneficiary record
        </Button>
      }
      copy={screenCopy({
        idleTitle: "Choose a Village to See Its Beneficiary Register",
        idleDescription:
          "Select the block, Gram Panchayat, village, domain and monitorable indicator above.",
        emptyTitle: "No Beneficiary Record Is on This Village's Register Yet",
        emptyDescription:
          "Add the households sanctioned under a beneficiary-oriented initiative in this village.",
        filteredTitle: "No Beneficiary Record Matches Those Filters",
        filteredDescription: "Clear the search or the status to see this village's whole register.",
      })}
    />
  );
}
