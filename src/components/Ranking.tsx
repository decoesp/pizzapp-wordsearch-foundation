import { useState, useEffect, useCallback } from 'react';
import type { Difficulty, RankingEntry } from '../engine/types';
import { getDailyRanking, getWeeklyRanking, formatTime } from '../services/rankingService';
import styles from '../styles/Ranking.module.css';

type RankingProps = {
  difficulty: Difficulty;
  refreshKey: number;
};

type Tab = 'daily' | 'weekly';

function getEntryClass(index: number): string {
  if (index === 0) return styles.entryFirst ?? '';
  if (index === 1) return styles.entrySecond ?? '';
  if (index === 2) return styles.entryThird ?? '';
  return '';
}

function getPositionClass(index: number): string {
  if (index === 0) return styles.positionFirst ?? '';
  if (index === 1) return styles.positionSecond ?? '';
  if (index === 2) return styles.positionThird ?? '';
  return '';
}

function getMedal(index: number): string | null {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return null;
}

function RankingList({ entries }: { entries: RankingEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        Nenhum recorde ainda. Complete o desafio sem dicas para aparecer aqui!
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {entries.map((entry, index) => {
        const medal = getMedal(index);

        return (
          <li
            key={`${entry.playerName}-${entry.date}-${index}`}
            className={`${styles.entry ?? ''} ${getEntryClass(index)}`}
          >
            <span className={`${styles.position ?? ''} ${getPositionClass(index)}`}>
              {medal ?? `${index + 1}º`}
            </span>
            <span className={styles.name}>{entry.playerName}</span>
            <span className={styles.time}>{formatTime(entry.timeInSeconds)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function Ranking({ difficulty, refreshKey }: RankingProps) {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const [dailyEntries, setDailyEntries] = useState<RankingEntry[]>([]);
  const [weeklyEntries, setWeeklyEntries] = useState<RankingEntry[]>([]);

  const loadRankings = useCallback(() => {
    setDailyEntries(getDailyRanking(difficulty));
    setWeeklyEntries(getWeeklyRanking(difficulty));
  }, [difficulty]);

  useEffect(() => {
    loadRankings();
  }, [loadRankings, refreshKey]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'daily' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Ranking do Dia
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'weekly' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          Ranking da Semana
        </button>
      </div>

      <div className={styles.content}>
        <RankingList entries={activeTab === 'daily' ? dailyEntries : weeklyEntries} />
      </div>
    </div>
  );
}
