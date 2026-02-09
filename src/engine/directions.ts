import type { Direction, Difficulty } from './types';

export const DIRECTIONS: Record<string, Direction> = {
  RIGHT: { dx: 1, dy: 0, name: 'right' },
  DOWN: { dx: 0, dy: 1, name: 'down' },
  LEFT: { dx: -1, dy: 0, name: 'left' },
  UP: { dx: 0, dy: -1, name: 'up' },
  DOWN_RIGHT: { dx: 1, dy: 1, name: 'down-right' },
  DOWN_LEFT: { dx: -1, dy: 1, name: 'down-left' },
  UP_RIGHT: { dx: 1, dy: -1, name: 'up-right' },
  UP_LEFT: { dx: -1, dy: -1, name: 'up-left' },
};

/**
 * Returns allowed directions based on difficulty level.
 * - Easy: horizontal and vertical only, no reversed
 * - Medium: horizontal, vertical, and diagonal, no reversed
 * - Hard: all directions including reversed words
 */
export function getDirectionsForDifficulty(difficulty: Difficulty): Direction[] {
  switch (difficulty) {
    case 'easy':
      return [DIRECTIONS.RIGHT!, DIRECTIONS.DOWN!];
    case 'medium':
      return [
        DIRECTIONS.RIGHT!,
        DIRECTIONS.DOWN!,
        DIRECTIONS.DOWN_RIGHT!,
        DIRECTIONS.DOWN_LEFT!,
      ];
    case 'hard':
      return [
        DIRECTIONS.RIGHT!,
        DIRECTIONS.DOWN!,
        DIRECTIONS.LEFT!,
        DIRECTIONS.UP!,
        DIRECTIONS.DOWN_RIGHT!,
        DIRECTIONS.DOWN_LEFT!,
        DIRECTIONS.UP_RIGHT!,
        DIRECTIONS.UP_LEFT!,
      ];
  }
}

/**
 * Checks if a direction represents a reversed word placement.
 */
export function isReversedDirection(direction: Direction): boolean {
  return (
    direction === DIRECTIONS.LEFT ||
    direction === DIRECTIONS.UP ||
    direction === DIRECTIONS.UP_RIGHT ||
    direction === DIRECTIONS.UP_LEFT
  );
}
