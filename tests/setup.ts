// tests/setup.ts
import { test as base } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    page.on("console", msg => console.log("Browser console:", msg.type(), msg.text()));
    page.on("pageerror", err => console.log("Browser error:", err.message));
    await use(page);
  },
});

export { expect } from "@playwright/test";
