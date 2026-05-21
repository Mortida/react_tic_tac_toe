import { useEffect, useRef, useState } from "react";
import type { Settings } from "../types/settings";
import { uploadSound } from "../utils/sound";

type Props = {
  settings: Settings;
  update: (settings: Settings) => void;
};

type Section = "General" | "Shared Sounds" | "Player Sounds";

export default function SettingsPanel({ settings, update }: Props) {
  const [section, setSection] = useState<Section>("General");
  // Track blob URLs created this session so we can revoke them on unmount
  const blobUrls = useRef<string[]>([]);

  useEffect(() => {
    const urls = blobUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  /** Validates the file and returns a data URL via FileReader (persists after page reload) */
  function handleAudioFile(
    file: File,
    onUrl: (url: string) => void,
  ): void {
    const blobUrl = uploadSound(file);
    if (!blobUrl) {
      alert("Invalid audio file. Please use MP3, OGG, WAV, WebM, AAC, or FLAC (max 5 MB).");
      return;
    }
    // Convert to data URL so it survives page reload (blob URLs do not)
    const reader = new FileReader();
    reader.onload = () => {
      URL.revokeObjectURL(blobUrl);
      if (typeof reader.result === "string") {
        onUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  const sectionButton = (label: Section) => (
    <button
      key={label}
      type="button"
      aria-pressed={section === label}
      onClick={() => setSection(label)}
      style={{
        padding: 8,
        borderRadius: 10,
        border: section === label ? "1px solid #22c55e" : "1px solid #334155",
        background: section === label ? "#1f2937" : "#111827",
        color: "white",
        cursor: "pointer",
        flex: 1,
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        marginTop: 10,
        padding: 16,
        background: "#111827",
        borderRadius: 14,
        color: "white",
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 12 }}>Settings</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {(["General", "Shared Sounds", "Player Sounds"] as Section[]).map(sectionButton)}
      </div>

      {section === "General" && (
        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => update({ ...settings, soundEnabled: e.target.checked })}
            />
            Enable Sound
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>Theme:</span>
            <select
              value={settings.theme}
              onChange={(e) =>
                update({ ...settings, theme: e.target.value as Settings["theme"] })
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="neon">Neon</option>
            </select>
          </label>
        </div>
      )}

      {section === "Shared Sounds" && (
        <div style={{ display: "grid", gap: 12 }}>
          {(
            [
              ["click", "Click sound"],
              ["win", "Win sound"],
              ["draw", "Draw sound"],
              ["round", "New round sound"],
              ["reset", "Reset sound"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} style={{ display: "grid", gap: 6 }}>
              <span>{label}</span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  handleAudioFile(file, (url) =>
                    update({ ...settings, sounds: { ...settings.sounds, [key]: url } }),
                  );
                }}
              />
            </label>
          ))}
        </div>
      )}

      {section === "Player Sounds" && (
        <div style={{ display: "grid", gap: 12 }}>
          {(
            [
              ["x", "X click sound"],
              ["o", "O click sound"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} style={{ display: "grid", gap: 6 }}>
              <span>{label}</span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  handleAudioFile(file, (url) =>
                    update({
                      ...settings,
                      playerSounds: { ...settings.playerSounds, [key]: url },
                    }),
                  );
                }}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
