"use client";

import * as React from "react";
import { DEMO_FORM_FILL_EVENT, type DemoFormFillDetail, type DemoFormPreset } from "@/lib/e-anudaan/demo-forms";

/**
 * Let the demo dock fill this form (lib/e-anudaan/demo-forms). `apply` sets the form's own state
 * from the preset's values and, for a preset that is not `valid`, shows the form's errors the way
 * pressing Submit would — without submitting.
 *
 * The latest `apply` is always the one called, so it may close over the render's state freely.
 */
export function useDemoFormFill(formId: string, apply: (values: Readonly<Record<string, string>>, preset: DemoFormPreset) => void) {
  const latest = React.useRef(apply);
  React.useEffect(() => {
    latest.current = apply;
  });
  React.useEffect(() => {
    const on = (e: Event) => {
      const { formId: id, preset } = (e as CustomEvent<DemoFormFillDetail>).detail;
      if (id === formId) latest.current(preset.values, preset);
    };
    window.addEventListener(DEMO_FORM_FILL_EVENT, on);
    return () => window.removeEventListener(DEMO_FORM_FILL_EVENT, on);
  }, [formId]);
}
