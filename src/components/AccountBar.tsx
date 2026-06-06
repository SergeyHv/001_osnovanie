import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/useAuth";

// Встроенные стили, чтобы не трогать общий CSS (низкий риск).
const wrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 10,
  flexWrap: "wrap",
  fontSize: 14,
  color: "var(--ink-soft, #4a5468)",
  padding: "8px 0 0",
};
const input: React.CSSProperties = {
  font: "inherit",
  fontSize: 14,
  padding: "6px 10px",
  border: "1px solid var(--line, #d7deea)",
  borderRadius: 4,
  background: "#fff",
  color: "var(--ink, #1e2633)",
};
const btn: React.CSSProperties = {
  font: "inherit",
  fontSize: 14,
  padding: "6px 14px",
  border: "none",
  borderRadius: 4,
  background: "var(--accent, #3b4d71)",
  color: "#fff",
  cursor: "pointer",
};
const link: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--accent, #3b4d71)",
  cursor: "pointer",
  font: "inherit",
  padding: 0,
  textDecoration: "underline",
};

export default function AccountBar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"enterEmail" | "enterCode">("enterEmail");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  if (loading) {
    return <div style={wrap}>…</div>;
  }

  // Вошёл — показываем email и кнопку выхода.
  if (user) {
    return (
      <div style={wrap}>
        <span>
          Вы вошли: <b>{user.email}</b>
        </span>
        <button style={link} onClick={() => supabase.auth.signOut()}>
          Выйти
        </button>
      </div>
    );
  }

  // Не вошёл и форма закрыта — кнопка «Войти».
  if (!open) {
    return (
      <div style={wrap}>
        <button style={link} onClick={() => setOpen(true)}>
          Войти, чтобы сохранять прогресс
        </button>
      </div>
    );
  }

  async function sendCode() {
    const e = email.trim();
    if (!e) return;
    setBusy(true);
    setMsg("");
    const { error } = await supabase.auth.signInWithOtp({ email: e });
    setBusy(false);
    if (error) {
      setMsg("Не получилось отправить код: " + error.message);
      return;
    }
    setStage("enterCode");
    setMsg("Код отправлен на почту. Проверьте входящие и папку «Спам».");
  }

  async function verify() {
    const e = email.trim();
    const t = code.trim();
    if (!t) return;
    setBusy(true);
    setMsg("");
    const { error } = await supabase.auth.verifyOtp({
      email: e,
      token: t,
      type: "email",
    });
    setBusy(false);
    if (error) {
      setMsg("Неверный или просроченный код. Попробуйте ещё раз.");
      return;
    }
    // Успех — useAuth подхватит сессию и покажет «Вы вошли».
  }

  return (
    <div style={{ ...wrap, flexDirection: "column", alignItems: "flex-end" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {stage === "enterEmail" ? (
          <>
            <input
              style={input}
              type="email"
              placeholder="ваша почта"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <button style={btn} onClick={sendCode} disabled={busy}>
              {busy ? "Отправка…" : "Получить код"}
            </button>
          </>
        ) : (
          <>
            <input
              style={{ ...input, width: 120 }}
              inputMode="numeric"
              placeholder="код из письма"
              value={code}
              onChange={(ev) => setCode(ev.target.value)}
            />
            <button style={btn} onClick={verify} disabled={busy}>
              {busy ? "Проверка…" : "Войти"}
            </button>
          </>
        )}
        <button
          style={link}
          onClick={() => {
            setOpen(false);
            setStage("enterEmail");
            setCode("");
            setMsg("");
          }}
        >
          отмена
        </button>
      </div>
      {msg && (
        <div style={{ fontSize: 13, color: "var(--ink-faint, #8089a0)", maxWidth: 360 }}>
          {msg}
        </div>
      )}
    </div>
  );
}
