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
        <Link to="/" className="brand-link">
          <img src="/logo.png" alt="Ковчег спасения" className="brand-logo" />
          <span className="brand-text">
            Основание
            <small>обучение для христиан · Ковчег спасения</small>
          </span>
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
      <span>Ковчег спасения</span>
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
