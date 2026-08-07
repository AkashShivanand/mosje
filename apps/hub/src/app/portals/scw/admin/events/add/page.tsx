import Link from "next/link";
import { Button, Card, Field, Select, TextInput } from "@/components/scw/ui";
import { INDIAN_STATES } from "@/lib/scw/states";
import { Icon } from "@mosje/design-system";

export default function AddEventPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/portals/scw/admin/events"
          aria-label="Back to Events"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-black/5"
        >
          <Icon name="arrow_back" size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-ink">Add New Event</h1>
      </div>

      <Card className="p-6 sm:p-8">
        <form className="space-y-6">
          <Field label="Event Title" required>
            <TextInput placeholder="Enter event title" />
          </Field>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Start Date and Time" required>
              <TextInput type="datetime-local" />
            </Field>
            <Field label="End Date and Time" required>
              <TextInput type="datetime-local" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Field label="Pincode" required>
              <TextInput placeholder="Enter pincode" />
            </Field>
            <Field label="State" required>
              <Select options={[...INDIAN_STATES]} placeholder="Select state" />
            </Field>
            <Field label="District" required>
              <Select options={[]} placeholder="Select district" />
            </Field>
          </div>

          <Field label="Full Address" required>
            <textarea
              rows={3}
              placeholder="Enter full address"
              className="w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-hint focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/15"
            />
          </Field>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Field label="Organizer Name" required>
              <TextInput defaultValue="Rajesh Pilli" disabled />
            </Field>
            <Field label="Mobile Number" required>
              <div className="flex">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-line bg-brandwash px-3 text-sm text-ink-muted">
                  +91
                </span>
                <TextInput
                  defaultValue="8766516289"
                  disabled
                  className="rounded-l-none"
                />
              </div>
            </Field>
            <Field label="Email Address" required>
              <TextInput defaultValue="admin@gmail.com" disabled />
            </Field>
          </div>

          <label className="flex items-start gap-3 text-sm text-ink">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-line text-navy focus:ring-navy/30"
            />
            <span>
              I hereby declare that the information given above is correct and true to
              the best of my knowledge.
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 border-t border-line pt-6">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save and Continue →
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
