import { test, expect } from "@playwright/test";
import { getComparator } from "playwright-core/lib/utils";
import { localUrl, referenceUrl, username, repo1, authenticate, getChartScreenshot } from "./utils";

test("Forecast", async ({ page }, testDir) => {
  const enableForecast = async () => {
    await page.getByRole("button", { name: "Do not show forecast" }).click();
    await page.getByTestId("backwardCount").fill("4");
    await page.getByTestId("forwardCount").fill("6");
    await page.getByTestId("pointCount").fill("150");
    await page.getByRole("button", { name: "Ok" }).click();
  };

  const takeReferenceScreenshots = async () => {
    await page.goto(referenceUrl);

    await authenticate(page);

    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Repo name").fill(repo1);
    await page.getByRole("button", { name: "Go!" }).click();
    await page.getByRole("button", { name: "Go!" }).waitFor({ state: "visible" });

    await enableForecast();

    return await getChartScreenshot(page, testDir.outputPath("forecast-reference.png"));
  };

  const expectedScreenshot = await takeReferenceScreenshots();

  await page.goto(localUrl);

  await authenticate(page);

  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Repo name").fill(repo1);
  await page.getByRole("button", { name: "Go!" }).click();
  await page.getByRole("button", { name: "Go!" }).waitFor({ state: "visible" });

  // Enable forecast
  await enableForecast();

  const screenshot = await getChartScreenshot(page, testDir.outputPath("forecast-actual.png"));
  await expect(
    page.getByRole("button", { name: "6 months forecast based on the last 4 months" }),
  ).toBeVisible();

  const comparator = getComparator("image/png");
  expect(comparator(expectedScreenshot, screenshot)).toBeNull();

  // Show forecast properties
  await page.getByRole("button", { name: "6 months forecast based on the last 4 months" }).click();

  expect(await page.getByTestId("backwardCount").inputValue()).toBe("4");
  expect(await page.getByTestId("forwardCount").inputValue()).toBe("6");
  expect(await page.getByTestId("pointCount").inputValue()).toBe("150");

  await page.getByRole("button", { name: "Cancel" }).click();

  // Disable forecast
  await page.getByTestId("CancelIcon").last().click();

  expect(page.getByRole("button", { name: "Do not show forecast" })).toBeVisible();
  const screenshotWithoutForecast = await getChartScreenshot(
    page,
    testDir.outputPath("without-forecast-actual.png"),
  );

  expect(comparator(screenshot, screenshotWithoutForecast)).not.toBeNull();
});
