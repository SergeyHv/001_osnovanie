import { lessonSequence, lessonIndex } from "./content";

const STORAGE_KEY = "osnovanie:progress:v1";

export interface LessonResult {
  /** Лучший результат в процентах. */
  score: number;
  /** Сдан ли тест (достигнут проходной балл). */
  passed: boolean;
  /** ISO-дата прохождения. */
  at: string;
}

export type Progress = Record<string, LessonResult>;

function read(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

function write(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    // Уведомляем компоненты в этой же вкладке.
    window.dispatchEvent(new Event("progress-changed"));
  } catch {
    // localStorage может быть недоступен (приватный режим) — тихо игнорируем.
  }
}

export function getProgress(): Progress {
  return read();
}

export function getResult(lessonId: string): LessonResult | undefined {
  return read()[lessonId];
}

export function isPassed(lessonId: string): boolean {
  return read()[lessonId]?.passed ?? false;
}

/**
 * Записывает результат теста. Сохраняет лучший балл.
 * Урок без теста можно отметить пройденным через markCompleted.
 */
export function saveResult(lessonId: string, score: number, passingScore: number): void {
  const p = read();
  const passed = score >= passingScore;
  const prev = p[lessonId];
  if (!prev || score >= prev.score) {
    p[lessonId] = { score, passed: passed || prev?.passed === true, at: new Date().toISOString() };
  } else if (passed && !prev.passed) {
    p[lessonId] = { ...prev, passed: true };
  }
  write(p);
}

/** Отмечает урок без теста как пройденный. */
export function markCompleted(lessonId: string): void {
  const p = read();
  if (!p[lessonId]?.passed) {
    p[lessonId] = { score: 100, passed: true, at: new Date().toISOString() };
    write(p);
  }
}

/**
 * Строгая последовательность: урок открыт, если это первый урок
 * или предыдущий урок в общей последовательности сдан.
 */
export function isUnlocked(lessonId: string): boolean {
  const idx = lessonIndex(lessonId);
  if (idx <= 0) return true;
  const prev = lessonSequence[idx - 1];
  return isPassed(prev.id);
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("progress-changed"));
  } catch {
    /* ignore */
  }
}

/** Доля сданных уроков (0..1) — для индикатора. */
export function overallProgress(): number {
  if (lessonSequence.length === 0) return 0;
  const p = read();
  const done = lessonSequence.filter((l) => p[l.id]?.passed).length;
  return done / lessonSequence.length;
}
