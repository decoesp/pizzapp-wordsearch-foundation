import type { Position, WordPlacement, GeneratedPuzzle } from './types';

/**
 * Validates if a selection matches a word in the puzzle.
 * Returns the matched word placement if valid, null otherwise.
 */
export function validateSelection(
  puzzle: GeneratedPuzzle,
  selection: Position[]
): WordPlacement | null {
  if (selection.length < 2) return null;
  
  const selectedWord = getWordFromSelection(puzzle.grid, selection);
  
  for (const placement of puzzle.placedWords) {
    if (placement.word === selectedWord) {
      if (matchesPlacement(selection, placement)) {
        return placement;
      }
    }
  }
  
  return null;
}

/**
 * Extracts the word from a grid selection.
 */
function getWordFromSelection(grid: string[][], selection: Position[]): string {
  return selection
    .map(pos => grid[pos.row]?.[pos.col] ?? '')
    .join('');
}

/**
 * Checks if a selection matches a word placement exactly.
 */
function matchesPlacement(selection: Position[], placement: WordPlacement): boolean {
  if (selection.length !== placement.word.length) return false;
  
  const first = selection[0];
  const last = selection[selection.length - 1];
  
  if (!first || !last) return false;
  
  const matchesForward = (
    first.row === placement.start.row &&
    first.col === placement.start.col &&
    last.row === placement.end.row &&
    last.col === placement.end.col
  );
  
  const matchesBackward = (
    first.row === placement.end.row &&
    first.col === placement.end.col &&
    last.row === placement.start.row &&
    last.col === placement.start.col
  );
  
  return matchesForward || matchesBackward;
}

/**
 * Checks if a selection forms a valid straight line.
 */
export function isValidLine(selection: Position[]): boolean {
  if (selection.length < 2) return true;
  
  const first = selection[0];
  const second = selection[1];
  
  if (!first || !second) return false;
  
  const dx = Math.sign(second.col - first.col);
  const dy = Math.sign(second.row - first.row);
  
  for (let i = 1; i < selection.length; i++) {
    const prev = selection[i - 1];
    const curr = selection[i];
    
    if (!prev || !curr) return false;
    
    const currentDx = curr.col - prev.col;
    const currentDy = curr.row - prev.row;
    
    if (Math.abs(currentDx) > 1 || Math.abs(currentDy) > 1) return false;
    if (Math.sign(currentDx) !== dx || Math.sign(currentDy) !== dy) return false;
  }
  
  return true;
}

/**
 * Gets all cells that belong to a word placement.
 */
export function getPlacementCells(placement: WordPlacement): Position[] {
  const cells: Position[] = [];
  const { start, direction, word } = placement;
  
  for (let i = 0; i < word.length; i++) {
    cells.push({
      row: start.row + direction.dy * i,
      col: start.col + direction.dx * i,
    });
  }
  
  return cells;
}

/**
 * Gets all solution cells for displaying the complete solution.
 */
export function getAllSolutionCells(puzzle: GeneratedPuzzle): Map<string, WordPlacement[]> {
  const cellMap = new Map<string, WordPlacement[]>();
  
  for (const placement of puzzle.placedWords) {
    const cells = getPlacementCells(placement);
    for (const cell of cells) {
      const key = `${cell.row}-${cell.col}`;
      const existing = cellMap.get(key) ?? [];
      existing.push(placement);
      cellMap.set(key, existing);
    }
  }
  
  return cellMap;
}
