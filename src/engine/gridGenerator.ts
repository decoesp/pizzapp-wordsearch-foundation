import type { Difficulty, GeneratedPuzzle } from './types';
import { getDirectionsForDifficulty } from './directions';
import { createRng, shuffle } from './rng';
import { tryPlaceWord, fillEmptyCells, normalizeWord } from './wordPlacer';

/**
 * Grid size configuration based on difficulty.
 */
const GRID_SIZES: Record<Difficulty, number> = {
  easy: 10,
  medium: 12,
  hard: 15,
};

/**
 * Creates an empty grid of the specified size.
 */
function createEmptyGrid(size: number): string[][] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
}

/**
 * Generates a complete word search puzzle.
 * 
 * @param words - List of words to place in the puzzle
 * @param difficulty - Difficulty level determining grid size and directions
 * @param seed - Seed for deterministic generation
 * @returns Generated puzzle with grid, placed words, and solution
 */
export function generatePuzzle(
  words: string[],
  difficulty: Difficulty,
  seed: number
): GeneratedPuzzle {
  const rng = createRng(seed);
  const size = GRID_SIZES[difficulty];
  const grid = createEmptyGrid(size);
  const directions = getDirectionsForDifficulty(difficulty);
  
  const normalizedWords = words
    .map(normalizeWord)
    .filter(w => w.length > 0 && w.length <= size)
    .sort((a, b) => b.length - a.length);
  
  const shuffledWords = shuffle(rng, normalizedWords);
  
  const placedWords: GeneratedPuzzle['placedWords'] = [];
  const successfullyPlacedWords: string[] = [];
  
  for (const word of shuffledWords) {
    const placement = tryPlaceWord(grid, word, directions, rng);
    if (placement) {
      placedWords.push(placement);
      successfullyPlacedWords.push(word);
    }
  }
  
  fillEmptyCells(grid, rng);
  
  return {
    grid,
    placedWords,
    words: successfullyPlacedWords,
    size,
  };
}

/**
 * Calculates the optimal grid size for a given word list.
 */
export function calculateGridSize(words: string[], difficulty: Difficulty): number {
  const baseSize = GRID_SIZES[difficulty];
  const longestWord = Math.max(...words.map(w => w.length), 0);
  return Math.max(baseSize, longestWord + 2);
}
