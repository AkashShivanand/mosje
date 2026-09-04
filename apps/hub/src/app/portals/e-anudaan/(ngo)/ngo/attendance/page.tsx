"use client";

/**
 * Weekly Attendance — the beneficiary & employee roster and a whole week of attendance.
 *
 * DS Audit: Tabs ✅ existing · Modal ✅ · FormField ✅ · Input ✅ · Select ✅ · Textarea ✅ ·
 * Button ✅ · Badge ✅ · Icon ✅ · EmptyState ✅ · useToast ✅ — nothing new.
 *
 * Three tabs, the week picker, the mark-all controls, the "Show N more" tail, both roster
 * tables and both create modals are transcribed from the live screen (walkthrough 2026-08-22).
 */

import * as React from "react";
import {
  Badge,
  Button,
  EmptyState,
  FormField,
  Icon,
  Input,
  Modal,
  Select,
  Tabs,
  Textarea,
  useToast, Checkbox } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ngoApplications } from "@/lib/e-anudaan/selectors";
import {
  CATEGORIES,
  GENDERS,
  ID_TYPES,
  WEEK_DAYS,
  buildBeneficiaries,
  formatWeekLabel,
  type Beneficiary,
  type Employee,
} from "@/lib/e-anudaan/roster";

const TABS = [
  { id: "week", label: "Weekly Attendance" },
  { id: "beneficiaries", label: "Beneficiaries" },
  { id: "employees", label: "Employees" },
];

const PAGE = 10;

export default function WeeklyAttendancePage() {
  const { state } = useEAnudaan();
  const { toast } = useToast();
  const idBase = React.useId();
  const ngo = state.ngos[0];

  const projects = React.useMemo(() => {
    if (!ngo) return [];
    const seen = new Map<string, string>();
    for (const a of ngoApplications(state, ngo.id)) {
      if (!seen.has(a.id)) seen.set(a.id, a.projectLabel);
    }
    return [...seen.entries()].map(([id, label]) => ({ id, label }));
  }, [state, ngo]);

  // Derived, not synced: an empty selection simply means "the first project".
  const [projectChoice, setProjectChoice] = React.useState("");
  const project = projectChoice || projects[0]?.id || "";
  const setProject = setProjectChoice;
  const [tab, setTab] = React.useState(0);

  const [beneficiaries, setBeneficiaries] = React.useState<Beneficiary[]>(() => buildBeneficiaries());
  const [employees, setEmployees] = React.useState<Employee[]>([]);

  const activeBeneficiaries = beneficiaries.filter((b) => b.active);
  const inactiveBeneficiaries = beneficiaries.filter((b) => !b.active);
  const activeEmployees = employees.filter((e) => e.active);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-headline-1 text-ink">Attendance</h1>
        <p className="mt-1 text-body-2 text-ink-muted">
          Maintain your beneficiary &amp; employee roster and submit a whole week of attendance at
          once.
        </p>
      </header>

      <FormField label="Scheme / Project" id="attendance-project">
        {(control) => (
          <Select {...control} value={project} onChange={(e) => setProject(e.target.value)}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <Tabs tabs={TABS} active={tab} onChange={setTab} idBase={idBase} ariaLabel="Attendance sections" />

      {tab === 0 && (
        <WeekGrid
          beneficiaries={activeBeneficiaries}
          employees={activeEmployees}
          onSubmit={() => toast("Week submitted.", "success")}
        />
      )}

      {tab === 1 && (
        <BeneficiaryRoster
          active={activeBeneficiaries}
          inactive={inactiveBeneficiaries}
          onAdd={(b) => setBeneficiaries((prev) => [...prev, b])}
          onToggle={(id) =>
            setBeneficiaries((prev) => prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b)))
          }
        />
      )}

      {tab === 2 && (
        <EmployeeRoster
          employees={activeEmployees}
          onAdd={(e) => setEmployees((prev) => [...prev, e])}
          onToggle={(id) =>
            setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e)))
          }
        />
      )}
    </div>
  );
}

/* ── Tab 1 — the week grid ────────────────────────────────────────────────── */

function WeekGrid({
  beneficiaries,
  employees,
  onSubmit,
}: {
  beneficiaries: Beneficiary[];
  employees: Employee[];
  onSubmit: () => void;
}) {
  const [anyDay, setAnyDay] = React.useState(() => new Date().toISOString().slice(0, 10));

  const [who, setWho] = React.useState<"beneficiaries" | "employees">("beneficiaries");
  const [shown, setShown] = React.useState(PAGE);
  const [marks, setMarks] = React.useState<Record<string, boolean>>({});

  const people = who === "beneficiaries" ? beneficiaries : employees;
  const visible = people.slice(0, shown);
  const hidden = people.length - visible.length;

  const key = (personId: string, day: string) => `${personId}:${day}`;

  const markAll = (present: boolean) => {
    const next: Record<string, boolean> = { ...marks };
    for (const p of people) for (const d of WEEK_DAYS) next[key(p.id, d)] = present;
    setMarks(next);
  };

  return (
    <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-[14rem]">
          <FormField label="Pick any day in the week" id="week-day">
            {(control) => (
              <Input {...control} type="date" value={anyDay} onChange={(e) => setAnyDay(e.target.value)} />
            )}
          </FormField>
          <p className="mt-1 text-body-2 font-semibold text-ink">
            {formatWeekLabel(new Date(anyDay))}
          </p>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Roster to mark">
          <Button
            appearance={who === "beneficiaries" ? "filled" : "outlined"}
            size="sm"
            onClick={() => {
              setWho("beneficiaries");
              setShown(PAGE);
            }}
          >
            Beneficiaries ({beneficiaries.length})
          </Button>
          <Button
            appearance={who === "employees" ? "filled" : "outlined"}
            size="sm"
            onClick={() => {
              setWho("employees");
              setShown(PAGE);
            }}
          >
            Employees ({employees.length})
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button appearance="outlined" size="sm" onClick={() => markAll(true)}>
          <Icon name="check" size={16} aria-hidden /> Mark all Present
        </Button>
        <Button appearance="outlined" size="sm" onClick={() => markAll(false)}>
          Mark all Absent
        </Button>
        <span className="flex items-center gap-1.5 text-body-3 text-ink-muted">
          <span className="inline-block h-3 w-3 rounded-sm border border-line bg-status-success/70" aria-hidden />
          Present
          <span className="ml-3 inline-block h-3 w-3 rounded-sm border border-line bg-surface" aria-hidden />
          Absent
        </span>
      </div>

      {people.length === 0 ? (
        <EmptyState
          title={`No ${who} yet`}
          description={`Add ${who} on the ${who === "beneficiaries" ? "Beneficiaries" : "Employees"} tab before marking a week.`}
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[38rem] text-body-2">
              <caption className="sr-only">Weekly attendance grid</caption>
              <thead>
                <tr className="border-b border-line text-left text-label-3 uppercase text-ink-muted">
                  <th scope="col" className="pb-2 pr-3 font-medium">Name</th>
                  {WEEK_DAYS.map((d) => (
                    <th key={d} scope="col" className="pb-2 pr-3 font-medium">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id} className="border-b border-line">
                    <td className="py-2 pr-3 text-ink">{p.name}</td>
                    {WEEK_DAYS.map((d) => (
                      <td key={d} className="py-2 pr-3">
                        <Checkbox
                          size="sm"
                          hideLabel
                          label={`${p.name} present on ${d}`}
                          checked={marks[key(p.id, d)] ?? false}
                          onCheckedChange={(on) => setMarks({ ...marks, [key(p.id, d)]: on })}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hidden > 0 && (
            <Button appearance="text" size="sm" onClick={() => setShown((s) => s + PAGE)}>
              Show {Math.min(PAGE, hidden)} more — {hidden} of {people.length} not shown
            </Button>
          )}

          <div>
            <Button onClick={onSubmit}>Submit Week</Button>
          </div>
        </>
      )}
    </section>
  );
}

/* ── Tab 2 — beneficiaries ────────────────────────────────────────────────── */

function BeneficiaryRoster({
  active,
  inactive,
  onAdd,
  onToggle,
}: {
  active: Beneficiary[];
  inactive: Beneficiary[];
  onAdd: (b: Beneficiary) => void;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [showInactive, setShowInactive] = React.useState(false);

  return (
    <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-2 text-ink-muted">
          <strong className="text-ink">{active.length} active beneficiaries</strong> · {inactive.length} deactivated
        </p>
        <Button appearance="outlined" onClick={() => setOpen(true)}>
          <Icon name="add" size={16} aria-hidden /> Add Beneficiary
        </Button>
      </div>

      <RosterTable rows={active.slice(0, 25)} onToggle={onToggle} actionLabel="Deactivate" />

      {inactive.length > 0 && (
        <>
          <Button appearance="text" size="sm" onClick={() => setShowInactive(!showInactive)} aria-expanded={showInactive}>
            <Icon name={showInactive ? "expand_less" : "expand_more"} size={16} aria-hidden />
            Deactivated beneficiaries ({inactive.length})
          </Button>
          {showInactive && <RosterTable rows={inactive} onToggle={onToggle} actionLabel="Reactivate" />}
        </>
      )}

      <AddBeneficiaryModal open={open} onClose={() => setOpen(false)} onCreate={onAdd} />
    </section>
  );
}

function RosterTable({
  rows,
  onToggle,
  actionLabel,
}: {
  rows: Beneficiary[];
  onToggle: (id: string) => void;
  actionLabel: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[52rem] text-body-2">
        <caption className="sr-only">Beneficiary roster</caption>
        <thead>
          <tr className="border-b border-line text-left text-label-3 uppercase text-ink-muted">
            {["Full Name", "Gender", "Category", "ID Type", "ID Number", "Mobile", "Date of Birth", "Parent / Guardian", "Status"].map((h) => (
              <th key={h} scope="col" className="pb-2 pr-3 font-medium">
                {h}
              </th>
            ))}
            <th scope="col" className="pb-2 font-medium"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} className="border-b border-line">
              <td className="py-2 pr-3 text-ink">{b.name}</td>
              <td className="py-2 pr-3 text-ink">{b.gender}</td>
              <td className="py-2 pr-3 text-ink">{b.category ?? "—"}</td>
              <td className="py-2 pr-3 text-ink">{b.idType}</td>
              <td className="py-2 pr-3 font-mono text-ink">{b.idNumber}</td>
              <td className="py-2 pr-3 text-ink">{b.mobile ?? "—"}</td>
              <td className="py-2 pr-3 text-ink">{b.dob ?? "—"}</td>
              <td className="py-2 pr-3 text-ink">{b.guardian ?? "—"}</td>
              <td className="py-2 pr-3">
                <Badge status={b.active ? "success" : "neutral"}>{b.active ? "Active" : "Inactive"}</Badge>
              </td>
              <td className="py-2">
                <div className="flex gap-1">
                  <Button appearance="text" size="sm">Edit</Button>
                  <Button appearance="text" size="sm" onClick={() => onToggle(b.id)}>
                    {actionLabel}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddBeneficiaryModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (b: Beneficiary) => void;
}) {
  const [f, setF] = React.useState({
    name: "", gender: "", category: "", idType: "", idNumber: "",
    mobile: "", dob: "", guardian: "", remarks: "",
  });

  const valid = f.name.trim() && f.gender && f.idType && f.idNumber.trim();

  const create = () => {
    if (!valid) return;
    onCreate({
      id: `ben-new-${Date.now()}`,
      name: f.name.trim(),
      gender: f.gender,
      category: f.category || undefined,
      idType: f.idType,
      idNumber: f.idNumber.trim(),
      mobile: f.mobile || undefined,
      dob: f.dob || undefined,
      guardian: f.guardian || undefined,
      remarks: f.remarks || undefined,
      active: true,
    });
    setF({ name: "", gender: "", category: "", idType: "", idNumber: "", mobile: "", dob: "", guardian: "", remarks: "" });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Beneficiary"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button appearance="outlined" onClick={onClose}>Cancel</Button>
          <Button onClick={create} disabled={!valid}>Create</Button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" id="ben-name" required>
          {(c) => <Input {...c} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
        </FormField>
        <FormField label="Gender" id="ben-gender" required>
          {(c) => (
            <Select {...c} value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value })}>
              <option value="">Select gender…</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          )}
        </FormField>
        <FormField label="Category (optional)" id="ben-category">
          {(c) => (
            <Select {...c} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
              <option value="">Select category…</option>
              {CATEGORIES.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          )}
        </FormField>
        <FormField label="ID Type" id="ben-idtype" required>
          {(c) => (
            <Select {...c} value={f.idType} onChange={(e) => setF({ ...f, idType: e.target.value })}>
              <option value="">Select id type…</option>
              {ID_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          )}
        </FormField>
        <FormField label="ID Number" id="ben-idnum" required>
          {(c) => <Input {...c} value={f.idNumber} onChange={(e) => setF({ ...f, idNumber: e.target.value })} />}
        </FormField>
        <FormField label="Mobile Number (optional)" id="ben-mobile">
          {(c) => <Input {...c} type="tel" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })} />}
        </FormField>
        <FormField label="Date of Birth (optional)" id="ben-dob">
          {(c) => <Input {...c} type="date" value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} />}
        </FormField>
        <FormField label="Parent / Guardian (optional)" id="ben-guardian">
          {(c) => <Input {...c} value={f.guardian} onChange={(e) => setF({ ...f, guardian: e.target.value })} />}
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Remarks (optional)" id="ben-remarks">
            {(c) => (
              <Textarea
                {...c}
                rows={2}
                maxLength={255}
                value={f.remarks}
                onChange={(e) => setF({ ...f, remarks: e.target.value })}
              />
            )}
          </FormField>
          <p className="mt-1 text-body-3 text-ink-hint">{f.remarks.length} / 255 characters</p>
        </div>
      </div>
    </Modal>
  );
}

/* ── Tab 3 — employees ────────────────────────────────────────────────────── */

function EmployeeRoster({
  employees,
  onAdd,
  onToggle,
}: {
  employees: Employee[];
  onAdd: (e: Employee) => void;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [f, setF] = React.useState({ name: "", designation: "", mobile: "" });

  const create = () => {
    if (!f.name.trim()) return;
    onAdd({
      id: `emp-${Date.now()}`,
      name: f.name.trim(),
      designation: f.designation || undefined,
      mobile: f.mobile || undefined,
      active: true,
    });
    setF({ name: "", designation: "", mobile: "" });
    setOpen(false);
  };

  return (
    <section className="space-y-4 rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-2 text-ink-muted">
          <strong className="text-ink">{employees.length} active employees</strong>
        </p>
        <Button appearance="outlined" onClick={() => setOpen(true)}>
          <Icon name="add" size={16} aria-hidden /> Add Employee
        </Button>
      </div>

      {employees.length === 0 ? (
        <EmptyState
          title="No employees yet"
          description={"Click “+ Add Employee” to get started."}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] text-body-2">
            <caption className="sr-only">Employee roster</caption>
            <thead>
              <tr className="border-b border-line text-left text-label-3 uppercase text-ink-muted">
                <th scope="col" className="pb-2 pr-3 font-medium">Full Name</th>
                <th scope="col" className="pb-2 pr-3 font-medium">Designation</th>
                <th scope="col" className="pb-2 pr-3 font-medium">Mobile</th>
                <th scope="col" className="pb-2 pr-3 font-medium">Status</th>
                <th scope="col" className="pb-2 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-b border-line">
                  <td className="py-2 pr-3 text-ink">{e.name}</td>
                  <td className="py-2 pr-3 text-ink">{e.designation ?? "—"}</td>
                  <td className="py-2 pr-3 text-ink">{e.mobile ?? "—"}</td>
                  <td className="py-2 pr-3"><Badge status="success">Active</Badge></td>
                  <td className="py-2">
                    <div className="flex gap-1">
                      <Button appearance="text" size="sm">Edit</Button>
                      <Button appearance="text" size="sm" onClick={() => onToggle(e.id)}>Deactivate</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Employee"
        footer={
          <div className="flex justify-end gap-2">
            <Button appearance="outlined" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create} disabled={!f.name.trim()}>Create</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Full Name" id="emp-name" required>
            {(c) => <Input {...c} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
          </FormField>
          <FormField label="Designation (optional)" id="emp-designation">
            {(c) => <Input {...c} value={f.designation} onChange={(e) => setF({ ...f, designation: e.target.value })} />}
          </FormField>
          <FormField label="Mobile Number (optional)" id="emp-mobile">
            {(c) => <Input {...c} type="tel" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value })} />}
          </FormField>
        </div>
      </Modal>
    </section>
  );
}
