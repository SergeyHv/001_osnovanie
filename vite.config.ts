import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ВАЖНО для GitHub Pages:
// Если сайт публикуется по адресу https://<логин>.github.io/<имя-репо>/,
// то base должен быть '/<имя-репо>/'. По умолчанию здесь — '/osnovanie/'.
// Если используете собственный домен или репозиторий вида <логин>.github.io,
// поменяйте на '/'.
export default defineConfig({
  base: "/",
  plugins: [react()],
});
