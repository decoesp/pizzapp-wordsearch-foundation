import type { Difficulty } from '../engine/types';
import styles from '../styles/DifficultySelector.module.css';

type DifficultySelectorProps = {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
  disabled: boolean;
};

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Médio' },
  { value: 'hard', label: 'Difícil' },
];

export function DifficultySelector({
  currentDifficulty,
  onSelect,
  disabled,
}: DifficultySelectorProps) {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Dificuldade:</span>
      <div className={styles.buttons}>
        {DIFFICULTIES.map(({ value, label }) => (
          <button
            key={value}
            className={`${styles.button} ${currentDifficulty === value ? styles.active : ''}`}
            onClick={() => onSelect(value)}
            disabled={disabled}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
