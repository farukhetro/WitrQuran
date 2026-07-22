export const AUDIO_BASE_URL = 'https://pub-55d552f89c8e4183935d201d3f3435b0.r2.dev/audio/Mahmoud%20Khalil%20Al%20Hussary';

export const getAudioUrl = (id: number | string): string => {
  const numericId = Number(id);
  if (isNaN(numericId) || numericId < 1 || numericId > 114) {
    console.error(`Invalid Surah ID for audio mapping: ${id}`);
    // Fallback to Al-Fatihah to prevent raw base URL fetches
    return `${AUDIO_BASE_URL}/001.webm`;
  }
  const paddedId = String(numericId).padStart(3, '0');
  return `${AUDIO_BASE_URL}/${paddedId}.webm`;
};
