import "server-only";

import { SOURCE_LANGUAGE } from "./languages";

/**
 * Bhashini (bhashini.gov.in) — the National Language Translation Mission's
 * translation service, reached through its ULCA / Dhruva APIs.
 *
 * ── WHY A SERVER MODULE AND NOT A BROWSER CALL ────────────────────────────────
 * The ULCA credentials are secrets. Calling Bhashini from the browser would put
 * them in the bundle, so everything here is `server-only` and the browser talks
 * to our own /api/bhashini/translate instead. That route is also the only place
 * that can batch and cache, which matters: the compute call is billed per request.
 *
 * ── THE TWO CALLS, IN ORDER ───────────────────────────────────────────────────
 * Bhashini does not have one translate endpoint. It has two calls:
 *
 *   1. PIPELINE CONFIG — POST to ULCA with your pipeline ID and the task you want.
 *      It answers with the `serviceId` of a model that can do that language pair,
 *      AND with the address and key for the second call. You cannot skip it and
 *      hard-code a serviceId: which model serves a pair is Bhashini's decision and
 *      it changes.
 *
 *   2. COMPUTE — POST the text to the `callbackUrl` the first call returned, with
 *      the `inferenceApiKey` it returned, naming the `serviceId` it returned.
 *
 * The first call's answer is stable for a language pair, so it is cached in
 * module memory for CONFIG_TTL_MS. Only the second call runs per translation.
 *
 * ── CREDENTIALS ───────────────────────────────────────────────────────────────
 * Three variables, none of them in the repository, none of them ever committed:
 *
 *   BHASHINI_USER_ID      — the User ID from dashboard.bhashini.co.in
 *   BHASHINI_API_KEY      — the ULCA API key issued with it
 *   BHASHINI_PIPELINE_ID  — the pipeline to use (MeitY publishes a default one)
 *
 * With any of them missing this module reports `configured: false` and translates
 * nothing. That is not an error state — it is how the prototype runs for anyone
 * who has not been issued credentials, and the caller falls back to the bundled
 * Hindi dictionary. See docs/integrations/bhashini.md.
 */

const ULCA_CONFIG_URL =
  "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";

/** How long a resolved pipeline config is reused before being fetched again. */
const CONFIG_TTL_MS = 60 * 60 * 1000;

/** Bhashini bills per compute call; a runaway page should not be able to spend. */
const MAX_STRINGS_PER_REQUEST = 100;
const MAX_CHARS_PER_STRING = 2_000;

export interface BhashiniCredentials {
  userId: string;
  apiKey: string;
  pipelineId: string;
}

export function readCredentials(): BhashiniCredentials | null {
  const userId = process.env.BHASHINI_USER_ID;
  const apiKey = process.env.BHASHINI_API_KEY;
  const pipelineId = process.env.BHASHINI_PIPELINE_ID;
  if (!userId || !apiKey || !pipelineId) return null;
  return { userId, apiKey, pipelineId };
}

export function isConfigured(): boolean {
  return readCredentials() !== null;
}

interface ResolvedPipeline {
  serviceId: string;
  callbackUrl: string;
  authHeaderName: string;
  authHeaderValue: string;
  resolvedAt: number;
}

const pipelineCache = new Map<string, ResolvedPipeline>();

/**
 * Step 1. Ask ULCA which model serves `en -> target`, and where to send the text.
 *
 * The response nests deeply and the names are not guessable, so they are read
 * defensively: a shape change from Bhashini should surface as a clear error here
 * rather than as `undefined` arriving at the compute call.
 */
async function resolvePipeline(
  target: string,
  creds: BhashiniCredentials,
): Promise<ResolvedPipeline> {
  const cached = pipelineCache.get(target);
  if (cached && Date.now() - cached.resolvedAt < CONFIG_TTL_MS) return cached;

  const res = await fetch(ULCA_CONFIG_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userID: creds.userId,
      ulcaApiKey: creds.apiKey,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "translation",
          config: { language: { sourceLanguage: SOURCE_LANGUAGE, targetLanguage: target } },
        },
      ],
      pipelineRequestConfig: { pipelineId: creds.pipelineId },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Bhashini pipeline config failed for en→${target}: ${res.status} ${res.statusText}`,
    );
  }

  const json = (await res.json()) as {
    pipelineResponseConfig?: { taskType?: string; config?: { serviceId?: string }[] }[];
    pipelineInferenceAPIEndPoint?: {
      callbackUrl?: string;
      inferenceApiKey?: { name?: string; value?: string };
    };
  };

  const serviceId = json.pipelineResponseConfig?.[0]?.config?.[0]?.serviceId;
  const endpoint = json.pipelineInferenceAPIEndPoint;
  const callbackUrl = endpoint?.callbackUrl;
  const authHeaderName = endpoint?.inferenceApiKey?.name;
  const authHeaderValue = endpoint?.inferenceApiKey?.value;

  if (!serviceId || !callbackUrl || !authHeaderName || !authHeaderValue) {
    throw new Error(
      `Bhashini pipeline config for en→${target} was missing a serviceId or an inference endpoint. ` +
        `The response shape may have changed.`,
    );
  }

  const resolved: ResolvedPipeline = {
    serviceId,
    callbackUrl,
    authHeaderName,
    authHeaderValue,
    resolvedAt: Date.now(),
  };
  pipelineCache.set(target, resolved);
  return resolved;
}

/**
 * Step 2. Translate. Bhashini returns one output per input, IN ORDER, so the
 * results are zipped back by index — there is no id to match on.
 *
 * A string that comes back empty keeps its English source rather than blanking
 * the interface. On a government page a missing label is worse than an
 * untranslated one.
 */
export async function translateStrings(
  strings: string[],
  target: string,
): Promise<string[]> {
  const creds = readCredentials();
  if (!creds) throw new Error("Bhashini is not configured");
  if (target === SOURCE_LANGUAGE) return strings;

  const input = strings
    .slice(0, MAX_STRINGS_PER_REQUEST)
    .map((s) => ({ source: s.slice(0, MAX_CHARS_PER_STRING) }));

  const pipeline = await resolvePipeline(target, creds);

  const res = await fetch(pipeline.callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [pipeline.authHeaderName]: pipeline.authHeaderValue,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "translation",
          config: {
            language: { sourceLanguage: SOURCE_LANGUAGE, targetLanguage: target },
            serviceId: pipeline.serviceId,
          },
        },
      ],
      inputData: { input },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Bhashini translation failed for en→${target}: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as {
    pipelineResponse?: { taskType?: string; output?: { source?: string; target?: string }[] }[];
  };

  const output =
    json.pipelineResponse?.find((t) => t.taskType === "translation")?.output ?? [];

  return strings.map((source, i) => output[i]?.target?.trim() || source);
}
