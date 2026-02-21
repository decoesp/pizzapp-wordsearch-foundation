import type { Difficulty, RankingEntry } from '../engine/types';

const STORAGE_KEY = 'pizzapp-wordsearch-ranking';

type StoredRanking = {
  entries: RankingEntry[];
};

function loadFromStorage(): StoredRanking {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [] };
    return JSON.parse(raw) as StoredRanking;
  } catch {
    return { entries: [] };
  }
}

function saveToStorage(data: StoredRanking): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayString(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0] ?? '';
}

function isFromToday(entry: RankingEntry): boolean {
  return entry.date === getTodayString();
}

function isFromThisWeek(entry: RankingEntry): boolean {
  const weekStart = getWeekStart();
  return entry.date >= weekStart;
}

export function addRankingEntry(
  playerName: string,
  timeInSeconds: number,
  difficulty: Difficulty,
  usedHint: boolean,
): void {
  const data = loadFromStorage();

  const entry: RankingEntry = {
    playerName,
    timeInSeconds,
    difficulty,
    date: getTodayString(),
    usedHint,
  };

  data.entries.push(entry);

  const weekStart = getWeekStart();
  data.entries = data.entries.filter(e => e.date >= weekStart);

  saveToStorage(data);
}

export function getDailyRanking(difficulty: Difficulty): RankingEntry[] {
  const data = loadFromStorage();
  return data.entries
    .filter(e => isFromToday(e) && e.difficulty === difficulty && !e.usedHint)
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds)
    .slice(0, 10);
}

export function getWeeklyRanking(difficulty: Difficulty): RankingEntry[] {
  const data = loadFromStorage();

  const weeklyMap = new Map<string, RankingEntry>();

  const weekEntries = data.entries
    .filter(e => isFromThisWeek(e) && e.difficulty === difficulty && !e.usedHint)
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds);

  for (const entry of weekEntries) {
    const key = entry.playerName.toLowerCase();
    const existing = weeklyMap.get(key);
    if (!existing) {
      weeklyMap.set(key, { ...entry });
    } else {
      weeklyMap.set(key, {
        ...existing,
        timeInSeconds: existing.timeInSeconds + entry.timeInSeconds,
      });
    }
  }

  return Array.from(weeklyMap.values())
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds)
    .slice(0, 10);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
