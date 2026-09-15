// DS Audit: nothing drawn here — the guard in front of TgDigiLockerHandoff.

import { notFound } from "next/navigation";
import { TgDigiLockerHandoff } from "@/components/tg/tg-digilocker-handoff";
import { TG_DIGILOCKER } from "@/lib/tg/identity";

/** DigiLocker's hand-off exists only while the citizen login offers it. */
export default function DigiLockerHandoffPage() {
  if (!TG_DIGILOCKER.citizen.login) notFound();
  return <TgDigiLockerHandoff />;
}
