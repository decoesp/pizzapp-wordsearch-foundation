import styles from '../styles/SolutionButton.module.css';

type SolutionButtonProps = {
  showSolution: boolean;
  onToggle: () => void;
};

export function SolutionButton({ showSolution, onToggle }: SolutionButtonProps) {
  return (
    <button
      className={`${styles.button} ${showSolution ? styles.active : ''}`}
      onClick={onToggle}
    >
      {showSolution ? 'Ocultar Solução' : 'Mostrar Solução'}
    </button>
  );
}
