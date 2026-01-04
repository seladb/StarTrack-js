import { test, expect } from "./setup";
import { localUrl } from "./utils";

test("GitHub Authentication", async ({ page }) => {
  expect(process.env.GH_ACCESS_TOKEN).toBeDefined();

  await page.goto(localUrl);
  await page.getByRole("button", { name: "GitHub Authentication" }).click();
  await page.getByLabel("GitHub Access Token *").fill(process.env.GH_ACCESS_TOKEN);
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("button", { name: process.env.GH_ACCESS_TOKEN.slice(-6) }).click();
  expect(page.getByRole("menuitem", { name: "Stored in session storage" })).toBeVisible();

  expect(await page.evaluate(() => sessionStorage)).toHaveProperty(
    "startrack_js_access_token",
    process.env.GH_ACCESS_TOKEN,
  );

  // Log out
  await page.getByRole("menuitem", { name: "Log out" }).click();
  expect(await page.evaluate(() => sessionStorage)["startrack_js_access_token"]).toBeUndefined();
  const gitHubAuthButton = page.getByRole("button", { name: "GitHub Authentication" });
  await gitHubAuthButton.waitFor({ state: "visible", timeout: 5000 });
  expect(gitHubAuthButton).toBeVisible();
});

test("GitHub Authentication Local Storage", async ({ page }) => {
  expect(process.env.GH_ACCESS_TOKEN).toBeDefined();

  await page.goto(localUrl);
  await page.getByRole("button", { name: "GitHub Authentication" }).click();
  await page.getByLabel("GitHub Access Token *").fill(process.env.GH_ACCESS_TOKEN);
  await page.getByText("Save access token in local storage").click();
  await page.getByRole("button", { name: "Login" }).click();

  await page.getByRole("button", { name: process.env.GH_ACCESS_TOKEN.slice(-6) }).click();
  expect(page.getByRole("menuitem", { name: "Stored in local storage" })).toBeVisible();

  expect(await page.evaluate(() => localStorage)).toHaveProperty(
    "startrack_js_access_token",
    process.env.GH_ACCESS_TOKEN,
  );
});
