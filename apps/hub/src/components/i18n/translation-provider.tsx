"use client";

import * as React from "react";

import { findLanguage, SOURCE_LANGUAGE } from "@/lib/bhashini/languages";

/**
 * The translation runtime.
 *
 * ── HOW IT WORKS ──────────────────────────────────────────────────────────────
 * Components ask for a string with `t("Documents")` or `<T>Documents</T>`. On the
 * first render in a non-English language the string is not known yet, so `t`
 * returns the English source AND registers it. One microtask later every string
 * registered on that pass goes to /api/bhashini/translate as a SINGLE batch, and
 * the answers re-render the tree.
 *
 * That ordering is the whole design. Translating per-string would be one billed
 * Bhashini call per label; translating on a timer would flash. Registering during
 * render and flushing once after it means a language switch costs exactly one
 * request, however many labels are on screen.
 *
 * ── WHY THE SOURCE TEXT IS THE KEY ────────────────────────────────────────────
 * There are no message ids. The English string IS the key, which means a
 * developer writes `<T>Documents</T>` and is done — no key to invent, no
 * catalogue to keep in step, and an untranslated string degrades to readable
 * English instead of to `nav.documents.label`. The cost is that editing the
 * English invalidates its translation, which is the correct behaviour anyway.
 *
 * ── WHAT IT DOES NOT DO ───────────────────────────────────────────────────────
 * It does not walk the DOM. Bhashini's own website plugin does, and that is why
 * it fights React: a script rewriting text nodes underneath a framework that
 * believes it owns them produces hydration errors and lost input. Only strings
 * that opt in through `t`/`<T>` are ever sent.
 */

interface TranslationState {
  lang: string;
  dir: "ltr" | "rtl";
  /** True while a batch is in flight — the switcher shows a pending state. */
  busy: boolean;
  /** Set after a response says Bhashini is not configured on this deployment. */
  notice: string | null;
  setLang: (code: string) => void;
  t: (source: string) => string;
}

const Ctx = React.createContext<TranslationState | null>(null);

const STORAGE_KEY = "mosje.lang";
const cacheKey = (lang: string) => `mosje.translations.${lang}`;

function readCache(lang: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(cacheKey(lang)) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function writeCache(lang: string, map: Record<string, string>): void {
  try {
    sessionStorage.setItem(cacheKey(lang), JSON.stringify(map));
  } catch {
    /* Private mode, or the quota is full. Translation still works this session. */
  }
}

export function TranslationProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [lang, setLangState] = React.useState(SOURCE_LANGUAGE);
  const [table, setTable] = React.useState<Record<string, string>>({});
  const [busy, setBusy] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);

  /** Every source string this page has asked for, in any language. */
  const seen = React.useRef<Set<string>>(new Set());
  /** Strings registered since the last flush. */
  const queue = React.useRef<Set<string>>(new Set());
  const flushTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // `lang` and `dir` on <html> are not decoration: assistive technology picks its
  // voice from them (WCAG 3.1.1), and `dir` is what turns the interface around
  // for Urdu.
  React.useEffect(() => {
    const meta = findLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = meta?.dir ?? "ltr";
  }, [lang]);

  const request = React.useCallback(
    async (strings: string[], target: string) => {
      if (strings.length === 0 || target === SOURCE_LANGUAGE) return;
      setBusy(true);
      try {
        const res = await fetch("/api/bhashini/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target, strings }),
        });
        if (!res.ok) return;
        const json = (await res.json()) as {
          translations?: Record<string, string>;
          notice?: string;
          target?: string;
        };
        // The reader may have switched again while this was in flight.
        if (json.target !== target) return;
        const next = json.translations ?? {};
        setTable((prev) => {
          const merged = { ...prev, ...next };
          writeCache(target, merged);
          return merged;
        });
        setNotice(json.notice ?? null);
      } catch {
        /* Offline. The English source is already on screen; leave it there. */
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const flush = React.useCallback(() => {
    const pending = [...queue.current];
    queue.current.clear();
    if (pending.length > 0) void request(pending, lang);
  }, [lang, request]);

  const t = React.useCallback(
    (source: string): string => {
      if (lang === SOURCE_LANGUAGE) return source;
      seen.current.add(source);
      const hit = table[source];
      if (hit !== undefined) return hit;

      // Unknown: register it and show the English meanwhile.
      if (!queue.current.has(source)) {
        queue.current.add(source);
        if (flushTimer.current === undefined) {
          flushTimer.current = setTimeout(() => {
            flushTimer.current = undefined;
            flush();
          }, 0);
        }
      }
      return source;
    },
    [lang, table, flush],
  );

  const setLang = React.useCallback(
    (code: string) => {
      if (!findLanguage(code) || code === lang) return;
      window.localStorage.setItem(STORAGE_KEY, code);
      setNotice(null);
      setLangState(code);

      if (code === SOURCE_LANGUAGE) {
        setTable({});
        return;
      }
      // Re-translate everything already on screen, from cache where possible.
      const cached = readCache(code);
      setTable(cached);
      const missing = [...seen.current].filter((s) => cached[s] === undefined);
      if (missing.length > 0) void request(missing, code);
    },
    [lang, request],
  );

  /**
   * Restore the reader's choice.
   *
   * Deferred, and through `setLang` rather than the raw setter, for two separate
   * reasons. The server and the first client render must both say English or
   * hydration mismatches, so the restore cannot happen during render. And setting
   * state synchronously inside an effect is the cascading-render pattern React
   * warns about — reading localStorage is subscribing to an external system, so
   * the update belongs in a callback, not in the effect body. Going through
   * `setLang` also means the restore warms the session cache and re-requests
   * anything missing, exactly as a manual switch does.
   */
  const restored = React.useRef(false);
  React.useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved || !findLanguage(saved) || saved === SOURCE_LANGUAGE) return;
    const id = setTimeout(() => setLang(saved), 0);
    return () => clearTimeout(id);
  }, [setLang]);

  const value = React.useMemo<TranslationState>(
    () => ({ lang, dir: findLanguage(lang)?.dir ?? "ltr", busy, notice, setLang, t }),
    [lang, busy, notice, setLang, t],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Read the translation runtime.
 *
 * Returns a working no-op outside a provider so a component can be dropped into
 * a portal that has not adopted translation yet without crashing — it simply
 * renders English.
 */
export function useTranslation(): TranslationState {
  const ctx = React.useContext(Ctx);
  return (
    ctx ?? {
      lang: SOURCE_LANGUAGE,
      dir: "ltr",
      busy: false,
      notice: null,
      setLang: () => {},
      t: (s: string) => s,
    }
  );
}

/** `<T>Documents</T>` — the string is the key. Children must be a plain string. */
export function T({ children }: { children: string }): React.JSX.Element {
  const { t } = useTranslation();
  return <>{t(children)}</>;
}
