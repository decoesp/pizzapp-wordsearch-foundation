/**
 * Mulberry32 - A simple seeded PRNG.
 * Produces deterministic pseudo-random numbers given a seed.
 */
export function createRng(seed: number): () => number {
  let state = seed;
  
  return function(): number {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive).
 */
export function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min)) + min;
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 */
export function shuffle<T>(rng: () => number, array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(rng, 0, i + 1);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

/**
 * Picks a random element from an array.
 */
export function pickRandom<T>(rng: () => number, array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[randomInt(rng, 0, array.length)];
}
