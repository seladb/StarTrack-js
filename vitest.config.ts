import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    exclude: [
      ...configDefaults.exclude, 
      'tests/**',
    ],
  },
});
