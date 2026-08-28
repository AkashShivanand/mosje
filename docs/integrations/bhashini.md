# Bhashini — language translation

**Status:** prototype demonstrates it; the live site integrates it.

> **The prototype is not getting Bhashini credentials, deliberately.** Registration
> and the live API belong to the production site. What this repository holds is a
> working integration plus a bundled Hindi dictionary, so the behaviour can be
> shown, reviewed and handed over without anyone waiting on an account. The
> language picker says which languages translate here and which wait for the live
> site — see `PROTOTYPE_MODE` in `lib/bhashini/languages.ts`.
**Owner:** MoSJE digital estate.
**Live surface:** the website masthead's language control (`/website`).

[Bhashini](https://bhashini.gov.in/) is MeitY's National Language Translation
Mission. It is the sanctioned route for translating a Government of India site,
and it covers the 22 languages of the Eighth Schedule.

---

## What is built

The language control in the masthead opens a picker of 13 languages. Choosing one
sets `lang` and `dir` on `<html>` and translates the chrome — the identity lines,
the navigation, the search placeholder, the account actions.

**It works today with no credentials.** Hindi comes from a bundled dictionary of
chrome strings, so the switch is demonstrable before anyone has been through
Bhashini registration. Every other language needs the API and, until it is
configured, falls back to readable English rather than to blanks.

```
apps/hub/src/lib/bhashini/
  languages.ts   the 13 languages, their native names, ISO codes and direction
  server.ts      server-only ULCA client — the two-call flow, with caching
  fallback.ts    bundled Hindi chrome strings + the PROTECTED list
apps/hub/src/app/api/bhashini/translate/route.ts
                 the browser's only door to Bhashini; keeps the key server-side
apps/hub/src/components/i18n/
  translation-provider.tsx  the runtime: `t()`, `<T>`, batching, caching
  language-dialog.tsx       the picker
```

---

## For whoever integrates the live site

Nothing below is needed to run or review the prototype. It is the handover.

Bhashini's API is two calls, not one, and this matters when you debug it:

1. **Pipeline config** — `POST https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline`
   with `userID` and `ulcaApiKey` headers. It answers with the `serviceId` of a
   model that serves your language pair, *and* with the address and key for the
   second call. You cannot skip it and hard-code a `serviceId` — which model
   serves a pair is Bhashini's decision and it changes.
2. **Compute** — `POST` to the `callbackUrl` the first call returned, carrying the
   `inferenceApiKey` it returned.

`server.ts` caches step 1 per language pair for an hour, so only step 2 runs per
translation.

### Credentials

On the live site: register the organisation and the domain at
[dashboard.bhashini.co.in](https://dashboard.bhashini.co.in/), then set three
variables in the deployment environment — **never in the repository**:

```
BHASHINI_USER_ID=…
BHASHINI_API_KEY=…
BHASHINI_PIPELINE_ID=…
```

On Vercel these go in Project → Settings → Environment Variables. Locally they go
in `apps/hub/.env.local`, which is gitignored. With any of the three missing the
route reports `configured: false` and the fallback takes over; nothing breaks —
which is exactly the state the prototype runs in, permanently and on purpose.

Set `PROTOTYPE_MODE = false` in `lib/bhashini/languages.ts` at the same time, so
the picker stops captioning twelve languages "Live site".

### Checking it

```bash
curl -s -X POST http://localhost:3007/api/bhashini/translate \
  -H 'Content-Type: application/json' \
  -d '{"target":"ta","strings":["Documents","Events & Gallery"]}'
```

`"source": "bhashini"` means the API answered. `"source": "fallback"` means the
bundled dictionary did. `"configured": false` means the variables are not set.

---

## Two rules that are not negotiable

**The Ministry and Department names are never machine-translated.** They have
official Hindi forms and no official form in most other languages; a neural model
asked for "Department of Social Justice & Empowerment" in Tamil will invent a
plausible one, and an invented department name on a government masthead is a
factual error. Those strings are in `PROTECTED` in `fallback.ts` and pass through
untranslated unless an authoritative form is supplied. **Add to that list before
adding a new proper noun to the header.**

**Untranslated never means blank.** Every failure path — no credentials, Bhashini
down, a string the model returned empty — renders the English source. On a
government page an English label is a mild failure; an empty one is a broken page.

---

## Why not the official website plugin

Bhashini publishes a drop-in script — `https://translation-plugin.bhashini.co.in/v3/website_translation_utility.js`
— that translates a whole page with no application code. It is the right answer
for a server-rendered CMS site and it is worth revisiting, but not for this app:

- **It walks and rewrites the DOM.** React believes it owns those text nodes.
  A script rewriting them underneath produces hydration errors and can drop input
  mid-typing.
- **It needs the domain registered and approved** before it renders at all, so it
  cannot run on `localhost` or on a Vercel preview URL — the two places this
  prototype is actually reviewed.
- **It translates everything, including the Department's name.** See above.

The API integration gives control over exactly those three things at the cost of
naming the strings we want translated. If the estate later moves the public site
to a server-rendered CMS, the plugin becomes the better trade and the switch is a
script tag plus deleting `components/i18n`.

---

## Known gaps

- **Only the chrome is translated, and only into Hindi here.** Page content needs
  `<T>` applied, or a build-time pass. Translating 86 website pages on the fly per
  reader is not affordable; the next step is translating at build time and caching.
  On the prototype this is moot — there are no credentials to spend.
- **RTL needs a pass.** Turning on Urdu surfaced that the masthead flips correctly
  but the shared `Search` field clips its placeholder — its icon padding is still
  physical (`padding-left`) where it should be logical (`padding-inline-start`).
- **No language in the URL.** The choice lives in `localStorage`, so it is not
  shareable and not indexable. Real multilingual delivery needs `/hi/…` routes
  with `hreflang`; that is a routing change, not a translation one.
