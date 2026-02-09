import { useState, useEffect, useCallback } from 'react';
import { Grid } from '../components/Grid';
import { WordList } from '../components/WordList';
import { DifficultySelector } from '../components/DifficultySelector';
import { SolutionButton } from '../components/SolutionButton';
import { createDailyPuzzle } from '../services/puzzleService';
import type { Difficulty, GeneratedPuzzle } from '../engine/types';
import styles from '../styles/DailyPuzzlePage.module.css';

type PuzzleData = {
  puzzle: GeneratedPuzzle;
  theme: string;
};

export function DailyPuzzlePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPuzzle = useCallback(async (diff: Difficulty) => {
    setLoading(true);
    setError(null);
    setFoundWords(new Set());
    setShowSolution(false);

    try {
      const data = await createDailyPuzzle(diff);
      setPuzzleData(data);
    } catch (err) {
      setError('Erro ao carregar o puzzle. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPuzzle(difficulty);
  }, [difficulty, loadPuzzle]);

  const handleWordFound = useCallback((word: string) => {
    setFoundWords(prev => new Set([...prev, word]));
  }, []);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty);
    }
  }, [difficulty]);

  const handleToggleSolution = useCallback(() => {
    setShowSolution(prev => !prev);
  }, []);

  const isComplete = puzzleData
    ? foundWords.size === puzzleData.puzzle.words.length
    : false;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando puzzle...</div>
      </div>
    );
  }

  if (error || !puzzleData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error ?? 'Erro desconhecido'}
          <button onClick={() => loadPuzzle(difficulty)}>Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <DifficultySelector
        currentDifficulty={difficulty}
        onSelect={handleDifficultyChange}
        disabled={loading}
      />

      {isComplete && !showSolution && (
        <div className={styles.success}>
          🎉 Parabéns! Você encontrou todas as palavras!
        </div>
      )}

      <div className={styles.gameArea}>
        <div className={styles.gridContainer}>
          <Grid
            puzzle={puzzleData.puzzle}
            foundWords={foundWords}
            showSolution={showSolution}
            onWordFound={handleWordFound}
          />
        </div>

        <div className={styles.sidebar}>
          <WordList
            words={puzzleData.puzzle.words}
            foundWords={foundWords}
            theme={puzzleData.theme}
          />
          <SolutionButton
            showSolution={showSolution}
            onToggle={handleToggleSolution}
          />
        </div>
      </div>
    </div>
  );
}
