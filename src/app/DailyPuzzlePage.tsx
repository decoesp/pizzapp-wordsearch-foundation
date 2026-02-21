import { useState, useEffect, useCallback, useRef } from 'react';
import { Grid } from '../components/Grid';
import { WordList } from '../components/WordList';
import { DifficultySelector } from '../components/DifficultySelector';
import { SolutionButton } from '../components/SolutionButton';
import { Timer } from '../components/Timer';
import { CompletionModal } from '../components/CompletionModal';
import { Ranking } from '../components/Ranking';
import { createDailyPuzzle } from '../services/puzzleService';
import { addRankingEntry } from '../services/rankingService';
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
  const [usedHint, setUsedHint] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rankingRefreshKey, setRankingRefreshKey] = useState(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const elapsedTimeRef = useRef(0);

  const loadPuzzle = useCallback(async (diff: Difficulty) => {
    setLoading(true);
    setError(null);
    setFoundWords(new Set());
    setShowSolution(false);
    setUsedHint(false);
    setShowModal(false);
    setTimerRunning(false);
    setTimerResetKey(prev => prev + 1);
    elapsedTimeRef.current = 0;

    try {
      const data = await createDailyPuzzle(diff);
      setPuzzleData(data);
      setTimerRunning(true);
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

  const handleTimeUpdate = useCallback((seconds: number) => {
    elapsedTimeRef.current = seconds;
  }, []);

  useEffect(() => {
    if (!puzzleData) return;
    const isComplete = foundWords.size === puzzleData.puzzle.words.length;
    if (isComplete && foundWords.size > 0) {
      setTimerRunning(false);
      setShowModal(true);
    }
  }, [foundWords, puzzleData]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    if (newDifficulty !== difficulty) {
      setDifficulty(newDifficulty);
    }
  }, [difficulty]);

  const handleToggleSolution = useCallback(() => {
    setShowSolution(prev => {
      if (!prev) setUsedHint(true);
      return !prev;
    });
  }, []);

  const handleSubmitRanking = useCallback((playerName: string) => {
    addRankingEntry(playerName, elapsedTimeRef.current, difficulty, usedHint);
    setShowModal(false);
    setRankingRefreshKey(prev => prev + 1);
  }, [difficulty, usedHint]);

  const handleSkipRanking = useCallback(() => {
    setShowModal(false);
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
      <div className={styles.topBar}>
        <DifficultySelector
          currentDifficulty={difficulty}
          onSelect={handleDifficultyChange}
          disabled={loading}
        />
        <Timer
          isRunning={timerRunning}
          onTimeUpdate={handleTimeUpdate}
          reset={timerResetKey}
        />
      </div>

      {isComplete && !showModal && (
        <div className={styles.success}>
          Parabéns! Você encontrou todas as palavras!
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
          <Ranking
            difficulty={difficulty}
            refreshKey={rankingRefreshKey}
          />
        </div>
      </div>

      {showModal && (
        <CompletionModal
          timeInSeconds={elapsedTimeRef.current}
          usedHint={usedHint}
          onSubmit={handleSubmitRanking}
          onSkip={handleSkipRanking}
        />
      )}
    </div>
  );
}
