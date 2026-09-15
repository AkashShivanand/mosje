"use client";

/**
 * Utilisation Certificate (GFR 12-A).
 *
 * DS Audit: Alert ✅ existing · Button ✅ · Card ✅ · DescriptionList ✅ · FormField ✅ · Input ✅ ·
 * Textarea ✅ · useToast ✅ — nothing new.
 *
 * Maintainer note, kept off the screen: this screen is inferred. The live UC route returned
 * "Application not found." for every id tried, including a freshly opened SANCTIONED application —
 * the exact state a UC applies to (user INVENTORY §14, defect D6). The form follows the BRD so the
 * post-sanction half of the lifecycle can be demonstrated.
 */

import * as React from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  CardBody,
  DescriptionList,
  FormField,
  Input,
  PageHeader,
  Textarea,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { projectTitleFor } from "@/lib/e-anudaan/applicant";
import { rupees } from "@/lib/e-anudaan/format";
import { ownApplication, signedInNgoId } from "@/lib/e-anudaan/roles";
import { NgoApplicationNotFound } from "@/components/e-anudaan/ngo-application-not-found";

export default function UtilisationCertificatePage() {
  const params = useParams<{ appId: string }>();
  const { state, findApp } = useEAnudaan();
  const { toast } = useToast();
  // Another organisation's file reads exactly as a missing one (security audit S05).
  const app = ownApplication(findApp(decodeURIComponent(params.appId)), signedInNgoId(state));
  const [spent, setSpent] = React.useState("");
  const [remarks, setRemarks] = React.useState("");

  if (!app) return <NgoApplicationNotFound />;

  const sanctioned = app.sanction?.total ?? 0;
  const scheme = state.schemes.find((s) => s.code === app.schemeCode);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        eyebrow={
          <span className="font-mono">
            Project ID <span className="whitespace-nowrap">{app.institutionId}</span> · Application{" "}
            <span className="whitespace-nowrap">{app.id}</span>
          </span>
        }
        title="Utilisation Certificate"
        meta={
          <>
            <span className="block">
              {projectTitleFor(state, app)} · {scheme?.name ?? app.schemeCode} · FY {app.financialYear}
            </span>
            <span className="mt-2 block">
              Certify how the sanctioned grant was spent, under GFR 12-A. The certificate must be signed by a Chartered
              Accountant before the next instalment is released.
            </span>
          </>
        }
      />

      {!app.sanction && (
        <Alert status="warning" title="Not Yet Sanctioned">
          A utilisation certificate can be filed only after the grant has been sanctioned.
        </Alert>
      )}

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <DescriptionList
            columns={2}
            items={[
              { term: "Sanctioned", value: app.sanction ? rupees(sanctioned) : "Not sanctioned" },
              { term: "Financial Year", value: app.financialYear },
            ]}
          />

          <FormField label="Amount utilised (₹)" id="spent">
            {(control) => (
              <Input {...control} type="number" value={spent} onChange={(e) => setSpent(e.target.value)} />
            )}
          </FormField>
          <FormField label="Purpose and remarks" id="uc-remarks">
            {(control) => (
              <Textarea {...control} rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            )}
          </FormField>

          <Button
            disabled={!app.sanction || !spent || !remarks.trim()}
            onClick={() => toast("Utilisation certificate filed.", "success")}
          >
            File Utilisation Certificate
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
