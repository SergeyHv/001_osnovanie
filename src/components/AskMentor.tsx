import { useState } from "react";
import { mentorConfig } from "../lib/mentorConfig";

interface Props {
  lessonTitle: string;
  /** Текущий черновик ответа студента — прикладывается к письму (необязательно). */
  draft?: string;
}

/**
 * Кнопка «Спросить наставника». Работает без сервера:
 * — открывает почтовую программу с заполненным письмом (mailto), либо
 * — копирует готовый текст в буфер обмена для отправки в мессенджер общины.
 * Личное общение остаётся между живыми людьми — сайт лишь убирает трение.
 */
export default function AskMentor({ lessonTitle, draft }: Props) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [copied, setCopied] = useState(false);

  if (!mentorConfig.enabled) return null;

  function buildBody(): string {
    const parts = [
      `Урок: ${lessonTitle}`,
      "",
      "Мой вопрос:",
      question.trim() || "(напишите ваш вопрос здесь)",
    ];
    if (draft && draft.trim()) {
      parts.push("", "Мой черновик ответа:", draft.trim());
    }
    return parts.join("\n");
  }

  function sendEmail() {
    const subject = mentorConfig.subjectTemplate.replace("{lesson}", lessonTitle);
    const url = `mailto:${encodeURIComponent(
      mentorConfig.email,
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      buildBody(),
    )}`;
    window.location.href = url;
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(buildBody());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // запасной путь, если буфер недоступен
      alert("Не удалось скопировать. Выделите текст вручную:\n\n" + buildBody());
    }
  }

  if (!open) {
    return (
      <div className="mentor-row">
        <button className="btn ghost" onClick={() => setOpen(true)}>
          ✉️ Спросить {mentorConfig.mentorName}
        </button>
        <span className="mentor-hint">
          Если по этой теме остаётся личный или трудный вопрос — обратитесь к
          живому человеку, это часть пути.
        </span>
      </div>
    );
  }

  return (
    <div className="mentor-box">
      <div className="mentor-label">Ваш вопрос {mentorConfig.mentorName}</div>
      <textarea
        className="reflect-input"
        rows={3}
        placeholder="Сформулируйте, что осталось непонятным или что хочется обсудить…"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div className="mentor-actions">
        {mentorConfig.email && (
          <button className="btn" onClick={sendEmail}>
            Открыть письмо
          </button>
        )}
        <button className="btn secondary" onClick={copyText}>
          {copied ? "Скопировано ✓" : "Скопировать текст"}
        </button>
        <button className="linklike" onClick={() => setOpen(false)}>
          отмена
        </button>
      </div>
      <p className="mentor-foot">
        «Открыть письмо» откроет вашу почтовую программу с готовым текстом.
        «Скопировать» — для отправки в мессенджер общины. Отправляете вы сами.
      </p>
    </div>
  );
}
