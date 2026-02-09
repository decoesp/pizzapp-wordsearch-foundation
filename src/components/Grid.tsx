import { useState, useCallback, useEffect, useRef } from 'react';
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
  const gridRef = useRef<HTMLDivElement>(null);

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

  const getCellFromPoint = useCallback((x: number, y: number): Position | null => {
    const element = document.elementFromPoint(x, y);
    if (!element) return null;
    
    const row = element.getAttribute('data-row');
    const col = element.getAttribute('data-col');
    
    if (row !== null && col !== null) {
      return { row: parseInt(row, 10), col: parseInt(col, 10) };
    }
    return null;
  }, []);

  const handleStart = useCallback((row: number, col: number) => {
    setIsSelecting(true);
    setSelection([{ row, col }]);
  }, []);

  const handleMove = useCallback((row: number, col: number) => {
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

  const handleEnd = useCallback(() => {
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

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (showSolution) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    if (cell) {
      handleStart(cell.row, cell.col);
    }
  }, [showSolution, getCellFromPoint, handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSelecting || showSolution) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const cell = getCellFromPoint(touch.clientX, touch.clientY);
    if (cell) {
      handleMove(cell.row, cell.col);
    }
  }, [isSelecting, showSolution, getCellFromPoint, handleMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleEnd();
  }, [handleEnd]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleEnd();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isSelecting, handleEnd]);

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
      ref={gridRef}
      className={styles.grid}
      style={{
        gridTemplateColumns: `repeat(${puzzle.size}, 1fr)`,
        gridTemplateRows: `repeat(${puzzle.size}, 1fr)`,
        touchAction: 'none',
      }}
      onMouseLeave={() => isSelecting && setSelection([])}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
            onMouseDown={handleStart}
            onMouseEnter={handleMove}
            disabled={showSolution}
          />
        ))
      )}
    </div>
  );
}
