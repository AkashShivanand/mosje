/**
 * Load a third-party embed script once per page. Success is cached (the tag stays);
 * failure is not — the tag is removed so the next card that asks gets a real second
 * attempt rather than the memory of a dropped connection.
 */
const pending = new Map<string, Promise<void>>();

export function loadEmbedScript(src: string, id: string): Promise<void> {
  const cached = pending.get(id);
  if (cached) return cached;
  const p = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.id = id;
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      s.remove();
      pending.delete(id);
      reject(new Error(`embed script failed: ${src}`));
    };
    document.body.appendChild(s);
  });
  pending.set(id, p);
  return p;
}
