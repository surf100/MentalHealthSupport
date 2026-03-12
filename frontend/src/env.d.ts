/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string; // твоя переменная окружения
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}