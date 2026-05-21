import { useMemo } from "react";
import type { Settings } from "../types/settings";

export function useAudio(settings: Settings) {
  return useMemo(() => {
    /**
     * Creates a new Audio element each time (stateless, safe).
     * We intentionally do NOT reuse Audio instances across calls:
     * rapid clicks would otherwise reset a still-playing sound.
     */
    const play = (file?: string | null): void => {
      if (!file || !settings.soundEnabled) return;
      const audio = new Audio(file);
      audio.play().catch(() => {
        // Silently swallow autoplay-policy / user-gesture errors.
      });
    };

    return {
      click: (player: "X" | "O") => {
        const perPlayer =
          settings.playerSounds[player.toLowerCase() as "x" | "o"];
        play(perPlayer ?? settings.sounds.click);
      },
      win: () => play(settings.sounds.win),
      draw: () => play(settings.sounds.draw),
      round: () => play(settings.sounds.round),
      reset: () => play(settings.sounds.reset),
    };
  }, [settings]);
}
