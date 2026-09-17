/**
 * The store's writes: whether they landed (S03), whose copy they land on (S02), which role
 * "Mark All as Read" touches (S07), and whether the seed fits the browser at all.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { buildSeed, SEED_SCHEMES } from "./store/seed.ts";
import {
  SAVE_FAILED_MESSAGE,
  STORAGE_KEY,
  commitChange,
  isReadBy,
  markAllReadFor,
  markReadFor,
  migrateFrom8,
  migrateFrom11,
  readPersisted,
  writePersisted,
  type StorageLike,
} from "./store/persistence.ts";
import { fileApplication } from "./submit-application.ts";
import type { EAnudaanState } from "./types.ts";

const V = 9;
const seed = (): EAnudaanState => ({ version: V, session: "ngo", schemes: SEED_SCHEMES, ...buildSeed() });
const clock = { now: "2026-09-14T10:00:00.000Z", id: (p: string) => `${p}-t-${Math.random().toString(36).slice(2, 7)}` };

class MemoryStorage implements StorageLike {
  map = new Map<string, string>();
  /** Characters the storage may hold in total; a write past it throws, as a full browser does. */
  quota: number;
  constructor(quota = Number.POSITIVE_INFINITY) {
    this.quota = quota;
  }
  getItem(k: string) {
    return this.map.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    const used = [...this.map].reduce((n, [key, val]) => n + (key === k ? 0 : key.length + val.length), 0);
    if (used + k.length + v.length > this.quota) throw new DOMException("The quota has been exceeded.", "QuotaExceededError");
    this.map.set(k, v);
  }
}

const submit = (s: EAnudaanState) =>
  fileApplication(s, { schemeCode: "AVYAY", financialYear: "2026-27", values: { fld_grant_recurring: "250000", fld_grant_non_recurring: "250000" } }, clock).state;

test("S03: a change that cannot be written is not applied, and says why", () => {
  const base = seed();
  const size = JSON.stringify({ ...base, rev: 0 }).length + STORAGE_KEY.length;
  const storage = new MemoryStorage(size + 50); // room for the store, not for an application more
  assert.equal(writePersisted(storage, STORAGE_KEY, base, 0).ok, true);

  const res = commitChange(storage, STORAGE_KEY, V, base, 0, submit);
  assert.equal(res.ok, false);
  if (!res.ok) assert.equal(res.error, SAVE_FAILED_MESSAGE);
  // What the device holds is unchanged: after a refresh the register is what it was.
  assert.equal(readPersisted(storage.getItem(STORAGE_KEY), V)!.state.applications.length, base.applications.length);
});

test("S03: a change that is written is applied and moves the revision on", () => {
  const base = seed();
  const storage = new MemoryStorage();
  writePersisted(storage, STORAGE_KEY, base, 3);
  const res = commitChange(storage, STORAGE_KEY, V, base, 3, submit);
  assert.equal(res.ok, true);
  if (res.ok) {
    assert.equal(res.rev, 4);
    assert.equal(res.rebased, false);
    assert.equal(res.state.applications.length, base.applications.length + 1);
  }
  assert.equal(readPersisted(storage.getItem(STORAGE_KEY), V)!.rev, 4);
});

test("S02: a stale tab's change lands on the newer copy instead of replacing it", () => {
  const storage = new MemoryStorage();
  const original = seed();
  writePersisted(storage, STORAGE_KEY, original, 1);

  // Tab B submits an application.
  const tabB = commitChange(storage, STORAGE_KEY, V, { ...original, session: "ngo" }, 1, submit);
  assert.equal(tabB.ok, true);
  const newId = tabB.ok ? tabB.state.applications[0]!.id : "";

  // Tab A, still holding revision 1 and signed in as an officer, marks its notifications read.
  const tabA = { ...original, session: "pd-aso" as const };
  const res = commitChange(storage, STORAGE_KEY, V, tabA, 1, (s) => ({ ...s, notifications: markAllReadFor(s.notifications, s.session) }));
  assert.equal(res.ok, true);
  if (res.ok) {
    assert.equal(res.rebased, true, "the tab is told its copy was out of date");
    assert.equal(res.rev, 3);
    assert.equal(res.state.session, "pd-aso", "adopting the newer copy does not sign the tab in as someone else");
    assert.ok(res.state.applications.some((a) => a.id === newId), "the other tab's application survives");
  }
  const stored = readPersisted(storage.getItem(STORAGE_KEY), V)!;
  assert.ok(stored.state.applications.some((a) => a.id === newId));
});

test("S02: a copy written before revisions existed reads as revision 0", () => {
  const raw = JSON.stringify(seed());
  assert.equal(readPersisted(raw, V)!.rev, 0);
  assert.equal(readPersisted(raw, V + 1), null, "an older shape is not read");
  assert.equal(readPersisted("{not json", V), null);
});

const notice = (id: string, audience: EAnudaanState["notifications"][number]["audience"]): EAnudaanState["notifications"][number] => ({
  id,
  at: "",
  title: "",
  body: "",
  audience,
  readBy: [],
});

test("S07: Mark All as Read marks only the pressing role's notifications", () => {
  const list = [notice("a", ["ngo"]), notice("b", ["pd-aso"]), notice("c", ["pd-aso", "pd-so"]), notice("d", ["programme-director"])];
  const after = markAllReadFor(list, "pd-aso");
  assert.deepEqual(after.map((x) => [x.id, isReadBy(x, "pd-aso")]), [["a", false], ["b", true], ["c", true], ["d", false]]);
  assert.deepEqual(markAllReadFor(list, null).map((x) => x.readBy), [[], [], [], []]);
});

test("read state is per role: a notice to the applicant and an officer stays new for the one who has not read it", () => {
  const list = [notice("shared", ["pd-so", "ngo"]), notice("mine", ["ngo"])];
  // The applicant presses Mark All as Read.
  const afterNgo = markAllReadFor(list, "ngo");
  assert.equal(isReadBy(afterNgo[0]!, "ngo"), true);
  assert.equal(isReadBy(afterNgo[0]!, "pd-so"), false, "the Section Officer still sees it as new");
  assert.equal(afterNgo.filter((n) => n.audience.includes("pd-so") && !isReadBy(n, "pd-so")).length, 1, "and it still counts as unread for them");
  // The officer opens that one notice; pressing again changes nothing.
  const afterSo = markReadFor(afterNgo, "shared", "pd-so");
  assert.deepEqual(afterSo[0]!.readBy, ["ngo", "pd-so"]);
  assert.deepEqual(markAllReadFor(afterSo, "ngo"), afterSo);
  // A role outside the audience cannot mark it, and nobody signed in has read nothing.
  assert.deepEqual(markReadFor(list, "mine", "pd-so")[1]!.readBy, []);
  assert.equal(isReadBy(afterSo[0]!, null), false);
});

test("a schema-8 copy is brought forward: read flags become per role, the applicant's work survives", () => {
  const fresh = seed();
  // A schema-8 device: one `read` flag per notice, an application filed by the applicant, and the
  // seed as it was before submitted reports carried a recommendation and certified files verdicts.
  const filed = submit(fresh);
  const v8 = JSON.parse(JSON.stringify({ ...filed, version: 8, rev: 7 }));
  v8.notifications = v8.notifications.map(({ readBy, ...n }: { readBy: string[] }) => ({ ...n, read: readBy.length > 0 }));
  const insp = v8.inspections.find((i: { status: string }) => i.status === "Submitted");
  delete insp.recommendation;
  const certified = v8.applications.find((a: { certifiedAt?: string }) => a.certifiedAt);
  for (const d of certified.documents) {
    d.reviewStatus = "Pending";
    delete d.reviewedBy;
    delete d.reviewedAt;
  }
  const raw = JSON.stringify(v8);

  assert.equal(readPersisted(raw, V), null, "without a migration an older shape is not read");
  const got = readPersisted(raw, V, (old) => migrateFrom8(old, fresh))!;
  assert.equal(got.migrated, true);
  assert.equal(got.rev, 7);
  assert.equal(got.state.version, V);
  assert.equal(got.state.applications.length, filed.applications.length, "the application filed on the device is kept");
  for (const n of got.state.notifications) {
    const before = v8.notifications.find((x: { id: string }) => x.id === n.id);
    assert.deepEqual(n.readBy, before.read ? n.audience : []);
    assert.equal("read" in n, false);
  }
  assert.equal(got.state.inspections.find((i) => i.id === insp.id)!.recommendation, fresh.inspections.find((i) => i.id === insp.id)!.recommendation);
  const docs = got.state.applications.find((a) => a.id === certified.id)!.documents;
  assert.ok(docs.every((d) => d.reviewStatus !== "Pending" && d.reviewedBy), "the certified file's documents carry their verdicts");

  // A verdict a user gave on the device is not overwritten by the seed's.
  const touched = JSON.parse(raw);
  touched.applications.find((a: { id: string }) => a.id === certified.id).documents[0].reviewStatus = "Deficient";
  const kept = migrateFrom8(touched, fresh)!;
  assert.equal(kept.applications.find((a) => a.id === certified.id)!.documents[0]!.reviewStatus, "Deficient");
  assert.equal(migrateFrom8({ ...touched, version: 7 }, fresh), null, "an older shape still reseeds");
});

test("the seeded store fits in the browser with room for the applicant's work", () => {
  // localStorage is shared by every portal on the origin (about 5 million characters in
  // Chromium). The seed was 2.78 million before it was slimmed, and about 1.58 million before the
  // certified files' 1,840 document verdicts gained who gave them and when (114,000 characters,
  // 14 Sep 2026), paid for in part by leaving the `reUploadedThisYear: false` flags off (61,000).
  // +64,000 on 16 Sep 2026 for three AVYAY projects with a sanctioned history, and +128,000 the same
  // day for three each under NAPDDR, SHRESHTA and SMILE (18 files, no document registers, a small
  // roster), and the release records that open each next instalment — without which a renewal had
  // nothing real to renew (review call C2, W1).
  // +12,000 on 16 Sep 2026 for the answers a submitted file owes (bank, PFMS and which claim it is)
  // and +5,800 for the CCTV registered at each project, which used to sit in the NGO's own browser
  // where no officer could read it — the ceiling moved 1.90M → 1.91M for both (audit batch B8).
  // +12,800 on 17 Sep 2026 for five worked CCTV records (camera register, certificate, retention,
  // uptime declarations), one per compliance state an officer must be able to see — 1.91M → 1.925M.
  const size = JSON.stringify(seed()).length;
  assert.ok(size < 1_925_000, `seeded store is ${size.toLocaleString("en-IN")} characters`);
});

test("a schema-11 copy is carried to 12: the NGO's own CCTV setups kept, seeded ones given their register", () => {
  const fresh = seed();
  const detailed = fresh.cctv.find((c) => c.cameraRegister)!;
  // A schema-11 setup: the record without the fields schema 12 added.
  const plain = (c: (typeof fresh.cctv)[number]) => {
    const rest = { ...c };
    delete rest.cameraRegister;
    delete rest.certificate;
    delete rest.retentionDays;
    delete rest.storage;
    delete rest.uptime;
    return rest;
  };
  const mine = { ...plain(fresh.cctv[1]!), cameras: 8, savedAt: "2026-09-15T10:00:00.000Z" };
  const old = { ...fresh, version: 11, rev: 4, cctv: [plain(detailed), mine] };
  const got = migrateFrom11(old, fresh)!;
  assert.ok(got, "migrated");
  assert.deepEqual(got.cctv[0], detailed, "a still-seeded setup takes the worked record");
  assert.deepEqual(got.cctv[1], mine, "a setup the NGO saved is untouched");
  assert.equal(migrateFrom11({ ...old, version: 10 }, fresh), null);
  assert.equal("rev" in got, false);
});
