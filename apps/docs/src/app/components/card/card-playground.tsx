"use client";

import { Playground, type ControlDef } from "@/components/playground/index";

const initialCode = `<Card variant="outlined" style={{ maxWidth: 360 }}>
  <CardHeader>
    <CardTitle>PM-AJAY Scheme</CardTitle>
    <CardSubtitle>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana</CardSubtitle>
  </CardHeader>
  <CardBody>
    A consolidated scheme for the socio-economic upliftment and
    development of Scheduled Caste communities across India.
  </CardBody>
  <CardFooter>
    <Button variant="primary">View details</Button>
  </CardFooter>
</Card>`;

const controls: ControlDef[] = [
  { name: "variant", label: "Variant", type: "select", options: ["outlined", "elevated"], defaultValue: "outlined" },
  { name: "orientation", label: "Orientation", type: "select", options: ["vertical", "horizontal"], defaultValue: "vertical" },
  { name: "withFooter", label: "Show footer", type: "boolean", defaultValue: true },
];

function buildCode(v: Record<string, string | boolean>): string {
  const footer = v["withFooter"]
    ? `\n  <CardFooter>\n    <Button variant="primary">View details</Button>\n  </CardFooter>`
    : "";
  return `<Card variant="${v["variant"]}" orientation="${v["orientation"]}" style={{ maxWidth: 360 }}>
  <CardHeader>
    <CardTitle>PM-AJAY Scheme</CardTitle>
    <CardSubtitle>Pradhan Mantri Anusuchit Jaati Abhyuday Yojana</CardSubtitle>
  </CardHeader>
  <CardBody>
    A consolidated scheme for the socio-economic upliftment and
    development of Scheduled Caste communities across India.
  </CardBody>${footer}
</Card>`;
}

export function CardPlayground() {
  return <Playground code={initialCode} controls={controls} buildCode={buildCode} />;
}
