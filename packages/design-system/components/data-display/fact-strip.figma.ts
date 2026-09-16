// url=<SAMAVESH>?node-id=57981-811
// source=packages/design-system/components/data-display/fact-strip.tsx
// component=FactStrip
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * THE ONE PROPERTY THE SET HAS, and it is mapped by what it IMPLIES rather than
 * by emitting it.
 *
 * `variant` is optional in code: `FactStrip` resolves it from `items.length` —
 * extended above five, because `minmax(200px, 1fr)` fits at most five tracks in
 * the widest content column on this estate. So the idiomatic snippet is the one
 * that passes the right number of facts and lets the component decide, not one
 * that passes a redundant `variant="compact"` beside four items.
 *
 * A designer who genuinely needs the override — a six-item strip held compact,
 * or four facts set as figures — passes `variant` by hand; the prop is
 * documented on the component and on section 02 of the Figma page. Emitting it
 * on every instance would teach the opposite of the component's own default.
 */
const items = instance.getEnum("Type", {
  Compact: figma.code`items={[
        { icon: "location_on", value: "New Delhi", label: "Headquarters" },
        { icon: "widgets", value: "3", label: "Scheme components" },
        { icon: "calendar_month", value: "1998", label: "Year established" },
        { icon: "groups", value: "Scheduled Castes", label: "Who it serves" },
      ]}`,
  Extended: figma.code`items={[
        { icon: "groups", value: "345,703,321", label: "People reached" },
        { icon: "school", value: "137,209,589", label: "Youth reached" },
        { icon: "woman", value: "106,563,417", label: "Women reached" },
        { icon: "menu_book", value: "3,726,319", label: "Activities in educational institutes" },
        { icon: "healing", value: "28,29,661+", label: "Persons treated and rehabilitated" },
        { icon: "local_hospital", value: "755+", label: "DoSJE-supported de-addiction centres" },
        { icon: "front_hand", value: "3,361,211", label: "Total pledges" },
        { icon: "volunteer_activism", value: "164,943", label: "Nasha Mukti Mitr registered" },
      ]}`,
});

/**
 * NOT MAPPED, AND EACH FOR A REASON — an unmapped property emits `undefined`,
 * so every one the set exposes has to be accounted for here.
 *
 * · `Value`, `Label` and the Icon swap live on the nested `Fact Strip / Fact`
 *   cell, NOT on this set. In code they are members of `items`, which is data —
 *   one frame draws one fact, and the array is what makes this a strip rather
 *   than a card. They are read into the arrays above rather than mapped as
 *   properties, because a Figma text property has no code prop to become.
 *
 * · `overlap` has NO Figma property. It pulls the card up 64 over the band
 *   above it, which a component set cannot express — it is drawn on section 06
 *   of the documentation page as a code-only arrangement instead. It is emitted
 *   below because every real placement of this component is under a page header.
 *
 * · `ariaLabel` has no Figma property either and is REQUIRED in code, so it is
 *   emitted with a placeholder a developer must replace rather than omitted and
 *   silently forgotten.
 *
 * THERE IS DELIBERATELY NO TEMPLATE FOR `Fact Strip / Fact`. It is a Figma-only
 * composition helper so the strip can be assembled from library instances; there
 * is no `Fact` export in code for it to map to, and inventing one would be the
 * "never invent a code prop" rule broken in the other direction.
 */
export default {
  example: figma.code`
    <FactStrip
      overlap
      ariaLabel="Key facts about the organisation"
      ${items}
    />
  `,
  imports: ['import { FactStrip } from "@mosje/design-system"'],
  id: "fact-strip",
  metadata: { nestable: false },
};
