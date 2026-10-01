"use client";

/**
 * PfmsProvider — the payment leg's client-side store.
 *
 * Kept apart from the main e-Anudaan store, under its own key, for two reasons: the main copy is
 * already close to its localStorage budget (store-persistence.test.ts), and nothing on the payment
 * leg changes a grant file except the one thing that should — a confirmed credit, which is handed to
 * the main store's `recordPfmsCredit` so "Paid" here and "Grant Released" there are one event.
 *
 * Every action applies a pure function from `advice.ts` / `simulator.ts`; nothing here decides a
 * rule. Nothing here calls PFMS.
 */

import * as React from "react";
import { useToast } from "@mosje/design-system";
import { useEAnudaan } from "../store/store";
import { SEED_NOW } from "../store/seed";
import { ROLES } from "../roles";
import type { EAnudaanState, RoleId } from "../types";
import { PFMS_SCHEMA_VERSION, buildPfmsSeed, type PfmsState } from "./seed";
import {
  authoriseAndTransmit,
  certificateCheck,
  createAdvice,
  everyAdvice,
  isEditable,
  nextBillNumber,
  restartAdvice,
  returnAdvice,
  saveDraft,
  submitAdvice,
  type CertificateCheck,
} from "./advice";
import { RETURN_LEVELS, advanceRequest, expireFinancialYear, failCredit, resendQueued, returnAndCancel, returnByPfms, simulateTransmit, type ForcedOutcome } from "./simulator";
import { schemeCodeFor } from "./masters";
import { drawBatch, usedClaimReferences } from "./reports";
import { payeeFor } from "./selectors";
import { latestRequest, stageOf } from "./stages";
import type { AdviceDocument, BackfilledAccount, BeneficiaryLine, Designation, HeadOfAccount, HeadLine, PaymentAdvice, ValidationIssue, AdviceHeader } from "./types";

export const PFMS_STORAGE_KEY = "e-anudaan.pfms.v1";
/** The demo dock lives outside this provider (it is mounted by the root layout), so it talks by event. */
export const PFMS_DEMO_EVENT = "e-anudaan:pfms-demo";
/** Fired after every write, so the dock can re-read what it shows. */
export const PFMS_CHANGED_EVENT = "e-anudaan:pfms-changed";
export const PFMS_DEMO_KEY = "e-anudaan.pfms.demo";

export type PfmsDemoCommand =
  | { kind: "set"; demo: Partial<PfmsDemo> }
  | { kind: "advance" | "resend"; appId: string }
  | { kind: "cancel"; appId: string; reason: string }
  | { kind: "return-pfms"; appId: string; level: keyof typeof RETURN_LEVELS; reason: string }
  | { kind: "expire" | "fail-credit"; appId: string }
  | { kind: "reset" };

export type PfmsResult = { ok: true; advice?: PaymentAdvice } | { ok: false; error: string; issues?: ValidationIssue[] };

/** What the demo rail sets for the next signing and the next transmission. */
export interface PfmsDemo {
  next: ForcedOutcome;
  certificate: Extract<CertificateCheck, "ok" | "no-utility" | "no-token">;
}

interface PfmsContextValue {
  pfms: PfmsState;
  hydrated: boolean;
  demo: PfmsDemo;
  setDemo: (d: Partial<PfmsDemo>) => void;
  now: () => string;

  /* Maker */
  openAdvice: (appId: string) => PfmsResult;
  saveAdvice: (appId: string, patch: { header?: AdviceHeader; heads?: HeadLine[]; beneficiaries?: BeneficiaryLine[]; documents?: AdviceDocument[] }) => PfmsResult;
  submit: (appId: string) => PfmsResult;
  /** Open a fresh advice after one that was cancelled, lapsed or failed at the bank (BR-CAN-001). */
  startFresh: (appId: string) => PfmsResult;
  /* Checker */
  returnToMaker: (appId: string, remark: string) => PfmsResult;
  checkCertificate: (appId: string) => CertificateCheck;
  signAndSend: (appId: string) => PfmsResult;
  /* PFMS, from the demo rail */
  advance: (appId: string) => PfmsResult;
  returnAndCancelAtPfms: (appId: string, reason: string) => PfmsResult;
  resend: (appId: string) => PfmsResult;
  returnByPfmsAt: (appId: string, level: keyof typeof RETURN_LEVELS, reason: string) => PfmsResult;
  expireAtPfms: (appId: string) => PfmsResult;
  failCreditAtBank: (appId: string) => PfmsResult;
  /* Bureau */
  refreshMasters: () => void;
  setSchemeCode: (schemeCode: string, pfmsSchemeCode: string) => PfmsResult;
  /** Onboard a scheme by configuration (NFR §6.4): a name, its PFMS code if allotted, and its DDOs. */
  addScheme: (input: { name: string; pfmsSchemeCode: string; ddoCodes: string[] }) => PfmsResult;
  setSchemeHeads: (schemeCode: string, heads: HeadOfAccount[]) => PfmsResult;
  setSchemeDdos: (schemeCode: string, ddoCodes: string[]) => PfmsResult;
  backfill: (input: Omit<BackfilledAccount, "enteredBy" | "enteredAt">) => PfmsResult;
  retrofitHeads: (appId: string, heads: HeadLine[]) => PfmsResult;
  drawClaimReferences: (pdCode: string, financialYear: string) => PfmsResult;
  setErrorMessage: (code: string, message: string | null) => void;
  setDesignation: (ddoCode: string, patch: Partial<Pick<Designation, "maker" | "checker" | "certificateSerial" | "certificateExpires">>) => PfmsResult;
  pullReleaseFeed: () => void;
  setAgeingThreshold: (days: number) => void;
  /* NGO */
  setPayeeCode: (accountId: string, projectId: string, payeeCode: string) => PfmsResult;
}

const PfmsContext = React.createContext<PfmsContextValue | null>(null);

function storage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Does a stored copy still describe the main store it sits beside? If not, it is reseeded. */
function consistentWith(p: PfmsState, main: EAnudaanState): boolean {
  if (p?.version !== PFMS_SCHEMA_VERSION || !Array.isArray(p.advices)) return false;
  return p.advices.every((a) => {
    const app = main.applications.find((x) => x.id === a.appId);
    if (!app?.sanction) return false;
    const paid = stageOf(a) === "paid" || stageOf(a) === "closed";
    return paid === !!app.release;
  });
}

let seq = 0;

export function PfmsProvider({ children }: { children: React.ReactNode }) {
  const { state: main, hydrated: mainHydrated, recordPfmsCredit } = useEAnudaan();
  const { toast } = useToast();
  // Seeded on the seed clock so the server and the first client render agree; re-seeded on the
  // real clock at hydration, where master-data freshness and "waiting to resend" need real time.
  const [pfms, setPfms] = React.useState<PfmsState>(() => buildPfmsSeed(main, SEED_NOW));
  const [hydrated, setHydrated] = React.useState(false);
  const [demo, setDemoState] = React.useState<PfmsDemo>({ next: "accept", certificate: "ok" });
  React.useEffect(() => {
    try {
      window.sessionStorage.setItem(PFMS_DEMO_KEY, JSON.stringify(demo));
    } catch {
      /* the dock falls back to showing the defaults */
    }
    window.dispatchEvent(new Event(PFMS_CHANGED_EVENT));
  }, [demo]);
  const ref = React.useRef(pfms);
  const mainRef = React.useRef(main);
  // Callbacks read the main store through this ref; it follows every render's copy.
  React.useEffect(() => {
    mainRef.current = main;
  }, [main]);

  const adopt = React.useCallback((next: PfmsState) => {
    ref.current = next;
    setPfms(next);
  }, []);

  const write = React.useCallback(
    (next: PfmsState) => {
      adopt(next);
      try {
        storage()?.setItem(PFMS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        toast("This change could not be saved on this device.", "error");
      }
      window.dispatchEvent(new Event(PFMS_CHANGED_EVENT));
    },
    [adopt, toast],
  );

  React.useEffect(() => {
    if (!mainHydrated) return;
    const s = storage();
    let stored: PfmsState | null = null;
    try {
      stored = s ? (JSON.parse(s.getItem(PFMS_STORAGE_KEY) ?? "null") as PfmsState | null) : null;
    } catch {
      stored = null;
    }
    if (stored && consistentWith(stored, mainRef.current)) adopt(stored);
    else write(buildPfmsSeed(mainRef.current, new Date().toISOString()));
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== PFMS_STORAGE_KEY || !e.newValue) return;
      try {
        adopt(JSON.parse(e.newValue) as PfmsState);
      } catch {
        /* a half-written copy from another tab; the next write will carry the whole one */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [mainHydrated, adopt, write]);

  const value = React.useMemo<PfmsContextValue>(() => {
    const now = () => new Date().toISOString();
    const role = (): RoleId | null => mainRef.current.session;
    const find = (appId: string) => ref.current.advices.find((a) => a.appId === appId);
    const put = (advice: PaymentAdvice, extra?: Partial<PfmsState>): PfmsResult => {
      const cur = ref.current;
      const exists = cur.advices.some((a) => a.appId === advice.appId);
      write({ ...cur, ...extra, advices: exists ? cur.advices.map((a) => (a.appId === advice.appId ? advice : a)) : [...cur.advices, advice] });
      return { ok: true, advice };
    };
    const ctx = () => ({ masters: ref.current.masters, configs: ref.current.configs, now: now() });
    const ids = () => ({
      utr: () => `SBIN${now().slice(2, 10).replace(/-/g, "")}${String(Date.now() % 1_000_000).padStart(6, "0")}${++seq}`,
      token: () => `T${String(Date.now() % 1_000_000).padStart(6, "0")}`,
      voucher: () => `V${String(Date.now() % 100_000).padStart(5, "0")}`,
    });
    const uid = () => `EANU${now().slice(0, 10).replace(/-/g, "")}${String(Date.now() % 1_000_000).padStart(6, "0")}${++seq}`;

    /** A credit reaches the main store — the one event that tells the NGO (FR-NTF-001). */
    const deliverCredit = (advice: PaymentAdvice) => {
      const req = latestRequest(advice)!;
      const res = recordPfmsCredit(advice.appId, {
        amount: req.payments.reduce((s, p) => s + p.amount, 0),
        at: `${req.payments[0]!.scrollDate}T${now().slice(11)}`,
        utr: req.payments.map((p) => p.utr).join(", "),
        authorisedBy: advice.signature?.by ?? "pd-checker",
      });
      if (!res.ok) toast(res.error, "error");
    };

    return {
      pfms,
      hydrated,
      demo,
      setDemo: (d) => setDemoState((cur) => ({ ...cur, ...d })),
      now,

      openAdvice: (appId) => {
        const existing = find(appId);
        if (existing) return { ok: true, advice: existing };
        const who = role();
        if (!who || !ROLES[who].caps.includes("prepareAdvice")) return { ok: false, error: "Only the Maker prepares a payment advice." };
        const app = mainRef.current.applications.find((a) => a.id === appId);
        if (!app?.sanction) return { ok: false, error: "A payment advice is prepared only against a sanction order." };
        if (app.release) return { ok: false, error: "This grant has already been paid." };
        const payee = payeeFor(mainRef.current, ref.current, app);
        if (typeof payee === "string") return { ok: false, error: "This file is on hold until the NGO's bank details and payee code are on record." };
        const cur = ref.current;
        const advice = createAdvice({
          id: `PA/${app.financialYear}/${String(cur.advices.length + 1 + cur.seq).padStart(5, "0")}`,
          appId,
          schemeCode: app.schemeCode,
          financialYear: app.financialYear,
          sanctionAmount: app.sanction.total,
          beneficiary: payee,
          maker: who,
          now: now(),
          configs: cur.configs,
        });
        // A DDO already chosen (a scheme with one DDO) gets its bill number at once (FR-PDM-005).
        const withBill = advice.header.ddoCode ? { ...advice, header: { ...advice.header, billNumber: nextBillNumber(everyAdvice(cur.advices), advice.header.ddoCode, advice.financialYear) } } : advice;
        return put(withBill, { seq: cur.seq + 1 });
      },

      saveAdvice: (appId, patch) => {
        const a = find(appId);
        const who = role();
        if (!a || !who) return { ok: false, error: "Payment advice not found." };
        if (!ROLES[who].caps.includes("prepareAdvice")) return { ok: false, error: "Only the Maker edits a payment advice." };
        // A changed DDO takes a fresh bill number from its own series; the old number is released.
        let header = patch.header;
        if (header && header.ddoCode && header.ddoCode !== a.header.ddoCode) {
          header = { ...header, billNumber: nextBillNumber(everyAdvice(ref.current.advices).filter((x) => x !== a), header.ddoCode, a.financialYear), pdCode: header.pdCode };
        }
        const res = saveDraft(a, { ...patch, ...(header ? { header } : {}) }, who, now());
        if (!res.ok) return res;
        return put(res.advice);
      },

      submit: (appId) => {
        const a = find(appId);
        const who = role();
        if (!a || !who) return { ok: false, error: "Payment advice not found." };
        const res = submitAdvice(a, who, ctx(), ref.current.pool, usedClaimReferences(ref.current.advices.filter((x) => x.appId !== appId)));
        if (!res.ok) return res;
        return put(res.advice);
      },

      startFresh: (appId) => {
        const a = find(appId);
        const who = role();
        if (!a || !who) return { ok: false, error: "Payment advice not found." };
        if (!ROLES[who].caps.includes("prepareAdvice")) return { ok: false, error: "Only the Maker starts a fresh payment advice." };
        const app = mainRef.current.applications.find((x) => x.id === appId);
        if (!app) return { ok: false, error: "Application not found." };
        const payee = payeeFor(mainRef.current, ref.current, app);
        if (typeof payee === "string") return { ok: false, error: "This file is on hold until the NGO's bank details and payee code are on record." };
        const cur = ref.current;
        const id = `PA/${app.financialYear}/${String(cur.advices.length + 1 + cur.seq).padStart(5, "0")}`;
        const billNumber = a.header.ddoCode ? nextBillNumber(everyAdvice(cur.advices), a.header.ddoCode, a.financialYear) : "";
        const res = restartAdvice(a, { id, beneficiary: payee, billNumber, maker: who, now: now() });
        if (!res.ok) return res;
        return put(res.advice, { seq: cur.seq + 1 });
      },

      returnToMaker: (appId, remark) => {
        const a = find(appId);
        const who = role();
        if (!a || !who) return { ok: false, error: "Payment advice not found." };
        if (!ROLES[who].caps.includes("authoriseAdvice")) return { ok: false, error: "Only the Checker returns a payment advice." };
        const res = returnAdvice(a, who, remark, now());
        if (!res.ok) return res;
        return put(res.advice);
      },

      checkCertificate: (appId) => {
        const a = find(appId);
        const who = role();
        if (!a || !who) return "not-designated";
        return certificateCheck(a, who, ref.current.designations, now(), demo.certificate);
      },

      signAndSend: (appId) => {
        const a = find(appId);
        const who = role();
        if (!a || !who) return { ok: false, error: "Payment advice not found." };
        const check = certificateCheck(a, who, ref.current.designations, now(), demo.certificate);
        if (check !== "ok") return { ok: false, error: "The advice was not signed." };
        const d = ref.current.designations.find((x) => x.ddoCode === a.header.ddoCode)!;
        const signature = { by: who, personName: ROLES[who].personName, at: now(), certificateSerial: d.certificateSerial };
        const res = authoriseAndTransmit(a, signature, uid(), simulateTransmit(demo.next), now());
        if (!res.ok) return res;
        // A forced outcome applies once, as a real one-off failure would.
        setDemoState((cur) => ({ ...cur, next: "accept" }));
        // ERRSNC44: the bill number is regenerated for the resubmission (§8.5, BR-SNC-004).
        const dup = res.advice.issues.some((i) => i.pfmsCode === "ERRSNC44");
        const fixed = dup
          ? { ...res.advice, header: { ...res.advice.header, billNumber: nextBillNumber(everyAdvice(ref.current.advices), a.header.ddoCode, a.financialYear, [a.header.billNumber]) } }
          : res.advice;
        return put(fixed);
      },

      advance: (appId) => {
        const a = find(appId);
        if (!a) return { ok: false, error: "Payment advice not found." };
        const res = advanceRequest(a, now(), ids());
        if ("error" in res) return { ok: false, error: res.error };
        const out = put(res.advice);
        if (res.credited) deliverCredit(res.advice);
        return out;
      },

      returnAndCancelAtPfms: (appId, reason) => {
        const a = find(appId);
        if (!a) return { ok: false, error: "Payment advice not found." };
        const res = returnAndCancel(a, reason, now());
        if ("error" in res) return { ok: false, error: res.error };
        return put(res.advice);
      },

      resend: (appId) => {
        const a = find(appId);
        if (!a) return { ok: false, error: "Payment advice not found." };
        const res = resendQueued(a, now(), uid());
        if ("error" in res) return { ok: false, error: res.error };
        return put(res.advice);
      },

      returnByPfmsAt: (appId, level, reason) => {
        const a = find(appId);
        if (!a) return { ok: false, error: "Payment advice not found." };
        const res = returnByPfms(a, level, reason, now());
        if ("error" in res) return { ok: false, error: res.error };
        return put(res.advice);
      },

      expireAtPfms: (appId) => {
        const a = find(appId);
        if (!a) return { ok: false, error: "Payment advice not found." };
        const res = expireFinancialYear(a, now());
        if ("error" in res) return { ok: false, error: res.error };
        return put(res.advice);
      },

      failCreditAtBank: (appId) => {
        const a = find(appId);
        if (!a) return { ok: false, error: "Payment advice not found." };
        const res = failCredit(a, now());
        if ("error" in res) return { ok: false, error: res.error };
        return put(res.advice);
      },

      refreshMasters: () => write({ ...ref.current, masters: { ...ref.current.masters, syncedAt: now() } }),

      setSchemeCode: (schemeCode, code) => {
        if (!/^\d{3,5}$/.test(code)) return { ok: false, error: "Enter the numeric PFMS scheme code PFMS allotted, for example 3817." };
        write({ ...ref.current, configs: ref.current.configs.map((c) => (c.schemeCode === schemeCode ? { ...c, pfmsSchemeCode: code } : c)) });
        return { ok: true };
      },

      addScheme: ({ name, pfmsSchemeCode, ddoCodes }) => {
        const title = name.trim();
        if (!title) return { ok: false, error: "Enter the scheme's name." };
        const code = pfmsSchemeCode.trim();
        if (code && !/^\d{3,5}$/.test(code)) return { ok: false, error: "Enter the numeric PFMS scheme code PFMS allotted, for example 3817, or leave it blank until it is allotted." };
        if (ddoCodes.length === 0) return { ok: false, error: "Choose at least one DDO that pays this scheme." };
        const schemeCode = schemeCodeFor(title);
        const taken = ref.current.configs.some((c) => c.schemeCode === schemeCode || (c.name ?? "").toLowerCase() === title.toLowerCase());
        if (taken) return { ok: false, error: "A scheme with this name is already set up." };
        write({ ...ref.current, configs: [...ref.current.configs, { schemeCode, name: title, pfmsSchemeCode: code || null, heads: [], ddoCodes }] });
        return { ok: true };
      },

      setSchemeHeads: (schemeCode, heads) => {
        write({ ...ref.current, configs: ref.current.configs.map((c) => (c.schemeCode === schemeCode ? { ...c, heads } : c)) });
        return { ok: true };
      },

      setSchemeDdos: (schemeCode, ddoCodes) => {
        if (ddoCodes.length === 0) return { ok: false, error: "A scheme needs at least one DDO." };
        write({ ...ref.current, configs: ref.current.configs.map((c) => (c.schemeCode === schemeCode ? { ...c, ddoCodes } : c)) });
        return { ok: true };
      },

      backfill: (input) => {
        const who = role();
        if (!who) return { ok: false, error: "You are not signed in." };
        const rec: BackfilledAccount = { ...input, enteredBy: who, enteredAt: now() };
        write({ ...ref.current, backfilled: [...ref.current.backfilled.filter((b) => b.projectId !== input.projectId), rec] });
        return { ok: true };
      },

      retrofitHeads: (appId, heads) => {
        const a = find(appId);
        if (!a) return { ok: false, error: "Payment advice not found." };
        if (!isEditable(a)) return { ok: false, error: "This advice has left the Maker; its heads can no longer be changed here." };
        return put({ ...a, heads, updatedAt: now(), history: [...a.history, { at: now(), kind: "saved", by: role() ?? undefined, text: "Coded head of account retrofitted by the Bureau." }] });
      },

      drawClaimReferences: (pdCode, financialYear) => {
        const batch = drawBatch(ref.current.pool, pdCode, financialYear, 25, now());
        write({ ...ref.current, pool: [...ref.current.pool, batch] });
        return { ok: true };
      },

      setErrorMessage: (code, message) => {
        const next = { ...ref.current.errorOverrides };
        if (message && message.trim()) next[code] = message.trim();
        else delete next[code];
        write({ ...ref.current, errorOverrides: next });
      },

      setDesignation: (ddoCode, patch) => {
        if (patch.maker && patch.checker && patch.maker === patch.checker) return { ok: false, error: "The Maker and the Checker must be different officers." };
        const cur = ref.current.designations.find((d) => d.ddoCode === ddoCode);
        if (!cur) return { ok: false, error: "DDO not found." };
        const next = { ...cur, ...patch, designatedBy: role() ?? cur.designatedBy, designatedAt: now() };
        if (next.maker === next.checker) return { ok: false, error: "The Maker and the Checker must be different officers." };
        write({ ...ref.current, designations: ref.current.designations.map((d) => (d.ddoCode === ddoCode ? next : d)) });
        return { ok: true };
      },

      pullReleaseFeed: () => {
        const cur = ref.current;
        const have = new Set(cur.feed.map((f) => f.uniqueIdentifier));
        const added = cur.advices
          .map((a) => latestRequest(a))
          .filter((r): r is NonNullable<typeof r> => !!r && r.payments.length > 0 && r.payments.every((p) => p.utr) && !have.has(r.uniqueIdentifier))
          .map((r) => ({ uniqueIdentifier: r.uniqueIdentifier, amount: r.payments.reduce((s, p) => s + p.amount, 0), utr: r.payments[0]!.utr!, date: r.payments[0]!.scrollDate! }));
        write({ ...cur, feed: [...cur.feed, ...added], feedPulledAt: now() });
      },

      setAgeingThreshold: (days) => write({ ...ref.current, ageingThresholdDays: Math.max(1, Math.round(days)) }),

      setPayeeCode: (accountId, projectId, payeeCode) => {
        const code = payeeCode.trim().toUpperCase();
        if (!/^[A-Z]{2}[0-9]{10}$/.test(code)) return { ok: false, error: "Enter the PFMS payee code as it appears on your PFMS registration: two letters and ten digits." };
        const rec = { accountId, projectId, payeeCode: code, source: "ngo" as const, confirmedAt: now() };
        write({ ...ref.current, payees: [...ref.current.payees.filter((p) => p.accountId !== accountId), rec] });
        return { ok: true };
      },
    };
  }, [pfms, hydrated, demo, write, recordPfmsCredit, toast]);

  const valueRef = React.useRef(value);
  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);
  React.useEffect(() => {
    const on = (e: Event) => {
      const cmd = (e as CustomEvent<PfmsDemoCommand>).detail;
      const v = valueRef.current;
      let res: PfmsResult = { ok: true };
      if (cmd.kind === "set") v.setDemo(cmd.demo);
      else if (cmd.kind === "advance") res = v.advance(cmd.appId);
      else if (cmd.kind === "resend") res = v.resend(cmd.appId);
      else if (cmd.kind === "cancel") res = v.returnAndCancelAtPfms(cmd.appId, cmd.reason);
      else if (cmd.kind === "return-pfms") res = v.returnByPfmsAt(cmd.appId, cmd.level, cmd.reason);
      else if (cmd.kind === "expire") res = v.expireAtPfms(cmd.appId);
      else if (cmd.kind === "fail-credit") res = v.failCreditAtBank(cmd.appId);
      else if (cmd.kind === "reset") write(buildPfmsSeed(mainRef.current, new Date().toISOString()));
      if (!res.ok) toast(res.error, "error");
    };
    window.addEventListener(PFMS_DEMO_EVENT, on);
    return () => window.removeEventListener(PFMS_DEMO_EVENT, on);
  }, [write, toast]);

  return <PfmsContext.Provider value={value}>{children}</PfmsContext.Provider>;
}

export function usePfms(): PfmsContextValue {
  const ctx = React.useContext(PfmsContext);
  if (!ctx) throw new Error("usePfms must be used inside PfmsProvider");
  return ctx;
}
