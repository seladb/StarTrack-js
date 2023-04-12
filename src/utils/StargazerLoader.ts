import * as gitHubUtils from "./GitHubUtils";
import * as stargazerStats from "./StargazerStats";
import * as stargazerLoader from "./StargazerLoader";

// Refer to post https://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans

let colorIndex = 0;

export const makeColor = () => {
  const hue = colorIndex * 137.508; // use golden angle approximation
  colorIndex++;
  return `hsl(${hue},50%,50%)`;
};

type HandleProgressCallback = (progress: number) => void;
type ShouldStopCallback = () => boolean;

export const loadStargazers = async (
  username: string,
  repo: string,
  handleProgress: HandleProgressCallback,
  shouldStop: ShouldStopCallback,
  forecastProps?: stargazerStats.ForecastProps,
) => {
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
    stats: stargazerStats.calcStats(stargazerData),
    forecast: forecastProps && stargazerStats.calcForecast(stargazerData, forecastProps),
  };
};
