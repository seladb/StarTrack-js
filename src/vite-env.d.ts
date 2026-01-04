// eslint-disable-next-line spaced-comment
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_TOKEN?: string;
  // Add other env variables here as you use them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
