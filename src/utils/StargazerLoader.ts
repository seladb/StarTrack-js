import * as gitHubUtils from "./GitHubUtils";
import * as stargazerStats from "./StargazerStats";
import * as stargazerLoader from "./StargazerLoader";
import RepoInfo from "./RepoInfo";

// Refer to post https://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans

let colorIndex = 0;

const hslToHex = (hue: number, saturation: number, lightness: number) => {
  lightness /= 100;
  const a = (saturation * Math.min(lightness, 1 - lightness)) / 100;
  const f = (n: number) => {
    const k = (n + hue / 30) % 12;
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const makeColor = () => {
  const hue = colorIndex * 137.508; // use golden angle approximation
  const saturation = 50;
  const lightness = 50;
  colorIndex++;

  return {
    hsl: `hsl(${hue},${saturation}%,${lightness}%)`,
    hex: hslToHex(hue, saturation, lightness),
  };
};

type HandleProgressCallback = (progress: number) => void;
type ShouldStopCallback = () => boolean;

export const loadStargazers = async (
  username: string,
  repo: string,
  handleProgress: HandleProgressCallback,
  shouldStop: ShouldStopCallback,
  forecastProps?: stargazerStats.ForecastProps,
): Promise<RepoInfo | null> => {
  const stargazerData = await gitHubUtils.loadStargazers(
    username,
    repo,
    handleProgress,
    shouldStop,
  );
  if (stargazerData === null) {
    return null;
  }
  colorIndex += 1;
  return {
    username: username,
    repo: repo,
    color: stargazerLoader.makeColor(),
    stargazerData: stargazerData,
    forecast: forecastProps && stargazerStats.calcForecast(stargazerData, forecastProps),
  };
};
