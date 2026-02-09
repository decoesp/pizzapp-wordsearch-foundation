import { DailyPuzzlePage } from './DailyPuzzlePage';
import '../styles/global.css';

export function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>🔍 Pizzapp Word Search</h1>
        <p>Caça-palavras diário</p>
      </header>
      <main className="main">
        <DailyPuzzlePage />
      </main>
      <footer className="footer">
        <p>© 2025 Pizzapp Word Search</p>
      </footer>
    </div>
  );
}
