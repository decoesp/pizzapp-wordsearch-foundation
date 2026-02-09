import type { Direction, Position, WordPlacement } from './types';
import { randomInt, shuffle } from './rng';

/**
 * Portuguese letter frequency distribution for filling empty cells.
 * Based on typical Portuguese text frequency.
 */
const PORTUGUESE_LETTERS = 'aeosridmntcuvlpgqbfhãôâçêjéóxúíáàwky';

/**
 * Attempts to place a word on the grid.
 * Returns the placement if successful, null otherwise.
 */
export function tryPlaceWord(
  grid: string[][],
  word: string,
  directions: Direction[],
  rng: () => number
): WordPlacement | null {
  const size = grid.length;
  const shuffledDirections = shuffle(rng, directions);
  
  const allPositions: Position[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      allPositions.push({ row, col });
    }
  }
  const shuffledPositions = shuffle(rng, allPositions);
  
  for (const start of shuffledPositions) {
    for (const direction of shuffledDirections) {
      if (canPlaceWord(grid, word, start, direction)) {
        placeWord(grid, word, start, direction);
        const end: Position = {
          row: start.row + direction.dy * (word.length - 1),
          col: start.col + direction.dx * (word.length - 1),
        };
        return { word, start, end, direction };
      }
    }
  }
  
  return null;
}

/**
 * Checks if a word can be placed at the given position and direction.
 */
function canPlaceWord(
  grid: string[][],
  word: string,
  start: Position,
  direction: Direction
): boolean {
  const size = grid.length;
  
  for (let i = 0; i < word.length; i++) {
    const row = start.row + direction.dy * i;
    const col = start.col + direction.dx * i;
    
    if (row < 0 || row >= size || col < 0 || col >= size) {
      return false;
    }
    
    const currentCell = grid[row]?.[col];
    const letter = word[i];
    
    if (currentCell !== '' && currentCell !== letter) {
      return false;
    }
  }
  
  return true;
}

/**
 * Places a word on the grid at the given position and direction.
 */
function placeWord(
  grid: string[][],
  word: string,
  start: Position,
  direction: Direction
): void {
  for (let i = 0; i < word.length; i++) {
    const row = start.row + direction.dy * i;
    const col = start.col + direction.dx * i;
    const letter = word[i];
    
    const gridRow = grid[row];
    if (gridRow && letter) {
      gridRow[col] = letter;
    }
  }
}

/**
 * Fills empty cells with random letters based on Portuguese frequency.
 */
export function fillEmptyCells(grid: string[][], rng: () => number): void {
  const size = grid.length;
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const gridRow = grid[row];
      if (gridRow && gridRow[col] === '') {
        const letterIndex = randomInt(rng, 0, PORTUGUESE_LETTERS.length);
        const letter = PORTUGUESE_LETTERS[letterIndex];
        if (letter) {
          gridRow[col] = letter;
        }
      }
    }
  }
}

/**
 * Normalizes a word for placement (uppercase, remove accents for matching).
 */
export function normalizeWord(word: string): string {
  return word.toUpperCase().trim();
}
