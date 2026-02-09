export type Difficulty = 'easy' | 'medium' | 'hard';

export type Direction = {
  dx: number;
  dy: number;
  name: string;
};

export type Position = {
  row: number;
  col: number;
};

export type WordPlacement = {
  word: string;
  start: Position;
  end: Position;
  direction: Direction;
};

export type GridCell = {
  letter: string;
  row: number;
  col: number;
};

export type GeneratedPuzzle = {
  grid: string[][];
  placedWords: WordPlacement[];
  words: string[];
  size: number;
};

export type DailyTheme = {
  theme: string;
  levels: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
};

export type PuzzleState = {
  puzzle: GeneratedPuzzle;
  foundWords: Set<string>;
  showSolution: boolean;
  difficulty: Difficulty;
  theme: string;
};
