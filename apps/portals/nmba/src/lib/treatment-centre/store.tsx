"use client";

// In-session mock store for the Treatment-Centre demo. Seeded from synthetic
// data; create actions update React state so list screens reflect new records
// during the session. Resets on reload (no backend, no persistence) — by design.

import * as React from "react";
import type {
  Patient,
  Beneficiary,
  PeerEducator,
  FollowUp,
  Readmission,
  AwarenessProgramme,
  StaffMember,
  CentreActivity,
  SaptahEvent,
} from "./types";
import {
  SEED_PATIENTS,
  SEED_BENEFICIARIES,
  SEED_PEER_EDUCATORS,
  SEED_FOLLOW_UPS,
  SEED_READMISSIONS,
  SEED_AWARENESS,
  SEED_STAFF,
  SEED_ACTIVITIES,
  SEED_SAPTAH_EVENTS,
} from "./mock-data";

export type TCStore = {
  patients: Patient[];
  beneficiaries: Beneficiary[];
  peerEducators: PeerEducator[];
  followUps: FollowUp[];
  readmissions: Readmission[];
  awareness: AwarenessProgramme[];
  staff: StaffMember[];
  activities: CentreActivity[];
  saptahEvents: SaptahEvent[];
  addPatient: (patient: Omit<Patient, "id">) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addBeneficiary: (beneficiary: Omit<Beneficiary, "id">) => void;
  updateBeneficiary: (id: string, updates: Partial<Beneficiary>) => void;
  addPeerEducator: (educator: Omit<PeerEducator, "id">) => void;
  updatePeerEducator: (id: string, updates: Partial<PeerEducator>) => void;
  removePeerEducator: (id: string) => void;
  addFollowUp: (followUp: Omit<FollowUp, "id">) => void;
  addReadmission: (readmission: Omit<Readmission, "id">) => void;
  addAwareness: (programme: Omit<AwarenessProgramme, "id">) => void;
  addStaff: (staff: Omit<StaffMember, "id">) => void;
  addSaptahEvent: (event: Omit<SaptahEvent, "id">) => void;
};

const TCStoreContext = React.createContext<TCStore | null>(null);

export function TCStoreProvider({ children }: { children: React.ReactNode }) {
  // Per-provider id counter (avoids module-level shared state across mounts).
  const counterRef = React.useRef(0);
  const nextId = React.useCallback((prefix: string) => {
    counterRef.current += 1;
    return `${prefix}-new-${counterRef.current}`;
  }, []);
  const [patients, setPatients] = React.useState<Patient[]>(SEED_PATIENTS);
  const [beneficiaries, setBeneficiaries] = React.useState<Beneficiary[]>(SEED_BENEFICIARIES);
  const [peerEducators, setPeerEducators] = React.useState<PeerEducator[]>(SEED_PEER_EDUCATORS);
  const [followUps, setFollowUps] = React.useState<FollowUp[]>(SEED_FOLLOW_UPS);
  const [readmissions, setReadmissions] = React.useState<Readmission[]>(SEED_READMISSIONS);
  const [awareness, setAwareness] = React.useState<AwarenessProgramme[]>(SEED_AWARENESS);
  const [staff, setStaff] = React.useState<StaffMember[]>(SEED_STAFF);
  // Activities are seed-only (no in-session mutation) — no setter needed.
  const [activities] = React.useState<CentreActivity[]>(SEED_ACTIVITIES);
  const [saptahEvents, setSaptahEvents] = React.useState<SaptahEvent[]>(SEED_SAPTAH_EVENTS);

  const value = React.useMemo<TCStore>(
    () => ({
      patients,
      beneficiaries,
      peerEducators,
      followUps,
      readmissions,
      awareness,
      staff,
      activities,
      saptahEvents,
      addPatient: (patient) =>
        setPatients((prev) => [{ ...patient, id: nextId("p") }, ...prev]),
      updatePatient: (id, updates) =>
        setPatients((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        ),
      addBeneficiary: (beneficiary) =>
        setBeneficiaries((prev) => [{ ...beneficiary, id: nextId("b") }, ...prev]),
      updateBeneficiary: (id, updates) =>
        setBeneficiaries((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
        ),
      addPeerEducator: (educator) =>
        setPeerEducators((prev) => [{ ...educator, id: nextId("pe") }, ...prev]),
      updatePeerEducator: (id, updates) =>
        setPeerEducators((prev) =>
          prev.map((pe) => (pe.id === id ? { ...pe, ...updates } : pe))
        ),
      removePeerEducator: (id) =>
        setPeerEducators((prev) => prev.filter((e) => e.id !== id)),
      addFollowUp: (followUp) =>
        setFollowUps((prev) => [{ ...followUp, id: nextId("f") }, ...prev]),
      addReadmission: (readmission) =>
        setReadmissions((prev) => [{ ...readmission, id: nextId("r") }, ...prev]),
      addAwareness: (programme) =>
        setAwareness((prev) => [...prev, { ...programme, id: nextId("aw") }]),
      addStaff: (stf) =>
        setStaff((prev) => [{ ...stf, id: nextId("st") }, ...prev]),
      addSaptahEvent: (event) =>
        setSaptahEvents((prev) => [{ ...event, id: nextId("s") }, ...prev]),
    }),
    [patients, beneficiaries, peerEducators, followUps, readmissions, awareness, staff, activities, saptahEvents, nextId],
  );

  return <TCStoreContext.Provider value={value}>{children}</TCStoreContext.Provider>;
}

export function useTCStore(): TCStore {
  const ctx = React.useContext(TCStoreContext);
  if (!ctx) throw new Error("useTCStore must be used within a TCStoreProvider");
  return ctx;
}
