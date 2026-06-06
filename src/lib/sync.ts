import { supabase } from "./supabase";
import type { Progress } from "./progress";

// Синхронизация ОБЫЧНОГО прогресса (пройденные уроки и баллы) с сервером.
// Тексты размышлений НЕ синхронизируются — они остаются только на устройстве.

const KEY = "osnovanie:progress:v1"; // тот же ключ, что и в progress.ts
const TABLE = "user_progress";

function readLocal(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

function writeLocal(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    // Сообщаем интерфейсу, что прогресс обновился.
    window.dispatchEvent(new Event("progress-changed"));
  } catch {
    /* ignore */
  }
}

/** Объединяет два набора прогресса: ничего не теряется, берётся лучшее. */
function mergeProgress(a: Progress, b: Progress): Progress {
  const out: Progress = { ...a };
  for (const [id, r] of Object.entries(b)) {
    const cur = out[id];
    if (!cur) {
      out[id] = r;
      continue;
    }
    out[id] = {
      score: Math.max(cur.score ?? 0, r.score ?? 0),
      passed: cur.passed || r.passed,
      at: cur.at > r.at ? cur.at : r.at,
    };
  }
  return out;
}

let currentUserId: string | null = null;
let pushTimer: number | undefined;
let started = false;

async function pull(): Promise<void> {
  if (!currentUserId) return;
  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("user_id", currentUserId)
    .maybeSingle();
  if (error) {
    console.warn("Синхронизация (чтение):", error.message);
    return;
  }
  const server: Progress = ((data?.data as Progress) ?? {}) as Progress;
  const merged = mergeProgress(readLocal(), server);
  writeLocal(merged);
  await push(); // вернуть объединённый прогресс на сервер
}

async function push(): Promise<void> {
  if (!currentUserId) return;
  const local = readLocal();
  const { error } = await supabase.from(TABLE).upsert({
    user_id: currentUserId,
    data: local,
    updated_at: new Date().toISOString(),
  });
  if (error) console.warn("Синхронизация (запись):", error.message);
}

function schedulePush(): void {
  if (!currentUserId) return;
  if (pushTimer) window.clearTimeout(pushTimer);
  pushTimer = window.setTimeout(() => {
    void push();
  }, 1500);
}

/** Запускается один раз при старте приложения. */
export function initSync(): void {
  if (started) return;
  started = true;

  supabase.auth.getSession().then(({ data }) => {
    currentUserId = data.session?.user?.id ?? null;
    if (currentUserId) void pull();
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    const newId = session?.user?.id ?? null;
    if (newId && newId !== currentUserId) {
      currentUserId = newId;
      void pull(); // вошёл — подтянуть и объединить
    } else if (!newId) {
      currentUserId = null; // вышел — больше не синхронизируем
    }
  });

  // Любое изменение прогресса на устройстве — отправляем на сервер (с задержкой).
  window.addEventListener("progress-changed", schedulePush);
}
