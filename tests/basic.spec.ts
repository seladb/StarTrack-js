// cspell: ignore nsewdrag

import { test, expect } from "@playwright/test";
import { getComparator } from "playwright-core/lib/utils";
import {
  localUrl,
  referenceUrl,
  username,
  repo1,
  repo2,
  authenticate,
  getChartScreenshot,
} from "./utils";

test("Basic Flow", async ({ page }, testDir) => {
  const getGridStarsCount = async (rowNum: number) => {
    return Number(
      await page.getByRole("row").nth(rowNum).getByRole("gridcell").nth(1).textContent(),
    );
  };

  const takeReferenceScreenshots = async () => {
    await page.goto(referenceUrl);

    await authenticate(page);

    const screenshots: Buffer[] = [];

    // Get screenshot for repo1
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Repo name").fill(repo1);
    await page.getByRole("button", { name: "Go!" }).click();
    await page.getByRole("button", { name: "Go!" }).waitFor({ state: "visible" });

    screenshots.push(await getChartScreenshot(page, testDir.outputPath("repo1-reference.png")));

    // Get screenshot for repo1 + repo2
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Repo name").fill(repo2);
    await page.getByRole("button", { name: "Go!" }).click();
    await page.getByRole("button", { name: "Go!" }).waitFor({ state: "visible" });

    screenshots.push(await getChartScreenshot(page, testDir.outputPath("repo1and2-reference.png")));

    return screenshots;
  };

  const expectedScreenshots = await takeReferenceScreenshots();

  await page.goto(localUrl);

  await authenticate(page);

  const screenshots: Buffer[] = [];

  // Get stats for repo1
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Repo name").fill(repo1);
  await page.getByRole("button", { name: "Go!" }).click();
  await expect(page.getByRole("button", { name: `${username} / ${repo1}` }).first()).toBeVisible();
  await expect(
    page.getByRole("gridcell", { name: `${username} / ${repo1}` }).getByRole("button"),
  ).toBeVisible();
  await expect(page.getByRole("textbox").last()).toHaveValue(
    `${localUrl}preload?r=${username},${repo1}`,
  );
  screenshots.push(await getChartScreenshot(page, testDir.outputPath("repo1-actual.png")));

  // Get stats for repo2
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Repo name").fill(repo2);
  await page.getByRole("button", { name: "Go!" }).click();
  await expect(page.getByRole("button", { name: `${username} / ${repo1}` }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: `${username} / ${repo2}` }).first()).toBeVisible();
  await expect(
    page.getByRole("gridcell", { name: `${username} / ${repo1}` }).getByRole("button"),
  ).toBeVisible();
  page.getByRole("row").first().first();
  await expect(
    page.getByRole("gridcell", { name: `${username} / ${repo2}` }).getByRole("button"),
  ).toBeVisible();
  await expect(page.getByRole("textbox").last()).toHaveValue(
    `${localUrl}preload?r=${username},${repo1}&r=${username},${repo2}`,
  );
  screenshots.push(await getChartScreenshot(page, testDir.outputPath("repo1and2-actual.png")));

  const comparator = getComparator("image/png");
  screenshots.forEach((screenshot, index) => {
    expect(comparator(expectedScreenshots[index], screenshot)).toBeNull();
  });

  const gridStarsCountRepo1 = await getGridStarsCount(1);
  const gridStarsCountRepo2 = await getGridStarsCount(2);

  // Sync stats to chart data
  await page.getByLabel("Sync stats to chart zoom level").check();
  await expect(page.getByText("Date range")).not.toBeVisible();
  await page.locator(".nsewdrag").scrollIntoViewIfNeeded();
  const chartBoundingBox = await page.locator(".nsewdrag").boundingBox();
  expect(chartBoundingBox).not.toBeNull();
  if (chartBoundingBox) {
    await page.mouse.move(
      chartBoundingBox?.x + chartBoundingBox?.width / 2,
      chartBoundingBox?.y + chartBoundingBox?.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      chartBoundingBox?.x + chartBoundingBox?.width / 2 + 150,
      chartBoundingBox?.y + chartBoundingBox?.height / 2,
    );
    await page.mouse.up();
  }
  await expect(page.getByText("Date range")).toBeVisible();
  expect(await getGridStarsCount(1)).toBeLessThan(gridStarsCountRepo1);
  expect(await getGridStarsCount(2)).toBeLessThan(gridStarsCountRepo2);

  // Remove repo2
  await page.getByTestId("CancelIcon").last().click();
  const screenshotWithRepo1 = await getChartScreenshot(
    page,
    testDir.outputPath("repo1b-actual.png"),
  );
  expect(comparator(screenshots[0], screenshotWithRepo1)).toBeNull();

  // Remove repo1
  await page.getByTestId("CancelIcon").last().click();
  const chartElement = page.locator(".nsewdrag");
  const gridElement = page.getByRole("gridcell");
  await chartElement.waitFor({ state: "hidden", timeout: 5000 });
  await gridElement.waitFor({ state: "hidden", timeout: 5000 });
  expect(chartElement).not.toBeVisible();
  expect(gridElement).not.toBeVisible();
  expect(page.getByText("Download Data")).not.toBeVisible();
});
