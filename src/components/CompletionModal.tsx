import { useState, useCallback } from 'react';
import { formatTime } from '../services/rankingService';
import styles from '../styles/CompletionModal.module.css';

type CompletionModalProps = {
  timeInSeconds: number;
  usedHint: boolean;
  onSubmit: (playerName: string) => void;
  onSkip: () => void;
};

export function CompletionModal({
  timeInSeconds,
  usedHint,
  onSubmit,
  onSkip,
}: CompletionModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = name.trim();
      if (trimmed.length > 0) {
        onSubmit(trimmed);
      }
    },
    [name, onSubmit],
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Parabéns!</h2>
        <p className={styles.subtitle}>Você encontrou todas as palavras!</p>

        <div className={styles.timeDisplay}>{formatTime(timeInSeconds)}</div>

        {usedHint && (
          <div className={styles.hintWarning}>
            Você usou dicas neste desafio. Seu tempo não será contabilizado no ranking.
          </div>
        )}

        {!usedHint ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="playerName">Seu nome para o ranking:</label>
              <input
                id="playerName"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Digite seu nome"
                maxLength={20}
                autoFocus
              />
            </div>
            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={name.trim().length === 0}
              >
                Salvar no Ranking
              </button>
              <button
                type="button"
                className={styles.skipButton}
                onClick={onSkip}
              >
                Pular
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.skipButton}
              onClick={onSkip}
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
