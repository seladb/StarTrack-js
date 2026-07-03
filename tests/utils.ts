// cspell: ignore pickledb

import { Page } from "@playwright/test";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

export const localUrl = "http://localhost:3000/StarTrack-js/#/";
export const referenceUrl = "https://seladb.github.io/StarTrack-js/#/";

export const username = "seladb";
export const repo1 = "startrack-js";
export const repo2 = "pickledb-rs";

export const authenticate = async (page: Page) => {
  await page.getByRole("button", { name: "GitHub Authentication" }).click();
  await page.getByLabel("GitHub Access Token *").fill(process.env.GH_ACCESS_TOKEN);
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("button", { name: "Login" }).waitFor({ state: "detached" });
};

export const getChartScreenshot = async (page: Page, filename: string) => {
  const downloadPromise = page.waitForEvent("download");
  await page.locator(".modebar-btn").first().click();
  const download = await downloadPromise;
  console.log(__dirname);
  await download.saveAs(filename);
  return filename;
};

export const compareImages = (file1: string, file2: string) => {
  const img1 = PNG.sync.read(fs.readFileSync(file1));
  const img2 = PNG.sync.read(fs.readFileSync(file2));

  if (img1.width !== img2.width || img1.height !== img2.height) {
    throw new Error("Images have different dimensions");
  }

  const diff = new PNG({
    width: img1.width,
    height: img1.height,
  });

  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {
    threshold: 0.1,
  });

  return numDiffPixels;
};
