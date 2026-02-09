import { memo } from 'react';
import styles from '../styles/Cell.module.css';

type CellProps = {
  letter: string;
  row: number;
  col: number;
  isSelected: boolean;
  isFound: boolean;
  isSolution: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  disabled: boolean;
};

function CellComponent({
  letter,
  row,
  col,
  isSelected,
  isFound,
  isSolution,
  onMouseDown,
  onMouseEnter,
  disabled,
}: CellProps) {
  const classNames = [
    styles.cell,
    isSelected && styles.selected,
    isFound && styles.found,
    isSolution && styles.solution,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      onMouseDown={() => !disabled && onMouseDown(row, col)}
      onMouseEnter={() => !disabled && onMouseEnter(row, col)}
      data-row={row}
      data-col={col}
    >
      {letter}
    </div>
  );
}

export const Cell = memo(CellComponent);
