import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import LessonView from "./components/LessonView";
import { overallProgress, resetProgress } from "./lib/progress";
import { useProgress } from "./lib/useProgress";

function Header() {
  useProgress();
  const pct = Math.round(overallProgress() * 100);
  return (
    <header className="site-header">
      <div className="brand">
        <Link to="/">
          Основание
          <small>обучение для христиан</small>
        </Link>
      </div>
      <div className="header-progress">
        Пройдено {pct}%
        <div className="bar">
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>
        Открытый проект · код на{" "}
        <a href="https://github.com/" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </span>
      <button
        className="linklike"
        onClick={() => {
          if (confirm("Сбросить весь прогресс обучения?")) resetProgress();
        }}
      >
        Сбросить прогресс
      </button>
    </footer>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lesson/:lessonId" element={<LessonView />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}
