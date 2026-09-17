"use client";

/**
 * The demo dock's "NGO-DARPAN" tab: every return state of Sign in with NGO-DARPAN, one click each.
 *
 * DS Audit: Button ✅ · ListGroup / ListRow ✅ — nothing new needed.
 *
 * Each button runs the flow's own functions — it records a real request, then arrives at the
 * return with the answer the provider would have given — so a state reached from here is the
 * state an applicant reaches, checked by the same code, and not a mock of it. It navigates with a
 * full load because the return screen resolves once, on arrival, exactly as after a redirect.
 */

import * as React from "react";
import { Button, ListGroup, ListRow } from "@mosje/design-system";
import {
  DARPAN_DEMO_SCENARIOS,
  authorizeUrl,
  beginRequest,
  callbackUrl,
  clearRequest,
  darpanDirectory,
  newState,
  normaliseDarpanId,
  planDemoScenario,
  readLinks,
  simulatedCode,
  writeLinks,
  writeSimulation,
  type DarpanDemoScenario,
} from "@/lib/e-anudaan/darpan-sign-in";

function store(kind: "sessionStorage" | "localStorage"): Storage | null {
  try {
    return window[kind];
  } catch {
    return null;
  }
}

/** Records a real request (unless the scenario is the missing one), then arrives where the plan says. */
function run(id: DarpanDemoScenario) {
  const plan = planDemoScenario(id);
  const session = store("sessionStorage");
  const local = store("localStorage");
  const registered = normaliseDarpanId(darpanDirectory(undefined).registered.darpanId);

  writeSimulation(session, plan.simulation);
  const others = readLinks(local).filter((l) => normaliseDarpanId(l) !== registered);
  if (plan.link === "set") writeLinks(local, [...others, registered]);
  if (plan.link === "clear") writeLinks(local, others);

  if (plan.go.to === "callback-without-request") {
    clearRequest(session);
    window.location.assign(callbackUrl(newState(), { code: simulatedCode("registered") }));
    return;
  }
  const req = beginRequest(session, newState(), Date.now());
  window.location.assign(plan.go.to === "provider" ? authorizeUrl(req.state) : callbackUrl(req.state, plan.go.answer));
}

export function DemoDarpanPanel() {
  return (
    <div className="space-y-3">
      <p className="text-body-2 text-ink-muted">
        Opens Sign in with NGO-DARPAN in one of its states. The organisations are illustrative.
      </p>
      <ListGroup bordered size="sm" aria-label="NGO-DARPAN sign-in states">
        {DARPAN_DEMO_SCENARIOS.map((s) => (
          <ListRow
            key={s.id}
            title={s.label}
            description={s.effect}
            trailing={
              <Button appearance="outlined" size="sm" onClick={() => run(s.id)}>
                Show
              </Button>
            }
          />
        ))}
      </ListGroup>
    </div>
  );
}
