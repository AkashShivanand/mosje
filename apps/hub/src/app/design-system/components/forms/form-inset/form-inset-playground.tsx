"use client";
import * as React from "react";
import { Button, FormCard, FormField, FormInset, FormPanel, Icon, Input, Toggle } from "@mosje/design-system";

interface Entry {
  id: number;
  employer: string;
  role: string;
}

const START: Entry[] = [
  { id: 1, employer: "Zilla Parishad, Pune", role: "Data Entry Operator" },
  { id: 2, employer: "", role: "" },
];

/**
 * Specimen: a repeatable group as NOS's employment step draws it — a Yes/No question as
 * a Toggle, the entries as tinted insets, and "Add More" under the last one.
 */
export function FormInsetPlayground(): React.JSX.Element {
  const [employed, setEmployed] = React.useState(true);
  const [entries, setEntries] = React.useState<Entry[]>(START);
  const next = React.useRef(START.length + 1);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const addRef = React.useRef<HTMLButtonElement>(null);
  /* Where focus goes after the list changes: the new entry's first field, or Add More. */
  const focusTarget = React.useRef<number | "add" | null>(null);

  /* Runs after the list re-renders, so the new entry's field exists to be focused. */
  React.useEffect(() => {
    const target = focusTarget.current;
    if (target === null) return;
    focusTarget.current = null;
    if (target === "add") addRef.current?.focus();
    else rootRef.current?.querySelector<HTMLInputElement>(`[data-entry="${target}"] input`)?.focus();
  }, [entries]);

  const add = () => {
    const id = next.current++;
    setEntries((list) => [...list, { id, employer: "", role: "" }]);
    focusTarget.current = id;
  };
  const remove = (id: number) => {
    setEntries((list) => list.filter((e) => e.id !== id));
    focusTarget.current = "add";
  };

  return (
    <div className="fip" ref={rootRef}>
      <FormPanel as={3} title="Employment Background Details">
        <FormCard title="Previous Employment" as={4}>
          <Toggle
            checked={employed}
            onChange={(e) => setEmployed(e.target.checked)}
            label="Has the applicant been employed before?"
          />
          {employed && (
            <>
              {entries.map((entry, i) => (
                <div key={entry.id} data-entry={entry.id} className="fip__entry">
                  <FormInset
                    title={`Employment ${i + 1}`}
                    actions={
                      entries.length > 1 ? (
                        <Button
                          type="button"
                          appearance="text"
                          size="sm"
                          onClick={() => remove(entry.id)}
                          aria-label={`Remove Employment ${i + 1}`}
                        >
                          Remove
                        </Button>
                      ) : undefined
                    }
                  >
                    <FormField label="Employer" required>
                      {(p) => <Input {...p} defaultValue={entry.employer} />}
                    </FormField>
                    <FormField label="Designation" required>
                      {(p) => <Input {...p} defaultValue={entry.role} />}
                    </FormField>
                  </FormInset>
                </div>
              ))}
              <div className="fip__add">
                <Button
                  ref={addRef}
                  type="button"
                  appearance="outlined"
                  size="sm"
                  iconLeft={<Icon name="add" size={20} />}
                  onClick={add}
                >
                  Add More
                </Button>
              </div>
            </>
          )}
        </FormCard>
      </FormPanel>

      <style>{`
        .fip {
          padding: var(--sa-padding-24);
          background: var(--sa-bg-neutral-subtle);
          border-radius: var(--sa-shape-8);
        }
        .fip__add {
          display: flex;
          justify-content: flex-end;
        }
        @media (max-width: 767px) {
          .fip { padding: var(--sa-padding-12); }
        }
      `}</style>
    </div>
  );
}
