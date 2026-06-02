// Тонкие линейные SVG-символы для уровней. Рисуются прямо в коде:
// нет внешних файлов, нет вопросов о лицензиях. Сдержанная символика,
// без изображения людей и без попыток «нарисовать» Бога.

interface Props {
  /** Номер уровня (1..5). */
  level: number;
  size?: number;
}

const stroke = "currentColor";
const common = {
  fill: "none",
  stroke,
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function LevelEmblem({ level, size = 44 }: Props) {
  const box = 48;
  const p = { width: size, height: size, viewBox: `0 0 ${box} ${box}` };

  switch (level) {
    // Уровень 1 — Основания: восходящее солнце над линией (рассвет, начало).
    case 1:
      return (
        <svg {...p} aria-hidden="true">
          <line x1="6" y1="36" x2="42" y2="36" {...common} />
          <circle cx="24" cy="36" r="9" {...common} />
          <line x1="24" y1="14" x2="24" y2="20" {...common} />
          <line x1="11" y1="20" x2="15" y2="24" {...common} />
          <line x1="37" y1="20" x2="33" y2="24" {...common} />
        </svg>
      );
    // Уровень 2 — Ученичество: росток (рост).
    case 2:
      return (
        <svg {...p} aria-hidden="true">
          <path d="M24 42 V22" {...common} />
          <path d="M24 28 C18 28 14 24 14 18 C20 18 24 22 24 28 Z" {...common} />
          <path d="M24 24 C30 24 34 20 34 14 C28 14 24 18 24 24 Z" {...common} />
        </svg>
      );
    // Уровень 3 — Углублённое изучение: открытая книга.
    case 3:
      return (
        <svg {...p} aria-hidden="true">
          <path d="M24 14 C20 11 12 11 8 13 V35 C12 33 20 33 24 36" {...common} />
          <path d="M24 14 C28 11 36 11 40 13 V35 C36 33 28 33 24 36" {...common} />
          <line x1="24" y1="14" x2="24" y2="36" {...common} />
        </svg>
      );
    // Уровень 4 — Толкование и навыки: ключ (герменевтика — ключ к тексту).
    case 4:
      return (
        <svg {...p} aria-hidden="true">
          <circle cx="17" cy="17" r="7" {...common} />
          <line x1="22" y1="22" x2="38" y2="38" {...common} />
          <line x1="32" y1="32" x2="36" y2="28" {...common} />
          <line x1="36" y1="36" x2="40" y2="32" {...common} />
        </svg>
      );
    // Уровень 5 — Служение: кафедра / возвышение со светом (проповедь, ведение).
    case 5:
      return (
        <svg {...p} aria-hidden="true">
          <path d="M16 40 L16 24 L32 24 L32 40" {...common} />
          <line x1="12" y1="40" x2="36" y2="40" {...common} />
          <line x1="24" y1="24" x2="24" y2="14" {...common} />
          <path d="M19 11 L24 8 L29 11" {...common} />
        </svg>
      );
    default:
      return (
        <svg {...p} aria-hidden="true">
          <circle cx="24" cy="24" r="10" {...common} />
        </svg>
      );
  }
}
