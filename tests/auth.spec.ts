import { test, expect } from "@playwright/test";
import { localUrl } from "./utils";

test("GitHub Authentication", async ({ page }) => {
  expect(process.env.GITHUB_ACCESS_TOKEN).toBeDefined();

  await page.goto(localUrl);
  await page.getByRole("button", { name: "GitHub Authentication" }).click();
  await page.getByLabel("GitHub Access Token *").fill(process.env.GITHUB_ACCESS_TOKEN);
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("button", { name: process.env.GITHUB_ACCESS_TOKEN.slice(-6) }).click();
  expect(page.getByRole("menuitem", { name: "Stored in session storage" })).toBeVisible();

  expect(await page.evaluate(() => sessionStorage)).toHaveProperty(
    "startrack_js_access_token",
    process.env.GITHUB_ACCESS_TOKEN,
  );

  // Log out
  await page.getByRole("menuitem", { name: "Log out" }).click();
  expect(await page.evaluate(() => sessionStorage)["startrack_js_access_token"]).toBeUndefined();
  expect(page.getByRole("button", { name: "GitHub Authentication" })).toBeVisible();
});

test("GitHub Authentication Local Storage", async ({ page }) => {
  expect(process.env.GITHUB_ACCESS_TOKEN).toBeDefined();

  await page.goto(localUrl);
  await page.getByRole("button", { name: "GitHub Authentication" }).click();
  await page.getByLabel("GitHub Access Token *").fill(process.env.GITHUB_ACCESS_TOKEN);
  await page.getByText("Save access token in local storage").click();
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("button", { name: process.env.GITHUB_ACCESS_TOKEN.slice(-6) }).click();
  expect(page.getByRole("menuitem", { name: "Stored in local storage" })).toBeVisible();

  expect(await page.evaluate(() => localStorage)).toHaveProperty(
    "startrack_js_access_token",
    process.env.GITHUB_ACCESS_TOKEN,
  );
});
