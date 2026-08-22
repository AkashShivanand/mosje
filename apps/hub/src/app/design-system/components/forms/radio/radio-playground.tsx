"use client";
import * as React from "react";
import { Radio } from "@mosje/design-system";

export function RadioPlayground() {
  const [val, setVal] = React.useState("email");
  const [valCard, setValCard] = React.useState("standard");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-40)", padding: "var(--sa-padding-40)", background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-8)", maxWidth: "500px", margin: "0 auto" }}>
      
      <div>
        <h4 style={{ margin: "0 0 var(--sa-stack-16) 0", fontSize: "var(--sa-type-body-1-size)", color: "var(--sa-text-neutral-bolder)" }}>Standard Inline Radio</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-12)" }}>
          <Radio name="contact" value="email" checked={val === "email"} onChange={() => setVal("email")} label="Email" />
          <Radio name="contact" value="sms" checked={val === "sms"} onChange={() => setVal("sms")} label="SMS (Text message)" />
          <Radio name="contact" value="post" checked={val === "post"} onChange={() => setVal("post")} label="Postal mail" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--sa-stack-16) 0", fontSize: "var(--sa-type-body-1-size)", color: "var(--sa-text-neutral-bolder)" }}>Card Variant (Radio Card)</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-12)" }}>
          <Radio 
            variant="card" name="plan" value="standard" checked={valCard === "standard"} onChange={() => setValCard("standard")} 
            label="Standard Application" description="Processed within 15-20 working days. Free of charge." 
          />
          <Radio 
            variant="card" name="plan" value="tatkal" checked={valCard === "tatkal"} onChange={() => setValCard("tatkal")} 
            label="Tatkal (Expedited)" description="Processed within 3-5 working days. Premium processing fee applies." 
          />
        </div>
      </div>

    </div>
  );
}
