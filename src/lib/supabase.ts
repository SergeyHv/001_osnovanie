import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./supabaseConfig";

// Единый клиент Supabase для всего приложения.
// detectSessionInUrl: false — потому что сайт использует HashRouter и вход по коду,
// а не по ссылке-редиректу; так надёжнее и без конфликтов с адресами уроков.
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.publishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);
