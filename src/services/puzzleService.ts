import type { DailyTheme, Difficulty, GeneratedPuzzle } from '../engine/types';
import { generatePuzzle } from '../engine/gridGenerator';
import { getDailySeed, getTodayDateString, dateStringToSeed } from '../engine/seed';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const API_TOKEN = import.meta.env.VITE_API_TOKEN as string | undefined;
const IS_DEV = import.meta.env.DEV;

type DbColumn = {
  name: string;
  type: string;
};

type DbResponse = {
  columns: DbColumn[];
  rows: (string | number | null)[][];
};

/**
 * Fetches the daily theme from the remote database.
 * Uses Vite proxy in dev, direct API call in production.
 */
export async function fetchDailyTheme(date: string): Promise<DailyTheme> {
  try {
    const url = IS_DEV ? '/api/pizzabase/query' : `${API_URL}/query`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (!IS_DEV && API_TOKEN) {
      headers['Authorization'] = `Bearer ${API_TOKEN}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sql: 'SELECT * FROM wordsearch_themes WHERE path = ?',
        params: [`wordsearch/${date}`],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const dbResponse = await response.json() as DbResponse;
    
    if (!dbResponse.rows || dbResponse.rows.length === 0) {
      console.warn(`No theme found for date ${date}, using fallback`);
      return getFallbackTheme();
    }

    const row = dbResponse.rows[0];
    if (!row) {
      return getFallbackTheme();
    }

    const themeIndex = dbResponse.columns.findIndex(col => col.name === 'theme');
    const dataIndex = dbResponse.columns.findIndex(col => col.name === 'data');
    
    const themeName = row[themeIndex] as string;
    const dataJson = row[dataIndex] as string;
    const levels = JSON.parse(dataJson) as DailyTheme['levels'];
    
    return {
      theme: themeName,
      levels,
    };
  } catch (error) {
    console.error('Failed to fetch daily theme:', error);
    return getFallbackTheme();
  }
}

/**
 * Fallback theme for development/offline mode.
 */
function getFallbackTheme(): DailyTheme {
  return {
    theme: 'Animais',
    levels: {
      easy: [
        'GATO', 'CACHORRO', 'PEIXE', 'PASSARO', 'CAVALO',
        'VACA', 'PORCO', 'GALINHA', 'PATO', 'COELHO',
      ],
      medium: [
        'ELEFANTE', 'GIRAFA', 'LEOPARDO', 'RINOCERONTE', 'HIPOPOTAMO',
        'CROCODILO', 'TARTARUGA', 'PAPAGAIO', 'FLAMINGO', 'PINGUIM',
        'CANGURU', 'KOALA',
      ],
      hard: [
        'ORNITORRINCO', 'SALAMANDRA', 'CAMALEAO', 'ESCORPIAO', 'TARANTULA',
        'MORCEGO', 'JAVALI', 'TEXUGO', 'FURÃO', 'DONINHA',
        'LONTRA', 'CASTOR', 'ALCE', 'BISONTE', 'ANTILOPE',
      ],
    },
  };
}

/**
 * Gets words for a specific difficulty level from the theme.
 */
export function getWordsForDifficulty(theme: DailyTheme, difficulty: Difficulty): string[] {
  return theme.levels[difficulty];
}

/**
 * Creates a daily puzzle for the given difficulty.
 * Uses today's date as seed for deterministic generation.
 */
export async function createDailyPuzzle(difficulty: Difficulty): Promise<{
  puzzle: GeneratedPuzzle;
  theme: string;
}> {
  const dateString = getTodayDateString();
  const theme = await fetchDailyTheme(dateString);
  const words = getWordsForDifficulty(theme, difficulty);
  const seed = getDailySeed();
  
  const puzzle = generatePuzzle(words, difficulty, seed);
  
  return {
    puzzle,
    theme: theme.theme,
  };
}

/**
 * Creates a puzzle for a specific date (useful for testing or archives).
 */
export async function createPuzzleForDate(
  date: string,
  difficulty: Difficulty
): Promise<{
  puzzle: GeneratedPuzzle;
  theme: string;
}> {
  const theme = await fetchDailyTheme(date);
  const words = getWordsForDifficulty(theme, difficulty);
  const seed = dateStringToSeed(date);
  
  const puzzle = generatePuzzle(words, difficulty, seed);
  
  return {
    puzzle,
    theme: theme.theme,
  };
}
