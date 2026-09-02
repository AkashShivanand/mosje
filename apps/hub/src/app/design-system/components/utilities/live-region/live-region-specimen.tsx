"use client";

import * as React from "react";
import { Button, ButtonGroup, LiveRegion, useLiveRegion } from "@mosje/design-system";

/**
 * The region, running.
 *
 * It draws nothing, so the specimen has to be the announcement itself: press a
 * control and a screen reader reads the sentence. The line underneath is the
 * PAGE'S echo, not the region — the region stays `ds-sr-only`, or a sighted
 * reader would see a message with no way to dismiss it.
 */
export function LiveRegionSpecimen(): React.JSX.Element {
  const { ref, announce: say } = useLiveRegion();
  const [echo, setEcho] = React.useState<string | null>(null);

  function announce(message: string): void {
    say(message);
    setEcho(message);
  }

  return (
    <div>
      <LiveRegion ref={ref} />
      <ButtonGroup aria-label="Announcement examples">
        <Button variant="primary" appearance="outlined" onClick={() => announce("Filter applied. 12 results.")}>
          Apply filter
        </Button>
        <Button variant="primary" appearance="outlined" onClick={() => announce("3 records exported.")}>
          Export records
        </Button>
      </ButtonGroup>
      <p>
        {echo === null
          ? "Nothing announced yet. Press a control above — a screen reader reads the sentence, and this line repeats it so the specimen can be checked without one."
          : `Announced: “${echo}”`}
      </p>
    </div>
  );
}
