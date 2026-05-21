export type ThemeName = "dark" | "light" | "neon";

export type SoundType = {
  click: string | null;
  win: string | null;
  draw: string | null;
  round: string | null;
  reset: string | null;
};

export type PlayerSounds = {
  x: string | null;
  o: string | null;
};

export type Settings = {
  theme: ThemeName;
  soundEnabled: boolean;
  sounds: SoundType;
  playerSounds: PlayerSounds;
};
