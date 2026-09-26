"use client";

/**
 * Block → Gram Panchayat → Village — the cascading picklist every Village Format
 * screen opens with (Format II, Format VI, and the two the brief did not ask for).
 *
 * Shared here rather than written three times: choosing an upstream value clears
 * whatever is downstream of it, so a Village Name can never survive a Block change
 * and go on pointing at the wrong Gram Panchayat. Format VI's own live screen
 * disables Gram Panchayat and Village until their upstream is chosen; Format II's
 * live capture did not, but an enabled control with no options to offer is worse,
 * not more faithful, so the same disable rule is applied to both.
 */

import * as React from "react";
import { GRAM_PANCHAYATS, VILLAGES, type VillageRecord } from "./registers";

export interface VillageCascade {
  block: string;
  gramPanchayat: string;
  village: string;
  setBlock: (value: string) => void;
  setGramPanchayat: (value: string) => void;
  setVillage: (value: string) => void;
  /** Empty until a Block is chosen. */
  gramPanchayatOptions: string[];
  /** Empty until a Gram Panchayat is chosen. */
  villageOptions: string[];
  /** The matched register row, once all three are chosen. */
  selected: VillageRecord | null;
  /** All three are chosen and resolve to one village. */
  complete: boolean;
}

export function useVillageCascade(): VillageCascade {
  const [block, setBlockState] = React.useState("");
  const [gramPanchayat, setGpState] = React.useState("");
  const [village, setVillageState] = React.useState("");

  const gramPanchayatOptions = React.useMemo(
    () => (block ? (GRAM_PANCHAYATS[block] ?? []) : []),
    [block],
  );
  const villageOptions = React.useMemo(
    () =>
      block && gramPanchayat
        ? VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat).map(
            (v) => v.village,
          )
        : [],
    [block, gramPanchayat],
  );

  const setBlock = (value: string): void => {
    setBlockState(value);
    setGpState("");
    setVillageState("");
  };
  const setGramPanchayat = (value: string): void => {
    setGpState(value);
    setVillageState("");
  };
  const setVillage = (value: string): void => setVillageState(value);

  const selected = React.useMemo(
    () =>
      VILLAGES.find(
        (v) => v.block === block && v.gramPanchayat === gramPanchayat && v.village === village,
      ) ?? null,
    [block, gramPanchayat, village],
  );

  return {
    block,
    gramPanchayat,
    village,
    setBlock,
    setGramPanchayat,
    setVillage,
    gramPanchayatOptions,
    villageOptions,
    selected,
    complete: selected != null,
  };
}
