"use client";

// DS Audit: PortalLoginShell ✅ · AuthResult ✅ — the login's own chrome around
// the estate's result block; nothing drawn here.

import * as React from "react";
import { useRouter } from "next/navigation";
import { AuthResult, PortalLoginShell } from "@mosje/design-system";
import { TG_CITIZEN_HOME, TG_LOGIN_CHROME } from "@/components/tg/tg-login";
import { useTg } from "@/lib/tg/store/store";

/**
 * Where the login's DigiLocker card hands off to. PROTOTYPE: no identity
 * provider is connected, so arriving here signs in the demo citizen and moves
 * on to the dashboard — the mock the old "Continue with DigiLocker" button ran
 * inline, now reached through the card's real link.
 */
export default function DigiLockerHandoffPage() {
  const router = useRouter();
  const { login } = useTg();

  React.useEffect(() => {
    login("citizen");
    router.replace(TG_CITIZEN_HOME);
    // Once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { brandAssets, portalName, portalTagline, changeHref } = TG_LOGIN_CHROME;
  return (
    <PortalLoginShell
      emblemSrc={brandAssets.emblemSrc}
      digitalIndiaSrc={brandAssets.digitalIndiaSrc}
      samaveshLogoSrc={brandAssets.samaveshLogoSrc}
      heroImageSrc={brandAssets.heroImageSrc}
      signingInto={portalName}
      portalTagline={portalTagline}
      changeHref={changeHref}
      tabs={[]}
    >
      <div role="status">
        <AuthResult
          headingLevel={1}
          status="notice"
          icon="progress_activity"
          heading="Signing In with DigiLocker"
          description="You will be taken to your dashboard."
        />
      </div>
    </PortalLoginShell>
  );
}
