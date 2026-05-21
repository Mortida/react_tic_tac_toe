/**
 * Thin localStorage wrapper.
 * Both functions fail silently so callers don't need to handle storage errors
 * (e.g. Safari Private Mode throws on setItem).
 */

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or unavailable (e.g. private browsing) — ignore.
  }
}

export function load<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (data === null) return fallback;
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}
