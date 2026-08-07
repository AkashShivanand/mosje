"use client";

import * as React from "react";
import { PublicShell } from "@/components/nmba/public-shell";
import { STATES, STATE_DISTRICTS } from "@/lib/nmba/states";
import { useToast } from "@/components/nmba/toast";
import { Button, Checkbox, FormField, Icon, Input, Select } from "@mosje/design-system";

const QUALIFICATIONS = [
  "Below 10th",
  "10th Pass",
  "12th Pass",
  "Graduate",
  "Post Graduate",
  "Other",
];

const AFFILIATIONS = [
  "Student",
  "NGO / Voluntary Organisation",
  "Educational Institution",
  "Government Department",
  "Self / Individual",
  "Other",
];

const WHAT_MITRS_DO = [
  { icon: "campaign", text: "Spread awareness on the ill-effects of substance abuse" },
  { icon: "group", text: "Reach out to youth, families, and the community" },
  { icon: "verified_user", text: "Guide people toward de-addiction and rehabilitation services" },
];

function initialForm() {
  return {
    name: "",
    age: "",
    gender: "",
    mobile: "",
    email: "",
    qualification: "",
    affiliation: "",
    organisation: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
  };
}

export default function RegisterMitrPage() {
  const { toast } = useToast();
  const [form, setForm] = React.useState(initialForm);
  const [declared, setDeclared] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const districts = form.state ? (STATE_DISTRICTS[form.state] ?? []) : [];

  const set = (key: keyof ReturnType<typeof initialForm>, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!declared) {
      toast("Please confirm the declaration to continue.", "error");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      toast("Registration received. Thank you for volunteering!", "success");
    }, 700);
  };

  return (
    <PublicShell>
      <div className="max-w-3xl">
        {/* Intro */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brandwash text-navy">
            <Icon name="volunteer_activism" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">Register as Nasha Mukti Mitr</h1>
            <p className="text-sm text-ink-muted">
              Join as a community volunteer for a drug-free India
            </p>
          </div>
        </div>

        {/* Who is a Nasha Mukti Mitr */}
        <div className="mb-6 rounded-2xl border border-navy/20 bg-brandwash p-5">
          <h2 className="text-sm font-semibold text-navy">What does a Nasha Mukti Mitr do?</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {WHAT_MITRS_DO.map(({ icon: iconName, text }) => (
              <li key={text} className="flex items-start gap-2">
                <Icon name={iconName} size={16} className="mt-0.5 shrink-0 text-navy" aria-hidden />
                <span className="text-xs leading-relaxed text-ink">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {done ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
            <Icon name="check_circle" size={48} className="mx-auto text-green-600" aria-hidden />
            <p className="mt-3 text-lg font-semibold text-green-800">
              You&rsquo;re registered as a Nasha Mukti Mitr!
            </p>
            <p className="mx-auto mt-1 max-w-md text-sm text-green-700">
              Thank you, {form.name || "volunteer"}. Our team will reach out with volunteer
              materials and next steps. Together, towards a drug-free India.
            </p>
            <Button
              className="mt-5"
              appearance="outlined"
              onClick={() => {
                setForm(initialForm());
                setDeclared(false);
                setDone(false);
              }}
            >
              Register another volunteer
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-line bg-white p-6 shadow-card"
          >
            <h2 className="text-base font-semibold text-ink">Volunteer details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name" id="mitr-name" required>
                {(control) => (
                  <Input
                    {...control}
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                )}
              </FormField>

              <FormField label="Age" id="mitr-age" required>
                {(control) => (
                  <Input
                    {...control}
                    type="number"
                    required
                    min={12}
                    max={120}
                    value={form.age}
                    onChange={(e) => set("age", e.target.value)}
                    placeholder="Age"
                  />
                )}
              </FormField>

              <FormField label="Gender" id="mitr-gender" required>
                {(control) => (
                  <Select
                    {...control}
                    required
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                  </Select>
                )}
              </FormField>

              <FormField label="Mobile Number" id="mitr-mobile" required>
                {(control) => (
                  <Input
                    {...control}
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={form.mobile}
                    onChange={(e) => set("mobile", e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                )}
              </FormField>

              <FormField label="Email Address" id="mitr-email" required>
                {(control) => (
                  <Input
                    {...control}
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                )}
              </FormField>

              <FormField label="Highest Qualification" id="mitr-qual" required>
                {(control) => (
                  <Select
                    {...control}
                    required
                    value={form.qualification}
                    onChange={(e) => set("qualification", e.target.value)}
                  >
                    <option value="">Select Qualification</option>
                    {QUALIFICATIONS.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>

              <FormField label="Affiliation" id="mitr-affiliation" required>
                {(control) => (
                  <Select
                    {...control}
                    required
                    value={form.affiliation}
                    onChange={(e) => set("affiliation", e.target.value)}
                  >
                    <option value="">Select Affiliation</option>
                    {AFFILIATIONS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>

              <FormField label="School / College / Organisation" id="mitr-org">
                {(control) => (
                  <Input
                    {...control}
                    type="text"
                    value={form.organisation}
                    onChange={(e) => set("organisation", e.target.value)}
                    placeholder="Organisation name"
                  />
                )}
              </FormField>

              <FormField label="Complete Postal Address" id="mitr-address" required className="sm:col-span-2">
                {(control) => (
                  <Input
                    {...control}
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="House / street / area"
                  />
                )}
              </FormField>

              <FormField label="State" id="mitr-state" required>
                {(control) => (
                  <Select
                    {...control}
                    required
                    value={form.state}
                    onChange={(e) => {
                      set("state", e.target.value);
                      set("district", "");
                    }}
                  >
                    <option value="">Select State</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>

              <FormField label="District" id="mitr-district" required>
                {(control) => (
                  <Select
                    {...control}
                    required
                    value={form.district}
                    onChange={(e) => set("district", e.target.value)}
                    disabled={!form.state}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>

              <FormField label="Pincode" id="mitr-pincode" required>
                {(control) => (
                  <Input
                    {...control}
                    type="text"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    value={form.pincode}
                    onChange={(e) => set("pincode", e.target.value)}
                    placeholder="6-digit pincode"
                  />
                )}
              </FormField>
            </div>

            <Checkbox
              id="mitr-declaration"
              checked={declared}
              onChange={(e) => setDeclared(e.target.checked)}
              label="I declare that the information provided above is accurate, and I wish to volunteer as a Nasha Mukti Mitr."
            />

            <Button
              type="submit"
              variant="success"
              disabled={submitting}
              iconRight={<Icon name="arrow_forward" size={16} />}
            >
              {submitting ? "Submitting…" : "Register as Nasha Mukti Mitr"}
            </Button>
          </form>
        )}
      </div>
    </PublicShell>
  );
}
