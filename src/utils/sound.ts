const ALLOWED_AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/aac",
  "audio/flac",
]);

const MAX_AUDIO_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates the file is a recognised audio type within the size limit,
 * then creates a blob URL for playback.
 *
 * Returns null if the file fails validation.
 */
export function uploadSound(file: File): string | null {
  if (!ALLOWED_AUDIO_TYPES.has(file.type)) return null;
  if (file.size > MAX_AUDIO_SIZE_BYTES) return null;
  return URL.createObjectURL(file);
}
