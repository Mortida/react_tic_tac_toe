import { useCallback, useState } from "react";
import { load, save } from "../utils/storage";
import type { Settings } from "../types/settings";

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  soundEnabled: true,
  sounds: {
    click: null,
    win: null,
    draw: null,
    round: null,
    reset: null,
  },
  playerSounds: {
    x: null,
    o: null,
  },
};

/** Strips blob: URLs (they are invalidated on page reload) and validates string type. */
function sanitizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (value.startsWith("blob:")) return null;
  return value;
}

function mergeSettings(saved: Partial<Settings>): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    sounds: {
      click: sanitizeUrl(saved.sounds?.click ?? DEFAULT_SETTINGS.sounds.click),
      win: sanitizeUrl(saved.sounds?.win ?? DEFAULT_SETTINGS.sounds.win),
      draw: sanitizeUrl(saved.sounds?.draw ?? DEFAULT_SETTINGS.sounds.draw),
      round: sanitizeUrl(saved.sounds?.round ?? DEFAULT_SETTINGS.sounds.round),
      reset: sanitizeUrl(saved.sounds?.reset ?? DEFAULT_SETTINGS.sounds.reset),
    },
    playerSounds: {
      x: sanitizeUrl(saved.playerSounds?.x ?? DEFAULT_SETTINGS.playerSounds.x),
      o: sanitizeUrl(saved.playerSounds?.o ?? DEFAULT_SETTINGS.playerSounds.o),
    },
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = load<Partial<Settings>>("settings", {});
    return mergeSettings(saved);
  });

  const update = useCallback((newSettings: Settings) => {
    setSettings(newSettings);
    save("settings", newSettings);
  }, []);

  return { settings, update };
}
