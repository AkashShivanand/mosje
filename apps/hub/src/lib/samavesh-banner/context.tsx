"use client";

import * as React from "react";
import {
  type SamaveshBannerPlacement,
  DEFAULT_SAMAVESH_BANNER_PLACEMENT,
  shouldShowSamaveshBanner,
} from "./config.ts";

interface SamaveshBannerContextValue {
  placement: SamaveshBannerPlacement;
  shouldShow: (opts: { pathname?: string | null; isHomepage?: boolean; isOrgDetails?: boolean }) => boolean;
}

const SamaveshBannerContext = React.createContext<SamaveshBannerContextValue>({
  placement: DEFAULT_SAMAVESH_BANNER_PLACEMENT,
  shouldShow: (opts) => shouldShowSamaveshBanner(DEFAULT_SAMAVESH_BANNER_PLACEMENT, opts),
});

export interface SamaveshBannerProviderProps {
  placement?: SamaveshBannerPlacement;
  children: React.ReactNode;
}

export function SamaveshBannerProvider({
  placement = DEFAULT_SAMAVESH_BANNER_PLACEMENT,
  children,
}: SamaveshBannerProviderProps) {
  const value = React.useMemo<SamaveshBannerContextValue>(
    () => ({
      placement,
      shouldShow: (opts) => shouldShowSamaveshBanner(placement, opts),
    }),
    [placement],
  );

  return (
    <SamaveshBannerContext.Provider value={value}>
      {children}
    </SamaveshBannerContext.Provider>
  );
}

export function useSamaveshBanner(): SamaveshBannerContextValue {
  return React.useContext(SamaveshBannerContext);
}
