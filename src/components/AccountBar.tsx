import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/useAuth";

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
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState("");

  if (loading) {
    return <div style={wrap}>…</div>;
  }

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

  if (!open) {
    return (
      <div style={wrap}>
        <button style={link} onClick={() => setOpen(true)}>
          Войти, чтобы сохранять прогресс
        </button>
      </div>
    );
  }

  async function sendLink() {
    const e = email.trim();
    if (!e) return;
    setBusy(true);
    setMsg("");
    const { error } = await supabase.auth.signInWithOtp({
      email: e,
      options: {
        // Вернуть человека на ту же страницу, откуда он входил
        // (работает и на localhost, и на «живом» сайте).
        emailRedirectTo: window.location.origin + "/",
      },
    });
    setBusy(false);
    if (error) {
      setMsg("Не получилось отправить письмо: " + error.message);
      return;
    }
    setSent(true);
    setMsg(
      "Письмо со ссылкой для входа отправлено. Откройте письмо НА ЭТОМ ЖЕ устройстве и нажмите ссылку — вы вернётесь сюда уже вошедшими. Проверьте папку «Спам».",
    );
  }

  return (
    <div style={{ ...wrap, flexDirection: "column", alignItems: "flex-end" }}>
      {!sent && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <input
            style={input}
            type="email"
            placeholder="ваша почта"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <button style={btn} onClick={sendLink} disabled={busy}>
            {busy ? "Отправка…" : "Получить ссылку для входа"}
          </button>
          <button
            style={link}
            onClick={() => {
              setOpen(false);
              setMsg("");
            }}
          >
            отмена
          </button>
        </div>
      )}
      {msg && (
        <div style={{ fontSize: 13, color: "var(--ink-faint, #8089a0)", maxWidth: 380 }}>
          {msg}
        </div>
      )}
    </div>
  );
}
