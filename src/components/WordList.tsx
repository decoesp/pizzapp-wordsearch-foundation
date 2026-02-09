import styles from '../styles/WordList.module.css';

type WordListProps = {
  words: string[];
  foundWords: Set<string>;
  theme: string;
};

export function WordList({ words, foundWords, theme }: WordListProps) {
  const sortedWords = [...words].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  return (
    <div className={styles.container}>
      <h2 className={styles.theme}>{theme}</h2>
      <p className={styles.progress}>
        {foundWords.size} / {words.length} palavras encontradas
      </p>
      <ul className={styles.list}>
        {sortedWords.map(word => (
          <li
            key={word}
            className={`${styles.word} ${foundWords.has(word) ? styles.found : ''}`}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}
