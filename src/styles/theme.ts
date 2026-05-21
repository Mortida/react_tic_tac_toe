import type { ThemeName } from "../types/settings";

export type Theme = {
  bg: string;
  card: string;
  text: string;
};

export const themes: Record<ThemeName, Theme> = {
  dark: {
    bg: "#0f172a",
    card: "#1e293b",
    text: "#fff",
  },
  light: {
    bg: "#f1f5f9",
    card: "#fff",
    text: "#000",
  },
  neon: {
    bg: "#050505",
    card: "#111",
    text: "#00ffcc",
  },
};
