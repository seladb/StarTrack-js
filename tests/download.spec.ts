import * as fs from "fs";
import { test, expect } from "./setup";
import { localUrl, username, repo1, authenticate } from "./utils";
import { parse } from "csv-parse/sync";

test("Download JSON Data", async ({ page }) => {
  await page.goto(localUrl);

  await authenticate(page);

  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Repo name").fill(repo1);
  await page.getByRole("button", { name: "Go!" }).click();
  await page.getByRole("button", { name: "Go!" }).waitFor({ state: "visible" });

  const downloadPromise = page.waitForEvent("download");
  await page.getByText("Download Data").click();
  const download = await downloadPromise;
  const downloadPath = download.suggestedFilename();
  await download.saveAs(downloadPath);
  const fileContent = JSON.parse(fs.readFileSync(downloadPath, "utf-8"));

  expect(fileContent).toBeDefined();
  expect(fileContent).toHaveProperty("username", username);
  expect(fileContent).toHaveProperty("repo", repo1);
  expect(fileContent.stargazerData.length).toBeGreaterThan(0);

  fs.unlinkSync(downloadPath);
});

test("Download CSV Data", async ({ page }) => {
  await page.goto(localUrl);

  await authenticate(page);

  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Repo name").fill(repo1);
  await page.getByRole("button", { name: "Go!" }).click();
  await page.getByRole("button", { name: "Go!" }).waitFor({ state: "visible" });

  await page.getByLabel("CSV").check();

  const downloadPromise = page.waitForEvent("download");
  await page.getByText("Download Data").click();
  const download = await downloadPromise;
  const downloadPath = download.suggestedFilename();
  await download.saveAs(downloadPath);

  const fileContent = fs.readFileSync(downloadPath, "utf-8");

  const parsedContent = parse(fileContent, {
    columns: true,
    skipEmptyLines: true,
  });

  expect(parsedContent).toBeDefined();
  expect(parsedContent.length).toBeGreaterThan(0);

  expect(parsedContent[0]).toHaveProperty("Star Count");
  expect(parsedContent[0]).toHaveProperty("Starred At");

  fs.unlinkSync(downloadPath);
});
