// cspell: ignore pickledb

import { Page } from "@playwright/test";
import internal from "stream";

export const localUrl = "http://127.0.0.1:4173/StarTrack-js/#/";
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

const readableToBuffer = (readable: internal.Readable): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Array<Buffer> = [];
    readable.on("data", (chunk) => chunks.push(chunk));
    readable.on("error", reject);
    readable.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

export const getChartScreenshot = async (page: Page, filename: string) => {
  const downloadPromise = page.waitForEvent("download");
  await page.locator(".modebar-btn").first().click();
  const download = await downloadPromise;
  console.log(__dirname);
  await download.saveAs(filename);
  return await readableToBuffer(await (await downloadPromise).createReadStream());
};
