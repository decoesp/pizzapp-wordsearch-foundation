/**
 * Generates a deterministic seed based on the current UTC date.
 * Same day = same seed = same puzzle.
 */
export function getDailySeed(): number {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0] ?? '';
  return dateStringToSeed(dateString);
}

/**
 * Converts a date string (YYYY-MM-DD) to a numeric seed.
 */
export function dateStringToSeed(dateString: string): number {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Gets the current UTC date string in YYYY-MM-DD format.
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}
