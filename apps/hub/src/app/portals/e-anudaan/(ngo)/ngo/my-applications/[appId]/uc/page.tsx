"use client";

/**
 * Utilisation Certificate (GFR 12-A).
 *
 * DS Audit: Alert ✅ existing · Button ✅ · Card ✅ · DescriptionList ✅ · ErrorSummary ✅ ·
 * FileList ✅ · FormField ✅ · Icon ✅ · Input ✅ · PageHeader ✅ · Textarea ✅ · useToast ✅ —
 * nothing new.
 *
 * Maintainer note, kept off the screen: this screen is inferred. The live UC route returned
 * "Application not found." for every id tried (user INVENTORY §14, defect D6); live notifies
 * "1st instalment released — UC due … Open →". It is now reached from that notice, from the
 * application page of a sanctioned file, and the certificate is recorded on the file rather than
 * only acknowledged. Its own lead says the certificate is signed by a Chartered Accountant, and the
 * form now asks for that signed certificate (parity inventory §12).
 *
 * Design-director audit, 16 Sep 2026 (N-18, X-07): the page had no way back to its application,
 * and never said WHICH grant it certifies — a project claims up to three instalments a year, so
 * "₹29,00,000 sanctioned" alone was ambiguous. It names the instalment and financial year, and
 * shows what was released beside what was sanctioned. Amounts stay in full rupees: this is a
 * statutory certificate (glossary, money `exact`). The page is fluid like every portal surface;
 * the form fields keep a readable measure inside the card.
 */

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  CardBody,
  DescriptionList,
  ErrorSummary,
  FileList,
  FormField,
  Icon,
  Input,
  PageHeader,
  Textarea,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { caseLabel, projectTitleFor } from "@/lib/e-anudaan/applicant";
import { ngoScheme } from "@/components/e-anudaan/ngo-schemes";
import { formatDate, rupees } from "@/lib/e-anudaan/format";
import { ownApplication, signedInNgoId } from "@/lib/e-anudaan/roles";
import { NgoApplicationNotFound } from "@/components/e-anudaan/ngo-application-not-found";
import { useDemoFormFill } from "@/components/e-anudaan/use-demo-form-fill";
import { ucAmountOf } from "@/lib/e-anudaan/demo-forms/utilisation-certificate";

export default function UtilisationCertificatePage() {
  const params = useParams<{ appId: string }>();
  const router = useRouter();
  const { state, findApp, fileUtilisationCertificate } = useEAnudaan();
  const { toast } = useToast();
  // Another organisation's file reads exactly as a missing one (security audit S05).
  const app = ownApplication(findApp(decodeURIComponent(params.appId)), signedInNgoId(state));
  const [spent, setSpent] = React.useState("");
  const [remarks, setRemarks] = React.useState("");
  const [doc, setDoc] = React.useState<{ name: string; size: number } | null>(null);
  const [tried, setTried] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);

  // The form shows only on a sanctioned file with no certificate yet; elsewhere there is nothing to fill.
  useDemoFormFill("utilisation-certificate", (v, preset) => {
    if (!app?.sanction || app.utilisation) return;
    setSpent(ucAmountOf(v.amount ?? "", app.release?.amount ?? app.sanction.total));
    setRemarks(v.remarks ?? "");
    setDoc(v.document ? { name: v.document, size: 486_000 } : null);
    setTried(!preset.valid);
  });

  if (!app) return <NgoApplicationNotFound />;

  const sanctioned = app.sanction?.total ?? 0;
  // What can have been spent is what reached the organisation: the release, once there is one.
  const released = app.release?.amount;
  const ceiling = released ?? sanctioned;
  const certifies = `${caseLabel(app)} · FY ${app.financialYear}`;
  const amount = Number(spent);
  const back = `/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(app.id)}`;

  const errors = [
    !(spent && Number.isFinite(amount) && amount > 0) && { fieldId: "spent", message: "Enter the amount utilised, in rupees." },
    spent && amount > ceiling && { fieldId: "spent", message: `The amount utilised cannot exceed the ${rupees(ceiling)} ${released != null ? "released" : "sanctioned"}.` },
    !remarks.trim() && { fieldId: "uc-remarks", message: "State the purposes the grant was spent on." },
    !doc && { fieldId: "uc-doc", message: "Upload the certificate signed by the Chartered Accountant." },
  ].filter(Boolean) as { fieldId: string; message: string }[];
  const errorFor = (id: string) => (tried ? errors.find((e) => e.fieldId === id)?.message : undefined);

  const submit = () => {
    setTried(true);
    if (errors.length || !doc) return;
    const res = fileUtilisationCertificate(app.id, { amountUtilised: amount, remarks: remarks.trim(), documentName: doc.name });
    if (!res.ok) {
      toast(res.error, "error");
      return;
    }
    toast("Utilisation certificate filed.", "success");
    router.push(back);
  };

  return (
    <div className="space-y-5">
      <Button appearance="text" size="sm" onClick={() => router.push(back)}>
        <Icon name="arrow_back" size={16} aria-hidden /> Back to the Application
      </Button>
      <PageHeader
        size="compact"
        eyebrow={
          <span className="tabular-nums">
            Project ID <span className="whitespace-nowrap">{app.institutionId}</span> · Application{" "}
            <span className="whitespace-nowrap">{app.id}</span>
          </span>
        }
        title="Utilisation Certificate"
        meta={
          <>
            <span className="block">
              {projectTitleFor(state, app)} · {ngoScheme(app.schemeCode).title} · {certifies}
            </span>
            <span className="mt-2 block">
              Certify how the sanctioned grant was spent, under GFR 12-A. The certificate must be signed by a Chartered
              Accountant before the next instalment is released.
            </span>
          </>
        }
      />

      {!app.sanction ? (
        <Alert status="warning" title="Not Yet Sanctioned">
          A utilisation certificate can be filed only after the grant has been sanctioned.
        </Alert>
      ) : app.utilisation ? (
        <Card variant="outlined">
          <CardBody className="space-y-4">
            <Alert status="success" title="Certificate Filed">
              Filed on {formatDate(app.utilisation.filedAt)}.
            </Alert>
            <DescriptionList
              columns={3}
              items={[
                { term: "Certifies", value: certifies },
                { term: "Sanctioned", value: rupees(sanctioned) },
                { term: "Released", value: released != null ? rupees(released) : "Not yet released" },
                { term: "Amount Utilised", value: rupees(app.utilisation.amountUtilised) },
                { term: "Unspent Balance", value: rupees(Math.max(0, ceiling - app.utilisation.amountUtilised)) },
                { term: "Signed Certificate", value: app.utilisation.documentName },
                { term: "Purposes and Remarks", value: app.utilisation.remarks },
              ]}
            />
          </CardBody>
        </Card>
      ) : (
        <Card variant="outlined">
          <CardBody className="space-y-4">
            {tried && errors.length > 0 && <ErrorSummary autoFocus errors={errors} />}
            <DescriptionList
              columns={2}
              items={[
                { term: "Certifies", value: certifies },
                { term: "Sanctioned", value: rupees(sanctioned) },
                {
                  term: "Released",
                  value: app.release ? `${rupees(app.release.amount)} on ${formatDate(app.release.releasedAt)}` : "Not yet released",
                },
                { term: "Sanction Order", value: `${app.sanction.orderNo}, ${formatDate(app.sanction.sanctionedAt)}` },
              ]}
            />

            <div className="max-w-measure space-y-4">

            <FormField label="Amount Utilised (₹)" id="spent" required error={errorFor("spent")}>
              {(control) => (
                <Input {...control} inputMode="numeric" value={spent} onChange={(e) => setSpent(e.target.value.replace(/\D/g, ""))} />
              )}
            </FormField>
            <FormField label="Purposes and Remarks" id="uc-remarks" required error={errorFor("uc-remarks")} characterCount={{ value: remarks, maxLength: 1000 }}>
              {(control) => (
                <Textarea {...control} rows={4} maxLength={1000} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              )}
            </FormField>
            <FormField label="Certificate Signed by the Chartered Accountant" id="uc-doc" required hint="PDF, up to 5 MB." error={errorFor("uc-doc")}>
              {(c) => (
                <div className="space-y-2">
                  <input
                    ref={fileInput}
                    id={c.id}
                    aria-describedby={c["aria-describedby"]}
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setDoc({ name: f.name, size: f.size });
                      e.target.value = "";
                    }}
                  />
                  {doc ? (
                    <FileList label="Signed certificate" files={[{ id: "uc", name: doc.name, size: doc.size, state: "ready" }]} onRemove={() => setDoc(null)} />
                  ) : (
                    <Button appearance="outlined" size="sm" onClick={() => fileInput.current?.click()}>
                      <Icon name="upload" size={16} aria-hidden /> Choose File
                    </Button>
                  )}
                </div>
              )}
            </FormField>

            </div>

            <div>
              <Button onClick={submit}>File Utilisation Certificate</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
