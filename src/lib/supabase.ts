import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./supabaseConfig";

// Единый клиент Supabase для всего приложения.
// detectSessionInUrl: true — чтобы при возврате по ссылке из письма
// клиент сам нашёл «билет» входа в адресе и завершил авторизацию.
// flowType: "implicit" — билет приходит в hash-части адреса; это
// корректно работает вместе с нашей ручной обработкой в App.
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.publishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "implicit",
    },
  },
);
