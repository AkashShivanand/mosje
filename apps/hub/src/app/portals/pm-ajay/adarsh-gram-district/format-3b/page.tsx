"use client";

/* Adarsh Gram — District: Format III(B) — Consolidation of Household Data.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-3b.

   DS Audit: OverviewScreen ✅ (owns the idle/loading/error states and the KPI row) ·
   FormPanel ✅ · FormSection ✅ · FormField ✅ · Select ✅ · ChartCard ✅ · Progress ✅ ·
   Button ✅ · Icon ✅. Nothing added to the design system; `consolidatedPosition` and
   `MONITORABLE_INDICATORS` are illustrative data, in
   `@/lib/pm-ajay/district/format-3b.ts`.

   The live screen shows only the village-identification pickers — Block, Gram
   Panchayat, Village, Domain and Monitorable Indicator — inside a "Record Details"
   panel, and nothing below it: the consolidated position is not asked for until all
   five are chosen. That is `idle`, never `empty`
   (`.claude/rules/data-state-completeness.md` §1), so the pickers are OverviewScreen's
   `filters` slot — always shown — and the KPI row plus the coverage chart are handed
   to `kpis`/`panels` only once the selection is complete; `asked={complete}` renders
   the choose-a-village prompt in between.

   State and District are stated in the panel's description rather than drawn as two
   dead, disabled fields — the same call the Agency add screen makes
   (`.claude/rules/ui-restraint-and-copy.md` §1). */

import * as React from "react";
import Link from "next/link";
import {
  Button,
  ChartCard,
  FormField,
  FormPanel,
  FormSection,
  Icon,
  OverviewScreen,
  Progress,
  Select,
  screenCopy,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  BLOCKS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  INDICATOR_DOMAINS,
  VILLAGES,
  count,
  lakh,
} from "@/lib/pm-ajay/district/registers";
import { MONITORABLE_INDICATORS, consolidatedPosition } from "@/lib/pm-ajay/district/format-3b";


export default function Format3bPage() {
  const [block, setBlock] = React.useState("");
  const [gramPanchayat, setGramPanchayat] = React.useState("");
  const [villageId, setVillageId] = React.useState("");
  const [domain, setDomain] = React.useState("");
  const [indicator, setIndicator] = React.useState("");

  const gramPanchayats = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villages = React.useMemo(
    () =>
      block && gramPanchayat
        ? VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat)
        : [],
    [block, gramPanchayat],
  );
  const indicators = domain ? (MONITORABLE_INDICATORS[domain] ?? []) : [];
  const village = villages.find((v) => v.id === villageId);

  const complete = Boolean(block && gramPanchayat && village && domain && indicator);
  const position = complete && village ? consolidatedPosition(village, domain, indicator) : null;

  return (
    <OverviewScreen
      eyebrow="Village Format"
      title="Format – III(B): Consolidation of Household Data"
      meta={`Household data consolidated for ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}, by village, domain and monitorable indicator.`}
      actions={
        <Button
          href={`${DISTRICT_BASE}/dashboard`}
          linkAs={Link}
          appearance="outlined"
          iconLeft={<Icon name="arrow_back" size={20} />}
        >
          Back to Dashboard
        </Button>
      }
      asked={complete}
      filters={
        <FormPanel
          title="Record Details"
          description={`Posted to ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} — the district you are posted to.`}
        >
          <FormSection columns={3}>
            <FormField label="Block" id="f3b-block" required>
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
            <FormField label="Gram Panchayat" id="f3b-gp" required>
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
            <FormField label="Village" id="f3b-village" required>
              {(control) => (
                <Select
                  {...control}
                  value={villageId}
                  onChange={(event) => setVillageId(event.target.value)}
                  disabled={!gramPanchayat}
                  placeholder="Select Village Name"
                >
                  {villages.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.village}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Domain" id="f3b-domain" required>
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
            <FormField label="Monitorable Indicator" id="f3b-indicator" required>
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
          </FormSection>
        </FormPanel>
      }
      copy={screenCopy({
        idleTitle: "Choose a Village to See Its Consolidated Position",
        idleDescription:
          "Select the block, Gram Panchayat, village, domain and monitorable indicator above.",
        emptyTitle: "No Household Data Is Consolidated for This Selection",
        emptyDescription:
          "No initiative has been recorded yet for this village, domain and monitorable indicator.",
      })}
      kpis={
        position
          ? [
              { label: "Households in Village", value: count(position.householdsInVillage) },
              { label: "Households Covered", value: count(position.householdsCovered) },
              { label: "Needs Identified", value: count(position.needsIdentified) },
              { label: "Estimated Cost", value: lakh(position.estimatedCost) },
            ]
          : undefined
      }
      panels={
        position && village
          ? [
              <ChartCard
                key="coverage"
                title="Coverage Position"
                subtitle={`${village.village} — ${domain} — ${indicator}`}
              >
                <Progress
                  label="Households Covered"
                  value={position.householdsCovered}
                  max={position.householdsInVillage}
                  tone="success"
                  showValue
                />
                <Progress
                  label="Needs Identified"
                  value={position.needsIdentified}
                  max={position.householdsInVillage}
                  tone="warning"
                  showValue
                />
                <Progress
                  label="Initiatives Sanctioned"
                  value={position.initiativesSanctioned}
                  max={position.needsIdentified || 1}
                  tone="info"
                  showValue
                />
              </ChartCard>,
            ]
          : undefined
      }
    />
  );
}
