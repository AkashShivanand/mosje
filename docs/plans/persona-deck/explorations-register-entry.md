# Service discovery, as an entry in the explorations register

The six options belong on `/explorations`. They are not there yet, and this file
holds the exact edit that puts them there, because the register cannot be edited
from this branch.

## Why it is not already done

`apps/hub/src/lib/explorations/registry.ts`, `apps/hub/src/app/explorations/page.tsx`,
`apps/hub/src/app/explorations/[surface]/[module]/page.tsx` and
`apps/hub/src/components/explorations/ExplorationViewer.tsx` are **untracked work on
`feat/explorations-and-band-motion`**. They are committed nowhere — not on `main`,
not on any remote branch, not here. Copying them across would duplicate a live
work-in-progress and collide on merge, so this branch adds only what is its own:

- `apps/hub/src/components/explorations/service-discovery/options.tsx` — the six
  prototypes, framed for the viewer. New files, no conflict with that branch.
- `apps/hub/src/app/explorations/service-discovery/` — the tabbed page, which
  works today and does not depend on the register.

## Edit 1 — `apps/hub/src/lib/explorations/registry.ts`

Add this surface to `EXPLORATIONS`. Every option is `proposed`: the deck exists to
obtain a decision, and none has been taken, so nothing is `chosen` and nothing is
`superseded` yet. Recording a recommendation as a decision would be the register
telling itself what it wants to hear.

```ts
  {
    id: "service-discovery",
    title: "How a citizen finds a scheme",
    route: "/website",
    summary:
      "The site publishes 134 schemes and its Target Group filter offers no value for women and girls, transgender persons, persons with disabilities, victims of atrocities or voluntary organisations. Twenty-three schemes carry no group at all. These options address that on the three parts of the site where a citizen looks.",
    modules: [
      {
        id: "home-page",
        title: "The home page",
        question:
          "A citizen arrives on the home page knowing their situation but not the Department's vocabulary. What gets them from there to a scheme that lists them?",
        date: "8 September 2026",
        options: [
          {
            id: "personas",
            title: "Explore User Personas",
            summary:
              "The panel already on the home page: one group at a time, moved with arrows, and choosing one opens the Schemes page filtered to it.",
            status: "proposed",
            live: true,
            lookAt: [
              "One group is visible at a time, so you cannot tell whether you are represented without clicking",
              "It sorts by group alone — not by stage of life, need or State",
              "Today choosing a group does not filter anything: the panel's own promise goes unmet",
            ],
          },
          {
            id: "five-questions",
            title: "Find support for you",
            summary:
              "Five short questions, any of which may be skipped. Skipping widens the answer rather than ending it.",
            status: "proposed",
            live: true,
            lookAt: [
              "The count at the top right falls as answers narrow — 45 at question two, 6 once five are answered",
              "Choosing “person with disability” routes to DEPwD rather than returning nothing",
              "It ends at a place to apply, not at a page of text",
            ],
          },
          {
            id: "one-tap",
            title: "Find offerings for you",
            summary:
              "A row of the nine groups. Tapping one shows the portal, the scheme and the complaint route for that group, on the home page itself.",
            status: "proposed",
            live: true,
            lookAt: [
              "One tap, with nothing to answer",
              "It shows portals, schemes and complaint routes together, which no other option does",
              "It reads group alone, so it is less exact than the five questions",
            ],
          },
        ],
      },
      {
        id: "schemes-page",
        title: "The Schemes page",
        question:
          "The Schemes page is where a person compares one scheme against another, and where officers and voluntary organisations work. How should it be arranged?",
        date: "8 September 2026",
        options: [
          {
            id: "pictures",
            title: "Pictures of the nine groups, with cards",
            summary:
              "All nine groups visible at once as illustrations, above a card for each scheme.",
            status: "proposed",
            live: true,
            lookAt: [
              "No arrows and no scrolling to find yourself — all nine are on screen",
              "A card has no room for who runs the scheme, or whether it is Central or State",
              "Two schemes cannot be compared side by side",
            ],
          },
          {
            id: "filter-table",
            title: "Filter panel with a table of schemes",
            summary:
              "Filters down the left, a table on the right showing what a person gets, who runs it, and whether it is Central or State.",
            status: "proposed",
            live: true,
            lookAt: [
              "Filters combine — group and stage of life and kind of help together",
              "The count beside each filter warns before an empty result rather than after it",
              "A table reads as a record rather than an invitation",
            ],
          },
        ],
      },
      {
        id: "assistant",
        title: "The assistant",
        question:
          "A citizen is already on a page that leads nowhere else. What reaches them there?",
        date: "8 September 2026",
        options: [
          {
            id: "samajik-sahayak",
            title: "Samajik Sahayak — the same five questions, in chat",
            summary:
              "The same five questions, asked one at a time in the assistant that is already built and reachable from every page.",
            status: "proposed",
            live: true,
            lookAt: [
              "This is the design system's own Chatbot component, not a copy built for the demo",
              "One question per screen, which suits a phone",
              "It states plainly that it cannot decide or change an application",
              "A button in the corner is found only by those looking for it",
            ],
          },
        ],
      },
    ],
  },
```

## Edit 2 — `apps/hub/src/components/explorations/ExplorationViewer.tsx`

```ts
import {
  HomePersonas, HomeFiveQuestions, HomeOneTap,
  SchemesPictures, SchemesFilterTable, AssistantChat,
} from "./service-discovery/options";

const PROTOTYPES: Record<string, React.ComponentType> = {
  "nmba/campaign-band/current": OptionAnchorGuest,
  "nmba/campaign-band/flight": OptionFlight,
  "service-discovery/home-page/personas": HomePersonas,
  "service-discovery/home-page/five-questions": HomeFiveQuestions,
  "service-discovery/home-page/one-tap": HomeOneTap,
  "service-discovery/schemes-page/pictures": SchemesPictures,
  "service-discovery/schemes-page/filter-table": SchemesFilterTable,
  "service-discovery/assistant/samajik-sahayak": AssistantChat,
};
```

## After applying

`/explorations` lists a third surface; the counts on that page are derived from the
register, so they move on their own. The six prototypes then have two addresses —
the register's module pages, and the tabbed page at
`/explorations/service-discovery` that was built for showing all six in a room.
Keep both or fold the tabbed page in; that is a choice for whoever lands this.
