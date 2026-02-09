import { useState, useCallback, useEffect } from 'react';
import { Cell } from './Cell';
import type { GeneratedPuzzle, Position } from '../engine/types';
import { validateSelection, isValidLine, getPlacementCells } from '../engine/solver';
import styles from '../styles/Grid.module.css';

type GridProps = {
  puzzle: GeneratedPuzzle;
  foundWords: Set<string>;
  showSolution: boolean;
  onWordFound: (word: string) => void;
};

export function Grid({ puzzle, foundWords, showSolution, onWordFound }: GridProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<Position[]>([]);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cells = new Set<string>();
    for (const placement of puzzle.placedWords) {
      if (foundWords.has(placement.word)) {
        const placementCells = getPlacementCells(placement);
        for (const cell of placementCells) {
          cells.add(`${cell.row}-${cell.col}`);
        }
      }
    }
    setFoundCells(cells);
  }, [foundWords, puzzle.placedWords]);

  const handleMouseDown = useCallback((row: number, col: number) => {
    setIsSelecting(true);
    setSelection([{ row, col }]);
  }, []);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (!isSelecting) return;

    setSelection(prev => {
      const existingIndex = prev.findIndex(p => p.row === row && p.col === col);
      
      if (existingIndex !== -1) {
        return prev.slice(0, existingIndex + 1);
      }

      const newSelection = [...prev, { row, col }];
      
      if (!isValidLine(newSelection)) {
        return prev;
      }

      return newSelection;
    });
  }, [isSelecting]);

  const handleMouseUp = useCallback(() => {
    if (!isSelecting) return;

    setIsSelecting(false);

    if (selection.length >= 2) {
      const matchedPlacement = validateSelection(puzzle, selection);
      
      if (matchedPlacement && !foundWords.has(matchedPlacement.word)) {
        onWordFound(matchedPlacement.word);
      }
    }

    setSelection([]);
  }, [isSelecting, selection, puzzle, foundWords, onWordFound]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleMouseUp();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isSelecting, handleMouseUp]);

  const isSelected = useCallback((row: number, col: number) => {
    return selection.some(p => p.row === row && p.col === col);
  }, [selection]);

  const isFound = useCallback((row: number, col: number) => {
    return foundCells.has(`${row}-${col}`);
  }, [foundCells]);

  const isSolution = useCallback((row: number, col: number) => {
    if (!showSolution) return false;
    
    for (const placement of puzzle.placedWords) {
      const cells = getPlacementCells(placement);
      if (cells.some(c => c.row === row && c.col === col)) {
        return true;
      }
    }
    return false;
  }, [showSolution, puzzle.placedWords]);

  return (
    <div
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${puzzle.size}, 1fr)`,
        gridTemplateRows: `repeat(${puzzle.size}, 1fr)`,
      }}
      onMouseLeave={() => isSelecting && setSelection([])}
    >
      {puzzle.grid.map((row, rowIndex) =>
        row.map((letter, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            letter={letter}
            row={rowIndex}
            col={colIndex}
            isSelected={isSelected(rowIndex, colIndex)}
            isFound={isFound(rowIndex, colIndex)}
            isSolution={isSolution(rowIndex, colIndex)}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            disabled={showSolution}
          />
        ))
      )}
    </div>
  );
}
