/**
 * THE EXPLORATIONS REGISTER — options we have drawn, and what became of them.
 *
 * ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 *
 * Design decisions on this estate have been made in chat and landed straight on
 * `main`. That works while one person remembers the reasoning, and it fails in
 * two specific ways, both of which have already happened:
 *
 *   · A stakeholder asks "what did the other version look like?" and the answer
 *     is a commit diff, which is not a thing anyone can look at.
 *   · An option is rejected, and six weeks later somebody proposes it again,
 *     because nothing recorded that it was considered or why it lost.
 *
 * So an exploration is a REAL, RUNNING PROTOTYPE at its own address, kept after
 * the decision rather than deleted. Nothing here is reachable from the public
 * site, nothing here is imported by a page under `/website` or `/portals`, and
 * choosing an option is a deliberate act of moving code — not of flipping a flag
 * that some production surface is quietly reading.
 *
 * ── HOW IT IS ORGANISED ─────────────────────────────────────────────────────
 *
 * Page-wise, then module-wise, which is how the work actually arrives: someone
 * asks about "the NMBA hero" or "the scheme card on the home page", never about
 * a component in the abstract. A SURFACE is a page or a family of pages; a
 * MODULE is one decision inside it. A module holds two or more OPTIONS, one of
 * which may be the current build.
 *
 *   /explorations                              every surface
 *   /explorations/<surface>/<module>           one decision, all its options
 *
 * ── THE ONE RULE ────────────────────────────────────────────────────────────
 *
 * **An option is never deleted.** When one wins the others become
 * `superseded`, keep their address, and say what beat them. A register that
 * loses the rejected options is a register that will be re-litigated.
 */

/** Where an option stands. */
export type ExplorationStatus =
  /** Built, presented, and it is what ships. */
  | "chosen"
  /** Built and awaiting a decision. */
  | "proposed"
  /** Considered, not chosen. Kept, with what beat it. */
  | "superseded"
  /** Real, but deliberately not being pursued now. */
  | "parked";

export interface ExplorationOption {
  /** Slug within the module — "current", "option-a", "flight". */
  id: string;
  title: string;
  /** One sentence. What this option IS, not what it is for. */
  summary: string;
  status: ExplorationStatus;
  /**
   * What a stakeholder should actually look at, so a review is about the thing
   * being decided rather than about whatever the reader noticed first.
   */
  lookAt?: string[];
  /** Where it landed, for a `chosen` option — a PR number or a route. */
  landedIn?: string;
  /** What beat it, for a `superseded` one. */
  supersededBy?: string;
  /**
   * `true` when this option renders a live prototype on the module's page.
   * `false` records a decision whose prototype was the live estate itself —
   * every option shipped before this register existed is one of those.
   */
  live?: boolean;
}

export interface ExplorationModule {
  /** Slug — "campaign-band". */
  id: string;
  title: string;
  /**
   * THE DECISION, AS A QUESTION. Not a description of the module. A module
   * whose question cannot be written down is not a decision, it is a to-do.
   */
  question: string;
  /** When the options were drawn. */
  date: string;
  options: ExplorationOption[];
}

export interface ExplorationSurface {
  /** Slug — "nmba". */
  id: string;
  title: string;
  /** Which real page or pages this is about. */
  route?: string;
  summary: string;
  modules: ExplorationModule[];
}

export const EXPLORATIONS: readonly ExplorationSurface[] = [
  {
    id: "nmba",
    title: "Nasha Mukt Bharat Abhiyaan",
    route: "/website/organisation/nasha-mukt-bharat-abhiyaan",
    summary:
      "The organisation page. Its first fold and its document shelves have carried most of the estate's design decisions this month, because it is the record that turns on every part of the organisation template.",
    modules: [
      {
        id: "campaign-band",
        title: "The campaign band and the helpline",
        question:
          "When a reader dismisses the campaign band, does the national de-addiction helpline go with it, or move to the hero?",
        date: "8 September 2026",
        options: [
          {
            id: "goes",
            title: "It goes with the band",
            summary:
              "Press the × and the whole band leaves, the number included. What the estate did until 8 September.",
            status: "superseded",
            supersededBy:
              "A control whose job is “I do not want this advertisement” also removed a national de-addiction helpline from the top of a page about drug de-addiction. It was only ever survivable because the key-facts strip happens to carry the number — a coincidence of content standing in for a design.",
          },
          {
            id: "flight",
            title: "It flies to the hero",
            summary:
              "The whole band leaves, and the helpline travels from it into a badge beside the campaign mark on a 615ms arc.",
            status: "superseded",
            supersededBy:
              "Legible and smooth, and wrong for this page: 615ms of theatre attached to the act of REFUSING an advertisement, on a government page about drug de-addiction. The reader has just said “less of this”. Its idea survives in the shipped option; only the flight went.",
            live: true,
            lookAt: [
              "The band goes entirely — no residual green strip",
              "The number arrives beside the mark, where the page's identity already is",
              "Under `prefers-reduced-motion` there is no flight: the badge is simply there",
              "It puts the helpline in the fold TWICE — once on the badge and once in the fact strip. The fact strip carries it only because the band can be dismissed, so choosing this option means deciding whether that fact returns to the Abhiyaan's fourth figure.",
            ],
          },
          {
            id: "arrive",
            title: "The badge simply arrives",
            summary:
              "The whole band folds away and the helpline appears beside the mark — 6px up and a fade, once the fold has finished.",
            status: "chosen",
            live: true,
            landedIn: "the live organisation template — `OrganisationHelplineBadge`",
            lookAt: [
              "The band goes entirely, and the number is beside the mark a moment later",
              "Two properties and one delay; nothing crosses the fold",
              "Under `prefers-reduced-motion` the 6px goes and the fade stays — a fade is not motion, and it is what says the badge is new",
            ],
          },
        ],
      },
      {
        id: "banner-layout",
        title: "How the campaign band is composed",
        question:
          "The band carries a volunteer campaign and a national helpline, which are not related. How is it composed so the two do not read as a matched pair?",
        date: "8 September 2026",
        options: [
          {
            id: "ctas-right",
            title: "Both CTAs on the right",
            summary:
              "104px, one row. A 72px code leads, the message takes the middle, and the two routes sit together on the trailing edge, 12 apart.",
            status: "proposed",
            live: true,
            lookAt: [
              "It costs 104px of a 760px fold",
              "Everything is on one optical line, so the row scans in a single pass",
              "The heading is label-sized — it does not compete with the H1 below it",
              "Pairing the helpline with the campaign's button makes it read as the second half of one offer, when it is a standing service that happens to be printed here",
            ],
          },
          {
            id: "ctas-below",
            title: "CTAs below the copy",
            summary:
              "168px. A 120px code spans the full height, and the heading, sentence and both buttons stack beside it — the handoff’s own composition.",
            status: "proposed",
            live: true,
            lookAt: [
              "64px more of the fold than the compact band, all of it the code's height",
              "The heading is headline-3 at 28px, sitting above an H1 — worth checking against the page title",
              "Its sentence points at the e-pledge while the button beneath goes to the volunteer register; kept verbatim so the mismatch can be settled rather than quietly harmonised",
              "The pulsing call glyph is the handoff's own instance, not an addition",
            ],
          },
          {
            id: "two-zones",
            title: "Two zones",
            summary:
              "The campaign keeps the band's gradient; the helpline takes a darker panel at the trailing edge, shaped as a fact — a caption over a figure — rather than as a second button.",
            status: "proposed",
            live: true,
            lookAt: [
              "The seam is read before any of the words are — a gap of any size only ever says “same thing, further away”",
              "It is a FACT, not a control: a caption over a figure, which is how the key strip below states the same number",
              "It is the hero badge's structure, so what moves on dismissal is recognisably the same object in a lighter skin",
              "White on `successScale-800` measures about 13:1 — the most legible text in the band, which is right for the line somebody may be reading in a hurry",
            ],
          },
        ],
      },
      {
        id: "helpline-card",
        title: "The helpline inside the campaign band",
        question:
          "The national de-addiction helpline sits on a band that is mostly about volunteering. What shape does it take so a person in trouble finds it first?",
        date: "8 September 2026",
        options: [
          {
            id: "current",
            title: "Glyph first, static",
            summary:
              "A filled white control reading symbol, label, number, with nothing on it that moves.",
            status: "proposed",
            live: true,
            lookAt: [
              "The decoration arrives first and the five digits last, at the end of a 296px control",
              "Nothing distinguishes it from the campaign's own button except its fill",
            ],
          },
          {
            id: "ringing",
            title: "Card with a breathing halo",
            summary:
              "Label and number lead; the glyph sits on the trailing edge inside a halo that breathes three times and then rests.",
            status: "proposed",
            live: true,
            lookAt: [
              "It reads label → number → act, which is the order a reader needs them in",
              "The glyph does not move. A rocking handset means an INCOMING call, and the reader is about to place one — the halo means the line is live",
              "Three breaths over 4.8s, then still: under the five past which WCAG 2.2 would demand a pause control, and under it on purpose",
              "It runs on under hover and focus, which is user-initiated and the one moment the movement is about to mean something",
              "Under `prefers-reduced-motion` the halo rests at its opening frame — the meaning without the movement",
              "It is the SAME component the hero badge uses, so the flight in “The campaign band and the helpline” is one card changing size",
            ],
          },
        ],
      },
      {
        id: "top-bands",
        title: "The two bands above the hero",
        question:
          "The fold opens with two announcement bands stacked — a campaign and an anniversary notice. Should they stay separate, or share one?",
        date: "8 September 2026",
        options: [
          {
            id: "two",
            title: "Two bands",
            summary:
              "Each announcement keeps its own band, its own ground colour and its own dismiss, and both are visible at once.",
            status: "proposed",
            live: true,
            lookAt: [
              "Both messages are readable without the reader doing anything",
              "They cost 154px of a 760px fold before the page has said what it is",
              "Two grounds and two dismisses stacked 50px apart",
            ],
          },
          {
            id: "one",
            title: "One band, two panels",
            summary:
              "A single band carrying both, switched by the reader. Half the height, and one message visible at a time.",
            status: "proposed",
            live: true,
            lookAt: [
              "50px of the fold given back to the hero",
              "The second panel is, in practice, unread — the design system's own Carousel says so",
              "Nothing rotates on a timer: a band carrying a helpline must not move a sentence away mid-read",
              "The notice gives up its saffron, because a band that changes ground colour as it advances flashes",
            ],
          },
        ],
      },
      {
        id: "documents",
        title: "Documents & Downloads",
        question:
          "The Department publishes six separately titled document shelves. How does one page carry all six without spending 2,400px on fifteen files?",
        date: "7–8 September 2026",
        options: [
          {
            id: "sections",
            title: "Six bands",
            summary:
              "Each shelf its own full-width band, in the source's order, each with its own heading and its own route out.",
            status: "superseded",
            supersededBy:
              "Six top-level headings broke the side rail's contract — the rail offered one “Documents & Downloads” entry pointing at an id this mode never rendered.",
          },
          {
            id: "library",
            title: "One shelf, chips",
            summary:
              "Every group merged into one filterable shelf, the publisher's arrangement kept as counted chips, with a route out that follows the selected chip.",
            status: "chosen",
            landedIn: "PR #379 — and it is what the other 177 organisations use",
          },
          {
            id: "tabs",
            title: "One shelf, tabs",
            summary:
              "The Department's six headings become six tabs on one band, each keeping its own “View All”, with the cards on a sideways-scrolling rail.",
            status: "chosen",
            landedIn: "PR #381 — used by NMBA, which is the record that asked for it",
          },
        ],
      },
      {
        id: "first-fold",
        title: "The first fold",
        question:
          "The fold carries a campaign band, a hero, a fact strip, a notice strip and a time-limited ribbon. Which of them is actually above the fold, and what gives way?",
        date: "8 September 2026",
        options: [
          {
            id: "ribbon-below",
            title: "Ribbon between the fact strip and the data",
            summary:
              "Where the 7 September review asked for it — “between the blue section and the data section”.",
            status: "superseded",
            supersededBy:
              "Measured below the fold at 1440×760, 1512×820, 1920×955 and on a phone. A time-limited call to action nobody scrolls to costs height and returns nothing.",
          },
          {
            id: "ribbon-above",
            title: "Ribbon above the hero",
            summary:
              "After the campaign band, before the page title — one 50px line carrying the occasion, the invitation and two routes.",
            status: "chosen",
            landedIn: "PR #393, tightened in #395",
          },
        ],
      },
      {
        id: "hero-mark",
        title: "The organisation mark on the hero",
        question:
          "Seventeen organisation marks sit on a brand-coloured band. Which of them need a white plate behind them?",
        date: "8 September 2026",
        options: [
          {
            id: "plate-all",
            title: "A white disc behind every mark",
            summary: "An 84px mark inside a 100px white circle with a hairline border.",
            status: "superseded",
            supersededBy:
              "It is in no design — the handoff's Logo frame has no fill, no stroke and no radius — and it put a ring around eleven marks that already carry their own edge.",
          },
          {
            id: "plate-declared",
            title: "A plate only where the artwork needs one",
            summary:
              "Six marks are declared in the registry as unable to hold a brand band; the other eleven render bare, as the handoff draws them.",
            status: "chosen",
            landedIn: "PR #388 — `ORG_MARKS_NEEDING_GROUND`",
          },
        ],
      },
    ],
  },
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
            title: "Find Schemes for You",
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
          {
            id: "tasks",
            title: "What you need to do",
            summary:
              "Four things a citizen does — check, apply, track, raise a grievance — in place of the parts of the Department.",
            status: "proposed",
            live: true,
            lookAt: [
              "Two of the four serve people who have already applied and are waiting to hear",
              "Tracking an application is the one thing on it the site cannot do today, which is why people telephone the office",
              "It settles the entry point and not the finding — behind “check what you can get” still sits one of the other three options",
            ],
          },
          {
            id: "search",
            title: "Ask in your own words",
            summary:
              "One field that reads safai, nasha, chhatravriti and budhapa, and names the department that holds the answer.",
            status: "proposed",
            live: true,
            lookAt: [
              "Type “divyang” and it routes to DEPwD, where the live search returns a 2015 annual report tagged “disability arising from untouchability”",
              "Type “gadi ka insurance” and it says plainly that the word is not in its list, rather than returning nothing",
              "It is matched on word boundaries, so “confirmation” is not read as a complaint and “first” is not read as an FIR",
              "It costs the home page no height — the field is already in the masthead — but it is found only by people who were going to type",
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
        id: "hand-off",
        title: "Leaving for another site",
        question:
          "Most schemes are applied for on a portal this Department does not run. What does the last screen here do?",
        date: "8 September 2026",
        options: [
          {
            id: "straight-out",
            title: "The link goes straight out",
            summary:
              "An apply button opens the other site directly, which is what every scheme page does today.",
            status: "proposed",
            live: false,
            lookAt: [
              "It is what the estate already does, so it costs nothing to keep",
              "A citizen arrives at a portal that asks for papers nobody told them to bring",
              "Where a scheme has no online route at all — the corporation loans, PM-AJAY — the button has nowhere to go",
            ],
          },
          {
            id: "interstitial",
            title: "One screen that names the destination",
            summary:
              "The domain, what will be asked for there, and a way back. Where there is no online route it says so, and gives the office instead.",
            status: "proposed",
            live: true,
            lookAt: [
              "It names scholarships.gov.in rather than “the portal”, because people check the address bar",
              "The in-person ending is treated as an ending and not a failure: address, hours, telephone, and a list that prints",
              "It is one more screen between a citizen and the application they came to make",
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
];

export function surfaceById(id: string): ExplorationSurface | undefined {
  return EXPLORATIONS.find((s) => s.id === id);
}

export function moduleById(surfaceId: string, moduleId: string): ExplorationModule | undefined {
  return surfaceById(surfaceId)?.modules.find((m) => m.id === moduleId);
}

/** Every surface/module pair, for `generateStaticParams`. */
export function allModuleParams(): { surface: string; module: string }[] {
  return EXPLORATIONS.flatMap((s) => s.modules.map((m) => ({ surface: s.id, module: m.id })));
}

/** Counted, never typed — the index prints these. */
export function counts() {
  const modules = EXPLORATIONS.flatMap((s) => s.modules);
  const options = modules.flatMap((m) => m.options);
  return {
    surfaces: EXPLORATIONS.length,
    modules: modules.length,
    options: options.length,
    open: options.filter((o) => o.status === "proposed").length,
    chosen: options.filter((o) => o.status === "chosen").length,
    kept: options.filter((o) => o.status === "superseded" || o.status === "parked").length,
  };
}
