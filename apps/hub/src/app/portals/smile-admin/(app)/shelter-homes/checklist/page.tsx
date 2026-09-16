"use client";

import { useMemo, useState } from "react";
import { DECLARED, FACILITIES } from "@/lib/smile-admin/facilities";
import { SHELTER_HOMES } from "@/lib/smile-admin/mock-data";
import { Badge, Checkbox, FormScreen } from "@mosje/design-system";

const SHELTERS = SHELTER_HOMES.filter((s) => s.status !== "Closed");
const SELECT = "h-10 w-full max-w-xl rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

/**
 * `FormScreen`, per docs/design-system/screen-templates.md §2 — one record, and
 * it fits one screen. The >8-field rule that would send this to a wizard counts
 * distinct fields; twelve tick-boxes in one group are one declaration, and the
 * live portal draws them on a single page.
 *
 * Rebuilt from the live screen. An earlier version of this page was a quarterly
 * AUDIT checklist — documents to attach, with findings and rejections — which is
 * a different screen serving a different purpose. The live one asks what the
 * shelter HAS, saves the answer per shelter, and pre-fills it next time.
 */
export default function FacilityChecklistPage() {
  const [shelterId, setShelterId] = useState("");
  const [ticked, setTicked] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);

  const shelter = SHELTERS.find((s) => s.id === shelterId);

  /** What this shelter last declared. Read fresh whenever the selection moves. */
  const declared = useMemo(() => DECLARED[shelterId] ?? [], [shelterId]);

  function choose(id: string) {
    setShelterId(id);
    setTicked(DECLARED[id] ?? []);
    setDirty(false);
  }

  function toggle(id: string, on: boolean) {
    setTicked((t) => (on ? [...t, id] : t.filter((x) => x !== id)));
    setDirty(true);
  }

  const previously = declared.length;

  return (
    <FormScreen
      breadcrumb={[
        { label: "Beneficiaries" },
        { label: "Swashraya (Shelter Homes)", href: "/portals/smile-admin/shelter-homes" },
        { label: "Checklist" },
      ]}
      eyebrow="Beneficiaries"
      title="Swashraya (Shelter Home) Facility Checklist"
      meta="Mark the facilities currently available at this Swashraya (Shelter Home). Submissions are saved per shelter and pre-fill on your next visit."
      notices={
        <div className="space-y-sm">
          <label className="block space-y-xs">
            <span className="text-label-1 text-ink">Swashraya (Shelter Home)</span>
            <select
              aria-label="Swashraya (Shelter Home)"
              value={shelterId}
              onChange={(e) => choose(e.target.value)}
              className={SELECT}
            >
              <option value="">— Select Swashraya (Shelter Home) —</option>
              {SHELTERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.district}, {s.state})
                </option>
              ))}
            </select>
          </label>
          {shelter ? (
            <p className="text-body-2 text-ink-muted">
              {previously > 0 ? (
                <>
                  Pre-filled from the last submission for {shelter.name} —{" "}
                  <strong className="text-ink">
                    {previously} of {FACILITIES.length}
                  </strong>{" "}
                  facilities were declared.
                </>
              ) : (
                <>No facilities have been declared for {shelter.name} yet.</>
              )}
            </p>
          ) : null}
        </div>
      }
      onSubmit={() => {
        // A prototype: nothing is filed. Saying so beats a success message that
        // is not true.
      }}
      submitLabel="Submit Checklist"
      // Nothing here is starred — every facility is optional to tick, because
      // the point of the form is to record which ones the shelter HAS. The
      // template's default note would have promised a marker that never appears.
      requiredNote={null}
      onCancel={undefined}
    >
      {shelter ? (
        <fieldset className="space-y-md">
          <legend className="mb-sm flex items-center gap-sm text-title-2 text-ink">
            Facilities at Shelter-home
            <Badge status={ticked.length === FACILITIES.length ? "success" : "info"}>
              {ticked.length} of {FACILITIES.length} ticked
            </Badge>
          </legend>
          {/* A flex COLUMN, not `space-y`: `Checkbox` renders inline-flex, so on
              a plain block the twelve ran two and three to a line and the
              longest labels collided. One requirement per line is also how the
              live screen draws them. */}
          <div className="flex flex-col gap-sm">
            {FACILITIES.map((f) => (
              <Checkbox
                key={f.id}
                checked={ticked.includes(f.id)}
                onChange={(e) => toggle(f.id, e.target.checked)}
                label={f.label}
              />
            ))}
          </div>
          {dirty ? (
            <p className="text-label-2 text-ink-muted">Changes are not saved until the checklist is submitted.</p>
          ) : null}
        </fieldset>
      ) : (
        // Not an empty state in the template's sense — nothing has failed and
        // nothing is missing. The reader simply has not chosen a shelter, and a
        // form for no shelter would be a form with nowhere to file.
        <p className="rounded-md border border-dashed border-stroke-300 px-md py-lg text-center text-body-2 text-ink-muted">
          Choose a Swashraya (Shelter Home) above to open its facility checklist.
        </p>
      )}
    </FormScreen>
  );
}
