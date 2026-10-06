"use client";

import * as React from "react";
import { IndiaTileMap } from "@mosje/design-system";

const DATA = [
  ["Uttar Pradesh", 1.7], ["Maharashtra", 4.7], ["Bihar", 6.9], ["West Bengal", 3.6], ["Madhya Pradesh", 163], ["Tamil Nadu", 9.2],
  ["Rajasthan", 20], ["Karnataka", 30], ["Gujarat", 25], ["Andhra Pradesh", 17], ["Odisha", 8.8], ["Telangana", 76], ["Kerala", 12],
  ["Jharkhand", 11], ["Assam", 8.8], ["Punjab", 9.9], ["Chhattisgarh", 14], ["Haryana", 18], ["Delhi", 15], ["Jammu and Kashmir", 101],
  ["Uttarakhand", 17], ["Himachal Pradesh", 27], ["Tripura", 81], ["Meghalaya", 50], ["Manipur", 29], ["Nagaland", 19], ["Goa", 14],
  ["Arunachal Pradesh", 14], ["Puducherry", 29], ["Mizoram", 45], ["Chandigarh", 417], ["Sikkim", 112],
  ["Dadra and Nagar Haveli and Daman and Diu", 368], ["Andaman and Nicobar Islands", 21], ["Ladakh", 27], ["Lakshadweep", 17],
].map(([state, value]) => ({ state: state as string, value: value as number }));
/** The page's live specimen. */
export function Specimen(): React.JSX.Element {
  const [picked, setPicked] = React.useState<string | undefined>("Kerala");
  return <IndiaTileMap title="People reached per 100 people, by State/UT" data={DATA} scale="quantile" valueFormat={(v) => `${v} per 100 people`} tileFormat={(v) => String(v)} legendFormat={(v) => String(v)} selected={picked} onSelect={setPicked} />;
}
