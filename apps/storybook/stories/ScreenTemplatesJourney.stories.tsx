import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CatalogueScreen,
  ChecklistScreen,
  ChooserScreen,
  ConfirmationScreen,
  DecisionScreen,
  DescriptionList,
  FormField,
  FormScreen,
  FormSection,
  GalleryScreen,
  Icon,
  InboxScreen,
  Input,
  ReportScreen,
  ReviewScreen,
  SearchScreen,
  Select,
  SettingsScreen,
  StatusScreen,
  Textarea,
  type ChooserScreenProps,
} from "@mosje/design-system";

/**
 * **Screen templates, the other fourteen.** Lifecycle: **Beta**.
 *
 * @covers ChooserScreen, FormScreen, ChecklistScreen, ReviewScreen, ConfirmationScreen, DecisionScreen, CatalogueScreen, SearchScreen, InboxScreen, SettingsScreen, ReportScreen, GalleryScreen, StatusScreen, AuthScreen
 *
 * The first four templates are in *Templates/Screen templates*. These fourteen
 * close the catalogue at eighteen, which is a **closed set**: a screen that
 * seems to need a nineteenth is almost always one of these with a different
 * descriptor. The decision table, keyed on the data you have rather than on a
 * picture you liked, is in `docs/design-system/screen-templates.md`.
 *
 * Everything below is shared and therefore not restated per template. Every one
 * of them takes the seven-state input (`asked`, `loading`, `error`, `count` via
 * its own content, `filtered` where it has filters) and resolves it **once**
 * through `resolveScreenState`; every one routes its body through `ScreenBody`,
 * so there is no code path that skips the empty state. Every one takes
 * `headingLevel`, defaulting to 1 — a portal screen has exactly one `h1` and the
 * template's title is it; drop to 2 only inside a page that already has one.
 * Every one takes `copy` (a full `ScreenStateCopy`, merged by `screenCopy()`),
 * because GIGW requires the estate to be bilingual and a sentence baked into
 * markup cannot be translated. Every one takes `className`, `eyebrow`, `meta`
 * and — where it makes sense — `breadcrumb`, `notices` and `onRetry`.
 *
 * ---
 *
 * **`ChooserScreen`** — a finite set of mutually exclusive options. The handoff
 * draws this **three different ways under one name**: AVYAY and NAPDDR in an
 * 800px column with `radio-card` instances, SHRESHTA full-bleed at 1068 with
 * four hand-built frames and a CTA half the width. This ships the first.
 * `legend` is required and not decorative — without it a screen reader announces
 * "SHRESHTA Mode 2, radio button, 3 of 4" and never says what is being chosen.
 * `hideLegend` hides it visually where the page title already asks the question.
 * `value` is `undefined` until the reader picks; the group never invents a
 * default. An option this reader may never pick is left out of `options`; one
 * that is theirs and temporarily closed carries `unavailableReason`, which is
 * the answer they came for. `continueLabel`, `backLabel`, `onBack` and `error`
 * word and wire the foot of the screen; `emptyAction` is offered when the
 * register publishes no options at all. Continue is never disabled.
 *
 * **`FormScreen`** — one record that fits one screen. The boundary against
 * `WizardScreen` is a **count, not a feeling**: over eight fields, or a
 * statutory stage, and it is a wizard. `errors` renders `ErrorSummary`, which
 * takes focus — pass it only after a submit attempt, or it steals focus from the
 * field the reader is in. `requiredNote` is the mandatory-fields sentence and is
 * a prop so it can be translated; pass `null` for a form with none.
 * `submitting` keeps the control busy until the write settles, because the save
 * is confirmed and never optimistic. `dirty` and `savedAt` render the state line,
 * which is a polite live region. `submitLabel`, `cancelLabel`, `onCancel` and
 * `secondaryActions` ("Save as draft") word the action bar. **`dirty` shows
 * unsaved state; it cannot guard it** — the route guard is yours, because the
 * template does not own the router.
 *
 * **`ChecklistScreen`** — a required set of artefacts, each with its own verdict.
 * Four states, and the middle two are the point: `missing · attached · review ·
 * rejected`. A file that has left the citizen's machine is not yet a document
 * the department has accepted. Each `ChecklistItem` carries `label`,
 * `description`, `required` (default true), `state`, `fileName` — never
 * rewritten, because a citizen recognises their own file — `findings`, shown in
 * full rather than behind a disclosure, and `actions`. `groups` name runs of
 * requirements; `upload` is the batch dropzone slot; `footer` holds the wizard's
 * controls, which is why this template has no Continue of its own.
 *
 * **`ReviewScreen`** — everything entered, nothing yet committed. Sections are
 * numbered and **the numbers are the wizard's steps**, so "Edit" has an obvious
 * destination; the handoff's review frame carries 51 pairs in one grid.
 * `editHref` or `onEdit` wire the link and `editLabel` defaults to
 * `Edit <title>`, never a bare "Edit" — a page of nine sections otherwise offers
 * nine identical links. **The link must return the reader here**, which needs a
 * return parameter the template cannot add. `pairs` take `label`, `value` and
 * `wide`. `declaration`, `declarationChecked`, `onDeclarationChange` and
 * `declarationError` render the statutory panel; omit them where a wizard's
 * final step carries it. `intro`, `submitLabel`, `backLabel`, `onBack`,
 * `submitting` and `errors` do what they say.
 *
 * **`ConfirmationScreen`** — the receipt, and **the one template with no data
 * states**: it renders a fact the caller already holds, because a confirmation
 * that could be "loading" is one the citizen cannot trust. It exists because no
 * source draws it — the handoff's journey ends at submit, so a citizen has
 * nothing to quote at a counter. `reference` is required and is the screen: the
 * largest type on the page, selectable, above the fold, so it can be
 * photographed at a service centre without scrolling. `referenceLabel`,
 * `submittedAt`, `intro`, `facts`, `nextSteps` (a real ordered list, because it
 * genuinely is a sequence — each with `title`, `description`, `when`),
 * `nextStepsTitle`, `actions` and `support` fill the rest. Omit `nextSteps`
 * where the department publishes no process; an invented timeline is a promise
 * it has not made.
 *
 * **`DecisionScreen`** — the record and the verdict, side by side, scrolling
 * together, because an officer choosing "Return for correction" must see the
 * field they are returning it for. `record` takes a `RecordScreen` body or a
 * `DescriptionList` — bodies compose, chrome does not. `irreversibleNote` on an
 * option is stated **before** the decision, never in a dialogue afterwards.
 * Verdicts this role may not record are **omitted from `options`**, never passed
 * disabled. `legend`, `panelTitle`, `remarks`, `extras`, `errors`,
 * `submitLabel`, `cancelLabel`, `onCancel`, `submitting` and `status` complete it.
 *
 * **`CatalogueScreen`** — documents the reader opens rather than acts on. It
 * **always pages**; `Pagination` appears in exactly one of the estate's 265
 * portal pages, and the alternative people reach for is a scroll region inside a
 * card, which on a phone moves the list instead of the page. Each item's `kind`
 * is taken from the destination, never guessed from the title — a link labelled
 * "Guidelines" that opens a 40 MB scan on a rural connection is what that field
 * prevents. `href`, `external`, `download`, `badge`, `description` and `meta`
 * shape the row; `layout` switches rows to cards; `noun`/`pluralNoun` word the
 * count; `registerTotal` is the count line only; `page`, `totalPages`,
 * `hrefForPage` (prefer it — a page number belongs in the URL) and
 * `onPageChange` drive the pager; `filters`, `activeFilterCount`,
 * `onClearFilters`, `actions` and `emptyAction` do the rest.
 *
 * **`SearchScreen`** — ranked results, and the reason it is not a catalogue:
 * **`idle` renders differently from `empty`**. `asked` defaults to whether the
 * query is non-empty, so an untouched field shows the prompt rather than "No
 * records found". It does **not sort** — ranking is the caller's claim, and a
 * template that reordered results would overrule the relevance model. `query`,
 * `onQueryChange` and `onSubmit` drive the field; `searchLabel` names what is
 * being searched, not just "Search"; `placeholder`, `facets`,
 * `activeFilterCount`, `onClearFilters`, `children` (the results),
 * `resultCount`, `shownCount`, `page`, `totalPages`, `hrefForPage` and
 * `onPageChange` complete it.
 *
 * **`InboxScreen`** — dated attributed events. A notification, a comment and an
 * audit entry are **one object with three views**, so all three render through
 * `EventList` rather than three near-identical components that drift apart.
 * `events` newest first — the template does not sort. `label` names the list;
 * `grouping` defaults to `day`; `onMarkAllRead` and `markAllReadLabel` appear
 * only while something is unread, because a button that does nothing on most
 * visits teaches the reader to stop seeing it. `filters`, `activeFilterCount`,
 * `onClearFilters`, `actions`, `page`, `totalPages`, `hrefForPage` and
 * `onPageChange` are the usual set.
 *
 * **`SettingsScreen`** — configuration administered one value at a time. The
 * optimistic-save question is **settled**: saves are confirmed, and there is no
 * prop to change that. Each `SettingRow` takes `label`, `value`, `onSave` (which
 * may return a promise), `hint`, `maxLength` and `readOnlyReason` — a value that
 * cannot be edited says **why**, rather than simply not offering the control. A
 * `SettingsSection` takes `rows`, `children` for anything that is not a single
 * value, and `description`. `indexTitle` names the anchor list, which is real
 * links rather than scroll-spy: they survive with JavaScript off and are
 * shareable. `actions` sits in the page header.
 *
 * **`ReportScreen`** — printed and filed, not glanced at. It is the one template
 * that deliberately does **not page**, because page 1 of 9 is not a statement;
 * where the set is too large, narrow it with `criteria` rather than paging it.
 * It prints its own `issuer`, title and `generatedAt`, because the browser's
 * chrome identifies nothing, and its `criteria`, because a figure without its
 * filters cannot be reproduced. `columns` take `numeric` to right-align and set
 * tabular figures, so a currency column reads down the page. `rows`, `getRowId`,
 * `totals`, `footnotes`, `exportActions`, `filters`, `activeFilterCount` and
 * `onClearFilters` complete it.
 *
 * **`GalleryScreen`** — grid and list are **one capability at two densities**.
 * Every per-item action exists in both; a toggle that also removes controls is
 * one readers learn to distrust. `items` extend `LightboxItem` with `id`,
 * `thumbnail`, `meta` and `actions`. `label` names the collection, `layout` and
 * `onLayoutChange` drive the toggle, and focus returns to the tile that opened
 * the lightbox. `filters`, `activeFilterCount`, `onClearFilters`, `actions`,
 * `emptyAction`, `page`, `totalPages`, `hrefForPage` and `onPageChange` are the
 * usual set. Alt text and WebVTT captions are the caller's; `Lightbox` warns in
 * development when a video arrives without them and this template does not
 * suppress that.
 *
 * **`StatusScreen`** — **five** kinds, not one. `404` the address is wrong,
 * `403` the record exists and this role may not see it, `500` the service
 * failed, `maintenance` the failure was planned, `offline` the device is not
 * connected and nothing was lost. A single "Something went wrong" covers all
 * five and helps with none. `offline` has no `ErrorView` preset, so it borrows
 * the 500's shape and replaces every word — and withdraws the search field,
 * since an offline reader cannot reach a search page either. `title`,
 * `description`, `primaryAction`, `secondaryAction`, `wayfindingLinks` and
 * `searchUrl` override the presets. **It is not an error boundary**: a failed
 * feed belongs to `ScreenBody`'s error branch, which keeps the page's chrome.
 *
 * **`AuthScreen`** is an **alias** of `PortalLoginTemplate` — a re-export, no
 * second component and no render layer, so it is documented and staged there.
 * It exists so the decision table's eighteenth name resolves in the barrel. The
 * auth geometry was the one part of the handoff that needed no correction.
 */

interface DemoRow extends Record<string, unknown> {
  id: string;
  project: string;
  requested: string;
  status: string;
}

const ROWS: DemoRow[] = [
  { id: "DL/2016/0104728", project: "Hostel — North West Delhi", requested: "₹45.20 Lakh", status: "In Review" },
  { id: "DL/2016/0104728/01", project: "IPSrC Senior Citizen Home — Krishna", requested: "₹1.24 Cr", status: "In Review" },
  { id: "DL/2016/0104728/02", project: "SHRESHTA Class 9 School Support", requested: "₹12.50 Lakh", status: "Sanctioned" },
];

const SCHEMES: ChooserScreenProps["options"] = [
  {
    id: "avyay",
    label: "AVYAY — Atal Vayo Abhyuday Yojana",
    description: "Grant-in-aid for senior citizens' homes, day-care centres and mobile medicare units.",
    meta: "7 steps",
  },
  {
    id: "napddr",
    label: "NAPDDR — National Action Plan for Drug Demand Reduction",
    description: "Support for de-addiction centres and community peer-led interventions.",
    meta: "3 steps",
  },
  {
    id: "shreshta",
    label: "SHRESHTA Mode 2 — Residential Education Support",
    description: "Assistance to voluntary organisations running residential schools and hostels.",
    meta: "6 steps",
  },
  {
    id: "pmajay",
    label: "PM-AJAY — Adarsh Gram Component",
    description: "Village development grants under the Adarsh Gram component.",
    unavailableReason: "Applications for 2026–27 have closed.",
  },
];

const meta: Meta<ChooserScreenProps> = {
  title: "Templates/Screen templates — the other fourteen",
  component: ChooserScreen,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<ChooserScreenProps>;

/** A finite set, one Continue, and no disabled control while nothing is chosen. */
export const Chooser: Story = {
  render: function Render() {
    const [scheme, setScheme] = React.useState<string | undefined>();
    return (
      <ChooserScreen
        eyebrow="E-ANUDAAN"
        title="Select a Scheme"
        meta="Applications for 2026–27 close on 31 March 2027."
        legend="Which scheme are you applying under?"
        options={SCHEMES}
        value={scheme}
        onChange={setScheme}
        onContinue={() => undefined}
        onBack={() => undefined}
      />
    );
  },
};

/** The register publishes no options — a closed scheme window, not an error. */
export const ChooserEmpty: Story = {
  render: () => (
    <ChooserScreen
      eyebrow="E-ANUDAAN"
      title="Select a Scheme"
      legend="Which scheme are you applying under?"
      options={[]}
      onChange={() => undefined}
      onContinue={() => undefined}
      emptyAction={<Button appearance="outlined">Notify Me When Applications Open</Button>}
      copy={{
        idleTitle: "Search the Register",
        loadingLabel: "Loading schemes",
        errorTitle: "This Information Could Not Be Loaded",
        errorDescription: "The service did not respond. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "No Schemes Are Open for Application",
        emptyDescription: "Applications for 2026–27 have closed for every scheme in this portal.",
        filteredTitle: "No Schemes Match Your Filters",
        clearFiltersLabel: "Clear filters",
      }}
    />
  ),
};

/** Eight fields or fewer, one submit, and an action bar that stays reachable. */
export const Form: Story = {
  render: () => (
    <FormScreen
      eyebrow="E-ANUDAAN"
      title="Organisation Contact Details"
      meta="These details are used for all correspondence about your applications."
      onSubmit={() => undefined}
      onCancel={() => undefined}
      submitLabel="Save Changes"
      dirty
    >
      <FormSection title="Correspondence Address" columns={2}>
        <FormField label="Address Line 1" required>
          {(p) => <Input {...p} defaultValue="Kingsway Camp" />}
        </FormField>
        <FormField label="District" required>
          {(p) => <Input {...p} defaultValue="North West Delhi" />}
        </FormField>
      </FormSection>
    </FormScreen>
  ),
};

/** A failed submit: the summary takes focus and links each message to its control. */
export const FormWithErrors: Story = {
  render: () => (
    <FormScreen
      eyebrow="E-ANUDAAN"
      title="Organisation Contact Details"
      errors={[
        { fieldId: "pin", message: "Enter a six-digit PIN code." },
        { fieldId: "tel", message: "Enter a telephone number including the STD code." },
      ]}
      onSubmit={() => undefined}
      submitting={false}
    >
      <FormSection title="Correspondence Address" columns={2}>
        <FormField label="PIN Code" required error="Enter a six-digit PIN code.">
          {(p) => <Input {...p} id="pin" defaultValue="1100" />}
        </FormField>
        <FormField label="Telephone" required error="Enter a telephone number including the STD code.">
          {(p) => <Input {...p} id="tel" defaultValue="" />}
        </FormField>
      </FormSection>
    </FormScreen>
  ),
};

/** Four states per row, and findings shown in full rather than behind a disclosure. */
export const Checklist: Story = {
  render: () => (
    <ChecklistScreen
      eyebrow="AVYAY · STEP 5 OF 7"
      title="Upload Documents"
      meta="Each document must be a PDF under 5 MB."
      footer={
        <>
          <Button appearance="outlined">Back</Button>
          <Button>Save and Continue</Button>
        </>
      }
      groups={[
        {
          id: "org",
          title: "Organisation Documents",
          items: [
            { id: "reg", label: "Registration certificate", state: "attached", fileName: "HSS-registration-1932.pdf" },
            { id: "darpan", label: "NGO-Darpan acknowledgement", state: "review", fileName: "darpan-LGN.pdf" },
            {
              id: "pan",
              label: "PAN card of the organisation",
              state: "rejected",
              fileName: "pan-scan.pdf",
              findings: ["The scan is not readable at the PAN number.", "Upload a colour scan at 300 dpi or higher."],
              actions: <Button appearance="outlined" size="sm">Upload again</Button>,
            },
            { id: "fcra", label: "FCRA certificate", required: false, state: "missing" },
          ],
        },
      ]}
    />
  ),
};

/** Numbered sections whose numbers are the wizard's steps, and a declaration. */
export const Review: Story = {
  render: function Render() {
    const [agreed, setAgreed] = React.useState(false);
    return (
      <ReviewScreen
        eyebrow="AVYAY · STEP 7 OF 7"
        title="Review & Submit"
        intro="Check every answer before submitting. Once submitted, an application can only be changed if the department returns it for correction."
        sections={[
          {
            id: "org",
            title: "Organisation Details",
            editHref: "#",
            pairs: [
              { label: "Organisation", value: "Harijan Sevak Sangh" },
              { label: "NGO-Darpan ID", value: "LGN/2016/0104728" },
              { label: "Address", value: "Kingsway Camp, North West Delhi 110009", wide: true },
            ],
          },
          {
            id: "grant",
            title: "Grant Sought",
            onEdit: () => undefined,
            editLabel: "Edit the grant amount",
            pairs: [
              { label: "Amount Requested", value: "₹45.20 Lakh" },
              { label: "Own Contribution", value: "₹5.02 Lakh" },
            ],
          },
        ]}
        declaration={<ul><li>The information given above is true to the best of my knowledge.</li></ul>}
        declarationChecked={agreed}
        onDeclarationChange={setAgreed}
        declarationError={agreed ? undefined : undefined}
        onSubmit={() => undefined}
        onBack={() => undefined}
      />
    );
  },
};

/** The receipt. No data states, because a confirmation that could be loading is not one. */
export const Confirmation: Story = {
  render: () => (
    <ConfirmationScreen
      eyebrow="AVYAY"
      reference="DL/2026/AVY/0104728"
      submittedAt="6 September 2026 at 3:14 pm"
      intro="Your application has been received. Keep this reference number — you will need it for any correspondence about this application."
      facts={[
        { label: "Scheme", value: "AVYAY — Atal Vayo Abhyuday Yojana" },
        { label: "Amount Requested", value: "₹45.20 Lakh" },
      ]}
      nextSteps={[
        { title: "District Verification", description: "The District Social Welfare Officer verifies the records and the site.", when: "Within 30 working days" },
        { title: "Sanction", description: "The Ministry communicates the decision and the released amount." },
      ]}
      actions={<Button iconLeft={<Icon name="download" size={20} />}>Download Receipt</Button>}
      support="For help, contact the E-Anudaan helpdesk on 1800 11 0001."
    />
  ),
};

/** The record and the verdict together, with the irreversible note above the submit. */
export const Decision: Story = {
  render: function Render() {
    const [verdict, setVerdict] = React.useState<string | undefined>("reject");
    return (
      <DecisionScreen
        eyebrow="PROGRAMME DIVISION"
        title="Hostel — North West Delhi"
        meta="Application DL/2016/0104728 · Harijan Sevak Sangh"
        status={<Badge status="info">Awaiting Decision</Badge>}
        legend="What is your decision on this application?"
        options={[
          { id: "approve", label: "Recommend for sanction", description: "Forwards the application to the Finance Division." },
          { id: "return", label: "Return for correction", description: "The applicant may correct and resubmit within 15 days." },
          {
            id: "reject",
            label: "Reject",
            description: "Closes the application.",
            irreversibleNote: "A rejected application cannot be reopened. The organisation must apply again in the next cycle.",
          },
        ]}
        value={verdict}
        onChange={setVerdict}
        record={
          <Card>
            <CardBody>
              <DescriptionList
                columns={2}
                items={[
                  { term: "Organisation", value: "Harijan Sevak Sangh" },
                  { term: "Amount Requested", value: "₹45.20 Lakh" },
                  { term: "Documents", value: "9 of 9 accepted" },
                  { term: "District Verification", value: "Completed 28 August 2026" },
                ]}
              />
            </CardBody>
          </Card>
        }
        remarks={
          <FormField label="Remarks" hint="Recorded on the application and visible to the applicant.">
            {(p) => <Textarea {...p} rows={3} />}
          </FormField>
        }
        onSubmit={() => undefined}
        onCancel={() => undefined}
      />
    );
  },
};

/** Documents the reader opens, always paged, each stating its kind and size. */
export const Catalogue: Story = {
  render: () => (
    <CatalogueScreen
      eyebrow="E-ANUDAAN"
      title="Scheme Guidelines & Circulars"
      noun="document"
      registerTotal={212}
      page={1}
      totalPages={22}
      onPageChange={() => undefined}
      filters={
        <Select aria-label="Filter by scheme" defaultValue="">
          <option value="">All schemes</option>
          <option value="avyay">AVYAY</option>
        </Select>
      }
      items={[
        { id: "1", title: "AVYAY Scheme Guidelines, revised 2026", meta: "No. 20-11/2026-SD · 14 August 2026", kind: "PDF · 2.4 MB", href: "#", download: true, badge: "Revised" },
        { id: "2", title: "NAPDDR Grant-in-Aid Application Format", meta: "No. 18-4/2026-DDR", kind: "PDF · 640 KB", href: "#", download: true },
        { id: "3", title: "Utilisation Certificate Format (GFR 12-A)", meta: "Ministry of Finance", kind: "PDF · 210 KB", href: "#", external: true },
      ]}
    />
  ),
};

/** Nothing typed yet. This is `idle`, and it must not read as "no records found". */
export const SearchIdle: Story = {
  render: () => (
    <SearchScreen
      eyebrow="E-ANUDAAN"
      title="Search Applications"
      query=""
      onQueryChange={() => undefined}
      searchLabel="Search applications by project, reference number or organisation"
      placeholder="Try “hostel”"
      shownCount={0}
    />
  ),
};

/** Typed, ranked, counted — and the count is announced. */
export const SearchResults: Story = {
  render: function Render() {
    const [query, setQuery] = React.useState("hostel");
    const matches = ROWS.filter(
      (r) => query.trim().length > 0 && r.project.toLowerCase().includes(query.trim().toLowerCase()),
    );
    return (
      <SearchScreen
        eyebrow="E-ANUDAAN"
        title="Search Applications"
        query={query}
        onQueryChange={setQuery}
        onSubmit={() => undefined}
        searchLabel="Search applications by project, reference number or organisation"
        shownCount={matches.length}
        resultCount={matches.length}
        facets={
          <Select aria-label="Filter by financial year" defaultValue="">
            <option value="">All financial years</option>
            <option value="2026">2026–27</option>
          </Select>
        }
      >
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--sa-padding-12)" }}>
          {matches.map((r) => (
            <li key={r.id}>
              <Card>
                <CardBody>
                  <strong>{r.project}</strong>
                  <div>{r.id} · {r.requested} · {r.status}</div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </SearchScreen>
    );
  },
};

/** Dated attributed events, grouped by day, with unread marked as a word. */
export const Inbox: Story = {
  render: () => (
    <InboxScreen
      eyebrow="E-ANUDAAN"
      title="Notifications"
      label="Notifications"
      onMarkAllRead={() => undefined}
      events={[
        {
          id: "1",
          at: "2026-09-06T09:14:00+05:30",
          actor: "District Social Welfare Officer",
          actorRole: "North West Delhi",
          action: "Returned for correction",
          subject: "Application DL/2016/0104728",
          note: "The PAN scan is not readable at the PAN number.",
          tone: "warning",
          unread: true,
        },
        { id: "2", at: "2026-09-05T16:40:00+05:30", action: "Documents verified", subject: "Application DL/2016/0104728/02", tone: "success", unread: true },
        { id: "3", at: "2026-09-04T11:02:00+05:30", actor: "Programme Division", action: "Recommended for sanction", tone: "success" },
      ]}
    />
  ),
};

/** Anchor links beside inline-editable rows, and a read-only value that says why. */
export const Settings: Story = {
  render: () => (
    <SettingsScreen
      eyebrow="E-ANUDAAN"
      title="Organisation Settings"
      sections={[
        {
          id: "identity",
          title: "Organisation Identity",
          description: "Drawn from NGO-Darpan when the account was created.",
          rows: [
            {
              id: "name",
              label: "Registered name",
              value: "Harijan Sevak Sangh",
              readOnlyReason: "Set from NGO-Darpan. Correct it there and it will update here.",
              onSave: () => undefined,
            },
            { id: "contact", label: "Contact person", value: "Ram Prakash", hint: "The person the department writes to.", maxLength: 80, onSave: () => undefined },
          ],
        },
        {
          id: "bank",
          title: "Bank Details",
          children: <Card><CardBody>A table of accounts goes here — not everything is a single value.</CardBody></Card>,
        },
      ]}
    />
  ),
};

/** Printed and filed. No pager, a printed masthead, and the criteria in force. */
export const Report: Story = {
  render: () => (
    <ReportScreen
      eyebrow="E-ANUDAAN"
      title="Grant Utilisation Statement"
      issuer="Department of Social Justice & Empowerment"
      generatedAt="6 September 2026"
      criteria={[
        { label: "Financial Year", value: "2026–27" },
        { label: "Scheme", value: "AVYAY" },
      ]}
      exportActions={<Button appearance="outlined" size="sm" iconLeft={<Icon name="download" size={20} />}>Export CSV</Button>}
      columns={[
        { key: "id", header: "Reference" },
        { key: "project", header: "Project" },
        { key: "requested", header: "Requested", numeric: true },
        { key: "status", header: "Status" },
      ]}
      rows={ROWS}
      getRowId={(row) => row.id}
      totals={(key) => (key === "id" ? "Total" : key === "requested" ? "₹1.82 Cr" : null)}
      footnotes="Figures are as recorded in the E-Anudaan Management Information System on the date of generation."
    />
  ),
};

/** Grid and list at one capability, two densities. */
export const Gallery: Story = {
  render: function Render() {
    const [layout, setLayout] = React.useState<"grid" | "list">("grid");
    const px = "data:image/gif;base64,R0lGODlhAQABAIAAAMLDxwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
    return (
      <GalleryScreen
        eyebrow="AVYAY"
        title="Site Photographs"
        label="Photographs from the Krishna Nagar site inspection"
        layout={layout}
        onLayoutChange={setLayout}
        items={[
          { id: "1", type: "image", src: px, alt: "Dormitory block, east elevation", caption: "Dormitory block, east elevation", meta: "28 August 2026", actions: <Button size="sm" appearance="text">Remove</Button> },
          { id: "2", type: "image", src: px, alt: "Kitchen and dining hall", caption: "Kitchen and dining hall", meta: "28 August 2026", actions: <Button size="sm" appearance="text">Remove</Button> },
          { id: "3", type: "image", src: px, alt: "Medical room", caption: "Medical room", meta: "28 August 2026", actions: <Button size="sm" appearance="text">Remove</Button> },
        ]}
      />
    );
  },
};

/** Five kinds, five sentences. This is the one a citizen most often meets. */
export const Status: Story = {
  render: () => (
    <StatusScreen
      kind="403"
      primaryAction={{ label: "Return to Dashboard", href: "#", icon: "dashboard" }}
      searchUrl={null}
    />
  ),
};

/** The device is not connected — not the department's failure, and nothing was lost. */
export const StatusOffline: Story = {
  render: () => (
    <StatusScreen
      kind="offline"
      primaryAction={{ label: "Try Again", onClick: () => undefined, icon: "refresh" }}
      secondaryAction={{ label: "Return to Dashboard", href: "#" }}
      wayfindingLinks={[]}
    />
  ),
};
